import {
  DND_2024_PLAYING_THE_GAME_URL,
  DND_FIRE_BOLT_RULES_URL,
  EN_DICE_ROLLER_PATH,
  EN_DND_THUNDERCLAP_PATH,
  EN_EDITOR_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_THUNDERCLAP_PATH,
  ZH_EDITOR_PATH,
} from './shared';

export const fireboltDnd5eArticleHtml = String.raw`
<p><strong>Fire Bolt</strong> is a 120-foot ranged spell attack that deals 1d10 Fire damage on a hit. It can target a creature or an object, and a flammable object that is not worn or carried starts burning when the spell hits it. Before the d20, choose the target that changes the map, then make one clean attack.</p>

<p>Use Fire Bolt when you need a repeatable attack across the room. Do not treat it like a small Fireball. It picks one target, asks for an attack roll, and leaves the rest of the scene to the choices you make around that hit.</p>

<h2>Read the target before you roll</h2>
<p>Start with the thing you want the spell to affect. The 2024 attack rules use the same three-step order for an attack made as part of a spell: choose a target, determine modifiers, then resolve the attack.</p>

<ol>
  <li><strong>Name one target.</strong> Choose the creature that needs damage or the separate object that needs to burn. A guard holding a torch and the torch are not the same target.</li>
  <li><strong>Measure the route.</strong> Fire Bolt has one range: 120 feet. On a 5-foot grid, that reaches 24 squares. You cannot make this attack past that distance.</li>
  <li><strong>Check the pressure on the caster.</strong> Ask the DM about Cover, then look beside your token. If an enemy within 5 feet can see you and is not Incapacitated, the ranged attack has Disadvantage.</li>
</ol>

<p>If the wooden barricade matters more than the goblin behind it, target the barricade. If the goblin must fall before the next turn, target the goblin. Pick the result you need before the roll creates a tempting side story.</p>

<h2>Resolve Fire Bolt like an attack, not an automatic effect</h2>
<p>Make a ranged spell attack: roll a d20, add the spell attack modifier on your sheet, and compare the total with the target's AC. Roll Fire damage only after a hit. A miss does not deal partial damage and does not turn the line between caster and target into an area effect.</p>

<p>Fire Bolt starts at 1d10 Fire damage. Its cantrip upgrade adds another d10 at levels 5, 11, and 17. Write the current damage dice beside the attack bonus, then use the <a href="${EN_DICE_ROLLER_PATH}">DnD dice roller</a> when you want to test a few rolls without slowing down the table.</p>

<p>Keep the declaration short: "Fire Bolt at the cultist behind the altar." That gives the DM a target, a position, and a reason to apply any Cover or Disadvantage before you roll.</p>

<h2>A 120-foot range changes where you stand</h2>
<p>Long range is valuable because it lets the caster choose a safer square before spending the action. On a VTT map, count 24 squares from a square next to your token to a square occupied by the target. Then decide whether you are still helping the party from that position.</p>

<ul>
  <li><strong>Stay wide when the front line is holding.</strong> A clear 60-foot lane is often better than walking into a crowded doorway just to be closer.</li>
  <li><strong>Move before you cast when an enemy closes.</strong> If an enemy within 5 feet can see you and is not Incapacitated, Fire Bolt has Disadvantage. Step away if the map and your allies make that safe.</li>
  <li><strong>Respect the obstruction.</strong> A target behind a column, ally, or broken wall may be harder to hit. Ask for the modifier before spending the action.</li>
  <li><strong>Do not chase a target beyond the spell's range.</strong> Reposition, take another action that fits the turn, or let an ally handle the far side of the map.</li>
</ul>

<p>Stand where the attack still leaves the party a useful next turn. Extra distance only matters when that square continues to help after the target reacts.</p>

<h2>Treat the fire as a map problem</h2>
<p>Fire Bolt can do more than damage when the map gives you a real object to target. The spell's ignition clause applies to a flammable object hit by the spell, provided that object is not worn or carried. That is a clear opening for a loose rope, an unattended wooden brace, a freestanding curtain, or a signal pyre.</p>

<p>Separate the two decisions. If you target the creature, resolve the attack against the creature. If you target the rope, resolve the attack against the rope. Do not claim both results from one casting just because the creature is standing next to the object.</p>

<p>Once the object ignites, ask the DM what changes on this map: light, smoke, a blocked route, a collapsing cover point, or an alarm. Fire Bolt tells you when ignition begins. The scene decides what that ignition threatens next.</p>

<h2>Use Fire Bolt for damage, then switch jobs when the turn needs something else</h2>
<p>Fire Bolt earns the action when one distant target needs an attack roll and fire damage. Keep another option ready for turns where damage is not the job.</p>

<ul>
  <li>Use Fire Bolt when a single enemy is exposed, within 120 feet, and worth hitting now.</li>
  <li>Use a different cantrip or action when the party needs a saving throw, close-range escape, movement control, or you cannot identify the target's location or get past Total Cover.</li>
  <li>Do not keep forcing Fire Bolt at a point-blank enemy just because it is your highest damage die. The attack's positioning problem matters before the damage roll does.</li>
</ul>

<p>For a cantrip that changes the space around the caster instead of reaching across the map, compare the threat radius in the <a href="${EN_DND_THUNDERCLAP_PATH}">Thunderclap guide</a>. Keep each spell on your sheet for the job it actually solves.</p>

<h2>Make the cast readable on a VTT token</h2>
<p>A Fire Bolt character token only needs one visual promise: the table should spot the casting hand before it has to ask which token just acted. Crop the portrait from head to chest, keep the raised hand inside the frame, and place a small orange reflection on the face or sleeve.</p>

<ul>
  <li>Use a warm edge light against a cool dungeon background so the flame does not disappear at map size.</li>
  <li>Keep the projectile outside the token crop. A long glowing line becomes visual noise inside a 256-pixel portrait.</li>
  <li>Make a second token only for a real state change, such as a hood pulled up for stealth or a visible spell focus raised before a fight.</li>
</ul>

<p>Open the <a href="${EN_EDITOR_PATH}">Token Maker editor</a>, test the crop beside the party's front line, and brighten the hand before adding more decoration. The token should show who is casting without pretending to show the entire spell effect.</p>

<h2>Check these four things before you end the turn</h2>
<ol>
  <li>Did you choose one creature or one object?</li>
  <li>Is that target inside 120 feet with the right Cover and close-combat modifiers?</li>
  <li>Does the map need damage, ignition, or a different action this turn?</li>
  <li>Will your square still help the party after the target reacts?</li>
</ol>

<p>Those four checks keep Fire Bolt simple. Pick the target, make the attack, then let the hit change the battlefield for a reason.</p>

<h2>Reference sources</h2>
<ul>
  <li><a href="${DND_FIRE_BOLT_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond: Fire Bolt</a></li>
  <li><a href="${DND_2024_PLAYING_THE_GAME_URL}" rel="noreferrer noopener">D&amp;D Beyond Basic Rules (2024): Playing the Game and Making an Attack</a></li>
</ul>
`;

