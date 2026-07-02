// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { SiteSupportStrip } from './SiteSupportStrip';

describe('SiteSupportStrip', () => {
  afterEach(() => {
    cleanup();
  });

  it('links to English trust and support pages', () => {
    render(<SiteSupportStrip locale="en" currentPath="/about" />);

    const aboutLink = screen.getByRole('link', { name: /about/i });
    const changelogLink = screen.getByRole('link', { name: /changelog/i });

    expect(aboutLink.getAttribute('href')).toBe('/about');
    expect(aboutLink.getAttribute('aria-current')).toBe('page');
    expect(aboutLink.getAttribute('class')).toContain('border-[#d7b46a]/35');
    expect(changelogLink.getAttribute('href')).toBe('/changelog');
    expect(screen.getByRole('link', { name: /contact/i })).toBeDefined();
  });

  it('labels English support links as navigation', () => {
    render(<SiteSupportStrip locale="en" currentPath="/" />);

    expect(screen.getByRole('navigation', { name: 'Support pages' })).toBeDefined();
  });

  it('keeps About and Changelog visible when contact is hidden', () => {
    render(<SiteSupportStrip locale="en" currentPath="/" hideContact />);

    expect(screen.getByRole('link', { name: /about/i }).getAttribute('href')).toBe('/about');
    expect(screen.getByRole('link', { name: /changelog/i }).getAttribute('href')).toBe('/changelog');
    expect(screen.queryByRole('link', { name: /contact/i })).toBeNull();
  });

  it('uses a balanced four-link grid when contact is hidden', () => {
    render(<SiteSupportStrip locale="en" currentPath="/" hideContact />);

    const supportNavigation = screen.getByRole('navigation', { name: 'Support pages' });

    expect(supportNavigation.getAttribute('class')).toContain('md:grid-cols-2');
    expect(supportNavigation.getAttribute('class')).toContain('lg:grid-cols-4');
  });

  it('uses a five-link grid when all support links are visible', () => {
    render(<SiteSupportStrip locale="en" currentPath="/" />);

    const supportNavigation = screen.getByRole('navigation', { name: 'Support pages' });

    expect(supportNavigation.getAttribute('class')).toContain('md:grid-cols-3');
    expect(supportNavigation.getAttribute('class')).toContain('xl:grid-cols-5');
  });

  it('localizes trust and support page links for Chinese routes', () => {
    render(<SiteSupportStrip locale="zh" currentPath="/zh/changelog" />);

    expect(screen.getByRole('link', { name: '关于' }).getAttribute('href')).toBe('/zh/about');
    const changelogLink = screen.getByRole('link', { name: '更新记录' });

    expect(changelogLink.getAttribute('href')).toBe('/zh/changelog');
    expect(changelogLink.getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('navigation', { name: '支持页面导航' })).toBeDefined();
  });
});
