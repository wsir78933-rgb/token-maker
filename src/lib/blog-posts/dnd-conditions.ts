import {
  CONDITIONS_EXHAUSTION_STACK_IMAGE_PATH,
  CONDITIONS_EXHAUSTION_STACK_ZH_IMAGE_PATH,
  CONDITIONS_GRAPPLE_RESTRAIN_IMAGE_PATH,
  CONDITIONS_GRAPPLE_RESTRAIN_ZH_IMAGE_PATH,
  CONDITIONS_YEAR_LOCK_IMAGE_PATH,
  CONDITIONS_YEAR_LOCK_ZH_IMAGE_PATH,
  DND_2024_RULES_GLOSSARY_URL,
  DND_SAGE_ADVICE_COMPENDIUM_URL,
  DND_SRD_51_PDF_URL,
  DND_SRD_521_PDF_URL,
  DND_SRD_URL,
  EN_DICE_ROLLER_PATH,
  EN_PLAYERS_HANDBOOK_DND_5E_PATH,
  HUIJI_2014_CONDITIONS_URL,
  HUIJI_2024_CONDITIONS_URL,
  ZH_DICE_ROLLER_PATH,
  ZH_MIND_FLAYER_DND_PATH,
  ZH_PLAYERS_HANDBOOK_DND_5E_PATH,
} from './shared';

