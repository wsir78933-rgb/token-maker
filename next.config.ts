import type { NextConfig } from 'next';

const legacyBlogSlugs = [
  'how-to-make-foundry-vtt-tokens',
  'how-to-make-roll20-tokens',
  'how-to-make-vtt-tokens',
  'token-size-and-resolution',
];

const staticPublicContentSecurityPolicyHeader = {
  key: 'Content-Security-Policy',
  value:
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self'; connect-src 'self' https:; frame-src https:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
};

const googleFontContentSecurityPolicyHeader = {
  key: 'Content-Security-Policy',
  value:
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https:; frame-src https:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
};

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
    return [
      { source: '/(.*)', headers: securityHeaders },
      {
        source:
          '/((?!api$|api/|_next$|_next/|share$|share/|zh/share$|zh/share/|scroll-creator$|scroll-creator/|zh/scroll-creator$|zh/scroll-creator/|notice-board-creator$|notice-board-creator/|zh/notice-board-creator$|zh/notice-board-creator/|.*\\/opengraph-image$|.*\\/opengraph-image/|opengraph-image$|opengraph-image/|' +
          '.*\\.[aA][vV][iI][fF]$|.*\\.[bB][mM][pP]$|.*\\.[cC][sS][sS]$|.*\\.[gG][iI][fF]$|.*\\.[iI][cC][oO]$|.*\\.[jJ][pP][gG]$|.*\\.[jJ][pP][eE][gG]$|.*\\.[jJ][sS]$|.*\\.[mM][aA][pP]$|.*\\.[mM][jJ][sS]$|.*\\.[oO][tT][fF]$|.*\\.[pP][nN][gG]$|.*\\.[sS][vV][gG]$|.*\\.[tT][tT][fF]$|.*\\.[tT][xX][tT]$|.*\\.[wW][eE][bB][mM][aA][nN][iI][fF][eE][sS][tT]$|.*\\.[wW][eE][bB][pP]$|.*\\.[wW][oO][fF][fF]$|.*\\.[wW][oO][fF][fF]2$|.*\\.[xX][mM][lL]$)[\\s\\S]{0,})',
        headers: [staticPublicContentSecurityPolicyHeader],
      },
      {
        source: '/scroll-creator',
        headers: [googleFontContentSecurityPolicyHeader],
      },
      {
        source: '/zh/scroll-creator',
        headers: [googleFontContentSecurityPolicyHeader],
      },
      {
        source: '/notice-board-creator',
        headers: [googleFontContentSecurityPolicyHeader],
      },
      {
        source: '/zh/notice-board-creator',
        headers: [googleFontContentSecurityPolicyHeader],
      },
    ];
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
