# Tooling for Enforcement

Tools used to enforce code quality in this project.

---

## Type Checking — TypeScript (`tsc`)

TypeScript 5 with strict mode. Run a type check without emitting:

```bash
bunx tsc --noEmit
```

Config: `tsconfig.json` — uses `@/` path alias resolving to `src/`.

---

## Linting — ESLint v9

ESLint with the modern **flat config** format (`eslint.config.mjs`). Includes `eslint-plugin-react` and React hooks rules.

```bash
bun run lint
```

Key rules enforced:
- `no-unused-vars` — warn on unused imports/variables
- `react-hooks/rules-of-hooks` — enforces hooks rules
- `react-hooks/exhaustive-deps` — enforces `useEffect` dependency arrays
- `react/prop-types` — disabled (TypeScript covers this)

> **Prettier is NOT used in this project.** ESLint is the sole formatting/style tool.

---

## Testing — Vitest

**Vitest** is the test runner (configured in `package.json` under `"vitest"`). React Testing Library is used for component tests.

```bash
bun test                # Run all tests
bun test --watch        # Watch mode
bun test --coverage     # With coverage report
```

Test setup file: `vitest-setup.js` (imports `@testing-library/jest-dom` matchers).

Test environment: `jsdom` (browser-like environment for component tests).

---

## Build — Vite

```bash
bun run build    # Production build (outputs to dist/)
bun run preview  # Preview the production build locally
```

Vite config: `vite.config.ts`
- React plugin (`@vitejs/plugin-react`)
- Tailwind CSS 4 plugin (`@tailwindcss/vite`)
- Code splitting: vendor (react, react-dom, react-router-dom), charts (recharts), ui (radix-ui)
- Minification: `terser`

---

## Summary

| Tool | Purpose | Command |
|------|---------|---------|
| `tsc` | Type checking | `bunx tsc --noEmit` |
| ESLint v9 | Linting + style | `bun run lint` |
| Vitest | Unit/component tests | `bun test` |
| Vite | Build + dev server | `bun run dev` / `bun run build` |

> There is no Prettier, no Husky, and no lint-staged configured in this project.
