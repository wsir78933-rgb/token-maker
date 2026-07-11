'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useI18n, type I18nKey } from '@/lib/i18n';
import { trackApplyBorder } from '@/lib/analytics';
import {
  getVisibleBorderTemplates,
} from '@/lib/templates/borders';
import { STYLE_PRESETS } from '@/lib/templates/presets';
import { drawBorderThumbnail } from '@/lib/renderer/borders';
import { Button } from '@/components/ui/button';
import type { BorderTemplate, ExportSize } from '@/types/editor';
import { DownloadCloud, Plus, Trash2 } from 'lucide-react';
import { preloadImageToCache } from '@/lib/utils/imageCache';
import { downloadCurrentTokenWithSharePrompt, getLocalizedName } from './export-token';
import { useBorderTemplatesState, useTemplatePanelState } from './editor-store-hooks';

const SIZES: ExportSize[] = [256, 512, 1024, 2048];
const MAX_CUSTOM_BORDERS = 8;
const SUPPORTED_CUSTOM_BORDER_NAME = /\.(png|jpe?g|webp|svg)$/i;
const SUPPORTED_CUSTOM_BORDER_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
]);

function isSupportedCustomBorderFile(file: File) {
  return SUPPORTED_CUSTOM_BORDER_TYPES.has(file.type) || SUPPORTED_CUSTOM_BORDER_NAME.test(file.name);
}

function createTemporaryCustomBorderUrl(file: File) {
  if (typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') {
    throw new Error(`URL.createObjectURL is unavailable for custom border file: ${file.name}`);
  }

  return URL.createObjectURL(file);
}

function revokeTemporaryCustomBorderUrl(customBorderUrl: string | null) {
  if (
    !customBorderUrl ||
    !customBorderUrl.startsWith('blob:') ||
    typeof URL === 'undefined' ||
    typeof URL.revokeObjectURL !== 'function'
  ) {
    return;
  }

  URL.revokeObjectURL(customBorderUrl);
}

function getNearestScrollOffset(
  containerScrollOffset: number,
  containerVisibleSize: number,
  itemOffset: number,
  itemSize: number
) {
  if (itemOffset < containerScrollOffset) {
    return itemOffset;
  }

  const itemEndOffset = itemOffset + itemSize;
  const containerVisibleEndOffset = containerScrollOffset + containerVisibleSize;

  if (itemEndOffset > containerVisibleEndOffset) {
    return itemEndOffset - containerVisibleSize;
  }

  return containerScrollOffset;
}

function getElementOffsetInsideScrollContainer(
  scrollContainer: HTMLElement,
  targetElement: HTMLElement,
  axis: 'horizontal' | 'vertical'
) {
  const scrollContainerRect = scrollContainer.getBoundingClientRect();
  const targetElementRect = targetElement.getBoundingClientRect();

  if (axis === 'horizontal') {
    return scrollContainer.scrollLeft + targetElementRect.left - scrollContainerRect.left;
  }

  return scrollContainer.scrollTop + targetElementRect.top - scrollContainerRect.top;
}

function scrollBorderGridToActiveButton(
  bordersGridElement: HTMLDivElement,
  activeBorderButton: HTMLElement
) {
  const activeBorderLeft = getElementOffsetInsideScrollContainer(
    bordersGridElement,
    activeBorderButton,
    'horizontal'
  );
  const activeBorderTop = getElementOffsetInsideScrollContainer(
    bordersGridElement,
    activeBorderButton,
    'vertical'
  );
  const activeBorderRect = activeBorderButton.getBoundingClientRect();
  const nextScrollLeft = getNearestScrollOffset(
    bordersGridElement.scrollLeft,
    bordersGridElement.clientWidth,
    activeBorderLeft,
    activeBorderRect.width
  );
  const nextScrollTop = getNearestScrollOffset(
    bordersGridElement.scrollTop,
    bordersGridElement.clientHeight,
    activeBorderTop,
    activeBorderRect.height
  );

  if (typeof bordersGridElement.scrollTo === 'function') {
    bordersGridElement.scrollTo({
      left: nextScrollLeft,
      top: nextScrollTop,
      behavior: 'smooth',
    });
    return;
  }

  bordersGridElement.scrollLeft = nextScrollLeft;
  bordersGridElement.scrollTop = nextScrollTop;
}

