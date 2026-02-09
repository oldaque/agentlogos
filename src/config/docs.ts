export type DocItem = {
    title: string
    href: string
    items?: DocItem[]
}

export type DocSection = {
    title: string
    href?: string
    items: DocItem[]
}
