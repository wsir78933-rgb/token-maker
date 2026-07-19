import {
  DND_SILVERY_BARBS_2014_BASIC_RULES_URL,
  DND_SILVERY_BARBS_2024_CASTING_RULES_URL,
  DND_SILVERY_BARBS_2024_FREE_RULES_URL,
  DND_SILVERY_BARBS_SOURCE_URL,
  DND_SILVERY_BARBS_VIDEO_PLACEHOLDER_PATH,
  DND_SILVERY_BARBS_VIDEO_URL,
  EN_DICE_ROLLER_PATH,
  EN_DND_BARD_SPELLS_PATH,
  EN_DND_COUNTERSPELL_PATH,
  EN_DND_RANGER_SPELLS_PATH,
  EN_EDITOR_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_BARD_SPELLS_PATH,
  ZH_DND_COUNTERSPELL_PATH,
  ZH_DND_RANGER_SPELLS_PATH,
  ZH_EDITOR_PATH,
  liteVideoEmbed,
} from './shared';

const SILVERY_BARBS_VIDEO_ID = 'Iywz0U5Zwl0';

export const dndSilveryBarbsArticleHtml = String.raw`
<p><strong>dnd silvery barbs</strong> raises three table questions: when the reaction can happen, whether the spell is allowed at your table, and what changes when a group moves from 2014 rules to 2024 rules.</p>

<p>Here is the honest table answer. Silvery Barbs is powerful because it waits for a success, spends your reaction, and can turn one enemy success into a second roll while handing an ally advantage for later. It is not free. It is not core-book default at every table. Under 2024 spellcasting, one same-turn spell-slot rule can matter at the table.</p>

<h2 id="quick-answer">Quick answer: what is Silvery Barbs?</h2>
<p><strong>Silvery Barbs is a 1st-level enchantment spell from Strixhaven that you cast as a reaction after a creature you can see within 60 feet succeeds on an attack roll, ability check, or saving throw.</strong> The creature rerolls and uses the lower result, then a creature you choose gets advantage on its next attack roll, ability check, or saving throw within 1 minute.</p>

<p>That is a rules summary, not a replacement for the book text. The important play pattern is simple: wait for a visible success, decide whether the reaction is worth it, mark the ally who has advantage waiting, and move on.</p>

<p><strong>Silvery Barbs was introduced in Strixhaven: A Curriculum of Chaos, not the 2014 Player's Handbook.</strong> <strong>It is not printed in the 2024 Free Rules spell list.</strong> Ask the DM before building a character around it.</p>

<h2 id="source-and-access">Source, classes, and table permission</h2>
<p>The official D&amp;D Beyond explainer describes Silvery Barbs as a spell introduced in <em>Strixhaven: A Curriculum of Chaos</em>. It also notes that the spell is available to Bards, Sorcerers, and Wizards when that content is enabled.</p>

<p>That source matters. A character using only the 2014 Player's Handbook does not automatically have it. A character using only the 2024 Free Rules does not automatically have it. A campaign that allows Strixhaven or broader setting content can allow it, but that is a table decision.</p>

<p>I would settle that decision before Session 0 ends. If one player plans around Silvery Barbs and the DM decides after the first boss fight that it is banned, nobody enjoys that conversation.</p>

<h2 id="stats-table">Silvery Barbs rules table</h2>
<table>
  <thead>
    <tr>
      <th>Rule</th>
      <th>Table note</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Source</strong></td>
      <td><em>Strixhaven: A Curriculum of Chaos</em>, not the 2014 Player's Handbook or 2024 Free Rules.</td>
    </tr>
    <tr>
      <td><strong>Level and school</strong></td>
      <td>1st-level enchantment.</td>
    </tr>
    <tr>
      <td><strong>Casting time</strong></td>
      <td>Reaction, after a visible creature within range succeeds on an attack roll, ability check, or saving throw.</td>
    </tr>
    <tr>
      <td><strong>Range</strong></td>
      <td>60 feet.</td>
    </tr>
    <tr>
      <td><strong>Components</strong></td>
      <td>Verbal only.</td>
    </tr>
    <tr>
      <td><strong>Concentration</strong></td>
      <td>Silvery Barbs does not require concentration.</td>
    </tr>
    <tr>
      <td><strong>Common spell lists</strong></td>
      <td>Bard, Sorcerer, and Wizard when Strixhaven content is allowed.</td>
    </tr>
  </tbody>
</table>

<h2 id="2014-vs-2024">2014 vs 2024: what actually changes?</h2>
<p>The spell itself was not rewritten in the 2024 Free Rules. The clean way to compare versions is to separate source access from table procedure.</p>

<table>
  <thead>
    <tr>
      <th>Question</th>
      <th>2014-era table</th>
      <th>2024 table</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Is it in the core free spell list?</strong></td>
      <td>No. It is Strixhaven content, not a 2014 Basic Rules or 2014 Player's Handbook spell.</td>
      <td>No. It is not printed in the 2024 Free Rules spell list.</td>
    </tr>
    <tr>
      <td><strong>Can a character use it?</strong></td>
      <td>Yes, if the DM allows Strixhaven or the relevant source package.</td>
      <td>Yes, if the DM allows that legacy/expanded source at the 2024 table.</td>
    </tr>
    <tr>
      <td><strong>Reaction timing</strong></td>
      <td>Use the reaction after the triggering success is known.</td>
      <td>Same practical trigger, with the table applying 2024 reaction and spellcasting rules.</td>
    </tr>
    <tr>
      <td><strong>Same-turn spell slots</strong></td>
      <td>The old bonus-action spell rule is the usual slot-timing trap people remember.</td>
      <td>The 2024 one-spell-slot-per-turn rule applies to the whole turn: if Silvery Barbs uses a spell slot on that turn, the same caster cannot spend another spell slot on a different spell that turn, and vice versa.</td>
    </tr>
  </tbody>
</table>

<p>That last row is the bit to slow down on. If your Wizard casts a slotted spell on their own turn and then wants to use Silvery Barbs as a reaction later during that same turn, the 2024 one-spell-slot-per-turn rule can stop it. If Silvery Barbs is the first slotted spell they cast on that same turn, it also blocks another slotted spell later in that turn. If the enemy succeeds on a later creature's turn, that is a different turn.</p>

<h2 id="how-it-works">How the spell works without bogging down combat</h2>
<p>At the table, run Silvery Barbs in four clean steps.</p>

<ol>
  <li>A creature you can see within 60 feet succeeds on an attack roll, ability check, or saving throw.</li>
  <li>You decide whether to spend your reaction and a 1st-level spell slot.</li>
  <li>The triggering creature rerolls the d20 and uses the lower result.</li>
  <li>You choose a different creature you can see, and that creature has advantage waiting for its next attack roll, ability check, or saving throw within the duration.</li>
</ol>

<p>It is a reroll effect, not the Disadvantage condition. That wording matters for edge cases. Do not call it disadvantage in your notes unless your table already knows you mean "disadvantage-like pressure, not the actual mechanic."</p>

<p>It also does not automatically turn success into failure. A monster can still roll well. A boss can still pass. The spell buys a second chance and a later advantage rider, not a guaranteed reversal.</p>

<h2 id="when-to-use">When Silvery Barbs is worth the reaction</h2>
<p>Use it when the failed success would change the scene. A critical hit into a low-level character, a monster passing a save against a fight-ending control spell, or a rogue losing the one check that keeps an infiltration quiet can justify the cost.</p>

<table>
  <thead>
    <tr>
      <th>Trigger</th>
      <th>Usually worth it?</th>
      <th>Why</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Enemy critical hit</td>
      <td>Often</td>
      <td>A reroll can erase a spike before damage lands.</td>
    </tr>
    <tr>
      <td>Boss succeeds on a key saving throw</td>
      <td>Often</td>
      <td>The party already invested an action or spell slot into that moment.</td>
    </tr>
    <tr>
      <td>Enemy succeeds on a low-impact attack</td>
      <td>Rarely</td>
      <td>Your reaction may be more valuable for Shield, Counterspell, or an opportunity attack.</td>
    </tr>
    <tr>
      <td>Ally needs advantage soon</td>
      <td>Sometimes</td>
      <td>The second half of the spell matters only if someone will actually spend it.</td>
    </tr>
  </tbody>
</table>

<p>If your caster also relies on <a href="${EN_DND_COUNTERSPELL_PATH}">Counterspell</a>, Shield, or reaction class features, Silvery Barbs has a real opportunity cost. The strongest play is not casting it every time. The strongest play is knowing which success is worth interrupting.</p>

<h2 id="common-rulings">Common rulings: advantage, Legendary Resistance, and Twinned Spell</h2>
<h3>Advantage and disadvantage</h3>
<p>Silvery Barbs can trigger after the final result is a success. If a creature rolled with advantage, the table first determines whether the result succeeds. Then the caster decides whether the trigger is worth the reaction.</p>

<p>The spell does not say the target has disadvantage. It forces a reroll and uses the lower result. That is why I like writing "Barbs reroll" on the VTT marker instead of "disadvantage."</p>

<h3>Legendary Resistance</h3>
<p>Silvery Barbs cannot negate Legendary Resistance. If a legendary creature chooses to succeed after failing, that success is coming from the Legendary Resistance feature, not from the original d20 success the spell is looking for.</p>

<h3>Twinned Spell</h3>
<p>The official D&amp;D Beyond explainer also points out that Silvery Barbs is not a Twinned Spell candidate because it can affect more than one creature: the triggering creature and the creature that receives advantage.</p>

<h3>Concentration</h3>
<p>Silvery Barbs does not require concentration. That is part of why it feels so efficient: the caster can keep a concentration spell running and still use this reaction if the spell is allowed.</p>

<h2 id="vtt-workflow">VTT workflow: token, reaction reminder, dice roll</h2>
<p>Online play is where Silvery Barbs gets messy. The reroll is loud, but the advantage rider is easy to forget three turns later. Make the state visible.</p>

<ul>
  <li><strong>Reaction spent marker:</strong> put a silver ring or small "R" marker on the caster after the spell is used.</li>
  <li><strong>Barbs reroll marker:</strong> mark the enemy or NPC whose success was challenged, then clear it after the reroll resolves.</li>
  <li><strong>Advantage owed marker:</strong> put a bright silver-blue marker on the ally who gets the next advantaged d20 roll.</li>
  <li><strong>Source permission note:</strong> add a short character-sheet note that says Strixhaven content is allowed, if your DM approved it.</li>
</ul>

<p>You can build those small visual states in the <a href="${EN_EDITOR_PATH}">Token Maker editor</a>: keep the portrait readable, add a silver border or label, export the transparent PNG, and keep it beside the normal token. For the reroll itself, the <a href="${EN_DICE_ROLLER_PATH}">DnD dice roller</a> keeps the d20 sequence visible when a table wants a clean roll log.</p>

<h2 id="dm-policy">DM approval and Session 0 notes</h2>
<p>Silvery Barbs has a reputation because it changes the emotional beat of combat. A monster finally succeeds, then the table pauses and asks for another roll. Some groups love that tactical pressure. Some groups find it slows play or flattens boss turns.</p>

<p>My recommendation is boring and useful: decide before play. Allowed as written, banned, limited to Strixhaven campaigns, or allowed with a DM review after three sessions are all cleaner than arguing in the middle of the fight.</p>

<h2 id="related-guides">Related guides</h2>
<p>If you are building the caster around table control, compare Silvery Barbs with the <a href="${EN_DND_COUNTERSPELL_PATH}">DND Counterspell guide</a>, <a href="${EN_DND_BARD_SPELLS_PATH}">DND Bard spells guide</a>, and <a href="${EN_DND_RANGER_SPELLS_PATH}">DND Ranger spells guide</a>. The shared question is not "can I cast it?" It is "what job does this reaction or concentration slot do for the party?"</p>

<h2 id="video">Silvery Barbs companion video</h2>
<p>For another rules-policy angle, this companion video is useful after you already understand the source and timing: <a href="${DND_SILVERY_BARBS_VIDEO_URL}" rel="noreferrer noopener">Silvery Barbs: should it be banned in DnD 5e?</a></p>

${liteVideoEmbed(SILVERY_BARBS_VIDEO_ID, 'Silvery Barbs: should it be banned in DnD 5e?', {
  src: DND_SILVERY_BARBS_VIDEO_PLACEHOLDER_PATH,
  alt: 'Silvery Barbs DnD video placeholder with silver reaction magic over tabletop tokens',
})}

<h2 id="faq">Silvery Barbs DnD FAQ</h2>
<h3>Is Silvery Barbs official DnD content?</h3>
<p>Yes. Silvery Barbs is official DnD content from Strixhaven: A Curriculum of Chaos, but it is setting-expanded content, so the DM decides whether it is available.</p>

<h3>Is Silvery Barbs in the 2024 Free Rules?</h3>
<p>No. Silvery Barbs is not printed in the 2024 Free Rules spell list. Use it only if your DM allows Strixhaven or expanded source content.</p>

<h3>Is Silvery Barbs in the 2014 Player's Handbook?</h3>
<p>No. Silvery Barbs was introduced in Strixhaven: A Curriculum of Chaos, not the 2014 Player's Handbook.</p>

<h3>Does Silvery Barbs require concentration?</h3>
<p>No. Silvery Barbs does not require concentration, so it can be used while the caster is maintaining another concentration spell.</p>

<h3>Can Silvery Barbs cancel a critical hit?</h3>
<p>It can force the creature to reroll the successful attack roll and use the lower result. If the lower result is no longer a critical hit or no longer hits, the outcome changes.</p>

<h3>Does Silvery Barbs work on Legendary Resistance?</h3>
<p>No. Silvery Barbs cannot negate Legendary Resistance because Legendary Resistance turns a failed save into a success after the roll has already failed.</p>

<h3>Is Silvery Barbs the same as disadvantage?</h3>
<p>No. It is a reroll effect, not the Disadvantage condition. That difference matters for rules that care about advantage or disadvantage.</p>

<h3>Should DMs ban Silvery Barbs?</h3>
<p>Not automatically. DMs should decide before play whether Strixhaven content fits the campaign and whether this reaction makes the table more fun or more frustrating.</p>

<h2 id="sources">Rules sources</h2>
<ul>
  <li><a href="${DND_SILVERY_BARBS_SOURCE_URL}" rel="noreferrer noopener">D&amp;D Beyond official Silvery Barbs explainer</a></li>
  <li><a href="${DND_SILVERY_BARBS_2014_BASIC_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond 2014 Basic Rules spell list</a></li>
  <li><a href="${DND_SILVERY_BARBS_2024_FREE_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond 2024 Free Rules spell descriptions</a></li>
  <li><a href="${DND_SILVERY_BARBS_2024_CASTING_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond 2024 spellcasting rules</a></li>
</ul>
`;

