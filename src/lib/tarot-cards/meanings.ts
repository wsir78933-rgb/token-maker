import type { TarotCardMeaning } from './types';

export const TAROT_CARD_MEANINGS: Readonly<Record<string, TarotCardMeaning>> = {
  'major-00-fool': {
    upright: {
      en: 'fresh start; brave curiosity; open road; trust the first step',
      zh: '新起点；勇敢好奇；开放道路；迈出第一步',
    },
    reversed: {
      en: 'scattered impulse; avoidable risk; poor preparation; fear of beginning',
      zh: '冲动分散；可避免的风险；准备不足；害怕开始',
    },
  },
  'major-01-magician': {
    upright: {
      en: 'focused will; skill in motion; resourceful making; aligned intention',
      zh: '意志聚焦；技能运转；善用资源；意图一致',
    },
    reversed: {
      en: 'show without substance; divided attention; unused tools; manipulative charm',
      zh: '表象胜过实质；注意力分裂；工具闲置；操控式魅力',
    },
  },
  'major-02-high-priestess': {
    upright: {
      en: 'quiet knowing; hidden pattern; patient listening; inner threshold',
      zh: '安静的知觉；隐藏脉络；耐心聆听；内在门槛',
    },
    reversed: {
      en: 'ignored intuition; withheld truth; noisy uncertainty; forced disclosure',
      zh: '忽视直觉；真相被压住；嘈杂的不确定；强行揭露',
    },
  },
  'major-03-empress': {
    upright: {
      en: 'fertile imagination; generous care; embodied pleasure; creative abundance',
      zh: '丰饶想象；慷慨照料；身体感受；创意丰盛',
    },
    reversed: {
      en: 'depleted giving; smothering comfort; blocked growth; neglected needs',
      zh: '付出耗竭；令人窒息的安慰；成长受阻；需求被忽略',
    },
  },
  'major-04-emperor': {
    upright: {
      en: 'steady structure; clear authority; protective boundaries; strategic command',
      zh: '稳固结构；清晰权威；保护边界；策略指挥',
    },
    reversed: {
      en: 'rigid control; brittle pride; imposed order; fear of change',
      zh: '僵硬控制；脆弱自尊；强加秩序；害怕改变',
    },
  },
  'major-05-hierophant': {
    upright: {
      en: 'shared tradition; wise instruction; trusted ritual; belonging through values',
      zh: '共同传统；明智教导；受信任的仪式；价值带来的归属',
    },
    reversed: {
      en: 'stale doctrine; borrowed beliefs; rebellious learning; empty ceremony',
      zh: '陈旧教条；借来的信念；反叛式学习；空洞仪式',
    },
  },
  'major-06-lovers': {
    upright: {
      en: 'mutual choice; honest alignment; open-hearted bond; values in harmony',
      zh: '彼此选择；坦诚一致；敞开心扉的联结；价值和谐',
    },
    reversed: {
      en: 'divided loyalty; mismatched values; tempting avoidance; strained connection',
      zh: '忠诚分裂；价值不合；诱人的逃避；关系紧绷',
    },
  },
  'major-07-chariot': {
    upright: {
      en: 'directed momentum; disciplined drive; competing forces harnessed; victory through focus',
      zh: '有向动能；自律驱动；驾驭对立力量；专注带来胜利',
    },
    reversed: {
      en: 'scattered will; stalled advance; control struggle; rushed direction',
      zh: '意志分散；推进停滞；控制争夺；仓促方向',
    },
  },
  'major-08-strength': {
    upright: {
      en: 'quiet courage; gentle influence; patient resilience; brave compassion',
      zh: '安静勇气；温和影响；耐心韧性；勇敢慈悲',
    },
    reversed: {
      en: 'self-doubt; forced toughness; short temper; energy drained',
      zh: '自我怀疑；勉强坚强；脾气急躁；能量耗尽',
    },
  },
  'major-09-hermit': {
    upright: {
      en: 'solitary study; lantern insight; deliberate pause; inner guidance',
      zh: '独自研习；灯笼般的洞见；有意停顿；内在引导',
    },
    reversed: {
      en: 'isolating too long; hiding from truth; borrowed answers; reluctant return',
      zh: '孤立太久；躲避真相；借来的答案；不情愿回归',
    },
  },
  'major-10-wheel-of-fortune': {
    upright: {
      en: 'turning point; changing fortune; timely opening; cycle in motion',
      zh: '转折点；运势变动；适时机会；循环开始转动',
    },
    reversed: {
      en: 'resistance to change; unlucky repetition; missed timing; unstable ground',
      zh: '抗拒变化；不顺的重复；错过时机；不稳的立足处',
    },
  },
  'major-11-justice': {
    upright: {
      en: 'clear accountability; balanced judgment; truthful measure; fair exchange',
      zh: '清楚问责；平衡判断；诚实衡量；公平交换',
    },
    reversed: {
      en: 'skewed evidence; evaded responsibility; harsh bias; unresolved consequence',
      zh: '证据失衡；逃避责任；严苛偏见；未解决的后果',
    },
  },
  'major-12-hanged-man': {
    upright: {
      en: 'changed viewpoint; willing pause; surrendered control; insight through stillness',
      zh: '改变视角；自愿停顿；放下控制；静止中的洞见',
    },
    reversed: {
      en: 'needless delay; martyr posture; clinging perspective; stalled release',
      zh: '不必要的拖延；受害者姿态；固守视角；释放停滞',
    },
  },
  'major-13-death': {
    upright: {
      en: 'closing chapter; necessary shedding; honest transition; renewed shape',
      zh: '章节收束；必要舍弃；诚实过渡；新的形态',
    },
    reversed: {
      en: 'resisting endings; lingering attachment; half change; fear of renewal',
      zh: '抗拒结束；依恋残留；半途变化；害怕更新',
    },
  },
  'major-14-temperance': {
    upright: {
      en: 'blended strengths; measured rhythm; calm repair; harmonious proportion',
      zh: '力量融合；有度节奏；平静修复；和谐比例',
    },
    reversed: {
      en: 'excess and swing; poor pacing; clashing mixtures; frayed balance',
      zh: '过量与摇摆；节奏失当；混合冲突；平衡磨损',
    },
  },
  'major-15-devil': {
    upright: {
      en: 'binding desire; shadow bargain; compulsive pattern; seductive attachment',
      zh: '束缚欲望；阴影交易；强迫模式；诱人依附',
    },
    reversed: {
      en: 'naming the chain; reclaimed choice; loosening grip; honest shadow work',
      zh: '看见枷锁；取回选择；松开束缚；诚实面对阴影',
    },
  },
  'major-16-tower': {
    upright: {
      en: 'sudden rupture; false shelter falls; clarifying shock; freedom through change',
      zh: '突然破裂；虚假庇护倒塌；澄清性的震动；变化带来解放',
    },
    reversed: {
      en: 'delayed collapse; quiet damage; fear of upheaval; fragile patchwork',
      zh: '延迟崩塌；悄然损伤；害怕剧变；脆弱拼补',
    },
  },
  'major-17-star': {
    upright: {
      en: 'renewed hope; clear aspiration; gentle healing; distant beacon',
      zh: '重新点亮的希望；清晰愿景；温和修复；远方灯塔',
    },
    reversed: {
      en: 'dimmed faith; depleted optimism; lost direction; hope needing care',
      zh: '信念黯淡；乐观耗损；失去方向；需要照料的希望',
    },
  },
  'major-18-moon': {
    upright: {
      en: 'shifting perception; dream symbols; uncertainty; instinctive tide',
      zh: '变动感知；梦的象征；不确定性；本能潮汐',
    },
    reversed: {
      en: 'fog lifting; exposed fear; tangled signals; trust rebuilt slowly',
      zh: '迷雾散开；恐惧显露；信号纠缠；信任缓慢重建',
    },
  },
  'major-19-sun': {
    upright: {
      en: 'open joy; visible success; warm confidence; life-giving clarity',
      zh: '敞开喜悦；看得见的成功；温暖自信；滋养生命的清晰',
    },
    reversed: {
      en: 'muted joy; overexposure; delayed bloom; confidence under clouds',
      zh: '喜悦减弱；过度暴露；花期延迟；云下的自信',
    },
  },
  'major-20-judgement': {
    upright: {
      en: 'wake-up call; honest reckoning; second chance; answering the summons',
      zh: '觉醒召唤；诚实清算；第二次机会；回应召唤',
    },
    reversed: {
      en: 'self-condemnation; ignored call; unfinished review; fear of renewal',
      zh: '自我谴责；忽视召唤；未完复盘；害怕更新',
    },
  },
  'major-21-world': {
    upright: {
      en: 'completed arc; earned integration; wide horizon; arrival with perspective',
      zh: '完整弧线；成就整合；开阔地平线；带着视野抵达',
    },
    reversed: {
      en: 'loose ends; almost complete; circular delay; difficulty moving on',
      zh: '未尽事项；接近完成；循环拖延；难以继续前行',
    },
  },
  'cups-01': {
    upright: {
      en: 'emotional opening; tender beginning; intuitive flow; generous heart',
      zh: '情感开启；温柔开端；直觉流动；慷慨之心',
    },
    reversed: {
      en: 'guarded feelings; cup runs dry; delayed connection; emotional spill',
      zh: '防备情感；杯中干涸；关系延迟；情绪溢出',
    },
  },
  'cups-02': {
    upright: {
      en: 'mutual affection; equal exchange; trusted partnership; meeting of hearts',
      zh: '彼此爱意；平等交换；信任伙伴；心灵相遇',
    },
    reversed: {
      en: 'crossed signals; uneven bond; fragile pact; distance grows',
      zh: '信号错位；关系失衡；脆弱约定；距离拉大',
    },
  },
  'cups-03': {
    upright: {
      en: 'shared delight; creative circle; friendship feast; celebration with meaning',
      zh: '共享欢欣；创意圈层；友谊盛宴；有意义的庆祝',
    },
    reversed: {
      en: 'social excess; scattered loyalties; joy performed; group tension',
      zh: '社交过量；忠诚分散；表演式喜悦；群体紧张',
    },
  },
  'cups-04': {
    upright: {
      en: 'quiet discontent; overlooked offer; inward retreat; emotional reassessment',
      zh: '安静不满；被忽略的邀约；向内退避；情感再评估',
    },
    reversed: {
      en: 'renewed interest; leaving stagnation; open eyes; choice returns',
      zh: '兴趣复燃；离开停滞；睁开双眼；选择回归',
    },
  },
  'cups-05': {
    upright: {
      en: 'grief acknowledged; spilled hopes; honest mourning; remaining light',
      zh: '承认悲伤；洒落希望；诚实哀悼；仍存微光',
    },
    reversed: {
      en: 'turning toward repair; forgiveness possible; lessons gathered; sorrow loosens',
      zh: '转向修复；有可能原谅；收拢教训；悲伤松开',
    },
  },
  'cups-06': {
    upright: {
      en: 'warm memory; generous reunion; simple kindness; roots remembered',
      zh: '温暖记忆；慷慨重逢；简单善意；记起根源',
    },
    reversed: {
      en: 'nostalgia trap; old pattern returns; uneven generosity; past idealized',
      zh: '怀旧陷阱；旧模式回返；慷慨失衡；过去被理想化',
    },
  },
  'cups-07': {
    upright: {
      en: 'many visions; alluring options; imagination roaming; desire asks clarity',
      zh: '众多愿景；诱人选项；想象漫游；欲望需要清晰',
    },
    reversed: {
      en: 'narrowed choice; fantasy exposed; decisive focus; wish meets limits',
      zh: '选择收窄；幻想显形；果断聚焦；愿望遇到边界',
    },
  },
  'cups-08': {
    upright: {
      en: 'walking away; deeper search; emotional courage; leaving the familiar',
      zh: '转身离开；更深寻找；情感勇气；离开熟悉之处',
    },
    reversed: {
      en: 'return to a hollow place; fear of departure; unfinished goodbye; aimless drifting',
      zh: '回到空洞之地；害怕离开；未完成的告别；无目的漂泊',
    },
  },
  'cups-09': {
    upright: {
      en: 'wish fulfilled; sensory contentment; earned pleasure; private satisfaction',
      zh: '愿望实现；感官满足；赢得的愉悦；私密满足',
    },
    reversed: {
      en: 'hollow indulgence; wish delayed; complacency cracked; wanting more',
      zh: '空洞放纵；愿望延迟；自满破裂；还想要更多',
    },
  },
  'cups-10': {
    upright: {
      en: 'shared belonging; homecoming warmth; joyful kinship; lasting harmony',
      zh: '共享归属；回家般温暖；亲缘喜悦；持久和谐',
    },
    reversed: {
      en: 'domestic strain; ideal image breaks; divided home; joy withheld',
      zh: '家庭压力；理想形象破裂；家园分裂；喜悦被压住',
    },
  },
  'cups-page': {
    upright: {
      en: 'tender message; playful wonder; artistic spark; heart learning',
      zh: '温柔讯息；玩心与惊奇；艺术火花；心在学习',
    },
    reversed: {
      en: 'moodiness; mixed signals; fragile fantasy; emotional immaturity',
      zh: '情绪多变；信号混杂；脆弱幻想；情感不成熟',
    },
  },
  'cups-knight': {
    upright: {
      en: 'heartfelt pursuit; poetic invitation; brave vulnerability; idealistic movement',
      zh: '真心追求；诗意邀约；勇敢脆弱；理想主义行动',
    },
    reversed: {
      en: 'charm without follow-through; romantic fog; emotional retreat; promises drift',
      zh: '魅力没有后续；浪漫迷雾；情感退缩；承诺漂移',
    },
  },
  'cups-queen': {
    upright: {
      en: 'deep empathy; intuitive care; emotional poise; compassionate presence',
      zh: '深度共情；直觉照料；情感从容；慈悲陪伴',
    },
    reversed: {
      en: 'porous boundaries; hidden resentment; mood-led choices; care turned inward',
      zh: '边界渗漏；隐藏怨意；受情绪牵引的选择；照料转向自己',
    },
  },
  'cups-king': {
    upright: {
      en: 'calm feeling; mature compassion; generous steadiness; emotional leadership',
      zh: '情绪平稳；成熟慈悲；慷慨稳定；情感领导',
    },
    reversed: {
      en: 'bottled emotion; subtle control; unstable tides; empathy withheld',
      zh: '情绪封存；隐性控制；潮汐不稳；共情被收回',
    },
  },
  'pentacles-01': {
    upright: {
      en: 'tangible seed; practical opportunity; grounded start; resource to grow',
      zh: '可触种子；实际机会；踏实起点；可成长的资源',
    },
    reversed: {
      en: 'missed opening; shaky foundation; potential neglected; short-term thinking',
      zh: '错过开端；基础不稳；潜力被忽略；短视思考',
    },
  },
  'pentacles-02': {
    upright: {
      en: 'agile balance; changing priorities; deft coordination; rhythm under pressure',
      zh: '灵活平衡；优先级变化；熟练协调；压力下的节奏',
    },
    reversed: {
      en: 'juggling overload; uneven effort; dropped commitments; unstable routine',
      zh: '应付过载；努力不均；承诺掉落；日常不稳',
    },
  },
  'pentacles-03': {
    upright: {
      en: 'craft in company; shared standards; visible workmanship; skill earns trust',
      zh: '共同创作；共享标准；看得见的工艺；技能赢得信任',
    },
    reversed: {
      en: 'poor collaboration; uneven craft; praise without practice; plans misaligned',
      zh: '协作不佳；工艺不均；只有赞美没有练习；计划错位',
    },
  },
  'pentacles-04': {
    upright: {
      en: 'secure hold; careful reserve; defined limits; protecting value',
      zh: '稳固持有；谨慎保留；明确界限；保护价值',
    },
    reversed: {
      en: 'fearful hoarding; grip loosens; possessive habits; security questioned',
      zh: '恐惧囤积；握持松开；占有习惯；安全感受质疑',
    },
  },
  'pentacles-05': {
    upright: {
      en: 'lean season; outsider feeling; shared hardship; seeking shelter',
      zh: '艰难时节；局外人感；共同困境；寻找庇护',
    },
    reversed: {
      en: 'help arrives; recovery begins; isolation softens; needs acknowledged',
      zh: '援手到来；恢复开始；孤立缓和；需求被看见',
    },
  },
  'pentacles-06': {
    upright: {
      en: 'fair support; generous exchange; resources circulate; dignity restored',
      zh: '公平支持；慷慨交换；资源流动；尊严恢复',
    },
    reversed: {
      en: 'strings attached; uneven giving; debt of gratitude; power imbalance',
      zh: '附带条件；付出失衡；人情负担；权力不平',
    },
  },
  'pentacles-07': {
    upright: {
      en: 'patient cultivation; progress review; long view; work before harvest',
      zh: '耐心培育；检查进展；长远视野；收获前的工作',
    },
    reversed: {
      en: 'impatience with growth; wasted labor; poor timing; harvest doubted',
      zh: '对成长不耐烦；劳作浪费；时机不佳；怀疑收成',
    },
  },
  'pentacles-08': {
    upright: {
      en: 'deliberate practice; focused craft; skill deepens; work earns shape',
      zh: '刻意练习；专注工艺；技能加深；工作逐渐成形',
    },
    reversed: {
      en: 'repetitive grind; careless output; skill plateau; effort misdirected',
      zh: '重复苦工；粗心产出；技能停滞；努力方向错误',
    },
  },
  'pentacles-09': {
    upright: {
      en: 'self-made comfort; cultivated independence; refined reward; enjoying the garden',
      zh: '自得安适；培育独立；精致回报；享受自己的花园',
    },
    reversed: {
      en: 'fragile status; overreliance; lonely success; harvest threatened',
      zh: '脆弱地位；过度依赖；孤独成功；收成受威胁',
    },
  },
  'pentacles-10': {
    upright: {
      en: 'rooted legacy; enduring shelter; family continuity; long-term belonging',
      zh: '扎根传承；长久庇护；家族延续；长期归属',
    },
    reversed: {
      en: 'inherited burden; fractured foundation; belonging questioned; old pattern persists',
      zh: '继承的负担；破裂基础；归属受质疑；旧模式延续',
    },
  },
  'pentacles-page': {
    upright: {
      en: 'practical curiosity; study with purpose; patient learner; first useful step',
      zh: '务实好奇；有目的学习；耐心学徒；第一个有用步骤',
    },
    reversed: {
      en: 'poor follow-through; distracted study; missed detail; promise ungrounded',
      zh: '执行不佳；学习分心；错过细节；承诺没有落地',
    },
  },
  'pentacles-knight': {
    upright: {
      en: 'steady progress; reliable effort; patient journey; duty carried well',
      zh: '稳步进展；可靠努力；耐心旅程；妥善承担职责',
    },
    reversed: {
      en: 'stalled routine; stubborn pace; work without direction; neglected duty',
      zh: '日常停滞；步调固执；无方向工作；职责被忽略',
    },
  },
  'pentacles-queen': {
    upright: {
      en: 'grounded nurture; resourceful care; sensory wisdom; flourishing stewardship',
      zh: '踏实滋养；善用资源的照料；感官智慧；让事物繁茂的守护',
    },
    reversed: {
      en: 'overgiving; material worry; neglect of self; comfort becomes control',
      zh: '过度付出；物质忧虑；忽略自己；舒适变成控制',
    },
  },
  'pentacles-king': {
    upright: {
      en: 'grounded authority; earned security; practical vision; generous stewardship',
      zh: '踏实权威；赢得的安稳；务实愿景；慷慨守护',
    },
    reversed: {
      en: 'rigid ownership; status fixation; guarded resources; power measured in possessions',
      zh: '僵硬占有；执着地位；资源防守；用所有物衡量权力',
    },
  },
  'swords-01': {
    upright: {
      en: 'clear idea; decisive truth; sharpened perspective; brave conversation',
      zh: '清晰想法；果断真相；锐利视角；勇敢对话',
    },
    reversed: {
      en: 'muddled thinking; harsh words; truth obscured; decision delayed',
      zh: '思绪混乱；尖刻言语；真相遮蔽；决定延迟',
    },
  },
  'swords-02': {
    upright: {
      en: 'quiet stalemate; guarded choice; balanced tension; inner truce',
      zh: '安静僵局；防备选择；平衡张力；内在休战',
    },
    reversed: {
      en: 'forced decision; information overload; blind spot exposed; tension breaks',
      zh: '被迫决定；信息过载；盲点显现；张力破裂',
    },
  },
  'swords-03': {
    upright: {
      en: 'painful truth; heart split; necessary release; grief given words',
      zh: '痛苦真相；心被割裂；必要释放；让悲伤有言语',
    },
    reversed: {
      en: 'mending begins; pain processed; old wound softens; truth integrated',
      zh: '修复开始；处理痛楚；旧伤软化；真相被整合',
    },
  },
  'swords-04': {
    upright: {
      en: 'strategic rest; silent recovery; mental shelter; pause before action',
      zh: '策略性休息；静默恢复；心智庇护；行动前停顿',
    },
    reversed: {
      en: 'restless return; burnout ignored; rushed reentry; thoughts keep racing',
      zh: '躁动回归；忽视耗竭；仓促重返；思绪持续奔跑',
    },
  },
  'swords-05': {
    upright: {
      en: 'hollow victory; sharp conflict; pride in contest; cost of winning',
      zh: '空洞胜利；尖锐冲突；争胜之傲；胜利的代价',
    },
    reversed: {
      en: 'ceasefire offered; regret after conflict; repair attempted; conflict de-escalates',
      zh: '停火被提出；冲突后的悔意；尝试修复；冲突降温',
    },
  },
  'swords-06': {
    upright: {
      en: 'leaving rough waters; gradual passage; calmer mind; carrying lessons onward',
      zh: '离开风浪；渐进过渡；心境平静；带着教训前行',
    },
    reversed: {
      en: 'return to turmoil; baggage retained; route blocked; transition resisted',
      zh: '回到动荡；负担保留；路线受阻；抗拒过渡',
    },
  },
  'swords-07': {
    upright: {
      en: 'quiet strategy; selective disclosure; clever exit; independent plan',
      zh: '安静策略；选择性透露；聪明退路；独立计划',
    },
    reversed: {
      en: 'hidden scheme exposed; evasive habits; confession pending; strategy unravels',
      zh: '隐藏计谋暴露；回避习惯；忏悔待定；策略瓦解',
    },
  },
  'swords-08': {
    upright: {
      en: 'self-imposed limits; anxious narrative; narrowed options; fear holds tight',
      zh: '自设限制；焦虑叙事；选项收窄；恐惧紧抓不放',
    },
    reversed: {
      en: 'mental release; perspective widens; courage to move; old restraint loosens',
      zh: '心智释放；视野拓宽；移动的勇气；旧束缚松开',
    },
  },
  'swords-09': {
    upright: {
      en: 'midnight worry; guilt echo; fear magnified; mind needs gentleness',
      zh: '午夜忧虑；罪疚回声；恐惧放大；心需要温柔',
    },
    reversed: {
      en: 'sleep returns; worry named; shame released; support enters',
      zh: '睡眠回归；忧虑被命名；羞耻释放；支持进入',
    },
  },
  'swords-10': {
    upright: {
      en: 'exhausted ending; final blow; truth of limits; dawn after rupture',
      zh: '筋疲力尽的结局；最后一击；界限的真相；破裂后的黎明',
    },
    reversed: {
      en: 'slow recovery; surviving the lesson; pain recedes; unfinished aftermath',
      zh: '缓慢恢复；活过这堂课；痛楚退去；余波未尽',
    },
  },
  'swords-page': {
    upright: {
      en: 'alert curiosity; keen observation; candid question; new mental edge',
      zh: '警觉好奇；敏锐观察；坦率提问；新的思维锋芒',
    },
    reversed: {
      en: 'restless gossip; hasty message; suspicion spirals; facts skipped',
      zh: '躁动流言；仓促消息；猜疑打转；跳过事实',
    },
  },
  'swords-knight': {
    upright: {
      en: 'swift argument; decisive charge; fierce momentum; truth pursued',
      zh: '迅疾论辩；果断冲锋；猛烈动能；追逐真相',
    },
    reversed: {
      en: 'reckless attack; impatience burns; words wound; direction lost',
      zh: '鲁莽攻击；不耐烦燃烧；言语伤人；失去方向',
    },
  },
  'swords-queen': {
    upright: {
      en: 'lucid boundaries; independent judgment; precise speech; clear-eyed discernment',
      zh: '清醒边界；独立判断；精准言辞；明察辨别',
    },
    reversed: {
      en: 'icy distance; cutting criticism; biased reading; guarded heart',
      zh: '冰冷距离；刻薄批评；偏颇解读；防守的心',
    },
  },
  'swords-king': {
    upright: {
      en: 'strategic mind; principled command; calm analysis; words carry weight',
      zh: '策略头脑；有原则的指挥；冷静分析；言语有分量',
    },
    reversed: {
      en: 'intellectual tyranny; cold logic; weaponized language; judgment without mercy',
      zh: '知识暴政；冰冷逻辑；武器化语言；没有慈悲的判断',
    },
  },
  'wands-01': {
    upright: {
      en: 'ignition point; creative spark; brave initiative; energy seeking form',
      zh: '点火时刻；创意火花；勇敢主动；寻找形态的能量',
    },
    reversed: {
      en: 'stalled spark; false start; scattered fire; desire loses shape',
      zh: '火花停滞；错误起步；火力分散；欲望失去形状',
    },
  },
  'wands-02': {
    upright: {
      en: 'horizon planning; chosen direction; bold preview; world within reach',
      zh: '地平线规划；选定方向；大胆预览；世界触手可及',
    },
    reversed: {
      en: 'fear of expansion; poor map; options narrowed; delayed launch',
      zh: '害怕扩展；地图不佳；选项收窄；启动延迟',
    },
  },
  'wands-03': {
    upright: {
      en: 'early results; distant prospects; collaboration across space; momentum widening',
      zh: '初步成果；远方前景；跨越距离的协作；动能扩展',
    },
    reversed: {
      en: 'delayed returns; weak coordination; horizon feels closed; plans need revision',
      zh: '回报延迟；协调薄弱；地平线仿佛关闭；计划需要修订',
    },
  },
  'wands-04': {
    upright: {
      en: 'joyful milestone; welcome gathering; stable base; belonging celebrated',
      zh: '喜悦里程碑；欢迎聚会；稳定基地；庆祝归属',
    },
    reversed: {
      en: 'uneasy homecoming; delayed celebration; unstable foundation; private tension',
      zh: '不安的归来；延迟庆祝；基础不稳；私下紧张',
    },
  },
  'wands-05': {
    upright: {
      en: 'lively contest; friction that teaches; competing voices; courage tested',
      zh: '活跃竞赛；带来教训的摩擦；竞争声音；勇气受考验',
    },
    reversed: {
      en: 'petty rivalry; energy scattered; conflict avoidance; win-at-all-costs mood',
      zh: '琐碎竞争；能量分散；逃避冲突；不惜代价求胜的心态',
    },
  },
  'wands-06': {
    upright: {
      en: 'public recognition; morale rises; guided procession; success shared',
      zh: '公开认可；士气上升；有引导的行进；共享成功',
    },
    reversed: {
      en: 'borrowed applause; recognition delayed; pride inflated; team overlooked',
      zh: '借来的掌声；认可延迟；自负膨胀；团队被忽视',
    },
  },
  'wands-07': {
    upright: {
      en: 'defended ground; resilient stance; values tested; hold your line',
      zh: '守住阵地；坚韧姿态；价值受考验；守住立场',
    },
    reversed: {
      en: 'fatigue under pressure; boundaries soften; doubt advances; resistance scattered',
      zh: '压力下疲惫；边界变软；怀疑推进；抵抗分散',
    },
  },
  'wands-08': {
    upright: {
      en: 'rapid movement; messages travel; clean release; momentum arrives',
      zh: '快速移动；消息传递；干净释放；动能到来',
    },
    reversed: {
      en: 'delays multiply; crossed messages; rushed timing; energy ricochets',
      zh: '延迟倍增；消息错位；时机仓促；能量反弹',
    },
  },
  'wands-09': {
    upright: {
      en: 'seasoned endurance; guarded hope; final stretch; scars carry wisdom',
      zh: '历练后的耐力；守护希望；最后阶段；伤痕承载智慧',
    },
    reversed: {
      en: 'depleted defense; old wound flares; readiness turns suspicion; rest required',
      zh: '防御耗竭；旧伤复燃；警觉变成猜疑；需要休息',
    },
  },
  'wands-10': {
    upright: {
      en: 'heavy load; ambitious reach; duty crowds joy; finish line near',
      zh: '沉重负担；野心触及；职责挤压喜悦；终点临近',
    },
    reversed: {
      en: 'delegated burden; dropped weight; priorities reset; ambition trimmed',
      zh: '分担负担；放下重量；优先级重置；收敛野心',
    },
  },
  'wands-page': {
    upright: {
      en: 'curious adventure; fresh enthusiasm; bold experiment; news of movement',
      zh: '好奇冒险；新鲜热情；大胆实验；行动消息',
    },
    reversed: {
      en: 'restless promise; impulsive idea; attention flickers; enthusiasm without anchor',
      zh: '躁动承诺；冲动想法；注意力闪烁；没有锚点的热情',
    },
  },
  'wands-knight': {
    upright: {
      en: 'daring action; passionate pursuit; fast change; risk welcomed',
      zh: '大胆行动；热情追求；快速变化；欢迎风险',
    },
    reversed: {
      en: 'erratic charge; burned bridges; impatience; momentum without aim',
      zh: '反复冲撞；烧毁桥梁；不耐烦；没有目标的动能',
    },
  },
  'wands-queen': {
    upright: {
      en: 'magnetic confidence; generous fire; independent creativity; warm leadership',
      zh: '有吸引力的自信；慷慨火焰；独立创造力；温暖领导',
    },
    reversed: {
      en: 'performative confidence; jealous spark; scattered focus; warmth turned sharp',
      zh: '表演式自信；嫉妒火花；焦点分散；温暖变得尖锐',
    },
  },
  'wands-king': {
    upright: {
      en: 'visionary command; enterprising courage; decisive creation; inspiring direction',
      zh: '有远见的指挥；创业勇气；果断创造；鼓舞人心的方向',
    },
    reversed: {
      en: 'domineering ambition; plans overheat; status-driven action; vision loses listeners',
      zh: '霸道野心；计划过热；地位驱动行动；愿景失去听众',
    },
  },
};

export function getTarotCardMeaning(cardId: string): TarotCardMeaning {
  const meaning = TAROT_CARD_MEANINGS[cardId];

  if (!meaning) {
    throw new Error(`Unknown tarot card meaning id: ${JSON.stringify(cardId)}.`);
  }

  return meaning;
}
