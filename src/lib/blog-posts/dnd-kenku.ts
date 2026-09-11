import {
  DND_2024_CHARACTER_CREATION_URL,
  DND_2024_CHARACTER_ORIGINS_URL,
  DND_2024_CREATE_CHARACTER_POST_URL,
  DND_BEYOND_SPECIES_INDEX_URL,
  DND_KENKU_2014_AIDEDD_URL,
  DND_KENKU_2024_AIDEDD_URL,
  DND_KENKU_2024_ROLL20_URL,
  DND_KENKU_BOOK_LOCK_IMAGE_PATH,
  DND_KENKU_HUIJI_MOTM_URL,
  DND_KENKU_HUIJI_VOLO_URL,
  DND_KENKU_NAME_COLLISION_ZH_IMAGE_PATH,
  DND_KENKU_SPEECH_LOCK_ZH_IMAGE_PATH,
  DND_KENKU_TOKEN_BEAK_ZH_IMAGE_PATH,
  DND_KENKU_TOKEN_CROP_IMAGE_PATH,
  DND_KENKU_VS_AARAKOCRA_IMAGE_PATH,
  DND_KENKU_WIKIDOT_LINEAGE_URL,
  DND_RACES_2024_SPECIES_OVERVIEW_URL,
  DND_VOLO_ERRATA_URL,
  EN_DICE_ROLLER_PATH,
  EN_DND_CLASSES_PATH,
  EN_DND_DRAGONBORN_PATH,
  EN_DND_RACES_PATH,
  EN_EDITOR_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_DND_LANGUAGES_PATH,
  ZH_DND_RACES_PATH,
  ZH_EDITOR_PATH,
  ZH_SQUARE_TOKEN_MAKER_PATH,
} from './shared';