export const fireboltDnd5eArticleHtmlZh = String.raw`
<p><strong>Fire Bolt</strong> 是一个 120 尺的远程法术攻击，命中后造成 1d10 Fire 伤害。它可以指定生物或物体；若命中的可燃物体没有被穿戴或携带，就会燃烧。d20 之前，先挑会改变地图的目标，再结算这一次攻击。</p>

<p>当你需要隔着房间稳定打一个目标时，用 Fire Bolt。别把它当成缩小版 Fireball。它每次只选一个目标、要求一次攻击掷骰，之后场面会怎么变，取决于你围绕命中做出的选择。</p>

<h2>掷骰前，先看你要打的目标</h2>
<p>先看你要让法术影响什么。2024 的攻击流程对法术攻击也一样：选择目标、确认修正值、再结算攻击。</p>

<ol>
  <li><strong>说清一个目标。</strong>选需要受伤的生物，或需要点燃的独立物体。拿着火把的守卫和火把不是同一个目标。</li>
  <li><strong>量好路线。</strong>Fire Bolt 只有一个范围：120 尺。放在 5 尺网格上就是 24 格，超过这个距离就不能用它攻击。</li>
  <li><strong>看施法者身上的压力。</strong>先问 DM 有没有 Cover，再看 Token 旁边。若 5 尺内有能看见你、且没有 Incapacitated 的敌人，这次远程攻击会带 Disadvantage。</li>
</ol>

<p>若木制路障比它后面的地精更重要，就打路障。若地精必须在下一回合前倒下，就打地精。让你需要的结果先决定目标，别让掷骰后的临时想法把选择拉偏。</p>

<h2>把 Fire Bolt 当一次攻击处理，不是自动效果</h2>
<p>进行一次远程法术攻击：掷 d20，加角色卡上的 spell attack modifier，再与目标 AC 比较。命中后才掷 Fire 伤害。没命中就没有部分伤害，施法者与目标之间那条线也不会因此变成范围效果。</p>

<p>Fire Bolt 起始造成 1d10 Fire 伤害，到 5、11、17 级时各多加一个 d10。把当前伤害骰写在攻击加值旁边；若你想先掷几轮看看手感，可以用 <a href="${ZH_DICE_ROLLER_PATH}">DND 骰子工具</a>。</p>

<p>宣告可以很短："Fire Bolt 打祭坛后面的教徒。" DM 会立刻拿到目标、位置和理由，在你掷骰前处理 Cover 或 Disadvantage。</p>

<h2>120 尺会改变你的站位</h2>
<p>远距离的价值，在于施法者能先挑更安全的格子，再花掉 action。放在 VTT 地图上，从 Token 相邻的一格数到目标所在格，最多 24 格。接着再问：从这个位置打出去，下一回合还在帮队伍吗？</p>

<ul>
  <li><strong>前排稳住时就拉开。</strong>一条清楚的 60 尺射线，往往比为了靠近而挤进门口更好。</li>
  <li><strong>敌人贴上来时，先移动再施法。</strong>若 5 尺内有能看见你、且没有 Incapacitated 的敌人，Fire Bolt 会有 Disadvantage。地图和队友允许的话，先离开那个格子。</li>
  <li><strong>别无视遮挡。</strong>石柱、盟友或半塌的墙都会让命中更困难。花 action 前先问清楚修正。</li>
  <li><strong>别追到超出范围。</strong>重站位、做一个适合这回合的动作，或让队友处理地图另一侧。</li>
</ul>

<p>站在攻击结算后还能给队伍留下好下一步的位置。距离只有在目标反应后仍能帮到队伍时才有价值。</p>

<h2>把火焰当成地图问题处理</h2>
<p>当地图上真的有值得打的物体时，Fire Bolt 不只是在扣血。它的点燃条款适用于被命中的可燃物体，前提是物体没有被穿戴或携带。松开的绳子、无人扶着的木支撑、独立的帘子或信号柴堆，都可能成为明确目标。</p>

<p>把两件事拆开。打生物，就对生物结算攻击；打绳子，就对绳子结算攻击。不要因为生物站在物体旁边，就想从同一次施法里同时拿到两个结果。</p>

<p>物体燃起来后，问 DM 地图改变了什么：光线、烟雾、被堵住的路线、会塌的掩体，还是警报。Fire Bolt 告诉你火什么时候点着；场景决定这团火下一步威胁什么。</p>

<h2>该补伤害时用 Fire Bolt，需要其他结果时换戏法</h2>
<p>当远处有一个目标需要攻击掷骰和 Fire 伤害时，Fire Bolt 值得花掉 action。遇到伤害不是这回合核心任务的场景，就把另一种选择留在手边。</p>

<ul>
  <li>单个敌人暴露、在 120 尺内，而且现在必须挨一下时，用 Fire Bolt。</li>
  <li>队伍需要豁免、贴身脱困、移动控制，或无法确定目标位置、被 Total Cover 挡住时，换另一种戏法或动作。</li>
  <li>别只因为 Fire Bolt 的伤害骰大，就硬对贴身敌人用它。站位问题总会先于伤害骰出现。</li>
</ul>

<p>若你想要的是围绕施法者改变空间，而不是跨地图点一个目标，可以对照 <a href="${ZH_DND_THUNDERCLAP_PATH}">Thunderclap 指南</a>里的威胁范围。每个法术都该留给它真正能解决的工作。</p>

<h2>让施法动作在 VTT Token 上读得出来</h2>
<p>Fire Bolt 角色的 Token 只需要传达一件事：全桌该在问“谁刚行动”之前就看出施法手。把头像裁在头到胸口，确保抬起的手留在画面内，再在脸或袖子上留一小块橙色反光。</p>

<ul>
  <li>用暖色边缘光对上冷色地城背景，火焰才不会缩到地图尺寸就消失。</li>
  <li>别把飞出去的火焰塞进 Token 裁切。长长的发光线放进 256 像素头像里只会变乱。</li>
  <li>只有状态真的变了才做第二张 Token，例如潜行时拉上兜帽，或战斗前举起看得见的法器。</li>
</ul>

<p>打开 <a href="${ZH_EDITOR_PATH}">Token Maker 编辑器</a>，把裁切放到队伍前排 Token 旁边看。先把手提亮，再考虑加其他装饰。全桌应该先看懂谁在施法，不需要 Token 里塞进整条法术特效。</p>

<h2>结束回合前复查这四件事</h2>
<ol>
  <li>你选的是一个生物，还是一个物体？</li>
  <li>目标在 120 尺内吗？Cover 和贴身远程的修正算了吗？</li>
  <li>这回合地图需要伤害、点火，还是完全不同的动作？</li>
  <li>目标反应后，你站的格子还能帮到队伍吗？</li>
</ol>

<p>这四个问题会让 Fire Bolt 保持简单。选目标、做攻击，然后让命中为了一个明确理由改变战场。</p>

<h2>参考来源</h2>
<ul>
  <li><a href="${DND_FIRE_BOLT_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond：Fire Bolt</a></li>
  <li><a href="${DND_2024_PLAYING_THE_GAME_URL}" rel="noreferrer noopener">D&amp;D Beyond 2024 基础规则：Playing the Game 与 Making an Attack</a></li>
</ul>
`;
