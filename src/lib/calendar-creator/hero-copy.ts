import type { SiteLocale } from '@/lib/site-locale';

export type CalendarCreatorHeroCopy = {
  readonly heading: string;
  readonly description: string;
  readonly emphasis: string;
};

const englishCalendarCreatorHeroCopy: CalendarCreatorHeroCopy = {
  heading: 'Free Fantasy Calendar Generator Create Your World’s Calendar',
  description:
    'Create a time system for your fantasy world. Customize months, weekdays and moon cycles, mark important dates, and add notes.',
  emphasis: 'Calendar Generator',
};

const chineseCalendarCreatorHeroCopy: CalendarCreatorHeroCopy = {
  heading: '免费奇幻历法生成器在线创建你的世界历法',
  description:
    '为你的奇幻世界建立独特的时间体系。自定义月份、星期和月亮周期，标记重要日期、记录故事事件。',
  emphasis: '奇幻历法生成器',
};

function requireCalendarCreatorHeroLocale(locale: string): SiteLocale {
  if (locale === 'en' || locale === 'zh') {
    return locale;
  }

  throw new Error(`Unsupported calendar creator hero locale ${JSON.stringify(locale)}.`);
}

function readCalendarCreatorHeroCopy(locale: SiteLocale): CalendarCreatorHeroCopy {
  if (locale === 'en') {
    return englishCalendarCreatorHeroCopy;
  }

  return chineseCalendarCreatorHeroCopy;
}

export function getCalendarCreatorHeroCopy(locale: SiteLocale): CalendarCreatorHeroCopy {
  const supportedLocale = requireCalendarCreatorHeroLocale(locale);
  const copy = readCalendarCreatorHeroCopy(supportedLocale);

  if (!copy.heading.includes(copy.emphasis)) {
    throw new Error(
      `Calendar creator hero heading for locale ${JSON.stringify(supportedLocale)} is missing emphasis ${JSON.stringify(copy.emphasis)}. Received ${JSON.stringify(copy.heading)}.`,
    );
  }

  return copy;
}
