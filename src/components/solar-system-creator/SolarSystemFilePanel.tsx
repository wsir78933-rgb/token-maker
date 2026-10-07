'use client';

import { useId } from 'react';

import type { SolarSystemCopy } from '@/lib/solar-system-creator/copy';

export type SolarSaveSlot = 1 | 2 | 3 | 4 | 5;

export interface SolarSystemFilePanelProps {
  copy: SolarSystemCopy;
  occupiedSlots: readonly boolean[];
  onSave: (slot: SolarSaveSlot) => void;
  onLoad: (slot: SolarSaveSlot) => void;
  busy?: boolean;
}

const SOLAR_SAVE_SLOTS: readonly SolarSaveSlot[] = [1, 2, 3, 4, 5];

function applySlotLabel(template: string, slot: SolarSaveSlot): string {
  return template.replaceAll('{number}', String(slot));
}

export function SolarSystemFilePanel({
  copy,
  occupiedSlots,
  onSave,
  onLoad,
  busy = false,
}: SolarSystemFilePanelProps) {
  const panelId = useId();

  if (occupiedSlots.length !== SOLAR_SAVE_SLOTS.length) {
    throw new Error(
      `Solar save slots must contain ${SOLAR_SAVE_SLOTS.length} entries. Received ${occupiedSlots.length}.`,
    );
  }

  return (
    <section
      aria-labelledby={`${panelId}-heading`}
      aria-busy={busy}
      className="flex min-w-0 flex-col gap-4 rounded-lg border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] p-3 text-[var(--site-ink)]"
    >
      <div>
        <h2 id={`${panelId}-heading`} className="text-sm font-semibold text-[var(--site-ink-strong)]">
          {copy.filesTitle}
        </h2>
        <h3 className="mt-2 text-sm font-medium text-[var(--site-ink-strong)]">{copy.saveTitle}</h3>
        <p className="mt-1 text-xs text-[var(--site-ink-soft)]">{copy.localSaveHint}</p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {SOLAR_SAVE_SLOTS.map((slot, index) => {
          const slotName = applySlotLabel(copy.slotLabel, slot);
          const occupied = occupiedSlots[index];
          const loadHint = occupied ? slotName : `${slotName}: ${copy.emptySlot}`;

          return (
            <div
              key={slot}
              className="flex min-w-0 flex-col gap-2 rounded-md border border-[var(--site-border-soft)] bg-[var(--site-panel)] p-2"
            >
              <h3 className="text-sm font-medium text-[var(--site-ink-strong)]">{slotName}</h3>
              <p className="min-h-8 text-xs text-[var(--site-ink-soft)]">
                {occupied ? copy.overwriteHint : copy.emptySlot}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={busy}
                  aria-label={`${copy.save} ${slotName}`}
                  onClick={() => onSave(slot)}
                  className="min-h-11 min-w-11 rounded-md border border-[var(--site-border-soft)] px-2 py-2 text-sm text-[var(--site-ink)] transition-colors hover:border-[var(--site-accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {copy.save}
                </button>
                <button
                  type="button"
                  disabled={busy || !occupied}
                  title={loadHint}
                  aria-label={`${copy.load} ${slotName}`}
                  onClick={() => onLoad(slot)}
                  className="min-h-11 min-w-11 rounded-md border border-[var(--site-border-soft)] px-2 py-2 text-sm text-[var(--site-ink)] transition-colors hover:border-[var(--site-accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {copy.load}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
