import { FamilyTreeWorkbench } from '@/components/family-tree/FamilyTreeWorkbench';
import { FamilyTreeCreatorPageHeading } from '@/components/family-tree/FamilyTreeCreatorPageHeading';
import { FamilyTreeCreatorInfoSections } from '@/components/family-tree/FamilyTreeCreatorInfoSections';
import { FamilyTreeCreatorFaq } from '@/components/family-tree/FamilyTreeCreatorFaq';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { getFamilyTreeCopy } from '@/lib/family-tree/copy';
import { getFamilyTreePageContent } from '@/lib/family-tree/page-content';
import type { SiteLocale } from '@/lib/site-locale';

const FAMILY_TREE_CREATOR_PATH = '/family-tree-creator';
const FAMILY_TREE_EDITOR_ID = 'family-tree-creator-editor';
const FAMILY_TREE_WORKSPACE_ID = 'family-tree-workspace';

export function FamilyTreeCreatorPageView({ locale }: { locale: SiteLocale }) {
  const copy = getFamilyTreeCopy(locale);
  const pageContent = getFamilyTreePageContent(locale);

  return (
    <InnerPageChrome
      locale={locale}
      currentPath={FAMILY_TREE_CREATOR_PATH}
      tone="hub"
      className="family-tree-creator-page"
    >
      <FamilyTreeCreatorPageHeading locale={locale} workspaceId={FAMILY_TREE_EDITOR_ID} />
      <div className="mx-auto w-full max-w-[96rem] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section
          id={FAMILY_TREE_EDITOR_ID}
          aria-label={copy.workspaceLabel}
          data-testid={FAMILY_TREE_WORKSPACE_ID}
          className="mt-6 scroll-mt-20"
        >
          <FamilyTreeWorkbench locale={locale} />
        </section>
      </div>
      <FamilyTreeCreatorInfoSections locale={locale} content={pageContent} workspaceId={FAMILY_TREE_EDITOR_ID} />
      <FamilyTreeCreatorFaq faq={pageContent.faq} />
    </InnerPageChrome>
  );
}
