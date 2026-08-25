import {
  DND_2024_CHARACTER_CLASSES_URL,
  DND_2024_CHARACTER_CREATION_URL,
  DND_BEYOND_CLASSES_CATALOG_URL,
  DND_CLASSES_COMPARISON_TOKEN_ROW_PATH,
  DND_CLASSES_COMPARISON_VIDEO_ID,
  DND_CLASSES_COMPARISON_VIDEO_PLACEHOLDER_PATH,
  EN_DICE_ROLLER_PATH,
  EN_DND_ARTIFICER_PATH,
  EN_DND_CHARACTER_SHEET_PATH,
  EN_DND_CLASSES_PATH,
  EN_DND_CLASSES_RANKED_PATH,
  EN_DND_FIGHTER_PATH,
  EN_DND_PALADIN_PATH,
  EN_DND_RACES_PATH,
  EN_DND_STATS_PATH,
  EN_EDITOR_PATH,
  EN_PLAYERS_HANDBOOK_DND_5E_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_ARTIFICER_PATH,
  ZH_DND_CHARACTER_SHEET_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_DND_CLASSES_RANKED_PATH,
  ZH_DND_FIGHTER_PATH,
  ZH_DND_PALADIN_PATH,
  ZH_DND_RACES_PATH,
  ZH_DND_STATS_PATH,
  ZH_EDITOR_PATH,
  ZH_PLAYERS_HANDBOOK_DND_5E_PATH,
  liteVideoEmbed,
} from './shared';

