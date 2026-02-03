# 🏢 Agent Team Operating System (SOP)

This folder contains the Standard Operating Procedures (SOPs) for the OpenClaw Agent Team.
These documents define how humans and agents (`main`, `devnam`, `qa_lead`) collaborate professionally.

## 📚 Core Documents

| Document | Purpose | Audience |
| :--- | :--- | :--- |
| **[ROLES.md](./ROLES.md)** | Defines responsibilities for PM, Dev, and QA agents. | All Agents |
| **[RULES.md](./RULES.md)** | Code standards, communication style, and behavior rules. | All Agents |
| **[PROCESS.md](./PROCESS.md)** | Workflows for tasks, bug reporting, and code reviews. | All Agents |
| **[BOOTSTRAP.md](./BOOTSTRAP.md)** | **System Entry Point**. This file is injected into every agent's context. | System |

## 🚀 deployment

To activate this system:
1. Review and edit the files in this directory to match your preferences.
2. Copy `docs/team/BOOTSTRAP.md` to the workspace root: `cp docs/team/BOOTSTRAP.md ./BOOTSTRAP.md`.
3. Restart the Gateway.
