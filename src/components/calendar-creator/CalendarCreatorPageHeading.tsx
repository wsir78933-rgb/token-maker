import { getCalendarCreatorCopy } from '@/lib/calendar-creator/copy';
import { getCalendarCreatorHeroCopy } from '@/lib/calendar-creator/hero-copy';
import type { SiteLocale } from '@/lib/site-locale';

export const CALENDAR_CREATOR_WORKSPACE_ID = 'calendar-creator-workspace';

const CALENDAR_HERO_FADE_CLASS = 'calendar-creator-hero-fade';
const CALENDAR_HERO_UNDERLINE_CLASS = 'calendar-creator-hero-underline';
const CALENDAR_HERO_BUTTON_CLASS = 'calendar-creator-hero-button';

type CalendarCreatorHeroHeadingParts = {
  readonly lead: string;
  readonly emphasis: string;
  readonly tail: string;
};

function requireCalendarCreatorHeroAction(action: string, locale: SiteLocale): string {
  if (action.trim().length === 0) {
    throw new Error(
      `Calendar creator hero action is empty for locale ${JSON.stringify(locale)}. Received ${JSON.stringify(action)}.`,
    );
  }

  return action;
}

function splitCalendarCreatorHeroHeading(
  heading: string,
  emphasis: string,
  locale: SiteLocale,
): CalendarCreatorHeroHeadingParts {
  const emphasisStart = heading.indexOf(emphasis);

  if (emphasisStart < 0) {
    throw new Error(
      `Calendar creator hero heading for locale ${JSON.stringify(locale)} is missing emphasis ${JSON.stringify(emphasis)}. Received ${JSON.stringify(heading)}.`,
    );
  }

  return {
    lead: heading.slice(0, emphasisStart),
    emphasis,
    tail: heading.slice(emphasisStart + emphasis.length),
  };
}

function calendarCreatorHeroEmphasisClassName(locale: SiteLocale): string {
  const sharedClasses = 'font-display font-normal italic tracking-normal sm:text-6xl md:text-7xl';

  if (locale === 'zh') {
    return `${sharedClasses} text-[clamp(1.75rem,10vw,3rem)] whitespace-nowrap`;
  }

  return `${sharedClasses} text-5xl`;
}

function CalendarCreatorHeroStyles() {
  return (
    <style>{`
      .${CALENDAR_HERO_UNDERLINE_CLASS} {
        position: absolute;
        left: 0;
        width: 100%;
        top: 100%;
        margin-top: -5px;
        pointer-events: none;
      }

      @keyframes calendar-creator-hero-fade-in-up {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .${CALENDAR_HERO_FADE_CLASS} {
        animation: calendar-creator-hero-fade-in-up 0.6s ease-out both;
      }

      .${CALENDAR_HERO_FADE_CLASS}.is-delayed-1 { animation-delay: 0.2s; }
      .${CALENDAR_HERO_FADE_CLASS}.is-delayed-2 { animation-delay: 0.4s; }

      .${CALENDAR_HERO_BUTTON_CLASS} {
        transition: none;
      }

      .${CALENDAR_HERO_BUTTON_CLASS}:focus-visible {
        outline: 2px solid #fff;
        outline-offset: 3px;
      }

      @media (prefers-reduced-motion: reduce) {
        .${CALENDAR_HERO_FADE_CLASS} {
          animation: none;
        }
      }
    `}</style>
  );
}

function CalendarCreatorHeroUnderline() {
  return (
    <svg
      className={CALENDAR_HERO_UNDERLINE_CLASS}
      viewBox="0 0 170 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M2 9C32.8203 5.34032 108.769 -0.881146 166 3.51047"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
    </svg>
  );
}

export function CalendarCreatorPageHeading({ locale }: { locale: SiteLocale }) {
  const heroCopy = getCalendarCreatorHeroCopy(locale);
  const headingParts = splitCalendarCreatorHeroHeading(heroCopy.heading, heroCopy.emphasis, locale);
  const actionLabel = requireCalendarCreatorHeroAction(getCalendarCreatorCopy(locale).create, locale);
  const emphasisWrapperClassName = locale === 'zh'
    ? 'relative inline-block mb-8 sm:mb-12'
    : 'relative inline-block max-w-full mb-8 sm:mb-12';

  return (
    <section
      data-calendar-screen-only
      className="flex min-h-screen items-center justify-center px-4 pt-32 pb-24 text-center text-foreground md:pt-40 md:pb-32"
      aria-labelledby="calendar-creator-heading"
    >
      <CalendarCreatorHeroStyles />
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <h1
          id="calendar-creator-heading"
          className={`${CALENDAR_HERO_FADE_CLASS} mb-6 text-balance text-4xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl`}
        >
          {headingParts.lead}
          <span className={emphasisWrapperClassName}>
            <span className={calendarCreatorHeroEmphasisClassName(locale)}>
              {headingParts.emphasis}
            </span>
            <CalendarCreatorHeroUnderline />
          </span>
          {headingParts.tail}
        </h1>
        <p
          id="calendar-creator-hero-description"
          className={`${CALENDAR_HERO_FADE_CLASS} is-delayed-1 mx-auto mb-9 max-w-2xl text-pretty text-base leading-snug text-muted-foreground sm:text-lg`}
        >
          {heroCopy.description}
        </p>
        <a
          href={`#${CALENDAR_CREATOR_WORKSPACE_ID}`}
          className={`${CALENDAR_HERO_BUTTON_CLASS} ${CALENDAR_HERO_FADE_CLASS} is-delayed-2 inline-flex min-h-11 items-center justify-center rounded-lg bg-foreground px-8 py-6 text-base font-medium text-background`}
        >
          {actionLabel}
        </a>
      </div>
    </section>
  );
}
