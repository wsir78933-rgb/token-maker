import { Mail, MessageSquareText, ShieldCheck } from 'lucide-react';

import { ContactForm } from '@/components/site/ContactForm';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { PageBreadcrumbs } from '@/components/site/PageBreadcrumbs';
import { StructuredData } from '@/components/site/StructuredData';
import { absoluteUrl } from '@/lib/site-content';
import { buildBreadcrumbStructuredData } from '@/lib/site-page-models';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

const copyByLocale = {
  en: {
    editor: 'Editor',
    contact: 'Contact',
    eyebrow: 'Contact',
    title: 'Contact Token Maker',
    description:
      'Send a note about bugs, workflow questions, missing token styles, or practical feedback about the editor.',
    intro:
      'Messages are delivered to the site inbox through Resend. Add the email address you want me to reply to.',
    formEyebrow: 'Email form',
    sideTitle: 'Good details to include',
    details: [
      'What page or workflow you were using.',
      'What you expected to happen.',
      'Browser, device, or VTT context when it matters.',
    ],
    privacyTitle: 'What this sends',
    privacyText:
      'The contact form sends your name, email address, message, and language context so I can reply. Do not attach private campaign art here.',
  },
  zh: {
    editor: '编辑器',
    contact: '联系',
    eyebrow: '联系',
    title: '联系 Token Maker',
    description: '反馈 bug、工作流问题、缺少的 token 样式，或者任何关于编辑器的实际使用建议。',
    intro: '消息会通过 Resend 发送到站点收件箱。请填写你希望我回复的邮箱。',
    formEyebrow: '邮件表单',
    sideTitle: '建议一起说明',
    details: [
      '你当时使用的是哪个页面或流程。',
      '你原本预期会发生什么。',
      '必要时写上浏览器、设备或 VTT 使用场景。',
    ],
    privacyTitle: '这个表单会发送什么',
    privacyText:
      '联系表单会发送你的称呼、邮箱、消息内容和语言环境，方便我回复。不要在这里提交私密战役素材。',
  },
} as const;

export function ContactPageView({ locale }: { locale: SiteLocale }) {
  const copy = copyByLocale[locale];
  const breadcrumbs = [
    { label: copy.editor, href: getLocalizedPath(locale, '/') },
    { label: copy.contact },
  ];
  const contactPath = getLocalizedPath(locale, '/contact');

  return (
    <>
      <StructuredData
        id={`contact-${locale}-page-jsonld`}
        data={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: copy.title,
          description: copy.description,
          url: absoluteUrl(contactPath),
        }}
      />
      <StructuredData
        id={`contact-${locale}-breadcrumb-jsonld`}
        data={buildBreadcrumbStructuredData(locale, [
          { name: copy.editor, path: '/' },
          { name: copy.contact, path: '/contact' },
        ])}
      />

      <InnerPageChrome locale={locale} currentPath="/contact" tone="doc">
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-18">
            <PageBreadcrumbs items={breadcrumbs} />
            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.12fr)_320px]">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-[#d7b46a]" />
                  <p className="text-xs uppercase tracking-[0.34em] text-stone-500">{copy.eyebrow}</p>
                </div>
                <h1 className="font-display max-w-4xl text-4xl leading-none text-stone-50 sm:text-5xl">
                  {copy.title}
                </h1>
                <p className="max-w-3xl text-base leading-8 text-stone-300">{copy.description}</p>
                <p className="max-w-3xl text-sm leading-8 text-stone-400">{copy.intro}</p>
              </div>

              <aside className="rounded-[34px] border border-[#d7b46a]/18 bg-[linear-gradient(180deg,rgba(215,180,106,0.12),rgba(255,255,255,0.03))] p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d7b46a]/30 bg-[#d7b46a]/10 text-[#f1d492]">
                  <MessageSquareText className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-xl font-medium text-stone-50">{copy.sideTitle}</h2>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-300">
                  {copy.details.map((detail) => (
                    <li key={detail} className="flex gap-3">
                      <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d7b46a]" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-8 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8 lg:py-16">
          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.34em] text-stone-500">{copy.formEyebrow}</p>
            <ContactForm locale={locale} />
          </div>

          <aside className="lg:sticky lg:top-30 lg:self-start">
            <article className="rounded-[30px] border border-white/10 bg-black/25 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#f1d492]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-lg font-medium text-stone-50">{copy.privacyTitle}</h2>
              <p className="mt-3 text-sm leading-7 text-stone-400">{copy.privacyText}</p>
            </article>
          </aside>
        </section>
      </InnerPageChrome>
    </>
  );
}
