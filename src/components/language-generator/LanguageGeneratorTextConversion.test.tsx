// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ComponentProps } from 'react';

import { getLanguageGeneratorCopy } from '@/lib/language-generator/copy';

import { LanguageGeneratorTextConversion } from './LanguageGeneratorTextConversion';

const copy = getLanguageGeneratorCopy('en');

function renderTextConversion(overrides: Partial<ComponentProps<typeof LanguageGeneratorTextConversion>> = {}) {
  const callbacks = {
    onTextChange: vi.fn(),
    onTranslate: vi.fn(),
    onClear: vi.fn(),
    onCopy: vi.fn(),
  };
  const props: ComponentProps<typeof LanguageGeneratorTextConversion> = {
    copy,
    text: 'hello\nworld',
    result: 'hallo\nwerld',
    copied: false,
    ...callbacks,
    ...overrides,
  };

  return { ...render(<LanguageGeneratorTextConversion {...props} />), callbacks };
}

describe('LanguageGeneratorTextConversion', () => {
  afterEach(() => {
    cleanup();
  });

  it('returns textarea changes without modifying line breaks', () => {
    const { callbacks } = renderTextConversion();
    const input = screen.getByRole('textbox', { name: copy.inputLabel });

    fireEvent.change(input, { target: { value: 'first\nsecond' } });

    expect(callbacks.onTextChange).toHaveBeenCalledWith('first\nsecond');
  });

  it('returns translate, clear, and copy actions', () => {
    const { callbacks } = renderTextConversion();

    fireEvent.click(screen.getByRole('button', { name: copy.translateButton }));
    fireEvent.click(screen.getByRole('button', { name: copy.clearButton }));
    fireEvent.click(screen.getByRole('button', { name: copy.copyButton }));

    expect(callbacks.onTranslate).toHaveBeenCalledOnce();
    expect(callbacks.onClear).toHaveBeenCalledOnce();
    expect(callbacks.onCopy).toHaveBeenCalledOnce();
  });

  it('shows an explicit empty output and disables copying without a result', () => {
    const { callbacks } = renderTextConversion({ result: '' });

    expect(screen.getByText(copy.emptyOutput)).toBeTruthy();
    const copyButton = screen.getByRole('button', { name: copy.copyButton });
    expect((copyButton as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(copyButton);
    expect(callbacks.onCopy).not.toHaveBeenCalled();
  });
});
