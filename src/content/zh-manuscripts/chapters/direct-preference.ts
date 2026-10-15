import type { ChineseManuscript } from "@/content/zh-manuscripts/types";

export const ZH_MANUSCRIPT = {
  "title": "如果比较已经在手，能不能绕开奖励模型与 PPO",
  "deck": "DPO 把一对偏好直接翻译成策略概率的相对移动；IPO、KTO、ORPO 与 SimPO 则分别处理间隔失控、非配对反馈、参考模型成本和长度偏差。流程变短了，证据并没有变多。",
  "openingQuestion": "我们真正想要的是 chosen 比 rejected 更容易出现，为什么还要先造一个标量奖励，再让在线策略去追它？",
  "bridge": "上一章那条长流水线有两次明显的中转：偏好先被奖励模型外推成分数，分数再通过 rollout、critic 与 PPO 返回策略。直接偏好方法尝试把中间层折叠掉，从固定比较数据直接约束策略；因此它更像一个离线的偏好目标，而不是把所有后训练都重新命名为在线 RL。",
  "situation": {
    "title": "简化了流水线，没有消除数据假设",
    "paragraphs": [
      "DPO 提高 chosen 相对 rejected 的隐式奖励差。参考模型提供锚点，β 控制偏好拟合与策略漂移。",
      "训练像分类，不需在线 rollout、价值头或 GAE，因此工程更稳定；但数据仍由某个旧策略产生，无法展示新策略在未见回复上的偏好。",
      "长度、格式和候选难度会影响对数概率总和。若 chosen 普遍更长，模型可能学到数据偏差而非内容质量。"
    ]
  },
  "diagram": {
    "title": "一对偏好怎样进入 DPO",
    "caption": "要同时计算策略与参考模型对两条完整回复的条件 log-prob。",
    "items": [
      {
        "label": "提示",
        "value": "x",
        "note": "两条回复共享同一条件。"
      },
      {
        "label": "偏好对",
        "value": "y⁺, y⁻",
        "note": "chosen 与 rejected。"
      },
      {
        "label": "相对变化",
        "value": "logπ−logπref",
        "note": "参考模型作锚。"
      },
      {
        "label": "分类损失",
        "value": "−log σ(βΔ)",
        "note": "提高偏好间隔。"
      }
    ]
  },
  "workedExample": {
    "title": "两条回复都变得更可能，偏好方向仍然可以是对的",
    "setup": "chosen 在当前策略下的 log-prob 是 −2.2，在参考策略下是 −3.0；rejected 的对应数值是 −2.3 与 −2.5。先不要只看谁的绝对概率大，而要看两条回复相对各自参考点移动了多少。",
    "prediction": "当前策略同时抬高了两条回复。它究竟是在靠近 chosen，还是只是把整个区域一起抬高？",
    "steps": [
      {
        "label": "量 chosen 的移动",
        "explanation": "−2.2−(−3.0)=+0.8。chosen 在当前策略中比在参考策略中更容易出现，而且提升幅度是 0.8 个 log-prob 单位。"
      },
      {
        "label": "再量 rejected 的移动",
        "explanation": "−2.3−(−2.5)=+0.2。rejected 也被抬高了，所以只检查它是否下降会得出错误结论；这里真正重要的是两者移动幅度的差。"
      },
      {
        "label": "比较两次移动",
        "explanation": "+0.8−(+0.2)=+0.6。参考策略提供共同锚点后，正间隔说明当前策略确实更偏向 chosen，而不是仅仅把两条回复一起变得更常见。"
      },
      {
        "label": "把间隔送进损失",
        "explanation": "DPO 用 β 缩放 0.6，再通过 log-sigmoid 奖励正确方向。β 改变的是隐式奖励与参考约束的尺度，不应被当成一个普通学习率。"
      }
    ],
    "result": "chosen 相对参考移动 +0.8，rejected 移动 +0.2，因此偏好间隔为 +0.6。这个结果也解释了 DPO 的观察单位：它关心一对回复相对参考策略怎样重新排序，而不是要求 rejected 的绝对概率每次都下降。"
  },
  "mechanism": {
    "introduction": "直接偏好优化改变了训练路径，不改变证据来源。",
    "sections": [
      {
        "title": "DPO 来自 KL 正则化最优策略",
        "paragraphs": [
          "DPO 利用 KL 正则化 RL 的最优策略关系，把未知奖励差改写成当前策略相对参考模型的 log-ratio 差。于是训练可直接比较 chosen 与 rejected，无需先拟合一个可读取的标量奖励模型，也无需在线运行 PPO。这个推导依赖特定的奖励—策略关系和成对偏好假设；工程流程变短，不代表这些统计假设消失。"
        ]
      },
      {
        "title": "IPO 把偏好写成有限间隔回归",
        "paragraphs": [
          "IPO 不让偏好 log-ratio 像可分分类那样不断增大，而是把它回归到由正则强度决定的有限目标间隔。这样可减轻确定性偏好标签或噪声数据推动策略无限远离参考模型的倾向，也让过拟合表现得更可诊断。它仍依赖成对数据与参考策略，目标间隔也不是客观质量尺度；若候选分布过时，稳定回归同样无法回答新输出是否更好。"
        ]
      },
      {
        "title": "KTO 可使用非配对的好坏反馈",
        "paragraphs": [
          "KTO 把单条回复的 desirable 或 undesirable 标签，与策略相对参考模型的隐式效用和一个基准点比较，因此不要求每个提示都恰好有 chosen/rejected 配对。它适合产品日志里零散的点赞、拒绝或安全标签，却需要处理两类样本数量与损失权重，标签含义不一致时基准也会漂移。减少配对要求只是改变监督格式，不会补出标签没覆盖的事实性和长期后果。"
        ]
      },
      {
        "title": "ORPO 与 SimPO 走 reference-free 路线",
        "paragraphs": [
          "ORPO 在监督似然之外加入偏好赔率差，让模型既学习 chosen 文本又拉开 chosen 与 rejected；SimPO 则用长度归一化的策略 log-prob 和显式目标间隔训练，不必在每步读取参考模型。省去 reference forward 可降低显存与计算，却不等于没有锚点假设，长度归一化和间隔本身就在规定偏好几何。比较这些方法要统一候选、长度和新鲜盲评，不能仅以训练损失或缩写宣称普遍更强。"
        ]
      }
    ]
  },
  "equations": [
    {
      "read": "DPO 先计算 chosen 与 rejected 各自的策略—参考 log-ratio，再对两者之差做 sigmoid 分类。",
      "meaning": "它直接鼓励偏好间隔朝正确方向变化，不训练一个可单独读取的奖励模型，也不需要用当前策略在线采样后再跑 PPO。"
    },
    {
      "read": "SimPO 用回复的总 log-prob 除以 token 数，得到当前策略下的平均 token 分数，再用显式边际比较 chosen 与 rejected。",
      "meaning": "长度归一化减少长回复因连乘而天然积累更多负 log-prob 的影响，目标边际规定两者至少分开多少；它仍是固定数据上的直接训练目标。"
    }
  ],
  "boundary": {
    "title": "固定比较只能约束它见过的那片空间",
    "paragraphs": [
      "模型可以在训练对上持续拉大间隔，却在自由生成时组合出数据中从未出现的新型退化。训练更稳定，只说明固定样本上的梯度更直接，并不等于部署时的行为更可靠。",
      "如果偏好数据没有覆盖事实正确性、安全边界或长期交互后果，DPO 及其变体都不能从概率损失里补出这些目标。策略变化后，新的候选仍需要重新采样、重新比较和独立验收。"
    ]
  },
  "nextBridge": "直接目标省掉了若干计算环节，却没有回答最上游的问题：chosen 与 rejected 到底由谁判定。当人工比较成为成本瓶颈，人们会把大量判断交给另一个模型；下一章要追踪的，正是 judge 的偏好、盲点与可被操纵之处怎样随规模一起进入训练。",
  "narrative": [
    { "type": "section", "id": "collapse-the-middle-of-rlhf", "title": "先问我们真正需要从一对数据里拿走什么", "paragraphs": [
      "一条训练记录只说：在提示 x 下，chosen 胜过 rejected。若目标只是让策略以后更偏向 chosen，那么先拟合一个能给所有文本打分的奖励模型，再让 PPO 在线寻找高分回复，确实可能是一段过长的绕路。",
      "DPO 从 KL 正则化目标的最优策略关系出发，把未知奖励差改写成策略相对参考策略的 log-ratio 差。这样，同一对文本就能直接告诉参数应把相对概率往哪边推，不再需要 reward rollout、critic 或 GAE。",
      "但训练路径缩短，不代表证据升级了。参考策略选谁、β 取多大、偏好对由哪个旧策略生成，以及 chosen 是否系统性更长，都会进入这次看似普通的分类更新。"
    ] },
    { "type": "worked-example" },
    { "type": "equations" },
    { "type": "section", "id": "variants-answer-different-objections", "title": "这些缩写不是菜单，而是在修补不同的裂缝", "paragraphs": [
      "当偏好数据几乎可分时，DPO 的 logistic 目标会继续扩大间隔，模型可能被推得过远；IPO 因此把间隔回归到有限目标。它解决的是间隔失控问题，而不是笼统地成为一个“更安全的 DPO”。",
      "产品日志里常只有某条回复被点赞或被拒绝，并不存在严格配对；KTO 改用非配对的 desirable/undesirable 标签，并围绕参考策略的基准组织得失。它减少了配对要求，却更依赖类别比例、标签口径和正负样本权重。",
      "若参考模型的额外前向计算成为负担，ORPO 把 chosen 的监督似然与偏好赔率项合在一起，SimPO 则用长度归一化的平均 log-prob 和显式边际比较两条回复。所谓 reference-free 只是改变锚点的写法，不等于模型从此不会漂移。"
    ] },
    { "type": "section", "id": "offline-objective-has-an-offline-ceiling", "title": "离线目标最安静的地方，也正是它看不见的地方", "paragraphs": [
      "固定数据让训练省去在线采样，损失曲线也更容易稳定，可它只能重新排列数据支持范围内的行为。策略更新后会生成新的措辞、长度与失败模式，而训练集不会自动回来告诉我们这些新输出是否仍受偏好。",
      "所以比较直接偏好方法时，不能只看训练准确率或同一批 pair 上的间隔。必须统一生成设置，检查长度与格式偏差，再让新鲜的盲评、事实指标和安全测试评价自由生成结果；否则只是证明模型更会回答旧考题。"
    ] },
    { "type": "boundary" }
  ]
} satisfies ChineseManuscript;
