import {
  DND_DWARF_2014_RULES_URL,
  DND_DWARF_2024_RULES_URL,
  DND_DWARF_FOLKLORE_URL,
  DND_DWARF_NAMES_TABLE_IMAGE_PATH,
  DND_DWARF_NAMES_VIDEO_PLACEHOLDER_PATH,
  DND_DWARF_NAMES_VIDEO_URL,
  EN_DICE_ROLLER_PATH,
  EN_EDITOR_PATH,
  EN_SQUARE_TOKEN_MAKER_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_EDITOR_PATH,
  ZH_SQUARE_TOKEN_MAKER_PATH,
  liteVideoEmbed,
} from './shared';

export const dndDwarfNamesArticleHtml = String.raw`
<p><strong>dnd dwarf names</strong> are easiest to use when they sound sturdy, short enough to say at the table, and tied to a clan, craft, oath, or visible flaw. Use the table as a fast pick list: choose a first name, add a clan name, then give the dwarf one detail players can remember.</p>

<table>
  <thead>
    <tr>
      <th>Adventurer</th>
      <th>Clan or noble</th>
      <th>NPC-ready</th>
      <th>Funny or odd</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Korgan Emberhand</td>
      <td>Brakka Stonevow</td>
      <td>Hilda Coppervein</td>
      <td>Bimble Brassmug</td>
    </tr>
    <tr>
      <td>Durik Ironthane</td>
      <td>Valda Graniteoath</td>
      <td>Garrik Deepdelver</td>
      <td>Durnik Wrong-Tunnel</td>
    </tr>
    <tr>
      <td>Sigrun Goldmender</td>
      <td>Tarmik Shieldbrand</td>
      <td>Kelda Runegrip</td>
      <td>Helga Keglogic</td>
    </tr>
    <tr>
      <td>Oskar Blackmantle</td>
      <td>Norvi Vaultscar</td>
      <td>Morn Frostpick</td>
      <td>Torra Thundertap</td>
    </tr>
    <tr>
      <td>Edrik Lodestone</td>
      <td>Brund Smokeanvil</td>
      <td>Arna Flintbraid</td>
      <td>Norvi No-Map</td>
    </tr>
  </tbody>
</table>

<p><strong>Use note:</strong> I wrote these as original, table-ready names. Use them as starting points: keep a first name, swap the clan word, or add a nickname when your campaign needs a different tone.</p>

<p>When I prep dwarf NPCs for a VTT session, I do not start with a long biography. I write three things: <strong>name, clan pressure, and what the token should communicate at 70px</strong>. After that, the portrait and the first line of dialogue usually fall into place.</p>

<p>Once a name feels right, match it with a readable portrait in the <a href="${EN_EDITOR_PATH}">VTT token maker</a>. Use the <a href="${EN_SQUARE_TOKEN_MAKER_PATH}">square token maker</a> for grid maps, and roll fast NPC stats in the <a href="${EN_DICE_ROLLER_PATH}">DnD dice roller</a> if this dwarf needs to enter play tonight.</p>

<h2 id="how-to-make-dnd-dwarf-names">How Do You Make dnd dwarf names Sound Right?</h2>
<p><strong>Make dnd dwarf names with hard consonants, compact syllables, and a surname that points to craft, stone, metal, clan duty, or a remembered deed.</strong> The name should be easy to say once and easy to recognize later.</p>

<table>
  <thead>
    <tr>
      <th>Part</th>
      <th>Good pattern</th>
      <th>Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>First name</strong></td>
      <td>One or two heavy syllables</td>
      <td>Keld, Brakka, Durik, Morra</td>
    </tr>
    <tr>
      <td><strong>Clan name</strong></td>
      <td>Material + action, place + duty, or tool + reputation</td>
      <td>Stonevow, Deepdelver, Goldmender</td>
    </tr>
    <tr>
      <td><strong>Nickname</strong></td>
      <td>Visible habit, scar, mistake, oath, or table joke</td>
      <td>Gravel-Voice, Last Lantern, Wrong-Tunnel</td>
    </tr>
    <tr>
      <td><strong>Token label</strong></td>
      <td>Use the first name or nickname, not the full legal name</td>
      <td>Korgan, Brakka, Last Lantern</td>
    </tr>
  </tbody>
</table>

<p>For classic 5e, names like Stonevow and Deepdelver fit clans built around craft, stone, and old grudges. For newer character origins, let the surname point to where the dwarf comes from instead of forcing every dwarf into the same forge stereotype: a sailor might be Stormdelver, an envoy Graniteoath, and an exile Blackmantle. The <a href="${DND_DWARF_2014_RULES_URL}" rel="noreferrer noopener">2014 dwarf entry</a>, <a href="${DND_DWARF_2024_RULES_URL}" rel="noreferrer noopener">2024 character origins</a>, and <a href="${DND_DWARF_FOLKLORE_URL}" rel="noreferrer noopener">dwarf folklore</a> help when you want the name to match your table's version of dwarves.</p>

<h2 id="male-dnd-dwarf-names">Male dnd dwarf names</h2>
<p><strong>Good male dnd dwarf names are usually short, weighty, and easy to shout in initiative.</strong> I avoid names with too many soft endings unless the character is meant to feel scholarly, courtly, or intentionally unusual.</p>

<table>
  <thead>
    <tr>
      <th>Classic</th>
      <th>Hard-edged</th>
      <th>Noble</th>
      <th>Odd but playable</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Adrek</td>
      <td>Brund</td>
      <td>Durik</td>
      <td>Kolben</td>
    </tr>
    <tr>
      <td>Balvor</td>
      <td>Dravik</td>
      <td>Edrik</td>
      <td>Kazrik</td>
    </tr>
    <tr>
      <td>Bramdek</td>
      <td>Garrin</td>
      <td>Faldur</td>
      <td>Lodran</td>
    </tr>
    <tr>
      <td>Dorran</td>
      <td>Karg</td>
      <td>Hrold</td>
      <td>Morn</td>
    </tr>
    <tr>
      <td>Keld</td>
      <td>Norrik</td>
      <td>Orvik</td>
      <td>Skaldin</td>
    </tr>
    <tr>
      <td>Ragn</td>
      <td>Tarmik</td>
      <td>Thorek</td>
      <td>Vondrik</td>
    </tr>
  </tbody>
</table>

<h2 id="female-dnd-dwarf-names">Female dnd dwarf names</h2>
<p><strong>Good female dnd dwarf names can be blunt, elegant, or severe, but they should still be table-readable.</strong> I use the same sound rules: compact syllables first, clan identity second.</p>

<table>
  <thead>
    <tr>
      <th>Classic</th>
      <th>Forge-born</th>
      <th>Regal</th>
      <th>Quiet and sharp</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Arna</td>
      <td>Brakka</td>
      <td>Dagna</td>
      <td>Drisa</td>
    </tr>
    <tr>
      <td>Brynja</td>
      <td>Elda</td>
      <td>Fraya</td>
      <td>Gilda</td>
    </tr>
    <tr>
      <td>Hilda</td>
      <td>Ingra</td>
      <td>Kelda</td>
      <td>Karra</td>
    </tr>
    <tr>
      <td>Lysa</td>
      <td>Morra</td>
      <td>Norvi</td>
      <td>Orla</td>
    </tr>
    <tr>
      <td>Ragna</td>
      <td>Sifna</td>
      <td>Thora</td>
      <td>Torra</td>
    </tr>
    <tr>
      <td>Ulrika</td>
      <td>Valda</td>
      <td>Yngra</td>
      <td>Merla</td>
    </tr>
  </tbody>
</table>

<figure class="inline-figure inline-figure--four-three-crop">
  <img
    class="inline-figure__image inline-figure__image--four-three"
    src="${DND_DWARF_NAMES_TABLE_IMAGE_PATH}"
    alt="dnd dwarf names table with dwarf portrait tokens, clan tablets, dice, and a forge-lit tabletop naming board"
    width="1200"
    height="900"
    loading="lazy"
    decoding="async"
  />
  <figcaption>For VTT prep, I choose names and portraits together. If the token reads as stern, festive, royal, or grim, the name should support that read.</figcaption>
</figure>

<h2 id="dnd-dwarf-clan-names">DND dwarf clan names and surnames</h2>
<p><strong>A dwarf clan name should tell the table what the family is known for.</strong> If it does not imply a craft, material, place, oath, feud, or achievement, it is probably too generic.</p>

<table>
  <thead>
    <tr>
      <th>Stone and mine</th>
      <th>Forge and craft</th>
      <th>Honor and defense</th>
      <th>Stranger clans</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Anvilroot</td>
      <td>Brassward</td>
      <td>Graniteoath</td>
      <td>Blackmantle</td>
    </tr>
    <tr>
      <td>Ashdelver</td>
      <td>Coppervein</td>
      <td>Hearthguard</td>
      <td>Coalshield</td>
    </tr>
    <tr>
      <td>Deepdelver</td>
      <td>Emberhand</td>
      <td>Ironthane</td>
      <td>Kegbreaker</td>
    </tr>
    <tr>
      <td>Flintbraid</td>
      <td>Forgewarden</td>
      <td>Oathcarver</td>
      <td>Lodestone</td>
    </tr>
    <tr>
      <td>Frostpick</td>
      <td>Goldmender</td>
      <td>Shieldbrand</td>
      <td>Mineborn</td>
    </tr>
    <tr>
      <td>Silvervein</td>
      <td>Redhammer</td>
      <td>Stonevow</td>
      <td>Smokeanvil</td>
    </tr>
    <tr>
      <td>Stormdelver</td>
      <td>Runegrip</td>
      <td>Trueforge</td>
      <td>Thundertap</td>
    </tr>
    <tr>
      <td>Underhall</td>
      <td>Warbraid</td>
      <td>Wyrmspike</td>
      <td>Vaultscar</td>
    </tr>
  </tbody>
</table>

<h2 id="funny-dnd-dwarf-names">What Are Good Funny dnd dwarf names?</h2>
<p><strong>Good funny dnd dwarf names sound like real people first and jokes second.</strong> If the joke is the whole name, players laugh once and forget the NPC.</p>

<table>
  <thead>
    <tr>
      <th>Funny name</th>
      <th>Use it for</th>
      <th>Keep it from becoming too goofy</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Bimble Brassmug</td>
      <td>Helpful tavern regular</td>
      <td>Give them one serious rumor.</td>
    </tr>
    <tr>
      <td>Durnik Wrong-Tunnel</td>
      <td>Lost guide or unlucky scout</td>
      <td>Make the mistake famous, not constant.</td>
    </tr>
    <tr>
      <td>Helga Keglogic</td>
      <td>Brewer, merchant, or brawler</td>
      <td>Let the name hide a sharp negotiator.</td>
    </tr>
    <tr>
      <td>Norvi No-Map</td>
      <td>Improviser, smuggler, or bad cartographer</td>
      <td>Give them one route nobody else knows.</td>
    </tr>
    <tr>
      <td>Torra Cask-Splitter</td>
      <td>Champion drinker or dockside enforcer</td>
      <td>Make the title sound earned.</td>
    </tr>
  </tbody>
</table>

<p>The same rule applies to names: a memorable persona beats a technically perfect fantasy syllable. A dwarf name lands harder when the portrait, posture, nickname, and first line all point in the same direction.</p>

<h2 id="vtt-token-labels">How Should dnd dwarf names Appear on VTT Tokens?</h2>
<p><strong>Use the short form on the token and keep the full dnd dwarf name in the character sheet or GM notes.</strong> Long clan names look good in lore but become unreadable on small map tokens.</p>

<ul>
  <li><strong>Best token label:</strong> Korgan, Brakka, Durik, Last Lantern.</li>
  <li><strong>Best sheet name:</strong> Korgan Emberhand, Brakka Stonevow, Durik Ironthane.</li>
  <li><strong>Best NPC note:</strong> "Clan owes money to a duergar broker" or "exiled for breaking a mine oath."</li>
  <li><strong>Best portrait cue:</strong> beard shape, helm, hammer, gem, scar, mug, or clan color.</li>
</ul>

<p>In my VTT tests, labels longer than about 12-14 characters start to fight the map, especially on mobile or zoomed-out battle grids. The fix is simple: let the token carry the first name and let the handout carry the full title.</p>

<h2 id="faq">dnd dwarf names FAQ</h2>
<h3>What are good dnd dwarf names?</h3>
<p><strong>Good dnd dwarf names are short, sturdy, and tied to clan identity.</strong> Korgan Emberhand, Brakka Stonevow, Durik Ironthane, Hilda Coppervein, and Sigrun Goldmender all work because the surname gives the table a quick story hook.</p>

<h3>How do I make a dwarf clan name?</h3>
<p><strong>Make a dwarf clan name by combining material, craft, place, or oath language.</strong> Stonevow, Forgewarden, Goldmender, Deepdelver, and Shieldbrand all tell players what the family values.</p>

<h3>Should dwarf names be Norse?</h3>
<p><strong>Dwarf names do not have to be Norse, but Norse-inspired sounds can help if your setting supports that tone.</strong> Use the sound as seasoning, not a rule that makes every dwarf feel identical.</p>

<h3>Can I use funny dwarf names in a serious campaign?</h3>
<p><strong>Yes, but make the joke sit on top of a believable person.</strong> A funny dwarf named Durnik Wrong-Tunnel still needs a skill, fear, debt, or secret if players are expected to remember him.</p>

<h3>What is the best length for a dwarf token label?</h3>
<p><strong>The best dwarf token label is usually one short name under 12-14 characters.</strong> Put the full clan name and title in the sheet, journal, or GM notes.</p>

<h2 id="video">Watch the dnd dwarf names Video</h2>
<p>A dwarf called Brakka Stonevow should have a readable silhouette, a clear nickname, and one attitude the table can understand before anyone reads the backstory. The video angle works best as a quick persona check for that table-read clarity.</p>

${liteVideoEmbed('C3I4wpHshuw', 'dnd dwarf names companion video', {
  src: DND_DWARF_NAMES_VIDEO_PLACEHOLDER_PATH,
  alt: 'Clickable webp video cover for a dnd dwarf names guide showing a dwarf portrait token with a play button in a forge-lit stone hall',
})}

<p><a href="${DND_DWARF_NAMES_VIDEO_URL}" rel="noreferrer noopener">Open the dwarf-naming video on YouTube</a>.</p>
`;

