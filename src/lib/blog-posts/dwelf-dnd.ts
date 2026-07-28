import {
  DND_2024_CHARACTER_CREATION_URL,
  DND_2024_CHARACTER_ORIGINS_URL,
  DND_DWELF_HOMEBREW_REFERENCE_URL,
  EN_DND_CLASSES_PATH,
  EN_DND_DWARF_NAMES_PATH,
  EN_EDITOR_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_DND_DWARF_NAMES_PATH,
  ZH_EDITOR_PATH,
} from './shared';

export const dwelfDndArticleHtml = String.raw`
<p><strong>dwelf dnd</strong> is a useful character concept when you want a dwarf-elf hero without turning the character sheet into a pile of borrowed traits. In the 2024 rules, choose one official species for mechanics, then let the other side of the family shape the character's appearance, habits, languages, relationships, and the problems that follow them into the campaign.</p>

<p>That gives you a character the DM can approve quickly and a heritage the party can discover in play. You get one clear rules chassis instead of an accidental package of Darkvision ranges, resistances, spells, and rest rules that were never designed to stack.</p>

<h2>Choose one rules chassis and keep its limits</h2>
<p>The 2024 basic rules list Dwarf and Elf as separate playable species. They do not list dwelf as a third option. Put one species on the sheet, take that species' full trait package, and describe the character as mixed heritage in the story.</p>

<table>
  <thead>
    <tr>
      <th>Choose this chassis when you want...</th>
      <th>Rules you receive</th>
      <th>Let the other heritage show through...</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Dwarf</strong><br />A durable explorer with a strong connection to stone, poison resistance, or underground work.</td>
      <td>120-foot Darkvision, Dwarven Resilience, Dwarven Toughness, and Stonecunning.</td>
      <td>Long-lived relatives, an elven mentor, pointed ears, trance-like family stories, or a craft style learned in a woodland enclave.</td>
    </tr>
    <tr>
      <td><strong>Elf</strong><br />A character whose magic, awareness, or unusual rest routine should matter at the table.</td>
      <td>60-foot Darkvision, an Elven Lineage, Fey Ancestry, one skill from Insight, Perception, or Survival, and Trance.</td>
      <td>A beard, a compact build, a family forge, a stone-carving apprenticeship, or a dwarven clan that still expects you at every funeral and oath-taking.</td>
    </tr>
  </tbody>
</table>

<p>Do not take Dwarven Toughness on an Elf chassis because the portrait has a beard. Do not add an elven lineage spell list to a Dwarf chassis because one parent came from the Feywild. Pick the mechanics that make the character fun to play every session, then keep the visual heritage free to be as specific as you like.</p>

<p>Ability score increases come from your background in the 2024 rules, not from either species. That is good news for a dwelf concept: a mason, scout, archivist, soldier, or acolyte can carry the practical training that explains the character's best abilities without forcing the family tree to do that work.</p>

<h2>Give the family two places and one unfinished promise</h2>
<p>A mixed-heritage character becomes memorable when both sides of the family want something concrete. Name two places that raised you, then write one promise that cannot satisfy both at once.</p>

<ul>
  <li><strong>The mountain workshop and the riverside grove:</strong> You learned metalwork below ground and map-reading beneath old trees. The argument is not "which side are you?" It is whether a sacred vein of ore should be mined or left untouched.</li>
  <li><strong>The clan hall and the travelling troupe:</strong> One family expects you to settle an inheritance; the other expects you to keep moving before anyone can claim you. A sealed letter can pull you toward either obligation.</li>
  <li><strong>The old oath and the new name:</strong> A dwarf relative recorded your birth in a ledger. An elf relative gave you a name that changes with each major deed. Decide which one a stranger hears first.</li>
</ul>

<p>Make the promise playable. "Return the ancestral hammer before the winter gathering" gives the party a destination. "Convince the grove council that the mine is safe" gives the group a social problem. A vague wish to belong has no handle for the DM or the other players.</p>

<h2>Build the character around one contradiction, not a blended stereotype</h2>
<p>Choose one habit that makes sense in one home and causes trouble in the other. Let that habit appear when the group is tired, negotiating, or deciding what to keep.</p>

<ol>
  <li>You repair a damaged object before asking whether it is cursed, stolen, or politically important.</li>
  <li>You remember faces and voices for decades but keep every promise in a short, numbered ledger.</li>
  <li>You treat a tree as a neighbour but still evaluate its roots as potential tunnel hazards.</li>
  <li>You bring an heirloom cup to a formal feast, then refuse to drink until you know who quarried the stone beneath the hall.</li>
</ol>

<p>Use only one of these as the character's pressure point. The rest can stay as color. A single contradiction gives you a reliable choice in a difficult scene without reducing the character to "half of this plus half of that."</p>

<h2>Let the party meet your heritage through action</h2>
<p>Give your companions a reason to care about the family history before you explain it. These three scene starts reveal the dwelf through a decision rather than a biography.</p>

<h3>The bridge made from a living root</h3>
<p>The party needs to cross a gorge. Your dwarven uncle supplied iron pins for a safe span, but your elven aunt says driving them into the root will kill the oldest tree in the valley. You can search for another crossing, negotiate for permission, or accept a delay while the group faces the approaching threat.</p>

<h3>The inheritance that does not fit your hand</h3>
<p>A clan representative brings you a ceremonial warhammer. It is too heavy for the way you fight, but refusing it publicly insults the family that paid for your training. The party can help arrange a new purpose for it: a gift, a bargaining piece, or an object that proves someone else has been lying about the inheritance.</p>

<h3>The guest who knows your childhood name</h3>
<p>At a city inn, an elven traveller uses a name no one in the party has heard. They want your help with a problem that will take months to solve, while the party's immediate job starts at dawn. You have to decide what the name means before the visitor explains it to everyone else.</p>

<h2>Choose details that still read at token size</h2>
<p>A dwelf token should give the group one fast answer: who is this person in the room? Keep the portrait centered on the face, then add only two heritage signals that survive a small grid square.</p>

<ul>
  <li><strong>Silhouette:</strong> pointed ears plus one deliberate beard shape, braid, or heavy collar. Avoid adding every possible cultural marker at once.</li>
  <li><strong>Material contrast:</strong> pair one worked material, such as hammered silver or carved stone, with one living material, such as a leaf clasp, ash staff, or woven cord.</li>
  <li><strong>Color cue:</strong> use a warm forge accent against a cool forest or twilight background. The face still needs the highest contrast.</li>
  <li><strong>State change:</strong> make a second token only when a visible story change matters, such as wearing the clan signet openly or hiding it during a negotiation.</li>
</ul>

<p>Open the <a href="${EN_EDITOR_PATH}">Token Maker editor</a>, crop to the face and shoulders first, and test the result beside the other party tokens. If the ears disappear and the beard becomes a dark blur, pull back slightly or brighten the rim light. The portrait should identify the character before the table needs a reminder.</p>

<h2>Hand your DM a four-line dwelf note</h2>
<p>Bring this note to session zero or send it before the first family scene:</p>

<ol>
  <li><strong>Rules chassis:</strong> Dwarf or Elf, with no added traits from the other species.</li>
  <li><strong>Two homes:</strong> the named places or communities that raised you.</li>
  <li><strong>Unfinished promise:</strong> one obligation that can create a choice for the whole party.</li>
  <li><strong>Boundary:</strong> the family detail you want present but do not want turned into a joke, secret betrayal, or repeated conflict.</li>
</ol>

<p>This lets the DM use the heritage without guessing at your limits. For a clan name that can anchor the dwarven side, use the <a href="${EN_DND_DWARF_NAMES_PATH}">DnD dwarf names guide</a>. For the class choice that decides what you do once initiative starts, compare the <a href="${EN_DND_CLASSES_PATH}">DnD classes</a> before you decide whether the character is a ranger, cleric, fighter, artificer, or something less expected.</p>

<h2>Reference sources</h2>
<ul>
  <li><a href="${DND_2024_CHARACTER_CREATION_URL}" rel="noreferrer noopener">D&amp;D Beyond Basic Rules (2024): Creating a Character</a></li>
  <li><a href="${DND_2024_CHARACTER_ORIGINS_URL}" rel="noreferrer noopener">D&amp;D Beyond Basic Rules (2024): Character Origins, Dwarf, and Elf traits</a></li>
  <li><a href="${DND_DWELF_HOMEBREW_REFERENCE_URL}" rel="noreferrer noopener">Step into RPGs: mixed-heritage dwelf homebrew discussion</a></li>
</ul>
`;

