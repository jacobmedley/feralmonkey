# conventions.md

## 1. Naming

- use semantic naming (primary, secondary, etc.)
- avoid visual names (blue, red)
- tokens follow:
  primitives → semantics → theme

---

## 2. File Structure

### UI Components
packages/ui/src/components/

### Exports
packages/ui/src/index.ts

---

## 3. Component Rules

- must use semantic tokens
- no hardcoded values
- no inline styles
- must be reusable

---

## 4. Styling

- Tailwind utility classes
- token-based variables
- no direct hex values

---

## 5. Imports

- use @fmds/ui for shared components
- do not import components via relative paths across packages

---

## 6. Patterns to Use

- class-variance-authority (variants)
- clsx + tailwind-merge (cn helper)
- forwardRef for inputs

---

## 7. Patterns to Avoid

- duplicated components in apps
- ad hoc styling
- bypassing token system
- modifying structure per theme

---

## 8. Formatting

- consistent spacing
- readable structure
- no mixed styles
- no unnecessary abstraction

---

## 9. Docs Conventions

- real components only
- real usage examples
- copy-paste ready code
- no fake/demo-only UI

---

## 10. Component Naming Layer

| Layer | Description |
|---|---|
| Elements | smallest visual unit, no logic |
| Controls | interactive single-purpose unit |
| Components | composed UI blocks |
| Templates | page-level layout patterns |
| Pages | real routes with real data |

---

## 11. Component Checklist

Before marking any component complete:

- [ ] all variants implemented
- [ ] all sizes implemented
- [ ] all states: hover, focus, active, disabled
- [ ] semantic tokens only, no hardcoded values
- [ ] both themes verified in browser
- [ ] exported from packages/ui/src/index.ts
- [ ] demo in apps/web