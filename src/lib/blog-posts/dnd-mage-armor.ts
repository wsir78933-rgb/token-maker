import {
  DND_MAGE_ARMOR_AC_IMAGE_PATH,
  DND_MAGE_ARMOR_2014_RULES_URL,
  DND_MAGE_ARMOR_2024_RULES_URL,
  DND_MAGE_ARMOR_SAGE_ADVICE_URL,
  DND_MAGE_ARMOR_VIDEO_PLACEHOLDER_PATH,
  DND_MAGE_ARMOR_VIDEO_URL,
  EN_DND_ARMOR_PATH,
  EN_DND_CLASSES_PATH,
  EN_DND_CONSTITUTION_PATH,
  EN_EDITOR_PATH,
  EN_DICE_ROLLER_PATH,
  ZH_DND_ARMOR_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_DND_CONSTITUTION_PATH,
  ZH_EDITOR_PATH,
  ZH_DICE_ROLLER_PATH,
  liteVideoEmbed,
} from './shared';

export const dndMageArmorArticleHtml = String.raw`
<p><strong>dnd mage armor</strong> is a 1st-level Abjuration spell that sets an unarmored willing creature&rsquo;s base AC to <strong>13 + Dexterity modifier</strong> for 8 hours. This guide gives you the fast AC math, the 2014 vs 2024 wording, the stacking rulings that cause arguments, and the one use many players miss: it is <strong>touch range, not self-only</strong>.</p>

<p>I am treating this as a spell encyclopedia page with table advice. If you only need the answer, use the first table. If you are choosing spells for a Wizard, Sorcerer, or Armor of Shadows Warlock, keep reading before you spend a known spell on a defense that your build may already replace.</p>

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
      <td>1st-level Abjuration.</td>
    </tr>
    <tr>
      <td><strong>Core classes</strong></td>
      <td>Sorcerer and Wizard. Warlocks can get at-will Mage Armor through Armor of Shadows.</td>
    </tr>
    <tr>
      <td><strong>Casting time / range</strong></td>
      <td>Action / Touch.</td>
    </tr>
    <tr>
      <td><strong>Duration</strong></td>
      <td>8 hours, no concentration.</td>
    </tr>
    <tr>
      <td><strong>AC formula</strong></td>
      <td>The target&rsquo;s base AC becomes <strong>13 + Dex modifier</strong>.</td>
    </tr>
    <tr>
      <td><strong>Main restriction</strong></td>
      <td>The target must be willing and not wearing armor. The spell ends early if the target dons armor.</td>
    </tr>
    <tr>
      <td><strong>Best use</strong></td>
      <td>Pre-cast before danger on an unarmored caster, familiar, escort NPC, or fragile ally who cannot wear armor.</td>
    </tr>
  </tbody>
</table>

<h2 id="quick-rules">DND Mage Armor Quick Rules</h2>
<p><strong>dnd mage armor</strong> gives a willing unarmored creature a new base AC formula: 13 + its Dexterity modifier. The <a href="${DND_MAGE_ARMOR_2014_RULES_URL}" rel="noreferrer noopener">2014 Basic Rules text</a> and the <a href="${DND_MAGE_ARMOR_2024_RULES_URL}" rel="noreferrer noopener">2024 Free Rules text</a> are almost the same, so most table arguments are not about the spell&rsquo;s core effect. They are about stacking.</p>

<ul>
  <li><strong>It is not concentration.</strong> You can keep concentrating on another spell while Mage Armor is active.</li>
  <li><strong>It lasts most of an adventuring day.</strong> Eight hours is long enough to cast before entering a dungeon.</li>
  <li><strong>It is not a flat +3 bonus.</strong> It replaces your base AC formula with 13 + Dex.</li>
  <li><strong>It is not physical armor.</strong> The name is flavor; the rule text creates a magical protective force.</li>
  <li><strong>It is touch range.</strong> You can cast it on another willing creature if the target is unarmored.</li>
</ul>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_MAGE_ARMOR_AC_IMAGE_PATH}"
    alt="dnd mage armor AC calculation scene showing a robed spellcaster miniature protected by blue spectral armor on a tabletop battle map"
    width="1400"
    height="933"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Mage Armor is easiest to evaluate when you treat it as an AC formula first and a glowing visual effect second.</figcaption>
</figure>

<h2 id="ac-math">How Does DND Mage Armor Calculate AC?</h2>
<p><strong>DND Mage Armor calculates AC as 13 + the target&rsquo;s Dexterity modifier.</strong> It changes the base number, then normal compatible bonuses can still modify that final AC.</p>

<table>
  <thead>
    <tr>
      <th>Dex score</th>
      <th>Dex modifier</th>
      <th>AC with Mage Armor</th>
      <th>AC with Mage Armor + shield</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>10-11</td>
      <td>+0</td>
      <td>13</td>
      <td>15</td>
    </tr>
    <tr>
      <td>12-13</td>
      <td>+1</td>
      <td>14</td>
      <td>16</td>
    </tr>
    <tr>
      <td>14-15</td>
      <td>+2</td>
      <td>15</td>
      <td>17</td>
    </tr>
    <tr>
      <td>16-17</td>
      <td>+3</td>
      <td>16</td>
      <td>18</td>
    </tr>
    <tr>
      <td>18-19</td>
      <td>+4</td>
      <td>17</td>
      <td>19</td>
    </tr>
    <tr>
      <td>20</td>
      <td>+5</td>
      <td>18</td>
      <td>20</td>
    </tr>
  </tbody>
</table>

<p>In my games, the spell feels best at low levels on 14-16 Dex casters. A level 1 Wizard going from AC 12 or 13 to AC 15 or 16 gets real value. A character with low Dexterity, armor proficiency, or a better natural AC formula gets much less.</p>

<h2 id="stacking">Does Mage Armor Stack with Armor, Shields, and Unarmored Defense?</h2>
<p><strong>Mage Armor does not stack with worn armor or other base AC formulas, but official Sage Advice says Mage Armor works with a shield in 2014 fifth edition.</strong> That single sentence solves most table confusion.</p>

<p>The useful rule is this: <strong>choose one base AC calculation, then add compatible bonuses</strong>. Mage Armor gives one calculation. Unarmored Defense gives another. Natural armor often gives another. You do not add all of those together.</p>

<table>
  <thead>
    <tr>
      <th>Interaction</th>
      <th>Ruling to use at the table</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Mage Armor + leather/studded leather</strong></td>
      <td>No. The target must not be wearing armor, and the spell ends if the target dons armor.</td>
    </tr>
    <tr>
      <td><strong>Mage Armor + shield</strong></td>
      <td>Yes under the <a href="${DND_MAGE_ARMOR_SAGE_ADVICE_URL}" rel="noreferrer noopener">Sage Advice Compendium</a> 2014 ruling, because a shield is wielded rather than worn armor.</td>
    </tr>
    <tr>
      <td><strong>Mage Armor + Shield spell</strong></td>
      <td>Yes. The Shield spell is a temporary bonus, not a competing base AC formula.</td>
    </tr>
    <tr>
      <td><strong>Mage Armor + Monk Unarmored Defense</strong></td>
      <td>No stacking. Pick Mage Armor or the Monk formula.</td>
    </tr>
    <tr>
      <td><strong>Mage Armor + Barbarian Unarmored Defense</strong></td>
      <td>No stacking. Pick Mage Armor or the Barbarian formula.</td>
    </tr>
    <tr>
      <td><strong>Mage Armor + cover</strong></td>
      <td>Yes. Cover modifies AC after the base AC is established.</td>
    </tr>
  </tbody>
</table>

<p>If your table uses 2024 rules and is strict about the newer shield training language, ask your DM before building around shield + Mage Armor. The Mage Armor wording itself remains close, but shield terminology has caused enough table debate that I would not surprise a DM with it mid-combat.</p>

<h2 id="who-should-use-it">Who Should Use DND Mage Armor?</h2>
<p><strong>DND Mage Armor is best for unarmored high-Dex casters who expect to be attacked and cannot cheaply get light armor.</strong> It is not an automatic pick for every spellcaster.</p>

<ul>
  <li><strong>Wizard:</strong> usually the cleanest user, especially at early levels before defensive magic items appear.</li>
  <li><strong>Sorcerer:</strong> strong unless your subclass already gives a comparable AC formula.</li>
  <li><strong>Warlock with Armor of Shadows:</strong> excellent if you want at-will defense without spending slots.</li>
  <li><strong>Low-Dex caster:</strong> weaker. AC 13 or 14 is better than nothing, but it will not save careless positioning.</li>
  <li><strong>Armored caster:</strong> usually skip it. Studded leather, medium armor, or a class feature may already solve the same problem.</li>
</ul>

<p>For class planning, use the <a href="${EN_DND_CLASSES_PATH}">DND classes guide</a> to check whether your character really needs a spell-known tax for defense. If you are worried about concentration and survival, the <a href="${EN_DND_CONSTITUTION_PATH}">D&amp;D Constitution guide</a> is the better companion read.</p>

<h2 id="overlooked-use">What Is the Overlooked Trick with Mage Armor?</h2>
<p><strong>The overlooked trick is that Mage Armor can target another willing unarmored creature, not only the caster.</strong> That is the part many players miss for years because the spell feels like a personal wizard tax.</p>

<p>The companion video points at the same practical habit: stop reading Mage Armor as "I cast it on myself after initiative." It is a touch spell with an 8-hour duration, which means you can use it before a dangerous scene starts.</p>

<ul>
  <li><strong>Protect a familiar or scout</strong> before it risks a trap corridor or enemy lookout.</li>
  <li><strong>Protect an unarmored NPC escort</strong> when one bad arrow would derail the mission.</li>
  <li><strong>Protect a fragile ally</strong> if they have no armor and a good Dexterity modifier.</li>
  <li><strong>Cast before the dungeon</strong> instead of spending your first combat action on defense.</li>
  <li><strong>Use it during watches</strong> if the next ambush is likely and a slot is worth the insurance.</li>
</ul>

<p>The trap is overusing it. I do not spend a 1st-level slot on every commoner who might get scratched. I use it when the target is likely to take attacks and the table would actually care if that target drops.</p>

<h2 id="mage-armor-vs-shield">Is Mage Armor Better Than Shield or Regular Armor?</h2>
<p><strong>Mage Armor is better as pre-combat insurance; Shield is better as an emergency reaction; regular armor is better if your build can wear it without giving up something important.</strong> They solve different problems.</p>

<table>
  <thead>
    <tr>
      <th>Option</th>
      <th>Best at</th>
      <th>Main cost</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Mage Armor</strong></td>
      <td>Long-duration AC for unarmored Dex casters.</td>
      <td>One prepared/known spell and usually one 1st-level slot.</td>
    </tr>
    <tr>
      <td><strong>Shield spell</strong></td>
      <td>Stopping a hit that matters right now.</td>
      <td>Reaction and one 1st-level slot per use.</td>
    </tr>
    <tr>
      <td><strong>Light armor</strong></td>
      <td>Characters with proficiency who want passive defense.</td>
      <td>Armor proficiency and gear, but no spell slot.</td>
    </tr>
    <tr>
      <td><strong>Medium armor</strong></td>
      <td>Moderate Dex builds with armor access.</td>
      <td>Proficiency, cost, possible stealth penalty.</td>
    </tr>
  </tbody>
</table>

<p>For a broader armor comparison, open the <a href="${EN_DND_ARMOR_PATH}">DND armor guide</a>. My short version: a Wizard with 16 Dex loves Mage Armor at level 1. A Hexblade-style Warlock or armored multiclass may prefer real armor and save the spell slot.</p>

<h2 id="vtt-token">How to Show Mage Armor on a VTT Token</h2>
<p><strong>A Mage Armor VTT token should show a visible magical barrier without hiding the character silhouette.</strong> The whole point is readability at map scale.</p>

<p>When I make a token for a Mage Armor caster, I avoid full-body glow that turns into a blue blur. A thin spectral breastplate, shoulder runes, or a translucent ring behind the portrait reads better in Roll20, Foundry VTT, and Owlbear Rodeo.</p>

<ul>
  <li><strong>Use a tight crop:</strong> face, hands, and the magical armor effect should be visible at 512 px.</li>
  <li><strong>Keep the glow outside the face:</strong> players need to read the character, not just the spell effect.</li>
  <li><strong>Use blue or violet sparingly:</strong> one clear ward color is better than noisy magic everywhere.</li>
  <li><strong>Pick a clean border:</strong> a thin arcane frame works better than a heavy metal border for an unarmored caster.</li>
  <li><strong>Export a transparent PNG:</strong> it layers more cleanly over dark dungeon maps.</li>
</ul>

<p>You can build that look in the <a href="${EN_EDITOR_PATH}">VTT token maker</a>. If you are testing whether Mage Armor changes an encounter enough to matter, keep the <a href="${EN_DICE_ROLLER_PATH}">D&amp;D dice roller</a> open and compare how often attack rolls hit AC 12, 15, and 16.</p>

<section id="faq" class="mt-12 rounded-[34px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
  <h2 class="font-display text-2xl sm:text-3xl text-stone-50" style="margin-top: 0;">FAQ About DND Mage Armor</h2>

  <div class="mt-6 space-y-4">
    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Is Mage Armor concentration?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">No. <strong>Mage Armor is not concentration</strong>, so you can maintain another concentration spell while Mage Armor stays active for its 8-hour duration.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Can you cast Mage Armor on someone else?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">Yes. Mage Armor has a range of Touch and targets a willing creature who is not wearing armor, so it can be cast on another eligible creature.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Does Mage Armor stack with Unarmored Defense?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">No. Mage Armor and Unarmored Defense are different base AC calculations. You choose which calculation to use; you do not combine them.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Does Mage Armor work with a shield?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">Under the 2014 Sage Advice ruling, yes. Mage Armor works with a shield because the shield is wielded rather than worn armor. For strict 2024 tables, confirm the shield ruling with your DM before relying on it.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Is Mage Armor worth it at higher levels?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">It depends on your build. Mage Armor remains useful for unarmored high-Dex casters, but it becomes easier to replace with armor proficiency, magic items, subclass features, or better positioning.</p>
    </article>
  </div>
</section>

<h2 id="video">Watch: The Mage Armor Trick People Miss</h2>
<p><a href="${DND_MAGE_ARMOR_VIDEO_URL}" rel="noreferrer noopener">It took me 10 years to realize i could do this</a> points at a table habit worth fixing: <strong>Mage Armor is not just a self-buff you remember after combat starts</strong>. Treat it as an 8-hour touch spell, decide who actually needs it, and cast it before the arrows start flying.</p>

${liteVideoEmbed('ZBbhI8Mp8fE', 'It took me 10 years to realize i could do this', {
  src: DND_MAGE_ARMOR_VIDEO_PLACEHOLDER_PATH,
  alt: 'Clickable webp video cover for a dnd mage armor guide showing arrows striking a blue arcane shield around a robed spellcaster',
})}
`;

