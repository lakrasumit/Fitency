import { BarChart3, Home, Trophy } from 'lucide-react';
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

/** Profile is intentionally absent (D-16): Home · Analytics · [+] · Rewards. */
const ITEMS: readonly NavItem[] = [
  { to: '/', label: COPY.nav.home, Icon: Home },
  { to: '/analytics', label: COPY.nav.analytics, Icon: BarChart3 },
  { to: '/rewards', label: COPY.nav.rewards, Icon: Trophy },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex min-h-11 flex-1 flex-col items-center justify-center gap-1 rounded-md px-2 transition-colors',
    isActive ? 'text-brand-strong font-bold' : 'text-muted hover:text-ink',
  );

/** Mobile bottom navigation (FR-S-1, DESIGN.md §3.1). */
export function BottomNav() {
  return (
    <nav
      aria-label={COPY.nav.primaryLabel}
      className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto flex h-[76px] max-w-[720px] items-center gap-1 px-3 pt-1">
        {ITEMS.slice(0, 2).map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
            <item.Icon aria-hidden="true" className="size-5" strokeWidth={1.9} />
            <span className="text-[11px] leading-[15px]">{item.label}</span>
          </NavLink>
        ))}

        <div className="flex flex-1 justify-center">
          <Fab className="-translate-y-4" />
        </div>

        {ITEMS.slice(2).map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
            <item.Icon aria-hidden="true" className="size-5" strokeWidth={1.9} />
            <span className="text-[11px] leading-[15px]">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
