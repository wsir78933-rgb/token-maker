'use client';

import { useEffect, useRef, useState, type Ref } from 'react';

import { WeaponPreviewWeaponSlots } from '@/components/weapon-creator/WeaponPreviewWeaponSlots';
import {
  WEAPON_CATEGORIES,
  WEAPON_PREVIEW_HEIGHT,
  WEAPON_PREVIEW_WIDTH,
  pieceCategory,
  listWeaponPieceIds,
  type WeaponCategory,
} from '@/lib/weapon-creator/catalog';
import { getWeaponCreatorCopy, type WeaponCreatorCopy } from '@/lib/weapon-creator/copy';
import { WEAPON_EXPORT_SCALE } from '@/lib/weapon-creator/constants';
import { weaponPieceImagePath } from '@/lib/weapon-creator/icons';
import { canvasToWeaponPng, drawWeaponLayers } from '@/lib/weapon-creator/render';
import {
  readWeaponSaveSlot,
  writeWeaponSaveSlot,
  type WeaponSaveSlotNumber,
  type WeaponSaveRecord,
  type WeaponSaveStorage,
} from '@/lib/weapon-creator/saves';
import {
  clearWeaponSelection,
  createInitialWeaponSelection,
  isWeaponPieceEquipped,
  toggleWeaponPiece,
  type WeaponSelection,
} from '@/lib/weapon-creator/selection';
import type { SiteLocale } from '@/lib/site-locale';
import { cn } from '@/lib/utils';

const WEAPON_LINE_ART_SURFACE_CLASS =
  'border border-[var(--site-accent-strong)] bg-[#fffaf4]';
const WEAPON_EXPORT_WIDTH = WEAPON_PREVIEW_WIDTH * WEAPON_EXPORT_SCALE;
const WEAPON_EXPORT_HEIGHT = WEAPON_PREVIEW_HEIGHT * WEAPON_EXPORT_SCALE;

type WeaponWriteGenerations = Record<WeaponSaveSlotNumber, number>;
type WeaponSlotSelections = Record<WeaponSaveSlotNumber, WeaponSelection | null>;
type WeaponSaveFailureMessages = Record<WeaponSaveSlotNumber, string | null>;

type WeaponSelectionWrite = {
  storage: WeaponSaveStorage;
  slotNumber: WeaponSaveSlotNumber;
  selection: WeaponSelection;
  weaponWriteIsLatest: () => boolean;
};

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

  try {
    const serialized = JSON.stringify(value);
    return typeof serialized === 'string' ? serialized : Object.prototype.toString.call(value);
  } catch (failure: unknown) {
    if (failure instanceof Error && failure.message.length > 0) {
      return `${Object.prototype.toString.call(value)} (JSON serialization failed: ${failure.message}).`;
    }

    throw failure;
  }
}

function describeFailure(failure: unknown, fallback: string): string {
  if (failure instanceof Error && failure.message.length > 0) {
    return failure.message;
  }

  if (typeof failure === 'string' && failure.length > 0) {
    return failure;
  }

  return `${fallback} Received ${describeReceivedValue(failure)}.`;
}

function requireBrowserSaveStorage(): WeaponSaveStorage {
  const storage = globalThis.localStorage;
  if (storage === undefined || storage === null) {
    throw new Error(
      `Weapon save storage is unavailable. Received ${storage === undefined ? 'undefined' : 'null'}.`,
    );
  }

  return storage;
}

function requireLocalWeaponPngPath(imagePath: unknown, pieceId: string): string {
  if (
    typeof imagePath !== 'string' ||
    !imagePath.startsWith('/weapon-creator/') ||
    !imagePath.endsWith('.png') ||
    imagePath.includes('//') ||
    imagePath.includes('..') ||
    imagePath.includes('\\') ||
    imagePath.includes(' ') ||
    imagePath.includes('?') ||
    imagePath.includes('#')
  ) {
    throw new Error(
      `Weapon piece ${JSON.stringify(pieceId)} image path must be a local /weapon-creator PNG. Received ${describeReceivedValue(imagePath)}.`,
    );
  }

  return imagePath;
}

function readWeaponPiecePath(pieceId: string): string {
  return requireLocalWeaponPngPath(weaponPieceImagePath(pieceId), pieceId);
}

function categoryLabel(copy: WeaponCreatorCopy, category: WeaponCategory): string {
  const label = copy.categoryLabels[category];
  if (typeof label !== 'string' || label.trim().length === 0) {
    throw new Error(`Weapon category label is missing for ${JSON.stringify(category)}.`);
  }

  return label;
}

