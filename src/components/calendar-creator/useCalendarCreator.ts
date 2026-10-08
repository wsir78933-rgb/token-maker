'use client';

import { useCallback, useMemo, useState } from 'react';

import {
  createCalendar,
  getAdjacentYearSettings,
} from '@/lib/calendar-creator/calendar';
import {
  applyCalendarManualIcon,
  toggleCalendarDaySelection,
  undoCalendarManualIcon,
  updateCalendarDayNote,
} from '@/lib/calendar-creator/editing';
import { getCalendarCreatorCopy } from '@/lib/calendar-creator/copy';
import {
  CalendarInputError,
  parseCalendarInteger,
} from '@/lib/calendar-creator/validation';
import {
  CalendarStorageError,
  loadCalendarSaveSlot,
  readCalendarSaveSlots,
  saveCalendarSaveSlot,
} from '@/lib/calendar-creator/storage';
import type {
  CalendarDocument,
  CalendarIconId,
  CalendarManualUndo,
  CalendarSaveRecord,
  CalendarSaveSlotNumber,
  CalendarSettings,
} from '@/lib/calendar-creator/types';
import type { SiteLocale } from '@/lib/site-locale';

type CalendarPendingAction =
  | { type: 'new' }
  | { type: 'settings'; settings: CalendarSettings }
  | { type: 'year'; settings: CalendarSettings }
  | { type: 'regenerate'; settings: CalendarSettings }
  | { type: 'load'; slotNumber: CalendarSaveSlotNumber };

export type CalendarCreatorSaveDialogMode = 'manage' | 'save' | 'open';
export type CalendarCreatorErrorKind = 'save' | 'load' | null;

const CALENDAR_SAVE_SLOT_COUNT = 4;

function createEmptyCalendarSaveSlots(): Array<CalendarSaveRecord | null> {
  return Array.from({ length: CALENDAR_SAVE_SLOT_COUNT }, () => null);
}

function describeCalendarFailure(failure: unknown): string {
  if (failure instanceof CalendarInputError || failure instanceof CalendarStorageError) {
    return failure.message;
  }

  throw failure;
}

function requireBrowserCalendarStorage(): Storage {
  if (typeof window === 'undefined') {
    throw new CalendarStorageError(
      'Calendar browser storage is unavailable. Received window undefined.',
    );
  }

  if (window.localStorage === undefined || window.localStorage === null) {
    throw new CalendarStorageError(
      `Calendar browser storage is unavailable. Received ${String(window.localStorage)}.`,
    );
  }

  return window.localStorage;
}

function cloneCalendarSettings(settings: CalendarSettings): CalendarSettings {
  return {
    year: settings.year,
    months: settings.months.map((month) => ({ ...month })),
    weekdayNames: [...settings.weekdayNames],
    startWeekdayIndex: settings.startWeekdayIndex,
    moonCycles: { ...settings.moonCycles },
    disasterProbability: settings.disasterProbability,
  };
}

function requireVisibleMonthCount(monthCount: number): number {
  if (!Number.isSafeInteger(monthCount) || monthCount < 1) {
    throw new CalendarInputError(
      `Calendar visible month count must be a safe integer of at least 1. Received ${String(monthCount)}.`,
    );
  }

  return monthCount;
}

function clampVisibleMonthIndex(monthIndex: number, monthCount: number): number {
  const checkedMonthCount = requireVisibleMonthCount(monthCount);
  if (!Number.isSafeInteger(monthIndex) || monthIndex < 0) {
    throw new CalendarInputError(
      `Calendar visible month index must be a safe integer of at least 0. Received ${String(monthIndex)}.`,
    );
  }

  if (monthIndex >= checkedMonthCount) {
    return checkedMonthCount - 1;
  }

  return monthIndex;
}

function resetCalendarEditingState(): {
  boundSlot: CalendarSaveSlotNumber | null;
  selectedDayIds: number[];
  activeDayId: number | null;
  undoMarker: CalendarManualUndo | null;
} {
  return {
    boundSlot: null,
    selectedDayIds: [],
    activeDayId: null,
    undoMarker: null,
  };
}

