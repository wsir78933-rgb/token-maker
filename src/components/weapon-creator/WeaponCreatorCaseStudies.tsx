import { CircularTestimonials } from '@/components/armor-creator/circular-testimonials';
import type {
  WeaponCreatorCaseStudiesCopy,
  WeaponCreatorCaseStudyGroupCopy,
} from '@/lib/weapon-creator/copy';

const WEAPON_CREATOR_CASE_GROUP_COUNT = 3;
const WEAPON_CREATOR_CASE_EXAMPLE_COUNT = 4;

function assertWeaponCreatorCaseStudyShape(copy: WeaponCreatorCaseStudiesCopy): void {
  if (copy.groups.length !== WEAPON_CREATOR_CASE_GROUP_COUNT) {
    throw new Error(
      `Weapon creator case studies must contain exactly ${WEAPON_CREATOR_CASE_GROUP_COUNT} groups. Received length ${copy.groups.length}.`,
    );
  }

  for (const caseGroup of copy.groups) {
    if (caseGroup.examples.length !== WEAPON_CREATOR_CASE_EXAMPLE_COUNT) {
      throw new Error(
        `Weapon creator case group ${JSON.stringify(caseGroup.id)} must contain exactly ${WEAPON_CREATOR_CASE_EXAMPLE_COUNT} examples. Received length ${caseGroup.examples.length}.`,
      );
    }
  }
}

function WeaponCreatorCaseStudyGroup({
  caseGroup,
}: {
  caseGroup: WeaponCreatorCaseStudyGroupCopy;
}) {
  return (
    <article
      aria-label={caseGroup.carouselLabel}
      className="flex flex-col"
      data-image-position={caseGroup.imagePosition}
      data-weapon-case-group={caseGroup.id}
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

export function WeaponCreatorCaseStudies({
  copy,
}: {
  copy: WeaponCreatorCaseStudiesCopy;
}) {
  assertWeaponCreatorCaseStudyShape(copy);

  return (
    <section
      id="weapon-creator-case-studies"
      aria-labelledby="weapon-creator-case-studies-title"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <header className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
        <h2
          id="weapon-creator-case-studies-title"
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
          <WeaponCreatorCaseStudyGroup key={caseGroup.id} caseGroup={caseGroup} />
        ))}
      </div>
    </section>
  );
}
