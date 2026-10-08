'use client';

import { useId } from 'react';
import Image from 'next/image';

import { getSolarAsset } from '@/lib/solar-system-creator/catalog';
import type { SolarSystemCopy } from '@/lib/solar-system-creator/copy';
import type {
  ManualSolarPlanet,
  RandomSolarPlanet,
  SolarPlanetField,
} from '@/lib/solar-system-creator/types';

export interface SolarSystemPlanetDetailsPanelProps {
  copy: SolarSystemCopy;
  mode: 'random' | 'manual';
  randomPlanet?: RandomSolarPlanet | null;
  manualPlanet?: ManualSolarPlanet | null;
  onRandomFieldChange?: (field: SolarPlanetField, value: string) => void;
  onDescriptionChange?: (value: string) => void;
  onDeleteSelected?: () => void;
}

const SOLAR_PLANET_FIELDS: readonly SolarPlanetField[] = [
  'environment',
  'atmosphere',
  'surfaceMap',
  'dayHours',
  'gravity',
  'orbitYears',
  'moons',
  'axialTilt',
];

function planetNumber(planetId: string): number {
  const trailingNumber = /(\d+)$/.exec(planetId)?.[1];
  if (trailingNumber === undefined) return 1;

  const parsedNumber = Number(trailingNumber);
  return Number.isSafeInteger(parsedNumber) && parsedNumber > 0 ? parsedNumber : 1;
}

function applyPlanetLabel(template: string, number: number): string {
  return template.replaceAll('{number}', String(number));
}

export function SolarSystemPlanetDetailsPanel({
  copy,
  mode,
  randomPlanet,
  manualPlanet,
  onRandomFieldChange,
  onDescriptionChange,
  onDeleteSelected,
}: SolarSystemPlanetDetailsPanelProps) {
  const panelId = useId();
  const selectedPlanet = mode === 'random' ? randomPlanet ?? null : manualPlanet ?? null;

  function changeRandomField(field: SolarPlanetField, value: string) {
    if (onRandomFieldChange === undefined) {
      throw new Error(`Random planet field callback is required for ${field}.`);
    }

    onRandomFieldChange(field, value);
  }

  function changeDescription(value: string) {
    if (onDescriptionChange === undefined) {
      throw new Error('Manual planet description callback is required.');
    }

    onDescriptionChange(value);
  }

  return (
    <section
      aria-labelledby={`${panelId}-heading`}
      className="flex min-w-0 flex-col gap-3 rounded-lg border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] p-3 text-[var(--site-ink)]"
    >
      <h2 id={`${panelId}-heading`} className="text-sm font-semibold text-[var(--site-ink-strong)]">
        {copy.detailsTitle}
      </h2>

      {selectedPlanet === null ? (
        <p className="text-sm text-[var(--site-ink-soft)]">{copy.selectPlanetHint}</p>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <Image
              src={getSolarAsset(selectedPlanet.assetId).src}
              alt={applyPlanetLabel(copy.planetLabel, planetNumber(selectedPlanet.id))}
              width={256}
              height={256}
              unoptimized
              className="h-32 w-32 rounded-md border border-[var(--site-border-soft)] bg-[var(--site-panel)] object-contain p-2"
            />
            <h3 className="text-sm font-semibold text-[var(--site-ink-strong)]">
              {applyPlanetLabel(copy.planetLabel, planetNumber(selectedPlanet.id))}
            </h3>
          </div>

          {mode === 'random' && randomPlanet !== null && randomPlanet !== undefined ? (
            <div className="grid min-w-0 gap-2 sm:grid-cols-2">
              {SOLAR_PLANET_FIELDS.map((field) => {
                const unitId = `${panelId}-${field}-unit`;
                return (
                  <div key={field} className="flex min-w-0 flex-col gap-1">
                    <label htmlFor={`${panelId}-${field}`} className="text-xs font-medium text-[var(--site-ink-strong)]">
                      {copy.fieldLabels[field]}
                      {copy.units[field] ? (
                        <span id={unitId} className="ml-1 text-[var(--site-ink-soft)]">
                          ({copy.units[field]})
                        </span>
                      ) : null}
                    </label>
                    <input
                      id={`${panelId}-${field}`}
                      type="text"
                      value={randomPlanet.fields[field]}
                      aria-label={copy.fieldLabels[field]}
                      aria-describedby={copy.units[field] ? unitId : undefined}
                      onChange={(event) => changeRandomField(field, event.currentTarget.value)}
                      className="min-h-11 w-full rounded-md border border-[var(--site-border-soft)] bg-[var(--site-panel)] px-3 py-2 text-sm text-[var(--site-ink)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)]"
                    />
                  </div>
                );
              })}
            </div>
          ) : null}

          {mode === 'manual' && manualPlanet !== null && manualPlanet !== undefined ? (
            <div className="flex min-w-0 flex-col gap-2">
              <label htmlFor={`${panelId}-description`} className="text-xs font-medium text-[var(--site-ink-strong)]">
                {copy.description}
              </label>
              <textarea
                id={`${panelId}-description`}
                value={manualPlanet.description}
                onChange={(event) => changeDescription(event.currentTarget.value)}
                rows={5}
                className="min-h-28 w-full resize-y rounded-md border border-[var(--site-border-soft)] bg-[var(--site-panel)] px-3 py-2 text-sm text-[var(--site-ink)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)]"
              />
              {onDeleteSelected !== undefined ? (
                <button
                  type="button"
                  onClick={() => onDeleteSelected()}
                  className="min-h-11 w-full rounded-md border border-[var(--site-border-soft)] px-3 py-2 text-sm text-[var(--site-ink)] transition-colors hover:border-[var(--site-accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)]"
                >
                  {copy.deleteSelected}
                </button>
              ) : null}
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
