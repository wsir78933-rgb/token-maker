'use client';

import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

import { useI18n, type I18nKey } from '@/lib/i18n';
import { getHomeShowcase, type HomeShowcaseItem, type HomeShowcaseTone } from '@/lib/home-showcase';
import { type SiteLocale } from '@/lib/site-locale';
import { STYLE_PRESETS } from '@/lib/templates/presets';
import { useEditorStore } from '@/lib/store/editor-store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function focusWorkspace() {
  const workspace = document.getElementById('editor-workspace');

  if (!(workspace instanceof HTMLElement)) {
    return;
  }

  workspace.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.setTimeout(() => {
    workspace.focus({ preventScroll: true });
  }, 320);
}

const toneClasses: Record<HomeShowcaseTone, { shell: string; chip: string; glow: string }> = {
  gold: {
    shell: 'from-[#f4e0a6]/18 via-white/6 to-transparent',
    chip: 'border-[#e3be6a]/35 bg-[#d7b46a]/12 text-[#f7ddb0]',
    glow: 'bg-[radial-gradient(circle_at_top,rgba(231,194,112,0.22),transparent_58%)]',
  },
  grave: {
    shell: 'from-emerald-300/12 via-white/6 to-transparent',
    chip: 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100',
    glow: 'bg-[radial-gradient(circle_at_top,rgba(113,255,174,0.16),transparent_58%)]',
  },
  ember: {
    shell: 'from-[#ff9a52]/22 via-white/6 to-transparent',
    chip: 'border-[#ff9a52]/30 bg-[#ff9a52]/12 text-[#ffd7b7]',
    glow: 'bg-[radial-gradient(circle_at_top,rgba(255,137,58,0.24),transparent_56%)]',
  },
  violet: {
    shell: 'from-[#8f7cff]/20 via-white/6 to-transparent',
    chip: 'border-[#9d92ff]/28 bg-[#8f7cff]/12 text-[#e3ddff]',
    glow: 'bg-[radial-gradient(circle_at_top,rgba(154,126,255,0.18),transparent_58%)]',
  },
  ice: {
    shell: 'from-[#93d5ff]/20 via-white/6 to-transparent',
    chip: 'border-[#93d5ff]/30 bg-[#93d5ff]/12 text-[#dff4ff]',
    glow: 'bg-[radial-gradient(circle_at_top,rgba(130,207,255,0.2),transparent_56%)]',
  },
  steel: {
    shell: 'from-white/14 via-white/6 to-transparent',
    chip: 'border-white/16 bg-white/8 text-stone-200',
    glow: 'bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_58%)]',
  },
};

function ShowcasePresetButton({
  presetId,
  compact = false,
  className,
}: {
  presetId: string;
  compact?: boolean;
  className?: string;
}) {
  const { t } = useI18n();
  const activePresetId = useEditorStore((state) => state.activePresetId);
  const applyPreset = useEditorStore((state) => state.applyPreset);
  const preset = STYLE_PRESETS.find((item) => item.id === presetId);

  if (!preset) {
    return null;
  }

  const isActive = activePresetId === presetId;

  return (
    <Button
      type="button"
      size={compact ? 'xs' : 'sm'}
      variant={isActive ? 'secondary' : 'outline'}
      className={cn(
        'border-white/12 bg-white/[0.06] text-white hover:border-white/20 hover:bg-white/[0.1]',
        isActive && 'border-[#d7b46a]/30 bg-[#d7b46a]/12 text-[#f8e4b7] hover:bg-[#d7b46a]/16',
        className,
      )}
      onClick={() => {
        applyPreset(preset);
        focusWorkspace();
      }}
      aria-label={`${t('showcaseApplyPreset')} ${t(preset.name as I18nKey)}`}
    >
      {isActive ? t('showcaseApplied') : compact ? t('showcaseApplyShort') : t('showcaseApplyPreset')}
      {!compact ? <ArrowRight className="h-3.5 w-3.5" /> : null}
    </Button>
  );
}

