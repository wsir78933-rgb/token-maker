import {
  DND_DRAGONBORN_2024_SPECIES_URL,
  DND_DRAGONBORN_ANCESTRY_SCALES_IMAGE_PATH,
  DND_DRAGONBORN_BREATH_SHAPE_IMAGE_PATH,
  DND_DRAGONBORN_CLAN_AND_CALLNAME_IMAGE_PATH,
  DND_DRAGONBORN_NAME_CLAN_TAGS_IMAGE_PATH,
  DND_DRAGONBORN_TWO_SOURCE_LINES_IMAGE_PATH,
  DND_DRAGONBORN_VIDEO_ID,
  DND_DRAGONBORN_VIDEO_PLACEHOLDER_PATH,
  DND_DRAGONBORN_VIDEO_URL,
  EN_DND_RACES_PATH,
  EN_EDITOR_PATH,
  EN_SQUARE_TOKEN_MAKER_PATH,
  ZH_DND_LANGUAGES_PATH,
  ZH_DND_RACES_PATH,
  ZH_EDITOR_PATH,
  ZH_SQUARE_TOKEN_MAKER_PATH,
  liteVideoEmbed,
} from './shared';

export const dndDragonbornArticleHtml = String.raw`
<p><strong>A dnd dragonborn is a Medium Humanoid with visible draconic ancestry:</strong> scales, horns, a breath weapon tied to one dragon color, and matching damage resistance. On a 2024 table that option is a <em>species</em>. On a 2014 table it is a <em>race</em>. Write the book on the sheet before you copy a trait, because Breath Weapon, Darkvision, flight, ability scores, and languages do not match across those two core writeups.</p>

<p>This page is the one-species job. If you still need to choose among the 2024 core list, use the <a href="${EN_DND_RACES_PATH}" rel="noreferrer noopener">DnD races and species guide</a> first. Here the work is narrower: lock 2014, 2024, or a permitted Fizban ancestry; pick one dragon from the table that book actually prints; copy a clan-first name from an official list; then, if you use a virtual map, crop a portrait so scale color and horns still read at token size.</p>

<table>
  <thead>
    <tr>
      <th>Need-to-know point</th>
      <th>Fast answer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>What is a dnd dragonborn?</strong></td>
      <td>A wingless, bipedal dragon person whose color, breath, and resistance come from one chosen dragon ancestor.</td>
    </tr>
    <tr>
      <td><strong>2024 or 2014?</strong></td>
      <td>2024 uses species traits (ancestry, breath as part of Attack, Darkvision, later flight) and puts ability score increases on the background. 2014 uses race traits (+2 Strength, +1 Charisma, action breath, Common and Draconic, no Darkvision, no flight).</td>
    </tr>
    <tr>
      <td><strong>Core ancestry colors</strong></td>
      <td>Black, Blue, Brass, Bronze, Copper, Gold, Green, Red, Silver, White. Gem colors are not on the 2024 core table.</td>
    </tr>
    <tr>
      <td><strong>Names</strong></td>
      <td>Clan name first, then a personal name, plus an optional childhood nickname. The 2024 free Dragonborn page does not reprint that list.</td>
    </tr>
    <tr>
      <td><strong>Token cue</strong></td>
      <td>One ancestry read (scale hue, horn shape, or breath color) plus one personal read (call-name, oath mark, or weapon).</td>
    </tr>
  </tbody>
</table>

<h2>What a Dragonborn is before you open a class list</h2>

<p>The <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-origins#Dragonborn" rel="noreferrer noopener">2024 Character Origins Dragonborn section</a> and the matching <a href="${DND_DRAGONBORN_2024_SPECIES_URL}" rel="noreferrer noopener">2024 Dragonborn species page</a> tell the same origin stories. One story says chromatic and metallic dragon eggs were blessed by Bahamut and Tiamat. Another says dragons made the first dragonborn without those gods. Either way, the people now live on the Material Plane.</p>

<p>The look is the part strangers notice first. The 2024 free text describes wingless, bipedal dragons: scaly, bright-eyed, thick-boned, with horns, and with coloration that follows the ancestor. That is why a <strong>dnd dragonborn</strong> token fails when it is cropped like a human face. The snout, horns, and scale color are the identity, not a costume layer you can hide under a heavy frame.</p>

<p>Game chassis on those 2024 pages: Creature Type Humanoid, Size Medium (about 5 to 7 feet), Speed 30 feet. Special traits are Draconic Ancestry, Breath Weapon, Damage Resistance, Darkvision, and Draconic Flight. There is no Languages line on that species block. There is no printed tail trait. There is no gem dragon on the ancestry table.</p>

<ul>
  <li><strong>Use 2024 text</strong> when the campaign said 2024, 5.5e labeling on D&amp;D Beyond, or the current free Character Origins chapter.</li>
  <li><strong>Use 2014 text</strong> when the campaign said 2014, legacy species, or the free Basic Rules race chapter.</li>
  <li><strong>Use Fizban only</strong> when the DM named <em>Fizban&rsquo;s Treasury of Dragons</em> as an allowed ancestry source.</li>
  <li><strong>Do not stack</strong> 2014 Strength/Charisma increases on top of a 2024 background increase on the same character.</li>
</ul>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_DRAGONBORN_ANCESTRY_SCALES_IMAGE_PATH}"
    alt="Placeholder: a red-scaled Dragonborn adventurer in three-quarter view, horns and snout clear, brass armor catching torchlight"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Scale hue and horn silhouette have to survive a one-inch token. Facial jewelry will not.</figcaption>
</figure>

<h2>Lock the rulebook first</h2>

<p>A <strong>dnd dragonborn</strong> sheet that mixes books quietly is the usual failure. Breath shape, rest cycle, Darkvision, flight, and ability scores each belong to one writeup. Ask the DM which source is legal, write that source next to Species or Race, and copy only that block.</p>

<h3>2024 core and the free Character Origins chapter</h3>

<p>The <a href="https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook" rel="noreferrer noopener">official 10 species overview</a> lists Dragonborn among the ten 2024 <em>Player&rsquo;s Handbook</em> species. The <a href="https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character" rel="noreferrer noopener">2024 Creating a Character chapter</a> tells you to choose class first, then origin (background, species, and two languages), then ability scores. Background, not species, supplies the score increases: raise one listed score by 2 and another by 1, or raise all three listed scores by 1, none above 20.</p>

<p>The free Origins chapter prints nine species in that file, still including Dragonborn. Aasimar appears in the ten-species overview and the paid core list; it is not in that free nine-item list. That difference does not remove Dragonborn from 2024 play. It only means you should not cite the free Origins page as a complete reprint of every 2024 core species.</p>

<p>If the 2024 table allows an older species, the same Creating a Character chapter has a sidebar for that case: ignore the old species ability score increases and use only the background increases. If the older background grants no feat, you gain an Origin feat of your choice. That sidebar is how you keep a 2014 Dragonborn identity without stacking two score packages.</p>

<h3>2014 Basic Rules and the legacy species page</h3>

<p>The <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/races#Dragonborn" rel="noreferrer noopener">2014 Basic Rules Dragonborn section</a> and the <a href="https://www.dndbeyond.com/species/16-dragonborn" rel="noreferrer noopener">legacy Dragonborn species page</a> are the 2014 race. D&amp;D Beyond marks the species page as legacy: it does not reflect the latest rules and lore. Use it when the table is actually on 2014, not as a silent upgrade path into 2024.</p>

<p>2014 flavor is more specific about bodies and clans. The race looks like a dragon standing erect and lacks wings or a tail. Many have brass or bronze scales, sometimes ranging to scarlet, rust, gold, or copper-green. The Proud Dragon Kin prose puts typical height near 6 and a half feet and weight at 300 pounds or more; the Size trait still says Medium, well over 6 feet, averaging almost 250 pounds. Clan honor sits above even the gods. Those sentences are 2014. Do not paste them onto a 2024 species block and call the mix official.</p>

<h3>Fizban only with DM permission</h3>

<p><em>Fizban&rsquo;s Treasury of Dragons</em> is an extra book, not the 2024 core Dragonborn. Official D&amp;D Beyond posts describe chromatic, metallic, and gem ancestries as player options from that book. On a 2024 table they need an explicit yes. They do not sneak onto the 2024 ten-color table because the breath math looks similar.</p>

<p>2024 core already took some of that later design: breath can replace an attack, uses scale with Proficiency Bonus, and flight arrives at level 5. What 2024 core did <em>not</em> import is gem damage types, chromatic damage immunity, metallic&rsquo;s second breath, or gem&rsquo;s one-minute hover. If you want those, name Fizban on the sheet.</p>

<h2>2024 traits that change a turn</h2>

<p>Copy 2024 traits from the Origins Dragonborn section or the 2024 species page, not from memory of 2014. The five traits below are the ones that actually change a round or a rest.</p>

<h3>Draconic Ancestry</h3>

<p>Choose one dragon from the Draconic Ancestors table. That choice sets Breath Weapon damage, Damage Resistance, and appearance. The 2024 table is chromatic and metallic only:</p>

<table>
  <thead>
    <tr>
      <th>Dragon</th>
      <th>Damage type</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Black</td><td>Acid</td></tr>
    <tr><td>Blue</td><td>Lightning</td></tr>
    <tr><td>Brass</td><td>Fire</td></tr>
    <tr><td>Bronze</td><td>Lightning</td></tr>
    <tr><td>Copper</td><td>Acid</td></tr>
    <tr><td>Gold</td><td>Fire</td></tr>
    <tr><td>Green</td><td>Poison</td></tr>
    <tr><td>Red</td><td>Fire</td></tr>
    <tr><td>Silver</td><td>Cold</td></tr>
    <tr><td>White</td><td>Cold</td></tr>
  </tbody>
</table>

<p>Amethyst, Crystal, Emerald, Sapphire, and Topaz are not on this table. If the character needs Force, Radiant, Psychic, Thunder, or Necrotic breath from gem dragons, that is a Fizban permission, not a 2024 core pick.</p>

<p>Appearance follows the pick. A Red <strong>dnd dragonborn</strong> should read as fire ancestry on the map: warm scales, not a silver-white frost palette with a red name. The table does not print a mandatory eye color or horn count. It does say the choice affects how the character looks, so pick a readable scale family and keep it on the token, the mini, and the sheet note.</p>

<h3>Breath Weapon</h3>

<p>When you take the Attack action on your turn, you can replace one of your attacks with an exhalation of magical energy. Choose a 15-foot Cone or a 30-foot Line that is 5 feet wide, and you choose that shape each time you use the trait. Each creature in the area makes a Dexterity saving throw, DC 8 plus your Constitution modifier plus your Proficiency Bonus. A failed save takes 1d10 damage of the ancestry type; a successful save takes half. The damage die count rises at character levels 5 (2d10), 11 (3d10), and 17 (4d10). You can use the trait a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.</p>

<p>Three play details sit in that paragraph and get missed.</p>

<ul>
  <li><strong>It replaces one attack, not the whole Attack action.</strong> Extra Attack still lets you swing after the breath, or breath after a swing, as long as you spend one of the attacks on the exhalation.</li>
  <li><strong>Shape is a per-use choice.</strong> 2014 locked line or cone to the dragon color. 2024 does not. A Gold Dragonborn can throw a line down a corridor, then a cone into a doorway later in the same day.</li>
  <li><strong>Every creature in the area is in the area.</strong> The free trait text does not exclude allies. Check the map before you center a cone on a mix of friends and enemies.</li>
</ul>

<p>Uses come back only on a Long Rest. That is stricter than 2014&rsquo;s short-rest refresh and looser than 2014&rsquo;s single use, because Proficiency Bonus gives more daily shots as you level. Do not play 2024 breath as &ldquo;once per short rest, 2d6.&rdquo;</p>

<figure class="inline-figure inline-figure--square-crop">
  <img
    class="inline-figure__image inline-figure__image--square"
    src="${DND_DRAGONBORN_BREATH_SHAPE_IMAGE_PATH}"
    alt="Placeholder: overhead dungeon map with a 15-foot cone and a 30-foot line overlaid from a Dragonborn token"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>2024 lets you pick cone or line each use. 2014 locked that shape to the dragon color.</figcaption>
</figure>

<h3>Resistance, Darkvision, and Draconic Flight</h3>

<p><strong>Damage Resistance</strong> is the quiet half of ancestry. You have resistance to the same damage type as the breath. A White Dragonborn resists Cold. A Blue Dragonborn resists Lightning. It does not resist &ldquo;all dragon damage.&rdquo;</p>

<p><strong>Darkvision</strong> is 60 feet on the 2024 species. The 2014 race writeup does not include this trait. If you rebuilt a 2014 character onto 2024 and kept playing without Darkvision, that was the old block, not a missing line on the new page.</p>

<p><strong>Draconic Flight</strong> starts at character level 5. As a Bonus Action you sprout spectral wings for 10 minutes, until you retract them (no action), or until you have the Incapacitated condition. During that time you have a Fly Speed equal to your Speed. The wings look like the same energy as your Breath Weapon. Once you use the trait, you cannot use it again until you finish a Long Rest. That is a ten-minute fly speed, once per long rest, not an at-will pair of physical wings, and not the Fizban gem package of one minute with hover.</p>

<p>The 10 species overview states the design reason in plain language: Dragonborn were given access to wings because flight is one of the things people want from a dragon fantasy. The overview also notes that 2024 ability score adjustments are no longer tied to species, so the old habit of picking Dragonborn to feed Paladin Strength and Charisma is a 2014 habit. In 2024, pick Soldier or another background that lists the scores you want, then pick Dragonborn because you want the ancestry on the board.</p>

<h2>If the table is still on 2014</h2>

<p>Stay on the 2014 Basic Rules section or the legacy species page until the table changes books. The 2014 race is a different machine with a similar name.</p>

<table>
  <thead>
    <tr>
      <th>Topic</th>
      <th>2014 race</th>
      <th>2024 species</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Term on the sheet</td>
      <td>Race</td>
      <td>Species</td>
    </tr>
    <tr>
      <td>Ability scores</td>
      <td>+2 Strength, +1 Charisma</td>
      <td>None from the species; background supplies the increases</td>
    </tr>
    <tr>
      <td>Breath cost</td>
      <td>Your action</td>
      <td>Replace one attack when you take the Attack action</td>
    </tr>
    <tr>
      <td>Breath shape</td>
      <td>Locked to the dragon color (line or cone)</td>
      <td>15-foot Cone or 30-foot Line, chosen each use</td>
    </tr>
    <tr>
      <td>Breath save</td>
      <td>Dexterity or Constitution, locked to color (Green, Silver, and White use Constitution)</td>
      <td>Dexterity for every color</td>
    </tr>
    <tr>
      <td>Breath dice</td>
      <td>2d6, then 3d6 at 6th, 4d6 at 11th, 5d6 at 16th</td>
      <td>1d10, then 2d10 at 5, 3d10 at 11, 4d10 at 17</td>
    </tr>
    <tr>
      <td>Breath recharge</td>
      <td>After a short or long rest (one use)</td>
      <td>Proficiency Bonus uses, all back on a Long Rest</td>
    </tr>
    <tr>
      <td>Darkvision</td>
      <td>Not in the 2014 trait list</td>
      <td>60 feet</td>
    </tr>
    <tr>
      <td>Flight</td>
      <td>Not in the 2014 trait list</td>
      <td>Level 5, Bonus Action, 10 minutes, once per Long Rest</td>
    </tr>
    <tr>
      <td>Languages</td>
      <td>Common and Draconic from the race</td>
      <td>Common plus two languages from the origin step; Draconic is on the Standard Languages table</td>
    </tr>
    <tr>
      <td>Age note</td>
      <td>Walk hours after hatching; size of a 10-year-old human by 3; adult by 15; live around 80</td>
      <td>No separate Dragonborn age block; Origins says most species live about 80 years unless the writeup says otherwise, and this writeup does not add a different number</td>
    </tr>
  </tbody>
</table>

<p>2014 breath shape, from the same official table: Black, Blue, Brass, Bronze, and Copper use a 5-by-30-foot line and a Dexterity save. Gold and Red use a 15-foot cone and a Dexterity save. Green uses a 15-foot cone and a Constitution save (Poison). Silver and White use a 15-foot cone and a Constitution save (Cold). You cannot pick a line on a Red 2014 Dragonborn because the corridor is narrow. That flexibility is 2024.</p>

<p><strong>Example, labeled as an example:</strong> the same Red ancestry, first-level character. 2014 spends the action on a 15-foot fire cone, 2d6, then waits for a short or long rest. 2024 replaces one attack, chooses cone or line, deals 1d10 fire, and still has another use later in the day once Proficiency Bonus is 2. That is a teaching contrast, not a damage study and not a promise that 2024 is always stronger.</p>

<p>2014 languages are part of the race: Common and Draconic, with a short note that Draconic is old, used in magic study, and full of hard consonants and sibilants. 2024 does not repeat that grant on the species block. The Creating a Character chapter says you know Common plus two languages you roll or choose from the Standard Languages table; Draconic is on that table, origin Dragons. If you want Draconic on a 2024 Dragonborn, take it as one of those two origin languages (or from a class feature). Do not assume the species auto-grants it.</p>

<p>The 2014 chapter also prints a Dragonlance sidebar about draconians: corrupted metallic eggs, five types named aurak, baaz, bozak, kapak, and sivak, with unique magic instead of breath weapons. That sidebar is setting material on the 2014 page. It is not a 2024 core trait and it is not a second official way to build a standard <strong>dnd dragonborn</strong> adventurer.</p>

<h2>Optional Fizban ancestries</h2>

<p>Open these only after the DM names the book. The official posts to keep next to the physical book are the <a href="https://www.dndbeyond.com/posts/1097-explore-the-chromatic-and-gem-dragonborn-from" rel="noreferrer noopener">chromatic and gem Dragonborn article</a> and the <a href="https://www.dndbeyond.com/posts/1084-how-the-metallic-dragonborn-in-fizbans-treasury-of" rel="noreferrer noopener">metallic Dragonborn comparison</a>. Those posts describe later-era ancestries that already used Proficiency Bonus breath uses and attack-replacement timing, plus extra traits 2024 core did not keep.</p>

<ul>
  <li><strong>Chromatic (Black, Blue, Green, Red, White):</strong> damaging breath as a 30-foot line in that preview; Chromatic Warding at 5th level, an action that grants immunity to the ancestry damage type, once per long rest. Read the article and the book for the exact duration wording. Do not borrow a duration from a fan wiki.</li>
  <li><strong>Metallic (Brass, Bronze, Copper, Gold, Silver):</strong> damaging breath as a 15-foot cone in that preview; a second breath weapon at 5th level. Use the metallic article and the book for the exact options rather than a third-party summary.</li>
  <li><strong>Gem (Amethyst Force, Crystal Radiant, Emerald Psychic, Sapphire Thunder, Topaz Necrotic):</strong> damaging breath as a 15-foot cone in that preview; Psionic Mind to speak telepathically to a creature within 30 feet that understands at least one language; Gem Flight at 5th level as a bonus action, spectral wings for one minute, flying speed equal to walking speed, with hover, once per long rest.</li>
</ul>

<p>Those Fizban writeups also use the later ability-score pattern (choose +2 and +1, or +1 three times) instead of 2014&rsquo;s +2 Strength and +1 Charisma. If the rest of the table is on 2024 backgrounds, ask whether the Fizban ancestry still brings its own score line or whether you ignore it the way the older-species sidebar ignores old race increases. That is a table ruling. This page does not invent a third official hybrid.</p>

<p>Gem is the usual mix-up. Players remember flight and rare damage types, then look at the 2024 species page and wonder where Amethyst went. It did not move into the 2024 core table. Flavor the 2024 Gold or Crystal-looking portrait as you like; the damage type on the sheet still has to be a color that book printed.</p>

<h2>Dragonborn names: clan first, then personal, then a clutch nickname</h2>

<p>Treat <strong>dnd dragonborn names</strong> as a copy job, not a generator job. The 2014 Basic Rules and the legacy species page print the social rule and the lists. The 2024 Origins Dragonborn section does not reprint a name appendix. This page does not inspect the paid 2024 <em>Player&rsquo;s Handbook</em> for a hidden names chapter. If the DM says 2024 and you still want an official-looking name, copy from the 2014 lists and write &ldquo;names from 2014 Basic Rules&rdquo; next to the 2024 species line.</p>

<p>The printed rule: Dragonborn have personal names given at birth, but they put clan names first as a mark of honor. A childhood name or nickname is often used among clutchmates as a descriptive term or a term of endearment. The nickname might recall an event or a habit.</p>

<p>Sheet order that matches that rule:</p>

<ol>
  <li>Copy one <strong>clan name</strong> from the official clan list. This is the first string in speech and on the token label if you only have room for one long word.</li>
  <li>Copy one <strong>personal name</strong> from the male or female list, or from either list if the table does not use that split. Write which list you used.</li>
  <li>Optionally copy one <strong>childhood name</strong> for clutchmates and close party use.</li>
  <li>Pick one short <strong>call-name</strong> people will actually shout. That can be the personal name (Kriv), a clipped clan (Kepeshk), or the childhood name (Shieldbiter). Keep the full clan-plus-personal string on the sheet.</li>
</ol>

<p>Do not invent a look-alike clan by blending Clethtinthiallor and Verthisathurgiesh. Do not add English glosses the official pages do not print. Do not treat the childhood name as a legal surname. Do not drop the clan because a two-part Western name &ldquo;looks finished.&rdquo;</p>

<p>Short sample, spellings taken from the <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/races#DragonbornNames" rel="noreferrer noopener">2014 Dragonborn Names section</a> and repeated on the legacy species page. These are examples from the printed lists, not a replacement for the lists.</p>

<ul>
  <li><strong>Male personal names:</strong> Arjhan, Balasar, Bharash, Donaar, Ghesh, Heskan, Kriv, Medrash, Mehen, Nadarr, Pandjed, Patrin, Rhogar, Shamash, Shedinn, Tarhun, Torinn.</li>
  <li><strong>Female personal names:</strong> Akra, Biri, Daar, Farideh, Harann, Havilar, Jheri, Kava, Korinn, Mishann, Nala, Perra, Raiann, Sora, Surina, Thava, Uadjit.</li>
  <li><strong>Childhood names:</strong> Climber, Earbender, Leaper, Pious, Shieldbiter, Zealous.</li>
  <li><strong>Clan names:</strong> Clethtinthiallor, Daardendrian, Delmirev, Drachedandion, Fenkenkabradon, Kepeshkmolik, Kerrhylon, Kimbatuul, Linxakasendalor, Myastan, Nemmonis, Norixius, Ophinshtalajiir, Prexijandilin, Shestendeliath, Turnuroth, Verthisathurgiesh, Yarjerit.</li>
</ul>

<p>If you need a name that is not in that sample, open the 2014 Dragonborn Names section and copy the next printed line. Wizards also published longer Dragonborn d100 tables in an Extra Life 2017 names PDF; this page does not reprint that file. Use the opened 2014 lists.</p>

<p><strong>Example sheet line, labeled as an example, not a real player:</strong> 2024 Dragonborn, Red ancestry, Soldier background, clan Kepeshkmolik, personal name Mehen, childhood name Shieldbiter, call-name Mehen. Traits from 2024 Origins. Names from 2014 Basic Rules.</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_DRAGONBORN_NAME_CLAN_TAGS_IMAGE_PATH}"
    alt="Placeholder: three blank name tags on a desk labeled Clan, Personal, and Childhood, next to an unopened rulebook"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Three copied strings plus one short call-name. Nothing on the desk is a generated name.</figcaption>
</figure>

<h2>Make a token the table can read</h2>

<p>Once the sheet has a book, a color, and a call-name, the remaining job is visual. A round VTT token is small. The <a href="${EN_DND_RACES_PATH}" rel="noreferrer noopener">races guide</a> already gives Dragonborn a one-line cue: scale color, horn silhouette, and breath color. This section is how to spend that cue instead of burying it.</p>

<p>Use one ancestry cue and one personal cue. Ancestry is the dragon: red-gold scales, backswept horns, a pale frost rim for Silver, a wet green-black for Black. Personal is the adventurer: an oath ribbon, a cracked pauldron, a clan-colored sash, or the call-name set as token text. Six tiny jewels around the horns will vanish at map zoom. A single horn shape plus a bright sash will not.</p>

<ul>
  <li><strong>Crop for snout and horns.</strong> Leave a little air so the circular mask does not shave the horn tips. Do not center on the chest armor.</li>
  <li><strong>Keep scale hue simple.</strong> One dominant color that matches the ancestry table beats a rainbow that no one can name from three feet away.</li>
  <li><strong>Do not cover the face with the border.</strong> A thick gold ring that hides the jaw hides the species.</li>
  <li><strong>Put the call-name on the label</strong> if the VTT supports text. Kepeshkmolik Mehen will wrap; Mehen or Shieldbiter will not.</li>
  <li><strong>Check the party lineup.</strong> Two fire-red Dragonborn need different personal cues or different border colors.</li>
</ul>

<p>When the portrait is ready, open the <a href="${EN_EDITOR_PATH}" rel="noreferrer noopener">Token Maker editor</a>. Upload the art, pick a circular mask for a face-led hero or a square mask if the horns and shoulders need more frame, add a border that contrasts with both light and dark maps, and export a transparent PNG. The <a href="https://www.tokenmaker.one/faq" rel="noreferrer noopener">support FAQ</a> states that Token Maker exports transparent PNG tokens and that those files are meant for Roll20, Foundry VTT, Owlbear Rodeo, and similar image-token workflows. The home page describes the default crop-and-export path as local-first. This article did not click through the live editor, so it does not describe button coordinates or a tested import into a named VTT world.</p>

<p>For a first square file, the <a href="${EN_SQUARE_TOKEN_MAKER_PATH}" rel="noreferrer noopener">square token guide</a> recommends 512 pixels for most live sessions, 1024 for archive quality, and 2048 only for a long-term or premium library. Start at 512, drop the PNG on the map at the zoom you actually play, and go back to the crop if the horns disappear. That check is the end of the token job. It is not a ranking claim and not a promise that every platform will keep transparency without a client setting.</p>

<p>Tails are a description choice, not a 2024 listed trait. 2014 official prose says Dragonborn lack a tail. 2024 free prose says wingless and does not grant a tail. If the table wants a tail in the art, say so in the portrait brief. Do not write a phantom tail trait onto the sheet.</p>

<h2>A short table-energy clip, not a rules source</h2>

<p>The public title of that video is <a href="${DND_DRAGONBORN_VIDEO_URL}" rel="noreferrer noopener">How DM&rsquo;s react to what Race you play in Dungeons and Dragons</a>, by One Shot Questers. It is a 94-second Entertainment sketch, published in 2021, and YouTube&rsquo;s embed player is allowed by YouTube&rsquo;s Terms of Service. It is not a Dragonborn trait lecture. Do not take Breath Weapon, flight, or names from it. If you play it at all, play it after the sheet is already locked, as a joke about how tables react to a very visible ancestry.</p>

${liteVideoEmbed(DND_DRAGONBORN_VIDEO_ID, "How DM's react to what Race you play in Dungeons and Dragons", {
  src: DND_DRAGONBORN_VIDEO_PLACEHOLDER_PATH,
  alt: 'Placeholder poster for a short comedy sketch about DMs reacting to the race a player brings to the table',
})}

<p>When the book, the color, the name, and the crop are written down, the <strong>dnd dragonborn</strong> job on this page is done. Confirm the source line still matches the traits you are rolling. If two books are in play at the same table, keep names, traits, and ability scores labeled as three separate lines so a rebuild cannot merge them overnight.</p>

<h2>FAQ about dnd dragonborn</h2>
<h3>Do 2024 Dragonborn have Darkvision?</h3>
<p>Yes. The 2024 species block grants Darkvision out to 60 feet. The 2014 race block does not include that trait.</p>
<h3>Are gem Dragonborn in the 2024 core table?</h3>
<p>No. The 2024 free ancestry table is the ten chromatic and metallic colors. Gem ancestries are a Fizban option and need DM permission.</p>
<h3>Do they automatically know Draconic in 2024?</h3>
<p>The 2024 species block does not grant Common and Draconic. Origin languages are Common plus two picks or rolls from the Standard Languages table, where Draconic appears. 2014 still grants Common and Draconic from the race.</p>
<h3>What is the best class for a dnd dragonborn?</h3>
<p>There is no official best class. 2014&rsquo;s +2 Strength and +1 Charisma pulled many players toward Paladin and similar chassis. 2024 moved those increases to the background, so pick the class fantasy and a background that lists the scores you want.</p>
<h3>Do official 2024 rules give them a tail?</h3>
<p>2014 prose says they lack a tail. 2024 free prose calls them wingless and does not list a tail trait. A tail in art is a table description, not a copied 2024 trait.</p>

<h2>Sources</h2>

<ul>
  <li><a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-origins#Dragonborn" rel="noreferrer noopener">D&amp;D Beyond 2024 Character Origins — Dragonborn</a></li>
  <li><a href="${DND_DRAGONBORN_2024_SPECIES_URL}" rel="noreferrer noopener">D&amp;D Beyond 2024 Dragonborn species page</a></li>
  <li><a href="https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook" rel="noreferrer noopener">The 10 Species in the 2024 Player&rsquo;s Handbook</a></li>
  <li><a href="https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character" rel="noreferrer noopener">D&amp;D Beyond 2024 Creating a Character</a></li>
  <li><a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/races#Dragonborn" rel="noreferrer noopener">D&amp;D Beyond Basic Rules (2014) — Dragonborn</a></li>
  <li><a href="https://www.dndbeyond.com/species/16-dragonborn" rel="noreferrer noopener">D&amp;D Beyond legacy Dragonborn species page</a></li>
  <li><a href="https://www.dndbeyond.com/posts/1097-explore-the-chromatic-and-gem-dragonborn-from" rel="noreferrer noopener">Fizban chromatic and gem Dragonborn (official post)</a></li>
  <li><a href="https://www.dndbeyond.com/posts/1084-how-the-metallic-dragonborn-in-fizbans-treasury-of" rel="noreferrer noopener">Fizban metallic Dragonborn comparison (official post)</a></li>
  <li><a href="https://www.tokenmaker.one/" rel="noreferrer noopener">Token Maker home</a></li>
  <li><a href="https://www.tokenmaker.one/faq" rel="noreferrer noopener">Token Maker support FAQ</a></li>
  <li><a href="${EN_SQUARE_TOKEN_MAKER_PATH}" rel="noreferrer noopener">Square token maker</a></li>
  <li><a href="${EN_DND_RACES_PATH}" rel="noreferrer noopener">This site&rsquo;s DnD races guide</a></li>
  <li><a href="${DND_DRAGONBORN_VIDEO_URL}" rel="noreferrer noopener">How DM&rsquo;s react to what Race you play in Dungeons and Dragons</a> (entertainment clip, not a rules source)</li>
</ul>
`;

