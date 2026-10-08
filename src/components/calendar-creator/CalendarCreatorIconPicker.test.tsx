// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  CALENDAR_ICONS,
  getCalendarIconLabel,
} from '@/lib/calendar-creator/icons';

import { CalendarCreatorIconPicker } from './CalendarCreatorIconPicker';

describe('CalendarCreatorIconPicker', () => {
  afterEach(cleanup);

  it('renders all 75 source-mapped icons in the two required categories', () => {
    render(<CalendarCreatorIconPicker locale="en" onSelect={vi.fn()} />);

    expect(CALENDAR_ICONS).toHaveLength(75);
    expect(screen.getByText('Ordinary icons')).toBeTruthy();
    expect(screen.getByText('Moon icons')).toBeTruthy();
    expect(screen.getAllByRole('button')).toHaveLength(75);
    expect(screen.getAllByRole('img')).toHaveLength(75);
    expect(screen.getByRole('button', { name: getCalendarIconLabel(32, 'en') })).toBeTruthy();
  });

  it('applies an icon immediately and exposes the selected state accessibly', () => {
    const onSelect = vi.fn();
    render(
      <CalendarCreatorIconPicker
        locale="zh"
        selectedIconId={32}
        onSelect={onSelect}
      />,
    );

    const selectedButton = screen.getByRole('button', { name: getCalendarIconLabel(32, 'zh') });
    expect(selectedButton.getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(selectedButton);
    expect(onSelect).toHaveBeenCalledWith(32);
    expect(selectedButton.getAttribute('title')).toBe(getCalendarIconLabel(32, 'zh'));
  });

  it('disables every icon button when the picker is unavailable', () => {
    render(<CalendarCreatorIconPicker locale="en" onSelect={vi.fn()} disabled />);

    expect(screen.getAllByRole('button').every((button) => (button as HTMLButtonElement).disabled)).toBe(true);
  });
});
