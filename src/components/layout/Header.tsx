'use client';

import { useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { useHistoryStore } from '@/lib/store/history';
import { SiteMark } from '@/components/site/SiteMark';
import { deleteCurrentEditorSelection } from '@/components/editor/editor-store-hooks';

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();

  return (
    target.isContentEditable ||
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select'
  );
}

export function Header() {
  const { t } = useI18n();
  const history = useHistoryStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !isEditableTarget(e.target) &&
        (e.key === 'Delete' || e.key === 'Backspace')
      ) {
        if (deleteCurrentEditorSelection()) {
          e.preventDefault();
          return;
        }
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        history.undo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history]);

  return (
    <header className="border-b border-[#d7b46a]/12 bg-background/92 px-3 py-2.5 shadow-[0_18px_50px_-36px_var(--workspace-shadow-color)] backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6 sm:py-3">
      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <SiteMark className="h-9 w-9 rounded-2xl ring-1 ring-[#d7b46a]/15 sm:h-10 sm:w-10" />
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="hidden rounded-full border border-[#d7b46a]/20 bg-[#d7b46a]/8 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#e8cb8f] min-[380px]:inline-flex sm:tracking-[0.24em]">
                {t('workspaceLabel')}
              </span>
              <span className="hidden rounded-full border border-border/70 bg-card/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground sm:inline-flex">
                {t('localMode')}
              </span>
            </div>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                {t('appName')}
              </span>
              <span className="hidden text-xs text-muted-foreground min-[420px]:inline">
                {t('appSubtitle')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
