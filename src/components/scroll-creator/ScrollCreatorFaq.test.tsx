// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import type { ScrollCreatorFaqItemCopy } from '@/lib/scroll-creator/page-content';

import { ScrollCreatorFaq } from './ScrollCreatorFaq';

type FaqLocaleFixture = {
  locale: 'en' | 'zh';
  eyebrow: string;
  title: string;
  description: string;
  items: readonly ScrollCreatorFaqItemCopy[];
};

const faqLocaleFixtures: readonly FaqLocaleFixture[] = [
  {
    locale: 'en',
    eyebrow: 'QUESTIONS',
    title: 'Scroll maker FAQ',
    description: 'Answers for creating and sharing a fantasy scroll.',
    items: [
      { question: 'Can I change the paper?', answer: 'Choose another paper in the Paper tab.' },
      { question: 'Can I add my own font?', answer: 'Add a Google Fonts stylesheet in Advanced fonts.' },
    ],
  },
  {
    locale: 'zh',
    eyebrow: '常见问题',
    title: '卷轴制作工具常见问题',
    description: '关于制作和分享奇幻卷轴的答案。',
    items: [
      { question: '可以更换纸张吗？', answer: '在纸张标签中选择其他纸张。' },
      { question: '可以添加自定义字体吗？', answer: '在高级字体中添加 Google Fonts 样式表。' },
    ],
  },
];

afterEach(cleanup);

function renderFaq(fixture: FaqLocaleFixture) {
  return render(
    <ScrollCreatorFaq
      eyebrow={fixture.eyebrow}
      title={fixture.title}
      description={fixture.description}
      items={fixture.items}
    />,
  );
}

describe('ScrollCreatorFaq', () => {
  it.each(faqLocaleFixtures)('renders the %s FAQ copy and collapsed answers', (fixture) => {
    renderFaq(fixture);

    expect(screen.getByRole('heading', { level: 2, name: fixture.title })).toBeTruthy();
    expect(screen.getByText(fixture.eyebrow)).toBeTruthy();
    expect(screen.getByText(fixture.description)).toBeTruthy();
    expect(screen.getAllByRole('button')).toHaveLength(fixture.items.length);
    expect(document.querySelectorAll('[role="region"]')).toHaveLength(fixture.items.length);

    fixture.items.forEach((item) => {
      const questionButton = screen.getByRole('button', { name: item.question });
      const answer = document.getElementById(questionButton.getAttribute('aria-controls') ?? '');
      expect(questionButton.getAttribute('aria-expanded')).toBe('false');
      expect(answer?.hasAttribute('hidden')).toBe(true);
    });
  });

  it('opens one answer, switches to another, and closes it again', () => {
    const fixture = faqLocaleFixtures[0];
    renderFaq(fixture);

    const firstQuestion = screen.getByRole('button', { name: fixture.items[0].question });
    const secondQuestion = screen.getByRole('button', { name: fixture.items[1].question });
    const firstAnswerId = firstQuestion.getAttribute('aria-controls');
    const secondAnswerId = secondQuestion.getAttribute('aria-controls');

    fireEvent.click(firstQuestion);
    expect(firstQuestion.getAttribute('aria-expanded')).toBe('true');
    expect(document.getElementById(firstAnswerId ?? '')?.hasAttribute('hidden')).toBe(false);

    fireEvent.click(secondQuestion);
    expect(firstQuestion.getAttribute('aria-expanded')).toBe('false');
    expect(document.getElementById(firstAnswerId ?? '')?.hasAttribute('hidden')).toBe(true);
    expect(secondQuestion.getAttribute('aria-expanded')).toBe('true');
    expect(document.getElementById(secondAnswerId ?? '')?.hasAttribute('hidden')).toBe(false);

    fireEvent.click(secondQuestion);
    expect(secondQuestion.getAttribute('aria-expanded')).toBe('false');
    expect(document.getElementById(secondAnswerId ?? '')?.hasAttribute('hidden')).toBe(true);
  });

  it('keeps every question and answer association unique across FAQ instances', () => {
    const firstFixture = faqLocaleFixtures[0];
    const secondFixture = faqLocaleFixtures[1];
    render(
      <>
        <ScrollCreatorFaq
          eyebrow={firstFixture.eyebrow}
          title={firstFixture.title}
          description={firstFixture.description}
          items={firstFixture.items}
        />
        <ScrollCreatorFaq
          eyebrow={secondFixture.eyebrow}
          title={secondFixture.title}
          description={secondFixture.description}
          items={secondFixture.items}
        />
      </>,
    );

    const questionButtons = screen.getAllByRole('button');
    const questionIds = questionButtons.map((button) => button.id);
    const answerIds = questionButtons.map((button) => button.getAttribute('aria-controls') ?? '');

    expect(new Set(questionIds).size).toBe(questionIds.length);
    expect(new Set(answerIds).size).toBe(answerIds.length);
    questionButtons.forEach((questionButton) => {
      const answerId = questionButton.getAttribute('aria-controls') ?? '';
      const answer = document.getElementById(answerId);
      expect(answer).toBeTruthy();
      expect(answer?.getAttribute('aria-labelledby')).toBe(questionButton.id);
    });
  });

  it('uses native button focus and activation for keyboard users', () => {
    const fixture = faqLocaleFixtures[0];
    renderFaq(fixture);

    const questionButton = screen.getByRole('button', { name: fixture.items[0].question });
    questionButton.focus();
    expect(document.activeElement).toBe(questionButton);
    expect(questionButton.getAttribute('type')).toBe('button');

    fireEvent.click(questionButton);
    expect(questionButton.getAttribute('aria-expanded')).toBe('true');
  });

  it('fails fast when FAQ items are empty', () => {
    expect(() => {
      render(
        <ScrollCreatorFaq
          eyebrow="Questions"
          title="Empty FAQ"
          description="There should be questions."
          items={[]}
        />,
      );
    }).toThrow('Received length 0');
  });
});
