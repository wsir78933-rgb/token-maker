import {
  DND_GHOST_2014_RULES_URL,
  DND_GHOST_2024_RULES_URL,
  DND_GHOST_MANOR_IMAGE_PATH,
  DND_GHOST_VIDEO_PLACEHOLDER_PATH,
  DND_GHOST_VIDEO_URL,
  EN_DICE_ROLLER_PATH,
  EN_DND_DEMONS_PATH,
  EN_DND_NECROMANCER_SPELLS_PATH,
  EN_EDITOR_PATH,
  EN_SQUARE_TOKEN_MAKER_PATH,
  GHOST_WIKIPEDIA_URL,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_DEMONS_PATH,
  ZH_DND_NECROMANCER_SPELLS_PATH,
  ZH_EDITOR_PATH,
  ZH_SQUARE_TOKEN_MAKER_PATH,
  liteVideoEmbed,
} from './shared';

export const dndGhostArticleHtml = String.raw`
<p><strong>dnd ghost</strong> is an undead monster built for fear, possession, unfinished business, and movement through the Ethereal Plane. This is an encyclopedia-style guide: you get the fast stat-and-table-use answer first, then the encounter advice that keeps a ghost from becoming just another low-AC hit point bag.</p>

<table>
  <thead>
    <tr>
      <th>dnd ghost question</th>
      <th>Fast answer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Creature type</strong></td>
      <td>Undead spirit, usually tied to trauma, duty, revenge, or a place it cannot leave.</td>
    </tr>
    <tr>
      <td><strong>Classic threat level</strong></td>
      <td>A serious low-to-mid-level threat because possession and fear can flip a scene quickly.</td>
    </tr>
    <tr>
      <td><strong>Signature tools</strong></td>
      <td>Incorporeal movement, Etherealness, Horrifying Visage, Withering Touch, and Possession.</td>
    </tr>
    <tr>
      <td><strong>Best search-intent answer</strong></td>
      <td>Use it as a haunted-location problem with a fight attached, not as a random undead brawler.</td>
    </tr>
    <tr>
      <td><strong>Best VTT prep</strong></td>
      <td>Make one clear ghost token, one possessed ally marker, and one map clue that explains why the ghost is still here.</td>
    </tr>
  </tbody>
</table>

<p>My table rule of thumb: if the party can solve the ghost only by reducing hit points, I probably underused the monster. A good <strong>dnd ghost</strong> should make players ask, "What happened here, and what happens if we kill the wrong body?"</p>

<p>If you are building this for Roll20, Foundry VTT, or Owlbear Rodeo, start by making a readable spirit portrait in the <a href="${EN_EDITOR_PATH}">VTT token maker</a>. For grid-first maps, the <a href="${EN_SQUARE_TOKEN_MAKER_PATH}">square token maker</a> is the cleaner export path.</p>

<h2 id="what-is-a-dnd-ghost">What Is a dnd ghost?</h2>
<p><strong>A dnd ghost is an undead spirit that usually exists because something in life was left unresolved.</strong> In play, that means the monster works best when its mechanics and its story point at the same wound.</p>

<p>The official rules are the right place to confirm the exact stat block for your table. I use the <a href="${DND_GHOST_2014_RULES_URL}" rel="noreferrer noopener">2014 Basic Rules ghost stat block</a> when running classic fifth-edition games, and I check the <a href="${DND_GHOST_2024_RULES_URL}" rel="noreferrer noopener">2024 Free Rules creature stat blocks</a> before mixing newer rules into a session. For the broader folklore idea behind restless spirits, the <a href="${GHOST_WIKIPEDIA_URL}" rel="noreferrer noopener">ghost overview on Wikipedia</a> is useful background.</p>

<p>The practical difference from a skeleton, zombie, or demon is simple: a ghost is personal. It remembers. It haunts a room because the room matters. It tries to use a living body because a body is the thing it lost.</p>

<h2 id="quick-stats">dnd ghost Quick Stats and Table Role</h2>
<p><strong>The classic dnd ghost is a fragile-looking undead that becomes dangerous through mobility, fear, resistance, and Possession.</strong> Do not let the low physical presentation fool the table.</p>

<table>
  <thead>
    <tr>
      <th>Ghost feature</th>
      <th>What it means in play</th>
      <th>DM mistake to avoid</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Incorporeal movement</strong></td>
      <td>The ghost can pass through walls, floors, doors, and battlefield cover.</td>
      <td>Running it in an empty square room where movement does not matter.</td>
    </tr>
    <tr>
      <td><strong>Etherealness</strong></td>
      <td>The ghost can appear, disappear, scout, retreat, or reset tension.</td>
      <td>Using it only after the ghost is nearly dead.</td>
    </tr>
    <tr>
      <td><strong>Horrifying Visage</strong></td>
      <td>Fear changes target priority and can split a confident party.</td>
      <td>Forgetting that frightened players need clear tactical choices.</td>
    </tr>
    <tr>
      <td><strong>Possession</strong></td>
      <td>The ghost turns one body into the encounter's hardest social and tactical problem.</td>
      <td>Treating the possessed character like a normal enemy mini with no table tension.</td>
    </tr>
    <tr>
      <td><strong>Withering Touch</strong></td>
      <td>The ghost can still hurt a target when the story trick is not enough.</td>
      <td>Letting the whole fight become repeated touch attacks.</td>
    </tr>
  </tbody>
</table>

<p>When I prep a ghost, I write the table role first: <strong>ambusher, witness, possessor, guardian, or unfinished-business quest hook</strong>. The stat block is easier to run once that job is clear.</p>

<figure class="inline-figure inline-figure--four-three-crop">
  <img
    class="inline-figure__image inline-figure__image--four-three"
    src="${DND_GHOST_MANOR_IMAGE_PATH}"
    alt="dnd ghost encounter map showing a spectral undead spirit moving through haunted manor walls toward adventurer miniatures"
    width="1448"
    height="1086"
    loading="lazy"
    decoding="async"
  />
  <figcaption>A ghost encounter needs walls, clues, and a reason to move. Without those, the monster loses the thing that makes it different.</figcaption>
</figure>

<h2 id="possession">How Does dnd ghost Possession Work?</h2>
<p><strong>dnd ghost Possession lets the ghost take control of a humanoid target after a failed saving throw, turning an ally into the encounter's central problem.</strong> Exact limits depend on the rules version you are using, so check the stat block before the session.</p>

<p>At the table, the hard part is not reading the ability. The hard part is running it without making the player feel like they stopped playing.</p>

<ul>
  <li><strong>Tell the player what their character feels.</strong> Cold hands, borrowed memories, a voice behind their teeth. Give them something to perform.</li>
  <li><strong>Keep the board state visible.</strong> Mark the possessed token clearly so nobody forgets why the party is hesitating.</li>
  <li><strong>Do not hide the exit condition forever.</strong> The players should learn whether turning undead, forcing the ghost out, knocking the host down, or solving the haunting matters at your table.</li>
  <li><strong>Avoid cheap gotchas.</strong> Possession is already strong. It does not need hidden rule-lawyer traps to feel dangerous.</li>
  <li><strong>Use the possessed body to reveal motive.</strong> A ghost that speaks through the paladin is more memorable than one that only swings a sword.</li>
</ul>

<p>In my games, I like possession most when it creates a bad choice instead of a hard stop: protect the host, chase the ghost, finish the ritual, or destroy the keepsake binding the spirit to the room.</p>

<h2 id="haunting-design">How Should You Run a dnd ghost Encounter?</h2>
<p><strong>Run a dnd ghost encounter as a haunting with combat pressure, not as a stand-alone monster fight.</strong> The room should tell the players why this spirit exists before initiative solves anything.</p>

<p>A simple ghost encounter template:</p>

<ol>
  <li><strong>Before combat:</strong> show one impossible detail, such as wet footprints in a dry hall or dice rolling by themselves.</li>
  <li><strong>First reveal:</strong> let the ghost appear where a normal creature could not stand.</li>
  <li><strong>First pressure:</strong> use fear, movement through walls, or a short possession attempt to change the party's formation.</li>
  <li><strong>Mid-fight clue:</strong> expose the object, body, lie, or room that explains the haunting.</li>
  <li><strong>Resolution:</strong> allow combat, negotiation, ritual repair, or evidence-based roleplay to matter.</li>
</ol>

<p>The video linked at the bottom leans into a "dice ghost" idea, and that is the part I would steal for prep: make the haunting show up in table behavior before the monster fully explains itself. A die spins when nobody touched it. A token moves one square back. A player hears a false count of damage. Small physical tells build tension faster than a paragraph of lore.</p>

<h2 id="ghost-vs-other-undead">dnd ghost vs Specter, Wraith, and Banshee</h2>
<p><strong>A dnd ghost is usually the best pick when you want possession and unfinished business; use a specter, wraith, or banshee when you need a narrower combat identity.</strong></p>

<table>
  <thead>
    <tr>
      <th>Monster</th>
      <th>Best table identity</th>
      <th>Use it when...</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Ghost</strong></td>
      <td>Haunting, memory, possession, unresolved story</td>
      <td>The location has a secret or the party needs to decide what justice means.</td>
    </tr>
    <tr>
      <td><strong>Specter</strong></td>
      <td>Simpler incorporeal undead pressure</td>
      <td>You need a lighter spirit threat without a full social mystery.</td>
    </tr>
    <tr>
      <td><strong>Wraith</strong></td>
      <td>Predatory undead commander</td>
      <td>You want a darker, more aggressive undead villain with minion energy.</td>
    </tr>
    <tr>
      <td><strong>Banshee</strong></td>
      <td>One terrifying scream and tragic presence</td>
      <td>You want a set-piece scare around a deadly wail, grief, or cursed beauty.</td>
    </tr>
  </tbody>
</table>

<p>If your ghost plot is drifting into necromancer territory, pair this guide with the <a href="${EN_DND_NECROMANCER_SPELLS_PATH}">DND necromancer spells guide</a>. If the haunting is actually a fiendish corruption problem, the <a href="${EN_DND_DEMONS_PATH}">dnd demons guide</a> is the better reference.</p>

<h2 id="vtt-token">How to Make a dnd ghost Token Readable on VTT Maps</h2>
<p><strong>A dnd ghost token needs a bright silhouette, strong rim light, and a clear circular or square frame because transparent spirits disappear on dark dungeon maps.</strong></p>

<p>The common mistake is making the ghost too wispy. It looks great in a full-size illustration and then becomes a blue smudge at 70 px on a battle map.</p>

<ul>
  <li><strong>Use a pale blue or white edge glow</strong> around the head, hands, and shoulders.</li>
  <li><strong>Keep the face shape readable</strong> even if the face is shadowed or blank.</li>
  <li><strong>Put the hands inside the crop</strong> because ghost hands sell threat better than mist alone.</li>
  <li><strong>Make a second possessed marker</strong> for the ally the ghost controls.</li>
  <li><strong>Export both round and square versions</strong> if your group swaps between theater-of-the-mind scenes and grid combat.</li>
</ul>

<p>You can make the portrait pass in the <a href="${EN_EDITOR_PATH}">online token maker</a>, then use the <a href="${EN_SQUARE_TOKEN_MAKER_PATH}">square token maker</a> when the ghost needs a clean grid token. For saves, damage rolls, and possession tests, the <a href="${EN_DICE_ROLLER_PATH}">D&amp;D dice roller</a> is the fastest way to sanity-check the encounter before game night.</p>

<h2 id="faq">FAQ About dnd ghost</h2>
<h3>Is a dnd ghost undead?</h3>
<p><strong>Yes, a dnd ghost is undead.</strong> That matters for features, spells, and table rulings that care about creature type.</p>

<h3>Can a dnd ghost move through walls?</h3>
<p><strong>Yes, a dnd ghost is known for moving through objects and barriers, depending on the exact stat block being used.</strong> Build the encounter map so that movement through walls actually changes player decisions.</p>

<h3>Can a dnd ghost possess a player character?</h3>
<p><strong>Yes, the classic dnd ghost can possess a humanoid after a failed save.</strong> Before using it, decide how you will keep the affected player involved and how the party can respond.</p>

<h3>What level party can fight a dnd ghost?</h3>
<p><strong>A dnd ghost is most comfortable as a serious low-to-mid-level threat, but party level is not the only factor.</strong> Magic weapons, saving throw bonuses, turn undead, map layout, and possession rulings can swing the difficulty hard.</p>

<h3>How do I make a ghost scary without unfairly killing players?</h3>
<p><strong>Make the ghost scary through clues, possession pressure, movement, and consequences before relying on damage.</strong> Give warning signs and response options so fear comes from choices, not surprise punishment.</p>

<h2 id="video">Watch the dnd ghost Video</h2>
<p>The companion video is about dice ghosts and table-haunting energy. I would treat it as inspiration for the first two minutes of a ghost scene: strange dice behavior, unreliable signals, and a spirit that feels present before the stat block enters initiative.</p>

${liteVideoEmbed('XXy2awzR-mM', 'dnd ghost companion video', {
  src: DND_GHOST_VIDEO_PLACEHOLDER_PATH,
  alt: 'Clickable webp video cover for a dnd ghost guide showing a spectral ghost rising from a VTT token frame on a haunted tabletop map',
})}

<p>Video source: <a href="${DND_GHOST_VIDEO_URL}" rel="noreferrer noopener">Everybody's Lying about (DICE GHOSTS)</a>.</p>
`;

