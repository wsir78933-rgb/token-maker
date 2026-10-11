import {
  DND_CONSTITUTION_INLINE_IMAGE_PATH,
  EN_DND_CLASSES_PATH,
  EN_DND_DRUID_SPELLS_PATH,
  EN_DICE_ROLLER_PATH,
  EN_EDITOR_PATH,
  ZH_DND_DRUID_SPELLS_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_EDITOR_PATH,
  liteVideoEmbed,
} from './shared';

const CONSTITUTION_RULES_2014_URL = 'https://www.dndbeyond.com/sources/dnd/basic-rules-2014/using-ability-scores';
const CONSTITUTION_LEVELS_2014_URL = 'https://www.dndbeyond.com/sources/dnd/basic-rules-2014/step-by-step-characters';
const CONCENTRATION_RULES_2014_URL = 'https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spellcasting';
const CHARACTER_CREATION_2024_URL = 'https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character';
const CONCENTRATION_RULES_2024_URL = 'https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary';
const CHARACTER_CLASSES_2014_URL = 'https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes';
const CHARACTER_CLASSES_2024_URL = 'https://www.dndbeyond.com/sources/dnd/br-2024/character-classes';

export const dndConstitutionArticleHtml = String.raw`
<p>In D&amp;D, <strong>dnd constitution</strong> affects your hit points and Constitution checks and saving throws when a rule or effect calls for them. It also matters when damage forces a Constitution save to maintain concentration on a spell.</p>

<p>Start with the practical version: what Constitution changes on your sheet, how much HP different scores are worth, and why many characters should treat 14 Constitution as the baseline rather than a luxury. If you are turning the build into a VTT-ready character, pair the sheet math with a sturdy portrait from the <a href="${EN_EDITOR_PATH}">free DnD token maker</a> so the token looks as durable as the numbers suggest.</p>
<p>Rules and character-creation options differ by edition: compare the <a href="${CONSTITUTION_RULES_2014_URL}">2014 ability-score rules</a> with <a href="${CHARACTER_CREATION_2024_URL}">2024 character creation</a>, and use the version your table has adopted.</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_CONSTITUTION_INLINE_IMAGE_PATH}"
    alt="DND constitution guide inline image showing a dwarf adventurer bracing against poison mist and storm magic in a ruined mountain pass"
    width="1672"
    height="941"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Constitution is not flashy, but it is the score that keeps your character standing when the table gets messy.</figcaption>
</figure>

<h2>What Does Constitution Do in DND?</h2>
<p>Constitution mainly affects hit points and Constitution checks or saving throws when a rule or effect calls for them. The <a href="${CONSTITUTION_RULES_2014_URL}">2014 ability-score rules</a> describe its check and hit-point effects; the <a href="${CHARACTER_CREATION_2024_URL}">2024 character rules</a> provide the current score modifiers and level-up procedure.</p>

<p>That sounds simple, but it touches several dangerous parts of play: a lower modifier means fewer hit points, and it can make a called-for Constitution save harder to pass. For example, the 2014 rules list holding your breath, marching or laboring for hours, going without sleep, and surviving without food or water as situations that may call for a Constitution check.</p>

<table>
  <thead>
    <tr>
      <th>Constitution score</th>
      <th>Modifier</th>
          <th>Extra HP per level</th>
      <th>Real table meaning</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>8 or 9</strong></td>
      <td>-1</td>
      <td>-1</td>
      <td>Fragile. I would only do this for a very specific roleplay reason.</td>
    </tr>
    <tr>
      <td><strong>10 or 11</strong></td>
      <td>+0</td>
      <td>+0 HP</td>
      <td>Playable, but thin for anyone who expects to get hit.</td>
    </tr>
    <tr>
      <td><strong>12 or 13</strong></td>
      <td>+1</td>
      <td>+1 HP</td>
      <td>Fine for safer backline characters in easier campaigns.</td>
    </tr>
    <tr>
      <td><strong>14 or 15</strong></td>
      <td>+2</td>
      <td>+2 HP</td>
      <td>The best default for most serious adventurers.</td>
    </tr>
    <tr>
      <td><strong>16 or higher</strong></td>
      <td>+3 or better</td>
      <td>+3 HP or more</td>
      <td>Excellent for frontliners, tanks, and concentration-heavy builds.</td>
    </tr>
  </tbody>
</table>
<p>This column shows the Constitution modifier added to each Hit Die. When rolling at a later level, the total HP gain after applying that modifier has a minimum of 1 under both the <a href="${CONSTITUTION_LEVELS_2014_URL}">2014 rules</a> and <a href="${CHARACTER_CREATION_2024_URL}">2024 rules</a>; fixed-value advancement follows its edition’s table.</p>

<h2>How Constitution Affects Hit Points</h2>
<p>Your Constitution modifier is added to your hit points at level 1 and each time you gain a level. When you roll a Hit Die at a later level, both the <a href="${CONSTITUTION_LEVELS_2014_URL}">2014 rules</a> and <a href="${CHARACTER_CREATION_2024_URL}">2024 rules</a> set a minimum gain of 1 HP after adding the modifier; if you use fixed values, follow the table for that edition.</p>

<p>This is why Constitution scales better than it first appears. A +2 modifier adds two hit points per level, not two hit points once: by level 5, that is 10 extra HP; by level 10, it is 20 extra HP, compared with a character whose modifier is +0.</p>

<ul>
  <li><strong>8 Constitution:</strong> risky unless your table is very forgiving.</li>
  <li><strong>10 Constitution:</strong> workable, but I would not put it on a frontliner.</li>
  <li><strong>12 Constitution:</strong> acceptable for cautious ranged characters.</li>
  <li><strong>14 Constitution:</strong> my default recommendation for most builds.</li>
  <li><strong>16 Constitution:</strong> strong for Barbarians, Fighters, Paladins, and concentration casters.</li>
</ul>

<h2>Why Constitution Saves Matter</h2>
<p>A poison, disease, exhaustion effect, weather hazard, or monster ability calls for a Constitution saving throw only when its rule text says so. The <a href="${CONSTITUTION_RULES_2014_URL}">2014 rules</a> separately list examples of Constitution checks such as holding your breath or going without food or water.</p>

<p>In my games, failed Constitution saves often hurt more than failed skill checks because they block progress and drain resources at the same time. A failed save can mean poisoned attacks, lost time, healing spent too early, or exhaustion that follows the party into the next encounter.</p>

<section class="mt-10 rounded-[30px] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
  <h3 class="font-display text-2xl text-stone-50" style="margin-top: 0;">Quick Tool Tip</h3>
  <p class="mt-3 text-[0.98rem] leading-8 text-stone-300">When a session starts calling for repeated survival saves, poison saves, or concentration checks, use the <a href="${EN_DICE_ROLLER_PATH}">D&amp;D dice roller</a> to keep the math moving. Constitution checks come up often enough that a clean roller saves table time.</p>
</section>

<h2>Constitution and Concentration Checks</h2>
<p>When you take damage while concentrating on a spell, you make a Constitution saving throw to keep that spell active.</p>

<p>Under the <a href="${CONCENTRATION_RULES_2014_URL}">2014 rules</a>, the DC is 10 or half the damage you took, whichever is higher. Under the <a href="${CONCENTRATION_RULES_2024_URL}">2024 rules</a>, it is the higher of 10 and half the damage rounded down, with a maximum DC of 30. This matters to any character maintaining a concentration effect. If you are preparing a nature caster, the <a href="${EN_DND_DRUID_SPELLS_PATH}">DND druid spells guide</a> shows which control spells most need that concentration protection.</p>

<p>I have seen low-Constitution casters lose a fight because they landed the perfect control spell, took a small hit, failed the concentration save, and suddenly the whole party plan collapsed. That is why I usually prefer <strong>14 Constitution</strong> on a serious caster unless the build has a very good reason to go lower.</p>

<ul>
  <li><strong>War Caster:</strong> excellent if you make many concentration saves.</li>
  <li><strong>Resilient (Constitution):</strong> strong when proficiency will scale across the campaign.</li>
  <li><strong>Higher Constitution:</strong> simple, reliable, and useful even when you are not casting.</li>
</ul>

<h2>Best Classes and Builds for High Constitution</h2>
<p>The characters that benefit most from high Constitution are frontliners, concentration casters, and anyone expected to take repeated damage.</p>
<p>The class and build suggestions below are play advice, not an official ranking. Compare the <a href="${CHARACTER_CLASSES_2014_URL}">2014 class rules</a> with the <a href="${CHARACTER_CLASSES_2024_URL}">2024 class rules</a> for each version’s features.</p>

<table>
  <thead>
    <tr>
      <th>Build type</th>
      <th>Why Constitution matters</th>
      <th>My recommendation</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Barbarian</strong></td>
      <td>More HP, better durability, and Unarmored Defense value.</td>
      <td>Go high. Constitution is part of the class fantasy and the math.</td>
    </tr>
    <tr>
      <td><strong>Fighter or Paladin</strong></td>
      <td>You will stand near danger and take repeated hits.</td>
      <td>14 is a good floor; 16 feels great if stats allow it.</td>
    </tr>
    <tr>
      <td><strong>Cleric or Druid</strong></td>
      <td>Many important spells require concentration while you stand near the fight.</td>
      <td>Do not treat Constitution as optional.</td>
    </tr>
    <tr>
      <td><strong>Wizard or Sorcerer</strong></td>
      <td>Low HP and concentration pressure make every point count.</td>
      <td>14 Constitution is often worth more than a cute secondary stat.</td>
    </tr>
  </tbody>
</table>

<p>If you are still comparing which class needs Constitution most, read the <a href="${EN_DND_CLASSES_PATH}">DND classes guide</a> next. It will help you decide whether your character is supposed to absorb pressure, avoid pressure, or control the fight from a safer angle.</p>

<section class="mt-12 rounded-[34px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
  <h2 class="font-display text-2xl sm:text-3xl text-stone-50" style="margin-top: 0;">FAQ About DND Constitution</h2>

  <div class="mt-6 space-y-4">
    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Does Constitution add to HP at level 1 in D&amp;D 5e?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">Yes. Your Constitution modifier is added at level 1 and again as you gain levels. See the <a href="${CONSTITUTION_LEVELS_2014_URL}">2014 leveling rules</a> or <a href="${CHARACTER_CREATION_2024_URL}">2024 character rules</a> for the version your table uses.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">What is Constitution in DND used for mainly?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">Constitution mainly affects hit points and the Constitution checks or saving throws called for by a rule or effect, including concentration saves after damage. See the <a href="${CONSTITUTION_RULES_2014_URL}">2014 ability-score rules</a> and <a href="${CONCENTRATION_RULES_2024_URL}">2024 concentration rules</a>.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Is 14 Constitution enough in D&amp;D?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">For many characters, yes. A 14 Constitution gives a +2 modifier, which is a strong baseline for hit points and concentration saves without consuming too much of your stat budget.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">What happens if Constitution is reduced to 0?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">Under the <a href="${CONSTITUTION_RULES_2014_URL}">2014 rules</a>, a change to your Constitution modifier changes your hit point maximum as though you had the new modifier from level 1. Whether an effect also causes death or another consequence depends on that effect’s own text, so check the rule that reduced the score.</p>
    </article>
  </div>
</section>

<h2>Watch: Constitution Rules and Survival Pressure</h2>
<p>The embedded video works as a quick table-side refresher on Constitution rules before you choose the score your next character can survive with.</p>

${liteVideoEmbed('WoV5iM7peOg', 'DND constitution rules and mechanics video')}
`;

