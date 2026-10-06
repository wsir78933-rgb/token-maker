import type { LanguageGeneratorWhatIsCopy } from '@/lib/language-generator/page-copy';

export function LanguageGeneratorWhatIs({
  copy,
}: {
  copy: LanguageGeneratorWhatIsCopy;
}) {
  return (
    <section
      id="language-generator-what-is"
      aria-labelledby="language-generator-what-is-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <h2
        id="language-generator-what-is-heading"
        className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl"
      >
        {copy.title}
      </h2>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
        {copy.description}
      </p>
    </section>
  );
}
