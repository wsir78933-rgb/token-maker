import {
  DND_FIGHTER_TURN_PLAN_IMAGE_PATH,
  EN_DND_ARMOR_PATH,
  EN_DND_CLASSES_PATH,
  EN_DND_GLAIVE_PATH,
  EN_DND_STATS_PATH,
  EN_EDITOR_PATH,
  ZH_DND_ARMOR_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_DND_GLAIVE_PATH,
  ZH_DND_STATS_PATH,
  ZH_EDITOR_PATH,
} from './shared';

export const dndFighterArticleHtml = String.raw`
<p>The DnD Fighter is for players who want weapons, armor, and a reliable answer when initiative starts. It can hold a doorway, break a dangerous target with a heavy weapon, or control distance with a bow. The tricky part is deciding when each Weapon Mastery effect and limited feature matters.</p>

<p>For a level 1 Fighter, make five choices in order: Strength or Dexterity, party job, armor, main weapon, then Fighting Style and Weapon Mastery. Do those in the wrong order and the sheet starts pulling in two directions. Do them in this order and your first combat turn already has a plan. This guide uses the 2024 rules first and calls out the 2014 differences where they change a decision.</p>

<h2>DnD Fighter at a glance</h2>
<p>The 2024 Fighter uses Strength or Dexterity as its primary ability and a d10 Hit Point Die. It has proficiency with simple and martial weapons, all armor, and shields. That broad training lets you choose a narrow job without the class blocking you.</p>

<table><thead><tr><th scope="col">Choice</th><th scope="col">Practical answer for a new Fighter</th></tr></thead><tbody>
<tr><th scope="row">Primary ability</th><td>Strength for heavy weapons and heavy armor; Dexterity for bows, Finesse weapons, Initiative, and lighter armor</td></tr>
<tr><th scope="row">Second ability</th><td>Constitution for hit points and Constitution saves</td></tr>
<tr><th scope="row">Level 1 features</th><td>Fighting Style, Second Wind, and three Weapon Mastery choices</td></tr>
<tr><th scope="row">First combat job</th><td>Hold space, pressure one target, or attack safely from range</td></tr>
<tr><th scope="row">First subclass decision</th><td>Arrives at Fighter level 3</td></tr>
</tbody></table>

<p>The official <a href="https://www.dndbeyond.com/classes/2190879-fighter" rel="noreferrer noopener">2024 Fighter class details</a> list the complete progression. For session one, focus on what your current features ask you to decide. You do not need a level-20 plan before choosing your starting weapon. You do need to know what your character will do when an enemy reaches the party.</p>

<h2>Choose Strength or Dexterity before choosing gear</h2>
<p>Strength and Dexterity Fighters both make weapon attacks, but they solve different problems. The choice affects your usual weapon, armor calculation, skills, and the map positions that feel comfortable.</p>

<p>A Strength Fighter gets the most from heavy melee weapons, heavy armor, and Athletics. Pick it to stand near enemies, make space for allies, and use weapons such as a greatsword, maul, or glaive. Heavy armor removes Dexterity from the Armor Class calculation, though Dexterity still affects Initiative and common saves. A shield-and-weapon build can stay in a choke point; a two-handed build gives up the shield for a larger weapon and a more aggressive reach or damage plan.</p>

<p>A Dexterity Fighter gets strong ranged attacks, better Initiative, useful skills, and good Armor Class in light armor. Pick it for a longbow user, Finesse duelist, or scout. Dexterity also helps Stealth and the saving throws that often accompany area effects. Do not spend the build's best score on Strength-only weapons out of habit. A longbow plan works because Dexterity drives the attack rolls you expect to make most often.</p>

<p>Do not make both scores equally high at level 1. Raise the ability behind your usual attack, then give Constitution the next strong number. Let skills, background, and subclass plans place the rest. If a later multiclass or feat really needs a second high physical ability, write down the prerequisite and plan for it instead of weakening every level-1 turn for a possible future idea.</p>

<p>If the ability modifiers still feel abstract, the <a href="${EN_DND_STATS_PATH}">DnD ability score guide</a> shows how scores, modifiers, and proficiency work together. For a Fighter, the immediate question is simple: which ability modifier will appear on most of your attack rolls?</p>

<h2>Finish a level 1 DnD Fighter in five steps</h2>

<h3>1. Write down one combat job</h3>
<p>Use a sentence, not a build label. "I keep two enemies away from the Wizard" tells you more than "I am a tank." A ranged Fighter might write, "I slow the target chasing our back line." A heavy-weapon Fighter might write, "I help remove one dangerous enemy early."</p>

<p>This sentence is the check for every choice that follows. When a weapon mastery, fighting style, or armor option looks attractive, ask whether it helps you do that job. If it does not, it may still be fun, but you are choosing a different role and should say so before the rest of the party builds around you.</p>

<h3>2. Assign the primary ability and Constitution</h3>
<p>With the standard array, put 15 in Strength or Dexterity and 14 in Constitution before background increases. Strength 15 fits a shield defender or heavy-weapon build; Dexterity 15 fits an archer or Finesse build. A 2024 background can raise eligible abilities, so treat these as starting points rather than a final character sheet.</p>

<p>Constitution is the usual second priority because a Fighter expects to take hits and make Constitution saving throws. It does not replace the attack ability. A Fighter who misses often cannot hold a line just by having more hit points, and a Fighter with a good attack modifier still needs enough durability to stay in the encounter. The standard array gives you room for both without pretending every ability must be equally strong.</p>

<h3>3. Match armor to the build</h3>
<p>A Strength Fighter can use heavy armor without Dexterity for Armor Class. A Dexterity Fighter usually wears light armor, or medium armor when its Dexterity cap and Stealth tradeoff fit. A shield raises defense but occupies a hand. That matters for a two-handed weapon, a bow, and any plan that expects to switch equipment during a fight.</p>

<p>Check the <a href="${EN_DND_ARMOR_PATH}">DnD armor table</a> before buying around an Armor Class number you cannot actually reach. Chain mail looks different from a Dexterity build in studded leather, and the difference is not just the number on the character sheet. Heavy armor can make a low-Dex frontliner sturdy; light armor lets a Dexterity Fighter keep Initiative and Stealth in the same plan.</p>

<h3>4. Pick a main weapon and a backup</h3>
<p>Match the main weapon to the combat job and primary ability. A greatsword Fighter still needs a ranged option. An archer needs a Finesse backup for an enemy who reaches melee. A shield defender needs a weapon that works in one hand. Write both weapons on the sheet before the first fight, including the attack bonus and damage expression for each.</p>

<p>Weapon Mastery makes this more than a damage-die comparison. Slow reduces a hit creature's Speed by 10 feet. Push can move a Large-or-smaller creature up to 10 feet straight away from you. Sap weakens its next attack. Topple forces a Constitution save; on a failure, the target is Prone, so attacks within 5 feet have Advantage. Choose effects the party can use. A mastery that creates an opening for the Rogue or keeps a creature away from the Cleric can be worth more than a tiny difference in average weapon damage.</p>

<p>A reach weapon also changes where you can stand. If you are considering one, the <a href="${EN_DND_GLAIVE_PATH}">glaive guide</a> explains how Reach affects attacks and opportunity attacks. Reach is useful when the table tracks positions; it does not turn a melee weapon into a ranged weapon.</p>

<h3>5. Add Fighting Style, Second Wind, and mastery notes</h3>
<p>Choose a Fighting Style you will use often. Archery fits a longbow. Defense works with any armored setup. Dueling supports a one-handed weapon, including one paired with a shield. Protection is a reaction, not a standing benefit: while holding a shield, when a creature you can see attacks another target within 5 feet of you, impose Disadvantage on the triggering attack and on other attacks against that target until the start of your next turn if you remain within 5 feet of it. A style is easier to use when it follows from the job you wrote in step one.</p>

<p>Second Wind is a Bonus Action that restores <code>1d10 + Fighter level</code> Hit Points. At level 1, you have two uses, regain one after a Short Rest, and regain all after a Long Rest. Put the healing amount and use boxes where you can see them. It is easy to remember the feature exists and still forget that it competes for your Bonus Action on a busy turn.</p>

<table><thead><tr><th scope="col">Build direction</th><th scope="col">Ability</th><th scope="col">Gear idea</th><th scope="col">Fighting Style</th><th scope="col">Mastery purpose</th></tr></thead><tbody>
<tr><th scope="row">Shield defender</th><td>Strength, then Constitution</td><td>One-handed weapon, shield, heavy armor</td><td>Defense or Dueling</td><td>Sap, Push, or Topple to protect space</td></tr>
<tr><th scope="row">Ranged controller</th><td>Dexterity, then Constitution</td><td>Longbow, light armor, Finesse backup</td><td>Archery</td><td>Slow at range, Vex or another backup effect in melee</td></tr>
</tbody></table>

<p>These are directions, not mandatory builds. A Fighter can carry more than one weapon mastery choice, so choose a primary plan and one response for a situation that disrupts it. A bow does not solve every cramped dungeon room, and a heavy weapon does not solve every flying enemy.</p>

<h2>Use a five-question Fighter turn plan</h2>
<p>Extra attacks do not help if they land on the wrong target from the wrong square. At the start of each turn, answer five questions. You do not need to say them aloud every round. The point is to make movement, target choice, Weapon Mastery, and limited resources part of one decision instead of four separate habits.</p>

<img class="inline-article-image" src="${DND_FIGHTER_TURN_PLAN_IMAGE_PATH}" alt="A DnD Fighter planning position, target, weapon mastery, Action Surge, and Second Wind on a battle grid" loading="lazy" decoding="async" fetchpriority="low" width="1536" height="1024" />

<h3>1. What must be true when my turn ends?</h3>
<p>Name the result before moving: drop the wounded enemy, hold the corridor, break the archer's line of sight, or create an opening for the Rogue. This ties movement and mastery to the encounter. "Do as much damage as possible" is sometimes the answer, but it is not the only useful answer.</p>

<h3>2. Where should I stand after attacking?</h3>
<p>The final square matters. Leave melee access for allies and do not block the party's escape. With a reach weapon, decide whether the extra distance protects you, protects an ally, or controls an approach. The <a href="${EN_DND_GLAIVE_PATH}">glaive guide</a> covers that positioning. If you use a bow, ask whether moving now will keep an enemy from reaching you next turn.</p>

<h3>3. Which mastery effect helps this target?</h3>
<p>Use the effect that changes the next decision. Slow reduces a hit creature's Speed by 10 feet. Push can send a Large-or-smaller creature up to 10 feet straight away, which matters near hazards, doorways, and ongoing areas. Sap matters when one enemy's next attack is dangerous. Topple calls for a Constitution save; a failed save leaves the target Prone, giving attacks within 5 feet Advantage. Three mastery choices can improve more than your damage roll, but only if you use the one that matters on this map.</p>

<h3>4. Does Action Surge change the encounter now?</h3>
<p>At level 2, Action Surge grants one additional action on your turn, except the Magic action. It returns after a Short or Long Rest. Spend it to remove a priority target before it acts, free an ally, operate an objective, or establish control before enemies spread out. The extra action can be more valuable for an objective or a rescue than for another ordinary attack sequence.</p>

<p>Waiting for a perfect boss moment can mean never using Action Surge. Ask what the extra action accomplishes that the normal action cannot. If the answer is "the same target takes a little more damage," saving it may be reasonable. If the answer is "the enemy never reaches the downed ally," the moment is probably already here.</p>

<h3>5. Is Second Wind worth my Bonus Action?</h3>
<p>Use Second Wind when its healing lets you hold position through the next enemy turn and your Bonus Action is free. One hit from dropping is often too late. Do not treat every missing hit point as an emergency, either. A Second Wind spent when the party can end the fight before the enemy acts has a different value from one spent while you are the only character keeping a dangerous creature away from the back line.</p>

<p>At level 2, Tactical Mind lets you add <code>1d10</code> to any failed ability check by spending Second Wind; the use is spent only if the check succeeds. At level 5, whenever you activate Second Wind with a Bonus Action, Tactical Shift also lets you move up to half your Speed without provoking Opportunity Attacks. It is not a separate movement-only spend. One resource now covers healing and a failed check, with movement added when you use Second Wind as a Bonus Action. Keep enough information on your sheet to notice which use is best before you spend it.</p>

<h2>Know the Fighter milestones that change play</h2>
<table><thead><tr><th scope="col">Fighter level</th><th scope="col">Feature</th><th scope="col">What changes at the table</th></tr></thead><tbody>
<tr><th scope="row">2</th><td>Action Surge, Tactical Mind</td><td>You gain a burst action and a way to rescue any failed ability check with Second Wind</td></tr>
<tr><th scope="row">3</th><td>Fighter subclass</td><td>Your build gains its defining specialization</td></tr>
<tr><th scope="row">5</th><td>Extra Attack, Tactical Shift</td><td>Two attacks per Attack action and safer movement after Second Wind</td></tr>
<tr><th scope="row">9</th><td>Indomitable, Tactical Master</td><td>Stronger failed-save recovery and flexible mastery effects</td></tr>
<tr><th scope="row">11</th><td>Two Extra Attacks</td><td>Three attacks whenever you take the Attack action</td></tr>
<tr><th scope="row">13</th><td>Studied Attacks</td><td>A miss can set up Advantage on the next attack against that creature before the end of your next turn</td></tr>
<tr><th scope="row">20</th><td>Three Extra Attacks</td><td>Four attacks whenever you take the Attack action</td></tr>
</tbody></table>

<p>Extra Attack changes the value of a good target and a good position because one Attack action now contains more than one attack. It does not remove the need to choose the right enemy. A Fighter who spends two attacks on a target the party has already contained may give up the chance to stop a more dangerous creature from acting.</p>

<p>Indomitable also deserves a note on the character sheet. In the 2024 version, you reroll a failed saving throw with a bonus equal to your Fighter level. It is a recovery tool for the saves that would take you out of the fight or stop you from doing your job. Studied Attacks rewards attention after a miss, but its Advantage on the next attack against that creature expires at the end of your next turn.</p>

<p>The Fighter gets more feat opportunities than most classes. Let the first sessions reveal whether you need accuracy, defense, movement, control, or more to do outside combat. A feat choice is easier when it answers something the table has actually shown you, rather than a problem that only exists in a build video.</p>

<h2>Pick a subclass by desired complexity</h2>
<p>The 2024 Player's Handbook options cover different amounts of rules overhead. Pick the one whose extra decisions you want to make, not the one that merely looks strongest when every ability is available at once.</p>

<ul>
<li><strong>Champion</strong> keeps the core loop direct without adding a large menu of maneuvers. It suits a player who wants weapon choices and positioning to carry most of the turn.</li>
<li><strong>Battle Master</strong> adds tactical choices through maneuvers and superiority dice. Pick it if choosing the right effect each turn sounds fun and you are willing to track another resource.</li>
<li><strong>Eldritch Knight</strong> adds spellcasting for defense, utility, and a spellblade identity. It asks you to learn spell timing as well as weapon timing.</li>
<li><strong>Psi Warrior</strong> adds psionic movement, damage, and protection. It rewards tracking another resource and reading the battlefield.</li>
</ul>

<p>Do not choose Battle Master because you think a Fighter must become complicated, and do not choose Champion because someone said it is only for beginners. The better question is whether the subclass creates choices you will enjoy making for an entire campaign. The <a href="${EN_DND_CLASSES_PATH}">DnD classes guide</a> helps if Fighter is still competing with Barbarian, Paladin, or Ranger.</p>

<h2>Keep 2014 and 2024 Fighter rules separate</h2>
<p>Both versions use the same class fantasy, but several familiar features changed. Write the rules year on the character sheet before using an old guide, a video, or a character builder.</p>

<table><thead><tr><th scope="col">Rule</th><th scope="col">2014 Fighter</th><th scope="col">2024 Fighter</th></tr></thead><tbody>
<tr><th scope="row">Weapon Mastery</th><td>Not a core class feature</td><td>Three mastery choices at level 1, increasing later</td></tr>
<tr><th scope="row">Second Wind at level 1</th><td>One use per Short or Long Rest</td><td>Two uses; regain one on a Short Rest and all on a Long Rest</td></tr>
<tr><th scope="row">Tactical Mind and Tactical Shift</th><td>Not present</td><td>Added at levels 2 and 5</td></tr>
<tr><th scope="row">Action Surge</th><td>Additional action without the 2024 Magic-action restriction</td><td>Additional action cannot be the Magic action</td></tr>
<tr><th scope="row">Indomitable</th><td>Reroll a failed save</td><td>Reroll with a bonus equal to Fighter level</td></tr>
</tbody></table>

<p>Do not import Weapon Mastery into a 2014 character just because the weapon table looks familiar. Do not give a 2024 Fighter only one level-1 Second Wind use. The easiest way to avoid a mixed character is to name the rules source at the top of the sheet and check feature text whenever an older build guide gives a different action cost or timing.</p>

<p>Use the <a href="https://www.dndbeyond.com/classes/10-fighter" rel="noreferrer noopener">2014 Fighter reference</a> for that ruleset and the <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-classes" rel="noreferrer noopener">2024 Basic Rules class section</a> for a 2024 game. Source labels are more useful than trying to remember which version a rule came from during combat.</p>

<h2>Make the Fighter readable on a VTT grid</h2>
<p>A Fighter token needs a strong silhouette more than a detailed background. Keep the face and signature gear inside the crop, use a distinct border color, and test it at grid size. A greatsword, shield, bow, or glaive can tell the table what role the character has before anyone opens the sheet.</p>

<p>Once the sheet is ready, <a href="${EN_EDITOR_PATH}">open Token Maker</a>, start with the Warrior preset, adjust the crop, and export the PNG. It should stay recognizable when four tokens crowd one doorway. Put map information such as Second Wind uses, reach, or a temporary effect in a separate token marker rather than trying to hide it inside the portrait.</p>

<h2>DnD Fighter FAQ</h2>
<h3>Is Fighter a good class for a DnD beginner?</h3>
<p>Yes. The Fighter's basic turn can stay direct: move, choose a target, and attack. Champion keeps later choices lighter, while Battle Master, Eldritch Knight, and Psi Warrior let a player add more tactical or magical complexity.</p>

<h3>Should a Fighter use Strength or Dexterity?</h3>
<p>Use Strength for heavy melee weapons, heavy armor, and Athletics. Use Dexterity for bows, Finesse weapons, Initiative, Dexterity skills, and light armor. Raise the ability that powers the attacks you plan to make most often.</p>

<h3>What is the best Fighting Style for a Fighter?</h3>
<p>There is no universal best choice. Archery supports ranged accuracy, Defense works with any armored setup, Dueling supports a one-handed weapon, and Protection supports an adjacent ally. Match the style to a job the character performs every round.</p>

<h3>How many attacks does a Fighter get?</h3>
<p>A Fighter normally makes one attack with the Attack action at levels 1-4, two at levels 5-10, three at levels 11-19, and four at level 20. Action Surge can provide another action, but it is a limited resource.</p>

<h3>Can a DnD Fighter cast spells?</h3>
<p>An Eldritch Knight can cast spells through its subclass features. Other Fighters can gain limited magic from feats or multiclassing. Under the 2024 rules, the extra action from Action Surge cannot be the Magic action.</p>

<h3>What changed for Fighter in the 2024 rules?</h3>
<p>The largest changes include Weapon Mastery, more uses for Second Wind, Tactical Mind, Tactical Shift, a stronger Indomitable, and Studied Attacks. Action Surge also gained a restriction that prevents its extra action from being the Magic action.</p>

<h2>Sources</h2>
<ul>
<li><a href="https://www.dndbeyond.com/classes/2190879-fighter" rel="noreferrer noopener">D&amp;D Beyond: 2024 Fighter class details</a></li>
<li><a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-classes" rel="noreferrer noopener">D&amp;D Beyond: 2024 Basic Rules character classes</a></li>
<li><a href="https://www.dndbeyond.com/classes/10-fighter" rel="noreferrer noopener">D&amp;D Beyond: 2014 Fighter class</a></li>
<li><a href="https://roll20.net/compendium/dnd5e/Fighter" rel="noreferrer noopener">Roll20 Compendium: 2014 Fighter</a></li>
</ul>
`;

