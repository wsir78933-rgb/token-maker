import {
  DND_HEX_2014_RULES_URL,
  DND_HEX_2024_ROLL20_URL,
  DND_HEX_2024_RULES_URL,
  DND_HEX_MARKERS_IMAGE_PATH,
  DND_HEX_VIDEO_PLACEHOLDER_PATH,
  DND_HEX_VIDEO_URL,
  DND_HEX_WARLOCK_2024_URL,
  DND_REMOVE_CURSE_RULES_URL,
  EN_DICE_ROLLER_PATH,
  EN_DND_BLESS_PATH,
  EN_DND_CLASSES_PATH,
  EN_DND_CONSTITUTION_PATH,
  EN_DND_COUNTERSPELL_PATH,
  EN_DND_HUNTERS_MARK_PATH,
  EN_DND_RANGER_SPELLS_PATH,
  EN_EDITOR_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_BLESS_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_DND_CONSTITUTION_PATH,
  ZH_DND_COUNTERSPELL_PATH,
  ZH_DND_HUNTERS_MARK_PATH,
  ZH_DND_RANGER_SPELLS_PATH,
  ZH_EDITOR_PATH,
  liteVideoEmbed,
} from './shared';

const DND_HEX_VIDEO_ID = 'JwINRY1eD7M';

