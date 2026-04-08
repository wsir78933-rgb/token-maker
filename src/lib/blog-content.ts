import type { Metadata } from 'next';

import { absoluteUrl, getSiteConfig, getSiteUrl } from '@/lib/site-content';
import { LOCALES, getLanguageAlternates, getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

export const BLOG_POSTS_PER_PAGE = 9;

// Blog routes are ready for indexing and should be included in sitemap output.
export const BLOG_PLACEHOLDER_MODE = false;

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
  readTime: string;
  coverLabel: string;
  coverImage?: string;
  coverAlt?: string;
  bodyHtml?: string;
  headings?: BlogPostHeading[];
  relatedSlugs?: string[];
  seoTitle?: string;
  metaDescription?: string;
  featured?: boolean;
  placeholder?: boolean;
}

export interface BlogPostHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

type PlaceholderCopy = {
  featuredTitle: string;
  featuredExcerpt: string;
  coverLabel: string;
  detailTitle: string;
  detailBody: string;
  ctaTitle: string;
  ctaBody: string;
};

function decodeHeadingText(value: string) {
  return value
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function createHeadingSlug(text: string) {
  const normalized = text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[’']/g, '')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || 'section';
}

function addHeadingAnchors(post: BlogPost): BlogPost {
  if (!post.bodyHtml) {
    return post;
  }

  const headingCounts = new Map<string, number>();
  const headings: BlogPostHeading[] = [];
  const bodyHtml = post.bodyHtml.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, levelValue, attrs, innerHtml) => {
    const text = decodeHeadingText(innerHtml);

    if (!text) {
      return match;
    }

    const level = Number(levelValue) as BlogPostHeading['level'];
    const existingId = attrs.match(/\sid=(['"])(.*?)\1/i)?.[2];
    const baseId = existingId ?? createHeadingSlug(text);
    const nextCount = (headingCounts.get(baseId) ?? 0) + 1;
    const uniqueId = nextCount === 1 ? baseId : `${baseId}-${nextCount}`;

    headingCounts.set(baseId, nextCount);
    headings.push({ id: uniqueId, text, level });

    if (existingId) {
      return `<h${level}${attrs.replace(/\sid=(['"])(.*?)\1/i, ` id="${uniqueId}"`)}>${innerHtml}</h${level}>`;
    }

    return `<h${level}${attrs} id="${uniqueId}">${innerHtml}</h${level}>`;
  });

  return {
    ...post,
    bodyHtml,
    headings,
  };
}

function isPublishedBlogPost(post: BlogPost) {
  return !post.placeholder && Boolean(post.bodyHtml);
}

const DND_CLASSES_UPDATED_AT = '2026-03-29';
const DND_CLASSES_RANKED_UPDATED_AT = '2026-03-29';
const BLOG_TOKEN_GUIDE_UPDATED_AT = '2026-03-27';
const BLOG_SMALL_PARTY_GUIDE_UPDATED_AT = '2026-03-25';
const DND_ARMOR_UPDATED_AT = '2026-04-06';
const DND_CONSTITUTION_UPDATED_AT = '2026-04-07';
const DND_CLASSES_COVER_PATH = '/blog/covers/en/dnd-classes-explained.png';
const DND_CLASSES_RANKED_COVER_PATH = '/blog/covers/en/dnd-classes-ranked.png';
const DND_ARMOR_COVER_PATH = '/blog/covers/en/dnd-armor-guide.jpg';
const DND_CONSTITUTION_COVER_PATH = '/blog/covers/en/dnd-constitution-guide.png';
const DND_CLASSES_TABLETOP_IMAGE_PATH = '/blog/inline/dnd-classes/tabletop-atmosphere.png';
const DND_CLASSES_MARTIAL_IMAGE_PATH = '/blog/inline/dnd-classes/martial-blade-inline.jpg';
const DND_CLASSES_RANKED_PARTY_IMAGE_PATH = '/blog/inline/dnd-classes-ranked/party-lineup.png';
const DND_ARMOR_TYPES_IMAGE_PATH = '/blog/inline/dnd-armor/armor-types-armory.png';
const DND_ARMOR_HEAVY_IMAGE_PATH = '/blog/inline/dnd-armor/heavy-armor-paladin.png';

const placeholderCopyByLocale: Record<SiteLocale, PlaceholderCopy> = {
  en: {
    featuredTitle: 'Featured Article Placeholder',
    featuredExcerpt:
      'Replace this summary with the lead article you want to feature at the top of the list.',
    coverLabel: 'Cover',
    detailTitle: 'Content Placeholder',
    detailBody:
      'This article has not been written yet. Replace the placeholder post data with your real title, summary, and body source later.',
    ctaTitle: 'Want to make your own tabletop portrait?',
    ctaBody:
      'Upload an image and turn it into a token for Roll20, Foundry, or any other virtual tabletop.',
  },
  zh: {
    featuredTitle: '重点文章占位标题',
    featuredExcerpt: '这里先留给你后续要放在首屏的重点文章摘要。',
    coverLabel: '封面',
    detailTitle: '内容占位区',
    detailBody:
      '这篇文章还没有开始写。后续你只需要把占位数据替换成真实标题、摘要和正文来源就可以了。',
    ctaTitle: '如果你也想做自己的桌面头像',
    ctaBody: '这里可以直接把角色图处理成适合 Roll20、Foundry 或其他虚拟桌面的 Token。',
  },
};

const dndClassesArticleHtml = String.raw`
<p>If you are new to tabletop RPGs, learning the major <strong>DND classes</strong> is one of the fastest ways to understand how Dungeons &amp; Dragons actually feels at the table. Different class choices change your combat role, your decision-making speed, the kind of fantasy you bring to the party, and even how comfortable your first few sessions feel.</p>

<p>This guide breaks down the main <strong>DND classes</strong> in simple language. Instead of repeating rulebook text, it focuses on what the most popular options feel like in real play, which ones are easiest for new players, and how to match the right class to the fantasy you already have in mind.</p>

<h2>What Are DND Classes?</h2>
<p>In Dungeons &amp; Dragons, your class defines the way your character interacts with the game. The reason new players spend so much time comparing <strong>DND classes</strong> is simple: your class shapes how you attack, how much magic you manage, how complex your turns feel, and what role you naturally fill inside a group.</p>

<p>In practical terms, <strong>DND classes</strong> are the core gameplay identities in D&amp;D. A Barbarian solves problems very differently from a Wizard. A Rogue approaches danger differently from a Cleric. A Bard creates a different tone at the table than a Fighter. That is why choosing between class options matters so much for beginners.</p>

<ul>
  <li><strong>Combat identity:</strong> some classes want to stand in front, while others thrive from the back line.</li>
  <li><strong>Magic load:</strong> some classes barely touch spells, while others depend on them every round.</li>
  <li><strong>Learning curve:</strong> the easiest options ask for fewer decisions each turn.</li>
  <li><strong>Roleplay flavor:</strong> different class choices support very different character fantasies.</li>
</ul>

<h2>Quick Comparison of DND Classes</h2>
<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_CLASSES_TABLETOP_IMAGE_PATH}"
    alt="A D20 die and a dagger resting on a candlelit tabletop before a Dungeons & Dragons session"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
  />
</figure>
<p>If you want the short version before reading the full breakdown, the most beginner-friendly <strong>DND classes</strong> are usually Fighter, Barbarian, Rogue, and sometimes Paladin. These options are popular because they teach core D&amp;D habits without forcing you to juggle the largest spell lists in the game.</p>

<ul>
  <li><strong>Barbarian:</strong> simple power, high durability, and very direct turns.</li>
  <li><strong>Fighter:</strong> the safest all-around choice for learning combat rhythm.</li>
  <li><strong>Rogue:</strong> excellent for players who like stealth, timing, and clever positioning.</li>
  <li><strong>Paladin:</strong> strong melee presence with a little magic and a clear heroic identity.</li>
  <li><strong>Wizard and Druid:</strong> rewarding, but usually harder for first-time players.</li>
</ul>

<h2>DND Classes Explained from a Player Perspective</h2>
<p>Most lists of <strong>DND classes</strong> stop at mechanics. For beginners, that is usually not enough. The more useful question is what each option actually feels like once initiative starts, the party gets in trouble, and you need to make decisions under pressure.</p>

<h3>Simple martial DND classes for beginners</h3>
<figure class="inline-figure inline-figure--square-crop">
  <img
    class="inline-figure__image inline-figure__image--square"
    src="${DND_CLASSES_MARTIAL_IMAGE_PATH}"
    alt="A weathered longsword buried in stone, evoking the raw strength of martial Dungeons & Dragons classes"
    width="960"
    height="960"
    loading="lazy"
    decoding="async"
  />
</figure>
<p>The easiest <strong>DND classes</strong> for new players are usually martial classes that give clear turns, solid durability, and very little spell management. If you want beginner-friendly options that make immediate sense, start here.</p>

<p><strong>Barbarian</strong> feels like raw commitment. You get angry, move forward, and hit hard. Among all <strong>DND classes</strong>, Barbarian is one of the best choices for players who want simple combat decisions, big weapon hits, and a clear power fantasy from round one. The tradeoff is that Barbarian can feel more limited outside combat if you love utility tricks and flexible problem-solving.</p>

<p><strong>Fighter</strong> is often the safest recommendation in beginner conversations about <strong>DND classes</strong>. Fighter feels reliable in almost every session because your character always has something useful to do. If you want weapon flexibility, clean positioning lessons, and room to keep learning the rules over time, Fighter remains one of the most dependable class choices in the game.</p>

<p><strong>Rogue</strong> rewards timing more than brute force. In the large pool of <strong>DND classes</strong>, Rogue is especially satisfying for players who want to feel clever, precise, and useful both in and out of combat. You scout, sneak, investigate, and look for high-value openings instead of standing still and trading hits.</p>

<p><strong>Ranger</strong> appeals to players who picture a hunter, tracker, or fantasy archer. Compared with other <strong>DND classes</strong>, Ranger gives you a clean blend of ranged combat, exploration themes, and light magic. If your ideal hero is a monster hunter or survival expert, Ranger usually lands that fantasy without feeling too complicated.</p>

<h3>Magic-focused DND classes in Dungeons &amp; Dragons</h3>
<p>Spellcasting creates some of the most memorable moments in the game, but magical <strong>DND classes</strong> also ask for more reading, more planning, and better resource awareness. These spell-focused options are excellent when you want flexibility, but they are not equally friendly to first-time players.</p>

<p><strong>Wizard</strong> is the classic answer for players who want maximum options. Out of all <strong>DND classes</strong>, Wizard offers some of the broadest problem-solving power because a prepared spell list can reshape entire encounters. The downside is that Wizard can overwhelm new players who do not enjoy comparing many spells and planning ahead.</p>

<p><strong>Sorcerer</strong> offers a more instinctive magical identity. When players compare magical <strong>DND classes</strong>, Sorcerer often feels more approachable than Wizard because the class fantasy is immediate and the spell list usually feels easier to own. If you want strong magic without the heaviest preparation burden, Sorcerer is a strong option.</p>

<p><strong>Warlock</strong> stands out because it mixes mechanics with built-in story tension. Among roleplay-rich <strong>DND classes</strong>, Warlock is one of the best if you want mysterious power, strong flavor, and a class choice that instantly says something about your backstory. It is especially effective for players who care about story hooks as much as damage output.</p>

<p><strong>Cleric</strong> is often underestimated by beginners who assume support means passive play. In reality, Cleric is one of the most consistently useful <strong>DND classes</strong> because it can heal, protect, fight, and solve problems with divine magic. If you want to help the party without feeling sidelined, Cleric is a smart choice.</p>

<p><strong>Druid</strong> is one of the most flexible <strong>DND classes</strong>, but it can also demand more effort to learn. Wild Shape, control spells, and utility tools give Druid tremendous range, yet that same flexibility can feel heavy if you are still learning the rhythm of the game. For players who love unusual solutions, Druid is fantastic.</p>

<h3>Roleplay-heavy and identity-driven DND classes</h3>
<p>Some <strong>DND classes</strong> are easy to connect with because the fantasy is emotionally clear from the start. If you want options with strong personality, values, or performance energy, these are usually the first ones people fall in love with.</p>

<p><strong>Paladin</strong> feels powerful, heroic, and purpose-driven. Compared with other melee-focused <strong>DND classes</strong>, Paladin gives you a great balance of durability, strong hits, and a little magic without the full complexity of a dedicated caster. It is also one of the easiest classes to roleplay because vows, ideals, and duty naturally create character direction.</p>

<p><strong>Bard</strong> is one of the most flexible <strong>DND classes</strong> because it can support, influence, improvise, and contribute in many different scenes. Bard is best for players who enjoy social interaction, creative solutions, and the idea that personality matters just as much as raw combat efficiency.</p>

<p><strong>Monk</strong> is built around mobility, rhythm, and style. Among fast-moving <strong>DND classes</strong>, Monk is perfect for players who want to cross the battlefield, reposition constantly, and feel physically expressive in combat. It is fun and distinctive, though sometimes a little less intuitive for total beginners than Fighter or Barbarian.</p>

<h2>Which DND Classes Are Best for Beginners?</h2>
<p>If you want the practical answer, the most beginner-friendly <strong>DND classes</strong> are usually Fighter, Barbarian, Rogue, and Paladin. These classes work so well for first characters because they give you clear jobs, understandable turns, and enough power to feel effective without drowning you in spell text.</p>

<ul>
  <li><strong>Fighter:</strong> the best all-around starting point if you feel unsure.</li>
  <li><strong>Barbarian:</strong> ideal if you want direct melee power and low complexity.</li>
  <li><strong>Rogue:</strong> great for players who like stealth, skills, and tactical movement.</li>
  <li><strong>Paladin:</strong> strong if you want heroic flavor, melee strength, and a touch of magic.</li>
</ul>

<p>The harder beginner options among <strong>DND classes</strong> are usually Wizard, Druid, and sometimes Bard. These classes are excellent, but they shine most when you already enjoy reading abilities carefully and managing more tools at once.</p>

<h2>How to Choose Between DND Classes</h2>
<p>The best way to compare <strong>DND classes</strong> is not to ask which one is strongest in theory. The better question is which of these <strong>DND classes</strong> matches the way you want your turns to feel. If you choose from that angle, your first character is much more likely to stay fun after the novelty wears off.</p>

<ul>
  <li><strong>If you want simple turns:</strong> start with Barbarian, Fighter, or Rogue.</li>
  <li><strong>If you want lots of magic:</strong> look at Wizard, Sorcerer, Cleric, Warlock, or Druid.</li>
  <li><strong>If you want front-line action:</strong> choose Barbarian, Fighter, Paladin, or Monk.</li>
  <li><strong>If you want a back-line caster identity:</strong> Wizard, Sorcerer, and Warlock are strong fits.</li>
  <li><strong>If you want strong roleplay hooks:</strong> Paladin, Bard, Cleric, and Warlock stand out.</li>
</ul>

<p>When you compare <strong>DND classes</strong>, try asking yourself three quick questions: Do I want simple turns or many options? Do I want magic or weapons first? Do I care more about mechanics or fantasy identity? Those questions usually narrow the field faster than reading every subclass on day one.</p>

<h2>FAQ About DND Classes</h2>
<h3>What are DND classes in simple terms?</h3>
<p><strong>DND classes</strong> are the gameplay roles that shape how your character fights, what powers you use, and how your turns feel. The easiest way to understand <strong>DND classes</strong> is to think of them as the main playstyles of D&amp;D.</p>

<h3>Which DND classes are easiest for beginners?</h3>
<p>The easiest <strong>DND classes</strong> for beginners are usually Fighter, Barbarian, Rogue, and Paladin. These <strong>DND classes</strong> give you strong early value without the heaviest spell-management burden.</p>

<h3>Are DND classes important for roleplay?</h3>
<p>Yes. <strong>DND classes</strong> matter for roleplay because they strongly influence tone, motivation, and fantasy identity. A Paladin, Bard, and Warlock can all be charismatic, but those <strong>DND classes</strong> carry very different emotional textures.</p>

<h3>Do DND classes decide whether I use magic?</h3>
<p>Very often, yes. Some <strong>DND classes</strong> barely touch magic, while other <strong>DND classes</strong> rely on spells almost every round. That is why class choice is one of the biggest decisions for new players.</p>

<h3>How should I choose between DND classes if I am stuck?</h3>
<p>If you feel stuck between several <strong>DND classes</strong>, choose the one whose fantasy feels immediately exciting. When two <strong>DND classes</strong> seem equally fun, start with the simpler one so your first campaign teaches the game without overwhelming you.</p>

<h2>Final Thoughts on DND Classes</h2>
<p>The best <strong>DND classes</strong> are not always the strongest on paper. The best <strong>DND classes</strong> are the ones that make you excited to take your turn, talk in character, and come back next week. If you are still undecided after comparing all these <strong>DND classes</strong>, start with Fighter or Rogue, learn the rhythm of the game, and let your next character become more complex once you know what parts of D&amp;D you enjoy most.</p>

<h2>Video Overview of DND Classes</h2>
<p>If you want a fast visual recap after reading, this video works well as a companion summary of the main <strong>DND classes</strong> and the playstyles they support.</p>

<iframe
  class="inline-embed inline-embed--video"
  src="https://www.youtube.com/embed/K4YtOhYzOfo"
  title="DND classes overview video"
  loading="lazy"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen
></iframe>
`;

const dndClassesArticleHtmlZh = String.raw`
<p>如果你刚接触桌面角色扮演游戏，那么先搞懂 <strong>DND 职业</strong> 往往是理解《龙与地下城》玩法最快的一步。不同的职业选择会直接影响你的战斗定位、每回合决策压力、角色幻想风格，甚至影响你第一次跑团时会不会觉得轻松顺手。</p>

<p>这篇指南会用尽量直白的语言解释主要的 <strong>DND 职业</strong>。它不会只是重复规则书上的描述，而是更关注一件对新手更有帮助的事：这些职业在真实游戏里玩起来到底是什么感觉，哪些更适合第一次开卡，哪些更适合已经知道自己想玩什么的玩家。</p>

<h2>什么是 DND 职业？</h2>
<p>在《龙与地下城》里，职业决定了你的角色会如何参与游戏。很多新手会花很久比较不同的 <strong>DND 职业</strong>，原因很简单：职业会影响你怎么攻击、你要不要管理法术、你的回合会不会很复杂，以及你在队伍里自然承担什么位置。</p>

<p>从更实际的角度看，<strong>DND 职业</strong>就是 D&amp;D 里最核心的玩法身份。野蛮人和法师解决问题的方式完全不同；游荡者与牧师面对危险的处理思路也不一样；吟游诗人带来的桌面气质，又和战士完全不是一回事。所以对新手来说，选职业绝不是小事。</p>

<ul>
  <li><strong>战斗定位：</strong>有些职业天然适合站前排，有些则更适合后排输出或支援。</li>
  <li><strong>法术负担：</strong>有些职业几乎不碰法术，有些职业每回合都离不开施法。</li>
  <li><strong>上手难度：</strong>简单的职业往往每回合可选项更少，更容易建立节奏感。</li>
  <li><strong>角色气质：</strong>不同职业会给你完全不同的幻想体验和扮演方向。</li>
</ul>

<h2>DND 职业快速对比</h2>
<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_CLASSES_TABLETOP_IMAGE_PATH}"
    alt="烛光下的桌面上放着一枚二十面骰和一把匕首，营造出跑团开场前的氛围"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
  />
</figure>
<p>如果你想先看结论，再决定要不要往下细读，那么对新手最友好的 <strong>DND 职业</strong> 通常是战士、野蛮人、游荡者，有时也包括圣武士。它们之所以常被推荐，是因为这些职业能帮你先学会 D&amp;D 的基本节奏，而不会一上来就让你管理庞大的法术系统。</p>

<ul>
  <li><strong>野蛮人：</strong>直接、耐打、每回合决策很清晰。</li>
  <li><strong>战士：</strong>最稳妥的全能新手选择，容易理解也很少出错。</li>
  <li><strong>游荡者：</strong>适合喜欢潜行、时机把握和聪明操作的玩家。</li>
  <li><strong>圣武士：</strong>近战存在感强，同时有一点法术和非常鲜明的英雄感。</li>
  <li><strong>法师与德鲁伊：</strong>非常强，但对第一次接触规则的人来说通常更难。</li>
</ul>

<h2>从玩家视角理解 DND 职业</h2>
<p>很多关于 <strong>DND 职业</strong> 的文章只会告诉你机制差异，但对新手来说更重要的问题其实是：当战斗开始、队伍遇到麻烦、轮到你行动时，这个职业到底会让你感觉轻松、紧张、爽快，还是需要大量预判？</p>

<h3>适合新手的近战与物理系职业</h3>
<figure class="inline-figure inline-figure--square-crop">
  <img
    class="inline-figure__image inline-figure__image--square"
    src="${DND_CLASSES_MARTIAL_IMAGE_PATH}"
    alt="一把插在岩石中的长剑，呈现出近战职业那种粗犷直接的力量感"
    width="960"
    height="960"
    loading="lazy"
    decoding="async"
  />
</figure>
<p>对第一次接触 D&amp;D 的玩家来说，最好上手的 <strong>DND 职业</strong> 通常是那些回合清晰、耐久不错、几乎不用管理法术的职业。如果你希望第一次开卡就能迅速进入状态，这一组最值得优先考虑。</p>

<p><strong>野蛮人</strong> 的核心体验非常直接：你愤怒、冲锋、狠狠干下去。放在所有 <strong>DND 职业</strong> 里，野蛮人几乎是最容易立刻理解的职业之一。如果你喜欢简单的战斗决策、重武器打击感和非常明确的力量幻想，它会很适合你。需要注意的是，它在战斗外的花活通常比较少。</p>

<p><strong>战士</strong> 是大多数人推荐给新手时最稳的答案。在许多 <strong>DND 职业</strong> 里，战士最大的优势就是“几乎不会后悔”。它让你专注学习站位、团队配合和战斗节奏，而不用同时承担太重的规则负担。如果你想先把基础打扎实，战士依然是最安全的起点。</p>

<p><strong>游荡者</strong> 更强调时机感而不是硬换伤害。相比其他 <strong>DND 职业</strong>，它特别适合喜欢聪明操作、潜行侦察和精确打击的玩家。游荡者在战斗内外都常常有存在感，因为你不仅能找破绽输出，还能在探索、调查和潜入环节持续贡献。</p>

<p><strong>游侠</strong> 很适合脑海里已经有“猎人”“弓手”或“追踪者”形象的玩家。与其他 <strong>DND 职业</strong> 相比，游侠最大的魅力在于它把远程战斗、探索主题和轻度施法很好地结合在一起。如果你的幻想是怪物猎人或荒野生存专家，游侠通常都很对味。</p>

<h3>施法系 DND 职业</h3>
<p>法术系统会带来 D&amp;D 最有记忆点的时刻，但施法型 <strong>DND 职业</strong> 通常也意味着更多阅读、更多计划和更细的资源管理。如果你喜欢灵活度和“我有办法解决这个问题”的感觉，这一类会很吸引人，但它们对第一次上手的友好程度并不一致。</p>

<p><strong>法师</strong> 是最经典的全能施法者。在所有 <strong>DND 职业</strong> 里，法师往往拥有最广的解题能力，因为准备得当的法术列表几乎可以改变整个遭遇战。代价也很明确：如果你不喜欢读大量法术说明、比较选项和提前规划，法师会让你很快觉得吃力。</p>

<p><strong>术士</strong> 的魔法体验更像“天赋觉醒”，而不是长期苦读。和其他施法型 <strong>DND 职业</strong> 相比，术士通常更容易让新手建立直觉，因为职业幻想够明确，学习门槛也比法师更顺滑。如果你想玩强力施法者，但不想一开始就被选项淹没，术士很值得考虑。</p>

<p><strong>契术师</strong> 的特别之处在于它几乎自带剧情张力。放在所有重视扮演的 <strong>DND 职业</strong> 中，契术师非常适合那些希望职业与背景故事紧密绑定的玩家。神秘力量、契约来源、黑暗气质，这些都让它很容易变成整场战役里最有戏的角色之一。</p>

<p><strong>牧师</strong> 经常被新手低估，因为很多人一听到“辅助”就以为自己只能站在后排加血。实际上，在大量 <strong>DND 职业</strong> 里，牧师是整体稳定性非常高的职业之一：它能治疗、能支援、能打、也能解场。如果你希望自己在各种场景里都不容易失去价值，牧师是很强的选择。</p>

<p><strong>德鲁伊</strong> 是最灵活的职业之一，但这份灵活同时也会带来学习成本。在很多 <strong>DND 职业</strong> 中，德鲁伊最适合那些喜欢非常规解法的玩家。变形、控场、自然系工具都很强，但如果你还在熟悉 D&amp;D 的基本节奏，它可能会显得有点忙。</p>

<h3>角色感最强的 DND 职业</h3>
<p>有些 <strong>DND 职业</strong> 天然更容易让人投入，因为它们的幻想方向从一开始就很鲜明。如果你在选职业时最看重的是角色气质、信念、戏剧张力或表现空间，那么下面这些职业通常会更有吸引力。</p>

<p><strong>圣武士</strong> 是最容易在情感上建立连接的职业之一。和其他前排型 <strong>DND 职业</strong> 相比，圣武士兼顾力量、正义感与一点施法，不会像全施法职业那样规则负担很重，却能提供很强的英雄体验。誓言、信条和使命感，也让它在扮演上天然有抓手。</p>

<p><strong>吟游诗人</strong> 的魅力在于“几乎什么都能碰一点”。放在所有 <strong>DND 职业</strong> 中，它是最强调个性表达和社交影响力的职业之一。如果你喜欢对话、即兴发挥、辅助队友和创造性解法，吟游诗人通常会让你玩得很开心。</p>

<p><strong>武僧</strong> 的关键词是移动、节奏与风格。相比其他强调站桩输出的 <strong>DND 职业</strong>，武僧更适合喜欢高机动、高操作感的玩家。它很酷，但对完全没接触过 D&amp;D 的人来说，通常不会像战士或野蛮人那样直观。</p>

<h2>哪些 DND 职业最适合新手？</h2>
<p>如果你只想要一个最实用的答案，那么最适合新手的 <strong>DND 职业</strong> 通常还是战士、野蛮人、游荡者和圣武士。它们的共同点是：职责清晰、回合好理解、强度足够、规则负担相对可控。</p>

<ul>
  <li><strong>战士：</strong>最稳妥的全能新手选择，如果你完全拿不准，先选它通常不会错。</li>
  <li><strong>野蛮人：</strong>适合想要近战压迫感、又不想处理太多复杂机制的人。</li>
  <li><strong>游荡者：</strong>适合喜欢潜行、技能和站位博弈的玩家。</li>
  <li><strong>圣武士：</strong>适合想要前排打击感、少量法术和强角色身份的人。</li>
</ul>

<p>对新手来说相对更难的 <strong>DND 职业</strong> 通常是法师、德鲁伊，有时也包括吟游诗人。它们都很强，但更适合那些本来就喜欢阅读能力说明、管理多个工具栏和提前规划的人。</p>

<h2>如何在不同 DND 职业之间做选择</h2>
<p>比较 <strong>DND 职业</strong> 时，最没帮助的问题往往是“哪个最强”。更有用的问题是：我希望自己的回合是什么感觉？我想靠武器还是法术解决问题？我更看重机制效率，还是角色幻想？从这个角度出发，通常会更快选到适合自己的职业。</p>

<ul>
  <li><strong>想要简单回合：</strong>优先看野蛮人、战士、游荡者。</li>
  <li><strong>想玩重度施法：</strong>优先看法师、术士、牧师、契术师、德鲁伊。</li>
  <li><strong>想站前排：</strong>优先看野蛮人、战士、圣武士、武僧。</li>
  <li><strong>想玩后排施法者：</strong>法师、术士和契术师会更合适。</li>
  <li><strong>想要明显的扮演钩子：</strong>圣武士、吟游诗人、牧师和契术师都很强。</li>
</ul>

<p>如果你在几个 <strong>DND 职业</strong> 之间犹豫不决，不妨先问自己三个问题：我更喜欢简单还是复杂？我更想挥武器还是放法术？我更想扮演一个什么样的人？这些问题通常比一口气把所有子职全看完更有效。</p>

<h2>DND 职业常见问题</h2>
<h3>什么是 DND 职业？</h3>
<p><strong>DND 职业</strong> 就是角色的核心玩法身份。它决定你如何战斗、是否施法、回合操作复杂不复杂，以及你在队伍里通常承担什么位置。</p>

<h3>新手最适合哪些 DND 职业？</h3>
<p>对新玩家来说，最容易上手的 <strong>DND 职业</strong> 通常是战士、野蛮人、游荡者和圣武士。它们都能在不增加太多规则负担的前提下，让你快速进入游戏节奏。</p>

<h3>DND 职业会影响角色扮演吗？</h3>
<p>会，而且影响很大。不同的 <strong>DND 职业</strong> 不只改变技能与战斗方式，也会改变角色的语气、价值观、戏剧冲突和你在桌面上的表现方式。</p>

<h3>DND 职业会决定我要不要用魔法吗？</h3>
<p>大多数情况下会。有些 <strong>DND 职业</strong> 几乎不依赖法术，而另一些职业则几乎每场战斗都围绕施法展开，所以职业选择本身就是你是否想深度接触魔法系统的重要判断点。</p>

<h3>如果我在几个 DND 职业之间选不出来怎么办？</h3>
<p>如果你在多个 <strong>DND 职业</strong> 之间卡住了，优先选那个让你“最想马上开玩”的职业；如果还是拿不准，就先选更简单的那个。这样你的第一张卡会更容易上手，也更容易建立信心。</p>

<h2>关于 DND 职业的最后建议</h2>
<p>最好的 <strong>DND 职业</strong> 不一定是纸面强度最高的那个，而是那个能让你每轮都期待自己行动、愿意开口扮演、并且还想继续把这个角色玩下去的职业。如果你看完后还是不确定，不妨先从战士或游荡者开始，等真正熟悉了 D&amp;D 的节奏，再去尝试更复杂、更重资源管理的职业。</p>

<h2>DND 职业视频总览</h2>
<p>如果你读完后想再用更直观的方式快速回顾一遍，这段视频很适合作为收尾补充，帮你重新梳理主要 <strong>DND 职业</strong> 的差异和定位。</p>

<iframe
  class="inline-embed inline-embed--video"
  src="https://www.youtube.com/embed/K4YtOhYzOfo"
  title="DND 职业视频总览"
  loading="lazy"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen
></iframe>
`;

const dndClassesRankedArticleHtml = String.raw`
<p>If you are searching for <strong>dnd classes ranked</strong>, you probably want a clear answer to one question: which class is actually worth playing in Dungeons &amp; Dragons?</p>

<p>The problem is that most class rankings are either too complicated or too opinion-based. Some lists only care about raw power. Others only care about roleplay flavor. And some rankings ignore the simple fact that a class can be strong on paper but still frustrating for real players at the table.</p>

<p>That is why this guide uses a simpler system.</p>

<p>This <strong>D&amp;D classes ranked</strong> list is based on four practical factors:</p>

<ul>
  <li><strong>Power:</strong> how effective the class is in combat and problem-solving.</li>
  <li><strong>Versatility:</strong> how useful it is in different situations.</li>
  <li><strong>Ease of play:</strong> how friendly it is for beginners and casual players.</li>
  <li><strong>Fun factor:</strong> how satisfying the class feels in actual play.</li>
</ul>

<p>So this is not just a "highest damage wins" list. It is a ranking of the classes that tend to perform best for real groups over a full campaign.</p>

<h2>DnD Classes Ranked Tier List</h2>
<p>If you want the short version first, here it is.</p>

<h3>S Tier</h3>
<ul>
  <li>Wizard</li>
  <li>Cleric</li>
  <li>Paladin</li>
</ul>

<h3>A Tier</h3>
<ul>
  <li>Bard</li>
  <li>Fighter</li>
  <li>Druid</li>
  <li>Warlock</li>
</ul>

<h3>B Tier</h3>
<ul>
  <li>Rogue</li>
  <li>Sorcerer</li>
  <li>Ranger</li>
</ul>

<h3>C Tier</h3>
<ul>
  <li>Barbarian</li>
  <li>Monk</li>
</ul>

<p>This ranking is aimed at general D&amp;D play, especially for players comparing the best D&amp;D classes, the strongest D&amp;D classes, and the best D&amp;D classes for beginners.</p>

<h2>How This DnD Classes Ranked List Was Decided</h2>
<p>Before jumping into the full ranking, it helps to explain the logic.</p>

<p>A class ranks higher here if it can do at least one of these things very well:</p>
<ul>
  <li>Carry encounters with strong abilities.</li>
  <li>Stay useful in many different party setups.</li>
  <li>Offer value both in and out of combat.</li>
  <li>Avoid punishing new players too hard for small mistakes.</li>
</ul>

<p>A class ranks lower if it usually has one or more of these problems:</p>
<ul>
  <li>Too narrow in what it can do.</li>
  <li>Too dependent on perfect situations.</li>
  <li>Too weak compared with similar alternatives.</li>
  <li>Harder to play than the reward justifies.</li>
</ul>

<p>That means this is not a ranking for one-shots only, and it is not based only on level 20 theorycrafting. It is built around the classes people actually enjoy and succeed with across normal campaigns.</p>

<h2>1. Wizard</h2>
<p>If you look at almost any serious <strong>dnd classes ranked</strong> discussion, Wizard ends up near the top. That is because no class matches its overall magical flexibility.</p>

<h3>Why Wizard Is S Tier</h3>
<p>Wizard is the best toolbox class in the game. It can deal damage, control enemies, defend allies, gather information, escape danger, and reshape encounters with the right spell choices.</p>
<p>More importantly, Wizard rewards knowledge. The more you understand the game, the stronger the class becomes. That gives it a very high ceiling compared with most other classes.</p>

<h3>Where Wizard Shines</h3>
<ul>
  <li>Battlefield control.</li>
  <li>Utility magic.</li>
  <li>Problem-solving.</li>
  <li>Late-game power.</li>
</ul>

<h3>Where Wizard Struggles</h3>
<ul>
  <li>More complex for beginners.</li>
  <li>Spell choice matters a lot.</li>
  <li>Can feel fragile early on.</li>
</ul>

<p><strong>Verdict:</strong> Wizard ranks first because versatility wins. It may not be the easiest class, but it is often the strongest overall class in D&amp;D when played well.</p>

<h2>2. Cleric</h2>
<p>Cleric is one of the most complete classes in the game. New players often think Cleric is just a healer, but that sells the class short.</p>

<h3>Why Cleric Is S Tier</h3>
<p>Cleric is strong because it does almost everything well. It supports the party, survives on the front line better than many casters, and still contributes real damage and utility.</p>
<p>A good Cleric feels useful in nearly every session. That consistency is a huge advantage.</p>

<h3>Where Cleric Shines</h3>
<ul>
  <li>Healing and support.</li>
  <li>Strong defense.</li>
  <li>Reliable spellcasting.</li>
  <li>Team value in almost every party.</li>
</ul>

<h3>Where Cleric Struggles</h3>
<ul>
  <li>Less flashy than Wizard in some builds.</li>
  <li>Some players expect a pure healer role, which can feel limiting.</li>
</ul>

<p><strong>Verdict:</strong> Cleric is one of the safest top-tier picks in any D&amp;D 5e class tier list because it combines power, reliability, and flexibility.</p>

<h2>3. Paladin</h2>
<p>If you want one class that feels powerful, simple, and heroic all at once, Paladin is hard to beat.</p>

<h3>Why Paladin Is S Tier</h3>
<p>Paladin succeeds because it gives players a little bit of everything that matters. It is durable, deals excellent burst damage, and supports the party without becoming mechanically overwhelming.</p>
<p>That makes it one of the rare classes that appeals to both beginners and experienced players.</p>

<h3>Where Paladin Shines</h3>
<ul>
  <li>Frontline durability.</li>
  <li>Big burst turns.</li>
  <li>Simple but rewarding gameplay.</li>
  <li>Strong party support.</li>
</ul>

<h3>Where Paladin Struggles</h3>
<ul>
  <li>Not as flexible at range.</li>
  <li>Less adaptable than full casters in unusual situations.</li>
</ul>

<p><strong>Verdict:</strong> Paladin may be the best all-around class in D&amp;D. If someone asks for the best D&amp;D class for beginners that still feels powerful, Paladin is one of the strongest answers.</p>

<h2>4. Bard</h2>
<p>Bard is one of the most well-rounded and underrated classes in D&amp;D. It may not always look broken at first glance, but it keeps proving its value in actual campaigns.</p>

<h3>Why Bard Is A Tier</h3>
<p>Bard ranks high because it improves the whole party. It helps with social encounters, support, control, and utility. In many groups, Bard becomes the class that quietly holds everything together.</p>
<p>It also has one of the best roleplay identities in the game, which matters more than many ranking lists admit.</p>

<h3>Where Bard Shines</h3>
<ul>
  <li>Social encounters.</li>
  <li>Support and utility.</li>
  <li>Flexible spell use.</li>
  <li>Roleplay-heavy campaigns.</li>
</ul>

<h3>Where Bard Struggles</h3>
<ul>
  <li>Less straightforward for players who only want damage.</li>
  <li>Its value can be less obvious to beginners.</li>
</ul>

<p><strong>Verdict:</strong> Bard is not always the most explosive class, but it is one of the smartest picks for players who want a class that is useful everywhere.</p>

<h2>5. Fighter</h2>
<p>Fighter earns a high spot because simple does not mean weak.</p>

<h3>Why Fighter Is A Tier</h3>
<p>Fighter is reliable, effective, and easy to understand. It gives players a strong foundation without overwhelming them with complex mechanics. That makes it one of the best entry points into D&amp;D.</p>
<p>At the same time, Fighter scales better than many people expect. It stays relevant because consistency matters.</p>

<h3>Where Fighter Shines</h3>
<ul>
  <li>Beginner-friendly gameplay.</li>
  <li>Reliable weapon damage.</li>
  <li>Strong survivability.</li>
  <li>Straightforward character building.</li>
</ul>

<h3>Where Fighter Struggles</h3>
<ul>
  <li>Less utility outside combat than top casters.</li>
  <li>Can feel plain if you want a flashy fantasy.</li>
</ul>

<p><strong>Verdict:</strong> If you want the easiest D&amp;D class for beginners, Fighter is still one of the best picks. It ranks high because it succeeds at exactly what it is supposed to do.</p>

<h2>6. Druid</h2>
<p>Druid is powerful, flexible, and often more complex than it first appears.</p>

<h3>Why Druid Is A Tier</h3>
<p>Druid has one of the widest toolkits in the game. It can support, control, scout, and adapt to unusual situations. In the right hands, it can feel almost as versatile as Wizard.</p>
<p>The reason it does not rank even higher is simple: not everyone wants to manage that many options.</p>

<h3>Where Druid Shines</h3>
<ul>
  <li>Utility and support.</li>
  <li>Control magic.</li>
  <li>Exploration.</li>
  <li>Flexible playstyle.</li>
</ul>

<h3>Where Druid Struggles</h3>
<ul>
  <li>Higher learning curve.</li>
  <li>Can feel overwhelming for first-time players.</li>
</ul>

<p><strong>Verdict:</strong> Druid is extremely strong, but it is better for players who enjoy complexity rather than players who want the simplest path.</p>

<h2>7. Warlock</h2>
<p>Warlock is one of the most distinctive classes in the game, both mechanically and thematically.</p>

<h3>Why Warlock Is A Tier</h3>
<p>Warlock ranks well because it combines flavor, customization, and reliable performance. It has a very clear identity, which makes it satisfying to play, and it avoids some of the overload that makes full casters intimidating for beginners.</p>
<p>It also stands out in rankings because it feels different from every other caster.</p>

<h3>Where Warlock Shines</h3>
<ul>
  <li>Strong class fantasy.</li>
  <li>Reliable damage loop.</li>
  <li>Good customization.</li>
  <li>Excellent roleplay hooks.</li>
</ul>

<h3>Where Warlock Struggles</h3>
<ul>
  <li>Unusual spell slot system.</li>
  <li>Can feel repetitive if you want more spell variety.</li>
</ul>

<p><strong>Verdict:</strong> Warlock is one of the most fun classes in D&amp;D for players who want flavor and power without the full complexity of Wizard.</p>

<h2>8. Rogue</h2>
<p>Rogue is stylish, useful, and popular for a reason.</p>

<h3>Why Rogue Is B Tier</h3>
<p>Rogue has a strong identity and is excellent at skills, stealth, and mobility. It often shines in campaigns with exploration, investigation, or social trickery.</p>
<p>The reason it lands in B Tier is not because it is bad. It is because some higher-ranked classes simply bring more total value to more situations.</p>

<h3>Where Rogue Shines</h3>
<ul>
  <li>Stealth and scouting.</li>
  <li>Skill checks.</li>
  <li>Mobility.</li>
  <li>Clever, tactical play.</li>
</ul>

<h3>Where Rogue Struggles</h3>
<ul>
  <li>Can feel inconsistent if conditions are not ideal.</li>
  <li>Offers less broad power than top-tier classes.</li>
</ul>

<p><strong>Verdict:</strong> Rogue is a very fun class and often a great roleplay choice, but it usually sits below the strongest all-around options.</p>

<h2>9. Sorcerer</h2>
<p>Sorcerer is powerful, but it can also be unforgiving.</p>

<h3>Why Sorcerer Is B Tier</h3>
<p>Sorcerer has impressive magical potential, especially when built carefully. It can hit hard and create strong turns, but it usually has fewer overall tools than Wizard.</p>
<p>That narrower toolkit matters in a ranking based on full-campaign usefulness rather than just standout moments.</p>

<h3>Where Sorcerer Shines</h3>
<ul>
  <li>High-impact spellcasting.</li>
  <li>Strong magical identity.</li>
  <li>Rewarding specialization.</li>
</ul>

<h3>Where Sorcerer Struggles</h3>
<ul>
  <li>Fewer options than Wizard.</li>
  <li>Easier to make weak choices during character creation.</li>
</ul>

<p><strong>Verdict:</strong> Sorcerer is a good class, but it is more specialized and less forgiving than the top spellcasting picks.</p>

<h2>10. Ranger</h2>
<p>Ranger has always been one of the most debated classes in D&amp;D.</p>

<h3>Why Ranger Is B Tier</h3>
<p>Ranger is not weak in every game, but it often feels more dependent on campaign style, subclass, and player creativity than classes ranked above it.</p>
<p>When everything lines up, Ranger can feel great. When it does not, it can feel like another class would have done the same job better.</p>

<h3>Where Ranger Shines</h3>
<ul>
  <li>Archery builds.</li>
  <li>Wilderness flavor.</li>
  <li>Tracking and monster-hunting fantasy.</li>
</ul>

<h3>Where Ranger Struggles</h3>
<ul>
  <li>Less broadly dominant than stronger alternatives.</li>
  <li>More dependent on campaign context.</li>
</ul>

<p><strong>Verdict:</strong> Ranger is playable and enjoyable, but it is rarely the first answer when people ask for the strongest or most generally useful class.</p>

<h2>11. Barbarian</h2>
<p>Barbarian is one of the easiest classes to understand and one of the most satisfying in straightforward combat.</p>

<h3>Why Barbarian Is C Tier</h3>
<p>Barbarian lands lower not because it is bad at fighting, but because it is narrow. It does one main job very well, but other classes often bring more to the table overall.</p>
<p>In a short combat-focused game, Barbarian can feel great. In a broader campaign, its limitations become more noticeable.</p>

<h3>Where Barbarian Shines</h3>
<ul>
  <li>Simple gameplay.</li>
  <li>Durability.</li>
  <li>Aggressive frontline combat.</li>
</ul>

<h3>Where Barbarian Struggles</h3>
<ul>
  <li>Lower versatility.</li>
  <li>Fewer tools outside combat.</li>
  <li>Less adaptability than hybrid classes.</li>
</ul>

<p><strong>Verdict:</strong> Barbarian is fun and beginner-friendly, but it usually ranks lower in a full <strong>dnd classes ranked</strong> list because it cannot cover as many situations as higher-tier classes.</p>

<h2>12. Monk</h2>
<p>Monk is the class that often looks cooler in theory than it feels in practice.</p>

<h3>Why Monk Is C Tier</h3>
<p>Monk has speed, style, and a strong fantasy identity, but it often asks the player to work harder for results that other classes achieve more easily.</p>
<p>That does not make Monk unplayable. It just means it is harder to recommend when ranking classes for general players.</p>

<h3>Where Monk Shines</h3>
<ul>
  <li>Mobility.</li>
  <li>Martial arts fantasy.</li>
  <li>Distinctive playstyle.</li>
</ul>

<h3>Where Monk Struggles</h3>
<ul>
  <li>Lower margin for error.</li>
  <li>Often feels less efficient than top competitors.</li>
  <li>More effort for less overall payoff.</li>
</ul>

<p><strong>Verdict:</strong> Monk is still a cool class, but in a practical ranking, it usually ends up near the bottom.</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_CLASSES_RANKED_PARTY_IMAGE_PATH}"
    alt="A Dungeons & Dragons party lineup featuring martial and spellcasting class archetypes"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
  />
</figure>

<h2>Best D&amp;D Classes by Player Type</h2>
<p>One weakness of many ranking articles is that they stop at the tier list. That is not enough, because the best class depends on what kind of player you are.</p>

<h3>Best D&amp;D Classes for Beginners</h3>
<p>If you are new to the game, start here:</p>
<ul>
  <li>Fighter</li>
  <li>Paladin</li>
  <li>Cleric</li>
  <li>Barbarian</li>
</ul>
<p>These classes are easier to understand and still strong enough to feel rewarding.</p>

<h3>Best D&amp;D Classes for Power</h3>
<p>If your main goal is strength and impact, these are the standouts:</p>
<ul>
  <li>Wizard</li>
  <li>Cleric</li>
  <li>Paladin</li>
</ul>
<p>These classes combine strong mechanics with excellent overall usefulness.</p>

<h3>Best D&amp;D Classes for Roleplay</h3>
<p>If you care most about story and personality, look at:</p>
<ul>
  <li>Bard</li>
  <li>Warlock</li>
  <li>Rogue</li>
  <li>Paladin</li>
</ul>
<p>These classes naturally create memorable character hooks.</p>

<h3>Best D&amp;D Classes for Players Who Want Options</h3>
<p>If you like solving problems in different ways, choose:</p>
<ul>
  <li>Wizard</li>
  <li>Druid</li>
  <li>Bard</li>
  <li>Cleric</li>
</ul>
<p>These classes reward creativity and planning.</p>

<h2>What This Ranking Gets Right About D&amp;D Classes</h2>
<p>A good ranking should not just say which classes are strongest. It should explain why some classes feel better over time.</p>

<p>That is why the top of this list is full of classes like Wizard, Cleric, and Paladin. They do not just win in one area. They keep showing value in combat, support, utility, and real campaign play.</p>

<p>At the same time, lower-ranked classes like Barbarian and Monk are not bad in a useless sense. They are simply more limited. They can still be great fun at the right table, but they usually rely more on taste than on broad mechanical strength.</p>

<p>That difference matters for SEO readers too, because people searching best D&amp;D classes, D&amp;D classes ranked, or strongest D&amp;D class usually want an answer that balances theory with actual play.</p>

<h2>Final Verdict: Which D&amp;D Class Should You Pick?</h2>
<p>If you want the strongest overall class, pick Wizard.</p>
<p>If you want a class that is powerful, reliable, and useful in almost every party, pick Cleric.</p>
<p>If you want the best balance between strength, simplicity, and fun, pick Paladin.</p>
<p>And if you are completely new and just want a safe first choice, pick Fighter.</p>

<p>That is the biggest takeaway from this <strong>dnd classes ranked</strong> guide: the best class is not always the one with the highest ceiling. It is the one that gives you the best experience over a full campaign.</p>

<p>In other words:</p>
<ul>
  <li>Wizard is the smartest top-tier pick.</li>
  <li>Cleric is the most reliable top-tier pick.</li>
  <li>Paladin is the best all-around pick.</li>
  <li>Fighter is the best beginner pick.</li>
</ul>

<p>That makes this ranking more useful than a pure theorycraft tier list, because it helps real players choose a class they will actually enjoy.</p>

<h2>Watch a Quick Video Recap</h2>
<p>If you want a more conversational follow-up after reading, this video is a natural next step. It covers the same "which D&amp;D class actually feels best to play" question from a faster angle. You can watch it directly on <a href="https://www.youtube.com/watch?v=K2Qs8q2JBRY" target="_blank" rel="noreferrer">YouTube here</a>, or use the embedded version below.</p>

<iframe
  class="inline-embed inline-embed--video"
  src="https://www.youtube.com/embed/K2Qs8q2JBRY"
  title="DnD classes ranked video recap"
  loading="lazy"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen
></iframe>
`;

const dndClassesRankedArticleHtmlZh = String.raw`
<p>如果你在搜索 <strong>DND 职业排名</strong>，你真正想知道的往往只有一件事：在《龙与地下城》里，到底哪个职业最值得玩？</p>

<p>问题在于，大多数职业榜单不是太复杂，就是太看个人口味。有些只盯着纸面强度，有些只在乎角色风格，还有些忽略了一个很现实的事实：一个职业理论上很强，不代表它在真实桌面上就一定玩得舒服。</p>

<p>所以这篇文章用的是一套更实用的判断标准。</p>

<p>这份 <strong>D&amp;D 职业排名</strong> 主要看四个维度：</p>

<ul>
  <li><strong>强度：</strong>这个职业在战斗和解场时到底有多有效。</li>
  <li><strong>泛用性：</strong>面对不同队伍配置和场景时，它是不是都能发挥作用。</li>
  <li><strong>上手难度：</strong>新手和轻度玩家玩起来是否顺手。</li>
  <li><strong>实际乐趣：</strong>这个职业在真正跑团时到底爽不爽。</li>
</ul>

<p>所以这不是一份“谁伤害最高谁就赢”的清单，而是一份更接近真实战役体验的职业排序。</p>

<h2>DND 职业排名总览</h2>
<p>如果你想先看短结论，可以直接看这里。</p>

<h3>S 级</h3>
<ul>
  <li>法师 Wizard</li>
  <li>牧师 Cleric</li>
  <li>圣武士 Paladin</li>
</ul>

<h3>A 级</h3>
<ul>
  <li>吟游诗人 Bard</li>
  <li>战士 Fighter</li>
  <li>德鲁伊 Druid</li>
  <li>契术师 Warlock</li>
</ul>

<h3>B 级</h3>
<ul>
  <li>游荡者 Rogue</li>
  <li>术士 Sorcerer</li>
  <li>游侠 Ranger</li>
</ul>

<h3>C 级</h3>
<ul>
  <li>野蛮人 Barbarian</li>
  <li>武僧 Monk</li>
</ul>

<p>这份排序面向的是一般 D&amp;D 战役体验，尤其适合那些在比较“最强 D&amp;D 职业”“最适合新手的 D&amp;D 职业”以及“综合体验最好的 D&amp;D 职业”的玩家。</p>

<h2>这份 DND 职业排名是怎么排出来的</h2>
<p>在进入完整排名之前，先把判断逻辑讲清楚会更有帮助。</p>

<p>一个职业在这里能排得更高，通常是因为它至少满足了下面的一条或几条：</p>
<ul>
  <li>有能力靠关键技能或法术扛起整个遭遇。</li>
  <li>在不同队伍配置里都能持续保持价值。</li>
  <li>战斗内外都能贡献，而不是只会做一件事。</li>
  <li>不会因为新手犯一点小错就立刻变得难玩。</li>
</ul>

<p>而排得更低的职业，通常会有以下一种或多种问题：</p>
<ul>
  <li>功能太窄，只擅长单一场景。</li>
  <li>太依赖完美环境才能发挥。</li>
  <li>和相近定位的职业相比回报偏低。</li>
  <li>操作成本偏高，但收益并没有高到值得。</li>
</ul>

<p>也就是说，这份排名不是只看一次性团本，也不是只看满级理论构筑，而是围绕“普通玩家在正常战役里真正会觉得好用、好玩、好带队”的标准来排。</p>

<h2>1. 法师 Wizard</h2>
<p>几乎所有严肃一点的 <strong>DND 职业排名</strong> 讨论里，法师最后都会靠近榜首。原因很简单，没有哪个职业能真正匹配它的整体法术灵活度。</p>

<h3>为什么法师是 S 级</h3>
<p>法师是全游戏最像“工具箱”的职业。它可以打伤害、控场、保护队友、侦查信息、脱离危险，还能靠正确的法术准备改变整场遭遇的走向。</p>
<p>更重要的是，法师会随着玩家理解变强。你越懂规则、越懂法术、越懂战斗节奏，法师的上限就越夸张。</p>

<h3>法师最强的地方</h3>
<ul>
  <li>控场能力。</li>
  <li>功能性法术。</li>
  <li>解题能力。</li>
  <li>后期强度上限。</li>
</ul>

<h3>法师容易吃亏的地方</h3>
<ul>
  <li>对新手不算友好。</li>
  <li>法术选择影响很大。</li>
  <li>前期可能偏脆。</li>
</ul>

<p><strong>结论：</strong>法师排第一，核心原因就是“泛用性胜过一切”。它也许不是最容易玩的职业，但玩得好时，往往就是 D&amp;D 里综合最强的职业。</p>

<h2>2. 牧师 Cleric</h2>
<p>牧师是游戏里最完整的职业之一。很多新手会以为牧师只是“奶妈”，这其实大大低估了它。</p>

<h3>为什么牧师是 S 级</h3>
<p>牧师强在几乎所有核心维度都不差。它能支援、能治疗、前排生存能力也比很多施法者更稳，同时还能打出真正有分量的伤害和控制。</p>
<p>一个优秀的牧师在几乎每个团里都不会没事做，这种稳定性本身就是巨大优势。</p>

<h3>牧师最强的地方</h3>
<ul>
  <li>治疗与支援。</li>
  <li>防御能力稳定。</li>
  <li>施法可靠。</li>
  <li>几乎任何队伍都吃它的价值。</li>
</ul>

<h3>牧师容易吃亏的地方</h3>
<ul>
  <li>某些构筑看起来没有法师那么“华丽”。</li>
  <li>如果队伍把你固定成纯治疗，会让玩法显得窄一点。</li>
</ul>

<p><strong>结论：</strong>牧师是任何 D&amp;D 5e 职业榜里都很稳的顶级选择，因为它把强度、可靠性和灵活度结合得非常完整。</p>

<h2>3. 圣武士 Paladin</h2>
<p>如果你想找一个同时兼顾强度、简单和英雄感的职业，圣武士非常难被超过。</p>

<h3>为什么圣武士是 S 级</h3>
<p>圣武士的强大在于它把玩家最在意的那些东西都给到了你。够硬、爆发高、还能支援队友，而且不会像纯施法职业那样一开始就让人手忙脚乱。</p>
<p>这也让它成为少数能同时打动新手和老玩家的职业。</p>

<h3>圣武士最强的地方</h3>
<ul>
  <li>前排硬度。</li>
  <li>高爆发回合。</li>
  <li>简单但回报高的操作体验。</li>
  <li>优秀的团队支援。</li>
</ul>

<h3>圣武士容易吃亏的地方</h3>
<ul>
  <li>远程适应性一般。</li>
  <li>面对极端特殊场景时，不如全施法职业灵活。</li>
</ul>

<p><strong>结论：</strong>圣武士也许就是 D&amp;D 里最强的全能型职业。如果有人问“既适合新手、又足够强、还玩起来很爽的职业是什么”，圣武士一定是最强答案之一。</p>

<h2>4. 吟游诗人 Bard</h2>
<p>吟游诗人是 D&amp;D 里最全面、也最容易被低估的职业之一。它看起来可能不够夸张，但在真实战役里经常持续证明自己。</p>

<h3>为什么吟游诗人是 A 级</h3>
<p>吟游诗人最大的价值在于，它会让整个队伍一起变强。它擅长社交、支援、控场和功能性施法，经常是那个“默默把全队状态托起来”的角色。</p>
<p>而且它本身的扮演张力也非常强，这一点比很多榜单愿意承认的重要得多。</p>

<h3>吟游诗人最强的地方</h3>
<ul>
  <li>社交场景。</li>
  <li>支援与功能性。</li>
  <li>灵活施法。</li>
  <li>重扮演战役里的高价值。</li>
</ul>

<h3>吟游诗人容易吃亏的地方</h3>
<ul>
  <li>如果你只想看爆发伤害，它不会显得特别直观。</li>
  <li>新手有时不容易第一时间看懂它的价值。</li>
</ul>

<p><strong>结论：</strong>吟游诗人不一定是最炸裂的职业，但它几乎肯定是最聪明、最通用、也最能在长战役里不断发光的选择之一。</p>

<h2>5. 战士 Fighter</h2>
<p>战士能排这么高，是因为“简单”从来不等于“弱”。</p>

<h3>为什么战士是 A 级</h3>
<p>战士稳定、有效，而且极易理解。它能给玩家一个非常扎实的基础，而不会一上来就被复杂机制压住。这让它成为很多人进入 D&amp;D 的最佳入口。</p>
<p>同时，战士的成长也比很多人以为的更好。稳定输出和清晰回合，在长期战役里非常有价值。</p>

<h3>战士最强的地方</h3>
<ul>
  <li>新手友好。</li>
  <li>武器伤害稳定。</li>
  <li>生存能力不错。</li>
  <li>构筑路径清晰。</li>
</ul>

<h3>战士容易吃亏的地方</h3>
<ul>
  <li>战斗外工具不如顶级施法者多。</li>
  <li>如果你想要很花哨的职业幻想，它可能会显得朴素。</li>
</ul>

<p><strong>结论：</strong>如果你只想找一个“最容易上手的 D&amp;D 职业”，战士依然是最稳的推荐之一。它能排这么高，是因为它把自己的工作完成得非常彻底。</p>

<h2>6. 德鲁伊 Druid</h2>
<p>德鲁伊强、灵活，而且通常比看上去复杂得多。</p>

<h3>为什么德鲁伊是 A 级</h3>
<p>德鲁伊拥有游戏里最宽的工具带之一。它能支援、控场、侦查，也能应对很多非常规场景。用得好时，它的灵活度几乎能逼近法师。</p>
<p>它没能排得更高，原因也很直接：不是每个玩家都喜欢同时处理这么多选择。</p>

<h3>德鲁伊最强的地方</h3>
<ul>
  <li>功能性与支援。</li>
  <li>控场法术。</li>
  <li>探索价值。</li>
  <li>玩法适应性强。</li>
</ul>

<h3>德鲁伊容易吃亏的地方</h3>
<ul>
  <li>上手曲线偏高。</li>
  <li>对第一次跑团的新玩家来说容易手忙脚乱。</li>
</ul>

<p><strong>结论：</strong>德鲁伊非常强，但它更适合喜欢复杂工具箱的玩家，而不是只想要最直观上手体验的人。</p>

<h2>7. 契术师 Warlock</h2>
<p>契术师是游戏里辨识度最高的职业之一，无论从机制还是剧情风格来看都是如此。</p>

<h3>为什么契术师是 A 级</h3>
<p>契术师能排进 A 级，是因为它把风格、定制空间和稳定表现结合得很好。它的职业身份很鲜明，玩起来很有味道，同时又不像纯法师那样容易把新手淹没在大量选项里。</p>
<p>更重要的是，它在所有施法职业里都有一种“和别人完全不一样”的手感。</p>

<h3>契术师最强的地方</h3>
<ul>
  <li>职业幻想鲜明。</li>
  <li>稳定输出循环。</li>
  <li>定制空间大。</li>
  <li>剧情钩子天然丰富。</li>
</ul>

<h3>契术师容易吃亏的地方</h3>
<ul>
  <li>法术位机制比较特别。</li>
  <li>如果你想要很多不同法术手感，它有时会显得重复。</li>
</ul>

<p><strong>结论：</strong>对于想要“有味道、有强度、但又不想承担法师完整复杂度”的玩家来说，契术师是 D&amp;D 里最有乐趣的职业之一。</p>

<h2>8. 游荡者 Rogue</h2>
<p>游荡者受欢迎是有原因的：它够酷、够灵活，也很容易让人产生“我真的很会玩”的感觉。</p>

<h3>为什么游荡者是 B 级</h3>
<p>游荡者在技能、潜行和机动方面都很优秀，在探索、调查和社交诡计比较多的战役里尤其好用。</p>
<p>它之所以落在 B 级，并不是因为弱，而是因为排在它前面的职业往往能在更多场景里提供更全面的价值。</p>

<h3>游荡者最强的地方</h3>
<ul>
  <li>潜行与侦察。</li>
  <li>技能检定。</li>
  <li>机动性。</li>
  <li>聪明、讲时机的战斗体验。</li>
</ul>

<h3>游荡者容易吃亏的地方</h3>
<ul>
  <li>条件不理想时表现会有些飘。</li>
  <li>综合硬实力不如顶级职业那么夸张。</li>
</ul>

<p><strong>结论：</strong>游荡者非常好玩，也常常是扮演层面的好选择，但在纯粹的综合强度上，通常还是略低于最强的几位。</p>

<h2>9. 术士 Sorcerer</h2>
<p>术士很强，但它也比看上去更挑玩家。</p>

<h3>为什么术士是 B 级</h3>
<p>术士有很高的施法爆发潜力，只要构筑得好，很多回合都会非常亮眼。但和法师相比，它的整体工具箱还是更窄。</p>
<p>而一旦排名标准看的是完整战役里的综合价值，而不是某几个特别精彩的瞬间，这种差距就会被放大。</p>

<h3>术士最强的地方</h3>
<ul>
  <li>高爆发施法。</li>
  <li>职业气质鲜明。</li>
  <li>专精型构筑回报高。</li>
</ul>

<h3>术士容易吃亏的地方</h3>
<ul>
  <li>整体选项比法师少。</li>
  <li>角色创建时更容易选到后期不舒服的搭配。</li>
</ul>

<p><strong>结论：</strong>术士是个好职业，但它比顶级施法职业更专精，也更不宽容，所以综合排名会落在 B 级。</p>

<h2>10. 游侠 Ranger</h2>
<p>游侠一直都是 D&amp;D 里争议最大的职业之一。</p>

<h3>为什么游侠是 B 级</h3>
<p>游侠并不是每个战役里都弱，但它的发挥往往更依赖战役类型、子职业强弱和玩家自己的创造力。条件对了时它会很好玩，条件不对时就很容易让人觉得“换个职业也能做同样的事”。</p>

<h3>游侠最强的地方</h3>
<ul>
  <li>弓系构筑。</li>
  <li>荒野主题。</li>
  <li>追踪与猎杀怪物的职业幻想。</li>
</ul>

<h3>游侠容易吃亏的地方</h3>
<ul>
  <li>在大多数环境里没有强到能明显压过替代职业。</li>
  <li>比较吃战役上下文。</li>
</ul>

<p><strong>结论：</strong>游侠能玩，也能很有乐趣，但当人们问“最强”“最泛用”的职业时，它通常不是第一反应。</p>

<h2>11. 野蛮人 Barbarian</h2>
<p>野蛮人是最容易理解、也最容易在正面战斗里打出爽感的职业之一。</p>

<h3>为什么野蛮人是 C 级</h3>
<p>野蛮人排名靠后，不是因为它不会打，而是因为它的功能太窄。它有一件事做得非常好，但其他很多职业能在保持不错战斗力的同时，提供更多桌面价值。</p>
<p>在短而硬的战斗战役里，野蛮人会非常爽；在更宽的长期战役里，它的短板就会逐渐变明显。</p>

<h3>野蛮人最强的地方</h3>
<ul>
  <li>玩法简单。</li>
  <li>耐打。</li>
  <li>正面近战压迫感强。</li>
</ul>

<h3>野蛮人容易吃亏的地方</h3>
<ul>
  <li>泛用性偏低。</li>
  <li>战斗外工具少。</li>
  <li>不如混合型职业灵活。</li>
</ul>

<p><strong>结论：</strong>野蛮人很好玩，也很适合新手，但在完整的 <strong>DND 职业排名</strong> 里，它通常会往后一些，因为它能解决的问题没有高阶职业那么多。</p>

<h2>12. 武僧 Monk</h2>
<p>武僧就是那种“看上去超酷，但真实体验常常不如想象中顺手”的职业。</p>

<h3>为什么武僧是 C 级</h3>
<p>武僧有速度、有风格，也有很鲜明的职业幻想，但它经常要求玩家投入更多精力，才能拿到别的职业更轻松就能拿到的结果。</p>
<p>这不是说武僧不能玩，而是说如果你要给大多数玩家做推荐，它往往不是最划算的那个选择。</p>

<h3>武僧最强的地方</h3>
<ul>
  <li>机动性。</li>
  <li>武术幻想。</li>
  <li>玩法辨识度很高。</li>
</ul>

<h3>武僧容易吃亏的地方</h3>
<ul>
  <li>容错率偏低。</li>
  <li>经常显得不如顶级职业高效。</li>
  <li>投入和回报不一定成正比。</li>
</ul>

<p><strong>结论：</strong>武僧依然很酷，但如果是按综合实用性来排，它通常都会落在榜单靠后的位置。</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_CLASSES_RANKED_PARTY_IMAGE_PATH}"
    alt="一支由不同职业原型组成的龙与地下城冒险小队站在拱门前"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
  />
</figure>

<h2>按玩家类型推荐的 D&amp;D 职业</h2>
<p>很多排名文章的问题在于，它们只给你一个榜单，却没有告诉你“什么样的玩家更适合什么职业”。这显然不够，因为最好的职业，往往取决于你最想要的体验。</p>

<h3>最适合新手的 D&amp;D 职业</h3>
<p>如果你是第一次接触 D&amp;D，最推荐从下面这些职业开始：</p>
<ul>
  <li>战士 Fighter</li>
  <li>圣武士 Paladin</li>
  <li>牧师 Cleric</li>
  <li>野蛮人 Barbarian</li>
</ul>
<p>这些职业的共同点是：容易理解，而且强度足够高，不会让你觉得自己“选错了”。</p>

<h3>最适合追求强度的 D&amp;D 职业</h3>
<p>如果你最在意的是强度和存在感，那么优先看这些：</p>
<ul>
  <li>法师 Wizard</li>
  <li>牧师 Cleric</li>
  <li>圣武士 Paladin</li>
</ul>
<p>它们都有非常扎实的机制强度，也都能在长期战役里持续有价值。</p>

<h3>最适合重扮演玩家的 D&amp;D 职业</h3>
<p>如果你最看重故事、性格和表演空间，可以先看：</p>
<ul>
  <li>吟游诗人 Bard</li>
  <li>契术师 Warlock</li>
  <li>游荡者 Rogue</li>
  <li>圣武士 Paladin</li>
</ul>
<p>这些职业天生就容易带出鲜明的人设和剧情冲突。</p>

<h3>最适合喜欢很多选项的玩家</h3>
<p>如果你喜欢一边玩一边想“我还能不能换个办法解决问题”，那就优先考虑：</p>
<ul>
  <li>法师 Wizard</li>
  <li>德鲁伊 Druid</li>
  <li>吟游诗人 Bard</li>
  <li>牧师 Cleric</li>
</ul>
<p>这些职业都会奖励创造力和提前规划。</p>

<h2>这份排名真正说对了什么</h2>
<p>一份好的职业排名，不应该只告诉你谁伤害高，而应该告诉你为什么某些职业在长期游玩里更耐打、更稳定、更容易让玩家持续获得成就感。</p>

<p>这也是为什么榜单最前面的，通常会是法师、牧师和圣武士。它们不是只在某一个点上赢，而是在战斗、支援、功能性和真实战役体验里都持续展现优势。</p>

<p>而像野蛮人和武僧这种排得更后的职业，也不是“废”。它们只是限制更明显，更吃玩家口味或具体环境，而不是那种放进大多数队伍里都能稳定强势的职业。</p>

<p>这对搜索 best D&amp;D classes、D&amp;D classes ranked 或 strongest D&amp;D class 的玩家也很重要，因为大多数人真正想要的不是一个只停留在纸面的答案，而是一个在实际桌面上也成立的结论。</p>

<h2>最终结论：你该选哪个 D&amp;D 职业？</h2>
<p>如果你想要综合强度最高的职业，选法师。</p>
<p>如果你想要一个几乎任何队伍里都稳、强、好用的职业，选牧师。</p>
<p>如果你想要强度、简单和乐趣之间最平衡的答案，选圣武士。</p>
<p>如果你是彻底的新手，只想先选一个不容易踩坑的职业，那就选战士。</p>

<p>这份 <strong>DND 职业排名</strong> 最大的结论其实是：最好的职业不一定是上限最高的那个，而是那个能让你在完整战役里持续玩得舒服、持续有存在感、持续觉得“我这个角色真好玩”的职业。</p>

<p>换句话说：</p>
<ul>
  <li>法师是最聪明的顶级选择。</li>
  <li>牧师是最稳的顶级选择。</li>
  <li>圣武士是最全能的选择。</li>
  <li>战士是最适合新手起步的选择。</li>
</ul>

<p>这也是为什么这份排名比纯理论榜单更有用，因为它更接近真实玩家在长期战役里的体验，而不是只看纸面最优解。</p>

<h2>看一段视频快速回顾</h2>
<p>如果你读完之后还想用更轻松、更口语化的方式再回顾一遍，这段视频很适合作为收尾补充。它讨论的也是“哪个 D&amp;D 职业玩起来最舒服、最值得选”这个问题。你可以直接在 <a href="https://www.youtube.com/watch?v=K2Qs8q2JBRY" target="_blank" rel="noreferrer">YouTube 查看</a>，也可以直接看下面的嵌入版本。</p>

<iframe
  class="inline-embed inline-embed--video"
  src="https://www.youtube.com/embed/K2Qs8q2JBRY"
  title="DND 职业排名视频回顾"
  loading="lazy"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen
></iframe>
`;

const dndArmorArticleHtml = String.raw`
<p>Choosing the right <strong>DND armor</strong> might be the single biggest factor in whether your character survives a dungeon crawl or drops in the first round of combat. Armor Class determines how hard you are to hit, and in D&amp;D 5e, every point of AC matters more than most new players realize.</p>

<p>This guide covers every type of <strong>DND armor</strong> available in the 5th Edition rules. Instead of copying the Player's Handbook word for word, it focuses on what each armor option actually means for your character at the table &mdash; the real AC numbers, the tradeoffs, and which classes should wear what.</p>

<h2>What Is Armor Class in DND?</h2>
<p><strong>Armor Class (AC)</strong> is the number an attacker needs to meet or beat on their attack roll to hit you. The higher your AC, the harder you are to hit. Without any armor at all, your base AC is <strong>10 + your Dexterity modifier</strong>.</p>

<p>That formula is the starting point for everything. When you put on <strong>DND armor</strong>, it replaces or modifies that base calculation. Some armor types let you add your full Dexterity bonus, others cap it, and heavy armor ignores Dexterity entirely.</p>

<p>As the video by <em>How It's Played</em> explains clearly, a common beginner mistake is thinking that armor proficiency adds to your AC. <strong>It does not.</strong> Proficiency only means you can wear the armor without suffering penalties to attack rolls, ability checks, saving throws, and spellcasting. The AC number on the armor is what you get regardless of proficiency.</p>

<h2>DND Armor Table: Every Armor Type at a Glance</h2>
<p>If you want the short version, here is the full <strong>DND 5e armor</strong> table with every option and its real AC value.</p>

<h3>Light Armor</h3>
<table>
  <thead>
    <tr><th>Armor</th><th>AC</th><th>Stealth</th><th>Weight</th><th>Cost</th></tr>
  </thead>
  <tbody>
    <tr><td>Padded</td><td>11 + Dex</td><td>Disadvantage</td><td>8 lb</td><td>5 gp</td></tr>
    <tr><td>Leather</td><td>11 + Dex</td><td>&mdash;</td><td>10 lb</td><td>10 gp</td></tr>
    <tr><td>Studded Leather</td><td>12 + Dex</td><td>&mdash;</td><td>13 lb</td><td>45 gp</td></tr>
  </tbody>
</table>

<h3>Medium Armor</h3>
<table>
  <thead>
    <tr><th>Armor</th><th>AC</th><th>Stealth</th><th>Weight</th><th>Cost</th></tr>
  </thead>
  <tbody>
    <tr><td>Hide</td><td>12 + Dex (max 2)</td><td>&mdash;</td><td>12 lb</td><td>10 gp</td></tr>
    <tr><td>Chain Shirt</td><td>13 + Dex (max 2)</td><td>&mdash;</td><td>20 lb</td><td>50 gp</td></tr>
    <tr><td>Scale Mail</td><td>14 + Dex (max 2)</td><td>Disadvantage</td><td>45 lb</td><td>50 gp</td></tr>
    <tr><td>Breastplate</td><td>14 + Dex (max 2)</td><td>&mdash;</td><td>20 lb</td><td>400 gp</td></tr>
    <tr><td>Half Plate</td><td>15 + Dex (max 2)</td><td>Disadvantage</td><td>40 lb</td><td>750 gp</td></tr>
  </tbody>
</table>

<h3>Heavy Armor</h3>
<table>
  <thead>
    <tr><th>Armor</th><th>AC</th><th>Stealth</th><th>Str Req</th><th>Weight</th><th>Cost</th></tr>
  </thead>
  <tbody>
    <tr><td>Ring Mail</td><td>14</td><td>Disadvantage</td><td>&mdash;</td><td>40 lb</td><td>30 gp</td></tr>
    <tr><td>Chain Mail</td><td>16</td><td>Disadvantage</td><td>Str 13</td><td>55 lb</td><td>75 gp</td></tr>
    <tr><td>Splint</td><td>17</td><td>Disadvantage</td><td>Str 15</td><td>60 lb</td><td>200 gp</td></tr>
    <tr><td>Plate</td><td>18</td><td>Disadvantage</td><td>Str 15</td><td>65 lb</td><td>1,500 gp</td></tr>
  </tbody>
</table>

<h3>Shields</h3>
<p>A <strong>shield</strong> adds +2 AC on top of whatever armor you are wearing. It costs 10 gp, weighs 6 lb, and requires one free hand. Any class proficient with shields can use one.</p>

<h2>Light Armor in DND: Best for Dex-Based Characters</h2>
<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_ARMOR_TYPES_IMAGE_PATH}"
    alt="Three types of DND armor displayed on stands in a medieval armory: leather, scale mail, and full plate"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
  />
</figure>
<p><strong>DND light armor</strong> is designed for characters who rely on Dexterity. You add your full Dex modifier to the base AC, which means a Rogue with 20 Dexterity wearing studded leather hits <strong>AC 17</strong> with no shield &mdash; that is solid protection without any stealth penalty.</p>

<p>In my experience running and playing D&amp;D for years, <strong>studded leather is the only light armor that matters long-term.</strong> Padded armor imposes stealth disadvantage for no extra benefit over regular leather, so it is essentially a trap option. Regular leather works fine at level 1 but gets replaced fast.</p>

<ul>
  <li><strong>Best for:</strong> Rogues, Rangers, Bards, Warlocks, Monks (though Monks usually prefer Unarmored Defense).</li>
  <li><strong>Why it works:</strong> no stealth penalty on studded leather, full Dex bonus, and light enough to not slow you down.</li>
  <li><strong>Max realistic AC:</strong> 17 (studded leather + 5 Dex) or 19 with a shield if your class allows it.</li>
</ul>

<h2>Medium Armor in DND: The Versatile Middle Ground</h2>
<p>Medium armor caps your Dexterity bonus at +2, but it provides higher base AC than light options. If your Dex modifier is +2 or lower, medium armor almost always gives you better protection than light armor.</p>

<p>The standout choices here are <strong>breastplate</strong> and <strong>half plate</strong>. Breastplate gives you AC 16 (with +2 Dex) and no stealth disadvantage &mdash; that is the sweet spot for characters who need decent defense without being loud. Half plate pushes to AC 17 but comes with stealth disadvantage.</p>

<ul>
  <li><strong>Best for:</strong> Druids, Rangers, Clerics (some domains), Barbarians (when not using Unarmored Defense), and multiclass builds.</li>
  <li><strong>Pro tip:</strong> breastplate is often overlooked because half plate has higher AC, but if stealth matters at all in your campaign, breastplate is the smarter buy.</li>
  <li><strong>Max realistic AC:</strong> 17 (half plate + 2 Dex) or 19 with a shield.</li>
</ul>

<h2>Heavy Armor in DND: Maximum Protection, Zero Dexterity</h2>
<figure class="inline-figure inline-figure--square-crop">
  <img
    class="inline-figure__image inline-figure__image--square"
    src="${DND_ARMOR_HEAVY_IMAGE_PATH}"
    alt="A paladin in full plate armor holding a shield in a dark dungeon, representing heavy DND armor"
    width="960"
    height="960"
    loading="lazy"
    decoding="async"
  />
</figure>
<p><strong>Heavy armor</strong> ignores your Dexterity modifier completely. Your AC is just the flat number listed. That makes heavy armor perfect for characters who dump Dex and invest everything into Strength, Constitution, and their primary spellcasting stat.</p>

<p>Plate armor at <strong>AC 18</strong> is the highest base AC you can get from standard armor. Add a shield and you are sitting at <strong>AC 20</strong> before any magic items or spells. That is a frontline tank who is genuinely hard to hit.</p>

<p>The catch? <strong>Every heavy armor option imposes stealth disadvantage</strong>, and chain mail and above require a minimum Strength score. If your Strength is below the requirement, your speed drops by 10 feet. Based on our table experience, forgetting about the Strength requirement is one of the most common new-player mistakes with <strong>DND armor</strong>.</p>

<ul>
  <li><strong>Best for:</strong> Fighters, Paladins, and heavy-armor Clerics (Life, War, Forge domains).</li>
  <li><strong>Starting armor note:</strong> Fighters and Paladins typically start with chain mail (AC 16) at level 1. Plate armor at 1,500 gp is usually a mid-campaign purchase.</li>
  <li><strong>Max realistic AC:</strong> 20 (plate + shield) or higher with magic items like <em>+1 plate</em> or <em>Shield of Faith</em> spell.</li>
</ul>

<h2>How to Calculate Armor Class in DND 5e</h2>
<p>AC calculation confuses a lot of beginners because different armor types use different formulas. Here is the simple breakdown:</p>

<ul>
  <li><strong>No armor:</strong> 10 + Dex modifier.</li>
  <li><strong>Light armor:</strong> armor base AC + full Dex modifier.</li>
  <li><strong>Medium armor:</strong> armor base AC + Dex modifier (max +2).</li>
  <li><strong>Heavy armor:</strong> armor base AC only. Dex does not apply.</li>
</ul>

<p>One critical rule that the <em>How It's Played</em> video covers well: <strong>AC bonuses from different sources stack, but you cannot use two AC calculations at the same time.</strong> For example, you cannot wear armor and also use the Monk's Unarmored Defense &mdash; you pick one calculation. But you <em>can</em> add a shield bonus (+2) and a <em>Ring of Protection</em> (+1) on top of your chosen armor calculation.</p>

<h3>Common AC bonus sources</h3>
<ul>
  <li><strong>Shield:</strong> +2 AC.</li>
  <li><strong>Shield spell (Wizard/Sorcerer):</strong> +5 AC as a reaction until next turn.</li>
  <li><strong>Shield of Faith (Cleric/Paladin):</strong> +2 AC, concentration.</li>
  <li><strong>Cover:</strong> half cover +2, three-quarters cover +5.</li>
  <li><strong>Magic items:</strong> +1/+2/+3 armor, Ring of Protection, Cloak of Protection.</li>
</ul>

<h2>Which DND Armor Is Best for Each Class?</h2>
<p>Choosing armor is not just about the highest AC number. It is about matching your defenses to your class abilities, your Dexterity score, and how your character actually plays. Here is what I recommend based on years of table time:</p>

<table>
  <thead>
    <tr><th>Class</th><th>Best Armor</th><th>Notes</th></tr>
  </thead>
  <tbody>
    <tr><td>Fighter</td><td>Heavy + Shield</td><td>Chain mail at Lv1, upgrade to plate ASAP</td></tr>
    <tr><td>Paladin</td><td>Heavy + Shield</td><td>Same as Fighter; aura abilities reward front-line play</td></tr>
    <tr><td>Rogue</td><td>Studded Leather</td><td>Full Dex bonus, no stealth penalty &mdash; non-negotiable</td></tr>
    <tr><td>Ranger</td><td>Studded Leather / Breastplate</td><td>Depends on Dex; Str-based rangers use medium</td></tr>
    <tr><td>Barbarian</td><td>Unarmored Defense</td><td>10 + Dex + Con; chain shirt or breastplate early on</td></tr>
    <tr><td>Cleric</td><td>Heavy or Medium + Shield</td><td>Life / War / Forge = heavy; other domains = medium</td></tr>
    <tr><td>Druid</td><td>Medium + Shield (non-metal)</td><td>Hide armor or non-metal breastplate; ask your DM</td></tr>
    <tr><td>Wizard / Sorcerer</td><td><em>Mage Armor</em> spell</td><td>AC 13 + Dex; <em>Shield</em> spell for emergencies</td></tr>
    <tr><td>Bard</td><td>Studded Leather</td><td>Light armor only unless you multiclass</td></tr>
    <tr><td>Warlock</td><td>Light (or Medium for Hexblade)</td><td>Hexblade gets medium + shield proficiency</td></tr>
    <tr><td>Monk</td><td>No Armor</td><td>10 + Dex + Wis; wearing armor disables Monk features</td></tr>
  </tbody>
</table>

<h2>Mage Armor: The Caster's Alternative to Physical Armor</h2>
<p>Characters without armor proficiency are not defenseless. The <strong><a href="/blog/dnd-classes-explained">Wizard</a></strong> spell <em>Mage Armor</em> sets your base AC to <strong>13 + Dex modifier</strong> and lasts 8 hours without concentration. For a Wizard with 16 Dexterity, that is AC 16 &mdash; better than chain mail.</p>

<p>The tradeoff is that it uses a 1st-level spell slot every day. At low levels that hurts; at higher levels it becomes trivial. If you are playing a squishy caster, <em>Mage Armor</em> is essentially mandatory until you find magical alternatives.</p>

<h2>Common DND Armor Mistakes to Avoid</h2>
<p>After running dozens of campaigns, these are the armor mistakes I see most often:</p>

<ol>
  <li><strong>Thinking proficiency = AC bonus.</strong> It does not. Proficiency just means you avoid penalties.</li>
  <li><strong>Ignoring Strength requirements on heavy armor.</strong> If your Fighter has 12 Strength and wears splint (Str 15 required), you lose 10 feet of movement. That matters.</li>
  <li><strong>Stacking two AC calculations.</strong> You cannot use <em>Mage Armor</em> and then put on a chain shirt. Pick one base calculation.</li>
  <li><strong>Forgetting stealth disadvantage.</strong> Half plate and all heavy armors impose disadvantage on Stealth. If your party relies on sneaking, this affects everyone, not just you.</li>
  <li><strong>Sleeping in heavy armor.</strong> The optional rule in Xanathar's Guide says sleeping in medium or heavy armor means you only recover a quarter of your hit dice and no reduction in exhaustion. Many DMs enforce this.</li>
</ol>

<h2>FAQ About DND Armor</h2>
<h3>What is the best armor in DND 5e?</h3>
<p><strong>Plate armor (AC 18)</strong> is the best standard armor in DND 5e by raw AC value. Combined with a shield, it gives AC 20, which is the highest non-magical armor class available in the base rules.</p>

<h3>Can you wear DND armor without proficiency?</h3>
<p>Yes, you can physically put on any <strong>DND armor</strong>, but wearing armor you are not proficient with gives you disadvantage on all ability checks, saving throws, and attack rolls that use Strength or Dexterity, and you cannot cast spells. In practice, it makes the armor useless.</p>

<h3>Does Dexterity affect heavy armor AC?</h3>
<p>No. <strong>DND heavy armor</strong> uses a flat AC number that does not change with your Dexterity modifier. A Fighter with 8 Dex and a Fighter with 20 Dex have exactly the same AC in plate armor.</p>

<h3>What is the difference between light and medium armor in DND?</h3>
<p><strong>DND light armor</strong> lets you add your full Dexterity modifier to AC, while medium armor caps the Dex bonus at +2. Light armor is better when your Dex is high (+3 or above); medium armor is better when your Dex is moderate (+2 or below).</p>

<h3>Does a shield count as armor in DND?</h3>
<p>A shield is listed in the armor table and requires armor proficiency (shield proficiency specifically), but it is not "armor" for the purpose of features that say "while not wearing armor." It simply adds +2 to your AC on top of your current armor or unarmored calculation.</p>

<h2>Watch This Visual Breakdown of DND Armor and AC</h2>
<p>If you want a clear visual walkthrough of how <strong>DND armor</strong> and Armor Class actually work in play, this video from <em>How It's Played</em> does an excellent job of explaining the mechanics step by step. It covers AC calculation, how different armor types apply Dexterity, and how bonus sources like shields and spells stack.</p>

<iframe
  class="inline-embed inline-embed--video"
  src="https://www.youtube.com/embed/pKxuStjRTxo"
  title="DND armor and Armor Class explained video"
  loading="lazy"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen
></iframe>
`;

const dndArmorArticleHtmlZh = String.raw`
<p>在《龙与地下城》里，选对 <strong>DND 护甲</strong> 几乎决定了你的角色是能扛住一整场地城探险，还是在第一轮战斗就倒地。护甲等级（AC）代表敌人攻击你有多难命中，而在 D&amp;D 5e 里，每一点 AC 的价值比大多数新手以为的都重要得多。</p>

<p>这篇指南覆盖了第五版规则中每种 <strong>DND 护甲</strong> 类型。它不会照搬《玩家手册》原文，而是专注于每种护甲选项在真实桌面上到底意味着什么 &mdash; 实际 AC 数值、使用代价，以及哪些职业应该穿什么。</p>

<h2>什么是 DND 护甲等级（AC）？</h2>
<p><strong>护甲等级（Armor Class, AC）</strong> 是攻击者需要在攻击骰上达到或超过的数值才能命中你。AC 越高，你就越难被打中。在没有任何护甲的情况下，你的基础 AC 是 <strong>10 + 敏捷修正值</strong>。</p>

<p>这个公式是一切的起点。当你穿上 <strong>DND 护甲</strong> 后，它会替换或修改这个基础计算方式。有些护甲类型允许你加上全部敏捷加值，有些会封顶，而重甲则完全忽略敏捷。</p>

<p>就像 <em>How It's Played</em> 频道在视频中清楚解释的那样，新手最常犯的一个错误是以为护甲熟练度会增加 AC。<strong>不会。</strong> 熟练度只意味着你穿这件护甲时不会在攻击骰、属性检定、豁免骰和施法上受到惩罚。护甲上标注的 AC 数值就是你实际获得的 AC，无论你是否熟练。</p>

<h2>DND 护甲总表：所有护甲类型一览</h2>
<p>如果你想先看结论，这里是完整的 <strong>DND 5e 护甲</strong> 参考表。</p>

<h3>轻甲</h3>
<table>
  <thead>
    <tr><th>护甲</th><th>AC</th><th>隐匿</th><th>重量</th><th>价格</th></tr>
  </thead>
  <tbody>
    <tr><td>棉甲 Padded</td><td>11 + 敏捷</td><td>劣势</td><td>8 磅</td><td>5 gp</td></tr>
    <tr><td>皮甲 Leather</td><td>11 + 敏捷</td><td>&mdash;</td><td>10 磅</td><td>10 gp</td></tr>
    <tr><td>镶嵌皮甲 Studded Leather</td><td>12 + 敏捷</td><td>&mdash;</td><td>13 磅</td><td>45 gp</td></tr>
  </tbody>
</table>

<h3>中甲</h3>
<table>
  <thead>
    <tr><th>护甲</th><th>AC</th><th>隐匿</th><th>重量</th><th>价格</th></tr>
  </thead>
  <tbody>
    <tr><td>兽皮甲 Hide</td><td>12 + 敏捷 (上限 2)</td><td>&mdash;</td><td>12 磅</td><td>10 gp</td></tr>
    <tr><td>链甲衫 Chain Shirt</td><td>13 + 敏捷 (上限 2)</td><td>&mdash;</td><td>20 磅</td><td>50 gp</td></tr>
    <tr><td>鳞甲 Scale Mail</td><td>14 + 敏捷 (上限 2)</td><td>劣势</td><td>45 磅</td><td>50 gp</td></tr>
    <tr><td>胸甲 Breastplate</td><td>14 + 敏捷 (上限 2)</td><td>&mdash;</td><td>20 磅</td><td>400 gp</td></tr>
    <tr><td>半身板甲 Half Plate</td><td>15 + 敏捷 (上限 2)</td><td>劣势</td><td>40 磅</td><td>750 gp</td></tr>
  </tbody>
</table>

<h3>重甲</h3>
<table>
  <thead>
    <tr><th>护甲</th><th>AC</th><th>隐匿</th><th>力量需求</th><th>重量</th><th>价格</th></tr>
  </thead>
  <tbody>
    <tr><td>环甲 Ring Mail</td><td>14</td><td>劣势</td><td>&mdash;</td><td>40 磅</td><td>30 gp</td></tr>
    <tr><td>锁子甲 Chain Mail</td><td>16</td><td>劣势</td><td>力量 13</td><td>55 磅</td><td>75 gp</td></tr>
    <tr><td>夹板甲 Splint</td><td>17</td><td>劣势</td><td>力量 15</td><td>60 磅</td><td>200 gp</td></tr>
    <tr><td>全身板甲 Plate</td><td>18</td><td>劣势</td><td>力量 15</td><td>65 磅</td><td>1,500 gp</td></tr>
  </tbody>
</table>

<h3>盾牌</h3>
<p><strong>盾牌</strong> 在你当前穿戴的护甲基础上额外提供 +2 AC。价格 10 gp，重 6 磅，需要一只空闲的手。任何拥有盾牌熟练度的职业都可以使用。</p>

<h2>DND 轻甲：敏捷型角色的首选</h2>
<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_ARMOR_TYPES_IMAGE_PATH}"
    alt="中世纪军械库中展示的三种 DND 护甲：皮甲、鳞甲和全身板甲"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
  />
</figure>
<p><strong>DND 轻甲</strong> 是为依赖敏捷的角色设计的。你可以把完整的敏捷修正值加到基础 AC 上，所以一个敏捷 20 的游荡者穿镶嵌皮甲就能达到 <strong>AC 17</strong>，而且没有任何隐匿劣势 &mdash; 这个防御力相当扎实。</p>

<p>根据我跑团多年的经验，<strong>镶嵌皮甲是唯一一个长期有价值的轻甲选择。</strong> 棉甲会给隐匿带来劣势，却比普通皮甲没有额外收益，基本就是个坑。普通皮甲在 1 级还行，但很快就会被替换。</p>

<ul>
  <li><strong>最适合：</strong>游荡者、游侠、吟游诗人、契术师、武僧（不过武僧通常更倾向使用无甲防御）。</li>
  <li><strong>优势：</strong>镶嵌皮甲没有隐匿劣势，可以加全额敏捷加值，而且足够轻便。</li>
  <li><strong>最大实际 AC：</strong>17（镶嵌皮甲 + 5 敏捷），如果职业允许加盾牌则为 19。</li>
</ul>

<h2>DND 中甲：灵活的折中选择</h2>
<p>中甲将敏捷加值封顶为 +2，但基础 AC 比轻甲更高。如果你的敏捷修正值不超过 +2，那么中甲几乎总比轻甲更好。</p>

<p>中甲里最值得关注的是 <strong>胸甲</strong> 和 <strong>半身板甲</strong>。胸甲给你 AC 16（敏捷 +2 时）且不带隐匿劣势 &mdash; 这对需要一定防御力但不能太吵的角色来说是最佳平衡点。半身板甲能到 AC 17 但有隐匿劣势。</p>

<ul>
  <li><strong>最适合：</strong>德鲁伊、游侠、部分领域的牧师、野蛮人（未使用无甲防御时）和多职业角色。</li>
  <li><strong>实用建议：</strong>胸甲经常被忽视，因为半身板甲 AC 更高，但如果你的战役中隐匿很重要，胸甲才是更聪明的选择。</li>
  <li><strong>最大实际 AC：</strong>17（半身板甲 + 2 敏捷），加盾牌为 19。</li>
</ul>

<h2>DND 重甲：最高防护，不看敏捷</h2>
<figure class="inline-figure inline-figure--square-crop">
  <img
    class="inline-figure__image inline-figure__image--square"
    src="${DND_ARMOR_HEAVY_IMAGE_PATH}"
    alt="一名穿着全身板甲的圣武士在黑暗地城中持盾站立，代表 DND 重甲"
    width="960"
    height="960"
    loading="lazy"
    decoding="async"
  />
</figure>
<p><strong>重甲</strong> 完全忽略你的敏捷修正值。你的 AC 就是表上标注的固定数字。这让重甲非常适合那些放弃敏捷、把一切投入力量、体质和主施法属性的角色。</p>

<p>全身板甲 <strong>AC 18</strong> 是标准护甲中能获得的最高基础 AC。再加上一面盾牌，你就有了 <strong>AC 20</strong>，在没有任何魔法物品或法术加成的情况下。这就是一个真正难以被命中的前排坦克。</p>

<p>代价呢？<strong>所有重甲都有隐匿劣势</strong>，而且锁子甲及以上需要最低力量值。如果你的力量不够，移动速度会减少 10 尺。根据我们跑团的经验，忘记力量需求是新玩家在 <strong>DND 护甲</strong> 上最常犯的错误之一。</p>

<ul>
  <li><strong>最适合：</strong>战士、圣武士，以及重甲领域的牧师（生命、战争、锻造领域）。</li>
  <li><strong>起始护甲提示：</strong>战士和圣武士通常在 1 级时以锁子甲（AC 16）起步。全身板甲 1,500 gp 通常是战役中期的购置目标。</li>
  <li><strong>最大实际 AC：</strong>20（板甲 + 盾牌），有了 <em>+1 板甲</em> 或 <em>虔诚护盾</em> 法术还能更高。</li>
</ul>

<h2>DND 5e 护甲等级怎么算？</h2>
<p>AC 计算让很多新手困惑，因为不同类型的护甲使用不同的公式。下面是最简明的拆解：</p>

<ul>
  <li><strong>无护甲：</strong>10 + 敏捷修正值。</li>
  <li><strong>轻甲：</strong>护甲基础 AC + 完整敏捷修正值。</li>
  <li><strong>中甲：</strong>护甲基础 AC + 敏捷修正值（上限 +2）。</li>
  <li><strong>重甲：</strong>仅护甲基础 AC。敏捷不参与计算。</li>
</ul>

<p>视频中也重点讲了一条关键规则：<strong>不同来源的 AC 加值可以叠加，但你不能同时使用两种 AC 计算方式。</strong> 比如你不能穿着护甲的同时又用武僧的无甲防御 &mdash; 你只能选一种计算方式。但你<em>可以</em>在选定的护甲计算基础上叠加盾牌加值（+2）和<em>防护戒指</em>（+1）。</p>

<h3>常见 AC 加值来源</h3>
<ul>
  <li><strong>盾牌：</strong>+2 AC。</li>
  <li><strong>护盾术（法师/术士）：</strong>+5 AC，作为反应使用，持续到下一个回合。</li>
  <li><strong>虔诚护盾（牧师/圣武士）：</strong>+2 AC，需要专注。</li>
  <li><strong>掩体：</strong>半掩体 +2，四分之三掩体 +5。</li>
  <li><strong>魔法物品：</strong>+1/+2/+3 护甲、防护戒指、防护披风。</li>
</ul>

<h2>每个职业应该穿什么 DND 护甲？</h2>
<p>选护甲不仅仅是看哪个 AC 最高。它需要匹配你的职业能力、敏捷属性和实际打法。以下是我根据多年桌面经验的推荐：</p>

<table>
  <thead>
    <tr><th>职业</th><th>推荐护甲</th><th>补充说明</th></tr>
  </thead>
  <tbody>
    <tr><td><a href="/blog/dnd-classes-explained">战士</a></td><td>重甲 + 盾牌</td><td>1 级穿锁子甲，攒够钱立刻升级板甲</td></tr>
    <tr><td>圣武士</td><td>重甲 + 盾牌</td><td>和战士一样；光环能力需要你站前排</td></tr>
    <tr><td>游荡者</td><td>镶嵌皮甲</td><td>必须加全敏捷，不能承受隐匿劣势</td></tr>
    <tr><td>游侠</td><td>镶嵌皮甲 / 胸甲</td><td>取决于敏捷；力量型游侠适合中甲</td></tr>
    <tr><td>野蛮人</td><td>无甲防御</td><td>10 + 敏捷 + 体质；前期用链甲衫或胸甲过渡</td></tr>
    <tr><td>牧师</td><td>重甲或中甲 + 盾牌</td><td>生命 / 战争 / 锻造 = 重甲；其他领域 = 中甲</td></tr>
    <tr><td>德鲁伊</td><td>中甲 + 盾牌（非金属）</td><td>兽皮甲或非金属胸甲；问你的 DM</td></tr>
    <tr><td>法师 / 术士</td><td><em>法师护甲</em>法术</td><td>AC 13 + 敏捷；<em>护盾术</em>应急</td></tr>
    <tr><td>吟游诗人</td><td>镶嵌皮甲</td><td>轻甲，除非多职业</td></tr>
    <tr><td>契术师</td><td>轻甲（邪影可用中甲）</td><td>邪影术士可获得中甲 + 盾牌熟练度</td></tr>
    <tr><td>武僧</td><td>不穿护甲</td><td>10 + 敏捷 + 感知；穿护甲会禁用武僧能力</td></tr>
  </tbody>
</table>

<h2>法师护甲：施法者的物理护甲替代品</h2>
<p>没有护甲熟练度的角色并非毫无防御。<strong><a href="/blog/dnd-classes-explained">法师</a></strong>的<em>法师护甲</em>法术能将基础 AC 设为 <strong>13 + 敏捷修正值</strong>，持续 8 小时且不需要专注。一个敏捷 16 的法师用这个法术就有 AC 16 &mdash; 比锁子甲还高。</p>

<p>代价是它每天消耗一个 1 环法术位。低等级时这很心疼；高等级时就不值一提了。如果你玩的是脆皮施法者，<em>法师护甲</em>基本上是必修课，直到你找到魔法替代品。</p>

<h2>常见的 DND 护甲选择错误</h2>
<p>跑了几十场战役后，这些是我见过最多的护甲失误：</p>

<ol>
  <li><strong>以为熟练度 = AC 加值。</strong>不是的。熟练度只是让你避免惩罚。</li>
  <li><strong>忽略重甲的力量需求。</strong>如果你的战士只有 12 力量却穿了夹板甲（需要力量 15），你的移动速度会减少 10 尺。</li>
  <li><strong>叠加两种 AC 计算。</strong>你不能用<em>法师护甲</em>之后再穿链甲衫。只能选一种基础计算方式。</li>
  <li><strong>忘记隐匿劣势。</strong>半身板甲和所有重甲都有隐匿劣势。如果你的队伍需要偷袭潜入，这影响的是所有人。</li>
  <li><strong>穿着重甲睡觉。</strong>《赞纳萨万事指南》的可选规则说穿中甲或重甲睡觉时只恢复四分之一的生命骰且不减少力竭等级。很多 DM 会执行这条。</li>
</ol>

<h2>DND 护甲常见问题</h2>
<h3>DND 5e 中最好的护甲是什么？</h3>
<p><strong>全身板甲（AC 18）</strong>是 DND 5e 中纯 AC 数值最高的标准护甲。配合盾牌可以达到 AC 20，这是基础规则中不靠魔法能获得的最高护甲等级。</p>

<h3>没有熟练度可以穿 DND 护甲吗？</h3>
<p>可以物理上穿上任何 <strong>DND 护甲</strong>，但穿戴你没有熟练度的护甲会让你在所有使用力量或敏捷的属性检定、豁免骰和攻击骰上有劣势，而且你无法施法。实际上等于没穿。</p>

<h3>敏捷会影响重甲 AC 吗？</h3>
<p>不会。<strong>DND 重甲</strong> 使用固定的 AC 数值，不会因敏捷修正值变化。敏捷 8 的战士和敏捷 20 的战士穿板甲的 AC 完全一样。</p>

<h3>DND 轻甲和中甲有什么区别？</h3>
<p><strong>DND 轻甲</strong>允许加上完整的敏捷修正值，而中甲将敏捷加值封顶为 +2。敏捷修正值大于等于 +3 时轻甲更好；小于等于 +2 时中甲更好。</p>

<h3>盾牌算护甲吗？</h3>
<p>盾牌出现在护甲表中，需要盾牌熟练度，但对于那些注明"未穿戴护甲时"的能力来说，盾牌不算"护甲"。它只是在你当前的护甲或无甲 AC 基础上额外加 +2。</p>

<h2>观看 DND 护甲与 AC 机制的视频讲解</h2>
<p>如果你想更直观地理解 <strong>DND 护甲</strong> 和护甲等级在实际游戏中的运作方式，<em>How It's Played</em> 频道的这段视频把机制讲得非常清楚。它涵盖了 AC 计算、不同类型护甲如何应用敏捷加值，以及盾牌和法术等加值来源如何叠加。</p>

<iframe
  class="inline-embed inline-embed--video"
  src="https://www.youtube.com/embed/pKxuStjRTxo"
  title="DND 护甲与护甲等级机制详解视频"
  loading="lazy"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen
></iframe>
`;

const dndClassesArticle: BlogPost = {
  slug: 'dnd-classes-explained',
  title: 'DND Classes Explained: How to Choose the Right Class in Dungeons & Dragons',
  seoTitle: 'DND Classes Explained: Best Beginner-Friendly Classes in Dungeons & Dragons',
  metaDescription:
    'Discover all DND classes explained in simple terms. Learn the differences between Dungeons & Dragons classes, which class is best for beginners, and how to choose the right one for your playstyle.',
  excerpt:
    'Discover all DND classes explained in simple terms, compare beginner-friendly options, and learn how to pick the right class for your playstyle.',
  updatedAt: DND_CLASSES_UPDATED_AT,
  readTime: '11 min read',
  coverLabel: 'DND Classes',
  coverImage: DND_CLASSES_COVER_PATH,
  coverAlt: 'A Dungeons & Dragons party with different class archetypes exploring a dungeon',
  bodyHtml: dndClassesArticleHtml,
  relatedSlugs: ['dnd-classes-ranked', 'dnd-armor-guide'],
  featured: true,
};

const dndClassesArticleZh: BlogPost = {
  slug: 'dnd-classes-explained',
  title: 'DND 职业详解：如何在《龙与地下城》中选到适合你的职业',
  seoTitle: 'DND 职业详解：最适合新手的 Dungeons & Dragons 职业选择',
  metaDescription:
    '用简单直白的方式了解 DND 职业差异，看看哪些《龙与地下城》职业更适合新手，以及应该怎样根据自己的玩法偏好做选择。',
  excerpt:
    '从新手视角理解 DND 职业差异，快速判断哪些职业更容易上手，哪些职业更符合你的战斗风格与角色幻想。',
  updatedAt: DND_CLASSES_UPDATED_AT,
  readTime: '11 分钟阅读',
  coverLabel: 'DND 职业',
  coverImage: DND_CLASSES_COVER_PATH,
  coverAlt: '一支由不同职业构成的龙与地下城冒险小队正在地城中探索',
  bodyHtml: dndClassesArticleHtmlZh,
  relatedSlugs: ['dnd-classes-ranked', 'dnd-armor-guide'],
  featured: true,
};

const dndArmorArticle: BlogPost = {
  slug: 'dnd-armor-guide',
  title: 'DND Armor Guide: Every Armor Type, AC Values, and Best Picks by Class',
  seoTitle: 'DND Armor Guide: All Armor Types, AC Values & Class Picks in D&D 5e',
  metaDescription:
    'Complete DND armor guide with every armor type, AC values, and class recommendations. Compare light, medium, and heavy armor in D&D 5e and learn which option is best for your build.',
  excerpt:
    'A complete reference for every DND armor type in 5e. Compare AC values, stealth penalties, and class fit so you always pick the right armor for your character.',
  updatedAt: DND_ARMOR_UPDATED_AT,
  readTime: '13 min read',
  coverLabel: 'DND Armor',
  coverImage: DND_ARMOR_COVER_PATH,
  coverAlt: 'A hooded rogue in dark leather armor standing in a moonlit medieval city, representing DND armor choices',
  bodyHtml: dndArmorArticleHtml,
  relatedSlugs: ['dnd-classes-explained', 'dnd-classes-ranked'],
};

const dndArmorArticleZh: BlogPost = {
  slug: 'dnd-armor-guide',
  title: 'DND 护甲指南：所有护甲类型、AC 数值与职业推荐',
  seoTitle: 'DND 护甲指南：D&D 5e 全部护甲类型、AC 计算与最佳选择',
  metaDescription:
    '最完整的 DND 护甲参考指南，涵盖轻甲、中甲和重甲的 AC 数值、隐匿影响和适用职业，帮你为角色选出最合适的护甲。',
  excerpt:
    '一份覆盖 D&D 5e 所有护甲类型的完整参考。对比 AC 数值、隐匿代价和职业适配，让你每次都能选对护甲。',
  updatedAt: DND_ARMOR_UPDATED_AT,
  readTime: '13 分钟阅读',
  coverLabel: 'DND 护甲',
  coverImage: DND_ARMOR_COVER_PATH,
  coverAlt: '一名穿着深色皮甲的兔帽潜行者站在月光下的中世纪城市中，代表 DND 护甲选择',
  bodyHtml: dndArmorArticleHtmlZh,
  relatedSlugs: ['dnd-classes-explained', 'dnd-classes-ranked'],
};

const dndClassesRankedArticle: BlogPost = {
  slug: 'dnd-classes-ranked',
  title: 'DnD Classes Ranked: The Best D&D Classes for Beginners, Power, and Fun',
  seoTitle: 'DnD Classes Ranked: Best D&D Classes for Beginners, Power, and Fun',
  metaDescription:
    'Looking for a simple DnD classes ranked guide? Here is an easy-to-read ranking of all 12 D&D classes based on power, versatility, beginner-friendliness, and overall fun.',
  excerpt:
    'An easy-to-read ranking of all 12 D&D classes, focused on power, versatility, beginner-friendliness, and how satisfying each class feels in real campaigns.',
  updatedAt: DND_CLASSES_RANKED_UPDATED_AT,
  readTime: '12 min read',
  coverLabel: 'Tier List',
  coverImage: DND_CLASSES_RANKED_COVER_PATH,
  coverAlt: 'A Dungeons & Dragons adventuring party with a paladin, mage, and rogue framed as a tier-list article cover',
  bodyHtml: dndClassesRankedArticleHtml,
  relatedSlugs: ['dnd-classes-explained', 'dnd-armor-guide'],
};

const dndClassesRankedArticleZh: BlogPost = {
  slug: 'dnd-classes-ranked',
  title: 'DND 职业排名：最适合新手、强度和乐趣都在线的 D&D 职业',
  seoTitle: 'DND 职业排名：最适合新手、强度和乐趣兼顾的 D&D 职业推荐',
  metaDescription:
    '想看一份简单直接的 DND 职业排名？这篇文章会从强度、泛用性、上手难度和实际乐趣出发，对全部 12 个 D&D 职业做清晰排序。',
  excerpt:
    '从强度、泛用性、新手友好度和实际游玩乐趣出发，快速看懂 12 个 D&D 职业谁更值得选，谁更适合你的第一张卡。',
  updatedAt: DND_CLASSES_RANKED_UPDATED_AT,
  readTime: '12 分钟阅读',
  coverLabel: '职业排名',
  coverImage: DND_CLASSES_RANKED_COVER_PATH,
  coverAlt: '一支由圣武士、施法者和潜行者组成的龙与地下城小队，被用作职业排名文章封面',
  bodyHtml: dndClassesRankedArticleHtmlZh,
  relatedSlugs: ['dnd-classes-explained', 'dnd-armor-guide'],
};

const dndTokenGuideArticle: BlogPost = {
  slug: 'how-to-build-a-dnd-character-token',
  title: 'How to Turn a DND Character Portrait into a Clean Virtual Tabletop Token',
  seoTitle: 'How to Make a Clean DND Character Token for Roll20 or Foundry',
  metaDescription:
    'Learn how to crop a DND character portrait into a clean virtual tabletop token with better framing, readable silhouettes, and export settings that work in Roll20 and Foundry.',
  excerpt:
    'A practical walkthrough for cropping character portraits, keeping silhouettes readable, and exporting a token that still looks sharp on crowded virtual tabletops.',
  updatedAt: BLOG_TOKEN_GUIDE_UPDATED_AT,
  readTime: '6 min read',
  coverLabel: 'Token Guide',
  placeholder: true,
};

const dndTokenGuideArticleZh: BlogPost = {
  slug: 'how-to-build-a-dnd-character-token',
  title: '如何把 DND 角色立绘做成干净好用的虚拟桌面 Token',
  seoTitle: '如何为 Roll20 或 Foundry 制作清晰的 DND 角色 Token',
  metaDescription:
    '了解如何把 DND 角色立绘裁成适合 Roll20 和 Foundry 的虚拟桌面 Token，包括取景、主体辨识度和导出设置。',
  excerpt:
    '从裁切构图、主体辨识度到导出细节，这篇文章会带你把角色立绘处理成在虚拟桌面里也足够清晰的 Token。',
  updatedAt: BLOG_TOKEN_GUIDE_UPDATED_AT,
  readTime: '6 分钟阅读',
  coverLabel: 'Token 指南',
  placeholder: true,
};

const dndSmallPartyGuideArticle: BlogPost = {
  slug: 'best-dnd-classes-for-small-parties',
  title: 'Best DND Classes for Small Parties and One-Shot Groups',
  seoTitle: 'Best DND Classes for Small Parties, One-Shots, and Short Campaigns',
  metaDescription:
    'Compare the best DND classes for small parties, one-shot groups, and short campaigns so you can cover missing roles without overcomplicating your first session.',
  excerpt:
    'If your table only has a few players, class choice matters more. This guide will compare which options cover the most gaps in small-party D&D.',
  updatedAt: BLOG_SMALL_PARTY_GUIDE_UPDATED_AT,
  readTime: '5 min read',
  coverLabel: 'Small Party',
  placeholder: true,
};

const dndSmallPartyGuideArticleZh: BlogPost = {
  slug: 'best-dnd-classes-for-small-parties',
  title: '小队人数不多时，哪些 DND 职业更适合开团',
  seoTitle: '小队和短团环境下更适合的 DND 职业选择',
  metaDescription:
    '如果你的桌面人数不多，职业选择会更影响体验。这篇文章会比较小队、短团和单次团里更容易补位的 DND 职业。',
  excerpt:
    '当队伍人数偏少时，职业不只是风格问题，还关系到补位效率。这篇文章会帮你快速判断哪些 DND 职业更稳。',
  updatedAt: BLOG_SMALL_PARTY_GUIDE_UPDATED_AT,
  readTime: '5 分钟阅读',
  coverLabel: '小队开团',
  placeholder: true,
};

const dndConstitutionArticleHtmlZh = String.raw`
<p>在 D&amp;D 跑团中，<strong>dnd constitution</strong>（体质）代表了角色的生存底线和忍耐极限。无论是遭遇怪物的毒气喷吐、在危险水域憋气潜水，还是纯粹叠加生命上限，体质都发挥着绝对核心的作用。这篇指南将带你用最直观的方式，彻底搞懂体质如何影响你的生命池（HP）与专注判定。如果你正在规划新角色，本文能帮你避开“因为没点体质而被一刀击杀”的毁灭性误区。</p>

<figure class="inline-figure inline-figure--wide-crop">
  <img
    class="inline-figure__image inline-figure__image--wide"
    src="${DND_CONSTITUTION_COVER_PATH}"
    alt="矮人战士抵御毒气攻击的 DND Constitution 示意图"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
  />
  <figcaption>极度危险的环境下，高体质能保证角色存活。</figcaption>
</figure>

<h2>核心机制：Constitution DND 检定中到底影响什么？</h2>
<p>在建卡时，许多追求初级爆发伤害的新玩家会把点数全押在力量或智力上，留下可悲的 8 点体质。这不仅极度危险，而且拖累了医疗位队友。基于规则核心逻辑，下面这张属性收益表直观地展示了 <strong>constitution dnd</strong> 在抗压维度上的巨大差距：</p>

<table>
  <thead>
    <tr>
      <th>你的 Constitution 点数</th>
      <th>属性修正值 (Modifier)</th>
      <th>每次升级时的 HP 额外加成</th>
      <th>在恶劣环境中的生还表现</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>8 或 9</strong></td>
      <td>-1 (致命缺陷)</td>
      <td>HP 必定扣减 1 点</td>
      <td>极度虚弱（容易因负面状态进入绝境）</td>
    </tr>
    <tr>
      <td><strong>10 或 11</strong></td>
      <td>+0 (普通平民底线)</td>
      <td>无任何加成</td>
      <td>勉强合格</td>
    </tr>
    <tr>
      <td><strong>12 或 13</strong></td>
      <td>+1 (合格冒险者)</td>
      <td>+1 HP</td>
      <td>一般正常水平</td>
    </tr>
    <tr>
      <td><strong>14 或 15</strong></td>
      <td>+2 (标准施法者配置)</td>
      <td>+2 HP</td>
      <td>优秀稳健（强烈建议保底此数值）</td>
    </tr>
    <tr>
      <td><strong>16 及以上</strong></td>
      <td>+3 或更高</td>
      <td>+3 HP 封顶以上</td>
      <td>极其强悍（核心近战抗压位必满）</td>
    </tr>
  </tbody>
</table>

<p>当你需要长途跨越冰原、在水底脱困、或是对抗毒气，角色必须被动进行体质豁免检定。如果该判定失败，轻则进入“中毒”或“力竭”等严重损伤轮次，重则直接陷入倒地昏迷。这意味着体质修正值（Modifier）不仅仅是每一次级别跃升时强制附带加倍的安全血点基数，更是所有“非战斗高危场景”的刚需保命符。</p>

<div class="mt-8 rounded-[24px] border border-white/8 bg-black/20 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
  <div class="flex-1">
    <h3 class="text-lg font-medium text-stone-50 m-0 p-0" style="margin: 0;">🎯 实战工具推荐</h3>
    <p class="mt-2 text-sm leading-7 text-stone-300" style="margin-top: 0.5rem; margin-bottom: 0;">还在为了纯手算豁免结果而打乱跑团节奏？立即切换使用我们系统严密的 D&amp;D 线上掷骰器，一秒准确模拟带有体质修正计算的综合生存掷骰。</p>
  </div>
  <a href="/dice-roller-dnd" class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-[#f1d492] transition hover:border-[#d7b46a]/50 hover:bg-[#d7b46a]/10">
    打开 Dice Roller
  </a>
</div>

<h2>施法者生存必看：体质如何决定法术专注</h2>
<p>如果你切入的世界角色是法师、牧师或术士等拥有技能流分支的职业，Constitution 的重要优先级甚至可以与你的核心施法天赋并驱并重。实战记录中，曾经有只配给 10 点体质的法系角色，强行读条放出了改变战局的顶级群体法术，结果被地图边缘毒刺擦伤一滴残血，瞬间专注破裂技能失效，导致全盘崩坏。</p>

<ul>
  <li><strong>何为专注被动性判定</strong>：当你成功激活并处于维持带有“专注 (Concentration)”标签的强大控制法术时，一旦遭受突发伤害，为了确保该释放法术不被物理中断，你必须通过一次体质豁免检定来强稳心神（DC = 你所遭受单次攻击伤害数额的整整一半，且系统设定最低判定难度门槛不可低于固定的 10 点）。</li>
  <li><strong>强稳拉平生存下限</strong>：如果在建卡初期果断将体质属性强制锁定在充盈的 14（自带 +2 修正补偿值），你对抗前期小怪乱箭流打断的抗压存活率与法力续航几率会发生质的飞跃。</li>
  <li><strong>最佳专长额外防御</strong>：强烈推荐法系角色在面临获取额外被动专长节点时，第一优选拿下 <strong>“战地施法者 (War Caster)”</strong> 或 <strong>“坚如磐石 (Resilient - Constitution)”</strong>。高体质基础直接红利叠加这些防御性专长，能死死卡住核心控场技能的释放稳定性。</li>
</ul>

<h2>高体质加成：跑团种族搭配与流派实战推荐</h2>
<p>若要在开局阶段就彻底避免沦为战队底层“吸血漏勺”，聪明的做法是定向利用特定类别的初始天赋种族血脉来“白嫖”生命加成。以下建议都是能以最低代价极限拉满体质收益的优选项：</p>

<ul>
  <li><strong>矮人 (Dwarves)</strong>：先天基因即自带 +2 的 Constitution 高加成定底。其中“山地矮人”分类甚至天生骨骼强健兼备中型护甲熟练适应力，毫无疑问是当前最完美的新建肉盾底子。</li>
  <li><strong>野蛮人 (Barbarians)</strong>：整套 D&amp;D 模组中对体测数值吸收最透彻的近战物理职业。倚靠核心的“无甲防御 (Unarmored Defense)”体系算法，不仅最大化撑高了血线纵深，你的体质修正补偿甚至可以直接变现转化为实体绝对护甲面板（AC 减伤值）。此时高体质等同于“极厚血库与极度防弹双向叠加”。</li>
  <li><strong>半兽人 (Half-Orcs)</strong>：综合其并不低的原始三围底子，他们更依赖纯种族独占的超硬被动能力——面临致死贯穿级打击时能强行用肉体将其过滤，“锁住最后 1 滴保底生命”金刚不倒。这种置死地而后生的容错底牌配合原本就极其蛮横的骨架肉包，经常强扭逆境创造反杀生还局。</li>
</ul>

<section class="mt-12 rounded-[34px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
  <h2 class="font-display text-2xl sm:text-3xl text-stone-50" style="margin-top: 0;">常见问题解答 (FAQ)</h2>
  
  <div class="mt-6 space-y-4">
    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">What happens if my constitution is reduced in D&amp;D?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">当你的 Constitution 数据受到超自然诅咒或外力毒素被迫削减时，你的角色生命上限（HP 值底池）将即刻重置暴跌。极其极端的灾难后果是：如果该项体指标被高阶死灵系怪物的特性机制抽干、强压归结为 0 点底裤线，规则会直接宣判触发即死，系统直接没收挽救性质的死亡抢救（Death Saving Throws）流程权限。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">Does Constitution add to HP at level 1 in D&amp;D 5e?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">是的，你的角色刚刚涉足迈进最初的 1 级阶段门槛位时，你 Constitution 身上的点数修正值就已经在后台计算、并完全折算加合到了你的裸装备初始生命池体系中。尤且不止，之后经历所有的每一次升级阈值突破阶段，这同一份固定的修正分红将稳稳地兑现成红利血珠奖励，精准叠套在你不断攀升拔高的 HP 最大值之顶。</p>
    </article>

    <article class="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <h3 class="text-[1.15rem] font-medium text-stone-50" style="margin-top: 0;">What is Constitution in DND used for mainly?</h3>
      <p class="mt-3 max-w-3xl text-[0.95rem] leading-8 text-stone-300" style="margin-bottom: 0;">解构到整套纸笔桌面系统的基石上来看，Constitution （体质）主要是为了被用于决定该玩家能撑多大的绝对生命气血容量池（Max HP）；负责在突遭不明病毒感染、承受毒药浸透或陷入严寒酷暑侵袭时触发基础豁免活命保底；以及影响施法者人群战局的一环——当被围殴受创却非要卡点吟唱长效强力魔法时，它承担着能不能抗衡住伤痛、强制锁死法力集中度的底层验证性（Concentration Checks）把控门槛。</p>
    </article>
  </div>
</section>

<iframe
  class="inline-embed inline-embed--video"
  src="https://www.youtube.com/embed/WoV5iM7peOg"
  title="DND constitution rules and mechanics video"
  loading="lazy"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen
></iframe>
`;

const dndConstitutionArticle: BlogPost = {
  slug: 'dnd-constitution-guide',
  title: 'D&D Constitution Guide',
  excerpt: 'Learn exactly how constitution impacts your hit points, concentration saves, and what races benefit the most in D&D 5e.',
  updatedAt: DND_CONSTITUTION_UPDATED_AT,
  readTime: '6 min read',
  coverLabel: 'Mechanics',
  coverImage: DND_CONSTITUTION_COVER_PATH,
  bodyHtml: dndConstitutionArticleHtmlZh,
};

const dndConstitutionArticleZh: BlogPost = {
  slug: 'dnd-constitution-guide',
  title: 'D&D Constitution 指南：生命值与专注判定的核心机制',
  seoTitle: 'D&D Constitution 指南：生命值与法术专注判定的核心机制',
  metaDescription: '在 D&D 中，Constitution 决定了你的角色能活多久。本文提供 dnd constitution 的实战数据、法术专注机制解析与种族选择推荐，并内置工具辅助检定。',
  excerpt: '本文提供 dnd constitution 的实战数据、专注机制解析与种族推荐，帮你避开致命车卡误区。',
  updatedAt: DND_CONSTITUTION_UPDATED_AT,
  readTime: '6 分钟阅读',
  coverLabel: '跑团机制',
  coverImage: DND_CONSTITUTION_COVER_PATH,
  coverAlt: 'dnd constitution dwarf warrior resisting poison',
  bodyHtml: dndConstitutionArticleHtmlZh,
};

const postsByLocale: Record<SiteLocale, BlogPost[]> = {
  en: [dndClassesArticle, dndClassesRankedArticle, dndArmorArticle, dndTokenGuideArticle, dndSmallPartyGuideArticle, dndConstitutionArticle].map(
    addHeadingAnchors,
  ),
  zh: [dndClassesArticleZh, dndClassesRankedArticleZh, dndArmorArticleZh, dndTokenGuideArticleZh, dndSmallPartyGuideArticleZh, dndConstitutionArticleZh].map(
    addHeadingAnchors,
  ),
};

export function getBlogPosts(locale: SiteLocale) {
  return postsByLocale[locale].filter(isPublishedBlogPost);
}

export function getFeaturedBlogPost(locale: SiteLocale) {
  return getBlogPosts(locale).find((post) => post.featured) ?? getBlogPosts(locale)[0];
}

export function getBlogPost(locale: SiteLocale, slug: string) {
  return getBlogPosts(locale).find((post) => post.slug === slug);
}

function getBlogPostLanguageAlternates(slug: string) {
  const path = `/blog/${slug}`;
  const availableLocales = LOCALES.filter((locale) => Boolean(getBlogPost(locale, slug)));

  if (availableLocales.length === 0) {
    return getLanguageAlternates(path);
  }

  const alternates: Record<string, string> = {
    'x-default': getLocalizedPath(availableLocales.includes('en') ? 'en' : availableLocales[0], path),
  };

  for (const locale of availableLocales) {
    alternates[locale === 'zh' ? 'zh-CN' : 'en-US'] = getLocalizedPath(locale, path);
  }

  return alternates;
}

export function getRelatedBlogPosts(locale: SiteLocale, slug: string, limit = 3) {
  const currentPost = getBlogPost(locale, slug);

  if (!currentPost) {
    return [];
  }

  const candidatePosts = getBlogPosts(locale).filter((post) => post.slug !== slug);
  const explicitMatches = (currentPost.relatedSlugs ?? [])
    .map((relatedSlug) => candidatePosts.find((post) => post.slug === relatedSlug))
    .filter((post): post is BlogPost => Boolean(post));
  const fallbackMatches = candidatePosts
    .filter((post) => !explicitMatches.some((matchedPost) => matchedPost.slug === post.slug))
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));

  return [...explicitMatches, ...fallbackMatches].slice(0, limit);
}

export function getBlogPageCount(locale: SiteLocale) {
  const regularPosts = getBlogPosts(locale).filter((post) => !post.featured);
  return Math.max(1, Math.ceil(regularPosts.length / BLOG_POSTS_PER_PAGE));
}

export function getBlogPostsForPage(locale: SiteLocale, page: number) {
  const regularPosts = getBlogPosts(locale).filter((post) => !post.featured);
  const safePage = Math.max(1, page);
  const startIndex = (safePage - 1) * BLOG_POSTS_PER_PAGE;
  return regularPosts.slice(startIndex, startIndex + BLOG_POSTS_PER_PAGE);
}

export function getBlogPagePath(locale: SiteLocale, page: number) {
  const normalizedPage = Math.max(1, page);
  return getLocalizedPath(locale, normalizedPage === 1 ? '/blog' : `/blog/page/${normalizedPage}`);
}

export function getBlogPostPath(locale: SiteLocale, slug: string) {
  return getLocalizedPath(locale, `/blog/${slug}`);
}

export function formatBlogUpdatedAt(locale: SiteLocale, isoDate: string) {
  const formatter =
    locale === 'zh'
      ? new Intl.DateTimeFormat('zh-CN', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        })
      : new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });

  return formatter.format(new Date(isoDate));
}

