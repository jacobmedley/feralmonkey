# FMDS Handoff — figma-to-code-demo branch

**Date:** 2026-04-27  
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
2. **Figma import JSON generated** — `figma-tokens/fmds-tokens.json` in Tokens Studio format; import via Tokens Studio plugin to sync FMDS tokens into Figma
3. **Generator script** — `tokens/generate-figma-import.mjs` (re-run anytime tokens change)
4. **Confirmed all 4 themes** in DTCG format with hex values — `default`, `fsa`, `hsa`, `patiently`

### Session — 2026-04-27 (afternoon)

1. **Replaced `figma-tokens/Default.tokens.json`** with Bedrock V2 TailwindCSS variable structure — aligned with real Figma collections (`theme`, `radius`, `border-width`, `font`, `color`, `spacing`) and includes `com.figma.variableId` for each token
2. **Per-theme Figma DTCG mode files** — `figma-tokens/{default,fsa,hsa,patiently}.json`; each is a named mode of the `theme` collection with all 33 variables and matching `variableID`s; import directly into Figma Variables
3. **Generator script** — `tokens/generate-figma-themes.mjs`; reads `tokens/themes/*.json` and produces the mode files; carries forward sidebar and chart defaults from `Default.tokens.json` for variables not defined per-theme
4. **npm script added** — `tokens:export-figma`

---

## Current State

| Area | Status |
|------|--------|
| `apps/web` dev server | http://localhost:3000 |
| `apps/docs` dev server | http://localhost:3001 |
| Demo page (`/demo`) | All 35+ components, 4-theme switcher live |
| Home page (`/`) | Foundational components: Button, Input, Accordion, Alert |
| `@fmds/ui` components | 2 custom (Button, Input) + 30 shadcn + Alert, Card, Badge |
| Token build | Working — DTCG format, hex→HSL, `{color.X}` refs resolved |
| Token themes | `default`, `fsa`, `hsa`, `patiently` — all DTCG hex format |
| Tokens Studio export (code → Figma) | `figma-tokens/fmds-tokens.json` — multi-set TS format |
| Figma Variables export (code → Figma) | `figma-tokens/{default,fsa,hsa,patiently}.json` — DTCG mode files |
| Figma Variables base (Bedrock V2) | `figma-tokens/Default.tokens.json` — source of variableIDs |
| Docs component coverage | Button, Card, Input (3 of 35+) |

---

## Architecture

```
figma-tokens/Default.tokens.json      ← Bedrock V2 base (variableID source + Default mode)
figma-tokens/{default,fsa,hsa,patiently}.json  ← per-theme mode files (import into Figma Variables)
figma-tokens/fmds-tokens.json         ← Tokens Studio multi-set export

tokens/primitives.json                ← color palette, radius, typography, spacing (HSL)
tokens/themes/*.json                  ← semantic themes (DTCG, hex values)
  → tokens/build-css-vars.mjs         ← CSS var generation
  → apps/web/src/styles/fmds-tokens.css
  → apps/docs/src/styles/fmds-tokens.css
  → @theme inline in globals.css      ← Tailwind v4 color utilities
  → @fmds/ui components
  → apps/web /demo, apps/docs
```

---

## Figma Import — How to Use

### Tokens Studio (multi-set)
1. Open Tokens Studio plugin in Figma
2. Load `figma-tokens/fmds-tokens.json`
3. Sets: `global` (primitives), `default`, `fsa`, `hsa`, `patiently`

### Figma Variables API / native import (per-mode)
1. Import `figma-tokens/Default.tokens.json` first to establish the variable collection and IDs
2. Import each theme file as a new mode of the `theme` collection:
   - `figma-tokens/default.json` → mode "FMDS Default"
   - `figma-tokens/fsa.json` → mode "FSA"
   - `figma-tokens/hsa.json` → mode "HSA"
   - `figma-tokens/patiently.json` → mode "Patiently"

Regenerate theme mode files anytime: `npm run tokens:export-figma`  
Regenerate Tokens Studio file anytime: `node tokens/generate-figma-import.mjs`

---

## Open Work

### High priority
1. **Figma → code parity** — `import-figma.mjs` produces `tokens/themes/figma-default.json` from the Bedrock V2 export; needs to be added to the demo page theme switcher and verified visually against the Figma design
2. **Docs coverage** — only Button, Card, Input documented; 32+ components have no docs page

### Lower priority
3. **Expand `tokens/primitives.json`** — limited palette (partial red/gray, no zinc/neutral/stone/etc.); blocks theme authors from referencing Tailwind-equivalent primitives
4. **Primitive sync from Figma** — `import-figma.mjs` only imports the `theme` collection; `color` and `radius` primitives from the Figma file are not yet synced to `primitives.json`
5. **Theme portability test** — verify all 4 themes render correctly across the full `/demo` component set (especially HSA extended tokens: success, warning, info)
6. **Sidebar tokens** — `sidebar-*` variables exist in Figma and the export files but are not yet consumed by any component; a Sidebar component would complete that contract
