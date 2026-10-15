import type { ChineseManuscript } from "@/content/zh-manuscripts/types";

export const ZH_MANUSCRIPT = {
  "title": "RLHF 的三段流水线，任何一段都可能带偏下一段",
  "deck": "SFT 提供初始策略，偏好数据训练奖励模型，PPO 再优化该模型并受 KL 约束。最终能力受三份数据与三套误差共同限制。",
  "openingQuestion": "奖励模型更喜欢一条回复，PPO 应该把它的概率提高多少？",
  "bridge": "上一章把回复看成轨迹。RLHF 把人类比较转换成可重复评分，再用在策略方法更新整条生成分布。",
  "situation": {
    "title": "人类只比较两条回复，策略却会探索成千上万种新回复",
    "paragraphs": [
      "奖励模型学习同一提示下 chosen 比 rejected 得分高。它在标注分布附近可能可靠，PPO 优化后却会主动寻找模型从未见过的高分区域。",
      "策略 rollout 记录旧 log-prob，价值头估计基线，GAE 形成 token 优势，PPO-Clip 复用批次；参考模型 KL 抑制过度漂移。",
      "奖励上涨、KL 合理、损失平稳都不等于人类偏好真的改善。必须用保留评审、对抗提示和事实安全指标重新评价。"
    ]
  },
  "diagram": {
    "title": "从偏好到策略的误差传递",
    "caption": "每个阶段都要有独立验证集，不能让下游优化指标为上游模型自证。",
    "items": [
      {
        "label": "SFT",
        "value": "示范 token",
        "note": "建立可用初始行为。"
      },
      {
        "label": "偏好",
        "value": "chosen vs rejected",
        "note": "标注者与采样策略决定分布。"
      },
      {
        "label": "奖励模型",
        "value": "scalar score",
        "note": "只拟合比较信号。"
      },
      {
        "label": "PPO",
        "value": "reward − βKL",
        "note": "在评分与漂移间取舍。"
      }
    ]
  },
  "workedExample": {
    "title": "计算带 KL 风格 token 成本的奖励",
    "setup": "一条回复的奖励模型分数为 6；当前策略下总 log-prob 为 −2，参考模型下为 −3。令 β=0.2，并用 r=score−β(logπ−logπref)。",
    "prediction": "当前策略把这条回复的似然提高到参考模型之上，会提高还是降低调整后奖励？",
    "steps": [
      {
        "label": "序列 log-ratio",
        "explanation": "当前策略与参考模型的总 log-prob 相减为 1，说明当前策略让这条回复在序列层面更可能。"
      },
      {
        "label": "KL 风格成本",
        "explanation": "用 β=0.2 乘这份正向漂移，得到 0.2 的约束成本。"
      },
      {
        "label": "调整后奖励",
        "explanation": "奖励模型分数 6 扣除漂移成本 0.2，进入更新的调整后奖励为 5.8。"
      },
      {
        "label": "单样本警告",
        "explanation": "单条回复的 log-ratio 可以为负；匹配分布下的期望 KL 非负，二者不能混为同一个量。"
      }
    ],
    "result": "序列 log-ratio 为 1，成本为 0.2，调整后奖励为 5.8。KL 控制给策略漂移定价，却不能验证奖励模型分数本身是否正确。"
  },
  "mechanism": {
    "introduction": "RLHF 是系统而非单一算法名。",
    "sections": [
      {
        "title": "Bradley–Terry 把分数差变成偏好概率",
        "paragraphs": [
          "Bradley–Terry 模型把同一提示下 chosen 与 rejected 的奖励分数差送入 sigmoid，得到 chosen 获胜的预测概率。训练只要求偏好回复分数更高，因此给所有分数加同一常数不会改变概率，绝对数值没有独立现实含义。标注者、候选来源和顺序偏差都会进入这个相对模型；高训练准确率只能说明复现偏好数据，不能证明跨人群价值。"
        ]
      },
      {
        "title": "PPO 只能局部复用近似在策略 rollout",
        "paragraphs": [
          "生成 rollout 时要保存旧策略对每个 token 的 log-prob，之后用新旧概率比做裁剪更新；同一批回复可以训练若干 epoch，却不能无限复用。batch、epoch 与 clip 共同决定数据变旧的速度，近似 KL 或 clip fraction 超阈值时应提前停止，否则优化目标已不再代表收集这些回复的策略附近。复用提高样本效率，也把 on-policy 假设变成可监控的工程预算，而不是一张数据集反复训练的许可证。"
        ]
      },
      {
        "title": "Critic 的误差决定信用分配是否可信",
        "paragraphs": [
          "价值头估计每个前缀的未来回报，GAE 再组合 TD 残差形成 token 优势，把序列末尾的评分向前分配。critic 若欠拟合，优势方差会很大；若在同一批稀疏奖励上过拟合，又会制造看似稳定的错误基线。应报告 value loss、解释方差、回报尺度和按长度分层的预测校准，并确认终止与 padding 掩码；优势热图只是估计，不能当作某个词造成偏好的因果解释。"
        ]
      },
      {
        "title": "KL 的实现位置改变实际算法",
        "paragraphs": [
          "KL 可以逐 token 从奖励里扣除，直接进入回报与优势；也可以作为额外损失、控制器反馈或 early-stop 监控量。它们都试图限制策略偏离参考模型，但梯度路径、尺度和动态并不相同，方向使用 forward 还是 reverse KL 也会改变行为。阅读实现必须核对计算方向、聚合位置、β 更新与采样策略；只写“使用 KL”无法复现，也不能证明模型没有利用奖励捷径。"
        ]
      }
    ]
  },
  "equations": [
    {
      "read": "偏好模型用两条回复分数差的 sigmoid 表示 chosen 获胜概率。",
      "meaning": "它学习相对排序，不给分数绝对尺度现实含义。"
    },
    {
      "read": "RLHF 奖励常把奖励模型分数减去策略相对参考模型的 token KL 成本。",
      "meaning": "β 决定优化评分与保留参考行为之间的权衡。"
    }
  ],
  "boundary": {
    "title": "奖励模型不是自动化的人类",
    "paragraphs": [
      "标注者群体、指南和候选生成策略限定了它学到的偏好。",
      "PPO 训练指标不能替代盲评、事实核验、越狱测试与上线监控。"
    ]
  },
  "nextBridge": "若已有成对偏好，是否一定要先训练标量奖励再跑 PPO？下一章比较 DPO 及其他直接偏好优化。"
} satisfies ChineseManuscript;
