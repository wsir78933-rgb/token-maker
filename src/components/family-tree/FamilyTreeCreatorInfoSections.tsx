import { ArrowRight, CircleUserRound, Download, GitBranch, Layers, Save, UserRound, type LucideIcon } from 'lucide-react';

import { FamilyTreeCreatorCaseStudies } from '@/components/family-tree/FamilyTreeCreatorCaseStudies';
import { FamilyTreeCreatorToolComparison } from '@/components/family-tree/FamilyTreeCreatorToolComparison';
import { Button } from '@/components/ui/button';
import { getFamilyTreeCaseStudiesCopy } from '@/lib/family-tree/case-studies';
import type {
  FamilyTreePageContent,
  FamilyTreePageFeatureIcon,
} from '@/lib/family-tree/page-content';
import type { SiteLocale } from '@/lib/site-locale';
import { cn } from '@/lib/utils';

const FAMILY_TREE_FEATURE_ICONS: Record<FamilyTreePageFeatureIcon, LucideIcon> = {
  portrait: CircleUserRound,
  profile: UserRound,
  generations: Layers,
  connections: GitBranch,
  save: Save,
  export: Download,
};

type FamilyTreeInfoContent = Pick<
  FamilyTreePageContent,
  'whatIs' | 'features' | 'toolComparison' | 'howItWorks' | 'callToAction'
>;

function FamilyTreeCreatorWhatIsSection({
  content,
}: {
  readonly content: FamilyTreeInfoContent['whatIs'];
}) {
  return (
    <section
      aria-labelledby="family-tree-what-is-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <h2
        id="family-tree-what-is-heading"
        className="font-display font-semibold leading-tight tracking-tight text-stone-50 text-balance"
        style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
      >
        {content.title}
      </h2>
      <div className="mt-4 max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
        {content.paragraphs.map((paragraph, paragraphIndex) => (
          <p key={`family-tree-what-is-${paragraphIndex}`} className={paragraphIndex > 0 ? 'mt-4' : undefined}>
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

function FamilyTreeCreatorFeaturesSection({
  content,
}: {
  readonly content: FamilyTreeInfoContent['features'];
}) {
  return (
    <section
      aria-labelledby="family-tree-features-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <header className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
        <h2
          id="family-tree-features-heading"
          className="font-display font-semibold leading-tight tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {content.title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {content.description}
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {content.items.map((feature) => {
          const Icon = FAMILY_TREE_FEATURE_ICONS[feature.icon];

          return (
            <li key={feature.icon} className="min-w-0">
              <article
                className={cn(
                  'h-full rounded-2xl border border-white/10 bg-white/[0.025] p-6',
                  'transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.045]',
                )}
              >
                <div
                  aria-hidden="true"
                  className="mb-5 flex size-11 items-center justify-center rounded-xl border border-amber-200/15 bg-amber-300/[0.08] text-amber-200"
                >
                  <Icon className="size-5" />
                </div>
                <h3 className="font-semibold leading-snug tracking-tight text-stone-50">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-300">
                  {feature.description}
                </p>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function FamilyTreeCreatorHowItWorksSection({
  content,
}: {
  readonly content: FamilyTreeInfoContent['howItWorks'];
}) {
  return (
    <section
      aria-labelledby="family-tree-how-it-works-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="mb-14 flex flex-col items-center gap-3 text-center">
        <h2
          id="family-tree-how-it-works-heading"
          className="font-display font-semibold tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {content.title}
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {content.description}
        </p>
      </div>

      <div className="relative">
        <div aria-hidden="true" className="absolute inset-x-0 top-6 hidden h-px bg-white/15 lg:block" />
        <ol className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {content.steps.map((step, stepIndex) => (
            <li key={step.title} className="relative flex flex-col items-center gap-4 text-center">
              <div className="relative z-10 flex size-12 items-center justify-center rounded-full border border-white/10 bg-background">
                <span className="text-xs font-semibold tabular-nums text-stone-400">
                  {String(stepIndex + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold tracking-tight text-stone-50">{step.title}</h3>
                <p className="text-sm leading-relaxed text-stone-300">{step.description}</p>
              </div>
              {stepIndex < content.steps.length - 1 ? (
                <ArrowRight aria-hidden="true" className="mt-2 size-4 text-stone-400/40 sm:hidden" />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FamilyTreeCreatorCallToActionSection({
  content,
  workspaceId,
}: {
  readonly content: FamilyTreeInfoContent['callToAction'];
  readonly workspaceId: string;
}) {
  return (
    <section
      aria-labelledby="family-tree-call-to-action-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <h2
          id="family-tree-call-to-action-heading"
          className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl"
        >
          {content.title}
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {content.description}
        </p>
        <Button
          size="lg"
          className="mt-2 h-11 rounded-full px-8"
          role="link"
          nativeButton={false}
          render={<a href={`#${workspaceId}`} role="link" />}
        >
          {content.action}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </section>
  );
}

export function FamilyTreeCreatorInfoSections({
  locale,
  content,
  workspaceId,
}: {
  readonly locale: SiteLocale;
  readonly content: FamilyTreeInfoContent;
  readonly workspaceId: string;
}) {
  return (
    <>
      <FamilyTreeCreatorWhatIsSection content={content.whatIs} />
      <FamilyTreeCreatorCaseStudies copy={getFamilyTreeCaseStudiesCopy(locale)} />
      <FamilyTreeCreatorFeaturesSection content={content.features} />
      <FamilyTreeCreatorToolComparison copy={content.toolComparison} />
      <FamilyTreeCreatorHowItWorksSection content={content.howItWorks} />
      <FamilyTreeCreatorCallToActionSection content={content.callToAction} workspaceId={workspaceId} />
    </>
  );
}