export const dndDwarfNamesArticleHtmlZh = String.raw`
<p>需要 <strong>dnd dwarf names</strong> 给今晚的 NPC、玩家角色或酒馆名单用？从速查表里挑一个名、一个氏族姓，再补一个职业、誓言、伤疤或欠债，然后按自己的战役调整。</p>

<table>
  <thead>
    <tr>
      <th>冒险者</th>
      <th>氏族或贵族</th>
      <th>NPC 可直接用</th>
      <th>好笑或怪一点</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Korgan Emberhand</td>
      <td>Brakka Stonevow</td>
      <td>Hilda Coppervein</td>
      <td>Bimble Brassmug</td>
    </tr>
    <tr>
      <td>Durik Ironthane</td>
      <td>Valda Graniteoath</td>
      <td>Garrik Deepdelver</td>
      <td>Durnik Wrong-Tunnel</td>
    </tr>
    <tr>
      <td>Sigrun Goldmender</td>
      <td>Tarmik Shieldbrand</td>
      <td>Kelda Runegrip</td>
      <td>Helga Keglogic</td>
    </tr>
    <tr>
      <td>Oskar Blackmantle</td>
      <td>Norvi Vaultscar</td>
      <td>Morn Frostpick</td>
      <td>Torra Thundertap</td>
    </tr>
    <tr>
      <td>Edrik Lodestone</td>
      <td>Brund Smokeanvil</td>
      <td>Arna Flintbraid</td>
      <td>Norvi No-Map</td>
    </tr>
  </tbody>
</table>

<p><strong>使用说明：</strong>这批名字按桌面可读性整理，都是原创组合。可以直接拿来用，也可以只保留名，把氏族词、绰号或职业线索换成你战役里的版本。</p>

<p>我准备矮人 NPC 时不会先写长背景。先写三件事：<strong>名字、氏族压力、Token 在 70px 左右能不能看懂</strong>。这三点定下来，头像、台词和任务钩子会顺很多。</p>

<p>名字选好以后，可以用 <a href="${ZH_EDITOR_PATH}">VTT Token 制作工具</a>配一张清晰头像；如果是方格地图，用 <a href="${ZH_SQUARE_TOKEN_MAKER_PATH}">square token maker</a>导出 1:1 Token；临时上桌的 NPC 可以用 <a href="${ZH_DICE_ROLLER_PATH}">DnD dice roller</a>快速丢属性。</p>

<h2 id="how-to-make-dnd-dwarf-names">dnd dwarf names 怎样才像矮人？</h2>
<p><strong>dnd dwarf names 要靠硬辅音、短音节，以及能指向工艺、石头、金属、氏族责任或旧功绩的姓氏。</strong> 好名字不一定复杂，但必须上桌好念、下次还认得出来。</p>

<table>
  <thead>
    <tr>
      <th>部分</th>
      <th>好用模式</th>
      <th>例子</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>名</strong></td>
      <td>一到两个有重量的音节</td>
      <td>Keld、Brakka、Durik、Morra</td>
    </tr>
    <tr>
      <td><strong>氏族姓</strong></td>
      <td>材料 + 动作、地点 + 责任、工具 + 名声</td>
      <td>Stonevow、Deepdelver、Goldmender</td>
    </tr>
    <tr>
      <td><strong>绰号</strong></td>
      <td>习惯、伤疤、失误、誓言或桌边笑点</td>
      <td>Gravel-Voice、Last Lantern、Wrong-Tunnel</td>
    </tr>
    <tr>
      <td><strong>Token 标签</strong></td>
      <td>写短名或绰号，不写完整法律姓名</td>
      <td>Korgan、Brakka、Last Lantern</td>
    </tr>
  </tbody>
</table>

<p>偏经典 5e 的桌子，可以多用 Stonevow、Deepdelver 这种氏族、工艺、矿石和旧仇味道重的名字。使用新角色规则时，让姓氏指向角色出身，不要把每个矮人都塞进同一个锻炉模板：水手可以叫 Stormdelver，使者可以叫 Graniteoath，被放逐者可以叫 Blackmantle。需要对齐桌上版本时，再参考 <a href="${DND_DWARF_2014_RULES_URL}" rel="noreferrer noopener">2014 dwarf 条目</a>、<a href="${DND_DWARF_2024_RULES_URL}" rel="noreferrer noopener">2024 character origins</a> 或 <a href="${DND_DWARF_FOLKLORE_URL}" rel="noreferrer noopener">dwarf folklore</a>。</p>

<h2 id="male-dnd-dwarf-names">男性 dnd dwarf names</h2>
<p><strong>男性 dnd dwarf names 通常短、重、适合在先攻里喊出来。</strong> 如果名字太软或太长，除非角色本来就是学者、外交官或反差设定，否则会不够矮人。</p>

<table>
  <thead>
    <tr>
      <th>经典感</th>
      <th>硬朗感</th>
      <th>贵族感</th>
      <th>少见但可用</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Adrek</td>
      <td>Brund</td>
      <td>Durik</td>
      <td>Kolben</td>
    </tr>
    <tr>
      <td>Balvor</td>
      <td>Dravik</td>
      <td>Edrik</td>
      <td>Kazrik</td>
    </tr>
    <tr>
      <td>Bramdek</td>
      <td>Garrin</td>
      <td>Faldur</td>
      <td>Lodran</td>
    </tr>
    <tr>
      <td>Dorran</td>
      <td>Karg</td>
      <td>Hrold</td>
      <td>Morn</td>
    </tr>
    <tr>
      <td>Keld</td>
      <td>Norrik</td>
      <td>Orvik</td>
      <td>Skaldin</td>
    </tr>
    <tr>
      <td>Ragn</td>
      <td>Tarmik</td>
      <td>Thorek</td>
      <td>Vondrik</td>
    </tr>
  </tbody>
</table>

<h2 id="female-dnd-dwarf-names">女性 dnd dwarf names</h2>
<p><strong>女性 dnd dwarf names 可以厚重、优雅或冷硬，但依然要好念。</strong> 我会先保证短名有辨识度，再用氏族姓补身份。</p>

<table>
  <thead>
    <tr>
      <th>经典感</th>
      <th>锻炉感</th>
      <th>王族感</th>
      <th>安静但锋利</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Arna</td>
      <td>Brakka</td>
      <td>Dagna</td>
      <td>Drisa</td>
    </tr>
    <tr>
      <td>Brynja</td>
      <td>Elda</td>
      <td>Fraya</td>
      <td>Gilda</td>
    </tr>
    <tr>
      <td>Hilda</td>
      <td>Ingra</td>
      <td>Kelda</td>
      <td>Karra</td>
    </tr>
    <tr>
      <td>Lysa</td>
      <td>Morra</td>
      <td>Norvi</td>
      <td>Orla</td>
    </tr>
    <tr>
      <td>Ragna</td>
      <td>Sifna</td>
      <td>Thora</td>
      <td>Torra</td>
    </tr>
    <tr>
      <td>Ulrika</td>
      <td>Valda</td>
      <td>Yngra</td>
      <td>Merla</td>
    </tr>
  </tbody>
</table>

<figure class="inline-figure inline-figure--four-three-crop">
  <img
    class="inline-figure__image inline-figure__image--four-three"
    src="${DND_DWARF_NAMES_TABLE_IMAGE_PATH}"
    alt="dnd dwarf names 表格配图，画面包含矮人头像 Token、氏族石板、骰子和锻炉光线下的取名桌面"
    width="1200"
    height="900"
    loading="lazy"
    decoding="async"
  />
  <figcaption>VTT 准备里，名字和头像最好一起定。Token 看起来严肃、喜庆、王族或阴沉，名字也要跟着支持这个第一印象。</figcaption>
</figure>

<h2 id="dnd-dwarf-clan-names">DND dwarf clan names 和氏族姓氏</h2>
<p><strong>矮人氏族姓最好一眼说明这个家族靠什么出名。</strong> 它可以指向工艺、材料、地点、誓言、仇怨或旧功绩；如果什么都不指向，就会显得太空。</p>

<table>
  <thead>
    <tr>
      <th>石头与矿脉</th>
      <th>锻造与工艺</th>
      <th>荣誉与守卫</th>
      <th>更怪一点的氏族</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Anvilroot</td>
      <td>Brassward</td>
      <td>Graniteoath</td>
      <td>Blackmantle</td>
    </tr>
    <tr>
      <td>Ashdelver</td>
      <td>Coppervein</td>
      <td>Hearthguard</td>
      <td>Coalshield</td>
    </tr>
    <tr>
      <td>Deepdelver</td>
      <td>Emberhand</td>
      <td>Ironthane</td>
      <td>Kegbreaker</td>
    </tr>
    <tr>
      <td>Flintbraid</td>
      <td>Forgewarden</td>
      <td>Oathcarver</td>
      <td>Lodestone</td>
    </tr>
    <tr>
      <td>Frostpick</td>
      <td>Goldmender</td>
      <td>Shieldbrand</td>
      <td>Mineborn</td>
    </tr>
    <tr>
      <td>Silvervein</td>
      <td>Redhammer</td>
      <td>Stonevow</td>
      <td>Smokeanvil</td>
    </tr>
    <tr>
      <td>Stormdelver</td>
      <td>Runegrip</td>
      <td>Trueforge</td>
      <td>Thundertap</td>
    </tr>
    <tr>
      <td>Underhall</td>
      <td>Warbraid</td>
      <td>Wyrmspike</td>
      <td>Vaultscar</td>
    </tr>
  </tbody>
</table>

<h2 id="funny-dnd-dwarf-names">好笑的 dnd dwarf names 怎么写？</h2>
<p><strong>好笑的 dnd dwarf names 应该先像一个真实角色，其次才是笑点。</strong> 如果整个名字只有梗，玩家笑一次就忘。</p>

<table>
  <thead>
    <tr>
      <th>好笑名字</th>
      <th>适合用途</th>
      <th>避免太闹的方法</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Bimble Brassmug</td>
      <td>热心酒馆熟人</td>
      <td>给他一条有用的线索。</td>
    </tr>
    <tr>
      <td>Durnik Wrong-Tunnel</td>
      <td>倒霉向导或迷路斥候</td>
      <td>让那次失误出名，而不是每分钟都犯错。</td>
    </tr>
    <tr>
      <td>Helga Keglogic</td>
      <td>酿酒师、商人或酒馆打手</td>
      <td>让名字背后藏着一个精明谈判者。</td>
    </tr>
    <tr>
      <td>Norvi No-Map</td>
      <td>即兴专家、走私者或烂地图师</td>
      <td>给他一条别人不知道的路线。</td>
    </tr>
    <tr>
      <td>Torra Cask-Splitter</td>
      <td>拼酒冠军或码头执法者</td>
      <td>让称号听起来真是赢来的。</td>
    </tr>
  </tbody>
</table>

<p>同样的规则也适用于名字：玩家更容易记住清楚的人设；完美音节反而没那么重要。一个矮人 NPC 的头像、姿态、绰号和第一句台词如果方向一致，名字会更容易被玩家记住。</p>

<h2 id="vtt-token-labels">dnd dwarf names 放在 VTT Token 上该怎么写？</h2>
<p><strong>Token 上写短名，完整 dnd dwarf name 放进角色卡、手册或 GM 笔记。</strong> 氏族全名放在设定里很好看，但缩到地图 Token 上经常看不清。</p>

<ul>
  <li><strong>Token 标签：</strong>Korgan、Brakka、Durik、Last Lantern。</li>
  <li><strong>角色卡全名：</strong>Korgan Emberhand、Brakka Stonevow、Durik Ironthane。</li>
  <li><strong>NPC 笔记：</strong>“氏族欠 duergar 掮客一笔钱”或“因破坏矿井誓言被放逐”。</li>
  <li><strong>头像提示：</strong>胡须形状、头盔、锤子、宝石、伤疤、酒杯或氏族色。</li>
</ul>

<p>我实测 VTT Token 时，超过 12-14 个字符的标签在小地图和移动端很容易糊成一团。解决办法很简单：Token 承担短名，角色手册承担全称和头衔。</p>

<h2 id="faq">dnd dwarf names FAQ</h2>
<h3>有哪些好用的 dnd dwarf names？</h3>
<p><strong>好用的 dnd dwarf names 通常短、厚重，并且带有氏族身份。</strong> Korgan Emberhand、Brakka Stonevow、Durik Ironthane、Hilda Coppervein 和 Sigrun Goldmender 都能马上给玩家一个画面。</p>

<h3>矮人氏族姓怎么起？</h3>
<p><strong>矮人氏族姓可以用材料、工艺、地点或誓言组合。</strong> Stonevow、Forgewarden、Goldmender、Deepdelver 和 Shieldbrand 都能说明家族看重什么。</p>

<h3>dnd dwarf names 一定要像北欧名字吗？</h3>
<p><strong>不一定，但北欧感的音节可以帮助营造矮人语感。</strong> 把它当调味，不要让所有矮人都变成同一种声音。</p>

<h3>严肃战役可以用搞笑矮人名字吗？</h3>
<p><strong>可以，但笑点背后要有一个可信的人。</strong> Durnik Wrong-Tunnel 这种名字也需要技能、恐惧、债务或秘密，否则只会变成一次性笑话。</p>

<h3>矮人 Token 标签多长合适？</h3>
<p><strong>矮人 Token 标签最好是 12-14 个字符以内的短名。</strong> 完整氏族姓和头衔放在角色卡、日志或 GM 笔记里更合适。</p>

<h2 id="video">观看 dnd dwarf names 视频</h2>
<p>底部视频可以当作人设提醒：先让角色有清楚轮廓，再决定名字怎么落地。Brakka Stonevow 这种名字如果配上明确头像、绰号和态度，玩家更容易记住。</p>

${liteVideoEmbed('C3I4wpHshuw', 'dnd dwarf names companion video', {
  src: DND_DWARF_NAMES_VIDEO_PLACEHOLDER_PATH,
  alt: 'dnd dwarf names 指南的视频封面占位图，锻炉光线下的矮人头像 Token 中间有播放按钮',
})}

<p><a href="${DND_DWARF_NAMES_VIDEO_URL}" rel="noreferrer noopener">在 YouTube 打开这个视频</a>。</p>
`;
