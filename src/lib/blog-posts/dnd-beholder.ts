import {
  BEHOLDER_2014_AIDEDD_URL,
  BEHOLDER_2024_AIDEDD_URL,
  BEHOLDER_2024_ROLL20_URL,
  BEHOLDER_BOOK_LOCK_IMAGE_PATH,
  BEHOLDER_CONE_LOCK_ZH_IMAGE_PATH,
  BEHOLDER_CONE_RAYS_IMAGE_PATH,
  BEHOLDER_HUIJI_2025_CATALOG_URL,
  BEHOLDER_NAME_COLLISION_ZH_IMAGE_PATH,
  BEHOLDER_TOKEN_CROP_IMAGE_PATH,
  BEHOLDER_TOKEN_STALKS_ZH_IMAGE_PATH,
  DND_BEHOLDER_WIKIPEDIA_URL,
  DND_SRD_URL,
  EN_DICE_ROLLER_PATH,
  EN_DND_FLUMPH_PATH,
  EN_EDITOR_PATH,
  EN_MIND_FLAYER_DND_PATH,
  EN_SPECTATOR_DND_PATH,
  EN_SQUARE_TOKEN_MAKER_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_EDITOR_PATH,
  ZH_MIND_FLAYER_DND_PATH,
  ZH_SPECTATOR_DND_PATH,
  ZH_SQUARE_TOKEN_MAKER_PATH,
} from './shared';

