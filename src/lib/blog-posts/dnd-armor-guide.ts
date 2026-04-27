import {
  DND_ARMOR_TYPES_IMAGE_PATH,
  DND_ARMOR_HEAVY_IMAGE_PATH,
  liteVideoEmbed,
} from './shared';

export const dndArmorArticleHtml = String.raw`
<p>Choosing the right <strong>DND armor</strong> might be the single biggest factor in whether your character survives a dungeon crawl or drops in the first round of combat. Armor Class determines how hard you are to hit, and in D&amp;D 5e, every point of AC matters more than most new players realize.</p>

<p>This guide covers every type of <strong>DND armor</strong> available in the 5th Edition rules. Instead of copying the Player's Handbook word for word, it focuses on what each armor option actually means for your character at the table &mdash; the real AC numbers, the tradeoffs, and which classes should wear what.</p>

<h2>What Is Armor Class in DND?</h2>
<p><strong>Armor Class (AC)</strong> is the number an attacker needs to meet or beat on their attack roll to hit you. The higher your AC, the harder you are to hit. Without any armor at all, your base AC is <strong>10 + your Dexterity modifier</strong>.</p>

<p>That formula is the starting point for everything. When you put on <strong>DND armor</strong>, it replaces or modifies that base calculation. Some armor types let you add your full Dexterity bonus, others cap it, and heavy armor ignores Dexterity entirely.</p>

<p>As the video by <em>How It's Played</em> explains clearly, a common beginner mistake is thinking that armor proficiency adds to your AC. <strong>It does not.</strong> Proficiency only means you can wear the armor without suffering penalties to attack rolls, ability checks, saving throws, and spellcasting. The AC number on the armor is what you get regardless of proficiency.</p>

<h2>DND Armor Table: Every Armor Type at a Glance</h2>
<p>If you want the short version, here is the full <strong>DND 5e armor</strong> table with every option and its real AC value.</p>

<h3>Light Armor</h3>
<table>
  <thead>
    <tr><th>Armor</th><th>AC</th><th>Stealth</th><th>Weight</th><th>Cost</th></tr>
  </thead>
  <tbody>
    <tr><td>Padded</td><td>11 + Dex</td><td>Disadvantage</td><td>8 lb</td><td>5 gp</td></tr>
    <tr><td>Leather</td><td>11 + Dex</td><td>&mdash;</td><td>10 lb</td><td>10 gp</td></tr>
    <tr><td>Studded Leather</td><td>12 + Dex</td><td>&mdash;</td><td>13 lb</td><td>45 gp</td></tr>
  </tbody>
</table>

<h3>Medium Armor</h3>
<table>
  <thead>
    <tr><th>Armor</th><th>AC</th><th>Stealth</th><th>Weight</th><th>Cost</th></tr>
  </thead>
  <tbody>
    <tr><td>Hide</td><td>12 + Dex (max 2)</td><td>&mdash;</td><td>12 lb</td><td>10 gp</td></tr>
    <tr><td>Chain Shirt</td><td>13 + Dex (max 2)</td><td>&mdash;</td><td>20 lb</td><td>50 gp</td></tr>
    <tr><td>Scale Mail</td><td>14 + Dex (max 2)</td><td>Disadvantage</td><td>45 lb</td><td>50 gp</td></tr>
    <tr><td>Breastplate</td><td>14 + Dex (max 2)</td><td>&mdash;</td><td>20 lb</td><td>400 gp</td></tr>
    <tr><td>Half Plate</td><td>15 + Dex (max 2)</td><td>Disadvantage</td><td>40 lb</td><td>750 gp</td></tr>
  </tbody>
</table>

<h3>Heavy Armor</h3>
<table>
  <thead>
    <tr><th>Armor</th><th>AC</th><th>Stealth</th><th>Str Req</th><th>Weight</th><th>Cost</th></tr>
  </thead>
  <tbody>
    <tr><td>Ring Mail</td><td>14</td><td>Disadvantage</td><td>&mdash;</td><td>40 lb</td><td>30 gp</td></tr>
    <tr><td>Chain Mail</td><td>16</td><td>Disadvantage</td><td>Str 13</td><td>55 lb</td><td>75 gp</td></tr>
    <tr><td>Splint</td><td>17</td><td>Disadvantage</td><td>Str 15</td><td>60 lb</td><td>200 gp</td></tr>
    <tr><td>Plate</td><td>18</td><td>Disadvantage</td><td>Str 15</td><td>65 lb</td><td>1,500 gp</td></tr>
  </tbody>
</table>

<h3>Shields</h3>
<p>A <strong>shield</strong> adds +2 AC on top of whatever armor you are wearing. It costs 10 gp, weighs 6 lb, and requires one free hand. Any class proficient with shields can use one.</p>

<h2>Light Armor in DND: Best for Dex-Based Characters</h2>
<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_ARMOR_TYPES_IMAGE_PATH}"
    alt="Three types of DND armor displayed on stands in a medieval armory: leather, scale mail, and full plate"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
  />
</figure>
<p><strong>DND light armor</strong> is designed for characters who rely on Dexterity. You add your full Dex modifier to the base AC, which means a Rogue with 20 Dexterity wearing studded leather hits <strong>AC 17</strong> with no shield &mdash; that is solid protection without any stealth penalty.</p>

<p>In my experience running and playing D&amp;D for years, <strong>studded leather is the only light armor that matters long-term.</strong> Padded armor imposes stealth disadvantage for no extra benefit over regular leather, so it is essentially a trap option. Regular leather works fine at level 1 but gets replaced fast.</p>

<ul>
  <li><strong>Best for:</strong> Rogues, Rangers, Bards, Warlocks, Monks (though Monks usually prefer Unarmored Defense).</li>
  <li><strong>Why it works:</strong> no stealth penalty on studded leather, full Dex bonus, and light enough to not slow you down.</li>
  <li><strong>Max realistic AC:</strong> 17 (studded leather + 5 Dex) or 19 with a shield if your class allows it.</li>
</ul>

<h2>Medium Armor in DND: The Versatile Middle Ground</h2>
<p>Medium armor caps your Dexterity bonus at +2, but it provides higher base AC than light options. If your Dex modifier is +2 or lower, medium armor almost always gives you better protection than light armor.</p>

<p>The standout choices here are <strong>breastplate</strong> and <strong>half plate</strong>. Breastplate gives you AC 16 (with +2 Dex) and no stealth disadvantage &mdash; that is the sweet spot for characters who need decent defense without being loud. Half plate pushes to AC 17 but comes with stealth disadvantage.</p>

<ul>
  <li><strong>Best for:</strong> Druids, Rangers, Clerics (some domains), Barbarians (when not using Unarmored Defense), and multiclass builds.</li>
  <li><strong>Pro tip:</strong> breastplate is often overlooked because half plate has higher AC, but if stealth matters at all in your campaign, breastplate is the smarter buy.</li>
  <li><strong>Max realistic AC:</strong> 17 (half plate + 2 Dex) or 19 with a shield.</li>
</ul>

<h2>Heavy Armor in DND: Maximum Protection, Zero Dexterity</h2>
<figure class="inline-figure inline-figure--square-crop">
  <img
    class="inline-figure__image inline-figure__image--square"
    src="${DND_ARMOR_HEAVY_IMAGE_PATH}"
    alt="A paladin in full plate armor holding a shield in a dark dungeon, representing heavy DND armor"
    width="960"
    height="960"
    loading="lazy"
    decoding="async"
  />
</figure>
<p><strong>Heavy armor</strong> ignores your Dexterity modifier completely. Your AC is just the flat number listed. That makes heavy armor perfect for characters who dump Dex and invest everything into Strength, Constitution, and their primary spellcasting stat.</p>

<p>Plate armor at <strong>AC 18</strong> is the highest base AC you can get from standard armor. Add a shield and you are sitting at <strong>AC 20</strong> before any magic items or spells. That is a frontline tank who is genuinely hard to hit.</p>

<p>The catch? <strong>Every heavy armor option imposes stealth disadvantage</strong>, and chain mail and above require a minimum Strength score. If your Strength is below the requirement, your speed drops by 10 feet. Based on our table experience, forgetting about the Strength requirement is one of the most common new-player mistakes with <strong>DND armor</strong>.</p>

<ul>
  <li><strong>Best for:</strong> Fighters, Paladins, and heavy-armor Clerics (Life, War, Forge domains).</li>
  <li><strong>Starting armor note:</strong> Fighters and Paladins typically start with chain mail (AC 16) at level 1. Plate armor at 1,500 gp is usually a mid-campaign purchase.</li>
  <li><strong>Max realistic AC:</strong> 20 (plate + shield) or higher with magic items like <em>+1 plate</em> or <em>Shield of Faith</em> spell.</li>
</ul>

<h2>How to Calculate Armor Class in DND 5e</h2>
<p>AC calculation confuses a lot of beginners because different armor types use different formulas. Here is the simple breakdown:</p>

<ul>
  <li><strong>No armor:</strong> 10 + Dex modifier.</li>
  <li><strong>Light armor:</strong> armor base AC + full Dex modifier.</li>
  <li><strong>Medium armor:</strong> armor base AC + Dex modifier (max +2).</li>
  <li><strong>Heavy armor:</strong> armor base AC only. Dex does not apply.</li>
</ul>

<p>One critical rule that the <em>How It's Played</em> video covers well: <strong>AC bonuses from different sources stack, but you cannot use two AC calculations at the same time.</strong> For example, you cannot wear armor and also use the Monk's Unarmored Defense &mdash; you pick one calculation. But you <em>can</em> add a shield bonus (+2) and a <em>Ring of Protection</em> (+1) on top of your chosen armor calculation.</p>

<h3>Common AC bonus sources</h3>
<ul>
  <li><strong>Shield:</strong> +2 AC.</li>
  <li><strong>Shield spell (Wizard/Sorcerer):</strong> +5 AC as a reaction until next turn.</li>
  <li><strong>Shield of Faith (Cleric/Paladin):</strong> +2 AC, concentration.</li>
  <li><strong>Cover:</strong> half cover +2, three-quarters cover +5.</li>
  <li><strong>Magic items:</strong> +1/+2/+3 armor, Ring of Protection, Cloak of Protection.</li>
</ul>

<h2>Which DND Armor Is Best for Each Class?</h2>
<p>Choosing armor is not just about the highest AC number. It is about matching your defenses to your class abilities, your Dexterity score, and how your character actually plays. Here is what I recommend based on years of table time:</p>

<table>
  <thead>
    <tr><th>Class</th><th>Best Armor</th><th>Notes</th></tr>
  </thead>
  <tbody>
    <tr><td>Fighter</td><td>Heavy + Shield</td><td>Chain mail at Lv1, upgrade to plate ASAP</td></tr>
    <tr><td>Paladin</td><td>Heavy + Shield</td><td>Same as Fighter; aura abilities reward front-line play</td></tr>
    <tr><td>Rogue</td><td>Studded Leather</td><td>Full Dex bonus, no stealth penalty &mdash; non-negotiable</td></tr>
    <tr><td>Ranger</td><td>Studded Leather / Breastplate</td><td>Depends on Dex; Str-based rangers use medium</td></tr>
    <tr><td>Barbarian</td><td>Unarmored Defense</td><td>10 + Dex + Con; chain shirt or breastplate early on</td></tr>
    <tr><td>Cleric</td><td>Heavy or Medium + Shield</td><td>Life / War / Forge = heavy; other domains = medium</td></tr>
    <tr><td>Druid</td><td>Medium + Shield (non-metal)</td><td>Hide armor or non-metal breastplate; ask your DM</td></tr>
    <tr><td>Wizard / Sorcerer</td><td><em>Mage Armor</em> spell</td><td>AC 13 + Dex; <em>Shield</em> spell for emergencies</td></tr>
    <tr><td>Bard</td><td>Studded Leather</td><td>Light armor only unless you multiclass</td></tr>
    <tr><td>Warlock</td><td>Light (or Medium for Hexblade)</td><td>Hexblade gets medium + shield proficiency</td></tr>
    <tr><td>Monk</td><td>No Armor</td><td>10 + Dex + Wis; wearing armor disables Monk features</td></tr>
  </tbody>
</table>

<h2>Mage Armor: The Caster's Alternative to Physical Armor</h2>
<p>Characters without armor proficiency are not defenseless. The <strong><a href="/blog/dnd-classes-explained">Wizard</a></strong> spell <em>Mage Armor</em> sets your base AC to <strong>13 + Dex modifier</strong> and lasts 8 hours without concentration. For a Wizard with 16 Dexterity, that is AC 16 &mdash; better than chain mail.</p>

<p>The tradeoff is that it uses a 1st-level spell slot every day. At low levels that hurts; at higher levels it becomes trivial. If you are playing a squishy caster, <em>Mage Armor</em> is essentially mandatory until you find magical alternatives.</p>

<h2>Common DND Armor Mistakes to Avoid</h2>
<p>After running dozens of campaigns, these are the armor mistakes I see most often:</p>

<ol>
  <li><strong>Thinking proficiency = AC bonus.</strong> It does not. Proficiency just means you avoid penalties.</li>
  <li><strong>Ignoring Strength requirements on heavy armor.</strong> If your Fighter has 12 Strength and wears splint (Str 15 required), you lose 10 feet of movement. That matters.</li>
  <li><strong>Stacking two AC calculations.</strong> You cannot use <em>Mage Armor</em> and then put on a chain shirt. Pick one base calculation.</li>
  <li><strong>Forgetting stealth disadvantage.</strong> Half plate and all heavy armors impose disadvantage on Stealth. If your party relies on sneaking, this affects everyone, not just you.</li>
  <li><strong>Sleeping in heavy armor.</strong> The optional rule in Xanathar's Guide says sleeping in medium or heavy armor means you only recover a quarter of your hit dice and no reduction in exhaustion. Many DMs enforce this.</li>
</ol>

<h2>FAQ About DND Armor</h2>
<h3>What is the best armor in DND 5e?</h3>
<p><strong>Plate armor (AC 18)</strong> is the best standard armor in DND 5e by raw AC value. Combined with a shield, it gives AC 20, which is the highest non-magical armor class available in the base rules.</p>

<h3>Can you wear DND armor without proficiency?</h3>
<p>Yes, you can physically put on any <strong>DND armor</strong>, but wearing armor you are not proficient with gives you disadvantage on all ability checks, saving throws, and attack rolls that use Strength or Dexterity, and you cannot cast spells. In practice, it makes the armor useless.</p>

<h3>Does Dexterity affect heavy armor AC?</h3>
<p>No. <strong>DND heavy armor</strong> uses a flat AC number that does not change with your Dexterity modifier. A Fighter with 8 Dex and a Fighter with 20 Dex have exactly the same AC in plate armor.</p>

<h3>What is the difference between light and medium armor in DND?</h3>
<p><strong>DND light armor</strong> lets you add your full Dexterity modifier to AC, while medium armor caps the Dex bonus at +2. Light armor is better when your Dex is high (+3 or above); medium armor is better when your Dex is moderate (+2 or below).</p>

<h3>Does a shield count as armor in DND?</h3>
<p>A shield is listed in the armor table and requires armor proficiency (shield proficiency specifically), but it is not "armor" for the purpose of features that say "while not wearing armor." It simply adds +2 to your AC on top of your current armor or unarmored calculation.</p>

<h2>Watch This Visual Breakdown of DND Armor and AC</h2>
<p>If you want a clear visual walkthrough of how <strong>DND armor</strong> and Armor Class actually work in play, this video from <em>How It's Played</em> does an excellent job of explaining the mechanics step by step. It covers AC calculation, how different armor types apply Dexterity, and how bonus sources like shields and spells stack.</p>

${liteVideoEmbed('pKxuStjRTxo', 'DND armor and Armor Class explained video')}
`;

