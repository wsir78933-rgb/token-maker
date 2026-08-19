import {
  DND_2014_PLAYERS_HANDBOOK_URL,
  DND_2024_CORE_RULEBOOK_BUNDLE_URL,
  DND_2024_FREE_RULES_ARTICLE_URL,
  DND_2024_PLAYERS_HANDBOOK_ERRATA_URL,
  DND_2024_PLAYERS_HANDBOOK_UPDATES_URL,
  DND_BEYOND_CHANGELOG_URL,
  EN_DICE_ROLLER_PATH,
  EN_DND_CLASSES_PATH,
  EN_DND_RACES_PATH,
  EN_DND_STATS_PATH,
  EN_EDITOR_PATH,
  PLAYERS_HANDBOOK_DND_5E_VIDEO_PLACEHOLDER_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_DND_RACES_PATH,
  ZH_DND_STATS_PATH,
  ZH_EDITOR_PATH,
  liteVideoEmbed,
} from './shared';

const PLAYERS_HANDBOOK_VIDEO_ID = 'WPBnLlqV0Z0';

export const playersHandbookDnd5eArticleHtml = String.raw`
<p><strong>The D&amp;D 5e Player's Handbook is the 2014 book; D&amp;D Beyond now labels the revised 2024 Player's Handbook as 5.5e.</strong> Both belong to fifth edition and both remain supported. Use the version your Dungeon Master chose for the campaign.</p>

<p>Write <code>5e (2014)</code> or <code>5.5e (2024)</code> at the top of the character sheet before choosing a class, background, feat, weapon, or spell. A build that quietly combines a 2014 class, a 2024 background, and whichever spell wording appears first can fail its first rules check at session zero.</p>

<div class="article-table-wrap"><table>
  <thead><tr><th>Your situation</th><th>Use this handbook</th><th>First move</th></tr></thead>
  <tbody>
    <tr><td>New group starting with current rules</td><td>2024 / 5.5e</td><td>Use the 2024 Free Rules or Player's Handbook</td></tr>
    <tr><td>Campaign continuing its 2014 characters</td><td>2014 / 5e</td><td>Keep the legacy handbook and approved supplements</td></tr>
    <tr><td>Joining an existing table</td><td>Whatever the DM names</td><td>Ask for the publication year, not only "fifth edition"</td></tr>
    <tr><td>Older options allowed in a 2024 game</td><td>2024 base rules plus approved legacy source</td><td>Record a source for every older option</td></tr>
  </tbody>
</table></div>

<h2>What is in the D&amp;D 5e Player's Handbook?</h2>
<p>The Player's Handbook is the player's main rulebook. It explains how play works, how to create and advance a character, what the core classes do, how equipment and spells work, and which rules control common actions.</p>

<p>The <a href="${DND_2014_PLAYERS_HANDBOOK_URL}" rel="noreferrer noopener">2014 handbook</a> is the original fifth-edition player book. D&amp;D Beyond marks it as legacy 5e content. Its product page covers the character process, core races and classes, equipment, and more than 350 spells. It remains the right book for a campaign that uses the 2014 rules.</p>

<p>The <a href="${DND_2024_CORE_RULEBOOK_BUNDLE_URL}" rel="noreferrer noopener">2024 revision</a> starts with playing the game, gives character creation a clearer sequence, and adds a Rules Glossary for table lookups. The current book has 12 classes, 10 species, 16 backgrounds, 75 feats, revised spells and equipment, and eight Weapon Mastery properties.</p>

<div class="article-table-wrap"><table>
  <thead><tr><th>Question</th><th>2014 Player's Handbook</th><th>2024 Player's Handbook</th></tr></thead>
  <tbody>
    <tr><td>D&amp;D Beyond label</td><td>5e / Legacy</td><td>5.5e</td></tr>
    <tr><td>Character ancestry term</td><td>Race</td><td>Species</td></tr>
    <tr><td>Starting ability increases</td><td>Usually race-based in the core book</td><td>Background lists eligible abilities</td></tr>
    <tr><td>Level 1 feat</td><td>Not a standard core step</td><td>Background grants an Origin feat</td></tr>
    <tr><td>Weapon Mastery</td><td>Not present</td><td>Eight mastery properties</td></tr>
    <tr><td>Table reference</td><td>Index and chapter sections</td><td>Expanded index and Rules Glossary</td></tr>
  </tbody>
</table></div>

<p>The 2024 book revises fifth edition; it does not turn every earlier adventure or option into unusable material. Compatibility allows older material under stated guidance. It does not make every sentence from both handbooks active at once.</p>

<h2>Pick the handbook that matches the campaign</h2>
<h3>Start a new group with one default</h3>
<p>A group without existing characters or house rules has the cleanest choice. Pick one ruleset and use it for every new character. The 2024/5.5e book has the current terminology, revised classes, and a more direct onboarding path. Choosing 2014/5e is also valid when the group makes that decision deliberately.</p>

<p>Put the choice in the campaign notes: <code>We use the 2024 Player's Handbook and 5.5e rules.</code> That sentence settles which background, spell, weapon, and class text controls when two versions appear online.</p>

<h3>Keep a continuing 2014 campaign stable</h3>
<p>A long-running campaign does not need to rebuild every character because a newer handbook exists. If the table uses 2014 classes, race-based ability increases, and older spell wording, keep the 2014 handbook until the group agrees to migrate.</p>

<p>Treat migration as a campaign rules change. Review every character between sessions. Updating only a stronger class feature or spell while leaving its action cost and supporting rules behind creates a hybrid that neither book defines.</p>

<h3>Ask for the year when joining a table</h3>
<p>"We play fifth edition" no longer answers the whole question. Ask whether characters use 2014 5e or 2024 5.5e, which additional books are allowed, whether older character options are available, and which text controls when an option has two versions.</p>

<p>Keep the answer beside the character's sources. A note such as <code>2024 Fighter, 2024 Soldier, legacy subclass approved by DM</code> prevents more confusion than a page of unsourced build advice.</p>

<h3>Treat mixed-version permission as specific permission</h3>
<p>The 2024 rules include ways to use some older backgrounds and species. Follow that compatibility instruction for the approved older option, then return to the 2024 rules for the rest of the character. If the DM approves a legacy subclass or spell, write down its book and year.</p>

<h2>Stop a mixed build before it reaches the table</h2>
<p>Check five boundaries during character creation:</p>
<ul>
  <li><strong>Class:</strong> use one class table and its full feature progression.</li>
  <li><strong>Origin:</strong> 2014 races and backgrounds follow the older process; 2024 species and backgrounds have different jobs.</li>
  <li><strong>Equipment:</strong> use the weapon properties, armor rules, prices, and starting gear from the approved ruleset.</li>
  <li><strong>Spells:</strong> the same spell name can have different range, duration, components, damage, or action timing.</li>
  <li><strong>Rules terms:</strong> conditions, actions, and glossary terms come from the base rules controlling the character.</li>
</ul>

<p>A 2024 Fighter with a 2014 race ability increase and an older version of a revised feat has not used backward compatibility. The build has skipped the 2024 origin rules. Start from the approved base rules, then add an older option only where the compatibility guidance and DM allow it.</p>

<h2>See what the 2024 handbook changes</h2>
<p>The official overview below walks through the revised handbook, including character creation, classes, backgrounds, feats, equipment, and the Rules Glossary. The video loads only after you press play.</p>

${liteVideoEmbed(PLAYERS_HANDBOOK_VIDEO_ID, "2024 Player's Handbook | Everything You Need to Know | D&D", {
  src: PLAYERS_HANDBOOK_DND_5E_VIDEO_PLACEHOLDER_PATH,
  alt: "Open fantasy rulebooks, dice, and a character sheet prepared for a Player's Handbook overview video",
})}

<h2>Read these sections before your first session</h2>
<p>You do not need to memorize the whole book. Read in the order your first character will use the rules.</p>

<h3>1. Learn the basic conversation and the d20 Test</h3>
<p>Start with the chapter that explains play. Learn the loop: the DM describes a situation, players say what their characters do, and a rule or die roll resolves uncertainty. Know how ability checks, saving throws, and attack rolls use a d20, an ability modifier, and proficiency when a rule grants it.</p>

<h3>2. Follow the character-creation order from your book</h3>
<p>Use the order in the approved handbook. The 2024 sequence separates class, origin, and ability scores differently from the 2014 process. Moving between builders halfway through is how an old race bonus ends up beside a 2024 background.</p>

<p>Use the <a href="${EN_DND_STATS_PATH}">D&amp;D ability score guide</a> for modifiers, standard array, point cost, and 4d6. When the campaign uses rolled scores, the <a href="${EN_DICE_ROLLER_PATH}">D&amp;D dice roller</a> can run the approved method.</p>

<h3>3. Read your class, not every class</h3>
<p>Read the class overview, level 1 features, proficiencies, equipment, and the next two levels. Write down each limited resource, its action type, and whether it returns on a Short or Long Rest. Use the <a href="${EN_DND_CLASSES_PATH}">D&amp;D classes guide</a> to narrow the choice before opening a full class entry.</p>

<h3>4. Read the origin choices that change the sheet</h3>
<p>For 2014, read the race and background entries. For 2024, read the species, background, and Origin feat. The <a href="${EN_DND_RACES_PATH}">D&amp;D species and race guide</a> explains where ability increases moved and how older options stay separate.</p>

<h3>5. Read only the equipment and spells you carry</h3>
<p>Learn the properties of the weapon and armor on the sheet. A 2024 martial character also needs the Weapon Mastery property they can use. A spellcaster should read every prepared or known spell, including casting time, range, components, duration, concentration, target, and save or attack requirement.</p>

<h3>6. Bookmark the glossary instead of memorizing it</h3>
<p>Mark the conditions, actions, and terms your character is likely to trigger. The 2024 Rules Glossary is built for lookup. With the 2014 book, bookmark combat, spellcasting, equipment, and the class entry. Fast lookup beats confident memory when two editions use familiar words differently.</p>

<h2>Use the official free rules before buying</h2>
<p>You can learn and play without downloading an unauthorized Player's Handbook PDF. The <a href="${DND_2024_FREE_RULES_ARTICLE_URL}" rel="noreferrer noopener">2024 Free Rules</a> include all 12 base classes with one subclass each, four species, four backgrounds, 16 feats, 333 spells, equipment, monsters, and the rules of play. The official 2014 Basic Rules remain available as legacy content.</p>

<p>The full handbook adds more subclasses, species or races, backgrounds, feats, spells, artwork, and reference material. Start with free rules while learning what the group uses. Buy or borrow the full book when those additional options and faster table reference matter.</p>

<p>Avoid unexplained full-book downloads. An old scan can be unauthorized, omit corrections, and hide which printing or ruleset you are reading. D&amp;D Beyond publishes a <a href="${DND_BEYOND_CHANGELOG_URL}" rel="noreferrer noopener">current changelog</a> and an <a href="${DND_2024_PLAYERS_HANDBOOK_ERRATA_URL}" rel="noreferrer noopener">official 2024 errata PDF</a>. The <a href="${DND_2024_PLAYERS_HANDBOOK_UPDATES_URL}" rel="noreferrer noopener">official 2024 update summary</a> is a concise way to review the larger revisions.</p>

<h2>Finish the sheet, then make the character visible</h2>
<p>Before session one, confirm the handbook year; class, origin, feat, and spell sources; all six ability modifiers; Armor Class, hit points, Speed, Initiative, and Proficiency Bonus; attack bonuses and saving throw DCs; and one normal first turn plus a fallback turn.</p>

<p>Once the sheet is stable, <a href="${EN_EDITOR_PATH}">open Token Maker</a>, crop the face and one signature item, choose a border that remains readable on the VTT grid, and export a transparent PNG. Keep conditions, concentration, and temporary effects as separate map markers.</p>

<h2>D&amp;D Player's Handbook FAQ</h2>
<h3>Is the 2014 Player's Handbook still valid?</h3>
<p>Yes. D&D Beyond labels the 2014 book as legacy 5e content and continues to support it. It remains the correct rulebook for a campaign that uses the 2014 rules. A table can move to 5.5e, but the newer handbook does not retroactively change an existing campaign.</p>

<h3>Is the 2024 Player's Handbook D&D 5e or 5.5e?</h3>
<p>D&D Beyond currently labels the 2024 revised rules as 5.5e and the 2014 rules as 5e. The 2024 book still belongs to the fifth-edition rules family and is designed to work with older fifth-edition material under its compatibility guidance.</p>

<h3>Can 2014 and 2024 characters play in the same campaign?</h3>
<p>They can when the DM permits it and the table follows the compatibility guidance. Each character should use one base ruleset, and every older option should have an approved source. Compatibility is not permission to combine the strongest wording from both versions.</p>

<h3>Does every player need a Player's Handbook?</h3>
<p>No rule requires every person to own a separate copy. Every player does need reliable access to the rules and character options used at the table. Official free rules can cover a complete starting character, while a shared or personal handbook gives the group more options and faster reference.</p>

<h3>Can I download the D&D 5e Player's Handbook PDF for free?</h3>
<p>Wizards of the Coast does not offer the complete paid Player's Handbook as a free PDF. Use the official 2014 Basic Rules or 2024 Free Rules for legal free access. Avoid unexplained full-book downloads, which can be unauthorized, outdated, or missing errata.</p>
`;

