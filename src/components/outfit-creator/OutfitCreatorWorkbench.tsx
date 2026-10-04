'use client';

import { useEffect, useRef, useState, type Ref } from 'react';

import { OutfitPreviewOutfitSlots } from '@/components/outfit-creator/OutfitPreviewOutfitSlots';
import {
  OUTFIT_CATEGORIES,
  OUTFIT_PREVIEW_HEIGHT,
  OUTFIT_PREVIEW_WIDTH,
  categoryOutfitSlot,
  listOutfitPieceIds,
  type OutfitCategory,
  type OutfitGender,
  type OutfitSlot,
} from '@/lib/outfit-creator/catalog';
import { getOutfitCreatorCopy, type OutfitCreatorCopy } from '@/lib/outfit-creator/copy';
import { outfitPieceImagePath } from '@/lib/outfit-creator/icons';
import { canvasToOutfitPng, drawOutfitLayers } from '@/lib/outfit-creator/render';
import {
  readOutfitSaveSlot,
  writeOutfitSaveSlot,
  type OutfitSaveSlotNumber,
  type OutfitSaveStorage,
} from '@/lib/outfit-creator/saves';
import {
  clearOutfitSelection,
  createInitialOutfitSelection,
  isOutfitPieceEquipped,
  setOutfitGender,
  toggleOutfitPiece,
  type OutfitSelection,
} from '@/lib/outfit-creator/selection';
import { activeOutfitSlotForAutosave, selectionForOutfitSlot } from '@/lib/outfit-creator/outfit-slot';
import type { SiteLocale } from '@/lib/site-locale';
import { cn } from '@/lib/utils';

type OutfitPreviewProps = {
  copy: OutfitCreatorCopy;
  canvasRef: Ref<HTMLCanvasElement>;
  failureMessage: string | null;
  activeOutfitSlot: OutfitSaveSlotNumber | null;
  previewTransition: OutfitPreviewTransition | null;
  onSelectOutfitSlot: (slotNumber: OutfitSaveSlotNumber) => void;
  onPreviewTransitionEnd: (transitionId: number) => void;
  onClear: () => void;
  onDownload: () => void;
};

const OUTFIT_LINE_ART_SURFACE_CLASS =
  'border border-[var(--site-accent-strong)] bg-[#fffaf4]';

type OutfitWriteGenerations = Record<OutfitSaveSlotNumber, number>;

type OutfitSelectionWrite = {
  storage: OutfitSaveStorage;
  slotNumber: OutfitSaveSlotNumber;
  selection: OutfitSelection;
  outfitWriteIsLatest: () => boolean;
};

type OutfitPreviewTransition = {
  id: number;
  outgoingDataUrl: string;
  ready: boolean;
};

type OutfitSlotTransitionIntent = {
  fromSlot: OutfitSaveSlotNumber;
  toSlot: OutfitSaveSlotNumber;
};

