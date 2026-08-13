import {
  DND_MEANING_OFFICIAL_GUIDE_URL,
  EN_DICE_ROLLER_PATH,
  EN_DND_ALIGNMENT_CHART_PATH,
  EN_DND_CLASSES_PATH,
  EN_DND_RACES_PATH,
  EN_EDITOR_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_ALIGNMENT_CHART_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_DND_RACES_PATH,
  ZH_EDITOR_PATH,
} from './shared';

export const dndMeaningArticleHtml = String.raw`
<p><strong>DND can mean two different things.</strong> In a phone setting or a text conversation, it usually means “Do Not Disturb.” In tabletop gaming, D&amp;D or DnD means Dungeons &amp; Dragons, a game where a group creates characters and tells an adventure together.</p>

<p>That second meaning is the one behind a D&amp;D game night, an actual-play stream, or a friend asking whether you want to join a campaign. You make choices for one character while everyone at the table helps build the story.</p>

<h2>What Dungeons &amp; Dragons means</h2>
<p>Dungeons &amp; Dragons is a tabletop role-playing game. One person usually acts as the Dungeon Master, often shortened to DM. The DM describes the world, plays its non-player characters, and tells the group when a rule or die roll matters. Everyone else plays a character in that world.</p>

<p>A player might say, “My ranger checks the locked door for tracks,” or “My wizard tries to convince the guard.” The DM describes what happens next. When success is uncertain, the group uses dice and the character sheet to settle the moment.</p>

<p><a href="${DND_MEANING_OFFICIAL_GUIDE_URL}" rel="noreferrer noopener">D&amp;D Beyond’s introduction to Dungeons &amp; Dragons</a> describes the game as cooperative storytelling: players roleplay created characters while the Dungeon Master guides the adventure with character sheets and dice. That is a useful starting picture whether the group meets around a kitchen table or online.</p>

<h2>What happens during a D&amp;D game?</h2>
<ol>
  <li><strong>The DM sets a scene.</strong> The party enters a ruined tower, reaches a crowded market, wakes up in a prison wagon, or hears something moving behind a sealed door.</li>
  <li><strong>Players decide what their characters attempt.</strong> They can ask questions, negotiate, sneak, investigate, fight, run away, or try something nobody planned for.</li>
  <li><strong>The table rolls dice when the outcome is uncertain.</strong> A high roll can help, but the exact rule and number depend on the situation and the game’s version.</li>
  <li><strong>The result changes the shared story.</strong> A failed lockpick can alert a guard. A clever plan can avoid a fight. A strange bargain can become the next session’s problem.</li>
</ol>

<p>Two groups can play the same adventure and come away with very different stories. The rules give choices consequences; the people at the table give those choices personality.</p>

<h2>Beginner words worth knowing</h2>
<table>
  <thead>
    <tr><th scope="col">Word</th><th scope="col">Meaning at the table</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">Dungeon Master (DM)</th><td>The person who describes the world, plays its inhabitants, and helps apply the rules.</td></tr>
    <tr><th scope="row">Player character (PC)</th><td>The character controlled by one player.</td></tr>
    <tr><th scope="row">Party</th><td>The group of player characters who adventure together.</td></tr>
    <tr><th scope="row">Session</th><td>One meeting to play the game. It can be a single evening or part of a longer story.</td></tr>
    <tr><th scope="row">Campaign</th><td>A connected series of sessions that follows the same characters and world.</td></tr>
    <tr><th scope="row">Character sheet</th><td>The page or app that records your character’s abilities, equipment, and useful numbers.</td></tr>
    <tr><th scope="row">Class</th><td>Your character’s broad adventuring role, such as fighter, rogue, wizard, or cleric.</td></tr>
    <tr><th scope="row">Species</th><td>Your character’s ancestry or origin in the game’s fantasy setting.</td></tr>
    <tr><th scope="row">VTT</th><td>A virtual tabletop: online software that can show maps, character tokens, and dice.</td></tr>
  </tbody>
</table>

<p>Classes and species help shape what a character can do, but they do not decide every personality trait. Start with a familiar fantasy idea, then add a goal, one fear, and a reason to trust the rest of the party. The guides to <a href="${EN_DND_CLASSES_PATH}">choosing a D&amp;D class</a>, <a href="${EN_DND_RACES_PATH}">choosing a species</a>, and <a href="${EN_DND_ALIGNMENT_CHART_PATH}">describing alignment</a> can help with those first choices.</p>

<h2>How to start your first game</h2>
<p>Ask whether the game is a one-shot, a complete short adventure, or the opening of a campaign. Ask what books or online tools the DM expects everyone to use. Then make a character who has a reason to work with strangers.</p>

<p>At the table, say what your character tries to do in ordinary language. You do not have to announce a rule name first. “I want to climb the wall without being seen” gives the DM enough to tell you whether a die roll is needed. New players learn faster by making choices and asking what their sheet means when it comes up.</p>

<p>Dice settle uncertainty; they are not a scorecard for acting well. A bad roll can create a funny detour, expose a secret, or push the party toward a better plan. For a quick digital die, use the <a href="${EN_DICE_ROLLER_PATH}">DnD dice roller</a>.</p>

<h2>Where character tokens fit</h2>
<p>D&amp;D works with spoken description alone. Some groups add a map, miniatures, or digital tokens when a scene needs clearer positions. Online groups often use a VTT for that visual layer.</p>

<p>A token is a small image that helps the table recognize a character or creature on a map. It is not a rule requirement and it does not replace a character sheet. If you already have character art, <a href="${EN_EDITOR_PATH}">make a D&amp;D token in Token Maker</a>: crop the portrait, choose a frame and label, then export the image for your table’s map. Keep the face readable at a small size so the player at the other end of the map can recognize the character at a glance.</p>

<h2>Common misunderstandings</h2>
<p>D&amp;D is not a board game with one fixed route to victory. A published adventure gives the group locations, problems, and characters, but the players still decide what their party does.</p>

<p>It is not a competition between the DM and the players. The DM can run dangerous enemies and hard consequences, yet everyone benefits when the group understands the situation and gets room to make meaningful choices.</p>

<p>You also do not need a perfect character voice or a shelf of painted miniatures. Bring curiosity, pay attention when another player has a moment, and make choices that give the party something to respond to.</p>

<h2>DnD meaning FAQ</h2>
<h3>What does DND mean in a text message?</h3>
<p>In a text message, DND usually means “Do Not Disturb.” It refers to a phone or messaging status that silences notifications. The surrounding conversation tells you whether someone instead means the tabletop game.</p>

<h3>What does DnD mean in gaming?</h3>
<p>In gaming, DnD usually names a tabletop role-playing game where players make characters and make choices in a shared fantasy adventure led by a Dungeon Master.</p>

<h3>Is DnD hard for beginners?</h3>
<p>DnD has rules, but a first session does not require mastering them all. Start with a character sheet, describe what your character tries to do, and ask the Dungeon Master to explain a rule when it matters.</p>

<h3>Do you need miniatures or tokens to play?</h3>
<p>No. Many groups play entirely through spoken description. Maps, miniatures, and VTT tokens are optional tools for scenes where position or visual identity helps.</p>

<h3>What is the difference between a session and a campaign?</h3>
<p>A session is one time the group plays. A campaign is a longer connected story made from multiple sessions, usually with the same characters and world.</p>

<h2>Source</h2>
<ul>
  <li><a href="${DND_MEANING_OFFICIAL_GUIDE_URL}" rel="noreferrer noopener">D&amp;D Beyond: What Is Dungeons &amp; Dragons?</a></li>
</ul>
`;

