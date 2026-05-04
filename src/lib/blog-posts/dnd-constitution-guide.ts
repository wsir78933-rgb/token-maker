import {
  DND_CONSTITUTION_INLINE_IMAGE_PATH,
  EN_DND_CLASSES_PATH,
  EN_DND_DRUID_SPELLS_PATH,
  EN_DICE_ROLLER_PATH,
  ZH_DND_DRUID_SPELLS_PATH,
  liteVideoEmbed,
} from './shared';

export const dndConstitutionArticleHtml = String.raw`
<p>In D&amp;D, <strong>dnd constitution</strong> is the ability score that decides how much punishment your character can survive before the plan falls apart. It affects hit points, Constitution saving throws, concentration checks, poison resistance moments, exhaustion pressure, and the small survival rolls that rarely look exciting until they save the session.</p>

<p>This guide gives you the practical version first: what Constitution changes on your sheet, how much HP different scores are worth, and why many characters should treat 14 Constitution as the baseline rather than a luxury.</p>

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
<p>Constitution mainly affects your maximum hit points, Constitution saving throws, and concentration checks after taking damage.</p>

<p>That sounds simple, but it touches almost every dangerous part of play. A low Constitution character is not just easier to knock out. They are also worse at resisting poison, surviving harsh environments, holding important spells, and staying useful after repeated damage.</p>

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
      <td>-1 HP</td>
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

<h2>How Constitution Affects Hit Points</h2>
<p>Your Constitution modifier is added to your hit points at level 1 and again every time you gain a level.</p>

<p>This is why Constitution scales better than it first appears. A +2 modifier is not just two extra hit points once. It is two extra hit points per level. By level 5, that is 10 extra HP. By level 10, it is 20 extra HP. On a fragile caster, that can be the difference between maintaining the fight and spending the round unconscious.</p>

<ul>
  <li><strong>8 Constitution:</strong> risky unless your table is very forgiving.</li>
  <li><strong>10 Constitution:</strong> workable, but I would not put it on a frontliner.</li>
  <li><strong>12 Constitution:</strong> acceptable for cautious ranged characters.</li>
  <li><strong>14 Constitution:</strong> my default recommendation for most builds.</li>
  <li><strong>16 Constitution:</strong> strong for Barbarians, Fighters, Paladins, and concentration casters.</li>
</ul>

<h2>Why Constitution Saves Matter</h2>
<p>Constitution saving throws usually show up when your body is being tested directly: poison, disease, exhaustion, extreme weather, monster breath, and other survival pressure.</p>

<p>In my games, failed Constitution saves often hurt more than failed skill checks because they do not just block progress. They drain resources. A failed save can mean poisoned attacks, lost time, healing spent too early, or exhaustion that follows the party into the next encounter.</p>

<section class="mt-10 rounded-[30px] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
  <h3 class="font-display text-2xl text-stone-50" style="margin-top: 0;">Quick Tool Tip</h3>
  <p class="mt-3 text-[0.98rem] leading-8 text-stone-300">When a session starts calling for repeated survival saves, poison saves, or concentration checks, use the <a href="${EN_DICE_ROLLER_PATH}">D&amp;D dice roller</a> to keep the math moving. Constitution checks come up often enough that a clean roller saves table time.</p>
</section>

<h2>Constitution and Concentration Checks</h2>
<p>When you take damage while concentrating on a spell, you make a Constitution saving throw to keep that spell active.</p>

<p>The DC is 10 or half the damage you took, whichever is higher. This is the rule that makes Constitution so important for Wizards, Clerics, Druids, Warlocks, Sorcerers, Paladins, Rangers, and any character relying on concentration magic. If you are preparing a nature caster, the <a href="${EN_DND_DRUID_SPELLS_PATH}">DND druid spells guide</a> shows which control spells most need that concentration protection.</p>

<p>I have seen low-Constitution casters lose a fight because they landed the perfect control spell, took a small hit, failed the concentration save, and suddenly the whole party plan collapsed. That is why I usually prefer <strong>14 Constitution</strong> on a serious caster unless the build has a very good reason to go lower.</p>

<ul>
  <li><strong>War Caster:</strong> excellent if you make many concentration saves.</li>
  <li><strong>Resilient (Constitution):</strong> strong when proficiency will scale across the campaign.</li>
  <li><strong>Higher Constitution:</strong> simple, reliable, and useful even when you are not casting.</li>
</ul>

<h2>Best Classes and Builds for High Constitution</h2>
<p>The characters that benefit most from high Constitution are frontliners, concentration casters, and anyone expected to take repeated damage.</p>

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
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">Yes. Your Constitution modifier is added to your hit points at level 1, and the same modifier is added again every time you gain another level.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">What is Constitution in DND used for mainly?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">Constitution is mainly used for maximum hit points, Constitution saving throws, and concentration checks when a spellcaster takes damage while maintaining a spell.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Is 14 Constitution enough in D&amp;D?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">For many characters, yes. A 14 Constitution gives a +2 modifier, which is a strong baseline for hit points and concentration saves without consuming too much of your stat budget.</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">What happens if Constitution is reduced to 0?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">If a creature's Constitution is reduced to 0, it dies. That is rare in normal play, but it shows how directly Constitution is tied to physical survival.</p>
    </article>
  </div>
</section>

<h2>Watch: Constitution Rules and Survival Pressure</h2>
<p>The video below is included as a companion watch for players who want a faster table explanation after reading the guide. Use it as a refresher, then come back to the tables above when you are deciding how much Constitution your next character actually needs.</p>

${liteVideoEmbed('WoV5iM7peOg', 'DND constitution rules and mechanics video')}
`;

