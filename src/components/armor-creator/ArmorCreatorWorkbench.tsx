'use client';

import { useEffect, useRef, useState, type Ref } from 'react';

import { ArmorPickerActions, ArmorPickerHeader } from '@/components/armor-creator/ArmorPickerHeader';
import { ArmorPreviewOutfitSlots } from '@/components/armor-creator/ArmorPreviewOutfitSlots';
import {
  ARMOR_PREVIEW_HEIGHT,
  ARMOR_PREVIEW_WIDTH,
  listArmorPieceIds,
  pieceIndex,
  pieceSlot,
  type ArmorGender,
  type ArmorMaterial,
} from '@/lib/armor-creator/catalog';
import { getArmorCreatorCopy, type ArmorCreatorCopy } from '@/lib/armor-creator/copy';
import { armorPieceImagePath } from '@/lib/armor-creator/icons';
import {
  activeOutfitSlotForAutosave,
  selectionForOutfitSlot,
} from '@/lib/armor-creator/outfit-slot';
import { canvasToArmorPng, drawArmorLayers } from '@/lib/armor-creator/render';
import {
  readArmorSaveSlot,
  writeArmorSaveSlot,
  type ArmorSaveRecord,
  type ArmorSaveSlotNumber,
  type ArmorSaveStorage,
} from '@/lib/armor-creator/saves';
import {
  chestCurveControlEnabled,
  clearArmorEquipment,
  createInitialArmorSelection,
  isArmorPieceEquipped,
  selectArmorGender,
  selectArmorMaterial,
  setChestCurve,
  setShoulderSymmetry,
  toggleArmorPiece,
  type ArmorSelection,
} from '@/lib/armor-creator/selection';
import type { SiteLocale } from '@/lib/site-locale';
import { cn } from '@/lib/utils';

const PICKER_SLOTS = [
  'helm',
  'chest',
  'feet',
  'legs',
  'gloves',
  'shoulderLeft',
  'shoulderRight',
  'cloak',
  'crown',
  'wing',
] as const;

type PickerSlot = (typeof PICKER_SLOTS)[number];
type OutfitWriteGenerations = Record<ArmorSaveSlotNumber, number>;

type LoadedOutfitSlot = {
  storage: ArmorSaveStorage;
  activeOutfitSlot: ArmorSaveSlotNumber;
  selection: ArmorSelection;
  storedRecord: ArmorSaveRecord | null;
};

type OutfitSelectionWrite = {
  storage: ArmorSaveStorage;
  slotNumber: ArmorSaveSlotNumber;
  selection: ArmorSelection;
  outfitWriteIsLatest: () => boolean;
};

const ARMOR_LINE_ART_SURFACE_CLASS =
  'border border-[var(--site-accent-strong)] bg-[#fffaf4]';

function stringifyFailureReason(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.length > 0) {
      return error.message;
    }

    return `${error.name} with empty message`;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error === undefined) {
    return 'undefined';
  }

  if (error === null) {
    return 'null';
  }

  if (typeof error === 'number' || typeof error === 'boolean' || typeof error === 'bigint') {
    return String(error);
  }

  return Object.prototype.toString.call(error);
}

