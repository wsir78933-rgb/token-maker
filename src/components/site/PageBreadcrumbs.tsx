import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { getSiteUiCopy } from '@/lib/site-content';
import type { SiteLocale } from '@/lib/site-locale';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function PageBreadcrumbs({
  items,
  locale,
}: {
  items: BreadcrumbItem[];
  locale: SiteLocale;
}) {
  const siteUiCopy = getSiteUiCopy(locale);

  return (
    <nav aria-label={siteUiCopy.breadcrumbAriaLabel}>
      <ol className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.24em] text-stone-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} prefetch={false} className="transition-colors hover:text-stone-200">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-stone-300' : undefined}>{item.label}</span>
              )}
              {!isLast ? <ChevronRight className="h-3.5 w-3.5" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
