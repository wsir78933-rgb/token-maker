'use client';

import {
  Archive,
  ArrowRight,
  ChevronDown,
  History,
  PenLine,
  Printer,
  Search,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useId, useState } from 'react';

import { ToolRecommendationSection } from '@/components/site/ToolRecommendationSection';
import { Button } from '@/components/ui/button';
import {
  POPULATION_GENERATOR_WORKSPACE_ID,
  type PopulationGeneratorPageCopy,
} from '@/lib/population-generator/page-copy';
import type { SiteLocale } from '@/lib/site-locale';

import { PopulationGeneratorHelp } from './PopulationGeneratorHelp';

const POPULATION_GENERATOR_FEATURE_COUNT = 6;
const POPULATION_GENERATOR_HOW_TO_STEP_COUNT = 4;
const POPULATION_CONTENT_REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const POPULATION_GENERATOR_SECTION_CLASS_NAME =
  'mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28';
const POPULATION_GENERATOR_TEXT_HEADING_CLASS_NAME =
  'font-display text-2xl font-semibold leading-tight text-balance text-stone-50 sm:text-3xl';
const POPULATION_GENERATOR_FEATURE_HEADING_CLASS_NAME =
  'font-display font-semibold leading-tight tracking-tight text-balance text-stone-50';
const POPULATION_GENERATOR_DISPLAY_HEADING_CLASS_NAME =
  'font-display font-semibold tracking-tight text-balance text-stone-50';
const POPULATION_GENERATOR_DISPLAY_HEADING_STYLE = {
  fontSize: 'clamp(1.85rem, 4vw, 2.75rem)',
  letterSpacing: '-0.03em',
} as const;
const POPULATION_GENERATOR_BODY_CLASS_NAME =
  'mt-4 max-w-3xl text-sm leading-7 text-pretty text-stone-300 sm:text-base';
const POPULATION_GENERATOR_FEATURE_CARD_CLASS_NAME =
  'h-full rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.045] motion-reduce:transition-none';
const POPULATION_GENERATOR_FEATURE_ICON_TILE_CLASS_NAME =
  'mb-5 flex size-11 items-center justify-center rounded-xl border border-amber-200/15 bg-amber-300/[0.08] text-amber-200';
// Four columns share one row only at lg, so the rule is lg:block.
// A single column exists only below sm, so the arrows are sm:hidden.
const POPULATION_GENERATOR_HOW_TO_GRID_CLASS_NAME =
  'grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4';
const POPULATION_GENERATOR_HOW_TO_CONNECTOR_CLASS_NAME =
  'pointer-events-none absolute inset-x-0 top-6 hidden h-px bg-white/15 lg:block';
const POPULATION_GENERATOR_HOW_TO_ARROW_CLASS_NAME = 'mt-2 size-4 text-stone-400/40 sm:hidden';
const POPULATION_GENERATOR_FEATURE_ICONS = [
  History,
  PenLine,
  Users,
  Search,
  Archive,
  Printer,
] as const satisfies readonly LucideIcon[];

function requirePopulationGeneratorText(value: string, fieldName: string): string {
  if (value.trim() === '') {
    throw new Error(`Population generator ${fieldName} must be a non-empty string. Received ${JSON.stringify(value)}.`);
  }

  return value;
}

function requireUniquePopulationGeneratorLabels(labels: readonly string[], fieldName: string): void {
  const seenLabels = new Set<string>();

  for (const label of labels) {
    if (seenLabels.has(label)) {
      throw new Error(`Population generator ${fieldName} repeats ${JSON.stringify(label)}.`);
    }

    seenLabels.add(label);
  }
}

function requirePopulationFeatureIcons(): readonly LucideIcon[] {
  if (POPULATION_GENERATOR_FEATURE_ICONS.length !== POPULATION_GENERATOR_FEATURE_COUNT) {
    throw new Error(
      `Population generator feature icons must contain ${POPULATION_GENERATOR_FEATURE_COUNT} icons. Received ${POPULATION_GENERATOR_FEATURE_ICONS.length}.`,
    );
  }

  return POPULATION_GENERATOR_FEATURE_ICONS;
}

function requirePopulationFeatureIcon(featureIcons: readonly LucideIcon[], featureIndex: number): LucideIcon {
  const featureIcon = featureIcons[featureIndex];

  if (featureIcon === undefined) {
    throw new Error(
      `Population generator feature icon is missing at index ${featureIndex}. Received undefined.`,
    );
  }

  return featureIcon;
}

function requirePopulationContentWorkspace(): HTMLElement {
  const workspace = document.getElementById(POPULATION_GENERATOR_WORKSPACE_ID);

  if (workspace === null) {
    throw new Error(
      `Population generator workspace is missing. id=${JSON.stringify(POPULATION_GENERATOR_WORKSPACE_ID)}. Received null.`,
    );
  }

  return workspace;
}

