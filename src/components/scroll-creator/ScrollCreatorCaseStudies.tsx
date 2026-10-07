import { ScrollCreatorCaseStudyGroup } from '@/components/scroll-creator/ScrollCreatorCaseStudyGroup';
import type {
  ScrollCreatorCaseStudiesCopy,
} from '@/lib/scroll-creator/case-studies';
import { getScrollCreatorCaseStudies } from '@/lib/scroll-creator/case-studies';
import type { ScrollLocale } from '@/lib/scroll-creator/types';

const SCROLL_CREATOR_CASE_GROUP_COUNT = 3;
const SCROLL_CREATOR_CASE_EXAMPLE_COUNT = 4;

function assertScrollCreatorCaseStudyShape(copy: ScrollCreatorCaseStudiesCopy): void {
  if (copy.groups.length !== SCROLL_CREATOR_CASE_GROUP_COUNT) {
    throw new Error(
      `Scroll creator case studies must contain exactly ${SCROLL_CREATOR_CASE_GROUP_COUNT} groups. Received length ${copy.groups.length}.`,
    );
  }

  for (const caseGroup of copy.groups) {
    if (caseGroup.examples.length !== SCROLL_CREATOR_CASE_EXAMPLE_COUNT) {
      throw new Error(
        `Scroll creator case group ${JSON.stringify(caseGroup.id)} must contain exactly ${SCROLL_CREATOR_CASE_EXAMPLE_COUNT} examples. Received length ${caseGroup.examples.length}.`,
      );
    }
  }
}

export function ScrollCreatorCaseStudies({ locale }: { locale: ScrollLocale }) {
  const copy = getScrollCreatorCaseStudies(locale);
  assertScrollCreatorCaseStudyShape(copy);

  return (
    <section
      id="scroll-creator-case-studies"
      aria-labelledby="scroll-creator-case-studies-title"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 print:hidden sm:py-24 lg:px-8 lg:py-28"
    >
      <header className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
        <h2
          id="scroll-creator-case-studies-title"
          className="font-display font-semibold leading-tight tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {copy.title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-stone-300 text-pretty sm:text-base">{copy.description}</p>
      </header>

      <div className="flex flex-col gap-10 sm:gap-12 lg:gap-14">
        {copy.groups.map((caseGroup) => (
          <ScrollCreatorCaseStudyGroup
            key={caseGroup.id}
            caseGroup={caseGroup}
            viewImageLabel={copy.viewImageLabel}
            closeImageLabel={copy.closeImageLabel}
          />
        ))}
      </div>
    </section>
  );
}
