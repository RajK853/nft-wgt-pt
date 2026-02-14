# Page Design & Recreation Guide

This document provides comprehensive instructions for recreating the existing pages (Home, ScoringMethod, Dashboard) in the NFT Weingarten Penalty Tracker application. Use these rules when rebuilding or creating new pages with similar styling.

> **Last Updated**: 2026 | **Version**: 2.0

---

## 1. Modern CSS Principles (2026 Best Practices)

### 1.1 Embrace Native CSS Capabilities

Modern CSS (2024-2026) offers powerful features that reduce the need for frameworks:

- **Fluid Layouts**: Use `auto-fit` and `minmax()` for responsive grids without media queries
- **CSS Custom Properties**: Define design tokens at `:root` for consistent theming
- **Cascade Layers**: Organize styles with `@layer` to manage specificity
- **Container Queries**: Style components based on their container size, not viewport

### 1.2 Design Token Approach

Establish CSS variables as your "source of truth":

```css
/* Define at :root for global access */
:root {
  /* Colors */
  --color-bg-primary: #111827;
  --color-bg-secondary: #1f2937;
  --color-surface: rgba(255, 255, 255, 0.03);
  --color-border: rgba(255, 255, 255, 0.08);
  --color-primary: #a855f7;
  --color-secondary: #ec4899;
  --color-text-primary: #ffffff;
  --color-text-secondary: #9ca3af;
  --color-success: #22c55e;
  --color-error: #ef4444;
  
  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  
  /* Typography */
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
  --font-size-2xl: 2rem;
  
  /* Borders */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 50%;
  
  /* Transitions */
  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s ease;
}
```

### 1.3 Cascade Layers for Style Organization

Use `@layer` to organize CSS and control specificity:

```css
/* Order matters - first = least specific */
@layer reset, theme, components, layout, utilities;

@layer reset {
  *, *::before, *::after {
    box-sizing: border-box;
  }
}

@layer components {
  .card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
  }
}
```

### 1.4 Fluid Layouts with auto-fit (2026 Best Practice)

Instead of media queries, use fluid grids that automatically adapt:

```css
/* Fluid grid - no media queries needed */
.fluidGrid {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(300px, 100%), 1fr)
  );
  gap: 1.5rem;
}
```

This creates responsive columns that:
- Automatically fit as many as possible
- Each column is at least 300px wide
- Columns stretch equally to fill space
- Wraps to new row when space is insufficient

### 1.5 Container Queries (Modern Alternative to Media Queries)

Style components based on their container size:

```css
/* In the component's CSS module */
.cardContainer {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card {
    flex-direction: row;
  }
}
```

### 1.6 Modern Color Techniques

```css
/* Using color-mix for variants (2024+) */
.button {
  background: var(--color-primary);
}

.button:hover {
  /* Lighten on hover without extra color */
  background: color-mix(in srgb, var(--color-primary), white 20%);
}

/* OKLCH for perceptually uniform colors (2026) */
:root {
  --color-primary: oklch(70% 0.15 280);
}
```

### 1.7 Modern Transitions

```css
/* Smooth spring-like transitions */
.card {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
              background-color 0.2s ease;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 1.8 Focus Management for Accessibility

```css
/* Visible focus indicators */
.button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Skip to main content */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-primary);
  color: white;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

---

## 2. Design System Overview

### 2.1 Color Palette

The application uses a dark theme with the following key colors:

| Purpose | Colors | Usage |
|---------|--------|-------|
| Background | `#111827`, `#1f2937` | Page containers, gradients |
| Surface | `rgba(255, 255, 255, 0.03)` to `0.08` | Cards, panels |
| Border | `rgba(255, 255, 255, 0.08)` to `0.1` | Card borders, dividers |
| Primary | `#a855f7`, `#ec4899` | Purple to pink gradient |
| Secondary | `#3b82f6`, `#22c55e` | Blue to green gradient |
| Text Primary | `#ffffff`, `#e2e8f0` | Headings, important text |
| Text Secondary | `#9ca3af`, `#94a3b8` | Descriptions, labels |
| Accent/Success | `#22c55e` | Success states, online indicators |
| Warning | N/A | Not prominently used |
| Error | `#ef4444`, `#f87171` | Error states |

