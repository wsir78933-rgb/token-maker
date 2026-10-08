'use client';

import { CalendarCreatorDayInspector } from './CalendarCreatorDayInspector';
import { CalendarCreatorGrid } from './CalendarCreatorGrid';
import { CalendarCreatorGuardDialog } from './CalendarCreatorGuardDialog';
import { CalendarCreatorPrintView } from './CalendarCreatorPrintView';
import { CalendarCreatorQuickStart } from './CalendarCreatorQuickStart';
import { CalendarCreatorSaveSlotsDialog } from './CalendarCreatorSaveSlotsDialog';
import { CalendarCreatorSettings } from './CalendarCreatorSettings';
import { CalendarCreatorToolbar } from './CalendarCreatorToolbar';
import styles from './CalendarCreatorWorkbench.module.css';
import { useCalendarCreator } from './useCalendarCreator';
import type { SiteLocale } from '@/lib/site-locale';

export type CalendarCreatorWorkbenchProps = {
  locale: SiteLocale;
};

function HelpPanel({
  locale,
  copy,
  onClose,
}: {
  locale: SiteLocale;
  copy: ReturnType<typeof import('@/lib/calendar-creator/copy').getCalendarCreatorCopy>;
  onClose: () => void;
}) {
  return (
    <aside className="calendar-creator-help" data-calendar-screen-only aria-label={copy.help}>
      <div>
        <h2>{copy.help}</h2>
        <p>{copy.description}</p>
        <p>{copy.localNotice}</p>
      </div>
      <button type="button" onClick={onClose}>
        {copy.close}
      </button>
      <span className="sr-only">{locale}</span>
    </aside>
  );
}

