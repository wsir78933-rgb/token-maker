export const MAX_MOBILE_PREVIEW_BACKING_SIZE = 1024;

export function getPreviewBackingSize(
  previewCssSize: number,
  devicePixelRatio: number,
  isMobileEditorLayout: boolean,
) {
  const requestedSize = Math.round(previewCssSize * devicePixelRatio);

  return isMobileEditorLayout
    ? Math.min(requestedSize, MAX_MOBILE_PREVIEW_BACKING_SIZE)
    : requestedSize;
}
