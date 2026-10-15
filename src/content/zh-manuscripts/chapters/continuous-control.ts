import type { ChineseManuscript } from "@/content/zh-manuscripts/types";

export const ZH_MANUSCRIPT = {
  "title": "动作成为连续值后，不能再逐个比较",
  "deck": "DDPG、TD3 与 SAC 用 actor 直接产生连续动作，再由 critic 估价；它们的差别集中在随机性、高估控制和熵。",
  "openingQuestion": "机械臂每个关节都能输出连续力矩，贪心 max 该怎样计算？",
  "bridge": "离散动作可以枚举 Q 并取最大值，连续空间却有无穷多个候选。Actor 把“找最大动作”本身变成一个可学习函数。",
  "situation": {
    "title": "一毫米的动作误差，也可能落到 critic 没见过的地方",
    "paragraphs": [
      "DDPG 用确定性 actor 输出动作，critic 对该动作求 Q，策略沿 ∂Q/∂a 的方向更新。探索通常在动作外加噪声。",
      "TD3 发现 critic 的局部高估会被 actor 主动利用，于是采用双 critic 取较小值、延迟 actor 更新，并在目标动作上加平滑噪声。",
      "SAC 让 actor 保持随机，用“回报加熵”作为目标；温度 α 控制随机性价值。它常更稳，也要求动作缩放、log-prob 修正和终止处理都严格一致。"
    ]
  },
  "diagram": {
    "title": "连续控制的三处脆弱点",
    "caption": "Actor、critic 与动作边界互相耦合；任何一个尺度错位都会变成错误梯度。",
    "items": [
      {
        "label": "动作生成",
        "value": "a=μ(s) 或 a~π",
        "note": "输出要映射到真实执行范围。"
      },
      {
        "label": "双重估价",
        "value": "min(Q₁,Q₂)",
        "note": "保守抑制高估。"
      },
      {
        "label": "目标平滑",
        "value": "a′+clip(ε)",
        "note": "避免利用尖锐 Q 峰。"
      },
      {
        "label": "熵权衡",
        "value": "Q−α logπ",
        "note": "随机性也进入目标。"
      }
    ]
  },
  "workedExample": {
    "title": "比较单 critic 与 TD3 的双重保守目标",
    "setup": "目标动作在 critic 一下的估值为 8，在 critic 二下的估值为 5。即时奖励是 1，折扣因子 γ=0.9，而且转移仍会继续。",
    "prediction": "TD3 的目标会采用哪一个 critic 值？这种选择在高估与低估之间作出了什么取舍？",
    "steps": [
      {
        "label": "单 critic 目标",
        "explanation": "若只相信估值为 8 的第一个 critic，目标就是 1+0.9×8=8.2；若 8 本身是高估，actor 会继续追逐虚假的高价值区域。"
      },
      {
        "label": "取双 critic 较小值",
        "explanation": "TD3 在 8 与 5 之间选择较小的 5，刻意降低正偏差被 actor 利用的机会。"
      },
      {
        "label": "TD3 目标",
        "explanation": "把保守估值 5 代入目标，得到 1+0.9×5=5.5；这种做法可能带来低估，但更难被 actor 钻空子。"
      },
      {
        "label": "延迟 actor",
        "explanation": "策略的更新频率低于 critic，让价值曲面先多做几步拟合，再让 actor 沿当前曲面移动。"
      }
    ],
    "result": "TD3 的三项改动分别阻断确定性 actor 放大 critic 错误的不同路径；它们都不能替代数据覆盖与真实任务评估。"
  },
  "mechanism": {
    "introduction": "连续动作把价值误差直接变成动作方向，因此尺度与外推格外敏感。",
    "sections": [
      {
        "title": "确定性梯度沿 critic 曲面移动",
        "paragraphs": [
          "DDPG 的 actor 直接输出动作 μ(s)，再把 critic 对动作的局部斜率 ∂Q/∂a 通过 actor 传回参数，无需枚举连续动作空间。这样更新高效，也使当前动作附近的 Q 曲面形状变得决定性；虚假尖峰会立刻变成策略方向。网络常先在 [-1,1] 内输出，再经 tanh 与线性映射到真实执行范围，缩放与饱和会同时改变梯度，因此动作边界属于数学语义而非接口细节。"
        ]
      },
      {
        "title": "TD3 延迟利用尚未稳定的估值",
        "paragraphs": [
          "TD3 先让两个 critic 多更新几步，再较低频率地移动 actor，避免策略立刻追逐刚出现的估值噪声。目标取两个 critic 的较小值来抑制高估，并给目标动作加入平滑噪声，减少对尖锐 Q 峰的利用。三项修复彼此配合；去掉其中一项会改变其余部分的作用与调参范围，不能把延迟更新单独当成完整保证。"
        ]
      },
      {
        "title": "SAC 优化最大熵目标",
        "paragraphs": [
          "SAC 的随机策略同时追求任务回报与状态上的策略熵，软价值目标用温度 α 权衡两者。自动调温把实际 log-prob 与目标熵比较，使分布过窄时增加探索压力、过宽时降低压力；奖励尺度和目标熵共同决定最终随机程度。若动作经 tanh 与缩放映射到执行范围，概率密度还必须加入变换修正，否则熵项不再对应真实动作分布；正确修正也不能消除 critic 的数据外外推。"
        ]
      },
      {
        "title": "回放带来样本效率，也制造支持外估值",
        "paragraphs": [
          "DDPG、TD3 和 SAC 都会从 replay 反复使用旧转移，因此获得较高样本效率，同时明确成为离策略方法。Critic 只在回放覆盖的状态—动作附近有直接证据，actor 却会主动寻找 Q 最大的动作，可能很快走到支持之外并追逐任意外推高峰。探索噪声、训练前 warm-up、保守更新与一致的评估 reset 会改变这种风险；它们必须与缓冲区组成一起报告，而双 critic 和熵本身并不能让缺失证据凭空出现。"
        ]
      }
    ]
  },
  "equations": [
    {
      "read": "确定性策略梯度通过 critic 对动作的斜率，把价值变化传回 actor 参数。",
      "meaning": "若 critic 在当前动作附近外推错误，actor 会沿错误斜率迅速利用它。"
    },
    {
      "read": "SAC 的软目标在 Q 中减去温度乘动作对数概率。",
      "meaning": "低概率动作带来熵收益；α 决定随机性在价值中的权重。"
    }
  ],
  "boundary": {
    "title": "模拟器里的平滑动作，不等于真实控制安全",
    "paragraphs": [
      "执行器延迟、饱和、摩擦和传感器噪声会改变 critic 从未见过的动力学。",
      "双 critic 和熵能改善训练，不能替代硬约束、故障保护与真实系统分阶段验证。"
    ]
  },
  "nextBridge": "单机算法稳定后，扩展吞吐会引入另一类分布变化：许多 actor 用不同版本策略采样。下一章进入分布式 RL。"
} satisfies ChineseManuscript;
