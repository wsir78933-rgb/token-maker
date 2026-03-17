'use client';

import { useEffect, useState } from 'react';
import {
  DEFAULT_THEME,
  THEME_CHANGE_EVENT,
  THEME_COOKIE_NAME,
  normalizeTheme,
  type ThemeMode,
} from '@/lib/theme';

type ThemeChangeDetail = {
  theme: ThemeMode;
};

function readThemeFromDocument(): ThemeMode {
  if (typeof document === 'undefined') {
    return DEFAULT_THEME;
  }

  return normalizeTheme(document.documentElement.dataset.theme);
}

export function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;

  root.dataset.theme = theme;
  root.classList.toggle('dark', theme === 'dark');

  document.cookie = `${THEME_COOKIE_NAME}=${theme}; path=/; max-age=31536000; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent<ThemeChangeDetail>(THEME_CHANGE_EVENT, { detail: { theme } }));
}

export function useThemeMode() {
  const [theme, setTheme] = useState<ThemeMode>(DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const sync = () => {
      setTheme(readThemeFromDocument());
      setMounted(true);
    };

    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent<ThemeChangeDetail>;
      setTheme(normalizeTheme(customEvent.detail?.theme ?? readThemeFromDocument()));
      setMounted(true);
    };

    sync();
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange as EventListener);

    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange as EventListener);
    };
  }, []);

  return { theme, mounted };
}
