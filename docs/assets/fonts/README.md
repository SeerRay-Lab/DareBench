# DAREBench homepage: local webfonts

These fonts are self-hosted, so the pages render offline, from mainland China and
over `file://`, with no CDN. Every file is a WOFF2 **latin subset**, downloaded
from the Google Fonts CSS2 API (fonts.gstatic.com), and all six families are licensed under the
**SIL Open Font License 1.1**. The license texts are in `licenses/`, copied from
github.com/google/fonts `ofl/<family>/OFL.txt`.

Include the fonts with `<link rel="stylesheet" href="shared/fonts/fonts.css">`.
The path is relative to the page. The `url()`s inside `fonts.css` are relative
to that CSS file.

`fonts.inline.css` is a generated alternative with the same `@font-face`
rules, but every font is inlined as a base64 `data:` URI (357 KB). Use it
instead of `fonts.css` only when a page is **not** in the same directory as
`shared/`, or in a parent of it, and must also work over `file://` in Firefox.
Firefox's strict file-origin policy can block font files from a parent
directory. Chromium loads both variants over `file://`; this was tested.
Only Chromium was available here, so Firefox itself was not tested.

| CSS `font-family` | Role (token in fonts.css) | File | Axis / weights | Style | Upstream version | License |
|---|---|---|---|---|---|---|
| `"Fredoka"` | rounded cartoon display (`--font-display`) | `fredoka-latin-wght.woff2` (29.7 KB) | variable wght 300–700 | normal | Fredoka 2.001 (gstatic v17) | OFL 1.1, © 2016 The Fredoka Project Authors |
| `"Bangers"` | comic headline, all-caps (`--font-comic`) | `bangers-latin-400.woff2` (23.5 KB) | 400 | normal | Bangers 2.100 (v25) | OFL 1.1, © 2010 The Bangers Project Authors |
| `"Patrick Hand"` | hand-drawn accent, small notes (`--font-hand`) | `patrickhand-latin-400.woff2` (23.9 KB) | 400 | normal | Patrick Hand 1.003 (v25) | OFL 1.1, © 2010–2012 Patrick Wagesreiter |
| `"Caveat"` | handwritten scribble, large annotations only (`--font-scribble`) | `caveat-latin-wght.woff2` (74.9 KB) | variable wght 400–700 | normal | Caveat 2.000 (v23) | OFL 1.1, © 2014 The Caveat Project Authors |
| `"Nunito"` | body text, UI, chart text (`--font-body`) | `nunito-latin-wght.woff2` (39.1 KB) | variable wght 200–1000 | normal | Nunito 3.602 (v32) | OFL 1.1, © 2014 The Nunito Project Authors |
| `"Nunito"` | body italic | `nunito-latin-wght-italic.woff2` (41.8 KB) | variable wght 200–1000 | italic | Nunito 3.602 (v32) | OFL 1.1 |
| `"JetBrains Mono"` | code, CLI flags, task ids (`--font-mono`) | `jetbrainsmono-latin-wght.woff2` (31.4 KB) | variable wght 400–800 (use 400/700) | normal | JetBrains Mono 2.211 (v24) | OFL 1.1, © 2020 The JetBrains Mono Project Authors |

Total: about 264 KB. A browser downloads a face only when some text uses it.

## Verification (2026-09-23)

- Each file starts with the `wOF2` magic bytes. Each also decodes with Node's
  built-in brotli, and its `name`, `fvar`, `maxp` and `cmap` tables parse. The
  inspector is `homepage/tools/fonts/woff2info.cjs`.
- Each file's md5 matches a fresh re-download of the same gstatic URL.
- Axis ranges are read from the `fvar` table:
  - Fredoka: wght 300–700
  - Caveat: wght 400–700
  - Nunito: wght 200–1000
  - JetBrains Mono: wght 400–800
- Coverage: every face maps ASCII A–Z, a–z, 0–9 and the usual punctuation, plus
  `– — ’ “ ” · × ±`. None of the latin subsets contains `→` (U+2192) or `≈`
  (U+2248). These characters render in the next font of the stack, so use
  inline SVG icons for arrows in headings.
- A specimen page was rendered in headless Chromium over `file://`:
  `homepage/tools/fonts/specimen.html`, with screenshots in `shots/`.
  With both `fonts.css` and `fonts.inline.css`, all seven faces reported
  "loaded", `document.fonts.check()` returned true for every family and
  weight, and the page had no console errors and no failed requests. The
  glyphs were inspected visually.

## Usage notes

- **Bangers** has uppercase-style glyphs only, so lowercase input renders as
  small caps. Use it for short punchy labels such as section kickers and
  badges. Do not use it for sentences or numbers that people need to read
  precisely.
- **Numbers.** Nunito's default figures are already **tabular**. In Chromium
  at 40px, `1111` and `0000` both measure 96.0px. The subset has no `tnum` or
  `pnum` feature, so `font-variant-numeric` changes nothing. As a result,
  leaderboard and table columns align on their own; right-align them. Hero
  numbers will also use equal-width digits, which is an accepted trade-off.
  Fredoka figures are proportional (`1111` 64px vs `0000` 92px). Do not use
  Fredoka or Bangers for numbers in tables, charts or stat tiles: keep figures
  in `--font-body` (dataviz rule: no display face on figures).
- **JetBrains Mono ligatures.** The subset has `calt` ligatures, so `=>`
  renders as a single arrow glyph. Set `font-variant-ligatures: none` on code
  and CLI blocks so users see the literal characters they will type.
- **Luckiest Guy** was considered and **rejected**: it is Apache-2.0, not OFL.
  Bangers fills the comic-headline role.
- To refresh the fonts, request
  `https://fonts.googleapis.com/css2?family=...&display=swap` with a modern Chrome
  User-Agent. Take only the `/* latin */` block of each family. Keep the
  `unicode-range` shown in `fonts.css`.
