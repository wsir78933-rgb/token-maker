import {
  DND_SPECTATOR_2014_DNDBEYOND_URL,
  DND_SPECTATOR_2024_ROLL20_URL,
  DND_SPECTATOR_BODYGUARD_RULING_URL,
  DND_SPECTATOR_TACTICS_URL,
  EN_DND_COUNTERSPELL_PATH,
  EN_DND_FLUMPH_PATH,
  EN_EDITOR_PATH,
  ZH_DND_COUNTERSPELL_PATH,
  ZH_DND_FLUMPH_PATH,
  ZH_EDITOR_PATH,
} from './shared';

export const spectatorDndArticleHtml = String.raw`
<p><strong>spectator dnd</strong> is strongest when you run it as a contract-bound guardian first and a floating eye turret second. Put one protected thing on the map, give the spectator a clear order, let it warn the party, then start the rays only when someone crosses the line.</p>

<p>A spectator is not a small beholder with a weaker paint job. It has four eyestalks, a central eye, telepathy, hover movement, and a job that can last longer than most kingdoms. Use that job to shape the encounter before initiative starts.</p>

<h2>Start with the thing it guards</h2>
<p>Choose one treasure, doorway, ritual circle, prisoner cell, sealed archive, or forbidden lift. The spectator's orders should be short enough to say aloud at the table: "No creature except Arveth may open the vault." That one sentence tells players what they can test, trick, or violate.</p>

<ul>
  <li><strong>Protected thing:</strong> a chest, portal, shrine, bridge, key, or sealed room.</li>
  <li><strong>Allowed access:</strong> the summoner, one named badge, a spoken phrase, a bloodline, or nobody until a date passes.</li>
  <li><strong>First warning:</strong> a telepathic command that tells the party what action will trigger combat.</li>
  <li><strong>Release condition:</strong> what happens if the treasure is moved, destroyed, claimed by the summoner, or left untouched.</li>
</ul>

<p>Do not make the spectator guard a person unless you have changed the premise. The classic guardian language points it at a location or treasure, not a living bodyguard contract. A moving necklace can be treasure; a wizard who wants a loyal escort has to solve a different problem.</p>

<h2>Choose the rules version before the first ray</h2>
<p>The 2014 and 2024 spectator blocks are close enough to look interchangeable and different enough to cause mistakes. Pick one block before combat, then keep every DC, ray effect, and reaction from that same version.</p>

<table>
  <thead>
    <tr>
      <th>Table question</th>
      <th>2014 Basic Rules / Monster Manual style</th>
      <th>2024 Monster Manual style</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Main role</strong></td>
      <td>CR 3 lesser beholder guardian with eye rays, telepathy, and a strict post.</td>
      <td>CR 3 Medium Aberration (Beholder), still a magical guardian tied to a protected thing.</td>
    </tr>
    <tr>
      <td><strong>Eye rays</strong></td>
      <td>Up to two rays at one or two visible creatures within 90 feet; each ray only once on a turn.</td>
      <td>Two random rays; roll 1d4 and reroll a ray already used that turn.</td>
    </tr>
    <tr>
      <td><strong>Save DC</strong></td>
      <td>DC 13 for Confusion, Paralyzing, Fear, and Wounding rays.</td>
      <td>DC 12, with Confusion and Fear also dealing 2d4 Psychic damage on a failed save.</td>
    </tr>
    <tr>
      <td><strong>Spell Reflection</strong></td>
      <td>Redirects the spell to another visible creature within 30 feet after a successful save or missed spell attack.</td>
      <td>Uses a DC 12 Dexterity save against one visible creature within 120 feet; a failure takes 3d6 Force damage.</td>
    </tr>
  </tbody>
</table>

<p>Write "2014" or "2024" beside the initiative tracker. That small note prevents the most common table error: using the 2024 random-ray instruction with the 2014 DC 13 effects, then adding the wrong Spell Reflection on top.</p>

<h2>Let the warning scene do real work</h2>
<p>A spectator can talk before it attacks. Use that. It can state the order, name the summoner, describe the protected object, and refuse negotiation without sounding like a mindless trap.</p>

<p>Give the party three clean options before initiative:</p>

<ol>
  <li><strong>Obey the order.</strong> Leave, fetch the summoner's mark, find another entrance, or learn why the vault matters.</li>
  <li><strong>Argue the wording.</strong> Ask whether the order protects the room, the item, the seal, or the summoner's definition of theft.</li>
  <li><strong>Break the line.</strong> Step past the declared boundary and accept that the guardian now has a lawful reason to fight.</li>
</ol>

<p>The encounter becomes better when the first roll answers a choice the players understood. A surprise eye ray can feel arbitrary; an eye ray after a clear warning feels earned.</p>

<h2>Run eye rays as a guard pattern</h2>
<p>Eye Rays work best when the room lets sight matter. Keep the spectator high enough to see the guarded object, then add pillars, shelves, curtains, chained relics, or raised walkways that let players break line of sight without leaving the objective.</p>

<ul>
  <li><strong>Confusion Ray</strong> turns the intruder into a risk for nearby allies. Leave enough spacing for the random attack to matter.</li>
  <li><strong>Paralyzing Ray</strong> punishes the character who crosses the threshold first. Put cover close enough that allies can respond.</li>
  <li><strong>Fear Ray</strong> pushes the party away from the guarded thing. Give the room a real retreat path.</li>
  <li><strong>Wounding Ray</strong> is the damage warning. Use it to make repeated brute-force attempts expensive.</li>
</ul>

<p>Do not build the room like a blank arena. A spectator that can hover above an empty square simply rolls rays until someone drops. A room with sight breaks, a visible boundary, and a valuable object asks the party to solve the guardian instead of just trading numbers.</p>

<h2>Make Spell Reflection visible before it hurts someone</h2>
<p>Spell Reflection should change caster behavior, not ambush the table with a hidden paragraph. Before combat, show a scorched statue, a cracked mirror shield, or a dead invader whose own spell mark is burned into the wall. Then, when a spell misses or the spectator succeeds on a save, everyone understands why magic is dangerous here.</p>

<p>Keep the trigger narrow. Weapon attacks do not trigger it. The spectator's own eye rays are not spells. If you are using the 2014 block, the redirected spell follows the 30-foot creature choice in that block. If you are using the 2024 block, use the listed Dexterity save and Force damage response instead.</p>

<p>For spellcaster-heavy parties, this is the whole encounter. The safest move might be a weapon attack, a shove, a blocked sight line, or a social workaround. For a separate reaction timing problem at the table, compare the <a href="${EN_DND_COUNTERSPELL_PATH}">Counterspell guide</a>.</p>

<h2>Build a room that proves the order</h2>
<p>The guarded object should change what the spectator does. Pick one encounter shell, then tie every hazard and clue back to that shell.</p>

<table>
  <thead>
    <tr>
      <th>Encounter shell</th>
      <th>Protected thing</th>
      <th>Best player solution</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>The 101-year vault shift</strong></td>
      <td>A chest the summoner never returned to claim.</td>
      <td>Prove the term has ended, find the summoner's mark, or move the chest without "opening" it.</td>
    </tr>
    <tr>
      <td><strong>The false heir</strong></td>
      <td>A sealed archive that opens only to a family phrase.</td>
      <td>Expose the impostor before the spectator accepts the wrong command.</td>
    </tr>
    <tr>
      <td><strong>The ruined laboratory</strong></td>
      <td>A ritual circle still counted as active by the guardian.</td>
      <td>Break the circle's purpose without crossing the protected boundary.</td>
    </tr>
    <tr>
      <td><strong>The freed sentinel</strong></td>
      <td>Nothing; the service ended, but the spectator stayed from habit.</td>
      <td>Give it a new reason to leave, trade information, or become a strange ally for one scene.</td>
    </tr>
  </tbody>
</table>

<p>Let the party win without killing it when the scene supports that result. A spectator can be beaten in combat, tricked by exact wording, satisfied by proof, or released from an old command.</p>

<h2>Make the spectator readable on a VTT token</h2>
<p>A spectator token needs three visual cues: one large central eye, four eyestalks, and a guard-object signal. Keep the body large in the crop, leave the eyestalk tips inside the frame, and place a lock, rune, key, or treasure glow near the lower edge.</p>

<ul>
  <li>Do not give it ten eyestalks. That reads as a beholder and changes the threat expectation.</li>
  <li>Do not draw an antimagic cone marker unless you deliberately homebrewed one. The spectator blocks checked here do not list that feature.</li>
  <li>Use one state token for "warning" and one for "hostile" only when the boundary matters on the map.</li>
  <li>Keep the protected object visible enough that players can connect the monster to the room goal.</li>
</ul>

<p>Open the <a href="${EN_EDITOR_PATH}">Token Maker editor</a>, crop around the eye and eyestalk silhouette, then test the portrait at the same size as the party tokens. For a gentler eye-creature scene built around clues instead of a strict guard post, compare the <a href="${EN_DND_FLUMPH_PATH}">Flumph guide</a>.</p>

<h2>Hand the DM a five-line spectator note</h2>
<p>Before the session, write this note where you can see it:</p>

<ol>
  <li><strong>Version:</strong> 2014 or 2024, with no mixed ray DCs.</li>
  <li><strong>Protected thing:</strong> the exact object, threshold, or location.</li>
  <li><strong>Allowed access:</strong> who may pass, open, touch, or remove it.</li>
  <li><strong>Warning line:</strong> the telepathic sentence spoken before combat.</li>
  <li><strong>Non-kill exit:</strong> proof, wording, release, bargain, or retreat.</li>
</ol>

<p>Run those five lines and the spectator stops being a random eyeball in a room. It becomes a rule-bound obstacle the party can outthink, fight, or free.</p>

<h2>Reference sources</h2>
<ul>
  <li><a href="${DND_SPECTATOR_2014_DNDBEYOND_URL}" rel="noreferrer noopener">D&amp;D Beyond: Spectator, Basic Rules (2014)</a></li>
  <li><a href="${DND_SPECTATOR_2024_ROLL20_URL}" rel="noreferrer noopener">Roll20 Compendium: Spectator, Monster Manual (2024)</a></li>
  <li><a href="${DND_SPECTATOR_TACTICS_URL}" rel="noreferrer noopener">The Monsters Know What They're Doing: Beholder tactics and spectator notes</a></li>
  <li><a href="${DND_SPECTATOR_BODYGUARD_RULING_URL}" rel="noreferrer noopener">RPG Stack Exchange: spectator guardian/bodyguard rules discussion</a></li>
</ul>
`;