export const dndArmorArticleHtmlZh = String.raw`
<p>在《龙与地下城》里，选对 <strong>DND 护甲</strong> 几乎决定了你的角色是能扛住一整场地城探险，还是在第一轮战斗就倒地。护甲等级（AC）代表敌人攻击你有多难命中，而在 D&amp;D 5e 里，每一点 AC 的价值比大多数新手以为的都重要得多。</p>

<p>这篇指南覆盖了第五版规则中每种 <strong>DND 护甲</strong> 类型。它不会照搬《玩家手册》原文，而是专注于每种护甲选项在真实桌面上到底意味着什么 &mdash; 实际 AC 数值、使用代价，以及哪些职业应该穿什么。</p>

<h2>什么是 DND 护甲等级（AC）？</h2>
<p><strong>护甲等级（Armor Class, AC）</strong> 是攻击者需要在攻击骰上达到或超过的数值才能命中你。AC 越高，你就越难被打中。在没有任何护甲的情况下，你的基础 AC 是 <strong>10 + 敏捷修正值</strong>。</p>

<p>这个公式是一切的起点。当你穿上 <strong>DND 护甲</strong> 后，它会替换或修改这个基础计算方式。有些护甲类型允许你加上全部敏捷加值，有些会封顶，而重甲则完全忽略敏捷。</p>

<p>就像 <em>How It's Played</em> 频道在视频中清楚解释的那样，新手最常犯的一个错误是以为护甲熟练度会增加 AC。<strong>不会。</strong> 熟练度只意味着你穿这件护甲时不会在攻击骰、属性检定、豁免骰和施法上受到惩罚。护甲上标注的 AC 数值就是你实际获得的 AC，无论你是否熟练。</p>

<h2>DND 护甲总表：所有护甲类型一览</h2>
<p>如果你想先看结论，这里是完整的 <strong>DND 5e 护甲</strong> 参考表。</p>

<h3>轻甲</h3>
<table>
  <thead>
    <tr><th>护甲</th><th>AC</th><th>隐匿</th><th>重量</th><th>价格</th></tr>
  </thead>
  <tbody>
    <tr><td>棉甲 Padded</td><td>11 + 敏捷</td><td>劣势</td><td>8 磅</td><td>5 gp</td></tr>
    <tr><td>皮甲 Leather</td><td>11 + 敏捷</td><td>&mdash;</td><td>10 磅</td><td>10 gp</td></tr>
    <tr><td>镶嵌皮甲 Studded Leather</td><td>12 + 敏捷</td><td>&mdash;</td><td>13 磅</td><td>45 gp</td></tr>
  </tbody>
</table>

<h3>中甲</h3>
<table>
  <thead>
    <tr><th>护甲</th><th>AC</th><th>隐匿</th><th>重量</th><th>价格</th></tr>
  </thead>
  <tbody>
    <tr><td>兽皮甲 Hide</td><td>12 + 敏捷 (上限 2)</td><td>&mdash;</td><td>12 磅</td><td>10 gp</td></tr>
    <tr><td>链甲衫 Chain Shirt</td><td>13 + 敏捷 (上限 2)</td><td>&mdash;</td><td>20 磅</td><td>50 gp</td></tr>
    <tr><td>鳞甲 Scale Mail</td><td>14 + 敏捷 (上限 2)</td><td>劣势</td><td>45 磅</td><td>50 gp</td></tr>
    <tr><td>胸甲 Breastplate</td><td>14 + 敏捷 (上限 2)</td><td>&mdash;</td><td>20 磅</td><td>400 gp</td></tr>
    <tr><td>半身板甲 Half Plate</td><td>15 + 敏捷 (上限 2)</td><td>劣势</td><td>40 磅</td><td>750 gp</td></tr>
  </tbody>
</table>

<h3>重甲</h3>
<table>
  <thead>
    <tr><th>护甲</th><th>AC</th><th>隐匿</th><th>力量需求</th><th>重量</th><th>价格</th></tr>
  </thead>
  <tbody>
    <tr><td>环甲 Ring Mail</td><td>14</td><td>劣势</td><td>&mdash;</td><td>40 磅</td><td>30 gp</td></tr>
    <tr><td>锁子甲 Chain Mail</td><td>16</td><td>劣势</td><td>力量 13</td><td>55 磅</td><td>75 gp</td></tr>
    <tr><td>夹板甲 Splint</td><td>17</td><td>劣势</td><td>力量 15</td><td>60 磅</td><td>200 gp</td></tr>
    <tr><td>全身板甲 Plate</td><td>18</td><td>劣势</td><td>力量 15</td><td>65 磅</td><td>1,500 gp</td></tr>
  </tbody>
</table>

<h3>盾牌</h3>
<p><strong>盾牌</strong> 在你当前穿戴的护甲基础上额外提供 +2 AC。价格 10 gp，重 6 磅，需要一只空闲的手。任何拥有盾牌熟练度的职业都可以使用。</p>

<h2>DND 轻甲：敏捷型角色的首选</h2>
<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_ARMOR_TYPES_IMAGE_PATH}"
    alt="中世纪军械库中展示的三种 DND 护甲：皮甲、鳞甲和全身板甲"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
  />
</figure>
<p><strong>DND 轻甲</strong> 是为依赖敏捷的角色设计的。你可以把完整的敏捷修正值加到基础 AC 上，所以一个敏捷 20 的游荡者穿镶嵌皮甲就能达到 <strong>AC 17</strong>，而且没有任何隐匿劣势 &mdash; 这个防御力相当扎实。</p>

<p>根据我跑团多年的经验，<strong>镶嵌皮甲是唯一一个长期有价值的轻甲选择。</strong> 棉甲会给隐匿带来劣势，却比普通皮甲没有额外收益，基本就是个坑。普通皮甲在 1 级还行，但很快就会被替换。</p>

<ul>
  <li><strong>最适合：</strong>游荡者、游侠、吟游诗人、契术师、武僧（不过武僧通常更倾向使用无甲防御）。</li>
  <li><strong>优势：</strong>镶嵌皮甲没有隐匿劣势，可以加全额敏捷加值，而且足够轻便。</li>
  <li><strong>最大实际 AC：</strong>17（镶嵌皮甲 + 5 敏捷），如果职业允许加盾牌则为 19。</li>
</ul>

<h2>DND 中甲：灵活的折中选择</h2>
<p>中甲将敏捷加值封顶为 +2，但基础 AC 比轻甲更高。如果你的敏捷修正值不超过 +2，那么中甲几乎总比轻甲更好。</p>

<p>中甲里最值得关注的是 <strong>胸甲</strong> 和 <strong>半身板甲</strong>。胸甲给你 AC 16（敏捷 +2 时）且不带隐匿劣势 &mdash; 这对需要一定防御力但不能太吵的角色来说是最佳平衡点。半身板甲能到 AC 17 但有隐匿劣势。</p>

<ul>
  <li><strong>最适合：</strong>德鲁伊、游侠、部分领域的牧师、野蛮人（未使用无甲防御时）和多职业角色。</li>
  <li><strong>实用建议：</strong>胸甲经常被忽视，因为半身板甲 AC 更高，但如果你的战役中隐匿很重要，胸甲才是更聪明的选择。</li>
  <li><strong>最大实际 AC：</strong>17（半身板甲 + 2 敏捷），加盾牌为 19。</li>
</ul>

<h2>DND 重甲：最高防护，不看敏捷</h2>
<figure class="inline-figure inline-figure--square-crop">
  <img
    class="inline-figure__image inline-figure__image--square"
    src="${DND_ARMOR_HEAVY_IMAGE_PATH}"
    alt="一名穿着全身板甲的圣武士在黑暗地城中持盾站立，代表 DND 重甲"
    width="960"
    height="960"
    loading="lazy"
    decoding="async"
  />
</figure>
<p><strong>重甲</strong> 完全忽略你的敏捷修正值。你的 AC 就是表上标注的固定数字。这让重甲非常适合那些放弃敏捷、把一切投入力量、体质和主施法属性的角色。</p>

<p>全身板甲 <strong>AC 18</strong> 是标准护甲中能获得的最高基础 AC。再加上一面盾牌，你就有了 <strong>AC 20</strong>，在没有任何魔法物品或法术加成的情况下。这就是一个真正难以被命中的前排坦克。</p>

<p>代价呢？<strong>所有重甲都有隐匿劣势</strong>，而且锁子甲及以上需要最低力量值。如果你的力量不够，移动速度会减少 10 尺。根据我们跑团的经验，忘记力量需求是新玩家在 <strong>DND 护甲</strong> 上最常犯的错误之一。</p>

<ul>
  <li><strong>最适合：</strong>战士、圣武士，以及重甲领域的牧师（生命、战争、锻造领域）。</li>
  <li><strong>起始护甲提示：</strong>战士和圣武士通常在 1 级时以锁子甲（AC 16）起步。全身板甲 1,500 gp 通常是战役中期的购置目标。</li>
  <li><strong>最大实际 AC：</strong>20（板甲 + 盾牌），有了 <em>+1 板甲</em> 或 <em>虔诚护盾</em> 法术还能更高。</li>
</ul>

<h2>DND 5e 护甲等级怎么算？</h2>
<p>AC 计算让很多新手困惑，因为不同类型的护甲使用不同的公式。下面是最简明的拆解：</p>

<ul>
  <li><strong>无护甲：</strong>10 + 敏捷修正值。</li>
  <li><strong>轻甲：</strong>护甲基础 AC + 完整敏捷修正值。</li>
  <li><strong>中甲：</strong>护甲基础 AC + 敏捷修正值（上限 +2）。</li>
  <li><strong>重甲：</strong>仅护甲基础 AC。敏捷不参与计算。</li>
</ul>

<p>视频中也重点讲了一条关键规则：<strong>不同来源的 AC 加值可以叠加，但你不能同时使用两种 AC 计算方式。</strong> 比如你不能穿着护甲的同时又用武僧的无甲防御 &mdash; 你只能选一种计算方式。但你<em>可以</em>在选定的护甲计算基础上叠加盾牌加值（+2）和<em>防护戒指</em>（+1）。</p>

<h3>常见 AC 加值来源</h3>
<ul>
  <li><strong>盾牌：</strong>+2 AC。</li>
  <li><strong>护盾术（法师/术士）：</strong>+5 AC，作为反应使用，持续到下一个回合。</li>
  <li><strong>虔诚护盾（牧师/圣武士）：</strong>+2 AC，需要专注。</li>
  <li><strong>掩体：</strong>半掩体 +2，四分之三掩体 +5。</li>
  <li><strong>魔法物品：</strong>+1/+2/+3 护甲、防护戒指、防护披风。</li>
</ul>

<h2>每个职业应该穿什么 DND 护甲？</h2>
<p>选护甲不仅仅是看哪个 AC 最高。它需要匹配你的职业能力、敏捷属性和实际打法。以下是我根据多年桌面经验的推荐：</p>

<table>
  <thead>
    <tr><th>职业</th><th>推荐护甲</th><th>补充说明</th></tr>
  </thead>
  <tbody>
    <tr><td><a href="/blog/dnd-classes-explained">战士</a></td><td>重甲 + 盾牌</td><td>1 级穿锁子甲，攒够钱立刻升级板甲</td></tr>
    <tr><td>圣武士</td><td>重甲 + 盾牌</td><td>和战士一样；光环能力需要你站前排</td></tr>
    <tr><td>游荡者</td><td>镶嵌皮甲</td><td>必须加全敏捷，不能承受隐匿劣势</td></tr>
    <tr><td>游侠</td><td>镶嵌皮甲 / 胸甲</td><td>取决于敏捷；力量型游侠适合中甲</td></tr>
    <tr><td>野蛮人</td><td>无甲防御</td><td>10 + 敏捷 + 体质；前期用链甲衫或胸甲过渡</td></tr>
    <tr><td>牧师</td><td>重甲或中甲 + 盾牌</td><td>生命 / 战争 / 锻造 = 重甲；其他领域 = 中甲</td></tr>
    <tr><td>德鲁伊</td><td>中甲 + 盾牌（非金属）</td><td>兽皮甲或非金属胸甲；问你的 DM</td></tr>
    <tr><td>法师 / 术士</td><td><em>法师护甲</em>法术</td><td>AC 13 + 敏捷；<em>护盾术</em>应急</td></tr>
    <tr><td>吟游诗人</td><td>镶嵌皮甲</td><td>轻甲，除非多职业</td></tr>
    <tr><td>契术师</td><td>轻甲（邪影可用中甲）</td><td>邪影术士可获得中甲 + 盾牌熟练度</td></tr>
    <tr><td>武僧</td><td>不穿护甲</td><td>10 + 敏捷 + 感知；穿护甲会禁用武僧能力</td></tr>
  </tbody>
</table>

<h2>法师护甲：施法者的物理护甲替代品</h2>
<p>没有护甲熟练度的角色并非毫无防御。<strong><a href="/blog/dnd-classes-explained">法师</a></strong>的<em>法师护甲</em>法术能将基础 AC 设为 <strong>13 + 敏捷修正值</strong>，持续 8 小时且不需要专注。一个敏捷 16 的法师用这个法术就有 AC 16 &mdash; 比锁子甲还高。</p>

<p>代价是它每天消耗一个 1 环法术位。低等级时这很心疼；高等级时就不值一提了。如果你玩的是脆皮施法者，<em>法师护甲</em>基本上是必修课，直到你找到魔法替代品。</p>

<h2>常见的 DND 护甲选择错误</h2>
<p>跑了几十场战役后，这些是我见过最多的护甲失误：</p>

<ol>
  <li><strong>以为熟练度 = AC 加值。</strong>不是的。熟练度只是让你避免惩罚。</li>
  <li><strong>忽略重甲的力量需求。</strong>如果你的战士只有 12 力量却穿了夹板甲（需要力量 15），你的移动速度会减少 10 尺。</li>
  <li><strong>叠加两种 AC 计算。</strong>你不能用<em>法师护甲</em>之后再穿链甲衫。只能选一种基础计算方式。</li>
  <li><strong>忘记隐匿劣势。</strong>半身板甲和所有重甲都有隐匿劣势。如果你的队伍需要偷袭潜入，这影响的是所有人。</li>
  <li><strong>穿着重甲睡觉。</strong>《赞纳萨万事指南》的可选规则说穿中甲或重甲睡觉时只恢复四分之一的生命骰且不减少力竭等级。很多 DM 会执行这条。</li>
</ol>

<h2>DND 护甲常见问题</h2>
<h3>DND 5e 中最好的护甲是什么？</h3>
<p><strong>全身板甲（AC 18）</strong>是 DND 5e 中纯 AC 数值最高的标准护甲。配合盾牌可以达到 AC 20，这是基础规则中不靠魔法能获得的最高护甲等级。</p>

<h3>没有熟练度可以穿 DND 护甲吗？</h3>
<p>可以物理上穿上任何 <strong>DND 护甲</strong>，但穿戴你没有熟练度的护甲会让你在所有使用力量或敏捷的属性检定、豁免骰和攻击骰上有劣势，而且你无法施法。实际上等于没穿。</p>

<h3>敏捷会影响重甲 AC 吗？</h3>
<p>不会。<strong>DND 重甲</strong> 使用固定的 AC 数值，不会因敏捷修正值变化。敏捷 8 的战士和敏捷 20 的战士穿板甲的 AC 完全一样。</p>

<h3>DND 轻甲和中甲有什么区别？</h3>
<p><strong>DND 轻甲</strong>允许加上完整的敏捷修正值，而中甲将敏捷加值封顶为 +2。敏捷修正值大于等于 +3 时轻甲更好；小于等于 +2 时中甲更好。</p>

<h3>盾牌算护甲吗？</h3>
<p>盾牌出现在护甲表中，需要盾牌熟练度，但对于那些注明"未穿戴护甲时"的能力来说，盾牌不算"护甲"。它只是在你当前的护甲或无甲 AC 基础上额外加 +2。</p>

<h2>观看 DND 护甲与 AC 机制的视频讲解</h2>
<p>如果你想更直观地理解 <strong>DND 护甲</strong> 和护甲等级在实际游戏中的运作方式，<em>How It's Played</em> 频道的这段视频把机制讲得非常清楚。它涵盖了 AC 计算、不同类型护甲如何应用敏捷加值，以及盾牌和法术等加值来源如何叠加。</p>

${liteVideoEmbed('pKxuStjRTxo', 'DND 护甲与护甲等级机制详解视频')}
`;
