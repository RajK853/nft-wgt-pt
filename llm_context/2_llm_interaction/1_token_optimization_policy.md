# Token Optimization Policy

Guidelines for LLMs to minimise token usage while maintaining accuracy and quality.

---

## File I/O

- **Search before read** — use regex/text search to locate specific content before reading an entire file
- **Read targeted files** — only read files relevant to the current task; avoid reading unrelated files for "context"
- **Use targeted edits** — for small changes, use search/replace on a specific block rather than rewriting the whole file
- **Batch reads** — when multiple files are needed, read them in parallel if the tool supports it

---

## Tool Output

- **Filter output** — use flags to suppress noise (e.g., `--no-pager`, `--quiet`) and pipe output to reduce verbosity
- **Redirect large output** — redirect command output to a temp file and read only the relevant portion
- **Avoid `select *`** — in Supabase queries, specify only needed columns

---

## Filesystem

- **Respect `.gitignore`** — do not process files listed there
- **Use specific glob patterns** — `src/**/*.ts` is better than searching the entire repo
- **Check structure first** — use `list_files` to understand directory layout before diving into files

---

## Conversation

- **Be concise** — provide brief, informative updates on actions taken and findings; avoid filler phrases
- **Tool-first** — execute tools promptly; provide prose context only when it adds value not already visible from tool output
- **Use structured output** — prefer tables, lists, and code blocks over verbose prose
- **No pleasantries** — skip opening/closing pleasantries; focus on substance

---

## Context Management

- `llm_context/` is the **source of truth** for project standards — read the relevant file before making project-specific decisions
- For large tasks, decompose into atomic subtasks and maintain focus; don't load unnecessary context
- The `0_project/` files describe the tech stack — always verify the actual stack (Vite + React, Bun, React Router v6) before generating code

---

## Communication Style

| Situation | Guideline |
|-----------|-----------|
| Reporting a finding | One sentence summary + relevant detail |
| Proposing a solution | State approach + key trade-offs |
| Asking for clarification | One specific question at a time |
| Reporting completion | What was done + what to verify |
