import type { ChapterArticle } from "@/content/chapter-article";
import { CHAPTER_ARTICLES } from "@/content/chapter-articles";
import { CURRICULUM, type CurriculumChapter } from "@/content/curriculum";
import type { Language } from "@/content/bilingual-course";
import { PART_ONE_CHINESE_MANUSCRIPTS } from "@/content/zh-manuscripts/part-1";
import { PART_TWO_CHINESE_MANUSCRIPTS } from "@/content/zh-manuscripts/part-2";
import { PART_THREE_CHINESE_MANUSCRIPTS } from "@/content/zh-manuscripts/part-3";
import { applyChineseManuscript } from "@/content/zh-manuscripts/types";

const AUTHORED_MANUSCRIPTS = {
  ...PART_ONE_CHINESE_MANUSCRIPTS,
  ...PART_TWO_CHINESE_MANUSCRIPTS,
  ...PART_THREE_CHINESE_MANUSCRIPTS,
} as const;

export const AUTHORED_CHINESE_SLUGS = Object.keys(AUTHORED_MANUSCRIPTS);

interface ChineseChapterBrief {
  readonly title: string;
  readonly focus: string;
  readonly situation: string;
  readonly boundary: string;
}

const ZH_BRIEFS: Readonly<Record<string, ChineseChapterBrief>> = {
  "before-rl": { title: "先别急着用 RL：判断问题是否真的需要从后果中学习", focus: "区分连续决策、监督预测、搜索、普通优化与固定规则，先证明 RL 是合适的问题表述。", situation: "比较路线规划、图片分类与库存补货：只有当当前动作会改变后续处境、又没有逐动作标准答案时，才出现典型的 RL 闭环。", boundary: "出现奖励分数并不自动构成 RL；如果有稳定标签、可直接求解的模型或安全规则，就应优先采用更简单的方法。" },
  "interaction-loop": { title: "先画智能体—环境接口，再选择算法", focus: "把观察、状态、动作、奖励、转移与轨迹放回同一条时间线，明确决策者与环境的边界。", situation: "清洁机器人看到局部图像后转向：图像是观察，电量与位置可能属于状态，转向是动作，环境随后返回新观察与奖励。", boundary: "把方便输入叫作“状态”并不能保证马尔可夫性；若历史仍影响未来，就需要记忆、滤波或信念状态。" },
  "return-horizon": { title: "把即时奖励连接成回报、时域与正确的结束条件", focus: "理解折扣与不折扣回报、有限与持续任务，并区分真正终止和仅因时间上限而截断。", situation: "绕路可能先付出成本却换来更高的后续收益；比较动作时必须计算整段未来，而不是只看眼前一分。", boundary: "折扣不能修复错误奖励；时间截断通常仍应自举，只有任务语义上的终止才应把后续价值置零。" },
  "probability-expectation": { title: "不用数学绕路读懂概率、期望与随机策略", focus: "把多个可能未来按概率加权，理解期望是决策量而不一定是实际会观测到的结果。", situation: "一个动作以 80% 概率得到 5、以 20% 概率得到 1；4.2 虽不会直接出现，却能用于长期比较。", boundary: "期望会掩盖尾部风险与多峰结果；高风险任务还要查看分布、分位数或风险度量。" },
  "bandits-contextual-bandits": { title: "先用老虎机理解探索，再加入状态转移", focus: "比较样本均值、常数步长、ε-greedy、UCB、汤普森采样、遗憾与上下文老虎机。", situation: "推荐系统必须在已知高点击选项与尚未充分尝试的新选项之间分配曝光。", boundary: "老虎机没有延迟状态转移；一旦动作改变未来处境，独立轮次假设就失效。" },
  "mdp-state-design": { title: "构建 MDP，并检验所选状态是否满足马尔可夫性", focus: "定义转移与奖励分布、策略和占用分布，判断当前状态是否含有预测后果所需的信息。", situation: "仓库补货只记录库存却忽略在途订单时，同一“状态”会对应不同未来，表示设计已经丢失关键信息。", boundary: "马尔可夫性取决于表示而非变量名；缺失历史会让最优策略在当前输入上根本无法表达。" },
  "value-bellman": { title: "把价值函数与贝尔曼方程看作递归记账", focus: "从一步奖励与下一状态价值推导状态价值、动作价值、期望方程与最优性方程。", situation: "在小型网格中，一格的价值等于走出这一步的奖励，加上折扣后的下一格价值。", boundary: "贝尔曼等式依赖明确的状态、策略与转移语义；错误模型会得到内部一致却外部错误的价值。" },
  "dynamic-programming": { title: "用策略评估、策略迭代和值迭代进行规划", focus: "在完整模型已知时执行扫掠与备份，理解广义策略迭代以及无环问题的反向求解。", situation: "已知每个网格动作的全部转移概率，就能反复更新价值并改进策略，而无需真实采样。", boundary: "动态规划要求可枚举且准确的模型；大状态空间或未知动力学会使完整扫掠不可行。" },
  "monte-carlo": { title: "用完整采样回合做蒙特卡洛价值估计", focus: "区分首次访问与每次访问，理解探索起点、ε-soft 控制以及完整回报的高方差。", situation: "一局牌结束后，把实际总回报回填到本局访问过的状态，以多局平均估计价值。", boundary: "蒙特卡洛必须等到可定义回报的结束点；长回合、稀疏反馈或持续任务会带来高方差和长延迟。" },
  "td-traces": { title: "从 TD(0) 走向 n 步回报与资格迹", focus: "把自举放进偏差—方差光谱，连接前向 n 步目标与后向资格迹。", situation: "每到一个新状态就用当前估计提前更新，而不是等整局结束；更多步数会引入更多真实奖励与方差。", boundary: "自举目标也可能系统性错误；函数逼近、离策略数据和自举结合时尤其要监控发散。" },
  "tabular-control": { title: "比较 SARSA、Expected SARSA、Q-learning 与 Double Q-learning", focus: "在同一个 TD 更新中分清行为策略、目标策略、最大化偏差与终止掩码。", situation: "悬崖行走中，SARSA 评价实际会探索的下一动作，Q-learning 则评价贪心下一动作，因此可能学出不同路线。", boundary: "四种方法共享即时奖励，却用不同方式评价下一状态；不能把采样动作、期望动作与最大动作混写。" },
  "off-policy-deadly-triad": { title: "校正离策略数据，并识别致命三角", focus: "理解重要性采样、覆盖条件与方差，以及自举、函数逼近和离策略数据为何可能共同导致发散。", situation: "用旧策略日志评估新策略时，样本权重必须反映两种策略选择该动作的概率比。", boundary: "若行为策略从未覆盖目标策略需要的动作，任何权重都不能凭空创造证据。" },
  "linear-approximation": { title: "用线性价值函数和显式特征替代表格", focus: "理解半梯度更新、特征向量、状态聚合与一次更新如何同时改变相似状态。", situation: "用“距离目标”“剩余电量”等特征表示大量状态，一次权重更新会泛化到共享特征的其他状态。", boundary: "线性模型只能表达特征张成的关系；错误聚合会把本应不同的状态强行绑定。" },
  "neural-approximation": { title: "在算法名称之前理解神经函数逼近", focus: "连接参数、批次、损失、梯度、归一化与表征学习，并正视相关且非平稳的训练数据。", situation: "神经 Q 网络同时面对会变化的数据分布和会变化的目标，普通监督学习的独立同分布假设不再成立。", boundary: "更深的网络不会自动解决移动目标、外推和不稳定；表示能力与训练证据是两件事。" },
  "dqn": { title: "用经验回放与目标网络稳定深度 Q 学习", focus: "推导 DQN 目标，理解回放采样、目标网络同步、终止掩码、预处理与评估假设。", situation: "回放缓冲打散连续轨迹的相关性，冻结的目标网络让一段时间内的回归目标保持稳定。", boundary: "回放和目标网络只是稳定机制；错误终止掩码、窄数据支持或高估偏差仍会破坏结果。" },
  "dqn-family": { title: "看清每个 DQN 扩展修复什么，以及 Rainbow 合并了什么", focus: "分别理解 Double DQN、Dueling、优先回放、多步目标、分布式价值、噪声网络与 Rainbow。", situation: "把“选择动作”和“评价动作”拆开可减少最大化偏差；按 TD 误差采样则改变了数据分布并需要校正。", boundary: "扩展组件修复的是不同误差源；堆叠更多组件不保证在新任务上单调变好。" },
  "reinforce-policy-gradient": { title: "用 REINFORCE 与策略梯度直接改变动作概率", focus: "理解对数概率梯度、得分函数估计、基线、熵以及完整回报造成的高方差。", situation: "一次成功轨迹会提高其中动作的对数概率，但基线决定这次回报相对预期究竟有多好。", boundary: "基线能降方差却不能依赖当前动作而引入偏差；有限样本梯度仍可能非常噪声化。" },
  "actor-critic-gae": { title: "用 Actor–Critic 与 GAE 联合学习策略和价值", focus: "由评论家形成优势，协调 actor 与 critic 损失，并用 GAE 在偏差和方差之间调节。", situation: "评论家估计“比通常情况好多少”，actor 再按优势增减该动作概率，从而不必等待完整回合。", boundary: "错误评论家会把系统性偏差传给策略；GAE 的 λ 只是权衡旋钮，不是正确性的保证。" },
  "trpo-ppo": { title: "用自然梯度、TRPO 与 PPO 控制策略更新幅度", focus: "理解概率比、KL 几何、代理目标、信赖域、裁剪与多轮更新。", situation: "同一批轨迹被重复优化时，新旧策略概率比会偏离 1；裁剪限制单个样本继续推动更新。", boundary: "PPO 裁剪不是硬约束，也不是安全证明；实际 KL、性能退化与分布变化仍须测量。" },
  "continuous-control": { title: "用 DDPG、TD3 与 SAC 处理连续动作", focus: "比较确定性与随机 actor、双评论家、延迟更新、目标平滑、熵与温度调节。", situation: "机械臂输出连续力矩时无法枚举全部动作；actor 直接产生动作，critic 评价其长期后果。", boundary: "连续控制对动作缩放、探索噪声与外推误差敏感；模拟器中的稳定不等于真实系统安全。" },
  "distributed-rl": { title: "在分布式 RL 中分离 actor、learner 与 replay", focus: "比较 A3C、Ape-X、IMPALA 与 R2D2，并把策略陈旧、回放偏差和吞吐瓶颈纳入算法。", situation: "许多 actor 用不同版本的策略采样，learner 更新得越快，收集策略与目标策略的差距可能越大。", boundary: "更多机器只增加吞吐，不自动增加有效样本；陈旧数据、队列与通信会改变学习分布。" },
  "pomdp-memory": { title: "在部分可观测环境中用信念与记忆行动", focus: "区分隐藏状态与观察，比较信念状态、帧堆叠、滤波与循环策略。", situation: "仅凭当前画面无法判断物体运动方向时，连续帧或循环记忆能补回被单帧隐藏的信息。", boundary: "记忆容量不等于记住了正确信息；训练序列长度、重置方式和隐藏状态泄漏都可能制造假能力。" },
  "deep-exploration": { title: "用不确定性、计数、熵、好奇心与 RND 探索", focus: "比较随机抖动、乐观、后验采样、伪计数、预测误差奖励与信息增益。", situation: "在稀疏奖励迷宫中，访问新房间的内在奖励能推动搜索，但随机电视也会持续产生难预测信号。", boundary: "新奇不等于有用；内在奖励可能偏爱不可预测噪声并偏离外部任务。" },
  "long-horizon-credit": { title: "跨越长延迟分配信用，而不只是增加记忆", focus: "理解稀疏奖励、时间抽象、回报分解、奖励重分配与 hindsight。", situation: "长任务最后才成功时，需要判断早期哪些选择真正促成结果，而不是把同一回报平均归因给所有步骤。", boundary: "时间相关不等于因果贡献；重分配模型可能把可预测但不可控的事件当作功劳。" },
  "mcts-alphazero": { title: "结合搜索、学习引导、自博弈与 MCTS", focus: "从 minimax 与蒙特卡洛树搜索出发，理解 AlphaZero 的策略先验、价值、访问计数与自博弈目标。", situation: "搜索树在选择、扩展、评估和回传间循环，神经网络把计算集中到更有希望的分支。", boundary: "搜索质量受模型、预算和分支因子限制；自博弈覆盖的世界可能比部署环境窄得多。" },
  "dyna-mpc": { title: "学习动力学，并使用 Dyna、MPC、PETS 或 MBPO", focus: "分离模型学习与规划，比较想象数据和在线重规划，跟踪不确定性与复合模型误差。", situation: "MPC 每一步只执行计划的第一个动作，再用新观察重新规划，从而不断修正模型误差。", boundary: "长想象轨迹会累积误差；高回报计划可能只是利用了模型的错误区域。" },
  "latent-world-models": { title: "在学习到的潜在世界中用 Dreamer 与 MuZero 规划", focus: "理解表征、潜在动力学、奖励与价值预测、想象 rollout 及决策等价模型。", situation: "模型不必重建每个像素，只需保留对奖励、价值和动作选择有用的潜在信息。", boundary: "潜在空间难以直接审计；未编码的部署变量可能在训练指标正常时悄然失效。" },
  "behavior-cloning-dagger": { title: "从示范开始：行为克隆与 DAgger", focus: "理解监督模仿、协变量偏移、误差累积、交互式数据聚合与专家查询。", situation: "行为克隆在专家轨迹上准确，却可能因一次小错误进入专家数据从未覆盖的状态并继续失误。", boundary: "DAgger 需要可查询专家且会访问学习者状态；高风险场景不能默认这种在线纠错安全可行。" },
  "inverse-rl-gail": { title: "用逆强化学习、最大熵方法与 GAIL 推断目标", focus: "区分恢复奖励与匹配占用分布，理解奖励歧义、最大熵 IRL 与对抗模仿。", situation: "同一专家行为可能由多种奖励解释；GAIL 可直接匹配状态—动作占用而不声称找到了唯一真实目标。", boundary: "仅凭行为通常无法识别唯一奖励；专家偏差和未观察约束也会被一起模仿。" },
  "offline-rl": { title: "用 BCQ、CQL 与 IQL 从固定日志学习策略", focus: "理解支持不匹配、外推误差、悲观估计、行为约束、保守价值与 expectile 回归。", situation: "日志里从未出现的动作可能被 Q 函数错误高估，策略一旦选择它就进入没有证据的区域。", boundary: "离线 RL 不能证明数据支持之外的行为；数据组成、覆盖和隐藏选择机制必须作为结果的一部分报告。" },
  "decision-transformer": { title: "用 Decision Transformer 把轨迹当作条件序列", focus: "理解 return-to-go 条件、因果序列建模、轨迹 token、行为支持与拼接限制。", situation: "模型根据期望剩余回报、历史状态和动作预测下一个动作，训练形式像监督序列建模。", boundary: "要求更高回报不等于模型能生成数据外的新策略；条件值超出数据支持时尤其危险。" },
  "off-policy-evaluation": { title: "部署前，用旧数据评价新策略", focus: "比较直接建模、重要性采样、加权与逐决策估计、FQE、双重稳健估计和置信区间。", situation: "新策略更偏爱日志中罕见动作时，重要性权重会变大，估计方差随之迅速上升。", boundary: "缺少重叠时无法可靠评价；漂亮的点估计不能替代有效样本量、区间与敏感性分析。" },
  "hierarchical-rl": { title: "用 options、MAXQ、目标与技能复用行为", focus: "理解时间扩展动作、启动与终止条件、半 MDP 备份、目标条件策略与子任务分解。", situation: "“走到门口”可以作为持续多步的 option，被高层策略像普通动作一样选择。", boundary: "错误子目标会限制最优行为；技能也可能塌缩成相似动作而没有真正形成抽象。" },
  "multi-agent-rl": { title: "用 CTDE、VDN、QMIX 与 MADDPG 学习多智能体协作", focus: "理解随机博弈、非平稳性、多智能体信用分配、集中训练分散执行与价值分解。", situation: "每个体都在学习时，另一个体看到的环境不断变化；集中 critic 可在训练时利用联合信息。", boundary: "集中训练可能依赖部署不可用的信息；合作基准上的表现也不能推出对新伙伴或对手的稳健性。" },
  "transfer-meta-generalization": { title: "用多任务、元强化学习与 sim-to-real 跨任务迁移", focus: "区分表征迁移、目标条件、域随机化、适应、元训练、零样本泛化与负迁移。", situation: "在多种摩擦和质量参数上训练机器人，可让策略学会对物理变化更不敏感的行为。", boundary: "训练分布宽不等于覆盖现实；目标任务不匹配时，迁移可能比从头学习更差。" },
  "reward-design": { title: "设计奖励，但不要把分数误当目标", focus: "比较稀疏与稠密奖励、势函数塑形、代理目标、规格博弈、偏好信号与奖励模型审计。", situation: "客服机器人若只奖励快速关单，可能通过提前结束对话拿高分却损害真实服务质量。", boundary: "奖励是可优化代理，不是目标真相；必须检查完整轨迹、反例和真实结果指标。" },
  "safe-robust-risk": { title: "分清安全、约束、鲁棒与风险敏感 RL", focus: "理解 CMDP、成本预算、拉格朗日、屏蔽、鲁棒目标、分布变化、尾部风险与 CVaR。", situation: "平均收益相同的两项策略，可能在最坏 5% 情况中造成完全不同的损失。", boundary: "训练期满足约束不等于部署期保证；模型外事件和传感器故障仍需工程防护与人工处置。" },
  "evaluation-reproducibility": { title: "让 RL 证据经得起随机种子、基线与基准选择", focus: "理解学习曲线、多随机种子、区间估计、聚合指标、消融、调参预算与行为检查。", situation: "只报告最好种子会把随机性伪装成算法优势；应同时展示分布、预算和失败案例。", boundary: "基准分数只支持既定环境与协议下的结论，不能自动证明泛化、稳定或部署价值。" },
  "rl-systems": { title: "构建不篡改算法语义的环境与训练系统", focus: "覆盖 step API、wrapper、动作缩放、种子、向量环境、回放、检查点、实验追踪与回滚证据。", situation: "若 wrapper 把截断误标为终止，学习代码即使无异常也会在回合边界学到错误目标。", boundary: "可运行不是可复现；依赖版本、随机状态、数据管线与恢复流程都必须成为实验记录。" },
  "llm-as-rl": { title: "把 token 生成映射为 RL，并标出 SFT 的边界", focus: "把提示与前缀视为状态、token 视为动作、回复视为轨迹，并区分序列奖励与监督标签。", situation: "语言模型每生成一个 token 都改变下一步前缀，但常常只在完整回复结束后收到一个分数。", boundary: "有偏好数据或加权损失不等于正在做在线 RL；必须明确数据由谁采样、目标如何更新。" },
  "rlhf-ppo": { title: "沿偏好数据、奖励模型、PPO 与 KL 完整追踪 RLHF", focus: "理解成对标签、奖励模型损失、策略采样、价值估计、token 优势、裁剪与 KL 惩罚。", situation: "策略生成回复，奖励模型给序列分数，价值模型把信用分配到 token，再由 PPO 更新。", boundary: "奖励模型可以被钻空子；KL 只限制相对参考策略的偏移，不能证明输出正确或安全。" },
  "direct-preference": { title: "比较 DPO、IPO、KTO、ORPO 与 SimPO，而不把它们都叫 RL", focus: "理解相对对数概率、参考策略、成对或二元反馈、离线支持限制及其与在线 RL 的边界。", situation: "DPO 直接提高偏好回复相对拒绝回复的概率差，无需显式训练奖励模型和在线 rollout。", boundary: "直接偏好优化仍受静态数据覆盖与标签偏差限制；它不会自动探索新行为。" },
  "rlaif-judges": { title: "使用 AI 反馈和宪法规则，但不要把评审模型当真相", focus: "理解 RLAIF、成文原则、批评与修订、评审校准、相关盲点、提示注入与人工审计。", situation: "多个评审模型可能共享训练来源，因此一致同意也可能只是共享同一盲点。", boundary: "自动评审是测量工具而非事实来源；高影响结论需要独立样本、对抗测试与人工复核。" },
  "rlvr-grpo": { title: "用 RLVR、过程奖励与 GRPO 优化可验证结果", focus: "比较结果与过程监督、程序化验证器、组相对优势、无价值基线训练及格式漏洞。", situation: "对同一问题采样一组答案，用组内平均和离散程度形成相对优势，再提高通过验证的回答概率。", boundary: "验证器只奖励它能检查的内容；模型可能利用格式、测试漏洞或训练题泄漏而不具备真实推理能力。" },
  "test-time-compute": { title: "分清 RL 训练、搜索、测试时计算与蒸馏", focus: "比较参数更新与采样、重排、树搜索、工具使用、验证器引导推理、拒绝采样和监督蒸馏。", situation: "同一个冻结模型可以多采样 32 个答案再由验证器选择；性能提升来自额外推理计算而非参数学习。", boundary: "更多采样会放大评审器偏差并增加成本；测试时提升不能直接归因于 RL 训练。" },
  "method-selection": { title: "选择 RL 方法，并明确仍缺哪些部署证据", focus: "依据模型可用性、动作空间、数据来源、可观测性、安全、评估与系统约束缩小方法范围。", situation: "先问能否在线试错、是否有模型或日志、动作是否连续、失败代价多大，再讨论算法家族。", boundary: "方法选择只是候选方案，不是部署许可；必须预先定义停止条件、离线证据、分阶段试验与回滚。" },
};

