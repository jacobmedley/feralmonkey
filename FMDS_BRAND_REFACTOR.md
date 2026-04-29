# FMDS Brand Refactor, Instructions for Claude Code

## Short prompt (paste into Claude Code)

```
Read FMDS_BRAND_REFACTOR.md in full and execute the refactor it describes.

Inputs you have access to:
- The four uploaded theme files: patiently_tokens.json, hsa_tokens.json, fsa_tokens.json, wireframe_tokens.json (these mirror figma-tokens/{patiently,hsa,fsa,default}.json in the repo)
- Repo: jacobmedley/feralmonkey, branch figma-to-code-demo
- HANDOFF.md for architecture context
- The Patiently brand color palette SVG, used as visual reference only

Required workflow:
1. Complete Step 0 audit first. Commit the audit artifacts before touching any token file.
2. Generate the 9-step OKLCH ramps per Section 2 using the algorithm specified there. Commit the generated ramps as their own artifact (`tokens/audit/derived-ramps.json`) before applying them.
3. Apply the brand-palette refactor exactly as specified. Use the locked brand names, ramp steps, and alias maps in this doc. Do not invent new names. Do not hand-edit ramp values.
4. Run all validation steps. Do not open the PR until every check passes.
5. PR description must include: the audit summary, the FSA crimson contrast notes from Section 4, the FSA/HSA destructive rounding note, ramp generation output, and round-trip verification screenshots.

Hard rules: preserve every existing com.figma.variableId, com.figma.scopes, and com.figma.isOverride. No raw hex on any semantic token after the refactor. Chart colors live in shared primitives only. Brand ramps are derived in OKLCH, not hand-tuned.

Stop and ask before merging if any validation step fails or if a hue is flagged for missing contrast in Section 4.
```

---

## Goal

Stop hardcoding hex on semantic tokens. Each theme owns a `brand.*` palette where every brand hue is a 9-step ramp (50 through 900) derived in OKLCH from the base color. Every semantic token aliases into a specific step of `brand.*`, or into shared `color.*` primitives. The result round-trips with Figma Variables and meets WCAG 2.2 AA contrast by construction, not by guessing.

---

## Why ramps, not single hues

The original refactor used one value per brand hue. That works for a flat palette, but it falls apart the moment a component needs:

- a darker primary on hover, focus, active
- a lighter foreground that hits 4.5:1 on a dark button
- a tinted accent background that is not muddy
- a muted state that reads as muted across themes

Hand-picking hex per state per hue per theme is how design drift happens. A 9-step ramp anchored to the base brand color, derived in OKLCH, gives consistent perceptual lightness steps across every hue and every theme. Pick the step the component needs. Done.

OKLCH is used because lightness in OKLCH is perceptually uniform. A "step from 500 to 600" looks like the same amount darker for navy as it does for lime, even though in HSL or RGB those moves are wildly different. This is what makes the ramp predictable and the contrast pairs reusable.

---

## Context

- Repo: `jacobmedley/feralmonkey`, branch `figma-to-code-demo`
- Theme mode files: `figma-tokens/{default,fsa,hsa,patiently}.json`
- Figma Variables base (variable ID source): `figma-tokens/Default.tokens.json` (Bedrock V2)
- Code-side source of truth: `tokens/themes/*.json`
- Build: `tokens/build-css-vars.mjs` already resolves `{...}` aliases
- Wireframes/default is already aliased correctly. Use it as the reference implementation.

---

## Section 0, Required audit before any edits

Do not modify a single file until this audit is complete and committed to the PR description.

1. **Variable ID snapshot.** Read `figma-tokens/Default.tokens.json`. Output a table of every existing `com.figma.variableId`, the token path, and its current `$value`. Save to `tokens/audit/variable-id-snapshot.json`. This is the contract with Figma. If any of these IDs change, every Figma file binding to FMDS breaks.

2. **Diff target.** Run `npm run build` against the current state. Save the generated CSS files (`apps/web/src/styles/fmds-tokens.css`, `apps/docs/src/styles/fmds-tokens.css`) as `tokens/audit/before/`. Final hex per CSS variable must match these byte-for-byte after the refactor for any token whose semantic value did not move steps. Tokens whose semantic step changes (see Section 5) are expected to differ; document each in the PR.