function ShowcaseCard({
  item,
  featured = false,
}: {
  item: HomeShowcaseItem;
  featured?: boolean;
}) {
  const { t } = useI18n();
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

      <div className={cn('relative overflow-hidden border border-white/10 bg-black/35', featured ? 'rounded-[28px]' : 'rounded-[24px]')}>
        <Image
          src={item.imageSrc}
          alt={item.alt}
          width={512}
          height={512}
          className={cn(
            'h-auto w-full transition duration-500 ease-out group-hover:scale-[1.04]',
            featured ? 'aspect-square object-contain p-3 sm:p-4' : 'aspect-square object-contain p-2.5',
          )}
        />
      </div>

      <div className={cn('relative', featured ? 'mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between' : 'mt-4')}>
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

          <h3 className={cn('mt-4 font-display text-stone-50', featured ? 'text-3xl sm:text-4xl' : 'text-xl')}>
            {item.title}
          </h3>
          <p className={cn('mt-3 leading-7 text-stone-300', featured ? 'max-w-2xl text-base' : 'text-sm')}>
            {item.description}
          </p>
        </div>

        <div
          className={cn(
            'rounded-[24px] border border-white/10 bg-black/28',
            featured ? 'min-w-[220px] p-4' : 'mt-4 p-3',
          )}
        >
          <p className="text-[11px] uppercase tracking-[0.26em] text-stone-500">{t('showcasePresetLabel')}</p>
          <p className="mt-2 text-sm font-medium text-stone-100">{t(item.presetId as I18nKey)}</p>
          <ShowcasePresetButton presetId={item.presetId} className="mt-4 w-full justify-center" />
        </div>
      </div>
    </article>
  );
}

export function ImageUploaderShowcaseStrip() {
  const { locale, t } = useI18n();
  const items = getHomeShowcase(locale).quickStart;

  return (
    <div className="mt-6 w-full max-w-[27rem] rounded-[28px] border border-border/60 bg-background/60 p-3 shadow-[0_26px_80px_-56px_var(--workspace-shadow-color)] backdrop-blur-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary/85">{t('showcaseQuickStartEyebrow')}</p>
          <h4 className="mt-1 text-sm font-semibold text-foreground">{t('showcaseQuickStartTitle')}</h4>
        </div>
        <span className="rounded-full border border-border/60 bg-background/70 px-2.5 py-1 text-[10px] text-muted-foreground">
          {t('showcaseQuickStartHint')}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2.5">
        {items.map((item) => {
          const tone = toneClasses[item.tone];

          return (
            <article
              key={item.id}
              className="group rounded-[20px] border border-border/55 bg-background/70 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
            >
              <div className={cn('relative overflow-hidden rounded-[16px] bg-gradient-to-br', tone.shell)}>
                <Image
                  src={item.imageSrc}
                  alt={item.alt}
                  width={512}
                  height={512}
                  className="aspect-square w-full object-contain p-2 transition duration-500 group-hover:scale-[1.04]"
                />
              </div>

              <div className="mt-2">
                <h5 className="truncate text-[11px] font-semibold leading-4 text-foreground">{item.title}</h5>
                <p className="mt-1 truncate text-[10px] text-muted-foreground">
                  {t('showcasePresetLabel')} {t(item.presetId as I18nKey)}
                </p>
              </div>

              <ShowcasePresetButton
                presetId={item.presetId}
                compact
                className="mt-2 w-full justify-center border-border/60 bg-background/80 text-foreground hover:bg-muted"
              />
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function EditorShowcaseSection({ locale }: { locale: SiteLocale }) {
  const { t } = useI18n();
  const showcase = getHomeShowcase(locale);
  const [featured, ...rest] = showcase.gallery;

  if (!featured) {
    return null;
  }

  return (
    <section className="relative overflow-hidden border-y border-white/8 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.2))]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(215,180,106,0.18),transparent_26%),radial-gradient(circle_at_82%_22%,rgba(106,142,191,0.16),transparent_26%)]" aria-hidden="true" />
      <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8 lg:py-16">
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-[#d7b46a]" />
              <p className="text-xs uppercase tracking-[0.32em] text-[#d7b46a]">{t('showcaseEyebrow')}</p>
            </div>
            <h2 className="mt-4 font-display text-3xl text-stone-50 sm:text-4xl lg:text-5xl">{t('showcaseTitle')}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300 sm:text-base">{t('showcaseDescription')}</p>
          </div>

          <div className="rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs uppercase tracking-[0.24em] text-stone-300">
            {t('showcaseFeaturedLabel')}
          </div>
        </div>

        <div className="relative mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
          <ShowcaseCard item={featured} featured />

          <div className="grid gap-4 sm:grid-cols-2">
            {rest.map((item) => (
              <ShowcaseCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
