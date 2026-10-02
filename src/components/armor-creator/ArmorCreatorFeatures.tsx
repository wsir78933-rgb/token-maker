import {
  CircularTestimonials,
  type CircularTestimonial,
} from '@/components/armor-creator/circular-testimonials';
import type { SiteLocale } from '@/lib/site-locale';

type LocalizedArmorCreatorFeatureText = Record<SiteLocale, string>;

type ArmorCreatorFeatureExample = {
  src: string;
  name: LocalizedArmorCreatorFeatureText;
  designation: LocalizedArmorCreatorFeatureText;
  quote: LocalizedArmorCreatorFeatureText;
};

type ArmorCreatorFeatureSection = {
  title: LocalizedArmorCreatorFeatureText;
  carouselLabel: LocalizedArmorCreatorFeatureText;
  imagePosition: 'left' | 'right';
  examples: readonly ArmorCreatorFeatureExample[];
};

type ArmorCreatorFeatureNavigationLabels = {
  previous: string;
  next: string;
};

const ARMOR_CREATOR_FEATURE_NAVIGATION_LABELS: Record<SiteLocale, ArmorCreatorFeatureNavigationLabels> = {
  en: {
    previous: 'Previous style',
    next: 'Next style',
  },
  zh: {
    previous: '上一个造型',
    next: '下一个造型',
  },
};

const ARMOR_CREATOR_FEATURE_SECTIONS: readonly ArmorCreatorFeatureSection[] = [
  {
    title: {
      en: 'Heavy Armor and Ceremonial Looks',
      zh: '重甲与仪式造型',
    },
    carouselLabel: {
      en: 'Heavy armor and ceremonial look examples',
      zh: '重甲与仪式造型案例轮播',
    },
    imagePosition: 'left',
    examples: [
      {
        src: '/armor-creator/examples/gate-guard.png',
        name: { en: 'Gate Guard', zh: '城门重甲卫士' },
        designation: { en: 'Heavy Guard Armor', zh: '重甲守卫造型' },
        quote: {
          en: 'A heavy breastplate, closed helm, and layered pauldrons create a sturdy silhouette for a city gate guard.',
          zh: '厚重胸甲、封闭式头盔与层叠护肩，构成稳固的城防轮廓。',
        },
      },
      {
        src: '/armor-creator/examples/royal-knight.png',
        name: { en: 'Royal Knight', zh: '王室仪仗骑士' },
        designation: { en: 'Ceremonial Plate Armor', zh: '礼仪重甲造型' },
        quote: {
          en: 'Silver plate with gold trim, a shoulder crest, and a long cape give this knight a formal ceremonial look.',
          zh: '银色板甲配以金色饰边，肩部徽饰与长披风突出典礼感。',
        },
      },
      {
        src: '/armor-creator/examples/temple-guardian.png',
        name: { en: 'Temple Guardian', zh: '神殿守护者' },
        designation: { en: 'Ritual Heavy Armor', zh: '仪式重甲造型' },
        quote: {
          en: 'A high gorget balances the symmetrical pauldrons, while the chest ornament gives the armor a solemn presence.',
          zh: '高领护颈与对称肩甲相互呼应，胸前纹饰强化庄严轮廓。',
        },
      },
      {
        src: '/armor-creator/examples/oathbreaker-knight.png',
        name: { en: 'Oathbreaker Knight', zh: '破誓骑士' },
        designation: { en: 'Dark, Battle-Worn Armor', zh: '暗色战损重甲' },
        quote: {
          en: 'Dark metal, a horned helm, and a weathered cape create a stark, battle-worn silhouette.',
          zh: '暗色金属、尖角头盔与磨损披风组合出冷峻的战损轮廓。',
        },
      },
      {
        src: '/armor-creator/examples/mercenary-captain.png',
        name: { en: 'Mercenary Captain', zh: '佣兵队长' },
        designation: { en: 'Field Commander', zh: '实战指挥造型' },
        quote: {
          en: 'Mixed armor, leather straps, and a single pauldron keep the commander protected without limiting movement.',
          zh: '混合护甲搭配皮革束带与单侧肩甲，保留便于行动的装备细节。',
        },
      },
      {
        src: '/armor-creator/examples/winged-lord.png',
        name: { en: 'Winged Lord', zh: '翼饰领主' },
        designation: { en: 'Winged Ceremonial Armor', zh: '翼冠仪式造型' },
        quote: {
          en: 'A winged helm and elongated plate armor pair with metallic details for a striking ceremonial silhouette.',
          zh: '翼形头盔与修长板甲结合，金属饰面形成鲜明的仪典轮廓。',
        },
      },
    ],
  },
  {
    title: {
      en: 'Light Armor and Fantasy Roles',
      zh: '轻装与奇幻职业',
    },
    carouselLabel: {
      en: 'Light armor and fantasy role examples',
      zh: '轻装与奇幻职业案例轮播',
    },
    imagePosition: 'right',
    examples: [
      {
        src: '/armor-creator/examples/woodland-ranger.png',
        name: { en: 'Woodland Ranger', zh: '林地游侠' },
        designation: { en: 'Light Archer Armor', zh: '轻装弓手造型' },
        quote: {
          en: 'A short cloak, leather guards, and natural tones make this a practical look for moving through the woods.',
          zh: '短披风、皮革护具与自然色调组成适合林间行动的轻便轮廓。',
        },
      },
      {
        src: '/armor-creator/examples/travel-scout.png',
        name: { en: 'Traveling Scout', zh: '旅途斥候' },
        designation: { en: 'Road-Ready Scout', zh: '旅行斥候造型' },
        quote: {
          en: 'Layered cloth armor, a travel pouch, and light shoulder guards form a practical kit for the road.',
          zh: '分层布甲、腰包与轻型肩护组合，呈现便于携行的旅行装备。',
        },
      },
      {
        src: '/armor-creator/examples/border-hunter.png',
        name: { en: 'Border Hunter', zh: '边境猎手' },
        designation: { en: 'Wilderness Hunter', zh: '野外猎人造型' },
        quote: {
          en: 'Dark leather armor and practical bracers pair with a broad hood for a look suited to staying hidden outdoors.',
          zh: '深色皮甲配实用护臂，宽沿兜帽呼应便于隐蔽的野外装束。',
        },
      },
      {
        src: '/armor-creator/examples/academy-mage.png',
        name: { en: 'Academy Mage', zh: '学院法师' },
        designation: { en: 'Academy Spellcaster', zh: '学院施法造型' },
        quote: {
          en: 'A narrow-shouldered guard sits over the robe, with geometric patterns and belts marking an academy style.',
          zh: '长袍外层搭配窄肩护具，几何纹样与束带呈现学院风格。',
        },
      },
      {
        src: '/armor-creator/examples/court-mage.png',
        name: { en: 'Court Mage', zh: '宫廷法师' },
        designation: { en: 'Courtly Spellcaster', zh: '宫廷法术造型' },
        quote: {
          en: 'A high-collared robe, mantle, and fine trim create a polished formal look for court magic.',
          zh: '高领长衣、披肩与精致饰边组成正式的施法服饰层次。',
        },
      },
      {
        src: '/armor-creator/examples/temple-priest.png',
        name: { en: 'Temple Priest', zh: '神殿祭司' },
        designation: { en: 'Ceremonial Robes', zh: '祭仪轻袍造型' },
        quote: {
          en: 'A light robe with a mantle and restrained trim keeps the silhouette relaxed while preserving a sense of ceremony.',
          zh: '浅色长袍配披肩和简洁饰边，宽松剪裁保留庄重的仪式感。',
        },
      },
    ],
  },
];

