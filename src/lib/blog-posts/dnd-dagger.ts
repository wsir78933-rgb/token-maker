import {
  DND_DAGGER_2014_RULES_URL,
  DND_DAGGER_2024_RULES_URL,
  DND_DAGGER_LOADOUT_IMAGE_PATH,
  DND_DAGGER_RANGE_IMAGE_PATH,
  DND_DAGGER_VIDEO_PLACEHOLDER_PATH,
  DND_DAGGER_WIKIPEDIA_URL,
  EN_DICE_ROLLER_PATH,
  EN_DND_ARMOR_PATH,
  EN_DND_CLASSES_PATH,
  EN_EDITOR_PATH,
  EN_SQUARE_TOKEN_MAKER_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_ARMOR_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_EDITOR_PATH,
  ZH_SQUARE_TOKEN_MAKER_PATH,
  liteVideoEmbed,
} from './shared';

export const dndDaggerArticleHtml = String.raw`
<p><strong>dnd dagger</strong> is a simple melee weapon that deals <strong>1d4 piercing damage</strong>, costs 2 gp, weighs 1 lb, and carries the Finesse, Light, and Thrown properties. Start with the stat block, then use the rulings below to decide whether a dagger is a backup tool, a Rogue delivery system, or part of a 2024 Nick build.</p>

<table>
  <thead>
    <tr>
      <th>Dagger stat</th>
      <th>Fast answer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Weapon category</strong></td>
      <td>Simple melee weapon.</td>
    </tr>
    <tr>
      <td><strong>Damage</strong></td>
      <td>1d4 piercing.</td>
    </tr>
    <tr>
      <td><strong>Cost / weight</strong></td>
      <td>2 gp / 1 lb.</td>
    </tr>
    <tr>
      <td><strong>Properties</strong></td>
      <td>Finesse, Light, Thrown.</td>
    </tr>
    <tr>
      <td><strong>Thrown range</strong></td>
      <td>20 feet normal, 60 feet long range.</td>
    </tr>
    <tr>
      <td><strong>2024 weapon mastery</strong></td>
      <td>Nick, if your character has the right mastery access.</td>
    </tr>
    <tr>
      <td><strong>Best users</strong></td>
      <td>Rogues, Dex characters, casters who need an emergency weapon, and two-weapon builds that care about Light/Nick.</td>
    </tr>
  </tbody>
</table>

<p>My short table opinion: a dagger is not a damage race winner. It is good because it is <strong>cheap, concealable, throwable, Dexterity-friendly, and easy to keep as a backup</strong>. That mix is why it keeps showing up on character sheets even when a rapier or shortsword hits harder.</p>

<h2 id="quick-stats">dnd dagger Quick Stats</h2>
<p><strong>A dnd dagger is a simple melee weapon with 1d4 piercing damage, Finesse, Light, and Thrown 20/60.</strong> The <a href="${DND_DAGGER_2014_RULES_URL}" rel="noreferrer noopener">2014 Basic Rules weapon table</a> gives the classic fifth-edition stat line, while the <a href="${DND_DAGGER_2024_RULES_URL}" rel="noreferrer noopener">2024 Free Rules equipment section</a> keeps the same basic weapon identity and adds weapon mastery context.</p>

<ul>
  <li><strong>Finesse:</strong> use Strength or Dexterity for attack and damage, whichever fits the attack.</li>
  <li><strong>Light:</strong> works with two-weapon fighting rules when the other weapon also qualifies.</li>
  <li><strong>Thrown:</strong> you can throw it as a ranged attack using the same ability you would use for melee.</li>
  <li><strong>Simple weapon:</strong> many classes can use it without building around weapon access.</li>
  <li><strong>Small profile:</strong> it is easy to justify as a boot knife, sleeve blade, belt tool, or last-resort weapon.</li>
</ul>

<figure class="inline-figure inline-figure--four-three-crop">
  <img
    class="inline-figure__image inline-figure__image--four-three"
    src="${DND_DAGGER_LOADOUT_IMAGE_PATH}"
    alt="dnd dagger equipment loadout showing a dagger, character sheet, dice, and quick stat notes on a tabletop"
    width="1536"
    height="1152"
    loading="lazy"
    decoding="async"
  />
  <figcaption>A dagger earns its slot because it solves small problems: close backup, ranged poke, hidden blade, and Dex-friendly finesse attack.</figcaption>
</figure>

<h2 id="damage-math">How Much Damage Does a dnd dagger Do?</h2>
<p><strong>A dnd dagger deals 1d4 piercing damage plus the relevant ability modifier when the attack rules allow that modifier.</strong> The base die is small, so most dagger value comes from class features, extra attacks, off-hand timing, poison, Sneak Attack, or simply having a weapon when your main plan fails.</p>

<table>
  <thead>
    <tr>
      <th>Use case</th>
      <th>Typical damage logic</th>
      <th>Table note</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>One melee attack</strong></td>
      <td>1d4 + Str or Dex modifier.</td>
      <td>Finesse lets a Dex character use the better stat.</td>
    </tr>
    <tr>
      <td><strong>One thrown attack</strong></td>
      <td>1d4 + Str or Dex modifier.</td>
      <td>Normal range is 20 feet; long range is 60 feet with disadvantage.</td>
    </tr>
    <tr>
      <td><strong>2014 off-hand attack</strong></td>
      <td>Usually 1d4 without the ability modifier unless a feature says otherwise.</td>
      <td>Costs the bonus action under common 2014 two-weapon fighting rules.</td>
    </tr>
    <tr>
      <td><strong>2024 Nick setup</strong></td>
      <td>Can move the extra Light attack into the Attack action if you have Nick mastery.</td>
      <td>Nick changes action economy; it does not turn the dagger into a high-die weapon.</td>
    </tr>
    <tr>
      <td><strong>Rogue Sneak Attack</strong></td>
      <td>Dagger damage plus Sneak Attack dice when the normal Sneak Attack conditions are met.</td>
      <td>The dagger die is small, but Sneak Attack carries the hit.</td>
    </tr>
  </tbody>
</table>

<p>When I test a dagger build at the table, I do not ask "is 1d4 impressive?" It is not. I ask whether the dagger creates a second route: can I attack with Dex, throw from cover, keep my bonus action plan, or still threaten an enemy after being disarmed?</p>

<h2 id="rogue">Is a dnd dagger Good for Rogues?</h2>
<p><strong>Yes, a dnd dagger is good for Rogues as a backup, thrown option, and Sneak Attack delivery weapon, but it is rarely the highest-damage main weapon.</strong> A rapier usually wins the single-hit melee damage comparison, and a shortbow often wins simple ranged reliability.</p>

<p>The dagger still has real Rogue value:</p>

<ul>
  <li><strong>It works with Sneak Attack.</strong> The Finesse property keeps it eligible when the rest of the Sneak Attack conditions are met.</li>
  <li><strong>It can be thrown.</strong> A Rogue can threaten a target without changing to a bow.</li>
  <li><strong>It supports hidden-weapon fiction.</strong> This matters in prison breaks, noble parties, cult infiltrations, and urban sessions.</li>
  <li><strong>It is cheap enough to lose.</strong> Throwing a 2 gp dagger into a canal hurts less than losing a magic weapon.</li>
  <li><strong>It pairs with two-weapon play.</strong> In 2024-style rules, Nick can matter a lot if your Rogue has the mastery path to use it.</li>
</ul>

<p>My preference is simple: give the Rogue a rapier or shortsword for normal fights, then carry two to four daggers for weird fights. The dagger is the tool you are happy you brought when the plan stops being clean.</p>

<h2 id="rules-versions">What Changed for dnd dagger in the 2024 Rules?</h2>
<p><strong>The biggest 2024 dagger change is not the damage die; it is the Nick weapon mastery option for characters who can use weapon mastery.</strong> The dagger remains a low-damage, flexible simple weapon, but the action economy around Light weapons changed enough that older advice can mislead players.</p>

<table>
  <thead>
    <tr>
      <th>Question</th>
      <th>2014-style answer</th>
      <th>2024-style answer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Does the dagger still deal 1d4 piercing?</td>
      <td>Yes.</td>
      <td>Yes.</td>
    </tr>
    <tr>
      <td>Does it still have Finesse, Light, and Thrown?</td>
      <td>Yes.</td>
      <td>Yes.</td>
    </tr>
    <tr>
      <td>What is the main build change?</td>
      <td>Bonus-action two-weapon fighting is the common dagger trick.</td>
      <td>Nick mastery can shift the extra Light attack into the Attack action.</td>
    </tr>
    <tr>
      <td>Does every character get Nick?</td>
      <td>No weapon mastery system in the 2014 Basic Rules.</td>
      <td>No. You need a class feature or option that grants the relevant mastery.</td>
    </tr>
  </tbody>
</table>

<p>If your group is mixing old character sheets with newer rules, write "dagger: Nick?" directly on the sheet. That one note prevents the common mistake where a player assumes the dagger automatically grants a free extra attack.</p>

<h2 id="throwing">When Should You Throw a dnd dagger?</h2>
<p><strong>You should throw a dnd dagger when staying in position is worth more than keeping the dagger in your hand.</strong> The range is short enough that throwing is a tactical patch, not a replacement for a real ranged weapon.</p>

<figure class="inline-figure inline-figure--four-three-crop">
  <img
    class="inline-figure__image inline-figure__image--four-three"
    src="${DND_DAGGER_RANGE_IMAGE_PATH}"
    alt="dnd dagger throwing range diagram on a fantasy battle map showing 20 foot and 60 foot bands"
    width="1536"
    height="1152"
    loading="lazy"
    decoding="async"
  />
  <figcaption>The 20/60 range line is the dagger's practical limit. Inside 20 feet it feels reliable; past that you are accepting disadvantage for a specific reason.</figcaption>
</figure>

<ul>
  <li><strong>Throw from cover</strong> when stepping into melee would expose your concentration caster or wounded Rogue.</li>
  <li><strong>Throw at a fleeing enemy</strong> if the target is just outside reach and a small hit could matter.</li>
  <li><strong>Throw to trigger a class feature</strong> only after confirming the feature works with the attack type.</li>
  <li><strong>Do not throw your last blade</strong> unless the scene is worth being empty-handed afterward.</li>
  <li><strong>Do not use it as your only ranged plan</strong> if your build regularly fights beyond 20 feet.</li>
</ul>

<p>Use the <a href="${EN_DICE_ROLLER_PATH}">D&amp;D dice roller</a> to test the difference between a normal 20-foot throw and a long-range 60-foot throw with disadvantage. The math makes the decision obvious fast.</p>

<h2 id="carry-count">How Many Daggers Should a Character Carry?</h2>
<p><strong>Most dagger-using characters should carry two to four daggers; a dedicated thrown-weapon character may want six or more.</strong> The right number depends on whether the dagger is a backup, a roleplay prop, or an actual damage plan.</p>

<table>
  <thead>
    <tr>
      <th>Character type</th>
      <th>Recommended count</th>
      <th>Why</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Wizard, Sorcerer, common backup user</strong></td>
      <td>1-2</td>
      <td>Enough for emergencies without pretending the dagger is the build.</td>
    </tr>
    <tr>
      <td><strong>Rogue or Dex Fighter</strong></td>
      <td>2-4</td>
      <td>One main backup, one off-hand, and one or two throwaways.</td>
    </tr>
    <tr>
      <td><strong>Thrown-weapon specialist</strong></td>
      <td>6+</td>
      <td>You need enough blades to survive multi-round fights, missed throws, and retrieval problems.</td>
    </tr>
    <tr>
      <td><strong>Infiltration character</strong></td>
      <td>1 obvious, 1 hidden</td>
      <td>The hidden dagger is the real value, not a bigger damage die.</td>
    </tr>
  </tbody>
</table>

<p>Ask your DM how strictly they track drawing, dropping, recovering, and concealing weapons. At strict tables, the logistics are the build. At loose cinematic tables, the dagger is mostly a clean fiction tool.</p>

<h2 id="comparisons">dnd dagger vs Shortsword vs Rapier</h2>
<p><strong>A dnd dagger is more flexible than a shortsword or rapier, but it deals less weapon-die damage.</strong> Pick the dagger for backup utility, not because it wins a fair damage spreadsheet.</p>

<table>
  <thead>
    <tr>
      <th>Weapon</th>
      <th>Why pick it</th>
      <th>Why skip it</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Dagger</strong></td>
      <td>Simple, finesse, light, thrown, easy to conceal, cheap to replace.</td>
      <td>Only 1d4 base damage.</td>
    </tr>
    <tr>
      <td><strong>Shortsword</strong></td>
      <td>Better damage die and still works well for many Dex melee characters.</td>
      <td>Not as easy to justify as a hidden tool; not thrown by default.</td>
    </tr>
    <tr>
      <td><strong>Rapier</strong></td>
      <td>Best common finesse die for one-handed melee damage.</td>
      <td>Not light, not thrown, and much less subtle.</td>
    </tr>
  </tbody>
</table>

<p>If you are still deciding the character chassis, start with the <a href="${EN_DND_CLASSES_PATH}">DND classes guide</a>. If the dagger user is getting hit too often, the <a href="${EN_DND_ARMOR_PATH}">DND armor guide</a> will matter more than squeezing one more point of dagger damage.</p>

<h2 id="vtt-token">How to Show a dnd dagger on a VTT Token</h2>
<p><strong>A dnd dagger VTT token should make the blade readable without turning the portrait into a tiny gray line.</strong> At map scale, silhouette beats realism.</p>

<p>When I make a knife-fighter token, I usually place the dagger near the face, shoulder, or leading hand. A dagger hanging at the belt often disappears once the token shrinks to 256 or 512 px.</p>

<ul>
  <li><strong>Use a bright edge highlight</strong> so the blade does not vanish on dark dungeon maps.</li>
  <li><strong>Keep the hand pose clear</strong> if the dagger defines the character's role.</li>
  <li><strong>Avoid full-body crops</strong> for dagger specialists; the weapon becomes unreadable.</li>
  <li><strong>Use a stealthy frame</strong> for Rogues and assassins, not a heavy heroic border.</li>
  <li><strong>Export a clean square token</strong> if the portrait is headed to Roll20, Foundry VTT, or Owlbear Rodeo.</li>
</ul>

<p>You can build that look in the <a href="${EN_EDITOR_PATH}">VTT token maker</a>. For grid-first portraits, use the <a href="${EN_SQUARE_TOKEN_MAKER_PATH}">square token maker</a> so the dagger hand does not get cropped off by accident.</p>

<h2 id="faq">FAQ About dnd dagger</h2>
<h3>Is a dnd dagger a simple weapon?</h3>
<p><strong>Yes, a dnd dagger is a simple melee weapon.</strong> That is why it appears on so many character sheets even when the character is not a dedicated martial build.</p>

<h3>Can a Rogue use Sneak Attack with a dagger?</h3>
<p><strong>Yes, a Rogue can use Sneak Attack with a dagger when the normal Sneak Attack conditions are met.</strong> The important part is that the dagger has the Finesse property.</p>

<h3>Can you throw a dnd dagger with Dexterity?</h3>
<p><strong>Yes, a thrown dagger can use Dexterity because the weapon has Finesse.</strong> It uses the same ability choice you would have for a melee attack with that dagger.</p>

<h3>Is a dagger better than a shortsword?</h3>
<p><strong>No for raw damage, yes for flexibility.</strong> A shortsword hits harder, but a dagger is cheaper, throwable, easier to hide, and more useful as a backup tool.</p>

<h3>Does the 2024 Nick mastery make daggers strong?</h3>
<p><strong>Nick makes daggers more action-efficient for the right character, but it does not change the 1d4 damage die.</strong> It is a build enabler, not a universal damage upgrade.</p>

<h2 id="video">Watch the dnd dagger Video</h2>

${liteVideoEmbed('RCnwjLK_ZuQ', 'dnd dagger companion video', {
  src: DND_DAGGER_VIDEO_PLACEHOLDER_PATH,
  alt: 'Clickable webp video cover for a dnd dagger guide showing a dagger on a dark tabletop beside dice and a parchment map',
})}

<p>For real-world dagger background rather than game rules, the <a href="${DND_DAGGER_WIKIPEDIA_URL}" rel="noreferrer noopener">dagger overview on Wikipedia</a> is useful context. For table play, always come back to the weapon table your campaign is actually using.</p>
`;

