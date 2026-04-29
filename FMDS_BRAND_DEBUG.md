# FMDS Brand Refactor — Debug Analysis & Fix Plan for Claude Code

**Date:** 2026-04-28
**Branch:** `figma-to-code-demo`
**Status:** Figma import failing on brand files. Semantic tokens not updating.

---

## Quick framing

The split-import strategy is correct in concept. The execution has three concrete bugs that are causing the import errors and the missing semantic updates. All three are in the generator (`tokens/generate-figma-themes.mjs`). Fix them, regenerate, re-import.

This doc gives you the diagnosis, the smoking gun for each bug, and the exact code change.

---

## Bug 1 — `isOverride: true` on every brand variable

### What's happening

Every variable in the brand files (`fsa-brand.tokens.json`, `hsa-brand.tokens.json`, `patiently-brand.tokens.json`) has `com.figma.isOverride: true`. Verified across all three files:

```
FSA brand:        60 tokens, 60 with isOverride: true, 0 without
HSA brand:        90 tokens, 90 with isOverride: true, 0 without
Patiently brand:  80 tokens, 80 with isOverride: true, 0 without
```

### Why it's wrong

`isOverride: true` tells Figma "this variable already exists in another mode of this collection. Set its value for this mode only. Do not create a new variable."

The brand variables are **brand new**. They don't exist in any mode yet. The Wireframes/FMDS Default mode has no `theme.brand.*` group at all (verified — it only has `radius`, `background`, `foreground`, etc.).

When Figma reads `isOverride: true` on a variable that doesn't exist in any mode, the import fails with a validation error. This is what's causing the 84/111/107 errors mentioned in the HANDOFF.

### Why this happened

The generator likely defaulted `isOverride: true` for every emitted token, copying the pattern from the existing wireframe and semantic files (which legitimately set values for variables that already exist in the base mode).

### The fix

Brand files are **creating** variables. They must use `isOverride: false`. Semantic files are **overriding** existing variables in the Wireframes mode and should keep `isOverride: true`.

Update `tokens/generate-figma-themes.mjs`:

```javascript
// In the brand-emit branch (when writing *-brand.tokens.json):
const brandToken = {
  $type: "color",
  $value: { colorSpace: "srgb", components: [...], alpha: 1, hex: "#XXXXXX" },
  $extensions: {
    "com.figma.variableId": `VariableID:placeholder:${theme}:brand:${hue}:${step}`,
    "com.figma.scopes": ["ALL_SCOPES"],
    "com.figma.isOverride": false   // <-- FIX: was true
  }
};

// In the semantic-emit branch (when writing fsa.tokens.json etc), keep isOverride: true.
```

Add a unit assertion in the generator so this can't regress:

```javascript
function assertOverrideFlags(file, expected) {
  walkTokens(file, (token, path) => {
    const ovr = token.$extensions?.["com.figma.isOverride"];
    if (ovr !== expected) {
      throw new Error(
        `${path}: expected isOverride=${expected}, got ${ovr}`
      );
    }
  });
}
// Brand files:
assertOverrideFlags(brandFile, false);
// Semantic files:
assertOverrideFlags(semanticFile, true);
```

---

## Bug 2 — Brand and semantic files share the same mode name

### What's happening

Both `fsa-brand.tokens.json` and `fsa.tokens.json` declare:

```json
"$extensions": { "com.figma.modeName": "FSA" }
```

Same for HSA and Patiently. This is the intent (both files target the FSA mode of the theme collection), but combined with Bug 1 it creates a chicken-and-egg problem.

### Why it matters in this state

When you import `fsa-brand.tokens.json` first into the FSA mode:

1. Figma sees `theme.brand.navy.50` with `isOverride: true`.
2. Figma looks for an existing variable at that path in the theme collection.
3. None exists.
4. Import fails before any variable is created.

Even if you fix Bug 1, there's a second-order issue: if the brand variables only exist in the FSA mode (because brand colors are FSA-specific), they need to be defined for the **default mode** of the collection too, otherwise the FSA mode is "overriding" something that doesn't have a default value, which Figma may also reject.

### The fix

Two valid approaches. **Option A is recommended.** It's simpler and matches the multi-brand pattern Figma was designed for.

#### Option A — Move brand variables to a separate collection (recommended)

Brand ramps live in a new collection called `brand` (separate from `theme`). One collection, one mode per theme that has brand colors (`FSA`, `HSA`, `Patiently`). Wireframes/FMDS Default has no mode in this collection because it has no brand colors.

This means:
- Brand variables are first-class, not tied to the theme collection
- Semantic aliases in the `theme` collection reference variables in the `brand` collection (Figma supports cross-collection aliases)
- No `isOverride` confusion: brand vars are created cleanly in their own collection

Generator change:

