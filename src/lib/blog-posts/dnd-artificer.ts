import {
  DND_ARTIFICER_2024_SOURCE_URL,
  DND_ARTIFICER_REANIMATOR_SOURCE_URL,
  DND_ARTIFICER_SUBCLASSES_SOURCE_URL,
  DND_RAVENLOFT_SOURCE_URL,
  EN_DND_5E_ARMORER_PATH,
  EN_DND_STATS_PATH,
  EN_EDITOR_PATH,
  ZH_DND_5E_ARMORER_PATH,
  ZH_DND_STATS_PATH,
  ZH_EDITOR_PATH,
} from './shared';

export const dndArtificerArticleHtml = String.raw`
<p><strong>The DND Artificer is a magical inventor who makes tools, spells, and crafted items matter at the table.</strong> Start by confirming the class source your DM approved. Then choose one job you want to do well. A useful Artificer does not need a gadget for every situation. They need a plan that the party can recognize.</p>

<h2>Confirm the Artificer rules at your table</h2>
<p>The revised Artificer is published in the 2025 book <a href="${DND_ARTIFICER_2024_SOURCE_URL}" rel="noreferrer noopener">Eberron: Forge of the Artificer</a> and is compatible with the 2024 rules. It is not in the 2024 <em>Player's Handbook</em>. That book contains Alchemist, Armorer, Artillerist, Battle Smith, and Cartographer. <a href="${DND_RAVENLOFT_SOURCE_URL}" rel="noreferrer noopener">Ravenloft: The Horrors Within</a> adds Reanimator. Check the exact book before you copy a spell, feature, or subclass from an older guide.</p>

<p>2014 and <em>Tasha's Cauldron of Everything</em> Artificer material still appears in many builders and articles. It can be right for a legacy campaign. It is not interchangeable with the revised class. Write the approved class source and subclass source on the sheet before the first session. That small note prevents an old feature list from quietly becoming a rules argument.</p>

<h2>Pick a job before you pick a subclass</h2>
<p>The published subclasses point in different directions. Pick the one that gives your group something it needs and gives you turns you will enjoy taking.</p>

<h3>Alchemist: help the party recover and adapt</h3>
<p>Choose Alchemist when you want bottles, reagents, field medicine, and prepared answers to be the character's language. It suits a player who enjoys helping allies through a bad round, carrying unusual supplies, and turning preparation into a useful choice.</p>

<h3>Armorer: make the suit your role</h3>
<p>Choose Armorer when the armor is the center of the character. It fits a player who wants the table to see a clear defender or infiltrator rather than a general-purpose inventor in heavy gear. The <a href="${EN_DND_5E_ARMORER_PATH}">DND Armorer guide</a> covers the important source boundary for the suit's models.</p>

<h3>Artillerist: make a firing position matter</h3>
<p>Choose Artillerist when magical artillery and battlefield pressure sound more fun than standing toe to toe. This is the path for a player who likes choosing where the fight should happen, then making that space expensive for enemies to ignore.</p>

<h3>Battle Smith: fight beside a construct</h3>
<p>Choose Battle Smith when a constructed companion belongs in the character concept, not only in the backstory. It fits a weapon-using inventor who wants their own turn and a defender's position to work together.</p>

<h3>Cartographer: move the party through the problem</h3>
<p>Choose Cartographer when routes, maps, exploration, and encounter movement are the fun part. The revised-class source introduced it as a new option. Its identity is not "Artificer with a bigger weapon." It is the person who makes a path, a map, or a change in position count when the scene is getting away from the party.</p>

<h3>Reanimator: bring a horror companion only to the right table</h3>
<p>Choose Reanimator when your campaign welcomes body horror and necromancy, and when you want a reanimated companion to shape the character's turns. The <a href="${DND_ARTIFICER_REANIMATOR_SOURCE_URL}" rel="noreferrer noopener">official Reanimator overview</a> makes the tone plain. Talk it through before you bring a grim workshop concept to a lighthearted game.</p>

<h2>Build level one around one repeatable job</h2>
<p>Intelligence is the Artificer's spellcasting ability. Give it your strongest starting score, then decide what lets your job survive contact with the table. Constitution helps the character stay in play. Dexterity can matter for movement, initiative, and a concept that does not want to lead from the front. Read the source your DM approved before treating any online array as a rule.</p>

<p>Do not begin with a shopping list. Write one sentence instead: "I keep enemies off our back line," "I give the party a route through dangerous ground," or "I make the target stand where we want it." That sentence tells you which tools, spells, equipment, and subclass questions deserve attention. The <a href="${EN_DND_STATS_PATH}">DND stats guide</a> helps when you need to turn that job into a starting array.</p>

<p>Let the tools show up in play. A battered map case, a vial roll, an insulated cannon brace, or a set of smith's tools gives you something concrete to describe when magic happens. One well-chosen prop does more for the character than a page of invented laboratory jargon.</p>

<h2>Make item decisions with the party in mind</h2>
<p>Artificers have a natural reason to care about magic items. Start with a problem the group actually has. Are attacks missing? Is someone losing concentration? Does the party keep failing to cross the same kind of obstacle? Choose one of those problems before you start collecting clever options for yourself.</p>

<p>Bring the DM a short note with the rules source, the item idea, and the character who will use it. That makes approval easier to discuss and gives the table a chance to say what it needs. The best item choice is often the one that lets another player do their job cleanly.</p>

<h2>Write down the source and your first-round plan</h2>
<p>Put three lines on the sheet before play:</p>
<ol>
  <li>The Artificer source and subclass source your DM approved.</li>
  <li>Your party job in one sentence.</li>
  <li>Your first turn if a fight starts at medium range.</li>
</ol>

<p>The plan will change when the map changes. That is fine. Its purpose is to give you a place to begin. A Battle Smith might protect one ally while pressuring the threat beside them. An Artillerist might claim a sightline. A Cartographer might open a route for the group. Read the full feature text on your own approved sheet before you decide the exact action.</p>

<h2>Make the character readable on a VTT token</h2>
<p>Once the sheet works, make the job visible at token size. An Armorer needs a clear helmet or armor silhouette. An Artillerist needs the cannon or firing tool in frame. A Battle Smith or Reanimator works better with a separate companion token than with two figures squeezed into one portrait.</p>

<p><a href="${EN_EDITOR_PATH}">Open Token Maker</a>, keep the face and one signature tool inside the crop, then test the result against a VTT grid. The token does not need to explain every rule. It should let the group know who is acting before somebody asks.</p>

<h2>DND Artificer FAQ</h2>
<h3>Where is the current Artificer published?</h3>
<p>The revised Artificer is published in the 2025 book <em>Eberron: Forge of the Artificer</em> and is compatible with the 2024 rules. It is not in the 2024 <em>Player's Handbook</em>. Use the source your DM approved instead of assuming a 2014 guide applies unchanged.</p>

<h3>What ability score matters most for an Artificer?</h3>
<p>Intelligence is the Artificer's spellcasting ability in the revised class. After that, choose scores that support the job, armor, movement, and survival needs of the character you are actually building.</p>

<h3>Which Artificer subclass is best?</h3>
<p>There is no universal best choice. Pick the subclass whose job fills a real gap in your party and fits the kind of turns you enjoy taking.</p>

<h3>Is Cartographer an official Artificer subclass?</h3>
<p>Yes. Cartographer appears with the revised Artificer in <em>Eberron: Forge of the Artificer</em>.</p>

<h3>Can I use a 2014 Artificer in a 2024 campaign?</h3>
<p>Ask the DM. Older Artificer material is common, but a table using the revised class should decide exactly which source and compatibility rules apply before character creation.</p>

<h2>Rules sources</h2>
<ul>
  <li><a href="${DND_ARTIFICER_2024_SOURCE_URL}" rel="noreferrer noopener">D&amp;D Beyond: Eberron: Forge of the Artificer</a></li>
  <li><a href="${DND_ARTIFICER_SUBCLASSES_SOURCE_URL}" rel="noreferrer noopener">D&amp;D Beyond: Five Inventive Artificer Subclasses</a></li>
  <li><a href="${DND_RAVENLOFT_SOURCE_URL}" rel="noreferrer noopener">D&amp;D Beyond: Ravenloft: The Horrors Within</a></li>
  <li><a href="${DND_ARTIFICER_REANIMATOR_SOURCE_URL}" rel="noreferrer noopener">D&amp;D Beyond: Reanimator Artificer overview</a></li>
</ul>
`;

