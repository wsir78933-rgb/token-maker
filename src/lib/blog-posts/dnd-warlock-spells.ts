import {
  DND_WARLOCK_SPELLS_ARCANE_FLIGHT_IMAGE_PATH,
  DND_WARLOCK_SPELLS_COVER_PATH,
  DND_WARLOCK_SPELLS_ELDRITCH_BLAST_IMAGE_PATH,
  DND_WARLOCK_SPELLS_FOCUSED_CONCENTRATION_IMAGE_PATH,
} from './shared';

export const DND_WARLOCK_SPELLS_SLUG = 'dnd-warlock-spells';
export const DND_WARLOCK_SPELLS_UPDATED_AT = '2026-09-26';
export const DND_WARLOCK_SPELLS_ENGLISH_H1 =
  'DnD Warlock Spells: Six Choices, Two Slots, One Missing Party Job';
export const DND_WARLOCK_SPELLS_ENGLISH_SEO_TITLE =
  'dnd warlock spells: Six Choices, Two Slots, One Missing Party Job';
export const DND_WARLOCK_SPELLS_ENGLISH_DESCRIPTION =
  "For a level-5 Warlock, use the 2024 rules to separate six base prepared-spell entries from two level-3 Pact Magic slots, then match each choice to your party's missing job.";
export const DND_WARLOCK_SPELLS_CHINESE_H1 =
  '龙与地下城契术师法术：远程、控场、位移、反应怎么选';
export const DND_WARLOCK_SPELLS_CHINESE_SEO_TITLE =
  '龙与地下城契术师法术：远程、控场、位移、反应怎么选';
export const DND_WARLOCK_SPELLS_CHINESE_DESCRIPTION =
  '按 2024 规则选择契术师的远程、控场、位移与反应法术：先分清基础准备数量、契术魔法法术位和始终准备的额外来源，再核对动作、射程、专注与触发条件。';
export const DND_WARLOCK_SPELLS_ENGLISH_COVER_ALT =
  'Original adult human Warlock in dark layered leather and a weathered cloak extending an open hand with a luminous violet beam in a ruined stone hall.';
export const DND_WARLOCK_SPELLS_CHINESE_COVER_ALT =
  '遗迹石厅中一名身着深色斗篷的成年契术师，面部与张开的施法手清晰可见，紫色能量从手前延伸。';
export const DND_WARLOCK_SPELLS_RELATED_SLUGS = [
  'dnd-wizard-spells',
  'dnd-cleric-spells',
  'dnd-bard-spells',
  'dnd-counterspell',
] as const;

