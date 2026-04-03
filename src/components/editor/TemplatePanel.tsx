'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useEditorStore } from '@/lib/store/editor-store';
import { useI18n, type I18nKey } from '@/lib/i18n';
import { trackDownloadToken, trackSelectFrame } from '@/lib/analytics';
import {
  BORDER_TEMPLATES,
  COMPETITOR_BORDER_TEMPLATES,
  DEFAULT_BORDER_TEMPLATES,
} from '@/lib/templates/borders';
import { STYLE_PRESETS } from '@/lib/templates/presets';
import { drawBorderThumbnail } from '@/lib/renderer/borders';
import { Button } from '@/components/ui/button';
import type { BorderTemplate, ExportSize } from '@/types/editor';
import { exportTokenAsPNG } from '@/lib/renderer/pipeline';
import { saveAs } from 'file-saver';
import { DownloadCloud, Plus } from 'lucide-react';
import { fileToBase64, preloadImageToCache } from '@/lib/utils/imageCache';

const SIZES: ExportSize[] = [256, 512, 1024, 2048];

function getLocalizedName(name: string, t: (key: I18nKey) => string) {
  return name.includes('.') ? t(name as I18nKey) : name;
}

function getSelectedFrameName(
  borderId: string,
  customBorders: BorderTemplate[],
  t: (key: I18nKey) => string
) {
  const selectedBorder =
    BORDER_TEMPLATES.find((border) => border.id === borderId) ??
    customBorders.find((border) => border.id === borderId);

  if (!selectedBorder) {
    return borderId;
  }

  return getLocalizedName(selectedBorder.name, t);
}

export function TemplatePanel() {
  const store = useEditorStore();
  const { t } = useI18n();
  const selectedFrameName = getSelectedFrameName(store.selectedBorderId, store.customBorders, t);
  const bordersGridRef = useRef<HTMLDivElement>(null);
  const visibleBorderTemplates =
    store.borderLibraryMode === 'competitor' ? COMPETITOR_BORDER_TEMPLATES : DEFAULT_BORDER_TEMPLATES;

  const handleExport = async () => {
    const blob = await exportTokenAsPNG(store, store.exportSize);
    if (blob) {
      saveAs(blob, `token_${Date.now()}.png`);
      trackDownloadToken(selectedFrameName);
    }
  };

  const borderInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const grid = bordersGridRef.current;
    if (!grid) return;

    const activeBorderButton = grid.querySelector<HTMLElement>(
      `[data-border-id="${CSS.escape(store.selectedBorderId)}"]`
    );

    activeBorderButton?.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
      behavior: 'smooth',
    });
  }, [store.selectedBorderId]);

  const handleUploadBorder = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    await preloadImageToCache(base64);
    const newId = `custom-border-${Date.now()}`;
    store.addCustomBorder({
      id: newId,
      name: 'Custom',
      type: 'image',
      isCustom: true,
      customImageUrl: base64
    });
    store.setSelectedBorder(newId);
    trackSelectFrame('Custom');
    if (borderInputRef.current) borderInputRef.current.value = '';
  };

  return (
    <div className="flex w-full flex-col overflow-hidden border-l border-border bg-card/65 backdrop-blur xl:h-full xl:w-80">

      {/* ── 顶部固定标题栏 ── */}
      <div className="shrink-0 border-b border-border/50 px-4 py-4">
        <h3 className="text-sm font-semibold text-foreground/90">{t('templatePanel')}</h3>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto px-4 py-6">
        
        {/* 风格预设 */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground/90">{t('presets')}</h3>
          <div className="grid grid-cols-3 gap-2">
            {STYLE_PRESETS.map((preset) => {
              const isActive = store.activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => store.applyPreset(preset)}
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
        
        {/* 边框模板 */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground/90">{t('borderTemplates')}</h3>
          <div ref={bordersGridRef} className="max-h-[280px] overflow-y-auto rounded-lg border border-border/30 bg-muted/10 p-2">
            <div className="grid grid-cols-3 gap-2">
            {[...visibleBorderTemplates, ...store.customBorders].map((border) => {
              const isActive = store.selectedBorderId === border.id;
              const label = getLocalizedName(border.name, t);
              return (
                <button
                  key={border.id}
                  data-border-id={border.id}
                  onClick={() => {
                    store.setSelectedBorder(border.id);
                    trackSelectFrame(label);
                  }}
                  title={label}
                  aria-label={label}
                  className={`relative flex items-center justify-center p-1 aspect-square rounded-md border transition-all overflow-hidden ${
                    isActive 
                      ? 'border-primary ring-1 ring-primary/50 bg-primary/5' 
                      : 'border-border/50 hover:border-primary/50 hover:bg-accent/50'
                  }`}
                >
                  <BorderThumbnail id={border.id} active={isActive} label={label} />
                </button>
              );
            })}
            
            <button
              onClick={() => borderInputRef.current?.click()}
              className="relative flex flex-col items-center justify-center p-2 aspect-square rounded-md border border-dashed border-border hover:border-primary/50 hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-all"
              title={t('uploadCustomBorder')}
            >
              <Plus className="w-5 h-5 mb-1" />
            </button>
            <input 
              type="file" 
              accept="image/png,image/svg+xml,image/webp" 
              ref={borderInputRef} 
              className="hidden" 
              onChange={handleUploadBorder} 
            />
          </div>
          </div>
        </div>

      </div>

      {/* ── 底部固定导出栏 ── */}
      <div className="shrink-0 space-y-3 border-t border-border bg-card/92 p-4 shadow-[0_-10px_40px_-15px_var(--workspace-shadow-color)]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground/80">{t('exportSection')}</span>
          <div className="flex rounded-md bg-muted/50 p-1">
            {SIZES.map(size => (
              <button
                key={size}
                onClick={() => store.setExportSize(size)}
                className={`rounded px-2 py-1 text-[10px] transition-colors ${
                  store.exportSize === size
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
          className="w-full font-medium"
          size="default"
          onClick={handleExport}
          disabled={!store.imageElement}
        >
          <DownloadCloud className="mr-2 h-4 w-4" />
          {t('download')}
        </Button>
      </div>

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

function BorderThumbnail({ id, active, label }: { id: string; active: boolean; label: string }) {
  const store = useEditorStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  let template = BORDER_TEMPLATES.find(t => t.id === id);
  if (!template) {
     template = store.customBorders.find(t => t.id === id);
  }

  useEffect(() => {
    if (!template) return;
    if ((template.type === 'image' && template.imageUrl) || (template.isCustom && template.customImageUrl)) {
      return; // 图片类型直接走原生 img，跳过 canvas 渲染
    }

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, 64, 64);
    const color = active ? '#d7b46a' : '#68657a';
    drawBorderThumbnail(ctx, template, 64, color);
  }, [id, active, store.customBorders, template]);

  if (!template) return null;

  if ((template.type === 'image' && template.imageUrl) || (template.isCustom && template.customImageUrl)) {
     const src = template.isCustom ? template.customImageUrl : template.thumbSrc || template.imageUrl;
     if (!src) return null;

     const altText = template.isCustom ? `${label} custom token border frame` : getBorderAlt(id, label);
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
