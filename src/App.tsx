import { HashRouter, Routes, Route, Navigate } from "react-router-dom"
import DocsLayout from "@/layouts/DocsLayout"
import DocPage from "@/pages/DocPage"
import { ThemeProvider } from "@/components/theme-provider"

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <HashRouter>
                <Routes>
                    <Route path="/" element={<DocsLayout />}>
                        <Route index element={<Navigate to="/docs/getting_started" replace />} />
                        <Route path="docs/*" element={<DocPage />} />
                    </Route>
                </Routes>
            </HashRouter>
        </ThemeProvider>
    )
}

export default App