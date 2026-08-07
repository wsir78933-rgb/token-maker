import {
  DND_GNOME_2014_RULES_URL,
  DND_GNOME_2024_RULES_URL,
  DND_GNOME_NAMES_VIDEO_PLACEHOLDER_PATH,
  DND_GNOME_NAMES_VIDEO_URL,
  EN_DICE_ROLLER_PATH,
  EN_DND_DWARF_NAMES_PATH,
  EN_EDITOR_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_DWARF_NAMES_PATH,
  ZH_EDITOR_PATH,
  liteVideoEmbed,
} from './shared';

const GNOME_VIDEO_ID = 'HRX8c3IihL0';

export const dndGnomeNamesArticleHtml = String.raw`
<p>Your gnome can own half a dozen names and still need one name the party remembers after a two-week break. Start with a short table name, add a clan name when family matters, then earn or choose a nickname that points to something the character has done.</p>

<p>Mix any of the 132 original name pieces. Keep a result that is easy to say, distinct from the rest of the party, and specific enough to suggest a voice, habit, debt, craft, or mistake.</p>

<h2>Start with the name your table will actually say</h2>
<p>Say each candidate aloud twice: once as an introduction and once as a warning shouted during combat. Keep the one that survives both. If "Jessamira Copperwhistle, called Quickfix" feels too long in play, use Jess or Quickfix at the table and keep the full form on the character sheet.</p>

<ul>
  <li>Give recurring characters different opening sounds. Brannik, Breena, and Brix blur together in the same scene.</li>
  <li>Keep the spoken name to two or three syllables unless the long version is part of the joke.</li>
  <li>Use a clan name only when it creates a relationship, expectation, or problem.</li>
  <li>Let a nickname record an event. "Wrong-Door" gives the DM more to work with than "the Clever."</li>
</ul>

<h2>Build a three-part gnome name</h2>
<p>The 2014 gnome description gives you a useful social pattern: a gnome may collect several family-given names and many nicknames, then use a personal name, clan name, and nickname around people who want something shorter. Treat that as permission, not paperwork.</p>

<table>
  <thead>
    <tr><th>Part</th><th>What it does</th><th>Example</th><th>Question to answer</th></tr>
  </thead>
  <tbody>
    <tr><td>Personal name</td><td>Handles everyday conversation</td><td>Fenna</td><td>What will the party call you?</td></tr>
    <tr><td>Clan name</td><td>Connects you to people, work, or home</td><td>Gearbloom</td><td>Who expects something from you?</td></tr>
    <tr><td>Nickname</td><td>Records reputation or an incident</td><td>Blue-Fingers</td><td>What story does everyone already know?</td></tr>
  </tbody>
</table>

<p>Fenna Gearbloom "Blue-Fingers" already carries three playable details: someone says Fenna in initiative, Gearbloom can become a family workshop, and Blue-Fingers demands an explanation.</p>

<h2>Choose from 60 gnome first names</h2>
<p>Gender does not have to control the sound. The columns are sorting aids, not rules. Move any name to the character who fits it.</p>

<table>
  <thead>
    <tr><th>Masculine</th><th>Feminine</th><th>Neutral</th><th>Quick NPC</th></tr>
  </thead>
  <tbody>
    <tr><td>Arvyn</td><td>Arlina</td><td>Addle</td><td>Bibbin</td></tr>
    <tr><td>Brannik</td><td>Bellissa</td><td>Brix</td><td>Cresset</td></tr>
    <tr><td>Cobren</td><td>Coralie</td><td>Coggle</td><td>Dimmle</td></tr>
    <tr><td>Doffin</td><td>Dovina</td><td>Dapple</td><td>Fizzin</td></tr>
    <tr><td>Erlen</td><td>Elsibell</td><td>Fenn</td><td>Grenda</td></tr>
    <tr><td>Fimrick</td><td>Fenna</td><td>Glint</td><td>Hobble</td></tr>
    <tr><td>Garron</td><td>Glinna</td><td>Hollis</td><td>Inkle</td></tr>
    <tr><td>Hobbik</td><td>Hespera</td><td>Jinx</td><td>Jottle</td></tr>
    <tr><td>Jessin</td><td>Ibbina</td><td>Kettle</td><td>Kippa</td></tr>
    <tr><td>Korrin</td><td>Jessamira</td><td>Lumen</td><td>Loddle</td></tr>
    <tr><td>Lemmoc</td><td>Kessia</td><td>Marn</td><td>Mopsy</td></tr>
    <tr><td>Norrick</td><td>Lorbella</td><td>Nib</td><td>Nettle</td></tr>
    <tr><td>Pindel</td><td>Minnowen</td><td>Quill</td><td>Pibble</td></tr>
    <tr><td>Raskin</td><td>Orlissa</td><td>Rook</td><td>Rilla</td></tr>
    <tr><td>Tobble</td><td>Pella</td><td>Tumble</td><td>Sprock</td></tr>
  </tbody>
</table>

<h2>Add one of 40 clan names</h2>
<p>Pick a clan name that puts pressure on the character. Copperwhistle might expect exact craft. Fernburrow might protect a hidden settlement. Underlamp might owe safe passage through an old tunnel. Wrongmap might have spent three generations trying to repair one famous mistake.</p>

<table>
  <thead>
    <tr><th>Craft and study</th><th>Woodland and home</th><th>Stone and Underdark</th><th>Reputation and family story</th></tr>
  </thead>
  <tbody>
    <tr><td>Copperwhistle</td><td>Fernburrow</td><td>Deepcairn</td><td>Lastbutton</td></tr>
    <tr><td>Gearbloom</td><td>Mossgleam</td><td>Underlamp</td><td>Twicefound</td></tr>
    <tr><td>Glasspin</td><td>Acornwake</td><td>Flinttunnel</td><td>Softshoe</td></tr>
    <tr><td>Rivetgleam</td><td>Thistlepath</td><td>Echochamber</td><td>Threebells</td></tr>
    <tr><td>Clockroot</td><td>Dewcap</td><td>Bluegrotto</td><td>Wrongmap</td></tr>
    <tr><td>Brightscrew</td><td>Rootsong</td><td>Cinderhollow</td><td>Goodmuddle</td></tr>
    <tr><td>Threadspark</td><td>Cloverknoll</td><td>Gemvault</td><td>Ashpocket</td></tr>
    <tr><td>Tinfable</td><td>Rainmantle</td><td>Quietshaft</td><td>Quickapology</td></tr>
    <tr><td>Quillcoil</td><td>Pinewhisper</td><td>Slatebridge</td><td>Moonteacup</td></tr>
    <tr><td>Brasspetal</td><td>Reednest</td><td>Nightwell</td><td>Neverlate</td></tr>
  </tbody>
</table>

<h2>Earn one of 32 gnome nicknames</h2>
<p>A nickname works best when another character can tell the story behind it. Decide who coined it, whether your gnome likes it, and what happens when a stranger uses it too soon.</p>

<table>
  <thead>
    <tr><th>Craft</th><th>Travel</th><th>Social</th><th>Mishap</th></tr>
  </thead>
  <tbody>
    <tr><td>Click</td><td>Mossboots</td><td>Teacup</td><td>One-Shoe</td></tr>
    <tr><td>Bentkey</td><td>Farstep</td><td>Loudwhisper</td><td>Sootnose</td></tr>
    <tr><td>Sparks</td><td>Underbridge</td><td>Wink</td><td>Duckfall</td></tr>
    <tr><td>Three-Gears</td><td>Cave-Lantern</td><td>Two-Tales</td><td>Blue-Fingers</td></tr>
    <tr><td>Little Hammer</td><td>Mapfold</td><td>Quickbow</td><td>Almost</td></tr>
    <tr><td>Copperthumb</td><td>Raincap</td><td>Auntie</td><td>Bell-Ringer</td></tr>
    <tr><td>Quickfix</td><td>Northstar</td><td>Night-Song</td><td>Wrong-Door</td></tr>
    <tr><td>Last Screw</td><td>Shortcut</td><td>Goodlistener</td><td>Saved-Tuesday</td></tr>
  </tbody>
</table>

<h2>Turn one name into a playable character</h2>
<p>Do not write a biography yet. Give the full name one tension and one visible cue. These twelve combinations are ready to use as player characters or NPCs.</p>

<table>
  <thead>
    <tr><th>Full name</th><th>Playable hook</th><th>Portrait cue</th></tr>
  </thead>
  <tbody>
    <tr><td>Arvyn Copperwhistle "Bentkey"</td><td>Can open any lock except the one on the family vault</td><td>Brass key, careful hands</td></tr>
    <tr><td>Fenna Gearbloom "Blue-Fingers"</td><td>Stole a dye formula to keep it out of a warlord's hands</td><td>Blue-stained gloves</td></tr>
    <tr><td>Brix Fernburrow "Mossboots"</td><td>Knows a forest path that appears only after rain</td><td>Mossy boots, folded map</td></tr>
    <tr><td>Jessamira Glasspin "Two-Tales"</td><td>Tells two versions of every expedition and neither is fully false</td><td>Split-color scarf</td></tr>
    <tr><td>Rook Underlamp "Cave-Lantern"</td><td>Carries the last light from an abandoned deep road</td><td>Cool lantern glow</td></tr>
    <tr><td>Pella Moonteacup "Quickbow"</td><td>Apologized to a duke while escaping through his window</td><td>Tiny cup, formal coat</td></tr>
    <tr><td>Hobbik Wrongmap "Shortcut"</td><td>Insists the clan's failed map hides a real road</td><td>Overmarked map case</td></tr>
    <tr><td>Lumen Quillcoil "Night-Song"</td><td>Writes messages that can only be read under moonlight</td><td>Silver ink and quill</td></tr>
    <tr><td>Coralie Rainmantle "Saved-Tuesday"</td><td>Rescued a village on the wrong day and refuses to explain</td><td>Weathered rain cape</td></tr>
    <tr><td>Nib Quietshaft "Loudwhisper"</td><td>Runs an information network in a silent mining town</td><td>Dark hood, bright earring</td></tr>
    <tr><td>Tobble Threebells "Almost"</td><td>Has nearly completed the same impossible device seven times</td><td>Three tiny bells</td></tr>
    <tr><td>Orlissa Brasspetal "Goodlistener"</td><td>Collects last requests from travelers before dangerous journeys</td><td>Pressed brass flower</td></tr>
  </tbody>
</table>

<h2>Let the character choose the final sound</h2>
<p>A workshop inventor does not need a gear surname. A forest gnome does not need a leaf name. A deep gnome does not need a grim one. Use culture as material, then let the individual's profession, hometown, and relationships decide what stays.</p>

<p>The 2024 rules give gnome characters a current species framework, while the older species entry carries the detailed many-names tradition. Pick the rules your table uses, but keep naming separate from mechanics. A name should describe this person, not lock every gnome into the same personality.</p>

<h2>Use the video to sharpen the character concept</h2>
<p><a href="${DND_GNOME_NAMES_VIDEO_URL}" rel="noreferrer noopener">Gnome 5e - Races for Dungeons and Dragons</a> covers gnome character options rather than handing you another name dump. Watch it after you have a shortlist. Keep the name that still fits when you can picture the character's role, habits, and place in the party.</p>

${liteVideoEmbed(GNOME_VIDEO_ID, 'Gnome 5e - Races for Dungeons and Dragons', {
  src: DND_GNOME_NAMES_VIDEO_PLACEHOLDER_PATH,
  alt: 'Video thumbnail for Gnome 5e - Races for Dungeons and Dragons',
})}

<h2>Keep a whole gnome cast easy to hear</h2>
<p>For a workshop, village, or family scene, sort names by sound before assigning jobs. Do not put Cobren, Coralie, and Coggle in the same conversation. Use one hard opening, one soft opening, and one nickname-led character instead: Cobren, Fenna, and Quickfix.</p>

<ol>
  <li>Write the six recurring names in one column.</li>
  <li>Circle repeated first sounds and repeated endings.</li>
  <li>Replace the weakest duplicate with a clan name or nickname.</li>
  <li>Read the final list at normal speaking speed.</li>
</ol>

<p>If an NPC needs game statistics tonight, use the <a href="${EN_DICE_ROLLER_PATH}">DnD dice roller</a> after the name and role are settled. The name should help you remember who the roll belongs to.</p>

<h2>Match the VTT token to the short name</h2>
<p>Choose one object or color that explains the nickname at map size. Blue-Fingers needs blue gloves, not a crowded alchemy bench. Cave-Lantern needs a cool light near the face. Threebells needs one readable bell cluster instead of tiny jewelry everywhere.</p>

<ul>
  <li>Crop close enough that the face and signature object remain visible at token size.</li>
  <li>Keep tools, leaves, or crystals behind the face instead of crossing the eyes.</li>
  <li>Use one visual cue for the nickname and one for the character's role.</li>
  <li>Store the full name on the character sheet; let the portrait carry the short identity.</li>
</ul>

<p>Open the <a href="${EN_EDITOR_PATH}">Token Maker editor</a>, crop around the face and signature cue, then compare the result with the rest of the party. For a heavier clan-name style built around craft, oaths, and stone, use the <a href="${EN_DND_DWARF_NAMES_PATH}">DND dwarf names guide</a> as a separate sound reference.</p>

<h2>DND gnome names FAQ</h2>
<h3>What are good DND gnome names?</h3>
<p>Good DND gnome names are easy to say and carry one memorable detail. Fenna Gearbloom "Blue-Fingers," Rook Underlamp "Cave-Lantern," and Hobbik Wrongmap "Shortcut" each give the table a short name plus a story prompt.</p>

<h3>Why do DND gnomes have so many names?</h3>
<p>The 2014 gnome description says relatives and clan elders may each give a gnome a name, while nicknames accumulate from other people. Around outsiders, a gnome often reduces the collection to a personal name, clan name, and nickname.</p>

<h3>Do gnome names need to sound funny?</h3>
<p>No. A playful sound fits many gnome characters, but the person still has to work in serious scenes. Put the humor in a nickname or family story instead of turning every syllable into a punchline.</p>

<h3>What is a good gnome clan name?</h3>
<p>A useful clan name points to craft, home, reputation, or an old event. Gearbloom, Fernburrow, Underlamp, and Wrongmap all create a place or family expectation the DM can bring into play.</p>

<h3>How long should a gnome name be on a VTT?</h3>
<p>Use one short personal name or nickname during play. Keep the full personal, clan, and nickname form on the sheet or handout so the map stays readable.</p>

<h2>Reference sources</h2>
<ul>
  <li><a href="${DND_GNOME_2014_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond: Gnome species entry and naming tradition</a></li>
  <li><a href="${DND_GNOME_2024_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond: 2024 character origins and Gnome species rules</a></li>
  <li><a href="${DND_GNOME_NAMES_VIDEO_URL}" rel="noreferrer noopener">SkullSplitter Dice: Gnome 5e - Races for Dungeons and Dragons</a></li>
</ul>
`;

