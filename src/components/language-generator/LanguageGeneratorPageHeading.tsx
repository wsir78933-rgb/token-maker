'use client';

import { useRef } from 'react';

import type { SiteLocale } from '@/lib/site-locale';
import { getLanguageGeneratorCopy } from '@/lib/language-generator/copy';

const LANGUAGE_GENERATOR_HERO_FADE_CLASS = 'language-generator-hero-fade';
const LANGUAGE_GENERATOR_HERO_UNDERLINE_CLASS = 'language-generator-hero-underline';
const LANGUAGE_GENERATOR_HERO_BUTTON_CLASS = 'language-generator-hero-button';
const LANGUAGE_GENERATOR_HERO_BOUNCE_CLASS = 'is-bouncing';

function requireLanguageGeneratorHeroButton(
  button: HTMLButtonElement | null,
): HTMLButtonElement {
  if (button === null) {
    throw new Error('Language generator hero button is missing. Received null.');
  }

  return button;
}

function requireLanguageGeneratorWorkspace(workspaceId: string): HTMLElement {
  const workspace = document.getElementById(workspaceId);
  if (workspace === null) {
    throw new Error(
      `Language generator workspace is missing. id=${JSON.stringify(workspaceId)}.`,
    );
  }

  return workspace;
}

function startLanguageGeneratorHeroButtonBounce(button: HTMLButtonElement): void {
  button.classList.add(LANGUAGE_GENERATOR_HERO_BOUNCE_CLASS);
  window.setTimeout(() => button.classList.remove(LANGUAGE_GENERATOR_HERO_BOUNCE_CLASS), 300);
}

function scrollToLanguageGeneratorWorkspace(workspace: HTMLElement): void {
  workspace.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function LanguageGeneratorHeroStyles() {
  return (
    <style>{`
      .${LANGUAGE_GENERATOR_HERO_UNDERLINE_CLASS} {
        position: absolute;
        bottom: 0;
        left: 50%;
        width: min(70%, 26rem);
        height: 24px;
        transform: translateX(-50%);
        pointer-events: none;
      }

      @keyframes language-generator-hero-fade-in-up {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .${LANGUAGE_GENERATOR_HERO_FADE_CLASS} {
        animation: language-generator-hero-fade-in-up 0.6s ease-out both;
      }

      .${LANGUAGE_GENERATOR_HERO_FADE_CLASS}.is-delayed-1 { animation-delay: 0.2s; }
      .${LANGUAGE_GENERATOR_HERO_FADE_CLASS}.is-delayed-2 { animation-delay: 0.4s; }

      .${LANGUAGE_GENERATOR_HERO_BUTTON_CLASS} {
        transition: none;
      }

      @keyframes language-generator-hero-button-bounce {
        0% { transform: scale(1); }
        50% { transform: scale(0.95); }
        100% { transform: scale(1); }
      }

      .${LANGUAGE_GENERATOR_HERO_BUTTON_CLASS}.${LANGUAGE_GENERATOR_HERO_BOUNCE_CLASS} {
        animation: language-generator-hero-button-bounce 0.3s cubic-bezier(0.36, 0, 0.66, -0.56);
      }

      .${LANGUAGE_GENERATOR_HERO_BUTTON_CLASS}:focus-visible {
        outline: 2px solid #fff;
        outline-offset: 3px;
      }

      @media (prefers-reduced-motion: reduce) {
        .${LANGUAGE_GENERATOR_HERO_FADE_CLASS},
        .${LANGUAGE_GENERATOR_HERO_BUTTON_CLASS}.${LANGUAGE_GENERATOR_HERO_BOUNCE_CLASS} {
          animation: none;
        }
      }
    `}</style>
  );
}

function LanguageGeneratorHeroUnderline() {
  return (
    <svg
      className={LANGUAGE_GENERATOR_HERO_UNDERLINE_CLASS}
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
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function LanguageGeneratorHeroButton({ label, workspaceId }: { label: string; workspaceId: string }) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleClick = () => {
    const button = requireLanguageGeneratorHeroButton(buttonRef.current);
    const workspace = requireLanguageGeneratorWorkspace(workspaceId);

    startLanguageGeneratorHeroButtonBounce(button);
    scrollToLanguageGeneratorWorkspace(workspace);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`${LANGUAGE_GENERATOR_HERO_BUTTON_CLASS} ${LANGUAGE_GENERATOR_HERO_FADE_CLASS} is-delayed-2 inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-foreground px-8 py-6 text-base font-medium text-background`}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}

export function LanguageGeneratorPageHeading({
  locale,
  workspaceId,
}: {
  locale: SiteLocale;
  workspaceId: string;
}) {
  const copy = getLanguageGeneratorCopy(locale);

  return (
    <section
      data-testid="language-generator-page-heading"
      className="flex min-h-screen items-center justify-center px-4 pt-32 pb-24 text-center text-foreground md:pt-40 md:pb-32"
      aria-labelledby="language-generator-heading"
    >
      <LanguageGeneratorHeroStyles />
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <h1
          id="language-generator-heading"
          className={`${LANGUAGE_GENERATOR_HERO_FADE_CLASS} relative mb-6 inline-block max-w-full pb-8 font-display ${locale === 'zh' ? 'text-[clamp(1.75rem,10vw,3rem)] whitespace-nowrap' : 'text-[clamp(2rem,11vw,2.625rem)]'} font-normal italic leading-[1.1] tracking-normal text-balance sm:text-6xl md:text-7xl`}
        >
          {copy.title}
          <LanguageGeneratorHeroUnderline />
        </h1>

        <p
          id="language-generator-hero-description"
          className={`${LANGUAGE_GENERATOR_HERO_FADE_CLASS} is-delayed-1 mx-auto mb-9 max-w-2xl text-base leading-snug text-muted-foreground sm:text-lg`}
        >
          {copy.description}
        </p>
        <LanguageGeneratorHeroButton label={copy.heroAction} workspaceId={workspaceId} />
      </div>
    </section>
  );
}