export const dndWarlockSpellsArticleHtml = String.raw`
<p>Start a level-5 Warlock worksheet by writing <code>2024</code> at the top, then organize your <strong>dnd warlock spells</strong> around six base prepared-spell entries, two level-3 Pact Magic slots, and the party job that still needs coverage. Any spells made always prepared by a feature are separate from those six entries. The result is a conditional six-name list you can check against your table, not a universal ranking of the “best” spells.</p>
<p>The distinction matters because a spell list answers “which names can I prepare?” while Pact Magic answers “what resources can I spend right now?” A good level-5 plan keeps those questions separate, then connects them with the job your next session actually requires.</p>
<h2>Lock the rules version and the real spell budget</h2>
<h3>Do not mix 2014 Spells Known with 2024 Prepared Spells</h3>
<p>The 2014 Warlock rules use <strong>Spells Known</strong>: the class gives you a limited list, and gaining a Warlock level lets you replace one known spell with another eligible Warlock spell. The 2024 rules label the class list <strong>Prepared Spells</strong>, but the class table still describes a one-at-a-time replacement when you gain a Warlock level. It is not permission to rebuild all six choices after every long rest. Compare the <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes#Warlock" rel="noreferrer noopener">2014 Warlock class rules</a> with the <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Warlock" rel="noreferrer noopener">2024 Warlock class rules</a> before copying a list from an older guide.</p>
<p>Use 2024 for this worksheet: its class table calls the entries <strong>Prepared Spells</strong>, while 2014 calls them <strong>Spells Known</strong>. In either version, gaining a Warlock level permits replacing one eligible spell, not rebuilding the whole list after every rest. Keep the year on the worksheet so that a spell name, an action, and an upcast result are always read from the same rules version.</p>
<h3>Six base prepared spells are not two spell slots</h3>
<p>At Warlock level 5, the 2024 table gives you <strong>six base prepared-spell entries</strong> and <strong>two Pact Magic slots</strong>, each of <strong>3rd level</strong>. Spells made always prepared by another feature are separate from the six. The six is a choice budget. The two is a casting budget. A cantrip such as Eldritch Blast sits outside both counts. <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Warlock" rel="noreferrer noopener">The Warlock table and Pact Magic rules</a> are the source for these level-5 numbers.</p>
<p>Pact Magic slots are the same level for this class, and the class rules say they return on a short or long rest. If you cast a 1st-level Hex or a 2nd-level Misty Step with one of those slots, you have still spent a 3rd-level slot. That does not automatically improve the spell. The spell’s own higher-level description must say what changes. This is why a prepared list and a slot plan belong in separate columns.</p>
<p>Write one further boundary beside the two slots. A 2024 Warlock can use Magical Cunning as a one-minute ritual to recover up to half the maximum number of Pact Magic slots, rounded up, then cannot use it again until a long rest. It is a limited recovery option, not a third slot at the start of every encounter. Label it as recovery rather than inflating the level-5 budget; the class source above documents the feature.</p>
<figure class="inline-figure inline-figure--wide"><img class="inline-figure__image inline-figure__image--wide" src="${DND_WARLOCK_SPELLS_ELDRITCH_BLAST_IMAGE_PATH}" alt="Original adult human Warlock in dark layered leather and a weathered cloak extending an open hand with a luminous violet beam in a ruined stone hall." width="1536" height="1024" loading="lazy" decoding="async" /><figcaption>This original character illustration accompanies the level-5 worksheet; the surrounding text carries the prepared-choice and Pact Magic distinctions.</figcaption></figure>
<p>Use the <a href="https://www.dndbeyond.com/sources/dnd/br-2024/spells" rel="noreferrer noopener">2024 spellcasting rules</a> as the second check: preparing a spell does not spend a slot, while casting a spell with a slot does. A slot can be spent only once per turn under the 2024 one-spell-slot-per-turn rule. That rule becomes important when a bonus-action spell and an action spell both look attractive.</p>
<h2>Choose a job before choosing a spell name</h2>
<p>Do not begin by circling six popular base names. First write the job the party is missing: steady attacks, movement, area control, a response to a spell being cast, or an answer to an ongoing magical effect. Then choose the smallest candidate that covers that job without consuming the same resource as every other candidate.</p>
<h3>Keep one no-slot baseline</h3>
<p>Keep <strong>Eldritch Blast</strong> outside the six base prepared-spell entries. In the 2024 text it is a cantrip with a 1-action casting time and 120-foot range; each beam is a separate ranged spell attack that deals 1d10 force damage on a hit. At character levels 5, 11, and 17, the spell produces two, three, and four beams respectively. That makes it a repeatable attack baseline, not an automatic hit or a two-die attack. See the <a href="https://www.dndbeyond.com/spells/2619161-eldritch-blast" rel="noreferrer noopener">2024 Eldritch Blast entry</a>.</p>
<p>The practical choice is not “Eldritch Blast or a prepared spell.” It is “which prepared spell solves a problem Eldritch Blast cannot solve without spending a slot?” If the party already has reliable control and movement, a second concentration option may add less value than a reaction or an answer to an ongoing effect.</p>
<h3>Fill the missing movement, response, and control jobs</h3>
<p>The following table is a decision aid. Each row includes a condition that can make the choice wrong for the session.</p>
<table>
  <thead>
    <tr>
      <th>Job</th>
      <th>Candidate</th>
      <th>What it actually provides</th>
      <th>Check before preparing it</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Reposition without concentration</td>
      <td><a href="https://www.dndbeyond.com/spells/2619133-misty-step" rel="noreferrer noopener">Misty Step</a></td>
      <td>A bonus-action teleport for yourself to a visible, unoccupied space within 30 feet.</td>
      <td>It uses a slot and a bonus action. In 2024, do not spend a second slot on another spell during the same turn.</td>
    </tr>
    <tr>
      <td>Hold an answer to a spell</td>
      <td><a href="https://www.dndbeyond.com/spells/2619072-counterspell" rel="noreferrer noopener">Counterspell</a></td>
      <td>A reaction when you see a creature within 60 feet casting a spell with verbal, somatic, or material components; that creature makes a Constitution save.</td>
      <td>Your Counterspell cast spends your slot. If the countered spell's caster fails the save and that spell used a slot, the caster does not expend that slot. You must still see the caster, be in range, and have your reaction.</td>
    </tr>
    <tr>
      <td>End an ongoing spell</td>
      <td><a href="https://www.dndbeyond.com/spells/2619103-dispel-magic" rel="noreferrer noopener">Dispel Magic</a></td>
      <td>An action at 120 feet that ends an ongoing spell of 3rd level or lower automatically; higher-level spells require a spellcasting-ability check.</td>
      <td>This is an answer to an effect already in place, not a reaction to the instant another creature begins casting.</td>
    </tr>
    <tr>
      <td>Control a visible group</td>
      <td><a href="https://www.dndbeyond.com/spells/2619168-hypnotic-pattern" rel="noreferrer noopener">Hypnotic Pattern</a></td>
      <td>A 30-foot cube within 120 feet; creatures that see the pattern make Wisdom saves, and failures become Charmed, Incapacitated, and Speed 0.</td>
      <td>It requires concentration, affects every eligible creature in the area, and damage or another creature using an action to wake a target ends that target’s effect. Place the cube so allies can avoid it.</td>
    </tr>
    <tr>
      <td>Extend a single-target attack plan</td>
      <td><a href="https://www.dndbeyond.com/spells/2618988-hex" rel="noreferrer noopener">Hex</a></td>
      <td>A bonus-action, 90-foot, concentration spell. Hits against the chosen creature deal an extra 1d6 necrotic damage, and one chosen ability’s checks have disadvantage.</td>
      <td>The disadvantage is on ability checks, not saving throws. It competes for concentration and its transfer after the target reaches 0 hit points still costs a later bonus action.</td>
    </tr>
    <tr>
      <td>Move or infiltrate while concentrating</td>
      <td><a href="https://www.dndbeyond.com/spells/2619116-invisibility" rel="noreferrer noopener">Invisibility</a></td>
      <td>A touch spell that requires concentration; in the 2024 text, the target’s attack roll, damage, or spellcasting ends the spell early.</td>
      <td>It is not a promise that nobody can locate the target. Decide whether the job is silent movement or an attack, because the latter ends the effect.</td>
    </tr>
    <tr>
      <td>Cross a vertical obstacle</td>
      <td><a href="https://www.dndbeyond.com/spells/2618909-fly" rel="noreferrer noopener">Fly</a></td>
      <td>A touch spell that grants a willing target a 60-foot flying speed and hover while concentration lasts.</td>
      <td>It requires concentration and can leave a target falling when the spell ends if nothing prevents the fall.</td>
    </tr>
  </tbody>
</table>
<p>The condition column is the point of the table. Fly may beat another attack rider when the job is crossing a collapsed shaft; Dispel Magic has different timing from Counterspell when a spell is already running; Hypnotic Pattern needs space, sight, and a plan not to wake a cluster.</p>
<p>If a name has several possible roles, keep only the one you intend to test. Prepare Hex for its sustained attack rider and ability-check penalty, not because a list calls it “strong.” Prepare Misty Step for the missing visible 30-foot escape, not because every Warlock must reserve a bonus action. One job beside each name prevents a pile of mutually competing options.</p>
<h2>Compare the upcast change with the job before spending a level-3 slot</h2>
<p>“Cast it with a higher slot” is not a complete reason to spend one of your two level-3 resources. Read the spell’s higher-level entry and write the changed property beside the candidate. The following comparison stays inside the 2024 text:</p>
<table>
  <thead>
    <tr>
      <th>Spell</th>
      <th>Cast with a level-3 slot</th>
      <th>What actually changes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="https://www.dndbeyond.com/spells/2618988-hex" rel="noreferrer noopener">Hex</a></td>
      <td>A 1st-level spell cast with a 3rd-level slot</td>
      <td>Its maximum concentration duration becomes 8 hours; the extra damage remains 1d6 per qualifying hit.</td>
    </tr>
    <tr>
      <td><a href="https://www.dndbeyond.com/spells/2619116-invisibility" rel="noreferrer noopener">Invisibility</a></td>
      <td>A 2nd-level spell cast with a 3rd-level slot</td>
      <td>The “one extra target per slot level above 2nd” rule adds one target, so the 3rd-level cast can affect two targets total.</td>
    </tr>
    <tr>
      <td><a href="https://www.dndbeyond.com/spells/2618909-fly" rel="noreferrer noopener">Fly</a></td>
      <td>Its normal 3rd-level slot</td>
      <td>It remains one target; extra targets begin above 3rd level. The 60-foot flying speed and concentration requirement still govern the choice.</td>
    </tr>
    <tr>
      <td><a href="https://www.dndbeyond.com/spells/2619103-dispel-magic" rel="noreferrer noopener">Dispel Magic</a></td>
      <td>Its normal 3rd-level slot</td>
      <td>The spell automatically ends an ongoing spell of 3rd level or lower. A higher slot raises that automatic threshold; the 3rd-level cast does not erase every magical effect.</td>
    </tr>
    <tr>
      <td><a href="https://www.dndbeyond.com/spells/2619133-misty-step" rel="noreferrer noopener">Misty Step</a></td>
      <td>A 2nd-level spell cast with a 3rd-level slot</td>
      <td>The 2024 text lists no upcast improvement. It is still a visible, unoccupied-space teleport of up to 30 feet.</td>
    </tr>
  </tbody>
</table>
<p>This is a property check, not a damage ranking. Hex’s useful change is duration; Invisibility’s is target count; Dispel Magic’s threshold changes only when the slot is high enough; Fly and Misty Step do not gain a listed benefit at level 3. If you simply need to teleport, a higher slot may be a poor trade. That lack of an upcast change is an opportunity-cost flag, not an automatic exclusion: reliable repositioning can still justify the slot. If the job is to cover two creatures during a short infiltration, the extra Invisibility target may justify spending it. The choice follows the session’s job and the slot’s property change, not the word “upcast.”</p>
<figure class="inline-figure inline-figure--wide"><img class="inline-figure__image inline-figure__image--wide" src="${DND_WARLOCK_SPELLS_ARCANE_FLIGHT_IMAGE_PATH}" alt="Original adult elf Warlock floating above a broken stone bridge over a deep ravine, with a wind-lifted cloak and a subtle violet arcane trail." width="1536" height="1024" loading="lazy" decoding="async" /><figcaption>This original character illustration accompanies the movement example; compare each spell's property change with the job and opportunity cost in the text.</figcaption></figure>
<h2>Protect the concentration slot and the action economy</h2>
<h3>One caster cannot maintain every useful concentration spell</h3>
<p>At level 5, you can put Hex, Hypnotic Pattern, Invisibility, and Fly in the same six-entry base list, but you cannot maintain all four at once. Under the <a href="https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary#Concentration" rel="noreferrer noopener">2024 concentration rules</a>, beginning another concentration spell ends your current concentration immediately. Taking damage can force a Constitution saving throw: use the higher of DC 10 or half the damage rounded down, with a maximum DC of 30. Incapacitation or death also ends concentration.</p>
<p>Treat concentration as a single active lane. The other prepared concentration spells are switches, not parallel effects. Hex and Hypnotic Pattern can both be legal entries, but casting the second ends the first. If the party needs control first and damage later, write that sequence instead of calling the list “four active buffs.”</p>
<figure class="inline-figure inline-figure--wide"><img class="inline-figure__image inline-figure__image--wide" src="${DND_WARLOCK_SPELLS_FOCUSED_CONCENTRATION_IMAGE_PATH}" alt="Original adult tiefling Warlock with visible curved horns and an outstretched hand holding a violet-gold geometric magical pattern in a ruined stone chamber." width="1536" height="1024" loading="lazy" decoding="async" /><figcaption>This original character illustration accompanies the concentration section; prepare several options if useful, but plan to maintain only one at a time.</figcaption></figure>
<h3>Check the turn and reaction before spending a slot</h3>
<p>2024 also limits a turn to one spell cast with a spell slot. This is narrower and more precise than saying “only one spell per turn.” If you cast Misty Step with a slot as a bonus action, you cannot spend another slot on an action spell during that same turn. You can still use a cantrip when its action is available, subject to its own timing and target rules. The <a href="https://www.dndbeyond.com/sources/dnd/br-2024/spells" rel="noreferrer noopener">spellcasting text</a> is the authority for this limit.</p>
<p>The same wording prevents a Counterspell mistake. Spending a slot on your turn does not ban Counterspell for the whole round; its own turn still needs your reaction, sight, 60-foot range, and the 2024 component trigger. If you already spent a slot earlier in that turn, you cannot spend a second slot on Counterspell. Write “reserve reaction” and “reserve slot” separately.</p>
<p>Action economy can reject an otherwise legal list. Hex starts and transfers with a bonus action; Hypnotic Pattern and Fly use an action; Misty Step uses a bonus action; Counterspell uses a reaction. A two-slot plan that assumes all of these happen in one turn is incompatible. Decide what the first turn must accomplish, then mark its consumed resource.</p>
<h2>Work a level-5 six-spell draft</h2>
<h3>Fill the worksheet in role order</h3>
<p>Fill the worksheet only after naming the missing job. Start with the rules line:</p>
<p><code>Rules: 2024 | Warlock level: 5 | Base prepared entries: 6 | Always-prepared feature spells: separate | Pact Magic: 2 × level 3</code></p>
<p>Keep Eldritch Blast in a separate cantrip line, and record any feature-granted always-prepared spells on their own line. Then fill the six base prepared entries with one job per entry:</p>
<ol>
  <li><strong>Hex</strong> for a sustained single-target attack plan when its concentration and bonus-action costs fit.</li>
  <li><strong>Hypnotic Pattern</strong> for area control when the party can protect the pattern’s targets from damage and wake-up actions.</li>
  <li><strong>Misty Step</strong> for visible, unoccupied-space repositioning within 30 feet.</li>
  <li><strong>Counterspell</strong> when a reaction and a slot need to be available for a creature casting a qualifying spell within 60 feet.</li>
  <li><strong>Dispel Magic</strong> when the session may require ending an ongoing spell at 120 feet.</li>
  <li><strong>Invisibility</strong> when the missing job is concentrated movement or infiltration rather than attacking while invisible.</li>
</ol>
<p>This example deliberately contains multiple concentration candidates. It does not claim they should all be running. At the table, choose the one concentration job that matches the immediate problem. If the actual problem is sustained vertical movement, replace Invisibility with Fly and write the fall-at-the-end condition beside it. If the party has no need for anti-magic responses, replace Counterspell or Dispel Magic with a different candidate after naming the missing job and checking its 2024 text and Warlock-list entry.</p>
<h3>Assign the two slots by job, not by spell level alone</h3>
<p>The two 3rd-level slots are not “the two spells at the top of the list.” One possible plan is to assign the first slot to the encounter’s main concentration decision: Hypnotic Pattern when area control is needed, or Hex when the party needs the attack rider and the longer duration from a 3rd-level slot. Assign the second slot to the response lane: keep it available for Counterspell or Dispel Magic when the session contains a credible magical threat, or spend it on Misty Step when movement is the immediate problem.</p>
<p>That plan is conditional. When you cast Counterspell, your own Pact Magic slot pays for that reaction. The 2024 rule treats the other caster's slot separately: if the countered spell's caster fails the Constitution save and used a spell slot, that caster does not expend it. Do not generalize that exception to other failed saves or unmet conditions. Counterspell still needs a visible caster within 60 feet using the named components. If both slots go early, Magical Cunning recovers only the amount specified by the class feature after a one-minute ritual, not an automatic reset. State what each slot solves and what observation changes the plan.</p>
<h3>Replace one choice when the 2024 class rule permits it</h3>
<p>When you gain a Warlock level, the 2024 class rule permits replacing one spell on your list with another Warlock spell for which you have spell slots. It does not permit rebuilding the entire list because an encounter looks inconvenient. Before replacing a name, use the <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Warlock" rel="noreferrer noopener">2024 Warlock class rule</a> for that limit and read the specific 2024 spell source linked above. Record the old job, the new job, the spell level, the action or reaction, concentration requirement, range and target condition, and the reason the old entry no longer fits.</p>
<p>This produces a list that can be recalculated rather than copied. At a different Warlock level, recheck that row of the 2024 class table for the number of prepared spells and the Pact Magic slots before reusing the worksheet. Do not carry the level-5 numbers into another level as if they were a universal Warlock contract.</p>
<h2>Run the pre-session readback</h2>
<p>Read the finished sheet from top to bottom and mark each check as pass or revise:</p>
<ul>
  <li>The rules line says <code>2024</code>, and no 2014 spell effect has been mixed into the list.</li>
  <li>The sheet has exactly six base prepared spell entries, with any feature-granted always-prepared spells recorded separately and Eldritch Blast recorded as a cantrip.</li>
  <li>The Warlock level is 5, and the resource line says two level-3 Pact Magic slots.</li>
  <li>Every prepared name has one stated job and one limiting condition.</li>
  <li>Every Hex, Hypnotic Pattern, Invisibility, or Fly entry is marked as a concentration option; the plan names only one active concentration effect at a time.</li>
  <li>Each action, bonus action, or reaction is compatible with the turn in which you expect to use it.</li>
  <li>A Counterspell entry includes the 60-foot, visible-caster, component, reaction, and Constitution-save conditions from the 2024 text.</li>
  <li>A Dispel Magic entry is aimed at an ongoing spell, not used as a reaction to the initial casting.</li>
  <li>Every higher-slot statement names the property the spell text changes; “3rd-level slot” is not treated as a guarantee of extra damage.</li>
  <li>The two slot jobs are written beside the list, including the observation that would make you reserve, spend, or change each one.</li>
</ul>
<p>If any line fails, revise that line instead of adding another spell name. A finished <code>dnd warlock spells</code> worksheet is the one that tells you what to prepare, what each choice is for, what it costs in concentration or action economy, and why a level-3 slot is being spent.</p>
<h2>Sources</h2>
<table>
  <thead>
    <tr>
      <th>Source</th>
      <th>What to verify</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Warlock" rel="noreferrer noopener">Warlock — D&amp;D Beyond Basic Rules (2024)</a></td>
      <td>Level-5 prepared-spell entries, Pact Magic slots, Magical Cunning, and the one-spell replacement rule.</td>
    </tr>
    <tr>
      <td><a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes#Warlock" rel="noreferrer noopener">Warlock — Basic Rules (2014)</a></td>
      <td>The older Spells Known terminology used for the version comparison.</td>
    </tr>
    <tr>
      <td><a href="https://www.dndbeyond.com/sources/dnd/br-2024/spells" rel="noreferrer noopener">Spellcasting rules — D&amp;D Beyond Basic Rules (2024)</a></td>
      <td>Preparation, slot use, and the one-spell-slot-per-turn limit.</td>
    </tr>
    <tr>
      <td><a href="https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary#Concentration" rel="noreferrer noopener">Concentration — D&amp;D Beyond Rules Glossary (2024)</a></td>
      <td>When concentration ends and how the damage save is set.</td>
    </tr>
    <tr>
      <td><a href="https://www.dndbeyond.com/spells/class/7-warlock" rel="noreferrer noopener">Warlock spell list</a></td>
      <td>The public class-list cross-check for eligible Warlock spells.</td>
    </tr>
    <tr>
      <td><a href="https://www.dndbeyond.com/spells/2619161-eldritch-blast" rel="noreferrer noopener">Eldritch Blast</a></td>
      <td>Cantrip action, range, beam count, and damage fields.</td>
    </tr>
    <tr>
      <td><a href="https://www.dndbeyond.com/spells/2618988-hex" rel="noreferrer noopener">Hex</a></td>
      <td>Concentration, bonus-action targeting, ability-check disadvantage, and duration when upcast.</td>
    </tr>
    <tr>
      <td><a href="https://www.dndbeyond.com/spells/2619168-hypnotic-pattern" rel="noreferrer noopener">Hypnotic Pattern</a></td>
      <td>Area, saving throw, conditions, and concentration limits.</td>
    </tr>
    <tr>
      <td><a href="https://www.dndbeyond.com/spells/2619133-misty-step" rel="noreferrer noopener">Misty Step</a></td>
      <td>Bonus-action teleport, range, and visible unoccupied destination.</td>
    </tr>
    <tr>
      <td><a href="https://www.dndbeyond.com/spells/2619116-invisibility" rel="noreferrer noopener">Invisibility</a></td>
      <td>Concentration, attack or spell termination, and extra-target upcast rule.</td>
    </tr>
    <tr>
      <td><a href="https://www.dndbeyond.com/spells/2618909-fly" rel="noreferrer noopener">Fly</a></td>
      <td>Flying speed, hover, concentration, and target-count upcast rule.</td>
    </tr>
    <tr>
      <td><a href="https://www.dndbeyond.com/spells/2619072-counterspell" rel="noreferrer noopener">Counterspell</a></td>
      <td>Reaction trigger, range, components, Constitution save, and slot outcome.</td>
    </tr>
    <tr>
      <td><a href="https://www.dndbeyond.com/spells/2619103-dispel-magic" rel="noreferrer noopener">Dispel Magic</a></td>
      <td>Ongoing-spell timing, range, and higher-level check threshold.</td>
    </tr>
  </tbody>
</table>
<h2>Public attribution</h2>
<p>This work includes material from the System Reference Document 5.2.1 (“SRD 5.2.1”) by Wizards of the Coast LLC, available at <a href="https://www.dndbeyond.com/srd" rel="noreferrer noopener">https://www.dndbeyond.com/srd</a>. The SRD 5.2.1 is licensed under the Creative Commons Attribution 4.0 International License, available at <a href="https://creativecommons.org/licenses/by/4.0/legalcode" rel="noreferrer noopener">https://creativecommons.org/licenses/by/4.0/legalcode</a>.</p>
`;