export function createBlogHubMetadata(locale: SiteLocale, page = 1): Metadata {
  const siteConfig = getSiteConfig(locale);
  const path = page === 1 ? '/blog' : `/blog/page/${page}`;
  const localizedPath = getLocalizedPath(locale, path);
  const title =
    locale === 'zh'
      ? page === 1
        ? 'Token Maker 文章列表'
        : `Token Maker 文章列表 - 第 ${page} 页`
      : page === 1
        ? 'Token Maker Articles'
        : `Token Maker Articles - Page ${page}`;
  const description =
    locale === 'zh'
      ? '阅读 Token Maker 的桌面头像与 DND 相关文章，查看职业选择、角色头像处理和虚拟桌面使用建议。'
      : 'Read Token Maker articles about DND classes, tabletop portraits, and practical virtual tabletop workflows.';

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    alternates: {
      canonical: localizedPath,
      languages: getLanguageAlternates(path),
    },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: absoluteUrl(localizedPath),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteConfig.name}`,
      description,
    },
    robots: BLOG_PLACEHOLDER_MODE
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}

export function createBlogPostMetadata(locale: SiteLocale, slug: string): Metadata {
  const siteConfig = getSiteConfig(locale);
  const post = getBlogPost(locale, slug);

  if (!post) {
    return {
      title: locale === 'zh' ? '文章不存在' : 'Article not found',
    };
  }

  const path = `/blog/${slug}`;
  const localizedPath = getLocalizedPath(locale, path);
  const metadataTitle = post.seoTitle ?? post.title;
  const description = post.metaDescription ?? post.excerpt;
  const absoluteCoverImage = post.coverImage ? absoluteUrl(post.coverImage) : undefined;

  return {
    metadataBase: new URL(getSiteUrl()),
    title: metadataTitle,
    description,
    alternates: {
      canonical: localizedPath,
      languages: getBlogPostLanguageAlternates(slug),
    },
    openGraph: {
      title: `${metadataTitle} | ${siteConfig.name}`,
      description,
      url: absoluteUrl(localizedPath),
      type: 'article',
      publishedTime: post.updatedAt,
      modifiedTime: post.updatedAt,
      images: absoluteCoverImage
        ? [
            {
              url: absoluteCoverImage,
              alt: post.coverAlt ?? post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: absoluteCoverImage ? 'summary_large_image' : 'summary',
      title: `${metadataTitle} | ${siteConfig.name}`,
      description,
      images: absoluteCoverImage ? [absoluteCoverImage] : undefined,
    },
    robots: BLOG_PLACEHOLDER_MODE
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}

export function buildBlogHubStructuredData(locale: SiteLocale, page = 1) {
  const siteConfig = getSiteConfig(locale);
  const path = page === 1 ? '/blog' : `/blog/page/${page}`;
  const title = locale === 'zh' ? 'Token Maker 文章列表' : 'Token Maker Articles';

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    url: absoluteUrl(getLocalizedPath(locale, path)),
    description:
      locale === 'zh'
        ? 'Token Maker 博客文章列表，聚焦 DND 职业选择、头像处理和虚拟桌面实践。'
        : 'Token Maker blog archive covering DND classes, portrait prep, and practical VTT workflow advice.',
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: absoluteUrl(getLocalizedPath(locale, '/')),
    },
  };
}

export function buildBlogPostStructuredData(locale: SiteLocale, slug: string) {
  const post = getBlogPost(locale, slug);

  if (!post) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.seoTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt,
    dateModified: post.updatedAt,
    datePublished: post.updatedAt,
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
    url: absoluteUrl(getBlogPostPath(locale, slug)),
    image: post.coverImage ? [absoluteUrl(post.coverImage)] : undefined,
  };
}

export function getBlogPlaceholderCopy(locale: SiteLocale) {
  return placeholderCopyByLocale[locale];
}
