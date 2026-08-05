import {
  DND_2024_EQUIPMENT_URL,
  DND_2024_FEATS_URL,
  DND_2024_RULES_GLOSSARY_URL,
  DND_MAUL_2014_RULES_URL,
  DND_MAUL_2024_RULES_URL,
  DND_MAUL_VIDEO_URL,
  EN_DND_GLAIVE_PATH,
  EN_DND_MACE_PATH,
  EN_DND_QUARTERSTAFF_PATH,
  EN_EDITOR_PATH,
  ZH_DND_GLAIVE_PATH,
  ZH_DND_MACE_PATH,
  ZH_DND_QUARTERSTAFF_PATH,
  ZH_EDITOR_PATH,
  liteVideoEmbed,
} from './shared';

export const dndMaulArticleHtml = String.raw`
<p>A <strong>dnd maul</strong> is a Martial Melee weapon that costs 10 GP, weighs 10 lb., and deals 2d6 Bludgeoning damage. In the 2024 rules, it has the Heavy and Two-Handed properties plus the Topple mastery property. Before you put it on the character sheet, check whether the character can attack with it cleanly and whether knocking a target Prone helps the next turn on the initiative track.</p>

<p>The maul is strongest when its first solid hit changes the rest of the round. Its damage does not need a combo, but Topple does: you need the right character, a useful target, and someone ready to exploit the result.</p>

<h2>Pass three gates before you equip a maul</h2>
<p>Do these checks before comparing feats or damage averages:</p>

<ol>
  <li><strong>Martial weapon proficiency:</strong> anyone can swing a maul, but only a proficient attacker adds their Proficiency Bonus to the attack roll. Check the proficiency line on the character sheet instead of assuming every Strength build has it.</li>
  <li><strong>Strength 13 for the 2024 Heavy property:</strong> a melee Heavy weapon gives you Disadvantage on its attack rolls when your Strength score is below 13. A different attack ability does not remove that Strength threshold.</li>
  <li><strong>Two hands for the attack:</strong> the maul requires two hands when you attack with it. A shield cannot stay in one hand during that attack.</li>
</ol>

<p>If one gate fails, fix it before building around Topple. Proficiency controls the attack bonus, Strength controls the 2024 Heavy penalty, and the hand requirement changes your defensive setup.</p>

<aside class="article-callout"><strong>Using 2014 rules?</strong> Keep the 10 GP cost, 10 lb. weight, 2d6 Bludgeoning damage, Heavy property, and Two-Handed property. Do not add Topple unless the table has deliberately adopted 2024 Weapon Mastery. The 2014 Heavy property penalizes Small creatures; the 2024 property uses the Strength 13 threshold for Heavy melee weapons.</aside>

<h2>Choose the target before you promise Topple</h2>
<p>Topple is optional after a hit. Use it when the Prone condition improves the next real action, not simply because the maul lists the property.</p>

<ul>
  <li><strong>You still have melee attacks:</strong> try Topple on the first hit. If the target fails, later attacks from within 5 feet gain Advantage.</li>
  <li><strong>A melee ally acts next:</strong> hand that ally a Prone target while the opening is still useful.</li>
  <li><strong>Ranged allies act before the target:</strong> read the order first. Their attacks from beyond 5 feet have Disadvantage against a Prone target.</li>
  <li><strong>The target needs its movement:</strong> standing costs movement equal to half its Speed. A target that must cross the room can lose much of its turn even if nobody makes another melee attack.</li>
</ul>

<p>Do not announce the whole combo before the first d20. Name the target, check who acts after you, then decide whether a failed Constitution save would help that sequence.</p>

<h2>Resolve one maul hit in one clean sequence</h2>
<p>Keep the weapon attack and the mastery effect in this order:</p>

<ol>
  <li>Roll the maul attack with the correct attack modifier. Add the Proficiency Bonus only if the attacker is proficient.</li>
  <li>On a hit, roll 2d6 Bludgeoning damage and add the applicable ability modifier.</li>
  <li>If the character has unlocked the maul's Topple mastery, decide whether to use it.</li>
  <li>The target makes a Constitution saving throw against DC 8 + the ability modifier used for the attack roll + the attacker's Proficiency Bonus.</li>
  <li>On a failed save, apply the Prone condition. On a success, keep the weapon damage and continue the turn.</li>
</ol>

<p>Topple belongs to the weapon only when a feature lets the character use that mastery property. Proficiency with the maul does not unlock Topple by itself.</p>

<h2>Use the first hit to set up the next action</h2>
<p>A Prone target attacks with Disadvantage. Attacks against it have Advantage when the attacker is within 5 feet; attacks from farther away have Disadvantage. That makes the next actor more important than the label on the weapon.</p>

<p>After the save fails, say the handoff out loud: “Prone; my next melee attack has Advantage,” or “Prone; the Paladin is next.” If the archer is next, say that too. The short call gives the table enough information to change plans before another roll starts.</p>

<p>If the creature is already Prone, another Topple attempt adds nothing. Spend the attention on the next attack, the target's route, or a different mastery weapon instead.</p>

<h2>Watch Topple inside the 2024 Weapon Mastery system</h2>
<p>GameMasters covers every 2024 mastery property in one sequence. Jump to <a href="${DND_MAUL_VIDEO_URL}&amp;t=367s" rel="noreferrer noopener">6:07 for Topple</a>, then compare its save-and-Prone flow with the maul turn above.</p>

${liteVideoEmbed('z1W7G1MMPBI', 'Weapon Mastery Ultimate Guide with Topple at 6:07')}

<h2>Keep a useful turn when the save succeeds</h2>
<p>A successful Constitution save does not erase the maul hit. The target still takes 2d6 Bludgeoning damage plus the applicable modifier. Build the turn so that Topple improves a hit rather than rescuing a weak plan.</p>

<p>The 2024 Great Weapon Fighting style also fits the maul's two d6 damage dice: when its requirements apply, each 1 or 2 on a damage die can be treated as a 3. Record that rule beside the damage line if the character has the fighting style. Do not apply it merely because the weapon is Heavy.</p>

<p>Against a target with a strong Constitution save or a trait that prevents Prone, the maul still supplies direct Bludgeoning damage. Check the stat block, then decide whether another weapon job would give the party more.</p>

<h2>Switch weapons when the job changes</h2>
<p>Choose the maul for Topple, not because every large weapon does the same thing.</p>

<ul>
  <li><strong>Maul:</strong> 2d6 Bludgeoning, Heavy, Two-Handed, and Topple. Use it when a Prone result can improve nearby melee turns or drain movement.</li>
  <li><strong>Greatsword:</strong> 2d6 Slashing with Graze. Use it when damage on a miss matters more than a Constitution save.</li>
  <li><strong>Greataxe:</strong> 1d12 Slashing with Cleave. Use it when a second nearby creature makes the extra attack relevant.</li>
  <li><strong>Glaive:</strong> 1d10 Slashing with Reach and Graze. Use it when controlling space from 10 feet matters more than the maul's larger dice and Topple.</li>
  <li><strong>Warhammer:</strong> one-handed 1d8 or two-handed 1d10 Bludgeoning with Push. Use it when a shield or forced movement is part of the plan.</li>
</ul>

<p>For the reach branch, use the <a href="${EN_DND_GLAIVE_PATH}">DND glaive guide</a>. For a one-handed Bludgeoning weapon, compare the <a href="${EN_DND_MACE_PATH}">DND mace guide</a>. A <a href="${EN_DND_QUARTERSTAFF_PATH}">quarterstaff</a> is the flexible Simple-weapon option when Monk rules, Shillelagh, or a shield matters more than 2d6 damage.</p>

<h2>Write a five-line maul turn card</h2>
<p>Put this beside the weapon action on paper or in the VTT:</p>

<ol>
  <li><strong>Target:</strong> the creature whose position or movement matters this round.</li>
  <li><strong>Attack:</strong> d20 + the maul attack modifier, with the Heavy check already resolved.</li>
  <li><strong>Damage:</strong> 2d6 Bludgeoning + the applicable modifier.</li>
  <li><strong>Topple:</strong> Constitution save DC 8 + attack ability modifier + Proficiency Bonus.</li>
  <li><strong>Handoff:</strong> name the next melee attack, ranged attack, or movement consequence.</li>
</ol>

<p>The card keeps proficiency, Heavy, damage, Topple, and Prone from collapsing into one vague “big hammer” action. It also gives the next player a result they can use immediately.</p>

<h2>Make the maul impact readable on a VTT token</h2>
<p>A maul needs a broad head, a visible two-handed grip, and a clear downswing. Keep the hammer head inside the crop and place both hands near the center. A vertical handle disappearing through the token edge can look like a staff; a wide head and offset grip keep the weapon readable at map size.</p>

<ul>
  <li>Angle the maul across the portrait instead of placing the full handle straight up.</li>
  <li>Leave space below the hammer head so the impact direction is clear.</li>
  <li>Use a separate Prone marker on the target. Do not bake a permanent knocked-down enemy into the attacker's portrait.</li>
  <li>Test the finished token beside a normal Medium creature token before export.</li>
</ul>

<p>Open the <a href="${EN_EDITOR_PATH}">Token Maker editor</a>, center the hands and hammer head, then zoom out until both still read inside the round frame. The final token should show a two-handed impact weapon before anyone opens the character sheet.</p>

<p>A maul turn is ready when the character passes all three equipment gates and the player can name who benefits after Topple. Hit for 2d6, ask for the Constitution save only when the mastery is unlocked, then hand the Prone result to the next useful action.</p>

<h2>Reference sources</h2>
<ul>
  <li><a href="${DND_MAUL_2024_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond: Maul, current Basic Rules</a></li>
  <li><a href="${DND_2024_EQUIPMENT_URL}" rel="noreferrer noopener">D&amp;D Beyond Basic Rules: Equipment, Heavy, Two-Handed, and Topple</a></li>
  <li><a href="${DND_2024_RULES_GLOSSARY_URL}" rel="noreferrer noopener">D&amp;D Beyond Basic Rules: Prone condition</a></li>
  <li><a href="${DND_2024_FEATS_URL}" rel="noreferrer noopener">D&amp;D Beyond Basic Rules: Great Weapon Fighting</a></li>
  <li><a href="${DND_MAUL_2014_RULES_URL}" rel="noreferrer noopener">Roll20 Compendium: Maul, Free Basic Rules (2014)</a></li>
</ul>
`;

