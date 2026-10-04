import type { SiteLocale } from '@/lib/site-locale';
import { getOutfitCreatorCopy } from '@/lib/outfit-creator/copy';

export const OUTFIT_CREATOR_EDITOR_ID = 'outfit-creator-editor';

const OUTFIT_HERO_FADE_CLASS = 'outfit-creator-hero-fade';

function OutfitCreatorHeroStyles() {
  return (
    <style>{`
      @keyframes outfit-creator-hero-fade-in-up {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .${OUTFIT_HERO_FADE_CLASS} {
        animation: outfit-creator-hero-fade-in-up 0.6s ease-out both;
      }

      .outfit-creator-hero-fade-delay-1 { animation-delay: 0.2s; }
      .outfit-creator-hero-fade-delay-2 { animation-delay: 0.4s; }

      @media (prefers-reduced-motion: reduce) {
        .${OUTFIT_HERO_FADE_CLASS} { animation: none; }
      }
    `}</style>
  );
}

export function OutfitCreatorPageHeading({ locale }: { locale: SiteLocale }) {
  const copy = getOutfitCreatorCopy(locale);

  return (
    <section
      className="px-4 pt-4 pb-2 text-center text-foreground sm:pt-5 lg:pb-3"
      aria-labelledby="outfit-creator-heading"
    >
      <OutfitCreatorHeroStyles />
      <div className="mx-auto flex max-w-6xl flex-col items-center">
        <h1
          id="outfit-creator-heading"
          className={`${OUTFIT_HERO_FADE_CLASS} mb-2 max-w-4xl font-display text-[clamp(1.8rem,3vw,2.5rem)] font-semibold leading-tight tracking-tight text-balance`}
        >
          {copy.heading}
        </h1>

        <div className={`${OUTFIT_HERO_FADE_CLASS} outfit-creator-hero-fade-delay-1 mx-auto flex max-w-4xl flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4`}>
          <p
            id="outfit-creator-hero-description"
            className="text-sm leading-snug text-muted-foreground sm:text-base"
          >
            {copy.description}
          </p>
          <a
            href={`#${OUTFIT_CREATOR_EDITOR_ID}`}
            className={`${OUTFIT_HERO_FADE_CLASS} outfit-creator-hero-fade-delay-2 inline-flex shrink-0 items-center justify-center rounded-lg bg-foreground px-5 py-2 text-sm font-medium text-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-foreground`}
          >
            {copy.heroAction}
          </a>
        </div>
      </div>
    </section>
  );
}
