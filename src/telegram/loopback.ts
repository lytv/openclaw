import type { TelegramContext } from "./bot/types.js";

type ProcessMessageFn = (
  ctx: TelegramContext,
  allMedia: any[],
  storeAllowFrom: string[],
  options?: any,
) => Promise<void>;

type BotEntry = {
  accountId: string;
  me: {
    id: number;
    username?: string;
    first_name: string;
    last_name?: string;
    is_bot: boolean;
    has_topics_enabled: boolean;
  };
  processMessage: ProcessMessageFn;
};

const bots = new Map<string, BotEntry>();

/**
 * Register a Telegram bot's message processor for local loopback.
 * This allows bots on the same OpenClaw instance to "hear" each other.
 */
export function registerBot(
  accountId: string,
  me: BotEntry["me"],
  processMessage: ProcessMessageFn,
): void {
  if (!accountId || !me?.id) {
    return;
  }
  bots.set(accountId, { accountId, me, processMessage });
}

/**
 * Broadcast an outbound message from one bot as an inbound update to others.
 * This bypasses the Telegram Bot API limitation where bots cannot see each other in groups.
 */
export function broadcastInbound(params: {
  senderAccountId: string;
  senderMe: BotEntry["me"];
  chatId: number | string;
  messageId: number;
  text: string;
  messageThreadId?: number;
  replyToMessageId?: number;
}): void {
  const { senderAccountId, senderMe, chatId, messageId, text, messageThreadId, replyToMessageId } =
    params;

  const numericChatId = typeof chatId === "string" ? Number.parseInt(chatId, 10) : chatId;

  for (const [accountId, bot] of bots) {
    // Don't loop back to the sender
    if (accountId === senderAccountId) {
      continue;
    }

    // Synthesize a grammY-like context for the receiving bot
    const mockCtx = {
      me: bot.me,
      message: {
        message_id: messageId,
        from: {
          id: senderMe.id,
          is_bot: true,
          first_name: senderMe.first_name,
          last_name: senderMe.last_name,
          username: senderMe.username,
        },
        chat: {
          id: numericChatId,
          type: numericChatId < 0 ? "supergroup" : "private",
          title: numericChatId < 0 ? "Shared Group" : undefined,
          is_forum: numericChatId < 0,
        },
        date: Math.floor(Date.now() / 1000),
        text: text,
        message_thread_id: messageThreadId,
        reply_to_message: replyToMessageId
          ? {
              message_id: replyToMessageId,
              from: { id: bot.me.id, is_bot: true, first_name: bot.me.first_name },
            }
          : undefined,
      },
      getFile: async () => ({}),
    } as unknown as TelegramContext;

    // Trigger processing. forceWasMentioned is true to ensure the bot checks for tags
    // or responds if it's part of the conversation, effectively treating the loopback
    // message with high priority.
    void bot.processMessage(mockCtx, [], [], { forceWasMentioned: true });
  }
}
