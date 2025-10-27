# Component Design (React/Next.js)

*   **Components**: Use functional components with hooks.
*   **Co-location**: Keep related files (styles, tests) together.
*   **Props**:
    *   Define props with TypeScript interfaces.
    *   Destructure props.
*   **State**:
    *   `useState` for simple state.
    *   `useReducer` or Zustand for complex state.
*   **Server vs. Client**:
    *   Default to Server Components.
    *   Use Client Components (`"use client"`) for interactivity.