function describeJsonReceivedValue(value: unknown): string {
  try {
    const json = JSON.stringify(value);
    if (typeof json === 'string') {
      return json;
    }

    const returned = json === undefined ? 'undefined' : String(json);
    return `${Object.prototype.toString.call(value)} (JSON.stringify failed: returned ${returned}).`;
  } catch (error: unknown) {
    const reason = stringifyFailureReason(error);
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

function describeFailure(failure: unknown): string {
  if (failure instanceof Error && failure.message.length > 0) {
    return failure.message;
  }

  if (typeof failure === 'string') {
    return failure;
  }

  return `Armor creator action failed. Received ${describeReceivedValue(failure)}.`;
}

function wearOrRemoveArmorPiece(selection: ArmorSelection, pieceId: string): ArmorSelection {
  if (typeof pieceId !== 'string' || pieceId.length === 0) {
    throw new Error(`Armor piece id must be a non-empty string. Received ${JSON.stringify(pieceId)}.`);
  }

  return toggleArmorPiece(selection, pieceId);
}

function requireBrowserSaveStorage(): ArmorSaveStorage {
  const storage = globalThis.localStorage;
  if (storage === undefined || storage === null) {
    throw new Error(
      `Armor save storage is unavailable. Received ${storage === undefined ? 'undefined' : 'null'}.`,
    );
  }

  return storage;
}

function createOutfitWriteGenerations(): OutfitWriteGenerations {
  return {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  };
}

function nextOutfitWriteGeneration(
  generations: OutfitWriteGenerations,
  slotNumber: ArmorSaveSlotNumber,
): number {
  const nextGeneration = generations[slotNumber] + 1;
  generations[slotNumber] = nextGeneration;
  return nextGeneration;
}

function outfitWriteGenerationIsCurrent(
  generations: OutfitWriteGenerations,
  slotNumber: ArmorSaveSlotNumber,
  generation: number,
): boolean {
  return generations[slotNumber] === generation;
}

function snapshotFromSaveRecord(record: ArmorSaveRecord | null): ArmorSelection | null {
  if (record === null) {
    return null;
  }

  return record.snapshot;
}

function loadOutfitSlot(slotNumber: ArmorSaveSlotNumber): LoadedOutfitSlot {
  const storage = requireBrowserSaveStorage();
  const storedRecord = readArmorSaveSlot(storage, slotNumber);
  const loadedOutfit = selectionForOutfitSlot(slotNumber, snapshotFromSaveRecord(storedRecord));

  return {
    storage,
    activeOutfitSlot: loadedOutfit.activeOutfitSlot,
    selection: loadedOutfit.selection,
    storedRecord,
  };
}

function createArmorExportCanvas(): HTMLCanvasElement {
  if (typeof document.createElement !== 'function') {
    throw new Error(
      `Armor export requires document.createElement. Received typeof ${typeof document.createElement}.`,
    );
  }

  const canvas = document.createElement('canvas');
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error(
      `Armor export canvas must be an HTMLCanvasElement. Received ${Object.prototype.toString.call(canvas)}.`,
    );
  }

  canvas.width = ARMOR_PREVIEW_WIDTH;
  canvas.height = ARMOR_PREVIEW_HEIGHT;
  if (canvas.width !== ARMOR_PREVIEW_WIDTH || canvas.height !== ARMOR_PREVIEW_HEIGHT) {
    throw new Error(
      `Armor export canvas must be ${String(ARMOR_PREVIEW_WIDTH)}x${String(ARMOR_PREVIEW_HEIGHT)}. Received ${String(canvas.width)}x${String(canvas.height)}.`,
    );
  }

  if (canvas.isConnected) {
    throw new Error(
      `Armor export canvas must be independent from the preview. Received a connected canvas ${String(canvas.width)}x${String(canvas.height)}.`,
    );
  }

  return canvas;
}

function requireCanvasContext2d(canvas: HTMLCanvasElement, action: string): CanvasRenderingContext2D {
  const context = canvas.getContext('2d');
  if (context === null) {
    throw new Error(`Armor ${action} canvas has no 2d context. Received null.`);
  }

  return context;
}

async function paintSelectionForExport(selection: ArmorSelection): Promise<HTMLCanvasElement> {
  const canvas = createArmorExportCanvas();
  const context = requireCanvasContext2d(canvas, 'export');
  await drawArmorLayers(context, selection);
  return canvas;
}

function describeFileReaderError(readerError: DOMException | null): string {
  if (readerError === null) {
    return 'name null and message null';
  }

  return `name ${JSON.stringify(readerError.name)} and message ${JSON.stringify(readerError.message)}`;
}

function readBlobPngDataUrl(blob: Blob): Promise<string> {
  if (typeof FileReader !== 'function') {
    throw new Error(
      `Armor save thumbnail requires FileReader. Received typeof ${typeof FileReader}.`,
    );
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string' || !result.startsWith('data:image/png;base64,')) {
        const received = typeof result === 'string' ? JSON.stringify(result.slice(0, 32)) : String(result);
        reject(new Error(`Armor save thumbnail must be a PNG data URL. Received ${received}.`));
        return;
      }

      resolve(result);
    };
    reader.onerror = () => {
      reject(
        new Error(
          `Armor save thumbnail could not be read from the preview blob. Received ${describeFileReaderError(reader.error)}.`,
        ),
      );
    };
    reader.readAsDataURL(blob);
  });
}

