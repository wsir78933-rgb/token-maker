'use client';

import { useRef } from 'react';

import type { EmblemCreatorCopy } from '@/lib/emblem-creator/copy';
import type { EmblemLocale } from '@/lib/emblem-creator/types';

export const EMBLEM_CREATOR_EDITOR_ID = 'emblem-creator-editor';

const EMBLEM_HERO_FADE_CLASS = 'emblem-creator-hero-fade';
const EMBLEM_HERO_UNDERLINE_CLASS = 'emblem-creator-hero-underline';
const EMBLEM_HERO_BUTTON_CLASS = 'emblem-creator-hero-button';
const EMBLEM_HERO_BOUNCE_CLASS = 'is-bouncing';

type EmblemCreatorHeroCopy = Pick<EmblemCreatorCopy, 'pageTitle' | 'pageDescription' | 'heroAction'>;

function requireEmblemCreatorHeroButton(button: HTMLButtonElement | null): HTMLButtonElement {
  if (button === null) {
    throw new Error('Emblem creator hero button is missing. Received null.');
  }

  return button;
}

function requireEmblemCreatorEditor(): HTMLElement {
  const editor = document.getElementById(EMBLEM_CREATOR_EDITOR_ID);
  if (editor === null) {
    throw new Error(
      `Emblem creator editor is missing. id=${JSON.stringify(EMBLEM_CREATOR_EDITOR_ID)}.`,
    );
  }

  return editor;
}

function startEmblemCreatorHeroButtonBounce(button: HTMLButtonElement): void {
  button.classList.add(EMBLEM_HERO_BOUNCE_CLASS);
  window.setTimeout(() => button.classList.remove(EMBLEM_HERO_BOUNCE_CLASS), 300);
}

function scrollToEmblemCreatorEditor(editor: HTMLElement): void {
  editor.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function EmblemCreatorHeroStyles() {
  return (
    <style>{`
      .${EMBLEM_HERO_UNDERLINE_CLASS} {
        position: absolute;
        left: 0;
        width: 100%;
        top: 100%;
        margin-top: -5px;
        pointer-events: none;
      }

      @keyframes emblem-creator-hero-fade-in-up {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .${EMBLEM_HERO_FADE_CLASS} {
        animation: emblem-creator-hero-fade-in-up 0.6s ease-out both;
      }

      .${EMBLEM_HERO_FADE_CLASS}.is-delayed-1 { animation-delay: 0.2s; }
      .${EMBLEM_HERO_FADE_CLASS}.is-delayed-2 { animation-delay: 0.4s; }

      .${EMBLEM_HERO_BUTTON_CLASS} {
        transition: none;
      }

      @keyframes emblem-creator-hero-button-bounce {
        0% { transform: scale(1); }
        50% { transform: scale(0.95); }
        100% { transform: scale(1); }
      }

      .${EMBLEM_HERO_BUTTON_CLASS}.${EMBLEM_HERO_BOUNCE_CLASS} {
        animation: emblem-creator-hero-button-bounce 0.3s cubic-bezier(0.36, 0, 0.66, -0.56);
      }

      .${EMBLEM_HERO_BUTTON_CLASS}:focus-visible {
        outline: 2px solid #fff;
        outline-offset: 3px;
      }

      @media (prefers-reduced-motion: reduce) {
        .${EMBLEM_HERO_FADE_CLASS},
        .${EMBLEM_HERO_BUTTON_CLASS}.${EMBLEM_HERO_BOUNCE_CLASS} {
          animation: none;
        }
      }
    `}</style>
  );
}

function EmblemCreatorHeroUnderline() {
  return (
    <svg
      className={EMBLEM_HERO_UNDERLINE_CLASS}
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

function getEmblemCreatorHeroTitleParts(
  title: string,
  locale: EmblemLocale,
): { readonly lead: string; readonly emphasis: string; readonly tail: string } {
  const emphasis = locale === 'en' ? 'Emblem Maker' : '徽章制作器';
  const emphasisStart = title.indexOf(emphasis);

  if (emphasisStart < 0) {
    throw new Error(
      `Emblem creator hero title is missing emphasis ${JSON.stringify(emphasis)} for locale ${JSON.stringify(locale)}. Received ${JSON.stringify(title)}.`,
    );
  }

  const tail = title.slice(emphasisStart + emphasis.length);

  return {
    lead: title.slice(0, emphasisStart),
    emphasis,
    tail: locale === 'zh' ? tail.replace(' | ', ' ') : tail,
  };
}

function EmblemCreatorHeroButton({ label }: { label: string }) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleClick = () => {
    const button = requireEmblemCreatorHeroButton(buttonRef.current);
    const editor = requireEmblemCreatorEditor();

    startEmblemCreatorHeroButtonBounce(button);
    scrollToEmblemCreatorEditor(editor);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`${EMBLEM_HERO_BUTTON_CLASS} ${EMBLEM_HERO_FADE_CLASS} is-delayed-2 inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-foreground px-8 py-6 text-base font-medium text-background`}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}

export function EmblemCreatorPageHeading({
  locale,
  copy,
}: {
  locale: EmblemLocale;
  copy: EmblemCreatorHeroCopy;
}) {
  const heroTitleParts = getEmblemCreatorHeroTitleParts(copy.pageTitle, locale);

  return (
    <section
      className="flex min-h-screen items-center justify-center px-4 pt-32 pb-24 text-center text-foreground md:pt-40 md:pb-32"
      aria-labelledby="emblem-creator-heading"
    >
      <EmblemCreatorHeroStyles />
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <h1
          id="emblem-creator-heading"
          className={`${EMBLEM_HERO_FADE_CLASS} mb-6 text-4xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl`}
        >
          {heroTitleParts.lead}
          <span className="relative inline-block">
            <span className="font-display text-5xl font-normal italic tracking-normal sm:text-6xl md:text-7xl">
              {heroTitleParts.emphasis}
            </span>
            <EmblemCreatorHeroUnderline />
          </span>
          {heroTitleParts.tail}
        </h1>
        <p
          className={`${EMBLEM_HERO_FADE_CLASS} is-delayed-1 mx-auto mb-9 max-w-2xl text-base leading-snug text-muted-foreground sm:text-lg`}
        >
          {copy.pageDescription}
        </p>
        <EmblemCreatorHeroButton label={copy.heroAction} />
      </div>
    </section>
  );
}
