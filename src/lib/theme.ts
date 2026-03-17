export const THEME_COOKIE_NAME = 'token-maker-theme';
export const THEME_CHANGE_EVENT = 'token-maker-theme-change';

export type ThemeMode = 'dark' | 'light';

export const DEFAULT_THEME: ThemeMode = 'dark';

export function normalizeTheme(value?: string | null): ThemeMode {
  return value === 'light' ? 'light' : DEFAULT_THEME;
}
