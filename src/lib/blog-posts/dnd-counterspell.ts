import {
  DND_COUNTERSPELL_TIMING_IMAGE_PATH,
  DND_COUNTERSPELL_FIELD_NOTES_IMAGE_PATH,
  DND_COUNTERSPELL_VIDEO_PLACEHOLDER_PATH,
  DND_COUNTERSPELL_2014_RULES_URL,
  DND_COUNTERSPELL_2024_RULES_URL,
  DND_COUNTERSPELL_VIDEO_URL,
  EN_DND_CLASSES_PATH,
  EN_DND_CONSTITUTION_PATH,
  EN_DND_DRUID_SPELLS_PATH,
  EN_EDITOR_PATH,
  EN_DICE_ROLLER_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_DND_CONSTITUTION_PATH,
  ZH_DND_DRUID_SPELLS_PATH,
  ZH_EDITOR_PATH,
  ZH_DICE_ROLLER_PATH,
  liteVideoEmbed,
} from './shared';

export const dndCounterspellArticleHtml = String.raw`
<p>For <strong>dnd counterspell</strong>, the useful answer usually starts with the ruling, not the debate: Counterspell is a 3rd-level Abjuration reaction that interrupts another creature while it is casting a spell within 60 feet. This guide gives you the fast table, the 2014 vs 2024 rules split, and the table calls that stop a rules argument from eating the best round of combat.</p>

<table>
  <thead>
    <tr>
      <th>Need-to-know point</th>
      <th>Fast answer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Spell level</strong></td>
      <td>3rd-level Abjuration.</td>
    </tr>
    <tr>
      <td><strong>Core classes</strong></td>
      <td>Sorcerer, Warlock, and Wizard. Subclasses, feats, and table options can add access.</td>
    </tr>
    <tr>
      <td><strong>Casting time</strong></td>
      <td>1 reaction, triggered by seeing a creature within 60 feet casting a spell.</td>
    </tr>
    <tr>
      <td><strong>Range / duration</strong></td>
      <td>60 feet / Instantaneous.</td>
    </tr>
    <tr>
      <td><strong>Components</strong></td>
      <td>Somatic only, so the counterspeller needs a usable hand.</td>
    </tr>
    <tr>
      <td><strong>2014 rule</strong></td>
      <td>Automatically stops level 3 or lower spells; higher spells require a spellcasting ability check unless you upcast high enough.</td>
    </tr>
    <tr>
      <td><strong>2024 rule</strong></td>
      <td>The target caster makes a Constitution save; on a failure the spell fizzles, but a spell slot is not spent.</td>
    </tr>
    <tr>
      <td><strong>Best use</strong></td>
      <td>Stop the spell that changes the encounter, not every spell that looks annoying.</td>
    </tr>
  </tbody>
</table>

<p>I am treating this as a spell encyclopedia page, not a hype piece. In our games, <strong>dnd counterspell</strong> is at its best when the table knows three things before initiative starts: which rule version is active, whether characters know the spell name before reacting, and how hard the DM wants enemy casters to push back.</p>

<nav aria-label="Article table of contents">
  <p><strong>On this page:</strong></p>
  <ol>
    <li><a href="#quick-rules">DND Counterspell quick rules</a></li>
    <li><a href="#who-can-cast">Who can cast Counterspell</a></li>
    <li><a href="#counterspell-2014">How the 2014 version works</a></li>
    <li><a href="#counterspell-2024">How the 2024 version works</a></li>
    <li><a href="#when-to-cast">When to cast Counterspell</a></li>
    <li><a href="#rulings">Common rulings that cause arguments</a></li>
    <li><a href="#faq">FAQ</a></li>
    <li><a href="#video">Video</a></li>
  </ol>
</nav>

<h2 id="quick-rules">DND Counterspell Quick Rules</h2>
<p><strong>dnd counterspell</strong> is a reaction spell for stopping another spell before that spell resolves. The official text differs sharply between the <a href="${DND_COUNTERSPELL_2014_RULES_URL}" rel="noreferrer noopener">2014 Basic Rules version</a> and the <a href="${DND_COUNTERSPELL_2024_RULES_URL}" rel="noreferrer noopener">2024 Free Rules version</a>, so the first practical question is not "is Counterspell good?" It is "which Counterspell are we using tonight?"</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_COUNTERSPELL_TIMING_IMAGE_PATH}"
    alt="Dark fantasy alchemy workbench showing a blue abjuration sigil interrupting gold spell energy beside an hourglass and glowing d20"
    width="1565"
    height="1005"
    loading="lazy"
    decoding="async"
  />
  <figcaption>The important window is before the target spell resolves. Once the magical reaction has already broken through, you are in damage mitigation territory, not Counterspell territory.</figcaption>
</figure>

<ul>
  <li><strong>You need the reaction available.</strong> No reaction means no Counterspell.</li>
  <li><strong>You need the target in range.</strong> The key number is 60 feet.</li>
  <li><strong>You need to perceive the casting.</strong> Hidden casters, total cover, silence, or component removal can matter a lot.</li>
  <li><strong>You need to resolve the right rules version.</strong> 2014 is slot/check based; 2024 is saving throw based.</li>
</ul>

<h2 id="who-can-cast">Who Can Cast DND Counterspell?</h2>
<p><strong>Sorcerers, Warlocks, and Wizards are the core classes that can cast DND Counterspell.</strong> Some subclasses, feats, magic items, and optional table rules can add access, but if a player asks for the normal spell-list answer, those three classes are the clean starting point.</p>

<p>In actual character planning, Counterspell is easiest to justify on a caster who already wants to stand within 60 feet of enemy magic. A backline Wizard can use it defensively, a Warlock has to be more careful with limited slots, and a Sorcerer can pair it with metamagic-heavy tactics. The spell is strong on all three, but the opportunity cost is not the same.</p>

<h2 id="counterspell-2014">How Does DND Counterspell Work in 2014 5e?</h2>
<p><strong>In 2014 D&amp;D 5e, dnd counterspell automatically stops spells of 3rd level or lower and uses a spellcasting ability check against higher-level spells unless you upcast it.</strong> This is the version many long-running 5e tables still mean when they say "Counterspell."</p>

<p>The 2014 version is brutal because it can erase both the action and the spell slot. That is why it created so many famous table moments and so many DM headaches. A 3rd-level slot can stop a 3rd-level <em>Fireball</em> with no roll, while a 9th-level spell can still be challenged by a DC 19 ability check.</p>

<table>
  <thead>
    <tr>
      <th>Target spell level</th>
      <th>Base 3rd-level Counterspell</th>
      <th>Upcast result</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1st-3rd</td>
      <td>Automatic stop</td>
      <td>No need to upcast</td>
    </tr>
    <tr>
      <td>4th</td>
      <td>Spellcasting ability check, DC 14</td>
      <td>4th-level slot stops it automatically</td>
    </tr>
    <tr>
      <td>5th</td>
      <td>Spellcasting ability check, DC 15</td>
      <td>5th-level slot stops it automatically</td>
    </tr>
    <tr>
      <td>6th-9th</td>
      <td>DC 16 to DC 19 ability check</td>
      <td>Matching or higher slot stops it automatically</td>
    </tr>
  </tbody>
</table>

<p>One small but important detail: this is an <strong>ability check</strong>, not a saving throw and not a spell attack. In our sessions, that difference matters most for Bards, Abjuration Wizards, and any house rule that tries to add proficiency where the spell does not normally grant it.</p>

<h2 id="counterspell-2024">How Does DND Counterspell Work in the 2024 Rules?</h2>
<p><strong>In the 2024 rules, dnd counterspell forces the target caster to make a Constitution saving throw; if the caster fails, the spell has no effect, but a spell slot used for that spell is not expended.</strong> This makes Counterspell less punishing and much less automatic.</p>

<p>The design shift is easy to feel at the table. The 2014 version says "I might delete your whole turn and your resource." The 2024 version says "I might delay your spell and waste your action economy, but you keep the slot." That is still strong, but it is less likely to turn every enemy caster into a frustration engine.</p>

<table>
  <thead>
    <tr>
      <th>Question</th>
      <th>2014 Counterspell</th>
      <th>2024 Counterspell</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Does a low-level spell get auto-stopped?</td>
      <td>Yes, if the target spell is 3rd level or lower.</td>
      <td>No. The target caster makes a Constitution save.</td>
    </tr>
    <tr>
      <td>Does upcasting guarantee success?</td>
      <td>Yes, if the slot level equals or exceeds the target spell level.</td>
      <td>No upcast guarantee is listed in the 2024 spell text.</td>
    </tr>
    <tr>
      <td>Does the target lose the spell slot?</td>
      <td>Usually yes, because the spell fails after being cast.</td>
      <td>No, if the interrupted spell used a spell slot.</td>
    </tr>
    <tr>
      <td>What defensive stat matters?</td>
      <td>The counterspeller's spellcasting ability check.</td>
      <td>The target caster's Constitution saving throw.</td>
    </tr>
    <tr>
      <td>What casting trigger matters?</td>
      <td>Seeing a creature within 60 feet casting a spell.</td>
      <td>Seeing a creature within 60 feet casting a spell with Verbal, Somatic, or Material components.</td>
    </tr>
  </tbody>
</table>

<p>If your campaign mixes 2014 characters with 2024 rules, do not assume everyone at the table is picturing the same spell. Write the version on the character sheet or campaign note. It saves time.</p>

<h2 id="when-to-cast">When Should You Cast DND Counterspell?</h2>
<p><strong>You should cast dnd counterspell when the enemy spell would change the encounter more than your reaction and spell slot are worth.</strong> That sounds obvious, but it is the mistake I see most often: players counter the first visible spell instead of the spell that actually breaks the fight.</p>

<ul>
  <li><strong>Counter encounter-swinging spells.</strong> Big control, banishment effects, enemy escape spells, and lethal area damage are usually worth it.</li>
  <li><strong>Think before countering minor damage.</strong> A small blast may hurt less than losing your reaction for <em>Shield</em>, <em>Absorb Elements</em>, or an opportunity attack.</li>
  <li><strong>Protect concentration turns.</strong> If your party has already invested in <em>Haste</em>, <em>Spirit Guardians</em>, or a major control spell, blocking the enemy answer can be the real win.</li>
  <li><strong>Check range before getting clever.</strong> Counterspell rewards positioning. A caster standing 65 feet away is not a valid target.</li>
  <li><strong>Ask what your DM announces.</strong> "The lich begins casting" creates a very different decision from "the lich casts <em>Disintegrate</em>."</li>
</ul>

<p>My personal rule is simple: I do not spend Counterspell on a spell I would be comfortable healing through or solving next round. I spend it on spells that remove player turns, split the party, end concentration, or let the villain leave with the objective.</p>

<h2 id="rulings">Common Counterspell Rulings That Cause Arguments</h2>
<p><strong>Most dnd counterspell arguments are not about the spell's power; they are about timing, information, and reaction economy.</strong> Set these rulings before the first wizard duel and the spell becomes much cleaner.</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_COUNTERSPELL_FIELD_NOTES_IMAGE_PATH}"
    alt="Ancient parchment field notes for dnd counterspell showing blue arcane timing diagrams, dice, and a warding sigil on a wizard desk"
    width="1672"
    height="941"
    loading="lazy"
    decoding="async"
  />
  <figcaption>A clean Counterspell policy works best as a table procedure: timing, visibility, range, and reaction cost all need to be visible before the roll.</figcaption>
</figure>

<h3>Can you Counterspell Counterspell?</h3>
<p><strong>Usually yes in 2014 rules, if you can see the counterspeller, they are within 60 feet, and you still have your reaction.</strong> This is the classic "I Counterspell your Counterspell" chain that appears in many actual-play tables.</p>

<p>For 2024 play, check the newer one-spell-slot-per-turn rule. If you already spent a spell slot on your own turn to cast the original spell, your table may rule that you cannot also spend another slot on Counterspell during that same turn. On someone else's turn, the reaction is usually cleaner.</p>

<h3>Do you know what spell is being cast?</h3>
<p><strong>By default, Counterspell only needs you to see a creature casting, not to know the spell name.</strong> Whether the DM announces the exact spell before reactions is a table policy. I strongly recommend choosing one policy and using it for both players and monsters.</p>

<h3>Does Subtle Spell beat Counterspell?</h3>
<p><strong>It can.</strong> If a spell has no perceivable components, there may be no visible casting for Counterspell to interrupt. The 2024 wording makes this even clearer by tying the trigger to spells with Verbal, Somatic, or Material components.</p>

<h3>Can Counterspell stop a magic item spell?</h3>
<p><strong>Sometimes, but not always.</strong> The key question is whether a creature is actually casting a spell and whether that casting is perceivable. If the item simply creates a magical effect without spellcasting, Counterspell is the wrong tool; <em>Dispel Magic</em> or another answer may matter more.</p>

<h2 id="dm-policy">My DM Policy for Counterspell</h2>
<p>I like <strong>dnd counterspell</strong> when it creates a hard choice. I dislike it when it becomes a reflex tax. The video below works as a useful reminder: the memorable part of a famous Counterspell scene is not just "the spell was stopped." It is the cost, the timing, and the table realizing that one reaction mattered.</p>

<p>For DMs, my practical policy is:</p>
<ol>
  <li><strong>Announce casting consistently.</strong> Do not give monsters more information than players get.</li>
  <li><strong>Use enemy Counterspell sparingly.</strong> One important counter feels dramatic; every mage having it feels like paperwork.</li>
  <li><strong>Let positioning matter.</strong> Range, cover, invisibility, silence, and line of sight should do real work.</li>
  <li><strong>Tell players which version is active.</strong> 2014 and 2024 Counterspell are different enough to change builds.</li>
</ol>

<h2 id="vtt-prep">Using Counterspell with VTT Prep</h2>
<p>If you are building a spellcaster villain, archmage NPC, or abjurer PC for a virtual tabletop, make the Counterspell-ready character easy to read on the map. A clear hand pose, arcane focus, or blue-gold warding effect helps everyone remember that this token is not just another ranged attacker.</p>

<p>You can prep that portrait in the <a href="${EN_EDITOR_PATH}">Token Maker editor</a>, then keep the <a href="${EN_DICE_ROLLER_PATH}">D&amp;D Dice Roller</a> open for the 2014 ability check or the 2024 Constitution save. If you are still choosing the caster chassis, the <a href="${EN_DND_CLASSES_PATH}">DND classes guide</a>, <a href="${EN_DND_DRUID_SPELLS_PATH}">DND druid spells list</a>, and <a href="${EN_DND_CONSTITUTION_PATH}">Constitution guide</a> are the closest related reads on this site.</p>

<h2 id="faq">FAQ About DND Counterspell</h2>
<h3>What level is DND Counterspell?</h3>
<p><strong>DND Counterspell is a 3rd-level Abjuration spell.</strong> It is most commonly associated with Sorcerers, Warlocks, and Wizards, though some subclasses and expanded lists can change access.</p>

<h3>Can DND Counterspell stop any spell?</h3>
<p><strong>No. DND Counterspell only works when its trigger, range, and perception requirements are met.</strong> It cannot stop a spell already resolved, a caster you cannot perceive, or a magical effect that is not actually a spell being cast.</p>

<h3>Does Counterspell waste the enemy spell slot?</h3>
<p><strong>It depends on the rules version.</strong> In 2014 5e, a successfully countered spell normally wastes the target's slot. In the 2024 rules, the interrupted spell has no effect, but a spell slot used for it is not expended.</p>

<h3>Can you Counterspell if you do not know the spell name?</h3>
<p><strong>Yes, if your table only requires seeing the casting trigger.</strong> Some DMs give the spell name before reactions, some only describe the casting, and some allow another character to identify the spell. Pick one policy before combat.</p>

<h3>Is DND Counterspell overpowered?</h3>
<p><strong>Counterspell is powerful, but the table procedure matters more than the spell alone.</strong> The 2014 version can feel oppressive if every enemy caster has it. The 2024 version is softer because it gives the target a save and preserves spell slots.</p>

<h2 id="video">Watch the Counterspell Video</h2>
<p>The video below is <a href="${DND_COUNTERSPELL_VIDEO_URL}" rel="noreferrer noopener">Critical Role - Sam the Wide Deceiver - Spoilers Ep 114</a>. I would not treat it as a rules tutorial. Treat it as a design lesson: Counterspell hits hardest when it is a meaningful sacrifice, not a button everyone presses every round.</p>

${liteVideoEmbed('VQ1rmjrX4K0', 'Critical Role - Sam the Wide Deceiver - Spoilers Ep 114', {
  src: DND_COUNTERSPELL_VIDEO_PLACEHOLDER_PATH,
  alt: 'Clickable webp video cover for a dnd counterspell guide showing a blue and gold magical clash with a play button',
})}
`;

