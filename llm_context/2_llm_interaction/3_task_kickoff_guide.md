# Task Kickoff Guide

This guide defines how an LLM agent should orient itself at the start of any task in this project. Follow this before writing or modifying any code.

---

## Step 1 — Understand the Stack

If you haven't worked in this codebase before (or context is fresh), read these first:

| File | What it tells you |
|------|-------------------|
| `llm_context/0_project/0_project_overview.md` | Tech stack, commands, env vars |
| `llm_context/0_project/1_app_structure.md` | Directory layout, routing, page conventions |
| `llm_context/0_project/4_dependencies.md` | What IS and is NOT installed |

> **Key facts to internalise**: Vite + React 19 (no SSR), Bun (not npm), React Router v6 (not Next.js), `import.meta.env.VITE_*` (not `Bun.env`), singleton `getSupabaseClient()` (not `createServerClient`).

---

## Step 2 — Identify the Task Type

Use this decision tree to know which context files to load next:

```
What kind of task is this?
│
├── Adding a new PAGE
│   └── Read: 1_app_structure.md, 6_common_patterns.md, 2_page_design_guide.md, 4_frontend_best_practices.md
│
├── Adding/modifying a UI component
│   └── Read: 2_component_design.md, 6_common_patterns.md, 4_frontend_best_practices.md
│
├── Adding/modifying data fetching or Supabase queries
│   └── Read: 5_supabase_integration.md, 2_data_schema.md, 6_common_patterns.md
│
├── Changing scoring / business logic
│   └── Read: 3_core_logic_overview.md, 2_data_schema.md
│
├── Styling changes
│   └── Read: 2_page_design_guide.md, 3_code_style_practices.md, 4_frontend_best_practices.md
│
├── Routing changes
│   └── Read: 7_nextjs_routing.md (renamed: React Router v6 guide), 1_app_structure.md
│
└── General / unclear
    └── Read: 0_project_overview.md, then determine task type above
```

---

## Step 3 — Choose Plan or Act Mode

| If the task is... | Then... |
|-------------------|---------|
| Clearly scoped (< 3 files, well-understood) | Act directly |
| Multi-file, unclear requirements, or risky | Use Plan Mode: generate a plan in `plans/`, get confirmation, then Act |
| Ambiguous (requirements could be interpreted multiple ways) | Ask one clarifying question before proceeding |

For plan format, see `llm_context/3_plan_generation/0_plan_generation_workflow.md` and use `plans/_template.md`.

---

## Step 4 — Verify Before You Write

Before writing any code for the changed area, check:

1. **Does the file/component already exist?** Use `list_files` or `search_files` — avoid creating duplicates.
2. **Are there existing patterns to follow?** Read one nearby file of the same type (e.g., read `Dashboard.tsx` before creating a new page).
3. **Is the dependency already installed?** Check `llm_context/0_project/4_dependencies.md` before importing anything new.

---

## Step 5 — After Each Change

Run these in order:

```bash
bun run lint        # ESLint — fix any errors before proceeding
bun test            # Vitest — ensure no regressions
bun run build       # Vite build — final sanity check for type errors
```

If `bun run build` fails, fix before moving on. Never leave a broken build.

---

## Anti-Patterns to Avoid from the Start

| ❌ Don't | ✅ Do instead |
|---------|--------------|
| Import from `next/*` | Use `react-router-dom` |
| Use `npm install` | Use `bun add` |
| Use `Bun.env.*` | Use `import.meta.env.VITE_*` |
| Create `createServerClient()` | Use `getSupabaseClient()` from `src/lib/supabase.ts` |
| Add `'use client'` directives | Not applicable — this is pure CSR |
| Auto-commit changes | Wait for explicit user instruction |
