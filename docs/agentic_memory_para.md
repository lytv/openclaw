# Agentic Personal Knowledge Management with OpenClaw, PARA, and QMD

> [!NOTE]
> This document captures the proposed architecture for a long-term memory system based on PARA, Atomic Facts, and QMD, along with the implementation plan.

## The Problem With AI Memory

Most AI assistants have the memory of a goldfish. Each conversation starts fresh. You repeat yourself constantly — who you work with, what you're building, how you like things done. Some platforms offer "memory" features, but they're shallow: a flat list of facts with no structure, no decay, no hierarchy.

If you're running a personal AI assistant — something that acts more like a chief of staff than a chatbot — you need real memory architecture. Not a bullet list. A system.

Here's the three-layer approach I've been using. It's built on Tiago Forte's PARA framework, extended with atomic facts, memory decay, and automated extraction.

## The Three Layers

The system separates memory into three distinct layers, each serving a different purpose:

1.  **Knowledge Graph** — Entities and facts about the world, stored as PARA directories with JSON files. Updated continuously as new information arrives.
2.  **Daily Notes** — A raw timeline of events in dated markdown files. Written every conversation.
3.  **Tacit Knowledge** — User patterns and preferences in a single markdown file. Updated only when new patterns emerge.

Think of it like human memory: the knowledge graph is your long-term declarative memory (facts you know), daily notes are your episodic memory (what happened when), and tacit knowledge is your procedural memory (how you operate).

### Layer 1: The Knowledge Graph (PARA)

The core of the system is a directory tree organized using Tiago Forte's PARA method:

```text
life/
├── projects/          # Active work with clear goals/deadlines
│   └── <name>/
│       ├── summary.md
│       └── items.json
├── areas/             # Ongoing responsibilities (no end date)
│   ├── people/<name>/
│   └── companies/<name>/
├── resources/         # Topics of interest, reference material
│   └── <topic>/
├── archives/          # Inactive items from the other three
├── index.md
└── README.md
```

**Why PARA?**
PARA gives you four buckets that cover everything:
-   **Projects** — Active work with a goal or deadline. A product launch, a writing project, a home renovation. When it's done, it moves to Archives.
-   **Areas** — Ongoing responsibilities with no end date. People you know, companies you work with, roles you hold. These persist.
-   **Resources** — Reference material and topics of interest. Things you might need later but aren't actively working on.
-   **Archives** — Inactive items from any of the above. Nothing gets deleted — just moved here when it's no longer active.

The key insight: every entity in your life fits in exactly one of these buckets, and entities naturally flow between them over time.

**Tiered Retrieval**
Each entity gets two files:
-   `summary.md` — A concise overview. This is what the agent loads first for quick context.
-   `items.json` — An array of atomic facts. Only loaded when the agent needs granular detail.

This two-tier approach keeps context windows lean. Most of the time, the summary is enough. The agent only dives into the full fact store when a conversation demands it.

**The Atomic Fact Schema**
Every fact in `items.json` follows a consistent schema:

```json
{
  "id": "entity-001",
  "fact": "Joined the company as CTO in March 2025",
  "category": "milestone",
  "timestamp": "2025-03-15",
  "source": "2025-03-15",
  "status": "active",
  "supersededBy": null,
  "relatedEntities": ["companies/acme", "people/jane"],
  "lastAccessed": "2026-01-28",
  "accessCount": 12
}
```

The important fields:
-   `category` — One of relationship, milestone, status, preference, or context. Helps with filtering and synthesis.
-   `status` — Either active or superseded. Facts are never deleted.
-   `supersededBy` — When a fact is outdated, it points to the fact that replaced it. This preserves history while keeping the active set clean.
-   `relatedEntities` — Cross-references to other entities in the graph. This is what makes it a graph rather than a collection of isolated notes.
-   `lastAccessed` / `accessCount` — Used for memory decay.

