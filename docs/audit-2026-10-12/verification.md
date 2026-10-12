# Comprehensive reading-course verification matrix

| Area | Required observable result | Status |
| --- | --- | --- |
| Independent product | Site runs under `/rl-field-guide/` on port `5180` without changing the sibling Q-learning project | Build + runtime verified |
| English-only output | Root and `/en/` exist; no `/zh/` output is generated | Static verified |
| Complete route | English home lists nine parts and exactly 46 ordered chapter links | Automated + browser verified |
| Zero-start | Chapter 1 decides whether RL is needed before introducing notation | Content + visual verified |
| Prerequisite continuity | Every chapter names what it builds on, why it exists, and the question that follows | Automated verified |
| Reading-first layout | Long prose is primary; no required explanation is hidden behind a control | Static + browser verified |
| Diagrams | Every chapter has one labelled semantic figure | 46/46 automated + browser verified |
| Worked evidence | Every chapter shows a setup, at least three visible steps, and a result | 46/46 automated + browser verified |
| Formula meaning | Each equation has a spoken reading and an explanation tied to earlier quantities | Content test + visual sample verified |
| Breadth contract | Major classical, deep, model-based, offline, structured, safe, systems, and LLM post-training terms remain present | Automated verified |
| Boundaries | Every chapter has at least two paragraphs describing failure, missing assumptions, or unsupported claims | Automated verified |
| Sources | Every chapter links at least two original or official sources | Automated verified |
| Deep links | A directly opened chapter shows route position, current-part navigation, prerequisites, and previous/next bridge | Browser verified |
| Mobile | 320, 375, 390, and 768px have no document-level horizontal overflow | Browser verified after formula fix |
| Keyboard | First Tab reaches the skip link; navigation remains usable without a pointer | Browser verified |
| Anchors | Sticky section navigation lands with headings visible below the header | Browser verified |
| Theme | Theme control names the next action and keeps content legible | Browser verified |
| Console | Exercised pages produce no browser errors or warnings | Browser verified |
| Static delivery | Root, home, and all 46 chapters are prerendered; lesson content does not depend on a React island | Build + static verified |
| Evidence boundary | Final chapter distinguishes build, benchmark, runtime, safety, and deployment evidence | Content + visual verified |

## Commands and results

- `npm test -- --run`: 12 files, 61 tests passed.
- `npm run lint`: passed.
- `npm run build`: 48 pages built; Astro check reported 0 errors and 0 warnings (dependency deprecation hints remain outside the published route).
- `npm run verify:static`: verified 48 prerendered pages and all 46 English long-form chapters.
- `python scripts/audit-browser.py`: verified 46 chapters, 46 diagrams and examples, nine route parts, theme, anchors, keyboard behavior, and four responsive viewports.

These checks establish the state of this artifact. They do not certify learning outcomes or a real-world RL deployment.
