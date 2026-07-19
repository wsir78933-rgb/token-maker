import {
  DND_2024_TIEFLING_URL,
  EN_DND_CLASSES_PATH,
  EN_EDITOR_PATH,
  EN_DICE_ROLLER_PATH,
  MEPHISTOPHELES_CANIA_IMAGE_PATH,
  MEPHISTOPHELES_FR_WIKI_URL,
  MEPHISTOPHELES_VIDEO_PLACEHOLDER_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_EDITOR_PATH,
  ZH_DICE_ROLLER_PATH,
  liteVideoEmbed,
} from './shared';

export const dndMephistophelesArticleHtml = String.raw`
<p><strong>mephistopheles dnd</strong> is best understood as a campaign-level archdevil: ruler of Cania, master of hellfire, and the kind of patron who should make a table nervous before anyone rolls initiative. Start with the quick lore answer, then use the campaign notes to bring him into play without turning the session into a lore lecture.</p>

<p>For the table answer: do not start with a full Mephistopheles boss fight. Start with a bargain, a proxy, a frozen room, or a contract that costs more than the party expected. That is where he becomes useful instead of merely famous.</p>

<table>
  <thead>
    <tr>
      <th>Need-to-know point</th>
      <th>Fast answer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Who is Mephistopheles?</strong></td>
      <td>Mephistopheles is an archdevil of the Nine Hells, usually tied to Cania, ice, arcane ambition, and hellfire.</td>
    </tr>
    <tr>
      <td><strong>Best table use</strong></td>
      <td>Use him as a patron, contract architect, endgame villain, or the unseen sponsor behind a cult.</td>
    </tr>
    <tr>
      <td><strong>What makes him different?</strong></td>
      <td>He is more than "a bigger devil." His hook is cold intelligence plus forbidden fire magic.</td>
    </tr>
    <tr>
      <td><strong>Can players connect to him?</strong></td>
      <td>Yes. A Fiend Warlock pact, legacy Mephistopheles tiefling flavor, or infernal family curse all fit.</td>
    </tr>
    <tr>
      <td><strong>Looking for a stat block?</strong></td>
      <td>Treat any Mephistopheles stat block as an endgame or table-approved source choice. For most campaigns, run an avatar, proxy, or contract hazard first.</td>
    </tr>
    <tr>
      <td><strong>Should you run him in direct combat?</strong></td>
      <td>Usually no. Use avatars, agents, contracts, and consequences until the campaign is truly high level.</td>
    </tr>
    <tr>
      <td><strong>One-line DM rule</strong></td>
      <td>If Mephistopheles appears, the scene should feel like a legal trap wrapped in supernatural temperature shock.</td>
    </tr>
  </tbody>
</table>

<h2>What Is Mephistopheles in DND?</h2>
<p><strong>Mephistopheles in DND is an archdevil associated with Cania, the icy eighth layer of the Nine Hells, and with a dangerous obsession for arcane power.</strong> The <a href="${MEPHISTOPHELES_FR_WIKI_URL}" rel="noreferrer noopener">Forgotten Realms Wiki overview</a> is useful for broad setting context, especially if you need quick lore before writing a session.</p>

<p>The important thing is the contrast. He is not a simple fire villain. The best Mephistopheles scenes mix <strong>freezing control, infernal contracts, and unstable hellfire research</strong>. That mix gives him a sharper identity than "red devil with horns."</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${MEPHISTOPHELES_CANIA_IMAGE_PATH}"
    alt="mephistopheles dnd lore image showing a frozen Cania archive with infernal contract sigils and hellfire light"
    width="1400"
    height="933"
    loading="lazy"
    decoding="async"
  />
  <figcaption>For a mephistopheles dnd session, I would make Cania feel like a frozen archive where every bargain is filed before the party understands the cost.</figcaption>
</figure>

<h2>How Should a DM Use Mephistopheles Without Overdoing It?</h2>
<p><strong>A DM should use Mephistopheles through pressure, bargains, proxies, and delayed consequences before using him as a direct boss fight.</strong> In my games, archdevils work best when the party feels their influence several sessions before seeing the name on a handout.</p>

<ul>
  <li><strong>Start with the offer.</strong> A spell, cure, resurrection, title, or battlefield advantage arrives with one sentence of fine print.</li>
  <li><strong>Make the price non-obvious.</strong> Do not ask for "your soul" immediately. Ask for a memory, a future favor, the right to define one word in a contract, or a harmless-looking signature.</li>
  <li><strong>Use cold imagery alongside fire.</strong> Cania should feel precise, silent, and hostile.</li>
  <li><strong>Let agents fail upward.</strong> A cultist, chain devil, imp lawyer, or ambitious mage can lose a fight and still advance the contract.</li>
  <li><strong>Keep the rules readable.</strong> If the bargain is too vague, players feel tricked by the DM. If it is clear but painful, players blame the devil.</li>
</ul>

<p>Mephistopheles is more interesting as a scheme than as a stat block. Build the situation first, then decide whether dice are needed.</p>

<h2>Mephistopheles vs Other Archdevils</h2>
<p><strong>Mephistopheles stands out because he feels like a magical researcher and contract predator rather than merely a ruler with armies.</strong> That makes him especially good for Wizard, Warlock, and forbidden-knowledge plots.</p>

<table>
  <thead>
    <tr>
      <th>Archdevil angle</th>
      <th>How it feels at the table</th>
      <th>When to choose Mephistopheles instead</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Asmodeus</strong></td>
      <td>Supreme law, cosmic tyranny, final authority.</td>
      <td>Choose Mephistopheles when the plot is about ambition under the throne, not the throne itself.</td>
    </tr>
    <tr>
      <td><strong>Dispater</strong></td>
      <td>Paranoia, iron defenses, impossible surveillance.</td>
      <td>Choose Mephistopheles when the enemy is experimenting, bargaining, and tempting mages.</td>
    </tr>
    <tr>
      <td><strong>Levistus</strong></td>
      <td>Imprisonment, betrayal, frozen desperation.</td>
      <td>Choose Mephistopheles when the ice is a laboratory, not a prison.</td>
    </tr>
    <tr>
      <td><strong>Zariel</strong></td>
      <td>War, conquest, rage, martial corruption.</td>
      <td>Choose Mephistopheles when the corruption happens in a contract clause before the battle starts.</td>
    </tr>
  </tbody>
</table>

<p>The useful DM question is not "which archdevil is strongest?" It is <strong>which archdevil makes this adventure easier to run and easier for players to understand</strong>.</p>

<h2>Can a Player Character Be Connected to Mephistopheles?</h2>
<p><strong>Yes, a player character can be connected to Mephistopheles through a Fiend Warlock pact, infernal ancestry, a family bargain, or a legacy tiefling concept.</strong> If your table uses older tiefling variants, Mephistopheles flavor often leans into Intelligence and fire magic. If your table is using the current 2024 species framing, start from the official <a href="${DND_2024_TIEFLING_URL}" rel="noreferrer noopener">D&amp;D Beyond Tiefling page</a> and treat the exact ancestor as story flavor.</p>

<p>My preference is to keep the character playable and keep the archdevil distant. A level 3 Warlock should not have Mephistopheles calling every long rest. A better rhythm is one clear mark, one recurring emissary, and one debt the player understands.</p>

<ul>
  <li><strong>Warlock pact:</strong> the character receives power through a chain of intermediaries, not a casual direct friendship.</li>
  <li><strong>Tiefling ancestry:</strong> make the Cania connection visible through cold breath, ember-blue eyes, or contract-themed dreams.</li>
  <li><strong>Wizard temptation:</strong> offer research that solves one problem while opening a worse one.</li>
  <li><strong>Paladin conflict:</strong> create a vow that can save people only if the character accepts infernal procedure.</li>
</ul>

<p>If the player mostly wants mechanics, point them to the <a href="${EN_DND_CLASSES_PATH}">DND classes guide</a> first. If they want table drama, Mephistopheles can carry that drama, but the player and DM should agree on boundaries before the pact becomes a campaign tax.</p>

<h2>Mephistopheles Tiefling vs Mephistopheles the Archdevil</h2>
<p><strong>A Mephistopheles tiefling is a character ancestry flavor, while Mephistopheles the archdevil is the infernal power behind that flavor.</strong> Mixing those up is one reason the topic gets messy.</p>

<table>
  <thead>
    <tr>
      <th>Mephistopheles angle</th>
      <th>Common table need</th>
      <th>Practical answer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Mephistopheles archdevil</strong></td>
      <td>Lore, Cania, patron ideas, villain use.</td>
      <td>Use the archdevil as a distant power, not a normal NPC who appears every session.</td>
    </tr>
    <tr>
      <td><strong>Mephistopheles tiefling</strong></td>
      <td>Character ancestry, spell flavor, fire-and-ice theme.</td>
      <td>Use the official tiefling rules your table allows, then make Mephistopheles the family source or infernal mark.</td>
    </tr>
    <tr>
      <td><strong>Warlock patron</strong></td>
      <td>Fiend pact roleplay and obligations.</td>
      <td>Make the pact specific: one agent, one written debt, one visible benefit.</td>
    </tr>
    <tr>
      <td><strong>BG3-style tiefling curiosity</strong></td>
      <td>Why the name appears in character creation or ancestry discussions.</td>
      <td>Explain the Cania/archdevil link, but do not assume video game options match your tabletop rules exactly.</td>
    </tr>
  </tbody>
</table>

<p>The cleanest wording for a character sheet is this: <strong>"My tiefling bloodline is marked by Mephistopheles, but the table uses our normal tiefling rules."</strong> That keeps the lore strong without sneaking in unsupported mechanics.</p>

<h2>Should Mephistopheles Have a Stat Block in Your Campaign?</h2>
<p><strong>Most campaigns should not need a Mephistopheles stat block unless the party is playing at endgame scale.</strong> The faster, cleaner option is to run agents, avatars, lair effects, legal traps, and magical consequences.</p>

<table>
  <thead>
    <tr>
      <th>Question</th>
      <th>Fast answer</th>
      <th>What I would run</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Mephistopheles stat block</strong></td>
      <td>Use only a source your DM approves, because archdevil statistics vary by edition, book, and third-party conversion.</td>
      <td>A campaign boss, not a random encounter.</td>
    </tr>
    <tr>
      <td><strong>Mephistopheles 5e</strong></td>
      <td>Use a 5e-compatible boss profile for combat prep, or a 5e lore hook for story prep.</td>
      <td>An avatar with clear objectives and fewer moving parts.</td>
    </tr>
    <tr>
      <td><strong>Mephistopheles CR</strong></td>
      <td>Confirm the exact stat source before planning balance. Do not build encounter math from an unsourced number.</td>
      <td>A proxy villain whose defeat changes the contract, not the entire cosmology.</td>
    </tr>
  </tbody>
</table>

<p>When I need him to affect the map, I use one of these tools instead of dropping the real archdevil onto a normal battle grid:</p>

<ul>
  <li><strong>Avatar encounter:</strong> a partial projection with one goal, one timer, and a way to break the link.</li>
  <li><strong>Contract hazard:</strong> every round, a signed clause changes the battlefield until the party destroys the document or wins a skill challenge.</li>
  <li><strong>Proxy villain:</strong> an ice-court magistrate, hellfire mage, or erinyes negotiator carries his authority.</li>
  <li><strong>Cania weather:</strong> cold damage, difficult terrain, brittle cover, and flame that burns blue instead of orange.</li>
  <li><strong>Debt clock:</strong> the party can win the fight but still move one step closer to repayment.</li>
</ul>

<p>That approach gives you more playable sessions. A godlike villain who only punches is easy to flatten. A villain who edits the terms of victory is harder to forget.</p>

<h2>How I Would Build a Mephistopheles Session</h2>
<p><strong>I would build a Mephistopheles session around a bargain that solves the party's urgent problem while making the next problem colder, smaller, and more personal.</strong> The trick is to make the deal useful enough that smart players consider it.</p>

<ol>
  <li><strong>Open with a practical problem.</strong> The party needs a name, cure, resurrection, location, safe passage, or spell component.</li>
  <li><strong>Send an agent, not the archdevil.</strong> A polite emissary in a frost-rimmed room feels better than a surprise final boss.</li>
  <li><strong>Put the bargain in plain language.</strong> The visible cost should be real. The hidden cost should be discoverable.</li>
  <li><strong>Add one impossible temperature cue.</strong> Ink freezes, candles burn blue, or metal becomes too cold to hold.</li>
  <li><strong>Let refusal matter.</strong> Saying no should make the adventure harder, not impossible.</li>
  <li><strong>Make acceptance change the campaign state.</strong> A new mark appears, a rival notices, or a future promise becomes enforceable.</li>
</ol>

<p>At the table, I would keep the handout short. Two clauses, one signature line, one weird witness. Long legal props are fun to write but slow to play.</p>

<h2>VTT Token Notes for Mephistopheles and His Agents</h2>
<p><strong>A Mephistopheles VTT token should read as infernal authority at 512 px, with controlled color instead of a heap of red effects.</strong> In the <a href="${EN_EDITOR_PATH}">VTT token maker</a>, I would use a controlled palette: black glass, cold blue highlights, gold contract lines, and one sharp ember color.</p>

<ul>
  <li><strong>For Mephistopheles:</strong> keep the face readable and put the magic in the border or sigil.</li>
  <li><strong>For Cania agents:</strong> use ice-blue rim light so they do not look like generic devils.</li>
  <li><strong>For contract NPCs:</strong> add paper, wax, chain, or quill motifs instead of more flames.</li>
  <li><strong>For combat scenes:</strong> test important rolls in the <a href="${EN_DICE_ROLLER_PATH}">D&amp;D dice roller</a> if you need quick public results.</li>
</ul>

<section id="faq" class="mt-12 rounded-[34px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
  <h2 class="font-display text-2xl sm:text-3xl text-stone-50" style="margin-top: 0;">Mephistopheles DND FAQ</h2>

  <div class="mt-6 space-y-4">
    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Who is Mephistopheles in DND?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">Mephistopheles is an archdevil connected to Cania, the Nine Hells, arcane ambition, and hellfire. Use him as a patron or endgame threat, not as a casual monster encounter.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Is Mephistopheles a god in D&amp;D?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">Mephistopheles is usually treated as an archdevil rather than a normal god. For campaign purposes, that still makes him powerful enough to shape plots through contracts, cults, and infernal magic.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Can a Warlock have Mephistopheles as a patron?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">Yes. A Fiend Warlock can use Mephistopheles as patron flavor if the DM agrees. I recommend using intermediaries and written obligations so the pact stays playable.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">What layer of Hell is Mephistopheles tied to?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">Mephistopheles is tied to Cania, commonly presented as the icy eighth layer of the Nine Hells. That cold setting is a big part of what separates him from generic fire-devil imagery.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Is Mephistopheles good for a beginner campaign?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">Not as the main villain. For beginners, use one agent, one simple bargain, and one visible consequence. Save the full archdevil plot for a campaign that can handle infernal politics.</p>
    </article>
  </div>
</section>

<h2 id="video">Watch the Mephistopheles D&amp;D Lore Video</h2>

<ul>
  <li><strong>Cold authority:</strong> Cania and frozen pressure make Mephistopheles feel different from generic fire-devil imagery.</li>
  <li><strong>Contracts before combat:</strong> the strongest Mephistopheles scene should threaten the party through terms before damage.</li>
  <li><strong>Table usability:</strong> turn that mood into encounter, patron, and token decisions instead of stopping at lore trivia.</li>
</ul>

${liteVideoEmbed('Xdu_5_ZL7pQ', 'Mephistopheles D&D lore video', {
  src: MEPHISTOPHELES_VIDEO_PLACEHOLDER_PATH,
  alt: 'Clickable webp video cover for a mephistopheles dnd lore guide with infernal fire and Cania ice colors',
})}
`;

