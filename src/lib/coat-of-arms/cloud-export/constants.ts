export const COAT_EXPORT_OBJECT_PREFIX = 'coats';
export const COAT_EXPORT_ID_LENGTH = 10;
export const COAT_EXPORT_MAX_FILE_BYTES = 5 * 1024 * 1024;
export const COAT_EXPORT_MAX_REQUEST_BODY_BYTES = 8 * 1024 * 1024;
export const COAT_EXPORT_CACHE_CONTROL = 'public, max-age=2592000, immutable';
export const COAT_EXPORT_LONGEST_EDGES = [256, 512, 1024, 2048] as const;

export type CoatCloudExportFileType = 'png' | 'jpeg' | 'pdf';
export type CoatExportLongestEdge = (typeof COAT_EXPORT_LONGEST_EDGES)[number];

export function assertCoatCloudExportFileType(
  value: unknown
): asserts value is CoatCloudExportFileType {
  if (value !== 'png' && value !== 'jpeg' && value !== 'pdf') {
    throw new Error(`Invalid coat cloud export file type: "${String(value)}"`);
  }
}

export function isCoatExportLongestEdge(value: unknown): value is CoatExportLongestEdge {
  return (
    typeof value === 'number' &&
    COAT_EXPORT_LONGEST_EDGES.includes(value as CoatExportLongestEdge)
  );
}

export function getCoatExportObjectExtension(
  fileType: CoatCloudExportFileType
): 'png' | 'jpg' | 'pdf' {
  assertCoatCloudExportFileType(fileType);
  if (fileType === 'jpeg') {
    return 'jpg';
  }
  return fileType;
}

export function getCoatExportObjectKey(
  id: string,
  fileType: CoatCloudExportFileType
): string {
  if (typeof id !== 'string' || id.trim().length !== COAT_EXPORT_ID_LENGTH) {
    throw new Error(`Invalid coat export id: "${String(id)}"`);
  }
  const trimmedId = id.trim();
  const extension = getCoatExportObjectExtension(fileType);
  return `${COAT_EXPORT_OBJECT_PREFIX}/${trimmedId}.${extension}`;
}

export function getCoatExportContentType(
  fileType: CoatCloudExportFileType
): 'image/png' | 'image/jpeg' | 'application/pdf' {
  assertCoatCloudExportFileType(fileType);
  if (fileType === 'png') {
    return 'image/png';
  }
  if (fileType === 'jpeg') {
    return 'image/jpeg';
  }
  return 'application/pdf';
}
