import {
  DND_PALADIN_2024_CHANGES_URL,
  DND_PALADIN_CURRENT_CLASS_URL,
  DND_PALADIN_OATHS_GUIDE_URL,
  DND_PALADIN_VIDEO_PLACEHOLDER_PATH,
  DND_PALADIN_VIDEO_URL,
  EN_DICE_ROLLER_PATH,
  EN_DND_ARMOR_PATH,
  EN_DND_CLASSES_PATH,
  EN_DND_STATS_PATH,
  EN_EDITOR_PATH,
  EN_PALADIN_2024_SPELLS_DND_PATH,
  PALADIN_2024_CLASS_RULES_URL,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_ARMOR_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_DND_STATS_PATH,
  ZH_EDITOR_PATH,
  ZH_PALADIN_2024_SPELLS_DND_PATH,
  liteVideoEmbed,
} from './shared';

const PALADIN_VIDEO_ID = 'Ch5vWBPCrl0';

export const dndPaladinArticleHtml = String.raw`
<p>A <strong>DnD Paladin</strong> is a front-line warrior who combines martial weapons, divine magic, healing, protective auras, and an oath that shapes both mechanics and roleplay. Pick Paladin when you want to stand near danger, make a few high-impact decisions, and help allies without giving up strong attacks.</p>

<p>Divine Smite is easy to recognize. The harder habit is knowing when to keep the spell slot. A dependable Paladin has a default turn that works without Smite and an oath that appears in choices, rather than only in a speech at level 3.</p>

<aside class="article-callout"><strong>Rules boundary:</strong> this guide uses the 2024 fifth-edition revision. D&amp;D Beyond now labels that ruleset 5.5e and the 2014 rules 5e. Both versions remain supported, but their action costs and early-level features should not be combined on one character sheet.</aside>

<h2>Decide whether Paladin fits your table</h2>
<p>The <a href="${DND_PALADIN_CURRENT_CLASS_URL}" rel="noreferrer noopener">current Paladin class page</a> lists Strength and Charisma as the primary abilities, a d10 Hit Die, martial weapons, heavy armor, and shields. That chassis produces a durable front-line character, but playing it well asks for more than repeating weapon attacks.</p>

<div class="article-table-wrap"><table>
  <thead><tr><th>If you want to...</th><th>Paladin fit</th><th>What you will manage</th></tr></thead>
  <tbody>
    <tr><td>Hold the front line while improving nearby allies</td><td>Excellent</td><td>Positioning, armor, and Aura of Protection</td></tr>
    <tr><td>Rescue an ally without surrendering the whole turn</td><td>Excellent</td><td>Lay on Hands pool and Bonus Action timing</td></tr>
    <tr><td>Deliver costly burst damage after a hit</td><td>Excellent</td><td>Spell slots and Divine Smite timing</td></tr>
    <tr><td>Solve most fights from long range</td><td>Weak</td><td>Paladin tools lean toward melee and short-range support</td></tr>
    <tr><td>Avoid spells and resource tracking</td><td>Mixed</td><td>Healing, prepared spells, Channel Divinity, and positioning</td></tr>
  </tbody>
</table></div>

<p>A player chasing only the largest damage number can end up treating every slot as Smite fuel. Paladin becomes more useful when the group needs a defender who can switch jobs. One round you pressure the main target; the next you pick up a fallen ally or stand where Aura of Protection can keep two allies in the fight.</p>

<p>If the class shell is still uncertain, compare it with the <a href="${EN_DND_CLASSES_PATH}">DnD classes guide</a> before spending time on an oath.</p>

<h2>Build levels 1–3 in five decisions</h2>

<h3>1. Confirm the ruleset</h3>
<p>Write “2024 Paladin” or “2014 Paladin” at the top of your notes. Add a link to the approved source. That label stops an older build guide from quietly replacing one action cost at a time.</p>

<h3>2. Put the best numbers where the class uses them</h3>
<p>Strength drives the common heavy-armor weapon build. Charisma powers spellcasting and becomes especially important when Aura of Protection arrives. Constitution helps a front-line character stay conscious and maintain concentration.</p>

<p>With the standard array, this is a clean assignment before background increases:</p>

<div class="article-table-wrap"><table>
  <thead><tr><th>Ability</th><th>Score</th><th>Reason</th></tr></thead>
  <tbody>
    <tr><td>Strength</td><td>15</td><td>Weapon attacks and heavy front-line play</td></tr>
    <tr><td>Charisma</td><td>14</td><td>Spellcasting, social scenes, and later aura value</td></tr>
    <tr><td>Constitution</td><td>13</td><td>Hit points and concentration saves</td></tr>
    <tr><td>Wisdom</td><td>12</td><td>Perception and common mental pressure</td></tr>
    <tr><td>Dexterity</td><td>10</td><td>Initiative without competing with heavy armor</td></tr>
    <tr><td>Intelligence</td><td>8</td><td>Lowest priority for this example concept</td></tr>
  </tbody>
</table></div>

<p>Apply the increases from a background approved for the campaign. If the group rolls, the <a href="${EN_DICE_ROLLER_PATH}">DnD dice roller</a> supports 4d6 drop lowest. Keep the generation method consistent across the party, and use the <a href="${EN_DND_STATS_PATH}">DnD stats guide</a> when you need the full standard-array, point-buy, and random-generation comparison.</p>

<h3>3. Choose the job before the weapon</h3>
<p>Decide what the party should be able to expect from you. A shield defender stays near vulnerable allies and values reliable Armor Class. A two-handed striker accepts less defense for greater weapon pressure. A mobile hunter needs a route to important targets. A support-first Paladin protects concentration, saves healing for emergencies, and refuses to spend every slot on damage.</p>

<p>Once the job is clear, choose armor, weapon mastery, and Fighting Style that support it. The <a href="${EN_DND_ARMOR_PATH}">DND armor guide</a> handles the detailed AC comparison.</p>

<h3>4. Write one default turn</h3>
<p>A practical default reads like this: move beside the party member most likely to be pressured, attack the enemy blocking that space, and keep the Bonus Action open until the hit and board state are known. It is less dramatic than a damage combo and far more useful across a full adventuring day.</p>

<h3>5. Reach level 3 with an oath question</h3>
<p>“Which oath deals the most damage?” is too narrow. Ask what promise will create decisions in this campaign. A promise that never costs anything disappears after the character introduction.</p>

<h2>Use a turn plan before spending a spell slot</h2>
<p>Four questions keep the turn from collapsing into “attack, then Smite.”</p>

<ol>
  <li><strong>Is an ally about to lose a turn or drop?</strong> Use the rescue tool that changes that outcome. The 2024 Lay on Hands uses a Bonus Action, so healing can often share a turn with an attack.</li>
  <li><strong>Can position protect more than damage can remove?</strong> Hold the space that keeps allies in your support range or keeps an enemy away from the back line.</li>
  <li><strong>Did you land an eligible hit on a target worth the casting?</strong> The 2024 Divine Smite is a Bonus Action spell used immediately after a melee weapon or Unarmed Strike hit. Paladin's Smite grants one no-slot casting per Long Rest; later uses require spell slots.</li>
  <li><strong>Nothing is urgent?</strong> Use the default attack-and-position turn. Keeping a resource is a valid result.</li>
</ol>

<p>Picture a round where the Rogue is unconscious, the boss is bloodied, and your melee weapon attack just hit. Lay on Hands and Divine Smite both look attractive, but only one returns the Rogue's next turn. The party's immediate need decides the Bonus Action.</p>

<p>For prepared-list depth, open the separate <a href="${EN_PALADIN_2024_SPELLS_DND_PATH}">Paladin 2024 spell guide</a>. This class guide keeps its focus on roles, oaths, and repeatable turn decisions.</p>

<h2>Choose an oath by the promise you can keep</h2>
<p>The 2024 Player's Handbook gives the Paladin four core oaths. They share the class chassis, so compare the decisions you want to make instead of chasing a universal tier score.</p>

<div class="article-table-wrap"><table>
  <thead><tr><th>Oath</th><th>Table job</th><th>Promise you can show</th><th>Pressure that tests it</th></tr></thead>
  <tbody>
    <tr><td>Devotion</td><td>Reliable protector and accurate front liner</td><td>Tell the truth, protect the vulnerable, keep your word</td><td>An ally wants a dishonest shortcut for a good result</td></tr>
    <tr><td>Glory</td><td>Mobile morale builder</td><td>Take brave action and help others exceed their limits</td><td>The safer plan abandons a public challenge</td></tr>
    <tr><td>Ancients</td><td>Durable protector with control and nature-flavored utility</td><td>Preserve life, hope, and beauty against despair</td><td>Destroying something corrupted is easier than saving it</td></tr>
    <tr><td>Vengeance</td><td>Focused hunter of a priority target</td><td>Pursue the greater evil and stop further harm</td><td>A lesser wrongdoer offers the only path to the true threat</td></tr>
  </tbody>
</table></div>

<p>Put each attractive oath through three questions:</p>
<ol>
  <li>What will this oath make you do differently in a normal session?</li>
  <li>Which party member is most likely to disagree with its methods?</li>
  <li>What does atonement look like at this table if you fail the promise?</li>
</ol>

<p>If the first answer is vague, the oath is still decoration. If the second has no answer, it may never create roleplay. If the third answer is “the DM removes my class,” agree on a fair failure-and-repair process before play.</p>

<p>The <a href="${DND_PALADIN_OATHS_GUIDE_URL}" rel="noreferrer noopener">Roll20 oath overview</a> offers a useful playstyle comparison. Use the Player's Handbook or another source approved by the DM for the features that go on the character sheet.</p>

<h2>Know the levels that change your job</h2>
<div class="article-table-wrap"><table>
  <thead><tr><th>Level</th><th>2024 landmark</th><th>What changes at the table</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Lay on Hands, Spellcasting, Weapon Mastery</td><td>You begin as a hybrid character, rather than waiting for magic</td></tr>
    <tr><td>2</td><td>Fighting Style, Paladin's Smite</td><td>Your weapon plan sharpens and Divine Smite enters the Bonus Action budget</td></tr>
    <tr><td>3</td><td>Channel Divinity and Paladin subclass</td><td>The oath becomes a mechanical choice</td></tr>
    <tr><td>5</td><td>Extra Attack and Faithful Steed</td><td>You attack twice and gain a reliable mount option</td></tr>
    <tr><td>6</td><td>Aura of Protection</td><td>Charisma and position directly protect nearby saving throws</td></tr>
    <tr><td>9</td><td>Abjure Foes</td><td>Channel Divinity gains a multi-target control option</td></tr>
  </tbody>
</table></div>

<p>Level 6 changes how you read the map. Standing ten feet from the wrong ally can matter more than squeezing another point from a damage calculation. Mark the aura radius when several allies are making dangerous saves.</p>

<h2>Keep 2014 and 2024 Paladin rules separate</h2>
<p>The official <a href="${DND_PALADIN_2024_CHANGES_URL}" rel="noreferrer noopener">2024 versus 2014 Paladin summary</a> records the major changes. Keep this comparison beside any older build you adapt.</p>

<div class="article-table-wrap"><table>
  <thead><tr><th>Question</th><th>2014 Paladin</th><th>2024 Paladin</th></tr></thead>
  <tbody>
    <tr><td>When does Spellcasting start?</td><td>Level 2</td><td>Level 1</td></tr>
    <tr><td>How does Lay on Hands use the turn?</td><td>Action</td><td>Bonus Action</td></tr>
    <tr><td>Does the class have Weapon Mastery?</td><td>No</td><td>Yes, from level 1</td></tr>
    <tr><td>How does Divine Smite enter play?</td><td>Class feature triggered after a melee weapon hit</td><td>Always-prepared spell cast as a Bonus Action immediately after a melee weapon or Unarmed Strike hit; Paladin's Smite grants one no-slot casting per Long Rest</td></tr>
    <tr><td>What changes at level 5 besides Extra Attack?</td><td>No dedicated Faithful Steed class feature</td><td>Find Steed is always prepared, with one free casting per Long Rest</td></tr>
  </tbody>
</table></div>

<p>Do not combine the 2014 on-hit Smite procedure with the 2024 spell, or the 2014 Lay on Hands action with a 2024 character sheet. When a source omits its ruleset, check the publication date and approved book before copying anything.</p>

<p>The complete <a href="${PALADIN_2024_CLASS_RULES_URL}" rel="noreferrer noopener">2024 Paladin class entry</a> is the final reference for the current level table and feature wording.</p>

<h2>Make the oath readable on a VTT map</h2>
<p>A Paladin token should communicate the oath before showing every piece of equipment. Pick one strong cue:</p>
<ul>
  <li><strong>Devotion:</strong> a clean sun, shield, or open-hand emblem.</li>
  <li><strong>Glory:</strong> a laurel, bright mantle, or forward-leaning pose.</li>
  <li><strong>Ancients:</strong> living branches, dawn light, or a green-gold edge.</li>
  <li><strong>Vengeance:</strong> a narrow target mark, broken chain, or darker radiant contrast.</li>
</ul>

<p>Open the <a href="${EN_EDITOR_PATH}">Token Maker editor</a> and crop around the face, shield, and oath cue. Check the portrait at one-inch token size. Keep concentration, Aura of Protection, and mounted state as separate map markers; adding all three to the portrait turns it into unreadable noise.</p>

<p>If Faithful Steed matters to the campaign, make the mount a separate token. Paladin and steed need different footprints and independent positions even when their borders match.</p>

<h2>Watch the older Paladin overview with the right context</h2>
<p>JoCat's <a href="${DND_PALADIN_VIDEO_URL}" rel="noreferrer noopener">Paladin video</a> is a funny, fast overview from the 2014-era rules cycle. It captures the class stereotype and why players enjoy it, but it does not describe current 2024 action costs. Watch it for tone, then use the current tables above for the sheet.</p>

${liteVideoEmbed(PALADIN_VIDEO_ID, 'A Crap Guide to D&D [5th Edition] - Paladin', {
  src: DND_PALADIN_VIDEO_PLACEHOLDER_PATH,
  alt: 'Weathered armored Paladin holding a battered shield in a shadowed stone hall',
})}

<h2>DnD Paladin FAQ</h2>

<h3>Does a DnD Paladin need a god?</h3>
<p>A fifth-edition Paladin is defined by an oath. The character can worship a god, serve a church, or frame the oath without a deity. Agree with the DM on how divine power and oaths work in the campaign setting.</p>

<h3>What are the best stats for a Paladin?</h3>
<p>Strength and Charisma are the current class's primary abilities. Constitution is the usual next priority for a front-line character. A Dexterity build needs an approved weapon, armor, and multiclass plan rather than copying the standard heavy-armor setup.</p>

<h3>Which Paladin oath is best?</h3>
<p>There is no universal best oath. Devotion is a clear protector, Glory rewards mobile heroic play, Ancients adds durability and control, and Vengeance focuses pressure on priority targets. Pick the oath whose job and promise will matter in your campaign.</p>

<h3>How often can a 2024 Paladin use Divine Smite?</h3>
<p>Divine Smite is an always-prepared Bonus Action spell used immediately after a melee weapon or Unarmed Strike hit. Paladin's Smite grants one casting without a spell slot per Long Rest; additional castings require available spell slots and follow the 2024 spellcasting rules.</p>

<h3>Is Paladin beginner friendly?</h3>
<p>Paladin is beginner friendly when you use a default attack-and-position turn and treat healing, Smite, and oath tools as deliberate branches. It becomes harder when every round starts with a search through the full spell list.</p>
`;

