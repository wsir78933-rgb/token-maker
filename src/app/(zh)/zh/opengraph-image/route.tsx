import { getSiteConfig, getSiteUiCopy } from '@/lib/site-content';
import { createSeoImage } from '@/lib/site-og-image';

const locale = 'zh';
const siteConfig = getSiteConfig(locale);
const siteUiCopy = getSiteUiCopy(locale);

export function GET() {
  return createSeoImage({
    locale,
    eyebrow: 'VTT Token 制作器',
    title: 'Token Maker',
    description: siteConfig.description,
    footerKicker: siteUiCopy.ogFooterKicker,
    footerMeta: siteUiCopy.ogFooterMeta,
    chips: ['DnD Token', 'Roll20 可用', 'Foundry VTT'],
  });
}
