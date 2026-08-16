// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { HomeSeoContent } from './HomeSeoContent';

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
      useCasesHeading: 'Build tokens for every role in the encounter',
      shapesHeading: 'Choose the right token shape',
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
      useCasesHeading: '为遭遇中的每个角色制作合适的 Token',
      shapesHeading: '如何选择 Token 的形状',
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
    shapesHeading,
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
    expect(renderedShapesHeading.closest('section')?.querySelectorAll('article')).toHaveLength(3);
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
