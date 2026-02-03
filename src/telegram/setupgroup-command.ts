import type { Bot, Context } from "grammy";
import type { OpenClawConfig } from "../config/config.js";
import type { TelegramGroupConfig } from "../config/types.js";
import { readConfigFileSnapshot, writeConfigFile } from "../config/io.js";
import { withTelegramApiErrorLogging } from "./api-logging.js";

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
};

export type SetupGroupResult = {
  success: boolean;
  message: string;
};

/**
 * Handles the /setupgroup command which auto-configures the current group
 * in openclaw.json with requireMention: true.
 */
export async function handleSetupGroupCommand(
  params: SetupGroupCommandParams,
): Promise<SetupGroupResult> {
  const { bot, chatId, chatTitle, isForum, messageThreadId, configWritesEnabled } = params;

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

    const titleLabel = chatTitle ? ` "${chatTitle}"` : "";
    const forumNote = isForum ? " (forum detected)" : "";
    const message =
      `✓ Group${titleLabel} (${chatId}) configured.${forumNote}\n` +
      `• requireMention: true\n` +
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
