// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import ChineseToolDirectoryPage from './(zh)/zh/tools/page';
import EnglishToolDirectoryPage from './(en)/tools/page';

describe('localized tool directory routes', () => {
  afterEach(() => {
    cleanup();
  });

  it.each([
    { localeLabel: 'English', PageComponent: EnglishToolDirectoryPage, hubLabel: 'Free tools', directoryHref: '/tools' },
    { localeLabel: 'Chinese', PageComponent: ChineseToolDirectoryPage, hubLabel: '免费工具', directoryHref: '/zh/tools' },
  ])('renders the shared directory shell and all 21 tools in $localeLabel', ({
    PageComponent,
    hubLabel,
    directoryHref,
  }) => {
    render(<PageComponent />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('contentinfo')).not.toBeNull();

    const freeToolsLink = screen.getByRole('link', { name: hubLabel });
    expect(freeToolsLink.getAttribute('href')).toBe(directoryHref);

    const toolDirectoryList = screen.getByTestId('tool-directory-grid');
    const toolLinks = within(toolDirectoryList).getAllByRole('link');
    expect(toolLinks).toHaveLength(21);

    const toolHrefs = toolLinks.map((toolLink) => toolLink.getAttribute('href'));
    if (toolHrefs.some((href) => href === null)) {
      throw new Error(`Tool directory contains a link without href. Received ${JSON.stringify(toolHrefs)}.`);
    }

    if (directoryHref === '/zh/tools') {
      expect(toolHrefs.every((href) => href !== null && /^\/zh(?:\/|#|$)/.test(href))).toBe(true);
      expect(toolHrefs.slice(-4)).toEqual([
        '/zh/castle-creator',
        '/zh/map-maker',
        '/zh/notice-board-creator',
        '/zh/population-generator',
      ]);
    } else {
      expect(toolHrefs.every((href) => !href?.startsWith('/zh/'))).toBe(true);
      expect(toolHrefs.slice(-4)).toEqual([
        '/castle-creator',
        '/map-maker',
        '/notice-board-creator',
        '/population-generator',
      ]);
    }
  });
});
