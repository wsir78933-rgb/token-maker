import type { Metadata } from 'next';
import { ContentPageShell } from '@/components/site/ContentPageShell';
import { getCollectionPageCopy, getPrivacySections } from '@/lib/site-content';
import { getLanguageAlternates } from '@/lib/site-locale';

const locale = 'zh';
const copy = getCollectionPageCopy(locale).privacy;

export const metadata: Metadata = {
  title: copy.title,
  description: copy.description,
  alternates: {
    canonical: '/zh/privacy',
    languages: getLanguageAlternates('/privacy'),
  },
};

export default function ChinesePrivacyPage() {
  const sections = getPrivacySections(locale);

  return (
    <ContentPageShell
      locale="zh"
      currentPath="/privacy"
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
    >
      <div className="space-y-4">
        {sections.map((section) => (
          <section key={section.title} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-2xl font-medium text-stone-50">{section.title}</h2>
            <p className="mt-4 text-sm leading-7 text-stone-300">{section.body}</p>
          </section>
        ))}
      </div>
    </ContentPageShell>
  );
}
