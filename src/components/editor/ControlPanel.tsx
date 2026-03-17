'use client';

import { useEditorStore } from '@/lib/store/editor-store';
import { useI18n, type I18nKey } from '@/lib/i18n';
import { STYLE_PRESETS } from '@/lib/templates/presets';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RotateCcw, Trash2 } from 'lucide-react';

function getSliderValue(value: number | readonly number[]) {
  return Array.isArray(value) ? value[0] ?? 0 : value;
}

export function ControlPanel() {
  const store = useEditorStore();
  const { t } = useI18n();

  return (
    <div className="flex w-full flex-col gap-8 overflow-y-auto border-r border-border bg-card/65 px-4 py-6 backdrop-blur xl:h-full xl:w-80">
      
      {/* 图片设置 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground/90">{t('imageSettings')}</h3>
          <div className="flex gap-1">
            <Button
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={store.resetPosition}
              title={t('resetPosition')}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={store.clearImage}
              title={t('clearWorkspace')}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">{t('imageScale')}</Label>
            <span className="text-xs tabular-nums text-muted-foreground">
              {Math.round(store.imageScale * 100)}%
            </span>
          </div>
          <Slider
            value={[store.imageScale]}
            min={0.1}
            max={5}
            step={0.01}
            onValueChange={(value) => store.setImageScale(getSliderValue(value))}
            className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3"
          />
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* 预设模式 */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground/90">{t('presets')}</h3>
        <div className="grid grid-cols-4 gap-2">
          {STYLE_PRESETS.map((preset) => {
            const isActive = store.activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => store.applyPreset(preset)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                  isActive
                    ? 'border-primary bg-primary/10 text-primary shadow-[0_12px_28px_-18px_color-mix(in_oklab,var(--color-primary)_75%,transparent)]'
                    : 'border-border/50 hover:border-primary/50 hover:bg-accent text-muted-foreground hover:text-foreground'
                }`}
                title={t(preset.name as I18nKey)}
              >
                <span className="text-xl mb-1">{preset.icon}</span>
                <span className="text-[10px] whitespace-nowrap">{t(preset.name as I18nKey)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* 文字设置 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground/90">{t('textSettings')}</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={store.addTextBox}
            className="h-7 text-xs"
            disabled={!store.imageElement}
          >
            + {t('addText')}
          </Button>
        </div>

        {store.selectedTextId ? (
          <div className="space-y-4 bg-muted/30 p-3 rounded-lg border border-border/50">
            {(() => {
              const text = store.textBoxes.find(t => t.id === store.selectedTextId);
              if (!text) return null;
              return (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">{t('fontSize')}</Label>
                      <span className="text-xs tabular-nums text-muted-foreground">{text.fontSize}px</span>
                    </div>
                    <Slider
                      value={[text.fontSize]}
                      min={12}
                      max={200}
                      step={1}
                      onValueChange={(value) => store.updateTextBox(text.id, { fontSize: getSliderValue(value) })}
                      className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs text-muted-foreground">{t('textColor')}</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={text.color}
                        onChange={(e) => store.updateTextBox(text.id, { color: e.target.value })}
                        className="w-8 h-8 rounded shrink-0 cursor-pointer overflow-hidden bg-transparent p-0 border-0"
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => store.removeTextBox(text.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {t('delete')}
                      </Button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground text-center py-4 bg-muted/20 rounded-lg border border-dashed border-border/50">
            {t('selectTextHint')}
          </div>
        )}
      </div>

      <Separator className="bg-border/50" />

      {/* 样式设置 */}
      <div className="space-y-6">
        <h3 className="text-sm font-semibold text-foreground/90">{t('styleSettings')}</h3>
        
        {/* 边框色 */}
        <div className="space-y-3">
          <Label className="text-xs text-muted-foreground">{t('borderTint')}</Label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={store.borderTint}
              onChange={(e) => store.setBorderTint(e.target.value)}
              className="w-8 h-8 rounded shrink-0 cursor-pointer overflow-hidden bg-transparent p-0 border-0"
            />
            <div className="font-mono text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded w-full uppercase">
              {store.borderTint}
            </div>
          </div>
        </div>

        {/* 背景色 */}
        <div className="space-y-3">
          <Label className="text-xs text-muted-foreground">{t('backgroundColor')}</Label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={store.backgroundColor}
              onChange={(e) => store.setBackgroundColor(e.target.value)}
              className="w-8 h-8 rounded shrink-0 cursor-pointer overflow-hidden bg-transparent p-0 border-0"
            />
            <div className="font-mono text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded w-full uppercase">
              {store.backgroundColor}
            </div>
          </div>
        </div>

        {/* 边框不透明度 */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">{t('borderOpacity')}</Label>
            <span className="text-xs tabular-nums text-muted-foreground">
              {Math.round(store.borderOpacity * 100)}%
            </span>
          </div>
          <Slider
            value={[store.borderOpacity]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={(value) => store.setBorderOpacity(getSliderValue(value))}
            className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3"
          />
        </div>
        
        {/* 叠加层不透明度 */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">{t('overlayOpacity')}</Label>
            <span className="text-xs tabular-nums text-muted-foreground">
              {Math.round(store.overlayOpacity * 100)}%
            </span>
          </div>
          <Slider
            value={[store.overlayOpacity]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={(value) => store.setOverlayOpacity(getSliderValue(value))}
            className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3"
          />
        </div>
      </div>

    </div>
  );
}
