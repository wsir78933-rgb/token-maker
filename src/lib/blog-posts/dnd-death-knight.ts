import {
  DND_DEATH_KNIGHT_2014_SOURCE_URL,
  DND_DEATH_KNIGHT_ASPIRANT_2025_STAT_BLOCK_URL,
  DND_DEATH_KNIGHT_2025_ERRATA_URL,
  DND_DEATH_KNIGHT_2025_SOURCE_URL,
  DND_DEATH_KNIGHT_2025_STAT_BLOCK_URL,
  EN_DND_GHOST_PATH,
  EN_DND_NECROMANCER_SPELLS_PATH,
  EN_EDITOR_PATH,
  ZH_DND_GHOST_PATH,
  ZH_DND_NECROMANCER_SPELLS_PATH,
  ZH_EDITOR_PATH,
} from './shared';

export const dndDeathKnightArticleHtml = String.raw`
<p>Use a 2025 DnD Death Knight when you need an undead commander with a goal, not a lone pile of hit points in an empty room. Put an objective behind it: a sealed gate, a captured relic, a bridge the party must cross, or a living witness the knight wants alive. Give the party a way to stop that objective before the commander gets every round it wants.</p>

<h2>Build the battlefield before initiative</h2>
<p>Draw three useful spaces before you place the Death Knight token. The first is an open lane where the party can see the commander. The second is cover that lets them break line of sight and recover from a blast. The third is a pressure point: a door, ritual circle, hostage, or escape route that becomes worse when the party ignores it.</p>
<p>Place the Death Knight where it can choose between the open lane and the pressure point. Put its undead allies on different jobs. One group guards the objective, one holds a route, and one threatens a back-line character from range. Do not stack every undead creature in one square of map space. The commander should make the party choose which problem to solve first.</p>

<h2>Open with a threat the party can answer</h2>
<h3>Round one: split the field before the lines meet</h3>
<p>Use Hellfire Orb when several characters have chosen the same exposed area and the blast will not catch the Death Knight's own force. Put cover within a move of the impact zone. The point is to make the next decision sharper, not to remove a player before the encounter begins.</p>

<h3>Round two: make the undead line matter</h3>
<p>Make Marshal Undead matter by placing its beneficiaries where their jobs are visible. A skeletal archer behind cover, a heavy undead holding a doorway, and a mobile threat on a side lane create different questions for the party. Keep the aura's beneficiaries written on the initiative tracker so you do not lose track of the trait in a crowded round.</p>

<h3>After a player acts: spend legendary pressure on a decision</h3>
<p>The 2025 Death Knight is legendary. Do not spend every legendary option on the same target by habit. Use the pressure to punish a character who abandons the objective, to force a choice between movement and protection, or to keep a wounded ally from treating a safe-looking square as permanent shelter. Leave one answer available. A hard encounter still needs a route back into the fight.</p>

<h2>Choose companions by job, not by skull count</h2>
<p>A Death Knight Aspirant is a separate CR 11 creature in the 2025 Monster Manual. Use one as the commander of an earlier fortress raid, a pursuit scene, or a smaller undead patrol. It gives the campaign a recognizable military style before the CR 17 Death Knight arrives.</p>
<p>When you run the full Death Knight, give it companions that do something it cannot do alone. Use ranged undead to contest cover, durable undead to hold a doorway, or a fast mount or scout to threaten the escape route. Avoid adding an Aspirant only because the names match. Two commanders often create the same turn twice and crowd the encounter's main decision.</p>

<h2>Choose a scenario by the party's job</h2>
<h3>The outer-gate warning</h3>
<p>Use a Death Knight Aspirant when the full CR 17 commander would arrive too early in the campaign. Give the party one gate to reach, one alarm they can silence, and two undead jobs: a tough line at the entrance and ranged pressure from a wall or window. The Aspirant should try to delay the party until the alarm sounds, then withdraw instead of fighting to destruction. This scene tells the table what army is waiting deeper in the fortress without asking a lower-tier group to defeat the final commander.</p>

<h3>The reliquary hold</h3>
<p>Use the full Death Knight when the party's job is to take or protect one object in a room with more than one route. Put the relic where everyone can see it, leave cover on both sides of the approach, and assign one undead group to the object while another threatens the back line. The Death Knight can then choose between stopping the carrier, defending the relic, or driving the party away from cover. End the encounter when the relic leaves the room, the ward fails, or the commander secures its demand; the last hit point does not need to decide every result.</p>

<h3>The last march</h3>
<p>Use the full Death Knight for a finale in motion: a bridge crossing, a funeral procession, or an army moving toward a city gate. Make the pressure point move at the end of each round, such as a wagon reaching the bridge span or a prisoner being carried toward a portal. Give the undead line one job to delay pursuit and one job to protect the moving objective. The party must choose whether to race the commander, cut off the escort, or spend a round buying safety for civilians. That choice gives a large battlefield a clear center without requiring a huge list of creatures.</p>

<h2>Let the commander's armor reveal the story</h2>
<p>Give the armor one broken promise that the party can see. A funeral ribbon remains tied beneath the gorget. The shield bears the crest of a town the knight failed to save. A signet ring is fused to a gauntlet that will not open. Put that detail in the first description, then let it return at the objective or in the knight's demand.</p>
<p>Keep the demand simple. The Death Knight wants the relic returned, the gate opened, the witness delivered, or the oath fulfilled. A clear demand tells the players what a bargain, surrender, or retreat would cost. It also gives you a reason for the undead force to reposition instead of fighting until every creature drops.</p>

<h2>What changes at a 2014 table</h2>
<p>Use the 2014 Death Knight only when that is the stat block your table has chosen. The 2025 Monster Manual replaces the 2014 monster stat blocks when your table uses the newer book. The 2025 entry gives the Death Knight legendary creature support and adds the Death Knight Aspirant; do not borrow either one into a 2014 encounter without telling the table that you are changing the encounter.</p>
<p>Keep the same scene structure in either rules set: an objective, cover, an undead line with separate jobs, and a reason to negotiate. Then read the printed stat block and current errata before play. The 2025 errata changes the Death Knight's listed spellcasting frequency to "2/Day Each," so prepare those choices from the corrected text.</p>

<h2>Make the commander readable on a VTT map</h2>
<p>At map size, the Death Knight needs one unmistakable silhouette: a dark plate helm, a long blade or shield edge, and one restrained necromantic accent. Use a colder border for the commander and a plainer border for ordinary undead. Do not give every minion the same bright green glow or the battle map turns into a row of identical lights.</p>
<p>Open the <a href="${EN_EDITOR_PATH}">Token Maker editor</a>, crop the commander from the knees up, keep the weapon inside the frame, and leave the faceplate readable. Export a transparent PNG for Roll20, Foundry VTT, or Owlbear. Make a second token only when the story changes the commander in a visible way, such as a broken helm after the party learns who wore it.</p>

<h2>Bring this encounter note to the table</h2>
<ol>
  <li><strong>Objective:</strong> what the Death Knight wants before it kills anyone.</li>
  <li><strong>Pressure point:</strong> the square, door, person, or ritual the party cannot ignore.</li>
  <li><strong>Undead jobs:</strong> which allies guard, hold, and threaten from range.</li>
</ol>

<p>For rules checks, use the 2025 Monster Manual stat block your table owns, then apply the current Monster Manual errata before play. At a 2014 table, keep the older Death Knight stat block separate instead of importing the Aspirant or Legendary Actions.</p>

<p>For other undead encounter material, use the <a href="${EN_DND_GHOST_PATH}">DnD Ghost guide</a> for a different kind of haunting threat and <a href="${EN_DND_NECROMANCER_SPELLS_PATH}">Necromancer spells</a> for player-side undead magic.</p>

<h2>Rules sources</h2>
<ul>
  <li><a href="${DND_DEATH_KNIGHT_2025_SOURCE_URL}" rel="noreferrer noopener">D&amp;D Beyond: Updates in the Monster Manual (2025)</a></li>
  <li><a href="${DND_DEATH_KNIGHT_2025_ERRATA_URL}" rel="noreferrer noopener">D&amp;D Beyond: Monster Manual (2025) errata</a></li>
  <li><a href="${DND_DEATH_KNIGHT_2025_STAT_BLOCK_URL}" rel="noreferrer noopener">Roll20 Compendium: Death Knight (2025)</a></li>
  <li><a href="${DND_DEATH_KNIGHT_ASPIRANT_2025_STAT_BLOCK_URL}" rel="noreferrer noopener">Roll20 Compendium: Death Knight Aspirant (2025)</a></li>
  <li><a href="${DND_DEATH_KNIGHT_2014_SOURCE_URL}" rel="noreferrer noopener">D&amp;D Beyond: Monster Manual (2014)</a></li>
</ul>
`;

