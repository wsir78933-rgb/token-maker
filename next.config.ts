import type { NextConfig } from 'next';

const legacyBlogSlugs = [
  'how-to-make-foundry-vtt-tokens',
  'how-to-make-roll20-tokens',
  'how-to-make-vtt-tokens',
  'token-size-and-resolution',
];

const isDev = process.env.NODE_ENV === 'development';

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com https://www.clarity.ms https://scripts.clarity.ms https://static.cloudflareinsights.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://r2.tokenmaker.one https://www.google-analytics.com https://www.googletagmanager.com https://c.clarity.ms",
  "font-src 'self'",
  "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://www.clarity.ms https://*.clarity.ms https://cloudflareinsights.com",
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
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
