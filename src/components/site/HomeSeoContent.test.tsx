// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { HomeHero, HomeSeoContent } from './HomeSeoContent';

describe('HomeSeoContent', () => {
  afterEach(() => {
    cleanup();
  });

  it('adds a dedicated attention effect class only to the feedback CTA', () => {
    render(<HomeSeoContent locale="zh" />);

    const feedbackLink = screen.getByRole('link', { name: /发送反馈/ });
    const footerContactLink = screen.getByRole('link', { name: '联系' });

    expect(feedbackLink.className).toContain('site-feedback-cta');
    expect(footerContactLink.className).not.toContain('site-feedback-cta');
  });

  it.each([
    {
      locale: 'en' as const,
      definitionHeading: 'Make a VTT token that stays readable on the map',
      workflowHeading: 'A practical three-step token workflow',
      useCasesHeading: 'Give Every Character a Look Worthy of Your Campaign',
      useCasesIntroduction:
        'A carefully built campaign deserves more than mismatched character portraits. Use Token Maker to give heroes, NPCs, and monsters a shared visual language while preserving the face, faction cue, or silhouette that makes each one distinct.',
      shapesHeading: 'Circle, Square, or Polygon? Let the Map Decide',
      shapesIntroduction:
        'Use circles for portrait-led characters, squares when the composition needs room, and polygons for bosses or objectives. The best shape is the one that stays clear at the scale your players actually see.',
      faqHeading: 'Practical token-making questions',
      feedbackHeading: 'Need a token export fixed?',
      feedbackCta: 'Report an issue',
      footerNavigationLabel: 'Footer navigation',
      guideHrefs: [
        '/#editor-workspace',
        '/#editor-workspace',
        '/#editor-workspace',
        '/blog/dnd-classes-explained',
        '/blog/dnd-demons',
        '/templates/square-token-maker',
      ],
      faqHref: '/faq',
    },
    {
      locale: 'zh' as const,
      definitionHeading: '制作一枚放到 VTT 地图上仍然清楚的 Token',
      workflowHeading: '从立绘到 VTT：三步完成 Token',
      useCasesHeading: '让每个角色都配得上你的战役',
      useCasesIntroduction:
        '精心准备的战役，不该被风格混乱的角色肖像破坏。使用 Token Maker 为英雄、NPC 和怪物建立统一的视觉语言，同时保留脸部、派系线索或轮廓中最有辨识度的部分。',
      shapesHeading: '圆形、方形还是多边形？让地图用途来决定',
      shapesIntroduction:
        '肖像角色适合圆形，需要保留构图时选择方形，Boss 和任务目标可以使用多边形。最合适的形状，是玩家在实际地图比例下仍能看清的那一种。',
      faqHeading: 'Token 制作中的常见实用问题',
      feedbackHeading: '有问题或建议？',
      feedbackCta: '发送反馈',
      footerNavigationLabel: '页脚导航',
      guideHrefs: [
        '/zh#editor-workspace',
        '/zh#editor-workspace',
        '/zh#editor-workspace',
        '/zh/blog/dnd-classes-explained',
        '/zh/blog/dnd-demons',
        '/zh/templates/square-token-maker',
      ],
      faqHref: '/zh/faq',
    },
  ])('renders aligned $locale guidance around the existing feedback section', ({
    locale,
    definitionHeading,
    workflowHeading,
    useCasesHeading,
    useCasesIntroduction,
    shapesHeading,
    shapesIntroduction,
    faqHeading,
    feedbackHeading,
    feedbackCta,
    footerNavigationLabel,
    guideHrefs,
    faqHref,
  }) => {
    render(<HomeSeoContent locale={locale} />);

    const guide = screen.getByTestId('home-token-guide');
    const feedback = document.querySelector('#feedback');
    const faq = screen.getByTestId('home-token-faq');
    const footer = screen.getByRole('contentinfo');

    const renderedDefinitionHeading = within(guide).getByRole('heading', { level: 2, name: definitionHeading });
    const renderedWorkflowHeading = within(guide).getByRole('heading', { level: 2, name: workflowHeading });
    const renderedUseCasesHeading = within(guide).getByRole('heading', { level: 2, name: useCasesHeading });
    const renderedShapesHeading = within(guide).getByRole('heading', { level: 2, name: shapesHeading });

    expect(renderedDefinitionHeading).toBeDefined();
    expect(renderedWorkflowHeading.closest('section')?.querySelector('ol')?.children).toHaveLength(3);
    expect(renderedUseCasesHeading.closest('section')?.querySelectorAll('article')).toHaveLength(3);
    expect(
      within(renderedUseCasesHeading.closest('section') as HTMLElement).getByText(
        useCasesIntroduction,
      ),
    ).toBeDefined();
    expect(renderedShapesHeading.closest('section')?.querySelectorAll('article')).toHaveLength(3);
    expect(within(renderedShapesHeading.closest('section') as HTMLElement).getByText(shapesIntroduction)).toBeDefined();
    expect(within(faq).getByRole('heading', { level: 2, name: faqHeading })).toBeDefined();
    expect(within(faq).getAllByRole('article')).toHaveLength(5);
    expect(within(guide).getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual(guideHrefs);
    expect(within(faq).getByRole('link').getAttribute('href')).toBe(faqHref);

    expect(screen.getByRole('heading', { level: 2, name: feedbackHeading })).toBeDefined();
    expect(screen.getByRole('link', { name: feedbackCta })).toBeDefined();
    expect(screen.getByRole('navigation', { name: footerNavigationLabel })).toBeDefined();

    expect(feedback).not.toBeNull();
    expect(
      guide.compareDocumentPosition(feedback as Element) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(
      (feedback as Element).compareDocumentPosition(faq) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(
      faq.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('uses token stamp naturally in visible English guidance without adding FAQ structured data', () => {
    render(<HomeSeoContent locale="en" />);

    const guideAndFaqText = [
      screen.getByTestId('home-token-guide').textContent,
      screen.getByTestId('home-token-faq').textContent,
    ].join(' ');

    expect(guideAndFaqText).toMatch(/\btoken stamp\b/i);
    expect(screen.getByRole('heading', { level: 3, name: /what is a token stamp/i })).toBeDefined();
    expect(document.querySelector('script[type="application/ld+json"]')).toBeNull();
  });
});

describe('HomeHero', () => {
  afterEach(() => {
    cleanup();
  });

  it.each([
    {
      locale: 'en' as const,
      contactLabel: 'Contact',
      contactHref: '/contact',
      blogLabel: 'Blog',
    },
    {
      locale: 'zh' as const,
      contactLabel: '联系',
      contactHref: '/zh/contact',
      blogLabel: '博客',
    },
  ])(
    'places $contactLabel immediately before $blogLabel in the topbar',
    ({ locale, contactLabel, contactHref, blogLabel }) => {
      render(<HomeHero locale={locale} />);

      const topbar = document.querySelector('.site-topbar');
      if (!(topbar instanceof HTMLElement)) {
        throw new Error('HomeHero topbar was not found');
      }

      const topbarQueries = within(topbar);
      const contactLink = topbarQueries.getByRole('link', { name: contactLabel });
      const blogLink = topbarQueries.getByRole('link', { name: blogLabel });
      const topbarLinks = topbarQueries.getAllByRole('link');

      expect(contactLink.getAttribute('href')).toBe(contactHref);
      expect(topbarLinks.indexOf(contactLink) + 1).toBe(topbarLinks.indexOf(blogLink));
    },
  );
});
