import {
  DND_WIZARD_SPELLS_CHARACTER_IMAGE_PATHS,
  DND_WIZARD_SPELLS_COVER_PATH,
} from './shared';

const WIZARD_SPELL_IMAGE_PLACEHOLDERS = [
  '__WIZARD_COVER__',
  '__WIZARD_CHARACTER_STUDY__',
  '__WIZARD_CHARACTER_FOCUS__',
  '__WIZARD_CHARACTER_READY__',
] as const;

type WizardSpellImagePlaceholder = (typeof WIZARD_SPELL_IMAGE_PLACEHOLDERS)[number];

const WIZARD_SPELL_IMAGE_PATHS: Record<WizardSpellImagePlaceholder, string> = {
  __WIZARD_COVER__: DND_WIZARD_SPELLS_COVER_PATH,
  __WIZARD_CHARACTER_STUDY__: DND_WIZARD_SPELLS_CHARACTER_IMAGE_PATHS.study,
  __WIZARD_CHARACTER_FOCUS__: DND_WIZARD_SPELLS_CHARACTER_IMAGE_PATHS.focus,
  __WIZARD_CHARACTER_READY__: DND_WIZARD_SPELLS_CHARACTER_IMAGE_PATHS.ready,
};

function countSubstringOccurrences(haystack: string, needle: string) {
  if (needle.length === 0) {
    throw new Error(`Cannot count occurrences of an empty needle in wizard spell HTML.`);
  }

  return haystack.split(needle).length - 1;
}

function bindWizardSpellImagePlaceholders(
  lockedHtml: string,
  imagePathByPlaceholder: Record<WizardSpellImagePlaceholder, string>,
) {
  if (typeof lockedHtml !== 'string' || lockedHtml.length === 0) {
    throw new Error(
      `Wizard spell locked HTML must be a nonempty string, received: ${JSON.stringify(lockedHtml)}`,
    );
  }

  let boundHtml = lockedHtml;

  for (const placeholder of WIZARD_SPELL_IMAGE_PLACEHOLDERS) {
    const imagePath = imagePathByPlaceholder[placeholder];
    if (typeof imagePath !== 'string' || imagePath.length === 0) {
      throw new Error(
        `Wizard spell image path for ${placeholder} must be a nonempty string, received: ${JSON.stringify(imagePath)}`,
      );
    }

    const occurrenceCount = countSubstringOccurrences(boundHtml, placeholder);
    if (occurrenceCount !== 1) {
      throw new Error(
        `Wizard spell locked HTML must contain ${placeholder} exactly once, received count: ${occurrenceCount}`,
      );
    }

    boundHtml = boundHtml.replaceAll(placeholder, imagePath);
  }

  const leftoverPlaceholderMatch = boundHtml.match(/__WIZARD_[A-Z0-9_]+__/);
  if (leftoverPlaceholderMatch) {
    throw new Error(
      `Wizard spell HTML still contains placeholder ${leftoverPlaceholderMatch[0]} after image path binding.`,
    );
  }

  return boundHtml;
}

