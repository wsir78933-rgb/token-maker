import {
  DND_RACES_2024_SPECIES_OVERVIEW_URL,
  EN_DICE_ROLLER_PATH,
  EN_DND_DEMONS_PATH,
  EN_DND_FLUMPH_PATH,
  EN_EDITOR_PATH,
  ILLITHID_ZH_WIKIPEDIA_URL,
  MIND_FLAYER_2014_AIDEDD_URL,
  MIND_FLAYER_2024_AIDEDD_URL,
  MIND_FLAYER_2024_ROLL20_URL,
  MIND_FLAYER_ACTION_LOOP_IMAGE_PATH,
  MIND_FLAYER_ARCANIST_2024_AIDEDD_URL,
  MIND_FLAYER_BOOK_LOCK_IMAGE_PATH,
  MIND_FLAYER_HUIJI_PSION_URL,
  MIND_FLAYER_HUIJI_URL,
  MIND_FLAYER_NAME_COLLISION_ZH_IMAGE_PATH,
  MIND_FLAYER_STUN_LOCK_ZH_IMAGE_PATH,
  MIND_FLAYER_TOKEN_CROP_IMAGE_PATH,
  MIND_FLAYER_TOKEN_TENTACLES_ZH_IMAGE_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_DEMONS_PATH,
  ZH_DND_FLUMPH_PATH,
  ZH_EDITOR_PATH,
} from './shared';

