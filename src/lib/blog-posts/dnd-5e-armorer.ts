import {
  DND_ARMORER_2014_SOURCE_URL,
  DND_ARMORER_2025_SOURCE_URL,
  EN_DND_ARMOR_PATH,
  EN_DND_CLASSES_PATH,
  EN_DND_MAGE_ARMOR_PATH,
  EN_DND_SWORD_SHEATHS_PATH,
  EN_EDITOR_PATH,
  ZH_DND_ARMOR_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_DND_MAGE_ARMOR_PATH,
  ZH_DND_SWORD_SHEATHS_PATH,
  ZH_EDITOR_PATH,
} from './shared';

export const dnd5eArmorerArticleHtml = String.raw`
<p>Your first Armorer decision is not a feat or an infusion. It is the job your party needs you to cover. At a 2014 Tasha's Cauldron of Everything table, that job leads to Guardian or Infiltrator. At a 2025 Eberron: Forge of the Artificer table, Dreadnaught is also on the bench. Choose from the book your table uses, then build the suit around one clear job.</p>

<h2>Confirm the rulebook at your table</h2>
<p>The 2014 Armorer has two Armor Models. Guardian uses Thunder Gauntlets to pressure enemies that would rather attack your allies, while Infiltrator uses a Lightning Launcher, speed, and stealth to work at range. Before swapping suits, read the Armor Model text in your 2014 rules and keep smith's tools ready; that text gives the rest-period requirement for the change.</p>

<p>The 2025 Armorer keeps Guardian and Infiltrator and adds Dreadnaught. Dreadnaught is the reach-and-positioning model. Do not give a 2014 character a Dreadnaught feature because a newer book exists. A 2025 character uses the three-model set printed in the 2025 book.</p>

<h2>Pick the party job before you choose the suit</h2>
<h3>Guardian for a threatened back line</h3>
<p>Choose Guardian when the party's healer, controller, or low-Armor-Class ally keeps getting caught by melee enemies. Put yourself where two dangerous creatures must decide between a worse attack against someone else and dealing with you. A Guardian does not need to chase every target. Keep the enemies that can break the party's plan close enough that your gauntlets matter.</p>

<h3>Infiltrator for range, stealth, and a moving objective</h3>
<p>Choose Infiltrator when the group needs someone to reach a lever, carry a message through a hostile map, scout ahead, or keep attacking while the front line is crowded. Pick a lane before combat starts. Your job is not to stand in the middle just because your armor looks durable. Use the mobility and stealth tools to create an angle that the rest of the party cannot create.</p>

<h3>Dreadnaught for the 2025 reach-and-positioning job</h3>
<p>Choose Dreadnaught only when your table uses the 2025 Armorer. Use it when the encounter rewards reach, size, and moving enemies away from a vulnerable ally or toward a place the party controls. Treat it as a positioning role first. The point is to change where the fight happens, not to collect every enemy in a pile without a plan.</p>

<h2>Give your first combat round one job</h2>
<h3>Guardian round</h3>
<p>Start beside the threat that can reach the back line first. Hit the enemies whose attacks matter most, then use your defensive resources when taking their attention will actually protect another character. A good Guardian round leaves the party's fragile character with a safer turn, even when your own damage is ordinary.</p>

<h3>Infiltrator round</h3>
<p>Start with the target that controls the map: a spellcaster, archer, runner, or creature guarding the objective. Put the Lightning Launcher where it creates pressure without forcing you into a bad square. If you must cross the map next round, keep a route open now instead of spending every turn next to the toughest creature.</p>

<h3>Dreadnaught round</h3>
<p>Start with the space, not the target. Find the square that blocks a corridor, reaches a protected enemy, or gives an ally room to retreat. Then use the model's reach and forced-position tools to make that space expensive for enemies to ignore.</p>

<h2>Spend your equipment on the party's weak point</h2>
<p>At 9th level in the 2014 Armorer, Armor Modifications lets different parts of Arcane Armor hold separate infusions. Treat that feature as an allocation choice, not a shopping list. Write down one failure your suit must prevent, one action your party needs more often, and one item an ally needs more than you do.</p>

<p>If the front line falls too quickly, keep the defensive piece on yourself. If the party cannot land a crucial control spell, giving an ally the right enhancement can do more than another personal bonus. Review that split after a difficult session. The strongest-looking suit is not always the one that gave the party the best round.</p>

<h2>Change models during rest, not in the middle of a dispute</h2>
<p>Before the rest that permits a model change, write three lines on the character sheet:</p>
<ol>
  <li>The next scene needs Guardian, Infiltrator, or, in the 2025 rules, Dreadnaught.</li>
  <li>The armor and equipment you will be wearing when that model comes online.</li>
  <li>The first job you will take when combat or exploration begins.</li>
</ol>

<p>Show that note to the DM before the next scene when the campaign changes pace. It keeps a stealth mission from beginning with a tank plan by accident, and it keeps a boss fight from becoming a rules argument about an unannounced swap.</p>

<h2>Make the armor job readable on a VTT token</h2>
<p>A player should be able to identify the suit's job at map size before reading the character sheet.</p>
<ul>
  <li><strong>Guardian:</strong> use a front-facing crop, a broad shoulder or gauntlet silhouette, and a steady defensive border. Keep the face visible so allies can still identify the character.</li>
  <li><strong>Infiltrator:</strong> use a three-quarter crop with one clear launcher line or lightning detail. Leave more negative space around the silhouette than you would for a heavy frontliner.</li>
  <li><strong>Dreadnaught:</strong> use a wider stance or a long reach cue that does not cover the portrait. Save bright effects for the model's active state instead of turning every token into a burst of light.</li>
</ul>

<p>Open the <a href="${EN_EDITOR_PATH}">Token Maker editor</a>, crop around the one detail that names the current model, then export a transparent PNG for Roll20, Foundry VTT, or Owlbear. Use a separate token only when the model changes at rest; do not make every temporary effect into a permanent new portrait.</p>

<h2>Bring this three-line note to the next session</h2>
<p>Write the rulebook, the current model, and the job you are covering. For example: "2014 Tasha's. Guardian. Keep the enemy bruiser off the Wizard." That note tells the table which rules apply and tells you where to stand before initiative starts.</p>

<p>For nearby decisions, compare the <a href="${EN_DND_ARMOR_PATH}">DnD Armor Guide</a>, <a href="${EN_DND_CLASSES_PATH}">DnD Classes Explained</a>, <a href="${EN_DND_MAGE_ARMOR_PATH}">Mage Armor</a>, and <a href="${EN_DND_SWORD_SHEATHS_PATH}">DnD Sword Sheaths</a>.</p>

<h2>Rules sources</h2>
<ul>
  <li><a href="${DND_ARMORER_2014_SOURCE_URL}" rel="noreferrer noopener">D&amp;D Beyond: Artificer 101, Armorer from Tasha's Cauldron of Everything</a></li>
  <li><a href="${DND_ARMORER_2025_SOURCE_URL}" rel="noreferrer noopener">D&amp;D Beyond: Forge Your Story With 5 Inventive Artificer Subclasses</a></li>
</ul>
`;

