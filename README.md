# NFT Weingarten - Penalty Tracker

A modern web application built with React + Vite for tracking penalties in the NFT Weingarten system.

## Project Overview

This project provides a user-friendly interface for managing and tracking penalties within the NFT Weingarten ecosystem. The application is built with modern web technologies and follows best practices for performance and maintainability.

## Migration History

### Next.js → React + Bun (February 2025)

| Aspect | Before (Next.js) | After (React + Bun) |
|--------|------------------|---------------------|
| Framework | Next.js 14 | React 19 + Vite |
| Package Manager | npm | Bun |
| Routing | File-based (App Router) | Client-side (React Router v6) |
| Build Tool | Webpack (Next.js) | Vite |
| Dev Server | `npm run dev` | `bun run dev` |

#### What Changed

- Replaced Next.js with React 19 + Vite for faster builds and instant hot reload
- Implemented client-side routing with React Router v6
- Migrated all pages from server components to client components
- Updated authentication flow for client-side rendering
- Configured Vite for TypeScript and CSS modules
- Simplified build configuration

#### Why Migrate

- **Performance**: Vite provides faster development server and optimized production builds
- **Simplicity**: No server-side rendering complexity, simpler deployment
- **Developer Experience**: Instant hot module replacement (HMR), faster iteration
- **Bundle Size**: Smaller production bundles with Vite's optimized builds

## Project Structure

```
src/
├── main.tsx              # Application entry point
├── App.tsx               # Main app component with routing
├── pages/
│   ├── Home.tsx         # Home page
│   ├── Dashboard.tsx    # Main dashboard
│   ├── KeeperPerformance.tsx
│   ├── PlayerPerformance.tsx
│   └── ScoringMethod.tsx
├── components/
│   ├── ui/              # Reusable UI components
│   ├── charts/         # Chart components
│   └── layout/         # Layout components
├── services/
│   └── api.ts          # API services
├── auth/
│   └── auth.ts         # Authentication logic
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── router/             # Route definitions
├── styles/
│   └── globals.css     # Global styles
└── types/
    └── index.ts        # TypeScript definitions
```

## Technologies

- **Framework**: React + Vite
- **Runtime**: Bun
- **Routing**: React Router v6
- **Styling**: CSS Modules + CSS Variables
- **TypeScript**: Static typing
- **Backend**: Supabase

## Development Commands

| Command | Description |
|---------|-------------|
| `bun install` | Install dependencies |
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run lint` | Run linting |
| `bun run test` | Run tests |
| `bun run import` | Import data from external sources |

## Getting Started

1. Install dependencies: `bun install`
2. Start development server: `bun run dev`
3. Open http://localhost:5173 in your browser

## Project Status

The application is in active development with core functionality implemented. The foundation is stable and ready for additional features and enhancements.

---

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration (Required)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Google Sheets Integration
VITE_GOOGLE_SHEETS_ID=your_spreadsheet_id
```

### Getting Supabase Credentials

1. Go to [Supabase](https://supabase.com) and create a project
2. Navigate to Settings → API
3. Copy the "Project URL" as `VITE_SUPABASE_URL`
4. Copy the "anon public" key as `VITE_SUPABASE_ANON_KEY`

---

## Testing

The project uses Vitest for testing with React Testing Library.

### Running Tests

```bash
# Run all tests
bun test

# Run tests with coverage report
bun test:coverage

# Run tests in watch mode
bun test:watch
```

### Test Structure

```
src/__tests__/
├── scoring.test.ts      # Scoring logic tests
├── utils.test.ts        # Utility and validation tests
└── components.test.tsx  # Component tests
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

## Documentation

- [API Documentation](docs/API.md) - Complete API reference
- [Migration Guide](docs/MIGRATION.md) - Next.js to React migration guide
- [Troubleshooting](docs/TROUBLESHOOTING.md) - Common issues and solutions

---

## CI/CD

The project includes GitHub Actions workflows for continuous integration:

- Automated testing on push/PR
- Code coverage reporting
- Production build verification

See [`.github/workflows/ci.yml`](.github/workflows/ci.yml) for details.
