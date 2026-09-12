import {
  DND_CLERIC_2014_RULES_URL,
  DND_CLERIC_2024_RULES_URL,
  DND_CLERIC_SPELLS_CONCENTRATION_IMAGE_PATH,
  DND_CLERIC_SPELLS_FOCUS_ZH_IMAGE_PATH,
  DND_CLERIC_SPELLS_JOB_IMAGE_PATH,
  DND_CLERIC_SPELLS_PREPARE_ZH_IMAGE_PATH,
  DND_CLERIC_SPELLS_TOKEN_IMAGE_PATH,
  DND_CLERIC_SPELLS_TOKEN_ZH_IMAGE_PATH,
  EN_DICE_ROLLER_PATH,
  EN_DND_BARD_SPELLS_PATH,
  EN_DND_BLESS_PATH,
  EN_DND_CLASSES_PATH,
  EN_DND_CONSTITUTION_PATH,
  EN_DND_DRUID_SPELLS_PATH,
  EN_CLERIC_PRESET_EDITOR_PATH,
  EN_PALADIN_2024_SPELLS_PATH,
  ZH_CLERIC_PRESET_EDITOR_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_BARD_SPELLS_PATH,
  ZH_DND_BLESS_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_DND_CONSTITUTION_PATH,
  ZH_DND_DRUID_SPELLS_PATH,
  ZH_PALADIN_2024_SPELLS_PATH,
} from './shared';

