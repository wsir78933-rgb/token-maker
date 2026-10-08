'use client';

import {
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import Image from 'next/image';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

import { getCalendarCreatorCopy } from '@/lib/calendar-creator/copy';
import {
  getCalendarIcon,
  getCalendarIconLabel,
} from '@/lib/calendar-creator/icons';
import type {
  CalendarDay,
  CalendarDocument,
  CalendarIconId,
} from '@/lib/calendar-creator/types';
import type { SiteLocale } from '@/lib/site-locale';

import { CalendarCreatorIconPicker } from './CalendarCreatorIconPicker';
import styles from './CalendarCreatorDayInspector.module.css';

export type CalendarCreatorDayInspectorProps = {
  locale: SiteLocale;
  document: CalendarDocument;
  activeDayId: number | null;
  selectedDayIds: readonly number[];
  onChangeNote: (dayOfYear: number, note: string) => void;
  onApplyIcon: (iconId: CalendarIconId | null) => void;
  onClearSelection: () => void;
  onUndo: () => void;
  canUndo: boolean;
  onClose: () => void;
};

type InspectorTab = 'note' | 'batch';
type InspectorTabElements = Record<InspectorTab, HTMLButtonElement | null>;

const INSPECTOR_TABS: readonly InspectorTab[] = ['note', 'batch'];

const MOBILE_VIEWPORT_QUERY = '(max-width: 767px)';

function subscribeToMobileViewport(onStoreChange: () => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => undefined;
  }

  const mobileQuery = window.matchMedia(MOBILE_VIEWPORT_QUERY);
  mobileQuery.addEventListener?.('change', onStoreChange);
  return () => mobileQuery.removeEventListener?.('change', onStoreChange);
}

function getMobileViewportSnapshot(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(MOBILE_VIEWPORT_QUERY).matches
    : false;
}

function getMobileViewportServerSnapshot(): boolean {
  return false;
}

function getKeyboardTargetTab(currentTab: InspectorTab, key: string): InspectorTab | null {
  const currentIndex = INSPECTOR_TABS.indexOf(currentTab);
  if (currentIndex < 0) {
    throw new Error(
      `Calendar inspector tab ${JSON.stringify(currentTab)} is not registered.`,
    );
  }

  if (key === 'Home') {
    return INSPECTOR_TABS[0];
  }

  if (key === 'End') {
    return INSPECTOR_TABS[INSPECTOR_TABS.length - 1];
  }

  if (key === 'ArrowLeft' || key === 'ArrowRight') {
    const direction = key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (currentIndex + direction + INSPECTOR_TABS.length) % INSPECTOR_TABS.length;
    return INSPECTOR_TABS[nextIndex];
  }

  return null;
}

function handleInspectorTabKeyDown(
  event: KeyboardEvent<HTMLButtonElement>,
  currentTab: InspectorTab,
  selectTab: (tab: InspectorTab) => void,
  tabElements: InspectorTabElements,
): void {
  const targetTab = getKeyboardTargetTab(currentTab, event.key);
  if (targetTab === null) {
    return;
  }

  event.preventDefault();
  selectTab(targetTab);
  tabElements[targetTab]?.focus();
}

function formatCalendarCopy(template: string, number: number): string {
  return template.replace('{number}', String(number));
}

function requireSelectedDayIds(selectedDayIds: readonly number[]): number[] {
  const checkedDayIds = [...selectedDayIds];
  const uniqueDayIds = new Set<number>();

  for (const dayId of checkedDayIds) {
    if (!Number.isSafeInteger(dayId) || dayId < 1) {
      throw new Error(
        `Calendar inspector selected day ids must be positive safe integers. Received ${JSON.stringify(dayId)}.`,
      );
    }

    if (uniqueDayIds.has(dayId)) {
      throw new Error(
        `Calendar inspector selected day ids must be unique. Received duplicate ${String(dayId)}.`,
      );
    }

    uniqueDayIds.add(dayId);
  }

  return checkedDayIds;
}

function findActiveDay(
  document: CalendarDocument,
  activeDayId: number | null,
): CalendarDay | null {
  if (activeDayId === null) {
    return null;
  }

  if (!Number.isSafeInteger(activeDayId) || activeDayId < 1) {
    throw new Error(
      `Calendar inspector active day id must be a positive safe integer or null. Received ${JSON.stringify(activeDayId)}.`,
    );
  }

  const activeDay = document.days.find((day) => day.dayOfYear === activeDayId);
  if (activeDay === undefined) {
    throw new Error(
      `Calendar inspector active day ${String(activeDayId)} was not found in the calendar document.`,
    );
  }

  return activeDay;
}

