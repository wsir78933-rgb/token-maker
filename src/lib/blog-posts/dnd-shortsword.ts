import {
  DND_SHORTSWORD_2014_COMBAT_URL,
  DND_SHORTSWORD_2014_EQUIPMENT_URL,
  DND_SHORTSWORD_2014_ROGUE_URL,
  DND_SHORTSWORD_2024_EQUIPMENT_URL,
  DND_SHORTSWORD_2024_ROGUE_URL,
  DND_SHORTSWORD_VIDEO_PLACEHOLDER_PATH,
  DND_SHORTSWORD_VIDEO_URL,
  DND_SHORTSWORD_WEAPON_MASTERY_URL,
  EN_DICE_ROLLER_PATH,
  EN_DND_CLASSES_PATH,
  EN_DND_DAGGER_PATH,
  EN_DND_MACE_PATH,
  EN_EDITOR_PATH,
  EN_RAPIER_DND_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_DND_DAGGER_PATH,
  ZH_DND_MACE_PATH,
  ZH_EDITOR_PATH,
  ZH_RAPIER_DND_PATH,
  liteVideoEmbed,
} from './shared';

export const dndShortswordArticleHtml = String.raw`
<p>The <strong>dnd shortsword</strong> keeps its core Dexterity-melee role in 2014 and 2024 rules, but Vex, Nick, and Sneak Attack can still create table arguments. Check the version your table uses before relying on a weapon mastery or dual-wielding interaction.</p>

<p><strong>A shortsword is a martial melee weapon that deals 1d6 piercing damage, costs 10 gp, weighs 2 lb, and has the Finesse and Light properties.</strong> In the 2024 rules, the weapon keeps those basics and adds Vex as its mastery property.</p>

<p>That new line matters, but only in the right build. <strong>Vex matters only for a character who has a feature that lets them use that weapon mastery.</strong> The shortsword still qualifies for Dexterity attacks and Rogue play because of Finesse, but it does not turn every hit into free Advantage or automatic Sneak Attack.</p>

<h2 id="stats">Shortsword Stats in 2014 and 2024</h2>
<table>
  <thead>
    <tr>
      <th>Rule set</th>
      <th>Category</th>
      <th>Cost</th>
      <th>Damage</th>
      <th>Weight</th>
      <th>Properties</th>
      <th>Mastery</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>2014 D&amp;D 5e</strong></td>
      <td>Martial melee weapon</td>
      <td>10 gp</td>
      <td>1d6 piercing</td>
      <td>2 lb</td>
      <td>Finesse, Light</td>
      <td>None</td>
    </tr>
    <tr>
      <td><strong>2024 D&amp;D</strong></td>
      <td>Martial melee weapon</td>
      <td>10 GP</td>
      <td>1d6 Piercing</td>
      <td>2 lb</td>
      <td>Finesse, Light</td>
      <td>Vex</td>
    </tr>
  </tbody>
</table>

<p>The damage die, price, weight, and core weapon profile stay the same. The actual change is that the 2024 shortsword can apply Vex when the wielder has access to Weapon Mastery. For quick class planning, the <a href="${EN_DND_CLASSES_PATH}">DND classes guide</a> is useful when you are deciding whether the character is a Rogue, Fighter, Ranger, or some other Dexterity build that can make real use of the weapon.</p>

<h2 id="changes">What Changed for the Shortsword in 2024?</h2>
<p>The 2014 shortsword is straightforward: Light, Finesse, one-handed, and useful for basic two-weapon fighting. The 2024 version keeps that identity and adds Vex. On a hit that deals damage, Vex sets up Advantage on your next attack against that same creature before the end of your next turn.</p>

<p>That timing is where most mistakes begin. <strong>Vex does not give Advantage to the attack that triggered it.</strong> You hit first, deal damage first, and only then does Vex wait for the next attack against that target.</p>

<p>The 2024 Light wording also makes the extra attack easier to phrase. After you attack with a Light weapon as part of the Attack action, you can make one extra attack later on the same turn with a different Light weapon. <strong>The extra Light attack does not add your ability modifier to its damage unless that modifier is negative.</strong> Nick can move that extra attack into the Attack action once per turn, but it does not create a second Light extra attack.</p>

<p><strong>The shortsword has Vex, not Nick.</strong> That matters because the clean 2024 pair is usually shortsword plus dagger or scimitar: shortsword supplies Vex, while the second Light weapon supplies Nick. If you want the backup weapon comparison in more detail, read the <a href="${EN_DND_DAGGER_PATH}">DND dagger guide</a>. If you want a contrast with a one-handed weapon that cares far less about Light sequencing, the <a href="${EN_DND_MACE_PATH}">DND mace guide</a> shows why weapon properties often matter more than raw die size.</p>

<h2 id="finesse-light">How Finesse and Light Work</h2>
<h3>Finesse does not lock you into Dexterity</h3>
<p>Finesse lets you choose Strength or Dexterity for the attack roll and damage roll. You must use the same ability for both rolls on that attack. A shortsword is popular in Dexterity builds, but the property itself is not Dexterity-only.</p>

<p>Finesse is also the rule that keeps the shortsword relevant for Rogues. <strong>A shortsword qualifies for Sneak Attack because it has Finesse, but the Rogue still needs the normal Sneak Attack conditions.</strong> That is the safe sentence to remember at the table. The Rogue still needs the normal Sneak Attack conditions for the rules version your table is actually using, plus the once-per-turn limit.</p>

<h3>Light is about the extra attack, not free damage</h3>
<p>In 2014, taking the Attack action and attacking with a Light melee weapon in one hand lets you spend a Bonus Action to attack with a different Light melee weapon in the other hand. In 2024, the Light property itself handles the extra-attack sequence. Either way, the extra attack is still the constrained one: it needs a different Light weapon, and it usually does not add a positive ability modifier to damage.</p>

<p>You cannot use one shortsword to count as both Light attacks. You need another Light weapon. Two shortswords work for the basic sequence. A dagger or scimitar is often stronger in 2024 because Nick makes the action economy cleaner.</p>

<h2 id="vex-timing">Vex Timing, Step by Step</h2>
<ol>
  <li>Attack a creature with a shortsword whose Vex mastery you can use.</li>
  <li>Hit and deal damage.</li>
  <li>Vex is now active for that creature.</li>
  <li>Your next attack against that same creature has Advantage before the end of your next turn.</li>
  <li>Once that next attack roll happens, the Vex benefit is spent whether it hits or misses.</li>
</ol>

<p>The triggering attack never gets its own Vex benefit. <strong>Vex does not give Advantage to the attack that triggered it.</strong> That attack is rolled normally unless something else already granted Advantage.</p>

<p>Vex is also target-specific. If you damage one enemy with the shortsword and attack another creature afterward, the benefit stays attached to the original target until you use it or it expires.</p>

<h2 id="vex-nick">How to Sequence Vex and Nick</h2>
<p>A shortsword plus dagger is the easiest 2024 demonstration because the shortsword provides Vex and the dagger provides Nick.</p>

<p>This sequence assumes the character can use the mastery properties of both weapons. A printed mastery name does nothing by itself.</p>

<ol>
  <li>Take the Attack action and attack the target with the shortsword.</li>
  <li>If the shortsword hits and deals damage, Vex turns on for that target.</li>
  <li>Use the dagger's Nick mastery to make the Light extra attack as part of the same Attack action.</li>
  <li>Make that dagger attack against the same target with Advantage from Vex.</li>
  <li>Do not add a positive ability modifier to the dagger's damage unless another rule says you can.</li>
  <li>Your Bonus Action stays open because Nick moved the Light extra attack into the Attack action.</li>
</ol>

<p>If the shortsword misses, the Light sequence can still continue, but there is no Vex Advantage waiting for the follow-up attack. If the shortsword hits and the Nick attack goes into a different enemy, the Vex benefit remains on the first target instead of jumping across the battlefield.</p>

<p>This setup does not create a third attack. Light gives one extra attack. Nick changes where that one extra attack sits in the turn.</p>

<h2 id="sneak-attack">Can a Rogue Sneak Attack with a Shortsword?</h2>
<p>Yes. <strong>A shortsword qualifies for Sneak Attack because it has Finesse, but the Rogue still needs the normal Sneak Attack conditions.</strong> The weapon category does not block Sneak Attack, and the 2024 Vex line does not replace the normal Rogue requirements.</p>

<p>That means the right way to read the weapon is: it is eligible, not automatic. You still need Advantage or another legal Sneak Attack trigger under the rules your table is using, and you still only get one Sneak Attack per turn.</p>

<p>In a 2024 build with Weapon Mastery access, Vex can help set up the later attack. A first shortsword hit can turn on Vex, then the follow-up dagger or scimitar attack can roll with Advantage and become the Sneak Attack delivery if the Rogue has not already used it that turn.</p>

<p>For the exact class wording, compare the <a href="${DND_SHORTSWORD_2014_ROGUE_URL}" rel="noreferrer noopener">2014 Rogue rules</a> and the <a href="${DND_SHORTSWORD_2024_ROGUE_URL}" rel="noreferrer noopener">2024 Rogue rules</a>.</p>

<h2 id="comparison">Shortsword vs Rapier, Dagger, and Scimitar</h2>
<table>
  <thead>
    <tr>
      <th>Weapon</th>
      <th>Damage</th>
      <th>Key properties</th>
      <th>2024 mastery</th>
      <th>Best reason to choose it</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Shortsword</strong></td>
      <td>1d6 piercing</td>
      <td>Finesse, Light</td>
      <td>Vex</td>
      <td>Set up Advantage while keeping a Light-weapon turn available.</td>
    </tr>
    <tr>
      <td><strong>Rapier</strong></td>
      <td>1d8 piercing</td>
      <td>Finesse</td>
      <td>Vex</td>
      <td>Use it when you want one stronger Finesse melee hit and do not care about Light.</td>
    </tr>
    <tr>
      <td><strong>Dagger</strong></td>
      <td>1d4 piercing</td>
      <td>Finesse, Light, Thrown</td>
      <td>Nick</td>
      <td>Adds a thrown backup and moves the Light extra attack into the Attack action.</td>
    </tr>
    <tr>
      <td><strong>Scimitar</strong></td>
      <td>1d6 slashing</td>
      <td>Finesse, Light</td>
      <td>Nick</td>
      <td>Keeps the d6 while pairing cleanly with Vex.</td>
    </tr>
  </tbody>
</table>

<p>The <a href="${EN_RAPIER_DND_PATH}">rapier DnD guide</a> covers the larger die in a one-weapon Dexterity setup. The shortsword matters when the turn wants Light, Vex, or both. The dagger trades die size for Thrown and Nick. The scimitar is the neatest partner when you want two d6 Light weapons and mixed damage types.</p>

<h2 id="situations">Which Shortsword Loadout Fits Your Turn?</h2>
<table>
  <thead>
    <tr>
      <th>Situation</th>
      <th>Practical choice</th>
      <th>Why</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>You want a simple one-weapon Dexterity melee attack.</td>
      <td>Rapier, if proficient.</td>
      <td>The d8 matters more than Light when you are not using the extra attack.</td>
    </tr>
    <tr>
      <td>You want two Light weapons in 2014.</td>
      <td>Two shortswords or a shortsword with another Light melee weapon.</td>
      <td>That supports the normal Bonus Action attack sequence.</td>
    </tr>
    <tr>
      <td>You want Vex followed by Nick in 2024.</td>
      <td>Shortsword first, dagger or scimitar second.</td>
      <td>A damaging shortsword hit can feed Advantage into the Nick attack.</td>
    </tr>
    <tr>
      <td>You need a thrown fallback.</td>
      <td>Shortsword plus dagger.</td>
      <td>The dagger adds Thrown and Nick even though its die is smaller.</td>
    </tr>
    <tr>
      <td>You want two d6 weapons with mixed damage types.</td>
      <td>Shortsword plus scimitar.</td>
      <td>One gives Vex, the other gives Nick, and both stay Light.</td>
    </tr>
    <tr>
      <td>Your character cannot use Weapon Mastery.</td>
      <td>Judge the shortsword by Finesse, Light, damage, and proficiency.</td>
      <td>Vex is printed on the 2024 weapon, but your character still needs access to use it.</td>
    </tr>
  </tbody>
</table>

<h2 id="mistakes">Common Shortsword Rules Mistakes</h2>
<ul>
  <li><strong>Treating Finesse as Dexterity-only.</strong> You choose Strength or Dexterity, then use that ability for both attack and damage.</li>
  <li><strong>Using Vex on the triggering attack.</strong> The shortsword must hit and deal damage first.</li>
  <li><strong>Using Vex without Weapon Mastery access.</strong> The weapon entry alone is not enough.</li>
  <li><strong>Calling the shortsword a Nick weapon.</strong> The shortsword has Vex, not Nick.</li>
  <li><strong>Taking two Light extra attacks.</strong> Nick relocates the one extra attack; it does not add another one.</li>
  <li><strong>Adding a positive ability modifier to Light extra-attack damage by default.</strong> The extra Light attack does not add your ability modifier to its damage unless that modifier is negative.</li>
  <li><strong>Assuming Finesse guarantees Sneak Attack.</strong> Eligibility is not the same thing as meeting the trigger.</li>
  <li><strong>Mixing 2014 and 2024 text mid-ruling.</strong> A 2014 shortsword does not suddenly gain Vex because a newer book exists.</li>
</ul>

<h2 id="vtt">Tracking a Shortsword in a VTT</h2>
<p>Vex is easy to forget once several creatures share the map. The cleanest habit is to mark the target, not the attacker. When the shortsword deals damage, place a status marker on that creature with the attacker's name attached, then remove it as soon as the next attack against that target is rolled or when the attacker's next turn ends.</p>

<p>If you are building the token itself, open the <a href="${EN_EDITOR_PATH}">Token Maker editor</a> and keep the weapon-side hand visible enough that the character still reads as a duelist or skirmisher at small size. For quick dice checks away from the VTT, the <a href="${EN_DICE_ROLLER_PATH}">DnD dice roller</a> is a simple way to handle the attack and damage rolls while you track Vex timing next to the sheet.</p>

<h2 id="sources">Official Rules Sources</h2>
<ul>
  <li><a href="${DND_SHORTSWORD_2014_EQUIPMENT_URL}" rel="noreferrer noopener">2014 Basic Rules: Equipment and Weapons</a></li>
  <li><a href="${DND_SHORTSWORD_2014_ROGUE_URL}" rel="noreferrer noopener">2014 Basic Rules: Rogue and Sneak Attack</a></li>
  <li><a href="${DND_SHORTSWORD_2014_COMBAT_URL}" rel="noreferrer noopener">2014 Basic Rules: Two-Weapon Fighting</a></li>
  <li><a href="${DND_SHORTSWORD_2024_EQUIPMENT_URL}" rel="noreferrer noopener">2024 Free Rules: Equipment, Light, Nick, and Vex</a></li>
  <li><a href="${DND_SHORTSWORD_2024_ROGUE_URL}" rel="noreferrer noopener">2024 Free Rules: Rogue</a></li>
  <li><a href="${DND_SHORTSWORD_WEAPON_MASTERY_URL}" rel="noreferrer noopener">Official guide to Weapon Mastery</a></li>
</ul>

<h2 id="faq">FAQ About DnD Shortsword</h2>
<h3>Is a shortsword a simple or martial weapon?</h3>
<p>A shortsword is a martial melee weapon in both 2014 and 2024. A character still needs the right proficiency to add their Proficiency Bonus to attack rolls with it.</p>

<h3>Can you use Dexterity with a shortsword?</h3>
<p>Yes. Finesse lets you choose Dexterity or Strength for the attack, and you use the same ability for the damage roll on that attack.</p>

<h3>Can a shortsword trigger Sneak Attack?</h3>
<p>Yes. A shortsword qualifies for Sneak Attack because it has Finesse, but the Rogue still needs the normal Sneak Attack conditions.</p>

<h3>Does a shortsword have Nick in 2024?</h3>
<p>No. The shortsword has Vex, not Nick. Daggers and scimitars are the common Nick partners in a 2024 Light-weapon setup.</p>

<h3>Does Vex give Advantage on the same shortsword attack that hits?</h3>
<p>No. Vex does not give Advantage to the attack that triggered it. It waits for the next attack against the same target before the end of your next turn.</p>

<h3>Can you dual-wield a shortsword and rapier under the basic rules?</h3>
<p>Not through the normal Light extra-attack rule. The rapier is not Light, so the pair does not qualify unless another rule changes the requirements.</p>

<h3>Is a shortsword better than a rapier?</h3>
<p>It depends on the turn. A rapier is better for one stronger Finesse hit. A shortsword is better when Light weapon sequencing, Vex timing, or a dagger/scimitar follow-up matters.</p>

<h2 id="video">Official Companion Video</h2>
<p>For the wider 2024 Weapon Mastery picture, watch the <a href="${DND_SHORTSWORD_VIDEO_URL}" rel="noreferrer noopener">official Dungeons &amp; Dragons video on Weapon Mastery</a>. It is a good companion for the shortsword because Vex and Nick make more sense when you see the broader system once.</p>

${liteVideoEmbed('-nu-JmZ4joo', 'Official DnD 2024 Weapon Mastery video', {
  src: DND_SHORTSWORD_VIDEO_PLACEHOLDER_PATH,
  alt: 'Preview image for the official Dungeons & Dragons Weapon Mastery video used in the dnd shortsword guide',
})}
`;

