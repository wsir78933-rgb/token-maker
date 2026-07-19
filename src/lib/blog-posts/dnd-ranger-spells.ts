import {
  DND_HUNTERS_MARK_2014_RULES_URL,
  DND_HUNTERS_MARK_2024_RULES_URL,
  DND_RANGER_2014_RULES_URL,
  DND_RANGER_2024_RULES_URL,
  DND_RANGER_SPELLS_PREP_IMAGE_PATH,
  DND_RANGER_SPELLS_VIDEO_PLACEHOLDER_PATH,
  DND_RANGER_SPELLS_VIDEO_URL,
  EN_DICE_ROLLER_PATH,
  EN_DND_CLASSES_PATH,
  EN_DND_CONSTITUTION_PATH,
  EN_DND_DRUID_SPELLS_PATH,
  EN_DND_HUNTERS_MARK_PATH,
  EN_EDITOR_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_DND_CONSTITUTION_PATH,
  ZH_DND_DRUID_SPELLS_PATH,
  ZH_DND_HUNTERS_MARK_PATH,
  ZH_EDITOR_PATH,
  liteVideoEmbed,
} from './shared';

export const dndRangerSpellsArticleHtml = String.raw`
<p><strong>dnd ranger spells</strong> get confusing because the class tries to do a lot with a short list. One spell slot might be your scouting plan, your damage boost, your travel fix, or the thing that keeps a bad fight from getting worse. I would not start by asking which spell is "best." Start by asking what job the spell is supposed to do at your table.</p>

<p>The table below is the fast shortlist. After that, check your rules version. A 2014 Ranger and a 2024 Ranger do not manage spells the same way, and Hunter's Mark changed enough that I treat it as a choice, not a reflex.</p>

<table>
  <thead>
    <tr>
      <th>Need</th>
      <th>Useful Ranger spell picks</th>
      <th>Why I would take it</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Damage rider</strong></td>
      <td>Hunter's Mark</td>
      <td>Worth it when one target will survive long enough for repeated hits.</td>
    </tr>
    <tr>
      <td><strong>Early control</strong></td>
      <td>Ensnaring Strike, Entangle, Fog Cloud</td>
      <td>Use these when one enemy, one doorway, or one bad sight line can decide the fight.</td>
    </tr>
    <tr>
      <td><strong>Stealth and scouting</strong></td>
      <td>Pass without Trace, Speak with Animals, Detect Magic, Longstrider</td>
      <td>This is where the Ranger earns the scout label before initiative starts.</td>
    </tr>
    <tr>
      <td><strong>Area denial</strong></td>
      <td>Spike Growth, Plant Growth, Wind Wall</td>
      <td>Good when the map matters and enemies have to move through your terms.</td>
    </tr>
    <tr>
      <td><strong>Emergency support</strong></td>
      <td>Goodberry, Cure Wounds, Lesser Restoration, Freedom of Movement</td>
      <td>Take one when the campaign punishes poison, bad footing, or long travel days.</td>
    </tr>
    <tr>
      <td><strong>Summons and pressure</strong></td>
      <td>Summon Beast, Summon Fey, Summon Elemental</td>
      <td>Helpful in bigger fights, as long as you are willing to spend concentration on another body.</td>
    </tr>
  </tbody>
</table>

<h2>What are the best DND Ranger spells?</h2>
<p>For most tables, the Ranger spells I check first are Hunter's Mark, Goodberry, Pass without Trace, Spike Growth, Ensnaring Strike, Entangle, Cure Wounds, Summon Beast, Freedom of Movement, and Swift Quiver. That list is not a law. It is a bench of spells that cover the Ranger's usual jobs: mark a target, scout safely, control terrain, rescue allies, and keep pressure on enemies.</p>

<p>The official Ranger class rules are available in the <a href="${DND_RANGER_2024_RULES_URL}" rel="noreferrer noopener">2024 Free Rules Ranger entry</a>, while many tables still use the <a href="${DND_RANGER_2014_RULES_URL}" rel="noreferrer noopener">2014 Basic Rules Ranger entry</a>. Confirm the rules version before you copy a spell list, because "known spells" and "prepared spells" are not the same workflow.</p>

<figure class="inline-figure inline-figure--four-three-crop">
  <img
    class="inline-figure__image inline-figure__image--four-three"
    src="${DND_RANGER_SPELLS_PREP_IMAGE_PATH}"
    alt="dnd ranger spells preparation table with spell cards, ranger tokens, concentration marker, summon token, dice, and a forest VTT battle map"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Before a session, I like to turn the spell list into a small table kit: one damage plan, one stealth plan, one control plan, one rescue option, and visible VTT markers.</figcaption>
</figure>

<h2>2014 vs 2024 Ranger spellcasting</h2>
<p>Check the rules version before you copy any Ranger spell list. The easy mistake is mixing the 2014 "spells known" model with the 2024 "prepared spells" model, then wondering why the character builder and the book do not line up.</p>

<table>
  <thead>
    <tr>
      <th>Question</th>
      <th>2014 Ranger</th>
      <th>2024 Ranger</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>When does spellcasting start?</strong></td>
      <td>Level 2.</td>
      <td>Level 1.</td>
    </tr>
    <tr>
      <td><strong>Known or prepared?</strong></td>
      <td>The Ranger knows a limited number of spells.</td>
      <td>The Ranger prepares spells from the Ranger list.</td>
    </tr>
    <tr>
      <td><strong>Changing spells</strong></td>
      <td>You can replace one known spell when gaining a Ranger level.</td>
      <td>You can replace one prepared Ranger spell after a Long Rest.</td>
    </tr>
    <tr>
      <td><strong>Hunter's Mark fit</strong></td>
      <td>It is a 1st-level Ranger spell and uses one known-spell choice.</td>
      <td>Favored Enemy keeps Hunter's Mark prepared and grants free uses.</td>
    </tr>
    <tr>
      <td><strong>Hunter's Mark trigger</strong></td>
      <td>Extra damage when you hit the marked target with a weapon attack.</td>
      <td>Extra Force damage when you hit the marked target with an attack roll.</td>
    </tr>
  </tbody>
</table>

<p>For a mixed-version group, write the rules version on the character sheet. It prevents arguments about whether Hunter's Mark is taking a known-spell slot, how often you can change spells, and which attacks trigger the damage.</p>

<h2>Best 1st-level Ranger spells</h2>
<p>At 1st level, I care less about fancy names and more about whether the spell will actually get used. Low-level Rangers feel much better when their spells do not all fight for the same action, Bonus Action, or concentration slot.</p>

<table>
  <thead>
    <tr>
      <th>Spell</th>
      <th>Best use</th>
      <th>Watch the tradeoff</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Hunter's Mark</strong></td>
      <td>Durable targets, bosses, Extra Attack turns</td>
      <td>Concentration and Bonus Action pressure</td>
    </tr>
    <tr>
      <td><strong>Goodberry</strong></td>
      <td>Safe recovery, travel days, stabilizing the party between fights</td>
      <td>Not a full combat-healing plan</td>
    </tr>
    <tr>
      <td><strong>Ensnaring Strike</strong></td>
      <td>Restraining one important enemy</td>
      <td>Concentration and Strength save reliability</td>
    </tr>
    <tr>
      <td><strong>Entangle</strong></td>
      <td>Early area control and ambush setup</td>
      <td>Concentration and terrain placement</td>
    </tr>
    <tr>
      <td><strong>Fog Cloud</strong></td>
      <td>Escape, cover, anti-archer play, or resetting a bad fight</td>
      <td>It blinds allies too if placed badly</td>
    </tr>
    <tr>
      <td><strong>Longstrider</strong></td>
      <td>Mobility without concentration</td>
      <td>Best when cast before trouble starts</td>
    </tr>
    <tr>
      <td><strong>Speak with Animals</strong></td>
      <td>Clues, scouting, and wilderness information</td>
      <td>Strongest in exploration-heavy campaigns</td>
    </tr>
  </tbody>
</table>

<p>For a new Ranger, I would start with Hunter's Mark, Goodberry, and one control or exploration spell. If the campaign has real stealth scenes, make room for Pass without Trace as soon as 2nd-level spells arrive. If the campaign is mostly fights, decide ahead of time when Hunter's Mark gets benched for control.</p>

<h2>Best 2nd-level Ranger spells</h2>
<p>2nd-level spells are where Ranger magic starts to feel like a real identity instead of a small add-on to weapon attacks. Pass without Trace and Spike Growth stand out because they solve different problems. One wins the approach. The other can win the map.</p>

<table>
  <thead>
    <tr>
      <th>Spell</th>
      <th>Job</th>
      <th>Why it matters</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Pass without Trace</strong></td>
      <td>Party stealth</td>
      <td>It turns group stealth from "the armored character ruins it" into a real plan.</td>
    </tr>
    <tr>
      <td><strong>Spike Growth</strong></td>
      <td>Area denial</td>
      <td>It punishes movement, chokes corridors, and protects backlines.</td>
    </tr>
    <tr>
      <td><strong>Silence</strong></td>
      <td>Anti-caster and stealth tool</td>
      <td>It can shut down noisy plans and some verbal spellcasting situations.</td>
    </tr>
    <tr>
      <td><strong>Lesser Restoration</strong></td>
      <td>Condition repair</td>
      <td>It answers poison, paralysis, disease, and other session-stopping problems.</td>
    </tr>
    <tr>
      <td><strong>Locate Object</strong></td>
      <td>Tracking and investigation</td>
      <td>It solves scenes where the target item matters more than the target creature.</td>
    </tr>
    <tr>
      <td><strong>Summon Beast</strong></td>
      <td>Board pressure</td>
      <td>It adds a second presence when the fight rewards bodies and positioning.</td>
    </tr>
  </tbody>
</table>

<p>The catch is concentration. If you walk into a fight with Hunter's Mark, Pass without Trace, Spike Growth, and Summon Beast all competing in your head, the spell list looks better on paper than it feels at the table.</p>

<h2>Best 3rd- to 5th-level Ranger spells</h2>
<p>Once the slots get more expensive, I want a Ranger spell to do something a normal attack round cannot do. It should change the battlefield, solve a dangerous condition, or give the character one memorable swing.</p>

<table>
  <thead>
    <tr>
      <th>Spell level</th>
      <th>Strong picks</th>
      <th>Practical use</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>3rd</strong></td>
      <td>Lightning Arrow, Plant Growth, Conjure Barrage, Water Breathing, Revivify</td>
      <td>Burst, terrain control, travel safety, and emergency recovery.</td>
    </tr>
    <tr>
      <td><strong>4th</strong></td>
      <td>Freedom of Movement, Guardian of Nature, Grasping Vine, Summon Fey</td>
      <td>Mobility, self-buffing, control, and stronger board presence.</td>
    </tr>
    <tr>
      <td><strong>5th</strong></td>
      <td>Steel Wind Strike, Swift Quiver, Conjure Volley, Greater Restoration, Commune with Nature</td>
      <td>Late burst, sustained attacks, large areas, condition repair, and campaign information.</td>
    </tr>
  </tbody>
</table>

<p>Lightning Arrow and Conjure Barrage are at their best when the battlefield lines up for them. Freedom of Movement is quieter, but I have seen it matter more in fights with grapples, restraints, water, webs, or magical slowdowns.</p>

<h2>Prepared Ranger spell lists by level</h2>
<p>Use these as rough loadouts, not full legal character sheets. Your exact spell count depends on the rules version, Wisdom, level, and table options, but the roles are still useful when you are trying to pick spells quickly.</p>

<h3>Level 1 Ranger, 2024 starter plan</h3>
<table>
  <thead>
    <tr>
      <th>Role</th>
      <th>Pick</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Always ready</strong></td>
      <td>Hunter's Mark, already prepared through Favored Enemy</td>
    </tr>
    <tr>
      <td><strong>Prepared spell 1</strong></td>
      <td>Goodberry or Cure Wounds</td>
    </tr>
    <tr>
      <td><strong>Prepared spell 2</strong></td>
      <td>Entangle, Fog Cloud, Speak with Animals, or Longstrider</td>
    </tr>
  </tbody>
</table>

<h3>Level 2 Ranger, 2014 starter plan</h3>
<table>
  <thead>
    <tr>
      <th>Role</th>
      <th>Pick</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Known spell 1</strong></td>
      <td>Hunter's Mark or Goodberry</td>
    </tr>
    <tr>
      <td><strong>Known spell 2</strong></td>
      <td>Goodberry, Ensnaring Strike, Cure Wounds, or Speak with Animals</td>
    </tr>
  </tbody>
</table>

<h3>Level 5 Archer Ranger</h3>
<table>
  <thead>
    <tr>
      <th>Role</th>
      <th>Pick</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Damage plan</strong></td>
      <td>Hunter's Mark</td>
    </tr>
    <tr>
      <td><strong>Stealth plan</strong></td>
      <td>Pass without Trace</td>
    </tr>
    <tr>
      <td><strong>Control plan</strong></td>
      <td>Spike Growth</td>
    </tr>
    <tr>
      <td><strong>Recovery</strong></td>
      <td>Goodberry or Cure Wounds</td>
    </tr>
    <tr>
      <td><strong>Utility</strong></td>
      <td>Longstrider, Speak with Animals, or Locate Object</td>
    </tr>
  </tbody>
</table>

<p>This list works because it admits the awkward part: Hunter's Mark, Pass without Trace, and Spike Growth all want concentration. You are not preparing one perfect script. You are preparing a few plans and choosing one when the scene shows its shape.</p>

<h2>Hunter's Mark or another concentration spell?</h2>
<p>Hunter's Mark is good when one enemy will survive long enough for multiple hits. It is not a button you press at the start of every fight. For exact trigger wording, compare the <a href="${DND_HUNTERS_MARK_2014_RULES_URL}" rel="noreferrer noopener">2014 Hunter's Mark spell</a>, the <a href="${DND_HUNTERS_MARK_2024_RULES_URL}" rel="noreferrer noopener">2024 Hunter's Mark spell</a>, and the dedicated <a href="${EN_DND_HUNTERS_MARK_PATH}">DND Hunter's Mark guide</a>.</p>

<table>
  <thead>
    <tr>
      <th>Situation</th>
      <th>Best concentration plan</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Single boss, high HP, clear attack line</strong></td>
      <td>Hunter's Mark</td>
    </tr>
    <tr>
      <td><strong>The whole party needs stealth</strong></td>
      <td>Pass without Trace</td>
    </tr>
    <tr>
      <td><strong>Enemies must cross a chokepoint</strong></td>
      <td>Spike Growth</td>
    </tr>
    <tr>
      <td><strong>One dangerous melee enemy must stay put</strong></td>
      <td>Ensnaring Strike or Entangle</td>
    </tr>
    <tr>
      <td><strong>You need another body on the board</strong></td>
      <td>Summon Beast or Summon Fey</td>
    </tr>
  </tbody>
</table>

<p>My rule of thumb: if a concentration spell makes the whole party better, it probably deserves a hard look before Hunter's Mark. The mark shines when the Ranger can keep hitting the same target and the group does not need stealth, terrain control, or a summon more.</p>

<h2>How to choose Ranger spells for your party</h2>
<p>Choose Ranger spells by party gap, not by a universal ranking list. A spell can look perfect in a guide and still sit unused if your table never sneaks, never tracks, or already has three characters competing for setup turns.</p>

<ol>
  <li>If stealth keeps failing because one armor user rolls badly, take Pass without Trace.</li>
  <li>If enemies keep reaching the backline too easily, take Entangle, Spike Growth, Plant Growth, or Wind Wall.</li>
  <li>If poison, disease, or hard travel keeps slowing the group down, keep Goodberry, Cure Wounds, Lesser Restoration, and later Freedom of Movement in mind.</li>
  <li>If the campaign has clues, animals, water routes, lost relics, or wilderness travel, use Speak with Animals, Detect Magic, Locate Object, Water Breathing, or Commune with Nature.</li>
  <li>If the party already has control and healing covered, then the damage and summon options get much easier to justify.</li>
</ol>

<p>If you are still choosing the class, pair this with the <a href="${EN_DND_CLASSES_PATH}">DND classes guide</a>. If concentration checks are your weak point, the <a href="${EN_DND_CONSTITUTION_PATH}">D&amp;D Constitution guide</a> is worth reading before you dump Constitution. For another nature-caster angle, compare this list with the <a href="${EN_DND_DRUID_SPELLS_PATH}">DND druid spells guide</a>.</p>

<h2>VTT token and dice prep for Ranger spells</h2>
<p>Ranger spells run faster when the table can see the spell state. I would rather have a plain marker everyone understands than a beautiful token that hides the important part at map scale.</p>

<ul>
  <li>Use a normal Ranger token for the default combat portrait.</li>
  <li>Keep a darker scout version for stealth or approach scenes.</li>
  <li>Put a clear ring or corner badge on the marked quarry for Hunter's Mark.</li>
  <li>Place the concentration marker on the Ranger too, not only on the target.</li>
  <li>Make summon tokens readable at small size, especially beasts, fey, and elementals.</li>
  <li>Use simple overlays for Spike Growth, Fog Cloud, Silence, or Plant Growth.</li>
</ul>

<p>You can make those pieces in the <a href="${EN_EDITOR_PATH}">VTT token maker</a> for Roll20, Foundry VTT, Owlbear, or another tabletop. I would also keep the <a href="${EN_DICE_ROLLER_PATH}">D&amp;D dice roller</a> nearby for Hunter's Mark damage, concentration saves, spell attacks, Spike Growth movement damage, and summon attacks.</p>

<h2>DND Ranger Spells FAQ</h2>
<h3>What are the best dnd ranger spells?</h3>
<p>For most tables, start by checking Hunter's Mark, Goodberry, Pass without Trace, Spike Growth, Ensnaring Strike, Entangle, Cure Wounds, Summon Beast, Freedom of Movement, and Swift Quiver. Then cut the list down around your party and campaign.</p>

<h3>Do Rangers prepare spells in DND?</h3>
<p>It depends on the rules version. The 2014 Ranger knows a limited number of spells, while the 2024 Ranger prepares Ranger spells from the class list.</p>

<h3>Is Hunter's Mark always the best Ranger spell?</h3>
<p>No. Hunter's Mark is strong against durable targets, but Pass without Trace, Spike Growth, Entangle, Silence, or a summon can be better when the encounter rewards stealth, terrain control, or board presence.</p>

<h3>What Ranger spell should I take first?</h3>
<p>For many tables, I would start with Hunter's Mark or Goodberry, then add one control or exploration spell such as Entangle, Fog Cloud, Longstrider, or Speak with Animals.</p>

<h3>What is the best 2nd-level Ranger spell?</h3>
<p>Pass without Trace is usually the first 2nd-level spell I check if the party cares about stealth. Spike Growth is the combat pick I look at when the map has chokepoints or forced movement.</p>

<h2 id="video">Watch the Ranger spells companion video</h2>
<p>This <a href="${DND_RANGER_SPELLS_VIDEO_URL}" rel="noreferrer noopener">Ranger spells companion video</a> is useful as a quick refresher before a session. The main takeaway is boring but important: pick one concentration plan for the scene, then let the rest of the list support it.</p>

${liteVideoEmbed('P_qzyTFSrTE', 'DND Ranger spells companion video', {
  src: DND_RANGER_SPELLS_VIDEO_PLACEHOLDER_PATH,
  alt: 'Clickable webp video cover for a dnd ranger spells guide with a Ranger, marked quarry, dice, spell cards, and a VTT forest map',
})}
`;

