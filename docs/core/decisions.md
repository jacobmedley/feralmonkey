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