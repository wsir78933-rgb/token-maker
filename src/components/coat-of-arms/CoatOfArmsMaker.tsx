'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { BookOpen, Magnet, Maximize2, Minimize2, Redo2, Shuffle, Undo2, UsersRound } from 'lucide-react';
import { ContentSiteTopbar } from '@/components/site/ContentSiteTopbar';
import { getCoatAsset, getDefaultProjectName } from '@/lib/coat-of-arms/assets';
import type { ShieldReferenceCategory } from '@/lib/coat-of-arms/reference-catalog';
import { useEditorPreferencesStore } from '@/lib/coat-of-arms/editor-preferences-session';
import { hydrateLocalUploadBlobsForProject } from '@/lib/coat-of-arms/project-storage';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type { ChargeAssetCategory, CoatLocale, TopAssetCategory } from '@/lib/coat-of-arms/types';
import { getHomeCopy, getNavLabels, getSiteConfig } from '@/lib/site-content';
import { getLocalizedPath } from '@/lib/site-locale';
import { Button } from '@/components/ui/button';
import { ChargeAndOrdinaryPanel } from './ChargeAndOrdinaryPanel';
import { CoatOfArmsCanvas } from './CoatOfArmsCanvas';
import { CoatOfArmsMobileDrawer, type CoatToolTab } from './CoatOfArmsMobileDrawer';
import { ColorBackgroundPanel, type ColorPanelSection } from './ColorBackgroundPanel';
import { DrawPanel } from './DrawPanel';
import { ExportMenu } from './ExportMenu';
import { LayerPanel } from './LayerPanel';
import { NamePanel } from './NamePanel';
import { ArrangePanel } from './ArrangePanel';
import { ReferenceToolRail, type ReferenceToolBranchGlyph, type ReferenceToolTreeBranches } from './ReferenceToolRail';
import { SettingsPanel } from './SettingsPanel';
import { ShieldFieldPanel } from './ShieldFieldPanel';
import { SelectedElementColourStrip } from './SelectedElementColourStrip';
import { TargetShieldPalette } from './TargetShieldPalette';
import { TargetFlagPalette } from './TargetFlagPalette';
import { TextMottoPanel } from './TextMottoPanel';
import { TextSelectionToolbar } from './TextSelectionToolbar';
import { TopPanel } from './TopPanel';
import { UploadPanel } from './UploadPanel';
import { getCoatWorkbenchCopy, toolOrder, type CoatWorkbenchCopy, type ReferenceToolId } from './workbench-copy';

interface CoatOfArmsMakerProps {
  locale: CoatLocale;
}

type TargetToolId = ReferenceToolId;
type UtilityToolId = 'text' | 'draw' | 'random' | 'names';
type PositionSectionId = 'arrange' | 'layers';
type ChargesTreeChildId = ChargeAssetCategory | 'upload';
const DEFAULT_SCENE_ZOOM = 0.47;

const shieldTreeItems: readonly { assetId: ReferenceToolBranchGlyph }[] = [
  { assetId: 'kite-shield' },
  { assetId: 'heater-shield' },
  { assetId: 'french-shield' },
  { assetId: 'banner-shield' },
  { assetId: 'round-shield' },
  { assetId: 'lozenge-shield' },
];
const shieldCategoryByTreeAssetId: Readonly<Record<ReferenceToolBranchGlyph, ShieldReferenceCategory>> = {
  'kite-shield': 'shield',
  'heater-shield': 'heater',
  'french-shield': 'french',
  'banner-shield': 'banner',
  'round-shield': 'round',
  'lozenge-shield': 'lozenge',
};
const shieldTreeAssetIdByCategory: Readonly<Record<ShieldReferenceCategory, ReferenceToolBranchGlyph>> = {
  shield: 'kite-shield',
  heater: 'heater-shield',
  french: 'french-shield',
  banner: 'banner-shield',
  round: 'round-shield',
  lozenge: 'lozenge-shield',
};

