import {
  DND_GRUNG_LEAP_IMAGE_PATH,
  DND_GRUNG_POISON_IMAGE_PATH,
  DND_GRUNG_VIDEO_PLACEHOLDER_PATH,
  DND_GRUNG_SOURCE_URL,
  DND_GRUNG_WIKI_URL,
  DND_GRUNG_VIDEO_URL,
  EN_DND_CLASSES_PATH,
  EN_DND_CONSTITUTION_PATH,
  EN_EDITOR_PATH,
  EN_DICE_ROLLER_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_DND_CONSTITUTION_PATH,
  ZH_EDITOR_PATH,
  ZH_DICE_ROLLER_PATH,
  liteVideoEmbed,
} from './shared';

export const dndGrungArticleHtml = String.raw`
<p>If you searched for <strong>dnd grung</strong>, you probably want the fast answer first: is this frogfolk race actually worth asking your DM about, what makes it strong in play, and what makes some tables hesitate? This guide answers those questions up front, then gets practical. In my experience, a <strong>dnd grung</strong> is fun when you treat it like a mobility-and-pressure pick, not a novelty costume with poison skin.</p>

<p>This page is built for encyclopedia-style search intent, so the quick reference comes first. After that, I break down the rules, the DM approval issues, the best classes, and the roleplay choices that make a <strong>dnd grung</strong> character memorable instead of exhausting.</p>

<table>
  <thead>
    <tr>
      <th>Need-to-know point</th>
      <th>Fast answer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>What is a DND Grung?</strong></td>
      <td>A <strong>dnd grung</strong> is a small poisonous frogfolk ancestry from <em>One Grung Above</em>, built around mobility, poison, and jungle flavor.</td>
    </tr>
    <tr>
      <td><strong>Is it official?</strong></td>
      <td>It was published by Wizards of the Coast, but outside the main core books, so DM approval matters more than usual.</td>
    </tr>
    <tr>
      <td><strong>Best dnd grung classes</strong></td>
      <td>Monk, Ranger, Fighter, and Rogue are the cleanest fits for most players.</td>
    </tr>
    <tr>
      <td><strong>Biggest strengths</strong></td>
      <td>Climb speed, standing leap, poison immunity, amphibious movement, and disruptive map control.</td>
    </tr>
    <tr>
      <td><strong>Biggest dnd grung drawback</strong></td>
      <td><em>Water Dependency</em> is real, and some DMs dislike how awkward the poison rules can get at the table.</td>
    </tr>
    <tr>
      <td><strong>Best campaign fit</strong></td>
      <td>Jungle, swamp, ruin, and vertical dungeon campaigns where movement matters.</td>
    </tr>
  </tbody>
</table>

<p><strong>Quick verdict:</strong> choose <strong>dnd grung</strong> if you want a race that changes movement, terrain, and DM rulings from session one. Avoid <strong>dnd grung</strong> if your table dislikes extra poison saves, daily logistics, or unusual player ancestries.</p>

<h2>What Is a DND Grung?</h2>
<p>A <strong>dnd grung</strong> is a small amphibious frogfolk character option best known for poisonous skin, powerful jumping, and a strict jungle-caste identity.</p>

<p>The race comes from <a href="${DND_GRUNG_SOURCE_URL}" rel="noreferrer noopener">One Grung Above on D&amp;D Beyond</a>, not from the Player&rsquo;s Handbook. For lore context, the <a href="${DND_GRUNG_WIKI_URL}" rel="noreferrer noopener">Forgotten Realms Wiki entry for grung</a> is useful because it gives you the broad setting picture: tropical habitat, caste-coded colors, and a culture that can feel alien even by D&amp;D standards.</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_GRUNG_LEAP_IMAGE_PATH}"
    alt="A dnd grung VTT token reference scene showing a frogfolk scout leaping between jungle ruin platforms with a poisoned dart"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>A dnd grung stops feeling like a joke race the moment the map has ledges, swamp channels, and vertical ruin geometry.</figcaption>
</figure>

<ul>
  <li><strong>Size:</strong> Small.</li>
  <li><strong>Main stat lean:</strong> Dexterity and Constitution in the original writeup.</li>
  <li><strong>Most important traits:</strong> poison immunity, poisonous skin, standing leap, amphibious breathing, climb speed, and water dependency.</li>
  <li><strong>Playstyle identity:</strong> a dnd grung works as a mobile skirmisher, awkward problem-solver, and chaos magnet for DMs who like clean encounter geometry.</li>
  <li><strong>Best fantasy:</strong> jungle scout, toxic ambusher, weird monk, or hyper-mobile hunter.</li>
</ul>

<h2>Is Grung Official in D&amp;D 5e?</h2>
<p>Yes, <strong>dnd grung</strong> was officially published by Wizards of the Coast, but it sits in a side supplement rather than a mainline player book.</p>

<p>That distinction matters. In practice, many players treat <strong>dnd grung</strong> as "official but optional" because it lives in <em>One Grung Above</em> instead of a core ancestry chapter. That is why experienced DMs often ask for a quick conversation before approving it, especially in long campaigns.</p>

<p>If you want the simplest rule-of-thumb, use this one: <strong>a dnd grung is published content, but not default content</strong>. Ask before building around it.</p>

<h2>What Will Your DM Care About Before Approving a DND Grung?</h2>
<p>Your DM will usually care about four things first: poison rulings, water dependency, campaign tone, and whether the race fits the setting.</p>

<p>This is also why the linked video works as a useful companion piece. Its whole angle is "how DMs react to the race you bring to the table," and that is exactly the right lens for <strong>dnd grung</strong>. A <strong>dnd grung</strong> is not controversial because it is weak. It gets reactions because it creates friction points that a DM has to actively manage.</p>

<ul>
  <li><strong>Poisonous Skin:</strong> direct contact and piercing-weapon interactions can create repeated save calls.</li>
  <li><strong>Water Dependency:</strong> the race needs one hour of immersion each day, which changes travel logistics immediately.</li>
  <li><strong>Tone fit:</strong> a brightly colored poison frog character can feel perfect in Chult and bizarre in a grim human court campaign.</li>
  <li><strong>Cultural fit:</strong> the grung caste system is strong flavor, but not every table wants to unpack that much social baggage.</li>
  <li><strong>Language edge case:</strong> rules-as-written Grung is not always as socially plug-and-play as common player races, so your DM may want to settle that at session zero.</li>
</ul>

<section class="mt-10 rounded-[30px] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
  <h3 class="font-display text-2xl text-stone-50" style="margin-top: 0;">My DM Approval Checklist for a DND Grung</h3>
  <p class="mt-3 text-[0.98rem] leading-8 text-stone-300">Before I lock in a <strong>dnd grung</strong> character, I ask four direct questions: Are you using the original poison wording, how strict are you about water immersion, does the setting have room for a jungle frogfolk outsider, and are we smoothing the language issue? Those four answers tell you almost everything about whether the build will be fun or annoying.</p>
</section>

<h2>Which DND Grung Traits Actually Matter in Play?</h2>
<p>The best way to evaluate a <strong>dnd grung</strong> is not by reading the trait list once. It is by asking which traits still matter after round three, during travel, and in scenes where the map is not flat.</p>

<h3>Poisonous Skin and poison immunity are the headline traits</h3>
<p><strong>Poisonous Skin</strong> is the reason <strong>dnd grung</strong> gets so much attention. The short version is simple: creatures that touch you can be forced into a save, and your poison can also be applied to piercing weapon attacks for extra poison damage.</p>

<p>The practical takeaway is even simpler. A <strong>dnd grung</strong> punishes grapples, rewards repeated attack patterns, and makes otherwise ordinary turns feel annoying in a way many DMs notice fast. Meanwhile, <strong>poison immunity</strong> is just excellent defense. It quietly carries a lot of value over a long campaign.</p>

<figure class="inline-figure inline-figure--square-crop">
  <img
    class="inline-figure__image inline-figure__image--square"
    src="${DND_GRUNG_POISON_IMAGE_PATH}"
    alt="Close-up dnd grung VTT portrait reference of a poisonous frogfolk coating a dart with glowing green toxin"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>The poison trait is the flashy part, but the real table question is how often your DM wants to resolve all the contact saves it creates.</figcaption>
</figure>

<h3>Standing Leap and climb speed are what make Grung feel different</h3>
<p><strong>Standing Leap</strong> gives Grung a long jump up to 25 feet and a high jump up to 15 feet without a running start. Add a 25-foot climb speed, and the race stops moving like a normal Small character.</p>

<p>At my tables, this is the real payoff. A <strong>dnd grung</strong> is strongest when the battlefield includes ledges, trees, balconies, scaffolding, swamp roots, or ruined stonework. On a flat road, Grung is interesting. In vertical terrain, Grung becomes a real tactical headache.</p>

<h3>Amphibious movement is nice, but Water Dependency changes the campaign more</h3>
<p><strong>Amphibious</strong> is great. Breathing air and water opens up some very fun scenes. But the trait that actually changes day-to-day play is <strong>Water Dependency</strong>.</p>

<p>If your <strong>dnd grung</strong> does not immerse in water for at least one hour during the day, the race takes a level of exhaustion at day&rsquo;s end. That means the question is never "does this matter?" The real question is "how often will the campaign make this inconvenient?"</p>

<ul>
  <li><strong>In jungle or river campaigns:</strong> Water Dependency is often flavor with a little planning.</li>
  <li><strong>In desert, city, or prison arcs:</strong> it becomes a recurring logistics tax.</li>
  <li><strong>In one-shots:</strong> it barely matters unless the DM wants it to.</li>
  <li><strong>In survival campaigns:</strong> it can become one of the race&rsquo;s defining pressures.</li>
</ul>

<h3>The language issue is more important than it looks</h3>
<p>One <strong>dnd grung</strong> detail many players miss is that this race is not as socially frictionless as elf, dwarf, or human. Depending on how strictly your table reads the original writeup, language can become a real early-game problem.</p>

<p>I do not think this is a deal-breaker. I do think it deserves an explicit session-zero ruling. If the DM wants Grung to feel strange, keep it. If the campaign needs faster integration, smooth it out and move on.</p>

<h2>Best Classes for a DND Grung in 5e</h2>
<p>The best <strong>dnd grung</strong> classes are the ones that convert movement, poison pressure, and Dexterity/Constitution value into reliable turns.</p>

<table>
  <thead>
    <tr>
      <th>Class</th>
      <th>Why it works</th>
      <th>My take</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Monk</strong></td>
      <td>Movement, repeated attacks, weird angles, and skin-contact flavor all line up extremely well.</td>
      <td>If you want the funniest and most distinct dnd grung table feel, Monk is hard to beat.</td>
    </tr>
    <tr>
      <td><strong>Ranger</strong></td>
      <td>Dex/Con synergy, terrain play, and ambush rhythm make the race feel natural.</td>
      <td>Gloom Stalker is the cleanest answer if you want menace instead of comedy.</td>
    </tr>
    <tr>
      <td><strong>Fighter</strong></td>
      <td>A stable chassis lets the racial traits add pressure without carrying the whole build.</td>
      <td>This is the safest recommendation if you want dnd grung mechanics with less risk.</td>
    </tr>
    <tr>
      <td><strong>Rogue</strong></td>
      <td>Mobility and vertical approach paths fit beautifully, even if you do not maximize poison triggers.</td>
      <td>Excellent if your dnd grung fantasy is "toxic frog assassin" instead of "frog blender."</td>
    </tr>
    <tr>
      <td><strong>Druid</strong></td>
      <td>The jungle flavor fits, but the stat synergy is less efficient than the martial options.</td>
      <td>Pick this for theme first, not because it is the sharpest optimization shell.</td>
    </tr>
  </tbody>
</table>

<p>If you are still comparing race-class shells, our <a href="${EN_DND_CLASSES_PATH}">DND classes guide</a> is the next tab I would open. If your <strong>dnd grung</strong> build is leaning toward concentration, survivability, or a higher Constitution floor, the more useful companion is our <a href="${EN_DND_CONSTITUTION_PATH}">D&amp;D Constitution guide</a>.</p>

<h2>How to Make a Better DND Grung Token for VTT Play</h2>
<p>A good <strong>dnd grung</strong> token needs to read as poisonous, mobile, and small even when it is reduced to a one-inch square on a VTT map.</p>

<p>This is where I would treat a <strong>dnd grung</strong> differently from a generic humanoid portrait. The silhouette matters more than facial detail. A crouched pose, bright skin contrast, a visible dart or spear, and a darker swamp or ruin background all help the token stay readable in Roll20, Foundry VTT, or Owlbear Rodeo.</p>

<ul>
  <li><strong>Use a clear outline:</strong> dnd grung is small, so avoid busy shoulder armor and cluttered plants around the head.</li>
  <li><strong>Push the poison color:</strong> green, yellow, blue, or red accents help the token communicate threat at small scale.</li>
  <li><strong>Keep the weapon visible:</strong> a dart, blowgun, shortsword, or spear tells the table how this creature fights.</li>
  <li><strong>Crop tighter than usual:</strong> for a dnd grung PC token, face, hands, and weapon should win over full-body detail.</li>
  <li><strong>Export at 512 first:</strong> that is enough for most live VTT sessions; use 1024 when you want a cleaner campaign archive.</li>
</ul>

<p>You can build the token in the <a href="${EN_EDITOR_PATH}">Token Maker editor</a> by uploading your <strong>dnd grung</strong> art, choosing a circular or hex mask, and using a thin high-contrast border so the frogfolk silhouette does not disappear into swamp maps. If your table is testing poison damage or jump-and-attack turns at the same time, keep the <a href="${EN_DICE_ROLLER_PATH}">D&amp;D dice roller</a> open in another tab.</p>

<section class="mt-10 rounded-[30px] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
  <h3 class="font-display text-2xl text-stone-50" style="margin-top: 0;">Useful Tool for Grung Builds</h3>
  <p class="mt-3 text-[0.98rem] leading-8 text-stone-300">If you want to test poison damage, jump-and-attack turns, or concentration checks without slowing your table down, use the on-site <a href="${EN_DICE_ROLLER_PATH}">D&amp;D dice roller</a>. I use it for oddball race interactions because <strong>dnd grung</strong> creates more "wait, how does this resolve?" moments than most race picks.</p>
</section>

<h2>How I Would Roleplay a DND Grung Without Turning It Into a Joke</h2>
<p>The easiest mistake with <strong>dnd grung</strong> is playing it like a meme first and a person second. Frog energy is funny for ten minutes. A character with actual priorities lasts a whole campaign.</p>

<p>What works better is choosing one strong anchor and building around it. In practice, I think the best <strong>dnd grung</strong> roleplay usually starts with one of three angles: caste exile, practical hunter, or hyper-formal outsider who reads social rules too literally.</p>

<ul>
  <li><strong>Pick one relationship to the caste system:</strong> loyalist, exile, skeptic, or escapee.</li>
  <li><strong>Decide how your dnd grung sees other peoples:</strong> prey, curiosity, trade partners, or confusing equals.</li>
  <li><strong>Give the character one ritual habit:</strong> cleaning skin, sorting colors, measuring water, or ranking every room by threat.</li>
  <li><strong>Keep the alien flavor, but keep the teamwork:</strong> strange is good, sabotage is not.</li>
  <li><strong>Lean into physicality:</strong> stillness, sudden hops, wall-clinging, and short blunt statements all help sell the dnd grung race fast.</li>
</ul>

<h2>Common DND Grung Mistakes</h2>
<p>The most common <strong>dnd grung</strong> mistake is assuming the race will carry a weak build on its own. It will not.</p>

<ul>
  <li><strong>Mistake 1:</strong> choosing dnd grung for poison alone and then putting it on a build with very few meaningful attacks.</li>
  <li><strong>Mistake 2:</strong> forgetting to ask about dnd grung Water Dependency before the campaign starts.</li>
  <li><strong>Mistake 3:</strong> picking dnd grung for a flat urban campaign where climb speed and leap distance rarely matter.</li>
  <li><strong>Mistake 4:</strong> roleplaying dnd grung as comic relief with no center.</li>
  <li><strong>Mistake 5:</strong> assuming every DM will allow the original wording without modification.</li>
</ul>

<section class="mt-12 rounded-[34px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
  <h2 class="font-display text-2xl sm:text-3xl text-stone-50" style="margin-top: 0;">FAQ About DND Grung</h2>

  <div class="mt-6 space-y-4">
    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Is DND Grung official in D&amp;D 5e?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">Yes. <strong>dnd grung</strong> was published by Wizards of the Coast in <em>One Grung Above</em>, but because it is outside the main player books, many tables still treat it as ask-first content.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Does a DND Grung need water every day?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">Yes. A <strong>dnd grung</strong> needs to immerse in water for at least one hour each day or it suffers a level of exhaustion at the end of that day.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Is DND Grung poison overpowered?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">It can feel overpowered at some tables, especially at low levels or in games with many contact and grappling situations. In practice, the bigger issue is often bookkeeping and repeated save calls, not raw damage alone.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">What is the best class for a DND Grung?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">Monk is the most distinctive fit, Ranger is the most natural hunter fit, and Fighter is the safest all-around pick if you want the racial traits without build drama.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Can a DND Grung speak Common?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">That depends on how strictly your table handles the original writeup. Many DMs smooth this out for playability, but it is worth settling before session one instead of during the first tavern scene.</p>
    </article>
  </div>
</section>

<h2>Watch: Why DND Grung Gets Such a Strong DM Reaction</h2>
<p>If you want a lighter follow-up after the guide, this video is the right kind of companion watch. It approaches race choice from the DM-reaction angle, which fits <strong>dnd grung</strong> better than a pure optimization lens. That is exactly the conversation a <strong>dnd grung</strong> usually triggers at real tables: not "is it possible?" but "what kind of energy does this bring into the campaign?" You can watch it on <a href="${DND_GRUNG_VIDEO_URL}" rel="noreferrer noopener">YouTube here</a>, or use the embed below.</p>

${liteVideoEmbed('EVwBW5GbGwQ', "How DM's react to what Race you play in Dungeons and Dragons", {
  src: DND_GRUNG_VIDEO_PLACEHOLDER_PATH,
  alt: 'Clickable webp video cover for a dnd grung guide showing a frogfolk scout aiming a poisoned dart across flooded jungle ruins',
})}
`;

