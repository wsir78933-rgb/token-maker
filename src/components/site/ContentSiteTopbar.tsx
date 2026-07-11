'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { SiteMark } from '@/components/site/SiteMark';
import { TrackedEditorLink } from '@/components/site/TrackedEditorLink';
import { cn } from '@/lib/utils';

export interface ContentSiteTopbarLink {
  href: string;
  label: string;
  isActive: boolean;
}

interface ContentSiteTopbarProps {
  brandHref: string;
  brandName: string;
  brandSubtitle: string;
  localeSwitchHref: string;
  localeSwitchLabel: string;
  navLinks: ContentSiteTopbarLink[];
  contentClassName: string;
  navClassName: string;
  topbarClassName: string;
  brandTitleClassName?: string;
  showBackIcon?: boolean;
  siteMarkClassName?: string;
}

export function ContentSiteTopbar({
  brandHref,
  brandName,
  brandSubtitle,
  localeSwitchHref,
  localeSwitchLabel,
  navLinks,
  contentClassName,
  navClassName,
  topbarClassName,
  brandTitleClassName,
  showBackIcon = false,
  siteMarkClassName,
}: ContentSiteTopbarProps) {
  return (
    <div
      className={cn('site-topbar', topbarClassName)}
      data-scroll-hidden="false"
    >
      <div className={contentClassName}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TrackedEditorLink
            href={brandHref}
            prefetch={false}
            className="site-brand-link inline-flex items-center gap-3 text-sm transition-colors"
          >
            {showBackIcon ? <ChevronLeft className="h-4 w-4" /> : null}
            <SiteMark className={siteMarkClassName} />
            <span className="flex flex-col">
              <span className={cn('site-brand-title font-semibold', brandTitleClassName)}>{brandName}</span>
              <span className="site-brand-subtitle text-xs">{brandSubtitle}</span>
            </span>
          </TrackedEditorLink>

          <div className="flex items-center">
            <Link href={localeSwitchHref} prefetch={false} className="site-switch-chip">
              {localeSwitchLabel}
            </Link>
          </div>
        </div>

        <nav className={navClassName}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={false}
              data-active={link.isActive}
              className="site-nav-pill inline-flex shrink-0 items-center"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
