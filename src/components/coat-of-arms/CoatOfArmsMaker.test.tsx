// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { EDITOR_PREFERENCES_STORAGE_KEY, loadEditorPreferences, updateEditorPreferences } from '@/lib/coat-of-arms/editor-preferences';
import { COAT_PROJECT_DRAFT_STORAGE_KEY, COAT_PROJECT_STORAGE_KEY, MAX_COAT_PROJECT_DOCUMENT_BYTES, listProjectRecords, saveProjectRecord } from '@/lib/coat-of-arms/project-storage';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import * as exportModule from '@/lib/coat-of-arms/export';
import { CoatOfArmsMaker } from './CoatOfArmsMaker';

vi.mock('@/lib/coat-of-arms/export', () => ({
  COAT_EXPORT_SIZES: [256, 512, 1024, 2048],
  exportCoatPng: vi.fn(async () => new Blob(['png'], { type: 'image/png' })),
  exportCoatJpeg: vi.fn(async () => new Blob(['jpg'], { type: 'image/jpeg' })),
  exportCoatPdf: vi.fn(async () => new Blob(['pdf'], { type: 'application/pdf' })),
  exportCoatBatch: vi.fn(async () => new Blob(['zip'], { type: 'application/zip' })),
  printCoatScene: vi.fn(),
}));

function renderWorkbench(locale: 'en' | 'zh' = 'en', project = createDefaultProject(locale)) {
  useCoatProjectStore.getState().replaceProject(project);
  return render(<CoatOfArmsMaker locale={locale} />);
}

function getDesktopToolRail() {
  const desktopPanel = document.querySelector<HTMLElement>('.coat-target-left-panel');
  if (!desktopPanel) throw new Error('Desktop tool rail is unavailable');
  const rail = desktopPanel.querySelector<HTMLElement>(':scope > .coat-target-reference-rail');
  if (!rail) throw new Error('Desktop reference tool rail is unavailable');
  return within(rail).getByRole('tablist');
}

function getDesktopPanel(label: string) {
  const desktopPanel = document.querySelector<HTMLElement>('.coat-target-left-panel');
  if (!desktopPanel) throw new Error('Desktop tool panel is unavailable');
  return within(desktopPanel).getByRole('tabpanel', { name: label });
}

function getDesktopTool(label: string | RegExp) {
  return within(getDesktopToolRail()).getByRole('tab', { name: label });
}

function getDesktopToolTreeItem(label: string) {
  return within(getDesktopToolRail()).getByRole('button', { name: label });
}

function getMobileDrawer() {
  const mobileDrawer = document.querySelector<HTMLElement>('.coat-workbench-mobile-drawer');
  if (!mobileDrawer) throw new Error('Mobile tool drawer is unavailable');
  return mobileDrawer;
}

function getMobileToolRail() {
  const mobileDrawer = getMobileDrawer();
  const rail = mobileDrawer.querySelector<HTMLElement>(':scope > .coat-target-reference-rail');
  if (!rail) throw new Error('Mobile reference tool rail is unavailable');
  return within(rail).getByRole('tablist');
}

function toggleMobileToolPanel(label = 'Expand tool panel') {
  const mobileDrawer = getMobileDrawer();
  const toggle = within(mobileDrawer).getByRole('button', { name: label });
  fireEvent.click(toggle);
  return toggle;
}

function selectDesktopTool(label: string) {
  fireEvent.click(getDesktopTool(label));
}

function selectEditorUtility(label: string) {
  selectDesktopTool('Tools');
  fireEvent.click(screen.getByRole('tab', { name: label }));
}

function selectLayers() {
  selectEditorUtility('Layers');
}

interface JsdomVirtualConsole {
  on(eventName: 'jsdomError', listener: (error: Error) => void): void;
  off(eventName: 'jsdomError', listener: (error: Error) => void): void;
}

function monitorJsdomErrors() {
  const virtualConsole = (window as unknown as { _virtualConsole?: JsdomVirtualConsole })._virtualConsole;
  if (!virtualConsole) throw new Error('JSDOM virtual console is unavailable for export test monitoring');
  const errors: Error[] = [];
  const collectError = (error: Error) => errors.push(error);
  virtualConsole.on('jsdomError', collectError);
  return {
    errors,
    stop: () => virtualConsole.off('jsdomError', collectError),
  };
}

