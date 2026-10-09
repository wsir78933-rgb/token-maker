'use client';

import type { MouseEvent } from 'react';

import { Button } from '@/components/ui/button';
import type { SiteLocale } from '@/lib/site-locale';
import { cn } from '@/lib/utils';

import { CASTLE_CREATOR_EDITOR_ID } from '@/lib/castle-creator/constants';
import { getCastleCreatorCopy } from '@/lib/castle-creator/copy';

const CASTLE_HERO_FADE_CLASS = 'castle-creator-hero-fade';
const CASTLE_HERO_UNDERLINE_CLASS = 'castle-creator-hero-underline';
const CASTLE_HERO_BUTTON_CLASS = 'castle-creator-hero-button';
const CASTLE_HERO_BOUNCE_CLASS = 'is-bouncing';

function requireCastleCreatorHeroButton(
  button: HTMLButtonElement | null,
): HTMLButtonElement {
  if (button === null) {
    throw new Error('Castle creator hero button is missing. Received null.');
  }

  return button;
}

function requireCastleCreatorEditor(): HTMLElement {
  const editor = document.getElementById(CASTLE_CREATOR_EDITOR_ID);

  if (editor === null) {
    throw new Error(
      `Castle creator editor is missing. id=${JSON.stringify(CASTLE_CREATOR_EDITOR_ID)}.`,
    );
  }

  return editor;
}

function startCastleCreatorHeroButtonBounce(button: HTMLButtonElement): void {
  button.classList.add(CASTLE_HERO_BOUNCE_CLASS);
  window.setTimeout(() => button.classList.remove(CASTLE_HERO_BOUNCE_CLASS), 300);
}

function scrollToCastleCreatorEditor(editor: HTMLElement): void {
  const prefersReducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  editor.scrollIntoView({
    behavior: prefersReducedMotion ? 'instant' : 'smooth',
    block: 'start',
  });
}

function CastleCreatorHeroStyles() {
  return (
    <style>{`
      .${CASTLE_HERO_UNDERLINE_CLASS} {
        position: absolute;
        left: 0;
        width: 100%;
        top: 100%;
        margin-top: -5px;
        pointer-events: none;
      }

      @keyframes castle-creator-hero-fade-in-up {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .${CASTLE_HERO_FADE_CLASS} {
        animation: castle-creator-hero-fade-in-up 0.6s ease-out both;
      }

      .${CASTLE_HERO_FADE_CLASS}.is-delayed-1 { animation-delay: 0.2s; }
      .${CASTLE_HERO_FADE_CLASS}.is-delayed-2 { animation-delay: 0.4s; }

      .${CASTLE_HERO_BUTTON_CLASS} {
        transition: none;
      }

      @keyframes castle-creator-hero-button-bounce {
        0% { transform: scale(1); }
        50% { transform: scale(0.95); }
        100% { transform: scale(1); }
      }

      .${CASTLE_HERO_BUTTON_CLASS}.${CASTLE_HERO_BOUNCE_CLASS} {
        animation: castle-creator-hero-button-bounce 0.3s cubic-bezier(0.36, 0, 0.66, -0.56);
      }

      .${CASTLE_HERO_BUTTON_CLASS}:focus-visible {
        outline: 2px solid #fff;
        outline-offset: 3px;
      }

      @media (prefers-reduced-motion: reduce) {
        .${CASTLE_HERO_FADE_CLASS},
        .${CASTLE_HERO_BUTTON_CLASS}.${CASTLE_HERO_BOUNCE_CLASS} {
          animation: none;
        }
      }
    `}</style>
  );
}

function CastleCreatorHeroUnderline() {
  return (
    <svg
      className={CASTLE_HERO_UNDERLINE_CLASS}
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

function getCastleCreatorHeroTitleParts(
  title: string,
  locale: SiteLocale,
): { readonly lead: string; readonly emphasis: string; readonly tail: string } {
  const emphasis = locale === 'en' ? 'Castle Creator' : '城堡设计工具';
  const emphasisStart = title.indexOf(emphasis);

  if (emphasisStart < 0) {
    throw new Error(
      `Castle creator hero title is missing emphasis ${JSON.stringify(emphasis)} for locale ${JSON.stringify(locale)}. Received ${JSON.stringify(title)}.`,
    );
  }

  return {
    lead: title.slice(0, emphasisStart),
    emphasis,
    tail: title.slice(emphasisStart + emphasis.length),
  };
}

function handleCastleCreatorHeroButtonClick(event: MouseEvent<HTMLButtonElement>): void {
  const button = requireCastleCreatorHeroButton(event.currentTarget);
  const editor = requireCastleCreatorEditor();

  startCastleCreatorHeroButtonBounce(button);
  scrollToCastleCreatorEditor(editor);
}

export function CastleCreatorPageHeading({ locale }: { locale: SiteLocale }) {
  const copy = getCastleCreatorCopy(locale);
  const heroTitleParts = getCastleCreatorHeroTitleParts(copy.heading, locale);

  return (
    <section
      className="flex min-h-screen items-center justify-center px-4 pt-32 pb-24 text-center text-foreground md:pt-40 md:pb-32"
      data-testid="castle-creator-page-heading"
      aria-labelledby="castle-creator-heading"
    >
      <CastleCreatorHeroStyles />
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <h1
          id="castle-creator-heading"
          className={cn(
            CASTLE_HERO_FADE_CLASS,
            'mb-6 text-4xl font-bold leading-tight tracking-tighter text-balance sm:text-5xl md:text-6xl',
          )}
        >
          {heroTitleParts.lead}
          <span className={cn('relative inline-block', locale === 'zh' && 'mb-8 sm:mb-12')}>
            <span
              className={cn(
                'font-display font-normal italic tracking-normal sm:text-6xl md:text-7xl',
                locale === 'zh'
                  ? 'whitespace-nowrap text-[clamp(1.75rem,10vw,3rem)]'
                  : 'text-5xl',
              )}
            >
              {heroTitleParts.emphasis}
            </span>
            <CastleCreatorHeroUnderline />
          </span>
          {heroTitleParts.tail}
        </h1>

        <p
          id="castle-creator-hero-description"
          className={cn(
            CASTLE_HERO_FADE_CLASS,
            'is-delayed-1 mx-auto mb-9 max-w-2xl text-base leading-snug text-muted-foreground text-pretty sm:text-lg',
          )}
        >
          {copy.description}
        </p>

        <Button
          type="button"
          className={cn(
            CASTLE_HERO_BUTTON_CLASS,
            CASTLE_HERO_FADE_CLASS,
            'is-delayed-2 h-[72px] min-h-[72px] cursor-pointer rounded-lg border-0 bg-foreground px-8 py-6 text-base font-medium text-background',
          )}
          onClick={handleCastleCreatorHeroButtonClick}
        >
          {copy.heroAction}
        </Button>
      </div>
    </section>
  );
}
