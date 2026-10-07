/* @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { FamilyTreeCreatorFaq } from './FamilyTreeCreatorFaq';
import { getFamilyTreePageContent } from '@/lib/family-tree/page-content';

afterEach(() => {
  cleanup();
});

describe('FamilyTreeCreatorFaq', () => {
  it.each(['en', 'zh'] as const)(
    'expands and collapses the localized FAQ with click and aria state (%s)',
    (locale) => {
      const faq = getFamilyTreePageContent(locale).faq;

      render(<FamilyTreeCreatorFaq faq={faq} />);

      expect(
        screen
          .getByRole('heading', { level: 2, name: faq.title })
          .getAttribute('id'),
      ).toBe('family-tree-faq-heading');
      const faqHeading = screen.getByRole('heading', {
        level: 2,
        name: faq.title,
      });
      const faqSection = faqHeading.closest('section');
      const faqDescription = screen.getByText(faq.description);

      expect(faqSection?.getAttribute('aria-describedby')).toBe(
        'family-tree-faq-description',
      );
      expect(faqDescription.getAttribute('id')).toBe(
        'family-tree-faq-description',
      );
      expect(screen.getAllByRole('button').length).toBe(faq.items.length);

      const firstQuestion = screen.getByRole('button', {
        name: faq.items[0].question,
      });
      const secondQuestion = screen.getByRole('button', {
        name: faq.items[1].question,
      });

      expect(firstQuestion.getAttribute('aria-expanded')).toBe('false');
      fireEvent.click(firstQuestion);
      expect(firstQuestion.getAttribute('aria-expanded')).toBe('true');
      expect(screen.getByText(faq.items[0].answer)).toBeTruthy();

      fireEvent.click(secondQuestion);
      expect(firstQuestion.getAttribute('aria-expanded')).toBe('false');
      expect(secondQuestion.getAttribute('aria-expanded')).toBe('true');
      expect(screen.getByText(faq.items[1].answer)).toBeTruthy();

      fireEvent.click(secondQuestion);
      expect(secondQuestion.getAttribute('aria-expanded')).toBe('false');
    },
  );

  it('uses the primitive keyboard behavior for Enter and Space', () => {
    const faq = getFamilyTreePageContent('en').faq;

    render(<FamilyTreeCreatorFaq faq={faq} />);

    const firstQuestion = screen.getByRole('button', {
      name: faq.items[0].question,
    });

    fireEvent.keyDown(firstQuestion, { key: 'Enter', code: 'Enter' });
    // jsdom does not synthesize the native button click that a browser dispatches for Enter.
    fireEvent.click(firstQuestion);
    expect(firstQuestion.getAttribute('aria-expanded')).toBe('true');

    fireEvent.keyDown(firstQuestion, { key: ' ', code: 'Space' });
    expect(firstQuestion.getAttribute('aria-expanded')).toBe('false');
  });

  it('fails fast when the FAQ item list is empty', () => {
    const faq = getFamilyTreePageContent('en').faq;
    const emptyFaq = { ...faq, items: [] };

    expect(() => render(<FamilyTreeCreatorFaq faq={emptyFaq} />)).toThrowError(
      /items must not be empty.*length 0/,
    );
  });
});
