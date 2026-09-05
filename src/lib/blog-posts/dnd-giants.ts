import {
  DND_GIANTS_2024_RULES_URL,
  DND_GIANTS_BASIC_RULES_URL,
  DND_GIANTS_BATTLEFIELD_IMAGE_PATH,
  DND_GIANTS_VIDEO_PLACEHOLDER_PATH,
  DND_GIANTS_VIDEO_URL,
  EN_DICE_ROLLER_PATH,
  EN_DND_COUNTERSPELL_PATH,
  EN_DND_CLASSES_PATH,
  EN_EDITOR_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_COUNTERSPELL_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_EDITOR_PATH,
  liteVideoEmbed,
} from './shared';

const DND_GIANTS_ORDNING_URL =
  'https://www.dndbeyond.com/posts/1534-giant-personalities-an-infographic-on-the-giantkind-of-the';
const DND_GIANTS_2024_STAT_BLOCKS_URL =
  'https://www.dndbeyond.com/sources/dnd/br-2024/creature-stat-blocks';
const DND_GIANTS_2024_MONSTER_USAGE_URL =
  'https://www.dndbeyond.com/sources/dnd/br-2024/how-to-use-a-monster';
const DND_GIANTS_2024_PLAYING_THE_GAME_URL =
  'https://www.dndbeyond.com/sources/dnd/br-2024/playing-the-game';

