import { saveAs } from 'file-saver';
import {
  trackDownloadPng,
  trackShareDialogOpen,
  trackShareDialogSuppressed,
} from '@/lib/analytics';
import { useEditorStore } from '@/lib/store/editor-store';
import { useShareDialogStore } from '@/lib/store/share-dialog-store';
import { BORDER_TEMPLATES } from '@/lib/templates/borders';
import { exportTokenAsPNG } from '@/lib/renderer/pipeline';
import { createShareSocialImageBlob } from '@/lib/share/social-image';
import { SHARE_DIALOG_TOKEN_PREVIEW_SIZE, SHARE_SOCIAL_IMAGE_WIDTH } from '@/lib/share/constants';
import type { I18nKey } from '@/lib/i18n';
import type { BorderTemplate } from '@/types/editor';
import type { SiteLocale } from '@/lib/site-locale';
import { shouldShowShareDialog } from '@/lib/share/local-frequency';

export function getLocalizedName(name: string, t: (key: I18nKey) => string) {
  return name.includes('.') ? t(name as I18nKey) : name;
}

function getSelectedFrameName(
  borderId: string,
  customBorders: BorderTemplate[],
  t: (key: I18nKey) => string
) {
  const selectedBorder =
    BORDER_TEMPLATES.find((border) => border.id === borderId) ??
    customBorders.find((border) => border.id === borderId);

  if (!selectedBorder) {
    return borderId;
  }

  return getLocalizedName(selectedBorder.name, t);
}

function saveTokenPng(
  blob: Blob,
  fileName: string,
  state: ReturnType<typeof useEditorStore.getState>,
  t: (key: I18nKey) => string
) {
  saveAs(blob, fileName);
  trackDownloadPng(getSelectedFrameName(state.selectedBorderId, state.customBorders, t));
}

async function createShareSocialImageBlobSafely(state: ReturnType<typeof useEditorStore.getState>) {
  try {
    return await createShareSocialImageBlob(state);
  } catch (error) {
    console.warn('Failed to create social share image.', error);
    return null;
  }
}

async function createShareDialogPreviewBlobSafely(
  state: ReturnType<typeof useEditorStore.getState>,
  downloadBlob: Blob
) {
  if (state.exportSize >= SHARE_DIALOG_TOKEN_PREVIEW_SIZE) {
    return downloadBlob;
  }

  try {
    return (await exportTokenAsPNG(state, SHARE_DIALOG_TOKEN_PREVIEW_SIZE)) ?? downloadBlob;
  } catch (error) {
    console.warn('Failed to create high resolution share dialog preview.', error);
    return downloadBlob;
  }
}

export async function downloadCurrentToken(t: (key: I18nKey) => string) {
  const state = useEditorStore.getState();
  const blob = await exportTokenAsPNG(state, state.exportSize);

  if (blob) {
    saveTokenPng(blob, `token_${Date.now()}.png`, state, t);
  }
}

export async function downloadCurrentTokenWithSharePrompt(
  t: (key: I18nKey) => string,
  locale: SiteLocale
) {
  const state = useEditorStore.getState();
  const blob = await exportTokenAsPNG(state, state.exportSize);

  if (!blob) return;

  const fileName = `token_${Date.now()}.png`;

  if (!shouldShowShareDialog()) {
    saveTokenPng(blob, fileName, state, t);
    trackShareDialogSuppressed(state.exportSize);
    return;
  }

  const shareBlob = await createShareSocialImageBlobSafely(state);
  const previewBlob = await createShareDialogPreviewBlobSafely(state, blob);

  trackShareDialogOpen(state.exportSize);
  useShareDialogStore.getState().openShareDialog({
    blob,
    previewBlob,
    shareBlob: shareBlob ?? blob,
    shareImageWidth: shareBlob ? SHARE_SOCIAL_IMAGE_WIDTH : state.exportSize,
    fileName,
    exportSize: state.exportSize,
    locale,
  });
}
