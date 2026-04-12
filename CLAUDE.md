# CLAUDE.md

## FMDS — Master Entry Point

This repository contains the **Feral Monkey Design System (FMDS)**.

Claude should read this file first, then use the linked docs below to understand the system, constraints, and implementation patterns before making changes.

---

## 1. Project Overview

FMDS is an open-source design system intended to create strict parity between design (Figma) and code.

The system supports:

- token-driven styling
- reusable shared UI components
- theme portability
- public documentation
- scalable architecture

Namespace: `fmds`

---

## 2. Purpose

FMDS ensures:

- tokens define all visual output
- components consume semantic tokens
- themes override values only
- apps consume shared UI (no duplication)
- documentation reflects real implementation

---

## 3. Goals

- Figma ↔ Code parity
- token-driven theming
- reusable UI package
- public docs with real examples
- scalable system across themes and apps

---

## 4. Current Status

### Working
- token system
- token build → CSS vars
- Tailwind v4 integration
- shared UI package (`@fmds/ui`)
- apps consuming package
- docs app rendering
- Button / Input / Card components

### In Progress
- multi-theme system
- docs completeness
- token build automation across apps
- Figma parity expansion
- human-readable alias layer

---

## 5. Architecture Overview

Monorepo:

/tokens  
/packages/ui  
/apps/web  
/apps/docs  
/docs  

---

## 6. Core Flow

tokens → build → CSS vars → Tailwind → components → apps

---

## 7. Key Rules

- tokens = source of truth
- semantics = contract
- themes = value overrides
- components must use semantic tokens
- no hardcoded values in shared UI
- apps must not duplicate UI logic

---

## 8. Claude Responsibilities

Claude should:

- respect architecture boundaries
- modify the smallest correct scope
- keep system token-driven
- avoid refactoring unrelated code
- validate changes in apps

---

## 9. Required Reading

- architecture.md
- conventions.md
- decisions.md
- out-of-scope.md