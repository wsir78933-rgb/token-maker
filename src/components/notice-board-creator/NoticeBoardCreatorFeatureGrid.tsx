import {
  FileText,
  Link2,
  MousePointerClick,
  Save,
  Settings2,
  Type,
  type LucideIcon,
} from 'lucide-react';

import type {
  NoticeBoardCreatorFeatureIcon,
  NoticeBoardCreatorLandingCopy,
} from '@/lib/notice-board-creator/landing-copy';

const noticeBoardFeatureIcons: Record<NoticeBoardCreatorFeatureIcon, LucideIcon> = {
  papers: FileText,
  edit: MousePointerClick,
  settings: Settings2,
  type: Type,
  'google-fonts': Link2,
  project: Save,
};

export function NoticeBoardCreatorFeatureGrid({
  pageCopy,
}: {
  pageCopy: NoticeBoardCreatorLandingCopy;
}) {
  return (
    <section
      id="notice-board-creator-features"
      aria-labelledby="notice-board-creator-features-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <header className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
        <h2
          id="notice-board-creator-features-heading"
          className="font-display font-semibold leading-tight tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {pageCopy.featuresTitle}
        </h2>
        <p className="mt-3 text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {pageCopy.featuresSubtitle}
        </p>
      </header>

      <ul
        aria-labelledby="notice-board-creator-features-heading"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {pageCopy.features.map((featureCopy) => {
          const FeatureIcon = noticeBoardFeatureIcons[featureCopy.icon];

          return (
            <li key={featureCopy.icon} className="min-w-0">
              <article className="h-full rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.045]">
                <div
                  aria-hidden="true"
                  className="mb-5 flex size-11 items-center justify-center rounded-xl border border-amber-200/15 bg-amber-300/[0.08] text-[var(--site-accent-strong)]"
                >
                  <FeatureIcon className="size-5" />
                </div>
                <h3 className="font-semibold leading-snug tracking-tight text-stone-50">
                  {featureCopy.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-300">
                  {featureCopy.description}
                </p>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
