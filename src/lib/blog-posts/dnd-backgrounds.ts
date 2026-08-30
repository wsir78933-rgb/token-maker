import {
  DND_BACKGROUNDS_INLINE_IMAGE_PATH,
  DND_BACKGROUNDS_VIDEO_ID,
  DND_BACKGROUNDS_VIDEO_PLACEHOLDER_PATH,
  EN_COAT_OF_ARMS_MAKER_PATH,
  EN_DICE_ROLLER_PATH,
  EN_EDITOR_PATH,
  ZH_EDITOR_PATH,
  liteVideoEmbed,
} from './shared';

export const dndBackgroundsArticleHtml = String.raw`
<p><strong>A Dungeons &amp; Dragons background is the occupation and place that shaped the character before the first adventure.</strong> On a 2024 table it also writes ability score increases, an Origin feat, two skills, one tool, and either a gear pack or 50 GP. On a 2014 table it writes two skills, tools or languages, starting gear, a feature, and suggested personality notes. Copying a list from the other year is how a first sheet gets the wrong numbers.</p>
<p>Ask the Dungeon Master which rule year the campaign uses before you lock the origin. The 2024 Free Rules put class first, then background and species, then ability scores. The background you pick in that year feeds the score step. A 2014 table still ties most score increases to race, and the background is the story and the feature.</p>

<h2>Start with the rulebook year</h2>
<table>
  <thead>
    <tr>
      <th scope="col">Sheet field</th>
      <th scope="col">2014 rules</th>
      <th scope="col">2024 rules</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">What the origin is</th>
      <td>A past job plus a feature you can use in play</td>
      <td>A past job plus scores, an Origin feat, skills, a tool, and gear or gold</td>
    </tr>
    <tr>
      <th scope="row">Ability score increases</th>
      <td>Usually come from race</td>
      <td>Come from the background: raise one listed score by 2 and another by 1, or raise all three by 1, none above 20</td>
    </tr>
    <tr>
      <th scope="row">Special benefit</th>
      <td>A named feature such as Shelter of the Faithful</td>
      <td>A specified Origin feat such as Magic Initiate or Lucky</td>
    </tr>
    <tr>
      <th scope="row">Skills and tools</th>
      <td>Two skills, plus tools, languages, or both</td>
      <td>Two specified skills and one tool</td>
    </tr>
    <tr>
      <th scope="row">Starting kit</th>
      <td>A printed equipment list</td>
      <td>A printed pack or 50 GP</td>
    </tr>
    <tr>
      <th scope="row">Personality tables</th>
      <td>Traits, ideals, bonds, and flaws are printed with the origin</td>
      <td>The origin still has a short story; languages are chosen in the origin step, not as a background grant</td>
    </tr>
    <tr>
      <th scope="row">Core handbook count</th>
      <td>Thirteen named origins in the 2014 Player's Handbook, plus printed variants</td>
      <td>Sixteen origins in the 2024 Player's Handbook</td>
    </tr>
  </tbody>
</table>
<p>Do not combine the two columns on your own. If a 2024 table allows an older origin, follow the conversion the table uses. Official guidance for older backgrounds at a 2024 table is: assign the three ability score points yourself, ignore a leftover race increase if you also brought an older species, and take an Origin feat of your choice when the old card has no feat.</p>

<h2>Four questions that pick the origin</h2>
<ol>
  <li><strong>Which book year is legal tonight?</strong> Write 2014 or 2024 at the top of the sheet. Every later choice hangs on that line.</li>
  <li><strong>What did this person do for years before the party formed?</strong> Name a temple, a shop, a wall, a ship, a street, or a library. The origin is that job, not a novel-length backstory.</li>
  <li><strong>Which numbers must move?</strong> On a 2024 sheet, look at the class primary ability, then pick an origin whose three listed scores include it. On a 2014 sheet, put the high scores on race and class, then pick an origin for skills and the feature you will actually use.</li>
  <li><strong>What should the rest of the table see?</strong> A holy symbol, a crowbar, a sickle, or travel-stained clothes should still read at token scale. If the portrait cannot show the job, the origin is only a line of text.</li>
</ol>
<p>Those four answers beat a tier list. Soldier is a clean match for a Strength Fighter. Sage is a clean match for a Wizard who lived in archives. Wayfarer is a clean match for someone who survived city streets. None of those is required. A Cleric can be a Guard. A Rogue can be a Sage. Ask whether you can explain the job in one sentence at the table. If two origins both fit the scores, keep the one whose tool and kit you will actually mark on the sheet.</p>

<img class="inline-article-image" src="${DND_BACKGROUNDS_INLINE_IMAGE_PATH}" alt="A tabletop comparison of sixteen 2024 backgrounds beside a blank character sheet and dice" loading="lazy" decoding="async" fetchpriority="low" width="1536" height="1024" />

<h2>The sixteen 2024 Player's Handbook backgrounds</h2>
<p>The 2024 Player's Handbook prints sixteen origins. The 2024 Free Rules print four of them in full: Acolyte, Criminal, Sage, and Soldier. The rest of this table uses the official catalog entries on D&amp;D Beyond for skills and feats, and matching handbook summaries for the three ability scores. If your digital card disagrees with the printed book, the book at the table wins.</p>
<table>
  <thead>
    <tr>
      <th scope="col">Background</th>
      <th scope="col">Ability scores</th>
      <th scope="col">Skills</th>
      <th scope="col">Origin feat</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Acolyte</th>
      <td>Intelligence, Wisdom, Charisma</td>
      <td>Insight, Religion</td>
      <td>Magic Initiate (Cleric)</td>
    </tr>
    <tr>
      <th scope="row">Artisan</th>
      <td>Strength, Dexterity, Intelligence</td>
      <td>Investigation, Persuasion</td>
      <td>Crafter</td>
    </tr>
    <tr>
      <th scope="row">Charlatan</th>
      <td>Dexterity, Constitution, Charisma</td>
      <td>Deception, Sleight of Hand</td>
      <td>Skilled</td>
    </tr>
    <tr>
      <th scope="row">Criminal</th>
      <td>Dexterity, Constitution, Intelligence</td>
      <td>Sleight of Hand, Stealth</td>
      <td>Alert</td>
    </tr>
    <tr>
      <th scope="row">Entertainer</th>
      <td>Strength, Dexterity, Charisma</td>
      <td>Acrobatics, Performance</td>
      <td>Musician</td>
    </tr>
    <tr>
      <th scope="row">Farmer</th>
      <td>Strength, Constitution, Wisdom</td>
      <td>Animal Handling, Nature</td>
      <td>Tough</td>
    </tr>
    <tr>
      <th scope="row">Guard</th>
      <td>Strength, Intelligence, Wisdom</td>
      <td>Athletics, Perception</td>
      <td>Alert</td>
    </tr>
    <tr>
      <th scope="row">Guide</th>
      <td>Dexterity, Constitution, Wisdom</td>
      <td>Stealth, Survival</td>
      <td>Magic Initiate (Druid)</td>
    </tr>
    <tr>
      <th scope="row">Hermit</th>
      <td>Constitution, Wisdom, Charisma</td>
      <td>Medicine, Religion</td>
      <td>Healer</td>
    </tr>
    <tr>
      <th scope="row">Merchant</th>
      <td>Constitution, Intelligence, Charisma</td>
      <td>Animal Handling, Persuasion</td>
      <td>Lucky</td>
    </tr>
    <tr>
      <th scope="row">Noble</th>
      <td>Strength, Intelligence, Charisma</td>
      <td>History, Persuasion</td>
      <td>Skilled</td>
    </tr>
    <tr>
      <th scope="row">Sage</th>
      <td>Constitution, Intelligence, Wisdom</td>
      <td>Arcana, History</td>
      <td>Magic Initiate (Wizard)</td>
    </tr>
    <tr>
      <th scope="row">Sailor</th>
      <td>Strength, Dexterity, Wisdom</td>
      <td>Acrobatics, Perception</td>
      <td>Tavern Brawler</td>
    </tr>
    <tr>
      <th scope="row">Scribe</th>
      <td>Dexterity, Intelligence, Wisdom</td>
      <td>Investigation, Perception</td>
      <td>Skilled</td>
    </tr>
    <tr>
      <th scope="row">Soldier</th>
      <td>Strength, Dexterity, Constitution</td>
      <td>Athletics, Intimidation</td>
      <td>Savage Attacker</td>
    </tr>
    <tr>
      <th scope="row">Wayfarer</th>
      <td>Dexterity, Wisdom, Charisma</td>
      <td>Insight, Stealth</td>
      <td>Lucky</td>
    </tr>
  </tbody>
</table>
<p>Each 2024 origin also grants one tool. Acolyte, Sage, and Scribe use Calligrapher's Supplies. Criminal and Wayfarer use Thieves' Tools. Soldier chooses a Gaming Set. Read the card for the rest. Equipment is always a listed pack or 50 GP, not both.</p>
<p>Folk Hero, Outlander, and Urchin are 2014 names. They are not on the 2024 sixteen. Farmer, Guard, Guide, and Wayfarer cover nearby jobs with new numbers. If you want the old name, bring the old card and convert it, or ask whether the campaign even uses 2024 origins.</p>

<h2>The thirteen 2014 Player's Handbook backgrounds</h2>
<p>The 2014 Player's Handbook prints thirteen named origins. Several have a printed variant, such as Spy for Criminal or Pirate for Sailor. Expansion books add more. For a first character, stay inside the handbook unless the Dungeon Master names another source.</p>
<table>
  <thead>
    <tr>
      <th scope="col">Background</th>
      <th scope="col">Skills</th>
      <th scope="col">Feature</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Acolyte</th>
      <td>Insight, Religion</td>
      <td>Shelter of the Faithful</td>
    </tr>
    <tr>
      <th scope="row">Charlatan</th>
      <td>Deception, Sleight of Hand</td>
      <td>False Identity</td>
    </tr>
    <tr>
      <th scope="row">Criminal</th>
      <td>Deception, Stealth</td>
      <td>Criminal Contact</td>
    </tr>
    <tr>
      <th scope="row">Entertainer</th>
      <td>Acrobatics, Performance</td>
      <td>By Popular Demand</td>
    </tr>
    <tr>
      <th scope="row">Folk Hero</th>
      <td>Animal Handling, Survival</td>
      <td>Rustic Hospitality</td>
    </tr>
    <tr>
      <th scope="row">Guild Artisan</th>
      <td>Insight, Persuasion</td>
      <td>Guild Membership</td>
    </tr>
    <tr>
      <th scope="row">Hermit</th>
      <td>Medicine, Religion</td>
      <td>Discovery</td>
    </tr>
    <tr>
      <th scope="row">Noble</th>
      <td>History, Persuasion</td>
      <td>Position of Privilege</td>
    </tr>
    <tr>
      <th scope="row">Outlander</th>
      <td>Athletics, Survival</td>
      <td>Wanderer</td>
    </tr>
    <tr>
      <th scope="row">Sage</th>
      <td>Arcana, History</td>
      <td>Researcher</td>
    </tr>
    <tr>
      <th scope="row">Sailor</th>
      <td>Athletics, Perception</td>
      <td>Ship's Passage</td>
    </tr>
    <tr>
      <th scope="row">Soldier</th>
      <td>Athletics, Intimidation</td>
      <td>Military Rank</td>
    </tr>
    <tr>
      <th scope="row">Urchin</th>
      <td>Sleight of Hand, Stealth</td>
      <td>City Secrets</td>
    </tr>
  </tbody>
</table>
<p>A 2014 Acolyte also learns two languages of your choice and carries a holy symbol, prayer book or wheel, incense, vestments, common clothes, and 15 gp. Other 2014 cards follow the same pattern: two skills, extra languages or tools, a kit, and a feature that is a social or exploration hook rather than a feat. Use the feature in session one or pick a different origin.</p>

<h2>Walk one origin through both years</h2>
<p>Take a level 1 Human Cleric who served in a temple. The job is Acolyte in both years. The sheet is not the same.</p>
<p>On a 2024 sheet you choose class first, then origin. Acolyte lists Intelligence, Wisdom, and Charisma. Raise Wisdom by 2 and Intelligence or Charisma by 1, or raise all three by 1. You gain Magic Initiate (Cleric): two Cleric cantrips and one level 1 Cleric spell you can cast once per Long Rest without a slot. You are proficient in Insight, Religion, and Calligrapher's Supplies. You take the temple kit or 50 GP. Species is a separate choice and does not add the old racial score bump.</p>
<p>On a 2014 sheet the same Human usually takes the race increases, then Acolyte for Insight, Religion, two languages, the temple kit, and Shelter of the Faithful. That feature gets you modest care from people who share the faith and a tie to a temple. It does not give Magic Initiate. If you later port this character into a 2024 game, do not keep both the 2014 race increases and a 2024 Acolyte increase. Pick one rules year and rebuild the origin line.</p>
<p>Write the origin name on the sheet only after those numbers are assigned. Then answer who raised the character, whether they are still in the temple, and why they left. Those notes are free. They do not replace the feat or the feature.</p>

<h2>Older origins at a 2024 table</h2>
<p>Plenty of tables still love Folk Hero, Haunted One, or a setting origin from an older book. Official conversion for an older background on a 2024 character is narrow: you assign the three score points, you drop a leftover species increase from the old race block, and you add an Origin feat if the old card has none. Skills and gear stay with the old card unless the Dungeon Master says otherwise.</p>
<p>That conversion is not a license to stack a 2014 feature, a 2024 Origin feat, and two sets of score increases. If the Dungeon Master wants full 2024 math, use one of the sixteen. If the table is still on 2014 Basic Rules, ignore Origin feats and keep Shelter of the Faithful, Rustic Hospitality, and the rest. Write the allowed source list next to the year so a later digital builder cannot silently swap in an expansion origin.</p>

<h2>Make the origin readable on the map</h2>
<p>Once the origin is on the sheet, the figure on the grid should match it. <a href="${EN_EDITOR_PATH}">Token Maker</a> is a browser VTT token maker: drop portrait art into the workspace, pick a circle, square, or polygon mask, add a border or label, and export a transparent PNG for Roll20, Foundry VTT, or Owlbear. Portrait files can stay in the browser during the normal crop and export pass. Export size goes up to 2048 pixels when you need archive quality; 512 or 1024 is enough for most live maps.</p>
<p>Use the job as the visual cue, not a second costume drama. An Acolyte needs a clear holy symbol or vestment edge. A Soldier needs a spear silhouette or a rank mark that still reads when the token is small. A Criminal needs a dark coat and a tool, not a full alley diorama. Square tokens keep shoulders and props; circular tokens keep the face. If the origin is Noble or Merchant, a <a href="${EN_COAT_OF_ARMS_MAKER_PATH}">coat of arms</a> on a handout can sit beside the token instead of inside the crop. If you still need to roll the 4d6-drop-lowest array, use the on-site <a href="${EN_DICE_ROLLER_PATH}">dice roller</a>, then come back and assign the background increases.</p>
${liteVideoEmbed(DND_BACKGROUNDS_VIDEO_ID, 'Medieval Fantasy Tavern | D&amp;D Fantasy Music and Ambience', {
  src: DND_BACKGROUNDS_VIDEO_PLACEHOLDER_PATH,
  alt: 'Play control over a dim tavern interior used as the click-to-load soundtrack thumbnail',
})}

<p>Play the linked tavern ambience after you click to load it. It is mood, not a rules lecture. Keep this page open for the year check, the sixteen-row table, and the four questions while the music runs. When the token and the sheet agree, session one does not start with a stranger on the map.</p>

<h2>DnD backgrounds FAQ</h2>
<h3>What does a DnD background give you?</h3>
<p>On 2024 rules it gives three listed ability scores to raise, a specified Origin feat, two skills, one tool, and either a gear pack or 50 GP. On 2014 rules it gives two skills, tools or languages, starting gear, a feature, and suggested personality tables. Always match the grant to the year on the sheet.</p>
<h3>How many backgrounds are in the 2024 Player's Handbook?</h3>
<p>Sixteen. The 2024 Free Rules include full text for Acolyte, Criminal, Sage, and Soldier. The other twelve are in the Player's Handbook. Expansion books add more names; ask which sources the campaign allows before you treat a catalog dump as the core list.</p>
<h3>Do 2024 backgrounds increase ability scores?</h3>
<p>Yes. Each 2024 background lists three scores. Increase one by 2 and a different one by 1, or increase all three by 1. None of those increases can raise a score above 20. In 2024, species does not supply those increases.</p>
<h3>Can I use a 2014 background in a 2024 game?</h3>
<p>Yes, if the Dungeon Master allows it. Official conversion says you assign the three ability score points, ignore an old race increase if you also brought an older species, and gain an Origin feat of your choice when the old card has no feat. Do not keep two full score packages.</p>
<h3>What is a DnD Origin feat?</h3>
<p>An Origin feat is the 2024 talent attached to a background, such as Alert, Crafter, Healer, Lucky, Magic Initiate, Musician, Savage Attacker, Skilled, Tavern Brawler, or Tough. Humans also gain an extra Origin feat from the species trait. It is not the same as a 2014 background feature.</p>
<h3>What is the best DnD background for a beginner?</h3>
<p>The best first pick is one whose job you can say in one sentence and whose numbers you can copy without mixing years. Soldier, Sage, Acolyte, and Criminal are printed in the 2024 Free Rules, so they are easy to check. There is no universal strongest origin.</p>
`;

