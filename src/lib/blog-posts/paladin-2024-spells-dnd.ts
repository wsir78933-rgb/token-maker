import {
  DND_2024_CASTING_SPELLS_RULES_URL,
  EN_DICE_ROLLER_PATH,
  EN_DND_BARD_SPELLS_PATH,
  EN_DND_CLASSES_PATH,
  EN_DND_CONSTITUTION_PATH,
  EN_DND_RANGER_SPELLS_PATH,
  EN_EDITOR_PATH,
  PALADIN_2024_CLASS_RULES_URL,
  PALADIN_2024_SPELL_DESCRIPTIONS_URL,
  PALADIN_2024_SPELLS_DND_PREP_IMAGE_PATH,
  PALADIN_2024_SPELLS_DND_VIDEO_PLACEHOLDER_PATH,
  PALADIN_2024_SPELLS_DND_VIDEO_URL,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_BARD_SPELLS_PATH,
  ZH_DND_CLASSES_PATH,
  ZH_DND_CONSTITUTION_PATH,
  ZH_DND_RANGER_SPELLS_PATH,
  ZH_EDITOR_PATH,
  liteVideoEmbed,
} from './shared';

export const paladin2024SpellsDndArticleHtml = String.raw`
<p><strong>paladin 2024 spells dnd</strong> choices are deceptively practical. The spell list looks short next to Wizard or Cleric, but Paladin turns get crowded quickly: one Bonus Action, one concentration slot, a limited prepared list, and the constant temptation to spend every slot on damage.</p>

<p>I would build the list by job, not by drama. Prepare one opener, one rescue spell, one defense spell, one smite plan, and one non-combat answer. That gives the character a real plan before the first initiative roll.</p>

<table>
  <thead>
    <tr>
      <th>Need</th>
      <th>Strong 2024 Paladin spell picks</th>
      <th>Why I would prepare it</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Reliable opener</strong></td>
      <td>Bless, Divine Favor, Shield of Faith</td>
      <td>Choose accuracy, repeated damage, or AC before the fight gets messy.</td>
    </tr>
    <tr>
      <td><strong>Smite burst</strong></td>
      <td>Divine Smite, Searing Smite, Shining Smite, Blinding Smite</td>
      <td>Use these when the hit matters now or the rider changes the next round.</td>
    </tr>
    <tr>
      <td><strong>Rescue</strong></td>
      <td>Cure Wounds, Aid, Lesser Restoration, Aura of Vitality, Revivify</td>
      <td>These keep a bad round from becoming a lost character.</td>
    </tr>
    <tr>
      <td><strong>Movement and table presence</strong></td>
      <td>Find Steed, Locate Object, Locate Creature</td>
      <td>They solve travel, chase, and search problems that weapon attacks ignore.</td>
    </tr>
    <tr>
      <td><strong>Magic defense</strong></td>
      <td>Protection from Evil and Good, Dispel Magic, Remove Curse, Circle of Power</td>
      <td>Prepare these when the campaign uses casters, curses, undead, fiends, or nasty saves.</td>
    </tr>
  </tbody>
</table>

<h2>How 2024 Paladin spellcasting works</h2>
<p>Under the 2024 rules, Paladins get Spellcasting at level 1. The <a href="${PALADIN_2024_CLASS_RULES_URL}" rel="noreferrer noopener">official 2024 Paladin rules</a> list Paladin spells in the class entry, and you prepare spells from that list. Charisma is your spellcasting ability, and you can use a Holy Symbol as your spellcasting focus.</p>

<p>At level 1, you start by preparing two level 1 Paladin spells. The class text recommends Heroism and Searing Smite. That is a fine tutorial pair, but I would still ask what the table needs. Bless plus Cure Wounds is calmer. Divine Favor plus Searing Smite is more aggressive. Heroism is useful when fear and survivability matter more than raw damage.</p>

<p>Your prepared spell count grows with your Paladin level. When the number increases, add spells of levels you can cast. After a Long Rest, you can replace one prepared Paladin spell with another Paladin spell you can cast. That is flexible enough for campaign play, but not so flexible that you can rebuild the whole list every morning.</p>

<p>At level 2, Paladin's Smite means you always have Divine Smite prepared. You also get one no-slot casting of Divine Smite per Long Rest. So do not spend a normal prepared slot on Divine Smite unless your table is using a house-rule version of the class.</p>

<figure class="inline-figure inline-figure--four-three-crop">
  <img
    class="inline-figure__image inline-figure__image--four-three"
    src="${PALADIN_2024_SPELLS_DND_PREP_IMAGE_PATH}"
    alt="paladin 2024 spells dnd preparation table with Bless marker, Divine Smite dice, Find Steed token, concentration marker, and spell cards"
    width="1200"
    height="1200"
    loading="lazy"
    decoding="async"
  />
  <figcaption>A Paladin spell list is easier to run when the VTT has visible markers for Bless, Shield of Faith, Shining Smite, concentration, and Find Steed.</figcaption>
</figure>

<h2>Divine Smite and the 2024 smite problem</h2>
<p>Divine Smite is a spell in 2024, not a separate always-on damage valve. The <a href="${PALADIN_2024_SPELL_DESCRIPTIONS_URL}" rel="noreferrer noopener">2024 spell descriptions</a> list it as a level 1 Paladin spell with a Bonus Action casting time taken immediately after you hit with a melee weapon or unarmed strike.</p>

<p>The 2024 casting rules also limit your turn to one spell slot spent to cast a spell. For Paladins, the practical warning is simple: check the turn before trying to combine a spell-slot Magic action, a spell-slot smite, and another spell trick. A no-slot Divine Smite from Paladin's Smite is easier to fit, but a smite paid with a slot still has to respect the turn's slot economy.</p>

<p>I use three questions at the table:</p>

<ul>
  <li><strong>Will the fight last?</strong> Divine Favor or Bless can beat one flashy smite.</li>
  <li><strong>Must this enemy drop now?</strong> Divine Smite earns the slot.</li>
  <li><strong>Does the rider matter?</strong> Shining Smite, Blinding Smite, Staggering Smite, or Banishing Smite can be worth more than plain damage.</li>
</ul>

<p>If your group is moving from 2014 rules, read the <a href="${DND_2024_CASTING_SPELLS_RULES_URL}" rel="noreferrer noopener">2024 spellcasting turn rule</a> before the first session. It prevents a lot of arguments about Bonus Action smites, Magic actions, and reactions.</p>

<h2>Best 1st-level Paladin spells</h2>
<p>The best 1st-level Paladin spells are Bless, Divine Favor, Divine Smite, Shield of Faith, Cure Wounds, Heroism, Protection from Evil and Good, and Searing Smite. You cannot prepare all of them early, so pick by job.</p>

<table>
  <thead>
    <tr>
      <th>Spell</th>
      <th>Best use</th>
      <th>Watch the tradeoff</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Bless</strong></td>
      <td>Party accuracy and saving throws</td>
      <td>Concentration. Best when allies make repeated attacks or dangerous saves.</td>
    </tr>
    <tr>
      <td><strong>Divine Favor</strong></td>
      <td>Repeated weapon hits</td>
      <td>Bonus Action setup. Better across several attacks than on a single swing.</td>
    </tr>
    <tr>
      <td><strong>Divine Smite</strong></td>
      <td>Burst after a hit</td>
      <td>Great damage, but your class already prepares it at level 2.</td>
    </tr>
    <tr>
      <td><strong>Shield of Faith</strong></td>
      <td>Keeping one target alive</td>
      <td>Concentration. Excellent when one ally is taking pressure.</td>
    </tr>
    <tr>
      <td><strong>Cure Wounds</strong></td>
      <td>Touch healing</td>
      <td>Uses your action and requires you to stand next to the target.</td>
    </tr>
    <tr>
      <td><strong>Heroism</strong></td>
      <td>Fear protection and temporary hit points</td>
      <td>Concentration. Stronger when fear is part of the encounter.</td>
    </tr>
  </tbody>
</table>

<p>If you are unsure, open with Bless plus one spell that matches your table. For more detail on that spell alone, pair this with the <a href="/blog/dnd-bless">DND Bless guide</a>.</p>

<h2>Best 2nd-level Paladin spells</h2>
<p>2nd-level spells are where the Paladin stops feeling like a weapon user with radiant damage and starts feeling like a campaign piece. Find Steed and Shining Smite are 2nd-level Paladin spells in the 2024 list. Aid and Lesser Restoration are less flashy, but I miss them quickly when nobody has them.</p>

<table>
  <thead>
    <tr>
      <th>Spell</th>
      <th>Job</th>
      <th>Why it matters</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Find Steed</strong></td>
      <td>Mount, movement, campaign identity</td>
      <td>Give the mount its own token. If it matters on the map, it should be readable.</td>
    </tr>
    <tr>
      <td><strong>Aid</strong></td>
      <td>Group durability</td>
      <td>No concentration and useful before danger starts.</td>
    </tr>
    <tr>
      <td><strong>Lesser Restoration</strong></td>
      <td>Condition repair</td>
      <td>Answers blinded, deafened, paralyzed, and poisoned problems.</td>
    </tr>
    <tr>
      <td><strong>Magic Weapon</strong></td>
      <td>Nonmagical weapon fix</td>
      <td>Campaign-dependent. Useful when resistances show up early.</td>
    </tr>
    <tr>
      <td><strong>Shining Smite</strong></td>
      <td>Damage, reveal, attack Advantage</td>
      <td>Great when the party can pile attacks onto one lit-up target.</td>
    </tr>
    <tr>
      <td><strong>Zone of Truth</strong></td>
      <td>Social pressure</td>
      <td>Better in investigations than in a dungeon hallway.</td>
    </tr>
  </tbody>
</table>

<h2>Best 3rd- to 5th-level Paladin spells</h2>
<p>Higher Paladin slots are expensive. Spend them on spells that change the fight, save a character, or solve a problem that weapon attacks cannot touch. Aura of Vitality and Blinding Smite are 3rd-level Paladin spells. Banishing Smite, Circle of Power, and Summon Celestial appear on the 5th-level Paladin list.</p>

<table>
  <thead>
    <tr>
      <th>Spell level</th>
      <th>Strong picks</th>
      <th>Practical use</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>3rd</strong></td>
      <td>Aura of Vitality, Blinding Smite, Dispel Magic, Remove Curse, Revivify</td>
      <td>Healing over rounds, blind pressure, magic answers, curse removal, emergency revival.</td>
    </tr>
    <tr>
      <td><strong>4th</strong></td>
      <td>Aura of Life, Aura of Purity, Banishment, Death Ward, Staggering Smite</td>
      <td>Survival, condition protection, removal, anti-death insurance, control rider.</td>
    </tr>
    <tr>
      <td><strong>5th</strong></td>
      <td>Banishing Smite, Circle of Power, Destructive Wave, Greater Restoration, Raise Dead, Summon Celestial</td>
      <td>Big smite rider, save protection, area damage, major repair, resurrection, extra board pressure.</td>
    </tr>
  </tbody>
</table>

<p>Aura of Vitality is the healing spell I notice most in long adventuring days. Circle of Power is the one I notice when a boss fight turns into saving throws every round. If your DM loves enemy casters, Circle of Power is not a luxury pick.</p>

<h2>Sample prepared Paladin lists</h2>
<p>These lists are starting points, not laws. Swap one spell after a Long Rest when the next session clearly needs something else.</p>

<h3>Level 1 Paladin</h3>
<ul>
  <li>Bless</li>
  <li>Cure Wounds or Searing Smite</li>
</ul>

<h3>Level 5 Paladin</h3>
<ul>
  <li>Bless</li>
  <li>Divine Favor</li>
  <li>Shield of Faith</li>
  <li>Aid</li>
  <li>Find Steed</li>
  <li>Lesser Restoration</li>
</ul>

<h3>Level 9 Paladin</h3>
<ul>
  <li>Bless</li>
  <li>Divine Favor</li>
  <li>Shield of Faith</li>
  <li>Find Steed</li>
  <li>Lesser Restoration</li>
  <li>Shining Smite</li>
  <li>Aura of Vitality</li>
  <li>Dispel Magic</li>
  <li>Revivify</li>
</ul>

<p>For another prepared half-caster workflow, the <a href="${EN_DND_RANGER_SPELLS_PATH}">DND Ranger spells guide</a> is useful. For support/control comparisons, read the <a href="${EN_DND_BARD_SPELLS_PATH}">DND Bard spells guide</a>. If your Paladin keeps losing concentration, the <a href="${EN_DND_CONSTITUTION_PATH}">Constitution guide</a> is the next stop.</p>

<h2>VTT prep for Paladin spells</h2>
<p>Paladin spells are easier online when the table can see what is active. Before the session, make a small marker kit: a normal Paladin token, a steed token, a Bless marker, a Shield of Faith marker, a bright Shining Smite target marker, and a concentration marker.</p>

<p>You can <a href="${EN_EDITOR_PATH}">make the Paladin and steed tokens in Token Maker</a>, then keep the <a href="${EN_DICE_ROLLER_PATH}">DnD dice roller</a> open for Divine Smite damage, Bless d4s, healing, and concentration checks. This is not decoration. It reduces missed bonuses and slow turns.</p>

<p>If you are still deciding whether Paladin fits the campaign, the <a href="${EN_DND_CLASSES_PATH}">DND classes guide</a> is a clean class-selection companion.</p>

<h2>Paladin 2024 Spells DnD FAQ</h2>
<h3>What are the best Paladin 2024 spells in DnD?</h3>
<p>The best all-purpose Paladin 2024 spells are Bless, Divine Favor, Divine Smite, Shield of Faith, Find Steed, Aid, Lesser Restoration, Shining Smite, Aura of Vitality, Dispel Magic, Revivify, Death Ward, Banishment, Circle of Power, and Banishing Smite.</p>

<h3>Do 2024 Paladins prepare spells?</h3>
<p>Yes. 2024 Paladins prepare level 1+ Paladin spells from the Paladin list. They start with two prepared level 1 spells and can replace one prepared Paladin spell after a Long Rest.</p>

<h3>Is Divine Smite a spell in 2024 DnD?</h3>
<p>Yes. Divine Smite is a level 1 Paladin spell in the 2024 rules. At Paladin level 2, you always have it prepared and can cast it once without spending a spell slot per Long Rest.</p>

<h3>Should a Paladin use every spell slot on Divine Smite?</h3>
<p>No. Divine Smite is strong, but Bless, Divine Favor, Find Steed, Aura of Vitality, Dispel Magic, Revivify, and Circle of Power can matter more than one burst of damage.</p>

<h3>Which 2024 Paladin spells need concentration?</h3>
<p>Common concentration Paladin spells include Bless, Shield of Faith, Heroism, Protection from Evil and Good, Shining Smite, Aura of Vitality, Aura of Life, Aura of Purity, Banishment, Banishing Smite, Circle of Power, and Summon Celestial.</p>

<h3>Does Find Steed count as a good Paladin spell?</h3>
<p>Yes. Find Steed is one of the most identity-defining Paladin spells because it changes movement, travel, and table presence. In VTT games, it works best when the steed has its own readable token.</p>

<h3>What should a new Paladin prepare at level 1?</h3>
<p>A simple level 1 start is Bless plus Cure Wounds. If another character already covers healing or Bless, use Divine Favor, Shield of Faith, Heroism, or Searing Smite instead.</p>

<h2 id="video">Watch the Paladin spells companion video</h2>
<p>This <a href="${PALADIN_2024_SPELLS_DND_VIDEO_URL}" rel="noreferrer noopener">2024 Paladin class video</a> is best treated as a companion, not a rules source. Use it after you know your table is using 2024 rules and you have chosen your default opener.</p>

${liteVideoEmbed('_vx-oqXOabw', 'Paladin 2024 法术配套视频', {
  src: PALADIN_2024_SPELLS_DND_VIDEO_PLACEHOLDER_PATH,
  alt: 'Clickable webp video cover for a paladin 2024 spells dnd guide with a holy warrior, spell cards, radiant smite light, and VTT token markers',
})}
`;

