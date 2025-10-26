# Core Logic Overview

The core logic is organized within the Next.js framework, leveraging its features for both client-side and server-side operations.

*   **Server Components:** React Server Components (RSCs) are used for data fetching on the server, reducing client-side bundle sizes and improving performance. They are the default in the `app` directory.
*   **Client Components:** Client Components are used for interactive UI elements that require browser APIs or state. They are marked with the `"use client"` directive.
*   **Server Actions:** Server Actions are asynchronous functions that run on the server and can be called from Server or Client Components. They are used for mutations and data submissions, providing a secure way to interact with the backend.
*   **API Routes:** API Routes (in `pages/api` or Route Handlers in `app`) are used to build API endpoints.
*   **Supabase Client:** A Supabase client is initialized in `lib/supabase.ts` and used throughout the application to interact with the database, authentication, and storage.
