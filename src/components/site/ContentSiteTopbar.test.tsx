// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ContentSiteTopbar } from './ContentSiteTopbar';

describe('ContentSiteTopbar', () => {
  it('exposes Blog category links as an accessible dropdown menu', () => {
    render(
      <ContentSiteTopbar
        brandHref="/"
        brandName="Token Maker"
        brandSubtitle="Back to the editor"
        localeSwitchHref="/zh"
        localeSwitchLabel="中文"
        contentClassName="content"
        navClassName="navigation"
        topbarClassName="topbar"
        navLinks={[
          { href: '/', label: 'Editor', isActive: false },
          {
            href: '/blog',
            label: 'Blog',
            isActive: true,
            dropdownLinks: [
              { href: '/blog/category/characters', label: 'Characters' },
              { href: '/blog/category/spells', label: 'Spells' },
            ],
          },
        ]}
      />,
    );

    expect(screen.getByRole('link', { name: 'Blog' }).getAttribute('aria-haspopup')).toBe('menu');
    expect(screen.getByRole('menu', { name: 'Blog category menu' })).not.toBeNull();
    const charactersMenuitem = screen.getByRole('menuitem', { name: 'Characters' });
    expect(charactersMenuitem.classList.contains('site-nav-dropdown__link')).toBe(true);
    expect(charactersMenuitem.classList.contains('site-category-pill')).toBe(false);
    expect(screen.getByRole('menuitem', { name: 'Characters' }).getAttribute('href')).toBe(
      '/blog/category/characters',
    );
    expect(screen.getByRole('menuitem', { name: 'Spells' }).getAttribute('href')).toBe('/blog/category/spells');
    expect(screen.getByRole('link', { name: 'Editor' }).getAttribute('aria-haspopup')).toBeNull();
  });
});
