# API Documentation

This document provides comprehensive API documentation for the NFT Weingarten Penalty Tracker application.

## Table of Contents

- [Services](#services)
- [Authentication](#authentication)
- [Data Hooks](#data-hooks)
- [Components](#components)

---

## Services

### Supabase Client

**Location:** `src/lib/supabase.ts`

```typescript
import { createSupabaseClient } from '@/lib/supabase';

const supabase = createSupabaseClient();
```

**Environment Variables Required:**
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### API Service

**Location:** `src/services/api.ts`

#### Data Import

```typescript
import { importGameEvents } from '@/services/api';

// Import game events from external source
const result = await importGameEvents();
```

---

## Authentication

### Auth Context

**Location:** `src/auth/AuthContext.tsx`

The application uses Supabase Authentication with React Context.

#### AuthProvider

```typescript
import { AuthProvider } from '@/auth/AuthContext';

function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  );
}
```

#### useAuth Hook

```typescript
import { useAuth } from '@/auth/AuthContext';

function Dashboard() {
  const { user, session, loading, signIn, signUp, signOut } = useAuth();
  
  // Access user info
  console.log(user?.email); // user@example.com
  
  // Sign in
  await signIn('user@example.com', 'password');
  
  // Sign up
  await signUp('user@example.com', 'password');
  
  // Sign out
  await signOut();
}
```

#### Auth User Interface

```typescript
interface AuthUser {
  id: string;      // User's unique ID
  email: string;   // User's email
}

interface AuthContextValue {
  supabase: ReturnType<typeof createSupabaseClient>;
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}
```

---

## Data Hooks

### useScoringData

**Location:** `src/hooks/useScoringData.ts`

Hook for fetching and managing scoring data.

```typescript
import { useScoringData } from '@/hooks/useScoringData';

function ScorePage() {
  const { data, loading, error, refetch } = useScoringData();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {data?.map(score => (
        <div key={score.id}>{score.totalScore}</div>
      ))}
    </div>
  );
}
```

### usePenaltyData

**Location:** `src/hooks/usePenaltyData.ts`

Hook for fetching penalty data.

```typescript
import { usePenaltyData } from '@/hooks/usePenaltyData';

function PenaltyList() {
  const { penalties, loading, error } = usePenaltyData({ 
    playerId: 'optional-player-id' 
  });
  
  // ...
}
```

### useSupabaseData

**Location:** `src/hooks/useSupabaseData.ts`

Generic hook for fetching data from Supabase.

```typescript
import { useSupabaseData } from '@/hooks/useSupabaseData';

function CustomData() {
  const { data, loading, error } = useSupabaseData({
    table: 'scores',
    select: '*',
    eq: { column: 'user_id', value: 'user-id' }
  });
  
  // ...
}
```

---

## Components

### ProtectedRoute

**Location:** `src/components/ProtectedRoute.tsx`

Wrapper component that restricts access to authenticated users.

```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}
```

### ErrorBoundary

**Location:** `src/components/ErrorBoundary.tsx`

Catches JavaScript errors in child components.

```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

---

## Scoring System

### Score Calculation

**Location:** `src/lib/scoring.ts`

```typescript
import { ScoringCalculator, ScoreUtils } from '@/lib/scoring';

// Calculate a single score
const result = ScoringCalculator.calculateScore({
  accuracy: 85,      // 0-100
  speed: 20,        // seconds
  consistency: 80,  // 0-100
  difficulty: 5     // 1-10
});

console.log(result);
// {
//   baseScore: 4250,
//   accuracyBonus: 50,
//   speedBonus: 0,
//   totalScore: 4300,
//   grade: 'A'
// }

// Calculate average score
const average = ScoreUtils.calculateAverageScore([result1, result2]);

// Get grade distribution
const distribution = ScoreUtils.getGradeDistribution(results);
// { A: 5, B: 3, C: 1, D: 1, F: 0 }

// Find best score
const best = ScoreUtils.findBestScore(results);
```

### Grading Scale

| Grade | Score Range |
|-------|-------------|
| A     | ≥ 900       |
| B     | 750 - 899   |
| C     | 600 - 749   |
| D     | 400 - 599   |
| F     | < 400       |

### Bonus Calculations

- **Accuracy Bonus:** ≥90% = +100, ≥70% = +50, <70% = +0
- **Speed Bonus:** Completion time below threshold = +50

---

## Validation

**Location:** `src/lib/validation.ts`

```typescript
import { Validators, validateForm, hasErrors, getFirstError } from '@/lib/validation';

// Individual validators
const emailResult = Validators.email('test@example.com');
// { isValid: true, error: null }

const passwordResult = Validators.password('password123');
// { isValid: true, error: null }

// Form validation
const errors = validateForm(
  { email: 'test@example.com', password: 'pass' },
  {
    email: [Validators.email],
    password: [Validators.password, Validators.minLength(8, 'Password')]
  }
);

// Check for errors
if (hasErrors(errors)) {
  const firstError = getFirstError(errors);
  console.log(firstError);
}
```

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `VITE_GOOGLE_SHEETS_ID` | Google Sheets ID for imports | No |
| `VITE_API_URL` | Custom API endpoint | No |

---

## Error Handling

All API calls return errors in a consistent format:

```typescript
// Success response
{ data: {...}, error: null }

// Error response
{ data: null, error: { message: 'Error description', code: 'ERROR_CODE' } }
```

---

## TypeScript Types

**Location:** `src/types/index.ts`

```typescript
// Core types exported from the application
export type { ScoreData, ScoreResult } from '@/lib/scoring';
export type { AuthUser, AuthContextValue } from '@/auth/AuthContext';
export type { ValidationResult, Validator } from '@/lib/validation';
```
