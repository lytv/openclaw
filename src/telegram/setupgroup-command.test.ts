import { describe, expect, it, vi } from "vitest";
import { handleSetupGroupCommand } from "./setupgroup-command.js";

vi.mock("../config/io.js", () => ({
  readConfigFileSnapshot: vi.fn(),
  writeConfigFile: vi.fn(),
}));

import { readConfigFileSnapshot, writeConfigFile } from "../config/io.js";

describe("handleSetupGroupCommand", () => {
  const mockBot = { api: { sendMessage: vi.fn() } } as unknown as Parameters<
    typeof handleSetupGroupCommand
  >[0]["bot"];
  const mockCtx = {} as Parameters<typeof handleSetupGroupCommand>[0]["ctx"];

  it("returns error when config writes are disabled", async () => {
    const result = await handleSetupGroupCommand({
      bot: mockBot,
      ctx: mockCtx,
      chatId: -1001234567890,
      chatTitle: "Test Group",
      isForum: false,
      senderId: "123",
      senderUsername: "testuser",
      configWritesEnabled: false,
    });

    expect(result.success).toBe(false);
    expect(result.message).toContain("Config writes are disabled");
  });

  it("returns error when config is invalid", async () => {
    vi.mocked(readConfigFileSnapshot).mockResolvedValueOnce({
      valid: false,
      issues: [{ path: "channels", message: "invalid structure" }],
      path: "/test/openclaw.json",
      exists: true,
      raw: "{}",
      parsed: {},
      config: {},
      hash: "abc",
      warnings: [],
      legacyIssues: [],
    });

    const result = await handleSetupGroupCommand({
      bot: mockBot,
      ctx: mockCtx,
      chatId: -1001234567890,
      chatTitle: "Test Group",
      isForum: false,
      senderId: "123",
      senderUsername: "testuser",
      configWritesEnabled: true,
    });

    expect(result.success).toBe(false);
    expect(result.message).toContain("Config is invalid");
  });

  it("creates group config with requireMention when group does not exist", async () => {
    vi.mocked(readConfigFileSnapshot).mockResolvedValueOnce({
      valid: true,
      issues: [],
      path: "/test/openclaw.json",
      exists: true,
      raw: "{}",
      parsed: {},
      config: {},
      hash: "abc",
      warnings: [],
      legacyIssues: [],
    });
    vi.mocked(writeConfigFile).mockResolvedValueOnce(undefined);

    const result = await handleSetupGroupCommand({
      bot: mockBot,
      ctx: mockCtx,
      chatId: -1001234567890,
      chatTitle: "Test Group",
      isForum: false,
      senderId: "123",
      senderUsername: "testuser",
      configWritesEnabled: true,
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("configured");
    expect(result.message).toContain("-1001234567890");
    expect(writeConfigFile).toHaveBeenCalledWith(
      expect.objectContaining({
        channels: {
          telegram: {
            groups: {
              "-1001234567890": { requireMention: true },
            },
          },
        },
      }),
    );
  });

  it("preserves existing group config and sets requireMention", async () => {
    vi.mocked(readConfigFileSnapshot).mockResolvedValueOnce({
      valid: true,
      issues: [],
      path: "/test/openclaw.json",
      exists: true,
      raw: "{}",
      parsed: {},
      config: {
        channels: {
          telegram: {
            groups: {
              "-1001234567890": {
                skills: ["search"],
                systemPrompt: "Be helpful",
              },
            },
          },
        },
      },
      hash: "abc",
      warnings: [],
      legacyIssues: [],
    });
    vi.mocked(writeConfigFile).mockResolvedValueOnce(undefined);

    const result = await handleSetupGroupCommand({
      bot: mockBot,
      ctx: mockCtx,
      chatId: -1001234567890,
      chatTitle: "Test Group",
      isForum: false,
      senderId: "123",
      senderUsername: "testuser",
      configWritesEnabled: true,
    });

    expect(result.success).toBe(true);
    expect(writeConfigFile).toHaveBeenCalledWith(
      expect.objectContaining({
        channels: {
          telegram: {
            groups: {
              "-1001234567890": {
                skills: ["search"],
                systemPrompt: "Be helpful",
                requireMention: true,
              },
            },
          },
        },
      }),
    );
  });

  it("auto-initializes topics object for forum supergroups", async () => {
    vi.mocked(readConfigFileSnapshot).mockResolvedValueOnce({
      valid: true,
      issues: [],
      path: "/test/openclaw.json",
      exists: true,
      raw: "{}",
      parsed: {},
      config: {},
      hash: "abc",
      warnings: [],
      legacyIssues: [],
    });
    vi.mocked(writeConfigFile).mockResolvedValueOnce(undefined);

    const result = await handleSetupGroupCommand({
      bot: mockBot,
      ctx: mockCtx,
      chatId: -1001234567890,
      chatTitle: "Forum Group",
      isForum: true,
      senderId: "123",
      senderUsername: "testuser",
      configWritesEnabled: true,
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("forum detected");
    expect(writeConfigFile).toHaveBeenCalledWith(
      expect.objectContaining({
        channels: {
          telegram: {
            groups: {
              "-1001234567890": {
                requireMention: true,
                topics: {},
              },
            },
          },
        },
      }),
    );
  });
});
