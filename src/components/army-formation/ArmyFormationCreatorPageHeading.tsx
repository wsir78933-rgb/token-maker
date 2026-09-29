import { getArmyFormationCreatorHero } from '@/lib/army-formation/copy';
import type { SiteLocale } from '@/lib/site-locale';

export const ARMY_FORMATION_CREATOR_EDITOR_ID = 'army-formation-creator-editor';

const ARMY_FORMATION_HERO_FADE_CLASS = 'army-formation-hero-fade';
const ARMY_FORMATION_HERO_UNDERLINE_CLASS = 'army-formation-hero-underline';

function ArmyFormationHeroStyles() {
  return (
    <style>{`
      .${ARMY_FORMATION_HERO_UNDERLINE_CLASS} {
        position: absolute;
        left: 0;
        width: 100%;
        height: 0.42em;
        top: 100%;
        margin-top: -0.08em;
        pointer-events: none;
      }

      @keyframes army-formation-hero-fade-in-up {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .${ARMY_FORMATION_HERO_FADE_CLASS} {
        animation: army-formation-hero-fade-in-up 0.6s ease-out both;
      }

      .${ARMY_FORMATION_HERO_FADE_CLASS}.is-delayed-1 { animation-delay: 0.2s; }
      .${ARMY_FORMATION_HERO_FADE_CLASS}.is-delayed-2 { animation-delay: 0.4s; }

      @media (prefers-reduced-motion: reduce) {
        .${ARMY_FORMATION_HERO_FADE_CLASS} { animation: none; }
      }
    `}</style>
  );
}

function ArmyFormationHeroUnderline() {
  return (
    <svg
      className={ARMY_FORMATION_HERO_UNDERLINE_CLASS}
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

export function ArmyFormationCreatorPageHeading({ locale }: { locale: SiteLocale }) {
  const hero = getArmyFormationCreatorHero(locale);

  return (
    <section className="flex items-center justify-center px-4 pt-16 pb-20 text-center text-foreground md:pt-24 md:pb-28">
      <ArmyFormationHeroStyles />
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <h1
          id="army-formation-creator-heading"
          className={`${ARMY_FORMATION_HERO_FADE_CLASS} mb-8 text-4xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl`}
        >
          {hero.lead}{' '}
          <br />
          <span className="relative inline-block">
            <span className="font-display text-5xl font-normal italic sm:text-6xl md:text-7xl">{hero.emphasis}</span>
            <ArmyFormationHeroUnderline />
          </span>
        </h1>
        <p
          className={`${ARMY_FORMATION_HERO_FADE_CLASS} is-delayed-1 mx-auto mb-9 max-w-2xl text-base leading-snug text-muted-foreground sm:text-lg`}
        >
          {hero.subtitle}
        </p>
        <a
          href={`#${ARMY_FORMATION_CREATOR_EDITOR_ID}`}
          className={`${ARMY_FORMATION_HERO_FADE_CLASS} is-delayed-2 inline-flex items-center justify-center rounded-lg bg-foreground px-8 py-6 text-base font-medium text-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-foreground`}
        >
          {hero.action}
        </a>
      </div>
    </section>
  );
}
