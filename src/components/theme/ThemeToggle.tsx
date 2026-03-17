'use client';

import { useRef, useState } from 'react';
import { MoonStar, SunMedium } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type SiteLocale } from '@/lib/site-locale';
import { type ThemeMode } from '@/lib/theme';
import { applyTheme, useThemeMode } from '@/components/theme/useThemeMode';

type ThemeToggleProps = {
  locale: SiteLocale;
  className?: string;
};

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => {
    finished: Promise<void>;
  };
};

const copyByLocale = {
  zh: {
    idle: '主题',
    dark: '夜幕',
    light: '白昼',
    switchToDark: '切换到夜幕',
    switchToLight: '切换到白昼',
  },
  en: {
    idle: 'Theme',
    dark: 'Night',
    light: 'Day',
    switchToDark: 'Switch to night',
    switchToLight: 'Switch to day',
  },
} as const;

function getThemeOrigin(node: HTMLElement | null) {
  if (!node) {
    return { x: window.innerWidth / 2, y: 88 };
  }

  const rect = node.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

export function ThemeToggle({ locale, className }: ThemeToggleProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const { theme, mounted } = useThemeMode();
  const copy = copyByLocale[locale];

  const currentTheme = mounted ? theme : null;
  const nextTheme: ThemeMode = currentTheme === 'light' ? 'dark' : 'light';
  const title = currentTheme ? (nextTheme === 'dark' ? copy.switchToDark : copy.switchToLight) : copy.idle;

  const handleToggle = async () => {
    if (isSwitching) {
      return;
    }

    const root = document.documentElement;
    const { x, y } = getThemeOrigin(buttonRef.current);

    root.style.setProperty('--theme-origin-x', `${x}px`);
    root.style.setProperty('--theme-origin-y', `${y}px`);
    setIsSwitching(true);

    const finishPulse = () => {
      window.setTimeout(() => {
        root.classList.remove('theme-pulse');
      }, 760);
    };

    try {
      const doc = document as ViewTransitionDocument;

      if (typeof doc.startViewTransition === 'function') {
        const transition = doc.startViewTransition(() => {
          applyTheme(nextTheme);
        });

        await transition.finished.catch(() => undefined);
      } else {
        root.classList.add('theme-pulse');
        applyTheme(nextTheme);
        finishPulse();
      }
    } finally {
      window.setTimeout(() => {
        setIsSwitching(false);
      }, 120);
    }
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleToggle}
      data-theme={currentTheme ?? 'idle'}
      aria-label={title}
      title={title}
      disabled={isSwitching}
      className={cn('theme-toggle', className)}
    >
      <span className="theme-toggle__sky" aria-hidden="true" />
      <span className="theme-toggle__thumb" aria-hidden="true">
        {currentTheme === 'dark' ? (
          <MoonStar className="h-4 w-4" />
        ) : (
          <SunMedium className="h-4 w-4" />
        )}
      </span>
      <span className="theme-toggle__copy">
        <span className="theme-toggle__label">
          {currentTheme ? (currentTheme === 'dark' ? copy.dark : copy.light) : copy.idle}
        </span>
        <span className="theme-toggle__hint">
          {currentTheme ? title : `${copy.light} / ${copy.dark}`}
        </span>
      </span>
    </button>
  );
}
