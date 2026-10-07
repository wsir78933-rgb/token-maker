// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getTarotCopy } from '@/lib/tarot-cards/copy';
import { TarotHelpPanel } from './TarotHelpPanel';

afterEach(() => {
  cleanup();
});

describe('TarotHelpPanel', () => {
  it.each(['en', 'zh'] as const)('renders the localized dialog title and sections in %s', (locale) => {
    const copy = getTarotCopy(locale);
    const onOpenChange = vi.fn();

    render(<TarotHelpPanel locale={locale} open onOpenChange={onOpenChange} />);

    expect(screen.getByRole('dialog', { name: copy.help.title })).toBeTruthy();
    expect(screen.getByRole('heading', { name: copy.help.title })).toBeTruthy();
    for (const section of copy.help.sections) {
      expect(screen.getByRole('heading', { name: section.title })).toBeTruthy();
      expect(screen.getByText(section.body)).toBeTruthy();
    }
  });

  it('reports a controlled close when Escape is pressed', () => {
    const onOpenChange = vi.fn();

    render(<TarotHelpPanel locale="en" open onOpenChange={onOpenChange} />);
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('uses the localized close action', () => {
    const copy = getTarotCopy('zh');
    const onOpenChange = vi.fn();

    render(<TarotHelpPanel locale="zh" open onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByRole('button', { name: copy.actions.close }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
