import {
  DND_RACES_2014_RULES_URL,
  DND_RACES_2024_CHARACTER_CREATION_URL,
  DND_RACES_2024_SPECIES_OVERVIEW_URL,
  DND_RACES_COVER_PATH,
  DND_RACES_TERMINOLOGY_URL,
  DND_RACES_VIDEO_URL,
  EN_DICE_ROLLER_PATH,
  EN_DND_CLASSES_PATH,
  EN_EDITOR_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_EDITOR_PATH,
  liteVideoEmbed,
} from './shared';

const DND_RACES_VIDEO_ID = 'opYeED0W8Z8';

export const dndRacesArticleHtml = String.raw`
<p><strong>The 2024 Player's Handbook calls your character's people a species; older books use race.</strong> At a 2024 table, choose a species for its traits and the person you want to portray, then choose a background for ability score increases and an Origin feat. That split matters when an older guide tells you to match a race's ability scores to a class.</p>

<p>The ten core 2024 species are Aasimar, Dragonborn, Dwarf, Elf, Gnome, Goliath, Halfling, Human, Orc, and Tiefling. There is no universal best pick. A useful choice gives you one clear character idea, traits you will enjoy remembering, and a visual identity the rest of the table can recognize.</p>

<h2>Start with the rulebook your table uses</h2>
<table>
  <thead>
    <tr>
      <th scope="col">Question</th>
      <th scope="col">2014 rules</th>
      <th scope="col">2024 rules</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Core term</th>
      <td>Race</td>
      <td>Species</td>
    </tr>
    <tr>
      <th scope="row">Ability scores</th>
      <td>The race usually supplies increases.</td>
      <td>The background supplies the increases.</td>
    </tr>
    <tr>
      <th scope="row">Core list</th>
      <td>Nine races, including Half-Elf and Half-Orc.</td>
      <td>Ten species, adding Aasimar, Goliath, and Orc to the core book.</td>
    </tr>
    <tr>
      <th scope="row">First character-building check</th>
      <td>Read the race and subrace text from the source your campaign permits.</td>
      <td>Read species, background, and class as separate choices.</td>
    </tr>
  </tbody>
</table>

<p>Do not silently combine the two columns. Ask the DM which ruleset and source list the campaign uses. If a 2024 game permits an older species, follow the table's compatibility rule instead of carrying an old ability score increase into the new background system.</p>

<h2>Compare the ten 2024 DnD species</h2>
<table>
  <thead>
    <tr>
      <th scope="col">Species</th>
      <th scope="col">Character direction</th>
      <th scope="col">Traits to read closely</th>
      <th scope="col">Strong token cue</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Aasimar</th>
      <td>A person carrying a celestial gift, duty, or unwanted expectation</td>
      <td>Healing, resistances, and a temporary celestial revelation</td>
      <td>A restrained halo, luminous eyes, or one radiant accent</td>
    </tr>
    <tr>
      <th scope="row">Dragonborn</th>
      <td>A draconic hero whose ancestry is visible before they speak</td>
      <td>Breath Weapon, damage resistance, and later draconic flight</td>
      <td>Scale color, horn silhouette, and breath color</td>
    </tr>
    <tr>
      <th scope="row">Dwarf</th>
      <td>A sturdy traveler shaped by craft, clan, home, or a break from tradition</td>
      <td>Darkvision, resilience, toughness, and stone awareness</td>
      <td>A broad silhouette plus one tool, braid, or clan mark</td>
    </tr>
    <tr>
      <th scope="row">Elf</th>
      <td>A long-lived person whose lineage changes their magic and senses</td>
      <td>Elven Lineage, Fey Ancestry, Keen Senses, and Trance</td>
      <td>Ear shape, lineage color, and a single magical motif</td>
    </tr>
    <tr>
      <th scope="row">Gnome</th>
      <td>A small adventurer with sharp mental defenses and lineage magic</td>
      <td>Gnomish Cunning and the Forest or Rock lineage</td>
      <td>A clear hat, hairstyle, gadget, or woodland detail</td>
    </tr>
    <tr>
      <th scope="row">Goliath</th>
      <td>A hero marked by giant ancestry without being locked into one culture</td>
      <td>Giant Ancestry, powerful movement, and Large Form</td>
      <td>Strong shoulder shape, skin markings, and a giant-themed accent</td>
    </tr>
    <tr>
      <th scope="row">Halfling</th>
      <td>A brave, mobile adventurer who survives bad moments with good fortune</td>
      <td>Luck, Brave, Nimbleness, and a small size</td>
      <td>An open face, compact gear, and a readable hand-held prop</td>
    </tr>
    <tr>
      <th scope="row">Human</th>
      <td>A flexible concept defined more by history, training, and ambition</td>
      <td>Resourceful, Skillful, and an additional Origin feat</td>
      <td>Profession, faction, region, or personal keepsake</td>
    </tr>
    <tr>
      <th scope="row">Orc</th>
      <td>A determined adventurer with forceful movement and refusal to fall</td>
      <td>Adrenaline Rush, Darkvision, and Relentless Endurance</td>
      <td>Tusks, posture, and one bold color block</td>
    </tr>
    <tr>
      <th scope="row">Tiefling</th>
      <td>A person with a fiendish legacy that need not decide their morals</td>
      <td>Fiendish Legacy, resistance, Darkvision, and inherited spells</td>
      <td>Horn silhouette, tail, and legacy-linked color</td>
    </tr>
  </tbody>
</table>

<p>This is a selection map, not a replacement for the rulebook. Once two options stand out, read their full entries and write down the traits that change play. A species with several active choices asks for more tracking than one built around passive defenses.</p>

<h2>Use four questions to choose</h2>
<h3>1. What should strangers notice first?</h3>
<p>Pick one visible fact or social assumption your character meets often. It might be a dragonborn's unmistakable ancestry, an aasimar hiding a celestial sign, or a human identified by a guild badge. You are choosing a source of scenes, not a costume.</p>

<h3>2. Which trait will you enjoy remembering?</h3>
<p>Some players like a button they can press at the right moment. Others prefer reliable defenses or movement that stays useful without extra decisions. Read the actual trait text and imagine three ordinary turns. If you already resent the bookkeeping, choose the simpler option.</p>

<h3>3. Does the species support the class fantasy?</h3>
<p>Support does not mean chasing an ability score bonus. In 2024 rules, that job moved to the background. Look instead at the scene you want: an orc wizard who refuses to drop, a goliath rogue whose size changes the room, or a tiefling paladin whose fiendish legacy complicates an oath. Then compare the <a href="${EN_DND_CLASSES_PATH}">DnD classes guide</a> for the other half of the concept.</p>

<h3>4. Can the table identify the token at a glance?</h3>
<p>A round VTT token is small. Give the portrait one species cue and one personal cue. Horns plus a blue scarf read more clearly than six tiny pieces of jewelry. Keep the face and silhouette inside the crop, and do not let the border cover the detail that distinguishes the character.</p>

<h2>Keep 2014 races separate from 2024 species</h2>
<p>The 2014 core races were Dwarf, Elf, Halfling, Human, Dragonborn, Gnome, Half-Elf, Half-Orc, and Tiefling. The 2024 core book replaced that particular nine-entry list with ten species. Half-Elf and Half-Orc are therefore legacy 2014 options rather than entries in the 2024 core list; Orc is now a core species in its own right.</p>

<p>That does not erase an older character. It does mean the sheet needs a declared rules source. Write “2014 Half-Elf,” “2024 Orc,” or the exact approved source beside the choice. This small note prevents ability scores, traits, and terminology from drifting between versions during play.</p>

<h2>Watch a species overview</h2>
<p><a href="${DND_RACES_VIDEO_URL}" rel="noreferrer noopener">This DnD species overview video</a> gives you another way to compare the options. Use it to narrow the field, then confirm wording in the source your table permits.</p>

${liteVideoEmbed(DND_RACES_VIDEO_ID, 'DnD races and species overview', {
  src: DND_RACES_COVER_PATH,
  alt: 'A fantasy adventuring party representing several DnD species around a glowing tabletop map',
})}

<h2>Turn the choice into a readable VTT token</h2>
<ol>
  <li><strong>Choose one species cue.</strong> Use horns, ears, scales, tusks, stature, or a supernatural accent.</li>
  <li><strong>Add one personal cue.</strong> Show the character's class, trade, oath, faction, or favorite item.</li>
  <li><strong>Crop for the map.</strong> Keep the eyes, face, and outer silhouette clear at small size.</li>
  <li><strong>Check the party lineup.</strong> Change the border or dominant color if two tokens look alike.</li>
</ol>

<p>Open the <a href="${EN_EDITOR_PATH}">Token Maker editor</a> when the character brief is ready. After choosing a class and background, the <a href="${EN_DICE_ROLLER_PATH}">DnD dice roller</a> can handle the first physical dice decisions without mixing them into the species choice.</p>

<h2>DnD races FAQ</h2>
<h3>How many races are in the 2024 Player's Handbook?</h3>
<p>The 2024 Player's Handbook presents ten core species: Aasimar, Dragonborn, Dwarf, Elf, Gnome, Goliath, Halfling, Human, Orc, and Tiefling.</p>

<h3>Why does DnD now say species instead of race?</h3>
<p>The 2024 core rulebooks use species for the game trait that older books called race. Both terms still appear in guides and table talk, so check the publication date and rules version whenever a guide says race.</p>

<h3>What happened to Half-Elf and Half-Orc?</h3>
<p>Half-Elf and Half-Orc appear in the 2014 core rules but are not separate species in the 2024 core list. A table can still permit older character options under its compatibility rules, so ask which sources are allowed.</p>

<h3>What is the best DnD species for a beginner?</h3>
<p>The best beginner choice is one whose traits you understand and whose character idea you want to play. Human, Dwarf, Halfling, and Orc can all support straightforward concepts, but no one species is required for a first character.</p>

<h3>Do 2024 species give ability score increases?</h3>
<p>No. In the 2024 character-creation rules, ability score increases come from the background rather than the species. This is one reason old race-and-class optimization advice needs a version check.</p>

<h2>Sources</h2>
<ul>
  <li><a href="${DND_RACES_2024_CHARACTER_CREATION_URL}" rel="noreferrer noopener">D&amp;D Beyond Basic Rules (2024): Creating a Character</a></li>
  <li><a href="${DND_RACES_2024_SPECIES_OVERVIEW_URL}" rel="noreferrer noopener">D&amp;D Beyond: The 10 Species in the 2024 Player's Handbook</a></li>
  <li><a href="${DND_RACES_2014_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond: Player's Handbook (2014)</a></li>
  <li><a href="${DND_RACES_TERMINOLOGY_URL}" rel="noreferrer noopener">D&amp;D Beyond: Moving On From Race in the 2024 Core Rulebooks</a></li>
</ul>
`;