### 2.2 Typography

- **Font Family**: System fonts (no custom fonts loaded)
- **Headings**: 
  - H1: 2rem-2.5rem, font-weight 700-800
  - H2: 1.5rem, font-weight 700
  - H3: 1rem-1.25rem, font-weight 600
- **Body**: 0.875rem-1rem, font-weight 400-500
- **Small/Labels**: 0.75rem-0.875rem

### 2.3 Spacing System

- Base unit: 0.25rem (4px)
- Common spacings: 0.5rem, 0.75rem, 1rem, 1.5rem, 2rem, 3rem
- Card padding: 1rem-1.5rem
- Section gaps: 2rem-2.5rem

### 2.4 Border Radius

- Small elements: 0.375rem (6px)
- Cards/buttons: 0.5rem-1rem
- Circular elements: 50%

---

## 3. File Structure

### 3.1 Required Files for Each Page

Each page requires two files:

```
src/pages/
├── PageName.tsx        # React component
└── PageName.module.css # Scoped CSS styles
```

### 3.2 CSS Module Pattern

Always use CSS Modules (`*.module.css`) for page-level styles:

```tsx
import styles from './PageName.module.css'

// Usage
<div className={styles.container}>
  <h1 className={styles.title}>Title</h1>
</div>
```

---

## 4. Component Usage Guidelines

### 4.1 Available UI Components

Import from `@/components/ui`:

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `MetricCard` | Display single metric with label, value, delta | `label`, `value`, `delta`, `variant` |
| `DataTable` | Tabular data display | `data`, `columns`, `sortKey`, `sortDirection` |
| `Tabs` | Tabbed content | `tabs`, `defaultTab`, children as render function |
| `NumberInput` | Numeric input with +/- buttons | `label`, `value`, `onChange`, `min`, `max`, `step` |
| `Select` | Dropdown selection | `label`, `value`, `options`, `onChange` |
| `MultiSelect` | Multiple selection | `label`, `value`, `options`, `onChange` |
| `Expander` | Collapsible content | `title`, `defaultOpen`, children |
| `LoadingSpinner` | Loading state | None |
| `RevealButton` | Countdown reveal button | `label`, `onReveal`, `variant` |
| `InfoBox` | Informational box | `children` |
| `Badge` | Status/badge display | `children`, `variant` |
| `Card` | Generic card wrapper | `children`, `className` |

### 4.2 Available Chart Components

Import from `@/components/charts`:

| Component | Purpose |
|-----------|---------|
| `BarChart` | Bar chart for comparing values |
| `LineChart` | Line chart for trends |
| `PieChart` | Pie chart for distribution |

---

## 5. Page-Specific Patterns

### 4.1 Home Page Pattern

**Purpose**: Landing page with logo, title, and navigation cards

**Layout Structure**:
```
┌─────────────────────────────────────────────┐
│  HEADER (flex row)                          │
│  [Logo] [Title/Subtitle] [Status Indicator]│
├─────────────────────────────────────────────┤
│  CONTENT (max-width: 900px, centered)      │
│  ┌──────────────┐ ┌──────────────┐         │
│  │ NavCard      │ │ NavCard      │         │
│  │ (Dashboard)  │ │ (Scoring)    │         │
│  └──────────────┘ └──────────────┘         │
│  ┌──────────────┐                          │
│  │ NavCard (Login)                         │
│  └──────────────┘                          │
└─────────────────────────────────────────────┘
```

**Key Elements**:
- Logo with glow effect (purple/pink blur)
- Gradient text title
- Status indicator with green dot
- Navigation cards in 2-column grid
- Special "login" variant for login card

**CSS Patterns**:
- Container: `min-height: calc(100vh - 60px)`, gradient background
- Header: Flexbox with gap, max-width 800px centered
- Cards: Semi-transparent background, hover effects with transform and shadow
- Responsive: Single column on mobile (<640px)