export const dwelfDndArticleHtmlZh = String.raw`
<p><strong>dwelf dnd</strong> 指的是矮人和精灵混血的角色概念。若你想把这个设定真正放上角色卡，2024 规则里最稳的做法是只选一个官方物种作为机制底盘，再把另一边家族放进外貌、习惯、语言、亲属关系和冒险里的麻烦。</p>

<p>这样 DM 很容易确认，角色也不会变成两套物种特性硬叠出来的结果。你会有一套明确规则，同时还能让混血身份在跑团里慢慢被队友看见。</p>

<h2>先选一个规则底盘，再守住它的边界</h2>
<p>2024 基础规则把 Dwarf 和 Elf 列为独立可选物种，没有把 dwelf 列成第三种。角色卡上写一个物种，拿完整的那一套特性；混血身份放在背景和演出里。</p>

<table>
  <thead>
    <tr>
      <th>想玩出什么感觉</th>
      <th>选这个规则底盘</th>
      <th>把另一边家族放在哪里</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>想要耐久、石头环境里的能力，或与矿坑和工坊直接相关的冒险经历。</td>
      <td><strong>Dwarf</strong><br />拿 120 尺 Darkvision、Dwarven Resilience、Dwarven Toughness 和 Stonecunning。</td>
      <td>尖耳、精灵亲属、在林地学来的手艺、会在静坐时想起的家族故事，或一位来自 Feywild 的老师。</td>
    </tr>
    <tr>
      <td>想让魔法血统、感知或不用正常睡觉的生活方式成为角色的一部分。</td>
      <td><strong>Elf</strong><br />拿 60 尺 Darkvision、Elven Lineage、Fey Ancestry、从 Insight、Perception、Survival 中选一项技能和 Trance。</td>
      <td>胡子、紧凑结实的身形、家族铁匠铺、石雕学徒经历，或仍等着你回去参加每一场葬礼和宣誓的矮人氏族。</td>
    </tr>
  </tbody>
</table>

<p>不要因为肖像有胡子，就在 Elf 底盘上加 Dwarven Toughness。也不要因为某位父母来自 Feywild，就在 Dwarf 底盘上加精灵法术。选一套每个游戏夜都好玩的机制，另一边家族则可以写得很细，不需要受限。</p>

<p>2024 规则里的属性加值来自 Background，不来自物种。这反而很适合 dwelf：石匠、斥候、抄写员、士兵或侍僧的训练，能说明角色最擅长什么，不必让家谱替你决定职业路线。</p>

<h2>给家族两个地点和一件没完成的承诺</h2>
<p>混血角色只有在两个家族都想要具体东西时才会立起来。先写出养大你的两个地点，再写一个两边不可能同时满意的承诺。</p>

<ul>
  <li><strong>山中工坊和河边圣林：</strong>你在地下学打铁，在老树下学读地图。问题不是“你属于哪边”，而是要不要开采一条被精灵视为神圣的矿脉。</li>
  <li><strong>氏族大厅和旅行剧团：</strong>一边要你回去处理继承，另一边希望你继续上路，别让任何人替你定下来。一封封着火漆的信就能把队伍带向其中一边。</li>
  <li><strong>旧誓言和新名字：</strong>矮人亲属把你的出生名字记在账簿里，精灵亲属则给了你一个会随着功绩变化的名字。决定陌生人先听到哪一个。</li>
</ul>

<p>承诺要能直接上桌。“在冬季集会前带回祖传铁锤”会给队伍一个目的地；“说服林地议会矿井不会伤害地下水”会给全队一个社交难题。单纯想找到归属感，DM 很难把它变成下一场戏。</p>

<h2>用一个矛盾塑造角色，不要拼一个混合刻板印象</h2>
<p>挑一个在某个家里理所当然、到了另一个家却会惹麻烦的习惯。让它在疲惫、谈判或分赃时出现。</p>

<ol>
  <li>看到损坏的物件，你会先修它，再问它是不是被诅咒、被偷走，或是不是重要证物。</li>
  <li>你能记住几十年前的脸和声音，却把每一条承诺都写进编号账簿。</li>
  <li>你会把树当邻居说话，同时也会下意识判断它的根会不会让隧道塌掉。</li>
  <li>你会带祖传酒杯参加正式宴会，却拒绝喝第一口酒，直到知道大厅地基的石头是谁采出来的。</li>
</ol>

<p>只选其中一个当作角色真正的压力点，其他细节留作颜色就够了。一个矛盾就能让你在难场景里有稳定的选择，不会把角色缩成“这一半加那一半”。</p>

<h2>让队友通过行动认识你的来历</h2>
<p>先给队友一个关心这段家史的理由，再解释家谱。下面三种开场会让 dwelf 身份从选择里浮出来，不是从自我介绍里堆出来。</p>

<h3>用活树根搭成的桥</h3>
<p>队伍得过峡谷。你的矮人舅舅准备了铁钉，能把桥固定得很安全；精灵姨妈却说钉子会杀死谷里最老的树。你们可以另找路、谈条件，或在威胁逼近时接受延误。</p>

<h3>你拿不顺手的继承物</h3>
<p>一位氏族代表送来礼仪战锤。它太重，不适合你的战斗方式，但当众拒绝会羞辱资助过你训练的人。队伍可以帮你给它找新用途：作为礼物、谈判筹码，或揭穿有人在继承问题上撒谎的证据。</p>

<h3>知道你童年名字的客人</h3>
<p>城里旅店来了一位精灵旅客，叫了一个队友从没听过的名字。对方要你帮忙处理一件得花好几个月的事，队伍眼前的委托却在黎明开工。你得在客人把一切说给大家听以前，先决定这个名字对你意味着什么。</p>

<h2>只挑缩小后还看得懂的 Token 细节</h2>
<p>Dwelf 的 Token 要让全桌一眼知道“这是谁”。先把头像裁在脸和肩膀，再加两处能在小格子里留下来的家族信号。</p>

<ul>
  <li><strong>轮廓：</strong>尖耳加上一种有意设计的胡型、发辫或宽领。别把所有文化标记都塞进去。</li>
  <li><strong>材质对照：</strong>选一种加工过的材料，例如锤纹银或雕石，再配一种活的材料，例如叶形扣、白蜡木杖或编绳。</li>
  <li><strong>颜色提示：</strong>把温暖的炉火色放进偏冷的森林或暮色背景里，但脸始终得是对比最高的部分。</li>
  <li><strong>状态变化：</strong>只有剧情上真的重要时才做第二张，例如谈判时藏起氏族戒指，或公开佩戴它。</li>
</ul>

<p>打开 <a href="${ZH_EDITOR_PATH}">Token Maker 编辑器</a>，先把脸和肩膀裁清楚，再把它放到队友 Token 旁边看。若尖耳不见了、胡子只剩一团黑影，就稍微拉远，或加亮边缘光。全桌不该先听你解释，才认得出角色。</p>

<h2>交给 DM 一张四行 dwelf 说明</h2>
<p>在 session zero 或第一场家族戏前，把下面四行发给 DM：</p>

<ol>
  <li><strong>规则底盘：</strong>Dwarf 或 Elf，不从另一种物种追加特性。</li>
  <li><strong>两个家：</strong>养大你的地点或社群名称。</li>
  <li><strong>没完成的承诺：</strong>一件能让整个队伍需要选择的义务。</li>
  <li><strong>边界：</strong>你希望存在、但不想被拿来开玩笑、背刺或反复消耗的家族细节。</li>
</ol>

<p>DM 就能使用这段背景，不用猜你的底线。要给矮人一边补一个氏族名，可以用 <a href="${ZH_DND_DWARF_NAMES_PATH}">DND 矮人名字指南</a>。要决定角色在先攻开始后做什么，可以先看 <a href="${ZH_DND_CLASSES_PATH}">DND 职业说明</a>，再选游侠、牧师、战士、魔械师，或更出人意料的路线。</p>

<h2>参考来源</h2>
<ul>
  <li><a href="${DND_2024_CHARACTER_CREATION_URL}" rel="noreferrer noopener">D&amp;D Beyond 2024 基础规则：创建角色</a></li>
  <li><a href="${DND_2024_CHARACTER_ORIGINS_URL}" rel="noreferrer noopener">D&amp;D Beyond 2024 基础规则：角色起源、Dwarf 与 Elf 特性</a></li>
  <li><a href="${DND_DWELF_HOMEBREW_REFERENCE_URL}" rel="noreferrer noopener">Step into RPGs：dwelf 混血自制规则讨论</a></li>
</ul>
`;
