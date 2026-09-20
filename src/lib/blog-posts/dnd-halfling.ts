import {
  DND_HALFLING_CHARACTER_CARD_FIELDS_IMAGE_PATH,
  DND_HALFLING_CROP_DECISION_IMAGE_PATH,
  DND_HALFLING_TOKEN_CROP_COMPARISON_IMAGE_PATH,
  DND_HALFLING_TRAIT_TRIGGER_MATRIX_IMAGE_PATH,
  DND_HALFLING_VERSION_BRANCH_IMAGE_PATH,
  DND_HALFLING_VERSION_LOCK_IMAGE_PATH,
  EN_DND_RACES_PATH,
} from './shared';

export const dndHalflingArticleHtml = String.raw`
<p>A D&amp;D Halfling entry is safe to copy only after you tie it to the rules year your table uses. The 2014 Basic Rules race and the 2024 Basic Rules species are separate branches: their Speed, creation fields, and some trait wording differ, so the two rows must not be merged. Write <code>2014/legacy</code> or <code>2024</code> on the character card, then copy only that branch.</p>

<p>The <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-origins#Halfling" rel="noreferrer noopener">2024 Basic Rules Halfling entry</a> describes the character as a Humanoid with Small size (about 2–3 feet tall) and a Speed of 30 feet. The entry lists Brave, Halfling Nimbleness, Luck, and Naturally Stealthy. The <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/races#Halfling" rel="noreferrer noopener">2014 Basic Rules race entry</a> instead gives the older race block, including 25-foot Speed, +2 Dexterity, and the Lightfoot or Stout choice.</p>

<p>Ask which source your table permits, write that source at the top of the card, and fill the matching identity, traits, and creation fields. Only after the rules branch is settled should you choose one character cue and decide how to keep it readable in a VTT token. The token step is an optional way to carry the finished concept into an image; it does not change the rules entry.</p>

<h2>Lock the rules source before copying a Halfling entry</h2>

<h3>Use the source labels as a visible input</h3>

<p>Start with the book or rules page, not an unlabelled search result. The <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/races#Halfling" rel="noreferrer noopener">2014 Basic Rules page</a> calls Halfling a <strong>race</strong>; the <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-origins#Halfling" rel="noreferrer noopener">2024 Basic Rules page</a> places it under <strong>Character Species</strong>. Write the permitted source as <code>2014/legacy</code> or <code>2024 Basic Rules</code>. A platform label is not permission to combine columns.</p>

<h3>Do not merge the two rows</h3>

<p>A card that borrows one value from each year is a mixed card with no single source. A card with 2014 +2 Dexterity and 25-foot Speed, 2024 Luck wording, and a Lightfoot line is not a third official option.</p>

<table>
  <thead>
    <tr>
      <th>Card field</th><th>2014/legacy race</th><th>2024 Basic Rules species</th>
    </tr>
  </thead>
  <tbody>
<tr>
<td>Entry label</td>
<td>Race</td>
<td>Species</td>
</tr>
<tr>
<td>Speed</td>
<td>25-foot base walking speed</td>
<td>30 feet</td>
</tr>
<tr>
<td>Ability-score source</td>
<td>+2 Dexterity in the race entry</td>
<td>No Species ability-score increase is listed in the 2024 Basic Rules Halfling entry</td>
</tr>
<tr>
<td>Lightfoot/Stout</td>
<td>Two 2014 subrace choices</td>
<td>No selectable Lightfoot or Stout option is listed in the 2024 Basic Rules entry</td>
</tr>
<tr>
<td>Trait wording</td>
<td>2014 Lucky, Brave, and Halfling Nimbleness</td>
<td>2024 Luck, Brave, Halfling Nimbleness, and Naturally Stealthy</td>
</tr>
  </tbody>
</table>

<h3>Bound the older-source compatibility case</h3>

<p>For a table that permits an older Species or Background under 2024 creation, the <a href="https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character#BackgroundsandSpeciesfromOlderBooks" rel="noreferrer noopener">compatibility sidebar</a> says to ignore an older Species’ ability-score increases and use the Background’s. An older Background without those increases receives +2 and +1, or +1 to each of three scores; without a feat, it grants an Origin feat of choice. The sidebar does not settle every old option or DM permission, so keep other conversions as table decisions.</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img class="inline-figure__image inline-figure__image--wide" src="${DND_HALFLING_VERSION_LOCK_IMAGE_PATH}" alt="A curly-haired Halfling adventurer in a moss-green cloak reading a weathered travel book by candlelight in a fantasy tavern, with a shield and dice on the table" width="1536" height="1024" loading="lazy" decoding="async" />
  <figcaption>A character scene for the source check: settle the table’s 2014/legacy or 2024 source before copying Halfling values.</figcaption>
</figure>

<h2>Copy the 2024 Basic Rules Halfling branch</h2>

<h3>Record the identity fields once</h3>

<p>On a 2024 card, copy <strong>Creature Type: Humanoid</strong>, <strong>Size: Small (about 2–3 feet tall)</strong>, and <strong>Speed: 30 feet</strong> from the <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-origins#Halfling" rel="noreferrer noopener">2024 Halfling entry</a>. Keep “about”: it is a rules description, not an exact measurement or an image-size instruction.</p>

<h3>Turn the four traits into usable conditions</h3>

<p>The <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-origins#Halfling" rel="noreferrer noopener">2024 Halfling trait text</a> gives each feature a trigger or limit worth carrying onto the card. The notes in the right column are table-use reminders, not extra rules.</p>

<table>
  <thead>
    <tr>
      <th>2024 trait</th><th>What the entry says</th><th>Card reminder</th>
    </tr>
  </thead>
  <tbody>
<tr>
<td><strong>Brave</strong></td>
<td>Advantage on saving throws to avoid or end Frightened.</td>
<td>Advantage only, not immunity.</td>
</tr>
<tr>
<td><strong>Halfling Nimbleness</strong></td>
<td>Move through the space of a creature a size larger than you, but you can’t stop in the same space.</td>
<td>Can pass through; cannot stop in that space.</td>
</tr>
<tr>
<td><strong>Luck</strong></td>
<td>If the d20 of a D20 Test is 1, you can reroll it; if you do, you must use the new roll.</td>
<td>No other dice or automatic success.</td>
</tr>
<tr>
<td><strong>Naturally Stealthy</strong></td>
<td>Hide when the only obscuring creature is at least one size larger.</td>
<td>Check the larger obscurer; not universal Hide.</td>
</tr>
  </tbody>
</table>

<h3>Brave is a saving-throw benefit, not immunity</h3>

<p>The 2024 wording covers saving throws to avoid or end <strong>Frightened</strong>. Write that trigger beside Brave: it gives Advantage on the qualifying roll, not immunity or an automatic success.</p>

<h3>Nimbleness changes the path, not the destination</h3>

<p>If a larger creature occupies a route, 2024 Nimbleness says you can move through the space of a creature a size larger than you, but you can’t stop in the same space. Do not paste this sentence into the 2014 text.</p>

<h3>Luck has a named boundary</h3>

<p>The <a href="https://www.dndbeyond.com/sources/dnd/br-2024/playing-the-game#D20Tests" rel="noreferrer noopener">2024 D20 Tests rules</a> define the term as an ability check, saving throw, or attack roll. When the d20 of a D20 Test is 1, you can reroll it; if you do, you must use the new roll. This does not apply to damage or other dice.</p>

<h3>Naturally Stealthy requires the obscurer</h3>

<p>Naturally Stealthy is a conditional route to Hide. The only obscuring thing must be a creature at least one size larger; the feature does not make a character hidden in open space. Keep that condition beside the name instead of shortening it to “stealth.”</p>

<h3>Keep creation choices on Background</h3>

<p>The 2024 Basic Rules Species entry does not list a Species ability-score increase, Halfling-specific feat, or selectable Lightfoot/Stout. The <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-origins#PartsofaBackground" rel="noreferrer noopener">2024 Background rules</a> supply +2 and +1, or +1 to all three eligible scores, plus a specified Origin feat. Keep those fields under Background; do not add 2014 Dexterity or subrace bonuses to this branch.</p>

<h2>Keep the 2014/legacy race on its own card</h2>

<h3>Record the 2014 common block</h3>

<p>Label this block <code>2014/legacy</code> first. The <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/races#Halfling" rel="noreferrer noopener">2014 Basic Rules Halfling entry</a> calls Halfling a <strong>race</strong> and gives +2 Dexterity, Small size described as about 3 feet tall and about 40 pounds, a 25-foot base walking speed, and the ability to speak, read, and write Common and Halfling. “About” is part of the source description, not an exact measurement.</p>

<p>Keep these values inside the 2014 branch. The 25-foot number is not generic Halfling Speed, and Common/Halfling is not a line to copy into the 2024 Basic Rules Species entry.</p>

<h3>Keep legacy trait wording separate</h3>

<p>The <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/races#Halfling" rel="noreferrer noopener">2014 entry</a> says <strong>Lucky</strong> applies when a d20 attack roll, ability check, or saving throw is a 1: you can reroll the die; if you do, you must use the new roll. <strong>Brave</strong> grants Advantage on saving throws against being frightened. <strong>Halfling Nimbleness</strong> allows movement through the space of a larger creature. The 2014 wording does not add the <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-origins#Halfling" rel="noreferrer noopener">2024 entry’s</a> sentence about stopping in the same space, so do not infer permission to stop from the shorter text; keep the source labels beside the trait text.</p>

<h3>Give the two 2014 subrace choices</h3>

<p>When the 2014 source is permitted, the entry tells the player to choose one of two subraces. Keep the choice on the 2014 card and do not present both bonuses as a stack.</p>

<table>
  <thead>
    <tr>
      <th>2014 subrace</th><th>What to copy</th><th>What to check at the table</th>
    </tr>
  </thead>
  <tbody>
<tr>
<td><strong>Lightfoot</strong></td>
<td>+1 Charisma and Naturally Stealthy: you can attempt to Hide when the only thing obscuring you is a creature at least one size larger.</td>
<td>The choice is one 2014 subrace, not a 2024 Species option. Preserve the obscuring-creature condition.</td>
</tr>
<tr>
<td><strong>Stout</strong></td>
<td>+1 Constitution and Stout Resilience: Advantage on saving throws against poison and resistance to poison damage.</td>
<td>Keep both the saving-throw benefit and damage resistance together; do not shorten them to “poison proof.”</td>
</tr>
  </tbody>
</table>

<p>In the 2024 Basic Rules entry, “stout” and “lightfoot” appear in descriptive naming context, but Lightfoot and Stout are not selectable Halfling mechanics there. Another book or setting needs its own source and table decision.</p>

<h3>Add only a bounded naming note</h3>

<p>The <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/races#Halfling" rel="noreferrer noopener">2014 Basic Rules entry</a> provides a given name, family name, and optional nickname pattern. Use the pattern for the 2014 branch; a long list is outside this entry. The free 2024 Basic Rules page does not establish a current paid-book name appendix, so do not invent an “official 2024 list.”</p>

<h3>Run the non-mixing check</h3>

<p>Keep every 2014 field in this branch; do not carry it into the 2024 card.</p>

<h2>Apply the selected branch to the character card</h2>

<h3>Complete a 2024 card in source order</h3>

<p>For the current branch, use this sequence:</p>

<ol>
<li>Write <code>2024 Basic Rules</code> beside the Species field.</li>
<li>Copy Humanoid, Small (about 2–3 feet tall), and 30-foot Speed from the <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-origins#Halfling" rel="noreferrer noopener">2024 Halfling entry</a>.</li>
<li>Copy Brave, Halfling Nimbleness, Luck, and Naturally Stealthy with their triggers and limits, not as one-word tags.</li>
<li>Read the permitted Background for its eligible ability scores and specified Origin feat.</li>
<li>Leave 2014 +2 Dexterity, Common/Halfling, Lightfoot, and Stout out of this branch unless the table has deliberately moved to the 2014 card.</li>
</ol>

<h3>Handle an older source only within the stated compatibility rule</h3>

<p>If the table permits an older Species and Background while using the 2024 creation framework, use the <a href="https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character#BackgroundsandSpeciesfromOlderBooks" rel="noreferrer noopener">older-source compatibility guidance</a> for the parts it actually covers. Ignore the older Species ability-score increases and use the Background treatment. For an older Background without ability-score adjustments, apply the stated +2/+1 or three +1 method; if it has no feat, take an Origin feat of choice.</p>

<p>That guidance is not a universal conversion engine for old subraces, settings, languages, or permissions. Leave those questions as table decisions and open the exact permitted book rather than guessing.</p>

<h3>Complete a 2014 card without importing newer text</h3>

<p>For the legacy branch, write <code>2014/legacy</code>, copy the 2014 common block, and choose exactly one Lightfoot or Stout subrace when that source is permitted. Keep the 2014 Lucky, Brave, and Halfling Nimbleness wording together. Do not swap in the 2024 Naturally Stealthy entry as though it were part of the common race block, and do not add a 2024 Species/Background split to a card that is intentionally using the 2014 race presentation.</p>

<h3>Use rule applications, not rankings</h3>

<p>These examples show how to read a completed card. They are hypothetical rule applications, not play reports and not evidence that one branch or class is “best.”</p>

<table>
  <thead>
    <tr>
      <th>Table condition</th><th>2024 card action</th><th>2014/legacy card action</th>
    </tr>
  </thead>
  <tbody>
<tr>
<td>A saving throw is made to avoid or end Frightened</td>
<td>If the 2024 card is active, roll that qualifying save with Advantage from Brave; for another save, roll without that feature.</td>
<td>If the 2014 card is active, roll a saving throw against being frightened with Advantage from Brave; for another save, roll without that feature.</td>
</tr>
<tr>
<td>A larger creature occupies the planned route</td>
<td>If the 2024 card is active, you can move through the space of a creature a size larger than you, but you can’t stop in the same space; if no larger creature is involved, use normal movement.</td>
<td>Use only the 2014 Nimbleness wording for movement through a larger creature’s space; if no larger creature is involved, use normal movement. The 2014 wording does not add the 2024 sentence about stopping in the same space.</td>
</tr>
<tr>
<td>A d20 roll shows 1</td>
<td>First classify it as an ability check, saving throw, or attack roll; if it is one of those D20 Tests, you can reroll it; if you do, you must use the new result. Do not invoke Luck for damage or another die.</td>
<td>If it is an attack roll, ability check, or saving throw, you can reroll the die; if you do, you must use the new roll; otherwise do not invoke Lucky.</td>
</tr>
<tr>
<td>The player wants to Hide</td>
<td>If the only obscuring creature is at least one size larger, apply Naturally Stealthy; if not, check the ordinary Hide requirements.</td>
<td>If Lightfoot is the chosen subrace, apply its conditional Hide rule; if not, do not apply the Lightfoot feature.</td>
</tr>
<tr>
<td>Poison is the outcome to resolve</td>
<td>Keep Stout Resilience off this card and resolve poison from the applicable 2024 rules.</td>
<td>If Stout is the chosen subrace, record poison-save Advantage and poison-damage resistance; otherwise leave both Stout benefits off the card.</td>
</tr>
  </tbody>
</table>

<h3>Choose one identity cue</h3>

<p>Rules text gives the card its branch; a single concept cue gives the player something to carry into speech, notes, and art. The <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-origins#Halfling" rel="noreferrer noopener">2024 Halfling description</a> discusses community, home, travel, and adventure. Choose one as campaign flavor, label it as the player’s concept, and do not present it as a universal Halfling rule. A short phrase is easier to carry into a token than a whole culture or equipment list.</p>

<p>Read the completed card in this order: source and year, matching identity and traits, creation source, then one cue. For 2024, the creation line points to Background and Origin feat handling; for 2014, it points to the single Lightfoot or Stout choice. If one line points to both, the card is not ready. This four-line read is also useful when a character is rebuilt after a rules update: preserve the concept cue only after the rules branch has been rebuilt.</p>

<h2>Optional: preserve one identity cue in a readable VTT token</h2>

<h3>Separate <code>Small</code> from image dimensions</h3>

<p>The game label <code>Small</code> does not determine PNG pixels, a mask, VTT footprint, grid occupancy, or print size. Choose those from the artwork and map scale: preserve the face when it is the cue, or preserve the chosen prop instead of shrinking the image because the rules say Small. The Halfling entries establish no Small-to-pixels conversion.</p>

<h3>Keep one cue visible</h3>

<p>Turn the identity phrase into one visible signal: a readable face or a single pack, lantern, map case, or other chosen prop. These are design examples, not official equipment or personality rules. Check the crop at campaign map scale; if the face disappears or the prop becomes a blur, simplify the cue or choose another. This is a readability decision, not a measurement of game size.</p>

<h3>Make the mask choice conditional</h3>

<p>The <a href="https://www.tokenmaker.one/" rel="noreferrer noopener">Token Maker homepage and editor workspace</a> visibly presents circle, square, and polygon masks with border, text, and PNG export controls. That supports a shape choice, not a claim about upload, file bytes, or VTT compatibility. Start with a circle for a face-led portrait, a square for equipment or a wide pose, or a polygon as a deliberate campaign signal. None is a D&amp;D requirement or measured best result.</p>

<h3>Keep the product link optional</h3>

<p>If the cue is already clear, no editor is required. To try the visible crop and mask workflow, use <a href="https://www.tokenmaker.one/" rel="noreferrer noopener">Token Maker</a> as an optional next step, then check the actual file and intended VTT workflow yourself; visible controls are not compatibility proof.</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img class="inline-figure__image inline-figure__image--wide" src="${DND_HALFLING_CROP_DECISION_IMAGE_PATH}" alt="A curly-haired Halfling scout crouching at a sunlit forest edge with a short sword and leaf-patterned shield clearly visible" width="1536" height="1024" loading="lazy" decoding="async" />
  <figcaption>Keep the face and one readable prop visible when checking the character at map scale. The shape is a design choice, not a rule for Small creatures.</figcaption>
</figure>

<h2>Run the final character-card completion check</h2>

<h3>Use a pass/fail checklist</h3>

<p>The card is ready for the table when each answer is explicit:</p>

<ul>
<li>The card says <code>2014/legacy</code> or <code>2024 Basic Rules</code>; it does not rely on an unlabelled “5e” note.</li>
<li>Every copied identity, Speed, trait, ability-score, feat, language, and subrace line points to the matching source branch.</li>
<li>The 2024 card uses the 2024 Basic Rules Humanoid, Small, 30-foot block and four conditional traits; it does not inherit 2014 fields by habit.</li>
<li>The 2014 card keeps +2 Dexterity, 25-foot Speed, Common/Halfling, the 2014 trait wording, and exactly one Lightfoot or Stout choice.</li>
<li>Background and Origin-feat handling are visible on the 2024 card; older-source compatibility is applied only where the permitted sidebar fits.</li>
<li>The card states one identity cue without turning campaign flavor into a universal Halfling rule.</li>
<li>Any token crop is judged from the artwork and map scale, not from a guessed Small-to-pixels conversion.</li>
</ul>

<p>If one answer is unclear, the card is not finished. The fix is usually to return to the source label or the exact rule page instead of filling a missing field with general lore.</p>

<p>A 2024 card that says “Small, 25 feet, +2 Dexterity, Lightfoot” fails the check even if each phrase appears somewhere in a familiar reference. Those values belong to the 2014 branch. A 2014 card that replaces its subrace with the 2024 Naturally Stealthy entry has the same problem in reverse: the words sound compatible, but the source block is no longer identifiable.</p>

<h3>Stop when the source is unknown</h3>

<p>If nobody can identify the permitted year or source, pause before copying a trait, Speed, language, ability score, or subrace. Ask the DM or open the rulebook the table actually allows. Do not fill the blank by taking 2014 numbers, 2024 wording, and a familiar subrace from different columns.</p>

<h3>Use the broader comparison only when you need it</h3>

<p>Once the Halfling card passes the source check, the one-species task is done. For a comparison across all D&amp;D species, use the <a href="${EN_DND_RACES_PATH}" rel="noreferrer noopener">DnD Races overview</a>.</p>

<h2>Public sources</h2>

<ul>
<li><a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-origins#Halfling" rel="noreferrer noopener">D&amp;D Beyond Basic Rules (2024), Character Origins</a> — 2024 Halfling identity, traits, Background relationship, and descriptive framing.</li>
<li><a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/races#Halfling" rel="noreferrer noopener">D&amp;D Beyond Basic Rules (2014), Races</a> — 2014 Halfling race, trait wording, Lightfoot/Stout, and naming pattern.</li>
<li><a href="https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character#BackgroundsandSpeciesfromOlderBooks" rel="noreferrer noopener">D&amp;D Beyond Basic Rules (2024), Backgrounds and Species from Older Books</a> — limited older-source ability-score and missing-Origin-feat handling.</li>
<li><a href="https://www.dndbeyond.com/sources/dnd/br-2024/playing-the-game#D20Tests" rel="noreferrer noopener">D&amp;D Beyond Basic Rules (2024), D20 Tests</a> — the three categories covered by the 2024 D20 Test term.</li>
<li><a href="https://www.tokenmaker.one/" rel="noreferrer noopener">Token Maker homepage and editor workspace</a> — visible mask and crop-related product copy; not upload, export, or VTT compatibility proof.</li>
<li><a href="${EN_DND_RACES_PATH}" rel="noreferrer noopener">DnD Races: Which Species Fits Your Character?</a> — the broader site comparison for readers who need all-species context.</li>
</ul>
`;

