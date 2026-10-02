'use client';

import { ChevronDown } from 'lucide-react';
import { useId, useState } from 'react';

const FAQ1_SECTION_CLASS =
  'mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28';

export type Faq1Item = {
  question: string;
  answer: string;
};

export type Faq1Props = {
  eyebrow: string;
  title: string;
  description: string;
  items: readonly Faq1Item[];
  className?: string;
};

function describeFaq1Value(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (value === null) {
    return 'null';
  }

  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  if (typeof value === 'symbol') {
    return value.toString();
  }

  if (typeof value === 'function') {
    return `function ${value.name.length > 0 ? value.name : 'anonymous'}`;
  }

  try {
    const json = JSON.stringify(value);
    return typeof json === 'string' ? json : Object.prototype.toString.call(value);
  } catch (error: unknown) {
    const reason = error instanceof Error && error.message.length > 0 ? error.message : String(error);
    return `${Object.prototype.toString.call(value)} (JSON serialization failed: ${reason}).`;
  }
}

function requireFaq1Text(value: unknown, fieldName: string): string {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }

  throw new Error(`Faq1 ${fieldName} must be a non-empty string. Received ${describeFaq1Value(value)}.`);
}

function requireFaq1Items(value: unknown): readonly Faq1Item[] {
  if (!Array.isArray(value)) {
    throw new Error(`Faq1 items must be an array. Received ${describeFaq1Value(value)}.`);
  }

  value.forEach((faqItem: unknown, index: number) => {
    if (faqItem === null || typeof faqItem !== 'object' || Array.isArray(faqItem)) {
      throw new Error(`Faq1 items[${index}] must be an object. Received ${describeFaq1Value(faqItem)}.`);
    }

    const faqItemRecord = faqItem as Record<string, unknown>;
    requireFaq1Text(faqItemRecord.question, `items[${index}].question`);
    requireFaq1Text(faqItemRecord.answer, `items[${index}].answer`);
  });

  return value;
}

function requireFaq1ClassName(value: unknown): string | undefined {
  if (value === undefined || typeof value === 'string') {
    return value;
  }

  throw new Error(`Faq1 className must be a string when provided. Received ${describeFaq1Value(value)}.`);
}

export function Faq1(props: Faq1Props) {
  const faqId = useId();
  const [openItemIndex, setOpenItemIndex] = useState<number | null>(null);
  const eyebrow = requireFaq1Text(props.eyebrow, 'eyebrow');
  const title = requireFaq1Text(props.title, 'title');
  const description = requireFaq1Text(props.description, 'description');
  const items = requireFaq1Items(props.items);
  const className = requireFaq1ClassName(props.className);
  const titleId = `${faqId}-title`;
  const descriptionId = `${faqId}-description`;

  return (
    <section
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={`${FAQ1_SECTION_CLASS}${className ? ` ${className}` : ''}`}
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
        {items.map((item, index) => {
          const isExpanded = openItemIndex === index;
          const questionId = `${faqId}-question-${index}`;
          const answerId = `${faqId}-answer-${index}`;

          return (
            <article key={index}>
              <h3>
                <button
                  id={questionId}
                  aria-controls={answerId}
                  aria-expanded={isExpanded}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left font-semibold tracking-tight text-stone-50 transition-colors hover:text-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
                  type="button"
                  onClick={() => setOpenItemIndex((currentIndex) => (currentIndex === index ? null : index))}
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    aria-hidden="true"
                    className={`size-5 shrink-0 text-stone-400 transition-transform duration-200${
                      isExpanded ? ' rotate-180' : ''
                    }`}
                  />
                </button>
              </h3>
              <div id={answerId} aria-labelledby={questionId} hidden={!isExpanded} role="region">
                <p className="pb-5 pr-10 text-sm leading-7 text-stone-300 sm:text-base">{item.answer}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
