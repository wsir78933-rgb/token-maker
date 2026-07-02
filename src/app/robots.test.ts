import { describe, expect, it } from 'vitest';

import robots from './robots';

describe('robots metadata route', () => {
  it('allows public crawl paths while blocking API routes', () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      sitemap: 'https://www.tokenmaker.one/sitemap.xml',
    });
  });
});
