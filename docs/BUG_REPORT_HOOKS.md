# Bug Report: Custom Hooks Not Loading in Gateway

**Date**: 2026-02-03
**Status**: Critical / Blocking
**Author**: Assistant (on behalf of User)

## 1. Issue Description
We are attempting to implement a **Dynamic Project Context** system using the OpenClaw Hook system (`before_agent_start`).
However, despite correct configuration and file placement, the Gateway **fails to load any custom hooks**.

## 2. Environment
- **Gateway Version**: `v2026.1.30` (Running via `launchctl`)
- **Runtime**: Node.js `v22.18.0`
- **Config File**: `~/.openclaw/openclaw.json`
- **Log File**: `~/.openclaw/logs/gateway.log`

## 3. Reproduction Steps & Artifacts

### 3.1 Hook created
We created a simple diagnostic hook (`id-logger`) to verify functionality.

**Location**: `~/.openclaw/hooks/id-logger/`
**File 1: HOOK.md**
```yaml
---
name: id-logger
description: Log session keys
events: [before_agent_start]
always: true
---
```
**File 2: handler.js**
```javascript
export async function handleBeforeAgentStart(params, context) {
  console.log('Session Key:', context.sessionKey);
}
```

### 3.2 Configuration Updated (`openclaw.json`)
We explicitly enabled the hook in `openclaw.json`:
```json
"hooks": {
  "internal": {
    "entries": {
      "id-logger": { "enabled": true },
      "project-context": { "enabled": true }
    }
  }
}
```

### 3.3 Logs Observed
After restarting the Gateway (`launchctl stop/start`), the logs consistently show:
```
[hooks] loaded 3 internal hook handlers  <-- Only loads bundled hooks (boot-md, etc.)
Registered hook: boot-md
Registered hook: command-logger
Registered hook: session-memory
```
**Result**: The custom hook `id-logger` IS NOT REGISTERED.

## 4. Troubleshooting Attempts (Failed)
1.  **Path Resolution**: Confirmed `~/.openclaw/hooks` exists and contains the files.
2.  **File Type**: Switched from TypeScript (`handler.ts`) to JavaScript (`handler.js`) to rule out runtime compilation issues.
3.  **Metadata**: Added `always: true` and `events: [...]` to `HOOK.md` to bypass conditional logic.
4.  **Workspaces**: Tried placing hooks in `~/clawd/hooks/` (Workspace) and `~/.openclaw/hooks/` (Managed). Neither worked.
5.  **Restart**: Verified process restart via PID change in logs.

## 5. Suspected Cause (For Developer)
The issue likely lies in `src/hooks/loader.ts` or `src/hooks/workspace.ts`.
- The `loadInternalHooks` function might NOT be scanning the `managedHooksDir` correctly in the production build.
- OR the `openclaw.json` configuration structure for **Managed Hooks** is different from **Internal Hooks**. We put the config under `hooks.internal.entries`, but maybe it needs to be elsewhere for external hooks.

## 6. Action Items
Please investigate why `loadWorkspaceHookEntries` returns 0 entries for the managed directory.
- Verify `CONFIG_DIR` resolution in `src/utils.ts`.
- Check if `launchd` environment variables are affecting path resolution (`HOME` is set correctly).

## 7. CRITICAL DEPLOYMENT NOTE (MUST READ)
**Changing source code in `~/tools/openclaw` WILL NOT fix this immediately.**

The `launchctl` service is running a **globally installed binary** located at:
`/Users/mac/.nvm/versions/node/v22.18.0/lib/node_modules/openclaw/dist/index.js`

To apply ANY fix to the Core Logic (`src/hooks/*.ts`):
1.  Verify/Fix the code in `~/tools/openclaw`.
2.  **Rebuild**: Run `npm run build` in `~/tools/openclaw`.
3.  **Reinstall**: Run `npm install -g .` (or equivalent) to update the global binary.
4.  **Restart**: Run `launchctl stop/start ai.openclaw.gateway`.

**Simply restarting the service without rebuilding/reinstalling will strictly continue running the OLD code.**
