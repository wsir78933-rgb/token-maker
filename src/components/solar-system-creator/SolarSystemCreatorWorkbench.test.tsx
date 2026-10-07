// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';

import type { SolarSystemCopy } from '@/lib/solar-system-creator/copy';
import { SOLAR_SYSTEM_SAVE_STORAGE_KEY } from '@/lib/solar-system-creator/saves';

const { buildRandomSolarSystemPng, buildSolarSystemPng } = vi.hoisted(() => ({
  buildRandomSolarSystemPng: vi.fn(),
  buildSolarSystemPng: vi.fn(),
}));

vi.mock('@/lib/solar-system-creator/export-image', () => ({
  buildRandomSolarSystemPng,
  buildSolarSystemPng,
}));

vi.mock('./SolarSystemRandomSettingsPanel', () => ({
  SolarSystemRandomSettingsPanel: ({
    requestedPlanetCount,
    onPlanetCountChange,
    onRegenerate,
  }: {
    requestedPlanetCount: number | null;
    onPlanetCountChange: (count: number | null) => void;
    onRegenerate: () => void;
  }) => (
    <div data-testid="random-settings-panel">
      <label>
        Count
        <input
          aria-label="Count"
          value={requestedPlanetCount ?? ''}
          onChange={(event) => onPlanetCountChange(event.currentTarget.value === '' ? null : Number(event.currentTarget.value))}
        />
      </label>
      <button type="button" onClick={onRegenerate}>Regenerate</button>
    </div>
  ),
}));

vi.mock('./SolarSystemAssetsPanel', () => ({
  SolarSystemAssetsPanel: ({ onChooseAsset, onCategoryChange }: {
    onChooseAsset: (assetId: string) => void;
    onCategoryChange: (category: 'star' | 'type-1') => void;
  }) => (
    <div data-testid="assets-panel">
      <button type="button" onClick={() => onCategoryChange('star')}>Star category</button>
      <button type="button" onClick={() => onChooseAsset('star-1')}>Choose star</button>
      <button type="button" onClick={() => onCategoryChange('type-1')}>Planet category</button>
      <button type="button" onClick={() => onChooseAsset('type-1-1')}>Choose planet</button>
    </div>
  ),
}));

vi.mock('./SolarSystemCanvas', () => ({
  SolarSystemCanvas: ({
    planets,
    selectedPlanetId,
    onSelectPlanet,
  }: {
    planets: readonly { id: string }[];
    selectedPlanetId: string | null;
    onSelectPlanet: (id: string | null) => void;
  }) => (
    <div data-testid="solar-canvas">
      <span data-testid="canvas-planets">{planets.length}</span>
      {planets.map((planet) => (
        <button
          key={planet.id}
          type="button"
          data-selected={selectedPlanetId === planet.id ? 'true' : 'false'}
          onClick={() => onSelectPlanet(planet.id)}
        >
          {planet.id}
        </button>
      ))}
      <button type="button" onClick={() => onSelectPlanet(null)}>Deselect</button>
    </div>
  ),
}));

vi.mock('./SolarSystemPlanetDetailsPanel', () => ({
  SolarSystemPlanetDetailsPanel: ({
    mode,
    randomPlanet,
    manualPlanet,
    onRandomFieldChange,
    onDescriptionChange,
    onDeleteSelected,
  }: {
    mode: 'random' | 'manual';
    randomPlanet?: { id: string; fields: Record<string, string> };
    manualPlanet?: { id: string; description: string };
    onRandomFieldChange?: (field: 'environment', value: string) => void;
    onDescriptionChange?: (description: string) => void;
    onDeleteSelected?: () => void;
  }) => (
    <div data-testid="details-panel">
      <span>{mode}</span>
      {randomPlanet ? (
        <>
          <span data-testid="random-selection">{randomPlanet.id}</span>
          <input
            aria-label="Environment"
            value={randomPlanet.fields.environment}
            onChange={(event) => onRandomFieldChange?.('environment', event.currentTarget.value)}
          />
        </>
      ) : null}
      {manualPlanet ? (
        <>
          <textarea
            aria-label="Description"
            value={manualPlanet.description}
            onChange={(event) => onDescriptionChange?.(event.currentTarget.value)}
          />
          <button type="button" onClick={onDeleteSelected}>Delete selected</button>
        </>
      ) : null}
    </div>
  ),
}));

