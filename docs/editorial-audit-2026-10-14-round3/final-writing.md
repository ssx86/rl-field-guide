# RL Field Guide：独立写作质量验收

**First-pass verdict: NEEDS FIX**

本轮是一次全新的成品阅读，没有查阅本目录下其他审稿报告，也没有修改产品源文件。验收对象包括 Chapter 00、46 个英文深读页及其 46 个中文对应页；检查重点是文章节奏、中文写作、例子与机制的关系、双语等价、公式符号和中文页英文泄漏。

## 已经通过的部分

### 1. “短标题 + 一句摘要”的 PPT 节奏已经消失

深读页的机制区现在把小标题并入正文段首，不再把四个概念做成四张卡片。`src/pages/[lang]/learn/[lesson].astro` 中的每个 `mechanism-passage` 直接生成连续段落；`src/styles/guide.css` 用 `display: contents` 取消额外容器的视觉边界，也不再出现旧的橙色短线、分隔线和大号三级标题。构建产物中，旧文案“这个例子真正说明了什么 / 现在给它一个名字”以及 `prose-marker`、`prose-subsection` 均为 0；MCTS 中文页的机制区为四个连续段落。

中文 184 个机制段落均不少于 100 个字符并至少包含三个完整句子。实际抽读时，它们通常按“定义或动作—为何如此—什么条件下失效”展开，不再像演示文稿备注。Chapter 00 的九次转折也保持了同一台送货机器人的叙事线，段落之间确实由前一办法的失败推动下一问题，而不是算法名录。

### 2. 中文已经自然、具体，未发现成片模板套话

逐章检查没有发现旧式的“先固定……再追踪……最后验证……”脚手架，也没有发现多个章节复用同一教学段落。句子长短、开头和论证动作都有变化；“动作怎样改变数据”“模型怎样被规划器利用”“约束如何在执行层生效”等表述都落到了具体机制，而不是用“至关重要”“全面提升”之类空话填充。

`Judge`、`Verifier`、`Wrapper`、`rollout`、`return-to-go` 等英文出现在专业术语或代码接口语境中，不属于说明性英文泄漏。中文算例中的普通英文操作句已经本地化；剩余整段英文主要是原始资料标题和资料类型，位置正确。

### 3. 例子能够解释机制，公式渲染与大小写检查通过

46 个章节都用一个可计算或可追踪的例子进入机制，不是只复述定义。例如：DQN 用 `terminated` 与 `truncated` 的掩码差异解释自举；Double DQN 用选择与评价分离解释高估；GRPO 用全错组解释相对优势为何仍可能为正；MCTS 用先验与访问计数的分歧解释搜索目标。

中英文共享同一组 LaTeX；图中显式数学项也共享相同 LaTeX。严格 KaTeX 渲染测试、下标索引锁定测试和中英公式恒等测试均通过。`npm run build` 生成 97 个静态页面，0 error。没有发现把 `Q`/`q`、`V`/`v`、`S_t`/`s` 或 `terminated`/`truncated` 无意互换的公式错误。

## 必须修复的问题

### [P1] 中英文机制正文并不等价；语言切换会换掉知识点

两种语言都写得正确，并不等于它们是同一篇教程的两个版本。当前多个章节的四段机制正文选择了不同主题：有时只是调换顺序，有时中文直接省略英文中的关键机制，换成另一个同样合理、但不同的知识点。读者切换语言后会获得不同的心智模型，这会破坏“双语教程”的核心承诺。

可定位证据：

1. **Monte Carlo**：英文第四段解释“完整回合既是优点也是限制”，指出持续任务、长对话和罕见终点会让完整回报不可行（`src/content/chapters/part-2.ts:210`）。中文四段改为“完整回报、样本可比性、exploring starts、离策略权重”，没有对应这项局限；其中新增内容位于 `src/content/zh-manuscripts/part-2.ts:133-134`。

