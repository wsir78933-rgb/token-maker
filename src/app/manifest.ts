import type { MetadataRoute } from 'next';
import { getSiteManifestCopy } from '@/lib/site-content';

export default function manifest(): MetadataRoute.Manifest {
  const manifestCopy = getSiteManifestCopy();

  return {
    name: 'Token Maker',
    short_name: 'Token Maker',
    description: manifestCopy.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#09090b',
    icons: [
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