export const dndKenkuArticleHtml = String.raw`
<p>A <strong>dnd kenku</strong> is a 5e raven-person you copy from <em>Volo&rsquo;s Guide to Monsters</em> (D&amp;D Beyond still marks that block Legacy) or from <em>Mordenkainen Presents: Monsters of the Multiverse</em>, not from the 2024 <em>Player&rsquo;s Handbook</em> species list. On the unofficial <a href="${DND_KENKU_WIKIDOT_LINEAGE_URL}" rel="noreferrer noopener">Kenku lineage transcription</a>, Volo&rsquo;s Kenku can speak only through Mimicry, while MotM Kenku can speak, read, and write Common plus one other language, with Mimicry still a separate sound-copying trait; confirm those language lines against printed Volo&rsquo;s or MotM. Crop the token as a wingless raven-person with the beak and head feathers inside the circle, not as an aarakocra with flyable wings.</p>

<p>This page is the one-race job after you already decided to play a Kenku. If you still need the 2024 core species list, use the <a href="${EN_DND_RACES_PATH}" rel="noreferrer noopener">DnD races and species guide</a> first: that list has no Kenku. The work here is narrower. Ask the DM which Kenku page is legal, copy that page onto the sheet, then crop a portrait that still reads as Kenku at token size.</p>

<table>
  <thead>
    <tr>
      <th>Need-to-know point</th>
      <th>Fast answer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>What is a dnd kenku?</strong></td>
      <td>A wingless, bipedal raven-person whose playable traits come from Volo&rsquo;s or MotM, not from the 2024 PHB core ten.</td>
    </tr>
    <tr>
      <td><strong>Which book?</strong></td>
      <td>Volo&rsquo;s (D&amp;D Beyond Legacy): +2 Dex / +1 Wis, Expert Forgery, Kenku Training, Mimicry. MotM (current index): Expert Duplication, Kenku Recall, Mimicry. 2024 table: MotM trait names + background score increases; ignore the old species ASI. If the table uses a Wildemount Kenku page, check that printed book; this page only locks the two index entries.</td>
    </tr>
    <tr>
      <td><strong>Can it speak?</strong></td>
      <td>The free D&amp;D Beyond index does not print a Kenku Languages line. Unofficial lineage transcription: Volo&rsquo;s player speaks only by Mimicry; MotM player can speak, read, and write Common plus one other language, with Mimicry still a tool. Confirm on printed Volo&rsquo;s or MotM. 2014 MM monster: only by Mimicry. 2024 MM monster: language line lists Common and Primordial (Auran); the lore paragraph still describes mimic-only vocal communication.</td>
    </tr>
    <tr>
      <td><strong>Mimicry check</strong></td>
      <td>The index lists the trait name only. Unofficial lineage transcription: Volo&rsquo;s player is Wisdom (Insight) opposed by your Charisma (Deception); MotM player is Insight against DC 8 + proficiency bonus + Charisma modifier. Confirm on the printed page you locked. Monster (2014 and 2024): DC 14 Insight.</td>
    </tr>
    <tr>
      <td><strong>Skill package</strong></td>
      <td>Index names: Kenku Training (Volo&rsquo;s) vs Kenku Recall (MotM). Unofficial lineage transcription: Training is two skills from Acrobatics, Deception, Stealth, Sleight of Hand; Recall is any two skills plus limited advantage uses. Confirm on print.</td>
    </tr>
    <tr>
      <td><strong>Size</strong></td>
      <td>Not on the free index. Unofficial lineage transcription: Volo&rsquo;s Medium only; MotM Medium or Small, chosen when you select the race. Confirm on print.</td>
    </tr>
    <tr>
      <td><strong>Darkvision on the PC?</strong></td>
      <td>No. Neither Volo&rsquo;s nor MotM lists Darkvision. The 2024 MM Kenku monster has Darkvision 60 feet; do not copy that onto a player.</td>
    </tr>
    <tr>
      <td><strong>Token cue</strong></td>
      <td>Beak and head feathers inside the frame. No flyable wings. Not an aarakocra silhouette.</td>
    </tr>
  </tbody>
</table>

<h2>Lock the Kenku book first</h2>

<p>A Kenku sheet that mixes books is the usual failure. Speech, Mimicry math, the skill package, size, and ability scores each belong to one writeup. Ask the DM which source is legal, write that source next to Race or Species, and copy only that block.</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_KENKU_BOOK_LOCK_IMAGE_PATH}"
    alt="Two-column lock diagram: Volo&rsquo;s mute Kenku traits on the left, MotM speaking Kenku traits on the right, and a center column that says ask the DM and do not mix the two pages"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Left column is Volo&rsquo;s. Right column is MotM. The center column is the DM lock. Copy one column onto the sheet, not both.</figcaption>
</figure>

<p>Write one source line in the margin before you touch a trait. Example source lines:</p>

<ul>
  <li><code>Race: Kenku (Volo&rsquo;s Guide to Monsters, Legacy)</code></li>
  <li><code>Species: Kenku (Monsters of the Multiverse)</code></li>
  <li><code>Species: Kenku (MotM traits; 2024 background ASI)</code></li>
</ul>

<p>Those three lines are not interchangeable. The D&amp;D Beyond species index lists only those two Kenku entries: Volo&rsquo;s (Legacy) and MotM. If the table uses a Wildemount Kenku page, check that printed book; this page does not treat Wildemount as a third verified lock. MotM is the later official player rewrite on the index. A 2024 table that allows older species still does not print Kenku in the 2024 PHB. The <a href="${DND_RACES_2024_SPECIES_OVERVIEW_URL}" rel="noreferrer noopener">official 10 species overview</a> lists Aasimar, Dragonborn, Dwarf, Elf, Gnome, Goliath, Halfling, Human, Orc, and Tiefling. Kenku is not on that list. The <a href="${DND_2024_CHARACTER_ORIGINS_URL}" rel="noreferrer noopener">2024 Character Origins</a> free species chapter is the same story: no Kenku.</p>

<h3>Three legal locks, one sheet</h3>

<p><strong>Lock A — 2014-era table, Volo&rsquo;s.</strong> Copy the Volo&rsquo;s player traits. The <a href="${DND_BEYOND_SPECIES_INDEX_URL}" rel="noreferrer noopener">D&amp;D Beyond species index</a> lists that Legacy block as +2 Dexterity, +1 Wisdom, Expert Forgery, Kenku Training, and Mimicry. It does not print size, speed, or a Languages line. The unofficial <a href="${DND_KENKU_WIKIDOT_LINEAGE_URL}" rel="noreferrer noopener">Kenku lineage transcription</a> gives Volo&rsquo;s as Medium, walking speed 30 feet, and Languages: read and write Common and Auran, speak only by using Mimicry. Confirm those extra lines on printed Volo&rsquo;s Kenku traits (errata titles that block at p. 111) or on the table&rsquo;s owned sheet.</p>

<p><strong>Lock B — 2014-era table, MotM.</strong> Copy the MotM player traits. The public index lists Expert Duplication, Kenku Recall, and Mimicry. It does not print creature type, size, speed, score increases, a Languages line, or a Mimicry DC. The unofficial <a href="${DND_KENKU_WIKIDOT_LINEAGE_URL}" rel="noreferrer noopener">Kenku lineage transcription</a> gives MotM Kenku as Humanoid; Medium or Small, chosen when you select the race; walking speed 30 feet; +2 / +1 or three +1s; and speak, read, and write Common plus one other language you and the DM agree on, with Mimicry still a separate trait. Confirm those lines on printed MotM. The MotM Kenku full trait page on D&amp;D Beyond is not a free page; copy from the printed MotM Kenku entry or from a sheet the table already owns.</p>

<p><strong>Lock C — 2024 table, older species allowed.</strong> Use MotM Kenku traits for the species identity, then follow the 2024 conversion sidebar as quoted in <a href="${DND_2024_CREATE_CHARACTER_POST_URL}" rel="noreferrer noopener">How to Create a Character Using the 2024 Player&rsquo;s Handbook</a>: ignore Ability Score Increases from the older species, and take the +2 / +1 or three +1s from the background instead. The <a href="${DND_2024_CHARACTER_CREATION_URL}" rel="noreferrer noopener">2024 Creating a Character</a> chapter is the same chassis: after you assign scores, adjust them according to background. A background lists three scores; increase one by 2 and another by 1, or increase all three by 1, none above 20.</p>

<p>Lock C does not print a Kenku species in the 2024 PHB. It is MotM Kenku brought onto a 2024 sheet. The conversion sidebar does <strong>not</strong> say it deletes a mute Languages line. If a 2024 table wants the mute raven-person from the unofficial Volo&rsquo;s transcription, name Volo&rsquo;s as the species source, still ignore the old +2 Dex / +1 Wis, and ask the DM whether that &ldquo;speak only by Mimicry&rdquo; line still applies on printed Volo&rsquo;s. Do not invent a house ruling and call it 2024 core.</p>

<h3>Do not mix the two player pages</h3>

<p>The illegal mix is Volo&rsquo;s mute Languages line from the unofficial transcription plus MotM Kenku Recall (or MotM&rsquo;s transcribed size choice, or MotM&rsquo;s transcribed Mimicry DC). The other illegal mix is MotM&rsquo;s transcribed &ldquo;can speak Common&rdquo; plus Volo&rsquo;s Kenku Training plus Volo&rsquo;s fixed +2 Dex / +1 Wis on a 2024 sheet that already applied background ASI. Pick Lock A, B, or C. Copy that column. Stop.</p>

<p>The same rule applies to monster pages. The 2014 <em>Monster Manual</em> Kenku (errata points at p. 194) and the 2024 <em>Monster Manual</em> Kenku are NPC stat blocks. They share mimicry flavor with the player race. They are not the player package. Do not paste Darkvision, Monstrosity, Ambusher, Shadow Blade, or a CR onto a Kenku adventurer because a monster page had them.</p>

<h2>What a 5e Kenku is on the map</h2>

<p>On the board, a playable Kenku is a wingless raven-person: beak, raven coloration, head feathers, walking gait, no flyable wings. MotM&rsquo;s public index line puts them most often in the Shadowfell and on the Material Plane, with coloration typical of ravens. The Volo&rsquo;s index flavor says they were robbed of their wings. That is the silhouette strangers should read from across the table. The unofficial lineage transcription also prints MotM as a Medium or Small Humanoid with a 30-foot walk, and Volo&rsquo;s as Medium with a 30-foot walk; confirm size and speed on the printed page you locked.</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_KENKU_VS_AARAKOCRA_IMAGE_PATH}"
    alt="Unofficial comparison illustration: a wingless Kenku adventurer with a readable beak and head feathers beside a winged aarakocra in a flying pose"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Unofficial illustration, not Monster Manual art. 5e Kenku: no flyable wings. Aarakocra: birdfolk with wings in the silhouette. If the token could pass for either, recrop.</figcaption>
</figure>

<p>Kenku is not aarakocra with the serial numbers filed off. Aarakocra read as birdfolk who fly. Kenku read as raven-people who walk. The 5e player look you are locking is wingless. If a portrait has large flight wings, it is the wrong portrait for this race, even if the file name says kenku.</p>

<p>Kenku is also not the 2024 MM monster. That 2024 monster is a Medium Monstrosity, Neutral, with Darkvision 60 feet, speed 30 feet, and Languages Common and Primordial (Auran). The same 2024 entry&rsquo;s lore says the curse affecting kenku allows them to vocally communicate only by mimicking sounds they have heard, and that they can supernaturally re-create noises from crying babies to running water and short phrases in others&rsquo; voices. Keep those two sentences side by side. The language line no longer repeats the 2014 clause &ldquo;speaks only through Mimicry.&rdquo; The lore paragraph still describes mimic-only vocal communication. Neither sentence is a player-race trait block.</p>

<p>The 2014 MM Kenku is a Humanoid, chaotic neutral, with no Darkvision, and it understands Auran and Common but speaks only through Mimicry. Volo&rsquo;s later <a href="${DND_VOLO_ERRATA_URL}" rel="noreferrer noopener">Sage Advice &amp; Errata</a> removed the Alignment trait from the player Kenku Traits block. Do not write &ldquo;must be chaotic neutral&rdquo; on a player sheet. Monster default alignment is lore for that stat block, not a PC requirement after that errata.</p>

<p>MotM&rsquo;s index line starts from &ldquo;Whatever their true origin&rdquo; and does not lock a single stolen-voice origin. Do not paste a raven-queen calamity origin, or any other setting&rsquo;s fall-from-angels tale, onto a Forgotten Realms sheet and call it the 5e default.</p>

<h2>Copy the locked trait block</h2>

<p>Copy names and numbers from the locked page. Do not rebuild a &ldquo;best of both Kenku&rdquo; homebrew and label it official. The table below is the difference that actually changes the sheet.</p>

<table>
  <thead>
    <tr>
      <th>Sheet line</th>
      <th>Volo&rsquo;s player</th>
      <th>MotM player</th>
      <th>2024 table using MotM</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Score increases</td>
      <td>+2 Dexterity, +1 Wisdom (D&amp;D Beyond index)</td>
      <td>Unofficial lineage transcription: +2 / +1 or three +1s. Confirm on printed MotM</td>
      <td>Ignore the older species ASI. Background grants +2 / +1 or three +1s</td>
    </tr>
    <tr>
      <td>Creature type</td>
      <td>Not on the free index</td>
      <td>Unofficial lineage transcription: Humanoid. Confirm on print</td>
      <td>Confirm on printed MotM</td>
    </tr>
    <tr>
      <td>Size</td>
      <td>Unofficial lineage transcription: Medium only. Confirm on print</td>
      <td>Unofficial lineage transcription: Medium or Small, chosen at race selection. Confirm on print</td>
      <td>Same as printed MotM</td>
    </tr>
    <tr>
      <td>Speed</td>
      <td>Unofficial lineage transcription: 30 feet. Confirm on print</td>
      <td>Unofficial lineage transcription: 30 feet. Confirm on print</td>
      <td>Same as printed MotM</td>
    </tr>
    <tr>
      <td>Darkvision</td>
      <td>Not listed on the index</td>
      <td>Not listed on the index</td>
      <td>Not listed on the index</td>
    </tr>
    <tr>
      <td>Skill package</td>
      <td>Index name: Kenku Training. Unofficial lineage transcription: two from Acrobatics, Deception, Stealth, Sleight of Hand</td>
      <td>Index name: Kenku Recall. Unofficial lineage transcription: any two skills, plus limited advantage on proficient skill checks</td>
      <td>Same as printed MotM</td>
    </tr>
    <tr>
      <td>Copying trait</td>
      <td>Index name: Expert Forgery</td>
      <td>Index name: Expert Duplication</td>
      <td>Same as printed MotM</td>
    </tr>
    <tr>
      <td>Languages</td>
      <td>Index has no Languages line. Unofficial lineage transcription: read and write Common and Auran; speak only by Mimicry</td>
      <td>Index has no Languages line. Unofficial lineage transcription: speak, read, and write Common + 1</td>
      <td>2024 also knows Common + two from the Standard Languages table as part of character creation. That chapter does not print a ruling that deletes a mute line</td>
    </tr>
    <tr>
      <td>Mimicry tell</td>
      <td>Index has the name only. Unofficial lineage transcription: Insight opposed by your Deception</td>
      <td>Index has the name only. Unofficial lineage transcription: Insight vs DC 8 + PB + Cha</td>
      <td>Same as printed MotM</td>
    </tr>
    <tr>
      <td>Flight</td>
      <td>None on the index</td>
      <td>None on the index</td>
      <td>None on the index</td>
    </tr>
  </tbody>
</table>

<h3>Ability scores</h3>

<p>On a Volo&rsquo;s table, the Kenku ASI on the D&amp;D Beyond index is the reason a lot of sheets lean Dexterity classes. That is a 2014-era habit, not an official &ldquo;best class&rdquo; table. The unofficial MotM transcription prints a shared +2 / +1 (or three +1s) on the race block; confirm that on printed MotM. On a 2024 table, the <a href="${DND_2024_CHARACTER_CREATION_URL}" rel="noreferrer noopener">Creating a Character</a> chapter moves those increases onto background. Example: a 2024 Kenku Rogue takes a background that lists Dexterity among its three scores, raises Dexterity by 2 and a second listed score by 1, and still copies MotM Kenku traits for the raven-person identity. Do not also add Volo&rsquo;s +2 Dex / +1 Wis on top.</p>

<h3>Size and speed</h3>

<p>The free index does not print Kenku size or speed. The unofficial lineage transcription gives Volo&rsquo;s as Medium with a 30-foot walk, and MotM as Medium or Small (chosen when you select the race) with a 30-foot walk. Confirm those numbers on the printed page you locked. Small matters for squeezing, some riding and cover situations, and how much of a portrait fills a circular token. If the DM locked Volo&rsquo;s, you do not get a later Small option because MotM&rsquo;s transcription printed one. If the DM locked MotM, pick Medium or Small from that printed MotM block and keep that size on the token.</p>

<h3>Expert Forgery versus Expert Duplication</h3>

<p>The D&amp;D Beyond index lists the names <strong>Expert Forgery</strong> (Volo&rsquo;s) and <strong>Expert Duplication</strong> (MotM). It does not print the effect text. The unofficial lineage transcription gives both as advantage on checks to copy existing writing or craftwork. Neither auto-succeeds in that transcription. Neither copies a magic item&rsquo;s function. Do not write &ldquo;I duplicate a spell scroll and it still casts&rdquo; as a trait. Confirm the printed wording on the book you locked.</p>

<p>Volo&rsquo;s transcribed Forgery line: you can duplicate other creatures&rsquo; handwriting and craftwork, with advantage on checks to produce forgeries or duplicates of existing objects. MotM&rsquo;s transcribed Duplication line: when you copy writing or craftwork, advantage on checks to produce an exact duplicate. Use the name that matches the locked book, and copy the effect from print, not from the index.</p>

<p>Example, Volo&rsquo;s table: the party needs a harbor pass in a clerk&rsquo;s handwriting. You copy a pass you have already seen. If your printed Volo&rsquo;s page matches the transcription, you roll the relevant check with advantage from Expert Forgery. The DM still sets the DC. A failed check is a bad pass, not a free second trait.</p>

<p>Example, MotM table: you copy a guild stamp onto a second wax seal from a stamp you can see. If your printed MotM page matches the transcription, Expert Duplication gives advantage on the check to make an exact duplicate. It does not invent a stamp you never had.</p>

<h3>Kenku Training versus Kenku Recall</h3>

<p>The index names are <strong>Kenku Training</strong> (Volo&rsquo;s) and <strong>Kenku Recall</strong> (MotM). The index does not print a skill menu or a use count.</p>

<p>The unofficial lineage transcription gives Volo&rsquo;s Training as proficiency in two skills from Acrobatics, Deception, Stealth, and Sleight of Hand. You do not pick Arcana from that transcribed list. You do not pick all four.</p>

<p>The same transcription gives MotM Recall as proficiency in any two skills, plus a limited number of times per long rest you can give yourself advantage on a proficient skill check before you roll (uses equal to proficiency bonus). Confirm the printed MotM Kenku entry before you write a use count on the sheet.</p>

<p>Do not take Training&rsquo;s transcribed four-skill menu and Recall&rsquo;s transcribed advantage uses on the same character. The names are not synonyms.</p>

<h3>Languages, copied from the locked page</h3>

<p>The free D&amp;D Beyond Kenku index rows do not print a Languages line.</p>

<p>The unofficial lineage transcription for Volo&rsquo;s player: read and write Common and Auran; speak only by Mimicry. That is Lock A if printed Volo&rsquo;s matches. It is not &ldquo;all 5e Kenku.&rdquo;</p>

<p>The unofficial lineage transcription for MotM player: speak, read, and write Common and one other language chosen with the DM. Mimicry is still on the MotM Kenku trait list on the index. In that transcription it is not the only way that character can talk. Confirm on printed MotM.</p>

<p>2024 character creation, from the same Creating a Character chapter: you know Common plus two languages from the Standard Languages table; knowing a language means you can communicate in it, read it, and write it. Primordial includes the Auran dialect. That is the 2024 chassis. It does not, by itself, reprint a Kenku species, and the older-species sidebar only tells you to ignore old ASI. If you are on Lock C with MotM, treat speech as the printed MotM Kenku page plus that 2024 chassis. If you are on a 2024 table with Volo&rsquo;s Kenku, ask the DM about the transcribed mute line instead of declaring that 2024 silently deleted it.</p>

<h2>How Mimicry runs at the table</h2>

<p>On the 2014 and 2024 monster blocks, Mimicry is a trait, not an action. The unofficial player transcription also does not print an action cost; confirm the printed Kenku page you locked. What changes by book is how a listener tells the sound is fake, and whether the Kenku has any other way to talk.</p>

<h3>Volo&rsquo;s player: speech is Mimicry</h3>

<p>On Lock A, if printed Volo&rsquo;s matches the unofficial lineage transcription, every spoken sentence is a sound you have heard. That transcription says you can mimic voices and other sounds, and a creature that hears those sounds can tell they are imitations with a successful Wisdom (Insight) check opposed by your Charisma (Deception) check. There is no fixed DC in that Volo&rsquo;s player line. When the table needs dice, the <a href="${EN_DICE_ROLLER_PATH}" rel="noreferrer noopener">DnD dice roller</a> is enough for that opposed pair. The token editor does not contain Kenku language rules.</p>

<p>Keep a short heard-sound list in the margin so the table does not freeze. Example list after two town scenes: a dock bell, a sergeant&rsquo;s &ldquo;Hold the gate,&rdquo; a market seller&rsquo;s &ldquo;Two for a silver,&rdquo; a crying baby from an alley, bootsteps on wet stone. Use sounds this character has actually heard in play or in backstory the DM accepted.</p>

<p>Example scene, Volo&rsquo;s: a guard asks who goes there. You do not invent a new sentence in &ldquo;your own voice.&rdquo; You fire the sergeant&rsquo;s &ldquo;Hold the gate&rdquo; plus the dock bell if you want noise, or you stitch overheard phrases the DM already put in the world. If the guard might notice the fake, the DM calls Insight versus your Deception. A success on the Insight side means the guard can tell the voice is an imitation. It does not automatically mean the guard knows who you are.</p>

<p>Do not stall a whole session on one joke replay of the same clang. The mute rule is a communication constraint, not a permission to turn every check into a soundboard. If the table is wasting minutes hunting for the perfect clip, answer in the shortest heard phrase you already have and move the scene.</p>

<p>Official Kenku traits do not ban spellcasting. The 2024 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/spells" rel="noreferrer noopener">verbal component rules</a> require esoteric words uttered in a normal speaking voice, with a specific pitch and resonance. A gagged creature, or a creature in magical silence, cannot provide that. The Kenku pages do not say Mimicry blocks verbal components, and they do not say you must have heard the exact spell text before you can cast. Do not add that extra lock unless the DM writes it as a table rule.</p>

<h3>MotM player: speech plus Mimicry as a tool</h3>

<p>On Lock B or Lock C, if printed MotM matches the unofficial lineage transcription, you can talk. Mimicry is still on the MotM index as a trait name. That transcription says you can accurately mimic sounds you have heard, including voices, and a listener can tell they are imitations only with a successful Wisdom (Insight) check against DC 8 + your proficiency bonus + your Charisma modifier. Confirm that DC on the printed MotM Kenku entry before you treat the number as locked.</p>

<p>Example scene, MotM: you can tell the innkeeper, in Common, that you want two rooms. Later, in the alley, you mimic the watch captain&rsquo;s voice to pull a sentry off a door. The innkeeper talk does not require Mimicry. The alley voice does, and the sentry&rsquo;s Insight is against that transcribed MotM DC if the DM asks whether the voice sounds fake.</p>

<p>MotM Mimicry is easy to underuse (you just talk, and the trait sits idle) or to overuse (you never talk, even though the transcribed MotM Languages line lets you). Use it when a copied sound would change a scene. Do not play a MotM Kenku as if Volo&rsquo;s mute line were still on the sheet.</p>

<h3>Monster Mimicry is a third package</h3>

<p>If you are running a Kenku NPC from the 2014 or 2024 <em>Monster Manual</em>, Mimicry is a trait with a DC 14 Wisdom (Insight) check to tell the sounds are imitations. That DC 14 is not the Volo&rsquo;s opposed check in the unofficial player transcription, and it is not the MotM 8 + PB + Cha formula in that transcription. Do not put DC 14 on a player Kenku because the monster page lists a round number.</p>

<h3>No Darkvision on the player</h3>

<p>Playable Kenku, Volo&rsquo;s and MotM, do not list Darkvision. The 2014 MM Kenku monster also lists no Darkvision (senses: passive Perception 12). The 2024 MM Kenku monster has Darkvision 60 feet. If the dungeon is dark, a Kenku PC still needs a light, a spell, or a friend who can see. Example: a hooded lantern in the portrait is not decoration; it is how that character functions underground. Do not steal the 2024 monster&rsquo;s Darkvision to &ldquo;fix&rdquo; the player.</p>

<h2>Class only as far as the sheet</h2>

<p>There is no official &ldquo;best Kenku class&rdquo; page. D&amp;D Beyond and the PHB do not print a Kenku class ranking.</p>

<p>Volo&rsquo;s +2 Dexterity / +1 Wisdom on the D&amp;D Beyond index lean toward Dexterity classes: Rogue, Ranger, and Monk are the usual fills on a 2014-era sheet. That is analysis of the index ASI, not a Wizards ranking. MotM&rsquo;s transcribed flexible scores, and 2024&rsquo;s background scores, open the same raven-person to other classes without breaking the lock. A MotM Kenku Bard is legal in a way a Volo&rsquo;s Kenku Bard was always legal too; Volo&rsquo;s just did not feed Charisma from the race line.</p>

<p>Stop at the point the sheet is fillable. For how those classes actually play, use the <a href="${EN_DND_CLASSES_PATH}" rel="noreferrer noopener">DND classes guide</a>. That guide is about class feel. It is not a Kenku optimizer. The job has the same shape as <a href="${EN_DND_DRAGONBORN_PATH}" rel="noreferrer noopener">locking a dragonborn</a>: pick the book, copy that block, crop the token so the identity still reads.</p>

<h2>Crop a beak-readable Kenku token</h2>

<p>After the sheet names a book, the map still has to show a Kenku, not a generic bird, not an aarakocra, and not a raven familiar. Token Maker is a free browser editor on the homepage. Upload JPG, PNG, or WEBP art (up to 10 MB), add a border, mask, and optional text, then download a transparent PNG. The site says those PNGs are designed for Roll20, Foundry VTT, Owlbear Rodeo, and similar tabletops that accept image tokens. There is no Kenku-specific template; crop your own portrait so the beak and crest stay readable. Open the <a href="${EN_EDITOR_PATH}" rel="noreferrer noopener">Token Maker editor</a>. For export format and the &ldquo;accepts image tokens&rdquo; wording, the <a href="/faq" rel="noreferrer noopener">Token Maker FAQ</a> is the public page.</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_KENKU_TOKEN_CROP_IMAGE_PATH}"
    alt="Circular token crop diagram: a Kenku face with beak and head feathers inside the circle, crop handles keeping the wings out of the read"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Crop diagram, not a Token Maker screenshot. If the beak or the head feathers sit outside the circle, the token no longer reads as Kenku at map size.</figcaption>
</figure>

<h3>What must stay in the circle</h3>

<p>Keep the beak. Keep the head feathers or the raven crest. Keep enough of the eye that the face is a person, not a wildlife token. Drop flyable wings. Drop a full-body pose that shrinks the head to a speck. A circular mask is the usual face token. Optional text can hold a short call-name; the editor will not generate bird-speech labels for you.</p>

<p>Export is a transparent PNG. Sizes in the editor are 256, 512, 1024, and 2048. The homepage highlights export up to 2048. Pick a size your VTT actually uses; this page does not guarantee one size for every table.</p>

<h3>Failure branches: recrop instead of hoping the border hides it</h3>

<p><strong>The thick border eats the beak.</strong> A heavy frame that looks fine on a human face will clip a Kenku beak. Pull the portrait down and left, or right, until the full beak sits inside the inner edge, then try a thinner border. If the border still covers the beak, the crop is wrong, not the VTT.</p>

<p><strong>The portrait is an aarakocra.</strong> Raised wings, a soaring pose, or a wide wingspan silhouette will read as the flying birdfolk. Replace the art. Do not relabel winged flight art as Kenku because the file name matches.</p>

<p><strong>The portrait is a raven or a crow familiar.</strong> A bird body without a person stance is a familiar token. Find a wingless raven-person.</p>

<p><strong>The crop is a human face with a small beak in the corner.</strong> Zoom out until the beak is a primary shape in the circle, not a jewelry-sized extra. Kenku identity is the beak-and-crest read, not a human crop with a costume layer.</p>

<p><strong>The label is longer than the token.</strong> A full sentence of mimicked flavor will pixelate. Use a short name. Example: <code>Bell</code> or <code>Scratch</code>, not <code>The-Kenku-Who-Only-Says-Hold-The-Gate</code>.</p>

<p>Default crop and ordinary PNG download can stay in the browser. Do not treat that as a promise that every share action stays local; a public share link is a different path. Do not treat the PNG as a commercial license, a Wizards-owned Kenku, or a Foundry module. It is an image token for tabletops that accept image tokens.</p>

<h2>Mix-ups that break a Kenku sheet</h2>

<p><strong>Treating Kenku as a 2024 PHB core species.</strong> It is not. Ask the DM to allow MotM (or Volo&rsquo;s) as an older species. Then apply the 2024 background ASI rule if the table is on 2024.</p>

<p><strong>Mixing mute speech with MotM Recall.</strong> That is two books. Pick one player page.</p>

<p><strong>Copying 2024 monster Darkvision or Monstrosity onto the PC.</strong> Volo&rsquo;s and MotM index traits do not list Darkvision. The 2024 monster is a different creature.</p>

<p><strong>Copying 2014 MM Ambusher onto the PC.</strong> The 2014 monster errata updated Ambusher to: in the first round of a combat, the kenku has advantage on attack rolls against any creature it surprised. Playable Kenku do not get that trait.</p>

<p><strong>Drawing flyable wings on the token.</strong> 5e player Kenku are the wingless raven-person. Wings turn the token into aarakocra-or-older-edition art.</p>

<p><strong>Writing a raven-queen calamity origin as the default 5e lore.</strong> That is a setting story, not the MotM index line and not a required Volo&rsquo;s mechanical lock for every table.</p>

<h2>Session-zero check</h2>

<p>Before session one, the sheet should answer these in writing:</p>

<ol>
  <li>Source line: Volo&rsquo;s, MotM, or MotM traits with 2024 background ASI. If the table uses a Wildemount Kenku page, check that printed book; this page only locks the two index entries.</li>
  <li>Speaks normally? Unofficial lineage transcription: yes on MotM; only by Mimicry on Volo&rsquo;s. Confirm on print. Unresolved on a 2024-plus-Volo&rsquo;s table until the DM answers.</li>
  <li>Mimicry tell: unofficial lineage transcription gives opposed Insight vs Deception (Volo&rsquo;s) and Insight vs 8 + PB + Cha (MotM). Confirm on print. Do not use the monster DC 14 on a PC.</li>
  <li>Skill package: index names Training vs Recall. Copy the printed list, not a mix of both books.</li>
  <li>Size: confirm on the printed page you locked. Unofficial lineage transcription: Volo&rsquo;s Medium; MotM Medium or Small.</li>
  <li>Darkvision: none on the PC. Pack a light.</li>
  <li>Token: beak and head feathers in the circle, no flyable wings.</li>
</ol>

<p>If any line is blank, you do not have a finished <strong>dnd kenku</strong>. Fill the blank from the locked book, not from a second book that had a prettier number.</p>

<h2>FAQ about dnd kenku</h2>
<h3>Can a Kenku speak in 5e?</h3>
<p>It depends on the book. The free D&amp;D Beyond index does not print a Kenku Languages line. The unofficial Kenku lineage transcription gives a Volo&rsquo;s player as speaking only through Mimicry, and a MotM player as able to speak, read, and write Common plus one other language, with Mimicry still a separate trait. Confirm those lines on printed Volo&rsquo;s or MotM. A 2014 MM Kenku monster speaks only through Mimicry. A 2024 MM Kenku monster lists Common and Primordial (Auran) on the language line, while the lore paragraph still describes mimic-only vocal communication.</p>
<h3>Is Kenku in the 2024 Player&rsquo;s Handbook?</h3>
<p>No. Kenku is not one of the ten 2024 PHB species. On a 2024 table, play Kenku only if the DM allows the MotM (or Volo&rsquo;s) older species, and then ignore the old species ASI in favor of the background increases.</p>
<h3>Do playable Kenku have Darkvision?</h3>
<p>No. Volo&rsquo;s and MotM player traits do not list Darkvision. The 2024 MM Kenku monster has Darkvision 60 feet. That monster sense is not a player trait.</p>
<h3>Can a Kenku cast spells with verbal components?</h3>
<p>Official Kenku traits do not ban spellcasting. If printed MotM matches the unofficial transcription and the character can speak, that Kenku can provide verbal components like other speakers. Volo&rsquo;s Kenku can produce mimicked voices and sounds; the Kenku traits do not say that blocks verbal components, and they do not require the character to have heard the exact spell text first.</p>
<h3>Which Mimicry check do I roll?</h3>
<p>The free index lists Mimicry as a name only. The unofficial lineage transcription gives Volo&rsquo;s player as Insight opposed by the Kenku&rsquo;s Deception, and MotM player as Insight against DC 8 + proficiency bonus + Charisma modifier. Confirm those player formulas on the printed page you locked. 2014 and 2024 monsters: DC 14 Insight. Do not mix those three.</p>

<h2>Sources</h2>

<ul>
  <li><strong>ddb-species-index</strong> — D&amp;D Beyond Character Species list (MotM Kenku current; Volo&rsquo;s Kenku Legacy) — <a href="${DND_BEYOND_SPECIES_INDEX_URL}" rel="noreferrer noopener">https://www.dndbeyond.com/species</a> — Supports: Kenku is not a 2024 PHB species; Volo&rsquo;s Legacy trait names (+2 Dexterity, +1 Wisdom, Expert Forgery, Kenku Training, Mimicry); MotM trait names (Expert Duplication, Kenku Recall, Mimicry); MotM flavor (Shadowfell and Material Plane, raven coloration); Volo&rsquo;s flavor (robbed of their wings). Does <strong>not</strong> print Languages, Mimicry DCs, skill menus, size, speed, or trait effect text.</li>
  <li><strong>wikidot-kenku-lineage</strong> — Kenku lineage (unofficial transcription) — <a href="${DND_KENKU_WIKIDOT_LINEAGE_URL}" rel="noreferrer noopener">https://dnd5e.wikidot.com/lineage:kenku</a> — Supports: community transcription of Volo&rsquo;s mute Languages line and opposed Mimicry check; MotM speak/read/write Common + 1, Medium or Small, Humanoid, speed 30 feet, Expert Duplication effect, Kenku Recall uses, Mimicry DC 8 + PB + Cha. <strong>Not official.</strong> Printed Volo&rsquo;s or MotM wins if they differ.</li>
  <li><strong>ddb-2024-creating-character</strong> — D&amp;D Beyond Basic Rules (2024) — Creating a Character — <a href="${DND_2024_CHARACTER_CREATION_URL}" rel="noreferrer noopener">https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character</a> — Supports: free rules species list has no Kenku; background adjusts ability scores; 2024 language chassis (Common plus two; Primordial includes Auran).</li>
  <li><strong>ddb-2024-character-origins</strong> — D&amp;D Beyond Basic Rules (2024) — Character Origins — <a href="${DND_2024_CHARACTER_ORIGINS_URL}" rel="noreferrer noopener">https://www.dndbeyond.com/sources/dnd/br-2024/character-origins</a> — Supports: background ASI rule; free Origins species list has no Kenku.</li>
  <li><strong>ddb-post-10-species-2024</strong> — The 10 Species in the 2024 Player&rsquo;s Handbook — <a href="${DND_RACES_2024_SPECIES_OVERVIEW_URL}" rel="noreferrer noopener">https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook</a> — Supports: the ten 2024 PHB species; Kenku is not among them; ability score adjustments are no longer tied to species.</li>
  <li><strong>ddb-post-2024-character-creation</strong> — How to Create a Character Using the 2024 Player&rsquo;s Handbook — <a href="${DND_2024_CREATE_CHARACTER_POST_URL}" rel="noreferrer noopener">https://www.dndbeyond.com/posts/1787-how-to-create-a-character-using-the-2024-players</a> — Supports: older-species conversion sidebar, ignore old ASI, background grants +2/+1 or three +1s.</li>
  <li><strong>ddb-volo-errata</strong> — Volo&rsquo;s Guide to Monsters Sage Advice &amp; Errata — <a href="${DND_VOLO_ERRATA_URL}" rel="noreferrer noopener">https://www.dndbeyond.com/sources/dnd/sae/volos-guide-to-monsters</a> — Supports: Kenku Traits (p. 111); Alignment trait removed.</li>
  <li><strong>ddb-mm2014-errata</strong> — Monster Manual (2014) Sage Advice &amp; Errata — <a href="https://www.dndbeyond.com/sources/dnd/sae/monster-manual-2014" rel="noreferrer noopener">https://www.dndbeyond.com/sources/dnd/sae/monster-manual-2014</a> — Supports: 2014 MM Kenku at p. 194; Ambusher wording; Ambusher is not a player trait.</li>
  <li><strong>ddb-2024-spell-components</strong> — D&amp;D Beyond Basic Rules (2024) — Spells (Verbal components) — <a href="https://www.dndbeyond.com/sources/dnd/br-2024/spells" rel="noreferrer noopener">https://www.dndbeyond.com/sources/dnd/br-2024/spells</a> — Supports: verbal components use a normal speaking voice with specific pitch and resonance; Kenku is not named.</li>
  <li><strong>roll20-mm2024-kenku</strong> — Kenku — D&amp;D Monster Manual (2024) on Roll20 — <a href="${DND_KENKU_2024_ROLL20_URL}" rel="noreferrer noopener">https://roll20.net/compendium/dnd5e/Monsters:Kenku?expansion=34653</a> — Supports: 2024 MM lore (mimic-only vocal communication); stat block Languages Common and Primordial (Auran); Darkvision 60 ft.; Mimicry DC 14; Medium Monstrosity, Neutral.</li>
  <li><strong>aidedd-kenku-2014</strong> — Kenku monster — AideDD (2014 Monster Manual) — <a href="${DND_KENKU_2014_AIDEDD_URL}" rel="noreferrer noopener">https://www.aidedd.org/dnd/monstres.php?vo=kenku</a> — Supports: 2014 MM understands Auran and Common but speaks only through Mimicry; no Darkvision; Mimicry DC 14; Humanoid, chaotic neutral.</li>
  <li><strong>aidedd-kenku-2024</strong> — Kenku monster — AideDD (Monster Manual 2024) — <a href="${DND_KENKU_2024_AIDEDD_URL}" rel="noreferrer noopener">https://www.aidedd.org/monster/kenku</a> — Supports: cross-check of 2024 MM Darkvision 60 ft.; Languages Common, Primordial (Auran); Mimicry DC 14; Monstrosity, Neutral.</li>
</ul>
`;

