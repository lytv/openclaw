# Feature Specification: Automated Group ID Configuration

## Overview
Status: Draft
Owner: OpenClaw

This document outlines the implementation of a new Telegram command `/setupgroup` that automatically captures the current group ID and updates `openclaw.json` to whitelist the group and enable `requireMention`.

## Goal
Simplify the onboarding of new Telegram groups by allowing admins to configure the bot directly from the chat, eliminating the need to manually edit `openclaw.json`.

## Proposed Solution

### New Command: `/setupgroup`
A native Telegram command that:
1.  Verifies the user is authorized (based on `allowFrom` whitelist).
2.  Captures the current Group ID and Title.
3.  Reads the canonical `openclaw.json` configuration.
4.  Updates or adds an entry in `channels.telegram.groups` with `requireMention: true`.
5.  Writes the updated configuration back to disk.
6.  Replies with a confirmation message.

## Implementation Details

### 1. Data Definitions (`src/auto-reply/commands-registry.data.ts`)
-   **Key**: `setupgroup`
-   **Description**: "Auto-configure this group in OpenClaw."
-   **Category**: `management`

### 2. Command Handler (`src/telegram/bot-native-commands.ts`)
The handler will intercept the `setupgroup` command and perform the following logic:

```typescript
// Pseudo-code logic
if (command.name === "setupgroup") {
  // 1. Authorization Check
  // ... (reusing existing validation logic)

  // 2. Load Config
  const { config, configPath } = await readConfigFileSnapshot();

  // 3. Modfy Config
  if (!config.channels?.telegram?.groups) {
    // Initialize if missing
  }
  config.channels.telegram.groups[chatId] = {
    requireMention: true,
    // potentially auto-set topics enabled if supergroup
  };

  // 4. Save Config
  await writeConfigFile(config);

  // 5. Reply
  await bot.api.sendMessage(chatId, `Configuration updated for group ${chatId}. Restarting gateway...`);
  // Note: Gateway restart might be required for changes to take full effect depending on hot-reload capabilities.
}
```

## Security Considerations
-   **Restricted Access**: The command must ONLY be executable by users in the `allowFrom` list. It should not be open to any group member.
-   **Group Only**: This command is only relevant in Group/Supergroup contexts.

## Verification
1.  **Restart Gateway**.
2.  **Run Command**: Send `/setupgroup` in the target Telegram group.
3.  **Check Reply**: Bot should reply "Configuration updated...".
4.  **Check Config**: Verify `~/.openclaw/openclaw.json` contains the new group ID.