export const dndHexArticleHtml = String.raw`
<p>If you searched for <strong>dnd hex</strong>, you probably want the rule that matters at the table: Hex curses one creature, adds a 1d6 Necrotic damage rider when your attacks hit that creature, and gives that creature disadvantage on checks for one chosen ability.</p>

<p>Hex is good when you keep landing repeated attack rolls into one target. It is not free damage. It asks for concentration, it spends your Bonus Action to cast or move, and its ability penalty is narrower than many players remember.</p>

<p>If your Warlock lives in Roll20, Foundry, or Owlbear, track Hex visually. Put the curse on the target, concentration on the Warlock, and the chosen ability somewhere the table can see it. The <a href="${EN_EDITOR_PATH}">Token Maker editor</a> is useful for making a clean curse ring or character token without opening a full image editor.</p>

<h2 id="quick-answer">Quick answer: what does Hex do in DnD?</h2>
<p><strong>Hex is a 1st-level Enchantment Warlock spell with a Bonus Action casting time, 90-foot range, verbal, somatic, and material components, and concentration up to 1 hour.</strong> The material component is the petrified eye of a newt.</p>

<p><strong>The 2024 wording adds 1d6 Necrotic damage whenever you hit the cursed target with an attack roll.</strong> When you cast it, choose one ability. <strong>The disadvantage rider affects ability checks only, not saving throws and not attack rolls.</strong></p>

<p><strong>If the cursed target drops to 0 Hit Points before Hex ends, you can use a Bonus Action on a later turn to curse a new creature.</strong> You are not casting the spell again when you move it, but you still spend the Bonus Action and still need concentration.</p>

<h2 id="stats-table">Hex stats table</h2>
<table>
  <thead>
    <tr>
      <th>Rule</th>
      <th>Fast answer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Spell level / school</strong></td>
      <td>1st-level Enchantment.</td>
    </tr>
    <tr>
      <td><strong>Main class</strong></td>
      <td>Warlock.</td>
    </tr>
    <tr>
      <td><strong>Casting time / range</strong></td>
      <td>Bonus Action / 90 feet.</td>
    </tr>
    <tr>
      <td><strong>Components</strong></td>
      <td>Verbal, Somatic, Material: the petrified eye of a newt.</td>
    </tr>
    <tr>
      <td><strong>Duration</strong></td>
      <td>Concentration, up to 1 hour at base level.</td>
    </tr>
    <tr>
      <td><strong>Damage</strong></td>
      <td>Extra 1d6 Necrotic damage when you hit the cursed target.</td>
    </tr>
    <tr>
      <td><strong>Check rider</strong></td>
      <td>Disadvantage on ability checks for one chosen ability.</td>
    </tr>
    <tr>
      <td><strong>Transfer</strong></td>
      <td>Bonus Action on a later turn after the cursed target drops to 0 HP.</td>
    </tr>
  </tbody>
</table>

<p>The official <a href="${DND_HEX_2024_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond 2024 Hex spell entry</a> and the <a href="${DND_HEX_2024_ROLL20_URL}" rel="noreferrer noopener">Roll20 2024 Hex compendium page</a> agree on the core 2024 shape: attack-roll damage, ability-check disadvantage, Bonus Action transfer, and longer duration with higher slots.</p>

<h2 id="rules-differences">2014 vs 2024 Hex rules</h2>
<p>The spell did not become a different engine in 2024. The important changes are the exact trigger wording, the level 2 upcast duration, and the old Remove Curse sentence.</p>

<table>
  <thead>
    <tr>
      <th>Question</th>
      <th>2014-style Hex</th>
      <th>2024 Hex</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Damage trigger</strong></td>
      <td>You hit the target with an attack.</td>
      <td>You hit the target with an attack roll.</td>
    </tr>
    <tr>
      <td><strong>Damage type</strong></td>
      <td>Necrotic.</td>
      <td>Necrotic.</td>
    </tr>
    <tr>
      <td><strong>Base duration</strong></td>
      <td>Concentration, up to 1 hour.</td>
      <td>Concentration, up to 1 hour.</td>
    </tr>
    <tr>
      <td><strong>Upcast duration</strong></td>
      <td>3rd-4th level: 8 hours; 5th+: 24 hours.</td>
      <td>2nd level: 4 hours; 3rd-4th: 8 hours; 5th+: 24 hours.</td>
    </tr>
    <tr>
      <td><strong>Remove Curse</strong></td>
      <td>Remove Curse cast on the target ends the spell early.</td>
      <td>The public Hex text no longer includes that spell-specific line; current Remove Curse still broadly ends curses.</td>
    </tr>
  </tbody>
</table>

<p><strong>In 2024, a level 2 slot can extend Hex to 4 hours, level 3-4 slots to 8 hours, and level 5+ slots to 24 hours.</strong> In 2014-style text, the longer duration starts at a 3rd-level slot. <strong>In 2014, Remove Curse cast on the target ends Hex early; the 2024 public Hex text no longer carries that spell-specific line, while current Remove Curse still broadly ends curses affecting a creature or object.</strong> Confirm the interaction with your DM if your table uses 2024 rules.</p>

<p>The older <a href="${DND_HEX_2014_RULES_URL}" rel="noreferrer noopener">2014-style Hex text</a> is still useful when a table runs legacy books. The current <a href="${DND_HEX_WARLOCK_2024_URL}" rel="noreferrer noopener">2024 Warlock rules</a> also name Hex as a recommended level 1 Warlock spell, which explains why new players keep meeting it early.</p>

<h2 id="eldritch-blast">Does Hex work with Eldritch Blast?</h2>
<p><strong>Eldritch Blast can add the Hex die once per beam that hits because each beam uses its own attack roll.</strong> A level 5 Warlock who fires two beams and hits the cursed target twice adds 1d6 Necrotic damage twice.</p>

<p>Do not stretch that into every scaling spell. If a spell makes one attack roll, Hex triggers once. If a feature creates several separate attack rolls and those attacks hit the cursed target, each hit can trigger the die. The useful table question is: how many separate attack rolls hit the Hex target?</p>

<p>If you want to test the pattern before a session, open the <a href="${EN_DICE_ROLLER_PATH}">DnD dice roller</a> and compare one hit, two Eldritch Blast beams, and a turn where you spend your Bonus Action moving the curse instead of doing something else.</p>

<h2 id="ability-choice">Which ability should you choose for Hex?</h2>
<p>The ability choice is where Hex gets misplayed. Pick the ability for the checks you expect, not for the saving throw you wish the monster would fail.</p>

<table>
  <thead>
    <tr>
      <th>Chosen ability</th>
      <th>Useful when</th>
      <th>Weak when</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Strength</strong></td>
      <td>The target must climb, swim, escape restraints, force doors, or deal with Athletics-style checks.</td>
      <td>The table uses saving throws for the maneuver you care about.</td>
    </tr>
    <tr>
      <td><strong>Dexterity</strong></td>
      <td>The target must hide, sneak, balance, pick locks, or contest stealth-related checks.</td>
      <td>You only wanted to reduce AC, initiative, or Dexterity saves.</td>
    </tr>
    <tr>
      <td><strong>Wisdom</strong></td>
      <td>The target must search, perceive, track, read motives, or notice hidden creatures.</td>
      <td>The fight is pure attack rolls and saving throws.</td>
    </tr>
    <tr>
      <td><strong>Intelligence</strong></td>
      <td>The target must investigate illusions, recall lore, or make Arcana-style checks.</td>
      <td>The monster is not making checks.</td>
    </tr>
    <tr>
      <td><strong>Charisma</strong></td>
      <td>The target must deceive, influence, intimidate, or resist social pressure through checks.</td>
      <td>The scene has no social or contested-check layer.</td>
    </tr>
    <tr>
      <td><strong>Constitution</strong></td>
      <td>Rarely. Constitution checks exist, but they are less common than Constitution saving throws.</td>
      <td>You meant to weaken concentration saves. Hex does not do that.</td>
    </tr>
  </tbody>
</table>

<p>For ordinary combat, Wisdom and Strength are usually the cleanest calls. Wisdom can punish Search and Perception. Strength can matter in escape, restraint, and physical-control scenes. Charisma, Dexterity, and Intelligence become better in social, stealth, and illusion-heavy scenes.</p>

<h2 id="worth-casting">When is Hex worth casting?</h2>
<p>Hex is worth casting when one target will survive long enough for repeated hits and your concentration slot is not needed elsewhere.</p>

<table>
  <thead>
    <tr>
      <th>Situation</th>
      <th>Use Hex?</th>
      <th>Why</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Durable boss or elite enemy</strong></td>
      <td>Often yes.</td>
      <td>The target can live long enough for repeated attack-roll hits.</td>
    </tr>
    <tr>
      <td><strong>Eldritch Blast-focused Warlock</strong></td>
      <td>Often yes early.</td>
      <td>More beams mean more chances to cash in the 1d6.</td>
    </tr>
    <tr>
      <td><strong>Many low-HP enemies</strong></td>
      <td>Usually no.</td>
      <td>You keep spending Bonus Actions to move the curse.</td>
    </tr>
    <tr>
      <td><strong>Need control or defense</strong></td>
      <td>Often no.</td>
      <td>Concentration may be better spent on another spell.</td>
    </tr>
    <tr>
      <td><strong>Bonus-action-heavy build</strong></td>
      <td>Be careful.</td>
      <td>Hex competes with the same turn economy your build already wants.</td>
    </tr>
  </tbody>
</table>

<p>The damage is modest but steady: one Hex hit averages 3.5 extra damage before accuracy. That improves with repeated hits. It also disappears fast if concentration breaks, the target dies too soon, or you need the Bonus Action for something more urgent.</p>

<p>Compare Hex with <a href="${EN_DND_HUNTERS_MARK_PATH}">Hunter's Mark</a> if you want the same 1d6-rider problem from the Ranger side. The <a href="${EN_DND_CONSTITUTION_PATH}">D&amp;D Constitution guide</a> is useful when concentration checks are your weak link, and the <a href="${EN_DND_COUNTERSPELL_PATH}">DND Counterspell guide</a> helps when your Warlock needs reaction timing more than damage.</p>

<h2 id="common-mistakes">Common Hex mistakes</h2>
<h3>Using Hex on saving throws</h3>
<p>Hex does not penalize saving throws. If you choose Wisdom, the target has disadvantage on Wisdom checks, not Wisdom saves.</p>

<h3>Using Hex to break concentration</h3>
<p>Damage-based concentration checks are Constitution saving throws. Hexing Constitution does not make those saves worse.</p>

<h3>Moving Hex too early</h3>
<p>You cannot move Hex just because a better target appeared. The cursed target has to drop to 0 HP before the spell ends.</p>

<h3>Forgetting Bonus Action pressure</h3>
<p>Casting Hex uses a Bonus Action. Moving it uses another Bonus Action. That can collide with subclass features, off-hand attacks, teleports, commands, and emergency setup turns.</p>

<h3>Tracking the target but not concentration</h3>
<p>The target ring is not enough. Put a concentration marker on the Warlock too. If concentration ends, the curse ends.</p>

<h2 id="vtt-workflow">VTT token tracking workflow</h2>
<p>The cleanest online setup is one visible curse marker on the target and one separate concentration marker on the Warlock.</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_HEX_MARKERS_IMAGE_PATH}"
    alt="dnd hex VTT marker workflow showing a Warlock concentration marker, a cursed target ring, a 1d6 necrotic tag, and a chosen ability note"
    width="1400"
    height="933"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Track the cursed target, the Warlock's concentration, the 1d6 damage rider, and the chosen ability. Hex gets messy when those four notes live in different places.</figcaption>
</figure>

<ol>
  <li>Put a violet or black curse ring on the target.</li>
  <li>Put a small concentration marker on the Warlock.</li>
  <li>Add a tiny "1d6 Necrotic" tag if your VTT supports labels.</li>
  <li>Record the chosen ability in chat, a token note, or the token name: "Hex: Wis checks."</li>
  <li>Move the target ring only after the cursed target drops to 0 HP and the Warlock spends the Bonus Action.</li>
</ol>

<p>Use the <a href="${EN_EDITOR_PATH}">Token Maker editor</a> to build a cursed-target portrait, a reusable overlay, or a Warlock token with a visible concentration reminder. If you need broader character planning, start with the <a href="${EN_DND_CLASSES_PATH}">DND classes guide</a>. If your table compares buff and debuff slots, the <a href="${EN_DND_BLESS_PATH}">DND Bless guide</a> and <a href="${EN_DND_RANGER_SPELLS_PATH}">DND Ranger spells guide</a> make good next reads.</p>

<h2 id="video">Hex DnD companion video</h2>
<p>For the optimization argument after the rules are clear, this video is worth watching: <a href="${DND_HEX_VIDEO_URL}" rel="noreferrer noopener">Hex is a trap in D&amp;D 5E - Advanced guide to Hex</a>. The useful point is not "never cast Hex." The useful point is to stop casting it by habit when concentration and Bonus Actions are doing more important work.</p>

${liteVideoEmbed(DND_HEX_VIDEO_ID, 'Hex is a trap in D&D 5E - Advanced guide to Hex', {
  src: DND_HEX_VIDEO_PLACEHOLDER_PATH,
  alt: 'Clickable webp video cover for a dnd hex guide showing a Warlock curse sigil and a VTT token marker with a play button',
})}

<h2 id="faq">Hex DnD FAQ</h2>
<h3>Is Hex a Warlock-only spell?</h3>
<p>Hex is a Warlock spell in the normal spell list, and 2024 Warlock rules recommend Hex as an early prepared spell. Other characters can sometimes get it through feats, subclasses, or table options.</p>

<h3>Does Hex trigger on every Eldritch Blast beam?</h3>
<p>Yes, if each beam hits the cursed target. Eldritch Blast makes separate attack rolls as it scales, so each hit can add the 1d6 Necrotic damage.</p>

<h3>Does Hex give disadvantage on saving throws?</h3>
<p>No. Hex only affects ability checks for the chosen ability. It does not affect saving throws or attack rolls.</p>

<h3>Does Hex help break enemy concentration?</h3>
<p>No. Concentration checks after damage are Constitution saving throws, and Hex does not penalize saving throws.</p>

<h3>Can you move Hex to another target?</h3>
<p>Yes, but only after the cursed target drops to 0 HP before Hex ends. Moving the curse uses a Bonus Action on a later turn.</p>

<h3>Is Hex still good in 2024 DnD?</h3>
<p>Hex is still good when you make repeated attack rolls into a durable target. It is weaker when concentration, Bonus Action pressure, or stronger control spells matter more.</p>

<h3>Does upcasting Hex increase the damage?</h3>
<p>No. Upcasting Hex extends the duration. It does not increase the 1d6 damage die.</p>

<h3>Does Remove Curse end Hex?</h3>
<p>In 2014 text, yes: Remove Curse cast on the target ends Hex early. The public 2024 Hex text no longer includes that spell-specific sentence, but current Remove Curse still broadly ends curses affecting a creature or object. Confirm the 2024 interaction with your DM before treating it as automatic at every table.</p>

<h2 id="sources">Rules sources</h2>
<ul>
  <li><a href="${DND_HEX_2024_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond, Hex spell, Player's Handbook 2024</a></li>
  <li><a href="${DND_HEX_2024_ROLL20_URL}" rel="noreferrer noopener">Roll20, Hex spell, D&amp;D 2024 compendium</a></li>
  <li><a href="${DND_HEX_2014_RULES_URL}" rel="noreferrer noopener">2014-style Hex spell text</a></li>
  <li><a href="${DND_REMOVE_CURSE_RULES_URL}" rel="noreferrer noopener">Roll20, Remove Curse spell, Free Basic Rules</a></li>
  <li><a href="${DND_HEX_WARLOCK_2024_URL}" rel="noreferrer noopener">Roll20, 2024 Warlock class rules</a></li>
</ul>
`;

