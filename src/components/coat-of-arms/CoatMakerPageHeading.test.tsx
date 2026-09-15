// @vitest-environment jsdom

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { metadata as englishCoatMakerMetadata } from '@/app/(maker-en)/coat-of-arms-maker/page';
import { metadata as chineseCoatMakerMetadata } from '@/app/(maker-zh)/zh/coat-of-arms-maker/page';
import { getLocalizedPath } from '@/lib/site-locale';

import { CoatMakerPageHeading } from './CoatMakerPageHeading';
import { getCoatMakerSeoCopy } from './coat-maker-seo-copy';

function cssDeclarationsForSelector(cssSource: string, selector: string): string[] {
  const collapsedCss = cssSource.replace(/\s+/g, ' ');
  const collapsedSelector = selector.replace(/\s+/g, ' ').trim();
  const rulePattern = /([^{}]+)\{([^{}]+)\}/g;

  for (const match of collapsedCss.matchAll(rulePattern)) {
    const selectorList = match[1].split(',').map((part) => part.trim());

    if (selectorList.includes(collapsedSelector)) {
      return match[2]
        .split(';')
        .map((declaration) => declaration.trim())
        .filter((declaration) => declaration.length > 0);
    }
  }

  throw new Error(`Missing CSS rule for selector: ${collapsedSelector}`);
}

function cssDeclarationValue(declarations: string[], propertyName: string): string {
  const matchedDeclaration = declarations.find((declaration) => {
    const separatorIndex = declaration.indexOf(':');
    return separatorIndex > 0 && declaration.slice(0, separatorIndex).trim() === propertyName;
  });

  if (!matchedDeclaration) {
    throw new Error(`Missing CSS property ${propertyName} in declarations: ${declarations.join('; ') || '(empty)'}`);
  }

  return matchedDeclaration.slice(matchedDeclaration.indexOf(':') + 1).trim();
}

function cssDeclarationsForSelectorWithinMediaQuery(
  cssSource: string,
  mediaQuery: string,
  selector: string,
): string[] {
  const collapsedCss = cssSource.replace(/\s+/g, ' ');
  const mediaQueryMarker = `@media (${mediaQuery})`;
  let searchStartIndex = 0;

  while (searchStartIndex < collapsedCss.length) {
    const mediaStartIndex = collapsedCss.indexOf(mediaQueryMarker, searchStartIndex);

    if (mediaStartIndex < 0) break;

    const openingBraceIndex = collapsedCss.indexOf('{', mediaStartIndex);

    if (openingBraceIndex < 0) {
      throw new Error(`Missing opening brace for CSS media query: ${mediaQuery}`);
    }

    let braceDepth = 0;
    let mediaEndIndex = -1;

    for (let sourceIndex = openingBraceIndex; sourceIndex < collapsedCss.length; sourceIndex += 1) {
      const sourceCharacter = collapsedCss[sourceIndex];

      if (sourceCharacter === '{') braceDepth += 1;
      if (sourceCharacter === '}') braceDepth -= 1;

      if (braceDepth === 0) {
        mediaEndIndex = sourceIndex;
        const mediaBody = collapsedCss.slice(openingBraceIndex + 1, sourceIndex);

        if (mediaBody.includes(`${selector} {`)) {
          return cssDeclarationsForSelector(mediaBody, selector);
        }

        searchStartIndex = sourceIndex + 1;
        break;
      }
    }

    if (mediaEndIndex < 0) {
      throw new Error(`Unclosed CSS media query: ${mediaQuery}`);
    }
  }

  throw new Error(`Unclosed CSS media query: ${mediaQuery}`);
}

afterEach(() => {
  cleanup();
});

