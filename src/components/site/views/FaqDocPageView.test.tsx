// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { FaqDocPageView } from '@/components/site/views/FaqDocPageView';
import { getFaqDocModel } from '@/lib/site-page-models';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

const questionActionCopyByLocale = {
  en: [
    {
      label: 'Start with a real portrait',
      description: 'See how cropping, masks, borders, and PNG export work together in the editor.',
      href: '/',
    },
    {
      label: 'Check the tabletop workflow',
      description: 'Make a PNG token for Roll20, Foundry VTT, Owlbear, or a similar tabletop.',
      href: '/',
    },
    {
      label: 'See transparent PNG export guidance',
      description: 'The square token guide explains transparent PNG use and recommended VTT sizes.',
      href: '/templates/square-token-maker',
    },
    {
      label: 'Try masks and borders in the editor',
      description: 'Adjust a circular, square, or polygon mask and choose a border style.',
      href: '/',
    },
    {
      label: 'Read the privacy note',
      description: 'Check what stays in your browser during standard cropping and PNG export.',
      href: '/privacy',
    },
  ],
  zh: [
    {
      label: '用真实头像开始制作',
      description: '在编辑器里试试裁切、遮罩、边框和 PNG 导出如何配合。',
      href: '/',
    },
    {
      label: '查看桌面平台工作流',
      description: '制作 PNG Token，再用于 Roll20、Foundry VTT、Owlbear 等桌面平台。',
      href: '/',
    },
    {
      label: '查看透明 PNG 导出说明',
      description: '方形 Token 指南介绍透明 PNG 用法和常见 VTT 尺寸建议。',
      href: '/templates/square-token-maker',
    },
    {
      label: '在编辑器里试试遮罩和边框',
      description: '调整圆形、方形或多边形遮罩，再选择边框样式。',
      href: '/',
    },
    {
      label: '阅读隐私说明',
      description: '了解普通裁切和 PNG 导出时，图片会不会离开浏览器。',
      href: '/privacy',
    },
  ],
} as const;

const squareGuideActionCopyByLocale = {
  en: {
    label: 'Open the square token guide',
    description: 'See square crops, transparent PNG exports, and sizes for common VTT use.',
  },
  zh: {
    label: '查看方形 Token 指南',
    description: '了解方形裁切、透明 PNG 导出，以及常见 VTT 工作流的尺寸建议。',
  },
} as const;

afterEach(cleanup);

function expectQuestionActions(locale: SiteLocale) {
  const faqModel = getFaqDocModel(locale);
  const expectedActions = questionActionCopyByLocale[locale];

  faqModel.items.forEach((item, index) => {
    const questionHeadings = screen.getAllByRole('heading', { level: 3, name: item.question });
    expect(questionHeadings).toHaveLength(1);

    const questionArticle = questionHeadings[0].closest('article');

    if (!questionArticle) {
      throw new Error(`Expected the FAQ question "${item.question}" to have an article card.`);
    }

    const expectedAction = expectedActions[index];

    if (!expectedAction) {
      throw new Error(`Expected next action copy for FAQ question index ${index} in locale "${locale}".`);
    }

    const actionLink = within(questionArticle).getByRole('link', {
      name: new RegExp(`^${expectedAction.label}`),
    });

    expect(actionLink.getAttribute('href')).toBe(getLocalizedPath(locale, expectedAction.href));
    expect(within(questionArticle).getByText(expectedAction.description)).toBeTruthy();
  });
}

describe('FaqDocPageView', () => {
  it.each(['en', 'zh'] as const)('renders one matching next action for every %s FAQ', (locale) => {
    render(<FaqDocPageView locale={locale} />);

    expectQuestionActions(locale);

    const squareGuideAction = squareGuideActionCopyByLocale[locale];
    const quickAction = screen.getByRole('link', {
      name: new RegExp(`^${squareGuideAction.label}`),
    });

    expect(quickAction.getAttribute('href')).toBe(
      getLocalizedPath(locale, '/templates/square-token-maker')
    );
    expect(within(quickAction).getByText(squareGuideAction.description)).toBeTruthy();
    expect(screen.queryByText(/compare token formats|template hub/i)).toBeNull();
    expect(screen.queryByText(/比较不同 Token 格式|比较多种格式|模板中心/)).toBeNull();
  });
});