function readPopulationContentScrollBehavior(): ScrollBehavior {
  if (typeof window.matchMedia !== 'function') {
    throw new Error(
      `Population generator call to action cannot read motion preference. window.matchMedia is ${typeof window.matchMedia}.`,
    );
  }

  return window.matchMedia(POPULATION_CONTENT_REDUCED_MOTION_QUERY).matches ? 'instant' : 'smooth';
}

function scrollPopulationCallToActionToWorkspace(): void {
  const workspace = requirePopulationContentWorkspace();

  workspace.scrollIntoView({
    behavior: readPopulationContentScrollBehavior(),
    block: 'start',
  });
}

function PopulationGeneratorWhatIs({ copy }: { copy: PopulationGeneratorPageCopy['whatIs'] }) {
  return (
    <section
      aria-labelledby="population-generator-what-is-heading"
      className={POPULATION_GENERATOR_SECTION_CLASS_NAME}
    >
      <h2 id="population-generator-what-is-heading" className={POPULATION_GENERATOR_TEXT_HEADING_CLASS_NAME}>
        {requirePopulationGeneratorText(copy.title, 'what is title')}
      </h2>
      <p className={POPULATION_GENERATOR_BODY_CLASS_NAME}>
        {requirePopulationGeneratorText(copy.body, 'what is body')}
      </p>
    </section>
  );
}

