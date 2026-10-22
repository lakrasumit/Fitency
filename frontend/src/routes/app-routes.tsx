import { BrowserRouter, Route, Routes } from "react-router"
import { AppShell } from "@/components/layout/app-shell"
import { AnalyticsPage } from "@/features/analytics/analytics-page"
import { LibraryPage } from "@/features/library/library-page"
import { HomePage } from "@/features/home/home-page"
import { AppBootstrap } from "@/routes/app-bootstrap"
import { NotFoundPage } from "@/routes/not-found-page"

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppBootstrap />}>
          <Route element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="library" element={<LibraryPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
