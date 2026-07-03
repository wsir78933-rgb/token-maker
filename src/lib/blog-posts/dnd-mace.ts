import {
  DND_MACE_2014_RULES_URL,
  DND_MACE_2024_RULES_URL,
  DND_MACE_COMPARISON_IMAGE_PATH,
  DND_MACE_VIDEO_PLACEHOLDER_PATH,
  DND_MACE_VIDEO_URL,
  DND_MACE_WIKIPEDIA_URL,
  EN_DICE_ROLLER_PATH,
  EN_DND_ARMOR_PATH,
  EN_DND_CLASSES_PATH,
  EN_EDITOR_PATH,
  EN_SQUARE_TOKEN_MAKER_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_ARMOR_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_EDITOR_PATH,
  ZH_SQUARE_TOKEN_MAKER_PATH,
  liteVideoEmbed,
} from './shared';

export const dndMaceArticleHtml = String.raw`
<p><strong>dnd mace</strong> is a simple melee weapon that deals <strong>1d6 bludgeoning damage</strong>, costs 5 gp, weighs 4 lb, and works best for shield users, Clerics, guards, cultists, and characters who want a blunt weapon without martial weapon access. Start with the table below, then decide whether the mace is worth choosing over a club, quarterstaff, warhammer, or flail.</p>

<table>
  <thead>
    <tr>
      <th>dnd mace stat</th>
      <th>Fast answer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Weapon type</strong></td>
      <td>Simple melee weapon.</td>
    </tr>
    <tr>
      <td><strong>Damage</strong></td>
      <td>1d6 bludgeoning.</td>
    </tr>
    <tr>
      <td><strong>Cost / weight</strong></td>
      <td>5 gp / 4 lb.</td>
    </tr>
    <tr>
      <td><strong>2014 properties</strong></td>
      <td>No Finesse, Light, Thrown, Reach, or Versatile property.</td>
    </tr>
    <tr>
      <td><strong>2024 mastery</strong></td>
      <td>Sap, if your character has the right weapon mastery access.</td>
    </tr>
    <tr>
      <td><strong>Best users</strong></td>
      <td>Clerics, Strength-based simple-weapon users, shield users, temple guards, and armored NPCs.</td>
    </tr>
  </tbody>
</table>

<p>My table take: a mace is not a flashy damage pick. It is useful because it is <strong>simple, one-handed, blunt, easy to justify on religious or guard characters, and readable on a VTT token</strong>.</p>

<p>If you are building a mace-wielding character for Roll20, Foundry, or Owlbear Rodeo, make the portrait readable in the <a href="${EN_EDITOR_PATH}">VTT token maker</a>. For grid-first maps, export a 1:1 portrait through the <a href="${EN_SQUARE_TOKEN_MAKER_PATH}">square token maker</a>, then test the 1d6 roll in the <a href="${EN_DICE_ROLLER_PATH}">D&amp;D dice roller</a>.</p>

<h2 id="quick-stats">dnd mace Quick Stats</h2>
<p><strong>A dnd mace deals 1d6 bludgeoning damage, costs 5 gp, weighs 4 lb, and uses Strength for normal attacks unless a feature says otherwise.</strong> It is simple, one-handed, and deliberately plain.</p>

<p>If your table uses 2014 rules, treat the mace as a plain 1d6 simple weapon for Strength characters who want a shield hand free. If your table uses 2024 rules, keep the same stat line but pay attention to <strong>Sap</strong>: that one mastery can turn a basic mace hit into a small defensive play. You can compare the <a href="${DND_MACE_2014_RULES_URL}" rel="noreferrer noopener">2014 weapon table</a>, the <a href="${DND_MACE_2024_RULES_URL}" rel="noreferrer noopener">2024 equipment table</a>, and the <a href="${DND_MACE_WIKIPEDIA_URL}" rel="noreferrer noopener">mace background</a> if you want the weapon to match both rules and flavor.</p>

<ul>
  <li><strong>Damage type:</strong> bludgeoning, which matters when a creature or object calls out bludgeoning damage.</li>
  <li><strong>Ability score:</strong> normally Strength, because the mace does not have Finesse.</li>
  <li><strong>Hand use:</strong> one-handed, so it pairs naturally with a shield.</li>
  <li><strong>Table identity:</strong> temple weapon, guard weapon, prison weapon, cult weapon, or undead-smashing backup.</li>
  <li><strong>Main weakness:</strong> it has no range, no Versatile die, and no Dexterity support.</li>
</ul>

<h2 id="is-a-dnd-mace-good">Is a dnd mace Good?</h2>
<p><strong>A dnd mace is good when you need a simple, one-handed bludgeoning weapon, but it is not the best raw damage weapon once martial options are available.</strong> It wins on access and flavor, not on a damage race.</p>

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
      <td><strong>Mace</strong></td>
      <td>Simple, 1d6 bludgeoning, one-handed, Sap in 2024 mastery games.</td>
      <td>No Finesse, Light, Thrown, or Versatile property.</td>
    </tr>
    <tr>
      <td><strong>Club</strong></td>
      <td>Cheaper, lighter, and easier to treat as an improvised-looking weapon.</td>
      <td>Lower damage die than the mace.</td>
    </tr>
    <tr>
      <td><strong>Quarterstaff</strong></td>
      <td>Simple, cheap, and Versatile for two-handed use.</td>
      <td>Less shield-friendly if you care about the bigger die.</td>
    </tr>
    <tr>
      <td><strong>Warhammer</strong></td>
      <td>Higher damage and Versatile, with the same blunt identity.</td>
      <td>Martial weapon, so not every character has access.</td>
    </tr>
    <tr>
      <td><strong>Flail</strong></td>
      <td>Martial 1d8 bludgeoning with a nastier visual profile.</td>
      <td>Needs martial proficiency and is less plain as a guard or priest weapon.</td>
    </tr>
  </tbody>
</table>

<figure class="inline-figure inline-figure--four-three-crop">
  <img
    class="inline-figure__image inline-figure__image--four-three"
    src="${DND_MACE_COMPARISON_IMAGE_PATH}"
    alt="dnd mace weapon comparison showing a mace, club, quarterstaff, warhammer, shield, and dice on a tabletop battle map"
    width="1200"
    height="900"
    loading="lazy"
    decoding="async"
  />
  <figcaption>The mace is the plain, shield-friendly middle option: stronger than a club, less flexible than a quarterstaff, easier to access than a warhammer.</figcaption>
</figure>

<h2 id="who-should-use-a-dnd-mace">Who Should Use a dnd mace?</h2>
<p><strong>A dnd mace fits characters who have simple weapon proficiency, use Strength, and want a shield-friendly blunt weapon.</strong> It is especially clean for Clerics, armored NPCs, temple guards, and characters whose gear should look practical rather than elegant.</p>

<ul>
  <li><strong>Clerics:</strong> the mace fits the classic holy-warrior image without needing martial weapon proficiency.</li>
  <li><strong>Guards and cultists:</strong> it reads clearly on a token and does not require a specialized fighting style.</li>
  <li><strong>Shield users:</strong> the one-handed profile keeps the off-hand open for AC.</li>
  <li><strong>Low-level NPCs:</strong> 1d6 bludgeoning is easy to run and easy for players to understand.</li>
  <li><strong>Strength characters without martial access:</strong> it gives a clean blunt option before better weapon access appears.</li>
</ul>

<p>If you are choosing between a mace user and another build, the <a href="${EN_DND_CLASSES_PATH}">DnD classes guide</a> helps with class fit, and the <a href="${EN_DND_ARMOR_PATH}">DND armor guide</a> helps decide whether the character should feel like a shielded front-liner or a back-line priest.</p>

<h2 id="sap">What Does Sap Do on a dnd mace in 2024?</h2>
<p><strong>In 2024 rules, Sap means a creature you hit with the mace has Disadvantage on its next attack roll before the start of your next turn.</strong> That only matters if your character actually has weapon mastery access for the mace.</p>

<table>
  <thead>
    <tr>
      <th>Sap question</th>
      <th>Practical answer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Does every mace user get Sap?</strong></td>
      <td>No. The weapon can have Sap in the 2024 table, but your character needs the feature or option that lets them use mastery.</td>
    </tr>
    <tr>
      <td><strong>What does Sap protect?</strong></td>
      <td>It can blunt one incoming attack roll, which is useful against single heavy hitters.</td>
    </tr>
    <tr>
      <td><strong>Does Sap increase damage?</strong></td>
      <td>No. The mace is still a 1d6 weapon; Sap changes the next enemy attack roll pressure.</td>
    </tr>
    <tr>
      <td><strong>Best table use?</strong></td>
      <td>Tag the monster most likely to make a painful attack before your next turn.</td>
    </tr>
  </tbody>
</table>

<p>When I test Sap at the table, I mark the target immediately after the hit. Waiting until the monster attacks is where most mistakes happen.</p>

<h2 id="mace-vs-undead">Is a dnd mace Good Against Undead?</h2>
<p><strong>A dnd mace can be good against undead when the creature or adventure rewards bludgeoning damage, but it is not automatically better against every undead enemy.</strong> Check the monster entry before assuming the damage type matters.</p>

<p>The real reason mace users feel natural in undead-heavy games is the fiction: temple guard, grave warden, priest, exorcist, or armored acolyte. If the campaign has skeletons, brittle constructs, or object-smashing scenes, bludgeoning becomes more noticeable.</p>

<h2 id="vtt-token-tips">How Should a dnd mace Look on a VTT Token?</h2>
<p><strong>A dnd mace token should show the blunt head clearly, not hide the weapon behind armor or a busy frame.</strong> Players should recognize the character's role at map size.</p>

<ul>
  <li><strong>For a Cleric:</strong> show the mace near a holy symbol, shield, or tabard.</li>
  <li><strong>For a guard:</strong> keep the pose square, armored, and readable.</li>
  <li><strong>For a cultist:</strong> use a darker silhouette and a heavier mace head.</li>
  <li><strong>For Sap tracking:</strong> add a small marker on the target token after the mace hits.</li>
  <li><strong>For mobile play:</strong> keep the label short, such as "Mace Guard" or the character's first name.</li>
</ul>

<p>In my VTT checks, the mace works better as a large silhouette than as a tiny detailed prop. A plain round or flanged head reads faster than a complicated fantasy ornament.</p>

<h2 id="faq">dnd mace FAQ</h2>
<h3>How much damage does a dnd mace do?</h3>
<p><strong>A dnd mace deals 1d6 bludgeoning damage.</strong> For normal melee attacks, add the relevant ability modifier according to your table's attack rules; this is usually Strength.</p>

<h3>Is a dnd mace a simple weapon?</h3>
<p><strong>Yes, a dnd mace is a simple melee weapon.</strong> That broad access is the main reason Clerics and many NPCs can use it without building around martial weapon proficiency.</p>

<h3>Can a Rogue use Sneak Attack with a mace?</h3>
<p><strong>No, a normal mace does not qualify for Sneak Attack because it lacks the Finesse property and is not a ranged weapon.</strong> Use a dagger, rapier, shortsword, or other eligible weapon for Sneak Attack.</p>

<h3>Is a mace better than a warhammer in DnD?</h3>
<p><strong>A mace is easier to access, but a warhammer is usually better for characters with martial weapon proficiency.</strong> The warhammer hits harder and can be used two-handed through Versatile rules.</p>

<h3>Does a dnd mace have Sap?</h3>
<p><strong>In the 2024 equipment table, the mace has Sap as its weapon mastery entry.</strong> You still need a character feature or option that lets you use that mastery.</p>

<h2 id="video">Watch the dnd mace Video</h2>
<p>For a mace scene, keep the table moment short: one clear target, one blunt impact, and one result everyone understands. If the table gets chaotic, make the token, target, and damage roll easy to read before the joke runs away with the turn.</p>

${liteVideoEmbed('gsl83xofiUw', 'dnd mace video guide', {
  src: DND_MACE_VIDEO_PLACEHOLDER_PATH,
  alt: 'Clickable webp video cover for a dnd mace guide showing a mace over a VTT token frame with a play button',
})}

<p><a href="${DND_MACE_VIDEO_URL}" rel="noreferrer noopener">Open the mace video on YouTube</a>.</p>
`;

