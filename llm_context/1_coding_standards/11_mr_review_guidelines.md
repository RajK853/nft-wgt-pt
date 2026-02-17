# PR Review Guidelines

---

## LLM Review Summary Header

When an LLM reviews a PR, begin with one of:

- ✅ **Looks good!** — No significant issues found.
- ❌ **Has N issue(s)** — Brief description of blockers.

---

## Standard Checklist

### Code Quality
- [ ] No `any` types — uses specific TypeScript types
- [ ] No unused variables or imports (ESLint `no-unused-vars`)
- [ ] Naming follows conventions (`PascalCase` components, `camelCase` hooks/utils, `use` prefix for hooks)
- [ ] Imports are grouped and use `@/` alias — no relative `../../` paths
- [ ] Single responsibility — components and hooks do one thing

### React Patterns
- [ ] No `'use client'` directives — this is not Next.js
- [ ] No `next/*` imports — uses `react-router-dom` for navigation
- [ ] Data fetching in `useEffect` with cleanup (cancelled flag)
- [ ] Loading / error / empty / data guard pattern applied
- [ ] Derived values computed inline — not stored as redundant state

### Supabase / Auth
- [ ] Uses `getSupabaseClient()` — no direct `createClient()` in components
- [ ] Supabase errors are checked and surfaced in UI (not silently swallowed)
- [ ] No `service_role` key referenced anywhere client-side
- [ ] Mock data fallback works when user is unauthenticated

### Styling
- [ ] CSS Modules used for page/component-level styles
- [ ] `cn()` utility used for conditional class merging
- [ ] No inline style objects for layout (use CSS Modules)

### Git
- [ ] Follows Conventional Commits (`feat:`, `fix:`, `refactor:`, etc.)
- [ ] Branch name follows `issues/#{number}_{name}` convention

### General
- [ ] Build passes: `bun run build`
- [ ] Tests pass: `bun test`
- [ ] Lint passes: `bun run lint`
- [ ] No breaking changes to existing pages/components

---

## Bug Fix Checklist

- [ ] Root cause correctly identified (not just symptoms patched)
- [ ] Fix doesn't introduce regressions in related code
- [ ] A test case covers the bug scenario

---

## New Feature Checklist

- [ ] Meets stated requirements
- [ ] Follows existing patterns (see `2_component_design.md`, `2_page_design_guide.md`)
- [ ] Loading and error states handled
- [ ] Works in both authenticated and unauthenticated (mock data) modes
