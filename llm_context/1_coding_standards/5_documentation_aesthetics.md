# Documentation Aesthetics

Standards for writing documentation in this project — both in code and in markdown files.

---

## Code Documentation

### JSDoc for Exported Functions and Hooks

Document all exported functions and hooks with JSDoc. Focus on *why* and *what it returns* — not paraphrasing the implementation.

```ts
/**
 * Calculates a time-weighted penalty score for a player.
 * Uses exponential decay so recent events have more impact.
 *
 * @param records - All penalty events for this player
 * @param asOf - Reference date for decay calculation (defaults to now)
 * @returns Total weighted score (positive = good, negative = poor)
 */
export function calculateWeightedScore(
  records: PenaltyRecord[],
  asOf?: Date
): number { ... }
```

### Inline Comments

Use inline comments sparingly — only when the *why* is non-obvious:

```ts
// ✅ Explains a non-obvious decision
// We cancel the request on cleanup to prevent stale state updates
// if the component unmounts before the fetch completes
return () => { cancelled = true }

// ❌ Just restates the code
// Set cancelled to true
return () => { cancelled = true }
```

---

## Markdown Files (llm_context/)

### Purpose

Files in `llm_context/` are the **primary context source for LLMs** working in this codebase. They must be:
- **Accurate** — reflect the actual codebase, not generic patterns
- **Concise** — target 300–800 words per file; max ~1000 words
- **Actionable** — include code examples for patterns that LLMs should copy
- **Specific** — reference actual files (`src/lib/supabase.ts`), not generic descriptions

### Structure

Each file should follow this structure:
1. **One-line purpose statement** (first paragraph)
2. **Sections with H2 headers** separated by `---`
3. **Tables** for quick reference (naming conventions, dependencies, props)
4. **Code blocks** for patterns that must be followed exactly
5. **Anti-patterns** (what NOT to do) — especially important for LLMs

### Formatting Rules

- Use `**bold**` to highlight key terms and warnings
- Use `>` blockquotes for important callouts
- Use `✅` / `❌` in comments to mark correct vs. incorrect patterns
- Use H2 (`##`) for main sections, H3 (`###`) for subsections
- Separate sections with `---`
- Keep code examples minimal but complete — not toy pseudocode

### Anti-Patterns in Docs

- ❌ Don't write generic advice that applies to any project ("use descriptive variable names")
- ❌ Don't reference wrong frameworks (Next.js, shadcn/ui CLI, npm, Prettier)
- ❌ Don't write prose that could be a table
- ❌ Don't omit "what NOT to do" — it's as important as "what to do" for LLMs

---

## README / GEMINI.md

- `README.md` — project description and setup for new contributors
- `GEMINI.md` — project context for Gemini LLM (kept in sync conceptually with `llm_context/`)
- Keep both up to date when the tech stack or architecture changes
