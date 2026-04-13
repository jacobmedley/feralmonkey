# decisions.md

## Decision 1 — Monorepo Architecture

Decision:
Use monorepo with tokens, package, and apps separated.

Why:
- shared system control
- reuse across apps
- clear boundaries

Alternatives:
- single app structure
- multiple repos

Rejected:
Too fragmented or too coupled

---

## Decision 2 — Token-Driven System

Decision:
All styling comes from tokens.

Why:
- consistency
- theme support
- Figma parity

Rejected:
component-level styling

---

## Decision 3 — Shared UI Package

Decision:
All reusable UI lives in packages/ui.

Why:
- reuse
- maintainability
- system integrity

Rejected:
app-local components

---

## Decision 4 — Tailwind v4

Decision:
Use Tailwind v4 with CSS variables.

Why:
- flexibility
- token integration

---

## Decision 5 — Manual Tailwind Source Wiring

Decision:
Use @source to include packages/ui.

Why:
- required for monorepo scanning

---

## Decision 6 — Docs Without MDX (for now)

Decision:
Hardcode docs pages initially.

Why:
- speed
- clarity
- avoid premature complexity

Rejected:
MDX, CMS early

---

## Decision 7 — Strict Token Governance

Decision:
Semantic tokens are the contract.

Why:
- prevents drift
- ensures scalability

---

## Decision 8 — AI Workflow Split

Decision:
Separate implementation AI and reasoning AI roles.

Why:
- better output quality
- avoids system drift

---

## Decision 9 — Typography Token Split

Decision:
Font size scale is a primitive constant. Font family, weight, and spacing are semantic/theme variables.

Why:
Multi-brand SaaS requires font overrides per tenant. Size scale is universal and must not be overridden per theme.

---

## Decision 10 — Extended Semantic Tokens

Decision:
success, warning, and info (with foreground pairs) are added to the core semantic set.

Why:
Alert, Badge, and Toast all require them. Adding once to the semantic layer is correct; retrofitting multiple components later is not.

---

## Decision 11 — Package Restructure Deferred

Decision:
Maintain single packages/ui until Dialog proves the component composition pattern at scale.

Why:
Do not scale structure before the pattern is proven. Premature package splits create cross-boundary import churn without payoff.

---

## Decision 12 — Component Completion Standard

Decision:
No component advances to the next until fully complete.

Checklist: variants, sizes, states, tokens, both themes verified, no hardcoded values.

Why:
Partial components shipped as complete create tech debt and inconsistency across themes.

---

## Decision 13 — BFB (Big Flipping Button)

Decision:
Fifth button size. Intentional. Supports landing pages and creative layouts.

Why:
Design systems exist to serve brand expression. An intentionally large CTA size is valid. Document it exactly this way in public docs.