export const dndGiantsArticleHtml = String.raw`
<p>A <strong>dnd giants</strong> session usually breaks at the document boundary, not at the monster name. One official page defines a creature type. Another lists six true giant names. A lore article describes a social caste. A stat block then supplies the numbers you actually roll. If those layers collapse into one default package, the table starts arguing about size, status, and damage at the same moment.</p>

<p>Keep three piles visible. Rules text tells you type, size, and which names appear in the current monster list. Setting text tells you how most giants rank one another, and that some refuse that ranking. Encounter method tells you what the giant is doing to a room or a conversation. Only the first pile is a rules fact.</p>

<table>
  <thead>
    <tr>
      <th>Question at the table</th>
      <th>Open this official source</th>
      <th>Do not import from it</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Is Giants a creature type, and which names are true giants?</td>
      <td>2014 Basic Rules monster chapter, Type section</td>
      <td>A ranking article or a remembered CR ladder</td>
    </tr>
    <tr>
      <td>How much map space does Huge occupy?</td>
      <td>2014 Size Categories, or the current Creature Size and Space table</td>
      <td>The visual size of a token border</td>
    </tr>
    <tr>
      <td>Does the current Basic Rules list the six giant entries?</td>
      <td>Current Basic Rules creature stat blocks</td>
      <td>A 2014 lore sentence treated as a 2024 action</td>
    </tr>
    <tr>
      <td>What does Giant mean as a type in the current rules?</td>
      <td>How to Use a Monster, Creature Type</td>
      <td>Player-character species text about goliaths</td>
    </tr>
    <tr>
      <td>Is the Ordning a combat ranking?</td>
      <td>D&amp;D Beyond giantkind Ordning overview</td>
      <td>Hit point totals used as a caste list</td>
    </tr>
  </tbody>
</table>

<p>When a number, size tag, or creature type is in dispute, return to the rules page your table actually uses. When a giant insults another giant, or refuses a request before anyone draws a weapon, return to the Ordning article. When the fight feels like a large humanoid on an empty floor, return to map, objective, and morale. Do not let one of those answers impersonate the other two.</p>

<h2>Creature type is not the same as the six true giants</h2>

<p>The <a href="${DND_GIANTS_BASIC_RULES_URL}" rel="noreferrer noopener">2014 D&amp;D Basic Rules monster chapter</a> lists Giants among the game’s monster types. The types have no rules of their own. Giants tower over humans and their kind and are humanlike in shape, though some have multiple heads, named as ettins, or deformities, named as fomorians. The same paragraph names six varieties of true giant: hill, stone, frost, fire, cloud, and storm giants. Besides those six, creatures such as ogres and trolls are giants.</p>

<p>That is the official 2014 boundary. “Giant” can mean the broader creature type. “True giant” names the six classic varieties. Write the distinction once before the encounter starts, so a type-based feature is not applied to the wrong creature. Humanoid is a different type. A giant can look like a huge person and still not be a Humanoid in the rules sense. Read the type on the stat block in front of you.</p>

<p>The <a href="${DND_GIANTS_2024_MONSTER_USAGE_URL}" rel="noreferrer noopener">current How to Use a Monster page</a> still says creature types have no rules of their own. Its Giants examples are cyclopes, fire giants, and trolls. The 2024 type paragraph does not repeat the 2014 list of six true giant names. That is a documentation split, not a license to merge 2014 lore and a remembered monster list into one creature.</p>

<h2>Huge space is the first map fact</h2>

<p>The 2014 Size Categories table uses a fire giant as a Huge example and gives Huge creatures a 15-by-15-foot space. That is a rules reference for how much space a Huge creature controls in that presentation. It is not an instruction to draw every giant as a perfect square, and it is not a promise that every Giant-type creature is Huge. In the same 2014 table, an ogre is a Large example with a 10-by-10-foot space. Type and size are separate fields. Confirm both on the block you are using.</p>

<p>The <a href="${DND_GIANTS_2024_PLAYING_THE_GAME_URL}" rel="noreferrer noopener">current Playing the Game combat rules</a> print a Creature Size and Space table. Huge still occupies 15 by 15 feet, shown as 9 squares in a 3-by-3 arrangement. A creature’s space is the area it effectively controls in combat. You can pass through an ally, an Incapacitated creature, a Tiny creature, or a creature two sizes larger or smaller than you. Another creature’s space is Difficult Terrain unless that creature is Tiny or your ally. You cannot willingly end a move in a space occupied by another creature.</p>

<p>A Huge giant in a doorway or on a bridge is therefore occupied space and difficult terrain for anyone who tries to squeeze past. Default reach is 5 feet unless a rule says otherwise. Cover is Half, Three-Quarters, or Total. Those facts do not invent a giant’s attack list. They tell you why a 3-by-3 body makes ordinary melee spacing unreliable. If the room is an empty floor, the size rule has nothing to hold onto.</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_GIANTS_BATTLEFIELD_IMAGE_PATH}"
    alt="Stone giant occupying a canyon path while adventurers use rocks and ledges as cover"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Huge space starts to matter when the path, the cover, and the exit are drawn at giant scale.</figcaption>
</figure>

<h2>Current Basic Rules entries stay in their own lane</h2>

<p>The <a href="${DND_GIANTS_2024_STAT_BLOCKS_URL}" rel="noreferrer noopener">current Basic Rules creature stat blocks</a> include Cloud, Fire, Frost, Hill, Stone, and Storm Giant. The same list includes Ettin and Troll, both tagged Giant, and Troll Limb as a Small Giant. Presence on that list does not turn Ettin or Troll into extra true giants of the Ordning. The six named true giants are all Huge Giant. Ettin is Large Giant. Troll is Large Giant. They do not occupy the same footprint.</p>

<p>The current entries also print different movement lines. Cloud Giant lists a fly speed with hover. Storm Giant lists fly with hover and a swim speed. Fire, frost, hill, and stone giants in that list do not carry those extra speeds on the highlighted combat line. Do not paste a fly speed onto a hill giant because another giant has one. Alignment is a default suggestion you may change; the 2014 chapter even allows an evil storm giant. Challenge Rating summarizes threat to four characters and can shift with circumstances. CR is a planning aid. It is not the Ordning.</p>

<p>When the table needs a number, open the current block. This guide does not reprint hit points, armor class, or attack math, because those values live in the stat block and can differ by rules version. The <a href="${DND_GIANTS_2024_RULES_URL}" rel="noreferrer noopener">current Basic Rules hub</a> is the index. The creature-stat-blocks page is the list. The block you open is the authority for that session. If your campaign book or an older printing disagrees, name the source at the table and pick one.</p>

<h2>The Ordning creates insults, not a damage ranking</h2>

<p>The <a href="${DND_GIANTS_ORDNING_URL}" rel="noreferrer noopener">D&amp;D Beyond giantkind overview</a> describes the Ordning as a social caste that most giants follow. In that presentation, the six main kinds are ranked from highest to lowest: storm, cloud, fire, frost, stone, and hill. Other kinds of giants, such as fomorians, are not considered part of the Ordning and are ranked below all of them. The text version of the infographic states a hard social rule: even the lowest-ranked giant of one type surpasses the highest-ranked giant of an inferior type. That sentence is about status among giants who accept the caste. It is not a conversion table for challenge rating, hit points, or weapon damage.</p>

<p>The same official overview says different giant societies value different things inside their own kind. Cloud giants rank themselves based on wealth. Stone giants value artistry and the ability to launch a rock. The infographic also labels storm giants as contemplative prophets, fire giants as fearsome conquerors, frost giants as hardy invaders, and hill giants as hungry hunters. Those labels are social clues, not extra traits for a stat block.</p>

<p>The article also says not all giants follow the Ordning. Reasons vary: a cloud giant may copy stone-giant artistry instead of hoarding wealth, a hill giant may reject a ranking that ignores size, or a giant may leave Annam’s children. You can run a giant who obeys the caste, performs it in public, or has already walked away. Use that friction before initiative. It does not change the printed attack bonus.</p>

<h2>Give each true giant a question the map can answer</h2>

<p>The six true giant names become useful when each one is tied to a question the players can answer with movement, speech, or a change to the room. The questions below are encounter prompts. They borrow official social labels where the Ordning article supplies them. They do not add unlisted spells, unlisted damage figures, or a claim that one type is the correct giant for every table.</p>

<p>A hill giant, in the official infographic, is a hungry hunter who values size and strength. Ask what it is trying to take from a place that still contains people or stores. Put the complexity into panicked animals, a blocked lane, and civilians who need an exit. A stone giant is a secluded craftsperson who values artistry and rock throwing. Ask where the safe heights and falling lines are, and whether the party has any route that challenges those positions. If the giant can throw and the party can only stand in the open, the map is decorating a shooting gallery.</p>

<p>A frost giant is a hardy invader who values physical strength. Give the raiders a destination: a captured guide, a loaded sled, or a pass that must be held. A fire giant is a fearsome conqueror who values crafting skill. Build the room around a process the party can interrupt, such as a gate closing or an alarm waking. A cloud giant is a haughty trickster who values wealth. Start with an invitation or a test, and decide who may speak, which object proves a lie, and which insult changes the terms. The current fly speed also means the host may leave the floor. A storm giant is a contemplative prophet who values solitude. Reserve the appearance for a choice that changes scale, and use the current swim and fly speeds for a shoreline or a place ordinary patrols do not reach.</p>

<h2>Lock map, objective, and morale before initiative</h2>

<p>After type, size, and social label are named, three table controls remain. The map is the physical problem Huge space creates: doors that do not fit, cover that a thrown object can erase, elevations that change who can see whom, and routes that a 3-by-3 body can close. Mark the giant’s occupied squares, the remaining gaps, and at least one piece of cover that is still usable after the first thrown object. If you cannot point to a square that changes because the giant is Huge rather than Medium, the map is not doing its job.</p>

<p>The objective is the non-damage job: rescue, delay, theft of proof, or shutting a machine. It should be visible. Morale is the stop rule. Decide in advance what makes this giant flee, bargain, call help, or fight to the last hit point. A giant who has rejected the Ordning may not care about the status scene you prepared. Write the stop rule in one sentence and keep it.</p>

<ol>
  <li>Lock the rules version and the exact stat block, including size, type, and any special speed.</li>
  <li>Write one job the giant is doing to the room, the route, or the conversation.</li>
  <li>Place occupied space, one usable response route, one visible objective, and one morale line before anyone rolls initiative.</li>
</ol>

<p>Then ask a single quality check: what can this giant do to the room that a Medium enemy cannot do from the same square? If the honest answer is only “deal more damage,” add a physical interaction or an objective. That check does not require a custom monster. It requires the map to notice that the creature is Huge.</p>

<h2>Make the VTT token carry scale</h2>

<p>A Huge giant on a virtual tabletop occupies a 3-by-3 footprint next to Medium characters on 1-by-1 squares. The token has to remain a giant at that displayed size. A detailed face disappears when the token is small. A clear silhouette, a visible weapon, an unusual head shape, or a nearby size cue survives. Crop for recognition beside a character token, not for the tightest portrait.</p>

<ul>
  <li>Compare the giant token against a Medium character token on the actual map grid before the session.</li>
  <li>Keep enough shoulder or weapon shape that a hill giant and a supporting ogre do not collapse into the same portrait.</li>
  <li>Use borders to scan boss and support units; treat color as a helper, not the only cue.</li>
  <li>Do not let wolves or guards steal the boss silhouette.</li>
</ul>

<p>Use the <a href="${EN_EDITOR_PATH}">VTT token maker</a> to frame the artwork for that grid. The maker crops and borders an image. It does not supply a stat block, a challenge rating, or an Ordning rank. If the scene needs repeated checks or damage rolls, keep the <a href="${EN_DICE_ROLLER_PATH}">D&amp;D dice roller</a> nearby. The <a href="${EN_DND_CLASSES_PATH}">DND classes guide</a> and the <a href="${EN_DND_COUNTERSPELL_PATH}">DND Counterspell guide</a> can help the party prepare, but neither one replaces the giant’s current stat block.</p>

<h2>Optional video for staging, not for rulings</h2>

<p>This <a href="${DND_GIANTS_VIDEO_URL}" rel="noreferrer noopener">giant-scale footage</a> is optional staging, not rules text. Watch for how a body fills a pass, how posture reads as status, and how surrounding wreckage makes the creature larger than a token. If a shot disagrees with the 2014 type paragraph, the current size table, or the Ordning article, keep the official page.</p>

${liteVideoEmbed('aM0s_ZFsNr4', 'DND giants staging footage', {
  src: DND_GIANTS_VIDEO_PLACEHOLDER_PATH,
  alt: 'Fantasy giants moving through a storm-lit mountain pass above small travelers',
})}

<section id="faq" class="mt-12 rounded-[34px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
  <h2 class="font-display text-2xl sm:text-3xl text-stone-50" style="margin-top: 0;">FAQ About DND Giants</h2>

  <div class="mt-6 space-y-4">
    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Does “giant” mean the same thing as the six true DND giants?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">No. In the 2014 Basic Rules, Giants is a creature type that includes the six true giants—hill, stone, frost, fire, cloud, and storm—and also includes other giants such as ogres and trolls. Confirm the type on the stat block you are using.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Do 2014 and 2024 Basic Rules treat DND giants the same way?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">They overlap, but they are not one package. The 2014 type paragraph names the six true giants. The current How to Use a Monster page gives different Giant examples, and the current creature list includes Huge entries for those six names. Open the rules version your table is playing.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Does the Ordning tell you which DND giant is strongest in combat?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">No. The official Ordning overview is a social caste. It ranks storm, cloud, fire, frost, stone, and hill for status, and it notes that not every giant accepts the system. Combat numbers come from the stat block, not from that caste list.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">What should you lock before placing a DND giant token on a VTT map?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">Lock the rules version, the size tag, the occupied space, one response route, one visible objective, and one morale line. Then crop the token so the silhouette still reads as a giant next to a Medium character token.</p>
    </article>
  </div>
</section>
`;

