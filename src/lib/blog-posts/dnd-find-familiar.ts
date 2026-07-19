import {
  DND_2024_CASTING_SPELLS_RULES_URL,
  DND_FIND_FAMILIAR_2014_ROLL20_URL,
  DND_FIND_FAMILIAR_2014_RULES_URL,
  DND_FIND_FAMILIAR_2024_ROLL20_URL,
  DND_FIND_FAMILIAR_2024_RULES_URL,
  DND_FIND_FAMILIAR_TOKEN_IMAGE_PATH,
  DND_FIND_FAMILIAR_VIDEO_PLACEHOLDER_PATH,
  EN_DICE_ROLLER_PATH,
  EN_DND_CLASSES_PATH,
  EN_DND_COUNTERSPELL_PATH,
  EN_DND_MAGE_ARMOR_PATH,
  EN_EDITOR_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_DND_COUNTERSPELL_PATH,
  ZH_DND_MAGE_ARMOR_PATH,
  ZH_EDITOR_PATH,
  liteVideoEmbed,
} from './shared';

const DND_FIND_FAMILIAR_VIDEO_ID = 'EOgSooXEBK0';

export const dndFindFamiliarArticleHtml = String.raw`
<p>The <strong>dnd find familiar</strong> spell gives you a spirit in a familiar form. It scouts, uses normal actions, delivers touch spells, and creates a second tabletop piece that everyone needs to understand.</p>

<p>It does not give you a second attacker. <strong>A familiar cannot attack unless a separate feature says otherwise.</strong> The spell is strongest when you treat it as information, positioning, Help, and VTT clarity.</p>

<p>If you play online, make the familiar visible. Give the caster one token, the familiar a separate token, and use a small marker for scouting, Help, or delivering touch. The <a href="${EN_EDITOR_PATH}">Token Maker editor</a> is a clean way to make that small familiar token without opening a full art tool.</p>

<h2 id="quick-answer">Quick answer: what does Find Familiar do?</h2>
<p><strong>Find Familiar is a 1st-level Conjuration ritual spell that summons a familiar spirit in an animal-style form.</strong> The current 2024 spell has a 1-hour casting time, the Ritual tag, 10-foot range, verbal, somatic, and material components, and an instantaneous duration. The material component is burning incense worth 10+ GP, consumed by the spell. Ritual casting adds 10 minutes to the casting time.</p>

<p>The familiar acts independently, obeys your commands, rolls its own initiative, and cannot attack. It can still take other normal actions. That is why the spell matters in play: the familiar can scout, Search, Help, Dodge, Dash, Disengage, Hide, carry simple information, and deliver touch spells while it stays within the spell limits.</p>

<h2 id="rules-table">Find Familiar rules table</h2>
<table>
  <thead>
    <tr>
      <th>Rule</th>
      <th>Fast answer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Spell level</strong></td>
      <td>1st-level Conjuration.</td>
    </tr>
    <tr>
      <td><strong>Casting time / range</strong></td>
      <td>1 hour, or 1 hour 10 minutes as a ritual / 10 feet when the familiar appears.</td>
    </tr>
    <tr>
      <td><strong>Components</strong></td>
      <td>Verbal, Somatic, Material: burning incense worth 10+ GP in 2024.</td>
    </tr>
    <tr>
      <td><strong>Duration / concentration</strong></td>
      <td>Instantaneous. It is not concentration after the familiar appears, but long casting requires concentration during the casting.</td>
    </tr>
    <tr>
      <td><strong>Main class</strong></td>
      <td>Wizard in the normal spell list.</td>
    </tr>
    <tr>
      <td><strong>Familiar type</strong></td>
      <td>Celestial, Fey, or Fiend spirit using the chosen form&rsquo;s statistics.</td>
    </tr>
    <tr>
      <td><strong>Telepathy</strong></td>
      <td>Works while the familiar is within 100 feet.</td>
    </tr>
    <tr>
      <td><strong>Sight sharing</strong></td>
      <td>2024 uses a Bonus Action; 2014 uses an Action and includes the old blind/deaf own-senses line.</td>
    </tr>
    <tr>
      <td><strong>Combat</strong></td>
      <td>The familiar rolls its own initiative and cannot attack.</td>
    </tr>
    <tr>
      <td><strong>Touch spells</strong></td>
      <td>The familiar can deliver the touch within 100 feet using its Reaction.</td>
    </tr>
  </tbody>
</table>

<p>The current <a href="${DND_FIND_FAMILIAR_2024_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond Find Familiar entry</a> and the <a href="${DND_FIND_FAMILIAR_2024_ROLL20_URL}" rel="noreferrer noopener">Roll20 2024 compendium page</a> agree on the 2024 shape: 1-hour casting time, Ritual tag, 10-foot range, 100-foot telepathy, Bonus Action sight sharing, Reaction touch delivery, independent initiative, no attacking, and one familiar at a time. The <a href="${DND_2024_CASTING_SPELLS_RULES_URL}" rel="noreferrer noopener">2024 long-casting rule</a> means you also need concentration during the casting, even though the familiar does not require concentration after it appears.</p>

<h2 id="rules-differences">2014 vs 2024 Find Familiar differences</h2>
<p>The spell still plays like Find Familiar, but a few text changes matter. 2024 text uses a shorter named list plus another Beast that has Challenge Rating 0. That is the difference most players notice after the action-economy change for sight sharing.</p>

<table>
  <thead>
    <tr>
      <th>Question</th>
      <th>2014-style text</th>
      <th>2024 text</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Eligible forms</strong></td>
      <td>Fixed list with several legacy options.</td>
      <td>Shorter named list plus another CR 0 Beast.</td>
    </tr>
    <tr>
      <td><strong>Sight sharing action cost</strong></td>
      <td>Action.</td>
      <td>Bonus Action.</td>
    </tr>
    <tr>
      <td><strong>Own senses while sight sharing</strong></td>
      <td>Says you are deaf and blind to your own senses during the effect.</td>
      <td>The current public text does not include that old sentence.</td>
    </tr>
    <tr>
      <td><strong>Touch spell delivery</strong></td>
      <td>Says the familiar delivers the spell as if it had cast it and uses your attack modifier if needed.</td>
      <td>Says the familiar delivers the touch and spends its Reaction.</td>
    </tr>
    <tr>
      <td><strong>Dismissal</strong></td>
      <td>Action to dismiss or reappear.</td>
      <td>Magic action to dismiss or reappear.</td>
    </tr>
    <tr>
      <td><strong>Material component</strong></td>
      <td>10 gp of charcoal, incense, and herbs burned in a brazier.</td>
      <td>Burning incense worth 10+ GP.</td>
    </tr>
  </tbody>
</table>

<p>Pick the rules version before the session starts. If the table uses 2024 rules, use the 2024 action economy and eligible-form language. If the table uses legacy books, use the older sight-sharing and touch-spell wording from the <a href="${DND_FIND_FAMILIAR_2014_RULES_URL}" rel="noreferrer noopener">legacy D&amp;D Beyond entry</a> or the <a href="${DND_FIND_FAMILIAR_2014_ROLL20_URL}" rel="noreferrer noopener">Roll20 2014 entry</a>.</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_FIND_FAMILIAR_TOKEN_IMAGE_PATH}"
    alt="VTT setup for Find Familiar showing separate caster and familiar tokens with scouting, Help, and touch spell markers"
    width="1400"
    height="933"
    loading="lazy"
    decoding="async"
  />
  <figcaption>A separate familiar token keeps scouting, Help, and touch-spell delivery visible instead of hiding those choices in table chatter.</figcaption>
</figure>

<h2 id="best-forms">Best familiar forms by job</h2>
<p>No one familiar form wins every scene. Pick the form for the job.</p>

<table>
  <thead>
    <tr>
      <th>Job</th>
      <th>Good picks</th>
      <th>Why they work</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>General scouting</strong></td>
      <td>Owl, bat, raven, spider</td>
      <td>Movement, special senses, or stealth-friendly size.</td>
    </tr>
    <tr>
      <td><strong>Combat Help</strong></td>
      <td>Owl, hawk, fast flying forms</td>
      <td>They can reach a target, Help, then reposition if the form supports it.</td>
    </tr>
    <tr>
      <td><strong>Tight spaces</strong></td>
      <td>Spider, rat, lizard</td>
      <td>Small profiles and climb movement help in vents, rafters, and cracks.</td>
    </tr>
    <tr>
      <td><strong>Social scenes</strong></td>
      <td>Cat, raven, rat</td>
      <td>They can look ordinary in many settlements.</td>
    </tr>
    <tr>
      <td><strong>Water scenes</strong></td>
      <td>Octopus or another aquatic CR 0 choice allowed by the table</td>
      <td>Swim movement and underwater scouting matter when the scene supports it.</td>
    </tr>
  </tbody>
</table>

<p>The owl is popular for a reason, but do not let that erase the rest of the spell. A spider on a ceiling can solve a different problem than a flying scout. A cat in a city scene can be less suspicious than a circling bird. A raven can carry a visual cue or draw attention without looking like a battlefield drone.</p>

<h2 id="combat-actions">What can a familiar do in combat?</h2>
<p>A familiar cannot attack. That line stops many bad arguments before they start.</p>

<ul>
  <li><strong>Help:</strong> set up an ally&rsquo;s task or a combat advantage moment when the table allows it.</li>
  <li><strong>Search:</strong> look for a hidden creature, trap clue, or invisible threat when the familiar has a way to notice it.</li>
  <li><strong>Dodge:</strong> stay alive when the familiar is exposed.</li>
  <li><strong>Disengage or Dash:</strong> solve route problems instead of forcing a risky path.</li>
  <li><strong>Hide:</strong> use cover, darkness, or the familiar&rsquo;s size when the environment supports it.</li>
  <li><strong>Deliver touch:</strong> be within 100 feet and take its Reaction when you cast a touch spell.</li>
</ul>

<p>Use the familiar like a fragile scout, not a disposable button. If it flies into every threat&rsquo;s face every round, a reasonable DM will treat it as part of the fight. If it scouts, signals, and chooses risky Help moments carefully, it feels like clever play instead of a tax on the DM&rsquo;s patience.</p>

<h2 id="sight-and-touch">How sight sharing and touch spells work</h2>
<p>Sight sharing is best for short, specific questions: what is around the corner, which door has light under it, whether the ceiling has movement, or which guard is holding a key. <strong>In 2024, the sight-sharing text uses a Bonus Action and lasts until the start of your next turn.</strong> <strong>In 2014, it uses an Action and includes the old own-senses penalty.</strong></p>

<p>Touch delivery is different. <strong>When you cast a touch spell while the familiar is within 100 feet, the familiar can take its Reaction to deliver the touch.</strong> That can keep a Wizard behind cover while the familiar reaches an ally or target. It also means the route matters. If the familiar cannot reach safely, the combo is not free.</p>

<p>If the touch spell needs a roll at your table, use the spell version your group chose before play. For other reaction-heavy decisions, the <a href="${EN_DND_COUNTERSPELL_PATH}">Counterspell guide</a> teaches the same habit: say when a reaction is being held and when it is spent.</p>

<h2 id="vtt-token-setup">VTT setup for familiar tokens</h2>
<p>Online play makes Find Familiar easier to track if the familiar has its own token.</p>

<ol>
  <li>Create the caster token as normal.</li>
  <li>Create a smaller familiar token with a different border or name tag.</li>
  <li>Add a scouting marker for scenes where the player is viewing through the familiar.</li>
  <li>Add a Help marker or small target ring for the enemy being distracted.</li>
  <li>Add a touch-delivery marker when the familiar is positioned to spend its Reaction if you cast a touch spell.</li>
  <li>Keep the familiar token on the map only when it matters. Put it away when it is dismissed.</li>
</ol>

<p>For Token Maker, the practical job is simple. Upload the familiar art, crop it close, give it a readable border, and export a transparent PNG for Roll20, Foundry, or Owlbear. If you want the familiar and caster to read as a pair, use the same border color with different label text.</p>

<p>For broader character planning, pair this with the <a href="${EN_DND_CLASSES_PATH}">DND classes guide</a>. For fragile scouts and unarmored allies, the <a href="${EN_DND_MAGE_ARMOR_PATH}">Mage Armor guide</a> explains why touch range matters. If you want to test Help-enabled attacks at the table, use the <a href="${EN_DICE_ROLLER_PATH}">DnD dice roller</a>.</p>

<h2 id="video-guide">Video: Find Familiar table habits</h2>
<p>Use the video after the rules table if you want a spoken walkthrough. Keep the 2014/2024 differences and VTT setup checklist nearby while you listen.</p>

${liteVideoEmbed(DND_FIND_FAMILIAR_VIDEO_ID, 'Find Familiar DnD guide video', {
  src: DND_FIND_FAMILIAR_VIDEO_PLACEHOLDER_PATH,
  alt: 'video thumbnail for a Find Familiar DnD guide with a familiar token and spellbook on a tabletop map',
})}

<h2 id="common-mistakes">Common mistakes</h2>
<ul>
  <li><strong>Using Find Familiar as an extra attack.</strong> The normal familiar cannot attack.</li>
  <li><strong>Using sight sharing for every ten feet of dungeon.</strong> Ask a concrete question, scout one meaningful area, then return to group play.</li>
  <li><strong>Forgetting the familiar is fragile.</strong> One point of area damage can erase many familiar forms.</li>
  <li><strong>Making one token do two jobs.</strong> The caster and familiar need separate tokens when both are active.</li>
  <li><strong>Mixing 2014 and 2024 text mid-session.</strong> Pick the version before play.</li>
</ul>

<h2 id="faq">Find Familiar FAQ</h2>
<h3 id="is-find-familiar-a-wizard-spell">Is Find Familiar a Wizard spell?</h3>
<p>Yes. Find Familiar is normally a Wizard spell. Other characters can get it through specific features, feats, subclasses, magic items, or table options.</p>

<h3 id="can-a-familiar-attack">Can a familiar attack in DnD?</h3>
<p>No. A normal familiar from Find Familiar cannot attack, but it can take other actions as normal. Separate class features can change this for some characters.</p>

<h3 id="can-a-familiar-use-help">Can a familiar use the Help action?</h3>
<p>Yes, a familiar can take actions other than Attack, and Help is one of the normal actions. The table still needs a believable target, position, and timing.</p>

<h3 id="how-far-can-a-familiar-be">How far can a familiar be from you?</h3>
<p>The important range is 100 feet for telepathy, sight sharing, and touch-spell delivery. A familiar can physically move farther, but you lose those linked benefits outside that range.</p>

<h3 id="does-find-familiar-need-concentration">Does Find Familiar require concentration?</h3>
<p>No after the familiar appears. Find Familiar has an instantaneous duration, but the 2024 long-casting rule still requires concentration during the casting.</p>

<h3 id="familiar-zero-hp">What happens when a familiar drops to 0 HP?</h3>
<p>It disappears and leaves behind what it was wearing or carrying. To get it back after that, cast Find Familiar again.</p>

<h3 id="multiple-familiars">Can you have more than one familiar?</h3>
<p>No. Find Familiar allows one familiar at a time. Recasting the spell while you already have one changes or replaces the existing familiar according to the spell text.</p>

<h3 id="best-familiar-form">What is the best familiar form?</h3>
<p>For many tables, a flying scout such as an owl is the easiest all-purpose pick. The best form changes when the scene needs climbing, underwater movement, social stealth, or a specific sense.</p>

<h3 id="vtt-token">Should my familiar have its own VTT token?</h3>
<p>Yes, if it is active on the map. A separate token prevents arguments about range, Help position, touch delivery, and whether enemies can see or target it.</p>
`;

