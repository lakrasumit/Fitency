import { COPY } from '../../lib/copy';

/**
 * Keyboard-only escape hatch to the main content (D-19).
 *
 * Visually hidden until focused.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-brand-strong focus:bg-raised focus:px-3 focus:py-2 focus:text-[13px] focus:font-bold focus:text-ink"
    >
      {COPY.nav.skipToContent}
    </a>
  );
}
