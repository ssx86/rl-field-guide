import type { ChineseManuscript } from "@/content/zh-manuscripts/types";
import { ZH_MANUSCRIPT as BeforeRl } from "@/content/zh-manuscripts/chapters/before-rl";
import { ZH_MANUSCRIPT as InteractionLoop } from "@/content/zh-manuscripts/chapters/interaction-loop";
import { ZH_MANUSCRIPT as ReturnHorizon } from "@/content/zh-manuscripts/chapters/return-horizon";
import { ZH_MANUSCRIPT as ProbabilityExpectation } from "@/content/zh-manuscripts/chapters/probability-expectation";
import { ZH_MANUSCRIPT as BanditsContextualBandits } from "@/content/zh-manuscripts/chapters/bandits-contextual-bandits";
import { ZH_MANUSCRIPT as MdpStateDesign } from "@/content/zh-manuscripts/chapters/mdp-state-design";
import { ZH_MANUSCRIPT as ValueBellman } from "@/content/zh-manuscripts/chapters/value-bellman";
import { ZH_MANUSCRIPT as DynamicProgramming } from "@/content/zh-manuscripts/chapters/dynamic-programming";
import { ZH_MANUSCRIPT as MonteCarlo } from "@/content/zh-manuscripts/chapters/monte-carlo";
import { ZH_MANUSCRIPT as TdTraces } from "@/content/zh-manuscripts/chapters/td-traces";
import { ZH_MANUSCRIPT as TabularControl } from "@/content/zh-manuscripts/chapters/tabular-control";
import { ZH_MANUSCRIPT as OffPolicyDeadlyTriad } from "@/content/zh-manuscripts/chapters/off-policy-deadly-triad";
import { ZH_MANUSCRIPT as LinearApproximation } from "@/content/zh-manuscripts/chapters/linear-approximation";
import { ZH_MANUSCRIPT as NeuralApproximation } from "@/content/zh-manuscripts/chapters/neural-approximation";
import { ZH_MANUSCRIPT as Dqn } from "@/content/zh-manuscripts/chapters/dqn";
import { ZH_MANUSCRIPT as DqnFamily } from "@/content/zh-manuscripts/chapters/dqn-family";
import { ZH_MANUSCRIPT as ReinforcePolicyGradient } from "@/content/zh-manuscripts/chapters/reinforce-policy-gradient";
import { ZH_MANUSCRIPT as ActorCriticGae } from "@/content/zh-manuscripts/chapters/actor-critic-gae";
import { ZH_MANUSCRIPT as TrpoPpo } from "@/content/zh-manuscripts/chapters/trpo-ppo";
import { ZH_MANUSCRIPT as ContinuousControl } from "@/content/zh-manuscripts/chapters/continuous-control";
import { ZH_MANUSCRIPT as DistributedRl } from "@/content/zh-manuscripts/chapters/distributed-rl";
import { ZH_MANUSCRIPT as PomdpMemory } from "@/content/zh-manuscripts/chapters/pomdp-memory";
import { ZH_MANUSCRIPT as DeepExploration } from "@/content/zh-manuscripts/chapters/deep-exploration";
import { ZH_MANUSCRIPT as LongHorizonCredit } from "@/content/zh-manuscripts/chapters/long-horizon-credit";
import { ZH_MANUSCRIPT as MctsAlphazero } from "@/content/zh-manuscripts/chapters/mcts-alphazero";
import { ZH_MANUSCRIPT as DynaMpc } from "@/content/zh-manuscripts/chapters/dyna-mpc";
import { ZH_MANUSCRIPT as LatentWorldModels } from "@/content/zh-manuscripts/chapters/latent-world-models";
import { ZH_MANUSCRIPT as BehaviorCloningDagger } from "@/content/zh-manuscripts/chapters/behavior-cloning-dagger";
import { ZH_MANUSCRIPT as InverseRlGail } from "@/content/zh-manuscripts/chapters/inverse-rl-gail";
import { ZH_MANUSCRIPT as OfflineRl } from "@/content/zh-manuscripts/chapters/offline-rl";
import { ZH_MANUSCRIPT as DecisionTransformer } from "@/content/zh-manuscripts/chapters/decision-transformer";
import { ZH_MANUSCRIPT as OffPolicyEvaluation } from "@/content/zh-manuscripts/chapters/off-policy-evaluation";
import { ZH_MANUSCRIPT as HierarchicalRl } from "@/content/zh-manuscripts/chapters/hierarchical-rl";
import { ZH_MANUSCRIPT as MultiAgentRl } from "@/content/zh-manuscripts/chapters/multi-agent-rl";
import { ZH_MANUSCRIPT as TransferMetaGeneralization } from "@/content/zh-manuscripts/chapters/transfer-meta-generalization";
import { ZH_MANUSCRIPT as RewardDesign } from "@/content/zh-manuscripts/chapters/reward-design";
import { ZH_MANUSCRIPT as SafeRobustRisk } from "@/content/zh-manuscripts/chapters/safe-robust-risk";
import { ZH_MANUSCRIPT as EvaluationReproducibility } from "@/content/zh-manuscripts/chapters/evaluation-reproducibility";
import { ZH_MANUSCRIPT as RlSystems } from "@/content/zh-manuscripts/chapters/rl-systems";
import { ZH_MANUSCRIPT as LlmAsRl } from "@/content/zh-manuscripts/chapters/llm-as-rl";
import { ZH_MANUSCRIPT as RlhfPpo } from "@/content/zh-manuscripts/chapters/rlhf-ppo";
import { ZH_MANUSCRIPT as DirectPreference } from "@/content/zh-manuscripts/chapters/direct-preference";
import { ZH_MANUSCRIPT as RlaifJudges } from "@/content/zh-manuscripts/chapters/rlaif-judges";
import { ZH_MANUSCRIPT as RlvrGrpo } from "@/content/zh-manuscripts/chapters/rlvr-grpo";
import { ZH_MANUSCRIPT as TestTimeCompute } from "@/content/zh-manuscripts/chapters/test-time-compute";
import { ZH_MANUSCRIPT as MethodSelection } from "@/content/zh-manuscripts/chapters/method-selection";