async function readCanvasPngDataUrl(canvas: HTMLCanvasElement): Promise<string> {
  const blob = await canvasToArmorPng(canvas);
  return readBlobPngDataUrl(blob);
}

async function readOutfitThumbnailDataUrl(selection: ArmorSelection): Promise<string> {
  const canvas = await paintSelectionForExport(selection);
  return readCanvasPngDataUrl(canvas);
}

function writeLatestOutfitSave(input: OutfitSelectionWrite, thumbnailDataUrl: string): void {
  if (!input.outfitWriteIsLatest()) {
    return;
  }

  writeArmorSaveSlot(input.storage, input.slotNumber, {
    snapshot: input.selection,
    thumbnailDataUrl,
  });
}

async function writeOutfitSelection(input: OutfitSelectionWrite): Promise<void> {
  const thumbnailDataUrl = await readOutfitThumbnailDataUrl(input.selection);
  writeLatestOutfitSave(input, thumbnailDataUrl);
}

function requireDownloadUrlFunction(
  urlFunction: unknown,
  functionName: 'createObjectURL' | 'revokeObjectURL',
): void {
  if (typeof urlFunction !== 'function') {
    throw new Error(
      `Armor download requires URL.${functionName}. Received typeof ${typeof urlFunction}.`,
    );
  }
}

async function downloadArmorSelection(selection: ArmorSelection): Promise<void> {
  const canvas = await paintSelectionForExport(selection);
  await downloadArmorPreview(canvas);
}

async function downloadArmorPreview(canvas: HTMLCanvasElement): Promise<void> {
  const blob = await canvasToArmorPng(canvas);
  const urlApi = globalThis.URL;
  requireDownloadUrlFunction(urlApi.createObjectURL, 'createObjectURL');
  requireDownloadUrlFunction(urlApi.revokeObjectURL, 'revokeObjectURL');

  const objectUrl = urlApi.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = 'armor.png';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  urlApi.revokeObjectURL(objectUrl);
}

function pickerSlotLabel(copy: ArmorCreatorCopy, slot: PickerSlot): string {
  if (slot === 'helm') return copy.slotHelm;
  if (slot === 'chest') return copy.slotChest;
  if (slot === 'feet') return copy.slotFeet;
  if (slot === 'shoulderLeft') return copy.slotShoulderLeft;
  if (slot === 'legs') return copy.slotLegs;
  if (slot === 'gloves') return copy.slotGloves;
  if (slot === 'shoulderRight') return copy.slotShoulderRight;
  if (slot === 'cloak') return copy.slotCloak;
  if (slot === 'crown') return copy.slotCrown;
  if (slot === 'wing') return copy.slotWing;

  throw new Error(`Unknown armor picker slot ${JSON.stringify(slot)}.`);
}

function listPickerPieceIds(selection: ArmorSelection, slot: Exclude<PickerSlot, 'cloak'>): string[] {
  if (slot === 'crown' || slot === 'wing') {
    return listArmorPieceIds({ slot });
  }

  return listArmorPieceIds({
    slot,
    gender: selection.gender,
    material: selection.material,
  });
}

function listCloakPieceIds(
  selection: ArmorSelection,
  side: 'cloakFront' | 'cloakBack',
): string[] {
  return listArmorPieceIds({
    slot: side,
    gender: selection.gender,
    material: selection.material,
  });
}