export const dndWarlockSpellsArticleHtmlZh = String.raw`
<p>先在表格顶端写下 2024，再按规则预算和队伍职责整理契术师法术（dnd warlock spells）。2024 规则下，契术师（中文资料也常写作邪术师）要先锁定规则年份、自己的契术师等级、地下城主允许使用的书目，再把准备法术数量、契术魔法（Pact Magic）法术位和始终准备的额外来源分开。完成后，你得到的不是一张无条件的榜单，而是一套能填进角色资料、也能解释为什么这样选的候选。</p>
<p>下面的等级例子都按单职业 2024 契术师处理。第一个问题不是“这个法术强不强”，而是“我这一回合能用什么动作、手里有几个位、是否已经在维持专注”。规则年份请先在角色卡或团规中确认；2014 旧版与 2024 修订规则的职业页面不能拼成一套表。2024 契术师的职业表、契术魔法和法术准备说明可在 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Warlock" rel="noreferrer noopener">D&amp;D Beyond（官方规则站）的 2024 契术师规则</a>中核对。</p>
<h2>先算资源：三栏数字不要混在一起</h2>
<p>“能准备几项”“能施放几次”“每个位是几环”是三个问题。2024 规则把职业表中的基础准备法术数量列成契术师等级对应的数字；升级时可以替换其中一项，但这不等于每次长休都能把整张表随意重选。契术魔法法术位是施放时消耗的资源，所有本职业位保持同一环阶，并在短休或长休后恢复。</p>
<table>
  <thead>
    <tr>
      <th>契术师等级</th>
      <th>基础准备法术</th>
      <th>契术魔法法术位</th>
      <th>每个位的环阶</th>
      <th>先记下什么</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1级</td>
      <td>2项</td>
      <td>1个</td>
      <td>1环</td>
      <td>先写两项准备法术，再另记戏法</td>
    </tr>
    <tr>
      <td>3级</td>
      <td>4项</td>
      <td>2个</td>
      <td>2环</td>
      <td>四项是名单数量，两个是当前等级拥有的 2 环法术位（同一回合最多消耗一个）</td>
    </tr>
    <tr>
      <td>5级</td>
      <td>6项</td>
      <td>2个</td>
      <td>3环</td>
      <td>高环位可施放低环法术，但是否增强要看该法术的升环文字</td>
    </tr>
  </tbody>
</table>
<p>戏法不占这两类数字。魔能爆（Eldritch Blast）是零环戏法，不应从 1级的两项、3级的四项或 5级的六项里扣掉；它使用动作，也不消耗契术魔法法术位。2024 版本中，魔能爆的射程是 120 英尺，每束命中时造成 1d10 力场伤害；到契术师 5级时发射两束，每束分别进行远程法术攻击，可以分配给不同目标。具体字段可在 <a href="https://www.dndbeyond.com/spells/2619161-eldritch-blast" rel="noreferrer noopener">魔能爆的官方条目</a>复核。</p>
<p>始终准备的法术也要单独记。子职或其他特性授予的法术，不占基础准备法术栏；它们不应该被抄进“我还剩几格”的计算里。反过来，看到某个子职表上的法术，也不能直接把它当作所有契术师都能用的通用选择。你可以在职业页先确认自己是否拥有这个来源，再把它放到额外栏。</p>
<figure class="inline-figure inline-figure--wide"><img class="inline-figure__image inline-figure__image--wide" src="${DND_WARLOCK_SPELLS_ELDRITCH_BLAST_IMAGE_PATH}" alt="遗迹石厅中一名身着深色斗篷的成年契术师，面部与张开的施法手清晰可见，紫色能量从手前延伸。" width="1536" height="1024" loading="lazy" decoding="async" /><figcaption>遗迹石厅中的契术师以张开的手施放紫色 Eldritch Blast；插画用于表现施法动作，不对应具体射程、束数或其他规则数值。</figcaption></figure>
<h2>给每个候选贴上五个标签</h2>
<p>法术名称只解决“我知道它叫什么”，不能解决“这场战斗该不该把它放进准备栏”。至少给每个候选记下施法动作、射程、目标或豁免、是否专注，以及用更高环法术位时会不会改变效果。下面这张速查表只列已经核对过的 2024 字段。</p>
<table>
  <thead>
    <tr>
      <th>法术</th>
      <th>环阶与动作</th>
      <th>射程和条件</th>
      <th>专注与选择提醒</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>魔能爆</td>
      <td>戏法，动作</td>
      <td>120英尺；每束独立进行远程法术攻击</td>
      <td>不专注，不消耗法术位；5级为两束</td>
    </tr>
    <tr>
      <td>脆弱诅咒（Hex）</td>
      <td>1环，附赠动作</td>
      <td>90英尺；选择一个能看见的生物，攻击检定命中该目标时才加伤害</td>
      <td>专注最多1小时；目标属性的属性检定处于劣势，不是豁免检定</td>
    </tr>
    <tr>
      <td>炼狱叱喝（Hellish Rebuke）</td>
      <td>1环，反应</td>
      <td>受到来自60英尺内可见生物的伤害后才能触发；目标作敏捷豁免</td>
      <td>不专注；失败受2d10火焰伤害，成功减半</td>
    </tr>
    <tr>
      <td>迷踪步（Misty Step）</td>
      <td>2环，附赠动作</td>
      <td>自身传送至最多30英尺内能看见且未被占据的位置</td>
      <td>不专注；它解决的是位置问题，不是伤害问题</td>
    </tr>
    <tr>
      <td>催眠图纹（Hypnotic Pattern）</td>
      <td>3环，动作</td>
      <td>120英尺；30英尺立方内能看见图纹的生物作感知豁免</td>
      <td>专注最多1分钟；失败后魅惑、失能且速度为0</td>
    </tr>
    <tr>
      <td>法术反制（Counterspell）</td>
      <td>3环，反应</td>
      <td>60英尺内看见生物以语言、姿势或材料成分施法时触发；对方作体质豁免</td>
      <td>不专注；失败时对方法术无效，但你的法术位仍按施法消耗</td>
    </tr>
  </tbody>
</table>
<p>来源分别见 <a href="https://www.dndbeyond.com/spells/2618988-hex" rel="noreferrer noopener">脆弱诅咒官方条目</a>、<a href="https://www.dndbeyond.com/spells/2619168-hypnotic-pattern" rel="noreferrer noopener">催眠图纹官方条目</a>、<a href="https://www.dndbeyond.com/spells/2619133-misty-step" rel="noreferrer noopener">迷踪步官方条目</a>、<a href="https://www.dndbeyond.com/spells/2619072-counterspell" rel="noreferrer noopener">法术反制官方条目</a>和 <a href="https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf#page=140" rel="noreferrer noopener">《系统参考文档 5.2.1》（SRD 5.2.1）中的炼狱叱喝</a>。</p>
<p>专注是最硬的筛选条件。正在维持一个需要专注的法术时，开始施放另一个需要专注的法术，原来的专注会立即结束；受到伤害通常还要进行体质豁免。2024 规则把受伤后的豁免难度等级写成 10 与伤害一半向下取整两者中较高者，并设有 30 的上限，具体可看 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary#Concentration" rel="noreferrer noopener">2024 专注规则</a>。所以脆弱诅咒和催眠图纹应被视为两种不同计划，而不是能同时叠在同一目标上的两层加成。</p>
<p>2024 还有一个回合内的资源限制：同一个回合只能消耗一个法术位来施法，不能把它简化成“每轮只能施放一个法术”。例如，你在自己的回合用法术位施放脆弱诅咒后，可以用动作施放不消耗法术位的魔能爆；但不能在同一回合再用另一个法术位施放需要动作的法术。若在自己的回合已经消耗一个法术位，也不能把同回合的法术反制再当作第二个法术位施法。规则原文见 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/spells#OneSpellwithaSpellSlotperTurn" rel="noreferrer noopener">2024 施法规则：每回合只能用一个法术位施法</a>。</p>
<h2>按战术需要缩小选择</h2>
<h3>想稳定进行远程攻击</h3>
<p>魔能爆适合当作不占法术位的持续选项。5级时它有两束，每束单独攻击；你可以把两束都打向同一个目标，也可以在目标快倒下时分开分配。脆弱诅咒需要附赠动作、90英尺射程和专注，只有攻击检定命中被诅咒目标时才增加 1d6 黯蚀伤害；它还会让你指定的一项属性检定处于劣势，但不会让该属性的豁免检定处于劣势。</p>
<p>因此，“远程攻击”不自动等于“必须准备脆弱诅咒”。如果你预计要尽快使用催眠图纹，或者敌人的伤害会让专注很难维持，脆弱诅咒的位置成本就会上升；如果你需要一个不靠专注、也不消耗法术位的动作选项，魔能爆的优先级更稳定。脆弱诅咒用 2环位施放时，最长专注时间变为 4小时，但每次命中额外的 1d6 不会因为升环而变多；这是一项持续时间取舍，而不是伤害升级。</p>
<h3>队伍需要短时间控制</h3>
<p>催眠图纹是 3环、动作、120英尺、30英尺立方范围的专注法术。范围内能看见图纹的生物都要作感知豁免；失败后会被魅惑，处于失能状态且速度为 0。目标受到伤害，或有人花动作把它摇醒，效果就会在该目标身上结束。它没有“只选择敌人”的自动过滤，队友站位和图纹覆盖范围必须一起检查。</p>
<h3>需要离开危险位置</h3>
<p>迷踪步是 2环附赠动作，传送到最多 30英尺内能看见、没有被占据的位置，不需要专注。它解决的是“我能否在这次行动中离开当前位置”，不是“我能否把队友一起带走”或“我能否穿过一个没有确认的落点”。准备它时，先在地图上找出几个确实能看见并且未被占据的落点，再决定是否值得用一个 2环法术位换位置。</p>
<h3>想保留反应</h3>
<p>1级时，炼狱叱喝是一个条件明确的反应候选：你必须受到来自 60英尺内、自己能看见的生物造成的伤害，然后才能把反应用在它身上；该生物作敏捷豁免，失败受 2d10 火焰伤害，成功减半。它不需要专注，升高施法环阶时每高一环多 1d10。这个候选适合你预计会遇到触发条件、又想把专注留给别的法术的情况；若本场不容易被符合条件的生物伤害，准备它就未必比另一个已核对的 1环选择更合适。</p>
<h2>三个等级例子：把资源账写在法术账旁边</h2>
<h3>1级：两项基础准备，反应候选要看触发条件</h3>
<p>1级记录应先写成：2项基础准备法术；1个 1环契术魔法法术位；魔能爆是另列的戏法，不占两项。一个可核对的示例是把脆弱诅咒和炼狱叱喝放进两项准备栏。</p>
<p>这样选的理由并不相同。脆弱诅咒用附赠动作启动，需要专注，适合你准备持续用攻击检定命中同一目标；炼狱叱喝用反应，只有受到符合距离和可见条件的伤害后才有机会使用，而且不占专注。你不能把两者都描述成“每回合固定收益”：前者需要维持专注，后者需要敌人先满足触发条件。</p>
<p>替代分支也要写在角色资料旁边。如果你已经确定这场要把专注留给另一个允许的 1环法术，就把脆弱诅咒换出；如果地下城主的遭遇很少让你遇到炼狱叱喝的触发条件，就不要因为它能造成伤害而强行占一格。每次替换都回到同一张字段表，核对环阶、动作、射程、目标条件和专注，而不是凭“常见推荐”抄答案。</p>
<h3>3级：四项准备与两个 2环位</h3>
<p>3级有 4项基础准备法术，契术魔法变为 2个 2环法术位。资源账和选择账要并排写：魔能爆依然不占 4项；脆弱诅咒仍是 1环法术，炼狱叱喝仍是 1环反应，迷踪步是 2环附赠动作。一个偏向远程和脱离位置的示例，可以准备脆弱诅咒、炼狱叱喝、迷踪步和人类定身术（Hold Person）。人类定身术是 2环、动作、60英尺、专注最多1分钟的控制法术；目标须是能看见的类人生物，并作感知豁免，字段可在 <a href="https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf#page=141" rel="noreferrer noopener">SRD 5.2.1 的人类定身术</a>核对。</p>
<p>此时用 2环位施放脆弱诅咒，最长专注时间增加到 4小时，但每次命中仍只按法术文字增加 1d6；用一个 2环位施放迷踪步，则换来一次不需要专注的 30英尺传送。两者都可能占用附赠动作，但它们解决的问题不同：一个要求你继续维持专注并攻击目标，另一个要求地图上存在可见且未被占据的落点。</p>
<p>这个等级的替代理由应具体到场景。若队伍经常需要你跨过封锁线，迷踪步的位置价值高；若敌人不是类人生物，人类定身术就应换成地下城主允许且字段已核对的候选；若你总要维持另一个专注效果，脆弱诅咒的持续时间优势也不一定值得占一格。</p>
<h3>5级：六项准备与两个 3环位</h3>
<p>5级有 6项基础准备法术、2个 3环契术魔法法术位，魔能爆变为两束。催眠图纹与法术反制都是 3环候选，但两者的使用窗口不同：前者是动作、30英尺立方和专注控制，后者是看到施法触发的反应、不需要专注。一个偏向控场和应对施法者的示例，可把催眠图纹、法术反制、迷踪步、脆弱诅咒、炼狱叱喝和人类定身术放入六项准备栏；催眠图纹、脆弱诅咒与人类定身术是按场景互相替代的专注选项，不是同一时间维持的三项效果；人类定身术只在目标属于类人生物且你愿意占用专注时有对应价值。</p>
<p>如果先用一个 3环位施放催眠图纹，同一回合不能再用另一个法术位施放别的法术，因为 2024 规则同一回合只能消耗一个法术位；这是法术位限制。动作预算还要单独核对：催眠图纹需要动作，魔能爆也需要动作，所以在本单职业例子没有额外动作时，催眠图纹已占用本回合动作，就不能同一回合再用魔能爆；你可以在之后自己的回合用魔能爆，或本回合用脆弱诅咒（附赠动作）再用魔能爆（动作）。若你把两个 3环位都留给一次控场和一次反制，脆弱诅咒与炼狱叱喝仍可作为准备好的替代计划，但不是额外获得的第三个法术位。</p>
<h2>最后一遍检查：让候选真的能填卡</h2>
<p>把最终候选写下后，按下面顺序复核一次：先确认是 2024 还是 2014，再确认契术师职业等级和地下城主允许书目；然后写基础准备数量，另列始终准备来源；再写契术魔法位的数量和环阶。1级应能看到 2项与 1个 1环位，3级应能看到 4项与 2个 2环位，5级应能看到 6项与 2个 3环位。</p>
<p>接着逐项补齐动作、射程、目标或豁免、专注和升环效果。发现一个法术需要附赠动作，就问自己本回合是否还想施放另一个消耗法术位的法术；发现两个法术都需要专注，就把它们标成替代计划；发现一个反应法术，就写出它真正的触发条件和距离。最后检查同一回合是否重复消耗法术位，并确认魔能爆没有被误扣进准备数量。</p>
<p>这样留下的不是一份宣称“最强”的答案，而是一份能说明条件的选择：在远程攻击、控场、位移和反应之间，你知道自己牺牲了什么、保留了什么，也能在换规则年份、等级或地下城主书目后重新核对，而不必整张角色表从头猜。</p>
<h2>来源表</h2>
<table>
  <thead>
    <tr>
      <th>来源</th>
      <th>对应内容</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Warlock" rel="noreferrer noopener">D&amp;D Beyond 的 2024 契术师规则</a></td>
      <td>职业等级对应的准备法术数量、契术魔法法术位、以短仪式恢复法术位的特性和替换法术规则。</td>
    </tr>
    <tr>
      <td><a href="https://www.dndbeyond.com/spells/2619161-eldritch-blast" rel="noreferrer noopener">魔能爆官方条目</a></td>
      <td>戏法的动作、射程、射线数量与伤害字段。</td>
    </tr>
    <tr>
      <td><a href="https://www.dndbeyond.com/spells/2618988-hex" rel="noreferrer noopener">脆弱诅咒官方条目</a></td>
      <td>附赠动作、专注、目标条件、属性检定劣势和升环持续时间。</td>
    </tr>
    <tr>
      <td><a href="https://www.dndbeyond.com/spells/2619168-hypnotic-pattern" rel="noreferrer noopener">催眠图纹官方条目</a></td>
      <td>范围、感知豁免、魅惑与失能效果以及专注限制。</td>
    </tr>
    <tr>
      <td><a href="https://www.dndbeyond.com/spells/2619133-misty-step" rel="noreferrer noopener">迷踪步官方条目</a></td>
      <td>附赠动作传送、距离和可见且未被占据的落点。</td>
    </tr>
    <tr>
      <td><a href="https://www.dndbeyond.com/spells/2619072-counterspell" rel="noreferrer noopener">法术反制官方条目</a></td>
      <td>反应触发、距离、施法成分、体质豁免和法术位结算。</td>
    </tr>
    <tr>
      <td><a href="https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf#page=140" rel="noreferrer noopener">SRD 5.2.1：炼狱叱喝</a></td>
      <td>受伤后反击的反应触发、豁免和伤害字段。</td>
    </tr>
    <tr>
      <td><a href="https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf#page=141" rel="noreferrer noopener">SRD 5.2.1：人类定身术</a></td>
      <td>针对类人生物的定身控制、射程、豁免与专注字段。</td>
    </tr>
    <tr>
      <td><a href="https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary#Concentration" rel="noreferrer noopener">2024 专注规则</a></td>
      <td>更换专注法术、受伤后的体质豁免、失能或死亡时结束专注。</td>
    </tr>
    <tr>
      <td><a href="https://www.dndbeyond.com/sources/dnd/br-2024/spells#OneSpellwithaSpellSlotperTurn" rel="noreferrer noopener">2024 施法规则：每回合只能用一个法术位施法</a></td>
      <td>同一回合消耗法术位施法的限制。</td>
    </tr>
  </tbody>
</table>
<h2>公开署名</h2>
<p>本作品包含来自 Wizards of the Coast LLC 的《系统参考文档 5.2.1》（SRD 5.2.1）材料，文档地址为 <a href="https://www.dndbeyond.com/srd" rel="noreferrer noopener">官方文档页面</a>；该文档依据知识共享署名 4.0 国际许可协议授权，许可文本见 <a href="https://creativecommons.org/licenses/by/4.0/legalcode" rel="noreferrer noopener">许可协议原文</a>。</p>
<details>
<summary>查看许可原文</summary>
<p>This work includes material from the System Reference Document 5.2.1 (“SRD 5.2.1”) by Wizards of the Coast LLC, available at <a href="https://www.dndbeyond.com/srd" rel="noreferrer noopener">https://www.dndbeyond.com/srd</a>. The SRD 5.2.1 is licensed under the Creative Commons Attribution 4.0 International License, available at <a href="https://creativecommons.org/licenses/by/4.0/legalcode" rel="noreferrer noopener">https://creativecommons.org/licenses/by/4.0/legalcode</a>.</p>
</details>
`;