### 4.2 ScoringMethod Page Pattern

**Purpose**: Educational page explaining scoring system with interactive elements

**Layout Structure**:
```
┌─────────────────────────────────────────────┐
│  HEADER (centered)                          │
│  Title + Subtitle                           │
├─────────────────────────────────────────────┤
│  CONTENT (grid: 2 columns)                  │
│  ┌─────────────────────────────────────┐   │
│  │ Section: Base Points                 │   │
│  │ ┌───────────┐ ┌───────────┐        │   │
│  │ │DataTable  │ │DataTable  │        │   │
│  │ │(Shooter)  │ │(Keeper)   │        │   │
│  │ └───────────┘ └───────────┘        │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │ Section: Time-Weighted              │   │
│  │ Description + Expander              │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │ Section: Interactive Simulation     │   │
│  │ [NumberInput] [NumberInput]         │   │
│  │ InfoBox + LineChart                 │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

**Key Elements**:
- Centered header with gradient title
- Two-column grid for scoring cards
- Expander component for mathematical formula
- Interactive simulation with NumberInput controls
- LineChart for decay curve visualization

**CSS Patterns**:
- Container: max-width 1200px, centered
- Content: CSS Grid with 2 columns, gap 2rem
- Scoring cards: Semi-transparent background, 0.75rem radius
- Simulation controls: Flex row with gap
- Chart container: Semi-transparent background

### 4.3 Dashboard Page Pattern

**Purpose**: Main data display page with top performers, records, and recent activity

**Layout Structure**:
```
┌─────────────────────────────────────────────┐
│  TITLE "Dashboard"                         │
├─────────────────────────────────────────────┤
│  SECTION: Top Performers                    │
│  ┌──────────────┐ ┌──────────────┐        │
│  │ Top-10 Chart │ │ Top Player   │        │
│  │ (RevealBtn)  │ │ (RevealBtn)  │        │
│  └──────────────┘ └──────────────┘        │
│  ┌──────────────┐                          │
│  │ Top Keeper   │                          │
│  │ (RevealBtn)  │                          │
│  └──────────────┘                          │
├─────────────────────────────────────────────┤
│  SECTION: Hall of Fame (Tabs)              │
│  [Single] [All-Time] [Fun Facts]           │
│  ┌──────────────┐ ┌──────────────┐        │
│  │ MetricCard   │ │ MetricCard   │        │
│  └──────────────┘ └──────────────┘        │
├─────────────────────────────────────────────┤
│  SECTION: Recent Activity                    │
│  Date header + 3 MetricCards (Goals/Saves/Out)│
│  [Players] [Keepers] tabs                   │
│  BarChart + DataTable OR                    │
│  Keeper PieCharts + DataTable               │
└─────────────────────────────────────────────┘
```

**Key Elements**:
- Section-based layout with clear headings
- RevealButton components for suspense/reveal effect
- Tabs for switching between related content
- MetricCard for key statistics
- BarChart, PieChart for data visualization
- DataTable for detailed stats

**CSS Patterns**:
- Container: min-height with gradient background
- Sections: margin-bottom 2.5rem
- Top Performers Grid: 3 columns (responsive to 1)
- Cards: Semi-transparent, 1rem radius, padding 1.5rem
- Reveal animations: fadeIn with translateY
- Responsive: Stack to single column on tablet/mobile

---

## 5. Common CSS Patterns

### 5.1 Page Container

```css
.container {
  min-height: calc(100vh - 60px); /* Subtract header height */
  background: linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%);
  padding: 2rem;
}
```

### 5.2 Card/Panel

```css
.card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 1.5rem;
}
```

### 5.3 Title Styles

```css
.title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 1rem 0;
}

