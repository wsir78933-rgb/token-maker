// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { BlogHubPageView } from './BlogHubPageView';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const paginationHeroCases = [
  { locale: 'en' as const, featuredEyebrow: "Editor's Pick", pageLabelPrefix: 'Page' },
  { locale: 'zh' as const, featuredEyebrow: '编辑精选', pageLabelPrefix: '第' },
];

describe('blog pagination heroes', () => {
  afterEach(() => {
    cleanup();
  });

  it.each(paginationHeroCases)(
    'renders the featured article card on every $locale pagination page',
    ({ locale, featuredEyebrow }) => {
      for (const page of [2, 3, 4]) {
        render(<BlogHubPageView locale={locale} page={page} />);

        expect(screen.getByText(featuredEyebrow)).not.toBeNull();

        cleanup();
      }
    },
  );

  it.each(paginationHeroCases)(
    'keeps page labels out of the $locale hero header on every pagination page',
    ({ locale, pageLabelPrefix }) => {
      for (const page of [2, 3, 4]) {
        render(<BlogHubPageView locale={locale} page={page} />);

        const heroHeader = screen.getByRole('heading', { level: 1 }).closest('header');

        if (!heroHeader) {
          throw new Error('Expected the blog hub heading to be inside a hero header.');
        }

        expect(heroHeader.textContent).not.toMatch(new RegExp(`${pageLabelPrefix}\\s*${page}`));

        cleanup();
      }
    },
  );
});
