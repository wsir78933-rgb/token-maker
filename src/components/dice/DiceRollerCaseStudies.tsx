'use client';

import {
  CircularTestimonials,
  type CircularTestimonial,
} from '@/components/armor-creator/circular-testimonials';
import type { DiceRollerCaseStudiesCopy } from '@/lib/site-content';

const DICE_ROLLER_CASE_GROUP_COUNT = 3;
const DICE_ROLLER_CASE_EXAMPLE_COUNT = 4;
const DICE_ROLLER_CASE_IMAGE_POSITIONS = ['right', 'left', 'right'] as const;

type DiceRollerCaseStudyGroupCopy = DiceRollerCaseStudiesCopy['groups'][number];
type DiceRollerCaseStudyExampleCopy = DiceRollerCaseStudyGroupCopy['examples'][number];

function assertDiceRollerCaseStudyShape(copy: DiceRollerCaseStudiesCopy): void {
  if (copy.groups.length !== DICE_ROLLER_CASE_GROUP_COUNT) {
    throw new Error(
      `Dice roller case studies must contain exactly ${DICE_ROLLER_CASE_GROUP_COUNT} groups. Received length ${copy.groups.length}.`,
    );
  }

  copy.groups.forEach((caseGroup, groupIndex) => {
    if (caseGroup.examples.length !== DICE_ROLLER_CASE_EXAMPLE_COUNT) {
      throw new Error(
        `Dice roller case group ${JSON.stringify(caseGroup.id)} must contain exactly ${DICE_ROLLER_CASE_EXAMPLE_COUNT} examples. Received length ${caseGroup.examples.length}.`,
      );
    }

    const expectedImagePosition = DICE_ROLLER_CASE_IMAGE_POSITIONS[groupIndex];
    if (caseGroup.imagePosition !== expectedImagePosition) {
      throw new Error(
        `Dice roller case group ${JSON.stringify(caseGroup.id)} at index ${groupIndex} must use imagePosition ${JSON.stringify(expectedImagePosition)}. Received ${JSON.stringify(caseGroup.imagePosition)}.`,
      );
    }
  });
}

function createDiceRollerTestimonial(
  example: DiceRollerCaseStudyExampleCopy,
  exampleIndex: number,
  exampleCount: number,
  copy: DiceRollerCaseStudiesCopy,
): CircularTestimonial {
  return {
    quote: `${example.quote} ${copy.rollValuesLabel} ${example.rolledValues.join(', ')}`,
    name: example.name,
    designation: `${copy.caseLabel} ${exampleIndex + 1}/${exampleCount} · ${example.expression} · ${copy.exampleTotalLabel}: ${example.exampleTotal}`,
    src: example.src,
    alt: example.alt,
  };
}

function createDiceRollerTestimonials(
  examples: readonly DiceRollerCaseStudyExampleCopy[],
  copy: DiceRollerCaseStudiesCopy,
): CircularTestimonial[] {
  return examples.map((example, exampleIndex) =>
    createDiceRollerTestimonial(example, exampleIndex, examples.length, copy),
  );
}

function DiceRollerCaseStudyGroup({
  caseGroup,
  copy,
}: {
  caseGroup: DiceRollerCaseStudyGroupCopy;
  copy: DiceRollerCaseStudiesCopy;
}) {
  return (
    <article
      aria-label={caseGroup.carouselLabel}
      className="flex flex-col"
      data-dice-case-group={caseGroup.id}
      data-image-position={caseGroup.imagePosition}
    >
      <h3 className="mb-4 text-center font-display text-xl font-semibold tracking-tight text-stone-50">
        {caseGroup.title}
      </h3>
      <CircularTestimonials
        testimonials={createDiceRollerTestimonials(caseGroup.examples, copy)}
        ariaLabel={caseGroup.carouselLabel}
        previousLabel={caseGroup.previousLabel}
        nextLabel={caseGroup.nextLabel}
        autoplay={false}
        colors={{ imageBackground: '#080910' }}
        imagePosition={caseGroup.imagePosition}
        clipImageStack={false}
      />
    </article>
  );
}

export function DiceRollerCaseStudies({
  copy,
}: {
  copy: DiceRollerCaseStudiesCopy;
}) {
  assertDiceRollerCaseStudyShape(copy);

  return (
    <section
      id="dice-roller-case-studies"
      aria-labelledby="dice-roller-case-studies-title"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <header className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
        <h2
          id="dice-roller-case-studies-title"
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
          <DiceRollerCaseStudyGroup key={caseGroup.id} caseGroup={caseGroup} copy={copy} />
        ))}
      </div>
    </section>
  );
}
