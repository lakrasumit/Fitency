import { BarChart3, Flame, Home, Trophy } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router';

import { COPY } from '../../lib/copy';
import { cn } from '../../lib/utils/cn';
import { Fab } from './Fab';

interface NavItem {
  to: string;
  label: string;
  Icon: LucideIcon;
}

const ITEMS: readonly NavItem[] = [
  { to: '/', label: COPY.nav.home, Icon: Home },
  { to: '/analytics', label: COPY.nav.analytics, Icon: BarChart3 },
  { to: '/rewards', label: COPY.nav.rewards, Icon: Trophy },
];

/**
 * Desktop sidebar rail (DESIGN.md §3.2 — proposal for open item O-5).
 *
 * Replaces the bottom navigation from `lg` (1024px) up and carries the FAB.
 */
export function SidebarNav() {
  return (
    <nav
      aria-label={COPY.nav.primaryLabel}
      className="fixed inset-y-0 left-0 z-30 hidden w-[var(--rail-width)] flex-col border-r border-line bg-surface/95 px-4 py-6 backdrop-blur-md lg:flex"
    >
      <div className="flex items-center gap-2.5 px-1">
        <span
          aria-hidden="true"
          className="flex size-9 items-center justify-center rounded-md border border-purple-line bg-reward-badge-bg text-purple-fg"
        >
          <Flame className="size-4" strokeWidth={2} />
        </span>
        <span className="type-card text-ink">{COPY.product.name}</span>
      </div>

      <ul className="mt-8 flex flex-col gap-1">
        {ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex min-h-11 items-center gap-3 rounded-md px-3 text-[13px] transition-colors',
                  isActive
                    ? 'bg-brand-soft font-bold text-ink'
                    : 'text-muted hover:bg-subtle hover:text-ink',
                )
              }
            >
              <item.Icon aria-hidden="true" className="size-5" strokeWidth={1.9} />
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <Fab className="w-full" />
      </div>
    </nav>
  );
}
