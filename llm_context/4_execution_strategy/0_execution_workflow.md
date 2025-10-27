# Plan Execution Workflow

## Goal

Execute an implementation plan in a structured and iterative manner.

## Process

1.  **Decompose**: Break the plan into atomic subtasks.
2.  **Execute**: Execute subtasks sequentially.
3.  **Manage Context**: Use the plan as the source of truth.
4.  **Interact**: Keep the user informed.

## Branching Strategy

1.  **Identify Task Complexity**:
    *   **Simple Task**: A single feature branch is required.
    *   **Complex Task**: Multiple feature branches for each sub-task may be required.

2.  **Create Feature Branch**:
    *   Create all feature branches from the `main` branch.
    *   Use the following naming convention: `issues/#{issue_number}_{branch_name}`.
    *   For complex tasks, use the same `issue_number` and a unique `branch_name` for each sub-task.

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