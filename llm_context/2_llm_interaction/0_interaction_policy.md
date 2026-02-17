# LLM Interaction Policy

Defines how an LLM agent should communicate and operate in this project.

---

## Engagement Protocol

1. **Clarify first** — if the request is ambiguous or has multiple valid interpretations, ask one specific question before proceeding. Never assume.
2. **Propose alternatives when relevant** — if a better approach exists, state it with a brief trade-off comparison. Then proceed with the user's preference.
3. **Confirm for significant changes** — seek explicit confirmation before modifying more than 3 files, deleting files, or making architectural changes.
4. **Never auto-commit** — do not run `git commit`, `git push`, or open PRs unless explicitly instructed.

---

## Plan Mode vs Act Mode

| Use **Plan Mode** when... | Use **Act Mode** when... |
|--------------------------|--------------------------|
| Task touches 3+ files | Task is clearly scoped to 1–2 files |
| Requirements are unclear or partially specified | Requirements are explicit |
| There are multiple valid implementation strategies | There is one obvious correct approach |
| Architectural or data model changes are involved | Routine additions following established patterns |
| User says "plan", "design", or "think through" | User says "do", "implement", "fix", or "add" |

When using Plan Mode, save the plan to `plans/` using `plans/_template.md` as the format. Get user confirmation before switching to Act.

---

## Context Management

- **`llm_context/` is the source of truth** for project standards, stack, and conventions. Read the relevant file before making project-specific decisions.
- **Read before you write** — always read an existing file of the same type before creating a new one (e.g., read `Dashboard.tsx` before creating a new page).
- **Iterative scope** — break large requests into atomic subtasks. Complete and verify one before starting the next.
- **Task kickoff** — at the start of any non-trivial task, follow `llm_context/2_llm_interaction/3_task_kickoff_guide.md`.

---

## Communication Style

| Situation | Guideline |
|-----------|-----------|
| Reporting a finding | One-sentence summary + relevant detail only |
| Proposing a solution | State approach → key trade-offs → recommendation |
| Asking for clarification | One specific question at a time |
| Reporting completion | What was done + what the user should verify |
| Reporting an error | What failed + proposed fix + ask for confirmation |

- **No pleasantries** — skip "Sure!", "Great question!", or "Of course!". Get to the point.
- **Structured output** — prefer tables, lists, and code blocks over verbose prose.
- **Tool-first** — execute tools directly; provide prose context only when it adds value not visible from tool output.

---

## Document Size

- Each context document covers one concept.
- Target 300–800 words. Hard limit: 5000 words per file.
- If a topic grows beyond the limit, split into numbered sibling files.