const TECHNICAL_LABELS: Readonly<Record<string, string>> = {
  State: "状态", Observation: "观察", Action: "动作", Reward: "奖励", Policy: "策略", Value: "价值",
  Target: "目标", Estimate: "估计", Data: "数据", Model: "模型", Search: "搜索", Update: "更新",
  Behavior: "行为策略", Evaluation: "评估", Selection: "选择", Result: "结果", Boundary: "边界",
};

function localizeLabel(label: string): string {
  return TECHNICAL_LABELS[label] ?? label;
}

function makeChineseArticle(article: ChapterArticle, route: CurriculumChapter): ChapterArticle {
  const manuscript = AUTHORED_MANUSCRIPTS[article.slug as keyof typeof AUTHORED_MANUSCRIPTS];
  if (manuscript) return applyChineseManuscript(article, manuscript);

  const brief = ZH_BRIEFS[article.slug];
  if (!brief) throw new Error(`Missing Chinese chapter brief: ${article.slug}`);

  const prior = route.order > 1 ? CURRICULUM[route.order - 2] : undefined;
  return {
    slug: article.slug,
    title: brief.title,
    deck: brief.focus,
    openingQuestion: `面对本章的问题，你能否先指出“数据从哪里来、目标怎样形成、结论在哪些条件下才成立”？`,
    bridge: prior
      ? `上一章处理了“${ZH_BRIEFS[prior.slug].title}”。现在沿着同一条证据链继续：${brief.focus}`
      : `课程不从背算法开始，而从判断问题开始：${brief.focus}`,
    situation: {
      title: `先看一个具体情境：${brief.title}`,
      paragraphs: [
        brief.situation,
        `阅读时先不要急着记名词。先标出当前信息、可选动作、随后出现的反馈，以及这个选择会不会改变下一步能看到的数据。`,
      ],
    },
    diagram: {
      title: `把“${brief.title}”拆成可检查的关系`,
      caption: `图中的每一项都对应后文算例中的一个可观察量或决策步骤；箭头表达依赖关系，不代表未经验证的因果结论。`,
      variant: article.diagram.variant,
      items: article.diagram.items.map((item, index) => ({
        label: localizeLabel(item.label),
        value: item.value,
        latex: item.latex,
        note: `第 ${index + 1} 项展示“${localizeLabel(item.label)}”在本章机制中的位置；请把它与下面算例的同名量对应起来。`,
      })),
    },
    workedExample: {
      title: `算例：用可复算步骤检验直觉`,
      setup: `${brief.situation} 下面保留英文版完全相同的数值、顺序与中间结果，便于两种语言逐项核对。`,
      prediction: `计算前先预测：哪一个量变化后会真正改变最后的决策？`,
      steps: article.workedExample.steps.map((step, index) => ({
        label: `第 ${index + 1} 步 · ${localizeLabel(step.label)}`,
        calculation: step.calculation,
        explanation: `先独立复算这一行，再说明它使用的是观测、估计还是目标。这样可以避免只记住最终数字，却漏掉成立条件。`,
      })),
      result: `这个结果只回答当前设定下的问题。改变数据来源、终止语义、策略或模型假设后，必须重新计算，不能直接沿用结论。`,
    },
    mechanism: {
      introduction: `本章的核心不是记住一个缩写，而是看清：${brief.focus}`,
      sections: [
        { title: "先固定信息边界", paragraphs: [`明确决策时可用的信息、动作影响的对象，以及反馈在时间线上的位置。若这些定义含糊，后面的公式即使能算也没有稳定语义。`] },
        { title: "再追踪目标与数据", paragraphs: [`区分真实采样、模型预测和自举估计，并检查训练数据由哪个策略产生。算法之间最关键的差异常藏在“下一步由谁选择、由谁评价”。`] },
        { title: "最后验证结论范围", paragraphs: [`用多个随机种子、未见情形和失败案例检查机制，而不是只看一个平均分。${brief.boundary}`] },
      ],
    },
    equations: article.equations.map((equation, index) => ({
      latex: equation.latex,
      read: `公式 ${index + 1}：按时间下标、条件符号和求和或最大化范围逐项读取。`,
      meaning: `它把上文可见的量压缩成同一关系；大写随机变量、下标时刻与小写求和变量各有不同角色，不能互换。`,
    })),
    boundary: { title: "结论在这里停止外推", paragraphs: [brief.boundary, `若这些条件无法由日志、实验或运行监控证明，就应把结论标为未知，而不是把训练分数当作部署证据。`] },
    nextBridge: route.order < CURRICULUM.length
      ? `下一章继续处理“${ZH_BRIEFS[CURRICULUM[route.order].slug].title}”，并复用本章已经明确的数据、目标与边界。`
      : `回到课程地图，依据数据、模型、风险和评估条件选择方法，并明确部署前仍缺哪些证据。`,
    sources: article.sources,
  };
}

export const ZH_CHAPTER_ARTICLES: readonly ChapterArticle[] = CHAPTER_ARTICLES.map((article, index) => makeChineseArticle(article, CURRICULUM[index]));

const enBySlug = new Map(CHAPTER_ARTICLES.map((chapter) => [chapter.slug, chapter]));
const zhBySlug = new Map(ZH_CHAPTER_ARTICLES.map((chapter) => [chapter.slug, chapter]));

export function getLocalizedChapterArticle(language: Language, slug: string): ChapterArticle {
  const article = (language === "zh" ? zhBySlug : enBySlug).get(slug);
  if (!article) throw new Error(`Missing ${language} chapter article: ${slug}`);
  return article;
}

export function getChineseBrief(slug: string): ChineseChapterBrief {
  const brief = ZH_BRIEFS[slug];
  if (!brief) throw new Error(`Missing Chinese chapter brief: ${slug}`);
  return brief;
}
