# RL Field Guide final UI acceptance

## Verdict

**PASS**

The checked build reads as a long-form field guide rather than a slide deck. I found no release-blocking overflow, formula clipping, broken hierarchy, or mismatched diagram treatment in the requested sample. The remaining card surfaces are confined to places where structure is useful: diagrams, worked examples, source links, and chapter navigation.

This was an independent runtime review of `http://127.0.0.1:5180/rl-field-guide/`. I did not read the other reports in this audit directory and did not modify product source files.

## Coverage and method

- Real-browser inspection in the Codex in-app Chromium browser.
- Desktop viewport: **1280 × 720**.
- Mobile viewport: **375 × 812**, using Chrome device-metric emulation and then clearing the override.
- Routes checked:
  - Chinese and English Chapter 00 (`rl-panorama`)
  - Chinese `mcts-alphazero`
  - Chinese `tabular-control`
  - Chinese `linear-approximation`
  - Chinese `decision-transformer`
  - Chinese `rl-systems`
  - Chinese `llm-as-rl`
- Evidence collected from live screenshots, DOM structure, computed dimensions, heading order, scroll widths, and browser console logs.

## Acceptance findings

### 1. The pages no longer read like PPT cards

**Pass.**

Chapter 00 is now an editorial feature: a single prominent title, restrained deck, drop-cap opening, and nine long movements. Each movement is a normal section with sustained paragraphs rather than a row of repeated cards. Runtime DOM evidence:

- Both language versions contain one `h1`, eleven `h2`s, and no `h3`s.
- Each of the nine main movements contains **7–12 paragraphs**.
- The only bordered/rounded structures in the article are the route overview and final continuation choices, both of which have a navigational or explanatory job.

The deep chapters also pass. In every sampled deep chapter, the mechanism section contains **four ordinary paragraphs with four inline strong lead-ins and zero `h3` subcards**. In the MCTS screenshot, the heading “AlphaZero 不是‘网络加搜索’两个独立模块，而是一条互相蒸馏的循环。” is followed by continuous textbook prose. There are no amber dashes, separator rules, or one-sentence mini-panels between the four ideas.

### 2. Long formulae and long Chinese text remain inside their layout

**Pass.**

At 1280 px, every checked route had `documentElement.scrollWidth === clientWidth === 1265`; there was no page-level horizontal overflow. Deep-chapter formula renderers were **758 px wide** and had matching client/scroll widths in the desktop sample.

At 375 px, every checked route had `documentElement.scrollWidth === clientWidth === 375`. Long formulae use local horizontal scrolling instead of widening the page:

| Route | Formula viewport | Longest formula content | Result |
|---|---:|---:|---|
| `mcts-alphazero` | 297 px | 338 px | contained, `overflow-x: auto` |
| `tabular-control` | 297 px | 441 px | contained, `overflow-x: auto` |
| `linear-approximation` | 297 px | 362 px | contained, `overflow-x: auto` |
| `rl-systems` | 297 px | 409 px | contained, `overflow-x: auto` |

The formula descendants can extend beyond the visible edge while being scrolled inside their own 297 px container; the document itself never widens. This is intentional containment, not page breakage. The live 375 px MCTS screenshot showed the PUCT equation within its white formula panel, with the explanation still aligned below it.

Long Chinese headings also passed: none of the sampled `h1`, `h2`, or `h3` elements had `scrollWidth > clientWidth` at desktop size, and the 375 px screenshots showed the headings wrapping naturally.

### 3. The tabular-control comparison has enough horizontal room

**Pass.**

The old four-narrow-column treatment is gone. On desktop, “共享奖励，分歧发生在下一状态” is rendered as four full-width horizontal rows. Each row gives the algorithm name its own left column and gives the formula plus explanation the wider right column. SARSA, Expected SARSA, Q-learning, and Double Q remain readable without splitting mathematical operators across cramped cards.

At 375 px the same component becomes a one-column stack. The figure measured **339 px** wide, each row measured **305 px**, and no row reported internal overflow. This is the correct responsive transformation for formula-heavy comparison content.

### 4. Diagram variants match the relationship being taught

**Pass.**

- `tabular-control` uses `diagram-formula-compare`, correctly treating the four algorithms as alternative targets rather than a temporal sequence.
- `mcts-alphazero` uses a flow for selection → expansion → evaluation → backup.
- `linear-approximation` uses a flow for encoding → prediction → error → propagation.
- `decision-transformer` uses a flow for return condition → state → action → rolling the condition forward.
- `rl-systems` uses a flow for environment → wrapper → learner → checkpoint.
- `llm-as-rl` uses a flow for state → token action → trajectory → feedback.

On desktop, three flow list items report a small `scrollWidth` surplus because the connector arrows extend beyond the card boxes; screenshots show the text itself fully visible, and the page has no horizontal overflow. At 375 px the flows stack into 305 px rows, all with zero item overflow.

### 5. Amber is restrained

**Pass.**

The screenshots use amber for the RL mark, active navigation state, small section indices, formula emphasis, and occasional rules. Body copy remains dark gray or muted gray. As a rough text-weight check on `tabular-control` excluding KaTeX, sampled editorial elements contained about **30 amber characters versus 2,312 gray/black characters**. Amber behaves as an accent, not as a competing reading layer.