export const dndClericSpellsArticleHtml = String.raw`
<p><strong>dnd cleric spells</strong> are the prepared names you lock after a Long Rest for the rules year your table actually uses. Count the legal number of level 1+ spells first, subtract Domain or subclass names that are already always prepared, then keep one concentration job and one non-concentration rescue. If those four checks pass, tomorrow’s list is legal; if they fail, you are carrying a Domain duplicate, two openers that share concentration, or a healer with no pickup button.</p>
<p>I write the list by job, not by walking the whole Cleric column from cantrip to 9th. Use the table for tonight, then confirm the prepare count for 2014 or 2024 before you copy a Domain name onto the daily line.</p>
<table>
  <thead>
    <tr>
      <th>Need</th>
      <th>Cleric spell picks</th>
      <th>Why it earns a prepared slot</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Rescue</strong></td>
      <td>Healing Word first; Cure Wounds or Aid as the second heal; Lesser Restoration when a condition, not hit points, is the problem</td>
      <td>Healing Word is a Bonus Action at 60 feet, so you can pick up a fallen ally without walking into the pile. Leave it off only when another character already has that same pickup.</td>
    </tr>
    <tr>
      <td><strong>Concentration</strong></td>
      <td>Bless at low levels; Spirit Guardians when 3rd-level slots exist; Shield of Faith only when one ally must live and Bless is not the plan; 2024 Spiritual Weapon only as that day’s opener, never stacked with Bless or Spirit Guardians</td>
      <td>You get one concentration spell at a time. Put the day’s opener here and treat every other concentration name as a Long Rest swap, not a second opener you will stack.</td>
    </tr>
    <tr>
      <td><strong>Fallback</strong></td>
      <td>Guiding Bolt, Command, Inflict Wounds; 2014 Spiritual Weapon</td>
      <td>This is the turn you still have after the opener is up, or after a Constitution save drops it. It must work without concentration.</td>
    </tr>
    <tr>
      <td><strong>Utility</strong></td>
      <td>One prepared detection or travel spell with a Ritual tag; Dispel Magic from 3rd-level slots; Protection from Evil and Good on undead or fiend days</td>
      <td>A Cleric can ritual a prepared Cleric spell that has the Ritual tag, so this job can save slots if you actually prepare the name. Empty utility lines are how dungeon days turn into “nobody can check the door.”</td>
    </tr>
  </tbody>
</table>
<h2>How Many Level 1+ Cleric Spells Do You Prepare in 2014 vs 2024?</h2>
<p>Ask the table which handbook year is in force before you write a single spell name. The <a href="${DND_CLERIC_2014_RULES_URL}" rel="noreferrer noopener">2014 Basic Rules Cleric Spellcasting</a> section and the <a href="${DND_CLERIC_2024_RULES_URL}" rel="noreferrer noopener">2024 Free Rules Cleric Spellcasting</a> section both make Wisdom the spellcasting ability, and both let you mix any spell levels you have slots for. They do not use the same prepare count, they do not grant Domain spells at the same Cleric level, and a 2024 Cleric does not rebuild the list the same way a 2024 Paladin does.</p>
<p>In 2014 you prepare a number of Cleric spells equal to your Wisdom modifier plus your Cleric level, minimum one, and those spells must be of a level for which you have slots. A 1st-level Cleric with Wisdom 16 (+3) prepares 1 + 3 = 4 spells. The same math at later levels is 2 + 3 = 5 at Cleric 2, 3 + 3 = 6 at Cleric 3, 4 + 3 = 7 at Cleric 4, and 5 + 3 = 8 at Cleric 5. The 2014 class text works an example at Cleric 3 with Wisdom 16: four 1st-level slots, two 2nd-level slots, and six prepared spells of 1st or 2nd level in any mix. Casting a prepared spell does not remove it from the list. After a Long Rest you can change the full list; preparing the new list takes at least 1 minute per spell level for each spell on it.</p>
<p>In 2024 you do not add Wisdom to Cleric level. You read the Prepared Spells column of the Free Rules Cleric Features table. That Cleric Features table lists 4 prepared spells at level 1, 5 at 2, 6 at 3, 7 at 4, and 9 at 5. Level 1 starts by choosing four 1st-level Cleric spells. The class text’s level 3 example is six spells of 1st and 2nd level in any mix, matching the table’s 6, not a Wisdom formula. Always-prepared subclass spells still do not count against that number. Whenever you finish a Long Rest you can replace any of the prepared Cleric spells with other Cleric spells you have slots for.</p>
<p>That last sentence is the contrast with Paladin. A 2024 Paladin replaces one prepared spell after a Long Rest. A Cleric replaces any. If you share Bless duty with a Paladin, read the <a href="${EN_PALADIN_2024_SPELLS_PATH}">Paladin 2024 spells</a> list so you do not both lock the same concentration job and then fail to swap. The 2024 Paladin replaces one prepared spell after a Long Rest; you can replace any.</p>
<p>Low Wisdom and high Wisdom flip which year feels generous. Wisdom 14 (+2) at Cleric 1 is 3 prepared spells in 2014 and 4 in 2024. Wisdom 16 matches at 4 and 4. Wisdom 20 (+5) at Cleric 1 is 6 in 2014 and still 4 in 2024. At Cleric 5, Wisdom 16 is 8 in 2014 and 9 in 2024. There is no single “2024 always prepares more” claim. Copy the formula or the Free Rules Cleric Features table; do not copy a friend’s Wisdom 20 list onto a Wisdom 14 2014 sheet.</p>
<table>
  <thead>
    <tr>
      <th>Cleric level</th>
      <th>2014, Wisdom 16 (+3)</th>
      <th>2024 Prepared Spells column</th>
      <th>What else sits on the sheet</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>4 counted spells</td>
      <td>4 counted spells</td>
      <td>2014 Domain spells are already prepared. 2024 has no subclass list yet.</td>
    </tr>
    <tr>
      <td>2</td>
      <td>5 counted spells</td>
      <td>5 counted spells</td>
      <td>Channel Divinity arrives. It is not a prepared spell in either year.</td>
    </tr>
    <tr>
      <td>3</td>
      <td>6 counted spells, 1st or 2nd in any mix</td>
      <td>6 counted spells, 1st or 2nd in any mix</td>
      <td>2014 Life adds Lesser Restoration and Spiritual Weapon. 2024 subclass begins; Life adds Aid, Bless, Cure Wounds, and Lesser Restoration.</td>
    </tr>
    <tr>
      <td>4</td>
      <td>7 counted spells</td>
      <td>7 counted spells</td>
      <td>Both years add a cantrip. 2024 may also replace one known cantrip because you gained a Cleric level.</td>
    </tr>
    <tr>
      <td>5</td>
      <td>8 counted spells</td>
      <td>9 counted spells</td>
      <td>3rd-level slots exist. 2014 Life adds Beacon of Hope and Revivify. 2024 Life adds Mass Healing Word and Revivify.</td>
    </tr>
  </tbody>
</table>
<p>Cantrips are known, not part of the daily level 1+ count. 2014 knows three cantrips at 1st level and adds more at 4th and 10th as shown on the Cleric table; the 2014 Basic Rules text does not grant a cantrip swap when you gain a Cleric level. 2024 also starts with three, adds another at Cleric 4 and Cleric 10, and lets you replace one cantrip whenever you gain a Cleric level. The 2024 Free Rules recommended trio is Guidance, Sacred Flame, and Thaumaturgy. The Free Rules cantrip list is Guidance, Light, Mending, Resistance, Sacred Flame, Spare the Dying, and Thaumaturgy. It does not include Toll the Dead or Word of Radiance, so do not take those as Free Rules picks.</p>
<p>2024 also asks for Divine Order at level 1. Thaumaturge knows one extra cantrip from the Cleric list, still from those Free Rules names if that is the book in play. Protector does not add a cantrip. Neither choice is a prepared level 1+ spell. If you still need the class-choice page rather than a spell list, use the <a href="${EN_DND_CLASSES_PATH}">DND classes guide</a>; this list assumes Cleric is already on the sheet.</p>
<figure class="inline-figure inline-figure--four-three-crop">
  <img class="inline-figure__image inline-figure__image--four-three" src="${DND_CLERIC_SPELLS_JOB_IMAGE_PATH}" alt="Cleric miniature behind four unlabeled parchment piles on a wood table, marked with bandages, a candle, a mace, and a compass" width="1364" height="1023" loading="lazy" decoding="async" />
  <figcaption>Sort tonight’s names into those four piles before you count slots. Rescue and concentration are not the same pile, and Domain names do not go in the daily count.</figcaption>
</figure>
<p>A Druid is the other Wisdom prepared caster who can also change the morning list. If that character already covers detection or battlefield control, steal fewer utility names and keep more Cleric rescue names. The <a href="${EN_DND_DRUID_SPELLS_PATH}">DND druid spells</a> guide is the sibling job list, not a second Cleric column to merge.</p>
<h2>What Jobs Must the List Cover for One Adventuring Day?</h2>
<p>Four jobs cover one default dungeon day: rescue, concentration, fallback, and utility. I fill those four before I spend leftover prepare slots on a second heal, a second attack, or a spell I used once three sessions ago. Leftover slots are real at Cleric 5, especially on 2024’s nine counted names, but they are leftovers. They are not permission to skip Healing Word because Guiding Bolt looks louder.</p>
<p>Rescue is the non-concentration pickup. Healing Word is the name I put there in both rules years. The 2014 spell is a Bonus Action, 60 feet, and heals 1d4 plus your spellcasting ability modifier; the page is the <a href="https://www.dndbeyond.com/spells/2140-healing-word" rel="noreferrer noopener">2014 Healing Word entry</a>. The 2024 spell keeps the Bonus Action and 60-foot range and heals 2d4 plus your spellcasting ability modifier; the page is the <a href="https://www.dndbeyond.com/spells/2619143-healing-word" rel="noreferrer noopener">2024 Healing Word entry</a>. The die size changed. The job did not. You still want a Bonus Action that reaches a fallen ally while you stay out of the melee that dropped them. Cure Wounds is the action-and-touch heal for the round when you can stand next to the target. Aid is the 2nd-level name I prepare when I expect several allies to take hits across the whole day rather than one pickup. Lesser Restoration is not hit-point rescue; it is the condition job. If the party already has a Bard carrying Healing Word, confirm that character still knows it before you drop the name. <a href="${EN_DND_BARD_SPELLS_PATH}">DND bard spells</a> are a known-list problem, not a Cleric-style morning rebuild, so that pickup can stay locked for a long time.</p>
<p>If nobody else in the party has a Bonus Action pickup, Healing Word is not optional. I will not leave a 2024 official four-spell list untouched just because Shield of Faith was in the printed recommendation. Shield of Faith is a second concentration buff. Bless is already the concentration job at level 1. Two concentration buffs on a four-spell list means you prepared a spell you cannot cast while the opener is live. Healing Word does not have that problem. Spare the Dying is a cantrip, not a prepared spell, and it is a legal Free Rules cantrip if you want a no-slot stabilize; it does not replace Healing Word, because a stable ally at 0 is still down.</p>
<p>Concentration is one job, not a stack. At 1st and 2nd level I put Bless there unless another character already has it running every fight. Details for targeting and components live on the <a href="${EN_DND_BLESS_PATH}">DND Bless guide</a>; do not copy a second Bless writeup onto this list. Shield of Faith is the other common 1st-level concentration name. It is the right opener when one ally is the only target that matters and Bless is already covered. Protection from Evil and Good is the undead, fey, fiend, or celestial day opener. Spirit Guardians is the default 3rd-level concentration job on a dungeon day. You cannot also concentrate on 2024 Spiritual Weapon, 2024 Bless, or Shield of Faith while it runs. 2014 Spiritual Weapon does not use concentration, so that year can keep Spiritual Weapon up with Spirit Guardians. 2024 cannot.</p>
<p>Fallback is whatever you still cast after the opener is up, or after you fail the Constitution saving throw and the opener dies. Guiding Bolt is the clean 1st-level version because it does not use concentration. Command is the clean control version for the same reason. Inflict Wounds is the melee version if you are already standing on the target. 2014 Spiritual Weapon is an excellent fallback because it is a Bonus Action and needs no concentration; 2024 Spiritual Weapon is a concentration spell, so it is an opener or a swap, not a fallback while Spirit Guardians is live. Do not fill the fallback line with a second concentration spell “in case the first one fails.” When the first one fails you have a free concentration slot again, but during the fight you needed a name you could cast while the first one was still up.</p>
<p>Utility is one prepared answer that is not a fight. I want a detection or travel name with a Ritual tag so I can cast it without a slot when we have time, plus Dispel Magic once 3rd-level slots exist. Protection from Evil and Good moves from concentration opener to this flex line on an undead day if Spirit Guardians is already the opener. Silence is the anti-caster flex. Sending is the “we split the party” flex at 3rd. Do not prepare four detection spells and then discover nobody has Healing Word. The utility job is one name, maybe two at Cleric 5, not the whole leftover list.</p>
<p>Failed-save days change the leftover names, not the four jobs. If Bless dropped in round one last session, I still prepare one concentration spell. I add a real fallback and I stop dumping Constitution to raise Wisdom. The <a href="${EN_DND_CONSTITUTION_PATH}">Constitution guide</a> is the stat page for that save; the spell list cannot fix a Constitution modifier you refused to fund. I also stop preparing Shield of Faith as a “backup Bless.” It needs the same slot in your concentration budget. Guiding Bolt, Command, and 2014 Spiritual Weapon are the names that still work while you recast, and they still work if you never recast.</p>
<p>No-healer days make rescue take two lines. Healing Word stays. Cure Wounds or Aid stays. Lesser Restoration stays once 2nd-level slots exist, because a poisoned or paralyzed striker is a wipe even if hit points look fine. I will drop Guiding Bolt before I drop the second heal. Sacred Flame remains the damage cantrip so the prepared list does not have to carry all of the offense. Thaumaturge’s extra cantrip, if you took that Divine Order, is a good place for Spare the Dying or Light rather than a fourth prepared combat spell you cannot afford.</p>
<p>Undead days keep Sacred Flame, put Protection from Evil and Good on the list, and make Spirit Guardians the concentration job once you have it. Turn Undead is Channel Divinity, not a prepared spell. 2024 Divine Spark is also Channel Divinity, not a prepared spell; do not spend a prepare slot on it and do not skip Healing Word because you “have a heal Channel.” Divine Spark is a separate resource with a separate timing, and it does not pick someone up at 60 feet as a Bonus Action.</p>
<p>Travel days and talk-first days swap the leftover combat names, not the rescue button. Command, Zone of Truth, Detect Magic, and Augury earn slots when the next six hours are a gate, a relic, or a lying priest. Guiding Bolt can come off for one Long Rest. Healing Word stays unless you are certain nobody can drop. 2024 lets you put the combat names back the next morning by replacing any prepared spell. 2014 lets you replace the whole list after the same rest, with the prayer timer. Do not run either year like a class that changes one name.</p>
<h2>Which Domain and Subclass Spells Are Already Prepared?</h2>
<p>Always-prepared Domain or subclass spells do not count against the daily number, and they are still Cleric spells for you. The whole point of the subtraction step is that you do not also spend a counted pick on a name the subclass already hands you. If Bless is always prepared, Bless is not one of your four, six, or nine counted spells. Write the always-prepared names in a separate block on the sheet so you do not “helpfully” recopy them onto the daily line after a Long Rest.</p>
<p>2014 grants Divine Domain at 1st level. Domain spells are always prepared from the moment you gain them. 2014 Basic Rules print Life Domain as the worked subclass. The 2014 Life Domain Spells table is Bless and Cure Wounds at 1st; Lesser Restoration and Spiritual Weapon at 3rd Cleric level; Beacon of Hope and Revivify at 5th; Death Ward and Guardian of Faith at 7th; Mass Cure Wounds and Raise Dead at 9th. If you are 2014 Life, those names are already on the sheet. Spending a counted pick on Bless at level 1 is a wasted slot. Spending a counted pick on Spiritual Weapon at level 3 is a wasted slot. Other 2014 domains exist in the full Player’s Handbook; Basic Rules name Knowledge, Light, Nature, Tempest, Trickery, and War without printing those tables. For those books, read your Domain Spells table and subtract whatever it lists. Do not guess a Light or War list from memory on a Basic Rules night.</p>
<p>2024 grants the subclass at Cleric 3, not at 1. Levels 1 and 2 have no Domain spell list. Divine Order is not a Domain list. At 3, always-prepared subclass spells start and still do not count. 2024 Free Rules print Life Domain only. The 2024 Life list is Aid, Bless, Cure Wounds, and Lesser Restoration at Cleric 3; Mass Healing Word and Revivify at 5; Aura of Life and Death Ward at 7; Greater Restoration and Mass Cure Wounds at 9. Spiritual Weapon is not on the 2024 Life always-prepared list. 2014 Life included it at 3rd Cleric level; 2024 Life dropped it. If you copy a 2014 Life sheet onto a 2024 Life character, you will think Spiritual Weapon is free. It is not. You must spend a counted pick on it, and in 2024 that pick is a concentration pick.</p>
<table>
  <thead>
    <tr>
      <th>Cleric level</th>
      <th>2014 Life, always prepared</th>
      <th>2024 Life, always prepared</th>
      <th>Do not also spend a counted pick on</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1–2</td>
      <td>Bless, Cure Wounds</td>
      <td>None. Subclass has not started.</td>
      <td>2014: Bless, Cure Wounds. 2024: nothing from a Domain table, because there is not one yet.</td>
    </tr>
    <tr>
      <td>3–4</td>
      <td>Add Lesser Restoration, Spiritual Weapon</td>
      <td>Aid, Bless, Cure Wounds, Lesser Restoration</td>
      <td>Pull Bless and Cure Wounds off the 2024 counted list the morning subclass lands. Do not recopy 2014 Spiritual Weapon as a 2024 free name.</td>
    </tr>
    <tr>
      <td>5–6</td>
      <td>Add Beacon of Hope, Revivify</td>
      <td>Add Mass Healing Word, Revivify</td>
      <td>Revivify is free on Life in both years at 5. Healing Word can still earn a counted 1st-level slot because it is cheaper than Mass Healing Word.</td>
    </tr>
  </tbody>
</table>
<p>The ugly 2024 mistake is at Cleric 3. You have been preparing Bless and Cure Wounds since level 1 because the official recommendation named them and because you had no subclass list. At 3, Life makes both always prepared, plus Aid and Lesser Restoration. The Prepared Spells column still says 6. If Bless and Cure Wounds stay on that 6, you are paying twice. The morning you hit 3, replace those two counted names with jobs the subclass did not give you: Healing Word if it is not there yet, Guiding Bolt, a Ritual-tagged utility, Spiritual Weapon if you accept the concentration cost, Hold Person, Command, or Protection from Evil and Good. Aid is already always prepared on 2024 Life, so do not recopy Aid either.</p>
<p>The matching 2014 mistake is recopying Bless, Cure Wounds, and later Spiritual Weapon onto the Wisdom-modifier-plus-level line. A 1st-level Wisdom 16 Life Cleric already has Bless and Cure Wounds always prepared, then prepares four more counted spells. That is six names you can cast, four of which count. If you write only Bless, Cure Wounds, Guiding Bolt, and Shield of Faith as the “four,” you just spent two counted slots on Domain duplicates and you still have no Healing Word.</p>
<p>Channel Divinity is not a Domain spell list and not a prepared spell. 2024 Divine Spark heals or deals damage; it is still Channel Divinity. Turn Undead is still Channel Divinity. Do not skip a prepared rescue because you unlocked a Channel option at Cleric 2. Divine Intervention is not a prepared spell either. In 2024 it arrives at Cleric 10 and lets you cast a Cleric spell of level 5 or lower that is not a Reaction, without a slot and without Material components, once per Long Rest. It does not live on the prepared line, it does not exist at the levels this list is for, and it is a once-per-day backup even after 10. Keep Revivify prepared at 5 if you want that button on a normal slot.</p>
<h2>What Is a Legal Level 1 List and a Level 5 Default-Day List?</h2>
<p>The lists below are examples, labeled as examples. They use names that appear on the 2014 Basic Rules Cleric list or the 2024 Free Rules Cleric list. They are not a ranking of every Cleric spell, and they are not a 0th-through-9th dump. Change leftover names after the Long Rest when the next day is clearly undead, travel, or talk. Do not change the rescue job unless another character already covers it.</p>
<p>Example, 2024 level 1. The Free Rules Cleric Features table gives four 1st-level prepared spells and three cantrips. Official recommended cantrips: Guidance, Sacred Flame, Thaumaturgy. Official recommended prepared spells: Bless, Cure Wounds, Guiding Bolt, and Shield of Faith. That official four covers concentration (Bless), an action heal (Cure Wounds), and a non-concentration attack (Guiding Bolt). It does not cover a Bonus Action pickup. If the party has no other Bonus Action pickup, replace Shield of Faith with Healing Word. Shield of Faith is the name I cut because it is a second concentration buff on a list that already spends concentration on Bless. The example list I actually write for a table with no other healer is Bless, Cure Wounds, Guiding Bolt, and Healing Word. If a Paladin already prepares Bless every day, keep Shield of Faith, drop Bless, and still take Healing Word: Shield of Faith, Cure Wounds, Guiding Bolt, Healing Word. If a Bard already has Healing Word, the official four can stay.</p>
<p>Thaumaturge at 2024 level 1 adds a fourth known cantrip from the Free Rules seven. I use that extra on Spare the Dying when nobody else can stabilize, or on Light or Mending when the dungeon is dark or the gear is junk. I do not use it as an excuse to skip Healing Word. Protector adds no cantrip; the four prepared spells still have to cover rescue.</p>
<p>Example, 2014 level 1, Wisdom 16. Cleric level 1 + Wisdom modifier 3 = 4 counted spells, plus Domain always-prepared names. Cantrips known: three. I still take Guidance, Sacred Flame, and Thaumaturgy so the card matches the 2024 official trio when the table is mixed-year and I want the same habits. If the Domain is Life, Bless and Cure Wounds are already always prepared. The four counted names should not repeat them. Example Life list: Healing Word, Guiding Bolt, Command, and Detect Magic. That is one concentration job (Bless, already always prepared), one Bonus Action rescue (Healing Word), one non-concentration attack (Guiding Bolt), one non-concentration control (Command), and one ritual utility (Detect Magic). Shield of Faith stays off this four; it is a second concentration buff beside Bless. If you spend the four counted picks on Bless, Cure Wounds, Guiding Bolt, and Shield of Faith, you double-booked Life and you still cannot pick someone up at range with a Bonus Action.</p>
<p>If the 2014 Domain is not Life, read that Domain table before you copy the Life example. If the Domain does not already give Bless and Cure Wounds, the four counted picks have to cover concentration, rescue, fallback, and utility themselves. Example non-Life counted four: Bless, Healing Word, Guiding Bolt, and Detect Magic. Domain extras sit beside that block and still do not count. I will not invent a Light, War, or Trickery always-prepared list here; open the book that printed your Domain.</p>
<p>Example, 2024 level 5 default dungeon day. The Free Rules Cleric Features table gives 9 counted prepared spells and 4 cantrips. You have 1st-, 2nd-, and 3rd-level slots. Subclass is on. If the subclass is Life, the always-prepared block is already Aid, Bless, Cure Wounds, Lesser Restoration, Mass Healing Word, and Revivify. Do not recopy those six onto the nine. Example counted nine for 2024 Life, default dungeon: Healing Word, Guiding Bolt, Command, Detect Magic, Protection from Evil and Good, Sending, Spirit Guardians, Dispel Magic, Warding Bond. Jobs: Healing Word is the cheap rescue (Mass Healing Word is always prepared but spends a 3rd-level slot). Guiding Bolt and Command are non-concentration fallback. Detect Magic is utility. Sending is the split-party name that does not use concentration. Warding Bond is a second-protect name that does not use concentration. Spirit Guardians is the one concentration job. Dispel Magic is the magic answer. Protection from Evil and Good is an undead-day flex: keep it on this default dungeon list as a Long Rest swap for Spirit Guardians, not as a second opener in the same fight. Hold Person and Protection from Energy wait on the swap list for a day Spirit Guardians is off. Spiritual Weapon is not on this example nine because 2024 Spiritual Weapon needs concentration, and Spirit Guardians already has that job. If tomorrow is a single-target boss and you do not want Spirit Guardians, Long Rest swap Spirit Guardians off and put Spiritual Weapon on. Do not leave both on and tell yourself you will stack them.</p>
<p>If your 2024 table uses a subclass other than Life, the nine counted names must include the jobs Life would have given you for free. Example counted nine when nothing is always prepared yet, or when you refuse to assume a Domain list you have not read: Bless, Healing Word, Guiding Bolt, Detect Magic, Aid, Lesser Restoration, Spirit Guardians, Revivify, Dispel Magic. That version spends counted slots on Bless, Aid, Lesser Restoration, and Revivify because they are not free. It is still one concentration job (Bless or Spirit Guardians, pick one for the actual fight), one non-concentration rescue (Healing Word), and Revivify as the death button. If the real subclass table later hands you Revivify, pull it off the nine the same morning.</p>
<p>Example, 2014 level 5 default dungeon day, Wisdom 16 Life. Counted spells: 5 + 3 = 8. Always prepared: Bless, Cure Wounds, Lesser Restoration, Spiritual Weapon, Beacon of Hope, Revivify. Do not recopy those six. Example counted eight: Healing Word, Guiding Bolt, Detect Magic, Aid, Spirit Guardians, Dispel Magic, Protection from Energy, Protection from Evil and Good. 2014 Spiritual Weapon is already always prepared and does not require concentration, so the fallback job is already on the sheet. Spirit Guardians can run at the same time. That stack is legal in 2014 and illegal in 2024. Healing Word is still worth a counted 1st-level slot next to Beacon of Hope and Revivify, because you want a Bonus Action pickup that does not spend the 3rd-level slot you wanted for Spirit Guardians or Dispel Magic.</p>
<p>Example, 2014 level 5, Wisdom 16, Domain is not Life. You still prepare 8 counted spells, plus whatever that Domain table already gave you at 1st, 3rd, and 5th. Example counted eight when the Domain did not hand you the healer package: Bless, Healing Word, Guiding Bolt, Detect Magic, Lesser Restoration, Spirit Guardians, Revivify, Dispel Magic. If the Domain already includes Spiritual Weapon, do not recopy it; you still get the 2014 no-concentration stack with Spirit Guardians. If the Domain already includes Revivify, spend that counted line on Protection from Energy, Silence, or Aid instead.</p>
<p>Long Rest swaps are how the same character handles a failed-save day, a no-healer day, and an undead day without carrying every name at once. 2024: replace any of the nine. 2014: replace the whole counted list, with the prayer timer. Failed-save swap: keep Healing Word, keep one concentration opener, add Guiding Bolt or Command if they were missing, cut the second concentration name. No-healer swap: Healing Word and Cure Wounds or Aid both stay; Guiding Bolt is the first name that can leave. Undead swap: Protection from Evil and Good and Spirit Guardians stay; Zone of Truth and travel names leave. Talk-first swap: Command and a Ritual-tagged detection name stay; Inflict Wounds leaves. After an undead dungeon, 2024 can put Guiding Bolt back on in the morning without touching the rest of the nine. A Paladin in the same party still only changes one name; do not wait for that Paladin to cover your undead flex.</p>
<p>Level 3 is a legal-list checkpoint. 2024 table count is 6, mix of 1st and 2nd. On Life, Aid, Bless, Cure Wounds, and Lesser Restoration become always prepared, so the six counted jobs should look like Healing Word, Guiding Bolt, Detect Magic, Command, Protection from Evil and Good, and one leftover such as Sending or Silence. Life still always has Bless prepared; it cannot come off. Prepare 2024 Spiritual Weapon or Hold Person only as a Long Rest swap for a day you will not cast Bless or Spirit Guardians. Do not put them on the six beside a Bless you still intend to run. 2014 level 3, Wisdom 16, is also 6 counted, and Life has just added Lesser Restoration and Spiritual Weapon for free. The six counted jobs should look like Healing Word, Guiding Bolt, Detect Magic, Aid, Shield of Faith or Protection from Evil and Good, and Hold Person or Silence. Do not recopy Spiritual Weapon. You already have it, and in 2014 it does not fight Bless for concentration.</p>
<figure class="inline-figure inline-figure--four-three-crop">
  <img class="inline-figure__image inline-figure__image--four-three" src="${DND_CLERIC_SPELLS_TOKEN_IMAGE_PATH}" alt="Circular painted Cleric portrait token with a gold holy-symbol border on a cutting mat beside a matching miniature" width="1364" height="1023" loading="lazy" decoding="async" />
  <figcaption>After the names are legal, export a circular Cleric token with the holy-symbol border so the caster stays readable in the pile. Mark Bless on allies with a second token, not by crowding this portrait.</figcaption>
</figure>
<p>Once the level 5 list is on the sheet, the remaining table problem is seeing Bless on allies and keeping the Cleric portrait readable in the pile. Open the <a href="${EN_CLERIC_PRESET_EDITOR_PATH}">Token Maker editor</a>, use the Cleric preset for a circular holy-symbol border, and export the Cleric portrait plus a second marker for blessed allies. Keep the <a href="${EN_DICE_ROLLER_PATH}">D&amp;D dice roller</a> next to the map for Constitution concentration checks while that opener is live.</p>
<h2>Which 2014 vs 2024 Changes Change Today’s Picks?</h2>
<p>Four changes actually move a name on or off tonight’s list: the prepare-count formula, subclass timing, Spiritual Weapon concentration, and what Divine Intervention is. Healing Word’s die size also changes how hard the rescue button hits, but it does not change whether you prepare the name.</p>
<p>Prepare count. 2014 is Wisdom modifier + Cleric level, minimum 1. 2024 is the Free Rules Cleric Features table. At Wisdom 16 the first four levels match 4, 5, 6, and 7, then Cleric 5 is 8 versus 9. At Wisdom 14, 2014 is behind at level 1 (3 versus 4). At Wisdom 20, 2014 is ahead at level 1 (6 versus 4). If you copy a 2024 “nine names at 5” onto a Wisdom 16 2014 sheet, you have prepared one illegal spell. If you copy a 2014 Wisdom 20 level 1 six-name list onto a 2024 sheet, you have prepared two illegal spells. Write the year at the top of the card before you write the names.</p>
<p>Subclass timing. 2014 Domain, and its always-prepared spells, start at 1. 2024 subclass, and Life’s always-prepared spells, start at 3. A 2024 level 1 Life-to-be Cleric does not have Bless for free. That is why the official four includes Bless. A 2014 level 1 Life Cleric does have Bless for free. That is why the 2014 Life example spends counted picks on Healing Word instead of Bless. At 2024 Cleric 3, pull every new always-prepared name off the counted six the same night you gain the subclass. At 2014 Cleric 3, pull Lesser Restoration and Spiritual Weapon off the counted six if you had been paying for them early, which you should not have been, because Life does not grant Spiritual Weapon until 3 anyway.</p>
<p>Spiritual Weapon concentration is the change that wrecks copied mid-level lists. The <a href="https://www.dndbeyond.com/spells/2263-spiritual-weapon" rel="noreferrer noopener">2014 Spiritual Weapon entry</a> does not require concentration. The <a href="https://www.dndbeyond.com/spells/2619081-spiritual-weapon" rel="noreferrer noopener">2024 Spiritual Weapon entry</a> does. 2014 can stack Spiritual Weapon with Spirit Guardians, and 2014 Life even always-prepares Spiritual Weapon at Cleric 3, so the stack is the default Life dungeon turn. 2024 cannot stack them. 2024 Life does not always-prepare Spiritual Weapon, so the name costs a counted pick and that pick is the concentration job. If you want Spirit Guardians on a 2024 day, Spiritual Weapon stays off, or it waits on the Long Rest swap list. If you want Spiritual Weapon on a 2024 day, Bless and Spirit Guardians stay off for that day.</p>
<figure class="inline-figure inline-figure--four-three-crop">
  <img class="inline-figure__image inline-figure__image--four-three" src="${DND_CLERIC_SPELLS_CONCENTRATION_IMAGE_PATH}" alt="Split miniature scene: 2014 Cleric with a spectral hammer and a golden ring around allies; 2024 Cleric with the same hammer plus surrounding spirit figures" width="1364" height="1023" loading="lazy" decoding="async" />
  <figcaption>The 2014 stack is legal. The 2024 stack is not. One concentration job per day, then a fallback that does not need the same box.</figcaption>
</figure>
<p>Healing Word stays in the rescue job in both years. 2014 heals 1d4 plus modifier. 2024 heals 2d4 plus modifier. Range and Bonus Action are the same on those official pages. The 2024 bump makes the pickup more likely to land a downed ally with a little buffer. It is not a reason to skip the spell in 2014, and it is not a reason to prepare two Healing Word copies. You prepare the name once. You spend slots on it as the fight requires. Mass Healing Word at 2024 Life 5 is always prepared and still does not retire the 1st-level name, because the 1st-level slot is the one you can spend without touching the 3rd-level slot that Spirit Guardians or Dispel Magic wanted.</p>
<p>Divine Intervention does not replace a prepared spell at the levels you are filling tonight. 2024’s version is a 10th-level Magic action that casts any Cleric spell of level 5 or lower that is not a Reaction, without a slot and without Material components, once per Long Rest. It is not written on the prepared list. It cannot cover Cleric 5 Revivify for you at Cleric 5. Even at 10 it is one casting per Long Rest, so a prepared Revivify is still the second death button. 2014’s 10th-level version is a percentile roll the DM resolves, not a prepared spell either. Do not leave Revivify off a level 5 list because you read the level 10 feature while building the character.</p>
<p>Cantrip swap is a 2024-only morning-adjacent habit. Whenever you gain a Cleric level, you may replace one known cantrip. That is how a Guidance, Sacred Flame, Thaumaturgy trio becomes Guidance, Sacred Flame, Spare the Dying after a few sessions of people hitting 0. 2014 Basic Rules do not grant that swap. Do not pull Sacred Flame off a 2014 card just because a 2024 friend rebuilt cantrips at level 2. Extra cantrips still arrive at 4 and 10 in both years. Toll the Dead and Word of Radiance stay off Free Rules recommendations.</p>
<p>Change-any versus change-one is the campaign habit. Cleric, both years, rebuilds after a Long Rest: full list in 2014, any names in 2024. Paladin 2024 changes one. If the Paladin took Bless and the next day is undead, that Paladin may still be stuck with Bless while you put Protection from Evil and Good and Spirit Guardians on. Do not leave the Cleric list rigid out of sympathy. The class text tells you to change it. A Druid at the same table is doing the same Wisdom prepared-caster job with a different column; let that character keep terrain and travel, and keep the Cleric column on rescue plus one concentration opener.</p>
<h2>DND Cleric Spells FAQ</h2>
<h3>How many Cleric spells do I prepare?</h3>
<p>In 2014, prepare Wisdom modifier + Cleric level (minimum 1) spells of a level you have slots for. In 2024, use the Prepared Spells column of the Free Rules Cleric Features table: 4 at level 1, 5 at 2, 6 at 3, 7 at 4, and 9 at 5. Domain or subclass always-prepared spells do not count against that number.</p>
<h3>Is Cleric a known-spell caster?</h3>
<p>No. Cleric is a prepared caster. You choose from the Cleric list after a Long Rest. Cantrips are known separately and are not part of the daily level 1+ count. Casting a prepared spell does not un-prepare it.</p>
<h3>Can I cast a Cleric ritual if I did not prepare the spell?</h3>
<p>No. In 2014 you can cast a Cleric spell as a ritual if it has the ritual tag and you have it prepared. In 2024, a spell with the Ritual tag also requires that the caster have it prepared.</p>
<h3>Do Life Domain spells use a daily prepare slot?</h3>
<p>No. Once you gain them, Life Domain spells are always prepared and do not count against the daily number. 2014 Life starts at 1st level (Bless and Cure Wounds). 2024 Life starts at Cleric 3 (Aid, Bless, Cure Wounds, Lesser Restoration). Do not also pick those names on the counted list.</p>
<h3>Does 2024 Divine Intervention replace Revivify on my prepared list?</h3>
<p>No. 2024 Divine Intervention is a 10th-level class feature, not a prepared spell. It can cast a Cleric spell of level 5 or lower that is not a Reaction, without a slot or Material components, once per Long Rest. Before level 10, keep Revivify prepared if you want that button. At 10 it is still only once per Long Rest, so a prepared Revivify still matters for a second casting.</p>
<p>Write the year, the counted number, the always-prepared block, one concentration opener, and one non-concentration rescue. If those five lines exist, stop adding names.</p>
`;

