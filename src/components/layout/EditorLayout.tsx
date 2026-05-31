'use client';

import { Suspense, useEffect, useId, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { ControlPanel } from '@/components/editor/ControlPanel';
import { MobileBorderTemplatesPanel, TemplatePanel } from '@/components/editor/TemplatePanel';
import { Canvas } from '@/components/editor/Canvas';
import { BatchPanel } from '@/components/editor/BatchPanel';
import { ShareDialog } from '@/components/editor/ShareDialog';
import { EditorSearchParamsSync } from '@/components/layout/EditorSearchParamsSync';
import { useI18n } from '@/lib/i18n';
import { useBatchStore } from '@/lib/store/batch-store';
import { trackStartEditor } from '@/lib/analytics';
import { useHasEditorImage } from '@/components/editor/editor-store-hooks';

export function EditorLayout() {
  const { t } = useI18n();
  const workspaceHeadingId = useId();
  const workspaceRef = useRef<HTMLDivElement>(null);
  const isBatchActive = useBatchStore((s) => s.isActive);
  const hasEditorImage = useHasEditorImage();

  useEffect(() => {
    const workspace = workspaceRef.current;
    if (!workspace) return;

    if (typeof IntersectionObserver === 'undefined') {
      trackStartEditor('editor_mount');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        trackStartEditor('editor_visible');
        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    observer.observe(workspace);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={workspaceRef}
      id="editor-workspace"
      tabIndex={-1}
      className="editor-shell scroll-mt-0 flex min-h-[100svh] w-full flex-col overflow-visible bg-background text-foreground selection:bg-primary/30 md:scroll-mt-24 xl:h-screen xl:overflow-hidden"
    >
      <Suspense fallback={null}>
        <EditorSearchParamsSync />
      </Suspense>
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <ShareDialog />
      <section
        aria-labelledby={workspaceHeadingId}
        className="relative flex flex-1 flex-col overflow-visible xl:flex-row xl:overflow-hidden"
      >
        <h2 id={workspaceHeadingId} className="sr-only">
          {t('workspaceLabel')}
        </h2>
        <ControlPanel />
        <MobileBorderTemplatesPanel />
        {isBatchActive ? (
          <div className="order-1 flex min-h-[32rem] flex-none flex-col overflow-hidden xl:order-none xl:min-h-[36rem] xl:flex-1">
            {/* 有预览图时才显示 Canvas */}
            {hasEditorImage && (
              <div className="editor-stage bg-dot-pattern shrink-0 bg-[length:16px_16px] xl:h-80">
                <Canvas />
              </div>
            )}
            {/* 批处理网格（有预览图时加上分割线） */}
            <div className={`flex-1 overflow-hidden ${hasEditorImage ? 'border-t border-border/30' : ''}`}>
              <BatchPanel />
            </div>
          </div>
        ) : (
          <div className="editor-stage bg-dot-pattern order-1 flex-none bg-[length:16px_16px] xl:order-none xl:min-h-[36rem] xl:flex-1">
            <Canvas />
          </div>
        )}
        <TemplatePanel />
      </section>
    </div>
  );
}