function categoryIsEquipped(selection: WeaponSelection, category: WeaponCategory): boolean {
  return Object.values(selection.equippedPieceIds).some(
    (pieceId) => pieceId !== undefined && pieceCategory(pieceId) === category,
  );
}

function weaponSelectionsEqual(
  firstSelection: WeaponSelection,
  secondSelection: WeaponSelection,
): boolean {
  const firstCategories = Object.keys(firstSelection.equippedPieceIds) as WeaponCategory[];
  const secondCategories = Object.keys(secondSelection.equippedPieceIds) as WeaponCategory[];

  if (firstCategories.length !== secondCategories.length) {
    return false;
  }

  return firstCategories.every(
    (category) =>
      firstSelection.equippedPieceIds[category] === secondSelection.equippedPieceIds[category],
  );
}

function choiceButtonClass(selected: boolean): string {
  const interactionClass =
    'cursor-pointer transition-colors enabled:hover:border-[var(--site-accent-strong)] enabled:hover:bg-[var(--site-accent-bg)] enabled:hover:text-[var(--site-accent-strong)] enabled:hover:shadow-sm';

  if (selected) {
    return `${interactionClass} border-[var(--site-accent-strong)] bg-[var(--site-accent-bg)] text-[var(--site-accent-strong)] ring-2 ring-[var(--site-accent-strong)]`;
  }

  return `${interactionClass} border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] text-[var(--site-ink)]`;
}

function WeaponPieceImage({
  imagePath,
  onLoadError,
}: {
  imagePath: string;
  onLoadError: (imagePath: string) => void;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none block h-full w-full overflow-hidden rounded-sm',
        WEAPON_LINE_ART_SURFACE_CLASS,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- weapon PNGs are local source assets and must remain unoptimized */}
      <img
        src={imagePath}
        alt=""
        className="h-full w-full object-contain"
        onError={() => onLoadError(imagePath)}
      />
    </span>
  );
}

function WeaponPieceButton({
  pieceId,
  pieceNumber,
  label,
  equipped,
  onToggle,
  copy,
}: {
  pieceId: string;
  pieceNumber: number;
  label: string;
  equipped: boolean;
  onToggle: (pieceId: string) => void;
  copy: WeaponCreatorCopy;
}) {
  const [failedImagePath, setFailedImagePath] = useState<string | null>(null);
  let imagePath: string | null = null;
  let pathFailure: string | null = null;

  try {
    imagePath = readWeaponPiecePath(pieceId);
  } catch (failure: unknown) {
    pathFailure = describeFailure(failure, 'Weapon piece path is invalid.');
  }

  const loadFailure =
    imagePath !== null && failedImagePath === imagePath
      ? copy.imageLoadError(imagePath)
      : null;
  const visibleFailure = pathFailure ?? loadFailure;

  return (
    <button
      type="button"
      aria-pressed={equipped}
      aria-label={`${label} ${pieceNumber}`}
      className={cn(
        'relative flex aspect-square min-w-0 items-center justify-center overflow-hidden rounded-md border p-1',
        choiceButtonClass(equipped),
      )}
      onClick={() => onToggle(pieceId)}
    >
      {imagePath === null || visibleFailure !== null ? (
        <span className="break-all px-0.5 text-left text-[10px] leading-tight text-red-800">
          {visibleFailure ?? copy.imageLoadError(imagePath ?? pieceId)}
        </span>
      ) : (
        <WeaponPieceImage imagePath={imagePath} onLoadError={setFailedImagePath} />
      )}
    </button>
  );
}

function WeaponPieceGrid({
  copy,
  selection,
  category,
  onToggle,
}: {
  copy: WeaponCreatorCopy;
  selection: WeaponSelection;
  category: WeaponCategory;
  onToggle: (pieceId: string) => void;
}) {
  const label = categoryLabel(copy, category);
  const pieceIds = listWeaponPieceIds(category);

  return (
    <div className="max-h-[min(48vh,26rem)] overflow-y-auto pr-1">
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 lg:grid-cols-[repeat(auto-fit,minmax(4rem,5.5rem))]">
        {pieceIds.map((pieceId, index) => (
          <WeaponPieceButton
            key={pieceId}
            pieceId={pieceId}
            pieceNumber={index + 1}
            label={label}
            equipped={isWeaponPieceEquipped(selection, pieceId)}
            onToggle={onToggle}
            copy={copy}
          />
        ))}
      </div>
    </div>
  );
}

