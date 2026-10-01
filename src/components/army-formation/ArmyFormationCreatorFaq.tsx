'use client';

import { useId, useState } from 'react';

import { cn } from '@/lib/utils';

export type ArmyFormationCreatorFaqItem = {
  question: string;
  answer: string;
};

export type ArmyFormationCreatorFaqProps = {
  eyebrow: string;
  title: string;
  description: string;
  items: readonly ArmyFormationCreatorFaqItem[];
  className?: string;
};

const ARMY_FORMATION_FAQ_ROOT_CLASS_NAME = [
  'flex',
  'flex-col',
  'items-center',
  'px-3',
  'text-center',
  'text-stone-100',
].join(' ');
const ARMY_FORMATION_FAQ_EYEBROW_CLASS_NAME =
  'text-xs font-medium uppercase tracking-[0.18em] text-stone-400';
const ARMY_FORMATION_FAQ_TITLE_CLASS_NAME =
  'mt-2 font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl';
const ARMY_FORMATION_FAQ_DESCRIPTION_CLASS_NAME =
  'mt-4 max-w-xl text-sm leading-7 text-stone-300 text-pretty sm:text-base';
const ARMY_FORMATION_FAQ_LIST_CLASS_NAME =
  'mt-6 flex w-full max-w-2xl flex-col gap-4 text-left';
const ARMY_FORMATION_FAQ_TRIGGER_CLASS_NAME = [
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
  'hover:border-white/20',
  'hover:bg-white/[0.05]',
  'focus-visible:outline',
  'focus-visible:outline-2',
  'focus-visible:outline-offset-2',
  'focus-visible:outline-stone-300',
].join(' ');
const ARMY_FORMATION_FAQ_ANSWER_BASE_CLASS_NAME = [
  'overflow-hidden',
  'px-4',
  'text-sm',
  'leading-7',
  'text-stone-300',
  'text-pretty',
  'transition-all',
  'duration-500',
  'ease-in-out',
  'motion-reduce:transition-none',
].join(' ');
const ARMY_FORMATION_FAQ_ANSWER_OPEN_CLASS_NAME =
  'max-h-[300px] translate-y-0 pt-4 opacity-100';
const ARMY_FORMATION_FAQ_ANSWER_CLOSED_CLASS_NAME =
  'pointer-events-none max-h-0 -translate-y-2 opacity-0';

function armyFormationFaqAnswerClassName(isOpen: boolean): string {
  return cn(
    ARMY_FORMATION_FAQ_ANSWER_BASE_CLASS_NAME,
    isOpen
      ? ARMY_FORMATION_FAQ_ANSWER_OPEN_CLASS_NAME
      : ARMY_FORMATION_FAQ_ANSWER_CLOSED_CLASS_NAME,
  );
}

function ArmyFormationCreatorFaqChevron({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className={cn(
        'shrink-0 transition-transform duration-500 ease-in-out motion-reduce:transition-none',
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

function ArmyFormationCreatorFaqItemRow({
  idPrefix,
  item,
  itemIndex,
  isOpen,
  onToggle,
}: {
  idPrefix: string;
  item: ArmyFormationCreatorFaqItem;
  itemIndex: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const triggerId = `${idPrefix}-trigger-${itemIndex}`;
  const answerId = `${idPrefix}-answer-${itemIndex}`;

  return (
    <article className="w-full">
      <h3 className="w-full">
        <button
          id={triggerId}
          type="button"
          className={ARMY_FORMATION_FAQ_TRIGGER_CLASS_NAME}
          aria-expanded={isOpen}
          aria-controls={answerId}
          onClick={onToggle}
        >
          <span className="min-w-0 flex-1">{item.question}</span>
          <ArmyFormationCreatorFaqChevron isOpen={isOpen} />
        </button>
      </h3>
      <div
        id={answerId}
        role="region"
        aria-labelledby={triggerId}
        aria-hidden={!isOpen}
        className={armyFormationFaqAnswerClassName(isOpen)}
      >
        <p>{item.answer}</p>
      </div>
    </article>
  );
}

export function ArmyFormationCreatorFaq({
  eyebrow,
  title,
  description,
  items,
  className,
}: ArmyFormationCreatorFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        'mt-12 border-t border-white/10 pt-10',
        ARMY_FORMATION_FAQ_ROOT_CLASS_NAME,
        className,
      )}
    >
      <p className={ARMY_FORMATION_FAQ_EYEBROW_CLASS_NAME}>{eyebrow}</p>
      <h2 id={headingId} className={ARMY_FORMATION_FAQ_TITLE_CLASS_NAME}>
        {title}
      </h2>
      <p className={ARMY_FORMATION_FAQ_DESCRIPTION_CLASS_NAME}>{description}</p>
      <div className={ARMY_FORMATION_FAQ_LIST_CLASS_NAME}>
        {items.map((item, itemIndex) => (
          <ArmyFormationCreatorFaqItemRow
            key={item.question}
            idPrefix={headingId}
            item={item}
            itemIndex={itemIndex}
            isOpen={openIndex === itemIndex}
            onToggle={() => {
              setOpenIndex((currentOpenIndex) =>
                currentOpenIndex === itemIndex ? null : itemIndex,
              );
            }}
          />
        ))}
      </div>
    </section>
  );
}