/* Gradient variant */
.gradientTitle {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### 5.4 Hover Effects

```css
.card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(168, 85, 247, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(168, 85, 247, 0.15);
}
```

### 5.5 Grid Layouts

```css
/* Two columns */
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

/* Three columns */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

### 5.6 Flex Layouts

```css
.row {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
```

---

## 6. Interaction Patterns

### 6.1 Reveal/Suspense Pattern

For elements that should be revealed with user interaction:

```tsx
import { useState } from 'react'
import { RevealButton } from '@/components/ui'

function PageSection() {
  const [revealed, setRevealed] = useState(false)

  return (
    <div>
      <RevealButton 
        label="Reveal Data" 
        onReveal={() => setRevealed(true)}
        variant="primary"
      />
      {revealed && (
        <div className={styles.revealedContent}>
          {/* Content */}
        </div>
      )}
    </div>
  )
}
```

### 6.2 Tabs Pattern

For switching between related content:

```tsx
import { Tabs } from '@/components/ui'

function Section() {
  return (
    <Tabs
      tabs={[
        { id: 'tab1', label: 'Tab One' },
        { id: 'tab2', label: 'Tab Two' }
      ]}
      defaultTab="tab1"
    >
      {(activeTab) => (
        <div>
          {activeTab === 'tab1' && <Content1 />}
          {activeTab === 'tab2' && <Content2 />}
        </div>
      )}
    </Tabs>
  )
}
```

### 6.3 Loading/Error States

```tsx
import { LoadingSpinner } from '@/components/ui'

function Page() {
  const { data, loading, error } = useData()

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <div className={styles.errorIcon}>!</div>
        <h2 className={styles.errorTitle}>Error</h2>
        <p className={styles.errorMessage}>{error.message}</p>
      </div>
    )
  }

  return <div>{/* Content */}</div>
}
```

---

## 7. Responsive Breakpoints

| Breakpoint | Width | Adjustments |
|------------|-------|-------------|
| Mobile | < 480px | Single column, reduced padding |
| Tablet | < 640px | Single column, adjusted spacing |
| Desktop | < 768px | Two columns possible |
| Large | < 1024px | Full layout, 3-column grids |

---

## 8. Animation Patterns

### 8.1 Fade In

```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.revealedContent {
  animation: fadeIn 0.3s ease;
}
```

### 8.2 Hover Transitions

```css
.card {
  transition: all 0.3s ease;
}
```

### 8.3 Pulse Animation

```css
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.animating {
  animation: pulse 1s ease-in-out infinite;
}
```

---

## 9. Quick Reference Checklist

When recreating a page, ensure:

- [ ] Page has `.tsx` and `.module.css` files
- [ ] Container uses gradient background and min-height
- [ ] Title uses appropriate font-size and weight
- [ ] Cards use semi-transparent background with border
- [ ] Hover effects include transform and shadow
- [ ] Grid layouts are responsive
- [ ] Loading/error states are handled
- [ ] Use existing UI components from `@/components/ui`
- [ ] Use chart components from `@/components/charts`
- [ ] Use RevealButton for suspense/reveal elements
- [ ] Use Tabs for switching between related content

---

## 10. Example: Minimal Page Template

```tsx
// src/pages/Example.tsx
import styles from './Example.module.css'

export default function Example() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Page Title</h1>
      
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Section Title</h2>
        
        <div className={styles.grid}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Card Title</h3>
            {/* Content */}
          </div>
        </div>
      </section>
    </div>
  )
}
```

```css
/* src/pages/Example.module.css */
.container {
  min-height: calc(100vh - 60px);
  background: linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%);
  padding: 2rem;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 1rem 0;
}

.section {
  margin-bottom: 2.5rem;
}

.sectionTitle {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 1.5rem 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 1.5rem;
}

.cardTitle {
  font-size: 1.125rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 1rem 0;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .grid {
    grid-template-columns: 1fr;
  }
}
```

---

## Related Files Reference

For reference, see these existing implementations:

- Home Page: `src/pages/Home.tsx`, `src/pages/Home.module.css`
- Scoring Method: `src/pages/ScoringMethod.tsx`, `src/pages/ScoringMethod.module.css`
- Dashboard: `src/pages/Dashboard.tsx`, `src/pages/Dashboard.module.css`
- UI Components: `src/components/ui/*.tsx`, `src/components/ui/*.module.css`
- Charts: `src/components/charts/*.tsx`
