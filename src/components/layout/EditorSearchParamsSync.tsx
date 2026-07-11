'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getCurrentEditorState } from '@/components/editor/editor-store-hooks';
import { BORDER_TEMPLATES, isCompetitorBorderId } from '@/lib/templates/borders';
import { MASK_TEMPLATES } from '@/lib/templates/masks';
import { STYLE_PRESETS } from '@/lib/templates/presets';
import type { ExportSize } from '@/types/editor';

const EXPORT_SIZES: ExportSize[] = [256, 512, 1024, 2048];
const HEX_COLOR_PARAM_PATTERN = /^#[0-9a-fA-F]{6}$/;

function getValidHexColorParam(paramName: string, searchParams: URLSearchParams) {
  const colorParam = searchParams.get(paramName);
  if (!colorParam) return null;

  return HEX_COLOR_PARAM_PATTERN.test(colorParam) ? colorParam.toUpperCase() : null;
}

export function EditorSearchParamsSync() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const preset = searchParams.get('preset');
    const mask = searchParams.get('mask');
    const border = searchParams.get('border');
    const borderTint = getValidHexColorParam('borderTint', searchParams);
    const size = searchParams.get('size');

    if (!preset && !mask && !border && !borderTint && !size) {
      return;
    }

    const store = getCurrentEditorState();

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

    if (borderTint) {
      store.setBorderTint(borderTint);
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