3. **Identify shared vs theme-specific hex.** Generate a report comparing hex usage across all four theme files. Flag every hex that appears in two or more themes. These are candidates for `color.*` shared primitives. Save to `tokens/audit/shared-hex-report.md`.

4. **Confirm scope and override flags.** For every existing token in the four theme files, capture `com.figma.scopes` and `com.figma.isOverride`. Save to `tokens/audit/scopes-snapshot.json`. Preserve these unchanged.

5. **Run the ramp generator.** Execute the OKLCH ramp generator described in Section 2. Save the full output to `tokens/audit/derived-ramps.json`. Reviewers approve the ramp values before they are written into the token files.

Audit output is required for review. No file edits before audit lands.

---

## Section 1, Mandatory shared primitives (`color.*`)

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
- A hex value used in only one theme stays in that theme's `brand.*` ramp. Do not promote single-use hex.

---

## Section 2, Brand color ramps (the new model)

### 2.1, Structure

Every brand hue is a 9-step ramp:

```
brand.<hue>.50
brand.<hue>.100
brand.<hue>.200
brand.<hue>.300
brand.<hue>.400
brand.<hue>.500   <-- the brand base
brand.<hue>.600
brand.<hue>.700
brand.<hue>.800
brand.<hue>.900
```

Step 500 is the brand base color (the hex defined today in the theme file). Steps 50 through 400 are progressively lighter. Steps 600 through 900 are progressively darker.

### 2.2, Generation algorithm

Ramps are derived, not hand-tuned. Use the following deterministic process per hue.

