'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';

import type { SiteLocale } from '@/lib/site-locale';
import type { TownAsset, TownCategoryId, TownMaterial } from '@/lib/town-creator/types';

import styles from './TownCreatorWorkbench.module.css';

const CATEGORY_ORDER: readonly TownCategoryId[] = [
  'buildings',
  'defenses',
  'props',
  'roads',
  'terrain',
  'prefabs',
  'nature',
];

const MATERIAL_ORDER = ['wood', 'stone', 'clay', 'sandstone'] as const;

export function readTownCategoryId(value: string): TownCategoryId {
  const category = CATEGORY_ORDER.find((candidate) => candidate === value);
  if (!category) {
    throw new Error(`Town asset category is not a library category, received ${JSON.stringify(value)}.`);
  }
  return category;
}

const COPY = {
  en: {
    heading: 'Assets',
    search: 'Search assets',
    searchHint: 'Search by name or ID',
    category: 'Category',
    material: 'New asset material',
    materialHint: 'Material changes apply to new assets only. Existing objects keep their material; fixed assets stay neutral.',
    add: 'Add to active layer',
    neutral: 'Neutral',
    empty: 'No assets match this search.',
    categories: {
      buildings: 'Buildings',
      defenses: 'Defenses',
      props: 'Props',
      roads: 'Roads',
      terrain: 'Terrain',
      prefabs: 'Prefabs',
      nature: 'Nature',
    },
    materials: {
      wood: 'Wood',
      stone: 'Stone',
      clay: 'Clay',
      sandstone: 'Sandstone',
    },
  },
  zh: {
    heading: '素材',
    search: '搜索素材',
    searchHint: '按名称或编号搜索',
    category: '分类',
    material: '新素材材质',
    materialHint: '材质只影响新添加的素材，已有对象保持原材质；固定素材始终使用中性外观。',
    add: '添加到当前图层',
    neutral: '中性',
    empty: '没有匹配的素材。',
    categories: {
      buildings: '建筑',
      defenses: '城防',
      props: '配件',
      roads: '道路',
      terrain: '地面',
      prefabs: '预制屋',
      nature: '自然',
    },
    materials: {
      wood: '木材',
      stone: '石材',
      clay: '陶土',
      sandstone: '砂岩',
    },
  },
} as const;

type TownAssetLibraryProps = {
  readonly locale: SiteLocale;
  readonly assets: readonly TownAsset[];
  readonly selectedMaterial: TownMaterial;
  readonly onMaterialChange: (material: TownMaterial) => void;
  readonly onAddAsset: (asset: TownAsset) => void;
};

function getAssetVariant(asset: TownAsset, selectedMaterial: TownMaterial) {
  const requestedVariant = asset.variants.find((variant) => variant.material === selectedMaterial);
  if (requestedVariant) {
    return requestedVariant;
  }

  const neutralVariant = asset.variants.find((variant) => variant.material === 'neutral');
  if (neutralVariant) {
    return neutralVariant;
  }

  const firstVariant = asset.variants[0];
  if (!firstVariant) {
    throw new Error(`Town asset ${JSON.stringify(asset.id)} has no display variant.`);
  }

  return firstVariant;
}

function assetSupportsMaterial(asset: TownAsset, selectedMaterial: TownMaterial): boolean {
  return asset.materials.includes(selectedMaterial) && selectedMaterial !== 'neutral';
}

function getLocalizedAssetName(asset: TownAsset, locale: SiteLocale): string {
  const localizedName = asset.name[locale];
  if (localizedName.trim().length === 0) {
    throw new Error(`Town asset ${JSON.stringify(asset.id)} has an empty ${locale} name.`);
  }

  return localizedName;
}

