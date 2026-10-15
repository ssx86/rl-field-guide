import type { ChineseManuscript } from "@/content/zh-manuscripts/types";

export const ZH_MANUSCRIPT = {
  "title": "让演员行动，让评论家判断“比平常好多少”",
  "deck": "Actor–Critic 用价值估计替策略提供低方差学习信号；GAE 再调节这份信号依赖自举还是长回报。",
  "openingQuestion": "怎样不等回合结束，就告诉策略刚才的动作是否值得重复？",
  "bridge": "REINFORCE 用完整回报减去基线。若基线本身由一个随时更新的价值函数承担，策略每观察几步就能得到近似优势，这便是 actor–critic。",
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
    "title": "从同一条转移得到 actor 与 critic 两个信号",
    "setup": "当前价值 V(Sₜ)=5，即时奖励为 1，下一状态价值 V(Sₜ₊₁)=6，折扣因子 γ=0.9，而且这条转移尚未终止。",
    "prediction": "判断采样动作应变得更常见还是更少见，并指出 critic 的哪个预测需要上调。",
    "steps": [
      {
        "label": "构造自举目标",
        "explanation": "转移尚未终止，因此把奖励 1 与折扣后的下一状态价值 0.9×6 相加，critic 的目标为 6.4。"
      },
      {
        "label": "计算 TD 残差",
        "explanation": "当前价值预测是 5，实际目标高出 1.4，说明结果比 critic 对 Sₜ 的预期更好。"
      },
      {
        "label": "更新 actor",
        "explanation": "正的 1.4 乘上采样动作的对数概率梯度，会提高该动作在相似状态下的概率。"
      },
      {
        "label": "更新 critic",
        "explanation": "Critic 用自己的损失把 Vφ(Sₜ) 向 6.4 推近；这条优化路径与策略损失应分别监控。"
      }
    ],
    "result": "一个 TD 残差同时提供两条学习信号，但 critic 的偏差会直接影响 actor 的更新方向，因此价值损失、策略损失与熵必须分开观察。"
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
      "read": "TD 残差等于奖励加折扣下一价值，再减去当前价值。",
      "meaning": "它是一步自举优势信号；终止时下一价值项必须按语义处理。"
    },
    {
      "read": "GAE 将当前及以后 TD 残差按 γλ 的幂次加权。",
      "meaning": "λ 越大，更远的真实结果影响越强，也通常带来更高方差。"
    }
  ],
  "boundary": {
    "title": "评论家可以自信地说错",
    "paragraphs": [
      "Critic 损失低可能只说明拟合了自身自举目标；策略性能和校准仍需单独检查。",
      "GAE 无法补回从未探索到的奖励，也不能修复错误奖励函数或部分可观测状态。"
    ]
  },
  "nextBridge": "有了低方差优势，同一批轨迹可以多更新几次；但策略移动太远后，旧数据就不再代表新策略。TRPO 与 PPO 处理的正是这段距离。"
} satisfies ChineseManuscript;
