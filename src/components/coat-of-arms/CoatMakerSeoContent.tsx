import Link from 'next/link';

import { getCoatMakerSeoCopy } from '@/components/coat-of-arms/coat-maker-seo-copy';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

export function CoatMakerSeoContent({ locale }: { locale: SiteLocale }) {
  const copy = getCoatMakerSeoCopy(locale);

  return (
    <section
      data-testid="coat-maker-seo-content"
      className="coat-maker-seo-content border-t border-white/10 bg-[#100d08] text-stone-100"
    >
      <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <h1 className="font-display text-4xl leading-tight text-stone-50 sm:text-5xl">{copy.heading}</h1>
          <p className="mt-5 text-base leading-8 text-stone-300">{copy.introduction}</p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <section>
            <h2 className="font-display text-2xl text-stone-50 sm:text-3xl">{copy.stepsHeading}</h2>
            <ol aria-label={copy.stepsAriaLabel} className="mt-5 list-decimal space-y-4 pl-5 text-stone-300 marker:text-[#d7b46a]">
              {copy.steps.map((step) => (
                <li key={step.title} className="pl-2">
                  <h3 className="font-semibold text-stone-100">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6">{step.description}</p>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="font-display text-2xl text-stone-50 sm:text-3xl">{copy.featuresHeading}</h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-stone-300">
              {copy.verifiedCapabilities.map((capability) => (
                <li key={capability} className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
                  {capability}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <section>
            <h2 className="font-display text-2xl text-stone-50 sm:text-3xl">{copy.useCasesHeading}</h2>
            <ul className="mt-5 grid gap-3 text-sm text-stone-300 sm:grid-cols-2">
              {copy.useCases.map((useCase) => (
                <li key={useCase} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  {useCase}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[28px] border border-[#d7b46a]/20 bg-[#d7b46a]/[0.06] p-6">
            <h2 className="font-display text-2xl text-stone-50 sm:text-3xl">{copy.privacyHeading}</h2>
            <p className="mt-4 font-semibold text-[#f1d492]">{copy.localPrivacy}</p>
            <p className="mt-3 text-sm leading-7 text-stone-300">{copy.exportExplanation}</p>
          </section>
        </div>

        <section className="mt-12 border-t border-white/10 pt-12">
          <h2 className="font-display text-2xl text-stone-50 sm:text-3xl">{copy.faqHeading}</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {copy.faqItems.map((faqItem) => (
              <article key={faqItem.question} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <h3 className="text-base font-semibold leading-6 text-stone-100">{faqItem.question}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-300">{faqItem.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <nav aria-label={copy.relatedToolsHeading} className="mt-12 border-t border-white/10 pt-8">
          <h2 className="font-display text-2xl text-stone-50">{copy.relatedToolsHeading}</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {copy.contextualLinks.map((contextualLink) => (
              <Link
                key={contextualLink.href}
                href={getLocalizedPath(locale, contextualLink.href)}
                prefetch={false}
                className="rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-sm text-stone-200 transition hover:border-[#d7b46a]/45 hover:text-[#f1d492]"
              >
                {contextualLink.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </section>
  );
}
