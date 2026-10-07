'use client';

import { useId, useState } from 'react';

import type { SolarSystemCopy } from '@/lib/solar-system-creator/copy';
import {
  SOLAR_FIXED_MAX_PLANETS,
  type SolarStarRange,
} from '@/lib/solar-system-creator/types';

export interface SolarSystemRandomSettingsPanelProps {
  copy: SolarSystemCopy;
  starRange: SolarStarRange;
  requestedPlanetCount: number | null;
  onStarRangeChange: (starRange: SolarStarRange) => void;
  onPlanetCountChange: (requestedPlanetCount: number | null) => void;
  onRegenerate: () => void;
}

const SOLAR_STAR_RANGES: readonly SolarStarRange[] = [
  'normal',
  'include-blue',
  'only-blue',
];

function isSolarStarRange(value: string): value is SolarStarRange {
  return value === 'normal' || value === 'include-blue' || value === 'only-blue';
}

function parsePlanetCount(rawValue: string): number | null {
  if (rawValue === '') return null;

  const parsedValue = Number(rawValue);
  if (
    Number.isInteger(parsedValue) &&
    parsedValue >= 0 &&
    parsedValue <= SOLAR_FIXED_MAX_PLANETS
  ) {
    return parsedValue;
  }

  throw new Error(
    `Solar planet count must be empty or an integer from 0 to ${SOLAR_FIXED_MAX_PLANETS}. Received ${JSON.stringify(rawValue)}.`,
  );
}

export function SolarSystemRandomSettingsPanel({
  copy,
  starRange,
  requestedPlanetCount,
  onStarRangeChange,
  onPlanetCountChange,
  onRegenerate,
}: SolarSystemRandomSettingsPanelProps) {
  const groupId = useId();
  const [countError, setCountError] = useState<string | null>(null);
  const countInputId = `${groupId}-planet-count`;
  const countHintId = `${groupId}-planet-count-hint`;
  const radioGroupName = `${groupId}-star-range`;

  function updateStarRange(rawValue: string) {
    if (!isSolarStarRange(rawValue)) {
      throw new Error(`Unknown solar star range value: ${JSON.stringify(rawValue)}.`);
    }

    onStarRangeChange(rawValue);
  }

  function updatePlanetCount(rawValue: string) {
    let parsedValue: number | null;
    try {
      parsedValue = parsePlanetCount(rawValue);
    } catch (reason: unknown) {
      if (reason instanceof Error) {
        setCountError(`${copy.errorLabel}: ${reason.message}`);
        return;
      }

      throw reason;
    }

    setCountError(null);
    onPlanetCountChange(parsedValue);
  }

  return (
    <section
      aria-labelledby={`${groupId}-heading`}
      className="flex min-w-0 flex-col gap-3 rounded-lg border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] p-3 text-[var(--site-ink)]"
    >
      <h2 id={`${groupId}-heading`} className="text-sm font-semibold text-[var(--site-ink-strong)]">
        {copy.settingsTitle}
      </h2>

      <fieldset className="flex min-w-0 flex-col gap-2">
        <legend className="sr-only">{copy.starRangeLabels.normal}</legend>
        {SOLAR_STAR_RANGES.map((range) => (
          <label key={range} className="flex min-h-11 items-center gap-2 text-sm">
            <input
              type="radio"
              name={radioGroupName}
              value={range}
              checked={starRange === range}
              onChange={(event) => updateStarRange(event.currentTarget.value)}
              className="h-4 w-4 accent-[var(--site-accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)]"
            />
            <span>{copy.starRangeLabels[range]}</span>
          </label>
        ))}
      </fieldset>

      <div className="flex min-w-0 flex-col gap-1">
        <label htmlFor={countInputId} className="text-xs font-medium text-[var(--site-ink-strong)]">
          {copy.countLabel}
        </label>
        <input
          id={countInputId}
          type="number"
          min={0}
          max={SOLAR_FIXED_MAX_PLANETS}
          step={1}
          inputMode="numeric"
          value={requestedPlanetCount ?? ''}
          aria-invalid={countError !== null}
          aria-describedby={countError === null ? countHintId : `${countHintId} ${countInputId}-error`}
          onChange={(event) => updatePlanetCount(event.currentTarget.value)}
          className="min-h-11 w-full rounded-md border border-[var(--site-border-soft)] bg-[var(--site-panel)] px-3 py-2 text-sm text-[var(--site-ink)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)]"
        />
        <p id={countHintId} className="text-xs text-[var(--site-ink-soft)]">
          {copy.countHint}
        </p>
        {countError !== null ? (
          <p id={`${countInputId}-error`} role="alert" className="text-xs text-[var(--destructive)]">
            {countError}
          </p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => onRegenerate()}
        className="min-h-11 w-full rounded-md border border-[var(--site-accent-strong)] bg-[var(--site-accent-bg)] px-3 py-2 text-sm font-medium text-[var(--site-accent-strong)] transition-colors hover:bg-[var(--site-accent-strong)] hover:text-[var(--background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)]"
      >
        {copy.regenerate}
      </button>
    </section>
  );
}
