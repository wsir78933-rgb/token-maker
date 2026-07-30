'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type { CoatField, CoatLocale } from '@/lib/coat-of-arms/types';
import { usePanelCommandError } from './usePanelCommandError';
import { flagPresetCategories, getCoatWorkbenchCopy, type FlagPresetCategory, type FlagPresetId } from './workbench-copy';

type FlagPreset = {
  id: FlagPresetId;
  category: FlagPresetCategory;
  searchTerms: readonly string[];
  createField: () => CoatField;
};

const flagPresets: readonly FlagPreset[] = [
  {
    id: 'vertical-tricolour',
    category: 'tricolour',
    searchTerms: ['vertical', 'tricolour', 'three colours', '竖向', '三色'],
    createField: () => ({
      division: 'tierced-per-pale',
      colors: ['#005293', '#FFFFFF'],
      pattern: 'solid',
      regions: {
        'tierced-pale-1': { colors: ['#005293'], pattern: 'solid' },
        'tierced-pale-2': { colors: ['#FFFFFF'], pattern: 'solid' },
        'tierced-pale-3': { colors: ['#D21034'], pattern: 'solid' },
      },
    }),
  },
  {
    id: 'horizontal-tricolour',
    category: 'tricolour',
    searchTerms: ['horizontal', 'tricolour', 'three colours', '横向', '三色'],
    createField: () => ({
      division: 'tierced-per-fess',
      colors: ['#111827', '#FFFFFF'],
      pattern: 'solid',
      regions: {
        'tierced-fess-1': { colors: ['#111827'], pattern: 'solid' },
        'tierced-fess-2': { colors: ['#FFFFFF'], pattern: 'solid' },
        'tierced-fess-3': { colors: ['#D21034'], pattern: 'solid' },
      },
    }),
  },
  {
    id: 'diagonal-bicolour',
    category: 'diagonal',
    searchTerms: ['diagonal', 'bicolour', 'bend', '斜向', '双色'],
    createField: () => ({
      division: 'per-bend',
      colors: ['#F7C900', '#005293'],
      pattern: 'solid',
    }),
  },
  {
    id: 'nordic-cross',
    category: 'cross',
    searchTerms: ['nordic', 'cross', 'scandinavian', '北欧', '十字'],
    createField: () => ({
      division: 'solid',
      colors: ['#005293'],
      pattern: 'solid',
      ornaments: [{
        id: 'flag-nordic-cross',
        kind: 'cross',
        color: '#F7C900',
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        crossHorizontalThickness: 14,
        crossVerticalThickness: 14,
        crossCenterX: 35,
        crossCenterY: 55,
      }],
    }),
  },
  {
    id: 'quartered-colours',
    category: 'band',
    searchTerms: ['quarter', 'quartered', 'four colours', '四分', '四色'],
    createField: () => ({ division: 'quarterly', colors: ['#D21034', '#F7C900'], pattern: 'solid' }),
  },
  {
    id: 'barred-banner',
    category: 'band',
    searchTerms: ['bar', 'barred', 'horizontal bands', '横条', '条纹'],
    createField: () => ({ division: 'barry', colors: ['#FFFFFF', '#D21034'], pattern: 'solid' }),
  },
  {
    id: 'saltire-banner',
    category: 'cross',
    searchTerms: ['saltire', 'cross', 'diagonal cross', '斜十字'],
    createField: () => ({ division: 'per-saltire', colors: ['#005293', '#F7C900'], pattern: 'solid' }),
  },
  {
    id: 'chevron-banner',
    category: 'diagonal',
    searchTerms: ['chevron', 'angle', '人字', '斜向'],
    createField: () => ({ division: 'per-chevron', colors: ['#28753A', '#FFFFFF'], pattern: 'solid' }),
  },
];

function matchesFlagPreset(preset: FlagPreset, rawQuery: string): boolean {
  const normalizedQuery = rawQuery.trim().toLocaleLowerCase();
  if (normalizedQuery.length === 0) return true;
  return [preset.id, ...preset.searchTerms].join(' ').toLocaleLowerCase().includes(normalizedQuery);
}

