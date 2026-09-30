import {
  ARMY_FORMATION_CREATOR_EDITOR_ID,
  ArmyFormationCreatorPageHeading,
} from '@/components/army-formation/ArmyFormationCreatorPageHeading';
import { ArmyFormationCreator } from '@/components/army-formation/ArmyFormationCreator';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import type { SiteLocale } from '@/lib/site-locale';

const ARMY_FORMATION_CREATOR_PATH = '/army-formation-creator';

const ARMY_FORMATION_CREATOR_CHINESE_FAQ = [
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
] as const;

function ArmyFormationCreatorChineseSeoContent() {
  return (
    <div className="mx-auto max-w-5xl border-t border-white/10 py-12 text-stone-100 sm:py-16">
      <section>
        <h2 className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl">
          什么是军阵制作器？
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          军阵制作器是一款用于绘制战场阵型示意图的在线工具。你可以在战场上放置不同类别的棋子，安排队伍与装备的位置，并调整角度、颜色、战场高度和背景。完成后可导出图片或方案文件，用于保存阵型构想、战术讨论与展示。
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl">
          如何使用军阵制作器？
        </h2>
        <ol aria-label="军阵制作器使用步骤" className="mt-5 space-y-4">
          <li>
            <h3 className="font-semibold leading-6 text-stone-50">选择棋子</h3>
            <p className="mt-1 text-sm leading-6 text-stone-300 text-pretty">
              在头盔、武器、动物、载具与攻城器械、北约符号等类别中选择图标，点击后将棋子放入战场。
            </p>
          </li>
          <li>
            <h3 className="font-semibold leading-6 text-stone-50">摆放阵型</h3>
            <p className="mt-1 text-sm leading-6 text-stone-300 text-pretty">
              在战场上拖动棋子来安排位置；选中棋子后，可以调整角度、颜色或删除棋子。
            </p>
          </li>
          <li>
            <h3 className="font-semibold leading-6 text-stone-50">设置战场</h3>
            <p className="mt-1 text-sm leading-6 text-stone-300 text-pretty">
              根据需要调整战场高度和底色，或为战场设置背景图。
            </p>
          </li>
          <li>
            <h3 className="font-semibold leading-6 text-stone-50">导出作品</h3>
            <p className="mt-1 text-sm leading-6 text-stone-300 text-pretty">
              导出战场图片用于展示，也可以导出方案文件留存；之后选择方案文件即可继续编辑。
            </p>
          </li>
        </ol>
      </section>

      <section className="mt-12 rounded-3xl border border-[#d7b46a]/25 bg-[#d7b46a]/[0.07] p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl">
              现在开始布置军阵
            </h2>
            <p className="mt-2 text-sm leading-7 text-stone-300 text-pretty">
              挑选棋子，安排队伍位置，制作你的战场阵型示意图。
            </p>
          </div>
          <a
            href="#army-formation-creator-editor"
            className="site-cta-primary min-h-11 shrink-0 justify-center focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none!"
          >
            开始制作
          </a>
        </div>
      </section>

      <section className="mt-12 border-t border-white/10 pt-10">
        <h2 className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl">
          常见问题
        </h2>
        <div className="mt-4 divide-y divide-white/10">
          {ARMY_FORMATION_CREATOR_CHINESE_FAQ.map((item) => (
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
      {locale === 'zh' ? <ArmyFormationCreatorChineseSeoContent /> : null}
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