export const mindFlayerDndArticleHtml = String.raw`
<p>A <strong>mind flayer dnd</strong> encounter is a CR 7 Medium aberration you copy from one <em>Monster Manual</em> year, then run as Mind Blast, Tentacles, and Extract Brain from that same book. The other name is illithid. Write <code>2014</code> or <code>2024</code> on the initiative tracker before the 60-foot cone goes down. The 2014 blast can stun for 1 minute; the 2024 blast stuns only until the end of the mind flayer&rsquo;s next turn. The 2014 Extract Brain needs an incapacitated humanoid already grappled by the mind flayer; the 2024 version is a Constitution save against any creature those tentacles already grappled. Crop the token so four face tentacles and the elongated bald skull stay inside the circle. This is not the Stranger Things TV monster.</p>

<p>This page is for a DM or player who is putting that creature on a 5e table or VTT tonight. It is not an illithid-empire history, not a catalog of every variant, and not a player-species writeup: mind flayer / illithid is not one of the ten species in the 2024 <em>Player&rsquo;s Handbook</em>. Lock the book, run the three actions from that book, and crop a four-tentacle head that still reads at map size.</p>

<table>
  <thead>
    <tr>
      <th>Need-to-know point</th>
      <th>Fast answer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Source line</strong></td>
      <td>Write <code>Mind Flayer (Monster Manual 2014)</code> or <code>Mind Flayer (Monster Manual 2024)</code> on the tracker. Copy hit points, movement, and the three actions from that year only.</td>
    </tr>
    <tr>
      <td><strong>What it is</strong></td>
      <td>Medium aberration (2014) / Medium Aberration (2024), lawful evil, CR 7, Darkvision 120 feet, Deep Speech, Undercommon, telepathy 120 feet. Confirm the printed page; public transcriptions are linked in Sources. Stun clocks, extract gates, and movement sit in the comparison table below.</td>
    </tr>
    <tr>
      <td><strong>Not the Arcanist</strong></td>
      <td>The 2024 Mind Flayer Arcanist is CR 11. It has no Mind Blast and no Extract Brain. If the sheet says Arcanist, do not run the CR 7 loop.</td>
    </tr>
    <tr>
      <td><strong>Token cue</strong></td>
      <td>Four face tentacles plus an elongated bald skull inside the circle. Reject winged Cthulhu, a bearded squid-man, tadpole-only art, and the TV shadow-monster.</td>
    </tr>
  </tbody>
</table>

<h2>Lock the Monster Manual year first</h2>

<p>The usual failure is a CR 7 token with a mixed sheet: 2024 hit points, a 2014 one-minute stun, and a 2024 Extract Brain that no longer needs an incapacitated humanoid. Those three books-on-one-card versions are not a <em>Monster Manual</em> creature. Ask which year is legal, write that year next to the name, and copy only that block. Confirm numbers on the printed <em>Monster Manual</em>. The <a href="${MIND_FLAYER_2014_AIDEDD_URL}" rel="noreferrer noopener">AideDD 2014 mind flayer</a> is a transcription of the 2014 book. The <a href="${MIND_FLAYER_2024_AIDEDD_URL}" rel="noreferrer noopener">AideDD 2024 mind flayer</a> and the <a href="${MIND_FLAYER_2024_ROLL20_URL}" rel="noreferrer noopener">Roll20 Monster Manual 2024 mind flayer</a> are the 2024 public pages used here.</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${MIND_FLAYER_BOOK_LOCK_IMAGE_PATH}"
    alt="Two closed monster manuals on a table, one tagged 2014 and one tagged 2024, with a mind flayer pointing at the 2024 book and a note that says lock one year"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Left book is the 2014 <em>Monster Manual</em>. Right book is the 2024 <em>Monster Manual</em>. The note is the year on the tracker. Copy one book onto the sheet, not both.</figcaption>
</figure>

<h3>Two source lines, one tracker</h3>

<p>Write one source line before you place the token. Example lines:</p>

<ul>
  <li><code>Mind Flayer (Monster Manual 2014)</code></li>
  <li><code>Mind Flayer (Monster Manual 2024)</code></li>
</ul>

<p>Those two lines are not interchangeable. Both creatures are CR 7, AC 15, Medium, lawful evil, with Magic Resistance, telepathy 120 feet, Darkvision 120 feet, Deep Speech, and Undercommon. Matching challenge rating is the trap. It does not make the stun clock, the tentacle save, the Extract Brain gate, or the movement line the same.</p>

<p>Copy hit points from the locked year. The 2014 transcription lists 71 (13d8+13). The 2024 transcription lists 99 (18d8+18). If you keep the 2014 one-minute Mind Blast and paste 2024 hit points on top, you built an unofficial boss. If you keep 2024&rsquo;s short stun and paste 2014 hit points on top, you built a hit-point total the 2024 book did not print. AC 15 on both pages is not permission to mix the rest. 2014 writes AC 15 (breastplate). 2024 writes AC 15 and Gear Breastplate. Use the notation from the year you locked.</p>

<p>Copy movement from the locked year. 2014 has Speed 30 feet and no fly speed. Vertical movement on that sheet is the at-will <em>levitate</em> in Innate Spellcasting (Psionics), Intelligence, spell save DC 15, no components. 2024 has Speed 30 feet and Fly 15 feet (hover). That fly/hover line replaces <em>levitate</em>; the 2024 Spellcasting list is at-will <em>Detect Thoughts</em> and 1/day each <em>Dominate Monster</em> and <em>Plane Shift</em> (self only). Do not give the 2014 creature a 15-foot fly speed because the VTT token looks airborne. Do not give the 2024 creature <em>levitate</em> because you remember the 2014 psionics line.</p>

<p>The shared spell names still belong to one block. Both years have at-will <em>detect thoughts</em> / <em>Detect Thoughts</em>, 1/day <em>dominate monster</em> / <em>Dominate Monster</em>, and 1/day <em>plane shift</em> / <em>Plane Shift</em> (self only). Self only means the mind flayer can leave. It is not a party-banish button. 2024 also lists Psychic resistance; the 2014 transcription used here does not list that line, so do not paste it onto a 2014 card. Both years have Magic Resistance: advantage on saving throws against spells and other magical effects. That trait sits on the mind flayer. It does not change the DC 15 Intelligence save the party rolls against Mind Blast, and it does not make the mind flayer&rsquo;s 1/day <em>Dominate Monster</em> skip a save.</p>

<p>If the party needs a warning before anyone walks into a 60-foot cone, that job belongs to a witness, not to a second mind flayer sheet. A <a href="${EN_DND_FLUMPH_PATH}" rel="noreferrer noopener">flumph as a telepathy warning creature</a> can notice telepathic traffic the party cannot hear. Keep the flumph on its own page. Keep the illithid&rsquo;s three actions on the year you wrote on the tracker.</p>

<table>
  <thead>
    <tr>
      <th>Line that changes the fight</th>
      <th>2014 <em>Monster Manual</em></th>
      <th>2024 <em>Monster Manual</em></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Mind Blast stun</td>
      <td>Failed DC 15 Intelligence save: stunned for 1 minute; the creature repeats the save at the end of each of its turns</td>
      <td>Failed DC 15 Intelligence save: Stunned until the end of the mind flayer&rsquo;s next turn; no 1-minute clock</td>
    </tr>
    <tr>
      <td>Mind Blast damage</td>
      <td>Fail 22 (4d8+4) psychic. The 2014 line is save-or-take; it does not grant half damage on a success</td>
      <td>Fail 31 (6d8+4) Psychic; success is half damage only, with no stun</td>
    </tr>
    <tr>
      <td>Tentacles stun</td>
      <td>On a hit, Medium or smaller: grappled, then a DC 15 Intelligence save or stunned until the grapple ends</td>
      <td>On a hit, Medium or smaller: Grappled from all tentacles and Stunned until the grapple ends; no extra Intelligence save</td>
    </tr>
    <tr>
      <td>Tentacles hit and escape</td>
      <td>+7; 15 (2d10+4) psychic; escape DC 15; reach 5 feet</td>
      <td>+7; 22 (4d8+4) Psychic; escape DC 14; reach 5 feet</td>
    </tr>
    <tr>
      <td>Extract Brain target</td>
      <td>One incapacitated humanoid grappled by the mind flayer</td>
      <td>One creature Grappled by Tentacles; not limited to humanoids; not required to be incapacitated</td>
    </tr>
    <tr>
      <td>Extract Brain roll</td>
      <td>Melee weapon +7; hit 55 (10d10) piercing</td>
      <td>Constitution save DC 15; fail 55 (10d10) Piercing; success half</td>
    </tr>
    <tr>
      <td>Movement</td>
      <td>Speed 30 feet, no fly; at-will <em>levitate</em></td>
      <td>Speed 30 feet, Fly 15 feet (hover); no <em>levitate</em></td>
    </tr>
  </tbody>
</table>

<p>Print that table on the DM card or leave this tab open. The moment someone looks up the other year on a phone, the tracker year still wins. Do not &ldquo;fix&rdquo; a 2014 stun with 2024 damage, and do not &ldquo;fix&rdquo; a 2024 Extract Brain by adding the 2014 humanoid gate back on. Pick a column. Stop.</p>

<h2>Run the three-action loop from one book</h2>

<p>Write <code>2014</code> or <code>2024</code> on the initiative tracker, then run Mind Blast, Tentacles, and Extract Brain as a loop from that book. Open with Mind Blast if the cone is loaded. Do not Extract Brain on a target that does not meet that book&rsquo;s condition. The loop is a sequence across turns, not a single-turn string you invent because the action names sit in that order.</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${MIND_FLAYER_ACTION_LOOP_IMAGE_PATH}"
    alt="A mind flayer in a stone hall fires a cone of pale psychic energy toward three adventurers while tentacle-shaped force reaches the frontliner"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Mind Blast if the cone is loaded, Tentacles to take the grapple, Extract Brain only if that book&rsquo;s gate is already true. The CR 7 pages used here do not list Multiattack, so do not fire all three as one turn.</figcaption>
</figure>

<h3>One action a turn from the same book</h3>

<p>The 2014 and 2024 CR 7 mind flayer pages used here list Tentacles, Extract Brain, and Mind Blast (Recharge 5-6). They do not list Multiattack. Unless some other rule on that same printed sheet says otherwise, the creature takes one of those actions on its turn. A turn that dumps the cone, the grapple, and the extract together is a different creature than these two blocks.</p>

<p>Decision on the turn, same book:</p>

<ul>
  <li>Mind Blast is available and two or more creatures sit in a 60-foot cone: use Mind Blast.</li>
  <li>Mind Blast is available but the extract gate is already true on an adjacent target: use Extract Brain. A loaded cone is not more important than a legal brain extract that ends a creature.</li>
  <li>Mind Blast is not available and a Medium or smaller creature is within 5 feet: use Tentacles.</li>
  <li>The target is already grappled and that book&rsquo;s Extract Brain condition is true: use Extract Brain.</li>
  <li>The target is grappled but fails the 2014 gate: do not extract. Hold the grapple, use a spell from that same block, or wait.</li>
  <li>Nobody is in 5 feet and the cone is down: walk 30 feet, use 2014 <em>levitate</em> or 2024 Fly 15 feet (hover) from the locked year, or spend 1/day <em>Plane Shift</em> (self only) if the job is to leave.</li>
</ul>

<p>When the cone fires, each creature in it makes a DC 15 Intelligence save. Use the <a href="${EN_DICE_ROLLER_PATH}" rel="noreferrer noopener">DnD dice roller</a> for those saves, and for the 2024 Extract Brain Constitution save when that action is legal. Magic Resistance on the mind flayer is advantage on its saves against spells and other magical effects; it does not change the Intelligence save DC the party rolls against Mind Blast.</p>

<p>Example setup, 2014, not a session log. The tracker says 2014. Three Medium humanoids stand in a 60-foot cone. Use Mind Blast first. A success on that 2014 blast is not half damage on the transcription used here. On a later turn, Tentacles a stunned Medium humanoid within 5 feet. Extract Brain is legal only if that target is still an incapacitated humanoid grappled by this mind flayer. Use the comparison table for the dice and DCs.</p>

<p>Example setup, 2024, not a session log. The tracker says 2024. The same three creatures sit in the cone. The mind flayer may use Fly 15 feet (hover) to open the angle, then Mind Blast. A success takes half damage and is not stunned. On the following turn, Tentacles: there is no extra Intelligence save on that 2024 hit. If the creature is still Grappled by Tentacles, Extract Brain is legal against that creature, humanoid or not, incapacitated or not. Use the comparison table for the dice and DCs.</p>

<p>The stun clocks are why the year on the tracker is not flavor. 2014 Mind Blast can hold a failed cone for a minute, with a repeat save at the end of each of the stunned creature&rsquo;s turns. 2024 Mind Blast is a harder hit (31 versus 22) that stuns only until the end of the mind flayer&rsquo;s next turn, and it still deals half on a success. Do not keep 2024&rsquo;s 31 (6d8+4) and 2014&rsquo;s one-minute stun. Do not keep 2014&rsquo;s 22 (4d8+4) and 2024&rsquo;s half-on-success plus short stun. If Mind Blast is not available, skip it. Recharge is 5-6 on both books; if the cone is not loaded, Tentacles or a spell from that same block is the turn.</p>

<p>Talk can happen before the cone. Both years have telepathy 120 feet and at-will <em>detect thoughts</em> / <em>Detect Thoughts</em>. The 2014 transcription also lists Deception and Persuasion among skills. 2014 flavor on that page calls them psionic tyrants, slavers, and interdimensional voyagers who harvest entire races. That is a reason to speak a demand, not a reason to skip the locked actions once initiative starts. 1/day <em>Dominate Monster</em> is on both blocks; it is not at-will, and it is not a substitute for writing the year.</p>

<h2>Extract Brain only when that book allows it</h2>

<p>Extract Brain is the action people fire early. The name sounds like a finisher, so a DM reaches for it on the first turn against a standing fighter. That is legal only if that book&rsquo;s condition is already true. The year on the tracker decides the gate. The art on the token does not.</p>

<p>2014 gate, all of it, before you roll +7:</p>

<ul>
  <li>The target is a humanoid.</li>
  <li>The target is grappled by this mind flayer.</li>
  <li>The target is incapacitated.</li>
  <li>The attack is melee, +7, 5 feet.</li>
</ul>

<p>If any 2014 line is false, the action is not legal. A grappled dwarf who is not incapacitated is not a 2014 extract. A stunned target is a 2014 extract only if that target is still a humanoid, still grappled by this mind flayer, and incapacitated as the action requires. The 2014 monster line uses the word incapacitated. Check the table&rsquo;s <em>Player&rsquo;s Handbook</em> condition list for how Stunned and Incapacitated interact. Do not import a 2024 condition paragraph onto a 2014 table, and do not import a 2014 paragraph onto a 2024 table. A grappled beast, monstrosity, or other non-humanoid is not a 2014 extract even if it is incapacitated.</p>

<p>2024 gate, before you call the Constitution save:</p>

<ul>
  <li>The target is Grappled by Tentacles.</li>
  <li>The save is Constitution DC 15.</li>
  <li>Failure is 55 (10d10) Piercing; success is half that piercing damage.</li>
</ul>

<p>2024 Extract Brain does not require a humanoid. It does not require incapacitated. Rolling the 2014 +7 attack against a 2024 extract is the wrong math. Calling for an Intelligence save on a 2024 extract is the wrong save. If the creature is not Grappled by Tentacles, skip the action. The 2024 Tentacles line grapples Medium or smaller from all the mind flayer&rsquo;s tentacles; a Large or bigger creature that never became grappled that way is not a legal 2024 extract. The same size gate sits on 2014 Tentacles: Medium or smaller. If the whole party is Large, the extract loop stalls on both books. Mind Blast still works, because the cone does not care about the grapple.</p>

<p>Both years share the 0-hit-point clause, with wording that stays on its own page. 2014: if the piercing damage reduces the target to 0 hit points, the mind flayer extracts and devours the brain, which kills the target. 2024: if the damage reduces the target to 0 hit points, it kills the target and devours its brain. If the target still has hit points after 55 (10d10), or after half of that on a 2024 success, the brain stays in the skull and the creature is not killed by this clause. Do not declare an extract kill on a standing hit-point total. Do not skip the 0-hit-point check because the damage number looks large.</p>

<p>Hold the turn if the gate is close but not true. 2014 with a grappled humanoid who is not incapacitated: Tentacles already did their job if the grapple is on; the missing piece is incapacitated, not more damage from a second illegal extract. 2024 with a creature that just failed Mind Blast but is not yet grappled: Tentacles first, Extract Brain later. The 2024 short stun from Mind Blast can cover the mind flayer&rsquo;s next turn; it is not itself the Extract Brain condition. Grappled by Tentacles is the 2024 condition.</p>

<h2>Do not paste the Arcanist onto the CR 7 sheet</h2>

<p>If the sheet says Mind Flayer Arcanist, do not use the CR 7 Mind Blast / Extract Brain loop. The <a href="${MIND_FLAYER_ARCANIST_2024_AIDEDD_URL}" rel="noreferrer noopener">2024 Mind Flayer Arcanist</a> is a different block: CR 11, AC 16, 143 hit points, Fly 30 feet (hover). It has no Extract Brain action and no Mind Blast. It has Arcane Tentacles (it can teleport the target up to 30 feet; reducing a target to 0 hit points also eats the brain), Mind Burst as a 40-foot Emanation, and more spells, including <em>Fireball</em> and <em>Shield</em> 2/day. Other mind flayers view arcanists with disgust and fear. That flavor is not a reason to steal <em>Fireball</em> for the CR 7 hunter. If tonight&rsquo;s token is the CR 7 illithid, keep Arcane Tentacles, Mind Burst, <em>Fireball</em>, and the extra fly speed off the card.</p>

<h2>Colony pressure without running an elder brain tonight</h2>

<p>Do not run a lone mind flayer as a dumb brute. The opened <a href="${MIND_FLAYER_2024_ROLL20_URL}" rel="noreferrer noopener">Roll20 2024 lore</a> is hunger for brains and dominance, colonies with an elder brain, and groups that fall into self-destructive squabbling without such a leader. Four slimy tentacles extract brains. That is enough colony pressure for one room: the creature has a job, a hunger, and a reason to use <em>Detect Thoughts</em>, 1/day <em>Dominate Monster</em>, or <em>Plane Shift</em> (self only) instead of standing in a doorway trading weapon blows. You do not need an elder brain token on the map tonight. A Machinations table exists on that Roll20 page; do not reprint it, and do not roll it as if it were a third stat block.</p>

<p>A flumph in the approach tunnel can show the telepathy before the cone. Servitors in the room can show the colony without promoting this creature into a variant catalog. The CR 7 sheet still takes one locked action at a time.</p>

<h2>Crop the four tentacles inside the token</h2>

<p>After the tracker names a year, the map still has to show an illithid, not a human face with jewelry, not a winged Cthulhu, and not a tadpole. Monster tokens should prioritize the unusual head shape. For a mind flayer that shape is four face tentacles plus an elongated bald skull. If those pieces sit outside the circle, the token fails at map size even when the file name says mind flayer.</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${MIND_FLAYER_TOKEN_CROP_IMAGE_PATH}"
    alt="Close crop of a mind flayer head beside a circular VTT token labeled Illithid, with the face tentacles and elongated skull kept inside the ring"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Keep the face tentacles and the long skull inside the circle. If the mask clips either piece, recrop. This is a crop lesson, not a license to Wizards art and not a tested Roll20 import of one file.</figcaption>
</figure>

<h3>What must stay in the circle</h3>

<p>Keep the face tentacles. Keep the elongated bald skull. Keep enough of the eyes that the head is a person-shaped aberration, not a pair of tentacles with the skull cropped off. Drop wings. Drop a beard that turns the silhouette into a squid-man. Drop a tadpole-only crop. Drop the Stranger Things TV monster. Drop a human-face-first crop that hides the skull length in a thick frame. Roll20&rsquo;s 2024 lore describes four slimy tentacles that extract brains; a crop that cuts the tentacles off at the lip no longer reads as that creature.</p>

<p>Open the <a href="${EN_EDITOR_PATH}" rel="noreferrer noopener">Token Maker editor</a> when the crop is the next step. Token Maker is a browser VTT token maker with circular, square, and polygon masks, borders, text, and transparent PNG export up to 2048. Cropping can stay local-first. Use the circle first. If the long skull or the tentacle tips hit the ring, switch to a square mask so the corners keep the skull length, or a polygon mask that follows the tentacles. Do not claim this page tested a Roll20 import of this specific token. Do not treat the PNG as a commercial license or as Wizards of the Coast IP. It is an image crop of your art, sized for a virtual map.</p>

<p>A horned, goat-skull, or fire-rim crop is a different monster family. If that is the portrait you actually have, send it to the <a href="${EN_DND_DEMONS_PATH}" rel="noreferrer noopener">DnD demons</a> token job instead of relabeling it as an illithid. A tadpole-only crop is not a mind flayer token and is not a 2024 <em>Player&rsquo;s Handbook</em> species origin.</p>

<p>Failure branches, recrop instead of hoping the border hides it:</p>

<ul>
  <li>The circle clips tentacles: pull the portrait down until the tentacles sit inside the inner edge, or switch to square or polygon.</li>
  <li>The long skull is cut off at the crown: zoom out until the bald elongation is a primary shape, not a shaved human.</li>
  <li>The crop is a human face with tiny tentacles in the corner: zoom out. The unusual head is the identity.</li>
  <li>The portrait has wings or a Cthulhu body: replace the art.</li>
  <li>The portrait is a bearded squid-man: replace the art.</li>
  <li>The portrait is only a tadpole: replace the art.</li>
  <li>The portrait is the TV shadow-monster: replace the art.</li>
  <li>The label is longer than the token: use a short name such as <code>MF 2014</code> or <code>MF 2024</code>, not a sentence of lore.</li>
</ul>

<h2>Mix-ups that break the encounter</h2>

<p><strong>Keeping CR 7 and mixing the stun clocks.</strong> Both books print CR 7. 2014 Mind Blast stuns for 1 minute on a failed Intelligence save, and the creature repeats the save at the end of each of its turns. 2024 Mind Blast stuns until the end of the mind flayer&rsquo;s next turn and deals half damage on a success. Same name, different fight.</p>

<p><strong>Pasting 2024 Extract Brain onto a 2014 card.</strong> 2014 still needs an incapacitated humanoid grappled by the mind flayer, and it is still a +7 melee attack. 2024 is a Constitution save against any creature Grappled by Tentacles. If you drop the 2014 humanoid-and-incapacitated gate because 2024 looks faster, you are not running 2014.</p>

<p><strong>Pasting the 2014 extra Intelligence save onto 2024 Tentacles.</strong> 2024 Tentacles already Grapple and Stun a Medium or smaller target until the grapple ends. There is no second Intelligence save on that hit. Adding one makes the 2024 creature weaker than its page. Removing the 2014 extra save makes the 2014 creature stronger than its page.</p>

<p><strong>Giving 2014 a fly speed, or giving 2024 <em>levitate</em>.</strong> 2014 walks 30 feet and uses at-will <em>levitate</em>. 2024 walks 30 feet and flies 15 feet (hover). A hovering token on a 2014 map needs the 2014 spell line, not the 2024 fly number.</p>

<p><strong>Firing Extract Brain on a Large target the tentacles never grappled.</strong> Both Tentacles lines grapple Medium or smaller. 2024 Extract Brain still needs Grappled by Tentacles. Mind Blast remains the tool that reaches creatures the grapple cannot hold.</p>

<p><strong>Using the Arcanist&rsquo;s <em>Fireball</em>, Mind Burst, or Arcane Tentacles on the CR 7 hunter.</strong> If the sheet says Arcanist, run that CR 11 block. If the sheet says Mind Flayer, run Mind Blast, Tentacles, and Extract Brain from the locked year.</p>

<p><strong>Treating the illithid as a 2024 <em>Player&rsquo;s Handbook</em> species.</strong> It is not on that ten-species list. This page does not build a playable mind flayer.</p>

<p><strong>Cropping a human face, a winged Cthulhu, a tadpole, or the TV monster, then labeling it mind flayer.</strong> The map read is tentacles and a long skull. Wrong silhouette is a wrong creature, even when the initiative name is correct.</p>

<h2>Session check</h2>

<p>Before the cone goes down, the tracker and the token should answer these in writing:</p>

<ol>
  <li>Source line: <code>Mind Flayer (Monster Manual 2014)</code> or <code>Mind Flayer (Monster Manual 2024)</code>. Confirm numbers on print.</li>
  <li>Mind Blast stun: 1 minute with repeat Intelligence saves (2014), or until the end of the mind flayer&rsquo;s next turn with half damage on a success (2024).</li>
  <li>Tentacles: extra DC 15 Intelligence save and escape DC 15 (2014), or auto-stun on grapple and escape DC 14 from all tentacles (2024).</li>
  <li>Extract Brain gate: incapacitated humanoid grappled, melee +7 (2014), or any creature Grappled by Tentacles, Constitution DC 15 (2024).</li>
  <li>Movement: 30 feet and at-will <em>levitate</em> with no fly (2014), or 30 feet and Fly 15 feet (hover) with no <em>levitate</em> (2024).</li>
  <li>Sheet identity: CR 7 Mind Flayer, not the CR 11 Arcanist. No Mind Blast / Extract Brain loop on an Arcanist card.</li>
  <li>Token: face tentacles and the elongated bald skull inside the circle. No winged Cthulhu, bearded squid-man, tadpole-only crop, or TV shadow-monster.</li>
</ol>

<p>If any line is blank, you do not have a finished mind flayer for tonight. Fill the blank from the locked book, not from a second book that had a prettier number.</p>

<h2>FAQ about mind flayer dnd</h2>
<h3>Which Monster Manual do I use for a mind flayer?</h3>
<p>Copy either the 2014 <em>Monster Manual</em> mind flayer or the 2024 <em>Monster Manual</em> mind flayer, then use only that book&rsquo;s Mind Blast, Tentacles, and Extract Brain. Write <code>2014</code> or <code>2024</code> on the initiative tracker. Confirm numbers on the printed page; AideDD and Roll20 are public transcriptions of those books.</p>
<h3>Can a 2024 mind flayer Extract Brain if the target is not an incapacitated humanoid?</h3>
<p>Yes, on the 2024 block. 2024 Extract Brain is a DC 15 Constitution save against one creature Grappled by Tentacles. It does not require a humanoid and does not require incapacitated. 2014 Extract Brain still requires an incapacitated humanoid grappled by the mind flayer.</p>
<h3>How long does Mind Blast stun last?</h3>
<p>On the 2014 block, a failed DC 15 Intelligence save stuns the creature for 1 minute, and the creature repeats the save at the end of each of its turns. On the 2024 block, a failed DC 15 Intelligence save stuns the creature until the end of the mind flayer&rsquo;s next turn. A 2024 success takes half damage and is not stunned. Do not mix those stun clocks.</p>
<h3>Is a mind flayer a playable species in the 2024 Player&rsquo;s Handbook?</h3>
<p>No. The ten 2024 <em>Player&rsquo;s Handbook</em> species are Aasimar, Dragonborn, Dwarf, Elf, Gnome, Goliath, Halfling, Human, Orc, and Tiefling. Mind flayer / illithid is not on that list.</p>
<h3>What has to stay inside the mind flayer token circle?</h3>
<p>Keep the face tentacles and the elongated bald skull inside the circle. Reject winged Cthulhu, a bearded squid-man, tadpole-only art, and the Stranger Things TV monster.</p>

<h2>Sources</h2>

<ul>
  <li><strong>aidedd-mm2014-mind-flayer</strong> — AideDD Mind Flayer (2014 Monster Manual transcription) — <a href="${MIND_FLAYER_2014_AIDEDD_URL}" rel="noreferrer noopener">${MIND_FLAYER_2014_AIDEDD_URL}</a> — Supports: CR 7; AC 15 (breastplate); HP 71; Speed 30; Magic Resistance; Innate Spellcasting with levitate; Tentacles Int-save stun; Extract Brain vs incapacitated grappled humanoid; Mind Blast 1-minute stun. Confirm on print.</li>
  <li><strong>aidedd-mm2024-mind-flayer</strong> — AideDD Mind Flayer (Monster Manual 2024 transcription) — <a href="${MIND_FLAYER_2024_AIDEDD_URL}" rel="noreferrer noopener">${MIND_FLAYER_2024_AIDEDD_URL}</a> — Supports: HP 99; Fly 15 hover; Psychic resistance; Tentacles auto-stun; Extract Brain Con save; Mind Blast short stun and half on success. Confirm on print.</li>
  <li><strong>roll20-mm2024-mind-flayer</strong> — Roll20 Mind Flayer, Monster Manual (2024) — <a href="${MIND_FLAYER_2024_ROLL20_URL}" rel="noreferrer noopener">${MIND_FLAYER_2024_ROLL20_URL}</a> — Supports: 2024 action lines; four slimy tentacles; elder brain colonies. Machinations table exists; not reprinted here.</li>
  <li><strong>aidedd-mm2024-arcanist</strong> — AideDD Mind Flayer Arcanist (Monster Manual 2024) — <a href="${MIND_FLAYER_ARCANIST_2024_AIDEDD_URL}" rel="noreferrer noopener">${MIND_FLAYER_ARCANIST_2024_AIDEDD_URL}</a> — Supports: CR 11 block with no Mind Blast and no Extract Brain.</li>
  <li><strong>ddb-post-10-species-2024</strong> — The 10 Species in the 2024 Player&rsquo;s Handbook — <a href="${DND_RACES_2024_SPECIES_OVERVIEW_URL}" rel="noreferrer noopener">${DND_RACES_2024_SPECIES_OVERVIEW_URL}</a> — Supports: the ten 2024 PHB species; mind flayer / illithid is not among them.</li>
</ul>
`;

