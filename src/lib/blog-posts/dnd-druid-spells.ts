import {
  DND_CONJURE_ANIMALS_2014_RULES_URL,
  DND_DRUID_2014_RULES_URL,
  DND_DRUID_2024_RULES_URL,
  DND_DRUID_SPELLS_PLANNING_IMAGE_PATH,
  DND_GOODBERRY_2014_RULES_URL,
  EN_DICE_ROLLER_PATH,
  EN_DND_CLASSES_PATH,
  EN_DND_CONSTITUTION_PATH,
  EN_DND_COUNTERSPELL_PATH,
  EN_EDITOR_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_DND_CONSTITUTION_PATH,
  ZH_DND_COUNTERSPELL_PATH,
  ZH_EDITOR_PATH,
  liteVideoEmbed,
} from './shared';

export const dndDruidSpellsArticleHtml = String.raw`
<p><strong>DND druid spells</strong> are strongest when you treat the Druid as a battlefield controller first, not as a weaker Cleric or a nature-flavored Wizard. A good Druid spell list slows enemies, changes terrain, keeps allies alive with efficient healing, and gives the party answers outside combat.</p>

<p>This guide expands the short tier list into a full 5e play guide: best cantrips, 1st-level staples, 2nd-level control magic, 3rd-level power picks, concentration traps, prepared-spell examples, Circle notes, and FAQ answers. I am focusing on the spells that repeatedly matter at real tables, not just the ones that sound impressive in isolation.</p>

<p>If you only need the fast answer, start with the table. If you are building a long campaign Druid, read the sections after it before locking your prepared list. Druid spell choice changes dramatically depending on whether your party needs scouting, healing, damage, stealth, or emergency control. For exact rules text, compare the official <a href="${DND_DRUID_2014_RULES_URL}" rel="noreferrer noopener">2014 Druid rules</a> and <a href="${DND_DRUID_2024_RULES_URL}" rel="noreferrer noopener">2024 Druid rules</a> your table is using.</p>

<h2>DND Druid Spells Quick Tier List</h2>

<table>
  <thead>
    <tr>
      <th>Spell Name</th>
      <th>Level</th>
      <th>Tier</th>
      <th>Best table use</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Guidance</strong></td>
      <td>Cantrip</td>
      <td>S-Tier</td>
      <td>The best out-of-combat Druid cantrip for checks, exploration, and social scenes where your table allows repeated casting.</td>
    </tr>
    <tr>
      <td><strong>Thorn Whip</strong></td>
      <td>Cantrip</td>
      <td>S-Tier</td>
      <td>Pull enemies into hazards, off ledges, or back into your control zones. It gets better as your battlefield spells improve.</td>
    </tr>
    <tr>
      <td><strong>Goodberry</strong></td>
      <td>1st</td>
      <td>S-Tier</td>
      <td>Reliable healing, travel food, and emergency revive support if your DM allows feeding berries to a downed ally.</td>
    </tr>
    <tr>
      <td><strong>Entangle</strong></td>
      <td>1st</td>
      <td>A-Tier</td>
      <td>Early area control that can restrain multiple enemies and give allies advantage against them.</td>
    </tr>
    <tr>
      <td><strong>Faerie Fire</strong></td>
      <td>1st</td>
      <td>A-Tier</td>
      <td>Reveals invisible enemies and gives the whole party advantage against failed saves.</td>
    </tr>
    <tr>
      <td><strong>Pass without Trace</strong></td>
      <td>2nd</td>
      <td>S-Tier</td>
      <td>A party-wide stealth swing that can turn a loud group into a real infiltration team.</td>
    </tr>
    <tr>
      <td><strong>Spike Growth</strong></td>
      <td>2nd</td>
      <td>A-Tier</td>
      <td>The classic hazard spell. It is brutal when paired with forced movement from Thorn Whip, Repelling Blast, grapples, or shoves.</td>
    </tr>
    <tr>
      <td><strong>Sleet Storm</strong></td>
      <td>3rd</td>
      <td>S-Tier</td>
      <td>Huge control zone, difficult terrain, heavy obscurement, and concentration disruption in one spell.</td>
    </tr>
    <tr>
      <td><strong>Plant Growth</strong></td>
      <td>3rd</td>
      <td>A-Tier</td>
      <td>No concentration, huge movement denial, and excellent use in forests, farms, ruins, and defensive fights.</td>
    </tr>
    <tr>
      <td><strong>Conjure Animals</strong></td>
      <td>3rd</td>
      <td>Table-Dependent</td>
      <td>Extremely strong in 2014-style play, but can slow combat and may be changed by your table's source rules.</td>
    </tr>
    <tr>
      <td><strong>Barkskin</strong></td>
      <td>2nd</td>
      <td>Trap</td>
      <td>In 2014 5e, spending concentration just to set AC to a mediocre floor is usually worse than controlling enemies.</td>
    </tr>
  </tbody>
</table>

<h2>How to Choose DND Druid Spells</h2>

<p>The biggest Druid mistake is preparing a little bit of everything with no plan. Because Druids can change prepared spells after a long rest, you do not need a perfect forever list. You need a reliable default list and the habit of swapping niche spells when the next adventuring day clearly calls for them.</p>

<p>For most parties, I rank Druid spell jobs in this order:</p>

<ol>
  <li><strong>One battlefield spell that wins the shape of the fight.</strong> Entangle, Spike Growth, Sleet Storm, or Plant Growth can matter more than raw damage.</li>
  <li><strong>One emergency healing button.</strong> Healing Word is often better than larger healing because it works as a bonus action at range.</li>
  <li><strong>One exploration or travel answer.</strong> Pass without Trace, Speak with Animals, Locate Animals or Plants, Water Breathing, or Speak with Plants can solve scenes before combat starts.</li>
  <li><strong>One non-concentration fallback.</strong> Ice Knife, Thunderwave, Erupting Earth, or Plant Growth lets you act while your main concentration spell is already running.</li>
</ol>

<p>That structure is why some flashy <strong>DND druid spells</strong> underperform. A spell can be good on paper and still lose the prepared-slot contest because it uses concentration, asks for a bad action, or solves a problem your party already handles.</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_DRUID_SPELLS_PLANNING_IMAGE_PATH}"
    alt="DND druid spell cards laid across a virtual tabletop forest battle map with vines, moonlit terrain, tokens, and magical spell effects"
    width="1629"
    height="965"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Druid spell prep works best when the table can see the battlefield jobs: control the map, keep one emergency recovery option, solve the approach, then swap utility spells after a long rest.</figcaption>
</figure>

<h2>Best Druid Cantrips</h2>

<p>Druid cantrips matter because you will often spend your spell slots on control rather than direct damage. Your at-will choices need to cover utility, light, melee plans, and forced movement.</p>

<table>
  <thead>
    <tr>
      <th>Cantrip</th>
      <th>Take it if...</th>
      <th>Skip it if...</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Guidance</strong></td>
      <td>Your table allows frequent pre-check casting and you want maximum exploration value.</td>
      <td>Your DM dislikes repeated Guidance calls or runs strict time pressure.</td>
    </tr>
    <tr>
      <td><strong>Thorn Whip</strong></td>
      <td>You want a cantrip that interacts with terrain, Spike Growth, Moonbeam, cliffs, and enemy positioning.</td>
      <td>Your campaign is mostly open flat battlefields with little hazard play.</td>
    </tr>
    <tr>
      <td><strong>Produce Flame</strong></td>
      <td>You need both ranged damage and a simple light source.</td>
      <td>Someone else already handles light and you need stronger control utility.</td>
    </tr>
    <tr>
      <td><strong>Shillelagh</strong></td>
      <td>You are a low-level melee Druid, a Spores-style frontliner, or a Wisdom-focused quarterstaff build.</td>
      <td>You plan to stay in the backline and avoid weapon attacks.</td>
    </tr>
    <tr>
      <td><strong>Mold Earth / Shape Water</strong></td>
      <td>Your DM rewards creative environmental play.</td>
      <td>Your table rarely uses detailed terrain, cover, doors, water, pits, or travel scenes.</td>
    </tr>
  </tbody>
</table>

<p>For a first Druid, I would usually start with <strong>Guidance</strong> plus <strong>Thorn Whip</strong>. Add Produce Flame if your party lacks light or ranged chip damage. Take Shillelagh only when your actual plan includes weapon attacks; do not take it just because it appears in every Druid discussion.</p>

<h2>Best 1st-Level DND Druid Spells</h2>

<p>At level 1, Druids are already defined by efficient control and efficient recovery. You do not need many damage spells if your control spell prevents more damage than a blast would deal.</p>

<table>
  <thead>
    <tr>
      <th>Spell</th>
      <th>Role</th>
      <th>Practical rating</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Goodberry</strong></td>
      <td>Healing / travel</td>
      <td>Excellent. Ten points of predictable healing and a clean answer to food pressure.</td>
    </tr>
    <tr>
      <td><strong>Entangle</strong></td>
      <td>Area control</td>
      <td>Excellent. Restrained is a serious condition, and the area can reshape low-level fights.</td>
    </tr>
    <tr>
      <td><strong>Healing Word</strong></td>
      <td>Emergency recovery</td>
      <td>Excellent. The goal is not full healing; the goal is getting a fallen ally back into the turn order.</td>
    </tr>
    <tr>
      <td><strong>Faerie Fire</strong></td>
      <td>Party damage support</td>
      <td>Strong. Advantage for the whole team can beat one small damage spell.</td>
    </tr>
    <tr>
      <td><strong>Absorb Elements</strong></td>
      <td>Defense</td>
      <td>Strong if your table allows the source. It protects concentration and keeps you alive against elemental bursts.</td>
    </tr>
    <tr>
      <td><strong>Thunderwave</strong></td>
      <td>Emergency space</td>
      <td>Good. Best when enemies surround you, when cliffs matter, or when forced movement can break formations.</td>
    </tr>
  </tbody>
</table>

<p>A simple beginner prepared list should include <strong>Goodberry</strong>, <strong>Entangle</strong>, and <strong>Healing Word</strong>. After that, choose Faerie Fire for team damage, Thunderwave for personal space, or Detect Magic / Speak with Animals when the campaign is exploration-heavy.</p>

<h2>Best 2nd-Level DND Druid Spells</h2>

<p>Second-level Druid magic is where the class stops feeling like a healer and starts feeling like a terrain engine. These spells can decide whether the party enters on its own terms or gets dragged through a bad fight.</p>

<table>
  <thead>
    <tr>
      <th>Spell</th>
      <th>Why it matters</th>
      <th>Common mistake</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Pass without Trace</strong></td>
      <td>The whole party gains a huge stealth bonus, which can enable ambushes, escapes, scouting, and objective play.</td>
      <td>Using it only for "sneaky characters" instead of letting armored allies join stealth plans.</td>
    </tr>
    <tr>
      <td><strong>Spike Growth</strong></td>
      <td>Turns movement into damage. It is best when the party can push, pull, slow, or frighten enemies through the area.</td>
      <td>Casting it where enemies can simply stand still and shoot.</td>
    </tr>
    <tr>
      <td><strong>Moonbeam</strong></td>
      <td>Reliable radiant pressure and a useful answer to shapechangers in the right campaign.</td>
      <td>Overrating it as your default concentration spell when Spike Growth or Pass without Trace would solve more.</td>
    </tr>
    <tr>
      <td><strong>Heat Metal</strong></td>
      <td>Brutal against armored enemies or weapon users when applicable.</td>
      <td>Preparing it in a monster-heavy campaign where enemies rarely wear metal armor or carry metal weapons.</td>
    </tr>
    <tr>
      <td><strong>Lesser Restoration</strong></td>
      <td>Removes common conditions and prevents one failed poison, disease, paralysis, or blindness scene from snowballing.</td>
      <td>Ignoring it until the party has already lost a day to a condition.</td>
    </tr>
    <tr>
      <td><strong>Barkskin</strong></td>
      <td>Mostly a trap in 2014 5e because it costs concentration for a modest defensive floor.</td>
      <td>Thinking it turns a Moon Druid into an unkillable tank.</td>
    </tr>
  </tbody>
</table>

<p>The best 2nd-level default pair is usually <strong>Pass without Trace</strong> plus <strong>Spike Growth</strong>. One handles approach and stealth. The other punishes enemy movement. If your party already has stealth covered, add Lesser Restoration or Heat Metal depending on campaign threats.</p>

<h2>Best 3rd-Level DND Druid Spells</h2>

<p>Third-level spells give Druids the tools that make DMs pay attention: large zones, serious weather, no-concentration terrain denial, and summoning. The power is real, but so is the table-management cost.</p>

<table>
  <thead>
    <tr>
      <th>Spell</th>
      <th>Best use case</th>
      <th>Table note</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Sleet Storm</strong></td>
      <td>Break enemy concentration, block sight, slow movement, and make organized enemies waste turns repositioning.</td>
      <td>Warn allies before casting. It can hurt your party's plan if placed carelessly.</td>
    </tr>
    <tr>
      <td><strong>Plant Growth</strong></td>
      <td>Massive movement denial without concentration, especially in natural terrain, chokepoints, and defensive fights.</td>
      <td>Because it does not require concentration, it pairs well with other ongoing plans.</td>
    </tr>
    <tr>
      <td><strong>Call Lightning</strong></td>
      <td>Long fights outdoors where you can keep spending actions on repeated lightning strikes.</td>
      <td>Less impressive in short fights, cramped interiors, or when concentration is under heavy pressure.</td>
    </tr>
    <tr>
      <td><strong>Dispel Magic</strong></td>
      <td>Remove enemy magical effects, traps, buffs, and ongoing problems the party cannot stab.</td>
      <td>Not exciting, but campaigns often reward having at least one caster who prepares it.</td>
    </tr>
    <tr>
      <td><strong>Conjure Animals</strong></td>
      <td>2014-style tables where the DM is comfortable resolving multiple beasts quickly.</td>
      <td>Talk to the DM before building around it. It can dominate action economy and slow the session.</td>
    </tr>
    <tr>
      <td><strong>Water Breathing</strong></td>
      <td>Travel, infiltration, ship campaigns, flooded dungeons, and any adventure where water can become a wall.</td>
      <td>Prepare it when needed; it does not need to live on your default combat list.</td>
    </tr>
  </tbody>
</table>

<p>For a balanced level 5 Druid, I like <strong>Sleet Storm</strong>, <strong>Plant Growth</strong>, and <strong>Dispel Magic</strong> as the serious picks. Add Conjure Animals only when your table has agreed on how summons are chosen, how their turns resolve, and how much time they are allowed to consume.</p>

<h2>Druid Concentration: The Hidden Spell Slot Tax</h2>

<p>Many of the best <strong>DND druid spells</strong> require concentration. That means you are not really comparing every spell to every other spell. You are asking which one concentration spell deserves to define the next several rounds.</p>

<table>
  <thead>
    <tr>
      <th>Situation</th>
      <th>Best concentration choice</th>
      <th>Why</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Low-level melee swarm</td>
      <td>Entangle</td>
      <td>Restrained enemies lose movement and become easier for allies to hit.</td>
    </tr>
    <tr>
      <td>Party wants stealth</td>
      <td>Pass without Trace</td>
      <td>The fight may never happen if the infiltration works.</td>
    </tr>
    <tr>
      <td>Enemies must cross ground</td>
      <td>Spike Growth</td>
      <td>Every forced step becomes damage and tactical pressure.</td>
    </tr>
    <tr>
      <td>Enemy casters or archers need disruption</td>
      <td>Sleet Storm</td>
      <td>It blocks sight, creates difficult terrain, and can force concentration saves.</td>
    </tr>
    <tr>
      <td>Long outdoor fight</td>
      <td>Call Lightning</td>
      <td>Repeated action damage can pay off when the fight lasts long enough.</td>
    </tr>
  </tbody>
</table>

<p>If you lose concentration often, fix that before adding more fancy spells. Stay behind cover, use Wild Shape carefully, consider the <a href="${EN_DND_CONSTITUTION_PATH}">DND Constitution guide</a> when planning ability scores, and keep the <a href="${EN_DICE_ROLLER_PATH}">D&amp;D dice roller</a> ready for concentration checks.</p>

<h2>Prepared Spell Examples by Druid Level</h2>

<p>Exact prepared-spell count depends on your level, Wisdom modifier, and rules version. Under common <a href="${DND_DRUID_2014_RULES_URL}" rel="noreferrer noopener">2014 5e Druid rules</a>, a Druid prepares Druid level + Wisdom modifier spells after a long rest. The <a href="${DND_DRUID_2024_RULES_URL}" rel="noreferrer noopener">2024 Druid rules</a> use their own class progression, so check your table's version before copying a list. The examples below assume a practical party-facing Druid and should be adjusted for your campaign.</p>

<table>
  <thead>
    <tr>
      <th>Druid level</th>
      <th>Default prepared spell core</th>
      <th>Swap when needed</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Level 1</td>
      <td>Goodberry, Entangle, Healing Word</td>
      <td>Detect Magic, Speak with Animals, Thunderwave</td>
    </tr>
    <tr>
      <td>Level 3</td>
      <td>Goodberry, Healing Word, Entangle, Pass without Trace, Spike Growth</td>
      <td>Lesser Restoration, Moonbeam, Heat Metal, Enhance Ability</td>
    </tr>
    <tr>
      <td>Level 5</td>
      <td>Goodberry, Healing Word, Pass without Trace, Spike Growth, Plant Growth, Sleet Storm, Dispel Magic</td>
      <td>Water Breathing, Call Lightning, Conjure Animals, Speak with Plants</td>
    </tr>
  </tbody>
</table>

<p>The point is not to copy the table blindly. The point is to keep a core that covers survival, control, stealth, and anti-magic while leaving room for the adventure. A swamp crawl, city heist, undead crypt, mountain climb, and political session should not all use the same prepared list.</p>

<h2>Best DND Druid Spells by Party Role</h2>

<p>Druids change shape based on party need. The same spell can be amazing or redundant depending on what the other characters already do.</p>

<table>
  <thead>
    <tr>
      <th>Party need</th>
      <th>Druid spell picks</th>
      <th>Why they fit</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Control</td>
      <td>Entangle, Spike Growth, Sleet Storm, Plant Growth</td>
      <td>These spells make enemies waste movement, actions, and positioning.</td>
    </tr>
    <tr>
      <td>Healing</td>
      <td>Goodberry, Healing Word, Lesser Restoration</td>
      <td>Druid healing is best when it prevents disaster or solves conditions, not when it tries to out-heal damage every round.</td>
    </tr>
    <tr>
      <td>Stealth / scouting</td>
      <td>Pass without Trace, Enhance Ability, Speak with Animals</td>
      <td>These spells help the whole party gather information or bypass bad fights.</td>
    </tr>
    <tr>
      <td>Damage</td>
      <td>Spike Growth, Moonbeam, Call Lightning, Heat Metal</td>
      <td>Druid damage is often conditional. It rewards terrain, duration, and enemy type more than simple blasting.</td>
    </tr>
    <tr>
      <td>Utility</td>
      <td>Detect Magic, Water Breathing, Speak with Plants, Dispel Magic</td>
      <td>These are the spells that make the Druid feel like the party's wilderness problem solver.</td>
    </tr>
  </tbody>
</table>

<p>If your table is still choosing roles, pair this spell guide with the <a href="${EN_DND_CLASSES_PATH}">DND classes guide</a>. If your campaign uses many enemy casters, the <a href="${EN_DND_COUNTERSPELL_PATH}">DND Counterspell guide</a> is a useful companion even though most Druids do not normally get Counterspell; it explains reaction timing and why enemy magic changes your spell priorities.</p>

<h2>Druid Circle Notes: Land, Moon, Spores, and Stars</h2>

<p>Your subclass does not completely rewrite the best Druid spells, but it changes which spells feel urgent.</p>

<h3>Circle of the Moon</h3>
<p>Moon Druids often cast a concentration spell first, then use Wild Shape to hold space. Entangle, Spike Growth, Moonbeam, and Call Lightning can all work, but the key is protecting concentration after you shift. Do not spend every slot on self-defense; your spell before transforming should make the whole battlefield worse for enemies.</p>

<h3>Circle of the Land</h3>
<p>Land Druids lean into prepared spell breadth. Because you care more about spellcasting than beast-form durability, your default list should include strong answers like Pass without Trace, Dispel Magic, Plant Growth, and terrain-specific utility. Think like a prepared caster with a nature toolbox.</p>

<h3>Circle of Spores</h3>
<p>Spores Druids are tempted to stand closer to danger, so Shillelagh, Healing Word, Absorb Elements, and control spells that punish approach become more valuable. You still do not want to trade hits forever. Use spells to make enemies regret walking into your space.</p>

<h3>Circle of Stars</h3>
<p>Stars Druids are excellent at holding concentration and supporting allies. That makes the already-good control spells even better. If your table allows the subclass, treat concentration as a premium feature: choose spells that justify being protected.</p>

<h2>DND Druid Spell Traps to Avoid</h2>

<p>Trap does not always mean "never cast this." It means the spell is easy to overvalue, easy to prepare on the wrong day, or easy to use in a way that produces less value than another Druid option.</p>

<ul>
  <li><strong>Barkskin:</strong> in 2014-style play, concentration is too expensive for the AC result. If you need defense, positioning and control usually do more.</li>
  <li><strong>Flame Blade:</strong> flavorful, but it asks for concentration and repeated melee actions. Many Druids get more from Spike Growth, Moonbeam, or control.</li>
  <li><strong>Beast Sense:</strong> useful for scouting in specific campaigns, but not a default prepared spell unless the adventure supports it.</li>
  <li><strong>Locate Animals or Plants:</strong> strong when the question matters, dead weight when it does not. Prepare it for the right travel day, not every day.</li>
  <li><strong>Conjure Animals without a table agreement:</strong> powerful, but if no one knows who picks creatures or how turns run, it becomes a pacing problem.</li>
</ul>

<p>The best way to avoid traps is to ask one question before a long rest: <strong>what problem is tomorrow likely to put in front of us?</strong> If the answer is "unknown dungeon fight," prepare broad control. If the answer is "river crossing," "city stealth," "disease outbreak," or "talking to forest spirits," prepare for that instead.</p>

<h2>Using Druid Spells With VTT Tokens and Dice</h2>

<p>Druids create more table markers than many classes: restrained enemies, Spike Growth areas, Moonbeam zones, summoned beasts, Wild Shape forms, stealth states, and concentration reminders. On a virtual tabletop, that can become messy unless the visuals are readable.</p>

<p>For Roll20, Foundry, Owlbear Rodeo, or another VTT, use a distinct token for your normal form and a distinct token for your most common Wild Shape. You can make those quickly in the <a href="${EN_EDITOR_PATH}">VTT token maker</a>. Give the Wild Shape token a different border or color so the table instantly knows which form is active. Keep the <a href="${EN_DICE_ROLLER_PATH}">D&amp;D dice roller</a> open when concentration saves, Goodberry tracking, or repeated area damage starts slowing the session.</p>

<h2>FAQ About DND Druid Spells</h2>

<h3>What are the best DND druid spells for beginners?</h3>
<p>The best beginner <strong>DND druid spells</strong> are Guidance, Thorn Whip, Goodberry, Entangle, Healing Word, Pass without Trace, Spike Growth, Plant Growth, Sleet Storm, and Dispel Magic. That set covers utility, emergency healing, stealth, control, and anti-magic without asking the player to memorize every niche option.</p>

<h3>Can a Druid cast spells while in Wild Shape?</h3>
<p>Normally, a Druid cannot cast new spells while in Wild Shape in 2014-style 5e play. You can still maintain concentration on a spell you cast before transforming, which is why casting Entangle, Spike Growth, Moonbeam, or another control spell before shifting is such a common Moon Druid pattern. High-level features and rules versions can change the details, so use the official <a href="${DND_DRUID_2014_RULES_URL}" rel="noreferrer noopener">2014 Druid</a> or <a href="${DND_DRUID_2024_RULES_URL}" rel="noreferrer noopener">2024 Druid</a> rules text your table is playing.</p>

<h3>How many spells can a Druid prepare in DND 5e?</h3>
<p>In common 2014 5e rules, a Druid prepares a number of spells equal to Druid level plus Wisdom modifier after a long rest. Cantrips are separate. If your group uses 2024 rules or homebrew spell preparation, check that version directly because prepared-spell progression may not match the older formula.</p>

<h3>Is Goodberry overpowered?</h3>
<p><a href="${DND_GOODBERRY_2014_RULES_URL}" rel="noreferrer noopener">Goodberry</a> is extremely efficient because it creates predictable healing and food from a 1st-level slot. It can feel overpowered if the table allows stockpiling from unused slots before every long rest, so some DMs set a clear table policy. Even with stricter handling, it remains one of the most useful low-level <strong>DND druid spells</strong>.</p>

<h3>Is Conjure Animals still worth preparing?</h3>
<p><a href="${DND_CONJURE_ANIMALS_2014_RULES_URL}" rel="noreferrer noopener">Conjure Animals</a> can be very strong in 2014 5e because extra creatures attack, block space, and absorb attention. It is also one of the easiest spells to slow a table down. Prepare it only after your DM confirms which summoning rules are active, who chooses the beasts, and how fast their turns must run.</p>

<h3>Should a Druid prepare healing or damage spells?</h3>
<p>Prepare at least one emergency healing spell, usually Healing Word, but do not build the whole list around healing. Druids usually prevent more damage by controlling movement, hiding the party with Pass without Trace, or breaking enemy plans with terrain than by trying to heal through every hit.</p>

<h2>Video Summary: Druid Class Breakdown</h2>

<p>The video below is a light companion watch for the class fantasy. Use it for tone and table energy, then come back to the spell tables above when you need a practical prepared list. The actual power of a Druid is not just "nature magic"; it is the ability to change what kind of problem the enemies are standing inside.</p>

${liteVideoEmbed('WMo_gCRMSfA', 'A Crap Guide to D&D [5th Edition] - Druid')}
`;

