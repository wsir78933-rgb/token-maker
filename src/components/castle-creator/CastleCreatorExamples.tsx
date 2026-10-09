import { CircularTestimonials } from '@/components/armor-creator/circular-testimonials';
import type {
  CastleCreatorExampleGroup,
  CastleCreatorExamplesCopy,
} from '@/lib/castle-creator/examples';

const CASTLE_CREATOR_EXAMPLE_GROUP_COUNT = 3;
const CASTLE_CREATOR_EXAMPLE_ITEM_COUNT = 4;

function assertCastleCreatorExamplesShape(copy: CastleCreatorExamplesCopy): void {
  if (copy.groups.length !== CASTLE_CREATOR_EXAMPLE_GROUP_COUNT) {
    throw new Error(
      `Castle creator examples must contain exactly ${CASTLE_CREATOR_EXAMPLE_GROUP_COUNT} groups. Received length ${copy.groups.length}.`,
    );
  }

  for (const exampleGroup of copy.groups) {
    if (exampleGroup.items.length !== CASTLE_CREATOR_EXAMPLE_ITEM_COUNT) {
      throw new Error(
        `Castle creator example group ${JSON.stringify(exampleGroup.id)} must contain exactly ${CASTLE_CREATOR_EXAMPLE_ITEM_COUNT} items. Received length ${exampleGroup.items.length}.`,
      );
    }
  }
}

function CastleCreatorExampleGroupSection({
  exampleGroup,
  previousLabel,
  nextLabel,
}: {
  exampleGroup: CastleCreatorExampleGroup;
  previousLabel: string;
  nextLabel: string;
}) {
  const groupHeadingId = `castle-creator-examples-${exampleGroup.id}-heading`;

  return (
    <article
      aria-labelledby={groupHeadingId}
      className="flex flex-col"
      data-example-group={exampleGroup.id}
      data-image-position={exampleGroup.imagePosition}
    >
      <h3
        id={groupHeadingId}
        className="text-center font-display text-xl font-semibold tracking-tight text-stone-100 sm:text-2xl"
      >
        {exampleGroup.title}
      </h3>
      <div className="mt-6">
        <CircularTestimonials
          testimonials={exampleGroup.items}
          ariaLabel={exampleGroup.title}
          previousLabel={previousLabel}
          nextLabel={nextLabel}
          autoplay={false}
          colors={{ imageBackground: '#f3efe8' }}
          imagePosition={exampleGroup.imagePosition}
          clipImageStack={false}
        />
      </div>
    </article>
  );
}

export function CastleCreatorExamples({
  copy,
}: {
  copy: CastleCreatorExamplesCopy;
}) {
  assertCastleCreatorExamplesShape(copy);

  return (
    <section
      id="castle-creator-examples"
      aria-labelledby="castle-creator-examples-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28 [&_img]:object-contain!"
      data-testid="castle-creator-examples"
    >
      <header className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d7b46a]">
          {copy.eyebrow}
        </p>
        <h2
          id="castle-creator-examples-heading"
          className="mt-3 font-display font-semibold leading-tight tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {copy.title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {copy.description}
        </p>
      </header>

      <div className="flex flex-col gap-14 sm:gap-16 lg:gap-20">
        {copy.groups.map((exampleGroup) => (
          <CastleCreatorExampleGroupSection
            key={exampleGroup.id}
            exampleGroup={exampleGroup}
            previousLabel={copy.previousLabel}
            nextLabel={copy.nextLabel}
          />
        ))}
      </div>
    </section>
  );
}
