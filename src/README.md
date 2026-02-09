# src/ — Technical Reference

This document explains how the TypeScript codebase works, from entry point to rendered page.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite 7 |
| Routing | React Router 7 (HashRouter) |
| Styling | Tailwind CSS v4 (OKLCH color space) |
| UI Primitives | Radix UI + shadcn/ui |
| Markdown | react-markdown + remark-gfm + rehype-highlight |
| Frontmatter | front-matter |
| Language | TypeScript 5.9 |
| Runtime | Bun |

## Data Flow

```
docs/ (source of truth)
  ↓  sync-docs.ts copies .md files
src/content/docs/
  ↓  import.meta.glob (Vite build-time)
docs-loader.ts → parses frontmatter → builds DocSection[]
  ↓
DocsSidebar.tsx (renders navigation)   DocPage.tsx (renders content)
  ↓                                      ↓
User clicks link → React Router → getDocBySlug() → react-markdown → HTML
```

## Directory Structure

```
src/
├── main.tsx               # ReactDOM entry point, renders <App /> in StrictMode
├── App.tsx                # HashRouter setup, ThemeProvider wrapper, route definitions
├── index.css              # Tailwind imports, OKLCH theme variables, font config
│
├── config/
│   └── docs.ts            # Type definitions: DocItem, DocSection
│
├── lib/
│   ├── docs-loader.ts     # Core: loads markdown, builds navigation tree
│   └── utils.ts           # cn() helper (clsx + tailwind-merge)
│
├── layouts/
│   └── DocsLayout.tsx     # App shell: header, sidebar, content area
│
├── pages/
│   └── DocPage.tsx        # Markdown renderer with breadcrumbs
│
├── components/
│   ├── DocsSidebar.tsx    # Collapsible 3-level sidebar navigation
│   ├── theme-provider.tsx # Dark/light/system theme via React Context
│   ├── mode-toggle.tsx    # Theme switcher dropdown
│   └── ui/                # shadcn components (Button, Sheet, ScrollArea, DropdownMenu)
│
├── assets/                # Images: logo, favicon, SVG title
└── content/docs/          # Auto-synced from /docs (do NOT edit directly)
```

## Key Modules

### `lib/docs-loader.ts`

The core of the system. Responsible for:

1. **Loading**: Uses `import.meta.glob("/src/content/docs/**/*.md")` to import all markdown at build time.
2. **Parsing**: Extracts frontmatter (title, description, date, order, section_top_parent, section_parent) and body from each file using the `front-matter` library.
3. **Building navigation**: `buildDocsConfig()` iterates over all docs and organizes them into a `DocSection[]` hierarchy based on frontmatter fields:
   - `section_top_parent` determines the top-level sidebar section.
   - `section_parent` determines subsections (when different from top_parent).
   - If a file's slug matches its section name (slugified), it becomes the **section index** (clickable section header).
4. **Sorting**: Sections and items are sorted by the `order` frontmatter field. Items without `order` are pushed to the end. The internal `_order` field is stripped before export.
5. **Exports**:
   - `docs: DocModule[]` — all loaded documents.
   - `dynamicDocsConfig: DocSection[]` — the built navigation tree.
   - `getDocBySlug(slug): DocModule | undefined` — lookup by filename.

### `layouts/DocsLayout.tsx`

Responsive two-column layout:
- **Desktop** (`md+`): Fixed sidebar (220px) + content area in a CSS grid.
- **Mobile**: Sidebar hidden; accessible via hamburger menu that opens a `Sheet` (Radix UI drawer).
- **Header**: Logo, mobile menu toggle, GitHub link, theme toggle.
- Uses React Router's `<Outlet />` to render child routes (DocPage).

### `pages/DocPage.tsx`

Renders a single documentation page:
1. Extracts the slug from the URL (last segment of `location.pathname`).
2. Calls `getDocBySlug()` to retrieve the document.
3. Builds breadcrumb navigation from `section_top_parent` → `section_parent` → `title`.
4. Renders markdown to HTML via `react-markdown` with custom component overrides:
   - Headings are downshifted one level (h1 → h2, h2 → h3, etc.) and have scroll margins.
   - Code blocks get syntax highlighting via `rehype-highlight`.
   - Lists, blockquotes, tables, and links are styled with Tailwind prose classes.

### `components/DocsSidebar.tsx`

Renders the navigation tree from `dynamicDocsConfig`:
- Three levels: section → subsection → item.
- Tracks expanded/collapsed state per section.
- Highlights the active page based on `location.pathname`.
- Wrapped in a `ScrollArea` for overflow handling.

### `components/theme-provider.tsx`

React Context-based theme management:
- Persists user choice in `localStorage`.
- Applies the selected theme as a class on `<html>`.
- Supports "light", "dark", and "system" (respects OS preference via `prefers-color-scheme`).

## Routing

`App.tsx` configures a `HashRouter` with:

```
/                → Redirect to /docs/getting_started
/docs/*          → DocsLayout > DocPage
```

HashRouter is used instead of BrowserRouter to support GitHub Pages (which doesn't handle SPA fallback routing).

## Build Pipeline

1. `scripts/sync-docs.ts` copies all `.md` files from `/docs/` → `/src/content/docs/`, preserving directory structure.
2. Vite's `import.meta.glob` loads the synced files at build time.
3. `docs-loader.ts` parses frontmatter and builds the navigation config.
4. The app is bundled as a static SPA and deployed to GitHub Pages via `gh-pages`.

Commands:
- `bun run dev` — sync + start dev server
- `bun run build` — sync + TypeScript check + production build
- `bun run deploy` — build + push to gh-pages branch
