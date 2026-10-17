import { createContext, useContext } from 'react';

/**
 * Theme context seam (D-12/D-14).
 *
 * Dark is the only theme in v1; the structure allows a light theme later without
 * touching component code.
 */
export type Theme = 'dark';

export interface ThemeContextValue {
  readonly theme: Theme;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error('useTheme must be used inside <ThemeProvider>.');
  }

  return value;
}
