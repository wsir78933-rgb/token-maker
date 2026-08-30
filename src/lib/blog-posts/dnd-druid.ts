import {
  DND_DRUID_TURN_PLAN_IMAGE_PATH,
  DND_DRUID_VIDEO_ID,
  DND_DRUID_VIDEO_PLACEHOLDER_PATH,
  ZH_DND_DRUID_SPELLS_PATH,
  ZH_EDITOR_PATH,
  liteVideoEmbed,
} from './shared';

export const dndDruidArticleHtml = String.raw`
<p>A <strong>DnD Druid</strong> is a Wisdom caster who borrows tools from the land: control, emergency healing, and later a Beast form. The fantasy is usually the bear. Session one is not about the bear.</p>
<p>On a 2024 sheet, Druid level 1 is Spellcasting, Druidic, and Primal Order. Wild Shape arrives at Druid level 2 in both the 2024 rules and the 2014 rules. Write the table year at the top of the card, pick Magician or Warden before you shop for a wolf portrait, and prepare a first turn that uses a cantrip, a spell slot, or a shield rather than a form you do not have yet.</p>
<h2>Decide whether Druid fits this table</h2>
<p>The class rewards a player who likes a prepared list, concentration, and a job the rest of the party can see. It punishes a player who wants a simple Attack action on round one and a new animal every time someone remembers a stat block.</p>
<div class="article-table-wrap"><table>
<thead><tr><th>If you want to...</th><th>Druid fit</th><th>What you will manage</th></tr></thead>
<tbody>
<tr><td>Control space with plants, weather, or difficult terrain</td><td>Excellent</td><td>Concentration and a short prepared list</td></tr>
<tr><td>Heal without becoming the only medic</td><td>Good</td><td>Healing Word versus a touch spell, plus slot timing</td></tr>
<tr><td>Turn into a Beast in the first fight</td><td>Weak at level 1</td><td>Wild Shape is a level 2 feature in 2014 and 2024</td></tr>
<tr><td>Ignore spell tracking</td><td>Poor</td><td>Druid is a prepared caster with Wisdom DCs</td></tr>
<tr><td>Stand in medium armor from session one</td><td>Mixed</td><td>2024 Warden grants it; Magician does not; 2014 medium armor still has the metal rule</td></tr>
</tbody>
</table></div>
<p>If the class shell is still fuzzy, compare jobs in the <a href="/blog/dnd-classes-explained">DnD classes guide</a> before you spend an evening on Moon versus Land. A Druid who only wanted a bear, and who starts at level 1, will feel underpowered for one session. That is a rules fact, not a personal failure.</p>

<h2>Write 2014 or 2024 before you copy a build</h2>
<p>D&amp;D Beyond now labels the 2024 revision as 5.5e and the 2014 rules as 5e. Both remain supported. They do not share action costs, subclass timing, or Wild Shape hit points. Copying a Moon guide from the other year is how a first sheet gets the wrong Bonus Action.</p>
<p>The official class page that currently ranks first for this query is the <a href="https://www.dndbeyond.com/classes/3-druid" rel="noreferrer noopener">2014 Legacy Druid listing</a>. It is useful for an older table. It is not the 2024 class. The 2024 Wild Shape and Circle of the Moon changes are summarized in the <a href="https://www.dndbeyond.com/posts/1755-the-2024-circle-of-the-moon-druid-and-changes-to" rel="noreferrer noopener">official 2024 Wild Shape article</a>.</p>
<div class="article-table-wrap"><table>
<thead><tr><th>Sheet field</th><th>2014 rules</th><th>2024 rules</th></tr></thead>
<tbody>
<tr><td>Level 1 features</td><td>Druidic and Spellcasting</td><td>Druidic, Spellcasting, and Primal Order</td></tr>
<tr><td>Wild Shape</td><td>Level 2, Action, Beast hit points</td><td>Level 2, Bonus Action, Temporary Hit Points equal to Druid level</td></tr>
<tr><td>Subclass</td><td>Druid Circle at level 2</td><td>Druid subclass at level 3</td></tr>
<tr><td>Armor</td><td>Light, medium, shields; no metal armor or metal shields</td><td>Magician stays on the lighter kit; Warden adds martial weapons and medium armor</td></tr>
<tr><td>Beast forms</td><td>Beasts you have seen, with CR gates</td><td>A short list of known forms you can swap after a Long Rest</td></tr>
</tbody>
</table></div>
<p>Do not combine the two columns. If the table allows an older Druid at a 2024 game, ask which conversion the DM is using. Do not keep 2014 Beast hit points and 2024 Bonus Action Wild Shape on one card.</p>

<h2>Finish a level 1 DnD Druid in five decisions</h2>
<h3>1. Label the ruleset</h3>
<p>Write “2024 Druid” or “2014 Druid” above the ability scores. Add a link to the approved source. That label stops an older Circle writeup from quietly replacing one action cost at a time.</p>
<h3>2. Put Wisdom first, then Constitution</h3>
<p>Wisdom drives spell attacks, save DCs, and most of the class identity. Constitution keeps you conscious and holding concentration when an enemy walks up. With the standard array, a clean assignment before background increases is Wisdom 15, Constitution 14, and the rest according to the job: Dexterity if you expect light armor and Initiative, Strength only if the 2024 Warden kit is the point.</p>
<p>If the modifiers still feel abstract, the <a href="/blog/dnd-stats">DnD stats guide</a> shows how scores, modifiers, and proficiency sit together. For a Druid, the immediate question is simple: which modifier will appear on the spells you actually cast tonight?</p>
<h3>3. Choose the level 1 kit</h3>
<p>On a 2024 sheet, Primal Order is the real fork. Magician gives you one extra Druid cantrip and a boost to Arcana or Nature checks. Warden gives proficiency with martial weapons and medium armor. Magician is the caster who wants another cantrip and better nature lore. Warden is the caster who wants to stand closer without pretending Wild Shape already exists.</p>
<p>On a 2014 sheet there is no Primal Order. You have light armor, medium armor, and shields, and the class text says druids will not wear armor or use shields made of metal. Check the <a href="/blog/dnd-armor-guide">DND armor guide</a> before you buy around an Armor Class you cannot wear.</p>
<h3>4. Prepare a short list, not a wishlist</h3>
<p>You are a prepared caster. You do not need every nature spell in the book for session one. Prepare one control option, one emergency heal, and one exploration tool that matches the adventure. Leave the long rating tables to the <a href="/blog/dnd-druid-spells">Druid spells guide</a>. That page is the spell list. This page is the class.</p>
<p>Cantrips should cover a round when you do not want to spend a slot. A damage cantrip, Guidance, or a utility cantrip you will actually remember is enough. Magician adds one more cantrip on a 2024 sheet. Do not spend the extra pick on a trick you cannot describe in one sentence.</p>
<h3>5. Write one default turn</h3>
<p>A practical default reads like this: move to a place where an ally can still hear you, use a cantrip or a prepared control spell, and keep the Bonus Action free until you know whether someone dropped. It is less dramatic than a bear charge and far more useful on a level 1 map.</p>
<p>If the group rolled scores, the <a href="/dice-roller-dnd">DnD dice roller</a> supports 4d6 drop lowest. Keep the generation method consistent across the party.</p>

<h2>Take a first combat turn that does not wait for a form</h2>
<p>Initiative is a bad time to discover that Wild Shape is still a level away. Use five questions, in order:</p>
<img class="inline-article-image" src="${DND_DRUID_TURN_PLAN_IMAGE_PATH}" alt="Take a first combat turn that does not wait for a form" loading="lazy" decoding="async" fetchpriority="low" width="1536" height="1024" />
<ol>
<li>Is an ally at 0 hit points or about to be? If yes, the Bonus Action heal is the turn.</li>
<li>Can a control spell stop more damage than you can deal? If yes, cast it and protect concentration.</li>
<li>Are you in melee because you chose Warden, or because you wandered? If you wandered, leave.</li>
<li>If none of those apply, use the cantrip you prepared for boring rounds.</li>
<li>After the turn, mark which spell slot you spent. A Druid who forgets the slot count starts improvising from an empty list.</li>
</ol>
<p>A 2014 Druid at level 1 follows the same list. Circle of the Moon is not on that sheet yet. A 2024 Druid at level 1 follows the same list. Primal Order changes armor and cantrips; it does not move Wild Shape to level 1.</p>
<p>Write the five questions in the margin. The first fight will not give you time to reread a handbook chapter.</p>

<h2>Unlock Wild Shape at level 2, then stop mixing rest rules</h2>
<p>Both years give Wild Shape at Druid level 2. That is the feature people came for. It is also where mixing books does the most damage.</p>
<div class="article-table-wrap"><table>
<thead><tr><th>Wild Shape rule</th><th>2014</th><th>2024</th></tr></thead>
<tbody>
<tr><td>Action cost</td><td>Action</td><td>Bonus Action</td></tr>
<tr><td>Uses at level 2</td><td>2</td><td>2</td></tr>
<tr><td>Recharge</td><td>All uses on a Short or Long Rest</td><td>1 use on a Short Rest; all uses on a Long Rest</td></tr>
<tr><td>Hit points</td><td>You assume the Beast's Hit Points</td><td>You keep your Druid Hit Points and gain Temporary Hit Points equal to your Druid level</td></tr>
<tr><td>Forms</td><td>Beasts you have seen, with CR and speed gates</td><td>4 known forms at level 2; swap one after a Long Rest; no Fly speed yet</td></tr>
<tr><td>Speech</td><td>Limited to the Beast</td><td>You can speak in Beast form</td></tr>
</tbody>
</table></div>
<p>2024 Circle of the Moon still leans into the form, but the subclass starts at level 3, and its Temporary Hit Points are three times Druid level. Do not copy that multiplier onto a base Druid. Do not copy 2014 Beast hit points onto a 2024 Moon Druid.</p>
<p>2024 also makes Wild Companion part of the base class: you can spend a Wild Shape use or a spell slot to cast Find Familiar. That is a legal animal on the map at level 2 without claiming a combat form you have not unlocked.</p>
<p>When the form finally arrives, put the Beast on its own token. A portrait that tries to be both the caster and the wolf reads as neither at one-inch scale.</p>

<h2>Wait for the circle until the year on the sheet</h2>
<p>A 2014 Druid picks a Circle at level 2. A 2024 Druid picks a subclass at level 3. If you are still at level 1, you do not need a circle name to play tonight. You need the default turn from the previous section.</p>
<p>When the level arrives, pick the circle by the job you already wrote. Moon is for the player who wants the form to be the combat plan. Land is for the player who wants extra prepared spells and recovery tied to terrain. Other circles exist in expansion books; they are legal only if the DM listed the book. Do not download a tier list and then argue with the table about a source nobody brought.</p>
<p>Moon players should still keep a spell plan for the rounds they are not a Beast. Land players should still know what they do if concentration drops. The circle adds a tool. It does not retire the level 1 checklist.</p>

<h2>Make the job readable on a VTT token</h2>
<p>Once the sheet works, make the job visible at token size. A Magician needs a focus, antler, staff, or holly that still reads after the crop. A Warden needs the armor edge or a martial silhouette. A later Wild Shape needs a second token with a matching border, not a second face squeezed into the same ring.</p>
<p>The <a href="/#editor-workspace">Token Maker editor</a> is a browser workspace for that crop. Upload character art, keep the face and one nature cue inside a circle, square, or polygon mask, add a border if the table uses one, and export a transparent PNG for Roll20, Foundry VTT, or Owlbear. Portrait images can stay in the browser during the normal local-first workflow. Export size goes up to 2048. The token does not need to explain every prepared spell. It should let the group know who is acting before somebody asks.</p>
<p>If the map uses a grid that wants a square footprint, use a square crop rather than forcing a circle onto a square cell. Test the file at the size you actually drop on the map, not at full portrait resolution.</p>

${liteVideoEmbed(DND_DRUID_VIDEO_ID, 'A Crap Guide to D&D [5th Edition] - Druid', {
  src: DND_DRUID_VIDEO_PLACEHOLDER_PATH,
  alt: 'JoCat fifth-edition Druid overview (2014-era tone)',
})}

<h2>DnD Druid FAQ</h2>
<h3>Does a DnD Druid Wild Shape at level 1?</h3>
<p>No. Wild Shape is a Druid level 2 feature in the 2014 rules and in the 2024 rules. Level 1 is spellcasting. On a 2024 sheet you also choose Primal Order. Waiting for a Beast on the first round wastes the turn you already have.</p>
<h3>What are the best stats for a Druid?</h3>
<p>Wisdom is the spellcasting ability. Constitution is the usual second priority for hit points and concentration. Dexterity helps Initiative and light-armor Armor Class. Strength matters mainly if you took the 2024 Warden kit and expect to swing a martial weapon.</p>
<h3>Should a 2024 Druid pick Magician or Warden?</h3>
<p>There is no universal best Primal Order. Magician adds a cantrip and a boost to Arcana or Nature checks. Warden adds martial weapons and medium armor. Pick the kit that matches the first-turn job you wrote, not a circle you cannot take until level 3.</p>
<h3>Can a 2014 Druid wear metal armor?</h3>
<p>The 2014 class text says druids will not wear armor or use shields made of metal. Medium armor is still on the proficiency list when it is not metal. A 2024 Warden is a different kit; do not import the metal sentence onto a 2024 sheet unless the DM kept that table rule.</p>
<h3>When do I choose Circle of the Moon?</h3>
<p>At Druid level 2 on a 2014 sheet, and at Druid level 3 on a 2024 sheet. Moon is the subclass for a player whose combat plan is the Beast form. It is a poor reason to skip Wisdom, prepared spells, and a default caster turn at level 1.</p>
<h3>Can I use a 2014 Druid in a 2024 campaign?</h3>
<p>Ask the DM. D&amp;D Beyond still supports both rulesets. A table using the 2024 class should decide the exact source and compatibility rules before character creation. Do not keep the most generous Wild Shape sentence from each year.</p>
`;