export const dndGiantsArticleHtmlZh = String.raw`
<p>把 <strong>dnd giants</strong> 放上桌之前，先分清三份资料各自回答什么。规则页管生物类型、体型标签和当前怪物数据卡。设定页管身份怎么排。桌面方法管这只巨人正在对房间、路线或对话做什么。三件事可以同时出现，但不能互相替代。2014 年的类型段落、当前条目和巨人等级秩序文来源不同：多数巨人遵循等级秩序，不等于这一只必须遵循。</p>

<p>数字、体型或生物类型起争执时，回到这张桌子实际采用的规则页。一只巨人辱骂另一只、或在拔剑前就拒绝请求时，回到巨人等级秩序文。战斗如果只剩空地板上的一个大个子，就回到地图、目标和士气。不要让其中一份答案冒充另外两份。</p>

<h2>2014 和当前规则把巨人类写成了不同的句子</h2>

<p><a href="${DND_GIANTS_BASIC_RULES_URL}" rel="noreferrer noopener">2014 年 D&amp;D 基础规则的怪物章节</a>把巨人类列为怪物类型之一，并写明类型本身没有独立规则。同一段把巨人写成高出人类、外形近似人形；点名双头巨人有多个头，弗莫瑞有畸形。六种经典巨人是丘陵巨人、石巨人、霜巨人、火巨人、云巨人和风暴巨人。食人魔和巨魔也属于巨人类。外形接近人形，也不能把巨人类读成类人。</p>

<p><a href="${DND_GIANTS_2024_MONSTER_USAGE_URL}" rel="noreferrer noopener">当前《如何使用怪物》</a>同样写明类型本身没有规则。它对巨人类的例句换成独眼巨人、火巨人和巨魔，没有在类型段落里重抄六种经典巨人名单。这是文档分家，不能把两套来源揉成一只生物。<a href="${DND_GIANTS_2024_STAT_BLOCKS_URL}" rel="noreferrer noopener">当前生物条目</a>收了云巨人、火巨人、霜巨人、丘陵巨人、石巨人、风暴巨人，也收了双头巨人、巨魔，以及小型巨人类的巨魔肢体。有条目不等于把双头巨人写成巨人等级秩序里的第七种经典巨人。</p>

<table>
  <thead>
    <tr>
      <th>当前条目</th>
      <th>已核验的体型与类型</th>
      <th>开场前要写清的遭遇问题</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>丘陵巨人</td>
      <td>巨型体型，巨人类</td>
      <td>它要从还能救人的地方抢走什么？</td>
    </tr>
    <tr>
      <td>石巨人</td>
      <td>巨型体型，巨人类</td>
      <td>高处、死角和落石线有没有可挑战的路线？</td>
    </tr>
    <tr>
      <td>霜巨人</td>
      <td>巨型体型，巨人类</td>
      <td>掠夺的终点在哪，来不及拦截会发生什么？</td>
    </tr>
    <tr>
      <td>火巨人</td>
      <td>巨型体型，巨人类</td>
      <td>正在进行的工程能不能被切断？</td>
    </tr>
    <tr>
      <td>云巨人</td>
      <td>巨型体型，巨人类，另有飞行与悬停</td>
      <td>留下谈判的理由是什么，哪句话会改条件？</td>
    </tr>
    <tr>
      <td>风暴巨人</td>
      <td>巨型体型，巨人类，另有飞行、悬停和游泳</td>
      <td>这场见面要付出什么代价才能换到一条真相？</td>
    </tr>
  </tbody>
</table>

<p>这张表是开场检查单，不是强度榜。双头巨人和巨魔在当前列表里是大型巨人类，可共享巨人类，却不共享巨型体型的 3×3 占位。先看体型标签。</p>

<h2>占位一变，门、桥和掩体就不是原尺寸</h2>

<p>2014 年的体型分类用火巨人作为巨型体型示例，占 15×15 英尺；食人魔是大型示例，占 10×10 英尺。类型和体型是两套字段。当前 <a href="${DND_GIANTS_2024_PLAYING_THE_GAME_URL}" rel="noreferrer noopener">《进行游戏》战斗规则</a>的体型与空间表仍把巨型体型写成 15×15 英尺、3×3 格。生物空间是它在战斗中实际控制的区域。你可以穿过盟友、失能生物、微型生物，或体型相差两号的生物所占空间；其他生物的空间是困难地形，除非对方是微型或你的盟友。不能自愿在被占据的格子里结束移动。触及范围默认 5 英尺，除非另有规则。掩体等级分为半掩体、四分之三掩体和全掩体。</p>

<p>门口或桥上的巨型巨人，对想挤过去的人同时是占位和困难地形。这能说明为什么 3×3 的身体会让普通近战站位失效。房间如果只是空地板，体型规则就没有可抓的东西。当前条目里云巨人带飞行和悬停，风暴巨人带飞行、悬停和游泳；火巨人、霜巨人、丘陵巨人、石巨人的高亮战斗行没有这些速度。不要把飞行抄到丘陵巨人身上。数值以当前怪物数据卡为准，本文不转抄会随版本变化的生命值、护甲等级或攻击数字。<a href="${DND_GIANTS_2024_RULES_URL}" rel="noreferrer noopener">当前 D&amp;D 基础规则目录</a>只作索引。</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_GIANTS_BATTLEFIELD_IMAGE_PATH}"
    alt="峡谷小道被石巨人的占位封住，冒险者改用岩石与岩架作掩体"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>通道、掩体和出口按巨人尺度画出来之后，巨型占位才会开始改变选择。</figcaption>
</figure>

<h2>巨人等级秩序管称呼，不管伤害</h2>

<p><a href="${DND_GIANTS_ORDNING_URL}" rel="noreferrer noopener">D&amp;D Beyond 的巨人设定文</a>把巨人等级秩序写成多数巨人遵循的社会等级，从高到低是风暴巨人、云巨人、火巨人、霜巨人、石巨人、丘陵巨人。弗莫瑞不算这套等级的一部分，并排在所有等级之下。某一类里最低的个体，仍高于下一类里最高的个体。这是互称规则，不是伤害、生命值或挑战等级的换算表。云巨人按财富排，石巨人看重技艺和投石。官方图还把风暴巨人标成独处的预言者，火巨人标成可怕的征服者，霜巨人标成耐寒的入侵者，丘陵巨人标成饥饿的猎手。这些是社会线索，不是隐藏特性。</p>

<p>不是所有巨人都遵循巨人等级秩序。云巨人可能去学石巨人的技艺而不是囤财富，丘陵巨人可能拒绝不考虑体型的标准，也有巨人离开安南的子嗣。身份冲突可以发生在动手前，仍不会改写攻击加值。阵营是默认扮演建议，可以按故事改；2014 年甚至允许邪恶风暴巨人。挑战等级是对四名角色威胁的摘要，会随情况改变，只是规划辅助，不是巨人等级秩序。</p>

<h2>先写房间里的事，再写巨人的名字</h2>

<p>表里的六种问题，是让经典巨人的名字对应一件玩家能用移动或对话回答的事。它们借用官方社会标签，不追加未列出的法术或伤害数字。丘陵巨人先写它要从还能救人的粮仓或车道拿走什么。石巨人先写高处归谁、有没有可挑战的路线。霜巨人先写掠夺终点。火巨人先写哪项工程能被切断。云巨人先写留下谈判的理由和哪句话会改条件。风暴巨人先写换一条真相要付什么代价；官方标签是独处的预言者，不要把这场戏放进没有选择的走廊。</p>

<h2>占位、目标、停手，三句都要在先攻前写完</h2>

<p>地图要标出巨型占位、剩下的缝，以及一块第一次投掷后仍能用的掩体。指不出哪一格因巨型体型、而不是中型才变化，地图就还没工作。目标必须看得见：救人、夺走证据、关掉装置或守住通道。士气是停手规则，写成一句：何时逃跑、谈判、求援或打完。拒绝巨人等级秩序的巨人，可能不在乎你准备的身份场面。</p>

<ol>
  <li>先锁定规则版本和当前怪物数据卡，包括体型、类型和额外速度。</li>
  <li>再写一句这只巨人对房间、路线或对话正在做的事。</li>
  <li>最后在掷先攻之前放好占位、一条可回应路线、一个可见目标，以及一条士气规则。</li>
</ol>

<p>然后问一句：这只巨人能对房间做什么，一只站在同一格的中型敌人做不到？如果只有“打得更疼”，就补一个物理互动或目标。</p>

<h2>棋子要在 3×3 格子上仍能被认出来</h2>

<p>虚拟桌面上巨型体型占 3×3，中型占 1×1。棋子必须在这个尺寸下仍像巨人。轮廓、武器和头型比脸部细节更稳。裁切目标是放在角色棋子旁边仍能认出来。</p>

<ul>
  <li>开场前把巨人棋子和中型角色棋子放到实际网格上。</li>
  <li>保留肩线或武器轮廓，避免和随从收成同一张圆脸。</li>
  <li>边框区分首领和支援，颜色只作辅助。</li>
  <li>狼和守卫要降噪，不要抢走首领轮廓。</li>
</ul>

<p>用 <a href="${ZH_EDITOR_PATH}">Token Maker</a> 给巨人棋子处理构图和边框。它裁图像、加边框，不提供怪物数据卡、挑战等级或巨人等级秩序名次。需要掷骰时把 <a href="${ZH_DICE_ROLLER_PATH}">D&amp;D 骰子工具</a> 放在旁边。<a href="${ZH_DND_CLASSES_PATH}">D&amp;D 职业指南</a> 和 <a href="${ZH_DND_COUNTERSPELL_PATH}">法术反制指南</a> 可作队伍准备，不能代替当前怪物数据卡。</p>

<h2>影像只用来看场面，不用来裁定</h2>

<p>这段 <a href="${DND_GIANTS_VIDEO_URL}" rel="noreferrer noopener">巨人尺度影像</a> 只看场面：身体如何填满隘口、姿态如何读成身份。它不是规则页。画面若与官方类型、体型表或巨人等级秩序文冲突，留下官方页。</p>

${liteVideoEmbed('aM0s_ZFsNr4', '巨人场面参考影像', {
  src: DND_GIANTS_VIDEO_PLACEHOLDER_PATH,
  alt: '暴风山道中，奇幻巨人从小型旅行者上方穿过隘口',
})}

<section id="faq" class="mt-12 rounded-[34px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
  <h2 class="font-display text-2xl sm:text-3xl text-stone-50" style="margin-top: 0;">巨人常见问题</h2>

  <div class="mt-6 space-y-4">
    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">2014 年的巨人类和六种经典巨人是一回事吗？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">不是。2014 年 D&amp;D 基础规则把巨人类写成生物类型，六种经典巨人是丘陵巨人、石巨人、霜巨人、火巨人、云巨人和风暴巨人；食人魔和巨魔也可以落在这个类型里。具体仍以当前怪物数据卡的类型字段为准。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">当前基础规则里六种巨人的体型标签是什么？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">当前条目里丘陵巨人、石巨人、霜巨人、火巨人、云巨人和风暴巨人都是巨型体型的巨人类。双头巨人和巨魔是大型巨人类。巨型体型在当前战斗规则里占 15×15 英尺，也就是 3×3 格。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">不接受巨人等级秩序的巨人还能用吗？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">能。官方设定文写明不是所有巨人都遵循巨人等级秩序，理由可以不同。社会等级能解释场面，不能改写怪物数据卡上的数值。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">地图、目标和士气哪一项要先写？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">先锁定规则版本和怪物数据卡，再写巨人对房间、路线或对话正在做的事，最后在先攻之前放好占位、可回应路线、可见目标和士气规则。棋子只负责让 3×3 的轮廓在地图上仍能被认出来。</p>
    </article>
  </div>
</section>
`;
