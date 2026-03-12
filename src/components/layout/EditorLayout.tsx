'use client';

import { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { ControlPanel } from '@/components/editor/ControlPanel';
import { TemplatePanel } from '@/components/editor/TemplatePanel';
import { Canvas } from '@/components/editor/Canvas';
import { EditorSearchParamsSync } from '@/components/layout/EditorSearchParamsSync';

export function EditorLayout() {
  return (
    <div
      id="editor-workspace"
      className="scroll-mt-28 flex min-h-screen w-full flex-col overflow-hidden bg-background text-foreground selection:bg-primary/30"
    >
      <Suspense fallback={null}>
        <EditorSearchParamsSync />
      </Suspense>
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <section
        aria-label="Token editor workspace"
        className="relative flex flex-1 flex-col overflow-auto xl:flex-row xl:overflow-hidden"
      >
        <ControlPanel />
        <div className="min-h-[36rem] flex-1 bg-dot-pattern bg-[length:16px_16px]">
          <Canvas />
        </div>
        <TemplatePanel />
      </section>
    </div>
  );
}
