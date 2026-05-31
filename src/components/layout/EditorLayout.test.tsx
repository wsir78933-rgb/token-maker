// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

vi.mock('@/lib/store/batch-store', () => ({
  useBatchStore: (selector: (state: { isActive: boolean }) => unknown) =>
    selector({ isActive: true }),
}));

vi.mock('@/components/editor/editor-store-hooks', () => ({
  useHasEditorImage: () => true,
}));

vi.mock('@/lib/analytics', () => ({
  trackStartEditor: vi.fn(),
}));

vi.mock('@/components/layout/Header', () => ({
  Header: () => <div data-testid="header" />,
}));

vi.mock('@/components/editor/ControlPanel', () => ({
  ControlPanel: () => <div data-testid="control-panel" />,
}));

vi.mock('@/components/editor/TemplatePanel', () => ({
  MobileBorderTemplatesPanel: () => <div data-testid="mobile-border-panel" />,
  TemplatePanel: () => <div data-testid="template-panel" />,
}));

vi.mock('@/components/editor/Canvas', () => ({
  Canvas: ({ previewMode }: { previewMode?: string }) => (
    <div data-testid="canvas" data-preview-mode={previewMode ?? 'default'} />
  ),
}));

vi.mock('@/components/editor/BatchPanel', () => ({
  BatchPanel: () => <div data-testid="batch-panel" />,
}));

vi.mock('@/components/editor/ShareDialog', () => ({
  ShareDialog: () => null,
}));

vi.mock('@/components/layout/EditorSearchParamsSync', () => ({
  EditorSearchParamsSync: () => null,
}));

import { EditorLayout } from './EditorLayout';

describe('EditorLayout', () => {
  it('uses a compact batch preview so the image list remains visible', () => {
    render(<EditorLayout />);

    const canvas = screen.getByTestId('canvas');
    const previewStage = canvas.parentElement;

    expect(canvas.getAttribute('data-preview-mode')).toBe('batch');
    expect(previewStage?.className).toContain('h-[18rem]');
    expect(previewStage?.className).toContain('sm:h-[22rem]');
    expect(previewStage?.className).toContain('xl:h-[24rem]');
    expect(previewStage?.className).not.toContain('xl:h-[28rem]');
    expect(previewStage?.className).not.toContain('xl:h-[35rem]');
  });
});
