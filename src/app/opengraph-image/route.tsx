import { getSiteConfig } from '@/lib/site-content';
import { createSeoImage } from '@/lib/site-og-image';

const locale = 'en';
const siteConfig = getSiteConfig(locale);

export function GET() {
  return createSeoImage({
    locale,
    eyebrow: 'VTT token maker',
    title: 'Token Maker',
    description: siteConfig.description,
    chips: ['DnD tokens', 'Roll20 ready', 'Foundry VTT'],
  });
}
