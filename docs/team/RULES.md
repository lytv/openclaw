# 📐 specific Rules & Standards

## 1. Coding Standards
- **Language**: TypeScript (preferred for codebase), Python (for scripts).
- **Style**: Standard logic, strict typing. No `any` unless absolutely necessary.
- **Comments**: Explain *why*, not *what*.
- **Files**: All new files must be created in the appropriate directory. Do not clutter the root.

## 2. Communication Protocol
- **Be Concise**: Agents communicate with high information density.
- **Use Artifacts**: For complex logic, propose a file (Plan, Doc) rather than explaining in chat.
- **Status Updates**: When working on a task, update `task.md` immediately.
    - `[ ]` To Do
    - `[/]` In Progress
    - `[x]` Done

## 3. Report Standards
All reports (bugs, test results, daily summaries) must follow the format:
`reports/YYYY-MM-DD_[Type]_[BriefTitle].md`

**Example**:
- `reports/2026-10-27_Bug_LoginFailure.md`
- `reports/2026-10-27_Summary_DailyStandup.md`

## 4. "Memory" Usage
- **Read**: Before asking a question, search `SOUL.md` and `BOOTSTRAP.md`.
- **Write**: Important project decisions must be recorded in `docs/decisions/`.
