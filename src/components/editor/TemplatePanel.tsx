'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useEditorStore } from '@/lib/store/editor-store';
import { useI18n, type I18nKey } from '@/lib/i18n';
import { trackApplyBorder } from '@/lib/analytics';
import {
  COMPETITOR_BORDER_TEMPLATES,
  DEFAULT_BORDER_TEMPLATES,
} from '@/lib/templates/borders';
import { STYLE_PRESETS } from '@/lib/templates/presets';
import { drawBorderThumbnail } from '@/lib/renderer/borders';
import { Button } from '@/components/ui/button';
import type { BorderTemplate, ExportSize } from '@/types/editor';
import { DownloadCloud, Plus, Trash2 } from 'lucide-react';
import { fileToBase64, preloadImageToCache } from '@/lib/utils/imageCache';
import { downloadCurrentToken, getLocalizedName } from './export-token';

const SIZES: ExportSize[] = [256, 512, 1024, 2048];
const MAX_CUSTOM_BORDERS = 8;
const MAX_CUSTOM_BORDER_BYTES = 512 * 1024;
const MAX_CUSTOM_BORDER_STORAGE_CHARS = 2 * 1024 * 1024;
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

function getCustomBorderStorageUsage(customBorders: BorderTemplate[]) {
  return customBorders.reduce((total, border) => total + (border.customImageUrl?.length ?? 0), 0);
}

function getCustomBorderErrorCopy(locale: 'en' | 'zh') {
  return {
    unsupported:
      locale === 'zh'
        ? '请上传 PNG、JPG、WEBP 或 SVG 边框文件。'
        : 'Upload a PNG, JPG, WEBP, or SVG border file.',
    tooLarge:
      locale === 'zh'
        ? '自定义边框不能超过 512KB，避免浏览器存储失效。'
        : 'Custom borders must stay under 512KB to keep browser storage reliable.',
    tooMany:
      locale === 'zh'
        ? `最多保留 ${MAX_CUSTOM_BORDERS} 个自定义边框，请先删除旧边框。`
        : `Keep at most ${MAX_CUSTOM_BORDERS} custom borders. Remove one before adding more.`,
    storageFull:
      locale === 'zh'
        ? '自定义边框存储空间已满，请先删除旧边框。'
        : 'Custom border storage is full. Remove an older border first.',
    failed:
      locale === 'zh'
        ? '读取这个边框失败，请换一个文件再试。'
        : 'Failed to read this border. Try another file.',
  };
}

export function TemplatePanel() {
  const { t } = useI18n();
  const activePresetId = useEditorStore((state) => state.activePresetId);
  const exportSize = useEditorStore((state) => state.exportSize);
  const imageElement = useEditorStore((state) => state.imageElement);
  const applyPreset = useEditorStore((state) => state.applyPreset);
  const setExportSize = useEditorStore((state) => state.setExportSize);

  const handleExport = async () => {
    await downloadCurrentToken(t);
  };

  return (
    <div className="order-4 flex w-full flex-col overflow-visible border-y border-border bg-card/65 backdrop-blur xl:order-none xl:h-full xl:w-80 xl:overflow-hidden xl:border-y-0 xl:border-l">

      {/* ── 顶部固定标题栏 ── */}
      <div className="shrink-0 border-b border-border/50 px-4 py-3 sm:py-4">
        <h3 className="text-sm font-semibold text-foreground/90">{t('templatePanel')}</h3>
      </div>

      <div className="flex-none space-y-6 overflow-visible px-4 py-4 sm:space-y-8 sm:py-6 xl:flex-1 xl:overflow-y-auto">
        
        {/* 风格预设 */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground/90">{t('presets')}</h3>
          <div className="grid grid-cols-3 gap-2 min-[480px]:grid-cols-4 md:grid-cols-6 xl:grid-cols-3">
            {STYLE_PRESETS.map((preset) => {
              const isActive = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className={`flex aspect-square flex-col items-center justify-center rounded-lg border p-2 transition-all ${
                    isActive
                      ? 'border-primary bg-primary/10 text-primary shadow-[0_12px_28px_-18px_color-mix(in_oklab,var(--color-primary)_75%,transparent)]'
                      : 'border-border/50 hover:border-primary/50 hover:bg-accent text-muted-foreground hover:text-foreground'
                  }`}
                  title={t(preset.name as I18nKey)}
                >
                  <span className="mb-1 text-xl">{preset.icon}</span>
                  <span className="text-[10px] whitespace-nowrap">{t(preset.name as I18nKey)}</span>
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
  const selectedBorderId = useEditorStore((state) => state.selectedBorderId);
  const customBorders = useEditorStore((state) => state.customBorders);
  const borderLibraryMode = useEditorStore((state) => state.borderLibraryMode);
  const setSelectedBorder = useEditorStore((state) => state.setSelectedBorder);
  const addCustomBorder = useEditorStore((state) => state.addCustomBorder);
  const removeCustomBorder = useEditorStore((state) => state.removeCustomBorder);
  const bordersGridRef = useRef<HTMLDivElement>(null);
  const [customBorderError, setCustomBorderError] = useState<string | null>(null);
  const visibleBorderTemplates =
    borderLibraryMode === 'competitor' ? COMPETITOR_BORDER_TEMPLATES : DEFAULT_BORDER_TEMPLATES;
  const borderInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const grid = bordersGridRef.current;
    if (!grid) return;

    const activeBorderButton = grid.querySelector<HTMLElement>(
      `[data-border-id="${CSS.escape(selectedBorderId)}"]`
    );

    activeBorderButton?.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
      behavior: 'smooth',
    });
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

    if (file.size > MAX_CUSTOM_BORDER_BYTES) {
      setCustomBorderError(errorCopy.tooLarge);
      resetInput();
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      if (getCustomBorderStorageUsage(customBorders) + base64.length > MAX_CUSTOM_BORDER_STORAGE_CHARS) {
        setCustomBorderError(errorCopy.storageFull);
        return;
      }

      await preloadImageToCache(base64);
      const newId = `custom-border-${Date.now()}`;
      addCustomBorder({
        id: newId,
        name: 'Custom',
        type: 'image',
        isCustom: true,
        customImageUrl: base64
      });
      setSelectedBorder(newId);
      setCustomBorderError(null);
      trackApplyBorder('Custom');
    } catch {
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
                      <BorderThumbnail border={border} active={isActive} label={label} />
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

function getBorderAlt(id: string, defaultLabel: string): string {
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
  return altMap[id] || `${defaultLabel} custom token border frame for D&D and Roll20`;
}

function BorderThumbnail({ border, active, label }: { border: BorderTemplate; active: boolean; label: string }) {
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

     const altText = border.isCustom ? `${label} custom token border frame` : getBorderAlt(border.id, label);
     const isDataUrl = src.startsWith('data:');

     return (
       <Image
         src={src}
         alt={altText}
         width={40}
         height={40}
         sizes="40px"
         unoptimized={isDataUrl}
         className="w-10 h-10 object-contain drop-shadow-md"
       />
     );
  }

  return <canvas ref={canvasRef} width={64} height={64} className="w-10 h-10 object-contain" />;
}
