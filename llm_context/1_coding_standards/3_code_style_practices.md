# Good Code Style Practices

This section outlines practices for writing visually appealing and maintainable TypeScript code, enforced by ESLint and Prettier.

### 1. General Code Aesthetics

*   **Formatting:** Use Prettier for consistent code formatting. It will handle indentation, line length, and spacing automatically.
*   **Naming Conventions:**
    *   Use `camelCase` for variables and functions.
    *   Use `PascalCase` for components, classes, and type interfaces.
*   **Comments:**
    *   Use JSDoc for functions and components to explain their purpose, parameters, and return values.
    *   Use inline comments (`//`) to explain complex or non-obvious logic.

### 2. Import Organization

*   **Grouping and Sorting:** Use a Prettier plugin or ESLint rule to automatically group and sort imports. The typical order is:
    1.  React imports.
    2.  Third-party library imports.
    3.  Internal component and module imports.
    4.  Style imports.
*   **Absolute Paths:** Use absolute paths for imports (e.g., `import MyComponent from '@/components/MyComponent'`) configured via `tsconfig.json`.

### 3. ESLint Rules

The project should have a comprehensive ESLint configuration to enforce code quality and style. Some recommended rules include:
*   `no-unused-vars`: Warns about unused variables.
*   `no-console`: Warns about `console.log` statements in production builds.
*   `react/prop-types`: Enforces prop type definitions (though TypeScript interfaces are preferred).
