import { Image as ImageIcon, LayoutGrid, Map, Move, Palette, Save, type LucideIcon } from 'lucide-react';

import type { ArmyFormationCreatorPageCopy } from '@/lib/army-formation/page-copy';

const ARMY_FORMATION_FEATURE_ICONS: readonly LucideIcon[] = [
  LayoutGrid,
  Move,
  Palette,
  ImageIcon,
  Map,
  Save,
];

type ArmyFormationCreatorFeaturesGridProps = {
  copy: Pick<ArmyFormationCreatorPageCopy, 'featuresTitle' | 'featuresDescription' | 'features'>;
};

export function ArmyFormationCreatorFeaturesGrid({ copy }: ArmyFormationCreatorFeaturesGridProps) {
  if (copy.features.length !== ARMY_FORMATION_FEATURE_ICONS.length) {
    throw new Error(
      `Army Formation Creator feature grid requires exactly ${ARMY_FORMATION_FEATURE_ICONS.length} cards. Received ${copy.features.length}.`,
    );
  }

  return (
    <section
      aria-labelledby="army-formation-creator-features-title"
      className="mt-24 border-t border-white/10 pt-20 sm:mt-28 sm:pt-24 lg:mt-32 lg:pt-28"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <h2
          id="army-formation-creator-features-title"
          className="font-display font-semibold tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {copy.featuresTitle}
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {copy.featuresDescription}
        </p>
      </div>

      <ul
        aria-label={copy.featuresTitle}
        className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {copy.features.map((feature, index) => {
          const FeatureIcon = ARMY_FORMATION_FEATURE_ICONS[index];

          if (FeatureIcon === undefined) {
            throw new Error(
              `Army Formation Creator feature icon is missing at index ${index}. Received ${String(FeatureIcon)}.`,
            );
          }

          return (
            <li key={feature.title} className="h-full">
              <article className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                <div className="mb-5 flex size-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-[var(--site-accent-strong)]">
                  <FeatureIcon aria-hidden="true" className="size-5" />
                </div>
                <h3 className="font-semibold tracking-tight text-stone-50 text-balance">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-300 text-pretty">
                  {feature.description}
                </p>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
