# FMDS Handoff — figma-to-code-demo branch

**Date:** 2026-04-28  
**Branch:** `figma-to-code-demo`  
**Repo:** jacobmedley/feralmonkey

---

## Sessions Summary

### Session — 2026-04-25

1. Fixed stale node_modules git artifacts (`@fmds/ui` symlinks)
2. Fixed button.tsx export collision (removed shadcn scaffold, kept FMDS custom)
3. Confirmed shadcn token mapping via `globals.css @theme inline` (Option A)
4. Updated token build to handle W3C DTCG format (unwrap `theme`, extract `$value`)
5. Wired Figma import pipeline (`tokens/import-figma.mjs` → `tokens/themes/figma-default.json`)

### Session — 2026-04-27 (morning)

1. **Full component showcase** — `/demo` page with all 35+ components and a 4-theme switcher (default, fsa, hsa, patiently)
2. **Figma import JSON generated** — `figma-tokens/fmds-tokens.json` in Tokens Studio format
3. **Generator script** — `tokens/generate-figma-import.mjs`
4. **Confirmed all 4 themes** in DTCG format with hex values

### Session — 2026-04-27 (afternoon)

1. **Replaced `figma-tokens/Default.tokens.json`** with Bedrock V2 TailwindCSS variable structure — aligned with real Figma collections and includes `com.figma.variableId` for each token
2. **Per-theme Figma DTCG mode files** — `figma-tokens/{default,fsa,hsa,patiently}.json`; each is a named mode of the `theme` collection with all 33 variables and matching `variableID`s
3. **Generator script** — `tokens/generate-figma-themes.mjs`
4. **npm script added** — `tokens:export-figma`

### Session — 2026-04-28 (FMDS Brand Refactor — figma-to-code-demo)

**Brand palette refactor complete (code side).** OKLCH ramps applied, Figma import fixed, CSS diff validated.

1. **Section 0 audit committed** — `tokens/audit/` contains:
   - `variable-id-snapshot.json` — all original Figma variableIDs, IDs unchanged post-refactor
   - `shared-hex-report.md` — cross-theme hex analysis; chart colors promoted, rose.500/red.600 identified
   - `scopes-snapshot.json` — all `com.figma.scopes` and `com.figma.isOverride` values preserved
   - `derived-ramps.json` — OKLCH ramp output per hue per theme, committed before token files edited

2. **OKLCH brand ramps applied** — `tokens/themes/{fsa,hsa,patiently}.json` now each contain a `brand.*` block with full 10-step ramps (50–900). Step 500 = original base hex unchanged. Steps derived using OKLab L targets from Section 2.2 of FMDS_BRAND_REFACTOR.md.

