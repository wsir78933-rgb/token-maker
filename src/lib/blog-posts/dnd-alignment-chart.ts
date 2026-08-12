import {
  DND_ALIGNMENT_CHART_2024_RULES_URL,
  DND_ALIGNMENT_CHART_OFFICIAL_GUIDE_URL,
  EN_DND_CLASSES_PATH,
  EN_DND_RACES_PATH,
  EN_DWELF_DND_PATH,
  EN_EDITOR_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_DND_RACES_PATH,
  ZH_DWELF_DND_PATH,
  ZH_EDITOR_PATH,
} from './shared';

export const dndAlignmentChartArticleHtml = String.raw`
<p><strong>A DnD alignment combines two judgments.</strong> One asks how your character relates to order: lawful, neutral, or chaotic. The other asks how they treat people when a choice has a cost: good, neutral, or evil. Put the answers together and you get one of nine alignments.</p>

<p>The <a href="${DND_ALIGNMENT_CHART_2024_RULES_URL}" rel="noreferrer noopener">2024 Basic Rules</a> describe these labels as typical behavior, not commands. Pick the square that best describes what your character usually does. If their actions change over the campaign, the label can change with them.</p>

<h2>Read the DnD alignment chart in 30 seconds</h2>
<table>
  <thead>
    <tr>
      <th scope="col">Moral tendency</th>
      <th scope="col">Lawful</th>
      <th scope="col">Neutral toward order</th>
      <th scope="col">Chaotic</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Good</th>
      <td><strong>Lawful Good (LG)</strong><br />Protect others through duty, codes, and just institutions.</td>
      <td><strong>Neutral Good (NG)</strong><br />Choose the action that helps, whether rules support it or not.</td>
      <td><strong>Chaotic Good (CG)</strong><br />Follow conscience and defend freedom from harmful authority.</td>
    </tr>
    <tr>
      <th scope="row">Neutral</th>
      <td><strong>Lawful Neutral (LN)</strong><br />Honor law, tradition, or a personal code without a moral crusade.</td>
      <td><strong>Neutral / True Neutral (N)</strong><br />Decide by circumstance without a steady pull toward either axis.</td>
      <td><strong>Chaotic Neutral (CN)</strong><br />Protect personal freedom and resist control without a duty to rescue others.</td>
    </tr>
    <tr>
      <th scope="row">Evil</th>
      <td><strong>Lawful Evil (LE)</strong><br />Use hierarchy, contracts, or discipline to take and hold power.</td>
      <td><strong>Neutral Evil (NE)</strong><br />Pursue personal desires without concern for the harm left behind.</td>
      <td><strong>Chaotic Evil (CE)</strong><br />Follow hatred, violence, or appetite without restraint.</td>
    </tr>
  </tbody>
</table>

<p>Read across to choose a relationship with order. Read down to choose a moral tendency. Lawful does not mean obeying every government, and chaotic does not mean random behavior. A disciplined rebel can be lawful. A careful guard can be chaotic when personal judgment always outranks the chain of command.</p>

<p>Good and evil are about what happens to other people. A good character accepts real costs to protect others. An evil character willingly exploits or harms others to get what they want. Neutral characters lack a consistent pull toward either extreme, or they decide case by case.</p>

<h2>Choose the two axes separately</h2>
<h3>Lawful, neutral, or chaotic: what earns obedience?</h3>
<p>Choose lawful when your character trusts a code, institution, tradition, or sworn structure enough to limit their own choices. The code does not have to be local law. A knight loyal to a deposed order and a criminal who never betrays the guild can both be lawful.</p>

<p>Choose chaotic when personal conscience and freedom outrank imposed structure. A chaotic character can keep promises, plan carefully, and cooperate with a party. The difference appears when a rule and a personal judgment point in opposite directions.</p>

<p>Choose neutral on this axis when neither structure nor freedom wins consistently. Your character uses rules when they work, ignores them when they do not, and does not treat either approach as an ideal.</p>

<h3>Good, neutral, or evil: who pays the cost?</h3>
<p>Choose good when your character repeatedly protects life, dignity, or freedom even when doing so costs time, safety, status, or treasure.</p>

<p>Choose evil when your character knowingly pushes serious costs onto other people for power, pleasure, revenge, or convenience. An evil character can love friends and honor agreements. The label comes from the harm they accept outside that circle.</p>

<p>Choose neutral when self-interest, loyalty, duty, and compassion compete without one moral direction controlling most decisions. Neutral is not automatically balanced, wise, passive, or indifferent.</p>

<h2>Pressure-test the result with one hard choice</h2>
<p>Your party catches a courier carrying proof that the city magistrate has been selling prisoners. Written law orders you to surrender the courier to the city watch. The watch captain is loyal to the magistrate. Hiding the courier protects one witness but makes every party member a wanted criminal.</p>

<p>Ask what your character does with the legal process, then ask who must carry the risk. The first answer locates order; the second exposes morality.</p>

<h3>The good row protects the witness</h3>
<p><strong>Lawful Good</strong> looks for a legitimate authority, sworn order, public hearing, or better law. If every institution is captured, the character may break a rule but still feels responsible for rebuilding a just process.</p>

<p><strong>Neutral Good</strong> chooses the route most likely to keep the courier alive and expose the crime. Legal permission helps, but it does not outweigh the victim's safety.</p>

<p><strong>Chaotic Good</strong> gets the courier out, releases the evidence, and trusts conscience over the magistrate's command. The character still plans around the danger forced onto the party.</p>

<h3>The neutral row follows another priority</h3>
<p><strong>Lawful Neutral</strong> follows the code with the strongest claim. That may mean obeying the watch, honoring an oath to protect witnesses, or refusing to act until jurisdiction is clear. Mercy and cruelty do not decide the method.</p>

<p><strong>True Neutral</strong> weighs survival, relationships, and the immediate mission. The character may hide the courier for a night, trade the evidence, or avoid the dispute. No larger commitment to order, freedom, sacrifice, or exploitation controls the choice.</p>

<p><strong>Chaotic Neutral</strong> refuses to let the magistrate dictate the decision. The character may free the courier because captivity is intolerable, then leave the city rather than take responsibility for reforming it.</p>

<h3>The evil row treats the witness as leverage</h3>
<p><strong>Lawful Evil</strong> uses the system as leverage. The courier might become a bargaining chip, a coerced informant, or proof saved for the right political moment. Harm is acceptable, but the character prefers controlled harm that strengthens a hierarchy or pact.</p>

<p><strong>Neutral Evil</strong> picks the outcome with the best personal return and the least personal risk. The courier, the watch, and even the party are resources unless attachment or fear changes the calculation.</p>

<p><strong>Chaotic Evil</strong> destroys restraints and treats the resulting harm as irrelevant or desirable. Burning the evidence, killing the courier, or provoking a riot can all fit if violence, hatred, or appetite drives the choice.</p>

<p>If one response fits only because it produces the result you want, test another scene. Alignment describes a pattern across choices, not the most dramatic decision on a character sheet.</p>

<h2>Play the alignment, not the stereotype</h2>
<p>Give the character a reason, a limit, and an exception. A Lawful Good fighter may trust courts because a fair trial once saved an innocent sibling, yet refuse orders issued in secret. A Chaotic Neutral rogue may hate contracts but never abandon a traveling companion. These details create decisions. A label alone does not.</p>

<p>Party cooperation still matters. &ldquo;It is what my character would do&rdquo; does not make a choice workable for everyone else. A disruptive character can warn the party, accept consequences, and give other players room to respond. Secretly sabotaging the group and pointing at an alignment box is not deeper roleplay.</p>

<p>Class does not set alignment. A paladin can value an oath without trusting the state. A rogue can follow a strict code. A warlock can protect people, and a cleric can exploit them. <a href="${EN_DND_CLASSES_PATH}">Choose a class for the actions you want to take</a>, then use alignment to describe why the character tends to choose one method over another. The same boundary applies to origin: <a href="${EN_DND_RACES_PATH}">choose a species without treating it as a moral label</a>.</p>

<h2>Let repeated actions move the label</h2>
<p>After three important sessions, write down one decision from each game. Record the rule or promise at stake, who benefited, who paid, and whether the character would make the same choice again.</p>

<p>Look for movement on one axis at a time. A Lawful Good character who stops trusting institutions but keeps accepting risks for strangers is moving toward Neutral Good or Chaotic Good, not toward evil. A Chaotic Neutral character who repeatedly harms outsiders for convenience is moving toward Neutral Evil or Chaotic Evil, even if they still value freedom.</p>

<p>Change the label when the new pattern feels established. You do not need to rewrite the character after one desperate act. The change should summarize the story that has already happened. A strong personal code can also grow from a specific promise; <a href="${EN_DWELF_DND_PATH}">build a character around a family promise</a> when ancestry, loyalty, and freedom need a sharper point of tension.</p>

<h2>Give the alignment a visual signal</h2>
<p>Show the values before you print an abbreviation. Order can appear through symmetry, maintained equipment, heraldic geometry, or a repeated oath symbol. Freedom can appear through asymmetry, improvised layers, broken insignia, or movement in the pose. Protection can use an open stance or a visible keepsake; exploitation can appear through controlled distance, trophies, or symbols of ownership.</p>

<p>Keep the signal subordinate to the character. White clothing does not make someone good, and spikes do not make someone evil. Use one or two details tied to choices the character has actually made.</p>

<p>When the portrait is ready, <a href="${EN_EDITOR_PATH}">build a token portrait that carries those values</a>. Crop around the face and the chosen symbol, then check the result at map size. Recognition matters more than a moral label floating over the character.</p>

<h2>Keep the label useful at the table</h2>
<p>The 2024 Basic Rules assume player characters are not evil and tell players to check with the DM before making an evil character. That conversation should cover party safety, campaign tone, and what kinds of conflict remain off limits.</p>

<p>Alignment does not grant a general bonus, penalty, or permission to control another player's character. It is a roleplaying description. Specific game features can refer to alignment, but the chart itself does not replace their rules text.</p>

<p>Some creatures are unaligned because they lack the capacity for rational moral choice. A dangerous predator can be unaligned rather than evil. For player characters and thinking NPCs, use the nine alignments as shared vocabulary, then judge the person by decisions made in play.</p>

<h2>Sources</h2>
<ul>
  <li><a href="${DND_ALIGNMENT_CHART_2024_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond 2024 Basic Rules: Creating a Character</a></li>
  <li><a href="${DND_ALIGNMENT_CHART_OFFICIAL_GUIDE_URL}" rel="noreferrer noopener">D&amp;D Beyond: Breaking Down Alignment in D&amp;D</a></li>
</ul>
`;

