'use client';

import type { SyntheticEvent } from 'react';
import { ChevronDownIcon } from 'lucide-react';

import type { SiteLocale } from '@/lib/site-locale';

interface CoatMakerFaqItem {
  question: string;
  answer: string;
}

const COAT_MAKER_FAQ_ACCORDION_NAME = 'coat-maker-faq';

function assertCoatMakerFaqItems(faqItems: readonly CoatMakerFaqItem[], locale: SiteLocale) {
  if (locale.trim() === '') {
    throw new Error(`Coat Maker FAQ locale is empty: ${locale}`);
  }

  if (faqItems.length === 0) {
    throw new Error(`Coat Maker FAQ items are empty for locale: ${locale}`);
  }

  const seenQuestions = new Set<string>();
  for (const faqItem of faqItems) {
    if (seenQuestions.has(faqItem.question)) {
      throw new Error(`Duplicate Coat Maker FAQ question: ${faqItem.question}`);
    }

    seenQuestions.add(faqItem.question);
  }
}

function coatMakerFaqTriggerId(locale: SiteLocale, faqIndex: number) {
  return `coat-maker-faq-trigger-${locale}-${faqIndex}`;
}

function coatMakerFaqPanelId(locale: SiteLocale, faqIndex: number) {
  return `coat-maker-faq-panel-${locale}-${faqIndex}`;
}

function closeOtherOpenCoatMakerFaqDetails(openedDetails: HTMLDetailsElement) {
  const accordionRoot = openedDetails.parentElement;

  if (accordionRoot === null) {
    const summaryId = openedDetails.querySelector('summary')?.id ?? 'missing-summary';
    throw new Error(`Coat Maker FAQ details has no parent accordion root for summary: ${summaryId}`);
  }

  for (const siblingNode of accordionRoot.querySelectorAll(':scope > details')) {
    if (!(siblingNode instanceof HTMLDetailsElement)) {
      throw new Error(`Coat Maker FAQ accordion child is not a details element: ${siblingNode.nodeName}`);
    }

    if (siblingNode !== openedDetails) {
      siblingNode.open = false;
    }
  }
}

function handleCoatMakerFaqSummaryClick(clickEvent: SyntheticEvent<HTMLElement>) {
  const summary = clickEvent.currentTarget;
  const clickedDetails = summary.parentElement;

  if (!(clickedDetails instanceof HTMLDetailsElement)) {
    throw new Error(`Coat Maker FAQ summary is not inside details: ${summary.id}`);
  }

  closeOtherOpenCoatMakerFaqDetails(clickedDetails);
}

function CoatMakerFaqAccordionItem({
  triggerId,
  panelId,
  faqItem,
}: {
  triggerId: string;
  panelId: string;
  faqItem: CoatMakerFaqItem;
}) {
  return (
    <details
      name={COAT_MAKER_FAQ_ACCORDION_NAME}
      className="group border-b border-white/10 last:border-b-0"
    >
      <summary
        id={triggerId}
        role="button"
        className="flex min-h-11 w-full cursor-pointer list-none items-center justify-between gap-4 py-3.5 text-left text-sm text-stone-100 hover:text-[#f1d492] [&::-webkit-details-marker]:hidden"
        onClick={handleCoatMakerFaqSummaryClick}
      >
        <h3 className="m-0 min-w-0 flex-1 text-sm font-normal">{faqItem.question}</h3>
        <ChevronDownIcon
          aria-hidden="true"
          className="pointer-events-none size-4 shrink-0 opacity-60 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
        />
      </summary>
      <div id={panelId} aria-labelledby={triggerId}>
        <p className="pb-4 leading-7 text-stone-300 text-pretty">{faqItem.answer}</p>
      </div>
    </details>
  );
}

export function CoatMakerFaqAccordion({
  locale,
  faqItems,
}: {
  locale: SiteLocale;
  faqItems: readonly CoatMakerFaqItem[];
}) {
  assertCoatMakerFaqItems(faqItems, locale);

  return (
    <div className="mt-6">
      {faqItems.map((faqItem, faqIndex) => (
        <CoatMakerFaqAccordionItem
          key={faqItem.question}
          triggerId={coatMakerFaqTriggerId(locale, faqIndex)}
          panelId={coatMakerFaqPanelId(locale, faqIndex)}
          faqItem={faqItem}
        />
      ))}
    </div>
  );
}
