import { describe, expect, it } from 'vitest';
import { getPreviewBackingSize } from './preview-rendering';

describe('getPreviewBackingSize', () => {
  it('caps a high-DPR mobile preview at 1024 pixels', () => {
    expect(getPreviewBackingSize(512, 3, true)).toBe(1024);
  });

  it('keeps the full backing resolution on desktop', () => {
    expect(getPreviewBackingSize(512, 3, false)).toBe(1536);
  });
});
