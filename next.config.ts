import type { NextConfig } from 'next';

const legacyBlogSlugs = [
  'how-to-make-foundry-vtt-tokens',
  'how-to-make-roll20-tokens',
  'how-to-make-vtt-tokens',
  'token-size-and-resolution',
];

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
  async redirects() {
    return [
      ...legacyBlogSlugs.map((slug) => ({
        source: `/blog/${slug}`,
        destination: '/blog',
        permanent: true,
      })),
      ...legacyBlogSlugs.map((slug) => ({
        source: `/zh/blog/${slug}`,
        destination: '/zh/blog',
        permanent: true,
      })),
      {
        source: '/dice-roller',
        destination: '/dice-roller-dnd',
        permanent: true,
      },
      {
        source: '/zh/dice-roller',
        destination: '/zh/dice-roller-dnd',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
