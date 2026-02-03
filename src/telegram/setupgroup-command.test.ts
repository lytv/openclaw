import path from "node:path";
import { describe, expect, it, vi, beforeEach } from "vitest";

// --- fs mock (repo pattern: vi.hoisted + default + named) ---
const fsMocks = vi.hoisted(() => ({
  readFile: vi.fn(),
  writeFile: vi.fn().mockResolvedValue(undefined),
  mkdir: vi.fn().mockResolvedValue(undefined),
  access: vi.fn(),
}));

vi.mock("node:fs/promises", () => ({
  default: fsMocks,
  readFile: fsMocks.readFile,
  writeFile: fsMocks.writeFile,
  mkdir: fsMocks.mkdir,
  access: fsMocks.access,
}));

vi.mock("../config/io.js", () => ({
  readConfigFileSnapshot: vi.fn(),
  writeConfigFile: vi.fn(),
}));

vi.mock("../routing/resolve-route.js", () => ({
  resolveAgentRoute: vi.fn(() => ({ agentId: "default", accountId: "1" })),
}));

vi.mock("../agents/agent-scope.js", () => ({
  resolveAgentWorkspaceDir: vi.fn(() => "/tmp/test-workspace"),
}));

vi.mock("./bot/helpers.js", () => ({
  buildTelegramGroupPeerId: vi.fn((chatId: number) => String(chatId)),
}));

import { readConfigFileSnapshot, writeConfigFile } from "../config/io.js";
import {
  handleSetupGroupCommand,
  slugify,
  readProjectsTable,
  writeProjectsTable,
} from "./setupgroup-command.js";

/** Shared valid-config snapshot factory. */
function validSnapshot(config = {}) {
  return {
    valid: true,
    issues: [],
    path: "/test/openclaw.json",
    exists: true,
    raw: "{}",
    parsed: {},
    config,
    hash: "abc",
    warnings: [],
    legacyIssues: [],
  };
}

/** Base params shared across every test. */
function baseParams(overrides: Partial<Parameters<typeof handleSetupGroupCommand>[0]> = {}) {
  return {
    bot: { api: { sendMessage: vi.fn() } } as unknown as Parameters<
      typeof handleSetupGroupCommand
    >[0]["bot"],
    ctx: {} as Parameters<typeof handleSetupGroupCommand>[0]["ctx"],
    chatId: -1001234567890,
    chatTitle: "Test Group",
    isForum: false,
    senderId: "123",
    senderUsername: "testuser",
    configWritesEnabled: true,
    cfg: {},
    accountId: "1",
    ...overrides,
  };
}

describe("slugify", () => {
  it("lowercases and replaces spaces with hyphens", () => {
    expect(slugify("Demo Web App")).toBe("demo-web-app");
  });

  it("strips special characters", () => {
    expect(slugify("My Group! @#$%")).toBe("my-group");
  });

  it("collapses multiple hyphens", () => {
    expect(slugify("a - - b")).toBe("a-b");
  });

  it("handles underscores as separators", () => {
    expect(slugify("hello_world test")).toBe("hello-world-test");
  });
});

describe("readProjectsTable", () => {
  beforeEach(() => {
    fsMocks.readFile.mockReset();
  });

  it("returns parsed object when file is valid JSON", async () => {
    fsMocks.readFile.mockResolvedValueOnce(JSON.stringify({ "telegram:-100123": "projects/foo" }));
    const table = await readProjectsTable("/workspace");
    expect(table).toEqual({ "telegram:-100123": "projects/foo" });
  });

  it("returns empty object when file is missing", async () => {
    fsMocks.readFile.mockRejectedValueOnce(new Error("ENOENT"));
    const table = await readProjectsTable("/workspace");
    expect(table).toEqual({});
  });

  it("returns empty object when JSON is an array", async () => {
    fsMocks.readFile.mockResolvedValueOnce("[]");
    const table = await readProjectsTable("/workspace");
    expect(table).toEqual({});
  });

  it("returns empty object when JSON is malformed", async () => {
    fsMocks.readFile.mockResolvedValueOnce("not json");
    const table = await readProjectsTable("/workspace");
    expect(table).toEqual({});
  });
});