/** Applies original local flag-style field data through the validated project command API. */
export function TargetFlagPalette({ locale }: { locale: CoatLocale }) {
  const copy = getCoatWorkbenchCopy(locale).palettes.flag;
  const project = useCoatProjectStore((state) => state.project);
  const { error, run } = usePanelCommandError(locale);
  const shield = project.layers.find((layer) => layer.type === 'shield');
  const [activeCategory, setActiveCategory] = useState<FlagPresetCategory>(flagPresetCategories[1]);
  const [search, setSearch] = useState('');

  if (!shield || shield.type !== 'shield') {
    throw new Error('Flag palette requires a project shield layer');
  }
  const visiblePresets = flagPresets.filter((preset) => preset.category === activeCategory && matchesFlagPreset(preset, search));

  return (
    <section aria-label={copy.library} className="grid gap-3 p-3">
      {error ? <p role="alert">{error}</p> : null}
      <div>
        <h2>{copy.heading}</h2>
        <p>{copy.description}</p>
      </div>
      <div aria-label={copy.categoryFilter} className="flex flex-wrap gap-1" role="group">
        {flagPresetCategories.map((category) => <button
          aria-pressed={activeCategory === category}
          className={`rounded border border-[color:var(--coat-line)] px-2 py-1 text-xs ${activeCategory === category ? 'bg-[color:var(--coat-line)] text-[color:var(--coat-panel)]' : ''}`}
          key={category}
          onClick={() => setActiveCategory(category)}
          type="button"
        >{copy.categories[category]}</button>)}
      </div>
      <label className="coat-target-search">
        <Search aria-hidden="true" className="coat-target-search-icon" data-search-glyph="true" />
        <span className="sr-only">{copy.search}</span>
        <input aria-label={copy.search} onChange={(event) => setSearch(event.target.value)} placeholder={copy.search} type="search" value={search} />
      </label>
      {visiblePresets.length === 0 ? <p role="status">{copy.noResults}</p> : null}
      <ul aria-label={copy.library} className="grid grid-cols-2 gap-2">
        {visiblePresets.map((preset) => {
          const presetName = copy.presetName(preset.id);
          return <li key={preset.id}>
            <button
              aria-label={copy.usePreset(presetName)}
              className="grid w-full gap-2 rounded border border-[color:var(--coat-line)] p-2 text-left"
              onClick={() => run({ type: 'set-field', layerId: shield.id, field: preset.createField() })}
              type="button"
            >
              <FlagPresetPreview presetId={preset.id} />
              <span>{presetName}</span>
            </button>
          </li>;
        })}
      </ul>
    </section>
  );
}

function FlagPresetPreview({ presetId }: { presetId: FlagPreset['id'] }) {
  if (presetId === 'vertical-tricolour') {
    return <svg aria-hidden="true" className="h-16 w-full" viewBox="0 0 100 60"><path d="M0 0H33.34V60H0Z" fill="#005293" /><path d="M33.33 0H66.67V60H33.33Z" fill="#FFFFFF" /><path d="M66.66 0H100V60H66.66Z" fill="#D21034" /></svg>;
  }
  if (presetId === 'horizontal-tricolour') {
    return <svg aria-hidden="true" className="h-16 w-full" viewBox="0 0 100 60"><path d="M0 0H100V20H0Z" fill="#111827" /><path d="M0 20H100V40H0Z" fill="#FFFFFF" /><path d="M0 40H100V60H0Z" fill="#D21034" /></svg>;
  }
  if (presetId === 'diagonal-bicolour') {
    return <svg aria-hidden="true" className="h-16 w-full" viewBox="0 0 100 60"><path d="M0 0H100V60Z" fill="#F7C900" /><path d="M0 0V60H100Z" fill="#005293" /></svg>;
  }
  if (presetId === 'nordic-cross') {
    return <svg aria-hidden="true" className="h-16 w-full" viewBox="0 0 100 60"><rect fill="#005293" height="60" width="100" /><path d="M28 0H42V23H100V37H42V60H28V37H0V23H28Z" fill="#F7C900" /></svg>;
  }
  if (presetId === 'quartered-colours') {
    return <svg aria-hidden="true" className="h-16 w-full" viewBox="0 0 100 60"><path d="M0 0H50V30H0Z M50 30H100V60H50Z" fill="#D21034" /><path d="M50 0H100V30H50Z M0 30H50V60H0Z" fill="#F7C900" /></svg>;
  }
  if (presetId === 'barred-banner') {
    return <svg aria-hidden="true" className="h-16 w-full" viewBox="0 0 100 60"><path d="M0 0H100V15H0Z M0 30H100V45H0Z" fill="#D21034" /><path d="M0 15H100V30H0Z M0 45H100V60H0Z" fill="#FFFFFF" /></svg>;
  }
  if (presetId === 'saltire-banner') {
    return <svg aria-hidden="true" className="h-16 w-full" viewBox="0 0 100 60"><rect fill="#005293" height="60" width="100" /><path d="M0 0L13 0L100 52V60H87L0 8Z M87 0H100V8L13 60H0V52Z" fill="#F7C900" /></svg>;
  }
  return <svg aria-hidden="true" className="h-16 w-full" viewBox="0 0 100 60"><rect fill="#28753A" height="60" width="100" /><path d="M0 60L20 60L50 20L80 60H100L50 0Z" fill="#FFFFFF" /></svg>;
}
