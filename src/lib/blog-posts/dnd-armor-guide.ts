import {
  DND_ARMOR_TYPES_IMAGE_PATH,
  DND_ARMOR_HEAVY_IMAGE_PATH,
  EN_DND_CLASSES_PATH,
  EN_DICE_ROLLER_PATH,
  EN_EDITOR_PATH,
  EN_SQUARE_TOKEN_MAKER_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_EDITOR_PATH,
  ZH_SQUARE_TOKEN_MAKER_PATH,
  liteVideoEmbed,
} from './shared';

const ARMOR_EQUIPMENT_2014_URL = 'https://www.dndbeyond.com/sources/dnd/basic-rules-2014/equipment';
const ARMOR_EQUIPMENT_2024_URL = 'https://www.dndbeyond.com/sources/dnd/br-2024/equipment';
const ARMOR_CLASSES_2014_URL = 'https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes';
const ARMOR_CLASSES_2024_URL = 'https://www.dndbeyond.com/sources/dnd/br-2024/character-classes';
const ARMOR_SPELLS_2014_URL = 'https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells';
const ARMOR_MAGIC_ITEMS_2014_URL = 'https://www.dndbeyond.com/sources/dnd/basic-rules-2014/magic-items';
const ARMOR_MAGIC_ITEMS_2024_URL = 'https://www.dndbeyond.com/sources/dnd/br-2024/magic-items-a-z';
const ARMOR_COMBAT_2014_URL = 'https://www.dndbeyond.com/sources/dnd/basic-rules-2014/combat';