export const AUTHORED_CHINESE_MANUSCRIPTS: Readonly<Record<string, ChineseManuscript>> = {
  "before-rl": BeforeRl,
  "interaction-loop": InteractionLoop,
  "return-horizon": ReturnHorizon,
  "probability-expectation": ProbabilityExpectation,
  "bandits-contextual-bandits": BanditsContextualBandits,
  "mdp-state-design": MdpStateDesign,
  "value-bellman": ValueBellman,
  "dynamic-programming": DynamicProgramming,
  "monte-carlo": MonteCarlo,
  "td-traces": TdTraces,
  "tabular-control": TabularControl,
  "off-policy-deadly-triad": OffPolicyDeadlyTriad,
  "linear-approximation": LinearApproximation,
  "neural-approximation": NeuralApproximation,
  "dqn": Dqn,
  "dqn-family": DqnFamily,
  "reinforce-policy-gradient": ReinforcePolicyGradient,
  "actor-critic-gae": ActorCriticGae,
  "trpo-ppo": TrpoPpo,
  "continuous-control": ContinuousControl,
  "distributed-rl": DistributedRl,
  "pomdp-memory": PomdpMemory,
  "deep-exploration": DeepExploration,
  "long-horizon-credit": LongHorizonCredit,
  "mcts-alphazero": MctsAlphazero,
  "dyna-mpc": DynaMpc,
  "latent-world-models": LatentWorldModels,
  "behavior-cloning-dagger": BehaviorCloningDagger,
  "inverse-rl-gail": InverseRlGail,
  "offline-rl": OfflineRl,
  "decision-transformer": DecisionTransformer,
  "off-policy-evaluation": OffPolicyEvaluation,
  "hierarchical-rl": HierarchicalRl,
  "multi-agent-rl": MultiAgentRl,
  "transfer-meta-generalization": TransferMetaGeneralization,
  "reward-design": RewardDesign,
  "safe-robust-risk": SafeRobustRisk,
  "evaluation-reproducibility": EvaluationReproducibility,
  "rl-systems": RlSystems,
  "llm-as-rl": LlmAsRl,
  "rlhf-ppo": RlhfPpo,
  "direct-preference": DirectPreference,
  "rlaif-judges": RlaifJudges,
  "rlvr-grpo": RlvrGrpo,
  "test-time-compute": TestTimeCompute,
  "method-selection": MethodSelection,
};