export const playersHandbookDnd5eArticleHtmlZh = String.raw`
<p><strong>2014 年出版的《玩家手册》对应 5e；D&amp;D Beyond 目前把 2024 修订版标为 5.5e。</strong>两者都属于第五版规则体系，也都继续受支持。实际使用哪一本，只看 DM 为本场战役确定的规则版本。</p>

<p>选职业、背景、专长、武器或法术前，先在角色卡顶部写清 <code>5e（2014）</code> 或 <code>5.5e（2024）</code>。如果角色同时拿了 2014 职业、2024 背景和随手搜到的法术文本，零次团很可能才发现三处来源互不相容。</p>

<div class="article-table-wrap"><table>
  <thead><tr><th>你的情况</th><th>使用版本</th><th>第一步</th></tr></thead>
  <tbody>
    <tr><td>新队伍准备采用当前规则</td><td>2024 / 5.5e</td><td>从 2024 免费规则或《玩家手册》开始</td></tr>
    <tr><td>战役继续使用已有的 2014 角色</td><td>2014 / 5e</td><td>保留旧版手册和 DM 批准的扩展书</td></tr>
    <tr><td>加入一桌正在进行的战役</td><td>DM 明确指定的版本</td><td>直接问出版年份，不要只问是不是第五版</td></tr>
    <tr><td>2024 战役允许旧选项</td><td>2024 基础规则加获准旧来源</td><td>给每个旧选项记下书名与年份</td></tr>
  </tbody>
</table></div>

<h2>两版《玩家手册》分别包含什么？</h2>
<p>《玩家手册》是玩家使用的主要规则书，负责解释游戏怎样进行、角色怎样创建与升级、核心职业怎样运作，以及装备、法术和常见行动怎样结算。</p>

<p><a href="${DND_2014_PLAYERS_HANDBOOK_URL}" rel="noreferrer noopener">2014 版手册</a>是第五版最初的玩家规则书。D&amp;D Beyond 现在把它标为旧版 5e 内容，涵盖建卡流程、核心种族和职业、装备，以及 350 多个法术。使用 2014 规则的战役仍应以这本书为准。</p>

<p><a href="${DND_2024_CORE_RULEBOOK_BUNDLE_URL}" rel="noreferrer noopener">2024 修订版</a>先讲游戏流程，再按更清楚的顺序组织建卡，并加入方便桌边查询的规则术语表。书中有 12 个职业、10 个物种、16 个背景、75 个专长、修订后的法术和装备，以及 8 种武器精通属性。</p>

<div class="article-table-wrap"><table>
  <thead><tr><th>对比项</th><th>2014《玩家手册》</th><th>2024《玩家手册》</th></tr></thead>
  <tbody>
    <tr><td>D&amp;D Beyond 当前标签</td><td>5e / 旧版</td><td>5.5e</td></tr>
    <tr><td>角色出身用语</td><td>种族（Race）</td><td>物种（Species）</td></tr>
    <tr><td>初始属性提升</td><td>核心书通常由种族提供</td><td>背景列出可提升的属性</td></tr>
    <tr><td>1 级专长</td><td>不是核心建卡步骤</td><td>背景提供起源专长</td></tr>
    <tr><td>武器精通</td><td>没有</td><td>8 种精通属性</td></tr>
    <tr><td>桌边查询</td><td>索引和各章节</td><td>扩充索引与规则术语表</td></tr>
  </tbody>
</table></div>

<p>2024 版是第五版修订，不会让所有旧冒险或旧角色选项失效。兼容规则允许按明确说明使用较早内容，但不代表两本书里的每一句规则同时生效。</p>

<h2>按战役实际使用的版本选手册</h2>
<h3>新队伍先确定一套默认规则</h3>
<p>没有旧角色和自订规则包袱的新队伍最容易统一。选择一套规则，让所有新角色都以它为基础。2024/5.5e 使用当前术语、修订职业和更直接的入门流程；整桌主动选择 2014/5e 同样成立。</p>

<p>在战役说明中写一句：<code>本团使用 2024《玩家手册》和 5.5e 规则。</code>之后遇到同名背景、法术、武器或职业文本时，这句话就能决定采用哪个版本。</p>

<h3>持续多年的 2014 战役不必被迫迁移</h3>
<p>新书出版不等于旧角色必须重做。仍在使用 2014 职业、种族属性提升和旧法术文本的战役，可以继续使用 2014 手册，直到整桌同意迁移。</p>

<p>迁移属于战役规则变更，应在两场游戏之间统一复核角色。只拿新版中更强的一条职业能力或法术，却保留旧版的行动成本和配套规则，会做出两本书都没有定义的混合角色。</p>

<h3>加入现成队伍时直接问年份</h3>
<p>“我们玩第五版”已经不足以确定规则。问清角色采用 2014 版还是 2024 版、允许哪些扩展书、能否使用旧版角色选项，以及同一选项存在两份文本时以哪份为准。</p>

<p>把答案写在角色来源旁边。例如：<code>2024 战士、2024 士兵背景、DM 批准旧版子职业</code>。明确来源比一页没有出处的构筑建议更有用。</p>

<h3>混用许可必须落实到具体选项</h3>
<p>2024 规则说明了某些旧背景和旧种族的接入方式。使用获准旧选项时按兼容说明处理，角色其他部分仍回到 2024 基础规则。DM 批准旧子职业或旧法术后，也要记录具体书名与年份。</p>

<h2>在角色上桌前排除混版问题</h2>
<p>建卡时检查五条边界：</p>
<ul>
  <li><strong>职业：</strong>使用同一张职业表和完整能力进度。</li>
  <li><strong>出身：</strong>2014 的种族与背景按旧流程；2024 的物种与背景分工不同。</li>
  <li><strong>装备：</strong>武器属性、护甲规则、价格和初始装备全部服从获准版本。</li>
  <li><strong>法术：</strong>同名法术也可能有不同射程、持续时间、成分、伤害或行动时机。</li>
  <li><strong>规则术语：</strong>状态、行动和术语表都以角色基础规则为准。</li>
</ul>

<p>一个 2024 战士如果照搬 2014 种族属性提升，再采用旧版修订专长，就不是在正常使用向后兼容，而是跳过了 2024 出身规则。先按获准基础规则重建，再只在兼容说明与 DM 许可覆盖的地方加入旧选项。</p>

<h2>查看 2024《玩家手册》的主要变化</h2>
<p>下面的官方视频会依次介绍建卡、职业、背景、专长、装备与规则术语表。点击播放前不会加载 YouTube iframe。</p>

${liteVideoEmbed(PLAYERS_HANDBOOK_VIDEO_ID, "2024《玩家手册》主要内容 | D&D 官方说明", {
  src: PLAYERS_HANDBOOK_DND_5E_VIDEO_PLACEHOLDER_PATH,
  alt: "摊开的奇幻规则书、骰子和角色卡，用作《玩家手册》官方介绍视频封面",
})}

<h2>首场游戏前只读这些部分</h2>
<p>不必背完整本手册。按第一个角色实际用到规则的顺序阅读即可。</p>

<h3>1. 先理解游戏对话与 d20 检定</h3>
<p>从游戏流程章节开始：DM 描述情境，玩家说明角色行动，规则或骰子解决不确定结果。先弄懂属性检定、豁免和攻击怎样使用 d20、属性调整值，以及规则允许时加入熟练加值。</p>

<h3>2. 严格按手中版本的顺序建卡</h3>
<p>2024 流程对职业、出身和属性值的安排与 2014 不同。不要建到一半切换网页或生成器，否则很容易把旧种族加值放到 2024 背景旁边。</p>

<p><a href="${ZH_DND_STATS_PATH}">DND 属性指南</a>可以核对调整值、标准数组、购点和 4d6；战役采用随机属性时，可用 <a href="${ZH_DICE_ROLLER_PATH}">DND 骰子工具</a>执行 DM 批准的方法。</p>

<h3>3. 只读自己的职业</h3>
<p>先读职业概览、1 级能力、熟练项、初始装备和接下来两级。把有限资源、行动类型，以及短休或长休恢复方式记在卡上。还没决定职业时，先用 <a href="${ZH_DND_CLASSES_PATH}">DND 职业指南</a>缩小范围。</p>

<h3>4. 读完会改变角色卡的出身选项</h3>
<p>2014 角色要读种族和背景；2024 角色要读物种、背景与起源专长。<a href="${ZH_DND_RACES_PATH}">DND 种族与物种指南</a>说明属性提升移到了哪里，以及旧选项怎样与新版流程分开。</p>

<h3>5. 只读自己携带的装备和法术</h3>
<p>掌握角色卡上的武器和护甲属性。2024 武职还要读自己真正能用的武器精通。施法者需要逐个读完已知或准备法术的施法时间、射程、成分、持续时间、专注、目标和攻击或豁免要求。</p>

<h3>6. 给常用规则做书签，不必硬背</h3>
<p>标记角色经常触发的状态、行动和术语。2024 规则术语表本来就是查询工具；2014 手册则应给战斗、施法、装备和职业章节加书签。两个版本使用相似用语时，现场核对比凭印象更可靠。</p>

<h2>购买前先用官方免费规则</h2>
<p>学习和开团不需要下载来路不明的完整手册 PDF。<a href="${DND_2024_FREE_RULES_ARTICLE_URL}" rel="noreferrer noopener">2024 官方免费规则</a>包含 12 个基础职业及各一个子职业、4 个物种、4 个背景、16 个专长、333 个法术、装备、怪物和游戏规则；2014 基础规则也继续作为旧版内容提供。</p>

<p>完整《玩家手册》增加更多子职业、种族或物种、背景、专长、法术、插图和查询资料。还在确认队伍版本时先用免费规则；需要更多选项或更高效的桌边参考时，再购买或借阅完整手册。</p>

<p>不要使用没有来源说明的完整书 PDF。旧扫描件可能未经授权、遗漏勘误，也看不出属于哪次印刷。D&amp;D Beyond 提供<a href="${DND_BEYOND_CHANGELOG_URL}" rel="noreferrer noopener">更新记录</a>和<a href="${DND_2024_PLAYERS_HANDBOOK_ERRATA_URL}" rel="noreferrer noopener">官方 2024 勘误 PDF</a>；<a href="${DND_2024_PLAYERS_HANDBOOK_UPDATES_URL}" rel="noreferrer noopener">2024 更新摘要</a>可以快速核对主要修订。</p>

<h2>完成角色卡，再让地图上的角色容易识别</h2>
<p>首场游戏前，确认手册年份，职业、出身、专长和法术来源，六项属性调整值，AC、生命值、速度、先攻与熟练加值，攻击加值、豁免 DC，以及一套普通首回合和备用回合。</p>

<p>角色卡稳定后，<a href="${ZH_EDITOR_PATH}">打开 Token Maker</a>，保留面部和一件标志性装备，选择在 VTT 网格上依然清楚的边框，再导出透明 PNG。状态、专注和临时效果应使用独立地图标记。</p>

<h2>DND《玩家手册》常见问题</h2>
<h3>2014 版《玩家手册》现在还能用吗？</h3>
<p>能。D&D Beyond 把 2014 版标为旧版 5e 内容，并继续提供支持。使用 2014 规则的战役仍应以它为准；除非整桌同意迁移，2024 版不会自动改写正在进行的战役。</p>

<h3>2024 版《玩家手册》属于 5e 还是 5.5e？</h3>
<p>D&D Beyond 目前把 2024 修订规则标为 5.5e，把 2014 规则标为 5e。2024 版仍属于第五版规则体系，并通过兼容规则使用较早的第五版内容。</p>

<h3>2014 版和 2024 版角色能在同一场战役里玩吗？</h3>
<p>可以，但必须得到 DM 许可并遵守兼容说明。每个角色应以一套基础规则为准，每个旧选项都要有获准来源。兼容不等于能把两个版本里最有利的措辞拼到一起。</p>

<h3>每位玩家都要有一本《玩家手册》吗？</h3>
<p>规则没有要求每人单独拥有一本。每位玩家都需要稳定查到本桌使用的规则和角色选项。官方免费规则足以完成一个起始角色，共用或个人手册则能提供更多选项并提高查询效率。</p>

<h3>能免费下载完整的 DND 5e《玩家手册》PDF 吗？</h3>
<p>Wizards of the Coast 没有把完整付费《玩家手册》作为免费 PDF 提供。需要合法免费内容时，使用官方 2014 基础规则或 2024 免费规则。来路不明的整书下载可能未经授权、已经过时或缺少勘误。</p>
`;
