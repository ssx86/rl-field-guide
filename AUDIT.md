# RL Field Guide audit — 2026-10-12

## Product decision

The guide is a reading product, not a course game. The previous release asked learners to reveal steps, answer transfer questions, and accumulate progress. That interaction competed with the real job: understanding a large body of RL knowledge. The release now uses a consistent reading sequence instead:

`situation → core diagram → worked numbers → concept names → equation → boundary`

All explanations are visible without clicking. The only remaining controls are ordinary site navigation, language switching, and the light/dark reading theme.

## Findings and resolution

| Priority | Finding | Resolution | Evidence |
| --- | --- | --- | --- |
| P0 | The product model did not match the requested reading experience | Removed the lesson stepper, prediction controls, transfer controls, progress score, and resume state from the published course | Built pages contain no lesson form controls or React islands |
| P0 | Core relationships were buried in prose | Added a purpose-built HTML/CSS knowledge diagram to every lesson: flows, branches, comparisons, bars, matrices, and pipelines | 16 lessons × 2 languages render one semantic figure each |
| P0 | Chinese policy-gradient text made a negative-advantage action “impossible” | Corrected it to “lower the probability”; the action is not deleted | Bilingual content test and review |
| P1 | Important formula conditions were missing | Planning reward now depends on `(s,a,s')`; DQN includes terminal mask `(1-d)`; the deployment checklist is no longer fake mathematics | Formula guard tests |
| P1 | The route looked like 16 equal cards | Grouped it into seven learning stages, each with its purpose and lesson count | Generated home page inspection |
| P1 | Mobile navigation overflowed and hid deep-linked lessons | Replaced the mobile rail with previous/current/next plus an expandable lesson list; removed min-content overflow | 320/375/390/768 browser checks |
| P1 | LLM post-training copy read like a paper abstract | Rewrote it as visible actors and data flows: who generates, who scores, and who updates | Beginner-brain audit and bilingual diagrams |
| P1 | Chinese pages leaked English interface labels | Localized the route and reading-method labels | Generated Chinese-page scan |
| P1 | Accessibility structure was incomplete | Added skip link, semantic diagram captions/lists, linked prerequisites, 44px controls, focus styles, and non-color labels | Keyboard and DOM checks |
| P2 | Theme control did not state its next action | It now names “switch to dark/light” and synchronizes browser theme color | Browser check |
| P2 | Course pages loaded legacy application CSS and an eager React island | Split the course base CSS and removed React islands from published lessons | Production bundle inspection |

## Quality boundary

Automated checks prove static routes, internal links, content parity, formula guards, and absence of lesson controls. Browser checks prove the exercised layouts, navigation, theme, language route, and responsive widths. They do not prove that every learner will master RL or that a tutorial result is sufficient evidence for a production deployment.

