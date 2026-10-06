'use client';

import { useId } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function DiceRollerFaq({
  eyebrow,
  title,
  description,
  items,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: readonly { question: string; answer: string }[];
}) {
  const faqId = useId();
  const titleId = `${faqId}-title`;
  const descriptionId = `${faqId}-description`;

  if (items.length === 0) {
    throw new Error('Dice roller FAQ items must not be empty. Received length 0.');
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

      <Accordion
        aria-labelledby={titleId}
        className="mx-auto max-w-3xl divide-y divide-white/10 border-y border-white/10"
      >
        {items.map((item, index) => (
          <AccordionItem key={`${item.question}-${index}`} value={`${faqId}-${index}`} className="border-b-0">
            <AccordionTrigger id={`${faqId}-question-${index}`} className="min-h-11 gap-6 py-5 tracking-tight text-stone-50 hover:text-amber-200 hover:no-underline focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300 focus-visible:ring-0">
              {item.question}
            </AccordionTrigger>
            <AccordionContent aria-labelledby={`${faqId}-question-${index}`} className="pb-0">
              <p className="pb-5 pr-10 text-sm leading-7 text-stone-300 sm:text-base">{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