export const dndArmorArticleHtml = String.raw`
<p>Quick armor call: high-Dex characters usually want <strong>studded leather</strong>, Dex +2 builds often want <strong>breastplate</strong> or <strong>half plate</strong>, and Strength frontliners want <strong>chain mail</strong> early before upgrading to <strong>plate armor</strong>. Every <strong>DND 5e armor</strong> option differs by AC, cost, weight, stealth penalty, and Strength requirement.</p>

<p><strong>DND armor</strong> choices matter because the same AC number can feel very different once stealth, Strength requirements, Dexterity, shields, and class features enter the scene. Use the table as the rules lookup, then read the notes for what each armor option costs you at the table.</p>

<h2>DND 5e Armor Table: AC, Cost, Weight, and Stealth</h2>
<p>This table follows the <a href="${ARMOR_EQUIPMENT_2014_URL}">2014 Basic Rules (5e)</a>. The <a href="${ARMOR_EQUIPMENT_2024_URL}">2024 Basic Rules (5.5e)</a> lists the armor training rules and donning times alongside the armor table; use the edition your table has adopted.</p>
<p>Treat this <strong>DND armor table</strong> as the lookup you keep open during character creation. Light armor rewards high Dexterity, medium armor rewards Dex +2 builds, heavy armor ignores Dexterity, and shields add +2 AC on top of your chosen armor calculation. Check the <a href="${ARMOR_EQUIPMENT_2014_URL}">official 2014 armor and shield table</a> for the figures below.</p>

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
<p>Under the <a href="${ARMOR_EQUIPMENT_2014_URL}">2014 rules</a>, a <strong>shield</strong> adds +2 AC, costs 10 gp, weighs 6 lb, and is carried in one hand. Under the <a href="${ARMOR_EQUIPMENT_2024_URL}">2024 rules</a>, you gain a shield’s AC benefit only if you have Shield training.</p>

<h2>How Armor Class Works in DND</h2>
<p><strong>Armor Class (AC)</strong> is the number an attacker needs to meet or beat on their attack roll to hit you. The higher your AC, the harder you are to hit. Without any armor at all, your base AC is <strong>10 + your Dexterity modifier</strong>, following the <a href="${ARMOR_EQUIPMENT_2014_URL}">2014 armor rules</a>.</p>

<p>That plain 10 + Dex number is what armor rewrites. When you put on <strong>DND armor</strong>, it replaces or modifies that base calculation. Some armor types let you add your full Dexterity bonus, others cap it, and heavy armor ignores Dexterity entirely.</p>

<p>Armor proficiency does not add to AC. Under the <a href="${ARMOR_EQUIPMENT_2014_URL}">2014 rules</a>, lacking proficiency gives disadvantage on Strength or Dexterity checks, saving throws, and attack rolls, and prevents spellcasting. The <a href="${ARMOR_EQUIPMENT_2024_URL}">2024 rules</a> phrase the penalty as disadvantage on any Strength- or Dexterity-related D20 Test and no spellcasting. The number on the armor table is its base AC; apply the rule text for your edition.</p>

<h2>DND Light Armor: Best for High-Dex Characters</h2>
<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_ARMOR_TYPES_IMAGE_PATH}"
    alt="DND armor types arranged in a clean fantasy armory, including leather, chain, breastplate, shield, and plate"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
  />
</figure>
<p><strong>DND light armor</strong> lives or dies on Dexterity. You add your full Dex modifier to the base AC, which means a Rogue with 20 Dexterity wearing studded leather hits <strong>AC 17</strong> with no shield &mdash; solid protection without any stealth penalty.</p>

<p>In my experience running and playing D&amp;D for years, <strong>studded leather is the only light armor that matters long-term.</strong> Padded armor imposes stealth disadvantage for no extra benefit over regular leather, so it is essentially a trap option. Regular leather works fine at level 1 but gets replaced fast.</p>

<ul>
  <li><strong>Best for:</strong> Rogues, Rangers, Bards, Warlocks, Monks (though Monks usually prefer Unarmored Defense).</li>
  <li><strong>Why it works:</strong> no stealth penalty on studded leather, full Dex bonus, and light enough to not slow you down.</li>
  <li><strong>Max realistic AC:</strong> 17 (studded leather + 5 Dex) or 19 with a shield if your class allows it.</li>
</ul>

<h2>DND Medium Armor: Best for Dex +2 Builds</h2>
<p>Medium armor caps your Dexterity bonus at +2, but it starts from a higher base AC than light armor. A character sitting at Dex +2 often gets more protection here than from leather or studded leather.</p>

<p>The real choice is usually <strong>breastplate</strong> versus <strong>half plate</strong>. Breastplate gives you AC 16 (with +2 Dex) and no stealth disadvantage, which is the quiet option. Half plate pushes to AC 17 but announces itself every time the Rogue says, "we sneak in."</p>

<ul>
  <li><strong>Best for:</strong> Druids, Rangers, Clerics (some domains), Barbarians (when not using Unarmored Defense), and multiclass builds.</li>
  <li><strong>Pro tip:</strong> breastplate is often overlooked because half plate has higher AC, but if stealth matters at all in your campaign, breastplate is the smarter buy.</li>
  <li><strong>Max realistic AC:</strong> 17 (half plate + 2 Dex) or 19 with a shield.</li>
</ul>

<h2>DND Heavy Armor: Best for Strength Frontliners</h2>
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
<p><strong>Heavy armor</strong> ignores your Dexterity modifier completely. Your AC is just the flat number listed, so a low-Dex Fighter or Paladin can still stand in front without paying for that dumped stat every round.</p>

<p>Plate armor at <strong>AC 18</strong> is the highest base AC you can get from standard armor. Add a shield and you are sitting at <strong>AC 20</strong> before any magic items or spells. That is a frontline tank who is genuinely hard to hit.</p>

<p>The catch? <strong>Every heavy armor option imposes stealth disadvantage</strong>, and chain mail and above require a minimum Strength score. If your Strength is below the requirement, your speed drops by 10 feet. Based on our table experience, forgetting about the Strength requirement is one of the most common new-player mistakes with <strong>DND armor</strong>.</p>

<ul>
  <li><strong>Best for:</strong> Fighters, Paladins, and Clerics with Heavy armor proficiency under the <a href="${ARMOR_CLASSES_2014_URL}">2014 rules</a> or Heavy armor training under the <a href="${ARMOR_CLASSES_2024_URL}">2024 rules</a> (2024 Clerics gain it by choosing Protector Divine Order).</li>
  <li><strong>Starting armor note:</strong> Chain mail is one of the 2014 Fighter and Paladin starting-equipment choices; plate armor costs 1,500 gp.</li>
  <li><strong>Max realistic AC:</strong> 20 with plate + shield under the <a href="${ARMOR_EQUIPMENT_2014_URL}">2014 armor rules</a>, or higher with bonuses such as <a href="${ARMOR_MAGIC_ITEMS_2024_URL}">2024 Armor, +1, +2, or +3</a> or the <a href="${ARMOR_SPELLS_2014_URL}"><em>Shield of Faith</em> spell</a>.</li>
</ul>

<h2>How to Calculate AC in DND 5e</h2>
<p>AC calculation trips up a lot of beginners because different armor types use different formulas. These categories and formulas follow the <a href="${ARMOR_EQUIPMENT_2014_URL}">2014 armor rules</a>; check the <a href="${ARMOR_EQUIPMENT_2024_URL}">2024 table</a> when your campaign uses 5.5e.</p>

<ul>
  <li><strong>No armor:</strong> 10 + Dex modifier.</li>
  <li><strong>Light armor:</strong> armor base AC + full Dex modifier.</li>
  <li><strong>Medium armor:</strong> armor base AC + Dex modifier (max +2).</li>
  <li><strong>Heavy armor:</strong> armor base AC only. Dex does not apply.</li>
</ul>

<p>The rule to keep straight is this: <strong>AC bonuses from different sources stack, but you cannot use two AC calculations at the same time.</strong> For example, you cannot wear armor and also use the Monk's Unarmored Defense &mdash; you pick one calculation. But you <em>can</em> add a shield bonus (+2) and a <em>Ring of Protection</em> (+1) on top of your chosen armor calculation; see the <a href="${ARMOR_EQUIPMENT_2014_URL}">2014 armor rules</a> and <a href="${ARMOR_MAGIC_ITEMS_2014_URL}">magic-item rules</a>.</p>

<h3>Common AC bonus sources</h3>
<ul>
  <li><strong>Shield:</strong> +2 AC.</li>
  <li><strong>Shield spell (Wizard/Sorcerer):</strong> +5 AC as a reaction until next turn under the <a href="${ARMOR_SPELLS_2014_URL}">2014 spell rules</a>.</li>
  <li><strong>Shield of Faith (Cleric/Paladin):</strong> +2 AC, concentration, under the <a href="${ARMOR_SPELLS_2014_URL}">2014 spell rules</a>.</li>
  <li><strong>Cover:</strong> half cover +2, three-quarters cover +5, under the <a href="${ARMOR_COMBAT_2014_URL}">2014 combat rules</a>.</li>
  <li><strong>Magic items:</strong> see the <a href="${ARMOR_MAGIC_ITEMS_2024_URL}">2024 Armor, +1, +2, or +3 rules</a> and the <a href="${ARMOR_MAGIC_ITEMS_2014_URL}">2014 Ring of Protection and Cloak of Protection rules</a>.</li>
</ul>

<h2>Best DND Armor by Class</h2>
<p>Armor choice starts with AC, but it has to fit your class abilities, Dexterity score, and the way your character actually plays. If you are preparing a VTT campaign, build the armored portrait in the <a href="${EN_EDITOR_PATH}">VTT token maker</a> and compare a few AC targets in the <a href="${EN_DICE_ROLLER_PATH}">D&amp;D dice roller</a> before deciding whether plate, breastplate, or studded leather fits this table.</p>
<p>These are playstyle recommendations, not an official armor ranking. Armor training differs by class and edition; compare the <a href="${ARMOR_CLASSES_2014_URL}">2014 class rules</a> with the <a href="${ARMOR_CLASSES_2024_URL}">2024 class rules</a>.</p>

<table>
  <thead>
    <tr><th>Class</th><th>Best Armor</th><th>Notes</th></tr>
  </thead>
  <tbody>
    <tr><td>Fighter</td><td>Heavy + Shield</td><td>Chain mail is one 2014 starting choice; compare the adopted class rules</td></tr>
    <tr><td>Paladin</td><td>Heavy + Shield</td><td>Chain mail is one 2014 starting choice; compare the adopted class rules</td></tr>
    <tr><td>Rogue</td><td>Studded Leather</td><td>Full Dex bonus, no stealth penalty &mdash; non-negotiable</td></tr>
    <tr><td>Ranger</td><td>Studded Leather / Breastplate</td><td>Depends on Dex; Str-based rangers use medium</td></tr>
    <tr><td>Barbarian</td><td>Unarmored Defense</td><td>10 + Dex + Con; chain shirt or breastplate early on</td></tr>
    <tr><td>Cleric</td><td>Armor training + Shield</td><td>Training depends on class features and edition</td></tr>
    <tr><td>Druid</td><td>Check edition-specific training</td><td>2014 allows medium armor/shields but says no metal; 2024 Basic Rules lists light armor and shields</td></tr>
    <tr><td>Wizard / Sorcerer</td><td><em>Mage Armor</em> spell</td><td>AC 13 + Dex; <em>Shield</em> spell for emergencies</td></tr>
    <tr><td>Bard</td><td>Studded Leather</td><td>Light armor only unless you multiclass</td></tr>
    <tr><td>Warlock</td><td>Light</td><td>Check any subclass or multiclass feature before changing armor</td></tr>
    <tr><td>Monk</td><td>Unarmored Defense</td><td>2014 and 2024 Basic Rules list no armor training; check the feature text</td></tr>
  </tbody>
</table>

<blockquote>
  <p><strong>VTT prep tip:</strong> after you choose the armor, make the character readable on the battle map. Use the <a href="${EN_EDITOR_PATH}">Token Maker editor</a> to turn an armored Fighter, Paladin, Rogue, or Cleric portrait into a Roll20 or Foundry-ready token, or start from the <a href="${EN_SQUARE_TOKEN_MAKER_PATH}">square token maker</a> if your table uses square portraits.</p>
  <p style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1rem;"><a href="${EN_EDITOR_PATH}" class="site-cta-primary">Make an armored token</a> <a href="${EN_SQUARE_TOKEN_MAKER_PATH}" class="site-cta-secondary">Square token maker</a></p>
</blockquote>

<h2>Mage Armor vs Physical Armor</h2>
<p>Characters without armor proficiency are not defenseless. Under the <a href="${ARMOR_SPELLS_2014_URL}">2014 Basic Rules</a>, the <strong><a href="${EN_DND_CLASSES_PATH}">Wizard</a></strong> spell <em>Mage Armor</em> sets your base AC to <strong>13 + Dex modifier</strong> for 8 hours. For a Wizard with 16 Dexterity, that is AC 16 &mdash; the same AC as chain mail. Use the spell text for the edition your table has adopted.</p>

<p>The tradeoff is that it uses a 1st-level spell slot every day. At low levels that hurts; at higher levels it becomes trivial. For a squishy caster, <em>Mage Armor</em> is hard to skip until a magic item gives you another answer.</p>

<h2>Common DND Armor Mistakes to Avoid</h2>
<p>After running dozens of campaigns, these are the armor mistakes I see most often:</p>

<ol>
  <li><strong>Thinking proficiency = AC bonus.</strong> It does not. Proficiency just means you avoid penalties.</li>
  <li><strong>Ignoring Strength requirements on heavy armor.</strong> If your Fighter has 12 Strength and wears splint (Str 15 required), you lose 10 feet of movement. That matters.</li>
  <li><strong>Stacking two AC calculations.</strong> You cannot use <em>Mage Armor</em> and then put on a chain shirt. Pick one base calculation.</li>
  <li><strong>Forgetting stealth disadvantage.</strong> Half plate and all heavy armors impose disadvantage on Stealth. If your party relies on sneaking, one noisy armor choice can spoil the whole approach.</li>
  <li><strong>Optional rest rules.</strong> Sleep-related penalties depend on the optional rules your DM has adopted; check that source before applying them.</li>
</ol>

<h2>FAQ About DND Armor</h2>
<h3>What is the best armor in DND 5e?</h3>
<p><strong>Plate armor (AC 18)</strong> has the highest base AC in the <a href="${ARMOR_EQUIPMENT_2014_URL}">2014 Basic Rules armor table</a>. With a shield’s +2, it reaches AC 20 before other effects; apply your campaign’s edition and character features.</p>

<h3>Can you wear DND armor without proficiency?</h3>
<p>Yes. Under the <a href="${ARMOR_EQUIPMENT_2014_URL}">2014 rules</a>, armor without proficiency gives disadvantage on Strength or Dexterity checks, saves, and attacks, and prevents spellcasting. Under the <a href="${ARMOR_EQUIPMENT_2024_URL}">2024 rules</a>, lacking armor training gives disadvantage on any Strength- or Dexterity-related D20 Test and prevents spellcasting.</p>

<h3>Does Dexterity affect heavy armor AC?</h3>
<p>No. <strong>DND heavy armor</strong> uses a flat AC number that does not change with your Dexterity modifier. A Fighter with 8 Dex and a Fighter with 20 Dex have exactly the same AC in plate armor.</p>

<h3>What is the difference between light and medium armor in DND?</h3>
<p><strong>DND light armor</strong> adds your full Dexterity modifier, while medium armor caps it at +2. There is no single Dexterity cutoff that makes one category always better: for example, studded leather reaches AC 15 at Dex +3, while breastplate reaches AC 16 at Dex +2 and half plate reaches AC 17. Compare the <a href="${ARMOR_EQUIPMENT_2014_URL}">2014 armor table</a>, armor training, stealth needs, and budget.</p>

<h3>Does a shield count as armor in DND?</h3>
<p>The <a href="${ARMOR_EQUIPMENT_2014_URL}">2014 rules</a> list a shield separately from armor and give it +2 AC. Whether a shield works with a feature depends on that feature’s wording; the <a href="${ARMOR_EQUIPMENT_2024_URL}">2024 rules</a> also require Shield training to gain its AC benefit.</p>

<h2>Watch This Visual Breakdown of DND Armor and AC</h2>
<p>This <em>How It's Played</em> video is handy when AC stacking still feels slippery. It walks through <strong>DND armor</strong>, Dexterity limits, shields, spells, and the big beginner mistake: proficiency does not add to your Armor Class.</p>

${liteVideoEmbed('pKxuStjRTxo', 'DND armor and Armor Class explained video')}
`;

