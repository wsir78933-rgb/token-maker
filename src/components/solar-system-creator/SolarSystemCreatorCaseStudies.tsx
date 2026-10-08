import { CircularTestimonials } from '@/components/solar-system-creator/CircularTestimonials';
import type { SolarSystemCaseStudiesCopy } from '@/lib/solar-system-creator/case-studies';

const EXPECTED_GROUP_COUNT = 3;
const EXPECTED_EXAMPLE_COUNT = 4;
const EXPECTED_IMAGE_POSITIONS: readonly ('left' | 'right')[] = ['left', 'right', 'left'];

export type SolarSystemCreatorCaseStudiesProps = {
  copy: SolarSystemCaseStudiesCopy;
};

function describeValue(value: unknown): string {
  if (typeof value === 'string') return JSON.stringify(value);
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') return String(value);
  return Object.prototype.toString.call(value);
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function requireText(value: unknown, field: string): string {
  if (typeof value === 'string' && value.trim().length > 0) return value;
  throw new Error(`Solar system case studies ${field} must be a non-empty string. Received ${describeValue(value)}.`);
}

function requireCaseStudyGroups(value: unknown): asserts value is SolarSystemCaseStudiesCopy {
  if (!isPlainRecord(value)) {
    throw new Error(`Solar system case studies copy must be a plain object. Received ${describeValue(value)}.`);
  }

  requireText(value.title, 'copy.title');
  requireText(value.description, 'copy.description');
  if (!Array.isArray(value.groups)) {
    throw new Error(`Solar system case studies copy.groups must be an array. Received ${describeValue(value.groups)}.`);
  }

  const groups = value.groups;
  if (groups.length !== EXPECTED_GROUP_COUNT) {
    throw new Error(
      `Solar system case studies must contain ${EXPECTED_GROUP_COUNT} groups. Received ${groups.length}.`,
    );
  }

  groups.forEach((group, groupIndex) => {
    if (!isPlainRecord(group)) {
      throw new Error(
        `Solar system case studies copy.groups[${groupIndex}] must be a plain object. Received ${describeValue(group)}.`,
      );
    }

    requireText(group.id, `copy.groups[${groupIndex}].id`);
    requireText(group.carouselLabel, `copy.groups[${groupIndex}].carouselLabel`);
    requireText(group.previousLabel, `copy.groups[${groupIndex}].previousLabel`);
    requireText(group.nextLabel, `copy.groups[${groupIndex}].nextLabel`);
    if (group.imagePosition !== EXPECTED_IMAGE_POSITIONS[groupIndex]) {
      throw new Error(
        `Solar system case studies copy.groups[${groupIndex}].imagePosition must be ${JSON.stringify(EXPECTED_IMAGE_POSITIONS[groupIndex])}. Received ${describeValue(group.imagePosition)}.`,
      );
    }

    if (!Array.isArray(group.examples)) {
      throw new Error(
        `Solar system case studies copy.groups[${groupIndex}].examples must be an array. Received ${describeValue(group.examples)}.`,
      );
    }

    if (group.examples.length !== EXPECTED_EXAMPLE_COUNT) {
      throw new Error(
        `Solar system case study group ${JSON.stringify(group.id)} must contain ${EXPECTED_EXAMPLE_COUNT} examples. Received ${group.examples.length}.`,
      );
    }
  });
}

export function SolarSystemCreatorCaseStudies({ copy }: SolarSystemCreatorCaseStudiesProps) {
  requireCaseStudyGroups(copy);

  return (
    <section
      id="solar-system-creator-case-studies"
      aria-labelledby="solar-system-creator-case-studies-title"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <header className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
        <h2
          id="solar-system-creator-case-studies-title"
          className="font-display font-semibold tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {copy.title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-stone-300 text-pretty sm:text-base">{copy.description}</p>
      </header>

      <div className="flex flex-col gap-8">
        {copy.groups.map((group) => (
          <article
            key={group.id}
            data-solar-case-group={group.id}
            data-image-position={group.imagePosition}
            aria-label={group.carouselLabel}
          >
            <CircularTestimonials
              testimonials={group.examples}
              ariaLabel={group.carouselLabel}
              previousLabel={group.previousLabel}
              nextLabel={group.nextLabel}
              imagePosition={group.imagePosition}
            />
          </article>
        ))}
      </div>
    </section>
  );
}
