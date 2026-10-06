import { CircularTestimonials } from '@/components/armor-creator/circular-testimonials';
import type {
  FamilyTreeCaseStudyGroupCopy,
  FamilyTreeCaseStudiesCopy,
} from '@/lib/family-tree/case-studies';

const FAMILY_TREE_CASE_GROUP_COUNT = 3;
const FAMILY_TREE_CASE_EXAMPLE_COUNT = 4;

function describeFamilyTreeCaseStudyValue(value: unknown): string {
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

function assertFamilyTreeCaseStudyShape(copy: FamilyTreeCaseStudiesCopy): void {
  if (typeof copy !== 'object' || copy === null) {
    throw new Error(
      `Family tree case studies copy must be an object. Received ${describeFamilyTreeCaseStudyValue(copy)}.`,
    );
  }

  if (!Array.isArray(copy.groups)) {
    throw new Error(
      `Family tree case studies groups must be an array. Received ${describeFamilyTreeCaseStudyValue(copy.groups)}.`,
    );
  }

  if (copy.groups.length !== FAMILY_TREE_CASE_GROUP_COUNT) {
    throw new Error(
      `Family tree case studies must contain exactly ${FAMILY_TREE_CASE_GROUP_COUNT} groups. Received length ${copy.groups.length}.`,
    );
  }

  for (const [groupIndex, caseGroupValue] of copy.groups.entries()) {
    if (typeof caseGroupValue !== 'object' || caseGroupValue === null || Array.isArray(caseGroupValue)) {
      throw new Error(
        `Family tree case group at index ${groupIndex} must be an object. Received ${describeFamilyTreeCaseStudyValue(caseGroupValue)}.`,
      );
    }

    const caseGroup = caseGroupValue as FamilyTreeCaseStudyGroupCopy;
    if (!Array.isArray(caseGroup.examples)) {
      throw new Error(
        `Family tree case group ${JSON.stringify(caseGroup.id)} examples must be an array. Received ${describeFamilyTreeCaseStudyValue(caseGroup.examples)}.`,
      );
    }

    if (caseGroup.examples.length !== FAMILY_TREE_CASE_EXAMPLE_COUNT) {
      throw new Error(
        `Family tree case group ${JSON.stringify(caseGroup.id)} must contain exactly ${FAMILY_TREE_CASE_EXAMPLE_COUNT} examples. Received length ${caseGroup.examples.length}.`,
      );
    }
  }
}

function FamilyTreeCreatorCaseStudyGroup({
  caseGroup,
}: {
  readonly caseGroup: FamilyTreeCaseStudyGroupCopy;
}) {
  return (
    <article
      aria-label={caseGroup.carouselLabel}
      className="flex flex-col"
      data-family-tree-case-group={caseGroup.id}
      data-image-position={caseGroup.imagePosition}
    >
      <CircularTestimonials
        testimonials={caseGroup.examples}
        ariaLabel={caseGroup.carouselLabel}
        previousLabel={caseGroup.previousLabel}
        nextLabel={caseGroup.nextLabel}
        imagePosition={caseGroup.imagePosition}
        imageShape="landscape"
        clipImageStack={false}
      />
    </article>
  );
}

export function FamilyTreeCreatorCaseStudies({
  copy,
}: {
  copy: FamilyTreeCaseStudiesCopy;
}) {
  assertFamilyTreeCaseStudyShape(copy);

  return (
    <section
      id="family-tree-creator-case-studies"
      aria-labelledby="family-tree-creator-case-studies-title"
      className="mx-auto max-w-7xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <header className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
        <h2
          id="family-tree-creator-case-studies-title"
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
          <FamilyTreeCreatorCaseStudyGroup key={caseGroup.id} caseGroup={caseGroup} />
        ))}
      </div>
    </section>
  );
}
