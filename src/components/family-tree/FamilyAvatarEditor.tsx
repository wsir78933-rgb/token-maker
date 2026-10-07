'use client';

import {
  useId,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
} from 'react';

import {
  familyTreeAvatarChoiceSelected,
  selectFamilyTreeAvatarChoice,
  setFamilyTreeAvatarColor,
} from '@/lib/family-tree/avatar';
import {
  FAMILY_TREE_AVATAR_CATEGORIES,
  FAMILY_TREE_COLOR_PALETTES,
  familyTreeColorIndexCount,
  getFamilyTreeCategoryChoices,
  type FamilyTreeAvatarColorKey,
} from '@/lib/family-tree/catalog';
import { getFamilyTreeChoiceImagePath } from '@/lib/family-tree/avatar-render';
import type { FamilyTreeCopy } from '@/lib/family-tree/copy';
import type {
  FamilyTreeGenerationIndex,
  FamilyTreePersonDraft,
} from '@/lib/family-tree/scene';
import type { SiteLocale } from '@/lib/site-locale';

import { FamilyAvatar } from './FamilyAvatar';
import styles from './avatar.module.css';

type FamilyTreeAvatarCategory = (typeof FAMILY_TREE_AVATAR_CATEGORIES)[number];
type FamilyTreeAvatarChoice = ReturnType<typeof getFamilyTreeCategoryChoices>[number];

type CopyRecord = Record<string, unknown>;

type FamilyAvatarEditorProps = {
  copy: FamilyTreeCopy;
  locale: SiteLocale;
  draft: FamilyTreePersonDraft;
  generation: FamilyTreeGenerationIndex;
  onChange: (nextDraft: FamilyTreePersonDraft) => void;
  onGenerationChange: (generation: FamilyTreeGenerationIndex) => void;
  onRandomize: () => void;
  onAdd: () => void;
};

const CATEGORY_COLOR_KEYS: Partial<
  Record<FamilyTreeAvatarCategory, FamilyTreeAvatarColorKey>
> = {
  faces: 'skinColor',
  hair: 'hairColor',
  eyes: 'eyeColor',
  eyebrows: 'eyebrowColor',
  noses: 'moustacheColor',
};


type TextField = 'name' | 'age' | 'description';

function formatReceivedValue(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (
    value === undefined ||
    value === null ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint' ||
    typeof value === 'symbol' ||
    typeof value === 'function'
  ) {
    return String(value);
  }

  try {
    const serialized = JSON.stringify(value);
    return serialized === undefined ? Object.prototype.toString.call(value) : serialized;
  } catch (error: unknown) {
    if (error instanceof Error && error.message.length > 0) {
      return `${Object.prototype.toString.call(value)} (JSON serialization failed: ${error.message})`;
    }

    throw error;
  }
}

function requireCopyRecord(copy: FamilyTreeCopy): CopyRecord {
  if (typeof copy !== 'object' || copy === null || Array.isArray(copy)) {
    throw new Error(
      `Family tree editor copy must be an object, received ${formatReceivedValue(copy)}.`,
    );
  }

  return copy as unknown as CopyRecord;
}

