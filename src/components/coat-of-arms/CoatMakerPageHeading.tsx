import { useId } from 'react';

import { getCoatMakerSeoCopy } from '@/components/coat-of-arms/coat-maker-seo-copy';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

type CoatMakerHeroImage = {
  src: string;
  alt: string;
};

type CoatMakerHeroHeadingLines = readonly [string, string, string];

type CoatMakerHeroAction = {
  label: string;
  href: string;
};

type CoatMakerSeoCopy = ReturnType<typeof getCoatMakerSeoCopy>;

const coatMakerHeroImageSources = [
  '/coat-of-arms-maker/hero/hero-crimson-lion.webp',
  '/coat-of-arms-maker/hero/hero-azure-stag.webp',
  '/coat-of-arms-maker/hero/hero-verdant-phoenix.webp',
] as const;

const coatMakerHeroImageAlts = {
  en: [
    'Crimson lion coat of arms on a dark textured ground',
    'Azure stag coat of arms on a dark textured ground',
    'Verdant phoenix coat of arms on a dark textured ground',
  ],
  zh: ['深色纹理底上的绛红狮纹章', '深色纹理底上的蔚蓝鹿纹章', '深色纹理底上的翠绿凤凰纹章'],
} satisfies Record<SiteLocale, readonly [string, string, string]>;

const coatMakerHeroCardClassNames = [
  'coat-maker-page-heading-card--left',
  'coat-maker-page-heading-card--center',
  'coat-maker-page-heading-card--right',
] as const;

