import type { ChapterArticle } from "@/content/chapter-article";

const CHINESE_CALCULATION_COPY: Readonly<Record<string, string>> = {
  "shortest path on a weighted graph": "在带权图上求最短路径",
  "features → estimated minutes": "特征 → 预计分钟数",
  "route choice → new location and traffic exposure → later choices": "路线选择 → 新位置与拥堵暴露 → 后续选择",
  "compare against rule, prediction-plus-planning, and contextual-bandit baselines": "分别与固定规则、预测后规划、情境赌博机基线比较",
  "Sₜ = (corridor A, battery 0.40)": "Sₜ =（走廊 A，电量 0.40）",
  "sample mean = (r₁ + … + rₙ)/n": "样本均值 = (r₁ + … + rₙ)/n",
  "S = (temperature, trend)": "S =（温度，变化趋势）",
  "π(stop|80,rising) may exceed π(stop|80,falling)": "π(停止|80,上升) 可能大于 π(停止|80,下降)",
  "if terminated, all three targets equal reward 2": "若 terminated=true，三个目标都等于即时奖励 2",
  "max target Q = max(4.8,5.1)=5.1": "最大化目标 Q = max(4.8,5.1)=5.1",
  "argmax online Q = A": "argmax 在线网络 Q = A",
  "5.1 versus 4.8; true value 5": "5.1 对 4.8；真实值为 5",
  "raise Left logit relative to Right": "提高 Left 相对 Right 的 logit",
  "Â<0 → reduce sampled-action log probability": "Â<0 → 降低已采样动作的对数概率",
  "update policy less often than critics": "actor 的更新频率低于 critic",
  "130−100=30 learner updates": "130−100=30 次 learner 更新",
  "refresh actors, shorten rollouts, or tune queue": "刷新 actor、缩短 rollout，或调整队列",
  "stop if expected failure cost exceeds inspection cost": "若预期失败成本高于检查成本，就先停止并检查",
  "compare failure cost with inspection cost": "比较故障损失与检查成本",
  "N(s) depends on state identity": "N(s) 取决于如何识别状态",
  "N(s) depends on what counts as the same s": "N(s) 取决于怎样定义同一个 s",
  "step-one reward changes from 0 to 7": "第一步的奖励从 0 改写为 7",
  "compare policy ordering before and after redistribution": "比较奖励重分配前后的策略排序",
  "compare policies before and after redistribution": "比较奖励重分配前后的策略排序",
  "plan H steps, execute 1, observe, repeat": "规划 H 步，只执行 1 步，观察后再规划",
  "P(all correct)=0.99¹⁰⁰≈0.366": "P(全部正确)=0.99¹⁰⁰≈0.366",
  "errors need not remain 1% after leaving dexpert": "离开 d_expert 后，错误率未必仍是 1%",
  "add (learner state, expert recovery action)": "加入（learner 到达的状态，expert 的纠偏动作）",
  "expert preferred ⇒ 10wt+1wr ≤ 8wt+3wr": "expert 偏好该轨迹 ⇒ 10w_t+1w_r ≤ 8w_t+3w_r",
  "new comparisons add inequalities": "新的轨迹比较会增加新的不等式约束",
  "conservatism may miss a genuinely better B": "保守估计也可能错过真实更优的 B",
  "look for training contexts near return 10": "寻找训练集中回报接近 10 的上下文",
  "other trajectories may have ρ near 0 or very large": "其他轨迹的 ρ 可能接近 0，也可能非常大",
  "bad β can end too early or never return": "错误的 β 可能让 option 过早结束，也可能永不返回",
  "Q(Left,Left)=4; Q(Right,Right)=3; mismatches=0": "Q(左,左)=4；Q(右,右)=3；不匹配时为 0",
  "an agent's reward depends on the other's simultaneous action": "一个智能体的奖励取决于另一个智能体同时采取的动作",
  "frequent Right coordination reinforces Right": "频繁出现的‘共同向右’会继续强化向右选择",
  "joint critic observes both actions": "联合 critic 同时观察双方动作",
  "baseline 60 > meta 40": "常规基线 60 > 元学习方法 40",
  "meta 70 > baseline 65": "元学习方法 70 > 常规基线 65",
  "meta 82 > baseline 80": "元学习方法 82 > 常规基线 80",
  "report full curve, variance, and data cost": "报告完整适应曲线、方差与数据成本",
  "mean prefers B; tail criterion prefers A": "均值指标偏好 B；尾部风险指标偏好 A",
  "mean=median=60; failure rate=0": "均值=中位数=60；失败率=0",
  "store terminated=false, truncated=true": "存储 terminated=false、truncated=true",
  "sample '5','.'; reward=0": "采样得到 ‘5’、‘.’；奖励=0",
  "advantage<0 lowers likelihood of sampled trajectory": "advantage<0 会降低已采样轨迹的概率",
  "sample log-ratios can be negative": "单个样本的对数概率比可以为负",
  "70%−50%=20 percentage points": "70%−50%=20 个百分点",
  "randomize order, judge both orders, abstain on disagreement": "随机化顺序、两个顺序都评判；结果不一致时弃权",
  "if [1,1,1,1], every centered advantage=0": "若奖励为 [1,1,1,1]，每个中心化 advantage 都等于 0",
  "samples correlate; verifier is imperfect; cost scales": "样本彼此相关；验证器并不完美；成本随采样量增长",
  "prompt→target reply ⇒ SFT": "提示词→目标回复 ⇒ SFT",
  "preference pairs ⇒ DPO-like direct objective": "偏好对 ⇒ 类 DPO 的直接优化目标",
  "policy actions→tool state→verifiable outcome": "策略动作→工具状态→可验证结果",
  "task success, false-action cost, human override, held-out tools": "任务成功率、错误动作成本、人工接管、留出工具集",
};

