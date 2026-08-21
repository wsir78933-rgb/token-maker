// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { ReferenceToolRail } from './ReferenceToolRail';

describe('ReferenceToolRail', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('uses vertical arrows without reacting to either horizontal arrow on a desktop tablist', () => {
    const onToolChange = vi.fn();
    render(<ReferenceToolRail activeToolId="shields" homeHref="/" locale="en" onCollapseChange={vi.fn()} onToolChange={onToolChange} />);

    const shields = screen.getByRole('tab', { name: 'Shields' });
    shields.focus();
    fireEvent.keyDown(shields, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(shields);
    expect(onToolChange).not.toHaveBeenCalled();

    fireEvent.keyDown(shields, { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(shields);
    expect(onToolChange).not.toHaveBeenCalled();

    fireEvent.keyDown(shields, { key: 'ArrowDown' });

    expect(screen.getByRole('tablist', { name: 'Coat maker tools' })).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Custom' }));
    expect(onToolChange).toHaveBeenCalledTimes(1);
    expect(onToolChange).toHaveBeenLastCalledWith('custom');
  });

  it('renders controlled expandable branches and reports the selected child', () => {
    const onToolChange = vi.fn();
    const onToolExpansionChange = vi.fn();
    const onToolChildSelect = vi.fn();
    render(<ReferenceToolRail
      activeToolId="shields"
      expandedToolIds={['shields']}
      homeHref="/"
      locale="en"
      onCollapseChange={vi.fn()}
      onToolChange={onToolChange}
      onToolChildSelect={onToolChildSelect}
      onToolExpansionChange={onToolExpansionChange}
      selectedToolChildren={{ shields: 'heater' }}
      treeBranches={{
        shields: [
          { id: 'shield', label: 'Shield' },
          { id: 'heater', label: 'Heater' },
        ],
        charges: [{ id: 'animal', label: 'Animals' }],
      }}
    />);

    const shields = screen.getByRole('tab', { name: 'Shields' });
    expect(shields.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('button', { name: 'Shield' }).getAttribute('aria-pressed')).toBe('false');
    expect(screen.getByRole('button', { name: 'Heater' }).getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'Heater' }));
    expect(onToolChildSelect).toHaveBeenCalledWith('shields', 'heater');

    fireEvent.click(screen.getByRole('tab', { name: 'Charges' }));
    expect(onToolChange).toHaveBeenLastCalledWith('charges');
    expect(onToolExpansionChange).toHaveBeenLastCalledWith('charges');
  });

  it('keeps all reference tools in order and roves with backward, Home, and End keys', () => {
    const onToolChange = vi.fn();
    render(<ReferenceToolRail activeToolId="shields" homeHref="/" locale="en" onCollapseChange={vi.fn()} onToolChange={onToolChange} />);

    const toolRail = screen.getByRole('tablist', { name: 'Coat maker tools' });
    expect(within(toolRail).getAllByRole('tab').map((tab) => tab.id)).toEqual([
      'coat-tab-position', 'coat-tab-shields', 'coat-tab-custom', 'coat-tab-charges', 'coat-tab-top',
      'coat-tab-colors', 'coat-tab-tools', 'coat-tab-how-to', 'coat-tab-settings', 'coat-tab-flags',
    ]);

    const charges = screen.getByRole('tab', { name: 'Charges' });
    charges.focus();
    fireEvent.keyDown(charges, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Custom' }));
    expect(onToolChange).toHaveBeenCalledTimes(1);
    expect(onToolChange).toHaveBeenLastCalledWith('custom');

    fireEvent.keyDown(document.activeElement as HTMLButtonElement, { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Custom' }));
    expect(onToolChange).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(document.activeElement as HTMLButtonElement, { key: 'Home' });
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Position' }));

    fireEvent.keyDown(document.activeElement as HTMLButtonElement, { key: 'End' });
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Flags' }));
    expect(onToolChange).toHaveBeenLastCalledWith('flags');
  });

  it.each([
    { expectedHref: '/', label: 'Tokens', locale: 'en' as const },
    { expectedHref: '/zh', label: '符记', locale: 'zh' as const },
  ])('renders $label as a localized homepage link that opens in a new tab', ({ expectedHref, label, locale }) => {
    const onToolChange = vi.fn();
    render(<ReferenceToolRail activeToolId="shields" homeHref={locale === 'en' ? '/' : '/zh'} locale={locale} onCollapseChange={vi.fn()} onToolChange={onToolChange} />);

    const tokenLink = screen.getByRole('link', { name: label });
    expect(tokenLink.getAttribute('href')).toBe(expectedHref);
    expect(tokenLink.getAttribute('target')).toBe('_blank');
    expect(tokenLink.getAttribute('rel')).toBe('noopener noreferrer');
    expect(screen.queryByRole('tab', { name: label })).toBeNull();
    tokenLink.addEventListener('click', (event) => event.preventDefault());
    fireEvent.click(tokenLink);
    expect(onToolChange).not.toHaveBeenCalled();
  });

  it('uses original geometric glyphs for every reference tool category', () => {
    render(<ReferenceToolRail activeToolId="shields" homeHref="/" locale="en" onCollapseChange={vi.fn()} onToolChange={vi.fn()} />);

    const toolRail = screen.getByRole('tablist', { name: 'Coat maker tools' });
    const glyphIds = within(toolRail).getAllByRole('tab').map((tab) => tab.querySelector('svg[data-tool-glyph]')?.getAttribute('data-tool-glyph'));
    expect(glyphIds).toEqual([
      'position', 'shields', 'custom', 'charges', 'top', 'colors', 'tools', 'how-to', 'settings', 'flags',
    ]);
    expect(screen.getByRole('link', { name: 'Tokens' }).querySelector('svg[data-tool-glyph]')?.getAttribute('data-tool-glyph')).toBe('tokens');
  });

  it.each([
    {
      locale: 'en' as const,
      railName: 'Coat maker tools',
      labels: ['Position', 'Shields', 'Custom', 'Charges', 'Top', 'Colors', 'Tools', 'How-to', 'Settings', 'Flags'],
      tokenLabel: 'Tokens',
    },
    {
      locale: 'zh' as const,
      railName: '徽章制作工具',
      labels: ['定位', '盾牌', '自定义', '图形', '顶部', '颜色', '工具', '使用说明', '设置', '旗帜'],
      tokenLabel: '符记',
    },
  ])('renders the current reference order from $locale copy', ({ locale, railName, labels, tokenLabel }) => {
    render(<ReferenceToolRail activeToolId="shields" homeHref={locale === 'en' ? '/' : '/zh'} locale={locale} onCollapseChange={vi.fn()} onToolChange={vi.fn()} />);

    const toolRail = screen.getByRole('tablist', { name: railName });
    expect(within(toolRail).getAllByRole('tab').map((tab) => tab.textContent)).toEqual(labels);
    expect(screen.getByRole('link', { name: tokenLabel })).toBeDefined();
  });

  it('reports a desktop rail collapse through its callback', () => {
    const onCollapseChange = vi.fn();
    render(<ReferenceToolRail activeToolId="shields" homeHref="/" locale="en" onCollapseChange={onCollapseChange} onToolChange={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Collapse tool panel' }));

    expect(onCollapseChange).toHaveBeenCalledTimes(1);
  });

  it('uses horizontal mobile tab IDs and an expanded-state collapse label when requested', () => {
    render(<ReferenceToolRail
      activeToolId="shields"
      idPrefix="mobile-coat"
      isCollapsed
      homeHref="/"
      locale="en"
      onCollapseChange={vi.fn()}
      onToolChange={vi.fn()}
      orientation="horizontal"
    />);

    const toolRail = screen.getByRole('tablist', { name: 'Coat maker tools' });
    expect(toolRail.getAttribute('aria-orientation')).toBe('horizontal');
    expect(screen.getByRole('tab', { name: 'Shields' }).id).toBe('mobile-coat-tab-shields');
    expect(screen.getByRole('tab', { name: 'Shields' }).getAttribute('aria-controls')).toBe('mobile-coat-panel-shields');
    expect(screen.getByRole('button', { name: 'Expand tool panel' }).getAttribute('aria-expanded')).toBe('false');
  });

  it('uses horizontal arrows without reacting to either vertical arrow on a mobile tablist', () => {
    const onToolChange = vi.fn();
    render(<ReferenceToolRail
      activeToolId="shields"
      idPrefix="mobile-coat"
      homeHref="/"
      locale="en"
      onCollapseChange={vi.fn()}
      onToolChange={onToolChange}
      orientation="horizontal"
    />);

    const shields = screen.getByRole('tab', { name: 'Shields' });
    shields.focus();
    fireEvent.keyDown(shields, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(shields);
    expect(onToolChange).not.toHaveBeenCalled();

    fireEvent.keyDown(shields, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(shields);
    expect(onToolChange).not.toHaveBeenCalled();

    fireEvent.keyDown(shields, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Custom' }));
    expect(onToolChange).toHaveBeenCalledTimes(1);
    expect(onToolChange).toHaveBeenLastCalledWith('custom');

    fireEvent.keyDown(document.activeElement as HTMLButtonElement, { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(shields);
    expect(onToolChange).toHaveBeenCalledTimes(2);
    expect(onToolChange).toHaveBeenLastCalledWith('shields');
  });
});