function requireNonEmptyHeroText(value: unknown, fieldName: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Cannot render Coat Maker hero: ${fieldName}="${String(value)}" is empty`);
  }

  return value;
}

function splitCoatMakerHeadingIntoLines(heading: string, locale: SiteLocale): CoatMakerHeroHeadingLines {
  requireNonEmptyHeroText(heading, 'copy.heading');

  const headingSeparator = heading.includes('：') ? '：' : ':';
  const separatorIndex = heading.indexOf(headingSeparator);

  if (separatorIndex < 0) {
    throw new Error(`Cannot render Coat Maker hero: copy.heading="${heading}" has no title separator`);
  }

  const firstHeadingLine = heading.slice(0, separatorIndex + 1);
  const secondHeadingLine = heading.slice(separatorIndex + 1);
  const emphasizedHeadingText = locale === 'en' ? 'Guild Badges' : '公会徽章';
  const emphasisStartIndex = secondHeadingLine.lastIndexOf(emphasizedHeadingText);

  requireNonEmptyHeroText(firstHeadingLine, 'copy.heading first line');
  if (emphasisStartIndex < 0) {
    throw new Error(
      `Cannot render Coat Maker hero: copy.heading="${heading}" is missing emphasis text="${emphasizedHeadingText}" for locale="${locale}"`,
    );
  }

  const secondHeadingPrefix = secondHeadingLine.slice(0, emphasisStartIndex);
  const emphasizedHeadingSuffix = secondHeadingLine.slice(emphasisStartIndex);

  requireNonEmptyHeroText(secondHeadingPrefix, 'copy.heading second line prefix');
  requireNonEmptyHeroText(emphasizedHeadingSuffix, 'copy.heading emphasized suffix');

  return [firstHeadingLine, secondHeadingPrefix.trim(), emphasizedHeadingSuffix];
}

function getCoatMakerHeroImages(locale: SiteLocale): CoatMakerHeroImage[] {
  const localizedAltTexts = coatMakerHeroImageAlts[locale];

  if (!localizedAltTexts) {
    throw new Error(`Cannot render Coat Maker hero: no image alt text for locale="${locale}"`);
  }

  return coatMakerHeroImageSources.map((sourcePath, imageIndex) => {
    const altText = localizedAltTexts[imageIndex];

    if (typeof altText !== 'string' || altText.trim().length === 0) {
      throw new Error(
        `Cannot render Coat Maker hero: image alt text at index ${imageIndex}="${String(altText)}" is empty for locale="${locale}"`,
      );
    }

    return { src: sourcePath, alt: altText };
  });
}

function getCoatMakerHeroActions(copy: CoatMakerSeoCopy, locale: SiteLocale): {
  primary: CoatMakerHeroAction;
  secondary: CoatMakerHeroAction;
} {
  const primaryLabel = requireNonEmptyHeroText(copy.editorCtaLabel, 'copy.editorCtaLabel');
  const secondaryLink = copy.contextualLinks.find((contextualLink) => contextualLink.href === '/faq');

  if (!secondaryLink) {
    throw new Error(`Cannot render Coat Maker hero: FAQ CTA path is missing for locale="${locale}"`);
  }

  const secondaryLabel = requireNonEmptyHeroText(secondaryLink.label, 'copy.contextualLinks FAQ label');
  const secondaryPath = requireNonEmptyHeroText(secondaryLink.href, 'copy.contextualLinks FAQ path');

  return {
    primary: {
      label: primaryLabel,
      href: '#coat-editor-workspace',
    },
    secondary: {
      label: secondaryLabel,
      href: getLocalizedPath(locale, secondaryPath),
    },
  };
}

function getCoatMakerHeroCardClassName(imageIndex: number): string {
  const cardClassName = coatMakerHeroCardClassNames[imageIndex];

  if (!cardClassName) {
    throw new Error(`Cannot render Coat Maker hero: image index=${imageIndex} has no card layout`);
  }

  return `coat-maker-page-heading-card ${cardClassName}`;
}

function CoatMakerHeroActionLink({ action, variant }: { action: CoatMakerHeroAction; variant: 'primary' | 'secondary' }) {
  return (
    <a
      href={action.href}
      aria-label={action.label}
      className={`coat-maker-page-heading-action coat-maker-page-heading-action--${variant}`}
    >
      {action.label}
    </a>
  );
}

function CoatMakerHeroImageFan({ images, accessibleLabel }: { images: readonly CoatMakerHeroImage[]; accessibleLabel: string }) {
  return (
    <div className="coat-maker-page-heading-fan" role="group" aria-label={accessibleLabel}>
      {images.map((image, imageIndex) => (
        <div key={image.src} className={getCoatMakerHeroCardClassName(imageIndex)}>
          <img
            src={image.src}
            alt={image.alt}
            width={800}
            height={1000}
            loading={imageIndex === 1 ? 'eager' : 'lazy'}
            decoding="async"
          />
        </div>
      ))}
    </div>
  );
}

export function CoatMakerPageHeading({ locale }: { locale: SiteLocale }) {
  const titleId = useId();
  const descriptionId = useId();
  const copy = getCoatMakerSeoCopy(locale);
  const headingLines = splitCoatMakerHeadingIntoLines(copy.heading, locale);
  const heroImages = getCoatMakerHeroImages(locale);
  const heroActions = getCoatMakerHeroActions(copy, locale);

  return (
    <header
      data-testid="coat-maker-page-heading"
      className="coat-maker-page-heading"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div className="coat-maker-page-heading-inner">
        <div className="coat-maker-page-heading-copy">
          <h1 id={titleId} aria-label={copy.heading}>
            <span className="coat-maker-page-heading-title-line">{headingLines[0]}</span>
            <span className="coat-maker-page-heading-title-line">
              {locale === 'en' ? ' ' : null}
              {headingLines[1]}
              {locale === 'en' ? ' ' : null}
              <span className="coat-maker-page-heading-title-emphasis">{headingLines[2]}</span>
            </span>
          </h1>
          <p id={descriptionId} className="coat-maker-page-heading-description">
            {copy.introduction}
          </p>
        </div>

        <div className="coat-maker-page-heading-actions">
          <CoatMakerHeroActionLink action={heroActions.primary} variant="primary" />
          <CoatMakerHeroActionLink action={heroActions.secondary} variant="secondary" />
        </div>

        <p className="coat-maker-page-heading-support">{copy.editorCtaDescription}</p>
        <CoatMakerHeroImageFan images={heroImages} accessibleLabel={copy.heading} />
      </div>
    </header>
  );
}
