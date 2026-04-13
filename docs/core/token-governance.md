
# Feral Monkey Design System (FMDS)
## Token Governance Specification v1.0

**Namespace:** `fmds`  
**Project home:** `feralmonkey.com`  
**Goal:** A portable, open-source design system with parity between Figma and code, supporting multi-theme architecture, documentation, examples, and copy-paste component usage.

---

## 1. Purpose

FMDS exists to create a shared design language across:
- Figma
- code
- documentation
- themes
- public component examples

The system must be:
- portable
- themeable
- open source
- maintainable
- understandable by both developers and non-developers

---

## 2. Core Principles

### 2.1 Single Source of Truth
- Token **schema** (names, structure, governance rules) is owned by the repository.
- Figma mirrors the token system through variables.
- Token names must not drift between Figma and code.

### 2.2 Layered Token Architecture
FMDS uses a layered token model:

1. **Primitive tokens**  
   Raw values with no semantic meaning.

2. **Semantic tokens**  
   Meaningful UI tokens used by components and themes.

3. **Theme tokens**  
   Theme-specific mappings of semantic intent.

4. **Human alias layer** *(planned)*  
   Friendly labels for designers, marketers, and non-technical users.  
   This layer never changes or replaces the core system.

### 2.3 No Drift
- No hardcoded visual values in components
- No one-off token creation during page design
- No renaming tokens casually in Figma
- No design-only naming that breaks code parity

---

## 3. Token Layers

### 3.1 Primitive Tokens
Primitive tokens are raw, reusable values.

Examples:
- `color.slate.100`
- `color.blue.600`
- `spacing.4`
- `radius.lg`

Primitive tokens:
- do not describe UI intent
- are never used directly by product components
- are mapped into semantic tokens

### 3.2 Semantic Tokens
Semantic tokens describe meaning in the UI.

Examples:
- `background`
- `foreground`
- `primary`
- `border`
- `muted.foreground`

Semantic tokens:
- are the only tokens used by components
- must align with shadcn-compatible naming
- are stable across themes

### 3.3 Theme Tokens
Themes override semantic values without changing semantic names.

Required themes:
- `default`
- `jacobmedley`

Each theme:
- uses the same semantic keys
- changes values only
- must remain compatible with shared components

### 3.4 Human Alias Layer (Planned)
This layer exists for accessibility and adoption by non-developers.

Examples:
- `Page Background` → `background`
- `Primary Button` → `primary`
- `Muted Text` → `muted.foreground`

Rules:
- aliases map to semantic tokens only
- aliases do not introduce new values
- aliases do not replace system token names
- aliases are a presentation/documentation layer

---

## 4. Naming Convention

### 4.1 Global Pattern
Primitive tokens follow a structured namespace:

`fmds.{layer}.{category}.{name}[.variant]`

Examples:
- `fmds.color.slate.100`
- `fmds.radius.lg`
- `fmds.font.size.base`

Semantic token documentation may reference shorter names for implementation clarity:
- `background`
- `primary`
- `primary.foreground`

Public docs may show both:
- short semantic name
- fully namespaced path where helpful

### 4.2 Primitive Token Categories
Allowed primitive categories include:
- `color`
- `spacing`
- `radius`
- `font.size`
- `font.weight`
- `breakpoint`
- `container`
- `opacity`
- `blur`
- `border-width`

### 4.3 Semantic Token Set
The core semantic token set includes:

- `background`
- `foreground`

- `card`
- `card.foreground`

- `popover`
- `popover.foreground`

- `primary`
- `primary.foreground`

- `secondary`
- `secondary.foreground`

- `muted`
- `muted.foreground`

- `accent`
- `accent.foreground`

- `destructive`
- `destructive.foreground`

- `border`
- `input`
- `ring`

- `font-family-base`
- `font-family-heading`
- `font-family-mono`

### 4.4 Extended Semantic Tokens
The following are part of the core semantic set:

- `success`
- `success.foreground`
- `warning`
- `warning.foreground`
- `info`
- `info.foreground`

Required by Alert, Badge, Toast, and all feedback components. Not optional.

### 4.5 Typography Layer Split

Font size scale is a primitive constant. It does not change across themes.

Font family, weight, and spacing are semantic and theme variables. Themes override these to express brand identity.

| Layer | Controls |
|---|---|
| Primitive | font size scale (xs → 5xl) |
| Semantic | font family intent (base, heading, mono) |
| Theme | brand font stacks, weight overrides |

---

## 5. Usage Rules

### 5.1 Hard Rules
Components must:
- use semantic tokens only
- never use primitive tokens directly
- never use hardcoded hex, rgb, hsl, px, or other one-off raw values for governed properties

Design files must:
- use governed variables
- avoid local visual overrides unless explicitly temporary

### 5.2 Mapping Rule
Semantic tokens map to primitive tokens.

Example:
- `background` → `color.white`
- `foreground` → `color.slate.950`
- `border` → `color.slate.200`

### 5.3 Component Rule
Product components consume semantic values only.

Examples:
- Button background uses `primary`
- Button text uses `primary.foreground`
- Card surface uses `card`
- Input border uses `input`

---

## 6. Figma and Code Parity

### 6.1 Parity Requirement
Figma and code must share:
- token names
- token meaning
- theme structure
- variant naming where possible

### 6.2 Figma Rules
Figma variables should be organized into collections for:
- theme
- color
- spacing
- radius
- font

Figma modes should eventually include:
- `Default`
- additional modes for theme variants as needed

### 6.3 Code Rules
Code implementation should reflect the same semantics through:
- CSS variables
- Tailwind theme extensions
- shadcn-compatible component usage

---

## 7. Theming Rules

### 7.1 Theme Strategy
Themes override semantic tokens, not primitives or component APIs.

### 7.2 Required Themes
FMDS starts with:
- `default`
- `jacobmedley`

### 7.3 Theme Integrity
A theme must:
- preserve semantic token meaning
- preserve accessibility goals where possible
- not require component rewrites

---

## 8. Component Alignment

### 8.1 Component Philosophy
FMDS components are code-owned, open-source, and theme-driven.

### 8.2 shadcn Compatibility
FMDS semantic naming should remain compatible with shadcn-style conventions whenever possible.

### 8.3 Variant Naming
Variants should stay consistent across Figma and code.

Examples:
- `default`
- `secondary`
- `outline`
- `ghost`
- `destructive`

Sizes:
- `sm`
- `default`
- `lg`

---

## 9. Repository Structure

Expected structure:

```text
/tokens
  /themes
    default.json
    jacobmedley.json
  primitives.json
  semantics.json

/docs
  token-governance.md
  human-alias-layer.md

/apps
  /docs
  /web

/packages
  /ui