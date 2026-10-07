import { CircularTestimonials } from '@/components/armor-creator/circular-testimonials';
import type { TarotCaseStudiesCopy } from '@/lib/tarot-cards/case-studies';

const TAROT_CASE_GROUP_COUNT = 3;
const TAROT_CASE_EXAMPLE_COUNT = 4;
const TAROT_CASE_IMAGE_POSITIONS = ['left', 'right', 'left'] as const;

type TarotCaseStudyGroupCopy = TarotCaseStudiesCopy['groups'][number];

function assertTarotCaseStudyShape(copy: TarotCaseStudiesCopy): void {
  if (copy.groups.length !== TAROT_CASE_GROUP_COUNT) {
    throw new Error(
      `Tarot case studies must contain exactly ${TAROT_CASE_GROUP_COUNT} groups. Received length ${copy.groups.length}.`,
    );
  }

  for (const [groupIndex, caseGroup] of copy.groups.entries()) {
    if (caseGroup.examples.length !== TAROT_CASE_EXAMPLE_COUNT) {
      throw new Error(
        `Tarot case group ${JSON.stringify(caseGroup.id)} must contain exactly ${TAROT_CASE_EXAMPLE_COUNT} examples. Received length ${caseGroup.examples.length}.`,
      );
    }

    const expectedImagePosition = TAROT_CASE_IMAGE_POSITIONS[groupIndex];
    if (caseGroup.imagePosition !== expectedImagePosition) {
      throw new Error(
        `Tarot case group ${JSON.stringify(caseGroup.id)} at index ${groupIndex} must use imagePosition ${JSON.stringify(expectedImagePosition)}. Received ${JSON.stringify(caseGroup.imagePosition)}.`,
      );
    }
  }
}

function TarotCaseStudyGroup({ caseGroup }: { caseGroup: TarotCaseStudyGroupCopy }) {
  return (
    <article
      aria-label={caseGroup.carouselLabel}
      className="flex flex-col [&_img]:object-contain!"
      data-image-position={caseGroup.imagePosition}
      data-tarot-case-group={caseGroup.id}
    >
      <CircularTestimonials
        testimonials={caseGroup.examples}
        ariaLabel={caseGroup.carouselLabel}
        previousLabel={caseGroup.previousLabel}
        nextLabel={caseGroup.nextLabel}
        autoplay={false}
        imagePosition={caseGroup.imagePosition}
        imageSize="large"
        clipImageStack={false}
        colors={{ imageBackground: 'var(--background)' }}
      />
    </article>
  );
}

export function TarotCaseStudies({ copy }: { copy: TarotCaseStudiesCopy }) {
  assertTarotCaseStudyShape(copy);

  return (
    <section
      id="tarot-cards-case-studies"
      aria-labelledby="tarot-cards-case-studies-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <header className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
        <h2
          id="tarot-cards-case-studies-heading"
          className="font-display font-semibold leading-tight tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {copy.title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {copy.description}
        </p>
      </header>

      <div className="flex flex-col gap-10 sm:gap-12 lg:gap-14">
        {copy.groups.map((caseGroup) => (
          <TarotCaseStudyGroup key={caseGroup.id} caseGroup={caseGroup} />
        ))}
      </div>
    </section>
  );
}
