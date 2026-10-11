import { describe, expect, test } from 'vitest';

import { dndArmorArticleHtml, dndArmorArticleHtmlZh } from './dnd-armor-guide';
import { dndClassesArticleHtml, dndClassesArticleHtmlZh } from './dnd-classes-explained';
import { dndConstitutionArticleHtml, dndConstitutionArticleHtmlZh } from './dnd-constitution-guide';
import { dndDeathKnightArticleHtml, dndDeathKnightArticleHtmlZh } from './dnd-death-knight';

const BASIC_RULES_2014_CLASSES_URL = 'https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes';
const BASIC_RULES_2024_CLASSES_URL = 'https://www.dndbeyond.com/sources/dnd/br-2024/character-classes';
const BASIC_RULES_2014_EQUIPMENT_URL = 'https://www.dndbeyond.com/sources/dnd/basic-rules-2014/equipment';
const BASIC_RULES_2024_EQUIPMENT_URL = 'https://www.dndbeyond.com/sources/dnd/br-2024/equipment';
const BASIC_RULES_2024_MAGIC_ITEMS_URL = 'https://www.dndbeyond.com/sources/dnd/br-2024/magic-items-a-z';
const BASIC_RULES_2014_CONSTITUTION_URL =
  'https://www.dndbeyond.com/sources/dnd/basic-rules-2014/using-ability-scores';
const BASIC_RULES_2024_CHARACTER_CREATION_URL =
  'https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character';
const BASIC_RULES_2024_GLOSSARY_URL = 'https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary';
const DEATH_KNIGHT_CATALOG_URL =
  'https://www.dndbeyond.com/monsters?filter-search=&amp;filter-type=16&amp;page=3';
const UA_VILLAINOUS_OPTIONS_URL =
  'https://media.dndbeyond.com/compendium-images/ua/villainous-options/VRQr4YbETAgmpWRj/UA2026-VillainousOptions.pdf';

describe('D&D article rule-source references', () => {
  test('class guidance identifies its advice as non-official and links both editions', () => {
    for (const articleHtml of [dndClassesArticleHtml, dndClassesArticleHtmlZh]) {
      expect(articleHtml).toContain(BASIC_RULES_2014_CLASSES_URL);
      expect(articleHtml).toContain(BASIC_RULES_2024_CLASSES_URL);
    }

    expect(dndClassesArticleHtml).toContain('not an official ranking');
    expect(dndClassesArticleHtmlZh).toContain('不是官方职业难度排名');
  });

  test('armor guide links its edition-specific tables and states the checked examples', () => {
    for (const articleHtml of [dndArmorArticleHtml, dndArmorArticleHtmlZh]) {
      expect(articleHtml).toContain(BASIC_RULES_2014_EQUIPMENT_URL);
      expect(articleHtml).toContain(BASIC_RULES_2024_EQUIPMENT_URL);
      expect(articleHtml).toContain(BASIC_RULES_2024_MAGIC_ITEMS_URL);
    }

    expect(dndArmorArticleHtml).toContain('the same AC as chain mail');
    expect(dndArmorArticleHtmlZh).toContain('与锁子甲相同');
    expect(dndArmorArticleHtml).toContain('studded leather reaches AC 15 at Dex +3');
    expect(dndArmorArticleHtmlZh).toContain('敏捷 +3 时镶嵌皮甲 AC 15');
    expect(dndArmorArticleHtml).toContain('2024 Clerics gain it by choosing Protector Divine Order');
    expect(dndArmorArticleHtmlZh).toContain('2024 规则下可选择 Protector 神圣秩序获得重甲训练');
    expect(dndArmorArticleHtml).toContain('2024 Armor, +1, +2, or +3');
    expect(dndArmorArticleHtml).toContain('<em>Shield of Faith</em> spell');
    expect(dndArmorArticleHtmlZh).toContain('2014 护甲规则');
    expect(dndArmorArticleHtmlZh).toContain('2024 规则中的 +1、+2 或 +3 护甲');
    expect(dndArmorArticleHtmlZh).toContain('虔诚护盾');
    expect(dndArmorArticleHtml).not.toContain('Life, War, Forge domains');
    expect(dndArmorArticleHtmlZh).not.toContain('生命、战争、锻造领域');
  });

  test('Constitution guide links edition rules and includes both concentration DC floors', () => {
    for (const articleHtml of [dndConstitutionArticleHtml, dndConstitutionArticleHtmlZh]) {
      expect(articleHtml).toContain(BASIC_RULES_2014_CONSTITUTION_URL);
      expect(articleHtml).toContain(BASIC_RULES_2024_CHARACTER_CREATION_URL);
      expect(articleHtml).toContain(BASIC_RULES_2024_GLOSSARY_URL);
    }

    expect(dndConstitutionArticleHtml).toContain('the higher of 10 and half the damage rounded down');
    expect(dndConstitutionArticleHtml).toContain('with a maximum DC of 30');
    expect(dndConstitutionArticleHtmlZh).toContain('DC 为 10 或伤害减半后向下取整，取较高值，最高为 30');
  });

  test('Death Knight article separates catalog monsters from the linked UA player path', () => {
    for (const articleHtml of [dndDeathKnightArticleHtml, dndDeathKnightArticleHtmlZh]) {
      expect(articleHtml).toContain(DEATH_KNIGHT_CATALOG_URL);
      expect(articleHtml).toContain(UA_VILLAINOUS_OPTIONS_URL);
    }

    expect(dndDeathKnightArticleHtml).toContain('Death Knight Initiate requires level 4+ and the Weapon Mastery feature');
    expect(dndDeathKnightArticleHtmlZh).toContain('Initiate 的先决条件是 4 级或以上且拥有 Weapon Mastery');
    expect(dndDeathKnightArticleHtml).toContain('not officially part of the game');
    expect(dndDeathKnightArticleHtmlZh).toContain('尚未正式加入游戏');
  });
});