function getCustomBorderErrorCopy(locale: 'en' | 'zh') {
  return {
    unsupported:
      locale === 'zh'
        ? '请上传 PNG、JPG、WEBP 或 SVG 边框文件。'
        : 'Upload a PNG, JPG, WEBP, or SVG border file.',
    tooMany:
      locale === 'zh'
        ? `最多保留 ${MAX_CUSTOM_BORDERS} 个自定义边框，请先删除旧边框。`
        : `Keep at most ${MAX_CUSTOM_BORDERS} custom borders. Remove one before adding more.`,
    failed:
      locale === 'zh'
        ? '读取这个边框失败，请换一个文件再试。'
        : 'Failed to read this border. Try another file.',
  };
}

export function TemplatePanel() {
  const { t, locale } = useI18n();
  const { activePresetId, exportSize, imageElement, applyPreset, setExportSize } =
    useTemplatePanelState();

  const handleExport = async () => {
    await downloadCurrentTokenWithSharePrompt(t, locale);
  };

  return (
    <div className="order-4 flex w-full flex-col overflow-visible border-y border-border bg-card/65 backdrop-blur xl:order-none xl:h-full xl:w-[var(--editor-side-panel-width)] xl:overflow-hidden xl:border-y-0 xl:border-l">

      {/* ── 顶部固定标题栏 ── */}
      <div className="shrink-0 border-b border-border/50 px-4 py-3 sm:py-4">
        <h3 className="text-sm font-semibold text-foreground/90">{t('templatePanel')}</h3>
      </div>

      <div className="flex-none space-y-6 overflow-visible px-4 py-4 sm:space-y-8 sm:py-6 xl:flex-1 xl:space-y-4 xl:overflow-y-auto">
        
        {/* 风格预设 */}
        <div className="space-y-4 xl:space-y-2">
          <h3 className="text-sm font-semibold text-foreground/90">{t('presets')}</h3>
          <div className="grid grid-cols-3 gap-2 min-[480px]:grid-cols-4 md:grid-cols-6 xl:grid-cols-4">
            {STYLE_PRESETS.map((preset) => {
              const isActive = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className={`flex aspect-square flex-col items-center justify-center rounded-lg border p-2 transition-all xl:aspect-auto xl:h-16 xl:p-1.5 ${
                    isActive
                      ? 'border-primary bg-primary/10 text-primary shadow-[0_12px_28px_-18px_color-mix(in_oklab,var(--color-primary)_75%,transparent)]'
                      : 'border-border/50 hover:border-primary/50 hover:bg-accent text-muted-foreground hover:text-foreground'
                  }`}
                  title={t(preset.name as I18nKey)}
                >
                  <span className="mb-1 text-xl xl:mb-0.5 xl:text-lg">{preset.icon}</span>
                  <span className="text-[10px] leading-tight whitespace-nowrap xl:text-[9px]">{t(preset.name as I18nKey)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <BorderTemplatesSection className="hidden xl:block" />

      </div>

      {/* ── 底部固定导出栏 ── */}
      <div className="shrink-0 space-y-3 border-t border-border bg-card/92 p-4 shadow-[0_-10px_40px_-15px_var(--workspace-shadow-color)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-medium text-foreground/80">{t('exportSection')}</span>
          <div className="flex rounded-md bg-muted/50 p-1">
            {SIZES.map(size => (
              <button
                key={size}
                onClick={() => setExportSize(size)}
                className={`rounded px-2 py-1 text-[10px] transition-colors ${
                  exportSize === size
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <Button
          className="hidden w-full font-medium xl:inline-flex"
          size="default"
          onClick={handleExport}
          disabled={!imageElement}
        >
          <DownloadCloud className="mr-2 h-4 w-4" />
          {t('download')}
        </Button>
      </div>

    </div>
  );
}

export function MobileBorderTemplatesPanel() {
  return (
    <div className="order-2 flex w-full flex-col overflow-visible border-y border-border bg-card/65 backdrop-blur xl:hidden">
      <div className="px-4 py-4 sm:py-6">
        <BorderTemplatesSection />
      </div>
    </div>
  );
}

function BorderTemplatesSection({ className = '' }: { className?: string }) {
  const { t, locale } = useI18n();
  const {
    activePresetId,
    selectedBorderId,
    customBorders,
    borderLibraryMode,
    setSelectedBorder,
    addCustomBorder,
    removeCustomBorder,
  } = useBorderTemplatesState();
  const bordersGridRef = useRef<HTMLDivElement>(null);
  const [customBorderError, setCustomBorderError] = useState<string | null>(null);
  const visibleBorderTemplates = getVisibleBorderTemplates({
    activePresetId,
    selectedBorderId,
    borderLibraryMode,
  });
  const borderInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const grid = bordersGridRef.current;
    if (!grid) return;

    const activeBorderButton = grid.querySelector<HTMLElement>(
      `[data-border-id="${CSS.escape(selectedBorderId)}"]`
    );

    if (!activeBorderButton) return;

    scrollBorderGridToActiveButton(grid, activeBorderButton);
  }, [selectedBorderId]);

  const handleUploadBorder = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const errorCopy = getCustomBorderErrorCopy(locale);

    const resetInput = () => {
      if (borderInputRef.current) borderInputRef.current.value = '';
    };

    if (customBorders.length >= MAX_CUSTOM_BORDERS) {
      setCustomBorderError(errorCopy.tooMany);
      resetInput();
      return;
    }

    if (!isSupportedCustomBorderFile(file)) {
      setCustomBorderError(errorCopy.unsupported);
      resetInput();
      return;
    }

    let customBorderUrl: string | null = null;
    try {
      customBorderUrl = createTemporaryCustomBorderUrl(file);
      await preloadImageToCache(customBorderUrl);
      const newId = `custom-border-${Date.now()}`;
      const customBorderName = t('customBorderName');
      addCustomBorder({
        id: newId,
        name: customBorderName,
        type: 'image',
        isCustom: true,
        customImageUrl: customBorderUrl,
      });
      customBorderUrl = null;
      setSelectedBorder(newId);
      setCustomBorderError(null);
      trackApplyBorder(customBorderName);
    } catch (error) {
      revokeTemporaryCustomBorderUrl(customBorderUrl);
      console.error(`Failed to upload custom border file: ${file.name}`, error);
      setCustomBorderError(errorCopy.failed);
    } finally {
      resetInput();
    }
  };

  return (
        <div className={`space-y-4 ${className}`}>
          <h3 className="text-sm font-semibold text-foreground/90">{t('borderTemplates')}</h3>
          <div ref={bordersGridRef} className="max-h-[280px] overflow-y-auto rounded-lg border border-border/30 bg-muted/10 p-2 sm:max-h-[360px] xl:max-h-[280px]">
            <div className="grid grid-cols-3 gap-2 min-[480px]:grid-cols-4 md:grid-cols-6 xl:grid-cols-3">
              {[...visibleBorderTemplates, ...customBorders].map((border) => {
                const isActive = selectedBorderId === border.id;
                const label = getLocalizedName(border.name, t);
                const removeLabel = locale === 'zh' ? `删除 ${label}` : `Delete ${label}`;
                return (
                  <div key={border.id} className="relative aspect-square">
                    <button
                      type="button"
                      data-border-id={border.id}
                      onClick={() => {
                        setSelectedBorder(border.id);
                        trackApplyBorder(label);
                      }}
                      title={label}
                      aria-label={label}
                      className={`absolute inset-0 flex items-center justify-center overflow-hidden rounded-md border p-1 transition-all ${
                        isActive
                          ? 'border-primary ring-1 ring-primary/50 bg-primary/5'
                          : 'border-border/50 hover:border-primary/50 hover:bg-accent/50'
                      }`}
                    >
                      <BorderThumbnail border={border} active={isActive} label={label} locale={locale} />
                    </button>
                    {border.isCustom ? (
                      <button
                        type="button"
                        onClick={() => {
                          removeCustomBorder(border.id);
                          setCustomBorderError(null);
                        }}
                        title={removeLabel}
                        aria-label={removeLabel}
                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-md border border-border/70 bg-background/90 text-muted-foreground shadow-sm transition hover:border-destructive/70 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    ) : null}
                  </div>
                );
              })}
            
            <button
              type="button"
              onClick={() => borderInputRef.current?.click()}
              className="relative flex flex-col items-center justify-center p-2 aspect-square rounded-md border border-dashed border-border hover:border-primary/50 hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-all"
              title={t('uploadCustomBorder')}
            >
              <Plus className="w-5 h-5 mb-1" />
            </button>
            <input 
              type="file" 
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              ref={borderInputRef} 
              className="hidden" 
              onChange={handleUploadBorder} 
            />
          </div>
          </div>
          {customBorderError ? (
            <p className="text-xs leading-5 text-destructive" role="alert">
              {customBorderError}
            </p>
          ) : null}
        </div>
  );
}

function getBorderAlt(id: string, defaultLabel: string, locale: 'en' | 'zh'): string {
  const altMap: Record<string, string> = {
    'metalbarbarian': 'Spiked barbarian metal token frame for RPG virtual tabletops, ideal for Barbarian or Fighter characters.',
    'wood': 'Wooden texture circular token border for D&D and Roll20 character avatars, perfect for Druid or Ranger portraits.',
    'rocks': 'Rugged stone and rocks token frame, ideal for Dwarf, Earth Genasi or Fighter tokens.',
    'blueenergy': 'Glowing blue energy token border, perfect for Sorcerer, Wizard or magic-user character portraits.',
    'silverspikes': 'Sharp silver spikes token ring, great for Rogue, Assassin or dark warrior avatars.',
    'revgold': 'Classic glowing gold token border, perfect for Paladin, Cleric or noble character tokens.',
    'fire': 'Blazing fire and flames token frame, ideal for Fire Genasi, Evocation Wizard or combat-ready characters.',
    'ice': 'Freezing ice crystal token border, perfect for Frost Maiden, Warlock or winter-themed RPG concepts.',
    'steampunk': 'Brass steampunk gear and cog token frame, ideal for Artificer, Gunslinger or sci-fi tabletop avatars.',
    'bones': 'Creepy skull and bones token border, perfect for Necromancer, Undead or Halloween themed characters.',
    'thin-ring': 'Minimalist thin ring token border for clean and modern virtual tabletop character presentation.',
    'plain-thin-ring': 'Minimal flat thin ring token border inspired by classic virtual tabletop portrait markers.',
    'plain-thick-ring': 'Minimal flat thick ring token border inspired by classic virtual tabletop portrait markers.',
    'plain-super-thin-ring': 'Minimal flat super thin ring token border inspired by classic virtual tabletop portrait markers.',
    'plain-double-ring': 'Minimal flat double ring token border inspired by classic virtual tabletop portrait markers.',
    'plain-square-thin': 'Minimal thin square token border inspired by classic virtual tabletop portrait markers.',
    'plain-square-thick': 'Minimal thick square token border inspired by classic virtual tabletop portrait markers.',
    'plain-hexagon': 'Minimal hexagon token border inspired by classic virtual tabletop portrait markers.',
    'plain-octagon': 'Minimal octagon token border inspired by classic virtual tabletop portrait markers.',
    'plain-decagon': 'Minimal decagon token border inspired by classic virtual tabletop portrait markers.',
    'plain-dodecagon': 'Minimal dodecagon token border inspired by classic virtual tabletop portrait markers.',
  };
  if (locale === 'en' && altMap[id]) return altMap[id];

  return locale === 'zh'
    ? `${defaultLabel}，适合 DnD、Roll20 和 Foundry 的 Token 边框模板`
    : `${defaultLabel} token border template for DnD, Roll20, and Foundry`;
}

function BorderThumbnail({
  border,
  active,
  label,
  locale,
}: {
  border: BorderTemplate;
  active: boolean;
  label: string;
  locale: 'en' | 'zh';
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if ((border.type === 'image' && border.imageUrl) || (border.isCustom && border.customImageUrl)) {
      return; // 图片类型直接走原生 img，跳过 canvas 渲染
    }

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, 64, 64);
    const color = active ? '#d7b46a' : '#68657a';
    drawBorderThumbnail(ctx, border, 64, color);
  }, [active, border]);

  if ((border.type === 'image' && border.imageUrl) || (border.isCustom && border.customImageUrl)) {
     const src = border.isCustom ? border.customImageUrl : border.thumbSrc || border.imageUrl;
     if (!src) return null;

     const altText = border.isCustom
       ? locale === 'zh'
         ? `${label} 自定义 Token 边框`
         : `${label} custom token border frame`
       : getBorderAlt(border.id, label, locale);
     const isDataUrl = src.startsWith('data:');
     const shouldBypassImageOptimization = isDataUrl || Boolean(border.presetId);

     return (
       <span
         data-testid={`border-thumbnail-surface-${border.id}`}
         className={`flex h-full w-full items-center justify-center overflow-hidden rounded-sm ${
           border.presetId ? 'bg-black' : 'bg-transparent'
         }`}
       >
         <Image
           src={src}
           alt={altText}
           width={40}
           height={40}
           sizes="40px"
           unoptimized={shouldBypassImageOptimization}
           className="w-10 h-10 object-contain drop-shadow-md"
         />
       </span>
     );
  }

  return <canvas ref={canvasRef} width={64} height={64} className="w-10 h-10 object-contain" />;
}
