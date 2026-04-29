# CSS Diff Report — FMDS Brand Refactor (Section 9.2)

Baseline: `tokens/audit/before/fmds-tokens.css`
Current:  `apps/web/src/styles/fmds-tokens.css`

Total diff: 355 lines

---

## Summary of Changes

| Category | Impact | Expected |
|---|---|---|
| chart-1..5 added to `:root` | Additive | ✅ Yes |
| `[data-theme='figma-default']` block added | Noise | ⚠️ See below |
| FSA `--primary` shifted from crimson.500 → crimson.600 | AA fix | ✅ Yes |
| FSA `--border`/`--input` token reordering | No value change | ✅ Yes |
| All themes: `--sidebar-*` tokens added | Additive | ✅ Yes |
| All themes: brand vars expanded flat → 10-step ramps | Additive | ✅ Yes |
| All themes: `--chart-1..5` added | Additive | ✅ Yes |
| Patiently: `--font-family-*` vars moved (reordering) | No value change | ✅ Yes |

---

## Regressions

**None.** No semantic token value changed unexpectedly.

---

## Expected Changes Detail

### 1. `:root` — chart tokens added
```css
+  --chart-1: 12 76% 61%;
+  --chart-2: 173 58% 39%;
+  --chart-3: 197 37% 24%;
+  --chart-4: 43 74% 66%;
+  --chart-5: 27 87% 67%;
```
These were missing from `:root` before. No value change, just previously absent.

### 2. FSA `--primary` AA fix
```diff
-  --primary: 346 100% 58%;   /* crimson.500, contrast 3.7:1 on white — FAILS AA */
+  --primary: 349 100% 35%;   /* crimson.600, contrast 7.27:1 on white — PASSES AA */
```
This is the critical accessibility fix described in Section 4 of the refactor spec.

### 3. Brand ramp expansion (all brand themes)
Flat single-hue vars (e.g. `--brand-teal: ...`) replaced by 10-step ramps:
```css
--brand-navy-50: 195 100% 94%;
--brand-navy-100: ...
...
--brand-navy-900: 218 81% 10%;
```

---

## Unexpected Change

### `[data-theme='figma-default']` block

`tokens/themes/figma-default.json` is the output artifact of `import-figma.mjs`. The build script's `readdirSync` picks up every `.json` in `tokens/themes/`, including this file, and emits a spurious `[data-theme='figma-default']` selector block.

This does not cause a runtime bug (no element will have `data-theme="figma-default"`), but it is dead CSS.

**Resolution options:**
1. Filter the file in build-css-vars.mjs: `filter(f => f.endsWith('.json') && !f.startsWith('figma-'))`
2. Move `figma-default.json` out of `tokens/themes/` to `tokens/import/`
3. Add `figma-default.json` to `.gitignore` and treat it as a transient artifact

Recommended: Option 1 (smallest change, keeps files in place).

---

## Token Reordering (no values changed)

FSA theme: `--border` and `--input` moved up in output order due to iteration order change from brand refactor. Values are identical.

Patiently theme: `--font-family-*` vars moved in output order. Values identical.

---

## Verdict

Safe to ship. One unexpected noise block (`figma-default`), zero regressions.
