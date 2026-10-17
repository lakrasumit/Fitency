/**
 * Minimal class-name joiner.
 *
 * Kept dependency-free on purpose (D-24): the app only needs to concatenate
 * conditional class strings, not resolve Tailwind conflicts.
 */
export type ClassValue = string | false | null | undefined;

export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
