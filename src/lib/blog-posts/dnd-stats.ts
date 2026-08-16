import {
  DND_2024_CHARACTER_CREATION_URL,
  DND_2024_CHARACTER_ORIGINS_URL,
  DND_2024_PLAYING_THE_GAME_URL,
  EN_DICE_ROLLER_PATH,
  EN_DND_CLASSES_PATH,
  EN_DND_CONSTITUTION_PATH,
  EN_DND_RACES_PATH,
  EN_EDITOR_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_DND_CONSTITUTION_PATH,
  ZH_DND_RACES_PATH,
  ZH_EDITOR_PATH,
} from './shared';

const DND_2014_ABILITY_SCORES_URL =
  'https://roll20.net/compendium/dnd5e/Rules%3AAbility%20Scores';

export const dndStatsArticleHtml = String.raw`
<p><strong>Your six DnD stats are Strength, Dexterity, Constitution, Intelligence, Wisdom, and Charisma.</strong> Each ability has a score, but most d20 rolls use the smaller modifier derived from it. A score of 16 looks impressive on the sheet; the number you usually add to the die is +3.</p>

<p>The quickest way to finish a level 1 character is to separate three decisions: use the stat-generation method your DM approved, assign the six numbers around your class's primary ability, then apply the ability increases allowed by your rules version. This guide follows the 2024 Free Basic Rules first and marks the 2014 difference where it matters.</p>

<h2>Start with the score, but use the modifier</h2>
<p>An ability score measures the size of an ability. The modifier is the number added to an ability check, saving throw, attack roll, or another roll when a rule calls for that ability.</p>

<p><code>modifier = floor((ability score - 10) / 2)</code></p>

<p>The modifier changes every two score points:</p>
<table><thead><tr><th scope="col">Ability score</th><th scope="col">Modifier</th></tr></thead><tbody>
<tr><th scope="row">8–9</th><td>−1</td></tr>
<tr><th scope="row">10–11</th><td>+0</td></tr>
<tr><th scope="row">12–13</th><td>+1</td></tr>
<tr><th scope="row">14–15</th><td>+2</td></tr>
<tr><th scope="row">16–17</th><td>+3</td></tr>
<tr><th scope="row">18–19</th><td>+4</td></tr>
<tr><th scope="row">20</th><td>+5</td></tr>
</tbody></table>

<p>Suppose your Wizard has Intelligence 17. Its Intelligence modifier is +3. If the character is proficient in Arcana and has a +2 Proficiency Bonus at level 1, an Intelligence (Arcana) check normally uses <code>d20 + 3 + 2</code>. The score, modifier, and Proficiency Bonus are three separate entries with three separate jobs.</p>

<h2>What the six DnD stats change at the table</h2>
<p>The six abilities describe broad physical and mental capabilities. A class feature, spell, weapon property, or DM ruling tells you which one applies to a particular roll.</p>

<table><thead><tr><th scope="col">Stat</th><th scope="col">What it measures</th><th scope="col">Common uses</th></tr></thead><tbody>
<tr><th scope="row">Strength (STR)</th><td>Physical might</td><td>Many melee attacks, Athletics, lifting, jumping, Strength saves</td></tr>
<tr><th scope="row">Dexterity (DEX)</th><td>Agility, reflexes, balance</td><td>Many ranged and Finesse attacks, light-armor AC, Initiative, Stealth, Dexterity saves</td></tr>
<tr><th scope="row">Constitution (CON)</th><td>Health and stamina</td><td>Hit points, Constitution saves, Concentration saves</td></tr>
<tr><th scope="row">Intelligence (INT)</th><td>Reasoning and memory</td><td>Arcana, History, Investigation, Nature, Religion, some spellcasting</td></tr>
<tr><th scope="row">Wisdom (WIS)</th><td>Perceptiveness and mental fortitude</td><td>Perception, Insight, Medicine, Survival, some spellcasting</td></tr>
<tr><th scope="row">Charisma (CHA)</th><td>Confidence, poise, charm</td><td>Deception, Intimidation, Performance, Persuasion, some spellcasting</td></tr>
</tbody></table>

<p>These are game rules, not personality limits. Intelligence 8 does not force you to play a fool, and Charisma 8 does not stop a character from speaking. A low score makes related rolls harder; it does not write the character's dialogue for you.</p>

<p>Constitution is also unusual: it has no associated skills, yet its modifier affects hit points and many survival moments. If you are deciding how much your build needs, the <a href="${EN_DND_CONSTITUTION_PATH}">DnD Constitution guide</a> covers hit points, Concentration, saves, and useful breakpoints.</p>

<h2>Assign your six numbers in four steps</h2>
<p>Do not rank the six stats in isolation. A useful assignment fits the class, armor, attacks, spells, and the job you want to perform in the party.</p>

<h3>1. Put the highest score in the class's primary ability</h3>
<p>The class description identifies its primary ability. That score usually supports the class's repeated attacks, spell save DC, spell attacks, or signature features. A Wizard normally starts with Intelligence at the top. A Cleric or Druid prioritizes Wisdom. A Bard, Sorcerer, or Warlock wants Charisma. Many Barbarians begin with Strength, while Rogues usually build around Dexterity.</p>

<p>Multiclass plans and unusual features can change the order, but they need an actual rule rather than a vague concept. Use the <a href="${EN_DND_CLASSES_PATH}">DnD classes guide</a> to identify what your class repeatedly asks you to roll.</p>

<h3>2. Protect the defenses the character will use</h3>
<p>Constitution supports hit points for every class. Dexterity often affects Initiative, common saves, and Armor Class when armor allows it. Heavy armor may reduce Dexterity's contribution to AC, but the score still affects Initiative and Dexterity saves.</p>

<p>Do not automatically place the second-highest number in Constitution. First check whether the class needs a second ability for attacks, spellcasting, armor, or a class feature. Then decide how much durability the remaining array can afford.</p>

<h3>3. Fund the features you expect to use</h3>
<p>Read the feature text. A Paladin can want Strength for weapon attacks and Charisma for spells and auras. A Monk often needs Dexterity and Wisdom. A Ranger can care about Dexterity and Wisdom. These characters divide attention across more than one ability, so a single high number does not finish the build.</p>

<h3>4. Choose the low score deliberately</h3>
<p>Put the lowest number where the mechanical cost fits the character. Check saving throws, skills, carrying needs, armor, multiclass prerequisites, and likely campaign situations first. Then use it as a prompt instead of a punishment: a low-Strength Wizard might travel light, while a low-Charisma Fighter might be blunt. The score never takes control of the character away from you.</p>

<h2>Work through a level 1 Wizard example</h2>
<p>The <a href="${DND_2024_CHARACTER_CREATION_URL}" rel="noreferrer noopener">2024 Free Basic Rules</a> provide the standard array <code>15, 14, 13, 12, 10, 8</code> and a suggested assignment for each class. The Wizard suggestion is:</p>

<table><thead><tr><th scope="col">Ability</th><th scope="col">Assigned score</th><th scope="col">Starting modifier</th></tr></thead><tbody>
<tr><th scope="row">Strength</th><td>8</td><td>−1</td></tr>
<tr><th scope="row">Dexterity</th><td>12</td><td>+1</td></tr>
<tr><th scope="row">Constitution</th><td>13</td><td>+1</td></tr>
<tr><th scope="row">Intelligence</th><td>15</td><td>+2</td></tr>
<tr><th scope="row">Wisdom</th><td>14</td><td>+2</td></tr>
<tr><th scope="row">Charisma</th><td>10</td><td>+0</td></tr>
</tbody></table>

<p>Intelligence gets 15 because it drives Wizard spellcasting. Constitution 13 supports hit points and Concentration, while Dexterity 12 helps Initiative, Dexterity saves, and AC when applicable. Wisdom 14 gives strong Perception and Wisdom saves, but it does not replace Intelligence for Wizard spells.</p>

<p>Now apply a 2024 Sage background. It lists Constitution, Intelligence, and Wisdom as eligible abilities. Increase Intelligence by 2 and Constitution by 1:</p>

<table><thead><tr><th scope="col">Ability</th><th scope="col">Final score</th><th scope="col">Final modifier</th></tr></thead><tbody>
<tr><th scope="row">Strength</th><td>8</td><td>−1</td></tr>
<tr><th scope="row">Dexterity</th><td>12</td><td>+1</td></tr>
<tr><th scope="row">Constitution</th><td>14</td><td>+2</td></tr>
<tr><th scope="row">Intelligence</th><td>17</td><td>+3</td></tr>
<tr><th scope="row">Wisdom</th><td>14</td><td>+2</td></tr>
<tr><th scope="row">Charisma</th><td>10</td><td>+0</td></tr>
</tbody></table>

<p>The finished character gained one point of Constitution modifier and one point of Intelligence modifier. At level 1, the Wizard has a +3 spellcasting ability modifier before adding Proficiency Bonus where a spell or feature tells you to add it. This is an example, not a mandatory Wizard array.</p>

<h2>Pick the generation method your DM approved</h2>
<p>The 2024 rules present three methods. Your DM can choose which one the campaign uses.</p>

<table><thead><tr><th scope="col">Method</th><th scope="col">What you start with</th><th scope="col">Tradeoff</th></tr></thead><tbody>
<tr><th scope="row">Standard array</th><td>15, 14, 13, 12, 10, 8</td><td>Fast and balanced, with less control or surprise</td></tr>
<tr><th scope="row">Random generation</th><td>Roll 4d6, keep the highest three, repeat six times</td><td>Unexpected arrays, but characters can start with different totals</td></tr>
<tr><th scope="row">Point cost</th><td>Spend 27 points on scores from 8 to 15</td><td>Direct control, with more decisions and arithmetic</td></tr>
</tbody></table>

<p>If the campaign uses random generation, open the <a href="${EN_DICE_ROLLER_PATH}">DnD dice roller</a> and use the 4d6 drop-lowest preset six times. Keep the six totals, then return to the four-step assignment order above. The roller generates the numbers; your class and rules version decide where they go.</p>

<p>Do not roll first and ask permission afterward. One character using a lucky rolled array while everyone else uses standard array changes the campaign's starting assumptions.</p>

<h2>Keep 2014 and 2024 ability increases separate</h2>
<p>Both rulesets use the same six abilities, familiar modifiers, and common generation methods. The key character-creation difference is where the starting increases come from.</p>

<table><thead><tr><th scope="col">Question</th><th scope="col">2014 core approach</th><th scope="col">2024 core approach</th></tr></thead><tbody>
<tr><th scope="row">Where do starting increases come from?</th><td>A race and sometimes its subrace or source options</td><td>A background lists three eligible abilities</td></tr>
<tr><th scope="row">How are background increases assigned?</th><td>Not the core 2014 method</td><td>+2 to one listed ability and +1 to another, or +1 to all three</td></tr>
<tr><th scope="row">Do species add ability scores?</th><td>The older race entry includes its increase</td><td>No; use the background adjustment</td></tr>
<tr><th scope="row">What if an older species is allowed?</th><td>Use the 2014 entry in a 2014 game</td><td>Ignore its old increase and use the background adjustment under official compatibility guidance</td></tr>
</tbody></table>

<p>Do not apply a 2014 race increase and a 2024 background increase to the same character unless the DM has deliberately created a house rule. The <a href="${EN_DND_RACES_PATH}">DnD races and species guide</a> has a fuller compatibility breakdown. Writing <code>2024 Wizard</code>, <code>2014 Human Fighter</code>, or the exact approved source on the sheet prevents an old build guide from silently mixing versions into a current character.</p>

<h2>Use the same modifier in checks, saves, and attacks</h2>
<p>Most d20 Tests share a simple shape: <code>d20 + relevant ability modifier + Proficiency Bonus when proficient</code>.</p>
<ul>
<li>An ability check tests something the character attempts, such as a Dexterity (Stealth) check.</li>
<li>A saving throw resists a threat, such as a Constitution save to maintain Concentration.</li>
<li>An attack roll tries to hit, using the ability and proficiency allowed by the weapon, spell, or feature.</li>
</ul>

<p>Proficiency is not automatic. Add Proficiency Bonus only when a rule says the character is proficient with the skill, save, weapon, tool, or other test. The DM can also call for an unusual ability-and-skill combination when the situation supports it; use the ability the DM requested, then read that modifier from the sheet.</p>

<h2>Fix five common DnD stats mistakes</h2>
<ol>
<li><strong>Adding the score to a d20.</strong> Strength 16 normally contributes +3, not +16.</li>
<li><strong>Adding proficiency to every roll.</strong> Add it only when the relevant rule grants proficiency.</li>
<li><strong>Treating 4d6 as the only official method.</strong> Standard array, random generation, and point cost all appear in the 2024 rules.</li>
<li><strong>Stacking 2014 species and 2024 background increases.</strong> Use one character-creation ruleset and its compatibility guidance.</li>
<li><strong>Following a universal stat ranking.</strong> Class, armor, features, and party job matter more than a generic list.</li>
</ol>

<h2>Finish the sheet, then make the character readable on the map</h2>
<p>Before the first session, check all six scores and modifiers, the class's primary ability, background adjustment, Proficiency Bonus, saving-throw and skill proficiencies, Armor Class, hit points, attack bonuses, and spell save DC if the character casts spells.</p>

<p>Once the numbers work, make the character recognizable at token size. <a href="${EN_EDITOR_PATH}">Open Token Maker</a>, keep the face and signature equipment inside the crop, and test the result against a VTT grid. Stats tell the table what the character can do; the token should tell everyone which character is acting.</p>

<h2>DnD stats FAQ</h2>
<h3>What are the six stats in DnD?</h3>
<p>The six DnD stats are Strength, Dexterity, Constitution, Intelligence, Wisdom, and Charisma. The rules also call them abilities or ability scores.</p>

<h3>How do I calculate a DnD ability modifier?</h3>
<p>Subtract 10 from the ability score, divide by 2, and round down. A score of 15 gives +2, while a score of 8 gives −1.</p>

<h3>What is the DnD standard array?</h3>
<p>The 2024 standard array is 15, 14, 13, 12, 10, and 8. Assign each number to a different ability, then apply the increases allowed by the character-creation rules you are using.</p>

<h3>What is the best stat in DnD?</h3>
<p>There is no universal best stat. The class's primary ability usually receives the highest score, while Constitution, Dexterity, and any secondary class ability compete for the remaining high numbers.</p>

<h3>Is 4d6 drop lowest the default way to roll stats?</h3>
<p>It is the random-generation method in the 2024 Free Basic Rules, but it is not the only character-creation method. Standard array and 27-point cost are also listed, and the DM can require one method for the campaign.</p>

<h2>Sources</h2>
<ul>
<li><a href="${DND_2024_CHARACTER_CREATION_URL}" rel="noreferrer noopener">D&amp;D Beyond: Creating a Character, 2024 Free Basic Rules</a></li>
<li><a href="${DND_2024_PLAYING_THE_GAME_URL}" rel="noreferrer noopener">D&amp;D Beyond: Playing the Game, 2024 Free Basic Rules</a></li>
<li><a href="${DND_2024_CHARACTER_ORIGINS_URL}" rel="noreferrer noopener">D&amp;D Beyond: Character Origins, 2024 Free Basic Rules</a></li>
<li><a href="${DND_2014_ABILITY_SCORES_URL}" rel="noreferrer noopener">Roll20: Ability Scores, 2014 Free Basic Rules</a></li>
</ul>
`;

