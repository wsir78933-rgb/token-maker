import {
  DND_FLUMPH_2024_ROLL20_URL,
  DND_FLUMPH_AIDEDD_URL,
  DND_FLUMPH_DNDBEYOND_URL,
  DND_FLUMPH_VTT_IMAGE_PATH,
  EN_DND_FIND_FAMILIAR_PATH,
  EN_DND_GHOST_PATH,
  EN_EDITOR_PATH,
  ZH_DND_FIND_FAMILIAR_PATH,
  ZH_DND_GHOST_PATH,
  ZH_EDITOR_PATH,
} from './shared';

export const dndFlumphArticleHtml = String.raw`
<p><strong>dnd flumph</strong> works best when the party needs a witness, not another sack of hit points. Put it in the scene when somebody needs to catch telepathic traffic, notice a hidden psionic threat, or decide whether to trust a frightened creature that knows more than it can safely say out loud.</p>

<p>A flumph does not need a big damage turn to matter. Give it one clear job, one visible reason to trust or fear it, and one token state the whole table can read at map size. Then let the players decide whether to protect it, follow it, or ignore the warning.</p>

<h2>Let the flumph solve a problem the party cannot hear</h2>
<p>The current 2024 flumph writeup gives you the line that matters most at the table: <strong>Advanced Telepathy</strong> lets the flumph perceive telepathic communication within 60 feet. That turns the creature into a warning bell for mind flayers, aboleths, hidden controllers, psychic cultists, and any scene where the real threat speaks in a channel the party cannot hear.</p>

<p>Use that before initiative, not after. The flumph stiffens above one tunnel. It refuses to cross a particular threshold. It circles the party member whose thoughts were just brushed by something hostile. Those beats tell the players that the danger is intelligent and already active.</p>

<p>You do not need to turn the flumph into a party mascot. One useful warning is enough. If the players choose to ignore it, the next room should prove the creature was right.</p>

<h2>Choose the flumph's job before initiative starts</h2>
<table>
  <thead>
    <tr>
      <th>Flumph job</th>
      <th>Use it when the scene needs...</th>
      <th>What the party can do with it</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Warning scout</strong></td>
      <td>A clear sign that telepathic enemies are nearby.</td>
      <td>Track where it hesitates, backs away, or turns to face empty stone.</td>
    </tr>
    <tr>
      <td><strong>Frightened witness</strong></td>
      <td>A survivor that knows what happened but cannot stand still long enough for a speech.</td>
      <td>Offer safety, quiet, and one direct question instead of forcing a lore dump.</td>
    </tr>
    <tr>
      <td><strong>Reluctant guide</strong></td>
      <td>A path through the Underdark that should feel earned, not handed over.</td>
      <td>Follow its route, then decide which warning to respect first.</td>
    </tr>
    <tr>
      <td><strong>Moral test</strong></td>
      <td>A fast read on whether the party protects vulnerable creatures or treats every aberration as target practice.</td>
      <td>Choose whether to shield it, trade with it, or burn the bridge on first contact.</td>
    </tr>
  </tbody>
</table>

<p>Pick one job and stop there. A warning scout that is also a riddle machine, a combat pet, and a quest giver usually turns into noise. A flumph is stronger when its role is narrow and the party has to do the rest.</p>

<h2>Use the flumph as a witness, not a punchline</h2>
<p>A benevolent aberration is already strange enough. You do not need to make it silly to make it memorable. Give the flumph one thing it heard, one thing it fears, and one thing it wants from the party.</p>

<ul>
  <li><strong>What it heard:</strong> a telepathic command, a prisoner calling for help, or a mind flayer planning where to strike.</li>
  <li><strong>What it fears:</strong> crossing open stone, getting flipped onto its back, or being noticed by the thing it has been shadowing.</li>
  <li><strong>What it wants:</strong> escort, quiet, a safe passage, or help destroying the object that keeps drawing psychic predators.</li>
</ul>

<p>That is enough to run a conversation. The players do not need a lecture. They need one answer that changes their next choice.</p>

<p>If you want the same "small creature, big table value" pattern on the player side, the <a href="${EN_DND_FIND_FAMILIAR_PATH}">Find Familiar guide</a> covers separate scout tokens and support positioning. If you want a witness that haunts a room instead of guiding the party through it, the <a href="${EN_DND_GHOST_PATH}">DnD Ghost guide</a> gives you the darker version.</p>

<h2>If combat starts, keep the flumph fragile</h2>
<p>Do not solve the scene by making the flumph the toughest thing on the map. Its job is to survive long enough to point at the real problem or to force the party to choose between safety and rescue.</p>

<p>Give the flumph cover, a retreat path, and one consequence if the players abandon it. If a telepathic creature corners it, the cost might be losing the clue. If cultists capture it, the cost might be walking into the next chamber blind.</p>

<p>The current 2024 stat block also carries a <strong>Prone Deficiency</strong> line. If the flumph receives the Prone condition, an odd die result leaves it incapacitated until it recovers at the end of one of its turns. Use that trait as pressure, not comedy. The moment should tell the players this witness is delicate, not disposable.</p>

<h2>Make the flumph readable on a VTT token</h2>
<p>At map size, a flumph disappears fast unless the token keeps one bright edge, one clean silhouette, and one obvious state change. The easiest answer is to crop tighter than you think, then let the rim light and tentacles do the recognition work.</p>

<ul>
  <li><strong>Base token:</strong> pale body, visible eye stalks, dark background, and enough contrast that the creature does not turn into a blur on cave maps.</li>
  <li><strong>Ally state:</strong> a calm warm ring or soft green cue that says "follow this one."</li>
  <li><strong>Warning state:</strong> a red or amber pulse when the flumph catches hostile telepathy.</li>
  <li><strong>Panic state:</strong> a tilted or rattled marker when it has been threatened, flipped, or forced to retreat.</li>
</ul>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_FLUMPH_VTT_IMAGE_PATH}"
    alt="dnd flumph VTT scene with a readable flumph token, ally and warning states, and adventurer tokens on an Underdark battle map"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Three readable states are enough: ally, warning, and panic. The players should understand the flumph's condition before anyone asks for a rules recap.</figcaption>
</figure>

<p>Open the <a href="${EN_EDITOR_PATH}">Token Maker editor</a>, crop the flumph so the eye stalks and lower tendrils stay inside frame, then export one calm token and one warning version. If the scene depends on whether the creature is still helping, that second token will save you several rounds of table confusion.</p>

<h2>Three flumph scenes that stay about the party's choice</h2>
<h3>The silent crossing</h3>
<p>The party reaches a stone bridge over a chasm. A flumph waits above the midpoint and refuses to drift farther. If the party presses ahead, they walk into an ambush coordinated by telepathy from the far wall. If they stop and read the creature, they get one round to change formation before the fight begins.</p>

<h3>The tunnel that answers thoughts</h3>
<p>A flumph shadows the group through fungal tunnels but only reacts when one player starts planning out loud in their head. Use it when you want the party to realize their thoughts are being overheard before they ever see the watcher doing it.</p>

<h3>The witness nobody believes</h3>
<p>A terrified flumph keeps circling a prisoner cell, then recoils from the "rescued" NPC the party is about to free. The party now has to choose whether to trust the wounded captive or the floating creature that heard the telepathic orders first.</p>

<h2>DnD flumph FAQ</h2>
<h3>What is a flumph in DnD?</h3>
<p>A flumph is a small aberration usually used as a floating telepathic creature from the Underdark. At the table, it is most useful as a warning sign, witness, or guide rather than a straight damage dealer.</p>

<h3>Are flumphs friendly?</h3>
<p>They are often played as benevolent or at least non-hostile, but friendly does not mean fearless. A flumph that wants help should still behave like a creature that knows something dangerous is nearby.</p>

<h3>Why does Advanced Telepathy matter so much?</h3>
<p>Because it changes what the party can learn before combat starts. A flumph can react to telepathic traffic the players cannot hear, which makes it a clean early-warning creature in psionic scenes.</p>

<h3>Can a flumph carry a whole encounter by itself?</h3>
<p>Usually no. The flumph should sharpen the players' next decision, then hand the spotlight back to the real threat, the room, or the rescue target.</p>

<h3>How should a flumph look on a VTT token?</h3>
<p>Keep the silhouette simple: bright rim light, readable eye stalks, and a clear state ring for ally or warning. If the token only looks good at full illustration size, it is too soft for the map.</p>

<h3>What happens if a flumph gets knocked prone?</h3>
<p>The current 2024 flumph rules include a prone deficiency that can leave the creature incapacitated at the worst moment. Use that as a reason for the party to shield the clue, not as a reason to turn the creature into a joke.</p>

<h2>Reference sources</h2>
<ul>
  <li><a href="${DND_FLUMPH_2024_ROLL20_URL}" rel="noreferrer noopener">Roll20 Compendium: Flumph (2024)</a></li>
  <li><a href="${DND_FLUMPH_AIDEDD_URL}" rel="noreferrer noopener">AideDD: Flumph monster reference</a></li>
  <li><a href="${DND_FLUMPH_DNDBEYOND_URL}" rel="noreferrer noopener">D&amp;D Beyond: Flumph entity page</a></li>
</ul>
`;

