import Link from 'next/link';
import { ArrowRight, CircleHelp, ShieldCheck } from 'lucide-react';

import { getLocalizedPath, stripLocalePrefix, type SiteLocale } from '@/lib/site-locale';
import { cn } from '@/lib/utils';

const copyByLocale = {
  en: {
    eyebrow: 'Help',
    links: [
      {
        href: '/faq',
        label: 'FAQ',
        icon: CircleHelp,
      },
      {
        href: '/privacy',
        label: 'Privacy',
        icon: ShieldCheck,
      },
    ],
  },
  zh: {
    eyebrow: '更多说明',
    links: [
      {
        href: '/faq',
        label: '常见问题',
        icon: CircleHelp,
      },
      {
        href: '/privacy',
        label: '隐私',
        icon: ShieldCheck,
      },
    ],
  },
} as const;

interface SiteSupportStripProps {
  locale: SiteLocale;
  currentPath?: string;
  className?: string;
}

export function SiteSupportStrip({ locale, currentPath, className }: SiteSupportStripProps) {
  const copy = copyByLocale[locale];
  const normalizedCurrentPath = currentPath ? stripLocalePrefix(currentPath) : undefined;

  return (
    <section className={cn('mx-auto max-w-6xl px-6 py-6 lg:px-8 lg:py-7', className)}>
      <div className="border-t border-white/10 pt-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-[11px] uppercase tracking-[0.34em] text-stone-500">{copy.eyebrow}</p>

          <div className="grid gap-2 md:grid-cols-2 md:gap-3">
          {copy.links.map((link) => {
            const Icon = link.icon;
            const href = getLocalizedPath(locale, link.href);
            const isActive = normalizedCurrentPath === link.href;

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'group min-w-0 rounded-[18px] border px-4 py-3 transition hover:border-white/20 hover:bg-white/[0.04]',
                  isActive
                    ? 'border-[#d7b46a]/35 bg-[#d7b46a]/10'
                    : 'border-white/10 bg-black/20',
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border',
                      isActive
                        ? 'border-[#d7b46a]/30 bg-[#d7b46a]/12 text-[#f1d492]'
                        : 'border-white/10 bg-white/[0.04] text-stone-300',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>

                  <p className="min-w-0 flex-1 text-sm font-medium text-stone-50">{link.label}</p>
                  <ArrowRight className="h-4 w-4 shrink-0 text-stone-500 transition group-hover:text-stone-200" />
                </div>
              </Link>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}