export const dndBeholderArticleHtml = String.raw`
<p>A <strong>dnd beholder</strong> encounter is a CR 13 Large aberration you copy from one <em>Monster Manual</em> year, then run as Antimagic Cone, Eye Rays, and legendary actions from that same book. Write <code>2014</code> or <code>2024</code> on the initiative tracker before the 150-foot cone goes down. The 2014 cone is a trait you set at the start of each turn; the 2024 cone is a Bonus Action wave that lasts until the start of the beholder&rsquo;s next turn. The 2014 Eye Rays action shoots three random rays; the 2024 Multiattack uses Eye Rays three times, and each use is one random ray. Crop the token so ten eyestalks and the central eye stay inside the frame. This is not a spectator, and it is not a Death Tyrant pasted onto a CR 13 card.</p>

<p>This page is for a DM or player who is putting that creature on a 5e table or VTT tonight. Lock the book, copy cone, rays, and legendary actions from that book, and crop a ten-stalk tyrant that still reads at map size. Confirm numbers on the printed <em>Monster Manual</em>. Public transcriptions are linked in Sources.</p>

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
      <td>Write <code>Beholder (Monster Manual 2014)</code> or <code>Beholder (Monster Manual 2024)</code> on the tracker. Copy hit points, movement, Antimagic Cone, Eye Rays, and legendary actions from that year only.</td>
    </tr>
    <tr>
      <td><strong>What it is</strong></td>
      <td>Large aberration (2014) / Large Aberration (2024), lawful evil, CR 13 (10,000 XP; 2024 also lists 11,500 in a lair), AC 18, Darkvision 120 feet, Deep Speech, Undercommon, immune to being knocked prone, passive Perception 22. Cone timing, ray procedure, and legendary options sit in the comparison table below.</td>
    </tr>
    <tr>
      <td><strong>Not a spectator</strong></td>
      <td>A <a href="${EN_SPECTATOR_DND_PATH}" rel="noreferrer noopener">spectator</a> is a CR 3 guardian with four eyestalks and no antimagic cone. Do not run spectator rays on a ten-stalk token, and do not paste this CR 13 block onto a four-stalk token.</td>
    </tr>
    <tr>
      <td><strong>Token cue</strong></td>
      <td>Ten eyestalks plus one central eye inside the crop. Large occupies a 2&times;2 space. Reject a four-stalk spectator crop, a Death Tyrant skull, and a single cute eyeball with no stalks.</td>
    </tr>
  </tbody>
</table>

<h2>Lock the Monster Manual year first</h2>

<p>The usual failure is a CR 13 token with a mixed sheet: 2024 Fly 40 feet (hover), a 2014 one-minute Fear Ray, and 2024 Legendary Resistance on a card that also uses the 2014 Eye Rays action. Those three books-on-one-card versions are not a <em>Monster Manual</em> creature. Ask which year is legal, write that year next to the name, and copy only that block. Confirm numbers on the printed <em>Monster Manual</em>. The <a href="${BEHOLDER_2014_AIDEDD_URL}" rel="noreferrer noopener">AideDD 2014 beholder</a> is a transcription of the 2014 book. The <a href="${BEHOLDER_2024_AIDEDD_URL}" rel="noreferrer noopener">AideDD 2024 beholder</a> shows the 2024 header (hit points, speed, Multiattack, Bonus Action cone, legendary names) with the ray body not expanded on that page. The <a href="${BEHOLDER_2024_ROLL20_URL}" rel="noreferrer noopener">Roll20 Monster Manual 2024 beholder</a> is the 2024 public page used here for the expanded cone, ray, and legendary lines.</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${BEHOLDER_BOOK_LOCK_IMAGE_PATH}"
    alt="Two closed monster manuals on a table, one tagged 2014 and one tagged 2024, with a beholder pointing at the 2024 book and a note that says lock one year"
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
  <li><code>Beholder (Monster Manual 2014)</code></li>
  <li><code>Beholder (Monster Manual 2024)</code></li>
</ul>

<p>Those two lines are not interchangeable. Both creatures are CR 13, AC 18, Large, lawful evil, with Darkvision 120 feet, Deep Speech, Undercommon, Perception +12, passive Perception 22, and immunity to being knocked prone. Matching challenge rating is the trap. It does not make the cone an action-free trait, it does not make Eye Rays a three-ray bundle, and it does not make legendary actions a single Eye Ray option. Copy hit points from the locked year. The 2014 transcription lists 180 (19d10+76). The 2024 transcription lists 190 (20d10+80). If you keep the 2014 one-minute Fear Ray and paste 2024 Fly 40 feet (hover) on top, you built an unofficial boss. If you keep 2024&rsquo;s Multiattack and paste 2014 hit points on top, you built a hit-point total the 2024 book did not print. AC 18 on both pages is not permission to mix the rest. 2014 writes AC 18 (natural armor). 2024 writes AC 18. Use the notation from the year you locked.</p>

<p>Copy movement from the locked year. 2014 has Speed 0 feet, fly 20 feet (hover). That creature does not walk. Vertical and lateral movement on that sheet is the 20-foot hover fly speed. 2024 has Speed 5 feet, Fly 40 feet (hover). That fly line is twice the 2014 fly speed, and the 5-foot walk is a line the 2014 block does not print. Do not give the 2014 creature Fly 40 feet because the VTT token looks airborne. Do not give the 2024 creature Speed 0 feet because you remember the 2014 fly-20 hover body. Initiative +12 (22) sits on the 2024 transcription; the 2014 transcription used here does not list that initiative line, so do not paste +12 onto a 2014 card.</p>

<p>Copy the save line from the locked year. The 2014 transcription lists saving throws Int +8, Wis +7, Cha +8. The 2024 transcription lists Con +9 and Wis +7 among the combat-facing saves, with STR 16 on the ability line that feeds the 2024 Bite. Do not paste 2014 Cha +8 onto a 2024 card. Do not drop 2014 Int +8 because the 2024 header looks cleaner. Remaining save numbers belong on the printed page you locked, not on a second book that had a prettier bonus.</p>

<p>Legendary Resistance is a year lock, not a CR 13 default. The 2014 transcription used here does not list Legendary Resistance. The 2024 transcription lists Legendary Resistance 3/Day, or 4/Day in a lair. If tonight&rsquo;s tracker says 2014, do not grant three forced successes because &ldquo;every legendary monster has that now.&rdquo; If tonight&rsquo;s tracker says 2024 and the fight is not in a lair, use 3/Day, not 4. Lair XP on the 2024 page is 11,500 instead of 10,000; if the room is not a lair, do not award the lair number and do not add the extra legendary use.</p>

<p>Beholder is not a free SRD reprint. Do not paste a full stat block into a handout and call it SRD-legal. The <a href="${DND_SRD_URL}" rel="noreferrer noopener">SRD 5.2 page</a> is an exclusion check, not a monster sheet. The <a href="${DND_BEHOLDER_WIKIPEDIA_URL}" rel="noreferrer noopener">Beholder Wikipedia page</a> is useful for the name and for Product Identity status. It is not a rules source for hit points, cones, or rays. Copy from the printed book you locked; use the public transcriptions below as check pages.</p>

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
      <td>Hit points</td>
      <td>180 (19d10+76)</td>
      <td>190 (20d10+80)</td>
    </tr>
    <tr>
      <td>Speed</td>
      <td>0 ft., fly 20 ft. (hover)</td>
      <td>5 ft., Fly 40 ft. (hover)</td>
    </tr>
    <tr>
      <td>Legendary Resistance</td>
      <td>Not listed on the 2014 transcription used here</td>
      <td>3/Day, or 4/Day in a lair</td>
    </tr>
    <tr>
      <td>Antimagic Cone</td>
      <td>Trait. 150-foot cone as <em>antimagic field</em>. At the start of each turn, decide facing and whether the cone is active. Works against the beholder&rsquo;s own eye rays</td>
      <td>Bonus Action. 150-foot Cone wave. Until the start of the beholder&rsquo;s next turn, that area acts as <em>Antimagic Field</em>. Works against the beholder&rsquo;s own Eye Rays</td>
    </tr>
    <tr>
      <td>Eye Rays on its turn</td>
      <td>One action shoots three random rays (reroll duplicates) at one to three seen targets within 120 feet</td>
      <td>Multiattack uses Eye Rays three times. Each use is one random ray (1d10; reroll if that ray was already used this turn) at one seen target within 120 feet</td>
    </tr>
    <tr>
      <td>Legendary actions</td>
      <td>3. Only Eye Ray: one random ray</td>
      <td>3 (4 in a lair). Chomp: two Bite attacks. Glare: uses Eye Rays</td>
    </tr>
    <tr>
      <td>Bite</td>
      <td>+5; 14 (4d6) piercing</td>
      <td>+8; 13 (3d6+3) Piercing</td>
    </tr>
    <tr>
      <td>Charm Ray</td>
      <td>Wis DC 16; charmed 1 hour or until the beholder harms the creature; no damage listed on this transcription</td>
      <td>Wis DC 16; 13 (3d8) Psychic plus Charmed 1 hour or until the target takes damage; success is half damage only</td>
    </tr>
    <tr>
      <td>Fear Ray</td>
      <td>Wis DC 16; frightened 1 minute; repeat the save at the end of each of its turns</td>
      <td>Wis DC 16; 14 (4d6) Psychic plus Frightened until the end of the target&rsquo;s next turn; success is half damage only</td>
    </tr>
    <tr>
      <td>Slowing Ray save and clock</td>
      <td>Dexterity DC 16; speed halved for 1 minute, no reactions, action or bonus action not both; repeat save each turn</td>
      <td>Constitution DC 16; 18 (4d8) Necrotic; the same action limits last until the end of the target&rsquo;s next turn; success is half damage only</td>
    </tr>
    <tr>
      <td>Enervation Ray</td>
      <td>Con DC 16; 36 (8d8) necrotic; half on a success</td>
      <td>Con DC 16; 13 (3d8) Poison plus Poisoned (cannot regain hit points) until the end of the target&rsquo;s next turn; half on a success</td>
    </tr>
    <tr>
      <td>Petrification Ray save</td>
      <td>Dexterity DC 16; restrained, then petrified on the follow-up failure</td>
      <td>Constitution DC 16; two-step: first failure restrained, second failure petrified</td>
    </tr>
    <tr>
      <td>Disintegration Ray</td>
      <td>Dex DC 16; 45 (10d8) force; no half damage on a success in this transcription; 0 hit points turns the body to dust</td>
      <td>Dex DC 16; 36 (8d8) Force; half on a success; a creature reduced to 0 hit points disintegrates</td>
    </tr>
    <tr>
      <td>Death Ray</td>
      <td>Dex DC 16; 55 (10d10) necrotic; dies at 0 hit points; no half damage listed on this transcription</td>
      <td>Dex DC 16; 55 (10d10) Necrotic; half on a success; dies at 0 hit points</td>
    </tr>
  </tbody>
</table>

<p>Print that table on the DM card or leave this tab open. The moment someone looks up the other year on a phone, the tracker year still wins. Do not &ldquo;fix&rdquo; a 2014 Fear Ray with 2024 Fly 40 feet, and do not &ldquo;fix&rdquo; a 2024 Slowing Ray by putting the 2014 Dexterity save back on. Pick a column. Stop.</p>

<h2>Antimagic Cone is not the same job in both books</h2>

<p>Both years print a 150-foot cone from the central eye that acts as <em>antimagic field</em> / <em>Antimagic Field</em>, and both years say that area works against the beholder&rsquo;s own eye rays. That shared sentence is not a shared procedure. The 2014 cone is a trait. The 2024 cone is a Bonus Action. If you run the 2024 wave as a free start-of-turn trait, you stole an action economy the 2024 book did not print. If you make the 2014 cone cost a Bonus Action, you made the 2014 creature slower than its page.</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${BEHOLDER_CONE_RAYS_IMAGE_PATH}"
    alt="A beholder in a stone hall emits a 150-foot antimagic cone from its central eye while eyestalk rays fire past the cone edge toward three adventurers"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Point the cone at the caster lane, then fire stalks at targets outside that cone. The cone works against the beholder&rsquo;s own rays in both books. This is a facing lesson, not a session log.</figcaption>
</figure>

<h3>Trait versus Bonus Action</h3>

<p>2014 procedure, every round, before you pick an action. At the start of each of the beholder&rsquo;s turns, decide which way the cone faces and whether the cone is active. You can shut it off. You can swing it onto a new corridor. You do not spend the action or a bonus action to do that on the 2014 trait. The area is a 150-foot cone as in the <em>antimagic field</em> spell. Spells, magic items, and the beholder&rsquo;s own eye rays do not work in that area as that spell describes. Copy the spell interaction from the 2014 print you locked; do not import a 2024 <em>Antimagic Field</em> paragraph onto a 2014 table.</p>

<p>2024 procedure, on the turn you want the wave. Spend the Bonus Action: the central eye emits an antimagic wave in a 150-foot Cone. Until the start of the beholder&rsquo;s next turn, that area acts as an <em>Antimagic Field</em> spell, and that area works against the beholder&rsquo;s own Eye Rays. The duration is one round unless you spend the Bonus Action again on the next turn. If you skip the Bonus Action, you do not get a leftover 2014-style always-on trait. The 2024 Multiattack is the action. The cone is the Bonus Action. Both can happen on the same turn because they use different action slots. Do not treat that as permission to fire Eye Rays into the cone. The 2024 line still says the area works against the beholder&rsquo;s own Eye Rays.</p>

<p>Mark the cone on the map with a template, a VTT cone tool, or a paper wedge. Guessing a 150-foot facing by eye is how a ray accidentally lands inside antimagic and how a caster thinks a spell still works. Place the Large 2&times;2 token first, then draw the cone from the central eye, not from a corner of the base you like better. If a target is inside the cone, do not spend a ray on that target. Pick someone the stalks can see outside the cone, or turn the cone off on a 2014 start-of-turn decision if the 2014 book is the one on the tracker.</p>

<p>Example setup, 2014, not a session log. The tracker says 2014. A 10-foot corridor holds two spellcasters. A side alcove holds a melee fighter. At the start of the turn, face the cone down the corridor and keep it active. The Eye Rays action then goes at the fighter, or at a caster who stepped out of the cone. Do not roll a Disintegration Ray at a wizard still standing in the antimagic. Fly 20 feet (hover) to open a new angle if the 20-foot speed reaches it. Speed 0 feet means you do not walk a square to do that.</p>

<p>Example setup, 2024, not a session log. The tracker says 2024. Same room. Spend the Bonus Action to put the 150-foot Cone on the corridor. Multiattack uses Eye Rays three times at targets the beholder can see outside that Cone. Fly 40 feet (hover) is legal on this card if you need a new angle; the 5-foot walk is legal if a hover path is blocked and five feet of floor is enough. Do not keep the cone running into the next round for free. If you want it again, spend the Bonus Action again.</p>

<p>The cone is why the central eye has to stay visible on the token. If the crop hides the central eye, the table cannot see which way the antimagic is pointing. That is a map problem, not a lore problem. Put a small facing mark on the token or on the base so the 150-foot template matches the art.</p>

<h2>Run Eye Rays from one book</h2>

<p>Write <code>2014</code> or <code>2024</code> on the initiative tracker, then run Eye Rays as a procedure from that book. The ray names look like a shared list. The procedure is not shared. 2014 spends one action to fire three random rays, with duplicates rerolled, at one to three creatures it can see within 120 feet. 2024 spends Multiattack to use Eye Rays three times; each use is one random ray at one seen target within 120 feet, and you reroll if that ray was already used this turn. Legendary actions then add more rays, but only with the options on that same page.</p>

<p>Use the <a href="${EN_DICE_ROLLER_PATH}" rel="noreferrer noopener">DnD dice roller</a> for the 1d10 picks and for the DC 16 saves. Do not pick Charm because it would be convenient, then call that &ldquo;random.&rdquo; Both years tell you to roll. 2014 rerolls duplicates among the three rays in that action. 2024 rerolls a ray already used this turn. Confirm on the printed page whether a later legendary ray in the same round uses that same reroll sentence. Do not import the other year&rsquo;s duplicate rule onto that line.</p>

<h3>Three rays as one action versus Multiattack</h3>

<p>2014 action, in order. Choose one to three seen targets within 120 feet. Roll three d10, rerolling duplicates, and assign those three different rays among the chosen targets. One creature can take more than one ray. Three creatures can take one each. The action is Eye Rays. Bite is a different action: +5 to hit, 14 (4d6) piercing. If you Bite, you did not shoot three rays. The 2014 page used here does not list Multiattack. A turn that Bites and also fires three rays is a different creature than this block.</p>

<p>2014 legendary actions: 3, using the Eye Ray option only. One legendary action at a time, only at the end of another creature&rsquo;s turn. Each Eye Ray is one random ray. There is no Chomp. There is no Glare. There is no &ldquo;two Bites&rdquo; on this legendary line. If you want a Bite on a 2014 turn, it is the action, and it replaces Eye Rays for that turn.</p>

<p>2024 action, in order. Multiattack: use Eye Rays three times. Each Eye Rays use: roll 1d10, reroll if that ray was already used this turn, and shoot that one ray at one creature the beholder can see within 120 feet. That is three rays on the action, not one bundle that can stack three different numbers onto three targets as a single 2014-style assignment. Bite is listed separately: +8 to hit, 13 (3d6+3) Piercing. Multiattack on this page is Eye Rays three times, not Bite plus rays. If you want Bites on a 2024 round, Chomp is a legendary action: two Bite attacks. Do not turn Multiattack into Bite plus rays because the names sit next to each other.</p>

<p>2024 legendary actions: 3, or 4 in a lair. Immediately after another creature&rsquo;s turn, spend one use on Chomp or Glare. Chomp: two Bite attacks. Glare: the beholder uses Eye Rays, which on this page is one random ray. Do not read Glare as the 2014 three-ray action. Do not read Chomp as a 2014 option. If tonight is not in a lair, the pool is 3, not 4.</p>

<p>Example setup, 2014, not a session log. The tracker says 2014. Three adventurers stand in 120 feet and outside the cone. Use the Eye Rays action. Roll three d10, reroll a duplicate, and put those three rays on one, two, or three of those targets. Later in the round, at the end of other creatures&rsquo; turns, spend up to three legendary Eye Ray uses, one random ray each. Fly 20 feet (hover) if you need a new facing for next turn&rsquo;s cone. Do not add Legendary Resistance. Do not add Fly 40. Do not add Chomp.</p>

<p>Example setup, 2024, not a session log. The tracker says 2024. The same three adventurers sit in 120 feet. Multiattack: Eye Rays, Eye Rays, Eye Rays, each a 1d10 with a same-turn reroll. Bonus Action: Antimagic Cone if you want the wave. After other turns, Glare for another Eye Rays, or Chomp two Bites if a creature is in 5 feet. Legendary Resistance 3/Day is on this card; 4/Day only in a lair. Do not run a 1-minute Fear Ray on this card. Do not run Slowing Ray as a Dexterity save. Do not run Enervation as 36 (8d8) necrotic.</p>

<p>Copy the ray table from one book. The names Charm, Paralyzing, Fear, Slowing, Enervation, Telekinetic, Sleep, Petrification, Disintegration, and Death appear in both transcriptions as a 1d10 list. Shared names are the trap. Damage, save ability, clock, and half-on-success change. Use the comparison table for the lines that change the fight, then keep the rest of that year&rsquo;s ray paragraph on the card. Confirm on print if a public page and the book disagree.</p>

<p>2014 rays, DC 16, from the 2014 transcription used here:</p>

<ul>
  <li><strong>1 Charm Ray.</strong> Wisdom save or charmed by the beholder for 1 hour, or until the beholder harms the creature.</li>
  <li><strong>2 Paralyzing Ray.</strong> Constitution save or paralyzed for 1 minute; repeat the save at the end of each of its turns.</li>
  <li><strong>3 Fear Ray.</strong> Wisdom save or frightened for 1 minute; repeat the save at the end of each of its turns.</li>
  <li><strong>4 Slowing Ray.</strong> Dexterity save. On a failure, speed is halved for 1 minute, the creature cannot take reactions, and it can take either an action or a bonus action on its turn, not both; repeat the save at the end of each of its turns.</li>
  <li><strong>5 Enervation Ray.</strong> Constitution save; 36 (8d8) necrotic, or half as much on a success.</li>
  <li><strong>6 Telekinetic Ray.</strong> If the target is a creature, Strength save or the beholder moves it up to 30 feet; it is restrained by the ray until the start of the beholder&rsquo;s next turn or until the beholder is incapacitated. The 2014 transcription also moves an unattended object of 300 pounds or less up to 30 feet and allows fine control such as opening a door.</li>
  <li><strong>7 Sleep Ray.</strong> Wisdom save or unconscious for 1 minute; wakes on damage or if another creature takes an action to wake it. No effect on constructs and undead.</li>
  <li><strong>8 Petrification Ray.</strong> Dexterity save. Failure: restrained and turning to stone; repeat the save at the end of its next turn; a second failure petrifies until <em>greater restoration</em> or other magic.</li>
  <li><strong>9 Disintegration Ray.</strong> Dexterity save or 45 (10d8) force. This transcription does not grant half damage on a success. 0 hit points: the body becomes fine gray dust. The 2014 transcription also disintegrates a Large or smaller nonmagical object or magical-force creation without a save, or a 10-foot cube of a Huge or larger one.</li>
  <li><strong>10 Death Ray.</strong> Dexterity save or 55 (10d10) necrotic. The target dies if the ray reduces it to 0 hit points. This transcription does not list half damage on a success.</li>
</ul>

<p>2024 rays, DC 16, from the 2024 Roll20 transcription used here (AideDD 2024 lists the Eye Rays name in the header but does not expand this body on that page):</p>

<ul>
  <li><strong>1 Charm Ray.</strong> Wisdom save. Failure: 13 (3d8) Psychic and Charmed for 1 hour or until the target takes damage. Success: half damage only.</li>
  <li><strong>2 Paralyzing Ray.</strong> Constitution save. Failure: Paralyzed; repeat the save at the end of each of its turns; after 1 minute it succeeds automatically.</li>
  <li><strong>3 Fear Ray.</strong> Wisdom save. Failure: 14 (4d6) Psychic and Frightened until the end of the target&rsquo;s next turn. Success: half damage only.</li>
  <li><strong>4 Slowing Ray.</strong> Constitution save. Failure: 18 (4d8) Necrotic; until the end of the target&rsquo;s next turn, Speed is halved, no Reactions, and action or Bonus Action not both. Success: half damage only.</li>
  <li><strong>5 Enervation Ray.</strong> Constitution save. Failure: 13 (3d8) Poison and Poisoned until the end of its next turn; while Poisoned, it cannot regain hit points. Success: half damage only.</li>
  <li><strong>6 Telekinetic Ray.</strong> Strength save (a Gargantuan target succeeds automatically). Failure: move the target up to 30 feet; Restrained until the start of the beholder&rsquo;s next turn or until the beholder is Incapacitated. Fine control on objects is still listed.</li>
  <li><strong>7 Sleep Ray.</strong> Wisdom save (a Construct or Undead succeeds automatically). Failure: Unconscious for 1 minute; ends if the target takes damage or a creature within 5 feet takes an action to wake it.</li>
  <li><strong>8 Petrification Ray.</strong> Constitution save. First failure: Restrained, then repeat at the end of its next turn if still Restrained. Second failure: Petrified instead of Restrained.</li>
  <li><strong>9 Disintegration Ray.</strong> Dexterity save. Failure: 36 (8d8) Force. Success: half damage. If a creature is reduced to 0 hit points by this damage, it disintegrates. A nonmagical object or magical-force creation loses a 10-foot Cube to dust.</li>
  <li><strong>10 Death Ray.</strong> Dexterity save. Failure: 55 (10d10) Necrotic. Success: half damage. The target dies if the ray reduces it to 0 hit points.</li>
</ul>

<p>Do not keep 2014&rsquo;s 45 (10d8) force Disintegration and 2024&rsquo;s half-on-success. Do not keep 2014&rsquo;s 1-minute Fear and 2024&rsquo;s 14 (4d6) Psychic. Do not keep 2014&rsquo;s Dexterity Slowing Ray and 2024&rsquo;s 18 (4d8) Necrotic. If the d10 lands on a ray you have not copied onto the card, stop and copy that paragraph from the locked book before you resolve it. Inventing a &ldquo;close enough&rdquo; effect is how a Dexterity petrify lands on a 2024 Constitution line.</p>

<h2>A spectator is not a small beholder</h2>

<p>A spectator is not a CR 13 tyrant with fewer hit points. It is a CR 3 guardian with four eyestalks, a central eye, and no antimagic cone. Use the <a href="${EN_SPECTATOR_DND_PATH}" rel="noreferrer noopener">spectator dnd page</a> for that creature. Do not borrow spectator Spell Reflection, 90-foot rays, or a four-ray list to &ldquo;tone down&rdquo; tonight&rsquo;s beholder. If the map needs the weaker four-stalk guardian, use that page and a four-stalk token. If the map needs this CR 13 card, use ten stalks, the cone, and the year you wrote on the tracker.</p>

<p>A Death Tyrant is a different undead card. Do not paste Death Tyrant traits onto this CR 13 Beholder. If the portrait is a skeletal orb, you brought the wrong art, not a reskin of tonight&rsquo;s block.</p>

<p>A <a href="${EN_MIND_FLAYER_DND_PATH}" rel="noreferrer noopener">mind flayer</a> is another aberration you lock by <em>Monster Manual</em> year, with a different loop: Mind Blast, Tentacles, Extract Brain. It is not a substitute cone, and it is not a ten-stalk token. If the party already fought an illithid last session, that is not permission to mix 2014 beholder Fear into a 2024 illithid stun, or the other way around. Each creature still gets one source line.</p>

<p>A <a href="${EN_DND_FLUMPH_PATH}" rel="noreferrer noopener">flumph</a> is a different floating-eye creature; it is not this CR 13 card with the cone switched off.</p>

<h2>Crop ten stalks and the central eye</h2>

<p>After the tracker names a year, the map still has to show a beholder, not a spectator, not a skull orb, and not a single unblinking ball. Monster tokens should prioritize the unusual head shape. For a beholder that shape is ten eyestalks plus a huge central eye and a wide maw. If those pieces sit outside the circle, the token fails at map size even when the file name says beholder. Large is a 2&times;2 space; the crop has to read at that size, not only at full-screen art zoom.</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${BEHOLDER_TOKEN_CROP_IMAGE_PATH}"
    alt="Close crop of a beholder beside a circular VTT token labeled Beholder, with ten eyestalks and the central eye kept inside the ring"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Keep ten stalks and the central eye inside the crop. If the mask clips the stalks down to four, recrop. This is a crop lesson, not a license to Wizards art and not a tested Roll20 import of one file.</figcaption>
</figure>

<h3>What must stay in the circle</h3>

<p>Keep the ten eyestalks. Keep the central eye. Keep enough of the maw that the body is a tyrant orb, not a floating pupil. Drop a four-stalk spectator silhouette. Drop a Death Tyrant bone-orb. Drop a cartoon one-eye with no stalks. Drop a crop so tight that the circle shaves the stalks into horns. Roll20&rsquo;s 2024 lore describes a globular body, an oversize maw, a gigantic central eye, and ten stalks; a crop that cuts the stalks off at the lid no longer reads as that creature. The central eye also has a job: it is the facing cue for the 150-foot cone. If the crop hides it, the template has nothing to point.</p>

<p>Open the <a href="${EN_EDITOR_PATH}" rel="noreferrer noopener">Token Maker editor</a> when the crop is the next step. Token Maker is a browser VTT token maker with circular, square, and polygon masks, borders, text, and transparent PNG export at 256, 512, 1024, and 2048. Cropping can stay local-first. Use the circle first. If the stalk tips hit the ring, switch to a square mask so the corners keep the ten-stalk crown, or a polygon mask that follows the stalks. A transparent PNG is not a promise that a named Roll20, Foundry, or Owlbear world will import with zero extra setup.</p>

<p>Large occupies 2&times;2 squares. For a first square file, use the <a href="${EN_SQUARE_TOKEN_MAKER_PATH}" rel="noreferrer noopener">square token maker</a> so the 2&times;2 footprint matches the mask. Start at 512 unless the table already standardized on another export size among 256, 512, 1024, and 2048. Drop the PNG on the map at the zoom you actually play, and go back to the crop if the stalks vanish or the central eye turns into a gray disc. That check is the end of the token job. It is not a ranking claim and not a commercial license for Wizards of the Coast art. It is an image crop of your art, sized for a virtual map.</p>

<p>Failure branches, recrop instead of hoping the border hides it:</p>

<ul>
  <li>The circle clips stalks down to four or fewer: zoom out until ten stalks remain countable, or switch to square or polygon.</li>
  <li>The central eye is cut off or buried under a thick ring: pull the portrait so the central eye is the primary disc.</li>
  <li>The crop is a mouth with no eye: zoom out. The unusual head is the identity.</li>
  <li>The portrait is a spectator with four stalks: replace the art or send that file to the spectator page.</li>
  <li>The portrait is a skeletal Death Tyrant: replace the art. Do not relabel it Beholder 2014.</li>
  <li>The portrait is a single cute eyeball: replace the art.</li>
  <li>The label is longer than the token: use a short name such as <code>Beh 2014</code> or <code>Beh 2024</code>, not a sentence of Underdark lore.</li>
</ul>

<h2>Mix-ups that break the encounter</h2>

<p><strong>Keeping CR 13 and mixing the Fear clock with 2024 movement.</strong> Both books print CR 13. 2014 Fear Ray frightens for 1 minute with a repeat Wisdom save at the end of each turn. 2024 Fear Ray deals 14 (4d6) Psychic and frightens until the end of the target&rsquo;s next turn. 2024 also has Fly 40 feet (hover), Multiattack, and Legendary Resistance. Same name, different fight. Do not glue the 2014 one-minute Fear onto 2024 Fly 40, Multiattack, or Legendary Resistance.</p>

<p><strong>Running the cone as the other book&rsquo;s action economy.</strong> 2014 Antimagic Cone is a trait you set at the start of each turn, including whether it is on. 2024 Antimagic Cone is a Bonus Action wave that lasts until the start of the next turn. A free 2024 cone is too much. A 2014 cone that costs a Bonus Action is too little. Both still shut down the beholder&rsquo;s own rays inside the area.</p>

<p><strong>Firing 2014&rsquo;s three-ray action as if it were 2024 Multiattack, or the reverse.</strong> 2014 is one action, three random rays, reroll duplicates, one to three targets. 2024 is Multiattack using Eye Rays three times, each one random ray, reroll if already used this turn, one target each. Counting &ldquo;three rays&rdquo; is not enough. The assignment rules differ.</p>

<p><strong>Pasting 2024 Chomp or Glare onto a 2014 legendary line.</strong> 2014 legendary actions are three uses of Eye Ray, one random ray each. 2024 legendary actions are Chomp (two Bites) or Glare (uses Eye Rays). Two Bites on a 2014 legendary step are not on that page. A 2024 Glare that fires three 2014-style rays is not on that page either.</p>

<p><strong>Pasting Legendary Resistance onto the 2014 transcription.</strong> The 2014 page used here does not list it. 2024 lists 3/Day, or 4/Day in a lair. If you need the 2014 print to confirm a missing line, check the book, then write what the book actually says. Do not borrow 2024 because the table expects legendary monsters to auto-succeed.</p>

<p><strong>Treating a spectator as a small beholder.</strong> Four stalks, CR 3, no antimagic cone. Ten stalks, CR 13, cone from the central eye. Wrong silhouette is a wrong creature even when the initiative name is Beholder.</p>

<p><strong>Pasting a Death Tyrant onto the CR 13 Beholder card.</strong> Different undead block. Wrong art, wrong traits, wrong fight.</p>

<p><strong>Mixing save abilities on Slowing and Petrification.</strong> 2014 Slowing and Petrification are Dexterity. 2024 Slowing and Petrification are Constitution. A Dexterity-save monk is not the same target on both cards.</p>

<p><strong>Mixing Enervation damage types.</strong> 2014 is 36 (8d8) necrotic with half on a success. 2024 is 13 (3d8) Poison plus Poisoned that blocks hit-point regain. Those are not a reskin of the same ray.</p>

<p><strong>Giving 2014 Disintegration or Death a half-damage success because 2024 has one.</strong> The 2014 transcription used here does not list half on those two rays. 2024 does. Copy the success line from the locked year.</p>

<p><strong>Claiming an SRD-legal full reprint.</strong> Beholder is excluded from SRD 5.2. Wikipedia is a name and Product Identity check, not a stat block.</p>

<p><strong>Cropping four stalks, a skull orb, or a lone pupil, then labeling it beholder.</strong> The map read is ten stalks and a central eye. Wrong silhouette is a wrong creature, even when the initiative name is correct.</p>

<h2>Session check</h2>

<p>Before the cone goes down, the tracker and the token should answer these in writing:</p>

<ol>
  <li>Source line: <code>Beholder (Monster Manual 2014)</code> or <code>Beholder (Monster Manual 2024)</code>. Confirm numbers on print.</li>
  <li>Antimagic Cone: trait, set facing and on/off at the start of each turn (2014), or Bonus Action wave until the start of the next turn (2024). Both work against own rays.</li>
  <li>Eye Rays procedure: one action, three random rays, reroll duplicates, one to three targets (2014), or Multiattack, Eye Rays three times, one random ray each, reroll if already used this turn (2024).</li>
  <li>Legendary actions: three Eye Ray uses, one random ray each (2014), or 3 uses (4 in a lair) of Chomp or Glare (2024).</li>
  <li>Legendary Resistance: not listed on the 2014 transcription used here; 3/Day, or 4/Day in a lair, on 2024.</li>
  <li>Movement: Speed 0 feet, fly 20 feet (hover) (2014), or Speed 5 feet, Fly 40 feet (hover) (2024).</li>
  <li>Sheet identity: CR 13 Beholder, not a CR 3 spectator, not a Death Tyrant. No spectator rays on this token.</li>
  <li>Token: ten eyestalks and the central eye inside the crop. Large 2&times;2. Short label such as <code>Beh 2014</code> or <code>Beh 2024</code>.</li>
</ol>

<p>If any line is blank, you do not have a finished beholder for tonight. Fill the blank from the locked book, not from a second book that had a prettier number.</p>

<h2>FAQ about dnd beholder</h2>
<h3>Which Monster Manual do I use for a CR 13 beholder?</h3>
<p>Copy either the 2014 <em>Monster Manual</em> beholder or the 2024 <em>Monster Manual</em> beholder, then use only that book&rsquo;s Antimagic Cone, Eye Rays, and legendary actions. Write <code>2014</code> or <code>2024</code> on the initiative tracker. Confirm numbers on the printed page; AideDD and Roll20 are public transcriptions of those books.</p>
<h3>How many eye rays does a beholder shoot on its turn?</h3>
<p>On the 2014 block, the Eye Rays action shoots three random rays (reroll duplicates) at one to three seen targets within 120 feet. On the 2024 block, Multiattack uses Eye Rays three times, and each use is one random ray (1d10; reroll if that ray was already used this turn) at one seen target within 120 feet. Do not mix those procedures.</p>
<h3>Is a spectator a small beholder?</h3>
<p>No. A spectator is a CR 3 guardian with four eyestalks and no antimagic cone. The CR 13 beholder has ten eyestalks, a central eye, and Antimagic Cone. Do not run spectator rays on a beholder token.</p>
<h3>Is the beholder in the SRD 5.2?</h3>
<p>No. Beholder is excluded from SRD 5.2. Do not paste a full stat block and call it SRD-legal. Copy from the printed <em>Monster Manual</em> you locked; the public transcriptions in Sources are check pages, not a license.</p>
<h3>What has to stay inside the beholder token?</h3>
<p>Keep ten eyestalks and the central eye inside the crop. A four-stalk crop reads as a spectator. Export a transparent PNG for a Large 2&times;2 space; that is a crop job, not a promise that a VTT will import the file with zero extra setup.</p>

<h2>Sources</h2>

<ul>
  <li><strong>aidedd-mm2014-beholder</strong> &mdash; AideDD Beholder (2014 Monster Manual transcription) &mdash; <a href="${BEHOLDER_2014_AIDEDD_URL}" rel="noreferrer noopener">${BEHOLDER_2014_AIDEDD_URL}</a> &mdash; Supports: Large aberration; LE; AC 18 (natural armor); HP 180 (19d10+76); Speed 0 ft., fly 20 ft. (hover); saves Int +8, Wis +7, Cha +8; Perception +12; immune prone; Darkvision 120; PP 22; Deep Speech; Undercommon; CR 13 (10,000 XP); Antimagic Cone trait; Bite +5, 14 (4d6); Eye Rays three random (reroll duplicates); legendary 3, Eye Ray only; ray list DC 16. This transcription does not list Legendary Resistance. Confirm on print.</li>
  <li><strong>aidedd-mm2024-beholder</strong> &mdash; AideDD Beholder (Monster Manual 2024 header) &mdash; <a href="${BEHOLDER_2024_AIDEDD_URL}" rel="noreferrer noopener">${BEHOLDER_2024_AIDEDD_URL}</a> &mdash; Supports: header lines including HP 190, Speed 5 ft. Fly 40 hover, Initiative +12 (22), Legendary Resistance, Multiattack, Bite, Eye Rays, Bonus Action Antimagic Cone, legendary Chomp and Glare. Ray body is not expanded on that page. Confirm on print.</li>
  <li><strong>roll20-mm2024-beholder</strong> &mdash; Roll20 Beholder, Monster Manual (2024) &mdash; <a href="${BEHOLDER_2024_ROLL20_URL}" rel="noreferrer noopener">${BEHOLDER_2024_ROLL20_URL}</a> &mdash; Supports: 2024 cone as Bonus Action; Multiattack Eye Rays three times; 1d10 rays with same-turn reroll; Chomp and Glare; Legendary Resistance 3/Day or 4 in lair; CR 13 (10,000, or 11,500 in lair); expanded 2024 ray paragraphs. Confirm on print.</li>
  <li><strong>wikipedia-beholder-name</strong> &mdash; Beholder (Dungeons &amp; Dragons) &mdash; <a href="${DND_BEHOLDER_WIKIPEDIA_URL}" rel="noreferrer noopener">${DND_BEHOLDER_WIKIPEDIA_URL}</a> &mdash; Supports: the monster name and Product Identity status. Not a rules source for tonight&rsquo;s numbers.</li>
  <li><strong>ddb-srd-5-2</strong> &mdash; D&amp;D Beyond SRD &mdash; <a href="${DND_SRD_URL}" rel="noreferrer noopener">${DND_SRD_URL}</a> &mdash; Supports: exclusion check; Beholder is not an SRD 5.2 reprint. Not a stat block.</li>
</ul>
`;