export const dndMageArmorArticleHtmlZh = String.raw`
<p><strong>dnd mage armor</strong> 是一个 1 环 Abjuration 法术，可以让一个未穿护甲、且自愿的生物在 8 小时内使用 <strong>13 + Dexterity 调整值</strong> 作为基础 AC。本文先给速查表，再讲 AC 计算、2014/2024 规则差异、最容易吵起来的叠加问题，以及很多玩家会忽略的一点：它是 <strong>Touch 法术，不是只能给自己放</strong>。</p>

<p>我会把这篇写成法术百科 + 实战指南。你只想查答案，看第一张表就够；如果你正在给 Wizard、Sorcerer 或 Armor of Shadows Warlock 选法术，就继续往下看，别把一个已被职业或护甲解决的问题又用法术位买一遍。</p>

<table>
  <thead>
    <tr>
      <th>你最想知道的点</th>
      <th>快速答案</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>法术环级</strong></td>
      <td>1 环 Abjuration。</td>
    </tr>
    <tr>
      <td><strong>常规职业</strong></td>
      <td>Sorcerer 和 Wizard。Warlock 可以通过 Armor of Shadows 获得近似常驻的 Mage Armor。</td>
    </tr>
    <tr>
      <td><strong>施法时间 / 距离</strong></td>
      <td>Action / Touch。</td>
    </tr>
    <tr>
      <td><strong>持续时间</strong></td>
      <td>8 小时，不需要 Concentration。</td>
    </tr>
    <tr>
      <td><strong>AC 公式</strong></td>
      <td>目标的基础 AC 变为 <strong>13 + Dex 调整值</strong>。</td>
    </tr>
    <tr>
      <td><strong>主要限制</strong></td>
      <td>目标必须自愿，且没有穿护甲。目标穿上护甲时，法术会提前结束。</td>
    </tr>
    <tr>
      <td><strong>最佳用法</strong></td>
      <td>进危险区域前，提前给无甲施法者、魔宠、护送 NPC 或脆皮队友上好。</td>
    </tr>
  </tbody>
</table>

<h2 id="quick-rules">DND Mage Armor 规则速查</h2>
<p><strong>dnd mage armor</strong> 会给一个自愿且未穿护甲的生物一套新的基础 AC 公式：13 + Dexterity 调整值。<a href="${DND_MAGE_ARMOR_2014_RULES_URL}" rel="noreferrer noopener">2014 Basic Rules</a> 和 <a href="${DND_MAGE_ARMOR_2024_RULES_URL}" rel="noreferrer noopener">2024 Free Rules</a> 的核心写法非常接近，所以桌上真正容易吵的通常不是法术本体，而是“能不能叠”。</p>

<ul>
  <li><strong>它不需要 Concentration。</strong> Mage Armor 存在时，你仍然可以维持另一个专注法术。</li>
  <li><strong>它能覆盖大半个冒险日。</strong>8 小时足够你进地城前先放好。</li>
  <li><strong>它不是简单 +3 AC。</strong>它是把基础 AC 公式换成 13 + Dex。</li>
  <li><strong>它不等于真正穿了护甲。</strong>名字是风味，规则上是魔法防护力场。</li>
  <li><strong>它是 Touch。</strong>只要目标自愿且没穿护甲，你就能给别人施放。</li>
</ul>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_MAGE_ARMOR_AC_IMAGE_PATH}"
    alt="dnd mage armor AC 计算场景，一名长袍施法者模型在桌面战斗地图上被蓝色幽灵护甲保护"
    width="1400"
    height="933"
    loading="lazy"
    decoding="async"
  />
  <figcaption>评估 Mage Armor 时，先把它当成 AC 公式，再把蓝色护盾当成视觉表现。</figcaption>
</figure>

<h2 id="ac-math">DND Mage Armor 的 AC 怎么算？</h2>
<p><strong>DND Mage Armor 的 AC 是 13 + 目标 Dexterity 调整值。</strong>它改变的是基础 AC 数字，之后再看有没有兼容的额外加值。</p>

<table>
  <thead>
    <tr>
      <th>Dex 数值</th>
      <th>Dex 调整值</th>
      <th>Mage Armor 后 AC</th>
      <th>Mage Armor + shield 后 AC</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>10-11</td>
      <td>+0</td>
      <td>13</td>
      <td>15</td>
    </tr>
    <tr>
      <td>12-13</td>
      <td>+1</td>
      <td>14</td>
      <td>16</td>
    </tr>
    <tr>
      <td>14-15</td>
      <td>+2</td>
      <td>15</td>
      <td>17</td>
    </tr>
    <tr>
      <td>16-17</td>
      <td>+3</td>
      <td>16</td>
      <td>18</td>
    </tr>
    <tr>
      <td>18-19</td>
      <td>+4</td>
      <td>17</td>
      <td>19</td>
    </tr>
    <tr>
      <td>20</td>
      <td>+5</td>
      <td>18</td>
      <td>20</td>
    </tr>
  </tbody>
</table>

<p>按我的跑团经验，它在低等级、Dex 14-16 的无甲施法者身上最值。1 级 Wizard 从 AC 12 或 13 抬到 AC 15 或 16，体感非常明显。低 Dex、有护甲熟练、或者本来就有更好 AC 公式的角色，收益就会下降。</p>

<h2 id="stacking">Mage Armor 能和护甲、盾牌、Unarmored Defense 叠加吗？</h2>
<p><strong>Mage Armor 不能和穿戴护甲或其他基础 AC 公式叠加，但 2014 版官方 Sage Advice 明确说过 Mage Armor 可以和 shield 一起用。</strong>这句话基本能解决大部分争议。</p>

<p>真正好用的判断方式是：<strong>先选一个基础 AC 计算方式，再叠加兼容的额外加值</strong>。Mage Armor 是一种计算方式。Unarmored Defense 是另一种。很多 Natural Armor 也是另一种。你不能把这些公式全加在一起。</p>

<table>
  <thead>
    <tr>
      <th>互动情况</th>
      <th>桌上怎么裁</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Mage Armor + leather / studded leather</strong></td>
      <td>不行。目标必须没穿护甲，而且穿上护甲会让法术提前结束。</td>
    </tr>
    <tr>
      <td><strong>Mage Armor + shield</strong></td>
      <td>按 <a href="${DND_MAGE_ARMOR_SAGE_ADVICE_URL}" rel="noreferrer noopener">Sage Advice Compendium</a> 的 2014 裁定，可以。理由是 shield 是被 wield，不是 worn armor。</td>
    </tr>
    <tr>
      <td><strong>Mage Armor + Shield 法术</strong></td>
      <td>可以。Shield 法术是临时加值，不是另一套基础 AC 公式。</td>
    </tr>
    <tr>
      <td><strong>Mage Armor + Monk Unarmored Defense</strong></td>
      <td>不能叠。你选 Mage Armor 公式或 Monk 公式之一。</td>
    </tr>
    <tr>
      <td><strong>Mage Armor + Barbarian Unarmored Defense</strong></td>
      <td>不能叠。你选 Mage Armor 公式或 Barbarian 公式之一。</td>
    </tr>
    <tr>
      <td><strong>Mage Armor + 掩护</strong></td>
      <td>可以。掩护是在基础 AC 确定后提供额外修正。</td>
    </tr>
  </tbody>
</table>

<p>如果你们桌用 2024 规则，而且对 shield training 的新写法比较严格，最好开打前先问 DM。Mage Armor 本身文字变化不大，但 shield 的分类和训练问题足够容易引发争论，不适合在敌人攻击掷骰后才临时讨论。</p>

<h2 id="who-should-use-it">谁最适合使用 DND Mage Armor？</h2>
<p><strong>DND Mage Armor 最适合那些 Dex 不低、没有护甲、又确实可能被攻击的施法者。</strong>它不是每个施法职业都必须拿的法术。</p>

<ul>
  <li><strong>Wizard：</strong>通常是最干净的使用者，尤其是低等级、还没有防御魔法物品时。</li>
  <li><strong>Sorcerer：</strong>也很强，但如果子职业已经给了类似 AC 公式，就要重新算收益。</li>
  <li><strong>Armor of Shadows Warlock：</strong>如果你想要不烧法术位的常驻防御，这个 Invocation 很舒服。</li>
  <li><strong>低 Dex 施法者：</strong>收益偏低。AC 13 或 14 比没有强，但不能弥补站位差。</li>
  <li><strong>有护甲的施法者：</strong>大多可以跳过。轻甲、中甲或职业特性已经在解决同一件事。</li>
</ul>

<p>如果你还在比较职业底盘，可以先看 <a href="${ZH_DND_CLASSES_PATH}">DND 职业详解</a>，判断你的角色是不是真的需要花一个法术已知/准备位买防御。如果你更担心专注和生存，那篇 <a href="${ZH_DND_CONSTITUTION_PATH}">D&amp;D Constitution 指南</a> 会更有用。</p>

<h2 id="overlooked-use">Mage Armor 最容易被忽略的技巧是什么？</h2>
<p><strong>最容易被忽略的技巧是：Mage Armor 可以给另一个自愿且未穿护甲的生物施放，不是只能给施法者自己上。</strong>很多玩家会漏掉这一点，因为它看起来太像“法师自保税”。</p>

<p>这条视频的有用思路很直接：不要把 Mage Armor 理解成“开战后我给自己补一下”。它是一个持续 8 小时的 Touch 法术，所以完全可以在危险场景开始前使用。</p>

<ul>
  <li><strong>给魔宠或侦察目标上</strong>，再让它去探陷阱走廊或敌方哨点。</li>
  <li><strong>给无甲 NPC 护送目标上</strong>，避免一个普通弓箭就毁掉整段任务。</li>
  <li><strong>给脆皮队友上</strong>，前提是他没穿护甲且 Dex 调整值不错。</li>
  <li><strong>进地城前先放</strong>，不要把第一轮 Action 浪费在补防御上。</li>
  <li><strong>守夜前评估是否值得</strong>，如果下一次伏击概率高，一个 1 环位可能就是保险。</li>
</ul>

<p>但别滥用。按我的习惯，我不会为了每个可能被擦伤的普通 NPC 烧法术位。我只会在目标真的可能挨打，而且目标倒下会影响任务时才用。</p>

<h2 id="mage-armor-vs-shield">Mage Armor、Shield 法术和普通护甲哪个更好？</h2>
<p><strong>Mage Armor 更像战前保险；Shield 法术更像紧急反应；普通护甲则适合那些能无痛穿甲的构筑。</strong>它们解决的不是同一个问题。</p>

<table>
  <thead>
    <tr>
      <th>选项</th>
      <th>最擅长什么</th>
      <th>主要成本</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Mage Armor</strong></td>
      <td>给无甲 Dex 施法者提供长时间 AC。</td>
      <td>一个准备/已知法术位，通常还要一个 1 环法术位。</td>
    </tr>
    <tr>
      <td><strong>Shield 法术</strong></td>
      <td>挡下当下这一发关键命中。</td>
      <td>Reaction，并且每次都要烧 1 环位。</td>
    </tr>
    <tr>
      <td><strong>轻甲</strong></td>
      <td>有熟练的角色获得被动防御。</td>
      <td>需要护甲熟练和装备，但不用法术位。</td>
    </tr>
    <tr>
      <td><strong>中甲</strong></td>
      <td>Dex 中等、但有护甲能力的角色。</td>
      <td>需要熟练、金币，有些护甲还会影响 Stealth。</td>
    </tr>
  </tbody>
</table>

<p>如果你想横向比较护甲数值，可以看 <a href="${ZH_DND_ARMOR_PATH}">DND 护甲指南</a>。我的短结论是：16 Dex 的低级 Wizard 很喜欢 Mage Armor；但如果你是有护甲线的 Warlock 或多职业施法者，普通护甲往往更省。</p>

<h2 id="vtt-token">Mage Armor 角色的 VTT Token 怎么做更清楚？</h2>
<p><strong>Mage Armor 的 VTT Token 应该让玩家一眼看出魔法防护，但不能把角色轮廓糊掉。</strong>地图缩放后，可读性比特效更重要。</p>

<p>我给 Mage Armor 施法者做 Token 时，不会整个人都包成蓝光。更好用的是半透明胸甲、肩部符文、或角色背后一圈薄薄的护盾光环。这样放到 Roll20、Foundry VTT 或 Owlbear Rodeo 里，角色和法术效果都能读出来。</p>

<ul>
  <li><strong>裁切要紧一点：</strong>512 px 下也应该看得清脸、手和魔法护甲。</li>
  <li><strong>光效别盖住脸：</strong>玩家要先看清角色，再看清法术。</li>
  <li><strong>蓝色或紫色少量使用：</strong>一个清楚的护盾色，比到处都是魔法粒子更有效。</li>
  <li><strong>边框保持干净：</strong>无甲施法者更适合细的奥术边框，不适合太厚的金属重甲框。</li>
  <li><strong>导出透明 PNG：</strong>叠在深色地城地图上会更干净。</li>
</ul>

<p>你可以在 <a href="${ZH_EDITOR_PATH}">VTT Token 制作工具</a> 里做这种效果。如果你想顺手测试 Mage Armor 到底让敌人少命中多少次，可以打开 <a href="${ZH_DICE_ROLLER_PATH}">D&amp;D 骰子工具</a>，分别掷几轮 AC 12、15、16 的攻击对比。</p>

<section id="faq" class="mt-12 rounded-[34px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
  <h2 class="font-display text-2xl sm:text-3xl text-stone-50" style="margin-top: 0;">FAQ：关于 DND Mage Armor 的高频问题</h2>

  <div class="mt-6 space-y-4">
    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Mage Armor 需要 Concentration 吗？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">不需要。<strong>Mage Armor 不是 Concentration 法术</strong>，所以它持续期间，你仍然可以维持另一个专注法术。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Mage Armor 能给别人施放吗？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">可以。Mage Armor 的距离是 Touch，目标是一个自愿且未穿护甲的生物，所以可以给符合条件的其他生物施放。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Mage Armor 能和 Unarmored Defense 叠加吗？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">不能。Mage Armor 和 Unarmored Defense 是两套不同的基础 AC 计算方式。你选择其中一种使用，不能把公式加在一起。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Mage Armor 可以和 shield 一起用吗？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">按 2014 Sage Advice 裁定，可以。Mage Armor 可以和 shield 一起用，因为 shield 是被 wield，而不是 worn armor。严格 2024 桌最好先问 DM。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">高等级还值得用 Mage Armor 吗？</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">看构筑。对高 Dex 无甲施法者仍然有价值，但高等级后更容易被护甲熟练、魔法物品、子职业特性或更好的站位替代。</p>
    </article>
  </div>
</section>

<h2 id="video">延伸观看：很多人漏掉的 Mage Armor 用法</h2>
<p><a href="${DND_MAGE_ARMOR_VIDEO_URL}" rel="noreferrer noopener">It took me 10 years to realize i could do this</a> 指向一个很容易漏掉的桌面习惯：<strong>Mage Armor 不只是开战后给自己补的自保法术</strong>。把它当成一个持续 8 小时的 Touch 法术，先判断谁真的需要，再在箭飞过来之前放好。</p>

${liteVideoEmbed('ZBbhI8Mp8fE', 'It took me 10 years to realize i could do this', {
  src: DND_MAGE_ARMOR_VIDEO_PLACEHOLDER_PATH,
  alt: 'dnd mage armor 指南视频封面，蓝色奥术护盾保护长袍施法者并挡住飞来的箭矢',
})}
`;
