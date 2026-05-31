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

export async function downloadCurrentToken(t: (key: I18nKey) => string) {
  const state = useEditorStore.getState();
  const blob = await exportTokenAsPNG(state, state.exportSize);

  if (blob) {
    saveAs(blob, `token_${Date.now()}.png`);
    trackDownloadPng(getSelectedFrameName(state.selectedBorderId, state.customBorders, t));
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
  saveAs(blob, fileName);
  trackDownloadPng(getSelectedFrameName(state.selectedBorderId, state.customBorders, t));

  if (!shouldShowShareDialog()) {
    trackShareDialogSuppressed(state.exportSize);
    return;
  }

  trackShareDialogOpen(state.exportSize);
  useShareDialogStore.getState().openShareDialog({
    blob,
    fileName,
    exportSize: state.exportSize,
    locale,
  });
}