function listLocalizedArmorCreatorFeatureExamples(
  examples: readonly ArmorCreatorFeatureExample[],
  locale: SiteLocale,
): CircularTestimonial[] {
  return examples.map((example) => ({
    src: example.src,
    name: example.name[locale],
    designation: example.designation[locale],
    quote: example.quote[locale],
  }));
}

function ArmorCreatorFeatureSection({
  title,
  carouselLabel,
  imagePosition,
  examples,
  previousLabel,
  nextLabel,
}: {
  title: string;
  carouselLabel: string;
  imagePosition: 'left' | 'right';
  examples: readonly CircularTestimonial[];
  previousLabel: string;
  nextLabel: string;
}) {
  return (
    <section
      aria-label={title}
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <CircularTestimonials
        testimonials={examples}
        ariaLabel={carouselLabel}
        previousLabel={previousLabel}
        nextLabel={nextLabel}
        imagePosition={imagePosition}
      />
    </section>
  );
}

export function ArmorCreatorFeatures({ locale }: { locale: SiteLocale }) {
  const navigationLabels = ARMOR_CREATOR_FEATURE_NAVIGATION_LABELS[locale];

  return ARMOR_CREATOR_FEATURE_SECTIONS.map((section) => (
    <ArmorCreatorFeatureSection
      key={section.carouselLabel[locale]}
      title={section.title[locale]}
      carouselLabel={section.carouselLabel[locale]}
      imagePosition={section.imagePosition}
      examples={listLocalizedArmorCreatorFeatureExamples(section.examples, locale)}
      previousLabel={navigationLabels.previous}
      nextLabel={navigationLabels.next}
    />
  ));
}
