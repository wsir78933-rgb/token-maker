import { describe, expect, it } from 'vitest';

import {
  getScrollCreatorPageContent,
  type ScrollCreatorFeatureIcon,
  type ScrollCreatorPageContentCopy,
} from '@/lib/scroll-creator/page-content';

const expectedFeatureIcons: readonly ScrollCreatorFeatureIcon[] = [
  'paper',
  'dimensions',
  'text',
  'images',
  'save',
  'print',
];

function expectNonEmpty(value: string): void {
  expect(value.trim()).not.toBe('');
}

function expectPageContentShape(pageContent: ScrollCreatorPageContentCopy): void {
  expectNonEmpty(pageContent.whatIs.title);
  expectNonEmpty(pageContent.whatIs.description);
  expectNonEmpty(pageContent.features.title);
  expectNonEmpty(pageContent.features.description);
  expect(pageContent.features.items).toHaveLength(6);
  expect(pageContent.features.items.map((item) => item.icon)).toEqual(expectedFeatureIcons);
  pageContent.features.items.forEach((item) => {
    expectNonEmpty(item.title);
    expectNonEmpty(item.description);
  });

  expectNonEmpty(pageContent.comparison.title);
  expectNonEmpty(pageContent.comparison.description);
  expectNonEmpty(pageContent.comparison.tableLabel);
  expect(pageContent.comparison.rows).toHaveLength(5);
  pageContent.comparison.rows.forEach((row) => {
    expectNonEmpty(row.dimension);
    expectNonEmpty(row.scrollCreator);
    expectNonEmpty(row.word);
    expectNonEmpty(row.photoshop);
  });

  expectNonEmpty(pageContent.howItWorks.eyebrow);
  expectNonEmpty(pageContent.howItWorks.title);
  expect(pageContent.howItWorks.steps).toHaveLength(3);
  pageContent.howItWorks.steps.forEach((step) => {
    expectNonEmpty(step.title);
    expectNonEmpty(step.description);
  });

  expectNonEmpty(pageContent.cta.title);
  expectNonEmpty(pageContent.cta.description);
  expectNonEmpty(pageContent.cta.action);

  expectNonEmpty(pageContent.faq.eyebrow);
  expectNonEmpty(pageContent.faq.title);
  expectNonEmpty(pageContent.faq.description);
  expect(pageContent.faq.items).toHaveLength(8);
  pageContent.faq.items.forEach((item) => {
    expectNonEmpty(item.question);
    expectNonEmpty(item.answer);
  });
}

describe('scroll creator page content', () => {
  it('keeps the six bilingual sections structurally aligned', () => {
    const englishPageContent = getScrollCreatorPageContent('en');
    const chinesePageContent = getScrollCreatorPageContent('zh');

    expect(Object.keys(englishPageContent)).toEqual([
      'whatIs',
      'features',
      'comparison',
      'howItWorks',
      'cta',
      'faq',
    ]);
    expect(Object.keys(chinesePageContent)).toEqual(Object.keys(englishPageContent));
    expectPageContentShape(englishPageContent);
    expectPageContentShape(chinesePageContent);
    expect(chinesePageContent.features.items.map((item) => item.icon)).toEqual(
      englishPageContent.features.items.map((item) => item.icon),
    );
    expect(chinesePageContent.comparison.rows.map((row) => row.dimension)).toHaveLength(
      englishPageContent.comparison.rows.length,
    );
    expect(chinesePageContent.howItWorks.steps).toHaveLength(englishPageContent.howItWorks.steps.length);
    expect(chinesePageContent.faq.items).toHaveLength(englishPageContent.faq.items.length);
  });

  it('uses the approved bilingual CTA labels', () => {
    expect(getScrollCreatorPageContent('en').cta.action).toBe('Create a Scroll');
    expect(getScrollCreatorPageContent('zh').cta.action).toBe('开始制作卷轴');
  });

  it('fails fast for an unsupported runtime locale', () => {
    expect(() => getScrollCreatorPageContent('fr' as never)).toThrowError(
      'Unknown scroll creator page content locale. Received "fr".',
    );
  });
});
