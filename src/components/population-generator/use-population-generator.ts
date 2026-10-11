import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';

import {
  decodePopulationUtf8,
  generatePopulation,
  generateRandomPopulation,
  getPopulationPresets,
  parsePopulationResult,
  readPopulationSlots,
  savePopulationSlot,
  serializePopulationResult,
  validatePopulationResult,
  type PopulationEra,
  type PopulationPreset,
  type PopulationResult,
  type PopulationSize,
} from '@/lib/population-generator';
import type { SiteLocale } from '@/lib/site-locale';

import { describeReceivedValue } from './population-boundary';
import {
  getPopulationGeneratorCopy,
  type PopulationGeneratorCopy,
} from './population-generator-copy';
import {
  PopulationStorageUnavailableError,
  buildPopulationDownloadName,
  isKnownPopulationStorageError,
  readBrowserPopulationStorage,
  readKnownPopulationFileReadError,
  readKnownPopulationParseError,
  rethrowUnknownPopulationFileReadFailure,
} from './population-known-errors';
import {
  formatStoredPopulationNumber,
  interpretPopulationNumberDraft,
  roundAreaSquareMeasure,
} from './population-number-draft';
import {
  formatPopulationRange,
  isPopulationEraName,
  isPopulationSizeName,
  orderPopulationPresets,
  requirePopulationPreset,
} from './population-preset-list';
import {
  assertPopulationResultShape,
  numberFieldFromKey,
  populationFieldKey,
  populationNumberKind,
  readPopulationNumber,
  readPopulationText,
  writePopulationNumber,
  writePopulationText,
  type PopulationNumberField,
  type PopulationTextField,
} from './population-result-edits';

export type PopulationConfirmRequest =
  | { kind: 'generate'; era: PopulationEra; size: PopulationSize }
  | { kind: 'regenerate' }
  | { kind: 'load'; slotIndex: number }
  | { kind: 'import'; result: PopulationResult }
  | { kind: 'save'; slotIndex: number };

export type PopulationDialogState =
  | { kind: 'closed' }
  | { kind: 'slots' }
  | { kind: 'confirm'; request: PopulationConfirmRequest; returnToSlots: boolean };

export type PopulationFileNotice =
  | { kind: 'idle' }
  | { kind: 'choosing' }
  | { kind: 'reading' }
  | { kind: 'success'; message: string }
  | { kind: 'error'; message: string };

export type PopulationSlotsNotice =
  | { kind: 'idle' }
  | { kind: 'status'; message: string }
  | { kind: 'error'; message: string };

export interface PopulationGeneratorReadySession {
  status: 'ready';
  copy: PopulationGeneratorCopy;
  locale: SiteLocale;
  result: PopulationResult;
  selectedEra: PopulationEra;
  selectedSize: PopulationSize;
  selectedPresets: PopulationPreset[];
  medievalPresets: PopulationPreset[];
  modernPresets: PopulationPreset[];
  futurePresets: PopulationPreset[];
  resultRangeText: string;
  dirty: boolean;
  fileNotice: PopulationFileNotice;
  slotsNotice: PopulationSlotsNotice;
  dialog: PopulationDialogState;
  slots: Array<PopulationResult | null> | null;
  selectEra: (era: PopulationEra) => void;
  selectSize: (size: PopulationSize) => void;
  regenerate: () => void;
  textValue: (field: PopulationTextField) => string;
  changeText: (field: PopulationTextField, nextText: string) => void;
  numberValue: (field: PopulationNumberField) => string;
  numberError: (field: PopulationNumberField) => string | null;
  changeNumber: (field: PopulationNumberField, rawText: string) => void;
  blurNumber: (field: PopulationNumberField) => void;
  openSlots: () => void;
  requestSave: (slotIndex: number) => void;
  requestLoad: (slotIndex: number) => void;
  cancelDialog: () => void;
  confirmDialog: () => void;
  beginImport: (input: HTMLInputElement) => void;
  importSelectedFile: (file: File | null) => void;
  exportText: () => void;
  printResult: () => void;
}

export type PopulationGeneratorSession =
  | { status: 'preparing'; copy: PopulationGeneratorCopy }
  | PopulationGeneratorReadySession;