function pickerSlotIsWorn(selection: ArmorSelection, slot: PickerSlot): boolean {
  if (slot === 'cloak') {
    return (
      selection.equippedPieceIds.cloakFront !== undefined ||
      selection.equippedPieceIds.cloakBack !== undefined
    );
  }

  return selection.equippedPieceIds[slot] !== undefined;
}

function pieceButtonName(label: string, pieceId: string): string {
  return `${label} ${pieceIndex(pieceId)}`;
}

function choiceButtonClass(selected: boolean): string {
  const interactionClass =
    'cursor-pointer transition-colors enabled:hover:border-[var(--site-accent-strong)] enabled:hover:bg-[var(--site-accent-bg)] enabled:hover:text-[var(--site-accent-strong)] enabled:hover:shadow-sm';

  if (selected) {
    return `${interactionClass} border-[var(--site-accent-strong)] bg-[var(--site-accent-bg)] text-[var(--site-accent-strong)] ring-2 ring-[var(--site-accent-strong)]`;
  }

  return `${interactionClass} border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] text-[var(--site-ink)]`;
}

function flatChestImageOptions(
  selection: ArmorSelection,
  pieceId: string,
): { flatChest: true } | undefined {
  if (selection.chestCurve) {
    return undefined;
  }

  if (!chestCurveControlEnabled(selection)) {
    return undefined;
  }

  if (pieceSlot(pieceId) !== 'chest') {
    return undefined;
  }

  return { flatChest: true };
}

function thumbnailIsFlipped(pieceId: string): boolean {
  return pieceSlot(pieceId) === 'shoulderLeft';
}

function requireLocalArmorPngPath(imagePath: unknown, pieceId: string): string {
  const pieceLabel = JSON.stringify(pieceId);
  if (typeof imagePath !== 'string') {
    throw new Error(
      `Armor piece image path for ${pieceLabel} must be a string. Received ${describeReceivedValue(imagePath)}.`,
    );
  }

  if (
    !imagePath.startsWith('/armor-creator/') ||
    !imagePath.endsWith('.png') ||
    imagePath.includes('//') ||
    imagePath.includes('..') ||
    imagePath.includes('\\') ||
    imagePath.includes(' ') ||
    imagePath.includes('?') ||
    imagePath.includes('#')
  ) {
    throw new Error(
      `Armor piece image path for ${pieceLabel} must be a local /armor-creator PNG. Received ${JSON.stringify(imagePath)}.`,
    );
  }

  return imagePath;
}

function readArmorPieceImagePath(selection: ArmorSelection, pieceId: string): string {
  const flatChestOptions = flatChestImageOptions(selection, pieceId);
  const imagePath =
    flatChestOptions === undefined
      ? armorPieceImagePath(pieceId)
      : armorPieceImagePath(pieceId, flatChestOptions);

  return requireLocalArmorPngPath(imagePath, pieceId);
}

function ArmorPieceImage({
  imagePath,
  flipped,
  onLoadError,
}: {
  imagePath: string;
  flipped: boolean;
  onLoadError: (imagePath: string) => void;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none block h-full w-full overflow-hidden rounded-sm',
        ARMOR_LINE_ART_SURFACE_CLASS,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- public armor PNG must stay unoptimized so the original line art is not recolored */}
      <img
        src={imagePath}
        alt=""
        className={cn('h-full w-full object-contain', flipped && '-scale-x-100')}
        onError={() => {
          onLoadError(imagePath);
        }}
      />
    </span>
  );
}