function requireRecord(value: unknown, label: string): CopyRecord {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object, received ${formatReceivedValue(value)}.`);
  }

  return value as CopyRecord;
}

function readLocalizedText(value: unknown, locale: SiteLocale, label: string): string {
  if (typeof value === 'string' && value.length > 0) {
    return value;
  }

  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const localizedValue = (value as CopyRecord)[locale];
    if (typeof localizedValue === 'string' && localizedValue.length > 0) {
      return localizedValue;
    }
  }

  throw new Error(
    `${label} must contain a non-empty ${JSON.stringify(locale)} string, received ${formatReceivedValue(value)}.`,
  );
}

function readCopyText(copy: FamilyTreeCopy, key: string, locale: SiteLocale): string {
  const copyRecord = requireCopyRecord(copy);
  return readLocalizedText(copyRecord[key], locale, `Family tree copy ${JSON.stringify(key)}`);
}

function readCopyCollectionText(
  copy: FamilyTreeCopy,
  collectionKey: string,
  itemKey: string,
  locale: SiteLocale,
): string {
  const copyRecord = requireCopyRecord(copy);
  const collection = requireRecord(
    copyRecord[collectionKey],
    `Family tree copy ${JSON.stringify(collectionKey)}`,
  );

  return readLocalizedText(
    collection[itemKey],
    locale,
    `Family tree copy ${JSON.stringify(collectionKey)}.${JSON.stringify(itemKey)}`,
  );
}

function readChoiceGroupLabel(
  copy: FamilyTreeCopy,
  choice: FamilyTreeAvatarChoice,
  locale: SiteLocale,
): string {
  if (choice.group === 'reset') {
    return readCopyText(copy, 'resetWrinkles', locale);
  }

  return readCopyCollectionText(copy, 'partGroupNames', choice.group, locale);
}

function readGenerationLabel(
  copy: FamilyTreeCopy,
  generation: FamilyTreeGenerationIndex,
  locale: SiteLocale,
): string {
  const copyRecord = requireCopyRecord(copy);
  const generationCopy = copyRecord.generations;

  if (Array.isArray(generationCopy)) {
    const generationLabel = generationCopy[generation];
    if (generationLabel !== undefined) {
      return readLocalizedText(
        generationLabel,
        locale,
        `Family tree copy generations[${generation}]`,
      );
    }
  }

  if (typeof generationCopy === 'object' && generationCopy !== null) {
    const generationLabel = (generationCopy as CopyRecord)[String(generation)];
    if (generationLabel !== undefined) {
      return readLocalizedText(
        generationLabel,
        locale,
        `Family tree copy generations[${generation}]`,
      );
    }

    const generationKey = `generation${generation + 1}`;
    const namedGenerationLabel = (generationCopy as CopyRecord)[generationKey];
    if (namedGenerationLabel !== undefined) {
      return readLocalizedText(
        namedGenerationLabel,
        locale,
        `Family tree copy generations.${generationKey}`,
      );
    }
  }

  throw new Error(
    `Family tree copy generations must contain index ${generation}, received ${formatReceivedValue(generationCopy)}.`,
  );
}

function requireGenerationIndex(value: number): FamilyTreeGenerationIndex {
  if (value === 0 || value === 1 || value === 2 || value === 3) {
    return value;
  }

  throw new Error(
    `Family tree editor generation must be an integer from 0 to 3, received ${formatReceivedValue(value)}.`,
  );
}

function requireAvatarCategory(
  category: FamilyTreeAvatarCategory,
): FamilyTreeAvatarCategory {
  if (
    typeof category === 'string' &&
    (FAMILY_TREE_AVATAR_CATEGORIES as readonly string[]).includes(category)
  ) {
    return category;
  }

  throw new Error(
    `Family tree avatar category is invalid, received ${formatReceivedValue(category)}.`,
  );
}

function requireChoiceLabel(
  choice: FamilyTreeAvatarChoice,
  locale: SiteLocale,
  choiceIndex: number,
): string {
  if (typeof choice !== 'object' || choice === null) {
    throw new Error(
      `Family tree avatar choice at index ${choiceIndex} must be an object, received ${formatReceivedValue(choice)}.`,
    );
  }

  if (typeof choice.id !== 'string' || choice.id.length === 0) {
    throw new Error(
      `Family tree avatar choice at index ${choiceIndex} must have a non-empty id, received ${formatReceivedValue(choice.id)}.`,
    );
  }

  return readLocalizedText(
    choice.name,
    locale,
    `Family tree avatar choice ${JSON.stringify(choice.id)} name`,
  );
}

function readCategoryChoices(
  category: FamilyTreeAvatarCategory,
): readonly FamilyTreeAvatarChoice[] {
  const validatedCategory = requireAvatarCategory(category);
  const choices = getFamilyTreeCategoryChoices(validatedCategory);

  if (!Array.isArray(choices) || choices.length === 0) {
    throw new Error(
      `Family tree avatar category ${JSON.stringify(validatedCategory)} must provide at least one choice, received ${formatReceivedValue(choices)}.`,
    );
  }

  return choices;
}

function localizedChoiceName(
  choice: FamilyTreeAvatarChoice,
  locale: SiteLocale,
  choiceIndex: number,
): string {
  return requireChoiceLabel(choice, locale, choiceIndex);
}

function choiceFallbackSymbol(
  choice: FamilyTreeAvatarChoice,
  label: string,
): string {
  const normalizedId = choice.id.toLowerCase();

  if (
    choice.id === 'hair0' ||
    normalizedId.includes('nohair') ||
    normalizedId.includes('no-hair')
  ) {
    return '∅';
  }

  if (normalizedId.includes('reset') || normalizedId.includes('wrinkle-reset')) {
    return '↺';
  }

  if (label.length > 0) {
    return label.slice(0, 1);
  }

  return '•';
}

type ChoiceThumbnailCrop = Pick<CSSProperties, 'backgroundPosition' | 'backgroundSize'>;

function choiceThumbnailCrop(
  choice: FamilyTreeAvatarChoice,
): ChoiceThumbnailCrop | null {
  if (choice.group === 'eyes') {
    return { backgroundSize: '237%', backgroundPosition: '68% 63%' };
  }

  if (choice.group === 'eyebrows') {
    return { backgroundSize: '237%', backgroundPosition: '68% 50%' };
  }

  if (choice.group === 'noses' || choice.group === 'moustaches') {
    return { backgroundSize: '278%', backgroundPosition: '66% 86%' };
  }

  if (choice.group === 'mouths') {
    return { backgroundSize: '464%', backgroundPosition: '60% 93%' };
  }

  return null;
}

function choiceThumbnailOpacity(choice: FamilyTreeAvatarChoice): number | undefined {
  if (choice.group === 'faceWrinkles' || choice.group === 'eyeWrinkles') {
    return 0.4;
  }

  return undefined;
}

function categoryColorKey(
  category: FamilyTreeAvatarCategory,
): FamilyTreeAvatarColorKey | null {
  return CATEGORY_COLOR_KEYS[category] ?? null;
}

function colorSwatch(
  colorKey: FamilyTreeAvatarColorKey,
  colorIndex: number,
): string {
  const palette = FAMILY_TREE_COLOR_PALETTES[colorKey];
  const swatch = palette[colorIndex - 1];
  if (swatch === undefined) {
    throw new Error(
      `Family tree avatar color ${JSON.stringify(colorKey)} must contain index ${colorIndex}, received ${formatReceivedValue(palette)}.`,
    );
  }

  return swatch;
}

function textFieldValue(
  draft: FamilyTreePersonDraft,
  field: TextField,
): string {
  return draft[field];
}

export function FamilyAvatarEditor({
  copy,
  locale,
  draft,
  generation,
  onChange,
  onGenerationChange,
  onRandomize,
  onAdd,
}: FamilyAvatarEditorProps) {
  const editorId = useId();
  const [activeCategory, setActiveCategory] =
    useState<FamilyTreeAvatarCategory>('faces');

  const titleId = `${editorId}-title`;
  const categoryPanelId = `${editorId}-category-panel`;
  const choices = readCategoryChoices(activeCategory);
  const colorKey = categoryColorKey(activeCategory);
  const categoryLabel = readCopyCollectionText(
    copy,
    'categoryNames',
    activeCategory,
    locale,
  );
  const previewLabel =
    draft.name.trim().length > 0
      ? draft.name
      : readCopyText(copy, 'newPerson', locale);
  const selectedGenerationLabel = readGenerationLabel(copy, generation, locale);

  const updateTextField = (field: TextField, value: string): void => {
    onChange({
      ...draft,
      [field]: value,
    });
  };

  const updateAvatarChoice = (choiceId: string): void => {
    if (typeof choiceId !== 'string' || choiceId.length === 0) {
      throw new Error(
        `Family tree avatar choice id must be a non-empty string, received ${formatReceivedValue(choiceId)}.`,
      );
    }

    const nextAvatar = selectFamilyTreeAvatarChoice(draft.avatar, choiceId);
    onChange({
      ...draft,
      avatar: nextAvatar,
    });
  };

  const updateAvatarColor = (
    nextColorKey: FamilyTreeAvatarColorKey,
    colorIndex: number,
  ): void => {
    const colorCount = familyTreeColorIndexCount(nextColorKey);
    if (colorIndex < 1 || colorIndex > colorCount) {
      throw new Error(
        `Family tree avatar color index for ${JSON.stringify(nextColorKey)} must be from 1 to ${colorCount}, received ${formatReceivedValue(colorIndex)}.`,
      );
    }

    const nextAvatar = setFamilyTreeAvatarColor(
      draft.avatar,
      nextColorKey,
      colorIndex,
    );
    onChange({
      ...draft,
      avatar: nextAvatar,
    });
  };

  const handleCategoryKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    categoryIndex: number,
  ): void => {
    let nextCategoryIndex: number | null = null;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextCategoryIndex = (categoryIndex + 1) % FAMILY_TREE_AVATAR_CATEGORIES.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextCategoryIndex =
        (categoryIndex - 1 + FAMILY_TREE_AVATAR_CATEGORIES.length) %
        FAMILY_TREE_AVATAR_CATEGORIES.length;
    } else if (event.key === 'Home') {
      nextCategoryIndex = 0;
    } else if (event.key === 'End') {
      nextCategoryIndex = FAMILY_TREE_AVATAR_CATEGORIES.length - 1;
    }

    if (nextCategoryIndex === null) {
      return;
    }

    event.preventDefault();
    const nextCategory = requireAvatarCategory(
      FAMILY_TREE_AVATAR_CATEGORIES[nextCategoryIndex],
    );
    setActiveCategory(nextCategory);
    const nextTab = document.getElementById(
      `${editorId}-category-${nextCategory}`,
    );
    nextTab?.focus();
  };

  const handleGenerationChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ): void => {
    const nextGeneration = Number(event.currentTarget.value);
    onGenerationChange(requireGenerationIndex(nextGeneration));
  };

  return (
    <section className={styles.editor} aria-labelledby={titleId}>
      <header className={styles.editorHeader}>
        <div>
          <h2 id={titleId} className={styles.editorTitle}>
            {readCopyText(copy, 'personEditor', locale)}
          </h2>
        </div>
      </header>

      <div className={styles.editorBody}>
        <div className={styles.previewRow}>
          <div className={styles.preview}>
            <FamilyAvatar
              avatar={draft.avatar}
              label={previewLabel}
            />
          </div>
          <div className={styles.previewActions}>
            <button
              type="button"
              className={styles.randomButton}
              onClick={onRandomize}
            >
              {readCopyText(copy, 'randomAvatar', locale)}
            </button>
            <p className={styles.helpText}>
              {readCopyText(copy, 'avatarHelp', locale)}
            </p>
          </div>
        </div>

        <div className={styles.fieldGrid}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>
              {readCopyText(copy, 'name', locale)}
            </span>
            <input
              className={styles.textInput}
              type="text"
              value={textFieldValue(draft, 'name')}
              placeholder={readCopyText(copy, 'namePlaceholder', locale)}
              onChange={(event) =>
                updateTextField('name', event.currentTarget.value)
              }
            />
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>
              {readCopyText(copy, 'age', locale)}
            </span>
            <input
              className={styles.textInput}
              type="text"
              value={textFieldValue(draft, 'age')}
              placeholder={readCopyText(copy, 'agePlaceholder', locale)}
              onChange={(event) =>
                updateTextField('age', event.currentTarget.value)
              }
            />
          </label>

          <label className={`${styles.field} ${styles.fieldWide}`}>
            <span className={styles.fieldLabel}>
              {readCopyText(copy, 'description', locale)}
            </span>
            <textarea
              className={styles.textArea}
              value={textFieldValue(draft, 'description')}
              placeholder={readCopyText(copy, 'descriptionPlaceholder', locale)}
              onChange={(event) =>
                updateTextField('description', event.currentTarget.value)
              }
            />
          </label>
        </div>

        <div
          className={styles.categoryTabs}
          role="tablist"
          aria-label={readCopyText(copy, 'personEditor', locale)}
        >
          {FAMILY_TREE_AVATAR_CATEGORIES.map((category, categoryIndex) => {
            const validatedCategory = requireAvatarCategory(category);
            const selected = activeCategory === validatedCategory;
            const tabId = `${editorId}-category-${validatedCategory}`;

            return (
              <button
                key={validatedCategory}
                id={tabId}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={categoryPanelId}
                tabIndex={selected ? 0 : -1}
                className={`${styles.tab} ${selected ? styles.tabSelected : ''}`}
                onClick={() => setActiveCategory(validatedCategory)}
                onKeyDown={(event) =>
                  handleCategoryKeyDown(event, categoryIndex)
                }
              >
                {readCopyCollectionText(
                  copy,
                  'categoryNames',
                  validatedCategory,
                  locale,
                )}
              </button>
            );
          })}
        </div>

        <div
          id={categoryPanelId}
          className={styles.catalog}
          role="tabpanel"
          aria-labelledby={`${editorId}-category-${activeCategory}`}
          tabIndex={0}
        >
          <div className={styles.catalogHeader}>
            <span className={styles.sectionLabel}>{categoryLabel}</span>
            <p className={styles.catalogSummary}>
              {choices.length}
              {colorKey === null
                ? ''
                : ` · ${readCopyCollectionText(
                    copy,
                    'colorNames',
                    colorKey,
                    locale,
                  )} ${familyTreeColorIndexCount(colorKey)}`}
            </p>
          </div>

          {colorKey === null ? null : (
            <div
              className={styles.colorPalette}
              aria-label={readCopyCollectionText(
                copy,
                'colorNames',
                colorKey,
                locale,
              )}
            >
              {Array.from({ length: familyTreeColorIndexCount(colorKey) }, (_, colorOffset) => {
                const colorIndex = colorOffset + 1;
                const selected = draft.avatar[colorKey] === colorIndex;

                return (
                  <button
                    key={colorIndex}
                    type="button"
                    className={styles.colorButton}
                    data-family-tree-avatar-color={`${colorKey}-${colorIndex}`}
                    style={
                      {
                        '--swatch-color': colorSwatch(colorKey, colorIndex),
                      } as CSSProperties
                    }
                    aria-label={`${readCopyCollectionText(
                      copy,
                      'colorNames',
                      colorKey,
                      locale,
                    )} ${colorIndex}`}
                    aria-pressed={selected}
                    onClick={() => updateAvatarColor(colorKey, colorIndex)}
                  >
                    {colorIndex}
                  </button>
                );
              })}
            </div>
          )}

          <div className={styles.choiceViewport}>
            <div className={styles.choiceGroups}>
              {Array.from(
                new Set(choices.map((choice) => choice.group)),
              ).map((group) => {
                const groupChoices = choices.filter(
                  (choice) => choice.group === group,
                );
                if (groupChoices.length === 0) {
                  throw new Error(
                    `Family tree avatar group ${JSON.stringify(group)} has no choices.`,
                  );
                }

                return (
                  <section className={styles.choiceGroup} key={group}>
                    <h3 className={styles.choiceGroupTitle}>
                      {readChoiceGroupLabel(copy, groupChoices[0]!, locale)}
                    </h3>
                    <div className={styles.choiceGrid}>
                      {groupChoices.map((choice) => {
                        const choiceIndex = choices.indexOf(choice);
                      const choiceLabel = localizedChoiceName(
                        choice,
                        locale,
                        choiceIndex,
                      );
                      const choiceImagePath = getFamilyTreeChoiceImagePath(
                        draft.avatar,
                        choice.id,
                      );
                      const thumbnailCrop = choiceThumbnailCrop(choice);
                      const thumbnailOpacity = choiceThumbnailOpacity(choice);
                      const selected = familyTreeAvatarChoiceSelected(
                        draft.avatar,
                        choice.id,
                      );

                        return (
                          <button
                            key={choice.id}
                            type="button"
                            className={`${styles.choiceButton} ${
                              selected ? styles.choiceButtonSelected : ''
                            }`}
                            data-family-tree-avatar-choice={choice.id}
                            aria-label={choiceLabel}
                            aria-pressed={selected}
                            onClick={() => updateAvatarChoice(choice.id)}
                          >
                            {choiceImagePath === null ? (
                              <span className={styles.choiceFallback} aria-hidden="true">
                                {choiceFallbackSymbol(choice, choiceLabel)}
                              </span>
                            ) : thumbnailCrop === null ? (
                              // eslint-disable-next-line @next/next/no-img-element -- catalog thumbnails are local static assets.
                              <img
                                className={styles.choiceImage}
                                src={choiceImagePath}
                                alt=""
                                loading="lazy"
                                style={
                                  thumbnailOpacity === undefined
                                    ? undefined
                                    : { opacity: thumbnailOpacity }
                                }
                              />
                            ) : (
                              <span
                                className={styles.choiceImageCrop}
                                aria-hidden="true"
                                style={{
                                  ...thumbnailCrop,
                                  backgroundImage: `url("${choiceImagePath}")`,
                                }}
                              />
                            )}
                            <span className={styles.choiceLabel}>{choiceLabel}</span>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      <div className={styles.placement}>
        <label className={styles.placementField}>
          <span className={styles.fieldLabel}>
            {readCopyText(copy, 'placement', locale)}
          </span>
          <select
            className={styles.generationSelect}
            value={generation}
            aria-label={`${readCopyText(copy, 'placement', locale)}: ${selectedGenerationLabel}`}
            onChange={handleGenerationChange}
          >
            {FAMILY_TREE_AVATAR_CATEGORIES.length > 0
              ? [0, 1, 2, 3].map((generationIndex) => (
                  <option key={generationIndex} value={generationIndex}>
                    {readGenerationLabel(
                      copy,
                      requireGenerationIndex(generationIndex),
                      locale,
                    )}
                  </option>
                ))
              : null}
          </select>
        </label>
        <button
          type="button"
          className={styles.addButton}
          onClick={onAdd}
        >
          {readCopyText(copy, 'addPerson', locale)}
        </button>
      </div>
    </section>
  );
}

export type { FamilyAvatarEditorProps };
