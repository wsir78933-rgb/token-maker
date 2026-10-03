'use client';

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore, type PointerEvent, type ReactNode, type RefObject } from 'react';

import {
  readArmyFormationBrowserSave,
  removeArmyFormationBrowserSave,
  writeArmyFormationBrowserSave,
  type ArmyFormationDocumentStorage,
} from '@/lib/army-formation/browser-saves';
import { getArmyFormationCreatorCopy, type ArmyFormationCreatorCopy } from '@/lib/army-formation/copy';
import {
  compressArmyFormationBackgroundImage,
  type ArmyBackgroundImageUploadResult,
} from '@/lib/army-formation/background-image-upload';
import {
  ARMY_PIECE_HEIGHT,
  ARMY_PIECE_WIDTH,
  ARMY_PLACEMENT_STEP_PX,
  addArmyFormationPiece,
  addArmyPaletteSwatch,
  clearArmyFormationPieces,
  createEmptyArmyFormationDocument,
  deleteSelectedArmyFormationPieces,
  deleteSelectedArmyPaletteSwatch,
  moveArmyFormationPiece,
  parseArmyFormationDocument,
  rotateSelectedArmyFormationPieces,
  selectArmyPaletteSwatch,
  serializeArmyFormationDocument,
  setArmyBackgroundImageUrl,
  setArmyBackgroundImageUrlForBattlefield,
  setArmyBattlefieldHeight,
  setArmyFieldBackgroundColor,
  stepArmyBattlefield,
  toggleArmyFormationPieceSelection,
  type ArmyBattlefield,
  type ArmyFormationDocument,
  type ArmyFormationPiece,
  type ArmyPaletteSwatch,
} from '@/lib/army-formation/document';
import {
  buildArmyFormationPng,
  type ArmyFormationImageScene,
  type ArmyFormationImagePiece,
} from '@/lib/army-formation/export-image';
import {
  listArmyFormationIconCategories,
  listArmyFormationIconsInCategory,
  requireArmyFormationCatalogIcon,
  type ArmyFormationCatalogIcon,
  type ArmyFormationIconCategoryId,
} from '@/lib/army-formation/icon-catalog';
import { cn } from '@/lib/utils';

const ARMY_FIELD_WIDTH_PX = 780;
const ARMY_BATTLEFIELD_SLIDE_DURATION_MS = 280;
const ARMY_BATTLEFIELD_SLIDE_CLEANUP_DELAY_MS = ARMY_BATTLEFIELD_SLIDE_DURATION_MS + 80;
const ARMY_DRAG_START_PX = 3;
const ARMY_FORMATION_FILE_NAME = 'army-formation-creator.txt';
const ARMY_FORMATION_PNG_NAME = 'army-formation-creator.png';
const DEFAULT_FIELD_BACKGROUND_COLOR = '#ffffff';
const ARMY_FIELD_MIN_HEIGHT_PX = 200;
const ARMY_FIELD_MAX_HEIGHT_PX = 2000;

const ARMY_FORMATION_BUTTON_CLASS =
  'cursor-pointer rounded-md border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] px-4 py-3 text-base text-[var(--site-ink)] transition-colors enabled:hover:border-[var(--site-accent-strong)] enabled:hover:bg-[var(--site-accent-bg)] enabled:hover:text-[var(--site-accent-strong)]';
const ARMY_FORMATION_INPUT_CLASS =
  'cursor-pointer rounded-md border border-[var(--site-border-strong)] bg-[var(--site-panel-strong)] px-2 py-1 text-sm text-[var(--site-ink)]';
const ARMY_FORMATION_NATO_ICONS_PER_PAGE = 60;
const ARMY_FORMATION_ICON_SHELF_MAX_HEIGHT_CLASS = 'max-h-[calc(2.25rem*3+0.25rem*2)]';
const ARMY_FORMATION_ICON_THUMBNAIL_FILTER = 'brightness(0) invert(1)';

type PieceDragSession = {
  pieceId: string;
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startPieceX: number;
  startPieceY: number;
  moved: boolean;
};

type EmptySlot = {
  x: number;
  y: number;
};

type ArmyFormationBattlefieldSlide = {
  id: number;
  direction: -1 | 1;
  outgoingBattlefield: ArmyBattlefield;
  outgoingEmptySlot: EmptySlot | null;
};

type ArmyFormationFileOperation = 'import' | 'export-file' | 'export-png';

type ArmyFormationFileOperationFailure = {
  operation: ArmyFormationFileOperation;
  message: string;
};

type ArmyFormationStartupRecord =
  | { status: 'absent' }
  | { status: 'invalid'; message: string }
  | { status: 'restore'; armyDocument: ArmyFormationDocument };

const UNREAD_ARMY_FORMATION_STARTUP = { status: 'unread' } as const;

type ArmyFormationStartupSnapshot =
  | typeof UNREAD_ARMY_FORMATION_STARTUP
  | { status: 'absent' }
  | { status: 'invalid'; message: string }
  | { status: 'restore' };

type ArmyFormationStartupStore = {
  subscribe: (onStoreChange: () => void) => () => void;
  readSnapshot: () => ArmyFormationStartupSnapshot;
  readRestoreDocument: () => ArmyFormationDocument | null;
  publishRecord: (record: ArmyFormationStartupRecord) => void;
};

function createArmyFormationStartupStore(): ArmyFormationStartupStore {
  let snapshot: ArmyFormationStartupSnapshot = UNREAD_ARMY_FORMATION_STARTUP;
  let restoreDocument: ArmyFormationDocument | null = null;
  const listeners = new Set<() => void>();

  return {
    subscribe(onStoreChange: () => void) {
      listeners.add(onStoreChange);
      return () => {
        listeners.delete(onStoreChange);
      };
    },
    readSnapshot() {
      return snapshot;
    },
    readRestoreDocument() {
      return restoreDocument;
    },
    publishRecord(record: ArmyFormationStartupRecord) {
      if (record.status === 'restore') {
        restoreDocument = record.armyDocument;
        snapshot = { status: 'restore' };
      } else if (record.status === 'invalid') {
        restoreDocument = null;
        snapshot = { status: 'invalid', message: record.message };
      } else {
        restoreDocument = null;
        snapshot = { status: 'absent' };
      }

      for (const listener of listeners) {
        listener();
      }
    },
  };
}

function readServerArmyFormationStartupSnapshot(): ArmyFormationStartupSnapshot {
  return UNREAD_ARMY_FORMATION_STARTUP;
}

function describeJsonReceivedValue(value: object): string {
  try {
    const json = JSON.stringify(value);
    if (typeof json === 'string') {
      return json;
    }

    return `${Object.prototype.toString.call(value)} (JSON.stringify returned ${String(json)}).`;
  } catch (failure: unknown) {
    const reason = failure instanceof Error ? failure.message : Object.prototype.toString.call(failure);
    return `${Object.prototype.toString.call(value)} (JSON.stringify failed: ${reason}).`;
  }
}

function describeReceivedValue(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (value === null) {
    return 'null';
  }

  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  return describeJsonReceivedValue(value);
}

function describeArmyFormationFailure(failure: unknown): string {
  if (failure instanceof Error && failure.message.length > 0) {
    return failure.message;
  }

  if (typeof failure === 'string' && failure.length > 0) {
    return failure;
  }

  return `Army formation action failed. Received ${describeReceivedValue(failure)}.`;
}

function requireWindowArmyFormationStorage(): ArmyFormationDocumentStorage {
  if (typeof window === 'undefined') {
    throw new Error('Army formation browser storage is unavailable. Received undefined window.');
  }

  const storage = window.localStorage;
  if (storage === undefined || storage === null) {
    throw new Error(
      `Army formation browser storage is unavailable. Received ${storage === undefined ? 'undefined' : 'null'}.`,
    );
  }

  return storage;
}

function isBlankArmyFormationDocument(armyDocument: ArmyFormationDocument): boolean {
  const emptySerialized = serializeArmyFormationDocument(createEmptyArmyFormationDocument());
  const receivedSerialized = serializeArmyFormationDocument(armyDocument);
  return receivedSerialized === emptySerialized;
}

function saveArmyFormationDocument(armyDocument: ArmyFormationDocument): void {
  const storage = requireWindowArmyFormationStorage();
  if (isBlankArmyFormationDocument(armyDocument)) {
    removeArmyFormationBrowserSave(storage);
    return;
  }

  writeArmyFormationBrowserSave(storage, armyDocument);
}

function readArmyFormationStorageFailureMessage(failure: unknown): string {
  if (failure instanceof Error && failure.message.length > 0) {
    return failure.message;
  }

  throw failure;
}

function requireArmyFormationRestoreDocument(
  restoreDocument: ArmyFormationDocument | null,
): ArmyFormationDocument {
  if (restoreDocument === null) {
    throw new Error('Army formation previous record is missing. Received null.');
  }

  return restoreDocument;
}

function readStoredArmyFormationStartupDocument(
  storage: ArmyFormationDocumentStorage,
): ArmyFormationDocument | null {
  return readArmyFormationBrowserSave(storage);
}

function removeBlankArmyFormationStartupDocument(
  storage: ArmyFormationDocumentStorage,
  armyDocument: ArmyFormationDocument,
): boolean {
  if (!isBlankArmyFormationDocument(armyDocument)) {
    return false;
  }

  removeArmyFormationBrowserSave(storage);
  return true;
}

function readArmyFormationStartupRecord(
  storage: ArmyFormationDocumentStorage,
): ArmyFormationStartupRecord {
  let storedDocument: ArmyFormationDocument | null;
  try {
    storedDocument = readStoredArmyFormationStartupDocument(storage);
    if (storedDocument !== null) {
      assertKnownArmyFormationIcons(storedDocument);
    }
  } catch (failure: unknown) {
    return {
      status: 'invalid',
      message: readArmyFormationStorageFailureMessage(failure),
    };
  }

  if (storedDocument === null) {
    return { status: 'absent' };
  }

  if (removeBlankArmyFormationStartupDocument(storage, storedDocument)) {
    return { status: 'absent' };
  }

  return { status: 'restore', armyDocument: storedDocument };
}

