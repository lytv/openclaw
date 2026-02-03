import type { Bot, Context } from "grammy";
import fs from "node:fs/promises";
import path from "node:path";
import type { OpenClawConfig } from "../config/config.js";
import type { TelegramGroupConfig } from "../config/types.js";
import { resolveAgentWorkspaceDir } from "../agents/agent-scope.js";
import { readConfigFileSnapshot, writeConfigFile } from "../config/io.js";
import { resolveAgentRoute } from "../routing/resolve-route.js";
import { withTelegramApiErrorLogging } from "./api-logging.js";
import { buildTelegramGroupPeerId } from "./bot/helpers.js";

export type SetupGroupCommandParams = {
  bot: Bot;
  ctx: Context;
  chatId: number;
  chatTitle: string | undefined;
  isForum: boolean;
  senderId: string;
  senderUsername: string;
  messageThreadId?: number;
  configWritesEnabled: boolean;
  cfg: OpenClawConfig;
  accountId: string;
};

export type SetupGroupResult = {
  success: boolean;
  message: string;
};

/** Convert a group title to a URL-safe slug (e.g. "Demo Web App" → "demo-web-app"). */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

/** Read projects.json from workspaceDir; returns empty object on any error. */
export async function readProjectsTable(workspaceDir: string): Promise<Record<string, string>> {
  try {
    const raw = await fs.readFile(path.join(workspaceDir, "projects.json"), "utf-8");
    const table = JSON.parse(raw);
    if (table && typeof table === "object" && !Array.isArray(table)) {
      return table as Record<string, string>;
    }
  } catch {
    // file missing or unparseable — start fresh
  }
  return {};
}

/** Write projects.json with 2-space indentation. */
export async function writeProjectsTable(
  workspaceDir: string,
  table: Record<string, string>,
): Promise<void> {
  await fs.mkdir(workspaceDir, { recursive: true });
  await fs.writeFile(
    path.join(workspaceDir, "projects.json"),
    JSON.stringify(table, null, 2) + "\n",
    "utf-8",
  );
}

/**
 * Handles the /setupgroup command which auto-configures the current group
 * in openclaw.json with requireMention: true, and creates the matching
 * project mapping + folder in the agent workspace.
 */
export async function handleSetupGroupCommand(
  params: SetupGroupCommandParams,
): Promise<SetupGroupResult> {
  const { chatId, chatTitle, isForum, configWritesEnabled, cfg, accountId } = params;

  // Check if config writes are enabled for this account
  if (!configWritesEnabled) {
    return {
      success: false,
      message: "Config writes are disabled for this Telegram account.",
    };
  }

  try {
    // Read current config
    const snapshot = await readConfigFileSnapshot();
    if (!snapshot.valid) {
      return {
        success: false,
        message: `Config is invalid: ${snapshot.issues[0]?.message ?? "unknown error"}`,
      };
    }

    const config: OpenClawConfig = { ...snapshot.config };

    // Ensure channels.telegram.groups exists
    if (!config.channels) {
      config.channels = {};
    }
    if (!config.channels.telegram) {
      config.channels.telegram = {};
    }
    if (!config.channels.telegram.groups) {
      config.channels.telegram.groups = {};
    }

    const groupIdKey = String(chatId);
    const existingGroupConfig = config.channels.telegram.groups[groupIdKey];

    // Build new group config
    const newGroupConfig: TelegramGroupConfig = {
      ...existingGroupConfig,
      requireMention: true,
    };

    // Auto-detect forum/supergroup with topics
    if (isForum && !existingGroupConfig?.topics) {
      newGroupConfig.topics = {};
    }

    config.channels.telegram.groups[groupIdKey] = newGroupConfig;

    // Write updated config
    await writeConfigFile(config);

    // --- Project mapping: resolve workspace, update projects.json, scaffold folder ---
    const route = resolveAgentRoute({
      cfg,
      channel: "telegram",
      accountId,
      peer: { kind: "group", id: buildTelegramGroupPeerId(chatId) },
    });
    const workspaceDir = resolveAgentWorkspaceDir(cfg, route.agentId);
    const routingKey = `telegram:${chatId}`;
    const projectSlug = slugify(chatTitle || `group-${chatId}`);
    const projectDir = `projects/${projectSlug}`;

    const table = await readProjectsTable(workspaceDir);
    if (!table[routingKey]) {
      table[routingKey] = projectDir;
      await writeProjectsTable(workspaceDir, table);
    }

    // Scaffold project folder + default README if absent
    const fullProjectDir = path.join(workspaceDir, projectDir);
    await fs.mkdir(fullProjectDir, { recursive: true });
    const readmePath = path.join(fullProjectDir, "README.md");
    try {
      await fs.access(readmePath);
    } catch {
      const heading = chatTitle || `Group ${chatId}`;
      await fs.writeFile(
        readmePath,
        `# ${heading}\n\n## Project Context\n\nThis project was auto-created by /setupgroup.\n`,
        "utf-8",
      );
    }

    const titleLabel = chatTitle ? ` "${chatTitle}"` : "";
    const forumNote = isForum ? " (forum detected)" : "";
    const message =
      `✓ Group${titleLabel} (${chatId}) configured.${forumNote}\n` +
      `• requireMention: true\n` +
      `• Project: ${projectDir}\n` +
      `• Config saved to: ${snapshot.path}\n\n` +
      `The gateway will pick up changes automatically (within 200ms).`;

    return {
      success: true,
      message,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `Failed to update config: ${errorMessage}`,
    };
  }
}

/**
 * Sends the result of setupgroup command back to the chat.
 */
export async function sendSetupGroupResult(params: {
  bot: Bot;
  chatId: number;
  result: SetupGroupResult;
  messageThreadId?: number;
}): Promise<void> {
  const { bot, chatId, result, messageThreadId } = params;

  await withTelegramApiErrorLogging({
    operation: "sendMessage",
    fn: () =>
      bot.api.sendMessage(chatId, result.message, {
        ...(messageThreadId != null ? { message_thread_id: messageThreadId } : {}),
      }),
  });
}
