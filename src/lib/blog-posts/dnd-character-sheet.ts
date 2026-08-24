import {
  DND_2024_CHARACTER_CREATION_URL,
  DND_2024_CHARACTER_ORIGINS_URL,
  DND_2024_EQUIPMENT_URL,
  DND_2024_FEATS_URL,
  DND_CHARACTER_SHEET_INLINE_IMAGE_PATH,
  DND_CHARACTER_SHEET_VIDEO_ID,
  DND_CHARACTER_SHEET_VIDEO_PLACEHOLDER_PATH,
  DND_CHARACTER_SHEET_VIDEO_URL,
  EN_COAT_OF_ARMS_MAKER_PATH,
  EN_DICE_ROLLER_PATH,
  EN_DND_ALIGNMENT_CHART_PATH,
  EN_DND_CLASSES_PATH,
  EN_DND_LANGUAGES_PATH,
  EN_DND_RACES_PATH,
  EN_DND_STATS_PATH,
  EN_EDITOR_PATH,
  EN_PLAYERS_HANDBOOK_DND_5E_PATH,
  EN_SQUARE_TOKEN_MAKER_PATH,
  ZH_COAT_OF_ARMS_MAKER_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_ALIGNMENT_CHART_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_DND_LANGUAGES_PATH,
  ZH_DND_RACES_PATH,
  ZH_DND_STATS_PATH,
  ZH_EDITOR_PATH,
  ZH_PLAYERS_HANDBOOK_DND_5E_PATH,
  ZH_SQUARE_TOKEN_MAKER_PATH,
  liteVideoEmbed,
} from './shared';

