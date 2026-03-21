'use client';

import { useId } from 'react';
import { useEditorStore } from '@/lib/store/editor-store';
import { useI18n } from '@/lib/i18n';
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
  const imageScaleLabelId = useId();
  const fontSizeLabelId = useId();
  const textColorInputId = useId();
  const borderTintInputId = useId();
  const overlayTintInputId = useId();
  const borderOpacityLabelId = useId();
  const overlayOpacityLabelId = useId();

  return (
    <div className="flex w-full flex-col overflow-hidden border-r border-border bg-card/65 backdrop-blur xl:h-full xl:w-80">

      {/* ── 顶部固定标题栏 ── */}
      <div className="shrink-0 border-b border-border/50 px-4 py-4">
        <h3 className="text-sm font-semibold text-foreground/90">{t('controlPanel')}</h3>
      </div>

      {/* ── 中间可滚动内容区 ── */}
      <div className="flex-1 space-y-8 overflow-y-auto px-4 py-6">

        {/* 图片设置 */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground/90">{t('imageSettings')}</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label id={imageScaleLabelId} className="text-xs text-muted-foreground">
                {t('imageScale')}
              </Label>
              <span className="text-xs tabular-nums text-muted-foreground">
                {Math.round(store.imageScale * 100)}%
              </span>
            </div>
            <Slider
              aria-labelledby={imageScaleLabelId}
              getAriaLabel={() => t('imageScale')}
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
            <div className="space-y-4 rounded-lg border border-border/50 bg-muted/30 p-3">
              {(() => {
                const text = store.textBoxes.find((tb) => tb.id === store.selectedTextId);
                if (!text) return null;
                return (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label id={fontSizeLabelId} className="text-xs text-muted-foreground">
                          {t('fontSize')}
                        </Label>
                        <span className="text-xs tabular-nums text-muted-foreground">{text.fontSize}px</span>
                      </div>
                      <Slider
                        aria-labelledby={fontSizeLabelId}
                        getAriaLabel={() => t('fontSize')}
                        value={[text.fontSize]}
                        min={12}
                        max={200}
                        step={1}
                        onValueChange={(value) =>
                          store.updateTextBox(text.id, { fontSize: getSliderValue(value) })
                        }
                        className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor={textColorInputId} className="text-xs text-muted-foreground">
                        {t('textColor')}
                      </Label>
                      <div className="flex items-center gap-3">
                        <input
                          id={textColorInputId}
                          type="color"
                          value={text.color}
                          onChange={(e) => store.updateTextBox(text.id, { color: e.target.value })}
                          className="h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded border-0 bg-transparent p-0"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => store.removeTextBox(text.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t('delete')}
                        </Button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border/50 bg-muted/20 py-4 text-center text-xs text-muted-foreground">
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
            <Label htmlFor={borderTintInputId} className="text-xs text-muted-foreground">
              {t('borderTint')}
            </Label>
            <div className="flex items-center gap-3">
              <input
                id={borderTintInputId}
                type="color"
                value={store.borderTint}
                onChange={(e) => store.setBorderTint(e.target.value)}
                className="h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded border-0 bg-transparent p-0"
              />
              <div className="w-full rounded bg-muted/50 px-2 py-1 font-mono text-xs uppercase text-muted-foreground">
                {store.borderTint}
              </div>
            </div>
          </div>

          {/* 叠加层颜色 */}
          <div className="space-y-3">
            <Label htmlFor={overlayTintInputId} className="text-xs text-muted-foreground">
              {t('overlayTint')}
            </Label>
            <div className="flex items-center gap-3">
              <input
                id={overlayTintInputId}
                type="color"
                value={store.overlayTint}
                onChange={(e) => store.setOverlayTint(e.target.value)}
                className="h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded border-0 bg-transparent p-0"
              />
              <div className="w-full rounded bg-muted/50 px-2 py-1 font-mono text-xs uppercase text-muted-foreground">
                {store.overlayTint}
              </div>
            </div>
          </div>

          {/* 边框不透明度 */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <Label id={borderOpacityLabelId} className="text-xs text-muted-foreground">
                {t('borderOpacity')}
              </Label>
              <span className="text-xs tabular-nums text-muted-foreground">
                {Math.round(store.borderOpacity * 100)}%
              </span>
            </div>
            <Slider
              aria-labelledby={borderOpacityLabelId}
              getAriaLabel={() => t('borderOpacity')}
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
              <Label id={overlayOpacityLabelId} className="text-xs text-muted-foreground">
                {t('overlayOpacity')}
              </Label>
              <span className="text-xs tabular-nums text-muted-foreground">
                {Math.round(store.overlayOpacity * 100)}%
              </span>
            </div>
            <Slider
              aria-labelledby={overlayOpacityLabelId}
              getAriaLabel={() => t('overlayOpacity')}
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

      {/* ── 底部固定操作栏 ── */}
      <div className="shrink-0 border-t border-border bg-card/92 p-4 shadow-[0_-10px_40px_-15px_var(--workspace-shadow-color)]">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 flex-1 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            onClick={store.resetPosition}
            title={t('resetPosition')}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {t('resetPosition')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 flex-1 gap-1.5 text-xs text-destructive hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
            onClick={store.clearImage}
            title={t('clearWorkspace')}
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t('clearWorkspace')}
          </Button>
        </div>
      </div>

    </div>
  );
}