function getMonthDisplayName(
  document: CalendarDocument,
  day: CalendarDay,
  monthFallback: string,
): string {
  const month = document.settings.months[day.monthIndex];
  if (month === undefined) {
    throw new Error(
      `Calendar inspector day ${String(day.dayOfYear)} references missing month index ${String(day.monthIndex)}.`,
    );
  }

  return month.name.trim() || formatCalendarCopy(monthFallback, day.monthIndex + 1);
}

function getAutomaticLayerIds(day: CalendarDay): CalendarIconId[] {
  const automaticIconIds: CalendarIconId[] = [];

  for (const iconId of Object.values(day.moonIcons)) {
    if (iconId !== null) {
      automaticIconIds.push(iconId);
    }
  }

  if (day.disasterIconId !== null) {
    automaticIconIds.push(day.disasterIconId);
  }

  return automaticIconIds;
}

function getAutomaticLayerLabel(locale: SiteLocale, iconId: CalendarIconId): string {
  return getCalendarIconLabel(iconId, locale);
}

function getAutomaticLayerSource(iconId: CalendarIconId): string {
  const icon = getCalendarIcon(iconId);
  if (typeof icon.src !== 'string' || icon.src.trim() === '') {
    throw new Error(
      `Calendar automatic icon ${String(iconId)} must expose a non-empty image source. Received ${JSON.stringify(icon.src)}.`,
    );
  }

  return icon.src;
}

function getDayHeading(
  copy: ReturnType<typeof getCalendarCreatorCopy>,
  document: CalendarDocument,
  day: CalendarDay,
): string {
  return `${copy.day} ${String(day.dayOfYear)} · ${getMonthDisplayName(document, day, copy.monthFallback)}`;
}

function handleNoteChange(
  event: ChangeEvent<HTMLTextAreaElement>,
  day: CalendarDay,
  onChangeNote: CalendarCreatorDayInspectorProps['onChangeNote'],
): void {
  onChangeNote(day.dayOfYear, event.currentTarget.value);
}

