# Merge Request (MR) Review Guidelines

These guidelines provide a structured approach to reviewing Merge Requests (MRs) for this project, ensuring code quality, adherence to standards, and effective problem-solving.

## 1. Standard Practices (General Review)

*   **Code Style & Formatting**: Verify adherence to ESLint and Prettier rules. Ensure consistent indentation, spacing, and line length.
*   **Naming Conventions**: Check for consistent use of `camelCase` for variables/functions and `PascalCase` for components/interfaces.
*   **Modularity & Single Responsibility**: Confirm that components, modules, and functions have a single, well-defined purpose.
*   **DRY Principle**: Identify and address any unnecessary code duplication.
*   **TypeScript Usage**: Ensure strong type safety, preferring specific types over `any`. Leverage generics, interfaces, and type guards.
*   **Modern JavaScript**: Confirm the use of modern JavaScript features (ES6+).
*   **Import Organization**: Check for proper grouping, sorting, and use of absolute paths for imports.
*   **Documentation**: Verify that functions, classes, and complex logic have appropriate JSDoc comments or inline explanations.
*   **Next.js Best Practices**: Ensure correct usage of Next.js features, especially the `<Link>` component for navigation and appropriate use of Server vs. Client Components.
*   **Git Practices**: Review commit messages for clarity, conciseness, and adherence to Conventional Commits (e.g., `feat:`, `fix:`, `refactor:`).

## 2. Bug/Issue Fixes

*   **Problem Understanding**: Does the MR correctly identify and address the root cause of the reported bug?
*   **Solution Effectiveness**: Does the fix resolve the bug without introducing new issues or regressions?
*   **Test Coverage**: Are new or updated unit/integration tests included to prevent future regressions?
*   **Edge Cases**: Are potential edge cases related to the bug considered and handled gracefully?

## 3. New Features

*   **Requirements Met**: Does the new feature fully meet all the defined requirements and acceptance criteria from the associated issue?
*   **User Experience (UX)**: Is the new feature intuitive, user-friendly, and consistent with the overall application design?
*   **Performance Impact**: Evaluate any potential impact on application performance (e.g., bundle size, load times, rendering speed).
*   **Scalability**: Is the feature designed in a way that allows for future enhancements and scalability?
*   **Security**: Are there any new security vulnerabilities introduced? (e.g., proper input validation, authentication checks).

## 4. Major Optimizations / Refactors

*   **Justification**: Is the optimization or refactor well-justified with clear benefits (e.g., performance, readability, maintainability)?
*   **Performance Metrics**: For optimizations, are there measurable performance improvements (if applicable)?
*   **Code Clarity & Simplicity**: Does the refactored code improve clarity, reduce complexity, and adhere to the KISS principle?
*   **No Regression**: Verify that existing functionalities are unaffected and no new bugs are introduced.

## 5. Security Considerations

*   **Input Validation**: Ensure all user inputs are validated and sanitized to prevent common vulnerabilities (e.g., XSS, SQL injection).
*   **Environment Variables**: Confirm that sensitive information (API keys, credentials) is not hardcoded and is properly managed using environment variables.
*   **Supabase RLS**: If changes involve data access, verify that Supabase Row-Level Security (RLS) policies are correctly applied and reviewed.

## 6. Documentation

*   **API/Component Documentation**: Are new or modified APIs/components adequately documented with JSDoc?
*   **README/Project Docs**: If the changes are significant, is the `README.md` or other project documentation updated accordingly?

## General Reviewer Checklist

- [ ] Code compiles and runs without errors.
- [ ] All automated tests pass.
- [ ] Changes are well-documented.
- [ ] Code is easy to understand and follow.
- [ ] No unnecessary code or comments.
- [ ] Performance implications considered.
- [ ] Security implications considered.
- [ ] Follows project's coding standards.
- [ ] Addresses the issue/feature effectively.
- [ ] Generate found issues and potential solutions as separate comments for the MR.
