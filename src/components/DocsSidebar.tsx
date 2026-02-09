import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { dynamicDocsConfig as docsConfig } from "@/lib/docs-loader"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DocsSidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function DocsSidebar({ className }: DocsSidebarProps) {
    const location = useLocation()
    const pathname = location.pathname

    // Initialize all sections as expanded
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {}
        docsConfig.forEach((section) => {
            initial[section.title] = true
        })
        return initial
    })

    const toggleSection = (title: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [title]: !prev[title]
        }))
    }

    return (
        <div className={cn("pb-12", className)}>
            <div className="py-4">
                <ScrollArea className="h-[calc(100vh-6rem)] px-4">
                    {docsConfig.map((section, index) => {
                        const isExpanded = expandedSections[section.title]
                        const hasItems = section.items?.length > 0
                        const isActive = pathname === section.href

                        return (
                            <div key={index} className="mb-2">
                                <div className="flex items-center">
                                    {hasItems && (
                                        <button
                                            onClick={() => toggleSection(section.title)}
                                            className="p-1 hover:bg-muted rounded-md mr-1"
                                        >
                                            {isExpanded ? (
                                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </button>
                                    )}
                                    {!hasItems && <div className="w-6" />}
                                    {section.href ? (
                                        <Link
                                            to={section.href}
                                            className={cn(
                                                "flex-1 rounded-md px-2 py-1.5 text-sm font-semibold transition-colors",
                                                isActive
                                                    ? "bg-primary/10 text-primary"
                                                    : "text-foreground hover:bg-muted/50"
                                            )}
                                        >
                                            {section.title}
                                        </Link>
                                    ) : (
                                        <span className="flex-1 px-2 py-1.5 text-sm font-semibold text-foreground">
                                            {section.title}
                                        </span>
                                    )}
                                </div>

                                {hasItems && isExpanded && (
                                    <div className="ml-6 mt-1 border-l border-border pl-2">
                                        {section.items.map((item, itemIndex) => {
                                            const itemActive = pathname === item.href
                                            const hasSubItems = (item.items?.length ?? 0) > 0

                                            return (
                                                <div key={itemIndex}>
                                                    <Link
                                                        to={item.href}
                                                        className={cn(
                                                            "block rounded-md px-2 py-1 text-sm transition-colors",
                                                            itemActive
                                                                ? "bg-primary/10 font-medium text-primary"
                                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                                                        )}
                                                    >
                                                        {item.title}
                                                    </Link>
                                                    {hasSubItems && (
                                                        <div className="ml-3 mt-1 border-l border-border/50 pl-2">
                                                            {item.items!.map((subItem, subIndex) => (
                                                                <Link
                                                                    key={subIndex}
                                                                    to={subItem.href}
                                                                    className={cn(
                                                                        "block rounded-md px-2 py-1 text-sm transition-colors",
                                                                        pathname === subItem.href
                                                                            ? "bg-primary/10 font-medium text-primary"
                                                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                                                                    )}
                                                                >
                                                                    {subItem.title}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </ScrollArea>
            </div>
        </div>
    )
}
