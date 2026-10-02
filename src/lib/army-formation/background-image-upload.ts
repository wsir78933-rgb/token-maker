const MAX_BACKGROUND_IMAGE_FILE_SIZE_BYTES = 20 * 1024 * 1024;
const SUPPORTED_BACKGROUND_IMAGE_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const SUPPORTED_BACKGROUND_IMAGE_FILE_NAME = /\.(png|jpe?g|webp)$/i;

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

function rejectArmyBackgroundImageUpload(
  reason: ArmyBackgroundImageUploadFailureReason,
  received: string,
): ArmyBackgroundImageUploadResult {
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

export async function compressArmyFormationBackgroundImage(
  file: File,
  maxWidthPx: number,
  maxHeightPx: number,
): Promise<ArmyBackgroundImageUploadResult> {
  if (typeof File === 'undefined' || !(file instanceof File)) {
    throw new Error(`Background image upload requires a File, received ${String(file)}.`);
  }

  if (!Number.isFinite(maxWidthPx) || maxWidthPx <= 0) {
    throw new Error(`Background image maximum width must be positive, received ${String(maxWidthPx)}.`);
  }

  if (!Number.isFinite(maxHeightPx) || maxHeightPx <= 0) {
    throw new Error(`Background image maximum height must be positive, received ${String(maxHeightPx)}.`);
  }

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

  let imageBitmap: ImageBitmap;
  try {
    imageBitmap = await createImageBitmap(file);
  } catch (failure: unknown) {
    return rejectArmyBackgroundImageUpload(
      'decode-failed',
      `${file.name} (${describeArmyBackgroundImageFailure(failure)})`,
    );
  }

  try {
    if (imageBitmap.width <= 0 || imageBitmap.height <= 0) {
      return rejectArmyBackgroundImageUpload(
        'decode-failed',
        `${file.name} (${imageBitmap.width}×${imageBitmap.height} px)`,
      );
    }

    const scale = Math.min(1, maxWidthPx / imageBitmap.width, maxHeightPx / imageBitmap.height);
    const outputWidthPx = Math.max(1, Math.round(imageBitmap.width * scale));
    const outputHeightPx = Math.max(1, Math.round(imageBitmap.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = outputWidthPx;
    canvas.height = outputHeightPx;

    const canvasContext = canvas.getContext('2d');
    if (canvasContext === null) {
      return rejectArmyBackgroundImageUpload('compression-failed', `${file.name} (2D canvas unavailable)`);
    }

    canvasContext.drawImage(imageBitmap, 0, 0, outputWidthPx, outputHeightPx);
    const compressedDataUrl = canvas.toDataURL('image/webp', 0.86);
    if (!compressedDataUrl.startsWith('data:image/webp;')) {
      return rejectArmyBackgroundImageUpload(
        'compression-failed',
        `${file.name} (browser returned ${compressedDataUrl.slice(0, 32)})`,
      );
    }

    return { status: 'compressed', dataUrl: compressedDataUrl };
  } catch (failure: unknown) {
    return rejectArmyBackgroundImageUpload(
      'compression-failed',
      `${file.name} (${describeArmyBackgroundImageFailure(failure)})`,
    );
  } finally {
    imageBitmap.close();
  }
}
