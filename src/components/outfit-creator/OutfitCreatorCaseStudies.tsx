import {
  CircularTestimonials,
} from '@/components/armor-creator/circular-testimonials';
import type {
  OutfitCreatorCaseStudyGroupCopy,
  OutfitCreatorCaseStudiesCopy,
} from '@/lib/outfit-creator/copy';

const OUTFIT_CREATOR_CASE_GROUP_COUNT = 3;
const OUTFIT_CREATOR_CASE_EXAMPLE_COUNT = 4;

function assertOutfitCreatorCaseStudyShape(copy: OutfitCreatorCaseStudiesCopy): void {
  if (copy.groups.length !== OUTFIT_CREATOR_CASE_GROUP_COUNT) {
    throw new Error(
      `Outfit creator case studies must contain exactly ${OUTFIT_CREATOR_CASE_GROUP_COUNT} groups. Received length ${copy.groups.length}.`,
    );
  }

  for (const caseGroup of copy.groups) {
    if (caseGroup.examples.length !== OUTFIT_CREATOR_CASE_EXAMPLE_COUNT) {
      throw new Error(
        `Outfit creator case group ${JSON.stringify(caseGroup.id)} must contain exactly ${OUTFIT_CREATOR_CASE_EXAMPLE_COUNT} examples. Received length ${caseGroup.examples.length}.`,
      );
    }
  }
}

function OutfitCreatorCaseStudyGroup({
  caseGroup,
}: {
  caseGroup: OutfitCreatorCaseStudyGroupCopy;
}) {
  return (
    <article
      aria-label={caseGroup.carouselLabel}
      className="flex flex-col"
      data-image-position={caseGroup.imagePosition}
      data-outfit-case-group={caseGroup.id}
    >
      <CircularTestimonials
        testimonials={caseGroup.examples}
        ariaLabel={caseGroup.carouselLabel}
        previousLabel={caseGroup.previousLabel}
        nextLabel={caseGroup.nextLabel}
        imagePosition={caseGroup.imagePosition}
        clipImageStack={false}
      />
    </article>
  );
}

export function OutfitCreatorCaseStudies({
  copy,
}: {
  copy: OutfitCreatorCaseStudiesCopy;
}) {
  assertOutfitCreatorCaseStudyShape(copy);

  return (
    <section
      id="outfit-creator-case-studies"
      aria-labelledby="outfit-creator-case-studies-title"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <header className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
        <h2
          id="outfit-creator-case-studies-title"
          className="font-display font-semibold leading-tight tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {copy.title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {copy.description}
        </p>
      </header>

      <div className="flex flex-col gap-20 sm:gap-28 lg:gap-36">
        {copy.groups.map((caseGroup) => (
          <OutfitCreatorCaseStudyGroup key={caseGroup.id} caseGroup={caseGroup} />
        ))}
      </div>
    </section>
  );
}
