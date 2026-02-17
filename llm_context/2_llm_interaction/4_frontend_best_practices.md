# Frontend Best Practices Guide

Decision rules for the LLM agent when generating UI code, designing components, or planning page layouts. This is a ruleset — not a tutorial. For implementation patterns and CSS templates, see `2_page_design_guide.md` and `2_component_design.md`.

---

## 1. UI/UX Principles

| Rule | Detail |
|------|--------|
| **Visual hierarchy first** | Most important information = largest/brightest. Secondary = muted (`#9ca3af`). Never equal weight everything. |
| **Information density** | Show summary → details on demand (use `Expander`, tabs, or modals). Avoid walls of data. |
| **Consistency over creativity** | Reuse existing spacing, colors, and component patterns before inventing new ones. |
| **Progressive disclosure** | Hide complexity until needed. Reveal with `RevealButton`, `Expander`, or a drill-down route. |
| **Empty states are UI** | Always design for: loading → error → empty → data. Never render nothing silently. |

---

## 2. Component API Design

- **Sensible defaults** — every optional prop should have a value that works without configuration
- **One responsibility** — if a component needs a 3+ line comment to explain its job, split it
- **Composable over configurable** — prefer `children` over a long list of content props
- **Avoid boolean prop explosion** — if you need `isLarge`, `isDark`, `isOutline`, use a `variant` string instead
- **Stable callbacks** — wrap handlers in `useCallback` when passed to memoized children
- **Never derive state from props on mount** — use controlled patterns; sync via `useEffect` only when unavoidable

---

## 3. Responsive Design

| Approach | When to use |
|----------|-------------|
| `auto-fit` + `minmax()` fluid grid | Default — no breakpoints needed for most grids |
| `@media` breakpoints | Only for layout structural changes (e.g., hide sidebar, stack header) |
| `container queries` | Component-level responsiveness (card changes layout based on its container) |
| Fixed breakpoints in this project | mobile `<480px`, tablet `<768px`, desktop `≥1024px` |

- Always test at 375px width (iPhone SE) and 1440px (wide desktop)
- Padding should shrink on mobile: `2rem` desktop → `1rem` mobile
- Touch targets: minimum `44×44px`

---

## 4. Accessibility (WCAG 2.2 AA)

- **Contrast**: white text on `#111827` ✅ — check any new color combination at 4.5:1 ratio minimum
- **Semantic HTML**: use `<button>`, `<nav>`, `<main>`, `<section>`, `<h1>`–`<h6>` in correct order; never `<div onClick>`
- **Keyboard navigation**: all interactive elements must be reachable via Tab and operable via Enter/Space
- **Focus indicators**: never remove `outline`; use `focus-visible` to hide from mouse users only
- **ARIA**: only add `aria-*` when semantic HTML is insufficient — wrong ARIA is worse than none
- **`prefers-reduced-motion`**: wrap all decorative animations in the media query guard (already in `2_page_design_guide.md`)

---

## 5. Performance

| Rule | Threshold / Detail |
|------|--------------------|
| Memoize with `useMemo` | Only for computations that are measurably slow or called on every render with large arrays |
| Memoize with `useCallback` | Only when passed as prop to a `memo()`-wrapped child |
| `React.memo()` | Only for pure components that re-render frequently with unchanged props |
| Code split | Every route-level page via `lazy()` + `Suspense` — already set up in `App.tsx` |
| Avoid premature optimization | Profile first (`React DevTools Profiler`), then optimize |
| Bundle hygiene | Never import an entire library for one utility (e.g., `import _ from 'lodash'` — use named imports) |

---

## 6. Data Visualization UX

- **Chart type selection**: bar = comparison, line = trend over time, pie = part-of-whole (max 5 slices)
- **Always show**: axis labels, a tooltip, and a legend if colors encode meaning
- **Empty chart state**: render a placeholder with a message, not an empty SVG
- **Loading state**: use `ChartSkeleton` component — never a blank white area
- **Color in charts**: use `#a855f7` (primary) for the highlighted value; `#e2e8f0` for others; never use red/green as the only differentiator (colorblind users)
- **Recharts responsive**: always wrap in `<ResponsiveContainer width="100%" height={N}>` — never fixed pixel widths

---

## 7. Form & Input UX

- **Validation timing**: validate `onBlur`, not `onChange` (avoids error flash while typing)
- **Error placement**: inline, directly below the field — not a top-of-form summary for single fields
- **Disabled states**: show *why* something is disabled via tooltip or helper text
- **Submit feedback**: disable the submit button + show spinner during async operations; re-enable on error
- **Labels are mandatory** — never placeholder-only inputs (placeholder disappears on focus)

---

## 8. Interaction & Feedback

| Situation | Use |
|-----------|-----|
| Initial page/section load | `LoadingSpinner` or skeleton |
| Background data refresh | Subtle inline indicator, not full-page spinner |
| Async action (save, delete) | Disable trigger + spinner inline |
| Destructive actions | Confirmation dialog via `Dialog` component |
| Transient success/error | Inline state change on the triggering element |
| Animations | `0.2s–0.3s` ease; never > `0.5s` for UI feedback |

---

## 9. Dark Theme Specifics (This App)

- **Layered surfaces**: base `#111827` → card `rgba(255,255,255,0.03)` → elevated `rgba(255,255,255,0.06)` → active `rgba(255,255,255,0.08)`
- **Borders**: `rgba(255,255,255,0.08)` default; `rgba(168,85,247,0.4)` on hover/focus (purple accent)
- **Glow effects**: `box-shadow: 0 8px 24px rgba(168,85,247,0.15)` — use sparingly on primary CTAs and logo only
- **Text contrast**: primary `#ffffff`, secondary `#9ca3af`, disabled `#4b5563` — never go below `#6b7280` for readable text
- **Gradient text**: reserve for H1/hero titles only — not body text, not every heading
- **Icons on dark**: use `#9ca3af` default, `#ffffff` on hover/active state
