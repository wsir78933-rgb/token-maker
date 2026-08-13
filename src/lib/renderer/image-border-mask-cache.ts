interface CanvasCacheEntry {
  readonly byteCount: number;
  readonly canvas: HTMLCanvasElement;
}

/** Retains canvases by recency without exceeding the caller-provided byte budget. */
export class CanvasByteBudgetLruCache {
  private readonly entries = new Map<string, CanvasCacheEntry>();
  private retainedByteCount = 0;

  constructor(private readonly byteBudget: number) {
    if (!Number.isSafeInteger(byteBudget) || byteBudget < 0) {
      throw new Error(`Invalid canvas cache byte budget: ${String(byteBudget)}`);
    }
  }

  get(cacheKey: string): HTMLCanvasElement | undefined {
    const entry = this.entries.get(cacheKey);
    if (!entry) return undefined;

    this.entries.delete(cacheKey);
    this.entries.set(cacheKey, entry);
    return entry.canvas;
  }

  set(cacheKey: string, canvas: HTMLCanvasElement): void {
    const canvasByteCount = getCanvasByteCount(canvas);
    const replacedEntry = this.entries.get(cacheKey);
    if (replacedEntry) {
      this.entries.delete(cacheKey);
      this.retainedByteCount -= replacedEntry.byteCount;
      if (replacedEntry.canvas !== canvas) releaseCanvasBackingStore(replacedEntry.canvas);
    }

    if (canvasByteCount > this.byteBudget) return;

    while (this.retainedByteCount + canvasByteCount > this.byteBudget) {
      const oldestEntry = this.entries.entries().next().value;
      if (!oldestEntry) break;

      const [oldestKey, { byteCount, canvas: oldestCanvas }] = oldestEntry;
      this.entries.delete(oldestKey);
      this.retainedByteCount -= byteCount;
      releaseCanvasBackingStore(oldestCanvas);
    }

    this.entries.set(cacheKey, { byteCount: canvasByteCount, canvas });
    this.retainedByteCount += canvasByteCount;
  }
}

function getCanvasByteCount(canvas: HTMLCanvasElement): number {
  const { width, height } = canvas;
  if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width < 0 || height < 0) {
    throw new Error(`Invalid canvas dimensions: ${width}x${height}`);
  }

  const byteCount = width * height * 4;
  if (!Number.isSafeInteger(byteCount)) {
    throw new Error(`Canvas byte count exceeds a safe integer: ${width}x${height}`);
  }
  return byteCount;
}

function releaseCanvasBackingStore(canvas: HTMLCanvasElement): void {
  canvas.width = 0;
  canvas.height = 0;
}
