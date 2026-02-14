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
