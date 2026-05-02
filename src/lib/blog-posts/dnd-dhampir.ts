import {
  DND_DHAMPIR_CEILING_IMAGE_PATH,
  DND_DHAMPIR_BITE_IMAGE_PATH,
  DND_DHAMPIR_LINEAGE_URL,
  DND_DHAMPIR_VAMPIRE_URL,
  DHAMPIR_WIKIPEDIA_URL,
  DND_DHAMPIR_VIDEO_URL,
  EN_DND_CLASSES_PATH,
  EN_DND_CONSTITUTION_PATH,
  EN_DICE_ROLLER_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_DND_CONSTITUTION_PATH,
  ZH_DICE_ROLLER_PATH,
  liteVideoEmbed,
} from './shared';

export const dndDhampirArticleHtml = String.raw`
<p>Before you build a <strong>dnd dhampir</strong>, the short answer matters first: is the lineage actually good, how does <em>Vampiric Bite</em> work, and which classes make it feel strong instead of gimmicky? This guide answers those three questions fast, then goes deeper. In our campaigns, Dhampir performs best as a mobile predator chassis, not as a fake-vampire damage meme.</p>

<p>If you only need the practical answer, start with the quick table below. The sections after it are there to help you decide three things fast: whether <strong>dnd dhampir</strong> fits your class, whether your campaign gives it enough vertical space to matter, and whether you actually want the hunger-driven roleplay that comes with it.</p>

<table>
  <thead>
    <tr>
      <th>Need-to-know item</th>
      <th>Fast answer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>What is DND Dhampir?</strong></td>
      <td>A vampire-touched lineage for players who want gothic flavor, strong mobility, and a built-in hunger hook.</td>
    </tr>
    <tr>
      <td><strong>Why people pick it</strong></td>
      <td>35-foot speed, wall-and-ceiling movement later, and a Constitution-based bite that can heal or set up your next roll.</td>
    </tr>
    <tr>
      <td><strong>Best classes</strong></td>
      <td>Rogue, Fighter, Gloom Stalker Ranger, and selected Warlock builds are the cleanest fits.</td>
    </tr>
    <tr>
      <td><strong>Biggest misunderstanding</strong></td>
      <td><em>Vampiric Bite</em> is utility and sustain. It is not your whole damage plan.</td>
    </tr>
    <tr>
      <td><strong>Who should skip it</strong></td>
      <td>Players who want a passive stat stick and do not care about vertical movement or roleplay tension.</td>
    </tr>
  </tbody>
</table>

<h2>What Is a DND Dhampir?</h2>
<p>A <strong>dnd dhampir</strong> is a vampire-marked lineage in D&amp;D 5e that gives you eerie movement, dark fantasy flavor, and a built-in survival tool without turning your character into a full monster.</p>

<p>Mechanically, Dhampir matters because it is a <strong>lineage</strong>, not just a static race pick. That means it carries the gothic identity of a half-vampiric adventurer while still fitting ordinary party play. If you want the official framing, <a href="${DND_DHAMPIR_LINEAGE_URL}" rel="noreferrer noopener">D&amp;D Beyond&rsquo;s lineage overview</a> explains how Dhampir sits alongside Hexblood and Reborn, while <a href="${DHAMPIR_WIKIPEDIA_URL}" rel="noreferrer noopener">Wikipedia&rsquo;s dhampir entry</a> is useful if you want the older folklore roots behind the word itself.</p>

<ul>
  <li><strong>Creature type:</strong> Humanoid, which matters because you are not treated as Undead by default.</li>
  <li><strong>Size:</strong> Small or Medium.</li>
  <li><strong>Speed:</strong> 35 feet, which is quietly excellent on a melee skirmisher.</li>
  <li><strong>Signature traits:</strong> Darkvision, <em>Deathless Nature</em>, <em>Spider Climb</em>, and <em>Vampiric Bite</em>.</li>
  <li><strong>High-value rule note:</strong> If you become a Dhampir through lineage rules, you can often preserve useful proficiencies or movement from your previous ancestry.</li>
</ul>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_DHAMPIR_CEILING_IMAGE_PATH}"
    alt="DND dhampir adventurer crawling across a moonlit gothic ceiling above guards"
    width="1400"
    height="900"
    loading="lazy"
    decoding="async"
  />
  <figcaption>In my tables, the reason Dhampir feels special is simple: once ceilings become playable space, encounters stop being flat.</figcaption>
</figure>

<h2>Is DND Dhampir Good in 5e?</h2>
<p>Yes, <strong>dnd dhampir</strong> is good in 5e if you care more about movement, survivability, and identity than raw front-loaded damage.</p>

<p>It is not a universal best-in-slot lineage. It shines in campaigns with dungeons, ladders, cliffs, rooftops, ambushes, and tense social scenes where your hunger matters. In dead-flat combat maps, part of the value disappears.</p>

<ul>
  <li><strong>Why it overperforms:</strong> 35-foot speed plus later <em>Spider Climb</em> changes encounter geometry more than most players expect.</li>
  <li><strong>Why DMs feel it:</strong> walls, rafters, balconies, and cave ceilings stop being background art and become tactical lanes.</li>
  <li><strong>Why new players overrate the bite:</strong> the bite is clever utility, not a replacement for a real class engine.</li>
  <li><strong>My honest take:</strong> Dhampir is strongest when the campaign lets the character feel predatory, agile, and a little unsettling.</li>
</ul>

<h2>How Does Vampiric Bite Work?</h2>
<p><strong>Vampiric Bite</strong> is a Constitution-based natural weapon that lets a <strong>dnd dhampir</strong> convert a successful bite into either healing or a setup bonus for the next key roll.</p>

<p>This is the part many build guides explain badly. The bite is best treated like a pressure-release tool. When you are hurt, cornered, climbing, disarmed, or about to make a high-value check, it suddenly becomes much better than the 1d4 damage line suggests.</p>

<table>
  <thead>
    <tr>
      <th>Best use case</th>
      <th>Why it works</th>
      <th>What I recommend</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Emergency sustain</strong></td>
      <td>Hit a wounded non-Undead, non-Construct target and cash the bite into healing.</td>
      <td>Use this when you only need to survive one more round, not when you are already safe.</td>
    </tr>
    <tr>
      <td><strong>Setup before a key roll</strong></td>
      <td>The bite can bank value into your next attack roll or ability check.</td>
      <td>This is my favorite line. It makes the bite far better than it looks on paper.</td>
    </tr>
    <tr>
      <td><strong>Low-HP scramble</strong></td>
      <td>The trait becomes much easier to trust once the fight turns ugly.</td>
      <td>Think of it as a comeback button, not your opening move.</td>
    </tr>
  </tbody>
</table>

<figure class="inline-figure inline-figure--square-crop">
  <img
    class="inline-figure__image inline-figure__image--square"
    src="${DND_DHAMPIR_BITE_IMAGE_PATH}"
    alt="DND dhampir using Vampiric Bite in battle with restrained crimson life energy"
    width="1000"
    height="1000"
    loading="lazy"
    decoding="async"
  />
  <figcaption>The trick is not the damage. The trick is deciding whether the bite should buy you life now or accuracy one roll later.</figcaption>
</figure>

<h2>Best Ability Scores and Classes for a DND Dhampir</h2>
<p>The best <strong>dnd dhampir</strong> builds usually prioritize Constitution earlier than usual, then branch into Dexterity, Wisdom, or Charisma depending on class.</p>

<table>
  <thead>
    <tr>
      <th>Class</th>
      <th>Why the fit works</th>
      <th>My build note</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Rogue</strong></td>
      <td>Stealth, mobility, and vertical ambushes fit the Dhampir fantasy perfectly.</td>
      <td>If you want the cleanest predator feel, start here.</td>
    </tr>
    <tr>
      <td><strong>Fighter</strong></td>
      <td>A reliable chassis lets the lineage tricks stay useful without carrying the whole build.</td>
      <td>Battle Master and Echo Knight both benefit from better positioning.</td>
    </tr>
    <tr>
      <td><strong>Gloom Stalker Ranger</strong></td>
      <td>Darkvision, ambush pressure, and ceiling movement stack into excellent first-round control.</td>
      <td>This is one of the most naturally scary Dhampir packages.</td>
    </tr>
    <tr>
      <td><strong>Warlock</strong></td>
      <td>The aristocratic, cursed, hungry tone fits almost too well.</td>
      <td>Pick this if story identity matters as much as mechanics.</td>
    </tr>
    <tr>
      <td><strong>Monk</strong></td>
      <td>The movement fantasy is amazing, even if the bite is not your best damage button.</td>
      <td>Fun and stylish, but more for theme than hard optimization.</td>
    </tr>
  </tbody>
</table>

<p>If you are still comparing frames, open our <a href="${EN_DND_CLASSES_PATH}">DND classes guide</a> next. If your plan is to lean into bite healing, concentration checks, or a tougher front line, our <a href="${EN_DND_CONSTITUTION_PATH}">D&amp;D Constitution guide</a> is the better companion piece.</p>

<section class="mt-10 rounded-[30px] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
  <h2 class="font-display text-2xl text-stone-50" style="margin-top: 0;">Quick Utility Link for Dhampir Players</h2>
  <p class="mt-3 text-[0.98rem] leading-8 text-stone-300">If you want to test the feel of a bite setup, concentration save, or rooftop chase without slowing your table down, use the on-site <a href="${EN_DICE_ROLLER_PATH}">D&amp;D dice roller</a>. I use it for weird edge cases precisely because Dhampir turns "normal" movement and recovery math into odd little tactical moments.</p>
</section>

<h2>How I Roleplay a DND Dhampir Without Annoying the Table</h2>
<p>The best <strong>dnd dhampir</strong> characters feel hungry and controlled at the same time. They do <strong>not</strong> need to be permanently brooding, disruptive, or edge-lord loud.</p>

<p>The official lore suggestions in <a href="${DND_DHAMPIR_VAMPIRE_URL}" rel="noreferrer noopener">D&amp;D Beyond&rsquo;s vampire character article</a> are a good starting point, but at my tables the character lands better when the hunger creates scenes instead of excuses. Pick one appetite, give it rules, and let the party understand the danger before it becomes a problem.</p>

<ul>
  <li><strong>Choose one hunger:</strong> blood, dreams, psychic energy, or another narrow craving is easier to roleplay well than "I want everything."</li>
  <li><strong>Set a table-facing boundary:</strong> decide what your Dhampir refuses to do, even when hungry.</li>
  <li><strong>Show control in public:</strong> quiet restraint is usually more unnerving than constant threats.</li>
  <li><strong>Use the hunger for scenes, not sabotage:</strong> make it a roleplay cost, not a reason to wreck the party plan.</li>
  <li><strong>Give the character a practical life habit:</strong> gloves, tea, strict meal routines, or religious discipline make the fantasy feel grounded.</li>
</ul>

<h2>Common DND Dhampir Mistakes</h2>
<p>The most common <strong>dnd dhampir</strong> mistake is building as if the bite alone will carry your combat turns. It will not.</p>

<ul>
  <li><strong>Mistake 1:</strong> treating the lineage like a pure damage pick instead of a mobility-and-pressure pick.</li>
  <li><strong>Mistake 2:</strong> ignoring Constitution even though the bite scales from it and your survival plan often depends on it.</li>
  <li><strong>Mistake 3:</strong> forgetting that the best Dhampir turns come from map angles, ceilings, and approach lanes.</li>
  <li><strong>Mistake 4:</strong> roleplaying constant blood frenzy with no off switch. That gets old fast.</li>
</ul>

<section class="mt-12 rounded-[34px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
  <h2 class="font-display text-2xl sm:text-3xl text-stone-50" style="margin-top: 0;">FAQ About DND Dhampir</h2>

  <div class="mt-6 space-y-4">
    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Is Dhampir undead in D&amp;D 5e?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">No. A player-character Dhampir is a <strong>Humanoid</strong>, not an Undead creature, which is one reason the lineage is so easy to use in normal party play.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Can a Dhampir heal with Vampiric Bite?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">Yes. When your bite hits a valid wounded target and you choose the healing option, the bite can restore hit points equal to the piercing damage it dealt.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Can a Dhampir walk on walls and ceilings?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">Yes. From 3rd level onward, a Dhampir can move across vertical surfaces and upside down on ceilings while keeping their hands free.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">What is the best class for a DND Dhampir?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">Rogue and Gloom Stalker Ranger are the cleanest thematic fits, while Fighter is the safest all-around mechanical shell if you want the lineage traits without build risk.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Does a DND Dhampir need to breathe?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">No. <em>Deathless Nature</em> means a Dhampir does not need to breathe, which matters more often than people expect in underwater, smoke-filled, and poison-heavy encounters.</p>
    </article>
  </div>
</section>

<h2>Extra D&amp;D Watch</h2>
<p>If you want one more light D&amp;D video after this guide, the one below works well as a casual follow-up. It leans more toward class vibe and table energy than rules detail: <a href="${DND_DHAMPIR_VIDEO_URL}" rel="noreferrer noopener">How DM&rsquo;s react to what Class you play in Dungeons and Dragons</a>.</p>

${liteVideoEmbed('ZXcwHPW3GR8', "How DM's react to what Class you play in Dungeons and Dragons")}
`;