1. Convert the base hex to OKLab (Bjorn Ottosson's matrices, sRGB to linear, linear to OKLab).
2. Hold chroma constant. The (a, b) components of OKLab define the hue and saturation. Keep them.
3. Replace the L (lightness) channel for each step with the target L from the table below.
4. Convert back to linear sRGB, then to sRGB, then to hex. Clamp out-of-gamut channels to 0..1.
5. Step 500 always uses the original base hex unchanged, even if the algorithm would produce a slightly different value. The brand base is sacred.

Target lightness per step:

| Step | OKLab L |
|------|---------|
| 50   | 0.97    |
| 100  | 0.93    |
| 200  | 0.86    |
| 300  | 0.76    |
| 400  | 0.64    |
| 500  | (base, unchanged) |
| 600  | 0.44    |
| 700  | 0.36    |
| 800  | 0.28    |
| 900  | 0.20    |

Implementation lives in `tokens/derive-ramps.mjs`. It reads each theme file's `brand.*` base hexes, generates the full 9-step ramp per hue, and writes them back. Run it once per theme file as part of the build step.

### 2.3, Why this works

The OKLab L target for step 500 (about 0.52) is where the contrast curve crosses 4.5:1 on white. Bases that sit near that lightness produce ramps where step 500 itself works as `primary` against `white` foreground. Bases that sit much lighter (creams, blushes, lilacs) cannot carry text directly at 500. For those hues, semantic `primary` and `accent` use a darker step (typically 700 or 800) and `*-foreground` uses a lighter step. Section 4 documents this per hue.

### 2.4, Edge case, naturally light or naturally dark bases

If a brand base sits at OKLab L >= 0.85 (very light) or L <= 0.30 (very dark), the generated step 500 hex will be the base hex (per rule 5 above), but it may not be the natural midpoint of the ramp. That is fine. The semantic layer compensates by aliasing to a different step. Document the choice in Section 4.

### 2.5, Decorative hues (no ramp)

Some hues are used only for chart, illustration, or display. They do not need 9 steps. Today, none of the live themes have these. If one is added later, it may live as a single value at `brand.<hue>` (no step suffix). Justify in the PR.

---

## Section 3, Brand palettes per theme

### Patiently (`figma-tokens/patiently.json`)

8 hues, 9 steps each, 72 brand color tokens.

```
brand.navy   (base 500 = #121E3D)
brand.lime   (base 500 = #D9FD6F)
brand.iris   (base 500 = #8B93F7)
brand.mint   (base 500 = #EFFEC2)
brand.cream  (base 500 = #F9F8F5)
brand.sand   (base 500 = #F0EFE9)
brand.stone  (base 500 = #E8E5DE)
brand.ash    (base 500 = #5B6070)
```

### HSA (`figma-tokens/hsa.json`)

9 hues, 9 steps each, 81 brand color tokens.

```
brand.navy     (base 500 = #142643)
brand.violet   (base 500 = #56449C)
brand.teal     (base 500 = #238672)
brand.lilac    (base 500 = #FAF0FA)
brand.gray     (base 500 = #666666)
brand.silver   (base 500 = #CCCCCC)
brand.forest   (base 500 = #12784F)
brand.straw    (base 500 = #FFEA9E)
brand.lavender (base 500 = #8D81C1)
```

### FSA (`figma-tokens/fsa.json`)

6 hues, 9 steps each, 54 brand color tokens.

```
brand.navy    (base 500 = #142745)
brand.crimson (base 500 = #FF295B)
brand.blush   (base 500 = #FEEBE5)
brand.sky     (base 500 = #E9F2FF)
brand.mist    (base 500 = #F6FAFF)
brand.slate   (base 500 = #375481)
```

### Wireframes / default (`figma-tokens/default.json`)

No `brand.*` block. This theme already aliases into `color.slate.*`, `color.red.*`, and `color.white`. Leave its semantic tokens alone. Only confirm chart-1 through chart-5 alias to `color.chart.*` instead of any hardcoded hex.

---

## Section 4, Semantic alias map per theme

This is the contract. Every semantic token in every theme aliases to a specific step. No raw hex. No drift.

For each pairing below, the step on the left meets WCAG 2.2 AA against the step on the right (4.5:1 minimum for text, 3:1 minimum for UI).

### Patiently

| Semantic token         | Aliases to                  | Notes |
|------------------------|-----------------------------|-------|
| background             | `{theme.brand.cream.500}`   | base cream |
| foreground             | `{theme.brand.navy.500}`    | 16.4:1 vs background |
| muted                  | `{theme.brand.sand.500}`    | base sand |
| muted-foreground       | `{theme.brand.ash.500}`     | 6.3:1 vs white, 4.6:1 vs sand-500 |
| card                   | `{color.white}`             | |
| card-foreground        | `{theme.brand.navy.500}`    | |
| popover                | `{color.white}`             | |
| popover-foreground     | `{theme.brand.navy.500}`    | |
| border                 | `{theme.brand.stone.500}`   | UI border, 3:1 not required for non-essential |
| input                  | `{theme.brand.stone.500}`   | |
| primary                | `{theme.brand.navy.500}`    | base navy |
| primary-foreground     | `{theme.brand.lime.500}`    | brand pairing, special case (see note) |
| secondary              | `{theme.brand.iris.500}`    | base iris |
| secondary-foreground   | `{theme.brand.navy.500}`    | navy on iris-500 = 6.0:1 |
| accent                 | `{theme.brand.mint.500}`    | base mint |
| accent-foreground      | `{theme.brand.navy.500}`    | navy on mint-500 = high contrast |
| destructive            | `{color.red.600}`           | shared primitive |
| destructive-foreground | `{color.white}`             | |
| ring                   | `{theme.brand.iris.500}`    | |
| chart-1..5             | `{color.chart.1..5}`        | shared |
| sidebar-*              | self-alias to {theme.background}, etc. | mirror Wireframes pattern |

**Note on Patiently primary-foreground:** lime on navy is a brand-mandated pairing. The contrast (6.7:1) passes AA. This is an intentional brand choice that overrides the generic "use the lightest step" rule. Document in PR.

### HSA

| Semantic token         | Aliases to                    | Notes |
|------------------------|-------------------------------|-------|
| background             | `{color.white}`               | |
| foreground             | `{theme.brand.navy.500}`      | 15.1:1 |
| muted                  | `{theme.brand.lilac.500}`     | base lilac |
| muted-foreground       | `{theme.brand.gray.500}`      | 5.7:1 vs white |
| card                   | `{color.white}`               | |
| card-foreground        | `{theme.brand.navy.500}`      | |
| popover                | `{color.white}`               | |
| popover-foreground     | `{theme.brand.navy.500}`      | |
| border                 | `{theme.brand.silver.500}`    | UI border |
| input                  | `{theme.brand.silver.500}`    | |
| primary                | `{theme.brand.violet.500}`    | 7.8:1 vs white, plenty of headroom |
| primary-foreground     | `{color.white}`               | |
| secondary              | `{theme.brand.navy.500}`      | |
| secondary-foreground   | `{color.white}`               | |
| accent                 | `{theme.brand.teal.500}`      | 4.4:1 vs white, just under AA |
| accent-foreground      | `{color.white}`               | **see warning below** |
| destructive            | `{color.rose.500}`            | |
| destructive-foreground | `{color.white}`               | |
| ring                   | `{theme.brand.violet.500}`    | |
| chart-1..5             | `{color.chart.1..5}`          | |
| sidebar-*              | self-alias pattern            | |

**Warning on HSA accent:** teal-500 hits 4.4:1 on white, which fails AA for normal text by 0.1. Two options: (a) keep accent at teal-500 and only use it for non-text UI (icons at 3:1, accents, dividers), (b) move accent to teal-600 (`accent-foreground` = white passes 7.2:1) and use teal-500 only for decoration. Pick one in the PR. The doc currently shows (a). If you choose (b), update the alias map.

### FSA

| Semantic token         | Aliases to                  | Notes |
|------------------------|-----------------------------|-------|
| background             | `{color.white}`             | |
| foreground             | `{theme.brand.navy.500}`    | 14.9:1 |
| muted                  | `{theme.brand.mist.500}`    | base mist |
| muted-foreground       | `{theme.brand.slate.500}`   | 7.6:1 vs white |
| card                   | `{color.white}`             | |
| card-foreground        | `{theme.brand.navy.500}`    | |
| popover                | `{color.white}`             | |
| popover-foreground     | `{theme.brand.navy.500}`    | |
| border                 | `{theme.brand.sky.500}`     | UI border |
| input                  | `{theme.brand.sky.500}`     | |
| primary                | `{theme.brand.crimson.600}` | **see warning, was crimson-500** |
| primary-foreground     | `{color.white}`             | crimson-600 vs white = 7.3:1 |
| secondary              | `{theme.brand.sky.500}`     | |
| secondary-foreground   | `{theme.brand.navy.500}`    | |
| accent                 | `{theme.brand.blush.500}`   | base blush |
| accent-foreground      | `{theme.brand.navy.500}`    | |
| destructive            | `{color.rose.500}`          | |
| destructive-foreground | `{color.white}`             | |
| ring                   | `{theme.brand.crimson.500}` | brand crimson, ring is non-text UI, 3:1 OK |
| chart-1..5             | `{color.chart.1..5}`        | |
| sidebar-primary        | `{theme.brand.crimson.600}` | matches primary |
| sidebar-*              | self-alias pattern          | |

**Warning on FSA crimson:** the brand base `#FF295B` (crimson-500) only hits 3.7:1 on white. That fails AA for primary buttons containing text. Two paths:

1. **Recommended:** alias `primary` to `crimson-600`, which gets 7.3:1. Keep `crimson-500` available for non-text uses (rings, decorative accents, ::marker). The ring stays at 500 because it is a focus indicator over UI elements, not a text container.
2. **Brand override:** keep `primary` at `crimson-500` and accept the AA failure for primary CTAs. This requires explicit sign-off from brand and accessibility owners. Document in the PR.

The map above shows path 1. If brand wants path 2, escalate before merging.

---

## Section 5, Hand-edited semantic shifts to flag

The new ramp model means some semantic tokens get a slightly different hex than they did before, even though the alias points at the same brand hue. Specifically:

- FSA `primary`: was `crimson-500` direct hex, now `crimson-600` (darker). This is a deliberate AA fix.

Every other semantic token continues to resolve to the same hex it did before (they all point at step 500, which equals the base hex by construction). Document in PR with before/after for any tokens whose hex shifted.

---

## Section 6, Target file structure (example, Patiently)

```json
{
  "theme": {
    "radius": { "$type": "number", "$value": 12, "$extensions": { ... preserved ... } },

    "brand": {
      "navy": {
        "50":  { "$type": "color", "$value": { "hex": "#E2F5FF", ... }, "$extensions": { "com.figma.variableId": "VariableID:placeholder:patiently:brand:navy:50", "com.figma.scopes": ["ALL_SCOPES"] } },
        "100": { "$type": "color", "$value": { "hex": "#D5E8FF", ... }, "$extensions": { ... } },
        "200": { "$type": "color", "$value": { "hex": "#BED1FA", ... }, "$extensions": { ... } },
        "300": { "$type": "color", "$value": { "hex": "#9FB1D9", ... }, "$extensions": { ... } },
        "400": { "$type": "color", "$value": { "hex": "#7B8CB2", ... }, "$extensions": { ... } },
        "500": { "$type": "color", "$value": { "hex": "#121E3D", ... }, "$extensions": { ... } },
        "600": { "$type": "color", "$value": { "hex": "#425275", ... }, "$extensions": { ... } },
        "700": { "$type": "color", "$value": { "hex": "#2E3C5E", ... }, "$extensions": { ... } },
        "800": { "$type": "color", "$value": { "hex": "#1A2747", ... }, "$extensions": { ... } },
        "900": { "$type": "color", "$value": { "hex": "#091432", ... }, "$extensions": { ... } }
      },
      "lime":  { "50": {...}, "100": {...}, ..., "900": {...} },
      "iris":  { "50": {...}, "100": {...}, ..., "900": {...} },
      "mint":  { ... },
      "cream": { ... },
      "sand":  { ... },
      "stone": { ... },
      "ash":   { ... }
    },

    "background": { "$type": "color", "$value": "{theme.brand.cream.500}", "$extensions": { ... preserved variableId, scopes, isOverride ... } },
    "foreground": { "$type": "color", "$value": "{theme.brand.navy.500}",  "$extensions": { ... preserved ... } },
    "primary":    { "$type": "color", "$value": "{theme.brand.navy.500}",  "$extensions": { ... preserved ... } }
  }
}
```

---

## Section 7, Files to update

1. `tokens/primitives.json`. Add `color.chart.*`, `color.red.600`, `color.rose.500`, `color.white`, `color.black` if not present.
2. `tokens/derive-ramps.mjs`. New file. Implements the OKLCH ramp algorithm in Section 2.2. Pure function: in = base hex, out = 9-step ramp object. No external deps beyond stdlib.
3. `figma-tokens/Default.tokens.json`. Add new shared primitives and per-theme `brand.<hue>.<step>` variables. Preserve every existing variableId.
4. `figma-tokens/patiently.json`. Add full `brand` ramp tree, alias all semantic tokens to specific steps.
5. `figma-tokens/hsa.json`. Same.
6. `figma-tokens/fsa.json`. Same. Apply the FSA crimson shift from Section 4.
7. `figma-tokens/default.json`. Confirm chart-1..5 alias to `color.chart.*`.
8. `tokens/themes/{default,fsa,hsa,patiently}.json`. Mirror the same structure on the code side.
9. `tokens/generate-figma-themes.mjs`. Emit the full ramp tree per hue per mode.
10. `tokens/import-figma.mjs`. Confirm aliases survive round-trip without flattening, including the new step suffix paths.
11. `tokens/build-css-vars.mjs`. Confirm it resolves multi-segment alias paths like `{theme.brand.navy.500}`. If it currently splits on `.` to build CSS variable names, ramp keys may need quoting or escaping. Test before refactoring.

---

## Section 8, Hard constraints

- Preserve every existing `com.figma.variableId` on tokens that had one. New `brand.<hue>.<step>` and new `color.*` entries get placeholder IDs in a stable format (e.g., `VariableID:placeholder:patiently:brand:navy:500`). Figma rewrites placeholders on first import.
- Preserve `com.figma.scopes` and `com.figma.isOverride` exactly as captured in the Section 0 audit.
- Do not rename the `theme` collection or any mode.
- Aliases use DTCG flat string syntax: `"$value": "{theme.brand.navy.500}"`. No object form for aliases.
- Raw color tokens keep the full Figma `$value` object: `colorSpace`, `components`, `alpha`, `hex`. Do not collapse to just `hex`.
- Ramp values are derived by the generator. Do not hand-edit them in the JSON. If a ramp value looks wrong, fix the generator or the base hex, then regenerate.
- Step 500 always equals the original base hex. The generator enforces this. CI verifies it.

---

## Section 9, Validation (must all pass before merge)

1. `npm run build` completes with zero unresolved alias errors.
2. Generated CSS files match `tokens/audit/before/` byte-for-byte for every token whose semantic step is unchanged. Tokens flagged in Section 5 are expected to differ; the diff matches the documented shift exactly.
3. `/demo` page renders identically across all four themes for unchanged tokens. Capture screenshots per theme and attach to PR. FSA primary buttons are expected to look slightly darker (per Section 4).
4. `npm run tokens:export-figma` regenerates the four mode files cleanly, including the full `brand.<hue>.<step>` tree.
5. Re-import `figma-tokens/Default.tokens.json` plus the four mode files into a Figma test file. Confirm: `brand.<hue>.<step>` variables appear and group correctly under `brand`, semantic variables show as aliases (chip with arrow icon), mode switching still works on canvas.
6. Run `node tokens/import-figma.mjs` against the Figma export. Aliases must survive the round trip. They must not flatten back to hex. Ramp step paths must round-trip exactly (no merging of `navy.500` and `navy.600`).
7. Diff the variable ID snapshot from Section 0 against the post-refactor `Default.tokens.json`. Every original ID is still present and bound to the same token path.
8. Run `node tokens/derive-ramps.mjs --verify`. The generator re-derives every ramp and confirms each existing token file matches. Mismatches fail the build.
9. Contrast check: a small script (`tokens/audit-contrast.mjs`) walks every semantic alias pair listed in Section 4 and asserts the documented contrast ratio is met. Mismatches fail the build.

If any check fails, stop and report. Do not patch around it.

---

## Section 10, Audit cadence (post-merge)

Make this part of the ongoing token workflow, not a one-time exercise.

- **Every PR that touches `figma-tokens/*` or `tokens/themes/*`** runs the variable-ID snapshot diff, the shared-hex report, and the ramp-verify check as a CI step. Block merge on ID drift, on ramp drift, or on contrast regressions.
- **Every Figma import via `import-figma.mjs`** writes a fresh snapshot to `tokens/audit/` with the date. Keep the last 10. Diff against the previous snapshot before committing the import.
- **Quarterly review.** Audit `brand.*` ramps for unused steps (a step nothing aliases to). Audit `color.*` primitives for single-use entries that should demote to a `brand.*` ramp. Audit alias depth: any chain longer than two hops gets flagged.
- **Before any new theme is added.** Run the shared-hex report against the proposed new theme. Any hex it shares with an existing theme must alias to `color.*`, not duplicate into the new `brand.*`. Run the ramp generator to produce the full 9-step tree. Run the contrast audit before merging.
- **Before any new brand hue is added to an existing theme.** Same drill: generate the ramp, run the contrast audit, document semantic alias pairings before the new hue lands.

---

## Section 11, Why this matters (include in PR description)

- Single source per color, plus controlled depth. Change `brand.navy.500` once, every dependent semantic token updates. Need a hover state? Reach for `brand.navy.600`, no new hex.
- WCAG 2.2 AA by construction. Contrast pairs are documented and asserted in CI, not guessed.
- Themes become readable. A designer sees that `primary` is `brand.navy.500` and `accent` is `brand.mint.500`, and that hover states pull from `600` and `700` of the same hue.
- Adding a new brand mode means defining one set of hue base hexes. The generator builds the full 81-token ramp tree. Existing semantic tokens don't change.
- Round-trips with Figma Variables natively, since Figma supports variable-to-variable aliasing and grouped variable names.
- Sets the foundation for dark mode without another structural rewrite. Dark mode is just a different theme that points `primary` at `brand.navy.300` instead of `500`.

---

## Section 12, Out of scope for this PR

- Dark mode token sets.
- Expanded primitive ramps (zinc, neutral, stone) beyond what the refactor needs.
- Sidebar component implementation.
- Docs coverage for the 32 undocumented components.
- Any change to ramp step targets (the OKLab L values in Section 2.2). Those are locked in this PR. Future tuning lives in its own PR with its own contrast audit.

Open a follow-up issue for each.
