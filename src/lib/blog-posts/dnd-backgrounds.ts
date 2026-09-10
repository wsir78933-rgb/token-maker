const LOCKED_CHINESE_PAGE_H1 = 'DND 5E 背景：先分清你在找什么，再按年份抄进角色卡';

type MarkdownLineKind = 'empty' | 'h1' | 'h2' | 'h3' | 'table' | 'ol' | 'ul' | 'paragraph';

function throwUnexpectedMarkdown(kind: string, value: string): never {
  const preview = value.length > 240 ? `${value.slice(0, 240)}…` : value;
  throw new Error(`Unexpected ${kind} in dnd-backgrounds lock markdown: ${preview}`);
}

function escapeHtmlText(plainText: string): string {
  return plainText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function convertBoldMarkdown(escapedText: string): string {
  const textWithoutBoldPairs = escapedText.replace(/\*\*(.+?)\*\*/g, '');
  if (textWithoutBoldPairs.includes('**')) {
    throwUnexpectedMarkdown('unmatched bold markers', escapedText);
  }

  return escapedText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

function convertInlineMarkdown(markdownText: string): string {
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let convertedMarkup = '';
  let lastIndex = 0;
  let linkMatch = linkPattern.exec(markdownText);

  while (linkMatch) {
    convertedMarkup += convertBoldMarkdown(escapeHtmlText(markdownText.slice(lastIndex, linkMatch.index)));

    const linkLabel = linkMatch[1];
    const linkHref = linkMatch[2];

    if (!linkLabel) {
      throwUnexpectedMarkdown('markdown link with empty label', linkMatch[0]);
    }

    if (!linkHref) {
      throwUnexpectedMarkdown('markdown link with empty href', linkMatch[0]);
    }

    if (!/^https?:\/\//.test(linkHref)) {
      throwUnexpectedMarkdown(`non-http markdown href ${linkHref}`, linkMatch[0]);
    }

    convertedMarkup += `<a href="${escapeHtmlText(linkHref)}" rel="noreferrer noopener">${convertBoldMarkdown(escapeHtmlText(linkLabel))}</a>`;
    lastIndex = linkMatch.index + linkMatch[0].length;
    linkMatch = linkPattern.exec(markdownText);
  }

  convertedMarkup += convertBoldMarkdown(escapeHtmlText(markdownText.slice(lastIndex)));
  return convertedMarkup;
}

function splitMarkdownTableRow(line: string): string[] {
  if (!line.startsWith('|')) {
    throwUnexpectedMarkdown('table row that does not start with |', line);
  }

  const rowWithoutEdges = line.endsWith('|') ? line.slice(1, -1) : line.slice(1);
  return rowWithoutEdges.split('|').map((cell) => cell.trim());
}

function isMarkdownTableSeparatorRow(line: string): boolean {
  const cells = splitMarkdownTableRow(line);
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function convertMarkdownTable(tableLines: string[]): string {
  if (tableLines.length < 2) {
    throwUnexpectedMarkdown('table with fewer than 2 lines', tableLines.join('\n'));
  }

  const headerLine = tableLines[0];
  const separatorLine = tableLines[1];

  if (headerLine === undefined || separatorLine === undefined) {
    throwUnexpectedMarkdown('table missing header or separator', tableLines.join('\n'));
  }

  const headerCells = splitMarkdownTableRow(headerLine);

  if (!isMarkdownTableSeparatorRow(separatorLine)) {
    throwUnexpectedMarkdown('table missing separator row', separatorLine);
  }

  const separatorCells = splitMarkdownTableRow(separatorLine);
  if (separatorCells.length !== headerCells.length) {
    throwUnexpectedMarkdown(
      `table separator column count ${separatorCells.length} != header ${headerCells.length}`,
      separatorLine,
    );
  }

  const bodyLines = tableLines.slice(2);
  if (bodyLines.length === 0) {
    throwUnexpectedMarkdown('table with no body rows', tableLines.join('\n'));
  }

  const headerHtml = headerCells
    .map((cell) => `<th scope="col">${convertInlineMarkdown(cell)}</th>`)
    .join('');
  const bodyHtml = bodyLines
    .map((line) => {
      const cells = splitMarkdownTableRow(line);
      if (cells.length !== headerCells.length) {
        throwUnexpectedMarkdown(
          `table body column count ${cells.length} != header ${headerCells.length}`,
          line,
        );
      }

      return `<tr>${cells.map((cell) => `<td>${convertInlineMarkdown(cell)}</td>`).join('')}</tr>`;
    })
    .join('');

  return `<div class="article-table-wrap"><table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`;
}

function convertMarkdownList(listLines: string[], listTag: 'ol' | 'ul'): string {
  const items = listLines.map((line) => {
    const itemText = listTag === 'ol' ? line.replace(/^\d+\.\s+/, '') : line.replace(/^-\s+/, '');
    if (itemText === line) {
      throwUnexpectedMarkdown(`${listTag} line without marker`, line);
    }

    return `<li>${convertInlineMarkdown(itemText)}</li>`;
  });

  return `<${listTag}>${items.join('')}</${listTag}>`;
}

function convertMarkdownHeading(line: string, level: 2 | 3): string {
  const prefix = level === 2 ? '## ' : '### ';
  if (!line.startsWith(prefix)) {
    throwUnexpectedMarkdown(`h${level} without prefix`, line);
  }

  const headingText = line.slice(prefix.length).trim();
  if (!headingText) {
    throwUnexpectedMarkdown(`empty h${level}`, line);
  }

  return `<h${level}>${convertInlineMarkdown(headingText)}</h${level}>`;
}

function classifyMarkdownLine(line: string): MarkdownLineKind {
  if (line === '') {
    return 'empty';
  }

  if (line.startsWith('### ')) {
    return 'h3';
  }

  if (line.startsWith('## ')) {
    return 'h2';
  }

  if (line.startsWith('# ')) {
    return 'h1';
  }

  if (line.startsWith('|')) {
    return 'table';
  }

  if (/^\d+\.\s+\S/.test(line)) {
    return 'ol';
  }

  if (/^-\s+\S/.test(line)) {
    return 'ul';
  }

  if (line.startsWith('```') || line.startsWith('![') || line.startsWith('> ')) {
    throwUnexpectedMarkdown('unsupported markdown construct', line);
  }

  return 'paragraph';
}

function convertMarkdownBlock(kind: MarkdownLineKind, lines: string[]): string {
  switch (kind) {
    case 'h2':
      if (lines.length !== 1 || lines[0] === undefined) {
        throwUnexpectedMarkdown('h2 block must be exactly one line', lines.join('\n'));
      }
      return convertMarkdownHeading(lines[0], 2);
    case 'h3':
      if (lines.length !== 1 || lines[0] === undefined) {
        throwUnexpectedMarkdown('h3 block must be exactly one line', lines.join('\n'));
      }
      return convertMarkdownHeading(lines[0], 3);
    case 'table':
      return convertMarkdownTable(lines);
    case 'ol':
      return convertMarkdownList(lines, 'ol');
    case 'ul':
      return convertMarkdownList(lines, 'ul');
    case 'paragraph':
      return `<p>${convertInlineMarkdown(lines.join(' '))}</p>`;
    case 'empty':
      return '';
    case 'h1':
      throwUnexpectedMarkdown('h1 leaked into body conversion', lines.join('\n'));
  }
}

function dropLockedChineseLeadingH1(markdown: string): string {
  const lines = markdown.split('\n');
  const firstNonEmptyIndex = lines.findIndex((line) => line.trim() !== '');

  if (firstNonEmptyIndex === -1) {
    throwUnexpectedMarkdown('empty Chinese lock markdown', markdown);
  }

  const firstNonEmptyLine = lines[firstNonEmptyIndex];
  const expectedHeadingLine = `# ${LOCKED_CHINESE_PAGE_H1}`;

  if (firstNonEmptyLine !== expectedHeadingLine) {
    throwUnexpectedMarkdown(
      `Chinese lock H1 was ${firstNonEmptyLine ?? '<missing>'}, expected ${expectedHeadingLine}`,
      firstNonEmptyLine ?? markdown,
    );
  }

  return [...lines.slice(0, firstNonEmptyIndex), ...lines.slice(firstNonEmptyIndex + 1)].join('\n');
}

function assertBodyHtmlHasNoPageH1(bodyHtml: string, localeLabel: string): void {
  const h1Match = bodyHtml.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/i);

  if (h1Match) {
    throw new Error(`${localeLabel} dnd-backgrounds bodyHtml still contains a page H1: ${h1Match[0]}`);
  }
}

function convertLockedMarkdownToBodyHtml(
  markdown: string,
  options: { readonly dropLeadingH1: boolean; readonly localeLabel: string },
): string {
  if (markdown.includes('\uFEFF')) {
    throw new Error(`${options.localeLabel} dnd-backgrounds lock markdown contains a BOM`);
  }

  if (markdown.includes('\r')) {
    throw new Error(`${options.localeLabel} dnd-backgrounds lock markdown contains CR`);
  }

  const readerMarkdown = options.dropLeadingH1 ? dropLockedChineseLeadingH1(markdown) : markdown;
  const htmlParts: string[] = [];
  let blockKind: MarkdownLineKind | null = null;
  let blockLines: string[] = [];

  const flushCurrentBlock = () => {
    if (blockKind === null || blockKind === 'empty') {
      blockLines = [];
      blockKind = null;
      return;
    }

    htmlParts.push(convertMarkdownBlock(blockKind, blockLines));
    blockLines = [];
    blockKind = null;
  };

  for (const line of readerMarkdown.split('\n')) {
    const lineKind = classifyMarkdownLine(line);

    if (lineKind === 'empty') {
      flushCurrentBlock();
      continue;
    }

    if (lineKind === 'h1') {
      throwUnexpectedMarkdown(`${options.localeLabel} body H1`, line);
    }

    const canJoinCurrentBlock =
      lineKind === 'table' || lineKind === 'ol' || lineKind === 'ul' || lineKind === 'paragraph';

    if (blockKind === lineKind && canJoinCurrentBlock) {
      blockLines.push(line);
      continue;
    }

    flushCurrentBlock();

    if (lineKind === 'h2' || lineKind === 'h3') {
      htmlParts.push(convertMarkdownBlock(lineKind, [line]));
      continue;
    }

    blockKind = lineKind;
    blockLines = [line];
  }

  flushCurrentBlock();

  const bodyHtml = htmlParts.filter(Boolean).join('\n');
  if (!bodyHtml) {
    throw new Error(`${options.localeLabel} dnd-backgrounds converted bodyHtml is empty`);
  }

  assertBodyHtmlHasNoPageH1(bodyHtml, options.localeLabel);
  return `${bodyHtml}\n`;
}

const LOCKED_ENGLISH_BODY_MARKDOWN = String.raw`Choose a D&D background by first asking your Dungeon Master whether the campaign uses the 2014 rules or the 2024 revision. For a 2014 character, check the background's proficiencies, languages where offered, equipment, and named feature; for a 2024 character, check its ability-score options, Origin feat, skills, tool, and equipment. This guide covers tabletop D&D fifth edition: use the matching rules below, and follow the older-book conversion branch if your 2024 table permits an earlier background. [2014 background rules](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/personality-and-background), [2024 background rules](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins), [older-book conversion](https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character).

Have your character sheet, the allowed books, and one sentence about your character's previous occupation beside you. You can make a useful choice with a rough concept. The immediate goal is to finish the background fields with benefits you understand and a past you want to play.

## Match the background entry to your table's rules

When browsing DnD 5e backgrounds, record both the name and its source. The official catalog contains separate Acolyte entries: one lists Magic Initiate (Cleric) under Player's Handbook, while the Legacy entry identifies Basic Rules (2014) and Shelter of the Faithful. Those labels distinguish different rules packages attached to the same name. [D&D Beyond background catalog](https://www.dndbeyond.com/backgrounds).

D&D Beyond's March 2026 naming note calls the updated 2024 rules “5.5e” and the 2014 content “5e.” Here, the years identify which instructions to follow. If someone at your table says “fifth edition,” ask which year they mean before entering ability increases or a feat. [Official explanation of the edition labels](https://www.dndbeyond.com/posts/1785-the-backgrounds-and-origin-feats-in-the-2024).

Write a short source note such as “Sage, 2024 Basic Rules” beside your selection. If your group permits older material, mark that separately: “Soldier, 2014 Basic Rules, with the 2024 conversion.” This gives the DM something specific to check when a field differs from another player's sheet.

If you cannot identify the source, keep the choice provisional. Open the entry from the official catalog or ask the DM to identify the allowed book. A background name alone cannot settle which skills or feature to copy: Criminal gives Deception and Stealth in the 2014 Basic Rules, whereas the 2024 entry gives Sleight of Hand and Stealth. [2014 Criminal](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/personality-and-background), [2024 Criminal](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins).

## Decide what the background says about your character

A background describes the experiences that shaped your character before adventuring. The 2014 rules connect it to your origins and place in the world; the 2024 rules emphasize a formative occupation and place. Both give you a way to connect a character's past to concrete benefits on the sheet. [2014 background definition](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/personality-and-background), [2024 background definition](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins).

Your class and background answer different questions. Acolyte, for example, describes religious service without requiring the Cleric class in the 2014 entry. The 2024 rules likewise describe background and species as parts of an origin alongside the capabilities learned through a class. Start with an occupation or experience you want to explain, then check its mechanical package. [2014 Acolyte](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/personality-and-background), [2024 origin components](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins).

For example, you might propose a Fighter who cataloged a ruined observatory's records before taking up arms. That is an invented character concept, not a special background or a rules exception. It gives you a reason to inspect Sage. You still need to accept that entry's benefits or discuss a permitted alternative with the DM.

## Copy the fields for one rules version

Use the table as a checklist while the actual background entry is open. The 2014 column describes the Basic Rules framework; read any later supplement's additional benefits in its own entry. The 2024 column describes the standard backgrounds in the updated rules. [2014 framework](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/personality-and-background), [2024 framework](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins).

| Field to check | 2014 Basic Rules | 2024 Basic Rules |
| --- | --- | --- |
| Skills | Two skill proficiencies. [2014 rules](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/personality-and-background). | Two specified skill proficiencies. [2024 rules](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins). |
| Tools | Most backgrounds grant proficiency with one or more tools; inspect the entry. [2014 rules](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/personality-and-background). | One tool proficiency, with the permitted choice stated in the entry. [2024 rules](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins). |
| Languages | Some backgrounds add languages; the entry states which choices you receive. [2014 rules](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/personality-and-background). | Languages are not one of the five standard background fields; when copying a 2024 entry, do not mix a 2014 language allowance into those five fields. Conversion keeps languages already written on the older entry unless the DM rules otherwise. [2024 background fields](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins). |
| Feature or feat | Record the named background feature and its conditions. [2014 examples](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/personality-and-background). | Record the specified Origin feat, then resolve any choices within it. [2024 backgrounds](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins), [feat descriptions](https://www.dndbeyond.com/sources/dnd/br-2024/feats). |
| Ability increases | These background entries do not supply the 2024 background increases. [2014 entries](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/personality-and-background). | From the three listed abilities, increase one by two and another by one, or all three by one; none can exceed 20 through these increases. [2024 rules](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins). |
| Equipment | Take the background package unless using the optional starting-coin rule. [2014 equipment rule](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/personality-and-background). | Choose the listed package or 50 GP. [2024 equipment rule](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins). |

### Check a 2014 feature's conditions

The name of a feature is a reminder to read its effect. Acolyte's Shelter of the Faithful includes healing and care for you and your companions at an established place of your faith, with necessary spell components supplied by you. Its modest-lifestyle support applies to you alone. Assistance from your associated temple also has limits: you must remain in good standing, and the requested help cannot be hazardous. [2014 Shelter of the Faithful](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/personality-and-background).

For a campaign that rarely visits settlements, ask the DM how your former temple might appear in the story. You are checking whether the connection interests you and fits the campaign. Do not summarize the feature on your sheet as unlimited free healing or guaranteed aid from every priest; those promises exceed its stated conditions. [2014 Acolyte feature](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/personality-and-background).

Check overlapping proficiencies too. Under the 2014 background rules, receiving the same proficiency from two sources lets you choose another of the same kind: a skill replaces a skill, and a tool replaces a tool. Write down the replacement so the sheet does not leave the second grant unresolved. [2014 proficiency overlap rule](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/personality-and-background).

### Check a 2024 background's remaining choices

The listed abilities are your allowed options, not three automatic increases of your preferred size. Standard Sage offers Constitution, Intelligence, and Wisdom. You can apply its two-point increase to Intelligence and its one-point increase to Constitution, for example; that entry does not offer Strength as an alternative. [2024 Sage and ability rules](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins).

An Origin feat can contain further decisions. Magic Initiate requires two cantrips and a first-level spell from its chosen spell list, plus a choice of Intelligence, Wisdom, or Charisma as the spellcasting ability for those spells. Acolyte specifies the Cleric list; Sage specifies Wizard. Record those selections rather than treating the feat name as the last step. [Magic Initiate rules](https://www.dndbeyond.com/sources/dnd/br-2024/feats), [Acolyte and Sage assignments](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins).

Separate training from possessions. If you choose the 50 GP option, record your tool proficiency but do not also copy the equipment package. Buying a physical tool and receiving proficiency with it are separate entries on the sheet; the background gives the proficiency regardless of which equipment option you select. [2024 proficiency and equipment fields](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins).

## Narrow your choices by experience and useful benefits

Begin with two or three candidates whose pasts you can imagine playing. For each, check the desired skills, the feature or feat you would use, and the books your DM allows. At a 2024 table, add the ability-score options to that comparison. This is a suggested selection method based on the background fields, not an official ranking. [2014 background components](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/personality-and-background), [2024 background components](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins).

### Compare four backgrounds with free rules text

The following options have complete entries in the 2024 Basic Rules. This comparison shows their abilities, feat, skills, and tool training. Each also offers an equipment package or 50 GP; open its entry to compare the actual items before choosing. [2024 background descriptions](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins).

| Background | Abilities eligible for increases | Origin feat | Skills | Tool proficiency |
| --- | --- | --- | --- | --- |
| Acolyte | Intelligence, Wisdom, Charisma | Magic Initiate (Cleric) | Insight, Religion | Calligrapher's Supplies. [Acolyte entry](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins). |
| Criminal | Dexterity, Constitution, Intelligence | Alert | Sleight of Hand, Stealth | Thieves' Tools. [Criminal entry](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins). |
| Sage | Constitution, Intelligence, Wisdom | Magic Initiate (Wizard) | Arcana, History | Calligrapher's Supplies. [Sage entry](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins). |
| Soldier | Strength, Dexterity, Constitution | Savage Attacker | Athletics, Intimidation | One kind of Gaming Set. [Soldier entry](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins). |

Read the feat when deciding whether its benefit fits your intended play. Alert adds your Proficiency Bonus to Initiative and allows an Initiative swap with a willing ally in that combat immediately after your roll, provided neither of you is Incapacitated. Savage Attacker lets you roll the weapon's damage dice twice and select either result when you hit, once per turn. Those are different benefits to compare against your priorities. [2024 Alert and Savage Attacker](https://www.dndbeyond.com/sources/dnd/br-2024/feats).

Suppose, as an invented selection example, your priority is Stealth training and help with Initiative. Criminal meets both conditions through its listed skills and Alert. Soldier instead offers Athletics, Intimidation, and Savage Attacker. If the former soldier story matters more to you, decide whether you can accept Soldier's package or need to discuss another allowed background with the DM. Do not silently exchange the feats between the two entries. [2024 Criminal and Soldier](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins), [2024 Origin feats](https://www.dndbeyond.com/sources/dnd/br-2024/feats).

### Work through a choice before completing the sheet

Consider another invented example: Mara, the observatory record keeper, is being created with the 2024 rules. Her DM permits the Basic Rules backgrounds, and the player wants Arcana and History. Sage supplies those skills, along with Magic Initiate (Wizard) and Calligrapher's Supplies proficiency. [2024 Sage](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins).

Assume Mara's scores before background increases include Intelligence 15, Constitution 14, and Wisdom 13. Applying two points to Intelligence and one to Constitution produces 17, 15, and 13 respectively. Alternatively, increasing all three by one produces 16, 15, and 14. Both distributions use Sage's listed abilities and remain below the cap; the player can compare the two outcomes before committing. These are illustrative calculations, not results from a character-builder test. [2024 ability-increase rule](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins).

If the player chooses the 50 GP equipment option, that amount goes into the inventory record instead of Sage's package. The character still has Calligrapher's Supplies proficiency, but the cash choice does not also award the supplies listed in the package. The player must then finish Magic Initiate's spell choices and spellcasting ability before calling the background complete. [Sage equipment options](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins), [Magic Initiate choices](https://www.dndbeyond.com/sources/dnd/br-2024/feats).

If the desired outcome was a Strength increase, this particular selection fails that requirement. Return to the shortlist or ask about a permitted custom option. Changing Mara's biography cannot by itself add Strength to Sage's ability list: the 2024 rules allow narrative details to change while separately specifying the mechanical fields. [2024 narrative and ability rules](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins).

### Understand what the free list leaves out

The 2024 Basic Rules give four background descriptions: Acolyte, Criminal, Sage, and Soldier. The 2024 Player's Handbook contains sixteen backgrounds, as identified in the official overview. The short free list therefore does not show every option from that book. [Free background descriptions](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins), [official Player's Handbook overview](https://www.dndbeyond.com/posts/1785-the-backgrounds-and-origin-feats-in-the-2024).

For an option such as Artisan or Charlatan, use the official catalog to locate its source, then open the book's entry to check the complete package. The catalog shows Crafter with Artisan and Skilled with Charlatan, but a compact listing should not substitute for the full equipment and ability choices. Confirm that the DM permits the source before building around it. [Official background catalog](https://www.dndbeyond.com/backgrounds).

If you do not have access to the entry, ask the DM to review it with you or choose from material you can both read. Leave unconfirmed fields blank while deciding. Filling them with numbers from a different background would conceal the information you still need.

## Convert an older background for a 2024 character

Use this branch when the campaign uses the 2024 rules and your DM allows a background from an older book. Open the original entry alongside the 2024 character-creation sidebar. Keep the old entry identifiable throughout the process; conversion is not an instruction to replace it with a newer background that happens to share its name. [Backgrounds and Species from Older Books](https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character).

1. **Supply the missing background increases.** For an older background without ability adjustments, increase one score by two and another by one, or increase three scores by one. The sidebar does not restrict this allocation to a newer namesake's three abilities. [Older-background ability adjustments](https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character).
2. **Check the resulting scores.** None of these increases can push a score above 20. If your proposed allocation does, revise the allocation before recording it. [Conversion score limit](https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character).
3. **Remove older species increases.** When using a species from an older book, ignore its ability-score increases and use the background increases. Do not add both sets. [Older-species conversion](https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character).
4. **Check whether the background already provides a feat.** If it does not, choose an Origin feat. If it already grants a feat, the sidebar's missing-feat condition does not grant an additional one. Check the feat's category and any applicable requirements in its description. [Missing-feat rule](https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character), [feat categories and requirements](https://www.dndbeyond.com/sources/dnd/br-2024/feats).

Here is a conversion example, not a tested build: you select the 2014 Soldier, whose entry supplies Military Rank rather than a feat, and use an older species entry with ability increases. Assume the pre-increase Strength and Constitution scores are 15 and 14. Apply two points to Strength and one to Constitution, producing 17 and 15; ignore the older species increases and select an Origin feat because this background lacks one. The choice of Soldier's newer Savage Attacker is not automatic in this branch. [2014 Soldier](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/personality-and-background), [2024 conversion sidebar](https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character), [2024 Soldier](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins).

If the starting figures on your sheet already include the old species increases, return to the recorded scores before those increases before doing the example's arithmetic. Otherwise, adding the background adjustment to the existing total would preserve bonuses the conversion says to ignore. If you no longer know the original scores, resolve that with the DM rather than guessing which points to subtract. [Instruction to ignore older species increases](https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character).

## Give a 2014 character traits you can act on

The 2014 backgrounds offer personality traits, ideals, bonds, and flaws as roleplaying prompts. You can select from the suggestions, roll for them, or invent your own. The customization instructions call for two traits, one ideal, one bond, and one flaw. These prompts help describe your character; they do not replace the background's proficiencies or named feature. [2014 suggested characteristics and customization](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/personality-and-background).

For an original example, consider a former courier named Nell. Her first trait is that she repeats instructions aloud before leaving. Her second is that she keeps a careful count of everyone traveling with her. Her ideal is that an important message should reach its recipient. Her bond is a retired dispatcher who once vouched for her. Her flaw is refusing to delegate deliveries even when she is exhausted. These are invented writing prompts, with no mechanical benefits attached.

Put the prompts into a decision: Nell receives two urgent letters but can personally deliver only one before nightfall. Her ideal and flaw now pull against each other. That gives you something to play without requiring the DM to introduce a whole new faction or resolve a long biography at the first session.

For a 2024 character, you can still write personality details you find useful. Keep them separate from the five standard background fields, which are abilities, feat, skills, tool, and equipment. A vivid flaw does not complete an unchosen Origin feat or change an equipment allowance. [2024 background components](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins).

## Use the right route for a custom background

In the 2014 Basic Rules, customization lets you replace a background feature, select any two skills, and choose a total of two tool proficiencies or languages from the sample backgrounds. That last allowance is a combined total: two tools, two languages, or one of each. It is not two tools plus two languages. If an appropriate feature does not exist, create it with the DM. [2014 customization rules](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/personality-and-background).

For example, a proposed harbor interpreter might use Insight and Investigation, then spend the combined allowance on two languages. That uses both language-or-tool choices; no tool proficiency remains in that allowance. This is an invented customization sketch. It is still incomplete until you select an existing feature or agree on a new one with the DM, settle equipment, and choose the personality prompts. [2014 customization procedure](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/personality-and-background).

Handle the equipment decision as part of the same process. Under the 2014 customization instructions, you can use the background equipment package or the optional coin method. If you use the coin method, you cannot also take the suggested class equipment package. Check that decision before adding gear from both lists. [2014 customization equipment limits](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/personality-and-background).

For a custom 2024 background, bring the desired combination to your DM and have them check the current Dungeon Master's rules. The permission to alter a published background's narrative does not itself specify a method for changing its abilities, skills, tool, or assigned Origin feat. Treat a mechanical change as something to settle explicitly before entering it on the sheet. [2024 background narratives and mechanical fields](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins).

A useful proposal names the experience and the exact obstacle: “I want this character to be a harbor interpreter, but the published package I chose lacks the training I want.” Bring the desired skills and the source you were considering. The DM can then approve a specific combination, suggest a published option, or explain the campaign's limits. If the proposed combination is declined, return to an allowed entry and revise the concept around its actual benefits.

Before play, read the source note and the background fields together. Confirm the edition, any approved conversion or customization, the recorded proficiencies, the equipment choice, and the resolved feature or feat. A blank choice means there is still a decision to make; a field that cannot be traced to the entry or an explicit ruling needs clarification.

## After the sheet is ready, make an optional character token

If you have a portrait and need a map marker, open [Token Maker](https://www.tokenmaker.one/). Its editor provides an image input, Scale, border controls, Add Text, PNG size options, and Download PNG. In the empty editor, Add Text and Download PNG are disabled. Choose a crop that preserves the character's face and, if useful, one occupational detail such as Nell's courier satchel. The satchel is a design suggestion, not a rules benefit.

For a square crop, the [Square Token Maker guide](https://www.tokenmaker.one/templates/square-token-maker) describes a 1:1 workflow and recommends 512 or 1024 pixels. Those sizes are the site's suggestions, not platform requirements. This is a tool entry point; no upload, export, or VTT import test is claimed here. Keep the background's rules and source on the character sheet when preparing the portrait.

`;

const LOCKED_CHINESE_BODY_MARKDOWN = String.raw`# DND 5E 背景：先分清你在找什么，再按年份抄进角色卡

「DND 5E 背景」三个字，在简体检索里会同时指向角色卡上的规则栏、一段身世故事，以及桌面壁纸或战斗地图底图。角色卡要填的是第一项：按本桌规则年份抄进去的技能、工具、特性或起源专长。先向城主确认这桌用 2014 基础规则还是 2024 基础规则，再只按那一年把组件写进卡里，并准备一句能在开团时推动剧情的「过去为什么结束」。本文服务桌面《龙与地下城》第五版这两套已公开核验的基础规则，不服务《博德之门 3》背景栏，也不把随机身世生成器或壁纸下载当成已经选好背景。

## 先切开三种「背景」：规则栏、身世故事、壁纸

规则栏里的背景，写的是：冒险开始前，哪段地点或旧职最能塑造这个人；卡面上再换成熟练和特性。2014 基础规则把它写成「你从哪来、如何成为冒险者、在世界上的位置」；2024 基础规则把它写成起源的一半，另一半是物种。两种说法都落在角色卡的同一块区域，只是字段不一样。

身世故事是叙事。你可以写性格、秘密、仇人、欠谁人情，也可以用生成器先挤出一段草稿。这些文字能帮你开口扮演，但它们不会自动给你洞悉、隐匿或一项起源专长。把生成器输出抄进「背景」栏，卡还是空的。

壁纸、战斗地图「背景」、棋子图标是图像。它们解决的是桌面看起来像什么，不解决角色卡抄哪一行。网上搜「DND 背景」时图片结果经常把这三类混在一起，填卡时要先把自己要做的那一件事说清楚：我是在选规则组件，还是在写故事，还是在找一张图。

还有一种常见串栏：把「法师就该像书斋学者」「战士就该像行伍老兵」当成已经填好了背景。职业决定你怎么打；背景决定你以前靠什么吃饭、认识谁、为什么不干了。牧师职业的人可以不是神殿侍僧，侍僧也不自动变成牧师。选完职业，背景这一栏仍要单独填。

## 开口问城主：这桌是 2014 还是 2024

中文桌口头标签很杂。有人说 5e，有人说 5.5e、5R、2024 版，灰机一类简体资料站还会把 2014 标成 DND5E、把 2024 标成 DND5.5E。这些都是社区或平台标签，不是另一套游戏的官方中文名。开团前只问一句能落地的话：这桌背景栏按 2014 基础规则抄，还是按 2024 基础规则抄。

D&D Beyond 在 2026 年 3 月 2 日的编辑说明里写过：平台上 2024 更新规则现在标成 5.5e，2014 内容标成 5e；这是命名澄清，不改规则、不改已购买内容。所以你在角色生成器里看到 5e / 5.5e，仍然要把它翻译回「2014 字段表」或「2024 字段表」，不能看见标签就混抄。

两套表不能叠。2014 的背景特性不会因为你改用 2024 卡就变成起源专长；2024 的属性加值也不能倒填进 2014 卡的种族加值空位。城主如果允许混用旧书，按后文「旧书背景进 2024 桌」做转换，而不是两套加值一起加。

### 口头叫法怎么落到两套组件

用这张对照开口，不要再发明第三套：

| 桌上或网站上的叫法 | 角色卡实际抄哪一套 |
| --- | --- |
| 5e、老版、2014 手册、灰机标的 DND5E | [2014 基础规则：个性与背景](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/personality-and-background) 的技能、工具或语言、起始装备、背景特性、建议个性 |
| 5.5e、5R、2024 版、灰机标的 DND5.5E | [2024 基础规则：角色起源](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins) 的三项属性、指定起源专长、两项技能、一项工具、装备包或 50 GP |
| D&D Beyond 现在标 5e | 对应 2014 内容，见 [2024《玩家手册》背景与起源专长一文的编辑说明](https://www.dndbeyond.com/posts/1785-the-backgrounds-and-origin-feats-in-the-2024) |
| D&D Beyond 现在标 5.5e | 对应 2024 更新规则，同上 |

灰机等社区译文页脚会写明不是威世智官方简体。术语可以对着看，数字以英文官方免费规则或你桌上那本已允许的手册为准。

## 按年份把组件抄进角色卡

选定年份之后，背景不再是「选一个听起来酷的名字」。它是一份合同：这一年给你哪些栏，你就抄哪些栏；这一年没有的栏，不要从另一年借。免费规则已经写出全文的条目，可以按正文抄完整数字；手册其余条目只在目录里能核对到名称和部分列时，先问城主允不允许该书，再打开该书抄。

### 2014 要抄什么

2014 基础规则这一章写明：每个背景给两项技能熟练；多数还给出一种或多种工具熟练；若两个来源给了同一项熟练，可改选同一种类的另一项。部分背景另给额外语言。每个背景提供一包起始装备；若改用装备章里花钱买装备的可选规则，则不再拿背景起始装备。背景还带建议个性：可挑选、可掷骰、可只当灵感。

建议个性在 2014 里通常是两个人格特质、一个理想、一个羁绊、一个缺点。它们是扮演提示，不是 2024 默认机械字段。2024 桌如果有人仍想用这四项来演，先跟城主说清楚：这是角色口吻，不是起源专长，也不替代属性加值。

2014 免费规则本章完整写出的背景是侍僧、罪犯、民间英雄、贵族、学者、士兵。下面用侍僧做抄卡示例，数字来自同一章正文，不是排名。

**示例：2014 侍僧。** 技能为洞悉与宗教；自选两种语言；装备含圣徽、祷文书或转经轮、五根香、法衣、普通衣服和 15 gp；特性是 Shelter of the Faithful（虔信者的庇护）。正文写明侍僧不一定是牧师：主持仪式不等于引导神力。抄完这些栏，才算填了 2014 背景；只写「我以前在庙里干活」还不够。

其余五条免费全文同样按「技能 / 工具或语言 / 装备 / 特性」抄，不要只记名字：

| 2014 免费规则条目 | 技能 | 工具或语言（本章已写出的部分） | 特性名 |
| --- | --- | --- | --- |
| 罪犯 | 欺瞒、隐匿 | 一种赌具，盗贼工具 | Criminal Contact |
| 民间英雄 | 驯兽、生存 | 一种工匠工具，陆地载具 | Rustic Hospitality |
| 贵族 | 历史、游说 | 一种赌具；自选一种语言 | Position of Privilege |
| 学者 | 奥秘、历史 | 自选两种语言 | Researcher |
| 士兵 | 运动、威吓 | 一种赌具，陆地载具 | Military Rank |

装备包以该条正文为准，上表不展开。特性英文名保留官方写法，避免把社区意译当成威世智简体原文。

### 2024 要抄什么

2024 基础规则把背景拆成五块，见 [角色起源](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins) 的「背景的组成部分」：

1. 列出三项属性。一项 +2、另一项 +1，或三项各 +1；任何一项不能因此超过 20。
2. 给予一项指定的起源专长。
3. 两项指定技能熟练。
4. 一项工具熟练：指定一种，或从工匠工具里选。
5. 装备包或 50 GP，二选一。

叙述细节可以改。改故事不等于改这五块数字。

创角顺序也和许多 2014 桌的习惯不同。[创建角色](https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character) 写的是：先选职业，再决定起源（背景、物种、两种语言），再定属性。背景会影响属性步骤。免费规则里的「属性与背景对照表」只覆盖侍僧、罪犯、学者、士兵这四种，不能拿它去推断未列出的手册背景该加哪三项。

2024 免费规则按字母顺序完整写出四种背景。下面字段全部来自该页正文，标明为示例，不是强度榜。

**示例：2024 侍僧。** 属性为智力、感知、魅力；专长为 Magic Initiate（魔法入门，Cleric）；技能为洞悉与宗教；工具为书法工具；装备选 A 包（书法工具、祷文书、圣徽、十张羊皮纸、袍服、8 GP）或 50 GP。

**示例：2024 罪犯。** 属性为敏捷、体质、智力；专长为 Alert（警觉）；技能为巧手与隐匿；工具为盗贼工具；装备选 A 包（两把匕首、盗贼工具、撬棍、两个口袋、旅行者衣服、16 GP）或 50 GP。

**示例：2024 学者。** 属性为体质、智力、感知；专长为 Magic Initiate（魔法入门，Wizard）；技能为奥秘与历史；工具为书法工具；装备选 A 包（长棍、书法工具、史书、八张羊皮纸、袍服、8 GP）或 50 GP。

**示例：2024 士兵。** 属性为力量、敏捷、体质；专长为 Savage Attacker（凶蛮攻击者）；技能为运动与威吓；工具自选一种赌具；装备选 A 包（矛、短弓、二十支箭、与上面相同的赌具、医疗包、箭袋、旅行者衣服、14 GP）或 50 GP。

把 2014 士兵和 2024 士兵并排放，最容易看出不能混抄的地方。两边都叫士兵，两边都给运动和威吓；2014 另给陆地载具和「军衔」特性，2024 改给力量/敏捷/体质加值、凶蛮攻击者和装备包或 50 GP。特性栏和起源专长栏不是同一个格子。

### 免费规则能核验哪几条，目录十六个名字不意味着什么

2024 免费规则正文只完整列出上述四种。D&D Beyond 官方文章 [《2024 玩家手册》中的背景与起源专长](https://www.dndbeyond.com/posts/1785-the-backgrounds-and-origin-feats-in-the-2024) 写明 2024《玩家手册》有十六种背景，并给出名称与简述。同一天打开的 [背景目录](https://www.dndbeyond.com/backgrounds) 里，来源为 Player’s Handbook 且带 Feat: 的条目也能对上这十六个名字，以及目录上的专长列和技能列。

目录列不是全文。十二种未出现在免费规则正文里的手册背景，付费《玩家手册》全文不在本文核验范围内；三项属性、工具、装备包和叙述须打开该书或问城主。你可以在目录里确认「手册里有这个名字，专长列和技能列长这样」，完整数字仍须打开该书或问城主。

十六个官方英文名与目录已核验列如下。简体常用叫法只作对照，不是威世智官方简体；行路者（Wayfarer）在社区里译法还不统一，不要把它当成已核验译名。

| 官方目录英文名 | 简体常用叫法（非官方） | 目录 Feat 列 | 目录技能列 |
| --- | --- | --- | --- |
| Acolyte | 侍僧 | Magic Initiate (Cleric) | Insight, Religion |
| Artisan | 工匠 | Crafter | Investigation, Persuasion |
| Charlatan | 骗子 | Skilled | Deception, Sleight of Hand |
| Criminal | 罪犯 | Alert | Stealth, Sleight of Hand |
| Entertainer | 艺人 | Musician | Acrobatics, Performance |
| Farmer | 农民 | Tough | Animal Handling, Nature |
| Guard | 守卫 | Alert | Athletics, Perception |
| Guide | 向导 | Magic Initiate (Druid) | Stealth, Survival |
| Hermit | 隐士 | Healer | Medicine, Religion |
| Merchant | 商人 | Lucky | Animal Handling, Persuasion |
| Noble | 贵族 | Skilled | History, Persuasion |
| Sage | 学者 | Magic Initiate (Wizard) | Arcana, History |
| Sailor | 水手 | Tavern Brawler | Acrobatics, Perception |
| Scribe | 书记 | Skilled | Investigation, Perception |
| Soldier | 士兵 | Savage Attacker | Athletics, Intimidation |
| Wayfarer | （译法不统一，沿用英文名） | Lucky | Insight, Stealth |

2014 一侧不要用「《玩家手册》一共十几种」这种未打开 2014 手册全文的数字。免费基础规则能核验的是六条完整条目；官方目录里还能看到 2014 遗产行，其中部分是变体或合并行。需要手册里其他 2014 背景时，问城主允不允许该书，再按该书抄 2014 字段，不要把目录行数说成已经核验的总数。

公开 SRD 落地页标题为 SRD v5.2.1。本文未把 SRD PDF 正文纳入核验，不能用它补一份背景清单。

## 写一句能开团的过去：发生了什么变化

2014 基础规则把背景最重要的问题写成：发生了什么变化？为什么你不再过背景所描述的那种生活？钱从哪来、职业技能怎么学、和仍过那种日子的人差在哪，能答一句即可。

2024 免费规则改写了机械字段，但仍把背景定义为冒险开始前最有塑造力的地点与职业特征，并允许改叙述细节。开团要用的最小故事，不是生成器那样的性格/缺陷/羁绊/秘密长表，而是一句能让城主立刻接戏的「以前做什么、为什么不干了」。

写的时候只回答变化本身。不要把理想、缺点、秘密一次塞进同一句。一句够城主问下一问，就够开团。

**示例：** 「我在河畔神殿管账和迎客，直到账册被替换、圣徽被收走，我必须带着仅剩的符记出城找还活着的证人。」这句给了地点、旧职、断裂事件和眼前目标。它没有替代 2014 的洞悉/宗教，也没有替代 2024 的魔法入门。

**示例：** 「我在边堡服役到编制撤销、军饷停发，只会列阵和守夜的人被推到商路当押运。」城主可以立刻接：旧部队还在不在、谁裁的编、押运的货是不是旧军械。不要写成「士兵想去看看外面的世界」这种没有断裂的空句。

**示例：** 「我在修院抄书换住宿，抄到一份不该存在的谱系，修院要我忘掉它，我把残页缝进袍衬逃走。」学者的断裂是知识本身变成把柄，不是「喜欢读书所以出来冒险」。

若你用的是 2024 桌、故事想改官方简述，改细节可以，但不要改到五项机械对不上。侍僧背景配一套完全不进神殿、也不碰圣徽的过去，扮演上要和城主对过；机械上你仍然拿该背景印出的专长和技能。

## 旧书背景进 2024 桌的三步

2024 桌想沿用 2014 背景时，不要两套加值叠在一起。官方写在 [创建角色](https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character) 的侧栏「来自旧书的背景与物种」，按下面三步执行。前提是城主允许该旧书条目。

第一步，补属性。旧书背景不含属性调整。使用旧背景时，改为一份 +2 和另一份 +1，或三项各 +1，且不超过 20。侧栏没有指定必须加在哪三项上；文章简述里的说法是把这三分加到你选择的属性。具体加哪几项，问城主是否要限制在与旧背景相关的属性，不要自己发明必须加力量或必须加魅力。

第二步，丢掉旧物种加值。旧书物种带属性加值。若你同时使用旧物种，忽略那些加值，只使用背景给的加值。不要「旧种族 +2、旧背景再按侧栏 +2/+1」。

第三步，看专长。若所选背景不提供专长，则自选一项起源专长。2014 基础规则里的背景给的是特性，不是专长，因此进 2024 创角时通常要补一项起源专长。官方文章对旧背景转换的写法与这条侧栏一致。

侧栏没有授权你把 2014 特性改写成 2024 起源专长，也没有说旧特性自动消失。特性还在不在，取决于城主是否允许继续使用该旧书条目的特性文字。不要把「军衔」抄进起源专长栏，也不要把 Savage Attacker 倒填回 2014 卡。

**示例：** 2014 士兵进 2024 桌，城主允许旧书。你执行：按侧栏加属性且单项不超过 20；若物种也来自旧书，忽略旧物种加值；士兵条目不提供专长，自选一项起源专长。2014 的陆地载具熟练和军衔特性是否保留，另问城主，不要默认两套装备和两套特性一起拿。

## 自制背景该问谁

2014 基础规则把自定义背景写成玩家选项：可替换一项特性，任选两项技能，从范例背景中合计选两项工具或语言；可用背景装备包，或按装备章花钱买装备（花钱则不能再拿职业建议装备包）；最后选两个人格特质、一个理想、一个羁绊、一个缺点。找不到合适特性时，和城主一起创作。

2024 免费规则没有把同等的「玩家直接自定义背景」条款写进已打开的起源章。中文资料里，「创作背景」出现在《地下城主指南 2024》工具箱的社区汉化页，步骤大意是由城主做一份与手册格式一致的新背景。那一页不是威世智官方简体，不能当成已核验的原文去整段照抄。2024 桌要自制背景，把它当成需要城主拍板的事：问清三项属性、哪一项起源专长、哪两项技能、哪一项工具、装备如何折成约 50 GP。不要默认把 2014 自定义条款搬过来用。

自家改一项技能「看起来更贴角色」，在 2014 自定义框架里是有规则位置的；在 2024 桌则可能动到已经指定的起源专长和属性三项。改之前先问这桌按哪一年的合同走，再问谁有权改合同。

## 起源专长开局从哪来，升级时官方怎么写分类

2024 里，专长是不绑在职业上的专项能力。[专长章](https://www.dndbeyond.com/sources/dnd/br-2024/feats) 写明：背景会给你一项专长；某些等级职业会给 Ability Score Improvement 专长，或让你选择一项你符合条件的其他专长。同一专长默认只能拿一次，除非其描述另说。

开局那一项，来自背景的指定起源专长。免费规则四种里：侍僧拿牧师列表的魔法入门，罪犯拿警觉，学者拿法师列表的魔法入门，士兵拿凶蛮攻击者。手册目录其余十二个名字也各有指定专长，其效果正文不在免费规则专长章里，须打开该书或问城主。

人类物种还有一项 Versatile：自选一项起源专长，规则建议选 Skilled（精通）。加上背景给的那一项，人类开局会有两项起源专长。不要把「开局两个起源专长」说成所有物种都有。

社区里常有一种说法：起源专长升级后通常不能再选。免费规则没有这样写。专长分类规则是：若指示你从特定分类选专长（例如 Origin），该分类必须出现在专长名下；若指示你选专长且未指定分类，可从任何分类选。因此：

- 特征写「选一项起源专长」时，只能选 Origin 分类下的专长。
- 特征写「选一项专长」且没有点名分类时，Origin、General 等分类都在候选里，只要你符合先决条件。
- 不要写成「永远不能再选」，也不要写成「每次升级都一定能再选」。看那一次指令有没有限定分类。

免费规则 Origin 分类写出的四种效果如下，供开局核对，不是推荐榜：

- Alert（警觉）：先攻掷骰加上熟练加值；掷完先攻后，可与同一场战斗中一名自愿盟友交换先攻，任一方处于失能则不能换。
- Magic Initiate（魔法入门）：从牧师、德鲁伊或法师法术列表选两个戏法，再从同一列表选一个一环法术；施法属性在智力、感知、魅力中选（选取本专长时决定）；该一环法术始终准备，可无法术位施放一次，长休后恢复，也可用你拥有的法术位施放。每次提升等级时，可用同一列表同环法术替换所选法术之一。每次选取必须选不同法术列表。
- Savage Attacker（凶蛮攻击者）：每回合一次，用武器命中目标时，把该武器的伤害骰掷两次，选用其中一次。
- Skilled（精通）：自选合计三项技能或工具熟练；可重复选取。

Crafter、Musician、Tough、Healer、Lucky、Tavern Brawler 等名称出现在手册目录的 Feat 列，免费规则本章没有写出它们的效果正文。需要这些专长时，打开该书或问城主，不要用搜索摘要补效果。

## 出身选定之后，Token 做什么、不做什么

背景名字、技能和专长已经落在同一年份的角色卡上之后，如果这桌要上网团，才需要把出身职业的视觉线索做成地图标记。Token Maker 做裁切、遮罩、边框、文字和透明 PNG，不选择背景，不算规则，不生成身世。

中文首页写明：把角色立绘做成圆形、方形或多边形 VTT Token，加边框、遮罩和文字，为 DnD、Roll20、Foundry VTT 与 Owlbear 导出透明 PNG；处理方式本地优先，角色立绘可以留在浏览器里裁切、加框并导出，不必先走远程上传；形状从圆形到十二边，导出最高 2048。编辑器可见文案：拖拽图片开始，支持 10MB 内 JPG、PNG、WEBP；导出按钮可见 256、512、1024、2048。这些是页面与工作区文案，不是导出质量或导入成功率的实测。

[常见问题](https://www.tokenmaker.one/zh/faq) 同样写：工具做裁切、遮罩、边框、文字和 PNG 导出；可导出透明 PNG；面向 Roll20、Foundry VTT、Owlbear Rodeo；支持圆形、方形、多边形、内置边框、颜色调整和自定义边框素材；默认编辑流程本地优先。

构图只服务已经选定的出身，不反过来决定背景。下面三则是构图建议，不是实测胜率。

**示例：士兵。** 优先保留武器或甲片轮廓，边框用同一队人能认出来的颜色。肩甲或旗帜被圆形遮罩切掉时，改用[方形 Token 页](https://www.tokenmaker.one/zh/templates/square-token-maker)的建议：需要保留肩甲、武器、旗帜、载具或阵营信息时方形更合适；多数实战先导出 512，归档边缘用 1024，资源包或长期库再考虑 2048。512 / 1024 是本站建议，不是平台强制规格。

**示例：学者。** 优先保留书册、袍袖或一卷露出边的纸。脸可以略靠上，避免方形裁切把双手道具切没。文字标签只在需要区分「哪一位学者」时再加，不要把背景全名写进 Token 当规则备忘。

**示例：侍僧。** 优先保留圣徽或法衣领口。圣徽比表情更适合在缩小的地图上认人。不要因为图好看就换一个与背景无关的边框主题。

工具做不到的事也要说清：它不会告诉你该选侍僧还是士兵，不会计算 +2/+1，不会检查你有没有把 2014 特性抄进 2024 专长栏。先填卡，再做图。

## 开团前核对这四件事

1. 年份一致。卡上的背景名、熟练、属性加值和特性或起源专长来自同一套表；口头上的 5.5e / 5R 已经落到 2014 或 2024。
2. 来源分层。免费规则正文能核验的数字，和手册目录里的名称列，分开告诉城主。十二种非免费 2024 背景的装备和属性三项，未打开该书就不要填成已确定。
3. 一句变化。你能用一句话说清以前做什么、为什么不干了。没有这句，背景仍只是加成，开团接不上戏。
4. 需要地图标记时才做 Token。遮罩、边框和文字服务于出身职业的轮廓或派系色；工具不是背景选择器。

做完这四步，「DND 背景怎么选」这件事才算落到桌上，而不是停在壁纸收藏夹或生成器对话窗口里。

## 来源

- [D&D Beyond 基础规则（2014）：个性与背景](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/personality-and-background)
- [D&D Beyond 基础规则（2024）：角色起源](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins)
- [D&D Beyond 基础规则（2024）：创建角色](https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character)
- [D&D Beyond 基础规则（2024）：专长](https://www.dndbeyond.com/sources/dnd/br-2024/feats)
- [D&D Beyond：2024《玩家手册》背景与起源专长](https://www.dndbeyond.com/posts/1785-the-backgrounds-and-origin-feats-in-the-2024)
- [D&D Beyond 背景目录](https://www.dndbeyond.com/backgrounds)
- [Token Maker 中文首页](https://www.tokenmaker.one/zh)
- [Token Maker 中文 FAQ](https://www.tokenmaker.one/zh/faq)
- [方形 Token 页](https://www.tokenmaker.one/zh/templates/square-token-maker)
`;

export const dndBackgroundsArticleHtml = convertLockedMarkdownToBodyHtml(LOCKED_ENGLISH_BODY_MARKDOWN, {
  dropLeadingH1: false,
  localeLabel: 'en',
});

export const dndBackgroundsArticleHtmlZh = convertLockedMarkdownToBodyHtml(LOCKED_CHINESE_BODY_MARKDOWN, {
  dropLeadingH1: true,
  localeLabel: 'zh',
});
