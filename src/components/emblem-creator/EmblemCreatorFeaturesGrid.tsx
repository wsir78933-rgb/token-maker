import { Download, Image as ImageIcon, Layers, LayoutGrid, Move, Save, type LucideIcon } from 'lucide-react';

import type { EmblemCreatorCopy } from '@/lib/emblem-creator/copy';

const EMBLEM_CREATOR_FEATURE_ICONS: readonly LucideIcon[] = [
  LayoutGrid,
  Move,
  Layers,
  ImageIcon,
  Download,
  Save,
];

const EMBLEM_CREATOR_FEATURES_HEADING_ID = 'emblem-creator-features-heading';

type EmblemCreatorFeaturesGridProps = {
  copy: EmblemCreatorCopy['features'];
};

export function EmblemCreatorFeaturesGrid({ copy }: EmblemCreatorFeaturesGridProps) {
  if (copy.items.length !== EMBLEM_CREATOR_FEATURE_ICONS.length) {
    throw new Error(
      `Emblem Creator feature grid requires exactly ${EMBLEM_CREATOR_FEATURE_ICONS.length} cards. Received ${copy.items.length}.`,
    );
  }

  return (
    <section
      aria-labelledby={EMBLEM_CREATOR_FEATURES_HEADING_ID}
      className="mx-auto max-w-5xl border-t border-white/10 py-20 text-stone-100 sm:py-24 lg:py-28"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <h2
          id={EMBLEM_CREATOR_FEATURES_HEADING_ID}
          className="font-display font-semibold tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {copy.title}
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {copy.description}
        </p>
      </div>

      <ul
        aria-label={copy.title}
        className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {copy.items.map((feature, index) => {
          const FeatureIcon = EMBLEM_CREATOR_FEATURE_ICONS[index];

          if (FeatureIcon === undefined) {
            throw new Error(
              `Emblem Creator feature icon is missing at index ${index}. Received ${String(FeatureIcon)}.`,
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
