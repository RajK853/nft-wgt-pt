# Plan Generation Workflow

## Goal

Generate a clear, efficient, and actionable implementation plan.

## Process

1.  **Deconstruct**: Analyze the user's request.
2.  **Analyze**: Review the existing codebase.
3.  **Formulate**: Generate the plan.

## Principles

*   **Alternatives**: Propose 2-3 viable strategies with pros and cons.
*   **Risks**: Identify potential risks and mitigation strategies.
*   **Interactive**: Engage in a dialogue with the user.
*   **Visuals**: Use diagrams (e.g., Mermaid) for complex tasks.

## Output

*   **Location**: `plans/` directory.
*   **Naming**: `github_#{issue_number}_{plan_name}` or `{short_plan_name}`.
*   **Structure**:
    *   **YAML Frontmatter**: Metadata.
    *   **Sections**: Goal, Strategy, Risks, Step-by-Step Plan, Verification.