# NFT Weingarten - Penalty Tracker

A modern web application built with React + Vite for tracking penalties in the NFT Weingarten system.

## Project Overview

This project provides a user-friendly interface for managing and tracking penalties within the NFT Weingarten ecosystem. The application is built with modern web technologies and follows best practices for performance and maintainability.

## Project Structure

```
src/
├── main.tsx              # Application entry point
├── App.tsx               # Main app component with routing
├── pages/
│   └── Home.tsx          # Home page displaying NFT logo
├── components/
│   └── ui/
│       └── Button.tsx    # Reusable UI components
├── services/
│   └── api.ts            # API services
├── auth/
│   └── auth.ts           # Authentication logic
├── lib/
│   └── supabase.ts       # Supabase client configuration
├── router/
├── main/
├── styles/
│   └── globals.css       # Global styles with custom CSS
└── types/
    └── css.d.ts          # TypeScript type definitions
```

## Technologies

- **Framework**: React + Vite
- **Routing**: React Router v6
- **Styling**: Custom CSS with CSS variables
- **TypeScript**: Static typing
- **Backend**: Supabase (integrated)

## Development Commands

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run lint` - Run linting
- `bun run test` - Run tests
- `bun run import` - Import data script

## Getting Started

1. Install dependencies: `bun install`
2. Start development server: `bun run dev`
3. Open http://localhost:5173 in your browser

## Project Status

The application is in active development with core functionality implemented. The foundation is stable and ready for additional features and enhancements.