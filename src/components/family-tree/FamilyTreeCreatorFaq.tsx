'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { FamilyTreePageContent } from '@/lib/family-tree/page-content';

const FAMILY_TREE_FAQ_HEADING_ID = 'family-tree-faq-heading';
const FAMILY_TREE_FAQ_DESCRIPTION_ID = 'family-tree-faq-description';

function requireFamilyTreeFaqItems(
  items: FamilyTreePageContent['faq']['items'],
): FamilyTreePageContent['faq']['items'] {
  if (items.length === 0) {
    throw new Error(
      `Family tree FAQ items must not be empty. Received length ${items.length}.`,
    );
  }

  return items;
}

export function FamilyTreeCreatorFaq({
  faq,
}: {
  readonly faq: FamilyTreePageContent['faq'];
}) {
  const faqItems = requireFamilyTreeFaqItems(faq.items);

  return (
    <section
      aria-labelledby={FAMILY_TREE_FAQ_HEADING_ID}
      aria-describedby={FAMILY_TREE_FAQ_DESCRIPTION_ID}
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <header className="mx-auto mb-10 flex max-w-3xl flex-col items-center gap-3 text-center">
        <h2
          id={FAMILY_TREE_FAQ_HEADING_ID}
          className="font-display font-semibold tracking-tight text-stone-50 text-balance"
          style={{
            fontSize: 'clamp(1.85rem, 4vw, 2.75rem)',
            letterSpacing: '-0.03em',
          }}
        >
          {faq.title}
        </h2>
        <p
          id={FAMILY_TREE_FAQ_DESCRIPTION_ID}
          className="max-w-2xl text-sm leading-7 text-stone-300 text-pretty sm:text-base"
        >
          {faq.description}
        </p>
      </header>

      <div className="mx-auto max-w-3xl border-y border-white/10">
        <Accordion>
          {faqItems.map((item, itemIndex) => {
            const itemValue = `family-tree-faq-${itemIndex}`;

            return (
              <AccordionItem
                key={itemValue}
                value={itemValue}
                className="border-white/10"
              >
                <AccordionTrigger className="min-h-11 text-stone-50 focus-visible:ring-stone-300/80">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-stone-300 leading-7 sm:text-base">
                  <p>{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
}