export const dndAlignmentChartArticleHtmlZh = String.raw`
<p><strong>DND 阵营由两次判断组合而成。</strong>第一条轴看角色如何对待秩序：守序、中立或混乱。第二条轴看角色在代价出现时如何对待他人：善良、中立或邪恶。两条轴交叉后，得到九种阵营之一。</p>

<p><a href="${DND_ALIGNMENT_CHART_2024_RULES_URL}" rel="noreferrer noopener">2024 基础规则</a>写的是各阵营的典型行为，不是强制命令。先选最接近角色日常选择的格子。战役中行为发生稳定变化，阵营也可以跟着改变。</p>

<h2>30 秒读懂 DND 阵营九宫格</h2>
<table>
  <thead>
    <tr>
      <th scope="col">道德倾向</th>
      <th scope="col">守序</th>
      <th scope="col">秩序中立</th>
      <th scope="col">混乱</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">善良</th>
      <td><strong>守序善良（LG）</strong><br />通过责任、准则与公正制度保护他人。</td>
      <td><strong>中立善良（NG）</strong><br />选择真正能帮助人的行动，不被规则绑死。</td>
      <td><strong>混乱善良（CG）</strong><br />服从良知，保护自由，不向有害权威让步。</td>
    </tr>
    <tr>
      <th scope="row">中立</th>
      <td><strong>守序中立（LN）</strong><br />遵守法律、传统或个人准则，但不承担善恶使命。</td>
      <td><strong>绝对中立（N）</strong><br />按具体情况决定，不稳定倒向任一条轴。</td>
      <td><strong>混乱中立（CN）</strong><br />优先保护个人自由，反抗控制，但不把救人当成义务。</td>
    </tr>
    <tr>
      <th scope="row">邪恶</th>
      <td><strong>守序邪恶（LE）</strong><br />利用等级、契约与纪律取得并巩固权力。</td>
      <td><strong>中立邪恶（NE）</strong><br />追逐个人欲望，不在意给别人留下多少伤害。</td>
      <td><strong>混乱邪恶（CE）</strong><br />让仇恨、暴力或欲望支配行动，不接受约束。</td>
    </tr>
  </tbody>
</table>

<p>横向判断角色与秩序的关系，纵向判断道德倾向。守序不等于服从每一个政府，混乱也不等于随机行动。反抗腐败王权的人仍可能严格遵守誓言；一个行事周密的卫兵，也可能在规则与个人判断冲突时永远选择后者。</p>

<p>善良与邪恶看的是别人承担了什么。善良角色愿意付出真实代价去保护他人；邪恶角色为了权力、快感、复仇或方便，可以主动利用或伤害别人。中立角色没有稳定倒向两端，常按当时的人际关系、利益与责任做决定。</p>

<h2>把两条轴分开判断</h2>
<h3>守序、中立还是混乱：什么值得服从？</h3>
<p>角色若信任某套准则、组织、传统或誓约，并愿意因此限制自己的选择，就偏向守序。准则不必等于本地法律。效忠被推翻骑士团的骑士，与绝不背叛公会的罪犯，都可能是守序角色。</p>

<p>个人良知与自由若长期高于外部制度，角色就偏向混乱。混乱角色照样可以守信、做计划并配合队伍。真正的分界出现在规则与个人判断指向相反方向时。</p>

<p>角色若不固定崇尚制度或自由，就选这条轴上的中立。规则好用时采用，不好用时绕开，不把任何一边当成必须捍卫的原则。</p>

<h3>善良、中立还是邪恶：代价由谁承担？</h3>
<p>角色若反复保护生命、尊严或自由，即使会损失时间、安全、地位或财物，也偏向善良。</p>

<p>角色若明知会给别人造成严重伤害，仍为了权力、快感、复仇或方便继续行动，就偏向邪恶。邪恶角色可以爱朋友，也可以履行契约。判断重点在于，他们允许圈外人承受什么。</p>

<p>自利、忠诚、责任与同情经常互相拉扯，没有一个道德方向主导大多数选择时，就选中立。中立不自动代表平衡、智慧、被动或冷漠。</p>

<h2>用一次艰难选择检验结果</h2>
<p>队伍抓到一名信使，他带着城中执政官贩卖囚犯的证据。成文法律要求你把信使交给城市卫队，但卫队长效忠执政官。藏起信使能保护唯一证人，却会让全队变成通缉犯。</p>

<p>先问角色要保留、替换还是拒绝法律程序，再问这项选择准备让谁承担风险。第一个答案定位秩序，第二个答案暴露道德倾向。</p>

<h3>善良一排先保护证人</h3>
<p><strong>守序善良</strong>会寻找合法上级、可信骑士团、公开审理或更公正的法律。所有机构都被控制时，角色也可能违法，但会认为自己有责任重建可靠的程序。</p>

<p><strong>中立善良</strong>选择最有可能保住信使并公开罪证的路线。法律许可当然有帮助，但不能压过受害者的安全。</p>

<p><strong>混乱善良</strong>会救走信使、放出证据，让良知高于执政官的命令。角色仍会考虑自己给队友带来的危险，不会把鲁莽当成自由。</p>

<h3>中立一排有别的优先事项</h3>
<p><strong>守序中立</strong>服从最有正当性的准则。结果可能是听从卫队，也可能是履行保护证人的誓约，或在管辖权不清前拒绝行动。怜悯与残酷不会决定方法。</p>

<p><strong>绝对中立</strong>权衡生存、人际关系和眼前任务。角色可能把信使藏一夜、拿证据交易，或干脆避开争议。秩序、自由、牺牲与剥削都没有持续控制这项选择。</p>

<p><strong>混乱中立</strong>拒绝让执政官替自己做决定。角色可能因为无法忍受囚禁而放走信使，随后离城，不负责改造这套制度。</p>

<h3>邪恶一排把证人当成筹码</h3>
<p><strong>守序邪恶</strong>利用制度取得优势。信使可以成为谈判筹码、被胁迫的线人，或留到合适政治时机再公开的证据。伤害可以接受，但角色偏好能巩固等级或契约的可控伤害。</p>

<p><strong>中立邪恶</strong>选择个人回报最高、风险最低的结果。信使、卫队甚至队伍都只是资源，除非感情或恐惧改变了计算。</p>

<p><strong>混乱邪恶</strong>摧毁约束，也不在意后果中的伤害。烧掉证据、杀死信使或煽动暴乱都可能符合，只要行动来自暴力、仇恨或欲望。</p>

<p>如果某个答案只是碰巧产生了你想要的结局，再换一个场景检验。阵营概括的是多次选择形成的习惯，不是角色卡上最戏剧化的一次决定。</p>

<h2>扮演阵营，不要扮演刻板印象</h2>
<p>给角色一个原因、一条底线和一个例外。守序善良战士可能因为公正审判救过无辜亲人而信任法庭，却拒绝任何秘密命令。混乱中立游荡者可能厌恶契约，却绝不抛弃旅伴。这些细节能产生选择，单独一个标签不能。</p>

<p>队伍合作仍然重要。“我的角色就是会这么做”不能自动让一项选择适合整桌人。可能制造冲突的角色可以提前警告队伍、承担后果，也给其他玩家回应的空间。暗中破坏队伍后指着阵营格子，并不会让角色扮演更深。</p>

<p>职业不会决定阵营。圣武士可以重视誓言却不信任国家，游荡者可以严守准则，邪术师可以保护别人，牧师也可以剥削别人。先<a href="${ZH_DND_CLASSES_PATH}">选择你想采取哪些行动的职业</a>，再用阵营解释角色为何长期偏爱某种方法。出身也遵循同一边界：<a href="${ZH_DND_RACES_PATH}">选择 Species 时不要把它当成道德标签</a>。</p>

<h2>让重复行动推动阵营变化</h2>
<p>经历三个重要场次后，各记下一次决定：当时牵涉哪条规则或承诺，谁得到好处，谁承担代价，角色是否愿意再次做同样的事。</p>

<p>每次先看一条轴。守序善良角色若不再信任制度，却继续为陌生人承担风险，变化方向是中立善良或混乱善良，不是邪恶。混乱中立角色若总为方便而伤害圈外人，就在靠近中立邪恶或混乱邪恶，即使角色仍重视自由。</p>

<p>新习惯稳定后再改标签。一次绝境选择不需要重写整个角色，阵营变化应该总结已经发生的故事。个人准则也可以从具体承诺里长出来；当血统、忠诚与自由需要更尖锐的冲突时，可以<a href="${ZH_DWELF_DND_PATH}">用家族承诺建立角色</a>。</p>

<h2>用视觉细节表达阵营</h2>
<p>先表现价值，再考虑缩写。秩序感可以来自对称构图、维护良好的装备、纹章几何或反复出现的誓约符号；自由感可以来自不对称服装、临时改装、破损徽记或带动作的姿态。保护他人可以通过开放站姿或珍视物件表现；剥削欲可以通过刻意保持距离、战利品或所有权符号表现。</p>

<p>视觉线索不能盖过角色本身。白衣不会自动让人善良，尖刺也不会自动让人邪恶。只保留一两个与实际选择有关的细节。</p>

<p>角色图准备好后，可以在 <a href="${ZH_EDITOR_PATH}">Token Maker 中制作带有这些价值线索的角色 Token</a>。裁切时保留脸和选定符号，再缩到地图尺寸检查。目标是让队友认出角色，不是在头像上悬挂道德标签。</p>

<h2>让阵营标签在桌上保持有用</h2>
<p>2024 基础规则默认玩家角色不是邪恶阵营；想创建邪恶角色时，要先征得 DM 同意。讨论内容应包括队伍安全、战役基调，以及哪些冲突方式不能出现。</p>

<p>阵营不会普遍提供加值、减值，也不会赋予控制其他玩家角色的权限。它是一种角色扮演描述。具体能力若提到阵营，仍以该能力自己的规则文字为准。</p>

<p>缺乏理性道德判断能力的生物可能没有阵营，也就是 Unaligned。危险捕食者可以没有阵营，而不是邪恶。面对玩家角色和有思考能力的 NPC，九宫格只提供共同词汇，真正的判断仍来自游戏中做过的选择。</p>

<h2>资料来源</h2>
<ul>
  <li><a href="${DND_ALIGNMENT_CHART_2024_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond 2024 基础规则：创建角色</a></li>
  <li><a href="${DND_ALIGNMENT_CHART_OFFICIAL_GUIDE_URL}" rel="noreferrer noopener">D&amp;D Beyond：Breaking Down Alignment in D&amp;D</a></li>
</ul>
`;
