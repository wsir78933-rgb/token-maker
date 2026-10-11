import type { NoticeBoardCreatorLandingCopy } from '@/lib/notice-board-creator/landing-copy';

export function NoticeBoardCreatorWhatIs({
  pageCopy,
}: {
  pageCopy: NoticeBoardCreatorLandingCopy;
}) {
  return (
    <section
      id="notice-board-creator-what-is"
      aria-labelledby="notice-board-creator-what-is-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <header className="mx-auto max-w-3xl text-center">
        <h2
          id="notice-board-creator-what-is-heading"
          className="font-display font-semibold leading-tight tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {pageCopy.whatIsTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {pageCopy.whatIsDescription}
        </p>
      </header>
    </section>
  );
}
