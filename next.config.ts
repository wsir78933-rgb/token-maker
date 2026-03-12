import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/guides/opengraph-image',
        destination: '/blog/opengraph-image',
        permanent: true,
      },
      {
        source: '/guides/:slug/opengraph-image',
        destination: '/blog/:slug/opengraph-image',
        permanent: true,
      },
      {
        source: '/guides/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
      {
        source: '/guides',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/zh/guides/opengraph-image',
        destination: '/zh/blog/opengraph-image',
        permanent: true,
      },
      {
        source: '/zh/guides/:slug/opengraph-image',
        destination: '/zh/blog/:slug/opengraph-image',
        permanent: true,
      },
      {
        source: '/zh/guides/:slug',
        destination: '/zh/blog/:slug',
        permanent: true,
      },
      {
        source: '/zh/guides',
        destination: '/zh/blog',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
