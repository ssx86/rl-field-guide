import type { ChineseManuscript } from "@/content/zh-manuscripts/types";

export const ZH_MANUSCRIPT = {
  title: "平均成绩很好，也可能藏着一次严重事故",
  deck: "两个策略的平均回报可以很接近，其中一个却偶尔造成灾难。不同安全方法保护的是不同问题，不能只用“更安全”三个字带过。",
  openingQuestion: "一台机器通常得到 10 分，但每一百次有一次得到 −100 分。你会因为它的平均分更高就选择它吗？",
  bridge: "上一章把真实目标和可见分数分开了。即使分数设计得不错，平均数仍会隐藏有害的交换。接下来分别问四个问题：成本有没有上限？最坏那部分结果能否接受？环境变化后会怎样？危险动作能否直接拦住？",
  situation: {
    title: "一百次里那一次坏结果，被平均数藏了起来",
    paragraphs: [
      "策略 A 每次回报都是 8。策略 B 在九十九次里得到 10，一次得到 −100。B 的平均回报是 8.9，仍然高于 A。负责安全的人却可能选择 A。",
      "一种办法把伤害单独记成成本，再给成本设预算。这叫约束强化学习（Constrained Reinforcement Learning）。它常用约束马尔可夫决策过程（Constrained Markov Decision Process，CMDP）来描述，让奖励和成本始终分开。",
      "另一种办法专门看结果分布里最坏的一段，这叫风险敏感强化学习（Risk-Sensitive Reinforcement Learning）。常见指标叫条件风险价值（Conditional Value at Risk，CVaR），它计算所选坏尾部里的平均结果。",
    ],
  },
  diagram: {
    title: "四种工具，保护四种不同的东西",
    caption: "成本预算、坏结果尾部、环境变化和危险动作拦截，回答的不是同一个问题。",
    items: [
      { label: "成本上限", value: "期望成本 ≤ 预算", note: "把明确成本控制在写出的预算内。" },
      { label: "尾部指标", value: "最坏一部分结果", note: "让少见但严重的损失影响选择。" },
      { label: "环境范围", value: "多个可能世界", note: "检查物理、传感器或响应规则发生变化。" },
      { label: "动作屏蔽", value: "阻止禁止动作", note: "在策略动作真正执行之前应用规则。" },
    ],
  },
  workedExample: {
    title: "均值选择 B，最坏的百分之一却选择 A",
    setup: "策略 A 每次回报都是 8。策略 B 有 99% 概率得到 10，有 1% 概率得到 −100。",
    prediction: "按期望回报，哪一个更好？如果最坏的 1% 决定选择，答案会怎样？",
    steps: [
      { label: "A 的均值", explanation: "这个小例子里，A 每次都得到 8，所以它的期望回报就是 8。" },
      { label: "B 的均值", explanation: "B 的期望回报是 0.99×10+0.01×(−100)=8.9。只看平均数时，B 获胜。" },
      { label: "最坏 1% 的条件风险价值", explanation: "B 最坏的百分之一全部是 −100，所以这一段坏尾部的平均也是 −100。" },
      { label: "选择发生变化", explanation: "均值规则选择 B，尾部规则选择 A。两个答案来自不同的安全要求，不是算术出了错。" },
    ],
    result: "同一组结果，用不同决策规则会得到不同答案。报告必须先说清楚保护什么、阈值是多少，再说哪个策略更好。",
  },
  mechanism: {
    introduction: "“安全强化学习（Safe Reinforcement Learning，Safe RL）”范围太大。每次都要说明保护的量、计算时间范围，以及保护在训练还是执行阶段发生。",
    sections: [
      {
        title: "成本预算与奖励分开记录",
        paragraphs: [
          "约束马尔可夫决策过程（Constrained Markov Decision Process，CMDP）在追求高期望奖励的同时，要求每项期望成本不超过预算。拉格朗日方法（Lagrangian Method）会给超出预算的部分设置一个可变化的价格。训练看到成本过高时，这个价格就会上升。",
          "这里限制的仍然是平均成本。少数非常糟糕的轨迹，可能藏在一个合格的期望值里。价格和策略互相调整时，训练过程也可能暂时越过预算。",
        ],
      },
      {
        title: "限制每次策略更新的距离，可以减少突然越界",
        paragraphs: [
          "约束策略优化（Constrained Policy Optimization，CPO）会比较新策略和当前策略。它用信赖域（Trust Region）限制一次更新的距离，再寻找满足估计成本约束的奖励改进。",
          "它的保证依赖局部近似和期望量。它不能保证每一条轨迹都安全。估计误差、线搜索（Line Search）和实现细节仍然会影响结果。",
        ],
      },
      {
        title: "想估计坏尾部，就必须真的看到足够多坏样本",
        paragraphs: [
          "条件风险价值（Conditional Value at Risk，CVaR）关注最坏的一小部分回报。要稳定估计 1% 的尾部，需要很多独立运行。一百次运行里，可能只有一个结果进入这个尾部。",
          "因此还要报告置信区间（Confidence Interval，CI）和真实坏事件数量。分布模型可以整理已有样本，却不能凭空创造从未观察到的事故。样本太少时，一个漂亮的尾部数字并不可靠。",
        ],
      },
      {
        title: "鲁棒性的边界，就是事先测试过的变化范围",
        paragraphs: [
          "鲁棒强化学习（Robust Reinforcement Learning，Robust RL）会在多个可能的环境规则下训练。这个范围可以包含摩擦、传感器噪声、延迟或故意扰动。策略通常要照顾这个范围里的较坏情况。",
          "范围太窄会漏掉真实故障，太宽又可能让策略过分保守。动作屏蔽（Action Shield）可以作为另一层保护，在执行前阻止明确违反规则的动作。它保护的是写进规则的动作，不是所有未知危险。",
        ],
      },
    ],
  },
  equations: [
    {
      read: "约束马尔可夫决策过程（CMDP）最大化期望奖励，同时让每项期望成本不超过自己的预算。",
      meaning: "奖励和成本保持分开。由于限制的是期望值，它不会自动保证每一条轨迹都不越界。",
    },
    {
      read: "拉格朗日目标从奖励回报中，减去各项预算超额乘以相应乘子的结果。",
      meaning: "乘子像违反预算的浮动价格。估计噪声和更新步长可能让价格与策略来回摆动。",
    },
  ],
  boundary: {
    title: "训练目标只是安全证据的一层",
    paragraphs: [
      "真实传感器会失效，人会做出训练中没见过的行为，攻击也可能来自测试范围之外。部署仍需要监控、备用控制、停止规则和人工决定权。",
      "通过一个鲁棒性测试，只能支持那个测试里的变化。报告“安全”或“鲁棒”时，要同时写出变化范围、成本窗口、尾部比例和动作规则。",
    ],
  },
  nextBridge: "每个安全主张都要靠测量支持。下一章讨论需要多少次运行、不确定性怎样展示，以及为什么一条幸运曲线不能替整个算法发言。",
  narrative: [
    { type: "section", id: "the-bad-one-percent", title: "先把平均数遮住的那一次事故找出来", paragraphs: [
      "策略 A 每次都得到 8。策略 B 大多数时候得到 10，却有 1% 概率得到 −100。B 的期望回报是 8.9，算术上确实更高，但这个平均数没有告诉我们一次 −100 意味着什么。",
      "如果 −100 只是游戏扣分，B 也许可以接受。如果它代表撞伤一个人，负责部署的人可能直接拒绝 B。算法没有替我们决定这件事，必须先把风险要求写进问题。",
    ] },
    { type: "worked-example" },
    { type: "section", id: "costs-and-budgets", title: "想限制成本，就把成本从奖励中单独拿出来", paragraphs: [
      "约束强化学习（Constrained Reinforcement Learning）把伤害记成独立成本。约束马尔可夫决策过程（Constrained Markov Decision Process，CMDP）要求策略提高期望奖励，同时让期望成本低于预算。",
      "拉格朗日方法（Lagrangian Method）为每项预算超额设置一个乘子。成本超得越多，惩罚价格就可能升得越高。这仍然是平均意义的限制，少数严重事故可能藏在合格的平均值中。",
    ] },
    { type: "equations" },
    { type: "section", id: "tail-risk", title: "关心最坏结果时，均值就不再是唯一答案", paragraphs: [
      "风险敏感强化学习（Risk-Sensitive Reinforcement Learning）会改变我们怎样评价整组结果。条件风险价值（Conditional Value at Risk，CVaR）取最坏的一小部分回报，再计算其中的平均值。它让偶发的大损失不再被许多正常结果完全冲淡。",
      "坏尾部越小，进入计算的样本越少。报告 CVaR 时还要给出置信区间（Confidence Interval，CI）和实际坏事件数量。分布估计能整理样本，不能把没发生过的事故补出来。",
    ] },
    { type: "section", id: "robustness-and-shields", title: "环境变化与动作拦截，是另外两道问题", paragraphs: [
      "鲁棒强化学习（Robust Reinforcement Learning，Robust RL）在一组可能环境中检查策略。摩擦、延迟或传感器噪声可以放进这组变化里。所谓鲁棒，只对明确测试过的范围成立。",
      "动作屏蔽（Action Shield）在执行前检查一个动作是否违反规则。它可以阻止明确危险动作，却不能识别所有未知风险。高风险系统通常要把约束、尾部评估、环境压力测试和执行拦截一起使用。",
    ] },
    { type: "boundary" },
  ],
} satisfies ChineseManuscript;
