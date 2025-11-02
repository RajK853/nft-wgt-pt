# Next.js + Supabase Project

This is a web application built with the Next.js framework and Supabase for the backend. It utilizes `shadcn/ui` for its UI components and styling.

---

## Project Context Map

This document provides a map to the detailed context files located in the `llm_context/` directory. The files are organized into subdirectories for better management and clarity.

### `llm_context/0_project/`
*   **`0_project_overview.md`**: High-level summary, key features, and build/run instructions.
*   **`1_app_structure.md`**: The application's file and directory structure.
*   **`2_data_schema.md`**: Details on the data source and schema.
*   **`3_core_logic_overview.md`**: A summary of the core logic.
*   **`4_dependencies.md`**: A list of the project's main dependencies.

### `llm_context/1_coding_standards/`
*   **`0_coding_philosophy.md`**: TypeScript-specific philosophy and general software design principles.
*   **`1_development_strategies.md`**: Practical development strategies (modularity, error handling, testing, security).
*   **`2_component_design.md`**: Guidelines for creating components in React/Next.js.
*   **`3_code_style_practices.md`**: Good code style practices, including ESLint and Prettier.
*   **`4_tooling_for_enforcement.md`**: Tools to automate the enforcement of coding standards.
*   **`5_documentation_aesthetics.md`**: Principles for visually appealing and maintainable documentation.
*   **`6_git_practices.md`**: Specific Git practices for the Gemini LLM.
*   **`7_nextjs_routing.md`**: Guidelines for using Next.js App Router for navigation.
*   **`8_github_actions.md`**: Workflow for using the `github` tool to manage features.
*   **`9_issue_template.md`**: Template for creating new issues.
*   **`10_mr_template.md`**: Template for creating new merge requests.

### `llm_context/2_llm_interaction/`
*   **`0_rules_of_engagement.md`**: My core operating principles for every prompt.
*   **`1_llm_guidelines.md`**: Guidelines for interacting with the Gemini LLM, including context management and file size.

### `llm_context/3_plan_generation/`
*   **`0_plan_generation_workflow.md`**: The complete workflow for generating an implementation plan.

### `llm_context/4_execution_strategy/`
*   **`0_execution_workflow.md`**: The workflow for executing an implementation plan.

---

## Plan Generation and Execution

### Plan Generation

When you ask me to **create**, **generate**, or **make a plan** to **do**, **implement**, or **fix** something, I will follow the workflow defined in `llm_context/3_plan_generation/0_plan_generation_workflow.md`.

### Plan Execution

When you ask me to **implement**, **execute**, **run**, or **follow a plan**, I will follow the workflow defined in `llm_context/4_execution_strategy/0_execution_workflow.md`.

---

## Rigorously Adhere to Style Guides

When applying any coding style or formatting guidelines, always perform an explicit, step-by-step verification. This includes:
1.  **Re-reading the specific rule** immediately before and after applying the change.
2.  **Performing a character-by-character or line-by-line comparison** to ensure exact adherence.
3.  **Providing a brief, explicit confirmation** of how the change adheres to the rule.
4.  **If a tool operation fails due to a mismatch, immediately re-read the relevant file content and the style guide rule to identify the exact discrepancy.**