# GitHub Actions Workflow

This document outlines the workflow for using the `github` tool to manage features, from branch creation to pull request evaluation.

## 1. Create a Feature Branch

Use the `create_branch` function to create a new branch for the feature.

**Example:**
```python
default_api.create_branch(owner='<owner>', repo='<repo>', branch='feature/new-feature', from_branch='main')
```

## 2. Create an Issue for the Feature

Use the `create_issue` function to create a new issue to track the feature.

**Example:**
```python
default_api.create_issue(owner='<owner>', repo='<repo>', title='Implement new feature', body='Details about the new feature.')
```

## 3. Update the Issue with an Implementation Plan

Use the `update_issue` function to add the implementation plan to the issue body.

**Example:**
```python
default_api.update_issue(owner='<owner>', repo='<repo>', issue_number=<issue_number>, body='Implementation Plan:\n\n1. Step 1\n2. Step 2\n3. Step 3')
```

## 4. Create a Pull Request (MR)

Once the feature is implemented, use the `create_pull_request` function to create a pull request.

**Example:**
```python
default_api.create_pull_request(owner='<owner>', repo='<repo>', title='feat: Implement new feature', head='feature/new-feature', base='main', body='Closes #<issue_number>')
```

## 5. Evaluate the Pull Request

Use the `pull_request_read` function with the `get_diff` method to review the changes. Use `add_comment_to_pending_review` to add comments to the pull request.

**Example:**
```python
default_api.pull_request_read(owner='<owner>', repo='<repo>', pullNumber=<pr_number>, method='get_diff')
```

```