export const dndDruidSpellsArticleHtmlZh = String.raw`
<p><strong>DND 德鲁伊法术 (DND Druid Spells)</strong> 最强的地方，不是把德鲁伊玩成一个弱化牧师，也不是玩成自然风味的法师，而是把它当成一个战场控制者。好的德鲁伊法术列表会拖慢敌人、改变地形、用高效率治疗救急，并且在战斗外给队伍提供探索答案。</p>

<p>下面按完整 5e 实战需求整理：最强戏法、1 环必备法术、2 环控场法术、3 环核心法术、专注陷阱、每日准备模板、德鲁伊结社差异和 FAQ。重点不是把所有法术名字堆一遍，而是判断哪些 <strong>DND 德鲁伊法术</strong> 在真实跑团里经常有用。</p>

<p>如果你只要快速答案，先看第一张表。如果你要长期玩德鲁伊，后面的段落更重要，因为德鲁伊每天准备什么法术，要根据队伍缺治疗、缺潜行、缺输出、缺控场还是缺探索工具来调整。涉及具体规则文本时，建议对照官方 <a href="${DND_DRUID_2014_RULES_URL}" rel="noreferrer noopener">2014 版 Druid 规则</a> 和 <a href="${DND_DRUID_2024_RULES_URL}" rel="noreferrer noopener">2024 版 Druid 规则</a>，以你们桌采用的版本为准。</p>

<h2>DND 德鲁伊法术快速评级表</h2>

<table>
  <thead>
    <tr>
      <th>法术名称</th>
      <th>等级</th>
      <th>实战评级</th>
      <th>最适合的桌面用途</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>神导术 (Guidance)</strong></td>
      <td>戏法 (Cantrip)</td>
      <td>S 级</td>
      <td>战斗外最强辅助戏法之一，用来补探索、社交和工具检定，前提是 DM 允许频繁提前施放。</td>
    </tr>
    <tr>
      <td><strong>荆棘之鞭 (Thorn Whip)</strong></td>
      <td>戏法 (Cantrip)</td>
      <td>S 级</td>
      <td>把敌人拉进危险地形、拉下高处、拉回控场区域。越到后期越能配合地形法术。</td>
    </tr>
    <tr>
      <td><strong>神莓术 (Goodberry)</strong></td>
      <td>1 环</td>
      <td>S 级</td>
      <td>稳定治疗、旅行口粮、救急资源。如果 DM 允许喂给倒地队友，会更强。</td>
    </tr>
    <tr>
      <td><strong>纠缠术 (Entangle)</strong></td>
      <td>1 环</td>
      <td>A 级</td>
      <td>早期大范围控场，能让多个敌人受束缚，并让队友更容易命中。</td>
    </tr>
    <tr>
      <td><strong>妖火 (Faerie Fire)</strong></td>
      <td>1 环</td>
      <td>A 级</td>
      <td>克制隐形敌人，同时给全队创造优势攻击机会。</td>
    </tr>
    <tr>
      <td><strong>无踪步 (Pass without Trace)</strong></td>
      <td>2 环</td>
      <td>S 级</td>
      <td>全队潜行大幅强化，让原本吵闹的队伍也有资格打潜入、伏击和撤离。</td>
    </tr>
    <tr>
      <td><strong>荆棘丛生 (Spike Growth)</strong></td>
      <td>2 环</td>
      <td>A 级</td>
      <td>经典危险地形法术。配合荆棘之鞭、推人、擒抱、恐惧或击退，会变得很恐怖。</td>
    </tr>
    <tr>
      <td><strong>雪雨暴 (Sleet Storm)</strong></td>
      <td>3 环</td>
      <td>S 级</td>
      <td>巨大控场区、困难地形、重度遮蔽和打断专注，全部塞进一个法术里。</td>
    </tr>
    <tr>
      <td><strong>植物滋长 (Plant Growth)</strong></td>
      <td>3 环</td>
      <td>A 级</td>
      <td>不需要专注的大范围移动封锁，在森林、农田、废墟和防守战里特别好用。</td>
    </tr>
    <tr>
      <td><strong>召唤动物 (Conjure Animals)</strong></td>
      <td>3 环</td>
      <td>视桌而定</td>
      <td>2014 风格规则下极强，但会拖慢战斗；不同规则来源和 DM 裁定差异很大。</td>
    </tr>
    <tr>
      <td><strong>树肤术 (Barkskin)</strong></td>
      <td>2 环</td>
      <td>陷阱</td>
      <td>2014 版 5e 中，消耗专注只换一个一般的 AC 下限，通常不如直接控住敌人。</td>
    </tr>
  </tbody>
</table>

<h2>怎样选择 DND 德鲁伊法术</h2>

<p>新手最容易犯的错，是每天准备一点治疗、一点伤害、一点工具，但没有任何核心计划。德鲁伊长休后可以更换准备法术，所以你不需要一套永远完美的列表。你需要的是一套稳定默认表，再根据明天的冒险内容替换冷门工具法术。</p>

<p>大多数队伍里，我会按这个顺序考虑德鲁伊法术职责：</p>

<ol>
  <li><strong>一个能改变战斗形状的战场法术。</strong>纠缠术、荆棘丛生、雪雨暴或植物滋长，很多时候比直接伤害更重要。</li>
  <li><strong>一个救急治疗按钮。</strong>治愈真言通常比大治疗更实用，因为它是远程附赠动作，可以把倒地队友拉回行动序列。</li>
  <li><strong>一个探索或旅行答案。</strong>无踪步、动物交谈、寻找动植物、水下呼吸、植物交谈，都能在开打前解决问题。</li>
  <li><strong>一个不吃专注的备用动作。</strong>寒冰匕首、雷鸣波、喷发地面或植物滋长，可以在你已经维持主控场时继续提供价值。</li>
</ol>

<p>这也是为什么一些看起来很酷的 <strong>DND 德鲁伊法术</strong> 实战会掉分。一个法术纸面不差，但如果它吃专注、吃动作、或者解决的是队友已经能处理的问题，就不一定值得准备。</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_DRUID_SPELLS_PLANNING_IMAGE_PATH}"
    alt="DND 德鲁伊法术卡牌铺在虚拟桌面森林战场地图上，周围有藤蔓、月光地形、Token 和魔法效果"
    width="1629"
    height="965"
    loading="lazy"
    decoding="async"
  />
  <figcaption>德鲁伊准备法术时要先看战场职责：控制地图、保留救急恢复、解决潜入接近，再按长休后的情报替换工具法术。</figcaption>
</figure>

<h2>最好用的德鲁伊戏法</h2>

<p>德鲁伊戏法很关键，因为你的法术位经常会花在控场和工具上，而不是每回合直接打伤害。戏法要负责日常检定、照明、近战方案和强制位移。</p>

<table>
  <thead>
    <tr>
      <th>戏法</th>
      <th>什么时候选</th>
      <th>什么时候跳过</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>神导术 (Guidance)</strong></td>
      <td>DM 允许频繁提前施放，你想最大化探索和社交检定收益。</td>
      <td>DM 不喜欢反复喊神导术，或者战役经常有严格时间压力。</td>
    </tr>
    <tr>
      <td><strong>荆棘之鞭 (Thorn Whip)</strong></td>
      <td>你想用戏法配合地形、荆棘丛生、月华之光、悬崖和敌人站位。</td>
      <td>战役几乎都是平坦开阔战场，很少出现危险地形。</td>
    </tr>
    <tr>
      <td><strong>燃火术 (Produce Flame)</strong></td>
      <td>队伍缺远程小伤害和简单光源。</td>
      <td>队友已经解决照明，你更需要控制或工具戏法。</td>
    </tr>
    <tr>
      <td><strong>橡棍术 (Shillelagh)</strong></td>
      <td>你是低级近战德鲁伊、孢子德鲁伊，或者明确要打感知近战木棍构筑。</td>
      <td>你准备站后排施法，不打武器攻击。</td>
    </tr>
    <tr>
      <td><strong>塑土术 / 操水术</strong></td>
      <td>你的 DM 奖励创造性环境互动。</td>
      <td>你们桌很少处理地形、掩体、门、水、坑洞和旅行细节。</td>
    </tr>
  </tbody>
</table>

<p>第一张德鲁伊角色卡，我通常建议从 <strong>神导术</strong> + <strong>荆棘之鞭</strong> 开始。如果队伍缺光源或远程伤害，再补燃火术。橡棍术只有在你真的打算敲人时才选，不要因为攻略里常出现就自动拿。</p>

<h2>最好用的 1 环 DND 德鲁伊法术</h2>

<p>1 环阶段，德鲁伊已经能体现高效率控场和救急恢复。你不需要准备一堆伤害法术，因为一个控场法术阻止的伤害，往往比一次低级爆发打出去的伤害更重要。</p>

<table>
  <thead>
    <tr>
      <th>法术</th>
      <th>职责</th>
      <th>实战评价</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>神莓术 (Goodberry)</strong></td>
      <td>治疗 / 旅行</td>
      <td>极好。稳定 10 点治疗，同时解决食物压力。</td>
    </tr>
    <tr>
      <td><strong>纠缠术 (Entangle)</strong></td>
      <td>范围控场</td>
      <td>极好。束缚状态很强，低级战斗里能直接改变敌人行动。</td>
    </tr>
    <tr>
      <td><strong>治愈真言 (Healing Word)</strong></td>
      <td>救急恢复</td>
      <td>极好。目的不是奶满，而是用附赠动作把倒地队友拉回合。</td>
    </tr>
    <tr>
      <td><strong>妖火 (Faerie Fire)</strong></td>
      <td>团队输出辅助</td>
      <td>很强。给全队创造优势攻击，经常比你自己打一发小伤害更赚。</td>
    </tr>
    <tr>
      <td><strong>吸收元素 (Absorb Elements)</strong></td>
      <td>防御</td>
      <td>如果桌上允许该来源，很强。能保护生命值，也能保护专注。</td>
    </tr>
    <tr>
      <td><strong>雷鸣波 (Thunderwave)</strong></td>
      <td>紧急拉开空间</td>
      <td>不错。被包围、有悬崖、需要破阵时更好。</td>
    </tr>
  </tbody>
</table>

<p>新手默认准备表可以先锁 <strong>神莓术</strong>、<strong>纠缠术</strong> 和 <strong>治愈真言</strong>。之后看战役选择妖火、雷鸣波、侦测魔法或动物交谈。</p>

<h2>最好用的 2 环 DND 德鲁伊法术</h2>

<p>2 环开始，德鲁伊会从“会治疗的自然施法者”变成真正的地形引擎。这一档法术能决定队伍是主动潜入、主动伏击，还是被拖进一场不利战斗。</p>

<table>
  <thead>
    <tr>
      <th>法术</th>
      <th>为什么重要</th>
      <th>常见误区</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>无踪步 (Pass without Trace)</strong></td>
      <td>全队获得巨大潜行加成，可以支持伏击、撤离、侦查和目标行动。</td>
      <td>只给潜行角色用，忘了它能让重甲队友也参与潜入计划。</td>
    </tr>
    <tr>
      <td><strong>荆棘丛生 (Spike Growth)</strong></td>
      <td>把移动变成伤害。队友能推拉、减速或恐惧敌人时特别强。</td>
      <td>放在敌人可以原地射击的位置，导致对方根本不用走。</td>
    </tr>
    <tr>
      <td><strong>月华之光 (Moonbeam)</strong></td>
      <td>持续光耀伤害，在有变形生物的战役里还有额外价值。</td>
      <td>把它当成默认专注法术，忽略荆棘丛生或无踪步可能更能解决问题。</td>
    </tr>
    <tr>
      <td><strong>灼热金属 (Heat Metal)</strong></td>
      <td>对穿金属甲或持金属武器的敌人非常狠。</td>
      <td>在怪物为主、很少有金属装备敌人的战役里天天准备。</td>
    </tr>
    <tr>
      <td><strong>次级复原术 (Lesser Restoration)</strong></td>
      <td>解除常见异常，避免一次中毒、疾病、麻痹或目盲拖垮一整天。</td>
      <td>等队伍已经因为异常状态浪费大量资源后才想起来。</td>
    </tr>
    <tr>
      <td><strong>树肤术 (Barkskin)</strong></td>
      <td>2014 版 5e 里大多是陷阱，因为它用专注换来的防御并不够好。</td>
      <td>以为它能把月亮德鲁伊变成打不死的坦克。</td>
    </tr>
  </tbody>
</table>

<p>最稳定的 2 环默认组合通常是 <strong>无踪步</strong> + <strong>荆棘丛生</strong>。一个负责开战前的主动权，一个负责开战后的移动惩罚。如果队伍已经有潜行方案，再按战役威胁补次级复原术或灼热金属。</p>

<h2>最好用的 3 环 DND 德鲁伊法术</h2>

<p>3 环法术会让德鲁伊真正进入强势期：大范围区域、天气、无专注地形封锁、召唤。强度很高，但也更考验玩家和 DM 的桌面管理。</p>

<table>
  <thead>
    <tr>
      <th>法术</th>
      <th>最佳用途</th>
      <th>桌面提醒</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>雪雨暴 (Sleet Storm)</strong></td>
      <td>打断敌方法师专注、封视野、拖慢移动，让组织好的敌人被迫浪费回合重新站位。</td>
      <td>施放前提醒队友。位置放错时，也会破坏自己人的计划。</td>
    </tr>
    <tr>
      <td><strong>植物滋长 (Plant Growth)</strong></td>
      <td>不需要专注的大范围移动封锁，尤其适合自然地形、瓶颈点和防守战。</td>
      <td>因为不吃专注，所以能和其他持续计划并行。</td>
    </tr>
    <tr>
      <td><strong>召雷术 (Call Lightning)</strong></td>
      <td>户外长战斗，每回合可以持续花动作劈雷。</td>
      <td>短战、室内狭窄环境、专注压力很大时表现会下降。</td>
    </tr>
    <tr>
      <td><strong>解除魔法 (Dispel Magic)</strong></td>
      <td>处理敌人魔法效果、陷阱、增益和无法靠武器解决的持续问题。</td>
      <td>不花哨，但很多战役都会奖励队里有人准备它。</td>
    </tr>
    <tr>
      <td><strong>召唤动物 (Conjure Animals)</strong></td>
      <td>适合 2014 风格规则、且 DM 愿意快速处理多只野兽的桌。</td>
      <td>围绕它构筑前先和 DM 说清召唤规则、选怪方式和回合速度。</td>
    </tr>
    <tr>
      <td><strong>水下呼吸 (Water Breathing)</strong></td>
      <td>旅行、潜入、船团、被淹地城，以及任何水域会成为阻碍的冒险。</td>
      <td>需要时准备即可，不必长期占据默认战斗列表。</td>
    </tr>
  </tbody>
</table>

<p>一个均衡的 5 级德鲁伊，可以优先考虑 <strong>雪雨暴</strong>、<strong>植物滋长</strong> 和 <strong>解除魔法</strong>。召唤动物只有在桌上已经说好召唤物由谁选、怎么行动、回合耗时多少时，才适合作为核心法术。</p>

<h2>德鲁伊专注：真正隐藏的法术位成本</h2>

<p>很多最强 <strong>DND 德鲁伊法术</strong> 都需要专注。这意味着你不是在比较所有法术，而是在问：下一场战斗里，哪一个专注法术最值得定义接下来的几轮？</p>

<table>
  <thead>
    <tr>
      <th>局面</th>
      <th>最适合的专注法术</th>
      <th>原因</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>低级近战敌人扎堆</td>
      <td>纠缠术</td>
      <td>束缚敌人移动，并让队友更容易命中。</td>
    </tr>
    <tr>
      <td>队伍需要潜行</td>
      <td>无踪步</td>
      <td>潜入成功时，战斗可能根本不用发生。</td>
    </tr>
    <tr>
      <td>敌人必须穿过地面</td>
      <td>荆棘丛生</td>
      <td>每一步强制移动都会变成伤害和压力。</td>
    </tr>
    <tr>
      <td>需要干扰敌方法师或弓手</td>
      <td>雪雨暴</td>
      <td>封视野、制造困难地形，并可能逼出专注豁免。</td>
    </tr>
    <tr>
      <td>户外长战斗</td>
      <td>召雷术</td>
      <td>战斗持续足够久时，反复动作伤害才会回本。</td>
    </tr>
  </tbody>
</table>

<p>如果你经常掉专注，先解决这个问题，再谈更多花哨法术。站在掩体后、谨慎使用野兽形态、规划属性时参考 <a href="${ZH_DND_CONSTITUTION_PATH}">DND Constitution 指南</a>，需要判定时可以直接打开 <a href="${ZH_DICE_ROLLER_PATH}">D&amp;D 骰子工具</a>。</p>

<h2>按德鲁伊等级准备法术示例</h2>

<p>具体能准备多少法术，取决于你的德鲁伊等级、感知修正值和使用的规则版本。在常见 <a href="${DND_DRUID_2014_RULES_URL}" rel="noreferrer noopener">2014 版 5e Druid 规则</a> 下，德鲁伊长休后可准备的法术数量 = 德鲁伊等级 + 感知修正值；戏法另算。<a href="${DND_DRUID_2024_RULES_URL}" rel="noreferrer noopener">2024 版 Druid 规则</a> 有自己的职业进度，所以抄准备表前要先确认你们桌采用哪一版。下面只是实战默认模板，要按战役调整。</p>

<table>
  <thead>
    <tr>
      <th>德鲁伊等级</th>
      <th>默认准备核心</th>
      <th>按场景替换</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1 级</td>
      <td>神莓术、纠缠术、治愈真言</td>
      <td>侦测魔法、动物交谈、雷鸣波</td>
    </tr>
    <tr>
      <td>3 级</td>
      <td>神莓术、治愈真言、纠缠术、无踪步、荆棘丛生</td>
      <td>次级复原术、月华之光、灼热金属、强化属性</td>
    </tr>
    <tr>
      <td>5 级</td>
      <td>神莓术、治愈真言、无踪步、荆棘丛生、植物滋长、雪雨暴、解除魔法</td>
      <td>水下呼吸、召雷术、召唤动物、植物交谈</td>
    </tr>
  </tbody>
</table>

<p>不要盲抄这张表。它的意义是保留一套覆盖生存、控场、潜行和反魔法的核心，同时给明天的冒险留空间。沼泽探索、城市潜入、亡灵墓穴、雪山旅行和政治谈判，不应该使用完全一样的准备列表。</p>

<h2>按队伍职责选择 DND 德鲁伊法术</h2>

<p>德鲁伊会随着队伍需求改变形状。同一个法术在不同队伍里，可能是神技，也可能只是重复功能。</p>

<table>
  <thead>
    <tr>
      <th>队伍缺口</th>
      <th>推荐法术</th>
      <th>为什么适合</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>控场</td>
      <td>纠缠术、荆棘丛生、雪雨暴、植物滋长</td>
      <td>让敌人浪费移动、动作和站位。</td>
    </tr>
    <tr>
      <td>治疗</td>
      <td>神莓术、治愈真言、次级复原术</td>
      <td>德鲁伊治疗最适合救急和解异常，而不是每回合硬奶伤害。</td>
    </tr>
    <tr>
      <td>潜行 / 侦查</td>
      <td>无踪步、强化属性、动物交谈</td>
      <td>帮助队伍收集信息、绕开糟糕战斗或提前进入有利位置。</td>
    </tr>
    <tr>
      <td>伤害</td>
      <td>荆棘丛生、月华之光、召雷术、灼热金属</td>
      <td>德鲁伊伤害经常依赖地形、持续时间和敌人类型，而不是单纯爆发。</td>
    </tr>
    <tr>
      <td>工具</td>
      <td>侦测魔法、水下呼吸、植物交谈、解除魔法</td>
      <td>这些法术会让德鲁伊成为队伍的野外问题解决者。</td>
    </tr>
  </tbody>
</table>

<p>如果你们桌还在分配职业和职责，可以配合 <a href="${ZH_DND_CLASSES_PATH}">DND 职业详解</a> 一起看。如果战役里敌方法师很多，<a href="${ZH_DND_COUNTERSPELL_PATH}">DND Counterspell 指南</a> 也有参考价值；德鲁伊通常不拿 Counterspell，但理解反应时机和敌方法术威胁，会影响你准备哪些控场与反制工具。</p>

<h2>德鲁伊结社差异：月亮、土地、孢子与星辰</h2>

<p>子职业不会完全改写最强德鲁伊法术，但会改变哪些法术更急迫。</p>

<h3>月亮结社 (Circle of the Moon)</h3>
<p>月亮德鲁伊经常先施放一个专注法术，再进入野兽形态占位置。纠缠术、荆棘丛生、月华之光、召雷术都能用，关键是变形后保护专注。不要把所有法术位都用来保自己；变形前那一发法术应该让整个战场对敌人更糟。</p>

<h3>土地结社 (Circle of the Land)</h3>
<p>土地德鲁伊更依赖施法广度。因为你更重视法术而不是野兽形态耐久，默认准备表应该包含无踪步、解除魔法、植物滋长和地形工具。思路接近一个有自然工具箱的准备施法者。</p>

<h3>孢子结社 (Circle of Spores)</h3>
<p>孢子德鲁伊更容易被诱惑到危险距离，所以橡棍术、治愈真言、吸收元素和惩罚敌人靠近的控场法术会更重要。但你仍然不应该和敌人硬换血。用法术让敌人为走近你付出代价。</p>

<h3>星辰结社 (Circle of Stars)</h3>
<p>星辰德鲁伊很擅长维持专注和支援队友，这会让原本就优秀的控场法术更强。如果你的桌允许这个子职业，就把维持专注当成一项高级资源：选择值得被保护的法术。</p>

<h2>DND 德鲁伊法术陷阱清单</h2>

<p>陷阱不一定等于永远不能施放。它的意思是：这个法术容易被高估，容易在错误的一天准备，或者容易用出比其他德鲁伊选项更低的收益。</p>

<ul>
  <li><strong>树肤术：</strong>2014 风格规则下，专注成本太贵，换来的 AC 不够好。如果你需要防御，站位和控场通常更强。</li>
  <li><strong>火焰刀：</strong>很有画面感，但它吃专注，还要求你不断近战花动作。很多德鲁伊用荆棘丛生、月华之光或控场会更赚。</li>
  <li><strong>野兽感官：</strong>特定侦查战役有用，但不适合默认天天准备。</li>
  <li><strong>寻找动植物：</strong>当问题刚好相关时很强，不相关时就是空占格子。适合在正确旅行日准备，而不是每天准备。</li>
  <li><strong>没有桌面共识的召唤动物：</strong>强度很高，但如果没人知道由谁选生物、回合怎么跑，就会变成节奏问题。</li>
</ul>

<p>避坑最简单的问题是：<strong>明天最可能出现什么问题？</strong>如果答案是“不确定的地城战斗”，准备泛用控场。如果答案是“过河”“城市潜入”“疾病爆发”或“和森林精魂交涉”，就针对那个问题准备。</p>

<h2>在 VTT 和骰子工具里使用德鲁伊法术</h2>

<p>德鲁伊比很多职业更容易制造桌面标记：束缚敌人、荆棘丛生区域、月华之光区域、召唤物、野兽形态、潜行状态和专注提醒。在 Roll20、Foundry、Owlbear Rodeo 这类虚拟桌面里，如果视觉不清楚，场面很快会乱。</p>

<p>建议给普通形态和最常用野兽形态分别准备不同 Token。你可以直接在 <a href="${ZH_EDITOR_PATH}">VTT Token 制作工具</a> 里制作，把野兽形态的边框或颜色做出明显区别。遇到专注豁免、神莓术数量、重复区域伤害时，把 <a href="${ZH_DICE_ROLLER_PATH}">D&amp;D 骰子工具</a> 开在旁边，能减少查数和口算时间。</p>

<h2>关于 DND 德鲁伊法术的常见问题 (FAQ)</h2>

<h3>新手最好用的 DND 德鲁伊法术有哪些？</h3>
<p>新手最值得优先看的 <strong>DND 德鲁伊法术</strong> 是神导术、荆棘之鞭、神莓术、纠缠术、治愈真言、无踪步、荆棘丛生、植物滋长、雪雨暴和解除魔法。这套组合覆盖工具、救急治疗、潜行、控场和反魔法，不需要一上来背完整法术表。</p>

<h3>德鲁伊可以在野兽形态 (Wild Shape) 下施法吗？</h3>
<p>在常见 2014 风格 5e 规则下，德鲁伊通常不能在野兽形态里施放新的法术。但你可以维持变形前已经施放的专注法术，所以“先放纠缠术、荆棘丛生、月华之光等控场，再变形”是月亮德鲁伊常见打法。高等级特性和不同规则版本可能改变细节，以官方 <a href="${DND_DRUID_2014_RULES_URL}" rel="noreferrer noopener">2014 版 Druid</a> 或 <a href="${DND_DRUID_2024_RULES_URL}" rel="noreferrer noopener">2024 版 Druid</a> 规则文本为准。</p>

<h3>DND 5e 德鲁伊能准备多少法术？</h3>
<p>在常见 2014 版 5e 规则下，德鲁伊长休后可准备的法术数量 = 德鲁伊等级 + 感知修正值，戏法另算。如果你的队伍使用 2024 规则或自定义准备法术规则，要直接核对那一版文本，因为准备法术进度可能不再等同于旧公式。</p>

<h3>神莓术 (Goodberry) 是否太强？</h3>
<p><a href="${DND_GOODBERRY_2014_RULES_URL}" rel="noreferrer noopener">神莓术 (Goodberry)</a> 很强，因为 1 环法术位能换稳定治疗和食物。它在某些桌上会显得过强，尤其是允许每天长休前用剩余法术位囤神莓时，所以有些 DM 会提前定规则。即使处理更严格，它仍然是低级 <strong>DND 德鲁伊法术</strong> 里最实用的选择之一。</p>

<h3>召唤动物 (Conjure Animals) 还值得准备吗？</h3>
<p>在 2014 版 5e 中，<a href="${DND_CONJURE_ANIMALS_2014_RULES_URL}" rel="noreferrer noopener">召唤动物 (Conjure Animals)</a> 可以非常强，因为额外生物能攻击、挡路、吸引敌人注意。但它也是最容易拖慢桌面节奏的法术之一。只有当 DM 说清楚使用哪套召唤规则、谁选择野兽、召唤物回合必须多快跑完时，才适合作为核心法术。</p>

<h3>德鲁伊应该准备治疗法术还是伤害法术？</h3>
<p>至少准备一个救急治疗法术，通常是治愈真言。但不要把整张表都围绕治疗搭建。德鲁伊通常靠控住移动、用无踪步避免战斗、或者用地形打乱敌人计划，来阻止更多伤害，而不是每回合硬奶。</p>

<h2>视频吐槽：德鲁伊到底是个什么职业？</h2>

<p>下面的视频适合作为轻量补充，用来看德鲁伊的职业气质和桌面风格。真正决定德鲁伊强度的，不只是“自然魔法”这个主题，而是你能不能用 <strong>DND 德鲁伊法术</strong> 改变敌人正在面对的问题。</p>

${liteVideoEmbed('WMo_gCRMSfA', 'A Crap Guide to D&D [5th Edition] - Druid')}
`;
