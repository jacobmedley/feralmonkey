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

### Session — 2026-04-27

1. **Full component showcase** — `/demo` page with all 35+ components and a 4-theme switcher (default, fsa, hsa, patiently)
2. **Figma import JSON generated** — `figma-tokens/fmds-tokens.json` in Tokens Studio format; import via Tokens Studio plugin to sync FMDS tokens into Figma
3. **Generator script** — `tokens/generate-figma-import.mjs` (re-run anytime tokens change to regenerate)
4. **Confirmed all 4 themes** in DTCG format with hex values — `default`, `fsa`, `hsa`, `patiently`

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
| Figma import (code → Figma) | `figma-tokens/fmds-tokens.json` — Tokens Studio ready |
| Figma export (Figma → code) | `figma-tokens/Default.tokens.json` raw export, pipeline TBD |
| Docs component coverage | Button, Card, Input (3 of 35+) |

---

## Architecture

```
figma-tokens/Default.tokens.json   ← raw Figma variable export (Figma → code, TBD)

tokens/primitives.json             ← color palette, radius, typography, spacing (HSL)
tokens/themes/*.json               ← semantic themes (DTCG, hex values)
  → tokens/build-css-vars.mjs      ← CSS var generation
  → apps/web/src/styles/fmds-tokens.css
  → apps/docs/src/styles/fmds-tokens.css
  → @theme inline in globals.css   ← Tailwind v4 color utilities
  → @fmds/ui components
  → apps/web /demo, apps/docs

tokens/generate-figma-import.mjs   ← generates Tokens Studio JSON from current tokens
  → figma-tokens/fmds-tokens.json  ← import this into Figma via Tokens Studio plugin
```

---

## Tokens Studio Import — How to Use

1. Open Figma file
2. Open Tokens Studio plugin
3. Load `figma-tokens/fmds-tokens.json` (multi-file or single-file JSON import)
4. Sets: `global` (primitives), `default`, `fsa`, `hsa`, `patiently`
5. Apply a theme set to a page to test visual output

Regenerate anytime: `node tokens/generate-figma-import.mjs`

---

## Open Work

### High priority
1. **Figma → code parity** — `figma-tokens/Default.tokens.json` is not yet wired into the build; `import-figma.mjs` and the `figma-default` theme need to be restored and added to the demo page theme switcher
2. **Docs coverage** — only Button, Card, Input documented; 32+ components have no docs page

### Lower priority
3. **Expand `tokens/primitives.json`** — limited palette (no full gray scale, partial red, no neutral/zinc); blocks theme authors from referencing more primitives
4. **Primitive sync from Figma** — `import-figma.mjs` only imports the `theme` collection; `color` and `radius` primitives in the Figma file are not synced to `primitives.json`
5. **Theme portability test** — verify all 4 themes render correctly on the full `/demo` component set (especially HSA extended tokens: success, warning, info)
