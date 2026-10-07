// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { listSolarAssets } from '@/lib/solar-system-creator/catalog';
import { getSolarSystemCopy } from '@/lib/solar-system-creator/copy';
import type {
  ManualSolarPlanet,
  RandomSolarPlanet,
  SolarAssetCategory,
  SolarPlanetFields,
} from '@/lib/solar-system-creator/types';

import {
  SolarSystemRandomSettingsPanel,
  type SolarSystemRandomSettingsPanelProps,
} from './SolarSystemRandomSettingsPanel';
import {
  SolarSystemAssetsPanel,
  type SolarSystemAssetsPanelProps,
} from './SolarSystemAssetsPanel';
import {
  SolarSystemFilePanel,
  type SolarSystemFilePanelProps,
} from './SolarSystemFilePanel';
import {
  SolarSystemPlanetDetailsPanel,
  type SolarSystemPlanetDetailsPanelProps,
} from './SolarSystemPlanetDetailsPanel';

afterEach(cleanup);

const CATEGORIES: readonly SolarAssetCategory[] = [
  'star',
  'type-1',
  'type-2',
  'type-3',
  'type-4',
  'type-5',
];

const RANDOM_FIELDS: SolarPlanetFields = {
  environment: 'Gentle',
  atmosphere: 'Thin',
  surfaceMap: 'Yes',
  dayHours: '24',
  gravity: '1.0',
  orbitYears: '1',
  moons: '1',
  axialTilt: '23.5',
};

function createRandomPlanet(): RandomSolarPlanet {
  return {
    id: 'planet-1',
    assetId: 'type-1-1',
    x: 220,
    y: 100,
    width: 40,
    height: 40,
    fields: RANDOM_FIELDS,
  };
}

function createManualPlanet(): ManualSolarPlanet {
  return {
    id: 'planet-2',
    assetId: 'type-2-1',
    x: 300,
    y: 120,
    width: 40,
    height: 40,
    description: 'A quiet world with a wide blue sea.',
  };
}

function RandomDetailsHarness() {
  const [planet, setPlanet] = useState(createRandomPlanet);
  const copy = getSolarSystemCopy('en');

  return (
    <SolarSystemPlanetDetailsPanel
      copy={copy}
      mode="random"
      randomPlanet={planet}
      onRandomFieldChange={(field, value) => {
        setPlanet((currentPlanet) => ({
          ...currentPlanet,
          fields: { ...currentPlanet.fields, [field]: value },
        }));
      }}
    />
  );
}

function createRandomSettingsProps(
  overrides: Partial<SolarSystemRandomSettingsPanelProps> = {},
): SolarSystemRandomSettingsPanelProps {
  return {
    copy: getSolarSystemCopy('en'),
    starRange: 'normal',
    requestedPlanetCount: null,
    onStarRangeChange: vi.fn(),
    onPlanetCountChange: vi.fn(),
    onRegenerate: vi.fn(),
    ...overrides,
  };
}

function createAssetsProps(
  overrides: Partial<SolarSystemAssetsPanelProps> = {},
): SolarSystemAssetsPanelProps {
  return {
    copy: getSolarSystemCopy('en'),
    category: 'star',
    onCategoryChange: vi.fn(),
    onChooseAsset: vi.fn(),
    ...overrides,
  };
}

