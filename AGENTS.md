# Agent Instructions

This file contains instructions for AI agents (Claude, GPT, Cursor, etc.) to understand how this repository works and how to create notes correctly.

## Repository Structure

```
agentlogos/
├── docs/                    # Source of truth for all documentation
│   └── {section}/           # Subdirectories organize content
│       └── {note}.md        # Markdown files with frontmatter
├── src/
│   └── content/docs/        # Auto-synced from /docs (don't edit directly)
└── ...
```

## How It Works

1. All notes go in the `/docs` folder
2. Notes are organized in subdirectories by topic
3. Each note requires **frontmatter** with specific tags
4. The system automatically builds navigation from the frontmatter
5. Running `bun run dev` syncs `/docs` → `/src/content/docs` and starts the server

## Creating a New Note

### Step 1: Determine the location

Notes go in `/docs/{section}/{note-name}.md`

Examples:
- `/docs/getting_started/introduction.md`
- `/docs/prompting/chain-of-thought.md`
- `/docs/agents/tool-use.md`

### Step 2: Add the frontmatter

Every note **MUST** have this frontmatter at the top:

```yaml
---
title: Note Title Here
description: A brief one-line description of the content.
date: YYYY-MM-DD
section_top_parent: Section Name
section_parent: Section Name
---
```

### Frontmatter Rules

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Display title of the note |
| `description` | Yes | Brief summary (shown below title) |
| `date` | Yes | Creation/update date (YYYY-MM-DD) |
| `section_top_parent` | Yes | Top-level section in sidebar |
| `section_parent` | Yes | Parent section (can equal section_top_parent) |

### Navigation Logic

- If `section_top_parent == section_parent` → Note appears directly under the macro section
- If `section_top_parent != section_parent` → Note appears in a subsection
- If `filename == section_parent` (slugified) → Note becomes the section index

### Step 3: Write the content

After the frontmatter, write the content in Markdown. The first `# Heading` will be styled differently from the page title.

## Template

Use this template when creating new notes:

```markdown
---
title: {TITLE}
description: {BRIEF_DESCRIPTION}
date: {YYYY-MM-DD}
section_top_parent: {TOP_SECTION}
section_parent: {PARENT_SECTION}
---

# {MAIN_HEADING}

{CONTENT}

## {SUBHEADING}

{MORE_CONTENT}
```

## Examples

### Example 1: Direct child of a section

```markdown
---
title: Chain of Thought
description: Breaking down complex reasoning into steps.
date: 2026-02-09
section_top_parent: Prompting
section_parent: Prompting
---

# Chain of Thought Prompting

Content here...
```

Result: Appears under "Prompting" section in sidebar.

### Example 2: Note in a subsection

```markdown
---
title: ReAct Pattern
description: Combining reasoning and acting in agents.
date: 2026-02-09
section_top_parent: Agents
section_parent: Agent Patterns
---

# ReAct Pattern

Content here...
```

Result: Appears under "Agents" → "Agent Patterns" in sidebar.

### Example 3: Section index page

```markdown
---
title: Agents
description: Building autonomous AI systems.
date: 2026-02-09
section_top_parent: Agents
section_parent: Agents
---

# Welcome to Agents

This section covers...
```

Filename: `/docs/agents/agents.md`

Result: "Agents" section title becomes clickable, linking to this note.

## Quick Reference for Agents

When the user asks to create a note:

1. Ask for (or infer) the **topic/section** it belongs to
2. Create the file in `/docs/{section}/{slug}.md`
3. Generate frontmatter with today's date
4. Write the content in clean Markdown
5. Use descriptive headings and structure

**Do NOT:**
- Edit files in `/src/content/docs/` (they are auto-generated)
- Forget the frontmatter (the note won't appear in navigation)
- Use special characters in filenames (use kebab-case or snake_case)

## Supported Markdown Features

- GitHub Flavored Markdown (GFM)
- Code blocks with syntax highlighting
- Tables
- Task lists
- Blockquotes
- All standard Markdown formatting