export function CalendarCreatorDayInspector({
  locale,
  document,
  activeDayId,
  selectedDayIds,
  onChangeNote,
  onApplyIcon,
  onClearSelection,
  onUndo,
  canUndo,
  onClose,
}: CalendarCreatorDayInspectorProps) {
  if (typeof onChangeNote !== 'function') {
    throw new Error('Calendar day inspector onChangeNote must be a function.');
  }

  if (typeof onApplyIcon !== 'function') {
    throw new Error('Calendar day inspector onApplyIcon must be a function.');
  }

  if (typeof onClearSelection !== 'function') {
    throw new Error('Calendar day inspector onClearSelection must be a function.');
  }

  if (typeof onUndo !== 'function') {
    throw new Error('Calendar day inspector onUndo must be a function.');
  }

  if (typeof onClose !== 'function') {
    throw new Error('Calendar day inspector onClose must be a function.');
  }

  const checkedDayIds = requireSelectedDayIds(selectedDayIds);
  const activeDay = findActiveDay(document, activeDayId);
  const copy = getCalendarCreatorCopy(locale);
  const [activeTab, setActiveTab] = useState<InspectorTab | null>(null);
  const tabElements = useRef<InspectorTabElements>({ note: null, batch: null });
  const tabsId = useId();
  const noteTabId = `${tabsId}-note-tab`;
  const batchTabId = `${tabsId}-batch-tab`;
  const notePanelId = `${tabsId}-note`;
  const batchPanelId = `${tabsId}-batch`;
  const isBatchAvailable = checkedDayIds.length > 1;
  const visibleTab: InspectorTab = isBatchAvailable ? (activeTab ?? 'batch') : 'note';
  const heading = activeDay === null ? copy.dayNotes : getDayHeading(copy, document, activeDay);

  const isMobileViewport = useSyncExternalStore(
    subscribeToMobileViewport,
    getMobileViewportSnapshot,
    getMobileViewportServerSnapshot,
  );

  const inspectorPanel = (
    <aside
      className={`${styles.inspector} ${isMobileViewport ? styles.mobileInspector : ''}`}
      data-testid="calendar-creator-day-inspector"
      aria-label={copy.dayNotes}
    >
      <div className={styles.header}>
        <div className={styles.headingGroup}>
          <p className={styles.eyebrow}>{copy.editDayHint}</p>
          <h2 className={styles.heading}>{heading}</h2>
          {isBatchAvailable ? (
            <p className={styles.selectionSummary}>
              {copy.selectedDates}: {checkedDayIds.length}
            </p>
          ) : null}
        </div>
        <button
          className={styles.closeButton}
          type="button"
          onClick={onClose}
          aria-label={copy.close}
        >
          ×
        </button>
      </div>

      {activeDay === null ? (
        <div className={styles.emptyState} role="status">
          {copy.noSelection}
        </div>
      ) : (
        <>
          {isBatchAvailable ? (
            <div
              className={styles.tabs}
              role="tablist"
              aria-label={copy.editDayHint}
              aria-orientation="horizontal"
            >
              <button
                id={noteTabId}
                type="button"
                role="tab"
                aria-selected={visibleTab === 'note'}
                aria-controls={notePanelId}
                tabIndex={visibleTab === 'note' ? 0 : -1}
                ref={(element) => {
                  tabElements.current.note = element;
                }}
                className={`${styles.tab} ${visibleTab === 'note' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('note')}
                onKeyDown={(event) => handleInspectorTabKeyDown(
                  event,
                  'note',
                  setActiveTab,
                  tabElements.current,
                )}
              >
                {copy.dayNotes}
              </button>
              <button
                id={batchTabId}
                type="button"
                role="tab"
                aria-selected={visibleTab === 'batch'}
                aria-controls={batchPanelId}
                tabIndex={visibleTab === 'batch' ? 0 : -1}
                ref={(element) => {
                  tabElements.current.batch = element;
                }}
                className={`${styles.tab} ${visibleTab === 'batch' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('batch')}
                onKeyDown={(event) => handleInspectorTabKeyDown(
                  event,
                  'batch',
                  setActiveTab,
                  tabElements.current,
                )}
              >
                {copy.manualIcon} · {copy.multiSelect}
              </button>
            </div>
          ) : null}

          {visibleTab === 'note' ? (
            <div
              id={notePanelId}
              role={isBatchAvailable ? 'tabpanel' : undefined}
              aria-labelledby={isBatchAvailable ? noteTabId : undefined}
              className={styles.panel}
            >
              <label className={styles.fieldLabel} htmlFor={`${tabsId}-note-input`}>
                {copy.dayNotes}
              </label>
              <textarea
                id={`${tabsId}-note-input`}
                className={styles.noteInput}
                value={activeDay.note}
                onChange={(event) => handleNoteChange(event, activeDay, onChangeNote)}
                placeholder={copy.notePlaceholder}
                rows={6}
              />
              <p className={styles.fieldHint}>{copy.editDayHint}</p>
              {!isBatchAvailable ? (
                <section className={styles.manualPicker} aria-labelledby={`${tabsId}-manual-title`}>
                  <h3 className={styles.sectionTitle} id={`${tabsId}-manual-title`}>
                    {copy.manualIcon}
                  </h3>
                  <CalendarCreatorIconPicker
                    locale={locale}
                    onSelect={onApplyIcon}
                    selectedIconId={activeDay.manualIconId}
                  />
                </section>
              ) : null}
            </div>
          ) : (
            <div
              id={batchPanelId}
              role="tabpanel"
              aria-labelledby={batchTabId}
              className={styles.panel}
            >
              <div className={styles.batchActions}>
                <span className={styles.batchStatus} role="status">
                  {formatCalendarCopy(copy.batchApplied, checkedDayIds.length)}
                </span>
              </div>
              <CalendarCreatorIconPicker
                locale={locale}
                onSelect={onApplyIcon}
                selectedIconId={activeDay.manualIconId}
              />
            </div>
          )}

          <section className={styles.layers} aria-labelledby={`${tabsId}-layers-title`}>
            <h3 className={styles.sectionTitle} id={`${tabsId}-layers-title`}>
              {copy.automaticLayers}
            </h3>
            <div className={styles.layerList}>
              {getAutomaticLayerIds(activeDay).map((iconId, index) => {
                const label = getAutomaticLayerLabel(locale, iconId);
                return (
                  <div className={styles.layer} key={`${iconId}-${index}`}>
                    <Image
                      src={getAutomaticLayerSource(iconId)}
                      alt=""
                      width={24}
                      height={24}
                    />
                    <span>{label}</span>
                  </div>
                );
              })}
              {getAutomaticLayerIds(activeDay).length === 0 ? (
                <span className={styles.emptyLayer}>{copy.advancedOffHint}</span>
              ) : null}
            </div>
          </section>

          <div className={styles.footerActions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => onApplyIcon(null)}
            >
              {copy.clearManual}
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={onUndo}
              disabled={!canUndo}
              title={canUndo ? copy.undoMarker : copy.undoUnavailable}
            >
              {copy.undoMarker}
            </button>
            {isBatchAvailable ? (
              <button
                type="button"
                className={styles.primaryButton}
                onClick={onClearSelection}
              >
                {copy.clearSelection}
              </button>
            ) : null}
          </div>
        </>
      )}
    </aside>
  );

  if (!isMobileViewport) {
    return inspectorPanel;
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className={styles.mobileDialog} data-calendar-screen-only>
        <DialogTitle className="sr-only">{heading}</DialogTitle>
        <DialogDescription className="sr-only">{copy.editDayHint}</DialogDescription>
        <div className={styles.mobileDialogBody}>{inspectorPanel}</div>
      </DialogContent>
    </Dialog>
  );
}
