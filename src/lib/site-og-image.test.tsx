import { isValidElement, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { createSeoImage } from '@/lib/site-og-image';

vi.mock('next/og', () => ({
  ImageResponse: class MockImageResponse {
    element: ReactNode;

    constructor(element: ReactNode) {
      this.element = element;
    }
  },
}));

function collectText(node: ReactNode): string[] {
  if (node === null || node === undefined || typeof node === 'boolean') {
    return [];
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return [String(node)];
  }

  if (Array.isArray(node)) {
    return node.flatMap((childNode) => collectText(childNode));
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return collectText(node.props.children);
  }

  return [];
}

function getSeoImageText(response: unknown) {
  const { element } = response as { element: ReactNode };

  return collectText(element).join(' ');
}

describe('createSeoImage', () => {
  it('renders footer copy from the image options', () => {
    const seoImageOptions = {
      locale: 'zh' as const,
      eyebrow: 'VTT Token 制作器',
      title: 'Token Maker',
      description: '中文描述',
      chips: ['DnD Token'],
      footerKicker: '浏览器 Token 工作台',
      footerMeta: 'DnD / Roll20 / Foundry VTT',
    };

    const imageText = getSeoImageText(createSeoImage(seoImageOptions));

    expect(imageText).toContain('浏览器 Token 工作台');
    expect(imageText).toContain('DnD / Roll20 / Foundry VTT');
    expect(imageText).not.toContain('Browser token workshop');
  });
});
