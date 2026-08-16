import Link from 'next/link';
import {
  ArrowRight,
  Circle,
  Crop,
  Download,
  Hexagon,
  ImageUp,
  Square,
  Swords,
  UserRound,
  UsersRound,
} from 'lucide-react';

import {
  getHomeSeoContentCopy,
  type HomeSeoLinkTarget,
} from '@/components/site/home-seo-copy';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

const workflowIcons = [ImageUp, Crop, Download];
const useCaseIcons = [UserRound, UsersRound, Swords];
const shapeIcons = [Circle, Square, Hexagon];

function getHomeSeoLinkHref(locale: SiteLocale, linkTarget: HomeSeoLinkTarget): string {
  const localizedHomeHref = getLocalizedPath(locale, '/');

  switch (linkTarget) {
    case 'editor':
      return `${localizedHomeHref}#editor-workspace`;
    case 'classGuide':
      return getLocalizedPath(locale, '/blog/dnd-classes-explained');
    case 'monsterGuide':
      return getLocalizedPath(locale, '/blog/dnd-demons');
    case 'squareTemplate':
      return getLocalizedPath(locale, '/templates/square-token-maker');
    case 'faq':
      return getLocalizedPath(locale, '/faq');
  }
}

function SectionEyebrow({ children }: { children: string }) {
  return <p className="text-xs uppercase tracking-[0.3em] text-[#d7b46a]">{children}</p>;
}

function SectionHeading({ children }: { children: string }) {
  return (
    <h2 className="mt-4 max-w-4xl text-balance font-display text-3xl leading-tight text-stone-50 sm:text-4xl lg:text-5xl">
      {children}
    </h2>
  );
}

function InlineContentLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      className="inline-flex items-center gap-2 text-sm font-semibold text-[#f1d492] transition hover:text-white"
    >
      {label}
      <ArrowRight aria-hidden="true" className="h-4 w-4" />
    </Link>
  );
}

export function HomeTokenGuide({ locale }: { locale: SiteLocale }) {
  const copy = getHomeSeoContentCopy(locale);

  return (
    <div data-testid="home-token-guide">
      <section className="site-content-section">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)] lg:px-8 lg:py-20">
          <div>
            <SectionEyebrow>{copy.definition.eyebrow}</SectionEyebrow>
            <SectionHeading>{copy.definition.title}</SectionHeading>
            <div className="mt-6 max-w-3xl space-y-4 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8">
              {copy.definition.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-7">
              <InlineContentLink
                href={getHomeSeoLinkHref(locale, 'editor')}
                label={copy.definition.cta}
              />
            </div>
          </div>

          <aside className="self-start rounded-[28px] border border-[#d7b46a]/20 bg-[#d7b46a]/[0.06] p-6 lg:mt-10">
            <h3 className="font-display text-2xl text-stone-50">{copy.definition.takeawaysLabel}</h3>
            <ul className="mt-5 space-y-4">
              {copy.definition.takeaways.map((takeaway) => (
                <li key={takeaway} className="flex gap-3 text-sm leading-7 text-stone-300">
                  <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f1d492]" />
                  {takeaway}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="site-content-section bg-black/15">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8 lg:py-20">
          <SectionEyebrow>{copy.workflow.eyebrow}</SectionEyebrow>
          <SectionHeading>{copy.workflow.title}</SectionHeading>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-stone-300 sm:text-base sm:leading-8">
            {copy.workflow.introduction}
          </p>

          <ol className="mt-9 grid gap-4 lg:grid-cols-3">
            {copy.workflow.steps.map((step, stepIndex) => {
              const Icon = workflowIcons[stepIndex];

              return (
                <li key={step.title} className="rounded-[26px] border border-white/10 bg-black/25 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d7b46a]">
                      {String(stepIndex + 1).padStart(2, '0')}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-[#f1d492]">
                      <Icon aria-hidden="true" className="h-4 w-4" />
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold leading-7 text-stone-50">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-stone-300">{step.body}</p>
                </li>
              );
            })}
          </ol>

          <div className="mt-7">
            <InlineContentLink
              href={getHomeSeoLinkHref(locale, 'editor')}
              label={copy.workflow.cta}
            />
          </div>
        </div>
      </section>

      <section className="site-content-section">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8 lg:py-20">
          <SectionEyebrow>{copy.useCases.eyebrow}</SectionEyebrow>
          <SectionHeading>{copy.useCases.title}</SectionHeading>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-stone-300 sm:text-base sm:leading-8">
            {copy.useCases.introduction}
          </p>

          <div className="mt-9 grid gap-4 lg:grid-cols-3">
            {copy.useCases.cards.map((useCase, useCaseIndex) => {
              const Icon = useCaseIcons[useCaseIndex];

              return (
                <article key={useCase.title} className="flex h-full flex-col rounded-[26px] border border-white/10 bg-black/20 p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-[#f1d492]">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold leading-7 text-stone-50">{useCase.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-stone-300">{useCase.body}</p>
                  <div className="mt-5 border-t border-white/10 pt-4">
                    <InlineContentLink
                      href={getHomeSeoLinkHref(locale, useCase.linkTarget)}
                      label={useCase.linkLabel}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="site-content-section bg-black/15">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8 lg:py-20">
          <SectionEyebrow>{copy.shapes.eyebrow}</SectionEyebrow>
          <SectionHeading>{copy.shapes.title}</SectionHeading>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-stone-300 sm:text-base sm:leading-8">
            {copy.shapes.introduction}
          </p>

          <div className="mt-9 grid gap-4 lg:grid-cols-3">
            {copy.shapes.choices.map((choice, choiceIndex) => {
              const Icon = shapeIcons[choiceIndex];

              return (
                <article key={choice.title} className="rounded-[24px] border border-white/10 bg-white/[0.035] p-6">
                  <Icon aria-hidden="true" className="h-7 w-7 text-[#f1d492]" />
                  <h3 className="mt-5 text-lg font-semibold leading-7 text-stone-50">{choice.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-stone-300">{choice.body}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-3xl text-sm leading-7 text-stone-300">{copy.shapes.closing}</p>
            <div className="shrink-0">
              <InlineContentLink
                href={getHomeSeoLinkHref(locale, 'squareTemplate')}
                label={copy.shapes.linkLabel}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function HomeTokenFaq({ locale }: { locale: SiteLocale }) {
  const copy = getHomeSeoContentCopy(locale).faq;

  return (
    <section data-testid="home-token-faq" className="site-content-section bg-black/15">
      <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8 lg:py-20">
        <SectionEyebrow>{copy.eyebrow}</SectionEyebrow>
        <SectionHeading>{copy.title}</SectionHeading>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-stone-300 sm:text-base sm:leading-8">
          {copy.introduction}
        </p>

        <div className="mt-9 grid gap-4 lg:grid-cols-2">
          {copy.items.map((faqItem, faqIndex) => (
            <article
              key={faqItem.question}
              className={`rounded-[24px] border border-white/10 bg-black/20 p-6 ${
                faqIndex === copy.items.length - 1 ? 'lg:col-span-2' : ''
              }`}
            >
              <h3 className="text-base font-semibold leading-7 text-stone-50 sm:text-lg">
                {faqItem.question}
              </h3>
              <p className="mt-3 text-sm leading-7 text-stone-300">{faqItem.answer}</p>
            </article>
          ))}
        </div>

        <div className="mt-7">
          <InlineContentLink href={getHomeSeoLinkHref(locale, 'faq')} label={copy.linkLabel} />
        </div>
      </div>
    </section>
  );
}