export function CalendarCreatorWorkbench({ locale }: CalendarCreatorWorkbenchProps) {
  const state = useCalendarCreator(locale);
  const {
    copy,
    calendarDocument,
    boundSlot,
    dirty,
    selectedDayIds,
    activeDayId,
    undoMarker,
    mobileMultiSelect,
    settingsOpen,
    returnSettingsOpen,
    helpOpen,
    saveDialogOpen,
    saveDialogMode,
    saveSlots,
    guardOpen,
    protectedSourceSlot,
    yearInput,
    visibleMonthIndex,
    actionError,
    actionErrorKind,
    statusMessage,
    guardTitle,
    guardDescription,
    guardContinueLabel,
    setSettingsOpen,
    setHelpOpen,
    setYearInput,
    handleCreateCalendar,
    handleReturnToSettings,
    handleResumeCalendar,
    handleApplySettings,
    handleYearInputCommit,
    handleYearChange,
    handleToggleDay,
    handleToggleMultiSelect,
    handleEditDay,
    handleCloseDayInspector,
    handleClearSelection,
    handleApplyIcon,
    handleUndo,
    handleChangeNote,
    handlePrint,
    handleSelectMonth,
    handleCreateNew,
    handleSaveCurrent,
    handleOpenArchives,
    handleLoadSlot,
    handleSaveSlot,
    handleGuardSaveContinue,
    handleGuardDiscard,
    handleGuardCancel,
    handleGuardOpenChange,
    handleSaveDialogOpenChange,
  } = state;

  return (
    <section
      className={styles.workbench}
      lang={locale}
      data-testid="calendar-creator-workbench"
      aria-label={copy.title}
    >
      {calendarDocument === null || returnSettingsOpen ? (
        <div className="calendar-creator-quick-start-shell">
          <CalendarCreatorQuickStart
            locale={locale}
            onCreate={handleCreateCalendar}
            onOpenHelp={() => setHelpOpen(true)}
            initialSettings={returnSettingsOpen && calendarDocument !== null ? calendarDocument.settings : undefined}
            onReturnToCalendar={returnSettingsOpen ? handleResumeCalendar : undefined}
            onOpenArchives={returnSettingsOpen ? undefined : handleOpenArchives}
          />
        </div>
      ) : (
        <>
          <CalendarCreatorToolbar
            copy={copy}
            document={calendarDocument}
            boundSlot={boundSlot}
            dirty={dirty}
            yearInput={yearInput}
            onYearInputChange={setYearInput}
            onYearInputCommit={handleYearInputCommit}
            onYearChange={handleYearChange}
            onOpenSettings={() => setSettingsOpen(true)}
            onSave={handleSaveCurrent}
            onOpenArchives={handleOpenArchives}
            onPrint={handlePrint}
            onOpenHelp={() => setHelpOpen(true)}
            onCreateNew={handleCreateNew}
            onReturnToSettings={handleReturnToSettings}
            visibleMonthIndex={visibleMonthIndex}
            onSelectMonth={handleSelectMonth}
          />

          <div className="calendar-creator-mobile-actions" data-calendar-screen-only>
            <button
              type="button"
              aria-pressed={mobileMultiSelect}
              onClick={handleToggleMultiSelect}
            >
              {mobileMultiSelect ? copy.finishSelection : copy.multiSelect}
            </button>
            <span>
              {copy.selectedDates}: {selectedDayIds.length}
            </span>
          </div>

          {settingsOpen ? (
            <div className="calendar-creator-settings-panel" data-calendar-screen-only>
              <CalendarCreatorSettings
                locale={locale}
                settings={calendarDocument.settings}
                onApply={handleApplySettings}
                onClose={() => setSettingsOpen(false)}
              />
            </div>
          ) : null}

          {helpOpen ? (
            <HelpPanel locale={locale} copy={copy} onClose={() => setHelpOpen(false)} />
          ) : null}

          {actionError !== null ? (
            <p className="calendar-creator-action-error" role="alert" data-calendar-screen-only>
              {actionError}
            </p>
          ) : null}
          {statusMessage !== null ? (
            <p className="calendar-creator-action-status" role="status" aria-live="polite" data-calendar-screen-only>
              {statusMessage}
            </p>
          ) : null}

          <div
            className={`calendar-creator-editor-layout ${activeDayId === null ? 'calendar-creator-editor-layout--full' : ''}`}
          >
            <div className="calendar-creator-grid-panel">
              <CalendarCreatorGrid
                locale={locale}
                document={calendarDocument}
                visibleMonthIndex={visibleMonthIndex}
                selectedDayIds={selectedDayIds}
                activeDayId={activeDayId}
                mobileMultiSelect={mobileMultiSelect}
                onEditDay={handleEditDay}
                onToggleDay={handleToggleDay}
              />
            </div>

            {activeDayId !== null ? (
              <aside className="calendar-creator-inspector-panel" data-calendar-screen-only>
                <CalendarCreatorDayInspector
                  locale={locale}
                  document={calendarDocument}
                  activeDayId={activeDayId}
                  selectedDayIds={selectedDayIds}
                  onChangeNote={handleChangeNote}
                  onApplyIcon={handleApplyIcon}
                  onClearSelection={handleClearSelection}
                  onUndo={handleUndo}
                  canUndo={undoMarker !== null}
                  onClose={handleCloseDayInspector}
                />
              </aside>
            ) : null}
          </div>

          <CalendarCreatorPrintView locale={locale} document={calendarDocument} />
        </>
      )}

      {helpOpen && (calendarDocument === null || returnSettingsOpen) ? (
        <HelpPanel locale={locale} copy={copy} onClose={() => setHelpOpen(false)} />
      ) : null}

      <CalendarCreatorSaveSlotsDialog
        copy={copy}
        open={saveDialogOpen}
        mode={saveDialogMode}
        slots={saveSlots}
        sourceSlot={boundSlot}
        errorKind={actionErrorKind}
        errorMessage={actionError}
        statusMessage={statusMessage}
        onOpenChange={handleSaveDialogOpenChange}
        onSave={handleSaveSlot}
        onLoad={handleLoadSlot}
      />

      <CalendarCreatorGuardDialog
        copy={copy}
        open={guardOpen}
        slots={saveSlots}
        sourceSlot={protectedSourceSlot}
        title={guardTitle}
        description={guardDescription}
        continueLabel={guardContinueLabel}
        actionError={actionError}
        actionErrorKind={actionErrorKind}
        onOpenChange={handleGuardOpenChange}
        onCancel={handleGuardCancel}
        onDiscard={handleGuardDiscard}
        onSaveContinue={handleGuardSaveContinue}
      />
    </section>
  );
}

export default CalendarCreatorWorkbench;
