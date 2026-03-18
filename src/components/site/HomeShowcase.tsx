import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getHomeShowcase, type HomeShowcaseItem } from '@/lib/home-showcase';
import type { SiteLocale } from '@/lib/site-locale';
import { cn } from '@/lib/utils';
import {
  getPresetHref,
  getShowcaseCardImageSizes,
  getShowcaseText,
  toneClasses,
} from '@/components/site/home-showcase-shared';

function ShowcasePresetLink({
  locale,
  presetId,
  compact = false,
  className,
}: {
  locale: SiteLocale;
  presetId: string;
  compact?: boolean;
  className?: string;
}) {
  const presetLabel = getShowcaseText(locale, presetId);

  return (
    <Link
      href={getPresetHref(locale, presetId)}
      prefetch={false}
      aria-label={`${getShowcaseText(locale, 'showcaseApplyPreset')} ${presetLabel}`}
      className={cn(
        'inline-flex items-center gap-2 rounded-[min(var(--radius-md),12px)] border text-sm font-medium transition',
        compact
          ? 'justify-center border-border/60 bg-background/80 px-2.5 py-2 text-foreground hover:bg-muted'
          : 'justify-center border-white/12 bg-white/[0.06] px-3 py-2 text-white hover:border-white/20 hover:bg-white/[0.1]',
        className,
      )}
    >
      {compact ? getShowcaseText(locale, 'showcaseApplyShort') : getShowcaseText(locale, 'showcaseApplyPreset')}
      {!compact ? <ArrowRight className="h-3.5 w-3.5" /> : null}
    </Link>
  );
}

function ShowcaseCard({
  locale,
  item,
  featured = false,
}: {
  locale: SiteLocale;
  item: HomeShowcaseItem;
  featured?: boolean;
}) {
  const tone = toneClasses[item.tone];

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-[30px] border border-white/10 bg-black/25 p-3 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.76)]',
        featured ? 'h-full rounded-[34px] p-4' : '',
      )}
    >
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-90', tone.shell)} aria-hidden="true" />
      <div className={cn('absolute inset-0 opacity-90', tone.glow)} aria-hidden="true" />

      <div
        className={cn(
          'relative overflow-hidden border border-white/10 bg-black/35',
          featured ? 'rounded-[28px]' : 'rounded-[24px]',
        )}
      >
        <Image
          src={item.imageSrc}
          alt={item.alt}
          width={512}
          height={512}
          sizes={getShowcaseCardImageSizes(featured)}
          className={cn(
            'h-auto w-full transition duration-500 ease-out group-hover:scale-[1.04]',
            featured ? 'aspect-square object-contain p-3 sm:p-4' : 'aspect-square object-contain p-2.5',
          )}
        />
      </div>

      <div
        className={cn(
          'relative',
          featured ? 'mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between' : 'mt-4',
        )}
      >
        <div className={featured ? 'max-w-xl' : ''}>
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  'rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.18em]',
                  tone.chip,
                )}
              >
                {tag}
              </span>
            ))}
          </div>

          <h3
            className={cn(
              'mt-4 font-display text-stone-50',
              featured ? 'text-3xl sm:text-4xl' : 'text-xl',
            )}
          >
            {item.title}
          </h3>
          <p
            className={cn(
              'mt-3 leading-7 text-stone-300',
              featured ? 'max-w-2xl text-base' : 'text-sm',
            )}
          >
            {item.description}
          </p>
        </div>

        <div
          className={cn(
            'rounded-[24px] border border-white/10 bg-black/28',
            featured ? 'min-w-[220px] p-4' : 'mt-4 p-3',
          )}
        >
          <p className="text-[11px] uppercase tracking-[0.26em] text-stone-500">
            {getShowcaseText(locale, 'showcasePresetLabel')}
          </p>
          <p className="mt-2 text-sm font-medium text-stone-100">{getShowcaseText(locale, item.presetId)}</p>
          <ShowcasePresetLink
            locale={locale}
            presetId={item.presetId}
            className="mt-4 w-full"
          />
        </div>
      </div>
    </article>
  );
}

export function EditorShowcaseSection({ locale }: { locale: SiteLocale }) {
  const showcase = getHomeShowcase(locale);
  const [featured, ...rest] = showcase.gallery;

  if (!featured) {
    return null;
  }

  return (
    <section className="relative overflow-hidden border-y border-white/8 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.2))]">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(215,180,106,0.18),transparent_26%),radial-gradient(circle_at_82%_22%,rgba(106,142,191,0.16),transparent_26%)]"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8 lg:py-16">
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-[#d7b46a]" />
              <p className="text-xs uppercase tracking-[0.32em] text-[#d7b46a]">
                {getShowcaseText(locale, 'showcaseEyebrow')}
              </p>
            </div>
            <h2 className="mt-4 font-display text-3xl text-stone-50 sm:text-4xl lg:text-5xl">
              {getShowcaseText(locale, 'showcaseTitle')}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300 sm:text-base">
              {getShowcaseText(locale, 'showcaseDescription')}
            </p>
          </div>

          <div className="rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs uppercase tracking-[0.24em] text-stone-300">
            {getShowcaseText(locale, 'showcaseFeaturedLabel')}
          </div>
        </div>

        <div className="relative mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
          <ShowcaseCard locale={locale} item={featured} featured />

          <div className="grid gap-4 sm:grid-cols-2">
            {rest.map((item) => (
              <ShowcaseCard key={item.id} locale={locale} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
