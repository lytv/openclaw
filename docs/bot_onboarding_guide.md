# OpenClaw: Bot Onboarding & Integration Guide

This guide provides a step-by-step process for adding a new bot to your OpenClaw system, integrating it into a workspace, and configuring its persona and behavior.

---

## 1. Telegram Side Setup
1.  Open **@BotFather** on Telegram.
2.  Create a new bot via `/newbot`.
3.  Get the **API Token**.
4.  (Optional) For forum support, ensure the bot is added to a Supergroup and has "Has Topics Enabled" (automatically handled by OpenClaw if configured).

---

## 2. Core Configuration (`openclaw.json`)

All primary configurations are stored in `~/.openclaw/openclaw.json`.

### A. Register the Telegram Account
Add your bot token under `channels.telegram.accounts`.

```json
"channels": {
  "telegram": {
    "accounts": {
      "new_agent_account": {
        "botToken": "YOUR_BOT_TOKEN_HERE",
        "name": "@YourBotName"
      }
    }
  }
}
```

> [!IMPORTANT]
> The `name` field MUST exactly match your bot's Telegram username (including the `@` prefix). OpenClaw uses this to detect when the bot is mentioned in group chats. If this doesn't match, the bot will skip messages in groups even if mentioned.


### B. Define the Agent
Add the agent identity to the `agents.list`. Always include `workspace` — see [Section 4](#4-workspace--tool-integration) for why.

```json
"agents": {
  "list": [
    {
      "id": "new_agent_id",
      "name": "Display Name",
      "workspace": "/path/to/shared/workspace"
    }
  ]
}
```

> [!NOTE]
> **Naming convention** — keep `id` and `name` consistent across the system:
> - `id`: lowercase, no underscores or hyphens (e.g. `devnam`, `qalead`). This becomes the directory name under `~/.openclaw/agents/` and appears in session keys.
> - `name`: PascalCase, single word (e.g. `DEVNam`, `QALead`). This is the display name shown in logs and UI.
> - `accountId` in `channels.telegram.accounts` should match the agent `id` where possible (exception: legacy accounts like `second` for `devnam`).

### C. Create Bindings
Link the agent to the Telegram account. This ensures messages to/from this bot are routed to the correct agent logic.

```json
"bindings": [
  {
    "agentId": "new_agent_id",
    "match": {
      "channel": "telegram",
      "accountId": "new_agent_account"
    }
  }
]
```

---

## 3. Defining the Agent's Persona

OpenClaw uses a set of Markdown files to define how an agent thinks, responds, and what it remembers.
**Location**: `~/.openclaw/agents/<new_agent_id>/agent/`

| File | Purpose |
| :--- | :--- |
| `SOUL.md` | Core personality, tone, and response guidelines. |
| `IDENTITY.md` | Public-facing info, name, and "who I am". |
| `MEMORY.md` | Long-term facts, context, and specific constraints. |

> [!TIP]
> Use the **SOUL.md** to define specialized behavior (e.g., "Always respond in Vietnamese", "Expert in DevOps").

---

## 4. Workspace & Tool Integration

The workspace is the directory where agents read bootstrap files (`SOUL.md`, `TOOLS.md`, etc.), `projects.json` for project-context routing, and any other shared resources.

### How workspace resolution works

`resolveAgentWorkspaceDir` picks the workspace in this order:

1. **Per-agent `workspace` field** — used if set on the agent entry in `agents.list`.
2. **`agents.defaults.workspace`** — used as fallback, but **only for the default agent** (the one with `"default": true`).
3. **`~/.openclaw/workspace-<agentId>`** — automatic per-agent directory. Created implicitly if neither (1) nor (2) applies.

> [!WARNING]
> Pitfall: if you add a new agent without setting its `workspace`, and it is not the default agent, it silently falls back to `~/.openclaw/workspace-<agentId>`. That directory is separate from the shared workspace — hooks like `project-context` won't find `projects.json` there, and the agent won't share bootstrap files with the others.

### Recommended: one shared workspace for all agents

Set `workspace` explicitly on every agent entry so they all point to the same directory:

```json
"agents": {
  "defaults": {
    "workspace": "/path/to/shared/workspace"
  },
  "list": [
    { "id": "main",     "default": true, "name": "TienPhong" },
    { "id": "devnam",   "name": "DEVNam",   "workspace": "/path/to/shared/workspace" },
    { "id": "qalead",   "name": "QALead",   "workspace": "/path/to/shared/workspace" }
  ]
}
```

Or via CLI, once per new agent:

```bash
openclaw config set agents.list[N].workspace /path/to/shared/workspace
```

This way `projects.json`, project READMEs, and all hooks work identically across every bot — no copying, no drift.


---

## 4.5. Agent-Specific Tooling (Skills)

By default, agents inherit global skills. You can override or add specific skills per agent to give them specialized tools (e.g., `agent-browser` for QA bots).

**Config Example in `openclaw.json`**:
```json
{
  "id": "qalead",
  "name": "QALead",
  "workspace": "/path/to/shared/workspace",
  "tools": {
    "alsoAllow": ["agent-browser:*", "bash:*"]
  }
}
```

- **`allow`**: Strict list of allowed tools (replaces global).
- **`alsoAllow`**: Adds these tools on top of the global allowlist.
- **`deny`**: Specific tools to block.

---

## 5. Forum Topics & Group Logic

If you are using the bot in a **Telegram Forum Group**:

- **System Prompt per Topic**: You can set unique instructions for specific topics.
- **Loopback Support**: OpenClaw now supports inter-bot communication with correct topic awareness.

**Config Example**:
```json
"groups": {
  "-100123456789": {
    "topics": {
      "123": {
        "systemPrompt": "You are specifically auditing code in this topic.",
        "requireMention": false
      }
    }
  }
}
```

---

## 6. Restarting the System

After modifying the configuration or agent files, you must restart the Gateway to apply changes.

### Standard Restart:
```bash
launchctl unload ~/Library/LaunchAgents/ai.openclaw.gateway.plist
launchctl load ~/Library/LaunchAgents/ai.openclaw.gateway.plist
```

### Deep Restart (Recommended for Code/Logic Changes):
If you've updated the core OpenClaw code or want to be 100% sure:
```bash
pkill -9 -f "node dist/gateway" && launchctl load ~/Library/LaunchAgents/ai.openclaw.gateway.plist
```

---

## Summary of Checklist
- [ ] Get Token from BotFather.
- [ ] Add account to `openclaw.json`.
- [ ] Add agent ID to `agents.list`.
- [ ] Create `bindings`.
- [ ] Create `SOUL.md` in `~/.openclaw/agents/<id>/agent/`.
- [ ] Set `workspace` on the agent entry to the shared workspace path (see Section 4).
- [ ] (Optional) Configure specific `tools` (skills) in `openclaw.json`.
- [ ] Restart Gateway.
