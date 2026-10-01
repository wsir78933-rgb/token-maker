import { CircularTestimonials } from '@/components/armor-creator/circular-testimonials';

type ArmorCreatorFeatureExample = {
  src: string;
  name: string;
  designation: string;
  quote: string;
};

type ArmorCreatorFeatureSectionProps = {
  description: string;
  headingId: string;
  imagePosition: 'left' | 'right';
  title: string;
  examples: ArmorCreatorFeatureExample[];
};

const HEAVY_ARMOR_CASES: ArmorCreatorFeatureExample[] = [
  {
    src: '/armor-creator/examples/gate-guard.png',
    name: '城门重甲卫士',
    designation: '重甲守卫造型',
    quote: '厚重胸甲、封闭式头盔与层叠护肩，构成稳固的城防轮廓。',
  },
  {
    src: '/armor-creator/examples/royal-knight.png',
    name: '王室仪仗骑士',
    designation: '礼仪重甲造型',
    quote: '银色板甲配以金色饰边，肩部徽饰与长披风突出典礼感。',
  },
  {
    src: '/armor-creator/examples/temple-guardian.png',
    name: '神殿守护者',
    designation: '仪式重甲造型',
    quote: '高领护颈与对称肩甲相互呼应，胸前纹饰强化庄严轮廓。',
  },
  {
    src: '/armor-creator/examples/oathbreaker-knight.png',
    name: '破誓骑士',
    designation: '暗色战损重甲',
    quote: '暗色金属、尖角头盔与磨损披风组合出冷峻的战损轮廓。',
  },
  {
    src: '/armor-creator/examples/mercenary-captain.png',
    name: '佣兵队长',
    designation: '实战指挥造型',
    quote: '混合护甲搭配皮革束带与单侧肩甲，保留便于行动的装备细节。',
  },
  {
    src: '/armor-creator/examples/winged-lord.png',
    name: '翼饰领主',
    designation: '翼冠仪式造型',
    quote: '翼形头盔与修长板甲结合，金属饰面形成鲜明的仪典轮廓。',
  },
];

const LIGHT_ARMOR_CASES: ArmorCreatorFeatureExample[] = [
  {
    src: '/armor-creator/examples/woodland-ranger.png',
    name: '林地游侠',
    designation: '轻装弓手造型',
    quote: '短披风、皮革护具与自然色调组成适合林间行动的轻便轮廓。',
  },
  {
    src: '/armor-creator/examples/travel-scout.png',
    name: '旅途斥候',
    designation: '旅行斥候造型',
    quote: '分层布甲、腰包与轻型肩护组合，呈现便于携行的旅行装备。',
  },
  {
    src: '/armor-creator/examples/border-hunter.png',
    name: '边境猎手',
    designation: '野外猎人造型',
    quote: '深色皮甲配实用护臂，宽沿兜帽呼应便于隐蔽的野外装束。',
  },
  {
    src: '/armor-creator/examples/academy-mage.png',
    name: '学院法师',
    designation: '学院施法造型',
    quote: '长袍外层搭配窄肩护具，几何纹样与束带呈现学院风格。',
  },
  {
    src: '/armor-creator/examples/court-mage.png',
    name: '宫廷法师',
    designation: '宫廷法术造型',
    quote: '高领长衣、披肩与精致饰边组成正式的施法服饰层次。',
  },
  {
    src: '/armor-creator/examples/temple-priest.png',
    name: '神殿祭司',
    designation: '祭仪轻袍造型',
    quote: '浅色长袍配披肩和简洁饰边，宽松剪裁保留庄重的仪式感。',
  },
];

function ArmorCreatorFeatureSection({
  description,
  headingId,
  imagePosition,
  title,
  examples,
}: ArmorCreatorFeatureSectionProps) {
  return (
    <section
      aria-labelledby={headingId}
      className="mx-auto max-w-5xl border-t border-white/10 px-5 py-12 text-stone-100 sm:py-16 lg:px-8"
    >
      <div className="mb-10 flex flex-col gap-3">
        <h2
          id={headingId}
          className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl"
        >
          {title}
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {description}
        </p>
      </div>
      <CircularTestimonials
        testimonials={examples}
        ariaLabel={`${title}案例轮播`}
        previousLabel="上一个造型"
        nextLabel="下一个造型"
        imagePosition={imagePosition}
      />
    </section>
  );
}

export function ArmorCreatorFeatures() {
  return (
    <>
      <ArmorCreatorFeatureSection
        headingId="armor-creator-heavy-armor-heading"
        title="重甲与仪式造型"
        description="从厚重板甲到典礼盔甲，查看不同防护层次与装饰语言。"
        examples={HEAVY_ARMOR_CASES}
        imagePosition="left"
      />
      <ArmorCreatorFeatureSection
        headingId="armor-creator-light-armor-heading"
        title="轻装与奇幻职业"
        description="通过皮甲、旅行装备、法袍与仪式长衣，呈现多样的职业轮廓。"
        examples={LIGHT_ARMOR_CASES}
        imagePosition="right"
      />
    </>
  );
}
