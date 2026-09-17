import {
  DND_KOBOLD_CHARACTER_IMAGE_PATHS,
  EN_DND_DRAGONBORN_PATH,
  EN_DND_KENKU_PATH,
  EN_DND_RACES_PATH,
  EN_EDITOR_PATH,
  ZH_DND_DRAGONBORN_PATH,
  ZH_DND_KENKU_PATH,
  ZH_DND_RACES_PATH,
} from './shared';

export const dndKoboldArticleHtml = String.raw`
<p>A <strong>dnd kobold</strong> on a 5e table is a Small pack-and-trap minion. Tonight it is either the 2014 <strong>Kobold</strong> (Small Humanoid, Lawful Evil) or the 2024 <strong>Kobold Warrior</strong> (Small Dragon, Neutral). Same challenge rating 1/8 does not make those one creature. Write the source line, then copy that page only.</p>

<p>This is unofficial Fan Content permitted under the Wizards of the Coast <a href="https://company.wizards.com/en/legal/fancontentpolicy" rel="noreferrer noopener">Fan Content Policy</a>. It is not approved or endorsed by Wizards. It does not use D&amp;D logos, and it does not replace the printed monster page your table owns.</p>

<p>Confirm every number on that printed page. The <a href="https://media.dndbeyond.com/compendium-images/srd/5.1/SRD_CC_v5.1.pdf" rel="noreferrer noopener">SRD 5.1 Kobold</a> (CC-BY) and the <a href="https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf" rel="noreferrer noopener">SRD 5.2.1 Kobold Warrior</a> (CC-BY) are the open check pages used here. D&amp;D Beyond&rsquo;s <a href="https://www.dndbeyond.com/monsters/16939-kobold" rel="noreferrer noopener">2014 Kobold monster</a> and <a href="https://www.dndbeyond.com/monsters/5195096-kobold-warrior" rel="noreferrer noopener">Kobold Warrior monster</a> are the matching official entries. Copy type, alignment, and the fight lines from that one page onto the tracker. Do not average the two years into a generic kobold.</p>

<table>
  <thead>
    <tr>
      <th>Need-to-know point</th>
      <th>Fast answer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>What it is</strong></td>
      <td>Small reptilian dungeon dweller. It wins with numbers, Pack Tactics, and traps. It is not a solo boss, not a dragonborn, and not a Warcraft candle-miner.</td>
    </tr>
    <tr>
      <td><strong>2014 monster</strong></td>
      <td>Kobold. Small Humanoid (kobold). Lawful Evil. Armor Class 12. Hit points 5 (2d6&minus;2). Dagger plus sling (30/120 feet).</td>
    </tr>
    <tr>
      <td><strong>2024 monster</strong></td>
      <td>Kobold Warrior. Small Dragon. Neutral. Armor Class 14. Hit points 7 (3d6&minus;3). Three daggers (melee or thrown 20/60 feet). No sling.</td>
    </tr>
    <tr>
      <td><strong>Why CR 1/8 hurts</strong></td>
      <td>Pack Tactics: the kobold has advantage on the attack if an ally is within 5 feet of the target and is not incapacitated. Both official monster pages keep that job.</td>
    </tr>
    <tr>
      <td><strong>Sunlight</strong></td>
      <td>2014 Kobold: attack rolls and sight-based Wisdom (Perception) checks. 2024 Kobold Warrior: ability checks and attack rolls. Do not average the two sentences.</td>
    </tr>
    <tr>
      <td><strong>Playable?</strong></td>
      <td>Yes if the table allows <em>Volo&rsquo;s Guide to Monsters</em> (D&amp;D Beyond: Legacy) or <em>Mordenkainen Presents: Monsters of the Multiverse</em>. Not one of the 2024 <em>Player&rsquo;s Handbook</em> ten. That player page is a different book from this monster.</td>
    </tr>
    <tr>
      <td><strong>Space</strong></td>
      <td>Small controls a 5-by-5-foot space, one square, the same as Medium. Tiny (four creatures in one square) is not this creature.</td>
    </tr>
  </tbody>
</table>

<h2>What a 5e kobold is on the table</h2>

<p>Point at the miniature before you copy a number. A 5e kobold is a Small reptilian person: snout, horn-frill or scaly head, bipedal stance, dungeon-scale body. It infests tunnels, ruins, and warrens. Alone it is a fragile minion. The 2014 Kobold has 5 hit points and Armor Class 12. The 2024 Kobold Warrior has 7 hit points and Armor Class 14. Either body is a handful of hit points. The creature is dangerous as a pack, not as a solo boss.</p>

<p>The 2014 Basic Rules monster page describes these humanoids as timid reptilian dungeon dwellers who make up for weak bodies with clever trap-making. That flavor sentence sits on the Basic Rules / D&amp;D Beyond 2014 monster page. It is not in the SRD 5.1 Kobold stat block, and it is not a Creative Commons open line. Use it as a picture of the 2014 creature: numbers plus traps, not a solo duelist. The SRD 5.2.1 Kobold Warrior has no matching ecology paragraph.</p>

<p>Do not read this creature as a Medium dragonborn. A <a href="${EN_DND_DRAGONBORN_PATH}" rel="noreferrer noopener">dnd dragonborn</a> is a Medium ancestry package: horns, scales, a breath weapon tied to one dragon color. That is a player-facing identity with its own 2014 race page or 2024 species page. A kobold on tonight&rsquo;s monster tracker is Small, pack-based, and copied from a Kobold or Kobold Warrior monster entry. Matching the word &ldquo;dragon&rdquo; on the 2024 Warrior type line does not turn the minion into a short dragonborn, and it does not grant a breath weapon from the dragonborn table.</p>

<p>Do not read it as a Warcraft candle-miner either. That other game&rsquo;s kobold is a different look: rat-like, candle on the head, pickaxe labor. If the portrait is a candle-wearing rodent in a mine, you brought the wrong art for this 5e monster even when the file name says kobold. The 5e read is a small reptilian person in a dungeon, not a candle mascot.</p>

<p>Do not read it as a Tiny familiar you stack four to a cell. Both official monsters are Small, not Tiny.</p>

<h2>Lock 2014 Kobold or 2024 Kobold Warrior</h2>

<p>Ask which official monster page is legal tonight. Write that source on the initiative tracker before anyone rolls Pack Tactics. The two example source lines below are not interchangeable.</p>

<ul>
  <li><code>Kobold (Basic Rules / Monster Manual 2014)</code></li>
  <li><code>Kobold Warrior (Monster Manual 2024)</code></li>
</ul>

<p>Matching challenge rating 1/8 is the trap, not the proof that you may mix the rows. Both official monsters are Small, walk 30 feet, have Darkvision 60 feet, speak Common and Draconic, use the same six scores (Strength 7, Dexterity 15, Constitution 9, Intelligence 8, Wisdom 7, Charisma 8), keep Pack Tactics, and list no Frightened immunity on the official pages linked in Sources. Those shared lines do not make type Humanoid in 2014 and type Dragon in 2024 into one creature. They do not make Lawful Evil and Neutral into a blended alignment. They do not move a 2014 sling onto a 2024 Warrior, and they do not shrink 2024 sunlight back to Perception-only. Copy one column.</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_KOBOLD_CHARACTER_IMAGE_PATHS.study}"
    alt="Single orange-brown scaled Kobold character in a brown tunic, standing with hands clasped at the chest and looking to the side against a dark neutral backdrop"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Orange-brown scaled Kobold character standing with hands clasped and a sideward gaze.</figcaption>
</figure>

<h3>2014 &mdash; Small Humanoid, Lawful Evil</h3>

<p>If the tracker says 2014, the creature is named <strong>Kobold</strong>, not Kobold Warrior. The <a href="https://www.dndbeyond.com/monsters/16939-kobold" rel="noreferrer noopener">D&amp;D Beyond 2014 Kobold</a> is a Legacy monster entry that points at Basic Rules (2014) page 142. The <a href="https://media.dndbeyond.com/compendium-images/srd/5.1/SRD_CC_v5.1.pdf" rel="noreferrer noopener">SRD 5.1 PDF</a> reprints the same open block at page 324 under CC-BY. The <a href="https://roll20.net/compendium/dnd5e/Kobold#content" rel="noreferrer noopener">Roll20 5e Compendium Kobold</a> is a Free Basic Rules (2014) reprint you can use as a cross-check, not as a second creature.</p>

<p>Copy that 2014 page onto the tracker. Name, type, alignment, armor, hit points, sunlight, and weapons sit in the table under Copy one column. Do not rename this creature Kobold Warrior, and do not bring over 2024 type, alignment, armor, hit points, sunlight, or daggers. If a public transcription and the printed 2014 book disagree, the printed book wins.</p>

<h3>2024 &mdash; Small Dragon, Neutral, renamed Warrior</h3>

<p>If the tracker says 2024, the creature is named <strong>Kobold Warrior</strong>. That rename is part of the lock. A card that still says only &ldquo;Kobold&rdquo; while using 2024 type Dragon and Neutral is already mixed. The <a href="https://www.dndbeyond.com/monsters/5195096-kobold-warrior" rel="noreferrer noopener">D&amp;D Beyond Kobold Warrior</a> points at <em>Monster Manual</em> page 185 on that entry. The <a href="https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf" rel="noreferrer noopener">SRD 5.2.1 PDF</a> reprints the open Warrior block (about page 302) under CC-BY. Use those pages as check sheets. Confirm on the printed 2024 <em>Monster Manual</em> your table owns.</p>

<p>The 2024 page also prints Initiative +2 (12). That initiative line belongs on the 2024 card. Do not paste it onto a 2014 Kobold because the Dexterity score matches. Copy the 2024 column in the table below. Do not keep a 2014 sling, Perception-only sunlight, Humanoid type, or Lawful Evil. Official SRD 5.2.1 and D&amp;D Beyond Warrior pages list no Frightened immunity. If a fan wiki added that row, ignore it.</p>

<h3>Copy one column</h3>

<p>Print the table below on the DM card, or leave this tab open. The moment someone looks up the other year on a phone, the tracker source still wins. Shared challenge rating, shared speed, shared Darkvision, shared languages, and shared ability scores sit in the lock setup above the figure so you can see the mix-trap. They are not extra permission to blend the fight lines.</p>

<table>
  <thead>
    <tr>
      <th>Line</th>
      <th>2014 Kobold</th>
      <th>2024 Kobold Warrior</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Name</td>
      <td>Kobold</td>
      <td>Kobold Warrior</td>
    </tr>
    <tr>
      <td>Type</td>
      <td>Humanoid (kobold)</td>
      <td>Dragon</td>
    </tr>
    <tr>
      <td>Alignment</td>
      <td>Lawful Evil</td>
      <td>Neutral</td>
    </tr>
    <tr>
      <td>Armor Class</td>
      <td>12</td>
      <td>14</td>
    </tr>
    <tr>
      <td>Hit points</td>
      <td>5 (2d6&minus;2)</td>
      <td>7 (3d6&minus;3)</td>
    </tr>
    <tr>
      <td>Sunlight Sensitivity</td>
      <td>Attack rolls and sight-based Wisdom (Perception) checks</td>
      <td>Ability checks and attack rolls</td>
    </tr>
    <tr>
      <td>Weapons</td>
      <td>Dagger; sling 30/120 feet</td>
      <td>Three daggers; melee or thrown 20/60 feet; no sling</td>
    </tr>
    <tr>
      <td>Pack Tactics</td>
      <td>Yes: ally within 5 feet of the target, not incapacitated</td>
      <td>Yes: same job, 2024 Incapacitated wording</td>
    </tr>
    <tr>
      <td>Frightened immunity</td>
      <td>No</td>
      <td>No on official SRD 5.2.1 and D&amp;D Beyond Warrior pages; ignore fan-wiki rows</td>
    </tr>
  </tbody>
</table>

<p>Do not paste the full attack formulas from either PDF as a handout. Point at the SRD PDFs and the D&amp;D Beyond monster pages, then confirm to-hit, damage, and any remaining lines on the printed book. Pick a column. Stop. A Humanoid/Lawful Evil/AC 12 card with 2024 three-dagger ranges is not a <em>Monster Manual</em> creature. A Dragon/Neutral/AC 14 card with a 2014 sling and Perception-only sunlight is not one either.</p>

<h2>Pack Tactics is why a CR 1/8 pack still hurts</h2>

<p>Challenge rating 1/8 tells you the single body is a minion. It does not tell you how the pack actually rolls. Pack Tactics is a table action you can count on a 5-foot grid: advantage on the attack if an ally stands within 5 feet of the target and is not incapacitated. That is the 2014 SRD wording and the same job on the 2024 Warrior, with 2024 writing the Incapacitated condition in its own style. It is not flavor text about &ldquo;they fight in groups.&rdquo; If you skip the 5-foot check, you are not running the trait on the page.</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_KOBOLD_CHARACTER_IMAGE_PATHS.alert}"
    alt="Single orange-brown scaled Kobold character in a brown tunic, crouching low with one hand raised against a dark neutral backdrop"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Orange-brown scaled Kobold character in a low crouch with one hand raised.</figcaption>
</figure>

<h3>Advantage from an ally within 5 feet</h3>

<p>Count from the target, not from a vibe. The ally must be within 5 feet of the creature being attacked. An ally 10 feet away does not trigger Pack Tactics. An ally who is incapacitated does not trigger it. A second kobold who is still standing, still an ally, and still in a square that touches the target&rsquo;s space does. Both the 2014 Kobold and the 2024 Kobold Warrior use that geometry.</p>

<p>Example, dark corridor pack, not a session log. The tracker says <code>Kobold (Basic Rules / Monster Manual 2014)</code>. A 10-foot-wide dungeon hall is two squares across. A Medium fighter stands in a front square. Two 2014 Kobolds stand in the two squares that share an edge or corner with that fighter so each ally is within 5 feet of the target. Each Small kobold occupies one full square. Neither is incapacitated. Each dagger attack against the fighter uses Pack Tactics. The hall is not in sunlight, so the 2014 sunlight line does not apply. If one kobold drops and is incapacitated, the survivor loses Pack Tactics unless another ally is still within 5 feet of the fighter.</p>

<p>Same map, 2024 lock. The tracker says <code>Kobold Warrior (Monster Manual 2024)</code>. The squares do not change. Each Warrior still occupies one square. Pack Tactics still needs an ally within 5 feet of the fighter who does not have the Incapacitated condition. What did change is the body you are attacking: Armor Class 14 and 7 hit points on the 2024 Warrior, not Armor Class 12 and 5 hit points on the 2014 Kobold, and the weapons are three daggers at 20/60 feet, not a sling at 30/120. Do not keep 2014 hit points on this 2024 pack because &ldquo;they are still CR 1/8.&rdquo;</p>

<p>Example: one kobold alone. A single 2014 Kobold or a single 2024 Kobold Warrior stands in a doorway with no ally within 5 feet of the target. Pack Tactics does not apply. The attack is a normal roll, still subject to sunlight if the doorway is in sunlight, using that year&rsquo;s sunlight sentence. A lone CR 1/8 body is the weak creature the challenge rating describes. The pack is what makes the same rating expensive. If you always give advantage because &ldquo;kobolds swarm,&rdquo; you stopped counting 5 feet.</p>

<p>Traps sit next to that math, not instead of it. Do not skip the 5-foot ally check because a pit trap exists somewhere on the map.</p>

<h3>Sunlight is not the same sentence in both books</h3>

<p>Write the sunlight sentence from the same book as type and alignment. The examples below use one locked year each.</p>

<p>Example: sunlit road, 2014. The tracker says 2014 Kobold. A lookout stands on a sunlit road. A sight-based Wisdom (Perception) check takes the 2014 sunlight penalty. A non-Perception ability check does not take that trait&rsquo;s sunlight penalty, because the 2014 sentence names attacks plus sight-based Wisdom (Perception), not every check. An attack roll in that sunlight does take disadvantage. Pack Tactics still works if an ally is within 5 feet of the target and is not incapacitated. Sunlight does not switch Pack Tactics off. Resolve both traits from the 2014 page. Do not drop sunlight because the pack clustered.</p>

<p>Example: sunlit road, 2024. The tracker says 2024 Kobold Warrior. The same lookout on the same sunlit road now takes disadvantage on ability checks, not only on sight-based Wisdom (Perception). Attack rolls in that sunlight also take disadvantage. The 2014 gap for a non-Perception check is gone on this card. Pack Tactics still needs the 5-foot ally and still does not delete sunlight. If you keep the 2014 Perception-only line because it feels fairer, you are not running the 2024 Warrior.</p>

<p>Indoor torchlight, a hooded lantern, or a dark warren is not automatically sunlight. Use sunlight when the scene is actually in sunlight. Then apply the locked sentence, not a memory of the other book. If the party drags the pack from a dark corridor onto a sunlit road mid-fight, the sunlight line starts applying when the creatures are in sunlight, still from the same year as the tracker.</p>

<h3>Small still takes one square</h3>

<p>Both SRD size tables agree. In SRD 5.1 (page 92) and in SRD 5.2.1 Creature Size and Space, Small is a 5-by-5-foot space, one square, the same as Medium. The <a href="https://www.dndbeyond.com/sources/dnd/br-2024/playing-the-game" rel="noreferrer noopener">2024 free rules Creature Size</a> table is the same occupancy: Small and Medium each take one square. That space is the control zone in combat, not a claim that the body is five feet wide. A 10-foot corridor still holds two Small kobolds abreast the way it holds two Medium creatures. You do not get a free extra body in the same cell because the snout is short.</p>

<p>Tiny is the size that can put four creatures in one square. Neither the 2014 Kobold nor the 2024 Kobold Warrior is Tiny. If four tokens share one cell, the occupancy is wrong for this monster. Pack Tactics will then be counted on a false map: allies look closer than their squares allow, or a &ldquo;pack&rdquo; occupies less hallway than the rules give them. Fix the grid first. Each Small kobold gets one square. Then count 5 feet from the target.</p>

<p>If a virtual tabletop is already in the reader&rsquo;s head, occupancy is still one grid unit. Foundry&rsquo;s token Dimensions field is the occupancy; Scale and the dnd5e Small <code>dynamicTokenScale</code> of 0.8 only shrink the artwork, not the square. Do not treat a smaller picture as Tiny occupancy.</p>

<h2>A playable kobold is a different book</h2>

<p>Yes, a player can play a kobold if the DM allows <em>Volo&rsquo;s Guide to Monsters</em> (D&amp;D Beyond marks that block Legacy) or <em>Mordenkainen Presents: Monsters of the Multiverse</em>. That permission is not this monster entry. The 2014 Kobold and the 2024 Kobold Warrior are NPC stat blocks. A playable kobold is a species/race page in a different book. Do not copy monster Pack Tactics onto a MotM player, and do not copy MotM Draconic Cry onto any monster card.</p>

<p>Kobold is not one of the ten species in the 2024 <em>Player&rsquo;s Handbook</em>. The official list is Aasimar, Dragonborn, Dwarf, Elf, Gnome, Goliath, Halfling, Human, Orc, and Tiefling. See the <a href="https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook" rel="noreferrer noopener">10 species in the 2024 Player&rsquo;s Handbook</a> overview and the <a href="${EN_DND_RACES_PATH}" rel="noreferrer noopener">DnD races and species guide</a> for that core ten. Those pages are not a kobold species picker. D&amp;D Beyond&rsquo;s <a href="https://www.dndbeyond.com/species?filter-search=kobold" rel="noreferrer noopener">species search for kobold</a> shows a MotM card and a Volo&rsquo;s Legacy card. It does not show a 2024 PHB species card in that list.</p>

<p>A 2024 table may still use older species. The same official overview says ability score increases come from the background on 2024, and that older species remain usable; ignore the old species ability score increase and take the background increase instead. That is a paraphrase of the D&amp;D Beyond article. Confirm the printed 2024 conversion notes on the book your table owns. Copy the rest of the player identity from the printed Volo&rsquo;s or MotM page the table actually allowed.</p>

<p>Use the official MotM article <a href="https://www.dndbeyond.com/posts/1248-exploring-the-new-goblin-hobgoblin-and-kobold" rel="noreferrer noopener">Exploring the New Goblin, Hobgoblin, and Kobold</a> to check trait names. Volo&rsquo;s player writeup, in that article, still has Pack Tactics, Sunlight Sensitivity, and Grovel, Cower, and Beg. MotM replaces Pack Tactics with Draconic Cry and replaces Grovel with Kobold Legacy. D&amp;D Beyond&rsquo;s <a href="https://www.dndbeyond.com/legacy" rel="noreferrer noopener">Legacy Content</a> page is what the Legacy badge means. Copy size, speed, darkvision, and height from the printed Volo&rsquo;s or MotM page you own. Do not fill those fields from memory or from a third-party race page.</p>

<p>If the actual job is a player-species lock, use the same shape as the <a href="${EN_DND_KENKU_PATH}" rel="noreferrer noopener">dnd kenku book lock</a>: name Volo&rsquo;s or MotM, copy that player page, and keep monster traits off the sheet. That Kenku article is not kobold rules.</p>

<h2>Crop a token that still reads as a small reptile</h2>

<p>After the tracker already names 2014 Kobold or 2024 Kobold Warrior, the map marker still has to read as that Small reptilian person. The circle is not a second stat block. It cannot fix a mixed type line.</p>

<p>Token Maker can crop a reader-owned JPG, PNG, or WEBP file (up to 10 MB) to a transparent PNG. Open the <a href="${EN_EDITOR_PATH}" rel="noreferrer noopener">Token Maker editor</a>. Use a circular mask so the snout stays inside the ring, add a border if you want, then Download PNG. Export sizes are 256, 512, 1024, and 2048; the editor default is 256. Ordinary PNG download is local-first. A public share link is a different path. The <a href="/faq" rel="noreferrer noopener">Token Maker FAQ</a> is the public page for transparent PNG export and for the wording that those PNGs are designed for Roll20, Foundry VTT, Owlbear, and similar tabletops that accept image tokens. This site is not a VTT plugin and does not export creature data.</p>

<p>There is no Kobold-specific template. Style presets are Warrior, Mage, Rogue, Cleric, Ranger, Undead, Monster, and Other. Those names change a border, mask, and tint starting point. They do not generate a kobold portrait, and the preset named Warrior is not the 2024 Kobold Warrior stat block. Do not pick Warrior as a substitute for writing <code>Kobold Warrior (Monster Manual 2024)</code> on the tracker.</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_KOBOLD_CHARACTER_IMAGE_PATHS.ready}"
    alt="Single orange-brown scaled Kobold character in a brown tunic, standing with arms relaxed at the sides against a dark neutral backdrop"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Orange-brown scaled Kobold character standing with arms relaxed at the sides.</figcaption>
</figure>

<h3>What must stay in the circle</h3>

<p>Keep the snout as a primary shape, not a pixel in the corner. Keep one readable eye. Keep the horn-frill or crest if the portrait has one. Keep enough of the shoulders or collar that the body is a Small person standing in one square. Drop a candle-on-the-head miner silhouette. Drop huge dragonborn horns plus breath effects as the only read. Drop a four-heads-in-one-cell Tiny crop. Drop a full-body pose that shrinks the head to a speck at map zoom. A circular mask is the usual face token. If a thick ring clips the snout, the crop is wrong before any VTT settings are.</p>

<p>Foundry&rsquo;s dynamic token-ring documentation suggests a 512-pixel subject for a single square. That is a software suggestion, not a D&amp;D rule. Roll20&rsquo;s 70 pixels per unit is also software, not a fifth-edition export law. Pick an export size your table already uses among 256, 512, 1024, and 2048. Then look at the token at the zoom you actually play. If the snout vanishes, recrop. That check is the end of the marker job. It is not a promise that a named Roll20, Foundry, or Owlbear world will import the PNG with zero extra setup.</p>

<h3>Failure branches &mdash; recrop</h3>

<ul>
  <li>A thick border eats the snout. Use a thinner border, or pull the portrait so the full snout sits inside the inner edge. If the ring still covers the snout, the crop is wrong, not the VTT.</li>
  <li>The file is a Warcraft candle-kobold. Replace the art. Relabeling a candle-miner as 2014 Kobold does not change the silhouette.</li>
  <li>The file is a dragonborn, or a winged dragon portrait used as a stand-in. Replace the art. Do not relabel breath-warrior horns as a Small dungeon minion.</li>
  <li>The head is a speck in a full-body pose. Recrop on the head until snout and crest fill the circle.</li>
  <li>The label is longer than the token. Use <code>Kob 2014</code> or <code>Kob 2024</code>, not a sentence about traps or dragons.</li>
  <li>Four tiny heads share one cell in the crop. That is Tiny occupancy art. This monster is Small: one creature, one square.</li>
</ul>

<h2>Mix-ups that break the identification</h2>

<p>Each line is a wrong mix plus the fix. None of these is a new mechanic.</p>

<ul>
  <li>Keeping challenge rating 1/8 while averaging Humanoid with Dragon, or Lawful Evil with Neutral. Fix: copy type and alignment from the locked year only. Shared CR is the trap.</li>
  <li>Putting a 2014 sling (30/120 feet) on a 2024 Kobold Warrior, or putting 2024 three-dagger 20/60-foot throws on a 2014 Kobold. Fix: copy weapons from the same page as the name. A 90-foot shot is inside the 2014 sling&rsquo;s far number and outside the 2024 dagger&rsquo;s 60-foot far number.</li>
  <li>Using 2014 sunlight (attacks plus sight-based Wisdom (Perception)) on a 2024 Warrior, or using 2024 sunlight (ability checks plus attacks) on a 2014 Kobold. Fix: copy the sunlight sentence from the tracker year. The 2024 line is wider; the 2014 line leaves a gap on non-Perception checks.</li>
  <li>Putting MotM Draconic Cry on any monster card. Fix: 2014 Kobold and 2024 Kobold Warrior both keep Pack Tactics. Draconic Cry is a MotM player replacement, not a monster trait.</li>
  <li>Putting monster Pack Tactics on a MotM player. Fix: MotM replaced Pack Tactics with Draconic Cry on that player page. Copy the printed player book you allowed, not the minion block.</li>
  <li>Adding Frightened immunity from a fan wiki. Fix: official SRD 5.2.1 and D&amp;D Beyond Warrior pages have no such row. 2014 official pages used here also do not grant it. Leave the row off.</li>
  <li>Copying a 5esrd.com &ldquo;kobold race&rdquo; (Level Up / Open Gaming Network) as if it were Volo&rsquo;s or MotM. Fix: those player books are the official playable options. A third-party race page is not a substitute, including any speed or trait names that page invented.</li>
  <li>Running a flyer from the base Kobold or Kobold Warrior block. Fix: the 2024 <a href="https://roll20.net/compendium/dnd5e/Monsters:Winged%20Kobold?expansion=34653" rel="noreferrer noopener">Winged Kobold on Roll20 (Monster Manual 2024)</a> is a separate card, challenge 1/4, Fly 30 feet. Do not copy that flight onto the CR 1/8 Warrior. Do not invent a 2014 winged block from the base Kobold. Do not treat unique 2024 ecology names as SRD text.</li>
  <li>Building Dragonshield or another named variant from the base block. Fix: those named cards have no stats here. Use the printed variant page if the table owns one. Do not guess extra hit points onto tonight&rsquo;s CR 1/8 minion.</li>
  <li>Using Warcraft candle-kobold art as D&amp;D identity. Fix: replace the portrait with a Small reptilian person. The candle-miner is a different game look.</li>
  <li>Running Pack Tactics as a once-per-rest shout or as a 10-foot aura. Fix: count an ally within 5 feet of the target who is not incapacitated. That is the monster trait on both official years.</li>
  <li>Treating the 2024 type Dragon as a tiny dragonborn, or treating the 2014 type Humanoid as proof that 2024 is still Humanoid. Fix: 2014 monster is Small Humanoid (kobold). 2024 Warrior is Small Dragon. Dragonborn is a different player page. Copy a player creature type from the printed Volo&rsquo;s or MotM page; do not invent a PC type line from the monster.</li>
</ul>

<h2>Session check</h2>

<p>Write these on the tracker before the first Pack Tactics roll. If a line is blank, tonight&rsquo;s kobold is not locked.</p>

<ol>
  <li>Source line: <code>Kobold (Basic Rules / Monster Manual 2014)</code> or <code>Kobold Warrior (Monster Manual 2024)</code>.</li>
  <li>Type and alignment from that line only: Small Humanoid (kobold), Lawful Evil (2014) or Small Dragon, Neutral (2024). Do not mix.</li>
  <li>Pack Tactics: ally within 5 feet of the target, not incapacitated. Players get this only if the locked <strong>player</strong> book still has it (Volo&rsquo;s, not MotM).</li>
  <li>Sunlight sentence from that same book: 2014 attacks plus sight-based Wisdom (Perception), or 2024 ability checks plus attacks.</li>
  <li>Weapons from that same book: 2014 dagger and sling 30/120, or 2024 three daggers at 20/60 and no sling.</li>
  <li>Space: one square each. Small equals Medium occupancy. Not Tiny, not four-to-a-cell.</li>
  <li>If someone is playing a kobold: name Volo&rsquo;s or MotM. No monster traits on that sheet. No Draconic Cry on the minion.</li>
</ol>

<p>Then stop. Fill a blank from the locked page, not from a second book that had a prettier number.</p>

<h2>FAQ about dnd kobold</h2>
<h3>Are kobolds good or evil in D&amp;D?</h3>
<p>The 2014 monster is Lawful Evil. The 2024 Kobold Warrior is Neutral. Volo&rsquo;s <a href="https://www.dndbeyond.com/sources/dnd/sae/volos-guide-to-monsters" rel="noreferrer noopener">player errata</a> removed the Alignment trait and set the player Ability Score Increase to +2 Dexterity only. MotM dropped a racial Alignment trait. Do not average those answers into one moral default.</p>
<h3>Can you play D&amp;D as a kobold?</h3>
<p>Yes if the table allows <em>Volo&rsquo;s Guide to Monsters</em> (Legacy) or <em>Mordenkainen Presents: Monsters of the Multiverse</em>. Kobold is not one of the 2024 PHB ten. Copy that player page. Do not copy the 2014 Kobold or 2024 Kobold Warrior monster onto the character sheet.</p>
<h3>Is a 2024 kobold still a Humanoid?</h3>
<p>The 2024 <strong>Warrior</strong> monster is Small <strong>Dragon</strong>. The 2014 monster is Small Humanoid (kobold). Copy a player creature type from the printed Volo&rsquo;s or MotM page. Do not invent a PC type from either monster.</p>
<h3>Do Small kobolds share a square with a second Small creature by default?</h3>
<p>No. Small is one square, the same as Medium. Tiny is the size that can put four creatures in one square. Neither official monster in this lock is Tiny.</p>

<h2>Sources</h2>

<ul>
  <li><strong>ddb-kobold-2014</strong> &mdash; Kobold monster (D&amp;D Beyond, Legacy / 2014) &mdash; <a href="https://www.dndbeyond.com/monsters/16939-kobold" rel="noreferrer noopener">https://www.dndbeyond.com/monsters/16939-kobold</a> &mdash; Supports: Small Humanoid (kobold), Lawful Evil, AC 12, HP 5, CR 1/8, Pack Tactics, 2014 sunlight, dagger and sling. Basic Rules (2014) p. 142; Legacy badge. Confirm on print.</li>
  <li><strong>srd-5-1-kobold</strong> &mdash; System Reference Document 5.1 (CC-BY) Kobold &mdash; <a href="https://media.dndbeyond.com/compendium-images/srd/5.1/SRD_CC_v5.1.pdf" rel="noreferrer noopener">https://media.dndbeyond.com/compendium-images/srd/5.1/SRD_CC_v5.1.pdf</a> &mdash; Supports: 2014 open block at p. 324; size table at p. 92 (Small = 5 by 5 feet / 1 square). Attribute this PDF to Wizards of the Coast LLC under CC-BY-4.0. This page paraphrases; it is not a full-block reprint.</li>
  <li><strong>ddb-kobold-warrior-2024</strong> &mdash; Kobold Warrior (D&amp;D Beyond) &mdash; <a href="https://www.dndbeyond.com/monsters/5195096-kobold-warrior" rel="noreferrer noopener">https://www.dndbeyond.com/monsters/5195096-kobold-warrior</a> &mdash; Supports: Small Dragon, Neutral, AC 14, HP 7, three daggers, no sling, Pack Tactics, widened sunlight, no Frightened immunity row. <em>Monster Manual</em> p. 185 on that entry.</li>
  <li><strong>srd-5-2-1-warrior</strong> &mdash; System Reference Document 5.2.1 (CC-BY) Kobold Warrior &mdash; <a href="https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf" rel="noreferrer noopener">https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf</a> &mdash; Supports: 2024 open Warrior block (about p. 302) and Creature Size and Space. Attribute this PDF to Wizards of the Coast LLC under CC-BY-4.0. This page paraphrases; it is not a full-block reprint.</li>
  <li><strong>ddb-srd-hub</strong> &mdash; D&amp;D Beyond SRD hub &mdash; <a href="https://www.dndbeyond.com/srd" rel="noreferrer noopener">https://www.dndbeyond.com/srd</a> &mdash; Supports: SRD 5.1 / 5.2.1 license path; SRD 5.2 FAQ that names such as Tiamat are kept out of SRD 5.2. Not a kobold sheet.</li>
  <li><strong>basic-rules-2014-k</strong> &mdash; Basic Rules (2014) Monster Stat Blocks (K) &mdash; <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/monster-stat-blocks-k" rel="noreferrer noopener">https://www.dndbeyond.com/sources/dnd/basic-rules-2014/monster-stat-blocks-k</a> &mdash; Supports: existence of the 2014 trap-making flavor sentence after the Kobold block. Creator FAQ: Basic Rules is not the SRD publishing license. Paraphrase only.</li>
  <li><strong>roll20-kobold-2014</strong> &mdash; Roll20 5e Compendium Kobold &mdash; <a href="https://roll20.net/compendium/dnd5e/Kobold#content" rel="noreferrer noopener">https://roll20.net/compendium/dnd5e/Kobold#content</a> &mdash; Supports: 2014 reprint cross-check from Free Basic Rules (2014). Not a second monster.</li>
  <li><strong>ddb-motm-kobold-post</strong> &mdash; Exploring the New Goblin, Hobgoblin, and Kobold in MotM &mdash; <a href="https://www.dndbeyond.com/posts/1248-exploring-the-new-goblin-hobgoblin-and-kobold" rel="noreferrer noopener">https://www.dndbeyond.com/posts/1248-exploring-the-new-goblin-hobgoblin-and-kobold</a> &mdash; Supports: Volo&rsquo;s player still has Pack Tactics, sunlight, and Grovel; MotM replaces Pack Tactics with Draconic Cry and Grovel with Kobold Legacy. Official article; not a full trait reprint.</li>
  <li><strong>ddb-post-10-species-2024</strong> &mdash; The 10 Species in the 2024 Player&rsquo;s Handbook &mdash; <a href="https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook" rel="noreferrer noopener">https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook</a> &mdash; Supports: kobold is not in the core ten; older species still usable; ability score increases on background.</li>
  <li><strong>ddb-volo-errata</strong> &mdash; Volo&rsquo;s Guide Sage Advice &amp; Errata &mdash; <a href="https://www.dndbeyond.com/sources/dnd/sae/volos-guide-to-monsters" rel="noreferrer noopener">https://www.dndbeyond.com/sources/dnd/sae/volos-guide-to-monsters</a> &mdash; Supports: Kobold Traits around p. 119; player Ability Score Increase is +2 Dexterity only; Alignment trait removed.</li>
  <li><strong>ddb-legacy</strong> &mdash; Legacy Content &mdash; D&amp;D Beyond &mdash; <a href="https://www.dndbeyond.com/legacy" rel="noreferrer noopener">https://www.dndbeyond.com/legacy</a> &mdash; Supports: what the Legacy badge means for Volo&rsquo;s content.</li>
  <li><strong>ddb-species-search-kobold</strong> &mdash; D&amp;D Beyond species search for kobold &mdash; <a href="https://www.dndbeyond.com/species?filter-search=kobold" rel="noreferrer noopener">https://www.dndbeyond.com/species?filter-search=kobold</a> &mdash; Supports: MotM card plus Volo&rsquo;s Legacy card in that listing; no 2024 PHB species card in that list.</li>
  <li><strong>ddb-2024-creature-size</strong> &mdash; Playing the Game &mdash; Creature Size (2024 free rules) &mdash; <a href="https://www.dndbeyond.com/sources/dnd/br-2024/playing-the-game" rel="noreferrer noopener">https://www.dndbeyond.com/sources/dnd/br-2024/playing-the-game</a> &mdash; Supports: Small is 5 by 5 feet / 1 square, same occupancy as Medium.</li>
  <li><strong>roll20-winged-kobold-2024</strong> &mdash; Winged Kobold (Roll20, Monster Manual 2024) &mdash; <a href="https://roll20.net/compendium/dnd5e/Monsters:Winged%20Kobold?expansion=34653" rel="noreferrer noopener">https://roll20.net/compendium/dnd5e/Monsters:Winged%20Kobold?expansion=34653</a> &mdash; Supports: a separate 2024 card, CR 1/4, Fly 30 feet. Not the SRD 5.2.1 Kobold Warrior entry. Do not copy unique ecology names as SRD.</li>
  <li><strong>ddb-creator-faq</strong> &mdash; Creator FAQ &mdash; <a href="https://www.dndbeyond.com/creator-faq" rel="noreferrer noopener">https://www.dndbeyond.com/creator-faq</a> &mdash; Supports: Basic Rules is not the SRD license; cite non-SRD books by title and page.</li>
  <li><strong>wotc-fan-content-policy</strong> &mdash; Fan Content Policy &mdash; <a href="https://company.wizards.com/en/legal/fancontentpolicy" rel="noreferrer noopener">https://company.wizards.com/en/legal/fancontentpolicy</a> &mdash; Supports: unofficial fan page, free access, no D&amp;D logos, no verbatim book dump. Last updated 2017-11-15.</li>
  <li><strong>foundry-tokens</strong> &mdash; Foundry VTT Tokens &mdash; <a href="https://foundryvtt.com/article/tokens" rel="noreferrer noopener">https://foundryvtt.com/article/tokens</a> &mdash; Supports: Dimensions are occupancy in grid units; Scale is art only. Software fact, not a D&amp;D rule.</li>
  <li><strong>foundry-dynamic-rings</strong> &mdash; Foundry Dynamic Token Rings &mdash; <a href="https://foundryvtt.com/article/dynamic-token-rings" rel="noreferrer noopener">https://foundryvtt.com/article/dynamic-token-rings</a> &mdash; Supports: 512-pixel subject suggestion for a single square. Not a platform minimum and not Tiny occupancy.</li>
  <li><strong>roll20-token-features</strong> &mdash; Roll20 Token Features &mdash; <a href="https://help.roll20.net/hc/en-us/articles/360039674573-Token-Features" rel="noreferrer noopener">https://help.roll20.net/hc/en-us/articles/360039674573-Token-Features</a> &mdash; Supports: a token dropped on a grid fits one unit. One unit = 70 px is Roll20 software, not D&amp;D law.</li>
  <li><strong>token-maker-home</strong> &mdash; Token Maker home &mdash; <a href="https://www.tokenmaker.one/" rel="noreferrer noopener">https://www.tokenmaker.one/</a> &mdash; Supports: optional crop after the source line. No kobold template.</li>
  <li><strong>token-maker-faq</strong> &mdash; Token Maker FAQ &mdash; <a href="https://www.tokenmaker.one/faq" rel="noreferrer noopener">https://www.tokenmaker.one/faq</a> &mdash; Supports: transparent PNG; designed for image-token VTTs; local-first ordinary editing. Not a VTT plugin.</li>
  <li><strong>token-maker-editor</strong> &mdash; Token Maker editor workspace &mdash; <a href="https://www.tokenmaker.one/#editor-workspace" rel="noreferrer noopener">https://www.tokenmaker.one/#editor-workspace</a> &mdash; Supports: optional PNG step after the lock. UI names from the public editor, not a live walkthrough.</li>
</ul>
`;

