'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useI18n } from '@/lib/i18n';

const DeferredEditor = dynamic(
  () => import('@/components/layout/EditorLayout').then((module) => module.EditorLayout),
  { ssr: false },
);

const EDITOR_PRELOAD_MARGIN = '120px 0px';
const DESKTOP_EDITOR_MEDIA_QUERY = '(min-width: 1280px)';
const EDITOR_SEARCH_PARAM_NAMES = ['preset', 'mask', 'border', 'borderTint', 'size'] as const;

function hasEditorSearchParam(searchParams: URLSearchParams) {
  return EDITOR_SEARCH_PARAM_NAMES.some((paramName) => searchParams.has(paramName));
}

function getDesktopEditorLayoutSnapshot() {
  return window.matchMedia(DESKTOP_EDITOR_MEDIA_QUERY).matches;
}

function getServerDesktopEditorLayoutSnapshot() {
  return null;
}

function subscribeToDesktopEditorLayout(onStoreChange: () => void) {
  const mediaQueryList = window.matchMedia(DESKTOP_EDITOR_MEDIA_QUERY);

  mediaQueryList.addEventListener('change', onStoreChange);

  return () => mediaQueryList.removeEventListener('change', onStoreChange);
}

function hasEditorWorkspaceHash() {
  return window.location.hash === '#editor-workspace';
}

function hasInitialDirectEditorIntent() {
  return hasEditorWorkspaceHash() || hasEditorSearchParam(new URLSearchParams(window.location.search));
}

function scheduleEditorLoad(setShouldLoadEditor: (shouldLoadEditor: boolean) => void) {
  const loadEditorTimerId = window.setTimeout(() => setShouldLoadEditor(true), 0);

  return () => window.clearTimeout(loadEditorTimerId);
}

export function DeferredEditorLayout() {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const mobileEditorLoadTimerIdRef = useRef<number | null>(null);
  const [shouldLoadEditor, setShouldLoadEditor] = useState(false);
  const [isMobileEditorLoading, setIsMobileEditorLoading] = useState(false);
  const { t } = useI18n();
  const isDesktopEditorLayout = useSyncExternalStore(
    subscribeToDesktopEditorLayout,
    getDesktopEditorLayoutSnapshot,
    getServerDesktopEditorLayoutSnapshot,
  );

  useEffect(() => {
    if (hasInitialDirectEditorIntent()) {
      return scheduleEditorLoad(setShouldLoadEditor);
    }

    if (isDesktopEditorLayout !== true) return;

    const placeholderElement = placeholderRef.current;
    if (!placeholderElement || typeof IntersectionObserver === 'undefined') {
      return scheduleEditorLoad(setShouldLoadEditor);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || !getDesktopEditorLayoutSnapshot()) return;
        setShouldLoadEditor(true);
        observer.disconnect();
      },
      { rootMargin: EDITOR_PRELOAD_MARGIN },
    );

    observer.observe(placeholderElement);

    return () => observer.disconnect();
  }, [isDesktopEditorLayout]);

  useEffect(() => {
    return () => {
      const mobileEditorLoadTimerId = mobileEditorLoadTimerIdRef.current;
      if (mobileEditorLoadTimerId !== null) {
        window.clearTimeout(mobileEditorLoadTimerId);
      }
    };
  }, []);

  useEffect(() => {
    let cancelDirectEditorLoad: (() => void) | null = null;

    function handleEditorHashChange() {
      if (!hasEditorWorkspaceHash()) return;

      cancelDirectEditorLoad?.();
      cancelDirectEditorLoad = scheduleEditorLoad(setShouldLoadEditor);
    }

    window.addEventListener('hashchange', handleEditorHashChange);

    return () => {
      window.removeEventListener('hashchange', handleEditorHashChange);
      cancelDirectEditorLoad?.();
    };
  }, []);

  function handleMobileEditorLaunch() {
    setIsMobileEditorLoading(true);
    mobileEditorLoadTimerIdRef.current = window.setTimeout(() => {
      mobileEditorLoadTimerIdRef.current = null;
      setShouldLoadEditor(true);
    }, 0);
  }

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
      {isDesktopEditorLayout === false ? (
        <button
          type="button"
          data-testid="mobile-editor-launch"
          disabled={isMobileEditorLoading}
          onClick={handleMobileEditorLaunch}
          className="rounded-full border border-border/60 bg-card px-5 py-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted disabled:cursor-wait disabled:opacity-70"
        >
          {isMobileEditorLoading ? t('mobileEditorLoading') : t('mobileEditorLaunch')}
        </button>
      ) : (
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
      )}
    </div>
  );
}
