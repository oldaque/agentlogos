# AgentLogos 🤖

AgentLogos is a personal knowledge base and handbook for **AI Engineering**. It's built to be a fast, minimal, and premium documentation site where notes can be added with zero friction.

## 🚀 Overview

- **Default Dark Mode**: Premium look out of the box.
- **Dynamic Navigation**: Sidebar is automatically built from Markdown frontmatter.
- **Frictionless Workflow**: Note-taking is separated from code logic.

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev) + [Vite](https://vitejs.dev)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) + [Shadcn UI](https://ui.shadcn.com)
- **Markdown**: `react-markdown` with GFM support and `@tailwindcss/typography`.
- **Package Manager**: [Bun](https://bun.sh)

## 📝 Frictionless Documentation Workflow

The project uses a root `/docs` folder as the source of truth.

### 1. Create a Note
Add a `.md` file to the root `docs/` directory.

### 2. Tag it
Add frontmatter tags to guide the navigation:

```yaml
---
title: My New Note
description: Brief summary.
date: 2026-02-09
section_top_parent: AI Engineering
section_parent: Agents in Production
---
```

### 3. Run
```bash
bun run dev
```
The system will:
1. Sync `docs/` -> `src/content/docs`.
2. Parse all tags.
3. Automatically update the Sidebar and render the page.

---

## 🏃 Getting Started

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build
```