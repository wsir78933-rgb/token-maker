import {
  Atom,
  FileText,
  LayoutGrid,
  Palette,
  Save,
  TextCursorInput,
  type LucideIcon,
} from 'lucide-react';

import type {
  PeriodicTableFeature,
  PeriodicTableFeatureIcon,
  PeriodicTablePageContentCopy,
} from '@/lib/periodic-table-creator/page-content-copy';
import { cn } from '@/lib/utils';

const PERIODIC_TABLE_FEATURE_ICONS: Record<PeriodicTableFeatureIcon, LucideIcon> = {
  layout: LayoutGrid,
  fields: TextCursorInput,
  templates: Atom,
  styles: Palette,
  slots: Save,
  files: FileText,
};

function requireFeatureItems(items: readonly PeriodicTableFeature[]): readonly PeriodicTableFeature[] {
  if (items.length === 0) {
    throw new Error(`Periodic table feature grid requires at least one item. Received ${items.length} items.`);
  }

  return items;
}

export function PeriodicTableCreatorFeatureGrid({
  copy,
}: {
  copy: PeriodicTablePageContentCopy['features'];
}) {
  const featureItems = requireFeatureItems(copy.items);

  return (
    <section
      aria-labelledby="periodic-table-creator-feature-grid-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <header className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
        <h2
          id="periodic-table-creator-feature-grid-heading"
          className="font-display font-semibold leading-tight tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {copy.title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {copy.description}
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featureItems.map((feature) => {
          const Icon = PERIODIC_TABLE_FEATURE_ICONS[feature.icon];

          return (
            <li key={feature.icon} className="min-w-0">
              <article
                className={cn(
                  'h-full rounded-2xl border border-white/10 bg-white/[0.025] p-6',
                  'transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.045] motion-reduce:transition-none',
                )}
              >
                <div
                  aria-hidden="true"
                  className={cn(
                    'mb-5 flex size-11 items-center justify-center rounded-xl border',
                    'border-amber-200/15 bg-amber-300/[0.08] text-amber-200',
                  )}
                >
                  <Icon className="size-5" />
                </div>
                <h3 className="font-semibold leading-snug tracking-tight text-stone-50">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-300">
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
