// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import EnglishArmyFormationCreatorPage, {
  metadata as englishArmyFormationCreatorMetadata,
} from './(en)/army-formation-creator/page';
import ChineseArmyFormationCreatorPage, {
  metadata as chineseArmyFormationCreatorMetadata,
} from './(zh)/zh/army-formation-creator/page';

function readSiteTopbar(): HTMLElement {
  const topbar = document.querySelector('.site-topbar');
  if (!(topbar instanceof HTMLElement)) {
    throw new Error('Army formation creator page is missing the site topbar.');
  }

  return topbar;
}

function expectToolFollowsTopbar(topbar: HTMLElement, toolName: string): void {
  const tool = screen.getByRole('region', { name: toolName });
  const toolFollowsTopbar = topbar.compareDocumentPosition(tool) & Node.DOCUMENT_POSITION_FOLLOWING;
  expect(toolFollowsTopbar).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
}

describe('army formation creator routes', () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('renders the English page under the site topbar and keeps the armor link', () => {
    expect(englishArmyFormationCreatorMetadata.title).toEqual({ absolute: 'Army formation creator' });
    expect(englishArmyFormationCreatorMetadata.description).toBe(
      'Place battlefield pieces in the browser and download an image.',
    );
    expect(englishArmyFormationCreatorMetadata.alternates?.canonical).toBe('/army-formation-creator');
    expect(englishArmyFormationCreatorMetadata.alternates?.languages).toEqual({
      'x-default': '/army-formation-creator',
      'en-US': '/army-formation-creator',
      'zh-CN': '/zh/army-formation-creator',
    });

    render(<EnglishArmyFormationCreatorPage />);

    const topbar = readSiteTopbar();
    const freeToolsLink = within(topbar).getByRole('link', { name: 'Free tools' });
    expect(freeToolsLink.getAttribute('href')).toBe('/');
    const freeToolsNavItem = freeToolsLink.closest('.site-nav-item');
    if (!(freeToolsNavItem instanceof HTMLElement)) {
      throw new Error('Free tools link is not inside .site-nav-item');
    }
    fireEvent.mouseEnter(freeToolsNavItem);

    const freeToolsMenu = within(freeToolsNavItem).getByRole('menu', { name: 'Free tools' });
    expect(within(freeToolsMenu).getByRole('menuitem', { name: 'Armor' }).getAttribute('href')).toBe(
      '/armor-creator',
    );
    expect(
      within(freeToolsMenu).getByRole('menuitem', { name: 'Army formation creator' }).getAttribute('href'),
    ).toBe('/army-formation-creator');
    const activeFreeToolsTrigger = freeToolsLink.closest('[data-active]');
    if (!(activeFreeToolsTrigger instanceof HTMLElement)) {
      throw new Error('Free tools trigger is missing its active state.');
    }
    expect(activeFreeToolsTrigger.getAttribute('data-active')).toBe('true');
    expectToolFollowsTopbar(topbar, 'Army formation creator');
  });

  it('renders the Chinese page under the site topbar and keeps the armor link', () => {
    expect(chineseArmyFormationCreatorMetadata.title).toEqual({ absolute: '军阵' });
    expect(chineseArmyFormationCreatorMetadata.description).toBe('在浏览器里摆放战场棋子并下载图片。');
    expect(chineseArmyFormationCreatorMetadata.alternates?.canonical).toBe('/zh/army-formation-creator');
    expect(chineseArmyFormationCreatorMetadata.alternates?.languages).toEqual({
      'x-default': '/army-formation-creator',
      'en-US': '/army-formation-creator',
      'zh-CN': '/zh/army-formation-creator',
    });

    render(<ChineseArmyFormationCreatorPage />);

    const topbar = readSiteTopbar();
    const freeToolsLink = within(topbar).getByRole('link', { name: '免费工具' });
    expect(freeToolsLink.getAttribute('href')).toBe('/zh');
    const freeToolsNavItem = freeToolsLink.closest('.site-nav-item');
    if (!(freeToolsNavItem instanceof HTMLElement)) {
      throw new Error('免费工具链接不在 .site-nav-item 内');
    }
    fireEvent.mouseEnter(freeToolsNavItem);

    const freeToolsMenu = within(freeToolsNavItem).getByRole('menu', { name: '免费工具' });
    expect(within(freeToolsMenu).getByRole('menuitem', { name: '护甲' }).getAttribute('href')).toBe(
      '/zh/armor-creator',
    );
    expect(within(freeToolsMenu).getByRole('menuitem', { name: '军阵' }).getAttribute('href')).toBe(
      '/zh/army-formation-creator',
    );
    const activeFreeToolsTrigger = freeToolsLink.closest('[data-active]');
    if (!(activeFreeToolsTrigger instanceof HTMLElement)) {
      throw new Error('免费工具触发器缺少活动状态。');
    }
    expect(activeFreeToolsTrigger.getAttribute('data-active')).toBe('true');
    expectToolFollowsTopbar(topbar, '军阵');
  });
});
