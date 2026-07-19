import {
  DND_ANIMATE_DEAD_2014_RULES_URL,
  DND_ANIMATE_DEAD_2024_RULES_URL,
  DND_NECROMANCER_SPELLS_TABLE_IMAGE_PATH,
  DND_NECROMANCER_SPELLS_VIDEO_PLACEHOLDER_PATH,
  DND_NECROMANCER_SPELLS_VIDEO_URL,
  EN_DICE_ROLLER_PATH,
  EN_DND_CLASSES_PATH,
  EN_DND_CONSTITUTION_PATH,
  EN_DND_COUNTERSPELL_PATH,
  EN_EDITOR_PATH,
  NECROMANCY_WIKIPEDIA_URL,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_DND_CONSTITUTION_PATH,
  ZH_DND_COUNTERSPELL_PATH,
  ZH_EDITOR_PATH,
  liteVideoEmbed,
} from './shared';

export const dndNecromancerSpellsArticleHtml = String.raw`
<p><strong>dnd necromancer spells</strong> are best judged by table job, not by spooky flavor. Start with the fast spell picks, then check the Animate Dead math that actually matters and the minion habits I use so a necromancer adds pressure without turning every combat round into paperwork.</p>

<p>For the short answer, start with the table. Necromancy Wizard, Death Cleric, villain caster, and undead-heavy NPC builds need spells that carry the fantasy without only looking good on paper.</p>

<table>
  <thead>
    <tr>
      <th>Need</th>
      <th>Best necromancer spell pick</th>
      <th>Why it earns the slot</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Core undead engine</strong></td>
      <td>Animate Dead</td>
      <td>The build-defining spell. It creates skeletons or zombies and asks you to manage a 24-hour control loop.</td>
    </tr>
    <tr>
      <td><strong>Low-level damage flavor</strong></td>
      <td>Chill Touch or Toll the Dead</td>
      <td>Easy necrotic flavor without spending a spell slot. Toll the Dead is stronger when your table allows it.</td>
    </tr>
    <tr>
      <td><strong>Single-target debuff</strong></td>
      <td>Blindness/Deafness</td>
      <td>No concentration, and blindness can swing a fight harder than another small damage spell.</td>
    </tr>
    <tr>
      <td><strong>Self-sustain</strong></td>
      <td>False Life or Vampiric Touch</td>
      <td>False Life is cleaner early. Vampiric Touch is flavorful but needs positioning and concentration.</td>
    </tr>
    <tr>
      <td><strong>Boss pressure</strong></td>
      <td>Bestow Curse, Blight, Finger of Death</td>
      <td>Good when you want the necromancer to feel dangerous without running eight extra turns.</td>
    </tr>
    <tr>
      <td><strong>Campaign utility</strong></td>
      <td>Speak with Dead, Gentle Repose, Clone</td>
      <td>These spells create story leverage, investigation shortcuts, or long-term backup plans.</td>
    </tr>
  </tbody>
</table>

<h2 id="what-counts">What Counts as a Necromancer Spell in DND?</h2>
<p><strong>A necromancer spell in DND is either a Necromancy-school spell or a spell that supports the undead-control playstyle.</strong> That distinction matters because the best necromancer character rarely prepares only Necromancy spells.</p>

<p>The word <a href="${NECROMANCY_WIKIPEDIA_URL}" rel="noreferrer noopener">necromancy</a> comes from older ideas about speaking with or manipulating the dead. In D&amp;D, the school covers death magic, undeath, life-force manipulation, and resurrection magic. That is why <em>Revivify</em>, <em>Raise Dead</em>, and <em>Clone</em> can sit in the same school as <em>Animate Dead</em>.</p>

<p>At the table, I use a stricter practical test: <strong>does this spell help my necromancer win scenes without annoying the table?</strong> <em>Animate Dead</em> passes. <em>Speak with Dead</em> passes. A weak necrotic damage spell that eats concentration and misses half the time may not.</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_NECROMANCER_SPELLS_TABLE_IMAGE_PATH}"
    alt="dnd necromancer spells level table shown as numbered spell cards with a skeleton archer, zombie miniature, command icons, dice, and necromancy spellbook"
    width="1400"
    height="933"
    loading="lazy"
    decoding="async"
  />
  <figcaption>The best necromancer spell list is more than a row of skull icons. It is an action economy plan: damage, control, minions, survival, and table speed.</figcaption>
</figure>

<h2 id="all-spells">All Common DND Necromancy Spells by Level</h2>
<p><strong>Start with this quick dnd necromancer spells list: common Necromancy-school spells grouped by spell level.</strong> Source availability varies by campaign, class list, and DM, so treat this table as a planning checklist before you lock a character sheet.</p>

<table>
  <thead>
    <tr>
      <th>Spell level</th>
      <th>Common necromancy spells</th>
      <th>What they usually do</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Cantrip</td>
      <td>Chill Touch, Sapping Sting, Spare the Dying, Toll the Dead</td>
      <td>Cheap necrotic damage, healing denial, emergency stabilization, or a low-cost control rider.</td>
    </tr>
    <tr>
      <td>1st</td>
      <td>Cause Fear, False Life, Inflict Wounds, Ray of Sickness</td>
      <td>Early fear, temporary hit points, touch burst damage, or poison pressure.</td>
    </tr>
    <tr>
      <td>2nd</td>
      <td>Blindness/Deafness, Gentle Repose, Ray of Enfeeblement, Wither and Bloom</td>
      <td>Debuffs, corpse preservation, Strength-damage reduction, or mixed damage and healing.</td>
    </tr>
    <tr>
      <td>3rd</td>
      <td>Animate Dead, Bestow Curse, Feign Death, Life Transference, Revivify, Speak with Dead, Spirit Shroud, Summon Undead, Vampiric Touch</td>
      <td>The main necromancer tier: undead creation, curses, investigation, revival, summons, and life drain.</td>
    </tr>
    <tr>
      <td>4th</td>
      <td>Blight, Shadow of Moil, Spirit of Death</td>
      <td>Single-target damage, defensive darkness, or a stronger death-themed summon if your table allows the source.</td>
    </tr>
    <tr>
      <td>5th</td>
      <td>Contagion, Danse Macabre, Enervation, Negative Energy Flood, Raise Dead</td>
      <td>Disease effects, temporary undead squads, draining beams, zombie creation, or resurrection.</td>
    </tr>
    <tr>
      <td>6th</td>
      <td>Circle of Death, Create Undead, Eyebite, Harm, Magic Jar, Soul Cage</td>
      <td>Large-area necrotic damage, stronger undead, repeatable debuffs, possession, and soul utility.</td>
    </tr>
    <tr>
      <td>7th</td>
      <td>Finger of Death, Resurrection, Tether Essence</td>
      <td>High damage with permanent zombie payoff, major resurrection, or linked-damage tricks.</td>
    </tr>
    <tr>
      <td>8th</td>
      <td>Abi-Dalzim&rsquo;s Horrid Wilting, Clone</td>
      <td>Battlefield-scale necrotic damage or long-term death insurance.</td>
    </tr>
    <tr>
      <td>9th</td>
      <td>Astral Projection, Time Ravage, True Resurrection</td>
      <td>Planar travel, brutal aging magic, or the strongest resurrection tier.</td>
    </tr>
  </tbody>
</table>

<p>For strict rules sourcing, use the spell text your table owns. The list above mixes core and commonly used expansion spells because tables often use both source types.</p>

<h2 id="best-by-level">Best DND Necromancer Spells by Level</h2>
<p><strong>The best dnd necromancer spells by level are the ones that give you reliable value before, during, and after combat.</strong> I would rather prepare one boring spell that always matters than three edgy spells that only work in one perfect scene.</p>

<table>
  <thead>
    <tr>
      <th>Level</th>
      <th>Top picks</th>
      <th>Table note</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Cantrip</td>
      <td><strong>Chill Touch</strong>, <strong>Toll the Dead</strong>, Spare the Dying</td>
      <td>Chill Touch blocks healing and fits the theme. Toll the Dead is the better damage cantrip if available.</td>
    </tr>
    <tr>
      <td>1st</td>
      <td><strong>False Life</strong>, Ray of Sickness, Cause Fear</td>
      <td>False Life is the cleanest low-level survival pick. Ray of Sickness is less reliable because poison is resisted often.</td>
    </tr>
    <tr>
      <td>2nd</td>
      <td><strong>Blindness/Deafness</strong>, Gentle Repose, Ray of Enfeeblement</td>
      <td>Blindness/Deafness is the standout because it does not use concentration.</td>
    </tr>
    <tr>
      <td>3rd</td>
      <td><strong>Animate Dead</strong>, Bestow Curse, Speak with Dead, Vampiric Touch</td>
      <td>This is where the fantasy turns on. Animate Dead is the anchor; Speak with Dead is the investigation tool.</td>
    </tr>
    <tr>
      <td>4th</td>
      <td><strong>Blight</strong>, Shadow of Moil</td>
      <td>Blight is direct and simple. Shadow of Moil is excellent on the right Warlock-style build.</td>
    </tr>
    <tr>
      <td>5th</td>
      <td><strong>Danse Macabre</strong>, Enervation, Negative Energy Flood</td>
      <td>These are book-dependent. Ask your DM before building the character around them.</td>
    </tr>
    <tr>
      <td>6th</td>
      <td><strong>Create Undead</strong>, Circle of Death, Eyebite, Magic Jar</td>
      <td>Create Undead is the iconic upgrade, but Magic Jar is the real campaign-warping spell if your DM allows it.</td>
    </tr>
    <tr>
      <td>7th-9th</td>
      <td><strong>Finger of Death</strong>, Clone, Abi-Dalzim&rsquo;s Horrid Wilting</td>
      <td>At high levels, the best necromancer spells either end problems or create permanent leverage.</td>
    </tr>
  </tbody>
</table>

<p>Do not read that table as "prepare all of these." A necromancer still needs defense, movement, and answers to enemy magic. I almost always keep space for <a href="${EN_DND_COUNTERSPELL_PATH}">Counterspell</a> or Dispel Magic on a Wizard because losing your undead engine to one enemy caster feels terrible.</p>

<h2 id="animate-dead">How Does Animate Dead Work for a DND Necromancer?</h2>
<p><strong>Animate Dead is a 3rd-level Necromancy spell that turns a Medium or Small humanoid corpse into a zombie, or a pile of bones into a skeleton, then lets you control it for 24 hours.</strong> That is the spell every necromancer player needs to understand before chasing fancier options.</p>

<p>The official text is available in both the <a href="${DND_ANIMATE_DEAD_2014_RULES_URL}" rel="noreferrer noopener">2014 Basic Rules</a> and the <a href="${DND_ANIMATE_DEAD_2024_RULES_URL}" rel="noreferrer noopener">2024 Free Rules</a>. The practical parts are similar enough that most tables care about the same questions:</p>

<ul>
  <li><strong>Casting time:</strong> 1 minute, so this is not a panic button in the middle of initiative.</li>
  <li><strong>Range:</strong> 10 feet, so you need access to the corpse or bones.</li>
  <li><strong>Control:</strong> 24 hours. Recast before the timer expires or your servant stops obeying.</li>
  <li><strong>Command cost:</strong> a bonus action to mentally command creatures you made with the spell within 60 feet.</li>
  <li><strong>Same-command limit:</strong> if you command several at once, the spell expects the same command for each.</li>
  <li><strong>Upcasting:</strong> higher slots animate or reassert control over two extra undead per slot level above 3.</li>
</ul>

<p>The video is useful because it frames <em>Animate Dead</em> as a spell about teammates rather than a creepy animation button. That framing only works at the table if you have a clear procedure before the army appears.</p>

<h2 id="skeletons-zombies">Are Skeletons or Zombies Better for Animate Dead?</h2>
<p><strong>Skeletons are usually better for damage and ranged pressure, while zombies are better as slow blockers that can absorb ugly hits.</strong> The right pick depends on what job your undead servant has this session.</p>

<table>
  <thead>
    <tr>
      <th>Choice</th>
      <th>Best use</th>
      <th>What to watch</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Skeleton</strong></td>
      <td>Ranged attacks, guard duty, flanking pressure, carrying simple gear.</td>
      <td>Low HP. They need cover, spacing, and simple commands.</td>
    </tr>
    <tr>
      <td><strong>Zombie</strong></td>
      <td>Door blocking, corridor clogging, soaking hits, horror scenes.</td>
      <td>Low AC and slow movement. They often waste turns if terrain is messy.</td>
    </tr>
  </tbody>
</table>

<p>In my own games, skeletons are easier to run cleanly because "stand there and shoot that target" is fast. Zombies are better when the goal is not damage. A zombie in a narrow corridor can buy a round that saves a Wizard; a zombie trying to chase archers across a large map is mostly comedy.</p>

<h2 id="loadout">Best Spell Loadout for a Necromancer Wizard</h2>
<p><strong>A good Necromancer Wizard loadout mixes undead spells with defense, control, and emergency answers.</strong> The subclass fantasy is death magic, but your actual job is still "Wizard who solves problems."</p>

<table>
  <thead>
    <tr>
      <th>Character stage</th>
      <th>Prepare or learn</th>
      <th>Why it works</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Levels 1-4</td>
      <td>False Life, Chill Touch, Mage Armor, Shield, Web</td>
      <td>You are not a real minion caster yet. Survive, control space, and keep the death flavor light.</td>
    </tr>
    <tr>
      <td>Levels 5-8</td>
      <td>Animate Dead, Counterspell, Dispel Magic, Fear, Blindness/Deafness</td>
      <td>This is the sweet spot. Animate Dead gives a board presence; control spells keep the board readable.</td>
    </tr>
    <tr>
      <td>Levels 9-12</td>
      <td>Danse Macabre, Enervation, Wall of Force, Create Undead</td>
      <td>Add stronger undead options, but do not drop the control spells that keep your party alive.</td>
    </tr>
    <tr>
      <td>Levels 13+</td>
      <td>Finger of Death, Clone, Simulacrum, contingency-style defenses</td>
      <td>High-level necromancers become planners. Permanent assets matter more than one spooky blast.</td>
    </tr>
  </tbody>
</table>

<p>If you are still choosing the base class, start with the <a href="${EN_DND_CLASSES_PATH}">DND classes guide</a>. If you keep losing concentration or dropping before your undead can matter, read the <a href="${EN_DND_CONSTITUTION_PATH}">D&amp;D Constitution guide</a> before blaming the spell list.</p>

<h2 id="table-speed">How Do You Run Necromancer Minions Without Slowing Combat?</h2>
<p><strong>You run necromancer minions quickly by grouping commands, using average damage when the DM agrees, and deciding the undead plan before your turn starts.</strong> This is the difference between a cool necromancer and a player everyone quietly resents.</p>

<ul>
  <li><strong>Write the 24-hour timer down.</strong> I put the expiration time beside the spell slot used to maintain control.</li>
  <li><strong>Use squads, not individuals.</strong> Four skeletons are "archer squad," not four separate dramatic monologues.</li>
  <li><strong>Pre-roll attacks when possible.</strong> Ask your DM first, then roll a small block of d20s together.</li>
  <li><strong>Keep commands boring.</strong> "Shoot the ogre," "guard this door," and "follow me" beat clever legal contracts.</li>
  <li><strong>Accept losses.</strong> Do not spend five minutes saving one 13 HP skeleton if the scene is moving.</li>
  <li><strong>Respect town scenes.</strong> Walking into a market with corpses can become the whole session. Ask the table if that is fun first.</li>
</ul>

<p>For bosses and NPC villains, I usually avoid a giant undead pile. Two or three signature undead plus one strong spell is easier to run and more memorable. The villain should scare the players, not make them wait while the DM rolls twelve shortbow attacks.</p>

<h2 id="vtt-token">How Should a Necromancer Look on a VTT Token?</h2>
<p><strong>A necromancer VTT token should read as undead magic at 512 px without hiding the face or silhouette.</strong> Green smoke everywhere looks fine at full size, then turns into a muddy blob on a battle map.</p>

<p>When I make necromancer tokens in the <a href="${EN_EDITOR_PATH}">VTT token maker</a>, I keep the magic effect around the hands, eyes, or border. I avoid covering the whole portrait because Roll20, Foundry VTT, and Owlbear Rodeo all punish noisy token art when zoomed out.</p>

<ul>
  <li><strong>Use bone, silver, or dark iron frames</strong> for undead casters and grave clerics.</li>
  <li><strong>Keep one readable accent color</strong> such as sickly green, pale blue, or cold violet.</li>
  <li><strong>Make minion tokens simpler</strong> than the caster token so the map hierarchy is obvious.</li>
  <li><strong>Export at 512 or 1024 px</strong> depending on whether the token is for play or a reusable campaign library.</li>
  <li><strong>Keep the <a href="${EN_DICE_ROLLER_PATH}">D&amp;D dice roller</a> open</strong> if you are testing skeleton attack blocks before a session.</li>
</ul>

<section id="faq" class="mt-12 rounded-[34px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
  <h2 class="font-display text-2xl sm:text-3xl text-stone-50" style="margin-top: 0;">FAQ About DND Necromancer Spells</h2>

  <div class="mt-6 space-y-4">
    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">What is the best dnd necromancer spell?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">The best dnd necromancer spell is <strong>Animate Dead</strong> if you want the classic undead-minion playstyle. For non-minion value, Blindness/Deafness and Speak with Dead are often cleaner at the table.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">What level can a necromancer cast Animate Dead?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">A necromancer can usually cast <strong>Animate Dead at character level 5</strong> if they are a full caster such as a Wizard or Cleric with access to 3rd-level spells. Exact access still depends on your class, subclass, and source rules.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">How many undead can Animate Dead control?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">At 3rd level, Animate Dead creates one skeleton or zombie, or reasserts control over up to <strong>four</strong> undead you previously animated. Each slot level above 3 adds two more undead to the animate or reassert-control limit.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Can a Wizard be a necromancer in DND 5e?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">Yes. A Wizard can play the necromancer role, and the School of Necromancy subclass is the most obvious route in 2014-style 5e games. Clerics can also use several key necromancy spells.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Does Animate Dead require concentration?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">No. Animate Dead does not require concentration. The important limit is the 24-hour control duration, which you maintain by recasting the spell before control expires.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Are skeletons better than zombies in DND?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">Skeletons are usually better for ranged damage and clean turns. Zombies are better as blockers or horror props because they are tougher but slower and less accurate.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Is necromancy evil in DND?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">Not automatically by rules, but many DND worlds treat undead creation as taboo or evil. Ask your DM before making Animate Dead a public-facing part of your character.</p>
    </article>
  </div>
</section>

<h2 id="video">Watch: D&amp;D 5E Animate Dead</h2>
<p>Zee Bashew's <a href="${DND_NECROMANCER_SPELLS_VIDEO_URL}" rel="noreferrer noopener">D&amp;D 5E Animate Dead</a> nails the practical lesson: <strong>Animate Dead is funniest and strongest when you treat skeletons as simple teammates with simple jobs</strong>. Keep the commands clean, keep the turns fast, and your necromancer will feel clever instead of exhausting.</p>

${liteVideoEmbed('wYBEbNbirkA', 'D&D 5E Animate Dead', {
  src: DND_NECROMANCER_SPELLS_VIDEO_PLACEHOLDER_PATH,
  alt: 'Clickable webp video cover for dnd necromancer spells showing the D&D 5E Animate Dead video thumbnail',
})}
`;

