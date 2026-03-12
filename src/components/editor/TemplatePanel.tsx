'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useEditorStore } from '@/lib/store/editor-store';
import { useI18n, type I18nKey } from '@/lib/i18n';
import { BORDER_TEMPLATES } from '@/lib/templates/borders';
import { MASK_TEMPLATES } from '@/lib/templates/masks';
import { drawBorderThumbnail } from '@/lib/renderer/borders';
import { drawMaskThumbnail } from '@/lib/renderer/masks';
import { Button } from '@/components/ui/button';
import { ExportSize } from '@/types/editor';
import { exportTokenAsPNG } from '@/lib/renderer/pipeline';
import { saveAs } from 'file-saver';
import { DownloadCloud, Plus } from 'lucide-react';
import { fileToBase64, preloadImageToCache } from '@/lib/utils/imageCache';

const SIZES: ExportSize[] = [256, 512, 1024, 2048];

function getLocalizedName(name: string, t: (key: I18nKey) => string) {
  return name.includes('.') ? t(name as I18nKey) : name;
}

export function TemplatePanel() {
  const store = useEditorStore();
  const { t } = useI18n();

  const handleExport = async () => {
    const blob = await exportTokenAsPNG(store, store.exportSize);
    if (blob) {
      saveAs(blob, `token_${Date.now()}.png`);
    }
  };

  const borderInputRef = useRef<HTMLInputElement>(null);
  const maskInputRef = useRef<HTMLInputElement>(null);

  const handleUploadBorder = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    await preloadImageToCache(base64);
    const newId = `custom-border-${Date.now()}`;
    store.addCustomBorder({
      id: newId,
      name: 'Custom',
      type: 'abstract',
      isCustom: true,
      customImageUrl: base64
    });
    store.setSelectedBorder(newId);
    if (borderInputRef.current) borderInputRef.current.value = '';
  };

  const handleUploadMask = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    await preloadImageToCache(base64);
    const newId = `custom-mask-${Date.now()}`;
    store.addCustomMask({
      id: newId,
      name: 'Custom',
      sides: 0,
      isCustom: true,
      customImageUrl: base64
    });
    store.setSelectedMask(newId);
    if (maskInputRef.current) maskInputRef.current.value = '';
  };

  return (
    <div className="w-full border-l border-border bg-card/50 flex flex-col overflow-hidden xl:h-full xl:w-80">
      
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
        
        {/* 边框模板 */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground/90">{t('borderTemplates')}</h3>
          <div className="grid grid-cols-3 gap-2">
            {[...BORDER_TEMPLATES, ...store.customBorders].map((border) => {
              const isActive = store.selectedBorderId === border.id;
              const label = getLocalizedName(border.name, t);
              return (
                <button
                  key={border.id}
                  onClick={() => store.setSelectedBorder(border.id)}
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

        {/* 遮罩模板 */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground/90">{t('maskTemplates')}</h3>
          <div className="grid grid-cols-3 gap-2">
            {[...MASK_TEMPLATES, ...store.customMasks].map((mask) => {
              const isActive = store.selectedMaskId === mask.id;
              const label = getLocalizedName(mask.name, t);
              return (
                <button
                  key={mask.id}
                  onClick={() => store.setSelectedMask(mask.id)}
                  title={label}
                  aria-label={label}
                  className={`relative flex items-center justify-center p-1 aspect-square rounded-md border transition-all overflow-hidden bg-[#09090b] ${
                    isActive 
                      ? 'border-primary ring-1 ring-primary/50' 
                      : 'border-border/50 hover:border-primary/50'
                  }`}
                >
                  <MaskThumbnail id={mask.id} active={isActive} label={label} />
                </button>
              );
            })}
            
            <button
              onClick={() => maskInputRef.current?.click()}
              className="relative flex flex-col items-center justify-center p-2 aspect-square rounded-md border border-dashed border-border hover:border-primary/50 hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-all"
              title={t('uploadCustomMask')}
            >
              <Plus className="w-5 h-5 mb-1" />
            </button>
            <input 
              type="file" 
              accept="image/png,image/webp" 
              ref={maskInputRef} 
              className="hidden" 
              onChange={handleUploadMask} 
            />
          </div>
        </div>

      </div>

      {/* 底部导出区域 */}
      <div className="p-4 border-t border-border bg-card shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)] space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs text-muted-foreground mr-2">{t('exportSize')}</label>
          <div className="flex bg-muted/50 rounded-md p-1">
            {SIZES.map(size => (
              <button
                key={size}
                onClick={() => store.setExportSize(size)}
                className={`text-[10px] px-2 py-1 rounded transition-colors ${
                  store.exportSize === size 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
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
          <DownloadCloud className="w-4 h-4 mr-2" />
          {t('download')}
        </Button>
      </div>

    </div>
  );
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
    const color = active ? '#a855f7' : '#52525b';
    drawBorderThumbnail(ctx, template, 64, color);
  }, [id, active, store.customBorders, template]);

  if (!template) return null;

  if ((template.type === 'image' && template.imageUrl) || (template.isCustom && template.customImageUrl)) {
     const src = template.customImageUrl || template.imageUrl;
     return <Image src={src || ''} alt={label} width={40} height={40} unoptimized className="w-10 h-10 object-contain drop-shadow-md" />;
  }

  return <canvas ref={canvasRef} width={64} height={64} className="w-10 h-10 object-contain" />;
}

function MaskThumbnail({ id, active, label }: { id: string; active: boolean; label: string }) {
  const store = useEditorStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  let template = MASK_TEMPLATES.find(t => t.id === id);
  if (!template) {
     template = store.customMasks.find(t => t.id === id);
  }

  useEffect(() => {
    if (!template) return;
    if (template.isCustom && template.customImageUrl) {
      return;
    }

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, 64, 64);
    const color = active ? '#a855f7' : '#52525b';
    drawMaskThumbnail(ctx, template, 64, color);
  }, [id, active, store.customMasks, template]);

  if (!template) return null;

  if (template.isCustom && template.customImageUrl) {
     return <Image src={template.customImageUrl} alt={label} width={40} height={40} unoptimized className="w-10 h-10 object-contain drop-shadow-md" />;
  }

  return <canvas ref={canvasRef} width={64} height={64} className="w-10 h-10 object-contain" />;
}
