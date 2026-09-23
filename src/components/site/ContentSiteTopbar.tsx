import Link from 'next/link';
import type { ReactElement } from 'react';
import { ChevronLeft } from 'lucide-react';
import { SiteMark } from '@/components/site/SiteMark';
import { ContentSiteTopbarFeatureMenu } from '@/components/site/ContentSiteTopbarFeatureMenu';
import { ContentSiteTopbarMobileMenu } from '@/components/site/ContentSiteTopbarMobileMenu';
import { TrackedEditorLink } from '@/components/site/TrackedEditorLink';
import {
  assertContentSiteTopbarModel,
  type ContentSiteTopbarModel,
} from '@/lib/content-site-navigation';
import { cn } from '@/lib/utils';

interface ContentSiteTopbarProps {
  brandHref: string;
  brandName: string;
  brandSubtitle: string;
  model: ContentSiteTopbarModel;
  contentClassName: string;
  topbarClassName: string;
  brandTitleClassName?: string;
  showBackIcon?: boolean;
  siteMarkClassName?: string;
}

function assertContentSiteTopbarBrandField(fieldName: string, fieldValue: unknown): void {
  if (typeof fieldValue !== 'string' || fieldValue.trim() === '') {
    throw new Error(
      `ContentSiteTopbar: ${fieldName} must be a non-empty string. Received ${JSON.stringify(fieldValue)}.`,
    );
  }
}

function assertContentSiteTopbarBrand(brandHref: string, brandName: string, brandSubtitle: string): void {
  assertContentSiteTopbarBrandField('brandHref', brandHref);
  assertContentSiteTopbarBrandField('brandName', brandName);
  assertContentSiteTopbarBrandField('brandSubtitle', brandSubtitle);
}

function ContentSiteTopbarBrand({
  brandHref,
  brandName,
  brandSubtitle,
  brandTitleClassName,
  showBackIcon = false,
  siteMarkClassName,
}: {
  brandHref: string;
  brandName: string;
  brandSubtitle: string;
  brandTitleClassName?: string;
  showBackIcon?: boolean;
  siteMarkClassName?: string;
}): ReactElement {
  return (
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
  );
}

function ContentSiteTopbarPlainLinks({
  links,
}: {
  links: ContentSiteTopbarModel['links'];
}): ReactElement {
  return (
    <>
      {links.map((link) => (
        <Link
          key={`${link.href}-${link.label}`}
          href={link.href}
          prefetch={false}
          data-active={link.isActive}
          className="inline-flex h-10 shrink-0 items-center rounded-md px-3 text-sm font-medium text-[var(--site-ink-strong)] transition-colors hover:bg-[color-mix(in_oklab,var(--site-panel)_78%,white_10%)] data-[active=true]:bg-[var(--site-accent-bg)] data-[active=true]:text-[var(--site-accent-strong)]"
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}

function ContentSiteTopbarDesktopActions({
  localeSwitch,
  primaryAction,
}: {
  localeSwitch: ContentSiteTopbarModel['localeSwitch'];
  primaryAction: ContentSiteTopbarModel['primaryAction'];
}): ReactElement {
  return (
    <div className="hidden items-center gap-2 lg:flex">
      <Link href={localeSwitch.href} prefetch={false} className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--site-border-soft)] bg-transparent px-4 text-sm font-medium text-[var(--site-ink-strong)] transition-colors hover:bg-[color-mix(in_oklab,var(--site-panel)_78%,white_10%)]">
        {localeSwitch.label}
      </Link>
      <TrackedEditorLink href={primaryAction.href} prefetch={false} className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--site-border-strong)] bg-[var(--site-accent-bg)] px-4 text-sm font-medium text-[var(--site-accent-strong)] transition-colors hover:bg-[color-mix(in_oklab,var(--site-accent-bg)_80%,white_12%)]">
        {primaryAction.label}
      </TrackedEditorLink>
    </div>
  );
}

export function ContentSiteTopbar({
  brandHref,
  brandName,
  brandSubtitle,
  model,
  contentClassName,
  topbarClassName,
  brandTitleClassName,
  showBackIcon = false,
  siteMarkClassName,
}: ContentSiteTopbarProps): ReactElement {
  assertContentSiteTopbarModel(model);
  assertContentSiteTopbarBrand(brandHref, brandName, brandSubtitle);

  return (
    <div className={cn('site-topbar', topbarClassName)} data-scroll-hidden="false">
      <div className={contentClassName}>
        <nav
          aria-label={model.navigationLabel}
          className="mt-0 flex w-full flex-wrap items-center justify-between gap-3"
        >
          <ContentSiteTopbarBrand
            brandHref={brandHref}
            brandName={brandName}
            brandSubtitle={brandSubtitle}
            brandTitleClassName={brandTitleClassName}
            showBackIcon={showBackIcon}
            siteMarkClassName={siteMarkClassName}
          />
          <div className="hidden min-w-0 items-center lg:flex">
            <ContentSiteTopbarPlainLinks links={model.links} />
            <ContentSiteTopbarFeatureMenu
              featureMenuLabel={model.featureMenuLabel}
              featureMenuHref={model.featureMenuHref}
              featureMenuIsActive={model.featureMenuIsActive}
              featureMenuAccessibleName={model.featureMenuAccessibleName}
              features={model.features}
            />
          </div>
          <div className="flex items-center gap-2">
            <ContentSiteTopbarDesktopActions
              localeSwitch={model.localeSwitch}
              primaryAction={model.primaryAction}
            />
            <ContentSiteTopbarMobileMenu model={model} brandHref={brandHref} brandName={brandName} />
          </div>
        </nav>
      </div>
    </div>
  );
}
