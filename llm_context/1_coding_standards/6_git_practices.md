# Git Practices

## Commits

*   **Granular**: Commit related changes only.
*   **Staging**: Use `git add <file>` instead of `git add .`.

## Messages

*   **Descriptive**: Write clear and concise messages.
*   **Conventional Commits**: Use prefixes like `feat:`, `fix:`, etc.
*   **Focus on "Why"**: Explain the reason for the change.

## Branches

*   **Feature Branches**: Always create feature branches with the format `issues/#{issue number}_{issue name}`.

## Review

*   **`git diff --staged`**: Review changes before committing.
*   **Propose Message**: Propose a commit message for user confirmation.