export const dndKenkuArticleHtmlZh = String.raw`
<p>开团前先问 DM：这桌的天狗 Kenku 抄《瓦罗的怪物指南》还是《魔邓肯巨献：多元宇宙的怪物》。瓦罗这一页写明你会读、写通用语和风族语，只能用拟声说话；魔邓肯玩家种族可以开口，拟声仍在，灰机那一页却没有语言条，开口规则必须跟锁的那本书走。这不是会飞的阿兰寇拉鹰人，也不是日本妖怪或开拓者那只同样叫天狗的 Tengu。</p>

<p>本页给已经决定玩天狗 Kenku 的中文桌做建卡核对，不代替 <a href="${ZH_DND_RACES_PATH}" rel="noreferrer noopener">DND 种族指南</a> 里 2024 核心十个 Species 的横向比较。那份名单里没有 Kenku。读完应能在角色卡上分行写清机制来源、语言规则和名字来源，准备一套不让全桌猜谜的说法，留下语音里喊得清的短称呼，并裁一枚能看出「无翼、有喙、不是鹰人」的 Token。</p>

<table>
  <thead>
    <tr>
      <th scope="col">要拍板的事</th>
      <th scope="col">先看哪一页</th>
      <th scope="col">不要混进另一页的东西</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">2014 线、明确用瓦罗</th>
      <td><a href="${DND_KENKU_HUIJI_VOLO_URL}" rel="noreferrer noopener">灰机：瓦罗天狗 Kenku</a></td>
      <td>不要把魔邓肯的「可以说话」或天狗回想写进瓦罗卡</td>
    </tr>
    <tr>
      <th scope="row">明确用魔邓肯玩家种族</th>
      <td><a href="${DND_KENKU_HUIJI_MOTM_URL}" rel="noreferrer noopener">灰机：魔邓肯天狗 Kenku</a>；语言条用英文 MotM 条目对照，见文内说明</td>
      <td>不要因为灰机这一页没有语言条，就填「魔邓肯也不能说话」</td>
    </tr>
    <tr>
      <th scope="row">2024 桌、DM 允许旧书</th>
      <td>先问锁的是瓦罗还是魔邓肯，再按 2024 建角忽略旧种族属性加值</td>
      <td>不要把旧书敏捷 +2 叠进背景加值；失语仍跟锁的那本书走</td>
    </tr>
    <tr>
      <th scope="row">荒洲 / 鸦后起源</th>
      <td><a href="https://dndlogs.com/5E/topics/%E8%8D%92%E6%B4%B2%E6%8E%A2%E9%99%A9%E5%AE%B6%E6%8C%87%E5%8D%97/%E7%8E%A9%E5%AE%B6%E9%80%89%E9%A1%B9/%E7%A7%8D%E6%97%8F/%E5%A4%A9%E7%8B%97.html" rel="noreferrer noopener">dndlogs 荒洲天狗</a> 只在 DM 锁了荒洲时用</td>
      <td>起源故事和拟声规则不是同一本书，不要叠进没锁书的被遗忘国度卡</td>
    </tr>
  </tbody>
</table>

<h2>先锁书，再写这桌能不能开口</h2>

<p>中文桌口头仍说种族，卡面术语跟所用的书对齐即可：瓦罗写成 Race，2024 桌若沿用旧选项，按桌上约定写成 Race 或 Species。职业手感另看 <a href="${ZH_DND_CLASSES_PATH}" rel="noreferrer noopener">DND 职业详解</a>，本文不排最强职业。</p>

<p>两套玩家写法最大的分歧不是「像不像渡鸦」，而是<strong>这只鸟能不能用自己的声音说话</strong>。把来源写在种族栏旁边，语言栏只抄那一页，不要自行拼成第三套。</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_KENKU_SPEECH_LOCK_ZH_IMAGE_PATH}"
    alt="对照表示意：左边瓦罗天狗 Kenku 角色卡写着只能拟声，右边魔邓肯卡写着可以开口，中间一行写先问 DM 锁哪一本书"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>瓦罗这一页只能用拟声说话，魔邓肯玩家种族可以开口。图是锁书示意，不是官方书页扫描。</figcaption>
</figure>

<h3>瓦罗：读得了，说只能靠拟声</h3>

<p><a href="${DND_KENKU_HUIJI_VOLO_URL}" rel="noreferrer noopener">灰机瓦罗页</a> 的语言条是：你会读、写通用语和风族语，但你只能使用拟声特性来说话。风族语对应 Auran；有的中文页写成气族语，指的是同一门。传说段还写：天狗无法用自己的声音说话，只能用听过的声音交流。那是瓦罗玩家种族的配套风味，不要写成所有第五版天狗 Kenku 的共同禁令。</p>

<p>拟声本身：你可以模仿听过的声响，包括人的嗓音。听到的人用感知（洞悉）对抗你的魅力（欺瞒），成功则听出是模仿。条目没有写这要花一个动作。</p>

<p>同页还有专家伪造、天狗训练（从特技、欺瞒、隐匿、巧手里选两项）。属性是敏捷 +2、感知 +1，中型，速度 30 尺。这些数字只跟瓦罗走。</p>

<h3>魔邓肯：灰机漏了语言条，开口要问锁的是哪本书</h3>

<p><a href="${DND_KENKU_HUIJI_MOTM_URL}" rel="noreferrer noopener">灰机魔邓肯页</a> 抄了复制专家、天狗回想和拟声，风味写成「一种不会飞的鸟人，注定要模仿其他人的创作」，并改口说天狗有多少、起源故事就有多少。这一页<strong>没有语言条</strong>。缺页不能当成规则：不要写成「中文官方说魔邓肯天狗 Kenku 也不能说话」。</p>

<p>开口规则要回到你锁的那本书。对照已打开的英文 MotM 条目（<a href="${DND_KENKU_WIKIDOT_LINEAGE_URL}" rel="noreferrer noopener">dnd5e.wikidot 的 Kenku lineage</a>，不是官方中文页）：角色可以说、读、写通用语，再加一门与 DM 商定的语言。拟声仍在，改成洞悉对抗 DC 8 + 熟练加值 + 魅力调整值，不再跟欺瞒对抗。魔邓肯桌上，拟声是额外能力，不是唯一开口方式。</p>

<p>同书玩家块还让你在中型或小型里选，速度仍是 30 尺。天狗回想是自选两项技能熟练，并且每长休有限次数给熟练技能检定优势。不要把瓦罗的失语和魔邓肯的回想写在同一张卡上。</p>

<p>语言怎么跟战役挂钩，可以对照 <a href="${ZH_DND_LANGUAGES_PATH}" rel="noreferrer noopener">DND 语言指南</a>。那篇管的是 2024 出身步骤里两门标准语言怎么挑；天狗 Kenku 先要解决的是「这桌能不能开口」，不是再做一张语言总表。</p>

<h3>2024 桌没有现成 Kenku 页</h3>

<p>2024《玩家手册》核心 Species 名单里没有天狗 Kenku。本站 <a href="${ZH_DND_RACES_PATH}" rel="noreferrer noopener">种族指南</a> 核的是那十个，不要到那篇里找 Kenku 专页。</p>

<p>DM 允许沿用旧书时，按 2024 建角处理：英文 <a href="${DND_2024_CREATE_CHARACTER_POST_URL}" rel="noreferrer noopener">D&amp;D Beyond 博文</a> 写明旧物种忽略种族加值、改由背景给加值（+2/+1 或三个 +1）。该说明只处理加值，没有写废除瓦罗失语。<a href="https://rpgbot.net/dnd5/characters/races/kenku/" rel="noreferrer noopener">RPGBOT</a> 同样只处理加值。掷属性可用 <a href="${ZH_DICE_ROLLER_PATH}" rel="noreferrer noopener">骰子工具</a>。2024 桌失语仍跟锁的那本书走：锁瓦罗，语言栏仍按只能拟声来写；锁魔邓肯，才按可说话来写。</p>

<p>玩家种族（瓦罗和魔邓肯）都没有黑暗视觉。2024 怪物页不是玩家种族：<a href="${DND_KENKU_2024_ROLL20_URL}" rel="noreferrer noopener">Roll20 的 2024《怪物图鉴》Kenku</a> 给怪物写了 60 尺黑暗视觉，传说段仍写诅咒让它们只能靠模仿发声交流，语言栏列出通用语和原初语（风族语方言），类型是 Monstrosity（怪兽）。不要把那一页的黑暗视觉或怪兽类型抄进玩家卡。</p>

<p>荒洲页把鸦后黑翼天使的起源和瓦罗那套「只能拟声」写在一起，并注明名字译自落雨随风的瓦罗译本。起源是荒洲，机制是瓦罗，不是被遗忘国度默认卡。DM 没锁荒洲，就不要把鸦后使者写进背景当官方标配。</p>

<h2>中文桌这是哪只鸟</h2>

<p>中文资料站普遍把这个选项写成<strong>天狗 Kenku</strong>，英文原名要留在卡上。单写「天狗」会撞上完全不同的东西。开团时口头可以喊天狗，角色卡、VTT 标签和英文书页靠 Kenku 对齐。</p>

<p>四只容易认错的鸟，建卡时直接划开：</p>

<table>
  <thead>
    <tr>
      <th scope="col">你要的</th>
      <th scope="col">常见撞车</th>
      <th scope="col">一眼能分开的地方</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">DND 天狗 Kenku</th>
      <td>会飞的阿兰寇拉鹰人 Aarakocra</td>
      <td>Kenku 不会飞；阿兰寇拉带翼，中文页有时也叫鸟人</td>
    </tr>
    <tr>
      <th scope="row">同上</th>
      <td>开拓者天狗 Tengu</td>
      <td>开拓者条目也叫天狗，对应 Tengu，不是 DND Kenku</td>
    </tr>
    <tr>
      <th scope="row">同上</th>
      <td>日本天狗 / 乌天狗</td>
      <td>那是另一套妖怪，不是第五版玩家种族</td>
    </tr>
    <tr>
      <th scope="row">同上</th>
      <td>魔兽鸦人</td>
      <td>不要用鸦人当 Kenku 主词</td>
    </tr>
  </tbody>
</table>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_KENKU_NAME_COLLISION_ZH_IMAGE_PATH}"
    alt="四格辨认图：无翼有喙的 DND 天狗 Kenku、带翼的阿兰寇拉鹰人、开拓者天狗 Tengu、日本天狗或鸦人剪影，每格标中文名和英文原名"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>四格是辨认用的示意，不要读成「这些都叫天狗」。无翼渡鸦头才是 DND 天狗 Kenku。</figcaption>
</figure>

<p>阿兰寇拉在灰机页里写成带翼人，有时被称作鸟人 birdfolk。你若把 Kenku 立绘裁出一对张开的大翅膀，地图上就会被认成鹰人。开拓者条目也叫天狗，对应 Tengu，不是 DND Kenku。</p>

<h2>拟声怎么说才不拖桌</h2>

<p>瓦罗中文页有一段扮演边栏，说的不是「多学几声鸟叫就更像」，而是<strong>别把全桌拖进猜谜</strong>。边栏写：不断现场学声响会让人困惑或恼火；你可以描述角色发出的声音及其含义；除非故意要神秘，否则把意图说清楚；给别人一套需要解码的响声词汇，听起来好玩，实际会分心、拖慢游戏。</p>

<p>收成桌上能执行的三条：</p>

<ol>
  <li><strong>默认用旁白。</strong> 先说发出什么声音，紧接着说这句里它是什么意思。声音和含义放在同一句里，不要拆成两轮让别人猜。</li>
  <li><strong>现场学一声只留给「外人确实只该听见声音」的场合。</strong> 例如隔墙传假口令、学门锁响、用鸟叫接头。学完立刻用旁白补含义，免得全桌停下来解码。</li>
  <li><strong>不要做日常密码表。</strong> 事先约定「锤两下等于前进、三下等于撤退」当正常对话，正是边栏要你避免的事。</li>
</ol>

<p>设计示例（不是某次跑团记录）。瓦罗桌，拟声名用书上的 Hammerer。你说：「锤打者发出一下缓慢、有节奏的铁锤敲石头声，表示他等得无聊了；同时把玩匕首，盯着酒吧里那个领主联盟的人。」不要只敲桌子、学一声锤响，等别人猜你是无聊、是警告还是要开打。边栏里的折树者例子走的就是这条路：铁锤慢敲岩石，意思是无聊，再补上他把玩匕首、观察特工。</p>

<p>魔邓肯桌可以正常说话。拟声仍可用来学门卫嗓音、学婴儿哭、学流水，用来骗人耳或给场面加一层声音。识破跟你锁的那一页走：瓦罗是洞悉对抗欺瞒，魔邓肯是洞悉对抗固定 DC。不要在能开口的桌上还强迫全队猜锤声，除非这幕的目的就是不让旁人听懂。</p>

<p>规则没有写天狗 Kenku 不能施法。瓦罗失语限制的是「用自己的声音说话」，不是另写一条「口头成分作废」。口头成分怎么念，跟你锁的语言规则走，不要自行发明「必须先听过咒文才能施」。</p>

<h2>卡面留拟声名，桌上喊两到四个字</h2>

<p>瓦罗把名字写成三类，男女不分。名字来自各种响声和短语，外人常用描述这种响声的词来称呼他们：</p>

<table>
  <thead>
    <tr>
      <th scope="col">类型</th>
      <th scope="col">卡面可保留的英文拟声词</th>
      <th scope="col">中文资料站里见过的写法</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">武器声</th>
      <td>Smasher, Clanger, Slicer</td>
      <td>重击者、敲击者、切裂者</td>
    </tr>
    <tr>
      <th scope="row">动物声</th>
      <td>Rat Scratch, Whistler, Mouser</td>
      <td>鼠挠、吹哨者、小鼠</td>
    </tr>
    <tr>
      <th scope="row">手艺声</th>
      <td>Sail Snap, Hammerer, Cutter</td>
      <td>折帆、锤打者、切断者</td>
    </tr>
  </tbody>
</table>

<p>上表英文来自瓦罗名例；中文是资料站译本（荒洲页注明译自落雨随风的瓦罗译本），<strong>不是官方中文名册</strong>。卡面正式名保留英文拟声词，必要时括注译本，避免把未核验的汉字写进「官方姓名」栏。</p>

<p>语音里把 Rat Scratch 整串当战场称呼，一次不容易喊清。这不是书禁止用拟声名，而是桌上听不清。职能拆开，并标明后两项是<strong>桌子约定，不是官方名册</strong>：</p>

<ul>
  <li><strong>卡面正式名</strong>写拟声词，例如 Hammerer，来源注明瓦罗天狗姓名。</li>
  <li><strong>桌上短称呼</strong>用 2 到 4 个汉字，开团时告诉全桌。设计示例：Hammerer 喊「锤手」，Smasher 喊「重击」，Rat Scratch 喊「鼠挠」。不要把「锤手」填进官方名册栏。</li>
  <li><strong>传记里的更多声音</strong>可以写在背景，不要挤进姓名栏和棋子文字。</li>
</ul>

<p>魔邓肯页没有重印这套拟声名表。2024 桌若仍想用这三类声音，须经 DM 同意借用瓦罗名例，并在卡上分行写「机制来源：魔邓肯；名字来源：瓦罗」。这是桌上借用，不是 2024 官方继承。</p>

<h2>Token 留下喙和无翼肩线</h2>

<p>圆形棋子很小。天狗 Kenku 要让人在缩尺地图上认出「这是不会飞的渡鸦人，不是鹰人」，优先留下喙、头部轮廓和无翼的肩线。细碎的城市盗贼装备缩小后帮不上忙。张开的大翅膀会把人指向阿兰寇拉，裁掉。</p>

<p>Token Maker 是浏览器里的免费编辑器，入口在 <a href="${ZH_EDITOR_PATH}" rel="noreferrer noopener">中文首页编辑区</a>。上传 10MB 内的 JPG、PNG 或 WEBP 立绘，加边框、遮罩和可选文字，再导出透明 PNG。站点说明这些 PNG 面向 Roll20、Foundry VTT、Owlbear Rodeo 这类接受图片 Token 的虚拟桌面，不是导入后零修改的兼容保证。没有天狗 Kenku 专用模板，也不会自动识别喙或生成拟声标签；用自己的立绘裁，让喙和肩线在小图上仍能认出。格式和本地处理见 <a href="/zh/faq" rel="noreferrer noopener">FAQ</a>。</p>

<p>喙、肩线或头羽被圆形遮罩切掉时，改用方形遮罩，给角和口鼻留边，流程见 <a href="${ZH_SQUARE_TOKEN_MAKER_PATH}" rel="noreferrer noopener">方形 Token</a>。棋子文字栏只放桌上那 2 到 4 个汉字短称呼，例如「锤手」。完整拟声英文名留在角色卡。</p>

<p>日常桌面可先导出 512，近看或归档用 1024，资源包再用 2048。这是本站建议尺寸，不是平台最低规格。普通 PNG 下载在浏览器本地生成；复制分享链接会上传生成后的图。</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_KENKU_TOKEN_BEAK_ZH_IMAGE_PATH}"
    alt="方形棋子留下天狗 Kenku 的喙和无翼肩线，文字栏只印短称呼锤手；旁边一枚圆形棋子把喙切掉，看起来不像这只鸟"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>缩小后仍要认出喙和无翼肩线。图是裁切示意，不是编辑器截图，也不是某次跑团记录。</figcaption>
</figure>

<p>失败了就按能看见的结果改，不要换一张更像鹰人的立绘凑合：</p>

<ul>
  <li>缩到常用比例后认不出喙，放宽裁切或改方形。</li>
  <li>肩上留下一对能飞的大翅膀，重裁到无翼肩线，避免被认成阿兰寇拉。</li>
  <li>文字栏塞了 Hammerer 或「重击者 Hammerer」一整串，改成桌上短称呼。</li>
  <li>卡上写魔邓肯回想，语言栏却抄瓦罗「只能拟声」，回去锁一页，不要带着第三套规则上图。</li>
</ul>

<p>开团前核这四行即可：机制来源有没有写清；语言规则是「只能拟声」还是「可说话、拟声另算」；拟声名和桌上短称呼有没有分开，并且标明短称呼是约定；Token 缩小后能不能看出喙和无翼。四行都过，这名天狗 Kenku 就可以上桌。</p>

<h2>Sources</h2>

<ul>
  <li><a href="${DND_KENKU_HUIJI_MOTM_URL}" rel="noreferrer noopener">灰机wiki：天狗 Kenku（魔邓肯巨献）</a> — 中文专名、不会飞的鸟人、复制专家 / 天狗回想 / 拟声；本页无语言条</li>
  <li><a href="${DND_KENKU_HUIJI_VOLO_URL}" rel="noreferrer noopener">灰机wiki：瓦罗怪物指南 / 天狗 Kenku</a> — 只能拟声的语言条、扮演边栏（描述声音及其含义）、拟声姓名三类</li>
  <li><a href="https://dndlogs.com/5E/topics/%E8%8D%92%E6%B4%B2%E6%8E%A2%E9%99%A9%E5%AE%B6%E6%8C%87%E5%8D%97/%E7%8E%A9%E5%AE%B6%E9%80%89%E9%A1%B9/%E7%A7%8D%E6%97%8F/%E5%A4%A9%E7%8B%97.html" rel="noreferrer noopener">dndlogs：荒洲探险家指南 / 天狗</a> — 鸦后起源与瓦罗机制不是同一本书；名字译自落雨随风瓦罗译本</li>
  <li><a href="https://trpgtdnd.weebly.com/vgm-2282529399.html" rel="noreferrer noopener">D&amp;D 5E 中文化：VGM 天狗 [Kenku]</a> — 繁体资料同样用「天狗」对译 Kenku</li>
  <li><a href="https://dnd.huijiwiki.com/wiki/%E9%98%BF%E5%85%B0%E5%AF%87%E6%8B%89%E9%B9%B0%E4%BA%BA" rel="noreferrer noopener">灰机wiki：阿兰寇拉鹰人</a> — 带翼、有时被称作鸟人，用来和不会飞的 Kenku 划开</li>
  <li><a href="https://pf2.huijiwiki.com/wiki/%E5%A4%A9%E7%8B%97%E6%97%8F%E8%A3%94" rel="noreferrer noopener">开拓者 2 版中文维基：天狗族裔</a> — 同一中文名对应 Tengu，不是 DND Kenku</li>
  <li><a href="${DND_KENKU_WIKIDOT_LINEAGE_URL}" rel="noreferrer noopener">dnd5e.wikidot: Kenku lineage</a> — 对照灰机魔邓肯页未抄的语言条（可说话）；非官方中文页</li>
  <li><a href="https://rpgbot.net/dnd5/characters/races/kenku/" rel="noreferrer noopener">RPGBOT: Kenku 5e</a> — MotM 不再默认「不能自己说话」；2024 核心尚未重出 Kenku；旧物种忽略种族加值</li>
  <li><a href="${DND_2024_CREATE_CHARACTER_POST_URL}" rel="noreferrer noopener">D&amp;D Beyond：How to Create a Character Using the 2024 Player&rsquo;s Handbook</a> — 旧物种忽略种族加值、改由背景给加值；该说明只处理加值</li>
  <li><a href="${DND_KENKU_2024_ROLL20_URL}" rel="noreferrer noopener">Roll20：2024 Monster Manual Kenku</a> — 2024 怪物页（不是玩家种族）：黑暗视觉 60 尺、诅咒传说、通用语与原初语、Monstrosity</li>
  <li><a href="https://www.tokenmaker.one/zh" rel="noreferrer noopener">Token Maker 中文首页</a> — 编辑器入口、边框 / 遮罩 / 文字、透明 PNG 最高 2048</li>
  <li><a href="https://www.tokenmaker.one/zh/faq" rel="noreferrer noopener">Token Maker 中文 FAQ</a> — 透明 PNG；面向接受图片 Token 的 VTT</li>
  <li><a href="${ZH_DND_RACES_PATH}" rel="noreferrer noopener">本站：DND 种族怎么选</a> — 2024 核心十 Species 不含 Kenku</li>
  <li><a href="${ZH_DND_LANGUAGES_PATH}" rel="noreferrer noopener">本站：DND 语言</a> — 2024 出身语言步骤，不代替 Kenku 开口规则</li>
</ul>
`;