function WeaponPicker({
  copy,
  selection,
  activeCategory,
  onCategory,
  onToggle,
}: {
  copy: WeaponCreatorCopy;
  selection: WeaponSelection;
  activeCategory: WeaponCategory;
  onCategory: (category: WeaponCategory) => void;
  onToggle: (pieceId: string) => void;
}) {
  return (
    <section className="min-w-0 flex-1 space-y-4 lg:space-y-3">
      <h2 className="sr-only">{copy.categoryPickerLabel}</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-5">
        {WEAPON_CATEGORIES.map((category) => {
          const selected = activeCategory === category;
          const label = categoryLabel(copy, category);

          return (
            <button
              key={category}
              type="button"
              aria-pressed={selected}
              aria-label={label}
              className={cn(
                'relative h-full min-w-0 whitespace-normal break-words rounded-md border px-3 py-2 text-center text-sm leading-5',
                choiceButtonClass(selected),
              )}
              onClick={() => onCategory(category)}
            >
              {label}
              {categoryIsEquipped(selection, category) ? (
                <span
                  aria-hidden="true"
                  className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[var(--site-accent-strong)]"
                />
              ) : null}
            </button>
          );
        })}
      </div>
      <WeaponPieceGrid
        copy={copy}
        selection={selection}
        category={activeCategory}
        onToggle={onToggle}
      />
    </section>
  );
}

function weaponSlotLabels(copy: WeaponCreatorCopy): readonly [string, string, string, string] {
  return [copy.weaponSlot(1), copy.weaponSlot(2), copy.weaponSlot(3), copy.weaponSlot(4)];
}

function WeaponPreview({
  copy,
  canvasRef,
  failureMessage,
  activeWeaponSlot,
  onSelectWeaponSlot,
  onClear,
  onDownload,
}: {
  copy: WeaponCreatorCopy;
  canvasRef: Ref<HTMLCanvasElement>;
  failureMessage: string | null;
  activeWeaponSlot: WeaponSaveSlotNumber | null;
  onSelectWeaponSlot: (slotNumber: WeaponSaveSlotNumber) => void;
  onClear: () => void;
  onDownload: () => void;
}) {
  return (
    <section className="order-1 w-full lg:order-2 lg:w-[480px] lg:shrink-0">
      <h2 className="font-display text-xl text-[var(--site-accent-strong)]">{copy.previewLabel}</h2>
      <div className={cn('mt-3 rounded-2xl p-3', WEAPON_LINE_ART_SURFACE_CLASS)}>
        <canvas
          ref={canvasRef}
          width={WEAPON_PREVIEW_WIDTH}
          height={WEAPON_PREVIEW_HEIGHT}
          aria-label={copy.previewLabel}
          className="block h-auto w-full bg-[#fffaf4]"
        />
      </div>
      <div className="mt-3">
        <WeaponPreviewWeaponSlots
          labels={weaponSlotLabels(copy)}
          activeWeaponSlot={activeWeaponSlot}
          onSelect={onSelectWeaponSlot}
        />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          className={cn('w-full rounded-md border px-3 py-2 text-sm', choiceButtonClass(false))}
          onClick={onClear}
        >
          {copy.clearEquipment}
        </button>
        <button
          type="button"
          className={cn('w-full rounded-md border px-3 py-2 text-sm', choiceButtonClass(false))}
          onClick={onDownload}
        >
          {copy.downloadImage}
        </button>
      </div>
      {failureMessage !== null ? (
        <p role="alert" className="mt-3 break-words text-sm text-red-300">
          {failureMessage}
        </p>
      ) : null}
    </section>
  );
}

function createWeaponWriteGenerations(): WeaponWriteGenerations {
  return {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  };
}

function createWeaponSlotSelections(): WeaponSlotSelections {
  return {
    1: null,
    2: null,
    3: null,
    4: null,
  };
}

function createWeaponSaveFailureMessages(): WeaponSaveFailureMessages {
  return {
    1: null,
    2: null,
    3: null,
    4: null,
  };
}

function nextWeaponWriteGeneration(
  generations: WeaponWriteGenerations,
  slotNumber: WeaponSaveSlotNumber,
): number {
  const nextGeneration = generations[slotNumber] + 1;
  generations[slotNumber] = nextGeneration;
  return nextGeneration;
}