export const dndMaulArticleHtmlZh = String.raw`
<p><strong>DND 巨锤（maul）</strong>是军用近战武器，价格 10 GP，重量 10 磅，造成 2d6 Bludgeoning 伤害。2024 规则中的巨锤带有 Heavy、Two-Handed 和 Topple。把它写进角色卡前，先确认角色能稳定命中，再看把目标打成 Prone 是否真的能帮到先攻表上的下一个行动。</p>

<p>巨锤最强的回合，是第一次扎实命中改变了整轮后续。2d6 伤害不依赖连招，但 Topple 需要正确的角色、值得击倒的目标，以及能利用结果的下一步。</p>

<h2>装备巨锤前先过三道门槛</h2>
<p>比较专长或伤害均值前，先做这三项检查：</p>

<ol>
  <li><strong>军用武器熟练：</strong>任何角色都能挥巨锤，但只有熟练的攻击者才能把 Proficiency Bonus 加到攻击掷骰。直接看角色卡的熟练项，不要默认所有力量构筑都会军用武器。</li>
  <li><strong>2024 Heavy 要求力量 13：</strong>力量低于 13 时，使用 Heavy 近战武器进行攻击会带 Disadvantage。即使某项特性允许改用其他攻击属性，也不会自动删除这条力量门槛。</li>
  <li><strong>攻击时需要双手：</strong>巨锤在攻击时要求两只手。进行这次攻击时，另一只手不能继续拿盾。</li>
</ol>

<p>只要有一道没过，就先修正那一项，再谈 Topple。熟练决定攻击加值，力量决定 2024 Heavy 惩罚，双手要求则会改变防御配置。</p>

<aside class="article-callout"><strong>使用 2014 规则？</strong>继续使用 10 GP、10 磅、2d6 Bludgeoning、Heavy 和 Two-Handed。除非桌上明确引入 2024 Weapon Mastery，否则不要加 Topple。2014 Heavy 会让 Small 生物攻击时带 Disadvantage；2024 Heavy 改为检查 Heavy 近战武器使用者是否有至少 13 力量。</aside>

<h2>承诺 Topple 前先挑对目标</h2>
<p>命中后可以选择是否使用 Topple。只有 Prone 能改善下一个真实行动时才用，不要只因为武器栏里写着这个词就自动触发。</p>

<ul>
  <li><strong>你还有近战攻击：</strong>第一次命中就尝试 Topple。目标失败后，5 尺内的后续攻击会有 Advantage。</li>
  <li><strong>近战队友紧接着行动：</strong>趁窗口还在，把一个 Prone 目标交给那名队友。</li>
  <li><strong>远程队友会先于目标行动：</strong>先看顺序。距离 Prone 目标超过 5 尺的攻击会有 Disadvantage。</li>
  <li><strong>目标下一回合需要移动：</strong>站起来要花等于一半 Speed 的移动。即使没人继续近战攻击，一个必须穿过房间的目标也会损失大量移动。</li>
</ul>

<p>第一次 d20 还没掷，就别把整套连招说死。先说目标，再看谁会接着行动，最后判断 Constitution 豁免失败能否帮到这条行动顺序。</p>

<h2>按固定顺序结算一次巨锤命中</h2>
<p>把武器攻击和掌握效果按这个顺序处理：</p>

<ol>
  <li>使用正确的攻击修正掷巨锤攻击。只有熟练时才加入 Proficiency Bonus。</li>
  <li>命中后掷 2d6 Bludgeoning 伤害，再加适用的属性调整值。</li>
  <li>若角色已经解锁巨锤的 Topple 掌握，决定是否使用。</li>
  <li>目标进行 Constitution 豁免，DC = 8 + 本次攻击使用的属性调整值 + 攻击者的 Proficiency Bonus。</li>
  <li>失败就让目标进入 Prone；成功则保留武器伤害并继续回合。</li>
</ol>

<p>只有特性允许角色使用这项武器掌握时，Topple 才会生效。仅仅熟练巨锤，并不会自动解锁 Topple。</p>

<h2>用第一次命中安排下一个动作</h2>
<p>Prone 目标自己的攻击带 Disadvantage。攻击者在 5 尺内攻击它时有 Advantage；距离超过 5 尺时反而有 Disadvantage。所以下一个行动者，比武器名字更值得关注。</p>

<p>目标豁免失败后，直接说清交接：“Prone，我下一次近战攻击有 Advantage。”或者“Prone，下一位是 Paladin。”若下一位是弓手，也说出来。这个短提醒能让全桌在下一次掷骰前调整计划。</p>

<p>目标已经 Prone 时，再用一次 Topple 不会叠加任何效果。把注意力放在后续攻击、目标路线，或者另一把能承担不同工作的掌握武器上。</p>

<h2>在 2024 Weapon Mastery 体系里看 Topple</h2>
<p>GameMasters 用一个视频依次讲解 2024 的各项武器掌握。直接跳到 <a href="${DND_MAUL_VIDEO_URL}&amp;t=367s" rel="noreferrer noopener">6:07 的 Topple</a>，再把其中的豁免与 Prone 流程对照上面的巨锤回合。</p>

${liteVideoEmbed('z1W7G1MMPBI', '2024 Weapon Mastery 视频，Topple 位于 6:07')}

<h2>目标豁免成功时也要有完整回合</h2>
<p>Constitution 豁免成功不会抹掉巨锤命中。目标仍会承受 2d6 Bludgeoning 加适用调整值。让 Topple 成为一次命中的额外收益，不要让整个回合只有在目标倒地时才成立。</p>

<p>2024 Great Weapon Fighting 也适合巨锤的两颗 d6：满足该战斗风格的条件时，每颗伤害骰掷出 1 或 2 都可以按 3 处理。角色拥有这项战斗风格时，把规则写在伤害栏旁边。不要只因为武器是 Heavy 就自动使用。</p>

<p>遇到 Constitution 豁免很强，或有特性阻止 Prone 的目标，巨锤仍能提供直接 Bludgeoning 伤害。查看数据块，再判断队伍是否更需要另一种武器工作。</p>

<h2>工作改变时就换武器</h2>
<p>选择巨锤是为了 Topple，不是因为所有大型武器都做同一件事。</p>

<ul>
  <li><strong>巨锤（Maul）：</strong>2d6 Bludgeoning、Heavy、Two-Handed、Topple。需要 Prone 帮助近战队友或消耗目标移动时使用。</li>
  <li><strong>巨剑（Greatsword）：</strong>2d6 Slashing 和 Graze。未命中时仍需要稳定伤害，就选它。</li>
  <li><strong>巨斧（Greataxe）：</strong>1d12 Slashing 和 Cleave。附近有第二个目标，可以实际利用额外攻击时使用。</li>
  <li><strong>长柄刀（Glaive）：</strong>1d10 Slashing、Reach 和 Graze。10 尺空间控制比巨锤较大的伤害骰和 Topple 更重要时使用。</li>
  <li><strong>战锤（Warhammer）：</strong>单手 1d8 或双手 1d10 Bludgeoning，带 Push。构筑需要盾牌或强制位移时使用。</li>
</ul>

<p>需要 Reach 时看 <a href="${ZH_DND_GLAIVE_PATH}">DND 长柄刀指南</a>；需要单手 Bludgeoning 武器时对照 <a href="${ZH_DND_MACE_PATH}">DND 钉头锤指南</a>。若 Monk、Shillelagh 或盾牌比 2d6 伤害更重要，<a href="${ZH_DND_QUARTERSTAFF_PATH}">长棍</a>是更灵活的简易武器选择。</p>

<h2>写一张五行巨锤回合卡</h2>
<p>把这五行放在纸面武器栏或 VTT 动作旁边：</p>

<ol>
  <li><strong>目标：</strong>这一轮位置或移动最重要的生物。</li>
  <li><strong>攻击：</strong>d20 + 巨锤攻击修正，并提前处理 Heavy 检查。</li>
  <li><strong>伤害：</strong>2d6 Bludgeoning + 适用调整值。</li>
  <li><strong>Topple：</strong>Constitution 豁免 DC = 8 + 攻击属性调整值 + Proficiency Bonus。</li>
  <li><strong>交接：</strong>说出接下来的近战攻击、远程攻击或移动后果。</li>
</ol>

<p>这张卡不会让熟练、Heavy、伤害、Topple 和 Prone 全挤成一个含糊的“大锤攻击”。下一位玩家也能立刻拿到可以行动的结果。</p>

<h2>让巨锤冲击在 VTT Token 上读得出来</h2>
<p>巨锤需要宽锤头、清楚的双手握法和明确的下砸方向。让锤头留在裁切内，并把双手放在画面中心附近。若竖直锤柄直接穿出 Token 边缘，它很容易看成长棍；宽锤头和错开的握手位置能让武器在地图尺寸下保持可读。</p>

<ul>
  <li>让巨锤斜穿头像，不要把整根锤柄笔直竖起来。</li>
  <li>在锤头下方留一点空间，冲击方向才会清楚。</li>
  <li>给目标单独放 Prone 标记，不要把永久倒地的敌人画进攻击者头像。</li>
  <li>导出前，把成品放到普通 Medium 生物 Token 旁边检查。</li>
</ul>

<p>打开 <a href="${ZH_EDITOR_PATH}">Token Maker 编辑器</a>，让双手和锤头靠近中心，再缩小检查两者是否仍能在圆形边框内辨认。玩家打开角色卡前，就应该看出这是双手冲击武器。</p>

<p>角色通过三道装备门槛，并且玩家能说清 Topple 后谁会受益时，这个巨锤回合就准备好了。命中造成 2d6；只有解锁武器掌握时才要求 Constitution 豁免；目标倒地后，把结果交给下一个真正有用的动作。</p>

<h2>参考来源</h2>
<ul>
  <li><a href="${DND_MAUL_2024_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond：Maul，当前基础规则</a></li>
  <li><a href="${DND_2024_EQUIPMENT_URL}" rel="noreferrer noopener">D&amp;D Beyond 基础规则：Equipment、Heavy、Two-Handed 与 Topple</a></li>
  <li><a href="${DND_2024_RULES_GLOSSARY_URL}" rel="noreferrer noopener">D&amp;D Beyond 基础规则：Prone 状态</a></li>
  <li><a href="${DND_2024_FEATS_URL}" rel="noreferrer noopener">D&amp;D Beyond 基础规则：Great Weapon Fighting</a></li>
  <li><a href="${DND_MAUL_2014_RULES_URL}" rel="noreferrer noopener">Roll20 Compendium：Maul，Free Basic Rules（2014）</a></li>
</ul>
`;
