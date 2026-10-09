import type { CastleCreatorAboutCopy } from '@/lib/castle-creator/copy';

const CASTLE_CREATOR_WHAT_IS_HEADING_ID = 'castle-creator-what-is-heading';

export function CastleCreatorWhatIs({ copy }: { copy: CastleCreatorAboutCopy }) {
  return (
    <section
      aria-labelledby={CASTLE_CREATOR_WHAT_IS_HEADING_ID}
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
      data-testid="castle-creator-what-is"
    >
      <h2
        id={CASTLE_CREATOR_WHAT_IS_HEADING_ID}
        className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl"
      >
        {copy.title}
      </h2>
      <div className="mt-4 max-w-3xl space-y-4">
        {copy.paragraphs.map((paragraph, paragraphIndex) => (
          <p
            key={`${paragraph}-${paragraphIndex}`}
            className="text-sm leading-7 text-stone-300 text-pretty sm:text-base"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