const DND_WARLOCK_SPELLS_ENGLISH_SOURCE_URLS = [
  'https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Warlock',
  'https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes#Warlock',
  'https://www.dndbeyond.com/sources/dnd/br-2024/spells',
  'https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary#Concentration',
  'https://www.dndbeyond.com/spells/class/7-warlock',
  'https://www.dndbeyond.com/spells/2619161-eldritch-blast',
  'https://www.dndbeyond.com/spells/2618988-hex',
  'https://www.dndbeyond.com/spells/2619168-hypnotic-pattern',
  'https://www.dndbeyond.com/spells/2619133-misty-step',
  'https://www.dndbeyond.com/spells/2619116-invisibility',
  'https://www.dndbeyond.com/spells/2618909-fly',
  'https://www.dndbeyond.com/spells/2619072-counterspell',
  'https://www.dndbeyond.com/spells/2619103-dispel-magic',
  'https://www.dndbeyond.com/srd',
  'https://creativecommons.org/licenses/by/4.0/legalcode',
] as const;

const DND_WARLOCK_SPELLS_CHINESE_SOURCE_URLS = [
  'https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Warlock',
  'https://www.dndbeyond.com/spells/2619161-eldritch-blast',
  'https://www.dndbeyond.com/spells/2618988-hex',
  'https://www.dndbeyond.com/spells/2619168-hypnotic-pattern',
  'https://www.dndbeyond.com/spells/2619133-misty-step',
  'https://www.dndbeyond.com/spells/2619072-counterspell',
  'https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf#page=140',
  'https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf#page=141',
  'https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary#Concentration',
  'https://www.dndbeyond.com/sources/dnd/br-2024/spells#OneSpellwithaSpellSlotperTurn',
  'https://www.dndbeyond.com/srd',
  'https://creativecommons.org/licenses/by/4.0/legalcode',
] as const;

