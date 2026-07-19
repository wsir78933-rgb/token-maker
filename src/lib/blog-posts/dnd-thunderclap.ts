import {
  DND_EMANATION_2024_ROLL20_URL,
  DND_THUNDERCLAP_2014_RULES_URL,
  DND_THUNDERCLAP_2014_WIKIDOT_URL,
  DND_THUNDERCLAP_2024_ROLL20_URL,
  DND_THUNDERCLAP_RADIUS_IMAGE_PATH,
  DND_THUNDERCLAP_VIDEO_PLACEHOLDER_PATH,
  EN_DICE_ROLLER_PATH,
  EN_DND_BLESS_PATH,
  EN_DND_COUNTERSPELL_PATH,
  EN_DND_FIND_FAMILIAR_PATH,
  EN_EDITOR_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_BLESS_PATH,
  ZH_DND_COUNTERSPELL_PATH,
  ZH_DND_FIND_FAMILIAR_PATH,
  ZH_EDITOR_PATH,
  liteVideoEmbed,
} from './shared';

const DND_THUNDERCLAP_VIDEO_ID = '2pDcp2JS3ac';

export const dndThunderclapArticleHtml = String.raw`
<p><strong>dnd thunderclap</strong> is a close-range noise cantrip, not a hidden ranged blast. It is strongest when you are already surrounded and weakest when an ally, familiar, or stealth plan is standing next to you.</p>

<p><strong>Thunderclap is an Evocation cantrip with an Action casting time, a Somatic component, and an Instantaneous duration.</strong> <strong>In 2024, each creature in a 5-foot Emanation originating from you must succeed on a Constitution saving throw or take 1d6 Thunder damage.</strong> The blast is loud, simple, and easy to misread because one line says the sound can be heard up to 100 feet away.</p>

<p><strong>The 100-foot line is audible distance, not damage distance.</strong> Your damage area is still the small burst around you. If you use virtual tabletops, draw that short burst first, then roll saves. The <a href="${EN_EDITOR_PATH}">Token Maker editor</a> can help you add a thunder marker or ring to a caster token so the table sees what the cantrip is really doing.</p>

<h2 id="quick-answer">Quick answer: what does Thunderclap do?</h2>
<p>Thunderclap creates a loud burst of thunder from your space. Nearby creatures make Constitution saves. On a failed save, they take Thunder damage. The caster is not the target under the normal reading, but adjacent allies can be.</p>

<p><strong>Thunderclap normally does not damage the caster in 2024 unless the caster chooses to include the Emanation origin; it can still hit allies, familiars, summons, mounts, and NPCs caught in the area.</strong> That one sentence is the play pattern. If your front line is clean and two enemies have closed in, Thunderclap can be efficient. If your party is tangled together, choose a different cantrip.</p>

<h2 id="rules-table">Thunderclap rules table</h2>
<table>
  <thead>
    <tr>
      <th>Rule</th>
      <th>Table answer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Spell type</strong></td>
      <td>Evocation cantrip.</td>
    </tr>
    <tr>
      <td><strong>Casting time</strong></td>
      <td>Action.</td>
    </tr>
    <tr>
      <td><strong>Range / area</strong></td>
      <td>2024: Self, 5-foot Emanation. 2014-style text: Self, 5-foot radius / creatures within 5 feet.</td>
    </tr>
    <tr>
      <td><strong>Component</strong></td>
      <td>Somatic. You need a free enough hand to perform the gesture.</td>
    </tr>
    <tr>
      <td><strong>Duration</strong></td>
      <td>Instantaneous. It is not concentration.</td>
    </tr>
    <tr>
      <td><strong>Save</strong></td>
      <td>Constitution saving throw.</td>
    </tr>
    <tr>
      <td><strong>Damage</strong></td>
      <td>1d6 Thunder damage on a failed save.</td>
    </tr>
    <tr>
      <td><strong>Scaling</strong></td>
      <td>2d6 at level 5, 3d6 at level 11, and 4d6 at level 17.</td>
    </tr>
    <tr>
      <td><strong>Noise</strong></td>
      <td>The thunder can be heard up to 100 feet away.</td>
    </tr>
  </tbody>
</table>

<p>The public <a href="${DND_THUNDERCLAP_2024_ROLL20_URL}" rel="noreferrer noopener">Roll20 2024 Thunderclap entry</a> lists the modern shape: Evocation cantrip, Action, Self, Somatic, Instantaneous, Constitution save, 5-foot Emanation, and Thunder damage. For the area term, the <a href="${DND_EMANATION_2024_ROLL20_URL}" rel="noreferrer noopener">2024 Emanation definition</a> matters: an Emanation extends outward from an origin and normally does not include the origin unless the creator decides otherwise.</p>

<h2 id="2014-vs-2024">2014 vs 2024 Thunderclap</h2>
<p>The spell did not turn into a long-range spell in 2024. The main wording shift is how the area is named. Older text commonly reads as a 5-foot range or 5-foot radius around you, while 2024 uses a 5-foot Emanation from you.</p>

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
      <td><strong>Area language</strong></td>
      <td>Creatures other than you within 5 feet.</td>
      <td>Creatures in a 5-foot Emanation originating from you.</td>
    </tr>
    <tr>
      <td><strong>Caster included?</strong></td>
      <td>No, the older wording says other than you.</td>
      <td>No under the normal Emanation reading unless the creator chooses to include the origin.</td>
    </tr>
    <tr>
      <td><strong>Allies included?</strong></td>
      <td>Yes, if they are within the area.</td>
      <td>Yes, if they are in the 5-foot Emanation.</td>
    </tr>
    <tr>
      <td><strong>Noise</strong></td>
      <td>Heard up to 100 feet away.</td>
      <td>Heard up to 100 feet away.</td>
    </tr>
  </tbody>
</table>

<p>The legacy <a href="${DND_THUNDERCLAP_2014_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond spell page</a> and the <a href="${DND_THUNDERCLAP_2014_WIKIDOT_URL}" rel="noreferrer noopener">legacy Thunderclap reference</a> are useful when your table is still using 2014 wording. Pick one rules version for the campaign and do not switch wording in the middle of a fight.</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_THUNDERCLAP_RADIUS_IMAGE_PATH}"
    alt="VTT map showing a 5-foot Thunderclap burst around a caster token with adjacent enemies and an ally outside the safe edge"
    width="1400"
    height="933"
    loading="lazy"
    decoding="async"
  />
  <figcaption>For online play, mark the short burst before rolling saves. Thunderclap is about adjacent positioning, not a 100-foot damage zone.</figcaption>
</figure>

<h2 id="positioning">How to position Thunderclap without hurting your party</h2>
<p>Thunderclap looks best on paper when the caster is surrounded by enemies. That situation often means the caster is also in danger. Use it when you want to clear pressure around yourself, punish creatures that have closed into melee, or make a noisy break in a scene that has already become loud.</p>

<ul>
  <li><strong>Good use:</strong> two or more enemies are adjacent and no ally is in the burst.</li>
  <li><strong>Risky use:</strong> an ally, familiar, summoned creature, mount, or rescued NPC is next to you.</li>
  <li><strong>Bad use:</strong> the party is sneaking, negotiating, or trying to avoid alerting nearby rooms.</li>
  <li><strong>Clean VTT habit:</strong> place a 5-foot ring, ask who is inside it, then roll Constitution saves.</li>
</ul>

<p>If your party often creates tight clusters, pair Thunderclap with clear token placement. The <a href="${EN_DND_FIND_FAMILIAR_PATH}">Find Familiar guide</a> is especially relevant because familiars tend to stand exactly where area cantrips punish them. For defensive planning, the <a href="${EN_DND_BLESS_PATH}">Bless guide</a> and <a href="${EN_DND_COUNTERSPELL_PATH}">Counterspell guide</a> help the table make reaction and save moments visible.</p>

<h2 id="damage-scaling">Thunderclap damage scaling</h2>
<p><strong>The damage increases to 2d6 at level 5, 3d6 at level 11, and 4d6 at level 17.</strong> That is normal cantrip scaling, based on character level rather than class level. The spell does not add your spellcasting ability modifier unless a separate feature says it does.</p>

<p>Because Thunderclap asks for a Constitution save, it can feel worse against sturdy monsters than it looks in a vacuum. It is not a boss-killer. It is a small-area answer to being crowded. Use the <a href="${EN_DICE_ROLLER_PATH}">DnD dice roller</a> if you want to test how often 1d6, 2d6, 3d6, or 4d6 matters at your table.</p>

<h2 id="thunderclap-vs-sword-burst">Thunderclap vs Sword Burst</h2>
<p>Thunderclap and Sword Burst often compete for the same tactical slot: a cantrip you cast when enemies are next to you. The differences are not just flavor.</p>

<table>
  <thead>
    <tr>
      <th>Choice</th>
      <th>Pick it when...</th>
      <th>Watch out for...</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Thunderclap</strong></td>
      <td>You want Thunder damage, a Constitution save, and the table is already loud.</td>
      <td>The 100-foot noise and ally risk.</td>
    </tr>
    <tr>
      <td><strong>Sword Burst</strong></td>
      <td>You prefer a more obviously weapon-magic feel and your table's version gives the better save/damage profile for the moment.</td>
      <td>Different save targeting, spell-list access, and rules-version wording.</td>
    </tr>
  </tbody>
</table>

<p>Do not pick Thunderclap only because it sounds dramatic. Pick it because you expect adjacent enemies, you can survive being that close, and your party can read the area before dice hit the table.</p>

<h2 id="video-guide">Video: Thunderclap table habits</h2>
<p>Use the video as a quick visual check after the rules table. Keep the exact 2014/2024 wording, Emanation note, and VTT checklist nearby while you watch.</p>

${liteVideoEmbed(DND_THUNDERCLAP_VIDEO_ID, 'Thunderclap DnD guide video', {
  src: DND_THUNDERCLAP_VIDEO_PLACEHOLDER_PATH,
  alt: 'video thumbnail for a Thunderclap DnD guide showing a blue burst around a caster token on a VTT battle map',
})}

<h2 id="common-mistakes">Common Thunderclap mistakes</h2>
<ul>
  <li><strong>Treating 100 feet as the damage range.</strong> It is how far the sound carries.</li>
  <li><strong>Forgetting allies.</strong> Thunderclap can hit friendly creatures in the burst.</li>
  <li><strong>Casting it while sneaking.</strong> The spell announces itself.</li>
  <li><strong>Ignoring Constitution saves.</strong> Tough monsters often pass those saves.</li>
  <li><strong>Skipping the VTT ring.</strong> A visible 5-foot marker prevents arguments after the roll.</li>
</ul>

<h2 id="faq">Thunderclap DnD FAQ</h2>
<h3 id="is-thunderclap-good">Is Thunderclap good in DnD?</h3>
<p>Thunderclap is good when several enemies are already next to you and the table can tolerate the 100-foot noise. It is weak when allies are in the burst, when you need silence, or when you can safely use a ranged cantrip instead.</p>

<h3 id="does-thunderclap-hit-the-caster">Does Thunderclap hit the caster?</h3>
<p>Normally no. In 2024, the Emanation origin is excluded unless the caster chooses to include it. The 2014 wording also says each creature other than you.</p>

<h3 id="does-thunderclap-hit-allies">Does Thunderclap hit allies?</h3>
<p>Yes. Thunderclap can hit allies, familiars, summons, mounts, and NPCs caught in the 5-foot area, so mark the burst before rolling.</p>

<h3 id="is-thunderclap-100-feet">Is Thunderclap a 100-foot damage spell?</h3>
<p>No. The 100-foot line describes how far away the sound can be heard. The damage area is still the small burst around the caster.</p>

<h3 id="what-save-does-thunderclap-use">What saving throw does Thunderclap use?</h3>
<p>Thunderclap uses a Constitution saving throw. On a failed save, the creature takes Thunder damage; on a successful save, it takes no damage.</p>

<h3 id="how-does-thunderclap-scale">How does Thunderclap scale?</h3>
<p>Thunderclap deals 1d6 Thunder damage at first, then 2d6 at level 5, 3d6 at level 11, and 4d6 at level 17.</p>

<h3 id="does-thunderclap-need-concentration">Does Thunderclap need concentration?</h3>
<p>No. Thunderclap has an Instantaneous duration and does not require concentration.</p>

<h3 id="which-classes-get-thunderclap">Which classes get Thunderclap?</h3>
<p>The common spell lists for Thunderclap include Bard, Druid, Sorcerer, Warlock, and Wizard, with Artificer appearing in widely used 5e references. Always use the list your table's rules source provides.</p>

<h3 id="how-should-i-show-thunderclap-on-a-vtt">How should I show Thunderclap on a VTT?</h3>
<p>Use a 5-foot burst marker around the caster token, check every creature inside the marker, call out allies before the roll, then roll Constitution saves.</p>
`;

