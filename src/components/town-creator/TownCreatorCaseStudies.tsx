import { CircularTestimonials } from '@/components/armor-creator/circular-testimonials';
import type {
  TownCreatorCaseStudiesCopy,
  TownCreatorCaseStudyGroupCopy,
} from '@/lib/town-creator/case-studies';
import styles from './TownCreatorCaseStudies.module.css';

const EXPECTED_GROUP_COUNT = 3;
const EXPECTED_EXAMPLE_COUNT = 4;
const EXPECTED_IMAGE_POSITIONS: readonly ('left' | 'right')[] = ['left', 'right', 'left'];

function describeTownCreatorCaseStudyValue(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (value === null) {
    return 'null';
  }

  return Object.prototype.toString.call(value);
}

function assertTownCreatorCaseStudyShape(copy: TownCreatorCaseStudiesCopy): void {
  if (typeof copy !== 'object' || copy === null) {
    throw new Error(
      `Town creator case studies copy must be an object. Received ${describeTownCreatorCaseStudyValue(copy)}.`,
    );
  }

  if (!Array.isArray(copy.groups)) {
    throw new Error(
      `Town creator case studies groups must be an array. Received ${describeTownCreatorCaseStudyValue(copy.groups)}.`,
    );
  }

  if (copy.groups.length !== EXPECTED_GROUP_COUNT) {
    throw new Error(
      `Town creator case studies must contain exactly ${EXPECTED_GROUP_COUNT} groups. Received length ${copy.groups.length}.`,
    );
  }

  for (const [groupIndex, caseGroupValue] of copy.groups.entries()) {
    if (typeof caseGroupValue !== 'object' || caseGroupValue === null || Array.isArray(caseGroupValue)) {
      throw new Error(
        `Town creator case group at index ${groupIndex} must be an object. Received ${describeTownCreatorCaseStudyValue(caseGroupValue)}.`,
      );
    }

    const caseGroup = caseGroupValue as TownCreatorCaseStudyGroupCopy;
    if (caseGroup.imagePosition !== EXPECTED_IMAGE_POSITIONS[groupIndex]) {
      throw new Error(
        `Town creator case group ${JSON.stringify(caseGroup.id)} imagePosition must be ${JSON.stringify(EXPECTED_IMAGE_POSITIONS[groupIndex])}. Received ${describeTownCreatorCaseStudyValue(caseGroup.imagePosition)}.`,
      );
    }

    if (!Array.isArray(caseGroup.examples)) {
      throw new Error(
        `Town creator case group ${JSON.stringify(caseGroup.id)} examples must be an array. Received ${describeTownCreatorCaseStudyValue(caseGroup.examples)}.`,
      );
    }

    if (caseGroup.examples.length !== EXPECTED_EXAMPLE_COUNT) {
      throw new Error(
        `Town creator case group ${JSON.stringify(caseGroup.id)} must contain exactly ${EXPECTED_EXAMPLE_COUNT} examples. Received length ${caseGroup.examples.length}.`,
      );
    }
  }
}

function TownCreatorCaseStudyGroup({
  caseGroup,
}: {
  readonly caseGroup: TownCreatorCaseStudyGroupCopy;
}) {
  const headingId = `town-creator-case-group-${caseGroup.id}-heading`;

  return (
    <article
      aria-labelledby={headingId}
      aria-label={caseGroup.carouselLabel}
      className="flex min-w-0 flex-col gap-6 py-6 sm:py-8"
      data-town-case-group={caseGroup.id}
      data-image-position={caseGroup.imagePosition}
    >
      <h3
        id={headingId}
        className="px-6 text-center font-display text-xl font-semibold tracking-tight text-stone-50 text-balance sm:px-8 sm:text-2xl"
      >
        {caseGroup.title}
      </h3>
      <CircularTestimonials
        testimonials={caseGroup.examples}
        ariaLabel={caseGroup.carouselLabel}
        previousLabel={caseGroup.previousLabel}
        nextLabel={caseGroup.nextLabel}
        autoplay={false}
        imagePosition={caseGroup.imagePosition}
        imageShape="landscape"
        clipImageStack={false}
      />
    </article>
  );
}

export function TownCreatorCaseStudies({ copy }: { readonly copy: TownCreatorCaseStudiesCopy }) {
  assertTownCreatorCaseStudyShape(copy);

  return (
    <section
      id="town-creator-case-studies"
      aria-labelledby="town-creator-case-studies-heading"
      className={`${styles.caseStudies} mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28`}
    >
      <header className="mx-auto mb-10 flex max-w-3xl flex-col items-center gap-3 text-center sm:mb-12">
        <h2
          id="town-creator-case-studies-heading"
          className="font-display font-semibold leading-tight tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {copy.title}
        </h2>
        <p className="max-w-2xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {copy.description}
        </p>
      </header>

      <div className="flex min-w-0 flex-col gap-10 sm:gap-12 lg:gap-14">
        {copy.groups.map((caseGroup) => (
          <TownCreatorCaseStudyGroup key={caseGroup.id} caseGroup={caseGroup} />
        ))}
      </div>
    </section>
  );
}