2. **DQN family**：英文有一整段解释 C51/quantile 的回报分布不是置信区间（`src/content/chapters/part-3.ts:193`）。中文四段是 Double、Dueling、PER、Rainbow；C51 只在 Rainbow 的组件清单里出现（`src/content/zh-manuscripts/part-3.ts:63-66`），中文读者没有得到分布型价值的机制解释。

3. **Actor–Critic + GAE**：英文单独区分 A2C 的同步批处理与 A3C 的异步陈旧梯度（`src/content/chapters/part-3.ts:292`）。中文把这一段换成优势标准化的批次尺度问题（`src/content/zh-manuscripts/part-3.ts:100`）。两个主题都值得讲，但不是互译，也不能互相替代。

4. **POMDP / memory**：英文第四段讲动作可改变可观测性，诊断测试虽有即时成本，却可能通过减少不确定性而有价值，即 dual control（`src/content/chapters/part-4.ts:43`）。中文第四段改讲隐藏状态重置语义（`src/content/zh-manuscripts/part-4-5.ts:15`）。中文因此缺少“信息本身可以成为行动价值”的关键转折。

5. **Deep exploration**：英文依次解释认知/偶然不确定性、计数表示、curiosity 与 RND；中文依次讲乐观、后验采样、预测误差两种来源、状态熵。中文公式与资料仍包含 RND，但机制正文没有解释固定随机目标与预测器如何产生新奇信号；英文对应机制在 `src/content/chapters/part-4.ts:93`，中文替换段落在 `src/content/zh-manuscripts/part-4-5.ts:32`。

6. **Off-policy evaluation**：英文最后一段提醒“从许多候选策略中挑 OPE 最高者”会消耗评估证据并引入选择偏差，需要独立选择/终评数据或多重比较校正（`src/content/chapters/part-6.ts:243`）。中文四段改为直接法、重要性采样、FQE、双重稳健，见 `src/content/zh-manuscripts/part-6.ts:80-83`，完全没有这项部署前最容易犯的评估错误。

同类偏移还出现在 linear approximation、neural approximation、DQN、continuous control、MCTS/AlphaZero、latent world models、Decision Transformer、hierarchical RL、multi-agent RL、evaluation/reproducibility、RL systems、LLM-as-RL、RLHF、direct preference、RLVR 与 test-time compute。它们不都构成事实错误，但合起来已经是系统性的双语不等价，而非偶发措辞差异。

**最小可接受修法：**把每章英文四段和中文四段做一张“机制覆盖矩阵”，先确定该章不可缺少的四个教学出口。允许两种语言用不同例子、不同句式和不同段落顺序，但每个不可缺少的概念、限制和部署含义必须在两种语言都出现。若中文新增的内容确实更好，应同步补进英文；若英文内容是课程主线所需，应在中文补齐。不要机械逐句翻译，也不要为追求四段整齐而删除现有中文中更好的解释。

## 结论

从纯写作与页面节奏看，这一轮已经解决用户截图中的主要问题；中文也达到了可读、细致、无明显 AI 套话的水平。公式、大小写、渲染和中文页英文泄漏均未发现阻断项。

但目前还不能给出 PASS：语言切换会换掉若干关键知识点，读者无法把英文页与中文页视为同一课程的等价版本。完成逐章机制覆盖对齐后，再做一次只检查“双语等价”的独立复审即可；没有必要推翻现在的文章式布局与中文文风。

## 附录：46 章双语机制覆盖矩阵

判定口径：

- **SAME**：四个核心教学出口在两种语言中都能找到；允许例子、展开方式和分段边界不同。
- **ORDER-ONLY**：四个出口都在，只是顺序发生变化。
- **MISSING-OR-SUBSTITUTED**：至少一个出口缺失，或被另一个有价值但不同的知识点替代。

本矩阵只比较每章 `mechanism.sections` 的四段正文，不拿标题、情境、边界或公式中的一句带过，替代机制正文应当完成的解释。统计结果：**18 SAME、1 ORDER-ONLY、27 MISSING-OR-SUBSTITUTED**。