export const dndMaceArticleHtmlZh = String.raw`
<p><strong>dnd mace</strong> 是一把 simple melee weapon，造成 <strong>1d6 bludgeoning</strong>，价格 5 gp，重量 4 lb，最适合盾牌角色、Cleric、守卫、邪教徒，以及想用钝器但没有 martial weapon 熟练的角色。先看下面的速查表，再决定它是否比 club、quarterstaff、warhammer 或 flail 更适合你的角色。</p>

<table>
  <thead>
    <tr>
      <th>dnd mace 数据</th>
      <th>快速答案</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>武器类型</strong></td>
      <td>Simple melee weapon。</td>
    </tr>
    <tr>
      <td><strong>伤害</strong></td>
      <td>1d6 bludgeoning。</td>
    </tr>
    <tr>
      <td><strong>价格 / 重量</strong></td>
      <td>5 gp / 4 lb。</td>
    </tr>
    <tr>
      <td><strong>2014 属性</strong></td>
      <td>没有 Finesse、Light、Thrown、Reach 或 Versatile。</td>
    </tr>
    <tr>
      <td><strong>2024 mastery</strong></td>
      <td>如果角色有对应 weapon mastery，可以用 Sap。</td>
    </tr>
    <tr>
      <td><strong>适合谁</strong></td>
      <td>Cleric、力量型 simple weapon 使用者、盾牌角色、神殿守卫和穿甲 NPC。</td>
    </tr>
  </tbody>
</table>

<p>我的桌面判断很简单：mace 不是炫技武器。它好用是因为<strong>简单、单手、钝击、很适合宗教角色或守卫，而且放到 VTT Token 上一眼能看懂</strong>。</p>

<p>如果你要给 Roll20、Foundry 或 Owlbear Rodeo 做 mace 角色头像，可以先用 <a href="${ZH_EDITOR_PATH}">VTT Token 制作工具</a>处理头像；方格地图用 <a href="${ZH_SQUARE_TOKEN_MAKER_PATH}">square token maker</a>导出 1:1 Token；想试 1d6 手感，可以直接用 <a href="${ZH_DICE_ROLLER_PATH}">D&amp;D dice roller</a>。</p>

<h2 id="quick-stats">dnd mace 快速数据</h2>
<p><strong>dnd mace 造成 1d6 bludgeoning，价格 5 gp，重量 4 lb，普通攻击通常用 Strength，除非某个特性另有说明。</strong> 它是 simple、单手，而且定位很朴素。</p>

<p>如果你的桌子用 2014 规则，就把 mace 当成朴素的 1d6 simple weapon：给 Strength 角色用，副手还能拿盾。如果用 2024 规则，基础数据不变，但要注意 <strong>Sap</strong>：一次普通命中也能变成小型防守手段。需要对齐版本和风格时，可以对照 <a href="${DND_MACE_2014_RULES_URL}" rel="noreferrer noopener">2014 武器表</a>、<a href="${DND_MACE_2024_RULES_URL}" rel="noreferrer noopener">2024 装备表</a>和 <a href="${DND_MACE_WIKIPEDIA_URL}" rel="noreferrer noopener">mace 背景</a>。</p>

<ul>
  <li><strong>伤害类型：</strong>bludgeoning，在怪物、物体或冒险中特别点名钝击时才更重要。</li>
  <li><strong>属性：</strong>通常用 Strength，因为 mace 没有 Finesse。</li>
  <li><strong>持用：</strong>单手，所以很自然地配盾牌。</li>
  <li><strong>桌面身份：</strong>神殿武器、守卫武器、监牢武器、邪教武器或砸 undead 的备用钝器。</li>
  <li><strong>主要短板：</strong>没有射程、没有 Versatile 伤害骰，也不支持 Dexterity。</li>
</ul>

<h2 id="is-a-dnd-mace-good">dnd mace 好用吗？</h2>
<p><strong>dnd mace 在你需要 simple、单手、bludgeoning 武器时好用，但一旦角色能用 martial weapon，它通常不是最高伤害选择。</strong> 它赢在容易拿、风格清楚，而不是伤害最强。</p>

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
      <td><strong>Mace</strong></td>
      <td>Simple、1d6 bludgeoning、单手，2024 mastery 桌可用 Sap。</td>
      <td>没有 Finesse、Light、Thrown 或 Versatile。</td>
    </tr>
    <tr>
      <td><strong>Club</strong></td>
      <td>更便宜、更轻，也更像临时抓来的武器。</td>
      <td>伤害骰比 mace 小。</td>
    </tr>
    <tr>
      <td><strong>Quarterstaff</strong></td>
      <td>Simple、便宜，而且可以 Versatile 双手用。</td>
      <td>如果想吃更大伤害骰，就不如 mace 那么适合配盾。</td>
    </tr>
    <tr>
      <td><strong>Warhammer</strong></td>
      <td>伤害更高，也有 Versatile，仍然保留钝击风格。</td>
      <td>是 martial weapon，不是每个角色都能熟练使用。</td>
    </tr>
    <tr>
      <td><strong>Flail</strong></td>
      <td>Martial 1d8 bludgeoning，视觉上更凶。</td>
      <td>需要 martial proficiency，也不如 mace 适合普通守卫或神职角色。</td>
    </tr>
  </tbody>
</table>

<figure class="inline-figure inline-figure--four-three-crop">
  <img
    class="inline-figure__image inline-figure__image--four-three"
    src="${DND_MACE_COMPARISON_IMAGE_PATH}"
    alt="dnd mace 武器对比图，桌面地图上摆着 mace、club、quarterstaff、warhammer、盾牌和骰子"
    width="1200"
    height="900"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Mace 是朴素的中间选项：比 club 更有伤害，比 quarterstaff 少灵活性，但比 warhammer 更容易被角色拿到。</figcaption>
</figure>

<h2 id="who-should-use-a-dnd-mace">谁适合用 dnd mace？</h2>
<p><strong>dnd mace 适合有 simple weapon 熟练、偏 Strength、并且想用盾牌的角色。</strong> Cleric、穿甲 NPC、神殿守卫，以及装备风格要朴素实用的角色都很适合。</p>

<ul>
  <li><strong>Cleric：</strong>很符合经典神职战士形象，不需要 martial weapon 熟练。</li>
  <li><strong>守卫和邪教徒：</strong>Token 上好认，跑起来也不需要特殊战斗风格。</li>
  <li><strong>盾牌角色：</strong>单手武器能保留副手 AC。</li>
  <li><strong>低等级 NPC：</strong>1d6 bludgeoning 易跑，玩家也容易理解。</li>
  <li><strong>没有 martial 熟练的力量角色：</strong>在拿到更好武器前，mace 是干净的钝器选择。</li>
</ul>

<p>如果你还在判断角色路线，可以先看 <a href="${ZH_DND_CLASSES_PATH}">DnD 职业指南</a>确认职业定位，再看 <a href="${ZH_DND_ARMOR_PATH}">DND 护甲指南</a>决定他更像持盾前排，还是后排神职角色。</p>

<h2 id="sap">2024 规则里 dnd mace 的 Sap 是什么？</h2>
<p><strong>在 2024 规则里，Sap 的意思是：你用 mace 命中一个生物后，该生物在你下回合开始前的下一次攻击检定有 Disadvantage。</strong> 但前提是你的角色真的能使用 mace 的 weapon mastery。</p>

<table>
  <thead>
    <tr>
      <th>Sap 问题</th>
      <th>实战答案</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>每个 mace 使用者都有 Sap 吗？</strong></td>
      <td>不是。2024 表里 mace 对应 Sap，但角色还需要能使用 weapon mastery 的特性或选项。</td>
    </tr>
    <tr>
      <td><strong>Sap 保护什么？</strong></td>
      <td>它可以压低一次即将到来的攻击检定，面对单次重击怪物时更有价值。</td>
    </tr>
    <tr>
      <td><strong>Sap 会增加伤害吗？</strong></td>
      <td>不会。Mace 仍然是 1d6 武器；Sap 改变的是敌人下一次攻击压力。</td>
    </tr>
    <tr>
      <td><strong>最好怎么用？</strong></td>
      <td>命中后立刻给最可能打出危险攻击的怪物做标记。</td>
    </tr>
  </tbody>
</table>

<p>我在桌上测试 Sap 时，会在命中后马上给目标加标记。拖到怪物攻击时才想起来，最容易忘。</p>

<h2 id="mace-vs-undead">dnd mace 打 undead 好吗？</h2>
<p><strong>当怪物或冒险特别奖励 bludgeoning 时，dnd mace 打 undead 可以很好；但它并不会自动克制所有 undead。</strong> 不要看到 undead 就默认钝击一定有优势，先看怪物条目。</p>

<p>Mace 在 undead 战役里常见，更多是因为画面感成立：神殿守卫、墓园看守、驱魔神职、穿甲侍僧。遇到 skeleton、脆弱构装体或砸物体场景时，bludgeoning 才会更有存在感。</p>

<h2 id="vtt-token-tips">dnd mace 在 VTT Token 上怎么表现？</h2>
<p><strong>dnd mace 的 Token 要让钝器头部清楚可见，不要被盔甲、边框或复杂姿势挡住。</strong> 玩家应该在地图尺寸下就能看出这个角色的武器和定位。</p>

<ul>
  <li><strong>Cleric：</strong>把 mace 放在圣徽、盾牌或罩袍附近。</li>
  <li><strong>守卫：</strong>姿势方正，盔甲清楚，轮廓稳定。</li>
  <li><strong>邪教徒：</strong>轮廓可以更暗，mace 头部更重。</li>
  <li><strong>Sap 标记：</strong>mace 命中后，在目标 Token 上加一个小标记。</li>
  <li><strong>移动端：</strong>标签保持短，比如 “Mace Guard” 或角色名。</li>
</ul>

<p>我检查 VTT Token 时，mace 作为大轮廓比作为小装饰更好读。朴素的圆头或棱头，比复杂的奇幻装饰更适合地图。</p>

<h2 id="faq">dnd mace FAQ</h2>
<h3>dnd mace 造成多少伤害？</h3>
<p><strong>dnd mace 造成 1d6 bludgeoning 伤害。</strong> 普通近战攻击通常再加对应属性调整值，一般是 Strength。</p>

<h3>dnd mace 是 simple weapon 吗？</h3>
<p><strong>是，dnd mace 是 simple melee weapon。</strong> 这也是 Cleric 和很多 NPC 不需要 martial weapon 熟练就能使用它的原因。</p>

<h3>Rogue 可以用 mace 打 Sneak Attack 吗？</h3>
<p><strong>不可以，普通 mace 没有 Finesse，也不是 ranged weapon，所以不能触发 Sneak Attack。</strong> 想打 Sneak Attack，通常要用 dagger、rapier、shortsword 或其他合格武器。</p>

<h3>Mace 比 warhammer 更好吗？</h3>
<p><strong>Mace 更容易拿到，但有 martial weapon 熟练时，warhammer 通常更强。</strong> Warhammer 伤害更高，而且可以通过 Versatile 双手使用。</p>

<h3>dnd mace 有 Sap 吗？</h3>
<p><strong>在 2024 装备表里，mace 的 weapon mastery 条目是 Sap。</strong> 但角色仍然需要有能使用该 mastery 的特性或选项。</p>

<h2 id="video">观看 dnd mace 视频</h2>
<p>描述 mace 场景时，不要讲太久：一个清楚目标、一次钝击、一个所有人都听懂的结果就够了。桌边开始混乱时，先把 Token、目标和伤害骰讲清楚，再让笑点继续。</p>

${liteVideoEmbed('gsl83xofiUw', 'dnd mace video guide', {
  src: DND_MACE_VIDEO_PLACEHOLDER_PATH,
  alt: 'dnd mace 指南的视频封面占位图，画面是 VTT Token 圆框上的 mace 和播放按钮',
})}

<p><a href="${DND_MACE_VIDEO_URL}" rel="noreferrer noopener">在 YouTube 打开这个视频</a>。</p>
`;