const DND_WARLOCK_SPELLS_FORBIDDEN_PAGE_MARKERS = [
  'author-notes',
  'review',
  'handoff',
  'dispatch',
  'agent',
  'task-id',
  'internal',
  'editorial',
  'workflow',
] as const;

function assertDndWarlockSpellsHtml(locale: 'en' | 'zh', html: string) {
  if (/<h1\b/i.test(html)) {
    throw new Error(`dnd-warlock-spells HTML for locale=${locale} contains an unexpected H1.`);
  }

  const sourceUrls = locale === 'en'
    ? DND_WARLOCK_SPELLS_ENGLISH_SOURCE_URLS
    : DND_WARLOCK_SPELLS_CHINESE_SOURCE_URLS;
  for (const sourceUrl of sourceUrls) {
    if (!html.includes(sourceUrl)) {
      throw new Error(`dnd-warlock-spells HTML for locale=${locale} is missing public source URL=${sourceUrl}.`);
    }
  }

  for (const marker of DND_WARLOCK_SPELLS_FORBIDDEN_PAGE_MARKERS) {
    if (html.toLowerCase().includes(marker)) {
      throw new Error(`dnd-warlock-spells HTML for locale=${locale} contains forbidden page marker=${marker}.`);
    }
  }

  const requiredImagePaths = locale === 'en'
    ? [
        DND_WARLOCK_SPELLS_ELDRITCH_BLAST_IMAGE_PATH,
        DND_WARLOCK_SPELLS_ARCANE_FLIGHT_IMAGE_PATH,
        DND_WARLOCK_SPELLS_FOCUSED_CONCENTRATION_IMAGE_PATH,
      ]
    : [DND_WARLOCK_SPELLS_ELDRITCH_BLAST_IMAGE_PATH];
  for (const imagePath of requiredImagePaths) {
    if (!html.includes(`src="${imagePath}"`)) {
      throw new Error(`dnd-warlock-spells HTML for locale=${locale} is missing image path=${imagePath}.`);
    }
  }

  if (html.includes('/editorial/') || html.includes('../../media/')) {
    throw new Error(`dnd-warlock-spells HTML for locale=${locale} exposes an internal media path.`);
  }
}

if (DND_WARLOCK_SPELLS_COVER_PATH !== DND_WARLOCK_SPELLS_ELDRITCH_BLAST_IMAGE_PATH) {
  throw new Error(`dnd-warlock-spells cover path is not the Eldritch Blast character path: ${DND_WARLOCK_SPELLS_COVER_PATH}.`);
}
assertDndWarlockSpellsHtml('en', dndWarlockSpellsArticleHtml);
assertDndWarlockSpellsHtml('zh', dndWarlockSpellsArticleHtmlZh);
