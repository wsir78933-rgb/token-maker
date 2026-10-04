import type { EmblemCreatorCopy } from '@/lib/emblem-creator/copy';

const EMBLEM_CREATOR_WHAT_IS_HEADING_ID = 'emblem-creator-what-is-heading';

type EmblemCreatorWhatIsProps = {
  copy: Pick<EmblemCreatorCopy, 'whatIs'>;
};

export function EmblemCreatorWhatIs({ copy }: EmblemCreatorWhatIsProps) {
  return (
    <section
      aria-labelledby={EMBLEM_CREATOR_WHAT_IS_HEADING_ID}
      className="mx-2 max-w-5xl border-t border-white/10 pt-20 pb-12 text-stone-100 sm:-mx-1 sm:pt-24 sm:pb-16 lg:mx-auto lg:pt-28"
    >
      <div>
        <h2
          id={EMBLEM_CREATOR_WHAT_IS_HEADING_ID}
          className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl"
        >
          {copy.whatIs.title}
        </h2>
        <div className="mt-4 max-w-3xl space-y-4">
          {copy.whatIs.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-7 text-stone-300 text-pretty sm:text-base">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
