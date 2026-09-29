import { getArmorCreatorHeroTitle } from '@/lib/armor-creator/copy';
import type { SiteLocale } from '@/lib/site-locale';

export const ARMOR_CREATOR_EDITOR_ID = 'armor-creator-editor';

const ARMOR_HERO_FADE_CLASS = 'armor-creator-hero-fade';
const ARMOR_HERO_UNDERLINE_CLASS = 'armor-creator-hero-underline';

function ArmorCreatorHeroStyles() {
  return (
    <style>{`
      .${ARMOR_HERO_UNDERLINE_CLASS} {
        position: absolute;
        left: 0;
        width: 100%;
        top: 100%;
        margin-top: -5px;
        pointer-events: none;
      }

      @keyframes armor-creator-hero-fade-in-up {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .${ARMOR_HERO_FADE_CLASS} {
        animation: armor-creator-hero-fade-in-up 0.6s ease-out both;
      }

      .armor-creator-hero-fade-delay-1 { animation-delay: 0.2s; }
      .armor-creator-hero-fade-delay-2 { animation-delay: 0.4s; }

      @media (prefers-reduced-motion: reduce) {
        .${ARMOR_HERO_FADE_CLASS} { animation: none; }
      }
    `}</style>
  );
}

function ArmorCreatorHeroUnderline() {
  return (
    <svg
      className={ARMOR_HERO_UNDERLINE_CLASS}
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

export function ArmorCreatorPageHeading({ locale }: { locale: SiteLocale }) {
  const title = getArmorCreatorHeroTitle(locale);

  return (
    <section
      className="flex min-h-svh items-center justify-center px-4 py-24 text-center text-foreground md:py-32"
      aria-labelledby="armor-creator-heading"
    >
      <ArmorCreatorHeroStyles />
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <h1
          id="armor-creator-heading"
          className={`${ARMOR_HERO_FADE_CLASS} mb-6 text-4xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl`}
        >
          {title.lead}
          {title.lineGap}
          <br />
          <span className="relative inline-block">
            <span className="font-display text-5xl font-normal italic tracking-normal sm:text-6xl md:text-7xl">
              {title.emphasis}
            </span>
            <ArmorCreatorHeroUnderline />
          </span>
          {title.gap}
          {title.tail}
        </h1>

        <div className={`${ARMOR_HERO_FADE_CLASS} armor-creator-hero-fade-delay-1 mx-auto mb-9 max-w-2xl`}>
          <p id="armor-creator-hero-description" className="text-base leading-snug text-muted-foreground sm:text-lg">
            {title.description}
          </p>
        </div>

        <div className={`${ARMOR_HERO_FADE_CLASS} armor-creator-hero-fade-delay-2`}>
          <a
            href={`#${ARMOR_CREATOR_EDITOR_ID}`}
            className="inline-flex items-center justify-center rounded-lg bg-foreground px-8 py-6 text-base font-medium text-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-foreground"
          >
            {title.action}
          </a>
        </div>
      </div>
    </section>
  );
}
