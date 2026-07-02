// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { AboutPageView } from './AboutPageView';
import { ChangelogPageView } from './ChangelogPageView';

function getStructuredDataByScriptId(scriptId: string) {
  const structuredDataScript = document.getElementById(scriptId);

  if (!structuredDataScript?.textContent) {
    throw new Error(`Expected structured data script ${scriptId} to render.`);
  }

  return JSON.parse(structuredDataScript.textContent) as Record<string, unknown>;
}

describe('trust page views', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders internal evidence links on the About page', () => {
    render(<AboutPageView locale="en" />);

    expect(screen.getByRole('link', { name: 'Privacy evidence' }).getAttribute('href')).toBe(
      '/privacy'
    );
    expect(screen.getByRole('link', { name: 'Changelog evidence' }).getAttribute('href')).toBe(
      '/changelog'
    );
  });

  it('renders affected page links on Changelog entries', () => {
    render(<ChangelogPageView locale="en" />);

    const latestEntry = screen.getByRole('heading', { name: 'Added trust pages' }).closest('aside');
    const privacyEntry = screen
      .getByRole('heading', { name: 'Published FAQ and privacy notes' })
      .closest('article');

    expect(latestEntry).not.toBeNull();
    expect(privacyEntry).not.toBeNull();

    if (!latestEntry || !privacyEntry) {
      throw new Error('Expected changelog entry containers to render.');
    }

    expect(within(latestEntry).getByRole('link', { name: 'About' }).getAttribute('href')).toBe(
      '/about'
    );
    expect(
      within(latestEntry).getByRole('link', { name: 'Changelog' }).getAttribute('href')
    ).toBe('/changelog');
    expect(within(privacyEntry).getByRole('link', { name: 'FAQ' }).getAttribute('href')).toBe(
      '/faq'
    );
    expect(within(privacyEntry).getByRole('link', { name: 'Privacy' }).getAttribute('href')).toBe(
      '/privacy'
    );
  });

  it('renders the Chinese About page content with localized JSON-LD', () => {
    render(<AboutPageView locale="zh" />);

    expect(screen.getByRole('heading', { level: 1, name: '关于 Token Maker' })).not.toBeNull();
    expect(screen.getByText('维护原则')).not.toBeNull();
    expect(screen.getByText('这是 Token 工具，不是通用修图软件')).not.toBeNull();
    expect(screen.getByRole('link', { name: '查看隐私' }).getAttribute('href')).toBe(
      '/zh/privacy'
    );
    expect(screen.getByRole('link', { name: '查看更新记录' }).getAttribute('href')).toBe(
      '/zh/changelog'
    );

    expect(getStructuredDataByScriptId('about-zh-webpage-jsonld')).toMatchObject({
      '@type': 'AboutPage',
      url: 'https://www.tokenmaker.one/zh/about',
      dateModified: '2026-06-24',
      inLanguage: 'zh-CN',
    });
  });

  it('renders the Chinese Changelog page content with localized JSON-LD', () => {
    render(<ChangelogPageView locale="zh" />);

    const latestEntry = screen.getByRole('heading', { name: '新增信任信息页面' }).closest('aside');

    expect(screen.getByRole('heading', { level: 1, name: 'Token Maker 更新记录' })).not.toBeNull();
    expect(screen.getByText('公开更新')).not.toBeNull();
    expect(latestEntry).not.toBeNull();

    if (!latestEntry) {
      throw new Error('Expected latest Chinese changelog entry container to render.');
    }

    expect(within(latestEntry).getByRole('link', { name: '关于' }).getAttribute('href')).toBe(
      '/zh/about'
    );
    expect(within(latestEntry).getByRole('link', { name: '更新记录' }).getAttribute('href')).toBe(
      '/zh/changelog'
    );

    expect(getStructuredDataByScriptId('changelog-zh-webpage-jsonld')).toMatchObject({
      '@type': 'WebPage',
      url: 'https://www.tokenmaker.one/zh/changelog',
      dateModified: '2026-06-24',
      inLanguage: 'zh-CN',
    });
  });
});