function ArmorPieceButton({
  pieceId,
  label,
  equipped,
  selection,
  onToggle,
}: {
  pieceId: string;
  label: string;
  equipped: boolean;
  selection: ArmorSelection;
  onToggle: (pieceId: string) => void;
}) {
  const [failedImagePath, setFailedImagePath] = useState<string | null>(null);
  const buttonName = pieceButtonName(label, pieceId);
  let imagePath: string | null = null;
  let pathFailure: string | null = null;

  try {
    imagePath = readArmorPieceImagePath(selection, pieceId);
  } catch (failure: unknown) {
    pathFailure = describeFailure(failure);
  }

  const loadFailure =
    imagePath !== null && failedImagePath === imagePath
      ? `Armor piece image failed to load. Received ${JSON.stringify(imagePath)}.`
      : null;
  const visibleFailure = pathFailure ?? loadFailure;

  return (
    <button
      type="button"
      aria-pressed={equipped}
      aria-label={buttonName}
      className={cn(
        'relative flex aspect-square items-center justify-center overflow-hidden rounded-md border p-1',
        choiceButtonClass(equipped),
      )}
      onClick={() => onToggle(pieceId)}
    >
      {imagePath === null || visibleFailure !== null ? (
        <span className="break-all px-0.5 text-left text-[10px] leading-tight text-red-800">
          {visibleFailure ??
            `Armor piece image path for ${JSON.stringify(pieceId)} is missing. Received null.`}
        </span>
      ) : (
        <ArmorPieceImage
          imagePath={imagePath}
          flipped={thumbnailIsFlipped(pieceId)}
          onLoadError={setFailedImagePath}
        />
      )}
    </button>
  );
}