function PopulationGeneratorFeatures({ copy }: { copy: PopulationGeneratorPageCopy['features'] }) {
  if (copy.items.length !== POPULATION_GENERATOR_FEATURE_COUNT) {
    throw new Error(
      `Population generator features must contain ${POPULATION_GENERATOR_FEATURE_COUNT} items. Received ${copy.items.length}: ${JSON.stringify(copy.items.map((item) => item.title))}.`,
    );
  }

  requireUniquePopulationGeneratorLabels(
    copy.items.map((item) => item.title),
    'feature titles',
  );
  const featureIcons = requirePopulationFeatureIcons();

  return (
    <section
      aria-labelledby="population-generator-features-heading"
      className={POPULATION_GENERATOR_SECTION_CLASS_NAME}
    >
      <header className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
        <h2
          id="population-generator-features-heading"
          className={POPULATION_GENERATOR_FEATURE_HEADING_CLASS_NAME}
          style={POPULATION_GENERATOR_DISPLAY_HEADING_STYLE}
        >
          {requirePopulationGeneratorText(copy.title, 'features title')}
        </h2>
        <p className="mt-4 text-sm leading-7 text-pretty text-stone-300 sm:text-base">
          {requirePopulationGeneratorText(copy.intro, 'features intro')}
        </p>
      </header>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {copy.items.map((item, featureIndex) => {
          const FeatureIcon = requirePopulationFeatureIcon(featureIcons, featureIndex);

          return (
            <li key={item.title} className="min-w-0">
              <article className={POPULATION_GENERATOR_FEATURE_CARD_CLASS_NAME}>
                <div aria-hidden="true" className={POPULATION_GENERATOR_FEATURE_ICON_TILE_CLASS_NAME}>
                  <FeatureIcon className="size-5" strokeWidth={2} />
                </div>
                <h3 className="font-semibold leading-snug tracking-tight text-stone-50">
                  {requirePopulationGeneratorText(item.title, 'feature title')}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-300">
                  {requirePopulationGeneratorText(item.description, `feature description for ${item.title}`)}
                </p>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function PopulationGeneratorHowToUse({ copy }: { copy: PopulationGeneratorPageCopy['howToUse'] }) {
  if (copy.steps.length !== POPULATION_GENERATOR_HOW_TO_STEP_COUNT) {
    throw new Error(
      `Population generator how-to steps must contain ${POPULATION_GENERATOR_HOW_TO_STEP_COUNT} steps. Received ${copy.steps.length}: ${JSON.stringify(copy.steps.map((step) => step.title))}.`,
    );
  }

  requireUniquePopulationGeneratorLabels(
    copy.steps.map((step) => step.title),
    'how-to step titles',
  );

  return (
    <section
      aria-labelledby="population-generator-how-to-use-heading"
      className={POPULATION_GENERATOR_SECTION_CLASS_NAME}
    >
      <div className="flex flex-col items-center text-center">
        <h2
          id="population-generator-how-to-use-heading"
          className={POPULATION_GENERATOR_DISPLAY_HEADING_CLASS_NAME}
          style={POPULATION_GENERATOR_DISPLAY_HEADING_STYLE}
        >
          {requirePopulationGeneratorText(copy.title, 'how to use title')}
        </h2>
        <p className={`${POPULATION_GENERATOR_BODY_CLASS_NAME} mx-auto`}>
          {requirePopulationGeneratorText(copy.intro, 'how to use intro')}
        </p>
      </div>
      <div className="relative mt-8">
        <div aria-hidden="true" className={POPULATION_GENERATOR_HOW_TO_CONNECTOR_CLASS_NAME} />
        <ol className={POPULATION_GENERATOR_HOW_TO_GRID_CLASS_NAME}>
          {copy.steps.map((step, stepIndex) => (
            <li key={step.title} className="relative flex flex-col items-center gap-4 text-center">
              <div className="relative z-10 flex size-12 items-center justify-center rounded-full border border-white/10 bg-background">
                <span className="text-xs font-semibold tabular-nums text-stone-400">
                  {String(stepIndex + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold tracking-tight text-stone-50">
                  {requirePopulationGeneratorText(step.title, 'how to use step title')}
                </h3>
                <p className="text-sm leading-relaxed text-stone-300">
                  {requirePopulationGeneratorText(step.description, `how to use step description for ${step.title}`)}
                </p>
              </div>
              {stepIndex < copy.steps.length - 1 ? (
                <ArrowRight aria-hidden="true" className={POPULATION_GENERATOR_HOW_TO_ARROW_CLASS_NAME} />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function PopulationGeneratorFaq({ copy }: { copy: PopulationGeneratorPageCopy['faq'] }) {
  const faqId = useId();
  const [openItemIndex, setOpenItemIndex] = useState<number | null>(null);
  const titleId = `${faqId}-title`;
  const descriptionId = `${faqId}-description`;

  if (copy.items.length === 0) {
    throw new Error('Population generator FAQ items must not be empty. Received length 0.');
  }

  return (
    <section
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={POPULATION_GENERATOR_SECTION_CLASS_NAME}
    >
      <header className="mx-auto mb-10 flex max-w-3xl flex-col items-center gap-3 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">{copy.eyebrow}</span>
        <h2
          id={titleId}
          className={POPULATION_GENERATOR_DISPLAY_HEADING_CLASS_NAME}
          style={POPULATION_GENERATOR_DISPLAY_HEADING_STYLE}
        >
          {requirePopulationGeneratorText(copy.title, 'FAQ title')}
        </h2>
        <p id={descriptionId} className="max-w-2xl text-sm leading-7 text-pretty text-stone-300 sm:text-base">
          {requirePopulationGeneratorText(copy.description, 'FAQ description')}
        </p>
      </header>
      <div className="mx-auto max-w-3xl divide-y divide-white/10 border-y border-white/10">
        {copy.items.map((item, index) => {
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
                  className="flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left font-semibold tracking-tight text-stone-50 transition-colors hover:text-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300 motion-reduce:transition-none"
                  type="button"
                  onClick={() => setOpenItemIndex((currentIndex) => (currentIndex === index ? null : index))}
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
                <p className="pr-10 pb-5 text-sm leading-7 text-stone-300 sm:text-base">{item.answer}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function PopulationGeneratorCallToAction({ copy }: { copy: PopulationGeneratorPageCopy['cta'] }) {
  return (
    <section
      id="population-generator-call-to-action"
      aria-labelledby="population-generator-call-to-action-title"
      className={`${POPULATION_GENERATOR_SECTION_CLASS_NAME} text-center`}
    >
      <h2
        id="population-generator-call-to-action-title"
        className={POPULATION_GENERATOR_TEXT_HEADING_CLASS_NAME}
      >
        {requirePopulationGeneratorText(copy.title, 'call to action title')}
      </h2>
      <p className={`${POPULATION_GENERATOR_BODY_CLASS_NAME} mx-auto`}>
        {requirePopulationGeneratorText(copy.description, 'call to action description')}
      </p>
      <Button
        type="button"
        size="lg"
        className="mt-8 h-11 min-h-11 min-w-11 max-w-full cursor-pointer rounded-full px-8"
        onClick={scrollPopulationCallToActionToWorkspace}
      >
        {requirePopulationGeneratorText(copy.buttonText, 'call to action button text')}
        <ArrowRight aria-hidden="true" className="size-4" />
      </Button>
    </section>
  );
}

export function PopulationGeneratorContent({
  copy,
  locale,
}: {
  copy: PopulationGeneratorPageCopy;
  locale: SiteLocale;
}) {
  return (
    <>
      <PopulationGeneratorWhatIs copy={copy.whatIs} />
      <PopulationGeneratorFeatures copy={copy.features} />
      <PopulationGeneratorHowToUse copy={copy.howToUse} />
      <PopulationGeneratorHelp locale={locale} />
      <PopulationGeneratorFaq copy={copy.faq} />
      <ToolRecommendationSection locale={locale} currentPath="/population-generator" />
      <PopulationGeneratorCallToAction copy={copy.cta} />
    </>
  );
}
