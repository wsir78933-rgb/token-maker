import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

function readSource(relativePath: string) {
  return readFileSync(resolve(process.cwd(), relativePath), 'utf8');
}

describe('architecture boundaries', () => {
  it('keeps renderer modules independent from editor store state', () => {
    const rendererFiles = [
      'src/lib/renderer/pipeline.ts',
      'src/lib/renderer/borders.ts',
    ];

    for (const file of rendererFiles) {
      expect(readSource(file)).not.toMatch(/@\/lib\/store|store\/editor-store/);
    }
  });

  it('keeps batch store focused on batch state transitions', () => {
    const source = readSource('src/lib/store/batch-store.ts');

    expect(source).not.toMatch(/from ['"]\.\/editor-store['"]/);
    expect(source).not.toMatch(/from ['"]jszip['"]/);
    expect(source).not.toMatch(/from ['"]file-saver['"]/);
    expect(source).not.toMatch(/@\/lib\/renderer\/pipeline/);
  });

  it('keeps editor UI components behind editor store hooks', () => {
    const componentFiles = [
      'src/components/editor/Canvas.tsx',
      'src/components/editor/ControlPanel.tsx',
      'src/components/editor/TemplatePanel.tsx',
      'src/components/editor/BatchPanel.tsx',
      'src/components/editor/ImageUploader.tsx',
      'src/components/editor/TextCanvasOverlay.tsx',
      'src/components/layout/Header.tsx',
      'src/components/layout/EditorLayout.tsx',
      'src/components/layout/EditorSearchParamsSync.tsx',
    ];

    for (const file of componentFiles) {
      expect(readSource(file)).not.toMatch(/@\/lib\/store\/editor-store/);
    }
  });
});
