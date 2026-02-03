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
Add the agent identity to the `agents.list`.

```json
"agents": {
  "list": [
    {
      "id": "new_agent_id",
      "name": "Display Name"
    }
  ]
}
```

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

To allow the bot to read/write files and use technical tools, configure its workspace in `openclaw.json`.

```json
"agents": {
  "defaults": {
    "workspace": "/path/to/your/project"
  }
}
```
*Wait! You can also set this per-agent if needed.*


---

## 4.5. Agent-Specific Tooling (Skills)

By default, agents inherit global skills. You can override or add specific skills per agent to give them specialized tools (e.g., `agent-browser` for QA bots).

**Config Example in `openclaw.json`**:
```json
{
  "id": "qa_lead",
  "name": "QA Lead",
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
- [ ] (Optional) Set `workspace` path.
- [ ] (Optional) Configure specific `tools` (skills) in `openclaw.json`.
- [ ] Restart Gateway.
