import type { ChineseManuscript } from "@/content/zh-manuscripts/types";

export const ZH_MANUSCRIPT = {
  "title": "跳过显式奖励模型，直接移动偏好概率",
  "deck": "DPO 把 KL 正则化 RL 的最优策略关系改写成分类损失；实现更简洁，却仍受偏好数据支持、参考模型和离线分布限制。",
  "openingQuestion": "只凭 chosen 与 rejected，能否直接训练策略而不运行在线 PPO？",
  "bridge": "RLHF 先把偏好压成 reward，再由策略优化器读取。直接偏好方法把两步合并，对策略与参考模型的相对对数概率做监督。",
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
    "title": "计算 DPO 的相对偏好间隔",
    "setup": "chosen 回复在当前策略下 log-prob 为 −2.2、参考模型下为 −3.0；rejected 分别为 −2.3 与 −2.5。",
    "prediction": "相对参考模型，当前策略是否把 chosen 提升得比 rejected 更多？",
    "steps": [
      {
        "label": "Chosen 的相对变化",
        "explanation": "当前策略的 −2.2 减参考模型的 −3.0，得到 +0.8，说明 chosen 相对参考更可能。"
      },
      {
        "label": "Rejected 的相对变化",
        "explanation": "rejected 的对应变化为 +0.2；它也更可能，但提升幅度较小。"
      },
      {
        "label": "相对间隔",
        "explanation": "chosen 的 +0.8 再减 rejected 的 +0.2，得到 +0.6，策略相对地向 chosen 偏移。"
      },
      {
        "label": "DPO 分类得分",
        "explanation": "β 缩放 0.6 的间隔后进入 log-sigmoid；它改变目标敏感度，而不是普通学习率。"
      }
    ],
    "result": "chosen 的相对变化为 +0.8，rejected 为 +0.2，偏好间隔为 +0.6。DPO 优化的是成对的相对变化，而不是只看 chosen 的绝对概率。"
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
      "read": "DPO 比较 chosen 与 rejected 的策略—参考 log-ratio 差，并通过 sigmoid 分类。",
      "meaning": "损失鼓励相对偏好，不直接拟合一个可独立读取的奖励分数。"
    },
    {
      "read": "SimPO 用当前策略下每个 token 的平均对数概率给回复打分，再用边际比较 chosen 与 rejected。",
      "meaning": "长度归一化减轻原始序列长度偏差，目标边际控制所需分离；标准形式仍是固定数据上的直接目标。"
    }
  ],
  "boundary": {
    "title": "离线分类稳定，不等于在线行为可靠",
    "paragraphs": [
      "模型可在训练对上提高间隔，却在自由生成时产生新型退化。",
      "偏好数据不覆盖事实正确、安全和长期交互时，DPO 也无法从损失中补出这些目标。"
    ]
  },
  "nextBridge": "偏好标签也可由模型评审生成。下一章讨论 RLAIF、宪法式规则与 judge 的偏差怎样进入训练闭环。"
} satisfies ChineseManuscript;
