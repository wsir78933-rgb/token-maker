'use client';

import { useRef, type KeyboardEvent, type RefObject } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { CoatLocale } from '@/lib/coat-of-arms/types';
import { CoatToolGlyph } from './CoatToolGlyph';
import { getCoatWorkbenchCopy, toolOrder, type ReferenceToolId } from './workbench-copy';

export interface ReferenceToolTreeChild {
  glyph?: ReferenceToolBranchGlyph;
  id: string;
  label: string;
}

export type ReferenceToolBranchGlyph = 'kite-shield' | 'heater-shield' | 'french-shield' | 'banner-shield' | 'round-shield' | 'lozenge-shield';

export type ReferenceToolTreeBranches = Partial<Record<ReferenceToolId, readonly ReferenceToolTreeChild[]>>;

interface ReferenceToolRailProps {
  collapseControlsId?: string;
  activeToolId: ReferenceToolId;
  collapseButtonLabel?: string;
  collapseButtonRef?: RefObject<HTMLButtonElement | null>;
  idPrefix?: string;
  isCollapsed?: boolean;
  locale: CoatLocale;
  onToolChange: (toolId: ReferenceToolId) => void;
  onToolChildSelect?: (toolId: ReferenceToolId, childId: string) => void;
  onToolExpansionChange?: (toolId: ReferenceToolId) => void;
  onCollapseChange: () => void;
  orientation?: 'horizontal' | 'vertical';
  expandedToolIds?: readonly ReferenceToolId[];
  selectedToolChildren?: Partial<Record<ReferenceToolId, string>>;
  treeBranches?: ReferenceToolTreeBranches;
}

/** Accessible reference tool tabs. The parent owns the selected tool and panel. */
export function ReferenceToolRail({
  collapseControlsId,
  activeToolId,
  collapseButtonLabel,
  collapseButtonRef,
  idPrefix = 'coat',
  isCollapsed = false,
  locale,
  onCollapseChange,
  onToolChange,
  onToolChildSelect,
  onToolExpansionChange,
  orientation = 'vertical',
  expandedToolIds = [],
  selectedToolChildren = {},
  treeBranches = {},
}: ReferenceToolRailProps) {
  const copy = getCoatWorkbenchCopy(locale);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const hasExpandedBranch = toolOrder.some((toolId) => (
    (treeBranches[toolId]?.length ?? 0) > 0 && expandedToolIds.includes(toolId)
  ));

  const focusToolAt = (index: number) => {
    const nextToolId = toolOrder[index];
    if (!nextToolId) return;
    onToolChange(nextToolId);
    tabRefs.current[index]?.focus();
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const isForwardArrow = orientation === 'vertical' ? event.key === 'ArrowDown' : event.key === 'ArrowRight';
    const isBackwardArrow = orientation === 'vertical' ? event.key === 'ArrowUp' : event.key === 'ArrowLeft';

    if (isForwardArrow) {
      event.preventDefault();
      focusToolAt((index + 1) % toolOrder.length);
    } else if (isBackwardArrow) {
      event.preventDefault();
      focusToolAt((index - 1 + toolOrder.length) % toolOrder.length);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusToolAt(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusToolAt(toolOrder.length - 1);
    }
  };

  return <div className="coat-target-reference-rail" data-expanded-branch={hasExpandedBranch || undefined} data-orientation={orientation}>
    <nav aria-label={copy.toolRailLabel} aria-orientation={orientation} className="coat-target-tool-tree" role="tablist">
      {toolOrder.map((toolId, index) => {
        const branch = treeBranches[toolId] ?? [];
        const hasBranch = branch.length > 0;
        const isExpanded = expandedToolIds.includes(toolId);
        return <div className="coat-target-tool-tree-node" data-tool-id={toolId} key={toolId}>
          <button
            aria-controls={`${idPrefix}-panel-${toolId}`}
            aria-expanded={hasBranch ? isExpanded : undefined}
            aria-selected={toolId === activeToolId}
            id={`${idPrefix}-tab-${toolId}`}
            ref={(element) => { tabRefs.current[index] = element; }}
            role="tab"
            tabIndex={toolId === activeToolId ? 0 : -1}
            type="button"
            onClick={() => {
              onToolChange(toolId);
              if (hasBranch) onToolExpansionChange?.(toolId);
            }}
            onKeyDown={(event) => onTabKeyDown(event, index)}
          ><CoatToolGlyph toolId={toolId} /><span>{copy.toolTabs[toolId]}</span>{hasBranch ? isExpanded ? <ChevronDown aria-hidden="true" className="coat-target-tool-tree-toggle" /> : <ChevronRight aria-hidden="true" className="coat-target-tool-tree-toggle" /> : null}</button>
          {hasBranch && isExpanded ? <div aria-label={copy.toolTabs[toolId]} className="coat-target-tool-tree-branch" role="group">
            {branch.map((child) => <button aria-pressed={selectedToolChildren[toolId] === child.id} key={child.id} type="button" onClick={() => onToolChildSelect?.(toolId, child.id)}>{child.glyph ? <ShieldBranchGlyph glyph={child.glyph} /> : null}{child.label}</button>)}
          </div> : null}
        </div>;
      })}
    </nav>
    <button ref={collapseButtonRef} aria-controls={collapseControlsId} aria-expanded={!isCollapsed} aria-label={collapseButtonLabel ?? (isCollapsed ? copy.shell.expandToolPanel : copy.shell.collapseToolPanel)} className="coat-target-collapse" type="button" onClick={onCollapseChange}>{isCollapsed ? '›' : '‹'}</button>
  </div>;
}

function ShieldBranchGlyph({ glyph }: { glyph: ReferenceToolBranchGlyph }) {
  if (glyph === 'heater-shield') return <svg aria-hidden="true" data-branch-glyph={glyph} viewBox="0 0 24 24"><path d="M5 4h14v8c0 5-2.8 7.5-7 9-4.2-1.5-7-4-7-9V4Z" /></svg>;
  if (glyph === 'french-shield') return <svg aria-hidden="true" data-branch-glyph={glyph} viewBox="0 0 24 24"><path d="M5 4h14v9c0 4.6-2.8 6.5-7 8-4.2-1.5-7-3.4-7-8V4Z" /></svg>;
  if (glyph === 'banner-shield') return <svg aria-hidden="true" data-branch-glyph={glyph} viewBox="0 0 24 24"><path d="M6 4h12v11l-6 5-6-5V4Z" /></svg>;
  if (glyph === 'round-shield') return <svg aria-hidden="true" data-branch-glyph={glyph} viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /></svg>;
  if (glyph === 'lozenge-shield') return <svg aria-hidden="true" data-branch-glyph={glyph} viewBox="0 0 24 24"><path d="m12 3 8 9-8 9-8-9 8-9Z" /></svg>;
  return <svg aria-hidden="true" data-branch-glyph={glyph} viewBox="0 0 24 24"><path d="M5 5h14v10l-7 5-7-5V5Z" /></svg>;
}