function weaponWriteGenerationIsCurrent(
  generations: WeaponWriteGenerations,
  slotNumber: WeaponSaveSlotNumber,
  generation: number,
): boolean {
  return generations[slotNumber] === generation;
}

function createWeaponCanvas(
  width: number,
  height: number,
  canvasLabel: string,
): HTMLCanvasElement {
  if (typeof document.createElement !== 'function') {
    throw new Error(
      `Weapon ${canvasLabel} requires document.createElement. Received typeof ${typeof document.createElement}.`,
    );
  }

  const canvas = document.createElement('canvas');
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error(
      `Weapon ${canvasLabel} canvas must be an HTMLCanvasElement. Received ${Object.prototype.toString.call(canvas)}.`,
    );
  }

  canvas.width = width;
  canvas.height = height;
  if (canvas.width !== width || canvas.height !== height) {
    throw new Error(
      `Weapon ${canvasLabel} canvas must be ${String(width)}x${String(height)}. Received ${String(canvas.width)}x${String(canvas.height)}.`,
    );
  }

  if (canvas.isConnected) {
    throw new Error(
      `Weapon ${canvasLabel} canvas must be independent from the preview. Received a connected canvas ${String(canvas.width)}x${String(canvas.height)}.`,
    );
  }

  return canvas;
}

function requireCanvasContext2d(canvas: HTMLCanvasElement, action: string): CanvasRenderingContext2D {
  const context = canvas.getContext('2d');
  if (context === null) {
    throw new Error(`Weapon ${action} canvas has no 2d context. Received null.`);
  }

  return context;
}

async function paintSelectionForExport(
  selection: WeaponSelection,
  shouldApply?: () => boolean,
): Promise<HTMLCanvasElement> {
  const canvas = createWeaponCanvas(
    WEAPON_EXPORT_WIDTH,
    WEAPON_EXPORT_HEIGHT,
    'download',
  );
  const context = requireCanvasContext2d(canvas, 'download');
  await drawWeaponLayers(context, selection, shouldApply);
  return canvas;
}

async function paintSelectionForThumbnail(
  selection: WeaponSelection,
  shouldApply: () => boolean,
): Promise<HTMLCanvasElement> {
  const canvas = createWeaponCanvas(
    WEAPON_PREVIEW_WIDTH,
    WEAPON_PREVIEW_HEIGHT,
    'save thumbnail',
  );
  const context = requireCanvasContext2d(canvas, 'save thumbnail');
  await drawWeaponLayers(context, selection, shouldApply);
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
      `Weapon save thumbnail requires FileReader. Received typeof ${typeof FileReader}.`,
    );
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string' || !result.startsWith('data:image/png;base64,')) {
        const received =
          typeof result === 'string' ? JSON.stringify(result.slice(0, 32)) : String(result);
        reject(new Error(`Weapon save thumbnail must be a PNG data URL. Received ${received}.`));
        return;
      }

      resolve(result);
    };
    reader.onerror = () => {
      reject(
        new Error(
          `Weapon save thumbnail could not be read from the preview blob. Received ${describeFileReaderError(reader.error)}.`,
        ),
      );
    };
    reader.readAsDataURL(blob);
  });
}

async function readWeaponThumbnailDataUrl(
  selection: WeaponSelection,
  weaponWriteIsLatest: () => boolean,
): Promise<string | null> {
  const canvas = await paintSelectionForThumbnail(selection, weaponWriteIsLatest);
  if (!weaponWriteIsLatest()) {
    return null;
  }

  const blob = await canvasToWeaponPng(canvas);
  if (!weaponWriteIsLatest()) {
    return null;
  }

  const thumbnailDataUrl = await readBlobPngDataUrl(blob);
  if (!weaponWriteIsLatest()) {
    return null;
  }

  return thumbnailDataUrl;
}

function writeLatestWeaponSave(input: WeaponSelectionWrite, thumbnailDataUrl: string): void {
  if (!input.weaponWriteIsLatest()) {
    return;
  }

  const record: WeaponSaveRecord = {
    snapshot: input.selection,
    thumbnailDataUrl,
  };
  writeWeaponSaveSlot(input.storage, input.slotNumber, record);
}

async function writeWeaponSelection(input: WeaponSelectionWrite): Promise<void> {
  const thumbnailDataUrl = await readWeaponThumbnailDataUrl(
    input.selection,
    input.weaponWriteIsLatest,
  );
  if (thumbnailDataUrl === null) {
    return;
  }

  writeLatestWeaponSave(input, thumbnailDataUrl);
}