export const dndHexArticleHtmlZh = String.raw`
<p>如果你在搜 <strong>dnd hex</strong>，真正需要的是桌边答案：巫术印记（Hex）诅咒一个生物；你用攻击命中它时，额外造成 1d6 黯蚀伤害；施放时还要指定一个属性，让目标在该属性的属性检定上具有劣势。</p>

<p>Hex 很适合反复打同一个耐打目标。它不是白送伤害。它占专注（Concentration），施放和转移都吃附赠动作（Bonus Action），而且属性劣势比很多玩家记忆里窄得多。</p>

<p>如果你在 Roll20、Foundry 或 Owlbear 上跑团，最好把巫术印记（Hex）可视化：目标身上放诅咒标记，契术师（Warlock）身上放专注标记，再把被选的属性写在大家能看到的位置。你可以用 <a href="${ZH_EDITOR_PATH}">Token Maker 编辑器</a> 做一个干净的诅咒环或角色 Token，不必另外打开完整修图软件。</p>

<h2 id="quick-answer">速查：DND 巫术印记（Hex）做什么？</h2>
<p><strong>巫术印记（Hex）是 1 环惑控（Enchantment）契术师（Warlock）法术，施放时间是附赠动作（Bonus Action），距离 90 英尺，需要语言、姿势和材料成分，并且需要专注（Concentration），最长 1 小时。</strong>材料成分是 petrified eye of a newt。</p>

<p><strong>2024 文本写法是：当你用攻击检定（attack roll）命中被诅咒目标时，额外造成 1d6 黯蚀伤害（Necrotic damage）。</strong>施放时选择一个属性。<strong>Hex 的劣势只影响属性检定（ability checks），不影响豁免（saving throws），也不影响攻击检定（attack rolls）。</strong></p>

<p><strong>如果被诅咒目标在 Hex 结束前降到 0 HP，你可以在之后的回合花附赠动作，把诅咒转移到另一个生物身上。</strong>这不是重新施法，但仍然花附赠动作，也仍然需要维持专注。</p>

<h2 id="stats-table">巫术印记（Hex）规则速查表</h2>
<table>
  <thead>
    <tr>
      <th>规则点</th>
      <th>速查答案</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>法术环级 / 学派</strong></td>
      <td>1 环惑控（Enchantment）。</td>
    </tr>
    <tr>
      <td><strong>主要职业</strong></td>
      <td>契术师（Warlock）。</td>
    </tr>
    <tr>
      <td><strong>施放时间 / 距离</strong></td>
      <td>附赠动作（Bonus Action）/ 90 英尺。</td>
    </tr>
    <tr>
      <td><strong>成分</strong></td>
      <td>语言、姿势、材料：petrified eye of a newt。</td>
    </tr>
    <tr>
      <td><strong>持续时间</strong></td>
      <td>专注，基础最长 1 小时。</td>
    </tr>
    <tr>
      <td><strong>伤害</strong></td>
      <td>你命中被诅咒目标时，额外造成 1d6 黯蚀伤害。</td>
    </tr>
    <tr>
      <td><strong>检定劣势</strong></td>
      <td>目标在一个指定属性的属性检定上具有劣势。</td>
    </tr>
    <tr>
      <td><strong>转移</strong></td>
      <td>被诅咒目标降到 0 HP 后，之后回合可花附赠动作转移。</td>
    </tr>
  </tbody>
</table>

<p><a href="${DND_HEX_2024_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond 的 2024 Hex 条目</a>和 <a href="${DND_HEX_2024_ROLL20_URL}" rel="noreferrer noopener">Roll20 2024 Hex 页面</a>都指向同一个核心：攻击检定命中才加伤害，劣势只给属性检定，转移要附赠动作，高环延长持续时间。</p>

<h2 id="rules-differences">2014 与 2024 巫术印记（Hex）有什么不同？</h2>
<p>巫术印记（Hex）在 2024 没有变成另一个法术。最容易影响桌面的差异是触发语句、2 环升环时长，以及旧文本里的解除诅咒（Remove Curse）句子。</p>

<table>
  <thead>
    <tr>
      <th>问题</th>
      <th>2014 风格巫术印记（Hex）</th>
      <th>2024 巫术印记（Hex）</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>伤害触发</strong></td>
      <td>你用攻击命中目标。</td>
      <td>你用攻击检定命中目标。</td>
    </tr>
    <tr>
      <td><strong>伤害类型</strong></td>
      <td>黯蚀伤害。</td>
      <td>黯蚀伤害。</td>
    </tr>
    <tr>
      <td><strong>基础持续</strong></td>
      <td>专注，最长 1 小时。</td>
      <td>专注，最长 1 小时。</td>
    </tr>
    <tr>
      <td><strong>升环持续</strong></td>
      <td>3-4 环：8 小时；5 环或更高：24 小时。</td>
      <td>2 环：4 小时；3-4 环：8 小时；5 环或更高：24 小时。</td>
    </tr>
    <tr>
      <td><strong>解除诅咒（Remove Curse）</strong></td>
      <td>对目标施放解除诅咒（Remove Curse）会提前结束巫术印记（Hex）。</td>
      <td>公开 2024 文本不再包含这句。</td>
    </tr>
  </tbody>
</table>

<p><strong>2024 规则里，2 环法术位能把巫术印记（Hex）延长到 4 小时，3-4 环延长到 8 小时，5 环或更高延长到 24 小时。</strong>2014 风格文本中，更长持续从 3 环法术位开始。2014 文本明确写着解除诅咒（Remove Curse）能提前结束 Hex；2024 Hex 公开文本已经没有这句，但当前解除诅咒仍能结束影响生物或物体的诅咒，所以 2024 桌面最好先由 DM 统一裁定。</p>

<p>如果你们仍在使用旧书，可以对照 <a href="${DND_HEX_2014_RULES_URL}" rel="noreferrer noopener">2014 风格 Hex 文本</a>。当前 <a href="${DND_HEX_WARLOCK_2024_URL}" rel="noreferrer noopener">2024 Warlock 规则</a>也把 Hex 列为早期推荐法术，这就是新 Warlock 玩家很快会遇到它的原因。</p>

<h2 id="eldritch-blast">巫术印记（Hex）能配合魔能爆（Eldritch Blast）吗？</h2>
<p>可以。魔能爆（Eldritch Blast）每束光线都使用独立攻击检定；只要命中被 Hex 的目标，每束命中的光线都能加一次 1d6 黯蚀伤害。</p>

<p>不要把这个结论套到所有随等级变强的法术上。一个法术如果只做一次攻击检定，Hex 就只触发一次。关键问题很简单：这回合到底有几次独立攻击检定命中了 Hex 目标？</p>

<p>想在开团前试一下，可以打开 <a href="${ZH_DICE_ROLLER_PATH}">DnD 骰子工具</a>，分别算一次命中、两束魔能爆（Eldritch Blast）命中，以及你把附赠动作花在转移诅咒时的回合收益。</p>

<h2 id="ability-choice">巫术印记（Hex）应该选哪个属性？</h2>
<p>属性选择最容易被误用。你要按预计会发生的属性检定来选，而不是按你希望怪物失败的豁免来选。</p>

<table>
  <thead>
    <tr>
      <th>选择属性</th>
      <th>适合场景</th>
      <th>不适合场景</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>力量（Strength）</strong></td>
      <td>目标要攀爬、游泳、逃脱束缚、撞门，或处理 Athletics 类检定。</td>
      <td>你们桌把相关动作改用豁免处理。</td>
    </tr>
    <tr>
      <td><strong>敏捷（Dexterity）</strong></td>
      <td>目标要隐藏、潜行、平衡、开锁，或处理 Stealth 相关对抗。</td>
      <td>你只是想降低 AC、先攻或 Dexterity 豁免。</td>
    </tr>
    <tr>
      <td><strong>感知（Wisdom）</strong></td>
      <td>目标要搜索、察觉、追踪、看破动机，或发现隐藏生物。</td>
      <td>这场战斗只剩攻击检定和豁免。</td>
    </tr>
    <tr>
      <td><strong>智力（Intelligence）</strong></td>
      <td>目标要调查幻术、回忆知识，或做 Arcana 类检定。</td>
      <td>怪物根本不会做检定。</td>
    </tr>
    <tr>
      <td><strong>魅力（Charisma）</strong></td>
      <td>目标要欺瞒、影响、威吓，或通过检定处理社交压力。</td>
      <td>场景没有社交或对抗检定。</td>
    </tr>
    <tr>
      <td><strong>体质（Constitution）</strong></td>
      <td>少见。Constitution 检定存在，但远不如 Constitution 豁免常见。</td>
      <td>你想削弱专注豁免。Hex 做不到。</td>
    </tr>
  </tbody>
</table>

<p>普通战斗里，Wisdom 和 Strength 往往最直观。Wisdom 可以影响 Search 和 Perception，Strength 适合逃脱、束缚和身体对抗场景。社交、潜入和幻术戏份多时，Charisma、Dexterity、Intelligence 会更有价值。</p>

<h2 id="worth-casting">什么时候值得施放 Hex？</h2>
<p>当一个目标能活到你多次命中，并且你的专注位没有更重要用途时，Hex 才值得施放。</p>

<table>
  <thead>
    <tr>
      <th>场景</th>
      <th>是否用 Hex</th>
      <th>原因</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>耐打 Boss 或精英怪</strong></td>
      <td>通常可以。</td>
      <td>目标能活到你用多次攻击检定命中。</td>
    </tr>
    <tr>
      <td><strong>Eldritch Blast 核心 Warlock</strong></td>
      <td>早期常用。</td>
      <td>光线越多，兑现 1d6 的机会越多。</td>
    </tr>
    <tr>
      <td><strong>大量低 HP 小怪</strong></td>
      <td>通常不值。</td>
      <td>你会一直花附赠动作转移诅咒。</td>
    </tr>
    <tr>
      <td><strong>需要控场或防御</strong></td>
      <td>常常不值。</td>
      <td>专注可能该留给另一个法术。</td>
    </tr>
    <tr>
      <td><strong>附赠动作很挤的构筑</strong></td>
      <td>谨慎。</td>
      <td>Hex 会抢你的回合经济。</td>
    </tr>
  </tbody>
</table>

<p>一次 Hex 命中平均只多 3.5 伤害，还没算命中率。多次命中会变好，但专注断掉、目标太快死亡、附赠动作被占用，都会让这个计划变亏。</p>

<p>如果你想从 Ranger 角度看同一个 1d6 加骰问题，可以读 <a href="${ZH_DND_HUNTERS_MARK_PATH}">Hunter's Mark 指南</a>。如果你的弱点是专注检定，接着看 <a href="${ZH_DND_CONSTITUTION_PATH}">DND Constitution 指南</a>；如果你更在意反应时机，可以看 <a href="${ZH_DND_COUNTERSPELL_PATH}">DND Counterspell 指南</a>。</p>

<h2 id="common-mistakes">常见 Hex 误区</h2>
<h3>把 Hex 用在豁免上</h3>
<p>Hex 不削弱豁免。你选择 Wisdom 时，目标是 Wisdom 检定劣势，不是 Wisdom 豁免劣势。</p>

<h3>想用 Hex 打断专注</h3>
<p>受到伤害后的专注检定是 Constitution 豁免。对 Constitution 下 Hex 不会让这个豁免更差。</p>

<h3>太早转移 Hex</h3>
<p>不能因为出现了更好的目标就转移 Hex。被诅咒目标必须先在法术结束前降到 0 HP。</p>

<h3>忘记附赠动作压力</h3>
<p>施放 Hex 要附赠动作，转移也要附赠动作。它会和子职业能力、副手攻击、传送、命令类能力和救场设置挤在同一个动作栏里。</p>

<h3>只标目标，不标专注</h3>
<p>目标标记不够。Warlock 自己身上也要有专注标记。专注结束，Hex 就结束。</p>

<h2 id="vtt-workflow">VTT Token 标记流程</h2>
<p>线上跑团最干净的做法，是目标身上一枚诅咒标记，契术师（Warlock）身上一枚专注标记。</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_HEX_MARKERS_IMAGE_PATH}"
    alt="DND 巫术印记（Hex）的 VTT 标记流程图，展示契术师（Warlock）专注标记、被诅咒目标环、1d6 黯蚀伤害标签和被选择属性记录"
    width="1400"
    height="933"
    loading="lazy"
    decoding="async"
  />
  <figcaption>把被诅咒目标、契术师（Warlock）专注、1d6 伤害加骰和被选择属性分开标清。巫术印记（Hex）麻烦的地方，往往不是规则难，而是四个记录点散在不同地方。</figcaption>
</figure>

<ol>
  <li>在目标身上放紫色或黑色诅咒环。</li>
  <li>在契术师（Warlock）身上放小型专注标记。</li>
  <li>如果 VTT 支持标签，加一个 "1d6 Necrotic" 或 "1d6 黯蚀"。</li>
  <li>在聊天、Token note 或 Token 名称里记录属性，例如 "Hex: Wis checks"。</li>
  <li>只有目标降到 0 HP 且契术师（Warlock）花附赠动作后，才移动目标标记。</li>
</ol>

<p>你可以用 <a href="${ZH_EDITOR_PATH}">Token Maker 编辑器</a>做被诅咒目标头像、可复用覆盖层，或者带专注提醒的契术师（Warlock）Token。还在选职业时，可以先看 <a href="${ZH_DND_CLASSES_PATH}">DND 职业指南</a>。如果你们桌经常比较 buff 和 debuff 专注位，<a href="${ZH_DND_BLESS_PATH}">祝福术（Bless）指南</a>和 <a href="${ZH_DND_RANGER_SPELLS_PATH}">DND 游侠法术指南</a>也适合接着读。</p>

<h2 id="video">巫术印记（Hex）配套视频</h2>
<p>规则看清后，可以再看这个优化角度的视频：<a href="${DND_HEX_VIDEO_URL}" rel="noreferrer noopener">Hex is a trap in D&amp;D 5E - Advanced guide to Hex</a>。重点不是“永远不要放 Hex”，而是不要看到 Warlock 就本能施放。专注和附赠动作有时比 1d6 更值钱。</p>

${liteVideoEmbed(DND_HEX_VIDEO_ID, 'Hex is a trap in D&D 5E - Advanced guide to Hex', {
  src: DND_HEX_VIDEO_PLACEHOLDER_PATH,
  alt: 'DND 巫术印记（Hex）指南的视频 WebP 占位封面，展示契术师（Warlock）诅咒符文、VTT Token 标记和播放按钮',
})}

<h2 id="faq">DND 巫术印记（Hex）常见问题</h2>
<h3>巫术印记（Hex）是契术师（Warlock）专属法术吗？</h3>
<p>巫术印记（Hex）是常规法术列表里的契术师（Warlock）法术，2024 Warlock 规则也把它列为早期推荐法术。其他角色有时可以通过专长、子职业或桌面选项取得它。</p>

<h3>巫术印记（Hex）会在每束魔能爆（Eldritch Blast）上触发吗？</h3>
<p>会，只要每束光线都命中被诅咒目标。魔能爆（Eldritch Blast）随等级成长时会做多次独立攻击检定，所以每次命中都能加 1d6 黯蚀伤害。</p>

<h3>巫术印记（Hex）会让豁免具有劣势吗？</h3>
<p>不会。Hex 只影响属性检定，具体是被选属性的属性检定；它不影响豁免，也不影响攻击检定。</p>

<h3>巫术印记（Hex）能帮助打断敌人专注吗？</h3>
<p>不能。受伤后的专注检定是 Constitution 豁免，而 Hex 不会惩罚豁免。</p>

<h3>巫术印记（Hex）能转移到另一个目标吗？</h3>
<p>可以，但必须先等被诅咒目标在 Hex 结束前降到 0 HP。转移诅咒要在之后的回合花附赠动作。</p>

<h3>2024 DnD 里 Hex 还好吗？</h3>
<p>当你会对一个耐打目标反复做攻击检定时，Hex 仍然好用。若专注、附赠动作或更强控场法术更重要，它就会变弱。</p>

<h3>巫术印记（Hex）升环会提高伤害吗？</h3>
<p>不会。Hex 升环只延长持续时间，不提高 1d6 伤害骰。</p>

<h3>解除诅咒（Remove Curse）能结束巫术印记（Hex）吗？</h3>
<p>2014 文本里可以：对目标施放解除诅咒（Remove Curse）会提前结束 Hex。公开 2024 Hex 法术文本已经没有这条专门句子，但当前解除诅咒仍会结束影响生物或物体的诅咒，所以 2024 桌面请先按 DM 对版本互动的裁定处理。</p>

<h2 id="sources">规则来源</h2>
<ul>
  <li><a href="${DND_HEX_2024_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond, Hex spell, Player's Handbook 2024</a></li>
  <li><a href="${DND_HEX_2024_ROLL20_URL}" rel="noreferrer noopener">Roll20, Hex spell, D&amp;D 2024 compendium</a></li>
  <li><a href="${DND_HEX_2014_RULES_URL}" rel="noreferrer noopener">2014-style Hex spell text</a></li>
  <li><a href="${DND_REMOVE_CURSE_RULES_URL}" rel="noreferrer noopener">Roll20, Remove Curse spell, Free Basic Rules</a></li>
  <li><a href="${DND_HEX_WARLOCK_2024_URL}" rel="noreferrer noopener">Roll20, 2024 Warlock class rules</a></li>
</ul>
`;
