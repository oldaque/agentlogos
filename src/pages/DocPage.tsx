import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { getDocBySlug } from "@/lib/docs-loader"
import type { DocMetadata } from "@/lib/docs-loader"

export default function DocPage() {
    const { pathname } = useLocation()
    const slug = pathname.replace(/^\/docs\//, "")
    const [content, setContent] = useState("")
    const [metadata, setMetadata] = useState<DocMetadata | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!slug) return

        const doc = getDocBySlug(slug)

        if (doc) {
            setMetadata(doc.metadata)
            setContent(doc.content)
            setError(null)
        } else {
            setError(`Document not found: ${slug}`)
        }
    }, [slug])

    if (error) {
        return (
            <div className="py-10 text-center text-destructive">
                Error: {error}
            </div>
        )
    }

    // Build breadcrumb based on section hierarchy
    const buildBreadcrumb = () => {
        if (!metadata) return null

        const { section_top_parent, section_parent, title } = metadata
        const crumbs: { label: string; href?: string }[] = []

        // Add top parent
        if (section_top_parent) {
            const topParentSlug = section_top_parent.toLowerCase().replace(/\s+/g, "_")
            crumbs.push({
                label: section_top_parent,
                href: `/docs/${topParentSlug}`
            })
        }

        // Add parent if different from top parent
        if (section_parent && section_parent !== section_top_parent) {
            const parentSlug = section_parent.toLowerCase().replace(/\s+/g, "_")
            crumbs.push({
                label: section_parent,
                href: `/docs/${parentSlug}`
            })
        }

        // Add current page title (no link, it's the current page)
        // Only add if title is different from section names
        const isIndex = title === section_top_parent || title === section_parent
        if (!isIndex) {
            crumbs.push({ label: title })
        }

        return crumbs
    }

    const breadcrumbs = buildBreadcrumb()

    return (
        <div className="mx-auto w-full min-w-0">
            {/* Breadcrumb */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
                    {breadcrumbs.map((crumb, index) => (
                        <div key={index} className="flex items-center">
                            {index > 0 && (
                                <ChevronRight className="mx-1 h-4 w-4" />
                            )}
                            {crumb.href && index < breadcrumbs.length - 1 ? (
                                <Link
                                    to={crumb.href}
                                    className="hover:text-foreground transition-colors"
                                >
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className={cn(
                                    index === breadcrumbs.length - 1
                                        ? "font-medium text-foreground"
                                        : ""
                                )}>
                                    {crumb.label}
                                </span>
                            )}
                        </div>
                    ))}
                </nav>
            )}

            {/* Page Header */}
            <div className="space-y-2 border-b border-border pb-6 mb-8">
                <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-primary">
                    {metadata?.title}
                </h1>
                {metadata?.description && (
                    <p className="text-lg text-muted-foreground">
                        {metadata.description}
                    </p>
                )}
            </div>

            {/* Content */}
            <div className="pb-12">
                <div className="prose prose-stone dark:prose-invert max-w-none">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                            // h1 in content: styled smaller to differentiate from page title
                            h1: ({ node, ...props }) => (
                                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-10 mb-4" {...props} />
                            ),
                            h2: ({ node, ...props }) => (
                                <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mt-8 mb-3" {...props} />
                            ),
                            h3: ({ node, ...props }) => (
                                <h4 className="scroll-m-20 text-lg font-semibold tracking-tight mt-6 mb-2" {...props} />
                            ),
                            h4: ({ node, ...props }) => (
                                <h5 className="scroll-m-20 text-base font-semibold tracking-tight mt-4 mb-2" {...props} />
                            ),
                            p: ({ node, ...props }) => (
                                <p className="leading-7 [&:not(:first-child)]:mt-4" {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                                <ul className="my-4 ml-6 list-disc [&>li]:mt-2" {...props} />
                            ),
                            ol: ({ node, ...props }) => (
                                <ol className="my-4 ml-6 list-decimal [&>li]:mt-2" {...props} />
                            ),
                            code: ({ node, className, children, ...props }) => {
                                const isInline = !className
                                if (isInline) {
                                    return (
                                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm" {...props}>
                                            {children}
                                        </code>
                                    )
                                }
                                return <code className={className} {...props}>{children}</code>
                            },
                            pre: ({ node, ...props }) => (
                                <pre className="overflow-x-auto rounded-lg bg-muted p-4 my-4" {...props} />
                            ),
                            blockquote: ({ node, ...props }) => (
                                <blockquote className="border-l-4 border-primary pl-4 italic my-4" {...props} />
                            ),
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    )
}