export const dndClassesComparisonArticleHtml = String.raw`
<p>There are two honest answers to "How many official <strong>DND classes</strong> are there?" The 2024 Player's Handbook has 12. Add Artificer, an official class published in Eberron material, and the count becomes 13. The <a href="${DND_2024_CHARACTER_CREATION_URL}" rel="noreferrer noopener">2024 Free Basic Rules</a> put that decision first during character creation: choose a class, then work out origin and ability scores.</p>

<p>The number gets muddled when a list mixes handbook classes with playtest material or third-party releases. We will keep those categories separate. Then, instead of sorting the classes into a power tier, we will compare them by the jobs a party needs and what each one can do on its first combat turn at level 1.</p>

<p>If you want a tier list, use <a href="${EN_DND_CLASSES_RANKED_PATH}">DnD classes ranked</a>. If you want a slower introduction to each class fantasy, read <a href="${EN_DND_CLASSES_PATH}">DND classes explained</a>. Stay here when session one is close and the blank class line on your sheet needs an answer.</p>

<h2>How many DND classes are there?</h2>

<p>The short answer is 12 in the 2024 Player's Handbook, or 13 when the official Artificer is included. Playtest and third-party classes do not belong in that count.</p>

<p>The 2024 Free Basic Rules chapter on <a href="${DND_2024_CHARACTER_CLASSES_URL}" rel="noreferrer noopener">Character Classes</a> lists Barbarian, Bard, Cleric, Druid, Fighter, Monk, Paladin, Ranger, Rogue, Sorcerer, Warlock, and Wizard. Those are the same 12 class names found in the 2014 Player's Handbook. The 2024 book rewrote class features, moved subclass timing, and gave martial characters Weapon Mastery, but it did not add a thirteenth handbook class.</p>

<p>Artificer is that thirteenth official class. D&amp;D Beyond lists the current version under <em>Eberron: Forge of the Artificer</em> and marks its older <em>Tasha's Cauldron of Everything</em> entry as legacy content. It is a Wizards of the Coast class, but it is not part of the 2024 Player's Handbook.</p>

<p>Several familiar names sit outside the official 13:</p>

<ul>
<li><strong>Psion</strong> is still playtest material. It may appear in news stories and class roundups, but it is not a published core class.</li>
<li><strong>Blood Hunter</strong> is a Critical Role class hosted on D&amp;D Beyond. It remains third-party content.</li>
<li><strong>Gunslinger, Pugilist, Illrigger, Kindred, and other licensed extras</strong> appear in the D&amp;D Beyond storefront, but storefront availability does not make them part of the official 13.</li>
</ul>

<p>Ask the Dungeon Master which books the campaign allows before you build an Artificer. A "2024 Player's Handbook only" table has 12 choices. A table that allows the current Eberron book has 13.</p>

<h2>Think in party jobs</h2>

<p>A class fantasy can sell you on a character, but it will not cover a missing job by itself. A party of four Bards may be wonderfully entertaining and still struggle to hold a doorway, revive a fallen ally, spot a tripwire, or reshape a fight with a spell. The official <a href="${DND_2024_CHARACTER_CREATION_URL}" rel="noreferrer noopener">2024 class overview</a> labels class complexity Low, Average, or High. Put that beside four practical jobs:</p>

<table><thead><tr><th scope="col">Job at the table</th><th scope="col">What the job does in play</th><th scope="col">Classes that cover it without stretching</th></tr></thead><tbody>
<tr><th scope="row">Frontline</th><td>Hold a square, take hits, stop a rush</td><td>Barbarian, Fighter, Paladin, Armorer or Battle Smith Artificer</td></tr>
<tr><th scope="row">Recovery</th><td>Restore Hit Points or prevent a drop</td><td>Cleric, Druid, Bard, Paladin</td></tr>
<tr><th scope="row">Skills and scouting</th><td>Locks, traps, stealth, tracking, social reads</td><td>Rogue, Ranger, Bard, Monk</td></tr>
<tr><th scope="row">Arcane problem-solving</th><td>Control, damage spells, rituals, tools</td><td>Wizard, Sorcerer, Warlock, Druid, Artificer</td></tr>
</tbody></table>

<p>Many classes handle more than one job. Paladin can stand up front and bring someone back into the fight. Bard mixes recovery with a deep skill list. Druid moves between healing and battlefield magic. That overlap gives the group room to improvise, though it does not make an entirely empty job disappear.</p>

<p>This four-job map fits a typical party of four or five. A group with one to three players has a different survival problem, so it needs advice built around small-party coverage rather than a general class comparison.</p>

<h2>All 13 DND classes at a glance</h2>

<p>The level 1 Hit Point maximums below come from the 2024 Free Basic Rules. Artificer is the exception: its D&amp;D Beyond class card gives it a d8 Hit Point Die. The Low, Average, and High labels also come from the official 2024 overview. Artificer has no row in that chart, so its entry keeps the judgment that still needs confirmation from the published toolkit.</p>

<table><thead><tr><th scope="col">Class</th><th scope="col">Primary ability</th><th scope="col">Level 1 HP</th><th scope="col">Official complexity</th><th scope="col">Default job</th><th scope="col">First-turn action (level 1, 2024)</th></tr></thead><tbody>
<tr><th scope="row">Barbarian</th><td>Strength</td><td>12 + Con. modifier</td><td>Average</td><td>Frontline</td><td>Bonus Action Rage, then a Strength weapon attack</td></tr>
<tr><th scope="row">Bard</th><td>Charisma</td><td>8 + Con. modifier</td><td>High</td><td>Recovery / skills</td><td>Bonus Action Bardic Inspiration, then a cantrip or weapon</td></tr>
<tr><th scope="row">Cleric</th><td>Wisdom</td><td>8 + Con. modifier</td><td>Average</td><td>Recovery</td><td>Guiding Bolt, Healing Word, or a weapon plus Divine Order</td></tr>
<tr><th scope="row">Druid</th><td>Wisdom</td><td>8 + Con. modifier</td><td>High</td><td>Recovery / arcane</td><td>Faerie Fire, Thunderwave, or a cantrip; Wild Shape is level 2</td></tr>
<tr><th scope="row">Fighter</th><td>Strength or Dexterity</td><td>10 + Con. modifier</td><td>Low</td><td>Frontline</td><td>Attack with Weapon Mastery; Second Wind if you are already hurt</td></tr>
<tr><th scope="row">Monk</th><td>Dexterity and Wisdom</td><td>8 + Con. modifier</td><td>High</td><td>Skills / frontline</td><td>Martial Arts attack; Unarmored Defense is your AC formula</td></tr>
<tr><th scope="row">Paladin</th><td>Strength and Charisma</td><td>10 + Con. modifier</td><td>Average</td><td>Frontline / recovery</td><td>Weapon attack plus Weapon Mastery; Lay On Hands if someone is down</td></tr>
<tr><th scope="row">Ranger</th><td>Dexterity and Wisdom</td><td>10 + Con. modifier</td><td>Average</td><td>Skills / frontline</td><td>Hunter's Mark (Favored Enemy) plus a weapon attack</td></tr>
<tr><th scope="row">Rogue</th><td>Dexterity</td><td>8 + Con. modifier</td><td>Low</td><td>Skills</td><td>Sneak Attack when you have a legal trigger</td></tr>
<tr><th scope="row">Sorcerer</th><td>Charisma</td><td>6 + Con. modifier</td><td>High</td><td>Arcane</td><td>Innate Sorcery, then a cantrip or a 1st-level spell</td></tr>
<tr><th scope="row">Warlock</th><td>Charisma</td><td>8 + Con. modifier</td><td>High</td><td>Arcane</td><td>Eldritch Blast or another Pact Magic option</td></tr>
<tr><th scope="row">Wizard</th><td>Intelligence</td><td>6 + Con. modifier</td><td>Average</td><td>Arcane</td><td>Cantrip or 1st-level spell; Ritual Adept for out-of-combat work</td></tr>
<tr><th scope="row">Artificer</th><td>Intelligence</td><td>8 + Con. modifier</td><td>[confirm: not on 2024 overview table; treat as Average to High]</td><td>Arcane / support</td><td>Cantrip or 1st-level spell from behind the front line</td></tr>
</tbody></table>

<p>Give your highest ability score to the class's primary ability. Background increases then apply to three listed abilities under the 2024 rules. The <a href="${EN_DND_STATS_PATH}">DnD stats guide</a> will help you place all six numbers once the class is settled.</p>

<h2>What each class does on the first combat turn</h2>

<p>These examples use 2024 level 1 features. Most 2024 characters do not have a subclass yet; the Free Basic Rules tell you to write one down when you start at level 3 or higher. You can plan that later identity now, but you do not need it to play the first session.</p>

<h3>Frontline</h3>

<p><strong>Barbarian.</strong> Rage is usually the first Bonus Action, provided you are not wearing Heavy armor. Follow it with a Strength weapon attack. While Rage is active, you resist Bludgeoning, Piercing, and Slashing damage, add Rage damage, and gain Advantage on Strength checks and saves. You cannot cast or concentrate on spells at the same time. Reckless Attack arrives at level 2, so leave it off a level 1 sheet. Your Unarmored Defense is 10 + Dexterity modifier + Constitution modifier, and you may still use a Shield.</p>

<p><strong>Fighter.</strong> This is the straightforward, Low-complexity frontline. Fighting Style, Second Wind, and Weapon Mastery all arrive at level 1. Attack with the weapon you mastered and use its mastery property. If you have already taken damage, Second Wind is available as a Bonus Action. Extra Attack waits until level 5. Once Fighter feels right, the <a href="${EN_DND_FIGHTER_PATH}">DnD Fighter guide</a> has the full level 1 build.</p>

<p><strong>Paladin.</strong> A 2024 Paladin starts with Spellcasting, Lay On Hands, and Weapon Mastery. Divine Smite is not the defining level 1 move. Most first turns begin with a mastered weapon attack. If an ally has fallen to 0 Hit Points, use Lay On Hands instead. Your 1st-level slots can pay for Heroism, Bless, or Cure Wounds; there is no need to burn them all in the opening round. The <a href="${EN_DND_PALADIN_PATH}">DnD Paladin guide</a> covers smite timing at later levels.</p>

<p><strong>Monk.</strong> At level 1, the kit is Martial Arts plus Unarmored Defense. Armor Class equals 10 + Dexterity modifier + Wisdom modifier. Attack with an unarmed strike or Monk weapon, then use Martial Arts for the bonus unarmed strike. Flurry of Blows has to wait until the Focus feature appears on your sheet. Monk earns its High-complexity label because Dexterity, Wisdom, and Constitution all compete for your ability scores.</p>

<h3>Recovery</h3>

<p><strong>Cleric.</strong> Spellcasting and Divine Order are ready at level 1. The Free Basic Rules recommend Bless, Cure Wounds, Guiding Bolt, and Shield of Faith as the first four prepared 1st-level spells. Cast Guiding Bolt when the group needs offense. Use Healing Word when someone is already down. A Protector Cleric, with Martial weapon and Heavy armor training, can also open with a weapon attack. Channel Divinity comes later.</p>

<p>JoCat's <em>A Crap Guide to D&amp;D [5th Edition] - Cleric</em> is still a funny introduction to the Cleric fantasy, but it uses the 2014 feature list and gives the domain at level 1. Watch it for the older class's personality. When you fill a 2024 sheet, copy Spellcasting and Divine Order from the Free Basic Rules instead.</p>

${liteVideoEmbed(DND_CLASSES_COMPARISON_VIDEO_ID, 'A Crap Guide to D&D [5th Edition] - Cleric', {
  src: DND_CLASSES_COMPARISON_VIDEO_PLACEHOLDER_PATH,
  alt: 'JoCat fifth-edition Cleric recap thumbnail for a 2014 class walkthrough',
})}

<p>Caption: JoCat, <em>A Crap Guide to D&amp;D [5th Edition] - Cleric</em>. This video uses the 2014 fifth-edition Cleric. Enjoy the tone, but do not copy its domain timing onto a 2024 character.</p>

<p><strong>Druid.</strong> Spellcasting, Druidic, and Primal Order make up the level 1 package. Wild Shape arrives at level 2 and uses a Bonus Action in the 2024 rules, so a first-level Druid cannot open by shapeshifting. Faerie Fire, Thunderwave, Cure Wounds, or a cantrip are sensible first-round choices. Primal Order is the early fork: Magician grants an extra cantrip and more prepared spells, while Warden grants armor training. Pick Warden if you expect to play closer to the front line.</p>

<p><strong>Bard.</strong> Bardic Inspiration uses a Bonus Action and gives one d6 to a creature within 60 feet that can see or hear you. At level 1, you get uses equal to your Charisma modifier per Long Rest. After handing out the die, cast Vicious Mockery, Healing Word, or Dissonant Whispers, or make a weapon attack. Bard is High complexity because its first turn can involve both a limited pool of inspiration dice and a prepared spell list. Jack of All Trades does not arrive until level 2.</p>

<h3>Skills and scouting</h3>

<p><strong>Rogue.</strong> Sneak Attack, Thieves' Cant, and Weapon Mastery are all on the level 1 sheet. Sneak Attack adds damage once per turn when you meet a legal trigger, such as having Advantage or an ally beside the target. Cunning Action is not available yet. Your opening job is simple: find a valid Sneak Attack and land the hit. If the trigger is missing, attack anyway and leave off the extra dice. Rogue is Low complexity in combat, while its broad skill list does much of the work outside initiative.</p>

<p><strong>Ranger.</strong> A 2024 Ranger starts with Spellcasting, Favored Enemy, and Weapon Mastery. Favored Enemy always prepares Hunter's Mark and, at level 1, lets you cast it twice per Long Rest without spending a spell slot. Mark the target, then attack it. Hunter's Mark requires concentration, so protect that resource and do not try to run another concentration spell beside it.</p>

<p><strong>Monk as scout.</strong> A Monk can cover scouting when Fighter or Paladin already owns the doorway. Speed, Stealth, and unarmed attacks support that job, though the first combat turn remains the same Martial Arts sequence. Most of the scouting happens before anyone rolls initiative.</p>

<h3>Arcane problem-solving</h3>

<p><strong>Wizard.</strong> Spellcasting, Ritual Adept, and Arcane Recovery all start at level 1, with Intelligence as the spellcasting ability. In round one, use a cantrip such as Fire Bolt, Ray of Frost, or Mind Sliver, or spend a 1st-level slot on an option such as Magic Missile. Shield is a Reaction, and Sleep remains an option if the table uses that spell. Ritual Adept pays off between fights rather than during initiative. With only 6 + Constitution modifier Hit Points, the Wizard belongs behind the front line.</p>

<p><strong>Sorcerer.</strong> Spellcasting and Innate Sorcery arrive together at level 1. Turn on Innate Sorcery as a Bonus Action to raise your spell save DC and gain Advantage on Sorcerer spell attack rolls for its duration, then cast. Metamagic is not available at this level. The prepared list is shorter than a Wizard's, but each choice lands with more force.</p>

<p><strong>Warlock.</strong> The 2024 Warlock begins with Pact Magic and Eldritch Invocations. You know two cantrips and have a small spell-slot pool that returns after a Short Rest. Eldritch Blast is the usual first-round move, unless your invocations steer the build toward something else. The patron subclass comes later. Save those limited slots unless the opening fight is clearly the day's main event.</p>

<p><strong>Artificer.</strong> Artificer is not in the 2024 Player's Handbook. Intelligence is its primary ability and its Hit Point Die is a d8. From behind cover, the first turn is usually a cantrip or 1st-level spell. A melee Autognome-style attack can make sense if the table's version and subclass support Armorer or Battle Smith and that subclass is already available. Before filling the sheet, confirm the exact level 1 feature names in <em>Eberron: Forge of the Artificer</em>. The <a href="${EN_DND_ARTIFICER_PATH}">DND Artificer guide</a> walks through the class in more detail.</p>

<h2>2014 vs 2024: changes that affect your pick</h2>

<p>The 12 handbook class names stayed put. What those classes can do in session one did not.</p>

<p><strong>Subclass timing changed.</strong> The 2024 creation rules tell you to write a subclass when the character starts at level 3 or higher. Several 2014 classes chose one at level 1, including Cleric domain, Sorcerer origin, and Warlock patron. Copying an older "pick your domain at creation" instruction onto a 2024 sheet gives the character a feature too soon.</p>

<p><strong>Martial classes gained Weapon Mastery.</strong> A 2024 Barbarian, Fighter, Paladin, Ranger, or Rogue has Weapon Mastery at level 1. The first turn for a 2014 Fighter revolves around Fighting Style and Second Wind; the 2024 version also uses a mastery property. Write the rules year at the top of the sheet when the group owns both books.</p>

<p><strong>Half casters receive Spellcasting earlier.</strong> A 2024 Paladin or Ranger can cast at level 1. The 2014 Paladin gains spell slots and Divine Smite later. At a 2024 table, do not promise a first-level Smite, but do remember that the Paladin already has spells.</p>

<p><strong>Character creation uses a different order.</strong> Class comes first in 2024. Origin, which combines background, species, and two languages, follows. Ability scores are step 3, and species do not raise those scores under the 2024 core rules. Use the <a href="${EN_PLAYERS_HANDBOOK_DND_5E_PATH}">Player's Handbook version guide</a> to settle the book question, then follow the <a href="${EN_DND_CHARACTER_SHEET_PATH}">DnD character sheet guide</a> when it is time to fill the boxes.</p>

<p><strong>Artificer has a newer source.</strong> Many 2014 tables used <em>Eberron: Rising from the Last War</em> or <em>Tasha's Cauldron of Everything</em>. A 2024 table that allows Artificer now looks to <em>Eberron: Forge of the Artificer</em>. The class name is familiar, but the print version matters. Check the book before copying infusions or feature names.</p>

<p>If the campaign uses 2014 rules, stick with the 2014 class features throughout. A sheet that combines the 2024 Ranger's Hunter's Mark package with the 2014 Ranger's Favored Terrain package will cause trouble as soon as play begins.</p>

<h2>Choose a class with three questions</h2>

<p>Work through these in order. You are done when only one class feels right.</p>

<h3>1. What sounds good on round one?</h3>

<p>For "hit something and stay standing," begin with Barbarian, Fighter, Paladin, or Monk. For spellcasting, look at Cleric, Druid, Bard, Wizard, Sorcerer, Warlock, or Artificer. Rogue and Ranger fit the player who wants to set up one strong hit.</p>

<h3>2. How many decisions do you want each turn?</h3>

<p>The 2024 overview labels Fighter and Rogue as Low complexity. Barbarian, Cleric, Paladin, Ranger, and Wizard are Average. Bard, Druid, Monk, Sorcerer, and Warlock are High. These labels measure how many rules and choices compete for your attention, not how strong the class is. If learning the game sounds more fun than studying the character sheet, start with Low or Average.</p>

<h3>3. Which party job is still empty?</h3>

<p>Cleric, Druid, Bard, and Paladin can cover recovery. Rogue, Ranger, and Bard are natural choices for skills. Fighter, Barbarian, and Paladin make dependable frontliners. Wizard, Sorcerer, Warlock, and Druid bring the arcane tools. Doubling up is legal, but a completely empty job tends to become obvious by the second session.</p>

<p>Those answers should leave one class or a close pair. Between Fighter and Paladin, choose Fighter for the cleanest frontline turn or Paladin for Lay On Hands and a 1st-level spell. Between Wizard and Sorcerer, choose Wizard for the spellbook and rituals or Sorcerer for Innate Sorcery and a shorter list. Still stuck? Fighter is a sensible first character. The official overview calls it Low complexity, and Strength or Dexterity can serve as its primary ability, which keeps the rest of the sheet manageable.</p>

<p>Once the class is set, move to origin and scores. The <a href="${EN_DND_RACES_PATH}">DnD races guide</a> covers the species step, and the <a href="${EN_DND_CHARACTER_SHEET_PATH}">character sheet guide</a> gives you the box order.</p>

<h2>Mistakes that cause trouble at the table</h2>

<p><strong>Blurring the 12-class and 13-class lists.</strong> Twelve means the Player's Handbook roster. Thirteen means that roster plus Artificer. Write down which books the campaign allows.</p>

<p><strong>Using a 2014 domain or origin chart for a 2024 character.</strong> Cleric Divine Order is not a domain, and Sorcerer Innate Sorcery is not a 2014 origin feature. Copy the level 1 list from the rules version you are playing.</p>

<p><strong>Reading a tier list before checking the party.</strong> A lower-ranked class can still fill the missing job perfectly. A top-ranked class that copies work already covered by three party members may leave the fourth job wide open. Save the power debate for the <a href="${EN_DND_CLASSES_RANKED_PATH}">ranked list</a>; fill the empty job first.</p>

<p><strong>Choosing the "safe" class you do not want to play.</strong> The Free Basic Rules tell players to discuss the campaign tone with the DM and choose a class they want. Caring about a High-complexity character is better than abandoning a Low-complexity one after a week.</p>

<p><strong>Making the token before choosing the class.</strong> Token Maker crops and frames the art you bring to it; it does not assign class features. Put a class on the sheet first, then make the portrait match.</p>

<h2>Make the class readable on the VTT map</h2>

<p>Once the sheet has a class, make sure the map still tells everyone who is who at normal table zoom. One visual rule per party job is easier to read than a different border language for every character.</p>

<ul>
<li>For the <strong>frontline</strong>, crop close to the face or weapon, try the Warrior preset, and use a bright ring with strong contrast.</li>
<li>For <strong>recovery</strong>, lead with the face. The Cleric preset also works for a Paladin, and holy or nature details should stay inside the mask.</li>
<li>For <strong>skills and scouting</strong>, use a tighter crop and darker ring with the Rogue or Ranger preset.</li>
<li>For an <strong>arcane</strong> character, start with the Mage preset. Leave a little space for a glow or focus object without pushing the face out of the circle.</li>
</ul>

<p>Upload a JPG, PNG, or WEBP up to 10 MB. Pick a circle, square, or polygon mask, then add a border. A short label helps when two party members have similar silhouettes. Export a transparent PNG at 256, 512, 1024, or 2048 pixels and bring it into Roll20, Foundry VTT, or Owlbear. During the normal crop-and-export flow, the portrait stays in your browser while you frame it.</p>

<p>Open the <a href="${EN_EDITOR_PATH}">token maker</a> after the class name is on the sheet. If session zero still needs a d20 stat check, the <a href="${EN_DICE_ROLLER_PATH}">D&amp;D dice roller</a> is ready beside it.</p>

<img class="inline-article-image" src="${DND_CLASSES_COMPARISON_TOKEN_ROW_PATH}" alt="Screenshot placeholder: four class tokens in Token Maker, using Warrior, Cleric, Rogue, and Mage presets with circular masks that remain readable at map zoom" loading="lazy" decoding="async" fetchpriority="low" width="1520" height="392" />

<h2>DND classes FAQ</h2>

<h3>What are the 13 DND classes?</h3>

<p>They are Artificer, Barbarian, Bard, Cleric, Druid, Fighter, Monk, Paladin, Ranger, Rogue, Sorcerer, Warlock, and Wizard. The 2024 Player's Handbook contains 12 of them. Artificer is the official thirteenth class and comes from Eberron material.</p>

<h3>What are the 12 basic Dungeons &amp; Dragons classes?</h3>

<p>The handbook roster is Barbarian, Bard, Cleric, Druid, Fighter, Monk, Paladin, Ranger, Rogue, Sorcerer, Warlock, and Wizard. Those class names are the same in the 2014 and 2024 Player's Handbooks, although many features changed between versions.</p>

<h3>What are all the official DND classes?</h3>

<p>The official fifth-edition core set contains those 13 classes. A DM may also allow playtest material such as Psion or third-party options such as Blood Hunter, but neither belongs to the official 13.</p>

<h3>What are some cool DND classes?</h3>

<p>Start with the fantasy you want to play on the first turn. Warlock brings the pact, Paladin the oath, and Bard the inspiration die. Monk fights unarmed. Druid gets the promise of Wild Shape, though that feature begins at level 2 in the 2024 rules. The coolest choice is the turn you are eager to take, not whichever name sits highest on someone else's tier list.</p>

<h3>Do I need one of each DND class in the party?</h3>

<p>No. A party needs its practical jobs covered, not one copy of every class. Several characters can share a job; the risk is leaving a job empty.</p>

<h3>Which DND classes are easiest for a first character?</h3>

<p>The official 2024 overview labels Fighter and Rogue Low complexity. Barbarian, Cleric, Paladin, Ranger, and Wizard are Average. Those are good places to start if you want fewer decisions on each turn. Fighter is the simplest class to lock in when you have no stronger preference.</p>

<h3>When do I pick a subclass?</h3>

<p>A 2024 character who starts at level 1 usually chooses a subclass upon reaching level 3, unless the class text on the sheet says otherwise. If the campaign begins at level 3 or above, the Free Basic Rules tell you to record the subclass during creation.</p>

<h3>Is Artificer one of the DND classes in the 2024 Player's Handbook?</h3>

<p>No. Artificer is an official class available on D&amp;D Beyond, but it is not one of the 12 classes in the 2024 Player's Handbook. Ask the DM whether <em>Eberron: Forge of the Artificer</em> is allowed in the campaign.</p>

<h2>Sources</h2>

<ul>
<li><a href="${DND_2024_CHARACTER_CREATION_URL}" rel="noreferrer noopener">Creating a Character (2024 Free Basic Rules)</a>: class is step 1; this source also contains the Class Overview table and level 1 Hit Points by class.</li>
<li><a href="${DND_2024_CHARACTER_CLASSES_URL}" rel="noreferrer noopener">Character Classes (2024 Free Basic Rules)</a>: the 12 handbook classes and the level 1 features used above.</li>
<li><a href="${DND_BEYOND_CLASSES_CATALOG_URL}" rel="noreferrer noopener">D&amp;D Beyond class catalog</a>: 2024 handbook class cards plus Artificer under <em>Eberron: Forge of the Artificer</em>.</li>
</ul>

<p>The rules text belongs to Wizards of the Coast. Use this comparison to choose a class and prepare for the VTT, then check the Player's Handbook whenever you need the full rule.</p>

<p>After the class is on the sheet, <a href="${EN_EDITOR_PATH}">make the token</a> so the character on the map matches the choice the party just made.</p>
`;

