'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useRef, useState, type FocusEvent } from 'react';
import { SiteMark } from '@/components/site/SiteMark';
import { TrackedEditorLink } from '@/components/site/TrackedEditorLink';
import { cn } from '@/lib/utils';

const desktopNavigationMinWidth = 768;
const topVisibleScrollY = 8;
const scrollDirectionThreshold = 8;

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

function getCurrentScrollY() {
  return Math.max(window.scrollY, 0);
}

function isDesktopNavigationViewport() {
  return window.innerWidth >= desktopNavigationMinWidth;
}

function shouldIgnoreScrollDelta(scrollDelta: number) {
  return Math.abs(scrollDelta) < scrollDirectionThreshold;
}

function useDesktopScrollHiddenTopbar() {
  const [isScrollHidden, setIsScrollHidden] = useState(false);
  const previousScrollYRef = useRef(0);

  useEffect(() => {
    const updateTopbarVisibility = () => {
      const currentScrollY = getCurrentScrollY();

      if (!isDesktopNavigationViewport() || currentScrollY <= topVisibleScrollY) {
        previousScrollYRef.current = currentScrollY;
        setIsScrollHidden(false);
        return;
      }

      const scrollDelta = currentScrollY - previousScrollYRef.current;

      if (shouldIgnoreScrollDelta(scrollDelta)) {
        return;
      }

      previousScrollYRef.current = currentScrollY;
      setIsScrollHidden(scrollDelta > 0);
    };

    previousScrollYRef.current = getCurrentScrollY();
    updateTopbarVisibility();

    window.addEventListener('scroll', updateTopbarVisibility, { passive: true });
    window.addEventListener('resize', updateTopbarVisibility);

    return () => {
      window.removeEventListener('scroll', updateTopbarVisibility);
      window.removeEventListener('resize', updateTopbarVisibility);
    };
  }, []);

  return isScrollHidden;
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
  const isScrollHidden = useDesktopScrollHiddenTopbar();
  const [hasTopbarFocus, setHasTopbarFocus] = useState(false);
  const isTopbarHidden = isScrollHidden && !hasTopbarFocus;

  const handleTopbarBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextFocusedElement = event.relatedTarget;

    if (nextFocusedElement instanceof Node && event.currentTarget.contains(nextFocusedElement)) {
      return;
    }

    setHasTopbarFocus(false);
  };

  return (
    <div
      className={cn(
        'site-topbar transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none',
        isTopbarHidden && 'md:-translate-y-full',
        topbarClassName,
      )}
      data-scroll-hidden={isTopbarHidden ? 'true' : 'false'}
      onBlurCapture={handleTopbarBlur}
      onFocusCapture={() => setHasTopbarFocus(true)}
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