export const dndRangerSpellsArticleHtmlZh = String.raw`
<p><strong>DND 游侠法术</strong>容易让人纠结。游侠（Ranger）的法术位不多，却要同时管侦察、伤害、旅行、控制和救场。我的建议不是先问“哪个最强”，而是先问这个法术在你这张桌上到底负责什么。</p>

<p>下面这张表先给你一个能马上用的短名单。看完之后，再回头确认规则版本。2014 版游侠和 2024 版游侠管理法术的方式不一样，猎人印记（Hunter's Mark）也变到值得单独判断，别把它当成每场战斗的默认开关。</p>

<table>
  <thead>
    <tr>
      <th>需求</th>
      <th>实用游侠法术选择</th>
      <th>我会在什么情况下拿</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>伤害附加</strong></td>
      <td>猎人印记（Hunter's Mark）</td>
      <td>目标够硬、能吃下多次命中时才真正划算。</td>
    </tr>
    <tr>
      <td><strong>前期控制</strong></td>
      <td>诱捕打击（Ensnaring Strike）、纠缠术（Entangle）、云雾术（Fog Cloud）</td>
      <td>当一个敌人、一条门口或一段视线能改变战局时，这类法术很值。</td>
    </tr>
    <tr>
      <td><strong>潜行与侦察</strong></td>
      <td>无踪潜行（Pass without Trace）、动物交谈（Speak with Animals）、侦测魔法（Detect Magic）、大步奔行（Longstrider）</td>
      <td>这些是游侠在先攻前就开始做事的工具。</td>
    </tr>
    <tr>
      <td><strong>区域封锁</strong></td>
      <td>荆棘丛生（Spike Growth）、植物滋长（Plant Growth）、风墙术（Wind Wall）</td>
      <td>地图重要、敌人必须走位时，这类法术比单纯加伤害更有存在感。</td>
    </tr>
    <tr>
      <td><strong>紧急支援</strong></td>
      <td>神莓术（Goodberry）、疗伤术（Cure Wounds）、次级复原术（Lesser Restoration）、行动自如（Freedom of Movement）</td>
      <td>战役里经常有毒、疾病、烂地形或长途跋涉时，至少留一个答案。</td>
    </tr>
    <tr>
      <td><strong>召唤与压制</strong></td>
      <td>召唤野兽（Summon Beast）、召唤精类（Summon Fey）、召唤元素生物（Summon Elemental）</td>
      <td>大场面很好用，但你要愿意把专注交给另一个战场单位。</td>
    </tr>
  </tbody>
</table>

<h2>DND 游侠法术哪些最好？</h2>
<p>多数桌上，我会先检查猎人印记、神莓术、无踪潜行、荆棘丛生、诱捕打击、纠缠术、疗伤术、召唤野兽、行动自如和迅捷箭袋（Swift Quiver）。它们不是标准答案，但能覆盖游侠最常见的工作：标记目标、侦察、控地形、救队友，以及持续给敌人压力。</p>

<p>官方游侠职业规则可以看 <a href="${DND_RANGER_2024_RULES_URL}" rel="noreferrer noopener">2024 免费规则游侠条目（Free Rules Ranger）</a>；很多桌仍然使用 <a href="${DND_RANGER_2014_RULES_URL}" rel="noreferrer noopener">2014 基础规则游侠条目（Basic Rules Ranger）</a>。别在没确认版本的情况下抄清单。“已知法术”（known spells）和“已准备法术”（prepared spells）不是同一套角色流程。</p>

<figure class="inline-figure inline-figure--four-three-crop">
  <img
    class="inline-figure__image inline-figure__image--four-three"
    src="${DND_RANGER_SPELLS_PREP_IMAGE_PATH}"
    alt="DND 游侠法术准备桌面图，包含法术卡、游侠头像素材、专注标记、召唤物素材、骰子和森林虚拟桌面战斗地图"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>我会把游侠法术表先整理成一套桌面工具：一个伤害计划、一个潜行计划、一个控制计划、一个救场选项，再加上虚拟桌面（VTT）里看得清的状态标记。</figcaption>
</figure>

<h2>2014 与 2024 游侠施法差异</h2>
<p>选游侠法术前，先确认你的桌使用 2014 还是 2024 规则。最容易出错的地方，就是把 2014 的已知法术和 2024 的已准备法术混在一起，然后发现角色构筑器和书上对不上。</p>

<table>
  <thead>
    <tr>
      <th>问题</th>
      <th>2014 版游侠</th>
      <th>2024 版游侠</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>几级开始施法？</strong></td>
      <td>2 级。</td>
      <td>1 级。</td>
    </tr>
    <tr>
      <td><strong>已知还是准备？</strong></td>
      <td>游侠知道有限数量的法术。</td>
      <td>游侠从游侠法术列表中准备法术。</td>
    </tr>
    <tr>
      <td><strong>怎样更换法术？</strong></td>
      <td>游侠升级时可以替换一个已知法术。</td>
      <td>游侠完成长休后可以替换一个已准备的游侠法术。</td>
    </tr>
    <tr>
      <td><strong>猎人印记怎么算？</strong></td>
      <td>它是 1 环游侠法术，会占用一个已知法术选择。</td>
      <td>宿敌（Favored Enemy）让猎人印记始终准备，并提供免费施放次数。</td>
    </tr>
    <tr>
      <td><strong>猎人印记触发条件</strong></td>
      <td>用武器攻击命中被标记目标时造成额外伤害。</td>
      <td>用攻击检定命中被标记目标时造成额外力场（Force）伤害。</td>
    </tr>
  </tbody>
</table>

<p>如果队伍里有人混用版本，把规则版本直接写在角色卡上。这样能少掉很多桌边争论：猎人印记是否占已知法术、法术多久能换一次、哪些攻击能触发额外伤害。</p>

<h2>最好的 1 环游侠法术</h2>
<p>1 环游侠法术别只看名字酷不酷。低等级时，更重要的是它会不会真的被用到，以及会不会每回合都和你的动作、附赠动作（Bonus Action）、专注抢位置。</p>

<table>
  <thead>
    <tr>
      <th>法术</th>
      <th>最适合做什么</th>
      <th>注意取舍</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>猎人印记</strong></td>
      <td>高血量目标、首领、额外攻击（Extra Attack）回合</td>
      <td>专注和附赠动作压力</td>
    </tr>
    <tr>
      <td><strong>神莓术</strong></td>
      <td>安全恢复、旅行日、战斗间稳定队伍</td>
      <td>不是完整的战斗治疗方案</td>
    </tr>
    <tr>
      <td><strong>诱捕打击</strong></td>
      <td>束缚一个重要敌人</td>
      <td>专注和力量（Strength）豁免可靠性</td>
    </tr>
    <tr>
      <td><strong>纠缠术</strong></td>
      <td>前期区域控制和伏击布置</td>
      <td>专注和地形摆放</td>
    </tr>
    <tr>
      <td><strong>云雾术</strong></td>
      <td>逃脱、掩护、反弓手、重置坏战斗</td>
      <td>放得不好也会遮住队友</td>
    </tr>
    <tr>
      <td><strong>大步奔行</strong></td>
      <td>不用专注的机动性</td>
      <td>出事前施放最好</td>
    </tr>
    <tr>
      <td><strong>动物交谈</strong></td>
      <td>线索、侦察、荒野情报</td>
      <td>探索重的战役里最强</td>
    </tr>
  </tbody>
</table>

<p>新游侠可以从猎人印记、神莓术，再加一个控制或探索法术开始。潜行戏多的战役，拿到 2 环后很快就会想要无踪潜行。战斗密集的战役则要提前想清楚：什么时候猎人印记该让位给控制法术。</p>

<h2>最好的 2 环游侠法术</h2>
<p>到了 2 环，游侠魔法才开始像这个职业自己的东西，而不只是武器攻击旁边的一点小补丁。无踪潜行和荆棘丛生很突出，因为它们解决的是两件完全不同的事：一个赢接近阶段，一个能赢地图。</p>

<table>
  <thead>
    <tr>
      <th>法术</th>
      <th>工作</th>
      <th>为什么重要</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>无踪潜行</strong></td>
      <td>全队潜行</td>
      <td>把“穿甲角色毁掉潜行”变成真正可执行的计划。</td>
    </tr>
    <tr>
      <td><strong>荆棘丛生</strong></td>
      <td>区域封锁</td>
      <td>惩罚移动，堵住走廊，保护后排。</td>
    </tr>
    <tr>
      <td><strong>沉默术</strong></td>
      <td>反施法者和潜行工具</td>
      <td>可以压制吵闹计划和部分依赖声音的施法场景。</td>
    </tr>
    <tr>
      <td><strong>次级复原术</strong></td>
      <td>状态修复</td>
      <td>处理中毒、麻痹、疾病和其他会卡住一整场的麻烦。</td>
    </tr>
    <tr>
      <td><strong>物品定位术</strong></td>
      <td>追踪与调查</td>
      <td>当目标物品比目标生物更重要时，它能直接解决场景。</td>
    </tr>
    <tr>
      <td><strong>召唤野兽</strong></td>
      <td>场面压力</td>
      <td>当战斗奖励站位和额外单位时，它提供第二个存在点。</td>
    </tr>
  </tbody>
</table>

<p>麻烦也在这里：它们都要专注。如果你脑子里同时塞着猎人印记、无踪潜行、荆棘丛生和召唤野兽，这张法术表看起来很强，实际跑起来会互相打架。</p>

<h2>最好的 3 到 5 环游侠法术</h2>
<p>高环位更贵，所以我希望游侠法术能做普通攻击做不到的事：改战场、解危险状态，或者给角色一个真的能记住的回合。只是让武器攻击看起来亮一点，不太值得。</p>

<table>
  <thead>
    <tr>
      <th>法术环级</th>
      <th>强力选择</th>
      <th>实战用途</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>3 环</strong></td>
      <td>闪电箭（Lightning Arrow）、植物滋长、召唤弹幕（Conjure Barrage）、水下呼吸（Water Breathing）、回生术（Revivify）</td>
      <td>爆发、地形控制、旅行安全、紧急恢复。</td>
    </tr>
    <tr>
      <td><strong>4 环</strong></td>
      <td>行动自如、自然守护者（Guardian of Nature）、擒抱藤蔓（Grasping Vine）、召唤精类</td>
      <td>机动性、自我强化、控制和更强的场面存在感。</td>
    </tr>
    <tr>
      <td><strong>5 环</strong></td>
      <td>钢风斩（Steel Wind Strike）、迅捷箭袋、召唤齐射（Conjure Volley）、高等复原术（Greater Restoration）、与自然交融（Commune with Nature）</td>
      <td>后期爆发、持续攻击、大范围伤害、状态修复、战役情报。</td>
    </tr>
  </tbody>
</table>

<p>闪电箭和召唤弹幕要等地形配合，不是每回合都该硬放。行动自如没那么花哨，但在擒抱、束缚、水域、蛛网或魔法减速多的战斗里，它有时比爆发伤害更救命。</p>

<h2>按等级准备游侠法术清单</h2>
<p>把下面这些当作起点，不要当完整合法角色卡。具体能准备多少法术，要看规则版本、等级、感知（Wisdom）和桌上选项，但这种职责划分能帮你更快做决定。</p>

<h3>2024 版 1 级游侠起手计划</h3>
<table>
  <thead>
    <tr>
      <th>角色</th>
      <th>选择</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>始终可用</strong></td>
      <td>猎人印记，通过宿敌已经准备</td>
    </tr>
    <tr>
      <td><strong>已准备法术 1</strong></td>
      <td>神莓术或疗伤术</td>
    </tr>
    <tr>
      <td><strong>已准备法术 2</strong></td>
      <td>纠缠术、云雾术、动物交谈或大步奔行</td>
    </tr>
  </tbody>
</table>

<h3>2014 版 2 级游侠起手计划</h3>
<table>
  <thead>
    <tr>
      <th>角色</th>
      <th>选择</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>已知法术 1</strong></td>
      <td>猎人印记或神莓术</td>
    </tr>
    <tr>
      <td><strong>已知法术 2</strong></td>
      <td>神莓术、诱捕打击、疗伤术或动物交谈</td>
    </tr>
  </tbody>
</table>

<h3>5 级弓手游侠</h3>
<table>
  <thead>
    <tr>
      <th>角色</th>
      <th>选择</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>伤害计划</strong></td>
      <td>猎人印记</td>
    </tr>
    <tr>
      <td><strong>潜行计划</strong></td>
      <td>无踪潜行</td>
    </tr>
    <tr>
      <td><strong>控制计划</strong></td>
      <td>荆棘丛生</td>
    </tr>
    <tr>
      <td><strong>恢复</strong></td>
      <td>神莓术或疗伤术</td>
    </tr>
    <tr>
      <td><strong>工具</strong></td>
      <td>大步奔行、动物交谈或物品定位术</td>
    </tr>
  </tbody>
</table>

<p>这张清单能跑，是因为它承认一个不太舒服的事实：猎人印记、无踪潜行和荆棘丛生都想要专注。你不是在准备一套完美脚本，而是在准备几个方案，然后等场景露出形状再选一个。</p>

<h2>猎人印记还是另一个专注法术？</h2>
<p>猎人印记适合目标够硬、你能反复命中的场景。它不是每场战斗开局都要按下去的按钮。完整触发条件可以对照 <a href="${DND_HUNTERS_MARK_2014_RULES_URL}" rel="noreferrer noopener">2014 版猎人印记法术</a>、<a href="${DND_HUNTERS_MARK_2024_RULES_URL}" rel="noreferrer noopener">2024 版猎人印记法术</a>，以及单独的 <a href="${ZH_DND_HUNTERS_MARK_PATH}">DND 猎人印记指南</a>。</p>

<table>
  <thead>
    <tr>
      <th>情况</th>
      <th>最佳专注计划</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>单个首领、高生命值、攻击线路干净</strong></td>
      <td>猎人印记</td>
    </tr>
    <tr>
      <td><strong>全队需要潜行</strong></td>
      <td>无踪潜行</td>
    </tr>
    <tr>
      <td><strong>敌人必须穿过瓶颈</strong></td>
      <td>荆棘丛生</td>
    </tr>
    <tr>
      <td><strong>一个危险近战敌人必须被钉住</strong></td>
      <td>诱捕打击或纠缠术</td>
    </tr>
    <tr>
      <td><strong>你需要战场上的第二个单位</strong></td>
      <td>召唤野兽或召唤精类</td>
    </tr>
  </tbody>
</table>

<p>我的判断方式很简单：如果一个专注法术能让全队变强，就先别急着上猎人印记。猎人印记最亮眼的时候，是游侠能持续打同一个目标，而队伍又没有更急的潜行、地形控制或召唤需求。</p>

<h2>怎样为队伍选择游侠法术</h2>
<p>按队伍缺口选游侠法术，不要迷信通用排行榜。一个法术在白板环境里很强，但如果你的桌从不潜行、不追踪，或者已经有三个人都需要开场准备回合，它照样可能坐冷板凳。</p>

<ol>
  <li>队伍总是被一个穿甲角色拖垮潜行时，无踪潜行很难绕开。</li>
  <li>敌人老是轻松摸到后排时，纠缠术、荆棘丛生、植物滋长或风墙术会比加一点伤害更管用。</li>
  <li>毒、疾病、旅行消耗和糟糕地形经常拖慢节奏时，神莓术、疗伤术、次级复原术，后期的行动自如都值得留位置。</li>
  <li>战役里有线索、动物、水路、遗失物或荒野旅行时，动物交谈、侦测魔法、物品定位术、水下呼吸和与自然交融会让游侠更像向导。</li>
  <li>如果控制和治疗已经有人扛住，猎人印记、闪电箭、迅捷箭袋或召唤计划就更容易成立。</li>
</ol>

<p>如果你还在选职业，可以配合 <a href="${ZH_DND_CLASSES_PATH}">DND 职业指南</a> 看。若你的短板是专注豁免，先看 <a href="${ZH_DND_CONSTITUTION_PATH}">D&amp;D 体质（Constitution）指南</a>，再决定是否压低体质。想比较另一种自然施法者，可以看 <a href="${ZH_DND_DRUID_SPELLS_PATH}">DND 德鲁伊法术指南</a>。</p>

<h2>游侠法术的虚拟桌面素材和骰子准备</h2>
<p>游侠法术在桌上可见时会顺很多。我宁愿用一个普通但所有人都看得懂的标记，也不想用一张漂亮但缩小后看不出状态的素材。</p>

<ul>
  <li>普通游侠头像素材用作默认战斗肖像。</li>
  <li>潜行或侦察版本可以做暗一点，专门给接近场景用。</li>
  <li>猎人印记的目标最好有清楚圆环或角标，别只靠口头记忆。</li>
  <li>专注标记也放在游侠身上，目标身上的标记不够。</li>
  <li>召唤物素材要在小尺寸下也能认出轮廓，尤其是野兽、精类和元素生物。</li>
  <li>荆棘丛生、云雾术、沉默术或植物滋长用简单覆盖层就够，重点是范围清楚。</li>
</ul>

<p>你可以在 <a href="${ZH_EDITOR_PATH}">虚拟桌面素材制作器（VTT token maker）</a> 里为 Roll20、Foundry VTT、Owlbear 或其他桌面工具制作这些素材。跑战斗时，把 <a href="${ZH_DICE_ROLLER_PATH}">D&amp;D 骰子工具（dice roller）</a> 放旁边会省事很多：猎人印记额外伤害、专注豁免、法术攻击、荆棘丛生移动伤害和召唤物攻击都能快速处理。</p>

<h2>DND 游侠法术常见问题</h2>
<h3>最好的 DND 游侠法术是哪些？</h3>
<p>多数桌上可以先检查猎人印记、神莓术、无踪潜行、荆棘丛生、诱捕打击、纠缠术、疗伤术、召唤野兽、行动自如和迅捷箭袋，然后再按队伍和战役删掉不需要的。</p>

<h3>DND 里游侠是准备法术吗？</h3>
<p>取决于规则版本。2014 版游侠知道有限数量的法术；2024 版游侠从游侠职业法术列表中准备法术。</p>

<h3>猎人印记永远是最好的游侠法术吗？</h3>
<p>不是。猎人印记适合高血量目标，但如果遭遇更看重潜行、地形控制或战场单位，无踪潜行、荆棘丛生、纠缠术、沉默术或召唤法术可能更强。</p>

<h3>游侠第一个法术应该拿什么？</h3>
<p>很多桌可以从猎人印记或神莓术开始，再补一个控制或探索法术，比如纠缠术、云雾术、大步奔行或动物交谈。</p>

<h3>最好的 2 环游侠法术是什么？</h3>
<p>如果队伍真的在意潜行，我会先看无踪潜行。战斗方面，如果地图有瓶颈或强制移动，荆棘丛生往往更有发挥空间。</p>

<h2 id="video">观看游侠法术配套视频</h2>
<p>这支 <a href="${DND_RANGER_SPELLS_VIDEO_URL}" rel="noreferrer noopener">游侠法术配套视频（Ranger spells companion video）</a> 适合开团前快速过一遍。核心提醒其实很朴素：每个场景先定一个主要专注计划，别把所有好法术都塞进同一回合。</p>

${liteVideoEmbed('P_qzyTFSrTE', 'DND 游侠法术配套视频', {
  src: DND_RANGER_SPELLS_VIDEO_PLACEHOLDER_PATH,
  alt: 'DND 游侠法术指南视频 WebP 封面，画面包含游侠、被标记猎物、骰子、法术卡和虚拟桌面森林地图',
})}
`;
