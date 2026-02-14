# Migration Guide: Next.js to React + Bun + Vite

This guide provides instructions for migrating from the original Next.js implementation to the new React + Bun + Vite architecture.

## Table of Contents

1. [Overview](#overview)
2. [Key Changes](#key-changes)
3. [Migration Steps](#migration-steps)
4. [Code Patterns](#code-patterns)
5. [Common Issues](#common-issues)

---

## Overview

The application was migrated from Next.js 14 to React 19 + Vite with Bun as the package manager and runtime. This migration provides:

- **Faster builds**: Vite's instant hot module replacement (HMR)
- **Simpler architecture**: No server-side rendering complexity
- **Smaller bundles**: Optimized production builds with code splitting
- **Faster dependencies**: Bun's speed for package management

---

## Key Changes

### Framework Changes

| Aspect | Next.js (Old) | React + Vite (New) |
|--------|--------------|-------------------|
| Framework | Next.js 14 | React 19 + Vite |
| Package Manager | npm | Bun |
| Routing | File-based (App Router) | Client-side (React Router v6) |
| Rendering | Server + Client Components | Client-side only |
| Build Tool | Webpack | Vite |
| Dev Server | `npm run dev` | `bun run dev` |

### File Structure Changes

```
# Old (Next.js)
app/
├── page.tsx
├── layout.tsx
├── dashboard/
│   └── page.tsx
└── api/
    └── scores/
        └── route.ts

# New (React + Vite)
src/
├── pages/
│   ├── Home.tsx
│   ├── Dashboard.tsx
│   └── ...
├── components/
├── hooks/
└── App.tsx  # Routes defined here
```

---

## Migration Steps

### 1. Install Dependencies

```bash
# Install Bun if not already installed
curl -fsSL https://bun.sh/install | bash

# Install dependencies
bun install
```

### 2. Environment Variables

Create a `.env` file with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Start Development Server

```bash
bun run dev
```

The app will be available at `http://localhost:3000`

---

## Code Patterns

### Page Components

**Old (Next.js):**
```tsx
// app/dashboard/page.tsx
export default function Dashboard() {
  return <div>Dashboard</div>;
}
```

**New (React + Vite):**
```tsx
// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Fetch data on mount
  }, []);
  
  return <div>Dashboard</div>;
}
```

### Routing

**Old (Next.js):**
```tsx
// Navigate to a new page
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/dashboard');
```

**New (React Router):**
```tsx
// Navigate to a new page
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/dashboard');
```

### Authentication

**Old (Next.js):**
```tsx
// Server-side session check
import { getServerSession } from 'next-auth';
const session = await getServerSession(authOptions);
```

**New (React):**
```tsx
// Client-side auth with Supabase
import { useAuth } from '@/auth/AuthContext';

function ProtectedComponent() {
  const { user, loading } = useAuth();
  
  if (loading) return <Loading />;
  if (!user) return <Redirect to="/login" />;
  
  return <Dashboard />;
}
```

### Data Fetching

**Old (Next.js):**
```tsx
// Server Component with async fetch
async function getData() {
  const res = await fetch('https://api.example.com/data');
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{data.name}</div>;
}
```

**New (React):**
```tsx
// Client Component with useEffect
import { useEffect, useState } from 'react';

export default function Page() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('https://api.example.com/data')
      .then(res => res.json())
      .then(setData);
  }, []);
  
  return <div>{data?.name}</div>;
}
```

### Styling

**Old (Next.js):**
```tsx
// Using Tailwind CSS
<div className="p-4 bg-white">Content</div>
```

**New (React + Vite):**
```tsx
// Using Tailwind CSS (same syntax)
<div className="p-4 bg-white">Content</div>

// Or CSS Modules
import styles from './Component.module.css';
<div className={styles.container}>Content</div>
```

---

## Common Issues

### 1. Hydration Errors

**Problem:** "Text content does not match server-rendered HTML"

**Solution:** Wrap client-only content with `useEffect` or use conditional rendering:

```tsx
useEffect(() => {
  // Client-only code here
}, []);
```

### 2. Route Not Found

**Problem:** 404 on navigation

**Solution:** Check your route definitions in `App.tsx`:

```tsx
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
```

### 3. Supabase Connection Issues

**Problem:** "Failed to fetch" or authentication errors

**Solution:** Verify environment variables:

```bash
# Check .env file
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Build Errors

**Problem:** TypeScript or build failures

**Solution:** 
1. Clear cache: `rm -rf node_modules/.vite`
2. Rebuild: `bun run build`

### 5. Import Aliases Not Working

**Problem:** Cannot resolve `@/` imports

**Solution:** Check `vite.config.ts`:

```typescript
resolve: {
  alias: {
    '@': '/src'
  }
}
```

---

## Testing

### Running Tests

```bash
# Run all tests
bun test

# Run with coverage
bun test:coverage

# Watch mode
bun test:watch
```

### Writing Tests

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

---

## Deployment

### Build for Production

```bash
bun run build
```

Output will be in the `dist` folder.

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

---

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Bun Documentation](https://bun.sh)
- [React Router v6](https://reactrouter.com)
- [Supabase Documentation](https://supabase.com/docs)