export const dndFighterArticleHtmlZh = String.raw`
<p>DND 战士适合想用武器、护甲和稳定回合来解决战斗的玩家。你可以守住门口，用重型武器压制危险目标，或用弓控制距离。真正需要判断的是：这一回合该让哪种武器精通效果和有限资源发挥作用。</p>

<p>建 1 级战士时，按五个顺序做决定：先选力量还是敏捷，再定队伍职责、护甲、主武器，最后选战斗风格和武器精通。顺序乱了，角色卡会把你往两个方向拉；顺序对了，第一次战斗就有行动计划。本文以 2024 规则为主，并在会影响选择处标明 2014 规则差异。</p>

<h2>DND 战士速览</h2>
<p>2024 战士以力量或敏捷为主要属性，生命骰是 d10，熟练使用简易和军用武器、所有护甲与盾牌。这些广泛训练让你能选一个明确职责，而不会被职业本身拦住。</p>

<table><thead><tr><th scope="col">选择</th><th scope="col">给新手战士的实用答案</th></tr></thead><tbody>
<tr><th scope="row">主要属性</th><td>力量适合重型武器与重甲；敏捷适合弓、灵巧武器、先攻与轻甲</td></tr>
<tr><th scope="row">第二属性</th><td>体质，影响生命值与体质豁免</td></tr>
<tr><th scope="row">1 级能力</th><td>战斗风格、第二风，以及三种武器精通选择</td></tr>
<tr><th scope="row">第一份战斗职责</th><td>守住空间、压制一个目标，或在远处安全攻击</td></tr>
<tr><th scope="row">第一次子职业选择</th><td>战士 3 级</td></tr>
</tbody></table>

<p><a href="https://www.dndbeyond.com/classes/2190879-fighter" rel="noreferrer noopener">2024 战士职业详情</a>列出了完整升级表。第一场游戏前，先关注现有能力要求你做什么决定。你不用先写好 20 级构筑，但要知道敌人冲向队伍时角色会怎么做。</p>

<h2>先选力量还是敏捷，再决定装备</h2>
<p>力量战士和敏捷战士都能做武器攻击，但解决的问题不同。这个选择会影响常用武器、护甲计算、技能，以及你在地图上愿意站的位置。</p>

<p>力量战士最能发挥重型近战武器、重甲和运动（Athletics）。想贴近敌人、为队友腾出空间，或使用巨剑、巨锤、长柄刀时，选力量。重甲计算护甲等级时不加敏捷，但敏捷仍影响先攻和常见豁免。单手武器加盾牌能守住狭口；双手武器则用盾牌换取更积极的伤害或触及武器计划。</p>

<p>敏捷战士有稳定的远程攻击、更高先攻、实用技能，以及轻甲中的不错护甲等级。长弓手、灵巧决斗者或斥候路线都适合敏捷。敏捷也帮助隐匿和经常伴随范围效果的豁免。不要因为习惯就把最高属性给只能用力量的武器；长弓路线成立，是因为敏捷会加到你最常做的攻击检定上。</p>

<p>1 级不用把力量和敏捷都堆高。先提高常用攻击所依赖的属性，再把第二个高数值给体质。技能、背景和子职业计划再决定剩余属性。以后真的需要第二个高物理属性来满足专长或多职业前置时，写下目标并安排升级，不要为了一个还没发生的想法削弱每个 1 级回合。</p>

<p>如果属性调整值还显得抽象，可以看<a href="${ZH_DND_STATS_PATH}">DND 属性指南</a>，了解属性值、调整值和熟练加值怎样配合。对战士而言，眼下只要问一句：我大多数攻击检定会用哪个属性调整值？</p>

<h2>用五步完成 1 级 DND 战士</h2>

<h3>1. 写下一句战斗职责</h3>
<p>写一句话，不要只写构筑标签。“我把两个敌人挡在法师外面”比“我是坦克”更有用。远程战士可以写“我减慢追向后排的目标”；重武器战士可以写“我优先清掉一个危险敌人”。</p>

<p>后面的每个选择都用这句话检查。某个武器精通、战斗风格或护甲选项看起来很强时，先问它是否帮你完成这份职责。若不能，它仍可能好玩，但你选的是另一种队伍角色，最好在队友围绕你的职责建卡前说清楚。</p>

<h3>2. 分配主要属性和体质</h3>
<p>使用标准数组时，先把 15 放在力量或敏捷，把 14 放在体质，再处理背景带来的提升。力量 15 适合持盾防守者或重武器路线；敏捷 15 适合弓手或灵巧路线。2024 背景会提高符合条件的属性，所以这些是起点，不是最终角色卡。</p>

<p>体质通常排第二，因为战士预计会挨打，也常做体质豁免。但它不能取代攻击属性。老是打不中的战士，单靠更多生命值守不住战线；攻击调整值不错的战士，也需要足够耐久才能留在战斗里。标准数组足以兼顾两边，不需要把每项属性都假装成同样重要。</p>

<h3>3. 让护甲匹配构筑</h3>
<p>力量战士能穿重甲，并且护甲等级不依赖敏捷。敏捷战士通常穿轻甲；当敏捷上限和隐匿取舍合适时，也可以穿中甲。盾牌提高防御，却占用一只手，这会影响双手武器、弓和战斗中切换装备的计划。</p>

<p>在围绕某个护甲等级购物前，先看<a href="${ZH_DND_ARMOR_PATH}">DND 护甲表</a>，确认自己真的能达到那个数值。锁子甲和镶钉皮甲不只是角色卡上的数字不同：重甲能让低敏捷前排更耐打，轻甲则让敏捷战士把先攻和隐匿放进同一套计划里。</p>

<h3>4. 选主武器和备用武器</h3>
<p>让主武器服务战斗职责和主要属性。巨剑战士仍需要远程选项；弓手需要灵巧备用武器，以防敌人贴到近战；持盾防守者需要单手能用的武器。第一次战斗前，把两件武器的攻击加值和伤害式都写在角色卡上。</p>

<p>武器精通让选择不再只是比较伤害骰。缓速会让命中的生物速度减少 10 尺；推撞能把大型或更小的生物沿直线推离你至多 10 尺；削弱会影响它下一次攻击；击倒会要求目标进行体质豁免，失败则倒地，5 尺内的攻击因此具有优势。选择队伍能利用的效果。让游荡者有机会行动，或把敌人挡在牧师外面的精通，常常比平均伤害的一点差异更有价值。</p>

<p>触及武器也会改变你的站位。如果正在考虑这类武器，可以读<a href="${ZH_DND_GLAIVE_PATH}">长柄刀指南</a>，了解触及怎样影响攻击与借机攻击。触及适合认真追踪位置的桌子，它不会把近战武器变成远程武器。</p>

<h3>5. 写好战斗风格、第二风和精通备注</h3>
<p>选择你经常会用到的战斗风格。箭术适合长弓；防御适合任何穿甲配置；决斗适合单手武器，包括配盾使用；保护是反应而非持续加成：持有盾牌时，若你看得见的生物攻击你 5 尺内的另一名目标，可以让触发攻击和其他针对该目标的攻击在你的下个回合开始前具有劣势，前提是你始终留在其 5 尺内。风格应当从第一步写下的职责自然得出。</p>

<p>第二风是一个附赠动作，恢复 <code>1d10 + 战士等级</code> 点生命值。1 级有两次使用次数，短休后恢复一次，长休后全部恢复。把治疗量和使用框放在容易看到的地方。记得能力存在，却忘了它会和其他附赠动作抢时机，是很常见的失误。</p>

<table><thead><tr><th scope="col">构筑方向</th><th scope="col">属性</th><th scope="col">装备思路</th><th scope="col">战斗风格</th><th scope="col">精通目的</th></tr></thead><tbody>
<tr><th scope="row">持盾防守者</th><td>力量，其次体质</td><td>单手武器、盾牌、重甲</td><td>防御或决斗</td><td>用削弱、推撞或击倒保护空间</td></tr>
<tr><th scope="row">远程控制者</th><td>敏捷，其次体质</td><td>长弓、轻甲、灵巧备用武器</td><td>箭术</td><td>远程用缓速，近战以扰乱或其他备用效果应对</td></tr>
</tbody></table>

<p>这两种方向不是强制构筑。战士可以掌握不止一种武器精通，所以先选一个主计划，再准备一个应对干扰的方案。弓不能解决每个狭窄地城房间，重武器也解决不了每个飞行敌人。</p>

<h2>每回合先问自己五个问题</h2>
<p>如果从错误格子攻击错误目标，额外攻击也帮不上忙。每回合开始时，先回答五个问题。你不必大声念出来；目的是把移动、目标选择、武器精通和有限资源放进同一个决定里，而不是变成四种彼此无关的习惯。</p>

<img class="inline-article-image" src="${DND_FIGHTER_TURN_PLAN_IMAGE_PATH}" alt="一名 DND 战士在战斗地图上规划站位、目标、武器精通、动作如潮和第二风" loading="lazy" decoding="async" fetchpriority="low" width="1536" height="1024" />

<h3>1. 回合结束时必须达成什么？</h3>
<p>移动前先说出结果：打倒残血敌人、守住走廊、切断弓手视线，或给游荡者创造空当。这样能把移动和武器精通连回遭遇战本身。“尽量多打伤害”有时是答案，但不是唯一有用的答案。</p>

<h3>2. 攻击后应该站在哪里？</h3>
<p>最后落在哪一格很重要。给队友留出近战位置，也不要堵住队伍的退路。用触及武器时，想清楚额外距离是在保护自己、保护队友，还是控制一条接近路线。<a href="${ZH_DND_GLAIVE_PATH}">长柄刀指南</a>会解释这种站位。用弓时，则要问这次移动能否让敌人下回合摸不到你。</p>

<h3>3. 哪种武器精通最能帮助这个目标？</h3>
<p>选择会改变下一步决定的效果。缓速让命中目标速度减少 10 尺；推撞能把大型或更小的生物沿直线推离你至多 10 尺，适合危险地形、门口和持续区域；削弱适合下一次攻击很危险的敌人；击倒要求体质豁免，失败会使目标倒地，让 5 尺内的攻击具有优势。三种精通选择不只会改善伤害骰，前提是你在这张地图上选对了效果。</p>

<h3>4. 动作如潮现在能改变遭遇战吗？</h3>
<p>2 级时，动作如潮会在你的回合提供一个额外动作，但不能用来执行魔法动作（Magic action）。短休或长休后恢复。可以用它在优先目标行动前将其解决、救出队友、操作目标物，或在敌人分散前建立控制。额外动作用于目标或救援时，可能比多打一串普通攻击更有价值。</p>

<p>等一个完美的首领时机，常常等到整场战斗都没用动作如潮。问问自己：额外动作能做到普通动作做不到的什么？如果答案只是“对同一目标多一点伤害”，保留它也合理；如果答案是“敌人碰不到倒地队友”，那时机多半已经到了。</p>

<h3>5. 第二风值得花掉附赠动作吗？</h3>
<p>当第二风的治疗能让你撑过敌人的下一回合，而且附赠动作空出来时，就该考虑使用。等到只差一击倒下，往往太迟。但也不必把每一点缺失生命值都当紧急情况：队伍能在敌人行动前结束战斗时，和你是唯一挡在危险生物与后排之间时，第二风的价值并不一样。</p>

<p>2 级时，战术思维让你消耗第二风，对任何一次失败的属性检定加 <code>1d10</code>；只有检定成功才真正消耗使用次数。5 级时，只要你以附赠动作启动第二风，战术转移就会让你额外移动至多一半速度，且不引发借机攻击；它不是单独花资源换移动。同一资源可以治疗或补一次失败检定，而以附赠动作启动第二风时还会附带移动。把这些用途记在角色卡上，花掉前才能看出哪一种更合适。</p>

<h2>会改变玩法的战士等级节点</h2>
<table><thead><tr><th scope="col">战士等级</th><th scope="col">能力</th><th scope="col">桌上有什么变化</th></tr></thead><tbody>
<tr><th scope="row">2</th><td>动作如潮、战术思维</td><td>获得一次爆发动作，并能用第二风挽回任何失败的属性检定</td></tr>
<tr><th scope="row">3</th><td>战士子职业</td><td>构筑获得定义自身的专精</td></tr>
<tr><th scope="row">5</th><td>额外攻击、战术转移</td><td>每次攻击动作攻击两次，第二风后移动更安全</td></tr>
<tr><th scope="row">9</th><td>不屈、战术大师</td><td>失败豁免恢复更强，武器精通效果更灵活</td></tr>
<tr><th scope="row">11</th><td>两次额外攻击</td><td>每次攻击动作攻击三次</td></tr>
<tr><th scope="row">13</th><td>研习攻击</td><td>一次未命中可以让你在下个回合结束前对同一生物的下一次攻击具有优势</td></tr>
<tr><th scope="row">20</th><td>三次额外攻击</td><td>每次攻击动作攻击四次</td></tr>
</tbody></table>

<p>额外攻击会提高好目标和好站位的价值，因为一次攻击动作不再只有一次攻击。它不会免除选择正确敌人的责任。若把两次攻击都花在已经被队伍限制住的目标上，可能就错过了阻止更危险敌人行动的机会。</p>

<p>不屈也值得写在角色卡显眼处。2024 版本中，你重掷失败的豁免时会获得等于战士等级的加值。它适合用在会让你退出战斗、或无法继续履行职责的豁免上。研习攻击会奖励你在未命中后继续观察，但它给同一生物下一次攻击的优势会在你下个回合结束时失效。</p>

<p>战士比大多数职业有更多专长机会。先让几次游戏告诉你到底缺命中、防御、移动、控制，还是战斗外工具。专长更容易选对，因为它回答的是桌上已经出现的问题，而不是只存在于构筑视频里的问题。</p>

<h2>按想管理的复杂度选子职业</h2>
<p>2024 玩家手册中的选择有不同程度的规则负担。选你愿意反复做的额外决定，而不是看上去在所有能力同时可用时最强的那个。</p>

<ul>
<li><strong>冠军（Champion）</strong>让核心循环保持直接，不会增加很大的战技菜单。适合希望主要靠武器选择和站位完成回合的玩家。</li>
<li><strong>战斗大师（Battle Master）</strong>通过战技和优越骰增加战术选择。喜欢每回合选对效果、也愿意追踪另一种资源时再选它。</li>
<li><strong>奥法骑士（Eldritch Knight）</strong>加入法术，用于防御、实用能力和法剑身份。你需要同时学习法术时机和武器时机。</li>
<li><strong>灵能战士（Psi Warrior）</strong>加入灵能移动、伤害和保护，适合愿意追踪另一种资源并阅读战场的玩家。</li>
</ul>

<p>不要因为觉得战士必须复杂就选战斗大师，也不要因为别人说冠军只适合新手就避开它。更好的问题是：这个子职业提供的选择，是否能让你在整场战役里持续感到有趣？如果战士还在和野蛮人、圣武士或游侠竞争，可以看<a href="${ZH_DND_CLASSES_PATH}">DND 职业指南</a>。</p>

<h2>不要混用 2014 与 2024 战士规则</h2>
<p>两个版本共享同一种职业幻想，但几个熟悉能力已经改变。使用旧指南、视频或角色构筑器前，先把规则年份写在角色卡上。</p>

<table><thead><tr><th scope="col">规则</th><th scope="col">2014 战士</th><th scope="col">2024 战士</th></tr></thead><tbody>
<tr><th scope="row">武器精通</th><td>不是核心职业能力</td><td>1 级有三种精通选择，之后增加</td></tr>
<tr><th scope="row">1 级第二风</th><td>每次短休或长休一次</td><td>两次；短休恢复一次，长休全部恢复</td></tr>
<tr><th scope="row">战术思维与战术转移</th><td>没有</td><td>分别在 2 级和 5 级获得</td></tr>
<tr><th scope="row">动作如潮</th><td>额外动作没有 2024 的魔法动作限制</td><td>额外动作不能执行魔法动作</td></tr>
<tr><th scope="row">不屈</th><td>重掷失败豁免</td><td>重掷时加上战士等级</td></tr>
</tbody></table>

<p>不要只因武器表看起来熟悉，就把武器精通塞进 2014 角色；也不要只给 2024 战士一次 1 级第二风。避免混版最简单的办法，是在角色卡顶端写规则来源，并在旧构筑给出不同动作成本或时机时回查能力原文。</p>

<p>2014 战役请用<a href="https://www.dndbeyond.com/classes/10-fighter" rel="noreferrer noopener">2014 战士资料</a>，2024 战役请用<a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-classes" rel="noreferrer noopener">2024 基础规则职业章节</a>。战斗中看到不同说法时，来源标签比凭记忆区分版本可靠得多。</p>

<h2>让战士在 VTT 格子上容易辨认</h2>
<p>战士 Token 更需要清楚剪影，而不是细节繁多的背景。把脸和标志性装备留在裁切范围内，使用容易区分的边框颜色，并在网格大小下测试。巨剑、盾牌、弓或长柄刀可以在任何人打开角色卡前，先告诉全桌这个角色的职责。</p>

<p>角色卡完成后，打开<a href="${ZH_EDITOR_PATH}">Token Maker 编辑器</a>，从 Warrior 预设开始，调整裁切并导出 PNG。四个 Token 挤在一个门口时，它仍该看得出来。把第二风次数、触及或临时效果等地图信息放进独立标记，不要硬塞在头像里。</p>

<h2>DND 战士常见问题</h2>
<h3>DND 战士适合新手吗？</h3>
<p>适合。战士的基础回合可以很直接：移动、选择目标、攻击。冠军让后续选择更轻量，战斗大师、奥法骑士和灵能战士则让玩家加入更多战术或魔法复杂度。</p>

<h3>战士该用力量还是敏捷？</h3>
<p>重型近战武器、重甲和运动适合力量；弓、灵巧武器、先攻、敏捷技能和轻甲适合敏捷。提高你最常使用的攻击所依赖的属性。</p>

<h3>战士最好的战斗风格是什么？</h3>
<p>没有放之四海皆准的最佳选择。箭术帮助远程命中，防御适合任何穿甲配置，决斗适合单手武器，保护则帮助相邻队友。让战斗风格匹配角色每回合都会履行的职责。</p>

<h3>战士能攻击几次？</h3>
<p>战士在 1 至 4 级使用攻击动作时通常攻击一次，5 至 10 级两次，11 至 19 级三次，20 级四次。动作如潮可以提供另一个动作，但它是有限资源。</p>

<h3>DND 战士能施法吗？</h3>
<p>奥法骑士通过子职业能力施法。其他战士可以通过专长或多职业获得有限魔法。2024 规则下，动作如潮提供的额外动作不能执行魔法动作。</p>

<h3>2024 规则里的战士改了什么？</h3>
<p>最大的变化包括武器精通、第二风的更多用途、战术思维、战术转移、更强的不屈和研习攻击。动作如潮也新增限制，额外动作不能执行魔法动作。</p>

<h2>来源</h2>
<ul>
<li><a href="https://www.dndbeyond.com/classes/2190879-fighter" rel="noreferrer noopener">D&amp;D Beyond：2024 战士职业详情</a></li>
<li><a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-classes" rel="noreferrer noopener">D&amp;D Beyond：2024 基础规则职业章节</a></li>
<li><a href="https://www.dndbeyond.com/classes/10-fighter" rel="noreferrer noopener">D&amp;D Beyond：2014 战士职业</a></li>
<li><a href="https://roll20.net/compendium/dnd5e/Fighter" rel="noreferrer noopener">Roll20 Compendium：2014 战士</a></li>
</ul>
`;