export const dndCharacterSheetArticleHtml = String.raw`
<p>A D&amp;D character sheet is the page you play from: who the character is, six ability scores, the modifiers you add to dice, combat numbers, features, gear, and spells. Session one goes sideways when those boxes are empty, when 2014 and 2024 labels sit on the same line, or when you fill from the top of the form before a class exists.</p>

<p>The official 2014 fillable PDF is still easy to download and still works. It is also the wrong layout if the table is using the 2024 Player's Handbook. Fill the sheet in 2024 creation order: class, origin, ability scores, alignment, then the remaining numbers. Every combat box should point back to a choice you already made. This page uses the <a href="${DND_2024_CHARACTER_CREATION_URL}" rel="noreferrer noopener">2024 Free Basic Rules</a> first and labels 2014 differences where the printed form still shows older words.</p>

<h2>Pick the official sheet that matches the table</h2>
<p>Write <code>5e (2014)</code> or <code>5.5e (2024)</code> at the top before you write a name. That one label decides whether a box means Race or Species, Inspiration or Heroic Inspiration, and whether Weapon Mastery belongs on the attacks line. If the table has not named a year, settle it with the <a href="${EN_PLAYERS_HANDBOOK_DND_5E_PATH}">Player's Handbook version guide</a>.</p>

<table><thead><tr><th scope="col">What you need</th><th scope="col">Official file</th><th scope="col">Format</th><th scope="col">Use it when</th></tr></thead><tbody>
<tr><th scope="row">2014 / legacy 5e form</th><td><a href="https://media.wizards.com/2016/dnd/downloads/5E_CharacterSheet_Fillable.pdf" rel="noreferrer noopener">Fillable Fifth Edition Character Sheet (PDF)</a></td><td>Three pages, form fields</td><td>The campaign uses 2014 classes, race-based ability increases, and the older sheet layout</td></tr>
<tr><th scope="row">2024 / 5.5e form</th><td><a href="https://media.dndbeyond.com/compendium-images/phb/downloads/DnD_2024_Character-Sheet.pdf" rel="noreferrer noopener">2024 Character Sheet (PDF)</a></td><td>Two pages, print and write</td><td>The campaign uses 2024 species, backgrounds, Heroic Inspiration, and Weapon Mastery</td></tr>
<tr><th scope="row">Ready-to-play examples</th><td><a href="https://www.dndbeyond.com/resources/1779-d-d-character-sheets" rel="noreferrer noopener">D&amp;D Beyond character sheet downloads</a></td><td>Zipped premade PDFs</td><td>You need a legal pregenerated hero tonight, not a blank form</td></tr>
</tbody></table>

<p>The official 2024 PDF is a print file, not a fillable form. If you play on paper, print it and use a pencil. If you play in a browser, a digital sheet on D&amp;D Beyond or inside a VTT such as Roll20 still counts as a character sheet in the 2024 rules. Token Maker does not fill those boxes. It turns finished character art into a map token after the numbers exist.</p>

<p>Do not photocopy a random "5e" thumbnail and assume the year. The 2014 form still says Race. The 2024 form says Species. Mix those labels and a 2014 race bonus lands next to a 2024 background increase.</p>

<h2>Map the 2014 sheet to the 2024 sheet before you write numbers</h2>
<p>Both official forms record the same six abilities. The 2024 redesign puts the number you actually roll in the large box.</p>

<table><thead><tr><th scope="col">Job at the table</th><th scope="col">2014 official sheet</th><th scope="col">2024 official sheet</th></tr></thead><tbody>
<tr><th scope="row">Ancestry label</th><td>Race</td><td>Species</td></tr>
<tr><th scope="row">Ability presentation</th><td>Score is large; modifier is small</td><td>Modifier is large; score sits beside it</td></tr>
<tr><th scope="row">Skills</th><td>One stacked skill list</td><td>Skills sit with the ability that governs them</td></tr>
<tr><th scope="row">Inspiration</th><td>Inspiration checkbox</td><td>Heroic Inspiration</td></tr>
<tr><th scope="row">Attacks</th><td>Attack and spellcasting block</td><td>Weapons and damage cantrips, with space for Weapon Mastery</td></tr>
<tr><th scope="row">Spell pages</th><td>Optional third page</td><td>Spell tracking condensed onto the two-page form</td></tr>
<tr><th scope="row">Personality</th><td>Large trait / ideal / bond / flaw blocks</td><td>Smaller roleplay space; mechanics take the front page</td></tr>
<tr><th scope="row">Page count</th><td>Three pages (page 3 is spells)</td><td>Two pages</td></tr>
</tbody></table>

<img class="inline-article-image" src="${DND_CHARACTER_SHEET_INLINE_IMAGE_PATH}" alt="Two unlabeled paper character forms on a table, a thicker older stack beside a thinner two-page spread, with a circular portrait token and a small mace" loading="lazy" decoding="async" fetchpriority="low" width="1536" height="1024" />

<p>The 2014 sheet is still legal at a 2014 table. Plenty of groups keep using it in a 2024 game by handwriting the new terms into leftover space. That workaround only works if you already know which boxes changed. If this is your first sheet, use the form that matches the handbook.</p>

<p>Most viral walkthroughs still point at the three-page form, so a comic 2014 tour is useful as a map, not as a 2024 recipe. JoCat's <a href="${DND_CHARACTER_SHEET_VIDEO_URL}" rel="noreferrer noopener"><em>A Crap Guide to D&amp;D [5th Edition] - Character Sheet</em></a> covers ability scores, modifiers, skills, proficiency, combat, and attacks on that older layout. Watch it to learn the 2014 page. Then come back to the 2024 fill order below. The video loads only after you press play.</p>

${liteVideoEmbed(DND_CHARACTER_SHEET_VIDEO_ID, 'A Crap Guide to D&D [5th Edition] - Character Sheet', {
  src: DND_CHARACTER_SHEET_VIDEO_PLACEHOLDER_PATH,
  alt: 'Fanned blank character pages, a pencil, and a teal twenty-sided die under a warm lamp for a 2014 character-sheet walkthrough',
})}

<p>JoCat, <em>A Crap Guide to D&amp;D [5th Edition] - Character Sheet</em> (2014 fifth-edition sheet). Use it to learn the old form. Do not copy its Race and Inspiration labels onto a 2024 character.</p>

<h2>Fill the sheet in 2024 creation order, not top to bottom</h2>
<p>The 2024 Free Basic Rules give five steps. Map each step to boxes. Do not start at Character Name just because it sits at the top.</p>

<h3>1. Choose a class and write the level</h3>
<p>Write the class, level, and XP. A new character is level 1 with 0 XP. Copy armor training, weapon proficiencies, saving-throw proficiencies, and the class skill list from the class entry. Leave AC, HP, and attack bonuses blank until scores exist. Those boxes look urgent. They are not ready yet.</p>

<p>The class also names a primary ability. Protect that ability when you assign scores later. If you have not chosen a class, use the <a href="${EN_DND_CLASSES_PATH}">DnD classes guide</a>.</p>

<h3>2. Determine origin: background, species, languages</h3>
<p>A 2024 origin is a background plus a species. It is not a 2014 race-plus-background stack.</p>
<p>From the background, record:</p>
<ul>
<li>the three listed abilities (those are the only scores you may raise in step 3)</li>
<li>the Origin feat</li>
<li>two skill proficiencies and one tool proficiency</li>
<li>starting equipment option A or B</li>
</ul>
<p>From the species, record size, Speed, creature type, and every species trait. Species do not raise ability scores in the 2024 core rules. The <a href="${EN_DND_RACES_PATH}">DnD races and species guide</a> covers the 2014 boundary.</p>
<p>Then write languages. A 2024 character knows Common plus two languages from the Standard Languages table, and more if a class or feature grants them. Pick the extra language for the campaign, not only because it sounds cool. The <a href="${EN_DND_LANGUAGES_PATH}">D&amp;D languages guide</a> is the place to choose that second language.</p>

<h3>3. Determine ability scores, then write modifiers</h3>
<p>Generate six numbers with the method the DM named: standard array <code>15, 14, 13, 12, 10, 8</code>; random generation of 4d6 keep the highest three, six times; or 27-point cost. If the table uses random generation, run the 4d6 drop-lowest preset six times on the <a href="${EN_DICE_ROLLER_PATH}">DnD dice roller</a>, then come back here to place the totals.</p>
<p>Assign the six numbers to Strength, Dexterity, Constitution, Intelligence, Wisdom, and Charisma. Put the highest score in the class's primary ability. Then apply the background adjustment: +2 to one listed ability and +1 to another, or +1 to all three, with no score above 20.</p>
<p>Write the modifier next to each score:</p>
<p><code>modifier = floor((score - 10) / 2)</code></p>
<p>The <a href="${EN_DND_STATS_PATH}">DnD stats guide</a> is the full assignment walkthrough. You need the modifiers written on the sheet, not another ranking of the six abilities.</p>
<p>Proficiency Bonus at level 1 is +2. Darken the proficiency circles for class saving throws and for every skill the class, background, species, or feat granted. The number in each skill or save line is ability modifier + Proficiency Bonus when proficient, or the modifier alone when it is not.</p>

<h3>4. Choose an alignment</h3>
<p>Write one of the nine alignments. The 2024 rules treat this as a shorthand for ethics, not a lock on every decision. If you want to pressure-test the choice, use the <a href="${EN_DND_ALIGNMENT_CHART_PATH}">alignment chart guide</a>. D&amp;D assumes player characters are not evil; ask the DM before you write an evil alignment.</p>

<h3>5. Fill the remaining numbers from those choices</h3>
<p>Now the banner fields make sense, including the character name. Fill:</p>
<ul>
<li>Passive Perception = 10 + the Wisdom (Perception) check modifier, including proficiency if you have it.</li>
<li>Hit Point maximum from the Level 1 Hit Points by Class table: Cleric, Bard, Druid, Monk, Rogue, and Warlock use <code>8 + Constitution modifier</code>; Fighter, Paladin, and Ranger use <code>10 + Constitution modifier</code>; Barbarian uses <code>12 + Constitution modifier</code>; Sorcerer and Wizard use <code>6 + Constitution modifier</code>.</li>
<li>Hit Dice: one die of the class type at level 1.</li>
<li>Initiative: Dexterity modifier unless a feature says otherwise.</li>
<li>Armor Class: 10 + Dexterity modifier with no armor; otherwise use the worn armor's formula and add +2 for a Shield if you have Shield training and are using one.</li>
<li>Attacks: for a proficient melee weapon, Strength modifier + Proficiency Bonus, unless a weapon property says otherwise. Damage uses the weapon die plus the same ability modifier.</li>
<li>Spellcasting: Spell save DC = <code>8 + spellcasting ability modifier + Proficiency Bonus</code>. Spell attack bonus = spellcasting ability modifier + Proficiency Bonus. Copy cantrips, prepared spells, and the slot counts from the class table.</li>
<li>Features &amp; Traits: class features, species traits, Origin feat, and any other named feature. A summary plus the source is enough. Do not recopy the entire rulebook into the box.</li>
</ul>
<p>Page two holds appearance, backstory, allies, extra features, and treasure. Fill it after the combat row on page one is complete. A blank backstory does not block session one. A blank Armor Class does.</p>

<h2>Work through a level 1 Human Acolyte Cleric</h2>
<p>This example uses the 2024 Free Basic Rules: Cleric 1, Acolyte background, Human species, standard array, Thaumaturge Divine Order. It is one legal character, not a required Cleric.</p>
<p>Write at the top: <code>5.5e (2024) · Cleric 1 · Acolyte · Human</code>.</p>

<h3>Banner and origin</h3>
<table><thead><tr><th scope="col">Field</th><th scope="col">Entry</th></tr></thead><tbody>
<tr><th scope="row">Class &amp; Level</th><td>Cleric 1</td></tr>
<tr><th scope="row">Background</th><td>Acolyte</td></tr>
<tr><th scope="row">Species</th><td>Human (Medium)</td></tr>
<tr><th scope="row">Alignment</th><td>Neutral Good</td></tr>
<tr><th scope="row">XP</th><td>0</td></tr>
<tr><th scope="row">Speed</th><td>30 feet</td></tr>
<tr><th scope="row">Size</th><td>Medium</td></tr>
<tr><th scope="row">Proficiency Bonus</th><td>+2</td></tr>
</tbody></table>

<p>Acolyte grants the Magic Initiate (Cleric) Origin feat, Insight and Religion, Calligrapher's Supplies, and equipment option A: Calligrapher's Supplies, a prayer book, a Holy Symbol, 10 sheets of parchment, a Robe, and 8 GP. Cleric equipment option A adds a Chain Shirt, a Shield, a Mace, a Holy Symbol, a Priest's Pack, and 7 GP. Record both packages. Do not buy a second Chain Shirt.</p>
<p>Human traits to copy: Resourceful (Heroic Inspiration after every Long Rest), Skillful (one extra skill), and Versatile (one Origin feat; Skilled is the listed recommendation). This example takes Perception from Skillful and Skilled for Medicine, Survival, and Persuasion.</p>
<p>Languages: Common plus two from the Standard Languages table. This example uses Common, Elvish, and Dwarvish.</p>

<h3>Ability scores</h3>
<p>Cleric standard-array suggestion, then Acolyte +2 Wisdom and +1 Constitution:</p>
<table><thead><tr><th scope="col">Ability</th><th scope="col">Array</th><th scope="col">After Acolyte</th><th scope="col">Modifier</th></tr></thead><tbody>
<tr><th scope="row">Strength</th><td>14</td><td>14</td><td>+2</td></tr>
<tr><th scope="row">Dexterity</th><td>8</td><td>8</td><td>−1</td></tr>
<tr><th scope="row">Constitution</th><td>13</td><td>14</td><td>+2</td></tr>
<tr><th scope="row">Intelligence</th><td>10</td><td>10</td><td>+0</td></tr>
<tr><th scope="row">Wisdom</th><td>15</td><td>17</td><td>+3</td></tr>
<tr><th scope="row">Charisma</th><td>12</td><td>12</td><td>+1</td></tr>
</tbody></table>
<p>Saving throws: Wisdom and Charisma are the Cleric proficiencies.</p>
<table><thead><tr><th scope="col">Save</th><th scope="col">Math</th><th scope="col">Bonus</th></tr></thead><tbody>
<tr><th scope="row">Strength</th><td>+2</td><td>+2</td></tr>
<tr><th scope="row">Dexterity</th><td>−1</td><td>−1</td></tr>
<tr><th scope="row">Constitution</th><td>+2</td><td>+2</td></tr>
<tr><th scope="row">Intelligence</th><td>+0</td><td>+0</td></tr>
<tr><th scope="row">Wisdom</th><td>+3 + 2</td><td>+5</td></tr>
<tr><th scope="row">Charisma</th><td>+1 + 2</td><td>+3</td></tr>
</tbody></table>
<p>Skills with proficiency marked:</p>
<table><thead><tr><th scope="col">Skill</th><th scope="col">Source</th><th scope="col">Bonus</th></tr></thead><tbody>
<tr><th scope="row">Insight (WIS)</th><td>Acolyte</td><td>+5</td></tr>
<tr><th scope="row">Religion (INT)</th><td>Acolyte</td><td>+2</td></tr>
<tr><th scope="row">Perception (WIS)</th><td>Human Skillful</td><td>+5</td></tr>
<tr><th scope="row">Medicine (WIS)</th><td>Skilled</td><td>+5</td></tr>
<tr><th scope="row">Survival (WIS)</th><td>Skilled</td><td>+5</td></tr>
<tr><th scope="row">Persuasion (CHA)</th><td>Skilled</td><td>+3</td></tr>
</tbody></table>
<p>Passive Perception = 10 + 5 = 15.</p>

<h3>Combat row</h3>
<p>Hit Point maximum = 8 + Constitution modifier = 10. Hit Dice = 1d8. Current HP starts at 10. Temporary HP starts empty. Death save circles stay empty.</p>
<p>Armor Class: Chain Shirt is <code>13 + Dexterity modifier (max 2)</code>. Dexterity −1 still applies, so the shirt is 12. A Shield adds +2 because the Cleric has Shield training. Final AC = 14.</p>
<p>Initiative = −1.</p>
<p>Mace: 1d6 Bludgeoning, melee. Attack bonus = Strength +2 + Proficiency +2 = +4. Damage = 1d6 + 2. The Mace has the Sap mastery property in the 2024 Weapons table. A level 1 Cleric does not have Weapon Mastery, so leave the mastery box blank unless a later feature grants it.</p>
<p>Spellcasting: Wisdom. Spell save DC = 8 + 3 + 2 = 13. Spell attack bonus = +5. Copy three Cleric cantrips and four prepared level 1 Cleric spells from the class entry. The Free Basic Rules recommend Guidance, Sacred Flame, and Thaumaturgy for cantrips, and Bless, Cure Wounds, Guiding Bolt, and Shield of Faith for prepared spells. Copy the level 1 spell-slot count from the Cleric Features table onto the sheet; a level 1 Cleric has two 1st-level slots.</p>
<p>Thaumaturge adds one extra Cleric cantrip and a bonus equal to the Wisdom modifier on Intelligence (Arcana) or Intelligence (Religion) checks. Religion is already +2 from proficiency. Add the Thaumaturge +3 when that feature applies, for a +5 Religion check.</p>
<p>Magic Initiate (Cleric) adds two more Cleric cantrips and one level 1 Cleric spell you always have prepared. You can cast that spell once without a slot and regain that use on a Long Rest. Write the chosen spell name in Features so it does not hide inside the class prepared list.</p>

<h3>Features to keep in view</h3>
<ul>
<li>Spellcasting and Divine Order (Thaumaturge)</li>
<li>Magic Initiate (Cleric)</li>
<li>Skilled</li>
<li>Resourceful (mark Heroic Inspiration after each Long Rest)</li>
<li>Insight, Religion, Perception, Medicine, Survival, Persuasion, Calligrapher's Supplies</li>
</ul>
<p>That is a finished page-one Cleric. The name can wait until now. "Irella of the Open Temple" is enough.</p>

<h2>Use the combat boxes as a play checklist</h2>
<p>Once the example pattern is clear, every other class uses the same combat row.</p>
<p>Armor Class is a formula, not a guessed number. Unarmored is 10 + Dexterity modifier. Light armor adds Dexterity with no cap. Medium armor caps the Dexterity bonus at +2 and still applies a negative modifier. Heavy armor ignores Dexterity; Chain Mail, Splint, and Plate also list a Strength requirement. A Shield is +2 only with training.</p>
<p>Hit Points are a maximum, a current value, and a temporary value. Erase current HP in play. Do not lower the maximum unless a rule says so.</p>
<p>Initiative is the bonus added to the d20 at the start of combat, usually the Dexterity modifier. It is not the result of last session's roll. I have watched people copy last week's 17 onto this week's sheet and then argue with the DM about turn order. Write the bonus. Roll the die when combat starts.</p>
<p>Death saves stay blank until the character drops to 0 Hit Points. Three successes stabilize. Three failures kill the character. A roll of 20 on the d20 restores 1 Hit Point; a roll of 1 counts as two failures. Those rules live in the glossary. The sheet only tracks the circles.</p>
<p>Attacks should already include the bonus and the damage expression. Recalculating Strength + proficiency in the middle of a turn is how first-session combat stalls.</p>
<p>Spell DC and spell attack belong next to the spell list, not only in a notebook. If the character is not a spellcaster, skip the spell page instead of inventing slots.</p>

<h3>Update the dnd character sheet during play</h3>
<p>Pencil the values that change: current Hit Points, Temporary Hit Points, spent Hit Dice, spent spell slots, death-save circles, gold, and whether Heroic Inspiration is available. Leave scores, modifiers, Armor Class formulas, and class features in a more permanent hand until a level, feat, or magic item changes them. After the session, restore what a Long Rest restores, add XP or note the milestone, and rewrite any feature that gained a new use.</p>
<p>A digital VTT sheet does this math for you. A paper sheet does it only if you touch those boxes before you leave the table.</p>

<h2>Fix the mistakes that empty a first session</h2>
<ol>
<li>Starting at Character Name. The name does not generate AC. Class, origin, and scores do.</li>
<li>Adding the ability score to a d20. Strength 14 contributes +2, not +14. The 2024 sheet enlarges the modifier for that reason.</li>
<li>Adding proficiency to every line. Add Proficiency Bonus only where a rule grants proficiency: a listed skill, a class save, a trained weapon, a spell attack, or another named proficiency.</li>
<li>Using the 2014 fillable PDF for a 2024 character without relabeling. Race is not Species. Inspiration is not Heroic Inspiration. There is no Weapon Mastery line on the old form.</li>
<li>Stacking a 2014 race increase and a 2024 background increase. Use one character-creation ruleset. The races guide records the official compatibility path for older species.</li>
<li>Leaving Passive Perception, AC, and attack bonuses for "later." Those three numbers are the ones the DM asks for first.</li>
<li>Copying a digital builder into a paper sheet without checking the year. Export or transcribe only after the builder's rules version matches the table.</li>
</ol>

<h2>Finish the sheet, then make the character readable on the map</h2>
<p>Before session one, read the sheet out loud as if the DM asked for each line:</p>
<ul>
<li>handbook year</li>
<li>class, level, background, species</li>
<li>six scores and six modifiers</li>
<li>Proficiency Bonus</li>
<li>proficient saves and skills</li>
<li>AC, Initiative, Speed, HP maximum, Hit Dice</li>
<li>one weapon attack already totaled</li>
<li>spell save DC and spell attack if the class casts spells</li>
<li>Heroic Inspiration empty or marked according to Human Resourceful after a Long Rest</li>
</ul>
<p>The dnd character sheet is now a play document. The map still needs a face.</p>
<p>Open the <a href="${EN_EDITOR_PATH}">Token Maker editor</a> and upload a portrait as JPG, PNG, or WEBP up to 10 MB. Crop to the face or the strongest silhouette, choose a circle, square, or polygon mask, add a border that stays visible on a dark dungeon map, and export a transparent PNG at 256, 512, 1024, or 2048. The normal crop-and-export flow is local-first: the portrait can stay in the browser while you frame it. Drop the PNG into Roll20, Foundry VTT, or Owlbear and check it at the zoom the table actually uses.</p>
<p>If the portrait is wider than a circle, use the <a href="${EN_SQUARE_TOKEN_MAKER_PATH}">square token workflow</a>. If page two needs a faction mark or holy emblem, the <a href="${EN_COAT_OF_ARMS_MAKER_PATH}">Coat of Arms Maker</a> can supply a simple symbol for the Allies and Organizations box. Neither tool replaces the character sheet. They make the finished character visible.</p>

<h2>DnD character sheet FAQ</h2>
<h3>What is a D&amp;D character sheet?</h3>
<p>A D&amp;D character sheet is the form that records one player character: name, class, origin, ability scores, modifiers, skills, combat numbers, features, equipment, and spells. The 2024 rules treat paper, a digital builder, or plain notes as a character sheet as long as the details are there during play.</p>
<h3>Is there an official character sheet for Dungeons &amp; Dragons?</h3>
<p>Yes. Wizards of the Coast and D&amp;D Beyond publish official PDFs. The 2014 sheet is a fillable three-page PDF. The 2024 sheet is a two-page print PDF. D&amp;D Beyond also hosts premade printable packets and a digital character builder.</p>
<h3>How do you fill out a D&amp;D character sheet?</h3>
<p>Use the creation order in the approved handbook. For 2024: choose a class, determine background and species, generate and assign ability scores, choose an alignment, then fill AC, HP, attacks, and spells from those choices. Do not start at the name field.</p>
<h3>What is the difference between the 2014 and 2024 character sheets?</h3>
<p>The 2024 sheet is two pages, leads with ability modifiers, groups skills with their abilities, replaces Race with Species, replaces Inspiration with Heroic Inspiration, and adds space for Weapon Mastery. The 2014 sheet is three pages and still uses the older labels.</p>
<h3>What is the best D&amp;D character sheet?</h3>
<p>The best sheet is the official form that matches the table's rules year, filled in so combat numbers are already totaled. After that, pick paper, a fillable 2014 PDF, a print 2024 PDF, or a digital VTT sheet based on how the group plays, not on a universal ranking.</p>
<h3>Can I use a 2014 sheet in a 2024 game?</h3>
<p>Yes, if you relabel Race as Species, track Heroic Inspiration, and write Weapon Mastery and Origin feats into leftover space. A first-time player should use the 2024 form instead of translating boxes mid-session.</p>
<h3>Where do I download a fillable D&amp;D character sheet PDF?</h3>
<p>The official 2014 sheet is fillable. Download it from Wizards of the Coast. The official 2024 sheet is a print PDF on D&amp;D Beyond. Fan-made fillable 2024 files exist; they are not official Wizards forms.</p>
<h3>Do I need a digital character sheet for Roll20 or Foundry?</h3>
<p>No. A paper sheet plus a map token is enough. Many online tables prefer the VTT's built-in sheet because it rolls attacks from the same window. Export a Token Maker PNG either way so the figure on the grid matches the person on the sheet.</p>

<h2>Sources</h2>
<ul>
<li><a href="${DND_2024_CHARACTER_CREATION_URL}" rel="noreferrer noopener">D&amp;D Beyond: Creating a Character, 2024 Free Basic Rules</a></li>
<li><a href="${DND_2024_CHARACTER_ORIGINS_URL}" rel="noreferrer noopener">D&amp;D Beyond: Character Origins, 2024 Free Basic Rules</a></li>
<li><a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-classes" rel="noreferrer noopener">D&amp;D Beyond: Character Classes, 2024 Free Basic Rules</a></li>
<li><a href="${DND_2024_EQUIPMENT_URL}" rel="noreferrer noopener">D&amp;D Beyond: Equipment, 2024 Free Basic Rules</a></li>
<li><a href="${DND_2024_FEATS_URL}" rel="noreferrer noopener">D&amp;D Beyond: Feats, 2024 Free Basic Rules</a></li>
<li><a href="https://www.dndbeyond.com/resources/1779-d-d-character-sheets" rel="noreferrer noopener">D&amp;D Beyond: official character sheet downloads</a></li>
<li><a href="https://media.wizards.com/2016/dnd/downloads/5E_CharacterSheet_Fillable.pdf" rel="noreferrer noopener">Wizards of the Coast: 2014 fillable character sheet PDF</a></li>
<li><a href="https://media.dndbeyond.com/compendium-images/phb/downloads/DnD_2024_Character-Sheet.pdf" rel="noreferrer noopener">D&amp;D Beyond: 2024 character sheet PDF</a></li>
</ul>
`;

