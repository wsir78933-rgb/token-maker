import {
  DND_2014_SPELLCASTING_COMPONENTS_URL,
  DND_2024_SPELLCASTING_COMPONENTS_URL,
  DND_BLESS_2014_RULES_URL,
  DND_BLESS_2024_RULES_URL,
  DND_BLESS_VIDEO_PLACEHOLDER_PATH,
  DND_BLESS_VIDEO_URL,
  DND_HOLY_SYMBOL_2024_URL,
  EN_DICE_ROLLER_PATH,
  EN_DND_BARD_SPELLS_PATH,
  EN_DND_CONSTITUTION_PATH,
  EN_DND_COUNTERSPELL_PATH,
  EN_DND_RANGER_SPELLS_PATH,
  EN_EDITOR_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_BARD_SPELLS_PATH,
  ZH_DND_CONSTITUTION_PATH,
  ZH_DND_COUNTERSPELL_PATH,
  ZH_DND_RANGER_SPELLS_PATH,
  ZH_EDITOR_PATH,
  liteVideoEmbed,
} from './shared';

export const dndBlessArticleHtml = String.raw`
<p><strong>dnd bless</strong> raises a few table questions: does the d4 apply once, does it add to damage, and did the 2024 rules make the holy symbol disappear every time you cast it?</p>

<p>Short version: Bless is still one of the cleanest 1st-level support spells in DnD. It is not flashy. It does not roll damage. It just makes important d20 rolls less likely to miss by one or two points, which is often the difference between a wasted turn and a fight staying under control.</p>

<h2 id="quick-answer">Quick answer: what does Bless do in DnD?</h2>
<p><strong>Bless is a level 1 Enchantment spell that lets up to three creatures add 1d4 to attack rolls and saving throws while the caster maintains concentration, up to 1 minute.</strong></p>

<p>In play, that means each blessed target can add the d4 whenever that target makes an attack roll or a saving throw before the spell ends. It is not limited to one use. It is not once per turn. It does not add to damage rolls, Armor Class, initiative, ability checks, or normal skill checks.</p>

<p>At higher spell slots, Bless does not increase the die. It adds one more target per slot level above 1.</p>

<p>If you want to show the bonus before the first combat round, open the <a href="${EN_DICE_ROLLER_PATH}">DnD dice roller</a> and keep a visible d4 beside the d20. The habit matters more than the math.</p>

<h2 id="stats-table">Bless stats table</h2>
<table>
  <thead>
    <tr>
      <th>Rule</th>
      <th>2014 Basic Rules</th>
      <th>2024 Free Rules</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Level</strong></td>
      <td>1st-level Enchantment</td>
      <td>Level 1 Enchantment</td>
    </tr>
    <tr>
      <td><strong>Classes</strong></td>
      <td>Cleric, Paladin</td>
      <td>Cleric, Paladin</td>
    </tr>
    <tr>
      <td><strong>Casting time</strong></td>
      <td>1 action</td>
      <td>Action</td>
    </tr>
    <tr>
      <td><strong>Range</strong></td>
      <td>30 feet</td>
      <td>30 feet</td>
    </tr>
    <tr>
      <td><strong>Components</strong></td>
      <td>V, S, M, a sprinkling of holy water</td>
      <td>V, S, M, a Holy Symbol worth 5+ GP</td>
    </tr>
    <tr>
      <td><strong>Duration</strong></td>
      <td>Concentration, up to 1 minute</td>
      <td>Concentration, up to 1 minute</td>
    </tr>
    <tr>
      <td><strong>Base targets</strong></td>
      <td>Up to three creatures</td>
      <td>Up to three creatures</td>
    </tr>
    <tr>
      <td><strong>Benefit</strong></td>
      <td>Add 1d4 to attack rolls and saving throws</td>
      <td>Add 1d4 to attack rolls and saves</td>
    </tr>
    <tr>
      <td><strong>Upcast</strong></td>
      <td>One additional target per slot level above 1st</td>
      <td>One additional target per slot level above 1</td>
    </tr>
  </tbody>
</table>

<p>The official entries are the <a href="${DND_BLESS_2014_RULES_URL}" rel="noreferrer noopener">2014 Bless spell</a> and the <a href="${DND_BLESS_2024_RULES_URL}" rel="noreferrer noopener">2024 Bless spell</a>. The rules that matter at the table are mostly the same: three targets, 30 feet, concentration, 1 minute, attack rolls, saving throws, and a d4. The visible 2024 change is the material component.</p>

<h2 id="rules-versions">2014 vs 2024 Bless rules</h2>
<p>The 2014 Bless component is a sprinkling of holy water. The 2024 Bless component is a holy symbol worth 5+ GP. That change matters for character sheets because a 2024 caster needs the listed component, and a component with a cost deserves a real line on the sheet.</p>

<p>It does not mean the holy symbol is consumed on every cast. The 2024 spell component rules say material components are not consumed unless the spell says they are consumed, and Bless does not say that. A Cleric should have the holy symbol. The Cleric should not need a pile of disposable holy symbols unless the DM is using a house rule.</p>

<p>The same logic existed in the 2014 spellcasting rules: if a material component has a cost, the caster needs that component; if the spell consumes it, the spell says so. Bless names holy water in 2014 but does not say it consumes the component.</p>

<h2 id="what-bless-helps">What Bless helps, and what it does not help</h2>
<p>Bless helps attack rolls. Weapon attacks, spell attacks, and other attacks that call for an attack roll can benefit if the blessed target is making the attack.</p>

<p>Bless helps saving throws. That includes the big saves people remember, such as Wisdom saves against control and Dexterity saves against area damage. It also includes death saving throws, because those are saving throws.</p>

<p><strong>Bless does not add 1d4 to damage rolls.</strong> If the Fighter hits, Bless helped the d20 attack roll. It does not add damage.</p>

<p><strong>Bless does not add to ability checks.</strong> It does not add to Stealth, Persuasion, Athletics, Perception, initiative, or counterspell ability checks.</p>

<p>Bless does not help Armor Class. If the party wants a creature harder to hit, that is Shield of Faith territory, not Bless.</p>

<p>Bless does not stack with another Bless on the same target. If two casters put Bless on the same ally, the target does not roll two d4s.</p>

<h2 id="target-priority">Who should receive Bless first?</h2>
<p>Bless is strongest on characters who will roll attacks often or who cannot afford to fail saving throws. I usually start with these targets.</p>

<table>
  <thead>
    <tr>
      <th>Target</th>
      <th>Why it works</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Frontline damage dealer</strong></td>
      <td>They make repeated attack rolls and often eat saving throws.</td>
    </tr>
    <tr>
      <td><strong>Archer or ranged attacker</strong></td>
      <td>They get frequent attacks while staying safer than the caster.</td>
    </tr>
    <tr>
      <td><strong>Paladin or melee Cleric</strong></td>
      <td>They attack, save often, and may protect concentration lines.</td>
    </tr>
    <tr>
      <td><strong>Concentrating caster</strong></td>
      <td>They value saving throws, especially Constitution saves to keep a spell running.</td>
    </tr>
    <tr>
      <td><strong>Low-save character facing control</strong></td>
      <td>Bless can keep one failed save from turning into a lost fight.</td>
    </tr>
  </tbody>
</table>

<p>The trap is blessing the characters who feel important but will not roll the relevant d20s. If the Wizard plans to cast save-based spells all fight, Bless may not help that Wizard much unless the party expects heavy incoming saves.</p>

<h2 id="party-examples">Target priority by party type</h2>
<p>For a weapon-heavy party, Bless is easy. Put it on the people who attack every round. A Fighter, Ranger, Rogue, Paladin, Monk, or Warlock using attack rolls can turn that d4 into repeated value.</p>

<p>For a caster-heavy party, Bless is more defensive. Put it on whoever is holding concentration and whoever is likely to eat dangerous saves. If most of the party is forcing enemies to make saving throws, Bless will not improve those offensive spells.</p>

<p>For a fragile low-level party, Bless often beats a small damage spell. Three characters adding d4s to attacks and saves for up to ten rounds can prevent more trouble than one early damage roll.</p>

<p>For a boss fight, Bless gets better when the party expects repeated attack rolls or ugly saving throws. It gets weaker if the fight is short, the party is spread out beyond 30 feet, or the caster is likely to lose concentration before allies benefit.</p>

<h2 id="spell-comparisons">Bless vs Bane, Shield of Faith, and Guidance</h2>
<p>Bless and Bane look like opposites, but they do different jobs. Bless does not require enemies to fail a save. If your three targets are in range, the spell works. Bane can be excellent when it lands, but enemies get a Charisma save.</p>

<p>Shield of Faith is narrower and more defensive. It gives one creature +2 AC and also takes concentration. If one ally is being attacked over and over, Shield of Faith may be right. If the party needs attack and save insurance across three creatures, Bless is usually the cleaner pick.</p>

<p>Guidance is not Bless for every roll. Guidance helps one ability check, depending on rules version and table handling. Bless helps attack rolls and saving throws for the duration. The two spells get confused because both involve a d4, but they do not cover the same rolls.</p>

<h2 id="mistakes">Common Bless mistakes</h2>
<h3>Treating Bless as one use</h3>
<p>Bless lasts while concentration holds. The d4 applies whenever a blessed target makes an attack roll or saving throw before the spell ends.</p>

<h3>Adding the d4 to damage</h3>
<p>Bless helps the attack roll that decides whether the attack hits. It does not add damage.</p>

<h3>Adding the d4 to ability checks</h3>
<p>Bless does not help Stealth, Persuasion, Perception, initiative, or most tool checks.</p>

<h3>Forgetting concentration</h3>
<p>The caster can lose Bless after taking damage, becoming incapacitated, dying, or casting another concentration spell.</p>

<h3>Stacking two Bless spells</h3>
<p>Same-spell effects do not combine into extra dice on one target.</p>

<h3>Ignoring range at the moment of casting</h3>
<p>Targets need to be within range when Bless is cast. After that, the spell text does not say they need to stay within 30 feet.</p>

<h2 id="vtt-workflow">VTT and token tracking workflow</h2>
<p>Bless is easy to run at a physical table because people can put a d4 next to their character sheet. Online, it gets forgotten unless the map shows it.</p>

<p>For Roll20, Foundry VTT, Owlbear, or any map-based table, I would make three visible markers:</p>

<ul>
  <li>A gold or white ring for blessed allies.</li>
  <li>A small d4 label on each blessed token.</li>
  <li>A separate concentration marker on the caster.</li>
</ul>

<p>That last marker matters. If the Cleric casts Spirit Guardians later, Bless is gone. If the Paladin takes a big hit and fails the concentration save, Bless is gone. The caster marker keeps everyone honest without stopping the fight for a rules audit.</p>

<p>You can use the <a href="${EN_EDITOR_PATH}">Token Maker editor</a> to create a blessed version of important PC or NPC tokens before a session. Keep the base portrait readable, then add a bright ring, label, or border that still works at battle-map size. Export the marker as a transparent PNG, drop it into the VTT, and keep the normal token nearby for when the spell ends.</p>

<p>For the d4 itself, use the <a href="${EN_DICE_ROLLER_PATH}">DnD dice roller</a> when you want to practice the pattern: roll d20, add the normal modifier, then add d4 only if the roll is an attack roll or saving throw from a blessed target.</p>

<h2 id="table-examples">Table examples</h2>
<p><strong>Example 1:</strong> A Cleric blesses the Fighter, Rogue, and Paladin before the party rushes a hard target. The Fighter and Paladin use the d4 on attacks. The Rogue uses it on the one attack that matters. If the enemy casts a fear effect, all three can also use it on the save.</p>

<p><strong>Example 2:</strong> A Paladin blesses the Ranger, Warlock, and Paladin. The Ranger and Warlock make repeated attack rolls from range, while the Paladin stays near the front. That is a strong Bless because the spell starts paying off before enemies can break concentration.</p>

<p><strong>Example 3:</strong> A Cleric blesses the Wizard, Bard, and Druid, but all three spend the fight casting spells that force enemy saving throws. Bless may still help defensively, but it is not improving those offensive spells.</p>

<h2 id="related-guides">Related spell and rules guides</h2>
<p>If you are choosing concentration spells for a character, compare Bless with the <a href="${EN_DND_RANGER_SPELLS_PATH}">DND Ranger spells guide</a>, <a href="${EN_DND_BARD_SPELLS_PATH}">DND Bard spells guide</a>, <a href="${EN_DND_COUNTERSPELL_PATH}">DND Counterspell guide</a>, and <a href="${EN_DND_CONSTITUTION_PATH}">DND Constitution guide</a>. The pattern is simple: one concentration slot, one table job, one visible marker.</p>

<h2 id="sources">Rules sources</h2>
<ul>
  <li><a href="${DND_BLESS_2014_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond 2014 Basic Rules, Bless</a></li>
  <li><a href="${DND_BLESS_2024_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond 2024 Free Rules, Bless</a></li>
  <li><a href="${DND_2014_SPELLCASTING_COMPONENTS_URL}" rel="noreferrer noopener">D&amp;D Beyond 2014 Basic Rules, Spellcasting Components</a></li>
  <li><a href="${DND_2024_SPELLCASTING_COMPONENTS_URL}" rel="noreferrer noopener">D&amp;D Beyond 2024 Free Rules, Spell Components</a></li>
  <li><a href="${DND_HOLY_SYMBOL_2024_URL}" rel="noreferrer noopener">D&amp;D Beyond, Holy Symbol equipment</a></li>
</ul>

<h2 id="faq">Bless DnD FAQ</h2>
<h3>Does Bless add to damage?</h3>
<p>No. Bless adds 1d4 to attack rolls and saving throws. It does not add to damage rolls.</p>

<h3>Does Bless work on every attack?</h3>
<p>Yes, as long as the blessed target is making an attack roll before the spell ends and the caster is still concentrating. It is not once per turn.</p>

<h3>Does Bless help saving throws?</h3>
<p>Yes. Bless helps saving throws, including high-stakes saves against control and damage. Death saving throws are saving throws, so Bless can help there too.</p>

<h3>Does Bless help ability checks?</h3>
<p>No. Bless does not help ability checks such as Stealth, Persuasion, Perception, Athletics, initiative, or counterspell checks.</p>

<h3>Does Bless stack with another Bless?</h3>
<p>No. Multiple castings of the same spell do not give the same target multiple Bless dice.</p>

<h3>Is the 2024 holy symbol consumed by Bless?</h3>
<p>No. The 2024 Bless component is a holy symbol worth 5+ GP, but the spell does not say it consumes the component.</p>

<h3>Who can cast Bless?</h3>
<p>In the official 2014 and 2024 rules, Bless appears for Cleric and Paladin.</p>

<h2 id="video">Bless DnD companion video</h2>
<p>The <a href="${DND_BLESS_VIDEO_URL}" rel="noreferrer noopener">Bless and Bane companion video</a> is useful as an optimization perspective after the rules are clear. Treat official rules as the source of truth, then use the video for tactics and target choices.</p>

${liteVideoEmbed('IPOddAMdy5k', 'Bless is INSANE in D&D 5e! - Advanced Guide to Bless and Bane', {
  src: DND_BLESS_VIDEO_PLACEHOLDER_PATH,
  alt: 'Clickable webp video cover for a dnd bless guide with golden Bless magic, ally tokens, a d4, and a holy symbol on a VTT map',
})}
`;

