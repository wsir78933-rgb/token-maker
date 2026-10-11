import { CircularTestimonials } from '@/components/armor-creator/circular-testimonials';
import { getNoticeBoardCreatorCaseStudiesCopy } from '@/lib/notice-board-creator/case-studies';
import type { SiteLocale } from '@/lib/site-locale';

const NOTICE_BOARD_CREATOR_CASE_IMAGE_ASPECT_RATIO = 1696 / 1200;

export function NoticeBoardCreatorCaseStudies({ locale }: { locale: SiteLocale }) {
  const pageCopy = getNoticeBoardCreatorCaseStudiesCopy(locale);

  return (
    <section
      id="notice-board-creator-case-studies"
      aria-labelledby="notice-board-creator-case-studies-heading"
      className="mx-auto max-w-5xl py-20 text-stone-100 sm:py-24 lg:py-28"
    >
      <header className="mx-auto max-w-3xl px-5 text-center sm:px-8 lg:px-12">
        <h2
          id="notice-board-creator-case-studies-heading"
          className="font-display font-semibold leading-tight tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {pageCopy.title}
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {pageCopy.description}
        </p>
      </header>

      <div className="mt-10 flex flex-col gap-16 sm:mt-12 sm:gap-20">
        {pageCopy.groups.map((group) => (
          <CircularTestimonials
            key={group.id}
            ariaLabel={group.ariaLabel}
            autoplay={false}
            clipImageStack={false}
            imageAspectRatio={NOTICE_BOARD_CREATOR_CASE_IMAGE_ASPECT_RATIO}
            imagePosition={group.imagePosition}
            imageShape="landscape"
            nextLabel={pageCopy.nextLabel}
            previousLabel={pageCopy.previousLabel}
            showImageFrame={false}
            testimonials={group.items}
          />
        ))}
      </div>
    </section>
  );
}