function readActiveBattlefield(armyDocument: ArmyFormationDocument): ArmyBattlefield {
  const battlefield = armyDocument.battlefields[armyDocument.activeBattlefieldIndex];
  if (battlefield === undefined) {
    throw new Error(
      `Active battlefield index ${armyDocument.activeBattlefieldIndex} is missing.`,
    );
  }

  return battlefield;
}

function rotateArmyFormationPiecesByIds(
  armyDocument: ArmyFormationDocument,
  pieceIds: readonly string[],
  rotationDegrees: number,
): ArmyFormationDocument {
  const activeBattlefield = readActiveBattlefield(armyDocument);
  const existingPieceIds = new Set(activeBattlefield.pieces.map((piece) => piece.id));
  const rotationTargetPieceIds = pieceIds.filter((pieceId) => existingPieceIds.has(pieceId));
  if (rotationTargetPieceIds.length === 0 || rotationDegrees === 0) {
    return armyDocument;
  }

  let rotatedDocument = armyDocument;
  for (const selectedPieceId of activeBattlefield.selectedPieceIds) {
    rotatedDocument = toggleArmyFormationPieceSelection(rotatedDocument, selectedPieceId);
  }
  for (const rotationTargetPieceId of rotationTargetPieceIds) {
    rotatedDocument = toggleArmyFormationPieceSelection(rotatedDocument, rotationTargetPieceId);
  }
  rotatedDocument = rotateSelectedArmyFormationPieces(rotatedDocument, rotationDegrees);
  for (const rotationTargetPieceId of rotationTargetPieceIds) {
    rotatedDocument = toggleArmyFormationPieceSelection(rotatedDocument, rotationTargetPieceId);
  }
  for (const selectedPieceId of activeBattlefield.selectedPieceIds) {
    rotatedDocument = toggleArmyFormationPieceSelection(rotatedDocument, selectedPieceId);
  }

  return rotatedDocument;
}

function prefersArmyFormationReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function readArmyFieldScaleFromPieceButton(target: HTMLButtonElement): number {
  const fieldElement = target.parentElement;
  if (fieldElement === null || !fieldElement.hasAttribute('data-army-field')) {
    throw new Error('Army formation piece is not inside a battlefield. Received a missing parent field.');
  }

  const renderedFieldWidth = fieldElement.getBoundingClientRect().width;
  const fieldScale = renderedFieldWidth / ARMY_FIELD_WIDTH_PX;
  if (!Number.isFinite(fieldScale) || fieldScale <= 0) {
    throw new Error(
      `Army formation field scale must be positive and finite. renderedFieldWidth=${renderedFieldWidth}.`,
    );
  }

  return fieldScale;
}

function assertKnownArmyFormationIcons(armyDocument: ArmyFormationDocument): void {
  for (const battlefield of armyDocument.battlefields) {
    for (const piece of battlefield.pieces) {
      requireArmyFormationCatalogIcon(piece.iconId);
    }
  }
}

function createArmyPieceId(pieces: readonly { id: string }[]): string {
  if (typeof crypto === 'undefined' || typeof crypto.randomUUID !== 'function') {
    throw new Error('crypto.randomUUID is unavailable. Received undefined.');
  }

  const pieceId = `piece-${crypto.randomUUID()}`;
  if (pieces.some((piece) => piece.id === pieceId)) {
    throw new Error(`Army formation piece id ${JSON.stringify(pieceId)} already exists.`);
  }

  return pieceId;
}

function createArmySwatchId(palette: readonly { id: string }[]): string {
  if (typeof crypto === 'undefined' || typeof crypto.randomUUID !== 'function') {
    throw new Error('crypto.randomUUID is unavailable. Received undefined.');
  }

  const swatchId = `swatch-${crypto.randomUUID()}`;
  if (palette.some((swatch) => swatch.id === swatchId)) {
    throw new Error(`Army formation palette swatch id ${JSON.stringify(swatchId)} already exists.`);
  }

  return swatchId;
}

function parseFiniteNumberDraft(inputText: string): number | null {
  const trimmed = inputText.trim();
  const parsed = Number(trimmed);
  if (trimmed.length === 0 || !Number.isFinite(parsed)) {
    return null;
  }

  return parsed;
}

function describeAngleInputError(copy: ArmyFormationCreatorCopy, inputText: string): string {
  return copy.angleInputError.replace('{received}', JSON.stringify(inputText));
}

function describeHeightInputError(copy: ArmyFormationCreatorCopy, inputText: string): string {
  return copy.heightInputError.replace('{received}', JSON.stringify(inputText));
}

function describeHeightRangeError(copy: ArmyFormationCreatorCopy, inputText: string): string {
  return copy.heightRangeError.replace('{received}', JSON.stringify(inputText));
}

function readColorInputValue(color: string): string {
  if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
    throw new Error(
      `Field background color must be # followed by 6 hex digits, received ${JSON.stringify(color)}.`,
    );
  }

  return color.toLowerCase();
}

function categoryLabel(
  copy: ArmyFormationCreatorCopy,
  categoryId: ArmyFormationIconCategoryId,
): string {
  if (categoryId === 'helmet') {
    return copy.helmets;
  }

  if (categoryId === 'weapon') {
    return copy.weapons;
  }

  if (categoryId === 'animal') {
    return copy.animals;
  }

  if (categoryId === 'vehicle') {
    return copy.vehiclesAndSiege;
  }

  if (categoryId === 'nato') {
    return copy.nato;
  }

  const unexpected: never = categoryId;
  throw new Error(`Unknown army formation icon category: ${JSON.stringify(unexpected)}`);
}

function clampPieceCoordinate(requested: number, maxIncluded: number): number {
  if (!Number.isFinite(requested)) {
    throw new Error(`Piece coordinate must be a finite number, received ${String(requested)}.`);
  }

  const snapped = Math.round(requested / ARMY_PLACEMENT_STEP_PX) * ARMY_PLACEMENT_STEP_PX;
  const snappedMax = Math.floor(maxIncluded / ARMY_PLACEMENT_STEP_PX) * ARMY_PLACEMENT_STEP_PX;
  const normalized = Object.is(snapped, -0) ? 0 : snapped;
  if (normalized < 0) {
    return 0;
  }

  if (normalized > snappedMax) {
    return snappedMax;
  }

  return normalized;
}

function moveDraggedArmyFormationPiece(
  armyDocument: ArmyFormationDocument,
  pieceId: string,
  requestedX: number,
  requestedY: number,
  fieldWidthPx: number,
): ArmyFormationDocument {
  const battlefield = readActiveBattlefield(armyDocument);
  const maxX = fieldWidthPx - ARMY_PIECE_WIDTH;
  const maxY = battlefield.heightPx - ARMY_PIECE_HEIGHT;
  if (maxX < 0 || maxY < 0) {
    throw new Error(
      `Field cannot hold a piece. fieldWidthPx=${fieldWidthPx} heightPx=${battlefield.heightPx}.`,
    );
  }

  return moveArmyFormationPiece(
    armyDocument,
    pieceId,
    clampPieceCoordinate(requestedX, maxX),
    clampPieceCoordinate(requestedY, maxY),
    fieldWidthPx,
  );
}

function unusedProbePieceId(pieces: readonly { id: string }[]): string {
  const usedIds = new Set(pieces.map((piece) => piece.id));
  const probeLimit = pieces.length + 1;
  for (let index = 0; index < probeLimit; index += 1) {
    const probeId = `empty-slot-probe-${index}`;
    if (!usedIds.has(probeId)) {
      return probeId;
    }
  }

  throw new Error(`Could not allocate an empty-slot probe id. pieceCount=${pieces.length}.`);
}

function isNoOpenPiecePosition(failure: unknown): boolean {
  return failure instanceof Error && failure.message.startsWith('No open position for a new piece');
}

function readNextEmptySlot(
  armyDocument: ArmyFormationDocument,
  fieldWidthPx: number,
): EmptySlot | null {
  const battlefield = readActiveBattlefield(armyDocument);
  const probeId = unusedProbePieceId(battlefield.pieces);
  try {
    const probed = addArmyFormationPiece(armyDocument, 'helmet-01', probeId, fieldWidthPx);
    const probe = readActiveBattlefield(probed).pieces.find((piece) => piece.id === probeId);
    if (probe === undefined) {
      throw new Error(`Army formation piece id ${JSON.stringify(probeId)} was not found.`);
    }

    return { x: probe.x, y: probe.y };
  } catch (failure: unknown) {
    if (isNoOpenPiecePosition(failure)) {
      return null;
    }

    throw failure;
  }
}

function toImagePiece(piece: ArmyFormationPiece): ArmyFormationImagePiece {
  return {
    iconSvgMarkup: requireArmyFormationCatalogIcon(piece.iconId).svgMarkup,
    x: piece.x,
    y: piece.y,
    rotationDegrees: piece.rotationDegrees,
    backgroundColor: piece.backgroundColor,
  };
}

function buildActiveBattlefieldImageScene(
  armyDocument: ArmyFormationDocument,
  fieldWidthPx: number,
): ArmyFormationImageScene {
  const battlefield = readActiveBattlefield(armyDocument);
  return {
    widthPx: fieldWidthPx,
    heightPx: battlefield.heightPx,
    fieldBackgroundColor: battlefield.fieldBackgroundColor,
    backgroundImageUrl: battlefield.backgroundImageUrl,
    pieces: battlefield.pieces.map(toImagePiece),
  };
}

