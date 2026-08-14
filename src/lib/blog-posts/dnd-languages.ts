import {
  DND_2024_CHARACTER_CREATION_URL,
  DND_LANGUAGES_2014_SRD_URL,
  EN_DND_RACES_PATH,
  EN_EDITOR_PATH,
  ZH_DND_RACES_PATH,
  ZH_EDITOR_PATH,
} from './shared';

export const dndLanguagesArticleHtml = String.raw`
<p><strong>If you are making a 2024 D&amp;D character, start with Common plus two choices from the Standard Languages table.</strong> Pick the two that give your campaign somewhere to go: a conversation you can have, a clue you can read, or a piece of your character’s past that another player can react to.</p>

<p>There is no universal best pair. The 2014 and 2024 character-creation processes are different, and the campaign premise matters more than a generic ranking. This guide keeps that boundary clear, then gives you a quick way to make the choice useful at the table.</p>

<h2>2014 and 2024 language choices are not the same process</h2>
<p>In the <a href="${DND_2024_CHARACTER_CREATION_URL}" rel="noreferrer noopener">2024 Basic Rules character-creation step</a>, a character knows at least three languages: Common plus two languages rolled or chosen from the Standard Languages table. Knowing a language includes speaking, reading, and writing it. A class or another feature can add more later.</p>

<p>The <a href="${DND_LANGUAGES_2014_SRD_URL}" rel="noreferrer noopener">2014 SRD language rules</a> begin from a different place. A race indicates starting languages and a background can add another choice. With the GM’s permission, that version can also open exotic or secret languages. Use the rulebook your table is actually playing instead of combining both procedures on one sheet.</p>

<table><thead><tr><th scope="col">Your table uses</th><th scope="col">Start here</th><th scope="col">Then check</th></tr></thead><tbody>
<tr><th scope="row">2024 Basic Rules</th><td>Common plus two standard languages</td><td>Features or campaign options that grant more</td></tr>
<tr><th scope="row">2014 5e / SRD 5.1</th><td>Race and background entries</td><td>Exotic, secret, and setting-specific choices</td></tr>
</tbody></table>

<h2>The 2024 standard D&amp;D languages</h2>
<p>The 2024 table lists Common Sign Language, Draconic, Dwarvish, Elvish, Giant, Gnomish, Goblin, Halfling, and Orc as standard choices alongside Common. They are widespread languages, which makes them a sensible starting pool. The right one still depends on the people and places your campaign puts in front of you.</p>

<table><thead><tr><th scope="col">Language</th><th scope="col">Choose it when</th><th scope="col">Give the DM this hook</th></tr></thead><tbody>
<tr><th scope="row">Common Sign Language</th><td>You want quiet coordination or learned it in a shared community.</td><td>I can warn the scout without shouting across the ruin.</td></tr>
<tr><th scope="row">Draconic</th><td>Dragons, dragonborn, arcane records, or cults fit the campaign.</td><td>My apprenticeship included copying old dragon diagrams.</td></tr>
<tr><th scope="row">Dwarvish</th><td>The map has mines, holds, stonework, or dwarf communities.</td><td>I know trade terms from a stonemason relative.</td></tr>
<tr><th scope="row">Elvish</th><td>Ancient woods, courts, or long-lived history matter.</td><td>I recognize the formal script on old boundary stones.</td></tr>
<tr><th scope="row">Giant</th><td>Giant routes, highlands, or giant-made ruins are likely.</td><td>I can read a warning carved for trespassers.</td></tr>
<tr><th scope="row">Gnomish</th><td>Inventors, workshops, or scholarly groups have a place in the story.</td><td>I learned workshop shorthand while repairing field gear.</td></tr>
<tr><th scope="row">Goblin</th><td>Goblinoid factions or frontier negotiations are on the table.</td><td>I know the words that stop a patrol from assuming the worst.</td></tr>
<tr><th scope="row">Halfling</th><td>River routes, village networks, or caravan life shape the campaign.</td><td>I picked it up from the caravans that raised me.</td></tr>
<tr><th scope="row">Orc</th><td>Borderlands, mercenary history, or an orc community matters to the character.</td><td>I can speak to people our employer keeps calling raiders.</td></tr>
</tbody></table>

<h2>Rare languages need a campaign reason</h2>
<p>The 2024 Basic Rules separates rare languages because they are secret or connected to other planes. Abyssal, Celestial, Deep Speech, Druidic, Infernal, Primordial, Sylvan, Thieves’ Cant, and Undercommon all have a narrower story fit. Some features grant one of them.</p>

<p>Choose a rare language because the campaign already gives you a hook: a fiend problem, a temple, an aberration mystery, a druid circle, an elemental site, a fey bargain, or a route through the Underdark. Before you write it down, ask the DM one direct question: “Will this give us a real scene, clue, contact, or complication?” A specific yes is enough. A vague hope is not.</p>

<h2>Pick your two languages with four questions</h2>
<h3>1. Where will the campaign spend time?</h3>
<p>Read the campaign pitch again. A frontier game makes Goblin, Giant, Orc, or Dwarvish more concrete when those groups are part of the map. Write down one place, not a mood: the old dwarven road, the river towns, a city with goblin neighborhoods, or the forest near a fey crossing.</p>

<h3>2. Who did your character know before adventuring?</h3>
<p>Pick one language from a person, job, faith, neighborhood, or promise. A Wizard who copied a mentor’s dragon notes has a reason for Draconic. A Fighter who learned Orc on a border patrol has one too. The language becomes a usable detail instead of an ornament.</p>

<h3>3. What scene do you want to unlock?</h3>
<p>Choose one on purpose: a conversation with an NPC, a written clue, or quiet coordination. Put a sentence beside the language on your sheet. “I can read the warning, but the name on it belongs to my family” gives the DM far more to work with than a checkbox.</p>

<h3>4. Does another player already cover it?</h3>
<p>Overlap is fine when it means something. Two characters who share Dwarvish might have a history; one who learned it from trade and one from a clan will approach the same scene differently. If the party already covers the campaign’s obvious language, use your other pick to reveal your character’s past.</p>

<p><strong>No campaign details yet?</strong> Take one language tied to your character history and one tied to the first adventure location. Then ask the DM for one small payoff for each. That is a better default than chasing an answer that is supposedly optimal everywhere.</p>

<h2>Make the choice show up in play</h2>
<p>Language scenes work when they create a decision instead of a private translation cutscene. Offer the DM one prompt: “I recognize the script, but the message names someone from my past. Do I admit that?” Or: “I can speak to the guard. What promise would make them listen?”</p>

<p>On a VTT map, keep the mechanical choice on the sheet and make the character easy to recognize. A scholar’s marked folio, a border scout’s cloak, a temple seal, or a river-trader color can support the story without turning a token into a paragraph. When the concept is ready, <a href="${EN_EDITOR_PATH}">open Token Maker</a> to crop the portrait, add a restrained border or label, and export a transparent PNG for Roll20, Foundry VTT, or Owlbear.</p>

<p>Still building the character? The <a href="${EN_DND_RACES_PATH}">D&amp;D races guide</a> can help you shape the origin before you settle on the language hooks.</p>

<h2>D&amp;D languages FAQ</h2>
<h3>How many languages does a 2024 D&amp;D character know?</h3>
<p>The 2024 Basic Rules says a character knows at least three: Common plus two languages rolled or chosen from the Standard Languages table. A class or another feature can add languages.</p>

<h3>Can a 2024 character choose a rare language at level 1?</h3>
<p>The basic character-creation step gives two choices from the Standard Languages table. Rare languages are separate, and some features grant them. Ask the DM before treating a rare language as a substitute for a standard starting choice.</p>

<h3>Do D&amp;D languages include reading and writing?</h3>
<p>In the 2024 Basic Rules, knowing a language means your character can communicate in it, read it, and write it. Older books and campaign rules can frame language grants differently.</p>

<h3>What are the best D&amp;D languages to choose?</h3>
<p>There is no best pair without a campaign. Take one language tied to your character’s past and one tied to likely places, people, or problems in the adventure.</p>

<h2>Sources</h2><ul>
<li><a href="${DND_2024_CHARACTER_CREATION_URL}" rel="noreferrer noopener">D&amp;D Beyond Basic Rules: Creating a Character</a></li>
<li><a href="${DND_LANGUAGES_2014_SRD_URL}" rel="noreferrer noopener">5thSRD: Languages</a></li>
</ul>
`;

