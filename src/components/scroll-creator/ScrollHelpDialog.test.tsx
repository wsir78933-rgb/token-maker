// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getScrollCreatorCopy } from '@/lib/scroll-creator/copy';

import { ScrollHelpDialog } from './ScrollHelpDialog';

afterEach(cleanup);

describe('ScrollHelpDialog', () => {
  it.each(['en', 'zh'] as const)('renders localized help content and closes with the localized action in %s', (locale) => {
    const copy = getScrollCreatorCopy(locale);
    const onClose = vi.fn();
    render(<ScrollHelpDialog copy={copy} open onClose={onClose} />);

    expect(screen.getByRole('heading', { name: copy.helpTitle })).toBeTruthy();
    expect(screen.getByText(copy.helpText)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: copy.closeDialog }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
