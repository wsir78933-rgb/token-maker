import { getSiteConfig, getSiteUiCopy } from '@/lib/site-content';
import { createSeoImage } from '@/lib/site-og-image';

const locale = 'en';
const siteConfig = getSiteConfig(locale);
const siteUiCopy = getSiteUiCopy(locale);

export function GET() {
  return createSeoImage({
    locale,
    eyebrow: 'VTT token maker',
    title: 'Token Maker',
    description: siteConfig.description,
    footerKicker: siteUiCopy.ogFooterKicker,
    footerMeta: siteUiCopy.ogFooterMeta,
    chips: ['DnD tokens', 'Roll20 ready', 'Foundry VTT'],
  });
}
