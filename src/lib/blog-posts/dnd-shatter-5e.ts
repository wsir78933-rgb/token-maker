import {
  DND_2024_RULES_GLOSSARY_URL,
  DND_SHATTER_2014_OBJECT_RULES_URL,
  DND_SHATTER_2014_RULES_URL,
  DND_SHATTER_2024_RULES_URL,
  DND_SHATTER_5E_RADIUS_IMAGE_PATH,
  DND_SHATTER_5E_VIDEO_PLACEHOLDER_PATH,
  DND_SHATTER_VIDEO_URL,
  EN_DICE_ROLLER_PATH,
  EN_DND_COUNTERSPELL_PATH,
  EN_DND_THUNDERCLAP_PATH,
  EN_EDITOR_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_COUNTERSPELL_PATH,
  ZH_DND_THUNDERCLAP_PATH,
  ZH_EDITOR_PATH,
  liteVideoEmbed,
} from './shared';

const DND_SHATTER_VIDEO_ID = 'GfjIe2xD1j0';

export const dndShatter5eArticleHtml = String.raw`
<p><strong>Shatter in DnD 5e works best when you choose the center before touching the dice.</strong> Pick a point within 60 feet, mark the 10-foot-radius Sphere, name every creature and eligible object inside it, then resolve one Constitution save per creature. The spell deals 3d8 Thunder damage on a failed save and half as much on a success.</p>

<p>Shatter is a level 2 Evocation spell with an Action casting time, Verbal, Somatic, and Material components, and an Instantaneous duration. It does not require Concentration. A higher-level slot adds 1d8 damage for each slot level above 2.</p>

<h2>Place the center before anyone rolls</h2>
<p>Point to the blast center first. Do not start with a creature and then stretch the Sphere until it catches extra targets. The 2024 rules define a Sphere as an area extending in straight lines from its point of origin, and the point itself is included.</p>

<p>At a 2024 table, Total Cover can block part of an area. If every straight line from the origin to a location is blocked, that location is outside the effect. If you choose an unseen point beyond an obstruction, the origin appears on the near side of that obstruction. Put the template down, check the wall, and settle the affected spaces before saves begin.</p>

<h2>Resolve one Shatter cast in five steps</h2>
<ol>
  <li><strong>Declare the rules version.</strong> Use the 2024 spell or the 2014 spell text already chosen for the campaign.</li>
  <li><strong>Choose a point within 60 feet.</strong> Confirm a clear legal origin before measuring the Sphere.</li>
  <li><strong>Mark the 10-foot-radius Sphere.</strong> Include creatures, allies, and unattended objects in the area check.</li>
  <li><strong>Roll one Constitution save per creature.</strong> Apply the correct disadvantage rule for the selected version.</li>
  <li><strong>Roll damage once.</strong> Apply full damage to failed saves and eligible objects, and half damage to successful saves.</li>
</ol>

<h2>Mark exactly who is inside the 10-foot Sphere</h2>
<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_SHATTER_5E_RADIUS_IMAGE_PATH}"
    alt="Top-down VTT grid with a Shatter point of origin, a four-square-diameter blast circle, two constructs inside, an ally outside, and a creature behind a stone wall"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>On a 5-foot grid, a 10-foot radius reaches two squares from the marked origin. Check each token and obstruction before rolling.</figcaption>
</figure>

<p>Allies do not receive automatic protection. If an ally is inside the Sphere, that ally makes the same Constitution save. The caster is affected only if the caster's space is inside the chosen area. Shatter also does not ask whether a creature can hear the noise, so deafness does not remove the damage.</p>

<h2>Use the right disadvantage rule for your ruleset</h2>
<p><strong>In the 2024 spell, a Construct has Disadvantage on the save.</strong> Check the creature type in its stat block. A metal-armored Humanoid is still a Humanoid, so armor alone does not trigger this rule.</p>

<p><strong>In the 2014 spell, a creature made of inorganic material such as stone, crystal, or metal has disadvantage on the save.</strong> That wording asks what the creature is made from rather than whether its type is Construct. Use the version printed on the character sheet or agreed at session zero; do not combine both triggers into a broader house rule by accident.</p>

<p>The core 2024 spell lists Bard, Sorcerer, and Wizard. The 2014 Basic Rules also put Shatter on the Warlock list. A subclass, feature, magic item, or later rules source can grant other access, so check the actual character option instead of relying on memory.</p>

<h2>Let unattended nonmagical objects take the hit</h2>
<p><strong>A nonmagical object that is not worn or carried also takes the damage if it is in the area.</strong> It does not make a Constitution save. A loose bottle, freestanding chair, dropped weapon, or unattended crate can take the same damage roll used for the creatures.</p>

<p>Worn or carried equipment is outside this object clause. Shatter does not automatically destroy armor, weapons in hand, spellbooks in packs, or every potion on a creature. Magical objects are also excluded by the spell text.</p>

<ul>
  <li><strong>Door or window:</strong> ask whether it is a destructible object, then compare the damage with the object's Hit Points.</li>
  <li><strong>Wall or building:</strong> the DM decides whether a section is a separate destructible object and whether destroying that section causes a collapse.</li>
  <li><strong>Loose scene dressing:</strong> bottles, lamps, crates, and furniture inside the Sphere can turn a clean blast into a noisy, visible mess.</li>
</ul>

<p>The 2024 object rules give suggested Hit Points from 2 for a fragile Tiny object to 27 for a resilient Large object. Those numbers make a break possible; they do not promise that one second-level slot demolishes any wall the caster points at.</p>

<h2>Spend the slot when the blast changes the turn</h2>
<h3>Catch at least two useful targets</h3>
<p>One failed save averages 13.5 Thunder damage at level 2. The slot becomes much more efficient when two or three enemies fit inside the Sphere without an ally joining them. Constitution saves are often strong on large, durable monsters, so count targets before betting the slot on one tough enemy.</p>

<h3>Pressure Constructs under the 2024 rule</h3>
<p>Disadvantage makes Shatter more reliable against a cluster of Constructs, but it does not bypass Thunder resistance or immunity. Read the stat block first. The creature type controls the disadvantage trigger; its defenses still control the final damage.</p>

<h3>Break an object only when the opening matters now</h3>
<p>A fragile lock, window, support, or barricade can be worth a spell slot when opening the route changes the encounter. If the party has time and safe tools, save the slot. Shatter is loud, immediate force, not a replacement for every crowbar or set of thieves' tools.</p>

<h2>Roll damage once, then record each result</h2>
<p>Roll the damage pool once for the cast. At level 2, use 3d8; at levels 3, 4, and 5, use 4d8, 5d8, and 6d8. Each creature's save decides whether that creature takes the full result or half. Eligible objects take the full result.</p>

<p>Round halved damage down unless a rule says otherwise. The <a href="${EN_DICE_ROLLER_PATH}">DnD dice roller</a> is useful when several creatures save differently: keep one damage result visible, then mark full or half beside each token.</p>

<h2>Watch an advanced Shatter breakdown</h2>
<p><a href="${DND_SHATTER_VIDEO_URL}" rel="noreferrer noopener">Pack Tactics' advanced Shatter guide</a> focuses on tactical value and target selection. Compare each example with the version your table plays, especially the disadvantage trigger and the creatures' Thunder defenses.</p>

${liteVideoEmbed(DND_SHATTER_VIDEO_ID, 'Shatter kills people in D&D 5E - Advanced Guide to Shatter', {
  src: DND_SHATTER_5E_VIDEO_PLACEHOLDER_PATH,
  alt: 'Video thumbnail for an advanced Shatter DnD 5e tactics guide',
})}

<h2>Show the blast clearly on a VTT</h2>
<p>Place a visible origin marker, add a 10-foot-radius template, and mark failed saves before removing the template. That short sequence keeps allies, objects, and walls from being forgotten. For recurring Construct encounters, give enemy tokens a readable metal or stone silhouette rather than relying on tiny nameplates.</p>

<p>The <a href="${EN_EDITOR_PATH}">Token Maker editor</a> can turn a portrait into a clear round token for Roll20 or Foundry. Use a distinct border for allies, another for Constructs, and keep the blast template separate from the token art. For another Thunder spell with a very different position problem, compare the <a href="${EN_DND_THUNDERCLAP_PATH}">Thunderclap guide</a>. The <a href="${EN_DND_COUNTERSPELL_PATH}">Counterspell guide</a> covers the reaction window before the blast resolves.</p>

<h2>Shatter DnD 5e FAQ</h2>
<h3>What does Shatter do in DnD 5e?</h3>
<p>Shatter creates a 10-foot-radius Sphere at a point within 60 feet. Creatures in the area make Constitution saves, taking 3d8 Thunder damage on a failure or half on a success. Eligible unattended nonmagical objects take the damage too.</p>

<h3>Does Shatter hurt allies?</h3>
<p>Yes. Shatter affects each creature in the Sphere, including allies and potentially the caster. Place the origin and check every occupied space before rolling saves.</p>

<h3>Can Shatter break a door or wall?</h3>
<p>Shatter can damage a nonmagical door or other unattended object in its area. A wall section works only if the DM treats it as a destructible object; its Hit Points and the consequences of breaking one section remain the DM's call.</p>

<h3>Does Shatter work through walls?</h3>
<p>Total Cover can block a Shatter area. Under the 2024 area rules, a location is excluded when every straight line from the origin to that location is blocked, and an unseen origin beyond an obstruction appears on the near side.</p>

<h3>Who has Disadvantage on the Shatter save?</h3>
<p>The 2024 spell gives a Construct Disadvantage on the save. The 2014 spell instead applies disadvantage to a creature made of inorganic material such as stone, crystal, or metal. Use the wording for your table's rules version.</p>

<h2>Sources</h2>
<ul>
  <li><a href="${DND_SHATTER_2024_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond: Shatter (2024)</a></li>
  <li><a href="${DND_SHATTER_2014_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond Basic Rules (2014): Shatter</a></li>
  <li><a href="${DND_2024_RULES_GLOSSARY_URL}" rel="noreferrer noopener">D&amp;D Beyond Basic Rules (2024): Rules Glossary</a></li>
  <li><a href="${DND_SHATTER_2014_OBJECT_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond Basic Rules (2014): Objects</a></li>
</ul>
`;

