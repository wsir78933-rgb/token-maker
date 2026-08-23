'use client';

import { CircleDashed, PenLine, Type } from 'lucide-react';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type { CoatLocale } from '@/lib/coat-of-arms/types';
import { usePanelCommandError } from './usePanelCommandError';
import { createTextCreationCommand, TEXT_CREATION_DRAG_MIME, type TextCreationCardKind } from './text-creation-drag';
import { getCoatWorkbenchCopy } from './workbench-copy';

const textCreationCards: readonly { kind: TextCreationCardKind; icon: typeof Type }[] = [
  { kind: 'text', icon: Type },
  { kind: 'curved', icon: PenLine },
  { kind: 'ring', icon: CircleDashed },
];

/** Provides the competitor's three text creation entry points. */
export function TextMottoPanel({ locale }: { locale: CoatLocale }) {
  const copy = getCoatWorkbenchCopy(locale).panels;
  const { error, reportError, runWithResult } = usePanelCommandError(locale);
  const setSelectedLayerIds = useCoatProjectStore((state) => state.setSelectedLayerIds);

  const addTextCard = (kind: TextCreationCardKind) => {
    const result = runWithResult(createTextCreationCommand(kind, copy.textFeature.cards[kind].defaultText));
    if (!result) return;
    if (!result.createdLayerId) {
      reportError(new Error(`Unable to select created ${kind} text layer`));
      return;
    }
    setSelectedLayerIds([result.createdLayerId]);
  };

  return (
    <section aria-label={copy.textAndMotto} className="coat-target-utility-form coat-target-text-form">
      <p className="text-sm leading-relaxed text-[color:var(--coat-muted)]">{copy.textFeature.creationHint}</p>
      {error ? <p role="alert">{error}</p> : null}
      <div className="grid gap-3">
        {textCreationCards.map(({ kind, icon: Icon }) => {
          const card = copy.textFeature.cards[kind];
          return (
            <button
              aria-label={card.title}
              className="flex min-h-[6.3rem] w-full items-center gap-4 rounded-md border border-[color:var(--coat-line)] bg-[color:var(--coat-panel-raised)] px-4 py-3 text-left text-[color:var(--coat-text)] transition-colors hover:border-[color:var(--coat-accent)] hover:bg-[color:var(--coat-active)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--coat-accent)]"
              data-text-creation-card={kind}
              draggable
              key={kind}
              type="button"
              onClick={() => addTextCard(kind)}
              onDragStart={(event) => {
                if (!event.dataTransfer) return;
                event.dataTransfer.effectAllowed = 'copy';
                event.dataTransfer.setData(TEXT_CREATION_DRAG_MIME, kind);
              }}
            >
              <Icon aria-hidden="true" className="h-7 w-7 shrink-0 text-[color:var(--coat-muted)]" strokeWidth={1.6} />
              <span className="min-w-0">
                <span className="block text-base font-semibold">{card.title}</span>
                <span className="mt-1 block text-sm leading-snug text-[color:var(--coat-muted)]">{card.description}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