function downloadArmyFormationFile(filename: string, fileBlob: Blob): void {
  if (typeof document === 'undefined' || document.body === null) {
    throw new Error('Army formation download requires document.body. Received null.');
  }
  if (typeof Blob === 'undefined' || !(fileBlob instanceof Blob)) {
    throw new Error(
      `Army formation download requires a Blob. fileBlob=${typeof fileBlob === 'undefined' ? 'undefined' : String(fileBlob)}`,
    );
  }

  if (typeof URL.createObjectURL !== 'function' || typeof URL.revokeObjectURL !== 'function') {
    throw new Error('URL.createObjectURL is unavailable. Received undefined.');
  }

  const objectUrl = URL.createObjectURL(fileBlob);
  try {
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = filename;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function capturePiecePointer(target: HTMLButtonElement, pointerId: number): void {
  if (typeof target.setPointerCapture !== 'function') {
    return;
  }

  try {
    target.setPointerCapture(pointerId);
  } catch (failure: unknown) {
    if (failure instanceof DOMException && failure.name === 'NotFoundError') {
      return;
    }

    throw failure;
  }
}

async function readArmyFormationFile(file: File): Promise<ArmyFormationDocument> {
  const serialized = await file.text();
  if (typeof serialized !== 'string') {
    throw new Error(
      `Army formation file text must be a string, received ${describeReceivedValue(serialized)}.`,
    );
  }

  const loaded = parseArmyFormationDocument(serialized);
  assertKnownArmyFormationIcons(loaded);
  return loaded;
}

function readFirstChosenFile(input: HTMLInputElement): File | null {
  const fileList = input.files;
  if (fileList === null || fileList.length === 0) {
    return null;
  }

  const file = fileList[0];
  if (file === undefined) {
    throw new Error('Chosen army formation file is missing. Received undefined.');
  }

  return file;
}

function openFilePicker(input: HTMLInputElement | null): void {
  if (input === null) {
    throw new Error('Army formation file input is missing. Received null.');
  }

  input.click();
}

function ArmyFormationFailure({
  message,
  dismissLabel,
  onDismiss,
}: {
  message: string;
  dismissLabel: string;
  onDismiss: () => void;
}) {
  return (
    <div className="fixed bottom-4 right-4 z-[70] flex max-h-[calc(100dvh-2rem)] max-w-[min(24rem,calc(100vw-2rem))] items-start gap-3 rounded-md border border-[var(--site-accent-strong)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--site-ink-strong)] shadow-lg">
      <p
        role="alert"
        className="min-w-0 max-h-[calc(100dvh-4rem)] flex-1 overflow-y-auto overscroll-contain break-words"
      >
        {message}
      </p>
      <button
        type="button"
        className="shrink-0 rounded px-1 py-0.5 text-xs underline underline-offset-2"
        onClick={onDismiss}
      >
        {dismissLabel}
      </button>
    </div>
  );
}

function describeArmyBackgroundImageUploadFailure(
  result: Extract<ArmyBackgroundImageUploadResult, { status: 'rejected' }>,
  copy: ArmyFormationCreatorCopy,
): string {
  let message: string;
  switch (result.reason) {
    case 'unsupported-format':
      message = copy.backgroundImageFormatError;
      break;
    case 'file-too-large':
      message = copy.backgroundImageSizeError;
      break;
    case 'empty-file':
      message = copy.backgroundImageEmptyError;
      break;
    case 'decode-failed':
      message = copy.backgroundImageDecodeError;
      break;
    case 'compression-failed':
      message = copy.backgroundImageCompressError;
      break;
  }

  return message.replace('{received}', result.received);
}

function ArmyFormationControlGroup({ title, children }: { title: string; children: ReactNode }) {
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="space-y-3">
      <h2 id={titleId} className="text-base font-semibold text-[var(--site-ink-strong)]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function ArmyFormationCategoryTabs({
  copy,
  activeCategoryId,
  onCategory,
}: {
  copy: ArmyFormationCreatorCopy;
  activeCategoryId: ArmyFormationIconCategoryId;
  onCategory: (categoryId: ArmyFormationIconCategoryId) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      {listArmyFormationIconCategories().map((categoryId) => {
        const selected = categoryId === activeCategoryId;
        return (
          <button
            key={categoryId}
            type="button"
            aria-pressed={selected}
            className={cn(
              'min-w-0 cursor-pointer whitespace-normal rounded-md border px-2 py-2 text-center text-sm leading-tight transition-colors enabled:hover:shadow-sm',
              selected
                ? 'border-[var(--site-accent-strong)] bg-[var(--site-accent-bg)] text-[var(--site-accent-strong)]'
                : 'border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] text-[var(--site-ink)] enabled:hover:border-[var(--site-accent-strong)] enabled:hover:bg-[var(--site-accent-bg)] enabled:hover:text-[var(--site-accent-strong)]',
            )}
            onClick={() => onCategory(categoryId)}
          >
            {categoryLabel(copy, categoryId)}
          </button>
        );
      })}
    </div>
  );
}

function readNatoIconPageCount(iconCount: number): number {
  if (!Number.isInteger(iconCount) || iconCount < 1) {
    throw new Error(`NATO icon count must be a positive integer. Received ${String(iconCount)}.`);
  }

  return Math.ceil(iconCount / ARMY_FORMATION_NATO_ICONS_PER_PAGE);
}

function readNatoIconPage(
  icons: readonly ArmyFormationCatalogIcon[],
  pageIndex: number,
): readonly ArmyFormationCatalogIcon[] {
  const pageCount = readNatoIconPageCount(icons.length);
  if (!Number.isInteger(pageIndex) || pageIndex < 0 || pageIndex >= pageCount) {
    throw new Error(
      `NATO icon page index must be an integer from 0 to ${pageCount - 1}. Received ${String(pageIndex)}.`,
    );
  }

  const startIndex = pageIndex * ARMY_FORMATION_NATO_ICONS_PER_PAGE;
  const pageIcons = icons.slice(startIndex, startIndex + ARMY_FORMATION_NATO_ICONS_PER_PAGE);
  if (pageIcons.length === 0) {
    throw new Error(`NATO icon page ${pageIndex} is empty. Icon count is ${icons.length}.`);
  }

  return pageIcons;
}

function stepNatoIconPageIndex(pageIndex: number, pageCount: number, direction: -1 | 1): number {
  if (!Number.isInteger(pageCount) || pageCount < 1) {
    throw new Error(`NATO icon page count must be a positive integer. Received ${String(pageCount)}.`);
  }
  if (!Number.isInteger(pageIndex) || pageIndex < 0 || pageIndex >= pageCount) {
    throw new Error(
      `NATO icon page index must be an integer from 0 to ${pageCount - 1}. Received ${String(pageIndex)}.`,
    );
  }

  const nextPageIndex = pageIndex + direction;
  if (nextPageIndex < 0 || nextPageIndex >= pageCount) {
    throw new Error(
      `NATO icon page index must stay inside 0..${pageCount - 1}. Received ${nextPageIndex}.`,
    );
  }

  return nextPageIndex;
}

function readVisibleArmyFormationIcons(
  categoryId: ArmyFormationIconCategoryId,
  icons: readonly ArmyFormationCatalogIcon[],
  natoIconPageIndex: number,
): readonly ArmyFormationCatalogIcon[] {
  if (categoryId !== 'nato') {
    return icons;
  }

  return readNatoIconPage(icons, natoIconPageIndex);
}

function ArmyFormationIconButton({
  icon,
  onPlace,
}: {
  icon: ArmyFormationCatalogIcon;
  onPlace: (iconId: string) => void;
}) {
  return (
    <button
      type="button"
      aria-label={icon.id}
      className="inline-flex h-9 w-14 cursor-pointer items-center justify-center rounded-sm border border-[var(--site-border-strong)] bg-[var(--site-card-plain-top)] p-0.5 text-[var(--site-ink-strong)] transition-colors hover:border-[var(--site-accent-strong)] hover:bg-[var(--site-accent-bg)] hover:text-[var(--site-accent-strong)] hover:shadow-sm"
      onClick={() => onPlace(icon.id)}
    >
      <span
        className="pointer-events-none block h-full w-full [&_svg]:h-full [&_svg]:w-full"
        style={{ filter: ARMY_FORMATION_ICON_THUMBNAIL_FILTER }}
        dangerouslySetInnerHTML={{ __html: icon.svgMarkup }}
      />
    </button>
  );
}

function ArmyFormationNatoIconPager({
  copy,
  pageIndex,
  pageCount,
  onPreviousPage,
  onNextPage,
}: {
  copy: ArmyFormationCreatorCopy;
  pageIndex: number;
  pageCount: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}) {
  if (!Number.isInteger(pageCount) || pageCount < 1) {
    throw new Error(`NATO icon page count must be a positive integer. Received ${String(pageCount)}.`);
  }
  if (!Number.isInteger(pageIndex) || pageIndex < 0 || pageIndex >= pageCount) {
    throw new Error(
      `NATO icon page index must be an integer from 0 to ${pageCount - 1}. Received ${String(pageIndex)}.`,
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        className={cn(ARMY_FORMATION_BUTTON_CLASS, 'disabled:cursor-not-allowed disabled:opacity-40')}
        disabled={pageIndex === 0}
        onClick={onPreviousPage}
      >
        {copy.previousNatoIconPage}
      </button>
      <p className="min-w-12 text-center text-sm text-[var(--site-ink)]">
        {pageIndex + 1} / {pageCount}
      </p>
      <button
        type="button"
        className={cn(ARMY_FORMATION_BUTTON_CLASS, 'disabled:cursor-not-allowed disabled:opacity-40')}
        disabled={pageIndex === pageCount - 1}
        onClick={onNextPage}
      >
        {copy.nextNatoIconPage}
      </button>
    </div>
  );
}

function ArmyFormationIconShelf({
  copy,
  categoryId,
  onPlace,
}: {
  copy: ArmyFormationCreatorCopy;
  categoryId: ArmyFormationIconCategoryId;
  onPlace: (iconId: string) => void;
}) {
  const icons = listArmyFormationIconsInCategory(categoryId);
  const [natoIconPageIndex, setNatoIconPageIndex] = useState(0);
  const [natoIconPageCategoryId, setNatoIconPageCategoryId] = useState(categoryId);
  let visibleNatoIconPageIndex = natoIconPageIndex;
  if (natoIconPageCategoryId !== categoryId) {
    setNatoIconPageCategoryId(categoryId);
    setNatoIconPageIndex(0);
    visibleNatoIconPageIndex = 0;
  }

  const visibleIcons = readVisibleArmyFormationIcons(categoryId, icons, visibleNatoIconPageIndex);
  const natoIconPageCount = categoryId === 'nato' ? readNatoIconPageCount(icons.length) : null;

  function onPreviousNatoIconPage() {
    if (natoIconPageCount === null) {
      throw new Error(
        `NATO icon pages are only available for the nato category. Received ${JSON.stringify(categoryId)}.`,
      );
    }
    setNatoIconPageIndex(stepNatoIconPageIndex(visibleNatoIconPageIndex, natoIconPageCount, -1));
  }

  function onNextNatoIconPage() {
    if (natoIconPageCount === null) {
      throw new Error(
        `NATO icon pages are only available for the nato category. Received ${JSON.stringify(categoryId)}.`,
      );
    }
    setNatoIconPageIndex(stepNatoIconPageIndex(visibleNatoIconPageIndex, natoIconPageCount, 1));
  }

  return (
    <div className="space-y-2">
      <div className="rounded-md border border-[var(--site-border-soft)] bg-[var(--site-panel-strong)] p-2">
        <div
          className={cn(
            'flex content-start flex-wrap gap-1 overflow-hidden',
            ARMY_FORMATION_ICON_SHELF_MAX_HEIGHT_CLASS,
          )}
        >
          {visibleIcons.map((icon) => (
            <ArmyFormationIconButton key={icon.id} icon={icon} onPlace={onPlace} />
          ))}
        </div>
      </div>
      {natoIconPageCount !== null ? (
        <ArmyFormationNatoIconPager
          copy={copy}
          pageIndex={visibleNatoIconPageIndex}
          pageCount={natoIconPageCount}
          onPreviousPage={onPreviousNatoIconPage}
          onNextPage={onNextNatoIconPage}
        />
      ) : null}
    </div>
  );
}

function ArmyFormationColorControls({
  copy,
  colorText,
  palette,
  selectedSwatchId,
  onColorText,
  onAddColor,
  onDeleteColor,
  onSelectSwatch,
}: {
  copy: ArmyFormationCreatorCopy;
  colorText: string;
  palette: readonly ArmyPaletteSwatch[];
  selectedSwatchId: string | null;
  onColorText: (value: string) => void;
  onAddColor: () => void;
  onDeleteColor: () => void;
  onSelectSwatch: (swatchId: string) => void;
}) {
  return (
    <ArmyFormationControlGroup title={copy.color}>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="color"
          aria-label={copy.color}
          className="h-9 w-9 cursor-pointer rounded-md border border-[var(--site-border-strong)] bg-[var(--site-panel-strong)] transition-colors hover:border-[var(--site-accent-strong)] hover:bg-[var(--site-accent-bg)]"
          value={colorText}
          onChange={(event) => onColorText(event.target.value)}
        />
        <button type="button" className={ARMY_FORMATION_BUTTON_CLASS} onClick={onAddColor}>
          {copy.addToPalette}
        </button>
        <button type="button" className={ARMY_FORMATION_BUTTON_CLASS} onClick={onDeleteColor}>
          {copy.deleteSelectedColor}
        </button>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-[var(--site-ink)]">{copy.palette}</p>
        <div className="flex flex-wrap gap-2">
          {palette.map((swatch) => {
            const selected = swatch.id === selectedSwatchId;
            return (
              <button
                key={swatch.id}
                type="button"
                aria-label={`${copy.palette} ${swatch.color} ${swatch.id}`}
                aria-pressed={selected}
                className={cn(
                  'relative z-0 h-7 w-7 cursor-pointer rounded-sm border transition-transform enabled:hover:z-10 enabled:hover:scale-105 enabled:hover:outline enabled:hover:outline-2 enabled:hover:outline-[var(--site-accent-strong)]',
                  selected
                    ? 'border-[var(--site-accent-strong)] outline outline-2 outline-[var(--site-accent-strong)]'
                    : 'border-[var(--site-border-strong)]',
                )}
                style={{ backgroundColor: swatch.color }}
                onClick={() => onSelectSwatch(swatch.id)}
              />
            );
          })}
        </div>
      </div>
    </ArmyFormationControlGroup>
  );
}

function ArmyFormationPieceControls({
  copy,
  angleText,
  angleInputErrorMessage,
  onAngleText,
  onAngleBlur,
  onDeletePieces,
  onResetRotation,
}: {
  copy: ArmyFormationCreatorCopy;
  angleText: string;
  angleInputErrorMessage: string | null;
  onAngleText: (value: string) => void;
  onAngleBlur: (value: string) => void;
  onDeletePieces: () => void;
  onResetRotation: () => void;
}) {
  const angleInputErrorId = useId();

  return (
    <ArmyFormationControlGroup title={copy.changeSelectedPieces}>
      <button type="button" className={ARMY_FORMATION_BUTTON_CLASS} onClick={onDeletePieces}>
        {copy.deleteSelected}
      </button>
      <div className="flex flex-wrap items-start gap-2">
        <div className="flex min-w-0 flex-col gap-1">
          <label className="flex items-center gap-2 text-sm text-[var(--site-ink)]">
            <span>{copy.angle}</span>
            <input
              className={`${ARMY_FORMATION_INPUT_CLASS} w-20`}
              type="number"
              value={angleText}
              aria-invalid={angleInputErrorMessage !== null}
              aria-describedby={angleInputErrorMessage !== null ? angleInputErrorId : undefined}
              onChange={(event) => onAngleText(event.target.value)}
              onBlur={(event) => onAngleBlur(event.currentTarget.value)}
            />
          </label>
          {angleInputErrorMessage !== null ? (
            <p
              id={angleInputErrorId}
              role="alert"
              className="break-words text-xs text-[var(--site-accent-strong)]"
            >
              {angleInputErrorMessage}
            </p>
          ) : null}
        </div>
        <button type="button" className={ARMY_FORMATION_BUTTON_CLASS} onClick={onResetRotation}>
          {copy.resetSelectedRotation}
        </button>
      </div>
    </ArmyFormationControlGroup>
  );
}

function ArmyFormationFieldControls({
  copy,
  heightText,
  heightInputErrorMessage,
  fieldBackgroundColorText,
  backgroundImageUrl,
  backgroundImageFailureMessage,
  backgroundImageInputRef,
  onHeightBlur,
  onHeightText,
  onResetHeight,
  onFieldBackgroundColorChange,
  onResetFieldBackgroundColor,
  onOpenBackgroundImagePicker,
  onBackgroundImageReadFailure,
  onChooseBackgroundImage,
  onRemoveBackgroundImage,
  onClear,
}: {
  copy: ArmyFormationCreatorCopy;
  heightText: string;
  heightInputErrorMessage: string | null;
  fieldBackgroundColorText: string;
  backgroundImageUrl: string;
  backgroundImageFailureMessage: string | null;
  backgroundImageInputRef: RefObject<HTMLInputElement | null>;
  onHeightBlur: (value: string) => void;
  onHeightText: (value: string) => void;
  onResetHeight: () => void;
  onFieldBackgroundColorChange: (value: string) => void;
  onResetFieldBackgroundColor: () => void;
  onOpenBackgroundImagePicker: () => void;
  onBackgroundImageReadFailure: (failure: unknown) => void;
  onChooseBackgroundImage: (file: File) => void;
  onRemoveBackgroundImage: () => void;
  onClear: () => void;
}) {
  const heightInputErrorId = useId();

  return (
    <ArmyFormationControlGroup title={copy.changeBattlefield}>
      <button type="button" className={ARMY_FORMATION_BUTTON_CLASS} onClick={onClear}>
        {copy.clearBattlefield}
      </button>
      <div className="flex flex-wrap items-start gap-2">
        <div className="flex min-w-0 flex-col gap-1">
          <label className="flex items-center gap-2 text-sm text-[var(--site-ink)]">
            <span>{copy.height}</span>
            <input
              className={`${ARMY_FORMATION_INPUT_CLASS} w-20`}
              type="number"
              value={heightText}
              aria-invalid={heightInputErrorMessage !== null}
              aria-describedby={heightInputErrorMessage !== null ? heightInputErrorId : undefined}
              onChange={(event) => onHeightText(event.target.value)}
              onBlur={(event) => onHeightBlur(event.currentTarget.value)}
            />
          </label>
          {heightInputErrorMessage !== null ? (
            <p
              id={heightInputErrorId}
              role="alert"
              className="break-words text-xs text-[var(--site-accent-strong)]"
            >
              {heightInputErrorMessage}
            </p>
          ) : null}
        </div>
        <button type="button" className={ARMY_FORMATION_BUTTON_CLASS} onClick={onResetHeight}>
          {copy.resetHeight}
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="color"
          aria-label={copy.changeBackgroundColor}
          className="h-9 w-9 cursor-pointer rounded-md border border-[var(--site-border-strong)] bg-[var(--site-panel-strong)] transition-colors hover:border-[var(--site-accent-strong)] hover:bg-[var(--site-accent-bg)]"
          value={fieldBackgroundColorText}
          onChange={(event) => onFieldBackgroundColorChange(event.target.value)}
        />
        <button
          type="button"
          className={ARMY_FORMATION_BUTTON_CLASS}
          onClick={onResetFieldBackgroundColor}
        >
          {copy.resetBackgroundColor}
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-[var(--site-ink)]">{copy.backgroundImage}</span>
        <input
          ref={backgroundImageInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
          className="sr-only"
          aria-label={copy.backgroundImage}
          tabIndex={-1}
          onChange={(event) => {
            const input = event.currentTarget;
            let file: File | null;
            try {
              file = readFirstChosenFile(input);
            } catch (failure: unknown) {
              input.value = '';
              onBackgroundImageReadFailure(failure);
              return;
            }

            input.value = '';
            if (file !== null) {
              onChooseBackgroundImage(file);
            }
          }}
        />
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className={`${ARMY_FORMATION_BUTTON_CLASS} w-fit shrink-0`}
            onClick={onOpenBackgroundImagePicker}
          >
            {copy.uploadBackgroundImage}
          </button>
          {backgroundImageUrl !== '' ? (
            <button
              type="button"
              className={`${ARMY_FORMATION_BUTTON_CLASS} w-fit shrink-0`}
              onClick={onRemoveBackgroundImage}
            >
              {copy.removeBackgroundImage}
            </button>
          ) : null}
        </div>
        {backgroundImageFailureMessage !== null ? (
          <p role="alert" className="text-xs text-[var(--site-accent-strong)]">
            {backgroundImageFailureMessage}
          </p>
        ) : null}
        <p className="text-xs text-[var(--site-ink-soft)]">{copy.backgroundImageFormats}</p>
      </div>
    </ArmyFormationControlGroup>
  );
}

function ArmyFormationFileChooser({
  label,
  inputRef,
  onOpenFilePicker,
  onReadFailure,
  onChooseFile,
}: {
  label: string;
  inputRef: RefObject<HTMLInputElement | null>;
  onOpenFilePicker: () => void;
  onReadFailure: (failure: unknown) => void;
  onChooseFile: (file: File) => void;
}) {
  return (
    <>
      <button type="button" className={`${ARMY_FORMATION_BUTTON_CLASS} w-full min-w-0`} onClick={onOpenFilePicker}>
        {label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".txt,.json,text/plain,application/json"
        className="sr-only"
        aria-label={label}
        tabIndex={-1}
        onChange={(event) => {
          const input = event.currentTarget;
          let file: File | null;
          try {
            file = readFirstChosenFile(input);
          } catch (failure: unknown) {
            input.value = '';
            onReadFailure(failure);
            return;
          }

          input.value = '';
          if (file === null) {
            return;
          }

          onChooseFile(file);
        }}
      />
    </>
  );
}

function ArmyFormationTransferControls({
  copy,
  inputRef,
  fileOperationFailureMessage,
  onOpenFilePicker,
  onFileReadFailure,
  onExportFile,
  onExportPng,
  onChooseFile,
}: {
  copy: ArmyFormationCreatorCopy;
  inputRef: RefObject<HTMLInputElement | null>;
  fileOperationFailureMessage: string | null;
  onOpenFilePicker: () => void;
  onFileReadFailure: (failure: unknown) => void;
  onExportFile: () => void;
  onExportPng: () => void;
  onChooseFile: (file: File) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-3 gap-2">
        <button type="button" className={`${ARMY_FORMATION_BUTTON_CLASS} w-full min-w-0`} onClick={onExportFile}>
          {copy.exportFile}
        </button>
        <button type="button" className={`${ARMY_FORMATION_BUTTON_CLASS} w-full min-w-0`} onClick={onExportPng}>
          {copy.exportPng}
        </button>
        <ArmyFormationFileChooser
          label={copy.chooseFile}
          inputRef={inputRef}
          onOpenFilePicker={onOpenFilePicker}
          onReadFailure={onFileReadFailure}
          onChooseFile={onChooseFile}
        />
      </div>
      {fileOperationFailureMessage !== null ? (
        <p role="alert" className="break-words text-xs text-[var(--site-accent-strong)]">
          {fileOperationFailureMessage}
        </p>
      ) : null}
    </div>
  );
}

function ArmyFormationPieceButton({
  piece,
  selected,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onClick,
}: {
  piece: ArmyFormationPiece;
  selected: boolean;
  onPointerDown: (event: PointerEvent<HTMLButtonElement>, piece: ArmyFormationPiece) => void;
  onPointerMove: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerCancel: (event: PointerEvent<HTMLButtonElement>) => void;
  onClick: (pieceId: string) => void;
}) {
  const icon = requireArmyFormationCatalogIcon(piece.iconId);
  return (
    <button
      type="button"
      data-army-piece=""
      data-piece-x={piece.x}
      data-piece-y={piece.y}
      data-rotation-degrees={piece.rotationDegrees}
      aria-label={piece.id}
      aria-pressed={selected}
      className={cn(
        'absolute cursor-pointer touch-none p-0 text-[oklch(0.29_0.03_72)] transition-[filter,outline-color] hover:brightness-110 hover:outline-2 hover:outline-[var(--site-accent-strong)]',
        selected
          ? 'z-20 outline outline-2 outline-[var(--site-accent-strong)]'
          : 'z-10 outline outline-1 outline-[var(--site-border-strong)]',
      )}
      style={{
        left: piece.x,
        top: piece.y,
        width: ARMY_PIECE_WIDTH,
        height: ARMY_PIECE_HEIGHT,
        backgroundColor: piece.backgroundColor,
        transform: `rotate(${piece.rotationDegrees}deg)`,
      }}
      onPointerDown={(event) => onPointerDown(event, piece)}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onClick={() => onClick(piece.id)}
    >
      <span
        className="pointer-events-none block h-full w-full [&_svg]:h-full [&_svg]:w-full"
        dangerouslySetInnerHTML={{ __html: icon.svgMarkup }}
      />
    </button>
  );
}

function ArmyFormationEmptySlot({ slot, label }: { slot: EmptySlot; label: string }) {
  return (
    <div
      className="pointer-events-none absolute z-0 flex items-center justify-center border border-dashed border-[oklch(0.29_0.03_72)] text-center text-[9px] leading-tight text-[oklch(0.29_0.03_72)]"
      style={{ left: slot.x, top: slot.y, width: ARMY_PIECE_WIDTH, height: ARMY_PIECE_HEIGHT }}
    >
      {label}
    </div>
  );
}

function ArmyFormationStepButton({
  label,
  glyph,
  columnClass,
  onStep,
}: {
  label: string;
  glyph: string;
  columnClass: string;
  onStep: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        columnClass,
        'row-start-2 h-40 cursor-pointer self-center rounded-md border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] text-2xl text-[var(--site-ink)] transition-colors hover:border-[var(--site-accent-strong)] hover:bg-[var(--site-accent-bg)] hover:text-[var(--site-accent-strong)]',
      )}
      onClick={onStep}
    >
      <span aria-hidden="true">{glyph}</span>
    </button>
  );
}

function ArmyFormationBattlefieldTransferRow({
  copy,
  fileInputRef,
  fileOperationFailureMessage,
  onOpenFilePicker,
  onFileReadFailure,
  onExportFile,
  onExportPng,
  onChooseFile,
}: {
  copy: ArmyFormationCreatorCopy;
  fileInputRef: RefObject<HTMLInputElement | null>;
  fileOperationFailureMessage: string | null;
  onOpenFilePicker: () => void;
  onFileReadFailure: (failure: unknown) => void;
  onExportFile: () => void;
  onExportPng: () => void;
  onChooseFile: (file: File) => void;
}) {
  return (
    <div className="col-start-2 row-start-3 flex min-w-0 flex-col gap-3">
      <ArmyFormationTransferControls
        copy={copy}
        inputRef={fileInputRef}
        fileOperationFailureMessage={fileOperationFailureMessage}
        onOpenFilePicker={onOpenFilePicker}
        onFileReadFailure={onFileReadFailure}
        onExportFile={onExportFile}
        onExportPng={onExportPng}
        onChooseFile={onChooseFile}
      />
    </div>
  );
}

function ArmyFormationBattlefieldCanvas({
  copy,
  battlefield,
  emptySlot,
  fieldScale,
  onPiecePointerDown,
  onPiecePointerMove,
  onPiecePointerUp,
  onPiecePointerCancel,
  onPieceClick,
}: {
  copy: ArmyFormationCreatorCopy;
  battlefield: ArmyBattlefield;
  emptySlot: EmptySlot | null;
  fieldScale: number;
  onPiecePointerDown: (event: PointerEvent<HTMLButtonElement>, piece: ArmyFormationPiece) => void;
  onPiecePointerMove: (event: PointerEvent<HTMLButtonElement>) => void;
  onPiecePointerUp: (event: PointerEvent<HTMLButtonElement>) => void;
  onPiecePointerCancel: (event: PointerEvent<HTMLButtonElement>) => void;
  onPieceClick: (pieceId: string) => void;
}) {
  return (
    <div
      data-army-field=""
      data-field-height={battlefield.heightPx}
      className="relative origin-top-left"
      style={{
        width: ARMY_FIELD_WIDTH_PX,
        height: battlefield.heightPx,
        backgroundColor: battlefield.fieldBackgroundColor,
        transform: `scale(${fieldScale})`,
        transformOrigin: 'top left',
      }}
    >
      {battlefield.backgroundImageUrl !== '' ? (
        // Battlefield background comes from a URL the user pasted.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt=""
          src={battlefield.backgroundImageUrl}
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
        />
      ) : null}
      {emptySlot !== null ? <ArmyFormationEmptySlot slot={emptySlot} label={copy.emptySlot} /> : null}
      {battlefield.pieces.map((piece) => (
        <ArmyFormationPieceButton
          key={piece.id}
          piece={piece}
          selected={battlefield.selectedPieceIds.includes(piece.id)}
          onPointerDown={onPiecePointerDown}
          onPointerMove={onPiecePointerMove}
          onPointerUp={onPiecePointerUp}
          onPointerCancel={onPiecePointerCancel}
          onClick={onPieceClick}
        />
      ))}
    </div>
  );
}

function ArmyFormationBattlefieldPane({
  copy,
  battlefield,
  emptySlot,
  activeBattlefieldIndex,
  battlefieldCount,
  slide,
  fileInputRef,
  fileOperationFailureMessage,
  onOpenFilePicker,
  onFileReadFailure,
  onExportFile,
  onExportPng,
  onChooseFile,
  onStepPrevious,
  onStepNext,
  onSlideFinished,
  onPiecePointerDown,
  onPiecePointerMove,
  onPiecePointerUp,
  onPiecePointerCancel,
  onPieceClick,
}: {
  copy: ArmyFormationCreatorCopy;
  battlefield: ArmyBattlefield;
  emptySlot: EmptySlot | null;
  activeBattlefieldIndex: number;
  battlefieldCount: number;
  slide: ArmyFormationBattlefieldSlide | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  fileOperationFailureMessage: string | null;
  onOpenFilePicker: () => void;
  onFileReadFailure: (failure: unknown) => void;
  onExportFile: () => void;
  onExportPng: () => void;
  onChooseFile: (file: File) => void;
  onStepPrevious: () => void;
  onStepNext: () => void;
  onSlideFinished: (slideId: number) => void;
  onPiecePointerDown: (event: PointerEvent<HTMLButtonElement>, piece: ArmyFormationPiece) => void;
  onPiecePointerMove: (event: PointerEvent<HTMLButtonElement>) => void;
  onPiecePointerUp: (event: PointerEvent<HTMLButtonElement>) => void;
  onPiecePointerCancel: (event: PointerEvent<HTMLButtonElement>) => void;
  onPieceClick: (pieceId: string) => void;
}) {
  const fieldViewportRef = useRef<HTMLDivElement | null>(null);
  const [fieldViewportWidth, setFieldViewportWidth] = useState(ARMY_FIELD_WIDTH_PX);
  const [movingSlideId, setMovingSlideId] = useState<number | null>(null);
  const slideId = slide?.id ?? null;

  useEffect(() => {
    const fieldViewport = fieldViewportRef.current;
    if (fieldViewport === null) {
      throw new Error('Army formation field viewport is missing. Received null ref.');
    }

    function updateFieldViewportWidth(width: number): void {
      if (!Number.isFinite(width) || width < 0) {
        throw new Error(`Army formation viewport width must be finite and nonnegative. Received ${String(width)}.`);
      }

      setFieldViewportWidth((currentWidth) => (currentWidth === width ? currentWidth : width));
    }

    updateFieldViewportWidth(fieldViewport.clientWidth);
    if (typeof ResizeObserver === 'function') {
      const viewportObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry === undefined) {
          throw new Error('Army formation viewport observer returned no entries. Received an empty list.');
        }

        updateFieldViewportWidth(entry.contentRect.width);
      });
      viewportObserver.observe(fieldViewport);
      return () => viewportObserver.disconnect();
    }

    const updateFieldViewportFromWindow = () => updateFieldViewportWidth(fieldViewport.clientWidth);
    window.addEventListener('resize', updateFieldViewportFromWindow);
    return () => window.removeEventListener('resize', updateFieldViewportFromWindow);
  }, []);

  useEffect(() => {
    if (slideId === null) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => setMovingSlideId(slideId));
    return () => window.cancelAnimationFrame(animationFrame);
  }, [slideId]);

  useEffect(() => {
    if (slideId === null || movingSlideId !== slideId) {
      return;
    }

    const cleanupTimer = window.setTimeout(
      () => onSlideFinished(slideId),
      ARMY_BATTLEFIELD_SLIDE_CLEANUP_DELAY_MS,
    );
    return () => window.clearTimeout(cleanupTimer);
  }, [movingSlideId, onSlideFinished, slideId]);

  const fieldScale = fieldViewportWidth > 0 ? fieldViewportWidth / ARMY_FIELD_WIDTH_PX : 1;
  const renderedFieldHeight = battlefield.heightPx * fieldScale;
  const slideIsMoving = slide !== null && movingSlideId === slide.id;
  const outgoingOffset = slide === null || !slideIsMoving ? 0 : -slide.direction * 100;
  const incomingOffset = slide === null ? 0 : slideIsMoving ? 0 : slide.direction * 100;

  return (
    <div className="grid min-w-0 flex-1 grid-cols-[2.25rem_minmax(0,1fr)_2.25rem] gap-x-2 gap-y-2">
      <h2
        className="col-start-2 text-sm font-semibold text-[var(--site-ink-strong)]"
        aria-live="polite"
        aria-atomic="true"
      >
        {copy.battlefield} {activeBattlefieldIndex + 1}/{battlefieldCount}
      </h2>
      <ArmyFormationStepButton
        label={copy.switchToPreviousBattle}
        glyph="<"
        columnClass="col-start-1"
        onStep={onStepPrevious}
      />
      <div
        ref={fieldViewportRef}
        className="col-start-2 row-start-2 min-w-0 overflow-hidden rounded-md border border-[var(--site-border-strong)]"
      >
        <div className="relative w-full" style={{ height: renderedFieldHeight }}>
          {slide === null ? (
            <ArmyFormationBattlefieldCanvas
              copy={copy}
              battlefield={battlefield}
              emptySlot={emptySlot}
              fieldScale={fieldScale}
              onPiecePointerDown={onPiecePointerDown}
              onPiecePointerMove={onPiecePointerMove}
              onPiecePointerUp={onPiecePointerUp}
              onPiecePointerCancel={onPiecePointerCancel}
              onPieceClick={onPieceClick}
            />
          ) : (
            <>
              <div
                key={`outgoing-${slide.id}`}
                aria-hidden="true"
                inert
                className="pointer-events-none absolute inset-y-0 left-0 w-full overflow-hidden transition-transform duration-[280ms] ease-in-out motion-reduce:duration-0 motion-reduce:transition-none"
                style={{ transform: `translateX(${outgoingOffset}%)` }}
              >
                <ArmyFormationBattlefieldCanvas
                  copy={copy}
                  battlefield={slide.outgoingBattlefield}
                  emptySlot={slide.outgoingEmptySlot}
                  fieldScale={fieldScale}
                  onPiecePointerDown={onPiecePointerDown}
                  onPiecePointerMove={onPiecePointerMove}
                  onPiecePointerUp={onPiecePointerUp}
                  onPiecePointerCancel={onPiecePointerCancel}
                  onPieceClick={onPieceClick}
                />
              </div>
              <div
                key={`incoming-${slide.id}`}
                aria-hidden="true"
                inert
                className="pointer-events-none absolute inset-y-0 left-0 w-full overflow-hidden transition-transform duration-[280ms] ease-in-out motion-reduce:duration-0 motion-reduce:transition-none"
                style={{ transform: `translateX(${incomingOffset}%)` }}
              >
                <ArmyFormationBattlefieldCanvas
                  copy={copy}
                  battlefield={battlefield}
                  emptySlot={emptySlot}
                  fieldScale={fieldScale}
                  onPiecePointerDown={onPiecePointerDown}
                  onPiecePointerMove={onPiecePointerMove}
                  onPiecePointerUp={onPiecePointerUp}
                  onPiecePointerCancel={onPiecePointerCancel}
                  onPieceClick={onPieceClick}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <ArmyFormationStepButton
        label={copy.switchToNextBattle}
        glyph=">"
        columnClass="col-start-3"
        onStep={onStepNext}
      />
      <ArmyFormationBattlefieldTransferRow
        copy={copy}
        fileInputRef={fileInputRef}
        fileOperationFailureMessage={fileOperationFailureMessage}
        onOpenFilePicker={onOpenFilePicker}
        onFileReadFailure={onFileReadFailure}
        onExportFile={onExportFile}
        onExportPng={onExportPng}
        onChooseFile={onChooseFile}
      />
    </div>
  );
}

function ArmyFormationRestoreDialog({
  copy,
  onRestorePreviousRecord,
  onStartBlank,
}: {
  copy: ArmyFormationCreatorCopy;
  onRestorePreviousRecord: () => void;
  onStartBlank: () => void;
}) {
  const promptId = useId();
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={promptId}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
    >
      <div className="flex w-full max-w-md flex-col gap-3 rounded-md border border-[var(--site-border-strong)] bg-[var(--card)] p-4">
        <p id={promptId} className="text-base font-semibold text-[var(--site-ink-strong)]">
          {copy.previousRecordPrompt}
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={ARMY_FORMATION_BUTTON_CLASS} onClick={onRestorePreviousRecord}>
            {copy.restorePreviousRecord}
          </button>
          <button type="button" className={ARMY_FORMATION_BUTTON_CLASS} onClick={onStartBlank}>
            {copy.startBlank}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ArmyFormationCreator({ locale }: { locale: 'en' | 'zh' }) {
  const copy = getArmyFormationCreatorCopy(locale);
  const [armyDocument, setArmyDocument] = useState(() => createEmptyArmyFormationDocument());
  const armyDocumentRef = useRef(armyDocument);
  const [failureMessage, setFailureMessage] = useState<string | null>(null);
  const [backgroundImageFailureMessage, setBackgroundImageFailureMessage] = useState<string | null>(null);
  const [fileOperationFailure, setFileOperationFailure] =
    useState<ArmyFormationFileOperationFailure | null>(null);
  const [startupFailureDismissed, setStartupFailureDismissed] = useState(false);
  const [startupStore] = useState<ArmyFormationStartupStore>(createArmyFormationStartupStore);
  const startupSnapshot = useSyncExternalStore(
    startupStore.subscribe,
    startupStore.readSnapshot,
    readServerArmyFormationStartupSnapshot,
  );
  const [activeCategoryId, setActiveCategoryId] = useState<ArmyFormationIconCategoryId>('helmet');
  const [colorText, setColorText] = useState('#000000');
  const [angleText, setAngleText] = useState('90');
  const [angleInputErrorMessage, setAngleInputErrorMessage] = useState<string | null>(null);
  const [heightText, setHeightText] = useState(() =>
    String(readActiveBattlefield(createEmptyArmyFormationDocument()).heightPx),
  );
  const [heightInputErrorMessage, setHeightInputErrorMessage] = useState<string | null>(null);
  const [fieldBackgroundColorText, setFieldBackgroundColorText] = useState(() =>
    readColorInputValue(readActiveBattlefield(createEmptyArmyFormationDocument()).fieldBackgroundColor),
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const backgroundImageInputRef = useRef<HTMLInputElement | null>(null);
  const autoAppliedRotationByBattlefieldRef = useRef(new Map<number, Map<string, number>>());
  const pieceDragRef = useRef<PieceDragSession | null>(null);
  const suppressClickRef = useRef(false);
  const armyFormationAutosaveOpenRef = useRef(false);
  const battlefieldSlideSequenceRef = useRef(0);
  const [battlefieldSlide, setBattlefieldSlide] = useState<ArmyFormationBattlefieldSlide | null>(null);
  const battlefield = readActiveBattlefield(armyDocument);
  const emptySlot = readNextEmptySlot(armyDocument, ARMY_FIELD_WIDTH_PX);

  const finishBattlefieldSlide = useCallback((slideId: number) => {
    setBattlefieldSlide((currentSlide) => (currentSlide?.id === slideId ? null : currentSlide));
  }, []);

  function openArmyFormationAutosave() {
    armyFormationAutosaveOpenRef.current = true;
  }

  function publishAbsentAfterWritingOverInvalidStartup(): void {
    if (startupStore.readSnapshot().status !== 'invalid') {
      return;
    }

    startupStore.publishRecord({ status: 'absent' });
  }

  function commitArmyFormationDocument(next: ArmyFormationDocument) {
    armyDocumentRef.current = next;
    setArmyDocument(next);
    if (!armyFormationAutosaveOpenRef.current) {
      return;
    }

    saveArmyFormationDocument(next);
    publishAbsentAfterWritingOverInvalidStartup();
  }

  useEffect(() => {
    // Read after mount. The client snapshot stays unread on the first paint, so saved pieces are not drawn.
    let startupRecord: ArmyFormationStartupRecord;
    try {
      startupRecord = readArmyFormationStartupRecord(requireWindowArmyFormationStorage());
    } catch (failure: unknown) {
      startupRecord = { status: 'invalid', message: describeArmyFormationFailure(failure) };
    }
    startupStore.publishRecord(startupRecord);
    if (startupRecord.status !== 'restore') {
      openArmyFormationAutosave();
    }
  }, [startupStore]);

  function syncBattlefieldDrafts(battlefield: ArmyBattlefield) {
    setHeightText(String(battlefield.heightPx));
    setHeightInputErrorMessage(null);
    setFieldBackgroundColorText(readColorInputValue(battlefield.fieldBackgroundColor));
  }

  function reportArmyFormationAction(action: () => void) {
    try {
      action();
    } catch (failure: unknown) {
      setFailureMessage(describeArmyFormationFailure(failure));
    }
  }

  function reportFileOperationFailure(operation: ArmyFormationFileOperation, failure: unknown) {
    setFileOperationFailure({ operation, message: describeArmyFormationFailure(failure) });
  }

  function clearFileOperationFailure(operation: ArmyFormationFileOperation) {
    setFileOperationFailure((currentFailure) =>
      currentFailure?.operation === operation ? null : currentFailure,
    );
  }

  function onPlaceIcon(iconId: string) {
    reportArmyFormationAction(() => {
      requireArmyFormationCatalogIcon(iconId);
      const pieceId = createArmyPieceId(readActiveBattlefield(armyDocument).pieces);
      commitArmyFormationDocument(addArmyFormationPiece(armyDocument, iconId, pieceId, ARMY_FIELD_WIDTH_PX));
    });
  }

  function onAddColor() {
    reportArmyFormationAction(() => {
      const swatchId = createArmySwatchId(readActiveBattlefield(armyDocument).palette);
      commitArmyFormationDocument(addArmyPaletteSwatch(armyDocument, swatchId, colorText));
    });
  }

  function onDeleteColor() {
    reportArmyFormationAction(() => {
      commitArmyFormationDocument(deleteSelectedArmyPaletteSwatch(armyDocument));
    });
  }

  function onSelectSwatch(swatchId: string) {
    reportArmyFormationAction(() => {
      commitArmyFormationDocument(selectArmyPaletteSwatch(armyDocument, swatchId));
    });
  }

  function onDeletePieces() {
    reportArmyFormationAction(() => {
      const currentDocument = armyDocumentRef.current;
      const battlefieldIndex = currentDocument.activeBattlefieldIndex;
      const selectedPieceIds = readActiveBattlefield(currentDocument).selectedPieceIds;
      commitArmyFormationDocument(deleteSelectedArmyFormationPieces(currentDocument));

      const appliedRotationByPieceId = autoAppliedRotationByBattlefieldRef.current.get(battlefieldIndex);
      if (appliedRotationByPieceId !== undefined) {
        for (const selectedPieceId of selectedPieceIds) {
          appliedRotationByPieceId.delete(selectedPieceId);
        }
        if (appliedRotationByPieceId.size === 0) {
          autoAppliedRotationByBattlefieldRef.current.delete(battlefieldIndex);
        }
      }
    });
  }

  function onAngleText(value: string) {
    setAngleText(value);
    setAngleInputErrorMessage(null);
    const rotationDegrees = parseFiniteNumberDraft(value);
    if (rotationDegrees === null) {
      return;
    }

    reportArmyFormationAction(() => {
      const currentDocument = armyDocumentRef.current;
      const battlefieldIndex = currentDocument.activeBattlefieldIndex;
      const selectedPieceIds = readActiveBattlefield(currentDocument).selectedPieceIds;
      if (selectedPieceIds.length === 0) {
        return;
      }

      const previousAppliedRotationByPieceId =
        autoAppliedRotationByBattlefieldRef.current.get(battlefieldIndex) ?? new Map<string, number>();
      const nextAppliedRotationByPieceId = new Map(previousAppliedRotationByPieceId);
      const pieceIdsByRotationDelta = new Map<number, string[]>();
      for (const selectedPieceId of selectedPieceIds) {
        const previousRotationDegrees = previousAppliedRotationByPieceId.get(selectedPieceId) ?? 0;
        const rotationDelta = rotationDegrees - previousRotationDegrees;
        if (rotationDelta !== 0) {
          const rotationTargetPieceIds = pieceIdsByRotationDelta.get(rotationDelta) ?? [];
          rotationTargetPieceIds.push(selectedPieceId);
          pieceIdsByRotationDelta.set(rotationDelta, rotationTargetPieceIds);
        }

        if (rotationDegrees === 0) {
          nextAppliedRotationByPieceId.delete(selectedPieceId);
        } else {
          nextAppliedRotationByPieceId.set(selectedPieceId, rotationDegrees);
        }
      }

      let nextDocument = currentDocument;
      for (const [rotationDelta, rotationTargetPieceIds] of pieceIdsByRotationDelta) {
        nextDocument = rotateArmyFormationPiecesByIds(
          nextDocument,
          rotationTargetPieceIds,
          rotationDelta,
        );
      }
      if (nextDocument !== currentDocument) {
        commitArmyFormationDocument(nextDocument);
      }

      if (nextAppliedRotationByPieceId.size === 0) {
        autoAppliedRotationByBattlefieldRef.current.delete(battlefieldIndex);
      } else {
        autoAppliedRotationByBattlefieldRef.current.set(
          battlefieldIndex,
          nextAppliedRotationByPieceId,
        );
      }
    });
  }

  function onAngleBlur(value: string) {
    const rotationDegrees = parseFiniteNumberDraft(value);
    if (rotationDegrees === null) {
      setAngleInputErrorMessage(describeAngleInputError(copy, value));
      return;
    }

    setAngleInputErrorMessage(null);
  }

  function onResetRotation() {
    reportArmyFormationAction(() => {
      const currentDocument = armyDocumentRef.current;
      const battlefieldIndex = currentDocument.activeBattlefieldIndex;
      const appliedRotationByPieceId = autoAppliedRotationByBattlefieldRef.current.get(battlefieldIndex);
      let nextDocument = currentDocument;
      if (appliedRotationByPieceId !== undefined) {
        for (const [pieceId, rotationDegrees] of appliedRotationByPieceId) {
          nextDocument = rotateArmyFormationPiecesByIds(nextDocument, [pieceId], -rotationDegrees);
        }
      }
      if (nextDocument !== currentDocument) {
        commitArmyFormationDocument(nextDocument);
      }

      autoAppliedRotationByBattlefieldRef.current.delete(battlefieldIndex);
      setAngleText('90');
      setAngleInputErrorMessage(null);
    });
  }

  function onClear() {
    reportArmyFormationAction(() => {
      const currentDocument = armyDocumentRef.current;
      commitArmyFormationDocument(clearArmyFormationPieces(currentDocument));
      autoAppliedRotationByBattlefieldRef.current.delete(currentDocument.activeBattlefieldIndex);
    });
  }

  function onHeightText(value: string) {
    setHeightText(value);
    setHeightInputErrorMessage(null);
    const heightPx = parseFiniteNumberDraft(value);
    if (
      heightPx === null ||
      heightPx < ARMY_FIELD_MIN_HEIGHT_PX ||
      heightPx > ARMY_FIELD_MAX_HEIGHT_PX
    ) {
      return;
    }

    reportArmyFormationAction(() => {
      commitArmyFormationDocument(setArmyBattlefieldHeight(armyDocumentRef.current, heightPx));
    });
  }

  function onHeightBlur(value: string) {
    const heightPx = parseFiniteNumberDraft(value);
    if (heightPx === null) {
      setHeightInputErrorMessage(describeHeightInputError(copy, value));
      return;
    }

    if (heightPx < ARMY_FIELD_MIN_HEIGHT_PX || heightPx > ARMY_FIELD_MAX_HEIGHT_PX) {
      setHeightInputErrorMessage(describeHeightRangeError(copy, value));
      return;
    }

    setHeightInputErrorMessage(null);
  }

  function onResetHeight() {
    reportArmyFormationAction(() => {
      const defaultHeightPx = readActiveBattlefield(createEmptyArmyFormationDocument()).heightPx;
      commitArmyFormationDocument(setArmyBattlefieldHeight(armyDocumentRef.current, defaultHeightPx));
      setHeightText(String(defaultHeightPx));
      setHeightInputErrorMessage(null);
    });
  }

  function onFieldBackgroundColorChange(color: string) {
    reportArmyFormationAction(() => {
      commitArmyFormationDocument(setArmyFieldBackgroundColor(armyDocumentRef.current, color));
      setFieldBackgroundColorText(color);
    });
  }

  function onResetFieldBackgroundColor() {
    reportArmyFormationAction(() => {
      commitArmyFormationDocument(
        setArmyFieldBackgroundColor(armyDocumentRef.current, DEFAULT_FIELD_BACKGROUND_COLOR),
      );
      setFieldBackgroundColorText(DEFAULT_FIELD_BACKGROUND_COLOR);
    });
  }

  function onOpenBackgroundImagePicker() {
    try {
      openFilePicker(backgroundImageInputRef.current);
    } catch (failure: unknown) {
      setBackgroundImageFailureMessage(describeArmyFormationFailure(failure));
    }
  }

  function onBackgroundImageReadFailure(failure: unknown) {
    setBackgroundImageFailureMessage(describeArmyFormationFailure(failure));
  }

  async function onChooseBackgroundImage(file: File) {
    const battlefieldIndex = armyDocumentRef.current.activeBattlefieldIndex;
    const maxHeightPx = armyDocumentRef.current.battlefields[battlefieldIndex].heightPx;
    let nextDocument: ArmyFormationDocument;

    try {
      const result = await compressArmyFormationBackgroundImage(
        file,
        ARMY_FIELD_WIDTH_PX,
        maxHeightPx,
      );
      if (result.status === 'rejected') {
        setBackgroundImageFailureMessage(describeArmyBackgroundImageUploadFailure(result, copy));
        return;
      }

      nextDocument = setArmyBackgroundImageUrlForBattlefield(
        armyDocumentRef.current,
        battlefieldIndex,
        result.dataUrl,
      );
    } catch (failure: unknown) {
      setBackgroundImageFailureMessage(describeArmyFormationFailure(failure));
      return;
    }

    reportArmyFormationAction(() => {
      commitArmyFormationDocument(nextDocument);
      setBackgroundImageFailureMessage(null);
    });
  }

  function onRemoveBackgroundImage() {
    let nextDocument: ArmyFormationDocument;
    try {
      nextDocument = setArmyBackgroundImageUrl(armyDocument, '');
    } catch (failure: unknown) {
      setBackgroundImageFailureMessage(describeArmyFormationFailure(failure));
      return;
    }

    reportArmyFormationAction(() => {
      commitArmyFormationDocument(nextDocument);
    });
  }

  function onExportFile() {
    try {
      downloadArmyFormationFile(
        ARMY_FORMATION_FILE_NAME,
        new Blob([serializeArmyFormationDocument(armyDocument)], {
          type: 'text/plain;charset=utf-8',
        }),
      );
      clearFileOperationFailure('export-file');
    } catch (failure: unknown) {
      reportFileOperationFailure('export-file', failure);
    }
  }

  async function onExportPng() {
    try {
      const png = await buildArmyFormationPng(
        buildActiveBattlefieldImageScene(armyDocument, ARMY_FIELD_WIDTH_PX),
      );
      downloadArmyFormationFile(ARMY_FORMATION_PNG_NAME, png);
      clearFileOperationFailure('export-png');
    } catch (failure: unknown) {
      reportFileOperationFailure('export-png', failure);
    }
  }

  function onOpenFilePicker() {
    try {
      openFilePicker(fileInputRef.current);
    } catch (failure: unknown) {
      reportFileOperationFailure('import', failure);
    }
  }

  function onFileReadFailure(failure: unknown) {
    reportFileOperationFailure('import', failure);
  }

  function onStep(direction: -1 | 1) {
    reportArmyFormationAction(() => {
      const next = stepArmyBattlefield(armyDocument, direction);
      if (prefersArmyFormationReducedMotion()) {
        setBattlefieldSlide(null);
      } else {
        battlefieldSlideSequenceRef.current += 1;
        setBattlefieldSlide({
          id: battlefieldSlideSequenceRef.current,
          direction,
          outgoingBattlefield: battlefield,
          outgoingEmptySlot: emptySlot,
        });
      }

      commitArmyFormationDocument(next);
      syncBattlefieldDrafts(readActiveBattlefield(next));
    });
  }

  function onChooseFile(file: File) {
    void readArmyFormationFile(file).then(
      (loaded) => {
        reportArmyFormationAction(() => {
          autoAppliedRotationByBattlefieldRef.current.clear();
          commitArmyFormationDocument(loaded);
          syncBattlefieldDrafts(readActiveBattlefield(loaded));
          clearFileOperationFailure('import');
        });
      },
      (failure: unknown) => {
        reportFileOperationFailure('import', failure);
      },
    );
  }

  function onDismissFailure() {
    setFailureMessage(null);
    setStartupFailureDismissed(true);
  }

  function onRestorePreviousRecord() {
    reportArmyFormationAction(() => {
      const restoredDocument = requireArmyFormationRestoreDocument(startupStore.readRestoreDocument());
      openArmyFormationAutosave();
      startupStore.publishRecord({ status: 'absent' });
      autoAppliedRotationByBattlefieldRef.current.clear();
      commitArmyFormationDocument(restoredDocument);
      syncBattlefieldDrafts(readActiveBattlefield(restoredDocument));
    });
  }

  function onStartBlank() {
    reportArmyFormationAction(() => {
      requireArmyFormationRestoreDocument(startupStore.readRestoreDocument());
      removeArmyFormationBrowserSave(requireWindowArmyFormationStorage());
      openArmyFormationAutosave();
      startupStore.publishRecord({ status: 'absent' });
    });
  }

  function onPiecePointerDown(event: PointerEvent<HTMLButtonElement>, piece: ArmyFormationPiece) {
    if (event.button !== 0) {
      return;
    }

    suppressClickRef.current = false;
    capturePiecePointer(event.currentTarget, event.pointerId);
    pieceDragRef.current = {
      pieceId: piece.id,
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startPieceX: piece.x,
      startPieceY: piece.y,
      moved: false,
    };
  }

  function onPiecePointerMove(event: PointerEvent<HTMLButtonElement>) {
    const drag = pieceDragRef.current;
    if (drag === null || drag.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - drag.startClientX;
    const deltaY = event.clientY - drag.startClientY;
    if (Math.abs(deltaX) >= ARMY_DRAG_START_PX || Math.abs(deltaY) >= ARMY_DRAG_START_PX) {
      drag.moved = true;
    }

    reportArmyFormationAction(() => {
      const fieldScale = readArmyFieldScaleFromPieceButton(event.currentTarget);
      commitArmyFormationDocument(
        moveDraggedArmyFormationPiece(
          armyDocument,
          drag.pieceId,
          drag.startPieceX + deltaX / fieldScale,
          drag.startPieceY + deltaY / fieldScale,
          ARMY_FIELD_WIDTH_PX,
        ),
      );
    });
  }

  function finishPiecePointer(event: PointerEvent<HTMLButtonElement>) {
    const drag = pieceDragRef.current;
    if (drag === null || drag.pointerId !== event.pointerId) {
      return;
    }

    suppressClickRef.current = drag.moved;
    pieceDragRef.current = null;
  }

  function onPieceClick(pieceId: string) {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }

    reportArmyFormationAction(() => {
      commitArmyFormationDocument(toggleArmyFormationPieceSelection(armyDocument, pieceId));
    });
  }

  const restorePromptOpen = startupSnapshot.status === 'restore';
  const startupFailureMessage = startupSnapshot.status === 'invalid' ? startupSnapshot.message : null;
  const visibleFailureMessage =
    failureMessage ?? (startupFailureDismissed ? null : startupFailureMessage);

  return (
    <section
      aria-label={copy.productName}
      className="relative w-full min-w-0 rounded-2xl border border-[var(--site-border-strong)] bg-[var(--site-panel)] p-3 text-[var(--site-ink)] shadow-[var(--site-card-shadow)] sm:p-4"
    >
      <div className="space-y-3" inert={restorePromptOpen ? true : undefined}>
      <ArmyFormationCategoryTabs
        copy={copy}
        activeCategoryId={activeCategoryId}
        onCategory={setActiveCategoryId}
      />
      <ArmyFormationIconShelf copy={copy} categoryId={activeCategoryId} onPlace={onPlaceIcon} />
      <div className="flex flex-col gap-3 min-[1440px]:flex-row min-[1440px]:items-start">
        <div className="flex w-full min-w-0 flex-col gap-3 rounded-2xl border border-[var(--site-border-strong)] p-3 min-[1440px]:w-[400px] min-[1440px]:shrink-0">
          <ArmyFormationColorControls
            copy={copy}
            colorText={colorText}
            palette={battlefield.palette}
            selectedSwatchId={battlefield.selectedSwatchId}
            onColorText={setColorText}
            onAddColor={onAddColor}
            onDeleteColor={onDeleteColor}
            onSelectSwatch={onSelectSwatch}
          />
          <ArmyFormationPieceControls
            copy={copy}
            angleText={angleText}
            angleInputErrorMessage={angleInputErrorMessage}
            onAngleText={onAngleText}
            onAngleBlur={onAngleBlur}
            onDeletePieces={onDeletePieces}
            onResetRotation={onResetRotation}
          />
          <ArmyFormationFieldControls
            copy={copy}
            heightText={heightText}
            heightInputErrorMessage={heightInputErrorMessage}
            fieldBackgroundColorText={fieldBackgroundColorText}
            backgroundImageUrl={battlefield.backgroundImageUrl}
            backgroundImageFailureMessage={backgroundImageFailureMessage}
            backgroundImageInputRef={backgroundImageInputRef}
            onHeightBlur={onHeightBlur}
            onHeightText={onHeightText}
            onResetHeight={onResetHeight}
            onFieldBackgroundColorChange={onFieldBackgroundColorChange}
            onResetFieldBackgroundColor={onResetFieldBackgroundColor}
            onOpenBackgroundImagePicker={onOpenBackgroundImagePicker}
            onBackgroundImageReadFailure={onBackgroundImageReadFailure}
            onChooseBackgroundImage={(file) => void onChooseBackgroundImage(file)}
            onRemoveBackgroundImage={onRemoveBackgroundImage}
            onClear={onClear}
          />
        </div>
        <ArmyFormationBattlefieldPane
          copy={copy}
          battlefield={battlefield}
          emptySlot={emptySlot}
          activeBattlefieldIndex={armyDocument.activeBattlefieldIndex}
          battlefieldCount={armyDocument.battlefields.length}
          slide={battlefieldSlide}
          fileInputRef={fileInputRef}
          fileOperationFailureMessage={fileOperationFailure?.message ?? null}
          onOpenFilePicker={onOpenFilePicker}
          onFileReadFailure={onFileReadFailure}
          onExportFile={onExportFile}
          onExportPng={onExportPng}
          onChooseFile={onChooseFile}
          onStepPrevious={() => onStep(-1)}
          onStepNext={() => onStep(1)}
          onSlideFinished={finishBattlefieldSlide}
          onPiecePointerDown={onPiecePointerDown}
          onPiecePointerMove={onPiecePointerMove}
          onPiecePointerUp={finishPiecePointer}
          onPiecePointerCancel={finishPiecePointer}
          onPieceClick={onPieceClick}
        />
      </div>
      </div>
      {restorePromptOpen ? (
        <ArmyFormationRestoreDialog
          copy={copy}
          onRestorePreviousRecord={onRestorePreviousRecord}
          onStartBlank={onStartBlank}
        />
      ) : null}
      {visibleFailureMessage !== null ? (
        <ArmyFormationFailure
          message={visibleFailureMessage}
          dismissLabel={copy.dismissError}
          onDismiss={onDismissFailure}
        />
      ) : null}
    </section>
  );
}
