// @vitest-environment jsdom

import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TemplatePageView } from './TemplatePageView';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

function getStructuredDataGraph(scriptId: string) {
  const structuredDataScript = document.getElementById(scriptId);

  if (!structuredDataScript?.textContent) {
    throw new Error(`Expected structured data script ${scriptId} to render.`);
  }

  const structuredData = JSON.parse(structuredDataScript.textContent) as {
    '@graph': Array<Record<string, unknown>>;
  };

  return structuredData['@graph'];
}

describe('TemplatePageView', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders localized Chinese WebApplication featureList in JSON-LD', () => {
    render(<TemplatePageView locale="zh" slug="square-token-maker" />);

    const webApplication = getStructuredDataGraph('template-zh-square-token-maker-jsonld').find(
      (graphItem) => graphItem['@type'] === 'WebApplication',
    );

    expect(webApplication?.featureList).toEqual([
      '方形 Token 裁切',
      'Token 边框选择',
      '透明 PNG 导出',
      '支持 Roll20 与 Foundry VTT 工作流',
    ]);
  });
});