| # | Chapter | English 四段核心出口 | 中文四段核心出口 | 判定 | 最小修复 |
|---:|---|---|---|---|---|
| 01 | `before-rl` | 策略产生行为；后果替代逐动作答案；探索改变数据；回报评价轨迹 | 策略产生行为；后果替代逐动作答案；探索改变数据；回报评价轨迹 | SAME | — |
| 02 | `interaction-loop` | state/observation 承诺；策略的信息边界；转移核是分布；轨迹保留因果顺序 | 状态/观察承诺；策略的信息边界；转移核是分布；轨迹保留因果顺序 | SAME | — |
| 03 | `return-horizon` | 回报下标；γ 的优先级与学习影响；episodic/continuing 差异；终止/截断 | 回报下标；有效时域；折扣不是定义；终止/截断 | SAME | — |
| 04 | `probability-expectation` | 随机变量；条件；随机策略分布；期望线性但目标未必 | 随机变量；条件；随机策略分布；期望线性但目标未必 | SAME | — |
| 05 | `bandits-contextual-bandits` | 平稳奖励的样本均值；探索规则的信念；遗憾；contextual bandit | 平稳奖励的样本均值；探索规则的信念；遗憾；上下文老虎机 | SAME | — |
| 06 | `mdp-state-design` | 马尔可夫充分性；奖励与转移共享不确定性；占用分布与覆盖；有限时域中的时间 | 马尔可夫充分性；奖励依赖实际转移；策略决定覆盖；有限时域中的时间 | SAME | — |
| 07 | `value-bellman` | vπ；qπ；期望与最优方程；贝尔曼误差的证据边界 | vπ；qπ；期望与最优方程；贝尔曼误差的证据边界 | SAME | — |
| 08 | `dynamic-programming` | 策略评估固定点；策略改进定理；价值迭代；异步规划 | 策略评估固定点；一步前瞻与策略改进；价值迭代；扫掠顺序 | SAME | — |
| 09 | `monte-carlo` | 完整真实回报；on-policy 覆盖；off-policy likelihood ratio；必须等回合完成的利弊 | 完整真实回报；样本可比性；exploring starts 的现实限制；off-policy 权重方差 | MISSING-OR-SUBSTITUTED | 在中文补回“完整回合既是优点也是限制”；若保留“样本可比性”，同步加入英文或并入第一段。 |
| 10 | `td-traces` | 自举的延迟/偏差权衡；n-step；λ 混合；资格迹不是因果 | 自举的延迟/偏差权衡；n-step；λ 混合；资格迹不是因果 | SAME | — |
| 11 | `tabular-control` | SARSA；Expected SARSA；Q-learning；Double Q | SARSA；Expected SARSA；Q-learning；Double Q | SAME | — |
| 12 | `off-policy-deadly-triad` | 重要性采样；方差控制；致命三角；target/replay 不等于收敛证明 | 重要性采样；稳定性取舍；致命三角；target/replay 不等于收敛证明 | SAME | — |
| 13 | `linear-approximation` | 特征决定函数类；on-policy TD 的投影解；半梯度；off-policy 权重 | 半梯度；特征归纳偏置；特征尺度与步长；离策略自举发散 | MISSING-OR-SUBSTITUTED | 中文补回“投影解”与 importance/emphatic/gradient-TD 所处理的权重问题；尺度与发散内容可移入边界或同步扩写英文。 |
| 14 | `neural-approximation` | 表示耦合；目标噪声与非平稳；优化设置定义有效算法；冻结行为评估 | 表示共同学习；相关样本；移动自举目标；输出尺度与冻结行为检查 | SAME | — |
| 15 | `dqn` | replay；target network；探索与支持；Atari/基准协议 | replay；target network；Huber；探索与支持 | MISSING-OR-SUBSTITUTED | 中文补回基准协议为何改变结论；若 Huber 继续作为机制段，英文也应补同等解释，或把 Huber 放进算例/边界。 |
| 16 | `dqn-family` | dueling 聚合；PER；distributional C51/quantile；Rainbow | Double DQN；dueling；PER；Rainbow | MISSING-OR-SUBSTITUTED | 中文必须补回 distributional value 的机制；Double 已在上一章充分解释，可移出本章机制或同步加入英文。 |
| 17 | `reinforce-policy-gradient` | score function；baseline；reward-to-go；entropy | score function；reward-to-go；baseline；entropy | ORDER-ONLY | — |
| 18 | `actor-critic-gae` | critic 的偏差/方差；A2C/A3C 系统语义；GAE；共享编码器 | critic/优势；GAE；共享骨干；优势标准化 | MISSING-OR-SUBSTITUTED | 中文补回 A2C 同步批处理与 A3C 异步陈旧梯度；优势标准化若保留，应同步补入英文或移到边界。 |
| 19 | `trpo-ppo` | natural gradient；TRPO 近似约束；PPO-Clip；batch/normalization 的实际信赖程度 | Fisher/natural gradient 与 TRPO；PPO-Clip；多 epoch 的数据陈旧；共享 value/entropy 影响 | SAME | — |
| 20 | `continuous-control` | deterministic policy gradient；TD3 三项修复；SAC；replay 支持与 OOD critic | deterministic gradient；TD3；SAC；动作缩放与 log-prob 语义 | MISSING-OR-SUBSTITUTED | 中文补回 replay 让方法离策略且 actor 会追逐支持外 Q 峰；动作缩放可压缩并入第一/三段，或同步扩写英文。 |
| 21 | `distributed-rl` | A3C；Ape-X；IMPALA/V-trace；R2D2 recurrent state | A3C；Ape-X；IMPALA/V-trace；R2D2 burn-in | SAME | — |
| 22 | `pomdp-memory` | belief state；frame stack；recurrent summary；主动获取信息/dual control | belief state；frame stack；recurrent summary；隐藏状态重置 | MISSING-OR-SUBSTITUTED | 中文补回“动作也能购买信息”的 dual-control 出口；重置语义可移入 RNN 段或边界。 |
| 23 | `deep-exploration` | epistemic/aleatoric；count 表示；curiosity；RND 固定目标/预测器 | 乐观；后验采样；预测误差的两种来源；熵覆盖 | MISSING-OR-SUBSTITUTED | 以公式和资料为准，在中文明确补 count、curiosity 与 RND 的具体机制；乐观、后验、熵可同步加入英文或扩成更多自然段，不必硬守四段。 |
| 24 | `long-horizon-credit` | traces；temporal abstraction；reward redistribution；hindsight | traces；层级动作；奖励重分配；hindsight | SAME | — |
| 25 | `mcts-alphazero` | 树统计；policy prior；value head 替代深 rollout；self-play 分布 | PUCT；访问计数目标；self-play 分布；价值视角/符号 | MISSING-OR-SUBSTITUTED | 中文补回 value head 为何替代昂贵 rollout、搜索预算如何修复或放大弱网络；价值视角可并入树统计段。 |
| 26 | `dyna-mpc` | Dyna；MPC 在线重规划；ensemble 分歧；MBPO 短 rollout | Dyna；MPC 闭环；ensemble 分歧；短 rollout 偏差预算 | SAME | — |
| 27 | `latent-world-models` | Dreamer RSSM 的确定/随机状态；想象中的 actor gradient；MuZero；搜索利用模型误差 | Dreamer 想象学习；MuZero；多项损失；策略利用潜在漏洞 | MISSING-OR-SUBSTITUTED | 中文补回 RSSM 的确定/随机两类状态与 imagined actor learning 对模型梯度、时域的依赖；多项损失可同步加入英文。 |
| 28 | `behavior-cloning-dagger` | BC 似然；occupancy shift；DAgger；示范多解/质量 | BC 似然；误差复合；DAgger；专家多解 | SAME | — |
| 29 | `inverse-rl-gail` | 奖励不可识别；最大熵；GAIL；pairwise preference 与 IRL 的证据差异 | IRL 奖励解释；最大熵；GAIL；专家偏差复制 | MISSING-OR-SUBSTITUTED | 中文补回“偏好比较观察选择，IRL 观察动力学中的行为”这一边界；专家偏差可并入示范质量或同步到英文。 |
| 30 | `offline-rl` | BCQ；CQL；IQL；数据集审计 | 行为约束；CQL；IQL；数据组成 | SAME | — |
| 31 | `decision-transformer` | RTG 的训练/推理差异；causal attention；动作损失仍是监督学习；目标回报的部署选择 | RTG 控制；因果遮罩；上下文承担记忆；行为支持上限 | MISSING-OR-SUBSTITUTED | 中文补回 supervised action loss 与 achievable target-return selection；上下文记忆可并入遮罩段或同步到英文。 |
| 32 | `off-policy-evaluation` | importance sampling；FQE；doubly robust；多策略选择造成评估选择偏差 | direct method；importance sampling；FQE；doubly robust | MISSING-OR-SUBSTITUTED | 中文补回 policy selection/multiple comparisons；直接法若保留，英文也应补齐，或将其并入 FQE 前的总览。 |
| 33 | `hierarchical-rl` | options；MAXQ；goal conditioning；skill discovery | semi-MDP options；子目标；skill discovery；上下层训练错配 | MISSING-OR-SUBSTITUTED | 中文补回 MAXQ 的 recursive/global optimality 差异和 goal-conditioned worker；训练错配可同步到英文边界。 |
| 34 | `multi-agent-rl` | independent learners；VDN/QMIX；MADDPG centralized critic；self-play population evidence | independent learners；VDN；QMIX；伙伴泛化 | MISSING-OR-SUBSTITUTED | 中文补回 MADDPG/CTDE 连续控制与 self-play population/cross-play 证据；VDN、QMIX 可合为一段。 |
| 35 | `transfer-meta-generalization` | multi-task sharing/干扰；meta-RL；受控 shift 类别；sim-to-real 分阶段证据 | 表征迁移；goal conditioning；meta-learning；domain randomization | MISSING-OR-SUBSTITUTED | 中文补回受控分布变化分类与 sim-to-real 的识别、真实校准、安全分阶段；表征/goal conditioning 可归入 multi-task 或同步到英文。 |
| 36 | `reward-design` | Goodhart/proxy；策略不变塑形；learned reward；多目标权衡可见 | 稀疏奖励；稠密奖励；势函数塑形；奖励模型外推 | MISSING-OR-SUBSTITUTED | 中文补回 Goodhart 压力和不可把质量/成本/安全全压成一个标量的多目标出口；稀疏/稠密可合并为塑形段。 |
| 37 | `safe-robust-risk` | CMDP；CPO；风险分布；robust uncertainty set | Lagrangian CMDP；shield；robust set；CVaR | MISSING-OR-SUBSTITUTED | 中文补回 CPO 的局部可行更新及其期望约束边界；shield 若保留，应同步加入英文或明确为执行层补充。 |
| 38 | `evaluation-reproducibility` | 曲线与预算；独立实验单位/区间；消融；代码/结果/结论的复现层级 | seeds；IQM/bootstrap；调参预算；运行状态 | MISSING-OR-SUBSTITUTED | 中文补回 learning-curve budget、机制消融和三层复现结论；seed/IQM/调参预算可同步扩写英文。 |
| 39 | `rl-systems` | environment contract；replay 数据库；checkpoint；observability | step API；wrapper；seed；checkpoint | MISSING-OR-SUBSTITUTED | 中文补回 replay 的容量/淘汰/并发/持久化语义与可观测指标；wrapper/seed 可同步到英文或合并进 contract/checkpoint。 |
| 40 | `llm-as-rl` | prefix + 外部上下文状态；token policy factorization；奖励时机/信用；采样策略定义数据 | 自回归策略分解；SFT vs RL；KL；停止规则 | MISSING-OR-SUBSTITUTED | 中文补回工具状态/部分可观测、终局奖励的 token 信用和 temperature/top-p 对数据分布的作用；KL 可留到 RLHF 或同步英文。 |
| 41 | `rlhf-ppo` | pairwise reward；PPO 对近似在策略 rollout 的局部复用；value/critic；KL 实现 | Bradley–Terry；token advantage；KL 角色；PPO 优化 reward model | MISSING-OR-SUBSTITUTED | 中文补回 old log-prob、clip/epoch/batch/early-stop 如何限制 rollout 复用，并明确 critic 的拟合诊断；reward hacking 可同步英文。 |
| 42 | `direct-preference` | DPO；IPO；KTO；ORPO/SimPO 的具体差异 | DPO；β；离线偏好过期；变体统述 | MISSING-OR-SUBSTITUTED | 中文分别补 IPO 的间隔回归、KTO 的非配对监督、ORPO/SimPO 的 reference-free 方式；离线过期应同步进英文。 |
| 43 | `rlaif-judges` | constitution；共享模型误差；任务能力校准；evaluator security | 规则；可被策略利用的 judge 偏差；ensemble 相关误差；外部校准 | MISSING-OR-SUBSTITUTED | 中文补回 prompt injection、编码内容、超长输入和 grader exploit 的安全边界；ensemble 内容可并入共享误差段。 |
| 44 | `rlvr-grpo` | outcome verifier；process reward；GRPO 组统计；verifier hacking | verifier；GRPO；零方差组；process supervision | MISSING-OR-SUBSTITUTED | 中文补回 fixture 读取、timeout、硬编码公开测试等 verifier hacking；零方差处理可并入 GRPO 段。 |
| 45 | `test-time-compute` | sampling；search；tools；distillation | Best-of-N；self-consistency；search；产品预算 | MISSING-OR-SUBSTITUTED | 中文补回工具产生外部观察及权限/沙箱边界、搜索轨迹蒸馏的收益和风险；Best-of-N、自洽可合并为 sampling。 |
| 46 | `method-selection` | 最简单有效基线；数据生成权限；证据层级；停止/回退 | 先证明需要序列决策；数据与目标；复杂度收益；拒绝/回退 | MISSING-OR-SUBSTITUTED | 中文补回“代码检查、受控实验、人类研究、分阶段部署支持不同强度结论”的证据层级；复杂度收益可并入最简单基线。 |