function subscribeToBrowserSnapshot(): () => void {
  return () => undefined;
}

function readBrowserSnapshot(): boolean {
  return true;
}

function readServerSnapshot(): boolean {
  return false;
}

function useIsBrowser(): boolean {
  return useSyncExternalStore(subscribeToBrowserSnapshot, readBrowserSnapshot, readServerSnapshot);
}

function requirePopulationSlotIndex(slotIndex: number): number {
  if (!Number.isInteger(slotIndex) || slotIndex < 0 || slotIndex > 4) {
    throw new Error(`Population slot index must be an integer from 0 to 4. Received ${String(slotIndex)}.`);
  }

  return slotIndex;
}

function acceptPopulationResult(value: unknown): PopulationResult {
  const validated = validatePopulationResult(value);
  assertPopulationResultShape(validated);
  return structuredClone(validated);
}

function storageFailureMessage(error: unknown, copy: PopulationGeneratorCopy): string | null {
  if (error instanceof PopulationStorageUnavailableError) {
    return copy.storageUnavailable(error.message);
  }

  if (
    error instanceof DOMException &&
    (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
  ) {
    return copy.storageQuota;
  }

  if (isKnownPopulationStorageError(error)) {
    return copy.storageUnavailable(`${error.name}: ${error.message}`);
  }

  return null;
}

function populationDraftsBlockFileActions(drafts: Record<string, string>): boolean {
  return Object.entries(drafts).some(([key, rawText]) => {
    const field = numberFieldFromKey(key);
    return interpretPopulationNumberDraft(rawText, populationNumberKind(field)).status !== 'valid';
  });
}

function settlePopulationDrafts(
  result: PopulationResult,
  drafts: Record<string, string>,
): PopulationResult | null {
  let settled = result;
  for (const [key, rawText] of Object.entries(drafts)) {
    const field = numberFieldFromKey(key);
    const kind = populationNumberKind(field);
    let interpreted = interpretPopulationNumberDraft(rawText, kind);
    if (interpreted.status === 'incomplete' && kind === 'decimal' && rawText.endsWith('.')) {
      interpreted = interpretPopulationNumberDraft(rawText.slice(0, -1), kind);
    }

    if (interpreted.status !== 'valid') {
      return null;
    }

    const stored = kind === 'decimal' ? roundAreaSquareMeasure(interpreted.value) : interpreted.value;
    settled = writePopulationNumber(settled, field, stored);
  }

  return settled;
}

interface PopulationEditableSnapshot {
  result: PopulationResult | null;
  baseline: string | null;
  drafts: Record<string, string>;
}

function populationSnapshotIsDirty(snapshot: PopulationEditableSnapshot): boolean {
  return (
    snapshot.result !== null &&
    snapshot.baseline !== null &&
    (Object.keys(snapshot.drafts).length > 0 || serializePopulationResult(snapshot.result) !== snapshot.baseline)
  );
}

function requireLoadedSlots(value: unknown): Array<PopulationResult | null> {
  if (!Array.isArray(value) || value.length !== 5) {
    throw new Error(`readPopulationSlots must return 5 entries. Received ${describeReceivedValue(value)}.`);
  }

  return value.map((entry) => (entry === null ? null : acceptPopulationResult(entry)));
}

export function usePopulationGenerator(locale: SiteLocale): PopulationGeneratorSession {
  if (locale !== 'en' && locale !== 'zh') {
    throw new Error(`Population generator locale must be "en" or "zh". Received ${JSON.stringify(locale)}.`);
  }

  const copy = getPopulationGeneratorCopy(locale);
  const isBrowser = useIsBrowser();
  const [result, setResult] = useState<PopulationResult | null>(null);
  const [selectedEra, setSelectedEra] = useState<PopulationEra | null>(null);
  const [selectedSize, setSelectedSize] = useState<PopulationSize | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [baseline, setBaseline] = useState<string | null>(null);
  const [dialog, setDialog] = useState<PopulationDialogState>({ kind: 'closed' });
  const [slots, setSlots] = useState<Array<PopulationResult | null> | null>(null);
  const [fileNotice, setFileNotice] = useState<PopulationFileNotice>({ kind: 'idle' });
  const [slotsNotice, setSlotsNotice] = useState<PopulationSlotsNotice>({ kind: 'idle' });
  const exportUrlRef = useRef<string | null>(null);
  const mountedRef = useRef(false);
  const sessionSnapshotRef = useRef<PopulationEditableSnapshot>({
    result: null,
    baseline: null,
    drafts: {},
  });

  function rememberEditableSession(
    nextResult: PopulationResult | null,
    nextBaseline: string | null,
    nextDrafts: Record<string, string>,
  ): void {
    sessionSnapshotRef.current = {
      result: nextResult,
      baseline: nextBaseline,
      drafts: nextDrafts,
    };
  }

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (exportUrlRef.current !== null) {
        URL.revokeObjectURL(exportUrlRef.current);
        exportUrlRef.current = null;
      }
    };
  }, []);

  const medievalPresets = useMemo(
    () => orderPopulationPresets('medieval', getPopulationPresets('medieval')),
    [],
  );
  const modernPresets = useMemo(
    () => orderPopulationPresets('modern', getPopulationPresets('modern')),
    [],
  );
  const futurePresets = useMemo(
    () => orderPopulationPresets('future', getPopulationPresets('future')),
    [],
  );
  const selectedPresets = useMemo(() => {
    if (selectedEra === null) {
      return [];
    }

    return orderPopulationPresets(selectedEra, getPopulationPresets(selectedEra));
  }, [selectedEra]);
  const resultRangeText = useMemo(() => {
    if (result === null) {
      return '';
    }

    const preset = requirePopulationPreset(result.era, result.size, getPopulationPresets(result.era));
    return formatPopulationRange(preset.min, preset.max, locale);
  }, [locale, result]);

  if (isBrowser && result === null) {
    const accepted = acceptPopulationResult(generateRandomPopulation({ locale }));
    const serialized = serializePopulationResult(accepted);
    setResult(accepted);
    setSelectedEra(accepted.era);
    setSelectedSize(accepted.size);
    setBaseline(serialized);
  }

  function currentEditableSnapshot(): PopulationEditableSnapshot {
    const remembered = sessionSnapshotRef.current;
    if (remembered.result === null || remembered.baseline === null) {
      return { result, baseline, drafts };
    }

    return remembered;
  }

  const dirty =
    result !== null &&
    baseline !== null &&
    (Object.keys(drafts).length > 0 || serializePopulationResult(result) !== baseline);

  function commitFreshResult(value: unknown): void {
    const accepted = acceptPopulationResult(value);
    const serialized = serializePopulationResult(accepted);
    rememberEditableSession(accepted, serialized, {});
    setResult(accepted);
    setSelectedEra(accepted.era);
    setSelectedSize(accepted.size);
    setDrafts({});
    setBaseline(serialized);
  }

  function requireReadyResult(): PopulationResult {
    if (result === null) {
      throw new Error('Population edits require a generated result. Received null.');
    }

    return result;
  }

  function selectEra(era: PopulationEra): void {
    if (!isPopulationEraName(era)) {
      throw new Error(`Population era must be medieval, modern, or future. Received ${describeReceivedValue(era)}.`);
    }

    setSelectedEra(era);
  }

  function selectSize(size: PopulationSize): void {
    if (selectedEra === null) {
      throw new Error('Choose a population era before choosing a size.');
    }

    if (!isPopulationSizeName(size)) {
      throw new Error(`Population size is not recognized. Received ${describeReceivedValue(size)}.`);
    }

    requirePopulationPreset(selectedEra, size, getPopulationPresets(selectedEra));
    setSelectedSize(size);
    if (dirty) {
      setDialog({
        kind: 'confirm',
        request: { kind: 'generate', era: selectedEra, size },
        returnToSlots: false,
      });
      return;
    }

    commitFreshResult(generatePopulation({ era: selectedEra, size, locale }));
  }

  function regenerate(): void {
    const current = requireReadyResult();
    if (dirty) {
      setDialog({ kind: 'confirm', request: { kind: 'regenerate' }, returnToSlots: false });
      return;
    }

    commitFreshResult(generatePopulation({ era: current.era, size: current.size, locale }));
  }

  function textValue(field: PopulationTextField): string {
    return readPopulationText(requireReadyResult(), field);
  }

  function changeText(field: PopulationTextField, nextText: string): void {
    const snapshot = currentEditableSnapshot();
    if (snapshot.result === null) {
      throw new Error('Cannot edit population text before the first result exists.');
    }

    const nextResult = writePopulationText(snapshot.result, field, nextText);
    rememberEditableSession(nextResult, snapshot.baseline, snapshot.drafts);
    setResult(nextResult);
  }

  function numberValue(field: PopulationNumberField): string {
    const draft = drafts[populationFieldKey(field)];
    if (draft !== undefined) {
      return draft;
    }

    return formatStoredPopulationNumber(
      readPopulationNumber(requireReadyResult(), field),
      populationNumberKind(field),
    );
  }

  function numberError(field: PopulationNumberField): string | null {
    const draft = drafts[populationFieldKey(field)];
    if (draft === undefined) {
      return null;
    }

    const interpreted = interpretPopulationNumberDraft(draft, populationNumberKind(field));
    if (interpreted.status !== 'invalid') {
      return null;
    }

    return populationNumberKind(field) === 'decimal' ? copy.decimalError : copy.integerError;
  }

  function changeNumber(field: PopulationNumberField, rawText: string): void {
    const snapshot = currentEditableSnapshot();
    const key = populationFieldKey(field);
    const nextDrafts = { ...snapshot.drafts, [key]: rawText };
    const kind = populationNumberKind(field);
    const interpreted = interpretPopulationNumberDraft(rawText, kind);
    if (interpreted.status !== 'valid') {
      rememberEditableSession(snapshot.result, snapshot.baseline, nextDrafts);
      setDrafts(nextDrafts);
      return;
    }

    if (snapshot.result === null) {
      throw new Error('Cannot edit a population number before the first result exists.');
    }

    const stored = kind === 'decimal' ? roundAreaSquareMeasure(interpreted.value) : interpreted.value;
    const nextResult = writePopulationNumber(snapshot.result, field, stored);
    rememberEditableSession(nextResult, snapshot.baseline, nextDrafts);
    setDrafts(nextDrafts);
    setResult(nextResult);
  }

  function blurNumber(field: PopulationNumberField): void {
    const snapshot = currentEditableSnapshot();
    const key = populationFieldKey(field);
    const rawText = snapshot.drafts[key];
    if (rawText === undefined) {
      return;
    }

    const kind = populationNumberKind(field);
    let interpreted = interpretPopulationNumberDraft(rawText, kind);
    if (interpreted.status === 'incomplete' && kind === 'decimal' && rawText.endsWith('.')) {
      interpreted = interpretPopulationNumberDraft(rawText.slice(0, -1), kind);
    }

    if (interpreted.status !== 'valid') {
      return;
    }

    if (snapshot.result === null) {
      throw new Error('Cannot edit a population number before the first result exists.');
    }

    const stored = kind === 'decimal' ? roundAreaSquareMeasure(interpreted.value) : interpreted.value;
    const nextResult = writePopulationNumber(snapshot.result, field, stored);
    const nextDrafts = { ...snapshot.drafts };
    delete nextDrafts[key];
    rememberEditableSession(nextResult, snapshot.baseline, nextDrafts);
    setResult(nextResult);
    setDrafts(nextDrafts);
  }

  function openSlots(): void {
    try {
      const loaded = requireLoadedSlots(readPopulationSlots(readBrowserPopulationStorage()));
      setSlots(loaded);
      setSlotsNotice({ kind: 'idle' });
      setDialog({ kind: 'slots' });
    } catch (error) {
      const storageMessage = storageFailureMessage(error, copy);
      const knownMessage = storageMessage ?? readKnownPopulationParseError(error);
      if (knownMessage === null) {
        throw error;
      }

      setSlots(null);
      setSlotsNotice({ kind: 'error', message: storageMessage ?? knownMessage });
      setDialog({ kind: 'slots' });
    }
  }

  function writeSlot(slotIndex: number): void {
    const checkedIndex = requirePopulationSlotIndex(slotIndex);
    const current = requireReadyResult();
    if (populationDraftsBlockFileActions(drafts)) {
      setSlotsNotice({ kind: 'error', message: copy.numberBlocked });
      return;
    }

    const settled = settlePopulationDrafts(current, drafts);
    if (settled === null) {
      setSlotsNotice({ kind: 'error', message: copy.numberBlocked });
      return;
    }

    try {
      const snapshot = structuredClone(settled);
      savePopulationSlot(readBrowserPopulationStorage(), checkedIndex, snapshot);
      rememberEditableSession(settled, sessionSnapshotRef.current.baseline, {});
      setResult(settled);
      setDrafts({});
      setSlots((currentSlots) => {
        const base = currentSlots ?? [null, null, null, null, null];
        return base.map((slot, index) => (index === checkedIndex ? snapshot : slot));
      });
      setSlotsNotice({ kind: 'status', message: copy.slotSavedStatus(checkedIndex + 1) });
    } catch (error) {
      const message = storageFailureMessage(error, copy) ?? readKnownPopulationParseError(error);
      if (message === null) {
        throw error;
      }

      setSlotsNotice({ kind: 'error', message });
    }
  }

  function requestSave(slotIndex: number): void {
    const checkedIndex = requirePopulationSlotIndex(slotIndex);
    if (slots === null) {
      throw new Error('Population slots must be loaded before saving. Received null.');
    }

    if (populationDraftsBlockFileActions(drafts)) {
      setSlotsNotice({ kind: 'error', message: copy.numberBlocked });
      return;
    }

    if (slots[checkedIndex] !== null) {
      setDialog({
        kind: 'confirm',
        request: { kind: 'save', slotIndex: checkedIndex },
        returnToSlots: true,
      });
      return;
    }

    writeSlot(checkedIndex);
  }

  function requestLoad(slotIndex: number): void {
    const checkedIndex = requirePopulationSlotIndex(slotIndex);
    const slot = slots?.[checkedIndex];
    if (slot == null) {
      throw new Error(`Population slot ${checkedIndex + 1} is empty and cannot be loaded.`);
    }

    if (dirty) {
      setDialog({
        kind: 'confirm',
        request: { kind: 'load', slotIndex: checkedIndex },
        returnToSlots: true,
      });
      return;
    }

    commitFreshResult(slot);
    setDialog({ kind: 'closed' });
  }

  function cancelDialog(): void {
    if (dialog.kind === 'confirm' && (dialog.request.kind === 'generate' || dialog.request.kind === 'regenerate')) {
      const current = requireReadyResult();
      setSelectedEra(current.era);
      setSelectedSize(current.size);
    }

    if (dialog.kind === 'confirm' && dialog.returnToSlots) {
      setDialog({ kind: 'slots' });
      return;
    }

    setDialog({ kind: 'closed' });
  }

  function confirmDialog(): void {
    if (dialog.kind !== 'confirm') {
      throw new Error('There is no population confirmation to accept.');
    }

    const request = dialog.request;
    if (request.kind === 'generate') {
      commitFreshResult(generatePopulation({ era: request.era, size: request.size, locale }));
      setDialog({ kind: 'closed' });
      return;
    }

    if (request.kind === 'regenerate') {
      const current = requireReadyResult();
      commitFreshResult(generatePopulation({ era: current.era, size: current.size, locale }));
      setDialog({ kind: 'closed' });
      return;
    }

    if (request.kind === 'load') {
      const slot = slots?.[request.slotIndex];
      if (slot == null) {
        throw new Error(`Population slot ${request.slotIndex + 1} is empty and cannot be loaded.`);
      }

      commitFreshResult(slot);
      setDialog({ kind: 'closed' });
      return;
    }

    if (request.kind === 'import') {
      commitFreshResult(request.result);
      setFileNotice({ kind: 'success', message: copy.importSuccess });
      setDialog({ kind: 'closed' });
      return;
    }

    writeSlot(request.slotIndex);
    setDialog({ kind: 'slots' });
  }

  function beginImport(input: HTMLInputElement): void {
    setFileNotice({ kind: 'choosing' });
    function clearChoosingStatus(): void {
      window.setTimeout(() => {
        if (!mountedRef.current) {
          return;
        }

        setFileNotice((current) => (current.kind === 'choosing' ? { kind: 'idle' } : current));
      }, 400);
    }

    window.addEventListener('focus', clearChoosingStatus, { once: true });
    input.click();
  }

  function importSelectedFile(file: File | null): void {
    if (file === null) {
      return;
    }

    setFileNotice({ kind: 'reading' });
    void file.arrayBuffer().then((bytes) => {
      let text: string;
      try {
        text = decodePopulationUtf8(new Uint8Array(bytes));
      } catch (error) {
        const knownMessage = readKnownPopulationParseError(error);
        if (knownMessage === null) {
          throw error;
        }

        if (mountedRef.current) {
          setFileNotice({ kind: 'error', message: copy.importInvalid(knownMessage) });
        }
        return;
      }

      let parsed: PopulationResult;
      try {
        parsed = acceptPopulationResult(parsePopulationResult(text));
      } catch (error) {
        const knownMessage = readKnownPopulationParseError(error);
        if (knownMessage === null) {
          throw error;
        }

        if (mountedRef.current) {
          setFileNotice({ kind: 'error', message: copy.importInvalid(knownMessage) });
        }
        return;
      }

      if (!mountedRef.current) {
        return;
      }

      if (populationSnapshotIsDirty(sessionSnapshotRef.current)) {
        setDialog({
          kind: 'confirm',
          request: { kind: 'import', result: parsed },
          returnToSlots: false,
        });
        setFileNotice({ kind: 'idle' });
        return;
      }

      commitFreshResult(parsed);
      setFileNotice({ kind: 'success', message: copy.importSuccess });
    }).catch((error: unknown) => {
      const knownReadMessage = readKnownPopulationFileReadError(error);
      if (knownReadMessage !== null) {
        if (mountedRef.current) {
          setFileNotice({ kind: 'error', message: copy.importInvalid(knownReadMessage) });
        }
        return;
      }

      setTimeout(() => {
        rethrowUnknownPopulationFileReadFailure(error);
      }, 0);
    });
  }

  function exportText(): void {
    const current = requireReadyResult();
    if (populationDraftsBlockFileActions(drafts)) {
      setFileNotice({ kind: 'error', message: copy.numberBlocked });
      return;
    }

    const settled = settlePopulationDrafts(current, drafts);
    if (settled === null) {
      setFileNotice({ kind: 'error', message: copy.numberBlocked });
      return;
    }

    rememberEditableSession(settled, sessionSnapshotRef.current.baseline, {});
    setResult(settled);
    setDrafts({});
    const blob = new Blob([serializePopulationResult(settled)], { type: 'text/html;charset=utf-8' });
    const objectUrl = URL.createObjectURL(blob);
    if (exportUrlRef.current !== null) {
      URL.revokeObjectURL(exportUrlRef.current);
    }

    exportUrlRef.current = objectUrl;
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = buildPopulationDownloadName(settled.name);
    anchor.rel = 'noopener';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => {
      if (exportUrlRef.current === objectUrl) {
        URL.revokeObjectURL(objectUrl);
        exportUrlRef.current = null;
      }
    }, 1000);
  }

  function printResult(): void {
    const current = requireReadyResult();
    if (populationDraftsBlockFileActions(drafts)) {
      setFileNotice({ kind: 'error', message: copy.numberBlocked });
      return;
    }

    const settled = settlePopulationDrafts(current, drafts);
    if (settled === null) {
      setFileNotice({ kind: 'error', message: copy.numberBlocked });
      return;
    }

    rememberEditableSession(settled, sessionSnapshotRef.current.baseline, {});
    setResult(settled);
    setDrafts({});
    window.print();
  }

  if (result === null || selectedEra === null || selectedSize === null || baseline === null) {
    return { status: 'preparing', copy };
  }

  return {
    status: 'ready',
    copy,
    locale,
    result,
    selectedEra,
    selectedSize,
    selectedPresets,
    medievalPresets,
    modernPresets,
    futurePresets,
    resultRangeText,
    dirty,
    fileNotice,
    slotsNotice,
    dialog,
    slots,
    selectEra,
    selectSize,
    regenerate,
    textValue,
    changeText,
    numberValue,
    numberError,
    changeNumber,
    blurNumber,
    openSlots,
    requestSave,
    requestLoad,
    cancelDialog,
    confirmDialog,
    beginImport,
    importSelectedFile,
    exportText,
    printResult,
  };
}
