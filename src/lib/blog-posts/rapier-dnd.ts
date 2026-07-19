import {
  DND_RAPIER_2014_CLASSES_URL,
  DND_RAPIER_2014_COMBAT_URL,
  DND_RAPIER_2014_EQUIPMENT_URL,
  DND_RAPIER_2024_EQUIPMENT_URL,
  DND_RAPIER_2024_ROGUE_URL,
  DND_RAPIER_VIDEO_URL,
  EN_DICE_ROLLER_PATH,
  EN_DND_ARMOR_PATH,
  EN_DND_CLASSES_PATH,
  EN_DND_DAGGER_PATH,
  EN_DND_MACE_PATH,
  EN_EDITOR_PATH,
  EN_SQUARE_TOKEN_MAKER_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_ARMOR_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_DND_DAGGER_PATH,
  ZH_DND_MACE_PATH,
  ZH_EDITOR_PATH,
  ZH_SQUARE_TOKEN_MAKER_PATH,
  liteVideoEmbed,
} from './shared';

export const rapierDndArticleHtml = String.raw`
<p>For <strong>rapier dnd</strong> builds, a rapier is usually the right sword for a Dexterity-focused character. It gives you a d8 melee weapon with Finesse. Finesse does not mean Light, and the 2024 Vex mastery is not automatic for every character holding the weapon.</p>

<p>Before I write it on a sheet, I check the same few things every time.</p>

<h2 id="quick-answer">Quick Answer: What Is a Rapier in DnD?</h2>
<p><strong>A rapier is a martial melee weapon that deals 1d8 piercing damage, costs 25 gp, weighs 2 lb, and has the Finesse property.</strong> In 2014 DnD 5e, that makes it the highest-damage one-handed Finesse melee weapon in the basic weapon table.</p>

<p>Finesse means you choose Strength or Dexterity for the attack and damage rolls, but you use the same ability for both rolls on that attack. A rapier is <strong>not</strong> a Light weapon, so basic two-weapon fighting does not treat it like a shortsword, scimitar, or dagger.</p>

<p>In the 2024 Free Rules, the rapier keeps the same core stats and adds the <strong>Vex</strong> mastery property. Vex matters only for a character who has a feature that lets them use that weapon mastery.</p>

<h2 id="stats-table">Rapier Stats Table</h2>
<table>
  <thead>
    <tr>
      <th>Rules version</th>
      <th>Category</th>
      <th>Cost</th>
      <th>Damage</th>
      <th>Weight</th>
      <th>Properties</th>
      <th>Mastery</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>2014 Basic Rules</strong></td>
      <td>Martial melee weapon</td>
      <td>25 gp</td>
      <td>1d8 piercing</td>
      <td>2 lb</td>
      <td>Finesse</td>
      <td>None</td>
    </tr>
    <tr>
      <td><strong>2024 Free Rules</strong></td>
      <td>Martial melee weapon</td>
      <td>25 GP</td>
      <td>1d8 Piercing</td>
      <td>2 lb</td>
      <td>Finesse</td>
      <td>Vex</td>
    </tr>
  </tbody>
</table>

<p>Do not skim past the property line. <strong>Finesse is the reason the rapier exists in so many Dexterity builds.</strong> The missing Light property matters just as much, because it keeps the rapier from behaving like a default off-hand weapon.</p>

<p>You can compare the <a href="${DND_RAPIER_2014_EQUIPMENT_URL}" rel="noreferrer noopener">2014 Basic Rules equipment table</a> with the <a href="${DND_RAPIER_2024_EQUIPMENT_URL}" rel="noreferrer noopener">2024 Free Rules equipment table</a> when checking a sheet at the table.</p>

<h2 id="rules-versions">2014 vs 2024 Rapier Rules</h2>
<p>The 2014 rapier is plain: martial melee weapon, Finesse, one hand. It suits characters who already have rapier or martial weapon proficiency and want a Dexterity attack with a bigger die than a dagger, shortsword, or scimitar.</p>

<p>The 2024 rapier keeps that identity and adds Vex as its mastery property. Vex says that after you hit a creature with the weapon and deal damage, you have Advantage on your next attack roll against that creature before the end of your next turn.</p>

<p>The timing is the part to slow down on. Vex does not give Advantage to the attack that triggered it. It sets up the next attack against the same creature. It also does not switch on just because the item is in your hand. The character needs a feature that lets them use the rapier's mastery property.</p>

<table>
  <thead>
    <tr>
      <th>Question</th>
      <th>2014 answer</th>
      <th>2024 answer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Does the rapier deal 1d8 piercing?</strong></td>
      <td>Yes.</td>
      <td>Yes.</td>
    </tr>
    <tr>
      <td><strong>Does it have Finesse?</strong></td>
      <td>Yes.</td>
      <td>Yes.</td>
    </tr>
    <tr>
      <td><strong>Is it Light?</strong></td>
      <td>No.</td>
      <td>No.</td>
    </tr>
    <tr>
      <td><strong>Does it support Sneak Attack?</strong></td>
      <td>Yes, because it is Finesse.</td>
      <td>Yes, because it is Finesse.</td>
    </tr>
    <tr>
      <td><strong>Does it have Vex?</strong></td>
      <td>No.</td>
      <td>Yes, for characters who can use that mastery.</td>
    </tr>
  </tbody>
</table>

<h2 id="best-users">Who Should Use a Rapier?</h2>
<p><strong>Pick a rapier when the character wants a one-handed melee weapon, uses Dexterity well, and does not need the Light property for the main plan.</strong></p>

<table>
  <thead>
    <tr>
      <th>Character type</th>
      <th>Rapier fit</th>
      <th>Why</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Rogue</strong></td>
      <td>Great</td>
      <td>Rapier is Finesse, so it qualifies for Sneak Attack when the normal Sneak Attack conditions are met.</td>
    </tr>
    <tr>
      <td><strong>Dexterity Fighter</strong></td>
      <td>Great</td>
      <td>One-handed Finesse damage, room for a shield, and 2024 Vex when the build has weapon mastery.</td>
    </tr>
    <tr>
      <td><strong>2014 Bard</strong></td>
      <td>Great</td>
      <td>2014 Bard has rapier proficiency and often values Dexterity.</td>
    </tr>
    <tr>
      <td><strong>Ranger</strong></td>
      <td>Good</td>
      <td>Martial weapon proficiency covers rapier; it works for a melee Dexterity Ranger that is not leaning on two Light weapons.</td>
    </tr>
    <tr>
      <td><strong>Paladin</strong></td>
      <td>Conditional</td>
      <td>Martial proficiency covers it, though many Paladins still build around Strength weapons. Dexterity Paladins can use it without special tricks.</td>
    </tr>
    <tr>
      <td><strong>2024 Bard</strong></td>
      <td>Conditional</td>
      <td>2024 Bard default weapon training is narrower. Put rapier on the sheet only when the build gains the needed proficiency.</td>
    </tr>
    <tr>
      <td><strong>Warlock</strong></td>
      <td>Conditional</td>
      <td>Default Warlock weapon proficiency is not enough for rapier. Use it when your subclass, pact, feat, or table option grants the proficiency.</td>
    </tr>
  </tbody>
</table>

<h3>Rogue</h3>
<p>For Rogues, the rapier is the classic single-weapon melee pick. It qualifies for Sneak Attack because it is Finesse, and it gives a larger damage die than a dagger, shortsword, or scimitar.</p>

<p>The awkward part is action economy. A Rogue who wants Cunning Action every round may prefer one good rapier swing over a basic two-weapon routine. A Rogue fishing for the Sneak Attack hit may still choose two Light weapons. Decide from the turn you want to play, not from a weapon ranking. For rules checks, compare the <a href="${DND_RAPIER_2014_CLASSES_URL}" rel="noreferrer noopener">2014 Rogue class rules</a> and the <a href="${DND_RAPIER_2024_ROGUE_URL}" rel="noreferrer noopener">2024 Rogue class page</a>.</p>

<h3>Fighter</h3>
<p>A Dexterity Fighter can carry rapier and shield, take the Dueling Fighting Style when they qualify, and use Vex in 2024 if the build has that mastery. At the table, this reads as a defensive duelist rather than a lightly armed skirmisher.</p>

<h3>Bard, Ranger, and Paladin</h3>
<p>A 2014 Bard can reach for a rapier without much ceremony. A Ranger uses it well when the character is built for single-weapon Dexterity melee instead of two Light weapons. A Paladin can make it work too, but many tables picture that class with Strength weapons first.</p>

<p>For 2024 Bard and Warlock builds, check the weapon training instead of relying on old habits. If you are still choosing the class shell, use the <a href="${EN_DND_CLASSES_PATH}">DND classes guide</a> and the <a href="${EN_DND_ARMOR_PATH}">DND armor guide</a> to decide whether this character is a shielded duelist, a light skirmisher, or a back-line caster who only keeps a blade for emergencies.</p>

<h2 id="weapon-comparison">Rapier vs Dagger, Shortsword, Scimitar, and Longsword</h2>
<p><strong>The rapier is the bigger one-handed Finesse die.</strong> It becomes less attractive when the build needs Light, Thrown, or simple weapon access.</p>

<table>
  <thead>
    <tr>
      <th>Weapon</th>
      <th>Damage</th>
      <th>Key properties</th>
      <th>Best use</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Rapier</strong></td>
      <td>1d8 piercing</td>
      <td>Finesse</td>
      <td>Single-weapon Dexterity melee, Rogue Sneak Attack, duelist builds.</td>
    </tr>
    <tr>
      <td><strong>Dagger</strong></td>
      <td>1d4 piercing</td>
      <td>Finesse, Light, Thrown</td>
      <td>Backup weapon, thrown option, simple weapon access.</td>
    </tr>
    <tr>
      <td><strong>Shortsword</strong></td>
      <td>1d6 piercing</td>
      <td>Finesse, Light</td>
      <td>Basic two-weapon fighting, Rogue backup plan.</td>
    </tr>
    <tr>
      <td><strong>Scimitar</strong></td>
      <td>1d6 slashing</td>
      <td>Finesse, Light</td>
      <td>Basic two-weapon fighting with slashing flavor.</td>
    </tr>
    <tr>
      <td><strong>Longsword</strong></td>
      <td>1d8 slashing / versatile</td>
      <td>Versatile</td>
      <td>Strength builds, not default Sneak Attack support.</td>
    </tr>
  </tbody>
</table>

<p>If Sneak Attack plus one melee hit is the plan, rapier makes sense. If the turn depends on basic two-weapon fighting, shortsword or scimitar fits the rules better. If you need a thrown weapon, the dagger does something the rapier simply cannot do.</p>

<p>For a deeper comparison with backup and thrown weapons, read the <a href="${EN_DND_DAGGER_PATH}">DND Dagger guide</a>. If you want a contrast with a non-Finesse one-handed weapon, the <a href="${EN_DND_MACE_PATH}">DND Mace guide</a> shows why weapon properties matter as much as the damage die.</p>

<p>You can also test the table feel with the <a href="${EN_DICE_ROLLER_PATH}">DnD dice roller</a>: compare one rapier hit, two 1d6 Light-weapon hits, and a 2024 Vex follow-up sequence against the same target.</p>

<h2 id="dual-wield">Can You Dual Wield Rapiers?</h2>
<p><strong>Under the basic rules, no. The rapier is Finesse, but it is not Light.</strong> Basic two-weapon fighting in 2014 asks for Light melee weapons, and the 2024 Light property also controls the extra attack sequence.</p>

<p>That means <strong>rapier + dagger does not automatically give you a bonus attack through the basic two-weapon rule</strong>. The dagger is Light; the rapier is not. A feat, feature, magic item, or table ruling can change the setup, but the base weapon entry does not. When this comes up mid-session, the <a href="${DND_RAPIER_2014_COMBAT_URL}" rel="noreferrer noopener">2014 combat rules for two-weapon fighting</a> are the page to open.</p>

<ul>
  <li><strong>Pick rapier</strong> when you want one stronger Finesse melee hit.</li>
  <li><strong>Pick shortsword or scimitar</strong> when you want the basic Light-weapon route.</li>
  <li><strong>Pick dagger</strong> when you need Finesse, Light, and Thrown in one simple weapon.</li>
</ul>

<h2 id="build-examples">Rapier builds at the table</h2>
<h3>Rogue Duelist</h3>
<p>A Rogue with a rapier usually wants one accurate hit that qualifies for Sneak Attack, plus room to use Cunning Action. The loop is simple: get into position, strike, then move or hide before the fight turns ugly. On the token, keep the rapier hilt or blade angle visible; add a small "SA" label only if your table already uses ability labels.</p>

<h3>Shield Duelist</h3>
<p>A Fighter, Paladin, or qualifying Ranger can pair rapier and shield for a defensive melee profile. If the build also has Dueling Fighting Style, it still works with a one-handed melee weapon when no other weapon is held. A shield is not a weapon. For VTT art, make the shield outline readable but leave a thin highlight on the sword side, or the character turns into a generic shield guard at small size.</p>

<h3>2024 Vex User</h3>
<p>A 2024 character who can use rapier mastery gets a repeat-target pattern. Hit and deal damage, then make the next attack against that same creature with Advantage before the end of your next turn. I prefer marking the enemy, not the attacker, because Vex asks everyone to remember which creature is being followed up.</p>

<h3>DM Duelist NPC</h3>
<p>Rapiers fit social-combat enemies well: noble duelists, masked assassins, pirate officers, city-watch captains, fey courtiers, and arena champions. Before initiative even settles, the weapon tells the table this enemy is trained and probably not fighting like a brute. Faction border colors help here. A noble duelist, assassin, and guard captain should not all look like the same "person with sword" token.</p>

<h2 id="vtt-token-tips">VTT Token Tips for Rapier Characters</h2>
<p>A rapier is visually thin. That is great in character art and easy to lose on a small VTT token. Build the token around the character first, then preserve just enough weapon silhouette to signal "duelist."</p>

<ol>
  <li>Crop around the face, shoulders, and weapon-side hand.</li>
  <li>Keep the blade angle visible when it helps the silhouette.</li>
  <li>Use a high-contrast border so the thin sword does not become the only readable shape.</li>
  <li>Add a short label for NPCs, such as "Duelist", "Guard Captain", "Assassin", or "Noble".</li>
  <li>Use a square crop when a full-body fencing pose loses too much information in a circle.</li>
</ol>

<p>In the <a href="${EN_EDITOR_PATH}">Token Maker editor</a>, upload the portrait, crop around the character, choose a readable mask and border, and add a small label only if your table uses labels. Export a transparent PNG for Roll20, Foundry VTT, Owlbear, or another tabletop. If a round crop chops off the blade or the fencing pose, use the <a href="${EN_SQUARE_TOKEN_MAKER_PATH}">square token maker</a> instead.</p>

<h2 id="common-mistakes">Common Rapier Mistakes</h2>
<p>Do not call the rapier a Light weapon. It is not Light. It is Finesse. Those are different properties.</p>

<p>Do not treat Vex as automatic either. In 2024, the rapier has the Vex mastery property, but the character needs a feature that lets them use that mastery.</p>

<p>Another easy slip is splitting ability scores on the same attack. Finesse lets you choose Strength or Dexterity for the attack and damage rolls, but the same ability applies to both rolls for that attack.</p>

<p>Finally, do not give every Bard or Warlock a rapier without checking the rules version and build. 2014 Bard support is straightforward. 2024 Bard and Warlock builds need the right weapon training before rapier belongs on the sheet.</p>

<h2 id="faq">FAQ About Rapier DnD</h2>
<h3>Is a rapier a Finesse weapon in DnD?</h3>
<p>It is. The rapier has the Finesse property, so you can use Strength or Dexterity for attack and damage rolls with the weapon, as long as you use the same ability for both rolls on the attack.</p>

<h3>Can a Rogue Sneak Attack with a rapier?</h3>
<p>A rapier qualifies for Sneak Attack because it is a Finesse weapon. The Rogue still needs the normal Sneak Attack conditions from the rules version being used at the table.</p>

<h3>Is rapier better than shortsword?</h3>
<p>Use rapier for one stronger Finesse melee hit. Use shortsword when you need the Light property for a basic two-weapon fighting plan. A Rogue who wants Cunning Action often likes rapier; a Rogue who wants another attack chance often looks at Light weapons.</p>

<h3>Is rapier better than dagger?</h3>
<p>The rapier deals more melee damage. The dagger is cheaper, Light, and Thrown. I would treat the dagger as the backup or ranged emergency weapon, and the rapier as the main one-handed Finesse melee weapon.</p>

<h3>Can you use a rapier with a shield?</h3>
<p>Yes, if your character has the right proficiencies and the table is using normal shield rules. A rapier is one-handed, and a shield is not a weapon. This is a common defensive duelist setup for characters built to support it.</p>

<h3>Does rapier have Vex in DnD 2024?</h3>
<p>In the 2024 Free Rules, the rapier has the Vex mastery property. The character still needs a feature that lets them use that weapon mastery.</p>

<h3>Does Vex give Advantage on the same attack?</h3>
<p>Vex triggers after you hit and deal damage. It gives Advantage on your next attack roll against that creature before the end of your next turn, not on the attack that triggered it.</p>

<h2 id="sources-next-steps">Rules sources</h2>

<ul>
  <li><a href="${DND_RAPIER_2014_EQUIPMENT_URL}" rel="noreferrer noopener">D&amp;D Beyond 2014 Basic Rules, Equipment</a></li>
  <li><a href="${DND_RAPIER_2014_COMBAT_URL}" rel="noreferrer noopener">D&amp;D Beyond 2014 Basic Rules, Combat</a></li>
  <li><a href="${DND_RAPIER_2024_EQUIPMENT_URL}" rel="noreferrer noopener">D&amp;D Beyond 2024 Free Rules, Equipment</a></li>
  <li><a href="${DND_RAPIER_2024_ROGUE_URL}" rel="noreferrer noopener">D&amp;D Beyond 2024 Rogue class page</a></li>
</ul>

<p>If you are choosing between rapier, shortsword, and dagger before a session, test the attack pattern with the <a href="${EN_DICE_ROLLER_PATH}">DnD dice roller</a>. Once the build is set, use the <a href="${EN_EDITOR_PATH}">Token Maker editor</a> for a duelist, Rogue, or NPC token your table can recognize without squinting at the map.</p>

<h2 id="video">Rapier DnD video</h2>
<p>The <a href="${DND_RAPIER_VIDEO_URL}" rel="noreferrer noopener">rapier DnD video</a> is the short version for prep: Finesse matters, Light is absent, and Vex only helps characters who can actually use the mastery.</p>

${liteVideoEmbed('JiNIb5KzNz0', 'Rapier DnD video')}
`;

