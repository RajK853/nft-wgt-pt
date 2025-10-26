# Coding Philosophy

This document outlines the key philosophical and general design principles guiding the project's development.

---

## 1. TypeScript-Specific Philosophy

These principles are central to writing effective and maintainable TypeScript code.

*   **Type Safety:** Strive for strong type safety. Use specific types over `any`. Leverage TypeScript's features like generics, interfaces, and type guards to create robust and self-documenting code.
*   **Readability:** Write code that is easy to understand. Use clear and consistent naming conventions.
*   **Embrace Modern JavaScript:** Use modern JavaScript features (ES6+) like `const`/`let`, arrow functions, destructuring, and async/await.

---

## 2. General Software Design Principles

These are universal principles that lead to better software architecture.

*   **KISS (Keep It Simple, Stupid):** Prioritize simplicity. Avoid unnecessary complexity.
*   **DRY (Don't Repeat Yourself):** Avoid code duplication. Encapsulate and reuse logic in functions, components, or hooks.
*   **Single Responsibility Principle (SRP):** Each module, component, or function should have a single, well-defined purpose.
*   **YAGNI (You Ain't Gonna Need It):** Do not add functionality until it is actually needed.
*   **Composition Over Inheritance:** Favor composing components and functions from smaller, single-responsibility pieces.
