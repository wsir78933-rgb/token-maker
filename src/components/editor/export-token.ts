import { saveAs } from 'file-saver';
import { trackDownloadPng } from '@/lib/analytics';
import { useEditorStore } from '@/lib/store/editor-store';
import { BORDER_TEMPLATES } from '@/lib/templates/borders';
import { exportTokenAsPNG } from '@/lib/renderer/pipeline';
import type { I18nKey } from '@/lib/i18n';
import type { BorderTemplate } from '@/types/editor';

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