export function TownAssetLibrary({
  locale,
  assets,
  selectedMaterial,
  onMaterialChange,
  onAddAsset,
}: TownAssetLibraryProps) {
  const copy = COPY[locale];
  const [activeCategory, setActiveCategory] = useState<TownCategoryId>('buildings');
  const [searchDraft, setSearchDraft] = useState('');

  const visibleAssets = useMemo(() => {
    const query = searchDraft.trim().toLocaleLowerCase(locale === 'zh' ? 'zh-CN' : 'en-US');
    return assets.filter((asset) => {
      if (asset.category !== activeCategory) {
        return false;
      }

      if (query.length === 0) {
        return true;
      }

      const localizedNames = [asset.name.en, asset.name.zh].map((name) => name.toLocaleLowerCase(
        locale === 'zh' ? 'zh-CN' : 'en-US',
      ));
      return localizedNames.some((name) => name.includes(query)) || asset.id.toLocaleLowerCase().includes(query);
    });
  }, [activeCategory, assets, locale, searchDraft]);

  return (
    <section className={styles.assetLibrary} aria-labelledby="town-assets-heading">
      <div className={styles.assetLibraryControls}>
        <div className={styles.panelHeading}>
          <div>
            <p className={styles.eyebrow}>01</p>
            <h2 id="town-assets-heading">{copy.heading}</h2>
          </div>
          <span className={styles.assetCount}>{assets.length}</span>
        </div>

        <input
          id="town-asset-search"
          className={styles.textInput}
          type="search"
          value={searchDraft}
          aria-label={copy.search}
          onChange={(event) => setSearchDraft(event.target.value)}
          placeholder={copy.searchHint}
        />

        <select
          id="town-asset-category"
          className={styles.categorySelect}
          aria-label={copy.category}
          value={activeCategory}
          onChange={(event) => setActiveCategory(readTownCategoryId(event.target.value))}
        >
          {CATEGORY_ORDER.map((category) => {
            const categoryAssetCount = assets.filter((asset) => asset.category === category).length;
            return (
              <option key={category} value={category}>
                {`${copy.categories[category]} · ${categoryAssetCount}`}
              </option>
            );
          })}
        </select>

        <div className={styles.materialGroup}>
          <div className={styles.materialChoices} role="group" aria-label={copy.material}>
            {MATERIAL_ORDER.map((material) => (
              <button
                className={`${styles.materialButton} ${selectedMaterial === material ? styles.materialButtonActive : ''}`}
                key={material}
                type="button"
                aria-pressed={selectedMaterial === material}
                title={copy.materials[material]}
                onClick={() => onMaterialChange(material)}
              >
                <span className={`${styles.materialSwatch} ${styles[`material-${material}`]}`} aria-hidden="true" />
                <span className={styles.materialName}>{copy.materials[material]}</span>
              </button>
            ))}
          </div>
          <p className={styles.fieldHint}>{copy.materialHint}</p>
        </div>
      </div>

      <div className={styles.assetGrid} aria-live="polite">
        {visibleAssets.length === 0 ? <p className={styles.emptyState}>{copy.empty}</p> : null}
        {visibleAssets.map((asset) => {
          const variant = getAssetVariant(asset, selectedMaterial);
          const usesNeutral = !assetSupportsMaterial(asset, selectedMaterial);
          const localizedName = getLocalizedAssetName(asset, locale);
          const materialLabel = usesNeutral || selectedMaterial === 'neutral'
            ? copy.neutral
            : copy.materials[selectedMaterial];
          return (
            <article className={styles.assetCard} key={asset.id}>
              <button
                className={styles.assetButton}
                type="button"
                onClick={() => onAddAsset(asset)}
                aria-label={`${copy.add}: ${localizedName}`}
              >
                <span className={styles.assetThumbnail}>
                  <Image src={variant.thumbnail} alt="" width={asset.width} height={asset.height} loading="lazy" />
                </span>
                <span className={styles.assetName}>{localizedName}</span>
                <span className={styles.assetMeta}>
                  {materialLabel}
                  <span>{asset.width}×{asset.height}</span>
                </span>
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