export const dndPaladinArticleHtmlZh = String.raw`
<p><strong>DND Paladin 圣武士</strong>是站在前线的武职角色，同时拥有武器攻击、神圣魔法、治疗、保护光环和塑造角色选择的誓言。你想靠近危险、在关键节点做决定，又不愿放弃稳定攻击时，Paladin 很合适。</p>

<p>记住 Divine Smite 的效果不难，难的是知道什么时候该留下法术位。一名可靠的 Paladin 即使不用 Smite，也有能反复执行的默认回合；他的誓言会出现在真实选择里，而不只是一段 3 级宣言。</p>

<aside class="article-callout"><strong>规则边界：</strong>本文以第五版 2024 修订规则为准。D&amp;D Beyond 目前把 2024 规则标为 5.5e，把 2014 规则标为 5e。两个版本都仍受支持，但行动成本与前期职业特性不能混填在同一张角色卡上。</aside>

<h2>先判断 Paladin 是否适合这张桌子</h2>
<p><a href="${DND_PALADIN_CURRENT_CLASS_URL}" rel="noreferrer noopener">当前 Paladin 职业页</a>把 Strength 与 Charisma 列为主要属性，生命骰是 d10，并提供军用武器、重甲和盾牌熟练。这个底盘很耐打，但真正玩好它，需要处理的远不止重复攻击。</p>

<div class="article-table-wrap"><table>
  <thead><tr><th>你想做的事</th><th>契合度</th><th>需要管理的内容</th></tr></thead>
  <tbody>
    <tr><td>守住前线，同时提高附近队友的生存率</td><td>很高</td><td>站位、护甲、Aura of Protection</td></tr>
    <tr><td>救起队友，又不放弃整回合</td><td>很高</td><td>Lay on Hands 点数与 Bonus Action 时机</td></tr>
    <tr><td>命中后打出昂贵的爆发伤害</td><td>很高</td><td>法术位与 Divine Smite 时机</td></tr>
    <tr><td>主要从远距离解决战斗</td><td>较低</td><td>Paladin 工具偏向近战与短距离支援</td></tr>
    <tr><td>完全不想管理法术和资源</td><td>一般</td><td>治疗、准备法术、Channel Divinity 和站位</td></tr>
  </tbody>
</table></div>

<p>如果只追求最高单次伤害，很容易把每个法术位都看成 Smite 燃料。队伍真正需要一个能切换职责的保护者时，Paladin 的价值才会完整显现：这一轮压迫主要目标，下一轮扶起倒地队友，或调整位置让两名队友同时留在保护光环中。</p>

<p>职业底盘还没决定，可以先对照<a href="${ZH_DND_CLASSES_PATH}">DND 职业指南</a>，再投入时间研究誓言。</p>

<h2>用五个决定完成 1–3 级角色</h2>

<h3>1. 先确认规则版本</h3>
<p>在笔记顶端写清“2024 Paladin”或“2014 Paladin”，最好再附上获准使用的规则来源。这个小标签能阻止旧构筑指南一点点替换行动成本。</p>

<h3>2. 把最高数值放到职业真正会用的位置</h3>
<p>常见重甲武器构筑依靠 Strength；Charisma 决定施法，并在获得 Aura of Protection 后变得更重要；Constitution 帮助前线角色保持清醒和专注。</p>

<div class="article-table-wrap"><table>
  <thead><tr><th>属性</th><th>标准数组</th><th>理由</th></tr></thead>
  <tbody>
    <tr><td>Strength</td><td>15</td><td>武器攻击与重甲前线职责</td></tr>
    <tr><td>Charisma</td><td>14</td><td>施法、社交场景与后期光环</td></tr>
    <tr><td>Constitution</td><td>13</td><td>生命值与专注豁免</td></tr>
    <tr><td>Wisdom</td><td>12</td><td>察觉与常见精神压力</td></tr>
    <tr><td>Dexterity</td><td>10</td><td>保留基本先攻，不与重甲抢属性</td></tr>
    <tr><td>Intelligence</td><td>8</td><td>本示例概念的最低优先项</td></tr>
  </tbody>
</table></div>

<p>再按战役批准的 Background 应用属性提升。如果队伍掷属性，<a href="${ZH_DICE_ROLLER_PATH}">DND 骰子工具</a>提供 4d6 去最低流程；整支队伍应使用同一种生成方式。<a href="${ZH_DND_STATS_PATH}">DND 属性指南</a>详细比较了标准数组、购点和随机生成。</p>

<h3>3. 先选职责，再选武器</h3>
<p>先说清楚队友能期待你做什么。持盾保护者靠近脆弱队友，重视稳定 AC；双手武器打手用防御换取更高武器压力；机动猎手要有通往重要目标的路线；支援型 Paladin 会保护专注、把治疗留给紧急情况，也不会把每个法术位都换成伤害。</p>

<p>职责确定后，再选择相配的护甲、Weapon Mastery 与 Fighting Style。完整 AC 对比可以查看<a href="${ZH_DND_ARMOR_PATH}">DND 护甲指南</a>。</p>

<h3>4. 写下一套默认回合</h3>
<p>一个实用模板是：移动到最可能受压的队友旁边，攻击阻挡该位置的敌人，等命中与场面信息明确后再决定 Bonus Action。这套回合没有爆发连招那么醒目，却能贯穿整段冒险日。</p>

<h3>5. 带着一个誓言问题进入 3 级</h3>
<p>“哪个誓言伤害最高？”问得太窄。真正需要回答的是：哪项承诺会在这场战役里逼你做选择？一项从不要求角色付出代价的承诺，往往在角色介绍后就消失了。</p>

<h2>花法术位前先执行回合判断</h2>
<p>按下面四个问题检查，回合就不会自动滑向“攻击，然后 Smite”。</p>
<ol>
  <li><strong>队友马上要倒下或失去一个回合吗？</strong>使用能改变结果的救援手段。2024 Lay on Hands 消耗 Bonus Action，因此经常可以治疗后继续攻击。</li>
  <li><strong>站位带来的保护是否比伤害更值钱？</strong>守住能把队友留在支援范围内、或把敌人挡在后排之外的位置。</li>
  <li><strong>这次合格命中的目标值得施放吗？</strong>2024 Divine Smite 是近战武器或徒手打击命中后立刻使用的 Bonus Action 法术。Paladin's Smite 每次 Long Rest 提供一次不消耗法术位的施放；之后的施放需要法术位。</li>
  <li><strong>没有紧急情况？</strong>执行默认攻击与站位。留下资源本身就是有效结果。</li>
</ol>

<p>假设 Rogue 已经昏迷，Boss 残血，而你的近战武器攻击刚刚命中。Lay on Hands 和 Divine Smite 都很诱人，但只有前者能让 Rogue 拿回下一个回合。此刻的队伍需求会替你决定 Bonus Action。</p>

<p>要研究具体准备法术，请打开独立的<a href="${ZH_PALADIN_2024_SPELLS_DND_PATH}">Paladin 2024 法术指南</a>。本文只处理职业职责、誓言与可重复的回合决定。</p>

<h2>按你能守住的承诺选择誓言</h2>
<p>2024 Player's Handbook 提供四个核心 Paladin 誓言。它们共享同一职业底盘，因此更适合按你想反复面对的决定来选，而不是追逐通用强度排名。</p>

<div class="article-table-wrap"><table>
  <thead><tr><th>誓言</th><th>桌上职责</th><th>能表现出来的承诺</th><th>考验它的压力</th></tr></thead>
  <tbody>
    <tr><td>Devotion</td><td>可靠保护者与稳定前线</td><td>诚实、保护弱者、遵守诺言</td><td>队友想用欺骗手段取得好结果</td></tr>
    <tr><td>Glory</td><td>机动的士气推动者</td><td>采取勇敢行动，帮助同伴超越极限</td><td>更安全的计划要求放弃公开挑战</td></tr>
    <tr><td>Ancients</td><td>兼具控场与自然风格能力的耐久保护者</td><td>在绝望中保存生命、希望与美</td><td>摧毁腐化之物比拯救它更容易</td></tr>
    <tr><td>Vengeance</td><td>追猎高优先级目标</td><td>追击更大的邪恶，阻止更多伤害</td><td>小恶徒是找到真正威胁的唯一线索</td></tr>
  </tbody>
</table></div>

<p>把候选誓言放进三个问题里：</p>
<ol>
  <li>它会让你在普通一场游戏中做出什么不同选择？</li>
  <li>哪位队友最可能反对它的手段？</li>
  <li>如果角色没守住承诺，这张桌子上的弥补过程是什么？</li>
</ol>

<p>第一个问题答不具体，誓言就仍是装饰；第二个问题没人选，它可能永远不会产生角色互动；第三个问题如果只有“DM 收走职业能力”，那就应在开团前商定公平的失败与修复流程。</p>

<p><a href="${DND_PALADIN_OATHS_GUIDE_URL}" rel="noreferrer noopener">Roll20 誓言概览</a>适合比较风格与扮演方向。真正填写角色卡时，仍以 Player's Handbook 或 DM 批准的规则来源为准。</p>

<h2>记住会改变职责的关键等级</h2>
<div class="article-table-wrap"><table>
  <thead><tr><th>等级</th><th>2024 关键能力</th><th>桌上变化</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Lay on Hands、Spellcasting、Weapon Mastery</td><td>从起步就是混合职业，不必等到后面才有魔法</td></tr>
    <tr><td>2</td><td>Fighting Style、Paladin's Smite</td><td>武器计划成形，Divine Smite 进入 Bonus Action 预算</td></tr>
    <tr><td>3</td><td>Channel Divinity 与 Paladin 子职业</td><td>誓言开始影响机制</td></tr>
    <tr><td>5</td><td>Extra Attack、Faithful Steed</td><td>一次行动攻击两次，并获得可靠坐骑选项</td></tr>
    <tr><td>6</td><td>Aura of Protection</td><td>Charisma 与位置会直接保护附近的豁免</td></tr>
    <tr><td>9</td><td>Abjure Foes</td><td>Channel Divinity 获得多目标控制选项</td></tr>
  </tbody>
</table></div>

<p>6 级之后，读地图的方式会发生变化。站在错误队友十尺之外，可能比伤害计算少一点数字更致命。多名队友面对危险豁免时，直接在地图上标出光环范围。</p>

<h2>分清 2014 与 2024 Paladin 规则</h2>
<p>官方<a href="${DND_PALADIN_2024_CHANGES_URL}" rel="noreferrer noopener">2024 与 2014 Paladin 变化总结</a>记录了主要差异。改造旧构筑时，把这张表放在旁边。</p>

<div class="article-table-wrap"><table>
  <thead><tr><th>问题</th><th>2014 Paladin</th><th>2024 Paladin</th></tr></thead>
  <tbody>
    <tr><td>几级开始施法？</td><td>2 级</td><td>1 级</td></tr>
    <tr><td>Lay on Hands 消耗什么？</td><td>Action</td><td>Bonus Action</td></tr>
    <tr><td>是否有 Weapon Mastery？</td><td>没有</td><td>有，1 级开始</td></tr>
    <tr><td>Divine Smite 怎样使用？</td><td>近战武器命中后触发的职业特性</td><td>近战武器或徒手打击命中后立刻以 Bonus Action 施放的常备法术；Paladin's Smite 每次 Long Rest 提供一次不消耗法术位的施放</td></tr>
    <tr><td>5 级除了 Extra Attack 还有什么？</td><td>没有专门的 Faithful Steed 职业特性</td><td>Find Steed 始终准备，每次 Long Rest 可免费施放一次</td></tr>
  </tbody>
</table></div>

<p>不要把 2014 命中后 Smite 流程与 2024 法术混合，也不要给 2024 角色套用 2014 Lay on Hands 的 Action 成本。来源没有标版本时，先确认出版时间和获准使用的书。</p>

<p>需要核对当前等级表与能力原文时，以完整的<a href="${PALADIN_2024_CLASS_RULES_URL}" rel="noreferrer noopener">2024 Paladin 职业条目</a>为最终依据。</p>

<h2>让誓言在 VTT 地图上清楚可见</h2>
<p>Paladin Token 应先传达誓言，再展示装备细节。每个方向只选一个强提示：</p>
<ul>
  <li><strong>Devotion：</strong>干净的太阳、盾牌或张开的手掌符号。</li>
  <li><strong>Glory：</strong>月桂、明亮披肩或向前发力的姿态。</li>
  <li><strong>Ancients：</strong>活枝、黎明光线或绿金色边缘。</li>
  <li><strong>Vengeance：</strong>窄小的目标标记、断链或更深的圣光对比。</li>
</ul>

<p>打开 <a href="${ZH_EDITOR_PATH}">Token Maker 编辑器</a>，围绕脸部、盾牌和誓言提示裁切，再按一英寸 Token 尺寸检查。专注、Aura of Protection 与骑乘状态应使用独立地图标记；三种信息都塞进头像，只会制造难以辨认的噪点。</p>

<p>Faithful Steed 在战役里很重要时，为坐骑单独制作 Token。Paladin 与坐骑需要不同占地和独立位置，即使两者使用相同边框。</p>

<h2>用正确语境观看旧版 Paladin 视频</h2>
<p>JoCat 的<a href="${DND_PALADIN_VIDEO_URL}" rel="noreferrer noopener">Paladin 视频</a>是 2014 规则时期的快速喜剧概览。它很准确地抓住了职业印象和乐趣，却不能用来判断 2024 的行动成本。把它当作气氛补充，角色卡仍按上面的当前规则表填写。</p>

${liteVideoEmbed(PALADIN_VIDEO_ID, 'A Crap Guide to D&D [5th Edition] - Paladin', {
  src: DND_PALADIN_VIDEO_PLACEHOLDER_PATH,
  alt: '一名身穿磨损板甲的 Paladin 在昏暗石厅里手持旧盾',
})}

<h2>DND Paladin 圣武士常见问题</h2>

<h3>DND Paladin 圣武士必须信仰神明吗？</h3>
<p>第五版 Paladin 的力量核心是誓言。角色可以信仰神明、服务教会，也可以不依附特定神祇来解释誓言。开团前与 DM 商定战役世界里的神圣力量和誓言怎样运作。</p>

<h3>Paladin 最适合优先提高哪些属性？</h3>
<p>Strength 与 Charisma 是当前职业列出的主要属性，前线角色通常再优先考虑 Constitution。Dexterity 构筑需要获准使用的武器、护甲与多职业计划，不能直接照搬标准重甲配置。</p>

<h3>哪个 Paladin 誓言最好？</h3>
<p>没有适合所有队伍的最佳誓言。Devotion 是清楚的保护者，Glory 奖励机动的英雄式行动，Ancients 增加耐久与控制，Vengeance 集中压迫高优先级目标。选择会在本场战役中真正影响职责与承诺的誓言。</p>

<h3>2024 Paladin 多久能使用一次 Divine Smite？</h3>
<p>Divine Smite 是近战武器或徒手打击命中后立刻使用的常备 Bonus Action 法术。Paladin's Smite 每次 Long Rest 提供一次不消耗法术位的施放；之后的施放需要可用法术位，并遵守 2024 施法规则。</p>

<h3>Paladin 适合新手吗？</h3>
<p>先准备一套默认攻击与站位回合，再把治疗、Smite 和誓言能力当成明确分支时，Paladin 很适合新手。如果每一轮都从完整法术表开始搜索，操作难度会迅速上升。</p>
`;