function ArmorPieceGrid({
  pieceIds,
  label,
  selection,
  onToggle,
}: {
  pieceIds: readonly string[];
  label: string;
  selection: ArmorSelection;
  onToggle: (pieceId: string) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
      {pieceIds.map((pieceId) => (
        <ArmorPieceButton
          key={pieceId}
          pieceId={pieceId}
          label={label}
          equipped={isArmorPieceEquipped(selection, pieceId)}
          selection={selection}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}

function ArmorPicker({
  copy,
  selection,
  activeSlot,
  onGender,
  onMaterial,
  onSlot,
  onTogglePiece,
}: {
  copy: ArmorCreatorCopy;
  selection: ArmorSelection;
  activeSlot: PickerSlot;
  onGender: (gender: ArmorGender) => void;
  onMaterial: (material: ArmorMaterial) => void;
  onSlot: (slot: PickerSlot) => void;
  onTogglePiece: (pieceId: string) => void;
}) {
  return (
    <section className="min-w-0 flex-1 space-y-4">
      <ArmorPickerHeader
        copy={copy}
        gender={selection.gender}
        material={selection.material}
        onGender={onGender}
        onMaterial={onMaterial}
      />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-5">
        {PICKER_SLOTS.map((slot) => {
          const selected = activeSlot === slot;
          return (
            <button
              key={slot}
              type="button"
              aria-pressed={selected}
              className={cn(
                'relative h-full min-w-0 whitespace-normal break-words rounded-md border px-3 py-2 text-center text-sm leading-5',
                choiceButtonClass(selected),
              )}
              onClick={() => onSlot(slot)}
            >
              {pickerSlotLabel(copy, slot)}
              {pickerSlotIsWorn(selection, slot) ? (
                <span
                  aria-hidden="true"
                  className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[var(--site-accent-strong)]"
                />
              ) : null}
            </button>
          );
        })}
      </div>
      {activeSlot === 'cloak' ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm text-[var(--site-accent-strong)]">{copy.cloakFront}</h3>
            <ArmorPieceGrid
              pieceIds={listCloakPieceIds(selection, 'cloakFront')}
              label={copy.cloakFront}
              selection={selection}
              onToggle={onTogglePiece}
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm text-[var(--site-accent-strong)]">{copy.cloakBack}</h3>
            <ArmorPieceGrid
              pieceIds={listCloakPieceIds(selection, 'cloakBack')}
              label={copy.cloakBack}
              selection={selection}
              onToggle={onTogglePiece}
            />
          </div>
        </div>
      ) : (
        <ArmorPieceGrid
          pieceIds={listPickerPieceIds(selection, activeSlot)}
          label={pickerSlotLabel(copy, activeSlot)}
          selection={selection}
          onToggle={onTogglePiece}
        />
      )}
    </section>
  );
}

function outfitSlotLabels(copy: ArmorCreatorCopy): readonly [string, string, string, string] {
  return [copy.outfitSlot(1), copy.outfitSlot(2), copy.outfitSlot(3), copy.outfitSlot(4)];
}

function ArmorPreview({
  copy,
  canvasRef,
  failureMessage,
  activeOutfitSlot,
  shoulderSymmetry,
  chestCurve,
  chestCurveEnabled,
  onSelectOutfitSlot,
  onShoulderSymmetry,
  onChestCurve,
  onClear,
  onDownload,
}: {
  copy: ArmorCreatorCopy;
  canvasRef: Ref<HTMLCanvasElement>;
  failureMessage: string | null;
  activeOutfitSlot: ArmorSaveSlotNumber | null;
  shoulderSymmetry: boolean;
  chestCurve: boolean;
  chestCurveEnabled: boolean;
  onSelectOutfitSlot: (slotNumber: ArmorSaveSlotNumber) => void;
  onShoulderSymmetry: () => void;
  onChestCurve: () => void;
  onClear: () => void;
  onDownload: () => void;
}) {
  return (
    <section className="order-1 w-full lg:order-2 lg:w-[600px] lg:shrink-0">
      <h2 className="font-display text-xl text-[var(--site-accent-strong)]">{copy.preview}</h2>
      <div className={cn('mt-3 rounded-2xl p-3', ARMOR_LINE_ART_SURFACE_CLASS)}>
        <canvas
          ref={canvasRef}
          width={ARMOR_PREVIEW_WIDTH}
          height={ARMOR_PREVIEW_HEIGHT}
          className="h-auto w-full bg-[#fffaf4]"
        />
      </div>
      <div className="mt-3">
        <ArmorPreviewOutfitSlots
          labels={outfitSlotLabels(copy)}
          activeOutfitSlot={activeOutfitSlot}
          onSelect={onSelectOutfitSlot}
        />
      </div>
      <div className="mt-3">
        <ArmorPickerActions
          copy={copy}
          shoulderSymmetry={shoulderSymmetry}
          chestCurve={chestCurve}
          chestCurveEnabled={chestCurveEnabled}
          onShoulderSymmetry={onShoulderSymmetry}
          onChestCurve={onChestCurve}
          onClear={onClear}
          onDownload={onDownload}
        />
      </div>
      {failureMessage !== null ? (
        <p role="alert" className="mt-3 text-sm text-red-300">
          {failureMessage}
        </p>
      ) : null}
    </section>
  );
}

export function ArmorCreatorWorkbench({ locale }: { locale: SiteLocale }) {
  const copy = getArmorCreatorCopy(locale);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const actionFailureRef = useRef(false);
  const activeOutfitSlotRef = useRef<ArmorSaveSlotNumber | null>(null);
  const outfitWriteGenerationsRef = useRef(createOutfitWriteGenerations());
  const [selection, setSelection] = useState<ArmorSelection>(createInitialArmorSelection);
  const [activeSlot, setActiveSlot] = useState<PickerSlot>('helm');
  const [activeOutfitSlot, setActiveOutfitSlot] = useState<ArmorSaveSlotNumber | null>(null);
  const [failureMessage, setFailureMessage] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      throw new Error('Armor preview canvas is missing. Received null.');
    }

    const context = canvas.getContext('2d');
    if (context === null) {
      const missingContextMessage = 'Armor preview canvas has no 2d context. Received null.';
      const reportMissingContext = () => {
        setFailureMessage(missingContextMessage);
      };
      const reportTimer = window.setTimeout(reportMissingContext, 0);
      return () => {
        window.clearTimeout(reportTimer);
      };
    }

    let ignore = false;
    drawArmorLayers(context, selection, () => !ignore)
      .then(() => {
        if (ignore) {
          return;
        }

        if (actionFailureRef.current) {
          return;
        }

        setFailureMessage(null);
      })
      .catch((failure: unknown) => {
        if (ignore) {
          return;
        }

        setFailureMessage(describeFailure(failure));
      });

    return () => {
      ignore = true;
    };
  }, [selection]);

  function beginArmorAction(): void {
    actionFailureRef.current = false;
  }

  function reportFailure(failure: unknown) {
    actionFailureRef.current = true;
    setFailureMessage(describeFailure(failure));
  }

  function startOutfitWrite(
    storage: ArmorSaveStorage,
    slotNumber: ArmorSaveSlotNumber,
    selectionAtClick: ArmorSelection,
  ): void {
    const generation = nextOutfitWriteGeneration(outfitWriteGenerationsRef.current, slotNumber);
    void writeOutfitSelection({
      storage,
      slotNumber,
      selection: selectionAtClick,
      outfitWriteIsLatest: () =>
        outfitWriteGenerationIsCurrent(outfitWriteGenerationsRef.current, slotNumber, generation),
    }).catch(reportFailure);
  }

  function showLoadedOutfit(loadedOutfit: LoadedOutfitSlot): void {
    activeOutfitSlotRef.current = loadedOutfit.activeOutfitSlot;
    setActiveOutfitSlot(loadedOutfit.activeOutfitSlot);
    setSelection(loadedOutfit.selection);
  }

  function commitArmorSelection(nextSelection: ArmorSelection): void {
    beginArmorAction();
    setSelection(nextSelection);
    try {
      const slotNumber = activeOutfitSlotForAutosave(activeOutfitSlotRef.current);
      if (slotNumber === null) {
        return;
      }

      startOutfitWrite(requireBrowserSaveStorage(), slotNumber, nextSelection);
    } catch (failure: unknown) {
      reportFailure(failure);
    }
  }

  function onTogglePiece(pieceId: string): void {
    commitArmorSelection(wearOrRemoveArmorPiece(selection, pieceId));
  }

  function selectOutfitSlot(slotNumber: ArmorSaveSlotNumber): void {
    if (activeOutfitSlotRef.current === slotNumber) {
      return;
    }

    beginArmorAction();
    try {
      const loadedOutfit = loadOutfitSlot(slotNumber);
      showLoadedOutfit(loadedOutfit);
      if (loadedOutfit.storedRecord === null) {
        startOutfitWrite(loadedOutfit.storage, loadedOutfit.activeOutfitSlot, loadedOutfit.selection);
      }
    } catch (failure: unknown) {
      reportFailure(failure);
    }
  }

  function onDownload(): void {
    beginArmorAction();
    const selectionAtClick = selection;
    void downloadArmorSelection(selectionAtClick).catch(reportFailure);
  }

  return (
    <div className="space-y-6 rounded-2xl border border-[var(--site-border-strong)] bg-[var(--site-panel)] p-4 text-[var(--site-ink)] sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="order-2 min-w-0 flex-1 lg:order-1">
          <ArmorPicker
            copy={copy}
            selection={selection}
            activeSlot={activeSlot}
            onGender={(gender) => commitArmorSelection(selectArmorGender(selection, gender))}
            onMaterial={(material) => commitArmorSelection(selectArmorMaterial(selection, material))}
            onSlot={setActiveSlot}
            onTogglePiece={onTogglePiece}
          />
        </div>
        <ArmorPreview
          copy={copy}
          canvasRef={canvasRef}
          failureMessage={failureMessage}
          activeOutfitSlot={activeOutfitSlot}
          shoulderSymmetry={selection.shoulderSymmetry}
          chestCurve={selection.chestCurve}
          chestCurveEnabled={chestCurveControlEnabled(selection)}
          onSelectOutfitSlot={selectOutfitSlot}
          onShoulderSymmetry={() =>
            commitArmorSelection(setShoulderSymmetry(selection, !selection.shoulderSymmetry))
          }
          onChestCurve={() => commitArmorSelection(setChestCurve(selection, !selection.chestCurve))}
          onClear={() => commitArmorSelection(clearArmorEquipment(selection))}
          onDownload={onDownload}
        />
      </div>
    </div>
  );
}
