'use client';

import { Suspense, useId } from 'react';
import { Header } from '@/components/layout/Header';
import { ControlPanel } from '@/components/editor/ControlPanel';
import { TemplatePanel } from '@/components/editor/TemplatePanel';
import { Canvas } from '@/components/editor/Canvas';
import { BatchPanel } from '@/components/editor/BatchPanel';
import { EditorSearchParamsSync } from '@/components/layout/EditorSearchParamsSync';
import { useI18n } from '@/lib/i18n';
import { useBatchStore } from '@/lib/store/batch-store';
import { useEditorStore } from '@/lib/store/editor-store';

export function EditorLayout() {
  const { t } = useI18n();
  const workspaceHeadingId = useId();
  const isBatchActive = useBatchStore((s) => s.isActive);
  const hasEditorImage = useEditorStore((s) => !!s.imageElement);

  return (
    <div
      id="editor-workspace"
      tabIndex={-1}
      className="editor-shell scroll-mt-28 flex h-screen w-full flex-col overflow-hidden bg-background text-foreground selection:bg-primary/30"
    >
      <Suspense fallback={null}>
        <EditorSearchParamsSync />
      </Suspense>
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <section
        aria-labelledby={workspaceHeadingId}
        className="relative flex flex-1 flex-col overflow-auto xl:flex-row xl:overflow-hidden"
      >
        <h2 id={workspaceHeadingId} className="sr-only">
          {t('workspaceLabel')}
        </h2>
        <ControlPanel />
        {isBatchActive ? (
          <div className="flex min-h-[36rem] flex-1 flex-col overflow-hidden">
            {/* 有预览图时才显示 Canvas */}
            {hasEditorImage && (
              <div className="editor-stage bg-dot-pattern shrink-0 bg-[length:16px_16px]" style={{ height: '320px' }}>
                <Canvas />
              </div>
            )}
            {/* 批处理网格（有预览图时加上分割线） */}
            <div className={`flex-1 overflow-hidden ${hasEditorImage ? 'border-t border-border/30' : ''}`}>
              <BatchPanel />
            </div>
          </div>
        ) : (
          <div className="editor-stage bg-dot-pattern min-h-[36rem] flex-1 bg-[length:16px_16px]">
            <Canvas />
          </div>
        )}
        <TemplatePanel />
      </section>
    </div>
  );
}

