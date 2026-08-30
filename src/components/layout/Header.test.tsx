// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

vi.mock('@/components/site/SiteMark', () => ({
  SiteMark: () => <div data-testid="site-mark" />,
}));

import { Header } from './Header';

describe('Header', () => {
  afterEach(() => {
    cleanup();
  });

  it('does not render undo, redo, or clear workspace buttons', () => {
    render(<Header />);

    expect(screen.queryByTitle('clearWorkspace')).toBeNull();
    expect(screen.queryByTitle(/undo/i)).toBeNull();
    expect(screen.queryByTitle(/redo/i)).toBeNull();
  });
});