export const paladin2024SpellsDndArticleHtmlZh = String.raw`
<p><strong>Paladin 2024 法术（paladin 2024 spells dnd）</strong>的难点不只是排名：该怎样准备，才不会每个法术位都被 Divine Smite 吃掉。</p>

<p>我会按职责选法术。一个开场法术，一个救场法术，一个防御法术，一个 smite 计划，再留一个非战斗答案。这样 Paladin 在战斗外也有用，战斗里也不会每次命中都停下来纠结。</p>

<table>
  <thead>
    <tr>
      <th>需求</th>
      <th>推荐 Paladin 2024 法术</th>
      <th>为什么准备</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>稳定开场</strong></td>
      <td>Bless, Divine Favor, Shield of Faith</td>
      <td>按队伍需求选择命中/豁免、持续伤害或 AC。</td>
    </tr>
    <tr>
      <td><strong>爆发 smite</strong></td>
      <td>Divine Smite, Searing Smite, Shining Smite, Blinding Smite</td>
      <td>当这次命中必须产生结果，或附加效果会改变战局时使用。</td>
    </tr>
    <tr>
      <td><strong>救场</strong></td>
      <td>Cure Wounds, Aid, Lesser Restoration, Aura of Vitality, Revivify</td>
      <td>避免一个坏回合直接变成角色死亡或整场崩盘。</td>
    </tr>
    <tr>
      <td><strong>移动与存在感</strong></td>
      <td>Find Steed, Locate Object, Locate Creature</td>
      <td>解决移动、追踪、寻找目标这些武器攻击碰不到的问题。</td>
    </tr>
    <tr>
      <td><strong>魔法防御</strong></td>
      <td>Protection from Evil and Good, Dispel Magic, Remove Curse, Circle of Power</td>
      <td>适合有施法者、诅咒、不死、Fiend 或高压豁免的战役。</td>
    </tr>
  </tbody>
</table>

<h2>2024 Paladin 施法怎么运作</h2>
<p>2024 规则下，Paladin 从 1 级开始获得施法（Spellcasting）。<a href="${PALADIN_2024_CLASS_RULES_URL}" rel="noreferrer noopener">官方 2024 Paladin 规则</a>在职业条目中列出 Paladin 法术表，你从这张表里准备法术。Charisma 是你的施法关键属性，Holy Symbol 可以作为 Paladin 法术的施法法器。</p>

<p>1 级时，你准备两个 1 环 Paladin 法术。职业文本推荐 Heroism 和 Searing Smite，但实际选择应该看桌子。Bless 加 Cure Wounds 更稳。Divine Favor 加 Searing Smite 更进攻。Heroism 在有恐惧和消耗压力的团里很好用。</p>

<p>随着 Paladin 等级提高，你能准备的法术数量也会增加。数量增加时，你补准备自己能施放环级的 Paladin 法术。完成长休（Long Rest）后，你可以把 1 个已准备的 Paladin 法术替换成另一个你能施放的 Paladin 法术。它很灵活，但不是每天全表重配。</p>

<p>2 级的 Paladin&apos;s Smite 让你始终准备 Divine Smite。每次长休后，你还可以不消耗法术位施放一次 Divine Smite。所以正常情况下，不要把普通准备名额浪费在职业已经给你的 Divine Smite 上。</p>

<figure class="inline-figure inline-figure--four-three-crop">
  <img
    class="inline-figure__image inline-figure__image--four-three"
    src="${PALADIN_2024_SPELLS_DND_PREP_IMAGE_PATH}"
    alt="Paladin 2024 法术准备桌面图，有 Bless 标记、Divine Smite 骰子、Find Steed Token、专注标记和法术卡"
    width="1200"
    height="1200"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Paladin 法术最好配一组 VTT 标记：Bless、Shield of Faith、Shining Smite、专注和 Find Steed 都容易被忘。</figcaption>
</figure>

<h2>Divine Smite 和 2024 smite 取舍</h2>
<p>2024 里的 Divine Smite 是法术，不再只是一个随时倾倒法术位的独立伤害按钮。<a href="${PALADIN_2024_SPELL_DESCRIPTIONS_URL}" rel="noreferrer noopener">2024 法术描述</a>把 Divine Smite 列为 1 环 Paladin 法术，施法时间是命中近战武器或徒手打击后立刻使用的 Bonus Action。</p>

<p>2024 施法规则还限制你在一个回合里只能花费一个法术位来施放法术。对 Paladin 来说，重点是先看本回合有没有已经用法术位施法，再决定能不能继续用法术位 smite。来自 Paladin&apos;s Smite 的免法术位 Divine Smite 更容易安排，但用法术位支付的 smite 仍然要遵守回合里的法术位限制。</p>

<ul>
  <li><strong>战斗会拖长吗？</strong>Divine Favor 或 Bless 往往比一次爆发更赚。</li>
  <li><strong>敌人必须现在倒下吗？</strong>Divine Smite 值得花资源。</li>
  <li><strong>附加效果重要吗？</strong>Shining Smite、Blinding Smite、Staggering Smite 或 Banishing Smite 往往比纯伤害更有价值。</li>
</ul>

<p>如果你的团刚从 2014 规则切到 2024，建议开团前先读一遍 <a href="${DND_2024_CASTING_SPELLS_RULES_URL}" rel="noreferrer noopener">2024 施法回合规则</a>，尤其是附赠动作 smite（Bonus Action smite）、魔法动作（Magic action）和反应法术的交互。</p>

<h2>1 环 Paladin 法术怎么选</h2>
<p>最常用的 1 环 Paladin 法术包括 Bless、Divine Favor、Divine Smite、Shield of Faith、Cure Wounds、Heroism、Protection from Evil and Good 和 Searing Smite。早期不能全带，所以按职责筛。</p>

<table>
  <thead>
    <tr>
      <th>法术</th>
      <th>最好用途</th>
      <th>注意点</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Bless</strong></td>
      <td>队伍命中和豁免</td>
      <td>需要专注。队友会反复攻击或吃危险豁免时很强。</td>
    </tr>
    <tr>
      <td><strong>Divine Favor</strong></td>
      <td>多次武器命中</td>
      <td>需要 Bonus Action 设置，更适合能持续攻击的战斗。</td>
    </tr>
    <tr>
      <td><strong>Divine Smite</strong></td>
      <td>命中后爆发</td>
      <td>伤害直接，但 2 级后职业会始终准备它。</td>
    </tr>
    <tr>
      <td><strong>Shield of Faith</strong></td>
      <td>保护一个关键目标</td>
      <td>需要专注。适合某个角色正在吃压力的场景。</td>
    </tr>
    <tr>
      <td><strong>Cure Wounds</strong></td>
      <td>触碰治疗</td>
      <td>要用动作，还要站到目标旁边。</td>
    </tr>
    <tr>
      <td><strong>Heroism</strong></td>
      <td>抗恐惧和临时 HP</td>
      <td>需要专注。有恐惧机制时价值更高。</td>
    </tr>
  </tbody>
</table>

<h2>2 环 Paladin 法术怎么选</h2>
<p>2 环开始，Paladin 不只是带 radiant 伤害的武器角色。Find Steed 和 Shining Smite 是 2024 法术表里的 2 环 Paladin 法术。Aid 和 Lesser Restoration 没那么炫，但没人带时会非常难受。</p>

<table>
  <thead>
    <tr>
      <th>法术</th>
      <th>职责</th>
      <th>为什么重要</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Find Steed</strong></td>
      <td>坐骑、移动、角色识别</td>
      <td>给坐骑单独做 Token。它要上地图，就应该清楚可读。</td>
    </tr>
    <tr>
      <td><strong>Aid</strong></td>
      <td>队伍耐久</td>
      <td>不需要专注，危险开始前就能用。</td>
    </tr>
    <tr>
      <td><strong>Lesser Restoration</strong></td>
      <td>状态修复</td>
      <td>处理 blinded、deafened、paralyzed 和 poisoned。</td>
    </tr>
    <tr>
      <td><strong>Magic Weapon</strong></td>
      <td>非魔法武器补救</td>
      <td>取决于战役，在较早遇到抗性敌人时更有用。</td>
    </tr>
    <tr>
      <td><strong>Shining Smite</strong></td>
      <td>伤害、显形、攻击优势</td>
      <td>当全队能集火同一目标时尤其好用。</td>
    </tr>
    <tr>
      <td><strong>Zone of Truth</strong></td>
      <td>社交压力</td>
      <td>调查和审问里更强，地城走廊里通常不急。</td>
    </tr>
  </tbody>
</table>

<h2>3 到 5 环 Paladin 法术</h2>
<p>高环 Paladin 法术位很贵，应该用在能改变战局、救角色、或解决武器攻击无法解决的问题上。Aura of Vitality 和 Blinding Smite 是 3 环 Paladin 法术。Banishing Smite、Circle of Power 和 Summon Celestial 出现在 5 环 Paladin 法术表中。</p>

<table>
  <thead>
    <tr>
      <th>环级</th>
      <th>强力选择</th>
      <th>桌面用途</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>3 环</strong></td>
      <td>Aura of Vitality, Blinding Smite, Dispel Magic, Remove Curse, Revivify</td>
      <td>连续治疗、致盲压力、魔法答案、解咒、紧急复活。</td>
    </tr>
    <tr>
      <td><strong>4 环</strong></td>
      <td>Aura of Life, Aura of Purity, Banishment, Death Ward, Staggering Smite</td>
      <td>生存、状态防护、移除目标、防死亡保险、控制附加效果。</td>
    </tr>
    <tr>
      <td><strong>5 环</strong></td>
      <td>Banishing Smite, Circle of Power, Destructive Wave, Greater Restoration, Raise Dead, Summon Celestial</td>
      <td>高额 smite、豁免保护、范围伤害、重大修复、复活和额外战场单位。</td>
    </tr>
  </tbody>
</table>

<p>长冒险日里，我最容易感受到 Aura of Vitality 的价值。Boss 战每轮逼你做魔法豁免时，Circle of Power 会比再打一发伤害更重要。</p>

<h2>Paladin 准备法术示例</h2>
<p>这些是开局模板，不是固定答案。如果下场明显需要别的功能，长休后换掉一个法术。</p>

<h3>1 级 Paladin</h3>
<ul>
  <li>Bless</li>
  <li>Cure Wounds 或 Searing Smite</li>
</ul>

<h3>5 级 Paladin</h3>
<ul>
  <li>Bless</li>
  <li>Divine Favor</li>
  <li>Shield of Faith</li>
  <li>Aid</li>
  <li>Find Steed</li>
  <li>Lesser Restoration</li>
</ul>

<h3>9 级 Paladin</h3>
<ul>
  <li>Bless</li>
  <li>Divine Favor</li>
  <li>Shield of Faith</li>
  <li>Find Steed</li>
  <li>Lesser Restoration</li>
  <li>Shining Smite</li>
  <li>Aura of Vitality</li>
  <li>Dispel Magic</li>
  <li>Revivify</li>
</ul>

<p>如果你想对比另一个半施法职业的准备逻辑，可以看 <a href="${ZH_DND_RANGER_SPELLS_PATH}">DND 游侠法术指南</a>。想看支援和控场思路，可以读 <a href="${ZH_DND_BARD_SPELLS_PATH}">DND Bard 法术指南</a>。如果专注经常掉，先看 <a href="${ZH_DND_CONSTITUTION_PATH}">体质（Constitution）指南</a>。</p>

<h2>VTT 里的 Paladin 法术准备</h2>
<p>Paladin 法术在线上跑团时最好可视化。开团前准备一套小标记：普通 Paladin Token、Find Steed 坐骑 Token、Bless 标记、Shield of Faith 标记、Shining Smite 目标高亮，以及专注标记。</p>

<p>你可以在 <a href="${ZH_EDITOR_PATH}">Token Maker 里制作 Paladin 和坐骑 Token</a>，再打开 <a href="${ZH_DICE_ROLLER_PATH}">DND 骰子工具</a>处理 Divine Smite 伤害、Bless d4、治疗和专注检定。这不是装饰，而是减少漏加成和停顿。</p>

<p>如果你还在判断 Paladin 是否适合这个角色概念，可以搭配 <a href="${ZH_DND_CLASSES_PATH}">DND 职业指南</a>一起看。</p>

<h2>Paladin 2024 法术常见问题</h2>
<h3>DnD 里最好的 Paladin 2024 法术有哪些？</h3>
<p>泛用性最高的 Paladin 2024 法术包括 Bless、Divine Favor、Divine Smite、Shield of Faith、Find Steed、Aid、Lesser Restoration、Shining Smite、Aura of Vitality、Dispel Magic、Revivify、Death Ward、Banishment、Circle of Power 和 Banishing Smite。</p>

<h3>2024 Paladin 是准备法术吗？</h3>
<p>是。2024 Paladin 从 Paladin 法术表里准备 1 环及以上法术。1 级开始准备两个 1 环法术，长休后可以替换一个已准备的 Paladin 法术。</p>

<h3>Divine Smite 在 2024 DnD 里是法术吗？</h3>
<p>是。Divine Smite 在 2024 规则里是 1 环 Paladin 法术。Paladin 2 级后始终准备它，并且每次长休可以不消耗法术位施放一次。</p>

<h3>Paladin 应该把所有法术位都用在 Divine Smite 上吗？</h3>
<p>不应该。Divine Smite 很强，但 Bless、Divine Favor、Find Steed、Aura of Vitality、Dispel Magic、Revivify 和 Circle of Power 经常比一次爆发伤害更重要。</p>

<h3>哪些 2024 Paladin 法术需要专注？</h3>
<p>常见需要专注的 Paladin 法术包括 Bless、Shield of Faith、Heroism、Protection from Evil and Good、Shining Smite、Aura of Vitality、Aura of Life、Aura of Purity、Banishment、Banishing Smite、Circle of Power 和 Summon Celestial。</p>

<h3>Find Steed 是好用的 Paladin 法术吗？</h3>
<p>是。Find Steed 很能体现 Paladin 的角色身份，因为它会改变移动、旅行和桌面存在感。线上跑团时，坐骑最好有自己的清晰 Token。</p>

<h3>新手 Paladin 1 级应该准备什么？</h3>
<p>简单稳妥的 1 级准备是 Bless 加 Cure Wounds。如果队友已经覆盖治疗或 Bless，可以改用 Divine Favor、Shield of Faith、Heroism 或 Searing Smite。</p>

<h2 id="video">Paladin 法术配套视频</h2>
<p>这个 <a href="${PALADIN_2024_SPELLS_DND_VIDEO_URL}" rel="noreferrer noopener">2024 Paladin 职业视频</a>适合作为补充观看，不作为规则来源。先确认桌子使用 2024 规则，再决定你的默认开场法术。</p>

${liteVideoEmbed('_vx-oqXOabw', 'Paladin 2024 spells DnD companion video', {
  src: PALADIN_2024_SPELLS_DND_VIDEO_PLACEHOLDER_PATH,
  alt: 'Paladin 2024 法术视频封面，圣武士、法术卡、光耀 smite 光效和 VTT Token 标记',
})}
`;
