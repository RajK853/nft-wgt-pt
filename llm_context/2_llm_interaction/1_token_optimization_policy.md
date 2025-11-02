# Token Optimization Policy

## File I/O

*   **Search First**: Use `search_file_content` instead of `read_file` for locating specific content.
*   **Paginate**: Use `limit` and `offset` with `read_file` for large files.
*   **`replace`**: Use for small modifications.
*   **`read_many_files`**: Use for batch reading.

## Tool Output

*   **Quiet Flags**: Use `-q`, `--quiet`.
*   **Filter**: Use pipes (`|`) to filter output at the source.
*   **Redirect**: Redirect to temp files if needed.

## Filesystem

*   **Ignore Rules**: Respect `.gitignore` and `.geminiignore`.
*   **`glob`**: Use specific patterns.

## Conversation

*   **Internal Monologue**: Use `sequentialthinking`.
*   **Concise**: Be brief and direct.

## Communication

*   **Concise Updates**: Provide brief, informative updates on findings and actions.
*   **Tool-First**: Execute tools promptly, but provide context when necessary.
*   **No Filler**: Avoid conversational pleasantries, but ensure clarity.
*   **Data-driven**: Use structured formats (lists, code blocks) where appropriate.
