import {
  DND_GIANTS_2024_RULES_URL,
  DND_GIANTS_BASIC_RULES_URL,
  DND_GIANTS_BATTLEFIELD_IMAGE_PATH,
  DND_GIANTS_VIDEO_PLACEHOLDER_PATH,
  DND_GIANTS_VIDEO_URL,
  DND_GIANTS_WIKIPEDIA_URL,
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

export const dndGiantsArticleHtml = String.raw`
<p>When you are preparing <strong>dnd giants</strong>, the most useful starting point is usually practical: which giants exist, how dangerous they feel at the table, and how to run them without turning combat into a slow bag of hit points. This guide gives you the quick table up front, then moves into encounter use, lore, VTT token advice, and a video follow-up.</p>

<p><strong>Short version:</strong> <strong>dnd giants</strong> work best when you treat them as terrain-changing bosses, not oversized humanoids. The fun comes from thrown rocks, reach, social rank, huge environments, and the panic players feel when the battlefield itself stops feeling human-sized.</p>

<table>
  <thead>
    <tr>
      <th>Giant type</th>
      <th>Fast table identity</th>
      <th>Best encounter use</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Hill giant</strong></td>
      <td>Brutal, hungry, simple, physically overwhelming</td>
      <td>Low-complexity boss, village threat, early giant arc</td>
    </tr>
    <tr>
      <td><strong>Stone giant</strong></td>
      <td>Quiet, artistic, cave-dwelling, rock-throwing specialist</td>
      <td>Canyon ambush, underground guardian, vertical map fight</td>
    </tr>
    <tr>
      <td><strong>Frost giant</strong></td>
      <td>Raider culture, cold brutality, martial pride</td>
      <td>Warband leader, frozen fortress, survival pressure</td>
    </tr>
    <tr>
      <td><strong>Fire giant</strong></td>
      <td>Militarized smith, armor, discipline, siege energy</td>
      <td>Forge dungeon, fortress assault, organized heavy infantry</td>
    </tr>
    <tr>
      <td><strong>Cloud giant</strong></td>
      <td>Wealthy, magical, political, morally flexible</td>
      <td>Social intrigue, flying castle, high-status patron or villain</td>
    </tr>
    <tr>
      <td><strong>Storm giant</strong></td>
      <td>Ancient, prophetic, oceanic, near-mythic</td>
      <td>Late-campaign ally, world-shaking omen, legendary boss</td>
    </tr>
  </tbody>
</table>

<p>If you need a fast comparison of <strong>dnd giants</strong>, start with the reference table above, then use the lore and encounter notes below to decide how each giant should feel at the table.</p>

<h2>What Are DND Giants?</h2>
<p><strong>DND giants are Huge humanoid monsters in Dungeons &amp; Dragons, usually organized into distinct types such as hill, stone, frost, fire, cloud, and storm giants.</strong></p>

<p>The official rules give each giant type its own stat block, combat rhythm, and flavor. For rules lookup, start with the <a href="${DND_GIANTS_BASIC_RULES_URL}" rel="noreferrer noopener">D&amp;D Basic Rules monster stat blocks on D&amp;D Beyond</a>. For broader publication history, the <a href="${DND_GIANTS_WIKIPEDIA_URL}" rel="noreferrer noopener">Dungeons &amp; Dragons giant overview on Wikipedia</a> is useful background.</p>

<p>In actual play, I do not think of giants as "big orcs." That makes them flat. I think of <strong>dnd giants</strong> as walking encounter architecture: they change cover, distance, doors, bridges, ceilings, food supplies, and negotiation stakes.</p>

<h2>DND Giants Quick Ranking by Table Feel</h2>
<p>The best <strong>dnd giants</strong> for your session depend less on raw challenge rating and more on what kind of pressure you want players to feel.</p>

<table>
  <thead>
    <tr>
      <th>Goal</th>
      <th>Best giant pick</th>
      <th>Why it works</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Simple scary combat</strong></td>
      <td>Hill giant</td>
      <td>Easy to run, easy to understand, instantly threatening to low-level parties.</td>
    </tr>
    <tr>
      <td><strong>Smart terrain fight</strong></td>
      <td>Stone giant</td>
      <td>Rock throwing, caves, cliffs, and cover make the whole map matter.</td>
    </tr>
    <tr>
      <td><strong>Warband pressure</strong></td>
      <td>Frost giant</td>
      <td>Feels like a raiding culture, not a random monster encounter.</td>
    </tr>
    <tr>
      <td><strong>Dungeon faction</strong></td>
      <td>Fire giant</td>
      <td>Armor, craft, hierarchy, and forge spaces create a strong dungeon identity.</td>
    </tr>
    <tr>
      <td><strong>Social game</strong></td>
      <td>Cloud giant</td>
      <td>They can bargain, lie, host, collect, threaten, and still crush the party.</td>
    </tr>
    <tr>
      <td><strong>Mythic scale</strong></td>
      <td>Storm giant</td>
      <td>Best saved for prophecy, ancient grudges, sea storms, and late-game awe.</td>
    </tr>
  </tbody>
</table>

<h2>How Strong Are DND Giants in 5e?</h2>
<p><strong>DND giants are dangerous because they combine huge damage, long reach, thrown rocks, and enough hit points to punish sloppy positioning.</strong></p>

<p>The trap is running them like stationary brutes. If a giant stands still and trades attacks, the fight becomes predictable. In our games, giants become memorable when they keep changing the physical problem: breaking stairs, throwing carts, knocking down trees, reaching over barricades, or forcing ranged characters to move.</p>

<ul>
  <li><strong>Reach matters:</strong> players who are used to normal melee spacing suddenly misjudge danger zones.</li>
  <li><strong>Thrown rocks matter:</strong> backline characters are not automatically safe.</li>
  <li><strong>Huge size matters:</strong> doors, bridges, ladders, and rooms stop being neutral scenery.</li>
  <li><strong>Morale matters:</strong> intelligent giants should retreat, bargain, call allies, or use hostages when losing.</li>
</ul>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_GIANTS_BATTLEFIELD_IMAGE_PATH}"
    alt="DND giants encounter scene showing a stone giant throwing rocks across a canyon battlefield while small adventurers use cover"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Good dnd giants encounters are won or lost on spacing. If the map is flat and empty, you are wasting the monster.</figcaption>
</figure>

<h2>Best Ways to Use Each DND Giant Type</h2>
<p>The easiest way to make <strong>dnd giants</strong> feel different is to give each type a different relationship to space, status, and violence.</p>

<h3>Hill giants: make them simple, not stupid to run</h3>
<p>Hill giants are best when the table immediately understands the threat. They are hungry, loud, destructive, and direct.</p>

<p>My favorite hill giant setup is not "one giant in a field." It is a farm road with panicking animals, smashed wagons, a collapsing barn, and a giant using anything nearby as a club. The monster is simple, but the scene is busy.</p>

<h3>Stone giants: use height, darkness, and thrown rocks</h3>
<p>Stone giants should feel like the map belongs to them. Caves, cliffs, echoing chambers, and broken ledges make them much more interesting.</p>

<p>When I run stone giants, I mark two or three elevated rock positions before the fight starts. That one prep step makes their ranged pressure feel intentional instead of improvised.</p>

<h3>Frost giants: make the raid feel organized</h3>
<p>Frost giants are at their best when they arrive with a purpose. They are not just cold-themed bags of damage; they are raiders, trophy-takers, and leaders of brutal expeditions.</p>

<p>Give them scouts, a captured guide, sledges, winter wolves, or a visible prize they are trying to steal. Now the encounter has direction.</p>

<h3>Fire giants: build the dungeon around craft and command</h3>
<p>Fire giants work beautifully as fortress or forge villains. Their spaces should feel hot, industrial, guarded, and hard to approach quietly.</p>

<p>Use narrow gantries, chains, anvils, molten channels, alarm gongs, and disciplined patrols. A fire giant should make the party feel under-equipped and poorly dressed for the room.</p>

<h3>Cloud giants: turn them into patrons, rivals, or social threats</h3>
<p>Cloud giants are the best <strong>dnd giants</strong> for players who like negotiation. They can be vain, generous, cruel, curious, or all four before breakfast.</p>

<p>A cloud giant encounter does not need to start with initiative. A dinner invitation in a floating palace can be more frightening than a surprise attack, because the party knows the host could kill them but keeps smiling.</p>

<h3>Storm giants: save them for awe</h3>
<p>Storm giants lose impact if they show up as ordinary random encounters. They are better as oracles, ancient rulers, oceanic powers, or the last person who remembers why a war began.</p>

<p>When I use a storm giant, I usually put the first clue before the giant appears: impossible lightning, a whale carcass carved with runes, a tide that arrives at the wrong hour, or sailors refusing to say a name out loud.</p>

<h2>Encounter Design Checklist for DND Giants</h2>
<p>A good <strong>dnd giants</strong> encounter needs scale cues, vertical choices, ranged pressure, and a reason the giant is there.</p>

<ul>
  <li><strong>Add three scale cues:</strong> giant doors, human-sized wreckage, massive footprints, oversized tools, or boulders stacked like ammunition.</li>
  <li><strong>Give the giant a job:</strong> guarding, raiding, building, hunting, negotiating, searching, or punishing.</li>
  <li><strong>Place cover deliberately:</strong> rocks and pillars should help players survive without making the giant helpless.</li>
  <li><strong>Use forced movement sparingly:</strong> one shove into danger is exciting; repeated no-choice punishment gets old fast.</li>
  <li><strong>Plan morale:</strong> decide before combat whether the giant fights to the death, flees, bargains, or calls a superior.</li>
</ul>

<section class="mt-10 rounded-[30px] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
  <h3 class="font-display text-2xl text-stone-50" style="margin-top: 0;">My Practical DM Rule</h3>
  <p class="mt-3 text-[0.98rem] leading-8 text-stone-300">Before I put <strong>dnd giants</strong> on a map, I write one sentence: "What can this giant do to the room that a normal monster cannot?" If I cannot answer that, I redesign the encounter before touching the stat block.</p>
</section>

<h2>DND Giants Lore: What Is the Ordning?</h2>
<p><strong>The Ordning is the traditional giant social hierarchy that ranks giant types and individuals by status, strength, craft, omens, wealth, or other values.</strong></p>

<p>You do not need a lecture on giant politics to use it well. At the table, the Ordning is useful because it gives giants reasons to compete, obey, resent, and scheme. A hill giant may fear a frost giant. A fire giant may look down on both. A cloud giant may smile while quietly treating everyone like pieces in a private game.</p>

<p>The 2024 rules ecosystem keeps changing how players discover monsters and lore, so I would use the current <a href="${DND_GIANTS_2024_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond rules hub</a> for present-day official material and your campaign book for setting-specific details.</p>

<h2>How to Make DND Giants Tokens for VTT Play</h2>
<p>A strong <strong>dnd giants</strong> token must read as huge at small size. The face matters, but silhouette and scale matter more.</p>

<p>For Roll20, Foundry, Owlbear Rodeo, or any virtual tabletop, I usually crop giant art less tightly than player portraits. Show shoulders, weapon, hand size, or a nearby scale object. If every token is just a face in a circle, the giant stops feeling huge.</p>

<ul>
  <li><strong>Use thicker borders:</strong> giant tokens often sit under spell effects and need to stay readable.</li>
  <li><strong>Keep the weapon visible:</strong> axe, hammer, boulder, chain, or spear instantly tells players what danger to expect.</li>
  <li><strong>Differentiate giant types by color:</strong> cold blues, forge reds, stone grays, cloud golds, storm blue-black accents.</li>
  <li><strong>Export large boss tokens at 1024px:</strong> especially if you scale them up on a VTT grid.</li>
  <li><strong>Make minion tokens simpler:</strong> ogres, wolves, cultists, or servants should not visually compete with the giant.</li>
</ul>

<p>You can make those tokens in the <a href="${EN_EDITOR_PATH}">VTT token maker</a>. If the encounter includes rock throws, fall damage, or concentration saves, keep the <a href="${EN_DICE_ROLLER_PATH}">D&amp;D dice roller</a> open beside it. For party role coverage before a giant arc, the <a href="${EN_DND_CLASSES_PATH}">DND classes guide</a> is a useful planning companion. For reaction timing at a caster-heavy table, see the <a href="${EN_DND_COUNTERSPELL_PATH}">dnd counterspell guide</a>.</p>

<h2>Common Mistakes With DND Giants</h2>
<p>The most common mistake with <strong>dnd giants</strong> is making them physically big but tactically small.</p>

<ul>
  <li><strong>Mistake 1:</strong> using an empty map where the giant only walks forward and attacks.</li>
  <li><strong>Mistake 2:</strong> forgetting thrown rocks, reach, cover destruction, and morale.</li>
  <li><strong>Mistake 3:</strong> running every giant type with the same personality.</li>
  <li><strong>Mistake 4:</strong> placing low-level characters in a no-cover arena against rock-throwing giants.</li>
  <li><strong>Mistake 5:</strong> treating giant lore as trivia instead of using it to create conflict.</li>
</ul>

<h2>Video: DND Giants Companion Watch</h2>
<p>The companion video is the <a href="${DND_GIANTS_VIDEO_URL}" rel="noreferrer noopener">DND giants companion video on YouTube</a>. I use it as a tone companion rather than a replacement for rules text: watch for the way giants are framed as scale, personality, and table spectacle. That is the right lens for building better <strong>dnd giants</strong> encounters.</p>

${liteVideoEmbed('aM0s_ZFsNr4', 'DND giants video companion', {
  src: DND_GIANTS_VIDEO_PLACEHOLDER_PATH,
  alt: 'DND giants video cover showing multiple fantasy giants in a stormy mountain pass',
})}

<section class="mt-12 rounded-[34px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
  <h2 class="font-display text-2xl sm:text-3xl text-stone-50" style="margin-top: 0;">FAQ About DND Giants</h2>

  <div class="mt-6 space-y-4">
    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">What are the main DND giants?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">The main <strong>dnd giants</strong> most players recognize are hill giants, stone giants, frost giants, fire giants, cloud giants, and storm giants.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Are DND giants humanoids?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">In 5e, many classic <strong>dnd giants</strong> are Huge giants rather than ordinary humanoids. Always check the exact stat block your table is using.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Which DND giant is best for a first giant encounter?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">A hill giant is usually the easiest first choice because its threat is clear and its tactics are simple. A stone giant is better if you want a more tactical terrain fight.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">How do you make DND giants feel bigger in combat?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">Use scale cues, vertical terrain, thrown objects, destructible cover, and objectives beyond damage. A giant should change the room, not just occupy more squares.</p>
    </article>
  </div>
</section>
`;

export const dndGiantsArticleHtmlZh = String.raw`
<p>跑 <strong>dnd giants</strong> 时，真正需要先想清楚的不是设定史，而是：DND 里有哪些巨人、它们在桌上分别怎么用、怎样才能把巨人战斗跑得有压迫感而不是单纯磨血。这篇会先给速查表，再讲遭遇设计、设定用法、VTT Token 和视频补充。</p>

<p><strong>一句话结论：</strong><strong>dnd giants</strong> 最好不要当成“放大版人形怪”来跑。它们真正好玩的地方，是投石、触及、巨型场景、社会等级，以及玩家突然意识到“这个地图不是按人类尺寸设计的”。</p>

<table>
  <thead>
    <tr>
      <th>巨人类型</th>
      <th>桌面定位</th>
      <th>最适合的遭遇用途</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Hill giant</strong></td>
      <td>野蛮、饥饿、简单、压迫感直接</td>
      <td>早期 Boss、村庄威胁、巨人篇章开场</td>
    </tr>
    <tr>
      <td><strong>Stone giant</strong></td>
      <td>安静、洞穴、艺术感、投石专家</td>
      <td>峡谷伏击、地下守卫、立体地形战</td>
    </tr>
    <tr>
      <td><strong>Frost giant</strong></td>
      <td>掠夺者、寒地战士、武力荣誉</td>
      <td>战团首领、冰原要塞、生存压力</td>
    </tr>
    <tr>
      <td><strong>Fire giant</strong></td>
      <td>军纪、锻造、重甲、攻城气质</td>
      <td>熔炉地城、堡垒突袭、有组织重装敌人</td>
    </tr>
    <tr>
      <td><strong>Cloud giant</strong></td>
      <td>富有、魔法、政治、道德弹性大</td>
      <td>社交博弈、云上城堡、危险赞助人或反派</td>
    </tr>
    <tr>
      <td><strong>Storm giant</strong></td>
      <td>古老、预言、海洋、接近神话</td>
      <td>后期盟友、世界级征兆、传奇 Boss</td>
    </tr>
  </tbody>
</table>

<p>先看表格可以快速选怪；等确定了桌面定位，再往下读设定和遭遇设计，会更容易把巨人放进一场真正有重量的战斗里。</p>

<h2>DND Giants 是什么？</h2>
<p><strong>DND giants 是《龙与地下城》中的巨型怪物类别，常见类型包括 hill、stone、frost、fire、cloud 和 storm giants。</strong></p>

<p>具体规则还是要看你桌使用的 stat block。查规则时可以从 <a href="${DND_GIANTS_BASIC_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond 的 Basic Rules 怪物数据</a> 开始；如果想看更宽泛的出版背景，<a href="${DND_GIANTS_WIKIPEDIA_URL}" rel="noreferrer noopener">Wikipedia 上的 Dungeons &amp; Dragons giant 条目</a> 可以当补充。</p>

<p>在我的跑团经验里，巨人最忌讳被当成“大号兽人”。那样会很扁。更好用的理解是：<strong>dnd giants</strong> 是会移动的遭遇地形。它们改变掩体、距离、门、桥、天花板、补给和谈判筹码。</p>

<h2>DND Giants 按桌面体验怎么选？</h2>
<p>选择哪种 <strong>dnd giants</strong>，重点不是只看 CR，而是看你想给玩家什么压力。</p>

<table>
  <thead>
    <tr>
      <th>你的目标</th>
      <th>推荐巨人</th>
      <th>原因</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>简单直接的恐惧感</strong></td>
      <td>Hill giant</td>
      <td>好跑、好懂，低等级队伍会立刻感到危险。</td>
    </tr>
    <tr>
      <td><strong>有战术含量的地形战</strong></td>
      <td>Stone giant</td>
      <td>投石、洞穴、峭壁和掩体会让整张地图都变重要。</td>
    </tr>
    <tr>
      <td><strong>掠夺战团压力</strong></td>
      <td>Frost giant</td>
      <td>更像一个有目标的袭击文化，而不是随机怪。</td>
    </tr>
    <tr>
      <td><strong>地城势力</strong></td>
      <td>Fire giant</td>
      <td>重甲、锻造、阶级和熔炉空间能撑起整座地城。</td>
    </tr>
    <tr>
      <td><strong>社交博弈</strong></td>
      <td>Cloud giant</td>
      <td>可以宴请、撒谎、交易、威胁，而且仍然能一拳拍碎角色。</td>
    </tr>
    <tr>
      <td><strong>神话尺度</strong></td>
      <td>Storm giant</td>
      <td>适合预言、古老恩怨、海上风暴和后期敬畏感。</td>
    </tr>
  </tbody>
</table>

<h2>DND Giants 在 5e 里强在哪里？</h2>
<p><strong>DND giants 的危险来自高伤害、长触及、投石能力，以及足够惩罚错误站位的生命值。</strong></p>

<p>真正的坑，是让它们站在原地和玩家互相平 A。这样巨人会变得很无聊。我更喜欢让巨人持续改变物理问题：砸断楼梯、扔马车、推倒树、越过路障攻击，或者逼远程角色换位置。</p>

<ul>
  <li><strong>触及很重要：</strong>习惯普通近战距离的玩家，会突然误判危险范围。</li>
  <li><strong>投石很重要：</strong>后排角色不是天然安全。</li>
  <li><strong>Huge 体型很重要：</strong>门、桥、梯子和房间都不再是中性背景。</li>
  <li><strong>士气很重要：</strong>聪明巨人会撤退、谈判、叫援军，或者用人质改变局面。</li>
</ul>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_GIANTS_BATTLEFIELD_IMAGE_PATH}"
    alt="DND giants 遭遇图，石巨人在峡谷战场投掷巨石，小型冒险者正在利用掩体移动"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>好玩的 dnd giants 遭遇，胜负往往在站位和掩体上。地图如果又平又空，巨人的价值会被浪费。</figcaption>
</figure>

<h2>每种 DND Giant 怎么用最好？</h2>
<p>想让 <strong>dnd giants</strong> 不同类型真的有差异，就要让它们和空间、地位、暴力方式产生不同关系。</p>

<h3>Hill giants：简单，但不要把遭遇跑得无聊</h3>
<p>Hill giant 最适合制造直接威胁。它们饥饿、吵闹、破坏力强，玩家一眼就懂。</p>

<p>我更喜欢的开场不是“一只巨人在空地上”。而是一条农场路、受惊牲畜、被砸碎的货车、快塌的谷仓，以及巨人随手抓东西当武器。怪物简单，但场面不单调。</p>

<h3>Stone giants：一定要用高度、黑暗和投石</h3>
<p>Stone giant 应该让玩家感觉“这里是它的主场”。洞穴、悬崖、回音大厅和断裂平台都很好用。</p>

<p>我跑 stone giant 前会先标出两三个高处投石点。这个准备很小，但会让巨人的远程压迫显得有设计，而不是临场乱扔。</p>

<h3>Frost giants：让掠夺行动有目标</h3>
<p>Frost giant 最好带着明确目的出现。它们不是冰皮肤伤害包，而是袭击者、战利品收集者和粗暴远征队的核心。</p>

<p>给它们侦察兵、被抓向导、雪橇、冬狼，或者一个正在抢夺的奖品。遭遇马上就有方向。</p>

<h3>Fire giants：围绕锻造和军纪设计地城</h3>
<p>Fire giant 很适合做堡垒或熔炉反派。它们的空间应该热、工业化、戒备森严，而且很难潜入。</p>

<p>窄栈道、铁链、铁砧、熔流、警钟和纪律化巡逻都很适合。玩家走进 fire giant 的房间时，应该觉得自己装备太轻、衣服也穿错了地方。</p>

<h3>Cloud giants：把它们变成赞助人、对手或社交威胁</h3>
<p>Cloud giant 是最适合社交戏的 <strong>dnd giants</strong>。它们可以虚荣、慷慨、残忍、好奇，而且这些特质可以同时存在。</p>

<p>Cloud giant 遭遇不一定要从先攻开始。云上宫殿的一场晚宴，可能比突袭更吓人，因为玩家知道主人能杀掉他们，但主人还在微笑。</p>

<h3>Storm giants：留给敬畏感</h3>
<p>Storm giant 如果当普通随机遭遇用，冲击力会掉得很快。它们更适合作为先知、古老统治者、海洋力量，或者最后一个记得战争起因的人。</p>

<p>我使用 storm giant 时，通常会先放线索：不合时宜的闪电、刻着符文的鲸尸、不该出现的潮汐，或者水手拒绝说出口的名字。</p>

<h2>DND Giants 遭遇设计清单</h2>
<p>好用的 <strong>dnd giants</strong> 遭遇，需要尺度提示、立体选择、远程压力，以及巨人出现在这里的理由。</p>

<ul>
  <li><strong>放三个尺度提示：</strong>巨门、人类尺寸的残骸、巨大脚印、超大工具、堆成弹药的巨石。</li>
  <li><strong>给巨人一个任务：</strong>守卫、掠夺、建造、狩猎、谈判、搜索或惩罚。</li>
  <li><strong>有意识地放掩体：</strong>石柱和巨岩要能救玩家，但不能让巨人完全没办法。</li>
  <li><strong>谨慎使用强制位移：</strong>一次推入危险很刺激，反复让玩家没选择会烦。</li>
  <li><strong>提前想好士气：</strong>巨人是死战、逃跑、谈判，还是叫更高级的巨人来？先定好。</li>
</ul>

<section class="mt-10 rounded-[30px] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
  <h3 class="font-display text-2xl text-stone-50" style="margin-top: 0;">我的 DM 经验规则</h3>
  <p class="mt-3 text-[0.98rem] leading-8 text-stone-300">在我把 <strong>dnd giants</strong> 放进地图前，我会先写一句话：“这个巨人能对房间做什么普通怪物做不到的事？”如果答不上来，我会先改遭遇，再看 stat block。</p>
</section>

<h2>DND Giants 设定：Ordning 是什么？</h2>
<p><strong>Ordning 是巨人的传统社会等级秩序，会按照地位、力量、工艺、预兆、财富或其他价值来区分巨人。</strong></p>

<p>你不需要在桌上讲一大段巨人政治课。Ordning 真正好用的地方，是给巨人制造竞争、服从、怨恨和阴谋的理由。Hill giant 可能害怕 frost giant；fire giant 可能看不起两者；cloud giant 可能一边微笑一边把所有人当成棋子。</p>

<p>如果你要查当下官方资料，可以从 <a href="${DND_GIANTS_2024_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond 2024 规则入口</a> 开始，再结合你使用的战役书处理具体设定。</p>

<h2>如何为 DND Giants 制作 VTT Token？</h2>
<p>好的 <strong>dnd giants</strong> Token 必须在缩小后仍然看得出“巨大”。脸重要，但轮廓和尺度更重要。</p>

<p>在 Roll20、Foundry、Owlbear Rodeo 这类虚拟桌面里，我通常不会像玩家头像那样裁得特别紧。巨人 Token 最好露出肩膀、武器、手掌大小，或者旁边的尺度参照物。每个 Token 如果都只是圆框大头，巨人就不巨了。</p>

<ul>
  <li><strong>边框厚一点：</strong>大型 Boss Token 经常被法术效果盖住，需要更清晰。</li>
  <li><strong>保留武器：</strong>斧、锤、巨石、锁链或长矛，会立刻告诉玩家危险来源。</li>
  <li><strong>用颜色区分类型：</strong>冰蓝、熔炉红、岩灰、云金、风暴蓝黑都很好辨认。</li>
  <li><strong>Boss Token 导出 1024px：</strong>在 VTT 网格上放大时更稳。</li>
  <li><strong>杂兵 Token 简化：</strong>食人魔、狼、邪教徒或仆从不要抢巨人的视觉主位。</li>
</ul>

<p>你可以直接在 <a href="${ZH_EDITOR_PATH}">VTT Token 制作工具</a> 里做这些 Token。如果遭遇里有投石、坠落伤害或专注检定，把 <a href="${ZH_DICE_ROLLER_PATH}">D&amp;D 骰子工具</a> 放旁边会省很多时间。巨人篇章前如果要检查队伍分工，可以顺手看 <a href="${ZH_DND_CLASSES_PATH}">DND 职业指南</a>；如果队伍里有很多施法者，也可以参考 <a href="${ZH_DND_COUNTERSPELL_PATH}">dnd counterspell 指南</a>。</p>

<h2>DND Giants 常见错误</h2>
<p>使用 <strong>dnd giants</strong> 最常见的错误，是让它们体型很大，但战术上很小。</p>

<ul>
  <li><strong>错误 1：</strong>地图空荡荡，巨人只能向前走然后攻击。</li>
  <li><strong>错误 2：</strong>忘记投石、触及、破坏掩体和士气。</li>
  <li><strong>错误 3：</strong>所有巨人类型都用同一种性格来演。</li>
  <li><strong>错误 4：</strong>让低等级角色在无掩体竞技场里面对投石巨人。</li>
  <li><strong>错误 5：</strong>把巨人设定当冷知识，而不是拿来制造冲突。</li>
</ul>

<h2>视频：DND Giants 补充观看</h2>
<p>这条 <strong>dnd giants</strong> 视频可以在 <a href="${DND_GIANTS_VIDEO_URL}" rel="noreferrer noopener">YouTube 这里</a>观看。把它当成氛围和思路补充，而不是规则文本替代：重点看它如何把巨人处理成尺度、个性和桌面 spectacle。这正是设计巨人遭遇时最该抓住的角度。</p>

${liteVideoEmbed('aM0s_ZFsNr4', 'DND giants video companion', {
  src: DND_GIANTS_VIDEO_PLACEHOLDER_PATH,
  alt: 'DND giants 视频封面，暴风山道中多种奇幻巨人正在靠近',
})}

<section class="mt-12 rounded-[34px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
  <h2 class="font-display text-2xl sm:text-3xl text-stone-50" style="margin-top: 0;">DND Giants FAQ</h2>

  <div class="mt-6 space-y-4">
    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">DND giants 主要有哪些？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">最常见的 <strong>dnd giants</strong> 包括 hill giant、stone giant、frost giant、fire giant、cloud giant 和 storm giant。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">DND giants 算 humanoid 吗？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">在 5e 中，许多经典 <strong>dnd giants</strong> 使用的是 giant 类型，而不是普通 humanoid。具体仍要看你桌使用的 stat block。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">第一次巨人遭遇用哪种 DND giant 最好？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">Hill giant 通常最适合作为第一次巨人遭遇，因为威胁清晰、跑法简单。如果你想要更强的地形战术感，stone giant 更合适。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">怎样让 DND giants 在战斗里更有巨大感？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">使用尺度参照、立体地形、投掷物、可破坏掩体和非伤害目标。巨人应该改变房间，而不是只占更多格子。</p>
    </article>
  </div>
</section>
`;
