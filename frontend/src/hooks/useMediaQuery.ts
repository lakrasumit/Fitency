import { useEffect, useState } from 'react';

/** Small media-query hook used for responsive behaviour in JS (DESIGN.md §6). */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener('change', onChange);

    return () => mediaQuery.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** `lg` breakpoint (1024px) — the desktop sidebar rail switch-over. */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}
