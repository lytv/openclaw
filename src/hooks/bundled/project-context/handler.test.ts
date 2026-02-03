import fs from "node:fs/promises";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AgentBootstrapHookContext } from "../../hooks.js";
import { makeTempWorkspace } from "../../../test-helpers/workspace.js";
import { createHookEvent } from "../../hooks.js";
import handler, { buildRoutingCandidates, extractRoutingKey } from "./handler.js";

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

let tempDir: string;

async function setupWorkspace(
  projects: Record<string, string>,
  readmes: Record<string, string> = {},
): Promise<void> {
  tempDir = await makeTempWorkspace("openclaw-project-context-");

  // Write projects.json
  await fs.writeFile(path.join(tempDir, "projects.json"), JSON.stringify(projects), "utf-8");

  // Write nested project README files
  for (const [relPath, content] of Object.entries(readmes)) {
    const full = path.join(tempDir, relPath);
    await fs.mkdir(path.dirname(full), { recursive: true });
    await fs.writeFile(full, content, "utf-8");
  }
}

function makeBootstrapEvent(sessionKey: string, workspaceDir: string) {
  const context: AgentBootstrapHookContext = {
    workspaceDir,
    bootstrapFiles: [],
    sessionKey,
  };
  return createHookEvent("agent", "bootstrap", sessionKey, context);
}

// ---------------------------------------------------------------------------
// unit tests for extractRoutingKey / buildRoutingCandidates
// ---------------------------------------------------------------------------

describe("extractRoutingKey", () => {
  it("extracts channel:chatId from a standard session key", () => {
    expect(extractRoutingKey("agent:main:telegram:user:-1005013557662")).toBe(
      "telegram:-1005013557662",
    );
  });

  it("strips :topic: suffix before parsing", () => {
    expect(extractRoutingKey("agent:main:telegram:user:-1005013557662:topic:99")).toBe(
      "telegram:-1005013557662",
    );
  });

  it("strips :thread: suffix before parsing", () => {
    expect(extractRoutingKey("agent:main:discord:channel:123456789:thread:42")).toBe(
      "discord:123456789",
    );
  });

  it("returns null when rest has fewer than 3 parts", () => {
    // "agent:main:main" → rest = "main" (1 part)
    expect(extractRoutingKey("agent:main:main")).toBeNull();
  });

  it("returns null for unparseable key", () => {
    expect(extractRoutingKey("")).toBeNull();
    expect(extractRoutingKey("garbage")).toBeNull();
  });
});

describe("buildRoutingCandidates", () => {
  it("returns single candidate for non-telegram channels", () => {
    expect(buildRoutingCandidates("discord:123456")).toEqual(["discord:123456"]);
  });

  it("expands supergroup ID to also include legacy", () => {
    expect(buildRoutingCandidates("telegram:-1005013557662")).toEqual([
      "telegram:-1005013557662",
      "telegram:-5013557662",
    ]);
  });

  it("expands legacy ID to also include supergroup", () => {
    expect(buildRoutingCandidates("telegram:-5013557662")).toEqual([
      "telegram:-5013557662",
      "telegram:-1005013557662",
    ]);
  });

  it("returns single candidate when chatId has no dash prefix", () => {
    // positive chat IDs (DMs) — no normalisation needed
    expect(buildRoutingCandidates("telegram:12345")).toEqual(["telegram:12345"]);
  });
});

// ---------------------------------------------------------------------------
// agent:bootstrap tests
// ---------------------------------------------------------------------------

