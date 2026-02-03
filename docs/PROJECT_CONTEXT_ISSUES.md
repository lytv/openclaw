# Project Context Injection Issues & Solutions

This document details two specific issues identified with the **Project Context Switching** system and provides their technical root causes and recommended solutions.

## 1. Issue: Missing Context for Secondary Agents (`devnam_bot`)

### Problem Description
When communicating in a group, the `main` agent correctly receives project context, but secondary agents (like `devnam_bot`) do not, behaving as if they are unaware of the active project.

### Root Cause Analysis
The issue stems from a **Chat ID Mismatch** in the `projects.json` routing table.

*   **Mechanism**: The `project-context` hook extracts the Chat ID from the session key and looks it up in `projects.json`.
*   **The Discrepancy**:
    *   Telegram assigns a specific implementation ID to groups. Older bots or specific API versions may refer to a group by its **Legacy ID** (e.g., `-5013557662`).
    *   Newer bots or those using the Supergroup API often refer to the same group by its **Supergroup ID**, which is prefixed with `-100` (e.g., `-1005013557662`).
*   **Failure Point**: Your `projects.json` currently maps only the Legacy ID. When `devnam_bot` operates, it receives the Supergroup ID, finds no match in the lookup table, and thus no context is injected.

### Solution
Update `projects.json` to include **both** ID formats keying to the same project directory.

**Example `projects.json` Update:**
```json
{
    "telegram:-5013557662": "projects/demo-app",
    "telegram:-1005013557662": "projects/demo-app"
}
```

---

## 2. Issue: Context Not Loading on `/new` Command

### Problem Description
When a user issues the `/new` command to reset the session, the project context is not immediately re-injected or visible until the *next* message is sent.

### Root Cause Analysis
The issue is caused by the **Event Trigger Lifecycle**.

*   **Current Trigger**: The hook is listening to the `before_agent_start` event.
*   **The Flow**:
    1.  User sends `/new`.
    2.  System processes the command -> **Session Reset**.
    3.  System halts. (The agent does *not* generate a completion response to a `/new` command by default; it just clears memory and waits).
    4.  Since the agent generation loop never starts, the `before_agent_start` event is never fired.
*   **Result**: Context is effectively "loaded" in the background but not displayed or "active" in the immediate turn because no generation occurred.

### Solution
To ensure context is refreshed and visible immediately upon reset, you have two options:

#### Option A: Trigger on Command (Code Change)
Modify `hooks/project-context/index.ts` to listen to the `command` event in addition to `before_agent_start`.
*   *Pros*: More robust.
*   *Cons*: Requires modifying hook logic to handle command objects.

#### Option B: Force Agent Response (Configuration)
Configure the agent to automatically send a "Greeting" or "System Ready" message after a reset.
*   *Mechanism*: Reset -> Auto-Greeting triggers Agent Generation -> Triggers `before_agent_start` -> Context Injected.
*   *Pros*: No code changes to the hook required.
*   *Cons*: Change in bot behavior (chattier).