function localizeCalculation(calculation: string): string {
  return CHINESE_CALCULATION_COPY[calculation] ?? calculation;
}

type EquationCopy = { readonly read: string; readonly meaning: string };

const CHINESE_EQUATION_CORRECTIONS: Readonly<Record<string, Readonly<Record<number, EquationCopy>>>> = {
  "monte-carlo": {
    0: { read: "时刻 t 的完整回报，是从下一份奖励开始直到回合结束的折扣奖励和。", meaning: "这条公式定义一条轨迹上的一个回报样本；收集多条可比轨迹并求平均，才得到蒙特卡洛价值估计。" },
  },
  "neural-approximation": {
    0: { read: "参数沿小批次平均损失的负梯度方向移动一步。", meaning: "形式像监督学习，但 RL 的样本与目标会随策略和网络变化；批次怎样组成也是算法的一部分。" },
    1: { read: "更新数据比等于梯度步数乘批次大小，再除以新收集的环境转移数。", meaning: "比率高会复用数据，也更容易过拟合旧分布或放大自举误差；计算成本与数据成本应分开报告。" },
  },
  "trpo-ppo": {
    0: { read: "PPO 对每条样本比较原始概率比结果与裁剪后的结果，并取较小的一个。", meaning: "这个办法会拿走一部分继续远移的好处，却不会阻止整个策略继续变化。因此，训练后仍要检查 KL 和真实表现。" },
    1: { read: "TRPO 寻找更好的策略，同时要求新旧策略的平均 KL 距离不超过 δ。", meaning: "这表示旧数据只在附近可信。距离和更新都由样本近似得到，所以这个限制仍然不是绝对保证。" },
  },
  "distributed-rl": {
    1: { read: "策略滞后等于学习者当前版本减去演员收集数据时的版本。", meaning: "这个数字可以帮助发现过长队列或过慢刷新。同样的版本差，仍可能对应完全不同的行为变化。" },
  },
  "long-horizon-credit": {
    0: { read: "奖励重分配后的全部奖励相加，应该等于原来全部奖励的总和。", meaning: "当 γ=1 时，这是最基本的记账检查。要让所有策略的好坏顺序不变，还需要更强证据。" },
    1: { read: "事后奖励会使用路线真正到达的替代目标 g′。", meaning: "转移仍然真实，只是问题换了。替代目标必须合法，而且要使用相同的世界规则。" },
  },
  "dyna-mpc": {
    0: { read: "MPC 在学习模型下选择预测有限时域回报最大的动作序列。", meaning: "通常只执行第一个动作后便用真实观察重规划；优化器可能利用模型误差，因此还需约束、不确定性惩罚和现实反馈。" },
    1: { read: "Dyna 或 MBPO 风格的学习器混合真实转移与模型生成转移训练。", meaning: "简单并集隐藏了两类数据的比例、起点、展开长度与权重；合成样本量不等于独立现实证据。" },
  },
  "latent-world-models": {
    0: { read: "Dreamer 的后验隐状态读取新观察，先验隐状态只根据上一隐状态和动作预测。", meaning: "训练让先验靠近后验，同时保留重建与奖励所需信息；想象未来时没有真实新观察，因此只能使用先验。" },
    1: { read: "MuZero 的动力学函数预测奖励和下一隐状态，预测函数再从隐状态给出策略与价值。", meaning: "这些函数不必重建观察；搜索可靠性取决于多步隐状态展开的一致性，以及真实轨迹和 MCTS 产生的训练目标。" },
  },
  "decision-transformer": {
    0: { read: "时刻 t 的剩余回报等于从 t 到轨迹结束的奖励之和。", meaning: "训练时可在回合结束后算出它；部署时输入的是期望值并随已得奖励递减，所以它是目标条件，不是已知未来。" },
  },
  "off-policy-evaluation": {
    1: { read: "FQE 用奖励加上目标策略在下一状态的期望动作价值，回归当前 Q。", meaning: "它评价固定目标策略，不像 Q-learning 那样对动作取最大值；近似误差与状态动作覆盖决定估计是否可靠。" },
  },
  "hierarchical-rl": {
    1: { read: "一个 option 由可启动它的状态集合 I、内部策略 π 和每个状态下的终止概率 β 三部分组成。", meaning: "启动条件决定何时可调用，内部策略决定持续期间怎样行动，终止规则决定何时把控制权交回高层；三者缺一不可。" },
  },
  "multi-agent-rl": {
    0: { read: "QMIX 用依赖全局状态的混合网络组合各智能体效用，并约束总价值对每个个体效用单调不减。", meaning: "单调性让各智能体的局部贪心动作与联合贪心一致，也限制了可表达的协作价值函数。" },
    1: { read: "MADDPG 的局部 actor 通过能看到联合上下文的集中 critic 获得更新方向。", meaning: "集中信息只在训练时可用；部署时 actor 必须仅依赖允许的局部观察与通信。" },
  },
  "reward-design": {
    1: { read: "塑形后的奖励 R' 等于原任务奖励 R 加上塑形项 F。", meaning: "把 R 与 F 分开记录，才能判断表面进步来自真实任务结果，还是只来自学习辅助信号。" },
  },
  "safe-robust-risk": {
    1: { read: "拉格朗日目标从奖励回报中减去乘子加权的约束超额，并让策略与乘子朝相反方向优化。", meaning: "乘子像违反预算的自适应价格；步长与估计噪声会造成震荡，所以必须报告真实约束曲线。" },
  },
  "rl-systems": {
    1: { read: "一次可复现实验的身份由代码、配置、环境和数据契约共同哈希得到。", meaning: "只保存模型权重并不能重建实验；哈希可识别版本，却不能证明内容正确。" },
  },
  "llm-as-rl": {
    1: { read: "SFT 最小化给定目标前缀下目标 token 的负对数似然之和。", meaning: "星号表示数据集答案；这里不需要奖励、策略采样轨迹或 Bellman 目标，因此 SFT 不应被改称 RL。" },
  },
  "direct-preference": {
    1: { read: "SimPO 用当前策略下每个 token 的平均对数概率给回复打分，再用边际比较 chosen 与 rejected。", meaning: "长度归一化减轻原始序列长度偏差，目标边际控制所需分离；标准形式仍是固定数据上的直接目标。" },
  },
  "rlaif-judges": {
    0: { read: "评委一致率等于校准样本中评委标签与人类参考标签相同的比例。", meaning: "该比例只对采样分布和人类标注流程成立，还应报告置信区间、分组结果、歧义样本与人类分歧。" },
    1: { read: "交换一致性要求回答顺序互换后，评委仍选择同一个语义回答。", meaning: "它能发现位置不稳定；一个稳定但错误的评委仍可得到满分，所以一致性与正确性必须分开。" },
  },
  "test-time-compute": {
    0: { read: "若每次尝试独立且成功率为 p，N 次中至少一次成功的概率是一减去全部失败的概率。", meaning: "公式假设样本独立且成功能被完美识别；相关失败与不完美验证器都会降低实际收益。" },
    1: { read: "部署效用可以用任务价值减去定价后的计算成本与延迟成本。", meaning: "系数表达产品取舍；跨预算报告质量曲线，比只展示一个隐藏计算设置更诚实。" },
  },
  "method-selection": {
    1: { read: "系统声明的强度不能超过数据支持、评估范围、运行验证与安全证据中最弱的一项。", meaning: "构建通过、基准分数或一次人工演示，都不能被写成已部署安全或普遍能力。" },
  },
};