const dndWizardSpellsLockedEnglishHtml = String.raw`
<p><strong>dnd wizard spells</strong> on a legal sheet are the prepared names you take from your spellbook for the handbook year your table actually uses, not a paste of every Wizard row in a mixed catalog. In 2014 you prepare a number of those spells equal to your Intelligence modifier plus your Wizard level (minimum one), and in 2024 you prepare the number in the Prepared Spells column instead: four at level 1, six at level 3. Write 2014 or 2024 at the top of the card, count three numbers (spellbook known, prepared today, and slots), then pick names.</p>
<p>If the year is wrong, Sleep is the wrong spell, the prepare count is the wrong size, and a ritual you thought was free may still need the book in your hands. The rest of this page is that morning procedure for levels 1 and 3, using names that appear in the 2014 Basic Rules Wizard text or the 2024 Free Rules Wizard tables.</p>
<figure class="inline-figure inline-figure--wide-crop">
  <img class="inline-figure__image inline-figure__image--wide" src="__WIZARD_COVER__" alt="Single original adult wizard character in deep blue robes against a simple dark background with one hand raised" width="1364" height="768" />
  <figcaption>Wizard character portrait for this spell preparation guide.</figcaption>
</figure>
<h2>Write 2014 or 2024 on the card before any Wizard name</h2>
<p>Ask which book is in force before you write a single name. The <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes#WizardSpellcasting" rel="noreferrer noopener">2014 Basic Rules Wizard Spellcasting</a> section and the <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Level1WizardSpellcasting" rel="noreferrer noopener">2024 Free Rules Wizard Spellcasting</a> section both use Intelligence and both let you mix any spell levels you have slots for. They do not use the same prepare count, they do not treat Sleep the same way, and a 2024 Wizard does not rebuild the list the same way a 2014 Wizard times the morning study.</p>
<p>If you still need to choose the handbook itself, use the <a href="/blog/players-handbook-dnd-5e">Player’s Handbook year guide</a>. If you still need to pick a class, use the <a href="/blog/dnd-classes-explained">DND classes guide</a>.</p>
<h3>2014 Sleep is not 2024 Sleep</h3>
<p>Same name. Different spell. Lock the year before you copy Sleep onto a morning card.</p>
<table>
  <thead>
    <tr>
      <th>Detail</th>
      <th>2014 Sleep</th>
      <th>2024 Sleep</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Official block</td>
      <td><a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#Sleep" rel="noreferrer noopener">2014 Sleep</a></td>
      <td><a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#Sleep" rel="noreferrer noopener">2024 Sleep</a></td>
    </tr>
    <tr>
      <td>Range</td>
      <td>90 feet</td>
      <td>60 feet</td>
    </tr>
    <tr>
      <td>Shape / target rule</td>
      <td>20-foot radius; 5d8 hit-point pool, lowest current HP first</td>
      <td>5-foot-radius Sphere; Wisdom saves</td>
    </tr>
    <tr>
      <td>Duration</td>
      <td>1 minute</td>
      <td>Concentration, up to 1 minute</td>
    </tr>
    <tr>
      <td>Concentration listed</td>
      <td>Not listed</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td>What a second fail does</td>
      <td>Not that design; the pool spends hit points</td>
      <td>Unconscious for the duration after a second failed Wisdom save</td>
    </tr>
  </tbody>
</table>
<p>A 2014 Quick Build that includes Sleep is a legal starting pool for that year. It is not a 2024 list. Paste that Sleep onto a 2024 card and you spend your one concentration job on a different spell that happens to keep the same name.</p>
<h3>Do not mix Legacy catalog rows with 2024 rows</h3>
<p>A live D&amp;D Beyond Wizard filter can show a Legacy Acid Splash as Conjuration next to a current Acid Splash as Evocation. The 2024 Free Rules Wizard cantrip table lists Acid Splash as Evocation. The <a href="https://5thsrd.org/spellcasting/spell_lists/wizard_spells/" rel="noreferrer noopener">SRD 5.1 Wizard list</a> still lists Acid Splash as Conjuration. Both rows can be true for their year. Neither row is a reason to paste the whole catalog onto tonight’s prepared names.</p>
<p>Lock the year on the <a href="/blog/dnd-character-sheet">character sheet</a> first. Then copy from that year’s class text, not from a filter that still has Legacy in the name column.</p>
<h2>Count three things: spellbook, prepared, slots</h2>
<p>Wizard players get in trouble when they treat “spells I know,” “spells I prepared,” and “spell slots” as one pile. They are three counts. Rituals are a property of book names that skip a prepared line when the year rule is met, not a fourth pile. Cantrips are a side track: 2014 keeps them fixed in your mind, outside the book; 2024 lets you replace one Wizard cantrip from this feature after a Long Rest. Cantrips never enter the daily level 1+ prepared count.</p>
<figure class="inline-figure inline-figure--four-three-crop">
  <img class="inline-figure__image inline-figure__image--four-three" src="__WIZARD_CHARACTER_STUDY__" alt="Single adult wizard in deep blue robes against a simple dark background, studying with a contemplative gaze and hands held at chest height" width="1364" height="1023" />
  <figcaption>Adult wizard character study in deep blue robes on a plain dark backdrop.</figcaption>
</figure>
<h3>The spellbook is what you know</h3>
<p>At 1st level both years give you a spellbook containing six 1st-level Wizard spells of your choice. The book is the repository of the Wizard spells you know, except cantrips. Each time you gain a Wizard level, you add two Wizard spells of a level for which you have slots.</p>
<p>The 2024 text also describes the book as a Tiny object that weighs 3 pounds, contains 100 pages, and can be read only by you or someone casting Identify. The 2024 recommended six are Detect Magic, Feather Fall, Mage Armor, Magic Missile, Sleep, and Thunderwave. That list is a recommendation in the class text, not a required package, and it does not include Shield. If an example later wants Shield, it has to swap Shield into those six and say so.</p>
<p>When you find another level 1+ Wizard spell, both years let you copy it if it is a level you can prepare: 2 hours and 50 gp (2024 writes GP) per spell level. A backup of your own book is 1 hour and 10 gp per level. If the book is lost, you transcribe the Wizard spells you have prepared into a new book and then have to find the rest again. Those costs decide what is in the book. They do not change how many names you prepare tomorrow.</p>
<h3>2014 prepared uses Intelligence plus Wizard level</h3>
<p>The <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes#WizardSpellcasting" rel="noreferrer noopener">2014 Basic Rules Wizard Spellcasting</a> text says you prepare a number of Wizard spells from your spellbook equal to your Intelligence modifier + your Wizard level (minimum of one spell). The spells must be of a level for which you have spell slots. Casting a prepared spell does not remove it from the list. You can change the list when you finish a long rest. Preparing a new list takes at least 1 minute per spell level for each spell on it.</p>
<p>The same section works a level 3 example: four 1st-level slots, two 2nd-level slots, Intelligence 16, six prepared spells of 1st or 2nd level in any mix. That six is 3 (the modifier) + 3 (the Wizard level). It is not “six because a chart said six.”</p>
<h3>2024 prepared uses the Prepared Spells column</h3>
<p>The 2024 Free Rules <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#WizardClassFeatures" rel="noreferrer noopener">Wizard Features table</a> has a Prepared Spells column. You do not add Intelligence to Wizard level. At level 1 you choose four spells from your spellbook. The column then reads 5 at 2, 6 at 3, 7 at 4, and 9 at 5. The class text’s level 3 example is six spells of levels 1 and 2 in any mix, which matches the 6 in the table, not an Intelligence formula.</p>
<p>Whenever you finish a Long Rest, you can replace any of those prepared Wizard spells with other Wizard spells from the book that you have slots for. Always-prepared feature spells, when a later feature grants them, do not count against the column. At Wizard 5, Memorize Spell lets you study the book after a Short Rest and replace one prepared level 1+ Wizard spell with another from the book. That is one name, not a second full rebuild.</p>
<p>2024 also lets you replace one Wizard cantrip from this feature whenever you finish a Long Rest. Extra cantrips arrive at Wizard 4 and 10. 2014 knows three cantrips at 1st level and shows more on the Cantrips Known column as you climb. Still: cantrips never use the prepared count.</p>
<h3>Intelligence 14, 16, and 20 are not the same trap</h3>
<p>Do not write “2024 always prepares more.” Intelligence changes 2014. It does not change the 2024 column.</p>
<table>
  <thead>
    <tr>
      <th>Wizard level</th>
      <th>Int 14 (+2) 2014 / 2024</th>
      <th>Int 16 (+3) 2014 / 2024</th>
      <th>Int 20 (+5) 2014 / 2024</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>3 / 4</td>
      <td>4 / 4</td>
      <td>6 / 4</td>
    </tr>
    <tr>
      <td>3</td>
      <td>5 / 6</td>
      <td>6 / 6</td>
      <td>8 / 6</td>
    </tr>
    <tr>
      <td>5</td>
      <td>7 / 9</td>
      <td>8 / 9</td>
      <td>10 / 9</td>
    </tr>
  </tbody>
</table>
<p>At Wizard 1 with Intelligence 16, both years prepare four. At Wizard 1 with Intelligence 20, 2014 prepares six and 2024 still prepares four. At Wizard 5 the 2024 column is nine; 2014 is five plus the Intelligence modifier.</p>
<h3>Slots are the fuel, not the list</h3>
<p>Low-level slot shape matches across both years on the class tables: level 1 has two 1st-level slots; level 3 has four 1st-level and two 2nd-level; level 5 has four 1st, three 2nd, and two 3rd. A Long Rest restores slots. Arcane Recovery, both years, lets you recover expended slots on a Short Rest whose combined level is no more than half your Wizard level (round up), and none of them may be 6th level or higher. A 4th-level Wizard recovers two levels of slots. Recovery changes how many times you can cast. It does not change how many names you prepare in the morning.</p>
<h2>Rituals that skip the prepared line</h2>
<p>This is the Wizard-specific skip that catalogs leave out. Keep Detect Magic, Find Familiar, Identify, Alarm, and Unseen Servant from eating a counted prepared slot when the year allows a ritual from the book. A numerically legal prepared count that still spends a line on Detect Magic when the book already holds it is a failed morning list.</p>
<h3>2014: in the book is enough</h3>
<p>Under <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes#WizardSpellcasting" rel="noreferrer noopener">2014 Wizard Ritual Casting</a>, you can cast a Wizard spell as a ritual if it has the ritual tag and it is in your spellbook. You do not need to have it prepared.</p>
<h3>2024: in the book, and you must read it</h3>
<p><a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Level1WizardSpellcasting" rel="noreferrer noopener">2024 Ritual Adept</a> keeps the skip: ritual tag, in the spellbook, need not be prepared. The extra constraint is that you must read from the book. 2024 also lets you use the spellbook itself as a Spellcasting Focus, which is a one-line difference from the 2014 class text that did not name the book as a focus.</p>
<h3>Find Familiar stays a one-line ritual</h3>
<p><a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#FindFamiliar" rel="noreferrer noopener">2024 Find Familiar</a> is a level 1 Conjuration Wizard spell with the Ritual tag and a material cost. Put it in the book. Cast it as a ritual when the year rule is met. For forms, delivery, and the “can’t attack” combat block, use the <a href="/blog/dnd-find-familiar">Find Familiar guide</a>.</p>
<h2>Spend concentration once</h2>
<p>A list with the right count still fails if two openers share concentration. The <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spellcasting#Concentration" rel="noreferrer noopener">2014 Concentration</a> rule and the <a href="https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary#Concentration" rel="noreferrer noopener">2024 Concentration</a> glossary both limit you to one concentration spell at a time. Damage can force a Constitution saving throw to keep it; the save math lives on the <a href="/blog/dnd-constitution-guide">Constitution guide</a>. This section only budgets the morning card.</p>
<figure class="inline-figure inline-figure--four-three-crop">
  <img class="inline-figure__image inline-figure__image--four-three" src="__WIZARD_CHARACTER_FOCUS__" alt="Single adult wizard in deep blue robes against a simple dark background, focused with one hand raised at the chest" width="1364" height="1023" />
  <figcaption>Adult wizard in deep blue robes holding a focused casting pose on a plain dark backdrop.</figcaption>
</figure>
<h3>Shield, Mage Armor, and Magic Missile do not spend the ring</h3>
<p>The <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#Shield" rel="noreferrer noopener">2014 Shield</a> and <a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#Shield" rel="noreferrer noopener">2024 Shield</a> blocks are reactions that raise AC by 5, including against the triggering attack, and stop Magic Missile damage. Neither block uses concentration.</p>
<p><a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#MageArmor" rel="noreferrer noopener">2014 Mage Armor</a> and <a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#MageArmor" rel="noreferrer noopener">2024 Mage Armor</a> both set base AC to 13 + Dexterity for 8 hours on a willing creature not wearing armor. Neither spell block is concentration. The 2014 block lets you dismiss the spell as an action. The 2024 Free Rules block linked above does not include that dismiss sentence. Do not copy the dismiss clause onto 2024. For AC math and the dismiss split, use the <a href="/blog/dnd-mage-armor">Mage Armor guide</a>.</p>
<p><a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#MagicMissile" rel="noreferrer noopener">2014 Magic Missile</a> and <a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#MagicMissile" rel="noreferrer noopener">2024 Magic Missile</a> both fire three darts of 1d4+1 force damage with no attack roll in those blocks. Not concentration. Upcasting adds darts.</p>
<p>Those three names are a way to fill defense and force damage without touching the concentration ring. That bucket language is analysis for filling a legal count, not a class rule. Wizard has no Healing Word line on the Free Rules or Basic Rules lists cited above.</p>
<h3>2024 Sleep is the concentration trap with the familiar name</h3>
<p>If Sleep is the day’s opener on a 2024 card, Fog Cloud, Silent Image, and later Web stay off the live stack while Sleep is up. Point back to the year table above. Do not treat 2014 Sleep as a free non-concentration control name in 2024.</p>
<h3>Turn rules change combat, not the morning count</h3>
<p>In 2014, if you cast a bonus-action spell, the only other spell you can cast that turn is a cantrip with a casting time of 1 action (<a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spellcasting#CastingTime" rel="noreferrer noopener">2014 Casting Time</a>). In 2024, on your turn you can expend only one spell slot (<a href="https://www.dndbeyond.com/sources/dnd/br-2024/spells#OneSpellwithaSpellSlotperTurn" rel="noreferrer noopener">2024 one spell slot per turn</a>). Cantrips expend no slot. Those rules change how fights play. They do not change how many names you write after a Long Rest. For reaction timing on Counterspell, use the <a href="/blog/dnd-counterspell">Counterspell guide</a>.</p>
<h2>Two labeled legal lists: level 1 and level 3</h2>
<p><strong>Example.</strong> These cards show a legal shape, not a ranking. Every name appears in the 2014 Basic Rules Wizard material or the 2024 Free Rules Wizard tables cited above. Do not call them “best.”</p>
<h3>Example: level 1, both years</h3>
<p>Start with the book. Six 1st-level names. Three cantrips. Two 1st-level slots.</p>
<p><strong>Example — 2014, Wizard 1, Intelligence 16.</strong> Prepared count = 3 + 1 = 4. Spellbook uses the Quick Build pool as a legal starting set: Burning Hands, Charm Person, Feather Fall, Mage Armor, Magic Missile, Sleep. Prepared today: Mage Armor, Magic Missile, Sleep, Feather Fall. Shield is not in that Quick Build six, so it stays off this card until you copy it. Sleep is not concentration in the 2014 Sleep block linked above. Cantrips stay on the cantrip line (Quick Build suggests Mage Hand, Light, Ray of Frost). Rituals are not in that Quick Build six; add Detect Magic later by copying if you want the ritual skip. Slots: two 1st-level.</p>
<p>Same level, Intelligence 14: 2014 prepares only three. Same level, Intelligence 20: 2014 prepares six, the whole book, while 2024 still prepares four. That is the trap table on a real card.</p>
<p><strong>Example — 2024, Wizard 1, Intelligence 16.</strong> Prepared Spells column = 4. Start from the recommended six, then swap Shield in for Thunderwave so the defense reaction is on the card: Detect Magic, Feather Fall, Mage Armor, Magic Missile, Sleep, Shield. Prepared today: Mage Armor, Magic Missile, Shield, Sleep. Detect Magic and Feather Fall stay in the book; Detect Magic can still be cast as a ritual if you read from the book. Sleep is the concentration job. Cantrips: three Wizard cantrips; you may replace one after a Long Rest. Slots: two 1st-level.</p>
<p>If a cantrip needs to light objects on fire, use <a href="/blog/firebolt-dnd-5e">Fire Bolt</a>. Thunderclap’s push is on the <a href="/blog/dnd-thunderclap">Thunderclap page</a>.</p>
<h3>Example: level 3, both years</h3>
<p>Official shape both years: four 1st-level slots, two 2nd-level slots, six prepared spells of 1st or 2nd level in any mix when Intelligence is 16 in 2014 or when you read the 2024 column. Spellbook size if you only took free level-up adds: 6 + 2 + 2 = 10 names in the book, 6 prepared. That contrast is the point of the three-count lesson.</p>
<p>2014 Arcane Tradition arrives at level 2. 2024 subclass arrives at level 3. Free Rules Evocation Savant at 3 adds two Evocation Wizard spells no higher than level 2 into the book for free. Extra book names. Not extra prepared-column slots.</p>
<p><strong>Example — 2014, Wizard 3, Intelligence 16, School of Evocation taken at 2.</strong> Build the book so Shield is present: Burning Hands, Feather Fall, Mage Armor, Magic Missile, Sleep, Shield, Misty Step, Shatter, Detect Magic (ritual), Identify (ritual). That is ten names from free adds plus copying Shield in place of Charm Person.</p>
<table>
  <thead>
    <tr>
      <th>Line</th>
      <th>Contents</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Year</td>
      <td>2014</td>
    </tr>
    <tr>
      <td>Spellbook (10; rituals marked)</td>
      <td>Burning Hands; Feather Fall; Mage Armor; Magic Missile; Sleep; Shield; Misty Step; Shatter; Detect Magic (ritual); Identify (ritual)</td>
    </tr>
    <tr>
      <td>Prepared today (6)</td>
      <td>Mage Armor; Magic Missile; Shield; Sleep; Misty Step; Shatter</td>
    </tr>
    <tr>
      <td>Slots</td>
      <td>Four 1st-level, two 2nd-level</td>
    </tr>
    <tr>
      <td>Concentration for the fight</td>
      <td>None on this prepared six. 2014 Sleep is not concentration in the Sleep block linked above.</td>
    </tr>
    <tr>
      <td>Rituals not prepared</td>
      <td>Detect Magic, Identify (in the book; cast as rituals without preparing)</td>
    </tr>
  </tbody>
</table>
<p><strong>Example — 2024, Wizard 3, Intelligence 16, Evoker at 3.</strong> Prepared Spells column = 6. Book: Detect Magic, Feather Fall, Mage Armor, Magic Missile, Sleep, Shield (Shield swapped in for Thunderwave); free level-up adds Misty Step, Web, Mirror Image, and Invisibility; Evocation Savant then adds Thunderwave and Shatter into the book as free Evocation names of level 1 or 2. Book is larger than six. Prepared column stays six.</p>
<table>
  <thead>
    <tr>
      <th>Line</th>
      <th>Contents</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Year</td>
      <td>2024</td>
    </tr>
    <tr>
      <td>Spellbook (12; rituals marked)</td>
      <td>Detect Magic (ritual); Feather Fall; Mage Armor; Magic Missile; Sleep; Shield; Misty Step; Web; Mirror Image; Invisibility; Thunderwave; Shatter</td>
    </tr>
    <tr>
      <td>Prepared today (6)</td>
      <td>Mage Armor; Magic Missile; Shield; Misty Step; Shatter; Web</td>
    </tr>
    <tr>
      <td>Slots</td>
      <td>Four 1st-level, two 2nd-level</td>
    </tr>
    <tr>
      <td>Concentration for the fight</td>
      <td>Web only. Sleep stays in the book but is not prepared.</td>
    </tr>
    <tr>
      <td>Rituals not prepared</td>
      <td>Detect Magic (read from the book)</td>
    </tr>
  </tbody>
</table>
<figure class="inline-figure inline-figure--four-three-crop">
  <img class="inline-figure__image inline-figure__image--four-three" src="__WIZARD_CHARACTER_READY__" alt="Single adult wizard in deep blue robes against a simple dark background, standing ready with arms relaxed at his sides" width="1364" height="1023" />
  <figcaption>Adult wizard in deep blue robes standing ready on a plain dark backdrop.</figcaption>
</figure>
<p>When 3rd-level slots exist later, the same three-count method continues. For the reaction that ends a casting, open the <a href="/blog/dnd-counterspell">Counterspell guide</a>. For a 2nd-level blast that breaks objects, open <a href="/blog/dnd-shatter-5e">Shatter</a>.</p>
<p>Other class prepare patterns live on their own pages: <a href="/blog/dnd-cleric-spells">Cleric</a>, <a href="/blog/dnd-ranger-spells">Ranger</a>, <a href="/blog/dnd-bard-spells">Bard</a>, and <a href="/blog/paladin-2024-spells-dnd">Paladin 2024</a>.</p>
<h2>Check the card</h2>
<p>Before session one, run the card against this list. Pass means a reviewer can recompute every line from the year you wrote at the top.</p>
<ol>
  <li>Year is 2014 or 2024 at the top.</li>
  <li>Prepared count matches the 2014 formula (Intelligence modifier + Wizard level, minimum 1) or the 2024 Prepared Spells column for this Intelligence and level.</li>
  <li>Every prepared name is in the spellbook and of a slot level the table grants.</li>
  <li>Ritual-tagged names used without a slot follow that year’s book rule (2014: in the book; 2024: in the book and reading it).</li>
  <li>At most one concentration name among the names meant for the same fight.</li>
  <li>2024 only: the cantrip swap was used or skipped on purpose, and any ritual cast from the book is physically readable from the book.</li>
</ol>
<p>If you want a Wizard portrait for the VTT after the list is legal, that is a separate identity step on the editor, not part of counting slots.</p>
`;