export const dndBackgroundsArticleHtmlZh = String.raw`
<p>选背景时，最常见的弯路是先搜“哪个最强”，后来才发现熟练项重复，或身世很长却说不清为何冒险。更稳的顺序是先确认版本，再看队伍缺口，最后让过去能在桌上制造决定。</p>

<h2>先分清：你玩的是 2014 还是 2024 规则</h2>

<p>DND 5E 背景在两套规则里的职责不同，不能把表格直接混用。2014 基础规则把背景当作职业之外的生活经历：它提供故事提示、技能熟练、工具或语言、起始装备和背景特性，并给出个性、理念、羁绊与缺点的建议。</p>

<p>2024 基础规则则让背景承担更多建卡数值。每个背景列出三项候选能力值、一项指定的起源专长、两项技能熟练、一项工具熟练，以及装备包或五十金币。看到同名的侍僧、罪犯、学者或士兵时，先看角色表采用哪一版，不要只凭名称抄选项。</p>

<p>旧背景配新规则时，按当前兼容说明和 DM 的决定处理。先问：“这次建卡以哪一版背景为准？”答案没定，强弱比较就没有意义。</p>

<h2>五步选出真正适合的背景</h2>

<h3>一、写下角色在队伍里要完成的事</h3>

<p>先写一件角色经常做的事，例如侦察、交涉、查资料或保护前排。背景技能应让它更可靠，或补上职业没覆盖的场景。</p>

<h3>二、排查重复熟练</h3>

<p>把职业、种族或物种与背景给的熟练项并排看。2014 规则遇到从不同来源重复取得同类熟练时，可以换成同类的另一项选择；2024 背景的项目更固定，应按该版规则和 DM 的说明处理。不要为了一个好听的名字浪费角色已经拥有的能力。</p>

<h3>三、检查队伍缺口，而不是追榜单</h3>

<p>同一个背景在不同队伍里的价值会变。已有两名角色擅长隐匿，第三份隐匿未必比洞悉、调查或生存更有用。缺少交涉时，能连接公会、军队或神殿的过去反而更常推动剧情。</p>

<h3>四、用一个场景测试背景</h3>

<p>想象角色刚进城、线索中断或旧关系上门。背景能否让他采取具体行动？若答案只有“我以前是某某”，就补上认识谁、欠谁什么，以及为何不能回去。</p>

<h3>五、再确认数值与故事说的是同一个人</h3>

<p>最后检查技能、工具、专长和装备是否支持这段过去。故事不能代替合法配置；两者对齐后，再请 DM 确认来源与范围。</p>

<img class="inline-article-image" src="${DND_BACKGROUNDS_INLINE_IMAGE_PATH}" alt="DND 5E 背景选择流程：确认版本、检查熟练、补足队伍缺口，再写下故事钩子" loading="lazy" decoding="async" fetchpriority="low" width="1536" height="1024" />

<h2>六个常见背景该怎么理解</h2>

<p>2014 基础规则有六个易对照的示例：侍僧连接信仰与神殿，罪犯连接潜行与地下关系，平民英雄连接社区，贵族连接家族与责任，学者连接研究，士兵连接纪律与军旅关系。</p>

<p>这些不是职业配方。战士可以曾是学者，法师也可以来自军队。好搭配不只补数值，还会制造一个有意思的反差：他为何离开熟悉的道路，又带着什么旧习进入新职业？</p>

<h2>2014 自定义背景的边界</h2>

<p>2014 基础规则允许调整背景：选择任意两项技能，并从示例背景的工具熟练与语言中合计选择两项；可以采用背景装备包，或按规则花钱购买。背景特性若要替换，尤其是自行创作，应与 DM 一起确认。然后写下两项个性、一项理念、一项羁绊和一项缺点。</p>

<p>自定义不是把所有强项拼成一包。一个“禁书抄写员”可以用调查与隐匿表现工作方式，用一门语言和书法工具表现经历，再用“旧雇主正在找回那本书”连接剧情。每个选择都回答同一个过去，角色就不会像零件清单。</p>

<h2>两个快速示例</h2>

<p>第一名角色想当善于查线索的游荡者。使用 2014 规则时，可从学者或自定义背景出发，避开职业已有熟练，再写成“曾替贵族整理被封存的家谱”。知识与潜行由此来自同一份秘密工作。</p>

<p>第二名角色使用 2024 规则，想做重视学识的施法者。不能只看“学者”这个名字，还要检查能力值、起源专长、技能、工具和装备。若不合适，就换背景或请 DM 确认来源，别私自套用 2014 的自定义方式。</p>

<h2>把过去变成会继续发生的故事</h2>

<p>用四个问题收尾：谁还记得你？欠下什么？哪项旧习会在压力下出现？什么消息会改变计划？与其写“我重视家人”，不如写“我把佣金寄给经营渡口的姐姐，而渡口最近停航了”。</p>

<p>角色动机定下来后，视觉也更容易统一。你可以在 <a href="${ZH_EDITOR_PATH}">Token Maker</a> 上传立绘，用圆形、方形或多边形遮罩、边框和文字表现旧阵营、身份或伤痕，再导出透明 PNG。不要把整段身世塞进头像；保留一个玩家缩小地图后仍能认出的线索就够了。</p>

<p>写背景时若需要氛围，可以播放页面中的中世纪奇幻酒馆音乐。它是环境音乐，不是规则教学；让它陪你想象角色离开故乡前的最后一晚，再把真正影响选择的事实写回角色卡。

${liteVideoEmbed(DND_BACKGROUNDS_VIDEO_ID, '中世纪奇幻酒馆：写 DND 5E 角色背景时的氛围音乐', {
  src: DND_BACKGROUNDS_VIDEO_PLACEHOLDER_PATH,
  alt: '中世纪奇幻酒馆音乐视频封面，适合在构思 DND 5E 角色过去时播放',
})}</p>

<h2>建卡前最后检查</h2>

<p>把检查结果读给同桌玩家听一次。如果别人能迅速说出角色擅长什么、为何出发，以及哪段旧关系可能惹麻烦，这个背景就已经不只是角色卡上的一行名称。</p>

<ul><li>规则版本已经由全团确认。</li><li>熟练、专长、工具和装备来自同一套合法规则。</li><li>背景补足角色任务或队伍缺口。</li><li>至少有一名关系人、一项债务或一个未解决的问题。</li><li>DM 已确认自定义内容和可用来源。</li></ul>

<h2>常见问题</h2>

<h3>DND 5E 背景和职业有什么区别？</h3>

<p>职业描述角色成为冒险者后训练出的核心能力，背景描述此前最重要的生活经历。两者会在技能或主题上交叉，但背景不等于副职业，也不该额外塞入职业等级才会获得的能力。</p>

<h3>DND 5E 背景有唯一最强选择吗？</h3>

<p>没有脱离版本、职业和队伍的统一答案。先看规则组件是否合法，再看它是否补足常用任务，最后确认故事钩子会不会进入战役。只在真空里比较单项收益，容易忽略实际出场次数。</p>

<h3>2014 背景可以自定义吗？</h3>

<p>可以。官方基础规则允许选择任意两项技能，并合计选择两项工具熟练或语言，也可以调整装备取得方式；背景特性的替换或新创内容应与 DM 一起完成。</p>

<h3>2024 背景可以直接套用 2014 的自定义规则吗？</h3>

<p>不要默认可以。2024 背景有自己的能力值、起源专长、技能、工具和装备结构。若要使用旧书背景或自定义方案，应先查看团里采用的规则来源，并让 DM 明确确认。</p>

<h3>背景与职业给了同一个熟练怎么办？</h3>

<p>在 2014 规则中，从两个来源重复获得同一种熟练时，可改选同类的另一项熟练。使用 2024 规则时，按该版角色创建规则和 DM 的说明处理，不要自行跨版本替换。</p>
`;
