'use client';

import type { CalendarIconId } from '@/lib/calendar-creator/types';
import Image from 'next/image';
import {
  CALENDAR_ICONS,
  getCalendarIconLabel,
} from '@/lib/calendar-creator/icons';
import { getCalendarCreatorCopy } from '@/lib/calendar-creator/copy';
import type { SiteLocale } from '@/lib/site-locale';

import styles from './CalendarCreatorIconPicker.module.css';

export type CalendarCreatorIconPickerProps = {
  locale: SiteLocale;
  onSelect: (iconId: CalendarIconId) => void;
  disabled?: boolean;
  selectedIconId?: CalendarIconId | null;
};

type CalendarIconCategory = 'ordinary' | 'moon';

const ICON_CATEGORIES: readonly CalendarIconCategory[] = ['ordinary', 'moon'];

function getCategoryLabel(
  copy: ReturnType<typeof getCalendarCreatorCopy>,
  category: CalendarIconCategory,
): string {
  if (category === 'ordinary') {
    return copy.ordinaryIcons;
  }

  return copy.moonIcons;
}

function getCategoryIcons(category: CalendarIconCategory) {
  return CALENDAR_ICONS.filter((icon) => icon.category === category);
}

function requireIconSource(iconId: CalendarIconId, source: unknown): string {
  if (typeof source !== 'string' || source.trim() === '') {
    throw new Error(
      `Calendar icon ${String(iconId)} must expose a non-empty image source. Received ${JSON.stringify(source)}.`,
    );
  }

  return source;
}

function requireIconId(iconId: CalendarIconId): CalendarIconId {
  if (!Number.isSafeInteger(iconId) || iconId < 1) {
    throw new Error(
      `Calendar icon picker received an invalid icon id. Received ${JSON.stringify(iconId)}.`,
    );
  }

  return iconId;
}

export function CalendarCreatorIconPicker({
  locale,
  onSelect,
  disabled = false,
  selectedIconId = null,
}: CalendarCreatorIconPickerProps) {
  if (typeof onSelect !== 'function') {
    throw new Error('Calendar icon picker onSelect must be a function.');
  }

  const copy = getCalendarCreatorCopy(locale);

  return (
    <div
      className={styles.picker}
      data-testid="calendar-creator-icon-picker"
      aria-label={locale === 'zh' ? '日历图标库' : 'Calendar icon library'}
    >
      {ICON_CATEGORIES.map((category) => {
        const icons = getCategoryIcons(category);
        const expectedIconCount = category === 'ordinary' ? 57 : 18;

        if (icons.length !== expectedIconCount) {
          throw new Error(
            `Calendar icon category ${JSON.stringify(category)} must contain ${String(expectedIconCount)} icons. Received ${String(icons.length)}.`,
          );
        }

        return (
          <section className={styles.category} key={category}>
            <h3 className={styles.categoryTitle}>
              {getCategoryLabel(copy, category)}
              <span className={styles.categoryCount}>{icons.length}</span>
            </h3>
            <div className={styles.iconGrid}>
              {icons.map((icon) => {
                const iconId = requireIconId(icon.id);
                const label = getCalendarIconLabel(iconId, locale);
                const source = requireIconSource(iconId, icon.src);
                const isSelected = selectedIconId === iconId;

                return (
                  <button
                    type="button"
                    key={iconId}
                    className={`${styles.iconButton} ${isSelected ? styles.selected : ''}`}
                    aria-label={label}
                    aria-pressed={isSelected}
                    title={label}
                    disabled={disabled}
                    onClick={() => onSelect(iconId)}
                  >
                    <Image
                      className={styles.iconImage}
                      src={source}
                      alt={label}
                      width={32}
                      height={32}
                      loading="lazy"
                    />
                    <span className={styles.iconLabel}>{label}</span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
