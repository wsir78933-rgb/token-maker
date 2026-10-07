'use client';

import { useRef } from 'react';

import { TAROT_WORKSPACE_ID } from '@/lib/tarot-cards/constants';
import { getTarotCopy } from '@/lib/tarot-cards/copy';
import type { SiteLocale } from '@/lib/site-locale';

const TAROT_HERO_FADE_CLASS = 'tarot-cards-hero-fade';
const TAROT_HERO_UNDERLINE_CLASS = 'tarot-cards-hero-underline';
const TAROT_HERO_BUTTON_CLASS = 'tarot-cards-hero-button';
const TAROT_HERO_BOUNCE_CLASS = 'is-bouncing';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function requireTarotHeroButton(button: HTMLButtonElement | null): HTMLButtonElement {
  if (button === null) {
    throw new Error('Tarot cards hero button is missing. Received null.');
  }

  return button;
}

function requireTarotWorkspace(): HTMLElement {
  const workspace = document.getElementById(TAROT_WORKSPACE_ID);
  if (workspace === null) {
    throw new Error(`Tarot cards workspace is missing. id=${JSON.stringify(TAROT_WORKSPACE_ID)}.`);
  }

  return workspace;
}

function prefersTarotReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function startTarotHeroButtonBounce(button: HTMLButtonElement): void {
  button.classList.add(TAROT_HERO_BOUNCE_CLASS);
  window.setTimeout(() => button.classList.remove(TAROT_HERO_BOUNCE_CLASS), 300);
}

function scrollToTarotWorkspace(workspace: HTMLElement): void {
  workspace.scrollIntoView({
    behavior: prefersTarotReducedMotion() ? 'instant' : 'smooth',
    block: 'start',
  });
}

function getTarotHeroTitleParts(
  title: string,
  locale: SiteLocale,
): { readonly lead: string; readonly emphasis: string; readonly tail: string } {
  const emphasis = locale === 'en' ? 'Tarot Cards' : '幻想塔罗牌';
  const emphasisStart = title.indexOf(emphasis);

  if (emphasisStart < 0) {
    throw new Error(
      `Tarot cards hero title is missing emphasis ${JSON.stringify(emphasis)} for locale ${JSON.stringify(locale)}. Received ${JSON.stringify(title)}.`,
    );
  }

  return {
    lead: title.slice(0, emphasisStart),
    emphasis,
    tail: title.slice(emphasisStart + emphasis.length),
  };
}

function TarotHeroStyles() {
  return (
    <style>{`
      .${TAROT_HERO_UNDERLINE_CLASS} {
        position: absolute;
        left: 0;
        width: 100%;
        top: 100%;
        margin-top: -5px;
        pointer-events: none;
      }

      @keyframes tarot-cards-hero-fade-in-up {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .${TAROT_HERO_FADE_CLASS} {
        animation: tarot-cards-hero-fade-in-up 0.6s ease-out both;
      }

      .${TAROT_HERO_FADE_CLASS}.is-delayed-1 { animation-delay: 0.2s; }
      .${TAROT_HERO_FADE_CLASS}.is-delayed-2 { animation-delay: 0.4s; }

      .${TAROT_HERO_BUTTON_CLASS} {
        transition: none;
      }

      @keyframes tarot-cards-hero-button-bounce {
        0% { transform: scale(1); }
        50% { transform: scale(0.95); }
        100% { transform: scale(1); }
      }

      .${TAROT_HERO_BUTTON_CLASS}.${TAROT_HERO_BOUNCE_CLASS} {
        animation: tarot-cards-hero-button-bounce 0.3s cubic-bezier(0.36, 0, 0.66, -0.56);
      }

      @media (prefers-reduced-motion: reduce) {
        .${TAROT_HERO_FADE_CLASS},
        .${TAROT_HERO_BUTTON_CLASS}.${TAROT_HERO_BOUNCE_CLASS} {
          animation: none;
        }
      }
    `}</style>
  );
}

function TarotHeroUnderline() {
  return (
    <svg
      className={TAROT_HERO_UNDERLINE_CLASS}
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

function TarotHeroButton({ label }: { label: string }) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleClick = () => {
    const button = requireTarotHeroButton(buttonRef.current);
    const workspace = requireTarotWorkspace();

    startTarotHeroButtonBounce(button);
    scrollToTarotWorkspace(workspace);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`${TAROT_HERO_BUTTON_CLASS} ${TAROT_HERO_FADE_CLASS} is-delayed-2 inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-foreground px-8 py-6 text-base font-medium text-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-foreground`}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}

export function TarotPageHeading({ locale }: { locale: SiteLocale }) {
  const copy = getTarotCopy(locale);
  const heroTitleParts = getTarotHeroTitleParts(copy.pageTitle, locale);

  return (
    <section
      className="flex min-h-screen items-center justify-center px-4 pt-32 pb-24 text-center text-foreground md:pt-40 md:pb-32"
      aria-labelledby="tarot-cards-heading"
    >
      <TarotHeroStyles />
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <h1
          id="tarot-cards-heading"
          className={`${TAROT_HERO_FADE_CLASS} mb-6 text-balance text-4xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl`}
        >
          {heroTitleParts.lead}
          <span className={`relative inline-block ${locale === 'zh' ? 'mb-8 sm:mb-12' : ''}`}>
            <span
              className={`font-display ${locale === 'zh' ? 'text-[clamp(1.75rem,10vw,3rem)] whitespace-nowrap' : 'text-5xl'} font-normal italic tracking-normal sm:text-6xl md:text-7xl`}
            >
              {heroTitleParts.emphasis}
            </span>
            <TarotHeroUnderline />
          </span>
          {heroTitleParts.tail}
        </h1>

        <p
          id="tarot-cards-hero-description"
          className={`${TAROT_HERO_FADE_CLASS} is-delayed-1 mx-auto mb-9 max-w-2xl text-base leading-snug text-muted-foreground sm:text-lg`}
        >
          {copy.pageDescription}
        </p>
        <TarotHeroButton label={copy.heroAction} />
      </div>
    </section>
  );
}
