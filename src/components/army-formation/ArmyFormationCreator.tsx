'use client';

import { useEffect, useId, useRef, useState, useSyncExternalStore, type PointerEvent, type ReactNode, type RefObject } from 'react';

import {
  readArmyFormationBrowserSave,
  removeArmyFormationBrowserSave,
  writeArmyFormationBrowserSave,
  type ArmyFormationDocumentStorage,
} from '@/lib/army-formation/browser-saves';
import { getArmyFormationCreatorCopy, type ArmyFormationCreatorCopy } from '@/lib/army-formation/copy';
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
  buildArmyFormationSvg,
  inlineArmyFormationSvgAssets,
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
const ARMY_DRAG_START_PX = 3;
const ARMY_FORMATION_FILE_NAME = 'army-formation-creator.txt';
const ARMY_FORMATION_IMAGE_NAME = 'army-formation-creator.svg';

const ARMY_FORMATION_BUTTON_CLASS =
  'rounded-md border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] px-4 py-3 text-base text-[var(--site-ink)]';
const ARMY_FORMATION_INPUT_CLASS =
  'rounded-md border border-[var(--site-border-strong)] bg-[var(--site-panel-strong)] px-2 py-1 text-sm text-[var(--site-ink)]';
const ARMY_FORMATION_NATO_ICONS_PER_PAGE = 60;
const ARMY_FORMATION_ICON_SHELF_MAX_HEIGHT_CLASS = 'max-h-[calc(2.25rem*3+0.25rem*2)]';

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

