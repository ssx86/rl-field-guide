import { compactChineseManuscript as c, type CompactChineseManuscript } from "@/content/zh-manuscripts/types";

const seeds: Readonly<Record<string, CompactChineseManuscript>> = {
  "llm-as-rl": {
    title: "把一句回复放回序列决策", deck: "生成一个 token 会改变后续前缀，整段回复常只得到一个分数。LLM 的 RL 表述由此连接状态、动作、策略、轨迹与信用分配。", question: "下一个 token 有监督标签，和整段回复有偏好分数，是同一个学习问题吗？", bridge: "经典 RL 讨论的时间、行为策略和回报，在语言模型里并没有消失，只是被藏进自回归生成。", sceneTitle: "每写一个词，下一步能写什么就变了", story: ["提示与已生成前缀构成状态，token 是动作，语言模型分布是策略，完整回复是一条轨迹。终止可以是 EOS、长度上限或外部停止规则。", "SFT 对日志中的下一个 token 做监督预测；RL 则依据整段结果改变所采样 token 的概率。两者都用梯度，却依赖不同证据。", "奖励通常在回复结束后到达，早期措辞与最终得分之间隔着长信用链。若评分器可被钻空子，模型会优化评分接口而非用户真正需要的结果。"],
    mapTitle: "语言生成的 RL 接口", mapCaption: "先把时间线写清，才能判断 PPO、DPO 或验证奖励究竟使用了什么数据。", path: [
      { label: "状态", value: "prompt + prefix", note: "决策时已可见的上下文。", explanation: "确认没有未来 token 或评分泄漏。" },
      { label: "动作", value: "next token", note: "从词表分布采样。", explanation: "保存采样温度、截断与旧 log-prob。" },
      { label: "轨迹", value: "response", note: "直到 EOS 或停止条件。", explanation: "区分真实终止和长度截断。" },
      { label: "反馈", value: "sequence reward", note: "常在结尾才出现。", explanation: "分开记录奖励模型、规则与人工信号来源。" },
    ], exampleTitle: "同一句开头，为何在两个提示下价值不同", exampleSetup: "模型都先生成“Certainly”，一个提示要求礼貌解释，另一个提示要求只输出 JSON。", prediction: "token 本身能否脱离前缀拥有固定价值？", result: "不能。动作价值取决于完整状态；在 JSON 任务里，这个 token 可能立刻破坏格式。", mechanismIntro: "语言模型 RL 沿用经典定义，却有极大动作空间和终局奖励。", mechanics: [
      { title: "自回归分解就是策略分解", paragraph: "整段回复概率等于各 token 条件概率之积，因此序列概率比会累积每一步变化。" },
      { title: "SFT 学行为，RL 学结果加权", paragraph: "SFT 模仿数据 token；RL 根据回报提高或降低已采样动作概率。" },
      { title: "KL 约束保留参照行为", paragraph: "它限制策略远离参考模型，既管理可读性也控制在策略数据快速过期。" },
      { title: "停止规则属于环境", paragraph: "EOS、max tokens 与拒答终止会改变回报和自举边界，不能被当作纯 UI 配置。" },
    ], equations: [
      { read: "回复概率是每个 token 在其前缀条件下概率的乘积。", meaning: "任何早期 token 都会改变后面所有条件分布。" },
      { read: "序列回报可写为最终评分减去相对参考策略的 KL 成本。", meaning: "优化的是评分与分布距离的组合，不是无条件最大化评分器。" },
    ], boundaryTitle: "把 token 叫动作，不会自动让任务适合 RL", boundaries: ["若有可靠逐 token 标签，监督学习可能更简单；RL 的价值取决于结果反馈是否提供额外信息。", "语言质量、事实性与安全不能由单一标量完整代表，仍需分项评估与人类审查。"], next: "有了这套映射，下一章具体拆解 RLHF：奖励模型怎样训练，PPO 又如何在 KL 约束下更新语言策略。",
  },
  "rlhf-ppo": {
    title: "RLHF 的三段流水线，任何一段都可能带偏下一段", deck: "SFT 提供初始策略，偏好数据训练奖励模型，PPO 再优化该模型并受 KL 约束。最终能力受三份数据与三套误差共同限制。", question: "奖励模型更喜欢一条回复，PPO 应该把它的概率提高多少？", bridge: "上一章把回复看成轨迹。RLHF 把人类比较转换成可重复评分，再用在策略方法更新整条生成分布。", sceneTitle: "人类只比较两条回复，策略却会探索成千上万种新回复", story: ["奖励模型学习同一提示下 chosen 比 rejected 得分高。它在标注分布附近可能可靠，PPO 优化后却会主动寻找模型从未见过的高分区域。", "策略 rollout 记录旧 log-prob，价值头估计基线，GAE 形成 token 优势，PPO-Clip 复用批次；参考模型 KL 抑制过度漂移。", "奖励上涨、KL 合理、损失平稳都不等于人类偏好真的改善。必须用保留评审、对抗提示和事实安全指标重新评价。"],
    mapTitle: "从偏好到策略的误差传递", mapCaption: "每个阶段都要有独立验证集，不能让下游优化指标为上游模型自证。", path: [
      { label: "SFT", value: "示范 token", note: "建立可用初始行为。", explanation: "记录示范来源和拒答、格式覆盖。" },
      { label: "偏好", value: "chosen vs rejected", note: "标注者与采样策略决定分布。", explanation: "检查一致性、位置偏差和长度偏好。" },
      { label: "奖励模型", value: "scalar score", note: "只拟合比较信号。", explanation: "按主题与难度做保留集校准。" },
      { label: "PPO", value: "reward − βKL", note: "在评分与漂移间取舍。", explanation: "同时看真实评审、KL、熵和长度。" },
    ], exampleTitle: "奖励高 2 分，不等于概率比可以无限增大", exampleSetup: "某回复优势为正，新旧策略比已超过裁剪上界。", prediction: "继续提高该回复概率，还会改善 PPO 裁剪目标吗？", result: "正优势样本的收益被封顶；KL 还会继续惩罚漂移。两者共同阻止单条偏好样本无限推动策略。", mechanismIntro: "RLHF 是系统而非单一算法名。", mechanics: [
      { title: "Bradley–Terry 把分数差变成偏好概率", paragraph: "奖励绝对值不可辨识，重要的是同提示回复间的差；数据偏差会直接进入模型。" },
      { title: "Token 优势共享序列评分", paragraph: "价值头与 GAE 尝试把终局反馈分给各 token，估计误差会影响更新方向。" },
      { title: "KL 有两种常见角色", paragraph: "它可作为奖励惩罚，也可作为监控或自适应控制目标；实现必须说明放在哪里。" },
      { title: "PPO 优化的是奖励模型", paragraph: "人类意图只通过训练数据间接进入，策略可能利用评分器盲点。" },
    ], equations: [
      { read: "偏好模型用两条回复分数差的 sigmoid 表示 chosen 获胜概率。", meaning: "它学习相对排序，不给分数绝对尺度现实含义。" },
      { read: "RLHF 奖励常把奖励模型分数减去策略相对参考模型的 token KL 成本。", meaning: "β 决定优化评分与保留参考行为之间的权衡。" },
    ], boundaryTitle: "奖励模型不是自动化的人类", boundaries: ["标注者群体、指南和候选生成策略限定了它学到的偏好。", "PPO 训练指标不能替代盲评、事实核验、越狱测试与上线监控。"], next: "若已有成对偏好，是否一定要先训练标量奖励再跑 PPO？下一章比较 DPO 及其他直接偏好优化。",
  },
  "direct-preference": {
    title: "跳过显式奖励模型，直接移动偏好概率", deck: "DPO 把 KL 正则化 RL 的最优策略关系改写成分类损失；实现更简洁，却仍受偏好数据支持、参考模型和离线分布限制。", question: "只凭 chosen 与 rejected，能否直接训练策略而不运行在线 PPO？", bridge: "RLHF 先把偏好压成 reward，再由策略优化器读取。直接偏好方法把两步合并，对策略与参考模型的相对对数概率做监督。", sceneTitle: "简化了流水线，没有消除数据假设", story: ["DPO 提高 chosen 相对 rejected 的隐式奖励差。参考模型提供锚点，β 控制偏好拟合与策略漂移。", "训练像分类，不需在线 rollout、价值头或 GAE，因此工程更稳定；但数据仍由某个旧策略产生，无法展示新策略在未见回复上的偏好。", "长度、格式和候选难度会影响对数概率总和。若 chosen 普遍更长，模型可能学到数据偏差而非内容质量。"],
    mapTitle: "一对偏好怎样进入 DPO", mapCaption: "要同时计算策略与参考模型对两条完整回复的条件 log-prob。", path: [
      { label: "提示", value: "x", note: "两条回复共享同一条件。", explanation: "确保配对没有跨提示混淆。" },
      { label: "偏好对", value: "y⁺, y⁻", note: "chosen 与 rejected。", explanation: "检查长度、位置和采样来源偏差。" },
      { label: "相对变化", value: "logπ−logπref", note: "参考模型作锚。", explanation: "分别统计 chosen、rejected 的隐式奖励。" },
      { label: "分类损失", value: "−log σ(βΔ)", note: "提高偏好间隔。", explanation: "监控间隔、KL 与独立胜率。" },
    ], exampleTitle: "策略同时降低两条回复概率，仍可能降低损失吗", exampleSetup: "相对参考模型，chosen 下降 1，rejected 下降 3。", prediction: "chosen 绝对概率下降，DPO 仍会认为偏好间隔改善吗？", result: "会。DPO 关注两者相对变化，chosen 比 rejected 少下降 2，隐式奖励差仍扩大。", mechanismIntro: "直接偏好优化改变了训练路径，不改变证据来源。", mechanics: [
      { title: "DPO 来自 KL 正则化最优策略", paragraph: "在特定奖励—策略关系下，奖励差可由策略相对参考模型的 log-ratio 表达。" },
      { title: "β 同时影响间隔尺度与漂移", paragraph: "它不是普通学习率；不同实现约定要结合公式确认方向。" },
      { title: "离线偏好会过期", paragraph: "策略改变后产生的新回复可能落到原偏好集之外，训练损失无法评价它们。" },
      { title: "变体改变的是损失假设", paragraph: "IPO、ORPO、KTO 等对噪声、配对或参考模型做不同处理，不能只凭名字判断优劣。" },
    ], equations: [
      { read: "DPO 比较 chosen 与 rejected 的策略—参考 log-ratio 差，并通过 sigmoid 分类。", meaning: "损失鼓励相对偏好，不直接拟合一个可独立读取的奖励分数。" },
      { read: "隐式奖励与策略相对参考的对数概率比成正比。", meaning: "参考模型和 β 共同定义何种概率变化算作偏好提升。" },
    ], boundaryTitle: "离线分类稳定，不等于在线行为可靠", boundaries: ["模型可在训练对上提高间隔，却在自由生成时产生新型退化。", "偏好数据不覆盖事实正确、安全和长期交互时，DPO 也无法从损失中补出这些目标。"], next: "偏好标签也可由模型评审生成。下一章讨论 RLAIF、宪法式规则与 judge 的偏差怎样进入训练闭环。",
  },
  "rlaif-judges": {
    title: "让模型当评委，会把谁的偏见规模化", deck: "RLAIF 用模型反馈扩展偏好数据；规则与 judge 提高覆盖，也会复制位置偏差、自我偏好和可被利用的评分捷径。", question: "评委模型与被训练模型相似时，高一致率意味着客观吗？", bridge: "直接偏好方法假定比较标签已经存在。模型评审可以快速生成大量标签，但“便宜且一致”与“判断正确”不是同一件事。", sceneTitle: "评委越稳定，系统性偏差也越稳定", story: ["宪法式方法先提供原则，让模型批评、修订或比较回答。Judge 可以按 rubric 给分、成对选择或验证约束。", "位置、长度、措辞风格和模型家族都会影响判断。若训练策略逐渐学会评委偏爱的格式，它可能提高 judge 分数而不改善真实质量。", "可靠流程需要交换顺序、多个独立评委、人类校准集和不确定时弃权。评委输出是测量，不是地面真相。"],
    mapTitle: "把自动评审当作一台需要校准的仪器", mapCaption: "先定义 rubric，再测偏差、重复性与对人类标准的外部效度。", path: [
      { label: "规范", value: "原则 / rubric", note: "把评价维度写清。", explanation: "用正反例检查规则是否可执行。" },
      { label: "评审", value: "score / preference", note: "保留解释与置信度。", explanation: "随机交换候选位置并重复采样。" },
      { label: "校准", value: "human gold", note: "比较分层一致性。", explanation: "按主题、语言与风险类别报告误差。" },
      { label: "治理", value: "ensemble / abstain", note: "分歧时升级处理。", explanation: "为低置信和高风险样本设置人工门。" },
    ], exampleTitle: "交换 A/B 顺序后，评委改票了", exampleSetup: "同两条回复第一次 A 在前、第二次 B 在前；judge 两次都偏爱第一个。", prediction: "高确定性分数还能被解释为内容偏好吗？", result: "不能。它暴露位置偏差。训练前应随机顺序、估计偏差并在必要时校正或弃用。", mechanismIntro: "规模化反馈的前提，是知道评审器在哪些地方不可靠。", mechanics: [
      { title: "规则把价值判断外显", paragraph: "明确原则便于审计，也可能互相冲突；冲突解决顺序属于规范的一部分。" },
      { title: "Judge 偏差可被策略学习", paragraph: "任何稳定评分捷径都会成为优化目标，包括冗长、引用外观或特定礼貌套话。" },
      { title: "集成只减少部分方差", paragraph: "相似模型可能共享盲点，一致并不证明独立。" },
      { title: "校准需要外部标准", paragraph: "人类金标也应记录分歧与不确定性，不能把多数票伪装成唯一真理。" },
    ], equations: [
      { read: "评委偏好率是在随机化顺序与采样条件下，选择某候选的频率。", meaning: "不控制顺序和温度，频率会混合内容与测量偏差。" },
      { read: "多评委聚合按各自可靠性或投票组合输出。", meaning: "权重需要校准证据；共同偏差不会因投票数量增加而消失。" },
    ], boundaryTitle: "自动评审不能审计自己未被要求看的东西", boundaries: ["Rubric 漏掉的事实、安全或用户影响，不会因 judge 更强而出现。", "高风险标签应保留人工复核、来源追踪和申诉路径。"], next: "当答案可以由代码、数学或规则自动核验时，反馈比偏好更硬。下一章讨论 RLVR 与 GRPO，以及可验证并不等于完整。",
  },
  "rlvr-grpo": {
    title: "答案可验证时，奖励更硬；目标仍可能不完整", deck: "RLVR 用程序化验证器提供结果奖励，GRPO 用同题多样本的组内相对表现构造优势，减少对独立价值模型的依赖。", question: "数学答案判对就够了吗，推理过程里的漏洞怎么办？", bridge: "模型评审是有噪测量；代码测试、符号检查或明确答案能提供更确定的反馈。可验证性提高了信号精度，也把优化压力集中到验证器定义的那一小块。", sceneTitle: "通过测试，并不保证程序做对了全部事情", story: ["RLVR 为每个生成结果运行验证器，正确得 1，错误得 0 或分项分数。稀疏但客观的奖励适合数学、代码和格式任务。", "GRPO 对同一提示采样一组回答，用组内均值与标准差形成相对优势，再进行带裁剪与 KL 的策略更新，无需单独 critic。", "若整组都错，标准化仍会选出“没那么错”的样本；若验证器有漏洞，模型会学会通过漏洞。必须监控绝对正确率，而不只组内优势。"],
    mapTitle: "从一组回答到一次更新", mapCaption: "组内标准化是方差降低工具，不应取代绝对质量门槛。", path: [
      { label: "同题采样", value: "G 个回答", note: "保持提示相同。", explanation: "记录温度、去重与组大小。" },
      { label: "验证", value: "r₁…rG", note: "运行确定性或分项检查。", explanation: "对验证器做反例与安全沙箱测试。" },
      { label: "相对优势", value: "(r−mean)/std", note: "组内比较。", explanation: "处理零方差组并保留原始奖励。" },
      { label: "策略更新", value: "clip + KL", note: "提高较优样本概率。", explanation: "同时观察 pass rate、KL 和长度。" },
    ], exampleTitle: "一组答案全错，GRPO 仍会产生正优势", exampleSetup: "四个答案得分 0、0、0、0.1，但 0.1 仍未达到正确门槛。", prediction: "最高分样本会不会被相对标准化视为正例？", result: "会。它比组均值高，却仍绝对错误。训练报告必须同时展示验证通过率和组内统计。", mechanismIntro: "可验证反馈让奖励可复算，也让验证器成为新的攻击面。", mechanics: [
      { title: "Verifier 定义了可优化接口", paragraph: "单元测试、答案匹配和格式检查各自只覆盖一部分正确性。" },
      { title: "组相对优势省去 critic", paragraph: "同题样本共享难度基线，减少价值拟合；代价是依赖组内多样性。" },
      { title: "零方差组需要明确处理", paragraph: "全同奖励时标准差为零，跳过、加 ε 或用其他基线会产生不同算法行为。" },
      { title: "过程监督是另一类证据", paragraph: "结果正确不保证推理忠实，逐步验证能补充但也可能限制合理的替代路径。" },
    ], equations: [
      { read: "GRPO 优势是单个奖励减组均值，再除以组标准差。", meaning: "它表达同题相对排名，不表达跨题绝对难度或是否达标。" },
      { read: "策略目标使用概率比裁剪，并加入相对参考模型的 KL 控制。", meaning: "组优势决定方向，裁剪与 KL 管理每批数据上的策略位移。" },
    ], boundaryTitle: "可验证只覆盖验证器写出的世界", boundaries: ["测试套件遗漏的副作用、复杂度和安全问题仍可能被策略利用。", "沙箱、资源限制和验证器版本必须纳入实验记录，否则奖励本身不可复现。"], next: "训练之外，模型还可以在回答时花更多计算。下一章讨论搜索、采样与验证组成的 test-time compute。",
  },
  "test-time-compute": {
    title: "把更多计算花在回答时，而不是只花在训练时", deck: "测试时计算通过多样本、自洽、搜索、过程奖励与验证器在一次请求内改进答案；收益取决于候选多样性和选择器可靠性。", question: "生成一百个答案再选一个，什么时候真的比只生成一次更好？", bridge: "RLVR 用验证器训练策略；同样的验证或评分也可在推理时使用。此时问题变成预算如何分配给生成、搜索和选择。", sceneTitle: "候选更多，只有评选机制能认出好答案才有用", story: ["Best-of-N 采样 N 个候选，由奖励模型或验证器选最高。自洽对多个推理结果投票，树搜索则在中间步骤分配更多预算。", "若候选高度相似，N 增加只是在重复同一错误；若选择器失校，更大 N 反而更容易找到它的评分漏洞。", "计算曲线应报告准确率随 token、延迟和成本的变化。只比最终最高分，会隐藏方法用了多少并行采样和外部工具。"],
    mapTitle: "测试预算的三种去向", mapCaption: "生成宽度、推理深度与验证强度应分别计费和评估。", path: [
      { label: "生成", value: "N candidates", note: "扩大候选覆盖。", explanation: "测量去重后真正不同的候选数。" },
      { label: "展开", value: "search depth", note: "在中间状态继续推理。", explanation: "记录分支与回溯策略。" },
      { label: "验证", value: "judge / tool", note: "选择或剪枝。", explanation: "用保留集校准选择器排名能力。" },
      { label: "停止", value: "budget / confidence", note: "边际收益不足时结束。", explanation: "报告动态停止规则和最坏延迟。" },
    ], exampleTitle: "Best-of-64 为什么可能比 Best-of-8 更差", exampleSetup: "奖励模型偏爱冗长格式，采样越多越容易出现极端冗长候选。", prediction: "增加 N 是否必然提高真实质量？", result: "不必然。极值选择会放大奖励模型偏差；真实质量可能在 N 增大后下降。", mechanismIntro: "测试时计算由提议分布和选择器共同决定。", mechanics: [
      { title: "Best-of-N 依赖尾部排序", paragraph: "选择器不仅要平均相关，还要在大量候选的高分尾部保持校准。" },
      { title: "自洽需要错误不完全相关", paragraph: "若所有样本共享同一误解，多数票只会更自信地错。" },
      { title: "搜索需要可评价中间状态", paragraph: "过程奖励或价值函数若不能判断半成品，树会把预算投向错误分支。" },
      { title: "预算是产品约束", paragraph: "延迟、token、并发与工具调用成本决定方法是否可部署。" },
    ], equations: [
      { read: "Best-of-N 从策略独立采样 N 个候选，再取评分最高者。", meaning: "独立性、候选多样性与评分器尾部校准共同决定增益。" },
      { read: "计算缩放曲线把任务性能写成推理预算的函数。", meaning: "应比较相同成本点，而不是拿不同预算的最高结果直接排名。" },
    ], boundaryTitle: "更多思考也会更有力地利用错误评价器", boundaries: ["若验证器、judge 或工具结果有偏，搜索会集中放大偏差。", "高预算平均收益不能掩盖最坏延迟、资源公平和拒绝服务风险。"], next: "所有方法已经走过一遍。最后一章不再堆算法，而是从问题条件反推方法、基线与证据计划。",
  },
  "method-selection": {
    title: "最后别问“哪个算法最强”，先问问题允许什么", deck: "方法选择由反馈、数据来源、模型可用性、动作空间、风险与评估权限共同决定。合适的答案常是一条验证路线，而不是一个算法名。", question: "面对新任务，怎样从条件推到候选方法，而不是从热门算法倒推理由？", bridge: "一路走来，每种方法都解决了前一种方法暴露的具体问题。现在把这条历史反过来使用：从眼前限制逐层排除不必要的复杂度。", sceneTitle: "一个成熟的方案，先写未知，再写算法", story: ["若正确动作标签充分，先做监督学习；动作不改变未来时，用上下文老虎机；模型完整可枚举时，优先规划。只有序列后果与策略学习都不可避免，RL 才真正进入候选。", "有在线交互就考虑探索代价；只有固定日志就先做覆盖审计和行为克隆基线；有准确模型可用搜索或 MPC；连续动作、部分可观测与多智能体再分别增加相应结构。", "高风险任务的首要输出可能不是策略，而是缺失证据清单：哪些动作无覆盖、哪些约束无保证、哪类失败无法在模拟器复现。"],
    mapTitle: "从约束出发的选择路线", mapCaption: "每一步都给出可否决条件，防止复杂方法凭品牌直接入场。", path: [
      { label: "问题形状", value: "预测 / 搜索 / 序列决策", note: "确认动作是否改变未来。", explanation: "用时间线和反事实基线证明需要 RL。" },
      { label: "证据来源", value: "在线 / 日志 / 模型 / 示范", note: "决定可学习的反事实范围。", explanation: "画出覆盖与不可访问区域。" },
      { label: "现实约束", value: "风险 / 延迟 / 计算", note: "排除不可部署方法。", explanation: "把约束写成验收指标而非口头提醒。" },
      { label: "最小基线", value: "规则 / BC / 规划 / bandit", note: "复杂度必须赢得资格。", explanation: "统一预算比较，并保留失败案例。" },
    ], exampleTitle: "推荐问题为何不一定需要完整 RL", exampleSetup: "商品推荐影响本次点击，但用户下一次访问几乎不受当前推荐影响；日志含丰富上下文与点击。", prediction: "应先从 DQN、PPO 还是上下文老虎机开始？", result: "若跨时影响可忽略，上下文老虎机直接对应问题，并减少状态转移与长信用的额外假设。应先验证这一基线。", mechanismIntro: "方法选择是一连串证据门，而不是算法排行榜。", mechanics: [
      { title: "先证明问题需要序列决策", paragraph: "奖励名称、智能体界面或长日志都不足以证明 RL 必要。" },
      { title: "再匹配数据与目标", paragraph: "在线算法需要探索权限，离线算法需要支持，模型式方法需要可验证模型。" },
      { title: "复杂度要换来可测收益", paragraph: "每增加记忆、层级、搜索或分布式组件，都应对应一个已观察瓶颈和一项消融。" },
      { title: "部署方案包含拒绝与回退", paragraph: "策略何时不行动、何时交给规则或人工，与“正常时选什么”同样重要。" },
    ], equations: [
      { read: "方法选择可表述为在性能、风险、数据与计算约束下寻找可行方案。", meaning: "最优只在明确约束与证据范围内有意义。" },
      { read: "期望净收益应扣除采样、计算、失败与维护成本。", meaning: "基准分数的小幅提升可能不足以支付系统复杂度。" },
    ], boundaryTitle: "课程地图不是处方", boundaries: ["真实项目常缺少关键事实；无法确认覆盖、奖励或风险时，应先设计测量而非强行选算法。", "方法会随数据与部署条件改变。选择结论必须带日期、版本和重新评估触发条件。"], next: "回到 Chapter 00，再沿九次问题转向重读全景。第二遍时，算法不再是一串名字，而是一组由限制条件逼出来的选择。",
  },
};

export const PART_NINE_CHINESE_MANUSCRIPTS = Object.fromEntries(Object.entries(seeds).map(([slug, seed]) => [slug, c(seed)])) as Readonly<Record<string, ReturnType<typeof c>>>;
