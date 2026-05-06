import {
  DND_BARD_2014_RULES_URL,
  DND_BARD_2024_RULES_URL,
  DND_BARD_SPELLS_LIBRARY_IMAGE_PATH,
  DND_BARD_SPELLS_VIDEO_PLACEHOLDER_PATH,
  DND_BARD_SPELLS_VIDEO_URL,
  EN_DICE_ROLLER_PATH,
  EN_DND_CLASSES_PATH,
  EN_DND_CONSTITUTION_PATH,
  EN_DND_COUNTERSPELL_PATH,
  EN_DND_DRUID_SPELLS_PATH,
  EN_EDITOR_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_DND_CONSTITUTION_PATH,
  ZH_DND_COUNTERSPELL_PATH,
  ZH_DND_DRUID_SPELLS_PATH,
  ZH_EDITOR_PATH,
  liteVideoEmbed,
} from './shared';

export const dndBardSpellsArticleHtml = String.raw`
<p><strong>dnd bard spells</strong> are best picked by job, not by how flashy the spell name sounds. A good Bard list covers four things: control, support, social pressure, and one reliable way to save the party when the plan breaks.</p>

<p>This guide gives you the fast picks first, then shows how I would build a Bard spell list for real table play. If you are choosing spells before a campaign, start with the table and then tighten the list around your party.</p>

<table>
  <thead>
    <tr>
      <th>Need</th>
      <th>Best Bard spell picks</th>
      <th>Why it works at the table</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Cantrip damage</strong></td>
      <td>Vicious Mockery</td>
      <td>Low damage, but the disadvantage rider is exactly the kind of annoying support Bards want.</td>
    </tr>
    <tr>
      <td><strong>Early control</strong></td>
      <td>Faerie Fire, Dissonant Whispers, Tasha's Hideous Laughter</td>
      <td>These spells create advantage, movement pressure, or action denial before the Bard gets bigger tools.</td>
    </tr>
    <tr>
      <td><strong>Healing and rescue</strong></td>
      <td>Healing Word, Lesser Restoration, Mass Cure Wounds</td>
      <td>Healing Word is the standout because it picks up a fallen ally at range with a Bonus Action.</td>
    </tr>
    <tr>
      <td><strong>Social scenes</strong></td>
      <td>Charm Person, Disguise Self, Suggestion, Enhance Ability</td>
      <td>These are the spells that make Bard feel different outside combat.</td>
    </tr>
    <tr>
      <td><strong>Mid-level control</strong></td>
      <td>Hypnotic Pattern, Fear, Slow, Greater Invisibility</td>
      <td>The Bard's strongest turns often stop enemies from taking good turns at all.</td>
    </tr>
    <tr>
      <td><strong>Emergency buttons</strong></td>
      <td>Dispel Magic, Dimension Door, Greater Restoration</td>
      <td>Keep at least one answer for magic problems, bad positioning, or a condition that ruins a session.</td>
    </tr>
  </tbody>
</table>

<h2>What Are the Best DND Bard Spells?</h2>
<p><strong>The best dnd bard spells are the ones that give your party more actions, better positioning, or a way out of a failed plan.</strong> Bard is not just a "singing Wizard." The class is strongest when it turns messy scenes into scenes the party can control.</p>

<p>The official Bard class rules are available in the <a href="${DND_BARD_2024_RULES_URL}" rel="noreferrer noopener">2024 Free Rules Bard entry</a>, and older tables may still use the <a href="${DND_BARD_2014_RULES_URL}" rel="noreferrer noopener">2014 Basic Rules Bard entry</a>. Check which rules your table uses before you lock in spell preparation or known-spell assumptions.</p>

<figure class="inline-figure inline-figure--four-three-crop">
  <img
    class="inline-figure__image inline-figure__image--four-three"
    src="${DND_BARD_SPELLS_LIBRARY_IMAGE_PATH}"
    alt="dnd bard spells illustration showing a magical concert hall spell library with floating support, control, healing, and charm glyphs"
    width="1364"
    height="1023"
    loading="lazy"
    decoding="async"
  />
  <figcaption>A Bard spell list works best when it looks like a setlist: one opener, one control piece, one rescue option, and a few tools for scenes that are not fights.</figcaption>
</figure>

<h2>DND Bard Spells by Role</h2>
<p><strong>The easiest way to choose Bard spells is to assign each spell a table role: control, support, healing, social, utility, or escape.</strong> If a spell does not clearly do a job, it has to be extremely fun to justify the slot.</p>

<table>
  <thead>
    <tr>
      <th>Role</th>
      <th>Strong picks</th>
      <th>When I would take them</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Control</strong></td>
      <td>Dissonant Whispers, Faerie Fire, Hypnotic Pattern, Fear, Slow</td>
      <td>Take these when your party already deals damage and needs enemies to lose good turns.</td>
    </tr>
    <tr>
      <td><strong>Support</strong></td>
      <td>Heroism, Enhance Ability, Invisibility, Greater Invisibility</td>
      <td>Take these when one ally can carry a scene if you make them harder to stop.</td>
    </tr>
    <tr>
      <td><strong>Healing</strong></td>
      <td>Healing Word, Cure Wounds, Lesser Restoration, Greater Restoration</td>
      <td>Healing Word is the priority. Most other healing is about fixing a condition, not topping off hit points.</td>
    </tr>
    <tr>
      <td><strong>Social pressure</strong></td>
      <td>Charm Person, Disguise Self, Suggestion, Zone of Truth, Detect Thoughts</td>
      <td>Take these when your campaign has negotiations, schemes, courts, suspects, or social consequences.</td>
    </tr>
    <tr>
      <td><strong>Utility</strong></td>
      <td>Comprehend Languages, See Invisibility, Dispel Magic, Locate Object</td>
      <td>Take these when the party lacks a Wizard or Cleric who already covers the boring answers.</td>
    </tr>
    <tr>
      <td><strong>Escape</strong></td>
      <td>Silence, Dimension Door, Freedom of Movement</td>
      <td>Take these when the campaign punishes bad positioning or spellcaster lockdown.</td>
    </tr>
  </tbody>
</table>

<p>My mistake on early Bards was taking too many "maybe useful" social spells and not enough combat control. One good social spell plus high Charisma often goes further than four charms that all solve the same scene.</p>

<h2>Best Bard Cantrips and 1st-Level Spells</h2>
<p><strong>The best early Bard spells are Vicious Mockery, Healing Word, Faerie Fire, Dissonant Whispers, and Tasha's Hideous Laughter.</strong> They do not all deal big damage, but they change what enemies and allies can do.</p>

<ul>
  <li><strong>Vicious Mockery:</strong> take it because disadvantage can prevent more damage than a small cantrip would deal.</li>
  <li><strong>Healing Word:</strong> the best emergency heal because range and Bonus Action timing matter more than the die size.</li>
  <li><strong>Faerie Fire:</strong> excellent if your party makes many attack rolls and enemies fail Dexterity saves often.</li>
  <li><strong>Dissonant Whispers:</strong> strong because forced movement can trigger opportunity attacks and break enemy plans.</li>
  <li><strong>Tasha's Hideous Laughter:</strong> swingy, but brutal when it removes one dangerous creature from the fight.</li>
</ul>

<p>If you are new to Bard, do not overload on damage spells. A Bard who keeps one ally alive and makes the monster waste a turn often contributes more than a Bard chasing mediocre blast damage.</p>

<h2>Best 2nd- and 3rd-Level Bard Spells</h2>
<p><strong>The Bard's biggest jump comes at 2nd and 3rd level spells, where the list gains stronger utility, better control, and campaign-changing social tools.</strong> This is where the class starts feeling like a real problem-solver.</p>

<table>
  <thead>
    <tr>
      <th>Spell level</th>
      <th>Priority picks</th>
      <th>Practical note</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>2nd</td>
      <td>Enhance Ability, Invisibility, Suggestion, Lesser Restoration, Silence</td>
      <td>Suggestion and Enhance Ability win scenes. Silence wins against some casters if your party can exploit it.</td>
    </tr>
    <tr>
      <td>3rd</td>
      <td>Hypnotic Pattern, Dispel Magic, Fear, Slow, Leomund's Tiny Hut</td>
      <td>Hypnotic Pattern is the classic standout, but Dispel Magic is the spell you miss most when no one has it.</td>
    </tr>
  </tbody>
</table>

<p>For campaign play, I would rather have one clean control spell and one answer spell than three flashy concentration options. You can only concentrate on one spell at a time, so do not build a list that fights itself.</p>

<h2>How Should You Choose Bard Spells for Your Party?</h2>
<p><strong>Choose Bard spells by filling the gaps your party actually has.</strong> Bard is flexible enough to cover social play, control, healing, and utility, but it cannot do all of that perfectly with every spell slot.</p>

<ol>
  <li><strong>If your party lacks healing:</strong> take Healing Word first, then condition removal later.</li>
  <li><strong>If your party lacks control:</strong> prioritize Faerie Fire, Dissonant Whispers, Hypnotic Pattern, Fear, or Slow.</li>
  <li><strong>If your party lacks social tools:</strong> take Suggestion, Disguise Self, Enhance Ability, or Detect Thoughts.</li>
  <li><strong>If your party lacks magic answers:</strong> take Dispel Magic and consider Silence.</li>
  <li><strong>If your party already has everything:</strong> choose spells that fit your Bard's personality and campaign scenes.</li>
</ol>

<p>If you are still deciding whether Bard is the right class, pair this with the <a href="${EN_DND_CLASSES_PATH}">DND classes guide</a>. If your Bard relies on concentration, the <a href="${EN_DND_CONSTITUTION_PATH}">Constitution guide</a> is worth reading before you dump Constitution for one more social stat.</p>

<p>For comparison, the <a href="${EN_DND_DRUID_SPELLS_PATH}">DND druid spells guide</a> shows a prepared-caster approach to control and utility. If your campaign has enemy casters, the <a href="${EN_DND_COUNTERSPELL_PATH}">DND Counterspell guide</a> is useful even when your Bard only gets Counterspell through a specific build or table option.</p>

<h2>Bardic Inspiration, Concentration, and Spell Timing</h2>
<p><strong>Bard spells get much better when you think about action economy before the fight starts.</strong> The Bard often wants to cast a control spell, maintain concentration, hand out Bardic Inspiration, and keep Healing Word ready. Those choices compete.</p>

<ul>
  <li><strong>Do not take only concentration spells.</strong> You need useful turns after your main spell is already running.</li>
  <li><strong>Keep your Bonus Action clean.</strong> Healing Word and Bardic Inspiration both want that space.</li>
  <li><strong>Pre-plan your opener.</strong> Decide whether the first round is control, buff, social disruption, or rescue.</li>
  <li><strong>Protect concentration.</strong> Standing one square too close can delete your best spell.</li>
</ul>

<p>For VTT prep, I would make a separate portrait token for your Bard's normal state and performance state. You can <a href="${EN_EDITOR_PATH}">make a Bard character token in Token Maker</a>, then keep the <a href="${EN_DICE_ROLLER_PATH}">D&amp;D dice roller</a> open for concentration checks, Bardic Inspiration dice, and quick spell damage.</p>

<h2>DND Bard Spells FAQ</h2>
<h3>What is the best Bard spell in DND?</h3>
<p>For many tables, Healing Word and Hypnotic Pattern are the best Bard spells because one rescues allies efficiently and the other can remove multiple enemies from the fight.</p>

<h3>Should Bards take damage spells?</h3>
<p>Bards can take damage spells, but most Bard lists are stronger when they focus on control, support, and emergency utility instead of trying to out-blast dedicated damage casters.</p>

<h3>Is Healing Word better than Cure Wounds for Bards?</h3>
<p>Usually yes. Healing Word works at range and uses a Bonus Action, so it is better for picking up a fallen ally without giving up your whole turn.</p>

<h3>Do Bard spells use Charisma?</h3>
<p>Yes. Bard spellcasting uses Charisma, so your spell save DC and spell attack bonus depend on Charisma plus proficiency.</p>

<h3>Which Bard spells are best for roleplay?</h3>
<p>Suggestion, Disguise Self, Enhance Ability, Detect Thoughts, and Zone of Truth are strong roleplay picks when your campaign has negotiations, deception, investigations, or courts.</p>

<h2 id="video">Watch the Bard Spells Companion Video</h2>
<p>This <a href="${DND_BARD_SPELLS_VIDEO_URL}" rel="noreferrer noopener">Bard D&amp;D video</a> is useful as a tone check after the spell list. The best takeaway is that Bard is a table-shaping class: it wins by making everyone else's turn better, making enemies waste turns, and keeping enough charm to change scenes outside initiative.</p>

<ul>
  <li><strong>Build for jobs:</strong> pick spells that clearly solve control, rescue, social, or utility problems.</li>
  <li><strong>Protect the spotlight:</strong> Bard should make other characters look better, not replace every specialist.</li>
  <li><strong>Keep it playable:</strong> a short spell plan beats a huge list you cannot remember under pressure.</li>
</ul>

${liteVideoEmbed('qiHXxrCB5yk', 'DND Bard spells companion video', {
  src: DND_BARD_SPELLS_VIDEO_PLACEHOLDER_PATH,
  alt: 'Clickable webp video cover for a dnd bard spells guide with lute, spell cards, dice, and arcane music light',
})}
`;