```javascript
// Old: emit brand tokens nested under "theme.brand.*"
// New: emit brand tokens at the top level under "brand.*", in a separate file
//      that targets the brand collection.

// fsa-brand.tokens.json now looks like:
{
  "brand": {
    "navy": {
      "50": { "$type": "color", "$value": {...}, "$extensions": { ... isOverride: false ... } },
      // ...
    }
  },
  "$extensions": {
    "com.figma.modeName": "FSA",
    "com.figma.collectionName": "brand"   // <-- NEW: explicit collection target
  }
}

// fsa.tokens.json (semantic) aliases now reference {brand.navy.500} not {theme.brand.navy.500}:
"primary": {
  "$value": "{brand.crimson.600}",
  "$extensions": { ... }
}
```

The semantic file still targets the `theme` collection, FSA mode. The aliases cross collections, which Figma resolves at import time as long as the brand collection was imported first.

#### Option B — Keep brand under theme collection, define defaults in Wireframes

If you want to keep brand variables inside the theme collection, the FMDS Default mode (Wireframes) must define a default value for every `brand.*` variable. The default can be a placeholder (e.g., transparent black or `#000000`) since FMDS Default doesn't visually use brand colors. Then each theme mode overrides those defaults with real ramp values.

This means:
- Wireframes file gets 60+90+80 = 230 new placeholder variables
- The brand variables become "bound" to the theme collection forever
- More noise in the FMDS Default mode

Not recommended. But valid if you have a reason to keep one collection.

### Recommendation

Use Option A. Brand colors are conceptually a separate axis from theme semantics. A separate collection makes that explicit and avoids the override-flag mess entirely.

---

## Bug 3 — Generator default for placeholder variableIds may collide

### What's happening

Verified all 60 brand variable IDs in `fsa-brand.tokens.json` are unique within that file:

```
Total brand variable IDs: 60
Unique:                   60
All placeholder?          True
```

Sample:
```
VariableID:placeholder:fsa:brand:navy:50
VariableID:placeholder:fsa:brand:navy:100
...
VariableID:placeholder:fsa:brand:navy:900
```

### Why it might still be a problem

After the first successful import, Figma assigns real variableIds (e.g., `VariableID:1234:5678`). The next time you run `tokens:export-figma`, the generator should pull those real IDs back into the repo. The HANDOFF flags this as Open Work item #4.

But if the generator doesn't read existing IDs from the prior export and instead overwrites them with fresh placeholders, every subsequent import will look like new variables and Figma will create duplicates.

### Verification

Run this after your first successful import + re-export:

```bash
# Brand variableIds should no longer be placeholders
grep -c '"placeholder:fsa:brand"' figma-tokens/fsa-brand.tokens.json
# Expected: 0

grep -c '"VariableID:[0-9]' figma-tokens/fsa-brand.tokens.json
# Expected: 60
```

If either fails, the generator's ID-preservation logic is broken. The fix is to read the existing file (if present) and merge real IDs in before writing.

### The fix (preventive)

In the generator, before emitting brand tokens, read the existing file if it exists and use its variableIds when present:

```javascript
function loadExistingIds(filepath) {
  if (!fs.existsSync(filepath)) return new Map();
  const existing = JSON.parse(fs.readFileSync(filepath, "utf8"));
  const ids = new Map();
  walkTokens(existing, (token, path) => {
    const id = token.$extensions?.["com.figma.variableId"];
    if (id && !id.startsWith("VariableID:placeholder:")) {
      ids.set(path, id);
    }
  });
  return ids;
}

// In the emit:
const existingIds = loadExistingIds(brandFilePath);
// ...
const variableId = existingIds.get(path)
  ?? `VariableID:placeholder:${theme}:brand:${hue}:${step}`;
```

---

## Why the semantic tokens "aren't updating"

The HANDOFF says semantics are not getting updated. Two causes, both downstream of the import failures:

1. **The brand import fails (Bug 1) → Figma rolls back the whole import.** No brand variables are created. When you then try to import `fsa.tokens.json`, every `{theme.brand.crimson.600}` alias points to nothing. Figma rejects the entire file. Semantic tokens unchanged.

