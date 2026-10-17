import { Outlet } from 'react-router';

import { OfflineBanner } from '../components/feedback/OfflineBanner';
import { BottomNav } from '../components/nav/BottomNav';
import { SidebarNav } from '../components/nav/SidebarNav';
import { SkipLink } from '../components/nav/SkipLink';

/**
 * Layout for the three tab destinations (Home, Analytics, Rewards).
 *
 * Mobile: bottom navigation (FR-S-1). `lg`+: sidebar rail + wider canvas
 * (DESIGN.md §3.2, proposal O-5). Content is centred between the two.
 */
export function TabLayout() {
  return (
    <div className="min-h-dvh bg-page lg:pl-[var(--rail-width)]">
      <SidebarNav />
      <SkipLink />
      <OfflineBanner />

      <main
        id="main"
        tabIndex={-1}
        className="mx-auto flex w-full max-w-[var(--content-max-mobile)] flex-col px-5 pb-32 pt-6 lg:max-w-[var(--content-max-desktop)] lg:px-8 lg:pb-16 lg:pt-8"
      >
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