export const dndNecromancerSpellsArticleHtmlZh = String.raw`
<p><strong>dnd necromancer spells</strong> 别只看“够不够邪门”，更该看它在桌上负责什么工作：Animate Dead 的 24 小时控制循环、骷髅和僵尸怎么选，以及避免拖慢战斗的亡灵小队流程。</p>

<p>你只想查答案，看第一张表就够；Necromancy Wizard、Death Cleric、死灵反派或亡灵 NPC 更需要分清哪些法术真的撑得起玩法，哪些只是看起来很有味道。</p>

<table>
  <thead>
    <tr>
      <th>需求</th>
      <th>最值得看的死灵法术</th>
      <th>为什么值得占位</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>亡灵核心引擎</strong></td>
      <td>Animate Dead</td>
      <td>构筑定义法术。它创造 skeleton 或 zombie，同时要求你管理 24 小时控制循环。</td>
    </tr>
    <tr>
      <td><strong>低等级伤害风味</strong></td>
      <td>Chill Touch 或 Toll the Dead</td>
      <td>不用烧法术位就能保留 necrotic 风味。若你们桌允许，Toll the Dead 的伤害更舒服。</td>
    </tr>
    <tr>
      <td><strong>单体削弱</strong></td>
      <td>Blindness/Deafness</td>
      <td>不吃 Concentration。一次成功的致盲经常比再补一个小伤害法术更值。</td>
    </tr>
    <tr>
      <td><strong>自保续航</strong></td>
      <td>False Life 或 Vampiric Touch</td>
      <td>低等级 False Life 更干净。Vampiric Touch 很有味道，但吃站位和专注。</td>
    </tr>
    <tr>
      <td><strong>Boss 压迫感</strong></td>
      <td>Bestow Curse、Blight、Finger of Death</td>
      <td>适合让死灵施法者有威胁，同时不用额外跑一堆小怪回合。</td>
    </tr>
    <tr>
      <td><strong>战役工具</strong></td>
      <td>Speak with Dead、Gentle Repose、Clone</td>
      <td>这些法术提供调查捷径、剧情筹码或长期后手。</td>
    </tr>
  </tbody>
</table>

<h2 id="what-counts">DND 里什么算 Necromancer Spell？</h2>
<p><strong>DND 里的 necromancer spell 可以指 Necromancy 学派法术，也可以指服务于亡灵控制玩法的法术。</strong>这个区别很重要，因为一个好用的死灵角色通常不会只准备 Necromancy 法术。</p>

<p><a href="${NECROMANCY_WIKIPEDIA_URL}" rel="noreferrer noopener">Necromancy</a> 这个词本来就和死者沟通、操控死者有关。到了 D&amp;D 里，它覆盖死亡魔法、亡灵、生命力操纵和复活法术。所以 <em>Revivify</em>、<em>Raise Dead</em>、<em>Clone</em> 会和 <em>Animate Dead</em> 放在同一个法术学派里。</p>

<p>但在实际跑团里，我会用更直接的标准：<strong>这个法术能不能让我的死灵角色解决场景，同时不烦到全桌？</strong><em>Animate Dead</em> 合格，<em>Speak with Dead</em> 合格。一个命中不稳、吃专注、只多一点 necrotic 伤害的法术，可能就不合格。</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_NECROMANCER_SPELLS_TABLE_IMAGE_PATH}"
    alt="dnd necromancer spells 按环级配图，编号法术卡旁摆放 skeleton 弓手、zombie 模型、指令图标、骰子和死灵法术书"
    width="1400"
    height="933"
    loading="lazy"
    decoding="async"
  />
  <figcaption>好的死灵法术清单要能撑起一套动作经济计划：伤害、控制、亡灵、自保和桌面效率，不能只是一排骷髅图标。</figcaption>
</figure>

<h2 id="all-spells">常见 DND Necromancy Spells 按环级清单</h2>
<p><strong>先用这张按环级整理的 Necromancy 学派法术表做检查清单。</strong>不同战役、职业法术表和扩展书可用性会不一样，再和 DM 确认来源。</p>

<table>
  <thead>
    <tr>
      <th>环级</th>
      <th>常见 necromancy spells</th>
      <th>通常负责什么</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>戏法</td>
      <td>Chill Touch、Sapping Sting、Spare the Dying、Toll the Dead</td>
      <td>低成本 necrotic 伤害、阻止治疗、急救稳定，或附带一点控制效果。</td>
    </tr>
    <tr>
      <td>1 环</td>
      <td>Cause Fear、False Life、Inflict Wounds、Ray of Sickness</td>
      <td>早期恐惧、临时生命值、近战爆发伤害或 poison 压力。</td>
    </tr>
    <tr>
      <td>2 环</td>
      <td>Blindness/Deafness、Gentle Repose、Ray of Enfeeblement、Wither and Bloom</td>
      <td>削弱敌人、保存尸体、降低力量武器伤害，或同时处理伤害与治疗。</td>
    </tr>
    <tr>
      <td>3 环</td>
      <td>Animate Dead、Bestow Curse、Feign Death、Life Transference、Revivify、Speak with Dead、Spirit Shroud、Summon Undead、Vampiric Touch</td>
      <td>死灵法师核心层：创造亡灵、诅咒、调查、复活、召唤和吸血续航。</td>
    </tr>
    <tr>
      <td>4 环</td>
      <td>Blight、Shadow of Moil、Spirit of Death</td>
      <td>单体伤害、防御性黑暗，或在来源允许时使用更强的死亡主题召唤。</td>
    </tr>
    <tr>
      <td>5 环</td>
      <td>Contagion、Danse Macabre、Enervation、Negative Energy Flood、Raise Dead</td>
      <td>疾病效果、临时亡灵小队、持续吸取、创造 zombie 或复活。</td>
    </tr>
    <tr>
      <td>6 环</td>
      <td>Circle of Death、Create Undead、Eyebite、Harm、Magic Jar、Soul Cage</td>
      <td>大范围 necrotic 伤害、更强亡灵、重复削弱、附身和灵魂资源。</td>
    </tr>
    <tr>
      <td>7 环</td>
      <td>Finger of Death、Resurrection、Tether Essence</td>
      <td>高额伤害加永久 zombie 收益、大复活，或链接伤害类技巧。</td>
    </tr>
    <tr>
      <td>8 环</td>
      <td>Abi-Dalzim&rsquo;s Horrid Wilting、Clone</td>
      <td>战场级 necrotic 伤害，或长期死亡保险。</td>
    </tr>
    <tr>
      <td>9 环</td>
      <td>Astral Projection、Time Ravage、True Resurrection</td>
      <td>位面旅行、残酷老化魔法，或最高级别复活。</td>
    </tr>
  </tbody>
</table>

<p>严格规则请以你们桌拥有并允许的书籍文本为准。上表同时收录核心与常见扩展法术，方便你按本桌允许的来源筛选。</p>

<h2 id="best-by-level">按环级推荐的 DND Necromancer Spells</h2>
<p><strong>按环级来看，最值得选的 dnd necromancer spells 是那些在战斗前、战斗中和战斗后都能稳定提供价值的法术。</strong>我宁愿准备一个每场都能用上的朴素法术，也不想带三个只在完美场景才有用的“很酷”法术。</p>

<table>
  <thead>
    <tr>
      <th>环级</th>
      <th>优先考虑</th>
      <th>实战说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>戏法</td>
      <td><strong>Chill Touch</strong>、<strong>Toll the Dead</strong>、Spare the Dying</td>
      <td>Chill Touch 能阻止治疗，风味很准。若可用，Toll the Dead 通常是更好的伤害戏法。</td>
    </tr>
    <tr>
      <td>1 环</td>
      <td><strong>False Life</strong>、Ray of Sickness、Cause Fear</td>
      <td>False Life 是低等级最干净的自保。Ray of Sickness 因为 poison 抗性太常见，稳定性偏差。</td>
    </tr>
    <tr>
      <td>2 环</td>
      <td><strong>Blindness/Deafness</strong>、Gentle Repose、Ray of Enfeeblement</td>
      <td>Blindness/Deafness 最亮眼，因为它不需要 Concentration。</td>
    </tr>
    <tr>
      <td>3 环</td>
      <td><strong>Animate Dead</strong>、Bestow Curse、Speak with Dead、Vampiric Touch</td>
      <td>死灵玩法从这里开始成型。Animate Dead 是核心；Speak with Dead 是调查工具。</td>
    </tr>
    <tr>
      <td>4 环</td>
      <td><strong>Blight</strong>、Shadow of Moil</td>
      <td>Blight 简单直接。Shadow of Moil 在合适的 Warlock 风格构筑上很强。</td>
    </tr>
    <tr>
      <td>5 环</td>
      <td><strong>Danse Macabre</strong>、Enervation、Negative Energy Flood</td>
      <td>这些比较看书籍来源。不要在没问 DM 前把整套构筑押上去。</td>
    </tr>
    <tr>
      <td>6 环</td>
      <td><strong>Create Undead</strong>、Circle of Death、Eyebite、Magic Jar</td>
      <td>Create Undead 是经典升级；但如果 DM 允许，Magic Jar 才是会改写战役的法术。</td>
    </tr>
    <tr>
      <td>7-9 环</td>
      <td><strong>Finger of Death</strong>、Clone、Abi-Dalzim&rsquo;s Horrid Wilting</td>
      <td>高等级死灵法术要么直接解决问题，要么创造长期筹码。</td>
    </tr>
  </tbody>
</table>

<p>不要把这张表理解成“全都准备”。死灵法师依然需要防御、位移和反制魔法。我自己做 Wizard 时几乎一定会给 <a href="${ZH_DND_COUNTERSPELL_PATH}">Counterspell</a> 或 Dispel Magic 留位置，因为被敌方法师一招拆掉亡灵引擎会非常难受。</p>

<h2 id="animate-dead">Animate Dead 对 DND 死灵法师到底怎么运作？</h2>
<p><strong>Animate Dead 是 3 环 Necromancy 法术，可以把 Medium 或 Small 的 humanoid 尸体变成 zombie，或把骨堆变成 skeleton，并让你控制它 24 小时。</strong>这是每个死灵玩家在追逐更花哨法术之前必须吃透的核心。</p>

<p>官方文本可以看 <a href="${DND_ANIMATE_DEAD_2014_RULES_URL}" rel="noreferrer noopener">2014 Basic Rules</a> 和 <a href="${DND_ANIMATE_DEAD_2024_RULES_URL}" rel="noreferrer noopener">2024 Free Rules</a>。两个版本在实战关键点上接近，所以大多数桌最关心的是这些问题：</p>

<ul>
  <li><strong>施法时间：</strong>1 分钟，所以它不是战斗中临时救场按钮。</li>
  <li><strong>距离：</strong>10 feet，所以你必须够得到尸体或骨堆。</li>
  <li><strong>控制：</strong>24 小时。到期前重施法，否则仆从不再听令。</li>
  <li><strong>指挥成本：</strong>用 bonus action 心灵指挥 60 feet 内由你创造的亡灵。</li>
  <li><strong>同一指令限制：</strong>同时指挥多个亡灵时，法术文本要求给它们同一个指令。</li>
  <li><strong>升环：</strong>3 环以上每高 1 环，可以额外创造或重新控制 2 个 undead。</li>
</ul>

<p>这条视频有用的地方，是它把 <em>Animate Dead</em> 讲成“队友管理”而不是“按一下尸体动起来”。这个思路有一个前提：你在召出小队前，必须先有桌面流程。</p>

<h2 id="skeletons-zombies">Skeleton 和 Zombie 哪个更适合 Animate Dead？</h2>
<p><strong>Skeleton 通常更适合输出和远程压制，Zombie 更适合慢速堵门和吃伤害。</strong>选哪个取决于你这次让亡灵负责什么工作。</p>

<table>
  <thead>
    <tr>
      <th>选择</th>
      <th>最适合做什么</th>
      <th>要注意什么</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Skeleton</strong></td>
      <td>远程攻击、守卫、夹击压力、携带简单物品。</td>
      <td>HP 低。需要掩护、间距和简单指令。</td>
    </tr>
    <tr>
      <td><strong>Zombie</strong></td>
      <td>堵门、卡走廊、吸收攻击、恐怖场景。</td>
      <td>AC 低且移动慢。地形复杂时很容易浪费回合。</td>
    </tr>
  </tbody>
</table>

<p>按我的经验，skeleton 更好跑，因为“站在那边射那个目标”非常快。zombie 则适合目标不是伤害的场景。一个 zombie 在窄走廊里能为 Wizard 买到关键一轮；一个 zombie 在大地图上追弓箭手，基本只是喜剧效果。</p>

<h2 id="loadout">Necromancer Wizard 最佳法术配置</h2>
<p><strong>好用的 Necromancer Wizard 配置，会把亡灵法术、防御法术、控场和紧急解法混在一起。</strong>子职业幻想是死亡魔法，但你的实际工作仍然是“解决问题的 Wizard”。</p>

<table>
  <thead>
    <tr>
      <th>角色阶段</th>
      <th>建议准备 / 学习</th>
      <th>为什么这样配</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1-4 级</td>
      <td>False Life、Chill Touch、Mage Armor、Shield、Web</td>
      <td>你还算不上亡灵指挥官。先活下来、控住空间，并保留一点死亡风味。</td>
    </tr>
    <tr>
      <td>5-8 级</td>
      <td>Animate Dead、Counterspell、Dispel Magic、Fear、Blindness/Deafness</td>
      <td>这是甜蜜期。Animate Dead 给你场面存在感，控场法术让棋盘保持可读。</td>
    </tr>
    <tr>
      <td>9-12 级</td>
      <td>Danse Macabre、Enervation、Wall of Force、Create Undead</td>
      <td>可以加入更强亡灵选项，但别丢掉最能保护队伍的控场工具。</td>
    </tr>
    <tr>
      <td>13 级以上</td>
      <td>Finger of Death、Clone、Simulacrum、预案型防御</td>
      <td>高等级死灵法师更像规划者。永久资产比单发恐怖伤害更重要。</td>
    </tr>
  </tbody>
</table>

<p>如果你还在选职业底盘，可以先看 <a href="${ZH_DND_CLASSES_PATH}">DND 职业详解</a>。如果你经常专注断掉或还没让亡灵发挥就倒地，先读那篇 <a href="${ZH_DND_CONSTITUTION_PATH}">D&amp;D Constitution 指南</a>，再回头怪法术表。</p>

<h2 id="table-speed">怎样让亡灵小队不拖慢战斗？</h2>
<p><strong>想让亡灵小队跑得快，就要合并指令、在 DM 同意时使用平均伤害，并在轮到你之前决定亡灵计划。</strong>这就是“酷死灵法师”和“全桌默默嫌你慢”的区别。</p>

<ul>
  <li><strong>写下 24 小时到期点。</strong>我会把控制到期时间写在维持控制用的法术位旁边。</li>
  <li><strong>按小队跑，不按个体跑。</strong>四个 skeleton 是“弓手小队”，不是四段独立内心戏。</li>
  <li><strong>能预掷就预掷。</strong>先问 DM，然后把一小把 d20 一起掷。</li>
  <li><strong>指令保持无聊。</strong>“射 ogre”“守这个门”“跟着我”比复杂法律条款好用。</li>
  <li><strong>接受损耗。</strong>不要为了救一个 13 HP skeleton 花五分钟打断场景节奏。</li>
  <li><strong>尊重城镇场景。</strong>带尸体进市场可能会变成整场戏。先问全桌这是不是他们想玩的内容。</li>
</ul>

<p>如果是 boss 或 NPC 反派，我通常不会堆一大群亡灵。两三个标志性 undead 加一个强力法术，更好跑，也更容易被玩家记住。反派应该吓到玩家，而不是让大家等 DM 掷十二次短弓攻击。</p>

<h2 id="vtt-token">Necromancer 的 VTT Token 应该怎么做？</h2>
<p><strong>Necromancer 的 VTT Token 要在 512 px 下仍然看得出“亡灵魔法”，同时不能遮住脸和轮廓。</strong>满屏绿烟在大图里挺帅，但缩到战斗地图上经常变成一团脏色。</p>

<p>我在 <a href="${ZH_EDITOR_PATH}">VTT Token 制作工具</a> 里做 necromancer token 时，会把魔法效果控制在手、眼睛或边框附近。不要整张立绘都铺特效，因为 Roll20、Foundry VTT 和 Owlbear Rodeo 在缩放后都会惩罚过于嘈杂的 token。</p>

<ul>
  <li><strong>亡灵施法者和墓地牧师</strong>适合骨质、银色或暗铁边框。</li>
  <li><strong>只保留一种清晰强调色</strong>，例如病态绿、冷蓝或低饱和紫。</li>
  <li><strong>小怪 token 要比施法者更简单</strong>，这样地图层级一眼能看懂。</li>
  <li><strong>实战用 512 px，素材库用 1024 px</strong>，不要一上来就追求超大图。</li>
  <li><strong>测试 skeleton 攻击组时</strong>，可以顺手打开 <a href="${ZH_DICE_ROLLER_PATH}">D&amp;D 骰子工具</a>。</li>
</ul>

<section id="faq" class="mt-12 rounded-[34px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
  <h2 class="font-display text-2xl sm:text-3xl text-stone-50" style="margin-top: 0;">DND Necromancer Spells 常见问题</h2>

  <div class="mt-6 space-y-4">
    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">最好的 dnd necromancer spell 是哪个？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">最经典也最核心的是 <strong>Animate Dead</strong>，尤其当你想玩亡灵小队路线时。如果不想管理小兵，Blindness/Deafness 和 Speak with Dead 往往更干净。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Necromancer 几级可以施放 Animate Dead？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">通常来说，如果你是 Wizard 或 Cleric 这类能获得 3 环法术的 full caster，<strong>角色 5 级</strong>就可以施放 Animate Dead。具体仍要看你的职业、子职业和你们桌允许的规则来源。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Animate Dead 可以控制多少个 undead？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">3 环施放时，Animate Dead 可以创造 1 个 skeleton 或 zombie，或者重新控制最多 <strong>4 个</strong>你之前用此法术创造的 undead。3 环以上每升 1 环，创造或重新控制的上限再增加 2 个。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Wizard 可以在 DND 5e 里玩 necromancer 吗？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">可以。Wizard 是最常见的 necromancer 路线，2014 风格 5e 里 School of Necromancy 子职业尤其直观。Cleric 也能使用不少关键 necromancy spells。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Animate Dead 需要 Concentration 吗？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">不需要。Animate Dead 不吃 Concentration。要管理的是 24 小时控制时限，你需要在控制结束前重施法来维持命令权。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Skeleton 比 Zombie 更好吗？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">多数情况下，skeleton 更适合远程输出和快速结算；zombie 更适合堵门、吃伤害和营造恐怖感，因为它更慢、命中也更差。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">DND 里的 necromancy 一定是邪恶的吗？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">规则上不一定自动邪恶，但很多 DND 世界会把创造亡灵视为禁忌或邪恶行为。想公开使用 Animate Dead 前，先和 DM 对齐世界观。</p>
    </article>
  </div>
</section>

<h2 id="video">视频：D&amp;D 5E Animate Dead</h2>
<p>Zee Bashew 的 <a href="${DND_NECROMANCER_SPELLS_VIDEO_URL}" rel="noreferrer noopener">D&amp;D 5E Animate Dead</a> 抓住了这个法术最实用的一点：<strong>Animate Dead 最好玩、也最强的时候，是你把 skeleton 当成任务简单的队友，而不是一堆需要逐个表演的小兵</strong>。指令保持清楚，回合保持快速，你的死灵法师才会显得聪明，而不是拖沓。</p>

${liteVideoEmbed('wYBEbNbirkA', 'D&D 5E Animate Dead', {
  src: DND_NECROMANCER_SPELLS_VIDEO_PLACEHOLDER_PATH,
  alt: 'dnd necromancer spells 视频 webp 封面图，展示 D&D 5E Animate Dead 的 YouTube 缩略图',
})}
`;