function requireDownloadUrlFunction(
  urlFunction: unknown,
  functionName: 'createObjectURL' | 'revokeObjectURL',
): void {
  if (typeof urlFunction !== 'function') {
    throw new Error(
      `Weapon download requires URL.${functionName}. Received typeof ${typeof urlFunction}.`,
    );
  }
}

async function downloadWeaponPreview(canvas: HTMLCanvasElement): Promise<void> {
  const blob = await canvasToWeaponPng(canvas);
  const urlApi = globalThis.URL;
  requireDownloadUrlFunction(urlApi.createObjectURL, 'createObjectURL');
  requireDownloadUrlFunction(urlApi.revokeObjectURL, 'revokeObjectURL');

  const objectUrl = urlApi.createObjectURL(blob);
  try {
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = 'weapon.png';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  } finally {
    urlApi.revokeObjectURL(objectUrl);
  }
}

async function downloadWeaponSelection(selection: WeaponSelection): Promise<void> {
  const canvas = await paintSelectionForExport(selection);
  await downloadWeaponPreview(canvas);
}

export function WeaponCreatorWorkbench({ locale }: { locale: SiteLocale }) {
  const copy = getWeaponCreatorCopy(locale);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeWeaponSlotRef = useRef<WeaponSaveSlotNumber | null>(null);
  const weaponWriteGenerationsRef = useRef(createWeaponWriteGenerations());
  const weaponSlotSelectionsRef = useRef(createWeaponSlotSelections());
  const weaponSaveFailureMessagesRef = useRef(createWeaponSaveFailureMessages());
  const interactionGenerationRef = useRef(0);
  const actionFailureRef = useRef(false);
  const [selection, setSelection] = useState<WeaponSelection>(createInitialWeaponSelection);
  const [activeCategory, setActiveCategory] = useState<WeaponCategory>(WEAPON_CATEGORIES[0]);
  const [activeWeaponSlot, setActiveWeaponSlot] = useState<WeaponSaveSlotNumber | null>(null);
  const [failureMessage, setFailureMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function renderPreview(): Promise<void> {
      const canvas = canvasRef.current;
      if (canvas === null) {
        throw new Error('Weapon preview canvas is missing. Received null.');
      }

      const context = canvas.getContext('2d');
      if (context === null) {
        throw new Error('Weapon preview canvas has no 2d context. Received null.');
      }

      await drawWeaponLayers(context, selection, () => !ignore);
    }

    void renderPreview()
      .then(() => {
        if (!ignore && !actionFailureRef.current) {
          setFailureMessage(null);
        }
      })
      .catch((failure: unknown) => {
        if (!ignore) {
          setFailureMessage(describeFailure(failure, copy.previewLoadError));
        }
      });

    return () => {
      ignore = true;
    };
  }, [copy.previewLoadError, selection]);

  function reportFailure(failure: unknown, fallback: string): void {
    actionFailureRef.current = true;
    setFailureMessage(describeFailure(failure, fallback));
  }

  function nextInteractionGeneration(): number {
    const nextGeneration = interactionGenerationRef.current + 1;
    interactionGenerationRef.current = nextGeneration;
    return nextGeneration;
  }

  function interactionGenerationIsCurrent(generation: number): boolean {
    return interactionGenerationRef.current === generation;
  }

  function reportWeaponSaveFailure(
    slotNumber: WeaponSaveSlotNumber,
    failure: unknown,
  ): void {
    const failureDetail = describeFailure(failure, 'Weapon selection could not be saved.');
    const failureMessage = `Weapon slot ${slotNumber} save failed. ${failureDetail}`;
    weaponSaveFailureMessagesRef.current[slotNumber] = failureMessage;

    if (activeWeaponSlotRef.current === slotNumber) {
      actionFailureRef.current = true;
      setFailureMessage(failureMessage);
    }
  }

  function startWeaponWrite(
    storage: WeaponSaveStorage,
    slotNumber: WeaponSaveSlotNumber,
    selectionAtClick: WeaponSelection,
  ): void {
    const generation = nextWeaponWriteGeneration(weaponWriteGenerationsRef.current, slotNumber);
    const saveInteractionGeneration = interactionGenerationRef.current;
    const weaponWriteIsLatest = () =>
      weaponWriteGenerationIsCurrent(
        weaponWriteGenerationsRef.current,
        slotNumber,
        generation,
      );

    void writeWeaponSelection({
      storage,
      slotNumber,
      selection: selectionAtClick,
      weaponWriteIsLatest,
    })
      .then(() => {
        if (!weaponWriteIsLatest()) {
          return;
        }

        weaponSaveFailureMessagesRef.current[slotNumber] = null;
        if (
          activeWeaponSlotRef.current === slotNumber &&
          interactionGenerationIsCurrent(saveInteractionGeneration)
        ) {
          actionFailureRef.current = false;
          setFailureMessage(null);
        }
      })
      .catch((failure: unknown) => {
        if (weaponWriteIsLatest()) {
          reportWeaponSaveFailure(slotNumber, failure);
        }
      });
  }

  function commitSelection(nextSelection: WeaponSelection): void {
    if (weaponSelectionsEqual(selection, nextSelection)) {
      return;
    }

    nextInteractionGeneration();
    actionFailureRef.current = false;
    setFailureMessage(null);
    setSelection(nextSelection);

    const slotNumber = activeWeaponSlotRef.current;
    if (slotNumber === null) {
      return;
    }

    weaponSlotSelectionsRef.current[slotNumber] = nextSelection;
    weaponSaveFailureMessagesRef.current[slotNumber] = null;

    try {
      startWeaponWrite(requireBrowserSaveStorage(), slotNumber, nextSelection);
    } catch (failure: unknown) {
      reportFailure(failure, 'Weapon selection could not be saved.');
    }
  }

  function selectWeaponSlot(slotNumber: WeaponSaveSlotNumber): void {
    if (activeWeaponSlotRef.current === slotNumber) {
      return;
    }

    const previousWeaponSlot = activeWeaponSlotRef.current;
    nextInteractionGeneration();
    actionFailureRef.current = false;
    try {
      const storage = requireBrowserSaveStorage();
      if (previousWeaponSlot !== null) {
        weaponSlotSelectionsRef.current[previousWeaponSlot] = selection;
      }

      nextWeaponWriteGeneration(weaponWriteGenerationsRef.current, slotNumber);
      const storedRecord = readWeaponSaveSlot(storage, slotNumber);
      const rememberedSelection = weaponSlotSelectionsRef.current[slotNumber];
      const nextSelection =
        rememberedSelection ?? storedRecord?.snapshot ?? createInitialWeaponSelection();
      weaponSlotSelectionsRef.current[slotNumber] = nextSelection;

      activeWeaponSlotRef.current = slotNumber;
      setActiveWeaponSlot(slotNumber);
      setSelection(nextSelection);

      if (rememberedSelection !== null || storedRecord === null) {
        startWeaponWrite(storage, slotNumber, nextSelection);
      }

      const rememberedFailure = weaponSaveFailureMessagesRef.current[slotNumber];
      actionFailureRef.current = rememberedFailure !== null;
      setFailureMessage(rememberedFailure);
    } catch (failure: unknown) {
      reportFailure(failure, copy.saveLoadError);
    }
  }

  function handleDownload(): void {
    const downloadGeneration = nextInteractionGeneration();
    actionFailureRef.current = false;
    const selectionAtClick = selection;
    void downloadWeaponSelection(selectionAtClick)
      .then(() => {
        if (interactionGenerationIsCurrent(downloadGeneration)) {
          setFailureMessage(null);
        }
      })
      .catch((failure: unknown) => {
        if (interactionGenerationIsCurrent(downloadGeneration)) {
          reportFailure(failure, 'Weapon image could not be downloaded.');
        }
      });
  }

  return (
    <div className="space-y-6 rounded-2xl border border-[var(--site-border-strong)] bg-[var(--site-panel)] p-4 text-[var(--site-ink)] sm:p-6 lg:p-4">
      <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-start lg:gap-4">
        <div className="order-2 min-w-0 flex-1 lg:order-1">
          <WeaponPicker
            copy={copy}
            selection={selection}
            activeCategory={activeCategory}
            onCategory={setActiveCategory}
            onToggle={(pieceId) => commitSelection(toggleWeaponPiece(selection, pieceId))}
          />
        </div>
        <WeaponPreview
          copy={copy}
          canvasRef={canvasRef}
          failureMessage={failureMessage}
          activeWeaponSlot={activeWeaponSlot}
          onSelectWeaponSlot={selectWeaponSlot}
          onClear={() => commitSelection(clearWeaponSelection(selection))}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
}
