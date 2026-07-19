import {
  DND_2024_ATTACK_ACTION_RULES_URL,
  EN_DND_DAGGER_PATH,
  EN_RAPIER_DND_PATH,
  EN_EDITOR_PATH,
  ZH_DND_DAGGER_PATH,
  ZH_RAPIER_DND_PATH,
  ZH_EDITOR_PATH,
} from './shared';

export const dndSwordSheathsArticleHtml = String.raw`
<p>In 2024 D&amp;D, an attack made as part of the Attack action can include equipping or unequipping one weapon before or after that attack. Drawing a sword from a sheath, sheathing it, or dropping it stays inside that timing. <strong>dnd sword sheaths</strong> also do more than hold a blade: they can carry character history, set up a story hook, and remain readable when a portrait becomes a tiny VTT token.</p>

<p>A sheath is easy to ignore until it gives the party a reason to care. A cracked officer's scabbard can identify a deserter. A silk-lined case can tell you that a duelist expects a court, not a dungeon. A locked blade can turn a routine handoff into a scene. None of that needs a new damage bonus.</p>

<h2 id="attack-action-rule">The rule is smaller than the picture in your head</h2>
<p>The current <a href="${DND_2024_ATTACK_ACTION_RULES_URL}" rel="noreferrer noopener">2024 D&amp;D rules glossary</a> ties this to the Attack action: <strong>each attack made as part of the Attack action lets you equip or unequip one weapon before or after that attack.</strong> Equipping includes drawing a weapon from a sheath or picking it up. Unequipping includes sheathing it, stowing it, or dropping it.</p>

<p>That is a useful combat rule, but it is not a choreography simulator. It does not give a mundane back scabbard a faster draw. It does not decide whether a greatsword can be drawn from a particular costume setup. It does not grant a normal sheath a hidden mechanical effect. Bring those physical details to the DM when they matter in a scene.</p>

<h3>Use the wording at the table</h3>
<ul>
  <li><strong>Drawing a sword:</strong> state that you are equipping it as part of an attack.</li>
  <li><strong>Putting it away:</strong> sheathing, stowing, and dropping all count as unequipping under the current wording.</li>
  <li><strong>Changing weapons:</strong> say exactly what leaves your hand and what you are drawing. It prevents the familiar "wait, where did the first sword go?" pause.</li>
  <li><strong>Using a special sheath:</strong> read that item's text first. A custom or magical scabbard needs a table ruling for any effect beyond the normal interaction.</li>
</ul>

<h2 id="character-story">Build the scabbard from a promise, not a material list</h2>
<p>Leather, bronze, and carved wood are visual details. They become memorable when they answer a question about the person wearing them. Start there, then choose the visible details.</p>

<h3>The scabbard that remembers an oath</h3>
<p>Put the oath on the object, not in a paragraph of backstory. A worn seal tag, a split band of silver, or an empty slot where a family crest once sat tells the group that the blade was entrusted, inherited, or taken. The important question is simple: who notices it first?</p>

<h3>The scabbard made for a job</h3>
<p>A city investigator carries a plain case that does not advertise a weapon. A caravan guard has a patched rain flap and a repair stitch near the tip. A court duelist keeps the mouth polished because people see it before they see the blade. The job determines the scabbard's wear pattern.</p>

<h3>The scabbard the character does not deserve</h3>
<p>Give the low-level character a scabbard that is too fine for their current life. It can be a dead parent's ceremonial case, a battlefield trophy, or property that somebody wants returned. The sword can be ordinary. The case still puts a hook on the table.</p>

<h2 id="dm-prompts">Four scabbards that give a DM something to use</h2>
<p><strong>These are homebrew prompts, not official magic-item rules.</strong> They work best when the group agrees on the effect before the item appears in a tense scene.</p>

<h3>The witness case</h3>
<p>Its brass throat records the last name spoken while the sword is sheathed. Once per adventure, the bearer can ask the scabbard to repeat that name in the same voice. It does not identify liars or solve a mystery. It gives the party one eerie detail to chase.</p>

<h3>The borrowed scabbard</h3>
<p>The blade always slides in cleanly for its rightful owner. Anyone else can carry it, but the case rattles loudly whenever they try to draw the sword in secret. That is a social complication, not a combat upgrade.</p>

<h3>The road-worn case</h3>
<p>After a long rest in the open, the scabbard leaves a thin line of pale dust on the ground between camp and the first place the bearer travels that day. It gives a ranger, guard, or rival a clue without turning the object into a GPS device.</p>

<h3>The apology scabbard</h3>
<p>The inside lining stains red whenever the sword draws blood from a creature that has offered surrender since the last dawn. It cannot stop the blow. It just makes the consequence impossible to ignore.</p>

<h2 id="vtt-visuals">Make the sheath visible on a VTT token</h2>
<p>At battle-map size, a full sword silhouette often disappears behind a shoulder, cloak, or spell effect. The scabbard gives the character a cleaner shape to recognize. Make one part visible: the pommel above the shoulder, a diagonal leather line across the hip, a colored throat, or a distinctive chape near the boot.</p>

<ol>
  <li>Choose one readable detail, not every buckle and stitch.</li>
  <li>Keep the weapon line away from the face, which is usually the useful part of a portrait token.</li>
  <li>Use a different token border or label for the sword's state only when the table needs to track it.</li>
  <li>Treat a back scabbard as character art unless the DM has given it a specific story or rules consequence.</li>
</ol>

<p>In the <a href="${EN_EDITOR_PATH}">Token Maker editor</a>, crop the portrait around that one scabbard clue, then use a simple border that does not compete with the silhouette. The editor keeps the work in the browser and exports transparent PNG tokens for Roll20, Foundry VTT, and Owlbear. For a duelist or rogue, the <a href="${EN_RAPIER_DND_PATH}">rapier guide</a> and <a href="${EN_DND_DAGGER_PATH}">dagger guide</a> give you two useful weapon silhouettes to pair with a scabbard design.</p>

<h2 id="session-zero">One ruling worth making before initiative</h2>
<p>Talk through the visual setup once, before it becomes an argument in a tight combat round. A clear answer to these questions is enough:</p>
<ul>
  <li>Does this costume choice have any rule effect, or is it visual only?</li>
  <li>If it is a back-mounted weapon, is drawing it ordinary at this table or does the character need to reposition first?</li>
  <li>What changes when the sheath is magical: the draw, the sword, the bearer, or only the story?</li>
  <li>Will the VTT need a visible marker, or can the group remember it without one?</li>
</ul>

<h2 id="faq">DnD sword sheaths FAQ</h2>
<h3>Can you draw a sword from a sheath as part of an attack in 2024 DnD?</h3>
<p>Yes. When you make an attack as part of the Attack action, the current rules let you equip one weapon before or after that attack. Drawing it from a sheath counts as equipping it.</p>

<h3>Can you sheathe a sword as part of an attack in 2024 DnD?</h3>
<p>Yes. The current rules list sheathing, stowing, and dropping a weapon as ways to unequip it before or after an attack in the Attack action.</p>

<h3>Does a back scabbard make drawing a sword faster in DnD?</h3>
<p>No official combat bonus comes from a mundane back scabbard. Treat it as character art unless your DM gives that setup a specific ruling or item effect.</p>

<h3>Is a scabbard different from a sheath in DnD?</h3>
<p>At most DnD tables, both words communicate the same practical idea: a cover or holder for a bladed weapon. Use the term your group finds clearest, then describe the object in a way that fits the character.</p>

<h3>Can a magic scabbard make any sword magical?</h3>
<p>Only if the item's text or your DM says it can. The four examples above are homebrew story prompts, not official magic-item effects.</p>

<h3>How should a sword sheath appear on a VTT token?</h3>
<p>Show one clear identifier, such as a pommel, diagonal strap, colored throat, or metal chape. Keep the face readable and avoid treating a visual detail as a rules bonus unless the table has agreed on one.</p>

<h2 id="source">Rules source</h2>
<p>For a live rules check, use the <a href="${DND_2024_ATTACK_ACTION_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond 2024 rules glossary entry for the Attack action</a>. It is the source for the draw, sheath, stow, and drop language summarized above.</p>
`;

