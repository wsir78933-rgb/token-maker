import {
  DND_DEMONS_BASIC_RULES_URL,
  DND_DEMONS_MONSTER_FILTER_URL,
  DND_DEMONS_TYPE_IMAGE_PATH,
  DND_DEMONS_VIDEO_PLACEHOLDER_PATH,
  DND_DEMONS_VIDEO_URL,
  DND_DEMONS_WIKIPEDIA_URL,
  EN_DICE_ROLLER_PATH,
  EN_DND_MEPHISTOPHELES_PATH,
  EN_EDITOR_PATH,
  EN_SQUARE_TOKEN_MAKER_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_MEPHISTOPHELES_PATH,
  ZH_EDITOR_PATH,
  ZH_SQUARE_TOKEN_MAKER_PATH,
  liteVideoEmbed,
} from './shared';

export const dndDemonsArticleHtml = String.raw`
<p><strong>dnd demons</strong> are chaotic evil fiends from the Abyss, and the fastest way to use them well is to stop treating every demon as "a scary monster with claws." This guide gives you the demon list, the demon vs devil difference, table roles, encounter mistakes, VTT token advice, and the companion video at the bottom.</p>

<p><strong>Short version:</strong> demons in DND are best when they feel unstable, hungry, and hard to negotiate with. Use devils for contracts and hierarchy. Use demons when the scene should feel like violence, corruption, and bad decisions are spreading faster than the party can contain them.</p>

<p>If you are preparing demon encounters for a VTT session, start by making readable demon portraits in the <a href="${EN_EDITOR_PATH}">VTT token maker</a> or build grid-ready encounter markers with the <a href="${EN_SQUARE_TOKEN_MAKER_PATH}">square token maker</a>.</p>

<table>
  <thead>
    <tr>
      <th>DND demon</th>
      <th>Fast table identity</th>
      <th>Best use</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Dretch</strong></td>
      <td>Weak, foul, disposable Abyssal foot soldier</td>
      <td>Low-level swarm, portal spillover, ritual trash mob</td>
    </tr>
    <tr>
      <td><strong>Quasit</strong></td>
      <td>Small tempter, spy, familiar-style nuisance</td>
      <td>Cult scout, cursed familiar, comic but dangerous clue-carrier</td>
    </tr>
    <tr>
      <td><strong>Shadow demon</strong></td>
      <td>Incorporeal ambusher that punishes darkness mistakes</td>
      <td>Haunted ruin, stealth horror, possession-adjacent pressure</td>
    </tr>
    <tr>
      <td><strong>Vrock</strong></td>
      <td>Flying brute with spores and panic energy</td>
      <td>Mid-tier aerial threat, ruined tower fight, ritual guardian</td>
    </tr>
    <tr>
      <td><strong>Hezrou</strong></td>
      <td>Stench-heavy brawler that turns positioning ugly</td>
      <td>Frontline demon, sewer breach, chokepoint pressure</td>
    </tr>
    <tr>
      <td><strong>Glabrezu</strong></td>
      <td>Manipulator with muscle, spells, and false offers</td>
      <td>Temptation scene, boss lieutenant, "deal first, fight later" villain</td>
    </tr>
    <tr>
      <td><strong>Marilith</strong></td>
      <td>Elite commander with many blades and tactical control</td>
      <td>High-level duelist, Abyssal general, set-piece boss</td>
    </tr>
    <tr>
      <td><strong>Balor</strong></td>
      <td>Iconic endgame demon of fire, whip, sword, and disaster</td>
      <td>Campaign climax, portal guardian, final fight centerpiece</td>
    </tr>
  </tbody>
</table>

<p>If you need to compare <strong>dnd demons</strong> fast, start with the quick reference above: it shows what each demon is, when to use it, and how it differs from devils before the deeper lore begins.</p>

<h2>What Are DND Demons?</h2>
<p><strong>DND demons are chaotic evil fiends tied to the Abyss, usually built around destruction, corruption, hunger, and unstable violence.</strong></p>

<p>The official monster list is the best place to check exact stat blocks, so I link out to the <a href="${DND_DEMONS_MONSTER_FILTER_URL}" rel="noreferrer noopener">D&amp;D Beyond demon monster listing</a> and the <a href="${DND_DEMONS_BASIC_RULES_URL}" rel="noreferrer noopener">D&amp;D Basic Rules monster section</a>. For publication history and older edition context, the <a href="${DND_DEMONS_WIKIPEDIA_URL}" rel="noreferrer noopener">Dungeons &amp; Dragons demon overview on Wikipedia</a> is useful background.</p>

<p>At the table, I treat <strong>dnd demons</strong> as pressure, not just enemies. A demon should make the room worse: heat rises, shadows move, cultists panic, a portal widens, or the barbarian realizes killing one creature may not end the problem.</p>

<h2>Are DND Demons the Same as Devils?</h2>
<p><strong>No. DND demons and DND devils are both fiends, but demons are chaotic evil Abyssal threats while devils are lawful evil infernal dealmakers.</strong></p>

<table>
  <thead>
    <tr>
      <th>Question</th>
      <th>DND demons</th>
      <th>DND devils</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Core alignment vibe</strong></td>
      <td>Chaotic evil: appetite, rage, mutation, ruin</td>
      <td>Lawful evil: contracts, ranks, punishment, control</td>
    </tr>
    <tr>
      <td><strong>Best story use</strong></td>
      <td>A portal breach, cult mistake, cursed battlefield, spreading corruption</td>
      <td>A bargain, debt, infernal bureaucracy, long-term manipulation</td>
    </tr>
    <tr>
      <td><strong>How they negotiate</strong></td>
      <td>Badly, briefly, or as a trick before violence</td>
      <td>Very well, often with terms the party regrets later</td>
    </tr>
    <tr>
      <td><strong>Encounter feel</strong></td>
      <td>Messy, fast, physically dangerous, hard to contain</td>
      <td>Controlled, political, punitive, often planned</td>
    </tr>
  </tbody>
</table>

<p>If your campaign needs infernal contracts, a patron, or a cold long-game villain, use the <a href="${EN_DND_MEPHISTOPHELES_PATH}">Mephistopheles DND guide</a> as the better companion. If you want a shrine door to break open and the map to start bleeding problems, use demons.</p>

<h2>List of Demons in DND by Table Role</h2>
<p>A useful <strong>list of demons in dnd</strong> should group monsters by how they play at the table, not just by challenge rating.</p>

<figure class="inline-figure inline-figure--four-three-crop">
  <img
    class="inline-figure__image inline-figure__image--four-three"
    src="${DND_DEMONS_TYPE_IMAGE_PATH}"
    alt="dnd demons encounter reference showing Abyssal demon types, portal light, dice, and VTT token sketches"
    width="1536"
    height="1152"
    loading="lazy"
    decoding="async"
  />
  <figcaption>For prep, I sort dnd demons by job first: swarm, scout, ambusher, brawler, manipulator, commander, or endgame disaster.</figcaption>
</figure>

<table>
  <thead>
    <tr>
      <th>Table role</th>
      <th>Demon examples</th>
      <th>How I would run them</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Swarm pressure</strong></td>
      <td>Dretch, manes, lesser Abyssal mobs</td>
      <td>Use them to show contamination and panic, not to carry the whole fight.</td>
    </tr>
    <tr>
      <td><strong>Scout or tempter</strong></td>
      <td>Quasit</td>
      <td>Let it watch the party, whisper, flee, and reveal that something larger is nearby.</td>
    </tr>
    <tr>
      <td><strong>Ambush horror</strong></td>
      <td>Shadow demon</td>
      <td>Make light, walls, and line of sight matter. Do not drop it into an empty bright room.</td>
    </tr>
    <tr>
      <td><strong>Mid-tier chaos brute</strong></td>
      <td>Vrock, hezrou, chasme</td>
      <td>Give them a messy environment: spores, stench, flight, noise, or failed ritual terrain.</td>
    </tr>
    <tr>
      <td><strong>Smart threat</strong></td>
      <td>Glabrezu, nalfeshnee</td>
      <td>Use offers, illusions, intimidation, and minions before initiative starts.</td>
    </tr>
    <tr>
      <td><strong>Elite commander</strong></td>
      <td>Marilith</td>
      <td>Run it like a battlefield expert. It should reposition, punish mistakes, and direct lesser demons.</td>
    </tr>
    <tr>
      <td><strong>Final boss energy</strong></td>
      <td>Balor, demon lord-adjacent threats</td>
      <td>Build the scene around arrival, fire, fear, collateral damage, and an exit problem.</td>
    </tr>
  </tbody>
</table>

<h2>How Should You Use DND Demons in a Campaign?</h2>
<p><strong>Use DND demons when you want a scene to feel like a contained situation is becoming an uncontrolled disaster.</strong></p>

<p>The strongest demon encounters I have run had a visible failure clock. A cult circle was cracking. A prisoner was mutating. A shrine had three seals and one was already broken. That one extra problem keeps the fight from becoming "stand here and reduce hit points."</p>

<ul>
  <li><strong>Give the demon a breach point:</strong> portal, summoning circle, cursed corpse, Abyssal wound, or ruined idol.</li>
  <li><strong>Make the room deteriorate:</strong> spreading fire, poison fog, screaming cultists, collapsing walls, or unstable magic.</li>
  <li><strong>Do not over-negotiate lesser demons:</strong> short threats and ugly bargains work better than polished speeches.</li>
  <li><strong>Let stronger demons tempt before they fight:</strong> a glabrezu is scarier when the offer is almost useful.</li>
  <li><strong>Plan what happens if the party retreats:</strong> demons should leave consequences behind.</li>
</ul>

<h2>Which DND Demon Should a DM Pick First?</h2>
<p><strong>For a first demon encounter, pick a quasit for intrigue, a dretch group for low-level chaos, or a vrock if the party is ready for a real mid-tier fight.</strong></p>

<p>I would not start a new table with a wall of demon lore. Start with one clear role. If the demon is a scout, the players should notice they are being watched. If it is a brute, the map should have things to break. If it is a manipulator, the offer should cost something specific.</p>

<table>
  <thead>
    <tr>
      <th>Party need</th>
      <th>Best demon pick</th>
      <th>Why</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Low-level warning sign</strong></td>
      <td>Quasit or dretch</td>
      <td>Small enough to survive beginner play, strange enough to signal bigger Abyssal trouble.</td>
    </tr>
    <tr>
      <td><strong>Scary first boss</strong></td>
      <td>Shadow demon</td>
      <td>Memorable if you use darkness, retreat paths, and possession-style fear carefully.</td>
    </tr>
    <tr>
      <td><strong>Messy combat centerpiece</strong></td>
      <td>Vrock or hezrou</td>
      <td>They change positioning and force players to respect area pressure.</td>
    </tr>
    <tr>
      <td><strong>Social temptation</strong></td>
      <td>Glabrezu</td>
      <td>It can lie, offer power, and still hit hard when the deal fails.</td>
    </tr>
  </tbody>
</table>

<h2>How to Make DND Demons Feel Different from Ordinary Monsters</h2>
<p><strong>DND demons feel different when their presence changes the environment, not just the initiative order.</strong></p>

<p>My practical rule is simple: before I add a demon, I write one sentence that starts with "Because this demon is here..." If the sentence only says "the party takes damage," I redesign the scene.</p>

<ul>
  <li><strong>Because this demon is here,</strong> torches burn green and shadows point the wrong way.</li>
  <li><strong>Because this demon is here,</strong> the cultists stop obeying their own plan.</li>
  <li><strong>Because this demon is here,</strong> a dead NPC whispers a secret they should not know.</li>
  <li><strong>Because this demon is here,</strong> the portal gets wider every round unless someone spends an action closing it.</li>
  <li><strong>Because this demon is here,</strong> killing it still leaves a cursed stain the party must deal with later.</li>
</ul>

<h2>How to Make DND Demons Tokens for VTT Play</h2>
<p><strong>A good DND demons token should show the demon's silhouette, threat type, and Abyssal mood at small map size.</strong></p>

<p>For Roll20, Foundry VTT, Owlbear, or other VTT tools, I crop demons less like portraits and more like encounter icons. Horns, wings, claws, a weapon, or a visible portal edge can matter more than a perfect face crop.</p>

<ul>
  <li><strong>Use silhouette first:</strong> wings for vrocks, many blades for mariliths, hulking shoulders for hezrous.</li>
  <li><strong>Pick border color by faction:</strong> Abyssal red, sick green, bruised violet, or ash black reads quickly.</li>
  <li><strong>Keep boss tokens larger:</strong> export major demons at 1024px if the VTT map will zoom in.</li>
  <li><strong>Make lesser demons visually simpler:</strong> mobs should not compete with the boss token.</li>
  <li><strong>Use labels sparingly:</strong> add labels only when the party must distinguish several demon types at once.</li>
</ul>

<p>You can build those encounter tokens in the <a href="${EN_EDITOR_PATH}">VTT token maker</a>. For square grid markers, use the <a href="${EN_SQUARE_TOKEN_MAKER_PATH}">square token maker</a>. If the encounter has fear saves, concentration checks, or random portal effects, keep the <a href="${EN_DICE_ROLLER_PATH}">DND dice roller</a> open beside your map.</p>

<h2>Common Mistakes With DND Demons</h2>
<p>The most common mistake with <strong>dnd demons</strong> is making them look infernal but play like ordinary melee creatures.</p>

<ul>
  <li><strong>Mistake 1:</strong> using demons as generic red monsters with no Abyssal consequence.</li>
  <li><strong>Mistake 2:</strong> mixing up demons and devils until every fiend feels like a contract lawyer.</li>
  <li><strong>Mistake 3:</strong> using a flat empty map when the demon should distort the scene.</li>
  <li><strong>Mistake 4:</strong> starting too big. A balor has less impact if the campaign has not earned that scale.</li>
  <li><strong>Mistake 5:</strong> forgetting that demons are often best as a crisis, not a faction with tidy meeting minutes.</li>
</ul>

<h2>Video: DND Demons Companion Watch</h2>
<p>The companion video is this <a href="${DND_DEMONS_VIDEO_URL}" rel="noreferrer noopener">DND demons video on YouTube</a>. Use it as a practical follow-up: watch for the same prep lens used here, which is to identify what each demon changes at the table before worrying about every last lore footnote.</p>

${liteVideoEmbed('54sGxOW26fM', 'DND demons companion video', {
  src: DND_DEMONS_VIDEO_PLACEHOLDER_PATH,
  alt: 'dnd demons video cover showing an Abyssal portal, demon silhouettes, dice, and tabletop notes',
})}

<h2>FAQ About DND Demons</h2>

<h3>What are DND demons?</h3>
<p>DND demons are chaotic evil fiends associated with the Abyss, usually used for destructive, corrupting, and unstable threats in Dungeons &amp; Dragons campaigns.</p>

<h3>Are demons and devils the same in DND?</h3>
<p>No. Demons are chaotic evil Abyssal fiends, while devils are lawful evil infernal fiends. Use demons for chaos and corruption; use devils for contracts, hierarchy, and punishment.</p>

<h3>What is the best first DND demon for a new DM?</h3>
<p>A quasit or small group of dretches is usually the easiest first demon choice. They show Abyssal weirdness without forcing a beginner table into a high-level boss fight.</p>

<h3>What is the strongest common DND demon?</h3>
<p>The balor is one of the most iconic high-end common demons in DND. It works best as a major set-piece threat, not as a casual random encounter.</p>

<h3>How do I make demons feel scary without killing the party?</h3>
<p>Use environmental consequences, visible corruption, escape pressure, and clear warning signs before raw damage. The party should feel the Abyss spreading, not just see bigger attack numbers.</p>
`;

