'use client';

import { useEffect, useId, useRef, useState, useSyncExternalStore, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { BookOpen, Link2, Maximize2, Minimize2, Redo2, Undo2, UsersRound } from 'lucide-react';
import { ContentSiteTopbar } from '@/components/site/ContentSiteTopbar';
import { getCoatAsset, getDefaultProjectName } from '@/lib/coat-of-arms/assets';
import type { ShieldReferenceCategory } from '@/lib/coat-of-arms/reference-catalog';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type { ChargeAssetCategory, CoatLocale, GeometryCoatAssetKind, TopAssetCategory } from '@/lib/coat-of-arms/types';
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
import { ProjectLibraryDialog } from './ProjectLibraryDialog';
import { ArrangePanel } from './ArrangePanel';
import { ReferenceToolRail, type ReferenceToolBranchGlyph, type ReferenceToolTreeBranches } from './ReferenceToolRail';
import { SettingsPanel } from './SettingsPanel';
import { ShieldFieldPanel } from './ShieldFieldPanel';
import { SelectedElementColourStrip } from './SelectedElementColourStrip';
import { TargetShieldPalette } from './TargetShieldPalette';
import { TargetFlagPalette } from './TargetFlagPalette';
import { TargetTokenPalette } from './TargetTokenPalette';
import { TextMottoPanel, type TextMottoDraft } from './TextMottoPanel';
import { TopPanel } from './TopPanel';
import { UploadPanel } from './UploadPanel';
import { getCoatWorkbenchCopy, toolOrder, type ReferenceToolId } from './workbench-copy';

interface CoatOfArmsMakerProps {
  locale: CoatLocale;
}

type TargetToolId = ReferenceToolId;
type UtilityToolId = 'text' | 'draw' | 'names' | 'upload' | 'layers';
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
const topAssetCategories: readonly TopAssetCategory[] = ['crown', 'mantle', 'supporter', 'other'];
const chargeAssetCategories: readonly ChargeAssetCategory[] = ['animal', 'object', 'plant', 'human', 'symbol'];
const utilityToolOrder: readonly UtilityToolId[] = ['text', 'draw', 'names', 'upload', 'layers'];

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
  const siteNavigationLinks = [
    { href: getLocalizedPath(locale, '/'), label: navLabels.editor, isActive: false },
    { href: getLocalizedPath(locale, '/dice-roller-dnd'), label: navLabels.diceRoller, isActive: false },
    { href: getLocalizedPath(locale, '/coat-of-arms-maker'), label: navLabels.coatMaker, isActive: true },
    { href: getLocalizedPath(locale, '/blog'), label: navLabels.blog, isActive: false },
  ];
  const project = useCoatProjectStore((state) => state.project);
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
  const [expandedToolIds, setExpandedToolIds] = useState<TargetToolId[]>(['shields']);
  const [selectedShieldTreeAssetId, setSelectedShieldTreeAssetId] = useState<ReferenceToolBranchGlyph>('heater-shield');
  const [selectedChargeCategory, setSelectedChargeCategory] = useState<ChargeAssetCategory>('animal');
  const [selectedChargeKind, setSelectedChargeKind] = useState<Extract<GeometryCoatAssetKind, 'charge' | 'ordinary'>>('charge');
  const [selectedTopCategory, setSelectedTopCategory] = useState<TopAssetCategory>('crown');
  const [selectedColorSection, setSelectedColorSection] = useState<ColorPanelSection>();
  const [textMottoDraft, setTextMottoDraft] = useState<TextMottoDraft | null>(null);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [isDraftDismissed, setIsDraftDismissed] = useState(false);
  const [isMultiSelectEnabled, setIsMultiSelectEnabled] = useState(false);
  const [isToolPanelCollapsed, setIsToolPanelCollapsed] = useState(false);
  const [sceneZoom, setSceneZoom] = useState(DEFAULT_SCENE_ZOOM);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenError, setFullscreenError] = useState<string | null>(null);
  const isRecoveryCheckComplete = useHydrationComplete();
  const workbenchRef = useRef<HTMLElement>(null);
  const projectTriggerRef = useRef<HTMLButtonElement>(null);
  const wasProjectsOpenRef = useRef(false);
  const utilityContent = getUtilityContent(activeUtilityId, locale, textMottoDraft, setTextMottoDraft);
  const toolsById: Record<TargetToolId, WorkbenchTool> = {
    position: { id: 'position', content: <ArrangePanel locale={locale} /> },
    shields: { id: 'shields', content: <TargetShieldPalette activeCategory={shieldCategoryByTreeAssetId[selectedShieldTreeAssetId]} locale={locale} onActiveCategoryChange={(category) => setSelectedShieldTreeAssetId(shieldTreeAssetIdByCategory[category])} /> },
    custom: { id: 'custom', content: <ShieldFieldPanel locale={locale} /> },
    charges: { id: 'charges', content: <ChargeAndOrdinaryPanel locale={locale} selectedChargeCategory={selectedChargeCategory} selectedKind={selectedChargeKind} /> },
    top: { id: 'top', content: <TopPanel locale={locale} selectedCategory={selectedTopCategory} /> },
    colors: { id: 'colors', content: <ColorBackgroundPanel locale={locale} sectionToFocus={selectedColorSection} /> },
    tools: { id: 'tools', content: <TargetUtilityPanel activeUtilityId={activeUtilityId} locale={locale} onRandomizeProject={randomizeProject} onUtilityChange={setActiveUtilityId}>{utilityContent}</TargetUtilityPanel> },
    settings: { id: 'settings', content: <SettingsPanel locale={locale} /> },
    'how-to': { id: 'how-to', content: <HowToPanel locale={locale} /> },
    flags: { id: 'flags', content: <TargetFlagPalette locale={locale} /> },
    tokens: { id: 'tokens', content: <TargetTokenPalette locale={locale} /> },
  };
  const tools = toolOrder.map((toolId) => toolsById[toolId]);
  const activeTool = tools.find((tool) => tool.id === activeToolId) ?? tools[0];
  const localizedShieldTreeItems = shieldTreeItems.map((shape) => {
    const shieldAsset = getCoatAsset(shape.assetId);
    if (shieldAsset.kind !== 'shield') throw new Error(`Shield tree asset must be a shield: ${shape.assetId}`);
    return { ...shape, glyph: shape.assetId, label: shieldAsset.name[locale] };
  });
  const toolTreeBranches: ReferenceToolTreeBranches = {
    position: [{ id: 'arrange', label: copy.panels.position }],
    shields: localizedShieldTreeItems.map((shape) => ({ glyph: shape.glyph, id: shape.assetId, label: shape.label })),
    charges: [
      ...chargeAssetCategories.map((category) => ({ id: category, label: copy.panels.chargeCategories[category] })),
      { id: 'ordinaries', label: copy.panels.ordinaries },
    ],
    top: topAssetCategories.map((category) => ({ id: category, label: copy.panels.topCategories[category] })),
    colors: [
      { id: 'used-colours', label: copy.panels.usedColours },
      { id: 'background', label: copy.panels.backgroundColour },
    ],
    tools: Object.entries(copy.utilityTabs).map(([id, label]) => ({ id, label })),
  };
  const mobileTools: CoatToolTab[] = tools.map(({ content, id }) => ({ content, id }));
  const projectName = isInitialDocument ? getDefaultProjectName(locale) : project.name;
  const draftInspection = isRecoveryCheckComplete && isInitialDocument ? inspectDraft() : { status: 'missing' as const };
  const recoverableDraft = draftInspection.status === 'available' ? draftInspection.project : null;
  const isRecoveryCheckPending = isInitialDocument && !isRecoveryCheckComplete;
  const hasRecoverableDraft = !isDraftDismissed && recoverableDraft !== null;
  const invalidDraftError = !isDraftDismissed && draftInspection.status === 'invalid' ? draftInspection.error : null;
  const hasDraftRecoveryAction = hasRecoverableDraft || invalidDraftError !== null;
  const isWorkbenchBlocked = projectsOpen || isRecoveryCheckPending || hasDraftRecoveryAction;

  useEffect(() => {
    if (wasProjectsOpenRef.current && !projectsOpen) projectTriggerRef.current?.focus();
    wasProjectsOpenRef.current = projectsOpen;
  }, [projectsOpen]);

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

  const restoreDraft = () => {
    if (!recoverableDraft) return;
    replaceProject(recoverableDraft);
    setIsDraftDismissed(true);
  };
  const removeDraft = () => {
    discardDraft();
    setIsDraftDismissed(true);
    initializeShowcaseProject(locale);
  };
  const selectTool = (nextToolId: TargetToolId) => {
    setActiveToolId(nextToolId);
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
      if (childId === 'ordinaries') {
        setSelectedChargeKind('ordinary');
      } else {
        if (!isChargeAssetCategory(childId)) throw new Error(`Invalid tool tree charge category: ${childId}`);
        setSelectedChargeKind('charge');
        setSelectedChargeCategory(childId);
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
    if (!isWorkbenchBlocked || isProjectLibraryModalInteractionEvent(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
  };
  const blockBackgroundKeyboardEvent = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isWorkbenchBlocked || isProjectLibraryModalInteractionEvent(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <main aria-label={copy.workspace} className="coat-workbench coat-target-workbench" ref={workbenchRef}>
      <ContentSiteTopbar
        brandHref={getLocalizedPath(locale, '/') + '#editor-workspace'}
        brandName={siteConfig.name}
        brandSubtitle={homeCopy.heroEyebrow}
        brandTitleClassName="text-base"
        contentClassName="mx-auto max-w-6xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8"
        localeSwitchHref={getLocalizedPath(nextLocale, '/coat-of-arms-maker')}
        localeSwitchLabel={navLabels.switchLocale}
        navClassName="mt-3 flex flex-wrap items-center gap-2 sm:mt-4"
        navLinks={siteNavigationLinks}
        topbarClassName="z-50"
      />
      <div
        aria-hidden={isWorkbenchBlocked || undefined}
        className="coat-workbench-content"
        inert={isWorkbenchBlocked}
        onClickCapture={blockBackgroundPointerEvent}
        onKeyDownCapture={blockBackgroundKeyboardEvent}
      >
        <span className="sr-only">{projectName}</span>
        <div className="coat-target-editor-grid" data-tool-panel-collapsed={isToolPanelCollapsed}>
          <aside aria-label={copy.desktopTools} className="coat-target-left-panel hidden lg:flex" data-collapsed={isToolPanelCollapsed}>
            <ReferenceToolRail activeToolId={activeTool.id} expandedToolIds={expandedToolIds} isCollapsed={isToolPanelCollapsed} locale={locale} onCollapseChange={() => setIsToolPanelCollapsed((value) => !value)} onToolChange={selectTool} onToolChildSelect={selectToolTreeChild} onToolExpansionChange={toggleToolExpansion} selectedToolChildren={{ charges: selectedChargeKind === 'ordinary' ? 'ordinaries' : selectedChargeCategory, colors: selectedColorSection, shields: selectedShieldTreeAssetId, tools: activeUtilityId, top: selectedTopCategory }} treeBranches={toolTreeBranches} />
            {tools.map((tool) => tool.id === activeTool.id ? <section aria-labelledby={`coat-tab-${tool.id}`} className="coat-target-library-panel" id={`coat-panel-${tool.id}`} key={tool.id} role="tabpanel" tabIndex={0}>
              {tool.content}
            </section> : <section aria-labelledby={`coat-tab-${tool.id}`} hidden id={`coat-panel-${tool.id}`} key={tool.id} role="tabpanel" tabIndex={0} />)}
          </aside>
          <section aria-label={copy.scene} className="coat-target-scene">
            <div className="coat-target-canvas-toolbar">
              <div>
                <button aria-label={copy.undo} disabled={!canUndo} onClick={undo} type="button"><Undo2 /></button>
                <button aria-label={copy.redo} disabled={!canRedo} onClick={redo} type="button"><Redo2 /></button>
                <button aria-label={copy.shell.openLocalProjectLibrary} className="coat-target-link-control" onClick={() => setProjectsOpen(true)} ref={projectTriggerRef} type="button"><Link2 /></button>
              </div>
              <SelectedElementColourStrip locale={locale} />
              <div className="coat-target-canvas-toolbar-actions">
                <div className="coat-target-export-control"><ExportMenu locale={locale} project={project} /></div>
                <button aria-pressed={isMultiSelectEnabled} className="coat-target-multi-select" onClick={() => setIsMultiSelectEnabled((value) => !value)} type="button"><UsersRound />{copy.shell.multiSelect}</button>
              </div>
            </div>
            <div className="coat-target-artboard-wrap">
              <div className="coat-target-artboard" style={{
                '--coat-canvas-aspect-ratio': `${project.canvas.width} / ${project.canvas.height}`,
                '--coat-scene-zoom-level': sceneZoom / DEFAULT_SCENE_ZOOM,
              } as React.CSSProperties}>
                <CoatOfArmsCanvas disabled={isRecoveryCheckPending || hasRecoverableDraft} locale={locale} multiSelectEnabled={isMultiSelectEnabled} />
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
        <CoatOfArmsMobileDrawer activeToolId={activeTool.id} expandedToolIds={expandedToolIds} locale={locale} onToolChange={selectTool} onToolChildSelect={selectToolTreeChild} onToolExpansionChange={toggleMobileToolExpansion} selectedToolChildren={{ charges: selectedChargeKind === 'ordinary' ? 'ordinaries' : selectedChargeCategory, colors: selectedColorSection, shields: selectedShieldTreeAssetId, tools: activeUtilityId, top: selectedTopCategory }} tabs={mobileTools} treeBranches={toolTreeBranches} />
        <ProjectLibraryDialog locale={locale} open={projectsOpen} project={project} portalHost={workbenchRef.current} renderTrigger={false} triggerRef={projectTriggerRef} onOpenChange={setProjectsOpen} onProjectChange={replaceProject} />
      </div>
      {hasDraftRecoveryAction ? <section aria-label={copy.draftAvailable} className="coat-workbench-action-row coat-target-draft" role="status">
        {invalidDraftError ? <p role="alert">{copy.invalidDraftRecoveryDescription(invalidDraftError)}</p> : <p>{copy.draftRecoveryDescription}</p>}
        {hasRecoverableDraft ? <Button type="button" onClick={restoreDraft}>{copy.restoreDraft}</Button> : null}
        <Button type="button" variant="outline" onClick={removeDraft}>{copy.discardDraft}</Button>
      </section> : null}
    </main>
  );
}

function getUtilityContent(activeUtilityId: UtilityToolId, locale: CoatLocale, textMottoDraft: TextMottoDraft | null, onTextMottoDraftChange: (draft: TextMottoDraft) => void): ReactNode {
  if (activeUtilityId === 'text') return <TextMottoPanel draft={textMottoDraft} locale={locale} onDraftChange={onTextMottoDraftChange} />;
  if (activeUtilityId === 'draw') return <DrawPanel locale={locale} />;
  if (activeUtilityId === 'names') return <NamePanel locale={locale} />;
  if (activeUtilityId === 'upload') return <UploadPanel locale={locale} />;
  return <LayerPanel locale={locale} />;
}

function TargetUtilityPanel({ activeUtilityId, children, locale, onRandomizeProject, onUtilityChange }: { activeUtilityId: UtilityToolId; children: ReactNode; locale: CoatLocale; onRandomizeProject?: () => void; onUtilityChange: (tool: UtilityToolId) => void }) {
  const copy = getCoatWorkbenchCopy(locale);
  const utilityPanelIdPrefix = useId();
  const utilityTabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const focusUtilityAt = (index: number) => {
    const nextUtilityId = utilityToolOrder[index];
    if (!nextUtilityId) return;
    onUtilityChange(nextUtilityId);
    utilityTabRefs.current[index]?.focus();
  };
  const onUtilityTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusUtilityAt((index + 1) % utilityToolOrder.length);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusUtilityAt((index - 1 + utilityToolOrder.length) % utilityToolOrder.length);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusUtilityAt(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusUtilityAt(utilityToolOrder.length - 1);
    }
  };
  return <section aria-label={copy.shell.editorUtilities} className="coat-target-utility-panel">
    <div aria-label={copy.shell.editorUtilities} role="tablist">{utilityToolOrder.map((tool, index) => <button aria-controls={`${utilityPanelIdPrefix}-utility-panel-${tool}`} aria-selected={activeUtilityId === tool} id={`${utilityPanelIdPrefix}-utility-tab-${tool}`} key={tool} ref={(element) => { utilityTabRefs.current[index] = element; }} role="tab" tabIndex={activeUtilityId === tool ? 0 : -1} type="button" onClick={() => onUtilityChange(tool)} onKeyDown={(event) => onUtilityTabKeyDown(event, index)}>{copy.utilityTabs[tool]}</button>)}</div>
    {utilityToolOrder.map((tool) => <div aria-labelledby={`${utilityPanelIdPrefix}-utility-tab-${tool}`} hidden={tool !== activeUtilityId} id={`${utilityPanelIdPrefix}-utility-panel-${tool}`} key={tool} role="tabpanel" tabIndex={0}>{tool === activeUtilityId ? children : null}</div>)}
    {onRandomizeProject ? <button className="coat-target-randomize" onClick={() => onRandomizeProject()} type="button">{copy.randomizeProject}</button> : null}
  </section>;
}

function HowToPanel({ locale }: { locale: CoatLocale }) {
  const copy = getCoatWorkbenchCopy(locale);
  return <section className="coat-target-howto" aria-label={copy.shell.howToPanel}>
    <BookOpen aria-hidden="true" />
    <h2>{copy.shell.howToHeading}</h2>
    <p>{copy.shell.howToDescription}</p>
  </section>;
}

function isProjectLibraryModalInteractionEvent(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest('[data-coat-project-library-modal-interaction]') !== null;
}

function isUtilityToolId(value: string): value is UtilityToolId {
  return value === 'text' || value === 'draw' || value === 'names' || value === 'upload' || value === 'layers';
}

function isTopAssetCategory(value: string): value is TopAssetCategory {
  return topAssetCategories.some((category) => category === value);
}

function isColorPanelSection(value: string): value is ColorPanelSection {
  return value === 'used-colours' || value === 'background';
}

function isChargeAssetCategory(value: string): value is ChargeAssetCategory {
  return chargeAssetCategories.some((category) => category === value);
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
