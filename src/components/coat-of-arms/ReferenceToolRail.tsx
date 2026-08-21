'use client';

import Link from 'next/link';
import { useRef, type KeyboardEvent, type RefObject } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { CoatLocale } from '@/lib/coat-of-arms/types';
import { CoatToolGlyph } from './CoatToolGlyph';
import { getCoatWorkbenchCopy, toolOrder, type ReferenceToolId } from './workbench-copy';

export interface ReferenceToolTreeChild {
  glyph?: ReferenceToolBranchGlyph;
  icon?: ReferenceToolTreeChildIcon;
  id: string;
  label: string;
}

export type ReferenceToolBranchGlyph = 'kite-shield' | 'heater-shield' | 'french-shield' | 'banner-shield' | 'round-shield' | 'lozenge-shield';
export type ReferenceToolTreeChildIcon = 'arrange' | 'layers' | 'used' | 'palettes' | 'custom-colours' | 'background';

export type ReferenceToolTreeBranches = Partial<Record<ReferenceToolId, readonly ReferenceToolTreeChild[]>>;

interface ReferenceToolRailProps {
  collapseControlsId?: string;
  activeToolId: ReferenceToolId;
  collapseButtonLabel?: string;
  collapseButtonRef?: RefObject<HTMLButtonElement | null>;
  idPrefix?: string;
  isCollapsed?: boolean;
  locale: CoatLocale;
  homeHref: string;
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
  homeHref,
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
    <nav aria-label={copy.toolRailLabel} className="coat-target-tool-tree">
      <div aria-label={copy.toolRailLabel} aria-orientation={orientation} className="coat-target-tool-tree-tabs" role="tablist">
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
              {branch.map((child) => <button aria-pressed={selectedToolChildren[toolId] === child.id} key={child.id} type="button" onClick={() => onToolChildSelect?.(toolId, child.id)}>{child.glyph ? <ShieldBranchGlyph glyph={child.glyph} /> : null}{child.icon ? <PositionSectionGlyph icon={child.icon} /> : null}{child.label}</button>)}
            </div> : null}
          </div>;
        })}
      </div>
      <Link className="coat-target-tool-tree-navigation" href={homeHref} prefetch={false} rel="noopener noreferrer" target="_blank">
        <CoatToolGlyph toolId="tokens" />
        <span>{copy.navigationItems.tokens}</span>
      </Link>
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

function PositionSectionGlyph({ icon }: { icon: ReferenceToolTreeChildIcon }) {
  if (icon === 'arrange') return <svg aria-hidden="true" data-branch-glyph={icon} data-icon-style="fill" viewBox="0 0 24 24"><path d="M12 2.4 18.2 10H5.8L12 2.4Zm0 19.2L5.8 14h12.4L12 21.6Z" /></svg>;
  if (icon === 'layers') return <svg aria-hidden="true" data-branch-glyph={icon} data-icon-style="fill" viewBox="0 0 24 24"><path d="M6.5 4h13v3.6h-13V4Zm-1.7 5.2h13v3.6h-13V9.2ZM3 14.4h13v3.6H3v-3.6Z" /></svg>;
  if (icon === 'used') return <svg aria-hidden="true" data-branch-glyph={icon} data-icon-style="stroke" viewBox="0 0 24 24"><path d="M11 17a4 4 0 0 1-8 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2Z" /><path d="M16.7 13H19a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H7" /><path d="M7 17h.01" /><path d="m11 8 2.3-2.3a2.4 2.4 0 0 1 3.404.004L18.6 7.6a2.4 2.4 0 0 1 .026 3.434L9.9 19.8" /></svg>;
  if (icon === 'palettes') return <svg aria-hidden="true" data-branch-glyph={icon} data-icon-style="fill" viewBox="0 0 512 512"><path d="M256 64C150.401 64 64 150.401 64 256c0 105.604 86.401 192 192 192 18.136 0 32-13.864 32-32 0-8.531-3.198-16-8.531-21.333-5.333-5.334-8.531-12.803-8.531-21.334 0-18.135 13.864-32 32-32h38.396c58.667 0 106.667-48 106.667-106.666C448 140.802 361.604 64 256 64zM138.667 256c-18.136 0-32-13.864-32-32s13.864-32 32-32c18.135 0 32 13.864 32 32s-13.865 32-32 32zm64-85.333c-18.136 0-32-13.865-32-32 0-18.136 13.864-32 32-32 18.135 0 32 13.864 32 32 0 18.135-13.865 32-32 32zm106.666 0c-18.135 0-32-13.865-32-32 0-18.136 13.865-32 32-32 18.136 0 32 13.864 32 32 0 18.135-13.864 32-32 32zm64 85.333c-18.135 0-32-13.864-32-32s13.865-32 32-32c18.136 0 32 13.864 32 32s-13.864 32-32 32z" /></svg>;
  if (icon === 'custom-colours') return <svg aria-hidden="true" data-branch-glyph={icon} data-icon-style="stroke" viewBox="0 0 24 24"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" /><circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /></svg>;
  if (icon === 'background') return <svg aria-hidden="true" data-branch-glyph={icon} data-icon-style="fill" viewBox="0 0 24 24"><path d="M4 3h16a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm2 9h6a1 1 0 0 1 1 1v3h1v6h-4v-6h1v-2H5a1 1 0 0 1-1-1v-2h2v1zm11.732 1.732 1.768-1.768 1.768 1.768a2.5 2.5 0 1 1-3.536 0z" /></svg>;
  throw new Error(`Invalid tree child icon: ${String(icon)}`);
}
