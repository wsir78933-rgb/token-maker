'use client';

import { ChevronDown } from 'lucide-react';
import { useId, useState } from 'react';

import type { WeaponCreatorFaqItemCopy } from '@/lib/weapon-creator/copy';

export function WeaponCreatorFaq({
  eyebrow,
  title,
  description,
  items,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: readonly WeaponCreatorFaqItemCopy[];
}) {
  const faqId = useId();
  const [openItemIndex, setOpenItemIndex] = useState<number | null>(null);
  const titleId = `${faqId}-title`;
  const descriptionId = `${faqId}-description`;

  if (items.length === 0) {
    throw new Error('Weapon creator FAQ items must not be empty. Received length 0.');
  }

  return (
    <section
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
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
        {items.map((item, index) => {
          const isExpanded = openItemIndex === index;
          const questionId = `${faqId}-question-${index}`;
          const answerId = `${faqId}-answer-${index}`;

          return (
            <article key={item.question}>
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
