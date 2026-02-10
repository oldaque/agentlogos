import { useState, useEffect, useCallback, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Search as SearchIcon } from "lucide-react"
import Fuse from "fuse.js"
import { docs } from "@/lib/docs-loader"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"

export function Search() {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const navigate = useNavigate()

    // Memoize Fuse.js for fuzzy search to avoid recreation
    const fuse = useMemo(() => new Fuse(docs, {
        keys: [
            { name: "metadata.title", weight: 1.0 },
            { name: "metadata.description", weight: 0.7 },
            { name: "content", weight: 0.5 },
        ],
        threshold: 0.2, // Stricter threshold for better precision
        includeMatches: true,
        ignoreLocation: true,
        minMatchCharLength: 2,
        useExtendedSearch: true, // Enable advanced search patterns
        distance: 100,
    }), [])

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const getSnippet = (content: string, matches: readonly any[]) => {
        if (!matches || matches.length === 0) return null

        const contentMatch = matches.find(m => m.key === "content")
        if (!contentMatch) return null

        const { indices } = contentMatch
        const [start, end] = indices[0]

        const padding = 60
        const snippetStart = Math.max(0, start - padding)
        const snippetEnd = Math.min(content.length, end + padding)

        let snippet = content.substring(snippetStart, snippetEnd).replace(/\n/g, " ")
        if (snippetStart > 0) snippet = "..." + snippet
        if (snippetEnd < content.length) snippet = snippet + "..."

        return snippet
    }

    const [searchItems, setSearchItems] = useState<{ item: typeof docs[0], snippet: string | null }[]>([])

    const handleSearch = useCallback((value: string) => {
        setQuery(value)
        if (!value) {
            setSearchItems([])
            return
        }
        const searchResults = fuse.search(value)
        setSearchItems(searchResults.map(result => ({
            item: result.item,
            snippet: getSnippet(result.item.content, result.matches || [])
        })))
    }, [fuse])

    const onSelect = (slug: string) => {
        setOpen(false)
        navigate(`/docs/${slug}`)
    }

    return (
        <>
            <Button
                variant="outline"
                className="relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
                onClick={() => setOpen(true)}
            >
                <SearchIcon className="mr-2 h-4 w-4" />
                <span className="hidden lg:inline-flex">Search documentation...</span>
                <span className="inline-flex lg:hidden">Search...</span>
                <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog
                open={open}
                onOpenChange={setOpen}
                shouldFilter={false} // Performance: Disable internal cmdk filtering
            >
                <CommandInput
                    placeholder="Type to search..."
                    value={query}
                    onValueChange={handleSearch}
                />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {searchItems.length > 0 && (
                        <CommandGroup heading="Results">
                            {searchItems.map(({ item, snippet }) => (
                                <CommandItem
                                    key={item.slug}
                                    value={item.slug} // Use slug as value to keep it lightweight
                                    onSelect={() => onSelect(item.slug)}
                                    className="flex flex-col items-start px-4 py-3"
                                >
                                    <div className="flex flex-col gap-0.5 w-full">
                                        <div className="font-medium text-foreground">{item.metadata.title}</div>
                                        {snippet ? (
                                            <div className="text-xs text-muted-foreground line-clamp-2 italic bg-muted/30 p-1 rounded mt-1 border-l-2 border-primary/30">
                                                {snippet}
                                            </div>
                                        ) : item.metadata.description && (
                                            <div className="text-xs text-muted-foreground line-clamp-1">
                                                {item.metadata.description}
                                            </div>
                                        )}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                    {query === "" && (
                        <CommandGroup heading="Suggestions">
                            {docs.slice(0, 5).map((doc) => (
                                <CommandItem
                                    key={doc.slug}
                                    value={doc.slug}
                                    onSelect={() => onSelect(doc.slug)}
                                >
                                    {doc.metadata.title}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    )
}
