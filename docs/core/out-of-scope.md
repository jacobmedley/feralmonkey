# out-of-scope.md

## 1. Not Building

- page builders
- visual editors
- full Figma-to-code automation
- design-only systems
- component dumping grounds

---

## 2. Not Introducing Yet

- MDX
- CMS
- search systems
- docs generators
- complex theming frameworks

---

## 3. Disallowed Patterns

- hardcoded styles in shared UI
- primitive token usage in components
- duplicated components in apps
- bypassing packages/ui
- bypassing token system

---

## 4. Rejected Approaches

- SPA-first architecture focus
- direct Figma export workflows
- manual per-app styling systems
- theme-specific components

---

## 5. Known Dead Ends

- path alias hacks instead of proper packages
- partial token systems
- mixing design and implementation naming

---

## 6. Claude Must Not

- restructure the repo
- introduce new architecture layers
- refactor unrelated systems
- replace working foundations
- invent new token structures
- bypass existing conventions

---

## 7. Do Not Do Without Explicit Approval

- restructure the packages/ directory
- add new packages to the monorepo
- change import paths across apps
- modify workspace config in root package.json
- run any task that touches more than one package boundary at once

---

## 7. Red Flags

If Claude suggests:
- “quick fix” bypassing tokens
- duplicating components
- adding new tooling prematurely

It should be rejected.