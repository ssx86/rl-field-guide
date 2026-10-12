# Reading-release verification matrix

| Area | Required observable result | Status |
| --- | --- | --- |
| Zero-start | Lesson 1 explains the problem before notation | Content-verified |
| Prerequisites | Every lesson separates required knowledge from safe-to-postpone material | Content-verified |
| Knowledge structure | Route shows seven stages, their purposes, order, and lesson counts | Browser-verified |
| Reading-only | No prediction input, reveal button, transfer form, progress score, or hidden lesson explanation appears in published pages | Automated + browser-verified |
| Diagrams | Every lesson contains one labelled semantic figure made from text, lines, cards, bars, or a matrix | Automated + browser-verified |
| Worked examples | Every lesson exposes its setup, intermediate steps, result, and transfer explanation without interaction | Automated-verified |
| Formula meaning | Formula cards sit after the diagram/example and include a spoken reading and meaning | Content-verified |
| Formula correctness | Planning uses `r(s,a,s')`; DQN uses `(1-d)`; deployment evidence is not an equation | Automated-verified |
| Boundaries | Every lesson ends with a lesson-specific failure or validity boundary | Content-verified |
| Bilingual parity | English and Chinese use the same lesson IDs, numeric structures, formulas, and diagram type | Automated-verified |
| Deep links | A directly opened lesson shows current position, prerequisites, and previous/next route | Browser-verified |
| Mobile | 320, 375, 390, and 768px pages have no document-level horizontal overflow | Browser-verified |
| Keyboard | First Tab reaches the skip link; all remaining content is readable without controls | Browser-verified |
| Theme | Light/dark control names the next action and preserves legibility | Browser-verified |
| No JavaScript | Lesson body, diagrams, examples, equations, boundaries, and navigation are prerendered HTML | Build-verified |
| Final capability | Lesson 16 distinguishes evidence planning from production certification | Content-verified |

The raw v1 blind questions are retained separately as audit history. Several expected interactivity because the former brief claimed it; the new release deliberately removes that claim and those controls.