const OUTFIT_PREVIEW_TRANSITION_CLEANUP_DELAY_MS = 360;

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
    const json = JSON.stringify(value);
    return typeof json === 'string' ? json : Object.prototype.toString.call(value);
  } catch (error: unknown) {
    if (error instanceof Error && error.message.length > 0) {
      return `${Object.prototype.toString.call(value)} (JSON serialization failed: ${error.message}).`;
    }

    throw error;
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

function requireBrowserSaveStorage(): OutfitSaveStorage {
  const storage = globalThis.localStorage;
  if (storage === undefined || storage === null) {
    throw new Error(
      `Outfit save storage is unavailable. Received ${storage === undefined ? 'undefined' : 'null'}.`,
    );
  }

  return storage;
}

function requireLocalOutfitPngPath(imagePath: unknown, assetName: string): string {
  if (
    typeof imagePath !== 'string' ||
    !imagePath.startsWith('/outfit-creator/') ||
    !imagePath.endsWith('.png') ||
    imagePath.includes('//') ||
    imagePath.includes('..') ||
    imagePath.includes('\\') ||
    imagePath.includes(' ') ||
    imagePath.includes('?') ||
    imagePath.includes('#')
  ) {
    throw new Error(
      `Outfit ${assetName} image path must be a local /outfit-creator PNG. Received ${describeReceivedValue(imagePath)}.`,
    );
  }

  return imagePath;
}

function readOutfitPiecePath(gender: OutfitGender, pieceId: string): string {
  return requireLocalOutfitPngPath(
    outfitPieceImagePath(gender, pieceId),
    `piece ${JSON.stringify(pieceId)}`,
  );
}

function listCategoryPieceIds(category: OutfitCategory): readonly string[] {
  return listOutfitPieceIds(category);
}

function categoryLabel(copy: OutfitCreatorCopy, category: OutfitCategory): string {
  const label = copy.categoryLabels[category];
  if (typeof label !== 'string' || label.trim().length === 0) {
    throw new Error(`Outfit category label is missing for ${JSON.stringify(category)}.`);
  }

  return label;
}

function categoryIsWorn(selection: OutfitSelection, category: OutfitCategory): boolean {
  const slot = categoryOutfitSlot(category);
  return selection.equippedPieceIds[slot] !== undefined;
}

function outfitSelectionsEqual(
  firstSelection: OutfitSelection,
  secondSelection: OutfitSelection,
): boolean {
  if (firstSelection.gender !== secondSelection.gender) {
    return false;
  }

  const firstEquippedSlots = Object.keys(firstSelection.equippedPieceIds) as OutfitSlot[];
  const secondEquippedSlots = Object.keys(secondSelection.equippedPieceIds) as OutfitSlot[];
  if (firstEquippedSlots.length !== secondEquippedSlots.length) {
    return false;
  }

  return firstEquippedSlots.every(
    (slot) => firstSelection.equippedPieceIds[slot] === secondSelection.equippedPieceIds[slot],
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

function OutfitPieceImage({
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
        OUTFIT_LINE_ART_SURFACE_CLASS,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- outfit PNGs must remain unoptimized source assets */}
      <img
        src={imagePath}
        alt=""
        className="h-full w-full object-contain"
        onError={() => onLoadError(imagePath)}
      />
    </span>
  );
}

function OutfitPieceButton({
  pieceId,
  pieceNumber,
  label,
  gender,
  equipped,
  onToggle,
  copy,
}: {
  pieceId: string;
  pieceNumber: number;
  label: string;
  gender: OutfitGender;
  equipped: boolean;
  onToggle: (pieceId: string) => void;
  copy: OutfitCreatorCopy;
}) {
  const [failedImagePath, setFailedImagePath] = useState<string | null>(null);
  let imagePath: string | null = null;
  let pathFailure: string | null = null;

  try {
    imagePath = readOutfitPiecePath(gender, pieceId);
  } catch (failure: unknown) {
    pathFailure = describeFailure(failure, 'Outfit piece path is invalid.');
  }

  const loadFailure =
    imagePath !== null && failedImagePath === imagePath
      ? copy.imageLoadError(imagePath)
      : null;
  const visibleFailure = pathFailure ?? loadFailure;
  const buttonLabel = `${label} ${pieceNumber}`;

  return (
    <button
      type="button"
      aria-pressed={equipped}
      aria-label={buttonLabel}
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
        <OutfitPieceImage imagePath={imagePath} onLoadError={setFailedImagePath} />
      )}
    </button>
  );
}

