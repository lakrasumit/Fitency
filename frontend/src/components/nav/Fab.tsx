import { Plus } from 'lucide-react';
import { Link } from 'react-router';

import { COPY } from '../../lib/copy';

/**
 * Floating action button (FR-S-2, DESIGN.md §3.1).
 *
 * 48px, primary, raised above the navigation bar.
 */
export function Fab({ className }: { className?: string }) {
  return (
    <Link
      to="/habits/new"
      aria-label={COPY.nav.addHabit}
      title={COPY.nav.addHabit}
      className={`flex size-12 shrink-0 items-center justify-center rounded-full bg-brand text-on-brand shadow-fab transition-[filter] hover:brightness-110 active:brightness-95 ${className ?? ''}`}
    >
      <Plus aria-hidden="true" className="size-5" strokeWidth={2.4} />
    </Link>
  );
}