export const dndFlumphArticleHtmlZh = String.raw`
<p><strong>dnd flumph</strong> 最适合拿来当见证者，而不是又一个血条包。把它放进场景里，是因为队伍需要截住心灵感应、提前发现灵能威胁，或判断一个吓坏了的小生物到底值不值得相信。</p>

<p>Flumph 不需要靠爆发伤害证明自己。给它一个明确职责、一个让玩家愿意保护或怀疑它的理由，再给它一个在地图上能看懂的状态变化。之后就把决定权交还给玩家：护住它、跟着它，还是无视它的警告。</p>

<h2>先让 flumph 解决队伍听不见的问题</h2>
<p>当前 2024 版 flumph 条目里，真正会改变桌边处理方式的是这句：<strong>Advanced Telepathy</strong> 让 flumph 能感知 60 英尺内的心灵交流。这样一来，它就天然适合拿来预警夺心魔、底栖魔鱼、隐藏操控者、灵能教徒，或任何靠心灵交流配合的敌人。</p>

<p>把这个提示放在先攻前，而不是打起来以后。Flumph 在某条隧道口前停住，不肯往前漂；它忽然转向一面空墙；它围着某名角色转，却不愿靠近前方的门。玩家会立刻明白，前面的危险已经开始思考，而且不是靠嘴说话。</p>

<p>你不需要把 flumph 变成长期吉祥物。一次有用的警告就够了。若玩家选择不理它，下一间房就该让他们知道它没有白害怕。</p>

<h2>先决定 flumph 在这场戏里做什么</h2>
<table>
  <thead>
    <tr>
      <th>Flumph 的职责</th>
      <th>适合拿来解决什么</th>
      <th>队伍能怎么用它</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>预警侦察</strong></td>
      <td>让玩家知道附近已经有心灵交流中的敌人。</td>
      <td>看它在哪停住、后退或突然转向空无一物的石壁。</td>
    </tr>
    <tr>
      <td><strong>受惊见证者</strong></td>
      <td>给场景一个知道真相、却站不住脚的幸存者。</td>
      <td>先提供安全感，再问一个最关键的问题。</td>
    </tr>
    <tr>
      <td><strong>不情愿的向导</strong></td>
      <td>让队伍在幽暗地域里获得一条值得怀疑、也值得跟随的路线。</td>
      <td>先跟着它走，再决定先相信哪一个警告。</td>
    </tr>
    <tr>
      <td><strong>道德试纸</strong></td>
      <td>快速看出队伍会不会把每个异怪都当成立刻该杀的目标。</td>
      <td>决定是保护它、交易，还是第一次见面就把桥烧掉。</td>
    </tr>
  </tbody>
</table>

<p>只选一个职责就好。预警侦察、谜语机、战斗宠物和任务发布者全塞进同一个 flumph，只会让它变吵。职责越窄，玩家的选择反而越清楚。</p>

<h2>把 flumph 当成见证者，不要当成笑话怪</h2>
<p>一个善意异怪本身就已经足够奇怪，不需要额外搞笑。给 flumph 三件事就够了：它听到了什么、它怕什么、它想让队伍帮什么。</p>

<ul>
  <li><strong>它听到了什么：</strong>一次心灵命令、某个囚犯的求救，或夺心魔准备动手的位置。</li>
  <li><strong>它怕什么：</strong>开阔石地、被打翻到背上，或被正在追踪的东西发现。</li>
  <li><strong>它想要什么：</strong>护送、安静、一条安全路线，或帮它毁掉一直吸引灵能掠食者的物件。</li>
</ul>

<p>这样就已经足够跑一场对话。玩家不需要一大段百科，他们只需要一个会改变下一步决定的答案。</p>

<p>如果你想看“体型小、桌面价值大”的玩家侧版本，可以直接接到 <a href="${ZH_DND_FIND_FAMILIAR_PATH}">找寻魔宠（Find Familiar）指南</a> 里那套独立侦察 Token 处理。若你想要的是一个会缠住房间、而不是带路的见证者，<a href="${ZH_DND_GHOST_PATH}">dnd ghost 指南</a> 更合适。</p>

<h2>如果打起来了，就让 flumph 保持脆弱</h2>
<p>不要靠把 flumph 硬改成强怪来解决这场戏。它的作用，是活得够久，能把真正的问题指给队伍看，或者逼玩家在安全和营救之间做选择。</p>

<p>给 flumph 掩体、退路，以及一个“如果没人管它就会失去什么”的后果。若它被灵能生物逼住，后果可能是线索断掉；若它被教徒抓走，后果可能是队伍下一间房直接失明一样撞进去。</p>

<p>当前 2024 stat block 里还有一条 <strong>Prone Deficiency</strong>。Flumph 获得 Prone 后，若掷出奇数，就会带着 Incapacitated 状态白白浪费回合，偏偏通常发生在队伍最需要它时。把这条当成压力，不要当成笑点。它应该让玩家觉得“这条线索很脆”，而不是“这东西很好玩”。</p>

<h2>让 flumph 在 VTT Token 上一眼可认</h2>
<p>Flumph 缩到地图尺寸后非常容易糊掉。最稳的做法是裁得比你以为的更近一些，把发光边缘、眼柄和下垂触须都留在框里，再用状态环来表达它现在是在帮忙、预警，还是已经慌了。</p>

<ul>
  <li><strong>基础 Token：</strong>浅色主体、清楚眼柄、深色背景，别让它在洞窟地图上变成一团白雾。</li>
  <li><strong>盟友状态：</strong>柔和暖色环或浅绿提示，告诉玩家“这只可以跟”。</li>
  <li><strong>预警状态：</strong>红色或琥珀色脉冲，用来表示它刚听到敌对心灵交流。</li>
  <li><strong>惊慌状态：</strong>倾斜、抖动或退缩标记，用来表示它被威胁、被打翻或准备逃走。</li>
</ul>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_FLUMPH_VTT_IMAGE_PATH}"
    alt="dnd flumph VTT 场景图，地图上有可读的 flumph Token、盟友和预警状态，以及幽暗地域里的冒险者 Token"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>三个状态就够了：盟友、预警、惊慌。玩家应该在问规则之前，就先看懂这只 flumph 现在代表什么。</figcaption>
</figure>

<p>打开 <a href="${ZH_EDITOR_PATH}">Token Maker 编辑器</a>，把 flumph 裁到眼柄和下方触须都还清楚的位置，再导出一张平静版和一张预警版。只要场景胜负和“它还在不在帮队伍”有关，这第二张图就能省掉很多桌边解释。</p>

<h2>三个让选择仍然留在玩家手里的 flumph 场景</h2>
<h3>无声的桥</h3>
<p>队伍来到深渊裂谷上的石桥。Flumph 漂在桥中央，却死活不肯往前。若玩家继续冲，就会走进远侧石壁后以心灵感应配合的伏击。若玩家停下来读懂它，他们就能在开打前多争取一回合调整站位。</p>

<h3>会回应想法的隧道</h3>
<p>Flumph 一路在菌洞里跟着队伍，但只有当某个玩家开始在脑子里规划路线时，它才突然反应过度。这个场景最适合告诉玩家：他们的想法正在被什么东西听见，而他们还没见到那个东西。</p>

<h3>没人相信的证人</h3>
<p>一只吓坏了的 flumph 一直绕着囚室打转，却明显在躲开队伍正要放出来的“受害者”。现在玩家必须决定，到底相信这个会飞的小见证者，还是相信那个看起来更像正常受害者的人。</p>

<h2>DND flumph 常见问题</h2>
<h3>DnD 里的 flumph 到底是什么？</h3>
<p>Flumph 是一种小型异怪，常被用成幽暗地域里的漂浮心灵生物。真正上桌时，它最适合承担预警、见证者或向导职责，而不是纯伤害怪。</p>

<h3>Flumph 一般友善吗？</h3>
<p>它们经常会被处理成善意或至少非敌对，但“友善”不代表“勇敢”。一只需要帮助的 flumph 仍然应该像真正知道危险在哪的生物一样行动。</p>

<h3>为什么 Advanced Telepathy 这么重要？</h3>
<p>因为它决定了队伍能不能在开打前读到危险。Flumph 能感知玩家听不见的心灵交流，所以特别适合放在灵能场景里做第一道预警。</p>

<h3>Flumph 能单独撑起一整场遭遇吗？</h3>
<p>通常不行。它应该把玩家的下一步选择磨尖，然后把聚光灯交还给真正的威胁、房间里的秘密，或等待营救的人。</p>

<h3>Flumph 的 VTT Token 应该怎么做？</h3>
<p>把轮廓做清楚就够了：亮边、可读的眼柄，以及盟友或预警状态环。若 Token 只有在大图尺寸下才好看，那它放上地图就太虚了。</p>

<h3>Flumph 被击倒后会怎样？</h3>
<p>当前 2024 flumph 规则里有 prone deficiency，可能会让它在关键回合直接带着 incapacitated 状态失去作用。把这条当成“队伍得保护这条线索”的理由，而不是拿来搞笑。</p>

<h2>参考来源</h2>
<ul>
  <li><a href="${DND_FLUMPH_2024_ROLL20_URL}" rel="noreferrer noopener">Roll20 Compendium：Flumph（2024）</a></li>
  <li><a href="${DND_FLUMPH_AIDEDD_URL}" rel="noreferrer noopener">AideDD：Flumph 怪物参考</a></li>
  <li><a href="${DND_FLUMPH_DNDBEYOND_URL}" rel="noreferrer noopener">D&amp;D Beyond：Flumph 实体页</a></li>
</ul>
`;
