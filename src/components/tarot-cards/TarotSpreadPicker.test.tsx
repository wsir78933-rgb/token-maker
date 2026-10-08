// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TAROT_SPREADS } from '@/lib/tarot-cards/spreads';
import type { TarotSpreadId } from '@/lib/tarot-cards/types';

import { TarotSpreadPicker } from './TarotSpreadPicker';

afterEach(() => {
  cleanup();
});

describe('TarotSpreadPicker', () => {
  it.each(['en', 'zh'] as const)('renders all 15 coordinate previews in %s', (locale) => {
    render(<TarotSpreadPicker locale={locale} selectedSpreadId="celtic-cross" onSelectSpread={vi.fn()} />);

    const picker = screen.getByTestId('tarot-spread-picker');
    const buttons = within(picker).getAllByRole('button');
    expect(buttons).toHaveLength(15);
    expect(buttons.map((button) => button.getAttribute('data-spread-id'))).toEqual(
      TAROT_SPREADS.map((spread) => spread.id),
    );
    expect(picker.querySelectorAll('[data-spread-preview]')).toHaveLength(15);
    for (const spread of TAROT_SPREADS) {
      const preview = picker.querySelector(`[data-spread-preview="${spread.id}"]`);
      expect(preview).toBeTruthy();
      expect(preview?.querySelectorAll('[data-position-number]')).toHaveLength(spread.positions.length);
    }
  });

  it('only reports the selected spread and does not deal cards', () => {
    const onSelectSpread = vi.fn();
    render(
      <TarotSpreadPicker
        locale="en"
        selectedSpreadId="celtic-cross"
        onSelectSpread={onSelectSpread}
      />,
    );

    const picker = screen.getByTestId('tarot-spread-picker');
    const annualButton = within(picker).getByRole('button', { name: /Annual.*年度.*13/ });
    expect(
      within(picker).getByRole('button', { name: /Celtic Cross.*凯尔特十字/ }).getAttribute('aria-pressed'),
    ).toBe('true');

    fireEvent.click(annualButton);
    expect(onSelectSpread).toHaveBeenCalledTimes(1);
    expect(onSelectSpread).toHaveBeenCalledWith('annual');
  });

  it('keeps fixed horizontal preview markers horizontal with upright labels', () => {
    render(<TarotSpreadPicker locale="en" selectedSpreadId="celtic-cross" onSelectSpread={vi.fn()} />);

    const preview = screen
      .getByTestId('tarot-spread-picker')
      .querySelector('[data-spread-preview="celtic-cross"]');
    const crossMarker = preview?.querySelector('[data-position-number="2"]');

    expect(crossMarker).toBeTruthy();
    expect(crossMarker?.className).toContain('h-5');
    expect(crossMarker?.className).toContain('w-7');
    expect((crossMarker as HTMLElement).style.transform).toBe('translate(-50%, -50%)');
  });

  it('fails fast for an unknown selected spread id', () => {
    expect(() =>
      render(
        <TarotSpreadPicker
          locale="en"
          selectedSpreadId={'missing-spread' as TarotSpreadId}
          onSelectSpread={vi.fn()}
        />,
      ),
    ).toThrow('Unknown tarot spread id: missing-spread');
  });
});