export const dndFindFamiliarArticleHtmlZh = String.raw`
<p><strong>dnd find familiar</strong> 的桌边判断要覆盖这些事：找寻魔宠（Find Familiar）到底能做什么、2014 和 2024 规则哪里不同、魔宠能不能攻击、协助（Help）动作怎么处理，以及线上跑团时魔宠 Token 应该怎么放。</p>

<p>找寻魔宠不是第二个攻击单位。普通魔宠不能攻击，除非另有职业特性或规则明确改变这一点。它真正强的地方是侦察、协助、传递接触法术，以及让桌面信息更清楚。</p>

<p>如果你在 Roll20、Foundry 或 Owlbear 跑团，最好给魔宠单独做一个 Token。施法者是一个 Token，魔宠是另一个 Token，再用小标记表示"侦察中"、"协助（Help）"或"接触传递准备中"。你可以用 <a href="${ZH_EDITOR_PATH}">Token Maker 编辑器</a>给魔宠做一个小尺寸、边框清楚的透明 PNG。</p>

<h2 id="quick-answer">快速答案：找寻魔宠（Find Familiar）做什么？</h2>
<p><strong>找寻魔宠（Find Familiar）是 1 环咒法（Conjuration）仪式法术，会召唤一个以动物形态出现的魔宠灵体。</strong> 2024 文本中，它的施放时间是 1 小时，并带有仪式（Ritual）标签；距离是 10 英尺，需要语言、姿势和材料成分，持续时间是瞬时。材料成分是价值 10+ GP 的燃烧熏香，并且会被消耗。若按仪式施放，施法时间再增加 10 分钟。</p>

<p>魔宠独立行动，但服从你的命令；它在战斗中有自己的先攻，不能攻击，但可以执行其他普通动作。这就是它的价值：侦察、搜索（Search）、协助（Help）、闪避（Dodge）、疾走（Dash）、撤离（Disengage）、躲藏（Hide）、传递简单信息，以及在限制范围内传递接触法术。</p>

<h2 id="rules-table">找寻魔宠规则速查表</h2>
<table>
  <thead>
    <tr>
      <th>规则点</th>
      <th>快速答案</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>法术环级</strong></td>
      <td>1 环咒法（Conjuration）。</td>
    </tr>
    <tr>
      <td><strong>施放时间 / 距离</strong></td>
      <td>1 小时；按仪式施放为 1 小时 10 分钟 / 魔宠出现时在 10 英尺内。</td>
    </tr>
    <tr>
      <td><strong>成分</strong></td>
      <td>语言、姿势、材料；2024 为价值 10+ GP 的燃烧熏香。</td>
    </tr>
    <tr>
      <td><strong>持续时间 / 专注</strong></td>
      <td>瞬时。魔宠出现后不需要专注，但长时间施法期间需要保持专注。</td>
    </tr>
    <tr>
      <td><strong>主要职业</strong></td>
      <td>法师（Wizard）。</td>
    </tr>
    <tr>
      <td><strong>魔宠类型</strong></td>
      <td>天界（Celestial）、妖精（Fey）或邪魔（Fiend）灵体，使用所选形态的数据。</td>
    </tr>
    <tr>
      <td><strong>心灵感应</strong></td>
      <td>魔宠在 100 英尺内时可用。</td>
    </tr>
    <tr>
      <td><strong>借用感官</strong></td>
      <td>2024 使用附赠动作（Bonus Action）；2014 使用动作（Action），并包含旧版自身感官限制。</td>
    </tr>
    <tr>
      <td><strong>战斗</strong></td>
      <td>魔宠有自己的先攻，不能攻击。</td>
    </tr>
    <tr>
      <td><strong>接触法术</strong></td>
      <td>魔宠在 100 英尺内可用反应（Reaction）传递接触。</td>
    </tr>
  </tbody>
</table>

<p>当前 <a href="${DND_FIND_FAMILIAR_2024_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond Find Familiar</a> 和 <a href="${DND_FIND_FAMILIAR_2024_ROLL20_URL}" rel="noreferrer noopener">Roll20 2024 compendium</a> 的规则形状一致：1 小时施放时间、仪式（Ritual）标签、10 英尺出现距离、100 英尺心灵感应、附赠动作借用感官、反应传递接触、独立先攻、不能攻击、同一时间只能有一个魔宠。<a href="${DND_2024_CASTING_SPELLS_RULES_URL}" rel="noreferrer noopener">2024 长时间施法规则</a>还意味着施法期间要保持专注，但魔宠出现后不需要专注维持。</p>

<h2 id="rules-differences">2014 与 2024 找寻魔宠差异</h2>
<p>这个法术没有变成另一个系统，但几处文本差异会影响桌边裁定。2024 文本使用较短的具名列表，再加上另一个 CR 0 Beast。借用感官的动作成本变化更明显。</p>

<table>
  <thead>
    <tr>
      <th>问题</th>
      <th>2014 文本</th>
      <th>2024 文本</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>可选形态</strong></td>
      <td>固定列表，包含若干 legacy 选项。</td>
      <td>较短的具名列表，加上另一个 CR 0 Beast。</td>
    </tr>
    <tr>
      <td><strong>借用感官动作成本</strong></td>
      <td>动作（Action）。</td>
      <td>附赠动作（Bonus Action）。</td>
    </tr>
    <tr>
      <td><strong>借用感官时自身感官</strong></td>
      <td>写明你对自身感官失明并失聪。</td>
      <td>当前公开文本没有这句旧限制。</td>
    </tr>
    <tr>
      <td><strong>接触法术传递</strong></td>
      <td>写着魔宠像自己施放一样传递，若需要攻击检定则用你的攻击修正。</td>
      <td>写着魔宠传递接触，并消耗反应。</td>
    </tr>
    <tr>
      <td><strong>暂时遣散</strong></td>
      <td>用动作遣散或重新出现。</td>
      <td>用魔法动作（Magic action）遣散或重新出现。</td>
    </tr>
    <tr>
      <td><strong>材料成分</strong></td>
      <td>价值 10 GP 的木炭、熏香和草药，在铜盆中燃烧。</td>
      <td>价值 10+ GP 的燃烧熏香。</td>
    </tr>
  </tbody>
</table>

<p>最稳的桌边做法是先确定版本。用 2024 就按 2024 的动作经济和形态规则；用 legacy/2014 就按 <a href="${DND_FIND_FAMILIAR_2014_RULES_URL}" rel="noreferrer noopener">legacy D&amp;D Beyond 条目</a>或 <a href="${DND_FIND_FAMILIAR_2014_ROLL20_URL}" rel="noreferrer noopener">Roll20 2014 条目</a>处理。</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_FIND_FAMILIAR_TOKEN_IMAGE_PATH}"
    alt="找寻魔宠（Find Familiar）的 VTT 设置示意图，施法者和魔宠分别使用独立 Token，并有侦察、协助（Help）和接触法术标记"
    width="1400"
    height="933"
    loading="lazy"
    decoding="async"
  />
  <figcaption>魔宠用独立 Token 后，侦察、协助（Help）和接触法术传递就不会只停留在口头描述里。</figcaption>
</figure>

<h2 id="best-forms">按用途选择魔宠形态</h2>
<p>不要只问"哪个魔宠最好"。先问这次场景要它做什么。</p>

<table>
  <thead>
    <tr>
      <th>任务</th>
      <th>常见选择</th>
      <th>原因</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>通用侦察</strong></td>
      <td>猫头鹰（owl）、蝙蝠（bat）、渡鸦（raven）、蜘蛛（spider）</td>
      <td>移动方式、特殊感官或体型更适合侦察。</td>
    </tr>
    <tr>
      <td><strong>战斗协助（Help）</strong></td>
      <td>猫头鹰（owl）、鹰（hawk）、快速飞行形态</td>
      <td>更容易接近目标、执行协助（Help），再离开危险位置。</td>
    </tr>
    <tr>
      <td><strong>狭窄空间</strong></td>
      <td>蜘蛛（spider）、老鼠（rat）、蜥蜴（lizard）</td>
      <td>小体型和攀爬移动适合通风口、梁柱和缝隙。</td>
    </tr>
    <tr>
      <td><strong>城镇社交</strong></td>
      <td>猫（cat）、渡鸦（raven）、老鼠（rat）</td>
      <td>在很多定居点里不太突兀。</td>
    </tr>
    <tr>
      <td><strong>水下场景</strong></td>
      <td>章鱼（octopus）或 DM 允许的水生 CR 0 形态</td>
      <td>有游泳能力，场景合适时价值很高。</td>
    </tr>
  </tbody>
</table>

<p>猫头鹰常见是有原因的，但它不是唯一答案。天花板上的蜘蛛能解决另一类问题；城市里的猫可能比空中盘旋的鸟更不显眼；渡鸦可以携带明显信号，也可以在剧情场景里转移注意。</p>

<h2 id="combat-actions">魔宠在战斗中能做什么？</h2>
<p>普通魔宠不能攻击。这句话能避免很多争论。</p>

<ul>
  <li><strong>协助（Help）：</strong>协助盟友完成任务，或在桌面允许时协助制造一次攻击优势。</li>
  <li><strong>Search：</strong>寻找隐藏生物、陷阱线索或隐形威胁。</li>
  <li><strong>Dodge：</strong>暴露在危险位置时保命。</li>
  <li><strong>Disengage / Dash：</strong>处理路线问题，而不是硬吃危险移动。</li>
  <li><strong>Hide：</strong>环境有掩护、黑暗或体型优势时使用。</li>
  <li><strong>传递接触：</strong>在你施放接触法术时，魔宠位于 100 英尺内并用反应（Reaction）传递接触。</li>
</ul>

<p>把魔宠当成脆弱侦察单位，而不是一次性按钮。如果它每轮都冲到敌人脸上，DM 合理地会把它当成战斗目标。如果它只在真正需要时侦察、传讯、协助（Help），桌面体验会好很多。</p>

<h2 id="sight-and-touch">借用感官和传递接触法术</h2>
<p>借用感官适合回答具体问题：拐角后面有没有守卫，哪扇门下方有光，天花板上有没有动静，钥匙在谁身上。<strong>2024 文本里，借用感官使用附赠动作（Bonus Action），持续到你下回合开始。</strong> <strong>2014 文本里，它使用动作（Action），并包含旧版自身感官限制。</strong></p>

<p>接触法术传递是另一回事。<strong>当你施放接触法术且魔宠在 100 英尺内时，魔宠可以用反应（Reaction）传递接触。</strong> 它可以让法师（Wizard）留在掩体后面，也可以让治疗或风险较高的接触法术更容易送到位置上。路线仍然重要。魔宠到不了，组合就不成立。</p>

<p>如果你想顺手复查其他反应和施法时机，可以看 <a href="${ZH_DND_COUNTERSPELL_PATH}">反制法术（Counterspell）指南</a>。如果你在保护脆弱侦察单位，<a href="${ZH_DND_MAGE_ARMOR_PATH}">法师护甲（Mage Armor）指南</a>也能说明为什么接触距离值得认真处理。</p>

<h2 id="vtt-token-setup">VTT 魔宠 Token 设置</h2>
<p>线上跑团时，找寻魔宠最好用独立 Token 管理。</p>

<ol>
  <li>先做施法者 Token。</li>
  <li>再做一个更小的魔宠 Token，用不同边框或名字标签。</li>
  <li>准备"侦察中"标记，表示玩家正在借用魔宠感官。</li>
  <li>准备"协助（Help）"标记或目标环，表示被干扰的敌人。</li>
  <li>准备"传递接触"标记，表示魔宠已经就位，若你施放接触法术即可用反应传递。</li>
  <li>魔宠被暂时遣散时，把它从地图上移走，避免误判距离和视线。</li>
</ol>

<p>这正是 Token Maker 适合插入的位置。上传魔宠图，裁出清楚轮廓，设置易读边框，导出透明 PNG，再放进 Roll20、Foundry 或 Owlbear。如果想让魔宠和施法者看起来属于同一角色，可以使用同色边框，但保留不同标签。</p>

<p>如果你还在选角色方向，可以搭配 <a href="${ZH_DND_CLASSES_PATH}">DND 职业指南</a>。如果你想公开测试协助（Help）后的攻击检定，可以用 <a href="${ZH_DICE_ROLLER_PATH}">DND 骰子工具</a>。</p>

<h2 id="video-guide">视频：找寻魔宠的桌边习惯</h2>
<p>下面的视频适合用来补一遍口头讲解。文章里的 2014/2024 差异表和 VTT Token 清单，适合开团前直接核对。</p>

${liteVideoEmbed(DND_FIND_FAMILIAR_VIDEO_ID, 'Find Familiar DnD guide video', {
  src: DND_FIND_FAMILIAR_VIDEO_PLACEHOLDER_PATH,
  alt: 'Find Familiar DnD guide 视频缩略图，桌面地图上有魔宠 Token、法术书和骰子',
})}

<h2 id="common-mistakes">常见错误</h2>
<ul>
  <li><strong>把 Find Familiar 当成额外攻击。</strong> 普通魔宠不能攻击。</li>
  <li><strong>每走十英尺都借用一次感官。</strong> 先提出具体问题，侦察一个有意义区域，然后回到团队行动。</li>
  <li><strong>忘记魔宠很脆。</strong> 很多魔宠形态只要吃到一点范围伤害就会消失。</li>
  <li><strong>施法者和魔宠共用一个 Token。</strong> 两者都在地图上活动时，必须分开。</li>
  <li><strong>在同一场游戏里混用 2014 和 2024 文本。</strong> 开局前先决定版本。</li>
</ul>

<h2 id="faq">DND 找寻魔宠（Find Familiar）常见问题</h2>
<h3 id="is-find-familiar-a-wizard-spell">找寻魔宠（Find Familiar）是法师（Wizard）法术吗？</h3>
<p>通常是。找寻魔宠（Find Familiar）在常规列表里主要属于法师（Wizard）。其他角色可能通过特性、专长、子职业、魔法物品或桌面选项取得。</p>

<h3 id="can-a-familiar-attack">魔宠能攻击吗？</h3>
<p>不能。普通找寻魔宠（Find Familiar）魔宠不能攻击，但可以执行其他普通动作。某些职业特性可能改变这一点。</p>

<h3 id="can-a-familiar-use-help">魔宠能使用协助（Help）动作吗？</h3>
<p>可以。魔宠不能攻击，但可以采取其他动作，协助（Help）属于常见动作。桌面仍然需要合理的位置、目标和时机。</p>

<h3 id="how-far-can-a-familiar-be">魔宠能离你多远？</h3>
<p>先记住 100 英尺。心灵感应、借用感官和接触法术传递都围绕这个距离。魔宠可以物理上走得更远，但超出后你会失去这些连接收益。</p>

<h3 id="does-find-familiar-need-concentration">找寻魔宠（Find Familiar）需要专注吗？</h3>
<p>魔宠出现后不需要。找寻魔宠的持续时间是瞬时，但 2024 长时间施法规则仍要求你在施法期间保持专注。</p>

<h3 id="familiar-zero-hp">魔宠降到 0 HP 会怎样？</h3>
<p>它会消失，并把穿戴或携带的东西留在原地。之后想让它回来，需要再次施放 Find Familiar。</p>

<h3 id="multiple-familiars">可以同时有多个魔宠吗？</h3>
<p>不可以。同一时间只能有一个魔宠。已有魔宠时再次施放，会按法术文本改变或替换当前魔宠。</p>

<h3 id="best-familiar-form">最好的魔宠形态是什么？</h3>
<p>很多桌面里，飞行侦察型魔宠最通用，比如猫头鹰（owl）。但如果场景需要攀爬、水下移动、城市隐蔽或特殊感官，最佳形态会变。</p>

<h3 id="vtt-token">魔宠需要自己的 VTT Token 吗？</h3>
<p>只要它在地图上活动，就应该有。独立 Token 能减少距离、协助（Help）、接触传递和敌人能否看见它的争论。</p>
`;
