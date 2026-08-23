'use client';

import { useState, type ChangeEvent } from 'react';
import { COAT_PROJECT_LIMITS } from '@/lib/coat-of-arms/commands';
import { createLocalCoatId } from '@/lib/coat-of-arms/id';
import { deleteLocalUploadBlobs, putLocalUploadBlob } from '@/lib/coat-of-arms/local-upload-blobs';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type { CoatLocale, LocalUpload, LocalUploadMimeType } from '@/lib/coat-of-arms/types';
import { usePanelCommandError } from './usePanelCommandError';
import { getCoatWorkbenchCopy } from './workbench-copy';

const acceptedMimeTypes: readonly LocalUploadMimeType[] = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
const filenamePatternByMimeType: Record<LocalUploadMimeType, RegExp> = {
  'image/png': /\.png$/i,
  'image/jpeg': /\.jpe?g$/i,
  'image/webp': /\.webp$/i,
  'image/svg+xml': /\.svg$/i,
};
const uploadDiagnosticMaxCharacters = 64;

function boundedUploadDiagnostic(rawValue: string): string {
  if (rawValue.length <= uploadDiagnosticMaxCharacters) return rawValue;
  return `${rawValue.slice(0, uploadDiagnosticMaxCharacters)}…`;
}

export interface ClientLocalUploadFile {
  name: string;
  type: string;
  size: number;
}

/** Validates filename, declared MIME type and byte size before reading client bytes. */
export function validateLocalUploadFile(file: ClientLocalUploadFile): asserts file is ClientLocalUploadFile & { type: LocalUploadMimeType } {
  if (!file.name || file.name !== file.name.trim() || /[\\/\u0000-\u001F]/.test(file.name)) {
    throw new Error(`Invalid upload filename: ${file.name}`);
  }
  if (!acceptedMimeTypes.includes(file.type as LocalUploadMimeType)) {
    throw new Error(`Unsupported upload MIME type: ${file.type}`);
  }
  const mimeType = file.type as LocalUploadMimeType;
  if (!filenamePatternByMimeType[mimeType].test(file.name)) {
    throw new Error(`Upload filename does not match MIME type: ${file.name}`);
  }
  if (!Number.isSafeInteger(file.size) || file.size <= 0 || file.size > COAT_PROJECT_LIMITS.maxLocalUploadBytes) {
    throw new Error(`Invalid upload file size: ${file.size}; fileName is ${file.name}; mimeType is ${file.type}`);
  }
}

