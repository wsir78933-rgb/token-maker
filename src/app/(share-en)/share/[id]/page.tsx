import { redirect } from 'next/navigation';
import { SharePageView } from '@/components/site/views/SharePageView';
import {
  createSharePageMetadata,
  getShareRedirectHref,
  isValidSharePageId,
  shareImageExists,
} from '@/lib/share/page-model';
import { getConfiguredShareImageUrl } from '@/lib/share/public-url';

const locale = 'en';

interface SharePageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 0;

export async function generateMetadata({ params }: SharePageProps) {
  const { id } = await params;
  return createSharePageMetadata(locale, id);
}

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;
  const imageUrl = getConfiguredShareImageUrl(id);

  if (!isValidSharePageId(id) || !(await shareImageExists(imageUrl))) {
    redirect(getShareRedirectHref(locale));
  }

  return <SharePageView locale={locale} imageUrl={imageUrl} />;
}
