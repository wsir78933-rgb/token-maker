import {
  DND_2024_PLAYING_THE_GAME_URL,
  DND_MONK_2024_RULES_URL,
  DND_POLEARM_MASTER_2024_RULES_URL,
  DND_QUARTERSTAFF_2014_RULES_URL,
  DND_QUARTERSTAFF_2024_RULES_URL,
  DND_SHILLELAGH_2024_RULES_URL,
  EN_DND_GLAIVE_PATH,
  EN_EDITOR_PATH,
  ZH_DND_GLAIVE_PATH,
  ZH_EDITOR_PATH,
} from './shared';

export const dndQuarterstaffArticleHtml = String.raw`
<p>A <strong>dnd quarterstaff</strong> is a Simple Melee weapon that costs 2 SP, weighs 4 lb., and deals 1d6 Bludgeoning damage in one hand or 1d8 when a melee attack uses two hands. In the 2024 rules, its mastery property is Topple. It does not have Finesse, Reach, Light, or Thrown.</p>

<p>That short stat line hides the real choice. A quarterstaff changes jobs according to the hand you keep free, the ability your character can attack with, and who acts after you knock a target Prone.</p>

<h2>Decide what the other hand is doing</h2>
<p>Choose the hand setup before the attack. The Versatile property changes the weapon die; it does not give two separate weapons or extra reach.</p>

<ul>
  <li><strong>Shield in the other hand:</strong> use the 1d6 weapon die. You cannot use that shield hand to make the same attack two-handed.</li>
  <li><strong>Other hand free:</strong> use two hands for 1d8 when the larger die is worth more than keeping the hand available.</li>
  <li><strong>Holding another object:</strong> resolve that object's hand requirements first. A torch, grapple, spell component, or magic item can matter more than one step of weapon damage.</li>
</ul>

<p>The average jump from 1d6 to 1d8 is one point before modifiers. A shield, an open hand, or a class feature can easily be worth more than that point. Treat Versatile as a turn-by-turn equipment decision, not an instruction to hold the staff with two hands all day.</p>

<aside class="article-callout"><strong>Using 2014 rules?</strong> Keep the same 2 SP cost, 4 lb. weight, 1d6 Bludgeoning damage, and Versatile (1d8) property. Ignore Topple unless your table has deliberately imported 2024 Weapon Mastery.</aside>

<h2>Use the attack ability your feature actually allows</h2>
<p>Start with Strength. Add your Proficiency Bonus to the attack roll when you are proficient with Simple weapons or specifically with the quarterstaff, then add the same Strength modifier to damage on a hit.</p>

<p>Change that ability only when a rule says you can:</p>

<ul>
  <li><strong>2024 Monk:</strong> a quarterstaff is a Simple Melee weapon, so it is a Monk weapon. Martial Arts can use Dexterity for its attack and damage rolls and can replace the normal weapon die with the Martial Arts die. Those benefits require you to follow the feature's armor, Shield, and weapon limits.</li>
  <li><strong>2024 Shillelagh:</strong> cast it on a Club or Quarterstaff you are holding. For one minute, melee attacks with that weapon can use your spellcasting ability instead of Strength. Its damage die starts at d8, can deal Force or the normal damage type, and scales at character levels 5, 11, and 17. The spell ends early if you let go of the weapon or cast it again.</li>
  <li><strong>No enabling feature:</strong> the quarterstaff is not Finesse. A high Dexterity score does not replace Strength by itself.</li>
</ul>

<p>Write the active attack line on the character sheet or VTT action: ability, attack bonus, damage die, damage type, and any mastery. That prevents a normal Strength attack, a Monk attack, and a Shillelagh attack from being mixed into one imaginary version.</p>

<h2>Let Topple set the party order</h2>
<p>Topple matters only if your character has a feature that lets you use the quarterstaff's mastery property. When you hit a creature, Topple can force a Constitution saving throw. The DC is 8 + the ability modifier used for the attack roll + your Proficiency Bonus. On a failure, the target gains the Prone condition.</p>

<p>Do not stop at “the target falls.” Read the initiative order:</p>

<ol>
  <li><strong>Attack before nearby melee allies.</strong> Their attacks against a Prone target have Advantage when they are within 5 feet.</li>
  <li><strong>Check ranged allies.</strong> Attacks against a Prone target from farther than 5 feet have Disadvantage, so knocking it down immediately before the archer can make the party worse.</li>
  <li><strong>Count the target's next move.</strong> Standing costs half its Speed. A target that needs to cross the room may lose much of its turn even when nobody makes another melee attack.</li>
</ol>

<p>A failed Constitution save is not guaranteed. Use Topple where the team benefits from both possible results: a successful save still leaves weapon damage, while a failed save improves the next decision.</p>

<h2>Run three different quarterstaff turns</h2>

<h3>The shield controller</h3>
<p>Keep the staff in one hand, accept the 1d6 die, and use Topple before a melee ally acts. This turn values defense and party position over the single larger die. It works best when another character can immediately exploit Prone.</p>

<h3>The Monk skirmisher</h3>
<p>Use Dexterity through Martial Arts, move into the angle you want, strike with the quarterstaff, then decide whether the Bonus Action belongs to an Unarmed Strike or another Monk option. A shield would shut off the Martial Arts benefits, so the shield-controller setup is a different character plan, not a second mode for the same turn.</p>

<h3>The Shillelagh caster</h3>
<p>Use a Bonus Action to empower the staff, then attack with your spellcasting ability when your action economy allows it. If you also have Polearm Master, the setup turn has a real conflict: Shillelagh and Pole Strike both want your Bonus Action. Cast first when the longer fight justifies it; do not write both Bonus Actions into the same turn.</p>

<h2>Add Polearm Master only when the Bonus Action is free</h2>
<p>The 2024 Polearm Master feat can add a d4 Bludgeoning Pole Strike after you take the Attack action and attack with a Quarterstaff. It also gives a Reactive Strike when a creature enters the reach you have with the weapon. A quarterstaff still lacks Reach, so the weapon normally controls 5 feet, not 10.</p>

<p>Before taking the feat, list every existing Bonus Action and Reaction on the character. Monk attacks, Shillelagh setup, class resources, defensive reactions, and magic items can crowd the same turn. Polearm Master is useful when those actions are genuinely open; the weapon name alone does not make the feat efficient.</p>

<h2>Choose a quarterstaff for the job it can keep</h2>
<ul>
  <li>Choose a <strong>quarterstaff</strong> for cheap Simple-weapon access, Bludgeoning damage, Topple, Monk compatibility, or Shillelagh.</li>
  <li>Choose a <strong>spear</strong> when a thrown option matters more than Bludgeoning damage or Shillelagh.</li>
  <li>Choose a <strong>glaive or halberd</strong> when you want a Heavy, Reach, Two-Handed weapon and your character has Martial weapon proficiency.</li>
  <li>Choose a <strong>shield setup</strong> when defense matters more than moving the quarterstaff die from d6 to d8.</li>
</ul>

<p>For the heavy-reach branch, compare the <a href="${EN_DND_GLAIVE_PATH}">DND glaive guide</a>. Do not borrow its 10-foot reach or Heavy interactions for a quarterstaff; the two weapons share a feat connection, not the same stat line.</p>

<h2>Show the grip on a VTT token</h2>
<p>A quarterstaff token needs the hand position to survive a small crop. Keep both hands visible for a two-handed striker. For a staff-and-shield build, show the shield edge and one clear staff grip. For a Shillelagh caster, use a restrained natural or Force effect around the wood without hiding the weapon silhouette.</p>

<ul>
  <li>Angle the staff diagonally so it remains visible inside a round token mask.</li>
  <li>Keep the staff ends inside the source image; a tight portrait crop can turn it into an unexplained wooden line.</li>
  <li>Use one Prone marker on the target instead of painting a permanent Topple effect onto the attacker.</li>
  <li>Test the finished token at map size, not only in the full-resolution preview.</li>
</ul>

<p>Open the <a href="${EN_EDITOR_PATH}">Token Maker editor</a>, place the character's hands near the center of the crop, then zoom out until the staff still reads as a weapon. The image should tell the table whether this is a two-handed striker, a shield controller, a Monk, or a spellcasting staff user before anyone opens the sheet.</p>

<p>A quarterstaff earns its place when the whole turn supports it. Decide what the other hand is doing, use only the attack ability your rules grant, Topple for the next ally rather than for its own sake, and spend feats only when the action economy has room.</p>

<h2>Reference sources</h2>
<ul>
  <li><a href="${DND_QUARTERSTAFF_2024_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond: Quarterstaff, current Basic Rules</a></li>
  <li><a href="${DND_QUARTERSTAFF_2014_RULES_URL}" rel="noreferrer noopener">Roll20 Compendium: Quarterstaff, Free Basic Rules (2014)</a></li>
  <li><a href="${DND_MONK_2024_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond: Monk Martial Arts, 2024 Basic Rules</a></li>
  <li><a href="${DND_SHILLELAGH_2024_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond: Shillelagh, 2024</a></li>
  <li><a href="${DND_POLEARM_MASTER_2024_RULES_URL}" rel="noreferrer noopener">Roll20 Compendium: Polearm Master, 2024</a></li>
  <li><a href="${DND_2024_PLAYING_THE_GAME_URL}" rel="noreferrer noopener">D&amp;D Beyond: Playing the Game, 2024 Basic Rules</a></li>
</ul>
`;