export const mindFlayerDndArticleHtmlZh = String.raw`
<p>开团前先锁书：今晚这只<strong>夺心魔</strong>（Mind Flayer）是抄 2014《怪物图鉴》，还是抄 2024《怪物图鉴》。卡边写下年来源，再用同一本书按顺序跑心灵震爆、触须、采脑。两版都是中型异怪、守序邪恶、挑战等级 7，这三项分不出你锁的是哪一年；分得开的是震慑能挂多久、采脑要什么条件、身体会不会离地。</p>

<p>illithid 在中文里也叫<strong>灵吸怪</strong>，那是同一只夺心魔的别称，不是另一张怪物卡。开团前看三件事：卡边写了来源年；三个动作不混年版；Token 圆框里仍能看出面触须和光头长颅。《怪奇物语》的阴影巨兽、最终幻想 14 的同名妖异、带翅膀的克苏鲁头，都不要当成第五版这张基础面板。</p>

<table>
  <thead>
    <tr>
      <th scope="col">要拍板的事</th>
      <th scope="col">2014《怪物图鉴》</th>
      <th scope="col">2024《怪物图鉴》</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">卡边怎么写</th>
      <td>写「2014《怪物图鉴》夺心魔」</td>
      <td>写「2024《怪物图鉴》夺心魔」</td>
    </tr>
    <tr>
      <th scope="row">心灵震爆</th>
      <td>60 尺锥状，DC 15 智力；失败 22（4d8+4）心灵并震慑 1 分钟，该生物自己的回合结束时可再豁免。条目只写失败后果</td>
      <td>同样锥状与 DC；失败 31（6d8+4）心灵并震慑直到它下一回合结束；成功半伤、不受震慑</td>
    </tr>
    <tr>
      <th scope="row">触须</th>
      <td>近战 +7，触及 5 尺，命中 15（2d10+4）心灵；中型或更小受擒（逃脱 DC 15），再过 DC 15 智力豁免否则震慑直至擒抱结束</td>
      <td>+7，触及 5 尺，命中 22（4d8+4）心灵；中型或更小被所有触须擒抱（逃脱 DC 14），直接震慑直到擒抱结束</td>
    </tr>
    <tr>
      <th scope="row">采脑对象</th>
      <td>被其擒抱且已失能的类人</td>
      <td>被触须擒抱的生物，不再要求失能类人</td>
    </tr>
    <tr>
      <th scope="row">采脑结算</th>
      <td>近战 +7，命中 55（10d10）穿刺；因此降至 0 HP 则抽出大脑杀死</td>
      <td>体质豁免 DC 15；失败 55（10d10）穿刺，成功一半；该伤害打到 0 HP 则杀死并吞食大脑</td>
    </tr>
    <tr>
      <th scope="row">离地</th>
      <td>速度 30 尺，无飞行；随意浮空术</td>
      <td>速度 30 尺，飞行 15 尺（悬浮）；没有浮空术</td>
    </tr>
    <tr>
      <th scope="row">抗性抄哪条</th>
      <td>魔法抗性：对抗法术和其他魔法效应的豁免有优势</td>
      <td>魔法抗性仍在；另有心灵抗性</td>
    </tr>
    <tr>
      <th scope="row">Token 认什么</th>
      <td>面触须和光头长颅留在圆框里</td>
      <td>同样要留下触须；不要裁成电视剧巨兽或克苏鲁头</td>
    </tr>
  </tbody>
</table>

<h2>先分清这桌说的是哪一只夺心魔</h2>

<p>口头喊「夺心魔」时，先确认全桌指的是第五版这只触须异怪。中文桌主流把 Mind Flayer 叫夺心魔；illithid 是同一只的种名，不要另做一张「伊利斯人」当基础卡。卡面、语音、VTT 标签都写夺心魔，括注 Mind Flayer，避免只丢一个在影视和游戏里到处撞车的词。中文维基条目标题常用<strong>灵吸怪</strong>，正文仍指向同一只。</p>

<p>四只容易认错的东西，开图前划开：</p>

<ul>
  <li><strong>第五版夺心魔。</strong>类人身体，脸上四根触须，光头长颅。2024 传说写明四根黏湿触须取脑。这是今晚要上的那张中型异怪。</li>
  <li><strong>《怪奇物语》里的夺心魔。</strong>那是电视剧的阴影巨兽，不是这只触须异怪。不要拿剧里的烟雾、拆屋、心灵网来改第五版动作。</li>
  <li><strong>最终幻想 14 的夺心魔。</strong>那是另一套妖异。技能轴、量谱、副本机制都不是《怪物图鉴》的心灵震爆、触须、采脑。今晚不要打开游戏技能页来跑。</li>
  <li><strong>克苏鲁头颅。</strong>常见有翅膀、触手更多。第五版夺心魔没有按那个轮廓来：它是类人身体加面触须加光头长颅。Token 若裁出一对膜翼，地图上就会被认成另一路存在。</li>
</ul>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${MIND_FLAYER_NAME_COLLISION_ZH_IMAGE_PATH}"
    alt="桌上三张被否决的图卡：阴影巨兽、带翅膀的克苏鲁、故障色块生物；旁边一枚打勾的夺心魔 Token"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>打勾的是第五版这只类人身体加面触须的 Mind Flayer。阴影巨兽、有翼头颅、故障色块生物都不要当今晚的基础面板。</figcaption>
</figure>

<p>撞名不会改规则，但会改你裁的图、念的动作名、玩家脑子里的威胁。地图上出现一只有翼触手头，再念「心灵震爆」，全桌会对不上。先把今晚这只从电视剧、网游和神话头颅里摘出来，再去锁书。</p>

<h2>先锁 2014 还是 2024</h2>

<p>问 DM 一句就够：2014 还是 2024。写在怪物卡边、VTT 条目标题或打印页页眉，格式直接用「2014《怪物图鉴》」或「2024《怪物图鉴》」。不要只写「第五版夺心魔」——两版都是第五版。也不要把转写页标题当成年来源：英文转写能帮你核对，印本为准，卡边仍要有年。</p>

<p>挑战等级都是 7，护甲等级都是 15，2014 注明胸甲，2024 写装备胸甲，这几行当不了锁年证据。血量对得上才说明你抄对了书：2014 是 71（13d8+13），2024 是 99（18d8+18）。感官和语言两版也能对上——黑暗视觉 120 尺，深潜语，地底通用语，心灵感应 120 尺——所以锁年不要靠这一行。</p>

<p>真正会改遭遇的差在表里三列：震慑钟、采脑门槛、离地。数字以对照表为准，不要从另一年借一句「看起来更狠」的结算。</p>

<p>抗性也不要混抄。两版都有魔法抗性，对抗法术和其他魔法效应的豁免有优势。2024 另外写了心灵抗性。豁免优势和伤害抗性不是同一条；不要把心灵抗性贴到 2014 上，也不要删掉 2024 仍在的魔法抗性。两版施法都用智力、豁免 DC 15、无需成分，都有随意侦测思想，以及各 1/日的支配怪物、仅自身的异界传送；不要把这份相同清单当成「两版可以拼」。差别仍在浮空术和飞行。</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${MIND_FLAYER_STUN_LOCK_ZH_IMAGE_PATH}"
    alt="夺心魔站在两只沙漏之间：左边标 1 Minute，右边标 Until My Next Turn，它指向右边那只短沙漏"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>左边按 2014 跑：长震慑。右边按 2024 跑：震慑只到它下一回合结束。图是锁年示意，不是官方书页扫描。</figcaption>
</figure>

<p>锁年之后不要再开第二本《怪物图鉴》去补「看起来更狠」的句子。缺的数字回到你锁的那一页，不要从另一年借。转写页与印本冲突时，以印本为准，并在卡边留下你实际采用的年。</p>

<h2>用同一本书跑心灵震爆、触须、采脑</h2>

<p>三个动作是一条链，不是三张可以随便抽的牌。顺序仍是心灵震爆打开场面，触须把人抓住，采脑在条件满足时结束目标。换书会换条件，不要用 2014 的锥状去给 2024 的采脑开门，也不要反过来。</p>

<p>先攻开始，先看心灵震爆有没有充能（5–6）。60 尺锥状，智力豁免 DC 15。要掷这次豁免时，用 <a href="${ZH_DICE_ROLLER_PATH}" rel="noreferrer noopener">骰子工具</a> 当场出结果，不要口算一串「大概过了」。2014 失败后的震慑，在该生物自己的回合结束时可再豁免；条目只写失败后果，成功不要按 2024 去补半伤。2024 失败只买到它自己下一回合结束前的窗口，成功的人已经在掉血。具体骰子和 DC 看对照表。</p>

<p>触须用来抓住中型或更小的目标。2014：近战 +7，触及 5 尺，命中 15（2d10+4）心灵，受擒（逃脱 DC 15），并须通过 DC 15 智力豁免否则震慑直至擒抱结束。人已经因心灵震爆而震慑时，触须这一下的工作是把人抓住，给采脑开门，不是再发明一段控制。2024：+7，触及 5 尺，命中 22（4d8+4）心灵；中型或更小被所有触须擒抱（逃脱 DC 14），并直接震慑直到擒抱结束，不再额外过一次智力豁免。抓到就震慑，2024 的采脑条件已经满足。逃脱 DC 不要两版混用：2014 是 15，2024 是 14。</p>

<p>采脑是条件技，不是每回合默认输出。2014 写明：目标须是被其擒抱且已失能的类人；近战 +7，命中 55（10d10）穿刺；若因此降至 0 HP，抽出并吃掉大脑杀死目标。不是类人、没被它擒抱、人还能行动，这一击今晚不要掷。2024 改成体质豁免 DC 15，目标是被触须擒抱的生物，不再要求失能类人；失败 55（10d10）穿刺，成功一半；若该伤害把目标打到 0 HP，杀死并吞食大脑。野兽、构装、已经清醒却被触须缠住的人，都不要用 2014 的「必须是失能类人」去挡 2024 这一击。</p>

<p>设计走位（不是某次跑团记录）。2014 桌：夺心魔先把锥状对准挤在石廊里的人，失败的人震慑 1 分钟；再对其中一名中型类人打触须抓住；满足擒抱且失能后，才对那个人采脑。2024 桌同一条石廊：锥状失败的人只震慑到它下一回合结束，成功的人已经吃了半伤；真正把人钉住的是触须的直接震慑，采脑跟体质豁免走，不必再等「先失能、且是类人」。两套都合法，前提是卡边写的年和你掷的那条链是同一本。</p>

<p>两版触须都写明触及 5 尺。不要给 2014 另造飞行贴脸，也不要把 2024 的飞行 15 尺（悬浮）抄进 2014。2024 可以用飞行 15 尺（悬浮）离开地面或跨过坑；2014 要离地，走它的随意浮空术。同一只棋子不要既飞又挂浮空术。</p>

<p>AideDD 2014/2024 基础夺心魔页都没有 Multiattack。除非你锁的印本另有一条，否则一回合只选一个动作。不要把锥状、擒抱和采脑压进同一回合，那已经不是这两张挑战等级 7 的卡。</p>

<h2>不要把法师、灵能师、洞见者贴到挑战等级 7 上</h2>

<p>今晚这张基础面板是挑战等级 7 的夺心魔。灰机或网文若把洞见者、预见师、灵能师放在「夺心魔」词条里，那些不是今晚这张卡。<a href="${MIND_FLAYER_HUIJI_URL}" rel="noreferrer noopener">灰机「夺心魔」词条</a> 常停在验证页；本文未采用其数字。不要把未核验变体数字抄进基础卡。</p>

<p><a href="${MIND_FLAYER_HUIJI_PSION_URL}" rel="noreferrer noopener">灰机瓦罗「夺心魔灵能师」页</a> 写明来源瓦罗第 71 页，挑战等级 8。它的触须、采脑、心灵震爆与 2014 基础面板同类，仍是变体，不是 2024 基础夺心魔。不要因为它也有三动作，就把它的挑战等级或专页句子抄进挑战等级 7。</p>

<p>2024 夺心魔法师（Arcanist）是挑战等级 11。它没有采脑，没有心灵震爆，改用奥术触须（可把目标传送最多 30 尺，不是自己传送；打到 0 也吃脑）和 Mind Burst（40 尺辐射）。其他夺心魔厌恶并恐惧这种实验。今晚若只锁了基础夺心魔，就不要把 40 尺辐射和把目标挪开 30 尺的触须写进同一张挑战等级 7。法师要上场，卡边单独写「2024 夺心魔法师」，并按那一页跑，不要和基础三动作混名。</p>

<p>2024《玩家手册》十个物种里没有夺心魔。名单是阿斯莫、龙裔、矮人、精灵、侏儒、歌利亚、半身人、人类、兽人、提夫林。今晚按怪物上场，不按玩家物种建卡。</p>

<h2>主脑今晚可以只作为压力，不必上场</h2>

<p>殖民地有主脑（elder brain）。没有主脑时，群体会内斗。这两句够用：玩家今晚面对的若是一只或几只挑战等级 7 的夺心魔，主脑可以留在地图外面，只作为「后面还有意志」的压力。不要为了气氛把未锁的主脑数据塞进基础面板。</p>

<p>殖民地用心灵感应说话时，桌上的人听不见。若你需要先给玩家一个听得见的警告，<a href="${ZH_DND_FLUMPH_PATH}" rel="noreferrer noopener">浮空水母（Flumph）</a> 能感知心灵交流，适合当预警，不要把它写成第二只夺心魔。它在某条隧道口停住、不肯越过某道门，就已经把「有东西在脑子里说话」告诉全桌。</p>

<p>传说还写：它们会植入幼体；grimlock 与噬脑怪来自改造；常役使 kuo-toa、quaggoth、troglodyte；与吉斯洋基人、吉斯泽莱人敌对。这些够你布置门口的奴仆、改造过的幸存者，或远处有人在猎杀它们，不必把异怪帝国全史搬上今晚这张桌子。幼体和改造当后果或线索，不要在基础夺心魔回合里额外发明一套未核验的寄生数值。</p>

<h2>Token 留下面触须</h2>

<p>圆形棋子很小。夺心魔要在缩尺地图上被认成「这只会采脑的触须异怪」，优先留下面触须和光头长颅，而不是一张人脸特写。触须被圆框切掉以后，场上只剩光头，下一轮就会被认成人类施法者。</p>

<p>裁怪物 Token 时，轮廓比五官重要。恶魔棋子要留下角或翅膀，对照 <a href="${ZH_DND_DEMONS_PATH}" rel="noreferrer noopener">恶魔 Token 的轮廓裁法</a>；夺心魔要留下面触须和长颅。都是先让人读出威胁类型，再考虑表情。触须要落在框里，缩到常用尺寸后仍能认出来。</p>

<p>真正要裁的时候，用 <a href="${ZH_EDITOR_PATH}" rel="noreferrer noopener">Token Maker 编辑器</a> 在浏览器里切圆、方或多边形。本地裁切，导出透明 PNG，最大 2048。这些 PNG 面向 Roll20、Foundry、Owlbear 这类接受图片 Token 的虚拟桌面，不是导入后零修改的兼容保证。不要写成已经把某张图送进某次房间并看过效果。</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${MIND_FLAYER_TOKEN_TENTACLES_ZH_IMAGE_PATH}"
    alt="圆形 Token 特写：夺心魔光头长颅和面触须都留在金属圆框里"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>缩小后仍要能看出面触须和长颅。图是裁切示意，不是编辑器截图，也不是某次跑团记录。</figcaption>
</figure>

<p>失败了就按能看见的结果改：触须出框，放宽裁切，让长颅和触须都进圆；裁成有翼头颅或烟雾巨兽，换回类人身体那张；边框文字不要写「灵能师」或剧名，卡边年来源写在怪物卡上，不要靠棋子文字去锁规则。</p>

<h2>会把遭遇写坏的混用</h2>

<p>最常见的坏法，是震慑按长的那版、采脑按宽的那版。2014 的 1 分钟震慑已经把人按进失能；若再接 2024 采脑——对被擒抱者做体质豁免、不要求失能类人——控制时间按旧书拉满，吃脑门槛按新书放宽。反过来也不干净：2024 心灵震爆的震慑只到它下一回合结束，2014 采脑却还在等「失能类人」；链条自己对不上时，有人就会把旧条件忘掉，硬对一个还能行动的非类人掷采脑。</p>

<p>离地不要叠成第三套。给 2014 面板加上飞行 15 尺，或给 2024 面板再挂随意浮空术，坑、栏杆、垂直通道的意义会立刻乱掉。抗性不要漏抄：2024 仍有魔法抗性，只是另外加了心灵抗性；不要把心灵抗性贴到 2014 上，也不要删掉 2024 的魔法抗性。血量抄错年更隐蔽——挑战等级都写 7，71 和 99 却不是同一只。</p>

<p>变体混名同样会写坏。把挑战等级 11 夺心魔法师的 Mind Burst（40 尺辐射）或奥术触须（把目标传送最多 30 尺）当成基础心灵震爆和触须，挑战等级 7 的威胁范围会对不上。把瓦罗灵能师、洞见者、预见师的句子贴进基础词条，挑战等级和动作名会对不上你锁的《怪物图鉴》。Token 用电视剧烟雾或克苏鲁有翼头，圆框里认不出面触须，规则锁对了，地图仍在跑另一只怪。</p>

<h2>开团核对</h2>

<ul>
  <li>卡边写了「2014《怪物图鉴》」或「2024《怪物图鉴》」，没有只写「第五版」。</li>
  <li>心灵震爆、触须、采脑抄自同一年，没有用一年版的锥状去开另一年版的采脑。</li>
  <li>2014：采脑只对「被擒抱且已失能的类人」掷近战；心灵震爆失败才吃满控，成功不要补半伤；震慑在该生物自己的回合结束时可再豁免；触须逃脱 DC 15，额外智力豁免决定是否震慑。</li>
  <li>2024：采脑对「被触须擒抱的生物」掷体质豁免；心灵震爆成功仍半伤，震慑只到它下一回合结束；触须逃脱 DC 14，抓到直接震慑。</li>
  <li>离地只抄一页：2014 用浮空术，2024 用飞行 15 尺（悬浮），不要两套叠在同一只棋子上。</li>
  <li>抗性按年抄全：2014 只有魔法抗性；2024 魔法抗性仍在，并另有心灵抗性。不要把心灵抗性贴到 2014。</li>
  <li>Token 缩到地图尺寸后仍能看出面触须，光头长颅还在框里。</li>
  <li>没有把电视剧、最终幻想 14、克苏鲁头、夺心魔法师、瓦罗灵能师、洞见者或预见师当基础面板。</li>
  <li>主脑默认不上图，只作殖民地压力；幼体和改造当线索，不另造未核验数值。</li>
  <li>今晚按怪物上场，不按玩家物种建卡。</li>
</ul>

<h2>来源</h2>

<ul>
  <li><a href="${MIND_FLAYER_2014_AIDEDD_URL}" rel="noreferrer noopener">AideDD：2014《怪物图鉴》Mind Flayer</a> — 英文转写，印本为准；基础三动作、魔法抗性、浮空术</li>
  <li><a href="${MIND_FLAYER_2024_AIDEDD_URL}" rel="noreferrer noopener">AideDD：2024《怪物图鉴》Mind Flayer</a> — 飞行悬浮、心灵抗性、短震慑、采脑体质豁免</li>
  <li><a href="${MIND_FLAYER_2024_ROLL20_URL}" rel="noreferrer noopener">Roll20：2024 Mind Flayer</a> — 四根黏湿触须；主脑；无主脑则内斗；幼体；grimlock 与噬脑怪；役使 kuo-toa、quaggoth、troglodyte；与吉斯洋基人、吉斯泽莱人敌对</li>
  <li><a href="${MIND_FLAYER_ARCANIST_2024_AIDEDD_URL}" rel="noreferrer noopener">AideDD：2024 夺心魔法师 Arcanist</a> — 挑战等级 11；奥术触须与 Mind Burst；其他夺心魔厌恶并恐惧</li>
  <li><a href="${DND_RACES_2024_SPECIES_OVERVIEW_URL}" rel="noreferrer noopener">D&amp;D Beyond：2024《玩家手册》十个物种</a> — 名单里没有夺心魔</li>
  <li><a href="${MIND_FLAYER_HUIJI_URL}" rel="noreferrer noopener">灰机wiki：夺心魔</a> — 该词条常停在验证页；本文未采用其数字</li>
  <li><a href="${MIND_FLAYER_HUIJI_PSION_URL}" rel="noreferrer noopener">灰机wiki：夺心魔灵能师</a> — 来源瓦罗第 71 页，挑战等级 8；变体不是 2024 基础夺心魔</li>
  <li><a href="${ILLITHID_ZH_WIKIPEDIA_URL}" rel="noreferrer noopener">中文维基：灵吸怪</a> — 专名对照；不作第五版规则来源</li>
</ul>
`;
