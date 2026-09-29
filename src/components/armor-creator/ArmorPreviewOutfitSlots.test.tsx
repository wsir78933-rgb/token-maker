// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ArmorPreviewOutfitSlots } from '@/components/armor-creator/ArmorPreviewOutfitSlots';

const OUTFIT_LABELS = ['套装 1', '套装 2', '套装 3', '套装 4'] as const;

const OUTFIT_SLOT_ROW_CLASS = 'grid grid-cols-4 gap-2';
const OUTFIT_SLOT_SHAPE_CLASS = 'rounded-md border px-3 py-2 text-sm';
const SELECTED_OUTFIT_SLOT_CLASS = `${OUTFIT_SLOT_SHAPE_CLASS} border-[var(--site-accent-strong)] bg-[var(--site-accent-bg)] text-[var(--site-accent-strong)] ring-2 ring-[var(--site-accent-strong)]`;
const IDLE_OUTFIT_SLOT_CLASS = `${OUTFIT_SLOT_SHAPE_CLASS} border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] text-[var(--site-ink)]`;

function renderOutfitSlots(
  activeOutfitSlot: 1 | 2 | 3 | 4 | null,
  onSelect: (slotNumber: 1 | 2 | 3 | 4) => void = () => {},
  labels: readonly string[] = OUTFIT_LABELS,
) {
  return render(
    <ArmorPreviewOutfitSlots labels={labels} activeOutfitSlot={activeOutfitSlot} onSelect={onSelect} />,
  );
}

describe('ArmorPreviewOutfitSlots', () => {
  afterEach(() => {
    cleanup();
  });

  it('渲染四个按钮文案', () => {
    renderOutfitSlots(null);

    const outfitButtons = screen.getAllByRole('button');
    expect(outfitButtons).toHaveLength(4);
    expect(outfitButtons.map((outfitButton) => outfitButton.textContent)).toEqual([
      '套装 1',
      '套装 2',
      '套装 3',
      '套装 4',
    ]);
    expect(outfitButtons.every((outfitButton) => outfitButton.getAttribute('type') === 'button')).toBe(true);
    expect(outfitButtons[0]?.parentElement?.className).toBe(OUTFIT_SLOT_ROW_CLASS);
  });

  it('按钮里没有 img', () => {
    const { container } = renderOutfitSlots(1);

    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('canvas')).toBeNull();
    for (const outfitButton of screen.getAllByRole('button')) {
      expect(outfitButton.querySelector('img')).toBeNull();
      expect(outfitButton.querySelector('canvas')).toBeNull();
    }
  });

  it('点第二个按钮调用 onSelect(2)', () => {
    const onSelect = vi.fn();
    renderOutfitSlots(null, onSelect);

    fireEvent.click(screen.getByRole('button', { name: '套装 2' }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(2);
  });

  it('active 为 1 时只有第一个 pressed', () => {
    renderOutfitSlots(1);

    const outfitButtons = screen.getAllByRole('button');
    expect(outfitButtons[0]?.getAttribute('aria-pressed')).toBe('true');
    expect(outfitButtons[0]?.className).toBe(SELECTED_OUTFIT_SLOT_CLASS);
    expect(outfitButtons[1]?.getAttribute('aria-pressed')).toBe('false');
    expect(outfitButtons[1]?.className).toBe(IDLE_OUTFIT_SLOT_CLASS);
    expect(outfitButtons[2]?.getAttribute('aria-pressed')).toBe('false');
    expect(outfitButtons[2]?.className).toBe(IDLE_OUTFIT_SLOT_CLASS);
    expect(outfitButtons[3]?.getAttribute('aria-pressed')).toBe('false');
    expect(outfitButtons[3]?.className).toBe(IDLE_OUTFIT_SLOT_CLASS);
  });

  it('active 为 null 时都没 pressed', () => {
    renderOutfitSlots(null);

    for (const outfitButton of screen.getAllByRole('button')) {
      expect(outfitButton.getAttribute('aria-pressed')).toBe('false');
      expect(outfitButton.className).toBe(IDLE_OUTFIT_SLOT_CLASS);
    }
  });

  it('labels 长度 3 会抛错', () => {
    expect(() => renderOutfitSlots(null, () => {}, ['套装 1', '套装 2', '套装 3'])).toThrow(
      'Armor preview outfit labels must have length 4. Received length 3.',
    );
  });

  it('labels 含空字符串或非字符串时抛错，并带上 index 和原值', () => {
    expect(() => renderOutfitSlots(null, () => {}, ['', '套装 2', '套装 3', '套装 4'])).toThrowError(
      'Armor preview outfit label at index 0 must be a non-empty string. Received "".',
    );
    expect(() =>
      renderOutfitSlots(null, () => {}, ['套装 1', '套装 2', '套装 3', 0 as unknown as string]),
    ).toThrowError('Armor preview outfit label at index 3 must be a non-empty string. Received 0.');
  });

  it('labels 是循环对象时抛出带对象说明的 Error', () => {
    const circularLabels: { self?: unknown } = {};
    circularLabels.self = circularLabels;

    try {
      renderOutfitSlots(null, () => {}, circularLabels as unknown as readonly string[]);
      throw new Error('Armor preview outfit labels accepted a circular object.');
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(Error);
      expect(error).not.toBeInstanceOf(TypeError);
      if (!(error instanceof Error)) {
        return;
      }

      expect(error.message).toContain('[object Object]');
      expect(error.message).toContain('Armor preview outfit labels must be an array of length 4.');
    }
  });

  it('某一项是循环对象时抛 Error，不把 JSON TypeError 冒出去', () => {
    const circularLabel: { self?: unknown } = {};
    circularLabel.self = circularLabel;

    try {
      renderOutfitSlots(null, () => {}, [
        circularLabel as unknown as string,
        '套装 2',
        '套装 3',
        '套装 4',
      ]);
      throw new Error('Armor preview outfit labels accepted a circular label.');
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(Error);
      expect(error).not.toBeInstanceOf(TypeError);
      if (!(error instanceof Error)) {
        return;
      }

      expect(error.message).toContain('index 0');
      expect(error.message).toContain('[object Object]');
    }
  });

  it('JSON.stringify 抛出的其他异常继续向外抛', () => {
    const explodingLabels = {
      toJSON(): string {
        throw new RangeError('outfit label explode');
      },
    };

    expect(() =>
      renderOutfitSlots(null, () => {}, explodingLabels as unknown as readonly string[]),
    ).toThrow(RangeError);
  });
});
