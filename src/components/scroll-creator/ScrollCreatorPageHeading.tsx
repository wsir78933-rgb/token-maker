'use client';

import type { MouseEvent as ReactMouseEvent } from 'react';

import type { ScrollLocale } from '@/lib/scroll-creator/types';
import { getScrollCreatorCopy } from '@/lib/scroll-creator/copy';
import { SCROLL_CREATOR_EDITOR_ID } from '@/lib/scroll-creator/constants';

const SCROLL_CREATOR_HERO_FADE_CLASS = 'scroll-creator-hero-fade';
const SCROLL_CREATOR_HERO_UNDERLINE_CLASS = 'scroll-creator-hero-underline';
const SCROLL_CREATOR_HERO_BUTTON_CLASS = 'scroll-creator-hero-button';
const SCROLL_CREATOR_HERO_BOUNCE_CLASS = 'scroll-creator-hero-bouncing';

type ScrollCreatorHeroTitleParts = {
  readonly lead: string;
  readonly emphasis: string;
  readonly tail: string;
};

function getScrollCreatorHeroEmphasis(locale: ScrollLocale): string {
  if (locale === 'en') {
    return 'Parchment Scroll Creator';
  }

  if (locale === 'zh') {
    return '羊皮纸卷轴制作器';
  }

  throw new Error(`Unknown scroll creator hero locale. Received ${JSON.stringify(locale)}.`);
}

export function getScrollCreatorHeroTitleParts(
  title: string,
  locale: ScrollLocale,
): ScrollCreatorHeroTitleParts {
  if (typeof title !== 'string') {
    throw new Error(
      `Scroll creator hero title must be a string. Received value ${String(title)} with type ${typeof title}.`,
    );
  }

  const emphasis = getScrollCreatorHeroEmphasis(locale);
  const emphasisStart = title.indexOf(emphasis);
  if (emphasisStart < 0) {
    throw new Error(
      `Scroll creator hero title is missing emphasis keyword. locale=${JSON.stringify(locale)} title=${JSON.stringify(title)} keyword=${JSON.stringify(emphasis)}.`,
    );
  }

  return {
    lead: title.slice(0, emphasisStart),
    emphasis,
    tail: title.slice(emphasisStart + emphasis.length),
  };
}

function requireScrollCreatorEditor(): HTMLElement {
  const editor = document.getElementById(SCROLL_CREATOR_EDITOR_ID);
  if (editor === null) {
    throw new Error(
      `Scroll creator editor is missing. id=${JSON.stringify(SCROLL_CREATOR_EDITOR_ID)}.`,
    );
  }

  return editor;
}

function getScrollCreatorScrollBehavior(): ScrollBehavior {
  if (typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  }

  return 'smooth';
}

function scrollToScrollCreatorEditor(editor: HTMLElement): void {
  editor.scrollIntoView({ behavior: getScrollCreatorScrollBehavior(), block: 'start' });
}

function startScrollCreatorHeroButtonBounce(button: HTMLButtonElement): void {
  button.classList.add(SCROLL_CREATOR_HERO_BOUNCE_CLASS);
  window.setTimeout(() => button.classList.remove(SCROLL_CREATOR_HERO_BOUNCE_CLASS), 300);
}

function handleScrollCreatorHeroAction(event: ReactMouseEvent<HTMLButtonElement>): void {
  const editor = requireScrollCreatorEditor();
  startScrollCreatorHeroButtonBounce(event.currentTarget);
  scrollToScrollCreatorEditor(editor);
}

function ScrollCreatorHeroStyles() {
  return (
    <style>{`
      .${SCROLL_CREATOR_HERO_UNDERLINE_CLASS} {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        height: 30px;
        margin-top: -5px;
        pointer-events: none;
      }

      @keyframes scroll-creator-hero-fade-in-up {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .${SCROLL_CREATOR_HERO_FADE_CLASS} {
        animation: scroll-creator-hero-fade-in-up 0.6s ease-out both;
      }

      .${SCROLL_CREATOR_HERO_FADE_CLASS}.scroll-creator-hero-delay-1 { animation-delay: 0.2s; }
      .${SCROLL_CREATOR_HERO_FADE_CLASS}.scroll-creator-hero-delay-2 { animation-delay: 0.4s; }

      .${SCROLL_CREATOR_HERO_BUTTON_CLASS} {
        transition: none;
      }

      @keyframes scroll-creator-hero-button-bounce {
        0% { transform: scale(1); }
        50% { transform: scale(0.95); }
        100% { transform: scale(1); }
      }

      .${SCROLL_CREATOR_HERO_BUTTON_CLASS}.${SCROLL_CREATOR_HERO_BOUNCE_CLASS} {
        animation: scroll-creator-hero-button-bounce 0.3s cubic-bezier(0.36, 0, 0.66, -0.56);
      }

      .${SCROLL_CREATOR_HERO_BUTTON_CLASS}:focus-visible {
        outline: 2px solid var(--foreground);
        outline-offset: 3px;
      }

      @media (prefers-reduced-motion: reduce) {
        .${SCROLL_CREATOR_HERO_FADE_CLASS},
        .${SCROLL_CREATOR_HERO_BUTTON_CLASS}.${SCROLL_CREATOR_HERO_BOUNCE_CLASS} {
          animation: none;
        }
      }

      @media print {
        .scroll-creator-hero {
          display: none;
        }
      }
    `}</style>
  );
}

function ScrollCreatorHeroUnderline() {
  return (
    <svg
      className={SCROLL_CREATOR_HERO_UNDERLINE_CLASS}
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

function ScrollCreatorHeroButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className={`${SCROLL_CREATOR_HERO_BUTTON_CLASS} ${SCROLL_CREATOR_HERO_FADE_CLASS} scroll-creator-hero-delay-2 inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-foreground px-8 py-6 text-base font-medium text-background`}
      onClick={handleScrollCreatorHeroAction}
    >
      {label}
    </button>
  );
}

export function ScrollCreatorPageHeading({ locale }: { locale: ScrollLocale }) {
  const copy = getScrollCreatorCopy(locale);
  const heroTitleParts = getScrollCreatorHeroTitleParts(copy.heroTitle, locale);

  return (
    <section
      className="scroll-creator-hero flex min-h-screen items-center justify-center px-4 pt-32 pb-24 text-center text-foreground md:pt-40 md:pb-32"
      aria-labelledby="scroll-creator-heading"
    >
      <ScrollCreatorHeroStyles />
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <h1
          id="scroll-creator-heading"
          className={`${SCROLL_CREATOR_HERO_FADE_CLASS} mb-6 text-4xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl`}
        >
          {heroTitleParts.lead}
          <span className={`relative inline-block ${locale === 'zh' ? 'mb-8 sm:mb-12' : ''}`}>
            <span
              className={`font-display ${locale === 'zh' ? 'text-[clamp(1.75rem,10vw,3rem)] whitespace-nowrap' : 'text-5xl'} font-normal italic tracking-normal sm:text-6xl md:text-7xl`}
            >
              {heroTitleParts.emphasis}
            </span>
            <ScrollCreatorHeroUnderline />
          </span>
          {heroTitleParts.tail}
        </h1>
        <p
          id="scroll-creator-hero-description"
          className={`${SCROLL_CREATOR_HERO_FADE_CLASS} scroll-creator-hero-delay-1 mx-auto mb-9 max-w-2xl text-base leading-snug text-muted-foreground sm:text-lg`}
        >
          {copy.heroDescription}
        </p>
        <ScrollCreatorHeroButton label={copy.heroAction} />
      </div>
    </section>
  );
}