describe("project-context hook — agent:bootstrap", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("happy path — injects PROJECT_CONTEXT.md with README content", async () => {
    await setupWorkspace(
      { "telegram:-1005013557662": "projects/demo-app" },
      { "projects/demo-app/README.md": "# Demo App\n\nThis is demo-app." },
    );

    const event = makeBootstrapEvent("agent:main:telegram:user:-1005013557662", tempDir);
    await handler(event);

    const ctx = event.context as AgentBootstrapHookContext;
    expect(ctx.bootstrapFiles).toHaveLength(1);
    expect(ctx.bootstrapFiles[0]?.name).toBe("PROJECT_CONTEXT.md");
    expect(ctx.bootstrapFiles[0]?.content).toBe("# Demo App\n\nThis is demo-app.");
    expect(ctx.bootstrapFiles[0]?.missing).toBe(false);
  });

  it("Telegram norm: legacy ID in session key, supergroup in table", async () => {
    await setupWorkspace(
      { "telegram:-1005013557662": "projects/demo-app" },
      { "projects/demo-app/README.md": "legacy-to-super" },
    );

    const event = makeBootstrapEvent("agent:main:telegram:user:-5013557662", tempDir);
    await handler(event);

    const ctx = event.context as AgentBootstrapHookContext;
    expect(ctx.bootstrapFiles).toHaveLength(1);
    expect(ctx.bootstrapFiles[0]?.content).toBe("legacy-to-super");
  });

  it("Telegram norm: supergroup ID in session key, legacy in table", async () => {
    await setupWorkspace(
      { "telegram:-5013557662": "projects/demo-app" },
      { "projects/demo-app/README.md": "super-to-legacy" },
    );

    const event = makeBootstrapEvent("agent:main:telegram:user:-1005013557662", tempDir);
    await handler(event);

    const ctx = event.context as AgentBootstrapHookContext;
    expect(ctx.bootstrapFiles).toHaveLength(1);
    expect(ctx.bootstrapFiles[0]?.content).toBe("super-to-legacy");
  });

  it("topic stripping: :topic:99 suffix, match without it", async () => {
    await setupWorkspace(
      { "telegram:-1005013557662": "projects/demo-app" },
      { "projects/demo-app/README.md": "topic-stripped" },
    );

    const event = makeBootstrapEvent("agent:main:telegram:user:-1005013557662:topic:99", tempDir);
    await handler(event);

    const ctx = event.context as AgentBootstrapHookContext;
    expect(ctx.bootstrapFiles).toHaveLength(1);
    expect(ctx.bootstrapFiles[0]?.content).toBe("topic-stripped");
  });

  it("Discord channel key: no normalization, straight match", async () => {
    await setupWorkspace(
      { "discord:123456789": "projects/api-server" },
      { "projects/api-server/README.md": "# API Server" },
    );

    const event = makeBootstrapEvent("agent:main:discord:channel:123456789", tempDir);
    await handler(event);

    const ctx = event.context as AgentBootstrapHookContext;
    expect(ctx.bootstrapFiles).toHaveLength(1);
    expect(ctx.bootstrapFiles[0]?.content).toBe("# API Server");
  });

  it("no projects.json → silent no-op, bootstrapFiles stays empty", async () => {
    tempDir = await makeTempWorkspace("openclaw-project-context-");
    // no projects.json written

    const event = makeBootstrapEvent("agent:main:telegram:user:-1005013557662", tempDir);
    await handler(event);

    const ctx = event.context as AgentBootstrapHookContext;
    expect(ctx.bootstrapFiles).toHaveLength(0);
  });

  it("no match in table → silent no-op", async () => {
    await setupWorkspace(
      { "telegram:-9999999999": "projects/other" },
      { "projects/other/README.md": "other" },
    );

    const event = makeBootstrapEvent("agent:main:telegram:user:-1005013557662", tempDir);
    await handler(event);

    const ctx = event.context as AgentBootstrapHookContext;
    expect(ctx.bootstrapFiles).toHaveLength(0);
  });

  it("README.md missing → warns, no injection", async () => {
    await setupWorkspace(
      { "telegram:-1005013557662": "projects/demo-app" },
      // no README written
    );

    const event = makeBootstrapEvent("agent:main:telegram:user:-1005013557662", tempDir);
    await handler(event);

    const ctx = event.context as AgentBootstrapHookContext;
    expect(ctx.bootstrapFiles).toHaveLength(0);
    expect(console.warn).toHaveBeenCalledWith(expect.stringMatching(/README.md not found/));
  });

  it("README.md empty (whitespace only) → warns, no injection", async () => {
    await setupWorkspace(
      { "telegram:-1005013557662": "projects/demo-app" },
      { "projects/demo-app/README.md": "   \n\t\n  " },
    );

    const event = makeBootstrapEvent("agent:main:telegram:user:-1005013557662", tempDir);
    await handler(event);

    const ctx = event.context as AgentBootstrapHookContext;
    expect(ctx.bootstrapFiles).toHaveLength(0);
    expect(console.warn).toHaveBeenCalledWith(expect.stringMatching(/README.md is empty/));
  });

  it("malformed projects.json → silent no-op", async () => {
    tempDir = await makeTempWorkspace("openclaw-project-context-");
    await fs.writeFile(path.join(tempDir, "projects.json"), "not valid json {{{", "utf-8");

    const event = makeBootstrapEvent("agent:main:telegram:user:-1005013557662", tempDir);
    await handler(event);

    const ctx = event.context as AgentBootstrapHookContext;
    expect(ctx.bootstrapFiles).toHaveLength(0);
  });

  it("session key too short (agent:main:main) → no-op", async () => {
    await setupWorkspace(
      { "telegram:-1005013557662": "projects/demo-app" },
      { "projects/demo-app/README.md": "should not appear" },
    );

    const event = makeBootstrapEvent("agent:main:main", tempDir);
    await handler(event);

    const ctx = event.context as AgentBootstrapHookContext;
    expect(ctx.bootstrapFiles).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// command:new tests
// ---------------------------------------------------------------------------

describe("project-context hook — command:new", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("happy path — message pushed with project basename", async () => {
    await setupWorkspace(
      { "telegram:-1005013557662": "projects/demo-app" },
      { "projects/demo-app/README.md": "content" },
    );

    const sessionKey = "agent:main:telegram:user:-1005013557662";
    const event = createHookEvent("command", "new", sessionKey, {
      workspaceDir: tempDir,
    });

    await handler(event);

    expect(event.messages).toContain("📂 Project context: demo-app");
  });

  it("no match → no message", async () => {
    await setupWorkspace(
      { "telegram:-9999999999": "projects/other" },
      { "projects/other/README.md": "other" },
    );

    const sessionKey = "agent:main:telegram:user:-1005013557662";
    const event = createHookEvent("command", "new", sessionKey, {
      workspaceDir: tempDir,
    });

    await handler(event);

    expect(event.messages).toHaveLength(0);
  });

  it("no projects.json → no message", async () => {
    tempDir = await makeTempWorkspace("openclaw-project-context-");

    const sessionKey = "agent:main:telegram:user:-1005013557662";
    const event = createHookEvent("command", "new", sessionKey, {
      workspaceDir: tempDir,
    });

    await handler(event);

    expect(event.messages).toHaveLength(0);
  });

  it("Telegram normalization works for command:new confirmation", async () => {
    // Table has legacy, session key is supergroup
    await setupWorkspace(
      { "telegram:-5013557662": "projects/api-server" },
      { "projects/api-server/README.md": "content" },
    );

    const sessionKey = "agent:main:telegram:user:-1005013557662";
    const event = createHookEvent("command", "new", sessionKey, {
      workspaceDir: tempDir,
    });

    await handler(event);

    expect(event.messages).toContain("📂 Project context: api-server");
  });
});

// ---------------------------------------------------------------------------
// other / edge cases
// ---------------------------------------------------------------------------

describe("project-context hook — other events", () => {
  it("unrelated event type (command:stop) → no-op, no messages", async () => {
    await setupWorkspace(
      { "telegram:-1005013557662": "projects/demo-app" },
      { "projects/demo-app/README.md": "content" },
    );

    const sessionKey = "agent:main:telegram:user:-1005013557662";
    const event = createHookEvent("command", "stop", sessionKey, {
      workspaceDir: tempDir,
    });

    await handler(event);

    expect(event.messages).toHaveLength(0);
  });
});