export const dndThunderclapArticleHtmlZh = String.raw`
<p><strong>dnd thunderclap</strong> 最容易踩坑的地方不是伤害骰，而是范围。雷鸣拍击（Thunderclap）不是 100 英尺伤害法术。它是贴身爆开的响亮戏法，适合你被敌人围住时使用，也很容易误伤旁边的队友。</p>

<p><strong>雷鸣拍击（Thunderclap）是塑能（Evocation）戏法，施放时间是动作（Action），只需要姿势成分（Somatic），持续时间是瞬时（Instantaneous）。</strong> <strong>2024 文本里，每个处在以你为源点的 5 英尺散发（Emanation）内的生物，都必须进行一次体质豁免（Constitution saving throw）。</strong> 豁免失败时承受 1d6 雷鸣伤害（Thunder damage）。</p>

<p><strong>100 英尺描述的是声音能被听见的距离，不是伤害范围。</strong> 真正需要标出来的是你身边那一圈 5 英尺范围。线上跑团时，建议先在 VTT 地图上画出短距离爆发范围，再让范围内的生物做豁免。你也可以用 <a href="${ZH_EDITOR_PATH}">Token Maker 编辑器</a> 给施法者 Token 做一个雷电边框或短距爆发标记。</p>

<h2 id="quick-answer">快速答案：雷鸣拍击（Thunderclap）做什么？</h2>
<p>雷鸣拍击（Thunderclap）从你的空间爆发出一声雷鸣。附近生物进行体质豁免。豁免失败时受到雷鸣伤害。施法者通常不会被自己的雷鸣拍击伤害，但站在旁边的盟友可能会被卷进去。</p>

<p><strong>2024 规则下，雷鸣拍击通常不会伤害施法者，除非施法者选择把散发（Emanation）源点包含进去；但它仍会影响区域内的盟友、魔宠、召唤物、坐骑和 NPC。</strong> 这就是实战判断的核心：如果两个敌人已经贴近你，而队友不在范围里，它可以很干净；如果大家挤成一团，最好换一个法术。</p>

<h2 id="rules-table">雷鸣拍击规则表</h2>
<table>
  <thead>
    <tr>
      <th>规则</th>
      <th>桌边答案</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>法术类型</strong></td>
      <td>塑能（Evocation）戏法。</td>
    </tr>
    <tr>
      <td><strong>施放时间</strong></td>
      <td>动作（Action）。</td>
    </tr>
    <tr>
      <td><strong>范围 / 区域</strong></td>
      <td>2024：自身，5 英尺散发（Emanation）。2014 风格文本：自身，5 英尺半径 / 5 英尺内生物。</td>
    </tr>
    <tr>
      <td><strong>成分</strong></td>
      <td>姿势成分（Somatic）。你需要能完成施法手势。</td>
    </tr>
    <tr>
      <td><strong>持续时间</strong></td>
      <td>瞬时（Instantaneous），不需要专注。</td>
    </tr>
    <tr>
      <td><strong>豁免</strong></td>
      <td>体质豁免（Constitution saving throw）。</td>
    </tr>
    <tr>
      <td><strong>伤害</strong></td>
      <td>豁免失败时 1d6 雷鸣伤害（Thunder damage）。</td>
    </tr>
    <tr>
      <td><strong>成长</strong></td>
      <td>5 级 2d6、11 级 3d6、17 级 4d6。</td>
    </tr>
    <tr>
      <td><strong>声音</strong></td>
      <td>雷鸣声最多可在 100 英尺外被听见。</td>
    </tr>
  </tbody>
</table>

<p><a href="${DND_THUNDERCLAP_2024_ROLL20_URL}" rel="noreferrer noopener">Roll20 2024 雷鸣拍击条目</a>给出的公开信息是：塑能戏法、动作、自身、姿势成分、瞬时、体质豁免、5 英尺散发和雷鸣伤害。区域术语要配合 <a href="${DND_EMANATION_2024_ROLL20_URL}" rel="noreferrer noopener">2024 散发（Emanation）定义</a>理解：散发从源点向外延伸，源点默认不包含在区域内，除非创造者决定包含。</p>

<h2 id="2014-vs-2024">2014 与 2024 雷鸣拍击差异</h2>
<p>2024 并没有把雷鸣拍击变成远程法术。主要变化是区域名称。旧文本常见写法是 5 英尺范围或 5 英尺半径；2024 使用“以你为源点的 5 英尺散发（Emanation）”。</p>

<table>
  <thead>
    <tr>
      <th>问题</th>
      <th>2014 风格文本</th>
      <th>2024 文本</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>区域语言</strong></td>
      <td>你以外、5 英尺内的生物。</td>
      <td>以你为源点的 5 英尺散发内的生物。</td>
    </tr>
    <tr>
      <td><strong>包含施法者吗？</strong></td>
      <td>不包含，旧文本写的是“你以外”。</td>
      <td>通常不包含，因为散发默认不包含源点，除非创造者决定包含。</td>
    </tr>
    <tr>
      <td><strong>包含盟友吗？</strong></td>
      <td>包含，只要盟友在区域内。</td>
      <td>包含，只要盟友在 5 英尺散发内。</td>
    </tr>
    <tr>
      <td><strong>声音</strong></td>
      <td>最多 100 英尺外可听见。</td>
      <td>最多 100 英尺外可听见。</td>
    </tr>
  </tbody>
</table>

<p>如果你的桌面仍用旧规则，可以核对 <a href="${DND_THUNDERCLAP_2014_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond 旧版雷鸣拍击页面</a>或 <a href="${DND_THUNDERCLAP_2014_WIKIDOT_URL}" rel="noreferrer noopener">旧版 Thunderclap 参考</a>。关键是开局前确定版本，不要在同一场战斗里来回切换措辞。</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_THUNDERCLAP_RADIUS_IMAGE_PATH}"
    alt="VTT 地图上展示施法者 Token 周围的 5 英尺雷鸣拍击爆发范围，敌人贴身，盟友位于边缘外"
    width="1400"
    height="933"
    loading="lazy"
    decoding="async"
  />
  <figcaption>线上跑团时先标 5 英尺爆发范围，再掷体质豁免。雷鸣拍击看的是贴身站位，不是 100 英尺伤害区。</figcaption>
</figure>

<h2 id="positioning">如何使用雷鸣拍击又不误伤队友</h2>
<p>雷鸣拍击最漂亮的场景，是你被多个敌人贴近。问题是，能被多个敌人贴近的角色通常也很危险。把它当作“被围住时的短距清场工具”，不要当作常规输出按钮。</p>

<ul>
  <li><strong>适合使用：</strong>两个或更多敌人贴近你，并且没有盟友站在爆发范围里。</li>
  <li><strong>风险很高：</strong>盟友、魔宠、召唤物、坐骑或被救 NPC 贴着你。</li>
  <li><strong>不适合：</strong>队伍正在潜入、谈判，或试图不惊动附近房间。</li>
  <li><strong>VTT 习惯：</strong>先放 5 英尺圆环，确认谁在里面，再做体质豁免。</li>
</ul>

<p>如果你的队伍常常挤在一起，雷鸣拍击就需要更清楚的 Token 标记。<a href="${ZH_DND_FIND_FAMILIAR_PATH}">找寻魔宠（Find Familiar）指南</a>尤其值得一起看，因为魔宠经常刚好站在范围戏法会惩罚的位置。若你想让豁免和反应动作更清晰，也可以参考 <a href="${ZH_DND_BLESS_PATH}">祝福术（Bless）指南</a>和 <a href="${ZH_DND_COUNTERSPELL_PATH}">反制法术（Counterspell）指南</a>。</p>

<h2 id="damage-scaling">雷鸣拍击伤害成长</h2>
<p><strong>5 级 2d6、11 级 3d6、17 级 4d6</strong>。这是正常戏法成长，通常看角色等级，不看单一职业等级。除非其他职业特性明确说明，否则雷鸣拍击不会自动加上你的施法属性修正。</p>

<p>因为它要求体质豁免（Constitution saving throw），面对强壮怪物时可能不如纸面好看。它不是 boss 杀手，更像是“我被贴身了，附近敌人很多”的应急按钮。你可以用 <a href="${ZH_DICE_ROLLER_PATH}">DnD 骰子工具</a>快速试一下 1d6、2d6、3d6、4d6 的实战期望。</p>

<h2 id="thunderclap-vs-sword-burst">雷鸣拍击 vs 剑刃爆发（Sword Burst）</h2>
<p>雷鸣拍击和剑刃爆发（Sword Burst）经常争同一个位置：敌人贴身时使用的范围戏法。区别不只是视觉风格。</p>

<table>
  <thead>
    <tr>
      <th>选择</th>
      <th>适合情况</th>
      <th>注意事项</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>雷鸣拍击（Thunderclap）</strong></td>
      <td>你需要雷鸣伤害（Thunder damage）、体质豁免，且场景已经不怕发出巨响。</td>
      <td>100 英尺声音和盟友风险。</td>
    </tr>
    <tr>
      <td><strong>剑刃爆发（Sword Burst）</strong></td>
      <td>你更想表现武器魔法感，或者桌面版本下它的豁免/伤害更适合当前敌人。</td>
      <td>不同版本的豁免、伤害类型、法术列表和措辞差异。</td>
    </tr>
  </tbody>
</table>

<p>不要只因为名字很有气势就选雷鸣拍击。你需要预期会被敌人贴近，能承受这种站位，而且队友能在掷骰前看清楚谁在范围里。</p>

<h2 id="video-guide">视频：雷鸣拍击桌边习惯</h2>
<p>如果你想先看视觉版说明，可以看这个视频缩略图入口。规则细节仍建议留着本文的 2014/2024 差异、散发说明和 VTT 检查清单。</p>

${liteVideoEmbed(DND_THUNDERCLAP_VIDEO_ID, 'Thunderclap DnD guide video', {
  src: DND_THUNDERCLAP_VIDEO_PLACEHOLDER_PATH,
  alt: '雷鸣拍击（Thunderclap）DND 指南视频缩略图，蓝色雷鸣爆发围绕 VTT 战斗地图上的施法者 Token',
})}

<h2 id="common-mistakes">雷鸣拍击常见错误</h2>
<ul>
  <li><strong>把 100 英尺当作伤害范围。</strong>那是声音传播距离。</li>
  <li><strong>忘记盟友。</strong>范围内的友方生物也可能被影响。</li>
  <li><strong>潜入时施放。</strong>这法术会非常明显地暴露你。</li>
  <li><strong>忽视体质豁免。</strong>很多结实怪物很擅长过这种豁免。</li>
  <li><strong>不在 VTT 上画圈。</strong>先画 5 英尺标记，能避免掷骰后争范围。</li>
</ul>

<h2 id="faq">雷鸣拍击（Thunderclap）常见问题</h2>
<h3 id="is-thunderclap-good">雷鸣拍击（Thunderclap）好用吗？</h3>
<p>当多个敌人已经贴近你，并且 100 英尺声音不会破坏潜入时，雷鸣拍击（Thunderclap）好用。若盟友也在范围里，或者你需要安静，它就不是好选择。</p>

<h3 id="does-thunderclap-hit-the-caster">雷鸣拍击会打到施法者吗？</h3>
<p>通常不会。2024 散发（Emanation）源点默认被排除，除非施法者选择包含源点；2014 文本也写的是除你之外的生物。</p>

<h3 id="does-thunderclap-hit-allies">雷鸣拍击会打到盟友吗？</h3>
<p>会。雷鸣拍击会影响区域内的盟友、魔宠、召唤物、坐骑和 NPC，所以在 VTT 上先画出 5 英尺散发再掷骰更清楚。</p>

<h3 id="is-thunderclap-100-feet">雷鸣拍击是 100 英尺伤害法术吗？</h3>
<p>不是。100 英尺描述的是声音能传到多远。真正造成伤害的是施法者周围的短距离爆发。</p>

<h3 id="what-save-does-thunderclap-use">雷鸣拍击使用什么豁免？</h3>
<p>雷鸣拍击使用体质豁免（Constitution saving throw）。豁免失败时受到雷鸣伤害（Thunder damage），豁免成功时不受伤害。</p>

<h3 id="how-does-thunderclap-scale">雷鸣拍击如何随等级成长？</h3>
<p>雷鸣拍击起始造成 1d6 雷鸣伤害，5 级 2d6、11 级 3d6、17 级 4d6。</p>

<h3 id="does-thunderclap-need-concentration">雷鸣拍击需要专注吗？</h3>
<p>不需要。雷鸣拍击持续时间是瞬时（Instantaneous），不需要专注。</p>

<h3 id="which-classes-get-thunderclap">哪些职业能获得雷鸣拍击？</h3>
<p>常见法术列表里，吟游诗人（Bard）、德鲁伊（Druid）、术士（Sorcerer）、契术师（Warlock）和法师（Wizard）可以取得 Thunderclap，魔械师（Artificer）也出现在常用 5e 参考资料中。最终以你桌面采用的规则来源为准。</p>

<h3 id="how-should-i-show-thunderclap-on-a-vtt">VTT 上应该怎样显示雷鸣拍击？</h3>
<p>在施法者 Token 周围放一个 5 英尺爆发标记，确认标记内每个生物，掷骰前先点名可能被误伤的盟友，再进行体质豁免。</p>
`;