export const dndBlessArticleHtmlZh = String.raw`
<p><strong>dnd bless</strong> 有三个需要马上确认的规则：这个 d4 能不能每次都加？能不能加伤害？2024 版写了 5+ GP holy symbol，是不是每次施法都会消耗一个圣徽？</p>

<p>简短答案：祝福术（Bless）仍然是 DnD 里最稳定的一环支援法术之一。它不炫，也不直接造成伤害。它只是让关键 d20 更少差一两点失败，而这种差距经常决定一回合有没有白过。</p>

<h2 id="quick-answer">速查：DnD 里的祝福术（Bless）做什么？</h2>
<p><strong>祝福术（Bless）是 1 环附魔法术（Enchantment），基础施法可以让最多三个生物在施法者保持专注（Concentration）、最多 1 分钟内，把 1d4 加到攻击检定（attack roll）和豁免（saving throw）上。</strong></p>

<p>实战里，只要受祝福术影响的目标在法术结束前进行攻击检定或豁免，就可以加这个 d4。它不是一次性效果。不是每回合一次。它也不会加到伤害、AC、先攻、属性检定或普通技能检定上。</p>

<p>升环施放时，祝福术不会把 d4 变大，而是每比 1 环高一环，多影响一个目标。</p>

<p>如果想在第一轮战斗前把手感跑顺，可以打开 <a href="${ZH_DICE_ROLLER_PATH}">DND 骰子工具</a>，把 d20 和 d4 放在同一个流程里。重点不是算得多复杂，而是别忘了这个 d4。</p>

<h2 id="stats-table">祝福术（Bless）数据表</h2>
<table>
  <thead>
    <tr>
      <th>规则</th>
      <th>2014 基础规则</th>
      <th>2024 免费规则</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>环级</strong></td>
      <td>1 环 Enchantment</td>
      <td>1 环 Enchantment</td>
    </tr>
    <tr>
      <td><strong>职业</strong></td>
      <td>Cleric、Paladin</td>
      <td>Cleric、Paladin</td>
    </tr>
    <tr>
      <td><strong>施法时间</strong></td>
      <td>1 action</td>
      <td>Action</td>
    </tr>
    <tr>
      <td><strong>距离</strong></td>
      <td>30 尺</td>
      <td>30 尺</td>
    </tr>
    <tr>
      <td><strong>组件</strong></td>
      <td>V、S、M，一点 holy water</td>
      <td>V、S、M，价值 5+ GP 的 Holy Symbol</td>
    </tr>
    <tr>
      <td><strong>持续时间</strong></td>
      <td>专注，最多 1 分钟</td>
      <td>专注，最多 1 分钟</td>
    </tr>
    <tr>
      <td><strong>基础目标</strong></td>
      <td>最多三个生物</td>
      <td>最多三个生物</td>
    </tr>
    <tr>
      <td><strong>效果</strong></td>
      <td>攻击检定和豁免加 1d4</td>
      <td>攻击检定和豁免加 1d4</td>
    </tr>
    <tr>
      <td><strong>升环</strong></td>
      <td>每高于 1 环一环，多一个目标</td>
      <td>每高于 1 环一环，多一个目标</td>
    </tr>
  </tbody>
</table>

<p>官方条目可以看 <a href="${DND_BLESS_2014_RULES_URL}" rel="noreferrer noopener">2014 版 Bless</a> 和 <a href="${DND_BLESS_2024_RULES_URL}" rel="noreferrer noopener">2024 版 Bless</a>。桌上真正要记的是这些：三个目标、30 尺、专注、1 分钟、攻击检定、豁免、d4。2024 版最明显的变化是材料组件。</p>

<h2 id="rules-versions">2014 vs 2024 祝福术（Bless）规则差异</h2>
<p>2014 版祝福术的材料组件是一点 holy water。2024 版祝福术的材料组件变成价值 5+ GP 的 Holy Symbol。这个改动会影响角色卡，因为 2024 版有价格的材料组件应该真实写在装备里。</p>

<p>但这不代表 Holy Symbol 每次都会被消耗。2024 版施法组件规则说，材料组件只有在法术说明写明会被消耗时才会被消耗，而祝福术没有写会消耗。Cleric 应该有一个符合要求的 Holy Symbol，但不应该因为每次施放祝福术就损失一个，除非 DM 明确采用房规。</p>

<p>2014 版的组件逻辑也类似：有价格的材料组件需要实际提供；如果法术会消耗组件，法术会明说。2014 Bless 写了 holy water，但没有写会消耗。</p>

<h2 id="what-bless-helps">祝福术加什么，不加什么？</h2>
<p>祝福术加攻击检定。武器攻击、法术攻击，以及其他明确要求攻击检定的攻击，只要是受祝福术影响的目标自己在掷，就可以受益。</p>

<p>祝福术加豁免。常见例子包括对抗控制的 Wisdom save、对抗范围伤害的 Dexterity save。Death saving throw 也是 saving throw，所以祝福术也能帮到。</p>

<p><strong>祝福术不会把 1d4 加到伤害上。</strong> Fighter 命中时，祝福术帮的是决定有没有命中的 d20，不会额外加 1d4 伤害。</p>

<p><strong>祝福术不加属性检定。</strong> Stealth、Persuasion、Athletics、Perception、先攻和 counterspell 的属性检定都不是祝福术的范围。</p>

<p>祝福术不加 AC。如果你想让某个目标更难被打中，那更接近 Shield of Faith 的用途，不是祝福术。</p>

<p>祝福术不和另一个祝福术叠加。同一个目标身上有两个 Bless，也不会得到两个 d4。</p>

<h2 id="target-priority">祝福术应该先给谁？</h2>
<p>祝福术最适合给会频繁攻击，或不能失败关键豁免的人。我通常按这个顺序看目标。</p>

<table>
  <thead>
    <tr>
      <th>目标</th>
      <th>为什么适合</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>前排输出</strong></td>
      <td>会反复攻击，也经常吃豁免。</td>
    </tr>
    <tr>
      <td><strong>弓手或远程攻击者</strong></td>
      <td>攻击次数稳定，而且比施法者更不容易被打断。</td>
    </tr>
    <tr>
      <td><strong>Paladin 或近战 Cleric</strong></td>
      <td>会攻击，也经常需要扛豁免。</td>
    </tr>
    <tr>
      <td><strong>正在专注的施法者</strong></td>
      <td>很在意豁免，尤其是保持法术的 Constitution save。</td>
    </tr>
    <tr>
      <td><strong>低豁免但即将吃控制的人</strong></td>
      <td>一个 d4 可能直接避免整场战斗失控。</td>
    </tr>
  </tbody>
</table>

<p>不要只按“谁最重要”来给。要看这个角色接下来会不会掷攻击检定或豁免。如果 Wizard 接下来全程都在放让敌人做豁免的法术，祝福术不会提高那些法术的成功率。</p>

<h2 id="party-examples">按队伍类型选择祝福术目标</h2>
<p>武器输出多的队伍最简单。把祝福术给每回合都会攻击的人。Fighter、Ranger、Rogue、Paladin、Monk，或者用攻击检定的 Warlock，都会把这个 d4 用得很实在。</p>

<p>施法者多的队伍里，祝福术更偏防守。优先给正在保持专注的人，或者最可能吃危险豁免的人。如果队伍主要通过让敌人做豁免来输出，祝福术不会增强这些进攻法术。</p>

<p>低等级脆皮队伍里，祝福术经常比一个小伤害法术更稳。三个角色在最多十轮里攻击和豁免加 d4，能减少很多“差一点失败”的情况。</p>

<p>Boss 战里，祝福术在两种情况下更强：队伍会反复做攻击检定，或 Boss 会频繁逼玩家做危险豁免。相反，如果战斗很短、队伍一开始就散得很开，或者施法者很容易立刻掉专注，祝福术的价值会下降。</p>

<h2 id="spell-comparisons">祝福术、Bane、Shield of Faith 和 Guidance 怎么选？</h2>
<p>祝福术和 Bane 看起来像正反面，但实际用途不一样。祝福术不需要敌人先豁免失败。只要三个目标在施法距离内，法术就能生效。Bane 命中后也很强，但敌人可以做 Charisma save。</p>

<p>Shield of Faith 更窄，也更偏防守。它给一个生物 +2 AC，同时也需要专注。如果只有一个前排正在被疯狂集火，Shield of Faith 可能更对题。如果队伍需要三个角色同时获得攻击和豁免保险，Bless 通常更顺。</p>

<p>Guidance 不是“所有掷骰版祝福术”。Guidance 处理的是一次属性检定，具体按你使用的规则版本执行。祝福术处理的是攻击检定和豁免，并且持续到法术结束或专注中断。它们都和 d4 有关，但覆盖的掷骰不同。</p>

<h2 id="mistakes">常见祝福术误区</h2>
<h3>把祝福术当一次性效果</h3>
<p>祝福术在专注保持期间持续生效。受影响目标每次进行攻击检定或豁免时都可以用。</p>

<h3>把 d4 加到伤害上</h3>
<p>祝福术帮的是命中前的攻击检定，不加伤害。</p>

<h3>把 d4 加到属性检定上</h3>
<p>祝福术不加 Stealth、Persuasion、Perception、先攻或大多数工具检定。</p>

<h3>忘记专注</h3>
<p>施法者受到伤害、陷入 Incapacitated、死亡，或施放另一个专注法术，都可能让祝福术结束。</p>

<h3>两个祝福术叠加</h3>
<p>同一个法术的多个效果不会让同一目标拿到多个 Bless 骰。</p>

<h3>忽略施法瞬间的距离</h3>
<p>施法时目标需要在 30 尺内。之后法术说明没有要求他们一直留在 30 尺内。</p>

<h2 id="vtt-workflow">VTT 和 Token 标记流程</h2>
<p>实体桌上，祝福术很好记：把一个 d4 放在角色卡旁边就行。线上地图不一样，如果 token 上没标记，玩家很容易忘。</p>

<p>在 Roll20、Foundry VTT、Owlbear 或其他地图桌上，我建议准备三个视觉标记：</p>

<ul>
  <li>给受祝福术影响的盟友加金色或白色光环。</li>
  <li>在 token 上放一个小 d4 标签。</li>
  <li>给施法者单独加一个专注标记。</li>
</ul>

<p>第三个最容易被忽视，但最重要。Cleric 后面如果改放 Spirit Guardians，祝福术就没了。Paladin 如果被重击并且专注豁免失败，祝福术也没了。把专注标在施法者身上，可以少停下来查规则。</p>

<p>你可以用 <a href="${ZH_EDITOR_PATH}">Token Maker 编辑器</a> 提前做一套祝福状态 token。保留角色头像的辨识度，再加一个亮色圆环、标签或边框，导出透明 PNG 后放进 VTT。法术结束时，再换回普通 token。</p>

<p>d4 这部分，可以用 <a href="${ZH_DICE_ROLLER_PATH}">DND 骰子工具</a> 练习流程：先掷 d20，加正常调整值，只有在受祝福术影响的目标进行攻击检定或豁免时才加 d4。</p>

<h2 id="table-examples">桌上例子</h2>
<p><strong>例子 1：</strong>Cleric 给 Fighter、Rogue 和 Paladin 上祝福术，然后队伍冲一个高威胁目标。Fighter 和 Paladin 会多次攻击，Rogue 那一次攻击也很关键。如果敌人施放恐惧类效果，这三个人还可以在豁免上加 d4。</p>

<p><strong>例子 2：</strong>Paladin 给 Ranger、Warlock 和自己上祝福术。Ranger 和 Warlock 从远处持续做攻击检定，Paladin 在前排承压。只要 Paladin 能保住专注，这个祝福术很快就开始回本。</p>

<p><strong>例子 3：</strong>Cleric 给 Wizard、Bard 和 Druid 上祝福术，但三个人整场都在放让敌人做豁免的法术。祝福术仍然可能在防守上有价值，但不会提高这些进攻法术的成功率。</p>

<h2 id="related-guides">相关法术和规则指南</h2>
<p>如果你是在给角色挑专注法术，可以继续看 <a href="${ZH_DND_RANGER_SPELLS_PATH}">DND 游侠法术指南</a>、<a href="${ZH_DND_BARD_SPELLS_PATH}">DND Bard 法术指南</a>、<a href="${ZH_DND_COUNTERSPELL_PATH}">DND Counterspell 指南</a> 和 <a href="${ZH_DND_CONSTITUTION_PATH}">DND 体质指南</a>。思路很简单：一个专注位，一个桌上任务，一个清楚的地图标记。</p>

<h2 id="sources">规则来源</h2>
<ul>
  <li><a href="${DND_BLESS_2014_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond 2014 Basic Rules, Bless</a></li>
  <li><a href="${DND_BLESS_2024_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond 2024 Free Rules, Bless</a></li>
  <li><a href="${DND_2014_SPELLCASTING_COMPONENTS_URL}" rel="noreferrer noopener">D&amp;D Beyond 2014 Basic Rules, Spellcasting Components</a></li>
  <li><a href="${DND_2024_SPELLCASTING_COMPONENTS_URL}" rel="noreferrer noopener">D&amp;D Beyond 2024 Free Rules, Spell Components</a></li>
  <li><a href="${DND_HOLY_SYMBOL_2024_URL}" rel="noreferrer noopener">D&amp;D Beyond, Holy Symbol equipment</a></li>
</ul>

<h2 id="faq">祝福术（DND Bless）常见问题</h2>
<h3>祝福术会加伤害吗？</h3>
<p>不会。祝福术只把 1d4 加到攻击检定和豁免上，不加伤害。</p>

<h3>祝福术每次攻击都能用吗？</h3>
<p>可以，只要受祝福术影响的目标是在法术结束前进行攻击检定，并且施法者仍在保持专注。它不是每回合一次。</p>

<h3>祝福术能加豁免吗？</h3>
<p>可以。祝福术可以加豁免，包括对抗控制和伤害的关键豁免。Death saving throw 也是 saving throw，所以也能受益。</p>

<h3>祝福术能加属性检定吗？</h3>
<p>不能。祝福术不加 Stealth、Persuasion、Perception、Athletics、先攻或 counterspell 属性检定。</p>

<h3>祝福术可以和另一个祝福术叠加吗？</h3>
<p>不能。同一个法术的多次施放不会让同一个目标获得多个 Bless d4。</p>

<h3>2024 版祝福术的 Holy Symbol 会被消耗吗？</h3>
<p>不会。2024 版祝福术需要价值 5+ GP 的 Holy Symbol，但法术没有写这个组件会被消耗。</p>

<h3>谁能施放祝福术？</h3>
<p>在官方 2014 和 2024 规则中，Bless 出现在 Cleric 和 Paladin 法术里。</p>

<h2 id="video">祝福术（DND Bless）配套视频</h2>
<p>这支 <a href="${DND_BLESS_VIDEO_URL}" rel="noreferrer noopener">Bless 和 Bane 配套视频</a> 更适合当战术观点看，不要把它当规则来源。规则以上面的官方条目为准，视频用来补目标选择和专注取舍。</p>

${liteVideoEmbed('IPOddAMdy5k', '祝福术（DND Bless）配套视频', {
  src: DND_BLESS_VIDEO_PLACEHOLDER_PATH,
  alt: '祝福术（DND Bless）视频 WebP 封面图，金色祝福魔法覆盖盟友 Token、d4 和 Holy Symbol',
})}
`;