describe("writeProjectsTable", () => {
  beforeEach(() => {
    fsMocks.mkdir.mockReset();
    fsMocks.writeFile.mockReset();
  });

  it("creates workspaceDir and writes formatted JSON", async () => {
    const table = { "telegram:-100123": "projects/foo" };
    await writeProjectsTable("/workspace", table);
    expect(fsMocks.mkdir).toHaveBeenCalledWith("/workspace", { recursive: true });
    expect(fsMocks.writeFile).toHaveBeenCalledWith(
      path.join("/workspace", "projects.json"),
      JSON.stringify(table, null, 2) + "\n",
      "utf-8",
    );
  });
});

describe("handleSetupGroupCommand", () => {
  beforeEach(() => {
    vi.mocked(readConfigFileSnapshot).mockReset();
    vi.mocked(writeConfigFile).mockReset();
    fsMocks.readFile.mockReset();
    fsMocks.writeFile.mockReset();
    fsMocks.mkdir.mockReset();
    fsMocks.access.mockReset();
  });

  it("returns error when config writes are disabled", async () => {
    const result = await handleSetupGroupCommand(baseParams({ configWritesEnabled: false }));
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

    const result = await handleSetupGroupCommand(baseParams());
    expect(result.success).toBe(false);
    expect(result.message).toContain("Config is invalid");
  });

  it("creates group config with requireMention when group does not exist", async () => {
    vi.mocked(readConfigFileSnapshot).mockResolvedValueOnce(validSnapshot());
    vi.mocked(writeConfigFile).mockResolvedValueOnce(undefined);
    fsMocks.readFile.mockRejectedValueOnce(new Error("ENOENT"));
    fsMocks.access.mockRejectedValueOnce(new Error("ENOENT"));

    const result = await handleSetupGroupCommand(baseParams());

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
    vi.mocked(readConfigFileSnapshot).mockResolvedValueOnce(
      validSnapshot({
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
      }),
    );
    vi.mocked(writeConfigFile).mockResolvedValueOnce(undefined);
    fsMocks.readFile.mockRejectedValueOnce(new Error("ENOENT"));
    fsMocks.access.mockRejectedValueOnce(new Error("ENOENT"));

    const result = await handleSetupGroupCommand(baseParams());

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
    vi.mocked(readConfigFileSnapshot).mockResolvedValueOnce(validSnapshot());
    vi.mocked(writeConfigFile).mockResolvedValueOnce(undefined);
    fsMocks.readFile.mockRejectedValueOnce(new Error("ENOENT"));
    fsMocks.access.mockRejectedValueOnce(new Error("ENOENT"));

    const result = await handleSetupGroupCommand(
      baseParams({ isForum: true, chatTitle: "Forum Group" }),
    );

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

  // --- Project mapping tests ---

  it("creates projects.json with routing key when file does not exist", async () => {
    vi.mocked(readConfigFileSnapshot).mockResolvedValueOnce(validSnapshot());
    vi.mocked(writeConfigFile).mockResolvedValueOnce(undefined);
    fsMocks.readFile.mockRejectedValueOnce(new Error("ENOENT"));
    fsMocks.access.mockRejectedValueOnce(new Error("ENOENT"));

    const result = await handleSetupGroupCommand(baseParams({ chatTitle: "My Project" }));

    expect(result.success).toBe(true);
    expect(result.message).toContain("projects/my-project");
    expect(fsMocks.writeFile).toHaveBeenCalledWith(
      path.join("/tmp/test-workspace", "projects.json"),
      expect.stringContaining('"telegram:-1001234567890": "projects/my-project"'),
      "utf-8",
    );
  });

  it("does not overwrite existing mapping in projects.json", async () => {
    vi.mocked(readConfigFileSnapshot).mockResolvedValueOnce(validSnapshot());
    vi.mocked(writeConfigFile).mockResolvedValueOnce(undefined);
    // projects.json already has this key mapped elsewhere
    fsMocks.readFile.mockResolvedValueOnce(
      JSON.stringify({ "telegram:-1001234567890": "projects/existing-slug" }),
    );
    // README already exists
    fsMocks.access.mockResolvedValueOnce(undefined);

    const result = await handleSetupGroupCommand(baseParams({ chatTitle: "New Title" }));

    expect(result.success).toBe(true);
    // writeFile should NOT have been called at all (no projects.json write, no README write)
    expect(fsMocks.writeFile).not.toHaveBeenCalled();
  });

  it("creates project folder via mkdir", async () => {
    vi.mocked(readConfigFileSnapshot).mockResolvedValueOnce(validSnapshot());
    vi.mocked(writeConfigFile).mockResolvedValueOnce(undefined);
    fsMocks.readFile.mockRejectedValueOnce(new Error("ENOENT"));
    fsMocks.access.mockRejectedValueOnce(new Error("ENOENT"));

    await handleSetupGroupCommand(baseParams({ chatTitle: "Alpha" }));

    expect(fsMocks.mkdir).toHaveBeenCalledWith(
      path.join("/tmp/test-workspace", "projects", "alpha"),
      { recursive: true },
    );
  });

  it("creates README.md with default content when absent", async () => {
    vi.mocked(readConfigFileSnapshot).mockResolvedValueOnce(validSnapshot());
    vi.mocked(writeConfigFile).mockResolvedValueOnce(undefined);
    fsMocks.readFile.mockRejectedValueOnce(new Error("ENOENT"));
    fsMocks.access.mockRejectedValueOnce(new Error("ENOENT"));

    await handleSetupGroupCommand(baseParams({ chatTitle: "Beta Group" }));

    expect(fsMocks.writeFile).toHaveBeenCalledWith(
      path.join("/tmp/test-workspace", "projects", "beta-group", "README.md"),
      expect.stringContaining("# Beta Group"),
      "utf-8",
    );
    expect(fsMocks.writeFile).toHaveBeenCalledWith(
      path.join("/tmp/test-workspace", "projects", "beta-group", "README.md"),
      expect.stringContaining("auto-created by /setupgroup"),
      "utf-8",
    );
  });

  it("does not overwrite existing README.md", async () => {
    vi.mocked(readConfigFileSnapshot).mockResolvedValueOnce(validSnapshot());
    vi.mocked(writeConfigFile).mockResolvedValueOnce(undefined);
    // projects.json missing → new mapping will be written
    fsMocks.readFile.mockRejectedValueOnce(new Error("ENOENT"));
    // README already exists
    fsMocks.access.mockResolvedValueOnce(undefined);

    await handleSetupGroupCommand(baseParams({ chatTitle: "Gamma" }));

    // writeFile called only for projects.json, NOT for README
    const readmePath = path.join("/tmp/test-workspace", "projects", "gamma", "README.md");
    const readmeWrites = fsMocks.writeFile.mock.calls.filter(
      (args: unknown[]) => args[0] === readmePath,
    );
    expect(readmeWrites).toHaveLength(0);
  });

  it("falls back to group-<chatId> slug when chatTitle is undefined", async () => {
    vi.mocked(readConfigFileSnapshot).mockResolvedValueOnce(validSnapshot());
    vi.mocked(writeConfigFile).mockResolvedValueOnce(undefined);
    fsMocks.readFile.mockRejectedValueOnce(new Error("ENOENT"));
    fsMocks.access.mockRejectedValueOnce(new Error("ENOENT"));

    const result = await handleSetupGroupCommand(baseParams({ chatTitle: undefined }));

    expect(result.success).toBe(true);
    // slugify collapses "group--1001234567890" → "group-1001234567890"
    expect(result.message).toContain("projects/group-1001234567890");
    // README heading uses the raw fallback (before slugify)
    expect(fsMocks.writeFile).toHaveBeenCalledWith(
      expect.stringContaining("README.md"),
      expect.stringContaining("# Group -1001234567890"),
      "utf-8",
    );
  });

  it("handles unparseable projects.json gracefully (treats as empty)", async () => {
    vi.mocked(readConfigFileSnapshot).mockResolvedValueOnce(validSnapshot());
    vi.mocked(writeConfigFile).mockResolvedValueOnce(undefined);
    // Malformed JSON
    fsMocks.readFile.mockResolvedValueOnce("{ bad json");
    fsMocks.access.mockRejectedValueOnce(new Error("ENOENT"));

    const result = await handleSetupGroupCommand(baseParams({ chatTitle: "Recovery" }));

    expect(result.success).toBe(true);
    // Should have written a fresh projects.json
    expect(fsMocks.writeFile).toHaveBeenCalledWith(
      path.join("/tmp/test-workspace", "projects.json"),
      expect.stringContaining('"telegram:-1001234567890"'),
      "utf-8",
    );
  });
});
