import { useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';

import { ThemeContext, type ThemeContextValue } from './theme-context';

/**
 * Theme provider.
 *
 * Dark is the default **and only** theme in v1 (D-12/D-14). It writes the
 * resolved theme to `<html data-theme>` and sets `color-scheme` so native form
 * controls and scrollbars match.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = 'dark';
    root.style.colorScheme = 'dark';
  }, []);

  const value = useMemo<ThemeContextValue>(() => ({ theme: 'dark' }), []);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
