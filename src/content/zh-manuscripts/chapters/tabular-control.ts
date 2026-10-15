import type { ChineseManuscript } from "@/content/zh-manuscripts/types";

export const ZH_MANUSCRIPT = {
  title: "下一状态以后，究竟假设自己会怎么走",
  deck: "几个算法看到同一个动作和奖励，仍可能学出不同答案。它们真正不同的地方，是怎样描述到达下一状态以后的行为。",
  openingQuestion: "更新时应该使用实际发生的下一动作、整套策略的平均动作，还是当前看起来最好的动作？",
  bridge: "上一章会借用下一状态的价值。现在学习者还要一边收集数据，一边改进动作。我们先固定同一条经历，只改变‘未来由谁代表’。",
  situation: {
    title: "悬崖旁的一条短路，让差别马上显出来",
    paragraphs: [
      "行走者可以贴着悬崖走一条短路，也可以绕远走安全路线。它使用 ε-greedy 策略：大多数时候选当前最好的动作，少数时候随机试一步。",
      "假设一次随机动作把它推向悬崖。一种更新会把这次危险的下一动作算进未来。另一种更新却假设，从下一个状态开始，它只做当前最好的动作。",
      "两种更新看到了同一条经历，却在评价不同的未来，所以最后可能学出不同路线。",
    ],
  },
  diagram: {
    title: "经历保持不变，只替换代表未来的动作",
    caption: "每一行的即时奖励都相同。它们只在‘哪个下一动作价值进入目标’这件事上不同。",
    items: [
      { label: "SARSA", value: "使用实际采样的下一动作", note: "评价行为策略下一步真正选出的动作。" },
      { label: "Expected SARSA", value: "按策略平均所有下一动作", note: "枚举可用动作，再按策略选择它们的概率加权。" },
      { label: "Q-learning", value: "使用最大的下一动作价值", note: "行为仍可探索，目标却评价贪心未来。" },
      { label: "Double Q-learning", value: "一张表负责选，另一张表负责评", note: "把挑选赢家和给赢家打分分开。" },
    ],
  },
  workedExample: {
    title: "用同一条经历算出三个不同目标",
    setup: "即时奖励为 2，折扣因子 γ 为 0.9，任务尚未结束。实际采样的下一动作价值为 3。两个下一动作的价值是 3 和 6，策略选择它们的概率是 0.1 和 0.9。",
    prediction: "计算以前先排顺序：哪个目标最小，哪个目标最大？",
    steps: [
      { label: "SARSA", explanation: "使用实际采样的下一动作 3。即使它来自探索，也要如实放进目标。" },
      { label: "Expected SARSA", explanation: "用概率 0.1 和 0.9，对两个下一动作价值求加权平均。" },
      { label: "Q-learning", explanation: "直接使用较大的价值 6，假设下一状态以后采取贪心动作。" },
      { label: "任务真正结束时", explanation: "结束以后没有未完未来。三个算法的目标都只剩即时奖励 2。" },
    ],
    result: "公式不同，是因为各自想象的未来不同。在悬崖旁，这个差别会改变学习到的路线。",
  },
  mechanism: {
    introduction: "算法名字放到最后记。先看每次更新究竟想评价哪套行为。",
    sections: [
      { title: "SARSA 跟随产生数据的行为", paragraphs: ["SARSA 的全称是状态—动作—奖励—状态—动作（State-Action-Reward-State-Action）。最后一个动作是行为策略真正选出的动作。若行为一直探索，探索造成的损失也会进入价值。"] },
      { title: "Expected SARSA 把一次抽样换成策略平均", paragraphs: ["实际抽到的下一动作可能碰巧好或坏。Expected SARSA 对策略可能选择的所有下一动作求平均。它增加一些计算，去掉了这一次动作抽样带来的随机波动。"] },
      { title: "Q-learning 评价贪心未来", paragraphs: ["行为策略仍可以探索，更新里的最大值却评价当前最好的下一动作。这使 Q-learning 成为离策略学习（off-policy learning）。贪心目标不会让现实探索自动安全。"] },
      { title: "Double Q-learning 把选择和评价拆开", paragraphs: ["带噪估计中，偶然偏高的动作更容易赢得最大值。Double Q-learning 用一张表选动作，再用另一张表评价。它能减小这种高估，却不能消除所有误差。"] },
    ],
  },
  equations: [
    { read: "SARSA 先取即时奖励，再加上实际下一动作的折扣价值，然后让旧的动作价值朝这个目标移动。", meaning: "最后一个动作来自行为策略。只要行为仍在探索，探索带来的结果就会进入学习目标。" },
    { read: "Q-learning 先取即时奖励，再加上下一状态中最大的折扣动作价值，然后让旧价值朝这个目标移动。", meaning: "最大值定义了贪心目标策略。真正收集数据的行为策略仍然可以不同。" },
  ],
  boundary: {
    title: "贪心目标不会替行走者挡住悬崖",
    paragraphs: [
      "Q-learning 的目标可以想象以后都选最佳动作，真实的 ε-greedy 行走者仍可能随机走向悬崖。安全探索需要另外的限制、模拟器或保护机制。",
      "这些结论还依赖表格设定，每个状态—动作对都有自己的格子。改用神经网络以后，一次更新会同时改动许多状态，稳定性问题也会变复杂。",
    ],
  },
  nextBridge: "Q-learning 已经在用一套行为产生的数据，评价另一套策略。下一章要检查：旧日志什么时候有资格替新策略说话，日志很少见到关键动作时又该怎么办？",
  narrative: [
    {
      type: "section",
      id: "one-transition-three-questions",
      title: "先把所有算法都同意的部分放在桌上",
      paragraphs: [
        "行走者已经在状态 S 做了动作 A，得到奖励 R，并来到新状态 S′。这四件事已经发生，不会因为我们换算法而改变，也不需要重新解释。",
        "要更新 Q(S,A)，还缺一个数：从 S′ 往后大概值多少。SARSA、Expected SARSA 和 Q-learning 的差别，正好都集中在这个空位。",
      ],
    },
    {
      type: "section",
      id: "use-the-real-next-action",
      title: "先接受真正发生的下一动作，这就是 SARSA",
      paragraphs: [
        "到了 S′ 以后，行为策略真的选出了 A′。SARSA 直接使用 Q(S′,A′)。若 A′ 是一次危险探索，危险会压低上一步的目标。",
        "只要 ε 仍大于零，贴着悬崖走就一直带着随机跌落风险。SARSA 可能因此偏爱较远的安全路。安全不是写进算法的，而是探索风险进入了价值。",
      ],
    },
    {
      type: "section",
      id: "average-the-policy",
      title: "不想让一次抽样代表整套策略，就把所有动作平均起来",
      paragraphs: [
        "随机策略在 S′ 可能选择多个动作。SARSA 只使用这次抽到的一个动作，目标会随着抽样变化。Expected SARSA 则列出所有动作。",
        "它把每个动作价值乘上策略选择该动作的概率，再全部相加。被评价的策略没有换，只是用完整平均代替了一次随机抽样，减少一次运气的影响。",
      ],
    },
    { type: "diagram" },
    { type: "worked-example" },
    {
      type: "section",
      id: "judge-a-greedy-future",
      title: "Q-learning 换掉的是被评价的未来",
      paragraphs: [
        "Q-learning 仍可以用 ε-greedy 行为收集经历，以免许多动作永远没有数据。更新时，它却不使用实际 A′，而是取 S′ 中最大的动作价值。",
        "于是，收集数据的是一套会探索的行为策略，学习目标评价的是另一套贪心策略。这就是这里的离策略。max 只改变目标，不会阻止真实行为遇到危险。",
      ],
    },
    { type: "equations" },
    {
      type: "section",
      id: "separate-choice-and-score",
      title: "同一份噪声同时选冠军和打分，容易把分数抬高",
      paragraphs: [
        "假设两个动作真实价值都接近 5，当前估计却是 4.8 和 5.1。取最大值会选 5.1，可多出的 0.1 也许只是噪声。",
        "Double Q-learning 用表 A 选出动作，再让表 B 给这个动作打分；下一次可以交换角色。它切断了一部分噪声联系，却不会让估计从此完全正确。",
      ],
    },
    { type: "boundary" },
  ],
} satisfies ChineseManuscript;
