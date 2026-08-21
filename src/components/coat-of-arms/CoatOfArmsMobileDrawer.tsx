'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import type { CoatLocale } from '@/lib/coat-of-arms/types';
import { ReferenceToolRail, type ReferenceToolTreeBranches } from './ReferenceToolRail';
import { getCoatWorkbenchCopy, type ReferenceToolId } from './workbench-copy';

const mobileDrawerId = 'coat-mobile-tool-drawer';

export interface CoatToolTab {
  id: ReferenceToolId;
  content: ReactNode;
}

interface CoatOfArmsMobileDrawerProps {
  activeToolId: ReferenceToolId;
  expandedToolIds?: readonly ReferenceToolId[];
  homeHref: string;
  locale: CoatLocale;
  onToolChildSelect?: (toolId: ReferenceToolId, childId: string) => void;
  onToolChange: (toolId: ReferenceToolId) => void;
  onToolExpansionChange?: (toolId: ReferenceToolId) => void;
  selectedToolChildren?: Partial<Record<ReferenceToolId, string>>;
  tabs: CoatToolTab[];
  treeBranches?: ReferenceToolTreeBranches;
}

/** A scene-first mobile drawer with roving tab focus and explicit dismissal. */
export function CoatOfArmsMobileDrawer({
  activeToolId,
  expandedToolIds,
  homeHref,
  locale,
  onToolChildSelect,
  onToolChange,
  onToolExpansionChange,
  selectedToolChildren,
  tabs,
  treeBranches,
}: CoatOfArmsMobileDrawerProps) {
  const copy = getCoatWorkbenchCopy(locale);
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const activeTab = tabs.find((tab) => tab.id === activeToolId) ?? tabs[0];
  const hasActiveToolBranch = (treeBranches?.[activeToolId]?.length ?? 0) > 0;
  const mobileExpandedToolIds = hasActiveToolBranch && expandedToolIds?.includes(activeToolId)
    ? [activeToolId]
    : [];

  useEffect(() => {
    if (open) toggleButtonRef.current?.focus();
  }, [open]);

  const closeDrawer = () => {
    setOpen(false);
    toggleButtonRef.current?.focus();
  };
  const openDrawer = () => {
    setHasOpened(true);
    setOpen(true);
  };

  const onDrawerKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDrawer();
    }
  };

  return (
    <div className="coat-workbench-mobile-drawer lg:hidden" data-open={open || undefined}>
      <ReferenceToolRail activeToolId={activeTab.id} collapseButtonLabel={open ? copy.closeTools : copy.shell.expandToolPanel} collapseButtonRef={toggleButtonRef} collapseControlsId={mobileDrawerId} expandedToolIds={mobileExpandedToolIds} homeHref={homeHref} idPrefix="mobile-coat" isCollapsed={!open} locale={locale} onCollapseChange={() => open ? closeDrawer() : openDrawer()} onToolChange={onToolChange} onToolChildSelect={onToolChildSelect} onToolExpansionChange={onToolExpansionChange} orientation="horizontal" selectedToolChildren={selectedToolChildren} treeBranches={treeBranches} />
      {activeTab ? <section hidden={!open} id={mobileDrawerId} aria-label={copy.tools} className="coat-workbench-mobile-sheet" onKeyDown={onDrawerKeyDown} role="region">
        {tabs.map((tab) => <div aria-labelledby={`mobile-coat-tab-${tab.id}`} hidden={!open || tab.id !== activeTab.id} id={`mobile-coat-panel-${tab.id}`} key={tab.id} role="tabpanel" tabIndex={0}>
          {hasOpened && tab.id === activeTab.id ? tab.content : null}
        </div>)}
      </section> : null}
    </div>
  );
}
