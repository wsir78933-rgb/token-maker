const DEATH_KNIGHT_MONSTER_CATALOG_URL =
  'https://www.dndbeyond.com/monsters?filter-search=&amp;filter-type=16&amp;page=3';
const CURRENT_MONSTER_MANUAL_URL = 'https://www.dndbeyond.com/sources/dnd/mm-2024';
const LEGACY_MONSTER_MANUAL_URL = 'https://marketplace.dndbeyond.com/category/monster-manual';
const MONSTER_MANUAL_2025_UPDATE_URL =
  'https://www.dndbeyond.com/posts/1913-updates-in-the-monster-manual-2025';
const RULES_VERSION_LABELS_URL =
  'https://www.dndbeyond.com/posts/1875-updating-your-campaign-to-the-5-5e-d-d-rules';
const UA_VILLAINOUS_OPTIONS_PDF_URL =
  'https://media.dndbeyond.com/compendium-images/ua/villainous-options/VRQr4YbETAgmpWRj/UA2026-VillainousOptions.pdf';
const PLAYER_CLASSES_2014_URL = 'https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes';
const PLAYER_CLASSES_2024_URL = 'https://www.dndbeyond.com/sources/dnd/br-2024/character-classes';

export const dndDeathKnightArticleHtml = `
<p>Tonight’s map needs one Death Knight object, not four ideas stacked on the same square. Before the session starts, lock one of these: a current Monster Manual (2025; 5.5e) Death Knight, a Legacy Death Knight from Monster Manual (2014; 5e), a Death Knight Aspirant, or a playtest Path of the Death Knight character. The <a href="${MONSTER_MANUAL_2025_UPDATE_URL}">2025 Monster Manual update</a> and <a href="${RULES_VERSION_LABELS_URL}">D&amp;D Beyond’s edition-label note</a> identify the current and 2014 rules separately. Those monster entries and the player-character playtest path are different rule objects. Pick one before you place cover or export a PNG.</p>
<p>The public <a href="${DEATH_KNIGHT_MONSTER_CATALOG_URL}">D&amp;D Beyond Monsters catalog</a> lists three identities: current Death Knight (Undead, Medium or Small, Chaotic Evil, habitat Any, Challenge 17), Legacy Death Knight from Monster Manual (2014) (Undead, Medium, Chaotic Evil, Challenge 17), and current Death Knight Aspirant (Undead, Medium or Small, Chaotic Evil, habitat Any, Challenge 11). The catalog rows are monster entries, not character classes; compare them with the <a href="${PLAYER_CLASSES_2014_URL}">2014 class rules</a> or <a href="${PLAYER_CLASSES_2024_URL}">2024 class rules</a>.</p>
<p>The catalog exposes identity fields; complete Armor Class, Hit Points, attacks, spell lists, and legendary actions belong to the stat block in the matching <a href="${CURRENT_MONSTER_MANUAL_URL}">current Monster Manual</a> or <a href="${LEGACY_MONSTER_MANUAL_URL}">2014 Legacy Monster Manual</a>. Use the public fields to choose which book and token you need, and do not fill unseen combat numbers from memory or an unofficial monster page.</p>

<h2>Choose one object before the first token</h2>
<p>Write the choice at the top of the encounter sheet in one line. If the table is using the current <a href="${CURRENT_MONSTER_MANUAL_URL}">Monster Manual (2025; 5.5e)</a>, the catalog’s commander row is the Challenge 17 Death Knight with a Medium or Small size line. If the table is still using <a href="${LEGACY_MONSTER_MANUAL_URL}">Monster Manual (2014; 5e)</a>, use its separate Legacy Death Knight row, whose size is Medium. For a lesser champion, the current catalog lists Death Knight Aspirant at Challenge 11. If a player wants a fallen-champion character, the <a href="${UA_VILLAINOUS_OPTIONS_PDF_URL}">Unearthed Arcana: Villainous Options</a> presents Path of the Death Knight as a playtest feat path.</p>
<p>That one-line choice stops three common mix-ups. Players looking for a class will not be handed a Challenge 17 Undead commander. A table on the 2014 book will not inherit Medium or Small from the current listing. A Challenge 11 Aspirant will not be used as a cheap stand-in for the Challenge 17 commander just because the English name looks similar.</p>
<p>The <a href="${RULES_VERSION_LABELS_URL}">official March 2, 2026 editor’s note</a> says D&amp;D Beyond now labels content previously called “2024” as “5.5e” and 2014 content as “5e”; the note says this naming clarification changes no rules, purchases, or gameplay. The catalog still shows the current Death Knight and Monster Manual (2014) Legacy Death Knight as separate rows, both Challenge 17.</p>

<h2>Read the three public monster listings as three identities</h2>
<table>
  <thead>
    <tr>
      <th scope="col">Public listing</th>
      <th scope="col">Source label</th>
      <th scope="col">Type</th>
      <th scope="col">Size</th>
      <th scope="col">Alignment</th>
      <th scope="col">Habitat</th>
      <th scope="col">Challenge</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Death Knight</th>
      <td><a href="${CURRENT_MONSTER_MANUAL_URL}">Monster Manual (5.5e)</a></td>
      <td>Undead</td>
      <td>Medium or Small</td>
      <td>Chaotic Evil</td>
      <td>Any</td>
      <td>17</td>
    </tr>
    <tr>
      <th scope="row">Death Knight</th>
      <td><a href="${LEGACY_MONSTER_MANUAL_URL}">Legacy, Monster Manual (2014; 5e)</a></td>
      <td>Undead</td>
      <td>Medium</td>
      <td>Chaotic Evil</td>
      <td>—</td>
      <td>17</td>
    </tr>
    <tr>
      <th scope="row">Death Knight Aspirant</th>
      <td><a href="${CURRENT_MONSTER_MANUAL_URL}">Monster Manual (5.5e)</a></td>
      <td>Undead</td>
      <td>Medium or Small</td>
      <td>Chaotic Evil</td>
      <td>Any</td>
      <td>11</td>
    </tr>
  </tbody>
</table>
<p>Copy each row’s fields as one locked combination from the official <a href="${DEATH_KNIGHT_MONSTER_CATALOG_URL}">public monster catalog</a>. Medium or Small belongs to the current Death Knight and Death Knight Aspirant rows; the 2014 Legacy row is Medium. Challenge 17 belongs to both Death Knight rows, while Death Knight Aspirant is Challenge 11. Habitat Any is shown only on the current rows. Keep those catalog identities separate during prep.</p>
<p>The official <a href="${MONSTER_MANUAL_2025_UPDATE_URL}">Monster Manual (2025) update</a> says the 2025 book replaces the 2014 book’s monster stat blocks and directs readers to its Appendix B conversion table for older monsters that are not easy to locate. Use the current Monster Manual row when the table uses the 2025 book, or the Legacy row when the table uses the 2014 book; do not combine fields across those versions.</p>
<p>If the table still uses Monster Manual (2014), keep the Legacy Death Knight catalog row. If the table uses the current Monster Manual, keep the current Death Knight row, and treat Death Knight Aspirant as a separate Challenge 11 catalog identity. Aspirant is a useful lieutenant, scout champion, or ruined-chapel boss for a lower-level night. It is not a discounted Challenge 17 commander.</p>

<h2>Stop at public identity when the combat block is closed</h2>
<p>The public <a href="${DEATH_KNIGHT_MONSTER_CATALOG_URL}">catalog row</a> is a quick identity reference: name, source-book label, type, size, alignment, habitat when shown, and Challenge. Those fields are enough to distinguish the current commander, the Legacy commander, and the Aspirant before selecting a token.</p>
<p>Use the full stat block in the matching <a href="${CURRENT_MONSTER_MANUAL_URL}">current Monster Manual</a> or <a href="${LEGACY_MONSTER_MANUAL_URL}">2014 Legacy Monster Manual</a> for Armor Class, Hit Points, attacks, spells, and legendary actions; do not use unrelated stat blocks to fill gaps in a Monster Manual entry.</p>
<p>The catalog’s identity row does not authorize guessing hidden combat details. When a prep note needs a full action, spell, or number, check the selected book rather than reconstructing it from memory or another site's monster entry.</p>

<h2>Treat the playtest path as a character track, not a monster row</h2>
<p><a href="${UA_VILLAINOUS_OPTIONS_PDF_URL}">Unearthed Arcana: Villainous Options</a> presents Path of the Death Knight as a playtest feat path. The PDF says to take Death Knight Initiate, then another Path of the Death Knight feat, and finally Death Knight Ascension at level 12 or higher; Death Knight Initiate requires level 4+ and the Weapon Mastery feature. The PDF labels its options experimental playtest material and says they are not officially part of the game.</p>
<p>The feat path is a player-character option, separate from the Challenge 17 catalog Death Knight and the Challenge 11 Death Knight Aspirant. The <a href="${UA_VILLAINOUS_OPTIONS_PDF_URL}">playtest PDF</a> describes the path as a series of feats for a character and points readers to the Monster Manual for monster rules.</p>
<p>Unearthed Arcana is playtest material, not an automatically published character option. If a DM allows it, use the feat path with a character class from the table’s <a href="${PLAYER_CLASSES_2014_URL}">2014 rules</a> or <a href="${PLAYER_CLASSES_2024_URL}">2024 rules</a>; do not use the Challenge 17 monster row as a class.</p>

<h2>Build a commander fight the table can actually finish</h2>
<p>After the listing is locked, the fight still needs a finish condition the players can see. A Death Knight commander encounter fails when the only instruction is “they attack until they drop.” Give the undead a job that can end: hold the chapel doors until the relic leaves, break the living line that guards a sarcophagus, or force the party off a bridge before reinforcements arrive. Write that job in one sentence next to the catalog identity.</p>
<p>Split the field into three readable jobs, then assign tokens to those jobs. The commander is the chosen catalog row: Challenge 17 current Death Knight, Challenge 17 Legacy Death Knight, or Challenge 11 Death Knight Aspirant. The screen is a cluster of ordinary Undead that protect the commander’s space and eat opportunity attacks. The pressure line is a second group that moves around cover to cut retreat, threaten casters, or contest an objective marker. If you only have one token style for all three jobs, players will target the wrong body in round one.</p>
<p>Place the commander on a route, not in an empty room center. Put hard cover between the entrance and the commander so the first turn is a choice: push the screen, snipe from the doorway, or sprint for the objective. Put the pressure line on a side door, balcony, or collapsed aisle so it can appear after the party commits. The current Medium or Small size line on the current Death Knight and Aspirant rows is a reminder that the commander silhouette may be Small; do not assume a Large base. The 2014 Legacy row is Medium only.</p>
<p>Do not invent legendary action counts, recharge values, or spell slots to make the fight feel “complete.” If the paid block is closed, run the night with identity, job, terrain, and minion pressure. Ask the book owner to read the real action list at the table when the book is present. If the book is not present, keep the fight at the scale the listing supports: Challenge 17 is an end-of-arc commander, Challenge 11 is a chapel champion or fallen lieutenant. Do not scale a Challenge 11 Aspirant up to Challenge 17 by borrowing numbers from an unofficial page.</p>
<p>A finish condition also protects pacing. If the objective is a relic on a dais, the commander’s job is to keep living creatures off that dais. If the party grabs the relic and leaves, the encounter can end even if Undead still stand. If the job is to hold a gate for three rounds of incoming dead, the encounter can end when the gate falls or when the party seals it. Write the end in the same ink as the catalog row, so you do not extend the fight with extra unpaid abilities just because the party is still standing.</p>

<h2>Make tokens the map can tell apart</h2>
<p>Token Maker is a browser VTT token maker for DnD, Roll20, Foundry VTT, and Owlbear. The live editor workspace lets you drop portrait art, crop it, apply a mask, add a border and text, and export a transparent PNG. Ordinary PNG downloads are generated locally in the browser. The homepage states circular, square, and polygon token crops, transparent PNG export up to 2048, and token borders. The editor shows export sizes 256, 512, 1024, and 2048, plus a Download PNG control. An Undead preset is on the workspace, with undead-styled borders you can apply without rebuilding the layout.</p>
<p>Use that tool after the catalog row is locked, not instead of locking it. The token is an adapter for the chosen official identity. It does not settle the unpaid-versus-paid stat-block decision, and it does not turn a playtest feat path into a monster listing.</p>
<ol>
  <li>Write the locked identity on a sticky note: current Death Knight, Legacy Death Knight, Death Knight Aspirant, or playtest path character.</li>
  <li>Open Token Maker and start from the Undead preset when the object is a catalog Undead commander or Aspirant. Use a martial or cleric-adjacent starting look only when the object is a still-living playtest character, then shift the border once the character’s type changes in play.</li>
  <li>Give the commander a heavier frame, a short label, and a crop that keeps the helm readable at token scale. Give the Aspirant the same family of border at a thinner weight or a different tint so it is clearly junior, not a second commander.</li>
  <li>Give screen Undead a simpler ring and a tighter crop. Give the pressure line a second color or a square crop if the commander is circular, so a glance at the map shows which group is wrapping the party.</li>
  <li>Export 512 for most live VTT sessions. Use 1024 when the token will be archived or zoomed. Reserve 2048 for a premium pack or a long-term library. Download PNG locally, then drop the files into Roll20, Foundry VTT, or Owlbear.</li>
</ol>
<p>Keep text short. A commander label that fills the face will vanish at grid scale. Prefer one or two characters, a rank mark, or no text if the border already separates the jobs. Wheel-zoom and drag the portrait until the eye sockets or visor read on a 512 token; do not rely on armor filigree that disappears when the map is zoomed out.</p>
<p>Batch Mode is on the workspace if you are cutting a screen of similar Undead from one portrait sheet. Still export the commander as its own file. Reusing the commander PNG for every skeleton in the room is how players lose the boss in a pile of identical rings.</p>
<p>A later adapter may point from the chosen official identity toward this token workflow. The tool is not a rules source and is not an encounter manager. If the portrait cannot show the difference between commander, Aspirant, and screen, change the border or mask before you start the session, not after initiative.</p>

<h2>Keep local downloads and public share links on different rails</h2>
<p>Token Maker’s privacy page states the default: portrait images can stay in the browser while you crop and frame them, and ordinary PNG downloads are generated locally in your browser. That is the path for tonight’s map. Download PNG, keep the files on the machine that hosts the VTT, and do not treat the editor as a monster database.</p>
<p>Copying a share link or sharing to a social platform is a different action. That share action sends a generated PNG through the site’s share process, uploads the PNG to object storage, and creates a public share link. Anyone with the public share link can view the generated token image. The privacy page does not provide a self-service deletion or retention promise. If the portrait is private campaign art, a player’s face claim, or a commissioned commander you do not want indexed, use the local download and skip the public link.</p>
<p>The editor is local-first for the normal crop-and-export loop. It is not a promise that every button on the page stays inside the browser. Decide the rail before you export: local PNG for the table, public link only when you intend the image to be viewable by anyone who receives the URL.</p>

<h2>Refuse the mix-ups that waste round one</h2>
<p>Unofficial complete combat numbers stay off the prep sheet. Third-party bestiary pages that print Armor Class, Hit Points, and attack routines are not the public D&amp;D Beyond catalog row, and they are not the System Reference Document v5.2.1 landing or conversion guide. If the book is closed, keep the fight on identity, jobs, and terrain.</p>
<p>The official <a href="${PLAYER_CLASSES_2014_URL}">2014 class rules</a> and <a href="${PLAYER_CLASSES_2024_URL}">2024 class rules</a> list character classes; neither identifies Death Knight as a class. The official <a href="${UA_VILLAINOUS_OPTIONS_PDF_URL}">Path of the Death Knight</a> is a playtest feat path. If the player wants that fantasy, use a class from the adopted rules and add the UA feats only if the DM allows playtest material.</p>
<p>Setting lore does not choose between book-specific monster entries. Use the official <a href="${DEATH_KNIGHT_MONSTER_CATALOG_URL}">catalog row</a> and the matching Monster Manual for a Death Knight’s size and Challenge rating.</p>
<p>Keep the two Challenge 17 names on separate files. The current Monster Manual Death Knight and the 2014 Legacy Death Knight share an English name and a Challenge number. They do not share a size line, a source label, or a book. Put the source label on the token filename: <code>death-knight-current.png</code> versus <code>death-knight-legacy-2014.png</code> versus <code>death-knight-aspirant.png</code>.</p>
<p>Keep character options from other games separate from the D&amp;D catalog entries and playtest path described here. The D&amp;D object on tonight’s map is one of the four choices already named.</p>
<p>Once the listing is locked, the visible commander silhouette for a later token adapter is that row’s public identity: an Undead knight from the matching Monster Manual line, Medium or Small on the current Death Knight and Death Knight Aspirant rows, Medium on the 2014 Legacy row, and Chaotic Evil on all three public listings. That silhouette is catalog identity, not a replacement stat block. Open Token Maker, cut tokens that keep commander, screen, and pressure line readable, and download the PNGs locally for the table.</p>
`;