export const dndDemonsArticleHtmlZh = String.raw`
<p><strong>dnd demons</strong> 指的是来自 Abyss 的混乱邪恶 fiend。真正好用的写法不是把所有恶魔都当成“长角、有爪子的怪”，而是先判断它在桌上负责什么：低级污染、侦察诱骗、暗处伏击、正面冲阵、交易陷阱，还是终局灾难。</p>

<p><strong>一句话结论：</strong><strong>dnd demons</strong> 适合表现失控、饥饿、污染和暴力扩散。想写契约和等级秩序，用 devils；想让场景变得越来越糟，用 demons。</p>

<p>如果你已经在准备 VTT 遭遇，可以先用 <a href="${ZH_EDITOR_PATH}">VTT token maker</a> 制作可读性更强的恶魔头像，或者用 <a href="${ZH_SQUARE_TOKEN_MAKER_PATH}">square token maker</a> 做适合方格地图的恶魔标记。</p>

<table>
  <thead>
    <tr>
      <th>DND demon</th>
      <th>桌面定位</th>
      <th>最适合用途</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Dretch</strong></td>
      <td>弱小、恶臭、可消耗的 Abyss 小兵</td>
      <td>低级群怪、传送门泄漏、仪式失败后的杂兵</td>
    </tr>
    <tr>
      <td><strong>Quasit</strong></td>
      <td>小型诱惑者、探子、类魔宠麻烦源</td>
      <td>邪教侦察、诅咒魔宠、带线索的小型威胁</td>
    </tr>
    <tr>
      <td><strong>Shadow demon</strong></td>
      <td>惩罚黑暗和走位失误的伏击者</td>
      <td>废墟恐怖、潜行压力、附身感剧情</td>
    </tr>
    <tr>
      <td><strong>Vrock</strong></td>
      <td>会飞、带孢子、制造混乱的中型威胁</td>
      <td>塔楼战、仪式守卫、空中压迫</td>
    </tr>
    <tr>
      <td><strong>Hezrou</strong></td>
      <td>恶臭前排，把站位变得难受</td>
      <td>通道压制、下水道裂口、正面冲阵</td>
    </tr>
    <tr>
      <td><strong>Glabrezu</strong></td>
      <td>会诱骗、会施法、也能打的高阶恶魔</td>
      <td>诱惑交易、Boss 副手、先谈后打的反派</td>
    </tr>
    <tr>
      <td><strong>Marilith</strong></td>
      <td>多刀精英指挥官</td>
      <td>高等级决斗、Abyss 将领、战术型 Boss</td>
    </tr>
    <tr>
      <td><strong>Balor</strong></td>
      <td>火焰、长鞭、巨剑和灾难感拉满的终局恶魔</td>
      <td>战役高潮、传送门守卫、最终战核心</td>
    </tr>
  </tbody>
</table>

<p>如果你想快速比较 <strong>dnd demons</strong>，先看上面的速查表：它会先说明有哪些 demon、各自适合什么场景，以及它们和 dnd devils 的核心区别，然后再进入更细的设定。</p>

<h2>DND Demons 是什么？</h2>
<p><strong>DND demons 是和 Abyss 相关的混乱邪恶 fiend，通常代表破坏、污染、饥饿和失控暴力。</strong></p>

<p>具体数据请以官方 stat block 为准。可以从 <a href="${DND_DEMONS_MONSTER_FILTER_URL}" rel="noreferrer noopener">D&amp;D Beyond 的 demon 怪物列表</a> 和 <a href="${DND_DEMONS_BASIC_RULES_URL}" rel="noreferrer noopener">D&amp;D Basic Rules 怪物章节</a> 查规则。想看出版史和旧版本背景，可以参考 <a href="${DND_DEMONS_WIKIPEDIA_URL}" rel="noreferrer noopener">Wikipedia 上的 Dungeons &amp; Dragons demon 概览</a>。</p>

<p>我在跑团里不会把 <strong>dnd demons</strong> 只当作敌人单位。我会把它们当成压力源：房间变热，影子不对，邪教徒自己也失控，传送门越来越大，或者玩家发现“杀掉眼前这只”并不等于问题结束。</p>

<h2>DND Demons 和 Devils 是一回事吗？</h2>
<p><strong>不是。DND demons 和 DND devils 都是 fiends，但 demons 偏向混乱邪恶和 Abyss，devils 偏向守序邪恶、契约和地狱秩序。</strong></p>

<table>
  <thead>
    <tr>
      <th>对比点</th>
      <th>DND demons</th>
      <th>DND devils</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>核心气质</strong></td>
      <td>混乱邪恶：欲望、 rage、突变、毁灭</td>
      <td>守序邪恶：契约、等级、惩罚、控制</td>
    </tr>
    <tr>
      <td><strong>剧情用途</strong></td>
      <td>传送门破裂、邪教失手、诅咒战场、污染扩散</td>
      <td>交易、债务、地狱官僚、长期操控</td>
    </tr>
    <tr>
      <td><strong>谈判方式</strong></td>
      <td>短促、混乱，或者只是动手前的诱骗</td>
      <td>非常擅长谈判，条款通常会在后面反噬玩家</td>
    </tr>
    <tr>
      <td><strong>遭遇感受</strong></td>
      <td>脏乱、快速、身体威胁强、难以控制</td>
      <td>冷静、政治化、惩戒性强、计划感更重</td>
    </tr>
  </tbody>
</table>

<p>如果你的战役要写契约、patron 或冷冰冰的长线反派，<a href="${ZH_DND_MEPHISTOPHELES_PATH}">mephistopheles dnd 指南</a> 会更贴近需求。如果你想让神殿门一破，整个地图开始失控，那就用 demons。</p>

<h2>List of Demons in DND：按桌面职责分类</h2>
<p>实用的 <strong>list of demons in dnd</strong> 不应该只按 CR 排列，更应该按“它在桌上负责制造什么问题”分类。</p>

<figure class="inline-figure inline-figure--four-three-crop">
  <img
    class="inline-figure__image inline-figure__image--four-three"
    src="${DND_DEMONS_TYPE_IMAGE_PATH}"
    alt="dnd demons 正文图，展示 Abyss 传送门、恶魔类型、骰子和 VTT token 草图"
    width="1536"
    height="1152"
    loading="lazy"
    decoding="async"
  />
  <figcaption>我准备 dnd demons 时会先按职责分：群怪、侦察、伏击、前排、诱骗者、指挥官、终局灾难。</figcaption>
</figure>

<table>
  <thead>
    <tr>
      <th>桌面职责</th>
      <th>恶魔例子</th>
      <th>跑法</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>群怪压力</strong></td>
      <td>Dretch、manes、低阶 Abyss 杂兵</td>
      <td>用来表现污染和恐慌，不要让它们承担整场战斗。</td>
    </tr>
    <tr>
      <td><strong>探子或诱惑者</strong></td>
      <td>Quasit</td>
      <td>让它观察、低语、逃跑，并提示后面还有更大的东西。</td>
    </tr>
    <tr>
      <td><strong>伏击恐怖</strong></td>
      <td>Shadow demon</td>
      <td>让光线、墙体和视线变重要，不要把它丢进空旷亮堂的房间。</td>
    </tr>
    <tr>
      <td><strong>中阶混乱前排</strong></td>
      <td>Vrock、hezrou、chasme</td>
      <td>给它们孢子、恶臭、飞行、噪音或仪式失败地形。</td>
    </tr>
    <tr>
      <td><strong>聪明威胁</strong></td>
      <td>Glabrezu、nalfeshnee</td>
      <td>先用交易、幻象、恐吓和爪牙制造压力，再进入战斗。</td>
    </tr>
    <tr>
      <td><strong>精英指挥官</strong></td>
      <td>Marilith</td>
      <td>按战术专家来跑：移动、惩罚走位、指挥低阶恶魔。</td>
    </tr>
    <tr>
      <td><strong>终局灾难</strong></td>
      <td>Balor、接近 demon lord 的威胁</td>
      <td>围绕登场、火焰、恐惧、连带伤害和撤离难题设计场景。</td>
    </tr>
  </tbody>
</table>

<h2>DM 应该怎样在战役里使用 DND Demons？</h2>
<p><strong>当你希望一个“本来可控”的局面快速变成灾难时，就适合使用 DND demons。</strong></p>

<p>我实测最有效的 demon 遭遇，通常都有一个看得见的失败倒计时：邪教法阵裂开，俘虏开始突变，神龛有三层封印但已经碎了一层。这个额外问题会让战斗不只是站桩削血。</p>

<ul>
  <li><strong>给 demon 一个破口：</strong>传送门、召唤圈、受诅咒尸体、Abyss 裂缝或破损神像。</li>
  <li><strong>让房间持续恶化：</strong>蔓延火焰、毒雾、尖叫邪教徒、崩塌墙体或不稳定魔法。</li>
  <li><strong>不要让低阶 demon 长篇谈判：</strong>短威胁和丑陋诱惑比华丽演讲更合适。</li>
  <li><strong>让高阶 demon 先诱惑再动手：</strong>glabrezu 最可怕的地方，是它给的东西真的差一点就有用。</li>
  <li><strong>提前想好玩家撤退会怎样：</strong>demons 应该留下后果。</li>
</ul>

<h2>新手 DM 第一只 DND Demon 选谁？</h2>
<p><strong>第一次跑 demon，可以选 quasit 做剧情探子，选一小群 dretches 做低级混乱，或者在队伍强度足够时用 vrock 做中阶战斗核心。</strong></p>

<p>我不建议新桌一上来就灌一堆 Abyss 设定。先把职责讲清楚：探子就让玩家发现自己被盯上；前排就让地图上有东西可砸；诱骗者就让它提出一个具体但有代价的条件。</p>

<table>
  <thead>
    <tr>
      <th>队伍需要</th>
      <th>推荐 demon</th>
      <th>原因</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>低级预警</strong></td>
      <td>Quasit 或 dretch</td>
      <td>不会太超纲，但足够奇怪，可以提示后面有 Abyss 问题。</td>
    </tr>
    <tr>
      <td><strong>第一个恐怖 Boss</strong></td>
      <td>Shadow demon</td>
      <td>配合黑暗、撤退路径和附身感线索会很有记忆点。</td>
    </tr>
    <tr>
      <td><strong>混乱战斗核心</strong></td>
      <td>Vrock 或 hezrou</td>
      <td>它们能改变站位，让玩家尊重范围压力。</td>
    </tr>
    <tr>
      <td><strong>社交诱惑</strong></td>
      <td>Glabrezu</td>
      <td>可以撒谎、给力量，也能在交易失败后直接开打。</td>
    </tr>
  </tbody>
</table>

<h2>怎样让 DND Demons 不像普通怪？</h2>
<p><strong>DND demons 的差异感来自“它们让环境变坏”，而不是只靠进入先攻表。</strong></p>

<p>我的实用规则是：放 demon 前先写一句“因为这只 demon 在这里，所以……”。如果句子只能写出“玩家受到伤害”，那这个遭遇还不够。</p>

<ul>
  <li><strong>因为这只 demon 在这里，</strong>火把变成绿色，影子朝错误方向延伸。</li>
  <li><strong>因为这只 demon 在这里，</strong>邪教徒开始违背自己的计划。</li>
  <li><strong>因为这只 demon 在这里，</strong>死去的 NPC 说出了不该知道的秘密。</li>
  <li><strong>因为这只 demon 在这里，</strong>传送门每回合扩大，除非有人花动作关闭它。</li>
  <li><strong>因为这只 demon 在这里，</strong>杀掉它以后，地面仍然留下需要处理的诅咒污痕。</li>
</ul>

<h2>如何为 DND Demons 制作 VTT Token？</h2>
<p><strong>DND demons 的 VTT token 要在小尺寸下看清轮廓、威胁类型和 Abyss 气质。</strong></p>

<p>在 Roll20、Foundry VTT、Owlbear 等工具里，我不会把 demon token 做成普通头像。我会优先保留角、翅膀、爪子、武器或传送门边缘，因为这些信息比完美脸部裁切更有用。</p>

<ul>
  <li><strong>先看轮廓：</strong>vrock 要看出翅膀，marilith 要看出多刀，hezrou 要看出厚重前排。</li>
  <li><strong>按阵营选边框色：</strong>Abyss 红、病态绿、瘀紫或灰黑都比普通金边更快读。</li>
  <li><strong>Boss token 尺寸更大：</strong>关键 demon 如果会被 VTT 放大，建议导出 1024px。</li>
  <li><strong>低阶 demon 简化：</strong>杂兵不要抢 Boss 的视觉中心。</li>
  <li><strong>标签少用：</strong>只有同场需要区分多种 demon 时再加文字。</li>
</ul>

<p>你可以直接用 <a href="${ZH_EDITOR_PATH}">VTT token maker</a> 做这些遭遇 Token。需要方形网格标记时，用 <a href="${ZH_SQUARE_TOKEN_MAKER_PATH}">square token maker</a>。如果战斗里有恐惧豁免、专注检定或随机传送门效果，可以把 <a href="${ZH_DICE_ROLLER_PATH}">DND 骰子工具</a> 放在地图旁边。</p>

<h2>DND Demons 常见错误</h2>
<p>使用 <strong>dnd demons</strong> 最常见的错误，是外观看起来很地狱，实际跑起来却只是普通近战怪。</p>

<ul>
  <li><strong>错误 1：</strong>把 demons 当成泛用红皮怪，没有 Abyss 后果。</li>
  <li><strong>错误 2：</strong>把 demons 和 devils 混在一起，导致所有 fiend 都像契约律师。</li>
  <li><strong>错误 3：</strong>使用空旷平面地图，明明 demon 应该扭曲场景。</li>
  <li><strong>错误 4：</strong>上来就用太大的威胁。balor 如果没有铺垫，冲击力会变弱。</li>
  <li><strong>错误 5：</strong>忘记 demons 很适合当危机源，而不是会议纪要整齐的政治派系。</li>
</ul>

<h2>视频：DND Demons Companion Watch</h2>
<p>这支 <a href="${DND_DEMONS_VIDEO_URL}" rel="noreferrer noopener">DND demons YouTube 视频</a> 适合作为补充观看。重点不是背完每一个设定脚注，而是先判断每只 demon 会让桌面局势发生什么变化。</p>

${liteVideoEmbed('54sGxOW26fM', 'DND demons companion video', {
  src: DND_DEMONS_VIDEO_PLACEHOLDER_PATH,
  alt: 'dnd demons 视频封面图，展示 Abyss 传送门、恶魔剪影、骰子和桌面笔记',
})}

<h2>DND Demons FAQ</h2>

<h3>DND demons 是什么？</h3>
<p>DND demons 是和 Abyss 相关的混乱邪恶 fiends，通常用于表现破坏、污染、失控和高压战斗。</p>

<h3>DND demons 和 devils 一样吗？</h3>
<p>不一样。Demons 是混乱邪恶的 Abyss fiends；devils 是守序邪恶的 infernal fiends。前者适合混乱污染，后者适合契约、等级和惩罚。</p>

<h3>新手 DM 最适合先用哪只 DND demon？</h3>
<p>Quasit 或一小群 dretches 通常最适合作为第一只 demon。它们能展示 Abyss 的怪异感，又不会把新手桌直接推向高等级 Boss 战。</p>

<h3>DND 里最经典的高阶 demon 是谁？</h3>
<p>Balor 是最经典的高阶 demon 之一。它适合作为重大 set-piece 威胁，而不是随手塞进随机遭遇。</p>

<h3>怎样让 demons 可怕但不团灭玩家？</h3>
<p>用环境后果、可见污染、撤离压力和清晰预警替代单纯堆伤害。玩家应该感到 Abyss 正在扩散，而不是只看到更高攻击数字。</p>
`;