**The No-Deletion Rule**
This is critical: facts are never deleted. When something changes, the old fact is superseded and a new one is created. This means you always have a full history.

### Layer 2: Daily Notes

```text
memory/
├── 2026-01-28.md
├── 2026-01-29.md
├── 2026-01-30.md
└── 2026-01-31.md
```

Daily notes are the raw timeline — the "when" layer. They capture what happened in each conversation without worrying about structure or categorization. The agent writes to daily notes continuously during conversations.

During periodic extraction, durable facts get pulled out of daily notes and written into the knowledge graph. The daily notes themselves are retained as the source-of-truth timeline.

### Layer 3: Tacit Knowledge

The third layer is a single file that captures how the user operates — not facts about the world, but facts about the user:
-   Communication preferences (tools, formats, verbosity)
-   Working style patterns (how they brainstorm, make decisions, manage projects)
-   Tool preferences and workflows
-   Rules and boundaries the agent should follow

## Memory Decay

Recent and frequently-accessed information is more available than old, rarely-used facts.

**Access Tracking**
Every time a fact is used in a conversation — retrieved via search, referenced in a reply — two things happen:
1.  `accessCount` gets incremented
2.  `lastAccessed` gets set to today

**Recency Tiers**
During the weekly summary rewrite, facts are sorted into three tiers:
-   **Hot** (accessed in last 7 days) — Prominently included in `summary.md`.
-   **Warm** (accessed 8–30 days ago) — Still included in `summary.md`, but at lower priority.
-   **Cold** (not accessed in 30+ days) — Omitted from `summary.md` entirely.

## Automated Extraction: Heartbeats

The system uses a heartbeat process — a periodic background task that:
-   Scans recent conversations for new information
-   Extracts durable facts (relationships, status changes, milestones, decisions)
-   Writes those facts to the appropriate entity in the knowledge graph
-   Updates daily notes with timeline entries
-   Bumps access metadata on any facts that were referenced

## The Search Layer: QMD

QMD is a local indexing and retrieval tool that sits on top of the plain-file knowledge base. It indexes markdown files into a SQLite database and provides three search modes:
1.  Full-text search (BM25)
2.  Vector similarity search
3.  Combined query

**Collections**
QMD organizes files into collections that map directly to the three memory layers:
-   Life (Knowledge Graph)
-   Memory (Daily Notes)
-   Clawd (Agent workspace/Tacit knowledge)

---

# Implementation Plan

This plan implements the "Agentic Personal Knowledge Management" system described above, integrating it into OpenClaw.

## Proposed Changes

### Core Memory Logic

**[MODIFY] `src/memory/internal.ts`**
-   Update `isMemoryPath` to allow:
    -   `life/**` (Knowledge Graph)
    -   `clawd/**` (Tacit Knowledge / Agent Config)
-   Update `listMemoryFiles` to walk these new directories.

### New Skill: PARA Manager

**[NEW] `skills/para-manager/SKILL.md`**
-   Define the PARA methodology.
-   Instructions for creating `projects`, `areas`, `resources`, `archives`.
-   Schema definitions for `items.json` (Atomic Facts) and `summary.md`.
-   Instructions for "Heartbeat" extraction (manual trigger initially).

## Verification Plan

### Automated Tests
-   Create a new test file `src/memory/internal.para.test.ts` to verify `isMemoryPath` and `listMemoryFiles` correctly handle `life/` and `clawd/` paths.
-   Run `pnpm test src/memory/internal.para.test.ts`.

### Manual Verification
1.  **Scaffold**: Manually create `life/projects/example` in a test agent's workspace.
2.  **Index**: Run `openclaw gateway start` and verify logs show indexing of these files (or use a script to check DB).
3.  **Skill**: Start a session with the `para-manager` skill and ask the agent to:
    -   "Create a new project 'Website Redesign'."
    -   "Add a fact to 'Website Redesign'."
    -   "Search for 'Website Redesign' facts."
