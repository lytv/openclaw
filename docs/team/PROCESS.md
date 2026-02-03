# 🔄 Team Processes

## workflow: New Feature Development

1.  **Request**: User puts a request in chat.
2.  **Plan (PM)**:
    - `main` agent analyzes request.
    - Creates entries in `task.md`.
    - (Optional) Creates `implementation_plan.md` for user approval.
3.  **Implement (Dev)**:
    - `main` delegates to `devnam`.
    - `devnam` reads plan, writes code, adds tests.
    - `devnam` marks tasks as `[/]`.
4.  **Verify (QA)**:
    - `devnam` notifies `qa_lead`.
    - `qa_lead` runs tests/verification.
    - If Pass: `qa_lead` marks tasks `[x]`.
    - If Fail: `qa_lead` creates a bug report in `reports/` and re-assigns to `devnam`.

## Workflow: Bug Fixing

1.  **Identify**: User or Agent spots a bug.
2.  **Report**: Create `reports/YYYY-MM-DD_Bug_[Name].md`.
    - Include: Steps to reproduce, Expected vs Actual, logs.
3.  **Fix**: `devnam` fixes the code.
4.  **Verify**: `qa_lead` confirms the fix.

## Workflow: Daily Standup (Optional)

At the start of a session, the `main` agent should:
1.  Read `task.md`.
2.  Summarize pending work.
3.  Ask the user for priority adjustments.