export const dndDragonbornArticleHtmlZh = String.raw`
<p><strong>开团前先问 DM：这桌的 dnd dragonborn 抄 2014 还是 2024。</strong>吐息花哪个动作、属性加值从哪来、会不会龙语、名字从哪一页抄，都跟这一问走。中文桌口头多叫龙裔；本站中文页把同一选项写成 Dragonborn。两套说法指向同一种可玩角色，不是《上古卷轴》里那个也叫龙裔的主角。</p>

<p>本页给已经决定玩龙裔的人做建卡核对，不代替<a href="${ZH_DND_RACES_PATH}">DND 种族指南</a>里十个 Species 的横向比较。读完应能在角色卡上分行写清机制来源和名字来源，把鳞色、伤害类型和抗性锁成一套，并留下一个语音里喊得出来的短称呼。</p>

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
      <th scope="row">2014 桌</th>
      <td><a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/races" rel="noreferrer noopener">2014 基础规则种族章</a>，或标注 Legacy 的 <a href="https://www.dndbeyond.com/species/16-dragonborn" rel="noreferrer noopener">Dragonborn Species 页</a></td>
      <td>不要把 2024 的熟练加值次数吐息、60 尺黑暗视觉或 5 级幽灵翼写进 2014 卡</td>
    </tr>
    <tr>
      <th scope="row">2024 桌</th>
      <td><a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-origins" rel="noreferrer noopener">2024 免费 Character Origins</a> 龙裔节，或 <a href="${DND_DRAGONBORN_2024_SPECIES_URL}" rel="noreferrer noopener">2024 Dragonborn Species 页</a></td>
      <td>不要把 2014 的力量 +2、魅力 +1 叠进 2024 背景加值</td>
    </tr>
    <tr>
      <th scope="row">只要 SRD 文本</th>
      <td>2014 用 <a href="https://5thsrd.org/character/races/dragonborn/" rel="noreferrer noopener">SRD 5.1 龙裔特质</a>；2024 用 <a href="https://5e24srd.com/character-origins/character-species.html" rel="noreferrer noopener">SRD 5.2 Species 龙裔节</a></td>
      <td>两份 SRD 都没有姓名附录，名字仍要另找 2014 名册或桌上约定</td>
    </tr>
    <tr>
      <th scope="row">DM 另开《费资本的巨龙宝库》</th>
      <td>先问 DM 开放的是哪一条变体，再打开那本书核对</td>
      <td>本页不代抄色彩 / 金属 / 宝石变体数值；要玩变体，先问 DM 开放哪一本再对书抄。</td>
    </tr>
  </tbody>
</table>

<h2>先问 DM：这桌的龙裔抄哪一页</h2>

<p>2014 规则把 Dragonborn 写成 Race；<a href="https://www.dndbeyond.com/posts/1393-moving-on-from-race-in-the-2024-core-rulebooks" rel="noreferrer noopener">2024 核心规则改称 Species</a>。中文桌口头仍说种族，并不妨碍你把卡面术语跟所用的书对齐。旧攻略如果让你靠种族属性去配职业，先看清它写的是哪个版本：<a href="https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character" rel="noreferrer noopener">2024 建角步骤</a>把属性加值交给背景，不交给 Species。</p>

<p>2014 基础规则把 Dragonborn 列为不那么常见的冒险者选项，和侏儒、半精灵、半兽人、提夫林放在同一组。这是风味判断，不是出现率统计，也不等于 2024 桌必须把它当稀有角色来演。</p>

<p>2024 免费 Character Origins 列出九个 Species，其中包含 Dragonborn。D&amp;D Beyond 介绍 2024《玩家手册》十个 Species 的文章另把 Aasimar 算进核心十个；Aasimar 不在免费 Character Origins 列出的九个 Species 里。龙裔本身在免费页和十 Species 名单里都有，不需要靠 Aasimar 那一行才能建卡。</p>

<table>
  <thead>
    <tr>
      <th scope="col">卡上这一栏</th>
      <th scope="col">2014</th>
      <th scope="col">2024 免费页</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">术语</th>
      <td>Race</td>
      <td>Species</td>
    </tr>
    <tr>
      <th scope="row">属性加值</th>
      <td>力量 +2，魅力 +1</td>
      <td>由背景三项里分配，Species 不再给加值</td>
    </tr>
    <tr>
      <th scope="row">吐息怎么花</th>
      <td>用动作喷一次，短休或长休后才能再用</td>
      <td>在攻击动作里替换其中一次攻击，次数等于熟练加值，长休恢复</td>
    </tr>
    <tr>
      <th scope="row">黑暗视觉</th>
      <td>2014 免费龙裔页没有这一项</td>
      <td>60 尺</td>
    </tr>
    <tr>
      <th scope="row">飞行</th>
      <td>外形描写写明没有翅膀；特质里也没有飞行</td>
      <td>5 级起幽灵翼，每长休一次</td>
    </tr>
    <tr>
      <th scope="row">语言</th>
      <td>通用语和龙语写在种族条目里</td>
      <td>Species 页没有语言特质，出身步骤另选</td>
    </tr>
    <tr>
      <th scope="row">名字附录</th>
      <td>种族章印有个人名、氏族名、乳名</td>
      <td>免费 Origins 与 2024 Species 页均未重印名册</td>
    </tr>
  </tbody>
</table>

<p>两栏不要自行拼成第三套规则。2024 团若允许沿用 2014 龙裔，也要按桌上约定的兼容办法处理，不能顺手把旧属性加值带进新的背景系统。机制来源和名字来源可以不是同一本书，但必须分行写明。</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_DRAGONBORN_TWO_SOURCE_LINES_IMAGE_PATH}"
    alt="摊开的龙裔角色卡上用两行分别写着机制来源 2024 和名字来源 2014，旁边放着一枚带角的圆形棋子"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>卡面上先分开写机制来源和名字来源。图是示意，不是真实编辑器截图，也不是某次跑团记录。</figcaption>
</figure>

<h2>中文桌怎么叫这个人</h2>

<p>搜 dnd dragonborn 的人，和搜「龙裔」的人，往往要做同一件事：把鳞色、吐息和名字写进卡。本站中文<a href="${ZH_DND_RACES_PATH}">种族指南</a>和<a href="${ZH_DND_LANGUAGES_PATH}">语言指南</a>在正文里保留 Dragonborn 这个英文词；中文资料标题则普遍写成龙裔，并括注 Dragonborn。开团前统一一个叫法即可，不必为了「更地道」把卡面术语改来改去。</p>

<p>三个容易混进来的对象，建卡时直接划掉：</p>

<ul>
  <li><strong>《上古卷轴》的龙裔。</strong>中文里同一个词也用来指天际主角 Dovahkiin。那是另一款游戏的主角，不会给你 D&amp;D 的吐息表、氏族名册或 2024 Species 特质。天际主角只是同名，不要抄错书。</li>
  <li><strong>邪龙末裔。</strong><a href="https://baike.baidu.com/item/%E9%82%AA%E9%BE%99%E6%9C%AB%E8%A3%94/65485077" rel="noreferrer noopener">邪龙末裔词条</a>把它写成带翼、带尾、由提亚玛特力量塑造的另一类龙血生物，不是玩家手册里的可玩 Dragonborn。</li>
  <li><strong>龙枪的龙人（draconians）。</strong>2014 官方页侧栏写：腐化金属龙蛋产生的邪恶龙裔叫 draconians，对应金、黄铜、青铜、赤铜、银，以特殊魔法能力代替吐息。那是龙枪设定，不是本篇默认建卡选项。</li>
</ul>

<p>本站种族文还写过：Dragonborn 的血统很难隐藏。这句对建卡仍然有用——鳞片、角和口鼻会决定陌生人第一眼看见什么，也会决定 Token 该裁哪一块。</p>

<h2>抄特性：吐息到底花哪个动作</h2>

<p>两版龙裔都从龙族祖先继承吐息和对应抗性，但回合里怎么花完全不是同一条规则。抄错版本的常见结果是：有人按 2014 把整次动作交给吐息，有人按 2024 在连击里塞一次喷吐，两个人却以为自己在用同一套龙裔。</p>

<table>
  <thead>
    <tr>
      <th scope="col">对照项</th>
      <th scope="col">2014</th>
      <th scope="col">2024</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">何时使用</th>
      <td>用你的动作喷出破坏性能量</td>
      <td>在自己回合执行攻击动作时，用喷吐替换其中一次攻击</td>
    </tr>
    <tr>
      <th scope="row">形状</th>
      <td>由祖先表固定：直线或锥形，不能每次改</td>
      <td>每次在 15 尺锥形，或 5 尺宽、30 尺长的直线里选</td>
    </tr>
    <tr>
      <th scope="row">豁免</th>
      <td>种类由祖先表决定，部分是敏捷，部分是体质</td>
      <td>区域内生物做敏捷豁免</td>
    </tr>
    <tr>
      <th scope="row">DC</th>
      <td>8 + 体质调整值 + 熟练加值</td>
      <td>8 + 体质调整值 + 熟练加值</td>
    </tr>
    <tr>
      <th scope="row">伤害</th>
      <td>失败 2d6，成功减半；6 级 3d6，11 级 4d6，16 级 5d6</td>
      <td>失败 1d10，成功减半；5 级 2d10，11 级 3d10，17 级 4d10</td>
    </tr>
    <tr>
      <th scope="row">次数与休息</th>
      <td>用过后须完成短休或长休才能再用</td>
      <td>次数等于熟练加值，完成长休恢复全部次数</td>
    </tr>
  </tbody>
</table>

<h3>2014：形状跟祖先绑死，吐息占掉整个动作</h3>

<p>2014 页把吐息写成一次完整动作。你有多次攻击以后，也不能把喷吐塞进其中一击。直线是 5 尺宽、30 尺长；锥形是 15 尺。黑、蓝、黄铜、青铜、赤铜走直线并做敏捷豁免；金、红走锥形并做敏捷豁免；绿、银、白走锥形并做体质豁免。用过这一口，短休或长休之前不要再按规则喷第二次。</p>

<p>2014 还有种族条目里的力量 +2 和魅力 +1，速度 30 尺，中型。年龄栏写：孵化后几小时能走，3 岁大约相当于人类 10 岁儿童，15 岁成年，大约活到 80 岁。这些数字只适用于 2014 文本，不要写进 2024 卡冒充新书附录。</p>

<h3>2024：喷吐替换一次攻击，形状当场选</h3>

<p>2024 页把吐息写进攻击动作：你可以在同一次攻击动作里，用喷吐换掉其中一次攻击。战士或圣武士到了能打两下的等级，就可以先砍一刀再喷一口，或先喷再打，只要这次动作里还有一次攻击可换。形状不再跟祖先表绑死，每次在锥形和直线之间选。豁免统一为敏捷。次数跟熟练加值走，长休才回满；短休不够。</p>

<p>2024 龙裔是类人、中型，身高写作大约 5 到 7 尺，速度 30 尺。这句和 2014 风味段「常常接近 6 尺半、300 磅以上」以及特质段「远超 6 尺、约 250 磅」不是同一句话。按你桌上那一页抄，不要合成一个「官方标准体重」。</p>

<h2>锁鳞色：外观、伤害、抗性一起写</h2>

<p>祖先一经选定，就同时决定三件事：别人看见的鳞色倾向、吐息的伤害类型、你获得的抗性。2024 页写明选择还会影响外观。不要先画一条红龙裔，再把吐息填成寒冷，除非 DM 明确允许外观和机械脱钩。</p>

<p>2014 风味段还写：龙裔看起来像直立的龙，但没有翅膀和尾巴；早期鳞色鲜艳，后代更常呈黄铜或青铜，也可能到猩红、锈色、金色或铜绿；有的氏族更接近真龙鳞色。2024 免费页改成更短的描写：无翼、两足、有鳞、眼睛明亮、头上有角，色彩让人想起龙族祖先。两段都是风味，不是强制涂装表。机械上真正锁死的是下面这张伤害类型表。</p>

<table>
  <thead>
    <tr>
      <th scope="col">龙种</th>
      <th scope="col">伤害类型</th>
      <th scope="col">2014 吐息形状与豁免</th>
      <th scope="col">2024</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">黑</th>
      <td>酸液</td>
      <td>5×30 尺直线，敏捷</td>
      <td>伤害类型相同；形状每次自选锥或直线</td>
    </tr>
    <tr>
      <th scope="row">蓝</th>
      <td>闪电</td>
      <td>5×30 尺直线，敏捷</td>
      <td>同上</td>
    </tr>
    <tr>
      <th scope="row">黄铜</th>
      <td>火焰</td>
      <td>5×30 尺直线，敏捷</td>
      <td>同上</td>
    </tr>
    <tr>
      <th scope="row">青铜</th>
      <td>闪电</td>
      <td>5×30 尺直线，敏捷</td>
      <td>同上</td>
    </tr>
    <tr>
      <th scope="row">赤铜</th>
      <td>酸液</td>
      <td>5×30 尺直线，敏捷</td>
      <td>同上</td>
    </tr>
    <tr>
      <th scope="row">金</th>
      <td>火焰</td>
      <td>15 尺锥形，敏捷</td>
      <td>同上</td>
    </tr>
    <tr>
      <th scope="row">绿</th>
      <td>毒素</td>
      <td>15 尺锥形，体质</td>
      <td>伤害仍是毒素；2024 豁免改为敏捷</td>
    </tr>
    <tr>
      <th scope="row">红</th>
      <td>火焰</td>
      <td>15 尺锥形，敏捷</td>
      <td>同上</td>
    </tr>
    <tr>
      <th scope="row">银</th>
      <td>寒冷</td>
      <td>15 尺锥形，体质</td>
      <td>伤害仍是寒冷；2024 豁免改为敏捷</td>
    </tr>
    <tr>
      <th scope="row">白</th>
      <td>寒冷</td>
      <td>15 尺锥形，体质</td>
      <td>伤害仍是寒冷；2024 豁免改为敏捷</td>
    </tr>
  </tbody>
</table>

<p>2024 祖先表只列龙种和伤害类型，没有宝石龙一行。想用宝石龙裔或《费资本》另外三套变体，先问 DM 开放哪本书，再打开该书核对。本页不代抄未核验的变体数值。</p>

<p>示例（不是某次实测，也不是官方固定搭配）：2014 桌选红龙祖先，卡上应同时出现火焰吐息、火焰抗性，以及 15 尺锥形、敏捷豁免。2024 桌选同一个红龙祖先，伤害和抗性仍是火焰，但喷吐时可以改选直线，豁免也改成敏捷。不要把 2014 的锥形限制写进 2024 卡，也不要把 2024 的「每次自选形状」写进 2014 卡。</p>

<h2>2024 多出来的两件事：暗视和 5 级翼</h2>

<p>2014 免费龙裔页没有黑暗视觉。2024 页给 60 尺黑暗视觉。从旧卡重练到 2024 时，这一项是新抄的，不是「本来就有、只是以前没写」。</p>

<p>5 级起，2024 龙裔获得 Draconic Flight。用附赠动作在背上长出幽灵翼，持续 10 分钟，或直到你主动收回（无需动作），或直到你陷入失能。期间获得等于你速度的飞行速度。翼看起来由与吐息相同类型的能量构成。每长休只能用一次。</p>

<p>这不是出生自带的肉翼。2014 外形段写明龙裔没有翅膀和尾巴。2024 免费页的引言同样写无翼两足，飞行是 5 级才出现的临时魔法。画立绘时，默认姿态仍应是无翼的；若要表现 5 级能力，应画成与吐息同色的幽灵翼，并在笔记里写清「每长休一次、最多 10 分钟」，以免队友以为你能一直飞。</p>

<p><a href="https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook" rel="noreferrer noopener">D&amp;D Beyond 介绍 2024 十个 Species</a>时也写：龙裔获得翅膀，是因为飞行是龙最酷的事情之一；那篇文章同时说明吐息改为可在攻击中使用、可选择锥或直线。具体数字仍以 Origins 和 Species 页为准，不要只凭介绍文补骰子。</p>

<h2>语言不要想当然</h2>

<p>2014 龙裔条目写明：你会说、读、写通用语和龙语。龙语被写成最古老的语言之一，常用于奥术研究，听起来生硬，多硬辅音和齿擦音。</p>

<p>2024 Dragonborn Species 页列出的特质是祖先、吐息、抗性、黑暗视觉和 5 级飞行，<strong>没有语言特质</strong>。2024 建角在出身步骤另选语言：角色至少会 Common，再从标准语言表掷出或选出两门。龙语在标准语言表里，起源列为 Dragons。你可以选它，那是出身语言步骤，不是 Species 赠品。</p>

<p>因此，2024 龙裔不会自动会龙语。战役里要读龙语铭文、跟龙谈判或替导师誊写龙语图纸，把龙语写进那两门标准语言之一，并给 DM 一句钩子。语言怎么挑，可以对照<a href="${ZH_DND_LANGUAGES_PATH}">DND 语言指南</a>；不要把语言指南里「战役有龙或 Dragonborn 再考虑龙语」理解成 2024 Species 已经自带龙语。</p>

<h2>龙裔名字：氏族名在前，桌上喊短的</h2>

<p>2014 基础规则种族章的 Dragonborn Names 与 Legacy Species 页一致：龙裔出生时有个人名，但把氏族名放在前面，作为荣耀标记。同窝亲属常用乳名或绰号，可能纪念一次事件，或描述一个习惯。</p>

<p>2024 免费 Character Origins、2024 Species 页、SRD 5.1 龙裔页和 SRD 5.2 Species 龙裔节都没有印刷姓名附录。2024 桌若要用官方名单，须经 DM 同意借用 2014 名册，并在卡上分行写「机制来源：2024；名字来源：2014」。这不是 2024 官方继承声明。付费 2024《玩家手册》纸书不在本页核对范围内，因此不声称那本书里有或没有另一份名单。</p>

<p>完整名单以 <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/races" rel="noreferrer noopener">2014 基础规则种族章</a>为准。下面每列只留两三个印刷拼写，用来核对写法；不要自行改字。官方女性名单里是 Havilar，不是 Flavilar。</p>

<table>
  <thead>
    <tr>
      <th scope="col">栏位</th>
      <th scope="col">印刷拼写（保持原文）</th>
      <th scope="col">写在哪</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">男性个人名</th>
      <td>Arjhan, Kriv, Medrash</td>
      <td>卡面个人名；可作短称呼的候选</td>
    </tr>
    <tr>
      <th scope="row">女性个人名</th>
      <td>Akra, Havilar, Nala</td>
      <td>同上</td>
    </tr>
    <tr>
      <th scope="row">乳名</th>
      <td>Climber, Leaper, Shieldbiter</td>
      <td>同窝亲属之间的俗称；适合当桌上称呼</td>
    </tr>
    <tr>
      <th scope="row">氏族名</th>
      <td>Clethtinthiallor, Daardendrian, Kepeshkmolik</td>
      <td>放在个人名前面；完整氏族名不要塞进棋子标签</td>
    </tr>
  </tbody>
</table>

<p>2014 文本没有给这些名字加英文释义。网络生成器附带的「含义」未出现在已打开的官方名单里，不要抄进卡面冒充附录。</p>

<p>中文语音里，把 Clethtinthiallor 整串当战场称呼很难一次喊清。这不是 2014 禁止用氏族名，而是桌上可观察的问题。建议把职能拆开（桌上约定，不是新规则）：</p>

<ul>
  <li><strong>卡面正式名</strong>按官方顺序写「氏族名 + 个人名」，例如 Daardendrian Medrash。</li>
  <li><strong>桌上称呼</strong>用乳名、短个人名，或两到四个汉字的自造词，并标明是桌上约定。例如 Shieldbiter、Kriv、Nala。</li>
  <li><strong>背景里的更多名字</strong>可以写在传记栏，不要挤进姓名栏和棋子标签。</li>
</ul>

<p>中文规范译名需要可核验的 2014 中文译本或同等正文；当前卡面保留英文印刷拼写，避免把未核验的汉字写进官方名册栏。</p>

<p>设计示例（非官方固定组合，也不是真实玩家反馈）：从 2014 名册抄氏族名 Kepeshkmolik 和个人名 Nala，卡面写 Kepeshkmolik Nala，来源注明 2014 Dragonborn Names。语音开团时全桌喊 Nala，或自造桌上称呼「啃盾」并标明约定。不要把「啃盾」写进官方名册栏，那只是乳名 Shieldbiter 的桌上用法示例。</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_DRAGONBORN_CLAN_AND_CALLNAME_IMAGE_PATH}"
    alt="羊皮纸上写着长氏族名加个人名，旁边一枚龙裔棋子只印着短称呼 Nala"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>卡面保留氏族名加个人名，棋子上只放短称呼。图是示意，不是印刷名册扫描件。</figcaption>
</figure>

<p>名字确定方法可以参考本站<a href="/zh/blog/dnd-gnome-names">侏儒名字</a>那套「先认名册、卡面写全名、语音用短称呼」，但名册本身不要混用。龙裔抄 2014 龙裔四列，不要把侏儒的绰号表或矮人氏族姓写进龙裔卡。</p>

<h2>做成能认出来的 Token</h2>

<p>圆形 VTT Token 很小。龙裔要让人在缩尺地图上认出「这是龙裔，而且是哪一条」，优先保留头、角和口鼻，再保留一块清楚的鳞色。细碎的胸甲花纹和六条饰带，缩小后帮不上忙。</p>

<p>裁切时角很容易被圆形遮罩切掉。肩甲、角根或喷吐时的口型需要更多边缘，就改用方形遮罩，流程见<a href="${ZH_SQUARE_TOKEN_MAKER_PATH}">方形 Token 制作器</a>。边框颜色跟吐息伤害类型走：红龙火焰用暖色边，白龙寒冷用冷色边，不要红鳞配没有来源的蓝框还声称「对应吐息」。这是视觉建议，不是规则书条款。</p>

<p>棋子文字栏只放桌上短称呼。完整氏族名留在角色卡。Token Maker 不会生成官方龙裔名字，也不内置 2014 名册；先按上一节抄好名字，再进编辑器。</p>

<p>鳞色和角确定后，打开<a href="${ZH_EDITOR_PATH}">Token Maker 中文编辑器</a>：立绘可以留在浏览器里裁切、加框，<a href="/zh/faq">导出透明 PNG</a>，面向 Roll20、Foundry VTT 与 Owlbear。日常桌面可先导出 512，近看或归档用 1024，需要更高清晰度时用 2048。这些是本站建议尺寸，不是平台最低规格。<a href="/zh/privacy">隐私说明</a>写明普通 PNG 下载留在本地；复制分享链接会上传生成后的图。</p>

<ol>
  <li>选定版本和祖先，写下伤害类型与抗性。</li>
  <li>从 2014 名册抄氏族名和个人名，另定一个短称呼。</li>
  <li>裁切时把角、眼睛和口鼻留在框内，鳞色块要一眼能看见。</li>
  <li>边框或主色与吐息类型一致；文字只放短称呼。</li>
  <li>导出透明 PNG，放到开团常用缩放比例下看：认不出龙裔，就回去放宽裁切或改方形。</li>
</ol>

<p>开团前用这五条检查卡面，不必再翻一遍十个 Species 总表：版本有没有写清；吐息规则有没有抄成另一版；鳞色、伤害、抗性是否同一套；2024 卡有没有误写自带龙语；名字来源和桌上称呼有没有分开。五条都过，这名 dnd dragonborn 就可以上桌。</p>
`;
