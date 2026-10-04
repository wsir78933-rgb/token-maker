const MAX_BACKGROUND_IMAGE_FILE_SIZE_BYTES = 20 * 1024 * 1024;
const SUPPORTED_BACKGROUND_IMAGE_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const SUPPORTED_BACKGROUND_IMAGE_FILE_NAME = /\.(png|jpe?g|webp)$/i;

export const ARMY_BACKGROUND_IMAGE_MAX_DIMENSION_PX = 2048;
export const ARMY_BACKGROUND_IMAGE_WEBP_QUALITY = 0.92;

export type ArmyBackgroundImageUploadFailureReason =
  | 'unsupported-format'
  | 'file-too-large'
  | 'empty-file'
  | 'decode-failed'
  | 'compression-failed';

export type ArmyBackgroundImageUploadResult =
  | { status: 'compressed'; dataUrl: string }
  | {
      status: 'rejected';
      reason: ArmyBackgroundImageUploadFailureReason;
      received: string;
    };

type ArmyBackgroundImageUploadRejection = Extract<
  ArmyBackgroundImageUploadResult,
  { status: 'rejected' }
>;

type ArmyBackgroundImageDecodeResult =
  | { imageBitmap: ImageBitmap }
  | { failure: ArmyBackgroundImageUploadRejection };

type ArmyBackgroundImageOutputDimensions =
  | { widthPx: number; heightPx: number }
  | ArmyBackgroundImageUploadRejection;

function rejectArmyBackgroundImageUpload(
  reason: ArmyBackgroundImageUploadFailureReason,
  received: string,
): ArmyBackgroundImageUploadRejection {
  return { status: 'rejected', reason, received };
}

function describeArmyBackgroundImageFailure(failure: unknown): string {
  if (failure instanceof Error) {
    return `${failure.name}: ${failure.message}`;
  }

  return String(failure);
}

function isSupportedArmyBackgroundImage(file: File): boolean {
  if (file.type.length > 0) {
    return SUPPORTED_BACKGROUND_IMAGE_MIME_TYPES.includes(file.type);
  }

  return SUPPORTED_BACKGROUND_IMAGE_FILE_NAME.test(file.name);
}

function validateArmyBackgroundImageUploadRequest(
  file: File,
  maxWidthPx: number,
  maxHeightPx: number,
): void {
  if (typeof File === 'undefined' || !(file instanceof File)) {
    throw new Error(`Background image upload requires a File, received ${String(file)}.`);
  }

  if (!Number.isFinite(maxWidthPx) || maxWidthPx <= 0) {
    throw new Error(`Background image maximum width must be positive, received ${String(maxWidthPx)}.`);
  }

  if (!Number.isFinite(maxHeightPx) || maxHeightPx <= 0) {
    throw new Error(`Background image maximum height must be positive, received ${String(maxHeightPx)}.`);
  }
}

function getArmyBackgroundImageFileRejection(file: File): ArmyBackgroundImageUploadRejection | null {
  if (!isSupportedArmyBackgroundImage(file)) {
    return rejectArmyBackgroundImageUpload(
      'unsupported-format',
      file.type.length > 0 ? file.type : file.name,
    );
  }

  if (file.size === 0) {
    return rejectArmyBackgroundImageUpload('empty-file', `${file.name} (${file.size} bytes)`);
  }

  if (file.size > MAX_BACKGROUND_IMAGE_FILE_SIZE_BYTES) {
    return rejectArmyBackgroundImageUpload('file-too-large', `${file.size} bytes`);
  }

  return null;
}

function getArmyBackgroundImageBitmapApi(): typeof createImageBitmap {
  const createImageBitmapApi: unknown = globalThis.createImageBitmap;
  if (typeof createImageBitmapApi !== 'function') {
    throw new Error(
      `Background image decoding requires createImageBitmap to be a function, received ${String(createImageBitmapApi)}.`,
    );
  }

  return createImageBitmapApi as typeof createImageBitmap;
}

function createArmyBackgroundImageCanvas(): HTMLCanvasElement {
  if (typeof document === 'undefined' || typeof document.createElement !== 'function') {
    const received = typeof document === 'undefined' ? 'undefined' : String(document.createElement);
    throw new Error(
      `Background image compression requires document.createElement to be a function, received ${received}.`,
    );
  }

  const canvas = document.createElement('canvas');
  if (typeof canvas.getContext !== 'function') {
    throw new Error(
      `Background image compression requires canvas.getContext to be a function, received ${String(canvas.getContext)}.`,
    );
  }
  if (typeof canvas.toDataURL !== 'function') {
    throw new Error(
      `Background image compression requires canvas.toDataURL to be a function, received ${String(canvas.toDataURL)}.`,
    );
  }

  return canvas;
}

