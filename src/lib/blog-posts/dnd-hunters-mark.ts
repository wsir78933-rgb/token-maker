import {
  DND_HUNTERS_MARK_2014_RULES_URL,
  DND_HUNTERS_MARK_2024_RULES_URL,
  DND_HUNTERS_MARK_VIDEO_PLACEHOLDER_PATH,
  DND_HUNTERS_MARK_VIDEO_URL,
  DND_HUNTERS_MARK_VTT_IMAGE_PATH,
  DND_RANGER_2024_RULES_URL,
  EN_DND_CLASSES_PATH,
  EN_DND_CONSTITUTION_PATH,
  EN_DND_DRUID_SPELLS_PATH,
  EN_DND_MAGE_ARMOR_PATH,
  EN_EDITOR_PATH,
  EN_DICE_ROLLER_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_DND_CONSTITUTION_PATH,
  ZH_DND_DRUID_SPELLS_PATH,
  ZH_DND_MAGE_ARMOR_PATH,
  ZH_EDITOR_PATH,
  ZH_DICE_ROLLER_PATH,
  liteVideoEmbed,
} from './shared';

export const dndHuntersMarkArticleHtml = String.raw`
<p><strong>dnd hunter's mark</strong> is a 1st-level Divination spell that marks one creature, adds <strong>1d6 damage when you hit that target</strong>, and helps you track it. This guide gives you the fast rules, the 2014 vs 2024 differences, the concentration trap, and a practical way to show the mark on VTT tokens.</p>

<p>I am treating this as a spell encyclopedia page for Rangers, not a hype piece. The short version from my tables: Hunter's Mark is good when the target lives long enough for repeated attacks, and mediocre when it steals concentration or bonus actions from better plays.</p>

<table>
  <thead>
    <tr>
      <th>Need-to-know point</th>
      <th>Fast answer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Spell level / school</strong></td>
      <td>1st-level Divination.</td>
    </tr>
    <tr>
      <td><strong>Casting time / range</strong></td>
      <td>Bonus Action / 90 feet.</td>
    </tr>
    <tr>
      <td><strong>Components</strong></td>
      <td>Verbal only.</td>
    </tr>
    <tr>
      <td><strong>Duration</strong></td>
      <td>Concentration, up to 1 hour. Higher slots extend duration, not damage.</td>
    </tr>
    <tr>
      <td><strong>2014 damage trigger</strong></td>
      <td>Extra 1d6 damage when you hit the marked target with a weapon attack.</td>
    </tr>
    <tr>
      <td><strong>2024 damage trigger</strong></td>
      <td>Extra 1d6 Force damage when you hit the marked target with an attack roll.</td>
    </tr>
    <tr>
      <td><strong>Best use</strong></td>
      <td>Mark one durable enemy you expect to hit multiple times before concentration breaks.</td>
    </tr>
  </tbody>
</table>

<h2 id="quick-rules">DND Hunter's Mark Quick Rules</h2>
<p><strong>DND Hunter's Mark is a bonus-action concentration spell that rewards repeated hits against one marked target.</strong> The <a href="${DND_HUNTERS_MARK_2014_RULES_URL}" rel="noreferrer noopener">2014 Basic Rules version</a> and the <a href="${DND_HUNTERS_MARK_2024_RULES_URL}" rel="noreferrer noopener">2024 Free Rules version</a> share the same basic shape, but the 2024 wording is broader and cleaner for modern Ranger play.</p>

<ul>
  <li><strong>You must see the creature</strong> when you cast the spell or move the mark to a new target.</li>
  <li><strong>The spell needs concentration.</strong> A broken concentration check ends the mark unless a later feature says otherwise.</li>
  <li><strong>The tracking benefit is narrow but real.</strong> It gives Advantage on Wisdom (Perception or Survival) checks you make to find the marked target.</li>
  <li><strong>Moving the mark costs a Bonus Action.</strong> You only get to move it after the target drops to 0 HP before the spell ends.</li>
  <li><strong>Upcasting extends the timer.</strong> A level 3-4 slot can last up to 8 hours; a level 5+ slot can last up to 24 hours.</li>
</ul>

<h2 id="rules-differences">What Changed in 2024 Hunter's Mark?</h2>
<p><strong>In 2024, Hunter's Mark changed from a weapon-attack damage rider into a Force-damage rider that works whenever you hit the marked target with an attack roll.</strong> That is the rules difference most likely to matter at the table.</p>

<table>
  <thead>
    <tr>
      <th>Question</th>
      <th>2014 Hunter's Mark</th>
      <th>2024 Hunter's Mark</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Damage type</strong></td>
      <td>The spell adds 1d6 damage but does not name Force damage.</td>
      <td>The spell adds 1d6 Force damage.</td>
    </tr>
    <tr>
      <td><strong>Trigger</strong></td>
      <td>You hit the target with a weapon attack.</td>
      <td>You hit the target with an attack roll.</td>
    </tr>
    <tr>
      <td><strong>Spell attacks</strong></td>
      <td>Normally no, because the trigger is weapon attacks.</td>
      <td>Yes, if the spell attack includes an attack roll and you are hitting the marked target.</td>
    </tr>
    <tr>
      <td><strong>Moving the mark</strong></td>
      <td>Bonus Action on a subsequent turn after the target drops to 0 HP.</td>
      <td>Bonus Action after the target drops to 0 HP, with the "subsequent turn" wording removed.</td>
    </tr>
    <tr>
      <td><strong>Ranger support</strong></td>
      <td>It is a Ranger spell, but not the whole class engine.</td>
      <td><a href="${DND_RANGER_2024_RULES_URL}" rel="noreferrer noopener">2024 Ranger</a> gives free casts and later features that improve Hunter's Mark.</td>
    </tr>
  </tbody>
</table>

<p>The 2024 Ranger leans hard into the spell. Favored Enemy gives free casts, Relentless Hunter stops damage from breaking concentration on it at level 13, Precise Hunter gives Advantage against the marked creature at level 17, and Foe Slayer turns the die into a d10 at level 20.</p>

<h2 id="worth-casting">When Is Hunter's Mark Worth Casting?</h2>
<p><strong>Hunter's Mark is worth casting when one target will survive long enough for multiple hits and you are not giving up a stronger concentration plan.</strong> If the fight is short, crowded with weak enemies, or already demanding your Bonus Action, the spell can underperform.</p>

<table>
  <thead>
    <tr>
      <th>Situation</th>
      <th>Use it?</th>
      <th>Why</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Single boss or elite monster</strong></td>
      <td>Usually yes.</td>
      <td>The target lives long enough for repeated attacks.</td>
    </tr>
    <tr>
      <td><strong>Level 5 Ranger with Extra Attack</strong></td>
      <td>Often yes.</td>
      <td>Two attacks make the 1d6 rider easier to cash in.</td>
    </tr>
    <tr>
      <td><strong>Many low-HP enemies</strong></td>
      <td>Usually no.</td>
      <td>You keep spending Bonus Actions to move the mark instead of ending threats.</td>
    </tr>
    <tr>
      <td><strong>Two-weapon or bonus-action-heavy build</strong></td>
      <td>Be careful.</td>
      <td>The spell competes with the same Bonus Action your build wants every round.</td>
    </tr>
    <tr>
      <td><strong>Need control, stealth, or terrain magic</strong></td>
      <td>Often no.</td>
      <td><em>Pass without Trace</em>, <em>Spike Growth</em>, <em>Entangle</em>, or <em>Summon Beast</em> may win the encounter more cleanly.</td>
    </tr>
  </tbody>
</table>

<p>The quick math is simple: one Hunter's Mark hit is only 3.5 average damage before accuracy. At two hits per round it starts feeling better, but the real cost is not the spell slot. The real cost is concentration, Bonus Action timing, and the Ranger spell you are not concentrating on.</p>

<h2 id="action-economy">Why Hunter's Mark Can Become a Trap</h2>
<p><strong>Hunter's Mark becomes a trap when you cast it by habit instead of checking concentration and Bonus Action pressure.</strong> The linked video at the bottom is about Hex, but the lesson transfers directly: a 1d6 damage rider looks cheap until it blocks the turn you actually needed.</p>

<ul>
  <li><strong>Concentration is crowded.</strong> Rangers have real alternatives, especially <em>Pass without Trace</em>, <em>Spike Growth</em>, <em>Entangle</em>, <em>Silence</em>, and summons.</li>
  <li><strong>Bonus Actions are crowded.</strong> Moving Hunter's Mark can fight with off-hand attacks, subclass commands, mobility features, and emergency healing.</li>
  <li><strong>Damage is target-dependent.</strong> A marked enemy that dies before your next turn gave you almost no return.</li>
  <li><strong>Getting hit matters.</strong> Before level 13 in 2024, damage can still break concentration on Hunter's Mark.</li>
</ul>

<p>If concentration checks are the weak point in your build, pair this article with the <a href="${EN_DND_CONSTITUTION_PATH}">D&amp;D Constitution guide</a>. If you are comparing Ranger concentration options, the <a href="${EN_DND_DRUID_SPELLS_PATH}">DND druid spells guide</a> is also useful because many nature-control spells compete for the same mental slot.</p>

<h2 id="common-rulings">Common DND Hunter's Mark Rulings</h2>
<p><strong>Most Hunter's Mark arguments come from trigger wording, range assumptions, and whether the mark is a tracking tool or a reveal spell.</strong> Set these rulings once and the spell becomes much easier to run.</p>

<h3>Does Hunter's Mark work on every hit?</h3>
<p><strong>Yes, if the hit matches your rules version's trigger.</strong> In 2014, that means weapon attacks. In 2024, that means attack rolls. A level 5 Ranger who hits twice can add the die twice.</p>

<h3>Does Hunter's Mark double on a critical hit?</h3>
<p><strong>Most tables double the Hunter's Mark damage die on a critical hit because it is extra damage from the hit.</strong> Do not extend that into every reroll feature automatically. If a feature only rerolls weapon damage dice, many tables leave the Hunter's Mark die alone.</p>

<h3>Can you move Hunter's Mark for free?</h3>
<p><strong>No. Moving Hunter's Mark costs a Bonus Action, and the previous marked target must have dropped to 0 HP before the spell ended.</strong> You do not spend a new spell slot to move it, but you do spend the Bonus Action.</p>

<h3>Does the target leaving 90 feet end Hunter's Mark?</h3>
<p><strong>No. The 90-foot range is for choosing or moving the mark.</strong> Once the spell is active, leaving that range does not automatically end it. Concentration, duration, and valid transfer timing matter more.</p>

<h3>Does Hunter's Mark reveal an invisible or hidden target?</h3>
<p><strong>No. Hunter's Mark helps you find the target, but it does not automatically reveal it.</strong> You get Advantage on the relevant Perception or Survival check; the DM still resolves hiding, invisibility, cover, tracks, and scene logic.</p>

<h2 id="vtt-tokens">How to Track Hunter's Mark on VTT Tokens</h2>
<p><strong>The cleanest VTT setup is one visible mark on the target and one separate concentration reminder on the Ranger.</strong> Do not rely on memory when the fight has summons, conditions, and multiple damage riders.</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_HUNTERS_MARK_VTT_IMAGE_PATH}"
    alt="dnd hunter's mark VTT token tracking image showing a Ranger token with a concentration marker, a marked quarry token, and a transfer path to the next target"
    width="1400"
    height="933"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Track the quarry and the Ranger separately. The marked enemy tells everyone where the damage goes; the Ranger marker reminds the table that concentration can still drop.</figcaption>
</figure>

<ul>
  <li><strong>Use a high-contrast target ring.</strong> Amber, teal, or white reads better than a tiny icon on a dark map.</li>
  <li><strong>Keep concentration on the Ranger token.</strong> The target marker is not enough when the Ranger gets hit.</li>
  <li><strong>Make the marker reusable.</strong> A simple quarry ring or corner badge works across monsters, bosses, and chase scenes.</li>
  <li><strong>Avoid covering the creature art.</strong> Put the mark around the portrait or base so the monster silhouette stays readable.</li>
  <li><strong>Use one marker language for the campaign.</strong> If Hunter's Mark, Hex, and curses all look different, players stop asking "which 1d6 is this?"</li>
</ul>

<p>You can build a clean Ranger or marked-target portrait in the <a href="${EN_EDITOR_PATH}">Token Maker editor</a>. If you want to test the expected damage swing, keep the <a href="${EN_DICE_ROLLER_PATH}">D&amp;D dice roller</a> open and compare one hit, two hits, and a missed Bonus Action turn. For broader character planning, start with the <a href="${EN_DND_CLASSES_PATH}">DND classes guide</a> or the spell-guide pattern in <a href="${EN_DND_MAGE_ARMOR_PATH}">DND Mage Armor</a>.</p>

<h2 id="cheat-sheet">Player and DM Cheat Sheet</h2>
<p><strong>The easiest way to run Hunter's Mark quickly is to use the same table phrases every time.</strong> That keeps the spell from turning into a mid-combat rules search.</p>

<table>
  <thead>
    <tr>
      <th>Moment</th>
      <th>Say this at the table</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Casting</strong></td>
      <td>"Bonus Action: I mark that visible creature and start concentrating."</td>
    </tr>
    <tr>
      <td><strong>Hit</strong></td>
      <td>"The attack hits, so I add Hunter's Mark damage."</td>
    </tr>
    <tr>
      <td><strong>Target drops</strong></td>
      <td>"The marked target is at 0 HP; I can move the mark with a Bonus Action before the spell ends."</td>
    </tr>
    <tr>
      <td><strong>Ranger takes damage</strong></td>
      <td>"I need a concentration save unless my feature prevents this from breaking Hunter's Mark."</td>
    </tr>
    <tr>
      <td><strong>Target hides</strong></td>
      <td>"Hunter's Mark does not reveal it, but I have Advantage on checks to find it."</td>
    </tr>
  </tbody>
</table>

<h2 id="faq">FAQ About DND Hunter's Mark</h2>
<h3>Is Hunter's Mark concentration?</h3>
<p>Yes. <strong>Hunter's Mark requires concentration</strong> for up to 1 hour, unless a specific feature changes how concentration works for that spell.</p>

<h3>Does Hunter's Mark trigger on every hit?</h3>
<p>It works on every hit that matches the trigger. In 2014, that means weapon attacks. In 2024, it means hits with attack rolls.</p>

<h3>Can you move Hunter's Mark after the target drops to 0 HP?</h3>
<p>Yes. If the marked target drops to 0 HP before the spell ends, you can spend a Bonus Action to move the mark to a new visible creature within range.</p>

<h3>Does Hunter's Mark reveal the target?</h3>
<p>No. Hunter's Mark gives Advantage on checks to find the marked creature, but it does not automatically reveal an invisible or hidden target.</p>

<h3>Is upcasting Hunter's Mark worth it?</h3>
<p>Usually only when the extended duration matters across multiple scenes. Upcasting Hunter's Mark extends concentration duration; it does not increase the 1d6 damage die.</p>

<h2 id="video">Watch: Why the Hex Trap Matters for Hunter's Mark</h2>
<p>The video from the keyword sheet is <a href="${DND_HUNTERS_MARK_VIDEO_URL}" rel="noreferrer noopener">Hex is a trap in D&amp;D 5E - Advanced guide to Hex</a>. It is not a Hunter's Mark tutorial, but the useful idea is the same: <strong>a small damage rider can look automatic while quietly spending concentration and Bonus Actions</strong>. Use that lens before you mark every goblin in the room.</p>

${liteVideoEmbed('JwINRY1eD7M', 'Hex is a trap in D&D 5E - Advanced guide to Hex', {
  src: DND_HUNTERS_MARK_VIDEO_PLACEHOLDER_PATH,
  alt: "Clickable webp video cover for a dnd hunter's mark guide showing a purple Hex sigil and an amber Hunter's Mark quarry sigil on a moonlit forest grid",
})}
`;