function OutfitPieceGrid({
  copy,
  selection,
  category,
  onToggle,
}: {
  copy: OutfitCreatorCopy;
  selection: OutfitSelection;
  category: OutfitCategory;
  onToggle: (pieceId: string) => void;
}) {
  const label = categoryLabel(copy, category);
  const pieceIds = listCategoryPieceIds(category);

  return (
    <div className="max-h-[min(48vh,26rem)] overflow-y-auto pr-1">
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 lg:grid-cols-[repeat(auto-fit,minmax(4rem,5.5rem))]">
        {pieceIds.map((pieceId, index) => (
          <OutfitPieceButton
            key={pieceId}
            pieceId={pieceId}
            pieceNumber={index + 1}
            label={label}
            gender={selection.gender}
            equipped={isOutfitPieceEquipped(selection, pieceId)}
            onToggle={onToggle}
            copy={copy}
          />
        ))}
      </div>
    </div>
  );
}

function OutfitPicker({
  copy,
  selection,
  activeCategory,
  onGender,
  onCategory,
  onToggle,
}: {
  copy: OutfitCreatorCopy;
  selection: OutfitSelection;
  activeCategory: OutfitCategory;
  onGender: (gender: OutfitGender) => void;
  onCategory: (category: OutfitCategory) => void;
  onToggle: (pieceId: string) => void;
}) {
  return (
    <section className="min-w-0 flex-1 space-y-4 lg:space-y-3">
      <h2 className="sr-only">{copy.categoryPickerLabel}</h2>
      <OutfitGenderPicker copy={copy} gender={selection.gender} onGender={onGender} />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-5">
        {OUTFIT_CATEGORIES.map((category) => {
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
              {categoryIsWorn(selection, category) ? (
                <span
                  aria-hidden="true"
                  className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[var(--site-accent-strong)]"
                />
              ) : null}
            </button>
          );
        })}
      </div>
      <OutfitPieceGrid
        copy={copy}
        selection={selection}
        category={activeCategory}
        onToggle={onToggle}
      />
    </section>
  );
}

function genderButtonLabel(copy: OutfitCreatorCopy, gender: OutfitGender): string {
  if (gender === 'male') {
    return copy.genderMale;
  }

  if (gender === 'female') {
    return copy.genderFemale;
  }

  throw new Error(`Unknown outfit gender. Received ${JSON.stringify(gender)}.`);
}

function OutfitGenderPicker({
  copy,
  gender,
  onGender,
}: {
  copy: OutfitCreatorCopy;
  gender: OutfitGender;
  onGender: (gender: OutfitGender) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {(['male', 'female'] as const).map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={gender === option}
          aria-label={genderButtonLabel(copy, option)}
          className={cn(
            'w-full rounded-md border px-3 py-2 text-center text-sm',
            choiceButtonClass(gender === option),
          )}
          onClick={() => onGender(option)}
        >
          {genderButtonLabel(copy, option)}
        </button>
      ))}
    </div>
  );
}

function outfitSlotLabels(copy: OutfitCreatorCopy): readonly [string, string, string, string] {
  return [copy.outfitSlot(1), copy.outfitSlot(2), copy.outfitSlot(3), copy.outfitSlot(4)];
}