export const dndConditionsArticleHtml = String.raw`
<p>Write <code>2014</code> or <code>2024</code> on the initiative tracker before the first save, then copy tonight&rsquo;s <strong>dnd conditions</strong> from that year. Both years print the same fifteen names: Blinded, Charmed, Deafened, Exhaustion, Frightened, Grappled, Incapacitated, Invisible, Paralyzed, Petrified, Poisoned, Prone, Restrained, Stunned, and Unconscious. Matching names are not matching math. Grappled is not Restrained. Stunned is not Paralyzed. Exhaustion already at 2, then gain 1, is 3, and that 3 uses two different number sets.</p>

<p>If the table has not named a year, settle it with the <a href="${EN_PLAYERS_HANDBOOK_DND_5E_PATH}" rel="noreferrer noopener">Player&rsquo;s Handbook version guide</a>, write the year, and open only that year&rsquo;s condition lines. Public lookups sit on the <a href="${DND_SRD_URL}" rel="noreferrer noopener">System Reference Document</a> for the 2014 and 2024 document set, and on the <a href="${DND_2024_RULES_GLOSSARY_URL}" rel="noreferrer noopener">2024 Rules Glossary</a> for the 2024 condition entries.</p>

<h2>Lock 2014 or 2024 before the first save</h2>

<p>Write the year next to the initiative list. Then copy each of the fifteen names from that year only. A tracker that keeps 2024 Grappled (Disadvantage on attacks other than the grappler), a 2014 Exhaustion table (disadvantage, halved speed, halved hit-point maximum), and 2024 Stunned (no Speed 0 on that line) is three books on one card. Stop and write one year. Open the <a href="${DND_SRD_URL}" rel="noreferrer noopener">SRD landing page</a> for the public 2014 and 2024 set, or the <a href="${DND_2024_RULES_GLOSSARY_URL}" rel="noreferrer noopener">2024 Rules Glossary</a> when the tracker says 2024. Do not paste a 2024 glossary sentence onto a 2014 save. Do not paste a 2014 Appendix A sentence onto a 2024 save.</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${CONDITIONS_YEAR_LOCK_IMAGE_PATH}"
    alt="Card titled Lock 2014 or 2024. Same fifteen names. Three lines change. Grappled: 2014 no attack disadvantage; 2024 Disadvantage vs others (not the grappler). Stunned: 2014 can't move; 2024 no Speed 0 on this line. Exhaustion 3: 2014 levels 1+2+3 together; 2024 D20 −6 and Speed −15 ft."
    width="1536"
    height="960"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Lock 2014 or 2024. Same fifteen names. Three lines change. Grappled: 2014 no attack disadvantage; 2024 Disadvantage vs others (not the grappler). Stunned: 2014 can't move; 2024 no Speed 0 on this line. Exhaustion 3: 2014 levels 1+2+3 together; 2024 D20 −6 and Speed −15 ft.</figcaption>
</figure>

<p>Lock the year because three lines change the first roll if you mix books. The 2014 Grappled line does not list attack disadvantage; 2024 Grappled adds Disadvantage on attacks other than the grappler. 2014 Stunned writes can&rsquo;t move; the 2024 Stunned line does not list Speed 0. Exhaustion 3 in 2014 is levels 1+2+3 together; Exhaustion 3 in 2024 is −6 on D20 Tests and −15 feet of Speed. Those three splits are the reason the year has to be written before anyone is asked for a save.</p>

<p>Write one source line on the tracker:</p>

<ul>
  <li><code>Conditions (Player's Handbook 2014 / SRD 5.1)</code></li>
  <li><code>Conditions (Player's Handbook 2024 / Rules Glossary)</code></li>
</ul>

<p>Those two lines are not interchangeable. The fifteen names match. Matching names do not make matching math. If the tracker is blank, stop and lock a year. If two players brought different years, pick one list for the table. Do not average them. Do not keep a 2024 glossary bullet on a 2014 card because it is shorter. Do not keep a 2014 Exhaustion row on a 2024 card because you remember disadvantage.</p>

<p>On the first save of the night, run this order. Name the condition. Read the year on the tracker. Open that year&rsquo;s line for that name. Apply only that line. Extra riders on the spell or monster that imposed the condition stay on that spell or monster; they are not imported from the other year&rsquo;s condition list. If a sentence you remember from the other book is missing, that year&rsquo;s line does not list it. Leave it off.</p>

<p>On the map, do not draw Grappled and Restrained as the same circle. Both set Speed to 0. Only Restrained adds Dexterity-save disadvantage.</p>

<h2>What each of the 15 dnd conditions blocks tonight</h2>

<p>A condition is a temporary game state. It lasts until something counters it, or until the duration on the effect that imposed it runs out. Read the effect for how long it lasts. Read the condition for what it blocks while it is on. Same-name conditions do not stack into a worse copy of themselves. A second Charmed does not become a stronger Charmed; the creature either has Charmed or does not. Exhaustion is the written exception: levels add. Bloodied is not one of the fifteen; in the 2024 glossary it is a hit-point flag (half Hit Points or fewer), not a Condition entry. Burning in that same glossary is tagged Hazard, not Condition. Do not add either name to the fifteen-name list. Condition is also not a sneak-attack setup or a spell trigger. Those gates tell you when an action is legal. The fifteen names tell you what is blocked while the named state is on.</p>

<p>Read across one row and copy the cell for the year on the tracker. Keep Charmed&rsquo;s 2014 word <em>harmful</em> and 2024 word <em>damaging</em> as printed; do not merge them. If a cell says the line does not list a penalty, leave that penalty off.</p>

<table>
  <thead>
    <tr>
      <th>Condition</th>
      <th>2014</th>
      <th>2024</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Blinded</td>
      <td>Can&rsquo;t see. Sight checks fail. Attacks vs you have advantage; your attacks have disadvantage.</td>
      <td>Can&rsquo;t see. Sight checks fail. Attacks vs you have Advantage; your attacks have Disadvantage.</td>
    </tr>
    <tr>
      <td>Charmed</td>
      <td>Can&rsquo;t attack the charmer or target them with harmful abilities or magical effects. Charmer has advantage on social checks vs you.</td>
      <td>Can&rsquo;t attack the charmer or target them with damaging abilities or magical effects. Charmer has Advantage on social checks vs you.</td>
    </tr>
    <tr>
      <td>Deafened</td>
      <td>Can&rsquo;t hear. Hearing checks fail.</td>
      <td>Can&rsquo;t hear. Hearing checks fail.</td>
    </tr>
    <tr>
      <td>Exhaustion</td>
      <td>Levels add. You have the current level and every lower level. 6 is death. Long rest −1 if food and drink. This line does not list raise-from-the-dead −1.</td>
      <td>Each gain +1 level. D20 Tests −2 per level. Speed −5 feet per level. 6 is death. Long rest −1. This line does not list disadvantage or halved hit-point maximum.</td>
    </tr>
    <tr>
      <td>Frightened</td>
      <td>While the source is in line of sight: disadvantage on checks and attacks. Can&rsquo;t willingly move closer. This line does not list Speed 0.</td>
      <td>While the source is in line of sight: Disadvantage on checks and attacks. Can&rsquo;t willingly move closer. This line does not list Speed 0.</td>
    </tr>
    <tr>
      <td>Grappled</td>
      <td>Speed 0; no benefit from a bonus to speed. This line does not list attack disadvantage or Dexterity-save disadvantage.</td>
      <td>Speed 0 and cannot increase. Disadvantage on attacks other than the grappler. This line does not list Dexterity-save disadvantage.</td>
    </tr>
    <tr>
      <td>Incapacitated</td>
      <td>Can&rsquo;t take actions or reactions. This line does not list Speed 0, speech, Initiative, or concentration.</td>
      <td>No Action, Bonus Action, or Reaction. Concentration broken. Can&rsquo;t speak. Initiative Disadvantage if already Incapacitated when you roll. This line does not list Speed 0.</td>
    </tr>
    <tr>
      <td>Invisible</td>
      <td>Unseen without magic or a special sense. Heavily obscured for hiding. Noise or tracks can give away location. Attacks vs you disadvantage; your attacks advantage.</td>
      <td>Initiative Advantage if already Invisible when you roll. Effects that need a seen target miss you unless the creator can see you. Attacks vs you have Disadvantage, and your attacks have Advantage. If a creature can see you, you do not gain this benefit against that creature. This line does not list heavily obscured or tracks.</td>
    </tr>
    <tr>
      <td>Paralyzed</td>
      <td>Incapacitated. Can&rsquo;t move or speak. Str/Dex saves fail. Attacks vs you advantage. A hit from 5 feet is a critical hit.</td>
      <td>Incapacitated. Speed 0 and cannot increase. Str/Dex saves fail. Attacks vs you Advantage. A hit from 5 feet is a Critical Hit.</td>
    </tr>
    <tr>
      <td>Petrified</td>
      <td>Turned to solid (usually stone); weight &times;10; stop aging. Incapacitated; can&rsquo;t move or speak; unaware. Attacks vs you advantage; Str/Dex fail; resist all damage; immune to poison and disease (already-present ones are suspended).</td>
      <td>Turned to solid (usually stone); weight &times;10; stop aging. Incapacitated; Speed 0 and cannot increase. Attacks vs you Advantage; Str/Dex fail; Resistance to all damage; Immunity to Poisoned. This line does not list unaware, disease, or suspended.</td>
    </tr>
    <tr>
      <td>Poisoned</td>
      <td>Attack rolls and ability checks have disadvantage.</td>
      <td>Attack rolls and ability checks have Disadvantage.</td>
    </tr>
    <tr>
      <td>Prone</td>
      <td>Crawl unless you stand and end it. Your attacks disadvantage. Attacks vs you: advantage within 5 feet, otherwise disadvantage.</td>
      <td>Crawl, or spend half Speed (round down) to stand and end it. Speed 0: can&rsquo;t stand. Your attacks Disadvantage. Attacks vs you: Advantage within 5 feet, otherwise Disadvantage.</td>
    </tr>
    <tr>
      <td>Restrained</td>
      <td>Speed 0; no benefit from a bonus to speed. Attacks vs you advantage. Your attacks disadvantage. Dexterity saves disadvantage.</td>
      <td>Speed 0 and cannot increase. Attacks vs you Advantage. Your attacks Disadvantage. Dexterity saves Disadvantage.</td>
    </tr>
    <tr>
      <td>Stunned</td>
      <td>Incapacitated; can&rsquo;t move; speak only falteringly. Str/Dex saves fail. Attacks vs you advantage. This line does not list a 5-foot critical hit.</td>
      <td>Incapacitated. Str/Dex saves fail. Attacks vs you Advantage. This line does not list Speed 0, cannot move, or a 5-foot Critical Hit.</td>
    </tr>
    <tr>
      <td>Unconscious</td>
      <td>Incapacitated; can&rsquo;t move or speak; unaware; drop held items and fall prone. Str/Dex fail. Attacks vs you advantage. A hit from 5 feet is a critical hit.</td>
      <td>Incapacitated and Prone; drop held items; remain Prone when this ends. Speed 0 and cannot increase. Attacks vs you Advantage. Str/Dex fail. A hit from 5 feet is a Critical Hit. Unaware.</td>
    </tr>
  </tbody>
</table>

<p>Apply a row as a ruling, not as a memory of the other book. Name the condition. Read the year. Copy that cell. If the imposing effect adds a rider, keep the rider on that effect. Do not drag a missing sentence across the year gap because the table looks empty.</p>

<p>Blinded on these lines does not set Speed to 0 or strip actions; a Blinded creature can still walk unless something else stops it. Deafened is not a silence aura and does not flip attack rolls. Poisoned on these lines does not flip saving throws or Speed; do not treat it as 2024 Exhaustion&rsquo;s D20 Test penalty, and do not treat it as a 2014 save penalty.</p>

<p>Charmed on these lines does not force you to fight your allies. If a spell adds that rider, the rider is on the spell. Frightened uses line of sight in the ordinary English sense: if the creature cannot see the source, the source is not in line of sight. The creature can still move sideways or away.</p>

<p>Petrified turns worn or carried nonmagical objects solid with the creature. The 2014 Prone condition line does not list the stand cost; that cost sits in 2014 Combat, Being Prone: standing costs half speed, and Speed 0 (or not enough remaining movement) means you cannot stand; crawl costs an extra foot per foot.</p>

<h2>Grappled is not Restrained</h2>

<p>Tonight the difference is five questions: can you walk, who do you attack, how do people hit you, what happens to Dexterity saves, and how do you get out. Answer those from the locked year. Do not answer them from the other condition&rsquo;s row. Both names set Speed to 0. Dexterity-save disadvantage is only on Restrained. The 2014 Grappled line does not list attack disadvantage. Do not copy 2024&rsquo;s Disadvantage on attacks other than the grappler onto a 2014 Grappled creature.</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${CONDITIONS_GRAPPLE_RESTRAIN_IMAGE_PATH}"
    alt="Card titled Grappled vs Restrained. Both Speed 0. Dex save disadvantage is only Restrained. Grappled: Speed 0, 2014 no attack disadvantage, 2024 disadvantage vs others than grappler, no Dex save disadvantage. Restrained: Speed 0, attacks vs you Advantage, your attacks Disadvantage, Dex saves Disadvantage."
    width="1536"
    height="960"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Grappled vs Restrained. Both Speed 0. Dex save disadvantage is only Restrained. Grappled: Speed 0, 2014 no attack disadvantage, 2024 disadvantage vs others than grappler, no Dex save disadvantage. Restrained: Speed 0, attacks vs you Advantage, your attacks Disadvantage, Dex saves Disadvantage.</figcaption>
</figure>

<table>
  <thead>
    <tr>
      <th>Tonight</th>
      <th>Grappled</th>
      <th>Restrained</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Walk</td>
      <td>Both years: Speed 0. 2024 also: cannot increase; grappler can drag (extra 1 foot per foot unless Tiny or two or more sizes smaller). 2014 drag is not on this condition line.</td>
      <td>Speed 0 (2024: cannot increase). No drag line.</td>
    </tr>
    <tr>
      <td>Your attacks</td>
      <td>2014: The 2014 Grappled line does not list attack disadvantage.<br />2024: Disadvantage on attacks other than the grappler.</td>
      <td>Your attacks have disadvantage / Disadvantage.</td>
    </tr>
    <tr>
      <td>Attacks vs you</td>
      <td>Both years: this line does not grant advantage on attacks against you.</td>
      <td>Attacks against you have advantage / Advantage.</td>
    </tr>
    <tr>
      <td>Dexterity saves</td>
      <td>Both years: this line does not list Dexterity-save disadvantage.</td>
      <td>Dexterity saves have disadvantage / Disadvantage.</td>
    </tr>
    <tr>
      <td>Get out</td>
      <td>2014: ends if the grappler is incapacitated or you are moved out of reach.<br />2024: end rules sit on Grappling, not on this condition line.</td>
      <td>Read the spell, net, or monster that applied it.</td>
    </tr>
  </tbody>
</table>

<p>2024 end rules sit on Grappling, not on the Grappled line: the target can take an action for Strength (Athletics) or Dexterity (Acrobatics) against the escape DC; the grappler is Incapacitated; the distance exceeds the grapple&rsquo;s range; or the grappler lets go (no action). Do not copy that 2024 escape DC onto a 2014 Grappled cell. 2014 Combat, Grappling, still lets the grappled creature use its action for a contested Strength (Athletics) or Dexterity (Acrobatics) check. That contest is not on the 2014 Grappled condition line.</p>

<p>Drag is the other year split people paste onto the wrong line. 2024 Grappled writes Movable on the condition: the grappler can drag or carry you, and every foot costs 1 extra foot, unless you are Tiny or two or more sizes smaller. 2014 drag is not on the Grappled condition line. It sits in 2014 Combat, Moving a Grappled Creature: you can drag or carry the creature, but your speed is halved unless the target is two or more sizes smaller. That 2014 Combat sentence does not list a Tiny exception, and it does not use the 2024 extra-foot cost. Do not write 2024 Movable onto a 2014 Grappled card. Do not write 2014 halved-speed drag onto a 2024 Grappled card. Restrained has no drag line in either year.</p>

<p>The 2014 Grappler feat is a common way a table turns Grappled into Restrained. It is a feat, not the Grappled condition. If the printed 2014 feat is in play (Strength 13 or higher), you have advantage on attacks against a target you are grappling, and you can use an action for another grapple check; on a success, you and the target are Restrained until the grapple ends. That pin is why a Grappled creature suddenly picks up Dexterity-save disadvantage. The disadvantage came from Restrained, not from Grappled. Do not treat Grappler as a Grappled bullet.</p>

<p>Example. The tracker says 2014. A creature is Grappled. Speed is 0. An attack against a third creature does not pick up Grappled disadvantage. A Dexterity save does not pick up Grappled disadvantage. Attackers do not gain advantage from Grappled. If that creature were Restrained instead, the attack would have disadvantage, the Dexterity save would have disadvantage, and attacks against it would have advantage.</p>

<p>Example. The tracker says 2024. A creature is Grappled. Speed is 0 and cannot increase. Attacks other than the grappler have Disadvantage. A Dexterity save still does not pick up Grappled Disadvantage. Attackers still do not gain Advantage from Grappled. The grappler can drag that creature using the 2024 extra-foot cost unless the size exception applies. End the grapple from the Grappling entry, not from a 2014 condition bullet.</p>

<h2>Stunned is not Paralyzed</h2>

<p>Both years include Incapacitated on Stunned and on Paralyzed. Both years fail Strength and Dexterity saves automatically. Both years give attackers advantage / Advantage. That overlap is why the names get swapped. The swap is still wrong. Both years&rsquo; Paralyzed lines turn a hit from 5 feet into a critical hit / Critical Hit. Both years&rsquo; Stunned lines do not list that 5-foot critical. Unconscious also has the 5-foot critical. Stunned does not. Do not steal the 5-foot critical from Paralyzed or Unconscious and write it onto Stunned.</p>

<table>
  <thead>
    <tr>
      <th>Tonight</th>
      <th>Stunned</th>
      <th>Paralyzed</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Incapacitated</td>
      <td>Yes, both years.</td>
      <td>Yes, both years.</td>
    </tr>
    <tr>
      <td>Move</td>
      <td>2014: can&rsquo;t move.<br />2024: The 2024 Stunned line does not list Speed 0 or can&rsquo;t move.</td>
      <td>2014: can&rsquo;t move or speak.<br />2024: Speed 0 and cannot increase.</td>
    </tr>
    <tr>
      <td>Speak</td>
      <td>2014: only falteringly.<br />2024: Speechless comes from Incapacitated, not as a Stunned-only extra.</td>
      <td>2014: can&rsquo;t speak.<br />2024: Speechless from Incapacitated.</td>
    </tr>
    <tr>
      <td>Str / Dex saves</td>
      <td>Automatic failure, both years.</td>
      <td>Automatic failure, both years.</td>
    </tr>
    <tr>
      <td>Attacks vs you</td>
      <td>Advantage, both years.</td>
      <td>Advantage, both years.</td>
    </tr>
    <tr>
      <td>Hit from 5 feet</td>
      <td>Both years: this line does not list a critical hit.</td>
      <td>A hit is a critical hit / Critical Hit.</td>
    </tr>
  </tbody>
</table>

<p>The 2024 Stunned line does not list Speed 0. Do not write Speed 0 onto that line because 2014 Stunned said can&rsquo;t move, and do not write can&rsquo;t move onto it because Paralyzed still stops movement. The <a href="${DND_SAGE_ADVICE_COMPENDIUM_URL}" rel="noreferrer noopener">Sage Advice Compendium</a> asks whether Stunned no longer preventing movement is intentional. The answer is yes. The change widens the gap with Paralyzed, with Stunned now allowing you to move. On a 2024 tracker, a Stunned creature can still spend Speed. Moving is not an Action.</p>

<p>Incapacitated is included on both names. A 2024 Stunned creature inherits no Action and no speech from Incapacitated, and still does not inherit Speed 0 from Incapacitated. A 2024 Paralyzed creature inherits the same Incapacitated effects and then adds Speed 0 on Paralyzed. That is the split the Sage Advice note is protecting. Do not treat Incapacitated as a synonym for cannot move.</p>

<p>Concentration follows the same year split as Incapacitated. 2014: you lose concentration on a spell if you are incapacitated or if you die. That sentence lives in 2014 Spellcasting, Concentration, not on the Incapacitated condition line. Do not tell the table that 2014 Incapacitated can keep concentrating. Do not tell the table that breaking concentration is a 2024-only invention. On a 2014 tracker, Incapacitated still ends concentration, and the pointer is the spellcasting chapter. On a 2024 tracker, Incapacitated writes No Concentration, and the 2024 Concentration entry agrees that Incapacitated or Dead ends Concentration. Same outcome, different page. Stunned includes Incapacitated, so a Stunned spellcaster drops concentration in both years. The 2014 pointer is Spellcasting. The 2024 pointer is on the Incapacitated line.</p>

<p>Example. The tracker says 2024. A creature fails a save and is Stunned. On its turn it can still spend Speed. It cannot take an Action, Bonus Action, or Reaction, because Incapacitated is on. It cannot speak, because 2024 Incapacitated includes Speechless. A melee hit from 5 feet is not a Critical Hit from Stunned. If the same save had applied Paralyzed, Speed would be 0, and that 5-foot hit would be a Critical Hit.</p>

<p>Example. The tracker says 2014. The same failed save is Stunned. The creature cannot move. It can speak only falteringly. Strength and Dexterity saves fail. Attacks against it have advantage. A 5-foot hit is still not a critical hit from Stunned. If the card instead says Paralyzed, add the 5-foot critical and the cannot-move-or-speak line from Paralyzed. Do not add 2024 Speed 0 wording to a 2014 Paralyzed card; 2014 Paralyzed writes can&rsquo;t move, not the words Speed 0.</p>

<h2>Exhaustion: already 2, gain 1 → 3</h2>

<p>Exhaustion is the exception to same-name-does-not-stack. Levels add. The table that matters tonight is not a second Exhaustion sticker with the same name. It is the number already on the creature, plus the number just gained. The required case is already at 2, then gain 1. That creature is at 3. What 3 does depends on the year you wrote on the tracker.</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${CONDITIONS_EXHAUSTION_STACK_IMAGE_PATH}"
    alt="Card titled Already 2, gain 1 → 3. Chips: Already 2, gain 1 →, 3. 2014: 1 ability-check disadvantage, 2 speed halved, 3 attack and save disadvantage together. 2024: D20 tests −6, speed −15 ft, NOT disadvantage, NOT HP max halved."
    width="1536"
    height="960"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Already 2, gain 1 → 3. 2014 at 3 is 1+2+3 together: ability-check disadvantage, speed halved, attack and save disadvantage. 2024 at 3 is D20 tests −6 and speed −15 ft, NOT disadvantage, NOT HP max halved.</figcaption>
</figure>

<p>Example. A creature is already at Exhaustion 2 and then an effect grants 1 more. Write 3 on the tracker. Do not write two separate Exhaustion stickers. Do not leave the number at 2 because other conditions do not stack. Exhaustion does.</p>

<p>2014 uses a six-level table. The creature has the current level and every lower level at the same time.</p>

<table>
  <thead>
    <tr>
      <th>Level</th>
      <th>2014 effect</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>Disadvantage on ability checks</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Speed halved</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Disadvantage on attack rolls and saving throws</td>
    </tr>
    <tr>
      <td>4</td>
      <td>Hit point maximum halved</td>
    </tr>
    <tr>
      <td>5</td>
      <td>Speed reduced to 0</td>
    </tr>
    <tr>
      <td>6</td>
      <td>Death</td>
    </tr>
  </tbody>
</table>

<p>Already at 2, gain 1, and the 2014 number is 3. The creature now has levels 1+2+3 together: disadvantage on ability checks, Speed halved, and disadvantage on attack rolls and saving throws. Level 4 is not on it, so hit-point maximum is not halved. Level 5 is not on it, so Speed is not 0 from Exhaustion. Level 6 is not on it, so the creature is not dead from Exhaustion. Speed is halved once, from level 2. It is not halved a second time because level 3 arrived. If tonight&rsquo;s number is 3, stop at the 1+2+3 bundle. Do not reach down to level 4 because the creature looks tired.</p>

<p>2024 does not use that six-row stack. Each time you gain Exhaustion, you gain 1 level. Level 6 is death. D20 Tests take −2 per level. Speed takes −5 feet per level. Already at 2, gain 1, and the 2024 number is 3: D20 Tests −6, Speed −15 feet. D20 Tests are ability checks, attack rolls, and saving throws together, so the −6 hits all three. It is still a subtraction, not disadvantage. The 2024 Exhaustion line does not list disadvantage. The 2024 Exhaustion line does not list a halved hit-point maximum. Do not put 2014 disadvantage on a 2024 Exhaustion 3 creature. Do not halve hit-point maximum because you remember 2014 level 4.</p>

<table>
  <thead>
    <tr>
      <th>Already 2, gain 1</th>
      <th>2014</th>
      <th>2024</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>New level</td>
      <td>3. Effects of 1+2+3 together.</td>
      <td>3. Penalty scales with the current level.</td>
    </tr>
    <tr>
      <td>Checks / tests</td>
      <td>Disadvantage on ability checks, and disadvantage on attack rolls and saving throws.</td>
      <td>D20 Tests −6. Not disadvantage.</td>
    </tr>
    <tr>
      <td>Speed, starting 40 feet</td>
      <td>Halved once by level 2 → 20 feet.</td>
      <td>−15 feet → 25 feet.</td>
    </tr>
    <tr>
      <td>Hit-point maximum</td>
      <td>Level 4 halves it. Level 3 does not.</td>
      <td>This Exhaustion line does not halve hit-point maximum.</td>
    </tr>
    <tr>
      <td>Death</td>
      <td>Level 6.</td>
      <td>Level 6.</td>
    </tr>
    <tr>
      <td>Long rest</td>
      <td>−1 if the creature ingested some food and drink.</td>
      <td>−1. Dehydration / malnutrition gates sit on those hazard lines, not as a blanket Exhaustion-line rule.</td>
    </tr>
  </tbody>
</table>

<p>Example. A creature with Speed 40 is already at Exhaustion 2, then gains 1, and is now at 3. On 2014, Speed is 20 feet (halved once by level 2), ability checks have disadvantage, and attack rolls and saving throws have disadvantage. On 2024, Speed is 25 feet (40 − 15), and every D20 Test takes −6. Use Speed 40 when you need to see the split. A 30-foot Speed at 3 happens to land on 15 feet in both years, and that coincidence is not a reason to treat the formulas as the same.</p>

<p>Removal is year-locked too. 2014: finishing a long rest reduces Exhaustion by 1 if the creature ingested some food and drink. 2024: finishing a Long Rest removes 1 Exhaustion level. Do not skip the 2014 food-and-drink gate on a 2014 tracker. Do not paste that food-and-drink sentence onto the 2024 Exhaustion line as a blanket rule. 2024 Dehydration says Exhaustion gained from dehydration cannot be removed until the creature drinks a full day&rsquo;s water. 2024 Malnutrition says Exhaustion gained from malnutrition cannot be removed until the creature eats a full day&rsquo;s food. Those gates sit on the hazard lines, not on the Exhaustion condition line as a total long-rest premise. SRD 5.1 does not list a raise-from-the-dead Exhaustion reduction. Leave that −1 off unless the printed book you locked has that sentence.</p>

<p>The year is written. Copy that year&rsquo;s line, then roll the first save. After the name is correct, the <a href="${EN_DICE_ROLLER_PATH}" rel="noreferrer noopener">D&amp;D dice roller</a> can keep the d20 in view; the roller does not choose the year.</p>

<h2>FAQ about dnd conditions</h2>
<h3>Which year&rsquo;s dnd conditions do I use tonight?</h3>
<p>Write <code>2014</code> or <code>2024</code> on the initiative tracker before the first save, then copy each of the fifteen names from that year only. The fifteen names match in both years. Grappled, Stunned, and Exhaustion can use different math.</p>
<h3>Does Grappled give disadvantage on my attacks?</h3>
<p>The 2014 Grappled line does not list attack disadvantage. Speed is 0. On the 2024 Grappled line, you have Disadvantage on attacks other than the grappler. Grappled does not list Dexterity-save disadvantage in either year; that penalty is on Restrained.</p>
<h3>Can a 2024 Stunned creature still move?</h3>
<p>Yes. The 2024 Stunned line does not list Speed 0. The <em>Sage Advice Compendium</em> answers that the change is intentional, with Stunned now allowing you to move. 2014 Stunned still writes can&rsquo;t move. Neither year&rsquo;s Stunned line lists a 5-foot critical hit.</p>
<h3>I&rsquo;m already at Exhaustion 2 and I gain 1 more. What is on me now?</h3>
<p>3. 2014 puts levels 1+2+3 on you together: disadvantage on ability checks, speed halved, and disadvantage on attack rolls and saving throws. 2024 applies D20 Tests −6 and Speed −15 feet. 2024 Exhaustion does not apply disadvantage and does not halve hit-point maximum. Level 6 is death in both years.</p>
<h3>Does Incapacitated stop movement? Does it break concentration?</h3>
<p>Neither year&rsquo;s Incapacitated line is Speed 0. 2014 concentration break sits in Spellcasting Concentration, not on the Incapacitated line. 2024 Incapacitated writes that Concentration is broken. Stunned, Paralyzed, and Unconscious include Incapacitated.</p>

<h2>Sources</h2>

<ul>
  <li><a href="${DND_SRD_URL}" rel="noreferrer noopener">D&amp;D Beyond: System Reference Document</a> — public 2014 and 2024 condition text</li>
  <li><a href="${DND_SRD_51_PDF_URL}" rel="noreferrer noopener">SRD 5.1 PDF</a> — 2014 fifteen conditions and the six-level Exhaustion table</li>
  <li><a href="${DND_SRD_521_PDF_URL}" rel="noreferrer noopener">SRD 5.2.1 PDF</a> — 2024 fifteen conditions and the Exhaustion formula</li>
  <li><a href="${DND_2024_RULES_GLOSSARY_URL}" rel="noreferrer noopener">D&amp;D Beyond 2024 Rules Glossary</a> — 2024 condition lines</li>
  <li><a href="${DND_SAGE_ADVICE_COMPENDIUM_URL}" rel="noreferrer noopener">Sage Advice Compendium</a> — 2024 Stunned still allowing movement is intentional</li>
</ul>
`;

