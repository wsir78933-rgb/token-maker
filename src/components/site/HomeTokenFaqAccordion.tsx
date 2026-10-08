'use client';

import { ArrowRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useId, useState } from 'react';

type HomeTokenFaqItem = {
  question: string;
  answer: string;
};

function assertHomeTokenFaqText(fieldName: string, value: string) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(
      `Home token FAQ ${fieldName} must be a non-empty string. Received ${JSON.stringify(value)}.`,
    );
  }
}

function assertHomeTokenFaqItems(items: readonly HomeTokenFaqItem[]) {
  if (items.length === 0) {
    throw new Error(`Home token FAQ items must not be empty. Received length ${items.length}.`);
  }

  items.forEach((faqItem, itemIndex) => {
    if (typeof faqItem !== 'object' || faqItem === null) {
      throw new Error(
        `Home token FAQ item ${itemIndex} must be an object. Received ${JSON.stringify(faqItem)}.`,
      );
    }

    assertHomeTokenFaqText(`item ${itemIndex} question`, faqItem.question);
    assertHomeTokenFaqText(`item ${itemIndex} answer`, faqItem.answer);
  });
}

export function HomeTokenFaqAccordion({
  eyebrow,
  title,
  description,
  items,
  faqHref,
  faqLinkLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: readonly HomeTokenFaqItem[];
  faqHref: string;
  faqLinkLabel: string;
}) {
  const faqId = useId();
  const [openItemIndex, setOpenItemIndex] = useState<number | null>(null);
  const titleId = `${faqId}-title`;
  const descriptionId = `${faqId}-description`;

  assertHomeTokenFaqText('eyebrow', eyebrow);
  assertHomeTokenFaqText('title', title);
  assertHomeTokenFaqText('description', description);
  assertHomeTokenFaqItems(items);
  assertHomeTokenFaqText('href', faqHref);
  assertHomeTokenFaqText('link label', faqLinkLabel);

  return (
    <section
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      data-testid="home-token-faq"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <header className="mx-auto mb-10 flex max-w-3xl flex-col items-center gap-3 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">{eyebrow}</span>
        <h2
          id={titleId}
          className="font-display font-semibold tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {title}
        </h2>
        <p id={descriptionId} className="max-w-2xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {description}
        </p>
      </header>

      <div className="mx-auto max-w-3xl divide-y divide-white/10 border-y border-white/10">
        {items.map((faqItem, itemIndex) => {
          const isExpanded = openItemIndex === itemIndex;
          const questionId = `${faqId}-question-${itemIndex}`;
          const answerId = `${faqId}-answer-${itemIndex}`;

          return (
            <article key={faqItem.question}>
              <h3>
                <button
                  id={questionId}
                  aria-controls={answerId}
                  aria-expanded={isExpanded}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left font-semibold tracking-tight text-stone-50 transition-colors hover:text-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
                  type="button"
                  onClick={() =>
                    setOpenItemIndex((currentIndex) => (currentIndex === itemIndex ? null : itemIndex))
                  }
                >
                  <span>{faqItem.question}</span>
                  <ChevronDown
                    aria-hidden="true"
                    className={`size-5 shrink-0 text-stone-400 transition-transform duration-200${
                      isExpanded ? ' rotate-180' : ''
                    }`}
                  />
                </button>
              </h3>
              <div id={answerId} aria-labelledby={questionId} hidden={!isExpanded} role="region">
                <p className="pb-5 pr-10 text-sm leading-7 text-stone-300 sm:text-base">{faqItem.answer}</p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mx-auto mt-7 max-w-3xl">
        <Link
          href={faqHref}
          prefetch={false}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#f1d492] transition hover:text-white"
        >
          {faqLinkLabel}
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
