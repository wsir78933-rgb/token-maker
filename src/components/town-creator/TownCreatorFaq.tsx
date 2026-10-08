'use client';

import { ChevronDown } from 'lucide-react';
import { useId, useState } from 'react';

import type { TownCreatorCopy } from '@/lib/town-creator/copy';

export type TownCreatorFaqProps = {
  faq: TownCreatorCopy['faq'];
};

function TownCreatorFaqItem({
  item,
  itemIndex,
  faqInstanceId,
  isExpanded,
  onToggle,
}: {
  item: TownCreatorCopy['faq']['items'][number];
  itemIndex: number;
  faqInstanceId: string;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const questionId = `${faqInstanceId}-question-${itemIndex}`;
  const answerId = `${faqInstanceId}-answer-${itemIndex}`;

  return (
    <article>
      <h3>
        <button
          id={questionId}
          type="button"
          aria-controls={answerId}
          aria-expanded={isExpanded}
          className="flex w-full items-center justify-between gap-6 py-5 text-left font-semibold tracking-tight text-stone-50 transition-colors hover:text-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300 motion-reduce:transition-none"
          onClick={onToggle}
        >
          <span>{item.question}</span>
          <ChevronDown
            aria-hidden="true"
            className={`size-5 shrink-0 text-stone-400 transition-transform duration-200 motion-reduce:transition-none${
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
}

export function TownCreatorFaq({ faq }: TownCreatorFaqProps) {
  const faqInstanceId = useId();
  const [openItemIndex, setOpenItemIndex] = useState<number | null>(null);

  if (faq.items.length === 0) {
    throw new Error(`Town creator FAQ items must not be empty. Received length ${faq.items.length}.`);
  }

  const descriptionId = `${faqInstanceId}-description`;

  return (
    <section
      id="town-creator-faq"
      aria-labelledby="town-creator-faq-heading"
      aria-describedby={descriptionId}
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <header className="mx-auto mb-10 flex max-w-3xl flex-col items-center gap-3 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">{faq.eyebrow}</span>
        <h2
          id="town-creator-faq-heading"
          className="font-display font-semibold tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {faq.title}
        </h2>
        <p id={descriptionId} className="max-w-2xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {faq.description}
        </p>
      </header>

      <div className="mx-auto max-w-3xl divide-y divide-white/10 border-y border-white/10">
        {faq.items.map((item, itemIndex) => (
          <TownCreatorFaqItem
            key={item.question}
            item={item}
            itemIndex={itemIndex}
            faqInstanceId={faqInstanceId}
            isExpanded={openItemIndex === itemIndex}
            onToggle={() =>
              setOpenItemIndex((currentIndex) => (currentIndex === itemIndex ? null : itemIndex))
            }
          />
        ))}
      </div>
    </section>
  );
}
