export interface ChapterTerm {
  readonly zh: string;
  readonly en: string;
  readonly acronym?: string;
}

export const CHAPTER_TERMS: Readonly<Record<string, readonly ChapterTerm[]>> = {
  "before-rl": [{ zh: "强化学习", en: "reinforcement learning", acronym: "RL" }],
  "interaction-loop": [{ zh: "智能体—环境交互", en: "agent–environment interaction" }],
  "return-horizon": [{ zh: "回报", en: "return" }, { zh: "折扣因子", en: "discount factor" }],
  "probability-expectation": [{ zh: "期望", en: "expectation" }, { zh: "随机策略", en: "stochastic policy" }],
  "bandits-contextual-bandits": [{ zh: "多臂老虎机", en: "multi-armed bandit", acronym: "MAB" }, { zh: "情境老虎机", en: "contextual bandit" }],
  "mdp-state-design": [{ zh: "马尔可夫决策过程", en: "Markov decision process", acronym: "MDP" }],
  "value-bellman": [{ zh: "贝尔曼方程", en: "Bellman equation" }, { zh: "动作价值", en: "action value" }],
  "dynamic-programming": [{ zh: "动态规划", en: "dynamic programming", acronym: "DP" }],
  "monte-carlo": [{ zh: "蒙特卡洛学习", en: "Monte Carlo learning", acronym: "MC" }],
  "td-traces": [{ zh: "时序差分学习", en: "temporal-difference learning", acronym: "TD learning" }, { zh: "资格迹", en: "eligibility trace" }],
  "tabular-control": [{ zh: "状态—动作—奖励—状态—动作", en: "State–Action–Reward–State–Action", acronym: "SARSA" }, { zh: "Q 学习", en: "Q-learning" }],
  "off-policy-deadly-triad": [{ zh: "离策略学习", en: "off-policy learning" }, { zh: "致命三角", en: "deadly triad" }],
  "linear-approximation": [{ zh: "线性函数逼近", en: "linear function approximation" }],
  "neural-approximation": [{ zh: "神经函数逼近", en: "neural function approximation" }],
  "dqn": [{ zh: "深度 Q 网络", en: "Deep Q-Network", acronym: "DQN" }],
  "dqn-family": [{ zh: "双重深度 Q 网络", en: "Double Deep Q-Network", acronym: "Double DQN" }],
  "reinforce-policy-gradient": [{ zh: "策略梯度", en: "policy gradient" }, { zh: "蒙特卡洛策略梯度", en: "Monte Carlo Policy Gradient", acronym: "REINFORCE" }],
  "actor-critic-gae": [{ zh: "行动者—评论家", en: "actor–critic" }, { zh: "广义优势估计", en: "Generalized Advantage Estimation", acronym: "GAE" }],
  "trpo-ppo": [{ zh: "信赖域策略优化", en: "Trust Region Policy Optimization", acronym: "TRPO" }, { zh: "近端策略优化", en: "Proximal Policy Optimization", acronym: "PPO" }],
  "continuous-control": [{ zh: "柔性行动者—评论家", en: "Soft Actor-Critic", acronym: "SAC" }, { zh: "双延迟深度确定性策略梯度", en: "Twin Delayed Deep Deterministic Policy Gradient", acronym: "TD3" }],
  "distributed-rl": [{ zh: "分布式强化学习", en: "distributed reinforcement learning", acronym: "distributed RL" }],
  "pomdp-memory": [{ zh: "部分可观测马尔可夫决策过程", en: "Partially Observable Markov Decision Process", acronym: "POMDP" }],
  "deep-exploration": [{ zh: "随机网络蒸馏", en: "Random Network Distillation", acronym: "RND" }],
  "long-horizon-credit": [{ zh: "长时信用分配", en: "long-horizon credit assignment" }],
  "mcts-alphazero": [{ zh: "蒙特卡洛树搜索", en: "Monte Carlo Tree Search", acronym: "MCTS" }, { zh: "阿尔法零", en: "AlphaZero" }],
  "dyna-mpc": [{ zh: "模型预测控制", en: "Model Predictive Control", acronym: "MPC" }, { zh: "动态规划架构", en: "Dyna architecture", acronym: "Dyna" }],
  "latent-world-models": [{ zh: "潜在世界模型", en: "latent world model" }, { zh: "梦境智能体", en: "Dreamer" }, { zh: "零先验模型", en: "MuZero" }],
  "behavior-cloning-dagger": [{ zh: "行为克隆", en: "behavior cloning", acronym: "BC" }, { zh: "数据集聚合", en: "Dataset Aggregation", acronym: "DAgger" }],
  "inverse-rl-gail": [{ zh: "逆强化学习", en: "inverse reinforcement learning", acronym: "IRL" }, { zh: "生成对抗模仿学习", en: "Generative Adversarial Imitation Learning", acronym: "GAIL" }],
  "offline-rl": [{ zh: "离线强化学习", en: "offline reinforcement learning", acronym: "offline RL" }],
  "decision-transformer": [{ zh: "决策变换器", en: "Decision Transformer", acronym: "DT" }],
  "off-policy-evaluation": [{ zh: "离策略评估", en: "off-policy evaluation", acronym: "OPE" }, { zh: "拟合 Q 评估", en: "Fitted Q Evaluation", acronym: "FQE" }],
  "hierarchical-rl": [{ zh: "层级强化学习", en: "hierarchical reinforcement learning", acronym: "HRL" }],
  "multi-agent-rl": [{ zh: "多智能体强化学习", en: "multi-agent reinforcement learning", acronym: "MARL" }],
  "transfer-meta-generalization": [{ zh: "元强化学习", en: "meta-reinforcement learning", acronym: "meta-RL" }, { zh: "模拟到现实", en: "simulation-to-reality", acronym: "sim-to-real" }],
  "reward-design": [{ zh: "奖励塑形", en: "reward shaping" }, { zh: "古德哈特定律", en: "Goodhart's law" }],
  "safe-robust-risk": [{ zh: "约束马尔可夫决策过程", en: "Constrained Markov Decision Process", acronym: "CMDP" }, { zh: "条件风险价值", en: "Conditional Value at Risk", acronym: "CVaR" }],
  "evaluation-reproducibility": [{ zh: "消融实验", en: "ablation study" }, { zh: "置信区间", en: "confidence interval", acronym: "CI" }],
  "rl-systems": [{ zh: "强化学习系统", en: "reinforcement-learning system", acronym: "RL system" }],
  "llm-as-rl": [{ zh: "大语言模型", en: "large language model", acronym: "LLM" }, { zh: "监督微调", en: "supervised fine-tuning", acronym: "SFT" }],
  "rlhf-ppo": [{ zh: "基于人类反馈的强化学习", en: "Reinforcement Learning from Human Feedback", acronym: "RLHF" }, { zh: "近端策略优化", en: "Proximal Policy Optimization", acronym: "PPO" }],
  "direct-preference": [{ zh: "直接偏好优化", en: "Direct Preference Optimization", acronym: "DPO" }],
  "rlaif-judges": [{ zh: "基于人工智能反馈的强化学习", en: "Reinforcement Learning from AI Feedback", acronym: "RLAIF" }, { zh: "人工智能评审器", en: "AI judge" }],
  "rlvr-grpo": [{ zh: "带可验证奖励的强化学习", en: "Reinforcement Learning with Verifiable Rewards", acronym: "RLVR" }, { zh: "组相对策略优化", en: "Group Relative Policy Optimization", acronym: "GRPO" }],
  "test-time-compute": [{ zh: "测试时计算", en: "test-time compute", acronym: "TTC" }],
  "method-selection": [{ zh: "强化学习方法选择", en: "reinforcement-learning method selection", acronym: "RL method selection" }],
};

export function formatChapterTerm(term: ChapterTerm): string {
  return `${term.zh}（${term.en}${term.acronym ? `, ${term.acronym}` : ""}）`;
}
