'use client';

import { useCallback, useEffect, useId, useState, type JSX, type MouseEvent } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { TrackedEditorLink } from '@/components/site/TrackedEditorLink';
import type { ContentSiteTopbarModel } from '@/lib/content-site-navigation';

function anchorWasClicked(eventTarget: EventTarget | null): boolean {
  return eventTarget instanceof Element && eventTarget.closest('a') !== null;
}

function closeMenuIfAnchorClicked(event: MouseEvent<HTMLElement>, closeMenu: () => void) {
  if (!anchorWasClicked(event.target)) {
    return;
  }

  closeMenu();
}

function useCloseMenuOnEscape(menuOpen: boolean, closeMenu: () => void) {
  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') {
        return;
      }

      closeMenu();
    }

    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [menuOpen, closeMenu]);
}

function MobileMenuTrigger(props: {
  menuOpen: boolean;
  panelId: string;
  openMenuLabel: string;
  closeMenuLabel: string;
  onToggle: () => void;
}) {
  const { menuOpen, panelId, openMenuLabel, closeMenuLabel, onToggle } = props;

  return (
    <button
      type="button"
      className="inline-flex size-10 items-center justify-center rounded-lg border border-[var(--site-border-soft)] bg-transparent text-[var(--site-ink-strong)] lg:hidden"
      aria-label={menuOpen ? closeMenuLabel : openMenuLabel}
      aria-expanded={menuOpen}
      aria-controls={menuOpen ? panelId : undefined}
      onClick={onToggle}
    >
      <Menu aria-hidden="true" />
    </button>
  );
}

function MobileMenuBackdrop(props: { closeMenuLabel: string; onClose: () => void }) {
  const { closeMenuLabel, onClose } = props;

  return (
    <button
      type="button"
      aria-label={closeMenuLabel}
      className="fixed inset-0 z-[60] bg-black/50 lg:hidden"
      onClick={onClose}
    />
  );
}

function MobileFeatureHubLink(props: {
  featureMenuLabel: string;
  featureMenuHref: string;
  featureMenuIsActive: boolean;
}) {
  const { featureMenuLabel, featureMenuHref, featureMenuIsActive } = props;

  return (
    <Link
      href={featureMenuHref}
      prefetch={false}
      className="inline-flex h-10 items-center rounded-md px-3 text-sm font-medium text-[var(--site-ink-strong)] transition-colors hover:bg-[color-mix(in_oklab,var(--site-panel)_78%,white_10%)] data-[active=true]:bg-[var(--site-accent-bg)] data-[active=true]:text-[var(--site-accent-strong)]"
      data-active={featureMenuIsActive}
    >
      {featureMenuLabel}
    </Link>
  );
}

