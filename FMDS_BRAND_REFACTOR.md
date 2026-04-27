# FMDS Brand Refactor — Instructions for Claude Code

## Short prompt (paste this into Claude Code)

```
Read FMDS_BRAND_REFACTOR.md in full and execute the refactor it describes.

Inputs you have access to:
- The four uploaded theme files: Patiently_tokens.json, HSA_tokens.json, FSA_tokens.json, Wireframes_tokens.json (these mirror figma-tokens/{patiently,hsa,fsa,default}.json in the repo)
- Repo: jacobmedley/feralmonkey, branch figma-to-code-demo
- HANDOFF.md for architecture context

Required workflow:
1. Complete Step 0 audit first. Commit the audit artifacts before touching any token file.
2. Apply the brand-palette refactor exactly as specified. Use the locked brand names and alias maps in this doc. Do not invent new names.
3. Run all validation steps. Do not open the PR until every check passes.
4. PR description must include: the audit summary, the FSA/HSA destructive rounding note, and the round-trip verification screenshots.

Hard rules: preserve every existing com.figma.variableId, com.figma.scopes, and com.figma.isOverride. No raw hex on any semantic token after the refactor. Chart colors live in shared primitives only.

Stop and ask me before merging if any validation step fails or if you find tokens that don't fit the alias map.
```

---

## Goal

Stop hardcoding hex on semantic tokens. Each theme owns a `brand.*` palette of raw hues. Every semantic token aliases into either `brand.*` (theme-specific) or `color.*` (shared primitives). Round-trips cleanly with Figma Variables.

---

## Context

- Repo: `jacobmedley/feralmonkey`, branch `figma-to-code-demo`
- Theme mode files: `figma-tokens/{default,fsa,hsa,patiently}.json`
- Figma Variables base (variable ID source): `figma-tokens/Default.tokens.json` (Bedrock V2)
- Code-side source of truth: `tokens/themes/*.json`
- Build: `tokens/build-css-vars.mjs` already resolves `{...}` aliases
- Wireframes/default is already aliased correctly. Use it as the reference implementation.

---

## Step 0 — Required audit before any edits

Do not modify a single file until this audit is complete and committed to the PR description.

1. **Variable ID snapshot.** Read `figma-tokens/Default.tokens.json`. Output a table of every existing `com.figma.variableId`, the token path, and its current `$value`. Save to `tokens/audit/variable-id-snapshot.json`. This is the contract with Figma. If any of these IDs change, every Figma file binding to FMDS breaks.

2. **Diff target.** Run `npm run build` against the current state. Save the generated CSS files (`apps/web/src/styles/fmds-tokens.css`, `apps/docs/src/styles/fmds-tokens.css`) as `tokens/audit/before/`. Final hex per CSS variable must match these byte-for-byte after the refactor.

3. **Identify shared vs theme-specific hex.** Generate a report comparing hex usage across all four theme files. Flag every hex that appears in two or more themes. These are candidates for `color.*` shared primitives. Save to `tokens/audit/shared-hex-report.md`.

4. **Confirm scope and override flags.** For every existing token in the four theme files, capture `com.figma.scopes` and `com.figma.isOverride`. Save to `tokens/audit/scopes-snapshot.json`. Preserve these unchanged.

Audit output is required for review. No file edits before audit lands.

---

## Mandatory shared primitives (`color.*`)

These are not optional. They live in `tokens/primitives.json` and the Figma `color` collection. Every theme that uses them aliases in.

```json
{
  "color": {
    "white":  { "$type": "color", "$value": { "hex": "#FFFFFF", ... } },
    "black":  { "$type": "color", "$value": { "hex": "#000000", ... } },

    "chart": {
      "1": { "$type": "color", "$value": { "hex": "#E76E50", ... } },
      "2": { "$type": "color", "$value": { "hex": "#2A9D90", ... } },
      "3": { "$type": "color", "$value": { "hex": "#274754", ... } },
      "4": { "$type": "color", "$value": { "hex": "#E8C468", ... } },
      "5": { "$type": "color", "$value": { "hex": "#F4A462", ... } }
    },

    "red":  { "600": { "$type": "color", "$value": { "hex": "#DC2626", ... } } },
    "rose": { "500": { "$type": "color", "$value": { "hex": "#CD3C60", ... } } }
  }
}
```

### Rules

- Chart colors are identical across all four themes today. Promote them to `color.chart.1` through `color.chart.5`. No theme is allowed to redefine them. No exceptions.
- HSA destructive (`#CD3C60`) and FSA destructive (`#CD3B5F`) differ by one digit. Round both to `#CD3C60` and alias both to `color.rose.500`. Note this in the PR.
- Patiently destructive (`#DC2626`) maps to `color.red.600`.
- A hex value used in only one theme stays in that theme's `brand.*`. Do not promote single-use hex.

---

## Brand palette — locked names per theme

Use these exact key names. Do not reinvent. Do not use UI roles like `brand.primary`.