function shieldTreeLabel(copy: CoatWorkbenchCopy, assetId: ReferenceToolBranchGlyph): string {
  const label = copy.panels.shieldTreeLabels[assetId];
  if (label.trim() === '') {
    throw new Error(`Empty shield tree label for assetId: ${assetId}`);
  }
  return label;
}
const topAssetCategories: readonly TopAssetCategory[] = ['crown', 'mantle', 'supporter', 'other'];
const chargeAssetCategories: readonly ChargeAssetCategory[] = ['animal', 'object', 'plant', 'human', 'symbol'];
const utilityToolOrder: readonly UtilityToolId[] = ['text', 'draw', 'random', 'names'];

interface WorkbenchTool {
  id: TargetToolId;
  content: ReactNode;
}

/**
 * A focused application shell. The shell owns editor placement and
 * transient navigation only; all coat data remains in the existing store.
 */
export function CoatOfArmsMaker({ locale }: CoatOfArmsMakerProps) {
  const copy = getCoatWorkbenchCopy(locale);
  const homeCopy = getHomeCopy(locale);
  const siteConfig = getSiteConfig(locale);
  const navLabels = getNavLabels(locale);
  const nextLocale = locale === 'en' ? 'zh' : 'en';
  const homeHref = getLocalizedPath(locale, '/');
  const siteNavigationLinks = [
    { href: homeHref, label: navLabels.editor, isActive: false },
    { href: getLocalizedPath(locale, '/dice-roller-dnd'), label: navLabels.diceRoller, isActive: false },
    { href: getLocalizedPath(locale, '/coat-of-arms-maker'), label: navLabels.coatMaker, isActive: true },
    { href: getLocalizedPath(locale, '/contact'), label: navLabels.contact, isActive: false },
    { href: getLocalizedPath(locale, '/blog'), label: navLabels.blog, isActive: false },
  ];
  const appearance = useEditorPreferencesStore((state) => state.preferences.appearance);
  const project = useCoatProjectStore((state) => state.project);
  const selectedLayerIds = useCoatProjectStore((state) => state.selectedLayerIds);
  const canUndo = useCoatProjectStore((state) => state.history.past.length > 0);
  const canRedo = useCoatProjectStore((state) => state.history.future.length > 0);
  const isInitialDocument = useCoatProjectStore((state) => state.isInitialDocument);
  const undo = useCoatProjectStore((state) => state.undo);
  const redo = useCoatProjectStore((state) => state.redo);
  const randomizeProject = useCoatProjectStore((state) => state.randomizeProject);
  const initializeShowcaseProject = useCoatProjectStore((state) => state.initializeShowcaseProject);
  const replaceProject = useCoatProjectStore((state) => state.replaceProject);
  const inspectDraft = useCoatProjectStore((state) => state.inspectDraft);
  const discardDraft = useCoatProjectStore((state) => state.discardDraft);
  const [activeToolId, setActiveToolId] = useState<TargetToolId>('shields');
  const [activeUtilityId, setActiveUtilityId] = useState<UtilityToolId>('text');
  const [selectedPositionSection, setSelectedPositionSection] = useState<PositionSectionId>('arrange');
  const [expandedToolIds, setExpandedToolIds] = useState<TargetToolId[]>(['shields']);
  const [selectedShieldTreeAssetId, setSelectedShieldTreeAssetId] = useState<ReferenceToolBranchGlyph>('heater-shield');
  const [selectedChargesTreeChild, setSelectedChargesTreeChild] = useState<ChargesTreeChildId>('animal');
  const [selectedTopCategory, setSelectedTopCategory] = useState<TopAssetCategory>('crown');
  const [selectedColorSection, setSelectedColorSection] = useState<ColorPanelSection>('used-colours');
  const [isDraftDismissed, setIsDraftDismissed] = useState(false);
  const [isMultiSelectEnabled, setIsMultiSelectEnabled] = useState(false);
  const [isSnappingEnabled, setIsSnappingEnabled] = useState(true);
  const [isToolPanelCollapsed, setIsToolPanelCollapsed] = useState(false);
  const [sceneZoom, setSceneZoom] = useState(DEFAULT_SCENE_ZOOM);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenError, setFullscreenError] = useState<string | null>(null);
  const [storedPreferencesError, setStoredPreferencesError] = useState<string | null>(null);
  const [draftActionError, setDraftActionError] = useState<string | null>(null);
  const isRecoveryCheckComplete = useHydrationComplete();
  const workbenchRef = useRef<HTMLElement>(null);
  const utilityContent = getUtilityContent(activeUtilityId, locale, randomizeProject);
  const toolsById: Record<TargetToolId, WorkbenchTool> = {
    position: { id: 'position', content: getPositionSectionContent(selectedPositionSection, locale) },
    shields: { id: 'shields', content: <TargetShieldPalette activeCategory={shieldCategoryByTreeAssetId[selectedShieldTreeAssetId]} locale={locale} onActiveCategoryChange={(category) => setSelectedShieldTreeAssetId(shieldTreeAssetIdByCategory[category])} /> },
    custom: { id: 'custom', content: <ShieldFieldPanel locale={locale} /> },
    charges: { id: 'charges', content: selectedChargesTreeChild === 'upload'
      ? <UploadPanel locale={locale} />
      : <ChargeAndOrdinaryPanel locale={locale} selectedChargeCategory={selectedChargesTreeChild} selectedKind="charge" /> },
    top: { id: 'top', content: <TopPanel locale={locale} selectedCategory={selectedTopCategory} /> },
    colors: { id: 'colors', content: <ColorBackgroundPanel locale={locale} sectionToFocus={selectedColorSection} /> },
    tools: { id: 'tools', content: <TargetUtilityPanel locale={locale}>{utilityContent}</TargetUtilityPanel> },
    settings: { id: 'settings', content: <SettingsPanel locale={locale} /> },
    'how-to': { id: 'how-to', content: <HowToPanel locale={locale} /> },
    flags: { id: 'flags', content: <TargetFlagPalette locale={locale} /> },
  };
  const tools = toolOrder.map((toolId) => toolsById[toolId]);
  const activeTool = tools.find((tool) => tool.id === activeToolId) ?? tools[0];
  const localizedShieldTreeItems = shieldTreeItems.map((shape) => {
    const shieldAsset = getCoatAsset(shape.assetId);
    if (shieldAsset.kind !== 'shield') throw new Error(`Shield tree asset must be a shield: ${shape.assetId}`);
    return { ...shape, glyph: shape.assetId, label: shieldTreeLabel(copy, shape.assetId) };
  });
  const toolTreeBranches: ReferenceToolTreeBranches = {
    position: [
      { id: 'arrange', icon: 'arrange', label: copy.panels.arrange },
      { id: 'layers', icon: 'layers', label: copy.panels.layers },
    ],
    shields: localizedShieldTreeItems.map((shape) => ({ glyph: shape.glyph, id: shape.assetId, label: shape.label })),
    charges: [
      ...chargeAssetCategories.map((category) => ({ id: category, label: copy.panels.chargeCategories[category] })),
      { id: 'upload', label: copy.panels.chargesTreeUpload },
    ],
    top: topAssetCategories.map((category) => ({ id: category, label: copy.panels.topCategories[category] })),
    colors: [
      { id: 'used-colours', icon: 'used', label: copy.panels.colorTreeUsed },
      { id: 'palettes', icon: 'palettes', label: copy.panels.colorPalettes },
      { id: 'custom', icon: 'custom-colours', label: copy.panels.colorCustom },
      { id: 'background', icon: 'background', label: copy.panels.background },
    ],
    tools: utilityToolOrder.map((utilityId) => ({ id: utilityId, label: copy.utilityTabs[utilityId] })),
  };
  const mobileTools: CoatToolTab[] = tools.map(({ content, id }) => ({ content, id }));
  const selectedTextLayer = selectedLayerIds.length === 1
    ? project.layers.find((layer) => layer.id === selectedLayerIds[0] && layer.type === 'text')
    : undefined;
  const projectName = isInitialDocument ? getDefaultProjectName(locale) : project.name;
  const draftInspection = isRecoveryCheckComplete && isInitialDocument ? inspectDraft() : { status: 'missing' as const };
  const recoverableDraft = draftInspection.status === 'available' ? draftInspection.project : null;
  const isRecoveryCheckPending = isInitialDocument && !isRecoveryCheckComplete;
  const hasRecoverableDraft = !isDraftDismissed && recoverableDraft !== null;
  const invalidDraftError = !isDraftDismissed && draftInspection.status === 'invalid' ? draftInspection.error : null;
  const hasDraftRecoveryAction = hasRecoverableDraft || invalidDraftError !== null;
  const isWorkbenchBlocked = isRecoveryCheckPending || hasDraftRecoveryAction;

  useEffect(() => {
    try {
      readStoredEditorPreferences();
    } catch (caught) {
      setStoredPreferencesError(getCoatWorkbenchCopy(locale).panels.commandFailed(storedEditorPreferencesFailureMessage(caught)));
    }
  }, [locale]);

  useEffect(() => {
    const syncFullscreenState = () => {
      setIsFullscreen(document.fullscreenElement === workbenchRef.current);
      setFullscreenError(null);
    };
    document.addEventListener('fullscreenchange', syncFullscreenState);
    return () => document.removeEventListener('fullscreenchange', syncFullscreenState);
  }, []);

  useEffect(() => {
    if (!isRecoveryCheckComplete || hasDraftRecoveryAction) return;
    if (isInitialDocument) initializeShowcaseProject(locale);
  }, [hasDraftRecoveryAction, initializeShowcaseProject, isInitialDocument, isRecoveryCheckComplete, locale]);

  const restoreDraft = async () => {
    if (!recoverableDraft) return;
    try {
      if (recoverableDraft.uploads.some((upload) => upload.encoding === 'indexed-db')) {
        await hydrateLocalUploadBlobsForProject(recoverableDraft);
      }
      await replaceProject(recoverableDraft);
      setDraftActionError(null);
      setIsDraftDismissed(true);
    } catch (caught) {
      setDraftActionError(copy.panels.commandFailed(caught instanceof Error ? caught.message : String(caught)));
    }
  };
  const removeDraft = async () => {
    try {
      await discardDraft();
      setDraftActionError(null);
      setIsDraftDismissed(true);
      initializeShowcaseProject(locale);
    } catch (caught) {
      setDraftActionError(copy.panels.commandFailed(caught instanceof Error ? caught.message : String(caught)));
    }
  };
  const selectTool = (nextToolId: TargetToolId) => {
    setActiveToolId(nextToolId);
    if ((toolTreeBranches[nextToolId]?.length ?? 0) === 0) {
      setExpandedToolIds([]);
    }
  };
  const toggleToolExpansion = (toolId: TargetToolId) => {
    setExpandedToolIds((currentToolIds) => (
      currentToolIds.includes(toolId)
        ? currentToolIds.filter((currentToolId) => currentToolId !== toolId)
        : [...currentToolIds, toolId]
    ));
  };
  const toggleMobileToolExpansion = (toolId: TargetToolId) => {
    setExpandedToolIds((currentToolIds) => (
      currentToolIds.includes(toolId) ? [] : [toolId]
    ));
  };
  const toggleFullscreen = async () => {
    const workbench = workbenchRef.current;
    if (!workbench) {
      setFullscreenError(copy.shell.fullscreenRootMissing);
      return;
    }
    try {
      if (document.fullscreenElement) {
        if (typeof document.exitFullscreen !== 'function') throw new Error(copy.shell.fullscreenExitUnavailable);
        await document.exitFullscreen();
        return;
      }
      if (typeof workbench.requestFullscreen !== 'function') throw new Error(copy.shell.fullscreenUnavailable);
      await workbench.requestFullscreen();
    } catch (caught) {
      setFullscreenError(copy.shell.fullscreenOperationFailed(caught instanceof Error ? caught.message : String(caught)));
    }
  };
  const selectToolTreeChild = (toolId: TargetToolId, childId: string) => {
    if (toolId === 'position') {
      if (!isPositionSectionId(childId)) throw new Error(`Invalid tool tree position section: ${childId}`);
      setSelectedPositionSection(childId);
      setActiveToolId('position');
      return;
    }
    if (toolId === 'shields') {
      const shieldCategory = shieldCategoryByTreeAssetId[childId as ReferenceToolBranchGlyph];
      if (!shieldCategory) throw new Error(`Invalid shield tree category: ${childId}`);
      setSelectedShieldTreeAssetId(childId as ReferenceToolBranchGlyph);
      setActiveToolId('shields');
      return;
    }
    if (toolId === 'tools') {
      if (!isUtilityToolId(childId)) throw new Error(`Invalid tool tree utility child: ${childId}`);
      setActiveUtilityId(childId);
    }
    if (toolId === 'charges') {
      if (childId === 'upload') {
        setSelectedChargesTreeChild('upload');
      } else {
        if (!isChargeAssetCategory(childId)) throw new Error(`Invalid tool tree charge category: ${childId}`);
        setSelectedChargesTreeChild(childId);
      }
    }
    if (toolId === 'top') {
      if (!isTopAssetCategory(childId)) throw new Error(`Invalid tool tree top category: ${childId}`);
      setSelectedTopCategory(childId);
    }
    if (toolId === 'colors') {
      if (!isColorPanelSection(childId)) throw new Error(`Invalid tool tree colour section: ${childId}`);
      setSelectedColorSection(childId);
    }
    setActiveToolId(toolId);
  };
  const blockBackgroundPointerEvent = (event: MouseEvent<HTMLDivElement>) => {
    if (!isWorkbenchBlocked) return;
    event.preventDefault();
    event.stopPropagation();
  };
  const blockBackgroundKeyboardEvent = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isWorkbenchBlocked) return;
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <main id="coat-editor-workspace" aria-label={copy.workspace} className="coat-workbench coat-target-workbench" data-appearance={appearance} ref={workbenchRef}>
      <ContentSiteTopbar
        brandHref={homeHref + '#editor-workspace'}
        brandName={siteConfig.name}
        brandSubtitle={homeCopy.heroEyebrow}
        brandTitleClassName="text-base"
        contentClassName="mx-auto max-w-6xl px-4 py-0 sm:px-6 lg:px-8"
        localeSwitchHref={getLocalizedPath(nextLocale, '/coat-of-arms-maker')}
        localeSwitchLabel={navLabels.switchLocale}
        navClassName="mt-0 flex flex-wrap items-center gap-2"
        navLinks={siteNavigationLinks}
        topbarClassName="z-50"
      />
      {storedPreferencesError ? <p role="alert">{storedPreferencesError}</p> : null}
      <div
        aria-hidden={isWorkbenchBlocked || undefined}
        className="coat-workbench-content"
        inert={isWorkbenchBlocked}
        onClickCapture={blockBackgroundPointerEvent}
        onKeyDownCapture={blockBackgroundKeyboardEvent}
      >
        <span className="sr-only">{projectName}</span>
        <div className="coat-target-actionbar">
          <div className="coat-target-export coat-target-export-control"><ExportMenu locale={locale} menuId="coat-export-options" project={project} /></div>
        </div>
        <div className="coat-target-editor-grid" data-tool-panel-collapsed={isToolPanelCollapsed}>
          <aside aria-label={copy.desktopTools} className="coat-target-left-panel hidden lg:flex" data-collapsed={isToolPanelCollapsed}>
            <ReferenceToolRail activeToolId={activeTool.id} expandedToolIds={expandedToolIds} homeHref={homeHref} isCollapsed={isToolPanelCollapsed} locale={locale} onCollapseChange={() => setIsToolPanelCollapsed((value) => !value)} onToolChange={selectTool} onToolChildSelect={selectToolTreeChild} onToolExpansionChange={toggleToolExpansion} selectedToolChildren={{ charges: selectedChargesTreeChild, colors: selectedColorSection, position: selectedPositionSection, shields: selectedShieldTreeAssetId, tools: activeUtilityId, top: selectedTopCategory }} treeBranches={toolTreeBranches} />
            {tools.map((tool) => tool.id === activeTool.id ? <section aria-labelledby={`coat-tab-${tool.id}`} className="coat-target-library-panel" id={`coat-panel-${tool.id}`} key={tool.id} role="tabpanel" tabIndex={0}>
              {tool.content}
            </section> : <section aria-labelledby={`coat-tab-${tool.id}`} hidden id={`coat-panel-${tool.id}`} key={tool.id} role="tabpanel" tabIndex={0} />)}
          </aside>
          <section aria-label={copy.scene} className="coat-target-scene">
            <div className="coat-target-canvas-toolbar">
              <div className="coat-target-history-controls">
                <button aria-label={copy.undo} disabled={!canUndo} onClick={undo} type="button"><Undo2 /></button>
                <button aria-label={copy.redo} disabled={!canRedo} onClick={redo} type="button"><Redo2 /></button>
                <button aria-label={copy.shell.magnetSnapping} aria-pressed={isSnappingEnabled} onClick={() => setIsSnappingEnabled((value) => !value)} title={copy.shell.magnetSnapping} type="button"><Magnet aria-hidden="true" /></button>
              </div>
              {selectedTextLayer ? <TextSelectionToolbar locale={locale} /> : <SelectedElementColourStrip locale={locale} />}
              <div className="coat-target-canvas-toolbar-actions">
                {selectedTextLayer ? null : <>
                  <button aria-pressed={isMultiSelectEnabled} className="coat-target-multi-select" onClick={() => setIsMultiSelectEnabled((value) => !value)} type="button"><UsersRound />{copy.shell.multiSelect}</button>
                </>}
              </div>
            </div>
            <div className="coat-target-artboard-wrap">
              <div className="coat-target-artboard" style={{
                '--coat-canvas-aspect-ratio': `${project.canvas.width} / ${project.canvas.height}`,
                '--coat-scene-zoom-level': sceneZoom / DEFAULT_SCENE_ZOOM,
              } as React.CSSProperties}>
                <CoatOfArmsCanvas disabled={isRecoveryCheckPending || hasRecoverableDraft} locale={locale} multiSelectEnabled={isMultiSelectEnabled} snappingEnabled={isSnappingEnabled} />
              </div>
            </div>
            <div className="coat-target-zoom" aria-label={copy.shell.canvasZoom}>
              <input aria-label={copy.shell.canvasZoomPercentage} max="1" min="0.25" onChange={(event) => setSceneZoom(Number(event.target.value))} step="0.01" type="range" value={sceneZoom} />
              <output>{Math.round(sceneZoom * 100)} %</output>
              <button aria-label={isFullscreen ? copy.shell.exitFullscreen : copy.shell.enterFullscreen} onClick={() => void toggleFullscreen()} type="button">
                {isFullscreen ? <Minimize2 aria-hidden="true" /> : <Maximize2 aria-hidden="true" />}
              </button>
              {fullscreenError ? <p role="alert">{fullscreenError}</p> : null}
            </div>
          </section>
        </div>
        <CoatOfArmsMobileDrawer activeToolId={activeTool.id} expandedToolIds={expandedToolIds} homeHref={homeHref} locale={locale} onToolChange={selectTool} onToolChildSelect={selectToolTreeChild} onToolExpansionChange={toggleMobileToolExpansion} selectedToolChildren={{ charges: selectedChargesTreeChild, colors: selectedColorSection, position: selectedPositionSection, shields: selectedShieldTreeAssetId, tools: activeUtilityId, top: selectedTopCategory }} tabs={mobileTools} treeBranches={toolTreeBranches} />
      </div>
      {hasDraftRecoveryAction ? <section aria-label={copy.draftAvailable} className="coat-workbench-action-row coat-target-draft" role="status">
        {invalidDraftError ? <p role="alert">{copy.invalidDraftRecoveryDescription(invalidDraftError)}</p> : <p>{copy.draftRecoveryDescription}</p>}
        {draftActionError ? <p role="alert">{draftActionError}</p> : null}
        {hasRecoverableDraft ? <Button type="button" onClick={restoreDraft}>{copy.restoreDraft}</Button> : null}
        <Button type="button" variant="outline" onClick={removeDraft}>{copy.discardDraft}</Button>
      </section> : null}
    </main>
  );
}

