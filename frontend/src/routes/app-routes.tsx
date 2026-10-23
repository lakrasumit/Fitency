import { lazy } from "react"
import { BrowserRouter, Route, Routes } from "react-router"
import { AppShell } from "@/components/layout/app-shell"
import { HomePage } from "@/features/home/home-page"
import { AppBootstrap } from "@/routes/app-bootstrap"
import { NotFoundPage } from "@/routes/not-found-page"

// Keep the landing page eager; charts and the template catalogue load on
// demand so Home does not pay for them.
const AnalyticsPage = lazy(() =>
  import("@/features/analytics/analytics-page").then((module) => ({
    default: module.AnalyticsPage,
  })),
)
const LibraryPage = lazy(() =>
  import("@/features/library/library-page").then((module) => ({
    default: module.LibraryPage,
  })),
)

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppBootstrap />}>
          <Route element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="library" element={<LibraryPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