export const rapierDndArticleHtmlZh = String.raw`
<p><strong>rapier dnd</strong> 对敏捷近战角色通常很合适：细剑（Rapier）是 d8 伤害骰，又有灵巧（Finesse）。但桌上也很容易把它说错。灵巧不等于轻型（Light），2024 规则里的 Vex 也不是每个拿细剑的人都会自动获得。</p>

<p>写进角色卡前，我通常会先核对这几件事。</p>

<h2 id="quick-answer">速查：DnD 里的细剑是什么？</h2>
<p><strong>细剑（Rapier）是一把军用近战武器（martial melee weapon），造成 1d8 穿刺伤害（piercing damage），价格 25 gp，重量 2 lb，并拥有灵巧（Finesse）属性。</strong> 在 2014 版 DnD 5e 的基础武器表里，它是单手灵巧近战武器中伤害骰最大的选择。</p>

<p>灵巧（Finesse）的意思是：这次攻击的攻击检定和伤害掷骰可以选择用力量（Strength）或敏捷（Dexterity），但同一次攻击里必须用同一个属性，不能攻击检定用敏捷、伤害改用力量。细剑<strong>不是</strong>轻型（Light）武器，所以基础双武器战斗不会把它当成短剑（shortsword）、弯刀（scimitar）或匕首（dagger）来处理。</p>

<p>在 2024 免费规则里，细剑保留同样的核心数据，并获得 <strong>Vex</strong> 作为武器掌握（weapon mastery）属性。Vex 只有在角色本身拥有使用该武器掌握的特性或选项时才生效。</p>

<h2 id="stats-table">细剑数据表</h2>
<table>
  <thead>
    <tr>
      <th>规则版本</th>
      <th>分类</th>
      <th>价格</th>
      <th>伤害</th>
      <th>重量</th>
      <th>属性</th>
      <th>掌握</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>2014 基础规则</strong></td>
      <td>军用近战武器</td>
      <td>25 gp</td>
      <td>1d8 穿刺</td>
      <td>2 lb</td>
      <td>灵巧（Finesse）</td>
      <td>无</td>
    </tr>
    <tr>
      <td><strong>2024 免费规则</strong></td>
      <td>军用近战武器</td>
      <td>25 GP</td>
      <td>1d8 穿刺</td>
      <td>2 lb</td>
      <td>灵巧（Finesse）</td>
      <td>Vex</td>
    </tr>
  </tbody>
</table>

<p>别只看伤害骰，真正要盯的是属性栏。<strong>灵巧（Finesse）是细剑会出现在大量敏捷构筑里的原因。</strong> 缺少轻型（Light）也同样要记住，因为它不能像默认副手武器那样运作。</p>

<p>如果你要在桌上核对角色卡，可以直接对照 <a href="${DND_RAPIER_2014_EQUIPMENT_URL}" rel="noreferrer noopener">2014 基础规则装备表（Equipment）</a> 和 <a href="${DND_RAPIER_2024_EQUIPMENT_URL}" rel="noreferrer noopener">2024 免费规则装备表（Equipment）</a>。</p>

<h2 id="rules-versions">2014 与 2024 细剑规则差异</h2>
<p>2014 版细剑不绕弯：军用近战武器，单手，灵巧（Finesse）。如果角色有细剑或军用武器熟练，又想用敏捷做近战攻击，还想比匕首、短剑或弯刀多一点伤害骰，它就很合适。</p>

<p>2024 版细剑保留这个定位，并把 Vex 加为它的武器掌握属性。Vex 的效果是：当你用这把武器命中一个生物并造成伤害后，在你下回合结束前，你对同一个生物的下一次攻击检定具有优势（Advantage）。</p>

<p>这里要慢一点看时机。Vex 不会让触发它的同一次攻击获得优势，它设置的是之后对同一个目标的下一次攻击。它也不会因为你手里拿着细剑就自动开启；角色需要有能使用细剑武器掌握的职业特性、专长、选项或其他来源。</p>

<table>
  <thead>
    <tr>
      <th>问题</th>
      <th>2014 答案</th>
      <th>2024 答案</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>细剑造成 1d8 穿刺伤害吗？</strong></td>
      <td>是。</td>
      <td>是。</td>
    </tr>
    <tr>
      <td><strong>它有灵巧（Finesse）吗？</strong></td>
      <td>有。</td>
      <td>有。</td>
    </tr>
    <tr>
      <td><strong>它是轻型（Light）武器吗？</strong></td>
      <td>不是。</td>
      <td>不是。</td>
    </tr>
    <tr>
      <td><strong>它能配合偷袭（Sneak Attack）吗？</strong></td>
      <td>能，因为它有灵巧（Finesse）。</td>
      <td>能，因为它有灵巧（Finesse）。</td>
    </tr>
    <tr>
      <td><strong>它有 Vex 吗？</strong></td>
      <td>没有。</td>
      <td>有，但只有能使用该武器掌握的角色才能用。</td>
    </tr>
  </tbody>
</table>

<h2 id="best-users">谁最适合用细剑？</h2>
<p><strong>如果角色想用单手近战武器，敏捷不错，而且主要打法不依赖轻型（Light），细剑就值得放进候选。</strong></p>

<table>
  <thead>
    <tr>
      <th>角色类型</th>
      <th>细剑适配度</th>
      <th>原因</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>游荡者（Rogue）</strong></td>
      <td>很好</td>
      <td>细剑有灵巧（Finesse），正常满足偷袭（Sneak Attack）条件时可以用来偷袭。</td>
    </tr>
    <tr>
      <td><strong>敏捷战士（Dexterity Fighter）</strong></td>
      <td>很好</td>
      <td>单手灵巧伤害、能配盾，2024 规则里有武器掌握时还能使用 Vex。</td>
    </tr>
    <tr>
      <td><strong>2014 版吟游诗人（Bard）</strong></td>
      <td>很好</td>
      <td>2014 Bard 有细剑熟练，而且很多 Bard 会重视敏捷。</td>
    </tr>
    <tr>
      <td><strong>游侠（Ranger）</strong></td>
      <td>不错</td>
      <td>军用武器熟练覆盖细剑；适合不走双轻型武器路线的敏捷近战 Ranger。</td>
    </tr>
    <tr>
      <td><strong>圣武士（Paladin）</strong></td>
      <td>看构筑</td>
      <td>军用武器熟练可以覆盖，但许多 Paladin 会围绕力量武器构筑。敏捷 Paladin 不需要额外绕规则。</td>
    </tr>
    <tr>
      <td><strong>2024 版吟游诗人（Bard）</strong></td>
      <td>看构筑</td>
      <td>2024 Bard 默认武器训练更窄。只有当构筑获得所需熟练时，才把细剑写进角色卡。</td>
    </tr>
    <tr>
      <td><strong>邪术师（Warlock）</strong></td>
      <td>看构筑</td>
      <td>默认 Warlock 武器熟练不足以覆盖细剑。需要子职、契约、专长或桌规提供熟练。</td>
    </tr>
  </tbody>
</table>

<h3>游荡者（Rogue）</h3>
<p>对游荡者（Rogue）来说，细剑是经典的单武器近战选择。它因为灵巧（Finesse）而符合偷袭（Sneak Attack）的武器要求，伤害骰也比匕首、短剑或弯刀更大。</p>

<p>真正卡人的地方是动作经济。每回合想保留灵巧动作（Cunning Action）的游荡者，通常会接受一次质量更高的细剑攻击。想多一次命中机会来打出偷袭的游荡者，则可能更偏向两把轻型（Light）武器。先想清楚这一回合怎么跑，再决定武器。规则核对可以看 <a href="${DND_RAPIER_2014_CLASSES_URL}" rel="noreferrer noopener">2014 Rogue 职业规则</a> 和 <a href="${DND_RAPIER_2024_ROGUE_URL}" rel="noreferrer noopener">2024 Rogue 职业页面</a>。</p>

<h3>战士（Fighter）</h3>
<p>敏捷战士可以细剑加盾，也可以在符合条件时使用决斗（Dueling）战斗风格；2024 规则中，如果构筑有对应武器掌握，还能使用 Vex。桌上看起来就是一个偏防御的决斗者，不是两把轻武器乱舞的游击手。</p>

<h3>吟游诗人、游侠与圣武士</h3>
<p>2014 版吟游诗人（Bard）拿细剑很顺手。游侠（Ranger）如果想走单武器敏捷近战，而不是两把轻型武器，也能用得上。圣武士（Paladin）可以走敏捷路线，只是多数桌第一反应仍然会想到力量武器。</p>

<p>2024 版吟游诗人（Bard）和邪术师（Warlock）不要凭老习惯直接假设能用细剑。先检查实际武器训练，再写进角色卡。如果你还在选职业框架，可以搭配 <a href="${ZH_DND_CLASSES_PATH}">DND 职业指南</a> 和 <a href="${ZH_DND_ARMOR_PATH}">DND 护甲指南</a>，判断这个角色更像持盾决斗者、轻装游击者，还是只把刀锋当备用方案的施法者。</p>

<h2 id="weapon-comparison">细剑 vs 匕首、短剑、弯刀与长剑</h2>
<p><strong>想要更大的单手灵巧（Finesse）伤害骰，细剑占优。</strong> 如果打法需要轻型（Light）、投掷（Thrown）或简易武器（simple weapon）熟练，它就没那么合适。</p>

<table>
  <thead>
    <tr>
      <th>武器</th>
      <th>伤害</th>
      <th>关键属性</th>
      <th>最适合用途</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>细剑（Rapier）</strong></td>
      <td>1d8 穿刺</td>
      <td>灵巧（Finesse）</td>
      <td>单武器敏捷近战、游荡者偷袭、决斗者构筑。</td>
    </tr>
    <tr>
      <td><strong>匕首（Dagger）</strong></td>
      <td>1d4 穿刺</td>
      <td>灵巧、轻型、投掷</td>
      <td>备用武器、投掷选项、简易武器熟练。</td>
    </tr>
    <tr>
      <td><strong>短剑（Shortsword）</strong></td>
      <td>1d6 穿刺</td>
      <td>灵巧、轻型</td>
      <td>基础双武器战斗、游荡者备用计划。</td>
    </tr>
    <tr>
      <td><strong>弯刀（Scimitar）</strong></td>
      <td>1d6 挥砍</td>
      <td>灵巧、轻型</td>
      <td>带挥砍风味的基础双武器战斗。</td>
    </tr>
    <tr>
      <td><strong>长剑（Longsword）</strong></td>
      <td>1d8 挥砍 / 多用</td>
      <td>多用（Versatile）</td>
      <td>力量构筑；默认不支持 Sneak Attack。</td>
    </tr>
  </tbody>
</table>

<p>如果计划是偷袭（Sneak Attack）加一次近战命中，细剑说得通。如果整套打法围绕基础双武器战斗，短剑或弯刀更贴规则。如果你需要投掷武器，匕首能做细剑做不了的事。</p>

<p>想更深入比较备用和投掷武器，可以看 <a href="${ZH_DND_DAGGER_PATH}">DND 匕首指南</a>。如果你想对比一把没有灵巧（Finesse）的单手武器，<a href="${ZH_DND_MACE_PATH}">DND 钉头锤指南</a>能说明为什么武器属性和伤害骰一样重要。</p>

<p>你也可以用 <a href="${ZH_DICE_ROLLER_PATH}">DnD 骰子工具</a>模拟桌上手感：比较一次细剑命中、两次 1d6 轻型武器攻击，以及 2024 Vex 后续攻击的差异。</p>

<h2 id="dual-wield">细剑可以双持吗？</h2>
<p><strong>按基础规则，不行。细剑有灵巧（Finesse），但不是轻型（Light）。</strong> 2014 版基础双武器战斗要求轻型近战武器，2024 版轻型属性也控制额外攻击流程。</p>

<p>也就是说，<strong>细剑 + 匕首不会因为基础双武器规则自动给你一次附赠动作攻击</strong>。匕首是轻型，细剑不是。专长、职业特性、魔法物品或桌规可以改变这个组合，但基础武器条目本身不会。这个问题最容易争，建议直接看 <a href="${DND_RAPIER_2014_COMBAT_URL}" rel="noreferrer noopener">2014 战斗规则里的双武器战斗（Two-Weapon Fighting）</a>。</p>

<ul>
  <li><strong>想要一次更强的灵巧近战命中</strong>，选细剑。</li>
  <li><strong>想走基础轻型武器路线</strong>，选短剑或弯刀。</li>
  <li><strong>需要灵巧、轻型和投掷都在一把简易武器上</strong>，选匕首。</li>
</ul>

<h2 id="build-examples">桌上常见的细剑角色</h2>
<h3>游荡者（Rogue）决斗者</h3>
<p>拿细剑的游荡者通常想要一次可靠命中来满足偷袭（Sneak Attack），同时保留灵巧动作（Cunning Action）的空间。跑法很直观：找位置，刺一下，然后撤退、躲藏或换位。Token 用近景头像就够，保留细剑护手或剑身角度；只有当你的桌真的用 Token 标签追踪能力时，再加一个小的“偷袭”或职业标记。</p>

<h3>持盾决斗者</h3>
<p>战士（Fighter）、圣武士（Paladin）或符合条件的游侠（Ranger）可以用细剑加盾形成防御型近战轮廓。如果构筑还有决斗（Dueling）战斗风格，单手近战武器且没有持另一把武器时可以配合；盾牌不是武器。做 Token 时让盾牌轮廓清楚，同时在剑的一侧保留细一点的高光，避免角色缩小后看起来只是普通盾卫。</p>

<h3>2024 Vex 使用者</h3>
<p>能使用细剑武器掌握的 2024 角色，会形成重复追打同一目标的节奏：先命中并造成伤害，然后在你下回合结束前，对同一生物的下一次攻击获得优势。第一次命中后，我更愿意把小目标标记或状态环放在敌人身上，而不是只放在攻击者身上，因为 Vex 要记住的是后续要打哪一个生物。</p>

<h3>DM 的决斗者 NPC</h3>
<p>细剑很适合社交战斗型敌人：贵族决斗家、蒙面刺客、海盗军官、城卫队长、妖精宫廷人物和竞技场冠军。玩家看到武器时，大概就会知道这不是靠蛮力乱砍的敌人。这类 NPC 可以用不同阵营边框，让贵族决斗家、刺客和城卫队长不要都变成“拿剑的人”。</p>

<h2 id="vtt-token-tips">细剑角色的 VTT Token 建议</h2>
<p>细剑在视觉上很细。角色插画里这很漂亮，但缩到 VTT 小 Token 上就容易丢失。先围绕角色本身做 Token，再保留足够的武器剪影，让玩家一眼知道这是“决斗者”。</p>

<ol>
  <li>围绕脸、肩膀和持剑侧手部裁切。</li>
  <li>如果剑身角度能帮助识别，就尽量保留。</li>
  <li>使用高对比边框，不要让细剑成为唯一可读形状。</li>
  <li>NPC 可以加短标签，例如“决斗者”、“卫队长”、“刺客”或“贵族”。</li>
  <li>如果全身击剑姿势放进圆形裁切后信息损失太多，改用方形裁切。</li>
</ol>

<p>在 <a href="${ZH_EDITOR_PATH}">Token Maker 编辑器</a>里，上传头像，围绕角色裁切，选择清晰的遮罩和边框；如果桌上确实用标签，再加一个小标签。导出透明 PNG 后，可以放进 Roll20、Foundry VTT、Owlbear 或其他虚拟桌面。圆形裁切如果截掉剑身或姿势，就改用 <a href="${ZH_SQUARE_TOKEN_MAKER_PATH}">方形 Token 制作工具</a>。</p>

<h2 id="common-mistakes">常见细剑误区</h2>
<p>别把细剑叫成轻型（Light）武器。它不是 Light，它是灵巧（Finesse）。这是两种完全不同的武器属性。</p>

<p>也别把 Vex 当成自动生效。2024 规则里细剑有 Vex 武器掌握属性，但角色仍然需要有使用该武器掌握的特性或选项。</p>

<p>另一个常见误读，是同一次攻击里拆开属性。灵巧（Finesse）允许你为攻击和伤害选择力量或敏捷，但同一次攻击的攻击检定和伤害掷骰必须用同一个属性。</p>

<p>最后，不要不看版本和构筑就给每个吟游诗人（Bard）或邪术师（Warlock）填上细剑。2014 版吟游诗人比较直接；2024 版吟游诗人和邪术师往往要先拿到正确的武器训练。</p>

<h2 id="faq">DND 细剑常见问题</h2>
<h3>细剑是 DnD 里的灵巧（Finesse）武器吗？</h3>
<p>是，细剑有灵巧（Finesse）属性。你可以用力量或敏捷进行这把武器的攻击检定和伤害掷骰，但同一次攻击必须两者都用同一个属性。</p>

<h3>游荡者（Rogue）可以用细剑偷袭（Sneak Attack）吗？</h3>
<p>细剑因为有灵巧（Finesse）而符合偷袭（Sneak Attack）的武器要求。不过游荡者（Rogue）仍然必须满足当前规则版本下正常的 Sneak Attack 条件。</p>

<h3>细剑比短剑更好吗？</h3>
<p>想要一次更强的灵巧近战命中，细剑更合适。需要轻型（Light）属性来走基础双武器战斗时，短剑更合适。想保留灵巧动作（Cunning Action）的游荡者常喜欢细剑；想多一次命中机会的游荡者常会看轻型武器。</p>

<h3>细剑比匕首更好吗？</h3>
<p>近战伤害上，细剑更高。匕首更便宜，有轻型（Light）和投掷（Thrown）。我会把匕首当备用或远程应急武器，把细剑当单手灵巧近战主武器。</p>

<h3>细剑可以配盾牌吗？</h3>
<p>可以，只要角色有正确熟练，且桌上使用正常盾牌规则。细剑是单手武器，盾牌不是武器。支持这个构筑的角色，经常会走防御型决斗者路线。</p>

<h3>2024 DnD 里细剑有 Vex 吗？</h3>
<p>2024 免费规则中，细剑有 Vex 武器掌握属性。但角色仍然需要有能使用该武器掌握的职业特性、专长、选项或其他来源。</p>

<h3>Vex 会让同一次攻击获得优势吗？</h3>
<p>Vex 是在你命中并造成伤害之后触发，让你在下回合结束前对同一个生物的下一次攻击检定获得优势。触发 Vex 的那次攻击本身不会因此获得优势。</p>

<h2 id="sources-next-steps">规则来源</h2>

<ul>
  <li><a href="${DND_RAPIER_2014_EQUIPMENT_URL}" rel="noreferrer noopener">D&amp;D Beyond 2014 Basic Rules, Equipment</a></li>
  <li><a href="${DND_RAPIER_2014_COMBAT_URL}" rel="noreferrer noopener">D&amp;D Beyond 2014 Basic Rules, Combat</a></li>
  <li><a href="${DND_RAPIER_2024_EQUIPMENT_URL}" rel="noreferrer noopener">D&amp;D Beyond 2024 Free Rules, Equipment</a></li>
  <li><a href="${DND_RAPIER_2024_ROGUE_URL}" rel="noreferrer noopener">D&amp;D Beyond 2024 Rogue class page</a></li>
</ul>

<p>如果你还在细剑、短剑和匕首之间犹豫，可以先用 <a href="${ZH_DICE_ROLLER_PATH}">DnD 骰子工具</a>试一下攻击节奏。构筑定下来后，再打开 <a href="${ZH_EDITOR_PATH}">Token Maker 编辑器</a>，做一个玩家在地图上不用眯眼也能认出来的决斗者、游荡者（Rogue）或 NPC Token。</p>

<h2 id="video">DND 细剑（Rapier）视频</h2>
<p>这支 <a href="${DND_RAPIER_VIDEO_URL}" rel="noreferrer noopener">DND 细剑（Rapier）视频</a>适合开团前看一遍：灵巧（Finesse）很重要，轻型（Light）不存在，Vex 只帮助真正能使用该武器掌握的角色。</p>

${liteVideoEmbed('JiNIb5KzNz0', 'DND 细剑（Rapier）视频')}
`;