export const dndGhostArticleHtmlZh = String.raw`
<p><strong>dnd ghost</strong> 是 D&amp;D 里最适合鬼屋、旧宅、墓园和诅咒剧情的 undead 怪物。它的重点不是站在原地和玩家对砍，而是穿墙、恐惧、附身，以及那个“为什么它还不肯离开”的谜题。</p>

<table>
  <thead>
    <tr>
      <th>dnd ghost 重点</th>
      <th>快速答案</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>生物定位</strong></td>
      <td>亡灵灵体，通常被创伤、职责、复仇，或某个无法离开的地点束缚。</td>
    </tr>
    <tr>
      <td><strong>经典威胁等级</strong></td>
      <td>低到中等级队伍都要认真对待；恐惧和附身会快速改变战斗节奏。</td>
    </tr>
    <tr>
      <td><strong>核心能力</strong></td>
      <td>穿墙移动、进入灵界、恐惧外貌、凋零触碰和附身。</td>
    </tr>
    <tr>
      <td><strong>最好用法</strong></td>
      <td>把它当成一场有线索的闹鬼事件，而不是随机出现的亡灵打手。</td>
    </tr>
    <tr>
      <td><strong>地图准备</strong></td>
      <td>准备一个清楚的幽灵 Token、一个被附身标记，以及一条解释它为何徘徊不去的线索。</td>
    </tr>
  </tbody>
</table>

<p>一只好用的 <strong>dnd ghost</strong> 会让玩家先问：“这里到底发生过什么？”然后才考虑怎么打。它应该把房间、遗物、尸体、谎言和活人身体都变成选择题。</p>

<p>如果你要在 Roll20、Foundry VTT 或 Owlbear Rodeo 里跑这个遭遇，可以先用 <a href="${ZH_EDITOR_PATH}">Token Maker</a> 做一个轮廓清楚的幽灵头像。需要 1:1 网格头像时，用 <a href="${ZH_SQUARE_TOKEN_MAKER_PATH}">方形 Token 制作器</a> 更稳。</p>

<h2 id="what-is-a-dnd-ghost">dnd ghost 是什么？</h2>
<p><strong>dnd ghost 是一种亡灵灵体，通常因为生前某件事没有被解决而继续存在。</strong>所以它最好用在机制和故事指向同一个伤口的场景里。</p>

<p>具体数据要以你桌上使用的规则版本为准。经典 5e 可以看 <a href="${DND_GHOST_2014_RULES_URL}" rel="noreferrer noopener">2014 Basic Rules 的 ghost 数据</a>，混用新规则前再核对 <a href="${DND_GHOST_2024_RULES_URL}" rel="noreferrer noopener">2024 Free Rules 的生物数据</a>。如果你想查“幽灵”这个民俗概念的背景，<a href="${GHOST_WIKIPEDIA_URL}" rel="noreferrer noopener">Wikipedia 的 ghost 条目</a>可以作为补充材料。</p>

<p>它和 skeleton、zombie、demon 的区别很明显：ghost 更私人。它记得生前的事，也会被某个房间、某件遗物或某个谎言困住。它想借活人的身体行动，是因为身体正是它失去的东西。</p>

<h2 id="quick-stats">dnd ghost 速查数据与桌面定位</h2>
<p><strong>经典 dnd ghost 看起来脆，但真正危险来自移动、恐惧、抗性和附身。</strong>不要把它跑成普通站桩战。</p>

<table>
  <thead>
    <tr>
      <th>Ghost 特征</th>
      <th>桌面意义</th>
      <th>DM 要避免的错误</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Incorporeal movement</strong></td>
      <td>Ghost 可以穿过墙、地板、门和战场掩体。</td>
      <td>把它放在空旷方形房间里，让移动能力没有意义。</td>
    </tr>
    <tr>
      <td><strong>Etherealness</strong></td>
      <td>Ghost 可以出现、消失、侦查、撤退，或者重置紧张感。</td>
      <td>只在它快死时才想起来使用。</td>
    </tr>
    <tr>
      <td><strong>Horrifying Visage</strong></td>
      <td>恐惧会改变目标优先级，也会拆散本来很自信的队形。</td>
      <td>只让玩家“很难受”，却不给清楚的应对选择。</td>
    </tr>
    <tr>
      <td><strong>Possession</strong></td>
      <td>Ghost 把一个活人身体变成社交和战术上的核心难题。</td>
      <td>把被附身角色当成普通敌方小人来处理，浪费紧张感。</td>
    </tr>
    <tr>
      <td><strong>Withering Touch</strong></td>
      <td>当故事压力不够时，它依然可以直接造成伤害。</td>
      <td>让整场战斗只剩重复摸人。</td>
    </tr>
  </tbody>
</table>

<p>准备 ghost 时，先决定它在这一幕里的身份：<strong>伏击者、见证者、附身者、守护者，还是未完成执念的任务钩子</strong>。身份清楚后，规则数据会更好用。</p>

<figure class="inline-figure inline-figure--four-three-crop">
  <img
    class="inline-figure__image inline-figure__image--four-three"
    src="${DND_GHOST_MANOR_IMAGE_PATH}"
    alt="dnd ghost 遭遇地图，幽灵 undead spirit 穿过 haunted manor 墙壁靠近冒险者模型"
    width="1448"
    height="1086"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Ghost 遭遇需要墙、线索和移动理由。没有这些，它就很容易变成普通亡灵战斗。</figcaption>
</figure>

<h2 id="possession">dnd ghost 的 Possession 怎么跑？</h2>
<p><strong>dnd ghost 的 Possession 会在目标豁免失败后控制一个类人生物，让队友变成遭遇的核心问题。</strong>具体限制取决于你使用的规则版本，所以开团前要核对规则数据。</p>

<p>桌面上真正难的不是读能力文本，而是让被影响的玩家仍然觉得自己在参与游戏。</p>

<ul>
  <li><strong>告诉玩家角色感受到了什么。</strong>冰冷的手、借来的记忆、喉咙里不是自己的声音。给他一点可以表演的东西。</li>
  <li><strong>让棋盘状态清楚。</strong>被附身的 Token 必须有明显标记，避免队友忘记为什么不敢直接集火。</li>
  <li><strong>不要永远藏解除条件。</strong>玩家应该逐渐知道 Turn Undead、逼出 ghost、击倒宿主，或解决执念哪个方向有效。</li>
  <li><strong>不要用廉价陷阱加码。</strong>Possession 本来就强，不需要额外规则阴招。</li>
  <li><strong>让被附身身体透露动机。</strong>Ghost 借 paladin 的嘴说话，比只挥剑更有记忆点。</li>
</ul>

<p>我最喜欢的 possession 用法，是制造坏选择而不是停摆：保护宿主、追 ghost、完成仪式，还是毁掉把它绑在房间里的遗物。</p>

<h2 id="haunting-design">怎样设计 dnd ghost 遭遇？</h2>
<p><strong>把 dnd ghost 遭遇跑成带战斗压力的闹鬼事件，而不是孤立怪物战。</strong>在进入先攻之前，房间本身就应该让玩家看出这个灵魂为什么还在这里。</p>

<p>一个简单模板：</p>

<ol>
  <li><strong>战斗前：</strong>给一个不可能的细节，比如干燥走廊里的湿脚印，或者没人碰却自己滚动的骰子。</li>
  <li><strong>第一次显形：</strong>让 ghost 出现在正常生物不可能站立的位置。</li>
  <li><strong>第一次施压：</strong>用恐惧、穿墙移动，或短促附身尝试打乱队形。</li>
  <li><strong>战斗中线索：</strong>暴露解释闹鬼原因的物件、尸体、谎言或房间。</li>
  <li><strong>收束：</strong>让战斗、谈判、仪式修复或基于证据的角色扮演都有机会影响结局。</li>
</ol>

<p>底部视频讲的是 “dice ghost” 那种桌面闹鬼感。这个思路很适合 ghost 开场：骰子自己转动，Token 被挪回一格，玩家听到错误的伤害数字。小信号比一大段背景设定更快建立紧张感。</p>

<h2 id="ghost-vs-other-undead">dnd ghost 和 Specter、Wraith、Banshee 有什么区别？</h2>
<p><strong>需要附身和未完成执念时，dnd ghost 通常是最佳选择；如果你只需要更窄的战斗功能，可以换 specter、wraith 或 banshee。</strong></p>

<table>
  <thead>
    <tr>
      <th>怪物</th>
      <th>最适合的桌面身份</th>
      <th>什么时候用</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Ghost</strong></td>
      <td>Haunting、记忆、附身、未解决故事</td>
      <td>地点藏着秘密，或者队伍需要判断什么才算真正的正义。</td>
    </tr>
    <tr>
      <td><strong>Specter</strong></td>
      <td>更简单的 incorporeal undead 压力</td>
      <td>你需要较轻量的灵体威胁，不想展开完整社交谜团。</td>
    </tr>
    <tr>
      <td><strong>Wraith</strong></td>
      <td>掠食型 undead 指挥者</td>
      <td>你想要更黑暗、更主动攻击、更有爪牙感的 undead 反派。</td>
    </tr>
    <tr>
      <td><strong>Banshee</strong></td>
      <td>一次恐怖尖叫和悲剧存在感</td>
      <td>你想围绕致命哀嚎、悲伤或诅咒之美设计关键场景。</td>
    </tr>
  </tbody>
</table>

<p>如果你的 ghost 剧情开始偏向 necromancer，可以配合 <a href="${ZH_DND_NECROMANCER_SPELLS_PATH}">DND necromancer spells 指南</a>。如果这场闹鬼其实来自 fiend 腐化，<a href="${ZH_DND_DEMONS_PATH}">dnd demons 指南</a>会更贴合。</p>

<h2 id="vtt-token">怎样让 dnd ghost Token 在地图上清楚可读？</h2>
<p><strong>dnd ghost Token 需要明亮轮廓、强边缘光和清楚的圆形或方形边框，因为透明幽灵很容易消失在暗色地牢图上。</strong></p>

<p>最常见错误是把 ghost 做得太虚。大图里很漂亮，缩到战斗地图 70 px 时就只剩一团蓝雾。</p>

<ul>
  <li><strong>给头、手和肩膀加浅蓝或白色边缘光</strong>，让轮廓能读出来。</li>
  <li><strong>保留脸部形状</strong>，哪怕脸是阴影或空白。</li>
  <li><strong>手要放进裁切里</strong>，ghost 的威胁感往往靠手比靠雾更清楚。</li>
  <li><strong>额外做一个被附身标记</strong>，给被控制的队友使用。</li>
  <li><strong>圆形和方形版本都导出</strong>，方便在剧场式场景和网格战斗之间切换。</li>
</ul>

<p>你可以先用 <a href="${ZH_EDITOR_PATH}">Token Maker</a> 做头像，再用 <a href="${ZH_SQUARE_TOKEN_MAKER_PATH}">方形 Token 制作器</a> 导出网格 Token。需要测试豁免、伤害和附身成功率时，<a href="${ZH_DICE_ROLLER_PATH}">D&amp;D 骰子工具</a>最快。</p>

<h2 id="faq">dnd ghost 常见问题</h2>
<h3>dnd ghost 是 undead 吗？</h3>
<p><strong>是，dnd ghost 是 undead。</strong>这会影响所有关心生物类型的特性、法术和桌面裁定。</p>

<h3>dnd ghost 可以穿墙吗？</h3>
<p><strong>可以，dnd ghost 的标志之一就是能穿过物体和障碍，具体按你使用的规则数据执行。</strong>地图设计要让穿墙移动真的改变玩家选择。</p>

<h3>dnd ghost 可以附身玩家角色吗？</h3>
<p><strong>可以，经典 dnd ghost 可以在类人生物豁免失败后进行 Possession。</strong>使用前要决定怎样让被影响玩家仍然参与，以及队伍能用什么方式应对。</p>

<h3>几级队伍适合打 dnd ghost？</h3>
<p><strong>dnd ghost 通常适合作为低到中等级队伍的认真威胁，但等级不是唯一因素。</strong>魔法武器、豁免加值、Turn Undead、地图布局和附身裁定都会大幅影响难度。</p>

<h3>怎样让 ghost 可怕但不显得强行？</h3>
<p><strong>用线索、附身压力、移动和后果制造恐惧，不要只靠伤害。</strong>给玩家预警和反应选项，恐怖感才来自选择，而不是突然惩罚。</p>

<h2 id="video">观看 dnd ghost 视频</h2>
<p>这支配套视频讲的是 dice ghosts 和桌面闹鬼感。它很适合作为 ghost 场景开场灵感：异常骰子、错误信号，以及怪物正式现身前就已经存在的灵体压力。</p>

${liteVideoEmbed('XXy2awzR-mM', 'dnd ghost companion video', {
  src: DND_GHOST_VIDEO_PLACEHOLDER_PATH,
  alt: 'dnd ghost 指南的可点击 webp 视频封面，幽灵从 VTT Token 圆框里升起，背景是闹鬼桌面地图',
})}

<p>视频来源：<a href="${DND_GHOST_VIDEO_URL}" rel="noreferrer noopener">Everybody's Lying about (DICE GHOSTS)</a>。</p>
`;