export const dndHalflingArticleHtmlZh = String.raw`
<p>如果你已经决定玩半身人，先让 DM 确认 2014 或 2024，再只抄对应一栏；不要把 <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/races#Halfling" rel="noreferrer noopener">2014 的 +2 Dexterity、Lightfoot/Stout</a> 与 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-origins#PartsofaBackground" rel="noreferrer noopener">2024 的 Background 加成</a> 拼在一起。带入旧书时先按 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character#BackgroundsandSpeciesfromOlderBooks" rel="noreferrer noopener">2024 旧书兼容说明</a> 处理。依次把年份、来源、体型、速度、特性和属性值来源写进角色卡，再按肖像和地图缩放裁 Token。年份或旧书许可未确认，就留给 DM，不要补数字。</p>

<p>如果你还在比较十种 Species，先看站内的 <a href="https://tokenmaker.one/zh/blog/dnd-races" rel="noreferrer noopener">DND 种族总览</a>；已经决定玩半身人后，再回到本文锁定版本和卡面字段。</p>

<h2>先锁定这桌使用的半身人规则</h2>

<h3>先确认 DM 允许的规则来源</h3>

<p>半身人建卡时，先不要把两套角色创建流程抄到同一张卡上。D&amp;D Beyond 将旧条目放在 <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/races#Halfling" rel="noreferrer noopener">Basic Rules (2014) 的半身人章节</a>，将新条目放在 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-origins#Halfling" rel="noreferrer noopener">2024 Basic Rules 的 Character Origins 半身人章节</a>。开卡前在纸面或电子卡上写一行“规则来源：2014”或“规则来源：2024”，再抄下面那一栏。</p>

<p>D&amp;D Beyond 可能显示 5e/5.5e 标签；官方说明用它们区分 2014 内容和更新后的规则。标签只是页面标记，不是把两版拼成第三套规则；名称变化见 <a href="https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook" rel="noreferrer noopener">2024 Player’s Handbook 的 Species 说明</a>。DM 只说“用 5e”时，先问清年份、书名或页码。</p>

<h3>2024 Species：属性值和 Origin Feat 看 Background</h3>

<p>2024 半身人条目记为 Humanoid、Small，描述身高约 2–3 英尺、Speed 30 英尺；四项特性是 Brave、Halfling Nimbleness、Luck 和 Naturally Stealthy。条目未列 Species 属性值加成，也未列 Lightfoot/Stout 机械选项。具体字段见 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-origins#Halfling" rel="noreferrer noopener">2024 半身人规则条目</a>。</p>

<p>属性值和 Origin Feat 查 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-origins#PartsofaBackground" rel="noreferrer noopener">2024 Character Origins 的 Background 栏</a>：Background 提供一个属性 +2、另一个 +1，或三个各 +1，并给指定 Origin Feat。半身人的灵活印象不能让你在 Species 栏手写 Dexterity 加成；2024 条目没有这样列。</p>

<h3>2014 Race：共同字段和 Lightfoot/Stout 分开抄</h3>

<p>2014 条目使用 race/subrace。共同字段是 Dexterity +2、Small（约 3 英尺、约 40 磅）、25 英尺基础步行速度，以及读写和口说 Common/Halfling。按允许来源二选一：Lightfoot 为 Charisma +1 和 Naturally Stealthy，Stout 为 Constitution +1 和 Stout Resilience。它们都来自 <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/races#Halfling" rel="noreferrer noopener">2014 Basic Rules 半身人条目</a>，不能去掉年份后搬进 2024 栏。</p>

<h3>旧书带入 2024 时不要叠加两套属性值</h3>

<p>DM 允许在 2024 使用旧书 Species 或 Background 时，先按 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character#BackgroundsandSpeciesfromOlderBooks" rel="noreferrer noopener">2024 的旧书兼容说明</a>处理：忽略旧 Species 属性值，改用 Background；没有属性值加成的旧 Background，按页面的 +2/+1 或三个 +1 处理；缺少 Feat 时取得一个自选 Origin Feat。兼容说明只覆盖属性值和缺失 Feat，不替 DM 决定其他旧特性、扩展书来源或桌规许可。能用后仍保留一个明确的版本标记。</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img class="inline-figure__image inline-figure__image--wide" src="${DND_HALFLING_VERSION_BRANCH_IMAGE_PATH}" alt="雨后村庄石路上的半身人冒险者，手持短剑、背着橡叶纹盾牌，远处是山村与薄雾" width="1536" height="1024" loading="lazy" decoding="async" />
  <figcaption>先确认规则来源，再把同一角色的身份线索带进角色卡和冒险场景。</figcaption>
</figure>

<h2>按年份把半身人字段写进角色卡</h2>

<p>把大段规则抄成卡面时，可以按“年份与来源 → 体型和速度 → 属性值来源 → 特性 → 身份标签”的顺序。这与 <a href="https://tokenmaker.one/zh/blog/dnd-character-sheet" rel="noreferrer noopener">DND 角色卡按创角顺序填写的指南</a>一致：先钉住会改变后续选择的字段，再补描述文字。下表只用于回查，不替你选择 DM 未批准的来源。</p>

<table>
  <thead>
    <tr>
      <th>卡面字段</th><th><a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-origins#Halfling" rel="noreferrer noopener">2024 Species</a></th><th><a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/races#Halfling" rel="noreferrer noopener">2014 Race</a></th>
    </tr>
  </thead>
  <tbody>
<tr>
<td>版本与术语</td>
<td>写 2024；Species；来源页写 Character Origins</td>
<td>写 2014；Race；来源页写 Basic Rules</td>
</tr>
<tr>
<td>类型、体型、速度</td>
<td>Humanoid；Small；30 英尺</td>
<td>Small；约 3 英尺、约 40 磅；25 英尺基础步行速度</td>
</tr>
<tr>
<td>属性值与专长</td>
<td>属性值写在 Background；由 Background 提供 +2/+1 或三个 +1，以及 Origin Feat</td>
<td>Race 的 Dexterity +2；Background 按 2014 规则另行填写</td>
</tr>
<tr>
<td>特性（按版本）</td>
<td>Brave、Halfling Nimbleness、Luck、Naturally Stealthy</td>
<td>Lucky、Brave、Halfling Nimbleness</td>
</tr>
<tr>
<td>额外选择</td>
<td>已核验的半身人条目没有 Lightfoot/Stout 机械选择，也没有 Species 属性值加成</td>
<td>在允许的 2014 来源中选择 Lightfoot 或 Stout</td>
</tr>
<tr>
<td>语言字段</td>
<td>半身人条目没有列出 2014 的语言行；不要自动补入</td>
<td>Common 与 Halfling 的读写和口说能力</td>
</tr>
  </tbody>
</table>

<h3>2024：记录 Humanoid、Small、30 英尺和四项特性（<a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-origins#Halfling" rel="noreferrer noopener">2024 Character Origins</a>）</h3>

<p>2024 卡面写“半身人（Halfling）”、Humanoid、Small、30 英尺。Small 是体型分类；约 2–3 英尺是规则描述，不是图片像素，也不决定 Token 在地图上占几格。</p>

<p>四项特性可写成桌边短句：Brave 处理避免或结束 Frightened 的豁免；Halfling Nimbleness 可穿过至少大一号生物的空间但不能停在其中；Luck 处理 D20 Test 掷出 1；Naturally Stealthy 在唯一遮挡来源是至少大一号生物时可采取 Hide。属性值和 Origin Feat 仍填在 Background，卡上不另造“半身人加值”栏。</p>

<h3>2014：记录 +2 Dexterity、Small、25 英尺和语言（<a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/races#Halfling" rel="noreferrer noopener">2014 Basic Rules</a>）</h3>

<p>2014 卡面写 +2 Dexterity、25 英尺、Small、约 3 英尺和约 40 磅；语言行写 Common/Halfling 的读写和口说能力。不要用 2024 Species 表覆盖这一栏。</p>

<p>选择 Lightfoot 时写 Charisma +1/Naturally Stealthy，选择 Stout 时写 Constitution +1/Stout Resilience。名称、属性值和特性须来自同一套 2014 来源；不要从旧版卡抄 +2 Dexterity、再加 2024 Background 属性值，把两者当默认奖励。</p>

<h3>只有 2014 规则才选择 Lightfoot 或 Stout</h3>

<p>Lightfoot 和 Stout 在本文只用于定位 2014 子种族字段，不是 2024 隐藏选项，也不是按性格自由添加的标签。2024 Halfling 背景描述可能提到这些称呼（见 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-origins#Halfling" rel="noreferrer noopener">2024 Character Origins 中的 Halfling 条目</a>），但名称不等于机械特性；其他书的选项须由 DM 指定来源，再按原文填写。</p>

<h3>用一张不混版核对表回查字段</h3>

<table>
  <thead>
    <tr>
      <th>看到的内容</th><th>应该放在哪一栏</th><th>发现混用时怎么处理</th>
    </tr>
  </thead>
  <tbody>
<tr>
<td>30 英尺 Speed、Luck、Naturally Stealthy</td>
<td><a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-origins#Halfling" rel="noreferrer noopener">2024 Species</a></td>
<td>删除未经确认的 2014 属性值和子种族字段，回看 Background</td>
</tr>
<tr>
<td>25 英尺 Speed、+2 Dexterity、Common/Halfling</td>
<td><a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/races#Halfling" rel="noreferrer noopener">2014 Race</a></td>
<td>保留 2014 年份，再决定是否选择 Lightfoot 或 Stout</td>
</tr>
<tr>
<td>旧 Species 的属性值带进 2024</td>
<td><a href="https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character#BackgroundsandSpeciesfromOlderBooks" rel="noreferrer noopener">2024 旧书兼容说明</a></td>
<td>按兼容说明忽略旧 Species 属性值，改查 Background</td>
</tr>
<tr>
<td>规则年份、旧书许可都没有</td>
<td>待 DM 确认</td>
<td>先不要补数字、语言、子种族或 Feat</td>
</tr>
  </tbody>
</table>

<figure class="inline-figure inline-figure--wide-crop">
  <img class="inline-figure__image inline-figure__image--wide" src="${DND_HALFLING_CHARACTER_CARD_FIELDS_IMAGE_PATH}" alt="月夜营火旁的半身人冒险者用羽毛笔记录冒险准备，盾牌与短剑放在身边" width="1536" height="1024" loading="lazy" decoding="async" />
  <figcaption>把角色字段写清后，再保留一个能在画面里看见的身份线索；这张是场景插画，不是官方角色卡版式。</figcaption>
</figure>

<h2>把半身人特性变成桌边判断</h2>

<p>静态字段解决“卡上写什么”，触发条件解决“轮到你时怎么做”。半身人的特性都很短，判断时仍要保留原有条件：Luck 不是任意骰重掷，Brave 不是恐惧免疫；2024 的 Nimbleness 明确不能停在至少大一号生物的空间里，2014 则不要用这句新增限制改写旧版原文。每次判断先看卡面年份，再读对应文字。</p>

<h3>Luck 与 Lucky：先看版本，再看 d20 触发范围</h3>

<p>2014 的 <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/races#Halfling" rel="noreferrer noopener">Lucky（2014 半身人规则）</a> 处理攻击掷骰、属性检定或豁免 d20=1；2024 的 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-origins#Halfling" rel="noreferrer noopener">Luck（2024 半身人规则）</a> 使用 D20 Test。2024 将其限定为属性检定、豁免和攻击掷骰，见 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/playing-the-game#D20Tests" rel="noreferrer noopener">D20 Tests 规则说明</a>；两版重掷后都用新结果。</p>

<p>攻击掷出 1 时先看年份；伤害、生命、百分骰或其他非 d20 不自动重掷。把触发条件写在特性旁边，方便在场景中按条件回查；不要只写一个 Lucky 名称。</p>

<h3>Brave：对抗对应 Frightened 豁免，不是免疫</h3>

<p>两版 <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/races#Halfling" rel="noreferrer noopener">Brave（2014 规则）</a> 与 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-origins#Halfling" rel="noreferrer noopener">Brave（2024 规则）</a> 都让对抗 Frightened 的相关豁免获得 Advantage；2024 明确覆盖避免或结束该状态，2014 写作对抗被吓倒的豁免。它不等于自动成功，也不阻止所有造成 Frightened 的效果。</p>

<p>遇到恐惧效果时，先确认 DM 要求的豁免，再按版本读 Brave。已处于 Frightened 也不能跳过其他状态规则；只在符合条件的豁免上多掷一个 d20。</p>

<h3>Halfling Nimbleness：能穿过更大生物空间，但要保留版本限制</h3>

<p>2014 的 <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/races#Halfling" rel="noreferrer noopener">Halfling Nimbleness（2014 规则）</a> 允许穿过比自己更大的生物空间；2024 的 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-origins#Halfling" rel="noreferrer noopener">Halfling Nimbleness（2024 规则）</a> 改为至少大一号，并明确不能停在其中。遇到挡路的大型生物时，这项特性只帮助判断能否穿过，终点仍不能在对方空间。</p>

<p>不要把 2024 的“不能停在其中”倒填进 2014 的原句，也不要把 2014 的“更大”改写成 2024 的完整限制。两栏仍服从各自版本及桌面其他移动规则。</p>

<h3>Naturally Stealthy 与 Lightfoot：相似用途，不是同一规则栏</h3>

<p>2024 的 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-origins#Halfling" rel="noreferrer noopener">Naturally Stealthy（2024 规则）</a> 与 2014 Lightfoot 的 <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/races#Halfling" rel="noreferrer noopener">Naturally Stealthy（2014 规则）</a> 都要求唯一遮挡来源是至少比半身人大一号的生物，才可采取 Hide；不能缩成“半身人随时可以隐匿”。</p>

<p>写卡时 2024 特性留在 Species 栏、2014 Lightfoot 留在 subrace 栏。桌边先看遮挡来源再确认版本；墙、门、烟雾等环境因素不会被这条特性自动改写。</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img class="inline-figure__image inline-figure__image--wide" src="${DND_HALFLING_TRAIT_TRIGGER_MATRIX_IMAGE_PATH}" alt="雨中石桥战斗里的半身人冒险者举盾保护队友，手持短剑迎向远处的巨大敌人剪影" width="1536" height="1024" loading="lazy" decoding="async" />
  <figcaption>用角色场景记住特性触发时的行动，但仍以对应版本的规则文字为准。</figcaption>
</figure>

<h2>只保留能帮助认角色的短称呼与身份线索</h2>

<p>正式名、桌边短称呼和 Token 标签应指向同一角色，方便 DM、玩家和地图上的队伍使用同一称呼；它们只是记录办法，不是半身人的新规则字段。</p>

<p>可以这样安排三行：</p>

<ul>
<li>正式名：写完整姓名和家族名，按 DM 允许的资料或你自己的设定决定。</li>
<li>桌边短称呼：选一个不容易和队友撞名的短称呼。</li>
<li>Token 标签：沿用短称呼，必要时再加一个能辨认的身份词，例如“弓手”或“信使”。</li>
</ul>

<p>示例（自拟格式，不是官方名单）：正式名“米洛·橡果”、短称呼“米洛”、Token 标签“米洛／弓手”。角色换职业或装备时，先检查标签是否仍便于辨认；不要让装饰性称号挤掉脸部和道具空间，也不要把标签当规则来源。</p>

<h2>把角色卡上的身份线索做成可读 Token</h2>

<h3>Small 不决定 PNG 像素、遮罩或 VTT 格数</h3>

<p>规则中的 Small 只是体型分类；<a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/races#Halfling" rel="noreferrer noopener">2014 半身人规则</a> 与 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-origins#Halfling" rel="noreferrer noopener">2024 半身人规则</a> 的已核验条目都没有把它对应到 256 像素、遮罩、VTT footprint 或打印尺寸。文件大小和裁切取决于图像、地图缩放和使用场景。</p>

<p>把规则体型与图片识别线索分开检查：脸是否清楚、手中物品是否仍有用途、棋子缩小时能否与队友区分。Small 不应直接换算成图片规格。</p>

<h3>按肖像内容选择圆形、方形或多边形</h3>

<p>参考 <a href="https://www.tokenmaker.one/" rel="noreferrer noopener">Token Maker 官网工作区</a>的形状选择：脸、帽子或发型是辨识点时可用圆形；长弓、盾牌、包裹或姿态重要时，方形为装备留更多画面；多边形可作为类别信号。这些是制作建议，不是 D&amp;D 对半身人的要求。</p>

<p>选择前检查原图四周：圆形裁掉道具就改用方形或调整主体；方形背景过多就收紧；多边形只有装饰边缘且无助于辨认时，不必使用。</p>

<h3>在实际地图缩放下保留脸部和一件道具</h3>

<p>按平时地图缩放回看成品：脸部、一件身份道具和短称呼是否仍清楚。看不清时先改裁切和主体位置，再考虑边框或文字；不要用更大导出数字掩盖主体过小。</p>

<p>Token Maker 公开首页列出 JPG、PNG、WEBP 上传（不超过 10 MB）、圆形/方形/多边形遮罩、边框、文字设置及 256/512/1024/2048 PNG 导出控件。可在 <a href="https://www.tokenmaker.one/" rel="noreferrer noopener">Token Maker 官网工作区</a>查看；这些是页面展示，不是本文执行的上传、导出或 Roll20、Foundry、Owlbear 导入测试。官网未把 D&amp;D Small 换算为图片尺寸，仍应以画面和地图缩放为准。</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img class="inline-figure__image inline-figure__image--wide" src="${DND_HALFLING_TOKEN_CROP_COMPARISON_IMAGE_PATH}" alt="月夜森林营地中的半身人冒险者近景肖像，卷发、苔绿色斗篷、短剑和橡叶纹盾牌清晰可见" width="1536" height="1024" loading="lazy" decoding="async" />
  <figcaption>先让脸部和一件身份道具在画面中保持可读，再按地图缩放选择裁切形状；这张是角色原画，不是 Token 框。</figcaption>
</figure>

<h2>开团前用五项检查收口</h2>

<ol>
<li><strong>年份和来源</strong>：卡上明确写 2014 Race 或 2024 Species，并能打开对应规则页；不确定就问 DM。</li>
<li><strong>属性值来源</strong>：2024 的 +2/+1 或三个 +1、Origin Feat 来自 Background；2014 的 +2 Dexterity 和 Lightfoot/Stout 加值只留在 2014 栏。</li>
<li><strong>特性触发</strong>：Luck/Lucky、Brave、Nimbleness、Naturally Stealthy 的触发条件和限制都写得出来，不把它们扩大成任意重掷、恐惧免疫或随时 Hide。</li>
<li><strong>身份标签</strong>：正式名、桌边短称呼和 Token 标签互相对应，队伍能用同一个词找到这枚棋子。</li>
<li><strong>地图缩放</strong>：脸部和一件身份道具在实际地图缩放下仍可辨认；Small 没有被误换算成固定像素或格数。</li>
</ol>

<p>五项里有一项无法确认，就先把那一项标为“待 DM 确认”或“待重新裁切”。</p>
`;
