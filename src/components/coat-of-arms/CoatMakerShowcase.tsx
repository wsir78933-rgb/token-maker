import { CircularTestimonials } from '@/components/armor-creator/circular-testimonials';
import { getCoatMakerShowcaseCopy } from '@/components/coat-of-arms/coat-maker-showcase-copy';
import type { SiteLocale } from '@/lib/site-locale';

type CoatMakerShowcaseCopy = ReturnType<typeof getCoatMakerShowcaseCopy>;
type CoatMakerShowcaseGroup = CoatMakerShowcaseCopy['groups'][number];

function getCoatMakerShowcaseImagePosition(groupId: CoatMakerShowcaseGroup['id']): 'left' | 'right' {
  if (groupId === 'characters' || groupId === 'regions') {
    return 'right';
  }

  if (groupId === 'guilds') {
    return 'left';
  }

  throw new Error(
    `Unknown Coat Maker showcase group id. Received ${JSON.stringify(groupId)}.`,
  );
}

function getCoatMakerShowcaseGroupId(groupId: CoatMakerShowcaseGroup['id']): string {
  if (groupId === 'characters' || groupId === 'guilds' || groupId === 'regions') {
    return `coat-maker-showcase-${groupId}`;
  }

  throw new Error(
    `Unknown Coat Maker showcase group id. Received ${JSON.stringify(groupId)}.`,
  );
}

function renderCoatMakerShowcaseGroup(
  group: CoatMakerShowcaseGroup,
  copy: CoatMakerShowcaseCopy,
) {
  const groupId = getCoatMakerShowcaseGroupId(group.id);
  const groupHeadingId = `${groupId}-heading`;
  const imagePosition = getCoatMakerShowcaseImagePosition(group.id);

  return (
    <article
      key={group.id}
      aria-labelledby={groupHeadingId}
      className="border-t border-white/10 pt-12 first:border-t-0 first:pt-0 sm:pt-16"
      data-showcase-group={group.id}
    >
      <header className="mx-auto mb-8 max-w-2xl px-5 text-center sm:px-8 lg:px-12">
        <h3
          id={groupHeadingId}
          className="font-display text-2xl font-semibold leading-tight tracking-tight text-stone-50 text-balance sm:text-3xl"
        >
          {group.title}
        </h3>
        <p className="mt-3 text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {group.description}
        </p>
      </header>

      <CircularTestimonials
        testimonials={group.examples}
        ariaLabel={group.title}
        previousLabel={`${copy.previousLabel} — ${group.title}`}
        nextLabel={`${copy.nextLabel} — ${group.title}`}
        imagePosition={imagePosition}
        clipImageStack={false}
      />
    </article>
  );
}

function renderCoatMakerShowcaseGroups(
  copy: CoatMakerShowcaseCopy,
) {
  return <div className="space-y-12 sm:space-y-16">{copy.groups.map((group) => renderCoatMakerShowcaseGroup(group, copy))}</div>;
}

export function CoatMakerShowcase({ locale }: { locale: SiteLocale }) {
  const copy = getCoatMakerShowcaseCopy(locale);

  return (
    <section
      id="coat-maker-showcase"
      aria-label={copy.heading}
      className="mx-auto max-w-5xl py-20 text-stone-100 sm:py-24 lg:py-28"
      data-testid="coat-maker-showcase"
    >
      {renderCoatMakerShowcaseGroups(copy)}
    </section>
  );
}