vi.mock('./SolarSystemExportPanel', () => ({
  SolarSystemExportPanel: ({
    copy: exportCopy,
    mode,
    onGenerateImage,
    onPrint,
    busy = false,
  }: {
    copy: SolarSystemCopy;
    mode: 'random' | 'manual';
    onGenerateImage: () => void;
    onPrint: () => void;
    busy?: boolean;
  }) => (
    <div data-testid="export-panel" data-mode={mode}>
      <button type="button" disabled={busy} onClick={onGenerateImage}>{exportCopy.imageGenerate}</button>
      <button type="button" disabled={busy} onClick={onPrint}>{exportCopy.print}</button>
    </div>
  ),
}));

vi.mock('./SolarSystemPrintDetails', () => ({
  SolarSystemPrintDetails: ({
    mode,
    planets,
  }: {
    mode: 'random' | 'manual';
    planets: readonly {
      id: string;
      fields?: Record<string, string>;
      description?: string;
    }[];
  }) => (
    <div data-testid="print-details" data-mode={mode}>
      {planets.map((planet) => (
        <article key={planet.id}>
          {mode === 'random' ? Object.values(planet.fields ?? {}).join('|') : planet.description}
        </article>
      ))}
    </div>
  ),
}));

vi.mock('./SolarSystemFilePanel', () => ({
  SolarSystemFilePanel: ({
    occupiedSlots,
    onSave,
    onLoad,
  }: {
    occupiedSlots: boolean[];
    onSave: (slot: number) => void;
    onLoad: (slot: number) => void;
  }) => (
    <div data-testid="file-panel">
      {occupiedSlots.map((occupied, index) => (
        <button key={index + 1} type="button" onClick={() => (occupied ? onLoad(index + 1) : onSave(index + 1))}>
          Slot {index + 1}
        </button>
      ))}
    </div>
  ),
}));

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ open, children }: { open: boolean; children: ReactNode }) => (open ? <div role="dialog">{children}</div> : null),
  DialogContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DialogClose: ({ onClick, 'aria-label': ariaLabel }: { onClick?: () => void; 'aria-label'?: string }) => (
    <button type="button" aria-label={ariaLabel} onClick={onClick}>Close</button>
  ),
  DialogTitle: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
  DialogDescription: ({ children }: { children: ReactNode }) => <p>{children}</p>,
}));

import { SolarSystemCreatorWorkbench } from './SolarSystemCreatorWorkbench';

const copy = {
  pageTitle: 'Solar System Creator',
  pageDescription: 'Create a solar system.',
  heading: 'Solar System Creator',
  navigationTitle: 'Solar System Creator',
  randomMode: 'Random generation',
  manualMode: 'Manual editing',
  helpTitle: 'How to use',
  helpSteps: ['Choose a mode', 'Select a planet'],
  settingsTitle: 'Generation settings',
  assetsTitle: 'Celestial assets',
  detailsTitle: 'Selected planet',
  filesTitle: 'Local saves',
  exportTitle: 'Export',
  canvasLabel: 'Solar system canvas',
  planetLabel: 'Planet {number}',
  resizePlanetLabel: 'Resize Planet {number}',
  close: 'Close',
  dragging: 'Dragging enabled',
  resizing: 'Resizing enabled',
  clearAll: 'Clear all planets',
  imageTitle: 'Generate image',
  imageGenerate: 'Generate image',
  imageSaveHint: 'Right-click or long-press the image to save it.',
  imageExcludesDescription: 'Images exclude planet descriptions.',
  randomImageExcludesDetails: 'Images exclude planet details.',
  print: 'Print',
  printIncludesDescriptions: 'Print includes descriptions.',
  randomPrintIncludesDetails: 'Print includes all details.',
  saveSuccessMessage: 'Saved.',
  loadSuccessMessage: 'Loaded.',
  saved: 'Saved.',
  loaded: 'Loaded.',
  errorLabel: 'Action failed.',
  operationFailed: 'Action failed.',
} as unknown as SolarSystemCopy;