export function extractStrictBase64(dataUrl: string, mimeType: LocalUploadMimeType): string {
  const prefix = `data:${mimeType};base64,`;
  if (!dataUrl.startsWith(prefix)) {
    throw new Error(`Invalid upload data URL for MIME type: ${mimeType}: ${boundedUploadDiagnostic(dataUrl)}`);
  }
  const base64 = dataUrl.slice(prefix.length);
  if (!base64 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(base64)) {
    throw new Error(`Invalid upload Base64 data: ${boundedUploadDiagnostic(base64)}`);
  }
  return base64;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`Unable to read upload file: ${file.name}`));
    reader.onload = () => {
      if (typeof reader.result !== 'string') reject(new Error(`Invalid upload reader result: ${file.name}`));
      else resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function createUploadId() {
  return createLocalCoatId();
}

function decodeBase64Bytes(base64: string): Uint8Array {
  const binary = globalThis.atob(base64);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function assertWellFormedSvg(base64: string): void {
  const svgText = new TextDecoder('utf-8', { fatal: true }).decode(decodeBase64Bytes(base64));
  const parsed = new DOMParser().parseFromString(svgText, 'image/svg+xml');
  if (parsed.querySelector('parsererror') || parsed.documentElement.localName.toLowerCase() !== 'svg') {
    throw new Error(`Invalid SVG XML document: ${boundedUploadDiagnostic(svgText)}`);
  }
  assertSafeLocalSvg(svgText);
}

function assertSafeLocalSvg(svgText: string): void {
  const normalizedSvg = svgText.replace(/^\uFEFF/, '').trimStart();
  if (!/^<svg(?:\s|>)/i.test(normalizedSvg)) {
    throw new Error('Invalid local SVG content: expected <svg document');
  }
  if (/<!DOCTYPE\b|<!ENTITY\b|\bENTITY\b/i.test(normalizedSvg)) {
    throw new Error('Unsafe local SVG content: declaration');
  }
  if (/&(?:#\d+|#x[0-9a-f]+|[a-z][a-z0-9]+);/i.test(normalizedSvg)) {
    throw new Error('Unsafe local SVG content: XML entity');
  }
  if (/<\/?(?:script|foreignObject|image|use|feImage|audio|video|iframe|object|embed)\b/i.test(normalizedSvg)) {
    throw new Error('Unsafe local SVG content: non-geometry element');
  }
  if (/\bon[a-z]+\s*=/i.test(normalizedSvg)) {
    throw new Error('Unsafe local SVG content: event handler attribute');
  }
  if (/\b(?:(?:xlink\s*:)?href|src)\s*=/i.test(normalizedSvg)) {
    throw new Error('Unsafe local SVG content: resource reference attribute');
  }
  if (/<style\b|\bstyle\s*=/i.test(normalizedSvg) || /url\s*\(/i.test(normalizedSvg) || /@import\b/i.test(normalizedSvg)) {
    throw new Error('Unsafe local SVG content: CSS dependency');
  }
  if (/\b(?:https?|file|javascript|data)\s*:|\/\//i.test(normalizedSvg.replace(/\bxmlns\s*=\s*(['"])[^'"]*\1/ig, ''))) {
    throw new Error('Unsafe local SVG content: external protocol');
  }
}

function decodeRasterDataUrl(dataUrl: string, mimeType: Exclude<LocalUploadMimeType, 'image/svg+xml'>): Promise<void> {
  const bytes = decodeBase64Bytes(extractStrictBase64(dataUrl, mimeType));
  const imageBlob = new Blob([Uint8Array.from(bytes)], { type: mimeType });
  const decodeFailureMessage = `Unable to decode local ${mimeType} image: ${boundedUploadDiagnostic(dataUrl)}`;
  if (typeof globalThis.createImageBitmap === 'function') {
    return globalThis.createImageBitmap(imageBlob)
      .then((bitmap) => { bitmap.close(); })
      .catch(() => { throw new Error(decodeFailureMessage); });
  }
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => reject(new Error(decodeFailureMessage));
    image.src = dataUrl;
  });
}

/** Ensures client bytes are parseable before the state validator is allowed to persist them. */
export async function validateLocalUploadDecodability(dataUrl: string, mimeType: LocalUploadMimeType): Promise<void> {
  const base64 = extractStrictBase64(dataUrl, mimeType);
  if (mimeType === 'image/svg+xml') {
    assertWellFormedSvg(base64);
    return;
  }
  await decodeRasterDataUrl(dataUrl, mimeType);
}

function rethrowWithUploadFileContext(
  fileName: string,
  mimeType: LocalUploadMimeType,
  fileSize: number,
  caught: unknown,
): never {
  const causeMessage = caught instanceof Error ? caught.message : String(caught);
  throw new Error(`Unable to decode upload ${fileName} (${mimeType}, ${fileSize} bytes): ${causeMessage}`);
}

export interface CreatedValidatedLocalUpload {
  upload: LocalUpload;
  originalFileBytes: number;
  storedFileBytes: number;
}

/** Reads one validated browser-local image into the project-safe upload format. */
export async function createValidatedLocalUpload(file: File): Promise<CreatedValidatedLocalUpload> {
  validateLocalUploadFile(file);
  const mimeType = file.type as LocalUploadMimeType;
  const originalFileBytes = file.size;
  const dataUrl = await readFileAsDataUrl(file);
  try {
    await validateLocalUploadDecodability(dataUrl, mimeType);
  } catch (caught) {
    rethrowWithUploadFileContext(file.name, mimeType, originalFileBytes, caught);
  }
  const uploadId = createUploadId();
  try {
    await putLocalUploadBlob({ uploadId, mimeType, fileName: file.name, blob: file });
  } catch (caught) {
    const causeMessage = caught instanceof Error ? caught.message : String(caught);
    throw new Error(
      `Unable to persist local upload ${uploadId}; fileName is ${file.name}; mimeType is ${mimeType}; byteLength is ${originalFileBytes}; ${causeMessage}`,
    );
  }
  return {
    upload: { id: uploadId, mimeType, encoding: 'indexed-db', byteLength: originalFileBytes },
    originalFileBytes,
    storedFileBytes: originalFileBytes,
  };
}

async function createValidatedLocalUploads(files: readonly File[]): Promise<CreatedValidatedLocalUpload[]> {
  const createdUploads: CreatedValidatedLocalUpload[] = [];
  try {
    for (const file of files) {
      try {
        createdUploads.push(await createValidatedLocalUpload(file));
      } catch (caught) {
        const causeMessage = caught instanceof Error ? caught.message : String(caught);
        throw new Error(`Unable to store local upload ${file.name}; ${causeMessage}`);
      }
    }
    return createdUploads;
  } catch (caught) {
    if (createdUploads.length > 0) {
      await deleteLocalUploadBlobs(createdUploads.map((created) => created.upload.id));
    }
    throw caught;
  }
}

function statusAfterLocalUploads(
  copy: ReturnType<typeof getCoatWorkbenchCopy>['panels'],
  files: readonly File[],
  createdUploads: readonly CreatedValidatedLocalUpload[],
): string {
  if (files.length !== createdUploads.length) {
    throw new Error(`Local upload status file count mismatch: ${files.length} files, ${createdUploads.length} uploads`);
  }
  if (createdUploads.length === 1) {
    return copy.localImageAdded(files[0]!.name);
  }
  return copy.localImagesAdded(createdUploads.length);
}

/** Validates a local image selection before adding all of its images in one project command. */
export function UploadPanel({ locale }: { locale: CoatLocale }) {
  const copy = getCoatWorkbenchCopy(locale).panels;
  const { error, reportError, run } = usePanelCommandError(locale);
  const uploads = useCoatProjectStore((state) => state.project.uploads);
  const [status, setStatus] = useState<string | null>(null);
  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length === 0) return;
    try {
      setStatus(null);
      const createdUploads = await createValidatedLocalUploads(files);
      if (!run({ type: 'add-local-upload-images', uploads: createdUploads.map((created) => created.upload) })) {
        await deleteLocalUploadBlobs(createdUploads.map((created) => created.upload.id));
        return;
      }
      setStatus(statusAfterLocalUploads(copy, files, createdUploads));
    } catch (caught) {
      reportError(caught);
    }
  };

  const addExistingUpload = (uploadId: string) => {
    if (run({ type: 'add-image-layer', uploadId })) {
      setStatus(null);
    }
  };

  const removeExistingUpload = (uploadId: string) => {
    if (run({ type: 'remove-local-upload', uploadId })) {
      setStatus(null);
    }
  };

  return (
    <section aria-label={copy.uploadImage}>
      <h2 style={{ marginBottom: 0 }}>{copy.uploadImage}</h2>
      <label className="coat-target-form-field">
        <span>{copy.uploadCrestImage}</span>
        <span className="coat-target-action-button coat-target-action-button--primary">
          {copy.uploadCrestImage}
          <input
            className="coat-custom-shield-upload-input"
            aria-label={copy.uploadCrestImage}
            type="file"
            multiple
            accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={onFileChange}
          />
        </span>
      </label>
      <p>{copy.uploadDescription}</p>
      {uploads.length > 0 ? (
        <section aria-label={copy.localUploads} className="coat-target-utility-output">
          <h3>{copy.localUploads}</h3>
          <ul aria-label={copy.localUploads}>
            {uploads.map((upload, index) => (
              <li key={upload.id} aria-label={copy.localUploadItem(index, upload.mimeType)}>
                <span>{copy.localUploadItem(index, upload.mimeType)}</span>
                <span className="coat-target-form-actions">
                  <button className="coat-target-action-button" type="button" aria-label={copy.addLocalImage(index)} onClick={() => addExistingUpload(upload.id)}>
                    {copy.addLocalImage(index)}
                  </button>
                  <button className="coat-target-action-button" type="button" aria-label={copy.removeLocalUpload(index)} onClick={() => removeExistingUpload(upload.id)}>
                    {copy.removeLocalUpload(index)}
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {error ? <p role="alert">{error}</p> : null}
      {status ? <p role="status">{status}</p> : null}
    </section>
  );
}
