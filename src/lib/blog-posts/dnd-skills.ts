import {
  CREATIVE_COMMONS_BY_4_LEGALCODE_URL,
  DND_2014_USING_ABILITY_SCORES_URL,
  DND_2024_PLAYING_THE_GAME_URL,
  DND_2024_RULES_GLOSSARY_URL,
  DND_SRD_51_PDF_URL,
  DND_SRD_521_PDF_URL,
  DND_SRD_URL,
  EN_DICE_ROLLER_PATH,
  EN_DND_BACKGROUNDS_PATH,
  EN_DND_CHARACTER_SHEET_PATH,
  EN_DND_CLASSES_PATH,
  EN_DND_CONSTITUTION_PATH,
  EN_DND_STATS_PATH,
  EN_PLAYERS_HANDBOOK_DND_5E_PATH,
  HUIJI_2024_PROFICIENCY_URL,
  HUIJI_2024_SKILL_TERM_URL,
  SKILLS_ABILITY_MAP_IMAGE_PATH,
  SKILLS_ABILITY_MAP_ZH_IMAGE_PATH,
  SKILLS_CHECK_BONUS_ZH_IMAGE_PATH,
  SKILLS_CHECK_NOT_SAVE_IMAGE_PATH,
  SKILLS_HIDE_HELP_YEAR_IMAGE_PATH,
  SKILLS_NAME_TRAPS_ZH_IMAGE_PATH,
  ZH_DICE_ROLLER_PATH,
  ZH_DND_BACKGROUNDS_PATH,
  ZH_DND_CHARACTER_SHEET_PATH,
  ZH_DND_STATS_PATH,
  ZH_PLAYERS_HANDBOOK_DND_5E_PATH,
} from './shared';

