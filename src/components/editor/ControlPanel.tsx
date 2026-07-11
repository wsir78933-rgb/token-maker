'use client';

import { useId } from 'react';
import { useI18n } from '@/lib/i18n';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DownloadCloud, Layers, RotateCcw, Trash2 } from 'lucide-react';
import { useBatchStore } from '@/lib/store/batch-store';
import { trackUseBatchMode } from '@/lib/analytics';
import type { I18nKey } from '@/lib/i18n';
import { downloadCurrentTokenWithSharePrompt } from './export-token';
import { useControlPanelState } from './editor-store-hooks';

function getSliderValue(value: number | readonly number[]) {
  return Array.isArray(value) ? value[0] ?? 0 : value;
}

export function ControlPanel() {
  const { t, locale } = useI18n();
  const {
    imageScale,
    imageElement,
    selectedTextId,
    selectedTextFontSize,
    selectedTextColor,
    borderTint,
    overlayTint,
    borderOpacity,
    overlayOpacity,
    setImageScale,
    addTextBox,
    removeTextBox,
    updateTextBox,
    setBorderTint,
    setOverlayTint,
    setBorderOpacity,
    setOverlayOpacity,
    resetPosition,
    clearImage,
  } = useControlPanelState();
  const imageScaleLabelId = useId();
  const fontSizeLabelId = useId();
  const textColorInputId = useId();
  const borderTintInputId = useId();
  const overlayTintInputId = useId();
  const borderOpacityLabelId = useId();
  const overlayOpacityLabelId = useId();

  const handleExport = async () => {
    await downloadCurrentTokenWithSharePrompt(t, locale);
  };

  const handleAddText = () => {
    addTextBox(t('defaultTextContent'));
  };

  return (
    <div className="order-3 flex w-full flex-col overflow-visible border-y border-border bg-card/65 backdrop-blur xl:order-none xl:h-full xl:w-[var(--editor-side-panel-width)] xl:overflow-hidden xl:border-y-0 xl:border-r">

      {/* ── 顶部固定标题栏 ── */}
      <div className="shrink-0 border-b border-border/50 px-4 py-3 sm:py-4">
        <h3 className="text-sm font-semibold text-foreground/90">{t('controlPanel')}</h3>
      </div>

      {/* ── 中间可滚动内容区 ── */}
      <div className="flex-none space-y-6 overflow-visible px-4 py-4 sm:space-y-8 sm:py-6 xl:flex-1 xl:overflow-y-auto">

        {/* 图片设置 */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground/90">{t('imageSettings')}</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label id={imageScaleLabelId} className="text-xs text-muted-foreground">
                {t('imageScale')}
              </Label>
              <span className="text-xs tabular-nums text-muted-foreground">
                {Math.round(imageScale * 100)}%
              </span>
            </div>
            <Slider
              aria-labelledby={imageScaleLabelId}
              getAriaLabel={() => t('imageScale')}
              value={[imageScale]}
              min={0.1}
              max={5}
              step={0.01}
              onValueChange={(value) => setImageScale(getSliderValue(value))}
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
              onClick={handleAddText}
              className="h-7 text-xs"
              disabled={!imageElement}
            >
              + {t('addText')}
            </Button>
          </div>

          {selectedTextId && selectedTextFontSize !== null && selectedTextColor ? (
            <div className="space-y-4 rounded-lg border border-border/50 bg-muted/30 p-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label id={fontSizeLabelId} className="text-xs text-muted-foreground">
                    {t('fontSize')}
                  </Label>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {selectedTextFontSize}px
                  </span>
                </div>
                <Slider
                  aria-labelledby={fontSizeLabelId}
                  getAriaLabel={() => t('fontSize')}
                  value={[selectedTextFontSize]}
                  min={12}
                  max={200}
                  step={1}
                  onValueChange={(value) =>
                    updateTextBox(selectedTextId, { fontSize: getSliderValue(value) })
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
                    value={selectedTextColor}
                    onChange={(e) => updateTextBox(selectedTextId, { color: e.target.value })}
                    className="h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded border-0 bg-transparent p-0"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => removeTextBox(selectedTextId)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('delete')}
                  </Button>
                </div>
              </div>
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
                value={borderTint}
                onChange={(e) => setBorderTint(e.target.value)}
                className="h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded border-0 bg-transparent p-0"
              />
              <div className="w-full rounded bg-muted/50 px-2 py-1 font-mono text-xs uppercase text-muted-foreground">
                {borderTint}
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
                value={overlayTint}
                onChange={(e) => setOverlayTint(e.target.value)}
                className="h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded border-0 bg-transparent p-0"
              />
              <div className="w-full rounded bg-muted/50 px-2 py-1 font-mono text-xs uppercase text-muted-foreground">
                {overlayTint}
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
                {Math.round(borderOpacity * 100)}%
              </span>
            </div>
            <Slider
              aria-labelledby={borderOpacityLabelId}
              getAriaLabel={() => t('borderOpacity')}
              value={[borderOpacity]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={(value) => setBorderOpacity(getSliderValue(value))}
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
                {Math.round(overlayOpacity * 100)}%
              </span>
            </div>
            <Slider
              aria-labelledby={overlayOpacityLabelId}
              getAriaLabel={() => t('overlayOpacity')}
              value={[overlayOpacity]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={(value) => setOverlayOpacity(getSliderValue(value))}
              className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3"
            />
          </div>
        </div>

      </div>

      {/* ── 底部固定操作栏 ── */}
      <div className="shrink-0 border-t border-border bg-card/92 p-4 shadow-[0_-10px_40px_-15px_var(--workspace-shadow-color)]">
        <div className="flex flex-col gap-2 min-[380px]:flex-row">
          <Button
            variant="outline"
            size="sm"
            className="h-9 flex-1 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            onClick={resetPosition}
            title={t('resetPosition')}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {t('resetPosition')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 flex-1 gap-1.5 text-xs text-destructive hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
            onClick={clearImage}
            title={t('clearWorkspace')}
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t('clearWorkspace')}
          </Button>
        </div>
        <div className="my-3 border-t border-border/40" />
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-full gap-2 text-xs font-medium text-primary hover:border-primary/40 hover:bg-primary/10"
          onClick={() => {
            trackUseBatchMode('control_button');
            useBatchStore.getState().activate();
          }}
        >
          <Layers className="h-3.5 w-3.5" />
          {t('batchMode' as I18nKey)}
        </Button>
        <Button
          className="mt-3 h-10 w-full gap-2 text-sm font-medium xl:hidden"
          size="default"
          onClick={handleExport}
          disabled={!imageElement}
        >
          <DownloadCloud className="h-4 w-4" />
          {t('download')}
        </Button>
      </div>

    </div>
  );
}