### 对齐工作的优先顺序

先修“中文正文与现有公式/资料已经互相脱节”的章节：`dqn-family`、`deep-exploration`、`decision-transformer`。随后修会改变方法选择或部署判断的缺口：`off-policy-evaluation`、`method-selection`、`evaluation-reproducibility`、`rl-systems`、`safe-robust-risk`。最后处理其余章节的覆盖差异。

复审时不应检查标题是否逐字对应，而应逐项回答：英文读者学到的机制、限制和证据边界，中文读者是否也能完整说出；中文新增且被保留的关键内容，英文读者是否也能获得。只有 46 章全部达到 SAME 或 ORDER-ONLY，双语写作验收才可给 PASS。

## 修复后独立终审

**Final verdict: PASS**

本轮重新读取当前源内容，并以重新构建后的运行时页面为准复核，没有沿用“已经修复”的项目结论。首轮 27 个 `MISSING-OR-SUBSTITUTED` 已全部修复为 `SAME`；Chapter 17 仍是无害的 `ORDER-ONLY`。最终双语覆盖、文章节奏、中文文风、例题解释和公式连接均通过。

### 终审覆盖矩阵

| # | Chapter | 当前状态 | 终审说明 |
|---:|---|---|---|
| 01 | `before-rl` | SAME | 四个出口逐项对应。 |
| 02 | `interaction-loop` | SAME | 四个出口逐项对应。 |
| 03 | `return-horizon` | SAME | 回报、时域、任务类型和终止语义完整对应。 |
| 04 | `probability-expectation` | SAME | 随机变量、条件、策略分布和期望边界对应。 |
| 05 | `bandits-contextual-bandits` | SAME | 更新、探索、遗憾和上下文出口对应。 |
| 06 | `mdp-state-design` | SAME | 马尔可夫性、联合转移、覆盖和时间状态对应。 |
| 07 | `value-bellman` | SAME | v、q、期望/最优性和误差边界对应。 |
| 08 | `dynamic-programming` | SAME | 固定点、改进、价值迭代和更新调度对应。 |
| 09 | `monte-carlo` | SAME | 真实回报、同策略覆盖、off-policy likelihood ratio、完整回合限制逐项对应。 |
| 10 | `td-traces` | SAME | 四个出口逐项对应。 |
| 11 | `tabular-control` | SAME | SARSA、Expected SARSA、Q-learning、Double Q 对应。 |
| 12 | `off-policy-deadly-triad` | SAME | 权重、方差、致命三角和稳定器边界对应。 |
| 13 | `linear-approximation` | SAME | 已补投影解、半梯度与离策略权重。 |
| 14 | `neural-approximation` | SAME | 虽重新分段，表示耦合、样本/目标问题、优化设置与冻结行为检查都在。 |
| 15 | `dqn` | SAME | 已补 Atari/基准协议，Huber 不再替换核心出口。 |
| 16 | `dqn-family` | SAME | 已补 C51/quantile 的回报分布机制。 |
| 17 | `reinforce-policy-gradient` | ORDER-ONLY | baseline 与 reward-to-go 次序互换，内容无缺失。 |
| 18 | `actor-critic-gae` | SAME | 已补 A2C/A3C 系统时序，并保留 critic、GAE、共享骨干。 |
| 19 | `trpo-ppo` | SAME | natural gradient/TRPO、PPO clip、数据复用和实际信赖程度都在。 |
| 20 | `continuous-control` | SAME | 已补 replay 支持与 OOD critic，同时自然保留动作缩放。 |
| 21 | `distributed-rl` | SAME | A3C、Ape-X、IMPALA、R2D2 对应。 |
| 22 | `pomdp-memory` | SAME | 已补主动买信息的 dual-control 出口，重置语义并入 RNN 段。 |
| 23 | `deep-exploration` | SAME | epistemic/aleatoric、count、curiosity、RND 逐项对应，且与公式一致。 |
| 24 | `long-horizon-credit` | SAME | traces、层级、重分配、hindsight 对应。 |
| 25 | `mcts-alphazero` | SAME | 已补树统计、先验、价值头替代 rollout 与 self-play 分布。 |
| 26 | `dyna-mpc` | SAME | 四个出口逐项对应。 |
| 27 | `latent-world-models` | SAME | 已补 RSSM 状态结构和 imagined actor gradient。 |
| 28 | `behavior-cloning-dagger` | SAME | BC、occupancy shift、DAgger、示范多解对应。 |
| 29 | `inverse-rl-gail` | SAME | 奖励不可识别、最大熵、GAIL、pairwise preference 与 IRL 的证据差异逐项对应。 |
| 30 | `offline-rl` | SAME | BCQ、CQL、IQL、数据审计对应。 |
| 31 | `decision-transformer` | SAME | 已补 supervised action loss 和目标回报部署选择。 |
| 32 | `off-policy-evaluation` | SAME | 已补多策略选择造成的评估选择偏差；IS、FQE、DR 对应。 |
| 33 | `hierarchical-rl` | SAME | 已补 MAXQ 与 goal-conditioned worker。 |
| 34 | `multi-agent-rl` | SAME | 已补 MADDPG/CTDE 和 self-play population/cross-play 证据。 |
| 35 | `transfer-meta-generalization` | SAME | 已补受控 shift 类别与 sim-to-real 分阶段证据。 |
| 36 | `reward-design` | SAME | 已补 Goodhart 和多目标可见性。 |
| 37 | `safe-robust-risk` | SAME | 已补 CPO；CMDP、risk distribution、robust set 对应。 |
| 38 | `evaluation-reproducibility` | SAME | 曲线预算、独立单位、消融、三层复现对应。 |
| 39 | `rl-systems` | SAME | environment contract、replay DB、checkpoint、observability 对应。 |
| 40 | `llm-as-rl` | SAME | 外部状态、token policy、信用和采样分布对应。 |
| 41 | `rlhf-ppo` | SAME | reward、rollout reuse、critic、KL 对应。 |
| 42 | `direct-preference` | SAME | DPO、IPO、KTO、ORPO/SimPO 已分别解释。 |
| 43 | `rlaif-judges` | SAME | constitution、共享误差、分层校准和 evaluator security 对应。 |
| 44 | `rlvr-grpo` | SAME | verifier、process reward、GRPO、verifier hacking 对应。 |
| 45 | `test-time-compute` | SAME | sampling、search、tools、distillation 对应。 |
| 46 | `method-selection` | SAME | 基线、数据权限、证据层级和停止/回退对应。 |

