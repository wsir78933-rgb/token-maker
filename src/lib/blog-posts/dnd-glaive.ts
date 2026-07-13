import {
  DND_GLAIVE_2014_RULES_URL,
  DND_GLAIVE_2024_RULES_URL,
  DND_GLAIVE_VIDEO_PLACEHOLDER_PATH,
  DND_GLAIVE_VIDEO_URL,
  EN_DICE_ROLLER_PATH,
  EN_DND_ARMOR_PATH,
  EN_DND_CLASSES_PATH,
  EN_DND_MACE_PATH,
  EN_EDITOR_PATH,
  EN_RAPIER_DND_PATH,
  EN_SQUARE_TOKEN_MAKER_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_ARMOR_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_DND_MACE_PATH,
  ZH_EDITOR_PATH,
  ZH_RAPIER_DND_PATH,
  ZH_SQUARE_TOKEN_MAKER_PATH,
  liteVideoEmbed,
} from './shared';

const DND_GLAIVE_VIDEO_ID = 'zAJmvbQXm1c';

export const dndGlaiveArticleHtml = String.raw`
<p>If you searched for <strong>dnd glaive</strong>, you probably want a fast answer before you pick a weapon, a feat, or a mini for your next session. The glaive is a martial two-handed polearm with reach, strong damage, and a clear front-line identity. In 2024 rules, it also gets Graze if your character can use weapon mastery.</p>

<p>The glaive is not a subtle weapon. It asks for space on the battle map, a Strength-based character, and a player who likes controlling the distance between enemies and allies. That makes it a good fit for Fighters, Paladins, Barbarians, some Rangers, and reach-focused NPC guards or bosses.</p>

<p>If you are making a glaive user for Roll20, Foundry, or Owlbear, keep the long weapon readable in your token. A polearm build loses a lot of its table identity when the weapon disappears behind armor, wings, or a busy border. The <a href="${EN_EDITOR_PATH}">Token Maker editor</a> can crop the portrait, add a clean ring, and export a transparent PNG without opening a full image editor.</p>

<h2 id="quick-answer">Quick answer: what is a glaive in DnD?</h2>
<p><strong>A glaive is a martial melee weapon that deals 1d10 slashing damage, costs 20 GP, weighs 6 lb, and has the Heavy, Reach, and Two-Handed properties.</strong> In 2024 rules, the glaive has Graze as its weapon mastery property. In 2014 rules, the glaive does not have a weapon mastery property.</p>

<p>That gives the glaive a simple job: stand just outside normal melee range and hit hard. Reach does not make the glaive a ranged weapon. It still uses melee weapon attacks. It just lets those attacks cover more space.</p>

<h2 id="stats-table">Glaive stats table</h2>
<table>
  <thead>
    <tr>
      <th>Glaive stat</th>
      <th>Fast answer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Weapon type</strong></td>
      <td>Martial melee weapon.</td>
    </tr>
    <tr>
      <td><strong>Damage</strong></td>
      <td>1d10 slashing.</td>
    </tr>
    <tr>
      <td><strong>Cost / weight</strong></td>
      <td>20 GP / 6 lb.</td>
    </tr>
    <tr>
      <td><strong>2014 properties</strong></td>
      <td>Heavy, Reach, Two-Handed.</td>
    </tr>
    <tr>
      <td><strong>2024 mastery</strong></td>
      <td>Graze, if your character can use that weapon mastery.</td>
    </tr>
    <tr>
      <td><strong>Best users</strong></td>
      <td>Strength martials, reach fighters, Paladins, Barbarians, polearm guards, and boss NPCs.</td>
    </tr>
  </tbody>
</table>

<p>The current <a href="${DND_GLAIVE_2024_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond 2024 equipment table</a> lists the glaive with Graze. The <a href="${DND_GLAIVE_2014_RULES_URL}" rel="noreferrer noopener">Roll20 5e compendium entry</a> gives the older stat block without weapon mastery. That is why version clarity matters: the base weapon is familiar, but 2024 mastery changes the tactical comparison.</p>

<h2 id="2014-vs-2024">2014 vs 2024: what changed?</h2>
<p>The glaive did not become a different weapon. The big change is the 2024 weapon mastery column.</p>

<table>
  <thead>
    <tr>
      <th>Question</th>
      <th>2014-style answer</th>
      <th>2024 answer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Base damage</strong></td>
      <td>1d10 slashing.</td>
      <td>1d10 slashing.</td>
    </tr>
    <tr>
      <td><strong>Properties</strong></td>
      <td>Heavy, Reach, Two-Handed.</td>
      <td>Heavy, Reach, Two-Handed.</td>
    </tr>
    <tr>
      <td><strong>Mastery</strong></td>
      <td>None.</td>
      <td>Graze.</td>
    </tr>
    <tr>
      <td><strong>Glaive vs halberd</strong></td>
      <td>Same core stat line.</td>
      <td>Different mastery: glaive has Graze, halberd has Cleave.</td>
    </tr>
  </tbody>
</table>

<p><strong>In 2024 rules, the glaive has Graze as its weapon mastery property.</strong> Graze means that when your attack roll with the weapon misses a creature, you can still deal damage equal to the ability modifier used for that attack. The damage type stays the weapon's type, so a Strength glaive attack that misses can still scrape through slashing damage.</p>

<p><strong>Graze matters only for a character who has a feature that lets them use that weapon mastery.</strong> Do not assume every NPC holding a glaive gets Graze. The weapon has the mastery entry; the character still needs access.</p>

<p><strong>In 2014 rules, the glaive does not have a weapon mastery property.</strong> It is still strong because of 1d10 damage and Reach, but it does not get miss damage from the base 2014 rules.</p>

<h2 id="reach">How Reach works with a glaive</h2>
<p><strong>Reach adds 5 feet to your reach for attacks with the glaive and for opportunity attacks with it.</strong> At most grid tables, that means a Medium character with a glaive threatens 10 feet when attacking with that weapon.</p>

<p>That detail is easy to misplay. Reach is not always "my whole character has 10-foot reach forever." It matters when you attack with the glaive and when the rule checks opportunity attacks with that weapon. If you drop the glaive, swap to a dagger, or make an unarmed strike, the glaive's Reach is no longer doing the work.</p>

<ul>
  <li><strong>Front-line spacing:</strong> stand one square behind an ally and still attack over the front.</li>
  <li><strong>Reaction pressure:</strong> punish movement when your table's reaction rules and feats allow it.</li>
  <li><strong>VTT clarity:</strong> mark the threatened space if players keep forgetting the 10-foot reach.</li>
  <li><strong>Target choice:</strong> protect fragile allies by making short-reach enemies cross more space.</li>
</ul>

<h2 id="is-it-good">Is a glaive good?</h2>
<p><strong>A glaive is good for Strength-based martial characters who want reach, heavy-weapon feat support, and a clear battlefield-control role.</strong> It is less good for Dexterity builds, shield users, dual wielders, and small characters at tables using the older Heavy-property disadvantage rule.</p>

<p>The weapon's upside is not only damage. A greatsword has better average damage, but it does not create the same map pressure. A glaive tells everyone, "I care about where enemies stand."</p>

<p>Pick a glaive when you want a two-handed reach weapon, your character has martial weapon proficiency, your table tracks positioning, and you want Polearm Master, Great Weapon Master, Sentinel, or 2024 weapon mastery to matter. Skip it when you need a shield, want Dexterity support, or play mostly theater of the mind.</p>

<h2 id="weapon-comparison">Glaive vs halberd, pike, greatsword, spear, and quarterstaff</h2>
<table>
  <thead>
    <tr>
      <th>Weapon</th>
      <th>Why pick it</th>
      <th>Why skip it</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Glaive</strong></td>
      <td>1d10 slashing, Heavy, Reach, Two-Handed, Graze in 2024.</td>
      <td>Two hands, martial access, no shield.</td>
    </tr>
    <tr>
      <td><strong>Halberd</strong></td>
      <td>Very similar 2014 role, Cleave in 2024.</td>
      <td>Same two-hand cost, different mastery job.</td>
    </tr>
    <tr>
      <td><strong>Pike</strong></td>
      <td>Reach and 1d10 piercing, often cheaper.</td>
      <td>Much heavier and weaker fit for classic polearm-feat flavor.</td>
    </tr>
    <tr>
      <td><strong>Greatsword</strong></td>
      <td>Higher average damage and Graze in 2024.</td>
      <td>No Reach.</td>
    </tr>
    <tr>
      <td><strong>Spear</strong></td>
      <td>Simple, throwable, shield-friendly.</td>
      <td>Lower damage and no Heavy reach identity.</td>
    </tr>
    <tr>
      <td><strong>Quarterstaff</strong></td>
      <td>Simple, cheap, works for many classes.</td>
      <td>No Reach and lower damage.</td>
    </tr>
  </tbody>
</table>

<p><strong>The glaive and halberd share the same core 2014 stat line, so the difference is mostly visual unless your table uses source-specific magic items or house rules.</strong> In 2024, the mastery split gives them a clearer mechanical difference: glaive leans toward reliable Graze damage, while halberd leans toward Cleave.</p>

<p>If you are comparing weapon identities, the <a href="${EN_DND_MACE_PATH}">dnd mace guide</a> covers one-handed blunt weapon play, and the <a href="${EN_RAPIER_DND_PATH}">rapier dnd guide</a> covers Dexterity duelists. The glaive sits in a very different lane: two hands, Strength, reach, and a visible battlefield footprint.</p>

<h2 id="best-users">Best users and build notes</h2>
<p>Fighter is the cleanest glaive class because it has martial proficiency, extra Ability Score Improvements, fighting style access, and subclasses that enjoy positioning. Battle Master is especially comfortable because maneuvers can turn reach into control instead of raw damage only.</p>

<p>Paladin also works well. A glaive Paladin gives up shield AC, but keeps a strong holy-warrior silhouette and can threaten more space around allies. Barbarian likes the bigger weapon profile and direct Strength play. Ranger can use the weapon if the build is Strength-based, though many Rangers prefer Dexterity or ranged setups.</p>

<p>For feats, start with your rules version. Polearm Master is the classic choice for glaive users at many 2014 tables. Great Weapon Master fits the heavy two-handed profile. Sentinel can be strong at tables that reward reaction control. In 2024 games, read the feat and reaction wording at the table instead of assuming every old combo works exactly the same way.</p>

<p>If you are still choosing a class, use the <a href="${EN_DND_CLASSES_PATH}">DnD classes guide</a>. If you are deciding whether losing a shield is worth it, compare the result with the <a href="${EN_DND_ARMOR_PATH}">DND armor guide</a>.</p>

<h2 id="vtt-token-tips">VTT token tips for a glaive character</h2>
<p>A glaive character needs a readable silhouette. If the portrait is too tight, the weapon looks like a random diagonal line. If the border is too busy, the blade disappears.</p>

<ol>
  <li>Choose art where the glaive extends away from the body.</li>
  <li>Crop wide enough to show the blade or at least the polearm angle.</li>
  <li>Use a clean border that does not hide the weapon head.</li>
  <li>Add a short label such as "Glaive", "Reach", or the character name.</li>
  <li>Export a transparent PNG for Roll20, Foundry, or Owlbear.</li>
  <li>Keep a second small marker for Reach or Graze if your table uses token states.</li>
</ol>

<p>In Token Maker, use a simple round or square frame for a player character and a heavier border for a guard captain or polearm boss. For grid-first maps, the <a href="${EN_SQUARE_TOKEN_MAKER_PATH}">square token maker</a> keeps the crop predictable. For attack checks, the <a href="${EN_DICE_ROLLER_PATH}">DnD dice roller</a> is enough to test the 1d10 damage flow before the session.</p>

<h2 id="video">Glaive DnD companion video</h2>
<p>For a quick visual pass on why the glaive feels different from a sword or axe, this companion video is useful after you know the stats: <a href="${DND_GLAIVE_VIDEO_URL}" rel="noreferrer noopener">The Glaive - The Weapons We Wield in D&amp;D</a>.</p>

${liteVideoEmbed(DND_GLAIVE_VIDEO_ID, 'The Glaive - The Weapons We Wield in D&D', {
  src: DND_GLAIVE_VIDEO_PLACEHOLDER_PATH,
  alt: 'Clickable webp video cover for a dnd glaive guide showing a glaive over a VTT token frame with a play button',
})}

<h2 id="faq">Glaive DnD FAQ</h2>
<h3>How much damage does a glaive do in DnD?</h3>
<p>A glaive deals 1d10 slashing damage.</p>

<h3>Is a glaive a martial weapon?</h3>
<p>Yes. A glaive is a martial melee weapon, so your character needs martial weapon proficiency or another feature that grants proficiency with it.</p>

<h3>Does a glaive have Graze in 2024 DnD?</h3>
<p>Yes. In 2024 rules, the glaive has Graze as its weapon mastery property. The character still needs weapon mastery access to use it.</p>

<h3>Does a glaive have Reach?</h3>
<p>Yes. Reach adds 5 feet to your reach for attacks with the glaive and for opportunity attacks with it.</p>

<h3>Is a glaive better than a halberd?</h3>
<p>In 2014 rules, the glaive and halberd have the same core stats. In 2024 rules, the glaive has Graze while the halberd has Cleave, so the better choice depends on whether you want miss damage or extra-target pressure.</p>

<h3>Can you use a shield with a glaive?</h3>
<p>No for normal attacks. The glaive has the Two-Handed property, so it requires two hands when you attack with it.</p>

<h3>Is a glaive good for a Rogue?</h3>
<p>Usually no. A glaive is not a finesse or ranged weapon, so it does not fit normal Sneak Attack weapon requirements.</p>
`;

