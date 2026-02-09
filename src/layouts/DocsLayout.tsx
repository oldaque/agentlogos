import { Outlet } from "react-router-dom"
import { DocsSidebar } from "@/components/DocsSidebar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, Github } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import logoImage from "@/assets/AgentLogos.webp"

export default function DocsLayout() {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center px-6">
                    <div className="mr-4 hidden md:flex">
                        <a href="/" className="flex items-center gap-2">
                            <img src={logoImage} alt="AgentLogos" className="h-8 w-8" />
                            <span className="font-bold text-lg">
                                AgentLogos
                            </span>
                        </a>
                    </div>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                className="mr-2 px-2 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="pr-0">
                            <div className="px-6 py-2">
                                <a href="/" className="flex items-center gap-2">
                                    <img src={logoImage} alt="AgentLogos" className="h-8 w-8" />
                                    <span className="font-bold text-lg">AgentLogos</span>
                                </a>
                            </div>
                            <DocsSidebar className="mt-4" />
                        </SheetContent>
                    </Sheet>
                    {/* Mobile logo - visible only on mobile */}
                    <a href="/" className="flex items-center gap-2 md:hidden">
                        <img src={logoImage} alt="AgentLogos" className="h-7 w-7" />
                        <span className="font-bold">AgentLogos</span>
                    </a>
                    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                asChild
                            >
                                <a
                                    href="https://github.com/oldaque/agentlogos"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="GitHub Repository"
                                >
                                    <Github className="h-5 w-5" />
                                </a>
                            </Button>
                            <ModeToggle />
                        </div>
                    </div>
                </div>
            </header>
            <div className="container flex-1 items-start px-6 md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
                <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
                    <DocsSidebar />
                </aside>
                <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
                    <div className="mx-auto w-full min-w-0">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}