function OutfitPreview({
  copy,
  canvasRef,
  failureMessage,
  activeOutfitSlot,
  previewTransition,
  onSelectOutfitSlot,
  onPreviewTransitionEnd,
  onClear,
  onDownload,
}: OutfitPreviewProps) {
  return (
    <section className="order-1 w-full lg:order-2 lg:w-[480px] lg:shrink-0">
      <style>{`
        @keyframes outfit-creator-outfit-slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        @keyframes outfit-creator-outfit-slide-out {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }

        .outfit-creator-outfit-slide-in {
          animation: outfit-creator-outfit-slide-in 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .outfit-creator-outfit-slide-out {
          animation: outfit-creator-outfit-slide-out 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .outfit-creator-outfit-slide-in,
          .outfit-creator-outfit-slide-out {
            animation-duration: 1ms;
          }
        }
      `}</style>
      <h2 className="font-display text-xl text-[var(--site-accent-strong)]">{copy.preview}</h2>
      <div className={cn('mt-3 rounded-2xl p-3', OUTFIT_LINE_ART_SURFACE_CLASS)}>
        <div className="relative overflow-hidden">
          <canvas
            ref={canvasRef}
            width={OUTFIT_PREVIEW_WIDTH}
            height={OUTFIT_PREVIEW_HEIGHT}
            aria-label={copy.preview}
            className={cn(
              'block h-auto w-full bg-[#fffaf4]',
              previewTransition?.ready ? 'outfit-creator-outfit-slide-in' : null,
            )}
          />
          {previewTransition !== null ? (
            // The data URL preserves the previous canvas while the live canvas paints the next outfit.
            // eslint-disable-next-line @next/next/no-img-element -- the transition snapshot is a local canvas data URL
            <img
              key={previewTransition.id}
              src={previewTransition.outgoingDataUrl}
              alt=""
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute inset-0 h-full w-full object-fill',
                previewTransition.ready ? 'outfit-creator-outfit-slide-out' : null,
              )}
              onAnimationEnd={() => onPreviewTransitionEnd(previewTransition.id)}
            />
          ) : null}
        </div>
      </div>
      <div className="mt-3">
        <OutfitPreviewOutfitSlots
          labels={outfitSlotLabels(copy)}
          activeOutfitSlot={activeOutfitSlot}
          onSelect={onSelectOutfitSlot}
        />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          className={cn(
            'w-full rounded-md border px-3 py-2 text-sm',
            choiceButtonClass(false),
          )}
          onClick={onClear}
        >
          {copy.clearEquipment}
        </button>
        <button
          type="button"
          className={cn(
            'w-full rounded-md border px-3 py-2 text-sm',
            choiceButtonClass(false),
          )}
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
  slotNumber: OutfitSaveSlotNumber,
): number {
  const nextGeneration = generations[slotNumber] + 1;
  generations[slotNumber] = nextGeneration;
  return nextGeneration;
}

function outfitWriteGenerationIsCurrent(
  generations: OutfitWriteGenerations,
  slotNumber: OutfitSaveSlotNumber,
  generation: number,
): boolean {
  return generations[slotNumber] === generation;
}

function createOutfitExportCanvas(): HTMLCanvasElement {
  if (typeof document.createElement !== 'function') {
    throw new Error(
      `Outfit export requires document.createElement. Received typeof ${typeof document.createElement}.`,
    );
  }

  const canvas = document.createElement('canvas');
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error(
      `Outfit export canvas must be an HTMLCanvasElement. Received ${Object.prototype.toString.call(canvas)}.`,
    );
  }

  canvas.width = OUTFIT_PREVIEW_WIDTH;
  canvas.height = OUTFIT_PREVIEW_HEIGHT;
  if (canvas.width !== OUTFIT_PREVIEW_WIDTH || canvas.height !== OUTFIT_PREVIEW_HEIGHT) {
    throw new Error(
      `Outfit export canvas must be ${String(OUTFIT_PREVIEW_WIDTH)}x${String(OUTFIT_PREVIEW_HEIGHT)}. Received ${String(canvas.width)}x${String(canvas.height)}.`,
    );
  }

  if (canvas.isConnected) {
    throw new Error(
      `Outfit export canvas must be independent from the preview. Received a connected canvas ${String(canvas.width)}x${String(canvas.height)}.`,
    );
  }

  return canvas;
}

function requireCanvasContext2d(canvas: HTMLCanvasElement, action: string): CanvasRenderingContext2D {
  const context = canvas.getContext('2d');
  if (context === null) {
    throw new Error(`Outfit ${action} canvas has no 2d context. Received null.`);
  }

  return context;
}

