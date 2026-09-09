import {
  DND_RANGER_DECISION_PLAN_IMAGE_PATH,
  DND_RANGER_VIDEO_ID,
  DND_RANGER_VIDEO_PLACEHOLDER_PATH,
  liteVideoEmbed,
} from './shared';

export const dndRangerArticleHtml = String.raw`
<p>Ranger works best when you choose the job you want the character to perform before you choose a list of features or spells. The class can combine weapon pressure with nature magic, scouting, tracking, and wilderness problem-solving, but the exact route depends on whether your table uses the 2014 or 2024 rules. Write that edition at the top of your character notes, choose one primary party job, and then build the first five levels around a check you can make at the table.</p>
<p>This guide is for a player who has a Ranger concept and needs a usable starting direction. It does not replace the rulebook or reproduce every class feature. Use it to separate edition rules from build advice, select a subclass from the source you actually own or use, and turn a finished character concept into an optional visual token for a virtual tabletop.</p>
<h2>What a Ranger does in a party</h2>
<p>A Ranger is a martial character with a strong connection to nature and the ability to solve problems before or around combat. The official 2014 Ranger description places the class in a wilderness of tracking, hunting, stealth, and protecting the borderlands. The 2024 Free Rules page starts with a compact set of core traits and a level-by-level feature table. Read the <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes#Ranger">2014 Basic Rules Ranger entry</a> or the <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Ranger">2024 Free Rules Ranger entry</a> that matches your table; the class identity is useful, but the feature timing is edition-specific.</p>
<p>At the table, think in terms of jobs rather than a single stereotype:</p>
<table><thead><tr><th scope="col">Party job</th><th scope="col">What the Ranger contributes</th><th scope="col">A useful check before you commit</th></tr></thead><tbody>
<tr><th scope="row">Ranged pressure</th><td>Reliable attacks from a position that does not block the front line</td><td>Can the map give you a clear lane, and can another character protect you when enemies close in?</td></tr>
<tr><th scope="row">Skirmishing</th><td>Movement between safe positions, opportunistic attacks, and a second line of pressure</td><td>What lets you leave a bad square without abandoning the party's plan?</td></tr>
<tr><th scope="row">Scouting</th><td>Information about routes, tracks, threats, and approaches</td><td>Who acts on the information after you find it?</td></tr>
<tr><th scope="row">Wilderness support</th><td>Travel, terrain awareness, and a nature-focused problem-solving angle</td><td>Does the campaign actually visit places where this knowledge changes a decision?</td></tr>
<tr><th scope="row">Monster or threat focus</th><td>A character concept built around recognizing and preparing for a type of danger</td><td>Is the focus a story hook, a source-backed feature, or merely a visual theme?</td></tr>
</tbody></table>
<p>These jobs can overlap. A frontier scout might use a bow, but a Ranger can also fight at close range or serve as the character who keeps the group from walking into an avoidable problem. A Fighter comparison is useful when you are deciding how much of your turn should stay focused on weapon attacks. A Rogue comparison is useful when you are deciding whether stealth and scouting are your main contribution. A Druid comparison is useful when you want broader nature magic or a different spell-centered role. Those comparisons describe play emphasis, not restrictions on who may choose a weapon, background, or personality.</p>
<p>The question “Is Ranger good?” has no answer independent of the campaign. A class that covers a missing scouting or ranged job may be more useful to your group than a theoretically stronger option that duplicates three existing characters. Start with the encounters your table is likely to present, then check whether your edition and source support the choices you want to make.</p>
<h2>Pick the rules version before you build</h2>
<p>Do not copy a 2014 feature table into a 2024 character sheet, or the other way around. Both versions use the name Ranger, but their early progression and spell workflow differ. Write <code>2014</code> or <code>2024</code> beside the character name, then keep the matching official page open while you make choices.</p>
<table><thead><tr><th scope="col">Checkpoint</th><th scope="col">2014 Ranger</th><th scope="col">2024 Ranger</th></tr></thead><tbody>
<tr><th scope="row">Spellcasting begins</th><td>Level 2</td><td>Level 1</td></tr>
<tr><th scope="row">Spell workflow</th><td>The class table uses Spells Known; the class selects a limited number from its spell list</td><td>The class prepares Ranger spells from its list; the 2024 entry describes the preparation and replacement process</td></tr>
<tr><th scope="row">Level 1 identity</th><td>Favored Enemy and Natural Explorer</td><td>Spellcasting, Favored Enemy, and Weapon Mastery</td></tr>
<tr><th scope="row">Level 2 identity</th><td>Fighting Style and Spellcasting</td><td>Deft Explorer and Fighting Style</td></tr>
<tr><th scope="row">Level 3 choice</th><td>Ranger Archetype and Primeval Awareness</td><td>Ranger Subclass</td></tr>
<tr><th scope="row">Level 5 milestone</th><td>Extra Attack</td><td>Extra Attack</td></tr>
</tbody></table>
<img class="inline-article-image" src="${DND_RANGER_DECISION_PLAN_IMAGE_PATH}" alt="A Ranger decision plan that separates edition, party job, and first-session checks" loading="lazy" decoding="async" fetchpriority="low" width="1536" height="1024" />
<p>The table is a switchboard, not a substitute for the feature text. In the <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes#Ranger">2014 Ranger entry</a>, level 2 spellcasting belongs to the Spells Known model. In the <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Ranger">2024 Ranger entry</a>, spellcasting starts at level 1 and uses prepared Ranger spells. That one difference changes what you write down at character creation and when you can revise the list.</p>
<p>Hunter’s Mark is another reason to keep the editions separate. The <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#HuntersMark">2014 spell text</a> describes a weapon-attack trigger and extra 1d6 damage, while the <a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#HuntersMark">2024 spell text</a> uses an attack-roll trigger and extra 1d6 Force damage. The surrounding Ranger feature also handles the spell differently in the two versions. If you want spell-by-spell choices, use the <a href="https://www.tokenmaker.one/blog/dnd-ranger-spells">DND Ranger Spells guide</a> after recording your edition; this article only needs the version check so the two workflows do not become one invented hybrid.</p>
<p>The supplied video can be an optional orientation resource. Use its title and presentation as a starting point for the character concept, not as a replacement for the edition page: before copying a feature, spell rule, or subclass option, verify the wording in the 2014 or 2024 source your group uses.</p>
${liteVideoEmbed(DND_RANGER_VIDEO_ID, 'A Crap Guide to D&D [5th Edition] - Ranger', {
  src: DND_RANGER_VIDEO_PLACEHOLDER_PATH,
  alt: 'Optional orientation video cover for the DND Ranger guide',
})}
<h2>Build the foundation from level 1 to 5</h2>
<h3>Set ability scores, proficiencies, and equipment direction</h3>
<p>For a 2024 Ranger, the Core Ranger Traits list Dexterity and Wisdom as the primary abilities, a d10 Hit Point Die, Strength and Dexterity saving throw proficiencies, simple and martial weapon proficiency, and training with light and medium armor and shields. Confirm those fields in the <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Ranger">2024 class entry</a> rather than importing a value from an older sheet.</p>
<p>For a 2014 Ranger, the official Quick Build points you toward Dexterity first and Wisdom second. It also presents a different direction for a dual-wielding Ranger, where Strength may come before Dexterity, and it suggests the Outlander background. Those are source-backed starting suggestions, not a command that every Ranger must use one weapon plan or one background. The <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes#Ranger">2014 Basic Rules class page</a> is the place to check the exact wording and the class table.</p>
<p>Now connect the numbers to a party job. A ranged-pressure Ranger usually values a way to make attacks from a stable lane and a plan for what happens when an enemy reaches that lane. A skirmisher needs a map position that can change without leaving the group exposed. A scout needs the relevant information to reach the party and a party member who can turn that information into a route, an ambush, or a decision. A travel-focused concept needs a campaign where terrain and movement actually appear in play. These are build recommendations based on the stated job, not extra class rules.</p>
<p>Keep three choices separate in your notes:</p>
<ol><li><strong>Primary ability:</strong> the ability the selected edition and your chosen attack or feature plan ask you to support first.</li><li><strong>Weapon and armor direction:</strong> the equipment pattern that lets you perform your main job on the maps your group uses.</li><li><strong>Party job:</strong> the result other players can expect from you, such as ranged pressure, scouting, or terrain support.</li></ol>
<p>If those three lines disagree, solve the disagreement before selecting decorative details. For example, “silent scout” paired with a plan that always requires standing in the most exposed square is a concept that needs a conversation. You may keep the concept, change the equipment direction, or define a different scouting method; the important point is to notice the tradeoff while the character is still easy to change.</p>
<h3>Make the first five levels answer real questions</h3>
<p>Use the level table as a sequence of decisions rather than a reason to fill every future box immediately.</p>
<table><thead><tr><th scope="col">Level</th><th scope="col">Version-aware checkpoint</th><th scope="col">Decision to make now</th><th scope="col">How to verify it</th></tr></thead><tbody>
<tr><th scope="row">1</th><td>A 2024 Ranger already has spellcasting, Favored Enemy, and Weapon Mastery; a 2014 Ranger starts with Favored Enemy and Natural Explorer</td><td>Name the party job and choose the first weapon direction that supports it</td><td>Read the matching level-1 feature headings and write the year beside them</td></tr>
<tr><th scope="row">2</th><td>A 2014 Ranger reaches Spellcasting; a 2024 Ranger reaches Deft Explorer and Fighting Style</td><td>Decide whether your first useful turn is mainly an attack, movement, information action, or a setup that helps the group</td><td>Check the same-edition level-2 text and note which choice competes for your action or Bonus Action</td></tr>
<tr><th scope="row">3</th><td>Both versions select a subclass under different labels and source contexts</td><td>Identify the exact source, year, and subclass feature headings you intend to use</td><td>Open the source page; do not rely on a search-result snippet or an unlabeled build list</td></tr>
<tr><th scope="row">4</th><td>Your rules source supplies the level-4 improvement choice</td><td>Choose the improvement that reinforces your stated job instead of fixing a problem created by an unexamined concept</td><td>Read the level-4 option in your own source and test it against a likely first-session scene</td></tr>
<tr><th scope="row">5</th><td>Both versions list Extra Attack as a milestone</td><td>Decide what a normal attack turn looks like when the fight lasts long enough for the feature to matter</td><td>Compare the level-5 entry with your weapon plan and record any action or concentration conflict separately</td></tr>
</tbody></table>
<p>At level 1, write one sentence describing success: “By the end of the first session, I want to identify the safest attack lane,” or “I want to find a useful route before the group commits.” At level 3, add the subclass source to that sentence. At level 5, ask whether the character's ordinary turn still serves the original job when the map becomes crowded. This gives you a way to revise a weak choice without pretending the class has one universal build.</p>
<h2>Choose a Ranger role your party will actually use</h2>
<p>Ask the group what it lacks before asking which build is considered best. Pick one primary job and, at most, one secondary job for the first session. The secondary job should support the first rather than demand a completely different ability spread and equipment plan.</p>
<h3>Ranged pressure and skirmishing</h3>
<p>Choose this route when the party already has someone who can hold attention in front, but needs another character who can threaten targets from a useful angle. Look at the map you actually expect: long sight lines reward a different plan from cramped rooms, moving battles, or encounters with frequent cover.</p>
<p>Start with an attack position, an escape position, and a fallback when both are blocked. Then check whether your equipment direction, ability priorities, and selected class options support all three. A ranged plan that works only while no enemy moves is incomplete. A skirmishing plan that spends every turn crossing the map may also be failing its job if the party needs you to hold one lane.</p>
<p><strong>Scene signal:</strong> the group has a front line, but the back line lacks a consistent way to pressure a target or punish an exposed route.</p>
<p><strong>Next choice:</strong> favor the attack and movement decisions that keep your character useful from a safe lane, then reserve one answer for an enemy who reaches you.</p>
<p><strong>Recheck:</strong> place your imagined Ranger beside the party's front line and mark the squares an enemy can reach on its next turn. If the plan has no safe attack or retreat square, change the position or the secondary job before changing every number on the sheet.</p>
<h3>Stealth, scouting, and tracking</h3>
<p>Choose this route when information changes the party's decision. “I can scout” is not enough by itself; decide what you will bring back. It might be the direction of tracks, the location of a patrol, a safer approach, or evidence that a route is impossible.</p>
<p>Define a handoff: who receives the information, how far ahead you will go, and what happens if the group decides not to follow your route. A scout who returns with facts the party cannot use still needs a clearer table procedure. Keep the rules source visible for any skill, feature, or background choice; the class identity does not grant every stealth or tracking capability automatically.</p>
<p><strong>Scene signal:</strong> the adventure includes routes, pursuit, wilderness travel, hidden approaches, or enemies whose location matters more than their hit points.</p>
<p><strong>Next choice:</strong> support the way you gather information and the way the group acts on it. Pick a fallback for the moment when scouting reveals a threat instead of an empty path.</p>
<p><strong>Recheck:</strong> write the one sentence you will say when you return: “The patrol is moving east, the bridge is watched, and the stream gives us cover.” If you cannot describe the output, narrow the scouting job until it has a usable result.</p>
<h3>Terrain, control, and support</h3>
<p>Choose this route when the map, weather, travel conditions, or a party vulnerability creates problems that attacks alone will not solve. The Ranger can be the character who notices a bad approach, protects the group's movement plan, or uses a prepared option to change how enemies can cross a space. The exact feature or spell must come from the edition and source you use.</p>
<p><strong>Scene signal:</strong> the group repeatedly loses time to difficult routes, cannot control a doorway or chokepoint, or has no plan for a dangerous environment.</p>
<p><strong>Next choice:</strong> define the terrain problem in observable terms: “we need a route that keeps the rear protected,” “we need to make this doorway costly to cross,” or “we need to know whether this trail is safe.” Then choose options that address that problem without abandoning your ordinary attack plan.</p>
<p><strong>Recheck:</strong> describe what changes on the map after your decision. If you cannot point to a safer square, a closed route, a revealed threat, or a better travel choice, the support plan is still only a theme.</p>
<p>The same process handles a monster-hunter concept. Name the information or pressure that the focus is meant to provide, then verify that the selected feature or source actually supplies it. Do not turn a visual theme into a promise that the rules give you special knowledge about every creature.</p>
<h2>Choose a subclass from the source you are using</h2>
<p>At level 3, a subclass name without a source label is a warning sign. Write all three pieces together: <code>edition</code>, <code>book or rules page</code>, and <code>subclass</code>. A build list that says only “Hunter” can hide a difference between 2014, 2024, a later sourcebook, and homebrew.</p>
<h3>What the 2024 Free Rules page actually provides</h3>
<p>The 2024 Free Rules Ranger entry shows the level-3 Ranger Subclass milestone and a Hunter section with feature headings such as Hunter’s Lore, Hunter’s Prey, Defensive Tactics, Superior Hunter’s Prey, and Superior Hunter’s Defense. Treat that page as the boundary of what you can verify from the free source. It does not give permission to call every Ranger subclass in every 2024 book part of the Free Rules page.</p>
<p>Open the <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Ranger">2024 Ranger source</a>, locate the subclass heading, and copy the exact feature names into your notes. If a feature is missing from that page, find the sourcebook or official page that contains it before using it in a build. Keep the source label visible when you share the character with the group.</p>
<h3>How to handle 2014, Legacy, and other sourcebooks</h3>
<p>The 2014 Basic Rules Ranger page places the subclass milestone under Ranger Archetype and discusses Hunter or Beast Master in its 2014 context. The <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes#Ranger">2014 Basic Rules entry</a> and the <a href="https://www.dndbeyond.com/classes/5-ranger">Ranger Legacy class page</a> should be read as 2014/Legacy material, not as a silent substitute for 2024 rules.</p>
<p>For a subclass from another sourcebook, record the book and edition next to the name. For homebrew, label it homebrew. Do not fill gaps in a source with a remembered feature, a third-party summary, or an attractive but unlabeled recommendation. This small record prevents a common failure: the character sheet starts in 2014, the subclass comes from a 2024 table, and the spell workflow is copied from a third page.</p>
<h2>Turn the character concept into a readable VTT token</h2>
<p>Once the role and visual concept are stable, you can make a token that helps the group recognize the character. This is an optional presentation step; a Ranger token does not create a class feature, change a map footprint, or grant a combat advantage.</p>
<p>Open <a href="https://www.tokenmaker.one/">Token Maker</a> with a portrait you have permission to use. The public editor accepts PNG, JPG/JPEG, and WEBP inputs, with the current upload limit shown as 10 MB. Choose the focal point before decorating it: a face, hood, helmet, silhouette, or another feature that remains recognizable when the image is small.</p>
<p>Use a circle, square, or another available polygon mask according to the image. The site also exposes borders, text, and a Ranger style preset. A preset is a visual starting point, not an official D&amp;D Ranger rule or a statement about the character's subclass. Add text only when it has a clear job, such as <code>R1</code>, <code>R2</code>, or a short name for repeated characters. If color marks a faction or status, pair it with a letter, number, or shape so players do not have to rely on color alone. This follows the <a href="https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html">W3C guidance on use of color</a>, which recommends another cue when color carries information.</p>
<p>Keep these measurements separate:</p>
<table><thead><tr><th scope="col">Measurement</th><th scope="col">What it controls</th><th scope="col">Example check</th></tr></thead><tbody>
<tr><th scope="row">Export pixels</th><td>The width and height of the PNG</td><td>Try 512 × 512 as a starting export, then inspect it at the map zoom you use</td></tr>
<tr><th scope="row">Map footprint</th><td>The squares or space assigned in the VTT</td><td>Set the footprint according to the encounter and the rules source</td></tr>
<tr><th scope="row">Physical size</th><td>The width of a printed marker</td><td>Measure the cell or base you will use; pixels do not specify inches</td></tr>
</tbody></table>
<p>The editor offers 256, 512, 1024, and 2048 export choices and a PNG download. Choose a larger export only when the crop contains useful detail that the smaller version cannot show. For a sizing starting point, compare the <a href="https://www.tokenmaker.one/templates/square-token-maker">Square Token Maker workflow</a>, which connects its 512 and 1024 suggestions to viewing context rather than treating one number as a universal VTT requirement. More pixels do not repair a face that occupies only a tiny part of the original artwork. After downloading, inspect the PNG over a colored background. The <a href="https://www.tokenmaker.one/faq">Token Maker FAQ</a> documents transparent PNG export, while the <a href="https://www.w3.org/TR/png-3/">W3C PNG specification</a> explains that PNG can contain both opaque and transparent pixels; a PNG extension does not automatically remove scenery inside the portrait.</p>
<p>Place the token at the scale your group uses and ask three questions: Can I identify the character without opening a preview? Does the visible art fill the intended space without excessive transparent padding? Does the border or identifier remain readable beside another token? If the answer is no, change the crop or visual cue before changing the map footprint. If the image file looks right but the placed token occupies the wrong number of squares, fix the VTT dimensions instead of exporting a larger PNG.</p>
<p>The normal edit and download path is different from sharing. The <a href="https://www.tokenmaker.one/privacy">Token Maker privacy page</a> describes ordinary editing/download as local-first, while copy-link or social sharing uploads the generated PNG to create a public share link. Use the download path when you only need a local asset. If you choose a share link, treat the resulting image as publicly accessible and do not put private artwork into that path unless you accept that boundary.</p>
<h2>A first-session Ranger decision card</h2>
<p>Fill this out before finalizing the sheet. Every blank should point to a source, a party need, or an observable test.</p>
<table><thead><tr><th scope="col">Field</th><th scope="col">Your answer</th><th scope="col">Pass condition</th></tr></thead><tbody>
<tr><th scope="row">Rules version</th><td><code>2014</code> or <code>2024</code></td><td>The year appears on the character sheet and matches every class feature you selected</td></tr>
<tr><th scope="row">Primary ability</th><td>The ability your source and attack plan require first</td><td>It supports the stated party job rather than a borrowed build label</td></tr>
<tr><th scope="row">Weapon and armor direction</th><td>Your intended attack lane and fallback</td><td>You can describe where you stand when the first plan is blocked</td></tr>
<tr><th scope="row">Party job</th><td>Ranged pressure, skirmishing, scouting, terrain/support, or another concrete job</td><td>Another player can tell what result to expect from you</td></tr>
<tr><th scope="row">Level 3 source</th><td>Book/rules page plus subclass name</td><td>The feature headings can be opened and the edition is clear</td></tr>
<tr><th scope="row">First-session test</th><td>One scene and one observable result</td><td>You know what to compare after the scene, not merely what to hope for</td></tr>
<tr><th scope="row">Token check (optional)</th><td>Focal point, mask, identifier, export, and map scale</td><td>The character remains identifiable beside its neighbors</td></tr>
</tbody></table>
<p>If you cannot fill one row, pause at that row instead of compensating with more features. Confirm the edition, open the matching official Ranger page, choose the party job, and then complete the level 1–5 route. Once the character's decisions are coherent, use the optional token workflow to make the role visible on the map.</p>
`;

