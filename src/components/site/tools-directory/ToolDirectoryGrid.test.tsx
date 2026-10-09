// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/image', () => ({
  default: ({ src, alt, ...imageProps }: { src: string; alt: string }) => {
    // eslint-disable-next-line @next/next/no-img-element -- the test double renders a plain image element.
    return <img {...imageProps} src={src} alt={alt} />;
  },
}));

import { ToolDirectoryGrid } from './ToolDirectoryGrid';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('ToolDirectoryGrid', () => {
  it('renders all 17 tools as full-card links with real art and a text output preview', () => {
    render(<ToolDirectoryGrid locale="en" />);

    const toolList = screen.getByTestId('tool-directory-grid');
    const toolCards = within(toolList).getAllByRole('link');

    expect(toolCards).toHaveLength(17);
    expect(screen.getAllByRole('img')).toHaveLength(16);
    expect(screen.getByText('the gate opens at dawn')).toBeTruthy();
    expect(screen.getByText('klo sako avort ak bavr')).toBeTruthy();
    expect(toolCards[0]?.getAttribute('href')).toBe('/#editor-workspace');
    expect(toolCards.at(-1)?.getAttribute('href')).toBe('/town-creator');
  });

  it('searches the current English names and descriptions without case or outer-space sensitivity', () => {
    render(<ToolDirectoryGrid locale="en" />);

    const searchInput = screen.getByRole('searchbox', { name: 'Search tools' });
    fireEvent.change(searchInput, { target: { value: '  dIcE rOlLeR  ' } });

    const filteredToolList = screen.getByTestId('tool-directory-grid');
    const filteredToolCards = within(filteredToolList).getAllByRole('link');

    expect(filteredToolCards).toHaveLength(1);
    expect(filteredToolCards[0]?.getAttribute('href')).toBe('/dice-roller-dnd');

    fireEvent.change(searchInput, { target: { value: '   ' } });
    expect(within(screen.getByTestId('tool-directory-grid')).getAllByRole('link')).toHaveLength(17);
  });

  it('searches localized Chinese text and presents a clear no-results state', () => {
    render(<ToolDirectoryGrid locale="zh" />);

    const searchInput = screen.getByRole('searchbox', { name: '搜索工具' });
    fireEvent.change(searchInput, { target: { value: '城镇地图' } });

    const filteredToolList = screen.getByTestId('tool-directory-grid');
    const filteredToolCards = within(filteredToolList).getAllByRole('link');

    expect(filteredToolCards).toHaveLength(1);
    expect(filteredToolCards[0]?.getAttribute('href')).toBe('/zh/town-creator');

    fireEvent.change(searchInput, { target: { value: '不存在的工具' } });

    expect(screen.queryByTestId('tool-directory-grid')).toBeNull();
    expect(screen.getByRole('status').textContent).toContain('没有找到匹配“不存在的工具”');
  });

  it('searches the current English use descriptions instead of only tool names', () => {
    render(<ToolDirectoryGrid locale="en" />);
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search tools' }), {
      target: { value: 'saving throw' },
    });

    const filteredToolCards = within(screen.getByTestId('tool-directory-grid')).getAllByRole('link');

    expect(filteredToolCards).toHaveLength(1);
    expect(filteredToolCards[0]?.getAttribute('href')).toBe('/dice-roller-dnd');
  });
});