describe('SolarSystemRandomSettingsPanel', () => {
  it.each(['en', 'zh'] as const)('renders the localized settings controls in %s', (locale) => {
    const copy = getSolarSystemCopy(locale);
    const props = createRandomSettingsProps({ copy });
    render(<SolarSystemRandomSettingsPanel {...props} />);

    expect(screen.getByRole('heading', { name: copy.settingsTitle })).toBeDefined();
    expect(screen.getByLabelText(copy.countLabel)).toBeDefined();
    expect(screen.getByRole('button', { name: copy.regenerate })).toBeDefined();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('sends valid count changes, empty random count, star range changes, and regenerate', () => {
    const props = createRandomSettingsProps();
    const { rerender } = render(<SolarSystemRandomSettingsPanel {...props} />);

    const countInput = screen.getByLabelText(props.copy.countLabel);
    fireEvent.change(countInput, { target: { value: '7' } });
    rerender(<SolarSystemRandomSettingsPanel {...props} requestedPlanetCount={7} />);
    fireEvent.change(screen.getByLabelText(props.copy.countLabel), { target: { value: '' } });
    fireEvent.click(screen.getByLabelText(props.copy.starRangeLabels['only-blue']));
    fireEvent.click(screen.getByRole('button', { name: props.copy.regenerate }));

    expect(props.onPlanetCountChange).toHaveBeenNthCalledWith(1, 7);
    expect(props.onPlanetCountChange).toHaveBeenNthCalledWith(2, null);
    expect(props.onStarRangeChange).toHaveBeenCalledExactlyOnceWith('only-blue');
    expect(props.onRegenerate).toHaveBeenCalledExactlyOnceWith();
  });

  it('reports an invalid count with the received value', () => {
    const props = createRandomSettingsProps();
    render(<SolarSystemRandomSettingsPanel {...props} />);

    const countInput = screen.getByLabelText(props.copy.countLabel) as HTMLInputElement;
    fireEvent.change(countInput, { target: { value: '11' } });

    expect(props.onPlanetCountChange).not.toHaveBeenCalled();
    expect(countInput.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByRole('alert').textContent).toContain('11');
  });
});

describe('SolarSystemAssetsPanel', () => {
  it.each(CATEGORIES)('shows all 40 PNG assets and chooses one for %s', (category) => {
    const props = createAssetsProps({ category });
    const { rerender } = render(<SolarSystemAssetsPanel {...props} />);
    const assets = listSolarAssets(category);

    expect(assets).toHaveLength(40);
    expect(screen.getAllByRole('listitem')).toHaveLength(40);
    const firstAssetButton = screen.getAllByRole('button', {
      name: `${props.copy.categoryLabels[category]} 1`,
    })[0];
    fireEvent.click(firstAssetButton);
    expect(props.onChooseAsset).toHaveBeenCalledExactlyOnceWith(assets[0].id);

    for (const nextCategory of CATEGORIES) {
      rerender(<SolarSystemAssetsPanel {...props} category={nextCategory} />);
      fireEvent.click(screen.getByRole('tab', { name: props.copy.categoryLabels[nextCategory] }));
      expect(props.onCategoryChange).toHaveBeenLastCalledWith(nextCategory);
    }
  });

  it('keeps Chinese category labels on the tab and asset buttons', () => {
    const copy = getSolarSystemCopy('zh');
    render(<SolarSystemAssetsPanel {...createAssetsProps({ copy, category: 'type-3' })} />);

    expect(screen.getByRole('tab', { name: copy.categoryLabels['type-3'] })).toBeDefined();
    expect(screen.getByRole('button', { name: `${copy.categoryLabels['type-3']} 1` })).toBeDefined();
  });

  it('uses one tabpanel target and roving keyboard focus for category tabs', () => {
    const props = createAssetsProps({ category: 'star' });
    const { rerender } = render(<SolarSystemAssetsPanel {...props} />);
    const tabpanel = screen.getByRole('tabpanel');
    const initialTabs = screen.getAllByRole('tab');

    expect(initialTabs.map((tab) => tab.getAttribute('aria-controls'))).toEqual(
      Array.from({ length: CATEGORIES.length }, () => tabpanel.id),
    );
    expect(initialTabs.map((tab) => (tab as HTMLButtonElement).tabIndex)).toEqual([0, -1, -1, -1, -1, -1]);

    fireEvent.keyDown(initialTabs[0], { key: 'ArrowRight' });
    expect(props.onCategoryChange).toHaveBeenLastCalledWith('type-1');
    expect(document.activeElement).toBe(initialTabs[1]);

    rerender(<SolarSystemAssetsPanel {...props} category="type-1" />);
    const updatedTabs = screen.getAllByRole('tab');
    expect(updatedTabs.map((tab) => (tab as HTMLButtonElement).tabIndex)).toEqual([-1, 0, -1, -1, -1, -1]);

    fireEvent.keyDown(updatedTabs[1], { key: 'ArrowLeft' });
    expect(props.onCategoryChange).toHaveBeenLastCalledWith('star');
    expect(document.activeElement).toBe(updatedTabs[0]);

    fireEvent.keyDown(updatedTabs[1], { key: 'Home' });
    expect(props.onCategoryChange).toHaveBeenLastCalledWith('star');
    expect(document.activeElement).toBe(updatedTabs[0]);

    fireEvent.keyDown(updatedTabs[1], { key: 'End' });
    expect(props.onCategoryChange).toHaveBeenLastCalledWith('type-5');
    expect(document.activeElement).toBe(updatedTabs[5]);
  });
});

describe('SolarSystemPlanetDetailsPanel', () => {
  it('edits each selected random field through the controlled callback', () => {
    render(<RandomDetailsHarness />);
    const copy = getSolarSystemCopy('en');

    fireEvent.change(screen.getByLabelText(copy.fieldLabels.environment), {
      target: { value: 'Hostile' },
    });

    expect((screen.getByLabelText(copy.fieldLabels.environment) as HTMLInputElement).value).toBe('Hostile');
    expect(screen.getAllByRole('textbox')).toHaveLength(8);
  });

  it('edits and deletes a manual planet', () => {
    const copy = getSolarSystemCopy('zh');
    const onDescriptionChange = vi.fn();
    const onDeleteSelected = vi.fn();
    const props: SolarSystemPlanetDetailsPanelProps = {
      copy,
      mode: 'manual',
      manualPlanet: createManualPlanet(),
      onDescriptionChange,
      onDeleteSelected,
    };
    render(<SolarSystemPlanetDetailsPanel {...props} />);

    fireEvent.change(screen.getByLabelText(copy.description), { target: { value: '新的描述' } });
    fireEvent.click(screen.getByRole('button', { name: copy.deleteSelected }));

    expect(onDescriptionChange).toHaveBeenCalledExactlyOnceWith('新的描述');
    expect(onDeleteSelected).toHaveBeenCalledExactlyOnceWith();
  });

  it('shows the selection hint when no planet is selected', () => {
    const copy = getSolarSystemCopy('en');
    render(<SolarSystemPlanetDetailsPanel copy={copy} mode="manual" manualPlanet={null} />);

    expect(screen.getByText(copy.selectPlanetHint)).toBeDefined();
  });
});

describe('SolarSystemFilePanel', () => {
  it('exposes five save/load pairs and routes each occupied slot', () => {
    const copy = getSolarSystemCopy('en');
    const onSave = vi.fn();
    const onLoad = vi.fn();
    const props: SolarSystemFilePanelProps = {
      copy,
      occupiedSlots: [true, false, true, false, true],
      onSave,
      onLoad,
    };
    render(<SolarSystemFilePanel {...props} />);

    expect(screen.getAllByRole('button', { name: /^Save Slot/ })).toHaveLength(5);
    expect(screen.getAllByRole('button', { name: /^Load Slot/ })).toHaveLength(5);
    for (const slot of [1, 2, 3, 4, 5] as const) {
      fireEvent.click(screen.getByRole('button', { name: `${copy.save} Slot ${slot}` }));
      const loadButton = screen.getByRole('button', { name: `${copy.load} Slot ${slot}` }) as HTMLButtonElement;
      if (props.occupiedSlots[slot - 1]) fireEvent.click(loadButton);
      else expect(loadButton.disabled).toBe(true);
    }
    expect(onSave).toHaveBeenCalledTimes(5);
    expect(onSave.mock.calls.map(([slot]) => slot)).toEqual([1, 2, 3, 4, 5]);
    expect(onLoad.mock.calls.map(([slot]) => slot)).toEqual([1, 3, 5]);
    expect(screen.queryByRole('button', { name: copy.imageGenerate })).toBeNull();
    expect(screen.queryByRole('button', { name: copy.print })).toBeNull();
  });

  it('shows localized file labels and keeps export actions outside the file panel', () => {
    const copy = getSolarSystemCopy('zh');
    render(
      <SolarSystemFilePanel
        copy={copy}
        occupiedSlots={[false, false, false, false, false]}
        onSave={vi.fn()}
        onLoad={vi.fn()}
        busy
      />,
    );

    expect(screen.getByRole('heading', { name: copy.filesTitle })).toBeDefined();
    expect(screen.queryByRole('button', { name: copy.imageGenerate })).toBeNull();
    expect(screen.queryByRole('button', { name: copy.print })).toBeNull();
    expect(screen.getAllByRole('button', { name: /^保存 槽位/ })).toHaveLength(5);
    expect(screen.getAllByRole('button', { name: /^加载 槽位/ })).toHaveLength(5);
  });
});
