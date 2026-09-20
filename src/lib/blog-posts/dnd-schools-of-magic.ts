import {
  DND_SCHOOLS_OF_MAGIC_2014_SPELLCASTING_URL,
  DND_SCHOOLS_OF_MAGIC_2014_SPELLS_URL,
  DND_SCHOOLS_OF_MAGIC_2024_SPELL_DESCRIPTIONS_URL,
  DND_SCHOOLS_OF_MAGIC_2024_SPELLS_URL,
  DND_SCHOOLS_OF_MAGIC_EIGHT_SCHOOLS_IMAGE_PATH,
  DND_SCHOOLS_OF_MAGIC_EIGHT_SCHOOLS_ZH_IMAGE_PATH,
  DND_SCHOOLS_OF_MAGIC_WIZARD_COMPARISON_URL,
} from './shared';

export const DND_SCHOOLS_OF_MAGIC_SLUG = 'dnd-schools-of-magic';
export const DND_SCHOOLS_OF_MAGIC_UPDATED_AT = '2026-09-16';
export const DND_SCHOOLS_OF_MAGIC_LOCKED_EN_BODY_HASH =
  '74d76115c45ee430f6e74b450af13c7577f79b00ec1b8eee09b46bde557fe8a3';
export const DND_SCHOOLS_OF_MAGIC_LOCKED_ZH_BODY_HASH =
  '25e728d6747be45f4a77af7f21e591a636870115cede2f17caeddbcfd88b4e05';
export const DND_SCHOOLS_OF_MAGIC_ENGLISH_H1 =
  'D&D Schools of Magic Explained: The Eight Spell Schools and How to Read Them';
export const DND_SCHOOLS_OF_MAGIC_ENGLISH_SEO_TITLE =
  'D&D Schools of Magic: Eight Categories, Not a Class Ability';
export const DND_SCHOOLS_OF_MAGIC_ENGLISH_DESCRIPTION =
  'dnd schools of magic names eight 2024 spell categories, not class features. Pair each school with a checked example, then check the spell, class list, and rules year.';
export const DND_SCHOOLS_OF_MAGIC_CHINESE_H1 =
  'DND 法术学派详解：dnd schools of magic 的八类分类与查阅方法';
export const DND_SCHOOLS_OF_MAGIC_CHINESE_SEO_TITLE =
  'dnd schools of magic：八类法术学派，不是法师子职';
export const DND_SCHOOLS_OF_MAGIC_CHINESE_DESCRIPTION =
  '把 dnd schools of magic 的八个中文工作标签对上英文原名和已核验的 2024 示例；分清法术分类、职业法术列表和 Wizard 子职，并按规则年份核对 Cure Wounds 与 Detect Magic。';
export const DND_SCHOOLS_OF_MAGIC_ENGLISH_COVER_ALT =
  'Eight D&D spell-school names shown as peer categories, not a ranking.';
export const DND_SCHOOLS_OF_MAGIC_CHINESE_COVER_ALT =
  '八个 D&D 法术学派名称的平级查阅示意，不是排名。';
export const DND_SCHOOLS_OF_MAGIC_RELATED_SLUGS = [
  'dnd-wizard-spells',
  'dnd-necromancer-spells',
] as const;
export const DND_SCHOOLS_OF_MAGIC_PUBLIC_SOURCE_URLS = [
  DND_SCHOOLS_OF_MAGIC_2024_SPELLS_URL,
  DND_SCHOOLS_OF_MAGIC_2014_SPELLCASTING_URL,
  DND_SCHOOLS_OF_MAGIC_2024_SPELL_DESCRIPTIONS_URL,
  DND_SCHOOLS_OF_MAGIC_2014_SPELLS_URL,
  DND_SCHOOLS_OF_MAGIC_WIZARD_COMPARISON_URL,
] as const;

const EIGHT_SCHOOLS_GRID_PLACEHOLDER = '__SCHOOLS_EIGHT_GRID__';
const ENGLISH_FIGURE_EDITION_LABELS = ['2014', '2024 revised'] as const;
const CHINESE_FIGURE_EDITION_LABELS = ['2014', '2024 修订版'] as const;

export type QuoteOccurrence = {
  quote: string;
  occurrence: number;
};

export type PublicReference = {
  id: string;
  label: string;
  url: string;
  versionNote: string;
  appliesTo: readonly QuoteOccurrence[];
};