export const dndRangerArticleHtmlZh = String.raw`
<p>如果你正在创建 DND 游侠，第一项工作不是抄一份“最强构筑”，而是在角色卡顶部写清 2014 Ranger 或 2024 Ranger。本页以 2024 规则为主，只在会改变建卡、施法或等级计划的地方对照 2014；先分开版本，再决定队伍职责，最后才选属性、装备和首回合动作。这样可以避免把旧版的职业特性、最新版的法术管理和第三方构筑混在同一张角色卡上。</p>
<h2>先确认版本，再判断游侠要解决什么问题</h2>
<p>Ranger 的核心不是“只拿弓的 Fighter”，也不是“必须带动物伙伴的野外角色”。它把武器战斗、自然魔法、侦察、追踪和边境行动放在同一个框架里；桌规、地图和队伍分工，会让其中某部分更常出现。创建前打开 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Ranger">2024 Ranger 官方条目</a> 或 <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes#Ranger">2014 Ranger 官方条目</a>，在角色卡上留下明确的年份标签。</p>
<p>“弓手”可以是远程路线，却不是职业定义。你可以把游侠安排成远程压制者、近战边缘机动者、侦察与追踪者，或者在使用旅行和地形规则的战役里承担荒野支援。先问队伍缺什么，再问这个角色在第一场景要做什么；如果队伍根本不追踪行程、天气或地形，依赖这些环节的特性就可能较少出场，这应当成为建卡前提，而不是一句“游侠没用”的结论。</p>
<h2>把队伍职责写成一句可检查的话</h2>
<p>不要只在角色概念栏写“输出”“全能”或“玩游侠”。用下面的句式写一条职责声明：<strong>“我主要负责在某种场景中完成某个任务；当队伍缺少某项能力时，我用某个动作补位。”</strong> 这句话会影响属性、技能、武器和站位，也让你在第一场游戏后知道哪里要调整。</p>
<table><thead><tr><th scope="col">主要职责</th><th scope="col">适合的队伍信号</th><th scope="col">开局决定</th><th scope="col">第一场景的检查结果</th></tr></thead><tbody>
<tr><th scope="row">远程压制与机动</th><td>前排已经能挡住敌人，但队伍缺少稳定的远距离攻击</td><td>让敏捷、远程武器方向和可撤退站位互相配合</td><td>你能从不堵住队友的位置攻击，并在敌人接近时保留退路</td></tr>
<tr><th scope="row">侦察、隐匿与追踪</th><td>队伍需要提前发现路线、目标或危险，而不是单纯增加伤害</td><td>选择能执行侦察任务的技能和行动习惯，约定与队友的联络信号</td><td>你能说明发现信息后如何通知队伍，而不是独自走出支援范围</td></tr>
<tr><th scope="row">近战边缘机动</th><td>队伍需要一名能在侧翼施压、又不取代主要前排的人</td><td>选能承受一次失误的防护和武器方向，先规划进场与退出格</td><td>你能在攻击后回到安全位置，或清楚知道谁会接住你的撤退</td></tr>
<tr><th scope="row">地形与旅行支援</th><td>战役会实际处理荒野路线、环境或追踪条件</td><td>先确认主持人会使用哪些探索规则，再把技能和资源投向真实会出现的场景</td><td>你能指出一次需要观察、判断或改道的机会，并知道失败后走哪条备用路线</td></tr>
</tbody></table>
<p>这张表是选择方法，不是职业强度排名。一个队伍可能同时需要远程攻击和侦察，但应先写主要职责，再写次要职责；否则每个能力都想兼顾，最后没有一项能在场景中被判断。若你的桌上很少使用旅行规则，就把“地形与旅行支援”改写成地图上的视线、掩护、路线和危险识别，而不要假装某项探索特性一定会触发。</p>
<h2>2014 与 2024 Ranger，哪些差异会改掉你的决定</h2>
<p>两版都叫 Ranger，但等级表和资源流程不是同一套。下面只列会改变 1 至 5 级计划的差异；完整规则仍应回到对应年份的 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Ranger">2024 Ranger 条目</a> 或 <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes#Ranger">2014 Ranger 条目</a> 核对。</p>
<table><thead><tr><th scope="col">检查点</th><th scope="col">2024 Ranger</th><th scope="col">2014 Ranger</th></tr></thead><tbody>
<tr><th scope="row">1 级的职业能力</th><td>Spellcasting、Favored Enemy、Weapon Mastery</td><td>Favored Enemy、Natural Explorer</td></tr>
<tr><th scope="row">施法起点与管理</th><td>1 级开始施法；初始准备两项 1 环游侠法术，长休后可替换准备列表中的一项</td><td>2 级开始施法；使用 Spells Known 流程，先从清单选择两项 1 环法术</td></tr>
<tr><th scope="row">2 级计划</th><td>Deft Explorer 与 Fighting Style</td><td>Fighting Style 与 Spellcasting</td></tr>
<tr><th scope="row">3 级分叉</th><td>选择 Ranger Subclass</td><td>选择 Ranger Archetype</td></tr>
<tr><th scope="row">5 级节点</th><td>Extra Attack</td><td>Extra Attack</td></tr>
</tbody></table>
<img class="inline-article-image" src="${DND_RANGER_DECISION_PLAN_IMAGE_PATH}" alt="游侠决策图：先分清版本、队伍职责与首场检查点" loading="lazy" decoding="async" fetchpriority="low" width="1536" height="1024" />
<p>2024 版的 Core Ranger Traits 把 Dexterity 和 Wisdom 列为主要属性，并在 1 级就给出 Spellcasting；它的准备法术流程不能被 2014 的 Spells Known 取代。2014 版的 Quick Build 则建议 Dexterity 最高、Wisdom 次之；如果明确走双武器路线，官方建议允许把 Strength 放到 Dexterity 之前，但这仍是建议，不是唯一合法答案。版本标签应该跟着每个决定走：看到 2014 的表，就不要把 Deft Explorer 或 Weapon Mastery 当成同一版本的 1、2 级能力；看到 2024 的表，也不要把“1 级还不能施法”写进角色计划。</p>
<p>2024 版的 Favored Enemy 会让 Hunter’s Mark 始终准备好，并提供不消耗法术位的施放次数；这只说明它在职业资源计划中的位置，不等于每场战斗都应该立刻使用。两版同名法术的触发文字与伤害表述也不能凭记忆合并。需要查看完整的射程、专注、触发、转移或升环细节时，分别打开 <a href="https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#HuntersMark">2024 Hunter’s Mark 规则</a> 和 <a href="https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#HuntersMark">2014 Hunter’s Mark 规则</a>，或阅读站内的 <a href="https://www.tokenmaker.one/zh/blog/dnd-hunters-mark">Hunter’s Mark 指南</a>。本页只处理职业决策，不复制该专题的完整规则表。</p>
<p>下面的视频可作为可选的方向参考：用它确认角色概念的大致感觉，不要用它替代对应年份的官方 Ranger 条目；复制任何特性、法术或子类前，先回到你桌上使用的 2014 或 2024 来源核对原文。</p>
${liteVideoEmbed(DND_RANGER_VIDEO_ID, 'A Crap Guide to D&D [5th Edition] - Ranger', {
  src: DND_RANGER_VIDEO_PLACEHOLDER_PATH,
  alt: 'DND 游侠指南可选介绍视频封面',
})}
<h2>用五个决定完成 1 级 Ranger</h2>
<h3>第一项：先确认规则版本</h3>
<p>在角色卡、数字角色创建器或你的笔记第一页写下年份。不要写“5e”就结束，因为这个词可能指向不同资料；写 2014 Ranger 或 2024 Ranger。随后打开相同年份的职业条目，确认你读到的 1、2、3、5 级节点与这个版本标签一致。</p>
<h3>第二项：写下队伍职责</h3>
<p>在同一页补上职责声明：侦察为主、远程为辅，或远程压制为主、追踪为辅。回到队伍缺口，确认这句话能清楚解释你第一场景要完成的任务；版本和职责必须一起影响后面的属性、技能、装备与首回合。</p>
<h3>第三项：排 Dexterity、Wisdom、Constitution 的优先级</h3>
<p>2024 条目把 Dexterity 和 Wisdom 列作主要属性，2014 Quick Build 也把 Dexterity 放在 Wisdom 之前；这为起点提供了方向，却没有替你决定角色数值。把 Dexterity 放在前面，通常意味着你更愿意让远程攻击、灵活站位或敏捷相关任务承担主要工作；把 Wisdom 作为第二项审查，意味着你要考虑施法和感知类职责是否真的会在桌上出现。Constitution 不必被机械固定成第三名：如果职责经常靠近危险、需要承受反击，就提高它的优先级；若队伍能保护你，可把空间留给已声明的任务。</p>
<p>不要先抄网上的数值再倒推职责。先回答三个问题：我的默认攻击距离是多少？我会不会主动进入敌人的威胁范围？我的队伍是否需要我承担识别路线、目标或环境的任务？你的属性排列应能解释这三个答案；具体生成方式、背景加值和规则选项仍按本桌使用的角色创建规则核对。</p>
<h3>第四项：选择能执行职责的技能和装备路线</h3>
<p>2024 的 Ranger 基础条目列出 Dexterity/Wisdom 主要属性、轻甲与中甲及盾牌训练、简易与军用武器熟练项，以及三项技能选择。不要把这些熟练项直接变成“永远最佳”的清单，而是用它们检查你的职责声明能否落地：侦察路线要能说明怎样观察、隐匿或追踪；远程路线要说明怎样保持视线和撤退空间；近战边缘路线要说明怎样进场而不抢走前排的全部承伤责任。</p>
<p>装备路线也应从站位倒推。远程路线先确认武器射程、队友站位和可用掩护；近战路线先确认护甲、防护、退出方向和谁会提供支援；旅行支援路线先确认地图上是否真的有需要判断的路线。若某个装备选择来自 2014 角色创建页，就在笔记上保留 2014 标签，不要用 2024 的 Weapon Mastery 名称替它解释。这样做比背一份“标准起始装备”更容易发现规则冲突。</p>
<h3>第五项：记录一个不依赖 Hunter’s Mark 的默认回合</h3>
<p>把 Hunter’s Mark 当成分支，而不是自动按钮。先写一条即使没有标记目标也能执行的默认动作：远程路线可以是“寻找不堵队友的视线，攻击高优先级目标，保留可退位置”；近战边缘路线可以是“从侧面进场，攻击后检查撤退格”；侦察路线可以是“先报告目标位置和可用路线，再决定是否进入战斗”。这是战术草稿，不是额外规则。</p>
<p>再补分支条件：目标可能存活到下一轮、你能持续完成主要职责、且本回合不需另一个附赠动作时，才考虑使用 Hunter’s Mark；目标即将倒下、你必须移动或保留资源时，可以不标记。关键是写出“为什么现在用”，而不是背伤害表。若要精确判断某一版的触发与持续时间，回到上面的版本来源或专题页，不要把两版文字混在战术笔记里。</p>
<h2>第一回合和一次探索场景怎么执行</h2>
<p>进入战斗前，按固定顺序问自己四个问题：我现在与敌人和队友的距离是多少？我的主要目标预计会留在场上多久？队伍此刻缺的是伤害、信息还是阻挡路线？我是否需要保留移动、附赠动作或施法资源来应对下一步？这四问能把“我应该用什么”改成“我现在需要完成什么”。</p>
<p>接着执行版本分支。2024 的 1 级 Ranger 已经有 Spellcasting，所以你可以在同一年份的法术清单和角色卡上核对可用准备项；2014 的 1 级 Ranger 不应被默认成已经拥有 Ranger Spellcasting，因为该版本的施法起点在 2 级。这里不需要在职业指南中重做逐环法术推荐；如果你要选择具体法术，使用 <a href="https://www.tokenmaker.one/zh/blog/dnd-ranger-spells">DND 游侠法术指南</a>，并再次确认它写的是哪一年份。</p>
<p>探索场景同样需要结果标准。出发前写下“我需要发现什么”“发现后谁做决定”“失败后走哪条备用路线”。如果主持人使用追踪、隐匿、天气或地形规则，你可以把观察到的足迹、可通行路线或危险区域记录给队伍；如果桌上不处理这些规则，就把职责改成地图上的视线、掩护、入口和撤退路线。不要把社区对旧版探索特性的抱怨改写成普遍事实，也不要让角色卡承担桌规没有提供的判定。</p>
<p>下面是一个明确标注的设计示例，不是实测结果：假设队伍已有近战前排和治疗者，但缺少远程压制，角色概念是边境侦察者。你可以把 2024 Ranger 写成“远程压制为主、侦察为辅”，按 Dexterity、Wisdom、Constitution 的任务优先级排列属性，选择便于保持距离的武器方向；第一回合先找出不堵住队友的射击位置，并把 Hunter’s Mark 留给值得持续关注的目标。如果地图狭窄到无法保持距离，就复查职责声明，决定是转为近战边缘路线，还是把“报告敌人位置和安全通道”作为本场的主要贡献。示例用于展示复查动作，不宣布唯一构筑。</p>
<h2>2、3、5 级时，行动计划会怎样改变</h2>
<p>2 级是第一次必须重读同一年份规则的节点。2024 版会同时引入 Deft Explorer 和 Fighting Style；2014 版会引入 Fighting Style 和 Spellcasting。你不必在 1 级提前写满所有细节，但要预留一个位置记录“这个节点如何服务我的主要职责”。例如，远程路线要复查战斗风格、武器和站位是否一致；侦察路线要复查新能力是否真的解决队伍的信息缺口；如果新选项与职责无关，就重新检查你是否在抄别人的路线。</p>
<p>3 级是来源检查点，不是全职业排名点。2024 Free Rules 的 Ranger 条目实际展示 Hunter 子类相关内容；2014 Basic Rules 的职业段落使用 Ranger Archetype，并提到 Hunter 或 Beast Master 的来源语境。不要把一个页面展示的内容写成该版本全部子类，也不要在没有打开具体来源时凭印象补完 Beast Master 或其他书籍的机制。</p>
<p>到 5 级，两版表格都列出 Extra Attack。这个节点会改变你的默认回合：重新检查主要武器、攻击距离、移动路线和目标优先级，而不是只把“多一次攻击”抄进等级表。若角色经常在第一击后撤退，额外攻击的价值还要和站位、目标存活时间及下轮资源一起判断；若队伍缺信息，Extra Attack 也不会自动取代侦察职责。</p>
<h2>按你正在使用的来源选择子类</h2>
<p>在角色卡上写下四项来源信息：规则年份、书名或官方页面、子类名称、第一次获得该子类特性的等级。然后按下面的顺序核对：</p>
<ol><li>打开与你的年份匹配的官方 Ranger 条目，确认 3 级使用的是 Ranger Subclass 还是 Ranger Archetype。</li><li>打开子类的具体段落，确认名称和特性标题确实出现在该来源中；页面只显示 Hunter，就只把 Hunter 当作本次已核对内容。</li><li>如果选项来自 Legacy、其他规则书或第三方 homebrew，保留来源标签，不要将它写成当前 Basic/Free Rules 的默认选项。</li><li>把子类的第一项实际能力改写成一个“场景信号 → 我的动作 → 复查结果”，而不是先给它一个没有依据的强度等级。</li></ol>
<p>这一流程可以防止两个常见错误：把 2014 Archetype 和 2024 Subclass 当成同一列，或者看到网上的子类榜单就把没有核对来源的机制填进角色卡。复杂选择中，知道“我正在读哪一本、哪一年、哪一个标题”比收集所有名称更重要。</p>
<h2>角色概念确定后，再制作可读的 VTT Token</h2>
<p>Token 是角色视觉的可选输出，不会替你决定职业、修正战斗数值或证明某个构筑更强。等你已经确定 Ranger 的版本、职责和角色焦点，再打开 <a href="https://www.tokenmaker.one/zh#editor-workspace">Token Maker 中文编辑器</a>，把已有画像整理成适合桌面的标记。工具页面支持上传、裁切、遮罩、边框、文字和 PNG 导出；这些是图像制作功能，不是 D&amp;D 规则来源。</p>
<p>按照“焦点 → 形状 → 样式 → 文件 → 地图检查”的顺序操作：</p>
<ol><li>先上传已有的角色画像，移动裁切位置，让脸、武器轮廓或能代表职责的主体留在小尺寸下仍可辨认的区域。</li><li>再选择圆形、方形或其他可用多边形遮罩；不要因为 Ranger 预设的名字就把它当作官方子类或规则标记。</li><li>只添加有实际用途的边框、色调和文字。若队伍需要区分同一角色的状态，可以使用清楚的文字或形状线索，不要只依赖颜色。</li><li>选择 PNG 导出尺寸后下载文件。256、512、1024、2048 是当前工具菜单里的选项；本文不把任一尺寸写成 VTT 的统一标准，实际占格和显示效果仍应在你使用的平台内复查。</li><li>把导出的 token 放回实际地图尺度检查：脸或轮廓是否仍能认出，边框是否与主体粘在一起，文字是否小到只剩噪点。如果检查失败，先调整裁切、对比或文字，再去查平台的占格设置。</li></ol>
<p>普通编辑和 Download PNG 是一条 local-first 路径；但复制分享链接或使用社交分享会上传生成的 PNG 并创建公开链接，详见 <a href="https://www.tokenmaker.one/zh/privacy">Token Maker 隐私事实说明</a>。私用素材可以直接下载保存；分享时要把“公开链接”当成独立选择，不要把普通下载的隐私边界扩大成“图片永远不会离开浏览器”。</p>
<h2>常见错配检查</h2>
<h3>把版本写在开头，却在中途换了规则</h3>
<p>症状是角色卡顶部写着 2024，等级计划却在 1 级写“没有施法”，或把 2014 的 Spells Known 和 2024 的准备法术放在同一列。解决方法是给每个节点加年份，在 1、2、3、5 级分别回对应官方表核对；无法确定来源时先停下，不要用相似名称猜测。</p>
<h3>先抄构筑，再发现桌上没有对应场景</h3>
<p>症状是所有属性、技能和装备都围绕“最优输出”，但队伍真正缺的是路线信息或稳定侦察。回到职责声明，写出一次队伍会观察到的结果；如果主持人不使用旅行规则，就把探索职责改成地图和战斗中的信息工作。</p>
<h3>把游侠缩成弓手，或把法术页搬进职业页</h3>
<p>弓只是一个可选路线，游侠的价值还取决于自然魔法、侦察、追踪和队伍缺口。需要逐环法术选择、准备清单或 Hunter’s Mark 深入取舍时，转到对应专题；本页只保留版本入口和资源判断，不重复完整法术表。</p>
<h3>只看 Token 外观，不做地图尺度检查</h3>
<p>症状是原图放大时很清楚，缩到实际占格后却分不出脸、轮廓或状态。把问题拆开：先在编辑器内修正焦点和边框，再在 VTT 内检查占格与显示尺度；下载的 PNG 只提供图像；以 <a href="https://foundryvtt.com/article/tokens/">Foundry 官方 Token 文档</a> 为例，视野与状态属于放置后 Token 的信息，仍需在平台内另行复查。</p>
<h2>第一场游戏前的决策卡</h2>
<p>在开始角色创建前，把下面七格写完。每格都应该能被你或队友复查，而不是只剩一个流行术语：</p>
<ul><li><strong>规则版本：</strong> 2014 Ranger 或 2024 Ranger；附上你实际打开的官方条目。</li><li><strong>队伍职责：</strong> 一个主要职责和一个次要职责；写出队伍缺口与第一场景结果。</li><li><strong>属性优先级：</strong> Dexterity、Wisdom、Constitution 的顺序，以及这个顺序服务的具体任务。</li><li><strong>技能与装备：</strong> 至少一项能执行职责的技能方向、武器路线、站位和退路。</li><li><strong>首回合：</strong> 不依赖 Hunter’s Mark 的默认动作，以及何时考虑标记目标的条件。</li><li><strong>3 级来源：</strong> 规则年份、书名或官方页面、Ranger Subclass/Archetype 名称。</li><li><strong>可选 Token：</strong> 画像焦点、遮罩和边框；导出后在实际地图尺度检查脸、轮廓与状态线索。</li></ul>
<p>如果七格中有一格只能填“网上都这么配”，就先回到对应年份的官方 Ranger 条目；如果一格依赖本桌不会使用的探索规则，就改写职责；如果只是想查具体法术，转到游侠法术专题。完成这张卡后，你已经有了一条可执行的起点：先确认版本，再让队伍职责决定选择，最后用第一场景的可观察结果复查方向。</p>
`;