function getPositionSectionContent(section: PositionSectionId, locale: CoatLocale): ReactNode {
  if (section === 'arrange') return <ArrangePanel locale={locale} />;
  if (section === 'layers') return <LayerPanel locale={locale} />;
  throw new Error(`Unexpected position section: ${section}`);
}

function getUtilityContent(activeUtilityId: UtilityToolId, locale: CoatLocale, onRandomizeProject: () => Promise<void>): ReactNode {
  if (activeUtilityId === 'text') return <TextMottoPanel locale={locale} />;
  if (activeUtilityId === 'draw') return <DrawPanel locale={locale} />;
  if (activeUtilityId === 'random') return <RandomPanel locale={locale} onRandomizeProject={onRandomizeProject} />;
  if (activeUtilityId === 'names') return <NamePanel locale={locale} />;
  throw new Error(`Unexpected utility tool id: ${activeUtilityId}`);
}

function TargetUtilityPanel({ children, locale }: { children: ReactNode; locale: CoatLocale }) {
  const copy = getCoatWorkbenchCopy(locale);
  return <section aria-label={copy.shell.editorUtilities} className="coat-target-utility-panel">{children}</section>;
}

function RandomPanel({ locale, onRandomizeProject }: { locale: CoatLocale; onRandomizeProject: () => Promise<void> }) {
  const copy = getCoatWorkbenchCopy(locale);
  const [randomizeError, setRandomizeError] = useState<string | null>(null);
  const randomizeCoat = async () => {
    try {
      await onRandomizeProject();
      setRandomizeError(null);
    } catch (caught) {
      setRandomizeError(copy.panels.commandFailed(caught instanceof Error ? caught.message : String(caught)));
    }
  };
  return (
    <section aria-label={copy.utilityTabs.random} className="coat-target-random-panel">
      <p>{copy.randomizeDescription}</p>
      <button className="coat-target-randomize" type="button" onClick={randomizeCoat}>
        <Shuffle aria-hidden="true" />
        <span>{copy.randomizeProject}</span>
      </button>
      {randomizeError ? <p role="alert">{randomizeError}</p> : null}
    </section>
  );
}