export const dndSilveryBarbsArticleHtmlZh = String.raw`
<p><strong>dnd silvery barbs</strong> 最会卡住桌子的，是三个问题：它到底能不能用，2014/2024 规则下有没有差异，以及在线 VTT 里怎么记住“反应已经用掉”和“谁还欠一次优势”。</p>

<p>先给结论：银光倒刺（Silvery Barbs）很强，因为它等到一个成功结果出现后才出手，花掉你的反应（Reaction），让目标重掷并取较低结果，同时把一次优势（Advantage）留给另一名生物。它不是免费资源，也不是每张角色卡默认能拿的核心法术。</p>

<h2 id="quick-answer-zh">快速结论：银光倒刺是什么？</h2>
<p><strong>银光倒刺（Silvery Barbs）是出自《斯翠海文：混沌课程》（Strixhaven: A Curriculum of Chaos）的 1 环惑控系法术。你在 60 尺内一个你能看见的生物成功进行攻击检定、属性检定或豁免后，用反应施放它。</strong></p>

<p>被影响的生物重掷 d20，并使用较低结果。随后，你选择另一个你能看见的生物；它在持续时间内下一次攻击检定、属性检定或豁免获得优势。这里是桌边摘要，不替代书本原文。</p>

<p><strong>银光倒刺（Silvery Barbs）出自《斯翠海文：混沌课程》（Strixhaven: A Curriculum of Chaos），不是 2014 版《玩家手册》（Player’s Handbook）的法术。</strong> <strong>它没有收录在 2024 免费规则（Free Rules）的法术列表里。</strong> 围绕它建角色前，先问 DM。</p>

<h2 id="source-and-access-zh">来源、职业与桌边许可</h2>
<p>D&amp;D Beyond 的官方说明把银光倒刺列为《斯翠海文：混沌课程》引入的法术，并说明在该内容启用时，诗人（Bard）、术士（Sorcerer）和法师（Wizard）可以使用它。</p>

<p>所以它的关键词不是“默认”，而是“许可”。只用 2014 核心书的角色不会自动拥有它。只用 2024 免费规则的角色也不会自动拥有它。如果你的战役允许斯翠海文或扩展设定内容，那就可以按 DM 的许可使用。</p>

<p>这个决定最好在 Session 0 说清楚。玩家按银光倒刺构筑角色，结果第一个 Boss 战后才被临时禁止，这种体验通常不会好。</p>

<h2 id="stats-table-zh">银光倒刺规则表</h2>
<table>
  <thead>
    <tr>
      <th>项目</th>
      <th>桌边说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>来源</strong></td>
      <td>《斯翠海文：混沌课程》，不是 2014 版《玩家手册》或 2024 免费规则。</td>
    </tr>
    <tr>
      <td><strong>环阶与学派</strong></td>
      <td>1 环惑控系。</td>
    </tr>
    <tr>
      <td><strong>施法时间</strong></td>
      <td>反应（Reaction）；触发点是你能看见且在距离内的生物成功进行攻击检定、属性检定或豁免之后。</td>
    </tr>
    <tr>
      <td><strong>距离</strong></td>
      <td>60 尺。</td>
    </tr>
    <tr>
      <td><strong>成分</strong></td>
      <td>只有言语（V）。</td>
    </tr>
    <tr>
      <td><strong>专注</strong></td>
      <td>银光倒刺不需要专注（Concentration）。</td>
    </tr>
    <tr>
      <td><strong>常见职业列表</strong></td>
      <td>在允许斯翠海文内容时，常见为诗人、术士和法师。</td>
    </tr>
  </tbody>
</table>

<h2 id="2014-vs-2024-zh">2014 与 2024：真正变化在哪里？</h2>
<p>2024 免费规则没有重写银光倒刺。比较 2014 和 2024 时，要分清“来源是否允许”和“桌边施法流程”这两件事。</p>

<table>
  <thead>
    <tr>
      <th>问题</th>
      <th>2014 桌面</th>
      <th>2024 桌面</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>是否在免费核心法术列表中？</strong></td>
      <td>不在。它是斯翠海文内容，不是 2014 基础规则或 2014 玩家手册法术。</td>
      <td>不在。它没有收录在 2024 免费规则（Free Rules）的法术列表里。</td>
    </tr>
    <tr>
      <td><strong>角色能否使用？</strong></td>
      <td>可以，但前提是 DM 允许斯翠海文或相关来源。</td>
      <td>可以，但前提是 DM 允许该扩展来源进入 2024 桌面。</td>
    </tr>
    <tr>
      <td><strong>反应时机</strong></td>
      <td>在触发的成功结果已知之后使用反应。</td>
      <td>实际触发方式相同，同时套用 2024 的反应和施法规则。</td>
    </tr>
    <tr>
      <td><strong>同回合法术位</strong></td>
      <td>玩家更常记得的是旧版附赠动作施法限制。</td>
      <td>2024 版规则看整个回合：如果银光倒刺在该回合消耗了法术位，同一施法者本回合不能再用另一个法术位施放其他法术；反过来也一样。</td>
    </tr>
  </tbody>
</table>

<p>这里不要误读。如果法师在自己的回合已经用法术位施法，并且同一回合内又想用反应施放银光倒刺，2024 的“一回合一个法术位”规则会挡住它。反过来，如果银光倒刺是这个回合先用掉的法术位，它也会挡住同一回合后续另一个法术位施法。如果敌人在后续另一个生物的回合成功，那已经是另一个回合。</p>

<h2 id="how-it-works-zh">不拖慢战斗的执行顺序</h2>
<p>桌边可以按四步处理。</p>

<ol>
  <li>一个你能看见、距离 60 尺内的生物成功进行攻击检定、属性检定或豁免。</li>
  <li>你决定是否花掉反应和 1 环法术位。</li>
  <li>触发生物重掷 d20，并使用较低结果。</li>
  <li>你选择另一个你能看见的生物，让它在时限内下一次攻击检定、属性检定或豁免获得优势。</li>
</ol>

<p>它是重掷效果，不是劣势（Disadvantage）状态。为了减少误会，我建议 VTT 标记写“Barbs 重掷”，不要写“劣势”。</p>

<p>它也不会自动让成功变失败。怪物仍然可能重掷出好结果，Boss 仍然可能通过。它买的是一次二次检查和一个后续优势，不是必定逆转。</p>

<h2 id="when-to-use-zh">什么时候值得用银光倒刺？</h2>
<p>当那个成功结果会改变场面时，才值得花反应。低等级角色吃到重击、怪物通过关键控制法术的豁免、潜入场景里某个关键检定被 NPC 抓住，这些都值得考虑。</p>

<table>
  <thead>
    <tr>
      <th>触发</th>
      <th>通常值不值</th>
      <th>原因</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>敌人打出重击</td>
      <td>常常值得</td>
      <td>重掷可能在伤害落下前抹掉一次爆发。</td>
    </tr>
    <tr>
      <td>Boss 通过关键豁免</td>
      <td>常常值得</td>
      <td>队友已经把动作或法术位投进那个瞬间。</td>
    </tr>
    <tr>
      <td>敌人命中一次低影响攻击</td>
      <td>通常不值</td>
      <td>你的反应可能要留给护盾术（Shield）、反制法术（Counterspell）或借机攻击。</td>
    </tr>
    <tr>
      <td>队友马上能吃到优势</td>
      <td>看情况</td>
      <td>法术后半段只有在真的有人使用那次优势时才有价值。</td>
    </tr>
  </tbody>
</table>

<p>如果你的施法者还要靠 <a href="${ZH_DND_COUNTERSPELL_PATH}">反制法术（Counterspell）</a>、护盾术（Shield）或职业反应能力保命，银光倒刺就有真实机会成本。强不是每次都放，强是知道哪个成功值得打断。</p>

<h2 id="common-rulings-zh">常见裁定：优势、传奇抗力和孪生法术（Twinned Spell）</h2>
<h3>优势与劣势</h3>
<p>银光倒刺可以在最终结果为成功之后触发。如果目标带优势掷骰，先判断最终结果是否成功，再由施法者决定是否使用反应。</p>

<p>这个法术没有让目标处于劣势（Disadvantage）。它要求重掷并使用较低结果。因此在标记上写“Barbs 重掷”比写“劣势”更准确。</p>

<h3>传奇抗力</h3>
<p>银光倒刺不能取消传奇抗力（Legendary Resistance）。如果传奇生物失败后选择成功，这个成功来自传奇抗力特性，不是原本那次 d20 成功。</p>

<h3>孪生法术（Twinned Spell）</h3>
<p>D&amp;D Beyond 的官方说明也提到，银光倒刺不适合孪生法术（Twinned Spell），因为它可能影响一个以上的生物：触发重掷的生物，以及获得优势的生物。</p>

<h3>专注</h3>
<p>银光倒刺不需要专注（Concentration）。这正是它效率很高的原因之一：施法者可以维持另一个专注法术，同时在允许时使用这个反应。</p>

<h2 id="vtt-workflow-zh">VTT 流程：Token、反应提醒与掷骰</h2>
<p>在线跑团里，银光倒刺最容易乱在两个地方：反应花掉后忘记清，以及优势留给谁。把状态放到地图上。</p>

<ul>
  <li><strong>反应用尽标记：</strong>施法后，在施法者 Token 上放一个银色圆环或小 R 标记。</li>
  <li><strong>Barbs 重掷标记：</strong>标记被挑战成功结果的敌人或 NPC，重掷解决后清掉。</li>
  <li><strong>待用优势标记：</strong>在获得下一次优势的盟友 Token 上放一个明显的银蓝色标记。</li>
  <li><strong>来源许可备注：</strong>如果 DM 已允许斯翠海文内容，在角色卡备注里写一句，避免临场争议。</li>
</ul>

<p>这些小状态可以直接在 <a href="${ZH_EDITOR_PATH}">Token Maker 编辑器</a>里做：保留头像可读性，加银色边框或标签，导出透明 PNG，然后和普通 Token 放在同一个素材夹。重掷本身可以用 <a href="${ZH_DICE_ROLLER_PATH}">DND 骰子工具</a>保留清楚的 d20 顺序。</p>

<h2 id="dm-policy-zh">DM 许可与 Session 0 说明</h2>
<p>银光倒刺有争议，是因为它会改变战斗节奏。怪物终于成功了，桌子暂停，请它再掷一次。有些小组喜欢这种战术压力，有些小组觉得它拖慢节奏、削弱 Boss 回合。</p>

<p>我的建议很朴素：开跑前定好。原样允许、禁止、只在斯翠海文战役中允许，或先试三场再评估，都比战斗中临时吵要好。</p>

<h2 id="related-guides-zh">相关指南</h2>
<p>如果你在围绕控场施法者选法术，可以继续看 <a href="${ZH_DND_COUNTERSPELL_PATH}">DND Counterspell 指南</a>、<a href="${ZH_DND_BARD_SPELLS_PATH}">DND Bard Spells 指南</a> 和 <a href="${ZH_DND_RANGER_SPELLS_PATH}">DND 游侠法术指南</a>。共同问题不是“我能不能施法”，而是“这个反应或专注位给队伍解决了什么事”。</p>

<h2 id="video-zh">银光倒刺（Silvery Barbs）配套视频</h2>
<p>如果你已经看懂来源和时机，这个配套视频适合用来补充“是否应该禁用”的桌边政策角度：<a href="${DND_SILVERY_BARBS_VIDEO_URL}" rel="noreferrer noopener">Silvery Barbs: should it be banned in DnD 5e?</a></p>

${liteVideoEmbed(SILVERY_BARBS_VIDEO_ID, 'Silvery Barbs: should it be banned in DnD 5e?', {
  src: DND_SILVERY_BARBS_VIDEO_PLACEHOLDER_PATH,
  alt: '银光倒刺（Silvery Barbs）视频占位图，桌面 Token 上有银色反应法术效果',
})}

<h2 id="faq-zh">DND 银光倒刺（Silvery Barbs）常见问题</h2>
<h3>银光倒刺是官方 DND 内容吗？</h3>
<p>是。银光倒刺是《斯翠海文：混沌课程》中的官方 DND 内容，但它属于扩展设定内容，是否可用由 DM 决定。</p>

<h3>银光倒刺在 2024 免费规则里吗？</h3>
<p>没有。银光倒刺没有收录在 2024 免费规则的法术列表里；只有在 DM 允许斯翠海文或扩展来源时才使用。</p>

<h3>银光倒刺在 2014 版玩家手册里吗？</h3>
<p>没有。银光倒刺出自《斯翠海文：混沌课程》，不是 2014 版《玩家手册》的法术。</p>

<h3>银光倒刺需要专注吗？</h3>
<p>不需要。银光倒刺不需要专注，所以施法者可以在维持另一个专注法术时使用它。</p>

<h3>银光倒刺能取消重击吗？</h3>
<p>它可以迫使触发生物重掷那次成功的攻击检定，并使用较低结果。如果较低结果不再是重击，甚至不再命中，结果就会改变。</p>

<h3>银光倒刺能影响传奇抗力吗？</h3>
<p>不能。银光倒刺不能取消传奇抗力，因为传奇抗力是在豁免已经失败后把失败变成成功。</p>

<h3>银光倒刺等同于劣势吗？</h3>
<p>不等同。它是重掷效果，不是劣势（Disadvantage）状态；涉及优势或劣势的规则互动时，这个差别很重要。</p>

<h3>DM 应该禁用银光倒刺吗？</h3>
<p>不需要自动禁用。DM 应该在开跑前决定斯翠海文内容是否适合战役，以及这个反应会让桌子更好玩还是更烦。</p>

<h2 id="sources-zh">规则来源</h2>
<ul>
  <li><a href="${DND_SILVERY_BARBS_SOURCE_URL}" rel="noreferrer noopener">D&amp;D Beyond 银光倒刺官方说明</a></li>
  <li><a href="${DND_SILVERY_BARBS_2014_BASIC_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond 2014 基础规则法术列表</a></li>
  <li><a href="${DND_SILVERY_BARBS_2024_FREE_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond 2024 免费规则法术描述</a></li>
  <li><a href="${DND_SILVERY_BARBS_2024_CASTING_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond 2024 施法规则</a></li>
</ul>
`;