export const dndGnomeNamesArticleHtmlZh = String.raw`
<p>你的侏儒可以拥有半打名字，但隔了两周再开团时，队友仍需要记得住其中一个。先选一个桌上称呼；家族关系重要时，再加氏族名；最后用昵称记录角色做过的事、闯过的祸或留下的名声。</p>

<p>132 个原创名字部件都可以自由组合。留下读得顺、和队伍里其他角色区分得开，还能带出说话方式、习惯、债务、手艺或失误的组合。</p>

<h2>先选桌上真正会喊的名字</h2>
<p>把候选名字各念两遍：一次用于自我介绍，一次用于战斗中大声警告。能同时通过这两个场景的名字才留下。如果 "Jessamira Copperwhistle，人称 Quickfix" 在实战里太长，桌上就叫 Jess 或 Quickfix，完整名字留在角色卡上。</p>

<ul>
  <li>让常驻角色使用不同的开头音。Brannik、Breena 和 Brix 同场时很容易听混。</li>
  <li>桌上称呼尽量控制在两到三个音节，除非冗长本身就是角色笑点。</li>
  <li>氏族名必须带来关系、期待或麻烦，否则可以不加。</li>
  <li>让昵称记录一件事。"Wrong-Door" 比 "the Clever" 更容易变成剧情。</li>
</ul>

<h2>组合一个三段式侏儒名字</h2>
<p>2014 版侏儒说明提供了一个很实用的社交习惯：亲属会给侏儒不同名字，其他人还会不断送上昵称；面对喜欢简短称呼的人时，侏儒通常只拿出个人名、氏族名和一个昵称。把它当成创作许可，不要当成必须填满的表格。</p>

<table>
  <thead>
    <tr><th>部分</th><th>作用</th><th>例子</th><th>要回答的问题</th></tr>
  </thead>
  <tbody>
    <tr><td>个人名</td><td>负责日常称呼</td><td>Fenna</td><td>队友在战斗中会喊什么？</td></tr>
    <tr><td>氏族名</td><td>连接亲人、手艺或家乡</td><td>Gearbloom</td><td>谁正对你抱有期待？</td></tr>
    <tr><td>昵称</td><td>记录名声或事故</td><td>Blue-Fingers</td><td>大家已经听过哪件事？</td></tr>
  </tbody>
</table>

<p>Fenna Gearbloom "Blue-Fingers" 已经带着三个能直接使用的细节：先攻里喊 Fenna，Gearbloom 可以变成一间家族工坊，而 Blue-Fingers 必须有个解释。</p>

<h2>从 60 个侏儒个人名里挑选</h2>
<p>性别不必决定名字声音。表格分列只是方便筛选，不是限制；任何名字都可以交给真正适合它的角色。</p>

<table>
  <thead>
    <tr><th>偏男性</th><th>偏女性</th><th>中性</th><th>快速 NPC</th></tr>
  </thead>
  <tbody>
    <tr><td>Arvyn</td><td>Arlina</td><td>Addle</td><td>Bibbin</td></tr>
    <tr><td>Brannik</td><td>Bellissa</td><td>Brix</td><td>Cresset</td></tr>
    <tr><td>Cobren</td><td>Coralie</td><td>Coggle</td><td>Dimmle</td></tr>
    <tr><td>Doffin</td><td>Dovina</td><td>Dapple</td><td>Fizzin</td></tr>
    <tr><td>Erlen</td><td>Elsibell</td><td>Fenn</td><td>Grenda</td></tr>
    <tr><td>Fimrick</td><td>Fenna</td><td>Glint</td><td>Hobble</td></tr>
    <tr><td>Garron</td><td>Glinna</td><td>Hollis</td><td>Inkle</td></tr>
    <tr><td>Hobbik</td><td>Hespera</td><td>Jinx</td><td>Jottle</td></tr>
    <tr><td>Jessin</td><td>Ibbina</td><td>Kettle</td><td>Kippa</td></tr>
    <tr><td>Korrin</td><td>Jessamira</td><td>Lumen</td><td>Loddle</td></tr>
    <tr><td>Lemmoc</td><td>Kessia</td><td>Marn</td><td>Mopsy</td></tr>
    <tr><td>Norrick</td><td>Lorbella</td><td>Nib</td><td>Nettle</td></tr>
    <tr><td>Pindel</td><td>Minnowen</td><td>Quill</td><td>Pibble</td></tr>
    <tr><td>Raskin</td><td>Orlissa</td><td>Rook</td><td>Rilla</td></tr>
    <tr><td>Tobble</td><td>Pella</td><td>Tumble</td><td>Sprock</td></tr>
  </tbody>
</table>

<h2>加上 40 个氏族名中的一个</h2>
<p>氏族名最好能给角色施加一点压力。Copperwhistle 可能要求工艺绝不能出错；Fernburrow 可能守着一处隐秘聚落；Underlamp 也许欠着一条旧隧道的通行债；Wrongmap 一家可能花了三代人修补一场著名的制图事故。</p>

<table>
  <thead>
    <tr><th>工艺与学问</th><th>林地与家园</th><th>岩石与幽暗地域</th><th>名声与家族旧事</th></tr>
  </thead>
  <tbody>
    <tr><td>Copperwhistle</td><td>Fernburrow</td><td>Deepcairn</td><td>Lastbutton</td></tr>
    <tr><td>Gearbloom</td><td>Mossgleam</td><td>Underlamp</td><td>Twicefound</td></tr>
    <tr><td>Glasspin</td><td>Acornwake</td><td>Flinttunnel</td><td>Softshoe</td></tr>
    <tr><td>Rivetgleam</td><td>Thistlepath</td><td>Echochamber</td><td>Threebells</td></tr>
    <tr><td>Clockroot</td><td>Dewcap</td><td>Bluegrotto</td><td>Wrongmap</td></tr>
    <tr><td>Brightscrew</td><td>Rootsong</td><td>Cinderhollow</td><td>Goodmuddle</td></tr>
    <tr><td>Threadspark</td><td>Cloverknoll</td><td>Gemvault</td><td>Ashpocket</td></tr>
    <tr><td>Tinfable</td><td>Rainmantle</td><td>Quietshaft</td><td>Quickapology</td></tr>
    <tr><td>Quillcoil</td><td>Pinewhisper</td><td>Slatebridge</td><td>Moonteacup</td></tr>
    <tr><td>Brasspetal</td><td>Reednest</td><td>Nightwell</td><td>Neverlate</td></tr>
  </tbody>
</table>

<h2>从 32 个昵称中记录一段经历</h2>
<p>只要另一个角色能讲出它的来历，昵称就会好用。先决定是谁取的、你的侏儒喜不喜欢，以及陌生人太早使用这个昵称时会发生什么。</p>

<table>
  <thead>
    <tr><th>工艺</th><th>旅行</th><th>社交</th><th>意外</th></tr>
  </thead>
  <tbody>
    <tr><td>Click</td><td>Mossboots</td><td>Teacup</td><td>One-Shoe</td></tr>
    <tr><td>Bentkey</td><td>Farstep</td><td>Loudwhisper</td><td>Sootnose</td></tr>
    <tr><td>Sparks</td><td>Underbridge</td><td>Wink</td><td>Duckfall</td></tr>
    <tr><td>Three-Gears</td><td>Cave-Lantern</td><td>Two-Tales</td><td>Blue-Fingers</td></tr>
    <tr><td>Little Hammer</td><td>Mapfold</td><td>Quickbow</td><td>Almost</td></tr>
    <tr><td>Copperthumb</td><td>Raincap</td><td>Auntie</td><td>Bell-Ringer</td></tr>
    <tr><td>Quickfix</td><td>Northstar</td><td>Night-Song</td><td>Wrong-Door</td></tr>
    <tr><td>Last Screw</td><td>Shortcut</td><td>Goodlistener</td><td>Saved-Tuesday</td></tr>
  </tbody>
</table>

<h2>把一个名字变成能直接上桌的角色</h2>
<p>现在还不用写传记。给完整名字配一个矛盾和一个看得见的提示。这十二个组合可以直接用于玩家角色或 NPC。</p>

<table>
  <thead>
    <tr><th>完整名字</th><th>角色钩子</th><th>肖像提示</th></tr>
  </thead>
  <tbody>
    <tr><td>Arvyn Copperwhistle "Bentkey"</td><td>什么锁都能开，只有家族宝库那一把不行</td><td>黄铜钥匙、谨慎双手</td></tr>
    <tr><td>Fenna Gearbloom "Blue-Fingers"</td><td>偷走染料配方，只为不让军阀得到它</td><td>染蓝的手套</td></tr>
    <tr><td>Brix Fernburrow "Mossboots"</td><td>知道一条只在雨后出现的林间小路</td><td>苔藓长靴、折叠地图</td></tr>
    <tr><td>Jessamira Glasspin "Two-Tales"</td><td>每次远征都有两个版本，而且都不完全是假话</td><td>双色围巾</td></tr>
    <tr><td>Rook Underlamp "Cave-Lantern"</td><td>带着一条废弃深路留下的最后灯火</td><td>冷色提灯光</td></tr>
    <tr><td>Pella Moonteacup "Quickbow"</td><td>从公爵窗户逃走时还不忘正式道歉</td><td>小茶杯、礼服</td></tr>
    <tr><td>Hobbik Wrongmap "Shortcut"</td><td>坚信家族失败地图里藏着一条真路</td><td>涂改过度的地图筒</td></tr>
    <tr><td>Lumen Quillcoil "Night-Song"</td><td>写出的信息只能在月光下阅读</td><td>银墨与羽毛笔</td></tr>
    <tr><td>Coralie Rainmantle "Saved-Tuesday"</td><td>在不对的日期救过一座村庄，而且拒绝解释</td><td>旧雨披</td></tr>
    <tr><td>Nib Quietshaft "Loudwhisper"</td><td>在一座沉默矿镇经营情报网</td><td>深色兜帽、亮色耳饰</td></tr>
    <tr><td>Tobble Threebells "Almost"</td><td>同一台不可能装置已经差点完成七次</td><td>三枚小铃</td></tr>
    <tr><td>Orlissa Brasspetal "Goodlistener"</td><td>替踏上险途的旅人保管临行愿望</td><td>压制黄铜花</td></tr>
  </tbody>
</table>

<h2>让角色决定最终声音</h2>
<p>工坊发明家不一定要用齿轮氏族名，森林侏儒不一定要用树叶名字，深地侏儒也不一定要冷峻。文化只提供材料；职业、家乡和关系才决定这个人最后保留什么。</p>

<p>2024 规则提供当前的侏儒物种框架，旧版物种条目则保留了详细的多名字传统。规则版本按你们桌的选择来，命名和机制分开处理。名字应该描述这个人，而不是把所有侏儒塞进同一种性格。</p>

<h2>用视频收紧角色概念</h2>
<p><a href="${DND_GNOME_NAMES_VIDEO_URL}" rel="noreferrer noopener">Gnome 5e - Races for Dungeons and Dragons</a> 讲的是侏儒角色选项，不是另一份名字堆。先留下几组候选，再看视频；当你能想象角色在队伍里的位置、习惯和职责时，仍然合适的名字才值得保留。</p>

${liteVideoEmbed(GNOME_VIDEO_ID, 'Gnome 5e - Races for Dungeons and Dragons', {
  src: DND_GNOME_NAMES_VIDEO_PLACEHOLDER_PATH,
  alt: 'Gnome 5e - Races for Dungeons and Dragons 视频缩略图',
})}

<h2>让整组侏儒名字听起来不混</h2>
<p>准备工坊、村庄或家族场景时，先按声音检查名字，再分配职业。不要让 Cobren、Coralie 和 Coggle 同时参加一段对话。换成一个硬开头、一个软开头和一个直接使用昵称的角色，例如 Cobren、Fenna 和 Quickfix。</p>

<ol>
  <li>把六个常驻名字写成一列。</li>
  <li>圈出重复的开头音和结尾音。</li>
  <li>把最弱的重复项换成氏族名或昵称。</li>
  <li>用正常说话速度读一遍最终名单。</li>
</ol>

<p>如果 NPC 今晚就需要数据，名字和职责定下后，可以用 <a href="${ZH_DICE_ROLLER_PATH}">DND 骰子工具</a>快速掷出需要的数值。名字应该帮助你记住这次骰点属于谁。</p>

<h2>让 VTT Token 对得上短称呼</h2>
<p>挑一个在地图尺寸仍看得清的物件或颜色，用它解释昵称。Blue-Fingers 需要的是蓝手套，不是挤满画面的炼金台；Cave-Lantern 需要脸旁的冷色灯光；Threebells 需要一组清楚的铃铛，而不是散满全身的细小首饰。</p>

<ul>
  <li>裁切要足够近，让脸和标志物在 Token 尺寸仍能读出来。</li>
  <li>工具、叶片或晶体放在脸后，不要挡住眼睛。</li>
  <li>用一个视觉提示表现昵称，再用一个提示表现角色职责。</li>
  <li>完整名字留在角色卡上，肖像只负责短身份。</li>
</ul>

<p>打开 <a href="${ZH_EDITOR_PATH}">Token Maker 编辑器</a>，围绕脸和标志物裁切，再把结果放到队伍 Token 旁比较。如果你想参考更厚重、偏工艺、誓言和岩石的氏族名，可以单独查看 <a href="${ZH_DND_DWARF_NAMES_PATH}">DND 矮人名字指南</a>。</p>

<h2>DND 侏儒名字 FAQ</h2>
<h3>哪些 DND 侏儒名字好用？</h3>
<p>好用的 DND 侏儒名字要读得顺，还要带一个记忆点。Fenna Gearbloom "Blue-Fingers"、Rook Underlamp "Cave-Lantern" 和 Hobbik Wrongmap "Shortcut" 都给了桌上短称呼和一个故事入口。</p>

<h3>为什么 DND 侏儒会有很多名字？</h3>
<p>2014 版侏儒说明写到，亲属和氏族长辈都可能为侏儒取名，其他人还会不断送上昵称。面对外人时，侏儒常把这组名字缩成个人名、氏族名和昵称。</p>

<h3>侏儒名字必须听起来搞笑吗？</h3>
<p>不必。轻快声音适合很多侏儒，但角色仍要能撑住严肃场景。把幽默放进昵称或家族旧事，比让每个音节都像笑话更耐用。</p>

<h3>什么样的侏儒氏族名比较好？</h3>
<p>好用的氏族名会指向手艺、家乡、名声或旧事故。Gearbloom、Fernburrow、Underlamp 和 Wrongmap 都能直接变成 DM 可调用的地点或家族期待。</p>

<h3>VTT 上的侏儒名字应该多长？</h3>
<p>跑团时使用一个短个人名或昵称。个人名、氏族名和昵称组成的完整形式留在角色卡或 handout 上，地图会更清楚。</p>

<h2>参考来源</h2>
<ul>
  <li><a href="${DND_GNOME_2014_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond：侏儒物种条目与命名传统</a></li>
  <li><a href="${DND_GNOME_2024_RULES_URL}" rel="noreferrer noopener">D&amp;D Beyond：2024 角色起源与侏儒物种规则</a></li>
  <li><a href="${DND_GNOME_NAMES_VIDEO_URL}" rel="noreferrer noopener">SkullSplitter Dice：Gnome 5e - Races for Dungeons and Dragons</a></li>
</ul>
`;
