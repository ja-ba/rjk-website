---
name: ship-pr
description: Use this skill when the user asks to "ship a PR", "create and merge a PR", "open a pull request", or "ship this branch".
version: 1.1.0
tools: Bash(git status:*), Bash(git push:*), Bash(git pull:*), Bash(git checkout:*), Bash(git log:*), Bash(git add:*), Bash(git commit:*), Bash(pnpm test:*), mcp__github__create_pull_request, mcp__github__pull_request_read, mcp__github__list_pull_requests, mcp__github__merge_pull_request, mcp__github__get_me
---

You are executing the ship-pr workflow. The GitHub repo is `ja-ba/rjk-website`. Follow these steps exactly.

## Step 1 — Guard checks

Run `git branch --show-current` to capture the current branch name.

If the current branch is `main`, abort immediately: "Cannot ship from main branch. Please switch to a feature branch first."

Run `git log --oneline main..HEAD`. If there are no commits, abort: "No commits ahead of main — nothing to ship."

## Step 2 — Create the PR

Push the branch: `git push -u origin HEAD`

Use `mcp__github__create_pull_request` to open the PR:
- `owner`: `ja-ba`
- `repo`: `rjk-website`
- `head`: current branch name
- `base`: `main`
- `title` and `body`: generated from the commit log (concise summary of what changed and why)

Capture the PR number from the response.

## Step 3 — Subagent review loop (max 3 iterations)

Launch a Haiku subagent with the following prompt (substituting the actual PR number):

> Fetch the diff for PR #<PR_NUMBER> in ja-ba/rjk-website using mcp__github__pull_request_read with method "get_diff". Then invoke the /review skill on that diff. Evaluate the output:
> - If there are no actionable issues → respond with exactly: `APPROVED`
> - If there are issues that need fixing → respond with exactly: `CHANGES_REQUESTED` followed by a numbered list of the specific issues

Interpret the response:

- `APPROVED` → proceed to Step 4
- `CHANGES_REQUESTED` → fix each listed issue in the working tree, then:
  ```
  git add -A
  git commit -m "fix: address review feedback"
  git push
  ```
  Repeat Step 3 (increment counter). After 3 iterations still failing → stop: "PR has unresolved review issues after 3 iterations. Please review manually: [issues]. PR remains open."

## Step 4 — Merge

Use `mcp__github__merge_pull_request`:
- `owner`: `ja-ba`
- `repo`: `rjk-website`
- `pullNumber`: captured PR number
- `merge_method`: `squash`

Then delete the remote branch: `git push origin --delete <branch-name>`

## Step 5 — Run tests on main

Switch to main and pull: `git checkout main && git pull`

Run the tests: `pnpm test`

Report clearly:
- Tests pass: "PR #<NUMBER> shipped successfully. All tests passing on main."
- Tests fail: "PR #<NUMBER> merged, but tests are failing on main. Please investigate immediately."
