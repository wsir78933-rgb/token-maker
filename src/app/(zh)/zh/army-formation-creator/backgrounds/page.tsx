import type { Metadata } from 'next';

import { ArmyBackgroundGalleryPageView } from '@/components/army-formation/ArmyBackgroundGalleryPageView';
import { getSiteUrl } from '@/lib/site-content';
import { getLanguageAlternates } from '@/lib/site-locale';

const path = '/army-formation-creator/backgrounds';
const localizedPath = '/zh/army-formation-creator/backgrounds';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: '军阵背景素材库 | 军阵编辑器',
  description: '浏览和预览 477 张军阵背景地图，按地形分类和素材来源筛选。',
  alternates: {
    canonical: localizedPath,
    languages: getLanguageAlternates(path),
  },
};

export default function ChineseArmyBackgroundGalleryPage() {
  return <ArmyBackgroundGalleryPageView locale="zh" />;
}
