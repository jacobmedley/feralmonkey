# FMDS — Purpose and Goals

## Purpose

Feral Monkey Design System (FMDS) exists to create a portable, open-source design system with strict parity between design and implementation.

FMDS is built to ensure that:
- tokens define the system
- components consume tokens
- themes override tokens
- documentation reflects real implementation

**Namespace:** `fmds`

---

## Primary Goals

### 1. Single Source of Truth
All visual decisions originate from governed token definitions.

No component or app should define its own visual system outside tokens.

---

### 2. Figma ↔ Code Parity
Design and code must describe the same system:
- same token structure
- same naming
- same semantics

Drift between Figma and code is considered a system failure.

---

### 3. Theme Portability
Themes must:
- reuse semantic tokens
- override values only
- never change meaning or component APIs

A component should render correctly across all themes without modification.

---

### 4. Shared UI System
All reusable UI must live in a shared package:
- `packages/ui`

Apps must consume—not recreate—components.

---

### 5. Public Documentation
FMDS must provide a public system under `feralmonkey.com` that includes:
- real components
- real token usage
- real code examples
- copy-paste usage patterns

Documentation must reflect reality, not mockups.

---

## Non-Goals

FMDS is not:

- a visual style guide without implementation
- a one-click Figma-to-code generator
- a component dumping ground
- a page builder
- a system that prioritizes speed over structure

---

## Success Criteria

FMDS is successful when:

- tokens drive all visual output
- semantic tokens remain stable over time
- multiple themes render correctly without component changes
- shared components are used across apps
- docs reflect actual package usage
- engineers and designers operate from the same system language

---

## Failure Conditions

FMDS is failing if:

- components contain hardcoded values
- tokens are bypassed
- apps duplicate UI logic
- themes require component rewrites
- docs diverge from real implementation