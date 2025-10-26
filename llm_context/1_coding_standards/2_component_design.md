# Component Design Best Practices (React/Next.js)

To ensure a maintainable and scalable codebase, adhere to the following guidelines when creating React components.

*   **Functional Components and Hooks:** Use functional components with hooks (`useState`, `useEffect`, etc.) as the default.
*   **Component Co-location:** Keep related files together. For example, a component's styles and tests should be in the same directory as the component itself.
*   **Props:**
    *   Use TypeScript interfaces to define the shape of a component's props.
    *   Destructure props for readability.
*   **State Management:**
    *   For simple component-level state, use `useState`.
    *   For more complex state, consider `useReducer` or a state management library like Zustand or Redux.
*   **Server vs. Client Components:**
    *   Use Server Components by default for performance.
    *   Use Client Components (`"use client"`) only when you need interactivity, browser APIs, or state.
