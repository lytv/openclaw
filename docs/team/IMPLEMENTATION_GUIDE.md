# 🏗️ System Architecture & Implementation Guide

This document details the technical implementation of the **Multi-Project Context Switching** system.
It explains how the agent dynamically adapts to different projects based on the conversation source (Group Chat).

## 1. Architecture: Hybrid Layered Context

We use a **Hybrid Approach** that combines the stability of a Global OS with the flexibility of Dynamic Project Context.

### Layer 1: The Operating System (Global)
*   **Source**: `docs/team/` (loaded via `BOOTSTRAP.md`)
*   **Mechanism**: System Prompt Injection (Static).
*   **Content**: Defines **HOW** we work (Immutable).
    *   Roles (`ROLES.md`)
    *   Rules (`RULES.md`)
    *   Processes (`PROCESS.md`)

### Layer 2: The Application (Project Context)
*   **Source**: `projects/<project-name>/README.md`
*   **Mechanism**: **Hybrid** (Hook + Config).
    *   **Context**: Injected dynamically via `before_agent_start` Hook.
    *   **Metadata**: (Optional) Basic settings in `openclaw.json`.
*   **Content**: Defines **WHAT** we are working on (Dynamic).
    *   Requirements
    *   Current Tasks
    *   Architecture specific to the app.

---

## 2. Dynamic Switching Mechanism

We use OpenClaw's **Hook System** (`before_agent_start`) to intercept session initialization.

### The Flow
1.  **Session Start**: User sends a message in a Telegram/Signal group.
2.  **Hook Trigger**: The `project-context` hook fires.
3.  **Parsing**: The hook extracts the Channel & Group ID from the `sessionKey`.
    *   *Raw Key*: `agent:main:telegram:group:-100123456789:123`
    *   *Parsed Key*: `telegram:-100123456789` (Topic ID is ignored for global project context).
4.  **Lookup**: Checks `projects.json` for the *Parsed Key*.
5.  **Injection**:
    *   If a match is found, reads `projects/<project>/README.md`.
    *   Prepends content to System Prompt.
5.  **Result**: The Agent knows it is the "Lead Developer" (Layer 1) working on "Mobile App X" (Layer 2).

### Addressing Known Gaps
*   **Multi-Agent Coordination**: Agents coordinate via "Shared State" in `task.md`. Delegation happens by tagging (e.g., `@qa_lead`) in chat, not direct API calls.
*   **Concurrency**: To prevent race conditions in `task.md`, agents must follow a "Read-Lock-Write" pattern (read latest state immediately before writing).

---

## 3. Configuration

### `projects.json` (Routing Table)
Located in the workspace root (`~/clawd/projects.json`).
Maps Chat IDs to Project Directories.

```json
{
  "telegram:-100123456789": "projects/mobile-app",
  "telegram:-100987654321": "projects/web-dashboard",
  "signal:+1234567890": "projects/secret-ops"
}
```

### Directory Structure
```text
~/clawd/
├── BOOTSTRAP.md          <-- Layer 1 Entry Point
├── projects.json         <-- Routing Table
├── hooks/
│   └── project-context/
│       ├── HOOK.md       <-- Hook Definition
│       └── handler.ts    <-- Logic Script
├── docs/
│   └── team/             <-- Layer 1 Content
└── projects/             <-- Layer 2 Content
    ├── mobile-app/
    │   ├── README.md     <-- Mobile App Context
    │   └── tasks.md
    └── web-dashboard/
        ├── README.md
        └── tasks.md
```

## 4. Hook Implementation Logic

The hook handler (`hooks/project-context/handler.ts`) performs the following logic:

```typescript
// Pseudo-code logic for hooks/project-context/handler.ts
import fs from 'fs';
import path from 'path';

export async function handleBeforeAgentStart(params, context) {
  try {
    const rawSessionKey = context.sessionKey; // e.g., "agent:main:telegram:group:-100..."
    if (!rawSessionKey) return;

    // 1. Parse Session Key
    // Format: "agent:<agentId>:<channel>:<type>:<chatId>[:<topicId>]"
    const parts = rawSessionKey.split(':');
    if (parts.length < 5) return; // Invalid format
    
    const channel = parts[2]; // telegram
    const chatId = parts[4];  // -100123456789
    // We ignore parts[5] (topicId) to apply project context to the whole group

    const lookupKey = `${channel}:${chatId}`;

    // 2. Load Routing Table (Cache this in production)
    const projectsPath = path.resolve('projects.json');
    if (!fs.existsSync(projectsPath)) return;
    
    const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
    
    // 3. Find Project
    const projectDir = projects[lookupKey];
    if (!projectDir) return; // No specific project for this chat
    
    // 4. Load Context
    const readmePath = path.resolve(projectDir, 'README.md');
    if (!fs.existsSync(readmePath)) return;

    const content = fs.readFileSync(readmePath, 'utf8');
    
    // 5. Inject
    return {
      prependContext: `\n\n=== 🚀 ACTIVE PROJECT CONTEXT ===\n${content}\n===============================\n`
    };
  } catch (err) {
    console.error(`[ProjectHook] Error injecting context: ${err.message}`);
    return; // Fail silently to avoid breaking the bot
  }
}
```
