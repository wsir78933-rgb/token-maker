// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { HomeSeoContent } from './HomeSeoContent';

describe('HomeSeoContent', () => {
  afterEach(() => {
    cleanup();
  });

  it('adds a dedicated attention effect class only to the feedback CTA', () => {
    render(<HomeSeoContent locale="zh" />);

    const feedbackLink = screen.getByRole('link', { name: /发送反馈/ });
    const footerContactLink = screen.getByRole('link', { name: '联系' });

    expect(feedbackLink.className).toContain('site-feedback-cta');
    expect(footerContactLink.className).not.toContain('site-feedback-cta');
  });
});