export const dndRacesArticleHtmlZh = String.raw`
<p><strong>2024 版《玩家手册》用 Species 表示角色所属的族群，旧版常见说法则是 DND 种族。</strong>在 2024 规则里，Species 提供族群特性，背景负责属性值加成与 Origin Feat。旧攻略如果让你根据种族属性加成去匹配职业，先看清它写的是哪个版本。</p>

<p>2024 核心规则共有十个 Species：Aasimar、Dragonborn、Dwarf、Elf、Gnome、Goliath、Halfling、Human、Orc 和 Tiefling。没有一个选项对所有角色都最强。真正好用的选择，会给你一个想演的角色、几项愿意记住的能力，以及一眼能认出的桌面形象。</p>

<h2>先确定跑团使用哪个规则版本</h2>
<table>
  <thead>
    <tr>
      <th scope="col">要确认的事</th>
      <th scope="col">2014 规则</th>
      <th scope="col">2024 规则</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">核心术语</th>
      <td>Race（种族）</td>
      <td>Species</td>
    </tr>
    <tr>
      <th scope="row">属性值加成</th>
      <td>通常来自种族。</td>
      <td>来自背景。</td>
    </tr>
    <tr>
      <th scope="row">核心名单</th>
      <td>九个种族，包含 Half-Elf 和 Half-Orc。</td>
      <td>十个 Species，Aasimar、Goliath 与 Orc 进入核心书。</td>
    </tr>
    <tr>
      <th scope="row">建角时先查什么</th>
      <td>读取战役允许来源中的种族与亚种文本。</td>
      <td>把 Species、背景和职业当作三个独立选择。</td>
    </tr>
  </tbody>
</table>

<p>不要把两栏规则自行拼在一起。先问 DM 本次战役使用哪个版本、允许哪些来源。2024 团若允许旧 Species，也要按桌上约定的兼容规则处理，不能顺手把旧属性值加成带进新的背景系统。</p>

<h2>快速对比十个 2024 DND Species</h2>
<table>
  <thead>
    <tr>
      <th scope="col">Species</th>
      <th scope="col">适合发展的角色方向</th>
      <th scope="col">需要细读的特性</th>
      <th scope="col">Token 视觉线索</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Aasimar</th>
      <td>背负天界恩赐、责任或外界期待的人</td>
      <td>治疗、抗性与暂时显现的天界力量</td>
      <td>克制的光环、发光眼睛或一处光明色</td>
    </tr>
    <tr>
      <th scope="row">Dragonborn</th>
      <td>外形直接显露龙族血统的冒险者</td>
      <td>吐息、伤害抗性与后期的龙翼飞行</td>
      <td>鳞片颜色、角的轮廓与吐息色彩</td>
    </tr>
    <tr>
      <th scope="row">Dwarf</th>
      <td>受手艺、氏族、故乡或传统冲突影响的人</td>
      <td>黑暗视觉、韧性、强健与石头感知</td>
      <td>宽厚轮廓，加一件工具、发辫或氏族标记</td>
    </tr>
    <tr>
      <th scope="row">Elf</th>
      <td>血统会改变魔法与感官的长寿角色</td>
      <td>Elven Lineage、Fey Ancestry、Keen Senses 与 Trance</td>
      <td>耳形、血统主色与一个魔法图案</td>
    </tr>
    <tr>
      <th scope="row">Gnome</th>
      <td>精神防御可靠、拥有血统魔法的小型冒险者</td>
      <td>Gnomish Cunning，以及 Forest 或 Rock 血统</td>
      <td>清楚的帽子、发型、机械小物或林地细节</td>
    </tr>
    <tr>
      <th scope="row">Goliath</th>
      <td>带有巨人血统，但不必被单一文化固定的人</td>
      <td>Giant Ancestry、强力移动与 Large Form</td>
      <td>肩部轮廓、皮肤纹样与巨人主题装饰</td>
    </tr>
    <tr>
      <th scope="row">Halfling</th>
      <td>勇敢、灵活，还能在坏时刻靠好运脱身的人</td>
      <td>Luck、Brave、Nimbleness 与小型体型</td>
      <td>开放表情、紧凑装备与能看清的手持物</td>
    </tr>
    <tr>
      <th scope="row">Human</th>
      <td>更适合由经历、训练和野心定义的自由概念</td>
      <td>Resourceful、Skillful 与额外 Origin Feat</td>
      <td>职业、阵营、地区或私人物件</td>
    </tr>
    <tr>
      <th scope="row">Orc</th>
      <td>行动果断，并且很难被真正击倒的冒险者</td>
      <td>Adrenaline Rush、Darkvision 与 Relentless Endurance</td>
      <td>獠牙、姿态与一块醒目的主色</td>
    </tr>
    <tr>
      <th scope="row">Tiefling</th>
      <td>带有邪魔血统，但道德不由血统决定的人</td>
      <td>Fiendish Legacy、抗性、Darkvision 与继承法术</td>
      <td>角的轮廓、尾巴与血统对应色</td>
    </tr>
  </tbody>
</table>

<p>这张表只负责帮你缩小范围，不能代替规则书。剩下两个候选时，阅读完整条目，把会实际改变游戏的特性写下来。需要主动选择时机的 Species，记忆负担通常比依靠被动防御的选项更高。</p>

<h2>用四个问题做决定</h2>
<h3>1. 陌生人第一眼会注意什么？</h3>
<p>选一个经常能引发场景的外形事实或社会印象。Dragonborn 的血统很难隐藏，Aasimar 可能刻意遮住天界标记，Human 也可能先被认成某个公会成员。你选的是故事入口，不是一套服装。</p>

<h3>2. 哪一种特性是你愿意记住的？</h3>
<p>有人喜欢在关键时刻按下一项主动能力，也有人更喜欢不用额外判断的防御或移动。阅读实际规则，再想象三个普通回合。如果光是设想记录方式就觉得麻烦，换一个更简单的候选。</p>

<h3>3. Species 能否强化职业幻想？</h3>
<p>这里说的不是追逐属性值加成；2024 规则已经把它交给背景。应该看你想演什么：拒绝倒下的 Orc 法师、体型会改变场面的 Goliath 游荡者，或让邪魔血统和誓言彼此冲突的 Tiefling 圣武士。另一半选择可以对照 <a href="${ZH_DND_CLASSES_PATH}">DND 职业指南</a>。</p>

<h3>4. 地图上能否一眼认出这个 Token？</h3>
<p>圆形 VTT Token 的显示尺寸很小。给角色保留一个 Species 线索，再加一个私人线索。角和蓝围巾会比六件细小首饰更清楚。裁切时把脸、眼睛和外轮廓留在框内，不要让边框挡住辨识角色的关键细节。</p>

<h2>把 2014 Race 与 2024 Species 分清</h2>
<p>2014 核心种族是 Dwarf、Elf、Halfling、Human、Dragonborn、Gnome、Half-Elf、Half-Orc 和 Tiefling。2024 核心书改为十个 Species。Half-Elf 与 Half-Orc 属于 2014 旧版核心选项，不在 2024 核心名单中；Orc 则以独立 Species 进入 2024 核心规则。</p>

<p>旧角色不会因此失效，但角色卡需要写明规则来源。标注“2014 Half-Elf”“2024 Orc”或实际获准来源，就能避免属性值、特性和术语在跑团过程中混成一个不存在的版本。</p>

<h2>观看 Species 概览视频</h2>
<p><a href="${DND_RACES_VIDEO_URL}" rel="noreferrer noopener">这段 DND Species 概览视频</a>提供另一种对比方式。先用它缩小候选，再回到本次跑团允许的来源核对具体文字。</p>

${liteVideoEmbed(DND_RACES_VIDEO_ID, 'DND 种族与 Species 概览', {
  src: DND_RACES_COVER_PATH,
  alt: '多名不同 DND Species 的奇幻冒险者围在发光桌面地图旁',
})}

<h2>把角色选择变成清楚的 VTT Token</h2>
<ol>
  <li><strong>选择一个 Species 线索。</strong>可以用角、耳朵、鳞片、獠牙、身材或超自然光效。</li>
  <li><strong>加入一个私人线索。</strong>表现职业、手艺、誓言、阵营或角色珍惜的物品。</li>
  <li><strong>按地图尺寸裁切。</strong>小尺寸下仍要看清眼睛、脸和外轮廓。</li>
  <li><strong>放进队伍阵容检查。</strong>两枚 Token 太像，就更换边框或主色。</li>
</ol>

<p>角色视觉简报确定后，可以打开 <a href="${ZH_EDITOR_PATH}">Token Maker 编辑器</a>。职业与背景也选好后，再用 <a href="${ZH_DICE_ROLLER_PATH}">DND 骰子工具</a>处理最初的实体骰决定，不要把这些选择和 Species 混在一起。</p>

<h2>DND 种族常见问题</h2>
<h3>2024 版《玩家手册》有多少个种族？</h3>
<p>2024 版《玩家手册》收录十个核心 Species：Aasimar、Dragonborn、Dwarf、Elf、Gnome、Goliath、Halfling、Human、Orc 和 Tiefling。</p>

<h3>DND 为什么改用 Species，而不再写 Race？</h3>
<p>2024 核心规则用 Species 表示旧版书籍中称为 Race 的角色特性。两种说法仍会同时出现，所以看到“种族攻略”时要先检查出版时间与规则版本。</p>

<h3>Half-Elf 和 Half-Orc 去哪里了？</h3>
<p>Half-Elf 与 Half-Orc 出现在 2014 核心规则里，但不是 2024 核心名单中的独立 Species。跑团仍可按兼容规则允许旧角色选项，具体要问 DM 开放哪些来源。</p>

<h3>哪个 DND Species 最适合新手？</h3>
<p>最适合新手的是你能理解其特性、也真的想扮演的选项。Human、Dwarf、Halfling 和 Orc 都能支持直接明了的角色概念，但第一个角色并不被迫选择其中任何一个。</p>

<h3>2024 Species 会提供属性值加成吗？</h3>
<p>不会。2024 建角规则把属性值加成交给背景，而不是 Species。因此，旧版种族与职业优化建议必须先做版本检查。</p>

<h2>资料来源</h2>
<ul>
  <li><a href="${DND_RACES_2024_CHARACTER_CREATION_URL}" rel="noreferrer noopener">D&amp;D Beyond 2024 基础规则：创建角色</a></li>
  <li><a href="${DND_RACES_2024_SPECIES_OVERVIEW_URL}" rel="noreferrer noopener">D&amp;D Beyond：2024 版《玩家手册》的十个 Species</a></li>
  <li><a href="${DND_RACES_2014_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond：2014 版《玩家手册》</a></li>
  <li><a href="${DND_RACES_TERMINOLOGY_URL}" rel="noreferrer noopener">D&amp;D Beyond：2024 核心规则术语调整说明</a></li>
</ul>
`;
