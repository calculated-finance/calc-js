---
name: ensure-huginn-structure
description: Audit and update CLAUDE.md to meet Huginn agent integration requirements.
---

Audit the project's `CLAUDE.md` against the Huginn agent requirements and add any missing sections. This command is generic and works with any repo.

## Huginn CLAUDE.md Requirements Reference

Below is the full specification of what Huginn expects. Use this as the checklist.

### Required Sections

**Build and Test Commands** — Without this, Huginn guesses commands and wastes iterations.

```markdown
## Build and Test Commands

# How to run the full test suite
<test command>

# How to run the linter
<lint command>

# How to run a single test (useful for CI fix iterations)
<single test command pattern>
```

### Recommended Sections

**Project Overview** — Brief description of what this project is, its domain, and key architectural decisions. This is what Claude uses as "project context" during code review and implementation.

**Code Style & Conventions** — Language version, formatting rules, naming conventions, import ordering. Anything a new contributor would need to know.

**Architecture** — Key components, module boundaries, data flow. Helps Claude understand where changes should go and what might be affected.

### Optional Sections

**Quality Gates** — List of checks to run after making changes. Huginn's prompt says "run quality checks as described in CLAUDE.md" — this section tells it exactly which ones.

```markdown
## Quality Gates

After making changes, run these checks:
1. `<test command>` -- unit and integration tests
2. `<lint command>` -- linter
3. `/review` -- built-in Claude code review
4. `/code-audit` -- built-in Claude security scan
5. `/<custom-skill>` -- project-specific validation
```

**Review Focus Areas** — Domain-specific concerns for code review. Examples:

- Blockchain: state mutations, consensus-breaking changes, determinism
- Financial: decimal precision, transaction atomicity, audit trails
- Real-time: latency, lock ordering, backpressure

```markdown
## Review Focus Areas

When reviewing code changes, pay special attention to:
- <domain-specific concern 1>
- <domain-specific concern 2>
- <domain-specific concern 3>
```

**Fixture Regeneration** — If the project uses regression/fixture/snapshot tests:

```markdown
## Fixture Regeneration

To update regression test fixtures after intentional changes:
<regeneration command>

Fixture files location: <path>
```

---

## Workflow

### Phase 1: Read and Audit

1. Read the current `CLAUDE.md` file in the project root.
2. If no `CLAUDE.md` exists, note that one must be created from scratch.
3. Parse all existing `## ` heading sections and list them.

### Phase 2: Auto-Discover Quality Gates, Skills, and Docs

1. Scan `.claude/commands/` for all `.md` files — read each file's frontmatter to get the `name` and `description`.
2. Scan `.claude/agents/` for all `.md` files — read each file's frontmatter to get the `name` and `description`.
3. Scan `.claude/skills/` for all `.md` files — read each file's frontmatter to get the `name` and `description`.
4. Build a list of available slash commands (`/<name> -- <description>`).
5. Always include the built-in commands: `/review` (code review) and `/code-audit` (security scan).
6. Scan `docs/` for architecture-relevant files (`ARCHITECTURE.md`, `GETTING_STARTED.md`, etc.).
7. Build a **topic coverage map** — for each Huginn section, record which sources already cover it:
   - `CLAUDE.md` inline section (full or stub)
   - Skill (by name and path)
   - Docs file (by path)

   Use this mapping to determine coverage:

   | Huginn Section           | Satisfying Skills              | Satisfying Docs                                     |
   |--------------------------|--------------------------------|-----------------------------------------------------|
   | Architecture             | `architecture`                 | `docs/ARCHITECTURE.md`, `docs/WORKSPACE_GRAPH.md`   |
   | Review Focus Areas       | `review-checklist`             | —                                                   |
   | Project Overview         | —                              | `README.md`                                         |
   | Code Style & Conventions | `contract-authoring` (partial) | —                                                   |

### Phase 3: Gap Analysis

Compare the current `CLAUDE.md` against the requirements. Print a table like:

```
| Section                  | Priority    | Status    | Covered By                              | Notes                        |
|--------------------------|-------------|-----------|-----------------------------------------|------------------------------|
| Build and Test Commands  | Required    | ✅/❌     | CLAUDE.md                               | <what's present or missing>  |
| Project Overview         | Recommended | ✅/❌     | CLAUDE.md                               | ...                          |
| Code Style & Conventions | Recommended | ✅/❌     | CLAUDE.md                               | ...                          |
| Architecture             | Recommended | ✅/🔗/❌ | skill:architecture, docs/ARCHITECTURE.. | ...                          |
| Quality Gates            | Optional    | ✅/❌     | CLAUDE.md                               | ...                          |
| Review Focus Areas       | Optional    | ✅/🔗/❌ | skill:review-checklist                  | ...                          |
| Fixture Regeneration     | Optional    | ✅/⏭️     | —                                       | ...                          |
```

Status key: ✅ = fully satisfied, 🔗 = stub with skill/doc pointer, ❌ = missing, ⏭️ = skipped (not applicable).

**Status determination rules:**
- **Full inline section in CLAUDE.md** → ✅ fully satisfied
- **Stub in CLAUDE.md (heading + summary + skill/doc pointer)** → 🔗 fully satisfied
- **Skill or doc exists but no CLAUDE.md mention** → partially satisfied (needs stub)
- **Nothing** → ❌ missing (needs full section or stub)

Section matching should be fuzzy — a section called "Development Commands" satisfies "Build and Test Commands" if it contains test and lint commands. A section called "Monorepo Structure" or "Key Patterns" may partially satisfy "Architecture". A stub section containing a `> **Deep dive:**` or `> **Full checklist:**` blockquote pointer to a skill or doc counts as fully satisfied.