export const dndShortswordArticleHtmlZh = String.raw`
<p><strong>dnd shortsword</strong> 要先确认短剑（Shortsword）在 2014 和 2024 规则里到底怎么用，Vex 和 Nick 怎么排顺序，偷袭（Sneak Attack）又是不是想触发就触发。短剑的数据看起来没怎么变，但真正让人混淆的，恰好是这些看似只差一行的小规则。</p>

<p><strong>短剑是一把军用近战武器，造成 1d6 穿刺伤害，价格 10 GP，重量 2 磅，并有灵巧（Finesse）和轻型（Light）属性。</strong> 2024 版在这些基础上，再加入武器掌握（Weapon Mastery）属性 Vex。</p>

<p>真正要记住的不是“新版更强”这种笼统印象，而是触发条件。<strong>Vex 只有在角色拥有能使用该武器掌握的特性或选项时才生效。</strong> 只有拿着武器，不代表角色就自动会用它的掌握效果。</p>

<h2 id="stats">2014 与 2024 的短剑数据</h2>
<table>
  <thead>
    <tr>
      <th>规则版本</th>
      <th>类别</th>
      <th>价格</th>
      <th>伤害</th>
      <th>重量</th>
      <th>属性</th>
      <th>掌握</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>2014 D&amp;D 5e</strong></td>
      <td>军用近战武器</td>
      <td>10 gp</td>
      <td>1d6 穿刺</td>
      <td>2 磅</td>
      <td>灵巧（Finesse）、轻型（Light）</td>
      <td>无</td>
    </tr>
    <tr>
      <td><strong>2024 D&amp;D</strong></td>
      <td>军用近战武器</td>
      <td>10 GP</td>
      <td>1d6 穿刺</td>
      <td>2 磅</td>
      <td>灵巧（Finesse）、轻型（Light）</td>
      <td>Vex</td>
    </tr>
  </tbody>
</table>

<p>伤害骰、价格、重量和基础属性都没变，真正新增的是 Vex。所以判断一把短剑值不值得选，不能只看“新版武器表多写了一行”，还要看角色本身能不能把这行规则用起来。你如果还在选职业方向，可以先看 <a href="${ZH_DND_CLASSES_PATH}">DND 职业指南</a>，确认自己做的是敏捷近战游荡者、战士、游侠，还是别的路线。</p>

<h2 id="changes">2024 短剑到底改了什么</h2>
<p>2014 版短剑的定位很稳定：灵巧、轻型、单手，能参与基础双武器战斗，也能满足游荡者偷袭对武器的要求。2024 版保留这个定位，并让短剑多了 Vex。</p>

<p>Vex 的关键是时机。它要求短剑先命中并造成伤害，然后才会让你在自己下一回合结束前，对同一目标的下一次攻击获得优势（Advantage）。<strong>Vex 不会让触发它的同一次攻击获得优势。</strong> 这一点如果记错，整套顺序就会连着错下去。</p>

<p>轻型（Light）的额外攻击也要单独记住。2024 规则把描述写得更清楚，但本质没有变成“白送伤害”。<strong>轻型武器的额外攻击通常不把属性调整值加到伤害上，除非该调整值为负数。</strong> Nick 只是把这一次额外攻击移进攻击动作，每回合只能这样做一次，并不会再多生出一次额外攻击。</p>

<p><strong>短剑的武器掌握是 Vex，不是 Nick。</strong> 这就是为什么 2024 版最常见的搭配不是“双短剑万用论”，而是短剑加匕首，或者短剑加弯刀。想看带投掷备用的轻型搭配，可以读 <a href="${ZH_DND_DAGGER_PATH}">DND 匕首指南</a>；如果你想反过来看一个不靠轻型额外攻击运转的一手武器，<a href="${ZH_DND_MACE_PATH}">DND 钉头锤指南</a> 也很适合拿来对比。</p>

<h2 id="finesse-light">灵巧与轻型怎么理解</h2>
<h3>灵巧不等于只能用敏捷</h3>
<p>灵巧（Finesse）允许你在力量和敏捷之间选择其一，用于这次攻击的攻击掷骰和伤害掷骰。同一次攻击里必须使用同一个属性，不能攻击用敏捷、伤害改力量。</p>

<p>短剑一直热门，还有一个原因是它能进游荡者的武器清单。<strong>短剑因为有灵巧属性而符合偷袭的武器要求，但游荡者（Rogue）仍然必须满足正常的 Sneak Attack 条件。</strong> 如果要说得更贴近实战一点，那就是：游荡者（Rogue）仍然必须满足当前规则版本下正常的 Sneak Attack 条件，而且偷袭本身还有每回合一次的限制。</p>

<h3>轻型真正关心的是那次额外攻击</h3>
<p>2014 规则里，你采取攻击动作，并用一手持有的轻型近战武器攻击后，可以用附赠动作再用另一手持有的不同轻型近战武器攻击一次。2024 规则把这段话写进轻型属性本身，但还是围绕“另一把不同的轻型武器”和“那次额外攻击通常不加正值属性调整值”来运行。</p>

<p>所以，轻型不代表你能拿同一把短剑把额外攻击也算掉。你需要另一把不同的轻型武器。两把短剑可以完成基本顺序；到了 2024 版，匕首和弯刀更常被拿来搭配，是因为它们能提供 Nick。</p>

<h2 id="vex-timing">Vex 的正确时机</h2>
<ol>
  <li>用可使用掌握属性的短剑攻击一个目标。</li>
  <li>命中并造成伤害。</li>
  <li>此时 Vex 才开始对这个目标生效。</li>
  <li>在你下一回合结束前，对同一目标的下一次攻击具有优势。</li>
  <li>只要那次攻击掷骰已经发生，不管命中还是失手，这次 Vex 都算用完。</li>
</ol>

<p>要再次强调一次：<strong>Vex 不会让触发它的同一次攻击获得优势。</strong> 触发它的那一剑如果原本没有别的优势来源，就照常掷骰。</p>

<p>Vex 还会绑定目标。你先打中食人魔，再去打邪教徒，优势不会自动转移。它会继续挂在原本被短剑伤到的目标身上，直到被用掉或过期。</p>

<h2 id="vex-nick">Vex 和 Nick 怎么排顺序</h2>
<p>最容易理解的例子，是短剑加匕首。短剑负责 Vex，匕首负责 Nick。</p>

<p>下面的顺序有一个前提：角色能使用这两种武器的掌握属性。武器表上印着掌握名称，本身不会让效果自动生效。</p>

<ol>
  <li>采取攻击动作，先用短剑攻击目标。</li>
  <li>如果短剑命中并造成伤害，Vex 对该目标生效。</li>
  <li>用匕首的 Nick，把轻型武器的额外攻击移进同一个攻击动作。</li>
  <li>匕首继续攻击同一目标，这次攻击从 Vex 获得优势。</li>
  <li>这次额外攻击通常不把正值属性调整值加到伤害上，除非其他规则明确允许。</li>
  <li>因为 Nick 已经把额外攻击移进攻击动作，所以附赠动作还能保留。</li>
</ol>

<p>如果第一次短剑攻击失手，轻型顺序仍然可能继续，但没有 Vex 优势可用。如果短剑命中了，你却把 Nick 攻击转向另一个敌人，那次攻击同样吃不到 Vex，因为 Vex 还留在第一个目标身上。</p>

<p>这套顺序不会多出第三次攻击。轻型只给一次额外攻击，Nick 只改它在回合里的位置。</p>

<h2 id="sneak-attack">游荡者能用短剑偷袭吗</h2>
<p>可以。<strong>短剑因为有灵巧属性而符合偷袭的武器要求，但游荡者（Rogue）仍然必须满足正常的 Sneak Attack 条件。</strong> 这句话本身就已经比很多桌上的口头简化更准确了。</p>

<p>真正要避免的误解是把“可以用于偷袭”听成“这一剑自动带偷袭伤害”。你仍然需要满足当前规则版本中的正常 Sneak Attack 条件，也仍然要遵守每回合一次的使用限制。</p>

<p>在 2024 规则里，如果角色真的能使用短剑的武器掌握（Weapon Mastery），Vex 可以帮助后面的那次攻击拿到优势。第一剑短剑先命中并造成伤害，第二剑再用带 Nick 的匕首或弯刀攻击同一目标，这才是比较常见的短剑偷袭节奏。</p>

<p>具体职业原文建议直接对照 <a href="${DND_SHORTSWORD_2014_ROGUE_URL}" rel="noreferrer noopener">2014 游荡者规则</a> 和 <a href="${DND_SHORTSWORD_2024_ROGUE_URL}" rel="noreferrer noopener">2024 游荡者规则</a>。</p>

<h2 id="comparison">短剑 vs 细剑、匕首、弯刀</h2>
<table>
  <thead>
    <tr>
      <th>武器</th>
      <th>伤害</th>
      <th>关键属性</th>
      <th>2024 掌握</th>
      <th>最适合的理由</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>短剑</strong></td>
      <td>1d6 穿刺</td>
      <td>灵巧（Finesse）、轻型（Light）</td>
      <td>Vex</td>
      <td>在保留轻型武器顺序的同时，为下一击铺出优势。</td>
    </tr>
    <tr>
      <td><strong>细剑</strong></td>
      <td>1d8 穿刺</td>
      <td>灵巧（Finesse）</td>
      <td>Vex</td>
      <td>适合只想要一把更高基础伤害的一手灵巧武器。</td>
    </tr>
    <tr>
      <td><strong>匕首</strong></td>
      <td>1d4 穿刺</td>
      <td>灵巧（Finesse）、轻型（Light）、投掷（Thrown）</td>
      <td>Nick</td>
      <td>既能近战也能投掷，还能把轻型额外攻击移进攻击动作。</td>
    </tr>
    <tr>
      <td><strong>弯刀</strong></td>
      <td>1d6 斩击</td>
      <td>灵巧（Finesse）、轻型（Light）</td>
      <td>Nick</td>
      <td>保留 d6，同时和短剑组成很干净的 Vex/Nick 搭配。</td>
    </tr>
  </tbody>
</table>

<p><a href="${ZH_RAPIER_DND_PATH}">DND 细剑指南</a>说明了单武器灵巧近战为什么会看重 1d8。短剑真正强的地方，不是单看伤害骰，而是它在 2024 规则里能把 Vex 接进下一次攻击。匕首则用较小的伤害骰，换到投掷和 Nick。弯刀是想保留双 d6 时最顺手的搭档。</p>

<h2 id="situations">什么场景该选短剑</h2>
<table>
  <thead>
    <tr>
      <th>场景</th>
      <th>实用选择</th>
      <th>原因</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>只想做一把武器的敏捷近战攻击。</td>
      <td>有熟练时优先考虑细剑。</td>
      <td>既然不用轻型额外攻击，1d8 的价值会更直接。</td>
    </tr>
    <tr>
      <td>2014 规则下想走双轻型武器。</td>
      <td>两把短剑，或短剑加另一把轻型近战武器。</td>
      <td>这样最符合标准的附赠动作攻击顺序。</td>
    </tr>
    <tr>
      <td>2024 规则下想先上 Vex，再接 Nick。</td>
      <td>先短剑，再匕首或弯刀。</td>
      <td>短剑命中后能给后续 Nick 攻击铺优势。</td>
    </tr>
    <tr>
      <td>需要一个随手可投的备用方案。</td>
      <td>短剑加匕首。</td>
      <td>匕首提供投掷与 Nick，代价是较小的伤害骰。</td>
    </tr>
    <tr>
      <td>想保留两把 d6 并顺手换伤害类型。</td>
      <td>短剑加弯刀。</td>
      <td>一把是 Vex，一把是 Nick，而且都还是轻型武器。</td>
    </tr>
    <tr>
      <td>角色不能使用武器掌握。</td>
      <td>只按灵巧、轻型、熟练项和伤害来判断。</td>
      <td>武器表上写着 Vex，不代表角色实际就能启用它。</td>
    </tr>
  </tbody>
</table>

<h2 id="mistakes">常见错误</h2>
<ul>
  <li><strong>把灵巧理解成必须用敏捷。</strong> 灵巧让你在力量和敏捷之间二选一，并把同一个属性用于攻击和伤害。</li>
  <li><strong>让 Vex 作用到触发它的同一击。</strong> 先命中、先造成伤害，Vex 才会等下一次攻击。</li>
  <li><strong>没有武器掌握也直接用 Vex。</strong> 武器表不是角色特性，角色本身还得能使用这项掌握。</li>
  <li><strong>把短剑误记成 Nick 武器。</strong> 短剑的武器掌握是 Vex，不是 Nick。</li>
  <li><strong>认为 Nick 会多送一次轻型额外攻击。</strong> 它只是在每回合一次的范围内，改变那次额外攻击的位置。</li>
  <li><strong>默认把正值属性调整值加到轻型额外攻击伤害上。</strong> 轻型武器的额外攻击通常不把属性调整值加到伤害上，除非该调整值为负数。</li>
  <li><strong>把“武器合格”理解成“偷袭自动成立”。</strong> 资格和触发条件不是一回事。</li>
  <li><strong>临时把 2014 和 2024 规则拼在一起用。</strong> 2014 短剑没有 Vex，2024 的轻型/Nick 也不该随手套回旧版角色。</li>
</ul>

<h2 id="vtt">在 VTT 里跟踪短剑与 Vex</h2>
<p>Vex 上桌以后最容易丢的是“到底标了谁”。最省心的做法，是把标记放在目标身上，而且带上攻击者名字。短剑命中并造成伤害后，就在那个目标上挂一个状态标记；等该角色下一次对它进行攻击掷骰后，不管命中还是失手，都立刻清掉。若到了攻击者下回合结束仍未使用，也要移除。</p>

<p>如果你还没做角色棋子，可以直接去 <a href="${ZH_EDITOR_PATH}">Token Maker 编辑器</a> 把人物头像和持武器的手裁得更清楚一点，小尺寸下也更容易一眼看出是短剑近战角色。临时不在 VTT 里时，用 <a href="${ZH_DICE_ROLLER_PATH}">Dice Roller</a> 掷 d20 和武器伤害骰，再把 Vex 的时限记在角色卡旁边，通常就够用了。</p>

<h2 id="sources">官方规则来源</h2>
<ul>
  <li><a href="${DND_SHORTSWORD_2014_EQUIPMENT_URL}" rel="noreferrer noopener">2014 基础规则：装备与武器</a></li>
  <li><a href="${DND_SHORTSWORD_2014_ROGUE_URL}" rel="noreferrer noopener">2014 基础规则：游荡者与偷袭</a></li>
  <li><a href="${DND_SHORTSWORD_2014_COMBAT_URL}" rel="noreferrer noopener">2014 基础规则：双武器战斗</a></li>
  <li><a href="${DND_SHORTSWORD_2024_EQUIPMENT_URL}" rel="noreferrer noopener">2024 免费规则：装备、轻型、Nick 与 Vex</a></li>
  <li><a href="${DND_SHORTSWORD_2024_ROGUE_URL}" rel="noreferrer noopener">2024 免费规则：游荡者</a></li>
  <li><a href="${DND_SHORTSWORD_WEAPON_MASTERY_URL}" rel="noreferrer noopener">官方武器掌握指南</a></li>
</ul>

<h2 id="faq">DND 短剑常见问题</h2>
<h3>短剑是简易武器还是军用武器？</h3>
<p>短剑在 2014 和 2024 规则里都是军用近战武器。角色仍然需要相应熟练，才能把熟练加值加到攻击掷骰上。</p>

<h3>短剑可以用敏捷攻击吗？</h3>
<p>可以。灵巧（Finesse）允许你选择力量或敏捷，并把同一个属性同时用于这次攻击的攻击掷骰和伤害掷骰。</p>

<h3>短剑能触发偷袭吗？</h3>
<p>可以。短剑因为有灵巧属性而符合偷袭的武器要求，但游荡者（Rogue）仍然必须满足正常的 Sneak Attack 条件。</p>

<h3>2024 短剑有 Nick 吗？</h3>
<p>没有。短剑的武器掌握是 Vex，不是 Nick。匕首和弯刀才是常见的 Nick 搭配。</p>

<h3>Vex 会让刚才命中的短剑攻击获得优势吗？</h3>
<p>不会。Vex 不会让触发它的同一次攻击获得优势。它帮助的是你在时限内对同一目标做出的下一次攻击。</p>

<h3>短剑和细剑可以走普通双持顺序吗？</h3>
<p>通常不行。短剑是轻型（Light），细剑不是，所以这组武器不满足基础的轻型额外攻击要求，除非其他规则明确改变条件。</p>

<h3>短剑一定比细剑好吗？</h3>
<p>不一定。细剑适合单武器灵巧近战，短剑更适合需要轻型顺序、Vex 或匕首/弯刀后续攻击的回合。</p>

<h2 id="video">官方配套视频</h2>
<p>如果你想把短剑放回整个 2024 武器掌握体系里一起看，这支 <a href="${DND_SHORTSWORD_VIDEO_URL}" rel="noreferrer noopener">Dungeons &amp; Dragons 官方武器掌握视频</a> 很值得搭配正文一起看。看完再回到短剑，会更容易理解为什么 Vex 和 Nick 必须拆开记。</p>

${liteVideoEmbed('-nu-JmZ4joo', 'DND 短剑（Shortsword）官方武器掌握视频', {
  src: DND_SHORTSWORD_VIDEO_PLACEHOLDER_PATH,
  alt: 'DND 短剑指南所用的官方武器掌握视频预览图',
})}
`;