export const dndDeathKnightArticleHtmlZh = String.raw`
<p>当你需要的不是空房间里一大块血量，而是一位带着目标的亡灵指挥官时，再把 2025 DND 死亡骑士放上地图。把目标放在它身后：封住的城门、被夺走的遗物、必须通过的桥，或它想活捉的证人。让队伍有办法在死亡骑士得到每一个回合前阻止这个目标。</p>

<h2>先布置战场，再掷先攻</h2>
<p>放死亡骑士 Token 前，先画出三个有用区域。第一个是队伍能看见指挥官的开阔路线。第二个是能切断视线、从爆炸后缓过来的掩体。第三个是压力点：门、仪式圈、人质或逃生路线，队伍不理它就会越来越糟。</p>
<p>把死亡骑士放到能在开阔路线和压力点之间选择的位置。让它的亡灵部属承担不同工作：一队守目标，一队堵路线，一队从远处威胁后排。不要把所有亡灵堆进地图同一块区域。指挥官应该迫使队伍先决定救哪一个问题。</p>

<h2>第一回合给出能回应的威胁</h2>
<h3>第一回合：交战线碰上前先拆开队伍</h3>
<p>当几名角色站在同一片暴露区域，且不会炸到死亡骑士自己部队时，再用 Hellfire Orb。冲击位置一回合移动距离内要有掩体。目的不是开场就让一名玩家失去游戏，而是让下一次选择变得更尖锐。</p>

<h3>第二回合：让亡灵战线真正有分量</h3>
<p>通过把受 Marshal Undead 影响的部属放在职责清晰的位置，让这个特性真正有分量。掩体后的骷髅弓手、堵住门口的重型亡灵，以及侧路上的机动威胁，会向队伍提出不同问题。把获得光环效果的亡灵写在先攻记录上，回合拥挤时才不会漏掉这个特性。</p>

<h3>一名玩家行动后：把传奇压力花在决定上</h3>
<p>2025 死亡骑士是传奇生物。不要习惯性地把每次传奇选项都砸向同一个目标。用它惩罚放弃目标的角色，迫使角色在移动和保护之间选择，或让受伤的盟友明白看似安全的格子不是永久避难所。始终留一个答案给队伍。高难遭遇也该让玩家有机会重新接回战斗。</p>

<h2>按职责选部属，不要只数骷髅</h2>
<p>2025《怪物图鉴》里的 Death Knight Aspirant 是单独的 CR 11 生物。让它带领一次较早的堡垒突袭、追击场景，或规模较小的亡灵巡逻。这样在 CR 17 的死亡骑士出现前，战役已经有一套可识别的军事风格。</p>
<p>运行完整死亡骑士时，给它配上独自做不到的部属。用远程亡灵争夺掩体，用耐打的亡灵守住门口，用快速坐骑或侦察兵威胁逃生路线。不要因为名字相近就加一个 Aspirant。两名指挥官经常会重复同一类回合，还会挤掉这场遭遇真正的核心选择。</p>

<h2>按队伍面对的任务选遭遇</h2>
<h3>外门警报</h3>
<p>完整 CR 17 指挥官在战役里来得太早时，先用 Death Knight Aspirant。给队伍一扇必须赶到的门、一个能被熄灭的警报，再给亡灵两项职责：入口处顶住的硬线，以及从城墙或窗户施压的远程火力。Aspirant 的目标是拖到警报响起，随后撤走，而不是战到毁灭。这个场景能让低阶队伍提前看见堡垒深处在等着什么，又不用要求他们击败最终指挥官。</p>

<h3>圣物库固守</h3>
<p>当队伍的任务是在有多条路线的房间里夺走或保护一件物品时，使用完整死亡骑士。把圣物放在所有人都能看见的位置，接近路线两侧都留出掩体，让一组亡灵守物品，另一组威胁后排。死亡骑士随后可以在拦截携带者、守住圣物，或把队伍赶出掩体之间选择。圣物离开房间、结界失效，或指挥官拿到它想要的东西时，遭遇就可以结束；不必让最后一点生命值决定每一个结果。</p>

<h3>最后的行军</h3>
<p>需要移动中的终局战时，使用完整死亡骑士：过桥、送葬队伍，或向城门推进的亡灵军。让压力点在每回合结束时移动，例如马车进入桥中央，或俘虏被带向传送门。让亡灵战线一项职责拖住追击，另一项职责保护移动目标。队伍必须选择追上指挥官、切断护卫，还是花一回合替平民争取安全。这种选择能让大地图有明确中心，又不用塞进一长串怪物。</p>

<h2>让盔甲先说出它的故事</h2>
<p>给盔甲一个玩家看得见的破碎承诺。丧礼缎带仍系在护颈甲下，盾牌上刻着它没能救下的小镇徽记，或者一枚印戒熔在永远打不开的拳套上。第一次描述时就说出这个细节，再让它在目标处或死亡骑士的要求里出现一次。</p>
<p>要求越简单越好。死亡骑士要取回遗物、打开城门、带走证人，或完成誓言。清楚的要求能让玩家知道谈判、投降或撤退要付出什么，也能让你有理由让亡灵部队重新站位，而不是战到最后一具骨头倒下。</p>

<h2>2014 桌上哪些地方不同</h2>
<p>只有本桌明确使用该数据块时，才运行 2014 死亡骑士。使用新版规则书时，2025《怪物图鉴》会替换 2014 怪物数据块。2025 条目给死亡骑士加入传奇生物支持，并新增 Death Knight Aspirant；不要把这两项悄悄借进 2014 遭遇。</p>
<p>不管哪一版，都保留同一套场景结构：目标、掩体、职责分开的亡灵战线，以及一个可以谈判的理由。开跑前再对照印刷版数据块和当前勘误。2025 勘误把死亡骑士法术施放次数改为“2/Day Each”，准备法术时以修正后的文字为准。</p>

<h2>让指挥官在 VTT 地图上一眼可认</h2>
<p>缩到地图尺寸后，死亡骑士需要一个不会认错的轮廓：黑色板甲头盔、长剑或盾牌的边缘，再加一处收敛的死灵光。指挥官用偏冷的边框，普通亡灵用更朴素的边框。不要给每个部属同样亮的绿色光，整张地图会变成一排分不清的灯。</p>
<p>打开 <a href="${ZH_EDITOR_PATH}">Token Maker 编辑器</a>，从膝盖以上裁切指挥官，把武器留在画框内，让面甲还能看清楚。导出给 Roll20、Foundry VTT 或 Owlbear 用的透明 PNG。只有故事真的改变了指挥官的外观时，才做第二个 Token，例如队伍发现盔甲主人身份后头盔被击碎。</p>

<h2>带着这三行遭遇笔记开跑</h2>
<ol>
  <li><strong>目标：</strong>死亡骑士在杀人前想完成什么。</li>
  <li><strong>压力点：</strong>队伍不能不管的格子、门、人或仪式。</li>
  <li><strong>亡灵职责：</strong>谁守、谁堵、谁从远处施压。</li>
</ol>

<p>规则核对时，以本桌持有的 2025《怪物图鉴》数据块为准，并在开跑前应用当前勘误。2014 桌上请单独使用旧版死亡骑士数据块，不要直接搬入 Aspirant 或传奇动作。</p>

<p>想准备其他亡灵遭遇，可以看 <a href="${ZH_DND_GHOST_PATH}">DND 鬼魂指南</a>，获得另一种闹鬼威胁；也可以看 <a href="${ZH_DND_NECROMANCER_SPELLS_PATH}">死灵法师法术</a>，处理玩家一侧的亡灵魔法。</p>

<h2>规则来源</h2>
<ul>
  <li><a href="${DND_DEATH_KNIGHT_2025_SOURCE_URL}" rel="noreferrer noopener">D&amp;D Beyond：2025《怪物图鉴》更新说明</a></li>
  <li><a href="${DND_DEATH_KNIGHT_2025_ERRATA_URL}" rel="noreferrer noopener">D&amp;D Beyond：2025《怪物图鉴》勘误</a></li>
  <li><a href="${DND_DEATH_KNIGHT_2025_STAT_BLOCK_URL}" rel="noreferrer noopener">Roll20 Compendium：Death Knight（2025）</a></li>
  <li><a href="${DND_DEATH_KNIGHT_ASPIRANT_2025_STAT_BLOCK_URL}" rel="noreferrer noopener">Roll20 Compendium：Death Knight Aspirant（2025）</a></li>
  <li><a href="${DND_DEATH_KNIGHT_2014_SOURCE_URL}" rel="noreferrer noopener">D&amp;D Beyond：2014《怪物图鉴》</a></li>
</ul>
`;