export const dndMeaningArticleHtmlZh = String.raw`
<p><strong>DND 有两种常见含义。</strong>手机设置或消息对话里的 DND 通常指“免打扰”（Do Not Disturb）。桌面跑团语境里的 D&amp;D 或 DND 则指《龙与地下城》：一群人创建角色，一起讲出一段冒险故事的游戏。</p>

<p>朋友约你参加 D&amp;D 游戏夜、直播里有人提到 DND、群聊里出现“战役”一词，说的通常就是第二种含义。你只需要为一个角色做决定，整桌人一起推动故事往前走。</p>

<h2>游戏语境里的《龙与地下城》</h2>
<p>《龙与地下城》是桌面角色扮演游戏。通常有一位地下城主，简称 DM。DM 描述世界、扮演其中的非玩家角色，并在需要时说明规则或让大家掷骰。其余人各自扮演一个生活在这个世界里的角色。</p>

<p>玩家可以说：“我的游侠想在锁着的门边找足迹。”也可以说：“我的法师想说服守卫。”DM 会描述接下来发生什么。结果不确定时，桌子上的骰子和角色卡会一起给出答案。</p>

<p><a href="${DND_MEANING_OFFICIAL_GUIDE_URL}" rel="noreferrer noopener">D&amp;D Beyond 对《龙与地下城》的介绍</a>把它描述为合作讲故事的游戏：玩家扮演自己创建的角色，DM 用角色卡和骰子带领冒险。无论围坐在餐桌旁，还是在线开团，这都是最容易理解它的方式。</p>

<h2>一局 DND 实际会发生什么？</h2>
<ol>
  <li><strong>DM 先摆出场景。</strong>队伍走进残破高塔、来到拥挤市集、在囚车上醒来，或听见封死的门后有东西在移动。</li>
  <li><strong>玩家决定角色要做什么。</strong>可以提问、谈判、潜行、调查、战斗、逃跑，也可以试试没人预先写好的办法。</li>
  <li><strong>结果不确定时掷骰。</strong>高点数通常有帮助，但具体该掷什么、需要多高，要看场景和桌上使用的规则版本。</li>
  <li><strong>结果改变共同故事。</strong>开锁失败可能惊动守卫，巧妙的计划可能绕过战斗，一笔古怪交易可能成为下次游戏的麻烦。</li>
</ol>

<p>两桌人可以跑同一个冒险，却得到完全不同的故事。规则让选择有后果，桌上的人让这些选择有性格。</p>

<h2>第一次听到 DND 时值得认识的词</h2>
<table>
  <thead>
    <tr><th scope="col">词</th><th scope="col">桌上的意思</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">地下城主（DM）</th><td>描述世界、扮演其中角色，并协助大家使用规则的人。</td></tr>
    <tr><th scope="row">玩家角色（PC）</th><td>由一名玩家控制的角色。</td></tr>
    <tr><th scope="row">队伍（Party）</th><td>一起冒险的玩家角色小组。</td></tr>
    <tr><th scope="row">场次（Session）</th><td>一次实际开团。可以只是一个晚上，也可以是长故事的一部分。</td></tr>
    <tr><th scope="row">战役（Campaign）</th><td>由多次场次组成、跟随同一批角色和世界推进的连续故事。</td></tr>
    <tr><th scope="row">角色卡（Character Sheet）</th><td>记录角色能力、装备和常用数值的页面或应用。</td></tr>
    <tr><th scope="row">职业（Class）</th><td>角色的大致冒险定位，例如战士、游荡者、法师或牧师。</td></tr>
    <tr><th scope="row">物种（Species）</th><td>角色在奇幻世界里的血统或出身。</td></tr>
    <tr><th scope="row">虚拟桌面（VTT）</th><td>可以显示地图、角色 Token 和骰子的在线桌面工具。</td></tr>
  </tbody>
</table>

<p>职业和 Species 会影响角色能做什么，却不会替你决定角色的性格。先从熟悉的奇幻形象开始，再补一个目标、一件害怕的事，以及信任其他队友的理由。可以继续看<a href="${ZH_DND_CLASSES_PATH}">怎样选择 DND 职业</a>、<a href="${ZH_DND_RACES_PATH}">怎样选择 Species</a>和<a href="${ZH_DND_ALIGNMENT_CHART_PATH}">怎样理解角色阵营</a>。</p>

<h2>怎样开始第一次游戏</h2>
<p>先问清这次是单次冒险、一个完整短故事，还是长期战役的开场。再问 DM 希望大家使用哪些书或在线工具。角色最好有一个愿意和陌生人合作的理由。</p>

<p>开团时，用日常语言说角色想做什么就够了，不必先报出规则名称。“我想悄悄爬过这面墙”已经足够让 DM 判断是否需要掷骰。新玩家在做选择时学习角色卡，比背完整本规则更快。</p>

<p>骰子用来处理不确定性，不是表演好坏的成绩单。一次低点数可能带来好笑的绕路、暴露一个秘密，或逼队伍想出更好的办法。需要快速数字骰子时，可以用<a href="${ZH_DICE_ROLLER_PATH}">DND 掷骰器</a>。</p>

<h2>Token 在游戏里放在哪里？</h2>
<p>D&amp;D 只靠口头描述也能正常玩。有些队伍会在位置更重要的场景加入地图、模型或数字 Token。线上队伍常用 VTT 把这些视觉信息放到同一张地图上。</p>

<p>Token 是地图上的小图，帮助大家认出一个角色或生物。它不是规则要求，也不能代替角色卡。已经有角色图时，可以在 <a href="${ZH_EDITOR_PATH}">Token Maker 制作 D&amp;D Token</a>：裁好头像、选一个边框和标签，再导出给桌上的地图使用。缩小后仍能看清脸，队友才容易一眼认出角色。</p>

<h2>几个常见误会</h2>
<p>D&amp;D 不是一条固定路线通关的桌游。模组会给出地点、问题和人物，但队伍仍然决定自己要做什么。</p>

<p>DM 也不是和玩家对抗的人。DM 可以安排危险敌人和严肃后果，但所有人都受益于清楚的场景、真实的选择和彼此回应的空间。</p>

<p>你不需要完美的角色声音，也不必先买一柜子上色模型。带着好奇心来，留意其他玩家的高光时刻，再做出能让队伍继续回应的选择。</p>

<h2>DND 常见问题</h2>
<h3>消息里的 DND 是什么意思？</h3>
<p>消息里的 DND 通常是“免打扰”（Do Not Disturb），指手机或聊天软件静音通知的状态。具体对话如果在聊跑团，它也可能指这款桌面角色扮演游戏。</p>

<h3>游戏里的 DND 是什么意思？</h3>
<p>游戏里的 DND 通常指桌面角色扮演游戏。玩家创建角色，在 DM 带领的共享奇幻冒险里做选择。</p>

<h3>DND 对新手很难吗？</h3>
<p>DND 有规则，但第一次游戏不需要把所有规则背下来。拿着角色卡，说出角色想做什么，规则出现时请 DM 解释即可。</p>

<h3>玩 DND 一定要模型或 Token 吗？</h3>
<p>不一定。很多队伍完全靠口头描述游玩。地图、模型和 VTT Token 都是位置或视觉身份更重要时才会使用的可选工具。</p>

<h3>DND 里的 Session 和 Campaign 有什么区别？</h3>
<p>Session 是一次实际游戏。Campaign 是由多次 Session 组成的连续故事，通常跟随同一批角色和同一个世界。</p>

<h2>资料来源</h2>
<ul>
  <li><a href="${DND_MEANING_OFFICIAL_GUIDE_URL}" rel="noreferrer noopener">D&amp;D Beyond：《什么是〈龙与地下城〉？》</a></li>
</ul>
`;