export const spectatorDndArticleHtmlZh = String.raw`
<p><strong>spectator dnd</strong> 最适合先当“受契约约束的守卫”，再当会发射眼线的怪物。先在地图上放一个它必须保护的东西，给它一句明确命令，让它警告队伍；只有当有人越线时，再开始结算眼线。</p>

<p>Spectator 不是缩小版 beholder。它有四根眼柄、一个中央眼、telepathy、hover 移动，还有一份可能比很多王国都久的守卫工作。先让这份工作决定遭遇形状，再掷先攻。</p>

<h2>先确定它到底在守什么</h2>
<p>选一个宝物、门槛、仪式圆、囚室、封存档案或禁用升降梯。Spectator 的命令要短到能直接在桌上说出来："除了 Arveth，任何生物不得打开宝库。" 这一句话会告诉玩家可以测试、钻空子或违反的边界。</p>

<ul>
  <li><strong>受保护目标：</strong>箱子、传送门、神龛、桥、钥匙或封闭房间。</li>
  <li><strong>允许进入者：</strong>召唤者、指定徽记、口令、血脉，或日期到来前谁都不行。</li>
  <li><strong>第一次警告：</strong>用 telepathy 说清楚哪一个动作会触发战斗。</li>
  <li><strong>解除条件：</strong>宝物被移动、毁坏、由召唤者取走，或始终无人触碰时会怎样。</li>
</ul>

<p>不要把 spectator 当成保镖，除非你已经改了前提。经典守卫文字指向的是地点或宝物，不是活人的贴身护卫合同。会移动的项链可以算宝物；想要忠诚护卫的法师，需要解决另一个问题。</p>

<h2>第一道眼线前，先选规则版本</h2>
<p>2014 和 2024 的 spectator 很像，但差异足以让桌边出错。开战前先选一个版本，然后整场都使用同一套 DC、眼线效果和 reaction。</p>

<table>
  <thead>
    <tr>
      <th>桌边问题</th>
      <th>2014 Basic Rules / Monster Manual 风格</th>
      <th>2024 Monster Manual 风格</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>主要定位</strong></td>
      <td>CR 3 的次级 beholder 守卫，有眼线、telepathy 和固定岗位。</td>
      <td>CR 3 Medium Aberration (Beholder)，仍然绑定在一个受保护目标上。</td>
    </tr>
    <tr>
      <td><strong>Eye Rays</strong></td>
      <td>最多两道眼线，指定 90 尺内一到两个能看见的生物；同一回合每种眼线只能用一次。</td>
      <td>两道随机眼线；掷 1d4，若本回合已经用过该眼线则重掷。</td>
    </tr>
    <tr>
      <td><strong>豁免 DC</strong></td>
      <td>Confusion、Paralyzing、Fear 和 Wounding rays 使用 DC 13。</td>
      <td>使用 DC 12；Confusion 和 Fear 在失败时还会造成 2d4 Psychic 伤害。</td>
    </tr>
    <tr>
      <td><strong>Spell Reflection</strong></td>
      <td>成功通过法术豁免或被法术攻击打失时，把法术转向 30 尺内另一个能看见的生物。</td>
      <td>对 120 尺内一个能看见的生物触发 DC 12 Dexterity save；失败受到 3d6 Force 伤害。</td>
    </tr>
  </tbody>
</table>

<p>在先攻记录旁写上 "2014" 或 "2024"。这个小标记能防止最常见的混用：拿 2024 的随机眼线，配 2014 的 DC 13，再叠上错误版本的 Spell Reflection。</p>

<h2>让警告场景真的发挥作用</h2>
<p>Spectator 开打前可以交谈。用好这一点。它能陈述命令、说出召唤者、描述受保护目标，并拒绝谈判；它不是无脑陷阱。</p>

<p>先给队伍三个明确选择：</p>

<ol>
  <li><strong>遵守命令。</strong>离开、去找召唤者徽记、改走别的入口，或调查宝库为什么重要。</li>
  <li><strong>钻文字边界。</strong>问清命令保护的是房间、物品、封印，还是召唤者定义里的“偷窃”。</li>
  <li><strong>直接越线。</strong>跨过它声明的边界，并接受守卫现在有了战斗理由。</li>
</ol>

<p>第一颗骰子最好回应一个玩家已经理解的选择。突如其来的眼线会显得随意；明确警告之后的眼线，才像守卫在履行职责。</p>

<h2>把 Eye Rays 当成守卫模式来跑</h2>
<p>房间要让视线真正重要。让 spectator 悬在能看见目标的位置，再放入柱子、货架、帘幕、锁链圣物或高低步道，让玩家能切断视线，同时不必离开目标。</p>

<ul>
  <li><strong>Confusion Ray</strong> 会让闯入者变成盟友身边的风险。留出足够距离，让随机攻击真的有影响。</li>
  <li><strong>Paralyzing Ray</strong> 会惩罚第一个跨过门槛的人。附近要有队友能利用的掩护或救援位置。</li>
  <li><strong>Fear Ray</strong> 会把队伍推离受保护目标。房间里要有真实退路。</li>
  <li><strong>Wounding Ray</strong> 是伤害警告。用它让反复硬闯的代价变高。</li>
</ul>

<p>不要把房间做成空竞技场。Spectator 悬在空地上反复掷眼线，只会变成数值互换。有视线遮挡、清楚边界和有价值目标的房间，会让队伍尝试解决守卫，而不是只和它换血。</p>

<h2>让 Spell Reflection 在伤人前先被看见</h2>
<p>Spell Reflection 应该改变施法者选择，而不是用隐藏段落偷袭桌子。战斗前放一尊被烧焦的雕像、一面裂开的镜盾，或一个死去入侵者，他自己的法术痕迹刻在墙上。等法术打失或 spectator 通过豁免时，大家就知道为什么这里的魔法危险。</p>

<p>触发条件要守窄。武器攻击不会触发它。Spectator 自己的 eye rays 也不是 spells。使用 2014 版本时，按该版本把法术转向 30 尺内另一个生物；使用 2024 版本时，按列出的 Dexterity save 和 Force 伤害处理。</p>

<p>面对施法者多的队伍，这就是整场遭遇的核心。最安全的动作可能是武器攻击、推挤、切断视线，或找到社交绕法。若你需要处理另一种桌边 reaction 时机，可以对照 <a href="${ZH_DND_COUNTERSPELL_PATH}">Counterspell 指南</a>。</p>

<h2>做一个能证明命令的房间</h2>
<p>受保护目标要改变 spectator 的行动。先选一个遭遇外壳，再让所有危险和线索都回到这个外壳上。</p>

<table>
  <thead>
    <tr>
      <th>遭遇外壳</th>
      <th>受保护目标</th>
      <th>最好的玩家解法</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>101 年宝库值班</strong></td>
      <td>召唤者一直没回来取走的箱子。</td>
      <td>证明期限已满、找到召唤者徽记，或在“不打开”的前提下移动箱子。</td>
    </tr>
    <tr>
      <td><strong>假继承人</strong></td>
      <td>只对家族口令开启的封存档案。</td>
      <td>在 spectator 接受错误命令前揭穿冒名者。</td>
    </tr>
    <tr>
      <td><strong>废弃实验室</strong></td>
      <td>仍被守卫视为有效的仪式圆。</td>
      <td>不跨过保护边界，也能破坏仪式目的。</td>
    </tr>
    <tr>
      <td><strong>被释放的哨兵</strong></td>
      <td>没有目标；服役已结束，但它习惯性留下。</td>
      <td>给它一个离开的理由、交换信息，或让它在一场戏里成为怪异盟友。</td>
    </tr>
  </tbody>
</table>

<p>场景支持时，允许队伍不杀它也能赢。Spectator 可以被击败，也可以被精确措辞绕开、被证据说服，或从旧命令里释放。</p>

<h2>让 spectator 在 VTT Token 上一眼可读</h2>
<p>Spectator 的 Token 需要三个视觉信号：一个大中央眼、四根眼柄、一个守卫目标提示。让身体在裁切里足够大，把眼柄末端留在画面内，再把锁、符文、钥匙或宝物反光放在下沿附近。</p>

<ul>
  <li>不要给它十根眼柄。那会读成 beholder，也会改变玩家对威胁的预期。</li>
  <li>不要画 antimagic cone 标记，除非你明确做了 homebrew。本次核对的 spectator 数据块没有这项能力。</li>
  <li>只有地图边界真的重要时，才分别做“警告”和“敌对”两个状态 Token。</li>
  <li>让受保护目标保留一点可见度，玩家才会把怪物和房间目标连起来。</li>
</ul>

<p>打开 <a href="${ZH_EDITOR_PATH}">Token Maker 编辑器</a>，围绕中央眼和眼柄轮廓裁切，再把头像缩到队友 Token 同尺寸检查。若你想要的是偏线索和盟友的温和眼形生物，而不是严格守卫，可以对照 <a href="${ZH_DND_FLUMPH_PATH}">Flumph 指南</a>。</p>

<h2>交给 DM 一张五行 spectator 说明</h2>
<p>开团前，把这五行写在你能看见的位置：</p>

<ol>
  <li><strong>版本：</strong>2014 或 2024，不混用 eye ray DC。</li>
  <li><strong>受保护目标：</strong>具体物体、门槛或地点。</li>
  <li><strong>允许进入者：</strong>谁可以通过、打开、触碰或移走它。</li>
  <li><strong>警告台词：</strong>开战前那一句 telepathic 警告。</li>
  <li><strong>非击杀出口：</strong>证据、措辞、释放、交易或撤退。</li>
</ol>

<p>按这五行跑，spectator 就不再是房间里随机出现的大眼怪。它会变成一个受规则约束的障碍，队伍可以智取、硬打，或把它放出来。</p>

<h2>参考来源</h2>
<ul>
  <li><a href="${DND_SPECTATOR_2014_DNDBEYOND_URL}" rel="noreferrer noopener">D&amp;D Beyond：Spectator，Basic Rules (2014)</a></li>
  <li><a href="${DND_SPECTATOR_2024_ROLL20_URL}" rel="noreferrer noopener">Roll20 Compendium：Spectator，Monster Manual (2024)</a></li>
  <li><a href="${DND_SPECTATOR_TACTICS_URL}" rel="noreferrer noopener">The Monsters Know What They're Doing：Beholder tactics 与 spectator notes</a></li>
  <li><a href="${DND_SPECTATOR_BODYGUARD_RULING_URL}" rel="noreferrer noopener">RPG Stack Exchange：spectator guardian/bodyguard 规则讨论</a></li>
</ul>
`;
