import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { LanguageGeneratorCallToActionCopy } from '@/lib/language-generator/page-copy';

export function LanguageGeneratorCallToAction({
  copy,
}: {
  copy: LanguageGeneratorCallToActionCopy;
}) {
  return (
    <section
      id="language-generator-call-to-action"
      aria-labelledby="language-generator-call-to-action-title"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <h2
          id="language-generator-call-to-action-title"
          className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl"
        >
          {copy.title}
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {copy.description}
        </p>
        <Button
          size="lg"
          className="mt-2 h-11 rounded-full px-8"
          nativeButton={false}
          render={<a href="#language-generator-workspace" />}
        >
          {copy.action}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </section>
  );
}