function readArmyFormationStartupRecord(
  storage: ArmyFormationDocumentStorage,
): ArmyFormationStartupRecord {
  let storedDocument: ArmyFormationDocument | null;
  try {
    storedDocument = readArmyFormationBrowserSave(storage);
  } catch (failure: unknown) {
    return {
      status: 'invalid',
      message: readArmyFormationStorageFailureMessage(failure),
    };
  }

  if (storedDocument !== null && isBlankArmyFormationDocument(storedDocument)) {
    removeArmyFormationBrowserSave(storage);
    return { status: 'absent' };
  }

  if (storedDocument === null) {
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

function readFiniteNumberInput(inputText: string, label: string): number {
  const trimmed = inputText.trim();
  const parsed = Number(trimmed);
  if (trimmed.length === 0 || !Number.isFinite(parsed)) {
    throw new Error(`${label} must be a finite number, received ${JSON.stringify(inputText)}.`);
  }

  return parsed;
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

function buildActiveBattlefieldSvg(armyDocument: ArmyFormationDocument, fieldWidthPx: number): string {
  const battlefield = readActiveBattlefield(armyDocument);
  return buildArmyFormationSvg({
    widthPx: fieldWidthPx,
    heightPx: battlefield.heightPx,
    fieldBackgroundColor: battlefield.fieldBackgroundColor,
    backgroundImageUrl: battlefield.backgroundImageUrl,
    pieces: battlefield.pieces.map(toImagePiece),
  });
}

function downloadArmyFormationFile(filename: string, contents: string, mimeType: string): void {
  if (typeof document === 'undefined' || document.body === null) {
    throw new Error('Army formation download requires document.body. Received null.');
  }

  if (typeof URL.createObjectURL !== 'function' || typeof URL.revokeObjectURL !== 'function') {
    throw new Error('URL.createObjectURL is unavailable. Received undefined.');
  }

  const blob = new Blob([contents], { type: mimeType });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
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

function ArmyFormationFailure({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="rounded-md border border-[var(--site-accent-strong)] bg-[var(--site-accent-bg)] px-3 py-2 text-sm text-[var(--site-ink-strong)]"
    >
      {message}
    </p>
  );
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
              'min-w-0 whitespace-normal rounded-md border px-2 py-2 text-center text-sm leading-tight',
              selected
                ? 'border-[var(--site-accent-strong)] bg-[var(--site-accent-bg)] text-[var(--site-accent-strong)]'
                : 'border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] text-[var(--site-ink)]',
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
      className="inline-flex h-9 w-14 items-center justify-center rounded-sm border border-[var(--site-border-strong)] bg-[var(--site-card-plain-top)] p-0.5 text-[var(--site-ink-strong)]"
      onClick={() => onPlace(icon.id)}
    >
      <span
        className="pointer-events-none block h-full w-full [&_svg]:h-full [&_svg]:w-full"
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
          className="h-9 w-9 rounded-md border border-[var(--site-border-strong)] bg-[var(--site-panel-strong)]"
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
                  'h-7 w-7 rounded-sm border',
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
  onAngleText,
  onDeletePieces,
  onRotate,
}: {
  copy: ArmyFormationCreatorCopy;
  angleText: string;
  onAngleText: (value: string) => void;
  onDeletePieces: () => void;
  onRotate: () => void;
}) {
  return (
    <ArmyFormationControlGroup title={copy.changeSelectedPieces}>
      <button type="button" className={ARMY_FORMATION_BUTTON_CLASS} onClick={onDeletePieces}>
        {copy.deleteSelected}
      </button>
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-sm text-[var(--site-ink)]">
          <span>{copy.angle}</span>
          <input
            className={`${ARMY_FORMATION_INPUT_CLASS} w-20`}
            type="number"
            value={angleText}
            onChange={(event) => onAngleText(event.target.value)}
          />
        </label>
        <button type="button" className={ARMY_FORMATION_BUTTON_CLASS} onClick={onRotate}>
          {copy.rotateSelected}
        </button>
      </div>
    </ArmyFormationControlGroup>
  );
}

function ArmyFormationFieldControls({
  copy,
  heightText,
  fieldBackgroundColorText,
  backgroundImageText,
  onHeightText,
  onApplyHeight,
  onFieldBackgroundColorText,
  onApplyFieldBackground,
  onBackgroundImageText,
  onApplyBackgroundImage,
  onClear,
}: {
  copy: ArmyFormationCreatorCopy;
  heightText: string;
  fieldBackgroundColorText: string;
  backgroundImageText: string;
  onHeightText: (value: string) => void;
  onApplyHeight: () => void;
  onFieldBackgroundColorText: (value: string) => void;
  onApplyFieldBackground: () => void;
  onBackgroundImageText: (value: string) => void;
  onApplyBackgroundImage: () => void;
  onClear: () => void;
}) {
  return (
    <ArmyFormationControlGroup title={copy.changeBattlefield}>
      <button type="button" className={ARMY_FORMATION_BUTTON_CLASS} onClick={onClear}>
        {copy.clearBattlefield}
      </button>
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-sm text-[var(--site-ink)]">
          <span>{copy.height}</span>
          <input
            className={`${ARMY_FORMATION_INPUT_CLASS} w-20`}
            type="number"
            value={heightText}
            onChange={(event) => onHeightText(event.target.value)}
          />
        </label>
        <button type="button" className={ARMY_FORMATION_BUTTON_CLASS} onClick={onApplyHeight}>
          {copy.changeHeight}
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="color"
          aria-label={copy.changeBackgroundColor}
          className="h-9 w-9 rounded-md border border-[var(--site-border-strong)] bg-[var(--site-panel-strong)]"
          value={fieldBackgroundColorText}
          onChange={(event) => onFieldBackgroundColorText(event.target.value)}
        />
        <button type="button" className={ARMY_FORMATION_BUTTON_CLASS} onClick={onApplyFieldBackground}>
          {copy.changeBackgroundColor}
        </button>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="flex w-full min-w-0 flex-1 flex-col gap-1 text-sm text-[var(--site-ink)]">
          <span>{copy.backgroundImage}</span>
          <input
            className={`${ARMY_FORMATION_INPUT_CLASS} w-full min-w-0`}
            type="text"
            value={backgroundImageText}
            onChange={(event) => onBackgroundImageText(event.target.value)}
          />
        </label>
        <button type="button" className={`${ARMY_FORMATION_BUTTON_CLASS} w-fit shrink-0`} onClick={onApplyBackgroundImage}>
          {copy.setBackgroundImage}
        </button>
      </div>
    </ArmyFormationControlGroup>
  );
}

function ArmyFormationFileChooser({
  label,
  inputRef,
  onChooseFile,
}: {
  label: string;
  inputRef: RefObject<HTMLInputElement | null>;
  onChooseFile: (file: File) => void;
}) {
  return (
    <>
      <button type="button" className={`${ARMY_FORMATION_BUTTON_CLASS} w-full min-w-0`} onClick={() => openFilePicker(inputRef.current)}>
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
          const file = readFirstChosenFile(input);
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
  onExportFile,
  onExportImage,
  onChooseFile,
}: {
  copy: ArmyFormationCreatorCopy;
  inputRef: RefObject<HTMLInputElement | null>;
  onExportFile: () => void;
  onExportImage: () => void;
  onChooseFile: (file: File) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <button type="button" className={`${ARMY_FORMATION_BUTTON_CLASS} w-full min-w-0`} onClick={onExportFile}>
        {copy.exportFile}
      </button>
      <button type="button" className={`${ARMY_FORMATION_BUTTON_CLASS} w-full min-w-0`} onClick={onExportImage}>
        {copy.exportImage}
      </button>
      <ArmyFormationFileChooser label={copy.chooseFile} inputRef={inputRef} onChooseFile={onChooseFile} />
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
        'absolute touch-none p-0 text-[oklch(0.29_0.03_72)]',
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
        'row-start-2 h-40 self-center rounded-md border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] text-2xl text-[var(--site-ink)]',
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
  onExportFile,
  onExportImage,
  onChooseFile,
}: {
  copy: ArmyFormationCreatorCopy;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onExportFile: () => void;
  onExportImage: () => void;
  onChooseFile: (file: File) => void;
}) {
  return (
    <div className="col-start-2 row-start-3 flex min-w-0 flex-col gap-3">
      <ArmyFormationTransferControls
        copy={copy}
        inputRef={fileInputRef}
        onExportFile={onExportFile}
        onExportImage={onExportImage}
        onChooseFile={onChooseFile}
      />
    </div>
  );
}

function ArmyFormationBattlefieldPane({
  copy,
  battlefield,
  emptySlot,
  fileInputRef,
  onExportFile,
  onExportImage,
  onChooseFile,
  onStepPrevious,
  onStepNext,
  onPiecePointerDown,
  onPiecePointerMove,
  onPiecePointerUp,
  onPiecePointerCancel,
  onPieceClick,
}: {
  copy: ArmyFormationCreatorCopy;
  battlefield: ArmyBattlefield;
  emptySlot: EmptySlot | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onExportFile: () => void;
  onExportImage: () => void;
  onChooseFile: (file: File) => void;
  onStepPrevious: () => void;
  onStepNext: () => void;
  onPiecePointerDown: (event: PointerEvent<HTMLButtonElement>, piece: ArmyFormationPiece) => void;
  onPiecePointerMove: (event: PointerEvent<HTMLButtonElement>) => void;
  onPiecePointerUp: (event: PointerEvent<HTMLButtonElement>) => void;
  onPiecePointerCancel: (event: PointerEvent<HTMLButtonElement>) => void;
  onPieceClick: (pieceId: string) => void;
}) {
  return (
    <div className="grid min-w-0 flex-1 grid-cols-[2.25rem_minmax(0,1fr)_2.25rem] gap-x-2 gap-y-2">
      <h2 className="col-start-2 text-sm font-semibold text-[var(--site-ink-strong)]">{copy.battlefield}</h2>
      <ArmyFormationStepButton
        label={copy.switchToPreviousBattle}
        glyph="<"
        columnClass="col-start-1"
        onStep={onStepPrevious}
      />
      <div className="col-start-2 row-start-2 overflow-auto rounded-md border border-[var(--site-border-strong)]">
        <div
          data-army-field=""
          data-field-height={battlefield.heightPx}
          className="relative"
          style={{
            width: ARMY_FIELD_WIDTH_PX,
            height: battlefield.heightPx,
            backgroundColor: battlefield.fieldBackgroundColor,
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
        onExportFile={onExportFile}
        onExportImage={onExportImage}
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
      className="absolute inset-0 z-30 flex items-center justify-center bg-[var(--site-panel)] p-4"
    >
      <div className="flex w-full max-w-md flex-col gap-3 rounded-md border border-[var(--site-border-strong)] bg-[var(--site-panel)] p-4">
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
  const [failureMessage, setFailureMessage] = useState<string | null>(null);
  const [startupStore] = useState<ArmyFormationStartupStore>(createArmyFormationStartupStore);
  const startupSnapshot = useSyncExternalStore(
    startupStore.subscribe,
    startupStore.readSnapshot,
    readServerArmyFormationStartupSnapshot,
  );
  const [activeCategoryId, setActiveCategoryId] = useState<ArmyFormationIconCategoryId>('helmet');
  const [colorText, setColorText] = useState('#000000');
  const [angleText, setAngleText] = useState('90');
  const [heightText, setHeightText] = useState(() =>
    String(readActiveBattlefield(createEmptyArmyFormationDocument()).heightPx),
  );
  const [fieldBackgroundColorText, setFieldBackgroundColorText] = useState(() =>
    readColorInputValue(readActiveBattlefield(createEmptyArmyFormationDocument()).fieldBackgroundColor),
  );
  const [backgroundImageText, setBackgroundImageText] = useState(
    () => readActiveBattlefield(createEmptyArmyFormationDocument()).backgroundImageUrl,
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pieceDragRef = useRef<PieceDragSession | null>(null);
  const suppressClickRef = useRef(false);
  const armyFormationAutosaveOpenRef = useRef(false);

  function openArmyFormationAutosave() {
    armyFormationAutosaveOpenRef.current = true;
  }

  function commitArmyFormationDocument(next: ArmyFormationDocument) {
    setArmyDocument(next);
    if (armyFormationAutosaveOpenRef.current) {
      saveArmyFormationDocument(next);
    }
  }

  useEffect(() => {
    // Read after mount. The client snapshot stays unread on the first paint, so saved pieces are not drawn.
    const startupRecord = readArmyFormationStartupRecord(requireWindowArmyFormationStorage());
    startupStore.publishRecord(startupRecord);
    if (startupRecord.status !== 'restore') {
      openArmyFormationAutosave();
    }
  }, [startupStore]);

  function syncBattlefieldDrafts(battlefield: ArmyBattlefield) {
    setHeightText(String(battlefield.heightPx));
    setFieldBackgroundColorText(readColorInputValue(battlefield.fieldBackgroundColor));
    setBackgroundImageText(battlefield.backgroundImageUrl);
  }

  function reportArmyFormationAction(action: () => void) {
    try {
      action();
      setFailureMessage(null);
    } catch (failure: unknown) {
      setFailureMessage(describeArmyFormationFailure(failure));
    }
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
      commitArmyFormationDocument(deleteSelectedArmyFormationPieces(armyDocument));
    });
  }

  function onRotate() {
    reportArmyFormationAction(() => {
      const rotationDegrees = readFiniteNumberInput(angleText, 'Rotation degrees');
      commitArmyFormationDocument(rotateSelectedArmyFormationPieces(armyDocument, rotationDegrees));
    });
  }

  function onClear() {
    reportArmyFormationAction(() => {
      commitArmyFormationDocument(clearArmyFormationPieces(armyDocument));
    });
  }

  function onApplyHeight() {
    reportArmyFormationAction(() => {
      const heightPx = readFiniteNumberInput(heightText, 'Battlefield height');
      commitArmyFormationDocument(setArmyBattlefieldHeight(armyDocument, heightPx));
    });
  }

  function onApplyFieldBackground() {
    reportArmyFormationAction(() => {
      commitArmyFormationDocument(setArmyFieldBackgroundColor(armyDocument, fieldBackgroundColorText));
    });
  }

  function onApplyBackgroundImage() {
    reportArmyFormationAction(() => {
      commitArmyFormationDocument(setArmyBackgroundImageUrl(armyDocument, backgroundImageText));
    });
  }

  function onExportFile() {
    reportArmyFormationAction(() => {
      downloadArmyFormationFile(
        ARMY_FORMATION_FILE_NAME,
        serializeArmyFormationDocument(armyDocument),
        'text/plain;charset=utf-8',
      );
    });
  }

  async function onExportImage() {
    try {
      const svg = await inlineArmyFormationSvgAssets(
        buildActiveBattlefieldSvg(armyDocument, ARMY_FIELD_WIDTH_PX),
      );
      downloadArmyFormationFile(ARMY_FORMATION_IMAGE_NAME, svg, 'image/svg+xml');
      setFailureMessage(null);
    } catch (failure: unknown) {
      setFailureMessage(describeArmyFormationFailure(failure));
    }
  }

  function onStep(direction: -1 | 1) {
    reportArmyFormationAction(() => {
      const next = stepArmyBattlefield(armyDocument, direction);
      commitArmyFormationDocument(next);
      syncBattlefieldDrafts(readActiveBattlefield(next));
    });
  }

  function onChooseFile(file: File) {
    void readArmyFormationFile(file)
      .then((loaded) => {
        commitArmyFormationDocument(loaded);
        syncBattlefieldDrafts(readActiveBattlefield(loaded));
        setFailureMessage(null);
      })
      .catch((failure: unknown) => {
        setFailureMessage(describeArmyFormationFailure(failure));
      });
  }

  function onRestorePreviousRecord() {
    reportArmyFormationAction(() => {
      const restoredDocument = requireArmyFormationRestoreDocument(startupStore.readRestoreDocument());
      openArmyFormationAutosave();
      startupStore.publishRecord({ status: 'absent' });
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
      commitArmyFormationDocument(
        moveDraggedArmyFormationPiece(
          armyDocument,
          drag.pieceId,
          drag.startPieceX + deltaX,
          drag.startPieceY + deltaY,
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

  const battlefield = readActiveBattlefield(armyDocument);
  const emptySlot = readNextEmptySlot(armyDocument, ARMY_FIELD_WIDTH_PX);
  const restorePromptOpen = startupSnapshot.status === 'restore';
  const startupFailureMessage = startupSnapshot.status === 'invalid' ? startupSnapshot.message : null;
  const visibleFailureMessage = failureMessage ?? startupFailureMessage;

  return (
    <section
      aria-label={copy.productName}
      className="relative mx-auto w-full max-w-[84rem] rounded-2xl border border-[var(--site-border-strong)] bg-[var(--site-panel)] p-3 text-[var(--site-ink)] shadow-[var(--site-card-shadow)] sm:p-4"
    >
      <div className="space-y-3" inert={restorePromptOpen ? true : undefined}>
      {visibleFailureMessage !== null ? <ArmyFormationFailure message={visibleFailureMessage} /> : null}
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
            onAngleText={setAngleText}
            onDeletePieces={onDeletePieces}
            onRotate={onRotate}
          />
          <ArmyFormationFieldControls
            copy={copy}
            heightText={heightText}
            fieldBackgroundColorText={fieldBackgroundColorText}
            backgroundImageText={backgroundImageText}
            onHeightText={setHeightText}
            onApplyHeight={onApplyHeight}
            onFieldBackgroundColorText={setFieldBackgroundColorText}
            onApplyFieldBackground={onApplyFieldBackground}
            onBackgroundImageText={setBackgroundImageText}
            onApplyBackgroundImage={onApplyBackgroundImage}
            onClear={onClear}
          />
        </div>
        <ArmyFormationBattlefieldPane
          copy={copy}
          battlefield={battlefield}
          emptySlot={emptySlot}
          fileInputRef={fileInputRef}
          onExportFile={onExportFile}
          onExportImage={onExportImage}
          onChooseFile={onChooseFile}
          onStepPrevious={() => onStep(-1)}
          onStepNext={() => onStep(1)}
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
    </section>
  );
}
