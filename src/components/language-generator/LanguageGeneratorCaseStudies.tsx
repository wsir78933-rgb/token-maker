import type { LanguageGeneratorCaseStudiesCopy } from '@/lib/language-generator/page-copy';

export function LanguageGeneratorCaseStudies({
  copy,
}: {
  copy: LanguageGeneratorCaseStudiesCopy;
}) {
  return (
    <section
      id="language-generator-case-studies"
      aria-labelledby="language-generator-case-studies-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <header className="max-w-3xl">
        <h2
          id="language-generator-case-studies-heading"
          className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl"
        >
          {copy.title}
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {copy.description}
        </p>
      </header>

      <ul className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {copy.cases.map((caseStudy) => (
          <li key={caseStudy.id} className="min-w-0">
            <article className="flex h-full min-w-0 flex-col rounded-2xl border border-white/10 bg-white/[0.025] p-6">
              <h3 className="font-display text-xl font-semibold leading-snug text-stone-50 text-balance">
                {caseStudy.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-stone-400">
                <span className="text-stone-300">{copy.presetLabel}</span>{' '}
                <span className="font-medium text-amber-200">{caseStudy.presetId}</span>
              </p>

              <dl className="mt-6 min-w-0 space-y-5">
                {caseStudy.examples.map((example, exampleIndex) => (
                  <div key={`${example.source}-${exampleIndex}`} className="min-w-0">
                    <dt className="text-xs font-medium uppercase text-stone-400">
                      {copy.sourceLabel}
                    </dt>
                    <dd className="mt-1 min-w-0 break-words text-sm leading-6 text-stone-200">
                      {example.source}
                    </dd>
                    <dt className="mt-3 text-xs font-medium uppercase text-stone-400">
                      {copy.resultLabel}
                    </dt>
                    <dd className="mt-1 min-w-0 break-words font-display text-xl leading-snug text-amber-200">
                      {example.result}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-auto pt-6 text-sm leading-7 text-stone-300 text-pretty">
                <span className="font-medium text-stone-200">{copy.usageLabel}</span>{' '}
                {caseStudy.usage}
              </p>
            </article>
          </li>
        ))}
      </ul>

      <p className="mt-6 max-w-3xl text-sm leading-7 text-stone-400 text-pretty">{copy.notice}</p>
    </section>
  );
}