export const dndLanguagesArticleHtmlZh = String.raw`
<p><strong>先记住 2024 版的结论：角色会 Common，再从标准语言表里选或掷两门语言。</strong>别急着问哪两门“最强”。更实用的判断是：它能不能帮你和某个 NPC 说话、读懂一条线索，或让角色过去的人际关系在桌上有东西可演。</p>

<p>没有一组适合所有战役的答案。2014 和 2024 的角色创建流程不同，战役简介也比通用排名更重要。下面先把版本边界说清楚，再用四个问题帮你做选择。</p>

<h2>2014 和 2024 的语言选择流程并不一样</h2>
<p>在<a href="${DND_2024_CHARACTER_CREATION_URL}" rel="noreferrer noopener">2024 基础规则的角色创建步骤</a>里，角色至少懂三门语言：Common 加上从标准语言表中掷出或选出的两门。懂一门语言，代表角色能说、能读、能写；职业或其他特性之后还会再给语言。</p>

<p><a href="${DND_LANGUAGES_2014_SRD_URL}" rel="noreferrer noopener">2014 SRD 的语言规则</a>从 Race 和 Background 出发，背景有时会多给一门。得到 GM 同意时，还能选异域语言或秘密语言。角色卡别把两套流程拼在一起，先确认这桌实际在用哪本规则。</p>

<table><thead><tr><th scope="col">桌上使用的规则</th><th scope="col">先看哪里</th><th scope="col">再确认什么</th></tr></thead><tbody>
<tr><th scope="row">2024 基础规则</th><td>Common 加两门标准语言</td><td>职业、特性或战役选项会不会再给语言</td></tr>
<tr><th scope="row">2014 5e / SRD 5.1</th><td>Race 和 Background 条目</td><td>异域、秘密与设定专属语言</td></tr>
</tbody></table>

<h2>2024 版的 DND 标准语言</h2>
<p>2024 表格把 Common Sign Language、Draconic、Dwarvish、Elvish、Giant、Gnomish、Goblin、Halfling 和 Orc 列为标准选项，另有 Common。它们在 D&amp;D 世界里更常见，所以适合作为起点；最后怎么选，还是看战役会让你遇见谁、走到哪里。</p>

<table><thead><tr><th scope="col">语言</th><th scope="col">适合什么情况</th><th scope="col">给 DM 的一个钩子</th></tr></thead><tbody>
<tr><th scope="row">Common Sign Language</th><td>想安静沟通，或角色来自会使用它的共同体。</td><td>我能隔着遗迹提醒斥候，不必大声喊。</td></tr>
<tr><th scope="row">Draconic</th><td>龙、Dragonborn、奥术记录或邪教会进入战役。</td><td>学徒时期我替导师誊过龙语图纸。</td></tr>
<tr><th scope="row">Dwarvish</th><td>地图上有矿坑、要塞、石造遗迹或矮人社区。</td><td>我从石匠亲戚那里学过行话。</td></tr>
<tr><th scope="row">Elvish</th><td>古老森林、宫廷或漫长历史是重点。</td><td>我认得界碑上那种正式写法。</td></tr>
<tr><th scope="row">Giant</th><td>巨人路线、高地或巨人遗迹会出现。</td><td>我能看懂写给闯入者的警告。</td></tr>
<tr><th scope="row">Gnomish</th><td>工坊、发明家或学术圈会影响故事。</td><td>修野外装备时我学过工坊速记。</td></tr>
<tr><th scope="row">Goblin</th><td>会与地精类势力或边境巡逻队打交道。</td><td>我知道怎么先让巡逻队别把人当敌人。</td></tr>
<tr><th scope="row">Halfling</th><td>河道、小镇网络或商队生活是背景。</td><td>养大我的商队一路都在说这门语言。</td></tr>
<tr><th scope="row">Orc</th><td>边境、佣兵经历或兽人社区和角色有关。</td><td>我能和雇主口中的“袭击者”直接谈。</td></tr>
</tbody></table>

<h2>异域语言必须先有战役理由</h2>
<p>2024 基础规则把异域语言单列出来，因为它们要么是秘密语言，要么和其他位面有关。Abyssal、Celestial、Deep Speech、Druidic、Infernal、Primordial、Sylvan、Thieves’ Cant 和 Undercommon 都更挑故事背景，有些特性会直接给其中一门。</p>

<p>先有钩子，再拿语言：恶魔问题、神殿、异怪谜团、德鲁伊圈子、元素遗址、妖精交易，或下到幽暗地域的路线。写进角色卡前，直接问 DM：“这门语言能不能换来一个场景、线索、联系人或麻烦？”答案足够具体，就值得选；只剩模糊期待，就先别占掉位置。</p>

<h2>用四个问题选出你的两门语言</h2>
<h3>1. 战役会在哪些地方展开？</h3>
<p>重看战役简介。边境故事里如果地精、巨人、兽人就在地图上，Goblin、Giant、Orc 或 Dwarvish 就有具体落点。把答案写成地点，不要只写“荒野”：旧矮人道路、河港小镇、地精街区，或妖精裂隙旁的森林。</p>

<h3>2. 冒险之前，角色认识谁？</h3>
<p>从某个人、工作、信仰、社区或承诺里选一门。法师不是因为看起来有学问才懂 Draconic；替导师誊过龙语笔记，才是故事。边境巡逻里学了 Orc 的战士也一样。这样语言就不只是装饰。</p>

<h3>3. 你希望它打开哪类场景？</h3>
<p>有意识地选一种：和 NPC 交谈、读懂书面线索，或安静协作。给角色卡留一句话：“我看得懂这块警告牌，但上面的名字属于我家。”DM 看到这句话，就知道该怎样把它放进游戏。</p>

<h3>4. 队友已经覆盖了吗？</h3>
<p>重复并不等于浪费。两个人都会 Dwarvish，可以是共同历史；一个来自商路，一个来自氏族，遇到同一件事也会有不同态度。要是队伍已经覆盖最明显的战役语言，就让第二门语言更像你角色的过去。</p>

<p><strong>还不知道战役内容？</strong>一门从角色经历出发，一门从第一段冒险地点出发，然后请 DM 给每门语言各放一个小回报。这样比寻找“放到哪里都最优”的答案更靠谱。</p>

<h2>让语言真的在桌上出现</h2>
<p>好的语言场景会逼角色做决定，不该只是你单独翻译完再继续。你可以对 DM 说：“我认得这段文字，但它提到了过去的人。我该不该说出来？”或者：“我能和守卫交谈，什么承诺能让他听我一句？”</p>

<p>线上地图上，规则层面的语言记在角色卡里就够了，Token 只要让人看出角色是谁。学者的一叠批注、边境斥候的斗篷、神殿印记，或河商的配色，都能支持这段背景。角色概念定下来后，可以用 <a href="${ZH_EDITOR_PATH}">Token Maker</a> 裁好头像，加克制的边框或标签，再导出透明 PNG 给 Roll20、Foundry VTT 或 Owlbear 使用。</p>

<p>如果角色出身还没定，可以继续看 <a href="${ZH_DND_RACES_PATH}">DND 种族与 Species 指南</a>，把起源和语言钩子一起想清楚。</p>

<h2>DND 语言常见问题</h2>
<h3>2024 版 DND 角色一开始会几门语言？</h3>
<p>2024 基础规则写的是至少三门：Common 加上从标准语言表中掷出或选出的两门。职业或其他特性还可能再给语言。</p>
<h3>2024 角色一级能直接选异域语言吗？</h3>
<p>基础角色创建步骤给的是两门标准语言。异域语言单独列出，有些特性会授予它们。想把异域语言当成标准起始选择的替代项，先问 DM。</p>
<h3>DND 语言包含读和写吗？</h3>
<p>2024 基础规则里，懂一门语言代表能交流、能读、能写。旧书和战役规则对语言来源的写法可能不同，按桌上实际版本处理。</p>
<h3>DND 语言到底选哪两门最好？</h3>
<p>脱离战役不存在最好的一对。先选一门来自角色过去的语言，再选一门和冒险地点、人物或问题有关的语言。</p>

<h2>资料来源</h2><ul>
<li><a href="${DND_2024_CHARACTER_CREATION_URL}" rel="noreferrer noopener">D&amp;D Beyond 基础规则：Creating a Character</a></li>
<li><a href="${DND_LANGUAGES_2014_SRD_URL}" rel="noreferrer noopener">5thSRD：Languages</a></li>
</ul>
`;
