# Plan Execution Workflow

## Goal

Execute an implementation plan in a structured and iterative manner.

## Pre-implementation Clarification

1.  **Read and Clarify**: When instructed to implement a plan, first read the plan thoroughly. Ask follow-up questions as many times as needed to gather useful information or fix any ambiguities before starting implementation.

## Process

1.  **Decompose**: Break the plan into atomic subtasks.
2.  **Identify Task Complexity**:
    *   **Simple Task**: A single feature branch is required.
    *   **Complex Task**: Multiple feature branches for each sub-task may be required.
3.  **Create Feature Branch**:
    *   Always create a feature branch for each plan (if not already present) from the `main` branch.
    *   Refer to `llm_context/1_coding_standards/6_git_practices.md` for the feature branch naming convention.
    *   For complex tasks, use the same `issue_number` and a unique `branch_name` for each sub-task.
4.  **Execute**: Execute subtasks sequentially in their feature branches.
5.  **Manage Context**: Use the plan as the source of truth.

## Principles

*   **Decomposition**: Break the plan into atomic, verifiable actions.
*   **Iterative Cycle**:
    1.  **State**: Announce the subtask.
    2.  **Gather**: Gather local context.
    3.  **Execute**: Perform the action.
    4.  **Verify**: Run tests or linters.
*   **User Interaction**:
    *   **Progress Updates**: Keep the user informed.
    *   **Confirmation**: Seek confirmation for significant actions.
    *   **Error Handling**: Pause, explain, propose a solution, and wait for confirmation.
    *   **Commit Policy**: NEVER automatically commit changes to git unless explicitly instructed by the user.
    *   **Task Completion**: After finishing code implementation or any task, always wait for user instruction. Never do multiple tasks at once.