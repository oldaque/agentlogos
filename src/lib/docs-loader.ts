import frontMatter from "front-matter";
import type { DocItem, DocSection } from "@/config/docs";

export type DocMetadata = {
    title: string;
    description?: string;
    date?: string;
    order?: number;
    section_top_parent?: string;
    section_parent?: string;
};

export type DocModule = {
    slug: string;
    content: string;
    metadata: DocMetadata;
};

// Import all markdown files from src/content/docs
const modules = import.meta.glob("/src/content/docs/**/*.md", {
    query: "?raw",
    import: "default",
    eager: true,
});

export const docs: DocModule[] = Object.entries(modules).map(([path, content]) => {
    const slug = path.split("/").pop()?.replace(".md", "") || "";
    const { attributes, body } = frontMatter<DocMetadata>(content as string);
    return {
        slug,
        content: body,
        metadata: attributes,
    };
});

// Helper to convert section name to slug format for comparison
function toSlug(name: string): string {
    return name.toLowerCase().replace(/\s+/g, "_").replace(/-/g, "_");
}

function buildDocsConfig(): DocSection[] {
    const sections: Record<string, DocSection> = {};

    docs.forEach((doc) => {
        const { section_top_parent, section_parent, title, order } = doc.metadata;
        const topParent = section_top_parent || "Uncategorized";
        const parent = section_parent || topParent;
        const href = `/docs/${doc.slug}`;
        const slugNormalized = toSlug(doc.slug);

        // Initialize section if not exists
        if (!sections[topParent]) {
            sections[topParent] = {
                title: topParent,
                items: [],
            };
        }

        // Check if this note is an index (slug matches section_top_parent or section_parent)
        const isTopParentIndex = slugNormalized === toSlug(topParent);
        const isParentIndex = slugNormalized === toSlug(parent);

        if (topParent === parent) {
            // Direct child of Top Parent (macro section)
            if (isTopParentIndex) {
                // This is the index for the top-level section - set href and order
                sections[topParent].href = href;
                sections[topParent]._order = order;
            } else {
                // Regular item under the macro section
                sections[topParent].items.push({ title, href, _order: order });
            }
        } else {
            // It's in a subsection (section_top_parent != section_parent)
            let subSection = sections[topParent].items.find(i => i.title === parent);

            if (!subSection) {
                subSection = {
                    title: parent,
                    href: "#",
                    items: []
                };
                sections[topParent].items.push(subSection);
            }

            if (!subSection.items) subSection.items = [];

            if (isParentIndex) {
                // This is the index for the subsection - set href and order
                subSection.href = href;
                subSection._order = order;
            } else {
                // Regular item under the subsection
                subSection.items.push({ title, href, _order: order });
            }
        }
    });

    const result = Object.values(sections);

    // Sort top-level sections by the order of their index doc
    result.sort((a, b) => {
        const orderA = a._order ?? Number.MAX_SAFE_INTEGER;
        const orderB = b._order ?? Number.MAX_SAFE_INTEGER;
        return orderA - orderB;
    });

    // Sort items within each section (and subsections recursively)
    for (const section of result) {
        section.items.sort((a, b) => {
            const orderA = a._order ?? Number.MAX_SAFE_INTEGER;
            const orderB = b._order ?? Number.MAX_SAFE_INTEGER;
            return orderA - orderB;
        });
        for (const item of section.items) {
            if (item.items) {
                item.items.sort((x, y) => {
                    const orderX = x._order ?? Number.MAX_SAFE_INTEGER;
                    const orderY = y._order ?? Number.MAX_SAFE_INTEGER;
                    return orderX - orderY;
                });
            }
        }
    }

    // Strip internal _order before returning
    function stripOrder(items: DocItem[]) {
        for (const item of items) {
            delete item._order;
            if (item.items) stripOrder(item.items);
        }
    }
    for (const section of result) {
        delete section._order;
        stripOrder(section.items);
    }

    return result;
}

export const dynamicDocsConfig = buildDocsConfig();

export function getDocBySlug(slug: string): DocModule | undefined {
    return docs.find(d => d.slug === slug);
}