export const dndDaggerArticleHtmlZh = String.raw`
<p><strong>dnd dagger</strong> 是一种 simple melee weapon，基础伤害是 <strong>1d4 piercing</strong>，价格 2 gp，重量 1 lb，并带有 Finesse、Light、Thrown 属性。先看速查表，再判断它到底适合 Rogue、双持、投掷、2024 Nick 构筑，还是只适合作为备用刀。</p>

<table>
  <thead>
    <tr>
      <th>Dagger 数据</th>
      <th>快速答案</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>武器分类</strong></td>
      <td>Simple melee weapon。</td>
    </tr>
    <tr>
      <td><strong>伤害</strong></td>
      <td>1d4 piercing。</td>
    </tr>
    <tr>
      <td><strong>价格 / 重量</strong></td>
      <td>2 gp / 1 lb。</td>
    </tr>
    <tr>
      <td><strong>属性</strong></td>
      <td>Finesse、Light、Thrown。</td>
    </tr>
    <tr>
      <td><strong>投掷距离</strong></td>
      <td>20 尺正常距离，60 尺长距离。</td>
    </tr>
    <tr>
      <td><strong>2024 武器精通</strong></td>
      <td>Nick，前提是角色有对应 weapon mastery。</td>
    </tr>
    <tr>
      <td><strong>最适合谁</strong></td>
      <td>Rogue、Dex 角色、需要应急武器的施法者，以及依赖 Light/Nick 的双持构筑。</td>
    </tr>
  </tbody>
</table>

<p>我的短结论：dagger 不是伤害竞赛冠军。它强在 <strong>便宜、好藏、能投、吃 Dexterity、随手能当备用工具</strong>。这就是为什么它明明只有 1d4，却总能出现在角色卡上。</p>

<h2 id="quick-stats">dnd dagger 速查数据</h2>
<p><strong>dnd dagger 是 1d4 piercing、Finesse、Light、Thrown 20/60 的 simple melee weapon。</strong><a href="${DND_DAGGER_2014_RULES_URL}" rel="noreferrer noopener">2014 Basic Rules 武器表</a>给出经典 5e 数据，<a href="${DND_DAGGER_2024_RULES_URL}" rel="noreferrer noopener">2024 Free Rules 装备章节</a>则保留基本定位，并加入 weapon mastery 语境。</p>

<ul>
  <li><strong>Finesse：</strong>攻击和伤害可以用 Strength 或 Dexterity，取决于你怎么出手。</li>
  <li><strong>Light：</strong>可以参与双武器战斗规则，前提是另一把武器也符合要求。</li>
  <li><strong>Thrown：</strong>可以把 dagger 投出去，并使用同一套属性选择。</li>
  <li><strong>Simple weapon：</strong>很多职业不需要特别投资武器熟练就能用。</li>
  <li><strong>体积小：</strong>很适合作为靴刀、袖刀、腰间工具或最后保命武器。</li>
</ul>

<figure class="inline-figure inline-figure--four-three-crop">
  <img
    class="inline-figure__image inline-figure__image--four-three"
    src="${DND_DAGGER_LOADOUT_IMAGE_PATH}"
    alt="dnd dagger 装备速查图，桌面上有 dagger、角色卡、骰子和关键数据笔记"
    width="1536"
    height="1152"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Dagger 的价值不是大伤害，而是它能解决很多小问题：近战备用、短距投掷、隐藏武器和 Dex 攻击。</figcaption>
</figure>

<h2 id="damage-math">dnd dagger 能造成多少伤害？</h2>
<p><strong>dnd dagger 的基础伤害是 1d4 piercing，并在规则允许时加上对应属性调整值。</strong>它的武器骰很小，所以真正价值通常来自职业特性、额外攻击、双持时机、毒素、Sneak Attack，或者主武器失效时还有东西能打。</p>

<table>
  <thead>
    <tr>
      <th>用法</th>
      <th>常见伤害逻辑</th>
      <th>桌面备注</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>一次近战攻击</strong></td>
      <td>1d4 + Str 或 Dex 调整值。</td>
      <td>Finesse 让 Dex 角色可以用更合适的属性。</td>
    </tr>
    <tr>
      <td><strong>一次投掷攻击</strong></td>
      <td>1d4 + Str 或 Dex 调整值。</td>
      <td>20 尺内正常；60 尺长距离通常有劣势。</td>
    </tr>
    <tr>
      <td><strong>2014 副手攻击</strong></td>
      <td>通常是 1d4，不加属性调整值，除非特性另有说明。</td>
      <td>常见 2014 双持规则下会消耗 bonus action。</td>
    </tr>
    <tr>
      <td><strong>2024 Nick 构筑</strong></td>
      <td>如果有 Nick mastery，额外 Light 攻击可进入 Attack action。</td>
      <td>Nick 改的是动作经济，不是把 1d4 变大。</td>
    </tr>
    <tr>
      <td><strong>Rogue Sneak Attack</strong></td>
      <td>Dagger 伤害加 Sneak Attack 骰，前提是满足正常 Sneak Attack 条件。</td>
      <td>小武器骰不重要，Sneak Attack 才是主伤害。</td>
    </tr>
  </tbody>
</table>

<p>我实际看 dagger 构筑时，不会问“1d4 厉不厉害”。答案当然是不厉害。我会问它有没有给角色多一条路线：能不能用 Dex、能不能从掩体后投、能不能保留 bonus action、被缴械后还能不能威胁敌人。</p>

<h2 id="rogue">dnd dagger 适合 Rogue 吗？</h2>
<p><strong>适合，dnd dagger 对 Rogue 来说是很好的备用武器、投掷选项和 Sneak Attack 载体，但通常不是最高伤害主武器。</strong>单次近战伤害通常 rapier 更高；普通远程稳定性也经常是 shortbow 更好。</p>

<p>Dagger 对 Rogue 的真实价值在这里：</p>

<ul>
  <li><strong>可以触发 Sneak Attack。</strong>Finesse 属性让它在满足其他条件时可以作为 Sneak Attack 武器。</li>
  <li><strong>可以投掷。</strong>不用切换成弓，也能威胁短距离目标。</li>
  <li><strong>很适合隐藏武器剧情。</strong>越狱、贵族宴会、邪教潜入、城市团都会用得到。</li>
  <li><strong>便宜，丢了不心疼。</strong>把 2 gp 的 dagger 扔进水沟，比丢魔法武器好接受得多。</li>
  <li><strong>能配合双持。</strong>2024 风格规则里，如果 Rogue 有获得 Nick 的路径，它的动作经济会更有意义。</li>
</ul>

<p>我的习惯是：Rogue 正常战斗用 rapier 或 shortsword，再带两到四把 dagger 处理脏活。Dagger 是计划变乱时最好用的工具。</p>

<h2 id="rules-versions">2024 规则里的 dnd dagger 有什么变化？</h2>
<p><strong>2024 版 dagger 最大变化不是伤害骰，而是符合条件的角色可以围绕 Nick weapon mastery 使用它。</strong>Dagger 仍然是低伤害、高灵活性的 simple weapon，但 Light 武器的动作经济变化足够影响老攻略的判断。</p>

<table>
  <thead>
    <tr>
      <th>问题</th>
      <th>2014 风格答案</th>
      <th>2024 风格答案</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Dagger 仍然是 1d4 piercing 吗？</td>
      <td>是。</td>
      <td>是。</td>
    </tr>
    <tr>
      <td>仍然有 Finesse、Light、Thrown 吗？</td>
      <td>有。</td>
      <td>有。</td>
    </tr>
    <tr>
      <td>主要构筑变化是什么？</td>
      <td>常见技巧是 bonus-action 双武器攻击。</td>
      <td>Nick mastery 可以把额外 Light 攻击转进 Attack action。</td>
    </tr>
    <tr>
      <td>每个角色都能用 Nick 吗？</td>
      <td>2014 Basic Rules 没有 weapon mastery 系统。</td>
      <td>不能。需要职业特性或选项给你对应 mastery。</td>
    </tr>
  </tbody>
</table>

<p>如果你们团混用旧角色卡和新规则，我建议直接在角色卡上写一句“dagger: Nick?”。这能避免玩家误以为每把 dagger 自动送一次免费攻击。</p>

<h2 id="throwing">什么时候应该投掷 dnd dagger？</h2>
<p><strong>当保持当前位置比保留手里的 dagger 更重要时，就值得投掷 dnd dagger。</strong>它的距离太短，所以投掷更像战术补丁，不是正经远程武器替代品。</p>

<figure class="inline-figure inline-figure--four-three-crop">
  <img
    class="inline-figure__image inline-figure__image--four-three"
    src="${DND_DAGGER_RANGE_IMAGE_PATH}"
    alt="dnd dagger 投掷距离图，奇幻战斗地图上标出 20 尺和 60 尺范围"
    width="1536"
    height="1152"
    loading="lazy"
    decoding="async"
  />
  <figcaption>20/60 是 dagger 的实用边界。20 尺内还算可靠；超过这个距离，你是在为了特定目标接受劣势。</figcaption>
</figure>

<ul>
  <li><strong>从掩体后投</strong>，避免让专注施法者或低血 Rogue 暴露在近战里。</li>
  <li><strong>打逃跑目标</strong>，尤其目标刚好离开近战但还没跑远时。</li>
  <li><strong>触发职业特性前先确认规则</strong>，不要默认所有 melee weapon 都适用于 thrown attack。</li>
  <li><strong>别把最后一把刀扔掉</strong>，除非场景真的值得你之后空手。</li>
  <li><strong>别把它当唯一远程方案</strong>，如果你的构筑经常在 20 尺外作战。</li>
</ul>

<p>你可以用 <a href="${ZH_DICE_ROLLER_PATH}">D&amp;D 骰子工具</a> 对比 20 尺正常投掷和 60 尺长距离劣势的命中差距。多掷几轮，决策会很直观。</p>

<h2 id="carry-count">角色应该带几把 dagger？</h2>
<p><strong>大多数会用 dagger 的角色带两到四把就够；专门玩投掷武器的角色可以准备六把或更多。</strong>关键看 dagger 是备用工具、剧情道具，还是实际输出方案。</p>

<table>
  <thead>
    <tr>
      <th>角色类型</th>
      <th>建议数量</th>
      <th>原因</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Wizard、Sorcerer、普通备用使用者</strong></td>
      <td>1-2</td>
      <td>应急足够，不要假装它是核心构筑。</td>
    </tr>
    <tr>
      <td><strong>Rogue 或 Dex Fighter</strong></td>
      <td>2-4</td>
      <td>一把备用、一把副手，再加一两把可以丢的。</td>
    </tr>
    <tr>
      <td><strong>投掷武器专精</strong></td>
      <td>6+</td>
      <td>多轮战斗、投失、回收困难都会消耗库存。</td>
    </tr>
    <tr>
      <td><strong>潜入型角色</strong></td>
      <td>1 把明面，1 把隐藏</td>
      <td>隐藏那把才是真价值，不是更大的伤害骰。</td>
    </tr>
  </tbody>
</table>

<p>提前问 DM 怎么处理拔武器、丢武器、回收武器和藏武器。严格桌上，物流就是构筑的一部分；电影感桌上，dagger 更多是干净的叙事工具。</p>

<h2 id="comparisons">dnd dagger、shortsword 和 rapier 怎么选？</h2>
<p><strong>dnd dagger 比 shortsword 和 rapier 更灵活，但武器骰伤害更低。</strong>选 dagger 是为了备用和工具性，不是为了赢公平的伤害表。</p>

<table>
  <thead>
    <tr>
      <th>武器</th>
      <th>为什么选</th>
      <th>为什么不选</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Dagger</strong></td>
      <td>Simple、finesse、light、thrown、好藏、便宜。</td>
      <td>基础伤害只有 1d4。</td>
    </tr>
    <tr>
      <td><strong>Shortsword</strong></td>
      <td>武器骰更高，很多 Dex 近战角色用起来很顺。</td>
      <td>不如 dagger 好藏，也不是默认可投掷。</td>
    </tr>
    <tr>
      <td><strong>Rapier</strong></td>
      <td>常见 finesse 单手近战里伤害骰最好。</td>
      <td>不是 light，不能投掷，也很难装作小工具。</td>
    </tr>
  </tbody>
</table>

<p>如果你还在选角色底盘，先看 <a href="${ZH_DND_CLASSES_PATH}">DND 职业详解</a>。如果 dagger 使用者经常被打倒，那就先看 <a href="${ZH_DND_ARMOR_PATH}">DND 护甲指南</a>，别只盯着武器骰。</p>

<h2 id="vtt-token">dnd dagger 角色的 VTT Token 怎么做？</h2>
<p><strong>dnd dagger 角色的 VTT Token 要让刀刃可读，但不要让它变成缩小后看不见的灰线。</strong>在地图尺度下，轮廓比真实比例更重要。</p>

<p>我做持 dagger 的角色 Token 时，通常会把刀放在脸、肩膀或主手附近。挂在腰间的 dagger 缩到 256 或 512 px 后，经常直接消失。</p>

<ul>
  <li><strong>给刀刃加亮边</strong>，避免它在暗色地城地图上消失。</li>
  <li><strong>手部姿势要清楚</strong>，尤其当 dagger 是角色定位的一部分。</li>
  <li><strong>少用全身远景裁切</strong>，否则武器会小到不可读。</li>
  <li><strong>Rogue 和刺客用低调边框</strong>，不要套太厚的英雄金属框。</li>
  <li><strong>导出干净方形 Token</strong>，适配 Roll20、Foundry VTT 或 Owlbear Rodeo。</li>
</ul>

<p>你可以在 <a href="${ZH_EDITOR_PATH}">VTT Token 制作工具</a> 里处理这种头像。如果要做网格优先的角色图，用 <a href="${ZH_SQUARE_TOKEN_MAKER_PATH}">方形 Token 制作器</a> 更容易避免把持刀手裁掉。</p>

<h2 id="faq">FAQ：关于 dnd dagger 的常见问题</h2>
<h3>dnd dagger 是 simple weapon 吗？</h3>
<p><strong>是，dnd dagger 是 simple melee weapon。</strong>这也是它为什么会出现在很多非武斗职业角色卡上的原因。</p>

<h3>Rogue 可以用 dagger 触发 Sneak Attack 吗？</h3>
<p><strong>可以，只要满足正常 Sneak Attack 条件，Rogue 可以用 dagger 打 Sneak Attack。</strong>关键是 dagger 有 Finesse 属性。</p>

<h3>投掷 dnd dagger 可以用 Dexterity 吗？</h3>
<p><strong>可以，因为 dagger 有 Finesse，投掷时也可以使用 Dexterity。</strong>它沿用你用这把 dagger 近战攻击时可选择的属性。</p>

<h3>Dagger 比 shortsword 更好吗？</h3>
<p><strong>只看伤害不是；看灵活性则可能是。</strong>Shortsword 伤害更高，但 dagger 更便宜、可投、好藏，也更适合作备用工具。</p>

<h3>2024 Nick mastery 会让 dagger 变强吗？</h3>
<p><strong>Nick 会让合适角色的动作经济更顺，但不会改变 dagger 的 1d4 伤害骰。</strong>它是构筑启动器，不是人人通用的伤害升级。</p>

<h2 id="video">观看 dnd dagger 视频</h2>

${liteVideoEmbed('RCnwjLK_ZuQ', 'dnd dagger companion video', {
  src: DND_DAGGER_VIDEO_PLACEHOLDER_PATH,
  alt: 'dnd dagger 指南视频封面，黑色桌面上放着 dagger、骰子和羊皮纸地图',
})}

<p>如果你想看现实中的 dagger 背景，可以参考 <a href="${DND_DAGGER_WIKIPEDIA_URL}" rel="noreferrer noopener">Wikipedia 的 dagger 概览</a>。但跑团时，仍然要以你们当前使用的武器表为准。</p>
`;