export const dndCounterspellArticleHtmlZh = String.raw`
<p><strong>dnd counterspell</strong> 最容易在桌上引发争论的不是法术名字，而是时机、版本和裁定：什么时候能反制、2014 和 2024 规则到底差在哪、能不能反制别人的 Counterspell。这篇会先给速查表，再把实战里最容易吵起来的点拆开讲清楚。</p>

<table>
  <thead>
    <tr>
      <th>你最关心的点</th>
      <th>快速答案</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>法术等级</strong></td>
      <td>3 环 Abjuration。</td>
    </tr>
    <tr>
      <td><strong>核心职业</strong></td>
      <td>Sorcerer、Warlock、Wizard。子职、专长和桌规可能额外开放。</td>
    </tr>
    <tr>
      <td><strong>施法时间</strong></td>
      <td>1 个反应；触发条件是看见 60 尺内的生物正在施法。</td>
    </tr>
    <tr>
      <td><strong>距离 / 持续时间</strong></td>
      <td>60 尺 / Instantaneous。</td>
    </tr>
    <tr>
      <td><strong>法术成分</strong></td>
      <td>只有 Somatic，所以反制者需要一只可用的手。</td>
    </tr>
    <tr>
      <td><strong>2014 版规则</strong></td>
      <td>自动反制 3 环及以下法术；更高环需要施法关键属性检定，除非你升环到足够高。</td>
    </tr>
    <tr>
      <td><strong>2024 版规则</strong></td>
      <td>目标施法者做 Constitution 豁免；失败则法术无效，但如果消耗的是法术位，该法术位不会花掉。</td>
    </tr>
    <tr>
      <td><strong>最佳用途</strong></td>
      <td>反制会改变战局的法术，而不是看到什么法术都立刻按下去。</td>
    </tr>
  </tbody>
</table>

<p>Counterspell 不能只看强度。按我自己的跑团经验，<strong>dnd counterspell</strong> 真正决定体验的不是法术本身，而是三件事：你们桌用哪个版本、DM 会不会在反应前报出法术名、敌方法师会不会频繁拿它来反制玩家。</p>

<h2 id="quick-rules">DND Counterspell 速查规则</h2>
<p><strong>dnd counterspell</strong> 是一个用反应打断对方施法的法术。关键是，<a href="${DND_COUNTERSPELL_2014_RULES_URL}" rel="noreferrer noopener">2014 Basic Rules 的 Counterspell</a> 和 <a href="${DND_COUNTERSPELL_2024_RULES_URL}" rel="noreferrer noopener">2024 Free Rules 的 Counterspell</a> 差异很大，所以开团前最该问的不是“它强不强”，而是“我们今天用哪一版”。</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_COUNTERSPELL_TIMING_IMAGE_PATH}"
    alt="dnd counterspell 暗黑炼金实验台静物图，蓝色防护符文在沙漏和发光 d20 旁截断金色法术能量"
    width="1565"
    height="1005"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Counterspell 的窗口在目标法术生效之前。魔法反应已经突破以后，你要处理的是减伤和治疗，不再是反制。</figcaption>
</figure>

<ul>
  <li><strong>你必须还有反应。</strong>反应用掉了，就不能再 Counterspell。</li>
  <li><strong>目标必须在范围内。</strong>关键数字是 60 尺。</li>
  <li><strong>你必须能感知到对方正在施法。</strong>隐形、全掩蔽、沉默、无成分施法都会影响裁定。</li>
  <li><strong>必须确认规则版本。</strong>2014 版偏法术位与检定；2024 版偏豁免。</li>
</ul>

<h2 id="who-can-cast">谁能施放 DND Counterspell？</h2>
<p><strong>Sorcerer、Warlock 和 Wizard 是能施放 DND Counterspell 的核心职业。</strong> 子职、专长、魔法物品和桌规可能额外开放 Counterspell，但如果你只问正常法术列表，答案就是这三个。</p>

<p>实际构筑时，我会看这个角色是否愿意站在敌方法师 60 尺内。Wizard 用它做防守很自然；Warlock 因为法术位少，交 Counterspell 的代价更高；Sorcerer 则可以和超魔体系形成更灵活的施法博弈。三者都能用，但机会成本不同。</p>

<h2 id="counterspell-2014">2014 版 DND Counterspell 怎么结算？</h2>
<p><strong>2014 版 D&amp;D 5e 里，dnd counterspell 会自动反制 3 环及以下法术；目标法术为 4 环或更高时，需要用你的施法关键属性做检定，除非你把 Counterspell 升环到足够高。</strong> 很多老 5e 团说 Counterspell，默认指的就是这一版。</p>

<p>2014 版强就强在它可能同时抹掉对方的动作和法术位。3 环 Counterspell 可以无骰反制 3 环 <em>Fireball</em>；如果对方放的是 9 环法术，你也仍然可以尝试 DC 19 的施法属性检定。</p>

<table>
  <thead>
    <tr>
      <th>目标法术等级</th>
      <th>3 环 Counterspell</th>
      <th>升环结果</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1-3 环</td>
      <td>自动反制</td>
      <td>通常没必要升环</td>
    </tr>
    <tr>
      <td>4 环</td>
      <td>施法关键属性检定，DC 14</td>
      <td>4 环 Counterspell 自动反制</td>
    </tr>
    <tr>
      <td>5 环</td>
      <td>施法关键属性检定，DC 15</td>
      <td>5 环 Counterspell 自动反制</td>
    </tr>
    <tr>
      <td>6-9 环</td>
      <td>DC 16 到 DC 19 的属性检定</td>
      <td>用同环或更高环法术位可自动反制</td>
    </tr>
  </tbody>
</table>

<p>注意，这里是 <strong>ability check</strong>，不是豁免，也不是法术攻击。实际桌面上，这点会影响 Bard、Abjuration Wizard，以及那些想把熟练加值塞进判定里的自订规则。</p>

<h2 id="counterspell-2024">2024 版 DND Counterspell 怎么结算？</h2>
<p><strong>2024 版规则里，dnd counterspell 会让目标施法者做 Constitution 豁免；失败时法术无效，但如果该法术使用了法术位，法术位不会被消耗。</strong> 这让 Counterspell 没那么一刀切，也没那么容易让人心态爆炸。</p>

<p>这个变化在桌面上很明显。2014 版像是在说“我可能删掉你的整个回合和资源”；2024 版更像是“我可能让你这次施法失败，但你至少不丢法术位”。它依然强，但不再那么容易把法师战变成互相按取消键。</p>

<table>
  <thead>
    <tr>
      <th>问题</th>
      <th>2014 版 Counterspell</th>
      <th>2024 版 Counterspell</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>低环法术会被自动反制吗？</td>
      <td>会，3 环及以下直接无效。</td>
      <td>不会。目标施法者要做 Constitution 豁免。</td>
    </tr>
    <tr>
      <td>升环能保证成功吗？</td>
      <td>能，只要你的 Counterspell 环位不低于目标法术。</td>
      <td>2024 版法术文本没有给出升环自动成功。</td>
    </tr>
    <tr>
      <td>目标会丢法术位吗？</td>
      <td>通常会，因为法术已经被打断并失败。</td>
      <td>不会，如果那个法术本来是用法术位施放的。</td>
    </tr>
    <tr>
      <td>关键防御属性是什么？</td>
      <td>反制者的施法关键属性检定。</td>
      <td>目标施法者的 Constitution 豁免。</td>
    </tr>
    <tr>
      <td>触发条件最关键的变化是什么？</td>
      <td>看见 60 尺内的生物正在施法。</td>
      <td>看见 60 尺内的生物正在施放带 Verbal、Somatic 或 Material 成分的法术。</td>
    </tr>
  </tbody>
</table>

<p>如果你的团同时混用 2014 人物卡和 2024 新规则，千万不要默认所有人脑子里是同一个 Counterspell。直接写进团规或角色卡备注里，最省时间。</p>

<h2 id="when-to-cast">什么时候值得施放 DND Counterspell？</h2>
<p><strong>当敌方法术对战局的影响大于你这次反应和法术位的价值时，就值得施放 dnd counterspell。</strong> 这句话听起来简单，但很多人会犯的错是：看见第一个法术就反，而不是等真正会改写战斗的法术。</p>

<ul>
  <li><strong>优先反制能改变遭遇的法术。</strong>强控、放逐、逃跑、超高爆发范围伤害，通常都值得。</li>
  <li><strong>别急着反制小伤害。</strong>有时保留反应给 <em>Shield</em>、<em>Absorb Elements</em> 或机会攻击更赚。</li>
  <li><strong>保护关键专注。</strong>队友已经开了 <em>Haste</em>、<em>Spirit Guardians</em> 或强控时，反掉敌人的解法才是赢点。</li>
  <li><strong>先看距离。</strong>Counterspell 非常吃站位。65 尺外的敌人就是不能反制。</li>
  <li><strong>确认 DM 怎么报法术。</strong>“巫妖开始施法”和“巫妖施放 <em>Disintegrate</em>”会让玩家做出完全不同的判断。</li>
</ul>

<p>我的个人判断很粗暴：如果这个法术只是造成一点可以治疗回来的伤害，我通常不交 Counterspell；如果它会夺走玩家回合、切开队伍、打掉关键专注，或者让反派带着任务目标逃走，我才会认真考虑。</p>

<h2 id="rulings">最容易吵起来的 Counterspell 裁定</h2>
<p><strong>大多数 dnd counterspell 争议不是强度争议，而是时机、信息量和反应经济争议。</strong> 这些点提前讲清楚，法师对决会顺很多。</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_COUNTERSPELL_FIELD_NOTES_IMAGE_PATH}"
    alt="dnd counterspell 羊皮纸规则笔记图，巫师桌上有蓝色奥术时机图、骰子和防护符文"
    width="1672"
    height="941"
    loading="lazy"
    decoding="async"
  />
  <figcaption>好用的 Counterspell 桌规应该像一张流程笔记：时机、可见性、距离和反应代价都要在掷骰前说清楚。</figcaption>
</figure>

<h3>能不能 Counterspell 对方的 Counterspell？</h3>
<p><strong>2014 规则下通常可以，前提是你能看见对方、对方在 60 尺内，而且你还有反应。</strong> 这就是很多实际跑团里会出现的“我反制你的反制”。</p>

<p>如果使用 2024 规则，要特别看“一回合只能消耗一个法术位施法”的新限制。如果你在自己的回合已经用法术位放了原本那个法术，你们桌可能会裁定你不能在同一回合再消耗法术位施放 Counterspell。发生在别人回合时，通常就简单得多。</p>

<h3>施放 Counterspell 前，角色知道对方在放什么法术吗？</h3>
<p><strong>默认来说，Counterspell 只需要你看见对方正在施法，不要求你已经知道法术名。</strong> 但 DM 会不会在反应前直接报出法术名，是桌规问题。我的建议是玩家和怪物用同一套信息规则。</p>

<h3>Subtle Spell 能不能绕过 Counterspell？</h3>
<p><strong>很多情况下可以。</strong> 如果一个法术没有可感知的成分，就未必有能被你“看见”的施法过程。2024 版写法更明确，因为触发条件直接绑到了带有 Verbal、Somatic 或 Material 成分的施法上。</p>

<h3>魔法物品施放的法术能被 Counterspell 吗？</h3>
<p><strong>有时可以，但不是永远可以。</strong> 核心问题是：是否有一个生物正在施放法术，以及这个施法过程是否能被感知。如果物品只是制造魔法效果，而不是让生物施法，那 Counterspell 往往不是正确答案。</p>

<h2 id="dm-policy">我给 DM 的 Counterspell 处理建议</h2>
<p>我喜欢 <strong>dnd counterspell</strong> 制造艰难选择，但不喜欢它变成每个法师都要交的“反应税”。文末视频很适合作为提醒：一个经典 Counterspell 场面之所以好，不只是因为法术被反掉，而是因为时机、代价和角色选择都很明确。</p>

<p>如果我是 DM，我会这么处理：</p>
<ol>
  <li><strong>报施法信息要一致。</strong>怪物不能比玩家多拿一层信息优势。</li>
  <li><strong>敌方 Counterspell 少用但用准。</strong>一次关键反制很有戏；每个敌方法师都会反制，只会让流程变慢。</li>
  <li><strong>让站位真的有价值。</strong>距离、掩蔽、隐形、沉默和视线都应该能影响 Counterspell。</li>
  <li><strong>开团前确认版本。</strong>2014 和 2024 Counterspell 差异大到会影响构筑。</li>
</ol>

<h2 id="vtt-prep">在 VTT 里准备 Counterspell 角色</h2>
<p>如果你要做一个会 Counterspell 的反派法师、学院派 abjurer，或者专门保护队友的施法者 Token，建议让头像在地图上一眼就能读出“这个人会反制”。清楚的手势、奥术焦点、蓝金色护盾光效，都比普通站桩头像更能提醒玩家它的桌面功能。</p>

<p>你可以在 <a href="${ZH_EDITOR_PATH}">Token Maker 编辑器</a> 里处理这类施法者头像，再把 <a href="${ZH_DICE_ROLLER_PATH}">D&amp;D Dice Roller</a> 打开，用来跑 2014 版属性检定或 2024 版 Constitution 豁免。如果你还在选施法者底盘，可以继续看站内的 <a href="${ZH_DND_CLASSES_PATH}">DND 职业详解</a>、<a href="${ZH_DND_DRUID_SPELLS_PATH}">DND 德鲁伊法术</a> 和 <a href="${ZH_DND_CONSTITUTION_PATH}">Constitution 指南</a>。</p>

<h2 id="faq">FAQ：关于 DND Counterspell 的常见问题</h2>
<h3>DND Counterspell 是几环法术？</h3>
<p><strong>DND Counterspell 是 3 环 Abjuration 法术。</strong>最常见的使用者是 Sorcerer、Warlock 和 Wizard，不过子职、扩展法术列表和新版规则可能会改变可用范围。</p>

<h3>DND Counterspell 能反制所有法术吗？</h3>
<p><strong>不能。DND Counterspell 必须满足触发、范围和感知条件。</strong>已经生效的法术、你看不见的施法者，或者并非“正在施放的法术”的魔法效果，都不是它的正常目标。</p>

<h3>Counterspell 会浪费敌人的法术位吗？</h3>
<p><strong>取决于你用哪个版本。</strong>2014 版 5e 中，被成功反制的法术通常会浪费目标法术位；2024 版中，法术无效，但如果该法术使用了法术位，该法术位不会被消耗。</p>

<h3>不知道对方具体法术名，也能 Counterspell 吗？</h3>
<p><strong>可以，只要你们桌只要求看见施法触发。</strong>有些 DM 会在反应前报法术名，有些只描述施法动作，有些允许另一个角色辨识法术。关键是提前统一规则。</p>

<h3>DND Counterspell 超模吗？</h3>
<p><strong>Counterspell 很强，但真正影响体验的是桌面流程。</strong>2014 版如果给太多敌方法师使用，会很压迫；2024 版因为给目标豁免且保留法术位，压力会小很多。</p>

<h2 id="video">观看 Counterspell 视频</h2>
<p>下面这段视频是 <a href="${DND_COUNTERSPELL_VIDEO_URL}" rel="noreferrer noopener">Critical Role - Sam the Wide Deceiver - Spoilers Ep 114</a>。我不建议把它当纯规则教程看，更适合当成一个设计提醒：Counterspell 最有力的时候，是它代表一次明确的代价和选择，而不是每轮都按的取消键。</p>

${liteVideoEmbed('VQ1rmjrX4K0', 'Critical Role - Sam the Wide Deceiver - Spoilers Ep 114', {
  src: DND_COUNTERSPELL_VIDEO_PLACEHOLDER_PATH,
  alt: 'dnd counterspell 指南视频封面，蓝色与金色魔法碰撞，中间有播放按钮',
})}
`;
