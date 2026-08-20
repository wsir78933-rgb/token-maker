// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { EDITOR_PREFERENCES_STORAGE_KEY, getDefaultEditorPreferences, loadEditorPreferences, updateEditorPreferences } from '@/lib/coat-of-arms/editor-preferences';
import { useEditorPreferencesStore } from '@/lib/coat-of-arms/editor-preferences-session';
import { COAT_PROJECT_DRAFT_STORAGE_KEY } from '@/lib/coat-of-arms/project-storage';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import * as exportModule from '@/lib/coat-of-arms/export';
import { CoatOfArmsMaker } from './CoatOfArmsMaker';

vi.mock('@/lib/coat-of-arms/export', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/coat-of-arms/export')>();
  return {
    ...actual,
    exportCoatPng: vi.fn(async () => new Blob(['png'], { type: 'image/png' })),
    exportCoatJpeg: vi.fn(async () => new Blob(['jpg'], { type: 'image/jpeg' })),
    exportCoatPdf: vi.fn(async () => new Blob(['pdf'], { type: 'application/pdf' })),
    exportCoatBatch: vi.fn(async () => new Blob(['zip'], { type: 'application/zip' })),
    printCoatScene: vi.fn(),
  };
});

function renderWorkbench(locale: 'en' | 'zh' = 'en', project = createDefaultProject(locale)) {
  useCoatProjectStore.getState().replaceProject(project);
  return render(<CoatOfArmsMaker locale={locale} />);
}