function requireNonemptyString(value: unknown, label: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${label} must be a nonempty string, received: ${JSON.stringify(value)}`);
  }

  return value;
}

function countSubstringOccurrences(haystack: string, needle: string): number {
  if (needle.length === 0) {
    throw new Error(`Cannot count occurrences of an empty string.`);
  }

  return haystack.split(needle).length - 1;
}

function requireExactOccurrence(
  haystack: string,
  needle: string,
  expectedCount: number,
  label: string,
): void {
  if (expectedCount < 1) {
    throw new Error(`${label} expectedCount must be >= 1, received: ${expectedCount}`);
  }

  const actualCount = countSubstringOccurrences(haystack, needle);
  if (actualCount !== expectedCount) {
    throw new Error(
      `${label} expected ${expectedCount} occurrence(s) of ${JSON.stringify(needle)}, received: ${actualCount}`,
    );
  }
}

function figureEditionHeadingMarkup(label: string): string {
  return `<h3 style="margin-top:0;">${label}</h3>`;
}

function figureEditionVisibleLabelMarkup(label: string): string {
  return `<p style="margin-top:0;"><strong>${label}</strong></p>`;
}

function assertNoHeadingElementsInsideFigures(html: string, locale: string): void {
  const figureHtmlBlocks = html.match(/<figure\b[\s\S]*?<\/figure>/gi) ?? [];
  if (figureHtmlBlocks.length !== 3) {
    throw new Error(
      `Schools-of-magic HTML for locale=${locale} expected 3 figures when checking figure headings, received: ${figureHtmlBlocks.length}`,
    );
  }

  for (const figureHtml of figureHtmlBlocks) {
    const headingTag = figureHtml.match(/<h[1-6]\b/i)?.[0];
    if (headingTag) {
      throw new Error(
        `Schools-of-magic HTML for locale=${locale} still contains heading tag ${JSON.stringify(headingTag)} inside a figure.`,
      );
    }
  }
}

function replaceFigureEditionHeadingsWithVisibleLabels(html: string, locale: string): string {
  const editionLabels =
    locale === 'en-US'
      ? ENGLISH_FIGURE_EDITION_LABELS
      : locale === 'zh-CN'
        ? CHINESE_FIGURE_EDITION_LABELS
        : null;
  if (!editionLabels) {
    throw new Error(`Unsupported schools-of-magic locale: ${JSON.stringify(locale)}`);
  }

  let convertedHtml = html;
  for (const label of editionLabels) {
    const headingMarkup = figureEditionHeadingMarkup(label);
    requireExactOccurrence(
      convertedHtml,
      headingMarkup,
      1,
      `Figure edition heading for locale=${locale} label=${JSON.stringify(label)}`,
    );
    convertedHtml = convertedHtml.replaceAll(headingMarkup, figureEditionVisibleLabelMarkup(label));
  }

  assertNoHeadingElementsInsideFigures(convertedHtml, locale);

  for (const label of editionLabels) {
    requireExactOccurrence(
      convertedHtml,
      figureEditionVisibleLabelMarkup(label),
      1,
      `Visible figure edition label for locale=${locale} label=${JSON.stringify(label)}`,
    );
  }

  return convertedHtml;
}

function bindEightSchoolsGridImage(lockedHtml: string, imagePath: string, locale: string): string {
  const html = requireNonemptyString(lockedHtml, `Locked schools-of-magic HTML for locale=${locale}`);
  const boundPath = requireNonemptyString(
    imagePath,
    `Eight-schools grid image path for locale=${locale}`,
  );
  requireExactOccurrence(
    html,
    EIGHT_SCHOOLS_GRID_PLACEHOLDER,
    1,
    `Schools-of-magic HTML for locale=${locale}`,
  );

  const boundHtml = html.replaceAll(EIGHT_SCHOOLS_GRID_PLACEHOLDER, boundPath);
  const leftoverPlaceholder = boundHtml.match(/__SCHOOLS_[A-Z0-9_]+__/);
  if (leftoverPlaceholder) {
    throw new Error(
      `Schools-of-magic HTML for locale=${locale} still contains placeholder ${leftoverPlaceholder[0]} after image path binding.`,
    );
  }

  return boundHtml;
}

function bindSchoolsOfMagicArticleHtml(locale: string, lockedHtml: string, imagePath: string): string {
  if (locale !== 'en-US' && locale !== 'zh-CN') {
    throw new Error(`Unsupported schools-of-magic locale: ${JSON.stringify(locale)}`);
  }

  const boundHtml = bindEightSchoolsGridImage(lockedHtml, imagePath, locale);

  if (/<h1\b/i.test(boundHtml)) {
    throw new Error(`Schools-of-magic HTML for locale=${locale} contains a second H1.`);
  }

  requireExactOccurrence(boundHtml, '<figure', 3, `Schools-of-magic figures for locale=${locale}`);
  requireExactOccurrence(boundHtml, '</figure>', 3, `Schools-of-magic figure closers for locale=${locale}`);
  requireExactOccurrence(boundHtml, '<figcaption>', 3, `Schools-of-magic captions for locale=${locale}`);

  for (const sourceUrl of DND_SCHOOLS_OF_MAGIC_PUBLIC_SOURCE_URLS) {
    if (!boundHtml.includes(sourceUrl)) {
      throw new Error(
        `Schools-of-magic HTML for locale=${locale} is missing public source URL: ${sourceUrl}`,
      );
    }
  }

  const forbiddenSnippets = [
    'tokenmaker',
    'href="/blog/',
    'href="/zh/blog/',
    'FAQPage',
    'lite-video',
    '<iframe',
    'data-video-id=',
  ];
  for (const snippet of forbiddenSnippets) {
    if (boundHtml.includes(snippet)) {
      throw new Error(
        `Schools-of-magic HTML for locale=${locale} contains forbidden snippet: ${JSON.stringify(snippet)}`,
      );
    }
  }

  return replaceFigureEditionHeadingsWithVisibleLabels(boundHtml, locale);
}

const dndSchoolsOfMagicLockedEnglishHtml = String.raw`
<p>The phrase <code>dnd schools of magic</code> refers to eight spell categories in the 2024 revised core rules: Abjuration, Conjuration, Divination, Enchantment, Evocation, Illusion, Necromancy, and Transmutation. A school label tells you what kind of magical idea a spell is grouped with. It does not, by itself, grant a character an ability, put the spell on a class list, or tell you everything the spell can do. The <a href="https://www.dndbeyond.com/sources/dnd/br-2024/spells" rel="noreferrer noopener">2024 Basic Rules explanation of schools of magic</a> is the right starting point for the current reference below.</p>
<p>This article uses the 2024 revised rules for the school list and the example spells. It checks the 2014 rules only where a direct comparison prevents a common mistake. If your table uses another book, setting, or house rule, keep that source’s version label beside the spell entry.</p>
<figure style="margin:1.5rem 0;width:100%;">
  <img class="inline-figure__image inline-figure__image--wide" src="__SCHOOLS_EIGHT_GRID__" alt="Eight peer spell-school categories paired with checked 2024 examples: Abjuration with Shield; Conjuration with Misty Step; Divination with Detect Magic; Enchantment with Charm Person; Evocation with Fireball; Illusion with Minor Illusion; Necromancy with Animate Dead; Transmutation with Polymorph." width="1536" height="960" loading="lazy" decoding="async" />
  <div role="list" aria-label="Eight peer spell-school categories paired with checked 2024 examples: Abjuration with Shield; Conjuration with Misty Step; Divination with Detect Magic; Enchantment with Charm Person; Evocation with Fireball; Illusion with Minor Illusion; Necromancy with Animate Dead; Transmutation with Polymorph." style="display:flex;flex-wrap:wrap;gap:0.75rem;">
    <div role="listitem" style="box-sizing:border-box;flex:1 1 14rem;min-width:0;border:1px solid #111827;border-radius:0.5rem;padding:0.8rem 0.9rem;">
      <strong>Abjuration</strong><br><span>Checked 2024 example: <code>Shield</code></span>
    </div>
    <div role="listitem" style="box-sizing:border-box;flex:1 1 14rem;min-width:0;border:1px solid #111827;border-radius:0.5rem;padding:0.8rem 0.9rem;">
      <strong>Conjuration</strong><br><span>Checked 2024 example: <code>Misty Step</code></span>
    </div>
    <div role="listitem" style="box-sizing:border-box;flex:1 1 14rem;min-width:0;border:1px solid #111827;border-radius:0.5rem;padding:0.8rem 0.9rem;">
      <strong>Divination</strong><br><span>Checked 2024 example: <code>Detect Magic</code></span>
    </div>
    <div role="listitem" style="box-sizing:border-box;flex:1 1 14rem;min-width:0;border:1px solid #111827;border-radius:0.5rem;padding:0.8rem 0.9rem;">
      <strong>Enchantment</strong><br><span>Checked 2024 example: <code>Charm Person</code></span>
    </div>
    <div role="listitem" style="box-sizing:border-box;flex:1 1 14rem;min-width:0;border:1px solid #111827;border-radius:0.5rem;padding:0.8rem 0.9rem;">
      <strong>Evocation</strong><br><span>Checked 2024 example: <code>Fireball</code></span>
    </div>
    <div role="listitem" style="box-sizing:border-box;flex:1 1 14rem;min-width:0;border:1px solid #111827;border-radius:0.5rem;padding:0.8rem 0.9rem;">
      <strong>Illusion</strong><br><span>Checked 2024 example: <code>Minor Illusion</code></span>
    </div>
    <div role="listitem" style="box-sizing:border-box;flex:1 1 14rem;min-width:0;border:1px solid #111827;border-radius:0.5rem;padding:0.8rem 0.9rem;">
      <strong>Necromancy</strong><br><span>Checked 2024 example: <code>Animate Dead</code></span>
    </div>
    <div role="listitem" style="box-sizing:border-box;flex:1 1 14rem;min-width:0;border:1px solid #111827;border-radius:0.5rem;padding:0.8rem 0.9rem;">
      <strong>Transmutation</strong><br><span>Checked 2024 example: <code>Polymorph</code></span>
    </div>
  </div>
  <figcaption>Eight spell-school categories, each paired with one checked 2024 example.</figcaption>
</figure>
<p>These eight entries are peer categories rather than a ranking; each example shows a printed 2024 school label, not a promise that every spell in the category works the same way.</p>
<h2>What a school of magic tells you</h2>
<p>A school of magic is a classification attached to a spell. In the 2024 rules, the school appears as part of a spell’s information, alongside details such as its level and the class spell lists that include it. The category gives you a useful first description: protection, transport, information, mental influence, magical energy, deception, life and death, or change.</p>
<p>That description is an index, not a replacement for the spell’s rules. A school does not tell you the spell’s range, target, action, saving throw, duration, concentration requirement, or every limitation. Those details remain in the individual entry. The category also does not make every spell in the same school behave alike. <code>Shield</code> and <code>Cure Wounds</code>, for example, can share a school in one rules version while doing very different jobs.</p>
<p>The 2014 <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spellcasting" rel="noreferrer noopener">school-of-magic rules</a> make the same basic distinction: the eight schools describe spells, and the labels themselves do not create a separate rules subsystem. Other rules can still refer to a school. That is why the careful sentence is “the label is a classification with limited context,” not “schools never matter.”</p>
<h2>D&amp;D schools of magic: the eight categories at a glance</h2>
<p>The table is a reference map, not a recommended spell list. Each example is a 2024 spell entry checked in the <a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions" rel="noreferrer noopener">2024 spell descriptions</a>. The short category cues are plain-language paraphrases; use the linked entry for the spell’s full text.</p>
<table>
<thead>
<tr><th>School</th><th>Category cue</th><th>Checked 2024 example</th><th>What the example helps you recognize</th></tr>
</thead>
<tbody>
<tr><td>Abjuration</td><td>Protection or reversal of harm</td><td><a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#Shield" rel="noreferrer noopener">Shield</a></td><td>A protective response can sit in Abjuration.</td></tr>
<tr><td>Conjuration</td><td>Movement or transport of creatures or objects</td><td><a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#MistyStep" rel="noreferrer noopener">Misty Step</a></td><td>A teleport effect is a clear transport example.</td></tr>
<tr><td>Divination</td><td>Obtaining information</td><td><a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#DetectMagic" rel="noreferrer noopener">Detect Magic</a></td><td>A sensing spell can be a Divination, subject to its entry’s conditions.</td></tr>
<tr><td>Enchantment</td><td>Affecting minds</td><td><a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#CharmPerson" rel="noreferrer noopener">Charm Person</a></td><td>A mind-affecting idea points toward Enchantment, not a universal result.</td></tr>
<tr><td>Evocation</td><td>Producing effects through magical energy, often destructive</td><td><a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#Fireball" rel="noreferrer noopener">Fireball</a></td><td>A spell that channels energy for a dramatic effect is an Evocation example.</td></tr>
<tr><td>Illusion</td><td>Misleading perception or the mind</td><td><a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#MinorIllusion" rel="noreferrer noopener">Minor Illusion</a></td><td>An image or sound used to deceive belongs to the Illusion category.</td></tr>
<tr><td>Necromancy</td><td>Working with life and death</td><td><a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#AnimateDead" rel="noreferrer noopener">Animate Dead</a></td><td>A life-and-death effect is a Necromancy example.</td></tr>
<tr><td>Transmutation</td><td>Changing creatures or objects</td><td><a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#Polymorph" rel="noreferrer noopener">Polymorph</a></td><td>A change to a creature’s form is a Transmutation example.</td></tr>
</tbody>
</table>
<h3>Abjuration: protection and reversal</h3>
<p>Abjuration groups spells around protection or the reversal of harm. <code>Shield</code> is a checked 2024 example. That pairing is useful when you need a quick category cue: a spell that creates a protective response may belong here.</p>
<p>The cue still stops at the school line. It does not mean every defensive effect is mechanically identical, that every healing effect is Abjuration, or that an Abjuration spell automatically grants a ward to its caster. Read the spell’s target, timing, and effect when the exact result matters.</p>
<h3>Conjuration: movement and transport</h3>
<p>Conjuration covers movement or transport of creatures or objects. <code>Misty Step</code> is a clear 2024 example because its entry describes teleporting the caster to an unoccupied visible space within 30 feet. The school helps you recognize why the spell is grouped there; the range and destination restrictions come from <code>Misty Step</code> itself.</p>
<p>That distinction keeps a category from becoming a shortcut. Seeing Conjuration does not tell you that a spell must teleport, summon, or move a target in the same way. Open the named entry before you plan a route, target a creature, or decide whether a space is valid.</p>
<h3>Divination: obtaining information</h3>
<p>Divination spells are organized around obtaining information. <code>Detect Magic</code> is the checked example for this school. Its detailed limits are important enough to revisit later: the spell does not turn the word “Divination” into a promise that you can identify every magical object or name every spell at a glance.</p>
<p>Use Divination as the question “what information is this spell trying to obtain?” Then read the entry to learn what the spell can sense, which target must be visible, what action produces the next result, and which version of the rules you are reading.</p>
<h3>Enchantment: effects on minds</h3>
<p>Enchantment covers effects that affect minds. <code>Charm Person</code> gives the table a recognizable 2024 example. The category is a useful reminder that the spell’s interaction is mental rather than a physical change to an object.</p>
<p>It is not a universal instruction to treat every Enchantment as the same kind of control. Check the individual spell for its target, duration, saving throw, and what the affected creature knows or can do. The school name identifies the family; it does not replace the sentence that resolves the scene.</p>
<h3>Evocation: magical energy and forceful effects</h3>
<p>Evocation groups spells that produce effects through magical energy, often in a destructive form. <code>Fireball</code> is the checked 2024 example. The label makes the energy-driven idea easy to recall, but it does not tell you the spell’s exact area, damage, save, or interaction with cover.</p>
<p>If a player says “this is Evocation, so it should work that way,” treat the school as a prompt to open the entry, not as the ruling. The spell text remains the authority for the action at the table.</p>
<h3>Illusion: misleading perception or the mind</h3>
<p>Illusion covers magic that misleads perception or the mind. <code>Minor Illusion</code> creates a sound or an image of an object, and physical interaction reveals the image as illusory. Those details show why a sensory deception belongs in Illusion without implying that every Illusion creates the same kind of image or has the same way to expose it.</p>
<p>The practical question is whether the entry describes a false perception, and then what the entry says happens when a creature studies or interacts with it. “Illusion” is not a guarantee that an object is invisible, silent, harmless, or undetectable.</p>
<h3>Necromancy: life and death</h3>
<p>Necromancy is the school for working with life and death. <code>Animate Dead</code> is the checked 2024 example. This example places <code>Animate Dead</code> in the eight-school reference. It does not classify every healing spell, summarize every Necromancy spell, or determine how an undead creature is controlled; those questions require the relevant spell and feature text.</p>
<p>When a rule question concerns an undead creature, a life effect, or a spell’s exact control, read the spell and any related feature separately. The category gives context, while the individual text determines the actual outcome.</p>
<h3>Transmutation: changing creatures or objects</h3>
<p>Transmutation covers changing creatures or objects. <code>Polymorph</code> is the checked 2024 example: its entry changes a target to a Beast and includes its own detailed limitations. The category gives you the broad idea of alteration; it does not tell you which target qualifies or what happens to the target’s statistics.</p>
<p>This is a useful example of why school names should not be read as complete spell summaries. “Transmutation” tells you to look for a change. <code>Polymorph</code> tells you the target, form, and limits.</p>
<h2>School label, class spell list, and Wizard subclass are separate layers</h2>
<p>These three terms can appear together in a spell discussion, but they answer different questions. A school label classifies a spell. A class spell list tells you which class list includes that spell, with specific features able to affect access. A Wizard subclass gives a Wizard class feature layer. None of those statements can be substituted for the other two.</p>
<figure style="margin:1.5rem 0;width:100%;">
  <div role="list" aria-label="Three separate rules layers: School of Magic classifies a spell; Class Spell List shows list membership and the access-information layer; Wizard subclass supplies a subclass feature layer." style="display:flex;flex-wrap:wrap;gap:0.75rem;">
    <div role="listitem" style="box-sizing:border-box;flex:1 1 14rem;min-width:0;border:1px solid #111827;border-radius:0.5rem;padding:0.9rem;">
      <strong>School of Magic</strong><br><span>Classifies a spell</span>
    </div>
    <div role="listitem" style="box-sizing:border-box;flex:1 1 14rem;min-width:0;border:1px solid #111827;border-radius:0.5rem;padding:0.9rem;">
      <strong>Class Spell List</strong><br><span>Shows list membership and the access-information layer</span>
    </div>
    <div role="listitem" style="box-sizing:border-box;flex:1 1 14rem;min-width:0;border:1px solid #111827;border-radius:0.5rem;padding:0.9rem;">
      <strong>Wizard subclass</strong><br><span>Supplies a subclass feature layer</span>
    </div>
  </div>
  <figcaption>A school label, a class spell list, and a Wizard subclass answer different questions.</figcaption>
</figure>
<h3>A school label answers “what category is this spell in?”</h3>
<p>The school is attached to the spell entry. It helps you organize a spell and gives a first description of its magical idea. It does not answer whether your character knows the spell, has prepared it, can cast it today, or satisfies a feature’s condition.</p>
<p>For example, recognizing <code>Misty Step</code> as Conjuration does not put it on every character’s list. Recognizing <code>Fireball</code> as Evocation does not give a character the spell or settle whether a particular class feature interacts with it. Those are separate checks.</p>
<h3>A class spell list answers “where can this spell be available?”</h3>
<p>The class names in a 2024 spell entry identify class spell lists. That is access information, not a school ranking. A spell can belong to Divination while still requiring the right class, feature, source, or other rule for a character to use it.</p>
<p>When the table question is “can this character cast that spell?”, start with the character’s class and the approved rules sources, then check the class spell list and any feature that changes access. Do not infer availability from a school label. The <a href="https://www.dndbeyond.com/sources/dnd/br-2024/spells" rel="noreferrer noopener">2024 Basic Rules spell section</a> keeps the school and class-list fields next to each other, which is useful for reading them as separate pieces of information.</p>
<h3>A Wizard subclass answers “what does this class feature provide?”</h3>
<p>In Chinese and English discussions, “Wizard school” can refer to a Wizard subclass rather than the school printed on a spell. Keep that usage separate. The official <a href="https://www.dndbeyond.com/posts/1753-2024-wizard-vs-2014-wizard-whats-new" rel="noreferrer noopener">2024 Wizard versus 2014 Wizard comparison</a> describes the 2024 Player’s Handbook subclass layer and names options such as Abjurer, Diviner, Evoker, and Illusionist. It also scopes a subclass-selection change to that 2024 Player’s Handbook comparison.</p>
<p>That comparison does not turn four named subclass examples into a new four-school list, and it does not say that the eight spell schools are eight mandatory Wizard builds. If your question is about a feature, read the subclass feature. If your question is about the spell’s category, read the spell’s school line.</p>
<h2>Use the individual spell entry for similar-looking effects</h2>
<p>To use the categories, let the label narrow your question, then let the spell entry answer it. This matters when two effects sound similar in ordinary conversation.</p>
<p>Consider three checked examples. <code>Minor Illusion</code> is about misleading perception with a sound or an image. <code>Misty Step</code> is about transporting the caster to an unoccupied visible space within 30 feet. <code>Polymorph</code> is about changing a target into a Beast under the conditions in that entry. All three can change what a scene looks like, but they do so through different rule text and different schools.</p>
<p>Here is a bounded hypothetical scene: a guard sees a false crate, a character teleports across a gap, and a creature’s form changes. The school categories help you sort those questions into Illusion, Conjuration, and Transmutation. They do not answer whether the guard can interact with the image, whether the destination is visible and unoccupied, or which target and limitations apply to the form change. Those answers come from the three spell entries.</p>
<p>This is also why a mnemonic, colour chart, or homebrew diagram cannot replace the source text. The category may be stable while a spell’s wording, school assignment, or other conditions differ by rules year. Keep the named spell and rules version beside any table note you make.</p>
<h2>Version differences and table use: check the rules year first</h2>
<p>The same spell name can appear with a different school in different rulebooks. That is not a reason to declare one page wrong before checking its version. The clearest bounded example is <code>Cure Wounds</code>:</p>
<table>
<thead>
<tr><th>Rules entry</th><th>School shown</th><th>What this comparison proves</th></tr>
</thead>
<tbody>
<tr><td>2014 <code>Cure Wounds</code> in the <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#CureWounds" rel="noreferrer noopener">2014 spells</a></td><td>Evocation</td><td>The older core entry uses this school label.</td></tr>
<tr><td>2024 <code>Cure Wounds</code> in the <a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#CureWounds" rel="noreferrer noopener">2024 spell descriptions</a></td><td>Abjuration</td><td>The revised core entry uses a different school label.</td></tr>
</tbody>
</table>
<p>This is a version difference, not a rule that all healing belongs to Abjuration or that a school can be inferred from a spell’s everyday description. When a note, character sheet, or online result disagrees with your book, record the rules year and open the matching entry.</p>
<h3>What <code>Detect Magic</code> can reveal, and what it cannot</h3>
<p><code>Detect Magic</code> shows why the school label can matter at the table while still having limits. In the 2024 entry, the spell senses magical effects within 30 feet. After sensing one, a Magic action reveals an aura on a visible creature or object bearing magic, and it reveals a spell’s school when the effect was created by a spell. The spell requires concentration for up to 10 minutes. Its barriers are also specified: 1 foot of stone, dirt, or wood; 1 inch of metal; or a thin sheet of lead.</p>
<p>The 2014 entry also uses a 30-foot sensing range, an action on a visible creature or object, and concentration for up to 10 minutes. Its barrier wording differs: 1 foot of stone, 1 inch of common metal, lead, or 3 feet of wood or dirt. Keep those conditions beside the edition label instead of merging them into one timeless sentence. Compare the <a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#DetectMagic" rel="noreferrer noopener">2024 entry</a> with the <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#DetectMagic" rel="noreferrer noopener">2014 entry</a> when the difference affects the scene.</p>
<p>Neither version turns a school reading into the exact name of the spell. The result can tell you the school of a spell-created effect under the entry’s conditions. It does not, by that fact alone, provide the complete spell description, identify a non-spell magical effect as a named spell, or remove the visible-target and action requirements.</p>
<figure style="margin:1.5rem 0;width:100%;">
  <div role="group" aria-label="Edition comparison: in 2014, Cure Wounds is Evocation and Detect Magic has the listed 30-foot, visible-target, action, concentration, duration, and barrier conditions; in 2024, Cure Wounds is Abjuration and Detect Magic has its separately listed 30-foot, visible-target, Magic action, spell-created-effect, concentration, duration, and barrier conditions." style="display:flex;flex-wrap:wrap;gap:0.75rem;">
    <section aria-label="2014 rules" style="box-sizing:border-box;flex:1 1 23rem;min-width:0;border:1px solid #111827;border-radius:0.5rem;padding:0.9rem;overflow-wrap:anywhere;">
      <h3 style="margin-top:0;">2014</h3>
      <p><strong><code>Cure Wounds</code></strong><br>School: <code>Evocation</code></p>
      <p><strong><code>Detect Magic</code></strong></p>
      <ul>
        <li>Senses magic within 30 feet.</li>
        <li>An action reveals an aura on a visible creature or object and its school, if any.</li>
        <li>Concentration, up to 10 minutes.</li>
        <li>Blocked by 1 foot of stone, 1 inch of common metal, a thin sheet of lead, or 3 feet of wood or dirt.</li>
      </ul>
    </section>
    <section aria-label="2024 revised rules" style="box-sizing:border-box;flex:1 1 23rem;min-width:0;border:1px solid #111827;border-radius:0.5rem;padding:0.9rem;overflow-wrap:anywhere;">
      <h3 style="margin-top:0;">2024 revised</h3>
      <p><strong><code>Cure Wounds</code></strong><br>School: <code>Abjuration</code></p>
      <p><strong><code>Detect Magic</code></strong></p>
      <ul>
        <li>Senses magical effects within 30 feet.</li>
        <li>The Magic action reveals an aura on a visible creature or object bearing magic and reveals a spell’s school when the effect was created by a spell.</li>
        <li>Concentration, up to 10 minutes.</li>
        <li>Blocked by 1 foot of stone, dirt, or wood, 1 inch of metal, or a thin sheet of lead.</li>
      </ul>
    </section>
  </div>
  <figcaption>Version labels can change a spell’s school and the conditions for reading a school with Detect Magic.</figcaption>
</figure>
<h2>A reusable school-label check</h2>
<p>When a spell question comes up, use this order:</p>
<ol>
<li><strong>Identify the rules year and source.</strong> Write “2014” or “2024 revised” beside the entry before comparing labels.</li>
<li><strong>Read the school line.</strong> Use the eight-category table to recognize the broad family, not to invent an effect.</li>
<li><strong>State the question you actually need answered.</strong> Category, character access, subclass feature, and spell behavior are different questions.</li>
<li><strong>Open the individual spell entry.</strong> Check target, range, action, save, duration, concentration, and any condition that affects the scene.</li>
<li><strong>Check access separately.</strong> If the question is whether a character can cast the spell, read the class spell list and relevant features instead of the school label.</li>
<li><strong>Stop at the supported boundary.</strong> If the source tells you the school but not the exact interaction, say what is known and continue with the rule that covers the interaction.</li>
</ol>
<p>That sequence makes <strong>dnd schools of magic</strong> useful without asking the eight labels to do work they were not written to do. Start with the category, then return to the right spell, class-list, subclass, and rules-year text for the decision in front of you.</p>
<h2>Sources</h2>
<ul>
<li><a href="https://www.dndbeyond.com/sources/dnd/br-2024/spells" rel="noreferrer noopener">D&amp;D Beyond Basic Rules: Spells</a></li>
<li><a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spellcasting" rel="noreferrer noopener">D&amp;D Beyond Basic Rules (2014): Spellcasting</a></li>
<li><a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions" rel="noreferrer noopener">D&amp;D Beyond Basic Rules: Spell Descriptions</a></li>
<li><a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells" rel="noreferrer noopener">D&amp;D Beyond Basic Rules (2014): Spells</a></li>
<li><a href="https://www.dndbeyond.com/posts/1753-2024-wizard-vs-2014-wizard-whats-new" rel="noreferrer noopener">D&amp;D Beyond: 2024 Wizard vs. 2014 Wizard</a></li>
</ul>
`.trim();

const dndSchoolsOfMagicLockedChineseHtml = String.raw`
<p>在 2024 修订版核心规则里，<code>dnd schools of magic</code> 指八类用来归类法术的 <strong>School of Magic</strong>：防护 <strong>Abjuration</strong>、咒法 <strong>Conjuration</strong>、预言 <strong>Divination</strong>、惑控 <strong>Enchantment</strong>、塑能 <strong>Evocation</strong>、幻术 <strong>Illusion</strong>、死灵 <strong>Necromancy</strong> 和变化 <strong>Transmutation</strong>。学派标签说明一个法术归入哪类魔法概念，但不会单独赋予角色能力、决定角色能否使用该法术，或代替具体法术条目。可以先从 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/spells" rel="noreferrer noopener">D&amp;D Beyond 的 2024 Basic Rules 法术说明</a>开始查阅。</p>
<p>本文以 2024 修订版为核心范围，只在需要解释差异时对照 2014。文中的中文名称是对照英文原名的工作标签，不是官方唯一译名；查阅时保留英文名、规则年份和具体法术条目。</p>
<figure style="margin:1.5rem 0;width:100%;">
  <img class="inline-figure__image inline-figure__image--wide" src="__SCHOOLS_EIGHT_GRID__" alt="八个同层级法术学派及其已核验的 2024 示例：防护 Abjuration 对应 Shield；咒法 Conjuration 对应 Misty Step；预言 Divination 对应 Detect Magic；惑控 Enchantment 对应 Charm Person；塑能 Evocation 对应 Fireball；幻术 Illusion 对应 Minor Illusion；死灵 Necromancy 对应 Animate Dead；变化 Transmutation 对应 Polymorph。" width="1536" height="960" loading="lazy" decoding="async" />
  <div role="list" aria-label="八个同层级法术学派及其已核验的 2024 示例：防护 Abjuration 对应 Shield；咒法 Conjuration 对应 Misty Step；预言 Divination 对应 Detect Magic；惑控 Enchantment 对应 Charm Person；塑能 Evocation 对应 Fireball；幻术 Illusion 对应 Minor Illusion；死灵 Necromancy 对应 Animate Dead；变化 Transmutation 对应 Polymorph。" style="display:flex;flex-wrap:wrap;gap:0.75rem;">
    <div role="listitem" style="box-sizing:border-box;flex:1 1 14rem;min-width:0;border:1px solid #111827;border-radius:0.5rem;padding:0.8rem 0.9rem;">
      <strong>防护 <span lang="en">Abjuration</span></strong><br><span>2024 核验示例：<code>Shield</code></span>
    </div>
    <div role="listitem" style="box-sizing:border-box;flex:1 1 14rem;min-width:0;border:1px solid #111827;border-radius:0.5rem;padding:0.8rem 0.9rem;">
      <strong>咒法 <span lang="en">Conjuration</span></strong><br><span>2024 核验示例：<code>Misty Step</code></span>
    </div>
    <div role="listitem" style="box-sizing:border-box;flex:1 1 14rem;min-width:0;border:1px solid #111827;border-radius:0.5rem;padding:0.8rem 0.9rem;">
      <strong>预言 <span lang="en">Divination</span></strong><br><span>2024 核验示例：<code>Detect Magic</code></span>
    </div>
    <div role="listitem" style="box-sizing:border-box;flex:1 1 14rem;min-width:0;border:1px solid #111827;border-radius:0.5rem;padding:0.8rem 0.9rem;">
      <strong>惑控 <span lang="en">Enchantment</span></strong><br><span>2024 核验示例：<code>Charm Person</code></span>
    </div>
    <div role="listitem" style="box-sizing:border-box;flex:1 1 14rem;min-width:0;border:1px solid #111827;border-radius:0.5rem;padding:0.8rem 0.9rem;">
      <strong>塑能 <span lang="en">Evocation</span></strong><br><span>2024 核验示例：<code>Fireball</code></span>
    </div>
    <div role="listitem" style="box-sizing:border-box;flex:1 1 14rem;min-width:0;border:1px solid #111827;border-radius:0.5rem;padding:0.8rem 0.9rem;">
      <strong>幻术 <span lang="en">Illusion</span></strong><br><span>2024 核验示例：<code>Minor Illusion</code></span>
    </div>
    <div role="listitem" style="box-sizing:border-box;flex:1 1 14rem;min-width:0;border:1px solid #111827;border-radius:0.5rem;padding:0.8rem 0.9rem;">
      <strong>死灵 <span lang="en">Necromancy</span></strong><br><span>2024 核验示例：<code>Animate Dead</code></span>
    </div>
    <div role="listitem" style="box-sizing:border-box;flex:1 1 14rem;min-width:0;border:1px solid #111827;border-radius:0.5rem;padding:0.8rem 0.9rem;">
      <strong>变化 <span lang="en">Transmutation</span></strong><br><span>2024 核验示例：<code>Polymorph</code></span>
    </div>
  </div>
  <figcaption>八个法术学派的中文工作标签、英文原名与核验示例对照。</figcaption>
</figure>
<p>这八类是并列分类，不是排名。</p>
<h2>dnd schools of magic 到底指什么？</h2>
<p>法术学派是写在法术条目里的分类标签。2024 规则把法术分成八类，并同时给出学派、环级和职业法术列表。标签提供第一层方向：保护、移动、取得信息、影响心智、魔法能量、误导感知、生命与死亡，或改变生物与物体。</p>
<p>这个方向不能代替完整规则。单看学派，得不出距离、目标、动作、豁免、持续时间、专注或全部限制；同一学派的法术也不会因此动作相同。裁定场景时读具体条目。</p>
<p>2014 <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spellcasting" rel="noreferrer noopener">Spellcasting 章节中的法术学派说明</a>同样把八类当作分类，并说明标签本身不是独立规则子系统。其他规则仍可能引用学派，所以准确说法是“标签提供有限分类信息”，不是“学派永远没有规则用途”。</p>
<h2>八个 D&amp;D 法术学派：中英文与示例对照</h2>
<p>下表是 2024 规则下的查阅地图，不是推荐清单或必须掌握的八项能力。示例来自已核对的 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions" rel="noreferrer noopener">2024 Spell Descriptions</a>。类别线索只是简述，判定时打开对应条目。</p>
<table>
<thead>
<tr><th>中文工作标签</th><th>English name</th><th>类别线索</th><th>已核验的 2024 示例</th></tr>
</thead>
<tbody>
<tr><td>防护</td><td>Abjuration</td><td>保护，或逆转伤害</td><td><a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#Shield" rel="noreferrer noopener">Shield</a></td></tr>
<tr><td>咒法</td><td>Conjuration</td><td>移动或传送生物、物体</td><td><a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#MistyStep" rel="noreferrer noopener">Misty Step</a></td></tr>
<tr><td>预言</td><td>Divination</td><td>获取信息</td><td><a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#DetectMagic" rel="noreferrer noopener">Detect Magic</a></td></tr>
<tr><td>惑控</td><td>Enchantment</td><td>影响心智</td><td><a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#CharmPerson" rel="noreferrer noopener">Charm Person</a></td></tr>
<tr><td>塑能</td><td>Evocation</td><td>通过魔法能量产生效果，常见于破坏性效果</td><td><a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#Fireball" rel="noreferrer noopener">Fireball</a></td></tr>
<tr><td>幻术</td><td>Illusion</td><td>误导感知或心智</td><td><a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#MinorIllusion" rel="noreferrer noopener">Minor Illusion</a></td></tr>
<tr><td>死灵</td><td>Necromancy</td><td>处理生命与死亡</td><td><a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#AnimateDead" rel="noreferrer noopener">Animate Dead</a></td></tr>
<tr><td>变化</td><td>Transmutation</td><td>改变生物或物体</td><td><a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#Polymorph" rel="noreferrer noopener">Polymorph</a></td></tr>
</tbody>
</table>
<h3>防护 Abjuration：先问它保护什么</h3>
<p>防护围绕保护或逆转伤害。<code>Shield</code> 是已核验的 2024 示例，可把“保护效果”当作 Abjuration 的线索。它不能说明保护给谁、何时触发，也不能把所有治疗都归入这一类；裁定时读目标、时机和效果。</p>
<h3>咒法 Conjuration：移动与传送是线索</h3>
<p>咒法关注生物或物体的移动、传送。<code>Misty Step</code> 的 2024 条目把施法者传到 30 英尺内可见且未被占用的空间。看到 Conjuration 不能推出每个咒法都同样传送或召唤；先查目标、范围和有效位置。</p>
<h3>预言 Divination：它试图取得什么信息</h3>
<p>预言的线索是取得信息。<code>Detect Magic</code> 属于这类，但不能把“预言”读成能识别所有魔法或所有法术。先问它要获取哪类信息，再核对该条目的感知对象、可见条件、动作和规则年份。后文会分开写出 2014 与 2024 的查验条件。</p>
<h3>惑控 Enchantment：影响心智不等于结果相同</h3>
<p>惑控归类影响心智的效果。<code>Charm Person</code> 是已核验的 2024 示例。学派不会告诉你目标如何行动，也不代表控制程度相同；目标、持续时间、豁免和受影响者知道什么，都要查具体法术。</p>
<h3>塑能 Evocation：魔法能量形成的效果</h3>
<p>塑能把通过魔法能量产生的效果归在一起，常带破坏性。<code>Fireball</code> 是已核验的 2024 示例。Evocation 不能推出范围、伤害、豁免或遮蔽影响。若桌上有人把学派当结算方式，把它当作打开条目的提醒。</p>
<h3>幻术 Illusion：误导感知或心智</h3>
<p>幻术处理误导感知或心智。<code>Minor Illusion</code> 可制造声音或物体影像，实体互动会揭示影像是幻觉。不能把所有幻术想成同一种影像或同一种破解方式；“幻术”也不是隐形、无声或无法识破的同义词。</p>
<h3>死灵 Necromancy：生命与死亡的分类</h3>
<p>死灵围绕生命与死亡。<code>Animate Dead</code> 说明类别对应，但不能据此归类所有生命效果，也不能单独确定亡灵如何被控制。涉及亡灵、生命能量或控制方式时，同时读对应法术和相关特性。</p>
<h3>变化 Transmutation：改变生物或物体</h3>
<p>变化关注改变生物或物体。<code>Polymorph</code> 把目标变成 Beast，并在条目中写明限制。Transmutation 只指向“改变了什么”；目标和限制要读 <code>Polymorph</code> 条目。</p>
<h2>分清三层信息：法术学派、职业法术列表、Wizard 子职</h2>
<p>这三个词常一起出现，但回答不同问题。法术学派回答“这个法术属于哪类”；职业法术列表回答“哪个职业列表包含它、还要满足什么访问条件”；Wizard 子职回答“这个法师分支提供什么特性”。不要用其中一层代替另外两层。</p>
<figure style="margin:1.5rem 0;width:100%;">
  <div role="list" aria-label="三个彼此分开的规则层次：法术学派 School of Magic 给法术分类；职业法术列表 Class Spell List 说明列表归属与可用来源；法师子职 Wizard subclass 提供子职特性。" style="display:flex;flex-wrap:wrap;gap:0.75rem;">
    <div role="listitem" style="box-sizing:border-box;flex:1 1 14rem;min-width:0;border:1px solid #111827;border-radius:0.5rem;padding:0.9rem;">
      <strong>法术学派 / <span lang="en">School of Magic</span></strong><br><span>给法术分类</span>
    </div>
    <div role="listitem" style="box-sizing:border-box;flex:1 1 14rem;min-width:0;border:1px solid #111827;border-radius:0.5rem;padding:0.9rem;">
      <strong>职业法术列表 / <span lang="en">Class Spell List</span></strong><br><span>说明列表归属与可用来源</span>
    </div>
    <div role="listitem" style="box-sizing:border-box;flex:1 1 14rem;min-width:0;border:1px solid #111827;border-radius:0.5rem;padding:0.9rem;">
      <strong>法师子职 / <span lang="en">Wizard subclass</span></strong><br><span>提供子职特性</span>
    </div>
  </div>
  <figcaption>法术分类、职业法术列表和法师子职不是同一层规则信息。</figcaption>
</figure>
<h3>法术学派只回答“它属于哪一类”</h3>
<p>学派写在法术条目上，提供分类和第一层概念。它不回答角色是否知道、是否准备、今天有没有法术位，也不自动满足职业特性条件。知道 <code>Misty Step</code> 是 Conjuration，或 <code>Fireball</code> 是 Evocation，都不等于角色已经能用它们。</p>
<h3>职业法术列表回答“它从哪里可用”</h3>
<p>2024 条目中的职业名称指向职业法术列表，这是访问信息，不是学派强弱表。法术属于 Divination，也不意味着任何角色都能施放。问角色能否施放时，先确认规则版本和允许资料，再看职业列表和会改变访问的特性。对照 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/spells" rel="noreferrer noopener">2024 Basic Rules 的法术章节</a>，学派字段和职业列表字段并列，却作用不同。</p>
<h3>Wizard 子职回答“这个职业分支提供什么特性”</h3>
<p>中文里的“法师学派”有时指 Wizard 子职，而不是法术条目上的 School of Magic。这里单独写成 <code>Wizard subclass</code>。<a href="https://www.dndbeyond.com/posts/1753-2024-wizard-vs-2014-wizard-whats-new" rel="noreferrer noopener">2024 Wizard 与 2014 Wizard 对照文章</a>讨论了 2024 Player’s Handbook 的子职层，并举出 Abjurer、Diviner、Evoker、Illusionist；子职等级变化也限定在该对照范围内。这不是“只有四个法术学派”，也不是八个必须选择的 Wizard 构筑。问特性读子职；问分类读 school line。</p>
<h2>用具体法术分辨相近的效果</h2>
<p>使用学派时，先让标签缩小问题，再让具体条目给出答案。日常说法里，几个法术都可能让场景“看起来不一样”，但规则处理并不相同。</p>
<p><code>Minor Illusion</code> 用声音或物体影像误导感知；<code>Misty Step</code> 把施法者传到 30 英尺内可见且未被占用的空间；<code>Polymorph</code> 把目标变成 Beast，并受该条目限制。它们分属 Illusion、Conjuration 和 Transmutation。</p>
<p>举一个范围受限的教学例子：守卫看到假箱子，角色传送过间隙，第三个生物改变形态。三个学派只负责把问题分成幻术、咒法和变化；互动结果、目的地是否合格、形态限制，必须打开对应的 <code>Minor Illusion</code>、<code>Misty Step</code> 和 <code>Polymorph</code> 条目。</p>
<p>颜色表、记忆口诀或自制关系图可以整理笔记，但不能替代规则原文。查阅笔记时，同时记录法术英文名和版次；不要只记录中文标签。</p>
<h2>版次差异：先核对年份，再判断标签</h2>
<p>同名法术在不同规则书里可能出现不同学派，不要先把其中一个页面判成错误。<code>Cure Wounds</code> 是已核验的对照：</p>
<table>
<thead>
<tr><th>规则条目</th><th>显示的学派</th><th>这项对照能说明什么</th></tr>
</thead>
<tbody>
<tr><td>2014 <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#CureWounds" rel="noreferrer noopener">Cure Wounds</a></td><td>Evocation</td><td>2014 核心条目使用这个学派标签。</td></tr>
<tr><td>2024 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#CureWounds" rel="noreferrer noopener">Cure Wounds</a></td><td>Abjuration</td><td>修订版核心条目使用了不同的学派标签。</td></tr>
</tbody>
</table>
<p>这是版次差异，不是“所有治疗都属于防护”，也不能只凭日常意义猜学派。笔记或网页不一致时，先写规则年份，再打开对应条目。</p>
<h3><code>Detect Magic</code> 的查验条件不能合并</h3>
<p><code>Detect Magic</code> 有桌面用途，也有边界。2024 条目：感知 30 英尺内的魔法效果；之后用 Magic action，可在带有魔法的可见生物或物体上看到光环；若该效果由法术创造，还能得知该法术的学派。需要专注，最长 10 分钟。屏障：1 英尺石头、泥土或木材，1 英寸金属，或一层薄铅板。</p>
<p>2014 条目同样是 30 英尺感知范围、对可见生物或物体使用一个动作、最长 10 分钟专注，但屏障不同：1 英尺石头、1 英寸普通金属、铅，或 3 英尺木材或泥土。条件和版次必须分开记录。现场核对时对照 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#DetectMagic" rel="noreferrer noopener">2024 条目</a>和 <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#DetectMagic" rel="noreferrer noopener">2014 条目</a>。</p>
<p>两套规则都不能把“读到学派”变成“直接知道具体法术名称”。在条目条件下，你可能得知法术创造的效果属于哪个学派；这不等于完整法术说明，也不代表非法术魔法效果会显示法术名，更不会取消可见目标和动作要求。</p>
<figure style="margin:1.5rem 0;width:100%;">
  <div role="group" aria-label="版次对照：2014 年 Cure Wounds 属于 Evocation，Detect Magic 具有下列 30 英尺、可见目标、动作、专注、持续时间和屏障条件；2024 修订版 Cure Wounds 属于 Abjuration，Detect Magic 分别具有下列 30 英尺、可见目标、Magic action、法术创建效果、专注、持续时间和屏障条件。" style="display:flex;flex-wrap:wrap;gap:0.75rem;">
    <section aria-label="2014 规则" style="box-sizing:border-box;flex:1 1 23rem;min-width:0;border:1px solid #111827;border-radius:0.5rem;padding:0.9rem;overflow-wrap:anywhere;">
      <h3 style="margin-top:0;">2014</h3>
      <p><strong><code>Cure Wounds</code></strong><br>学派：<code>Evocation</code></p>
      <p><strong><code>Detect Magic</code></strong></p>
      <ul>
        <li>感知 30 英尺内的魔法。</li>
        <li>使用一个动作，可在可见生物或物体上看到光环及其学派（如果有）。</li>
        <li>需要专注，最长 10 分钟。</li>
        <li>会被 1 英尺石头、1 英寸普通金属、一层薄铅板，或 3 英尺木材或泥土阻挡。</li>
      </ul>
    </section>
    <section aria-label="2024 修订版规则" style="box-sizing:border-box;flex:1 1 23rem;min-width:0;border:1px solid #111827;border-radius:0.5rem;padding:0.9rem;overflow-wrap:anywhere;">
      <h3 style="margin-top:0;">2024 修订版</h3>
      <p><strong><code>Cure Wounds</code></strong><br>学派：<code>Abjuration</code></p>
      <p><strong><code>Detect Magic</code></strong></p>
      <ul>
        <li>感知 30 英尺内的魔法效果。</li>
        <li>使用 Magic action，可在带有魔法的可见生物或物体上看到光环；如果该效果由法术创造，还能得知该法术的学派。</li>
        <li>需要专注，最长 10 分钟。</li>
        <li>会被 1 英尺石头、泥土或木材，1 英寸金属，或一层薄铅板阻挡。</li>
      </ul>
    </section>
  </div>
  <figcaption>同名法术的学派标签与查验条件必须按规则版本核对。</figcaption>
</figure>
<h2>一套可以重复使用的学派核对顺序</h2>
<p>遇到法术学派问题时，按下面顺序查：</p>
<ol>
<li><strong>先确定规则年份和来源。</strong> 在条目旁写清“2014”或“2024 修订版”，再比较学派名称。</li>
<li><strong>读 school line。</strong> 用八类表格识别大致类别，不从标签发明法术效果。</li>
<li><strong>说清楚你真正要回答的问题。</strong> 分类、角色能否使用、子职特性和具体法术行为是四种不同问题。</li>
<li><strong>打开完整法术条目。</strong> 核对目标、范围、动作、豁免、持续时间、专注以及会影响场景的特殊条件。</li>
<li><strong>单独核对访问条件。</strong> 如果问题是角色能否施放，就查职业法术列表和相关特性，不要用学派标签代替。</li>
<li><strong>在证据边界处停下。</strong> 来源只给出学派、没有说明具体互动时，保留已知结论，继续找负责该互动的规则。</li>
</ol>
<p>这样使用 <strong>dnd schools of magic</strong>，八个名称是查阅入口，不是八种职业能力。分类看学派；能否使用看职业列表和特性；这一回合发生什么，回到对应版次的具体法术条目。</p>
<h2>来源</h2>
<ul>
<li><a href="https://www.dndbeyond.com/sources/dnd/br-2024/spells" rel="noreferrer noopener">D&amp;D Beyond Basic Rules: Spells</a></li>
<li><a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spellcasting" rel="noreferrer noopener">D&amp;D Beyond Basic Rules (2014): Spellcasting</a></li>
<li><a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions" rel="noreferrer noopener">D&amp;D Beyond Basic Rules: Spell Descriptions</a></li>
<li><a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells" rel="noreferrer noopener">D&amp;D Beyond Basic Rules (2014): Spells</a></li>
<li><a href="https://www.dndbeyond.com/posts/1753-2024-wizard-vs-2014-wizard-whats-new" rel="noreferrer noopener">D&amp;D Beyond: 2024 Wizard vs. 2014 Wizard</a></li>
</ul>
`.trim();

export const dndSchoolsOfMagicArticleHtml = bindSchoolsOfMagicArticleHtml(
  'en-US',
  dndSchoolsOfMagicLockedEnglishHtml,
  DND_SCHOOLS_OF_MAGIC_EIGHT_SCHOOLS_IMAGE_PATH,
);

export const dndSchoolsOfMagicArticleHtmlZh = bindSchoolsOfMagicArticleHtml(
  'zh-CN',
  dndSchoolsOfMagicLockedChineseHtml,
  DND_SCHOOLS_OF_MAGIC_EIGHT_SCHOOLS_ZH_IMAGE_PATH,
);
