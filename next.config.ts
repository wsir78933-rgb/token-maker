import type { NextConfig } from 'next';

const legacyBlogSlugs = [
  'how-to-make-foundry-vtt-tokens',
  'how-to-make-roll20-tokens',
  'how-to-make-vtt-tokens',
  'token-size-and-resolution',
];

const nextConfig: NextConfig = {
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
    ];
  },
};

export default nextConfig;