3. **Semantic alias layer** — all semantic tokens (`background`, `foreground`, `primary`, etc.) now alias into `{theme.brand.*}` or `{color.*}` primitives. Zero raw hex on semantic tokens.
   - FSA `primary` → `{theme.brand.crimson.600}` (was crimson-500, now 7.3:1 vs white — AA fix)
   - FSA/HSA `destructive` → `{color.rose.500}` (#CD3C60, rounded from #CD3B5F)
   - Patiently `destructive` → `{color.red.600}`
   - All themes `chart-1..5` → `{color.chart.*}` shared primitives

4. **Figma import root cause diagnosed** — Figma validates ALL alias references before creating any variables in a single import pass. `{theme.brand.crimson.600}` fails because `theme/brand/crimson/600` doesn't exist yet when the same file creates it. This caused 84/111/107 errors on FSA/HSA/Patiently.

5. **Split import strategy implemented** — `tokens/generate-figma-themes.mjs` now generates two files per brand theme:
   - `*-brand.tokens.json` — brand ramp variables ONLY, raw Figma color objects (no aliases). Import FIRST to create the variables.
   - `*.tokens.json` — semantic alias tokens ONLY, no brand group. Import SECOND after brand vars exist.

6. **`color-additions.tokens.json` added** — adds `color.rose.500` (#CD3C60) and `color.red.600` (#DC2828) to the Bedrock Pebble `color` collection, mode "Wireframes". Confirmed in Figma export.

7. **Section 9.2 CSS diff validated** — `tokens/audit/css-diff-report.md` documents all 355 diff lines. Zero regressions. All changes categorized as expected (brand ramp expansion, chart/sidebar tokens added, FSA primary AA fix) except one noise block.

8. **CSS noise fix applied** — `tokens/build-css-vars.mjs:110` now filters `figma-*` files from the theme scan, eliminating the spurious `[data-theme='figma-default']` block in generated CSS.

---

## Current State

| Area | Status |
|------|--------|
| `apps/web` dev server | http://localhost:3000 |
| `apps/docs` dev server | http://localhost:3001 |
| Demo page (`/demo`) | All 35+ components, 4-theme switcher live |
| Token build | Working — DTCG, hex→HSL, `{color.X}` and `{theme.brand.X.N}` refs resolved |
| Token themes (code) | `default`, `fsa`, `hsa`, `patiently` — brand ramps + semantic aliases |
| Figma split files | `figma-tokens/*-brand.tokens.json` (pass 1) + `*.tokens.json` (pass 2) |
| Figma color additions | `figma-tokens/color-additions.tokens.json` — rose.500 + red.600 confirmed in Figma |
| CSS noise | Fixed — `figma-default` block suppressed in build |
| CSS diff audit | `tokens/audit/css-diff-report.md` — zero regressions |
| Variable ID contract | All original IDs preserved — `tokens/audit/variable-id-snapshot.json` |
| Section 9.3 screenshots | **NOT DONE** — needs dev server + browser capture |
| PR | **NOT OPEN** — pending screenshots |

---

## Architecture

```
figma-tokens/wireframe.tokens.json         ← Bedrock Pebble "FMDS Default" mode (variableID source)
figma-tokens/color-additions.tokens.json   ← Adds color.rose.500 + color.red.600 to Figma

figma-tokens/fsa-brand.tokens.json         ← FSA brand ramps (raw hex) — import FIRST
figma-tokens/fsa.tokens.json               ← FSA semantic aliases — import SECOND
figma-tokens/hsa-brand.tokens.json         ← HSA brand ramps — import FIRST
figma-tokens/hsa.tokens.json               ← HSA semantic aliases — import SECOND
figma-tokens/patiently-brand.tokens.json   ← Patiently brand ramps — import FIRST
figma-tokens/patiently.tokens.json         ← Patiently semantic aliases — import SECOND

tokens/primitives.json                     ← color palette, radius, typography, spacing (HSL)
tokens/themes/*.json                       ← semantic themes (DTCG, brand ramps + aliases)
  → tokens/build-css-vars.mjs              ← CSS var generation (filters figma-* theme files)
  → apps/web/src/styles/fmds-tokens.css
  → apps/docs/src/styles/fmds-tokens.css
  → @theme inline in globals.css           ← Tailwind v4 color utilities
  → @fmds/ui components
  → apps/web /demo, apps/docs
```

---

## Figma Import — How to Use

> **IMPORTANT:** The split import strategy is required. Brand variables must exist before semantic aliases can be set.

### Step 1 — Color primitives (once, any time)
Import `figma-tokens/color-additions.tokens.json` into the Bedrock Pebble collection, mode "Wireframes". Adds `color.rose.500` and `color.red.600`.

### Step 2 — Wireframes mode (no brand ramps, single import)
Import `figma-tokens/wireframe.tokens.json` — mode "FMDS Default"

### Step 3 — FSA mode (two imports, in order)
1. Import `figma-tokens/fsa-brand.tokens.json` — creates 60 brand variables (raw hex)
2. Import `figma-tokens/fsa.tokens.json` — sets 33 semantic alias tokens

### Step 4 — HSA mode (two imports, in order)
1. Import `figma-tokens/hsa-brand.tokens.json` — creates 90 brand variables (raw hex)
2. Import `figma-tokens/hsa.tokens.json` — sets 33 semantic alias tokens

### Step 5 — Patiently mode (two imports, in order)
1. Import `figma-tokens/patiently-brand.tokens.json` — creates 80 brand variables (raw hex)
2. Import `figma-tokens/patiently.tokens.json` — sets 33 semantic alias tokens

Regenerate all figma-tokens files: `npm run tokens:export-figma`

---

## Open Work

### Required before PR can open
1. **Section 9.3 — Demo screenshots** — start `apps/web` dev server, visit `/demo`, capture a screenshot per theme (Default, FSA, HSA, Patiently). Attach to PR description.

### High priority (post-screenshots)
2. **Open PR** — description must include: audit summary, FSA crimson contrast note (3.7:1 → 7.3:1), FSA/HSA destructive rounding note (#CD3B5F → #CD3C60), ramp generation output, and Section 9.3 screenshots.
3. **Re-run Figma import** using the split strategy above. Confirm semantic tokens show as aliases (chip with arrow icon) in Figma Variables panel.
4. **Run `tokens:export-figma` after Figma import** to pull real variable IDs back into repo (replaces `VariableID:placeholder:*` IDs).

### Lower priority
5. **Docs coverage** — only Button, Card, Input documented; 32+ components have no docs page
6. **Contrast audit script** — `tokens/audit-contrast.mjs` per Section 9 of refactor spec; walks Section 4 alias pairs and asserts documented ratios
7. **Ramp verify in CI** — `node tokens/derive-ramps.mjs --verify` to block ramp drift on PRs touching `tokens/themes/*`
8. **Sidebar component** — `sidebar-*` tokens are defined and aliased; no component consumes them yet
9. **HSA accent decision** — teal-500 hits 4.4:1 on white (fails AA for text by 0.1); keep at 500 for non-text UI, or move accent to teal-600. Document in PR.
