# FMDS — Project Core

## 1. Objective

Build an open-source design system with:

- Figma ↔ Code parity
- token-driven theming
- reusable UI package
- public documentation and usage examples

**Namespace:** `fmds`

---

## 2. System Overview

### Architecture

Monorepo:

/tokens  
/packages/ui  
/apps/web  
/apps/docs  
/docs  

---

### Core Flow

tokens  
→ build  
→ CSS variables  
→ Tailwind  
→ UI components  
→ apps (web + docs)

---

## 3. Current State

- Token pipeline: complete, automated, multi-output
- CSS variable build: complete — `npm run tokens:build` generates output for all apps
- Tailwind wiring: working (manual, intentional)
- UI package: Button complete, Accordion complete, Alert in progress
- Docs app: working but partially manual
- Theme system: complete — both themes fully populated (default + jacobmedley)

---

## 4. Immediate Priorities

### Priority 1 — Token Pipeline Consistency
**STATUS: DONE**

- token CSS generated automatically via `npm run tokens:build`
- outputs to all apps on every build
- single source, multi-output

---

### Priority 2 — Theme System Completion
**STATUS: DONE**

- `default` and `jacobmedley` fully populated
- theme switching validated in apps/web
- semantic consistency enforced across both themes

---

### Priority 3 — Docs Integrity

Still pending.

Docs must:
- use real components
- use real tokens
- reflect real package imports

Add:
- copy-paste usage blocks
- accurate examples only

---

### Priority 4 — Component Expansion
**STATUS: In progress**

Complete:
- Button (all variants, sizes, states, both themes)
- Input
- Card
- Accordion

In progress:
- Alert

Standard: every component must pass the component checklist before the next begins.

---

## 5. Working Rules

- Tokens are the source of truth
- Semantic tokens are the contract
- Themes override values only
- Components must use semantic tokens
- No hardcoded visual values in shared components
- No shortcuts around monorepo structure
- No premature tooling (MDX, CMS, etc.)

---

## 6. Standard Workflow

When building anything:

1. define/update semantic tokens  
2. update/verify theme mappings  
3. run token build  
4. implement in shared UI package  
5. validate in:
   - apps/web
   - apps/docs  

---

### Never reverse this order

Do not:
- build UI before tokens
- hardcode then refactor later
- document non-real components

---

## 7. AI Usage Model

Use the correct class of AI for each task:

### Implementation-oriented AI
Use for:
- file edits
- debugging
- refactors
- wiring packages and configs
- repetitive component/page creation

---

### Reasoning-oriented AI
Use for:
- architecture
- system decisions
- naming
- governance
- validation

---

### Rules for AI usage

Any AI interaction must:
- preserve architecture
- avoid unrelated refactors
- prefer minimal correct changes
- maintain token-driven system
- avoid introducing drift

---

## 8. Ignore Going Forward

Ignore:

- SPA-first framing as primary architecture
- full Figma-to-code automation assumptions
- temporary path hacks as permanent solutions
- duplicating shared logic inside apps
- premature docs tooling
- premature theming abstractions

---

## 9. Operating Principle

Build in this order:

tokens → themes → components → docs → expansion

Never:

pages → polish → rebuild system later