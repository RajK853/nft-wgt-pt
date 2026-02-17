# Routing (React Router v6)

This project uses **React Router v6** (`react-router-dom`) for all client-side navigation. There is no Next.js — do not use `next/link`, `next/navigation`, or `useRouter()`.

---

## Core Imports

```tsx
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  Navigate,
  useNavigate,
  useLocation,
  useParams,
} from 'react-router-dom'
```

---

## Navigation Links

Use `<Link>` for standard navigation and `<NavLink>` when active-state styling is needed:

```tsx
// Standard link
import { Link } from 'react-router-dom'

<Link to="/dashboard">Go to Dashboard</Link>

// Active-state link (e.g., nav items)
import { NavLink } from 'react-router-dom'

<NavLink
  to="/dashboard"
  className={({ isActive }) => isActive ? styles.active : styles.link}
>
  Dashboard
</NavLink>
```

---

## Programmatic Navigation

```tsx
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()

// Navigate forward
navigate('/dashboard')

// Replace history (e.g. after login)
navigate('/dashboard', { replace: true })

// Navigate back
navigate(-1)
```

---

## Reading Route Info

```tsx
import { useLocation, useParams } from 'react-router-dom'

// Current path and state
const location = useLocation()
console.log(location.pathname)   // '/dashboard'
console.log(location.state)      // passed state

// URL params for dynamic routes (/player/:name)
const { name } = useParams<{ name: string }>()
```

---

## Route Configuration (`src/App.tsx`)

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { LoadingSpinner } from '@/components/ui'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const PlayerPerformance = lazy(() => import('./pages/PlayerPerformance'))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/scoring" element={<ScoringMethod />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/players" element={
            <ProtectedRoute><PlayerPerformance /></ProtectedRoute>
          } />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
```

---

## Redirects

```tsx
import { Navigate } from 'react-router-dom'

// Redirect unauthenticated users
if (!user) return <Navigate to="/login" state={{ from: location }} replace />
```

---

## SPA Deployment

`vercel.json` rewrites all requests to `index.html` so React Router handles routing client-side:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
