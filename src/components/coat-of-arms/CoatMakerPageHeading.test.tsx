// @vitest-environment jsdom

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { CoatMakerPageHeading } from './CoatMakerPageHeading';
import { getCoatMakerSeoCopy } from './coat-maker-seo-copy';

function cssDeclarationsForSelector(cssSource: string, selector: string): string[] {
  const collapsedCss = cssSource.replace(/\s+/g, ' ');
  const collapsedSelector = selector.replace(/\s+/g, ' ').trim();
  const rulePattern = /([^{]+)\{([^}]+)\}/g;

  for (const match of collapsedCss.matchAll(rulePattern)) {
    const selectorList = match[1].split(',').map((part) => part.trim());
    if (!selectorList.includes(collapsedSelector)) continue;

    return match[2]
      .split(';')
      .map((declaration) => declaration.trim())
      .filter((declaration) => declaration.length > 0);
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

function cssDeclarationsForSelectorWithinMinimumWidth(
  cssSource: string,
  minimumWidthPixels: number,
  selector: string,
): string[] {
  const collapsedCss = cssSource.replace(/\s+/g, ' ');
  const collapsedSelector = selector.replace(/\s+/g, ' ').trim();
  const mediaRulePattern = new RegExp(
    `@media \\(min-width: ${minimumWidthPixels}px\\) \\{((?:[^{}]*\\{[^{}]*\\})*[^{}]*)\\}`,
    'g',
  );

  for (const mediaRuleMatch of collapsedCss.matchAll(mediaRulePattern)) {
    if (!mediaRuleMatch[1].includes(`${collapsedSelector} {`)) continue;

    return cssDeclarationsForSelector(mediaRuleMatch[1], collapsedSelector);
  }

  throw new Error(`Missing CSS rule for selector ${collapsedSelector} at min-width ${minimumWidthPixels}px`);
}

afterEach(() => {
  cleanup();
});

describe('CoatMakerPageHeading', () => {
  it('keeps the heading as a centered landing-page Hero with natural height above the generator', () => {
    const stylesheet = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8');
    const headingCopyDeclarations = cssDeclarationsForSelector(stylesheet, '.coat-maker-page-heading-copy');
    const titleDeclarations = cssDeclarationsForSelector(stylesheet, '.coat-maker-page-heading h1');
    const descriptionDeclarations = cssDeclarationsForSelector(stylesheet, '.coat-maker-page-heading p');

    expect.soft(cssDeclarationValue(headingCopyDeclarations, 'box-sizing')).toBe('border-box');
    expect.soft(cssDeclarationValue(headingCopyDeclarations, 'width')).toBe('100%');
    expect.soft(cssDeclarationValue(headingCopyDeclarations, 'max-width')).toBe('72rem');
    expect.soft(cssDeclarationValue(headingCopyDeclarations, 'margin-inline')).toBe('auto');
    expect(cssDeclarationValue(headingCopyDeclarations, 'padding')).toBe('2.25rem 1.25rem 2.5rem');
    expect.soft(cssDeclarationValue(headingCopyDeclarations, 'text-align')).toBe('center');

    expect.soft(cssDeclarationValue(titleDeclarations, 'max-width')).toBe('68rem');
    expect.soft(cssDeclarationValue(titleDeclarations, 'margin')).toBe('0 auto');
    expect.soft(cssDeclarationValue(titleDeclarations, 'color')).toBe('#fafaf9');
    expect.soft(cssDeclarationValue(titleDeclarations, 'font-family')).toBe('var(--font-display)');
    expect.soft(cssDeclarationValue(titleDeclarations, 'font-size')).toBe('2.25rem');
    expect.soft(cssDeclarationValue(titleDeclarations, 'font-weight')).toBe('400');
    expect.soft(cssDeclarationValue(titleDeclarations, 'line-height')).toBe('1.08');
    expect.soft(cssDeclarationValue(titleDeclarations, 'letter-spacing')).toBe('-0.03em');
    expect.soft(cssDeclarationValue(titleDeclarations, 'text-wrap')).toBe('balance');

    expect.soft(cssDeclarationValue(descriptionDeclarations, 'max-width')).toBe('52rem');
    expect.soft(cssDeclarationValue(descriptionDeclarations, 'margin')).toBe('1.125rem auto 0');
    expect.soft(cssDeclarationValue(descriptionDeclarations, 'color')).toBe('#d6d3d1');
    expect.soft(cssDeclarationValue(descriptionDeclarations, 'font-size')).toBe('1rem');
    expect.soft(cssDeclarationValue(descriptionDeclarations, 'line-height')).toBe('1.55');
    expect.soft(cssDeclarationValue(descriptionDeclarations, 'text-wrap')).toBe('pretty');

    const tabletHeadingCopyDeclarations = cssDeclarationsForSelectorWithinMinimumWidth(
      stylesheet,
      640,
      '.coat-maker-page-heading-copy',
    );
    const tabletTitleDeclarations = cssDeclarationsForSelectorWithinMinimumWidth(
      stylesheet,
      640,
      '.coat-maker-page-heading h1',
    );
    const tabletDescriptionDeclarations = cssDeclarationsForSelectorWithinMinimumWidth(
      stylesheet,
      640,
      '.coat-maker-page-heading p',
    );
    const desktopHeadingCopyDeclarations = cssDeclarationsForSelectorWithinMinimumWidth(
      stylesheet,
      1024,
      '.coat-maker-page-heading-copy',
    );
    const desktopTitleDeclarations = cssDeclarationsForSelectorWithinMinimumWidth(
      stylesheet,
      1024,
      '.coat-maker-page-heading h1',
    );

    expect.soft(cssDeclarationValue(tabletHeadingCopyDeclarations, 'padding')).toBe('3rem 1.5rem 3.5rem');
    expect.soft(cssDeclarationValue(tabletTitleDeclarations, 'font-size')).toBe('2.75rem');
    expect.soft(cssDeclarationValue(tabletDescriptionDeclarations, 'font-size')).toBe('1.125rem');
    expect.soft(cssDeclarationValue(tabletDescriptionDeclarations, 'line-height')).toBe('1.6');

    expect.soft(cssDeclarationValue(desktopHeadingCopyDeclarations, 'padding')).toBe('4rem 2rem 4.5rem');
    expect.soft(cssDeclarationValue(desktopTitleDeclarations, 'font-size')).toBe(
      'clamp(3rem, 2.4rem + 1.2vw, 3.5rem)',
    );

    const heroLayoutDeclarations = [
      ...headingCopyDeclarations,
      ...titleDeclarations,
      ...descriptionDeclarations,
      ...tabletHeadingCopyDeclarations,
      ...tabletTitleDeclarations,
      ...tabletDescriptionDeclarations,
      ...desktopHeadingCopyDeclarations,
      ...desktopTitleDeclarations,
    ];
    const forbiddenHeroLayoutProperties = [
      'height',
      'min-height',
      'max-height',
      'overflow',
      'white-space',
      'flex-grow',
      'aspect-ratio',
      'grid-row',
      'grid-template-rows',
    ];

    for (const forbiddenProperty of forbiddenHeroLayoutProperties) {
      expect
        .soft(heroLayoutDeclarations.some((declaration) => declaration.startsWith(`${forbiddenProperty}:`)))
        .toBe(false);
    }
  });

  it.each(['en', 'zh'] as const)('renders the existing $locale title and description above the editor', (locale) => {
    const copy = getCoatMakerSeoCopy(locale);

    render(<CoatMakerPageHeading locale={locale} />);

    const headingRoot = screen.getByTestId('coat-maker-page-heading');
    const title = headingRoot.querySelector('h1');
    const description = headingRoot.querySelector('h1 + p');

    expect(title?.textContent).toBe(copy.heading);
    expect(description?.textContent).toBe(copy.introduction);
    expect(title?.textContent).toBe(copy.metadataTitle);
    expect(description?.textContent).toBe(copy.metadataDescription);
  });
});