export const dndSkillsArticleHtml = String.raw`
<p>Write <code>2014</code> or <code>2024</code> on the tracker before you copy a skill line. There are eighteen <strong>dnd skills</strong>: Acrobatics, Animal Handling, Arcana, Athletics, Deception, History, Insight, Intimidation, Investigation, Medicine, Nature, Perception, Performance, Persuasion, Religion, Sleight of Hand, Stealth, and Survival. Each name sits on one ability. Constitution has no skill. A skill check is d20 + the ability modifier + proficiency bonus if you are proficient in that skill. Hide, Help, and Expertise are not safe to mix across years, so write the year first.</p>
<p>If the table has not named a year, settle it with the <a href="${EN_PLAYERS_HANDBOOK_DND_5E_PATH}" rel="noreferrer noopener">Player&rsquo;s Handbook version guide</a>, write the year, and open only that year&rsquo;s skill lines. Public lookups sit on the <a href="${DND_SRD_URL}" rel="noreferrer noopener">System Reference Document</a> for the 2014 and 2024 document set.</p>

<h2>Lock 2014 or 2024 before you copy a skill line</h2>

<p>Write the year on the initiative tracker or on the edge of the character sheet. Then copy each skill line from that year only. The eighteen English names match in 2014 and 2024. The default ability column matches. Constitution has no skill in both years. The add formula matches: d20 + the ability modifier + proficiency bonus if you are proficient. Matching names are not matching Hide, Help, or Expertise. A card that keeps 2024 Hide (DC 15 Dexterity (Stealth)), 2014 Help (no &ldquo;pick a skill or tool you are proficient in&rdquo;), and a 2024 Expertise glossary line is three books on one sheet. Stop and write one year.</p>

<p>Lock the year because three lines change the first skill roll if you mix books. The 2014 Hide action does not list DC 15; 2024 Hide is DC 15 Dexterity (Stealth) after cover, obscurement, and sight. The 2014 Help action does not require you to pick one of your own skill or tool proficiencies; 2024 Help does. 2014 Expertise sits on the Bard feature (choose two skill proficiencies you already have at 3rd level, then two more at 10th) and the general proficiency rule names rogue&rsquo;s Expertise. The 2024 Expertise glossary line does not say it is limited to Bard and Rogue. Those three splits are the reason the year has to be written before anyone is asked for a skill check. Copy them after the year is on the tracker.</p>

<p>Write one source line on the tracker:</p>
<ul>
  <li><code>Skills (Player's Handbook 2014 / SRD 5.1)</code></li>
  <li><code>Skills (Player's Handbook 2024 / SRD 5.2.1)</code></li>
</ul>

<p>Those two lines are not interchangeable. If the tracker is blank, stop and lock a year. If two players brought different years, pick one list for the table. Do not average them. Do not keep a 2024 Hide DC 15 on a 2014 card because it is a round number. Do not keep a 2014 Help line on a 2024 card because you remember granting advantage without naming your own proficiency.</p>

<p>Open the <a href="${DND_SRD_51_PDF_URL}" rel="noreferrer noopener">SRD 5.1 PDF</a> when the tracker says 2014. Open the <a href="${DND_SRD_521_PDF_URL}" rel="noreferrer noopener">SRD 5.2.1 PDF</a> or <a href="${DND_2024_PLAYING_THE_GAME_URL}" rel="noreferrer noopener">2024 Playing the Game</a> when the tracker says 2024. On the first skill check of the night, run this order. Name the skill. Read the year. Add only that year&rsquo;s line. If a sentence you remember from the other book is missing, that year&rsquo;s line does not list it. Leave it off.</p>

<h2>The 18 dnd skills and which ability each uses</h2>

<p>A skill is one specialized slice of an ability check. Most ability checks involve a skill. If you are proficient in that skill, add proficiency bonus. If you are not proficient, you still make the ability check; you just do not add proficiency bonus. That untrained roll is not a different kind of die. The 2024 Skills text gives the Game Master the last word on whether a skill applies to a check. Ability modifiers sit under these names; if the modifier column on the card is still blank, use the <a href="${EN_DND_STATS_PATH}" rel="noreferrer noopener">D&amp;D ability score guide</a>. The eighteen names live in the skills block; the <a href="${EN_DND_CHARACTER_SHEET_PATH}" rel="noreferrer noopener">character sheet guide</a> is the fill order, not a second skill list. A <a href="${EN_DND_BACKGROUNDS_PATH}" rel="noreferrer noopener">background</a> can grant two of these proficiencies. A <a href="${EN_DND_CLASSES_PATH}" rel="noreferrer noopener">class</a> can grant more of the same eighteen names. Neither list adds a nineteenth official skill. The System Reference Document does not rank these eighteen names.</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${SKILLS_ABILITY_MAP_IMAGE_PATH}"
    alt="Schematic card of six ability columns with the 18 skill names under five of them and Constitution labeled none."
    width="1536"
    height="960"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Eighteen dnd skills sit on Strength, Dexterity, Intelligence, Wisdom, and Charisma. Constitution has no skill.</figcaption>
</figure>

<p>Read across one row. The ability column is the default for both years. The third column is one breath for tonight, not the full SRD example list. Remaining examples sit in the <a href="${DND_SRD_51_PDF_URL}" rel="noreferrer noopener">SRD 5.1 PDF</a> Using Each Ability pages and in the <a href="${DND_SRD_521_PDF_URL}" rel="noreferrer noopener">SRD 5.2.1 PDF</a> Skills table.</p>

<table>
  <thead>
    <tr>
      <th>Skill</th>
      <th>Ability</th>
      <th>Tonight you might</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Athletics</td>
      <td>Strength</td>
      <td>Jump farther than usual, stay afloat in rough water, or break an object.</td>
    </tr>
    <tr>
      <td>Acrobatics</td>
      <td>Dexterity</td>
      <td>Keep your feet in a bad spot, or pull an acrobatic stunt.</td>
    </tr>
    <tr>
      <td>Sleight of Hand</td>
      <td>Dexterity</td>
      <td>Pick a pocket, hide something in your hand, or do a bit of legerdemain.</td>
    </tr>
    <tr>
      <td>Stealth</td>
      <td>Dexterity</td>
      <td>Move quietly and stay out of notice behind cover.</td>
    </tr>
    <tr>
      <td>Arcana</td>
      <td>Intelligence</td>
      <td>Recall spells, magic items, or the planes.</td>
    </tr>
    <tr>
      <td>History</td>
      <td>Intelligence</td>
      <td>Recall past events, people, nations, or cultures.</td>
    </tr>
    <tr>
      <td>Investigation</td>
      <td>Intelligence</td>
      <td>Dig obscure facts from books, or work out how something functions.</td>
    </tr>
    <tr>
      <td>Nature</td>
      <td>Intelligence</td>
      <td>Recall terrain, plants, animals, or weather.</td>
    </tr>
    <tr>
      <td>Religion</td>
      <td>Intelligence</td>
      <td>Recall gods, rites, or holy symbols.</td>
    </tr>
    <tr>
      <td>Animal Handling</td>
      <td>Wisdom</td>
      <td>Calm, train, or steer an animal.</td>
    </tr>
    <tr>
      <td>Insight</td>
      <td>Wisdom</td>
      <td>Read a creature&rsquo;s mood and intent.</td>
    </tr>
    <tr>
      <td>Medicine</td>
      <td>Wisdom</td>
      <td>Diagnose an illness, or say what killed the recently dead.</td>
    </tr>
    <tr>
      <td>Perception</td>
      <td>Wisdom</td>
      <td>Notice something easy to miss.</td>
    </tr>
    <tr>
      <td>Survival</td>
      <td>Wisdom</td>
      <td>Follow tracks, forage, find a trail, or avoid a natural hazard.</td>
    </tr>
    <tr>
      <td>Deception</td>
      <td>Charisma</td>
      <td>Sell a lie, or wear a disguise that holds up.</td>
    </tr>
    <tr>
      <td>Intimidation</td>
      <td>Charisma</td>
      <td>Awe or threaten someone into going along.</td>
    </tr>
    <tr>
      <td>Performance</td>
      <td>Charisma</td>
      <td>Act, tell a story, play music, or dance.</td>
    </tr>
    <tr>
      <td>Persuasion</td>
      <td>Charisma</td>
      <td>Convince someone honestly, with tact, not a lie or a threat.</td>
    </tr>
  </tbody>
</table>

<p>The 2014 Constitution Checks text says Constitution checks are uncommon, and no skills apply to Constitution checks, because that endurance is largely passive. No skills are related to Constitution. The 2024 Skills table does not give Constitution a skill. That empty column is not a 2024 invention. Do not invent a nineteenth name to fill it. Hit points, Constitution saves, and concentration sit on Constitution without a skill; the <a href="${EN_DND_CONSTITUTION_PATH}" rel="noreferrer noopener">Constitution guide</a> is that column, not a missing Athletics twin.</p>

<p>2014 prints a Variant: Skills with Different Abilities. Proficiency usually applies to one kind of ability check, but the Game Master may allow an unusual pairing. Example. A long swim as Constitution (Athletics). Example. A threat that uses brute force as Strength (Intimidation). Do not treat those pairings as the 2024 default map. The 2024 Skills table still lists Athletics on Strength and Intimidation on Charisma.</p>

<h2>A skill check is not a saving throw</h2>

<p>The game uses three d20 tests. 2014 names them ability check, saving throw, and attack roll. 2024 groups the same three under D20 Tests. A skill check is an ability check that names a skill. It is not a saving throw. It is not an attack roll. It is not a fourth kind of die. Do not treat Perception as a save. Do not add a skill name onto an attack unless a feature says so.</p>

<table>
  <thead>
    <tr>
      <th>Tonight</th>
      <th>Ability check (skill sits here)</th>
      <th>Saving throw</th>
      <th>Attack roll</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>What it is</td>
      <td>Test talent and training against a challenge that is not an attack. A skill names one slice of that check.</td>
      <td>Resist a threat. You usually do not choose to make it.</td>
      <td>Hit a target.</td>
    </tr>
    <tr>
      <td>Add</td>
      <td>d20 + ability modifier + PB if the relevant skill (or other listed proficiency) applies. Untrained: still the ability check, no PB.</td>
      <td>d20 + ability modifier + PB if proficient in that save.</td>
      <td>d20 + ability modifier + PB if proficient with the attack.</td>
    </tr>
    <tr>
      <td>Target</td>
      <td>DC</td>
      <td>DC</td>
      <td>AC</td>
    </tr>
    <tr>
      <td>Do not</td>
      <td>Do not treat Perception as a save. Do not invent a fourth &ldquo;skill die.&rdquo;</td>
      <td>2014: this line does not say you may opt to fail.<br />2024: you can choose to fail a save; missing that ability score auto-fails. Do not copy those save-only lines onto a skill check.</td>
      <td>Do not add a skill name onto an attack unless a feature says so.</td>
    </tr>
  </tbody>
</table>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${SKILLS_CHECK_NOT_SAVE_IMAGE_PATH}"
    alt="Schematic of three d20 tests — ability check, saving throw, attack roll — with a skill check on the ability-check path showing d20 plus +2 plus +2 and Passive Perception 14."
    width="1536"
    height="960"
    loading="lazy"
    decoding="async"
  />
  <figcaption>A skill check is an ability check, not a saving throw and not an attack. Example: Wisdom 15 (+2) at level 1 with proficiency (+2) is d20+4, and Passive Perception 14.</figcaption>
</figure>

<p>2014 asks for an ability check when a creature tries something other than an attack and failure is possible. 2024 asks for an ability check when a creature tries something other than an attack, the outcome is uncertain, and the result matters in the story.</p>

<h3>How to add the die</h3>

<p>Name the skill. Read the year on the tracker. Take the ability modifier for the mapped ability, or the pairing the Game Master allowed under the 2014 Variant. Add proficiency bonus if you are proficient in that skill. If a 2024 check uses a tool and you are proficient with that tool, add proficiency bonus from the tool line. Roll 1d20. Compare the total to the DC. If you are not proficient, skip proficiency bonus and still roll the ability check.</p>

<p>Example. The tracker says 2014 or 2024. A 1st-level creature with Wisdom 15 (+2), proficiency bonus +2, proficiency in Perception, and no Expertise makes an active Wisdom (Perception) check of d20+4. That is d20 + 2 + 2. The same creature with no Perception proficiency still makes a Wisdom check of d20+2. The missing +2 is proficiency bonus, not a failed save.</p>

<p>Typical Difficulty Classes match in both years. Matching DC numbers do not make matching Hide, Help, or Expertise.</p>

<table>
  <thead>
    <tr>
      <th>Difficulty</th>
      <th>DC</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Very easy</td>
      <td>5</td>
    </tr>
    <tr>
      <td>Easy</td>
      <td>10</td>
    </tr>
    <tr>
      <td>Medium</td>
      <td>15</td>
    </tr>
    <tr>
      <td>Hard</td>
      <td>20</td>
    </tr>
    <tr>
      <td>Very hard</td>
      <td>25</td>
    </tr>
    <tr>
      <td>Nearly impossible</td>
      <td>30</td>
    </tr>
  </tbody>
</table>

<p>Medium is 15. 2024 Hide writes DC 15 on the action. The 2014 Hide action does not list DC 15. Do not copy Medium onto 2014 Hide because the typical table prints 15.</p>

<h3>Proficiency and Expertise</h3>

<p>Proficiency bonus does not add more than once to the same roll (2014) or the same number (2024).</p>

<table>
  <thead>
    <tr>
      <th>Rule</th>
      <th>2014</th>
      <th>2024</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>PB stacking</td>
      <td>PB cannot add more than once to the same roll. You can multiply or divide first, then add.</td>
      <td>PB cannot add more than once to the same number. Example: Charisma (Deception or Persuasion) &mdash; proficiency in either adds once; proficiency in both still adds once. At most one multiply and one divide per use.</td>
    </tr>
    <tr>
      <td>Expertise</td>
      <td>Bard 3rd level: choose two skill proficiencies you already have; double PB on those ability checks. 10th level: two more. The general proficiency rule names rogue&rsquo;s Expertise.</td>
      <td>Expertise enhances one skill proficiency you already have. Double PB on that ability check unless another feature already doubled it. You cannot have more than one Expertise on the same skill proficiency. This line does not say it is limited to Bard and Rogue.</td>
    </tr>
    <tr>
      <td>Double PB when you would not have PB</td>
      <td>PB is 0 then; 0 times any number is still 0. Doubled PB is not generally applied to attack rolls or saving throws.</td>
      <td>Do not copy the 2014 History untrained-double example onto this 2024 line. The 2024 line does not print that History example.</td>
    </tr>
    <tr>
      <td>Tools</td>
      <td>The 2014 Using Ability Scores proficiency line does not write skill + tool &rarr; Advantage.</td>
      <td>Tool proficiency can add PB to an ability check that uses that tool. If you also have the skill proficiency the check uses, the check also has Advantage. One check can benefit from both.</td>
    </tr>
  </tbody>
</table>

<p>Example. The tracker says 2024. A creature is proficient in Deception and Persuasion. It makes a Charisma (Deception or Persuasion) check. Proficiency bonus goes on once. Two social proficiencies do not stack two copies of the same bonus on one number.</p>

<p>Example. The tracker says 2014. A 3rd-level Bard chooses two skill proficiencies already on the card and doubles proficiency bonus on those ability checks. At 10th level the Bard chooses two more. If a feature tried to double proficiency bonus on a check that would not receive proficiency bonus, the bonus is 0 and the double does nothing.</p>

<h3>Passive Perception</h3>

<p>Example. The tracker says 2014 or 2024. A 1st-level creature with Wisdom 15 (+2), proficiency bonus +2, proficiency in Perception, and no Expertise has an active Wisdom (Perception) check of d20+4. Passive Perception is 10 + 2 + 2 = <strong>14</strong>. Both years print 14 for that example. If Perception proficiency is not on the card, drop the +2 proficiency bonus: active d20+2, and the 2014 passive formula becomes 10 + 2 = 12. Do not turn that 12 into a 2014 printed Perception example.</p>

<p>2014 passive is a general way to score this kind of check without rolling. The total is 10 + every modifier that normally applies to that check. Advantage on the check adds +5. Disadvantage subtracts 5. The game calls that total a score. The 2014 rule is not limited to Perception.</p>

<p>The 2024 glossary entry on this point is Passive Perception. It is the creature&rsquo;s usual notice when the creature is not making an active Wisdom (Perception) check. The score is 10 + the creature&rsquo;s Wisdom (Perception) check bonus. Advantage on that check adds +5. Disadvantage subtracts 5. Example. The tracker says 2024. The same 1st-level creature has Advantage on Wisdom (Perception). Passive Perception is <strong>19</strong>. The 2024 glossary line lists that 19 on Passive Perception. Do not paste 19 onto a 2014 passive example as if 2014 printed 19 for Perception. 2014&rsquo;s general formula can add +5 for advantage and reach 19, but the printed 2014 Perception example is 14. Do not write a general &ldquo;any skill can be passive&rdquo; sentence onto the 2024 glossary entry. That entry is Passive Perception.</p>

<p>Write 14 on the card for that 1st-level Wisdom 15 proficient Perception creature unless a listed modifier changes the bonus. Then roll the next active check as d20+4, not as a Wisdom save.</p>

<h2>Hide and Help call a skill differently by year</h2>

<p>Hide calls Dexterity (Stealth) in both years. Help is how you hand another creature advantage / Advantage on a check or an attack. Copy the year on the tracker.</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${SKILLS_HIDE_HELP_YEAR_IMAGE_PATH}"
    alt="Two-column schematic: 2014 Hide with no DC 15 versus 2024 Hide DC 15 Stealth; 2014 Help with no proficiency requirement versus 2024 Help requiring you to pick your own skill or tool proficiency."
    width="1536"
    height="960"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Lock the year before you Hide or Help. 2014 Hide does not list DC 15. 2024 Hide is DC 15 Dexterity (Stealth). 2024 Help makes you pick one of your own skill or tool proficiencies; 2014 Help does not.</figcaption>
</figure>

<table>
  <thead>
    <tr>
      <th>Tonight</th>
      <th>Hide</th>
      <th>Help</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Which skill</td>
      <td>Dexterity (Stealth), both years.</td>
      <td>2014: the ability check for that task.<br />2024 Assist an Ability Check: the skill or tool proficiency <strong>you</strong> pick.</td>
    </tr>
    <tr>
      <td>Year split</td>
      <td>2014: this action does not list DC 15. Stealth total vs active Wisdom (Perception); while hidden, also vs passive Wisdom (Perception) even if nobody is searching.<br />2024: must be Heavily Obscured or behind Three-Quarters / Total Cover, unseen by enemies, and succeed on <strong>DC 15 Dexterity (Stealth)</strong>. Success: Invisible while hidden. Record the total as the DC for Wisdom (Perception) to find you. Ends if you speak louder than a whisper, an enemy finds you, you make an attack roll, or you cast a spell with a Verbal component.</td>
      <td>2014: ally gets advantage on the next ability check for that task before your next turn. This line does not require you to pick a skill or tool you are proficient in. Or aid an attack vs a target within 5 feet.<br />2024: pick <strong>one of your skill or tool proficiencies</strong> and an ally near enough for you to assist verbally or physically; that ally&rsquo;s next ability check using <strong>that</strong> skill or tool has Advantage until the start of your next turn. GM decides if you can assist. Attack assist: interfere with an enemy within 5 feet.</td>
    </tr>
    <tr>
      <td>Working Together</td>
      <td>&mdash;</td>
      <td>2014: leader (or highest modifier) makes the ability check with advantage; in combat this needs Help. You can only help a task you could attempt. Example: opening a lock that needs thieves&rsquo; tools &mdash; someone without that proficiency cannot help.<br />2024 Help is the 2024 line above, not this 2014 paragraph.</td>
    </tr>
    <tr>
      <td>Group Checks</td>
      <td>&mdash;</td>
      <td>2014: everyone makes the check; at least half succeed &rarr; the group succeeds. Example: group Wisdom (Survival) in a swamp.<br />2024 Playing the Game&rsquo;s first 12 pages do not include this Group Checks paragraph.</td>
    </tr>
  </tbody>
</table>

<p>Hide rolls Stealth. The 2014 Hide action does not list DC 15. The 2024 Help action requires you to pick one of your own skill or tool proficiencies; the 2014 Help line does not.</p>

<h3>Hide</h3>

<p>Walk 2014 Hide with the Perception 14 already on the card. Example. The tracker says 2014. A 1st-level creature hides and rolls Dexterity (Stealth). The Game Master decides when hiding is possible. Another 1st-level creature with Wisdom 15, proficiency in Perception, and no Expertise is not searching. Compare the Stealth total to passive Wisdom (Perception) 14. If that second creature later searches, compare the same Stealth total to an active Wisdom (Perception) check of d20+4. There is still no DC 15 on the 2014 Hide action.</p>
<p>Walk 2024 Hide with the same creature. Example. The tracker says 2024. The hiding creature is behind Total Cover and no enemy can see it. It rolls Dexterity (Stealth) against DC 15. If the total is 15 or higher, the creature is Invisible while hidden, and that same total becomes the DC for a Wisdom (Perception) check to find it. If the total is 14, the Hide action fails the DC 15 gate. Do not treat that 14 as a 2014-style contest against Passive Perception 14. The 2024 action asked for DC 15 first.</p>

<h3>Help</h3>

<p>2014 Working Together: two creatures cannot help a task that would not benefit from a second pair of hands, such as threading a needle. Do not copy that needle line onto the 2024 Help action. 2024 Help leaves whether assistance is possible to the GM.</p>
<p>Walk 2024 Help next to the Deception and Persuasion stacking line. Example. The tracker says 2024. The helper is proficient in Deception and Persuasion. To Assist an Ability Check, the helper still picks one of those proficiencies, not both at once. The ally&rsquo;s next check must use the chosen skill. The helper&rsquo;s two social proficiencies do not put proficiency bonus on that check twice. The 2014 Help line does not ask the helper to name a proficiency they already have.</p>

<h3>2024 Search, Study, and Influence</h3>

<p>On a 2024 tracker, three actions can point at tonight&rsquo;s eighteen names. 2014 does not use Study or Influence as Combat actions. 2014 Search may call Wisdom (Perception) or Intelligence (Investigation). That 2014 line does not list Insight, Medicine, or Survival.</p>

<table>
  <thead>
    <tr>
      <th>2024 action</th>
      <th>Skills it names in the SRD table</th>
      <th>2014</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Search</td>
      <td>Insight, Medicine, Perception, Survival</td>
      <td>Search may call Wisdom (Perception) <strong>or</strong> Intelligence (Investigation). That 2014 line does not list Insight / Medicine / Survival.</td>
    </tr>
    <tr>
      <td>Study</td>
      <td>Arcana, History, Investigation, Nature, Religion</td>
      <td>The 2014 Combat action table does not include Study.</td>
    </tr>
    <tr>
      <td>Influence</td>
      <td>Deception, Intimidation, Performance, Persuasion, Animal Handling</td>
      <td>2014 does not have an Influence action. 2014 social play is still roleplay plus an ordinary Charisma skill check.</td>
    </tr>
  </tbody>
</table>

<p>Do not put Study or Influence on a 2014 action list as the default rule. If the 2024 tracker names Search and the object is hidden, 2024 Finding Hidden Objects usually wants Wisdom (Perception) and a search described near that object. A high total does not find an object you searched far away from. Keep that sentence on 2024. Leave it off the 2014 Search line. An Intelligence (Arcana) check can still happen as an ordinary ability check. It is not a 2014 Study action. A Charisma (Persuasion) check can still happen after roleplay. It is not a 2014 Influence action.</p>

<p>The year is written. Add the next skill check from that year. After the name and the bonus are correct, the <a href="${EN_DICE_ROLLER_PATH}" rel="noreferrer noopener">D&amp;D dice roller</a> can keep the d20 in view; the roller does not choose the year.</p>

<h2>FAQ about dnd skills</h2>
<h3>How many dnd skills are there? Does Constitution have one?</h3>
<p>There are eighteen. The English names match in 2014 and 2024. Constitution has no skill. The 2014 Constitution Checks text says no skills apply to Constitution checks. The 2024 Skills table does not give Constitution a skill.</p>
<h3>How do I calculate a skill check?</h3>
<p>Roll d20 + the ability modifier + proficiency bonus if you are proficient in that skill. If you are not proficient, you still make the ability check; you just do not add proficiency bonus. Example. A 1st-level creature with Wisdom 15 (+2) and proficiency in Perception (proficiency bonus +2) makes an active Wisdom (Perception) check of d20+4.</p>
<h3>Is a Perception check a saving throw?</h3>
<p>No. Perception is a Wisdom skill. A Perception check is an ability check. A saving throw is a different d20 test. A skill check is not a fourth kind of die.</p>
<h3>Do I use DC 15 when I Hide?</h3>
<p>On 2024 Hide, yes: succeed on DC 15 Dexterity (Stealth), after you meet Heavily Obscured or Three-Quarters / Total Cover and you are unseen by enemies. The 2014 Hide action does not list DC 15.</p>
<h3>If I'm proficient in Deception and Persuasion, do I add proficiency twice?</h3>
<p>No. Proficiency bonus does not add more than once to the same number. The 2024 rule uses Charisma (Deception or Persuasion): proficiency in either skill adds proficiency bonus once, and proficiency in both still adds it once.</p>

<h2>Sources</h2>

<p>This page is a paraphrase, not a reprint.</p>

<ul>
  <li><strong>System Reference Document (D&amp;D Beyond)</strong> &mdash; <a href="${DND_SRD_URL}" rel="noreferrer noopener">https://www.dndbeyond.com/srd</a> &mdash; Supports: SRD 5.1 / 5.2.1 entry.</li>
  <li><strong>SRD 5.1 (Creative Commons PDF)</strong> &mdash; <a href="${DND_SRD_51_PDF_URL}" rel="noreferrer noopener">https://media.dndbeyond.com/compendium-images/srd/5.1/SRD_CC_v5.1.pdf</a> &mdash; Supports: 2014 eighteen skills, Constitution has no skill, passive 14, Working Together, Help, Hide, Search, Bard Expertise.</li>
  <li><strong>SRD 5.2.1 (Creative Commons PDF)</strong> &mdash; <a href="${DND_SRD_521_PDF_URL}" rel="noreferrer noopener">https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf</a> &mdash; Supports: 2024 Skills table, D20 Tests, Expertise, Hide DC 15, Help, Search, Study, Influence, Passive Perception.</li>
  <li><strong>2024 Playing the Game</strong> &mdash; <a href="${DND_2024_PLAYING_THE_GAME_URL}" rel="noreferrer noopener">https://www.dndbeyond.com/sources/dnd/br-2024/playing-the-game</a> &mdash; Supports: 2024 chapter structure that matches SRD 5.2.1 Playing the Game.</li>
  <li><strong>Creative Commons Attribution 4.0 International</strong> &mdash; <a href="${CREATIVE_COMMONS_BY_4_LEGALCODE_URL}" rel="noreferrer noopener">https://creativecommons.org/licenses/by/4.0/legalcode</a> &mdash; Supports: the license named by both SRD attributions.</li>
</ul>
`;