describe('CoatMakerPageHeading', () => {
  it('renders a natural-height editorial hero with a responsive three-card fan', () => {
    const stylesheet = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8');
    const headingDeclarations = cssDeclarationsForSelector(stylesheet, '.coat-maker-page-heading');
    const innerDeclarations = cssDeclarationsForSelector(stylesheet, '.coat-maker-page-heading-inner');
    const titleDeclarations = cssDeclarationsForSelector(stylesheet, '.coat-maker-page-heading h1');
    const fanDeclarations = cssDeclarationsForSelector(stylesheet, '.coat-maker-page-heading-fan');
    const cardDeclarations = cssDeclarationsForSelector(stylesheet, '.coat-maker-page-heading-card');
    const emphasisDeclarations = cssDeclarationsForSelector(
      stylesheet,
      '.coat-maker-page-heading-title-emphasis',
    );
    const actionFocusDeclarations = cssDeclarationsForSelector(
      stylesheet,
      '.coat-maker-page-heading-action:focus-visible',
    );
    const mobileLeftDeclarations = cssDeclarationsForSelectorWithinMediaQuery(
      stylesheet,
      'max-width: 479px',
      '.coat-maker-page-heading-card--left',
    );
    const desktopLeftDeclarations = cssDeclarationsForSelectorWithinMediaQuery(
      stylesheet,
      'min-width: 640px',
      '.coat-maker-page-heading-card--left',
    );
    const desktopCenterDeclarations = cssDeclarationsForSelectorWithinMediaQuery(
      stylesheet,
      'min-width: 640px',
      '.coat-maker-page-heading-card--center',
    );

    expect(cssDeclarationValue(headingDeclarations, 'overflow-x')).toBe('clip');
    expect(cssDeclarationValue(headingDeclarations, 'background')).toBe('var(--site-panel)');
    expect(cssDeclarationValue(innerDeclarations, 'width')).toBe('100%');
    expect(cssDeclarationValue(innerDeclarations, 'max-width')).toBe('80rem');
    expect(cssDeclarationValue(titleDeclarations, 'font-family')).toBe('var(--font-display)');
    expect(cssDeclarationValue(titleDeclarations, 'letter-spacing')).toBe('-0.03em');
    expect(cssDeclarationValue(fanDeclarations, 'display')).toBe('grid');
    expect(cssDeclarationValue(fanDeclarations, 'width')).toBe('100%');
    expect(cssDeclarationValue(fanDeclarations, 'max-width')).toBe('58rem');
    expect(cssDeclarationValue(fanDeclarations, 'min-width')).toBe('0');
    expect(cssDeclarationValue(cardDeclarations, 'aspect-ratio')).toBe('4 / 5');
    expect(cssDeclarationValue(cardDeclarations, 'min-width')).toBe('0');
    expect(cssDeclarationValue(cardDeclarations, 'overflow')).toBe('hidden');
    expect(cssDeclarationValue(emphasisDeclarations, 'color')).toBe('var(--site-accent-strong)');
    expect(cssDeclarationValue(actionFocusDeclarations, 'outline')).toBe('3px solid var(--ring)');
    expect(cssDeclarationValue(mobileLeftDeclarations, 'margin-right')).toBe('-9%');
    expect(cssDeclarationValue(mobileLeftDeclarations, 'transform')).toBe('translateY(0.55rem) rotate(-3deg)');
    expect(cssDeclarationValue(desktopLeftDeclarations, 'margin-right')).toBe('-16%');
    expect(cssDeclarationValue(desktopLeftDeclarations, 'transform')).toBe('translateY(1.25rem) rotate(-6deg)');
    expect(cssDeclarationValue(desktopCenterDeclarations, 'transform')).toBe('translateY(-0.5rem)');

    const naturalHeightDeclarations = [
      ...headingDeclarations,
      ...innerDeclarations,
      ...titleDeclarations,
      ...fanDeclarations,
    ];

    for (const forbiddenProperty of ['height', 'min-height', 'max-height']) {
      expect(
        naturalHeightDeclarations.some((declaration) => declaration.startsWith(`${forbiddenProperty}:`)),
      ).toBe(false);
    }
  });

  it.each(['en', 'zh'] as const)('keeps the $locale title, description, and metadata copy exact', (locale) => {
    const copy = getCoatMakerSeoCopy(locale);
    const pageMetadata = locale === 'en' ? englishCoatMakerMetadata : chineseCoatMakerMetadata;

    render(<CoatMakerPageHeading locale={locale} />);

    const headingRoot = screen.getByTestId('coat-maker-page-heading');
    const title = headingRoot.querySelector('h1');
    const description = headingRoot.querySelector('h1 + p');
    const titleLines = title?.querySelectorAll('.coat-maker-page-heading-title-line');
    const emphasizedTitle = title?.querySelector('.coat-maker-page-heading-title-emphasis');

    expect(title?.textContent).toBe(copy.heading);
    expect(title?.getAttribute('aria-label')).toBe(copy.heading);
    expect(description?.textContent).toBe(copy.introduction);
    expect(copy.heading).toBe(copy.metadataTitle);
    expect(copy.introduction).toBe(copy.metadataDescription);
    expect(pageMetadata.title).toEqual({ absolute: copy.metadataTitle });
    expect(pageMetadata.description).toBe(copy.metadataDescription);
    expect(titleLines).toHaveLength(2);
    expect(emphasizedTitle).not.toBeNull();
    expect(emphasizedTitle?.textContent).not.toBe(titleLines?.[1]?.textContent);
    expect(headingRoot.getAttribute('aria-labelledby')).toBe(title?.id);
    expect(headingRoot.getAttribute('aria-describedby')).toBe(description?.id);
    expect(headingRoot.querySelector('.coat-maker-page-heading-support')?.textContent).toBe(
      copy.editorCtaDescription,
    );
  });

  it.each(['en', 'zh'] as const)('renders the localized CTA and three hero images for $locale', (locale) => {
    const copy = getCoatMakerSeoCopy(locale);
    const faqLink = copy.contextualLinks.find((contextualLink) => contextualLink.href === '/faq');

    if (!faqLink) {
      throw new Error(`Test fixture is missing the FAQ contextual link for locale="${locale}"`);
    }

    render(<CoatMakerPageHeading locale={locale} />);

    const headingRoot = screen.getByTestId('coat-maker-page-heading');
    const actionLinks = Array.from(headingRoot.querySelectorAll('.coat-maker-page-heading-actions a'));
    const heroImages = Array.from(headingRoot.querySelectorAll('.coat-maker-page-heading-fan img'));
    const expectedImageAlts =
      locale === 'en'
        ? [
            'Crimson lion coat of arms on a dark textured ground',
            'Azure stag coat of arms on a dark textured ground',
            'Verdant phoenix coat of arms on a dark textured ground',
          ]
        : ['深色纹理底上的绛红狮纹章', '深色纹理底上的蔚蓝鹿纹章', '深色纹理底上的翠绿凤凰纹章'];

    expect(actionLinks).toHaveLength(2);
    expect(actionLinks.map((actionLink) => actionLink.textContent)).toEqual([
      copy.editorCtaLabel,
      faqLink.label,
    ]);
    expect(actionLinks.map((actionLink) => actionLink.getAttribute('href'))).toEqual([
      '#coat-editor-workspace',
      getLocalizedPath(locale, faqLink.href),
    ]);
    expect(actionLinks.every((actionLink) => actionLink.getAttribute('aria-label') === actionLink.textContent)).toBe(true);

    expect(heroImages).toHaveLength(3);
    expect(heroImages.map((heroImage) => heroImage.getAttribute('src'))).toEqual([
      '/coat-of-arms-maker/hero/hero-crimson-lion.webp',
      '/coat-of-arms-maker/hero/hero-azure-stag.webp',
      '/coat-of-arms-maker/hero/hero-verdant-phoenix.webp',
    ]);
    expect(heroImages.map((heroImage) => heroImage.getAttribute('alt'))).toEqual(expectedImageAlts);
    expect(heroImages.every((heroImage) => heroImage.getAttribute('width') === '800')).toBe(true);
    expect(heroImages.every((heroImage) => heroImage.getAttribute('height') === '1000')).toBe(true);
    expect(heroImages.map((heroImage) => heroImage.getAttribute('loading'))).toEqual(['lazy', 'eager', 'lazy']);
    expect(heroImages.every((heroImage) => heroImage.getAttribute('decoding') === 'async')).toBe(true);
    expect(headingRoot.querySelectorAll('.coat-maker-page-heading-card')).toHaveLength(3);
    expect(headingRoot.querySelector('.coat-maker-page-heading-card--center')).not.toBeNull();
  });
});
