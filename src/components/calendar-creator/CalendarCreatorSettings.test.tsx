// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createDefaultCalendarSettings } from '@/lib/calendar-creator/calendar';

import { CalendarCreatorSettings } from './CalendarCreatorSettings';

describe('CalendarCreatorSettings', () => {
  afterEach(cleanup);

  it('keeps edits staged until Save and exposes all four rule tabs', () => {
    const onApply = vi.fn();
    const settings = createDefaultCalendarSettings();
    render(
      <CalendarCreatorSettings
        locale="en"
        settings={settings}
        onApply={onApply}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getAllByRole('tab')).toHaveLength(4);
    fireEvent.change(screen.getByLabelText('Year'), { target: { value: '2001' } });
    expect(onApply).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Update calendar' }));
    expect(onApply).toHaveBeenCalledTimes(1);
    expect(onApply.mock.calls[0]?.[0].year).toBe(2001);
  });

  it('preserves unaffected month and weekday rows, including zero-day months', () => {
    const onApply = vi.fn();
    const settings = createDefaultCalendarSettings();
    settings.months[0].name = 'Rainfall';
    settings.weekdayNames[0] = 'Firstday';
    render(
      <CalendarCreatorSettings
        locale="en"
        settings={settings}
        onApply={onApply}
        onClose={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByRole('spinbutton', { name: 'Days in month 1' }), { target: { value: '0' } });
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Number of months' }), { target: { value: '5' } });
    expect((screen.getByRole('textbox', { name: 'Month name 1' }) as HTMLInputElement).value).toBe('Rainfall');
    expect((screen.getByRole('spinbutton', { name: 'Days in month 5' }) as HTMLInputElement).value).toBe('30');

    fireEvent.click(screen.getByRole('tab', { name: 'Weekdays' }));
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Days per week' }), { target: { value: '4' } });
    expect((screen.getByRole('textbox', { name: 'Weekday name 1' }) as HTMLInputElement).value).toBe('Firstday');
    expect((screen.getByRole('combobox', { name: 'First weekday' }) as HTMLSelectElement).value).toBe('0');

    fireEvent.click(screen.getByRole('button', { name: 'Update calendar' }));
    expect(onApply.mock.calls[0]?.[0]).toMatchObject({
      months: [
        { name: 'Rainfall', dayCount: 0 },
        { dayCount: 30 },
        { dayCount: 30 },
        { dayCount: 30 },
        { dayCount: 30 },
      ],
      weekdayNames: ['Firstday', '', '', ''],
    });
  });

  it('accepts decimal disaster probability, treats blank moon cycles as disabled, and closes on Escape', () => {
    const onApply = vi.fn();
    const onClose = vi.fn();
    render(
      <CalendarCreatorSettings
        locale="zh"
        settings={createDefaultCalendarSettings()}
        onApply={onApply}
        onClose={onClose}
      />,
    );

    fireEvent.click(screen.getByRole('tab', { name: '月亮' }));
    fireEvent.change(screen.getByRole('spinbutton', { name: /白月亮/ }), { target: { value: '' } });
    fireEvent.click(screen.getByRole('tab', { name: '灾害' }));
    fireEvent.change(screen.getByRole('spinbutton', { name: /每日灾害概率/ }), { target: { value: '12.5' } });
    fireEvent.click(screen.getByRole('button', { name: '更新历法' }));

    expect(onApply.mock.calls[0]?.[0]).toMatchObject({
      moonCycles: { white: null, blue: null, red: null },
      disasterProbability: 12.5,
    });

    fireEvent.keyDown(screen.getByTestId('calendar-creator-settings'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
