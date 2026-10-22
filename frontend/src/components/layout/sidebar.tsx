import { cn } from "cn"
import { NavLink } from "react-router"
import { NAV_ITEMS } from "@/components/layout/nav-items"

export function Sidebar() {
  return (
    <nav
      aria-label="Main"
      className="sidebar-surface sticky top-0 hidden h-svh w-60 shrink-0 flex-col gap-6 border-r border-sidebar-border px-4 py-6 md:flex"
    >
      <p className="brand-gradient px-3 font-heading text-xl font-semibold">
        Fitency
      </p>
      <ul className="space-y-1">
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 motion-safe:hover:translate-x-0.5",
                  isActive
                    ? "nav-item-active font-semibold text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                )
              }
            >
              <item.icon
                className="size-5 transition-transform duration-200 group-hover:scale-105"
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
