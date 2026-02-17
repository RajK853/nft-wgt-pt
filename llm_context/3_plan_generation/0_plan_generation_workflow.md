# Plan Generation Workflow

Defines when and how to create implementation plans for this project.

---

## When to Generate a Plan

| Situation | Action |
|-----------|--------|
| Task touches 3+ files | Always create a plan |
| Architectural or data model change | Always create a plan |
| Multiple valid strategies exist | Create a plan to compare them |
| Simple addition following an established pattern | Act directly (no plan needed) |

> See `llm_context/2_llm_interaction/0_interaction_policy.md` for the full Plan vs Act decision table.

---

## Process

1. **Deconstruct** — restate the goal in your own words; identify all affected files.
2. **Analyse** — read the relevant `llm_context/` files and the existing code for the affected area.
3. **Formulate** — write the plan using the template below.
4. **Propose** — present 2–3 strategies with pros/cons when meaningful alternatives exist. Recommend one.
5. **Confirm** — wait for explicit user approval before switching to Act.

---

## Plan File Location & Naming

```
plans/
├── _template.md                          # Copy this to start
├── github_#42_add_player_stats.md        # Linked to a GitHub issue
└── add_export_feature.md                 # Ad-hoc plan
```

- Linked to issue: `github_#{issue_number}_{short_name}.md`
- Ad-hoc: `{short_name}.md` (kebab-case)

---

## Plan File Structure

Use `plans/_template.md` as the base. Every plan must contain:

```yaml
---
issue: "#42"             # GitHub issue number, or "N/A"
title: "Add player stats page"
status: draft            # draft | approved | in-progress | done
created: 2026-02-17
---
```

Followed by these sections:

| Section | Purpose |
|---------|---------|
| **Goal** | One-paragraph statement of what success looks like |
| **Affected Files** | List of files to create/modify/delete |
| **Strategy** | The chosen approach (+ alternatives considered if > 1) |
| **Risks** | Potential breakages and mitigations |
| **Step-by-Step Plan** | Numbered, atomic subtasks with verification step for each |
| **Verification** | Final checks — lint, tests, build, manual browser check |

---

## Filled-In Minimal Example

```markdown
---
issue: "N/A"
title: "Add export button to Dashboard"
status: approved
created: 2026-02-17
---

## Goal
Add a CSV export button to the Dashboard page that downloads the current
filtered game_events data as a CSV file.

## Affected Files
- `src/pages/Dashboard.tsx` — add export button + handler
- `src/lib/utils.ts` — add `exportToCsv()` helper

## Strategy
Generate CSV client-side using a data-URI download link — no new dependency
needed. Rejected alternative: `papaparse` library (unnecessary overhead for
this use case).

## Risks
- Large datasets could freeze the browser tab. Mitigation: limit export to
  the currently displayed/filtered rows (already paginated).

## Step-by-Step Plan
1. Add `exportToCsv(rows, filename)` to `src/lib/utils.ts`
   - Verify: unit test in `src/__tests__/utils.test.ts`
2. Add export button to `Dashboard.tsx` toolbar
   - Verify: `bun run lint` passes, button visible in `bun run dev`
3. Wire up click handler calling `exportToCsv`
   - Verify: clicking downloads a valid .csv file

## Verification
- `bun run lint` — no errors
- `bun test` — existing tests still pass
- `bun run build` — no TypeScript errors
- Manual: download works in browser, CSV opens correctly
```

---

## Principles

- **Atomic steps** — each step should be independently verifiable.
- **One strategy** — pick one and commit; list alternatives only if the user needs to decide.
- **Visuals** — use ASCII diagrams or Mermaid for complex data flows. Keep them brief.
- **Stay current** — update `status` field as the plan progresses.