export const dndSkillsArticleHtmlZh = String.raw`
<p>开团前先认这张表：<strong>dnd 5e 技能</strong>是绑在属性上的 18 项，不是法术表。体质没有技能，体质那一列不要找名字。这一行加的是 d20 + 属性调整值 +（有熟练才加熟练加值）；先对名字，再看熟练圈。</p>

<h2>技能不是法术、不是职业栏、不是网游技能</h2>

<p>中文桌把「技能」三个字用在三套东西上。对卡时只认属性技能那 18 项。</p>

<p>法术写在法术栏，施展要消耗法术位。技能不占法术位。城主要你做相关检定时，没有该项熟练也能掷，只是不加熟练加值。把技能栏当成法术目录，会把戏法、学派、法术位误认成这 18 个名字。法术位用完了，技能栏上的圈还在；两套纸不要抄进同一行。</p>

<p>职业页常印「技能：从特技、运动……选两项」。那是在给熟练圈，不是另印一套技能。武僧页那句选两项，选完仍是这 18 项里的两行；不会因为职业页写了「技能」就长出第 19 项。有人把狂暴叫「职业技能」：狂暴是职业特性，进职业栏，不进这 18 项。</p>

<p>网游还会把技能做成热键。DNF 的技能栏、DDO 的网游技能、BG3 的法术推荐，都不是这张表。卡上只找属性技能那 18 个简体名。听到「技能大全」「职业技能」「猎人技能」，先问是不是这 18 项；对不上名字，就不要往技能栏里填。</p>

<h2>18 项各自绑哪项属性</h2>

<p>2014《玩家手册》和 2024 免费规则里，这 18 个英文名没有增删。体质没有技能，表里因此没有体质行。</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${SKILLS_ABILITY_MAP_ZH_IMAGE_PATH}"
    alt="对照卡标题「体质没有技能」；力量：运动；敏捷：特技、巧手、隐匿；智力：奥秘、历史、调查、自然、宗教；感知：驯兽、洞悉、医药、察觉、求生；魅力：欺瞒、威吓、表演、游说；体质：无技能；页脚「示意图，不是规则书扫描。」"
    width="1536"
    height="960"
    loading="lazy"
    decoding="async"
  />
  <figcaption>对照卡标题「体质没有技能」：力量运动；敏捷特技、巧手、隐匿；智力奥秘、历史、调查、自然、宗教；感知驯兽、洞悉、医药、察觉、求生；魅力欺瞒、威吓、表演、游说；体质无技能。这是示意图，不是规则书扫描。</figcaption>
</figure>

<p>英文名见本句，表内只用简体名：力量（Athletics）；敏捷（Acrobatics, Sleight of Hand, Stealth）；智力（Arcana, History, Investigation, Nature, Religion）；感知（Animal Handling, Insight, Medicine, Perception, Survival）；魅力（Deception, Intimidation, Performance, Persuasion）。简体名跟 <a href="${HUIJI_2024_SKILL_TERM_URL}" rel="noreferrer noopener">灰机 2024「术语/技能」</a> 目录；灰机只对译名，加值回到公开规则。</p>

<table>
  <thead>
    <tr>
      <th scope="col">技能</th>
      <th scope="col">属性</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">运动</th>
      <td>力量</td>
    </tr>
    <tr>
      <th scope="row">特技</th>
      <td>敏捷</td>
    </tr>
    <tr>
      <th scope="row">巧手</th>
      <td>敏捷</td>
    </tr>
    <tr>
      <th scope="row">隐匿</th>
      <td>敏捷</td>
    </tr>
    <tr>
      <th scope="row">奥秘</th>
      <td>智力</td>
    </tr>
    <tr>
      <th scope="row">历史</th>
      <td>智力</td>
    </tr>
    <tr>
      <th scope="row">调查</th>
      <td>智力</td>
    </tr>
    <tr>
      <th scope="row">自然</th>
      <td>智力</td>
    </tr>
    <tr>
      <th scope="row">宗教</th>
      <td>智力</td>
    </tr>
    <tr>
      <th scope="row">驯兽</th>
      <td>感知</td>
    </tr>
    <tr>
      <th scope="row">洞悉</th>
      <td>感知</td>
    </tr>
    <tr>
      <th scope="row">医药</th>
      <td>感知</td>
    </tr>
    <tr>
      <th scope="row">察觉</th>
      <td>感知</td>
    </tr>
    <tr>
      <th scope="row">求生</th>
      <td>感知</td>
    </tr>
    <tr>
      <th scope="row">欺瞒</th>
      <td>魅力</td>
    </tr>
    <tr>
      <th scope="row">威吓</th>
      <td>魅力</td>
    </tr>
    <tr>
      <th scope="row">表演</th>
      <td>魅力</td>
    </tr>
    <tr>
      <th scope="row">游说</th>
      <td>魅力</td>
    </tr>
  </tbody>
</table>

<p>读表时按属性指认，不要按「听起来像什么工作」去猜。城主报出「力量（运动）」时，找运动那一行；报出「感知（察觉）」时，找察觉。体质检定、体质豁免仍然存在，只是没有对应的技能名可圈。有人在体质那一列找「体质技能」，停：没有这一行。</p>

<p>这桌还没写成 2014《玩家手册》或 2024 免费规则时，先看 <a href="${ZH_PLAYERS_HANDBOOK_DND_5E_PATH}" rel="noreferrer noopener">DND《玩家手册》怎么选</a>；选完再回来对这 18 个名字。名单本身不用为了锁年再抄一遍。</p>

<h3>技能配其他属性要城主允许</h3>

<p>卡上印的对应关系不要自己改。城主可以允许某次检定把技能配到另一项属性：例如力量（威吓），2014《玩家手册》还有体质（运动）。那是这一次检定用哪项调整值，不是把威吓那一行的属性列永久改成力量。玩家先问城主，再掷。不要用铅笔改掉印好的那一栏，也不要因为「我力气大」就自行把威吓改挂力量。</p>

<h2>体操、生存、观察要对回这 18 个</h2>

<p>中文资料会给同一行技能换名字。名字换了，不是新技能。听到别名，指回表里已有的那一行。</p>

<p>体操对回<strong>特技</strong>。资料把 Acrobatics 写成体操时，仍是敏捷那一行的特技，不要在敏捷下再加一行体操。卡上已经圈了特技，又听到体操，问的是同一行。</p>

<p>生存对回<strong>求生</strong>。Survival 有人叫生存，卡上仍写求生。不要同时圈生存和求生，那会当成两项。口播「做个生存」，对回求生再掷。</p>

<p>观察对回<strong>察觉</strong>。有人把 Perception 叫观察；还有人把这项技能直接叫感知，会和属性「感知」撞在一起。属性仍叫感知，技能叫察觉。听见「感知技能」「做个感知」，问清楚：要的是感知属性检定，还是察觉这一行。不要把察觉改写成感知技能，否则属性名和技能名叠成一个词，今晚对不回表。</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${SKILLS_NAME_TRAPS_ZH_IMAGE_PATH}"
    alt="对照卡标题「对回这 18 个」；体操 → 特技；生存 → 求生；观察 / 感知（技能）→ 察觉；底栏「不是新技能」；页脚「示意图，不是规则书扫描。」"
    width="1536"
    height="960"
    loading="lazy"
    decoding="async"
  />
  <figcaption>对照卡标题「对回这 18 个」：体操对回特技，生存对回求生，观察或技能名「感知」对回察觉；底栏写「不是新技能」。这是示意图，不是规则书扫描。</figcaption>
</figure>

<p>其余别名同样对回，不要写成第 19 行。特技動作仍是特技。说服对回游说。洞察、察言观色对回洞悉。扒手、手上功夫、手上把戲对回巧手。隱藏对回隐匿。動物馴養对回驯兽。医疗对回医药。</p>

<p>扒手听起来像一种营生，不要另开「扒手技能」。隱藏是繁体写法，不要在隐匿旁边再圈一行。不要因为「看人」就改去察觉：察觉管的是感知（察觉）那一行，洞悉是另一行。不要在感知下再写「医疗」。</p>

<p>这些词可以出现在口播或旧印本里。对完名，用表里那一行去掷。不要因为听到一个新叫法，就在卡底再写一个技能名。</p>

<h2>有熟练才加熟练加值</h2>

<p>技能是某项属性的一个特定方面。2024 免费规则把技能说成用属性检定去做的一类事情，城主最终决定某技能这次是否适用。技能检定是带技能的那种属性检定，不是另一种骰。2024 里，属性检定属于 D20 检定（D20 Test）。</p>

<p>有该项熟练：把熟练加值加到这次属性检定上。没有熟练：仍做该技能相关检定，不加熟练加值。</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${SKILLS_CHECK_BONUS_ZH_IMAGE_PATH}"
    alt="对照卡标题「有熟练才加」；d20 + 属性调整值 +（熟练则熟练加值）；无熟练：仍掷，PB 当 0；专精：PB 加倍，不是第 19 项；页脚「示意图，不是规则书扫描。」"
    width="1536"
    height="960"
    loading="lazy"
    decoding="async"
  />
  <figcaption>对照卡标题「有熟练才加」：d20 + 属性调整值 +（熟练则熟练加值）；无熟练仍掷，熟练加值当 0；专精是熟练加值加倍，不是第 19 项。这是示意图，不是规则书扫描。</figcaption>
</figure>

<p>下面用标明的例子走加值；这不是某次跑团记录。例子：城主要你爬悬崖，要力量（运动）。有运动熟练，力量检定加上熟练加值；没有运动熟练，仍做力量检定，熟练加值按 0。不要因为没圈运动，就说「我不会爬、不能掷」。</p>

<p>同一掷骰只能加一次熟练加值；加倍、减半也各一次。规则写魅力（欺瞒或游说）时，两项都熟练也不加两次。不要看见两个技能名，就把熟练加值抄两遍。</p>

<p>1 级熟练加值是 +2。17–20 级是 +6。不要把整张等级表抄进技能栏。属性值怎么换成调整值，见 <a href="${ZH_DND_STATS_PATH}" rel="noreferrer noopener">六项属性与调整值</a>。调整值已经写在属性那一栏；技能行只决定要不要再加熟练加值。</p>

<p>熟练从职业、背景等规则给的来源抄进卡。怎么按创角顺序填，见 <a href="${ZH_DND_CHARACTER_SHEET_PATH}" rel="noreferrer noopener">按创角顺序填角色卡</a>；背景会给哪两项技能，见 <a href="${ZH_DND_BACKGROUNDS_PATH}" rel="noreferrer noopener">背景给哪两项技能</a>。不要在技能栏凭印象多圈，也不要因为「我这个人很会说话」就把欺瞒、游说、表演一起涂黑。</p>

<p>总值拿去比城主给的 DC。城主决定目标数字；不要在技能栏旁另贴一张难度总表。</p>

<p>被动察觉不掷骰：10 加上感知（察觉）检定通常加的那些数；有优势再 +5，有劣势再 −5。例子：1 级、感知 15、熟练察觉，被动察觉是 14。这一行写察觉。</p>

<p>读完这一行要当场出骰面，用 <a href="${ZH_DICE_ROLLER_PATH}" rel="noreferrer noopener">骰子工具</a>。</p>

<h3>专精不是第 19 项技能</h3>

<p>专精增强一项已经熟练的技能：用这项技能做属性检定时，熟练加值加倍。</p>

<p>2014《玩家手册》的例子是诗人 3 级：选两项已有技能熟练，这些检定的熟练加值加倍；10 级再两项。没有诗人 3 级这类特性时，不要在技能栏旁自行写「专精」。</p>

<p>2024 术语表：获得专精时，必须已经熟练该技能；同一技能不能有两份专精；用该技能做属性检定时熟练加值加倍，除非已被另一特性加倍。没有该技能熟练时，把熟练加值加倍仍是 0。2014 属性章的例子：对历史无熟练，加倍熟练加值的特性也不给智力（历史）任何加值。0 的两倍还是 0，不要把「加倍」听成「至少加一截」。</p>

<p>Skilled 专长是再拿熟练，不是专精。不要在 18 项旁边再写一行「专精技能」。熟练圈还是那 18 个名字里的圈；专精改的是已经圈上的那一行怎么加。</p>

<h2>开团前对一下技能栏</h2>

<ul>
  <li>找的是 18 项属性技能，不是法术、不是职业特性、不是网游栏。</li>
  <li>18 个名字按属性对上；体质无技能。</li>
  <li>体操对回特技，生存对回求生，观察或「感知技能」对回察觉。</li>
  <li>没熟练仍能掷，只是不加熟练加值。</li>
  <li>有熟练只加一次熟练加值。</li>
  <li>专精是加倍，不是新技能。</li>
  <li>改技能配哪项属性，先问城主。</li>
  <li>这桌是 2014《玩家手册》还是 2024 免费规则：名单相同，先写年再掷。</li>
</ul>

<h2>来源</h2>

<ul>
  <li><a href="${HUIJI_2024_SKILL_TERM_URL}" rel="noreferrer noopener">灰机「术语/技能」</a> — 2024 简体译名</li>
  <li><a href="${HUIJI_2024_PROFICIENCY_URL}" rel="noreferrer noopener">灰机 2024「熟练」</a> — 技能表与专精译名</li>
  <li><a href="${DND_SRD_URL}" rel="noreferrer noopener">D&amp;D Beyond 的 SRD 入口</a> — 2014 与 2024 公开规则</li>
  <li><a href="${DND_2024_PLAYING_THE_GAME_URL}" rel="noreferrer noopener">2024 Playing the Game</a> — 技能表、熟练、检定</li>
  <li><a href="${DND_2024_RULES_GLOSSARY_URL}" rel="noreferrer noopener">2024 术语表</a> — 专精</li>
  <li><a href="${DND_2014_USING_ABILITY_SCORES_URL}" rel="noreferrer noopener">2014 Using Ability Scores</a> — 技能与属性检定</li>
  <li><a href="${CREATIVE_COMMONS_BY_4_LEGALCODE_URL}" rel="noreferrer noopener">Creative Commons 署名 4.0 法律文本</a> — CC-BY 4.0</li>
</ul>
`;
