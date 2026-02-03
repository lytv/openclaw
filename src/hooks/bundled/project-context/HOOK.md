---
name: project-context
description: "Inject project-specific README into agent context via a projects.json routing table"
homepage: https://docs.openclaw.ai/hooks#project-context
metadata:
  {
    "openclaw":
      {
        "emoji": "📂",
        "events": ["command:new", "agent:bootstrap"],
        "requires": { "config": ["workspace.dir"] },
        "install": [{ "id": "bundled", "kind": "bundled", "label": "Bundled with OpenClaw" }],
      },
  }
---

# Project Context Hook

Injects the README from a project directory into the agent bootstrap context, routed by chat ID via a `projects.json` table in the workspace root.

## What It Does

1. **Extracts a routing key** from the session key (e.g. `telegram:-1005013557662`).
2. **Normalises Telegram IDs** — automatically tries both legacy (`-XXXX`) and supergroup (`-100XXXX`) formats so a single table entry covers either bot variant.
3. **Looks up the project directory** in `<workspace>/projects.json`.
4. **On `agent:bootstrap`** — reads `<workspace>/<projectDir>/README.md` and pushes it as a synthetic bootstrap file (`PROJECT_CONTEXT.md`) so it appears in the system prompt.
5. **On `command:new`** — pushes a confirmation message (`📂 Project context: <basename>`) so the user knows context was re-attached after a session reset.

## Workspace Layout

```
workspace/
├── projects.json          # routing table
└── projects/
    ├── demo-app/
    │   └── README.md      # injected for demo-app chats
    └── api-server/
        └── README.md      # injected for api-server chats
```

### projects.json

Keys are `<channel>:<chatId>`. Telegram IDs are normalised at lookup time, so only one format is required per group — but listing both is fine too.

```json
{
  "telegram:-1005013557662": "projects/demo-app",
  "discord:1234567890":      "projects/api-server"
}
```

## Requirements

- `workspace.dir` must be set (automatically configured during onboarding).
- A valid `projects.json` in the workspace root.
- A `README.md` inside the mapped project directory.

## Enable

```bash
openclaw hooks enable project-context
```