export const dndSwordSheathsArticleHtmlZh = String.raw`
<p>在 2024 D&amp;D 中，攻击动作（Attack action）中的一次攻击前后，可以装备或解除装备一件武器；从剑鞘抽出武器、插回鞘，或把武器丢下，都属于这个时机里的处理。剑鞘（scabbard）也不只是收纳物：它能说明角色是谁，变成剧情钩子，并在缩小后的 VTT Token 上留下清晰轮廓。</p>

<p>剑鞘很容易被忽略，直到它给全队一个在意它的理由。裂开的军官鞘口能暴露逃兵身份；丝绒内衬说明决斗者原本要去的是宫廷，不是地城；带锁的剑鞘能把一次普通交接变成一场戏。这里不需要再塞一个伤害加值。</p>

<h2 id="attack-action-rule">规则比脑中的画面小得多</h2>
<p>当前 <a href="${DND_2024_ATTACK_ACTION_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond 2024 规则术语表</a>把这件事放在攻击动作里：<strong>当前 2024 规则把“抽出”与“收起”放进攻击动作（Attack action）中的每次攻击前后。</strong>抽出剑鞘里的武器或捡起武器，都属于装备；把武器插回鞘、收起或丢下，都属于解除装备。</p>

<p>这是一条好用的战斗规则，不是武器走位模拟器。它没有给普通背鞘额外的抽剑速度，也没有决定某套服装上的大剑能否自然抽出，更不会让普通剑鞘自动拥有隐藏机械效果。只有在这些细节会影响场景时，才把它交给 DM 裁定。</p>

<h3>桌边怎么说最清楚</h3>
<ul>
  <li><strong>抽剑：</strong>直接说明你在这次攻击前装备武器。</li>
  <li><strong>收剑：</strong>插回剑鞘、收起和丢下，在当前文本里都属于解除装备。</li>
  <li><strong>换武器：</strong>说清哪把离开手、哪把要抽出来。这样不会出现“第一把剑刚才去哪了”的停顿。</li>
  <li><strong>特殊剑鞘：</strong>先读物品文本。自制或魔法剑鞘想产生普通互动以外的效果，需要 DM 给出明确裁定。</li>
</ul>

<h2 id="character-story">先给剑鞘一个承诺，再选材料</h2>
<p>皮革、黄铜和雕花只是视觉信息。它们在回答“这个人是谁”之后才会变得好记。先回答这个问题，再去选表面细节。</p>

<h3>记得誓言的剑鞘</h3>
<p>把誓言留在物件上，不要塞进一整段背景故事。磨损的封蜡吊牌、断开的银环，或曾经嵌着家徽的空位，都能说明这把剑是被托付、继承，还是夺来的。真正好用的问题是：谁会第一个认出它？</p>

<h3>为了工作而做的剑鞘</h3>
<p>城内调查员带的是不显眼的剑套；商队守卫的剑鞘有防雨翻盖，鞘尾还有补过的针脚；宫廷决斗者会把鞘口擦亮，因为人们先看到它，再看到剑。工作决定了剑鞘留下什么磨损。</p>

<h3>角色暂时配不上的剑鞘</h3>
<p>让低等级角色拥有一把和当下生活不相称的精致剑鞘。它可以是亡亲的礼仪用品、战场战利品，或别人想拿回去的财物。剑本身完全可以普通，剑鞘仍然能把剧情钩子摆到桌上。</p>

<h2 id="dm-prompts">四种能给 DM 留下空间的剑鞘</h2>
<p><strong>以下都是自制内容提示，不是官方魔法物品规则。</strong>它们适合在紧张场景之前，由全桌先约定作用范围。</p>

<h3>见证者剑鞘</h3>
<p>铜制鞘口会记住剑入鞘时最后被说出的名字。每次冒险一次，持有者可以让它用原来的声音复述这个名字。它不识破谎言，也不能解开谜题，只留下一条诡异线索。</p>

<h3>借来的剑鞘</h3>
<p>对真正主人来说，剑总能顺畅滑入鞘中。其他人当然也能拿着它，但只要想偷偷拔剑，鞘身就会发出响声。这是社交麻烦，不是战斗强化。</p>

<h3>赶路剑鞘</h3>
<p>在野外长休后，剑鞘会在持有者从营地离开到当天第一处目的地的路上，留下细细一线浅色尘土。它能给游侠、卫兵或追踪者一点线索，却不是 GPS。</p>

<h3>道歉剑鞘</h3>
<p>只要这把剑从上一次黎明起伤到过一个已经投降的生物，内衬就会染红。它无法阻止那一击，只会让后果没法被忽略。</p>

<h2 id="vtt-visuals">让剑鞘在 VTT Token 上看得见</h2>
<p>战斗地图尺寸下，完整的剑形很容易被肩膀、斗篷或法术效果遮掉。剑鞘反而能给角色留下一条更容易认出的轮廓。只保留一个清晰元素：肩上露出的剑柄、腰侧斜过的一条皮革线、带颜色的鞘口，或靴边特别的鞘尾金属件。</p>

<ol>
  <li>只挑一个能读出来的细节，不要把每条缝线和皮带都画进去。</li>
  <li>别让武器线条压住脸，头像 Token 最有用的地方通常还是表情。</li>
  <li>只有全桌真的需要追踪剑的状态时，才给它额外加 Token 边框或标签。</li>
  <li>把背鞘当成角色美术，除非 DM 已经赋予它明确的剧情或规则后果。</li>
</ol>

<p>在 <a href="${ZH_EDITOR_PATH}">Token Maker 编辑器</a>里，围绕那个剑鞘细节裁切头像，再配一圈不抢轮廓的简洁边框。编辑器在浏览器内完成处理，可导出给 Roll20、Foundry VTT 和 Owlbear 使用的透明 PNG Token。决斗者或游荡者也可以配合 <a href="${ZH_RAPIER_DND_PATH}">细剑指南</a>和<a href="${ZH_DND_DAGGER_PATH}">匕首指南</a>，挑出更符合剑鞘轮廓的武器形状。</p>

<h2 id="session-zero">开打前值得先说清的一条裁定</h2>
<p>这种视觉设定最好在进入紧张战斗前说一次。下面几件事有答案就够了：</p>
<ul>
  <li>这套服装设计有规则效果，还是纯视觉？</li>
  <li>若武器背在身后，这桌把抽出它视为普通动作互动，还是要先调整姿势？</li>
  <li>若剑鞘有魔法，改变的是抽剑、剑、持有者，还是只改变故事？</li>
  <li>VTT 需要可见标记，还是所有人记得住就行？</li>
</ul>

<h2 id="faq">DND 剑鞘常见问题</h2>
<h3>2024 DnD 里能在攻击时从剑鞘抽剑吗？</h3>
<p>可以。你在攻击动作里进行一次攻击时，当前规则允许你在该次攻击前或后装备一件武器；从剑鞘抽出它属于装备。</p>

<h3>2024 DnD 里能在攻击时把剑插回鞘吗？</h3>
<p>可以。当前规则把插回剑鞘、收起和丢下武器都列为解除装备，它们可以发生在攻击动作中的一次攻击前或后。</p>

<h3>背鞘会让 DnD 角色抽剑更快吗？</h3>
<p>不会。普通背鞘没有官方战斗加值。除非 DM 对该设定或物品效果作出明确裁定，否则把它当作角色美术即可。</p>

<h3>DnD 里的 scabbard 和 sheath 有区别吗？</h3>
<p>在多数 DnD 桌上，这两个词传达的实用意思相同，都是刃器的外套或收纳物。选全桌听得懂的说法，再按角色去描述它即可。</p>

<h3>魔法剑鞘能让任何剑都变成魔法武器吗？</h3>
<p>只有物品文本或 DM 明确说可以时才行。上面四个例子都是自制剧情提示，不是官方魔法物品效果。</p>

<h3>剑鞘应该怎样出现在 VTT Token 上？</h3>
<p>保留一个清晰识别点就够了，例如剑柄、斜背带、彩色鞘口或金属鞘尾。让脸仍然看得清楚，也不要把视觉细节当成规则加值，除非全桌已经约定。</p>

<h2 id="source">规则来源</h2>
<p>需要现场核对时，请看 <a href="${DND_2024_ATTACK_ACTION_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond 的 2024 攻击动作（Attack action）规则术语表</a>。本文关于抽出、插回剑鞘、收起和丢下武器的说明都来自这里。</p>
`;