export const dndBardSpellsArticleHtmlZh = String.raw`
<p><strong>dnd bard spells</strong> 不应该按“名字听起来多炫”来选，而应该按桌面职责来选。一个好用的 Bard 法术表，至少要覆盖控场、支援、社交压力，以及计划崩掉时救场的办法。</p>

<p>这篇先给速查表，再讲我会怎样给真实跑团里的 Bard 选法术。如果你正在开团前准备角色，先看第一张表，然后根据队伍短板收紧法术表。</p>

<table>
  <thead>
    <tr>
      <th>需求</th>
      <th>推荐 Bard 法术</th>
      <th>为什么实用</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>戏法伤害</strong></td>
      <td>Vicious Mockery</td>
      <td>伤害不高，但让敌人攻击劣势非常符合 Bard 的支援定位。</td>
    </tr>
    <tr>
      <td><strong>低等级控场</strong></td>
      <td>Faerie Fire, Dissonant Whispers, Tasha's Hideous Laughter</td>
      <td>制造优势、逼迫移动、或让危险敌人浪费动作。</td>
    </tr>
    <tr>
      <td><strong>治疗与救场</strong></td>
      <td>Healing Word, Lesser Restoration, Mass Cure Wounds</td>
      <td>Healing Word 最关键，因为它能用 Bonus Action 远程拉起倒地队友。</td>
    </tr>
    <tr>
      <td><strong>社交场景</strong></td>
      <td>Charm Person, Disguise Self, Suggestion, Enhance Ability</td>
      <td>这些法术让 Bard 在战斗外真正和其他职业拉开差异。</td>
    </tr>
    <tr>
      <td><strong>中期控场</strong></td>
      <td>Hypnotic Pattern, Fear, Slow, Greater Invisibility</td>
      <td>Bard 最强的回合，往往是让敌人根本没法打出好回合。</td>
    </tr>
    <tr>
      <td><strong>紧急按钮</strong></td>
      <td>Dispel Magic, Dimension Door, Greater Restoration</td>
      <td>至少留一个回答魔法问题、站位崩盘或严重状态的工具。</td>
    </tr>
  </tbody>
</table>

<h2>最好的 DND Bard Spells 是哪些？</h2>
<p><strong>最好的 dnd bard spells，是那些能给队伍更多行动、更好站位，或者从失败计划里救人的法术。</strong>Bard 不是“会唱歌的 Wizard”。它强在把混乱场面重新变成队伍能控制的局面。</p>

<p>官方 Bard 职业规则可以看 <a href="${DND_BARD_2024_RULES_URL}" rel="noreferrer noopener">2024 Free Rules 的 Bard 条目</a>；旧桌也可能还在使用 <a href="${DND_BARD_2014_RULES_URL}" rel="noreferrer noopener">2014 Basic Rules 的 Bard 条目</a>。开团前先确认你们桌用哪版规则，再决定准备法术或已知法术的细节。</p>

<figure class="inline-figure inline-figure--four-three-crop">
  <img
    class="inline-figure__image inline-figure__image--four-three"
    src="${DND_BARD_SPELLS_LIBRARY_IMAGE_PATH}"
    alt="dnd bard spells 配图，魔法剧场图书馆里漂浮着支援、控场、治疗和魅惑法术符号"
    width="1364"
    height="1023"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Bard 法术表最好像一张演出 setlist：一个开场控场、一个救场按钮、几个战斗外工具，而不是把所有好听的名字都塞进去。</figcaption>
</figure>

<h2>按职责选择 DND Bard Spells</h2>
<p><strong>选择 Bard 法术最简单的方法，是先给每个法术分配职责：控场、支援、治疗、社交、工具或脱身。</strong>如果一个法术没有清楚职责，那它就必须特别有趣才值得占位置。</p>

<table>
  <thead>
    <tr>
      <th>职责</th>
      <th>强力选择</th>
      <th>什么时候拿</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>控场</strong></td>
      <td>Dissonant Whispers, Faerie Fire, Hypnotic Pattern, Fear, Slow</td>
      <td>队伍已经有伤害，但需要敌人少打几个好回合时。</td>
    </tr>
    <tr>
      <td><strong>支援</strong></td>
      <td>Heroism, Enhance Ability, Invisibility, Greater Invisibility</td>
      <td>某个队友只要不被阻止，就能扛起一个场景时。</td>
    </tr>
    <tr>
      <td><strong>治疗</strong></td>
      <td>Healing Word, Cure Wounds, Lesser Restoration, Greater Restoration</td>
      <td>Healing Word 优先级最高。其他治疗更多是解除状态，而不是把血量奶满。</td>
    </tr>
    <tr>
      <td><strong>社交压力</strong></td>
      <td>Charm Person, Disguise Self, Suggestion, Zone of Truth, Detect Thoughts</td>
      <td>战役里有谈判、骗局、审讯、宫廷或社交后果时。</td>
    </tr>
    <tr>
      <td><strong>工具</strong></td>
      <td>Comprehend Languages, See Invisibility, Dispel Magic, Locate Object</td>
      <td>队伍里没有 Wizard 或 Cleric 负责这些“无聊但关键”的答案时。</td>
    </tr>
    <tr>
      <td><strong>脱身</strong></td>
      <td>Silence, Dimension Door, Freedom of Movement</td>
      <td>战役经常惩罚站位错误，或敌人会锁住施法者时。</td>
    </tr>
  </tbody>
</table>

<p>我早期玩 Bard 的错误，是拿了太多“也许会用到”的社交法术，却没有足够战斗控场。一个好社交法术加高 Charisma，很多时候比四个功能重复的魅惑法术更实用。</p>

<h2>最好的 Bard 戏法和 1 环法术</h2>
<p><strong>早期最实用的 Bard 法术是 Vicious Mockery、Healing Word、Faerie Fire、Dissonant Whispers 和 Tasha's Hideous Laughter。</strong>它们不一定伤害最高，但能改变敌人和队友的行动。</p>

<ul>
  <li><strong>Vicious Mockery：</strong>重点不是伤害，而是攻击劣势可能挡掉更多伤害。</li>
  <li><strong>Healing Word：</strong>远程、Bonus Action、能拉起倒地队友，是 Bard 早期最稳的救场法术。</li>
  <li><strong>Faerie Fire：</strong>如果队伍攻击检定多，而且敌人 Dex 豁免一般，很值得拿。</li>
  <li><strong>Dissonant Whispers：</strong>强在逼迫移动，可能触发借机攻击并打乱敌人计划。</li>
  <li><strong>Tasha's Hideous Laughter：</strong>有点吃豁免，但成功时能让一个危险敌人暂时离线。</li>
</ul>

<p>新手 Bard 不要过度追求伤害法术。一个能救队友、能让怪物浪费回合的 Bard，通常比追求普通爆发伤害的 Bard 更有贡献。</p>

<h2>2 环和 3 环 Bard 法术怎么选？</h2>
<p><strong>Bard 在 2 环和 3 环法术时会迎来明显提升，因为这时拿到更强工具、更好控场和能改变剧情的社交法术。</strong>这个阶段开始，Bard 会真正像一个万能解题角色。</p>

<table>
  <thead>
    <tr>
      <th>法术环级</th>
      <th>优先选择</th>
      <th>实战说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>2 环</td>
      <td>Enhance Ability, Invisibility, Suggestion, Lesser Restoration, Silence</td>
      <td>Suggestion 和 Enhance Ability 能赢下非战斗场景。Silence 对部分施法者很致命，但需要队友配合。</td>
    </tr>
    <tr>
      <td>3 环</td>
      <td>Hypnotic Pattern, Dispel Magic, Fear, Slow, Leomund's Tiny Hut</td>
      <td>Hypnotic Pattern 是经典强项，但真正缺 Dispel Magic 时你会非常想念它。</td>
    </tr>
  </tbody>
</table>

<p>长期战役里，我更愿意带一个清晰控场法术和一个回答问题的法术，而不是三个看起来都很酷的专注法术。你一次只能维持一个 concentration，不要让法术表自己打架。</p>

<h2>怎样按队伍选择 Bard 法术？</h2>
<p><strong>按队伍短板选择 Bard 法术。</strong>Bard 很灵活，可以补社交、控场、治疗和工具位，但它不可能每一项都完美覆盖。</p>

<ol>
  <li><strong>队伍缺治疗：</strong>先拿 Healing Word，之后再补解除状态的法术。</li>
  <li><strong>队伍缺控场：</strong>优先 Faerie Fire、Dissonant Whispers、Hypnotic Pattern、Fear 或 Slow。</li>
  <li><strong>队伍缺社交工具：</strong>拿 Suggestion、Disguise Self、Enhance Ability 或 Detect Thoughts。</li>
  <li><strong>队伍缺魔法答案：</strong>拿 Dispel Magic，并考虑 Silence。</li>
  <li><strong>队伍什么都不缺：</strong>按你的 Bard 性格和战役场景选法术。</li>
</ol>

<p>如果你还在判断 Bard 适不适合你，可以先看 <a href="${ZH_DND_CLASSES_PATH}">DND 职业详解</a>。如果你的 Bard 很依赖 concentration，开团前也建议看 <a href="${ZH_DND_CONSTITUTION_PATH}">Constitution 指南</a>，别为了多一点社交数值把体质压得太低。</p>

<p>如果想对比另一种法术准备思路，可以看 <a href="${ZH_DND_DRUID_SPELLS_PATH}">DND 德鲁伊法术指南</a>。如果战役里敌方法师很多，<a href="${ZH_DND_COUNTERSPELL_PATH}">DND Counterspell 指南</a>也值得顺手读一下，即使 Bard 通常要靠特定构筑或桌面选项才会拿到 Counterspell。</p>

<h2>Bardic Inspiration、Concentration 和施法时机</h2>
<p><strong>Bard 法术是否好用，很大程度取决于你有没有提前想清 action economy。</strong>Bard 经常想开控场、维持 concentration、给 Bardic Inspiration，还要留 Healing Word 救人。这些都会互相竞争。</p>

<ul>
  <li><strong>不要只拿 concentration 法术。</strong>主法术已经维持后，你还需要有用的回合。</li>
  <li><strong>保持 Bonus Action 清爽。</strong>Healing Word 和 Bardic Inspiration 都想占这个位置。</li>
  <li><strong>预设开场动作。</strong>第一回合是控场、支援、社交干扰还是救场，要提前想好。</li>
  <li><strong>保护 concentration。</strong>站位多靠前一格，可能就会让你最强的法术断掉。</li>
</ul>

<p>做 VTT 准备时，我会给 Bard 做普通状态和演出状态两个头像 Token。你可以直接 <a href="${ZH_EDITOR_PATH}">用 Token Maker 制作 Bard 角色 Token</a>，再把 <a href="${ZH_DICE_ROLLER_PATH}">D&amp;D 骰子工具</a> 放旁边，用来跑 concentration 检定、Bardic Inspiration 骰和快速法术伤害。</p>

<h2>DND Bard Spells 常见问题</h2>
<h3>DND 里最好的 Bard spell 是哪个？</h3>
<p>很多桌上，Healing Word 和 Hypnotic Pattern 是最强 Bard 法术之一：前者高效救人，后者可能让多个敌人暂时离开战斗。</p>

<h3>Bard 需要拿伤害法术吗？</h3>
<p>可以拿，但多数 Bard 法术表更适合专注控场、支援和救场工具，而不是试图和专职输出施法者比爆发。</p>

<h3>Healing Word 比 Cure Wounds 更适合 Bard 吗？</h3>
<p>通常是。Healing Word 有距离，而且是 Bonus Action，更适合在不牺牲整回合的情况下拉起倒地队友。</p>

<h3>Bard 法术使用 Charisma 吗？</h3>
<p>是。Bard 使用 Charisma 施法，所以法术豁免 DC 和法术攻击加值都依赖 Charisma 和熟练加值。</p>

<h3>哪些 Bard 法术最适合 roleplay？</h3>
<p>Suggestion、Disguise Self、Enhance Ability、Detect Thoughts 和 Zone of Truth 很适合谈判、欺骗、调查和宫廷剧情。</p>

<h2 id="video">视频：Bard Spells 思路补充</h2>

<ul>
  <li><strong>按职责构筑：</strong>每个法术都要能解决控场、救场、社交或工具问题。</li>
  <li><strong>保护队友 spotlight：</strong>Bard 应该让其他角色表现更好，而不是抢走所有专家位置。</li>
  <li><strong>保持可操作：</strong>一套短而清楚的施法计划，比一长串临场想不起来的法术更有用。</li>
</ul>

${liteVideoEmbed('qiHXxrCB5yk', 'DND Bard spells companion video', {
  src: DND_BARD_SPELLS_VIDEO_PLACEHOLDER_PATH,
  alt: 'dnd bard spells 视频 webp 封面图，展示鲁特琴、法术卡、骰子和奥术音乐光效',
})}
`;