export function useCalendarCreator(locale: SiteLocale) {
  const copy = useMemo(() => getCalendarCreatorCopy(locale), [locale]);
  const [calendarDocument, setCalendarDocument] = useState<CalendarDocument | null>(null);
  const [boundSlot, setBoundSlot] = useState<CalendarSaveSlotNumber | null>(null);
  const [dirty, setDirty] = useState(false);
  const [selectedDayIds, setSelectedDayIds] = useState<number[]>([]);
  const [activeDayId, setActiveDayId] = useState<number | null>(null);
  const [undoMarker, setUndoMarker] = useState<CalendarManualUndo | null>(null);
  const [mobileMultiSelect, setMobileMultiSelect] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [returnSettingsOpen, setReturnSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveDialogMode, setSaveDialogMode] = useState<CalendarCreatorSaveDialogMode>('manage');
  const [saveSlots, setSaveSlots] = useState<Array<CalendarSaveRecord | null>>(
    createEmptyCalendarSaveSlots,
  );
  const [guardOpen, setGuardOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<CalendarPendingAction | null>(null);
  const [yearInput, setYearInput] = useState('');
  const [visibleMonthIndex, setVisibleMonthIndex] = useState(0);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionErrorKind, setActionErrorKind] = useState<CalendarCreatorErrorKind>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const resetEditorState = useCallback(() => {
    const clearedState = resetCalendarEditingState();
    setBoundSlot(clearedState.boundSlot);
    setSelectedDayIds(clearedState.selectedDayIds);
    setActiveDayId(clearedState.activeDayId);
    setUndoMarker(clearedState.undoMarker);
  }, []);

  const executeCalendarAction = useCallback(
    (action: CalendarPendingAction): void => {
      if (action.type === 'new') {
        setCalendarDocument(null);
        setYearInput('');
        resetEditorState();
        setDirty(false);
        setSettingsOpen(false);
        setReturnSettingsOpen(false);
        setVisibleMonthIndex(0);
        setStatusMessage(null);
        return;
      }

      if (action.type === 'load') {
        const browserStorage = requireBrowserCalendarStorage();
        const loadedDocument = loadCalendarSaveSlot(browserStorage, action.slotNumber);
        setCalendarDocument(loadedDocument);
        setYearInput(String(loadedDocument.settings.year));
        setBoundSlot(action.slotNumber);
        setSelectedDayIds([]);
        setActiveDayId(loadedDocument.days[0]?.dayOfYear ?? null);
        setUndoMarker(null);
        setDirty(false);
        setSettingsOpen(false);
        setReturnSettingsOpen(false);
        setVisibleMonthIndex(0);
        setStatusMessage(copy.loaded);
        return;
      }

      const rebuiltDocument = createCalendar(action.settings);
      setCalendarDocument(rebuiltDocument);
      setVisibleMonthIndex((currentMonthIndex) =>
        clampVisibleMonthIndex(currentMonthIndex, rebuiltDocument.settings.months.length),
      );
      setYearInput(String(rebuiltDocument.settings.year));
      resetEditorState();
      setDirty(true);
      setSettingsOpen(false);
      setReturnSettingsOpen(false);
      setStatusMessage(copy.saveLocationCleared);
    },
    [copy.loaded, copy.saveLocationCleared, resetEditorState],
  );

  const requestCalendarAction = useCallback(
    (action: CalendarPendingAction): void => {
      if (dirty && calendarDocument !== null) {
        setPendingAction(action);
        setGuardOpen(true);
        return;
      }

      try {
        executeCalendarAction(action);
        setPendingAction(null);
        setGuardOpen(false);
        setActionError(null);
        setActionErrorKind(null);
      } catch (failure: unknown) {
        setActionError(describeCalendarFailure(failure));
        setActionErrorKind(null);
      }
    },
    [calendarDocument, dirty, executeCalendarAction],
  );

  const handleRequestRegeneration = useCallback(
    (settings: CalendarSettings): void => {
      if (calendarDocument === null || !returnSettingsOpen) {
        throw new CalendarInputError(
          `Calendar regeneration requires an existing return-settings draft. Received calendarDocument=${calendarDocument === null ? 'null' : 'present'}, returnSettingsOpen=${String(returnSettingsOpen)}.`,
        );
      }

      setPendingAction({ type: 'regenerate', settings: cloneCalendarSettings(settings) });
      setGuardOpen(true);
      setActionError(null);
      setActionErrorKind(null);
    },
    [calendarDocument, returnSettingsOpen],
  );

  const handleCreateCalendar = useCallback((settings: CalendarSettings): void => {
    if (returnSettingsOpen) {
      handleRequestRegeneration(settings);
      return;
    }

    try {
      const createdDocument = createCalendar(settings);
      setCalendarDocument(createdDocument);
      setYearInput(String(createdDocument.settings.year));
      resetEditorState();
      setDirty(true);
      setSettingsOpen(false);
      setReturnSettingsOpen(false);
      setVisibleMonthIndex(0);
      setActionError(null);
      setActionErrorKind(null);
      setStatusMessage(null);
    } catch (failure: unknown) {
      setActionError(describeCalendarFailure(failure));
      setActionErrorKind(null);
    }
  }, [handleRequestRegeneration, resetEditorState, returnSettingsOpen]);

  const handleReturnToSettings = useCallback((): void => {
    if (calendarDocument === null) {
      throw new CalendarInputError(
        `Calendar settings cannot reopen before a calendar exists. Received ${String(calendarDocument)}.`,
      );
    }

    setReturnSettingsOpen(true);
  }, [calendarDocument]);

  const handleResumeCalendar = useCallback((): void => {
    setReturnSettingsOpen(false);
  }, []);

  const readSaveSlots = useCallback((): void => {
    const browserStorage = requireBrowserCalendarStorage();
    setSaveSlots(readCalendarSaveSlots(browserStorage));
  }, []);

  const handleOpenSaveDialog = useCallback(
    (mode: CalendarCreatorSaveDialogMode): void => {
      try {
        readSaveSlots();
        setSaveDialogMode(mode);
        setSaveDialogOpen(true);
        setActionError(null);
        setActionErrorKind(null);
      } catch (failure: unknown) {
        setActionError(describeCalendarFailure(failure));
        setActionErrorKind('load');
        setSaveDialogMode(mode);
        setSaveDialogOpen(true);
      }
    },
    [readSaveSlots],
  );

  const saveDocumentToSlot = useCallback(
    (slotNumber: CalendarSaveSlotNumber): boolean => {
      if (calendarDocument === null) {
        throw new CalendarInputError(
          `Calendar cannot be saved before it is created. Received ${String(calendarDocument)}.`,
        );
      }

      const browserStorage = requireBrowserCalendarStorage();
      saveCalendarSaveSlot(browserStorage, slotNumber, calendarDocument);
      setSaveSlots(readCalendarSaveSlots(browserStorage));
      setBoundSlot(slotNumber);
      setDirty(false);
      setStatusMessage(copy.completeSaveNotice);
      setActionError(null);
      setActionErrorKind(null);
      return true;
    },
    [calendarDocument, copy.completeSaveNotice],
  );

  const handleSaveCurrent = useCallback((): void => {
    if (boundSlot === null) {
      handleOpenSaveDialog('save');
      return;
    }

    try {
      saveDocumentToSlot(boundSlot);
    } catch (failure: unknown) {
      setActionError(describeCalendarFailure(failure));
      setActionErrorKind('save');
    }
  }, [boundSlot, handleOpenSaveDialog, saveDocumentToSlot]);

  const handleSaveSlot = useCallback(
    (slotNumber: CalendarSaveSlotNumber): void => {
      try {
        saveDocumentToSlot(slotNumber);
        setSaveDialogOpen(false);
      } catch (failure: unknown) {
        setActionError(describeCalendarFailure(failure));
        setActionErrorKind('save');
      }
    },
    [saveDocumentToSlot],
  );

  const handleLoadSlot = useCallback(
    (slotNumber: CalendarSaveSlotNumber): void => {
      if (dirty && calendarDocument !== null) {
        setPendingAction({ type: 'load', slotNumber });
        setSaveDialogOpen(false);
        setGuardOpen(true);
        setActionError(null);
        setActionErrorKind('load');
        return;
      }

      try {
        executeCalendarAction({ type: 'load', slotNumber });
        setSaveDialogOpen(false);
        setActionError(null);
        setActionErrorKind(null);
        setStatusMessage(copy.loaded);
      } catch (failure: unknown) {
        setActionError(describeCalendarFailure(failure));
        setActionErrorKind('load');
      }
    },
    [calendarDocument, copy.loaded, dirty, executeCalendarAction],
  );

  const handleGuardSaveContinue = useCallback(
    (slotNumber: CalendarSaveSlotNumber): void => {
      if (pendingAction === null) {
        throw new CalendarInputError('Calendar guard has no pending action. Received null.');
      }

      try {
        saveDocumentToSlot(slotNumber);
      } catch (failure: unknown) {
        setActionError(describeCalendarFailure(failure));
        setActionErrorKind('save');
        setGuardOpen(true);
        return;
      }

      const actionToContinue = pendingAction;
      try {
        executeCalendarAction(actionToContinue);
        setPendingAction(null);
        setGuardOpen(false);
        setActionError(null);
        setActionErrorKind(null);
      } catch (failure: unknown) {
        setActionError(describeCalendarFailure(failure));
        setActionErrorKind(actionToContinue.type === 'load' ? 'load' : null);
        setGuardOpen(true);
      }
    },
    [executeCalendarAction, pendingAction, saveDocumentToSlot],
  );

  const handleGuardDiscard = useCallback((): void => {
    if (pendingAction === null) {
      throw new CalendarInputError('Calendar discard action has no pending action. Received null.');
    }

    try {
      const actionToContinue = pendingAction;
      executeCalendarAction(actionToContinue);
      setPendingAction(null);
      setGuardOpen(false);
      setActionError(null);
      setActionErrorKind(null);
    } catch (failure: unknown) {
      setActionError(describeCalendarFailure(failure));
      setActionErrorKind(pendingAction.type === 'load' ? 'load' : null);
    }
  }, [executeCalendarAction, pendingAction]);

  const handleGuardCancel = useCallback((): void => {
    setPendingAction(null);
    setGuardOpen(false);
    setActionError(null);
    setActionErrorKind(null);
  }, []);

  const handleGuardOpenChange = useCallback((open: boolean): void => {
    setGuardOpen(open);
    if (!open) {
      setPendingAction(null);
      setActionError(null);
      setActionErrorKind(null);
    }
  }, []);

  const handleApplySettings = useCallback(
    (settings: CalendarSettings): void => {
      requestCalendarAction({ type: 'settings', settings: cloneCalendarSettings(settings) });
    },
    [requestCalendarAction],
  );

  const handleYearInputCommit = useCallback((): void => {
    if (calendarDocument === null) {
      throw new CalendarInputError(
        `Calendar year cannot be updated before creation. Received ${String(calendarDocument)}.`,
      );
    }

    try {
      const nextYear = parseCalendarInteger(yearInput, copy.year, Number.MIN_SAFE_INTEGER);
      if (nextYear === calendarDocument.settings.year) {
        setActionError(null);
        return;
      }

      const nextSettings = cloneCalendarSettings(calendarDocument.settings);
      nextSettings.year = nextYear;
      requestCalendarAction({ type: 'year', settings: nextSettings });
    } catch (failure: unknown) {
      setActionError(describeCalendarFailure(failure));
      setYearInput(String(calendarDocument.settings.year));
    }
  }, [calendarDocument, copy.year, requestCalendarAction, yearInput]);

  const handleYearChange = useCallback(
    (direction: -1 | 1): void => {
      if (calendarDocument === null) {
        throw new CalendarInputError(
          `Calendar year cannot change before creation. Received ${String(calendarDocument)}.`,
        );
      }

      try {
        const nextSettings = getAdjacentYearSettings(calendarDocument.settings, direction);
        requestCalendarAction({ type: 'year', settings: nextSettings });
      } catch (failure: unknown) {
        setActionError(describeCalendarFailure(failure));
      }
    },
    [calendarDocument, requestCalendarAction],
  );

  const handleToggleDay = useCallback((dayOfYear: number): void => {
    try {
      const nextSelection = toggleCalendarDaySelection(selectedDayIds, dayOfYear);
      setSelectedDayIds(nextSelection);
      if (!mobileMultiSelect && activeDayId === null && nextSelection.length > 0) {
        setActiveDayId(nextSelection[0]);
      }
      setActionError(null);
    } catch (failure: unknown) {
      setActionError(describeCalendarFailure(failure));
    }
  }, [activeDayId, mobileMultiSelect, selectedDayIds]);

  const handleToggleMultiSelect = useCallback((): void => {
    if (!mobileMultiSelect) {
      setActiveDayId(null);
      setMobileMultiSelect(true);
      return;
    }

    setMobileMultiSelect(false);
    if (selectedDayIds.length > 0) {
      setActiveDayId(selectedDayIds[0]);
    }
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [mobileMultiSelect, selectedDayIds]);

  const handleEditDay = useCallback((dayOfYear: number): void => {
    setActiveDayId(dayOfYear);
    setActionError(null);
  }, []);

  const handleCloseDayInspector = useCallback((): void => {
    setActiveDayId(null);
  }, []);

  const handleClearSelection = useCallback((): void => {
    setSelectedDayIds([]);
  }, []);

  const handleApplyIcon = useCallback(
    (iconId: CalendarIconId | null): void => {
      if (calendarDocument === null) {
        throw new CalendarInputError(
          `Calendar icon cannot be applied before creation. Received ${String(calendarDocument)}.`,
        );
      }

      const targetDayIds = selectedDayIds.length > 0
        ? selectedDayIds
        : activeDayId === null ? [] : [activeDayId];
      if (targetDayIds.length === 0) {
        setActionError(copy.noSelection);
        return;
      }

      try {
        const appliedResult = applyCalendarManualIcon(calendarDocument, targetDayIds, iconId);
        setCalendarDocument(appliedResult.document);
        setUndoMarker(appliedResult.undo);
        setDirty(true);
        setActionError(null);
        setStatusMessage(copy.batchApplied);
      } catch (failure: unknown) {
        setActionError(describeCalendarFailure(failure));
      }
    },
    [activeDayId, calendarDocument, copy.batchApplied, copy.noSelection, selectedDayIds],
  );

  const handleUndo = useCallback((): void => {
    if (calendarDocument === null || undoMarker === null) {
      setActionError(copy.undoUnavailable);
      return;
    }

    try {
      setCalendarDocument(undoCalendarManualIcon(calendarDocument, undoMarker));
      setUndoMarker(null);
      setDirty(true);
      setActionError(null);
    } catch (failure: unknown) {
      setActionError(describeCalendarFailure(failure));
    }
  }, [calendarDocument, copy.undoUnavailable, undoMarker]);

  const handleChangeNote = useCallback(
    (dayOfYear: number, note: string): void => {
      if (calendarDocument === null) {
        throw new CalendarInputError(
          `Calendar note cannot change before creation. Received ${String(calendarDocument)}.`,
        );
      }

      try {
        setCalendarDocument(updateCalendarDayNote(calendarDocument, dayOfYear, note));
        setDirty(true);
        setActionError(null);
      } catch (failure: unknown) {
        setActionError(describeCalendarFailure(failure));
      }
    },
    [calendarDocument],
  );

  const handlePrint = useCallback((): void => {
    if (typeof window === 'undefined' || typeof window.print !== 'function') {
      throw new Error(
        `Calendar print requires window.print. Received ${typeof window === 'undefined' ? 'undefined' : String(window.print)}.`,
      );
    }

    window.print();
  }, []);

  const handleSelectMonth = useCallback(
    (monthIndex: number): void => {
      if (calendarDocument === null) {
        throw new CalendarInputError(
          `Calendar month cannot be selected before creation. Received ${String(calendarDocument)}.`,
        );
      }

      const monthCount = calendarDocument.settings.months.length;
      if (!Number.isSafeInteger(monthIndex) || monthIndex < 0 || monthIndex >= monthCount) {
        throw new CalendarInputError(
          `Calendar month index must be a safe integer from 0 to ${monthCount - 1}. Received ${String(monthIndex)}.`,
        );
      }

      setVisibleMonthIndex(monthIndex);
    },
    [calendarDocument],
  );

  const isRegenerationPending = pendingAction?.type === 'regenerate';
  const guardTitle = isRegenerationPending ? copy.regenerateTitle : copy.unsavedTitle;
  const guardDescription = isRegenerationPending
    ? copy.regenerateDescription
    : copy.unsavedDescription;
  const guardContinueLabel = isRegenerationPending
    ? copy.regenerateConfirm
    : copy.discardContinue;

  return {
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
    protectedSourceSlot: pendingAction?.type === 'load' ? pendingAction.slotNumber : null,
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
    setSaveDialogOpen,
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
    handleCreateNew: () => requestCalendarAction({ type: 'new' }),
    handleSaveCurrent,
    handleOpenArchives: () => handleOpenSaveDialog('manage'),
    handleLoadSlot,
    handleSaveSlot,
    handleGuardSaveContinue,
    handleGuardDiscard,
    handleGuardCancel,
    handleGuardOpenChange,
    handleSaveDialogOpenChange: setSaveDialogOpen,
  };
}
