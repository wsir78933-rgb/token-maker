// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { SiteLocale } from '@/lib/site-locale';

import { CoatMakerSeoContent } from './CoatMakerSeoContent';
import { getCoatMakerSeoCopy } from './coat-maker-seo-copy';

function countEnglishTokens(text: string) {
  return text.match(/[A-Za-z0-9]+(?:['-][A-Za-z0-9]+)*/g)?.length ?? 0;
}

function countChineseTokens(text: string) {
  const hanCharacterCount = text.match(/[\p{Script=Han}]/gu)?.length ?? 0;

  return hanCharacterCount + countEnglishTokens(text);
}

function collectVisibleSemanticText(contentRoot: HTMLElement) {
  const semanticTextElements = Array.from(contentRoot.querySelectorAll<HTMLElement>('h1, h2, h3, p, li, a'));

  return semanticTextElements
    .filter((semanticTextElement) => !semanticTextElement.querySelector('h1, h2, h3, p, li, a'))
    .map((semanticTextElement) => semanticTextElement.textContent?.trim() ?? '')
    .filter((semanticText) => semanticText.length > 0)
    .join(' ');
}

function countEnglishKeyphraseOccurrences(text: string, keyphrase: string) {
  const escapedKeyphrase = keyphrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replaceAll(' ', '\\s+');
  const keyphrasePattern = new RegExp(`\\b${escapedKeyphrase}\\b`, 'gi');

  return text.match(keyphrasePattern)?.length ?? 0;
}

function countChineseKeyphraseOccurrences(text: string, keyphrase: string) {
  return text.split(keyphrase).length - 1;
}

function calculateKeyphraseDensity(semanticText: string, keyphrase: string, locale: 'en' | 'zh') {
  const countTokens = locale === 'en' ? countEnglishTokens : countChineseTokens;
  const totalTokenCount = countTokens(semanticText);
  const keyphraseTokenCount = countTokens(keyphrase);
  const keyphraseOccurrenceCount = locale === 'en'
    ? countEnglishKeyphraseOccurrences(semanticText, keyphrase)
    : countChineseKeyphraseOccurrences(semanticText, keyphrase);

  return (keyphraseOccurrenceCount * keyphraseTokenCount) / totalTokenCount;
}

afterEach(() => {
  cleanup();
});

describe('CoatMakerSeoContent', () => {
  it.each([
    {
      locale: 'en' as const,
      heading: 'Coat of Arms Maker',
      verifiedCapability: 'Shield styles, field patterns, charges, text, layers, and drawing tools',
      localPrivacy: 'Your project stays in your browser',
      faqQuestion: 'Is this coat of arms maker free to use?',
      internalLink: 'Square Token Maker',
      href: '/templates/square-token-maker',
    },
    {
      locale: 'zh' as const,
      heading: '纹章制作器',
      verifiedCapability: '盾牌样式、底纹、图形、文字、图层和绘图工具',
      localPrivacy: '你的项目保留在浏览器中',
      faqQuestion: '纹章制作器可以免费使用吗？',
      internalLink: '方形 Token 制作器',
      href: '/zh/templates/square-token-maker',
    },
  ])('renders the complete $locale localized SEO contract', ({
    locale,
    heading,
    verifiedCapability,
    localPrivacy,
    faqQuestion,
    internalLink,
    href,
  }) => {
    render(<CoatMakerSeoContent locale={locale} />);

    const contentRoot = screen.getByTestId('coat-maker-seo-content');

    expect(within(contentRoot).getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(within(contentRoot).getByRole('heading', { level: 1, name: heading })).not.toBeNull();
    const stepsList = within(contentRoot).getByRole('list', { name: /steps|步骤/i });

    expect(stepsList.tagName).toBe('OL');
    expect(within(stepsList).getAllByRole('listitem')).toHaveLength(3);
    expect(within(contentRoot).getByText(verifiedCapability)).not.toBeNull();
    expect(within(contentRoot).getByText(localPrivacy)).not.toBeNull();
    expect(within(contentRoot).getByRole('heading', { name: faqQuestion })).not.toBeNull();
    expect(within(contentRoot).getByRole('link', { name: internalLink }).getAttribute('href')).toBe(href);
  });

  it('counts Chinese all-content tokens as Han characters plus Latin and numeric tokens', () => {
    expect(countChineseTokens('纹章制作器 Token 5e')).toBe(7);
  });

  it.each([
    { locale: 'en' as const, keyphrase: 'coat of arms maker' },
    { locale: 'zh' as const, keyphrase: '纹章制作器' },
  ])('keeps $locale keyphrase density within the confirmed 2% to 3% range', ({ locale, keyphrase }) => {
    render(<CoatMakerSeoContent locale={locale} />);

    const contentRoot = screen.getByTestId('coat-maker-seo-content');
    const semanticText = collectVisibleSemanticText(contentRoot);
    const density = calculateKeyphraseDensity(semanticText, keyphrase, locale);

    if (locale === 'zh') {
      expect(countChineseTokens(semanticText)).toBe(419);
      expect(density).toBeCloseTo(10 / 419, 10);
    }

    expect(density).toBeGreaterThanOrEqual(0.02);
    expect(density).toBeLessThanOrEqual(0.03);
  });

  it.each(['en', 'zh'] as const)('exposes verified WebApplication feature names for $locale', (locale) => {
    const copy = getCoatMakerSeoCopy(locale);

    expect(copy.webApplicationFeatureNames).toHaveLength(3);
    expect(copy.webApplicationFeatureNames.every((featureName) => featureName.trim().length > 0)).toBe(true);
  });

  it.each(['fr', 'toString', 'constructor', '__proto__'])('rejects unsupported locale key %s before returning copy', (invalidLocale) => {
    expect(() => getCoatMakerSeoCopy(invalidLocale as SiteLocale)).toThrow(`Unsupported Coat Maker SEO locale: ${invalidLocale}`);
  });
});