function renderWorkbench() {
  return render(<SolarSystemCreatorWorkbench locale="en" copy={copy} />);
}

function openManualMode(): void {
  fireEvent.click(screen.getByRole('tab', { name: copy.manualMode as string }));
}

function firstByRole(role: Parameters<typeof screen.getAllByRole>[0], name: string): HTMLElement {
  const matches = screen.getAllByRole(role, { name });
  const firstMatch = matches[0];
  if (!(firstMatch instanceof HTMLElement)) throw new Error(`Missing ${role} ${name}.`);
  return firstMatch;
}

function firstByTestId(testId: string): HTMLElement {
  const matches = screen.getAllByTestId(testId);
  const firstMatch = matches[0];
  if (!(firstMatch instanceof HTMLElement)) throw new Error(`Missing test id ${testId}.`);
  return firstMatch;
}

function openMobilePanel(label: string): HTMLElement {
  fireEvent.click(screen.getByRole('tab', { name: label }));
  const panel = document.getElementById('solar-system-mobile-panel');
  if (!(panel instanceof HTMLElement)) throw new Error('Expected a mobile tabpanel.');
  return panel;
}

beforeEach(() => {
  window.localStorage.clear();
  buildRandomSolarSystemPng.mockReset();
  buildRandomSolarSystemPng.mockResolvedValue(new Blob(['random-png'], { type: 'image/png' }));
  buildSolarSystemPng.mockReset();
  buildSolarSystemPng.mockResolvedValue(new Blob(['png'], { type: 'image/png' }));
  Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: vi.fn(() => 'blob:solar-1') });
  Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: vi.fn() });
  Object.defineProperty(window, 'print', { configurable: true, value: vi.fn() });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('SolarSystemCreatorWorkbench', () => {
  it('keeps random and manual state isolated and supports random selection', async () => {
    renderWorkbench();
    await waitFor(() => expect(firstByTestId('canvas-planets').textContent).not.toBe('0'));
    expect(firstByTestId('random-settings-panel')).toBeTruthy();

    const firstPlanet = firstByRole('button', 'planet-1');
    fireEvent.click(firstPlanet);
    expect(screen.getByTestId('random-selection').textContent).toBe('planet-1');

    openManualMode();
    expect(firstByTestId('assets-panel')).toBeTruthy();
    expect(firstByTestId('canvas-planets').textContent).toBe('0');
    fireEvent.click(firstByRole('button', 'Choose planet'));
    expect(firstByTestId('canvas-planets').textContent).toBe('1');

    fireEvent.click(firstByRole('button', 'planet-1'));
    expect(screen.getByRole('textbox', { name: 'Description' })).toBeTruthy();
  });

  it('exports the current random system with the random PNG builder', async () => {
    renderWorkbench();
    await waitFor(() => expect(firstByTestId('canvas-planets').textContent).not.toBe('0'));

    fireEvent.click(firstByRole('button', 'planet-1'));
    fireEvent.change(screen.getByRole('textbox', { name: 'Environment' }), {
      target: { value: 'Edited random environment' },
    });

    fireEvent.click(firstByRole('button', copy.imageGenerate as string));
    await waitFor(() => expect(screen.getByRole('img', { name: copy.imageTitle as string })).toBeTruthy());

    expect(buildRandomSolarSystemPng).toHaveBeenCalledTimes(1);
    expect(buildSolarSystemPng).not.toHaveBeenCalled();
    const [exportedRandomSystem] = buildRandomSolarSystemPng.mock.calls[0] as [
      { selectedPlanetId: string | null; planets: readonly { id: string; fields: Record<string, string> }[] },
    ];
    expect(exportedRandomSystem.selectedPlanetId).toBe('planet-1');
    expect(exportedRandomSystem.planets.find((planet) => planet.id === 'planet-1')?.fields.environment).toBe(
      'Edited random environment',
    );
  });

  it('keeps manual selection when a pending random export resolves after a mode switch', async () => {
    let resolveRandomPng: ((blob: Blob) => void) | undefined;
    buildRandomSolarSystemPng.mockReturnValueOnce(new Promise<Blob>((resolve) => {
      resolveRandomPng = resolve;
    }));

    renderWorkbench();
    await waitFor(() => expect(firstByTestId('canvas-planets').textContent).not.toBe('0'));
    fireEvent.click(firstByRole('button', copy.imageGenerate as string));
    expect(buildRandomSolarSystemPng).toHaveBeenCalledTimes(1);

    openManualMode();
    fireEvent.click(firstByRole('button', 'Choose planet'));
    fireEvent.click(firstByRole('button', 'planet-1'));
    expect(firstByRole('button', 'planet-1').getAttribute('data-selected')).toBe('true');

    resolveRandomPng?.(new Blob(['random-png'], { type: 'image/png' }));
    await waitFor(() => expect(screen.getByRole('img', { name: copy.imageTitle as string })).toBeTruthy());
    expect(firstByRole('button', 'planet-1').getAttribute('data-selected')).toBe('true');
    expect(buildSolarSystemPng).not.toHaveBeenCalled();
  });

  it('prints every current random planet with the latest edited fields', async () => {
    renderWorkbench();
    await waitFor(() => expect(firstByTestId('canvas-planets').textContent).not.toBe('0'));

    fireEvent.click(firstByRole('button', 'planet-1'));
    fireEvent.change(screen.getByRole('textbox', { name: 'Environment' }), {
      target: { value: 'Latest printed environment' },
    });

    const printDetails = screen.getByTestId('print-details');
    expect(printDetails.getAttribute('data-mode')).toBe('random');
    expect(printDetails.querySelectorAll('article')).toHaveLength(
      Number(firstByTestId('canvas-planets').textContent),
    );
    expect(printDetails.textContent).toContain('Latest printed environment');

    fireEvent.click(firstByRole('button', copy.print as string));
    expect(window.print).toHaveBeenCalledTimes(1);
  });

  it('provides random image and print actions from the mobile export tab', async () => {
    renderWorkbench();
    await waitFor(() => expect(firstByTestId('canvas-planets').textContent).not.toBe('0'));

    const exportTab = screen.getByRole('tab', { name: copy.exportTitle as string });
    fireEvent.click(exportTab);
    const mobilePanel = document.getElementById('solar-system-mobile-panel');
    if (!(mobilePanel instanceof HTMLElement)) throw new Error('Missing mobile export panel.');
    expect(mobilePanel.getAttribute('aria-labelledby')).toBe(exportTab.id);
    expect(within(mobilePanel).getByTestId('export-panel').getAttribute('data-mode')).toBe('random');

    fireEvent.click(within(mobilePanel).getByRole('button', { name: copy.imageGenerate as string }));
    await waitFor(() => expect(screen.getByRole('img', { name: copy.imageTitle as string })).toBeTruthy());
    expect(buildRandomSolarSystemPng).toHaveBeenCalledTimes(1);
    expect(buildSolarSystemPng).not.toHaveBeenCalled();
  });

  it('writes and reads all five local save slots through the real storage module', async () => {
    renderWorkbench();
    openManualMode();
    fireEvent.click(firstByRole('button', 'Star category'));
    fireEvent.click(firstByRole('button', 'Choose star'));
    fireEvent.click(firstByRole('button', 'Planet category'));
    fireEvent.click(firstByRole('button', 'Choose planet'));

    const filesPanel = openMobilePanel(copy.filesTitle as string);
    const slotButtons = within(filesPanel).getAllByRole('button', { name: /Slot/ });
    expect(slotButtons).toHaveLength(5);
    expect(within(filesPanel).queryByRole('button', { name: copy.imageGenerate as string })).toBeNull();
    expect(within(filesPanel).queryByRole('button', { name: copy.print as string })).toBeNull();
    for (const slotButton of slotButtons) fireEvent.click(slotButton);

    const storedText = window.localStorage.getItem(SOLAR_SYSTEM_SAVE_STORAGE_KEY);
    expect(storedText).not.toBeNull();
    expect(JSON.parse(storedText as string)).toHaveLength(5);

    fireEvent.click(slotButtons[0]);
    expect(screen.getByRole('status').textContent).toContain('Loaded.');
  });

  it('updates independent manual descriptions and keeps the star on clear all', () => {
    renderWorkbench();
    openManualMode();
    fireEvent.click(firstByRole('button', 'Star category'));
    fireEvent.click(firstByRole('button', 'Choose star'));
    fireEvent.click(firstByRole('button', 'Planet category'));
    fireEvent.click(firstByRole('button', 'Choose planet'));
    fireEvent.click(firstByRole('button', 'planet-1'));
    fireEvent.change(screen.getByRole('textbox', { name: 'Description' }), { target: { value: 'A blue world' } });
    expect((screen.getByRole('textbox', { name: 'Description' }) as HTMLTextAreaElement).value).toBe('A blue world');

    fireEvent.click(screen.getByRole('button', { name: copy.clearAll as string }));
    expect(firstByTestId('canvas-planets').textContent).toBe('0');
    fireEvent.click(screen.getByRole('tab', { name: copy.randomMode as string }));
    expect(firstByTestId('canvas-planets').textContent).not.toBe('0');
  });

  it('replaces image object URLs, invokes print, and reports export errors', async () => {
    renderWorkbench();
    openManualMode();
    fireEvent.click(firstByRole('button', 'Choose planet'));
    fireEvent.click(firstByRole('button', 'planet-1'));
    expect(firstByRole('button', 'planet-1').getAttribute('data-selected')).toBe('true');
    const exportPanel = within(openMobilePanel(copy.exportTitle as string)).getByTestId('export-panel');
    expect(exportPanel.getAttribute('data-mode')).toBe('manual');
    const generateButton = within(exportPanel).getByRole('button', { name: copy.imageGenerate as string });
    fireEvent.click(generateButton);
    await waitFor(() => expect(screen.getByRole('img', { name: copy.imageTitle as string })).toBeTruthy());
    expect(firstByRole('button', 'planet-1').getAttribute('data-selected')).toBe('false');
    const imageDialog = screen.getAllByRole('dialog').find((dialog) => within(dialog).queryByRole('img') !== null);
    if (!(imageDialog instanceof HTMLElement)) throw new Error('Missing image preview dialog.');
    fireEvent.click(within(imageDialog).getByRole('button', { name: copy.close as string }));
    fireEvent.click(generateButton);
    await waitFor(() => expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:solar-1'));

    fireEvent.click(within(exportPanel).getByRole('button', { name: copy.print as string }));
    expect(window.print).toHaveBeenCalledTimes(1);

    buildSolarSystemPng.mockRejectedValueOnce(new Error('PNG unavailable'));
    fireEvent.click(generateButton);
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('PNG unavailable'));
  });

  it('uses one labelled tabpanel target and closes it with Escape while restoring tab focus', () => {
    renderWorkbench();
    const detailsTab = screen.getByRole('tab', { name: copy.detailsTitle as string });
    fireEvent.click(detailsTab);
    const mobilePanel = document.getElementById('solar-system-mobile-panel');
    if (!(mobilePanel instanceof HTMLElement)) throw new Error('Missing mobile tabpanel.');
    expect(mobilePanel.getAttribute('role')).toBe('tabpanel');
    expect(mobilePanel.getAttribute('aria-labelledby')).toBe(detailsTab.id);
    expect(mobilePanel.getAttribute('aria-modal')).toBeNull();
    expect(screen.queryByRole('dialog')).toBeNull();
    const mobileTabs = Array.from(document.querySelectorAll<HTMLElement>('[id^="solar-system-mobile-tab-"]'));
    for (const tab of mobileTabs) {
      expect(tab.getAttribute('aria-controls')).toBe('solar-system-mobile-panel');
    }
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mobilePanel.hasAttribute('hidden')).toBe(true);
    expect(mobilePanel.getAttribute('aria-labelledby')).toBeNull();
    expect(document.activeElement).toBe(detailsTab);
  });

  it('keeps focus on the keyboard-selected mobile tab and returns Escape focus there', () => {
    renderWorkbench();
    const settingsTab = screen.getByRole('tab', { name: copy.settingsTitle as string });
    const detailsTab = screen.getByRole('tab', { name: copy.detailsTitle as string });

    fireEvent.keyDown(settingsTab, { key: 'ArrowRight' });
    expect(detailsTab.getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(detailsTab);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.activeElement).toBe(detailsTab);
  });

  it('shows storage errors inside the open files dialog', async () => {
    renderWorkbench();
    openManualMode();
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage quota exceeded');
    });

    const filesButtons = screen.getAllByRole('button', { name: copy.filesTitle as string });
    fireEvent.click(filesButtons[0]);
    const fileDialog = screen.getByRole('dialog');
    fireEvent.click(within(fileDialog).getByRole('button', { name: /Slot 1/ }));

    await waitFor(() => {
      expect(within(fileDialog).getByRole('alert').textContent).toContain('Storage quota exceeded');
    });
    expect(setItemSpy).toHaveBeenCalled();
  });

  it('keeps random settings inline and closes the mobile sheet when switching to manual mode', () => {
    renderWorkbench();
    const mobileWorkspace = document.querySelector('[data-mobile-panel]');
    if (!(mobileWorkspace instanceof HTMLElement)) throw new Error('Missing mobile workspace.');
    expect(mobileWorkspace.getAttribute('data-mobile-panel')).toBe('settings');

    fireEvent.click(screen.getByRole('tab', { name: copy.detailsTitle as string }));
    expect(mobileWorkspace.getAttribute('data-mobile-panel')).toBe('details');

    openManualMode();
    expect(mobileWorkspace.getAttribute('data-mobile-panel')).toBe('');
    const mobilePanel = document.getElementById('solar-system-mobile-panel');
    if (!(mobilePanel instanceof HTMLElement)) throw new Error('Missing mobile tabpanel.');
    expect(mobilePanel.hasAttribute('hidden')).toBe(true);
  });

  it('opens the mobile details panel after random and manual selection on narrow screens', async () => {
    const originalMatchMediaDescriptor = Object.getOwnPropertyDescriptor(window, 'matchMedia');
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn(() => ({ matches: true })),
    });

    try {
      renderWorkbench();
      await waitFor(() => expect(firstByTestId('canvas-planets').textContent).not.toBe('0'));
      const mobilePanel = document.getElementById('solar-system-mobile-panel');
      if (!(mobilePanel instanceof HTMLElement)) throw new Error('Missing mobile tabpanel.');
      const detailsTab = screen.getByRole('tab', { name: copy.detailsTitle as string });

      fireEvent.click(firstByRole('button', 'planet-1'));
      expect(mobilePanel.hasAttribute('hidden')).toBe(false);
      expect(detailsTab.getAttribute('aria-selected')).toBe('true');
      fireEvent.click(within(mobilePanel).getByRole('button', { name: copy.close as string }));
      expect(mobilePanel.hasAttribute('hidden')).toBe(true);

      openManualMode();
      fireEvent.click(firstByRole('button', 'Choose planet'));
      fireEvent.click(firstByRole('button', 'planet-1'));
      expect(mobilePanel.hasAttribute('hidden')).toBe(false);
      expect(detailsTab.getAttribute('aria-selected')).toBe('true');
      fireEvent.click(within(mobilePanel).getByRole('button', { name: copy.close as string }));
      expect(mobilePanel.hasAttribute('hidden')).toBe(true);

      fireEvent.click(firstByRole('button', 'planet-1'));
      expect(mobilePanel.hasAttribute('hidden')).toBe(true);
    } finally {
      if (originalMatchMediaDescriptor === undefined) {
        Reflect.deleteProperty(window, 'matchMedia');
      } else {
        Object.defineProperty(window, 'matchMedia', originalMatchMediaDescriptor);
      }
    }
  });

  it('does not create an object URL after image generation finishes post-unmount', async () => {
    let resolvePng: ((blob: Blob) => void) | undefined;
    buildSolarSystemPng.mockReturnValueOnce(new Promise<Blob>((resolve) => {
      resolvePng = resolve;
    }));

    const renderedWorkbench = renderWorkbench();
    openManualMode();
    const exportPanel = within(openMobilePanel(copy.exportTitle as string)).getByTestId('export-panel');
    fireEvent.click(within(exportPanel).getByRole('button', { name: copy.imageGenerate as string }));
    expect(buildSolarSystemPng).toHaveBeenCalledTimes(1);
    renderedWorkbench.unmount();
    resolvePng?.(new Blob(['png'], { type: 'image/png' }));
    await Promise.resolve();
    await Promise.resolve();

    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });
});
