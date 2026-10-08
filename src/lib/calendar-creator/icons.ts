import { isSiteLocale, type SiteLocale } from '@/lib/site-locale';

import type {
  CalendarIconId,
  CalendarMoonColor,
  CalendarMoonPhase,
} from './types';

export type {
  CalendarIconId,
  CalendarMoonColor,
  CalendarMoonPhase,
} from './types';

export type CalendarIconCategory = 'ordinary' | 'moon';

export type CalendarIconDefinition = {
  id: CalendarIconId;
  src: string;
  category: CalendarIconCategory;
  labelEn: string;
  labelZh: string;
};

const CALENDAR_ICON_LOCAL_ROOT = '/calendar-creator/rollforfantasy';

const CALENDAR_MOON_COLORS = ['white', 'blue', 'red'] as const;
const CALENDAR_MOON_PHASES = ['full', 'new', 'firstQuarter', 'lastQuarter'] as const;

const ORDINARY_ICON_IDS = [
  32, 38, 33, 34, 35, 36, 37, 31,
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
  47, 39, 40, 41, 42, 43, 44, 45, 46,
  60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
] as const satisfies readonly CalendarIconId[];

const MOON_ICON_SPECS = [
  { id: 48, color: 'white', fileName: 'fullMoon.png', label: 'full moon', labelZh: '白色满月' },
  { id: 49, color: 'white', fileName: 'noMoon.png', label: 'new moon', labelZh: '白色新月' },
  { id: 50, color: 'white', fileName: 'halfMoon.png', label: 'last quarter', labelZh: '白色下弦月' },
  { id: 51, color: 'white', fileName: 'halfMoonRev.png', label: 'first quarter', labelZh: '白色上弦月' },
  { id: 52, color: 'white', fileName: 'crescentMoon.png', label: 'crescent moon', labelZh: '白色蛾眉月' },
  { id: 53, color: 'white', fileName: 'crescentMoonRev.png', label: 'reverse crescent moon', labelZh: '白色反向蛾眉月' },
  { id: 70, color: 'blue', fileName: 'fullMoonTwo.png', label: 'blue full moon', labelZh: '蓝色满月' },
  { id: 71, color: 'blue', fileName: 'noMoonTwo.png', label: 'blue new moon', labelZh: '蓝色新月' },
  { id: 72, color: 'blue', fileName: 'halfMoonTwo.png', label: 'blue last quarter', labelZh: '蓝色下弦月' },
  { id: 73, color: 'blue', fileName: 'halfMoonRevTwo.png', label: 'blue first quarter', labelZh: '蓝色上弦月' },
  { id: 74, color: 'blue', fileName: 'crescentMoonTwo.png', label: 'blue crescent moon', labelZh: '蓝色蛾眉月' },
  { id: 75, color: 'blue', fileName: 'crescentMoonRevTwo.png', label: 'blue reverse crescent moon', labelZh: '蓝色反向蛾眉月' },
  { id: 76, color: 'red', fileName: 'fullMoonThree.png', label: 'red full moon', labelZh: '红色满月' },
  { id: 77, color: 'red', fileName: 'noMoonThree.png', label: 'red new moon', labelZh: '红色新月' },
  { id: 78, color: 'red', fileName: 'halfMoonThree.png', label: 'red last quarter', labelZh: '红色下弦月' },
  { id: 79, color: 'red', fileName: 'halfMoonRevThree.png', label: 'red first quarter', labelZh: '红色上弦月' },
  { id: 80, color: 'red', fileName: 'crescentMoonThree.png', label: 'red crescent moon', labelZh: '红色蛾眉月' },
  { id: 81, color: 'red', fileName: 'crescentMoonRevThree.png', label: 'red reverse crescent moon', labelZh: '红色反向蛾眉月' },
] as const satisfies readonly {
  id: CalendarIconId;
  color: CalendarMoonColor;
  fileName: string;
  label: string;
  labelZh: string;
}[];

export const DISASTER_ICON_IDS = [15, 61, 62, 63, 65, 67, 68, 69] as const satisfies readonly CalendarIconId[];

function createOrdinaryIconDefinition(id: CalendarIconId): CalendarIconDefinition {
  const disasterLabel = DISASTER_ICON_IDS.includes(id as (typeof DISASTER_ICON_IDS)[number]);
  return {
    id,
    src: `${CALENDAR_ICON_LOCAL_ROOT}/icon${id}.png`,
    category: 'ordinary',
    labelEn: disasterLabel ? `Natural disaster icon ${id}` : `Calendar icon ${id}`,
    labelZh: disasterLabel ? `自然灾害图标 ${id}` : `历法图标 ${id}`,
  };
}

function createMoonIconDefinition(
  spec: (typeof MOON_ICON_SPECS)[number],
): CalendarIconDefinition {
  return {
    id: spec.id,
    src: `${CALENDAR_ICON_LOCAL_ROOT}/${spec.fileName}`,
    category: 'moon',
    labelEn: spec.label,
    labelZh: spec.labelZh,
  };
}

export const CALENDAR_ICONS: readonly CalendarIconDefinition[] = [
  ...ORDINARY_ICON_IDS.map(createOrdinaryIconDefinition),
  ...MOON_ICON_SPECS.map(createMoonIconDefinition),
];

const CALENDAR_MOON_ICON_IDS: Record<
  CalendarMoonColor,
  Record<CalendarMoonPhase, CalendarIconId>
> = {
  white: { full: 48, new: 49, firstQuarter: 51, lastQuarter: 50 },
  blue: { full: 70, new: 71, firstQuarter: 73, lastQuarter: 72 },
  red: { full: 76, new: 77, firstQuarter: 79, lastQuarter: 78 },
};

function isCalendarMoonColor(value: unknown): value is CalendarMoonColor {
  return CALENDAR_MOON_COLORS.includes(value as CalendarMoonColor);
}

function isCalendarMoonPhase(value: unknown): value is CalendarMoonPhase {
  return CALENDAR_MOON_PHASES.includes(value as CalendarMoonPhase);
}

export function isCalendarIconId(value: unknown): value is CalendarIconId {
  return (
    Number.isSafeInteger(value) &&
    CALENDAR_ICONS.some((iconDefinition) => iconDefinition.id === value)
  );
}

export function getCalendarIcon(id: CalendarIconId): CalendarIconDefinition {
  const iconDefinition = CALENDAR_ICONS.find((candidate) => candidate.id === id);
  if (!iconDefinition) {
    throw new Error(`Unknown calendar icon ID. Received ${String(id)}.`);
  }

  return iconDefinition;
}

export function getCalendarIconLabel(id: CalendarIconId, locale: SiteLocale): string {
  if (!isSiteLocale(locale)) {
    throw new Error(`Unknown calendar icon label locale. Received ${String(locale)}.`);
  }

  return locale === 'en' ? getCalendarIcon(id).labelEn : getCalendarIcon(id).labelZh;
}

export function getCalendarMoonIconId(
  color: CalendarMoonColor,
  phase: CalendarMoonPhase,
): CalendarIconId {
  if (!isCalendarMoonColor(color)) {
    throw new Error(`Unknown calendar moon color. Received ${String(color)}.`);
  }

  if (!isCalendarMoonPhase(phase)) {
    throw new Error(`Unknown calendar moon phase. Received ${String(phase)}.`);
  }

  return CALENDAR_MOON_ICON_IDS[color][phase];
}