export const dndConstitutionArticleHtmlZh = String.raw`
<p>在 D&amp;D 跑团中，<strong>dnd constitution</strong>（体质）代表了角色的生存底线和忍耐极限。无论是遭遇怪物的毒气喷吐、在危险水域憋气潜水，还是纯粹叠加生命上限，体质都发挥着绝对核心的作用。这篇指南将带你用最直观的方式，彻底搞懂体质如何影响你的生命池（HP）与专注判定。如果你正在规划新角色，本文能帮你避开“因为没点体质而被一刀击杀”的毁灭性误区。</p>

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
<p>在建卡时，许多追求初级爆发伤害的新玩家会把点数全押在力量或智力上，留下可悲的 8 点体质。这不仅极度危险，而且拖累了医疗位队友。基于规则核心逻辑，下面这张属性收益表直观地展示了 <strong>constitution dnd</strong> 在抗压维度上的巨大差距：</p>

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
      <td>HP 必定扣减 1 点</td>
      <td>极度虚弱（容易因负面状态进入绝境）</td>
    </tr>
    <tr>
      <td><strong>10 或 11</strong></td>
      <td>+0 (普通平民底线)</td>
      <td>无任何加成</td>
      <td>勉强合格</td>
    </tr>
    <tr>
      <td><strong>12 或 13</strong></td>
      <td>+1 (合格冒险者)</td>
      <td>+1 HP</td>
      <td>一般正常水平</td>
    </tr>
    <tr>
      <td><strong>14 或 15</strong></td>
      <td>+2 (标准施法者配置)</td>
      <td>+2 HP</td>
      <td>优秀稳健（强烈建议保底此数值）</td>
    </tr>
    <tr>
      <td><strong>16 及以上</strong></td>
      <td>+3 或更高</td>
      <td>+3 HP 封顶以上</td>
      <td>极其强悍（核心近战抗压位必满）</td>
    </tr>
  </tbody>
</table>

<p>当你需要长途跨越冰原、在水底脱困、或是对抗毒气，角色必须被动进行体质豁免检定。如果该判定失败，轻则进入“中毒”或“力竭”等严重损伤轮次，重则直接陷入倒地昏迷。这意味着体质修正值（Modifier）不仅仅是每一次级别跃升时强制附带加倍的安全血点基数，更是所有“非战斗高危场景”的刚需保命符。</p>

<div class="mt-8 rounded-[24px] border border-white/8 bg-black/20 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
  <div class="flex-1">
    <h3 class="text-lg font-medium text-stone-50 m-0 p-0" style="margin: 0;">🎯 实战工具推荐</h3>
    <p class="mt-2 text-sm leading-7 text-stone-300" style="margin-top: 0.5rem; margin-bottom: 0;">还在为了纯手算豁免结果而打乱跑团节奏？立即切换使用我们系统严密的 D&amp;D 线上掷骰器，一秒准确模拟带有体质修正计算的综合生存掷骰。</p>
  </div>
  <a href="/dice-roller-dnd" class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-[#f1d492] transition hover:border-[#d7b46a]/50 hover:bg-[#d7b46a]/10">
    打开 Dice Roller
  </a>
</div>

<h2>施法者生存必看：体质如何决定法术专注</h2>
<p>如果你切入的世界角色是法师、牧师、术士或德鲁伊等拥有技能流分支的职业，Constitution 的重要优先级甚至可以与你的核心施法天赋并驱并重。实战记录中，曾经有只配给 10 点体质的法系角色，强行读条放出了改变战局的顶级群体法术，结果被地图边缘毒刺擦伤一滴残血，瞬间专注破裂技能失效，导致全盘崩坏。如果你正在玩自然系控场角色，可以结合 <a href="${ZH_DND_DRUID_SPELLS_PATH}">DND 德鲁伊法术指南</a> 判断哪些专注法术最值得保护。</p>

<ul>
  <li><strong>何为专注被动性判定</strong>：当你成功激活并处于维持带有“专注 (Concentration)”标签的强大控制法术时，一旦遭受突发伤害，为了确保该释放法术不被物理中断，你必须通过一次体质豁免检定来强稳心神（DC = 你所遭受单次攻击伤害数额的整整一半，且系统设定最低判定难度门槛不可低于固定的 10 点）。</li>
  <li><strong>强稳拉平生存下限</strong>：如果在建卡初期果断将体质属性强制锁定在充盈的 14（自带 +2 修正补偿值），你对抗前期小怪乱箭流打断的抗压存活率与法力续航几率会发生质的飞跃。</li>
  <li><strong>最佳专长额外防御</strong>：强烈推荐法系角色在面临获取额外被动专长节点时，第一优选拿下 <strong>“战地施法者 (War Caster)”</strong> 或 <strong>“坚如磐石 (Resilient - Constitution)”</strong>。高体质基础直接红利叠加这些防御性专长，能死死卡住核心控场技能的释放稳定性。</li>
</ul>

<h2>高体质加成：跑团种族搭配与流派实战推荐</h2>
<p>若要在开局阶段就彻底避免沦为战队底层“吸血漏勺”，聪明的做法是定向利用特定类别的初始天赋种族血脉来“白嫖”生命加成。以下建议都是能以最低代价极限拉满体质收益的优选项：</p>

<ul>
  <li><strong>矮人 (Dwarves)</strong>：先天基因即自带 +2 的 Constitution 高加成定底。其中“山地矮人”分类甚至天生骨骼强健兼备中型护甲熟练适应力，毫无疑问是当前最完美的新建肉盾底子。</li>
  <li><strong>野蛮人 (Barbarians)</strong>：整套 D&amp;D 模组中对体测数值吸收最透彻的近战物理职业。倚靠核心的“无甲防御 (Unarmored Defense)”体系算法，不仅最大化撑高了血线纵深，你的体质修正补偿甚至可以直接变现转化为实体绝对护甲面板（AC 减伤值）。此时高体质等同于“极厚血库与极度防弹双向叠加”。</li>
  <li><strong>半兽人 (Half-Orcs)</strong>：综合其并不低的原始三围底子，他们更依赖纯种族独占的超硬被动能力——面临致死贯穿级打击时能强行用肉体将其过滤，“锁住最后 1 滴保底生命”金刚不倒。这种置死地而后生的容错底牌配合原本就极其蛮横的骨架肉包，经常强扭逆境创造反杀生还局。</li>
</ul>

<section class="mt-12 rounded-[34px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
  <h2 class="font-display text-2xl sm:text-3xl text-stone-50" style="margin-top: 0;">常见问题解答 (FAQ)</h2>
  
  <div class="mt-6 space-y-4">
    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">What happens if my constitution is reduced in D&amp;D?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">当你的 Constitution 数据受到超自然诅咒或外力毒素被迫削减时，你的角色生命上限（HP 值底池）将即刻重置暴跌。极其极端的灾难后果是：如果该项体指标被高阶死灵系怪物的特性机制抽干、强压归结为 0 点底裤线，规则会直接宣判触发即死，系统直接没收挽救性质的死亡抢救（Death Saving Throws）流程权限。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Does Constitution add to HP at level 1 in D&amp;D 5e?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">是的，你的角色刚刚涉足迈进最初的 1 级阶段门槛位时，你 Constitution 身上的点数修正值就已经在后台计算、并完全折算加合到了你的裸装备初始生命池体系中。尤且不止，之后经历所有的每一次升级阈值突破阶段，这同一份固定的修正分红将稳稳地兑现成红利血珠奖励，精准叠套在你不断攀升拔高的 HP 最大值之顶。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">What is Constitution in DND used for mainly?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">解构到整套纸笔桌面系统的基石上来看，Constitution （体质）主要是为了被用于决定该玩家能撑多大的绝对生命气血容量池（Max HP）；负责在突遭不明病毒感染、承受毒药浸透或陷入严寒酷暑侵袭时触发基础豁免活命保底；以及影响施法者人群战局的一环——当被围殴受创却非要卡点吟唱长效强力魔法时，它承担着能不能抗衡住伤痛、强制锁死法力集中度的底层验证性（Concentration Checks）把控门槛。</p>
    </article>
  </div>
</section>

${liteVideoEmbed('WoV5iM7peOg', 'DND constitution rules and mechanics video')}
`;
