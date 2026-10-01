import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  ARMY_FORMATION_CREATOR_EDITOR_ID,
  ArmyFormationCreatorPageHeading,
} from '@/components/army-formation/ArmyFormationCreatorPageHeading';
import { ArmyFormationCreator } from '@/components/army-formation/ArmyFormationCreator';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import type { SiteLocale } from '@/lib/site-locale';

const ARMY_FORMATION_CREATOR_PATH = '/army-formation-creator';

type ArmyFormationCreatorPageStepCopy = {
  title: string;
  description: string;
};

type ArmyFormationCreatorPageFaqCopy = {
  question: string;
  answer: string;
};

type ArmyFormationCreatorPageCopy = {
  overviewTitle: string;
  overviewDescription: string;
  stepsEyebrow: string;
  stepsTitle: string;
  stepsLabel: string;
  steps: readonly ArmyFormationCreatorPageStepCopy[];
  callToActionTitle: string;
  callToActionDescription: string;
  callToActionLabel: string;
  faqTitle: string;
  faq: readonly ArmyFormationCreatorPageFaqCopy[];
};

const ARMY_FORMATION_CREATOR_PAGE_COPY: Record<SiteLocale, ArmyFormationCreatorPageCopy> = {
  en: {
    overviewTitle: 'What is the Army Formation Creator?',
    overviewDescription:
      'The Army Formation Creator is an online tool for sketching battlefield formations. Place pieces from different categories on the battlefield, arrange troops and equipment, and adjust their angle, color, battlefield height, and background. When you are done, export an image or a formation file to save your ideas, discuss tactics, or share your plan.',
    stepsEyebrow: 'How it works',
    stepsTitle: 'How to use the Army Formation Creator',
    stepsLabel: 'How to use the Army Formation Creator',
    steps: [
      {
        title: 'Choose pieces',
        description:
          'Choose icons from helmets, weapons, animals, vehicles and siege equipment, or NATO symbols. Select an icon to place a piece on the battlefield.',
      },
      {
        title: 'Arrange your formation',
        description:
          'Drag pieces across the battlefield to position them. Select a piece to adjust its angle or color, or remove it.',
      },
      {
        title: 'Set up the battlefield',
        description: 'Adjust the battlefield height and base color, or add a background image.',
      },
      {
        title: 'Export your work',
        description:
          'Export an image to share your battlefield, or export a formation file to save it. Import the file later to continue editing.',
      },
    ],
    callToActionTitle: 'Start building your formation',
    callToActionDescription:
      'Choose pieces, arrange your troops, and create a battlefield formation diagram.',
    callToActionLabel: 'Start creating',
    faqTitle: 'Frequently asked questions',
    faq: [
      {
        question: 'What types of pieces can I add?',
        answer:
          'Pieces are grouped into categories such as helmets, weapons, animals, vehicles and siege equipment, and NATO symbols. Add the ones you need to your battlefield.',
      },
      {
        question: 'How can I move or adjust pieces?',
        answer:
          'After adding a piece, drag it on the battlefield to move it. Select it to adjust its angle or color, or delete it.',
      },
      {
        question: 'Can I change the battlefield appearance?',
        answer: 'Yes. Adjust the battlefield height and base color, or add a background image.',
      },
      {
        question: 'Is my work saved automatically?',
        answer:
          'Your work is saved in the current browser. The next time you open the page, you can restore your last save or start with a blank battlefield.',
      },
      {
        question: 'How do I export my work and continue editing?',
        answer:
          'Export an image or a formation file. To continue editing later, import the formation file.',
      },
    ],
  },
  zh: {
    overviewTitle: '什么是军阵制作器？',
    overviewDescription:
      '军阵制作器是一款用于绘制战场阵型示意图的在线工具。你可以在战场上放置不同类别的棋子，安排队伍与装备的位置，并调整角度、颜色、战场高度和背景。完成后可导出图片或方案文件，用于保存阵型构想、战术讨论与展示。',
    stepsEyebrow: '操作流程',
    stepsTitle: '如何使用军阵制作器？',
    stepsLabel: '军阵制作器使用步骤',
    steps: [
      {
        title: '选择棋子',
        description:
          '在头盔、武器、动物、载具与攻城器械、北约符号等类别中选择图标，点击后将棋子放入战场。',
      },
      {
        title: '摆放阵型',
        description: '在战场上拖动棋子来安排位置；选中棋子后，可以调整角度、颜色或删除棋子。',
      },
      {
        title: '设置战场',
        description: '根据需要调整战场高度和底色，或为战场设置背景图。',
      },
      {
        title: '导出作品',
        description: '导出战场图片用于展示，也可以导出方案文件留存；之后选择方案文件即可继续编辑。',
      },
    ],
    callToActionTitle: '现在开始布置军阵',
    callToActionDescription: '挑选棋子，安排队伍位置，制作你的战场阵型示意图。',
    callToActionLabel: '开始制作',
    faqTitle: '常见问题',
    faq: [
      {
        question: '可以添加哪些类型的棋子？',
        answer: '棋子分为头盔、武器、动物、载具与攻城器械、北约符号等类别，可按需要放入战场。',
      },
      {
        question: '怎样移动或调整棋子？',
        answer: '添加棋子后，可在战场上拖动它来调整位置。选中棋子后，还可以调整角度、改色或删除。',
      },
      {
        question: '可以调整战场的外观吗？',
        answer: '可以调整战场高度和底色，也可以设置背景图。',
      },
      {
        question: '制作内容会自动保存吗？',
        answer: '内容会保存在当前浏览器中。再次打开时，可以选择恢复上次记录或从空白开始。',
      },
      {
        question: '怎样导出作品并继续编辑？',
        answer: '可以导出战场图片，也可以导出方案文件。需要继续编辑时，选择方案文件即可导入。',
      },
    ],
  },
};