export const dndStatsArticleHtmlZh = String.raw`
<p><strong>DND 的六项属性是力量、敏捷、体质、智力、感知和魅力。</strong>角色卡上写的是属性值，但大多数 d20 掷骰真正加上去的是由属性值换算出的调整值。智力 16 看起来很高，施法时常用的却是 +3，而不是 +16。</p>

<p>创建 1 级角色时，把事情拆成三步最不容易出错：先用 DM 批准的方法得到六个数，再围绕职业主属性分配，最后按当前规则版本加入属性提升。下文以 2024 免费基础规则为主，遇到 2014 版差异会单独标出。</p>

<h2>先看属性值，实际掷骰用调整值</h2>
<p>属性值代表一项能力的高低；当规则要求使用某项属性时，属性调整值会加入属性检定、豁免、攻击检定或其他掷骰。</p>

<p><code>调整值 = 向下取整((属性值 - 10) / 2)</code></p>

<table><thead><tr><th scope="col">属性值</th><th scope="col">调整值</th></tr></thead><tbody>
<tr><th scope="row">8–9</th><td>−1</td></tr>
<tr><th scope="row">10–11</th><td>+0</td></tr>
<tr><th scope="row">12–13</th><td>+1</td></tr>
<tr><th scope="row">14–15</th><td>+2</td></tr>
<tr><th scope="row">16–17</th><td>+3</td></tr>
<tr><th scope="row">18–19</th><td>+4</td></tr>
<tr><th scope="row">20</th><td>+5</td></tr>
</tbody></table>

<p>假设法师的智力是 17，智力调整值就是 +3。1 级角色的熟练加值为 +2；如果角色熟练奥秘，那么一次智力（奥秘）检定通常是 <code>d20 + 3 + 2</code>。属性值、调整值和熟练加值是三个不同数字，别把它们写到同一格。</p>

<h2>六项 DND 属性分别影响什么</h2>
<p>六项属性描述角色广泛的身体与心智能力。具体一次掷骰该用哪项，要看职业特性、法术、武器属性或 DM 对当前情境的裁定。</p>

<table><thead><tr><th scope="col">属性</th><th scope="col">代表什么</th><th scope="col">常见用途</th></tr></thead><tbody>
<tr><th scope="row">力量（STR）</th><td>肌力与爆发力</td><td>许多近战攻击、运动、搬举、跳跃、力量豁免</td></tr>
<tr><th scope="row">敏捷（DEX）</th><td>灵活、反应与平衡</td><td>许多远程和灵巧武器攻击、轻甲 AC、先攻、隐匿、敏捷豁免</td></tr>
<tr><th scope="row">体质（CON）</th><td>健康与耐力</td><td>生命值、体质豁免、专注豁免</td></tr>
<tr><th scope="row">智力（INT）</th><td>推理与记忆</td><td>奥秘、历史、调查、自然、宗教以及部分施法</td></tr>
<tr><th scope="row">感知（WIS）</th><td>观察力与心志</td><td>察觉、洞悉、医药、求生以及部分施法</td></tr>
<tr><th scope="row">魅力（CHA）</th><td>自信、气场与感染力</td><td>欺瞒、威吓、表演、游说以及部分施法</td></tr>
</tbody></table>

<p>它们是游戏机制，不是性格判决书。智力 8 不等于必须扮演傻瓜，魅力 8 也不等于角色不能开口。低属性只会让相关掷骰更难，不会替你写台词。</p>

<p>体质还有一点特殊：它没有对应技能，却直接影响生命值和许多生存时刻。如果你在判断构筑需要多少体质，可以接着看 <a href="${ZH_DND_CONSTITUTION_PATH}">DND 体质指南</a>里的生命值、专注与豁免节点。</p>

<h2>用四步分配六个数</h2>
<p>别脱离职业去排一张“全游戏属性强度榜”。合理分配应该同时匹配职业、护甲、攻击、法术和你想在队伍里承担的工作。</p>

<h3>1. 最高值先放职业主属性</h3>
<p>职业说明会标出主属性，它通常决定最常用的攻击、法术豁免 DC、法术攻击或核心特性。法师通常优先智力；牧师和德鲁伊优先感知；吟游诗人、术士和邪术师依赖魅力；许多野蛮人优先力量，游荡者则多半围绕敏捷。</p>

<p>兼职或特殊特性可以改变顺序，但要有明确规则支持。分配前可先查 <a href="${ZH_DND_CLASSES_PATH}">DND 职业指南</a>，看这个职业一再要求你掷哪项能力。</p>

<h3>2. 保护角色真正会用到的防御</h3>
<p>体质为所有职业提供生命值。敏捷常影响先攻、常见豁免，以及护甲允许时的 AC。重甲角色可能不靠敏捷提高 AC，但敏捷仍影响先攻和敏捷豁免。</p>

<p>第二高的数不必无脑放体质。先检查职业是否还需要另一项属性支持攻击、施法、护甲或职业特性，再决定剩下的数组能承担多少耐久。</p>

<h3>3. 给你准备频繁使用的特性留数值</h3>
<p>直接读特性文字。圣武士可能同时要力量做武器攻击、魅力支持法术和光环；武僧常需要敏捷与感知；游侠也可能兼顾敏捷和感知。这类职业不止吃一项属性，一条漂亮的最高值并不能完成整个构筑。</p>

<h3>4. 有意识地放置最低值</h3>
<p>先检查豁免、技能、负重、护甲、兼职先决条件与战役常见场景，再把最低值放到代价可以接受的位置。之后可以拿它当角色提示：低力量法师会少带东西，低魅力战士说话可能很直。属性不会夺走玩家对角色的控制权。</p>

<h2>跟着一个 1 级法师算完全部属性</h2>
<p><a href="${DND_2024_CHARACTER_CREATION_URL}" rel="noreferrer noopener">2024 免费基础规则</a>提供标准数组 <code>15、14、13、12、10、8</code>，也给每个职业列出建议分配。法师的建议如下：</p>

<table><thead><tr><th scope="col">属性</th><th scope="col">分配值</th><th scope="col">初始调整值</th></tr></thead><tbody>
<tr><th scope="row">力量</th><td>8</td><td>−1</td></tr>
<tr><th scope="row">敏捷</th><td>12</td><td>+1</td></tr>
<tr><th scope="row">体质</th><td>13</td><td>+1</td></tr>
<tr><th scope="row">智力</th><td>15</td><td>+2</td></tr>
<tr><th scope="row">感知</th><td>14</td><td>+2</td></tr>
<tr><th scope="row">魅力</th><td>10</td><td>+0</td></tr>
</tbody></table>

<p>智力拿 15，因为它驱动法师施法。体质 13 支持生命值和专注，敏捷 12 帮助先攻、敏捷豁免与适用时的 AC。感知 14 能带来不错的察觉和感知豁免，但不能替代法师的智力施法。</p>

<p>然后应用 2024 版贤者背景。它允许提升体质、智力和感知。给智力 +2、体质 +1 后：</p>

<table><thead><tr><th scope="col">属性</th><th scope="col">最终值</th><th scope="col">最终调整值</th></tr></thead><tbody>
<tr><th scope="row">力量</th><td>8</td><td>−1</td></tr>
<tr><th scope="row">敏捷</th><td>12</td><td>+1</td></tr>
<tr><th scope="row">体质</th><td>14</td><td>+2</td></tr>
<tr><th scope="row">智力</th><td>17</td><td>+3</td></tr>
<tr><th scope="row">感知</th><td>14</td><td>+2</td></tr>
<tr><th scope="row">魅力</th><td>10</td><td>+0</td></tr>
</tbody></table>

<p>最终角色的体质和智力调整值各提高了一档。1 级时，法师的施法属性调整值为 +3；只有法术或特性要求时，才在此基础上加入熟练加值。这只是一个完整算例，不是强制模板。</p>

<h2>使用 DM 批准的属性生成方法</h2>
<p>2024 规则提供三种方法，战役采用哪种由 DM 决定。</p>

<table><thead><tr><th scope="col">方法</th><th scope="col">起始内容</th><th scope="col">取舍</th></tr></thead><tbody>
<tr><th scope="row">标准数组</th><td>15、14、13、12、10、8</td><td>快速且队伍平衡稳定，但控制与意外较少</td></tr>
<tr><th scope="row">随机生成</th><td>掷 4d6，去掉最低一颗，六次各取一个总和</td><td>会出现意外数组，但同桌角色总点数可能不同</td></tr>
<tr><th scope="row">27 点购点</th><td>按官方费用表购买 8 到 15 的属性</td><td>能控制分布，但创建时要做更多选择和计算</td></tr>
</tbody></table>

<p>如果战役采用随机生成，可打开 <a href="${ZH_DICE_ROLLER_PATH}">DND 骰子工具</a>，连续使用六次 4d6 去最低预设。保留六个总和，再回到前面的四步分配。骰子只负责产生数字，职业与规则版本才决定它们放在哪里。</p>

<p>别先掷出好数组再补问 DM 能不能用。同桌其他人若采用标准数组，一个幸运的随机数组会改变整场战役的起点。</p>

<h2>不要混用 2014 与 2024 的属性加值</h2>
<p>两版都使用相同的六项属性、熟悉的调整值和常见生成方法。角色创建时最重要的区别，是起始属性提升来自哪里。</p>

<table><thead><tr><th scope="col">问题</th><th scope="col">2014 核心规则</th><th scope="col">2024 核心规则</th></tr></thead><tbody>
<tr><th scope="row">起始提升来自哪里？</th><td>Race，部分还涉及 Subrace 或来源选项</td><td>Background 列出的三项属性</td></tr>
<tr><th scope="row">背景提升怎样分配？</th><td>不是 2014 核心流程</td><td>一项 +2、另一项 +1，或三项各 +1</td></tr>
<tr><th scope="row">Species 是否提供属性提升？</th><td>旧 Race 条目包含自己的提升</td><td>不提供，使用 Background 调整</td></tr>
<tr><th scope="row">2024 游戏使用旧 Species 怎么办？</th><td>2014 游戏按旧条目执行</td><td>按官方兼容规则忽略旧属性提升，改用 Background 调整</td></tr>
</tbody></table>

<p>除非 DM 明确制定家规，否则不要把 2014 Race 的提升与 2024 Background 的提升叠在同一角色上。需要完整的术语与兼容说明，可以看 <a href="${ZH_DND_RACES_PATH}">DND Race 与 Species 指南</a>。在角色卡上写清 <code>2024 法师</code>、<code>2014 人类战士</code>或桌上批准的具体来源，就能避免旧攻略和新建卡器悄悄拼成一套不存在的规则。</p>

<h2>检定、豁免和攻击都从同一个调整值出发</h2>
<p>大多数 d20 检定都可以先理解为：<code>d20 + 相关属性调整值 + 熟练时的熟练加值</code>。</p>
<ul>
<li>属性检定处理角色主动尝试的事情，例如敏捷（隐匿）检定。</li>
<li>豁免用于抵抗威胁，例如维持专注时进行体质豁免。</li>
<li>攻击检定用来判断是否命中，使用武器、法术或特性允许的属性与熟练。</li>
</ul>

<p>熟练不是每次都加。只有规则说明角色熟练相应技能、豁免、武器、工具或其他检定时，才加入熟练加值。DM 也可以按情境要求不常见的属性与技能组合；先听清要求的是哪项属性，再从角色卡读取对应调整值。</p>

<h2>避开五个常见属性错误</h2>
<ol>
<li><strong>把属性值直接加到 d20。</strong>力量 16 通常贡献 +3，不是 +16。</li>
<li><strong>每次掷骰都加熟练。</strong>只有相关规则授予熟练时才加。</li>
<li><strong>把 4d6 当成唯一官方方法。</strong>标准数组、随机生成和购点都列在 2024 规则中。</li>
<li><strong>叠加 2014 Species 与 2024 Background 提升。</strong>使用同一套角色创建规则及其兼容说明。</li>
<li><strong>照抄一张通用属性排名。</strong>职业、护甲、特性和队伍职责比通用榜单更重要。</li>
</ol>

<h2>先检查角色卡，再让地图上的角色一眼可认</h2>
<p>开团前检查六项属性值与调整值、职业主属性、背景提升、熟练加值、豁免与技能熟练、AC、生命值、攻击加值，以及施法角色的法术豁免 DC。</p>

<p>数字确认后，再把角色缩到 Token 尺寸检查一次。打开 <a href="${ZH_EDITOR_PATH}">Token Maker 编辑器</a>，让脸部与标志性装备留在裁切范围内，再放到 VTT 网格上试读。属性负责告诉大家角色能做什么，Token 则要让大家马上认出轮到谁行动。</p>

<h2>DND 属性 FAQ</h2>
<h3>DND 的六项属性是什么？</h3>
<p>DND 的六项属性是力量、敏捷、体质、智力、感知和魅力。规则中也会把它们称为能力或能力值。</p>

<h3>DND 属性调整值怎样计算？</h3>
<p>属性值减 10，再除以 2 并向下取整。属性值 15 对应 +2，属性值 8 对应 −1。</p>

<h3>DND 标准数组是什么？</h3>
<p>2024 标准数组是 15、14、13、12、10、8。把六个数分别放入六项属性，再加入当前角色创建规则允许的属性提升。</p>

<h3>DND 最好的属性是哪一项？</h3>
<p>没有适合所有角色的最佳属性。职业主属性通常拿最高值，体质、敏捷与职业需要的第二属性再竞争其他高值。</p>

<h3>4d6 去最低是 DND 默认的属性生成方法吗？</h3>
<p>它是 2024 免费基础规则中的随机生成方法，但不是唯一方法。规则还列出标准数组和 27 点购点，DM 可以要求整场战役统一采用其中一种。</p>

<h2>参考来源</h2>
<ul>
<li><a href="${DND_2024_CHARACTER_CREATION_URL}" rel="noreferrer noopener">D&amp;D Beyond：2024 免费基础规则，创建角色</a></li>
<li><a href="${DND_2024_PLAYING_THE_GAME_URL}" rel="noreferrer noopener">D&amp;D Beyond：2024 免费基础规则，进行游戏</a></li>
<li><a href="${DND_2024_CHARACTER_ORIGINS_URL}" rel="noreferrer noopener">D&amp;D Beyond：2024 免费基础规则，角色出身</a></li>
<li><a href="${DND_2014_ABILITY_SCORES_URL}" rel="noreferrer noopener">Roll20：2014 免费基础规则，属性值</a></li>
</ul>
`;
