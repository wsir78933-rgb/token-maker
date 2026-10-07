'use client';

import { useRef } from 'react';

import { cn } from '@/lib/utils';
import type { SiteLocale } from '@/lib/site-locale';
import { getFamilyTreeCopy } from '@/lib/family-tree/copy';

const FAMILY_TREE_HERO_FADE_CLASS = 'family-tree-creator-hero-fade';
const FAMILY_TREE_HERO_UNDERLINE_CLASS = 'family-tree-creator-hero-underline';
const FAMILY_TREE_HERO_BUTTON_CLASS = 'family-tree-creator-hero-button';
const FAMILY_TREE_HERO_BOUNCE_CLASS = 'is-bouncing';

function requireFamilyTreeHeroButton(button: HTMLButtonElement | null): HTMLButtonElement {
  if (button === null) {
    throw new Error('Family tree creator hero button is missing. Received null.');
  }

  return button;
}

function requireFamilyTreeWorkspace(workspaceId: string): HTMLElement {
  const workspace = document.getElementById(workspaceId);
  if (workspace === null) {
    throw new Error(
      `Family tree creator workspace is missing. id=${JSON.stringify(workspaceId)}.`,
    );
  }

  return workspace;
}

function startFamilyTreeHeroButtonBounce(button: HTMLButtonElement): void {
  button.classList.add(FAMILY_TREE_HERO_BOUNCE_CLASS);
  window.setTimeout(() => button.classList.remove(FAMILY_TREE_HERO_BOUNCE_CLASS), 300);
}

function scrollToFamilyTreeWorkspace(workspace: HTMLElement): void {
  const prefersReducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  workspace.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
}

function FamilyTreeCreatorHeroStyles() {
  return (
    <style>{`
      .${FAMILY_TREE_HERO_UNDERLINE_CLASS} {
        position: absolute;
        left: 0;
        width: 100%;
        top: 100%;
        margin-top: -5px;
        pointer-events: none;
      }

      @keyframes family-tree-creator-hero-fade-in-up {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .${FAMILY_TREE_HERO_FADE_CLASS} {
        animation: family-tree-creator-hero-fade-in-up 0.6s ease-out both;
      }

      .${FAMILY_TREE_HERO_FADE_CLASS}.is-delayed-1 { animation-delay: 0.2s; }
      .${FAMILY_TREE_HERO_FADE_CLASS}.is-delayed-2 { animation-delay: 0.4s; }

      .${FAMILY_TREE_HERO_BUTTON_CLASS} {
        transition: none;
      }

      @keyframes family-tree-creator-hero-button-bounce {
        0% { transform: scale(1); }
        50% { transform: scale(0.95); }
        100% { transform: scale(1); }
      }

      .${FAMILY_TREE_HERO_BUTTON_CLASS}.${FAMILY_TREE_HERO_BOUNCE_CLASS} {
        animation: family-tree-creator-hero-button-bounce 0.3s cubic-bezier(0.36, 0, 0.66, -0.56);
      }

      .${FAMILY_TREE_HERO_BUTTON_CLASS}:focus-visible {
        outline: 2px solid var(--foreground);
        outline-offset: 3px;
      }

      @media (prefers-reduced-motion: reduce) {
        .${FAMILY_TREE_HERO_FADE_CLASS},
        .${FAMILY_TREE_HERO_BUTTON_CLASS}.${FAMILY_TREE_HERO_BOUNCE_CLASS} {
          animation: none;
        }
      }
    `}</style>
  );
}

function FamilyTreeCreatorHeroUnderline() {
  return (
    <svg
      className={FAMILY_TREE_HERO_UNDERLINE_CLASS}
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

function getFamilyTreeHeroTitleParts(
  title: string,
  locale: SiteLocale,
): { readonly lead: string; readonly emphasis: string; readonly tail: string } {
  const emphasis = locale === 'en' ? 'Fantasy Family Tree Maker' : '奇幻人物家谱制作器';
  const emphasisStart = title.indexOf(emphasis);

  if (emphasisStart < 0) {
    throw new Error(
      `Family tree creator hero title is missing keyword ${JSON.stringify(emphasis)} for locale ${JSON.stringify(locale)}. Received ${JSON.stringify(title)}.`,
    );
  }

  return {
    lead: title.slice(0, emphasisStart),
    emphasis,
    tail: title.slice(emphasisStart + emphasis.length),
  };
}

function FamilyTreeCreatorHeroButton({ label, workspaceId }: { label: string; workspaceId: string }) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  function handleClick(): void {
    const button = requireFamilyTreeHeroButton(buttonRef.current);
    const workspace = requireFamilyTreeWorkspace(workspaceId);

    startFamilyTreeHeroButtonBounce(button);
    scrollToFamilyTreeWorkspace(workspace);
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      className={cn(
        FAMILY_TREE_HERO_BUTTON_CLASS,
        FAMILY_TREE_HERO_FADE_CLASS,
        'is-delayed-2 inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-foreground px-8 py-6 text-base font-medium text-background',
      )}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}

export function FamilyTreeCreatorPageHeading({
  locale,
  workspaceId,
}: {
  readonly locale: SiteLocale;
  readonly workspaceId: string;
}) {
  const copy = getFamilyTreeCopy(locale);
  const heroTitleParts = getFamilyTreeHeroTitleParts(copy.heading, locale);

  return (
    <section
      className="flex min-h-screen items-center justify-center px-4 pt-32 pb-24 text-center text-foreground md:pt-40 md:pb-32"
      aria-labelledby="family-tree-creator-heading"
    >
      <FamilyTreeCreatorHeroStyles />
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <h1
          id="family-tree-creator-heading"
          className={cn(
            FAMILY_TREE_HERO_FADE_CLASS,
            'mb-6 max-w-full text-4xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl',
          )}
        >
          {heroTitleParts.lead}
          <span className="relative inline-block max-w-full align-baseline mb-8 sm:mb-12">
            <span
              className={cn(
                'font-display font-normal italic tracking-normal sm:text-6xl md:text-7xl',
                locale === 'zh'
                  ? 'text-[clamp(1.75rem,10vw,3rem)] whitespace-nowrap'
                  : 'text-5xl',
              )}
            >
              {heroTitleParts.emphasis}
            </span>
            <FamilyTreeCreatorHeroUnderline />
          </span>
          {heroTitleParts.tail}
        </h1>

        <p
          id="family-tree-creator-hero-description"
          className={cn(
            FAMILY_TREE_HERO_FADE_CLASS,
            'is-delayed-1 mx-auto mb-9 max-w-2xl text-base leading-snug text-muted-foreground sm:text-lg',
          )}
        >
          {copy.pageDescription}
        </p>
        <FamilyTreeCreatorHeroButton label={copy.heroAction} workspaceId={workspaceId} />
      </div>
    </section>
  );
}
