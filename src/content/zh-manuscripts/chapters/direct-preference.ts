import type { ChineseManuscript } from "@/content/zh-manuscripts/types";

export const ZH_MANUSCRIPT = {
  title: "偏好对已经告诉你方向时，不一定还要跑完整套 RLHF",
  deck: "一份固定数据里已经写明哪份回答更好，就可以直接训练策略去拉开两者差距。不同方法的区别，在需要什么标签、要不要参考模型，以及怎样定义差距。",
  openingQuestion: "训练只读取保存好的回答对，从不在线尝试新动作，这还能算在线强化学习吗？",
  bridge: "上一章先训练奖励模型，再让策略对着奖励模型探索。但偏好数据本身已经包含“选 A、不选 B”的方向。我们可以直接利用这个方向，省掉中间一层。",
  situation: {
    title: "一组被选与被拒的回答，本身就带着更新方向",
    paragraphs: [
      "对于同一个题目，评审者选择回答 A，拒绝回答 B。训练可以直接提高 A 相对 B 的位置，而不必先训练另一个模型为所有回答打分。",
      "这种做法中最常见的一类叫直接偏好优化（Direct Preference Optimization，DPO）。它会拿当前策略与一份固定参考策略比较，看当前策略是否更偏向被选回答。",
      "其他方法会改动这个配方的一部分。身份偏好优化（Identity Preference Optimization，IPO）限制目标差距；KTO 可以使用不成对的好坏标签；ORPO 与 SimPO 则用不同方式去掉单独的参考模型。",
    ],
  },
  diagram: {
    title: "分清这些方法，只要连续问三个问题",
    caption: "先问数据长什么样，再问是否需要参考模型，最后问训练有没有在线收集新的结果。",
    items: [
      { label: "DPO 与 IPO", value: "成对偏好 + 参考模型", note: "两者都比较被选回答与被拒回答，但要求的差距不同。" },
      { label: "KTO", value: "好或坏标签 + 参考模型", note: "好例子与坏例子不一定来自同一对比较。" },
      { label: "ORPO 与 SimPO", value: "成对偏好，无单独参考模型", note: "它们把相对比较直接写进当前策略的损失。" },
      { label: "是否在线交互", value: "标准做法通常没有", note: "固定数据不会告诉你新策略探索动作以后发生了什么。" },
    ],
  },
  workedExample: {
    title: "算一遍 DPO 真正在比较的相对变化",
    setup: "被选回答在当前策略下的对数概率为 −2.2，在参考策略下为 −3.0。被拒回答对应为 −2.3 与 −2.5。",
    prediction: "当前策略相对参考策略，更明显地提高了被选回答，还是被拒回答？",
    steps: [
      { label: "被选回答的变化", explanation: "被选回答相对参考策略提高了 0.8 个对数单位。" },
      { label: "被拒回答的变化", explanation: "被拒回答也提高了，但只提高 0.2 个对数单位。" },
      { label: "比较两次变化", explanation: "0.8 再减去 0.2，当前策略相对多向被选回答移动了 0.6。" },
      { label: "把差距写入目标", explanation: "beta 会缩放这 0.6 的差距，从而改变训练对这组样本的反应强度。" },
    ],
    result: "DPO 关注的是两份回答相对参考策略的变化差。即使两份回答的绝对概率都提高，只要被选回答提高得更多，偏好方向仍然变强。",
  },
  mechanism: {
    introduction: "先看数据与比较规则，再记方法名称，会简单很多。",
    sections: [
      { title: "DPO 把参考模型当成昨天的版本", paragraphs: [
        "DPO 会问：与参考模型相比，当前策略是不是更偏向被选回答？它优化两次相对变化之间的差，不只抬高被选回答概率。",
        "这样可以省掉单独的奖励模型与 PPO 回路，但偏好噪声、题目覆盖和参考模型选择仍然存在。少一个组件，不等于少了所有风险。",
      ] },
      { title: "IPO 不让差距无限向外推", paragraphs: [
        "当数据里的偏好对都很容易分开时，DPO 使用的逻辑损失可能继续要求更大的间隔。IPO 会让这个差距朝一个有限目标靠近。",
        "这并不表示 IPO 在所有数据上都更安全。有限目标设置多大、理论假设是否符合真实偏好，仍然需要实验与留出数据检查。",
      ] },
      { title: "KTO 可以接收没有配对的好坏标签", paragraphs: [
        "评审者有时只会说“这份回答可以”或“这份回答不行”，却没有为每份回答安排一个对手。KTO 可以使用这种分开的可取与不可取示例。",
        "KTO 的全称是卡尼曼—特沃斯基优化（Kahneman–Tversky Optimization，KTO）。好坏样本比例与参考策略都会影响结果，许多简单好例子不能代替缺失的困难失败。",
      ] },
      { title: "ORPO 与 SimPO 都去掉参考模型，但做法不同", paragraphs: [
        "优势比偏好优化（Odds Ratio Preference Optimization，ORPO）一边模仿被选回答，一边用两份回答的优势比拉开差距。它不需要再保存一份单独参考模型。",
        "简单偏好优化（Simple Preference Optimization，SimPO）用每个 token 的平均对数概率比较回答，再要求一个目标间隔。长度归一化能减轻长度偏差，却不能补回数据里没有的场景。",
      ] },
    ],
  },
  equations: [
    { read: "DPO 先减去两份回答各自在参考策略下的对数概率。然后再比较被选回答与被拒回答的相对差距。", meaning: "这条目标使用固定回答对，不要求在线采样奖励。参考模型、beta、回答长度与数据覆盖共同决定结果。" },
    { read: "SimPO 用当前策略下每个 token 的平均对数概率，为一份回答打分。", meaning: "平均处理减轻原始序列长度造成的差异，目标间隔仍然决定两份回答要被拉开多远。" },
  ],
  boundary: {
    title: "固定偏好数据不会主动暴露它从未包含的失败",
    paragraphs: [
      "策略可以在保存的比较上不断变好，却在新题目上产生旧数据从未见过的行为。输出分布发生变化以后，需要重新收集评估，而不能永远复用同一批偏好对。",
      "这些方法与 RLHF 有关，但标准固定数据训练通常不是在线 RL。保留这条边界，才能说清探索成本、数据来源和结论到底由什么证据支持。",
    ],
  },
  nextBridge: "到这里，偏好标签仍然来自人。下一章把标注者换成另一个模型，看看更快、更便宜的反馈会同时带来哪些新的偏差。",
  narrative: [
    { type: "section", id: "pair-already-has-direction", title: "一组偏好对已经告诉我们该往哪边推", paragraphs: [
      "同一个题目有回答 A 与回答 B，评审者选择 A。这个选择已经包含方向：训练应该让 A 相对 B 更容易出现。直接偏好优化（Direct Preference Optimization，DPO）就从这份固定比较直接更新策略。",
      "它还会拿当前策略与参考策略比较。今天的 A 概率高不高，不是唯一问题。还要看它比参考版本更向 A 移动了多少。这样可以省掉单独训练奖励模型再运行 PPO 的整套流程。",
    ] },
    { type: "worked-example" },
    { type: "section", id: "methods-change-one-question", title: "其余缩写只是分别改了数据或差距的定义", paragraphs: [
      "身份偏好优化（Identity Preference Optimization，IPO）让偏好差距靠近有限目标，避免容易分开的数据被一直往外推。卡尼曼—特沃斯基优化（Kahneman–Tversky Optimization，KTO）则可以接收没有配对的好例子与坏例子。",
      "优势比偏好优化（Odds Ratio Preference Optimization，ORPO）与简单偏好优化（Simple Preference Optimization，SimPO）都不需要单独参考模型。ORPO 结合被选回答的监督学习与优势比。SimPO 比较每个 token 的平均对数概率。名称很多，但区别仍然落在数据、参考与差距三件事上。",
    ] },
    { type: "diagram" },
    { type: "section", id: "fixed-data-has-a-wall", title: "省掉在线回路以后，也失去了发现新后果的机会", paragraphs: [
      "这些直接方法通常读取一份固定数据。它们不会在训练中让当前策略探索新回答，再观察真实环境发生了什么。因此，旧数据没有覆盖的失败，不会因为目标函数更漂亮就自动出现。",
      "策略改变以后，输出可能离旧回答越来越远。此时要用新题目、新人工比较与独立结果重新检查。把所有偏好优化都叫 RL，会遮住是否在线交互、是否探索以及证据能覆盖到哪里的真正差别。",
    ] },
    { type: "equations" },
    { type: "boundary" },
  ],
} satisfies ChineseManuscript;
