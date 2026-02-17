# Code Style Practices

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| React components | `PascalCase` | `MetricCard`, `Dashboard` |
| Hooks | `use` + camelCase | `usePenaltyData`, `useTheme` |
| Utility functions | `camelCase` | `calculateWeightedScore`, `cn` |
| TypeScript types/interfaces | `PascalCase` | `PenaltyRecord`, `PlayerScore` |
| CSS Module classes | `camelCase` | `.container`, `.sectionTitle` |
| Constants | `UPPER_SNAKE_CASE` | `Scoring.GOAL`, `PERFORMANCE_HALF_LIFE_DAYS` |
| Files: components | `PascalCase.tsx` | `MetricCard.tsx` |
| Files: hooks/utils | `camelCase.ts` | `usePenaltyData.ts`, `scoring.ts` |
| Files: CSS Modules | Match component name | `Dashboard.module.css` |

---

## Import Order

Group and sort imports in this order, separated by a blank line:

```tsx
// 1. React and framework
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

// 2. External libraries
import { BarChart, Bar, ResponsiveContainer } from 'recharts'

// 3. Internal components and hooks (@ alias)
import { Button, LoadingSpinner } from '@/components/ui'
import { useAuth } from '@/auth/AuthContext'
import { usePenaltyData } from '@/hooks/usePenaltyData'

// 4. Types
import type { PenaltyRecord, PlayerScore } from '@/types'

// 5. Styles
import styles from './Dashboard.module.css'
```

Always use the `@/` path alias — never relative paths like `../../components/ui`.

---

## Formatting

This project uses **ESLint v9** (flat config in `eslint.config.mjs`) for style enforcement. **Prettier is not configured** — ESLint handles style.

Key ESLint rules:
- `no-unused-vars` — warn on unused variables
- `react/prop-types` — disabled (TypeScript handles this)
- Standard React hooks rules enforced

Run linting: `bun run lint`

---

## Component Structure

Organise component files in this order:

```tsx
// 1. Imports
import { useState } from 'react'
import styles from './Example.module.css'

// 2. Types/interfaces
interface ExampleProps {
  title: string
  onAction: () => void
}

// 3. Component (default export for pages, named export for components)
export function Example({ title, onAction }: ExampleProps) {
  // 3a. Hooks
  const [open, setOpen] = useState(false)

  // 3b. Derived values
  const displayTitle = title.trim()

  // 3c. Event handlers
  const handleClick = () => {
    setOpen(true)
    onAction()
  }

  // 3d. Early returns (loading/error/empty guards)
  if (!title) return null

  // 3e. Render
  return (
    <div className={styles.container}>
      <h2>{displayTitle}</h2>
      <button onClick={handleClick}>Action</button>
    </div>
  )
}
```

---

## CSS Module Conventions

- One `.module.css` per page/complex component
- Global styles and Tailwind base in `src/styles/globals.css`
- Use Tailwind utility classes for simple one-off styling; use CSS Modules for page/component-level structure
- CSS custom properties for theming defined at `:root` in `globals.css`

```css
/* Use descriptive class names that reflect purpose */
.container { ... }      /* ✅ */
.div1 { ... }           /* ❌ */

/* Prefer component-scoped over global */
.sectionTitle { ... }   /* ✅ CSS Module class */
.text-lg { ... }        /* ❌ Don't redefine Tailwind */
```

---

## Comments

```ts
// ✅ Explains WHY (non-obvious reasoning)
// Half-life of 45 days means events older than ~5 months have <5% weight
const weight = Math.pow(2, -daysAgo / PERFORMANCE_HALF_LIFE_DAYS)

// ❌ Explains WHAT (just restates the code)
// Calculate weight using power of 2
const weight = Math.pow(2, -daysAgo / PERFORMANCE_HALF_LIFE_DAYS)
```
