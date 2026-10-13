import Image from 'next/image';
import Link from 'next/link';

import { getToolRecommendationSet } from '@/lib/tool-recommendations';
import type { ToolDirectoryItem, ToolDirectoryPreview } from '@/lib/tool-directory';
import type { SiteLocale } from '@/lib/site-locale';

const recommendationHeadingByLocale: Record<SiteLocale, string> = {
  en: 'More tools you may like',
  zh: '你可能还会用到这些工具',
};

const recommendationImageSizes = '(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw';

function formatRecommendationSubtitle(locale: SiteLocale, currentToolName: string) {
  if (locale === 'en') {
    return `Four other tools that pair with ${currentToolName}.`;
  }

  if (locale === 'zh') {
    return `这四个工具可以和${currentToolName}一起用。`;
  }

  const unexpectedLocale: never = locale;
  throw new Error(
    `Tool recommendation subtitle was not found for locale ${JSON.stringify(unexpectedLocale)}.`,
  );
}

function assertRecommendedToolCount(recommendedToolCount: number) {
  if (recommendedToolCount !== 4) {
    throw new Error(
      `Tool recommendations must contain exactly 4 tools. Received length ${recommendedToolCount}.`,
    );
  }
}

function readRecommendationHeading(locale: SiteLocale) {
  const heading = recommendationHeadingByLocale[locale];

  if (typeof heading !== 'string' || heading.trim() === '') {
    throw new Error(`Tool recommendation heading was not found for locale ${JSON.stringify(locale)}.`);
  }

  return heading;
}

function ToolRecommendationPreview({ preview }: { preview: ToolDirectoryPreview }) {
  if (preview.type === 'text') {
    return (
      <div className="relative flex aspect-[4/3] flex-col justify-center gap-3 overflow-hidden bg-[#171411] px-4">
        <p>
          <span className="block text-xs tracking-[0.14em] text-stone-400 uppercase">{preview.sourceLabel}</span>
          <span className="mt-1 block text-sm leading-6 break-words text-stone-50">{preview.source}</span>
        </p>
        <p>
          <span className="block text-xs tracking-[0.14em] text-stone-400 uppercase">{preview.resultLabel}</span>
          <span className="mt-1 block text-sm leading-6 break-words text-[#f1d492]">{preview.result}</span>
        </p>
      </div>
    );
  }

  if (preview.fit !== 'contain' && preview.fit !== 'cover') {
    throw new Error(
      `Tool recommendation image fit must be "cover" or "contain". Received ${JSON.stringify(preview.fit)}.`,
    );
  }

  if (preview.surface !== 'light' && preview.surface !== 'dark') {
    throw new Error(
      `Tool recommendation image surface must be "light" or "dark". Received ${JSON.stringify(preview.surface)}.`,
    );
  }

  const imageFitClassName = preview.fit === 'contain' ? 'object-contain' : 'object-cover';
  const imageFrameClassName = preview.surface === 'light' ? 'bg-[#efe6d6]' : 'bg-[#171411]';

  return (
    <div className={`relative aspect-[4/3] overflow-hidden ${imageFrameClassName}`}>
      <Image
        alt={preview.alt}
        className={imageFitClassName}
        fill
        sizes={recommendationImageSizes}
        src={preview.src}
      />
    </div>
  );
}

function ToolRecommendationCard({ toolItem }: { toolItem: ToolDirectoryItem }) {
  return (
    <Link
      className="flex h-full flex-col overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-300"
      href={toolItem.href}
      prefetch={false}
    >
      <ToolRecommendationPreview preview={toolItem.preview} />
      <div className="flex flex-1 flex-col gap-2 px-4 py-4">
        <h3 className="text-base leading-snug font-semibold text-stone-50">{toolItem.name}</h3>
        <p className="text-sm leading-6 text-stone-300">{toolItem.description}</p>
      </div>
    </Link>
  );
}

export function ToolRecommendationSection({
  locale,
  currentPath,
}: {
  locale: SiteLocale;
  currentPath: string;
}) {
  const recommendationSet = getToolRecommendationSet(locale, currentPath);
  assertRecommendedToolCount(recommendationSet.recommendedTools.length);

  return (
    <section
      aria-labelledby="tool-recommendations-heading"
      className="mx-auto max-w-6xl px-5 py-16 sm:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2
          id="tool-recommendations-heading"
          className="font-display text-3xl leading-tight font-semibold tracking-tight text-balance text-stone-50 sm:text-4xl"
        >
          {readRecommendationHeading(locale)}
        </h2>
        <p className="mt-3 text-base leading-7 text-pretty text-stone-300">
          {formatRecommendationSubtitle(locale, recommendationSet.currentToolName)}
        </p>
      </div>
      <ul className="mt-10 grid list-none grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {recommendationSet.recommendedTools.map((toolItem) => (
          <li className="min-w-0" key={toolItem.id}>
            <ToolRecommendationCard toolItem={toolItem} />
          </li>
        ))}
      </ul>
    </section>
  );
}