export const dndCharacterSheetArticleHtmlZh = String.raw`
<p>D&amp;D 角色卡是你真正拿来开局的那一页：角色是谁、六项属性、加到骰子上的调整值、战斗数字、特性、装备和法术。这些格子是空的、2014 和 2024 的标签写在同一行、或者职业还没选就开始从上往下填时，第一场游戏很容易卡住。</p>

<p>官方 2014 可填 PDF 现在仍容易下载，也能用。如果桌子上用的是 2024《玩家手册》，它就不是对的版式。按 2024 创角顺序填：职业、出身、属性值、阵营，再填剩下的数字。每个战斗栏都应该能追到你已经做过的选择。本文以 <a href="${DND_2024_CHARACTER_CREATION_URL}" rel="noreferrer noopener">2024 免费基础规则</a> 为准，并在纸质表格仍写着旧词的地方标出 2014 差异。</p>

<h2>先选对和桌面年份匹配的官方角色卡</h2>
<p>先在页顶写 <code>5e (2014)</code> 或 <code>5.5e (2024)</code>，再写名字。这一行会决定格子是种族还是物种、是激励还是英勇激励，以及攻击栏里要不要留武器精通。桌子还没定年份时，先看 <a href="${ZH_PLAYERS_HANDBOOK_DND_5E_PATH}">玩家手册版本指南</a>。</p>

<table><thead><tr><th scope="col">你需要什么</th><th scope="col">官方文件</th><th scope="col">格式</th><th scope="col">什么时候用</th></tr></thead><tbody>
<tr><th scope="row">2014 / 旧 5e 表格</th><td><a href="https://media.wizards.com/2016/dnd/downloads/5E_CharacterSheet_Fillable.pdf" rel="noreferrer noopener">可填第五版角色卡（PDF）</a></td><td>三页，表单字段</td><td>战役用 2014 职业、种族加属性，以及旧版版式</td></tr>
<tr><th scope="row">2024 / 5.5e 表格</th><td><a href="https://media.dndbeyond.com/compendium-images/phb/downloads/DnD_2024_Character-Sheet.pdf" rel="noreferrer noopener">2024 角色卡（PDF）</a></td><td>两页，打印手写</td><td>战役用 2024 物种、背景、英勇激励和武器精通</td></tr>
<tr><th scope="row">可直接开玩的示例</th><td><a href="https://www.dndbeyond.com/resources/1779-d-d-character-sheets" rel="noreferrer noopener">D&amp;D Beyond 角色卡下载</a></td><td>打包好的预制 PDF</td><td>今晚就要一个合法预制角色，而不是空白表</td></tr>
</tbody></table>

<p>官方 2024 PDF 是打印文件，不是可填表单。纸团就打印出来用铅笔。浏览器开团的话，D&amp;D Beyond 或 Roll20 这类 VTT 里的电子卡，在 2024 规则里也算角色卡。Token Maker 不帮你填这些格子。它是在数字写完之后，把角色画像裁成地图 Token。</p>

<p>不要对着搜索缩略图里随便一张“5e”表就开印。2014 表格仍写着种族（Race）。2024 表格写的是物种（Species）。标签混用时，2014 的种族加值会挨着 2024 的背景加值。</p>

<h2>写数字之前，先对照 2014 和 2024 角色卡</h2>
<p>两份官方表格记的都是同一套六项属性。2024 改版把你真正加到骰子上的那个数字放大了。</p>

<table><thead><tr><th scope="col">桌上要用的内容</th><th scope="col">2014 官方角色卡</th><th scope="col">2024 官方角色卡</th></tr></thead><tbody>
<tr><th scope="row">血统标签</th><td>种族（Race）</td><td>物种（Species）</td></tr>
<tr><th scope="row">属性怎么排</th><td>属性值大、调整值小</td><td>调整值大、属性值写在旁边</td></tr>
<tr><th scope="row">技能</th><td>一整列技能清单</td><td>技能跟对应属性放在一起</td></tr>
<tr><th scope="row">激励</th><td>激励勾选框</td><td>英勇激励</td></tr>
<tr><th scope="row">攻击</th><td>攻击与施法区块</td><td>武器和伤害戏法，并留武器精通</td></tr>
<tr><th scope="row">法术页</th><td>可选第三页</td><td>法术记录压进两页表</td></tr>
<tr><th scope="row">个性</th><td>大块特质 / 理想 / 牵绊 / 缺点</td><td>角色扮演空间变小，机制占首页</td></tr>
<tr><th scope="row">页数</th><td>三页（第 3 页是法术）</td><td>两页</td></tr>
</tbody></table>

<img class="inline-article-image" src="${DND_CHARACTER_SHEET_INLINE_IMAGE_PATH}" alt="桌上两份无字角色卡，左边是偏旧的多页表，右边是更薄的两页表，旁边有圆形肖像 Token 和小型钉头锤" loading="lazy" decoding="async" fetchpriority="low" width="1536" height="1024" />

<p>2014 桌子继续用 2014 表格没问题。不少团在 2024 规则里仍拿旧表，把新词手写进空白处。这个办法只有你已经知道哪些格子改过时才稳。第一次填卡，用和手册年份匹配的那张。</p>

<p>网上流传最广的讲解，多数还是对着三页旧表。所以 JoCat 那条 2014 向的漫画讲解适合当地图，不适合当 2024 配方。<a href="${DND_CHARACTER_SHEET_VIDEO_URL}" rel="noreferrer noopener"><em>A Crap Guide to D&amp;D [5th Edition] - Character Sheet</em></a> 讲的是旧版上的属性、调整值、技能、熟练、战斗和攻击。用它认 2014 的页。然后回到下面的 2024 填写顺序。视频会在按下播放后才加载。</p>

${liteVideoEmbed(DND_CHARACTER_SHEET_VIDEO_ID, 'JoCat：2014 第五版角色卡讲解', {
  src: DND_CHARACTER_SHEET_VIDEO_PLACEHOLDER_PATH,
  alt: '展开的空白角色卡、铅笔和青色二十面骰，暖灯下准备观看 2014 角色卡讲解视频',
})}

<p>JoCat，<em>A Crap Guide to D&amp;D [5th Edition] - Character Sheet</em>（2014 第五版角色卡）。用来认旧表。不要把里面的种族和激励标签抄到 2024 角色上。</p>

<h2>按 2024 创角顺序填，不要从上往下填</h2>
<p>2024 免费基础规则给了五步。把每一步映射到格子上。不要因为“角色名”印在最上面，就从那里开始。</p>

<h3>1. 选职业，写下等级</h3>
<p>写职业、等级和 XP。新角色是 1 级、0 XP。从职业条目抄护甲训练、武器熟练、豁免熟练和职业技能列表。护甲等级、生命值和攻击加值先空着，等属性出来再填。这些格子看起来很急，其实还没到填的时候。</p>
<p>职业还会点出一项主要属性。后面分配属性时，先保住这一项。还没选定职业的话，看 <a href="${ZH_DND_CLASSES_PATH}">DND 职业指南</a>。</p>

<h3>2. 确定出身：背景、物种、语言</h3>
<p>2024 的出身是背景加物种，不是 2014 那种种族再叠背景。</p>
<p>从背景记下：</p>
<ul>
<li>列出的三项属性（第 3 步里只有这三项能加）</li>
<li>出身专长</li>
<li>两项技能熟练和一项工具熟练</li>
<li>起始装备选项 A 或 B</li>
</ul>
<p>从物种记下体型、速度、生物类型，以及每一条物种特质。2024 核心规则里，物种不加属性值。<a href="${ZH_DND_RACES_PATH}">DND 种族与物种指南</a> 写了 2014 的边界。</p>
<p>然后写语言。2024 角色会通用语，再加上标准语言表里的两种；职业或特性另给的再加。第二语言按战役需要选，不要只因为名字好听。<a href="${ZH_DND_LANGUAGES_PATH}">DND 语言指南</a> 适合做这个选择。</p>

<h3>3. 定属性值，再写调整值</h3>
<p>按 DM 指定的方法生成六个数字：标准数组 <code>15, 14, 13, 12, 10, 8</code>；随机则是 4d6 取最高三个、做六次；或者 27 点购点。桌子用随机生成时，到 <a href="${ZH_DICE_ROLLER_PATH}">DND 骰子工具</a> 用 4d6 去掉最低的预设跑六次，再回到这一页把总和放进格子。</p>
<p>把六个数字分给力量、敏捷、体质、智力、感知、魅力。最高的那个给职业主要属性。然后套背景调整：列出的三项里，一项 +2、另一项 +1，或者三项各 +1，任何一项都不能超过 20。</p>
<p>每个属性旁边写调整值：</p>
<p><code>调整值 = floor((属性值 - 10) / 2)</code></p>
<p>完整分配过程在 <a href="${ZH_DND_STATS_PATH}">DND 属性指南</a>。角色卡这一步要的是已经写进格子的调整值，不是再排一次六项属性的重要性。</p>
<p>1 级熟练加值是 +2。职业豁免，以及职业、背景、物种或专长给的技能，把熟练圈涂黑。每一行技能或豁免的数字：有熟练就是调整值 + 熟练加值，没有熟练就只写调整值。</p>

<h3>4. 选阵营</h3>
<p>写下九种阵营之一。2024 规则把它当成伦理速记，不是每句话的锁。<a href="${ZH_DND_ALIGNMENT_CHART_PATH}">阵营表指南</a> 适合把这个选择压一压。D&amp;D 默认玩家角色不是邪恶；写邪恶阵营前先问 DM。</p>

<h3>5. 用前面的选择填完剩下的数字</h3>
<p>到这里，页眉那些格子才说得通，包括角色名。接着填：</p>
<ul>
<li>被动察觉 = 10 + 感知（察觉）检定调整值，有熟练就算上熟练。</li>
<li>生命值上限来自 1 级生命值职业表：牧师、吟游诗人、德鲁伊、武僧、游荡者和契术师用 <code>8 + 体质调整值</code>；战士、圣武士和游侠用 <code>10 + 体质调整值</code>；野蛮人用 <code>12 + 体质调整值</code>；术士和法师用 <code>6 + 体质调整值</code>。</li>
<li>生命骰：1 级一颗，骰面跟职业走。</li>
<li>先攻：通常是敏捷调整值，除非有特性另说。</li>
<li>护甲等级：没穿甲是 10 + 敏捷调整值；否则用所穿护甲的公式。有盾牌训练并且正在用盾，再 +2。</li>
<li>攻击：熟练的近战武器一般是力量调整值 + 熟练加值，除非武器属性另有规定。伤害是武器骰加上同一个属性调整值。</li>
<li>施法：法术豁免 DC = <code>8 + 施法属性调整值 + 熟练加值</code>。法术攻击加值 = 施法属性调整值 + 熟练加值。戏法、已准备法术和法术位数量从职业表抄。</li>
<li>特性与特质：职业特性、物种特质、出身专长，以及其他具名特性。写摘要和来源就够，不要把整本规则抄进格子。</li>
</ul>
<p>第二页放外貌、背景故事、盟友、额外特性和财宝。等第一页战斗栏写完再填。空白的背景故事挡不了开团。空白的护甲等级会。</p>

<h2>用 1 级人类侍僧牧师走一遍</h2>
<p>这个例子用 2024 免费基础规则：牧师 1 级、侍僧背景、人类物种、标准数组、奇术师（Thaumaturge）神圣职阶。这是一个合法角色，不是规定牧师必须这样。</p>
<p>页顶写：<code>5.5e (2024) · 牧师 1 · 侍僧 · 人类</code>。</p>

<h3>页眉和出身</h3>
<table><thead><tr><th scope="col">格子</th><th scope="col">填写</th></tr></thead><tbody>
<tr><th scope="row">职业与等级</th><td>牧师 1</td></tr>
<tr><th scope="row">背景</th><td>侍僧</td></tr>
<tr><th scope="row">物种</th><td>人类（中型）</td></tr>
<tr><th scope="row">阵营</th><td>中立善良</td></tr>
<tr><th scope="row">XP</th><td>0</td></tr>
<tr><th scope="row">速度</th><td>30 尺</td></tr>
<tr><th scope="row">体型</th><td>中型</td></tr>
<tr><th scope="row">熟练加值</th><td>+2</td></tr>
</tbody></table>

<p>侍僧给魔法导师（牧师）出身专长、洞悉和宗教、书法工具，以及装备选项 A：书法工具、祈祷书、圣徽、10 张羊皮纸、长袍、8 GP。牧师装备选项 A 再加链甲衫、盾牌、钉头锤、圣徽、祭司背包和 7 GP。两套都记上。不要买第二件链甲衫。</p>
<p>人类特质要抄：足智多谋（每次长休后获得英勇激励）、熟练（多一项技能）、多才多艺（一项出身专长；列出的推荐是熟练专长 Skilled）。这个例子从“熟练”拿察觉，再用 Skilled 拿医药、生存和游说。</p>
<p>语言：通用语，再加上标准语言表里的两种。这个例子用通用语、精灵语和矮人语。</p>

<h3>属性值</h3>
<p>牧师标准数组建议，再加侍僧的感知 +2、体质 +1：</p>
<table><thead><tr><th scope="col">属性</th><th scope="col">数组</th><th scope="col">侍僧之后</th><th scope="col">调整值</th></tr></thead><tbody>
<tr><th scope="row">力量</th><td>14</td><td>14</td><td>+2</td></tr>
<tr><th scope="row">敏捷</th><td>8</td><td>8</td><td>−1</td></tr>
<tr><th scope="row">体质</th><td>13</td><td>14</td><td>+2</td></tr>
<tr><th scope="row">智力</th><td>10</td><td>10</td><td>+0</td></tr>
<tr><th scope="row">感知</th><td>15</td><td>17</td><td>+3</td></tr>
<tr><th scope="row">魅力</th><td>12</td><td>12</td><td>+1</td></tr>
</tbody></table>
<p>豁免：牧师熟练感知和魅力。</p>
<table><thead><tr><th scope="col">豁免</th><th scope="col">算法</th><th scope="col">加值</th></tr></thead><tbody>
<tr><th scope="row">力量</th><td>+2</td><td>+2</td></tr>
<tr><th scope="row">敏捷</th><td>−1</td><td>−1</td></tr>
<tr><th scope="row">体质</th><td>+2</td><td>+2</td></tr>
<tr><th scope="row">智力</th><td>+0</td><td>+0</td></tr>
<tr><th scope="row">感知</th><td>+3 + 2</td><td>+5</td></tr>
<tr><th scope="row">魅力</th><td>+1 + 2</td><td>+3</td></tr>
</tbody></table>
<p>已标记熟练的技能：</p>
<table><thead><tr><th scope="col">技能</th><th scope="col">来源</th><th scope="col">加值</th></tr></thead><tbody>
<tr><th scope="row">洞悉（感知）</th><td>侍僧</td><td>+5</td></tr>
<tr><th scope="row">宗教（智力）</th><td>侍僧</td><td>+2</td></tr>
<tr><th scope="row">察觉（感知）</th><td>人类 Skillful</td><td>+5</td></tr>
<tr><th scope="row">医药（感知）</th><td>Skilled</td><td>+5</td></tr>
<tr><th scope="row">生存（感知）</th><td>Skilled</td><td>+5</td></tr>
<tr><th scope="row">游说（魅力）</th><td>Skilled</td><td>+3</td></tr>
</tbody></table>
<p>被动察觉 = 10 + 5 = 15。</p>

<h3>战斗栏</h3>
<p>生命值上限 = 8 + 体质调整值 = 10。生命骰 = 1d8。当前生命值从 10 开始。临时生命值先空着。死亡豁免圈也先空着。</p>
<p>护甲等级：链甲衫是 <code>13 + 敏捷调整值（最多 2）</code>。敏捷 −1 仍要算，所以衣服是 12。牧师有盾牌训练，盾牌再 +2。最终护甲等级 = 14。</p>
<p>先攻 = −1。</p>
<p>钉头锤：1d6 钝击，近战。攻击加值 = 力量 +2 + 熟练 +2 = +4。伤害 = 1d6 + 2。2024 武器表里钉头锤有削弱（Sap）精通。1 级牧师没有武器精通，精通格先空着，除非后面有特性给它。</p>
<p>施法属性：感知。法术豁免 DC = 8 + 3 + 2 = 13。法术攻击加值 = +5。从职业条目抄三个牧师戏法和四个已准备的 1 环牧师法术。免费基础规则建议戏法用神导术、神圣火焰和奇术，已准备法术用祝福术、疗伤术、光导箭和虔诚护盾。1 环法术位数量从牧师特性表抄到角色卡上；1 级牧师有两个 1 环法术位。</p>
<p>奇术师额外给一个牧师戏法，并在智力（奥秘）或智力（宗教）检定上加上感知调整值。宗教已经因为熟练是 +2。特性适用时再加奇术师的 +3，这次宗教检定就是 +5。</p>
<p>魔法导师（牧师）再给两个牧师戏法，以及一个你始终准备着的 1 环牧师法术。这个法术可以不占法术位施放一次，长休后恢复。把选中的法术名写进特性栏，免得它埋在职业已准备名单里。</p>

<h3>开局要能看见的特性</h3>
<ul>
<li>施法与神圣职阶（奇术师）</li>
<li>魔法导师（牧师）</li>
<li>Skilled</li>
<li>足智多谋（每次长休后标记英勇激励）</li>
<li>洞悉、宗教、察觉、医药、生存、游说、书法工具</li>
</ul>
<p>这就是一张填完的第一页牧师。名字可以等到现在再写。“开庙的艾瑞拉”够用了。</p>

<h2>把战斗栏当成开局清单</h2>
<p>例子看懂之后，别的职业也是同一行战斗栏。</p>
<p>护甲等级是公式，不是猜的数字。没穿甲是 10 + 敏捷调整值。轻甲加敏捷，没有上限。中甲把敏捷加值上限卡在 +2，负调整值照样算。重甲不算敏捷；链甲、板条甲和板甲还列了力量要求。盾牌只有在有训练时才是 +2。</p>
<p>生命值有上限、当前值和临时值。对局里擦的是当前生命值。没有规则说要降上限，就别改上限。</p>
<p>先攻是战斗开始时加到 d20 上的加值，通常是敏捷调整值。它不是上周那次掷骰的结果。我见过有人把上周的 17 抄到这周的卡上，再跟 DM 争回合顺序。卡上写加值。战斗开始再掷骰。</p>
<p>死亡豁免在生命值掉到 0 之前都空着。三次成功稳住。三次失败角色死亡。d20 掷出 20 恢复 1 点生命值；掷出 1 算两次失败。规则在术语表里。角色卡只记那些圈。</p>
<p>攻击栏里应已经写好加值和伤害表达式。回合做到一半再现场算力量 + 熟练，是第一场战斗拖住的常见原因。</p>
<p>法术 DC 和法术攻击写在法术列表旁边，不要只写在别的本子上。角色不会施法，就跳过法术页，别给自己编法术位。</p>

<h3>对局中更新角色卡</h3>
<p>会变的值用铅笔：当前生命值、临时生命值、已用生命骰、已用法术位、死亡豁免圈、金币，以及英勇激励现在有没有。属性值、调整值、护甲等级公式和职业特性用更固定的字迹，直到升级、专长或魔法物品改到它们。散场后，把长休会恢复的东西恢复，加上 XP 或记下里程碑，并改写获得新用途的特性。</p>
<p>电子 VTT 角色卡会帮你算。纸卡只有你离开桌子前真的改过那些格子，数字才是对的。</p>

<h2>修好会掏空第一场游戏的错误</h2>
<ol>
<li>从角色名开始填。名字不会生成护甲等级。职业、出身和属性会。</li>
<li>把属性值加到 d20 上。力量 14 贡献的是 +2，不是 +14。2024 表格把调整值放大，就是为这个。</li>
<li>每一行都加熟练。只有规则给了熟练才加熟练加值：列出的技能、职业豁免、受训武器、法术攻击，或其他具名熟练。</li>
<li>用 2014 可填 PDF 做 2024 角色，却不改标签。种族不是物种。激励不是英勇激励。旧表没有武器精通那一行。</li>
<li>把 2014 种族加值和 2024 背景加值叠在一起。只用一套创角规则。种族指南里有旧物种的官方兼容路径。</li>
<li>被动察觉、护甲等级和攻击加值留到“稍后”。DM 最先问的通常就是这三个数字。</li>
<li>从电子构筑器抄到纸卡，却没核对年份。导出或誊写前，先确认构筑器的规则版本和桌子一致。</li>
</ol>

<h2>角色卡填完，再让地图上的人能被认出来</h2>
<p>开团前，按 DM 会问的顺序把卡读出声：</p>
<ul>
<li>手册年份</li>
<li>职业、等级、背景、物种</li>
<li>六项属性值和六个调整值</li>
<li>熟练加值</li>
<li>已熟练的豁免和技能</li>
<li>护甲等级、先攻、速度、生命值上限、生命骰</li>
<li>至少一项已经算好的武器攻击</li>
<li>职业会施法的话，法术豁免 DC 和法术攻击</li>
<li>英勇激励是空的，还是按人类足智多谋在长休后标记了</li>
</ul>
<p>角色卡现在是一份能开玩的文件。地图上还需要一张脸。</p>
<p>打开 <a href="${ZH_EDITOR_PATH}">Token Maker 编辑器</a>，上传 JPG、PNG 或 WEBP 肖像，最大 10 MB。裁到脸或最清楚的轮廓，选圆形、方形或多边形遮罩，加一条在黑暗地城地图上仍能看清的边框，再导出 256、512、1024 或 2048 的透明 PNG。常规裁切和导出是本地优先：画像可以留在浏览器里，边框边看。把 PNG 放到 Roll20、Foundry VTT 或 Owlbear 上，用桌子真正会用的缩放检查一次。</p>
<p>肖像比圆形更宽时，用 <a href="${ZH_SQUARE_TOKEN_MAKER_PATH}">方形 Token 流程</a>。第二页需要阵营标记或圣徽时，<a href="${ZH_COAT_OF_ARMS_MAKER_PATH}">纹章制作器</a> 可以给盟友与组织栏提供一个简单符号。这两个工具都不替代角色卡。它们只是让填完的角色在地图上看得见。</p>

<h2>DND 角色卡常见问题</h2>
<h3>什么是 D&amp;D 角色卡？</h3>
<p>D&amp;D 角色卡记录一名玩家角色：名字、职业、出身、属性值、调整值、技能、战斗数字、特性、装备和法术。2024 规则里，纸卡、电子构筑器或普通笔记都可以当角色卡，只要开局时这些细节在。</p>
<h3>龙与地下城有官方角色卡吗？</h3>
<p>有。威世智和 D&amp;D Beyond 发布官方 PDF。2014 角色卡是三页可填 PDF。2024 角色卡是两页打印 PDF。D&amp;D Beyond 还有预制打印包和电子角色构筑器。</p>
<h3>D&amp;D 角色卡怎么填？</h3>
<p>按获准手册里的创角顺序。2024：先选职业，再定背景和物种，生成并分配属性值，选阵营，然后用这些选择填写护甲等级、生命值、攻击和法术。不要从名字栏开始。</p>
<h3>2014 和 2024 角色卡有什么区别？</h3>
<p>2024 角色卡是两页，调整值放在显眼位置，技能跟对应属性放在一起，种族改成物种，激励改成英勇激励，并留了武器精通。2014 角色卡是三页，仍用旧标签。</p>
<h3>最好的 D&amp;D 角色卡是哪一种？</h3>
<p>最好的是和桌子规则年份匹配的官方表格，并且战斗数字已经算完。然后按团怎么玩，在纸卡、2014 可填 PDF、2024 打印 PDF 或 VTT 电子卡之间选，而不是找一个通用第一名。</p>
<h3>2024 规则能用 2014 角色卡吗？</h3>
<p>能，只要把种族改标成物种，追踪英勇激励，并把武器精通和出身专长写进空白处。第一次填卡的人应直接用 2024 表格，不要在开局过程中现场翻译格子。</p>
<h3>去哪里下载可填的 D&amp;D 角色卡 PDF？</h3>
<p>官方 2014 角色卡可填，从威世智下载。官方 2024 角色卡是 D&amp;D Beyond 上的打印 PDF。民间有可填的 2024 文件，它们不是威世智官方表格。</p>
<h3>在 Roll20 或 Foundry 必须用电子角色卡吗？</h3>
<p>不必。纸卡加地图 Token 就够。很多线上桌子更喜欢 VTT 自带角色卡，因为攻击可以从同一个窗口掷。无论用哪种卡，都导出一份 Token Maker 的 PNG，让格子上的人跟卡上的人是同一个。</p>

<h2>来源</h2>
<ul>
<li><a href="${DND_2024_CHARACTER_CREATION_URL}" rel="noreferrer noopener">D&amp;D Beyond：创建角色，2024 免费基础规则</a></li>
<li><a href="${DND_2024_CHARACTER_ORIGINS_URL}" rel="noreferrer noopener">D&amp;D Beyond：角色出身，2024 免费基础规则</a></li>
<li><a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-classes" rel="noreferrer noopener">D&amp;D Beyond：角色职业，2024 免费基础规则</a></li>
<li><a href="${DND_2024_EQUIPMENT_URL}" rel="noreferrer noopener">D&amp;D Beyond：装备，2024 免费基础规则</a></li>
<li><a href="${DND_2024_FEATS_URL}" rel="noreferrer noopener">D&amp;D Beyond：专长，2024 免费基础规则</a></li>
<li><a href="https://www.dndbeyond.com/resources/1779-d-d-character-sheets" rel="noreferrer noopener">D&amp;D Beyond：官方角色卡下载</a></li>
<li><a href="https://media.wizards.com/2016/dnd/downloads/5E_CharacterSheet_Fillable.pdf" rel="noreferrer noopener">威世智：2014 可填角色卡 PDF</a></li>
<li><a href="https://media.dndbeyond.com/compendium-images/phb/downloads/DnD_2024_Character-Sheet.pdf" rel="noreferrer noopener">D&amp;D Beyond：2024 角色卡 PDF</a></li>
</ul>
`;
