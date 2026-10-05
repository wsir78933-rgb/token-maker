import { ArrowRight } from 'lucide-react';

import type { EmblemCreatorCopy } from '@/lib/emblem-creator/copy';

type EmblemCreatorHowItWorksStepCopy = EmblemCreatorCopy['howItWorks']['steps'][number];

function describeEmblemCreatorHowItWorksValue(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (value === null) {
    return 'null';
  }

  if (typeof value !== 'object') {
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

function requireEmblemCreatorHowItWorksText(value: unknown, fieldPath: string): string {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }

  throw new Error(
    `EmblemCreatorHowItWorks ${fieldPath} must be a non-empty string. Received ${describeEmblemCreatorHowItWorksValue(value)}.`,
  );
}

function assertEmblemCreatorHowItWorksCopy(
  copy: EmblemCreatorCopy['howItWorks'],
): void {
  if (copy === null || typeof copy !== 'object' || Array.isArray(copy)) {
    throw new Error(
      `EmblemCreatorHowItWorks copy must be an object. Received ${describeEmblemCreatorHowItWorksValue(copy)}.`,
    );
  }

  const howItWorksRecord = copy as {
    eyebrow?: unknown;
    title?: unknown;
    label?: unknown;
    steps?: unknown;
  };

  requireEmblemCreatorHowItWorksText(howItWorksRecord.eyebrow, 'copy.eyebrow');
  requireEmblemCreatorHowItWorksText(howItWorksRecord.title, 'copy.title');
  requireEmblemCreatorHowItWorksText(howItWorksRecord.label, 'copy.label');

  if (!Array.isArray(howItWorksRecord.steps) || howItWorksRecord.steps.length !== 4) {
    throw new Error(
      `EmblemCreatorHowItWorks copy.steps must contain exactly 4 items. Received ${describeEmblemCreatorHowItWorksValue(howItWorksRecord.steps)}.`,
    );
  }

  howItWorksRecord.steps.forEach((step, stepIndex) => {
    if (step === null || typeof step !== 'object' || Array.isArray(step)) {
      throw new Error(
        `EmblemCreatorHowItWorks copy.steps[${stepIndex}] must be an object. Received ${describeEmblemCreatorHowItWorksValue(step)}.`,
      );
    }

    const stepRecord = step as { title?: unknown; description?: unknown };
    requireEmblemCreatorHowItWorksText(
      stepRecord.title,
      `copy.steps[${stepIndex}].title`,
    );
    requireEmblemCreatorHowItWorksText(
      stepRecord.description,
      `copy.steps[${stepIndex}].description`,
    );
  });
}

function formatEmblemCreatorStepNumber(stepIndex: number): string {
  return String(stepIndex + 1).padStart(2, '0');
}

function EmblemCreatorHowItWorksStep({
  step,
  stepIndex,
  isLastStep,
}: {
  step: EmblemCreatorHowItWorksStepCopy;
  stepIndex: number;
  isLastStep: boolean;
}) {
  return (
    <li className="relative flex min-w-0 flex-col items-center gap-4 text-center">
      <div className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border border-white/15 bg-background">
        <span className="text-xs font-semibold tabular-nums text-stone-400">
          {formatEmblemCreatorStepNumber(stepIndex)}
        </span>
      </div>
      <div className="flex min-w-0 flex-col items-center gap-2">
        <h3 className="max-w-xs break-words font-semibold tracking-tight text-stone-50">
          {step.title}
        </h3>
        <p className="max-w-xs break-words text-sm leading-relaxed text-stone-300 text-pretty">
          {step.description}
        </p>
      </div>
      {!isLastStep && (
        <ArrowRight aria-hidden="true" className="mt-2 size-4 text-stone-500 md:hidden" />
      )}
    </li>
  );
}

export function EmblemCreatorHowItWorks({
  copy,
}: {
  copy: EmblemCreatorCopy['howItWorks'];
}) {
  assertEmblemCreatorHowItWorksCopy(copy);

  return (
    <section
      aria-labelledby="emblem-creator-how-it-works-heading"
      className="mx-auto max-w-5xl py-20 text-stone-100 sm:py-24 lg:py-28"
    >
      <header className="mb-14 flex flex-col items-center gap-3 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
          {copy.eyebrow}
        </span>
        <h2
          id="emblem-creator-how-it-works-heading"
          className="font-display font-semibold tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {copy.title}
        </h2>
      </header>

      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-6 hidden h-px bg-white/15 md:block"
        />
        <ol aria-label={copy.label} className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {copy.steps.map((step, stepIndex) => (
            <EmblemCreatorHowItWorksStep
              key={step.title}
              step={step}
              stepIndex={stepIndex}
              isLastStep={stepIndex === copy.steps.length - 1}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
