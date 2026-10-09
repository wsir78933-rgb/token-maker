import type { CastleCreatorFaqCopy } from '@/lib/castle-creator/copy';

export function CastleCreatorFaq({ copy }: { copy: CastleCreatorFaqCopy }) {
  return (
    <section
      aria-labelledby="castle-creator-faq-heading"
      className="mx-auto max-w-3xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
      data-testid="castle-creator-faq"
    >
      <header className="mx-auto mb-10 flex max-w-3xl flex-col items-center gap-3 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
          {copy.eyebrow}
        </span>
        <h2
          id="castle-creator-faq-heading"
          className="font-display font-semibold tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {copy.title}
        </h2>
        <p className="max-w-2xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {copy.description}
        </p>
      </header>

      <div className="space-y-3">
        {copy.items.map((item) => (
          <details key={item.question} className="group rounded-xl border border-white/10 bg-white/[0.03]">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium text-stone-100 marker:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-300">
              <span className="text-balance">{item.question}</span>
              <span aria-hidden="true" className="text-xl leading-none text-stone-400 transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="px-5 pb-5 text-sm leading-7 text-stone-300 text-pretty sm:text-base">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