export const dndMephistophelesArticleHtmlZh = String.raw`
<p><strong>mephistopheles dnd</strong> 可以作为反派或 patron 使用。先确认他是谁、怎样放进团里才不突兀，再看 Cania、契约、Warlock/Tiefling 关联和具体跑团用法。</p>

<p>把 Mephistopheles 用作反派、patron 或长期压力源时，先决定他的作用、出场时机，以及是否该直接放上战斗地图。</p>

<table>
  <thead>
    <tr>
      <th>你最想知道的问题</th>
      <th>直接答案</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Mephistopheles 是谁？</strong></td>
      <td>他是九层地狱相关的 archdevil，常与 Cania、冰、奥术野心和 hellfire 绑定。</td>
    </tr>
    <tr>
      <td><strong>最适合怎么用？</strong></td>
      <td>当 patron、契约设计者、幕后赞助者、终局反派，或邪教背后的名字。</td>
    </tr>
    <tr>
      <td><strong>他的核心辨识度是什么？</strong></td>
      <td>他的辨识度来自冷静、契约、冰狱和危险的地狱火研究，而不是单纯放大版红色恶魔。</td>
    </tr>
    <tr>
      <td><strong>玩家角色能关联他吗？</strong></td>
      <td>可以。Fiend Warlock、旧版 Mephistopheles Tiefling 风味、家族契约都能成立。</td>
    </tr>
    <tr>
      <td><strong>你是来找 stat block 吗？</strong></td>
      <td>把任何 Mephistopheles stat block 都当成终局或 DM 批准来源；大多数团先跑化身、代理人或契约危害更稳。</td>
    </tr>
    <tr>
      <td><strong>要不要直接打他？</strong></td>
      <td>通常不要。除非是终局高等级团，否则用化身、代理人、契约和后果更好跑。</td>
    </tr>
  </tbody>
</table>

<h2>Mephistopheles 在 DND 里到底是什么？</h2>
<p><strong>DND 里的 Mephistopheles 通常是和 Cania、第八层地狱、奥术野心与 hellfire 绑定的 archdevil。</strong>如果你需要快速补设定，可以看 <a href="${MEPHISTOPHELES_FR_WIKI_URL}" rel="noreferrer noopener">Forgotten Realms Wiki 的 Mephistopheles 条目</a>，它适合拿来做跑团前的背景速读。</p>

<p>他好用的地方在于反差。很多人一想到 devil 就只想到火，但 Mephistopheles 更适合做成<strong>冰冷控制 + 契约陷阱 + 危险火焰魔法</strong>。这个组合比“长角红皮肤反派”更有记忆点。</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${MEPHISTOPHELES_CANIA_IMAGE_PATH}"
    alt="mephistopheles dnd 设定配图，展示冰封 Cania 档案馆、地狱契约符号和 hellfire 光源"
    width="1400"
    height="933"
    loading="lazy"
    decoding="async"
  />
  <figcaption>我会先让玩家感到这种压迫：Cania 像一座冰封档案馆，每一份交易都已经被归档。</figcaption>
</figure>

<h2>DM 应该怎样使用 Mephistopheles？</h2>
<p><strong>DM 最好先通过交易、代理人、契约条款和延迟后果来使用 Mephistopheles，而不是一开始就让他亲自下场。</strong>Archdevil 最怕变成普通 boss：血很多、伤害很高，但玩家只记得打了一场硬仗。</p>

<ul>
  <li><strong>先给诱惑。</strong>复活、情报、通行权、稀有法术、救命答案，都可以成为契约入口。</li>
  <li><strong>代价不要一上来就写“灵魂”。</strong>可以是记忆、未来一次帮忙、对某个词语的解释权，或者看似无害的签名。</li>
  <li><strong>多用冰冷意象。</strong>Cania 应该安静、精确、压迫，而不是只会喷火。</li>
  <li><strong>代理人可以输，但契约继续生效。</strong>邪教徒、imp 律师、地狱法官、hellfire mage 都能做前台角色。</li>
  <li><strong>条款必须可读。</strong>如果契约太模糊，玩家会觉得是 DM 阴人；如果清楚但痛，玩家会怪魔鬼。</li>
</ul>

<p>这里最有用的提醒仍是同一件事：Mephistopheles 的压迫感来自“我怎样让你在动手前就已经输了半步”。单纯强调“我有多强”，反而会让他变得普通。</p>

<h2>Mephistopheles 和其他 Archdevils 有什么不同？</h2>
<p><strong>Mephistopheles 的差异在于他像一个研究禁忌魔法的契约猎手，军队和地位只是背景压力。</strong>所以他特别适合 Wizard、Warlock、禁忌知识和高风险交易主题。</p>

<table>
  <thead>
    <tr>
      <th>对比对象</th>
      <th>桌面感觉</th>
      <th>什么时候选 Mephistopheles</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Asmodeus</strong></td>
      <td>最终权威、宇宙级律法、最高统治。</td>
      <td>剧情集中在王座之下的野心和研究，而非挑战王座本身。</td>
    </tr>
    <tr>
      <td><strong>Dispater</strong></td>
      <td>偏执、防御、监控、铁城。</td>
      <td>你要的是实验、交易和法师诱惑，而不是纯防御 paranoia。</td>
    </tr>
    <tr>
      <td><strong>Levistus</strong></td>
      <td>背叛、囚禁、冰封绝望。</td>
      <td>你想让冰变成实验室，而不是监狱。</td>
    </tr>
    <tr>
      <td><strong>Zariel</strong></td>
      <td>战争、征服、怒火、军团腐化。</td>
      <td>腐化发生在合同条款里，而不是战场冲锋里。</td>
    </tr>
  </tbody>
</table>

<h2>玩家角色可以和 Mephistopheles 有关联吗？</h2>
<p><strong>可以，玩家角色可以通过 Fiend Warlock 契约、地狱血脉、家族债务或旧版 tiefling 设定和 Mephistopheles 关联。</strong>如果你们使用 2024 规则，先以官方 <a href="${DND_2024_TIEFLING_URL}" rel="noreferrer noopener">D&amp;D Beyond Tiefling 页面</a> 为准，再把具体祖源当作剧情风味处理。</p>

<p>我的建议是让关联存在，但不要让 archdevil 每场戏都出来抢镜。3 级 Warlock 不需要每天和 Mephistopheles 直接通话。更好用的是：一个可见印记、一个反复出现的代理人、一笔玩家已经理解的债。</p>

<ul>
  <li><strong>Warlock pact：</strong>力量来自层层代理，而不是“我和大魔鬼很熟”。</li>
  <li><strong>Tiefling ancestry：</strong>用冰冷呼吸、蓝色火光、契约梦境体现 Cania 关联。</li>
  <li><strong>Wizard 诱惑：</strong>给出能解决一个问题的研究资料，同时打开更糟糕的问题。</li>
  <li><strong>Paladin 冲突：</strong>誓言能救人，但必须按地狱流程执行。</li>
</ul>

<p>如果玩家还没想清职业底盘，先看 <a href="${ZH_DND_CLASSES_PATH}">DND 职业详解</a>。如果只是想要强度，Mephistopheles 不是重点；如果想要长期戏剧冲突，他很好用，但要先和 DM 对齐边界。</p>

<h2>Mephistopheles Tiefling 和 Archdevil 本尊有什么区别？</h2>
<p><strong>Mephistopheles tiefling 是角色血脉/风味概念，Mephistopheles archdevil 则是这个风味背后的地狱权力源头。</strong>很多玩家其实是在这两件事之间来回跳。</p>

<table>
  <thead>
    <tr>
      <th>关联方向</th>
      <th>你可能关心什么</th>
      <th>实用答案</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Mephistopheles archdevil</strong></td>
      <td>设定、Cania、patron、反派用法。</td>
      <td>把他当远处权力，不要当每场都出现的普通 NPC。</td>
    </tr>
    <tr>
      <td><strong>Mephistopheles tiefling</strong></td>
      <td>角色血脉、法术风味、火与冰主题。</td>
      <td>先使用你们桌允许的官方 tiefling 规则，再把 Mephistopheles 作为家族源头或地狱印记。</td>
    </tr>
    <tr>
      <td><strong>Warlock patron</strong></td>
      <td>Fiend pact 的扮演和债务。</td>
      <td>把契约写具体：一个代理人、一笔债、一个可见收益。</td>
    </tr>
    <tr>
      <td><strong>BG3 式 Tiefling 好奇</strong></td>
      <td>为什么角色创建或血脉讨论里会出现这个名字。</td>
      <td>解释 Cania 和 archdevil 关联，但不要默认电子游戏选项等于桌面规则。</td>
    </tr>
  </tbody>
</table>

<p>角色卡上最干净的说法是：<strong>“我的 tiefling 血脉被 Mephistopheles 标记，但机械规则按本桌允许的 tiefling 规则来。”</strong>这样 lore 有味道，也不会偷偷塞进未确认机制。</p>

<h2>你的战役需要 Mephistopheles Stat Block 吗？</h2>
<p><strong>大多数战役不需要 Mephistopheles 的完整 stat block，除非队伍已经进入终局高等级尺度。</strong>更省力、更好玩的方式，是跑代理人、化身、契约危害、地形效果和债务倒计时。</p>

<table>
  <thead>
    <tr>
      <th>准备目标</th>
      <th>直接答案</th>
      <th>我会怎么跑</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Mephistopheles stat block</strong></td>
      <td>只使用 DM 认可的来源，因为 archdevil 数值会随版本、书籍和第三方转换变化。</td>
      <td>终局 boss，而不是随机遭遇。</td>
    </tr>
    <tr>
      <td><strong>Mephistopheles 5e</strong></td>
      <td>你可能想找 5e 兼容 boss 数据，也可能只是想找 5e lore 钩子。</td>
      <td>用目标明确、机制更少的化身。</td>
    </tr>
    <tr>
      <td><strong>Mephistopheles CR</strong></td>
      <td>先确认具体 stat 来源，再做平衡；不要拿没来源的 CR 数字直接算遭遇。</td>
      <td>用代理人反派，让胜利改变契约，而不是直接改变宇宙秩序。</td>
    </tr>
  </tbody>
</table>

<ul>
  <li><strong>化身遭遇：</strong>一个投影、一个目标、一个计时器、一个打断连接的方法。</li>
  <li><strong>契约危害：</strong>每回合一条条款改变战场，直到玩家毁掉文件或赢下技能挑战。</li>
  <li><strong>代理人反派：</strong>冰狱法官、hellfire mage、erinyes 谈判者都比本人亲自下场更好跑。</li>
  <li><strong>Cania 天候：</strong>寒冷伤害、困难地形、脆裂掩体、蓝色火焰。</li>
  <li><strong>债务时钟：</strong>玩家能赢战斗，但离还债更近一步。</li>
</ul>

<p>这样处理会让反派更像 archdevil。只会打人的强敌很容易被玩家当成大号怪物；能修改胜利条件的反派才难忘。</p>

<h2>我会怎样设计一场 Mephistopheles 跑团场景？</h2>
<p><strong>我会围绕一个“能解决眼前问题、但会制造后续代价”的契约来设计 Mephistopheles 场景。</strong>交易要先显得真的有用，邪恶感再从后续代价里慢慢浮出来。</p>

<ol>
  <li><strong>先给迫切问题。</strong>玩家需要复活、情报、坐标、安全通行或稀有材料。</li>
  <li><strong>派代理人出场。</strong>一个礼貌、冰冷、过分专业的 emissary 比突然空降本尊更有效。</li>
  <li><strong>契约写短。</strong>两条条款、一行签名、一个诡异见证者就够了。</li>
  <li><strong>加一个温度异常。</strong>墨水结冰、蜡烛烧蓝、金属冷到握不住。</li>
  <li><strong>拒绝也要有后果。</strong>说不应该让任务变难，而不是直接卡死。</li>
  <li><strong>接受要改变战役状态。</strong>标记出现、敌人注意到、未来承诺开始倒计时。</li>
</ol>

<h2>Mephistopheles 和代理人的 VTT Token 怎么做？</h2>
<p><strong>Mephistopheles 的 VTT Token 要在 512 px 下仍然读得出“地狱权威”，不要堆成一团红色特效。</strong>我会在 <a href="${ZH_EDITOR_PATH}">VTT Token 制作工具</a> 里用黑色玻璃、冷蓝边光、金色契约线和少量 ember 色。</p>

<ul>
  <li><strong>本尊：</strong>脸和轮廓优先，魔法效果放在边框或印记里。</li>
  <li><strong>Cania 代理人：</strong>加冰蓝 rim light，避免像普通 devil。</li>
  <li><strong>契约 NPC：</strong>用纸张、火漆、锁链、羽毛笔，不要只加火焰。</li>
  <li><strong>公开掷骰：</strong>需要快速展示结果时，可以用 <a href="${ZH_DICE_ROLLER_PATH}">D&amp;D 骰子工具</a>。</li>
</ul>

<section id="faq" class="mt-12 rounded-[34px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
  <h2 class="font-display text-2xl sm:text-3xl text-stone-50" style="margin-top: 0;">Mephistopheles DND 常见问题</h2>

  <div class="mt-6 space-y-4">
    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">DND 里的 Mephistopheles 是谁？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">Mephistopheles 是和 Cania、九层地狱、奥术野心与 hellfire 相关的 archdevil。更适合当 patron 或终局威胁，不适合当随手遭遇怪。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Mephistopheles 是 D&amp;D 里的神吗？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">通常更准确地说，他是 archdevil，而不是普通意义上的 god。但在战役里，他仍然足够强，可以通过契约、邪教和地狱魔法影响剧情。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Warlock 可以把 Mephistopheles 当 patron 吗？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">可以，只要 DM 同意。建议用 Fiend Warlock 的方向，并通过代理人、印记和明确债务来表现，而不是让大魔鬼天天直接聊天。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Mephistopheles 和哪一层地狱有关？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">Mephistopheles 通常和 Cania 绑定，也就是九层地狱中冰冷的第八层。这个冰冷设定能把他和普通火焰 devil 区分开。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">新手团适合用 Mephistopheles 当主反派吗？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">不太适合直接当主反派。新手团可以先用一个代理人、一个简单契约和一个可见后果，等战役能承载地狱政治后再展开完整 archdevil 线。</p>
    </article>
  </div>
</section>

<h2 id="video">视频：Mephistopheles D&amp;D Lore</h2>

<ul>
  <li><strong>冰冷权威：</strong>Cania 和寒冷压迫能把 Mephistopheles 和普通火焰 devil 区分开。</li>
  <li><strong>先契约，后战斗：</strong>最有用的 Mephistopheles 场景，应该先用条款威胁玩家，而不是只靠伤害。</li>
  <li><strong>落到桌面：</strong>把这些氛围转成遭遇、patron 和 Token 设计建议，而不是只停留在设定名词。</li>
</ul>

${liteVideoEmbed('Xdu_5_ZL7pQ', 'Mephistopheles D&D lore video', {
  src: MEPHISTOPHELES_VIDEO_PLACEHOLDER_PATH,
  alt: 'mephistopheles dnd 视频 webp 封面图，带有 infernal fire 和 Cania ice 色彩',
})}
`;
