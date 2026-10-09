'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useId, useMemo, useState } from 'react';

import styles from './ToolDirectoryGrid.module.css';
import { getToolDirectoryItems, type ToolDirectoryItem, type ToolDirectoryPreview } from '@/lib/tool-directory';
import type { SiteLocale } from '@/lib/site-locale';

function filterToolDirectoryItems(
  toolItems: readonly ToolDirectoryItem[],
  locale: SiteLocale,
  searchTerm: string,
): ToolDirectoryItem[] {
  const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase(locale === 'en' ? 'en-US' : 'zh-CN');

  if (!normalizedSearchTerm) {
    return [...toolItems];
  }

  return toolItems.filter((toolItem) => {
    const searchableCopy = `${toolItem.name} ${toolItem.description}`.toLocaleLowerCase(
      locale === 'en' ? 'en-US' : 'zh-CN',
    );

    return searchableCopy.includes(normalizedSearchTerm);
  });
}

function getPreviewSurfaceClassName(preview: ToolDirectoryPreview): string {
  if (preview.type === 'text') {
    return styles.previewText;
  }

  return preview.surface === 'dark' ? styles.previewDark : styles.previewLight;
}

function ToolDirectoryPreviewContent({ preview }: { preview: ToolDirectoryPreview }) {
  if (preview.type === 'text') {
    return (
      <>
        <div className={styles.textPreviewLine}>
          <dt>{preview.sourceLabel}</dt>
          <dd>{preview.source}</dd>
        </div>
        <div className={styles.textPreviewLine}>
          <dt>{preview.resultLabel}</dt>
          <dd className={styles.textPreviewResult}>{preview.result}</dd>
        </div>
      </>
    );
  }

  return (
    <Image
      alt={preview.alt}
      className={preview.fit === 'contain' ? styles.previewImageContain : styles.previewImageCover}
      fill
      sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 288px"
      src={preview.src}
    />
  );
}

export function ToolDirectoryGrid({ locale }: { locale: SiteLocale }) {
  const searchInputId = useId();
  const [searchTerm, setSearchTerm] = useState('');
  const toolItems = useMemo(() => getToolDirectoryItems(locale), [locale]);
  const visibleToolItems = filterToolDirectoryItems(toolItems, locale, searchTerm);
  const isEnglish = locale === 'en';

  return (
    <section
      aria-label={isEnglish ? 'Tool collection' : '工具合集'}
      className={styles.directory}
    >
      <div className={styles.content}>
        <div className={styles.searchRow}>
          <label className={styles.searchLabel} htmlFor={searchInputId}>
            <span>{isEnglish ? 'Search tools' : '搜索工具'}</span>
            <span className={styles.searchControl}>
              <Search aria-hidden="true" className={styles.searchIcon} size={18} strokeWidth={1.8} />
              <input
                autoComplete="off"
                className={styles.searchInput}
                id={searchInputId}
                onChange={(event) => setSearchTerm(event.currentTarget.value)}
                placeholder={isEnglish ? 'Name or what it helps you create' : '搜索工具名称或用途'}
                type="search"
                value={searchTerm}
              />
            </span>
          </label>
        </div>

        {visibleToolItems.length > 0 ? (
          <ul className={styles.grid} data-testid="tool-directory-grid">
            {visibleToolItems.map((toolItem) => (
              <li className={styles.gridItem} key={toolItem.id}>
                <Link className={styles.card} href={toolItem.href}>
                  <div className={`${styles.preview} ${getPreviewSurfaceClassName(toolItem.preview)}`}>
                    {toolItem.preview.type === 'text' ? (
                      <dl className={styles.textPreviewList}>
                        <ToolDirectoryPreviewContent preview={toolItem.preview} />
                      </dl>
                    ) : (
                      <ToolDirectoryPreviewContent preview={toolItem.preview} />
                    )}
                  </div>
                  <div className={styles.cardCopy}>
                    <h2 className={styles.cardTitle}>{toolItem.name}</h2>
                    <p className={styles.cardDescription}>{toolItem.description}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.emptyState} role="status">
            {isEnglish
              ? `No tools match “${searchTerm.trim()}”. Try another search.`
              : `没有找到匹配“${searchTerm.trim()}”的工具，请试试其他关键词。`}
          </p>
        )}
      </div>
    </section>
  );
}