### Phase 4: Add Missing Sections

**Stub-with-reference rule**: When a section is missing from CLAUDE.md but a skill or docs file covers the topic, do NOT generate a full inline section. Instead, generate a **stub** consisting of:
1. The `## Section Name` heading
2. A 1-3 sentence summary derived from the skill/doc (enough for Huginn routing)
3. A blockquote pointer: `> **Deep dive:** use the \`<skill-name>\` skill` or `> **Details:** see \`<docs-path>\``

This prevents content duplication between CLAUDE.md and skills/docs.

For each missing section, derive appropriate content from the codebase:

1. **Build and Test Commands** (if missing):
   - Look for `Makefile`, `mix.exs`, `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`, etc.
   - Extract test, lint, and single-test commands.
   - If unsure, ask the user.

2. **Project Overview** (if missing):
   - Read `README.md` or project config files for a description.
   - Write a concise 2-3 sentence overview.

3. **Code Style & Conventions** (if missing):
   - Check for `CONVENTIONS.md`, `.formatter.exs`, `.prettierrc`, `.eslintrc`, `rustfmt.toml`, `.editorconfig`, etc.
   - Note the language version from build configs.
   - Summarize formatting and convention rules.

4. **Architecture** (if missing):
   - Check if an `architecture` agent exists in `.claude/agents/`.
   - Check if `docs/ARCHITECTURE.md` or `docs/WORKSPACE_GRAPH.md` exist.
   - If either source exists, generate a **stub** (2-3 sentence summary + blockquote pointer to the skill and/or doc). Do NOT enumerate full directory structure inline.
   - Only generate a full inline section if no skill and no docs file covers architecture.

5. **Quality Gates** (if missing):
   - Use the auto-discovered commands/skills from Phase 2.
   - Include test and lint commands from Phase 4.1.
   - Format as a numbered checklist.

6. **Review Focus Areas** (if missing):
   - Check if a `review-checklist` agent exists in `.claude/agents/`.
   - If the agent exists, generate a **stub** (1 sentence listing key concern keywords + blockquote pointer to the agent). Do NOT duplicate the full checklist.
   - Only generate a full inline section if no agent covers review concerns.
   - If generating a full section, determine the project's domain from the overview and codebase, then write 3-5 domain-appropriate review concerns.

7. **Fixture Regeneration** (if missing):
   - Search for fixture/snapshot directories (`test/fixtures`, `test/snapshots`, `test/regression`, etc.).
   - Search for regeneration commands in Makefile or scripts.
   - Only add this section if fixtures/snapshots are actually used.
   - If no fixtures found, skip this section entirely.

**Rules for editing:**
- Append new sections at the end of `CLAUDE.md`, before any trailing newlines.
- Never remove, reorder, or rewrite existing sections.
- If an existing section partially covers a requirement, add a subsection or supplement it rather than duplicating.
- Keep content concise — Huginn works better with scannable docs.
- **Never duplicate skill content.** If a skill or docs file covers a topic in detail, the CLAUDE.md section for that topic must be a stub with a pointer, not a full reproduction of the content.
- **Check for existing stubs.** A section that contains a skill/doc pointer (e.g., `> **Deep dive:** use the \`architecture\` skill`) is complete — do not expand it.
- **Preserve task routing table.** If CLAUDE.md has a "Task Routing" section that dispatches to skills, treat skill references there as partial coverage for the corresponding Huginn sections.

### Phase 5: Summary

Print a summary of all changes made:

```
## Changes Made

- ✅ Added "Build and Test Commands" section
- ✅ Added "Quality Gates" section with 6 discovered commands
- 🔗 Added "Architecture" stub — covered by skill:architecture + docs/ARCHITECTURE.md
- 🔗 Added "Review Focus Areas" stub — covered by skill:review-checklist
- ⏭️ Skipped "Fixture Regeneration" — no fixtures detected
- ℹ️ "Architecture" already covered by existing sections
```

### Phase 6: Next Steps

After the summary, evaluate whether CLAUDE.md would benefit from restructuring. Only suggest a refactor if at least one of these signals is present:

- **Size**: CLAUDE.md exceeds ~120 lines
- **Duplication**: inline content repeats what a skill or docs file already covers in detail
- **Density**: a section has more than ~15 lines of prose that could be a stub-with-pointer instead
- **Ordering**: sections important to Huginn (Build & Test, Quality Gates) are buried below less critical content

If any signals are present, print a section like:

```
## Suggested Next Steps

CLAUDE.md is [N] lines. Consider these improvements:

1. **Extract [section]** → move detail into `docs/[file].md` or a skill, replace with stub
2. **Promote [section]** → move higher in the file so Huginn finds it earlier
3. **Condense [section]** → [specific suggestion, e.g. "inline code block has 6 commands, 3 are in the justfile — reference justfile instead"]
```

Keep suggestions to 3-5 concrete items. Each must name the section, the action, and why.

If no signals are present, print:

```
## Next Steps

CLAUDE.md is [N] lines and well-structured — no refactoring needed.
```

## Important Notes

- This command is **additive only** — it never removes or restructures existing `CLAUDE.md` content.
- Section names in `CLAUDE.md` don't need to match the Huginn spec exactly — semantic equivalence is fine.
- If the project has no `CLAUDE.md`, create one following the "Minimal Viable CLAUDE.md" structure first, then add recommended sections.
- When in doubt about a section's content, ask the user rather than guessing.