function MobileFeatureList(props: {
  featureMenuAccessibleName: string;
  features: ContentSiteTopbarModel['features'];
}) {
  const { featureMenuAccessibleName, features } = props;

  return (
    <Accordion>
      <AccordionItem value={featureMenuAccessibleName}>
        <AccordionTrigger>{featureMenuAccessibleName}</AccordionTrigger>
        <AccordionContent>
          <ul className="flex flex-col">
            {features.map((feature) => (
              <li key={`${feature.href}-${feature.title}`}>
                <Link
                  href={feature.href}
                  prefetch={false}
                  aria-label={feature.title}
                  className="flex flex-col"
                >
                  <span>{feature.title}</span>
                  <span className="site-nav-dropdown__description">{feature.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function MobilePlainLinks(props: { links: ContentSiteTopbarModel['links'] }) {
  return (
    <ul className="flex flex-col items-start gap-2">
      {props.links.map((link) => (
        <li key={`${link.href}-${link.label}`}>
          <Link
            href={link.href}
            prefetch={false}
            className="inline-flex h-10 items-center rounded-md px-3 text-sm font-medium text-[var(--site-ink-strong)] transition-colors hover:bg-[color-mix(in_oklab,var(--site-panel)_78%,white_10%)] data-[active=true]:bg-[var(--site-accent-bg)] data-[active=true]:text-[var(--site-accent-strong)]"
            data-active={link.isActive}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function MobileMenuActions(props: {
  localeSwitch: ContentSiteTopbarModel['localeSwitch'];
  primaryAction: ContentSiteTopbarModel['primaryAction'];
}) {
  const { localeSwitch, primaryAction } = props;

  return (
    <div className="flex flex-col items-start gap-2">
      <Link href={localeSwitch.href} prefetch={false} className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-[var(--site-border-soft)] bg-transparent px-4 text-sm font-medium text-[var(--site-ink-strong)] transition-colors hover:bg-[color-mix(in_oklab,var(--site-panel)_78%,white_10%)]">
        {localeSwitch.label}
      </Link>
      <TrackedEditorLink href={primaryAction.href} prefetch={false} className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-[var(--site-border-strong)] bg-[var(--site-accent-bg)] px-4 text-sm font-medium text-[var(--site-accent-strong)] transition-colors hover:bg-[color-mix(in_oklab,var(--site-accent-bg)_80%,white_12%)]">
        {primaryAction.label}
      </TrackedEditorLink>
    </div>
  );
}

function MobileMenuPanel(props: {
  panelId: string;
  titleId: string;
  model: ContentSiteTopbarModel;
  brandHref: string;
  brandName: string;
  onClose: () => void;
}) {
  const { panelId, titleId, model, brandHref, brandName, onClose } = props;

  return (
    <div
      id={panelId}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-x-0 top-0 z-[70] max-h-screen overflow-auto border-b border-[var(--site-border-soft)] bg-[var(--popover)] text-[var(--popover-foreground)] lg:hidden"
      onClick={(event) => closeMenuIfAnchorClicked(event, onClose)}
    >
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between gap-3">
          <TrackedEditorLink
            id={titleId}
            href={brandHref}
            prefetch={false}
            className="site-brand-link text-sm font-semibold"
          >
            {brandName}
          </TrackedEditorLink>
          <button
            type="button"
            aria-label={model.closeMenuLabel}
            className="inline-flex size-10 items-center justify-center rounded-lg border border-[var(--site-border-soft)]"
            onClick={onClose}
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>
        <p className="sr-only">{model.menuDescription}</p>
        <MobileFeatureHubLink
          featureMenuLabel={model.featureMenuLabel}
          featureMenuHref={model.featureMenuHref}
          featureMenuIsActive={model.featureMenuIsActive}
        />
        <MobileFeatureList
          featureMenuAccessibleName={model.featureMenuAccessibleName}
          features={model.features}
        />
        <MobilePlainLinks links={model.links} />
        <MobileMenuActions localeSwitch={model.localeSwitch} primaryAction={model.primaryAction} />
      </div>
    </div>
  );
}

export function ContentSiteTopbarMobileMenu(props: {
  model: ContentSiteTopbarModel;
  brandHref: string;
  brandName: string;
}): JSX.Element {
  const { model, brandHref, brandName } = props;
  const [menuOpen, setMenuOpen] = useState(false);
  const panelId = useId();
  const titleId = useId();
  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);
  useCloseMenuOnEscape(menuOpen, closeMenu);

  return (
    <>
      <MobileMenuTrigger
        menuOpen={menuOpen}
        panelId={panelId}
        openMenuLabel={model.openMenuLabel}
        closeMenuLabel={model.closeMenuLabel}
        onToggle={() => setMenuOpen((currentlyOpen) => !currentlyOpen)}
      />
      {menuOpen ? (
        <>
          <MobileMenuBackdrop closeMenuLabel={model.closeMenuLabel} onClose={closeMenu} />
          <MobileMenuPanel
            panelId={panelId}
            titleId={titleId}
            model={model}
            brandHref={brandHref}
            brandName={brandName}
            onClose={closeMenu}
          />
        </>
      ) : null}
    </>
  );
}