export const dndArmorArticleHtmlZh = String.raw`
<p>如果你只想先看结论：高敏捷角色通常选 <strong>Studded Leather 镶嵌皮甲</strong>，敏捷 +2 的角色常在 <strong>Breastplate 胸甲</strong> 和 <strong>Half Plate 半身板甲</strong> 之间取舍，力量前排前期穿 <strong>Chain Mail 锁子甲</strong>，中后期升级到 <strong>Plate 全身板甲</strong>。表格按 AC、价格、重量、隐匿劣势和力量需求对比所有 <strong>DND 5e 护甲</strong>。</p>

<p><strong>DND 护甲</strong> 会同时影响 AC、敏捷上限、力量需求、隐匿劣势、盾牌选择，以及这个角色在队伍里到底怎么行动。</p>

<h2>DND 5e 护甲总表：AC、价格、重量与隐匿</h2>
<p>这张表依据<a href="${ARMOR_EQUIPMENT_2014_URL}">2014 基础规则（5e）</a>。<a href="${ARMOR_EQUIPMENT_2024_URL}">2024 基础规则（5.5e）</a>的护甲表也列出熟练训练规则与穿脱时间；请使用你所在战役采用的版本。</p>
<p>开卡或购物时，可以把这张 <strong>DND 护甲表</strong> 放在旁边查。轻甲奖励高敏捷，中甲适合敏捷 +2 的构筑，重甲完全不看敏捷，而盾牌会在你选定的护甲计算基础上额外增加 +2 AC。下表数据可在<a href="${ARMOR_EQUIPMENT_2014_URL}">官方 2014 护甲与盾牌表</a>核对。</p>

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
<p>按<a href="${ARMOR_EQUIPMENT_2014_URL}">2014 规则</a>，<strong>盾牌</strong>增加 +2 AC，价格 10 gp、重 6 磅，并由一只手持用。按<a href="${ARMOR_EQUIPMENT_2024_URL}">2024 规则</a>，只有具备盾牌训练时才能获得盾牌的 AC 加值。</p>

<h2>DND 护甲等级（AC）怎么运作？</h2>
<p><strong>护甲等级（Armor Class, AC）</strong> 是攻击者需要在攻击骰上达到或超过的数值才能命中你。AC 越高，你就越难被打中。按<a href="${ARMOR_EQUIPMENT_2014_URL}">2014 护甲规则</a>，没有护甲时基础 AC 是 <strong>10 + 敏捷修正值</strong>。</p>

<p>这个公式是一切的起点。当你穿上 <strong>DND 护甲</strong> 后，它会替换或修改这个基础计算方式。有些护甲类型允许你加上全部敏捷加值，有些会封顶，而重甲则完全忽略敏捷。</p>

<p>护甲熟练度不会增加 AC。按<a href="${ARMOR_EQUIPMENT_2014_URL}">2014 规则</a>，缺少对应熟练度会让你进行力量或敏捷相关的属性检定、豁免和攻击时处于劣势，并且无法施法。<a href="${ARMOR_EQUIPMENT_2024_URL}">2024 规则</a>则把惩罚表述为力量或敏捷相关的 D20 检定处于劣势，并且无法施法。护甲表上的 AC 是基础值，具体套用桌上采用的版本规则。</p>

<h2>DND 轻甲：高敏捷角色的首选</h2>
<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_ARMOR_TYPES_IMAGE_PATH}"
    alt="奇幻军械库中整齐展示多种 DND 护甲，包括皮甲、锁甲、胸甲、盾牌和板甲"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
  />
</figure>
<p><strong>DND 轻甲</strong> 基本就是吃敏捷饭。你可以把完整的敏捷修正值加到基础 AC 上，所以一个敏捷 20 的游荡者穿镶嵌皮甲就能达到 <strong>AC 17</strong>，而且没有任何隐匿劣势 &mdash; 防御已经够扎实。</p>

<p>根据我跑团多年的经验，<strong>镶嵌皮甲是唯一一个长期有价值的轻甲选择。</strong> 棉甲会给隐匿带来劣势，却比普通皮甲没有额外收益，基本就是个坑。普通皮甲在 1 级还行，但很快就会被替换。</p>

<ul>
  <li><strong>最适合：</strong>游荡者、游侠、吟游诗人、契术师、武僧（不过武僧通常更倾向使用无甲防御）。</li>
  <li><strong>优势：</strong>镶嵌皮甲没有隐匿劣势，可以加全额敏捷加值，而且足够轻便。</li>
  <li><strong>最大实际 AC：</strong>17（镶嵌皮甲 + 5 敏捷），如果职业允许加盾牌则为 19。</li>
</ul>

<h2>DND 中甲：适合敏捷 +2 的构筑</h2>
<p>中甲将敏捷加值封顶为 +2，但基础 AC 比轻甲更高。敏捷修正值卡在 +2 左右的角色，通常会从中甲里拿到更划算的防御。</p>

<p>中甲里常见的取舍是 <strong>胸甲</strong> 和 <strong>半身板甲</strong>。胸甲给你 AC 16（敏捷 +2 时）且不带隐匿劣势，适合不想拖累潜入的角色。半身板甲能到 AC 17，但一进潜行场景就会变得很吵。</p>

<ul>
  <li><strong>最适合：</strong>德鲁伊、游侠、部分领域的牧师、野蛮人（未使用无甲防御时）和多职业角色。</li>
  <li><strong>实用建议：</strong>胸甲经常被忽视，因为半身板甲 AC 更高，但如果你的战役中隐匿很重要，胸甲才是更聪明的选择。</li>
  <li><strong>最大实际 AC：</strong>17（半身板甲 + 2 敏捷），加盾牌为 19。</li>
</ul>

<h2>DND 重甲：适合力量前排</h2>
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
<p><strong>重甲</strong> 完全忽略你的敏捷修正值。你的 AC 就是表上标注的固定数字，所以低敏捷的战士或圣武士也能放心站到前排。</p>

<p>2014 护甲表还列出重甲的力量门槛、速度惩罚和隐匿劣势；可在<a href="${ARMOR_EQUIPMENT_2014_URL}">官方装备规则</a>核对。下文的规则字段均按该版表格整理。</p>

<p>全身板甲 <strong>AC 18</strong> 是标准护甲中能获得的最高基础 AC。再加上一面盾牌，你就有了 <strong>AC 20</strong>，在没有任何魔法物品或法术加成的情况下。这个前排已经很难被命中。</p>

<p>代价呢？<strong>所有重甲都有隐匿劣势</strong>，而且锁子甲及以上需要最低力量值。如果你的力量不够，移动速度会减少 10 尺。根据我们跑团的经验，忘记力量需求是新玩家在 <strong>DND 护甲</strong> 上最常犯的错误之一。</p>

<ul>
  <li><strong>最适合：</strong>战士、圣武士，以及按<a href="${ARMOR_CLASSES_2014_URL}">2014 规则</a>获得重甲熟练项或按<a href="${ARMOR_CLASSES_2024_URL}">2024 规则</a>获得重甲训练的牧师；2024 规则下可选择 Protector 神圣秩序获得重甲训练。</li>
  <li><strong>起始护甲提示：</strong>锁子甲是 2014 战士和圣武士的一种起始装备选择；全身板甲价格为 1,500 gp。</li>
  <li><strong>最大实际 AC：</strong>按<a href="${ARMOR_EQUIPMENT_2014_URL}">2014 护甲规则</a>，板甲 + 盾牌为 AC 20；还可受到<a href="${ARMOR_MAGIC_ITEMS_2024_URL}">2024 规则中的 +1、+2 或 +3 护甲</a>，或<a href="${ARMOR_SPELLS_2014_URL}"><em>虔诚护盾</em>法术</a>等加成。</li>
</ul>

<h2>DND 5e AC 怎么计算？</h2>
<p>AC 计算让很多新手困惑，因为不同类型的护甲使用不同的公式。以下分类与公式依据<a href="${ARMOR_EQUIPMENT_2014_URL}">2014 护甲规则</a>；采用 5.5e 时请同时核对<a href="${ARMOR_EQUIPMENT_2024_URL}">2024 护甲表</a>。</p>

<ul>
  <li><strong>无护甲：</strong>10 + 敏捷修正值。</li>
  <li><strong>轻甲：</strong>护甲基础 AC + 完整敏捷修正值。</li>
  <li><strong>中甲：</strong>护甲基础 AC + 敏捷修正值（上限 +2）。</li>
  <li><strong>重甲：</strong>仅护甲基础 AC。敏捷不参与计算。</li>
</ul>

<p>需要分清两件事：<strong>不同来源的 AC 加值可以叠加，但你不能同时使用两种 AC 计算方式。</strong> 比如你不能穿着护甲的同时又用武僧的无甲防御 &mdash; 你只能选一种计算方式。但你<em>可以</em>在选定的护甲计算基础上叠加盾牌加值（+2）和<em>防护戒指</em>（+1）；规则见<a href="${ARMOR_EQUIPMENT_2014_URL}">2014 护甲规则</a>与<a href="${ARMOR_MAGIC_ITEMS_2014_URL}">魔法物品规则</a>。</p>

<h3>常见 AC 加值来源</h3>
<ul>
  <li><strong>盾牌：</strong>+2 AC。</li>
  <li><strong>护盾术（法师/术士）：</strong>按<a href="${ARMOR_SPELLS_2014_URL}">2014 法术规则</a>，反应施放后 AC +5，持续到你下回合开始。</li>
  <li><strong>虔诚护盾（牧师/圣武士）：</strong>按<a href="${ARMOR_SPELLS_2014_URL}">2014 法术规则</a>，AC +2，需要专注。</li>
  <li><strong>掩体：</strong>按<a href="${ARMOR_COMBAT_2014_URL}">2014 战斗规则</a>，半掩体 +2、四分之三掩体 +5。</li>
  <li><strong>魔法物品：</strong><a href="${ARMOR_MAGIC_ITEMS_2024_URL}">2024 规则中的 +1、+2 或 +3 护甲</a>；<a href="${ARMOR_MAGIC_ITEMS_2014_URL}">2014 规则中的防护戒指与防护披风</a>。</li>
</ul>

<h2>各职业最佳 DND 护甲推荐</h2>
<p>选护甲先看 AC，但不能只看 AC。它要匹配你的职业能力、敏捷属性和实际打法。准备虚拟桌面战役时，可以先在 <a href="${ZH_EDITOR_PATH}">VTT Token 制作工具</a> 里做出护甲形象，再用 <a href="${ZH_DICE_ROLLER_PATH}">D&amp;D 骰子工具</a> 对比几个常见 AC 目标，看看板甲、胸甲或镶嵌皮甲是否真的适合这张桌。</p>
<p>这些是玩法建议，不是官方护甲排名。各职业的护甲训练会随职业特性与版本而变化；可对照<a href="${ARMOR_CLASSES_2014_URL}">2014 职业规则</a>和<a href="${ARMOR_CLASSES_2024_URL}">2024 职业规则</a>。</p>

<table>
  <thead>
    <tr><th>职业</th><th>推荐护甲</th><th>补充说明</th></tr>
  </thead>
  <tbody>
    <tr><td><a href="${ZH_DND_CLASSES_PATH}">战士</a></td><td>重甲 + 盾牌</td><td>锁子甲是 2014 年的一种起始装备选择；对照当前职业规则</td></tr>
    <tr><td>圣武士</td><td>重甲 + 盾牌</td><td>锁子甲是 2014 年的一种起始装备选择；对照当前职业规则</td></tr>
    <tr><td>游荡者</td><td>镶嵌皮甲</td><td>必须加全敏捷，不能承受隐匿劣势</td></tr>
    <tr><td>游侠</td><td>镶嵌皮甲 / 胸甲</td><td>取决于敏捷；力量型游侠适合中甲</td></tr>
    <tr><td>野蛮人</td><td>无甲防御</td><td>10 + 敏捷 + 体质；前期用链甲衫或胸甲过渡</td></tr>
    <tr><td>牧师</td><td>按职业特性选择护甲 + 盾牌</td><td>熟练训练取决于职业特性与版本</td></tr>
    <tr><td>德鲁伊</td><td>核对版本专属训练</td><td>2014 可用中甲和盾牌但不穿金属；2024 基础规则列为轻甲和盾牌</td></tr>
    <tr><td>法师 / 术士</td><td><em>法师护甲</em>法术</td><td>AC 13 + 敏捷；<em>护盾术</em>应急</td></tr>
    <tr><td>吟游诗人</td><td>镶嵌皮甲</td><td>轻甲，除非多职业</td></tr>
    <tr><td>契术师</td><td>轻甲</td><td>更换护甲前先核对职业、子职或多职业特性</td></tr>
    <tr><td>武僧</td><td>无甲防御</td><td>2014 与 2024 基础职业规则均未列护甲训练；仍需核对能力文字</td></tr>
  </tbody>
</table>

<blockquote>
  <p><strong>VTT 准备建议：</strong>选完护甲后，下一步是让角色在战斗地图上容易识别。你可以用 <a href="${ZH_EDITOR_PATH}">Token Maker 编辑器</a> 把穿甲的战士、圣武士、游荡者或牧师头像做成适合 Roll20 / Foundry 的 Token；如果你的桌使用方形头像，也可以直接从 <a href="${ZH_SQUARE_TOKEN_MAKER_PATH}">Square Token Maker</a> 开始。</p>
  <p style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1rem;"><a href="${ZH_EDITOR_PATH}" class="site-cta-primary">制作穿甲角色 Token</a> <a href="${ZH_SQUARE_TOKEN_MAKER_PATH}" class="site-cta-secondary">Square Token Maker</a></p>
</blockquote>

<h2>法师护甲 vs 物理护甲</h2>
<p>没有护甲熟练度的角色并非毫无防御。按<a href="${ARMOR_SPELLS_2014_URL}">2014 基础规则法术文本</a>，<strong><a href="${ZH_DND_CLASSES_PATH}">法师</a></strong>的<em>法师护甲</em>能将基础 AC 设为 <strong>13 + 敏捷修正值</strong>，持续 8 小时。一个敏捷 16 的法师用这个法术就有 AC 16 &mdash; 与锁子甲相同。其他版本请使用战役采用的法术文本。</p>

<p>代价是它每天消耗一个 1 环法术位。低等级时这很心疼；高等级时就不值一提了。如果你玩的是脆皮施法者，<em>法师护甲</em>基本上是必修课，直到你找到魔法替代品。</p>

<h2>常见的 DND 护甲选择错误</h2>
<p>跑了几十场战役后，这些是我见过最多的护甲失误：</p>

<ol>
  <li><strong>以为熟练度 = AC 加值。</strong>不是的。熟练度只是让你避免惩罚。</li>
  <li><strong>忽略重甲的力量需求。</strong>如果你的战士只有 12 力量却穿了夹板甲（需要力量 15），你的移动速度会减少 10 尺。</li>
  <li><strong>叠加两种 AC 计算。</strong>你不能用<em>法师护甲</em>之后再穿链甲衫。只能选一种基础计算方式。</li>
  <li><strong>忘记隐匿劣势。</strong>半身板甲和所有重甲都有隐匿劣势。如果你的队伍需要偷袭潜入，这影响的是所有人。</li>
  <li><strong>可选休息规则。</strong>睡眠相关惩罚取决于 DM 采用的可选规则；应用前请查看对应来源。</li>
</ol>

<h2>DND 护甲常见问题</h2>
<h3>DND 5e 中最好的护甲是什么？</h3>
<p><a href="${ARMOR_EQUIPMENT_2014_URL}"><strong>全身板甲（AC 18）</strong></a>是 2014 基础规则护甲表中基础 AC 最高的护甲。配合盾牌的 +2 可以达到 AC 20；具体 AC 还需套用战役采用的版本和角色特性。</p>

<h3>没有熟练度可以穿 DND 护甲吗？</h3>
<p>可以。按<a href="${ARMOR_EQUIPMENT_2014_URL}">2014 规则</a>，穿着不熟练的护甲会让力量或敏捷相关的属性检定、豁免与攻击处于劣势，并且无法施法。按<a href="${ARMOR_EQUIPMENT_2024_URL}">2024 规则</a>，未受相应护甲训练时，力量或敏捷相关的 D20 检定处于劣势，并且无法施法。</p>

<h3>敏捷会影响重甲 AC 吗？</h3>
<p>不会。<strong>DND 重甲</strong> 使用固定的 AC 数值，不会因敏捷修正值变化。敏捷 8 的战士和敏捷 20 的战士穿板甲的 AC 完全一样。</p>

<h3>DND 轻甲和中甲有什么区别？</h3>
<p><strong>DND 轻甲</strong>加上完整的敏捷修正值，而中甲将它封顶为 +2。没有一个敏捷门槛能让某一类护甲永远更好：例如，敏捷 +3 时镶嵌皮甲 AC 15；敏捷 +2 时胸甲 AC 16、半身板甲 AC 17。请按<a href="${ARMOR_EQUIPMENT_2014_URL}">2014 护甲表</a>，结合护甲训练、隐匿需求和预算选择。</p>

<h3>盾牌算护甲吗？</h3>
<p><a href="${ARMOR_EQUIPMENT_2014_URL}">2014 规则</a>将盾牌单独列在护甲表中并提供 +2 AC。某项能力能否与盾牌同时使用，要看该能力自己的限制文字；按<a href="${ARMOR_EQUIPMENT_2024_URL}">2024 规则</a>，还必须具备盾牌训练才能获得 AC 加值。</p>

<h2>观看 DND 护甲与 AC 机制的视频讲解</h2>
<p>AC 叠加还容易乱的话，可以看 <em>How It's Played</em> 这段视频。它把 <strong>DND 护甲</strong>、敏捷上限、盾牌、法术，以及“熟练度不会增加 AC”这个新手坑放在一起讲清楚。</p>

${liteVideoEmbed('pKxuStjRTxo', 'DND 护甲与护甲等级机制详解视频')}
`;