export const dndClericSpellsArticleHtmlZh = String.raw`
<p><strong>dnd 牧师法术</strong>（dnd cleric spells）是牧师（Cleric）每天从职业法术表准备出来的名单，不是把 1 到 9 环抄进角色卡。2014 的准备数等于感知调整值加牧师等级（最少 1），长休后可换整份名单；2024 在 1 级先选四个 1 环，之后读职业表 Prepared Spells 列（1 级 4、2 级 5、3 级 6、4 级 7、5 级 9），长休后可把名单上的任意法术换成其他已有环位的牧师法术；领域法术始终准备、不占名额，但 2014 从 1 级选领域，2024 的 1 级是神圣职阶（Divine Order），3 级才选子职业。急救位留给治愈真言（Healing Word，本站职业文也作医疗真言）；专注一次只能维持一个主工作，2024 桌不要同时开启祝福术（Bless）、灵体武器（Spiritual Weapon）和灵体卫士（Spirit Guardians）。</p>

<table>
  <thead>
    <tr>
      <th>职责</th>
      <th>这一格要挡住什么事故</th>
      <th>默认写入名单</th>
      <th>不要和它抢同一格资源</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>急救</strong></td>
      <td>队友倒地，你还想保住自己的动作</td>
      <td>治愈真言</td>
      <td>不要只用动作位、还得走近的治愈伤口（Cure Wounds）顶这个坑</td>
    </tr>
    <tr>
      <td><strong>专注开场</strong></td>
      <td>整场战斗只挂得住一个主法术</td>
      <td>祝福术；5 级常改灵体卫士</td>
      <td>2024 不要再叠灵体武器；虔诚护盾（Shield of Faith）也要专注</td>
    </tr>
    <tr>
      <td><strong>不占专注的输出</strong></td>
      <td>专注已经挂上之后，回合里还要做事</td>
      <td>光导箭（Guiding Bolt）</td>
      <td>不要四个 1 环全是专注增益</td>
    </tr>
    <tr>
      <td><strong>解状态 / 死人</strong></td>
      <td>中毒、麻痹、魔法效果、阵亡</td>
      <td>次级复原术（Lesser Restoration）、解除魔法（Dispel Magic）、回生术（Revivify）</td>
      <td>没有对应环位就先别写；有领域白给就不要再占名额</td>
    </tr>
  </tbody>
</table>

<h2>先写出明天能准备几个</h2>
<p>牧师是准备施法者。戏法是已知的，不占每天那一列；1 环及以上要从牧师法术表里准备，而且只能准备你已经拥有环位的法术。规则正文在 <a href="${DND_CLERIC_2014_RULES_URL}" rel="noreferrer noopener">2014 Basic Rules 牧师施法</a> 和 <a href="${DND_CLERIC_2024_RULES_URL}" rel="noreferrer noopener">2024 Free Rules 牧师施法</a>。卡顶先写你们桌用哪一年，再算格子，两套公式不能混用。</p>
<p>2014：准备数 = 感知调整值 + 牧师等级，最少 1。官方例子：3 级牧师、感知 16（+3），准备 6 个 1 环或 2 环，任意组合；当时环位是 4 个 1 环加 2 个 2 环。施放已准备法术不会把它从名单上划掉。长休后可换整份名单；准备新名单要祈祷，每个法术至少按环级花 1 分钟。</p>
<p>2024：1 级先选四个 1 环；之后数量只看职业表 Prepared Spells 列，不再加感知。读到 5 级：1 级 4、2 级 5、3 级 6、4 级 7、5 级 9。3 级的官方例子同样是 6 个 1 环或 2 环任意组合。长休后可替换名单上的<strong>任意</strong>法术。2024 职业条文没有重写 2014 那句按环计时，不要把计时抄进 2024 卡。</p>

<table>
  <thead>
    <tr>
      <th>牧师等级</th>
      <th>2024 Prepared Spells</th>
      <th>2014（感知 16，+3）</th>
      <th>2014（感知 20，+5）</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>4</td>
      <td>4</td>
      <td>6</td>
    </tr>
    <tr>
      <td>2</td>
      <td>5</td>
      <td>5</td>
      <td>7</td>
    </tr>
    <tr>
      <td>3</td>
      <td>6</td>
      <td>6</td>
      <td>8</td>
    </tr>
    <tr>
      <td>4</td>
      <td>7</td>
      <td>7</td>
      <td>9</td>
    </tr>
    <tr>
      <td>5</td>
      <td>9</td>
      <td>8</td>
      <td>10</td>
    </tr>
  </tbody>
</table>

<p>不要说「2024 一定比 2014 能准备更多」。感知 16 时，1 到 4 级两版格子一样，5 级 2024 多 1 格；感知 20 的 2014 牧师在 1 级就有 6 格，比 2024 的固定 4 格宽。感知只改 2014 的格子，不改 2024 的格子。圣武士做不到这种每天整表重配：<a href="${ZH_PALADIN_2024_SPELLS_PATH}">圣武士 2024 法术</a>长休通常只换 1 个，牧师换任意。</p>
<p>2024 的 1 级环位是 2 个 1 环；3 级是 4 个 1 环加 2 个 2 环；5 级是 4 / 3 / 2。准备数不是环位数。4 个准备法术可以反复用那 2 个环位去施放，不要把「能准备 4 个」看成「今天能放 4 个不同的 1 环各一次就结束」。</p>
<p>戏法另算。2014 基础规则：1 级已知 3 个，4 级和 10 级再加，正文没有「升级时换一个戏法」。2024：1 级已知 3 个，每升一级可换 1 个戏法，4 级和 10 级再加；官方推荐神导术（Guidance）、神圣火焰（Sacred Flame）、奇术（Thaumaturgy）。2024 免费规则牧师戏法表只有这 7 个：神导术、光亮术（Light）、修复术（Mending）、抵抗术（Resistance）、神圣火焰、维生术（Spare the Dying）、奇术。表上没有 Toll the Dead，也没有 Word of Radiance。只用免费规则的桌子，不能把这两发写进合法戏法栏。</p>
<p>2024 的神导术在职业法术表 Special 列标了 C，和祝福术抢专注。探索时可以开神导术；战斗里先把专注留给祝福术或灵体卫士，不要两件事一起挂。</p>

<figure class="inline-figure inline-figure--four-three-crop">
  <img class="inline-figure__image inline-figure__image--four-three" src="${DND_CLERIC_SPELLS_PREPARE_ZH_IMAGE_PATH}" alt="木桌上的牧师微缩、地城网格图、空白纸片、骰子、灯笼和日轮火漆，用来写明天的准备名单" width="1364" height="1023" loading="lazy" decoding="async" />
  <figcaption>先在卡顶写规则年份，再把「每日准备」和「领域始终准备」分成两列。两列加起来才是明天能用的法术，混成一列会少算或重复占格。</figcaption>
</figure>

<h2>领域白给不占名额，2024 的 1 级还没有领域</h2>
<p>2014 在 1 级选神圣领域（Divine Domain），到表列等级后，领域法术始终准备，不计入每天准备上限；即使某个名字不在牧师法术表上，对你仍视为牧师法术。2024 的 1 级是神圣职阶，不是领域：守护神职（Protector）给军用武器和重甲，奇术师（Thaumaturge）多一个牧师戏法，并在智力（奥秘）或智力（宗教）检定上加感知调整值（最少 +1）。这两条都不增加 Prepared Spells 列。2024 要到 3 级才选牧师子职业；1 到 2 级没有领域白给，那 4 或 5 个格子必须自己填满。</p>
<p>把 2014 攻略里「创建时就选领域、1 级已经白给祝福术」抄进 2024 角色卡，会多出书上没有的法术。免费规则只完整写出生命领域。桌上若用光、战争、诡术等其他子职业，去翻那本手册的子职业表，仍然适用同一条：始终准备、不占每日名额。不要用 3.5e 领域栏，也不要用不完整资料站把牧师写成「已知法术」。</p>

<table>
  <thead>
    <tr>
      <th>生命领域等级</th>
      <th>2014 始终准备</th>
      <th>2024 始终准备</th>
      <th>选法时差在哪</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1 级 / 3 级起算</td>
      <td>1 级已有祝福术、治愈伤口</td>
      <td>3 级才有：援助术（Aid）、祝福术、治愈伤口、次级复原术</td>
      <td>2014 的 1 级生命牧不用再花名额买祝福术和治愈伤口；2024 的 1 到 2 级必须自己准备</td>
    </tr>
    <tr>
      <td>3 级</td>
      <td>再加次级复原术、<strong>灵体武器</strong></td>
      <td>没有灵体武器；援助术和次级复原术在白给里</td>
      <td>2014 生命牧不必再准备灵体武器；2024 想用就要占一格，而且它现在要专注</td>
    </tr>
    <tr>
      <td>5 级</td>
      <td>希望信标（Beacon of Hope）、回生术</td>
      <td>群体治愈真言（Mass Healing Word）、回生术</td>
      <td>2024 生命牧 5 级白给群体急救；2014 生命牧白给的是希望信标。灵体武器仍然不在 2024 生命表上</td>
    </tr>
  </tbody>
</table>

<p>2024 生命领域 7 级白给生命灵光（Aura of Life）和死亡结界（Death Ward），9 级白给高等复原术（Greater Restoration）和群体治愈伤口（Mass Cure Wounds）。2014 生命领域对应档是死亡结界、信仰守卫（Guardian of Faith），以及群体治愈伤口、死者复活（Raise Dead）。写 5 级名单时用不到生命领域 7 级、9 级那一截，先别抄下来占脑子。</p>
<p>白给会改你剩下的格子。2014、感知 16 的 1 级生命牧：每日 4 格，外加祝福术和治愈伤口已经在身上，这 4 格就该先放治愈真言和光导箭。2024 的 1 级没有白给，官方推荐的四个 1 环是祝福术、治愈伤口、光导箭、虔诚护盾——里面没有急救。3 级选了生命领域之后，祝福术和治愈伤口变成白给，那时再把每日格子让出来。</p>

<h2>急救位为什么必须是治愈真言</h2>
<p>急救要的不是把血条奶满，而是用附赠动作、在 60 尺外把倒地的人拉回行动顺序。治愈真言两版都是附赠动作、60 尺、只有言语成分（Verbal）。<a href="https://www.dndbeyond.com/spells/2140-healing-word" rel="noreferrer noopener">2014 治愈真言</a>回复 1d4 + 施法调整值，对不死生物和构装无效，升环每高一环 +1d4。<a href="https://www.dndbeyond.com/spells/2619143-healing-word" rel="noreferrer noopener">2024 治愈真言</a>回复 2d4 + 施法调整值，该页没有写不死/构装限制，升环每高一环 +2d4。骰子变了，职责没变。</p>
<p>治愈伤口吃动作，还要靠近。用它去救已经倒地、还可能被借机的队友，等于把你这一回合的光导箭或走位交出去。名单上可以同时准备两者：治愈真言管倒地，治愈伤口管战斗外或你已经站在旁边的补血。缺格时先保治愈真言。2024 生命领域 3 级会白给治愈伤口，更没有理由让它继续占急救格。</p>
<p>2024 施法章写明：一回合只能花费一个法术位来施法。治愈真言（占环位的附赠动作）可以和戏法（不占环位）同一回合；不能再在同一回合用另一个占环位的法术，例如光导箭。2014 的附赠动作施法限制对这组搭配效果相近。所以急救位必须是附赠动作：你才有机会先拉人，再用神圣火焰打一下，而不是整回合只做一件治疗。</p>
<p>队伍里如果已经有吟游诗人准备了治愈真言，牧师仍常该留这一格。诗人的附赠动作还要给激励，挤的是附赠动作，不是谁环位更多。对照 <a href="${ZH_DND_BARD_SPELLS_PATH}">DND 吟游诗人法术</a> 时，比的是附赠动作挤不挤，不是删掉牧师急救。德鲁伊也可以按职责留一个远程拉人按钮，见 <a href="${ZH_DND_DRUID_SPELLS_PATH}">DND 德鲁伊法术</a>；牧师不要因此改去抄纠缠术或神莓术，那不是牧师今晚的格子。</p>
<p>2014 的限制是治疗目标为不死或构装时无效，不是「今天打不死就不能用治愈真言」。活着的队友倒地，仍用治愈真言。2024 该页没写这条限制，不要把 2014 的「对不死无效」自动抄进 2024 卡。骰子练习用 <a href="${ZH_DICE_ROLLER_PATH}">D&amp;D 骰子工具</a>：2014 掷 1d4 加感知，2024 掷 2d4 加感知，确认你没有拿错年份的骰。</p>
<p>2 级起，2024 引导神力（Channel Divinity）带神圣火花（Divine Spark）：动作用圣徽指向 30 尺内另一名可见生物（不能点自己），掷 1d8 加感知，选回复或造成暗蚀/光耀伤害。它不是准备法术，不能写进每日名单格子，也不能替代 60 尺附赠动作拉人。名单上叠三个治疗法术，通常是在浪费 2024 已经给你的引导神力。</p>

<h2>1 级、3 级、5 级短名单</h2>
<p>下面是能写进卡的起点，不是永远正确的构筑。先看年份和子职业，再看明天地城有没有不死、社交、陷阱或已经会施放祝福术的圣武士。祝福术的骰子、目标和材料不要在这里展开，细节去 <a href="${ZH_DND_BLESS_PATH}">祝福术指南</a>。还没定职业的话，先回 <a href="${ZH_DND_CLASSES_PATH}">DND 职业详解</a>。</p>

<h3>2024 · 1 级（无领域，准备 4）</h3>
<table>
  <thead>
    <tr>
      <th>方案</th>
      <th>四个 1 环</th>
      <th>什么时候用这套</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>官方推荐</strong></td>
      <td>祝福术、治愈伤口、光导箭、虔诚护盾</td>
      <td>免费规则写的教程四法。缺急救：倒地时你只能走过去用动作治疗，或等别人救</td>
    </tr>
    <tr>
      <td><strong>急救优先（推荐开团）</strong></td>
      <td>治愈真言、祝福术、光导箭、治愈伤口</td>
      <td>把虔诚护盾换掉。虔诚护盾和祝福术都要专注，1 级本来也挂不住两个</td>
    </tr>
    <tr>
      <td><strong>队里已有祝福术</strong></td>
      <td>治愈真言、光导箭、治愈伤口、命令术（Command）或庇护术（Sanctuary）</td>
      <td>圣武士或其他人已经准备祝福术时，牧师不必再占同一专注工作</td>
    </tr>
  </tbody>
</table>

<p>1 级只有 2 个 1 环位。名单上的 4 个是「今天能选来放的菜单」，不是「开场全部放完」。默认开场：动作放光导箭或祝福术，附赠动作空着等倒地。不要开场就把两个环位打成两次光导箭，除非这一场没有人会倒。</p>

<h3>2014 · 1 级生命领域（感知 16：每日 4 + 白给 2）</h3>
<p>白给已经是祝福术和治愈伤口。每日 4 格建议：治愈真言、光导箭、虔诚护盾、命令术或庇护术。感知 14（+2）只有 3 格，先保治愈真言、光导箭、命令术，虔诚护盾和祝福术抢专注，有白给祝福术就别再为 AC 再占一格专注增益。感知 18（+4）有 5 格，多出来的一格给侦测魔法或防护善恶（Protection from Evil and Good），不要给第九个治疗。</p>

<h3>2024 · 3 级生命领域（准备 6 + 白给 4）</h3>
<p>白给：援助术、祝福术、治愈伤口、次级复原术。这四格不要再写进每日名单。每日 6 格建议分成四类：急救仍是治愈真言；不占专注输出仍是光导箭；工具给侦测魔法（Detect Magic）或命令术；2 环给援助术已经白给后的「战斗中按钮」——定身术（Hold Person）、灵体武器或沉默术（Silence）。援助术不占专注，危险开始前就可以放，不必和祝福术抢。</p>
<p>这里可以准备灵体武器，但不等于今天开场要放它。<a href="https://www.dndbeyond.com/spells/2619081-spiritual-weapon" rel="noreferrer noopener">2024 灵体武器</a>要专注。卡片上写一句「今日专注 = 祝福术」，灵体武器留在菜单里，等没有祝福术可挂、或祝福术已经断掉再考虑。把三发专注法术都写进名单合法；同一场战斗全开，不合法。</p>

<h3>2014 · 3 级生命领域（感知 16：每日 6 + 白给 4）</h3>
<p>白给：祝福术、治愈伤口、次级复原术、灵体武器。<a href="https://www.dndbeyond.com/spells/2263-spiritual-weapon" rel="noreferrer noopener">2014 灵体武器</a>持续 1 分钟、<strong>不要专注</strong>，可以和祝福术同时开。每日 6 格不要再买灵体武器。建议：治愈真言、光导箭、援助术、定身术或沉默术、侦测魔法、治疗祷言（Prayer of Healing）或防护毒素（Protection from Poison）。3 级官方环位是 4 个 1 环加 2 个 2 环，2 环位很紧，援助术和定身术不要同一场各放一次还指望有剩。</p>

<h3>2024 · 5 级生命领域（准备 9 + 白给 6）</h3>
<p>白给加上群体治愈真言和回生术。每日 9 格先锁：治愈真言（单人倒地仍比群体更快）、光导箭、灵体卫士、解除魔法，再补命令术、侦测魔法、定身术、庇护术，最后一格给灵体武器或防护能量（Protection from Energy）。今日专注默认灵体卫士。祝福术仍在白给里，不必删，但不要和灵体卫士一起维持。回生术已经白给，不要再占每日格；材料组件仍要在装备栏看得到。</p>
<p>免费规则 10 级的神圣干预可以施放未准备的、非反应的 5 环及以下牧师法术，不耗环位、不需材料。那是 10 级以后的事。5 级名单仍把回生术当必须能立刻放的按钮；生命领域已经白给，就别为「以后也许能白嫖」把 5 级格子空出来。</p>

<h3>2014 · 5 级生命领域（感知 16：每日 8 + 白给 6）</h3>
<p>白给加上希望信标和回生术，灵体武器仍在白给且不占专注。每日 8 格先锁治愈真言、光导箭、灵体卫士、解除魔法、援助术。2014 可以把灵体卫士和灵体武器一起开，这是旧攻略常教、且在 2014 合法的组合；换到 2024 桌必须拆掉。剩下的格子给侦测魔法、定身术、命令术。不要为了把 9 环名字抄进卡而挤掉解除魔法。</p>
<p>不是生命领域：先把你那本子职业表的始终准备抄到「白给」列，再从上面的每日名单里划掉重复的名字。缺的急救、专注、不占专注输出，用每日格子补。免费规则没有把其他领域的完整法术表印出来，这里不编一份假的战争领域或光明领域名单。</p>

<h2>专注只能维持一个主工作</h2>
<p>祝福术要专注。灵体卫士要专注。2024 灵体武器要专注，升环改为每高一环 +1d8。2014 灵体武器不要专注，升环是每高两环 +1d8。旧中文视频若按 2014 教「祝福术 + 灵体武器 + 灵体卫士一起开」，在 2024 桌上会直接撞车：三个名字里至少两个要专注，你只能维持一个。</p>

<table>
  <thead>
    <tr>
      <th>今天的战场</th>
      <th>2014 可同时开</th>
      <th>2024 只能选一个主专注</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>队里攻击检定多、敌人会控人</td>
      <td>祝福术 + 灵体武器</td>
      <td>祝福术；灵体武器留着但别开</td>
    </tr>
    <tr>
      <td>敌人必须靠近你、你能站住</td>
      <td>灵体卫士 + 灵体武器</td>
      <td>灵体卫士；灵体武器不要叠上去</td>
    </tr>
    <tr>
      <td>有人已经在维持祝福术</td>
      <td>你改开灵体卫士，灵体武器仍可加</td>
      <td>你开灵体卫士或光导箭，不要再开第二发祝福术</td>
    </tr>
    <tr>
      <td>1 级，还没有 2 环、3 环</td>
      <td>祝福术或虔诚护盾，二选一</td>
      <td>同样二选一；官方四法里这两发都要专注</td>
    </tr>
  </tbody>
</table>

<p>准备和开启是两件事。2024 可以把祝福术、灵体武器、灵体卫士都写进 5 级名单，因为长休后你可能换场景。失败的是同一场战斗里三个一起放。卡片旁写「今日专注」，比多抄三行法术描述管用。专注断了，主工作就没了；体质豁免怎么算，看 <a href="${ZH_DND_CONSTITUTION_PATH}">D&amp;D 体质指南</a>。站位靠前去贴灵体卫士时，先问自己这轮豁免掉了值不值得。</p>
<p>侦测魔法带仪式标签，也带专注。地城门口当仪式放，不要在祝福术已经挂上的战斗里再开。援助术、治愈真言、光导箭、解除魔法、回生术都不靠专注，它们是主专注挂上之后仍然能用的按钮。名单里至少留两个不占专注的战斗法术，否则祝福术一开，你整场只会走位。</p>

<figure class="inline-figure inline-figure--four-three-crop">
  <img class="inline-figure__image inline-figure__image--four-three" src="${DND_CLERIC_SPELLS_FOCUS_ZH_IMAGE_PATH}" alt="分屏微缩：左侧暖光里牧师与金色环罩的队友、旁边有灵体锤；右侧冷光里牧师被灵体卫士环绕、仍有灵体锤" width="1364" height="1023" loading="lazy" decoding="async" />
  <figcaption>2014 的灵体武器可以和祝福术或灵体卫士叠开；2024 不能。先在纸上圈出「今日只开哪一个」，再掷先攻。</figcaption>
</figure>

<figure class="inline-figure inline-figure--four-three-crop">
  <img class="inline-figure__image inline-figure__image--four-three" src="${DND_CLERIC_SPELLS_TOKEN_ZH_IMAGE_PATH}" alt="圆形牧师头像 Token 立在切割垫上，旁边是持锤的牧师微缩" width="1364" height="1023" loading="lazy" decoding="async" />
  <figcaption>名单写清以后，地图上要能一眼看出谁是牧师、谁正在维持专注。头像清楚，比把法术名印满边框更有用。</figcaption>
</figure>

<p>名单确定后，再用 <a href="${ZH_CLERIC_PRESET_EDITOR_PATH}">Token Maker</a> 做一枚牧师地图 Token，用中文预设「牧师」。先完成选法，再做 Token；编辑器不会替你算准备数。</p>

<h2>不要把电子游戏和资料站流程抄进牧师卡</h2>
<p>《博德之门 3》里神术常按等级自动解锁，那是电子游戏，不是桌团准备规则。桌团牧师每天要写名单，长休才能换；领域白给是子职业表上的始终准备，不是游戏里点到等级就出现的全表。</p>
<p>中文资料站若把牧师写成「已知法术」，不要当规则。官方 2014 和 2024 牧师条文都是准备。游侠 2014 才是已知法术那一套，不能套到牧师头上。灰机等资料站摘要若出现「已知法术」，回到 D&amp;D Beyond 的牧师施法段核对，不要把资料站句子抄进角色卡。</p>
<p>不要抄 9 环表来充 1 级卡。没有对应环位就不能准备。3 级不要写回生术，除非你已经有 3 环位。5 级没有 5 环位，不能准备群体治愈伤口；2024 生命领域要 9 级才白给这一发。</p>
<p>不要把 Toll the Dead 或 Word of Radiance 写成 2024 免费规则默认牧师戏法。付费 2024《玩家手册》有没有把它们加进牧师表，本次没有打开那本书，不作断言。只用免费规则：戏法就在那 7 个里面选。Tasha、Xanathar 的可选名字也不是 2014 基础规则牧师表的一部分，桌上没开那些书就不要写。</p>
<p>不要 1 级就写 2024 领域白给。不要把 2014 生命领域 3 级的灵体武器，当成 2024 生命领域仍然白给。不要在 2024 桌用「无专注灵体武器」当默认。战争领域在编辑文里另有引导神力版本，那不是免费规则生命领域，也不是今晚 1 级卡该抄的句子。</p>

<h2>DND 牧师法术常见问题 FAQ</h2>
<h3>牧师是准备法术还是已知法术？</h3>
<p>准备法术。2014 和 2024 的牧师都从牧师法术表准备 1 环及以上法术；戏法是已知的，不占每日准备格。中文资料若写成「已知法术」，不要抄进牧师卡。</p>

<h3>能准备多少？2014 和 2024 怎么算？</h3>
<p>2014 等于感知调整值加牧师等级，最少 1。2024 的 1 级先选四个 1 环，之后只看职业表 Prepared Spells 列：1 级 4、2 级 5、3 级 6、4 级 7、5 级 9。两版长休后都可换名单；2024 写明可换任意，2014 是换整份并按环计时。</p>

<h3>领域法术占准备名额吗？2024 几级选领域？</h3>
<p>不占。始终准备的领域或子职业法术不计入每日准备上限。2014 从 1 级选领域；2024 的 1 级是神圣职阶，3 级才选子职业，所以 1 到 2 级没有领域白给。</p>

<h3>急救位为什么是治愈真言，而不是治愈伤口？</h3>
<p>治愈真言是 60 尺附赠动作，用来把倒地的人拉回行动顺序，还不占专注。治愈伤口吃动作、要靠近。2014 治愈真言是 1d4 + 调整值，2024 是 2d4 + 调整值；职责相同，骰子不同。</p>

<h3>2024 还能同时开灵体武器和灵体卫士吗？</h3>
<p>不能。2024 灵体武器要专注，灵体卫士也要专注，同一时间只能维持一个。2014 灵体武器不要专注，可以和灵体卫士或祝福术叠开。2024 把它们写进名单可以，同一场全开不行。</p>

<h2>长休后写名单的检查清单</h2>
<ul>
  <li>卡顶写了 2014 或 2024，没有把两套准备公式写在同一行。</li>
  <li>每日准备数已经按公式或 Prepared Spells 列算完；戏法另列，没有算进这格。</li>
  <li>领域或子职业白给抄在第二列，没有再占每日名额；2024 的 1 到 2 级这一列是空的。</li>
  <li>急救格是治愈真言，不是只用治愈伤口顶倒地。</li>
  <li>今日只圈了一个专注主工作；2024 没有计划同时开启祝福术、灵体武器和灵体卫士。</li>
  <li>名单上的法术都有对应环位，没有从 9 环表倒抄。</li>
  <li>2024 免费规则戏法没有写 Toll the Dead 或 Word of Radiance；电子游戏神术表没有当成桌团准备流程。</li>
</ul>
`;