function HowToPanel({ locale }: { locale: CoatLocale }) {
  const copy = getCoatWorkbenchCopy(locale);
  return <section className="coat-target-howto" aria-label={copy.shell.howToPanel}>
    <BookOpen aria-hidden="true" />
    <h2>{copy.shell.howToHeading}</h2>
    <p>{copy.shell.howToDescription}</p>
  </section>;
}

function isUtilityToolId(value: string): value is UtilityToolId {
  return value === 'text' || value === 'draw' || value === 'random' || value === 'names';
}

function isPositionSectionId(value: string): value is PositionSectionId {
  return value === 'arrange' || value === 'layers';
}

function isTopAssetCategory(value: string): value is TopAssetCategory {
  return topAssetCategories.some((category) => category === value);
}

function isColorPanelSection(value: string): value is ColorPanelSection {
  return value === 'used-colours' || value === 'palettes' || value === 'custom' || value === 'background';
}

function isChargeAssetCategory(value: string): value is ChargeAssetCategory {
  return chargeAssetCategories.some((category) => category === value);
}

function readStoredEditorPreferences(): void {
  useEditorPreferencesStore.getState().loadFromBrowser();
}

function storedEditorPreferencesFailureMessage(caught: unknown): string {
  if (!(caught instanceof Error)) {
    throw new Error(`Invalid stored editor preferences: ${String(caught)}`);
  }
  return caught.message;
}

function useHydrationComplete(): boolean {
  return useSyncExternalStore(subscribeToHydration, getBrowserHydrationState, getServerHydrationState);
}

function subscribeToHydration() {
  return () => undefined;
}

function getBrowserHydrationState() {
  return true;
}

function getServerHydrationState() {
  return false;
}
