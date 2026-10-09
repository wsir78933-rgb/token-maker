import { ArrowRight } from 'lucide-react';

import type { CastleCreatorHowItWorksCopy } from '@/lib/castle-creator/copy';

function formatCastleCreatorStepNumber(stepIndex: number): string {
  return String(stepIndex + 1).padStart(2, '0');
}

export function CastleCreatorHowItWorks({ copy }: { copy: CastleCreatorHowItWorksCopy }) {
  return (
    <section
      aria-labelledby="castle-creator-how-to-use-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
      data-testid="castle-creator-how-it-works"
    >
      <header className="mb-14 flex flex-col items-center gap-3 text-center">
        <h2
          id="castle-creator-how-to-use-heading"
          className="font-display font-semibold tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {copy.title}
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {copy.description}
        </p>
      </header>

      <div className="relative">
        <div aria-hidden="true" className="absolute inset-x-0 top-6 hidden h-px bg-white/15 md:block" />
        <ol className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {copy.steps.map((step, stepIndex) => (
            <li key={step.title} className="relative flex min-w-0 flex-col items-center gap-4 text-center">
              <div className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-background">
                <span className="text-xs font-semibold tabular-nums text-stone-400">
                  {formatCastleCreatorStepNumber(stepIndex)}
                </span>
              </div>
              <div className="flex min-w-0 flex-col items-center gap-2">
                <h3 className="max-w-xs font-semibold tracking-tight text-stone-50 text-balance">
                  {step.title}
                </h3>
                <p className="max-w-xs text-sm leading-relaxed text-stone-300 text-pretty">
                  {step.description}
                </p>
              </div>
              {stepIndex < copy.steps.length - 1 ? (
                <ArrowRight aria-hidden="true" className="mt-2 size-4 text-stone-400/40 md:hidden" />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