export interface ChineseManuscript {
  readonly title: string;
  readonly deck: string;
  readonly openingQuestion: string;
  readonly bridge: string;
  readonly situation: ChapterArticle["situation"];
  readonly diagram: {
    readonly title: string;
    readonly caption: string;
    readonly items: readonly { readonly label: string; readonly value: string; readonly note: string }[];
  };
  readonly workedExample: {
    readonly title: string;
    readonly setup: string;
    readonly prediction: string;
    readonly steps: readonly { readonly label: string; readonly explanation: string }[];
    readonly result: string;
  };
  readonly mechanism: ChapterArticle["mechanism"];
  readonly equations: readonly { readonly read: string; readonly meaning: string }[];
  readonly boundary: ChapterArticle["boundary"];
  readonly nextBridge: string;
  readonly narrative: NonNullable<ChapterArticle["narrative"]>;
}

function requireLength(label: string, actual: number, expected: number): void {
  if (actual !== expected) throw new Error(`${label}: expected ${expected} items, received ${actual}`);
}

export function applyChineseManuscript(english: ChapterArticle, copy: ChineseManuscript): ChapterArticle {
  requireLength(`${english.slug} diagram`, copy.diagram.items.length, english.diagram.items.length);
  requireLength(`${english.slug} example`, copy.workedExample.steps.length, english.workedExample.steps.length);
  requireLength(`${english.slug} equations`, copy.equations.length, english.equations.length);

  return {
    slug: english.slug,
    title: copy.title,
    deck: copy.deck,
    openingQuestion: copy.openingQuestion,
    bridge: copy.bridge,
    situation: copy.situation,
    diagram: {
      title: copy.diagram.title,
      caption: copy.diagram.caption,
      variant: english.diagram.variant,
      items: copy.diagram.items.map((item, index) => ({
        ...item,
        latex: english.diagram.items[index].latex,
      })),
    },
    workedExample: {
      title: copy.workedExample.title,
      setup: copy.workedExample.setup,
      prediction: copy.workedExample.prediction,
      steps: copy.workedExample.steps.map((step, index) => ({
        ...step,
        calculation: localizeCalculation(english.workedExample.steps[index].calculation),
      })),
      result: copy.workedExample.result,
    },
    mechanism: copy.mechanism,
    equations: copy.equations.map((equation, index) => ({
      latex: english.equations[index].latex,
      ...(CHINESE_EQUATION_CORRECTIONS[english.slug]?.[index] ?? equation),
    })),
    boundary: copy.boundary,
    nextBridge: copy.nextBridge,
    sources: english.sources,
    narrative: copy.narrative,
  };
}
