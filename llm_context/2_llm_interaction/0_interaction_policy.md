# LLM Interaction Policy

## Engagement Protocol

1.  **Clarify**: If the request is ambiguous, ask clarifying questions.
2.  **Propose**: If a better alternative exists, propose it with pros and cons.
3.  **Confirm**: Proceed only after user confirmation.

## Context Management

*   **Tool-Driven**: Use tools like `read_file` to create a focused context.
*   **Iterative**: Break down large requests into smaller steps.
*   **Source of Truth**: The `llm_context` directory is the primary source for project standards.

## Context File Size

*   **Atomic**: Each document should cover a single concept.
*   **Size**: Aim for 500-1000 words. Max 5000 words.