export const dnd5eArmorerArticleHtmlZh = String.raw`
<p>装甲师最先要决定的不是专长或灌注，而是队伍缺哪一个位置。使用 2014《塔莎的万事坩埚》的桌子，在 Guardian 和 Infiltrator 之间选；使用 2025《Eberron: Forge of the Artificer》的桌子，还能选择 Dreadnaught。先确认全桌用哪本书，再围绕一个明确职责做这套装甲。</p>

<h2>先确认你这桌使用的规则书</h2>
<p>2014 装甲师有两种装甲模型。Guardian 用 Thunder Gauntlets 牵制原本会去攻击队友的敌人；Infiltrator 用 Lightning Launcher、移动能力和潜行从远处做事。更换前，先对照 2014 规则书中的 Armor Model 条目，并备好 smith's tools；该条目写明了更换所需的休息条件。</p>

<p>2025 装甲师保留 Guardian 和 Infiltrator，并加入 Dreadnaught。Dreadnaught 是围绕触及和站位操作的模型。不要因为看到了新版资料，就把 Dreadnaught 的能力塞给 2014 角色。2025 角色则使用 2025 规则书里写明的三种模型。</p>

<h2>先看队伍缺什么，再选装甲模型</h2>
<h3>Guardian：后排常被威胁时</h3>
<p>当治疗者、控场者或低 AC 队友经常被近战敌人贴住时，选 Guardian。站到两个危险敌人不得不做选择的位置：攻击别人会更难，先处理你又会浪费它们的回合。Guardian 不需要追着每个敌人跑。优先留住真正能打断队伍计划的目标。</p>

<h3>Infiltrator：需要远程、潜行或移动目标时</h3>
<p>队伍需要有人先摸到机关、穿过危险地图送信、前出侦察，或在前排拥挤时持续攻击，就选 Infiltrator。开战前先选好路线。你的职责不是因为穿着护甲就站到人群中央，而是用移动和潜行做出队友做不到的角度。</p>

<h3>Dreadnaught：2025 规则里的触及和站位任务</h3>
<p>只有本桌使用 2025 装甲师时才选 Dreadnaught。遭遇要求你用触及、体型和位置变化把敌人从脆弱队友身边赶开，或拉到队伍控制的区域时，它才是合适答案。先把它当作站位模型，再考虑伤害。重点是改变战斗发生的位置。</p>

<h2>给第一回合一个明确职责</h2>
<h3>Guardian 的第一回合</h3>
<p>先站到最容易冲进后排的敌人旁边。攻击那些最值得牵制的目标，再在替另一名角色挡住威胁时使用防御资源。一个好的 Guardian 回合，会让队里最脆的人得到更安全的一回合，即使你自己没有打出最高伤害。</p>

<h3>Infiltrator 的第一回合</h3>
<p>先盯住控制地图的目标：施法者、远程攻击者、逃跑者，或守着任务物品的敌人。让 Lightning Launcher 在不把你送进坏格子的位置产生压力。下回合需要横穿地图，就在这一回合留好路线，不要每次都贴着最硬的敌人站。</p>

<h3>Dreadnaught 的第一回合</h3>
<p>先看格子，再看目标。找一处能堵住走廊、够到被保护的敌人，或让队友能撤开的站位。然后用模型的触及和位移手段，让敌人很难无视那个区域。</p>

<h2>把装备留给队伍最薄弱的位置</h2>
<p>2014 装甲师 9 级的 Armor Modifications 能让 Arcane Armor 的不同部位承载不同灌注。把它当作分配问题，不是购物清单。写下这套装甲必须阻止的一个失败、队伍更常需要的一种行动，以及比起你自己，哪位队友更需要一件物品。</p>

<p>前排扛不住时，把防御部件留在自己身上；队伍总在关键控制上失手时，给队友合适的强化往往比再堆一层个人加值更值。打完一次困难遭遇后重新看这份分配。看起来最豪华的装甲，不一定给全队带来最好的一回合。</p>

<h2>在休息时换模型，不要在争论里换</h2>
<p>在允许更换模型的休息前，在角色卡上写三行：</p>
<ol>
  <li>下一幕需要 Guardian、Infiltrator，或 2025 规则下的 Dreadnaught。</li>
  <li>该模型上线时你会穿什么护甲、带什么装备。</li>
  <li>探索或战斗开始后，你的第一个职责是什么。</li>
</ol>

<p>战役节奏变化时，在下一幕开始前把这张小纸条给 DM 看。这样潜行任务不会意外带着纯坦克方案开始，Boss 战也不会因为没提前说的换装变成规则争论。</p>

<h2>让装甲职责在 VTT Token 上看得见</h2>
<p>把 Token 缩到地图尺寸后，玩家应该不用读角色卡也能认出这套装甲的职责。</p>
<ul>
  <li><strong>Guardian：</strong>用正面构图、宽肩或拳套轮廓，再配稳定的防御边框。脸仍然要清楚，队友才能一眼认出角色。</li>
  <li><strong>Infiltrator：</strong>用四分之三侧身构图，保留一条清楚的发射器或闪电细节。比重型前排多留一点轮廓周围的空白。</li>
  <li><strong>Dreadnaught：</strong>用更宽的站姿或一条不压住头像的长触及提示。明亮特效只留给模型激活状态，不要让每个 Token 都像一团爆光。</li>
</ul>

<p>打开 <a href="${ZH_EDITOR_PATH}">Token Maker 编辑器</a>，围绕当前模型最能说明身份的一个细节裁切，再导出给 Roll20、Foundry VTT 或 Owlbear 用的透明 PNG。只有模型在休息后改变时，才另做一个 Token；不要把每个临时效果都画成永久新头像。</p>

<h2>带着这三行说明去下一次游戏</h2>
<p>写下规则书、当前模型和你承担的职责。例如：“2014《塔莎的万事坩埚》。Guardian。别让重装敌人贴到法师。”这三行能让全桌知道该用哪套规则，也能让你在先攻开始前知道该站哪里。</p>

<p>接下来可以对照 <a href="${ZH_DND_ARMOR_PATH}">DND 护甲指南</a>、<a href="${ZH_DND_CLASSES_PATH}">DND 职业说明</a>、<a href="${ZH_DND_MAGE_ARMOR_PATH}">法师护甲</a> 和 <a href="${ZH_DND_SWORD_SHEATHS_PATH}">DND 剑鞘指南</a>。</p>

<h2>规则来源</h2>
<ul>
  <li><a href="${DND_ARMORER_2014_SOURCE_URL}" rel="noreferrer noopener">D&amp;D Beyond：来自《塔莎的万事坩埚》的装甲师</a></li>
  <li><a href="${DND_ARMORER_2025_SOURCE_URL}" rel="noreferrer noopener">D&amp;D Beyond：五个巧思工匠子职业</a></li>
</ul>
`;
