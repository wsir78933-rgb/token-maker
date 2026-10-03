import type { Metadata } from 'next';

import { ArmyBackgroundGalleryPageView } from '@/components/army-formation/ArmyBackgroundGalleryPageView';
import { getSiteUrl } from '@/lib/site-content';
import { getLanguageAlternates } from '@/lib/site-locale';

const path = '/army-formation-creator/backgrounds';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: 'Battle Map Background Library | Army Formation Creator',
  description:
    'Browse and preview 477 battle maps for the Army Formation Creator. Filter maps by terrain category and source.',
  alternates: {
    canonical: path,
    languages: getLanguageAlternates(path),
  },
};

export default function ArmyBackgroundGalleryPage() {
  return <ArmyBackgroundGalleryPageView locale="en" />;
}
