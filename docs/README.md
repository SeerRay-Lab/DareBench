# DAREBench project page

The official project page for **DAREBench: Deployment-Aware and Reliable Evaluation of Models as Agents**
(arXiv [2609.06059](https://arxiv.org/abs/2609.06059), code [SeerRay-Lab/DareBench](https://github.com/SeerRay-Lab/DareBench)).

It is a static site: HTML, CSS and plain JavaScript, with no build step, no framework and no network
dependencies. Fonts are bundled, so the page renders fully offline (and from mainland China).

## Preview

- Open `index.html` directly in a browser. It works over `file://`: scripts are classic `<script src>`
  tags, data comes from a global (`window.DARE`) rather than `fetch()`, and there are no ES-module imports.
- Or serve the folder: `python3 -m http.server 8000` in this directory, then open http://localhost:8000.

## Deploy

Copy everything **except `_shots/`** to any static host (GitHub Pages, Netlify, an nginx folder, ...).
`_shots/` only holds review screenshots and is not referenced by the page.

For GitHub Pages: put these files in the publishing branch/folder (e.g. `docs/` or `gh-pages`). The default
Jekyll build skips folders whose names start with an underscore, so `_shots/` is left out automatically
(do not add `.nojekyll` unless you also delete `_shots/`).

After deploying, set absolute URLs for the social preview in `index.html`
(`og:image`, `twitter:image`, e.g. `https://<your-domain>/assets/img/social-card.png`); crawlers
ignore relative image URLs. Optionally add `<link rel="canonical" href="https://<your-domain>/">`.

## Layout

```
index.html                  page skeleton (no data digits in static text), SVG sprite and mascot inline
assets/data/data.js         window.DARE: every number, name and paper text shown on the page
assets/js/util.js           helpers: DOM builder, tooltips, radiogroups, roving focus, copy, lightbox
assets/js/content.js        hero, motivation, overview, findings, case study, cite, footer
assets/js/workloads.js      2x3 workload matrix, source benchmarks, task explorer
assets/js/leaderboard.js    Table 1 leaderboard (Full / Text track, API / Local filter, sorting)
assets/js/cost.js           Fig. 1 accuracy-cost scatter and the tokens-vs-dollars chart (Table 2)
assets/js/reliability.js    evidence-based audit, hallucination patterns (Table 3), Figs. 5-6, taxonomy
assets/js/quickstart.js     README quick start, tools used in the paper, task-file anatomy
assets/js/main.js           boot: each section renders inside its own try/catch
assets/css/palette.css      validated color tokens (data colors, surfaces, status)
assets/css/style.css        the "underwater storybook" skin and all components
assets/fonts/               self-hosted woff2 (SIL OFL 1.1, licenses in licenses/)
assets/img/                 paper figures, task images (img/examples/), favicon.svg, social-card.png
```

## Updating numbers

**All numbers come from `assets/data/data.js`. The paper is the single source of truth.**

1. Edit `assets/data/data.js` (or regenerate it with the data builder and copy it here). The comment
   header at the top documents every key. Keep `data.js` a plain `window.DARE = {...};` assignment.
2. Do not type numbers into `index.html` or the JS modules. Charts, tables, tiles and prose read their
   values from `window.DARE`; derived values (for example an Overall accuracy the paper does not tabulate)
   use the paper's own definition and are labelled as derived on the page. Overall = the paper's prose value
   where it states one, otherwise (162 × Table 1 Text Avg + 71 × MM Avg) / 233 (Eq. 11); this form reproduces
   all 9 prose-stated Overalls. The round-1 QA patch that sets this (and withholds the task-file rubric) is
   `homepage/tools/data_build/patch_data_r1.py`; the round-2 patch `homepage/tools/data_build/patch_data_r2.py`
   keeps the example tasks disjoint from the tasks shown in the paper figures on the page (Fig. 3 =
   `task_agentvista_00`, Fig. 5 = `task_simplevqa_07`, Fig. 6 = `task_tablebench_10`, whose answers those
   figures show). The data builder re-applies both after every build. An English rendering of a Chinese
   prompt that the paper does not give is stored as `englishTranslation` and labelled "our translation"
   (`englishGloss` is reserved for wording quoted from the paper).
3. Paper-vs-code mismatches go into `discrepancies` in `data.js`. That list is never displayed.
4. Re-run the checks below.

Figures referenced by `data.js` (for example `img/overview.png`) resolve under `assets/`.

## Checks

The review tools live next to this folder, in `../tools/` (Node + Playwright Chromium; they are not part of
the deploy):

| Command | What it checks |
|---|---|
| `node ../tools/smoke.cjs` | 101 interaction checks: leaderboard tracks/filters/sorting/medals and the compact (overflowing) layout, workload matrix, table views, scatter and keyboard navigation, keyboard tooltips, focus rings, accessible names, lightbox, copy buttons, mobile menu (incl. focus leaving it), the Pause animations button, reduced motion, no horizontal overflow at 360–1920 px, zero console errors; round-2 regressions (no example task shown in an on-page figure, slim phone leaderboard, focused sort buttons never hidden under the sticky column, text-only notice inside the visible table, sources table scrolls in its card); round-3 regressions (every chart table view on a 390 px phone is a named, focusable region with its caption outside the scroller, a swipe hint while it overflows and arrow-key scrolling to the last column; a pixel diff shows the hero kelp never paints over hero text at 1024–1280 px, at rest or at either end of its sway) |
| `node ../tools/numbers.cjs` | static HTML has no digits in visible text; every number rendered on the page traces back to `data.js` |
| `node ../tools/labels.cjs` | scatter: every point is named or numbered (numbers are keyed under the chart) at every width; no label/label, label/point or label/tick overlaps; every name or number sits closer to its own dot than to any other, and a name next to its dot never runs over another dot that is nearer its centre |
| `node ../tools/audit.cjs` | real `file://` policy: fonts load, no external requests, WCAG AA text contrast, focus indicators, headings, landmarks, page weight |
| `node ../tools/shoot.cjs <dir> --full` | desktop (1440) and mobile (390) section screenshots, plus a full-page capture |
| `python3 ../tools/make-social-card.py` | rebuilds `assets/img/social-card.png` (1200x630) from the page's own art and data |

## Browser support and accessibility notes

- Tested in Chromium (desktop and mobile widths, real `file://` policy). Fonts load from `assets/fonts/fonts.css`.
  Firefox gives every `file://` page its own origin and may refuse web fonts loaded from files, so a small
  inline script in `<head>` switches to `assets/fonts/fonts.inline.css` (the same fonts as data URIs) only
  when the page is opened from disk in Firefox. Served over http(s), every browser uses the woff2 files.
- Light theme only. Every chart has a hover and keyboard-focus tooltip and a table view; charts use one
  Tab stop with arrow-key navigation (the leaderboard is a real table: its cell tooltips repeat what the
  headers, crowns, ◆ marks and footnotes already show). All ambient motion stops under
  `prefers-reduced-motion`, pauses when off screen, and can be paused with the "Pause animations" button in
  the hero (remembered in localStorage).

## Credits

Illustrations (the lobster evaluator and the sea creatures) are original SVG art made for this page.
Figures 1, 2, 3, 5 and 6 are reproduced from the paper (Fig. 4 and the appendix case images are not used on the page). The page acknowledges OpenClaw and the 22 source benchmarks.