function ArmyFormationCreatorPageContent({ locale }: { locale: SiteLocale }) {
  const copy = ARMY_FORMATION_CREATOR_PAGE_COPY[locale];

  return (
    <div className="mx-auto max-w-5xl border-t border-white/10 py-12 text-stone-100 sm:py-16">
      <section>
        <h2 className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl">
          {copy.overviewTitle}
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {copy.overviewDescription}
        </p>
      </section>

      <section className="mt-10">
        <div className="mb-14 flex flex-col items-center gap-3 text-center">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
            {copy.stepsEyebrow}
          </span>
          <h2
            className="font-display font-semibold tracking-tight text-stone-50 text-balance"
            style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
          >
            {copy.stepsTitle}
          </h2>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-6 hidden h-px bg-white/15 md:block"
          />
          <ol aria-label={copy.stepsLabel} className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {copy.steps.map((step, index) => (
              <li
                key={step.title}
                className="relative flex flex-col items-center gap-4 text-center"
              >
                <div className="relative z-10 flex size-12 items-center justify-center rounded-full border border-white/15 bg-background">
                  <span className="text-xs font-semibold tabular-nums text-stone-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <h3 className="font-semibold tracking-tight text-stone-50">{step.title}</h3>
                  <p className="max-w-xs text-sm leading-relaxed text-stone-300 text-pretty">
                    {step.description}
                  </p>
                </div>
                {index < copy.steps.length - 1 && (
                  <ArrowRight
                    aria-hidden="true"
                    className="mt-2 size-4 text-stone-500 md:hidden"
                  />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-14 flex flex-col items-center gap-3 text-center">
        <h2 className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl">
          {copy.callToActionTitle}
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {copy.callToActionDescription}
        </p>
        <Button
          size="lg"
          className="mt-2 rounded-full px-8"
          nativeButton={false}
          render={<a href="#army-formation-creator-editor" />}
        >
          {copy.callToActionLabel}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Button>
      </section>

      <section className="mt-12 border-t border-white/10 pt-10">
        <h2 className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl">
          {copy.faqTitle}
        </h2>
        <div className="mt-4 divide-y divide-white/10">
          {copy.faq.map((item) => (
            <article key={item.question} className="py-5 first:pt-0">
              <h3 className="font-semibold leading-6 text-stone-50">{item.question}</h3>
              <p className="mt-2 text-sm leading-7 text-stone-300 text-pretty">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ArmyFormationCreatorPageFrame({ locale }: { locale: SiteLocale }) {
  return (
    <div className="px-5 lg:px-8">
      <ArmyFormationCreatorPageHeading locale={locale} />
      <div id={ARMY_FORMATION_CREATOR_EDITOR_ID} className="pb-8 lg:pb-10">
        <ArmyFormationCreator locale={locale} />
      </div>
      <ArmyFormationCreatorPageContent locale={locale} />
    </div>
  );
}

export function ArmyFormationCreatorPageView({ locale }: { locale: SiteLocale }) {
  return (
    <InnerPageChrome locale={locale} currentPath={ARMY_FORMATION_CREATOR_PATH} tone="hub">
      <ArmyFormationCreatorPageFrame locale={locale} />
    </InnerPageChrome>
  );
}
