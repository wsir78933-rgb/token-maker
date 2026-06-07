'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const DeferredEditor = dynamic(
  () => import('@/components/layout/EditorLayout').then((module) => module.EditorLayout),
  { ssr: false },
);

const EDITOR_PRELOAD_MARGIN = '120px 0px';
const EDITOR_SEARCH_PARAM_NAMES = ['preset', 'mask', 'border', 'size'] as const;

function hasEditorSearchParam(searchParams: URLSearchParams) {
  return EDITOR_SEARCH_PARAM_NAMES.some((paramName) => searchParams.has(paramName));
}

function shouldLoadEditorFromCurrentUrl() {
  if (typeof window === 'undefined') {
    return false;
  }

  return (
    window.location.hash === '#editor-workspace' ||
    hasEditorSearchParam(new URLSearchParams(window.location.search))
  );
}

function scheduleEditorLoad(setShouldLoadEditor: (shouldLoadEditor: boolean) => void) {
  const loadEditorTimerId = window.setTimeout(() => setShouldLoadEditor(true), 0);

  return () => window.clearTimeout(loadEditorTimerId);
}

export function DeferredEditorLayout() {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [shouldLoadEditor, setShouldLoadEditor] = useState(false);

  useEffect(() => {
    if (shouldLoadEditorFromCurrentUrl()) {
      return scheduleEditorLoad(setShouldLoadEditor);
    }

    const placeholderElement = placeholderRef.current;
    if (!placeholderElement || typeof IntersectionObserver === 'undefined') {
      return scheduleEditorLoad(setShouldLoadEditor);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldLoadEditor(true);
        observer.disconnect();
      },
      { rootMargin: EDITOR_PRELOAD_MARGIN },
    );

    observer.observe(placeholderElement);

    return () => observer.disconnect();
  }, []);

  if (shouldLoadEditor) {
    return <DeferredEditor />;
  }

  return (
    <div
      ref={placeholderRef}
      id="editor-workspace"
      data-testid="deferred-editor-placeholder"
      tabIndex={-1}
      className="editor-shell flex min-h-[100svh] w-full items-center justify-center bg-background px-4 py-10 text-foreground"
    >
      <div
        aria-hidden="true"
        className="grid w-full max-w-[32rem] gap-4 rounded-2xl border border-border/50 bg-card/45 p-4 shadow-[0_28px_90px_-48px_var(--workspace-shadow-color)]"
      >
        <div className="h-56 rounded-xl border-2 border-dashed border-border bg-muted/20" />
        <div className="grid grid-cols-3 gap-3">
          <div className="h-16 rounded-lg border border-border/50 bg-muted/20" />
          <div className="h-16 rounded-lg border border-border/50 bg-muted/20" />
          <div className="h-16 rounded-lg border border-border/50 bg-muted/20" />
        </div>
      </div>
    </div>
  );
}