### Patiently (`figma-tokens/patiently.json`)

```
brand.navy   = #121E3D
brand.lime   = #D9FD6F
brand.iris   = #8B93F7
brand.mint   = #EFFEC2
brand.cream  = #F9F8F5
brand.sand   = #F0EFE9
brand.stone  = #E8E5DE
brand.ash    = #5B6070
```

### HSA (`figma-tokens/hsa.json`)

```
brand.navy    = #142643
brand.violet  = #56449C
brand.teal    = #238672
brand.lilac   = #FAF0FA
brand.gray    = #666666
brand.silver  = #CCCCCC
```

### FSA (`figma-tokens/fsa.json`)

```
brand.navy     = #142745
brand.crimson  = #FF295B
brand.blush    = #FEEBE5
brand.sky      = #E9F2FF
brand.mist     = #F6FAFF
brand.slate    = #375481
```

### Wireframes / default (`figma-tokens/default.json`)

No `brand.*` block needed. This theme is already fully aliased into `color.slate.*`, `color.red.*`, and `color.white`. Leave its semantic tokens alone. Only confirm chart-1 through chart-5 alias to `color.chart.*` instead of the current hardcoded hex.

---

## Semantic alias map per theme

After the refactor, semantic `$value` looks like this. No raw hex on any semantic token.

### Patiently

```
background             -> {theme.brand.cream}
foreground             -> {theme.brand.navy}
muted                  -> {theme.brand.sand}
muted-foreground       -> {theme.brand.ash}
card                   -> {color.white}
card-foreground        -> {theme.brand.navy}
popover                -> {color.white}
popover-foreground     -> {theme.brand.navy}
border                 -> {theme.brand.stone}
input                  -> {theme.brand.stone}
primary                -> {theme.brand.navy}
primary-foreground     -> {theme.brand.lime}
secondary              -> {theme.brand.iris}
secondary-foreground   -> {theme.brand.navy}
accent                 -> {theme.brand.mint}
accent-foreground      -> {theme.brand.navy}
destructive            -> {color.red.600}
destructive-foreground -> {color.white}
ring                   -> {theme.brand.iris}
chart-1..5             -> {color.chart.1..5}
sidebar-*              -> self-alias to {theme.background}, {theme.foreground}, {theme.primary}, etc. (mirror Wireframes pattern)
```

### HSA

```
background             -> {color.white}
foreground             -> {theme.brand.navy}
muted                  -> {theme.brand.lilac}
muted-foreground       -> {theme.brand.gray}
card                   -> {color.white}
card-foreground        -> {theme.brand.navy}
popover                -> {color.white}
popover-foreground     -> {theme.brand.navy}
border                 -> {theme.brand.silver}
input                  -> {theme.brand.silver}
primary                -> {theme.brand.violet}
primary-foreground     -> {color.white}
secondary              -> {theme.brand.navy}
secondary-foreground   -> {color.white}
accent                 -> {theme.brand.teal}
accent-foreground      -> {color.white}
destructive            -> {color.rose.500}
destructive-foreground -> {color.white}
ring                   -> {theme.brand.violet}
chart-1..5             -> {color.chart.1..5}
sidebar-*              -> self-alias pattern
```

### FSA

```
background             -> {color.white}
foreground             -> {theme.brand.navy}
muted                  -> {theme.brand.mist}
muted-foreground       -> {theme.brand.slate}
card                   -> {color.white}
card-foreground        -> {theme.brand.navy}
popover                -> {color.white}
popover-foreground     -> {theme.brand.navy}
border                 -> {theme.brand.sky}
input                  -> {theme.brand.sky}
primary                -> {theme.brand.crimson}
primary-foreground     -> {color.white}
secondary              -> {theme.brand.sky}
secondary-foreground   -> {theme.brand.navy}
accent                 -> {theme.brand.blush}
accent-foreground      -> {theme.brand.navy}
destructive            -> {color.rose.500}
destructive-foreground -> {color.white}
ring                   -> {theme.brand.crimson}
chart-1..5             -> {color.chart.1..5}
sidebar-*              -> self-alias pattern
```

---

## Target structure (example: Patiently)