export const dndDeathKnightArticleHtmlZh = `
<p>开团前先锁版本，再布置亡灵指挥官遭遇。先确认今晚使用哪条规则对象：当前《怪物图鉴》（2025 年出版；5.5e）的 Death Knight、2014《怪物图鉴》（5e）的 Legacy Death Knight、当前图鉴里的 Death Knight Aspirant，或《Unearthed Arcana：Villainous Options》的试玩角色路径。官方的<a href="${MONSTER_MANUAL_2025_UPDATE_URL}">2025 怪物图鉴更新说明</a>和<a href="${RULES_VERSION_LABELS_URL}">版本标签说明</a>把当前 5.5e 与 2014 5e 区分开来；三条怪物目录和玩家角色试玩路径是不同规则对象。</p>
<p><a href="${DEATH_KNIGHT_MONSTER_CATALOG_URL}">D&amp;D Beyond 公开怪物目录</a>列出三种身份：当前 Death Knight（Undead、Medium or Small、Chaotic Evil、栖息地 Any、挑战等级 17）；Legacy Death Knight，来源 Monster Manual (2014)（Undead、Medium、Chaotic Evil、挑战等级 17）；以及当前 Death Knight Aspirant（Undead、Medium or Small、Chaotic Evil、栖息地 Any、挑战等级 11）。这些是怪物目录行；可对照<a href="${PLAYER_CLASSES_2014_URL}">2014 职业规则</a>或<a href="${PLAYER_CLASSES_2024_URL}">2024 职业规则</a>查看玩家职业。</p>
<p>公开目录只展示身份字段；完整护甲等级、生命值、攻击、法术列表和传奇动作请查对应版本的<a href="${CURRENT_MONSTER_MANUAL_URL}">当前怪物图鉴</a>或<a href="${LEGACY_MONSTER_MANUAL_URL}">2014 Legacy 怪物图鉴</a>。先用公开字段确认版本，再决定需要哪本书和哪种 Token，不要凭记忆或非官方怪物页补战斗数字。</p>

<h2>先锁书，再画战场</h2>
<p>在遭遇纸最上方写一句话：今晚用哪本书、哪一条。使用<a href="${CURRENT_MONSTER_MANUAL_URL}">当前《怪物图鉴》（2025；5.5e）</a>，就选目录里挑战等级 17、体型 Medium or Small 的 Death Knight；使用<a href="${LEGACY_MONSTER_MANUAL_URL}">2014《怪物图鉴》（5e）</a>，就选体型 Medium 的 Legacy 行。要用较低挑战等级的亡灵首领，可以选当前目录中挑战等级 11 的 Death Knight Aspirant。玩家角色想走堕落骑士路线，则是另一条规则路径：<a href="${UA_VILLAINOUS_OPTIONS_PDF_URL}">试玩版 Path of the Death Knight 专长路径</a>。</p>
<p><a href="${RULES_VERSION_LABELS_URL}">官方版本标签说明</a>在 2026 年 3 月 2 日说明：D&amp;D Beyond 把原标为 “2024” 的内容改标 “5.5e”，把 2014 内容标为 “5e”；这是名称澄清，不改变规则、购买或游玩。<a href="${DEATH_KNIGHT_MONSTER_CATALOG_URL}">目录</a>仍把当前 Death Knight 和 2014 Legacy Death Knight 列为两行，不能因为英文名相同就共用体型或来源。</p>
<p><a href="${MONSTER_MANUAL_2025_UPDATE_URL}">官方《Monster Manual (2025)》更新说明</a>说，2025 年图鉴替换 2014 图鉴中的怪物属性块；找不到旧怪物时可查 2025 年版附录 B 的转换表。使用哪一版图鉴，就按对应的目录行查找，不要把两版字段拆开重拼。</p>

<h2>三条目录身份，不要跨行拼接</h2>
<table>
  <thead>
    <tr>
      <th scope="col">公开条目</th>
      <th scope="col">来源标记</th>
      <th scope="col">类型</th>
      <th scope="col">体型</th>
      <th scope="col">阵营</th>
      <th scope="col">栖息地</th>
      <th scope="col">挑战等级</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Death Knight</th>
      <td><a href="${CURRENT_MONSTER_MANUAL_URL}">Monster Manual (5.5e)</a></td>
      <td>Undead</td>
      <td>Medium or Small</td>
      <td>Chaotic Evil</td>
      <td>Any</td>
      <td>17</td>
    </tr>
    <tr>
      <th scope="row">Death Knight</th>
      <td><a href="${LEGACY_MONSTER_MANUAL_URL}">Legacy，Monster Manual (2014; 5e)</a></td>
      <td>Undead</td>
      <td>Medium</td>
      <td>Chaotic Evil</td>
      <td>—</td>
      <td>17</td>
    </tr>
    <tr>
      <th scope="row">Death Knight Aspirant</th>
      <td><a href="${CURRENT_MONSTER_MANUAL_URL}">Monster Manual (5.5e)</a></td>
      <td>Undead</td>
      <td>Medium or Small</td>
      <td>Chaotic Evil</td>
      <td>Any</td>
      <td>11</td>
    </tr>
  </tbody>
</table>
<p>名称、来源书、挑战等级、类型、体型、阵营和栖息地是同一行的版本识别组合。当前 Death Knight 与 Death Knight Aspirant 的目录行属于 5.5e 怪物图鉴；Legacy 行则明确标注 Monster Manual (2014; 5e)。这些字段来自<a href="${DEATH_KNIGHT_MONSTER_CATALOG_URL}">官方公开怪物目录</a>。做 Token 或遭遇时先锁定其中一行，只沿用该行已经列出的组合。</p>
<p>Aspirant 适合当副将、守殿冠军或给中低等级队伍的亡灵首领。不要因为它也叫死亡骑士，就拿它去顶挑战等级 17 的指挥官。当前行体型写 Medium or Small，Legacy 行只写 Medium；把当前行的体型抄进 Legacy 行，底座和遮罩都会错。</p>

<h2>公开身份够用，未解锁数值不要补</h2>
<p>公开目录只列出生命值、护甲等级和完整动作表以外的身份字段；完整战斗数据请查对应的<a href="${CURRENT_MONSTER_MANUAL_URL}">当前《怪物图鉴》</a>或<a href="${LEGACY_MONSTER_MANUAL_URL}">2014 Legacy《怪物图鉴》</a>。当前版由 D&amp;D Beyond 标为 Monster Manual (5.5e)，旧版标为 Monster Manual (5e) Legacy。没有对应规则书时，仍可按目录中已经看见的字段准备 Token，但不要补猜测数字。</p>
<p><a href="${DEATH_KNIGHT_MONSTER_CATALOG_URL}">目录行</a>是快速身份参考，不代表可以推断未公开的战斗细节。需要完整动作、法术或数值时，查所选版本的怪物图鉴，不要凭记忆或其他网站的怪物条目拼出属性块。</p>

<h2>人物试玩路径和怪物目录分开走</h2>
<p><a href="${UA_VILLAINOUS_OPTIONS_PDF_URL}">Unearthed Arcana：Villainous Options</a>把 Path of the Death Knight 写成试玩专长路径。PDF 要求先选 Death Knight Initiate，再选该路径的另一项专长，并在 12 级或更高时选择 Death Knight Ascension；Initiate 的先决条件是 4 级或以上且拥有 Weapon Mastery。该 PDF 明确标注内容属于试验性试玩，尚未正式加入游戏。</p>
<p>这条路径属于玩家角色规则，与挑战等级 17 的目录 Death Knight 和挑战等级 11 的 Death Knight Aspirant 分开。<a href="${UA_VILLAINOUS_OPTIONS_PDF_URL}">试玩 PDF</a>将它描述为由多项专长组成的角色路径，并让读者到怪物图鉴查看怪物规则。</p>
<p>Unearthed Arcana 是试玩材料，不会自动成为正式出版角色选项。DM 允许时，把专长路径用于当前战役采用的<a href="${PLAYER_CLASSES_2014_URL}">2014 职业规则</a>或<a href="${PLAYER_CLASSES_2024_URL}">2024 职业规则</a>；不要把挑战等级 17 的怪物目录行当作职业。</p>

<h2>布置一场能打完的亡灵指挥官遭遇</h2>
<p>版本锁好之后，还要给这场遭遇一个看得见的结束条件。只写「他们打到倒下为止」，很容易拖成无法收束的消耗战。给亡灵一个可以完成或可以失败的任务：守住圣物直到抬出侧门、把活人从桥上挤走、挡住三轮增援。把这句任务写在目录身份旁边。</p>
<p>把战场分成三个能认出来的职责，再给每个职责单独的 Token。指挥官就是你锁定的那条目录：当前挑战等级 17、Legacy 挑战等级 17，或 Aspirant 挑战等级 11。屏障是一群普通亡灵，挡在指挥官身前，吃掉机会攻击。压力线是第二群，从侧门、塌掉的回廊或高台绕过来，切后排、抢目标。三种职责如果共用同一张图，玩家第一轮就会打错人。</p>
<p>指挥官不要放在空房间正中。入口到指挥官之间要有掩体，让第一回合成为选择：推屏障、在门口对射，还是冲目标。压力线放在侧翼，等队伍投入后再露面。当前 Death Knight 和 Aspirant 的体型行是 Medium or Small，不要默认用大号底座。2014 Legacy 行只有 Medium。</p>
<p>没有完整动作表时，用身份、职责、地形和随从压力把这一晚跑完。书在桌上，就由拿书的人当场读真正的动作。书不在桌上，就按目录支持的尺度来：挑战等级 17 是篇章级指挥官，挑战等级 11 是殿堂冠军或堕落副将。不要靠非官方页把 Aspirant 抬成挑战等级 17。</p>
<p>结束条件也保护节奏。目标是台座上的圣物，指挥官的工作就是不让活人靠近台座。队伍拿走圣物撤离，遭遇可以结束，哪怕还有亡灵站着。目标是守门三轮，门破了或被封上，遭遇也可以结束。不要为了「看起来完整」去编未解锁的传奇动作次数或法术位。</p>
<p>随从不要抢指挥官的轮廓。屏障用更简单的边框、更近的裁切。压力线如果指挥官是圆形裁切，就改用方形，或换一种边框颜色。Aspirant 出场时，边框家族可以和指挥官相近，但更细、更浅，让人一眼看出这是志从不是第二指挥官。</p>

<h2>用 Token Maker 把三种职责分开</h2>
<p>Token Maker 是浏览器里的 VTT Token 工具，面向龙与地下城、Roll20、Foundry VTT 和 Owlbear。首页写明：可做圆形、方形和多边形裁切，导出透明 PNG，最高 2048，并可加边框。编辑器里能看到 256、512、1024、2048 四档，以及 Download PNG。工作区有 Undead 预设，也有亡灵风格边框。普通 PNG 下载在浏览器本地生成。</p>
<p>先锁目录，再做 Token。Token 只是把已选定的官方身份接到地图上，不能代替属性块，也不能把试玩专长路径变成怪物目录。</p>
<ol>
  <li>在纸上写下锁定的身份：当前 Death Knight、Legacy Death Knight、Death Knight Aspirant，或试玩路径角色。</li>
  <li>打开 Token Maker。目录里的亡灵指挥官或志从，从 Undead 预设开始。仍是活人的试玩角色，先用武者或祭司一类的起始外观，等桌上类型变成亡灵再换边框。</li>
  <li>指挥官用更重的边框、短标注，裁切保住头盔在 Token 尺度上能认。志从用同一家族的更细边框或不同着色，避免做成第二个指挥官。</li>
  <li>屏障用更简单的环、更近的裁切。压力线换颜色或换方形裁切，让人扫一眼就知道谁在包抄。</li>
  <li>多数实战桌面先导出 512。要归档或近距离放大用 1024。资源包或长期库才用 2048。本地下载 PNG，再放进 Roll20、Foundry VTT 或 Owlbear。</li>
</ol>
<p>字少而稳。指挥官脸上铺满文字，缩到格子上就看不见。能靠边框分开职责，就不要加字。把立绘拖到眼窝或面甲在 512 下仍清楚；盔甲上的细纹在缩小后会消失，不要指望它来认人。</p>
<p>工作区有 Batch Mode，适合从同一张立绘切一排屏障亡灵。指挥官仍要单独导出。把指挥官那张图复制给房间里每一个骷髅，玩家会在一堆相同的环里找不到首领。</p>
<p>工具不是规则来源，也不是遭遇主持。立绘看不出指挥官、志从和屏障的差别，就在开团前改边框或裁切，不要等先攻已经掷下去。</p>

<h2>本地下载和公开分享走两条路</h2>
<p>Token Maker 的隐私页写明默认做法：裁切和加框时，立绘可以留在浏览器里；普通 PNG 下载在浏览器本地生成。今晚的地图走这条路。下载 PNG，把文件放在主持虚拟桌面的那台机器上，不要把编辑器当成怪物数据库。</p>
<p>复制分享链接或分享到社交平台是另一件事。这个动作会把生成后的 PNG 上传到对象存储，并生成公开分享链接。拿到链接的人都能看见这张 Token。隐私页没有提供自助删除，也没有提供保留承诺。立绘是私密战役素材、玩家的肖像授权，或你不希望被公开查看的委托图，就只走本地下载，不要生成公开链接。</p>
<p>正常裁切和导出是本地优先，并不表示页面上每一个按钮都留在浏览器里。导出前先选定轨道：给桌子用的本地 PNG，或你明确打算让任何拿到网址的人都能看见的公开链接。</p>

<h2>开场前先挡掉这些混用</h2>
<p>不要把未核对的完整战斗数字写进准备纸。<a href="${DEATH_KNIGHT_MONSTER_CATALOG_URL}">公开目录</a>负责识别怪物；完整护甲等级、生命值和攻击流程以选定版本的怪物图鉴为准。书不在手上，就先用身份、职责和地形安排遭遇。</p>
<p>旧版角色模板、2014 怪物图鉴条目和当前目录行不是同一条规则来源。准备时只采用<a href="${DEATH_KNIGHT_MONSTER_CATALOG_URL}">官方目录</a>列出的当前、Legacy 或 Aspirant 身份，并从相应怪物图鉴读取战斗数字。</p>
<p><a href="${PLAYER_CLASSES_2014_URL}">2014 职业规则</a>和<a href="${PLAYER_CLASSES_2024_URL}">2024 职业规则</a>列出玩家职业，没有把 Death Knight 列为职业。官方<a href="${UA_VILLAINOUS_OPTIONS_PDF_URL}">Path of the Death Knight</a>是试玩专长路径；想玩这类角色时，先使用战役采用版本中的职业，并仅在 DM 允许试玩材料时加入 UA 专长。</p>
<p>两条都叫 Death Knight、挑战等级都是 17，仍应分成两个文件。文件名写出来源：当前 5.5e、2014 Legacy 或 Aspirant。<a href="${DEATH_KNIGHT_MONSTER_CATALOG_URL}">官方目录</a>把这些行分开列出，不要在 Token 或战斗统计中混用其字段。</p>
<p>目录行锁定之后，给后续 Token 用的可见轮廓就是该行的公开身份：当前 Death Knight 与 Death Knight Aspirant 为 Medium or Small，2014 Legacy 为 Medium，三条公开条目的阵营都是 Chaotic Evil。以上字段可在<a href="${DEATH_KNIGHT_MONSTER_CATALOG_URL}">公开怪物目录</a>核对；它们是身份参考，不是替代属性块。打开 Token Maker，把指挥官、志从和随从做成地图上分得清的标记，并本地下载 PNG 带到今晚的桌子上。</p>
`;
