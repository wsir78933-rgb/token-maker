// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { FamilyImagePanel } from './FamilyImagePanel';
import { getFamilyTreeCopy } from '@/lib/family-tree/copy';

const copy = getFamilyTreeCopy('en');

function renderPanel(overrides: Partial<React.ComponentProps<typeof FamilyImagePanel>> = {}) {
  const props: React.ComponentProps<typeof FamilyImagePanel> = {
    copy,
    previewUrl: null,
    busy: false,
    whiteBackground: false,
    previewWhiteBackground: false,
    onRegenerate: vi.fn(),
    onSave: vi.fn(),
    onClose: vi.fn(),
    onWhiteBackgroundChange: vi.fn(),
    ...overrides,
  };

  return { ...render(<FamilyImagePanel {...props} />), props };
}

describe('FamilyImagePanel', () => {
  afterEach(cleanup);

  it('keeps saving disabled until a locally generated preview exists', () => {
    renderPanel();

    expect(screen.getAllByText(copy.imageHelp)).toHaveLength(2);
    expect((screen.getByRole('button', { name: copy.saveImage }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('renders an image data URL and calls regenerate, save, and close callbacks', () => {
    const onRegenerate = vi.fn();
    const onSave = vi.fn();
    const onClose = vi.fn();
    const previewUrl = 'data:image/png;base64,AAAA';
    renderPanel({ previewUrl, onRegenerate, onSave, onClose });

    expect(screen.getByRole('img', { name: copy.imagePreview }).getAttribute('src')).toBe(previewUrl);
    fireEvent.click(screen.getByRole('button', { name: copy.regenerateImage }));
    fireEvent.click(screen.getByRole('button', { name: copy.saveImage }));
    fireEvent.click(screen.getByRole('button', { name: copy.close }));

    expect(onRegenerate).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('uses mutually exclusive background buttons and reports only changed selections', () => {
    const onWhiteBackgroundChange = vi.fn();
    const onRegenerate = vi.fn();
    const { rerender } = renderPanel({ onWhiteBackgroundChange, onRegenerate });
    const transparentButton = screen.getByRole('button', { name: copy.transparentBackground });
    const whiteButton = screen.getByRole('button', { name: copy.whiteBackground });

    expect(transparentButton.getAttribute('aria-pressed')).toBe('true');
    expect(whiteButton.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(transparentButton);
    expect(onWhiteBackgroundChange).not.toHaveBeenCalled();
    expect(onRegenerate).not.toHaveBeenCalled();
    fireEvent.click(whiteButton);
    expect(onWhiteBackgroundChange).toHaveBeenCalledWith(true);

    rerender(
      <FamilyImagePanel
        copy={copy}
        previewUrl="data:image/png;base64,AAAA"
        busy={false}
        whiteBackground={true}
        previewWhiteBackground={false}
        onRegenerate={vi.fn()}
        onSave={vi.fn()}
        onClose={vi.fn()}
        onWhiteBackgroundChange={onWhiteBackgroundChange}
      />,
    );
    expect(screen.getByRole('button', { name: copy.transparentBackground }).getAttribute('aria-pressed')).toBe('false');
    expect(screen.getByRole('button', { name: copy.whiteBackground }).getAttribute('aria-pressed')).toBe('true');
  });

  it('disables both background buttons while the image is busy', () => {
    renderPanel({ busy: true });

    expect((screen.getByRole('button', { name: copy.transparentBackground }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole('button', { name: copy.whiteBackground }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('uses previewWhiteBackground for the current preview surface', () => {
    const previewUrl = 'data:image/png;base64,AAAA';
    const { rerender } = renderPanel({ previewUrl, whiteBackground: true, previewWhiteBackground: false });

    expect(screen.getByRole('img', { name: copy.imagePreview }).parentElement?.getAttribute('data-preview-background')).toBe(
      'transparent',
    );

    rerender(
      <FamilyImagePanel
        copy={copy}
        previewUrl={previewUrl}
        busy={false}
        whiteBackground={false}
        previewWhiteBackground={true}
        onRegenerate={vi.fn()}
        onSave={vi.fn()}
        onClose={vi.fn()}
        onWhiteBackgroundChange={vi.fn()}
      />,
    );
    expect(screen.getByRole('img', { name: copy.imagePreview }).parentElement?.getAttribute('data-preview-background')).toBe(
      'white',
    );
  });

  it('rejects a non-boolean preview background value', () => {
    expect(() => renderPanel({ previewWhiteBackground: 'false' as never })).toThrowError(
      /preview white background state must be a boolean.*Received "false"/,
    );
  });

  it('rejects remote preview URLs', () => {
    expect(() => renderPanel({ previewUrl: 'https://example.com/family-tree.png' })).toThrowError(
      /must be null, a blob URL, or an image data URL/,
    );
  });
});