终审统计：**45 SAME、1 ORDER-ONLY、0 MISSING-OR-SUBSTITUTED**。

### 最后两处的定点复核

1. **Monte Carlo — PASS**：中文现在依次解释完整真实回报、同策略覆盖、离策略似然比和完整回合限制。第三段明确给出行为策略 `b`、目标策略 `π`、整轨迹与逐决策重要性权重，并说明支持缺失无法靠算术补出；第二段仍保留 ε-soft 覆盖，第四段仍保留 continuing-task 与截断边界。新增机制没有用一个修复换掉另一个出口。

2. **Inverse RL / GAIL — PASS**：中文第四段现在先区分两类证据：IRL 观察环境动力学中的实际行为和占用，成对偏好只观察比较者在候选结果间的选择；随后分别交代动力学/示范覆盖假设与候选生成/标签稳定假设，最后自然保留专家和标注者偏差边界。它完整对应英文出口，同时比直译更适合中文读者。

### 文风、节奏和例题复审

- 新增中文不是逐句硬译。段落仍通过具体动作、数据来源和失败条件展开，最短机制段 131 字，184 段均达到完整解释长度；未重新出现统一套话。
- 机制区运行时仍是连续正文：每页四个句内粗体引导，没有 h3、橙色短线或卡片分隔。Chapter 00 的九段叙事没有受双语补齐影响。
- 新补内容与算例和公式连接良好。例如 distributional DQN 解释 C51 原子与 quantile，deep exploration 解释 RND 固定目标/预测器，LLM-as-RL 把终局奖励接到 token 信用；没有出现“正文补名词、公式讲另一件事”的新断裂。
- `exploring starts`、`tile coding`、`sticky actions`、`prompt injection` 等剩余英文均是专业术语或接口名，没有发现普通说明句泄漏成英文。

### 验证证据

- 写作与公式相关测试：4 个测试文件、34 项断言全部通过。
- `npm run build`：Astro check 0 error，成功生成 97 个静态页面。
- `npm run verify:static`：确认双语 Chapter 00 与 46 组深读页匹配。
- Playwright 运行时审计退出码 0：逐页检查 46 个英文页、46 个中文页，机制区结构、公式矩阵、锚点、无横向溢出与控制台错误均通过。

最终结论为 **PASS**。46 章当前达到 45 个 `SAME` 与 1 个 `ORDER-ONLY`；没有剩余双语机制缺口。最后一次定向运行 `src/content/chapter-localization.test.ts`，12 项断言全部通过。这里的 PASS 是基于源内容检查、独立写作复核和自动化运行时证据，不替代真实学习者的长期理解测试。