export const dndConstitutionArticleHtmlZh = String.raw`
<p>在 D&amp;D 跑团中，<strong>dnd constitution</strong>（体质）会影响角色的生命值，以及规则或效果明确要求的体质检定与豁免。受到伤害并维持专注时，也可能要做体质豁免。了解这些机制后，再按你所在战役采用的版本安排属性点。</p>
<p>2014 与 2024 的属性创建和角色规则并不完全相同：可对照<a href="${CONSTITUTION_RULES_2014_URL}">2014 属性规则</a>与<a href="${CHARACTER_CREATION_2024_URL}">2024 角色创建规则</a>。如果你正在规划新角色，这里会说明体质修正值如何影响生命值与专注。</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_CONSTITUTION_INLINE_IMAGE_PATH}"
    alt="DND constitution 指南正文配图，一名矮人冒险者在山道废墟中顶着毒雾与风暴硬扛前进"
    width="1672"
    height="941"
    loading="lazy"
    decoding="async"
  />
  <figcaption>极度危险的环境下，高体质能保证角色存活。</figcaption>
</figure>

<h2>核心机制：Constitution DND 检定中到底影响什么？</h2>
<p>属性修正值会影响生命值，也会用于规则要求的体质检定或豁免。这张 <strong>constitution dnd</strong> 参考表列出常见分数对应的修正值；分数与修正值的对应关系可在<a href="${CONSTITUTION_RULES_2014_URL}">2014 属性规则</a>和<a href="${CHARACTER_CREATION_2024_URL}">2024 角色创建规则</a>中核对。</p>

<table>
  <thead>
    <tr>
      <th>你的 Constitution 点数</th>
      <th>属性修正值 (Modifier)</th>
      <th>每次升级时的 HP 额外加成</th>
      <th>在恶劣环境中的生还表现</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>8 或 9</strong></td>
      <td>-1 (致命缺陷)</td>
      <td>-1</td>
      <td>极度虚弱（容易因负面状态进入绝境）</td>
    </tr>
    <tr>
      <td><strong>10 或 11</strong></td>
      <td>+0 (普通平民底线)</td>
      <td>+0</td>
      <td>勉强合格</td>
    </tr>
    <tr>
      <td><strong>12 或 13</strong></td>
      <td>+1</td>
      <td>+1 HP</td>
      <td>一般正常水平</td>
    </tr>
    <tr>
      <td><strong>14 或 15</strong></td>
      <td>+2</td>
      <td>+2 HP</td>
      <td>优秀稳健（强烈建议保底此数值）</td>
    </tr>
    <tr>
      <td><strong>16 及以上</strong></td>
      <td>+3 或更高</td>
      <td>+3 或更高</td>
      <td>极其强悍（核心近战抗压位必满）</td>
    </tr>
  </tbody>
</table>
<p>表格中的数值是每个生命骰加入的体质修正。使用生命骰升级时，加上修正后的生命值增量最低为 1；若采用固定值，则按对应版本的表格计算。参见<a href="${CONSTITUTION_LEVELS_2014_URL}">2014 规则</a>或<a href="${CHARACTER_CREATION_2024_URL}">2024 规则</a>。</p>

<p>不要把特定伤害类型或危险场景一概当作体质豁免：只有当对应规则或效果明确要求时，才进行该豁免。2014 规则举例说明，屏息、长时间行军或劳作、缺觉、缺水缺食等情况可能要求体质检定；具体掷骰仍由场景规则与 DM 决定。可在<a href="${CONSTITUTION_RULES_2014_URL}">官方属性规则</a>查看这些例子。</p>

<div class="mt-8 rounded-[24px] border border-white/8 bg-black/20 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
  <div class="flex-1">
    <h3 class="text-lg font-medium text-stone-50 m-0 p-0" style="margin: 0;">🎯 实战工具推荐</h3>
    <p class="mt-2 text-sm leading-7 text-stone-300" style="margin-top: 0.5rem; margin-bottom: 0;">如果你已经在 <a href="${ZH_EDITOR_PATH}">免费 DnD token maker</a> 里做好了高体质角色头像，实际开团时再用 <a href="${ZH_DICE_ROLLER_PATH}">D&amp;D 线上掷骰器</a> 快速模拟带有体质修正的生存豁免，就不会因为手算结果打断节奏。</p>
  </div>
  <a href="${ZH_DICE_ROLLER_PATH}" class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-[#f1d492] transition hover:border-[#d7b46a]/50 hover:bg-[#d7b46a]/10">
    打开 Dice Roller
  </a>
</div>

<h2>施法者生存必看：体质如何决定法术专注</h2>
<p>如果你切入的世界角色是法师、牧师、术士或德鲁伊等拥有技能流分支的职业，Constitution 的重要优先级甚至可以与你的核心施法天赋并驱并重。实战记录中，曾经有只配给 10 点体质的法系角色，强行读条放出了改变战局的顶级群体法术，结果被地图边缘毒刺擦伤一滴残血，瞬间专注破裂技能失效，导致全盘崩坏。如果你正在玩自然系控场角色，可以结合 <a href="${ZH_DND_DRUID_SPELLS_PATH}">DND 德鲁伊法术指南</a> 判断哪些专注法术最值得保护。</p>

<ul>
  <li><strong>专注豁免</strong>：按<a href="${CONCENTRATION_RULES_2014_URL}">2014 规则</a>，DC 为 10 或所受伤害一半，取较高值；按<a href="${CONCENTRATION_RULES_2024_URL}">2024 规则</a>，DC 为 10 或伤害减半后向下取整，取较高值，最高为 30。</li>
  <li><strong>体质修正</strong>：14 点体质对应 +2 修正；是否把 14 作为目标属于构筑建议，具体属性分配仍按所用版本和角色方案决定。</li>
  <li><strong>最佳专长额外防御</strong>：强烈推荐法系角色在面临获取额外被动专长节点时，第一优选拿下 <strong>“战地施法者 (War Caster)”</strong> 或 <strong>“坚如磐石 (Resilient - Constitution)”</strong>。高体质基础直接红利叠加这些防御性专长，能死死卡住核心控场技能的释放稳定性。</li>
</ul>

<h2>高体质加成：跑团种族搭配与流派实战推荐</h2>
<p>种族（2024 规则中称物种）加值不能跨版本套用。2014 角色创建示例将矮人的 Constitution 加 2；2024 角色创建则按背景调整属性，并说明使用旧书种族时忽略旧有属性加值。请按战役使用的版本选择种族与属性来源，参见<a href="${CONSTITUTION_LEVELS_2014_URL}">2014 建卡示例</a>和<a href="${CHARACTER_CREATION_2024_URL}">2024 属性调整规则</a>。</p>

<ul>
  <li><strong>旧版种族加值</strong>：例如 2014 建卡示例中的矮人 +2 Constitution 只属于该版本的规则背景；2024 建卡按背景分配属性，不要把旧种族加值直接带入。</li>
  <li><strong>野蛮人 (Barbarians)</strong>：高体质会提高生命值；野蛮人的无甲防御还会把体质修正计入 AC。请按<a href="${CHARACTER_CLASSES_2014_URL}">2014</a>或<a href="${CHARACTER_CLASSES_2024_URL}">2024 野蛮人特性</a>核对具体公式。</li>
  <li><strong>其他前排与施法者</strong>：战士、圣武士、牧师、德鲁伊、法师和术士都可考虑体质，但合适的分数取决于职业、专注法术和桌上玩法；这些属于构筑建议，不是官方排名。</li>
</ul>

<section class="mt-12 rounded-[34px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
  <h2 class="font-display text-2xl sm:text-3xl text-stone-50" style="margin-top: 0;">常见问题解答 (FAQ)</h2>
  
  <div class="mt-6 space-y-4">
    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">What happens if my constitution is reduced in D&amp;D?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">若 Constitution 修正值发生变化，按<a href="${CONSTITUTION_RULES_2014_URL}">2014 属性规则</a>，生命值上限会按新修正值追溯调整，如同从 1 级起就使用该修正值。该效果是否另有死亡或其他后果，要看造成属性变化的规则文字；请查具体效果，不要自行假定通用结果。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Does Constitution add to HP at level 1 in D&amp;D 5e?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">是的。体质修正值计入 1 级生命值，并在之后升级时计入生命值。参见<a href="${CONSTITUTION_LEVELS_2014_URL}">2014 升级规则</a>或<a href="${CHARACTER_CREATION_2024_URL}">2024 角色规则</a>，按桌上采用的版本处理。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">What is Constitution in DND used for mainly?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">Constitution（体质）主要影响生命值，以及规则或效果要求的体质检定和豁免；受到伤害并维持专注时也可能要进行体质豁免。可查<a href="${CONSTITUTION_RULES_2014_URL}">2014 属性规则</a>和<a href="${CONCENTRATION_RULES_2024_URL}">2024 专注规则</a>。</p>
    </article>
  </div>
</section>

${liteVideoEmbed('WoV5iM7peOg', 'DND constitution rules and mechanics video')}
`;