2. **If brand import partially succeeded** (depends on Figma's atomicity, which from the docs is per-file all-or-nothing), the semantic import would still fail because the brand variables are at `theme.brand.crimson.600` but `isOverride: true` on the brand side meant they were never actually created with that path.

Fix Bug 1 + Bug 2 (Option A), and the semantic import will succeed because the alias targets will resolve cleanly.

---

## Step-by-step fix plan for Claude Code

Execute in this order. Stop and report if any step fails.

### Step 1 — Confirm the diagnosis

Run these checks against the current files. They should all confirm the bugs above:

```bash
# Bug 1: every brand token has isOverride: true
node -e '
const f = JSON.parse(require("fs").readFileSync("figma-tokens/fsa-brand.tokens.json"));
let yes=0, no=0;
function walk(o) {
  if (o && typeof o === "object") {
    if (o.$type) {
      const ovr = o.$extensions?.["com.figma.isOverride"];
      if (ovr === true) yes++; else no++;
      return;
    }
    Object.values(o).forEach(walk);
  }
}
walk(f.theme);
console.log("isOverride true:", yes, "false:", no);
'
# Expected: isOverride true: 60 false: 0   <-- confirms bug 1
```

### Step 2 — Update the generator

Edit `tokens/generate-figma-themes.mjs`:

1. **Apply Option A from Bug 2.** Brand variables emit to a separate collection.
   - Brand files are now top-level `brand.*` (not `theme.brand.*`)
   - Brand files declare `com.figma.collectionName: "brand"` in `$extensions`
   - Semantic alias references update from `{theme.brand.navy.500}` to `{brand.navy.500}`

2. **Apply the Bug 1 fix.** Brand emit branch sets `isOverride: false`. Semantic emit branch keeps `isOverride: true`.

3. **Apply the Bug 3 preventive fix.** Add `loadExistingIds()` and use real IDs when present.

4. **Add the assertion helpers** (`assertOverrideFlags`) and run them at the end of the emit pass. Fail the build on mismatch.

### Step 3 — Update the code-side themes to match

`tokens/themes/{fsa,hsa,patiently}.json` currently use `{theme.brand.X.N}` aliases. Update them to `{brand.X.N}` to match the new collection structure.

`tokens/build-css-vars.mjs` needs to resolve the new alias path. Verify it walks both the `theme.*` and `brand.*` namespaces. If it only walks `theme.*`, add brand resolution.

### Step 4 — Regenerate

```bash
npm run tokens:export-figma
```

Verify output:

```bash
# Brand files: isOverride must be false
grep -c '"com.figma.isOverride": false' figma-tokens/fsa-brand.tokens.json
# Expected: 60

# Brand files: top-level "brand" key, not nested under "theme"
node -e 'const f = require("./figma-tokens/fsa-brand.tokens.json"); console.log(Object.keys(f));'
# Expected: ["brand", "$extensions"]

# Semantic files: aliases use {brand.X.N} not {theme.brand.X.N}
grep -c 'theme\.brand\.' figma-tokens/fsa.tokens.json
# Expected: 0

grep -c '{brand\.' figma-tokens/fsa.tokens.json
# Expected: matches the count of brand-aliased semantic tokens (around 18)
```

### Step 5 — Build and validate CSS output

```bash
npm run build
```

Diff against `tokens/audit/before/` for tokens whose semantic step is unchanged. Only documented Section 5 shifts (FSA primary crimson-500 -> crimson-600) should differ.

### Step 6 — Re-import to Figma

In this exact order:

1. Import `figma-tokens/color-additions.tokens.json` into the **Bedrock Pebble** color collection, mode "Wireframes"
2. Import `figma-tokens/wireframe.tokens.json` into the **theme** collection, mode "FMDS Default"
3. For each brand theme:
   1. Import `figma-tokens/{theme}-brand.tokens.json` into the **brand** collection, mode "{Theme}". This creates new variables.
   2. Import `figma-tokens/{theme}.tokens.json` into the **theme** collection, mode "{Theme}". This sets aliases pointing at the brand collection.

If any import fails, capture the exact Figma error message and the file. Do not retry until the error is understood.

### Step 7 — Re-export to capture real variableIds

```bash
npm run tokens:export-figma
```

Verify placeholders are gone:

```bash
grep -c "placeholder" figma-tokens/fsa-brand.tokens.json
# Expected: 0
```

Commit the updated files.

---

## What success looks like

- `figma-tokens/*-brand.tokens.json` has top-level `brand` key, every token with `isOverride: false`
- `figma-tokens/{fsa,hsa,patiently}.tokens.json` aliases to `{brand.X.N}` (not `{theme.brand.X.N}`), every token with `isOverride: true`
- Figma import succeeds for all three themes without errors
- In Figma, the `brand` collection appears with three modes (FSA, HSA, Patiently), each containing the appropriate ramp variables
- Semantic tokens in the `theme` collection display alias chips with arrow icons pointing to brand variables
- Mode switching on canvas changes both the brand colors and the semantic aliases together
- After re-export, all variableIds are real (`VariableID:NNNN:NNNN`), no `placeholder:` strings remain

---

## What to escalate

Stop and ask before proceeding if:

- Any check in Step 1 doesn't match the expected output (means the diagnosis is incomplete and the upstream files are in a different state than analyzed)
- Figma rejects the brand import even after the fix (capture the exact error message; there may be a fourth bug in scopes or token type)
- The CSS diff after Step 5 shows changes outside the documented Section 5 shifts (means the alias path migration broke something)
- Re-export in Step 7 still shows `placeholder:` strings (means the ID preservation logic in Bug 3 fix is broken)