export const dndClassesComparisonArticleHtmlZh = String.raw`
<p>问 <strong>DND职业有哪些</strong>，常会先撞上两个对不上的数字：有人说 12 个，也有人说 13 个。2024《玩家手册》和<a href="${DND_2024_CHARACTER_CLASSES_URL}" rel="noreferrer noopener">免费基础规则「角色职业」章</a>列了 12 个；D&amp;D Beyond 还把《Eberron: Forge of the Artificer》里的奇械师（Artificer）当作完整职业单列。这样算下来，官方职业共有 13 个。试玩内容和第三方职业另算，不能一起塞进这张名单。</p>

<p><a href="${DND_2024_CHARACTER_CREATION_URL}" rel="noreferrer noopener">2024 免费基础规则「创建角色」</a>把职业放在创角第一步。先把数量和书目分清，再看四项队伍职责以及每个职业在 1 级第 1 回合能做什么，开团前就能把职业名稳稳写进角色卡。</p>

<p>想慢慢了解每个职业的玩法感觉，可以读 <a href="${ZH_DND_CLASSES_PATH}">DND 职业详解</a>；想看强度排序，去 <a href="${ZH_DND_CLASSES_RANKED_PATH}">DND 职业排名</a>。如果角色卡还空着，这份对照更直接。Token Maker 不会替你分配职业特性，它负责把选好职业后的立绘裁成地图 Token。</p>

<h2>DND职业有哪些：手册是 12 个，官方一共 13 个</h2>

<p>短答案很简单：2024《玩家手册》有 12 个职业，加上官方奇械师就是 13 个。灵能者（Psion）仍是试玩内容，血猎手（Blood Hunter）来自 Critical Role，属于第三方职业，都不在这 13 个里面。</p>

<p>手册里的 12 个职业是：野蛮人、吟游诗人、牧师、德鲁伊、战士、武僧、圣武士、游侠、游荡者、术士、契术师、法师。2014 和 2024 两版手册沿用同一组职业名，变化落在 1 级特性、子职业时机，以及武者拿到的武器精通上。</p>

<p>第 13 个奇械师出现在 D&amp;D Beyond 的《Eberron: Forge of the Artificer》条目下，<em>Tasha's Cauldron of Everything</em> 版本则被标为旧规则。奇械师是威世智官方职业，只是没有收入 2024《玩家手册》正文。</p>

<p>所以，开团前要先问 DM 允许哪些书。只用 2024《玩家手册》的桌子有 12 个选择；允许当前艾伯伦书目，才有第 13 个奇械师。</p>

<h2>先看队伍缺什么</h2>

<p>职业设定再迷人，也不会自动补上队伍里的空位。四个吟游诗人当然能开团，可到了地城门口，仍然可能没人顶住冲锋、没人把倒地同伴拉起来、没人处理锁和陷阱，也没人用法术改变战场。2024 创建角色页已经用低、中、高标出手册职业的复杂度。再加上四项实际职责，会更容易看出该选谁：</p>

<table><thead><tr><th scope="col">桌上职责</th><th scope="col">这一职实际在做什么</th><th scope="col">不用硬拗就能盖住的职业</th></tr></thead><tbody>
<tr><th scope="row">前排</th><td>占一格、挨打、挡住冲锋</td><td>野蛮人、战士、圣武士、着甲师或战斗锻造奇械师</td></tr>
<tr><th scope="row">恢复</th><td>把生命值补回来，或阻止直接倒地</td><td>牧师、德鲁伊、吟游诗人、圣武士</td></tr>
<tr><th scope="row">技能与侦察</th><td>锁、陷阱、潜行、追踪、读人</td><td>游荡者、游侠、吟游诗人、武僧</td></tr>
<tr><th scope="row">奥术解题</th><td>控场、伤害法术、仪式、工具</td><td>法师、术士、契术师、德鲁伊、奇械师</td></tr>
</tbody></table>

<p>同一个职业可以兼两项职责。圣武士既能站前排，也能救人；吟游诗人能恢复，还带着一长串技能；德鲁伊则在恢复和奥术之间切换。重叠会给队伍留出余地，但整项空着，第二场游戏通常就能感觉出来。</p>

<p>这套四职分法适合四到五人的常规队伍。只有一到三名玩家时，生存和补位压力完全不同，需要按小队配置另算。</p>

<h2>13 个官方职业一览</h2>

<p>下面的 1 级生命值取自 2024 免费基础规则，奇械师例外，使用 D&amp;D Beyond 职业卡上的 d8 生命骰。低、中、高也沿用官方总览的复杂度用词。奇械师在那张表里没有单独一行，因此暂时保留 [confirm: 官方总览无此行，按工具箱记为中到高]。</p>

<table><thead><tr><th scope="col">职业</th><th scope="col">主属性</th><th scope="col">1 级生命值</th><th scope="col">官方复杂度</th><th scope="col">默认职责</th><th scope="col">1 级第 1 回合（2024）</th></tr></thead><tbody>
<tr><th scope="row">野蛮人</th><td>力量</td><td>12 + 体质调整值</td><td>中</td><td>前排</td><td>附赠动作进入狂暴，再打一次力量武器</td></tr>
<tr><th scope="row">吟游诗人</th><td>魅力</td><td>8 + 体质调整值</td><td>高</td><td>恢复 / 技能</td><td>附赠动作给戏法激励，再放戏法或打一击</td></tr>
<tr><th scope="row">牧师</th><td>感知</td><td>8 + 体质调整值</td><td>中</td><td>恢复</td><td>光导箭、医疗真言，或守护神职后的武器攻击</td></tr>
<tr><th scope="row">德鲁伊</th><td>感知</td><td>8 + 体质调整值</td><td>高</td><td>恢复 / 奥术</td><td>妖火、雷鸣波或戏法；荒野变形是 2 级</td></tr>
<tr><th scope="row">战士</th><td>力量或敏捷</td><td>10 + 体质调整值</td><td>低</td><td>前排</td><td>带武器精通的攻击；已经受伤就开第二风</td></tr>
<tr><th scope="row">武僧</th><td>敏捷和感知</td><td>8 + 体质调整值</td><td>高</td><td>技能 / 前排</td><td>武道攻击；无甲防御是你的 AC 公式</td></tr>
<tr><th scope="row">圣武士</th><td>力量和魅力</td><td>10 + 体质调整值</td><td>中</td><td>前排 / 恢复</td><td>精通武器攻击；有人倒地再用圣疗</td></tr>
<tr><th scope="row">游侠</th><td>敏捷和感知</td><td>10 + 体质调整值</td><td>中</td><td>技能 / 前排</td><td>先上猎人印记，再攻击</td></tr>
<tr><th scope="row">游荡者</th><td>敏捷</td><td>8 + 体质调整值</td><td>低</td><td>技能</td><td>合法触发时打偷袭</td></tr>
<tr><th scope="row">术士</th><td>魅力</td><td>6 + 体质调整值</td><td>高</td><td>奥术</td><td>先开先天术法，再放戏法或 1 环</td></tr>
<tr><th scope="row">契术师</th><td>魅力</td><td>8 + 体质调整值</td><td>高</td><td>奥术</td><td>魔能爆或其他契约魔法</td></tr>
<tr><th scope="row">法师</th><td>智力</td><td>6 + 体质调整值</td><td>中</td><td>奥术</td><td>戏法或 1 环；仪式专家留给战后</td></tr>
<tr><th scope="row">奇械师</th><td>智力</td><td>8 + 体质调整值</td><td>[confirm: 总览无此行]</td><td>奥术 / 支援</td><td>在前排后面放戏法或 1 环</td></tr>
</tbody></table>

<p>最高的一项属性优先给职业主属性。按 2024 规则，之后再用背景提高列出的三项属性。<a href="${ZH_DND_STATS_PATH}">DND 六项属性详解</a>会带你把六个数字放到正确的位置。</p>

<p>中文资料里，Sorcerer 和 Warlock 的译名偶尔会互换。这里采用 5e 玩家常用的对应关系：Sorcerer 是术士，Warlock 是契术师。看到别的译法时，先核对英文名再往角色卡上写。</p>

<h2>每个职业第 1 回合能做什么</h2>

<p>以下都按 2024 的 1 级特性来算，除非你的桌子明确使用 2014 规则。免费基础规则要求从 3 级或更高开卡时才在创建阶段写下子职业。角色幻想可以提前想，1 级的第一场游戏却不用等子职业名定下来才开始。</p>

<h3>前排</h3>

<p><strong>野蛮人。</strong> 没穿重甲时，先用附赠动作进入狂暴，再拿力量武器攻击。狂暴期间，你获得钝击、穿刺和挥砍抗性，还有伤害加值以及力量检定、力量豁免的优势；代价是不能施法或维持专注。鲁莽攻击到 2 级才有，不该出现在 1 级卡上。无甲防御的公式是 10 + 敏捷调整值 + 体质调整值，而且仍然可以拿盾。</p>

<p><strong>战士。</strong> 这是最直白的低复杂度前排。战斗风格、第二风、武器精通都从 1 级开始。第 1 回合通常就是用已精通的武器攻击，并触发对应的精通词条；如果已经掉血，再用附赠动作开第二风。额外攻击要等到 5 级。决定玩战士后，可以接着看 <a href="${ZH_DND_FIGHTER_PATH}">DND 战士指南</a>里的完整 1 级构筑。</p>

<p><strong>圣武士。</strong> 2024 圣武士在 1 级就有施法、圣疗和武器精通，神圣惩击还不是这一级的招牌动作。多数时候先用精通武器攻击；同伴掉到 0 生命值，才改用圣疗。1 环可以留给英雄气概、祝福或治愈伤口，不必在第一场战斗的开局全部花完。<a href="${ZH_DND_PALADIN_PATH}">圣武士回合计划</a>会继续讲后面的惩击时机。</p>

<p><strong>武僧。</strong> 1 级的核心是武道和无甲防御，AC 等于 10 + 敏捷调整值 + 感知调整值。先用徒手或武僧武器攻击，再通过武道补一记徒手打击。等角色卡上真正出现专注点，才轮到疾风连击。武僧被标为高复杂度，很大一部分原因是敏捷、感知、体质都要照顾。</p>

<h3>恢复</h3>

<p><strong>牧师。</strong> 1 级已经有施法和神圣职阶。免费基础规则推荐的四个 1 环法术是祝福、治愈伤口、光导箭和虔诚护盾。队伍需要进攻时放光导箭；有人已经倒下，就用医疗真言；选了守护神职，拿到军用武器和重甲训练后，也可以直接打武器。引导神力还没到手。</p>

<p>JoCat 的 <em>A Crap Guide to D&amp;D [5th Edition] - Cleric</em> 很适合认识牧师的气质，不过视频讲的是 2014 版，牧师 1 级就会选择领域。看个乐子没问题，填 2024 角色卡时还是要回到免费基础规则，抄下施法和神圣职阶。</p>

${liteVideoEmbed(DND_CLASSES_COMPARISON_VIDEO_ID, 'JoCat：2014 第五版牧师讲解', {
  src: DND_CLASSES_COMPARISON_VIDEO_PLACEHOLDER_PATH,
  alt: 'JoCat 2014 第五版牧师讲解视频缩略图',
})}

<p>说明：JoCat，《A Crap Guide to D&amp;D [5th Edition] - Cleric》。视频使用 2014 第五版牧师规则，可以看它的语气，但不要照抄旧版领域时机。</p>

<p><strong>德鲁伊。</strong> 施法、德鲁伊语和原初职阶构成 1 级能力包。荒野变形要到 2 级才有，并在 2024 规则中使用附赠动作，所以 1 级不能开场变身。第 1 回合可以放妖火、雷鸣波、治愈伤口或戏法。原初职阶有两条路：秘法师多一个戏法和更多准备法术，守护者获得军用武器与中甲训练。想离前排近一点，就选守护者。</p>

<p><strong>吟游诗人。</strong> 戏法激励使用附赠动作，让 60 尺内能看见或听见你的生物拿到一颗 d6。1 级的使用次数等于魅力调整值，最少一次，长休后恢复。给完激励，还能放公然侮辱、医疗真言、不谐低语，或者用武器打一击。激励骰和准备法术会在同一回合争夺注意力，这也是吟游诗人复杂度高的原因。万事通要到 2 级才出现。</p>

<h3>技能与侦察</h3>

<p><strong>游荡者。</strong> 1 级有偷袭、盗贼黑话和武器精通。偷袭额外伤害每回合触发一次，前提是拥有优势，或满足目标旁边有队友之类的合法条件。灵巧动作这时还没有。开局先找出偷袭条件再攻击；实在触发不了也照样打，只是不加额外骰。游荡者在战斗里属于低复杂度，长长的技能列表才是它在战斗外的价值。</p>

<p><strong>游侠。</strong> 2024 游侠从 1 级开始就有施法、最爱之敌和武器精通。最爱之敌让猎人印记始终处于准备状态，并允许 1 级角色每次长休免环位施放两次。第一回合先标记目标，再攻击。猎人印记需要专注，这项资源得护住，不能同时再挂另一个专注法术。</p>

<p><strong>武僧也能侦察。</strong> 如果战士或圣武士已经守在门口，武僧可以用速度、隐匿和徒手能力补上侦察。进入战斗后，第一回合仍然照常使用武道；真正的侦察大多发生在掷先攻以前。</p>

<h3>奥术解题</h3>

<p><strong>法师。</strong> 1 级有施法、仪式专家和奥术恢复，施法属性是智力。第一回合可以用火焰箭、寒霜射线、心灵尖刺，或花 1 环放魔法飞弹；护盾留作反应。仪式专家是在战斗前后发挥作用的能力，用不上先攻阶段。法师的生命值只有 6 + 体质调整值，站远一点会轻松很多。</p>

<p><strong>术士。</strong> 1 级拿到施法和先天术法。先天术法使用附赠动作，在持续时间内提高术士法术豁免 DC，并让术士法术攻击检定获得优势。开场先启动，再施法。超魔法还没到等级。术士准备的法术比法师少，但每个选择都更集中。</p>

<p><strong>契术师。</strong> 2024 契术师从 1 级起就有魔能祈唤和契约魔法。你知道两个戏法，环位不多，不过短休后全部恢复。多数构筑第一回合会用魔能爆，祈唤另有方向时再换。宗主子职业要晚些才出现。除非这场战斗就是当天的重头戏，否则没必要在开局花光两个环位。</p>

<p><strong>奇械师。</strong> 奇械师不在 2024《玩家手册》里，主属性是智力，生命骰是 d8。第一回合通常躲在前排后面施放戏法或 1 环法术；若桌子采用的版本已经允许着甲师或战斗锻造，而且角色此时确实有子职业，再考虑近战。填卡前要按《Eberron: Forge of the Artificer》核对 1 级特性名，别直接照搬旧 Tasha 条目。<a href="${ZH_DND_ARTIFICER_PATH}">DND Artificer 指南</a>有更完整的职业说明。</p>

<h2>2014 和 2024 的区别会改掉第一回合</h2>

<p>两版手册里的 12 个职业名没有变化，1 级角色进战斗时能做的事却不一样。</p>

<p><strong>子职业时机变了。</strong> 按 2024 规则，从 3 级或更高开卡时才在创建阶段写下子职业。2014 的牧师领域、术士起源、契术师宗主往往从 1 级就有。把旧文章里「创建时选择领域」的说明抄进 2024 角色卡，会平白多出书上没有的特性。</p>

<p><strong>武者拿到了武器精通。</strong> 2024 野蛮人、战士、圣武士、游侠和游荡者都在 1 级拥有武器精通。2014 战士的开局主要看战斗风格和第二风，2024 战士还会用到武器的精通词条。两本书都在桌上时，先在卡顶写明年份。</p>

<p><strong>半施法者更早学会施法。</strong> 2024 圣武士和游侠从 1 级就能施法；2014 圣武士的环位和神圣惩击来得更晚。不要向 2024 的 1 级圣武士承诺惩击，也别忘了把已经拥有的法术写上去。</p>

<p><strong>创角顺序也换了。</strong> 2024 的第一步是职业，第二步是出身，也就是背景、物种和两门语言，第三步才处理属性。核心规则里的物种不再提高属性。<a href="${ZH_PLAYERS_HANDBOOK_DND_5E_PATH}">《玩家手册》版本指南</a>可以帮你先定书目，接着照 <a href="${ZH_DND_CHARACTER_SHEET_PATH}">角色卡填写指南</a>把内容放进正确的格子。</p>

<p><strong>奇械师有了新书目。</strong> 2014 桌常从《艾伯伦：从终末战争中崛起》或 <em>Tasha's Cauldron of Everything</em> 使用奇械师。2024 桌若允许这个职业，要看《Eberron: Forge of the Artificer》。职业名相同，印次和特性文字却可能不同，抄注法前先确认版本。</p>

<p>如果战役跑 2014，就从头到尾使用 2014 特性。把 2024 游侠的猎人印记能力包和 2014 游侠的偏好地形写在同一张卡上，实际开打时只会越看越乱。</p>

<h2>用三个问题把职业定下来</h2>

<p>按顺序回答，剩下一个时就可以停了。</p>

<h3>1. 第 1 回合想做什么？</h3>

<p>想「站着打」，先看野蛮人、战士、圣武士和武僧。想施法，就从牧师、德鲁伊、吟游诗人、法师、术士、契术师、奇械师里挑。想布置一次大伤害，游荡者和游侠更贴近这种回合。</p>

<h3>2. 每回合想处理多少规则？</h3>

<p>2024 总览把战士、游荡者标成低复杂度；野蛮人、牧师、圣武士、游侠、法师是中；吟游诗人、德鲁伊、武僧、术士、契术师是高。复杂度说的是每回合有多少规则和选择需要照看，不代表职业强弱。第一张卡想先把游戏玩起来，选低或中会省心一些。</p>

<h3>3. 桌上还缺哪项职责？</h3>

<p>恢复没人管，可以选牧师、德鲁伊、吟游诗人或圣武士。技能空着，就看游荡者、游侠和吟游诗人。前排缺人时，战士、野蛮人、圣武士最直接。缺奥术工具，则从法师、术士、契术师、德鲁伊里选。职责可以重复，整项空着才容易在第二场游戏里吃亏。</p>

<p>答完以后，多半只会剩下一个职业或一对候选。战士和圣武士之间，想要最简单的前排回合就选战士；还想用圣疗和 1 环法术，就选圣武士。法师和术士之间，喜欢法术书与仪式就选法师，喜欢先天术法和更短的列表就选术士。还是决定不了，战士是稳妥的第一张卡：官方复杂度为低，主属性可用力量或敏捷，后面的格子也比较好填。</p>

<p>职业定下后，再处理出身和属性。<a href="${ZH_DND_RACES_PATH}">DND 种族怎么选</a>讲物种这一步，<a href="${ZH_DND_CHARACTER_SHEET_PATH}">角色卡指南</a>则会带你按顺序填完角色卡。</p>

<h2>选职业时最容易写错的地方</h2>

<p><strong>把 12 和 13 当成同一张名单。</strong> 12 指手册职业，13 是再加上奇械师。先写清桌子允许哪几本书。</p>

<p><strong>把 2014 的领域或起源表抄进 2024 角色卡。</strong> 牧师的神圣职阶不等于领域，术士的先天术法也不是 2014 起源特性。1 级能力应当从正在使用的规则版本里抄。</p>

<p><strong>先看排名，再看队伍。</strong> 强度榜上的 C 级职业照样可能把空缺职责补得很好；S 级职业若和三名队友做着同一件事，最后一项职责还是没人管。强弱争论留给 <a href="${ZH_DND_CLASSES_RANKED_PATH}">职业排名</a>，组队时先把空位补上。</p>

<p><strong>为了省事，先玩一个自己不喜欢的职业。</strong> 免费基础规则会让玩家先和 DM 沟通战役调性，再选真正想玩的职业。愿意认真学的高复杂度角色，往往比下周就不想再碰的低复杂度角色更合适。</p>

<p><strong>职业没定就先做 Token。</strong> Token Maker 只裁切和加框，不会替角色填写职业特性。先在卡上写好职业名，再让肖像跟上。</p>

<h2>让职业在 VTT 地图上也能一眼认出</h2>

<p>职业写上卡以后，还要考虑地图缩小到正常桌面比例时能不能看清。按职责定一套简单的视觉规则，比每个角色发明一套边框更容易认：</p>

<ul>
<li><strong>前排</strong>可以近裁脸或武器，使用战士预设，再配一个高对比亮环。</li>
<li><strong>恢复</strong>优先保住脸；牧师和圣武士都能用牧师预设，圣徽或自然线索要留在遮罩里。</li>
<li><strong>技能与侦察</strong>适合更紧的裁切和较深的环，预设可用盗贼或游侠。</li>
<li><strong>奥术</strong>先试法师预设。可以给光效或法器留一点位置，但脸要待在圆里。</li>
</ul>

<p>上传 JPG、PNG 或 WEBP，单张上限 10 MB。选择圆形、方形或多边形遮罩，再加边框；若两名角色的轮廓太像，可以补一个短标签。导出 256、512、1024 或 2048 像素的透明 PNG，然后放进 Roll20、Foundry VTT 或 Owlbear。正常裁切和导出时，立绘会留在浏览器里完成加框。</p>

<p>职业名写好后，打开 <a href="${ZH_EDITOR_PATH}">Token 制作器</a>。开团前若还需要用 d20 做属性检定，也可以直接用 <a href="${ZH_DICE_ROLLER_PATH}">D&amp;D 骰子工具</a>。</p>

<img class="inline-article-image" src="${DND_CLASSES_COMPARISON_TOKEN_ROW_PATH}" alt="截图占位：Token Maker 里的四枚职业 Token，分别使用战士、牧师、盗贼和法师预设；圆形遮罩在地图缩放后仍能辨认" loading="lazy" decoding="async" fetchpriority="low" width="1520" height="392" />

<h2>DND职业有哪些：常见问题</h2>

<h3>DND职业有哪些？</h3>

<p>官方第五版共有 13 个核心职业：奇械师、野蛮人、吟游诗人、牧师、德鲁伊、战士、武僧、圣武士、游侠、游荡者、术士、契术师和法师。其中 12 个收入 2024《玩家手册》，奇械师是来自艾伯伦书目的官方第 13 个职业。</p>

<h3>12 个基础职业是哪些？</h3>

<p>手册里的 12 个 <strong>DND 职业</strong> 是野蛮人、吟游诗人、牧师、德鲁伊、战士、武僧、圣武士、游侠、游荡者、术士、契术师和法师。2014 与 2024 的职业名单相同，但名单内的 1 级特性有不少变化。</p>

<h3>官方 DND 职业全部有哪些？</h3>

<p>官方核心就是上面的 13 个。试玩中的灵能者和第三方血猎手可以在 DM 允许时加入游戏，但它们不属于官方 13 个职业。</p>

<h3>新手第一张卡写哪个？</h3>

<p>2024 总览把战士和游荡者列为低复杂度，野蛮人、牧师、圣武士、游侠、法师列为中。想让第一张卡少一些回合决策，可以先从这些职业里选；如果没有特别偏好，战士最容易直接开玩。</p>

<h3>队伍必须每种职业都有吗？</h3>

<p>不必。队伍需要的是四项职责都有人照看，不是每个职业各来一个。两名角色可以承担同一职责，真正麻烦的是整项职责没人管。</p>

<h3>子职业什么时候选？</h3>

<p>按 2024 规则从 1 级开卡时，多数职业到 3 级才选择子职业，除非具体职业条目另有说明。如果战役直接从 3 级或更高开始，免费基础规则要求在创建角色时就写下子职业。</p>

<h3>奇械师算 2024《玩家手册》里的职业吗？</h3>

<p>不算。奇械师是官方职业，也能在 D&amp;D Beyond 上创建，但它不在 2024《玩家手册》的 12 个职业之中。开卡前问清 DM 是否允许《Eberron: Forge of the Artificer》。</p>

<h3>术士和契术师谁是谁？</h3>

<p>Sorcerer 是术士，力量来自天生魔法；Warlock 是契术师，力量来自契约。遇到把 Warlock 译成术士的中文资料时，先看英文名，再往角色卡上写。</p>

<h2>来源</h2>

<ul>
<li><a href="${DND_2024_CHARACTER_CREATION_URL}" rel="noreferrer noopener">创建角色（2024 免费基础规则）</a>：职业是第 1 步，这里也有职业总览表和 1 级生命值。</li>
<li><a href="${DND_2024_CHARACTER_CLASSES_URL}" rel="noreferrer noopener">角色职业（2024 免费基础规则）</a>：12 个手册职业，以及上文用到的 1 级特性。</li>
<li><a href="${DND_BEYOND_CLASSES_CATALOG_URL}" rel="noreferrer noopener">D&amp;D Beyond 职业目录</a>：2024 手册职业卡，以及《Eberron: Forge of the Artificer》下的奇械师。</li>
</ul>

<p>规则文本属于威世智。这份对照用于开团前选职业和准备 VTT；需要完整规则时，仍应回到《玩家手册》。</p>

<p>职业写上卡之后，去 <a href="${ZH_EDITOR_PATH}">做 Token</a>，让地图上的角色和角色卡里的 <strong>DND 职业</strong> 对得上。</p>
`;