export const dndGlaiveArticleHtmlZh = String.raw`
<p>如果你在查 <strong>dnd glaive</strong>，通常不是想读一长段武器历史，而是想马上确认：这把武器伤害多少、触及怎么判、2024 版有没有 Graze、它和戟到底差在哪，以及值不值得给角色或 NPC 用。</p>

<p>简短答案：长柄刀（Glaive）是一把双手军用长柄武器，伤害不错，能打出更远的近战范围，也很适合做成地图上一眼能看懂的前排 Token。它不适合拿盾，不适合敏捷近战，也不适合不看站位的桌子。</p>

<p>如果你要把长柄刀角色放到 Roll20、Foundry 或 Owlbear，Token 上一定要让长武器轮廓清楚。武器被边框、盔甲或复杂背景吞掉后，这个角色在地图上的定位也会跟着变模糊。你可以用 <a href="${ZH_EDITOR_PATH}">VTT Token 制作工具</a>裁切角色图、加边框、加短标签，然后导出透明 PNG。</p>

<h2 id="quick-answer">快速答案：DND 里的长柄刀是什么？</h2>
<p><strong>长柄刀（Glaive）是一把军用近战武器，造成 1d10 挥砍伤害，价格 20 GP，重量 6 磅，并有重型（Heavy）、触及（Reach）和双手（Two-Handed）属性。</strong> 2024 规则里，长柄刀（Glaive）的武器掌握（Weapon Mastery）是擦伤（Graze）。2014 规则里的长柄刀没有武器掌握属性。</p>

<p>它的定位很直接：站在普通近战范围外一点，用长柄武器打人。触及不会把它变成远程武器，它仍然是近战武器，只是能覆盖更多格子。</p>

<h2 id="stats-table">长柄刀数据表</h2>
<table>
  <thead>
    <tr>
      <th>数据</th>
      <th>快速答案</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>武器类型</strong></td>
      <td>军用近战武器。</td>
    </tr>
    <tr>
      <td><strong>伤害</strong></td>
      <td>1d10 挥砍。</td>
    </tr>
    <tr>
      <td><strong>价格 / 重量</strong></td>
      <td>20 GP / 6 磅。</td>
    </tr>
    <tr>
      <td><strong>2014 属性</strong></td>
      <td>重型、触及、双手。</td>
    </tr>
    <tr>
      <td><strong>2024 掌握</strong></td>
      <td>擦伤（Graze），前提是角色能使用该武器掌握。</td>
    </tr>
    <tr>
      <td><strong>适合谁</strong></td>
      <td>力量型武者、触及前排、圣武士、野蛮人、长柄守卫和 Boss NPC。</td>
    </tr>
  </tbody>
</table>

<p>当前 <a href="${DND_GLAIVE_2024_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond 2024 装备表</a>把长柄刀列为 Graze 武器。<a href="${DND_GLAIVE_2014_RULES_URL}" rel="noreferrer noopener">Roll20 5e compendium</a>更接近旧版基础数据，不带武器掌握。写角色卡时先确认桌子用哪个版本。</p>

<h2 id="2014-vs-2024">2014 和 2024 有什么区别？</h2>
<p>长柄刀的基础伤害和属性没有变成另一把武器。真正要注意的是 2024 的武器掌握。</p>

<table>
  <thead>
    <tr>
      <th>问题</th>
      <th>2014 风格答案</th>
      <th>2024 答案</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>基础伤害</strong></td>
      <td>1d10 挥砍。</td>
      <td>1d10 挥砍。</td>
    </tr>
    <tr>
      <td><strong>属性</strong></td>
      <td>重型、触及、双手。</td>
      <td>重型、触及、双手。</td>
    </tr>
    <tr>
      <td><strong>武器掌握</strong></td>
      <td>没有。</td>
      <td>擦伤（Graze）。</td>
    </tr>
    <tr>
      <td><strong>长柄刀 vs 戟</strong></td>
      <td>核心数据相同。</td>
      <td>掌握不同：长柄刀是 Graze，戟是 Cleave。</td>
    </tr>
  </tbody>
</table>

<p><strong>2024 规则里，长柄刀（Glaive）的武器掌握（Weapon Mastery）是擦伤（Graze）。</strong> 擦伤的意思是：你用该武器攻击一个生物但未命中时，仍可以造成等于本次攻击所用属性调整值的伤害，伤害类型和武器相同。</p>

<p><strong>擦伤（Graze）只有在角色拥有能使用该武器掌握的特性或选项时才生效。</strong> 不要因为 NPC 手里拿着长柄刀，就默认它一定会触发 Graze。武器有掌握条目，角色还要有使用资格。</p>

<p><strong>2014 规则里的长柄刀没有武器掌握属性。</strong> 它仍然靠 1d10 伤害和触及吃饭，但不会因为没打中就造成擦伤伤害。</p>

<h2 id="reach">触及（Reach）怎么用？</h2>
<p><strong>触及（Reach）让你用长柄刀攻击时的触及距离增加 5 英尺，也影响你用它进行借机攻击时的触及距离。</strong> 常见网格桌上，中型角色拿长柄刀攻击时通常能打到 10 英尺外的目标。</p>

<p>这个规则容易被说得太宽。触及不是“你的角色永远 10 英尺近战范围”。它在你用长柄刀攻击时生效，也在规则检查你用这把武器进行借机攻击时生效。如果你换成匕首、空手或别的武器，长柄刀的触及就不帮忙。</p>

<ul>
  <li><strong>前排站位：</strong>站在盾牌前排后面一格，仍然能攻击。</li>
  <li><strong>反应压力：</strong>在规则和专长允许时，惩罚试图穿过你控制范围的敌人。</li>
  <li><strong>VTT 清晰度：</strong>如果玩家总忘记 10 英尺范围，就在地图上加一个触及标记。</li>
  <li><strong>目标选择：</strong>让脆弱队友离短手怪物远一点。</li>
</ul>

<h2 id="is-it-good">长柄刀好用吗？</h2>
<p><strong>长柄刀适合想要触及、重型武器支持和战场控制感的力量型武者。</strong> 它不适合敏捷构筑、盾牌角色、双持角色，也不适合不怎么管站位的桌子。</p>

<p>长柄刀的优点不只是伤害。巨剑平均伤害更高，但没有触及。长柄刀真正告诉桌子的东西是：这个角色在乎敌人站在哪里。</p>

<p>适合选择长柄刀的情况：你想用双手触及武器、角色有军用武器熟练、你愿意放弃盾牌、桌子用网格或明确站位，而且你想让 Polearm Master、Great Weapon Master、Sentinel 或 2024 武器掌握有存在感。</p>

<h2 id="weapon-comparison">长柄刀、戟、长枪、巨剑、矛和长棍怎么选？</h2>
<table>
  <thead>
    <tr>
      <th>武器</th>
      <th>为什么选</th>
      <th>为什么不选</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>长柄刀（Glaive）</strong></td>
      <td>1d10 挥砍、重型、触及、双手，2024 有 Graze。</td>
      <td>需要双手、军用熟练、不能拿盾。</td>
    </tr>
    <tr>
      <td><strong>戟（Halberd）</strong></td>
      <td>2014 定位很接近，2024 有 Cleave。</td>
      <td>同样占双手，掌握方向不同。</td>
    </tr>
    <tr>
      <td><strong>长枪（Pike）</strong></td>
      <td>触及、1d10 穿刺，价格常更低。</td>
      <td>很重，经典长柄专长画面感通常不如长柄刀。</td>
    </tr>
    <tr>
      <td><strong>巨剑（Greatsword）</strong></td>
      <td>平均伤害更高，2024 也有 Graze。</td>
      <td>没有触及。</td>
    </tr>
    <tr>
      <td><strong>矛（Spear）</strong></td>
      <td>简单武器、可投掷、能配盾。</td>
      <td>伤害更低，没有重型触及定位。</td>
    </tr>
    <tr>
      <td><strong>长棍（Quarterstaff）</strong></td>
      <td>简单、便宜、很多职业能用。</td>
      <td>没有触及，伤害也低。</td>
    </tr>
  </tbody>
</table>

<p><strong>长柄刀和戟（Halberd）在 2014 核心数据上相同，所以差异主要是视觉和角色概念，除非你的桌子使用特定来源的魔法物品或房规。</strong> 到了 2024，掌握属性把它们分开了：长柄刀偏向 Graze 的稳定擦伤，戟偏向 Cleave 的第二目标压力。</p>

<p>如果你还在比较武器身份，<a href="${ZH_DND_MACE_PATH}">dnd mace 指南</a>更偏单手钝器，<a href="${ZH_RAPIER_DND_PATH}">DND 细剑指南</a>更偏敏捷决斗者。长柄刀是另一条路线：双手、力量、触及，以及地图上很明显的控制范围。</p>

<h2 id="best-users">谁最适合用长柄刀？</h2>
<p>战士（Fighter）最干净：军用熟练、更多属性提升/专长机会、战斗风格，以及很多吃站位的子职。战斗大师（Battle Master）尤其舒服，因为机动和控制可以把触及变成真正的战术选择。</p>

<p>圣武士（Paladin）也能用。长柄刀圣武士少了盾牌 AC，但画面很强，也能在盟友附近覆盖更多空间。野蛮人（Barbarian）喜欢大武器和力量打法。游侠（Ranger）可以走力量长柄路线，但很多游侠还是更偏敏捷或远程。</p>

<p>专长要先看规则版本。Polearm Master 是很多 2014 桌的经典长柄选择。Great Weapon Master 符合重型双手武器路线。Sentinel 在重视反应和站位控制的桌子很强。2024 桌不要自动照搬旧组合，先读当前专长和反应规则。</p>

<p>如果你还在判断职业路线，可以看 <a href="${ZH_DND_CLASSES_PATH}">DnD 职业指南</a>。如果你在犹豫放弃盾牌值不值，可以对照 <a href="${ZH_DND_ARMOR_PATH}">DND 护甲指南</a>看最终 AC 和站位。</p>

<h2 id="vtt-token-tips">VTT Token 上怎么表现长柄刀？</h2>
<p>长柄刀角色需要清楚轮廓。裁切太紧，武器会变成一条看不懂的斜线；边框太复杂，刀头会消失。</p>

<ol>
  <li>选一张长柄刀从身体侧面或前方伸出的角色图。</li>
  <li>裁切时留出刀头或至少保留长柄方向。</li>
  <li>用干净边框，不要挡住武器头部。</li>
  <li>标签保持短，比如 "Glaive"、"Reach" 或角色名。</li>
  <li>为 Roll20、Foundry 或 Owlbear 导出透明 PNG。</li>
  <li>如果桌子用状态标记，另外准备一个 Reach 或 Graze 小标记。</li>
</ol>

<p>在 Token Maker 里，玩家角色可以用简单圆框或方框；守卫队长、长柄 Boss 可以用更厚的边框。方格地图优先用 <a href="${ZH_SQUARE_TOKEN_MAKER_PATH}">square token maker</a> 控制 1:1 裁切。想测试攻击和 1d10 伤害，可以用 <a href="${ZH_DICE_ROLLER_PATH}">D&amp;D dice roller</a> 做 session 前检查。</p>

<h2 id="video">DND 长柄刀配套视频</h2>
<p>如果你已经知道数据，只想看长柄刀为什么不像普通剑斧那样跑，可以看这个视频：<a href="${DND_GLAIVE_VIDEO_URL}" rel="noreferrer noopener">The Glaive - The Weapons We Wield in D&amp;D</a>。</p>

${liteVideoEmbed(DND_GLAIVE_VIDEO_ID, 'The Glaive - The Weapons We Wield in D&D', {
  src: DND_GLAIVE_VIDEO_PLACEHOLDER_PATH,
  alt: 'DND 长柄刀指南的视频封面占位图，画面是 VTT Token 圆框上的长柄刀和播放按钮',
})}

<h2 id="faq">DND 长柄刀常见问题</h2>
<h3>DND 长柄刀造成多少伤害？</h3>
<p>长柄刀造成 1d10 挥砍伤害。</p>

<h3>长柄刀是军用武器吗？</h3>
<p>是。长柄刀是军用近战武器，角色需要军用武器熟练，或通过其他特性获得对应熟练。</p>

<h3>2024 DnD 里长柄刀有 Graze 吗？</h3>
<p>有。2024 规则里，长柄刀的武器掌握是擦伤（Graze），但角色仍然需要能使用该武器掌握的特性或选项。</p>

<h3>长柄刀有 Reach 吗？</h3>
<p>有。触及（Reach）让你用长柄刀攻击时的触及距离增加 5 英尺，也影响你用它进行借机攻击时的触及距离。</p>

<h3>长柄刀比戟更好吗？</h3>
<p>2014 规则里两者核心数据相同。2024 规则里，长柄刀是 Graze，戟是 Cleave，选择取决于你更想要未命中擦伤，还是第二目标压力。</p>

<h3>长柄刀可以配盾吗？</h3>
<p>正常攻击时不行。长柄刀有双手（Two-Handed）属性，攻击时需要两只手。</p>

<h3>游荡者（Rogue）适合用长柄刀吗？</h3>
<p>通常不适合。长柄刀不是灵巧武器，也不是远程武器，所以不符合普通偷袭（Sneak Attack）武器要求。</p>
`;