const dndWizardSpellsLockedChineseHtml = String.raw`<p>开团前先在角色卡顶部写清：这桌用 2014 还是 2024。Wizard（法师）的准备数量、仪式条件和不少 1 环法术机制会随年份改变，不能拿一句“5e 通用”混着算。写完年份，把法术书、准备法术和法术位分成三栏，再按下一场的队伍缺口写出 1–3 级能上桌的低环清单。</p>
<p>低等级法师按“锁年份 → 拆三栏 → 写清单”走完即可上桌。还没选定职业的话，先看 <a href="https://www.tokenmaker.one/zh/blog/dnd-classes-explained">DND 职业怎么选</a>。</p>
<figure class="inline-figure inline-figure--cover">
  <img src="__WIZARD_COVER__" alt="单一成年 DND 法师人物，深蓝法袍，深色简洁背景，抬手准备施法" loading="eager" decoding="async" />
  <figcaption>本指南用法师角色肖像。</figcaption>
</figure>
<h2>先在卡顶写 2014 或 2024</h2>
<p>两套规则都叫 Wizard，准备数量却不是同一条公式。2014 看智力调整值加法师等级；2024 读职业表里的 Prepared Spells 列。完整规则分别在 <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes#Wizard" rel="noreferrer noopener">2014 Wizard 职业页</a> 和 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Wizard" rel="noreferrer noopener">2024 Wizard 职业页</a>。</p>
<p>卡顶年份一旦写错，后面的准备数、仪式条件和 Sleep 这类法术都会跟着错。先把年份当成输入，不要事后再猜。</p>
<table>
  <thead>
    <tr>
      <th>先核对的项目</th>
      <th>2014 Wizard</th>
      <th>2024 Wizard</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1 级法术书</td>
      <td>自选 6 个 1 环法师法术</td>
      <td>自选 6 个 1 环法师法术</td>
    </tr>
    <tr>
      <td>准备数量从哪来</td>
      <td>智力调整值 + 法师等级，至少 1</td>
      <td>职业表 Prepared Spells 列；1 级 4、2 级 5、3 级 6</td>
    </tr>
    <tr>
      <td>1 级时的法术位</td>
      <td>2 个 1 环</td>
      <td>2 个 1 环</td>
    </tr>
    <tr>
      <td>3 级时的法术位</td>
      <td>4 个 1 环、2 个 2 环</td>
      <td>4 个 1 环、2 个 2 环</td>
    </tr>
    <tr>
      <td>换准备法术</td>
      <td>长休后从法术书更换；每个法术至少按环级花 1 分钟研读</td>
      <td>长休后从法术书更换准备法术</td>
    </tr>
    <tr>
      <td>副职业节点</td>
      <td>2 级 Arcane Tradition</td>
      <td>3 级 Wizard Subclass</td>
    </tr>
  </tbody>
</table>
<p>智力 16 时，1 到 3 级的准备数字碰巧能对上 2024 职业表。这不能证明两套规则可以混用。智力 14 的 2014 法师 1 级只准备 3 个；智力 18 的 2014 法师 1 级准备 5 个。2024 的 1 级仍然是 4 个，不随智力加减。</p>
<h3>2014：法术书、智力准备数、长休换表</h3>
<p>2014 的 1 级法术书有 6 个自选 1 环法师法术。戏法另算，不写进书。每升一级，可免费往书里加 2 个法师法术，环阶不能超过当时已有的法术位。条文见 <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes#Wizard" rel="noreferrer noopener">2014 Wizard 职业页</a>。</p>
<p>准备数量 = 智力调整值 + 法师等级，至少 1。官方例子：3 级、智力 16，准备 6 个 1 环或 2 环，任意组合；当时法术位是 4 个 1 环加 2 个 2 环。施放不会把这个名字从准备法术里删掉。长休后可换整份准备法术，换表时要研读法术书，每个法术至少按环级花 1 分钟。</p>
<p>失败写法：把“书里有 6 个”抄成“今天准备 6 个”，或把“准备 6 个”抄成“有 6 个法术位”。2014 的 3 级法师在智力 16 时，准备栏是 6 个名字，施放资源仍是 4 + 2 个法术位。</p>
<h3>2024：读 Prepared Spells，不要套智力公式</h3>
<p>2024 的法术书同样从 6 个 1 环法师法术起手，之后每升一级加 2 个，环阶仍受已有法术位限制。准备数量不读智力。1 级先从书中选 4 个有对应法术位的法术；之后只看职业表 Prepared Spells 列：1 级 4、2 级 5、3 级 6。3 级官方例子同样是 6 个 1 环或 2 环任意组合，法术位是 4 个 1 环加 2 个 2 环。条文见 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Wizard" rel="noreferrer noopener">2024 Wizard 职业页</a>。</p>
<p>长休后可以从法术书替换准备法术。5 级才有 Memorize Spell：短休后只换一个 1 环及以上的准备法术名字，不能把整份准备栏重写；1–3 级卡仍以长休换表为准，也不要把这条抄回 2014。规则仍在同一页 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Wizard" rel="noreferrer noopener">2024 Wizard</a>。</p>
<p>失败写法：看见“智力 16”就自动加 3。2024 的 1 级仍然只准备 4 个。智力再高，也不靠这一列扩准备栏。</p>
<h3>版本陷阱：Sleep 在两版不是同一份作业</h3>
<p>只选一个短示范。Sleep 在两版都出现在官方起始建议里，机制却不能互抄。</p>
<p><a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#Sleep" rel="noreferrer noopener">2014 Sleep</a> 是 1 环惑控、动作、90 尺、持续 1 分钟。文本没有 Concentration。掷 5d8，按当前生命值从低到高让 20 尺内的生物陷入昏迷；受伤或被动作拍醒会结束。不死生物和免疫魅惑的目标不受影响。</p>
<p><a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#Sleep" rel="noreferrer noopener">2024 Sleep</a> 是 1 环惑控、动作、60 尺、专注最多 1 分钟。范围内 5 尺半径球里、由你选择的每个生物先做感知豁免，失败则失能到其下一回合结束并再豁一次；第二次失败才昏迷。受伤或 5 尺内有人用动作摇醒会结束。不睡觉的生物（例如精灵）或对力竭免疫的生物自动豁免成功。</p>
<p>把 2014 那套“不用专注、按生命值池催眠一片”写进 2024 卡，会同时错两件事：范围和目标算法变了，而且它会占掉今天唯一的专注栏。2024 若已经计划维持另一发专注，Sleep 应留在书里当替换项，不要和主专注一起开。</p>
<h2>把法术书、准备法术和法术位分成三栏</h2>
<p>中文桌面上最常见的混写是“准备了几个法术位”。三个词要分开放：法术书（Spellbook）是候选池，准备法术（Prepared Spells）是今天的准备栏，法术位（Spell Slots）是按环级消耗的施放次数。游侠一类职业的已知法术流程不能套到法师卡上。</p>
<h3>法术书是候选池，不是今天一定要放的名单</h3>
<p>1 级先往书写 6 个 1 环法师法术。之后每升一级加 2 个，环阶不能超过当前已有法术位。书里的名字是“已经学会、可以拿来准备或按仪式规则处理的候选”，不是开场必须全部施放的清单。</p>
<p><a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Wizard" rel="noreferrer noopener">2024 官方建议</a>的 1 环起手是 Detect Magic、Feather Fall、Mage Armor、Magic Missile、Sleep、Thunderwave。<a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes#Wizard" rel="noreferrer noopener">2014 快速建卡</a>写的是 Burning Hands、Charm Person、Feather Fall、Mage Armor、Magic Missile、Sleep。两份都是可以开始核对的候选，不是任何队伍都必须照抄的答案。</p>
<p>戏法（Cantrip）不进法术书，也不消耗 1 环法术位。2014 和 2024 的 1 级都是已知 3 个戏法。2024 建议 Light、Mage Hand、Ray of Frost。写卡时戏法单独一列，不要拿它去填准备数或法术位。</p>
<h3>准备法术是今天的准备栏，只从书里取能用的环阶</h3>
<p>2014 按智力调整值 + 等级取准备数；2024 按 Prepared Spells 列取准备数。两版都只能从法术书里挑，而且每个名字的环阶不能超过你当前拥有的法术位环阶。1 级没有 2 环位，就不能准备 Misty Step 或 Web。</p>
<p>准备 6 个不等于今天要放 6 次。准备栏上的名字可以反复用还没花完的法术位去施放。用 2 环位施放 1 环法术，也不会改写准备数量。</p>
<h3>法术位按环级花，施放不会擦掉准备法术</h3>
<p>1 级两版都是 2 个 1 环法术位。2 级变成 3 个 1 环。3 级是 4 个 1 环加 2 个 2 环。花掉一个 1 环位，准备栏上的 Mage Armor 还在；法术位用完，只是这环今天不能再放，不是把名字划掉。</p>
<p>检查实例：3 级、准备 6 个、法术位 4 + 2。你先用 1 环位放 Mage Armor，再用 2 环位升环放 Magic Missile。准备栏仍是 6 个名字，1 环位剩 3 个，2 环位剩 1 个。若有人把这一轮说成“还剩 4 个准备法术”，三栏已经并成一栏了。</p>
<figure class="inline-figure inline-figure--four-three-crop">
  <img class="inline-figure__image inline-figure__image--four-three" src="__WIZARD_CHARACTER_STUDY__" alt="单一成年法师人物，深蓝法袍，简洁深色背景，沉思凝视、双手置于胸前" loading="lazy" decoding="async" />
  <figcaption>深蓝法袍成年法师人物研读姿态。</figcaption>
</figure>
<h2>仪式法术什么时候可以不占准备栏</h2>
<p>法术书的价值有一块发生在开团前：有的名字可以按仪式规则施放，从而把准备栏让给战斗里真正要立刻按的按钮。只检查你书里带 Ritual 标签的那几发，以及这桌的年份条件。</p>
<h3>2014：带 Ritual 标签且在书中，不必准备</h3>
<p>2014 Wizard 可以把带仪式标签、且写在法术书里的法师法术当仪式施放，不必先准备。通用仪式和环阶字段见 <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells" rel="noreferrer noopener">2014 法术规则</a>；职业侧条件见 <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes#Wizard" rel="noreferrer noopener">2014 Wizard</a>。准备栏因此可以留给护盾、控场或非专注收尾，而不是把侦测类法术每天都钉死。</p>
<p>失败写法：书里没有 Detect Magic，却按“法师都会仪式侦测”开场。仪式条件绑的是这本具体的书，不是职业名。</p>
<h3>2024：Ritual Adept 必须从书里读</h3>
<p>2024 的 1 级 Ritual Adept 允许把书中带 Ritual 标签的法术当仪式施放，不必准备，但施放时必须从书中阅读。条文在 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Wizard" rel="noreferrer noopener">2024 Wizard 职业页</a>。把书留在营地、只带准备栏出门，这一条就失效。</p>
<p>2024 的 Detect Magic 仍是仪式，也仍要专注，最多 10 分钟，见 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#DetectMagic" rel="noreferrer noopener">2024 Detect Magic</a>。门口当仪式放可以；战斗里已经挂着另一发专注时，不要再开它。2014 同名法术同样是仪式与专注最多 10 分钟，见 <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#DetectMagic" rel="noreferrer noopener">2014 Detect Magic</a>。</p>
<h3>找寻魔宠只占一行，完整形态去另页</h3>
<p><a href="https://www.dndbeyond.com/spells/2097-find-familiar" rel="noreferrer noopener">2014 Find Familiar</a> 和 <a href="https://www.dndbeyond.com/spells/2618877-find-familiar" rel="noreferrer noopener">2024 Find Familiar</a> 都是 1 环、1 小时或仪式、10 尺。魔宠独立行动且不能攻击，100 尺内可心灵感应，并能传递接触法术。2024 借用感官改为附赠动作，传递接触使用反应。它是侦察和传递工具，不是第二个免费攻击单位。</p>
<p>下一场从先攻开始、没有 1 小时窗口，就不要指望当场仪式出一只新魔宠。需要形态、Help、接触法术和 Token 细节时，看站内 <a href="https://www.tokenmaker.one/zh/blog/dnd-find-familiar">找寻魔宠（Find Familiar）指南</a>。</p>
<h2>按下一场的职责选低环法术</h2>
<p>选择不是给法术名打分。先写下一场最怕发生什么，再决定哪一格准备栏回答这个问题。适用条件和跳过条件要一起写。无法回答“它解决哪件桌上的事”的名字，从准备栏拿掉，留在书里即可。</p>
<h3>防御或脱身：被命中、坠落或必须离开时怎么办</h3>
<p><a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#MageArmor" rel="noreferrer noopener">2014 Mage Armor</a> 和 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#MageArmor" rel="noreferrer noopener">2024 Mage Armor</a> 都是 1 环防护、触碰、持续 8 小时。自愿且未穿护甲的目标把基础 AC 变成 13 + 敏捷调整值；穿上护甲后结束。两版文本都没有 Concentration。适合检查“无甲法师今天要不要一套能撑整场的基础防御”。已经穿甲、或桌上另有稳定的基础 AC 公式，就跳过，把格子留给缺口。护甲叠加和盾牌裁定见 <a href="https://www.tokenmaker.one/zh/blog/dnd-mage-armor">法师护甲（Mage Armor）</a>。</p>
<p><a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#Shield" rel="noreferrer noopener">2014 Shield</a> 和 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#Shield" rel="noreferrer noopener">2024 Shield</a> 都是 1 环防护、反应、自身、持续 1 轮：被攻击命中或成为 Magic Missile 目标时使用，直到你的下一回合开始获得 +5 AC，并免疫这次 Magic Missile 伤害。它不占专注，但会消耗法术位，而且要写进今天的准备栏才能按。书里没有它，就不能靠“法师都会护盾”临时反应。</p>
<p><a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#FeatherFall" rel="noreferrer noopener">2014 Feather Fall</a> 和 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#FeatherFall" rel="noreferrer noopener">2024 Feather Fall</a> 都是 1 环变化、反应、60 尺、持续 1 分钟，可选最多 5 个正在坠落的生物。下一场没有竖井、断桥、飞龙或屋顶，就不必每天锁死这一格。</p>
<p>3 级拿到 2 环后，<a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#MistyStep" rel="noreferrer noopener">2014 Misty Step</a> 和 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#MistyStep" rel="noreferrer noopener">2024 Misty Step</a> 都是附赠动作、自身、瞬间传送最多 30 尺到可见未占空间。它不占专注，适合在已经维持一发控场之后离开夹击。1 级没有 2 环位，不能提前准备。</p>
<h3>控制或改变空间：限制目标，还是改地图</h3>
<p>先看目标会站在哪里，再看法术。小房间、门口和开阔平地不是同一张图。目标数量、施法动作和是否专注，都会改变它值不值得占一格。</p>
<p>Sleep 的两版差异见上一节：<a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#Sleep" rel="noreferrer noopener">2014 Sleep</a> 不占专注，可以和后续的 Web 思路错开；<a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#Sleep" rel="noreferrer noopener">2024 Sleep</a> 要专注，同一场只能把它当成“今日主控场”或替换项，不能和另一发专注控场叠开。</p>
<p><a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#Thunderwave" rel="noreferrer noopener">2014 Thunderwave</a> 和 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#Thunderwave" rel="noreferrer noopener">2024 Thunderwave</a> 都是 1 环塑能、动作、自身 15 尺立方、瞬间。体质豁免失败则受伤并被推开；成功则半伤且不被推开。它不占专注，适合推开贴身敌人；队友同立方会被扫到，贴身混战就跳过。</p>
<p>3 级以后，<a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#Web" rel="noreferrer noopener">2014 Web</a> 和 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#Web" rel="noreferrer noopener">2024 Web</a> 都是 2 环咒法、动作、60 尺、专注最多 1 小时，填满 20 尺立方黏网。网是困难地形；没有锚点时会塌。门口、走廊和有梁柱的房间适合；空旷无锚点，或满是喷火敌人的房间，就跳过。</p>
<h3>探索或仪式：离开战斗后队伍缺什么</h3>
<p>优先看书法术里带仪式标签的候选。Detect Magic 两版都是 1 环预言、仪式、自身、专注最多 10 分钟，用来感知 30 尺内的魔法。字段见 <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#DetectMagic" rel="noreferrer noopener">2014 Detect Magic</a> 与 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#DetectMagic" rel="noreferrer noopener">2024 Detect Magic</a>。书里有它，通常不必再占准备栏；下一场从先攻开始、又没有仪式时间，它就回答不了“立刻出手”的问题。</p>
<p>Find Familiar 已经在上一节。调查、门锁另一侧、需要远距离接触法术时，它值得进书；纯巷战、没有 1 小时窗口，就不要用它挤掉 Shield 或 Mage Armor。</p>
<h3>非专注回合按钮：主专注挂上之后还能做什么</h3>
<p>同一场计划同时开启的专注效果只留一个；通用规则见 <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spellcasting#Concentration" rel="noreferrer noopener">2014 Concentration</a> 与 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary#Concentration" rel="noreferrer noopener">2024 Concentration</a>。其余带专注的候选写成替换项。主专注挂上后，回合里还要有不重复该工作的按钮。</p>
<p><a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#MagicMissile" rel="noreferrer noopener">2014 Magic Missile</a> 和 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#MagicMissile" rel="noreferrer noopener">2024 Magic Missile</a> 都是 1 环塑能、动作、120 尺、瞬间：三发力场飞镖，各 1d4 + 1，同时命中，可选同一目标或分开。升环每高一环多一发。它不占专注，也不要求攻击检定。已经在维持 Web 或 2024 Sleep 时，它仍能作为收尾按钮。不要再准备第二个只解决同一问题的瞬间伤害法术来凑数。</p>
<p>Shield、Thunderwave、Misty Step 也都不靠专注。准备栏上至少留两发不占专注的战斗选项，否则主控场一开，你整场只会走位。专注断了怎么做体质豁免，见 <a href="https://www.tokenmaker.one/zh/blog/dnd-constitution-guide">体质与专注判定</a>。</p>
<figure class="inline-figure inline-figure--four-three-crop">
  <img class="inline-figure__image inline-figure__image--four-three" src="__WIZARD_CHARACTER_FOCUS__" alt="单一成年法师人物，深蓝法袍，简洁深色背景，专注抬手于胸前" loading="lazy" decoding="async" />
  <figcaption>深蓝法袍成年法师人物专注姿态。</figcaption>
</figure>
<h2>写出 1 级到 3 级的第一份清单</h2>
<p>下面是教学示例，不是官方最佳答案，也不是某次实战统计。每个名字都要能指出它解决的问题和跳过条件。你的智力、地图和队伍缺口不同，准备栏就应跟着改。</p>
<p>示例场景：地下城入口，有竖井，队伍没有侦察手段，法师不穿甲，下一场预计会在门口和走廊打。</p>
<h3>1 级：先写书，再挑 4 个准备，最后核对 2 个 1 环位</h3>
<p>2014 · 1 级 · 智力 16。准备数 = 3 + 1 = 4。法术位 2 个 1 环。法术书仍是 6 个 1 环，不能把 6 抄进准备栏。</p>
<table>
  <thead>
    <tr>
      <th>栏位</th>
      <th>2014 示例（智力 16）</th>
      <th>这一格解决什么 / 何时跳过</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>法术书 6</td>
      <td>Mage Armor、Shield、Magic Missile、Sleep、Feather Fall、Find Familiar</td>
      <td>示例书单，用来覆盖防御、反应、收尾、2014 无专注控场、坠落和仪式侦察</td>
    </tr>
    <tr>
      <td>准备 4</td>
      <td>Mage Armor、Shield、Sleep、Magic Missile</td>
      <td>无甲保命、被打中时的反应、不占专注的控场、不占专注的收尾</td>
    </tr>
    <tr>
      <td>法术位</td>
      <td>1 环 × 2</td>
      <td>开场不要两发都打成 Magic Missile；至少留一个反应位给 Shield，或留一个 8 小时 Mage Armor</td>
    </tr>
    <tr>
      <td>不占准备栏</td>
      <td>Find Familiar 按仪式从书中施放</td>
      <td>有 1 小时窗口才做；先攻已经开始就跳过</td>
    </tr>
    <tr>
      <td>今日专注</td>
      <td>无。2014 Sleep 文本没有 Concentration</td>
      <td>不要额外再准备一发只为“听起来能控场”的专注法术</td>
    </tr>
  </tbody>
</table>
<p>2014 这张示例卡把 Feather Fall 留在书里、不进准备栏：竖井确实存在，但 4 个准备格先保无甲防御、反应和一场不占专注的控场。若 DM 明确下一小时都在爬塔，就把 Sleep 换成 Feather Fall。</p>
<p>2024 · 1 级。准备数固定 4，不看智力。法术位仍是 2 个 1 环。官方建议的 6 个 1 环可直接当书法术起点。</p>
<table>
  <thead>
    <tr>
      <th>栏位</th>
      <th>2024 示例</th>
      <th>这一格解决什么 / 何时跳过</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>法术书 6</td>
      <td>Detect Magic、Feather Fall、Mage Armor、Magic Missile、Sleep、Thunderwave</td>
      <td>沿用 2024 职业页建议，便于对照原文，不是强制配方</td>
    </tr>
    <tr>
      <td>准备 4</td>
      <td>Mage Armor、Thunderwave、Magic Missile、Feather Fall</td>
      <td>无甲防御、推开贴身、非专注收尾、竖井反应</td>
    </tr>
    <tr>
      <td>法术位</td>
      <td>1 环 × 2</td>
      <td>Mage Armor 能撑 8 小时，尽量在进门前放；战斗里的 2 个位不要开场打光</td>
    </tr>
    <tr>
      <td>不占准备栏</td>
      <td>Detect Magic 按 Ritual Adept 从书中阅读施放</td>
      <td>必须带着法术书；它要专注，不能和 2024 Sleep 同时维持</td>
    </tr>
    <tr>
      <td>今日专注</td>
      <td>默认空。Sleep 留在书里当替换项</td>
      <td>2024 Sleep 要专注，且范围改成 5 尺半径球；门口推人用 Thunderwave，不把专注预支掉</td>
    </tr>
  </tbody>
</table>
<p>2024 若把 Sleep 写进准备栏，就把 Thunderwave 改成替换项，并在卡边写“今日专注 = Sleep”。两发一起开，2024 不成立。需要魔宠而官方 6 个里没有 Find Familiar 时，用它替换书中一个当前场景用不上的名字，例如没有开阔通道就换掉 Thunderwave；替换发生在法术书，不发生在“额外白给第七个 1 环”。</p>
<h3>2 级：多一个 1 环位，用 Arcane Recovery 回看当天资源</h3>
<p>2 级还没有 2 环法术位，不能准备 Misty Step 或 Web。2014 的 2 级法术位变成 3 个 1 环，Arcane Tradition 也在这一级出现，先不要把学派法术表并进准备栏。智力 16 时准备数变成 5。2024 的 2 级 Prepared Spells 是 5，法术位同样 3 个 1 环；Scholar 给一项技能专精，不改准备数量。数字与能力节点见 <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes#Wizard" rel="noreferrer noopener">2014 Wizard</a> 与 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Wizard" rel="noreferrer noopener">2024 Wizard</a>。</p>
<p>两版 1 级都有 Arcane Recovery：短休时研读法术书，恢复合计环阶不超过法师等级一半（向上取整）、且低于 6 环的已消耗法术位，每日一次，直到长休。2 级只能恢复 1 个环阶，也就是一个 1 环位。3 级可恢复 2 个环阶：一个 2 环，或两个 1 环。条文同样见上述两版职业页。</p>
<p>失败写法：短休后把准备法术整份重写——1–3 级换表点仍在长休。另一类失败：把 3 个 1 环位理解成“可以准备 3 个法术”。准备数在智力 16 的 2014 和 2024 职业表上都是 5。</p>
<h3>3 级：6 个准备，4 个 1 环位加 2 个 2 环位</h3>
<p>从 1 级到 3 级，法术书免费加入 4 个法术，总共 10 个 1 环或 2 环候选。2014 智力 16 时准备 6 个；2024 职业表也是 6 个。法术位两版都是 4 个 1 环加 2 个 2 环。2 环位很紧，不要同一场把 Web 和升环 Magic Missile 都打掉还指望有剩。</p>
<p>2014 · 3 级 · 智力 16 示例。书中在 1 级 6 个之外加入 Detect Magic、Thunderwave、Misty Step、Web。准备 6 个示例：Mage Armor、Shield、Magic Missile、Sleep、Web、Misty Step。今日专注只圈 Web。2014 Sleep 仍可留在准备栏里当不占专注的后备控场，但同一场先开 Web 时，不要再把动作和 2 环位浪费在第二个控场上。Find Familiar、Detect Magic、Feather Fall、Thunderwave 留在书里：前两发按仪式处理，后两发等地图变成竖井或贴身混战时再换进来。</p>
<p>2024 · 3 级示例。官方 6 个 1 环之外加入 Shield、Find Familiar、Misty Step、Web。准备 6 个示例：Mage Armor、Shield、Magic Missile、Thunderwave、Web、Misty Step。今日专注只圈 Web。Sleep、Detect Magic 留在书里当替换项，因为它们都要专注。Find Familiar 继续按 Ritual Adept 从书中阅读，不占准备栏。3 级仍没有 3 环位，不能准备 Counterspell；那是之后的反应位，规则深读见 <a href="https://www.tokenmaker.one/zh/blog/dnd-counterspell">反制法术（Counterspell）</a>。</p>
<h3>纸卡上要能看到的字段</h3>
<p>抄到一张纸上，字段固定为：年份｜等级｜智力（2014 必填，2024 写“不用于准备数”）｜书中候选数｜准备数｜1 环法术位｜2 环法术位｜每个准备法术的桌面任务｜今日专注｜仪式备注｜下次换表点。</p>
<table>
  <thead>
    <tr>
      <th>字段</th>
      <th>2014 · 3 级示例</th>
      <th>2024 · 3 级示例</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>年份 / 等级</td>
      <td>2014 · 3</td>
      <td>2024 · 3</td>
    </tr>
    <tr>
      <td>智力</td>
      <td>16（调整值 +3，准备 6）</td>
      <td>不用于准备数（职业表 6）</td>
    </tr>
    <tr>
      <td>书中候选</td>
      <td>10（1 环 8 + 2 环 2）</td>
      <td>10（1 环 8 + 2 环 2）</td>
    </tr>
    <tr>
      <td>准备数</td>
      <td>6</td>
      <td>6</td>
    </tr>
    <tr>
      <td>法术位</td>
      <td>1 环 × 4，2 环 × 2</td>
      <td>1 环 × 4，2 环 × 2</td>
    </tr>
    <tr>
      <td>准备法术</td>
      <td>Mage Armor、Shield、Magic Missile、Sleep、Web、Misty Step</td>
      <td>Mage Armor、Shield、Magic Missile、Thunderwave、Web、Misty Step</td>
    </tr>
    <tr>
      <td>今日专注</td>
      <td>Web</td>
      <td>Web</td>
    </tr>
    <tr>
      <td>仪式备注</td>
      <td>Find Familiar、Detect Magic 在书中，不必准备</td>
      <td>同上，且必须从书中阅读</td>
    </tr>
    <tr>
      <td>换表点</td>
      <td>下次长休；按环级花时间研读</td>
      <td>下次长休；1–3 级没有短休换表</td>
    </tr>
  </tbody>
</table>
<p>这张表示例卡要能逐项回算。准备法术里每一个名字都对应上一场地下城入口的一个缺口：8 小时防御、被打中时的反应、非专注收尾、2014 的无专注后备控场或 2024 的推人、门口主控场、附赠动作离开。回答不了缺口的名字不要为了“看起来很强”留着。</p>
<figure class="inline-figure inline-figure--four-three-crop">
  <img class="inline-figure__image inline-figure__image--four-three" src="__WIZARD_CHARACTER_READY__" alt="单一成年法师人物，深蓝法袍，简洁深色背景，双臂自然垂下、面向镜头准备就绪" loading="lazy" decoding="async" />
  <figcaption>深蓝法袍成年法师人物待命姿态。</figcaption>
</figure>
<h2>开团前逐项核对</h2>
<p>把纸卡放在手里，按下面七项打勾。任一项失败，先改卡，再掷先攻。</p>
<ol>
  <li><strong>年份。</strong>卡顶写着 2014 或 2024。准备公式、仪式条件和 Sleep 的字段都指向同一年的官方页，没有“5e 通用”混行。</li>
  <li><strong>三栏数量。</strong>法术书候选数、准备数、1 环法术位、2 环法术位（1–2 级写“无”）各有数字。准备数没有被法术位代替，法术位也没有被书中 6 个起始法术代替。</li>
  <li><strong>法术合法。</strong>每个准备名称都在该版本法术书里，环阶不超过当前法术位。1 级没有 2 环名，3 级没有 Counterspell。</li>
  <li><strong>职责覆盖。</strong>每个占用准备栏的名字都能回答一个真实场景问题。凑“最强”或重复同一职责的，删一格。</li>
  <li><strong>专注。</strong>同一场景计划同时开启的专注效果只留一个，其余写成替换项。2024 没有把 Sleep 和 Web、Detect Magic 计划成同时维持。</li>
  <li><strong>仪式。</strong>2014 核对：带 Ritual 标签且在书中。2024 再核对：施放时从书中阅读。书不在身上，就把仪式从“今晚可用”划掉。</li>
  <li><strong>换表点。</strong>写明下次长休后可以改准备法术。1–3 级卡不要提前写上短休换表能力。</li>
</ol>
<p>七项都勾上，这一份低等级清单就可以上桌。场景变了，回到三栏和职责，只改真正受影响的那一格，不要整表推倒重来。</p>
`;

export const dndWizardSpellsArticleHtml = bindWizardSpellImagePlaceholders(
  dndWizardSpellsLockedEnglishHtml,
  WIZARD_SPELL_IMAGE_PATHS,
);

export const dndWizardSpellsArticleHtmlZh = bindWizardSpellImagePlaceholders(
  dndWizardSpellsLockedChineseHtml,
  WIZARD_SPELL_IMAGE_PATHS,
);