export const dndShatter5eArticleHtmlZh = String.raw`
<p><strong>在 DnD 5e 里施放 Shatter（粉碎音波）时，先定中心点，再碰骰子。</strong>选择 60 英尺内一点，标出 10 英尺半径球形区域，逐个确认区域内的生物和符合条件的物体，然后让每个生物分别做体质豁免。豁免失败承受 3d8 雷鸣伤害，成功则承受一半。</p>

<p>Shatter 是 2 环塑能法术，施法时间为一个动作，需要言语、姿势和材料成分，持续时间为瞬时，不需要专注。使用高于 2 环的法术位时，每高一环增加 1d8 伤害。</p>

<h2>先确定爆点，再掷任何骰子</h2>
<p>先指出爆炸中心。不要先选一只生物，再拉扯球形区域去够额外目标。2024 规则把球形区域定义为从源点向所有方向直线延伸，源点本身也在区域内。</p>

<p>在 2024 规则下，完全掩护（Total Cover）能挡住区域的一部分。如果从源点到某个位置的所有直线都被阻挡，该位置不在效果内。若你选择障碍物后方一个看不见的点，源点会出现在障碍物靠近你的一侧。先放模板、检查墙体，再开始豁免。</p>

<h2>按五个步骤结算一次 Shatter</h2>
<ol>
  <li><strong>声明规则版本。</strong>使用本次战役已经确定的 2024 或 2014 法术文本。</li>
  <li><strong>选择 60 英尺内一点。</strong>确认这是合法、路径清楚的源点，再测量球形区域。</li>
  <li><strong>标出 10 英尺半径球形区域。</strong>检查其中的敌人、盟友和无人携带物体。</li>
  <li><strong>每个生物分别做体质豁免。</strong>按所选版本应用正确的劣势规则。</li>
  <li><strong>伤害只掷一次。</strong>豁免失败者和符合条件的物体承受全部伤害，豁免成功者承受一半。</li>
</ol>

<h2>逐个确认谁在 10 英尺球形区域里</h2>
<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_SHATTER_5E_RADIUS_IMAGE_PATH}"
    alt="俯视 VTT 网格展示 Shatter 源点、四格直径爆炸圆、区域内两只构装体、区域外盟友和石墙后的生物"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>在 5 英尺网格上，10 英尺半径从源点向外延伸两格。掷骰前逐个检查 Token 和障碍物。</figcaption>
</figure>

<p>盟友不会自动获得保护。盟友在球形区域内，就要做同样的体质豁免。只有当施法者所在格也落进所选区域时，施法者才会受影响。Shatter 也没有要求生物必须听到声音，所以耳聋不会免除伤害。</p>

<h2>按规则版本使用正确的豁免劣势</h2>
<p><strong>2024 法术写的是：构装体（Construct）的豁免具有劣势。</strong>直接检查属性块里的生物类型。穿金属甲的人形生物仍是人形生物，不会仅因盔甲是金属就触发这条规则。</p>

<p><strong>2014 法术写的是：由石头、水晶或金属等无机材料构成的生物进行该豁免时具有劣势。</strong>旧文本看的是生物由什么构成，不是它的类型是否为 Construct。使用角色卡或开团时选定的版本，不要无意中把两种触发条件合并成更宽的自订规则。</p>

<p>2024 核心法术表列出吟游诗人、术士和法师；2014 基础规则还把 Shatter 放在邪术师法术表里。子职、职业能力、魔法物品或后续规则来源也可能提供其他获取方式，直接检查角色使用的具体选项。</p>

<h2>让无人携带的非魔法物体承受伤害</h2>
<p><strong>没有被穿戴或携带的非魔法物体也会受到伤害，只要它位于区域内。</strong>这类物体不做体质豁免。松放的瓶子、独立椅子、掉落武器或无人看管的木箱，都可以承受本次对生物所用的同一个伤害结果。</p>

<p>被穿戴或携带的装备不属于这条物体效果。Shatter 不会自动毁掉盔甲、手中武器、背包里的法术书或角色带着的每瓶药水。法术文本也排除了魔法物体。</p>

<ul>
  <li><strong>门或窗：</strong>先确认它是否为可破坏物体，再用伤害和物体生命值比较。</li>
  <li><strong>墙或建筑：</strong>由 DM 判断某一段是否为独立可破坏物体，以及打坏一段会不会导致整体坍塌。</li>
  <li><strong>松散场景物：</strong>区域内的瓶子、灯具、木箱和家具会让一次干净爆炸变得吵闹又显眼。</li>
</ul>

<p>2024 物体规则给出的建议生命值，从易碎微型物体的 2 点到坚固大型物体的 27 点。它们让破坏可以结算，但不保证一个 2 环法术位能拆掉施法者指向的任何墙。</p>

<h2>爆炸能改变这个回合时再花法术位</h2>
<h3>至少覆盖两个有价值的目标</h3>
<p>2 环时，一次豁免失败平均承受 13.5 点雷鸣伤害。若球形区域能装下两三个敌人，又没有盟友，法术位才明显更划算。大型、强壮怪物常有不错的体质豁免，不要只看一个硬目标就急着投入法术位。</p>

<h3>用 2024 规则压制构装体</h3>
<p>劣势会提高 Shatter 对成群构装体的可靠度，但不会绕过雷鸣抗性或免疫。先读属性块。生物类型决定是否触发豁免劣势，防御能力仍决定最终伤害。</p>

<h3>只有通路必须立刻打开时才炸物体</h3>
<p>易碎锁具、窗户、支撑物或路障如果能立刻改变遭遇，就可能值得一个法术位。队伍若有时间和安全工具，保留法术位。Shatter 提供的是响亮、即时的破坏力，不是所有撬棍和盗贼工具的替代品。</p>

<h2>伤害只掷一次，再记录每个结果</h2>
<p>整次施法只掷一组伤害。2 环使用 3d8；3、4、5 环分别使用 4d8、5d8、6d8。每个生物的豁免决定它承受全部还是一半，符合条件的物体承受全部结果。</p>

<p>除非规则另有说明，减半伤害向下取整。多个生物出现不同豁免结果时，可以用 <a href="${ZH_DICE_ROLLER_PATH}">DnD 骰子工具</a>保留同一个伤害结果，再在每个 Token 旁标记全部或一半。</p>

<h2>观看 Shatter 进阶解析</h2>
<p><a href="${DND_SHATTER_VIDEO_URL}" rel="noreferrer noopener">Pack Tactics 的 Shatter 进阶指南</a>重点讨论战术价值和目标选择。对照每个案例时，先确认当前桌面采用的版本，尤其是豁免劣势触发条件和目标的雷鸣防御。</p>

${liteVideoEmbed(DND_SHATTER_VIDEO_ID, 'Shatter kills people in D&D 5E - Advanced Guide to Shatter', {
  src: DND_SHATTER_5E_VIDEO_PLACEHOLDER_PATH,
  alt: 'Shatter DnD 5e 进阶战术指南视频缩略图',
})}

<h2>在 VTT 上清楚标出爆炸</h2>
<p>放下可见源点，添加 10 英尺半径模板，标记豁免失败者后再移除模板。这个短流程能避免漏掉盟友、物体和墙体。若战役常出现构装体，让敌方 Token 使用清楚的金属或石质轮廓，不要只依赖很小的名字标签。</p>

<p><a href="${ZH_EDITOR_PATH}">Token Maker 编辑器</a>可以把角色图处理成适合 Roll20 或 Foundry 的清楚圆形 Token。盟友使用一种边框，构装体使用另一种，爆炸模板则与 Token 图分开。另一种雷鸣法术有完全不同的站位问题，可对照 <a href="${ZH_DND_THUNDERCLAP_PATH}">Thunderclap 指南</a>。<a href="${ZH_DND_COUNTERSPELL_PATH}">Counterspell 指南</a>则处理爆炸结算前的反应窗口。</p>

<h2>Shatter DnD 5e FAQ</h2>
<h3>Shatter 在 DnD 5e 里有什么效果？</h3>
<p>Shatter 在 60 英尺内一点创造 10 英尺半径球形区域。区域内生物进行体质豁免，失败承受 3d8 雷鸣伤害，成功承受一半；符合条件、无人携带的非魔法物体也会受伤。</p>

<h3>Shatter 会伤害盟友吗？</h3>
<p>会。Shatter 影响球形区域内每个生物，包括盟友，也可能包括施法者。放好源点后逐格检查，再掷豁免。</p>

<h3>Shatter 能打破门或墙吗？</h3>
<p>Shatter 能伤害区域内的非魔法门或其他无人携带物体。只有当 DM 把某段墙视为可破坏物体时，墙体才按物体结算；该段生命值和破坏后果仍由 DM 决定。</p>

<h3>Shatter 能穿过墙吗？</h3>
<p>完全掩护能挡住 Shatter 区域。按 2024 区域规则，若从源点到某位置的所有直线都被阻挡，该位置不受影响；障碍物后的不可见源点会出现在障碍物靠近施法者的一侧。</p>

<h3>谁进行 Shatter 豁免时有劣势？</h3>
<p>2024 法术让构装体（Construct）的豁免具有劣势。2014 法术则让由石头、水晶或金属等无机材料构成的生物进行该豁免时具有劣势。使用当前桌面的规则版本。</p>

<h2>来源</h2>
<ul>
  <li><a href="${DND_SHATTER_2024_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond：Shatter（2024）</a></li>
  <li><a href="${DND_SHATTER_2014_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond 基础规则（2014）：Shatter</a></li>
  <li><a href="${DND_2024_RULES_GLOSSARY_URL}" rel="noreferrer noopener">D&amp;D Beyond 基础规则（2024）：规则术语表</a></li>
  <li><a href="${DND_SHATTER_2014_OBJECT_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond 基础规则（2014）：物体</a></li>
</ul>
`;
