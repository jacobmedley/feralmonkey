# FMDS Handoff — figma-to-code-demo branch

**Date:** 2026-04-26  
**Branch:** `figma-to-code-demo`  
**Repo:** jacobmedley/feralmonkey

---

## What Was Done This Session

### 1. Shadcn component library scaffolded into `@fmds/ui`

Twenty-plus shadcn/ui components were added to `packages/ui/src/components/`:

`alert-dialog`, `aspect-ratio`, `avatar`, `breadcrumb`, `button`, `checkbox`,
`collapsible`, `command`, `context-menu`, `dialog`, `dropdown-menu`, `hover-card`,
`label`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`,
`scroll-area`, `select`, `separator`, `sheet`, `skeleton`, `slider`, `sonner`,
`switch`, `table`, `tabs`, `textarea`, `tooltip`

All are exported from `packages/ui/src/index.ts`. The index distinguishes two tiers:

- `controls/` — custom FMDS implementations (Button, Input) — these own the token contract
- `components/` — shadcn-based primitives — use Radix UI + Tailwind, not yet token-mapped

### 2. Patiently theme added

`tokens/themes/patiently.json` added. Theme list is now:
`default`, `fsa`, `hsa`, `jacobmedley`, `patiently`

`tokens/themes/default.json` and `fsa.json` were also updated.

### 3. Web app updated

- `apps/web/src/app/layout.tsx` — layout changes
- `apps/web/src/app/globals.css` — global style updates
- `apps/web/src/styles/fmds-tokens.css` — token CSS expanded (~140 lines added)
- `apps/web/src/components/ThemeToggle.tsx` — theme toggle updated
- `figma-tokens/Default.tokens.json` — Figma token export added (7000+ lines, raw from Figma)

### 4. `command.tsx` runtime bug fixed

`cmdk` v1 changed from a nested API (`Command.Input`, `Command.List`, etc.) to flat named exports
(`CommandInput`, `CommandList`, etc.). The generated shadcn component used the old API and crashed
at module load. Fixed by importing flat exports from cmdk and aliasing to avoid name collisions.

---

## Current State

| Area | Status |
|------|--------|
| Dev server | Running — `http://localhost:3000` via `npm run dev --workspace=apps/web` |
| `@fmds/ui` components | All shadcn components scaffolded, exports wired |
| Token themes | 5 themes present, build pipeline intact |
| `command.tsx` | Fixed — cmdk v1 compatible |
| Figma tokens file | Present at `figma-tokens/Default.tokens.json`, not yet wired to build |
| `packages/ui/tsconfig.json` | Added this session |
| `packages/ui/components.json` | Added (shadcn config scaffold) |

---

## Known Issues / Open Work

### `node_modules/` files tracked in git

Several `node_modules/` paths are tracked as modified but were intentionally excluded from the
last commit. They will show as dirty in `git status`:

```
node_modules/.package-lock.json
node_modules/@fmds/ui/package.json
node_modules/@fmds/ui/src/index.ts
node_modules/web/src/app/globals.css
node_modules/web/src/app/layout.tsx
node_modules/web/src/styles/fmds-tokens.css
```

These are workspace symlink artifacts. They need to be untracked:

```bash
git rm --cached node_modules/.package-lock.json
git rm --cached -r node_modules/@fmds/ui
git rm --cached -r node_modules/web
git commit -m "chore: untrack node_modules artifacts"
```

### Shadcn components not yet token-mapped

Components in `packages/ui/src/components/` use raw Tailwind classes (`bg-popover`,
`text-muted-foreground`, etc.) via shadcn's CSS variable convention. These CSS variables are
**not** currently emitted by the FMDS token build. Two paths forward:

- **Option A:** Map shadcn's expected variable names (`--popover`, `--muted-foreground`, etc.)
  into the token build output so shadcn components just work.
- **Option B:** Replace shadcn Tailwind classes with FMDS semantic token classes component
  by component — more work but keeps strict token parity.

Option A is faster; Option B is architecturally correct for FMDS goals.

### `figma-tokens/Default.tokens.json` not wired to build

The Figma token export is present but nothing reads it yet. The existing build reads
`tokens/themes/*.json`. Decide whether to reconcile these two token sources or treat
`figma-tokens/` as a raw import step that feeds into `tokens/`.

### `button.tsx` exists in both tiers

- `packages/ui/src/controls/button.tsx` — FMDS custom, token-driven
- `packages/ui/src/components/button.tsx` — shadcn scaffold, added this session

Both are exported from `index.ts`. This will cause an export name collision. The shadcn
`button.tsx` should either be removed (use the controls version) or reconciled.

---

## Architecture Reminder

```
tokens/themes/*.json
  → tokens/build-css-vars.mjs
  → CSS custom properties
  → Tailwind v4 theme
  → @fmds/ui components
  → apps/web, apps/docs
```

CLAUDE.md rules that matter here:
- components must use semantic tokens — no hardcoded values
- themes = value overrides only
- do not restructure `packages/` or add monorepo packages without approval

---

## To Pick Up

1. Fix the `button.tsx` export collision (remove or reconcile shadcn version)
2. Decide on token mapping strategy for shadcn components (Option A vs B above)
3. Untrack the stale `node_modules/` git entries
4. Wire `figma-tokens/Default.tokens.json` into the build pipeline or document its purpose
5. Continue expanding Figma ↔ Code parity on the demo branch
