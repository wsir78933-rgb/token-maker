import {
  getEditorFontCanvasShorthand,
  getEditorFontDefinition,
  resolveEditorFontId,
} from '@/lib/editor-fonts/catalog';
import type { TextBox } from '@/types/editor';
import type { EditorFontId } from '@/types/editor-font';

export interface EditorFontFaceSet {
  load(font: string, text?: string): Promise<readonly unknown[]>;
}

interface EditorFontLoadRequest {
  fontWeight: number;
  probeText: string;
}

function getDocumentFontFaceSet(fontId: EditorFontId): EditorFontFaceSet {
  if (typeof document === 'undefined' || !document.fonts) {
    throw new Error(`Editor font loading is unavailable for font "${fontId}"`);
  }

  return document.fonts;
}

function collectLocalFontLoadRequests(
  textBoxes: readonly TextBox[],
): Map<EditorFontId, EditorFontLoadRequest> {
  const loadRequests = new Map<EditorFontId, EditorFontLoadRequest>();

  for (const textBox of textBoxes) {
    const fontId = resolveEditorFontId(textBox.fontId);
    const fontDefinition = getEditorFontDefinition(fontId);

    if (!fontDefinition.filePath) {
      continue;
    }

    const existingRequest = loadRequests.get(fontId);
    if (!existingRequest) {
      loadRequests.set(fontId, {
        fontWeight: textBox.fontWeight,
        probeText: textBox.content,
      });
      continue;
    }

    if (!existingRequest.probeText && textBox.content) {
      existingRequest.probeText = textBox.content;
    }
  }

  return loadRequests;
}

export async function preloadEditorFonts(
  textBoxes: readonly TextBox[],
  fontFaceSet?: EditorFontFaceSet,
): Promise<void> {
  const loadRequests = collectLocalFontLoadRequests(textBoxes);
  if (loadRequests.size === 0) {
    return;
  }

  const firstFontId = loadRequests.keys().next().value as EditorFontId;
  const resolvedFontFaceSet = fontFaceSet ?? getDocumentFontFaceSet(firstFontId);

  await Promise.all(
    Array.from(loadRequests, async ([fontId, { fontWeight, probeText }]) => {
      const loadedFaces = await resolvedFontFaceSet.load(
        getEditorFontCanvasShorthand(fontId, fontWeight, 48),
        probeText,
      );

      if (loadedFaces.length === 0) {
        throw new Error(`Editor font failed to load: "${fontId}"`);
      }
    }),
  );
}
