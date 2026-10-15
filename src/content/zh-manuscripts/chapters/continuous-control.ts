import type { ChineseManuscript } from "@/content/zh-manuscripts/types";

export const ZH_MANUSCRIPT = {
  "title": "动作有无穷多个时，让谁替 max 去寻找",
  "deck": "DDPG 用确定性 actor 沿 critic 曲面寻找动作，TD3 防止 actor 利用虚假高峰，SAC 则保留随机策略并把熵写进目标。它们都用回放换取样本效率，也都要面对 critic 的支持外外推。",
  "openingQuestion": "方向盘可以取任意角度，我们不可能逐个计算 Q 再挑最大值；那项‘寻找好动作’的工作该由谁完成？",
  "bridge": "PPO 可以直接输出连续动作分布，却主要依赖刚采集的轨迹。若现实交互很贵，我们会想把旧转移反复利用。为此，连续控制常让 actor 专门产生候选动作，让 critic 从回放中评价它，再把 Q 对动作的斜率传回 actor。",
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
    "title": "Critic 说 8 和 5，actor 最容易相信哪一个",
    "setup": "目标动作在 critic 一下的估值为 8，在 critic 二下的估值为 5。即时奖励是 1，折扣因子 γ=0.9，而且转移仍会继续。",
    "prediction": "Actor 会主动寻找高 Q 区域。如果两个 critic 对同一个目标动作分别给出 8 和 5，TD3 为什么宁愿使用较小的那个？",
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
    "result": "5.5 的保守目标可能低估真实价值，却降低 actor 把单个 critic 的乐观误差越推越大的机会。延迟更新与目标平滑还会从另外两条路径减慢这种利用。"
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
    "title": "Critic 曲面平滑，不代表真实机器会照着它运动",
    "paragraphs": [
      "模拟器常省略执行器延迟、磨损、摩擦变化、饱和与传感器故障。Actor 在 critic 上找到的精确动作，到了真实机器上可能落进完全不同的动力学。",
      "双 critic、平滑噪声和熵都在管理学习误差，不是硬安全约束。真实部署仍需要动作限幅、故障保护、分阶段放权与独立安全验证。"
    ]
  },
  "nextBridge": "一台 learner 从回放中训练时，旧数据已经会与当前 actor 产生错配。为了更快收集经验，我们再把 actor 扩成几十上百个；这时数据还要经过队列和网络，产生它的策略版本可能落后很多。下一章的核心不再只是并行，而是算法的时间开始分叉。",
  "narrative": [
    { "type": "section", "id": "replace-enumeration-with-an-actor", "title": "连续动作真正拿走的，是枚举这条退路", "paragraphs": [
      "离散动作很少时，Q-learning 可以把每个候选动作都算一遍再取最大值。机械臂力矩在区间内连续变化，候选数没有尽头；即使网格化，也会随着关节数量指数膨胀。",
      "DDPG 因此训练一个确定性 actor μ(s) 直接输出动作。Critic 仍判断 Q(s,a)，并告诉 actor 当前动作附近朝哪个方向移动会让 Q 上升。寻找最大动作不再是一轮显式枚举，而成为 actor 自己的学习任务。"
    ] },
    { "type": "section", "id": "why-the-actor-exploits-errors", "title": "Actor 不只利用环境，也会利用 critic 的错觉", "paragraphs": [
      "这条更新路径非常高效，却把 critic 局部曲面的形状直接变成动作方向。若回放很少覆盖某片动作区域，critic 可能在那里形成一个虚假尖峰；actor 的职责恰好是爬向高点，于是它会主动找到并放大这项外推误差。",
      "DDPG 的探索通常在确定性动作外加噪声。输出还要从网络常用的 [-1,1] 映射到执行器真实范围；tanh 饱和、缩放与限幅都会改变梯度。动作边界不是接口收尾，而是算法的一部分。"
    ] },
    { "type": "section", "id": "td3-slows-three-error-paths", "title": "TD3 没有一个万能修复，而是堵住三条利用路径", "paragraphs": [
      "第一，两个 critic 对目标动作分别估价，并取较小值，降低正偏差成为自举目标的机会。第二，actor 更新得比 critic 慢，让价值曲面多拟合几步再被策略追逐。第三，目标动作附近加入截断噪声，迫使目标在一个小邻域内保持合理，而不是依赖极窄尖峰。",
      "三项改动共同针对‘确定性 actor 会迅速利用 critic 误差’。取较小值可能带来低估，延迟过多会让策略反应迟缓，平滑过强又会抹掉真实的精细动作差别；它们不是免费的稳定性。"
    ] },
    { "type": "worked-example" },
    { "type": "equations" },
    { "type": "section", "id": "sac-keeps-randomness-inside-the-objective", "title": "SAC 不在动作外临时加噪声，而是让随机性本身有价值", "paragraphs": [
      "SAC 使用随机 actor，并最大化奖励加策略熵。温度 α 决定保持分布宽度值多少：α 大，策略更愿意保留多种动作；α 小，任务 Q 更快主导选择。自动调温用实际 log-prob 与目标熵的差异调整 α，但奖励尺度与目标熵仍共同决定最终随机程度。",
      "连续动作常先采样高斯变量，再经 tanh 压进边界。变换后的概率密度必须加入 Jacobian 修正，否则熵项说的就不是实际执行动作的分布。即使修正完全正确，critic 在回放之外的估值仍没有直接证据。"
    ] },
    { "type": "section", "id": "replay-is-the-shared-bargain", "title": "三种方法共同做的交易：用旧数据换交互效率", "paragraphs": [
      "DDPG、TD3 与 SAC 都从 replay 反复抽旧转移，因此比纯在策略方法更节省环境交互。代价是行为数据与当前 actor 不同，critic 只在回放覆盖附近得到监督，而 actor 随时可能把动作推到支持之外。",
      "Warm-up、探索日程、更新数据比、缓冲区新鲜度和独立评估 reset 都会改变这项交易。双 critic 和熵能缓和部分症状，却不会让没发生过的动作后果自动成为事实。"
    ] },
    { "type": "boundary" }
  ]
} satisfies ChineseManuscript;
