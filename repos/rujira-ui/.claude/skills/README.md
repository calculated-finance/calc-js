# Skills

Skills are context-gathering agents. Claude Code invokes them automatically when their `description` matches the user's request or the current file context, or a user invokes them explicitly by name.

## Skills vs commands vs agents

| Location | Invocation | Used for |
|----------|------------|----------|
| `.claude/skills/<name>/SKILL.md` | Auto-routed by description, or by name | Context gathering, guardrails, conventions |
| `.claude/commands/<name>.md` | Explicit `/<name>` slash command | One-shot actions that produce an artifact (reports, regenerated types, builds) |
| `.claude/agents/<name>.md` | `subagent_type: <name>` | Specialised reviewers with scoped toolsets |

## Frontmatter

Every `SKILL.md` starts with YAML frontmatter:

```yaml
---
name: kebab-case-name
description: <when to invoke — the first sentence matters most for routing>
allowed-tools: [Read, Grep, Glob]
---
```

- `name` — must match the folder name.
- `description` — write as *"Use when …"*. For proactive skills, include a **TRIGGER when …** clause naming the file globs or APIs that should cause it to fire.
- `allowed-tools` — minimal set. Most read-only skills only need `Read`, `Grep`, `Glob`.

## Progressive disclosure

Keep `SKILL.md` short. Move long reference tables, matrices, or step-by-step recipes into sibling files (`reference.md`, `chains.md`, etc.) and link to them from `SKILL.md`. Claude loads the referenced file only when it needs it.

## Proactive vs user-invoked

- **Proactive** — describes conditions that should automatically surface the skill (e.g. "Use when editing `packages/rujira.js/src/signers/**`"). Be specific; broad descriptions cause mis-routing.
- **User-invoked** — describes a task the user asks for explicitly (e.g. "Use when the user asks to understand a feature end-to-end").

## Adding a new skill

1. Create `.claude/skills/<name>/SKILL.md` with frontmatter and body.
2. If the skill needs long reference material, create sibling files and link them.
3. Update `CLAUDE.md`'s *Skills & Task Routing* table.
4. Run `/ensure-huginn-structure` to verify the repo's CLAUDE.md still meets coverage rules.