export const dndConditionsArticleHtmlZh = String.raw`
<p>开团前先把卡边写成 2014《玩家手册》状态，或 2024 术语表状态。今晚这张<strong>dnd 5e 状态</strong>是附录里那 15 个：目盲、魅惑、耳聋、力竭、恐慌、受擒、失能、隐形、麻痹、石化、中毒、倒地、束缚、震慑、昏迷；受擒不是束缚，震慑不是麻痹，力竭已经 2 级再获得 1 级升到 3。下一步把年来源写在先攻条、状态卡或共享文档页眉，不要只写「第五版」。</p>

<h2>开团前把卡边写成 2014 或 2024</h2>

<p>问一句：今晚合法的是 2014 还是 2024。写在全桌看得见的地方。两种合法写法只有这两句：「2014《玩家手册》状态」「2024 术语表状态」。只写「第五版状态」锁不住年——两版都是第五版，15 个英文名相同，名单对得上也不等于年对得上。还没选定用哪一年的《玩家手册》时，先看 <a href="${ZH_PLAYERS_HANDBOOK_DND_5E_PATH}" rel="noreferrer noopener">DND《玩家手册》怎么选</a>，选完再回卡边写年。</p>

<p>力竭最能暴露混写。2014 升到 3，同时承受属性检定劣势、速度减半、攻击与豁免劣势。2024 升到 3，是 D20 检定（D20 Test）−6、速度 −15 尺，没有力竭带来的劣势，也没有生命值上限减半。两套力竭不能写进同一句。</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${CONDITIONS_YEAR_LOCK_ZH_IMAGE_PATH}"
    alt="对照卡标题「先锁 2014 或 2024」。15 个名字相同，三条会改判。受擒：2014 没有攻击劣势，2024 对擒抱者以外攻击劣势。震慑：2014 不能移动，2024 这一条没有写速度 0。力竭 3：2014 同时 1+2+3，2024 D20 −6、速度 −15 尺。"
    width="1536"
    height="960"
    loading="lazy"
    decoding="async"
  />
  <figcaption>先锁 2014 或 2024。15 个名字相同，三条会改判。受擒：2014 没有攻击劣势，2024 对擒抱者以外攻击劣势。震慑：2014 不能移动，2024 这一条没有写速度 0。力竭 3：2014 同时 1+2+3，2024 是 D20 −6、速度 −15 尺。</figcaption>
</figure>

<h3>灰机两页只对译名</h3>

<p>中文灰机有两页，不要点进第一张就把词抄走。2014 打开 <a href="${HUIJI_2014_CONDITIONS_URL}" rel="noreferrer noopener">灰机「玩家手册2014/状态」</a>。2024 打开 <a href="${HUIJI_2024_CONDITIONS_URL}" rel="noreferrer noopener">灰机「术语/状态」</a>。两页都把 Conditions 标成「状态」，目录都是这 15 个简体词：目盲、魅惑、耳聋、力竭、恐慌、受擒、失能、隐形、麻痹、石化、中毒、倒地、束缚、震慑、昏迷。15 个名字没有增删。受擒这一条，2014 灰机目录标题常作「擒抱」，2024 灰机目录标题写成「受擒」；动作发出者两边仍说「擒抱者」。状态就叫受擒，不要让灰机标题把擒抱动作和受擒状态粘成一个词。</p>

<p>灰机只对译名。效果、优劣、速度、重击，回到你锁的那年公开文本：2014 与 2024 的入口见 <a href="${DND_SRD_URL}" rel="noreferrer noopener">D&amp;D Beyond 的 SRD</a>，2024 各条效果见 <a href="${DND_2024_RULES_GLOSSARY_URL}" rel="noreferrer noopener">2024 术语表</a>。灰机正文不要拿来改骰子。两页互相指来指去，不是可以把缺句互相补全的上下集：2014 页不会因为你今晚想跑 2024 就变成术语表，2024 页也不会把六档力竭藏在折叠里等你去找全。缺的句子只回锁年那一页，不要从另一年借来补全。</p>

<h3>没写年的中文表</h3>

<p>拿到一份中文状态表，页眉没有年，力竭仍印六档，按 2014 理解。认那张表的办法很具体：力竭按档排列，前几档还能看见属性检定劣势、速度减半、攻击与豁免劣势。卡边补写「按 2014」。不要把六档劣势贴进 2024。2024 力竭不是那张六档劣势表；已经 2 级再获得 1 级同样升到 3，结算却是 D20 检定 −6、速度 −15 尺。</p>

<h2>状态不是条件</h2>

<p>附录这 15 个叫状态，英文括注 Conditions。先决、触发、结束门槛叫条件。两套词不要写进同一条状态栏。</p>

<p>把 dnd 5e 条件四个字丢进百度，先跳出来的是先决条件、招募条件、检定成功条件、至圣斩触发条件，不是附录这 15 个。贴吧有人把「擒抱状态有啥效果」和「结束条件」写进同一个标题：前半问的是受擒这条状态挡住什么，后半问的是怎么结束，那是门槛，不是第 16 个状态。</p>

<p>口头说「偷袭条件」「施法条件」时，指的是这份伤害或法术什么时候能用，不要在状态栏新写一条「偷袭」或「施法」。夺心魔采脑同样。<a href="${ZH_MIND_FLAYER_DND_PATH}" rel="noreferrer noopener">夺心魔</a>那一页写的是采脑要先满足的条件，采脑本身不是状态。门槛里若出现失能或受擒，它们仍是这 15 个之一，不要另造一条叫「采脑」的附录状态。</p>

<h2>15 个状态各挡住什么</h2>

<p>两版英文名相同，无增删：Blinded, Charmed, Deafened, Exhaustion, Frightened, Grappled, Incapacitated, Invisible, Paralyzed, Petrified, Poisoned, Prone, Restrained, Stunned, Unconscious。英文名见本句，表内只用简体二字名。Burning 在 2024 术语表标成 Hazard，Bloodied 没有 Condition 标签，都不是这 15 个。</p>

<table>
  <thead>
    <tr>
      <th scope="col">状态</th>
      <th scope="col">2014</th>
      <th scope="col">2024</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">目盲</th>
      <td>需要视觉的检定自动失败；对你的攻击有优势，你的攻击有劣势</td>
      <td>需要视觉才能完成的检定自动失败；打你的攻击有优势，你打出去的攻击有劣势</td>
    </tr>
    <tr>
      <th scope="row">魅惑</th>
      <td>不能攻击魅惑者，也不能对它使用有害效应；魅惑者对你的社交检定有优势</td>
      <td>不能把攻击或有害效应指向魅惑者；魅惑者对你做社交检定时有优势</td>
    </tr>
    <tr>
      <th scope="row">耳聋</th>
      <td>需要听觉的检定自动失败</td>
      <td>需要听见才能完成的检定自动失败</td>
    </tr>
    <tr>
      <th scope="row">力竭</th>
      <td>已经 2 级再获得 1 级升到 3；同时承受 1+2+3；6 级死亡</td>
      <td>已经 2 级再获得 1 级升到 3；D20 检定 −6、速度 −15 尺；无力竭劣势、无生命值上限减半；6 级死亡</td>
    </tr>
    <tr>
      <th scope="row">恐慌</th>
      <td>恐惧源在视线内时，检定与攻击有劣势；不能自愿靠近；速度不为 0</td>
      <td>恐惧源仍在视线里时，检定和攻击有劣势；不能自愿走近它；速度不为 0</td>
    </tr>
    <tr>
      <th scope="row">受擒</th>
      <td>速度 0；没有攻击劣势；没有敏捷豁免劣势</td>
      <td>速度 0；对擒抱者以外的攻击有劣势；没有敏捷豁免劣势</td>
    </tr>
    <tr>
      <th scope="row">失能</th>
      <td>不能采取动作或反应；速度不是 0</td>
      <td>不能动作、附赠动作或反应；断专注；不能说话；已失能时掷先攻则先攻劣势；速度不是 0</td>
    </tr>
    <tr>
      <th scope="row">隐形</th>
      <td>没有魔法或特殊感官就看不见你；你隐匿时处于重度遮蔽；对你的攻击有劣势，你的攻击有优势</td>
      <td>先攻有优势；需要看见目标的效应打不中你（除非对方能看见你）；对你的攻击有劣势、你的攻击有优势，对方能看见你则你失去该增益</td>
    </tr>
    <tr>
      <th scope="row">麻痹</th>
      <td>含失能；不能移动或说话；力量与敏捷豁免自动失败；对你的攻击有优势；5 尺内命中重击</td>
      <td>含失能；速度 0；力量与敏捷豁免自动失败；对你的攻击有优势；5 尺内命中重击</td>
    </tr>
    <tr>
      <th scope="row">石化</th>
      <td>变成固体并含失能，不能移动或说话，无法察觉；对你攻击优势，力量与敏捷豁免失败，全伤害抗性，免疫毒素与疾病（已有的暂停）</td>
      <td>变成固体并含失能，速度 0；对你攻击优势，力量与敏捷豁免失败，全伤害抗性，免疫中毒状态</td>
    </tr>
    <tr>
      <th scope="row">中毒</th>
      <td>攻击与属性检定有劣势</td>
      <td>攻击和属性检定都有劣势</td>
    </tr>
    <tr>
      <th scope="row">倒地</th>
      <td>只能爬行，站起后结束；你的攻击有劣势；5 尺内对你的攻击有优势，否则有劣势</td>
      <td>只能爬行，或花一半速度（向下取整）起身；速度为 0 则不能起身；你的攻击有劣势；5 尺内对你优势，否则劣势</td>
    </tr>
    <tr>
      <th scope="row">束缚</th>
      <td>速度 0；对你的攻击有优势；你的攻击有劣势；敏捷豁免劣势</td>
      <td>速度为 0；打你的攻击有优势；你打出去的攻击有劣势；敏捷豁免有劣势</td>
    </tr>
    <tr>
      <th scope="row">震慑</th>
      <td>含失能；不能移动；只能含糊说话；力量与敏捷豁免自动失败；对你的攻击有优势；没有 5 尺重击</td>
      <td>含失能；力量与敏捷豁免自动失败；对你的攻击有优势；没有速度 0，没有 5 尺重击</td>
    </tr>
    <tr>
      <th scope="row">昏迷</th>
      <td>含失能；不能移动或说话；无法察觉；倒地并掉落持物；力量与敏捷豁免失败；对你的攻击有优势；5 尺内命中重击</td>
      <td>含失能且倒地，掉落持物，结束后仍倒地；速度 0；对你攻击优势，力量与敏捷豁免失败，5 尺重击，无法察觉</td>
    </tr>
  </tbody>
</table>

<h3>桌上别名对回这 15 个</h3>

<p>中文桌同一条状态会有简繁、旧译、资料站标题三套叫法。先对回这 15 个，再结算。不要把别名写成第 16 行。</p>

<p>乏力对回失能，不是力竭。口播「你乏力了」，问是不是失能；不要新挂一条「没力气」，也不要按力竭加级。伏地对回倒地。迷惑对回魅惑。恐惧、恐懼对回恐慌。失明对回目盲，失聪对回耳聋。目眩是错词，仍对回震慑，不另造一条「目眩」。被擒、擒抱状态先问：这是 Grappled 还是 Restrained。角色卡已经印了「擒抱中」，用铅笔在旁边注受擒或束缚。</p>

<p>繁体还会听到耳聾、隱形、麻痺、束縛、震攝、昏迷、力竭这些写法。对回简体二字名即可。5e 这 15 个没有「虚体」状态；听见虚体，不要把它补进今晚这张表。</p>

<h2>受擒不是束缚</h2>

<p>两边都有速度 0。敏捷豁免劣势只在束缚。2014 受擒这一条没有写攻击劣势。2024 受擒只对擒抱者以外的攻击有劣势。少了「对你攻击优势 / 你的攻击劣势 / 敏捷豁免劣势」三句，就不是束缚。</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${CONDITIONS_GRAPPLE_RESTRAIN_ZH_IMAGE_PATH}"
    alt="对照卡标题「受擒 vs 束缚」。两边速度 0。敏捷豁免劣势只在束缚。受擒：速度 0，2014 没有攻击劣势，2024 对擒抱者以外攻击劣势，没有敏捷豁免劣势。束缚：速度 0，对你的攻击优势，你的攻击劣势，敏捷豁免劣势。"
    width="1536"
    height="960"
    loading="lazy"
    decoding="async"
  />
  <figcaption>受擒 vs 束缚。两边速度 0。敏捷豁免劣势只在束缚。受擒：速度 0，2014 没有攻击劣势，2024 对擒抱者以外攻击劣势，没有敏捷豁免劣势。束缚：速度 0，对你的攻击优势，你的攻击劣势，敏捷豁免劣势。</figcaption>
</figure>

<p>把受擒判成束缚，等于白送对你的攻击优势，再白送敏捷豁免劣势。把束缚判成受擒，等于删掉这两句。2014 受擒还写明速度 0，且不能受益于速度加值。2024 受擒是速度 0 且不能把速度加回去。擒抱限制的是移动，不因此封攻击或施法；怪物若另外给了束缚，才抄束缚那三句。</p>

<h3>动作叫擒抱，状态叫受擒</h3>

<p>2014 和 2024 都把这个动作叫擒抱。状态就叫<strong>受擒</strong>。2014 灰机附录标题常作擒抱，正文写「被擒抱」。2014 中文战斗页有的摘要写成陷入受擒，有的写成陷入擒抱状态，说的都是受擒，不是束缚。听见「抓住了」，先问是擒抱动作成功了，还是身上挂了受擒，不能直接改判束缚。</p>

<p>结束位置两版不同。2014 写在受擒这一条：擒抱者失能，或目标被移出触及，这条就结束。2024 写在擒抱动作条、擒抱规则里，包括动作、逃脱 DC、擒抱者失能、超出范围，不要把 2014 结束句贴到 2024 的受擒条上。拖拽只跟 2024：受擒生物可被拖、被带，每尺额外花 1 尺；体型为微型，或比擒抱者小至少两级，则不额外消耗。</p>

<p>举例：走廊里战士用擒抱动作抓住法师。2014：法师挂上受擒，速度 0；他打这名战士或打旁边的人，受擒这一条都没有写攻击劣势；要他做敏捷豁免，也不因此变劣势。2024：法师速度 0；打擒抱者以外的目标时攻击有劣势；战士可以拖他，每尺额外花 1 尺，除非法师是微型，或比战士小至少两级。两边都没有敏捷豁免劣势。有人喊「抓住了就是束缚」，停：束缚才有对你的攻击优势、你的攻击劣势、敏捷豁免劣势。效果正文写束缚，就挂束缚；不要因为地图上画了手，就把受擒升级成束缚。若今晚约定「抓住就按束缚跑」，说出口，那是房规。</p>

<h2>震慑不是麻痹</h2>

<p>两条都含失能。5 尺内命中重击写在麻痹和昏迷，震慑两版都没有。2014 震慑不能移动。2024 震慑这一条没有写速度 0。<a href="${DND_SAGE_ADVICE_COMPENDIUM_URL}" rel="noreferrer noopener">Sage Advice Compendium</a> 问：震慑是否不再阻止移动，这是有意的吗？答：是，现在允许移动，用来拉开与麻痹的差。不要把 2024 震慑写成速度 0，也不要把 2014 的「不能移动」补进 2024。</p>

<p>有人想站到身边打重击，先确认挂的是麻痹，不是震慑。说话限制走 2024 失能的「不能说话」，不是 2014 那句含糊说话。昏迷按昏迷条结算，两版都另有倒地、无法察觉，2024 还写明速度 0，状态结束后仍倒地；不要把昏迷抄成第二个麻痹，也不要把震慑升级成麻痹来打重击。</p>

<p>祭司被震慑。2014：他不能移动，力量与敏捷豁免自动失败，打他的攻击有优势；不要站进 5 尺宣称重击。2024：同样自动失败、打他有优势，他仍可移动；5 尺重击去麻痹或昏迷找。力量或敏捷豁免已经自动失败，不要再掷一次碰运气；其他豁免仍要掷时，用 <a href="${ZH_DICE_ROLLER_PATH}" rel="noreferrer noopener">骰子工具</a> 当场出结果。</p>

<h3>失能不等于不能移动</h3>

<p>断专注写在 2014 施法专注，不在状态条。专注怎么断，回到 2014 施法页，不要在状态条发明一句「失能等于断专注」或「失能不断专注」。</p>

<p>失能本身不等于不能移动。震慑、麻痹、昏迷都写明拥有失能。先结算失能挡住的动作，再看那一条有没有额外挡移动、额外给重击。有人只挂了失能，没有麻痹、没有 2014 震慑那种「不能移动」、也没有昏迷时，不要顺手把速度改成 0，不要顺手给 5 尺重击。不要把 2014 的含糊说话和 2024 失能的不能说话同时挂在同一个人身上。</p>

<h2>力竭已经 2 级再获得 1 级</h2>

<p>同名状态一般不叠成更狠的一条，只延长或并存持续时间。力竭是例外，靠加级。已经 2 级再获得 1 级，升到 3，不是只执行新得到的那 1 级。两版 6 级死亡。</p>

<p>2014：升到 3，同时承受 1+2+3，也就是属性检定劣势、速度减半、攻击与豁免劣势。不是只执行第 3 档、把前两档摘掉。长休减 1 级，前提是这段休息里吃过、喝过。</p>

<p>2024：升到 3，D20 检定 −6（−2×等级）、速度 −15 尺（−5 尺×等级）。没有力竭带来的劣势，没有生命值上限减半。长休减 1 级。脱水或营养不良造成的力竭，在喝足或吃足一天所需之前不能移除；这句话在危害条，不在力竭状态条。不要把 2014 六档劣势表接到 2024 的 −6 上，也不要再砍一次生命值上限。</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${CONDITIONS_EXHAUSTION_STACK_ZH_IMAGE_PATH}"
    alt="对照卡标题「已经 2 级再 +1 → 3」。场景条：已经 2 级 / +1 → / 3。2014 同时承受 1 属性检定劣势、2 速度减半、3 攻击与豁免劣势。2024：D20 检定 −6、速度 −15 尺，不是劣势，不是 HP 上限减半。"
    width="1536"
    height="960"
    loading="lazy"
    decoding="async"
  />
  <figcaption>已经 2 级再 +1 → 3。2014 同时承受 1 属性检定劣势、2 速度减半、3 攻击与豁免劣势。2024 是 D20 检定 −6、速度 −15 尺，不是劣势，不是 HP 上限减半。</figcaption>
</figure>

<p>行军结束，角色已经 2 级力竭，再获得 1 级。2014 桌：先攻条改成力竭 3，三档同时在——属性检定劣势、速度减半、攻击与豁免劣势。有人说「第 3 档才算」，停：升到 3 是 1+2+3 一起承受。2024 桌同一人：先攻条改成力竭 3，D20 检定 −6，速度 −15 尺。有人把六档表摊开要再叠攻击劣势，停：那是没标年的 2014 印法。资料站 PDF 若没印年、仍印六档，先当 2014；2024 桌不要用那张表。两版都是 6 级死亡，这不是许可把中间几档互相借用。</p>

<h2>开团核对</h2>

<ul>
  <li>卡边写了「2014《玩家手册》状态」或「2024 术语表状态」，没有只写「第五版」。</li>
  <li>灰机打开的是对应年那一页，只对译名，没有把灰机正文当骰子依据。</li>
  <li>没写年、仍印六档力竭的中文表，按 2014 理解，没有贴进 2024。</li>
  <li>受擒没有抄束缚的「对你攻击优势 / 你的攻击劣势 / 敏捷豁免劣势」。</li>
  <li>擒抱动作和受擒状态已经拆开，没有听见「抓住了」就改判束缚。</li>
  <li>震慑没有按麻痹给 5 尺重击。</li>
  <li>2024 震慑没有写成速度 0。</li>
  <li>力竭已经 2 级再获得 1 级，按锁年升到 3。</li>
  <li>只挂失能时，没有把速度改成 0。</li>
  <li>状态与条件没有写进同一格。</li>
</ul>

<p>状态用地图标记或 VTT 标记，不要烤进肖像。</p>

<h2>来源</h2>

<ul>
  <li><a href="${HUIJI_2014_CONDITIONS_URL}" rel="noreferrer noopener">灰机「玩家手册2014/状态」</a> — 2014 译名，不采数字</li>
  <li><a href="${HUIJI_2024_CONDITIONS_URL}" rel="noreferrer noopener">灰机「术语/状态」</a> — 2024 译名，不采数字</li>
  <li><a href="${DND_SRD_URL}" rel="noreferrer noopener">D&amp;D Beyond：系统参考文档</a> — 2014 与 2024 公开状态正文</li>
  <li><a href="${DND_SRD_51_PDF_URL}" rel="noreferrer noopener">SRD 5.1 PDF</a> — 2014 十五条和力竭六档</li>
  <li><a href="${DND_SRD_521_PDF_URL}" rel="noreferrer noopener">SRD 5.2.1 PDF</a> — 2024 十五条和力竭公式</li>
  <li><a href="${DND_2024_RULES_GLOSSARY_URL}" rel="noreferrer noopener">D&amp;D Beyond 2024 术语表</a> — 2024 各条效果</li>
  <li><a href="${DND_SAGE_ADVICE_COMPENDIUM_URL}" rel="noreferrer noopener">Sage Advice Compendium</a> — 2024 震慑仍可移动是有意的</li>
</ul>
`;
