import type { ChineseManuscript } from "@/content/zh-manuscripts/types";

export const ZH_MANUSCRIPT = {
  "title": "等不到终局，就先请一个评论家估计常态",
  "deck": "Actor 继续负责行动，critic 学习每个状态通常能得到的回报。一步 TD 误差让策略提前收到反馈，GAE 再决定这份反馈要相信 critic 多一点，还是等待更长的真实后果。",
  "openingQuestion": "一项动作刚做完、回合还远未结束，我们能不能先判断它比当时的常态好还是差？",
  "bridge": "REINFORCE 已经用基线把绝对回报改成‘比常态好多少’，可若常态只能等整条轨迹结束后估计，反馈仍然很慢。下一步自然是专门训练一个价值函数，让它在每个状态随时给出常态预测。",
  "situation": {
    "title": "两个学习者共用一条轨迹，也会互相带偏",
    "paragraphs": [
      "Actor 产生动作，critic 估计状态价值。一步 TD 误差同时包含即时奖励、下一价值和当前价值，可作为优势的局部信号。",
      "GAE 把一串 TD 误差按 γλ 衰减相加。λ 小，更依赖 critic、自举偏差可能更大；λ 大，更接近长回报、方差通常更高。",
      "Critic 不是中立裁判。它训练不足、尺度失衡或在数据外外推时，会把系统性错误交给 actor；actor 又改变数据，让 critic 面对新分布。"
    ]
  },
  "diagram": {
    "title": "一条轨迹上的双向依赖",
    "caption": "策略损失、价值损失与熵项服务不同目标，应分别监控而非只看总损失。",
    "items": [
      {
        "label": "Actor",
        "value": "πθ(a|s)",
        "note": "产生行为并记录旧概率。"
      },
      {
        "label": "Critic",
        "value": "Vφ(s)",
        "note": "估计策略当前的常态表现。"
      },
      {
        "label": "优势",
        "value": "GAE(γ,λ)",
        "note": "沿 TD 误差聚合近期未来。"
      },
      {
        "label": "联合更新",
        "value": "policy + value + entropy",
        "note": "三项系数控制不同学习压力。"
      }
    ]
  },
  "workedExample": {
    "title": "一条转移，同时交给演员和评论家两份不同作业",
    "setup": "当前价值 V(Sₜ)=5，即时奖励为 1，下一状态价值 V(Sₜ₊₁)=6，折扣因子 γ=0.9，而且这条转移尚未终止。",
    "prediction": "下一状态看起来比当前预期更有希望。先判断这次动作应被鼓励还是压低，再判断 critic 自己要修正哪一个状态的估值。",
    "steps": [
      {
        "label": "先借下一状态估计未完的未来",
        "explanation": "任务尚未终止，奖励 1 后仍有未来。把下一状态价值 6 折扣后接上，得到当前状态的一步目标 6.4。"
      },
      {
        "label": "用新目标挑战旧常态",
        "explanation": "Critic 原先把 Sₜ 估为 5，新目标高出 1.4。这 1.4 就是一步 TD 残差，也是在当前近似下的优势信号。"
      },
      {
        "label": "Actor 接收方向",
        "explanation": "残差为正，表示这次采样动作带来的转移比 critic 预期更好。Actor 因而提高该动作在类似状态下的对数概率。"
      },
      {
        "label": "Critic 修正自己的常态",
        "explanation": "Critic 的任务不是重复更新动作概率，而是把 Vφ(Sₜ) 从 5 向 6.4 拉近。两条损失使用同一经验，却服务不同对象。"
      }
    ],
    "result": "1.4 既告诉 actor 这次动作值得增加概率，也告诉 critic 自己低估了 Sₜ。但若 critic 的 5 或 6 本来就严重失真，这两份作业会一起被带偏。"
  },
  "mechanism": {
    "introduction": "Actor–Critic 的稳定来自角色分工，不来自某个单独损失自动正确。",
    "sections": [
      {
        "title": "Critic 用近似偏差换取更低方差",
        "paragraphs": [
          "Critic 学习 Vφ(s)，让 actor 不必等到回合结束就能判断动作比当前常态好多少，也让不同状态的绝对回报尺度不再直接支配更新。代价是优势信号开始依赖一个近似模型：critic 训练不足或系统性外推错误时，有限样本优势的大小甚至符号都可能被扭曲。价值裁剪、归一化、独立学习率和 explained variance 只是诊断与稳定手段，不能把 critic 变成无偏裁判；价值损失、策略表现和校准应分开检查。"
        ]
      },
      {
        "title": "A2C 与 A3C 的差异在系统时序",
        "paragraphs": [
          "A2C 等待多个 worker 收集完一批 rollout，再把它们合并成同步更新，数据版本较整齐，也更容易映射到 GPU 批处理。A3C 则让 worker 异步行动并把梯度写回共享参数，轨迹相关性被不同环境打散，却会出现用旧参数算出的陈旧梯度。两者都属于 advantage actor–critic，异步并不是 actor–critic 的定义；比较结果时要同时报告 worker 数、同步方式、批量大小和实际样本年龄。"
        ]
      },
      {
        "title": "GAE 是 TD 误差的指数滤波",
        "paragraphs": [
          "GAE 把当前及以后的一串 TD 残差按 (γλ) 的幂衰减相加，因此较远一步的好坏仍会影响当前优势。λ 接近零时更依赖 critic 的一步自举，方差通常较低但近似偏差可能更强；λ 接近一时纳入更长的采样未来，噪声也往往增多。真正控制衰减的是 γλ，所以 λ 不能脱离折扣因子与 rollout 截断方式单独解释，终止和超时掩码也必须保持正确。"
        ]
      },
      {
        "title": "共享骨干会耦合梯度",
        "paragraphs": [
          "Actor 与 critic 常共用早期表示，再分别接策略头和价值头，这让同一批数据可以高效学习两项任务。耦合也意味着价值损失的强梯度可能破坏策略需要的特征，而策略快速改变又会使 critic 的目标分布移动。总损失下降可能只是其中一项占据主导；应分别记录策略损失、价值损失、熵、梯度范数和行为表现。"
        ]
      }
    ]
  },
  "equations": [
    {
      "read": "一步 TD 残差用奖励加折扣后的下一状态价值，再减去 critic 对当前状态的价值预测。",
      "meaning": "正值表示这一步结果好于 critic 的常态预期，负值表示更差。它借用了下一状态估计，因此更及时，也继承 critic 的偏差。"
    },
    {
      "read": "GAE 从当前 TD 残差开始，把后续残差按 (γλ) 的幂逐渐衰减后相加。",
      "meaning": "λ 小时更信任近期自举，通常方差低而偏差更受 critic 影响；λ 大时等待更长的真实未来，通常方差更高。真正的衰减率是 γλ。"
    }
  ],
  "boundary": {
    "title": "评论家不是裁判，只是另一个仍在学习的模型",
    "paragraphs": [
      "Critic 损失低，可能只是它很好地拟合了自己构造的自举目标。价值预测是否校准、策略是否真的改善，必须分别用回报与冻结评估核对。",
      "GAE 只在已经观察到的轨迹上重新组织时间信用。它找不到从未探索到的奖励，也不能修复错误奖励函数或缺少关键信息的状态表示。"
    ]
  },
  "nextBridge": "Critic 与 GAE 让一批轨迹提供了更及时、方差更低的优势，于是我们自然想多训练几轮。可每更新一轮，actor 都离生成这批数据的旧策略更远；优势还是旧数据算出来的，它还能代表新策略多久？TRPO 与 PPO 就从这段不断扩大的距离出发。",
  "narrative": [
    { "type": "section", "id": "why-waiting-for-the-end-is-expensive", "title": "REINFORCE 的常态来得太晚", "paragraphs": [
      "上一章已经知道，一项动作不该因为绝对回报高就被鼓励，而要看它是否好于当时的常态。可纯 REINFORCE 往往等到回合结束，才用完整后续回报估计这份差异。长回合里，许多随机事件混在一起，反馈既慢又抖。",
      "如果另有一个函数 Vφ(s)，能在动作发生时就估计‘从这个状态继续，通常能拿到多少’，我们便不必完全等到终局。策略 πθ 负责演出，价值函数 Vφ 负责估计常态，于是有了 actor 与 critic 的分工。"
    ] },
    { "type": "section", "id": "one-transition-two-lessons", "title": "同一条转移，两个学习者读到的不是同一课", "paragraphs": [
      "Critic 看到奖励和下一状态，用它们构造当前状态的一步 TD 目标；目标减去当前价值，得到 TD 残差。对 critic 来说，这个残差说明自己的状态预测该往哪里修。对 actor 来说，它近似说明刚才的动作让结果高于还是低于常态。",
      "一份数值因此分出两条优化路径：actor 调整动作概率，critic 调整价值预测。它们可以共享早期网络表示，却不能把损失混成一个无法解释的总数。价值损失下降、策略损失变化和熵收缩分别意味着不同事情。"
    ] },
    { "type": "worked-example" },
    { "type": "section", "id": "the-critic-buys-speed-with-bias", "title": "更早得到答案，是用近似偏差换来的", "paragraphs": [
      "一步 TD 不再等待后续真实奖励全部出现，而是用 critic 对下一状态的估值补完未来。这通常显著降低方差，却把 critic 的错误直接送进 actor。评论家若系统性高估某类状态，actor 可能认真地朝错误方向更新。",
      "Actor 随后改变行为，又让 critic 下一批看到的数据分布发生变化。两者并不是一个稳定老师带一个学生，而是两个仍在学习的系统互相提供信号。价值 explained variance、校准、策略回报与梯度范数都需要单独看。"
    ] },
    { "type": "equations" },
    { "type": "section", "id": "gae-builds-a-continuum", "title": "一步太依赖评论家，整段又太噪，GAE 把中间铺成一条路", "paragraphs": [
      "只用当前 TD 残差，相当于很快相信 critic；等更长回报，则让更多真实奖励进入优势估计。GAE 把当前及后续一串 TD 残差按 γλ 衰减相加，让 λ 控制这两端之间的位置。",
      "λ 接近 0 时，远处残差很快消失，信号及时而更依赖价值近似；λ 接近 1 时，较远后果仍有分量，偏差通常减弱、方差通常上升。不能脱离 γ 与 rollout 截断单独解释 λ，因为真正决定远处权重的是 γλ，终止掩码写错还会把不存在的未来接进来。"
    ] },
    { "type": "section", "id": "synchronous-or-asynchronous-is-a-system-choice", "title": "A2C 与 A3C 的差别，不是有没有评论家", "paragraphs": [
      "A2C 等待多个 worker 收齐一批 rollout 后同步更新，数据版本较整齐，也方便批处理。A3C 让 worker 异步收集并把梯度写回共享参数，能打散轨迹相关，却会产生基于旧参数的陈旧梯度。",
      "两者都属于 advantage actor–critic。同步方式解决的是系统时序，而不是重新定义 actor–critic。比较时必须连同 worker 数、样本年龄、批量大小和实际吞吐一起报告。"
    ] },
    { "type": "boundary" }
  ]
} satisfies ChineseManuscript;