export const dndBeholderArticleHtmlZh = String.raw`
<p>开团前先锁书：今晚这只挑战等级 13 的<strong>dnd beholder</strong>，中文桌叫<strong>眼魔</strong>，是抄 2014《怪物图鉴》还是抄 2024《怪物图鉴》。卡边写下年来源，再用同一本书跑反魔锥、眼射线、传奇动作。两版都是大型异怪、守序邪恶、挑战等级 13，这三项分不出你锁的是哪一年；分得开的是反魔锥算特质还是附赠动作、一个动作怎么随机眼射线、传奇动作有没有啮咬，以及 2014 转写有没有列传奇抗性。</p>

<p>今晚上桌的是真眼魔，不是观察者眼魔、亡眼暴君、眼魔丧尸，也不是只拿来点名的珊娜萨。Token 缩到地图尺寸后，仍要认出中央眼和十根眼柄。数字以你锁的那本印本为准；转写和印本打架，听印本。</p>

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
      <td>写「2014《怪物图鉴》眼魔」</td>
      <td>写「2024《怪物图鉴》眼魔」</td>
    </tr>
    <tr>
      <th scope="row">血量与移动</th>
      <td>180（19d10+76）；速度 0，飞行 20 尺（悬浮）</td>
      <td>190（20d10+80）；速度 5 尺，飞行 40 尺（悬浮）；先攻 +12（22）</td>
    </tr>
    <tr>
      <th scope="row">反魔锥</th>
      <td>特质：150 尺锥状，等同反魔法场；每回合开始决定朝向和是否开启；对自己的眼射线也生效</td>
      <td>附赠动作：150 尺锥，持续到自己下回合开始，等同反魔法场，也克自己的射线</td>
    </tr>
    <tr>
      <th scope="row">眼射线怎么射</th>
      <td>一个动作随机射三条（重复重骰），1–3 个 120 尺内可见目标</td>
      <td>多重攻击：眼射线三次；每次随机一条（1d10，本回合已用则重骰）</td>
    </tr>
    <tr>
      <th scope="row">啮咬</th>
      <td>+5，14（4d6）穿刺</td>
      <td>+8，13（3d6+3）穿刺</td>
    </tr>
    <tr>
      <th scope="row">传奇抗性</th>
      <td>该年转写未列，不要从 2024 补进来</td>
      <td>3/日（巢穴 4）</td>
    </tr>
    <tr>
      <th scope="row">传奇动作</th>
      <td>3，选项只有 Eye Ray（再随机一条）</td>
      <td>3（巢穴 4）：Chomp 两次啮咬；Glare 再用眼射线</td>
    </tr>
    <tr>
      <th scope="row">Token 认什么</th>
      <td>中央眼加十根眼柄留在框里</td>
      <td>同样要留下十根眼柄；不要裁成四根眼柄的观察者眼魔</td>
    </tr>
  </tbody>
</table>

<h2>先把今晚这只从观察者眼里摘出来</h2>

<p>口头喊「眼魔」时，先确认全桌指的是挑战等级 13、十根眼柄、中央眼会开反魔锥的那只。中文桌主词用眼魔，点出 dnd beholder，避免只丢一个在图鉴里到处撞车的词。<a href="${BEHOLDER_HUIJI_2025_CATALOG_URL}" rel="noreferrer noopener">灰机《怪物图鉴（2025）》目录</a> 列出眼魔、观察者眼魔、亡眼暴君、眼魔丧尸，译名跟这一页走；灰机「眼魔」专页常停在验证页，本文未采用其数字。</p>

<p>四只容易认错的东西，开图前划开：</p>

<ul>
  <li><strong>眼魔。</strong>大型球体，一张大嘴，一只中央眼，头顶十根眼柄。今晚要上的就是这张挑战等级 13。</li>
  <li><strong>观察者眼魔。</strong>四根眼柄，不是十根。它是守卫，不是缩小版真眼魔。规则、房间职责和 Token 裁法见 <a href="${ZH_SPECTATOR_DND_PATH}" rel="noreferrer noopener">观察者眼魔专页</a>，不要把那一页的四射线、法术反射抄进挑战等级 13。</li>
  <li><strong>亡眼暴君。</strong>不死的眼魔形态，不是今晚这张活着的基础面板。名字记下，数值不要从记忆往真眼魔上贴。</li>
  <li><strong>眼魔丧尸。</strong>丧尸化的眼魔，也不是挑战等级 13 那张卡。图上若已腐烂、眼柄折断，先问这桌锁的是不是丧尸，再决定要不要换卡。</li>
</ul>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${BEHOLDER_NAME_COLLISION_ZH_IMAGE_PATH}"
    alt="桌上三张被否决的图卡：四根眼柄的观察者眼魔、骷髅状亡眼暴君、腐烂的眼魔丧尸；旁边一枚打勾的真眼魔 Token，中央眼和十根眼柄都在"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>打勾的是挑战等级 13、十根眼柄的眼魔。四根眼柄的观察者眼魔、亡眼暴君、眼魔丧尸都不要当今晚的基础面板。</figcaption>
</figure>

<p>珊娜萨是有名字的眼魔，点到为止。不要把它的未核验数值、层数或宝藏表写进今晚这张挑战等级 13。名字可以挂在门上当压力，卡面仍抄你锁的那本《怪物图鉴》眼魔。</p>

<p>地图上出现四根眼柄，你却念反魔锥和十条射线，全桌会对不上。先把今晚这只从观察者眼里摘出来，再去锁书。</p>

<h2>先锁 2014 还是 2024</h2>

<p>问 DM 一句就够：2014 还是 2024。写在怪物卡边、VTT 条目标题或打印页页眉，格式直接用「2014《怪物图鉴》眼魔」或「2024《怪物图鉴》眼魔」。不要只写「第五版眼魔」——两版都是第五版。也不要把转写页标题当成年来源：<a href="${BEHOLDER_2014_AIDEDD_URL}" rel="noreferrer noopener">AideDD 2014 眼魔</a> 是 2014 书的转写；<a href="${BEHOLDER_2024_AIDEDD_URL}" rel="noreferrer noopener">AideDD 2024 眼魔</a> 与 <a href="${BEHOLDER_2024_ROLL20_URL}" rel="noreferrer noopener">Roll20 2024 眼魔</a> 是 2024 公开页。印本为准，卡边仍要有年。</p>

<p>挑战等级都是 13，护甲等级都是 18，2014 注明天生护甲，这几行当不了锁年证据。血量对得上才说明你抄对了书：2014 是 180（19d10+76），2024 是 190（20d10+80）。感官和语言两版也能对上——黑暗视觉 120 尺，被动察觉 22，深潜语，地底通用语，免疫倒地——所以锁年不要靠这一行。</p>

<p>真正会改遭遇的差在表里几列：反魔锥的工种、眼射线的随机法、传奇动作有没有啮咬、2014 转写有没有传奇抗性、会不会走路、飞多快。数字以对照表为准，不要从另一年借一句「看起来更狠」的结算。</p>

<p>2014 豁免是智力 +8、感知 +7、魅力 +8，察觉 +12。2024 力量 16，体质豁免 +9、感知 +7，先攻 +12（22）。不要把 2024 的先攻贴到 2014 卡上，也不要把 2014 的魅力豁免熟练当成 2024 仍有。缺的数字回到你锁的那一页。</p>

<p>另一只也要锁年的异怪是 <a href="${ZH_MIND_FLAYER_DND_PATH}" rel="noreferrer noopener">夺心魔</a>。那一页管的是心灵震爆和采脑，不要把夺心魔的震慑钟抄进眼魔卡；这里只借用同一条纪律：年来源写在卡边，动作从同一本抄。</p>

<h2>反魔锥不是两版同一份工</h2>

<p>两版都写 150 尺锥状，等同反魔法场，也克自己的眼射线。相同的是几何和「锥里的射线作废」；不同的是这只锥什么时候出现、谁花钱。</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${BEHOLDER_CONE_LOCK_ZH_IMAGE_PATH}"
    alt="眼魔悬在两本怪物图鉴之间：左边标签写特质、每回合开始决定朝向，右边标签写附赠动作、持续到下回合开始，中央眼前方画出 150 尺锥"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>左边按 2014 跑：反魔锥是特质。右边按 2024 跑：反魔锥是附赠动作。图是锁年示意，不是官方书页扫描。</figcaption>
</figure>

<p>2014 反魔锥写在特质里。中央眼造出 150 尺锥状的反魔法，效果同反魔法场。它自己的每个回合开始，决定锥朝哪、开还是关。锥开着，打进锥里的眼射线一样作废。不要把它改成「想开再花附赠动作」——那是 2024 的工。</p>

<p>2024 反魔锥写在附赠动作里。中央眼放出 150 尺锥的反魔法波，持续到它自己下回合开始，效果同反魔法场，同样克自己的眼射线。它这个回合没花附赠动作，就没有这条锥。不要把它改成「回合开始免费开关」——那是 2014 的工。</p>

<p>锥开着时，不要对锥里的人掷眼射线还假装生效。那不是「射线比较强、场比较弱」，是同一句话：这块区域对自己的眼射线也生效。要把射线打进正面，2014 就在回合开始关掉锥或把锥拧开；2024 就这个回合不花附赠动作，或者把锥朝向没有你要射的人的那一侧。</p>

<p>设计走位，不是某次跑团记录。2014 桌：石厅里三名施法者站在中央眼正前方。回合开始先写锥的朝向——锥对着施法者，他们的法术进锥会吃反魔法，你自己的眼射线也打不进这条线；要把三条射线打在他们身上，就把锥拧向空墙，或这个回合关掉锥。2024 桌同一条石厅：先决定要不要花附赠动作开锥。开了，持续到你下回合开始，射线同样打不进锥；要射正面的人，就别开锥，或把锥偏向没有目标的一侧。两套都合法，前提是卡边写的年和你花的那份工是同一本。</p>

<p>锁年之后不要再开第二本《怪物图鉴》去补「看起来更灵活」的句子。2014 没有把反魔锥写成附赠动作，就不要给它腾出附赠动作再开一次锥。2024 没有把反魔锥写成常驻特质，就不要让它免费挂一整天。</p>

<h2>用同一本书跑眼射线</h2>

<p>眼射线是这张卡的主工，不是十张可以随便抽来拼的牌。射程两版都是 120 尺内一个它能看见的目标，豁免 DC 都是 16。不要因为 DC 相同，就把伤害、持续时间和豁免属性从另一年借过来。</p>

<p>2014：一个动作叫眼射线，随机射三条，重复则重骰，目标可以是 1 到 3 个 120 尺内可见生物。没有多重攻击这一行。除非你锁的印本另有一条，否则不要再给 2014 加一次「眼射线三次」。</p>

<p>2024：动作区有多重攻击，内容是眼射线三次。每一次眼射线随机一条，掷 1d10，本回合已经用过该射线则重骰。不要把 2014 的「一次动作三条、重复重骰」抄成 2024 的随机法，也不要把 2024 的「每次一条、本回合已用则重骰」倒回 2014。</p>

<p>要掷这些 DC 16 豁免时，用 <a href="${ZH_DICE_ROLLER_PATH}" rel="noreferrer noopener">骰子工具</a> 当场出结果，不要口算一串「大概过了」。随机哪一条也掷，不要用记忆里「今晚该出解离」来替 1d10。</p>

<table>
  <thead>
    <tr>
      <th scope="col">会改遭遇的射线</th>
      <th scope="col">2014《怪物图鉴》</th>
      <th scope="col">2024《怪物图鉴》</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">魅惑射线</th>
      <td>感知 DC 16；失败被魅惑 1 小时，或直到这只眼魔伤害它。条目只写失败后果</td>
      <td>感知 DC 16；失败 13（3d8）心灵并被魅惑 1 小时或直到受伤；成功半伤、不受魅惑</td>
    </tr>
    <tr>
      <th scope="row">麻痹射线</th>
      <td>体质 DC 16；失败麻痹 1 分钟，该生物自己的回合结束时可再豁免</td>
      <td>体质 DC 16；失败麻痹，自己的回合结束时可再豁免，1 分钟后自动成功</td>
    </tr>
    <tr>
      <th scope="row">恐惧射线</th>
      <td>感知 DC 16；失败恐惧 1 分钟，自己的回合结束时可再豁免。条目只写失败后果</td>
      <td>感知 DC 16；失败 14（4d6）心灵，恐惧持续到目标下回合结束；成功半伤</td>
    </tr>
    <tr>
      <th scope="row">迟缓射线</th>
      <td>敏捷 DC 16；失败则 1 分钟内速度减半，不能作反应，回合里只能选动作或附赠动作之一，自己的回合结束时可再豁免</td>
      <td>体质 DC 16；失败 18（4d8）暗蚀，效果只到目标下回合结束：速度减半、不能作反应、动作或附赠动作只能选一个；成功半伤</td>
    </tr>
    <tr>
      <th scope="row">衰弱射线</th>
      <td>体质 DC 16；失败 36（8d8）暗蚀，成功一半</td>
      <td>体质 DC 16；失败 13（3d8）毒素并中毒至自己下回合结束，中毒期间不能恢复生命值；成功半伤</td>
    </tr>
    <tr>
      <th scope="row">心灵传动射线</th>
      <td>力量 DC 16；失败则被移动最多 30 尺并受束缚，直到眼魔下回合开始或它失能。未着装、未携带且不超过 300 磅的物体可被移动</td>
      <td>力量 DC 16（超巨型自动成功）；失败则被移动最多 30 尺并受束缚，直到眼魔下回合开始或它失能。不要把 2014 的 300 磅句抄过来</td>
    </tr>
    <tr>
      <th scope="row">睡眠射线</th>
      <td>感知 DC 16；失败昏睡并昏迷 1 分钟；受伤或另一生物用动作唤醒则结束。构装和不死不受影响</td>
      <td>感知 DC 16（构装和不死自动成功）；失败昏迷 1 分钟；受伤或 5 尺内生物用动作唤醒则结束</td>
    </tr>
    <tr>
      <th scope="row">石化射线</th>
      <td>敏捷 DC 16；失败开始石化并受束缚，下回合结束再豁免，再失败则石化，直到高等复原术或其他魔法解除</td>
      <td>体质 DC 16；第一次失败受束缚，仍受束缚则下回合结束再豁免；第二次失败改为石化。结束条件抄 2024 那一页，不要贴 2014 的高等复原术句</td>
    </tr>
    <tr>
      <th scope="row">解离射线</th>
      <td>敏捷 DC 16；失败 45（10d8）力场，因此降至 0 HP 则化作灰烬。条目只写失败伤害</td>
      <td>敏捷 DC 16；失败 36（8d8）力场，成功半伤；无论成败，该伤害把生物打到 0 HP 则化作灰烬</td>
    </tr>
    <tr>
      <th scope="row">死亡射线</th>
      <td>敏捷 DC 16；失败 55（10d10）暗蚀，因此降至 0 HP 则死亡。条目只写失败伤害</td>
      <td>敏捷 DC 16；失败 55（10d10）暗蚀，成功半伤；该伤害把目标打到 0 HP 则死亡</td>
    </tr>
  </tbody>
</table>

<p>表里几条最容易把两版拼坏。2024 的魅惑和恐惧带心灵伤害，成功仍半伤；2014 这两条没有伤害行，成功不要补半伤。2024 恐惧只挂到目标下回合结束，不要挂回 2014 的 1 分钟。2024 迟缓改体质、带暗蚀，持续时间也短；不要把 2014 的敏捷豁免和 1 分钟钟，接到 2024 的 18（4d8）暗蚀上。2024 衰弱是毒素加中毒、不能回血，不是 2014 那条 36（8d8）暗蚀。解离 2024 是 36（8d8）力场且成功半伤；死亡射线 2024 成功也半伤。2014 解离和死亡射线按转写只写失败后果，不要用 2024 的半伤去「修正」。</p>

<p>传奇动作也跟书走。2014 有 3 次，选项只有 Eye Ray：再随机一条眼射线。2024 有 3 次（巢穴 4），选项是 Chomp（两次啮咬）和 Glare（再用眼射线）。不要给 2014 加两次啮咬的传奇，也不要删掉 2024 的 Chomp 只留射线。2024 啮咬是 +8、13（3d6+3）穿刺；2014 啮咬是 +5、14（4d6）穿刺。锥开着、正面射线打不进时，2024 可以用 Chomp；2014 传奇没有这个选项，就不要发明。</p>

<p>2024 有传奇抗性 3/日（巢穴 4）。2014 转写未列这一行。不要因为「传奇怪物都该有」就把 3 次抗性写进 2014。2024 巢穴 XP 是 11500，不要把这个数字抄到没锁巢穴、也没锁 2024 的卡上。</p>

<p>设计走位，不是某次跑团记录。2014 桌：先处理反魔锥朝向，再对 120 尺内 1 到 3 个人随机三条射线。传奇动作等到别人回合结束，再随机一条。不要在同一回合把 2024 的半伤恐惧和 2014 的 1 分钟恐惧叠在一个人身上。2024 桌：附赠动作决定锥在不在；动作走多重攻击，眼射线三次，每次一条、本回合已用则重骰。别人回合结束可以用 Glare 再射，或 Chomp 两次。豁免仍用表里那一列，不要回头翻 2014。</p>

<p>另一只眼魔的飞行不要混。2014 速度 0、飞行 20 尺（悬浮），不会走路。2024 速度 5 尺、飞行 40 尺（悬浮）。不要给 2014 加 40 尺飞，也不要把 2024 改回不能走路。垂直坑、栏杆、窄桥的意义跟这一行走。</p>

<h2>Token 留下十根眼柄</h2>

<p>圆形棋子很小。眼魔要在缩尺地图上被认成「这只会开反魔锥的十眼异怪」，优先留下中央眼和十根眼柄，而不是一张只有大嘴的特写。眼柄被圆框切掉以后，场上只剩球体和大嘴，下一轮就会被认成观察者眼魔，或者认成某种没有射线的漂浮怪。</p>

<p>裁切时轮廓比五官重要。观察者眼魔要留下四根眼柄，真眼魔要留下十根。都是先让人读出威胁类型，再考虑表情。中央眼要落在框里，十根眼柄至少要看出「不是四根」，缩到常用尺寸后仍能认出来。</p>

<p>真正要裁的时候，用 <a href="${ZH_EDITOR_PATH}" rel="noreferrer noopener">Token Maker 编辑器</a> 在浏览器里切圆、方或多边形。大型占两格见方；眼柄被圆形遮罩切掉时，改用 <a href="${ZH_SQUARE_TOKEN_MAKER_PATH}" rel="noreferrer noopener">方形 Token</a>，给两侧眼柄留边。本地裁切，导出透明 PNG，尺寸用 256、512、1024 或 2048。这些 PNG 面向 Roll20、Foundry、Owlbear 这类接受图片 Token 的虚拟桌面，不是导入后零修改的兼容保证。不要写成已经把某张图送进某次房间并看过效果。</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${BEHOLDER_TOKEN_STALKS_ZH_IMAGE_PATH}"
    alt="圆形 Token 特写：眼魔中央眼和十根眼柄都留在金属圆框里，没有裁成四根眼柄"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>缩小后仍要能看出中央眼和十根眼柄。图是裁切示意，不是编辑器截图，也不是某次跑团记录。</figcaption>
</figure>

<p>失败了就按能看见的结果改：眼柄出框，放宽裁切或改方形，让中央眼和眼柄都进框；裁成四根眼柄，换回十根那张；边框文字不要写「观察者」或「珊娜萨」来代替卡边年来源。棋子负责让人认出今晚这只，规则锁在怪物卡上。</p>

<h2>会把遭遇写坏的混用</h2>

<p>最常见的坏法，是锥按常开的那版、射线按带伤半伤的那版。2014 反魔锥是特质，回合开始就能决定开和朝向；若再接 2024 魅惑、恐惧的心灵伤害和成功半伤，控制面按旧书挂着，伤害面按新书加满。反过来也不干净：2024 锥要花附赠动作，2014 恐惧却还在挂 1 分钟；链条自己对不上时，有人就会把附赠动作忘掉，让 2024 眼魔免费开一整天锥。</p>

<p>射线不要拆开借。把 2014 解离的 45（10d8）接到 2024 的成功半伤上，或把 2024 衰弱的毒素中毒接到 2014 的 36（8d8）暗蚀上，都不是图鉴里的生物。迟缓更隐蔽：2014 走敏捷、挂 1 分钟；2024 走体质、带暗蚀、只到目标下回合结束。不要长钟加新伤。</p>

<p>传奇不要叠成第三套。给 2014 面板加上传奇抗性 3/日，或给 2014 传奇加上 Chomp 两次啮咬，血量和动作经济会对不上转写。给 2024 删掉传奇抗性，或把传奇次数写死成 3、连巢穴 4 也不抄，巢穴那场会少一层该有的缓冲。2024 巢穴 XP 11500 也不要写进 2014。</p>

<p>移动不要叠。给 2014 加上飞行 40 尺或 5 尺步行，坑和栏杆的意义会乱。给 2024 改回速度 0、飞行 20 尺，它该能走过的 5 尺格会凭空消失。先攻 +12 只跟 2024 走。</p>

<p>变体混名同样会写坏。把观察者眼魔的四射线、岗位契约当成真眼魔的十条射线和反魔锥，挑战等级 13 的威胁范围会对不上。把亡眼暴君、眼魔丧尸的句子贴进基础词条，动作名会对不上你锁的《怪物图鉴》。Token 用四根眼柄或腐烂球体，圆框里认不出十根眼柄，规则锁对了，地图仍在跑另一只怪。珊娜萨只作名字压力，不要把未核验的个人数值塞进基础面板。</p>

<h2>开团核对</h2>

<ul>
  <li>卡边写了「2014《怪物图鉴》眼魔」或「2024《怪物图鉴》眼魔」，没有只写「第五版」。</li>
  <li>反魔锥、眼射线、传奇动作抄自同一年，没有用一年版的锥去开另一年版的射线。</li>
  <li>2014：反魔锥是特质，回合开始决定朝向和是否开启；一个动作随机三条（重复重骰）；传奇只有再随机一条；转写未列传奇抗性，不要补；速度 0、飞行 20 尺（悬浮）；啮咬 +5，14（4d6）穿刺。</li>
  <li>2024：反魔锥是附赠动作，持续到自己下回合开始；多重攻击为眼射线三次，每次随机一条（本回合已用则重骰）；传奇 3（巢穴 4）为 Chomp 或 Glare；传奇抗性 3/日（巢穴 4）；速度 5 尺、飞行 40 尺（悬浮）；啮咬 +8，13（3d6+3）穿刺；先攻 +12（22）。</li>
  <li>2024 魅惑、恐惧带心灵伤害且成功半伤；恐惧只到目标下回合结束。2014 这两条没有伤害行，成功不要补半伤，恐惧按 1 分钟再豁免。</li>
  <li>2024 迟缓改体质且带暗蚀；衰弱是毒素加中毒、不能回血。不要把 2014 的 36（8d8）暗蚀衰弱接到 2024 上。</li>
  <li>2024 解离 36（8d8）力场、成功半伤；死亡射线成功半伤。2014 解离 45（10d8）、死亡射线 55（10d10），转写只写失败后果。</li>
  <li>Token 缩到地图尺寸后仍能看出中央眼和十根眼柄，没有裁成四根眼柄的观察者眼魔。</li>
  <li>没有把观察者眼魔、亡眼暴君、眼魔丧尸或珊娜萨的未核验数值当基础面板。</li>
  <li>转写与印本冲突时，以印本为准，并在卡边留下实际采用的年。</li>
</ul>

<h2>来源</h2>

<ul>
  <li><a href="${BEHOLDER_2014_AIDEDD_URL}" rel="noreferrer noopener">AideDD：2014《怪物图鉴》Beholder</a> — 英文转写，印本为准；特质反魔锥、一次三条眼射线、传奇仅 Eye Ray、未列传奇抗性</li>
  <li><a href="${BEHOLDER_2024_AIDEDD_URL}" rel="noreferrer noopener">AideDD：2024《怪物图鉴》Beholder</a> — 先攻、血量、飞行、附赠动作反魔锥、多重攻击与传奇抗性结构</li>
  <li><a href="${BEHOLDER_2024_ROLL20_URL}" rel="noreferrer noopener">Roll20：2024 Beholder</a> — 十条射线的伤害与持续时间；Chomp / Glare；巢穴 XP 11500</li>
  <li><a href="${BEHOLDER_HUIJI_2025_CATALOG_URL}" rel="noreferrer noopener">灰机wiki：怪物图鉴（2025）目录</a> — 眼魔、观察者眼魔、亡眼暴君、眼魔丧尸译名；不采数字</li>
</ul>
`;
