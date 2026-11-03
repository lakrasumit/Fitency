import { cn } from "@/lib/utils"
import { NavLink } from "react-router"
import { NAV_ITEMS } from "@/components/layout/nav-items"

export function BottomTabBar() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-card/90 pb-[env(safe-area-inset-bottom)] shadow-[var(--nav-shadow)] backdrop-blur-md transition-colors duration-300 md:hidden"
    >
      <ul className="grid grid-cols-3">
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "group relative flex h-16 flex-col items-center justify-center gap-1 text-[0.7rem] font-medium transition-colors duration-200 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset",
                  isActive
                    ? "bg-gradient-to-t from-primary/10 to-transparent font-semibold text-primary-strong after:absolute after:inset-x-0 after:top-0 after:mx-auto after:h-0.5 after:w-8 after:rounded-full after:bg-primary"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                )
              }
            >
              <item.icon
                className="size-5 transition-transform duration-200 group-hover:scale-105 group-aria-[current=page]:scale-105"
                aria-hidden="true"
              />
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
