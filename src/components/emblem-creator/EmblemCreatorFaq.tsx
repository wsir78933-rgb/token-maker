'use client';

import { useId, useState, type JSX } from 'react';

import { cn } from '@/lib/utils';

export type EmblemCreatorFaqItem = {
  question: string;
  answer: string;
};

export type EmblemCreatorFaqProps = {
  eyebrow: string;
  title: string;
  description: string;
  items: readonly EmblemCreatorFaqItem[];
  className?: string;
};

const EMBLEM_CREATOR_FAQ_SECTION_CLASS_NAME = [
  'mx-auto',
  'max-w-5xl',
  'border-t',
  'border-white/10',
  'px-5',
  'py-20',
  'text-stone-100',
  'sm:py-24',
  'lg:px-8',
  'lg:py-28',
].join(' ');

const EMBLEM_CREATOR_FAQ_HEADER_CLASS_NAME = [
  'mx-auto',
  'mb-10',
  'flex',
  'max-w-3xl',
  'flex-col',
  'items-center',
  'gap-3',
  'text-center',
].join(' ');

const EMBLEM_CREATOR_FAQ_EYEBROW_CLASS_NAME =
  'text-xs font-medium uppercase tracking-[0.18em] text-stone-400';

const EMBLEM_CREATOR_FAQ_TITLE_CLASS_NAME =
  'font-display font-semibold tracking-tight text-stone-50 text-balance';

const EMBLEM_CREATOR_FAQ_DESCRIPTION_CLASS_NAME =
  'max-w-2xl text-sm leading-7 text-stone-300 text-pretty sm:text-base';

const EMBLEM_CREATOR_FAQ_LIST_CLASS_NAME = [
  'mx-auto',
  'flex',
  'w-full',
  'max-w-2xl',
  'flex-col',
  'gap-4',
  'text-left',
].join(' ');

const EMBLEM_CREATOR_FAQ_TRIGGER_CLASS_NAME = [
  'flex',
  'w-full',
  'cursor-pointer',
  'items-center',
  'justify-between',
  'gap-4',
  'rounded-xl',
  'border',
  'border-white/10',
  'bg-white/[0.03]',
  'p-4',
  'text-left',
  'text-sm',
  'font-medium',
  'text-stone-50',
  'transition-colors',
  'duration-500',
  'ease-in-out',
  'hover:border-white/20',
  'hover:bg-white/[0.05]',
  'focus-visible:outline',
  'focus-visible:outline-2',
  'focus-visible:outline-offset-2',
  'focus-visible:outline-stone-300',
  'motion-reduce:transition-none',
].join(' ');

const EMBLEM_CREATOR_FAQ_ANSWER_CLASS_NAME = [
  'grid',
  'overflow-hidden',
  'text-sm',
  'leading-7',
  'text-stone-300',
  'text-pretty',
  'transition-[grid-template-rows,opacity]',
  'duration-500',
  'ease-in-out',
  'motion-reduce:transition-none',
].join(' ');

const EMBLEM_CREATOR_FAQ_ANSWER_TEXT_CLASS_NAME = 'min-h-0 overflow-hidden px-4';

function formatReceivedEmblemCreatorFaqValue(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (value === null) {
    return 'null';
  }

  if (value === null || typeof value !== 'object') {
    return String(value);
  }

  try {
    const serializedValue = JSON.stringify(value);
    return serializedValue === undefined ? Object.prototype.toString.call(value) : serializedValue;
  } catch (error) {
    if (error instanceof TypeError) {
      return `[unserializable value: ${error.message}]`;
    }

    throw error;
  }
}

function requireEmblemCreatorFaqText(value: unknown, fieldPath: string): string {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }

  throw new Error(
    `EmblemCreatorFaq ${fieldPath} must be a non-empty string. Received ${formatReceivedEmblemCreatorFaqValue(value)}.`,
  );
}

function requireEmblemCreatorFaqItems(value: unknown): readonly EmblemCreatorFaqItem[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(
      `EmblemCreatorFaq items must be a non-empty array. Received ${formatReceivedEmblemCreatorFaqValue(value)}.`,
    );
  }

  value.forEach((faqItem: unknown, itemIndex: number) => {
    if (faqItem === null || typeof faqItem !== 'object' || Array.isArray(faqItem)) {
      throw new Error(
        `EmblemCreatorFaq items[${itemIndex}] must be an object. Received ${formatReceivedEmblemCreatorFaqValue(faqItem)}.`,
      );
    }

    const faqItemRecord = faqItem as Record<string, unknown>;
    requireEmblemCreatorFaqText(faqItemRecord.question, `items[${itemIndex}].question`);
    requireEmblemCreatorFaqText(faqItemRecord.answer, `items[${itemIndex}].answer`);
  });

  return value as readonly EmblemCreatorFaqItem[];
}