async function decodeArmyBackgroundImage(file: File): Promise<ArmyBackgroundImageDecodeResult> {
  let decodedImageBitmap: unknown;
  try {
    decodedImageBitmap = await getArmyBackgroundImageBitmapApi()(file);
  } catch (failure: unknown) {
    return {
      failure: rejectArmyBackgroundImageUpload(
        'decode-failed',
        `${file.name} (${describeArmyBackgroundImageFailure(failure)})`,
      ),
    };
  }

  if (typeof decodedImageBitmap !== 'object' || decodedImageBitmap === null) {
    return {
      failure: rejectArmyBackgroundImageUpload(
        'decode-failed',
        `${file.name} (createImageBitmap returned ${String(decodedImageBitmap)})`,
      ),
    };
  }

  const imageBitmap = decodedImageBitmap as ImageBitmap;
  if (typeof imageBitmap.close !== 'function') {
    return {
      failure: rejectArmyBackgroundImageUpload(
        'decode-failed',
        `${file.name} (ImageBitmap.close must be a function, received ${String(imageBitmap.close)})`,
      ),
    };
  }

  return { imageBitmap };
}

function getArmyBackgroundImageOutputDimensions(
  file: File,
  imageBitmap: ImageBitmap,
  maxWidthPx: number,
  maxHeightPx: number,
): ArmyBackgroundImageOutputDimensions {
  const imageWidthPx = imageBitmap.width;
  const imageHeightPx = imageBitmap.height;
  if (
    !Number.isFinite(imageWidthPx) ||
    imageWidthPx <= 0 ||
    !Number.isFinite(imageHeightPx) ||
    imageHeightPx <= 0
  ) {
    return rejectArmyBackgroundImageUpload(
      'decode-failed',
      `${file.name} (${imageWidthPx}×${imageHeightPx} px)`,
    );
  }

  const boundedMaxWidthPx = Math.min(maxWidthPx, ARMY_BACKGROUND_IMAGE_MAX_DIMENSION_PX);
  const boundedMaxHeightPx = Math.min(maxHeightPx, ARMY_BACKGROUND_IMAGE_MAX_DIMENSION_PX);
  const scale = Math.min(
    1,
    boundedMaxWidthPx / imageWidthPx,
    boundedMaxHeightPx / imageHeightPx,
  );

  return {
    widthPx: Math.max(1, Math.round(imageWidthPx * scale)),
    heightPx: Math.max(1, Math.round(imageHeightPx * scale)),
  };
}

function encodeArmyBackgroundImage(
  file: File,
  imageBitmap: ImageBitmap,
  outputWidthPx: number,
  outputHeightPx: number,
): ArmyBackgroundImageUploadResult {
  const canvas = createArmyBackgroundImageCanvas();
  canvas.width = outputWidthPx;
  canvas.height = outputHeightPx;

  const canvasContext = canvas.getContext('2d');
  if (canvasContext === null || canvasContext === undefined) {
    return rejectArmyBackgroundImageUpload(
      'compression-failed',
      `${file.name} (2D canvas unavailable, received ${String(canvasContext)})`,
    );
  }

  canvasContext.drawImage(imageBitmap, 0, 0, outputWidthPx, outputHeightPx);
  const compressedDataUrl = canvas.toDataURL('image/webp', ARMY_BACKGROUND_IMAGE_WEBP_QUALITY);
  if (typeof compressedDataUrl !== 'string') {
    return rejectArmyBackgroundImageUpload(
      'compression-failed',
      `${file.name} (canvas.toDataURL returned ${String(compressedDataUrl)})`,
    );
  }
  if (!compressedDataUrl.startsWith('data:image/webp;')) {
    return rejectArmyBackgroundImageUpload(
      'compression-failed',
      `${file.name} (browser returned ${compressedDataUrl.slice(0, 32)})`,
    );
  }

  return { status: 'compressed', dataUrl: compressedDataUrl };
}

function compressDecodedArmyBackgroundImage(
  file: File,
  imageBitmap: ImageBitmap,
  maxWidthPx: number,
  maxHeightPx: number,
): ArmyBackgroundImageUploadResult {
  try {
    const outputDimensions = getArmyBackgroundImageOutputDimensions(
      file,
      imageBitmap,
      maxWidthPx,
      maxHeightPx,
    );
    if ('status' in outputDimensions) {
      return outputDimensions;
    }

    return encodeArmyBackgroundImage(
      file,
      imageBitmap,
      outputDimensions.widthPx,
      outputDimensions.heightPx,
    );
  } catch (failure: unknown) {
    return rejectArmyBackgroundImageUpload(
      'compression-failed',
      `${file.name} (${describeArmyBackgroundImageFailure(failure)})`,
    );
  }
}

export async function compressArmyFormationBackgroundImage(
  file: File,
  maxWidthPx: number,
  maxHeightPx: number,
): Promise<ArmyBackgroundImageUploadResult> {
  validateArmyBackgroundImageUploadRequest(file, maxWidthPx, maxHeightPx);

  const fileRejection = getArmyBackgroundImageFileRejection(file);
  if (fileRejection !== null) {
    return fileRejection;
  }

  const decodeResult = await decodeArmyBackgroundImage(file);
  if ('failure' in decodeResult) {
    return decodeResult.failure;
  }

  const imageBitmap = decodeResult.imageBitmap;
  try {
    return compressDecodedArmyBackgroundImage(file, imageBitmap, maxWidthPx, maxHeightPx);
  } finally {
    imageBitmap.close();
  }
}
