---
name: ship-pr
description: Use this skill when the user asks to "ship a PR", "create and merge a PR", "open a pull request", or "ship this branch".
version: 1.0.0
tools: Bash(git status:*), Bash(git push:*), Bash(git pull:*), Bash(git checkout:*), Bash(git log:*), Bash(git add:*), Bash(git commit:*), Bash(gh pr create:*), Bash(gh pr view:*), Bash(gh pr merge:*), Bash(gh pr diff:*), Bash(gh pr list:*), Bash(pnpm test:*)
---

You are executing the ship-pr workflow. Follow these steps exactly.

## Step 1 — Guard checks

Run `git status` and `git branch --show-current` to capture the current branch name.

If the current branch is `main`, abort immediately and tell the user: "Cannot ship from main branch. Please switch to a feature branch first."

Run `git log --oneline main..HEAD` to capture recent commits. If there are no commits ahead of main, abort and tell the user: "No commits ahead of main — nothing to ship."

## Step 2 — Create the PR

Push the branch: `git push -u origin HEAD`

Create the PR using `gh pr create`. Generate a concise title and body from the commit log (what changed and why). Use `--squash` is NOT a flag for create — just create the PR normally.

Capture the PR number from the output (it appears in the URL printed by gh).

## Step 3 — Subagent review loop (max 3 iterations)

Launch a Haiku subagent with the following prompt (substituting the actual PR number):

> Invoke the `/review` skill for PR number <PR_NUMBER>. After the review completes, evaluate the output:
> - If there are no actionable issues, no blocking concerns, and the code looks good → respond with exactly: `APPROVED`
> - If there are issues that need to be fixed → respond with exactly: `CHANGES_REQUESTED` followed by a numbered list of the specific issues found

Interpret the subagent response:

- If `APPROVED` → proceed to Step 4
- If `CHANGES_REQUESTED` → fix each listed issue directly in the working tree, then run:
  ```
  git add -A
  git commit -m "fix: address review feedback"
  git push
  ```
  Then repeat Step 3 (increment iteration count). If this was the 3rd iteration and still `CHANGES_REQUESTED`, stop and report: "PR has unresolved review issues after 3 iterations. Please review manually: [list the issues]. The PR remains open at <PR_URL>."

## Step 4 — Merge

Run: `gh pr merge <PR_NUMBER> --squash --delete-branch`

Confirm the merge succeeded by checking the command output.

## Step 5 — Run tests on main

Switch to main and pull: `git checkout main && git pull`

Run the tests: `pnpm test`

Report the result clearly:
- If tests pass: "PR #<NUMBER> shipped successfully. All tests passing on main."
- If tests fail: "PR #<NUMBER> merged, but tests are failing on main. Please investigate immediately."
