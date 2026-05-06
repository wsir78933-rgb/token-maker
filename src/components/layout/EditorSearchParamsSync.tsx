'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEditorStore } from '@/lib/store/editor-store';
import { BORDER_TEMPLATES, isCompetitorBorderId } from '@/lib/templates/borders';
import { MASK_TEMPLATES } from '@/lib/templates/masks';
import { STYLE_PRESETS } from '@/lib/templates/presets';
import type { ExportSize } from '@/types/editor';

const EXPORT_SIZES: ExportSize[] = [256, 512, 1024, 2048];

export function EditorSearchParamsSync() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const preset = searchParams.get('preset');
    const mask = searchParams.get('mask');
    const border = searchParams.get('border');
    const size = searchParams.get('size');

    if (!preset && !mask && !border && !size) {
      return;
    }

    const store = useEditorStore.getState();

    if (preset) {
      const matchedPreset = STYLE_PRESETS.find((item) => item.id === preset);
      if (matchedPreset) {
        store.applyPreset(matchedPreset);
      }
    }

    if (mask) {
      const matchedMask = MASK_TEMPLATES.find((item) => item.id === mask);
      if (matchedMask) {
        store.setSelectedMask(matchedMask.id);
      }
    }

    if (border) {
      const matchedBorder = BORDER_TEMPLATES.find((item) => item.id === border);
      if (matchedBorder) {
        store.setBorderLibraryMode(isCompetitorBorderId(matchedBorder.id) ? 'competitor' : 'default');
        store.setSelectedBorder(matchedBorder.id);
      }
    }

    if (size) {
      const matchedSize = EXPORT_SIZES.find((item) => String(item) === size);
      if (matchedSize) {
        store.setExportSize(matchedSize);
      }
    }
  }, [searchParams]);

  return null;
}
