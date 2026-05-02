'use client';

import { FormEvent, useState } from 'react';
import { Loader2, Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { SiteLocale } from '@/lib/site-locale';

type ContactStatus = 'idle' | 'submitting' | 'success' | 'error';

const copyByLocale = {
  en: {
    name: 'Name',
    email: 'Email',
    message: 'Message',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'you@example.com',
    messagePlaceholder: 'Tell me what you need help with.',
    submit: 'Send message',
    sending: 'Sending',
    success: 'Message sent. I will reply by email when I can.',
    fallbackError: 'The message could not be sent. Please try again later.',
    errors: {
      invalid_name: 'Use a name between 2 and 80 characters.',
      invalid_email: 'Use a valid email address.',
      invalid_message: 'Use a message between 10 and 4000 characters.',
      rate_limited: 'Too many messages were sent from this connection. Try again later.',
      email_not_configured: 'Email is not configured yet.',
      email_send_failed: 'Resend could not send the message. Try again later.',
      invalid_json: 'The form submission was malformed.',
    },
  },
  zh: {
    name: '称呼',
    email: '邮箱',
    message: '消息',
    namePlaceholder: '你的称呼',
    emailPlaceholder: 'you@example.com',
    messagePlaceholder: '告诉我你遇到的问题或想反馈的内容。',
    submit: '发送消息',
    sending: '发送中',
    success: '消息已发送。我会尽快通过邮件回复。',
    fallbackError: '消息暂时无法发送，请稍后再试。',
    errors: {
      invalid_name: '称呼需要在 2 到 80 个字符之间。',
      invalid_email: '请输入有效邮箱地址。',
      invalid_message: '消息需要在 10 到 4000 个字符之间。',
      rate_limited: '当前连接发送次数过多，请稍后再试。',
      email_not_configured: '邮件服务还没有配置完成。',
      email_send_failed: 'Resend 暂时无法发送消息，请稍后再试。',
      invalid_json: '表单提交格式异常。',
    },
  },
} as const;

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

export function ContactForm({ locale }: { locale: SiteLocale }) {
  const copy = copyByLocale[locale];
  const [status, setStatus] = useState<ContactStatus>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setMessage('');

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: readFormValue(formData, 'name'),
          email: readFormValue(formData, 'email'),
          message: readFormValue(formData, 'message'),
          website: readFormValue(formData, 'website'),
          locale,
        }),
      });
      const result = (await response.json().catch(() => null)) as { error?: keyof typeof copy.errors } | null;

      if (!response.ok) {
        const errorMessage = result?.error ? copy.errors[result.error] : copy.fallbackError;
        setStatus('error');
        setMessage(errorMessage);
        return;
      }

      form.reset();
      setStatus('success');
      setMessage(copy.success);
    } catch {
      setStatus('error');
      setMessage(copy.fallbackError);
    }
  }

  const isSubmitting = status === 'submitting';
  const fieldClass =
    'mt-2 w-full rounded-[18px] border border-white/10 bg-black/25 px-4 py-3 text-sm text-stone-50 outline-none transition placeholder:text-stone-600 focus:border-[#d7b46a]/50 focus:ring-2 focus:ring-[#d7b46a]/20';

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.02))] p-6 shadow-[0_28px_100px_-58px_rgba(0,0,0,0.72)]"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="text-sm font-medium text-stone-100">
            {copy.name}
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={80}
            autoComplete="name"
            placeholder={copy.namePlaceholder}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="text-sm font-medium text-stone-100">
            {copy.email}
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            placeholder={copy.emailPlaceholder}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="contact-message" className="text-sm font-medium text-stone-100">
          {copy.message}
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={4000}
          rows={8}
          placeholder={copy.messagePlaceholder}
          className={`${fieldClass} resize-y leading-7`}
        />
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 rounded-full bg-[#d7b46a] px-5 text-sm font-semibold text-stone-950 hover:bg-[#e4c57f]"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {isSubmitting ? copy.sending : copy.submit}
        </Button>

        {message ? (
          <p
            role="status"
            className={status === 'success' ? 'text-sm text-[#f1d492]' : 'text-sm text-red-300'}
          >
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
