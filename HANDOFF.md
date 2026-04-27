# FMDS Handoff — figma-to-code-demo branch

**Date:** 2026-04-25  
**Branch:** `figma-to-code-demo`  
**Repo:** jacobmedley/feralmonkey

---

## What Was Done This Session

### 1. Fixed stale node_modules git artifacts

`node_modules/@fmds/ui` and `node_modules/web` were accidentally tracked as real
directories (not symlinks), which caused `@fmds/ui` components to fail to resolve
at dev-server startup. Removed all tracked node_modules entries and ran `npm install`
to restore the proper workspace symlinks.

### 2. Fixed button.tsx export collision

Two `Button` components existed:
- `packages/ui/src/controls/button.tsx` — FMDS custom, token-driven (kept)
- `packages/ui/src/components/button.tsx` — shadcn scaffold (removed)

`buttonVariants` is now exported from `controls/button.tsx`. `pagination.tsx` and
`alert-dialog.tsx` were updated to import from `../controls/button`.

### 3. Confirmed token mapping for shadcn components (Option A)

Shadcn components use CSS variable names like `bg-popover`, `text-muted-foreground`,
etc. The `globals.css` `@theme inline` block already maps all FMDS token vars to
Tailwind v4 color utilities. No additional work needed — shadcn components render
correctly with FMDS themes.

### 4. Updated token build to handle DTCG format

Theme files (`tokens/themes/*.json`) were updated to W3C DTCG format:
```json
{ "theme": { "background": { "$type": "color", "$value": "#FFFFFF" } } }
```

`tokens/build-css-vars.mjs` was updated to:
- Unwrap the top-level `"theme"` wrapper
- Extract `$value` from DTCG token objects
- Convert hex colors to HSL (`"H S% L%"`) for Tailwind compatibility
- Append `px` units to numeric radius tokens
- Resolve `{color.X}` and `{radius.X}` references directly from primitives
- Remove duplicate `--radius` emission from the primitives block

### 5. Wired Figma tokens into build pipeline

`tokens/import-figma.mjs` — new script that:
- Reads `figma-tokens/Default.tokens.json` (raw Figma variable export)
- Resolves internal `{color.X.Y}` references within the Figma file
- Converts sRGB component values to hex
- Writes `tokens/themes/figma-default.json` in DTCG format

Two new npm scripts in root `package.json`:
- `npm run tokens:import-figma` — run the Figma import step
- `npm run tokens:sync` — import from Figma then build CSS vars

The `figma-default` theme is now live and available as `data-theme="figma-default"`.

---

## Current State

| Area | Status |
|------|--------|
| Dev server | `npm run dev --workspace=apps/web` → http://localhost:3000 |
| `@fmds/ui` components | All shadcn components wired, button collision resolved |
| Token build | Working — DTCG format, hex→HSL conversion, `{color.X}` refs |
| Token themes | `default`, `fsa`, `hsa`, `jacobmedley`, `patiently`, `figma-default` |
| Figma import | `npm run tokens:import-figma` → `tokens/themes/figma-default.json` |
| Shadcn token mapping | Done via `globals.css @theme inline` |

---

## Known Issues / Open Work

### `default.json` color palette is limited

`tokens/primitives.json` has a limited color palette (no `gray`, partial `red` scale, etc.).
`tokens/themes/default.json` references were updated to use available shades (`red.500`
instead of `red.600`, `slate` instead of `gray`). The primitives palette should be
expanded for complete coverage.

### Other theme files not yet converted to DTCG + hex

`hsa.json`, `jacobmedley.json`, `patiently.json` — need to be reviewed and updated to
DTCG format with hex values if they still use legacy flat format.

### Figma import does not update primitives

`import-figma.mjs` only imports the `theme` collection from Figma. The `color` and
`radius` primitives in the Figma file are not yet synced back to `tokens/primitives.json`.
This is intentional for now — primitives should be curated manually until Figma is the
confirmed source of truth.

### Continue Figma ↔ Code parity on demo

The `figma-default` theme is live but not yet featured on the demo page. Next step:
add a theme switcher entry for it and verify visual parity with the Figma design.

---

## Architecture

```
figma-tokens/Default.tokens.json   ← raw Figma export
  → tokens/import-figma.mjs        ← import step (run manually or via tokens:sync)
  → tokens/themes/figma-default.json

tokens/themes/*.json
  → tokens/build-css-vars.mjs      ← CSS var generation
  → apps/web/src/styles/fmds-tokens.css
  → apps/docs/src/styles/fmds-tokens.css
  → @theme inline in globals.css   ← Tailwind v4 color utilities
  → @fmds/ui components
  → apps/web, apps/docs
```

## To Pick Up

1. Add `figma-default` to the theme switcher on the demo page
2. Verify visual parity: `figma-default` theme vs. Figma design
3. Expand `tokens/primitives.json` color palette (add full `gray`, `red` scale, etc.)
4. Convert remaining theme files to DTCG format (`hsa`, `jacobmedley`, `patiently`)
5. Decide whether Figma primitives should also sync to `tokens/primitives.json`
