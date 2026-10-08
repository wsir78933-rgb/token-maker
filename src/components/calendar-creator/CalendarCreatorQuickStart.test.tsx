// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { CalendarSettings } from '@/lib/calendar-creator/types';

import { CalendarCreatorQuickStart } from './CalendarCreatorQuickStart';

describe('CalendarCreatorQuickStart', () => {
  afterEach(cleanup);

  it('starts with the documented 2000, four-month, thirty-day, three-weekday draft', () => {
    render(<CalendarCreatorQuickStart locale="en" onCreate={vi.fn()} onOpenHelp={vi.fn()} />);

    expect((screen.getByRole('spinbutton', { name: 'Year' }) as HTMLInputElement).value).toBe('2000');
    expect((screen.getByRole('spinbutton', { name: 'Number of months' }) as HTMLInputElement).value).toBe('4');
    expect((screen.getByRole('spinbutton', { name: 'Days per month' }) as HTMLInputElement).value).toBe('30');
    expect((screen.getByRole('spinbutton', { name: 'Days per week' }) as HTMLInputElement).value).toBe('3');
    expect(screen.getByTestId('calendar-creator-total-days').textContent).toBe('120 days');
    expect(screen.getByRole('button', { name: 'Optional settings' }).getAttribute('aria-expanded')).toBe('false');
    expect(screen.getByRole('button', { name: 'Month details' }).getAttribute('aria-expanded')).toBe('false');
    expect(screen.getByRole('button', { name: 'Weekday details' }).getAttribute('aria-expanded')).toBe('false');
  });

  it('fills a draft uniformly while preserving existing month rows when the count changes', () => {
    render(<CalendarCreatorQuickStart locale="en" onCreate={vi.fn()} onOpenHelp={vi.fn()} />);

    fireEvent.change(screen.getByRole('spinbutton', { name: 'Days per month' }), { target: { value: '28' } });
    fireEvent.click(screen.getByRole('button', { name: 'Fill all months' }));
    fireEvent.click(screen.getByRole('button', { name: 'Month details' }));

    expect((screen.getByRole('spinbutton', { name: 'Days in month 1' }) as HTMLInputElement).value).toBe('28');
    expect((screen.getByRole('spinbutton', { name: 'Days in month 4' }) as HTMLInputElement).value).toBe('28');
    expect(screen.getByTestId('calendar-creator-total-days').textContent).toBe('112 days');

    fireEvent.change(screen.getByRole('textbox', { name: 'Month name 1' }), { target: { value: 'Rainfall' } });
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Number of months' }), { target: { value: '5' } });

    expect((screen.getByRole('textbox', { name: 'Month name 1' }) as HTMLInputElement).value).toBe('Rainfall');
    expect((screen.getByRole('spinbutton', { name: 'Days in month 5' }) as HTMLInputElement).value).toBe('28');
  });

  it('keeps optional moon and disaster controls closed until requested and submits their parsed values', () => {
    const onCreate = vi.fn();
    render(<CalendarCreatorQuickStart locale="zh" onCreate={onCreate} onOpenHelp={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: '可选设置' }));
    expect(screen.getAllByRole('img')).toHaveLength(8);
    expect(screen.getByRole('img', { name: '自然灾害图标 15' }).getAttribute('title')).toBe('自然灾害图标 15');
    fireEvent.change(screen.getByRole('spinbutton', { name: /白月亮/ }), { target: { value: '0' } });
    fireEvent.change(screen.getByRole('spinbutton', { name: /每日灾害概率/ }), { target: { value: '12.5' } });
    fireEvent.click(screen.getByRole('button', { name: '创建历法' }));

    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(onCreate.mock.calls[0]?.[0]).toMatchObject({
      year: 2000,
      months: [
        { dayCount: 30 },
        { dayCount: 30 },
        { dayCount: 30 },
        { dayCount: 30 },
      ],
      moonCycles: { white: null, blue: null, red: null },
      disasterProbability: 12.5,
    });
  });

  it('shows the offending blank year and blocks creation until it is corrected', () => {
    const onCreate = vi.fn();
    render(<CalendarCreatorQuickStart locale="en" onCreate={onCreate} onOpenHelp={vi.fn()} />);

    fireEvent.change(screen.getByRole('spinbutton', { name: 'Year' }), { target: { value: '' } });
    expect(screen.getByRole('alert').textContent).toContain('Received ""');
    fireEvent.click(screen.getByRole('button', { name: 'Create calendar' }));
    expect(onCreate).not.toHaveBeenCalled();
  });

  it('drops errors belonging to removed month rows before creating the draft', () => {
    const onCreate = vi.fn();
    render(<CalendarCreatorQuickStart locale="en" onCreate={onCreate} onOpenHelp={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Month details' }));
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Days in month 4' }), { target: { value: '-1' } });
    expect(screen.getByRole('alert').textContent).toContain('Received -1');
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Number of months' }), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create calendar' }));

    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(onCreate.mock.calls[0]?.[0].months).toHaveLength(2);
  });

  it('hydrates return mode from every setting, keeps the source immutable, and submits edited settings', () => {
    const initialSettings: CalendarSettings = {
      year: -12,
      months: [
        { name: 'Rainfall', dayCount: 0 },
        { name: 'Harvest', dayCount: 22 },
      ],
      weekdayNames: ['Firstday', 'Secondday'],
      startWeekdayIndex: 1,
      moonCycles: { white: null, blue: 4, red: 10 },
      disasterProbability: 12.5,
    };
    const initialSnapshot = JSON.parse(JSON.stringify(initialSettings)) as CalendarSettings;
    const onCreate = vi.fn();
    const onReturnToCalendar = vi.fn();

    render(
      <CalendarCreatorQuickStart
        locale="en"
        initialSettings={initialSettings}
        onCreate={onCreate}
        onOpenHelp={vi.fn()}
        onReturnToCalendar={onReturnToCalendar}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Adjust calendar settings' })).toBeTruthy();
    expect(screen.getByText('Your current calendar is kept while you edit settings. It changes only after you confirm regeneration.')).toBeTruthy();
    expect((screen.getByRole('spinbutton', { name: 'Year' }) as HTMLInputElement).value).toBe('-12');
    expect((screen.getByRole('spinbutton', { name: 'Number of months' }) as HTMLInputElement).value).toBe('2');
    expect((screen.getByRole('spinbutton', { name: 'Days per month' }) as HTMLInputElement).value).toBe('0');
    expect((screen.getByRole('spinbutton', { name: 'Days per week' }) as HTMLInputElement).value).toBe('2');

    fireEvent.click(screen.getByRole('button', { name: 'Month details' }));
    expect((screen.getByRole('textbox', { name: 'Month name 1' }) as HTMLInputElement).value).toBe('Rainfall');
    expect((screen.getByRole('spinbutton', { name: 'Days in month 1' }) as HTMLInputElement).value).toBe('0');
    expect((screen.getByRole('textbox', { name: 'Month name 2' }) as HTMLInputElement).value).toBe('Harvest');
    expect((screen.getByRole('spinbutton', { name: 'Days in month 2' }) as HTMLInputElement).value).toBe('22');

    fireEvent.click(screen.getByRole('button', { name: 'Weekday details' }));
    expect((screen.getByRole('textbox', { name: 'Weekday name 1' }) as HTMLInputElement).value).toBe('Firstday');
    expect((screen.getByRole('textbox', { name: 'Weekday name 2' }) as HTMLInputElement).value).toBe('Secondday');
    expect((screen.getByRole('combobox', { name: 'First weekday' }) as HTMLSelectElement).value).toBe('1');

    fireEvent.click(screen.getByRole('button', { name: 'Optional settings' }));
    expect((screen.getByRole('spinbutton', { name: 'White moon · Cycle length in days' }) as HTMLInputElement).value).toBe('');
    expect((screen.getByRole('spinbutton', { name: 'Blue moon · Cycle length in days' }) as HTMLInputElement).value).toBe('4');
    expect((screen.getByRole('spinbutton', { name: 'Red moon · Cycle length in days' }) as HTMLInputElement).value).toBe('10');
    expect((screen.getByRole('spinbutton', { name: 'Daily disaster chance (%)' }) as HTMLInputElement).value).toBe('12.5');

    fireEvent.change(screen.getByRole('spinbutton', { name: 'Year' }), { target: { value: '-11' } });
    fireEvent.change(screen.getByRole('textbox', { name: 'Month name 1' }), { target: { value: 'New Rainfall' } });
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Days in month 1' }), { target: { value: '5' } });
    fireEvent.change(screen.getByRole('textbox', { name: 'Weekday name 1' }), { target: { value: 'Firstnight' } });
    fireEvent.change(screen.getByRole('combobox', { name: 'First weekday' }), { target: { value: '0' } });
    fireEvent.change(screen.getByRole('spinbutton', { name: 'White moon · Cycle length in days' }), { target: { value: '3' } });
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Blue moon · Cycle length in days' }), { target: { value: '' } });
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Red moon · Cycle length in days' }), { target: { value: '8' } });
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Daily disaster chance (%)' }), { target: { value: '7.25' } });

    fireEvent.click(screen.getByRole('button', { name: 'Back to calendar' }));
    expect(onReturnToCalendar).toHaveBeenCalledTimes(1);
    expect(onCreate).not.toHaveBeenCalled();
    expect(initialSettings).toEqual(initialSnapshot);

    fireEvent.click(screen.getByRole('button', { name: 'Regenerate calendar' }));
    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(onCreate.mock.calls[0]?.[0]).toEqual({
      year: -11,
      months: [
        { name: 'New Rainfall', dayCount: 5 },
        { name: 'Harvest', dayCount: 22 },
      ],
      weekdayNames: ['Firstnight', 'Secondday'],
      startWeekdayIndex: 0,
      moonCycles: { white: 3, blue: null, red: 8 },
      disasterProbability: 7.25,
    });
    expect(initialSettings).toEqual(initialSnapshot);
  });

  it('fails fast when return mode has no initial settings', () => {
    expect(() =>
      render(
        <CalendarCreatorQuickStart
          locale="en"
          onCreate={vi.fn()}
          onOpenHelp={vi.fn()}
          onReturnToCalendar={vi.fn()}
        />,
      ),
    ).toThrowError('Received undefined');
  });
});