export const dndGrungArticleHtmlZh = String.raw`
<p>如果你搜的是 <strong>dnd grung</strong>，大概率最想先确认三件事：这个青蛙人种族到底值不值得玩，它在实战里强在哪里，以及为什么不少 DM 会先犹豫一下。本文会先把这些问题讲清楚，再往下拆规则。按我的实际跑团体验，Grung 好玩不是因为它“很怪”，而是因为它把机动、毒素压迫和地形利用绑在了一起。</p>

<p>这篇内容按百科页的搜索意图来写，所以最前面先给速查表。后面再分别解决四个核心问题：<strong>dnd grung</strong> 到底是什么、DM 最在意什么、哪些职业最顺手、以及这个角色该怎么演才不会只剩下搞笑梗。</p>

<table>
  <thead>
    <tr>
      <th>你最想知道的点</th>
      <th>快速答案</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>DND Grung 是什么？</strong></td>
      <td>一个出自 <em>One Grung Above</em> 的小型毒蛙人种族，核心卖点是高机动、毒素和浓烈的丛林风格。</td>
    </tr>
    <tr>
      <td><strong>它算官方吗？</strong></td>
      <td>算官方发布内容，但不在常规核心玩家书里，所以比普通种族更依赖 DM 点头。</td>
    </tr>
    <tr>
      <td><strong>最适合的职业</strong></td>
      <td>Monk、Ranger、Fighter 和 Rogue 是大多数玩家最容易玩顺的答案。</td>
    </tr>
    <tr>
      <td><strong>最大优势</strong></td>
      <td>攀爬速度、Standing Leap、毒素免疫、两栖能力，以及很烦人的地图压迫感。</td>
    </tr>
    <tr>
      <td><strong>最大缺点</strong></td>
      <td><em>Water Dependency</em> 不是摆设，而且毒皮规则会让部分 DM 觉得结算麻烦。</td>
    </tr>
    <tr>
      <td><strong>最适合的战役</strong></td>
      <td>丛林、沼泽、遗迹、垂直地形多的地城，比纯平地战役更能发挥它的价值。</td>
    </tr>
  </tbody>
</table>

<h2>DND Grung 是什么？</h2>
<p><strong>dnd grung</strong> 是 D&amp;D 5e 里的小型两栖蛙人角色选项，最出名的特点是毒皮、夸张的跳跃能力，以及非常强烈的丛林部族气质。</p>

<p>这个种族来自 <a href="${DND_GRUNG_SOURCE_URL}" rel="noreferrer noopener">D&amp;D Beyond 上的 <em>One Grung Above</em></a>，不是《玩家手册》里的常规种族。想补背景设定的话，<a href="${DND_GRUNG_WIKI_URL}" rel="noreferrer noopener">Forgotten Realms Wiki 的 grung 条目</a> 很值得顺手打开，它会把丛林栖息地、颜色阶层和文化差异讲得更完整。</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_GRUNG_LEAP_IMAGE_PATH}"
    alt="DND grung 的 VTT Token 参考图，一名毒蛙人侦察兵在丛林遗迹平台之间跃起并举起毒镖"
    width="1536"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Grung 一旦遇到断桥、石台、沼泽沟和垂直遗迹，就会立刻从“怪种族”变成“地图麻烦制造者”。</figcaption>
</figure>

<ul>
  <li><strong>体型：</strong>Small。</li>
  <li><strong>原始属性倾向：</strong>原始写法更偏 Dexterity 和 Constitution。</li>
  <li><strong>最关键的种族特性：</strong>毒素免疫、Poisonous Skin、Standing Leap、两栖呼吸、攀爬速度、Water Dependency。</li>
  <li><strong>玩法定位：</strong>高机动游击手、带点烦人压迫感的奇怪角色、很容易让 DM 重新看地图的种族。</li>
  <li><strong>最顺的幻想方向：</strong>丛林侦察兵、毒箭伏击者、怪异武僧，或者行动路线非常不讲武德的猎手。</li>
</ul>

<h2>Grung 在 D&amp;D 5e 里算官方内容吗？</h2>
<p>算。<strong>dnd grung</strong> 确实是 Wizards of the Coast 发布过的内容，只是它来自一个边缘补充资料，而不是最常见的核心玩家书。</p>

<p>这个差别很重要。实战里很多人会把 Grung 理解成“官方，但不是默认开放”的角色选项，因为它并不在最标准的玩家种族列表里。也正因为这样，老一点的 DM 通常都会先问你几句，再决定要不要放行。</p>

<p>最简单的判断方式就是这句：<strong>Grung 是官方内容，但不是默认内容。</strong> 真要玩，先问 DM。</p>

<h2>DM 在放行 DND Grung 前最在意什么？</h2>
<p>一个 DM 在看见 <strong>dnd grung</strong> 角色卡时，通常最先在意四件事：毒素规则、Water Dependency、战役调性，以及这个种族跟世界观到底合不合。</p>

<p>这也是为什么表格里那条视频值得挂在文末。它的核心视角其实就是“DM 会怎么理解你带来的种族能量”，而这正好是 Grung 最真实的问题。Grung 不会让人皱眉，是因为它太弱；恰恰相反，是因为它会制造额外的判定、额外的物流问题和额外的桌面氛围。</p>

<ul>
  <li><strong>Poisonous Skin：</strong>直接接触和穿刺武器附毒，会让战斗里多出一串 saving throw。</li>
  <li><strong>Water Dependency：</strong>每天要泡水 1 小时，这会立刻影响旅行和长期冒险节奏。</li>
  <li><strong>调性匹配：</strong>在 Chult 这种地方，彩色毒蛙人完全合理；在灰暗人类宫廷剧里，可能会显得非常突兀。</li>
  <li><strong>文化负担：</strong>Grung 的颜色阶层和部族结构很有味道，但不是每桌都想处理这么重的设定包袱。</li>
  <li><strong>语言问题：</strong>按原写法严格跑的话，Grung 在社交上不如常规玩家种族那么顺滑，这个最好开团前就说清楚。</li>
</ul>

<section class="mt-10 rounded-[30px] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
  <h3 class="font-display text-2xl text-stone-50" style="margin-top: 0;">我会先问 DM 的四个问题</h3>
  <p class="mt-3 text-[0.98rem] leading-8 text-stone-300">如果我要认真玩 Grung，我会先确认四件事：毒皮到底按多严格的原文跑、泡水要求有没有放宽、这个世界观里有没有丛林蛙人存在空间、语言问题要不要平滑处理。基本上，这四个回答就决定了你这张卡是“很好玩”，还是“每一幕都在卡规则”。</p>
</section>

<h2>哪些 DND Grung 特性在实战里最值钱？</h2>
<p>判断一个 <strong>dnd grung</strong> 强不强，最好的方式不是把种族特性念一遍，而是看这些能力在第三轮战斗后、在旅行途中、以及在非平地地图上还剩多少价值。</p>

<h3>Poisonous Skin 和毒素免疫，是最抓眼球的两条</h3>
<p><strong>Poisonous Skin</strong> 是 Grung 最容易让人记住的地方。简单说，就是别人碰你会吃豁免，你自己也能把毒素挂到穿刺武器攻击上，补额外毒伤。</p>

<p>更实战一点的说法是：Grung 会让抱摔、贴身接触和高频攻击都变得更烦人。与此同时，<strong>毒素免疫</strong> 其实也非常值钱，它不像毒皮那样抢眼，但打长战役时经常能救你整段流程。</p>

<figure class="inline-figure inline-figure--square-crop">
  <img
    class="inline-figure__image inline-figure__image--square"
    src="${DND_GRUNG_POISON_IMAGE_PATH}"
    alt="DND grung 的 VTT 头像参考特写，一只毒蛙人正在把绿色毒液抹到飞镖尖端"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Grung 最花哨的是毒，但真正会让桌面停下来讨论的，是这些接触豁免到底要多频繁地结算。</figcaption>
</figure>

<h3>Standing Leap 和攀爬速度，才是 Grung 真正有辨识度的地方</h3>
<p><strong>Standing Leap</strong> 让 Grung 不需要助跑，就能完成最长 25 尺远跳和最高 15 尺高跳。再叠上 25 尺攀爬速度，它就根本不像一个正常的小体型角色在移动。</p>

<p>按我的实测，这才是它最强的部分。一个 <strong>dnd grung</strong> 一旦遇到平台、树根、断桥、阳台、脚手架或者废墟石柱，整张地图的走法都会变得不一样。放在平地上，它只是有趣；放在垂直地形里，它就会开始恶心人。</p>

<h3>两栖能力很舒服，但真正改变战役体验的是 Water Dependency</h3>
<p><strong>Amphibious</strong> 当然很好用。能同时在空气和水里呼吸，意味着很多场景天然更有发挥空间。但真正在日常里改变体验的，反而是 <strong>Water Dependency</strong>。</p>

<p>如果 Grung 一天里没有至少泡水 1 小时，那么当天结束时就会吃 1 级 exhaustion。也就是说，问题从来不是“这条会不会触发”，而是“这个战役会不会让它一直不方便”。</p>

<ul>
  <li><strong>在丛林、河道、沼泽团里：</strong>Water Dependency 通常只是有点味道的日常管理。</li>
  <li><strong>在沙漠、城市、监狱、长途封闭章节里：</strong>它会立刻变成物流税。</li>
  <li><strong>在 one-shot 里：</strong>除非 DM 故意卡你，不然通常不太痛。</li>
  <li><strong>在生存导向战役里：</strong>它会直接变成这个种族的核心压力源之一。</li>
</ul>

<h3>语言问题比很多人想的更重要</h3>
<p>很多第一次看 <strong>dnd grung</strong> 的玩家，会忽略一个点：它不像 elf、dwarf、human 那样天然就是“进城就能正常社交”的种族。按原文严格执行的话，语言问题很可能在前几幕就开始卡你。</p>

<p>我不觉得这是不能玩的理由，但我非常建议在 session zero 先说开。如果 DM 想保留它的异质感，就保留；如果整个战役更需要流畅互动，那就直接平滑处理，不要拖到第一场 tavern 戏再吵。</p>

<h2>最适合 DND Grung 的职业</h2>
<p>最顺手的 <strong>dnd grung</strong> 职业，基本都是那些能把机动、毒素压迫和 Dexterity / Constitution 价值稳定变现成每回合收益的底盘。</p>

<table>
  <thead>
    <tr>
      <th>职业</th>
      <th>为什么契合</th>
      <th>我的判断</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Monk</strong></td>
      <td>高机动、多段攻击、奇怪进场角度，再加上“毒皮近身感”，整套手感都非常搭。</td>
      <td>如果你想要最有辨识度、最像 Grung 本体的桌面体验，Monk 很难输。</td>
    </tr>
    <tr>
      <td><strong>Ranger</strong></td>
      <td>Dex / Con 契合度高，地形利用和伏击节奏也都很顺。</td>
      <td>如果你想要更偏猎手和威胁感，而不是偏搞怪，Gloom Stalker 很漂亮。</td>
    </tr>
    <tr>
      <td><strong>Fighter</strong></td>
      <td>底盘够稳，能让种族特性成为加分项，而不是整套构筑唯一依赖。</td>
      <td>如果你只是想把 Grung 机制玩顺，不想整张卡都压在种族 gimmick 上，这是最稳答案。</td>
    </tr>
    <tr>
      <td><strong>Rogue</strong></td>
      <td>高机动和垂直切入路线非常适合它，就算不把毒素压榨到极限也很好玩。</td>
      <td>如果你脑子里的画面是“毒蛙刺客”，那这个职业会很顺。</td>
    </tr>
    <tr>
      <td><strong>Druid</strong></td>
      <td>主题上很配，但从纯效率看，没有前面几类职业那么紧密。</td>
      <td>更适合因为氛围和设定喜欢它，而不是因为它是最锐利的优化答案。</td>
    </tr>
  </tbody>
</table>

<p>如果你还在横向比较 race + class 的底盘，下一篇我建议直接开我们的 <a href="${ZH_DND_CLASSES_PATH}">DND 职业详解</a>。如果你的 Grung 更想往生存、专注检定或者更高的 Constitution 去靠，那篇 <a href="${ZH_DND_CONSTITUTION_PATH}">D&amp;D Constitution 指南</a> 会更有帮助。</p>

<h2>如何为 VTT 做一个更清晰的 Grung Token</h2>
<p>一个好用的 <strong>dnd grung</strong> Token，在 VTT 地图上缩到一格大小时，也应该能让玩家一眼看出三件事：它有毒、它很灵活、它不是普通矮小人形怪。</p>

<p>所以我不会把 Grung 当成普通半身像去裁。它更需要清楚的轮廓、明显的皮肤色块、能看见的毒镖或短矛，以及不要抢主体的沼泽或遗迹背景。这样放进 Roll20、Foundry VTT 或 Owlbear Rodeo 时，Token 才不会被地图纹理吞掉。</p>

<ul>
  <li><strong>轮廓要干净：</strong>Grung 本来就小，头部周围不要塞太多叶子、肩甲和杂物。</li>
  <li><strong>毒素色要明显：</strong>绿色、黄色、蓝色或红色的皮肤和毒液点缀，能让威胁感在小尺寸下也读得出来。</li>
  <li><strong>武器最好露出来：</strong>飞镖、吹箭、短剑或长矛，会立刻告诉玩家它大概怎么打。</li>
  <li><strong>裁切要比普通角色更紧：</strong>Grung PC Token 优先保留脸、手和武器，不要为了全身细节牺牲可读性。</li>
  <li><strong>先导出 512：</strong>多数实际跑团已经够用；如果你要做长期素材库或角色档案，再导出 1024。</li>
</ul>

<p>你可以在 <a href="${ZH_EDITOR_PATH}">Token Maker 编辑器</a> 里上传 Grung 图，选择圆形或六边形裁切，再配一圈高对比度细边框，让毒蛙人的轮廓在沼泽地图上更清楚。如果你同时还在测试毒伤、跳跃进场或专注判定，可以把 <a href="${ZH_DICE_ROLLER_PATH}">D&amp;D Dice Roller</a> 一起打开。</p>

<section class="mt-10 rounded-[30px] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
  <h3 class="font-display text-2xl text-stone-50" style="margin-top: 0;">Grung 构筑会顺手用到的工具</h3>
  <p class="mt-3 text-[0.98rem] leading-8 text-stone-300">如果你想快速试一下毒伤、跳跃进场、或者专注判定，不想在桌上把节奏拖慢，我建议直接开站内的 <a href="${ZH_DICE_ROLLER_PATH}">D&amp;D Dice Roller</a>。Grung 特别容易制造“等一下，这回合到底怎么算”的小判定，这种时候工具就很省事。</p>
</section>

<h2>我会怎么演 DND Grung，才不会只剩下一个梗</h2>
<p>玩 <strong>dnd grung</strong> 最容易翻车的方式，就是把它当成一个 meme 先玩，再把角色本身往后放。青蛙感可以好笑十分钟，但一个只有梗没有核心的人物，撑不了整段战役。</p>

<p>更好用的做法，是先选一个真正的角色锚点，再把 Grung 的异质感挂上去。按我的经验，最好用的三种切口分别是：阶层流亡者、务实猎手，以及那种过度守规矩、把别人的社交习惯全都理解错的外来者。</p>

<ul>
  <li><strong>先决定你和阶层制度的关系：</strong>拥护者、逃离者、怀疑者，还是干脆被放逐的人。</li>
  <li><strong>再决定你怎么看其他种族：</strong>猎物、交易对象、奇怪盟友，还是根本看不懂的平等者。</li>
  <li><strong>给角色一个固定仪式感：</strong>清理皮肤、整理颜色、计算水量、给每个房间按危险等级打分，都很好用。</li>
  <li><strong>保留异质感，但不要破坏团队：</strong>奇怪是优点，故意捣乱不是。</li>
  <li><strong>多用身体语言去卖这个种族：</strong>长时间静止、突然跳动、贴墙停顿、短句表达，都很有效。</li>
</ul>

<h2>做 DND Grung 最容易踩的坑</h2>
<p>最常见的 <strong>dnd grung</strong> 误区，就是以为这个种族本身足够离谱，所以就能把一套本来不顺的构筑硬抬起来。它做不到。</p>

<ul>
  <li><strong>坑 1：</strong>只看中毒皮，却把它放进一套几乎没有有效攻击频率的构筑里。</li>
  <li><strong>坑 2：</strong>开团前没跟 DM 先确认 Water Dependency，结果进团后每个旅行章节都在补规则漏洞。</li>
  <li><strong>坑 3：</strong>把 Grung 带进纯城市平地团，结果攀爬和大跳几乎没有发挥空间。</li>
  <li><strong>坑 4：</strong>把角色整天演成 comic relief，最后只剩一张搞笑皮套。</li>
  <li><strong>坑 5：</strong>默认所有 DM 都会毫无修改地直接放原始毒素写法。</li>
</ul>

<section class="mt-12 rounded-[34px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
  <h2 class="font-display text-2xl sm:text-3xl text-stone-50" style="margin-top: 0;">FAQ：关于 DND Grung 的高频问题</h2>

  <div class="mt-6 space-y-4">
    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Grung 在 D&amp;D 5e 里算官方种族吗？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">算。Grung 来自 Wizards of the Coast 发布的 <em>One Grung Above</em>，但因为它不在主流核心玩家书里，所以很多桌还是会把它当成“先问 DM”的内容。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">DND Grung 真的每天都要泡水吗？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">是的。按原始规则，Grung 每天都要至少浸入水中 1 小时，否则当天结束时会吃 1 级 exhaustion。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Grung 的毒是不是太超模了？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">在某些桌上会显得超模，尤其是低等级或者接触、抱摔很多的环境里。但实战里更常见的问题其实不是纯数值，而是它会制造很多额外结算和 saving throw。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">什么职业最适合 DND Grung？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">如果你要最有辨识度的手感，Monk 很强；如果你要最自然的猎手路线，Ranger 更顺；如果你只想稳稳地把种族特性用起来，Fighter 是最不容易翻车的答案。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">DND Grung 能直接说 Common 吗？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">这取决于你们桌子对原文的执行方式。很多 DM 会为了可玩性把它平滑掉，但最好的做法还是在 session zero 先讲清楚，而不是等进城以后才临时吵。</p>
    </article>
  </div>
</section>

<h2>延伸观看：为什么 Grung 总会让 DM 先皱一下眉</h2>
<p>如果你看完正文还想用更轻松的方式再补一层，这条视频很适合作为收尾。它用的是“DM 会怎么理解你带来的种族气质”这个角度，而不是纯堆数值，这和 <strong>dnd grung</strong> 的真实桌面处境非常贴合。Grung 真正引发讨论的点，往往不是“能不能玩”，而是“它会把整张桌的节奏和氛围往哪里带”。你可以直接去 <a href="${DND_GRUNG_VIDEO_URL}" rel="noreferrer noopener">YouTube 查看</a>，也可以直接看下面的嵌入版本。</p>

${liteVideoEmbed('EVwBW5GbGwQ', "How DM's react to what Race you play in Dungeons and Dragons", {
  src: DND_GRUNG_VIDEO_PLACEHOLDER_PATH,
  alt: 'DND grung 指南视频的可点击 webp 占位图，画面是一只毒蛙人侦察兵在被水淹没的丛林遗迹里举起毒镖',
})}
`;
