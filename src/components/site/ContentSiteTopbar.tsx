import Link from 'next/link';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import { SiteMark } from '@/components/site/SiteMark';
import { TrackedEditorLink } from '@/components/site/TrackedEditorLink';
import { cn } from '@/lib/utils';

export interface ContentSiteTopbarDropdownLink {
  href: string;
  label: string;
}

export interface ContentSiteTopbarLink {
  href: string;
  label: string;
  isActive: boolean;
  dropdownLinks?: ContentSiteTopbarDropdownLink[];
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
          {navLinks.map((link) => {
            const hasDropdown = Boolean(link.dropdownLinks?.length);

            return (
              <div key={link.href} className="site-nav-item">
                <Link
                  href={link.href}
                  prefetch={false}
                  data-active={link.isActive}
                  aria-haspopup={hasDropdown ? 'menu' : undefined}
                  className="site-nav-pill inline-flex shrink-0 items-center"
                >
                  {link.label}
                  {hasDropdown ? <ChevronDown aria-hidden="true" className="h-3.5 w-3.5" /> : null}
                </Link>

                {hasDropdown ? (
                  <div
                    aria-label={`${link.label} category menu`}
                    className="site-nav-dropdown"
                    data-nav-dropdown={link.href}
                    role="menu"
                  >
                    <div className="site-nav-dropdown__panel">
                      {link.dropdownLinks?.map((dropdownLink) => (
                        <Link
                          key={dropdownLink.href}
                          href={dropdownLink.href}
                          prefetch={false}
                          className="site-nav-dropdown__link"
                          role="menuitem"
                        >
                          {dropdownLink.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