export const dndQuarterstaffArticleHtmlZh = String.raw`
<p><strong>DND 长棍（quarterstaff）</strong>是简易近战武器，价格 2 SP，重量 4 磅。单手攻击造成 1d6 钝击伤害；一次近战攻击用双手握持时，改用 1d8。2024 规则给它 Topple 武器掌握。它没有 Finesse、Reach、Light 或 Thrown。</p>

<p>真正要选的不是 d6 还是 d8。长棍会随着另一只手的用途、角色能使用的攻击属性，以及击倒目标后谁接着行动而改变工作。</p>

<h2>先决定另一只手要做什么</h2>
<p>攻击前先定持握方式。Versatile 只改变武器伤害骰，不会把一根长棍变成两把武器，也不会增加触及距离。</p>

<ul>
  <li><strong>另一只手持盾：</strong>使用 1d6 武器骰。你不能同时拿盾，又让同一次攻击算双手握持。</li>
  <li><strong>另一只手空着：</strong>当较大的伤害骰比空手用途更重要时，用双手打 1d8。</li>
  <li><strong>另一只手拿着物品：</strong>先处理该物品的手部要求。火把、擒抱、法术组件或魔法物品，常常比武器骰提高一级更重要。</li>
</ul>

<p>1d6 到 1d8 的平均差距只有 1 点，还没计算属性调整值。盾牌、空手或职业特性很容易比这 1 点更值钱。把 Versatile 当成每回合的装备选择，不要默认角色整天都必须双手持棍。</p>

<aside class="article-callout"><strong>使用 2014 规则？</strong> 保留 2 SP、4 磅、1d6 钝击和 Versatile (1d8)。除非桌上明确引入 2024 Weapon Mastery，否则不要加 Topple。</aside>

<h2>只使用特性真正允许的攻击属性</h2>
<p>默认使用力量。角色熟练简易武器或明确熟练长棍时，把熟练加值加入攻击检定；命中后，再把同一个力量调整值加入伤害。</p>

<p>只有规则明确允许时，才换攻击属性：</p>

<ul>
  <li><strong>2024 武僧（Monk）：</strong>长棍是简易近战武器，所以属于 Monk weapon。Martial Arts 可以让攻击和伤害使用敏捷，也能用 Martial Arts die 替换正常武器骰。你仍要遵守该特性对护甲、盾牌和武器的限制。</li>
  <li><strong>2024 橡棍术（Shillelagh）：</strong>对手中持有的 Club 或 Quarterstaff 施放。持续一分钟时，近战攻击可以用施法属性代替力量；伤害骰从 d8 开始，可选 Force 或武器正常伤害类型，并在角色等级 5、11、17 提升。松开武器或再次施放会让法术提前结束。</li>
  <li><strong>没有对应特性：</strong>长棍不是 Finesse 武器。敏捷高不会自动取代力量。</li>
</ul>

<p>在角色卡或 VTT 动作上写清当前攻击行：使用属性、攻击加值、伤害骰、伤害类型和武器掌握。这样就不会把普通力量攻击、Monk 攻击和 Shillelagh 攻击拼成一个不存在的版本。</p>

<h2>让 Topple 决定队伍出手顺序</h2>
<p>角色必须有能使用长棍武器掌握的特性，Topple 才会生效。命中生物后，Topple 可以迫使它进行 Constitution 豁免，DC 等于 8 + 本次攻击所用属性调整值 + 熟练加值。失败时，目标获得 Prone 状态。</p>

<p>不要停在“目标倒地”。继续看先攻顺序：</p>

<ol>
  <li><strong>尽量在近战盟友之前攻击。</strong>他们站在倒地目标 5 尺内攻击时会获得 Advantage。</li>
  <li><strong>先看远程盟友的位置。</strong>从 5 尺外攻击 Prone 目标会有 Disadvantage；如果弓手紧接着行动，立刻击倒目标反而会拖累队伍。</li>
  <li><strong>计算目标下一次移动。</strong>起身要花费一半 Speed。即使没有近战盟友补刀，需要穿过房间的目标也可能因此损失大半回合。</li>
</ol>

<p>Constitution 豁免不一定失败。把 Topple 用在两种结果都能接受的位置：成功豁免时仍有武器伤害，失败时则改善队伍下一步。</p>

<h2>跑三种不同的长棍回合</h2>

<h3>持盾控制者</h3>
<p>单手持棍，接受 1d6，在近战盟友行动前尝试 Topple。这个回合用单次较小伤害换防御和队伍站位；下一名角色能立刻利用 Prone 时最划算。</p>

<h3>武僧游斗者</h3>
<p>通过 Martial Arts 使用敏捷，先移动到需要的角度，再用长棍攻击，然后决定 Bonus Action 是留给 Unarmed Strike 还是其他 Monk 选项。持盾会关闭 Martial Arts 的这些收益，所以“持盾控制”是另一套角色方案，不是同一回合的第二模式。</p>

<h3>Shillelagh 施法者</h3>
<p>先用 Bonus Action 强化长棍，在行动经济允许时用施法属性攻击。若角色还有 Polearm Master，准备回合会出现真实冲突：Shillelagh 和 Pole Strike 都要 Bonus Action。长战斗值得时先施法，不要把两个 Bonus Action 写进同一回合。</p>

<h2>只有 Bonus Action 空闲时才加 Polearm Master</h2>
<p>2024 Polearm Master 可以在你采取 Attack action 并用 Quarterstaff 攻击后，通过 Bonus Action 做一次 d4 钝击 Pole Strike；当生物进入这把武器的触及范围时，还能进行 Reactive Strike。长棍仍然没有 Reach，因此通常控制 5 尺，不是 10 尺。</p>

<p>选择专长前，把角色已有的 Bonus Action 和 Reaction 全部列出来。Monk 攻击、Shillelagh 准备、职业资源、防御反应和魔法物品都可能争同一个回合。只有这些动作真的空闲时，Polearm Master 才实用；武器名称本身不会自动让专长变高效。</p>

<h2>按能长期承担的工作选择长棍</h2>
<ul>
  <li>需要便宜的简易武器、钝击伤害、Topple、Monk 适配或 Shillelagh 时，选 <strong>Quarterstaff</strong>。</li>
  <li>远程投掷比钝击或 Shillelagh 更重要时，选 <strong>Spear</strong>。</li>
  <li>角色有军用武器熟练，而且需要 Heavy、Reach、Two-Handed 时，选 <strong>Glaive 或 Halberd</strong>。</li>
  <li>防御比把长棍伤害骰从 d6 提到 d8 更重要时，选 <strong>长棍加盾牌</strong>。</li>
</ul>

<p>需要重型长触及路线时，可以对照 <a href="${ZH_DND_GLAIVE_PATH}">DND 长柄刀（Glaive）指南</a>。不要把它的 10 尺 Reach 或 Heavy 互动借给长棍；两者都能连接某些长柄武器规则，但数据行不同。</p>

<h2>在 VTT Token 上画清持握方式</h2>
<p>长棍 Token 缩小后，手部位置仍要看得清。双手攻击者要保留两只手；持盾方案要同时露出盾牌边缘和一处明确握棍动作；Shillelagh 施法者可以给木材加克制的自然或 Force 效果，但不要遮住武器轮廓。</p>

<ul>
  <li>让长棍斜穿画面，圆形 Token 裁切后更容易保留。</li>
  <li>原图里要保住棍的两端；裁得太紧，只会剩下一条来历不明的木线。</li>
  <li>把 Prone 标记放在目标身上，不要给攻击者永久画上 Topple 特效。</li>
  <li>按地图上的实际尺寸检查成品，不要只看全分辨率预览。</li>
</ul>

<p>打开 <a href="${ZH_EDITOR_PATH}">Token Maker 编辑器</a>，把角色双手放在裁切中心附近，再缩小检查长棍是否仍像一把武器。玩家不用打开角色卡，也应该先看出这是双手攻击者、持盾控制者、Monk，还是施法长棍使用者。</p>

<p>整套回合支持它时，长棍才真正合适。先决定另一只手的工作，只用规则授予的攻击属性，为下一名盟友使用 Topple，并且只在行动经济有空间时投入专长。</p>

<h2>参考来源</h2>
<ul>
  <li><a href="${DND_QUARTERSTAFF_2024_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond：Quarterstaff，当前 Basic Rules</a></li>
  <li><a href="${DND_QUARTERSTAFF_2014_RULES_URL}" rel="noreferrer noopener">Roll20 Compendium：Quarterstaff，Free Basic Rules (2014)</a></li>
  <li><a href="${DND_MONK_2024_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond：Monk Martial Arts，2024 Basic Rules</a></li>
  <li><a href="${DND_SHILLELAGH_2024_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond：Shillelagh，2024</a></li>
  <li><a href="${DND_POLEARM_MASTER_2024_RULES_URL}" rel="noreferrer noopener">Roll20 Compendium：Polearm Master，2024</a></li>
  <li><a href="${DND_2024_PLAYING_THE_GAME_URL}" rel="noreferrer noopener">D&amp;D Beyond：Playing the Game，2024 Basic Rules</a></li>
</ul>
`;
