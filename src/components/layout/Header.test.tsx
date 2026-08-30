// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

vi.mock('@/components/site/SiteMark', () => ({
  SiteMark: () => <div data-testid="site-mark" />,
}));

import { useHistoryStore } from '@/lib/store/history';
import { Header } from './Header';

describe('Header', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('does not render undo, redo, or clear workspace buttons', () => {
    render(<Header />);

    expect(screen.queryByTitle('clearWorkspace')).toBeNull();
    expect(screen.queryByTitle(/undo/i)).toBeNull();
    expect(screen.queryByTitle(/redo/i)).toBeNull();
  });

  it.each([
    { modifier: 'metaKey', keyDownInit: { key: 'z', metaKey: true } },
    { modifier: 'ctrlKey', keyDownInit: { key: 'z', ctrlKey: true } },
  ])('calls undo on $modifier + z without shift', ({ keyDownInit }) => {
    render(<Header />);
    const undoSpy = vi.spyOn(useHistoryStore.getState(), 'undo');

    fireEvent.keyDown(window, keyDownInit);

    expect(undoSpy).toHaveBeenCalledTimes(1);
  });

  it.each([
    { modifier: 'metaKey', keyDownInit: { key: 'z', metaKey: true, shiftKey: true } },
    { modifier: 'ctrlKey', keyDownInit: { key: 'z', ctrlKey: true, shiftKey: true } },
  ])('does not call redo on $modifier + shift + z', ({ keyDownInit }) => {
    render(<Header />);
    const redoSpy = vi.spyOn(useHistoryStore.getState(), 'redo');

    fireEvent.keyDown(window, keyDownInit);

    expect(redoSpy).not.toHaveBeenCalled();
  });

  it('does not call redo on ctrlKey + y', () => {
    render(<Header />);
    const redoSpy = vi.spyOn(useHistoryStore.getState(), 'redo');

    fireEvent.keyDown(window, { key: 'y', ctrlKey: true });

    expect(redoSpy).not.toHaveBeenCalled();
  });
});