export const dndDhampirArticleHtmlZh = String.raw`
<p>选 <strong>dnd dhampir</strong> 前，最该先弄清楚三件事：这个谱系到底强不强，<em>Vampiric Bite</em> 到底怎么用，什么职业最适合它。本文会先把速查结论摆在前面，再展开讲机制和构筑。按我们跑团的经验，Dhampir 最强的从来不是“吸血鬼噱头”，而是它把机动、残局续航和角色张力绑到了一起。</p>

<p>如果你只想先拿到实用结论，直接看下面的速查表就够了。后面的内容再分别解决三个问题：<strong>dnd dhampir</strong> 适不适合你的职业、它在什么样的地图和战役里最值、以及这个角色该怎么演才有张力又不惹人烦。</p>

<table>
  <thead>
    <tr>
      <th>你最想知道的点</th>
      <th>快速答案</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>DND Dhampir 是什么？</strong></td>
      <td>一个带吸血鬼气质的 lineage 谱系，适合想要哥特风格、强机动和“饥渴感”剧情钩子的玩家。</td>
    </tr>
    <tr>
      <td><strong>为什么会有人选它</strong></td>
      <td>35 尺速度、后续上墙上顶、再加一个能回血或给下次关键检定加值的 Constitution 咬击。</td>
    </tr>
    <tr>
      <td><strong>最合适的职业</strong></td>
      <td>Rogue、Fighter、Gloom Stalker Ranger 和部分 Warlock 构筑最顺。</td>
    </tr>
    <tr>
      <td><strong>最容易误解的点</strong></td>
      <td><em>Vampiric Bite</em> 的核心是功能性和续航，不是主输出引擎。</td>
    </tr>
    <tr>
      <td><strong>谁不适合选它</strong></td>
      <td>如果你只想要一个被动数值种族，不在乎垂直空间和角色身份张力，那它不会特别值。</td>
    </tr>
  </tbody>
</table>

<h2>DND Dhampir 是什么？</h2>
<p><strong>dnd dhampir</strong> 是 D&amp;D 5e 里一个带吸血鬼烙印的谱系，它给你的不是完整怪物化，而是一套更像“半步越线”的角色体验：诡异、灵活、能活、而且很容易写出人物冲突。</p>

<p>机制上，Dhampir 的价值在于它属于 <strong>lineage</strong>，不只是传统静态种族。也就是说，它既保留了半吸血鬼身份的强烈叙事感，又不会把角色推到“不方便正常组队”的位置。想看官方解释，可以直接看 <a href="${DND_DHAMPIR_LINEAGE_URL}" rel="noreferrer noopener">D&amp;D Beyond 对 lineage 的介绍</a>；如果你想追一下这个词本身的民俗来源，<a href="${DHAMPIR_WIKIPEDIA_URL}" rel="noreferrer noopener">Wikipedia 的 dhampir 条目</a> 也值得顺手点开。</p>

<ul>
  <li><strong>生物类型：</strong>Humanoid，不是默认的 Undead。</li>
  <li><strong>体型：</strong>Small 或 Medium 都可以。</li>
  <li><strong>移动速度：</strong>35 尺，这个数值放在近战游击位上非常舒服。</li>
  <li><strong>核心特性：</strong>Darkvision、<em>Deathless Nature</em>、<em>Spider Climb</em>、<em>Vampiric Bite</em>。</li>
  <li><strong>高价值细节：</strong>如果你是通过 lineage 规则转成 Dhampir，往往还能保留前一个 ancestry 的熟练项或特殊移动方式。</li>
</ul>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_DHAMPIR_CEILING_IMAGE_PATH}"
    alt="DND dhampir 冒险者在月光下的哥特大厅天花板上潜行"
    width="1400"
    height="900"
    loading="lazy"
    decoding="async"
  />
  <figcaption>按我的实测，Dhampir 真正离谱的地方不是咬人，而是它把天花板也变成了可用地形。</figcaption>
</figure>

<h2>DND Dhampir 在 5e 里强吗？</h2>
<p>强。<strong>dnd dhampir</strong> 在 5e 里是一个很实用的谱系，前提是你看重机动、生存和角色身份，而不是单纯想拿一手爆炸输出。</p>

<p>它不是“闭着眼都强”的万能答案。它最吃香的环境，是地牢、追逐、屋顶、山壁、洞穴、伏击和社交压迫感都很多的战役。如果地图长期是平地对砍，那它的一部分上限会被浪费掉。</p>

<ul>
  <li><strong>为什么它经常超预期：</strong>35 尺速度加后续 <em>Spider Climb</em>，会直接改变战斗的几何结构。</li>
  <li><strong>为什么 DM 会明显感受到它：</strong>墙、梁、平台、洞顶不再只是背景，而是你的路线。</li>
  <li><strong>为什么新手容易高估咬击：</strong>咬击的价值是功能性，不是把你变成近战炮台。</li>
  <li><strong>我自己的结论：</strong>Dhampir 最适合“像猎食者一样玩地图”的玩家。</li>
</ul>

<h2>Vampiric Bite 到底怎么用？</h2>
<p><strong>Vampiric Bite</strong> 是一个基于 Constitution 的自然武器，它真正的价值在于把一次命中的咬击，转成 <strong>回血</strong> 或 <strong>下一次关键检定/攻击的加成</strong>。</p>

<p>很多构筑文章会把这条讲得很玄，结果反而误导人。说白了，咬击最适合拿来做“转场工具”而不是“回合主菜”。你在残血、攀墙、缴械、卡位、或者准备下一次关键动作时，它才会突然变得很赚。</p>

<table>
  <thead>
    <tr>
      <th>最好用的场景</th>
      <th>为什么值</th>
      <th>我的建议</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>残局保命</strong></td>
      <td>打到一个已经受伤、且不是 Undead / Construct 的目标后，可以直接把咬击转成治疗。</td>
      <td>只差一轮就可能倒地时再开，别在安全回合乱交。</td>
    </tr>
    <tr>
      <td><strong>关键动作前垫一口</strong></td>
      <td>咬击可以把收益存到你下一次攻击检定或能力检定上。</td>
      <td>这是我最推荐的用法，纸面看不显眼，实战经常救命。</td>
    </tr>
    <tr>
      <td><strong>血线被压低以后</strong></td>
      <td>当战斗开始变丑时，这个特性的可靠度会明显提升。</td>
      <td>把它当成翻盘按钮，不要当成起手式。</td>
    </tr>
  </tbody>
</table>

<figure class="inline-figure inline-figure--square-crop">
  <img
    class="inline-figure__image inline-figure__image--square"
    src="${DND_DHAMPIR_BITE_IMAGE_PATH}"
    alt="DND dhampir 在战斗中使用 Vampiric Bite，周围有克制的红色生命能量"
    width="1000"
    height="1000"
    loading="lazy"
    decoding="async"
  />
  <figcaption>真正要想的是：这一口要不要换成立刻回血，还是拿去垫下一次更重要的出手。</figcaption>
</figure>

<h2>最适合 DND Dhampir 的属性与职业</h2>
<p>最顺手的 <strong>dnd dhampir</strong> 构筑，通常会比别的谱系更早重视 Constitution，然后再根据职业去补 Dexterity、Wisdom 或 Charisma。</p>

<table>
  <thead>
    <tr>
      <th>职业</th>
      <th>为什么契合</th>
      <th>我的构筑评价</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Rogue</strong></td>
      <td>潜行、机动、垂直伏击都跟 Dhampir 的气质和玩法完全对路。</td>
      <td>如果你想要最纯正的“猎食者感”，优先看这个。</td>
    </tr>
    <tr>
      <td><strong>Fighter</strong></td>
      <td>职业底盘够稳，能让谱系特性安心做加分项，而不是硬扛整套构筑。</td>
      <td>Battle Master 和 Echo Knight 都很顺。</td>
    </tr>
    <tr>
      <td><strong>Gloom Stalker Ranger</strong></td>
      <td>黑暗视觉、伏击节奏、上墙站位拼起来，非常像成熟的夜猎者。</td>
      <td>这是我最喜欢的 Dhampir 成品之一。</td>
    </tr>
    <tr>
      <td><strong>Warlock</strong></td>
      <td>贵族、诅咒、饥渴感、交易感，叙事上几乎天然贴合。</td>
      <td>如果你更重视角色氛围，这一类很香。</td>
    </tr>
    <tr>
      <td><strong>Monk</strong></td>
      <td>移动幻想非常帅，只是咬击本身不是它最优伤害按钮。</td>
      <td>偏风格型选择，帅，但不算最优解。</td>
    </tr>
  </tbody>
</table>

<p>如果你还在横向对比底盘，下一篇我建议直接看我们的 <a href="${ZH_DND_CLASSES_PATH}">DND 职业详解</a>。如果你打算把 Dhampir 往咬击续航、专注检定或前排耐久去靠，那篇 <a href="${ZH_DND_CONSTITUTION_PATH}">D&amp;D Constitution 指南</a> 也应该一起打开。</p>

<section class="mt-10 rounded-[30px] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
  <h2 class="font-display text-2xl text-stone-50" style="margin-top: 0;">Dhampir 玩家顺手会用到的工具</h2>
  <p class="mt-3 text-[0.98rem] leading-8 text-stone-300">如果你想快速试一下咬击后的补血量、下一次关键检定怎么垫，或者纯粹想跑一段 rooftop chase 的奇怪骰点，我建议直接开站内的 <a href="${ZH_DICE_ROLLER_PATH}">D&amp;D Dice Roller</a>。Dhampir 经常会把原本普通的移动和保命局面，变成需要马上判断的小战术题。</p>
</section>

<h2>我会怎么演一个 Dhampir，才不会让全桌烦躁</h2>
<p>一个好玩的 <strong>dnd dhampir</strong>，应该同时有“饥饿感”和“克制感”。它不需要一直阴沉、一直威胁人，更不需要每场戏都把自己演成队伍定时炸弹。</p>

<p>官方在 <a href="${DND_DHAMPIR_VAMPIRE_URL}" rel="noreferrer noopener">D&amp;D Beyond 的吸血鬼角色文章</a> 里给了不少灵感，但我自己带团时更推荐一个简单原则：让饥渴制造 <strong>场景</strong>，不要让它变成 <strong>借口</strong>。选一种明确的 hunger，给它边界，再让队友知道底线在哪里，整个角色会稳很多。</p>

<ul>
  <li><strong>只选一种饥渴：</strong>血液、梦境、精神能量，或者别的单一欲望，都比“什么都想吃”更好演。</li>
  <li><strong>提前给自己设限：</strong>比如绝不伤害无辜者，绝不在队友睡觉时进食。</li>
  <li><strong>公开场合多用克制：</strong>越克制，越吓人。</li>
  <li><strong>把 hunger 当代价，不是当捣乱理由：</strong>它应该制造戏，而不是毁掉队伍计划。</li>
  <li><strong>给角色一个日常习惯：</strong>手套、热茶、固定进食规则、祷告习惯，这些都能让人物更落地。</li>
</ul>

<h2>做 DND Dhampir 最容易踩的坑</h2>
<p>最常见的 <strong>dnd dhampir</strong> 误区，就是把咬击当成整套战斗轮转的核心。它扛不起这个职责。</p>

<ul>
  <li><strong>坑 1：</strong>把它当纯输出种族，而不是“机动 + 压迫 + 收尾”的谱系。</li>
  <li><strong>坑 2：</strong>明明咬击吃 Constitution，却还是把 Con 点得过低。</li>
  <li><strong>坑 3：</strong>忘了这个谱系最强的回合，往往来自墙、梁、平台和天花板。</li>
  <li><strong>坑 4：</strong>把角色演成全天候血怒状态，很快就会让桌上其他人疲劳。</li>
</ul>

<section class="mt-12 rounded-[34px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
  <h2 class="font-display text-2xl sm:text-3xl text-stone-50" style="margin-top: 0;">FAQ：关于 DND Dhampir 的高频问题</h2>

  <div class="mt-6 space-y-4">
    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Dhampir 在 D&amp;D 5e 里算 Undead 吗？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">不算。玩家角色的 Dhampir 默认是 <strong>Humanoid</strong>，不是 Undead，所以它才能很自然地塞进常规队伍和大多数战役里。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Dhampir 可以靠 Vampiric Bite 回血吗？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">可以。只要你咬中的目标符合条件，而且你选择的是治疗分支，咬击就能按造成的穿刺伤害把生命值回给你。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Dhampir 真的能在墙上和天花板上移动吗？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">能。3 级以后，Dhampir 可以在垂直表面和天花板上移动，而且双手保持空闲，这一点的战术价值比很多人想象得更大。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">什么职业最适合 DND Dhampir？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">如果你要最顺的主题和手感，优先看 Rogue 或 Gloom Stalker Ranger；如果你要最稳的底盘，Fighter 反而是最不容易翻车的答案。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">DND Dhampir 需要呼吸吗？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">不需要。<em>Deathless Nature</em> 让 Dhampir 不需要呼吸，所以在水下、烟雾、毒气和封闭环境里，它经常比普通角色从容得多。</p>
    </article>
  </div>
</section>

<h2>延伸观看</h2>
<p>如果你看完这篇，还想顺手再看一条更轻松一点的 D&amp;D 视频，下面这条可以当作补充。它更偏职业气质和桌面氛围，适合看完正文后放松一下继续看：<a href="${DND_DHAMPIR_VIDEO_URL}" rel="noreferrer noopener">How DM&rsquo;s react to what Class you play in Dungeons and Dragons</a>。</p>

${liteVideoEmbed('ZXcwHPW3GR8', "How DM's react to what Class you play in Dungeons and Dragons")}
`;