describe('CoatOfArmsMaker', () => {
  beforeEach(() => {
    let nextId = 0;
    localStorage.clear();
    vi.stubGlobal('crypto', { randomUUID: () => `workbench-id-${nextId++}` });
    useCoatProjectStore.setState(useCoatProjectStore.getInitialState(), true);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('keeps every core tool category reachable from the desktop workbench', () => {
    renderWorkbench();

    expect(getDesktopTool(/position/i)).toBeDefined();
    expect(getDesktopTool(/shields/i)).toBeDefined();
    expect(getDesktopTool(/custom/i)).toBeDefined();
    expect(getDesktopTool(/charges/i)).toBeDefined();
    expect(getDesktopTool(/top/i)).toBeDefined();
    expect(getDesktopTool(/colors/i)).toBeDefined();
    expect(getDesktopTool(/tools/i)).toBeDefined();
    expect(getDesktopTool(/tokens/i)).toBeDefined();
    selectEditorUtility('Text');
    expect(screen.getByRole('tab', { name: 'Upload' })).toBeDefined();
    expect(screen.getByRole('tab', { name: 'Layers' })).toBeDefined();
    expect(screen.getByRole('button', { name: /export/i })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Open local project library' })).toBeDefined();
  });

  it('connects editor utility tabs to their active panel and roves focus with horizontal arrows', () => {
    renderWorkbench();
    selectDesktopTool('Tools');

    const toolsPanel = getDesktopPanel('Tools');
    const utilityTabList = within(toolsPanel).getByRole('tablist');
    const textTab = within(utilityTabList).getByRole('tab', { name: 'Text' });
    const textPanelId = textTab.getAttribute('aria-controls');
    expect(textPanelId).toMatch(/-utility-panel-text$/);
    expect(document.getElementById(textPanelId ?? '')?.getAttribute('aria-labelledby')).toBe(textTab.id);

    textTab.focus();
    fireEvent.keyDown(textTab, { key: 'ArrowRight' });
    const drawTab = within(utilityTabList).getByRole('tab', { name: 'Draw' });
    expect(document.activeElement).toBe(drawTab);
    expect(drawTab.getAttribute('aria-selected')).toBe('true');
    expect(document.getElementById(drawTab.getAttribute('aria-controls') ?? '')?.hidden).toBe(false);
  });

  it('keeps only export in the reference-style action bar while retaining a local project-library toolbar action', () => {
    renderWorkbench();

    const actionBar = document.querySelector<HTMLElement>('.coat-target-actionbar');
    expect(actionBar).not.toBeNull();
    expect(within(actionBar!).queryByRole('button', { name: 'Projects' })).toBeNull();
    const exportTrigger = within(actionBar!).getByRole('button', { name: 'Export' });
    expect(exportTrigger).toBeDefined();
    expect(exportTrigger.querySelectorAll('svg')).toHaveLength(2);
    expect(actionBar!.previousElementSibling?.classList.contains('coat-target-appbar')).toBe(true);
    expect(screen.getByRole('button', { name: 'Open local project library' })).toBeDefined();
  });

  it('keeps the editor header under the original Token Maker brand', () => {
    renderWorkbench();

    expect(screen.getByLabelText('TOKEN MAKER STUDIO')).toBeDefined();
    expect(screen.queryByLabelText('COAT OF ARMS MAKER')).toBeNull();
    expect(screen.queryByText('User Artwork')).toBeNull();
  });

  it('uses the reference-recorded 71px desktop header geometry', () => {
    const workbenchStyles = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8');

    expect(workbenchStyles).toContain('grid-template-rows: 4.4375rem auto minmax(0, 1fr);');
    expect(workbenchStyles).toContain('min-height: 4.4375rem;');
  });

  it('uses the Retina-normalized 170px desktop tool-tree width from the reference capture', () => {
    const workbenchStyles = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8');

    expect(workbenchStyles).toContain('flex: 0 0 10.625rem; width: 10.625rem; min-width: 10.625rem; max-width: 10.625rem;');
  });

  it('uses the reference-recorded 40px canvas toolbar height', () => {
    const workbenchStyles = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8');

    expect(workbenchStyles).toContain('grid-template-rows: 2.5rem minmax(0, 1fr);');
  });

  it('uses the reference selected-child treatment without keeping an expanded parent highlighted', () => {
    const workbenchStyles = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8');

    expect(workbenchStyles).toContain(".coat-target-workbench .coat-target-tool-tree-node > button[aria-selected='true'][aria-expanded='true'] { background: transparent; }");
  });

  it('retains the reference accent treatment for Flags and Tokens in the desktop tree', () => {
    const workbenchStyles = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8');

    expect(workbenchStyles).toContain(".coat-target-workbench .coat-target-tool-tree-node[data-tool-id='flags'] .coat-tool-glyph,");
    expect(workbenchStyles).toContain(".coat-target-workbench .coat-target-tool-tree-node[data-tool-id='tokens'] .coat-tool-glyph { color: #d93636; }");
  });

  it('renders every reference tool label from Chinese workbench copy', () => {
    render(<CoatOfArmsMaker locale="zh" />);

    const toolRail = getDesktopToolRail();
    expect(within(toolRail).getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      '定位', '盾牌', '自定义', '图形', '顶部', '颜色', '工具', '使用说明', '设置', '旗帜', '符记',
    ]);
    expect(screen.queryByRole('button', { name: 'Collapse tools' })).toBeNull();
  });

  it('connects every desktop reference tab to its active panel without a right inspector dock', () => {
    renderWorkbench();

    const toolRail = getDesktopToolRail();
    const tabs = within(toolRail).getAllByRole('tab');
    expect(tabs.map((tab) => tab.id)).toEqual([
      'coat-tab-position', 'coat-tab-shields', 'coat-tab-custom', 'coat-tab-charges', 'coat-tab-top',
      'coat-tab-colors', 'coat-tab-tools', 'coat-tab-how-to', 'coat-tab-settings', 'coat-tab-flags', 'coat-tab-tokens',
    ]);
    for (const tab of tabs) {
      const panelId = tab.id.replace('-tab-', '-panel-');
      expect(tab.getAttribute('aria-controls')).toBe(panelId);
      expect(document.getElementById(panelId)).toBeTruthy();
    }
    expect(screen.getByRole('tabpanel', { name: 'Shields' }).id).toBe('coat-panel-shields');
    expect(screen.queryByLabelText('Project and layers inspector')).toBeNull();
  });

  it('uses an expandable left tool tree with Shields open by default', () => {
    renderWorkbench();

    expect(getDesktopTool('Shields').getAttribute('aria-expanded')).toBe('true');
    for (const label of ['Position', 'Charges', 'Top', 'Colors', 'Tools']) {
      expect(getDesktopTool(label).getAttribute('aria-expanded')).toBe('false');
    }
    expect(getDesktopToolTreeItem('French shield')).toBeDefined();

    fireEvent.click(getDesktopTool('Charges'));
    expect(getDesktopTool('Charges').getAttribute('aria-expanded')).toBe('true');
  });

  it('keeps the selected desktop tree choice visibly highlighted', () => {
    const workbenchStyles = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8');

    expect(workbenchStyles).toContain(".coat-target-workbench .coat-target-tool-tree-branch button[aria-pressed='true'] { margin-right: 0.4rem; border-radius: 0.2rem; background: #666; }");
  });

  it('uses the Top tree branch as the sole top-ornament category control', () => {
    renderWorkbench();

    fireEvent.click(getDesktopTool('Top'));
    fireEvent.click(getDesktopToolTreeItem('Mantles'));

    expect(screen.queryByLabelText('Top category')).toBeNull();
    expect(screen.queryByRole('group', { name: 'Top ornament categories' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Add top ornament: Regal mantle' })).toBeDefined();
  });

  it('uses the Charges tree branch as the sole charge category control', () => {
    renderWorkbench();

    fireEvent.click(getDesktopTool('Charges'));
    fireEvent.click(getDesktopToolTreeItem('Objects'));

    expect(screen.queryByLabelText('Library category')).toBeNull();
    expect(screen.queryByLabelText('Charge category')).toBeNull();
    expect(screen.queryByRole('group', { name: 'Charge categories' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Add charge: Watchtower' })).toBeDefined();
  });

  it('keeps material categories in the target left library and exposes layers without a right inspector dock', () => {
    renderWorkbench();

    const desktopTools = screen.getByRole('complementary', { name: 'Desktop coat tools' });
    expect(within(desktopTools).getByRole('tab', { name: 'Shields' })).toBeDefined();
    expect(screen.queryByRole('complementary', { name: 'Project and layer dock' })).toBeNull();
    expect(screen.getByRole('tabpanel', { name: 'Shields' })).toBeDefined();

    selectDesktopTool('Tokens');

    expect(screen.getByRole('tabpanel', { name: 'Tokens' })).toBeDefined();
    expect(screen.getByRole('button', { name: /add compass rose token/i })).toBeDefined();
    selectLayers();
    expect(screen.getByRole('button', { name: /duplicate selected layers/i })).toBeDefined();
  });

  it('renders the canvas-toolbar library action with the reference static control frame', () => {
    renderWorkbench();
    const projectLibraryTrigger = screen.getByRole('button', { name: 'Open local project library' });
    const workbenchStyles = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8');

    expect(projectLibraryTrigger.classList.contains('coat-target-link-control')).toBe(true);
    expect(workbenchStyles).toContain('.coat-target-workbench .coat-target-canvas-toolbar .coat-target-link-control { border-color: #777; background: #3a3a3a; }');
  });

  it('gives the desktop How-to tabpanel a keyboard focus stop', () => {
    renderWorkbench();

    selectDesktopTool('How-to');
    const howToPanel = screen.getByRole('tabpanel', { name: 'How-to' });
    expect(howToPanel.getAttribute('tabindex')).toBe('0');
    howToPanel.focus();
    expect(document.activeElement).toBe(howToPanel);
  });

  it('adds a local token from the independent Tokens library', () => {
    renderWorkbench();

    selectDesktopTool('Tokens');
    fireEvent.click(screen.getByRole('button', { name: 'Add Compass rose token' }));

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      type: 'charge', assetId: 'compass-rose',
    });
  });

  it('refreshes saved projects when the canvas toolbar opens the local project library', () => {
    const savedProject = { ...createDefaultProject('en'), id: 'saved-from-toolbar', name: 'Saved from toolbar' };
    saveProjectRecord({ id: savedProject.id, name: savedProject.name, project: savedProject });
    renderWorkbench();

    fireEvent.click(screen.getByRole('button', { name: 'Open local project library' }));

    expect(screen.getByRole('dialog', { name: 'Local projects' })).toBeDefined();
    expect(screen.getByRole('option', { name: 'Saved from toolbar' })).toBeDefined();
  });

  it('browses a selected shield tree category without mutating the canvas', () => {
    renderWorkbench();
    const initialShield = useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield');

    fireEvent.click(getDesktopToolTreeItem('French shield'));

    expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield'))
      .toEqual(initialShield);
    expect(getDesktopToolTreeItem('French shield').getAttribute('aria-pressed')).toBe('true');
    expect(within(getDesktopPanel('Shields')).getByRole('button', { name: 'Select shield: Bourbon French shield' })).toBeDefined();
  });

  it('makes each shield tree category browseable without changing its layer', () => {
    renderWorkbench();
    const initialShield = useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield');

    for (const [treeLabel, galleryLabel] of [
      ['Kite shield', 'Norman kite shield'],
      ['Heater shield', 'Barrel heater shield'],
      ['French shield', 'Bourbon French shield'],
      ['Banner shield', 'Pennon banner shield'],
      ['Round shield', 'Medallion round shield'],
      ['Lozenge shield', 'Diamond lozenge shield'],
    ] as const) {
      fireEvent.click(getDesktopToolTreeItem(treeLabel));
      expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield')).toEqual(initialShield);
      expect(within(getDesktopPanel('Shields')).getByRole('button', { name: `Select shield: ${galleryLabel}` })).toBeDefined();
    }
  });

  it('localizes every shield outline tree item from local asset names in Chinese', () => {
    renderWorkbench('zh');

    for (const shieldName of ['鸢盾', '熨斗盾', '法式盾', '旗帜盾', '圆盾', '菱形盾']) {
      expect(getDesktopToolTreeItem(shieldName)).toBeTruthy();
    }
  });

  it('keeps a locked shield untouched while browsing a target left-tree category', () => {
    const project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield) throw new Error('Expected a default shield layer');
    const lockedProject = {
      ...project,
      layers: project.layers.map((layer) => layer.id === shield.id ? { ...layer, locked: true } : layer),
    };
    renderWorkbench('en', lockedProject);

    fireEvent.click(getDesktopToolTreeItem('French shield'));

    expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield'))
      .toMatchObject({ assetId: 'heater-shield', locked: true });
    expect(screen.queryByRole('alert')).toBeNull();
    expect(within(getDesktopPanel('Shields')).getByRole('button', { name: 'Select shield: Bourbon French shield' })).toBeDefined();
  });

  it('keeps Custom focused on local shield settings rather than the shield gallery', () => {
    renderWorkbench();

    fireEvent.click(getDesktopTool('Custom'));

    const customPanel = getDesktopPanel('Custom');
    expect(within(customPanel).getByRole('region', { name: 'Shield & field' })).toBeDefined();
    expect(within(customPanel).getByLabelText('Custom shield mask')).toBeDefined();
    expect(screen.queryByRole('region', { name: 'Shield library' })).toBeNull();
  });

  it('keeps shield browsing to card selection and puts custom shield controls only under Custom', () => {
    renderWorkbench();

    const shieldPanel = getDesktopPanel('Shields');
    expect(within(shieldPanel).getByRole('button', { name: 'Select shield: Barrel heater shield' })).toBeDefined();
    expect(within(shieldPanel).queryByRole('button', { name: 'Custom shield settings' })).toBeNull();
    expect(within(shieldPanel).queryByLabelText('Custom shield mask')).toBeNull();
  });

  it('unblocks the editor after its server markup hydrates in the browser', async () => {
    const container = document.createElement('div');
    container.innerHTML = renderToString(<CoatOfArmsMaker locale="en" />);
    document.body.append(container);
    let hydratedRoot: ReturnType<typeof hydrateRoot> | null = null;

    try {
      hydratedRoot = await act(async () => {
        const root = hydrateRoot(container, <CoatOfArmsMaker locale="en" />);
        await Promise.resolve();
        return root;
      });

      expect(container.querySelector('.coat-workbench-content')?.hasAttribute('inert')).toBe(false);
    } finally {
      if (hydratedRoot !== null) {
        await act(async () => {
          hydratedRoot?.unmount();
        });
      }
      container.remove();
    }
  });

  it('shares layer selection with the Position panel and applies an exact X value', () => {
    renderWorkbench();
    const shield = useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield');
    if (!shield) throw new Error('Expected default shield layer');

    selectLayers();
    fireEvent.click(screen.getAllByLabelText(new RegExp(`Select layer ${shield.id}`))[0]!);
    selectDesktopTool('Position');

    const positionPanel = getDesktopPanel('Position');
    const xInput = within(positionPanel).getByLabelText('Position X') as HTMLInputElement;
    expect(xInput.value).toBe('0');
    expect(within(positionPanel).getByLabelText('Keep aspect ratio')).toBeDefined();
    expect(within(positionPanel).getByRole('button', { name: 'Flip horizontal' })).toBeDefined();
    expect(within(positionPanel).getByLabelText('Crop left')).toBeDefined();
    expect(within(positionPanel).getByRole('button', { name: 'Group selected layers' })).toBeDefined();
    fireEvent.change(xInput, { target: { value: '18' } });
    fireEvent.change(within(positionPanel).getByLabelText('Position opacity'), { target: { value: '0.4' } });
    expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.id === shield.id))
      .toMatchObject({ transform: { x: 18, opacity: 0.4 } });
  });

  it('edits each quarterly field region without changing the other regions', () => {
    renderWorkbench();

    selectDesktopTool('Custom');
    fireEvent.change(screen.getByLabelText('Field division'), { target: { value: 'quarterly' } });
    fireEvent.change(screen.getByLabelText('Quarter 1 primary colour'), { target: { value: '#112233' } });
    fireEvent.change(screen.getByLabelText('Quarter 2 field variation'), { target: { value: 'stripes' } });

    const shield = useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected default shield layer');
    expect(shield.field.regions).toMatchObject({
      q1: { colors: ['#112233'], pattern: 'solid', patternScale: 1 },
      q2: { colors: ['#1855A5', '#1855A5'], pattern: 'stripes', patternScale: 1 },
      q3: { colors: ['#1855A5'], pattern: 'solid', patternScale: 1 },
      q4: { colors: ['#1855A5'], pattern: 'solid', patternScale: 1 },
    });
  });

  it('flips and non-destructively crops the selected layer from the Position panel', () => {
    renderWorkbench();
    const shield = useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield');
    if (!shield) throw new Error('Expected default shield layer');

    selectLayers();
    fireEvent.click(screen.getAllByLabelText(new RegExp(`Select layer ${shield.id}`))[0]!);
    selectDesktopTool('Position');
    const positionPanel = getDesktopPanel('Position');
    fireEvent.click(within(positionPanel).getByRole('button', { name: 'Flip horizontal' }));
    fireEvent.change(within(positionPanel).getByLabelText('Crop left'), { target: { value: '12' } });
    fireEvent.change(within(positionPanel).getByLabelText('Crop width'), { target: { value: '70' } });

    expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.id === shield.id))
      .toMatchObject({ transform: { flipHorizontal: true, crop: { x: 12, y: 0, width: 70, height: 110 } } });

    fireEvent.click(within(positionPanel).getByRole('button', { name: 'Reset crop' }));
    const shieldAfterCropReset = useCoatProjectStore.getState().project.layers.find((layer) => layer.id === shield.id);
    if (!shieldAfterCropReset || shieldAfterCropReset.type !== 'shield') throw new Error('Expected shield layer after crop reset');
    expect(shieldAfterCropReset.transform.crop).toBeUndefined();
  });

  it('edits a selected text layer and preserves its chosen browser-safe font family', () => {
    renderWorkbench();
    selectEditorUtility('Text');
    fireEvent.click(within(getDesktopPanel('Tools')).getByRole('button', { name: 'Add motto' }));
    const textLayer = useCoatProjectStore.getState().project.layers.at(-1);
    if (!textLayer || textLayer.type !== 'text') throw new Error('Expected a text layer');

    selectLayers();
    fireEvent.click(screen.getAllByLabelText(new RegExp(`Select layer ${textLayer.id}`))[0]!);
    selectEditorUtility('Text');
    const textPanel = getDesktopPanel('Tools');
    fireEvent.change(within(textPanel).getByLabelText('Motto text'), { target: { value: 'HONOUR' } });
    fireEvent.change(within(textPanel).getByLabelText('Font family'), { target: { value: 'cursive' } });
    fireEvent.click(within(textPanel).getByRole('button', { name: 'Update selected text' }));

    expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.id === textLayer.id))
      .toMatchObject({ text: 'HONOUR', fontFamily: 'cursive' });
  });

  it('offers free top ornaments in the shared thumbnail gallery and adds a crown to the local project', () => {
    renderWorkbench();

    selectDesktopTool('Top');
    fireEvent.click(screen.getByRole('button', { name: 'Add top ornament: Royal crown' }));

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({ type: 'top', assetId: 'royal-crown' });
  });

  it('generates an original local identity and can apply its project name', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    renderWorkbench();

    selectEditorUtility('Names');
    fireEvent.click(screen.getByRole('button', { name: 'Generate identity' }));
    fireEvent.click(screen.getByRole('button', { name: 'Use project name' }));

    expect(useCoatProjectStore.getState().project.name).toBe('House Alder');
  });

  it('contains no account or paid-tier action', () => {
    renderWorkbench();

    expect(screen.queryByText(/\bpro\b|upgrade|login|subscription/i)).toBeNull();
    expect([...document.querySelectorAll('a[href^="http"]')]).toHaveLength(0);
  });

  it('keeps the project and export actions explicitly local', () => {
    renderWorkbench();

    fireEvent.click(screen.getByRole('button', { name: 'Open local project library' }));
    expect(screen.getByRole('button', { name: /save project locally/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /export project json/i })).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    fireEvent.click(screen.getByRole('button', { name: /export/i }));
    expect(screen.getByRole('button', { name: /export png/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /export jpg/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /export pdf/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /print locally/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /export batch zip/i })).toBeDefined();
  });

  it('keeps browser-local save-as, rename, load, delete, and invalid JSON import lossless', async () => {
    const originalProject = { ...createDefaultProject('en'), id: 'original-project', name: 'Original project' };
    renderWorkbench('en', originalProject);

    fireEvent.click(screen.getByRole('button', { name: 'Open local project library' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save project locally' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save as local copy' }));
    const copiedProjectId = useCoatProjectStore.getState().project.id;
    fireEvent.change(screen.getByLabelText('Project name'), { target: { value: 'Renamed local copy' } });
    fireEvent.click(screen.getByRole('button', { name: 'Rename saved project' }));

    expect(listProjectRecords().map((record) => ({ id: record.id, name: record.name }))).toEqual([
      { id: originalProject.id, name: 'Original project' },
      { id: copiedProjectId, name: 'Renamed local copy' },
    ]);

    fireEvent.change(screen.getByLabelText('Saved projects'), { target: { value: originalProject.id } });
    fireEvent.click(screen.getByRole('button', { name: 'Load saved project' }));
    expect(useCoatProjectStore.getState().project).toMatchObject({ id: originalProject.id, name: 'Original project' });

    const invalidDocument = new File(['{'], 'invalid-project.json', { type: 'application/json' });
    Object.defineProperty(invalidDocument, 'text', { value: async () => '{' });
    fireEvent.change(screen.getByLabelText('Import project JSON file'), { target: { files: [invalidDocument] } });

    expect((await screen.findByRole('alert')).textContent).toContain('Invalid serialized coat project JSON');
    expect(useCoatProjectStore.getState().project).toMatchObject({ id: originalProject.id, name: 'Original project' });
    expect(listProjectRecords()).toHaveLength(2);

    fireEvent.click(screen.getByRole('button', { name: 'Delete saved project' }));
    expect(listProjectRecords().map((record) => record.id)).toEqual([copiedProjectId]);
  });

  it('keeps the local project library open and actionable when stored project records are corrupt', async () => {
    localStorage.setItem(COAT_PROJECT_STORAGE_KEY, '{');
    renderWorkbench();

    fireEvent.click(screen.getByRole('button', { name: 'Open local project library' }));

    const dialog = screen.getByRole('dialog', { name: 'Local projects' });
    expect((await within(dialog).findByRole('alert')).textContent).toContain('Project operation failed');
    expect(within(dialog).getByRole('button', { name: 'New project' })).toBeDefined();
  });

  it('restores and persists the browser-local JPEG export quality', async () => {
    localStorage.setItem(EDITOR_PREFERENCES_STORAGE_KEY, JSON.stringify({
      version: 1,
      canvasPreset: 'square',
      jpegQuality: 'ultra',
      customPalette: [],
      backgroundGradient: null,
    }));
    renderWorkbench();

    fireEvent.click(screen.getByRole('button', { name: 'Export' }));
    const jpegQuality = screen.getByLabelText('JPG quality') as HTMLSelectElement;
    await waitFor(() => expect(jpegQuality.value).toBe('ultra'));

    fireEvent.change(jpegQuality, { target: { value: 'medium' } });

    expect(loadEditorPreferences().jpegQuality).toBe('medium');
  });

  it('reports the JPG-specific success message after a local JPG export', async () => {
    renderWorkbench();
    fireEvent.click(screen.getByRole('button', { name: 'Export' }));
    const exportMenu = screen.getByRole('region', { name: 'Local export options' });

    fireEvent.click(screen.getByRole('button', { name: 'Export JPG' }));

    expect((await within(exportMenu).findByText('JPG exported locally.')).textContent).toBe('JPG exported locally.');
  });

  it('uses the latest atomic local size and quality preferences for every export format', async () => {
    vi.clearAllMocks();
    const jsdomErrorMonitor = monitorJsdomErrors();
    const project = createDefaultProject('en');
    const clipboardWrite = vi.fn(async () => undefined);
    const share = vi.fn(async () => undefined);
    const downloadClicks = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    class TestClipboardItem {
      constructor(readonly payload: Record<string, Blob>) {}
    }
    class TestFile extends Blob {
      readonly name: string;

      constructor(parts: BlobPart[], name: string, options?: FilePropertyBag) {
        super(parts, options);
        this.name = name;
      }
    }
    vi.stubGlobal('ClipboardItem', TestClipboardItem);
    vi.stubGlobal('File', TestFile);
    vi.stubGlobal('navigator', { clipboard: { write: clipboardWrite }, canShare: () => true, share });
    renderWorkbench('en', project);

    fireEvent.click(screen.getByRole('button', { name: 'Export' }));
    fireEvent.change(screen.getByLabelText('Export size'), { target: { value: '512' } });
    fireEvent.change(screen.getByLabelText('JPG quality'), { target: { value: 'low' } });

    expect(JSON.parse(localStorage.getItem(EDITOR_PREFERENCES_STORAGE_KEY) ?? '')).toMatchObject({
      exportSize: 512,
      jpegQuality: 'low',
    });

    updateEditorPreferences((preferences) => ({ ...preferences, exportSize: 2048, jpegQuality: 'ultra' }));
    try {
      fireEvent.click(screen.getByRole('button', { name: 'Export PNG' }));
      fireEvent.click(screen.getByRole('button', { name: 'Export JPG' }));
      fireEvent.click(screen.getByRole('button', { name: 'Copy image' }));
      fireEvent.click(screen.getByRole('button', { name: 'Share image' }));
      fireEvent.click(screen.getByRole('button', { name: 'Export PDF' }));
      fireEvent.click(screen.getByRole('button', { name: 'Print locally' }));
      fireEvent.click(screen.getByRole('button', { name: 'Export batch ZIP' }));

      await waitFor(() => {
        expect(exportModule.exportCoatPng).toHaveBeenCalledWith(project, 2048);
        expect(exportModule.exportCoatJpeg).toHaveBeenCalledWith(project, 2048, 0.96);
        expect(exportModule.exportCoatPdf).toHaveBeenCalledWith(project, 2048);
        expect(exportModule.printCoatScene).toHaveBeenCalledWith(project, 2048);
        expect(exportModule.exportCoatBatch).toHaveBeenCalledWith([project], 2048);
        expect(clipboardWrite).toHaveBeenCalledTimes(1);
        expect(share).toHaveBeenCalledTimes(1);
        expect(downloadClicks).toHaveBeenCalledTimes(4);
      });
      expect(jsdomErrorMonitor.errors).toEqual([]);
    } finally {
      jsdomErrorMonitor.stop();
    }
  });

  it('shows the invalid persisted export size and leaves the active project unchanged', async () => {
    const project = createDefaultProject('en');
    localStorage.setItem(EDITOR_PREFERENCES_STORAGE_KEY, JSON.stringify({
      version: 1,
      canvasPreset: 'square',
      exportSize: 123,
      jpegQuality: 'high',
      customPalette: [],
      backgroundGradient: null,
    }));
    renderWorkbench('en', project);

    fireEvent.click(screen.getByRole('button', { name: 'Export' }));

    expect((await screen.findByRole('alert')).textContent).toContain('123');
    expect(useCoatProjectStore.getState().project).toEqual(project);
  });

  it('copies a PNG export to the browser clipboard', async () => {
    const clipboardWrite = vi.fn(async () => undefined);
    class TestClipboardItem {
      constructor(readonly payload: Record<string, Blob>) {}
    }
    vi.stubGlobal('ClipboardItem', TestClipboardItem);
    vi.stubGlobal('navigator', { clipboard: { write: clipboardWrite } });
    renderWorkbench();

    fireEvent.click(screen.getByRole('button', { name: 'Export' }));
    fireEvent.click(screen.getByRole('button', { name: 'Copy image' }));

    const exportOptions = screen.getByRole('region', { name: 'Local export options' });
    expect((await within(exportOptions).findByText(/image copied to clipboard/i)).textContent).toMatch(/copied/i);
    expect(clipboardWrite).toHaveBeenCalledWith([
      expect.objectContaining({ payload: { 'image/png': expect.any(Blob) } }),
    ]);
  });

  it('shares a PNG export through the native share sheet when the browser supports files', async () => {
    const share = vi.fn(async () => undefined);
    class TestFile extends Blob {
      readonly name: string;

      constructor(parts: BlobPart[], name: string, options?: FilePropertyBag) {
        super(parts, options);
        this.name = name;
      }
    }
    vi.stubGlobal('File', TestFile);
    vi.stubGlobal('navigator', { canShare: () => true, share });
    renderWorkbench();

    fireEvent.click(screen.getByRole('button', { name: 'Export' }));
    fireEvent.click(screen.getByRole('button', { name: 'Share image' }));

    const exportOptions = screen.getByRole('region', { name: 'Local export options' });
    expect((await within(exportOptions).findByText(/native share sheet opened/i)).textContent).toMatch(/share sheet opened/i);
    expect(share).toHaveBeenCalledWith(expect.objectContaining({ files: [expect.any(TestFile)] }));
  });

  it('shows a visible error when local project storage is unavailable', () => {
    renderWorkbench();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage quota exceeded');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Open local project library' }));
    fireEvent.click(screen.getByRole('button', { name: /save project locally/i }));

    expect(screen.getByRole('alert').textContent).toMatch(/storage quota exceeded/i);
    expect(localStorage.getItem(COAT_PROJECT_STORAGE_KEY)).toBeNull();
  });

  it('shows a visible error when PNG export cannot create a blob URL', async () => {
    renderWorkbench();
    vi.stubGlobal('URL', { createObjectURL: () => { throw new Error('Export download is unavailable in this browser'); }, revokeObjectURL: vi.fn() });

    fireEvent.click(screen.getByRole('button', { name: /export/i }));
    fireEvent.click(screen.getByRole('button', { name: /export png/i }));

    expect((await screen.findByRole('alert')).textContent).toMatch(/unavailable in this browser/i);
  });

  it('uses Chinese-only project and export errors without exposing raw English failures', async () => {
    renderWorkbench('zh');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage quota exceeded');
    });

    fireEvent.click(screen.getByRole('button', { name: '打开本地项目库' }));
    fireEvent.click(screen.getByRole('button', { name: '本地保存项目' }));
    expect(screen.getByRole('alert').textContent).toContain('项目操作失败');
    expect(screen.getByRole('alert').textContent).not.toContain('storage quota exceeded');

    fireEvent.click(screen.getByRole('button', { name: '关闭' }));
    vi.stubGlobal('URL', { createObjectURL: () => { throw new Error('Export download is unavailable in this browser'); }, revokeObjectURL: vi.fn() });
    fireEvent.click(screen.getByRole('button', { name: '导出' }));
    fireEvent.click(screen.getByRole('button', { name: '导出 PNG' }));

    const exportError = await screen.findByRole('alert');
    expect(exportError.textContent).toContain('导出失败');
    expect(exportError.textContent).not.toContain('Export download is unavailable in this browser');
    expect(exportError.textContent).not.toContain('browser');
  });

  it.each([
    { locale: 'en' as const, projectLibrary: 'Open local project library', importFile: 'Import project JSON file', expectedError: 'Project JSON file is too large' },
    { locale: 'zh' as const, projectLibrary: '打开本地项目库', importFile: '导入项目 JSON 文件', expectedError: '项目 JSON 文件过大' },
  ])('rejects an oversized $locale project JSON file before reading it', async ({ locale, projectLibrary, importFile, expectedError }) => {
    renderWorkbench(locale);
    const oversizedFile = new File(['{}'], 'oversized.json', { type: 'application/json' });
    const text = vi.fn(async () => '{}');
    Object.defineProperty(oversizedFile, 'size', { value: MAX_COAT_PROJECT_DOCUMENT_BYTES + 1 });
    Object.defineProperty(oversizedFile, 'text', { value: text });

    fireEvent.click(screen.getByRole('button', { name: projectLibrary }));
    fireEvent.change(screen.getByLabelText(importFile), { target: { files: [oversizedFile] } });

    expect((await screen.findByRole('alert')).textContent).toContain(expectedError);
    expect(text).not.toHaveBeenCalled();
  });

  it('keeps focus inside the project modal, closes on Escape, and restores its opener', () => {
    renderWorkbench();
    const projectsTrigger = screen.getByRole('button', { name: 'Open local project library' });
    projectsTrigger.focus();
    fireEvent.click(projectsTrigger);

    const dialog = screen.getByRole('dialog', { name: /local projects/i });
    const closeButton = within(dialog).getByRole('button', { name: 'Close' });
    expect(within(dialog).getByLabelText('Import project JSON file').tabIndex).toBe(-1);
    const dialogButtons = within(dialog).getAllByRole('button');
    const lastButton = dialogButtons.at(-1);
    if (!lastButton) throw new Error('Expected a final dialog button');
    expect(document.activeElement).toBe(closeButton);

    lastButton.focus();
    fireEvent.keyDown(lastButton, { key: 'Tab' });
    expect(document.activeElement).toBe(closeButton);
    fireEvent.keyDown(closeButton, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(lastButton);

    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: /local projects/i })).toBeNull();
    expect(screen.getByRole('main').querySelector('.coat-workbench-content')?.getAttribute('inert')).toBeNull();
    expect(document.activeElement).toBe(projectsTrigger);
  });

  it('restores the project trigger only after Maker removes background inertness', () => {
    renderWorkbench();
    const projectsTrigger = screen.getByRole('button', { name: 'Open local project library' });
    fireEvent.click(projectsTrigger);

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.getByRole('main').querySelector('.coat-workbench-content')?.getAttribute('inert')).toBeNull();
    expect(document.activeElement).toBe(projectsTrigger);
  });

  it('makes the workbench background pointer and keyboard inert while the project modal is open', () => {
    renderWorkbench();
    const undoButton = screen.getByRole('button', { name: 'Undo' });
    useCoatProjectStore.getState().dispatch({ type: 'add-layer', assetId: 'golden-lion' });
    const layerCountBeforeModal = useCoatProjectStore.getState().project.layers.length;

    fireEvent.click(screen.getByRole('button', { name: 'Open local project library' }));
    const workbenchBackground = screen.getByRole('main').querySelector('.coat-workbench-content');
    expect(workbenchBackground?.getAttribute('inert')).not.toBeNull();
    expect(screen.getByTestId('coat-project-modal-backdrop')).toBeDefined();

    fireEvent.click(undoButton);
    fireEvent.keyDown(undoButton, { key: 'z', ctrlKey: true });
    expect(useCoatProjectStore.getState().project.layers).toHaveLength(layerCountBeforeModal);

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(workbenchBackground?.getAttribute('inert')).toBeNull();
    expect(screen.queryByTestId('coat-project-modal-backdrop')).toBeNull();
  });

  it('only enables history actions when a matching history transition exists', () => {
    renderWorkbench();
    const undoButton = screen.getByRole('button', { name: 'Undo' });
    const redoButton = screen.getByRole('button', { name: 'Redo' });

    expect(undoButton.getAttribute('disabled')).not.toBeNull();
    expect(redoButton.getAttribute('disabled')).not.toBeNull();

    act(() => useCoatProjectStore.getState().dispatch({ type: 'add-layer', assetId: 'golden-lion' }));
    expect(undoButton.getAttribute('disabled')).toBeNull();
    expect(redoButton.getAttribute('disabled')).not.toBeNull();

    fireEvent.click(undoButton);
    expect(undoButton.getAttribute('disabled')).not.toBeNull();
    expect(redoButton.getAttribute('disabled')).toBeNull();
  });

  it('keeps the reference-style zoom control limited to a range, percentage, and fullscreen action', () => {
    renderWorkbench();

    expect(screen.queryByRole('button', { name: 'Reset canvas zoom' })).toBeNull();
  });

  it('gives export menu controls a close action, escape dismissal, and trigger focus restoration', () => {
    renderWorkbench();
    const exportTrigger = screen.getByRole('button', { name: 'Export' });
    fireEvent.click(exportTrigger);

    expect(exportTrigger.getAttribute('aria-expanded')).toBe('true');
    const exportMenu = screen.getByRole('region', { name: /local export options/i });
    expect(exportTrigger.getAttribute('aria-controls')).toBe(exportMenu.id);
    expect(document.activeElement).toBe(within(exportMenu).getByRole('button', { name: 'Close export menu' }));

    fireEvent.keyDown(exportMenu, { key: 'Escape' });
    expect(screen.queryByRole('region', { name: /local export options/i })).toBeNull();
    expect(document.activeElement).toBe(exportTrigger);
  });

  it('keeps the full mobile tool rail available before its active panel is expanded', () => {
    renderWorkbench();

    const mobileDrawer = getMobileDrawer();
    const mobileToolRail = getMobileToolRail();
    expect(within(mobileToolRail).getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      'Position', 'Shields', 'Custom', 'Charges', 'Top', 'Colors', 'Tools', 'How-to', 'Settings', 'Flags', 'Tokens',
    ]);
    for (const tab of within(mobileToolRail).getAllByRole('tab')) {
      const panelId = tab.getAttribute('aria-controls');
      expect(panelId).not.toBeNull();
      expect(document.getElementById(panelId ?? '')).toHaveProperty('hidden', true);
    }
    expect(within(mobileDrawer).queryByRole('region', { name: 'Tools' })).toBeNull();
  });

  it('keeps the mobile shield browser card-driven and reserves field controls for Custom', () => {
    renderWorkbench();

    toggleMobileToolPanel();

    expect(screen.getAllByRole('button', { name: 'Select shield: Barrel heater shield' })).toHaveLength(2);
    expect(screen.queryByRole('button', { name: 'Custom shield settings' })).toBeNull();
  });

  it('shows the named kite shield cards in the mobile shield browser', () => {
    renderWorkbench();
    toggleMobileToolPanel();

    const drawer = screen.getByRole('region', { name: 'Tools' });
    fireEvent.click(within(getMobileToolRail()).getByRole('button', { name: 'Kite shield' }));

    expect(within(drawer).getByRole('button', { name: 'Select shield: Norman kite shield' })).toBeDefined();
  });

  it('shows the named Banner shield cards in the mobile shield browser', () => {
    renderWorkbench();
    toggleMobileToolPanel();

    const drawer = screen.getByRole('region', { name: 'Tools' });
    fireEvent.click(within(getMobileToolRail()).getByRole('button', { name: 'Banner shield' }));

    expect(within(drawer).getByRole('button', { name: 'Select shield: Pennon banner shield' })).toBeDefined();
  });

  it('shows the named Round shield cards in the mobile shield browser', () => {
    renderWorkbench();
    toggleMobileToolPanel();

    const drawer = screen.getByRole('region', { name: 'Tools' });
    fireEvent.click(within(getMobileToolRail()).getByRole('button', { name: 'Round shield' }));

    expect(within(drawer).getByRole('button', { name: 'Select shield: Medallion round shield' })).toBeDefined();
  });

  it('shows the named Lozenge shield cards in the mobile shield browser', () => {
    renderWorkbench();
    toggleMobileToolPanel();

    const drawer = screen.getByRole('region', { name: 'Tools' });
    fireEvent.click(within(getMobileToolRail()).getByRole('button', { name: 'Lozenge shield' }));

    expect(within(drawer).getByRole('button', { name: 'Select shield: Diamond lozenge shield' })).toBeDefined();
  });

  it('renders the six reference shield branch glyphs in the desktop tool tree', () => {
    renderWorkbench();

    const glyphs = [...getDesktopToolRail().querySelectorAll('[data-branch-glyph]')].map((glyph) => glyph.getAttribute('data-branch-glyph'));
    expect(glyphs).toEqual(['kite-shield', 'heater-shield', 'french-shield', 'banner-shield', 'round-shield', 'lozenge-shield']);
  });

  it('gives the mobile tool drawer a close action, escape dismissal, and trigger focus restoration', () => {
    renderWorkbench();
    const toolsTrigger = toggleMobileToolPanel();

    const drawer = screen.getByRole('region', { name: 'Tools' });
    expect(toolsTrigger.getAttribute('aria-expanded')).toBe('true');
    expect(toolsTrigger.getAttribute('aria-controls')).toBe(drawer.id);
    expect(document.activeElement).toBe(within(getMobileDrawer()).getByRole('button', { name: 'Close tools' }));
    const mobileToolRail = getMobileToolRail();
    expect(within(mobileToolRail).getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      'Position', 'Shields', 'Custom', 'Charges', 'Top', 'Colors', 'Tools', 'How-to', 'Settings', 'Flags', 'Tokens',
    ]);
    expect(within(mobileToolRail).getAllByRole('tab').map((tab) => tab.id)).toEqual([
      'mobile-coat-tab-position', 'mobile-coat-tab-shields', 'mobile-coat-tab-custom', 'mobile-coat-tab-charges', 'mobile-coat-tab-top',
      'mobile-coat-tab-colors', 'mobile-coat-tab-tools', 'mobile-coat-tab-how-to', 'mobile-coat-tab-settings', 'mobile-coat-tab-flags', 'mobile-coat-tab-tokens',
    ]);
    for (const tab of within(mobileToolRail).getAllByRole('tab')) {
      expect(tab.getAttribute('aria-controls')).toBe(tab.id.replace('-tab-', '-panel-'));
    }
    fireEvent.click(within(mobileToolRail).getByRole('tab', { name: 'Position' }));
    expect(within(within(drawer).getByRole('tabpanel', { name: 'Position' })).getByRole('region', { name: 'Position' })).toBeDefined();
    fireEvent.click(within(mobileToolRail).getByRole('tab', { name: 'Custom' }));
    expect(within(within(drawer).getByRole('tabpanel', { name: 'Custom' })).getByRole('region', { name: 'Shield & field' })).toBeDefined();
    fireEvent.click(within(mobileToolRail).getByRole('tab', { name: 'How-to' }));
    expect(within(drawer).getByRole('tabpanel', { name: 'How-to' }).getAttribute('tabindex')).toBe('0');

    fireEvent.keyDown(drawer, { key: 'Escape' });
    expect(screen.queryByRole('region', { name: 'Tools' })).toBeNull();
    expect(document.activeElement).toBe(toolsTrigger);
  });

  it('reuses the desktop tool tree for mobile shield browsing and charge category selection', () => {
    renderWorkbench();
    toggleMobileToolPanel();

    const drawer = screen.getByRole('region', { name: 'Tools' });
    const mobileToolRail = getMobileToolRail();
    fireEvent.click(within(mobileToolRail).getByRole('button', { name: 'French shield' }));
    expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield')).toMatchObject({ assetId: 'heater-shield' });
    expect(within(drawer).getByRole('button', { name: 'Select shield: Bourbon French shield' })).toBeDefined();

    fireEvent.click(within(mobileToolRail).getByRole('tab', { name: 'Charges' }));
    expect(within(mobileToolRail).queryByRole('button', { name: 'French shield' })).toBeNull();
    fireEvent.click(within(mobileToolRail).getByRole('button', { name: 'Objects' }));
    expect(within(drawer).getByRole('button', { name: 'Add charge: Watchtower' })).toBeDefined();
  });

  it('shows only the active expanded desktop branch in the mobile tool drawer', () => {
    renderWorkbench();

    fireEvent.click(getDesktopTool('Charges'));
    toggleMobileToolPanel();

    const mobileToolRail = getMobileToolRail();
    expect(within(mobileToolRail).getByRole('button', { name: 'Objects' })).toBeDefined();
    expect(within(mobileToolRail).queryByRole('button', { name: 'French shield' })).toBeNull();
  });

  it('focuses the matching colour panel section when a Colors tree child is selected', () => {
    renderWorkbench();

    fireEvent.click(getDesktopTool('Colors'));
    fireEvent.click(getDesktopToolTreeItem('Background colour'));

    expect(document.activeElement).toBe(within(getDesktopPanel('Colors')).getByRole('region', { name: 'Background colour' }));
  });

  it('keeps canvas drawing active when the mobile tools drawer closes', () => {
    renderWorkbench();
    toggleMobileToolPanel();

    const drawer = screen.getByRole('region', { name: 'Tools' });
    const mobileToolRail = getMobileToolRail();
    fireEvent.click(within(mobileToolRail).getByRole('tab', { name: 'Tools' }));
    fireEvent.click(within(mobileToolRail).getByRole('button', { name: 'Draw' }));
    fireEvent.click(within(drawer).getByLabelText('Draw on canvas'));
    expect(useCoatProjectStore.getState().drawingSettings.isActive).toBe(true);

    fireEvent.click(within(getMobileDrawer()).getByRole('button', { name: 'Close tools' }));
    expect(useCoatProjectStore.getState().drawingSettings.isActive).toBe(true);
  });

  it('stops canvas drawing when the active mobile tool changes away from Draw', () => {
    renderWorkbench();
    toggleMobileToolPanel();

    const drawer = screen.getByRole('region', { name: 'Tools' });
    const mobileToolRail = getMobileToolRail();
    fireEvent.click(within(mobileToolRail).getByRole('tab', { name: 'Tools' }));
    fireEvent.click(within(mobileToolRail).getByRole('button', { name: 'Draw' }));
    fireEvent.click(within(drawer).getByLabelText('Draw on canvas'));
    expect(useCoatProjectStore.getState().drawingSettings.isActive).toBe(true);

    fireEvent.click(within(mobileToolRail).getByRole('button', { name: 'Text' }));
    expect(useCoatProjectStore.getState().drawingSettings.isActive).toBe(false);
  });

  it('preserves an unsubmitted mobile text draft when the tools drawer closes', () => {
    renderWorkbench();
    const toolsTrigger = toggleMobileToolPanel();

    const firstDrawer = screen.getByRole('region', { name: 'Tools' });
    const mobileToolRail = getMobileToolRail();
    fireEvent.click(within(mobileToolRail).getByRole('tab', { name: 'Tools' }));
    fireEvent.change(within(firstDrawer).getByLabelText('Motto text'), { target: { value: 'MOBILE DRAFT' } });
    fireEvent.click(within(getMobileDrawer()).getByRole('button', { name: 'Close tools' }));

    fireEvent.click(toolsTrigger);
    const reopenedDrawer = screen.getByRole('region', { name: 'Tools' });
    expect(within(reopenedDrawer).getByLabelText('Motto text')).toHaveProperty('value', 'MOBILE DRAFT');
  });

  it('shares an unsubmitted text draft between desktop and mobile tool panels', () => {
    renderWorkbench();
    selectDesktopTool('Tools');

    fireEvent.change(within(getDesktopPanel('Tools')).getByLabelText('Motto text'), { target: { value: 'SHARED DRAFT' } });
    toggleMobileToolPanel();

    expect(within(screen.getByRole('region', { name: 'Tools' })).getByLabelText('Motto text')).toHaveProperty('value', 'SHARED DRAFT');
  });

  it('uses a single canvas-first grid column below the target desktop breakpoint', () => {
    const workbenchStyles = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8');

    expect(workbenchStyles).toContain('@media (max-width: 1023px)');
    expect(workbenchStyles).toContain('.coat-target-workbench .coat-target-editor-grid { grid-template-columns: 1fr; }');
    expect(workbenchStyles).toContain('.coat-target-workbench .coat-workbench-mobile-drawer { display: grid; }');
    expect(workbenchStyles).toContain('.coat-target-workbench .coat-workbench-mobile-drawer > .coat-target-reference-rail { display: flex; flex: 1 1 auto; width: auto; min-width: 0; max-width: none;');
    expect(workbenchStyles).toContain('grid-template-rows: auto auto minmax(34rem, 1fr) auto;');
    expect(workbenchStyles).toContain('grid-template-rows: auto auto minmax(29rem, 1fr) auto;');
  });

  it('roots each target workbench selector below the workbench boundary', () => {
    const workbenchStyles = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8');
    const unscopedTargetSelectors = workbenchStyles.match(/(?:^|[,{])\s*\.coat-target-(?!workbench\b)/gm) ?? [];

    expect(unscopedTargetSelectors).toEqual([]);
  });

  it('fits the export-sized scene SVG inside the target artboard', () => {
    const workbenchStyles = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8');

    expect(workbenchStyles).toContain('.coat-target-workbench .coat-target-artboard .coat-canvas svg { width: 100%; height: 100%; }');
  });

  it('uses the project canvas aspect ratio for the artboard and interaction canvas', () => {
    const workbenchStyles = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8');

    expect(workbenchStyles).toContain('.coat-target-workbench .coat-target-artboard { display: grid; width: min(30rem, calc((100svh - 12rem) * 0.91), calc(100vw - 28rem)); max-width: 96%; aspect-ratio: var(--coat-canvas-aspect-ratio);');
    expect(workbenchStyles).toContain(".coat-target-workbench .coat-target-artboard [role='application'] { width: 100%; height: 100%; max-width: 100%; aspect-ratio: var(--coat-canvas-aspect-ratio);");
  });

  it('uses the Instagram preset dimensions for both canvas geometry and serialized SVG', () => {
    renderWorkbench();

    selectDesktopTool('Settings');
    fireEvent.click(screen.getByRole('button', { name: 'Instagram Story' }));

    const artboard = document.querySelector('.coat-target-artboard');
    const canvas = screen.getByRole('application', { name: 'Coat of arms canvas' });
    expect(artboard?.getAttribute('style')).toContain('--coat-canvas-aspect-ratio: 1080 / 1920');
    expect(canvas.getAttribute('style')).toContain('--coat-canvas-aspect-ratio: 1080 / 1920');
    expect(canvas.innerHTML).toContain('width="1080" height="1920"');
  });

  it('keeps the default artboard within a short desktop scene viewport', () => {
    const workbenchStyles = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8');

    expect(workbenchStyles).toContain('.coat-target-workbench .coat-target-artboard-wrap { display: grid; min-height: 0; place-items: center; overflow: auto; padding: clamp(0.75rem, 2vh, 2rem)');
  });

  it('keeps zoomed artboard edges reachable and exposes a fullscreen control', () => {
    renderWorkbench();
    const workbenchStyles = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8');

    fireEvent.change(screen.getByRole('slider', { name: 'Canvas zoom percentage' }), { target: { value: '1' } });

    expect(screen.getByRole('button', { name: 'Enter fullscreen' })).toBeDefined();
    expect(document.querySelector('.coat-target-artboard')?.getAttribute('style')).toContain('--coat-scene-zoom-level');
    expect(workbenchStyles).toContain('.coat-target-workbench .coat-target-artboard-wrap { display: grid; min-height: 0; place-items: center; overflow: auto;');
    expect(workbenchStyles).toContain('zoom: var(--coat-scene-zoom-level);');
  });

  it('uses Chinese Task 6 controls when locale is Chinese', () => {
    renderWorkbench('zh');

    expect(screen.getByRole('button', { name: '撤销' })).toBeDefined();
    expect(screen.getByRole('button', { name: '重做' })).toBeDefined();
    const projectsTrigger = screen.getByRole('button', { name: '打开本地项目库' });
    fireEvent.click(projectsTrigger);
    expect(screen.getByRole('button', { name: '本地保存项目' })).toBeDefined();
    expect(screen.getByRole('button', { name: '关闭' })).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: '关闭' }));
    fireEvent.click(screen.getByRole('button', { name: '导出' }));
    expect(screen.getByRole('button', { name: '导出 PNG' })).toBeDefined();
    expect(screen.getByRole('button', { name: '关闭导出菜单' })).toBeDefined();
  });

  it('localizes Maker accessibility labels and tool tabs when locale is Chinese', () => {
    renderWorkbench('zh');

    expect(screen.getByRole('main', { name: '徽章制作工作台' })).toBeDefined();
    expect(screen.getByRole('complementary', { name: '桌面徽章工具' })).toBeDefined();
    expect(getDesktopToolRail()).toBeDefined();
    expect(screen.queryByRole('complementary', { name: '项目与图层停靠区' })).toBeNull();
    expect(getDesktopTool('盾牌')).toBeDefined();
    expect(getDesktopTool('符记')).toBeDefined();
  });

  it('uses locale-owned workbench, canvas, and mobile controls', () => {
    renderWorkbench('en');

    expect(screen.getByRole('application', { name: 'Coat of arms canvas' })).toBeDefined();
    expect(screen.getByText(/Alt plus an arrow selects another layer.*\[ and \] scale.*comma and period rotate/i)).toBeDefined();
    toggleMobileToolPanel();
    expect(screen.getByRole('button', { name: 'Close tools' })).toBeDefined();

    cleanup();
    renderWorkbench('zh');

    expect(screen.getByRole('application', { name: '徽章画布' })).toBeDefined();
    expect(screen.getByText(/Alt 加方向键切换图层.*\[ 和 \] 缩放.*逗号和句号旋转/)).toBeDefined();
    toggleMobileToolPanel('展开工具面板');
    expect(screen.getByRole('button', { name: '关闭工具' })).toBeDefined();
  });

  it('initializes the target showcase without creating a recoverable draft', () => {
    render(<CoatOfArmsMaker locale="en" />);

    expect(useCoatProjectStore.getState().project.layers).toHaveLength(4);
    expect(localStorage.getItem(COAT_PROJECT_DRAFT_STORAGE_KEY)).toBeNull();
  });

  it('keeps whole-project randomization available from the target tools panel', () => {
    renderWorkbench('en');
    const projectIdBeforeRandomize = useCoatProjectStore.getState().project.id;

    selectDesktopTool('Tools');
    fireEvent.click(screen.getByRole('button', { name: 'Randomize project' }));

    expect(useCoatProjectStore.getState().project.id).not.toBe(projectIdBeforeRandomize);
  });

  it('offers an explicit English draft recovery choice without overwriting a named project', () => {
    const namedProject = { ...createDefaultProject('en'), id: 'named-project', name: 'Named project' };
    const draft = { ...createDefaultProject('en'), id: 'draft-project', name: 'Recovered draft' };
    useCoatProjectStore.getState().replaceProject(namedProject);
    localStorage.setItem(COAT_PROJECT_DRAFT_STORAGE_KEY, JSON.stringify({ version: 1, project: draft }));
    useCoatProjectStore.setState({ isInitialDocument: true });

    render(<CoatOfArmsMaker locale="en" />);

    expect(screen.getByRole('status', { name: 'Draft available' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Restore draft' })).toBeDefined();
    expect(useCoatProjectStore.getState().project.name).toBe('Named project');
    expect(screen.getByRole('main').querySelector('.coat-workbench-content')?.hasAttribute('inert')).toBe(true);
    expect(useCoatProjectStore.getState().project.name).toBe('Named project');
    expect(localStorage.getItem(COAT_PROJECT_DRAFT_STORAGE_KEY)).toBe(JSON.stringify({ version: 1, project: draft }));
    fireEvent.click(screen.getByRole('button', { name: 'Restore draft' }));
    expect(screen.getByRole('heading', { name: 'Recovered draft' })).toBeDefined();
  });

  it('keeps a malformed browser draft until the user explicitly discards it', () => {
    localStorage.setItem(COAT_PROJECT_DRAFT_STORAGE_KEY, '{');

    render(<CoatOfArmsMaker locale="en" />);

    expect(screen.getByRole('alert').textContent).toContain('Invalid coat project draft JSON');
    expect(screen.queryByRole('button', { name: 'Restore draft' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Discard draft' })).toBeDefined();
    expect(localStorage.getItem(COAT_PROJECT_DRAFT_STORAGE_KEY)).toBe('{');

    fireEvent.click(screen.getByRole('button', { name: 'Discard draft' }));

    expect(localStorage.getItem(COAT_PROJECT_DRAFT_STORAGE_KEY)).toBeNull();
  });

  it('does not offer recovery for the draft created by the current editing session', () => {
    render(<CoatOfArmsMaker locale="en" />);

    expect(screen.queryByRole('status', { name: 'Draft available' })).toBeNull();
    selectDesktopTool('Charges');
    fireEvent.click(screen.getByRole('button', { name: 'Add random charges' }));

    expect(screen.queryByRole('status', { name: 'Draft available' })).toBeNull();
    expect(localStorage.getItem(COAT_PROJECT_DRAFT_STORAGE_KEY)).not.toBeNull();
  });

  it('protects a cross-locale recovery draft from global shortcuts until the user restores or discards it', () => {
    const crossLocaleDraft = { ...createDefaultProject('en'), id: 'en-draft', name: 'English recovery draft' };
    const serializedDraft = JSON.stringify({ version: 1, project: crossLocaleDraft });
    localStorage.setItem(COAT_PROJECT_DRAFT_STORAGE_KEY, serializedDraft);

    render(<CoatOfArmsMaker locale="zh" />);

    expect(screen.getByRole('status', { name: '发现草稿' })).toBeDefined();
    fireEvent.keyDown(window, { key: 'z', ctrlKey: true });
    expect(localStorage.getItem(COAT_PROJECT_DRAFT_STORAGE_KEY)).toBe(serializedDraft);
    fireEvent.click(screen.getByRole('button', { name: '恢复草稿' }));
    expect(screen.getByRole('heading', { name: 'English recovery draft' })).toBeDefined();
  });

  it('does not mistake the active session draft for a recovery candidate after remount', () => {
    const activeProject = { ...createDefaultProject('en'), id: 'active-project', name: 'Active session project' };
    useCoatProjectStore.getState().replaceProject(activeProject);

    render(<CoatOfArmsMaker locale="en" />);

    expect(screen.queryByRole('status', { name: 'Draft available' })).toBeNull();
    expect(screen.getByRole('heading', { name: 'Active session project' })).toBeDefined();
  });

  it('uses Chinese draft recovery controls and lets the user discard the draft', () => {
    const draft = { ...createDefaultProject('zh'), id: 'zh-draft-project', name: '待恢复草稿' };
    localStorage.setItem(COAT_PROJECT_DRAFT_STORAGE_KEY, JSON.stringify({ version: 1, project: draft }));

    render(<CoatOfArmsMaker locale="zh" />);

    expect(screen.getByRole('status', { name: '发现草稿' })).toBeDefined();
    expect(screen.getByRole('button', { name: '恢复草稿' })).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: '丢弃草稿' }));
    expect(screen.queryByRole('status', { name: '发现草稿' })).toBeNull();
    expect(localStorage.getItem(COAT_PROJECT_DRAFT_STORAGE_KEY)).toBeNull();
    expect(screen.getByRole('heading', { name: '我的徽章' })).toBeDefined();
  });

  it('creates the Chinese default project when the untouched initial store first mounts in Chinese', () => {
    render(<CoatOfArmsMaker locale="zh" />);

    expect(screen.getByRole('heading', { name: '我的徽章' })).toBeDefined();
    expect(useCoatProjectStore.getState().project).toMatchObject({
      locale: 'zh',
      name: '我的徽章',
    });
  });

  it('preserves an existing edited project when the Maker mounts in another locale', () => {
    const editedProject = { ...createDefaultProject('en'), name: 'Keep these arms' };
    useCoatProjectStore.getState().replaceProject(editedProject);

    render(<CoatOfArmsMaker locale="zh" />);

    expect(screen.getByRole('heading', { name: 'Keep these arms' })).toBeDefined();
    expect(useCoatProjectStore.getState().project).toMatchObject({
      id: editedProject.id,
      locale: 'en',
      name: 'Keep these arms',
    });
  });

  it('sanitizes project JSON download names and revokes its object URL', () => {
    const unsafeNameProject = { ...createDefaultProject('en'), name: '../../\u0000' };
    let downloadName = '';
    const createObjectURL = vi.fn(() => 'blob:project-json');
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function clickAnchor(this: HTMLAnchorElement) {
      downloadName = this.download;
    });
    renderWorkbench('en', unsafeNameProject);

    fireEvent.click(screen.getByRole('button', { name: 'Open local project library' }));
    fireEvent.click(screen.getByRole('button', { name: 'Export project JSON' }));

    expect(downloadName).toBe('coat-of-arms.json');
    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:project-json');
  });
});