export const dndKoboldArticleHtmlZh = String.raw`
<p>DND <strong>狗头人（Kobold）</strong>是带鳞、小角的小龙类人，不是魔兽世界里顶蜡烛的那种，也不是龙裔。中文检索会同时甩出百科怪物介绍、<a href="https://trpgtdnd.weebly.com/vgm-293993895720154.html" rel="noreferrer noopener">《瓦罗的怪物指南》玩家页</a>，以及<a href="https://dnd.huijiwiki.com/wiki/%E7%8B%97%E5%A4%B4%E4%BA%BA" rel="noreferrer noopener">《魔邓肯巨献：多元宇宙的怪物》玩家页</a>。开团前先问 DM 这桌锁哪一页；不要把摇尾乞怜叠进龙吼。</p>
<p>你可能只想认清这是哪只，也可能已经要写玩家卡。两条路都先正名、再锁页。不想玩的人，认对外形并知道两页不能叠，就可以停。要写卡的人，把来源写在种族栏旁边，只抄锁定的那一页。</p>
<table>
  <thead>
    <tr>
      <th scope="col">你要拍板的事</th>
      <th scope="col">先看哪一页</th>
      <th scope="col">不要混进来的</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">认这是哪只</th>
      <td>外形说明和下面的五路对照</td>
      <td>魔兽蜡烛、炉石卡面、科博德、龙裔、地精</td>
    </tr>
    <tr>
      <th scope="row">写玩家卡</th>
      <td><a href="https://dnd.huijiwiki.com/wiki/%E7%8B%97%E5%A4%B4%E4%BA%BA" rel="noreferrer noopener">灰机魔邓肯页</a>，或<a href="https://dnd.huijiwiki.com/wiki/%E7%A7%8D%E6%97%8F/%E7%93%A6%E7%BD%97%E6%80%AA%E7%89%A9%E6%8C%87%E5%8D%97/%E7%8B%97%E5%A4%B4%E4%BA%BA" rel="noreferrer noopener">灰机瓦罗页</a> / <a href="https://trpgtdnd.weebly.com/vgm-293993895720154.html" rel="noreferrer noopener">VGM 狗頭人</a> / <a href="https://sites.google.com/view/izumi-dnd-5e/%E5%89%B5%E5%BB%BA%E8%A7%92%E8%89%B2/%E7%A8%AE%E6%97%8F/%E6%80%AA%E7%89%A9%E7%A8%AE%E6%97%8F/%E7%8B%97%E9%A0%AD%E4%BA%BA" rel="noreferrer noopener">泉媽團瓦罗页</a>，二选一</td>
      <td>另一页的特质名；2024 怪物块</td>
    </tr>
    <tr>
      <th scope="row">摆怪物</th>
      <td>2014 Kobold，或 2024 狗头人武者，二选一</td>
      <td>玩家页的摇尾乞怜 / 龙吼</td>
    </tr>
  </tbody>
</table>
<p>2024《玩家手册》核心十个 Species 没有狗头人；要玩须 DM 允许旧书，并先锁瓦罗还是魔邓肯。十个名字见<a href="${ZH_DND_RACES_PATH}" rel="noreferrer noopener">DND 种族指南</a>。</p>
<h2>为什么叫狗头人，现在长什么样</h2>
<p>中文桌主名就是<strong>狗头人</strong>。灰机、百度百科、维基的标题都用这个词；英文对照写 Kobold。繁体资料写狗頭人，指的是同一只。维基第一句还写「又称寇伯」，那是维基别称，灰机、百科和泉媽團都不用，卡面也不要改。</p>
<p>不要按狗脸去认。现在该按带鳞、小角的小龙类人来认。<a href="https://baike.baidu.com/item/%E7%8B%97%E5%A4%B4%E4%BA%BA/12810154" rel="noreferrer noopener">百度百科</a>写鳞片、乳白色小角、地底。<a href="https://dnd.huijiwiki.com/wiki/%E7%8B%97%E5%A4%B4%E4%BA%BA" rel="noreferrer noopener">灰机魔邓肯页</a>的风味写成：多元宇宙中最小的龙类生物，鳞片通常铁锈色。这些不是威世智简体纸书原文。抄立绘时留下鳞片和小角；圆形棋子上也要留下这两处，不要裁成狗嘴或蜡烛矿工。</p>
<p>跟龙的关系可以记成：小龙类人，资料里常写成龙的仆役或崇拜者，<strong>不是</strong><a href="${ZH_DND_DRAGONBORN_PATH}" rel="noreferrer noopener">龙裔</a>。龙裔是玩家手册里的龙血两足，块头更大、角更龙。侧栏里两者会并列出现，并列不等于可以画成同一张脸。</p>
<p>神名只需记住一对译法：资料站常见<strong>库尔图马克</strong>，百科和维基作<strong>克图玛</strong>，都指向 Kurtulmak。不要并成第三个神，也不要靠神名去叠玩家特质。</p>
<p><a href="https://zh.wikipedia.org/zh-cn/%E7%8B%97%E9%A0%AD%E4%BA%BA_(%E9%BE%8D%E8%88%87%E5%9C%B0%E4%B8%8B%E5%9F%8E)" rel="noreferrer noopener">维基</a>另有一段形象变迁：人头改为狗头，渐渐演变成鳄鱼头。条目自己标明缺来源。最多把它当成维基对画风变化的描述，不要写成官方沿革，更不要据此把立绘画回狗脸。</p>
<h2>先划开五只会搜进来的名字</h2>
<p>检索「狗头人」时，中文结果不会只给你第五版这只 Kobold。先用外形和用词划开下面五路。划开之后，再决定要不要写玩家卡。</p>
<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_KOBOLD_CHARACTER_IMAGE_PATHS.study}"
    alt="一名橙棕色鳞片狗头人角色身穿棕色布衣，站立并将双手合于胸前，侧头凝视，背景简洁深色"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>橙棕色鳞片狗头人角色站立图：双手合于胸前，侧头凝视。</figcaption>
</figure>
<p>图只承担认脸。蜡烛矿工和龙裔角一眼能分开；炉石卡面、科博德这个音译、DOTA 那只，外形不好塞进同一格，用下表认词。</p>
<table>
  <thead>
    <tr>
      <th scope="col">会搜进来的</th>
      <th scope="col">一眼或一词分开</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">魔兽世界狗头人</th>
      <td>顶蜡烛的矿工鼠人，不是带鳞小龙。立绘一旦出现蜡烛和矿镐，就认成魔兽，不是这只。</td>
    </tr>
    <tr>
      <th scope="row">炉石传说狗头人</th>
      <td>卡牌和炉石设定。那些页可以帮你认卡面，不能当 5e 玩家页来抄特质。</td>
    </tr>
    <tr>
      <th scope="row">德语矿坑精灵 / 科博德</th>
      <td>民间精灵，或被写成哥布林同类。中文桌不要用科博德当 DND 主名；卡面写狗头人，对照 Kobold。</td>
    </tr>
    <tr>
      <th scope="row">龙裔 Dragonborn</th>
      <td>玩家手册里的龙血两足，更大、角更龙，不是这只小型狗头人。详见<a href="${ZH_DND_DRAGONBORN_PATH}" rel="noreferrer noopener">龙裔专文</a>。</td>
    </tr>
    <tr>
      <th scope="row">地精 / 哥布林</th>
      <td>另一类类人。泉媽團把狗頭人和哥布林并列在怪物種族，那是列表相邻，不是同一条目。</td>
    </tr>
  </tbody>
</table>
<p>百度相关搜索里还有 DOTA 狗头人，同样不是第五版这只。Google 相关搜索会把你带去蜥蜴人、蛇人、龟人、天狗：那是别的 DND 种族，不是狗头人变体。</p>
<h2>要写卡就先锁：瓦罗还是魔邓肯</h2>
<p>中文桌口头仍说种族。卡面术语跟锁的书走：瓦罗写成 Race；2024 桌若沿用旧选项，按桌上约定写成 Race 或 Species。两套玩家写法最大的分歧不是「像不像蜥蜴」，而是<strong>摇尾乞怜 / 集群战术 / 日照敏感</strong>和<strong>龙吼 / 狗头人遗产</strong>不是同一页。把来源写在种族栏旁边，只抄那一页的特质名。</p>
<p>本站<a href="${ZH_DND_KENKU_PATH}" rel="noreferrer noopener">天狗文</a>也是先问瓦罗还是魔邓肯。</p>
<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_KOBOLD_CHARACTER_IMAGE_PATHS.alert}"
    alt="一名橙棕色鳞片狗头人角色身穿棕色布衣，低身蹲伏并抬起一只手，背景简洁深色"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>橙棕色鳞片狗头人角色低身警戒姿态，一只手抬起。</figcaption>
</figure>
<p>图只用来看见两页不能叠。力量 -2 和官方勘误不要从图里读。精确对照用下表。</p>
<table>
  <thead>
    <tr>
      <th scope="col">对照项</th>
      <th scope="col">瓦罗（中文资料站页）</th>
      <th scope="col">魔邓肯（灰机总页 + 官方介绍文）</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">中文页例子</th>
      <td><a href="https://dnd.huijiwiki.com/wiki/%E7%A7%8D%E6%97%8F/%E7%93%A6%E7%BD%97%E6%80%AA%E7%89%A9%E6%8C%87%E5%8D%97/%E7%8B%97%E5%A4%B4%E4%BA%BA" rel="noreferrer noopener">灰机瓦罗页</a>、<a href="https://trpgtdnd.weebly.com/vgm-293993895720154.html" rel="noreferrer noopener">VGM</a>、<a href="https://sites.google.com/view/izumi-dnd-5e/%E5%89%B5%E5%BB%BA%E8%A7%92%E8%89%B2/%E7%A8%AE%E6%97%8F/%E6%80%AA%E7%89%A9%E7%A8%AE%E6%97%8F/%E7%8B%97%E9%A0%AD%E4%BA%BA" rel="noreferrer noopener">泉媽團</a></td>
      <td><a href="https://dnd.huijiwiki.com/wiki/%E7%8B%97%E5%A4%B4%E4%BA%BA" rel="noreferrer noopener">灰机「狗头人 Kobold」</a>，来源写魔邓肯</td>
    </tr>
    <tr>
      <th scope="row">标志能力</th>
      <td>摇尾乞怜；集群战术；日照敏感</td>
      <td>龙吼（附赠动作）；狗头人遗产三选一</td>
    </tr>
    <tr>
      <th scope="row">属性加值</th>
      <td>资料站仍常见敏捷 +2、力量 -2；<a href="https://www.dndbeyond.com/sources/dnd/sae/volos-guide-to-monsters" rel="noreferrer noopener">官方勘误</a>改为只有敏捷 +2</td>
      <td>浮动 +2/+1 或三个 +1（<a href="https://www.dndbeyond.com/posts/1248-exploring-the-new-goblin-hobgoblin-and-kobold" rel="noreferrer noopener">D&amp;D Beyond 介绍文</a>；身高体重以桌上的书为准）</td>
    </tr>
    <tr>
      <th scope="row">阵营特质</th>
      <td>资料站常写守序偏邪恶；官方勘误删除 Alignment 特质</td>
      <td>介绍文走通用新种族，不要从瓦罗补一条阵营特质</td>
    </tr>
    <tr>
      <th scope="row">日照敏感</th>
      <td>有</td>
      <td>介绍文新特质清单未列入</td>
    </tr>
  </tbody>
</table>
<p>灰机和 VGM 是社区译文，不是威世智简体官方纸书。龙吼、遗产的规则转述以介绍文为上限。设计示例（不是某次跑团记录）：卡上同时出现摇尾乞怜和龙吼，这张卡失败，删掉其中一页再抄。</p>
<h3>瓦罗这一页有什么、没有什么</h3>
<p>锁瓦罗时，繁体页写成搖尾乞憐、群體戰術、陽光敏感性，对应表里那一组。看见龙吼或狗头人遗产，说明你把魔邓肯叠进来了。</p>
<p>集群战术：盟友在目标 5 尺内且未失能时，攻击检定优势。2014 怪物块也有同名能力。玩家瓦罗有这项；魔邓肯玩家改成龙吼。不要把怪物块和玩家页合成一条，也不要因为怪物后来仍保留集群战术，就给魔邓肯玩家再加一次。</p>
<p>日照敏感跟瓦罗页走。锁了瓦罗，这项留在卡上。</p>
<h3>魔邓肯这一页换成了什么</h3>
<p>锁魔邓肯，标志能力换成<strong>龙吼</strong>和<strong>狗头人遗产</strong>。<a href="https://www.dndbeyond.com/posts/1248-exploring-the-new-goblin-hobgoblin-and-kobold" rel="noreferrer noopener">D&amp;D Beyond 介绍文</a>写明龙吼有这四项：奖励动作；你与盟友获得攻击优势；次数等于熟练加值，长休恢复；不要求盟友站在目标 5 尺内。灰机把这项写成龙吼，并标成附赠动作。精确距离和对象以桌上魔邓肯那一页为准。</p>
<p>狗头人遗产三选一。灰机写成狡猾 / 反抗 / 龙族术法，对照介绍文分别是：指定技能熟练；对抗frightened 的豁免优势；一个术士戏法。介绍文点名的技能范围是奥秘、调查、医药、巧手、生存当中一项。三选一只要一项，不要三项全抄。</p>
<p>这一页<strong>不要</strong>再抄摇尾乞怜、集群战术。锁魔邓肯就只写介绍文和灰机这一页上有的名字，缺的那一行不要用瓦罗填。</p>
<p>灰机魔邓肯页可见：类人、小型、速度 30 尺、黑暗视觉 60 尺。这是灰机该页上的字段，以桌上的书为准。</p>
<h3>中文瓦罗页仍印力量 -2</h3>
<p><a href="https://trpgtdnd.weebly.com/vgm-293993895720154.html" rel="noreferrer noopener">VGM 狗頭人</a>、<a href="https://sites.google.com/view/izumi-dnd-5e/%E5%89%B5%E5%BB%BA%E8%A7%92%E8%89%B2/%E7%A8%AE%E6%97%8F/%E6%80%AA%E7%89%A9%E7%A8%AE%E6%97%8F/%E7%8B%97%E9%A0%AD%E4%BA%BA" rel="noreferrer noopener">泉媽團</a>和灰机瓦罗页仍常见敏捷 +2、力量 -2。这是印本和中文转录还在用的写法。</p>
<p><a href="https://www.dndbeyond.com/sources/dnd/sae/volos-guide-to-monsters" rel="noreferrer noopener">官方瓦罗勘误</a>把属性改为只有敏捷 +2，并删除 Alignment 特质。中文页上的「守序偏邪恶」如果是当作种族特质印着，勘误后这一条不再跟官方走。</p>
<p>读者动作只有一问：这桌跟印本还是跟勘误。跟印本，力量 -2 可以留，但要标明来自中文瓦罗页印本，不要写成「现在官方还在用」。跟勘误，力量惩罚去掉，阵营特质也去掉。不要把力量 -2 写成「5e 官方现用」却不提勘误。</p>
<p>中文检索还能看到 Reddit 机翻帖在讨论力量惩罚和装可怜。那只说明有人纠结过手感，<strong>不能当规则</strong>。该机翻还把后来的遗产说成哥布林特质，禁止沿用。</p>
<h3>2024 核心十个 Species 没有狗头人</h3>
<p>2024《玩家手册》核心十个 Species 是：Aasimar、Dragonborn、Dwarf、Elf、Gnome、Goliath、Halfling、Human、Orc、Tiefling。名单里没有狗头人。横向比较见<a href="${ZH_DND_RACES_PATH}" rel="noreferrer noopener">种族指南</a>。</p>
<p><a href="https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook" rel="noreferrer noopener">D&amp;D Beyond 介绍文</a>写明：旧书物种仍可用；2024 属性加值改由背景提供。该说明只处理加值，没有作废瓦罗或魔邓肯的标志能力。2024 桌要玩狗头人，先问仍锁瓦罗还是魔邓肯：锁瓦罗就留日照敏感和摇尾乞怜，锁魔邓肯就留龙吼和遗产。</p>
<p>不要把旧种族的敏捷 +2 叠进背景加值。设计示例（不是跑团记录）：2024 桌已经按背景填了 +2/+1，又把瓦罗印本的敏捷 +2、力量 -2 再抄一遍，加值叠错。锁瓦罗时，标志能力仍按瓦罗；加值按 2024 背景走。也不要写成「2024 完全不能玩狗头人」，或「2024 已有核心狗头人页」。</p>
<h2>怪物页是另一条分叉，不要抄进玩家卡</h2>
<p>百科和怪物块不是玩家种族页。你手里如果是百科的守序邪恶、克图玛、陷阱风味，或是一张 2014 / 2024 怪物统计块，改走怪物轴，不要填进玩家种族栏。</p>
<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_KOBOLD_CHARACTER_IMAGE_PATHS.ready}"
    alt="一名橙棕色鳞片狗头人角色身穿棕色布衣，站立时双臂自然垂下，背景简洁深色"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>橙棕色鳞片狗头人角色站立待命图，双臂自然垂下。</figcaption>
</figure>
<p>两轴中间没有「通用狗头人」。挑战等级两版都是 1/8，CR 未变不等于统计块未变。AC、生命值、武器和日光敏感范围看下表，不要从图里读数字。</p>
<table>
  <thead>
    <tr>
      <th scope="col">字段</th>
      <th scope="col">2014 / SRD 5.1 Kobold</th>
      <th scope="col">2024 / SRD 5.2.1 狗头人武者</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">条目名</th>
      <td>Kobold</td>
      <td>Kobold Warrior（社区：狗头人武者）</td>
    </tr>
    <tr>
      <th scope="row">类型</th>
      <td>Small Humanoid (kobold)</td>
      <td>Small Dragon</td>
    </tr>
    <tr>
      <th scope="row">阵营</th>
      <td>守序邪恶</td>
      <td>中立</td>
    </tr>
    <tr>
      <th scope="row">集群战术</th>
      <td>有</td>
      <td>仍有（这是怪物能力，不是魔邓肯玩家能力）</td>
    </tr>
    <tr>
      <th scope="row">日光敏感</th>
      <td>攻击 + 依赖视觉的感知（察觉）劣势</td>
      <td>能力检定 + 攻击都劣势，范围更宽</td>
    </tr>
    <tr>
      <th scope="row">CR</th>
      <td>1/8</td>
      <td>仍 1/8（CR 未变 ≠ 统计块未变）</td>
    </tr>
  </tbody>
</table>
<p>社区把 2024 这条写成<strong>狗头人武者</strong>。这是通行写法，不是已核验的威世智简体纸书译名。玩家种族栏不要写这个条目名。</p>
<p>2014 有匕首和投石索；2024 武者是三把匕首、无投石索。护甲等级和生命值从 12 与 5 变为 14 与 7。完整骰子公式不必抄进玩家卡。第三方 wiki 给 2024 武者写 Frightened 免疫：官方怪物页没有这一行，不要采用。</p>
<p>百科上的守序邪恶、克图玛、陷阱风味是旧设定介绍，不是 5e 玩家特质，也不是 2024 武者页。设计示例（不是跑团记录）：玩家种族栏抄「Dragon、中立、狗头人武者」，走错轴了。那是 2024 怪物字段。玩家要么抄瓦罗，要么抄魔邓肯；怪物再另锁 2014 Kobold 或 2024 狗头人武者。</p>
<p>上桌前核这五条：</p>
<ol>
  <li>卡面或口头是狗头人（Kobold），不是科博德、不是蜡烛、不是龙裔。</li>
  <li>玩家来源只写了瓦罗，或只写了魔邓肯。</li>
  <li>没有同卡叠摇尾乞怜和龙吼。</li>
  <li>没有把 2024 武者的 Dragon / 中立抄进玩家种族栏。</li>
  <li>抄瓦罗印本时，力量 -2 有没有问过勘误。</li>
</ol>
<p>五条都过，这只 DND 狗头人可以上桌说话。还没决定玩的人，前两条过就够认对。</p>
<p>本页是 unofficial 同人介绍，不是威世智官方页面，也不用《龙与地下城》商标冒充官方。怪物要点按 SRD 复述；玩家页按中文资料站和官方介绍文转述，以你锁的书页为准。</p>
<h2>Sources</h2>
<ul>
  <li><a href="https://dnd.huijiwiki.com/wiki/%E7%8B%97%E5%A4%B4%E4%BA%BA" rel="noreferrer noopener">灰机wiki：狗头人 Kobold</a> — 魔邓肯玩家页：龙吼、狗头人遗产；风味写最小的龙类生物、铁锈色鳞；社区译文</li>
  <li><a href="https://dnd.huijiwiki.com/wiki/%E7%A7%8D%E6%97%8F/%E7%93%A6%E7%BD%97%E6%80%AA%E7%89%A9%E6%8C%87%E5%8D%97/%E7%8B%97%E5%A4%B4%E4%BA%BA" rel="noreferrer noopener">灰机wiki：种族 / 瓦罗怪物指南 / 狗头人</a> — 摇尾乞怜、集群战术、日照敏感；社区译文</li>
  <li><a href="https://trpgtdnd.weebly.com/vgm-293993895720154.html" rel="noreferrer noopener">D&amp;D 5E 中文化：VGM 狗頭人</a> — 繁体瓦罗页，仍印敏捷 +2 / 力量 -2</li>
  <li><a href="https://sites.google.com/view/izumi-dnd-5e/%E5%89%B5%E5%BB%BA%E8%A7%92%E8%89%B2/%E7%A8%AE%E6%97%8F/%E6%80%AA%E7%89%A9%E7%A8%AE%E6%97%8F/%E7%8B%97%E9%A0%AD%E4%BA%BA" rel="noreferrer noopener">泉媽團：狗頭人 Kobold</a> — 瓦罗怪物種族页；神名库尔图马克；仍印力量 -2</li>
  <li><a href="https://baike.baidu.com/item/%E7%8B%97%E5%A4%B4%E4%BA%BA/12810154" rel="noreferrer noopener">百度百科：狗头人</a> — 外文名 Kobold；鳞片与乳白色小角；守护神克图玛；旧设定介绍，不是 5e 玩家页</li>
  <li><a href="https://zh.wikipedia.org/zh-cn/%E7%8B%97%E9%A0%AD%E4%BA%BA_(%E9%BE%8D%E8%88%87%E5%9C%B0%E4%B8%8B%E5%9F%8E)" rel="noreferrer noopener">维基百科：狗头人 (龙与地下城)</a> — 主名狗头人；又称寇伯；克图玛；形象变迁段自陈缺来源</li>
  <li><a href="https://www.dndbeyond.com/posts/1248-exploring-the-new-goblin-hobgoblin-and-kobold" rel="noreferrer noopener">D&amp;D Beyond：Exploring the New Goblin, Hobgoblin, and Kobold Races</a> — 瓦罗有集群战术、日照敏感、摇尾乞怜；魔邓肯改为龙吼与狗头人遗产；浮动加值</li>
  <li><a href="https://www.dndbeyond.com/sources/dnd/sae/volos-guide-to-monsters" rel="noreferrer noopener">D&amp;D Beyond：Volo’s Guide to Monsters Sage Advice &amp; Errata</a> — 属性改为只有敏捷 +2；删除 Alignment 特质</li>
  <li><a href="https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook" rel="noreferrer noopener">D&amp;D Beyond：The 10 Species in the 2024 Player’s Handbook</a> — 核心十 Species 无狗头人；旧物种仍可用；加值改由背景提供</li>
  <li><a href="https://media.dndbeyond.com/compendium-images/srd/5.1/SRD_CC_v5.1.pdf" rel="noreferrer noopener">SRD 5.1（CC-BY）Kobold</a> — 2014 怪物：Small Humanoid、守序邪恶、集群战术、较窄日光敏感、匕首与投石索</li>
  <li><a href="https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf" rel="noreferrer noopener">SRD 5.2.1（CC-BY）Kobold Warrior</a> — 2024 怪物：Small Dragon、中立、加宽日光敏感、三匕首</li>
  <li><a href="https://www.dndbeyond.com/monsters/16939-kobold" rel="noreferrer noopener">D&amp;D Beyond：2014 Kobold</a> — 与 SRD 5.1 对照的 2014 怪物页</li>
  <li><a href="https://www.dndbeyond.com/monsters/5195096-kobold-warrior" rel="noreferrer noopener">D&amp;D Beyond：Kobold Warrior</a> — 2024 怪物页；官方页无 Frightened 免疫</li>
  <li><a href="https://www.reddit.com/r/DnD/comments/n60scu/how_do_people_feel_about_the_5e_kobolds/?tl=zh-hans" rel="noreferrer noopener">Reddit 机翻：大家对5e的狗头人有什么看法？</a> — 中文检索可见瓦罗手感讨论；机翻不当规则</li>
  <li><a href="https://company.wizards.com/en/legal/fancontentpolicy" rel="noreferrer noopener">Wizards of the Coast Fan Content Policy</a> — unofficial 同人页；不用官方商标冒充官方</li>
  <li><a href="${ZH_DND_RACES_PATH}" rel="noreferrer noopener">本站：DND 种族怎么选</a> — 2024 核心十 Species 不含狗头人</li>
  <li><a href="${ZH_DND_DRAGONBORN_PATH}" rel="noreferrer noopener">本站：DND 龙裔</a> — 划开龙裔</li>
  <li><a href="${ZH_DND_KENKU_PATH}" rel="noreferrer noopener">本站：DND 天狗 Kenku</a> — 同类先问瓦罗还是魔邓肯</li>
</ul>
`;