```json
{
  "theme": {
    "radius": { "$type": "number", "$value": 12, "$extensions": { ... preserved ... } },

    "brand": {
      "navy":  { "$type": "color", "$value": { "hex": "#121E3D", "colorSpace": "srgb", "components": [...], "alpha": 1 }, "$extensions": { "com.figma.variableId": "VariableID:placeholder:patiently:brand:navy", "com.figma.scopes": ["ALL_SCOPES"] } },
      "lime":  { "$type": "color", "$value": { "hex": "#D9FD6F", ... }, "$extensions": { ... } },
      "iris":  { "$type": "color", "$value": { "hex": "#8B93F7", ... }, "$extensions": { ... } },
      "mint":  { "$type": "color", "$value": { "hex": "#EFFEC2", ... }, "$extensions": { ... } },
      "cream": { "$type": "color", "$value": { "hex": "#F9F8F5", ... }, "$extensions": { ... } },
      "sand":  { "$type": "color", "$value": { "hex": "#F0EFE9", ... }, "$extensions": { ... } },
      "stone": { "$type": "color", "$value": { "hex": "#E8E5DE", ... }, "$extensions": { ... } },
      "ash":   { "$type": "color", "$value": { "hex": "#5B6070", ... }, "$extensions": { ... } }
    },

    "background": { "$type": "color", "$value": "{theme.brand.cream}", "$extensions": { ... preserved variableId, scopes, isOverride ... } },
    "foreground": { "$type": "color", "$value": "{theme.brand.navy}",  "$extensions": { ... preserved ... } },
    "primary":    { "$type": "color", "$value": "{theme.brand.navy}",  "$extensions": { ... preserved ... } }
  }
}
```

---

## Files to update

1. `tokens/primitives.json`. Add `color.chart.*`, `color.red.600`, `color.rose.500`, `color.white`, `color.black` if not present.
2. `figma-tokens/Default.tokens.json`. Add new shared primitives and per-theme `brand.*` variables. Preserve every existing variableId.
3. `figma-tokens/patiently.json`. Add `brand` group, alias all semantic tokens.
4. `figma-tokens/hsa.json`. Same.
5. `figma-tokens/fsa.json`. Same.
6. `figma-tokens/default.json`. Confirm chart-1..5 alias to `color.chart.*`.
7. `tokens/themes/{default,fsa,hsa,patiently}.json`. Mirror the same structure on the code side.
8. `tokens/generate-figma-themes.mjs`. Emit `brand` group correctly per mode.
9. `tokens/import-figma.mjs`. Confirm aliases survive round-trip without flattening.

---

## Hard constraints

- Preserve every existing `com.figma.variableId` on tokens that had one. New `brand.*` and new `color.*` entries get placeholder IDs in a stable format (e.g., `VariableID:placeholder:patiently:brand:navy`). Figma rewrites placeholders on first import.
- Preserve `com.figma.scopes` and `com.figma.isOverride` exactly as captured in the Step 0 audit.
- Do not rename the `theme` collection or any mode.
- Aliases use DTCG flat string syntax: `"$value": "{theme.brand.navy}"`. No object form for aliases.
- Raw color tokens keep the full Figma `$value` object: `colorSpace`, `components`, `alpha`, `hex`. Do not collapse to just `hex`.

---

## Validation (must all pass before merge)

1. `npm run build` completes with zero unresolved alias errors.
2. Generated CSS files match `tokens/audit/before/` byte-for-byte. No visual regressions.
3. `/demo` page renders identically across all four themes. Capture screenshots per theme and attach to PR.
4. `npm run tokens:export-figma` regenerates the four mode files cleanly, including the new `brand` group.
5. Re-import `figma-tokens/Default.tokens.json` plus the four mode files into a Figma test file. Confirm: `brand.*` variables appear, semantic variables show as aliases (chip with arrow icon), mode switching still works on canvas.
6. Run `node tokens/import-figma.mjs` against the Figma export. Aliases must survive the round trip. They must not flatten back to hex.
7. Diff the variable ID snapshot from Step 0 against the post-refactor `Default.tokens.json`. Every original ID is still present and bound to the same token path.

If any check fails, stop and report. Do not patch around it.

---

## Audit cadence (post-merge)

Make this part of the ongoing token workflow, not a one-time exercise.

- **Every PR that touches `figma-tokens/*` or `tokens/themes/*`** runs the variable-ID snapshot diff and the shared-hex report as a CI step. Block merge on ID drift.
- **Every Figma import via `import-figma.mjs`** writes a fresh snapshot to `tokens/audit/` with the date. Keep the last 10. Diff against the previous snapshot before committing the import.
- **Quarterly review.** Audit `brand.*` palettes for unused colors and `color.*` primitives for single-use entries that should demote to a `brand.*` group. Audit alias depth: any chain longer than two hops gets flagged.
- **Before any new theme is added.** Run the shared-hex report against the proposed new theme. Any hex it shares with an existing theme must alias to `color.*`, not duplicate into the new `brand.*`.

---

## Why this matters (include in PR description)

- Single source per color. Change `brand.navy` once, every dependent semantic token updates.
- Themes become readable. A designer sees at a glance that `primary` is `brand.navy` and `accent` is `brand.mint`.
- Adding a new brand mode means defining one `brand.*` block and pointing existing semantic tokens at it. No hex hunting.
- Round-trips with Figma Variables natively, since Figma supports variable-to-variable aliasing.
- Sets the foundation for color ramps and dark mode without another structural rewrite.

---

## Out of scope for this PR

- Dark mode tokens
- Expanded primitive ramps (zinc, neutral, stone) beyond what the refactor needs
- Sidebar component implementation
- Docs coverage for the 32 undocumented components

Open a follow-up issue for each.
