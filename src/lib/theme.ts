export const THEME_COOKIE_NAME = 'token-maker-theme';
export const THEME_STORAGE_KEY = THEME_COOKIE_NAME;
export const THEME_CHANGE_EVENT = 'token-maker-theme-change';

export type ThemeMode = 'dark' | 'light';

export const DEFAULT_THEME: ThemeMode = 'dark';

export function normalizeTheme(value?: string | null): ThemeMode {
  return value === 'light' ? 'light' : DEFAULT_THEME;
}

export function getThemeInitScript() {
  return `(() => {
    const defaultTheme = ${JSON.stringify(DEFAULT_THEME)};
    const storageKey = ${JSON.stringify(THEME_STORAGE_KEY)};
    const cookieKey = ${JSON.stringify(THEME_COOKIE_NAME)};
    const root = document.documentElement;

    const readCookieTheme = () => {
      const prefix = cookieKey + '=';
      const cookieEntry = document.cookie
        .split('; ')
        .find((entry) => entry.startsWith(prefix));
      return cookieEntry ? decodeURIComponent(cookieEntry.slice(prefix.length)) : null;
    };

    let persistedTheme = null;

    try {
      persistedTheme = window.localStorage.getItem(storageKey);
    } catch {}

    const theme = persistedTheme === 'light' || (!persistedTheme && readCookieTheme() === 'light')
      ? 'light'
      : defaultTheme;

    root.dataset.theme = theme;
    root.classList.toggle('dark', theme === 'dark');
  })();`;
}