export const dndArtificerArticleHtmlZh = String.raw`
<p><strong>DND Artificer 是把工具、法术和魔法造物带进队伍工作的角色。</strong>先确认 DM 批准的是哪本规则书，再选一个你想稳定完成的职责。好用的 Artificer 不需要为每种情况都准备一个小玩意；你需要的是全队看得懂的计划。</p>

<h2>先确认你这桌使用哪套 Artificer 规则</h2>
<p>修订后的 Artificer 收录在 2025 年出版的 <a href="${DND_ARTIFICER_2024_SOURCE_URL}" rel="noreferrer noopener">Eberron: Forge of the Artificer</a>，兼容 2024 规则，但不在 2024 年的 <em>Player's Handbook</em> 本体中。其中有 Alchemist、Armorer、Artillerist、Battle Smith 和 Cartographer 五个子职业。<a href="${DND_RAVENLOFT_SOURCE_URL}" rel="noreferrer noopener">Ravenloft: The Horrors Within</a> 又加入了 Reanimator。抄技能、法术或子职业前，先核对具体来源。</p>

<p>2014 版和 <em>Tasha's Cauldron of Everything</em> 的 Artificer 内容仍然常见于角色构筑器和旧攻略。它们适合沿用旧规则的战役，却不能和修订版随意拼在一起。开团前在角色卡上写下职业来源和子职业来源，能少掉很多临时翻书和争论。</p>

<h2>先选队伍职责，再选子职业</h2>
<p>这些子职业解决的问题不同。挑一个既能补队伍缺口、又让你愿意反复做同类回合的方向。</p>

<h3>Alchemist：让队友撑过难关</h3>
<p>如果你希望角色拿着药剂、试剂和战地补给行动，选 Alchemist。它适合喜欢在坏回合帮队友稳住局面、提前准备应对方案、把补给转成选择的人。</p>

<h3>Armorer：让护甲直接说明你的职责</h3>
<p>如果护甲才是角色幻想的中心，选 Armorer。它适合希望在桌上清楚扮演护卫者或潜入者的人，而不是穿着重甲却职责模糊的发明家。装甲模型和规则版本的边界可先看 <a href="${ZH_DND_5E_ARMORER_PATH}">DND Armorer 指南</a>。</p>

<h3>Artillerist：把一个位置变成威胁</h3>
<p>如果你更喜欢魔法火炮、远程压制和控制战场空间，选 Artillerist。它适合先决定战斗应该在哪里进行，再让敌人不敢轻易踏进那个位置的玩家。</p>

<h3>Battle Smith：与构装伙伴一起作战</h3>
<p>如果构装伙伴是角色本身的一部分，而不只是背景里的宠物，选 Battle Smith。它适合使用武器，并希望把自己的回合和伙伴的站位配合起来的发明家。</p>

<h3>Cartographer：带队伍穿过难题</h3>
<p>如果地图、路线、探索和改变遭遇中的移动方式比更大的武器更有趣，选 Cartographer。它是修订版新增的方向。别把它理解成“武器不够大的 Artificer”；它擅长让路径、地图和位置变化在局面失控前起作用。</p>

<h3>Reanimator：只在合适的桌上带来恐怖伙伴</h3>
<p>如果战役欢迎身体恐怖和死灵主题，并且你想让复生伙伴参与角色的每个回合，选 Reanimator。<a href="${DND_ARTIFICER_REANIMATOR_SOURCE_URL}" rel="noreferrer noopener">官方 Reanimator 介绍</a>已经说明了它的调性。轻松喜剧桌上，不要把阴森实验室概念当成默认能被接受的前提。</p>

<h2>1 级先围绕一个能重复完成的职责构筑</h2>
<p>修订版 Artificer 用智力施法，所以智力通常应该拿最高起始值。接着再看什么能让你的职责真正落地：体质让角色更能留在场上；敏捷会影响移动、先攻，以及不想站到最前面的构筑。任何网上属性数组都要先服从你这桌批准的规则来源。</p>

<p>不要从购物清单开始。先写一句话："我负责把敌人挡在后排外面"、"我给队伍开出危险区域的路线"，或者"我让目标站到我们希望的位置"。这句话会告诉你哪些工具、法术、装备和子职业问题值得优先处理。需要把职责换成属性分配时，可接着看 <a href="${ZH_DND_STATS_PATH}">DND 属性指南</a>。</p>

<p>让工具在游戏里露面。一只磨旧的地图筒、一排药瓶、隔热的炮架，或一套铁匠工具，都能在你施法时给出具体画面。一个有分量的道具，往往比一整页自创实验室术语更能让人记住角色。</p>

<h2>把魔法物品选择放回队伍需要里</h2>
<p>Artificer 天然会关心魔法物品，但先看队伍真正卡在哪里。是攻击总落空、有人总丢专注、队伍反复过不去同一种障碍，还是某位队友缺少关键手段？先解决一个反复出现的问题，再考虑给自己收集漂亮选项。</p>

<p>和 DM 沟通时，带上三件事：规则来源、物品想法、由谁使用。这样更容易讨论，也能让全队说明需要什么。最好的选择经常是让另一位玩家能干净利落地完成自己的职责。</p>

<h2>写下来源和第一回合计划</h2>
<p>开团前，在角色卡上写三行：</p>
<ol>
  <li>DM 批准的 Artificer 来源和子职业来源。</li>
  <li>你的队伍职责，用一句话写完。</li>
  <li>如果中距离进入战斗，你的第一回合准备做什么。</li>
</ol>

<p>地图不同，计划当然会变。写它不是为了锁死打法，而是为了让你有一个可靠起点。Battle Smith 可能先保护一位队友，再压住身边的威胁；Artillerist 可能先占住一条视线；Cartographer 可能先替队伍打开路线。至于具体动作，始终以你手中那份获批准角色卡上的完整技能文字为准。</p>

<h2>让角色在 VTT Token 尺寸下仍然可读</h2>
<p>角色卡确认后，再让职责在 Token 尺寸下看得出来。Armorer 要有清楚的头盔或护甲轮廓；Artillerist 要把火炮或施法工具留在画面内；Battle Smith 和 Reanimator 通常应该给伙伴单独做 Token，不要把两个角色硬塞进同一张头像。</p>

<p>打开 <a href="${ZH_EDITOR_PATH}">Token Maker</a>，裁切时留下脸部和一件标志性工具，再把结果放到 VTT 网格上试读。Token 不必解释所有规则；它的工作是让大家在问之前就知道轮到谁行动。</p>

<h2>DND Artificer 常见问题</h2>
<h3>当前 Artificer 收录在哪里？</h3>
<p>修订后的 Artificer 收录在 2025 年出版的 <em>Eberron: Forge of the Artificer</em>，并兼容 2024 规则；它不在 2024 年的 <em>Player's Handbook</em> 本体中。使用 DM 批准的来源，不要默认 2014 攻略能原样套用。</p>

<h3>Artificer 最重要的属性是什么？</h3>
<p>修订版 Artificer 用智力施法。之后再根据角色实际承担的职责、护甲、移动方式和生存需求决定其他属性。</p>

<h3>哪个 Artificer 子职业最好？</h3>
<p>没有适合所有队伍的最佳子职业。选能补上真实队伍缺口、也符合你想反复进行的回合类型的那个。</p>

<h3>Cartographer 是官方 Artificer 子职业吗？</h3>
<p>是。Cartographer 与修订后的 Artificer 一起收录在 <em>Eberron: Forge of the Artificer</em>。</p>

<h3>2024 战役还能用 2014 版 Artificer 吗？</h3>
<p>先问 DM。旧版 Artificer 很常见，但使用修订版的桌子应该在建卡前明确具体来源和兼容方式。</p>

<h2>规则来源</h2>
<ul>
  <li><a href="${DND_ARTIFICER_2024_SOURCE_URL}" rel="noreferrer noopener">D&amp;D Beyond：Eberron: Forge of the Artificer</a></li>
  <li><a href="${DND_ARTIFICER_SUBCLASSES_SOURCE_URL}" rel="noreferrer noopener">D&amp;D Beyond：五个 Artificer 子职业介绍</a></li>
  <li><a href="${DND_RAVENLOFT_SOURCE_URL}" rel="noreferrer noopener">D&amp;D Beyond：Ravenloft: The Horrors Within</a></li>
  <li><a href="${DND_ARTIFICER_REANIMATOR_SOURCE_URL}" rel="noreferrer noopener">D&amp;D Beyond：Reanimator Artificer 介绍</a></li>
</ul>
`;
