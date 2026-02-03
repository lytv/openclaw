import fs from "node:fs/promises";
import path from "node:path";
import type { OpenClawConfig } from "../../../config/config.js";
import { resolveAgentWorkspaceDir } from "../../../agents/agent-scope.js";
import { resolveAgentIdFromSessionKey } from "../../../routing/session-key.js";
import {
  resolveThreadParentSessionKey,
  parseAgentSessionKey,
} from "../../../sessions/session-key-utils.js";
import { isAgentBootstrapEvent, type HookHandler } from "../../hooks.js";

/**
 * Extract a normalised routing key from a session key.
 * Format: "<channel>:<chatId>" (e.g. "telegram:-1005013557662")
 *
 * Strips :topic: / :thread: suffixes first, then parses the agent session key
 * to pull out the channel and chat-ID segments.
 */
export function extractRoutingKey(sessionKey: string): string | null {
  const base = resolveThreadParentSessionKey(sessionKey) ?? sessionKey;
  const parsed = parseAgentSessionKey(base);
  if (!parsed) {
    return null;
  }

  // rest = "channel:peerKind:chatId[:...]"
  const parts = parsed.rest.split(":");
  if (parts.length < 3) {
    return null;
  }

  const channel = parts[0];
  const chatId = parts[2];
  return `${channel}:${chatId}`;
}

/**
 * Given a routing key, return candidate keys to try against the projects table.
 * For Telegram, normalises between legacy and supergroup ID formats:
 *   legacy  → -XXXX      (no -100 prefix)
 *   super   → -100XXXX
 */
export function buildRoutingCandidates(routingKey: string): string[] {
  const colonIdx = routingKey.indexOf(":");
  if (colonIdx === -1) {
    return [routingKey];
  }

  const channel = routingKey.slice(0, colonIdx);
  const chatId = routingKey.slice(colonIdx + 1);

  if (channel !== "telegram") {
    return [routingKey];
  }

  // supergroup → also try legacy
  if (chatId.startsWith("-100")) {
    const legacy = "-" + chatId.slice(4);
    return [routingKey, `telegram:${legacy}`];
  }

  // legacy → also try supergroup
  if (chatId.startsWith("-")) {
    const supergroup = "-100" + chatId.slice(1);
    return [routingKey, `telegram:${supergroup}`];
  }

  return [routingKey];
}

/** Read and parse projects.json; returns null on any error. */
async function readProjectsTable(workspaceDir: string): Promise<Record<string, string> | null> {
  try {
    const raw = await fs.readFile(path.join(workspaceDir, "projects.json"), "utf-8");
    const table = JSON.parse(raw);
    if (table && typeof table === "object" && !Array.isArray(table)) {
      return table as Record<string, string>;
    }
    return null;
  } catch {
    return null;
  }
}

/** Resolve the first matching project directory from candidates, or null. */
function resolveProjectDir(table: Record<string, string>, candidates: string[]): string | null {
  for (const key of candidates) {
    const dir = table[key];
    if (typeof dir === "string" && dir.trim()) {
      return dir.trim();
    }
  }
  return null;
}

const projectContextHook: HookHandler = async (event) => {
  // --- agent:bootstrap branch ---
  if (isAgentBootstrapEvent(event)) {
    try {
      const context = event.context;
      const workspaceDir = context.workspaceDir;
      const sessionKey = context.sessionKey ?? event.sessionKey;

      const routingKey = extractRoutingKey(sessionKey);
      if (!routingKey) {
        return;
      }

      const table = await readProjectsTable(workspaceDir);
      if (!table) {
        return;
      }

      const projectDir = resolveProjectDir(table, buildRoutingCandidates(routingKey));
      if (!projectDir) {
        return;
      }

      const readmePath = path.join(workspaceDir, projectDir, "README.md");
      let content: string;
      try {
        content = await fs.readFile(readmePath, "utf-8");
      } catch {
        console.warn(`[project-context] README.md not found at ${readmePath}`);
        return;
      }

      if (!content.trim()) {
        console.warn(`[project-context] README.md is empty at ${readmePath}`);
        return;
      }

      context.bootstrapFiles = [
        ...context.bootstrapFiles,
        {
          name: "PROJECT_CONTEXT.md" as any,
          path: readmePath,
          content,
          missing: false,
        },
      ];
    } catch (err) {
      console.warn(
        "[project-context] bootstrap error:",
        err instanceof Error ? err.message : String(err),
      );
    }
    return;
  }

  // --- command:new branch ---
  if (event.type === "command" && event.action === "new") {
    try {
      const context = event.context || {};
      const cfg = context.cfg as OpenClawConfig | undefined;
      const agentId = resolveAgentIdFromSessionKey(event.sessionKey);

      const workspaceDir =
        typeof context.workspaceDir === "string"
          ? context.workspaceDir
          : cfg
            ? resolveAgentWorkspaceDir(cfg, agentId)
            : null;

      if (!workspaceDir) {
        return;
      }

      const routingKey = extractRoutingKey(event.sessionKey);
      if (!routingKey) {
        return;
      }

      const table = await readProjectsTable(workspaceDir);
      if (!table) {
        return;
      }

      const projectDir = resolveProjectDir(table, buildRoutingCandidates(routingKey));
      if (!projectDir) {
        return;
      }

      // Verify the README exists before confirming
      const readmePath = path.join(workspaceDir, projectDir, "README.md");
      try {
        await fs.access(readmePath);
      } catch {
        return;
      }

      event.messages.push(`📂 Project context: ${path.basename(projectDir)}`);
    } catch (err) {
      console.warn(
        "[project-context] command:new error:",
        err instanceof Error ? err.message : String(err),
      );
    }
    return;
  }
};

export default projectContextHook;
