export type DocItem = {
    title: string
    href: string
    items?: DocItem[]
    /** @internal Used during build for sorting, stripped before export */
    _order?: number
}

export type DocSection = {
    title: string
    href?: string
    items: DocItem[]
    /** @internal Used during build for sorting, stripped before export */
    _order?: number
}