export const dndHuntersMarkArticleHtmlZh = String.raw`
<p><strong>dnd hunter's mark</strong> 是一个 1 环 Divination 法术：标记一个生物，命中它时追加 <strong>1d6 伤害</strong>，并让你更容易追踪它。这篇会先给速查规则，再讲 2014/2024 差异、专注陷阱，以及怎样在 Roll20、Foundry 这类 VTT 里把标记显示清楚。</p>

<p>我会把它当作游侠法术百科来写，不把它吹成必放神技。按我桌上的经验，Hunter's Mark 在目标够硬、你能持续命中时很好；但如果它抢走了更强的专注法术或附赠动作，就会变成看起来赚、实际拖节奏的选择。</p>

<table>
  <thead>
    <tr>
      <th>你最想知道的点</th>
      <th>快速答案</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>法术环级 / 学派</strong></td>
      <td>1 环 Divination。</td>
    </tr>
    <tr>
      <td><strong>施法动作 / 距离</strong></td>
      <td>Bonus Action / 90 尺。</td>
    </tr>
    <tr>
      <td><strong>法术成分</strong></td>
      <td>只有 Verbal。</td>
    </tr>
    <tr>
      <td><strong>持续时间</strong></td>
      <td>Concentration，最多 1 小时。升环只延长时间，不提高伤害。</td>
    </tr>
    <tr>
      <td><strong>2014 伤害触发</strong></td>
      <td>你用 weapon attack 命中被标记目标时，追加 1d6 伤害。</td>
    </tr>
    <tr>
      <td><strong>2024 伤害触发</strong></td>
      <td>你用 attack roll 命中被标记目标时，追加 1d6 Force damage。</td>
    </tr>
    <tr>
      <td><strong>最佳用法</strong></td>
      <td>标记一个够硬、你预计会连续攻击多轮的敌人。</td>
    </tr>
  </tbody>
</table>

<h2 id="quick-rules">DND Hunter's Mark 速查规则</h2>
<p><strong>DND Hunter's Mark 是一个附赠动作施放的专注法术，核心价值是反复命中同一个被标记目标。</strong><a href="${DND_HUNTERS_MARK_2014_RULES_URL}" rel="noreferrer noopener">2014 Basic Rules 版本</a>和 <a href="${DND_HUNTERS_MARK_2024_RULES_URL}" rel="noreferrer noopener">2024 Free Rules 版本</a>骨架相似，但 2024 写法更宽，也更贴合新版 Ranger。</p>

<ul>
  <li><strong>施放或转移时必须看见目标。</strong>看不见就不能把标记放到那个生物身上。</li>
  <li><strong>它需要 Concentration。</strong>专注断了，标记就没了，除非你有明确改写该规则的职业特性。</li>
  <li><strong>追踪收益很窄，但有用。</strong>你寻找被标记目标时，Wisdom (Perception 或 Survival) 检定有 Advantage。</li>
  <li><strong>换目标要花 Bonus Action。</strong>必须是原目标在法术结束前降到 0 HP，才能转移。</li>
  <li><strong>升环只加持续时间。</strong>3-4 环最多 8 小时；5 环以上最多 24 小时。</li>
</ul>

<h2 id="rules-differences">2024 Hunter's Mark 改了什么？</h2>
<p><strong>2024 版 Hunter's Mark 最大变化，是从 weapon attack 触发的额外伤害，变成了 attack roll 命中时触发的 Force damage。</strong>这会直接影响法术攻击、特殊攻击和混合构筑的判定。</p>

<table>
  <thead>
    <tr>
      <th>问题</th>
      <th>2014 Hunter's Mark</th>
      <th>2024 Hunter's Mark</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>伤害类型</strong></td>
      <td>追加 1d6 伤害，但文本没有写 Force damage。</td>
      <td>追加 1d6 Force damage。</td>
    </tr>
    <tr>
      <td><strong>触发条件</strong></td>
      <td>你用 weapon attack 命中目标。</td>
      <td>你用 attack roll 命中目标。</td>
    </tr>
    <tr>
      <td><strong>法术攻击</strong></td>
      <td>通常不触发，因为文本要求 weapon attack。</td>
      <td>可以，只要该法术攻击包含 attack roll，并且你命中的是被标记目标。</td>
    </tr>
    <tr>
      <td><strong>转移标记</strong></td>
      <td>目标降到 0 HP 后，在后续你的回合用 Bonus Action 标记新目标。</td>
      <td>目标降到 0 HP 后，用 Bonus Action 转移；删除了 subsequent turn 的旧表述。</td>
    </tr>
    <tr>
      <td><strong>Ranger 支持</strong></td>
      <td>它是 Ranger 法术，但不是整个职业的主轴。</td>
      <td><a href="${DND_RANGER_2024_RULES_URL}" rel="noreferrer noopener">2024 Ranger</a> 给免费施放次数，并在后续等级继续强化 Hunter's Mark。</td>
    </tr>
  </tbody>
</table>

<p>新版 Ranger 很明显把这个法术推到了台前。Favored Enemy 给免费施放次数；13 级 Relentless Hunter 让受伤不会打断你对 Hunter's Mark 的专注；17 级 Precise Hunter 给你对标记目标的攻击 Advantage；20 级 Foe Slayer 把伤害骰从 d6 变成 d10。</p>

<h2 id="worth-casting">什么时候值得施放 Hunter's Mark？</h2>
<p><strong>当一个目标会活得够久、你能连续命中，并且你没有更重要的专注法术时，Hunter's Mark 值得施放。</strong>如果战斗很短、杂兵很多，或者你的构筑每回合都要用 Bonus Action，它就很容易亏节奏。</p>

<table>
  <thead>
    <tr>
      <th>场景</th>
      <th>建议</th>
      <th>原因</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>单体 Boss 或精英怪</strong></td>
      <td>通常值得。</td>
      <td>目标活得够久，能吃到多次命中收益。</td>
    </tr>
    <tr>
      <td><strong>5 级有 Extra Attack 的 Ranger</strong></td>
      <td>经常值得。</td>
      <td>两次攻击更容易把 1d6 伤害打出来。</td>
    </tr>
    <tr>
      <td><strong>很多低血量敌人</strong></td>
      <td>通常不值。</td>
      <td>你会一直花 Bonus Action 转移标记，而不是直接解决威胁。</td>
    </tr>
    <tr>
      <td><strong>双持或附赠动作很忙的构筑</strong></td>
      <td>谨慎。</td>
      <td>Hunter's Mark 会和你的核心输出动作抢同一个 Bonus Action。</td>
    </tr>
    <tr>
      <td><strong>更需要控制、潜行或地形法术</strong></td>
      <td>经常不值。</td>
      <td><em>Pass without Trace</em>、<em>Spike Growth</em>、<em>Entangle</em>、<em>Summon Beast</em> 可能更能决定战斗。</td>
    </tr>
  </tbody>
</table>

<p>粗算一下就很清楚：一次命中的 Hunter's Mark 只有平均 3.5 伤害，还没算命中率。每轮能命中两次时它开始像样，但真正成本不是法术位，而是专注、Bonus Action，以及你没法同时维持的另一个 Ranger 法术。</p>

<h2 id="action-economy">为什么 Hunter's Mark 会变成陷阱？</h2>
<p><strong>当你只是因为习惯而施放 Hunter's Mark，却没有检查专注和 Bonus Action 压力时，它就会变成陷阱。</strong>文章底部的视频讲的是 Hex，但思路可以直接借过来：看似便宜的 1d6 伤害，可能正在偷偷吃掉你最关键的资源。</p>

<ul>
  <li><strong>专注很拥挤。</strong>Ranger 有不少强力选择，比如 <em>Pass without Trace</em>、<em>Spike Growth</em>、<em>Entangle</em>、<em>Silence</em> 和召唤类法术。</li>
  <li><strong>Bonus Action 很拥挤。</strong>转移 Hunter's Mark 会和副手攻击、子职业指令、位移能力、紧急治疗抢动作。</li>
  <li><strong>伤害非常看目标。</strong>被标记敌人如果很快倒地，你几乎没赚到什么。</li>
  <li><strong>挨打会影响专注。</strong>2024 Ranger 到 13 级前，受伤仍可能让 Hunter's Mark 掉线。</li>
</ul>

<p>如果你担心专注检定，先看 <a href="${ZH_DND_CONSTITUTION_PATH}">D&amp;D Constitution 指南</a>。如果你想比较 Ranger 的专注法术选择，<a href="${ZH_DND_DRUID_SPELLS_PATH}">DND druid spells 指南</a>也有参考价值，因为很多自然控制法术会争夺同一个专注位。</p>

<h2 id="common-rulings">DND Hunter's Mark 常见裁定</h2>
<p><strong>Hunter's Mark 的争议通常来自触发词、距离误解，以及它到底是不是显形工具。</strong>这些点提前讲清，桌上就不会每次都停下来翻规则。</p>

<h3>Hunter's Mark 每次命中都触发吗？</h3>
<p><strong>会，只要那次命中符合你使用版本的触发条件。</strong>2014 版是 weapon attack；2024 版是 attack roll。5 级 Ranger 一回合命中两次，就能加两次伤害。</p>

<h3>Hunter's Mark 暴击会翻倍吗？</h3>
<p><strong>多数桌会让 Hunter's Mark 的伤害骰在暴击时翻倍，因为它是这次命中带来的额外伤害。</strong>但不要自动扩展到所有重掷能力。如果某个特性只重掷 weapon damage dice，很多桌不会让它重掷 Hunter's Mark 的骰子。</p>

<h3>Hunter's Mark 能免费换目标吗？</h3>
<p><strong>不能。转移 Hunter's Mark 需要 Bonus Action，而且原来的标记目标必须在法术结束前降到 0 HP。</strong>你不需要花新的法术位，但你确实花了附赠动作。</p>

<h3>目标离开 90 尺，Hunter's Mark 会结束吗？</h3>
<p><strong>不会。90 尺是你选择或转移标记时的距离。</strong>标记生效后，目标离开 90 尺不会自动终止法术。真正关键的是专注、持续时间和转移条件。</p>

<h3>Hunter's Mark 会显形隐形或隐藏目标吗？</h3>
<p><strong>不会。Hunter's Mark 帮你找目标，但不会自动揭示目标。</strong>你在相关 Perception 或 Survival 检定上有 Advantage；隐藏、隐形、掩护、足迹和场景信息仍由 DM 裁定。</p>

<h2 id="vtt-tokens">如何在 VTT Token 上追踪 Hunter's Mark</h2>
<p><strong>最干净的 VTT 做法，是在目标身上放一个明显标记，同时在 Ranger 自己身上放一个专注提醒。</strong>当场上还有召唤物、状态和多种伤害骰时，不要指望大家靠记忆。</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_HUNTERS_MARK_VTT_IMAGE_PATH}"
    alt="dnd hunter's mark VTT Token 标记图，展示带专注提醒的 Ranger Token、被 quarry 标记的目标和转移路径"
    width="1400"
    height="933"
    loading="lazy"
    decoding="async"
  />
  <figcaption>目标标记和 Ranger 专注提醒要分开。前者告诉大家伤害打在哪里，后者提醒桌面：这个法术仍然可能因为专注中断而消失。</figcaption>
</figure>

<ul>
  <li><strong>用高对比目标环。</strong>琥珀色、青绿色或白色，比暗地图上的小图标更清楚。</li>
  <li><strong>把专注提醒放在 Ranger token 上。</strong>只标目标不够，因为真正会断的是施法者的专注。</li>
  <li><strong>做成可复用标记。</strong>一个 quarry ring 或角标，可以反复用于怪物、Boss 和追逐场景。</li>
  <li><strong>不要挡住怪物主体。</strong>标记放在头像或底座周围，别盖住关键轮廓。</li>
  <li><strong>整场战役统一标记语言。</strong>Hunter's Mark、Hex 和诅咒如果长得太像，玩家很快会搞不清是哪一个 1d6。</li>
</ul>

<p>你可以在 <a href="${ZH_EDITOR_PATH}">Token Maker 编辑器</a>里做一个清晰的 Ranger 头像，或者给被标记目标做一个高对比边框。如果想测试伤害收益，打开 <a href="${ZH_DICE_ROLLER_PATH}">D&amp;D 骰子工具</a>，比较一次命中、两次命中和错过 Bonus Action 的差距。更大的角色规划可以从 <a href="${ZH_DND_CLASSES_PATH}">DND 职业指南</a>开始，或者参考 <a href="${ZH_DND_MAGE_ARMOR_PATH}">DND Mage Armor</a> 这类法术指南的判定方式。</p>

<h2 id="cheat-sheet">玩家和 DM 速用话术</h2>
<p><strong>跑 Hunter's Mark 最省事的方法，是每次都用同一套桌面话术。</strong>这样它就不会在战斗中途变成一次规则检索。</p>

<table>
  <thead>
    <tr>
      <th>时机</th>
      <th>桌上可以这样说</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>施放</strong></td>
      <td>“Bonus Action：我标记那个我能看见的生物，并开始专注。”</td>
    </tr>
    <tr>
      <td><strong>命中</strong></td>
      <td>“这次攻击命中，所以我加 Hunter's Mark 伤害。”</td>
    </tr>
    <tr>
      <td><strong>目标倒地</strong></td>
      <td>“标记目标到了 0 HP；法术结束前，我可以用 Bonus Action 转移标记。”</td>
    </tr>
    <tr>
      <td><strong>Ranger 受伤</strong></td>
      <td>“我需要做 concentration save，除非我的特性阻止这次伤害打断 Hunter's Mark。”</td>
    </tr>
    <tr>
      <td><strong>目标隐藏</strong></td>
      <td>“Hunter's Mark 不会自动显形，但我寻找它的检定有 Advantage。”</td>
    </tr>
  </tbody>
</table>

<h2 id="faq">DND Hunter's Mark FAQ</h2>
<h3>Hunter's Mark 需要 Concentration 吗？</h3>
<p>需要。<strong>Hunter's Mark 是专注法术</strong>，最多持续 1 小时，除非某个明确特性改变它的专注规则。</p>

<h3>Hunter's Mark 每次命中都能加伤害吗？</h3>
<p>它会在每次符合触发条件的命中上加伤害。2014 版是 weapon attack；2024 版是 attack roll 命中。</p>

<h3>目标降到 0 HP 后能转移 Hunter's Mark 吗？</h3>
<p>可以。被标记目标在法术结束前降到 0 HP 后，你可以花 Bonus Action，把标记转移到距离内另一个你能看见的生物。</p>

<h3>Hunter's Mark 会暴露目标位置吗？</h3>
<p>不会。Hunter's Mark 只让你寻找目标的检定有 Advantage，不会自动让隐形或隐藏目标显形。</p>

<h3>Hunter's Mark 升环值得吗？</h3>
<p>通常只有你真的需要跨多个场景维持时才值得。Hunter's Mark 升环延长专注时长，但不会提高 1d6 伤害。</p>

<h2 id="video">视频：为什么 Hex 陷阱也适用于 Hunter's Mark</h2>
<p>表格里的视频是 <a href="${DND_HUNTERS_MARK_VIDEO_URL}" rel="noreferrer noopener">Hex is a trap in D&amp;D 5E - Advanced guide to Hex</a>。它不是 Hunter's Mark 教程，但思路很值得借用：<strong>小额伤害加骰看起来像白送，实际却可能在消耗专注和 Bonus Action</strong>。所以不要见到每个哥布林都本能标记，先看这场战斗是否真的需要。</p>

${liteVideoEmbed('JwINRY1eD7M', 'Hex is a trap in D&D 5E - Advanced guide to Hex', {
  src: DND_HUNTERS_MARK_VIDEO_PLACEHOLDER_PATH,
  alt: "dnd hunter's mark 指南的视频 webp 占位封面，展示紫色 Hex 符文和金色 Hunter's Mark quarry 符文在月夜网格地图上对照",
})}
`;