### 6. Hierarchy and reading width are comfortable

**Pass.**

- Chapter 00: article width **800 px** desktop and **347 px** mobile; title size **89.6 px** desktop and **60 px** mobile.
- Deep chapters: article shell **980 px** desktop; continuous prose column **641 px** desktop and **339 px** mobile; title size **58 px** desktop and **45 px** mobile.
- Every sampled route has exactly one `h1`.
- Chapter 00 has eleven `h2`s and no heading-level skips.
- Every sampled deep chapter has seven `h2`s, one `h3` for the worked-example question, and no heading-level skips.

The large Chapter 00 title reads as a magazine-style opening because it is immediately followed by a deck and continuous prose. It does not recreate the repeated “one huge title + one short line” rhythm that made the earlier version feel like slides.

### 7. Runtime health

**Pass.**

After navigating all requested routes and switching between desktop and mobile measurements, the browser console contained **zero errors and zero warnings**.

## Non-blocking observations

- The mobile chapter table of contents is horizontally scrollable, so the final “边界” item begins outside the initial 375 px view. The page itself does not overflow, the control remains touch-scrollable, and this is not a broken layout.
- Several mobile equations require a short horizontal swipe inside their formula panels. Given their mathematical length, local scrolling is preferable to shrinking them into illegibility or forcing the full page wider.

Neither observation warrants another product change before release.

## Incremental re-review after the content expansion

### Final verdict

**PASS**

This second pass reviewed the rebuilt site after the mechanism prose and worked examples were substantially expanded. It included a complete width and structure sweep of all 46 Chinese deep chapters, plus screenshot inspection of the new extremes at 1280 × 720 and 375 × 812.

### Longest mechanism prose

The longest single mechanism paragraph is now in `rl-systems` at **261 Chinese characters**; the largest mechanism section by total text is `latent-world-models` at **855 characters across four paragraphs**. The `rl-systems` mechanism measured:

- Desktop: **828 / 828 px** client/scroll width and 899 px height.
- Mobile: **339 / 339 px** client/scroll width and 1,358 px height.

Screenshot inspection showed normal continuous prose with inline bold lead sentences. The extra length increases vertical reading time without reintroducing separators, mini-card borders, or slide-like subheadings.

Across all 46 deep chapters, every mechanism still has the same article structure: **four paragraphs, zero `h3` card headings, zero horizontal overflow**. No mechanism child regained a border or box shadow that would recreate the earlier presentation rhythm.

### Expanded worked examples

`return-horizon` is the tallest sampled worked example after the rewrite:

- Desktop: **828 / 828 px** client/scroll width and 991 px height.
- Mobile: **339 / 339 px** client/scroll width and 1,262 px height.

Its four numbered steps remain easy to scan, while each step now has enough prose to explain what the arithmetic means. The step container, formulas, and explanations stay aligned on both viewports.

The initial all-chapter mobile scan found one genuine overflow in the `pomdp-memory` worked example: the unbroken code string `P(Faulty|warning)=0.18/(0.18+0.08)≈0.692` extended beyond its step. After the responsive code-wrap fix and rebuild, the exact regression check is clean:

- Document: **375 / 375 px** client/scroll width.
- `#example`: **339 / 339 px**.
- `.static-evidence-steps`: **293 / 293 px**.
- Every worked-step `code`: **237 / 237 px**, with `overflow-wrap: anywhere` and normal white space.

The fixed screenshot shows the Bayesian expression wrapping onto a second line inside step 03; no character is clipped and the following explanation remains aligned.

### Long-formula stress test

`method-selection` contains the widest formula renderers in the 46-chapter scan:

- Desktop formula viewport/content: **758 / 886 px** at the longest expression.
- Mobile formula viewport/content: **297 / 606 px**.
- Both use local `overflow-x: auto`; the surrounding document remains exactly 1280 px or 375 px wide.

The complete formula is therefore accessible without shrinking the mathematics or widening the page. This is intentional formula-level scrolling, not page-level clipping.

### Tabular-control comparison

The rebuilt `tabular-control` comparison remains stable after the content changes:

- Desktop figure: **828 px** wide and 817 px tall, using four full-width comparison rows.
- Mobile figure: **339 px** wide and 1,016 px tall, using a one-column stack.

SARSA, Expected SARSA, Q-learning, and Double Q formulae stay visually separated and readable. The component has not regressed to four narrow side-by-side cards.

### Final full-width and hierarchy sweep

The post-fix 375 px rerun covered all 46 Chinese deep chapters:

- Page-level overflow: **0 / 46**.
- Worked-example overflow: **0 / 46**.
- Mechanism overflow: **0 / 46**.
- Heading overflow: **0 / 46**.
- Heading-level skips: **0 / 46**.
- Browser console errors or warnings: **0**.

The corresponding desktop sweep also found no page, example, mechanism, or heading overflow. The expanded content has therefore increased instructional depth without harming the established reading width, hierarchy, formula containment, or article-like visual rhythm.