function requireEmblemCreatorFaqClassName(value: unknown): string | undefined {
  if (value === undefined || typeof value === 'string') {
    return value;
  }

  throw new Error(
    `EmblemCreatorFaq className must be a string when provided. Received ${formatReceivedEmblemCreatorFaqValue(value)}.`,
  );
}

function emblemCreatorFaqAnswerClassName(isOpen: boolean): string {
  return cn(
    EMBLEM_CREATOR_FAQ_ANSWER_CLASS_NAME,
    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
  );
}

function EmblemCreatorFaqChevron({ isOpen }: { isOpen: boolean }): JSX.Element {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className={cn(
        'size-[18px] shrink-0 transition-transform duration-500 ease-in-out motion-reduce:transition-none',
        isOpen && 'rotate-180',
      )}
      aria-hidden="true"
    >
      <path
        d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EmblemCreatorFaqItemRow({
  idPrefix,
  item,
  itemIndex,
  isOpen,
  onToggle,
}: {
  idPrefix: string;
  item: EmblemCreatorFaqItem;
  itemIndex: number;
  isOpen: boolean;
  onToggle: () => void;
}): JSX.Element {
  const questionId = `${idPrefix}-question-${itemIndex}`;
  const answerId = `${idPrefix}-answer-${itemIndex}`;

  return (
    <article className="w-full">
      <h3 className="w-full">
        <button
          id={questionId}
          type="button"
          className={EMBLEM_CREATOR_FAQ_TRIGGER_CLASS_NAME}
          aria-expanded={isOpen}
          aria-controls={answerId}
          onClick={onToggle}
        >
          <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">{item.question}</span>
          <EmblemCreatorFaqChevron isOpen={isOpen} />
        </button>
      </h3>
      <div
        id={answerId}
        role="region"
        aria-labelledby={questionId}
        aria-hidden={!isOpen}
        className={emblemCreatorFaqAnswerClassName(isOpen)}
      >
        <div className={EMBLEM_CREATOR_FAQ_ANSWER_TEXT_CLASS_NAME}>
          <p className="py-4 [overflow-wrap:anywhere]">{item.answer}</p>
        </div>
      </div>
    </article>
  );
}

export function EmblemCreatorFaq(props: EmblemCreatorFaqProps): JSX.Element {
  const faqId = useId();
  const [openItemIndex, setOpenItemIndex] = useState<number | null>(null);
  const eyebrow = requireEmblemCreatorFaqText(props.eyebrow, 'eyebrow');
  const title = requireEmblemCreatorFaqText(props.title, 'title');
  const description = requireEmblemCreatorFaqText(props.description, 'description');
  const items = requireEmblemCreatorFaqItems(props.items);
  const className = requireEmblemCreatorFaqClassName(props.className);
  const titleId = `${faqId}-title`;
  const descriptionId = `${faqId}-description`;

  return (
    <section
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={cn(EMBLEM_CREATOR_FAQ_SECTION_CLASS_NAME, className)}
    >
      <header className={EMBLEM_CREATOR_FAQ_HEADER_CLASS_NAME}>
        <p className={EMBLEM_CREATOR_FAQ_EYEBROW_CLASS_NAME}>{eyebrow}</p>
        <h2
          id={titleId}
          className={EMBLEM_CREATOR_FAQ_TITLE_CLASS_NAME}
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {title}
        </h2>
        <p id={descriptionId} className={EMBLEM_CREATOR_FAQ_DESCRIPTION_CLASS_NAME}>
          {description}
        </p>
      </header>

      <div className={EMBLEM_CREATOR_FAQ_LIST_CLASS_NAME}>
        {items.map((item, itemIndex) => (
          <EmblemCreatorFaqItemRow
            key={itemIndex}
            idPrefix={faqId}
            item={item}
            itemIndex={itemIndex}
            isOpen={openItemIndex === itemIndex}
            onToggle={() => {
              setOpenItemIndex((currentItemIndex) =>
                currentItemIndex === itemIndex ? null : itemIndex,
              );
            }}
          />
        ))}
      </div>
    </section>
  );
}
