// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { getSolarSystemCopy } from '@/lib/solar-system-creator/copy';

import { SolarSystemCreatorFaq } from './SolarSystemCreatorFaq';

afterEach(cleanup);

describe('SolarSystemCreatorFaq', () => {
  it.each(['en', 'zh'] as const)('renders the five localized copy items closed in %s', (locale) => {
    const copy = getSolarSystemCopy(locale);
    render(
      <SolarSystemCreatorFaq
        eyebrow={copy.pageContent.faqEyebrow}
        title={copy.pageContent.faqTitle}
        description={copy.pageContent.faqDescription}
        items={copy.pageContent.faqItems}
      />,
    );

    const heading = screen.getByRole('heading', { level: 2, name: copy.pageContent.faqTitle });
    const questions = screen.getAllByRole('button');
    const answers = Array.from(document.querySelectorAll('div[role="region"]'));

    expect(heading.id).toBe('solar-system-creator-faq-heading');
    expect(questions).toHaveLength(5);
    expect(answers).toHaveLength(5);
    questions.forEach((question, index) => {
      expect(question.textContent).toContain(copy.pageContent.faqItems[index]?.question);
      expect(question.getAttribute('aria-expanded')).toBe('false');
      expect(question.getAttribute('aria-controls')).toBe(answers[index]?.id);
      expect(answers[index]?.getAttribute('aria-labelledby')).toBe(question.id);
      expect(answers[index]?.hasAttribute('hidden')).toBe(true);
    });
  });

  it('opens one answer at a time and toggles aria and hidden state', () => {
    const copy = getSolarSystemCopy('en');
    render(
      <SolarSystemCreatorFaq
        eyebrow={copy.pageContent.faqEyebrow}
        title={copy.pageContent.faqTitle}
        description={copy.pageContent.faqDescription}
        items={copy.pageContent.faqItems}
      />,
    );

    const questions = screen.getAllByRole('button');
    const answers = Array.from(document.querySelectorAll('div[role="region"]'));

    fireEvent.click(questions[0]);
    expect(questions[0]?.getAttribute('aria-expanded')).toBe('true');
    expect(answers[0]?.hasAttribute('hidden')).toBe(false);

    fireEvent.click(questions[1]);
    expect(questions[0]?.getAttribute('aria-expanded')).toBe('false');
    expect(answers[0]?.hasAttribute('hidden')).toBe(true);
    expect(questions[1]?.getAttribute('aria-expanded')).toBe('true');
    expect(answers[1]?.hasAttribute('hidden')).toBe(false);

    fireEvent.click(questions[1]);
    expect(questions[1]?.getAttribute('aria-expanded')).toBe('false');
    expect(answers[1]?.hasAttribute('hidden')).toBe(true);
  });

  it('fails fast when the FAQ item list is empty', () => {
    const copy = getSolarSystemCopy('en');

    expect(() =>
      render(
        <SolarSystemCreatorFaq
          eyebrow={copy.pageContent.faqEyebrow}
          title={copy.pageContent.faqTitle}
          description={copy.pageContent.faqDescription}
          items={[]}
        />,
      ),
    ).toThrow('Received length 0');
  });
});
