import Image from 'next/image';
import { EditorLaunchButton } from '@/components/site/EditorLaunchButton';
import { getHomeShowcase } from '@/lib/home-showcase';
import type { SiteLocale } from '@/lib/site-locale';
import { cn } from '@/lib/utils';
import {
  QUICK_START_IMAGE_SIZES,
  getPresetHref,
  getShowcaseText,
  toneClasses,
} from '@/components/site/home-showcase-shared';

export function ImageUploaderShowcaseStrip({ locale }: { locale: SiteLocale }) {
  const items = getHomeShowcase(locale).quickStart;

  return (
    <div className="mt-6 w-full max-w-[27rem] rounded-[28px] border border-border/60 bg-background/60 p-3 shadow-[0_26px_80px_-56px_var(--workspace-shadow-color)] backdrop-blur-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary/85">
            {getShowcaseText(locale, 'showcaseQuickStartEyebrow')}
          </p>
          <h4 className="mt-1 text-sm font-semibold text-foreground">
            {getShowcaseText(locale, 'showcaseQuickStartTitle')}
          </h4>
        </div>
        <span className="rounded-full border border-border/60 bg-background/70 px-2.5 py-1 text-[10px] text-muted-foreground">
          {getShowcaseText(locale, 'showcaseQuickStartHint')}
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
                  sizes={QUICK_START_IMAGE_SIZES}
                  className="aspect-square w-full object-contain p-2 transition duration-500 group-hover:scale-[1.04]"
                />
              </div>

              <div className="mt-2">
                <h5 className="truncate text-[11px] font-semibold leading-4 text-foreground">{item.title}</h5>
                <p className="mt-1 truncate text-[10px] text-muted-foreground">
                  {getShowcaseText(locale, 'showcasePresetLabel')} {getShowcaseText(locale, item.presetId)}
                </p>
              </div>

              <EditorLaunchButton
                href={getPresetHref(locale, item.presetId)}
                className="mt-2 inline-flex w-full justify-center rounded-[min(var(--radius-md),12px)] border border-border/60 bg-background/80 px-2.5 py-2 text-xs font-medium text-foreground transition hover:bg-muted"
              >
                {getShowcaseText(locale, 'showcaseApplyShort')}
              </EditorLaunchButton>
            </article>
          );
        })}
      </div>
    </div>
  );
}
