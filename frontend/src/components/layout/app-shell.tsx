import { Suspense, useLayoutEffect, useRef } from "react"
import { Outlet, useLocation, useNavigationType } from "react-router"
import { BottomTabBar } from "@/components/layout/bottom-tab-bar"
import { Sidebar } from "@/components/layout/sidebar"

/** Scroll offsets keyed by history entry, so back/forward restores them. */
const scrollPositions = new Map<string, number>()

export function AppShell() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const mainRef = useRef<HTMLElement>(null)
  const initialKey = useRef(location.key)

  useLayoutEffect(() => {
    return () => {
      scrollPositions.set(location.key, window.scrollY)
    }
  }, [location.key])

  useLayoutEffect(() => {
    // The first entry is already where the browser restored it; stealing
    // focus on load would skip the page's own heading for screen readers.
    if (location.key === initialKey.current) return

    if (navigationType === "POP") {
      window.scrollTo(0, scrollPositions.get(location.key) ?? 0)
    } else {
      window.scrollTo(0, 0)
    }

    mainRef.current?.focus({ preventScroll: true })
  }, [location.key, navigationType])

  return (
    <div className="min-h-svh">
      <div className="mx-auto flex w-full max-w-6xl">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <main
            ref={mainRef}
            tabIndex={-1}
            className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 pb-28 outline-none md:px-8 md:py-10 md:pb-12"
          >
            <Suspense
              fallback={
                <div
                  role="status"
                  className="py-16 text-center text-sm text-muted-foreground"
                >
                  Loading…
                </div>
              }
            >
              <div key={location.pathname} className="animate-page-in">
                <Outlet />
              </div>
            </Suspense>
          </main>
        </div>
      </div>
      <BottomTabBar />
    </div>
  )
}