async function paintSelectionForExport(selection: OutfitSelection): Promise<HTMLCanvasElement> {
  const canvas = createOutfitExportCanvas();
  const context = requireCanvasContext2d(canvas, 'export');
  await drawOutfitLayers(context, selection);
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
      `Outfit save thumbnail requires FileReader. Received typeof ${typeof FileReader}.`,
    );
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string' || !result.startsWith('data:image/png;base64,')) {
        const received = typeof result === 'string' ? JSON.stringify(result.slice(0, 32)) : String(result);
        reject(new Error(`Outfit save thumbnail must be a PNG data URL. Received ${received}.`));
        return;
      }

      resolve(result);
    };
    reader.onerror = () => {
      reject(
        new Error(
          `Outfit save thumbnail could not be read from the preview blob. Received ${describeFileReaderError(reader.error)}.`,
        ),
      );
    };
    reader.readAsDataURL(blob);
  });
}

async function readOutfitThumbnailDataUrl(
  selection: OutfitSelection,
  outfitWriteIsLatest: () => boolean,
): Promise<string | null> {
  const canvas = await paintSelectionForExport(selection);
  if (!outfitWriteIsLatest()) {
    return null;
  }

  const blob = await canvasToOutfitPng(canvas);
  if (!outfitWriteIsLatest()) {
    return null;
  }

  const thumbnailDataUrl = await readBlobPngDataUrl(blob);
  if (!outfitWriteIsLatest()) {
    return null;
  }

  return thumbnailDataUrl;
}

function writeLatestOutfitSave(input: OutfitSelectionWrite, thumbnailDataUrl: string): void {
  if (!input.outfitWriteIsLatest()) {
    return;
  }

  writeOutfitSaveSlot(input.storage, input.slotNumber, {
    snapshot: input.selection,
    thumbnailDataUrl,
  });
}

async function writeOutfitSelection(input: OutfitSelectionWrite): Promise<void> {
  const thumbnailDataUrl = await readOutfitThumbnailDataUrl(
    input.selection,
    input.outfitWriteIsLatest,
  );
  if (thumbnailDataUrl === null) {
    return;
  }

  writeLatestOutfitSave(input, thumbnailDataUrl);
}

function requireDownloadUrlFunction(
  urlFunction: unknown,
  functionName: 'createObjectURL' | 'revokeObjectURL',
): void {
  if (typeof urlFunction !== 'function') {
    throw new Error(
      `Outfit download requires URL.${functionName}. Received typeof ${typeof urlFunction}.`,
    );
  }
}

async function downloadOutfitPreview(canvas: HTMLCanvasElement): Promise<void> {
  const blob = await canvasToOutfitPng(canvas);
  const urlApi = globalThis.URL;
  requireDownloadUrlFunction(urlApi.createObjectURL, 'createObjectURL');
  requireDownloadUrlFunction(urlApi.revokeObjectURL, 'revokeObjectURL');

  const objectUrl = urlApi.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = 'outfit.png';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  urlApi.revokeObjectURL(objectUrl);
}

async function downloadOutfitSelection(selection: OutfitSelection): Promise<void> {
  const canvas = await paintSelectionForExport(selection);
  await downloadOutfitPreview(canvas);
}

function readOutfitPreviewDataUrl(canvas: HTMLCanvasElement): string {
  if (typeof canvas.toDataURL !== 'function') {
    throw new Error(
      `Outfit preview transition requires canvas.toDataURL. Received typeof ${typeof canvas.toDataURL}.`,
    );
  }

  const dataUrl = canvas.toDataURL('image/png');
  if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
    throw new Error(
      `Outfit preview transition requires an image data URL. Received ${describeReceivedValue(dataUrl)}.`,
    );
  }

  return dataUrl;
}