export const dndDruidArticleHtmlZh = String.raw`
<p>先确认 2014 或 2024 规则，再按队伍职责安排感知、体质、训练路线、准备法术和荒野变形。本文给出 1 级建卡顺序、版本差异表与不会卡住的回合计划。</p>
<p>DND 德鲁伊适合愿意在回合前做一点准备的人。这个职业给你的选择很多，临场才翻资料很容易把回合拖长。先把职责写成一句话，会比背完整张表更有用：我是控制入口、支援队友，还是负责侦察和卡位？</p>
<p>选择并不少，真正麻烦的是把不同版本的规则混在一起。2024 与 2014 的荒野变形在动作、资源恢复、形态记录和生命值处理上都不相同。建卡前先问 DM 用哪套规则，之后每一条备注都写上版本。</p>
<h2>先看 2024 DND 德鲁伊的骨架</h2>
<p>2024 德鲁伊以感知为主要属性，生命骰是 d8，擅长智力与感知豁免。基础训练包括简易武器、轻甲、盾牌和药草工具。1 级有两个戏法、四个已准备的 1 环法术与两个 1 环法术位，长休后可以换准备列表。2 级才获得荒野变形。</p>
<p>这副骨架说明了建卡顺序：先把感知放在能稳定施法的位置，体质通常接在后面；再看队伍缺什么，决定你要更靠近前线，还是留在中后排施法。不要先挑一个听起来很酷的形态，再倒推整张角色卡。</p>
<h2>五步完成 1 级建卡</h2>
<h3>第一步：锁定规则版本</h3>
<p>在角色卡顶部写“2014”或“2024”。如果桌上使用 2024，就按该版的准备法术数量、Primal Order 和 2 级荒野变形记录；2014 角色要跳过 Primal Order，并且只用下文的 2014 荒野变形栏。遇到网上构筑时，先看发布日期和规则来源，再看结论。</p>
<h3>第二步：写一句队伍职责</h3>
<p>“我用法术拖住入口，让近战逐个处理目标”比“我是自然法师”更能指导选择。也可以写“我保留支援选择，并用野兽形态侦察”，或“我在前排旁边支援，但不抢主坦的位置”。之后每个法术、装备和形态都用这句话检查。</p>
<h3>第三步：先放感知，再处理体质</h3>
<p>感知决定德鲁伊施法，应该优先。体质通常接在后面，其余属性再按技能与角色概念分配。不要为了偶尔挥一次武器，牺牲主要施法能力。</p>
<h3>第四步：只在 2024 选择 Primal Order</h3>
<p>Magician 多一个德鲁伊戏法，并让感知为奥秘或自然检定提供加值；Warden 给军用武器与中甲训练。想站远一点、依靠法术和知识检定，可以先看 Magician。想靠近前线并保留更多装备路线，再看 Warden。2014 角色没有这一步。</p>
<h3>第五步：做两张小卡</h3>
<p>第一张写“我准备的法术分别解决什么场景”，第二张写“我的荒野形态分别负责侦察、移动还是战斗”。2024 初始掌握四种符合条件的野兽形态；2014 要记录角色见过的野兽。卡片只写常用选项，不要把整本怪物资料搬到桌边。</p>
<p>形态卡只留体型、速度、主要动作和选择理由。2014 再写野兽生命值，2024 再写临时生命值。再标出规则来源页，方便复核。DM 问到时，你也能马上说清自己用的是哪版规则。</p>
<p>卡片只服务当前角色。轮到自己时，你应能直接看见可选动作。每场结束删掉没用的备注，留下真正用过的选择。</p>
<h2>荒野变形：2014 与 2024 不要混用</h2>
<div class="article-table-wrap"><table>
<thead><tr><th>检查项</th><th>2014</th><th>2024</th></tr></thead>
<tbody>
<tr><th>获得等级</th><td>2 级</td><td>2 级</td></tr>
<tr><th>启动</th><td>动作</td><td>附赠动作</td></tr>
<tr><th>初始次数与恢复</th><td>两次；短休或长休后恢复全部</td><td>两次；短休恢复一次，长休恢复全部</td></tr>
<tr><th>初始形态</th><td>见过的野兽；CR 1/4，不能有飞行或游泳速度</td><td>四种已掌握野兽；CR 1/4，不能有飞行速度</td></tr>
<tr><th>生命值</th><td>使用野兽生命值，归零后的过量伤害转回本体</td><td>保留本体生命值，并获得等于德鲁伊等级的临时生命值</td></tr>
</tbody></table></div>
<p>两版低级德鲁伊在野兽形态中都不能施法，但已经建立的专注不会因为变形自动中断。实战中常见的顺序是先施放需要专注的法术，再决定是否变形。别把“还能专注”误写成“还能继续施法”。</p>
<h2>第一回合怎么选</h2>
<p>开战前先看距离、掩体和队友站位。轮到你时，按顺序问四件事：现在是否需要一个法术改变局面；这个法术是否需要专注；变形后是否还要立刻施法；队伍更缺控制、支援还是侦察与卡位。答案写完，动作通常就清楚了。</p>
<img class="inline-article-image" src="${DND_DRUID_TURN_PLAN_IMAGE_PATH}" alt="自然施法者在战术地图前比较法术与野兽形态" loading="lazy" decoding="async" fetchpriority="low" width="1536" height="1024" />
<p>如果当前最缺的是控场或支援，先施法并走到更安全的位置。若法术已经生效，而你需要野兽形态的移动或身体条件，再用荒野变形。2024 变形用附赠动作，2014 用动作，第一回合能做的事会明显不同，所以不能照搬同一套连招。</p>
<p>后续回合不用追求每次都换方案。先维护正在工作的专注，再看队友是否需要支援，然后处理位置，最后才比较单次伤害。你的职责如果仍在发挥，就没有必要为了“更像德鲁伊”而强行变形。</p>
<h2>容易踩的坑</h2>
<p>第一，把法术清单当成职业计划。法术很多不等于每回合都要重新选择；先固定两三个场景，再去看 <a href="${ZH_DND_DRUID_SPELLS_PATH}">DND 德鲁伊法术指南</a>。第二，把荒野变形当成两套规则通用的额外血条，2024 与 2014 的生命值处理不同。第三，先变形再发现必须施法；低级形态不能施法，顺序要在回合前决定。</p>
<h2>角色概念定下后，再做 VTT Token</h2>
<p>当职责、常用形态和视觉特征已经明确，可以把角色立绘带到 <a href="${ZH_EDITOR_PATH}">Token Maker 中文编辑工作区</a>。页面可裁成圆形、方形或多边形，添加边框、遮罩和文字，再导出最高 2048 的透明 PNG。页面标注本地优先处理；角色概念定稿后，再来整理 VTT 素材就行。</p>
${liteVideoEmbed(DND_DRUID_VIDEO_ID, 'A Crap Guide to D&D [5th Edition] - Druid', {
  src: DND_DRUID_VIDEO_PLACEHOLDER_PATH,
  alt: 'JoCat fifth-edition Druid overview (2014-era tone)',
})}

<h2>常见问题</h2>
<h3>DND 德鲁伊适合新手吗？</h3>
<p>适合愿意提前做小卡的玩家。先固定队伍职责、常用法术场景和两三种形态，实际回合就不会被完整法术表拖慢。</p>
<h3>2024 德鲁伊最重要的属性是什么？</h3>
<p>感知是主要属性，也是德鲁伊的施法属性。体质通常排在后面，其他属性再按技能和角色概念分配。</p>
<h3>荒野形态里可以施法吗？</h3>
<p>低级德鲁伊不可以在野兽形态中施法，不过变形不会自动打断已经建立的专注。先施法还是先变形，需要在行动前决定。</p>
<h3>2014 与 2024 的荒野变形能混用吗？</h3>
<p>不能。两版的启动动作、次数恢复、形态记录与生命值处理都不同。建卡时标明版本，并只抄对应规则。</p>
<h3>职业指南会列出所有德鲁伊法术吗？</h3>
<p>不会。本页处理职业职责、建卡、荒野变形和回合顺序；具体准备列表与法术选择留在独立的德鲁伊法术指南中。</p>
`;
