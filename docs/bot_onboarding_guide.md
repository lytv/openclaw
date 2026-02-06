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
- [ ] (Optional) Enable TTS with `tts:*` permission (see Section 7).
- [ ] (Optional) Enable agent-to-agent messaging (see Section 8).
- [ ] Restart Gateway.

---

## 7. Text-to-Speech (TTS) Configuration

To enable voice messages for your bot:

### A. Grant TTS Permission
Add `tts:*` to the agent's `tools.alsoAllow`:

```json
{
  "id": "mybot",
  "name": "MyBot",
  "workspace": "/path/to/workspace",
  "tools": {
    "alsoAllow": ["tts:*"]
  }
}
```

### B. Global TTS Settings
Configure global TTS in `messages.tts`:

```json
"messages": {
  "tts": {
    "auto": "always",
    "provider": "edge",
    "edge": {
      "enabled": true,
      "voice": "en-US-ChristopherNeural"
    }
  }
}
```

**TTS Modes:**
- `"always"` - Generate audio for every message
- `"on-request"` - Only when explicitly requested
- `"off"` - Disable TTS

**Popular Edge Voices:**
- `en-US-ChristopherNeural` (Male, American)
- `en-US-MichelleNeural` (Female, American)
- `en-GB-RyanNeural` (Male, British)

> [!WARNING]
> Per-agent `messages.tts` override is **NOT supported**. All agents share the global TTS config. Use TTS tags in messages if you need different voices per agent.

---

## 8. Multi-Bot Communication (Agent-to-Agent)

By default, agents **cannot see messages from other agents**. This is a security feature.

### Enable Agent-to-Agent Messaging
Add `tools.agentToAgent` to your config:

```json
"tools": {
  "agentToAgent": {
    "enabled": true,
    "allow": ["bot1", "bot2", "bot3"]
  }
}
```

> [!IMPORTANT]
> Without this config, bots will **not trigger each other** even when @mentioned. This is the most common issue when setting up multi-bot interview systems or collaborative workflows.

### Example: Interview Bot Pair
```json
"tools": {
  "agentToAgent": {
    "enabled": true,
    "allow": ["interviewer", "candidate"]
  }
}
```

---

## 9. Group Configuration for Multiple Bots

When using `groupPolicy: "allowlist"` per account, you must also specify which groups each account can access.

### Per-Account Group Allowlist
```json
"accounts": {
  "mybot": {
    "botToken": "...",
    "groupPolicy": "allowlist",
    "groups": {
      "-1001234567890": {
        "requireMention": false
      }
    }
  }
}
```

> [!TIP]
> Set `requireMention: false` for interview/collaborative bots so they can see all messages in the group, not just @mentions.

---

## 10. Role Clarity in Multi-Bot Systems

When multiple bots interact, ensure clear role definitions in `SOUL.md`:

### Example: Interviewer Bot
```markdown
# Soul: Larry - Interviewer Bot (NEVER Candidate)

## Personality
🚨 **CRITICAL**: I am an INTERVIEWER, NOT a candidate. 
I ASK questions and evaluate answers. I do NOT answer interview questions.
```

### Example: Candidate Bot
```markdown
# Soul: Sarah - Candidate Bot (NEVER Interviewer)

## Personality
🚨 **CRITICAL**: I am a CANDIDATE, NOT an interviewer. 
I ANSWER questions, I do NOT ask them.
```

---

## 11. Turn-Taking Protocol (For Multi-Bot Conversations)

Use completion markers to enforce strict turn-taking:

### Protocol Format
```markdown
## Turn-Taking Rules
1. Each bot MUST include a completion marker at the END of every message
2. Each bot MUST wait until seeing the other's completion marker before responding

### Completion Markers
- Interviewer: `✅ [QUESTION COMPLETE - @candidate_bot YOUR TURN]`
- Candidate: `✅ [ANSWER COMPLETE - @interviewer_bot YOUR TURN]`
```

---

## 12. Troubleshooting Common Issues

### Bot Not Responding in Group
1. **Check `name` field** - Must match Telegram username exactly (with `@`)
2. **Check `groupPolicy`** - If `allowlist`, ensure group ID is in `groups`
3. **Check `requireMention`** - Set to `false` if bot should see all messages

### Bots Not Triggering Each Other
1. **Enable `agentToAgent`** - Most common issue!
2. **Check `allow` list** - Both bot IDs must be listed
3. **Restart gateway** after config changes

### TTS Not Working
1. **Grant `tts:*` permission** in `tools.alsoAllow`
2. **Check `messages.tts.auto`** - Should be `"always"` or `"on-request"`
3. **Verify Edge TTS** - `provider: "edge"` is most reliable

### Role Confusion in Multi-Bot
1. **Add CRITICAL warning** at top of SOUL.md
2. **Clear memory** - Old sessions may have wrong context
3. **Use distinct names** - Larry/Sarah not Bot1/Bot2

### Config Changes Not Applied
```bash
# Full restart
launchctl stop ai.openclaw.gateway
pkill -f "ai.openclaw.gateway" || true
sleep 2
launchctl start ai.openclaw.gateway
```

### Reset Interview Environment
Create a reset script:
```bash
#!/bin/bash
launchctl stop ai.openclaw.gateway
pkill -f "ai.openclaw.gateway" || true
rm -rf ~/.openclaw/agents/*/sessions
rm -rf /path/to/bot1/memory/*
rm -rf /path/to/bot2/memory/*
launchctl start ai.openclaw.gateway
echo "✅ Reset complete"
```
