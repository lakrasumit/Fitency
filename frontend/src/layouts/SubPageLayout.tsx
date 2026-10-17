import { Outlet } from 'react-router';

import { OfflineBanner } from '../components/feedback/OfflineBanner';
import { SkipLink } from '../components/nav/SkipLink';

/**
 * Layout for pushed sub-pages (New Habit — FR-N-1).
 *
 * No bottom navigation: the page owns a back-button header instead. Forms stay
 * in a narrow column at every breakpoint for readability (DESIGN.md §6).
 */
export function SubPageLayout() {
  return (
    <div className="min-h-dvh bg-page">
      <SkipLink />
      <OfflineBanner />

      <main
        id="main"
        tabIndex={-1}
        className="mx-auto flex w-full max-w-[600px] flex-col gap-5 px-5 pb-16 pt-6 lg:pt-10"
      >
        <Outlet />
      </main>
    </div>
  );
}