export function OutfitCreatorWorkbench({ locale }: { locale: SiteLocale }) {
  const copy = getOutfitCreatorCopy(locale);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeOutfitSlotRef = useRef<OutfitSaveSlotNumber | null>(null);
  const outfitWriteGenerationsRef = useRef(createOutfitWriteGenerations());
  const previewTransitionIntentRef = useRef<OutfitSlotTransitionIntent | null>(null);
  const hasPaintedPreviewRef = useRef(false);
  const previewTransitionIdRef = useRef(0);
  const [selection, setSelection] = useState<OutfitSelection>(createInitialOutfitSelection);
  const [activeCategory, setActiveCategory] = useState<OutfitCategory>(OUTFIT_CATEGORIES[0]);
  const [activeOutfitSlot, setActiveOutfitSlot] = useState<OutfitSaveSlotNumber | null>(null);
  const [failureMessage, setFailureMessage] = useState<string | null>(null);
  const [previewTransition, setPreviewTransition] = useState<OutfitPreviewTransition | null>(null);

  function finishPreviewTransition(transitionId: number): void {
    setPreviewTransition((currentTransition) =>
      currentTransition?.id === transitionId ? null : currentTransition,
    );
  }

  useEffect(() => {
    let ignore = false;

    const transitionId = previewTransitionIdRef.current + 1;
    previewTransitionIdRef.current = transitionId;

    async function renderPreview(): Promise<void> {
      const canvas = canvasRef.current;
      if (canvas === null) {
        throw new Error('Outfit preview canvas is missing. Received null.');
      }

      const context = canvas.getContext('2d');
      if (context === null) {
        throw new Error('Outfit preview canvas has no 2d context. Received null.');
      }

      await drawOutfitLayers(context, selection, () => !ignore);
    }

    const transitionIntent = previewTransitionIntentRef.current;
    previewTransitionIntentRef.current = null;
    const shouldAnimatePreview =
      transitionIntent !== null &&
      transitionIntent.fromSlot !== transitionIntent.toSlot &&
      hasPaintedPreviewRef.current;
    let outgoingDataUrl: string | null = null;
    let snapshotFailureMessage: string | null = null;

    if (shouldAnimatePreview) {
      try {
        const canvas = canvasRef.current;
        if (canvas === null) {
          throw new Error('Outfit preview canvas is missing while capturing the previous outfit. Received null.');
        }

        outgoingDataUrl = readOutfitPreviewDataUrl(canvas);
      } catch (failure: unknown) {
        snapshotFailureMessage = describeFailure(
          failure,
          copy.previewTransitionError,
        );
      }
    }

    if (outgoingDataUrl === null) {
      setPreviewTransition(null);
    } else {
      setPreviewTransition({
        id: transitionId,
        outgoingDataUrl,
        ready: false,
      });
    }

    hasPaintedPreviewRef.current = false;

    void renderPreview()
      .then(() => {
        if (ignore) {
          return;
        }

        hasPaintedPreviewRef.current = true;
        setFailureMessage(snapshotFailureMessage);

        if (outgoingDataUrl === null) {
          return;
        }

        setPreviewTransition((currentTransition) =>
          currentTransition?.id === transitionId
            ? { ...currentTransition, ready: true }
            : currentTransition,
        );
      })
      .catch((failure: unknown) => {
        if (!ignore) {
          hasPaintedPreviewRef.current = false;
          setPreviewTransition(null);
          setFailureMessage(describeFailure(failure, copy.previewLoadError));
        }
      });

    return () => {
      ignore = true;
    };
  }, [copy.previewLoadError, copy.previewTransitionError, selection]);

  useEffect(() => {
    if (previewTransition === null || !previewTransition.ready) {
      return;
    }

    const transitionId = previewTransition.id;
    const cleanupTimer = window.setTimeout(() => {
      finishPreviewTransition(transitionId);
    }, OUTFIT_PREVIEW_TRANSITION_CLEANUP_DELAY_MS);

    return () => {
      window.clearTimeout(cleanupTimer);
    };
  }, [previewTransition]);

  function reportFailure(failure: unknown, fallback: string): void {
    setFailureMessage(describeFailure(failure, fallback));
  }

  function startOutfitWrite(
    storage: OutfitSaveStorage,
    slotNumber: OutfitSaveSlotNumber,
    selectionAtClick: OutfitSelection,
  ): void {
    const generation = nextOutfitWriteGeneration(outfitWriteGenerationsRef.current, slotNumber);
    const outfitWriteIsLatest = () =>
      outfitWriteGenerationIsCurrent(outfitWriteGenerationsRef.current, slotNumber, generation);
    void writeOutfitSelection({
      storage,
      slotNumber,
      selection: selectionAtClick,
      outfitWriteIsLatest,
    }).catch((failure: unknown) => {
      if (outfitWriteIsLatest()) {
        reportFailure(failure, 'Outfit selection could not be saved.');
      }
    });
  }

  function commitSelection(nextSelection: OutfitSelection): void {
    previewTransitionIntentRef.current = null;

    if (outfitSelectionsEqual(selection, nextSelection)) {
      return;
    }

    setSelection(nextSelection);

    const slotNumber = activeOutfitSlotForAutosave(activeOutfitSlotRef.current);
    if (slotNumber === null) {
      return;
    }

    try {
      const storage = requireBrowserSaveStorage();
      startOutfitWrite(storage, slotNumber, nextSelection);
    } catch (failure: unknown) {
      reportFailure(failure, 'Outfit selection could not be saved.');
    }
  }

  function selectOutfitSlot(slotNumber: OutfitSaveSlotNumber): void {
    if (activeOutfitSlotRef.current === slotNumber) {
      previewTransitionIntentRef.current = null;
      return;
    }

    try {
      const previousActiveOutfitSlot = activeOutfitSlotRef.current;
      const storage = requireBrowserSaveStorage();
      nextOutfitWriteGeneration(outfitWriteGenerationsRef.current, slotNumber);
      const storedRecord = readOutfitSaveSlot(storage, slotNumber);
      const loadedOutfit = selectionForOutfitSlot(
        slotNumber,
        storedRecord === null ? null : storedRecord.snapshot,
      );
      activeOutfitSlotRef.current = loadedOutfit.activeOutfitSlot;
      previewTransitionIntentRef.current =
        previousActiveOutfitSlot === null
          ? null
          : {
              fromSlot: previousActiveOutfitSlot,
              toSlot: loadedOutfit.activeOutfitSlot,
            };
      setActiveOutfitSlot(loadedOutfit.activeOutfitSlot);
      setSelection(loadedOutfit.selection);

      if (storedRecord === null) {
        startOutfitWrite(storage, loadedOutfit.activeOutfitSlot, loadedOutfit.selection);
      }
      setFailureMessage(null);
    } catch (failure: unknown) {
      reportFailure(failure, copy.saveLoadError);
    }
  }

  function handleDownload(): void {
    const selectionAtClick = selection;
    void downloadOutfitSelection(selectionAtClick)
      .then(() => {
        setFailureMessage(null);
      })
      .catch((failure: unknown) => {
        reportFailure(failure, 'Outfit image could not be downloaded.');
      });
  }

  return (
    <div className="space-y-6 rounded-2xl border border-[var(--site-border-strong)] bg-[var(--site-panel)] p-4 text-[var(--site-ink)] sm:p-6 lg:p-4">
      <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-start lg:gap-4">
        <div className="order-2 min-w-0 flex-1 lg:order-1">
          <OutfitPicker
            copy={copy}
            selection={selection}
            activeCategory={activeCategory}
            onGender={(gender) => commitSelection(setOutfitGender(selection, gender))}
            onCategory={setActiveCategory}
            onToggle={(pieceId) => commitSelection(toggleOutfitPiece(selection, pieceId))}
          />
        </div>
        <OutfitPreview
          copy={copy}
          canvasRef={canvasRef}
          failureMessage={failureMessage}
          activeOutfitSlot={activeOutfitSlot}
          previewTransition={previewTransition}
          onSelectOutfitSlot={selectOutfitSlot}
          onPreviewTransitionEnd={finishPreviewTransition}
          onClear={() => commitSelection(clearOutfitSelection(selection))}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
}
