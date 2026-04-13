# FMDS — Engineering Rules

## 1. Core Principles

### 1.1 Tokens First
All visual output must originate from tokens.

---

### 1.2 Semantic Tokens Are the Contract
Components must consume semantic tokens only.

Never use raw values in shared UI components.

---

### 1.3 Themes Override Values Only
Themes must not change:
- semantic meaning
- component structure
- component API

---

### 1.4 Shared UI Lives in `packages/ui`
Reusable components must not exist in app-local folders.

---

### 1.5 Apps Are Consumers
Apps must:
- consume shared UI
- consume token outputs
- not duplicate system logic

---

## 2. Repository Rules

### Structure

/tokens  
/packages/ui  
/apps/web  
/apps/docs  
/docs  

---

### Ownership

- tokens → token definitions
- ui → components
- web → validation app
- docs → public system docs

---

### Do Not Collapse Boundaries

Do not:
- move components into apps
- duplicate tokens
- bypass package boundaries

---

## 3. Token Rules

### Layers

- primitives (raw values)
- semantics (meaning)
- themes (mapping)
- aliases (human-readable, optional)

---

### Constraints

- primitives are never used directly in components
- semantics define UI meaning
- themes map semantics to values

---

### Hard Rules

- no hex values in shared components
- no direct primitive usage
- no ad hoc tokens during UI building

---

### fontFamily Token Layer

fontFamily belongs in the semantic and theme layers, not primitives alone.

- primitives define available font stack values
- semantics name the intent (base, heading, mono)
- themes override to brand-specific fonts per tenant

---

### Extended Semantic Tokens

success, warning, and info (with foreground pairs) are part of the core semantic set.

They are not optional extensions. Required by Alert, Badge, Toast, and all feedback components.

---

### Typography Primitives Are Constants

Font size scale is defined in primitives and does not change across themes.

The theme layer controls brand expression: font family, weight, and spacing overrides only.

---

## 4. Theme Rules

Themes must:
- preserve semantic structure
- override values only
- work without modifying components

---

### Required Themes

- default
- jacobmedley

---

## 5. UI Package Rules

### Component Location

packages/ui/src/components

---

### Exports

All components must be exported through:

packages/ui/src/index.ts

---

### Dependency Ownership

All dependencies used by the package must be declared in the package.

---

## 6. Styling Rules

- Tailwind must scan shared package source
- CSS variables must be imported before usage
- manual wiring is acceptable when required by architecture

---

## 7. Documentation Rules

Docs must:
- use real components
- reflect real token usage
- include real code examples

---

### Do Not Introduce Yet

- MDX
- CMS
- docs generators
- search

---

## 8. Workflow Rules

### Component Creation

1. validate tokens
2. validate themes
3. build in shared package
4. export
5. test in apps
6. document

---

### Component Completion Standard

No component moves to the next until fully complete.

Checklist:
- variants ✓
- sizes ✓
- states: hover, focus, active, disabled ✓
- semantic tokens only, no hardcoded values ✓
- both themes verified in browser ✓
- exported from packages/ui/src/index.ts ✓
- demo in apps/web ✓

---

### Token Changes

1. update tokens
2. update themes
3. rebuild
4. validate apps
5. update docs

---

## 9. AI-Assisted Engineering

### Use implementation-focused AI for:
- coding
- debugging
- refactoring

---

### Use reasoning-focused AI for:
- architecture
- governance
- validation

---

### Guardrails

AI must not:
- restructure the repo
- introduce drift
- over-refactor
- bypass tokens

---

## 10. Completion Checklist

- token build passes
- CSS vars are current
- UI package works
- apps render correctly
- Tailwind scans package
- docs reflect real usage
- no duplicated logic exists