function expectWorkbenchProjectNameToBeNonHeading(expectedProjectName: string) {
  const workbench = screen.getByRole('main');
  expect(within(workbench).queryByRole('heading', { name: expectedProjectName })).toBeNull();

  const workbenchContent = workbench.querySelector<HTMLElement>(':scope > .coat-workbench-content');
  if (!workbenchContent) throw new Error(`Coat workbench content is unavailable for project name: ${expectedProjectName}`);

  const directProjectNameElements = workbenchContent.querySelectorAll<HTMLElement>(':scope > .sr-only');
  expect(directProjectNameElements).toHaveLength(1);

  const projectNameElement = directProjectNameElements.item(0);
  expect(projectNameElement.tagName).toBe('SPAN');
  expect(projectNameElement.textContent).toBe(expectedProjectName);
  expect(projectNameElement.getAttribute('role')).not.toBe('heading');
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

function revealAllGalleryCards(locale: 'en' | 'zh') {
  const loadMoreLabel = locale === 'zh' ? '加载更多' : 'Load more';
  while (true) {
    const loadMoreButtons = screen.queryAllByRole('button', { name: loadMoreLabel });
    if (loadMoreButtons.length === 0) return;
    loadMoreButtons.forEach((button) => fireEvent.click(button));
  }
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
  const toolsTab = getDesktopTool(/tools/i);
  if (toolsTab.getAttribute('aria-expanded') !== 'true') {
    fireEvent.click(toolsTab);
  }
  fireEvent.click(getDesktopToolTreeItem(label));
}

function selectPositionSection(label: 'Arrange' | 'Layers') {
  const positionTab = getDesktopTool(/position/i);
  if (positionTab.getAttribute('aria-expanded') !== 'true') {
    fireEvent.click(positionTab);
  }
  fireEvent.click(getDesktopToolTreeItem(label));
}

function selectLayers() {
  selectPositionSection('Layers');
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
    useEditorPreferencesStore.setState({ preferences: getDefaultEditorPreferences() });
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
    expect(getDesktopToolTreeItem('Text')).toBeDefined();
    expect(getDesktopToolTreeItem('Draw')).toBeDefined();
    expect(getDesktopToolTreeItem('Random')).toBeDefined();
    expect(getDesktopToolTreeItem('Names')).toBeDefined();
    expect(within(getDesktopToolRail()).queryByRole('button', { name: 'Upload' })).toBeNull();
    expect(screen.queryByRole('tab', { name: 'Layers' })).toBeNull();
    fireEvent.click(getDesktopTool(/position/i));
    expect(getDesktopToolTreeItem('Arrange')).toBeDefined();
    expect(getDesktopToolTreeItem('Layers')).toBeDefined();
    expect(screen.getByRole('button', { name: /export/i })).toBeDefined();
  });

  it('does not expose a named local project library', () => {
    renderWorkbench();

    expect(screen.queryByRole('button', { name: 'Open local project library' })).toBeNull();
    expect(screen.queryByRole('dialog', { name: 'Local projects' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Save project locally' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Save as local copy' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Export project JSON' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Import project JSON' })).toBeNull();
    expect(screen.queryByLabelText('Project name')).toBeNull();
  });

  it('opens the matching Tools panel from the left tree', () => {
    renderWorkbench();
    selectDesktopTool('Tools');

    fireEvent.click(getDesktopToolTreeItem('Draw'));
    expect(within(getDesktopPanel('Tools')).getByRole('region', { name: 'Draw' })).toBeDefined();
    fireEvent.click(getDesktopToolTreeItem('Random'));
    expect(within(getDesktopPanel('Tools')).getByRole('button', { name: 'Create Random Coat of Arms' })).toBeDefined();
    expect(within(getDesktopPanel('Tools')).getByText(/Click on the button to generate random coats of arms/)).toBeDefined();
  });

  it('places export immediately left of multi-select in the canvas toolbar', () => {
    renderWorkbench();

    const actionBar = document.querySelector<HTMLElement>('.coat-target-actionbar');
    expect(actionBar).toBeNull();
    const canvasToolbar = document.querySelector<HTMLElement>('.coat-target-canvas-toolbar');
    const toolbarActions = canvasToolbar?.querySelector<HTMLElement>('.coat-target-canvas-toolbar-actions');
    expect(toolbarActions).not.toBeNull();
    const exportControl = toolbarActions?.querySelector<HTMLElement>('.coat-target-export-control');
    expect(exportControl).not.toBeNull();
    const exportTrigger = within(exportControl!).getByRole('button', { name: 'Export' });
    const multiSelectTrigger = within(toolbarActions!).getByRole('button', { name: 'Multi-select' });
    expect(exportTrigger).toBeDefined();
    expect(exportTrigger.querySelectorAll('svg')).toHaveLength(2);
    expect(exportControl!.nextElementSibling).toBe(multiSelectTrigger);
    const workbench = screen.getByRole('main');
    const topbar = workbench.querySelector<HTMLElement>(':scope > .site-topbar');
    const workbenchContent = workbench.querySelector<HTMLElement>(':scope > .coat-workbench-content');
    expect(topbar).not.toBeNull();
    expect(workbenchContent).not.toBeNull();
    expect(topbar!.nextElementSibling).toBe(workbenchContent);
    expectWorkbenchProjectNameToBeNonHeading('My Coat of Arms');
  });

  it('places the selected-element colour strip between toolbar groups and preserves its mobile row contract', () => {
    renderWorkbench();
    const shield = useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield');
    if (!shield) throw new Error('Expected a selectable shield layer');
    act(() => useCoatProjectStore.getState().setSelectedLayerIds([shield.id]));

    const canvasToolbar = document.querySelector<HTMLElement>('.coat-target-canvas-toolbar');
    const toolbarGroups = canvasToolbar?.querySelectorAll<HTMLElement>(':scope > div');
    const colourStrip = screen.getByRole('group', { name: 'Selected element colours' });
    const toolbarActions = canvasToolbar?.querySelector<HTMLElement>('.coat-target-canvas-toolbar-actions');
    expect(toolbarGroups?.item(0)?.nextElementSibling).toBe(colourStrip);
    expect(colourStrip.nextElementSibling).toBe(toolbarActions);

    const workbenchStyles = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8');
    expect(workbenchStyles).toContain('.coat-target-workbench .coat-target-scene { position: relative; display: grid; min-width: 0; min-height: 0; grid-template-rows: 2.5rem minmax(0, 1fr);');
    expect(workbenchStyles).toContain('.coat-target-workbench .coat-target-canvas-toolbar > div:first-child,\n.coat-target-workbench .coat-target-canvas-toolbar-actions { flex: 0 0 auto; }');
    expect(workbenchStyles).toContain('.coat-target-workbench .coat-target-selected-element-colour-strip { display: flex; flex: 1 1 auto; min-width: 0; overflow-x: auto; align-items: center; gap: 0.28rem; }');
    expect(workbenchStyles).toContain('.coat-target-workbench .coat-target-selected-element-colour-strip::-webkit-scrollbar { height: 0.125rem; }');
    expect(workbenchStyles).toContain('@supports not selector(::-webkit-scrollbar) {\n  .coat-target-workbench .coat-target-selected-element-colour-strip { scrollbar-width: thin; }\n}');
    expect(workbenchStyles).toContain('@media (max-width: 639px) {\n  .coat-target-workbench .coat-workbench-content');
    expect(workbenchStyles).toContain('.coat-target-workbench .coat-target-scene { grid-template-rows: auto minmax(0, 1fr); }');
    expect(workbenchStyles).toContain('.coat-target-workbench .coat-target-selected-element-colour-strip { order: 3; flex: 1 0 100%; width: 100%; max-width: 100%; overflow-x: auto;');
  });

  it('uses the English shared site navigation with Coat Maker active', () => {
    renderWorkbench('en');

    expect(screen.getByRole('link', { name: 'Editor' }).getAttribute('href')).toBe('/');
    expect(screen.getByRole('link', { name: 'Dice Roller' }).getAttribute('href')).toBe('/dice-roller-dnd');
    const coatMakerLink = screen.getByRole('link', { name: 'Coat Maker' });
    expect(coatMakerLink.getAttribute('href')).toBe('/coat-of-arms-maker');
    expect(coatMakerLink.getAttribute('data-active')).toBe('true');
    expect(screen.getByRole('link', { name: 'Blog' }).getAttribute('href')).toBe('/blog');
    expect(screen.getByRole('link', { name: '中文' }).getAttribute('href')).toBe('/zh/coat-of-arms-maker');
    expect(screen.queryByRole('link', { name: 'Help Center' })).toBeNull();
  });

  it('matches the homepage public-navigation presentation without overriding the site mark', () => {
    renderWorkbench('en');

    const topbar = screen.getByRole('main').querySelector<HTMLElement>(':scope > .site-topbar');
    if (!topbar) throw new Error('Coat Maker public navigation is unavailable');
    const navigationContent = topbar.firstElementChild as HTMLElement | null;
    const brandTitle = topbar.querySelector<HTMLElement>('.site-brand-title');
    const siteMark = topbar.querySelector<HTMLImageElement>('.site-brand-link > img');
    const navigation = topbar.querySelector<HTMLElement>('nav');

    expect(topbar.className).toBe('site-topbar z-50');
    expect(navigationContent?.className).toBe('mx-auto max-w-6xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8');
    expect(brandTitle?.className).toBe('site-brand-title font-semibold text-base');
    expect(siteMark?.className).toBe('h-9 w-9 shrink-0 rounded-xl');
    expect(navigation?.className).toBe('mt-3 flex flex-wrap items-center gap-2 sm:mt-4');
  });

  it.each([
    ['en', 'VTT token maker'],
    ['zh', 'VTT Token 制作器'],
  ] as const)('uses the homepage tagline in the %s public navigation', (locale, expectedTagline) => {
    renderWorkbench(locale);

    const topbar = screen.getByRole('main').querySelector<HTMLElement>(':scope > .site-topbar');
    expect(topbar?.querySelector('.site-brand-subtitle')?.textContent).toBe(expectedTagline);
  });

  it('uses the homepage editor visual tokens without recolouring the output artboard', () => {
    const workbenchStyles = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8');

    expect(workbenchStyles).toMatch(/\.coat-target-workbench\s*\{[\s\S]*?--coat-stage:/);
    expect(workbenchStyles).toMatch(/\.coat-target-workbench\s*\{[\s\S]*?font-family:\s*var\(--font-sans\);/);
    expect(workbenchStyles).toContain('background: var(--coat-stage);');
    expect(workbenchStyles).toContain(".coat-target-workbench .coat-target-artboard [role='application'] { width: 100%; height: 100%; max-width: 100%; aspect-ratio: var(--coat-canvas-aspect-ratio); border: 0; border-radius: 0; background: #fff;");
    expect(workbenchStyles).toMatch(/\.coat-target-workbench > \.site-topbar\s*\{[\s\S]*?font-family:\s*var\(--font-sans\);[\s\S]*?\}/);
  });

  it('keeps the Chinese shared navigation and locale switch on Coat Maker', () => {
    renderWorkbench('zh');

    expect(screen.getByRole('link', { name: '编辑器' }).getAttribute('href')).toBe('/zh');
    expect(screen.getByRole('link', { name: '骰子' }).getAttribute('href')).toBe('/zh/dice-roller-dnd');
    const coatMakerLink = screen.getByRole('link', { name: '纹章制作器' });
    expect(coatMakerLink.getAttribute('href')).toBe('/zh/coat-of-arms-maker');
    expect(coatMakerLink.getAttribute('data-active')).toBe('true');
    expect(screen.getByRole('link', { name: '博客' }).getAttribute('href')).toBe('/zh/blog');
    expect(screen.getByRole('link', { name: 'English' }).getAttribute('href')).toBe('/coat-of-arms-maker');
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

  it('uses the shared gold accent for Flags and Tokens in the desktop tree', () => {
    const workbenchStyles = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8');

    expect(workbenchStyles).toContain(".coat-target-workbench .coat-target-tool-tree-node[data-tool-id='flags'] .coat-tool-glyph,");
    expect(workbenchStyles).toContain(".coat-target-workbench .coat-target-tool-tree-node[data-tool-id='tokens'] .coat-tool-glyph { color: var(--coat-accent); }");
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

  it('keeps the selected desktop tree choice in the shared active treatment', () => {
    const workbenchStyles = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8');

    expect(workbenchStyles).toContain(".coat-target-workbench .coat-target-tool-tree-branch button[aria-pressed='true'] { margin-right: 0.4rem; border-radius: 0.5rem; background: var(--coat-active); }");
  });

  it('uses the Top tree branch as the sole top-ornament category control', () => {
    renderWorkbench();

    fireEvent.click(getDesktopTool('Top'));
    fireEvent.click(getDesktopToolTreeItem('Mantles'));

    expect(screen.queryByLabelText('Top category')).toBeNull();
    expect(screen.queryByRole('group', { name: 'Top ornament categories' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Add top ornament: Amber Mantle' })).toBeDefined();
  });

  it('uses the Charges tree branch as the sole charge category control', () => {
    renderWorkbench();

    fireEvent.click(getDesktopTool('Charges'));
    fireEvent.click(getDesktopToolTreeItem('Objects'));

    expect(screen.queryByLabelText('Library category')).toBeNull();
    expect(screen.queryByLabelText('Charge category')).toBeNull();
    expect(screen.queryByRole('group', { name: 'Charge categories' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Add charge: Castle Tower' })).toBeDefined();
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

  it('distinguishes inactive and active multi-select controls with a shared keyboard focus treatment', () => {
    const workbenchStyles = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8');

    expect(workbenchStyles).toContain('.coat-target-workbench .coat-target-multi-select { border-color: var(--coat-line) !important; background: var(--coat-panel-raised) !important; color: var(--coat-text) !important; padding-inline: 0.85rem !important; }');
    expect(workbenchStyles).toContain(".coat-target-workbench .coat-target-multi-select[aria-pressed='true'] { border-color: color-mix(in oklab, var(--coat-accent) 54%, var(--coat-line)) !important; background: var(--coat-active) !important; color: var(--coat-accent) !important; }");
    expect(workbenchStyles).toContain('.coat-target-workbench .coat-workbench-content :is(button, input, select):focus-visible { outline: 2px solid var(--coat-accent); outline-offset: 2px; }');
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
    fireEvent.click(screen.getByRole('button', { name: 'Add Compass Rose token' }));

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      type: 'charge', assetId: 'material-symbol-compass-rose',
    });
  });

  it('browses a selected shield tree category without mutating the canvas', () => {
    renderWorkbench();
    const initialShield = useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield');

    fireEvent.click(getDesktopToolTreeItem('French shield'));

    expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield'))
      .toEqual(initialShield);
    expect(getDesktopToolTreeItem('French shield').getAttribute('aria-pressed')).toBe('true');
    expect(within(getDesktopPanel('Shields')).getByRole('button', { name: 'Select shield: French shield material 001' })).toBeDefined();
  });

  it('makes each shield tree category browseable without changing its layer', () => {
    renderWorkbench();
    const initialShield = useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield');

    for (const treeLabel of [
      'Kite shield',
      'Heater shield',
      'French shield',
      'Banner shield',
      'Round shield',
      'Lozenge shield',
    ] as const) {
      fireEvent.click(getDesktopToolTreeItem(treeLabel));
      expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield')).toEqual(initialShield);
      expect(within(getDesktopPanel('Shields')).getAllByRole('button', { name: /^Select shield:/ }).length).toBeGreaterThan(0);
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
    expect(within(getDesktopPanel('Shields')).getByRole('button', { name: 'Select shield: French shield material 001' })).toBeDefined();
  });

  it('keeps Custom focused on local shield settings rather than the shield gallery', () => {
    renderWorkbench();

    fireEvent.click(getDesktopTool('Custom'));

    const customPanel = getDesktopPanel('Custom');
    expect(within(customPanel).getByRole('region', { name: 'Shield & field' })).toBeDefined();
    expect(within(customPanel).getByLabelText('Editing: Escutcheon 1')).toBeDefined();
    expect(within(customPanel).getByRole('button', { name: '+ Add New Escutcheon' })).toBeDefined();
    expect(within(customPanel).getByRole('heading', { name: 'Custom Shield Uploads' })).toBeDefined();
    expect(within(customPanel).getByLabelText('Upload custom shield mask')).toBeDefined();
    expect(within(customPanel).queryByLabelText('Field division')).toBeNull();
    expect(screen.queryByRole('region', { name: 'Shield library' })).toBeNull();
  });

  it('keeps the shield material browser separate from Custom controls', () => {
    renderWorkbench();

    const shieldPanel = getDesktopPanel('Shields');
    expect(within(shieldPanel).getByRole('button', { name: 'Select shield: Heater shield material 001' })).toBeDefined();
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
    selectPositionSection('Arrange');

    const positionPanel = getDesktopPanel('Position');
    const xInput = within(positionPanel).getByLabelText('Position X') as HTMLInputElement;
    expect(xInput.value).toBe('0');
    expect(within(positionPanel).getByLabelText('Keep aspect ratio')).toBeDefined();
    expect(within(positionPanel).queryByRole('button', { name: 'Flip horizontal' })).toBeNull();
    expect(within(positionPanel).queryByLabelText('Crop left')).toBeNull();
    expect(within(positionPanel).queryByRole('button', { name: 'Group selected layers' })).toBeNull();
    fireEvent.change(xInput, { target: { value: '18' } });
    fireEvent.change(within(positionPanel).getByLabelText('Position opacity'), { target: { value: '0.4' } });
    expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.id === shield.id))
      .toMatchObject({ transform: { x: 18, opacity: 0.4 } });
  });

  it('shows Arrange placeholder until a layer is selected, then Position X', () => {
    renderWorkbench();

    selectPositionSection('Arrange');
    const emptyPositionPanel = getDesktopPanel('Position');
    expect(within(emptyPositionPanel).getByText('Select an element to see position options.')).toBeDefined();
    expect(within(emptyPositionPanel).queryByLabelText('Position X')).toBeNull();

    const shield = useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield');
    if (!shield) throw new Error('Expected default shield layer');
    selectLayers();
    fireEvent.click(screen.getAllByLabelText(new RegExp(`Select layer ${shield.id}`))[0]!);
    selectPositionSection('Arrange');
    expect(within(getDesktopPanel('Position')).getByLabelText('Position X')).toBeDefined();
  });

  it('flips the selected layer from the Position panel without exposing crop editor controls', () => {
    renderWorkbench();
    const shield = useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield');
    if (!shield) throw new Error('Expected default shield layer');

    selectLayers();
    fireEvent.click(screen.getAllByLabelText(new RegExp(`Select layer ${shield.id}`))[0]!);
    selectPositionSection('Arrange');
    const positionPanel = getDesktopPanel('Position');
    expect(within(positionPanel).getByRole('group', { name: 'Position' })).toBeDefined();
    expect(within(positionPanel).queryByRole('group', { name: 'Flip selected layer' })).toBeNull();
    expect(within(positionPanel).queryByLabelText('Crop left')).toBeNull();
    expect(within(positionPanel).queryByLabelText('Crop top')).toBeNull();
    expect(within(positionPanel).queryByLabelText('Crop width')).toBeNull();
    expect(within(positionPanel).queryByLabelText('Crop height')).toBeNull();
    expect(within(positionPanel).queryByRole('button', { name: 'Reset crop' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Flip selected element horizontally' }));

    expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.id === shield.id))
      .toMatchObject({ transform: { flipHorizontal: true } });
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
    revealAllGalleryCards('en');
    fireEvent.click(screen.getByRole('button', { name: 'Add top ornament: Royal Crown' }));

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({ type: 'top', assetId: 'material-crown-royal-crown' });
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

    fireEvent.click(screen.getByRole('button', { name: /export/i }));
    expect(screen.getByLabelText('File type')).toBeDefined();
    expect(screen.getByLabelText('Quality')).toBeDefined();
    expect(screen.getByLabelText('Transparent background')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Download PNG' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Share' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Print' })).toBeDefined();
    expect(screen.queryByRole('button', { name: 'Copy image' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Export batch ZIP' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Export PNG' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Export JPG' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Export PDF' })).toBeNull();
  });

  it('restores and persists the browser-local JPEG export quality', async () => {
    localStorage.setItem(EDITOR_PREFERENCES_STORAGE_KEY, JSON.stringify({
      version: 1,
      appearance: 'dark',
      colorPickerMode: 'simple',
      canvasPreset: 'square',
      exportSize: 2048,
      jpegQuality: 'ultra',
      customPalette: [],
      backgroundGradient: null,
    }));
    renderWorkbench();

    fireEvent.click(screen.getByRole('button', { name: 'Export' }));
    const qualityControl = screen.getByLabelText('Quality');
    await act(async () => { await Promise.resolve(); });

    fireEvent.change(qualityControl, { target: { value: '3' } });
    expect(loadEditorPreferences()).toMatchObject({ jpegQuality: 'ultra', exportSize: 2048 });

    fireEvent.change(qualityControl, { target: { value: '1' } });
    expect(loadEditorPreferences()).toMatchObject({ jpegQuality: 'medium', exportSize: 512 });
  });

  it('reports the JPG-specific success message after a local JPG export', async () => {
    renderWorkbench();
    fireEvent.click(screen.getByRole('button', { name: 'Export' }));
    const exportMenu = screen.getByRole('region', { name: 'Local export options' });

    fireEvent.change(screen.getByLabelText('File type'), { target: { value: 'jpeg' } });
    fireEvent.click(screen.getByRole('button', { name: 'Download JPG' }));

    expect((await within(exportMenu).findByText('JPG exported locally.')).textContent).toBe('JPG exported locally.');
  });

  it('uses the latest atomic local size and quality preferences for every export format', async () => {
    vi.clearAllMocks();
    const jsdomErrorMonitor = monitorJsdomErrors();
    const project = createDefaultProject('en');
    const share = vi.fn(async () => undefined);
    const downloadClicks = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    class TestFile extends Blob {
      readonly name: string;

      constructor(parts: BlobPart[], name: string, options?: FilePropertyBag) {
        super(parts, options);
        this.name = name;
      }
    }
    vi.stubGlobal('File', TestFile);
    vi.stubGlobal('navigator', { canShare: () => true, share });
    renderWorkbench('en', project);

    fireEvent.click(screen.getByRole('button', { name: 'Export' }));
    fireEvent.change(screen.getByLabelText('Quality'), { target: { value: '1' } });

    expect(JSON.parse(localStorage.getItem(EDITOR_PREFERENCES_STORAGE_KEY) ?? '')).toMatchObject({
      exportSize: 512,
      jpegQuality: 'medium',
    });

    updateEditorPreferences((preferences) => ({ ...preferences, exportSize: 2048, jpegQuality: 'ultra' }));
    const renderOptions = { transparentBackground: false };
    try {
      fireEvent.click(screen.getByRole('button', { name: 'Download PNG' }));
      fireEvent.change(screen.getByLabelText('File type'), { target: { value: 'jpeg' } });
      fireEvent.click(screen.getByRole('button', { name: 'Download JPG' }));
      fireEvent.click(screen.getByRole('button', { name: 'Share' }));
      fireEvent.change(screen.getByLabelText('File type'), { target: { value: 'pdf' } });
      fireEvent.click(screen.getByRole('button', { name: 'Download PDF' }));
      fireEvent.click(screen.getByRole('button', { name: 'Print' }));

      await waitFor(() => {
        expect(exportModule.exportCoatPng).toHaveBeenCalledWith(project, 2048, renderOptions);
        expect(exportModule.exportCoatJpeg).toHaveBeenCalledWith(project, 2048, 0.96);
        expect(exportModule.exportCoatPdf).toHaveBeenCalledWith(project, 2048, renderOptions);
        expect(exportModule.printCoatScene).toHaveBeenCalledWith(project, 2048, renderOptions);
        expect(exportModule.exportCoatBatch).not.toHaveBeenCalled();
        expect(share).toHaveBeenCalledTimes(1);
        expect(downloadClicks).toHaveBeenCalledTimes(3);
      });
      expect(jsdomErrorMonitor.errors).toEqual([]);
    } finally {
      jsdomErrorMonitor.stop();
    }
  });

  it('defaults the workbench chrome to dark appearance', () => {
    renderWorkbench();

    expect(document.querySelector('main.coat-target-workbench')?.getAttribute('data-appearance')).toBe('dark');
  });

  it('hydrates light workbench chrome from the stored editor preferences document', async () => {
    localStorage.setItem(EDITOR_PREFERENCES_STORAGE_KEY, JSON.stringify({
      version: 1,
      appearance: 'light',
      colorPickerMode: 'simple',
      canvasPreset: 'square',
      jpegQuality: 'high',
      customPalette: [],
      backgroundGradient: null,
    }));
    renderWorkbench();

    await waitFor(() => {
      expect(document.querySelector('main.coat-target-workbench')?.getAttribute('data-appearance')).toBe('light');
    });
  });

  it('shows the invalid persisted export size and leaves the active project unchanged', async () => {
    const project = createDefaultProject('en');
    localStorage.setItem(EDITOR_PREFERENCES_STORAGE_KEY, JSON.stringify({
      version: 1,
      appearance: 'dark',
      colorPickerMode: 'simple',
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
    fireEvent.click(screen.getByRole('button', { name: 'Share' }));

    const exportOptions = screen.getByRole('region', { name: 'Local export options' });
    expect((await within(exportOptions).findByText(/native share sheet opened/i)).textContent).toMatch(/share sheet opened/i);
    expect(share).toHaveBeenCalledWith(expect.objectContaining({ files: [expect.any(TestFile)] }));
  });

  it('shows a visible error when PNG export cannot create a blob URL', async () => {
    renderWorkbench();
    vi.stubGlobal('URL', { createObjectURL: () => { throw new Error('Export download is unavailable in this browser'); }, revokeObjectURL: vi.fn() });

    fireEvent.click(screen.getByRole('button', { name: /export/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Download PNG' }));

    expect((await screen.findByRole('alert')).textContent).toMatch(/unavailable in this browser/i);
  });

  it('uses Chinese-only project and export errors without exposing raw English failures', async () => {
    renderWorkbench('zh');
    vi.stubGlobal('URL', { createObjectURL: () => { throw new Error('Export download is unavailable in this browser'); }, revokeObjectURL: vi.fn() });
    fireEvent.click(screen.getByRole('button', { name: '导出' }));
    fireEvent.click(screen.getByRole('button', { name: '下载 PNG' }));

    const exportError = await screen.findByRole('alert');
    expect(exportError.textContent).toContain('导出失败');
    expect(exportError.textContent).not.toContain('Export download is unavailable in this browser');
    expect(exportError.textContent).not.toContain('browser');
  });

  it('passes a transparent background option when downloading PNG', async () => {
    const project = createDefaultProject('en');
    renderWorkbench('en', project);

    fireEvent.click(screen.getByRole('button', { name: 'Export' }));
    fireEvent.click(screen.getByLabelText('Transparent background'));
    fireEvent.click(screen.getByRole('button', { name: 'Download PNG' }));

    await waitFor(() => {
      expect(exportModule.exportCoatPng).toHaveBeenCalledWith(project, 1024, { transparentBackground: true });
    });
  });

  it('disables the transparent background checkbox for JPG', () => {
    renderWorkbench();

    fireEvent.click(screen.getByRole('button', { name: 'Export' }));
    fireEvent.click(screen.getByLabelText('Transparent background'));
    expect((screen.getByLabelText('Transparent background') as HTMLInputElement).checked).toBe(true);

    fireEvent.change(screen.getByLabelText('File type'), { target: { value: 'jpeg' } });

    const transparentBackground = screen.getByLabelText('Transparent background') as HTMLInputElement;
    expect(transparentBackground.disabled).toBe(true);
    expect(transparentBackground.checked).toBe(false);
  });

  it('only enables history actions when a matching history transition exists', () => {
    renderWorkbench();
    const undoButton = screen.getByRole('button', { name: 'Undo' });
    const redoButton = screen.getByRole('button', { name: 'Redo' });

    expect(undoButton.getAttribute('disabled')).not.toBeNull();
    expect(redoButton.getAttribute('disabled')).not.toBeNull();

    act(() => useCoatProjectStore.getState().dispatch({ type: 'add-layer', assetId: 'material-animal-lion-rampant' }));
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
    expect(document.activeElement).toBe(within(exportMenu).getByLabelText('File type'));

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

  it('keeps the mobile shield browser separate from Custom controls', () => {
    renderWorkbench();

    toggleMobileToolPanel();

    const drawer = screen.getByRole('region', { name: 'Tools' });
    expect(within(drawer).getByRole('button', { name: 'Select shield: Heater shield material 001' })).toBeDefined();
    expect(screen.queryByRole('button', { name: 'Custom shield settings' })).toBeNull();
  });

  it('keeps every mobile shield category browseable with material cards', () => {
    renderWorkbench();
    toggleMobileToolPanel();

    const drawer = screen.getByRole('region', { name: 'Tools' });
    for (const treeLabel of ['Kite shield', 'Heater shield', 'French shield', 'Banner shield', 'Round shield', 'Lozenge shield']) {
      fireEvent.click(within(getMobileToolRail()).getByRole('button', { name: treeLabel }));
      expect(within(drawer).getAllByRole('button', { name: /^Select shield:/ }).length).toBeGreaterThan(0);
    }
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
    expect(within(within(drawer).getByRole('tabpanel', { name: 'Position' })).getByRole('region', { name: 'Arrange' })).toBeDefined();
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
    expect(within(drawer).getByRole('button', { name: 'Select shield: French shield material 001' })).toBeDefined();

    fireEvent.click(within(mobileToolRail).getByRole('tab', { name: 'Charges' }));
    expect(within(mobileToolRail).queryByRole('button', { name: 'French shield' })).toBeNull();
    fireEvent.click(within(mobileToolRail).getByRole('button', { name: 'Objects' }));
    expect(within(drawer).getByRole('button', { name: 'Add charge: Castle Tower' })).toBeDefined();
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
    fireEvent.click(getDesktopToolTreeItem('Background'));

    expect(document.activeElement).toBe(within(getDesktopPanel('Colors')).getByRole('region', { name: 'Background Color' }));
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
    expect(workbenchStyles).toContain('grid-template-rows: auto minmax(34rem, 1fr) auto;');
    expect(workbenchStyles).toContain('grid-template-rows: auto minmax(29rem, 1fr) auto;');
  });

  it('reserves the fullscreen workbench rows for navigation', () => {
    const workbenchStyles = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8');

    expect(workbenchStyles).toContain('.coat-target-workbench {\n');
    expect(workbenchStyles).toContain('display: grid;\n  grid-template-rows: auto minmax(0, 1fr);');
    expect(workbenchStyles).toContain('.coat-target-workbench .coat-workbench-content {\n  height: auto;\n  min-height: 0;\n  grid-template-rows: auto minmax(0, 1fr);');
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
    const desktopTools = screen.getByRole('complementary', { name: 'Desktop coat tools' });
    fireEvent.click(within(desktopTools).getByRole('button', { name: /Instagram Story/ }));

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
    expect(screen.queryByRole('button', { name: '打开本地项目库' })).toBeNull();
    expect(screen.queryByRole('dialog', { name: '本地项目' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '导出' }));
    expect(screen.getByRole('button', { name: '下载 PNG' })).toBeDefined();
    expect(screen.getByRole('button', { name: '分享' })).toBeDefined();
    expect(screen.getByRole('button', { name: '打印' })).toBeDefined();
    expect(screen.queryByRole('button', { name: '关闭导出菜单' })).toBeNull();
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
    fireEvent.click(getDesktopToolTreeItem('Random'));
    fireEvent.click(screen.getByRole('button', { name: 'Create Random Coat of Arms' }));

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
    expectWorkbenchProjectNameToBeNonHeading('Recovered draft');
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
    expectWorkbenchProjectNameToBeNonHeading('English recovery draft');
  });

  it('does not mistake the active session draft for a recovery candidate after remount', () => {
    const activeProject = { ...createDefaultProject('en'), id: 'active-project', name: 'Active session project' };
    useCoatProjectStore.getState().replaceProject(activeProject);

    render(<CoatOfArmsMaker locale="en" />);

    expect(screen.queryByRole('status', { name: 'Draft available' })).toBeNull();
    expectWorkbenchProjectNameToBeNonHeading('Active session project');
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
    expectWorkbenchProjectNameToBeNonHeading('我的徽章');
  });

  it('creates the Chinese default project when the untouched initial store first mounts in Chinese', () => {
    render(<CoatOfArmsMaker locale="zh" />);

    expectWorkbenchProjectNameToBeNonHeading('我的徽章');
    expect(useCoatProjectStore.getState().project).toMatchObject({
      locale: 'zh',
      name: '我的徽章',
    });
  });

  it('preserves an existing edited project when the Maker mounts in another locale', () => {
    const editedProject = { ...createDefaultProject('en'), name: 'Keep these arms' };
    useCoatProjectStore.getState().replaceProject(editedProject);

    render(<CoatOfArmsMaker locale="zh" />);

    expectWorkbenchProjectNameToBeNonHeading('Keep these arms');
    expect(useCoatProjectStore.getState().project).toMatchObject({
      id: editedProject.id,
      locale: 'en',
      name: 'Keep these arms',
    });
  });

});
