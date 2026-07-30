import { describe, expect, it, vi } from 'vitest';

describe('coat project store hydration', () => {
  it('renders a stable initial document before client locale initialization', async () => {
    vi.resetModules();
    const { useCoatProjectStore } = await import('./store');

    const initialProject = useCoatProjectStore.getState().project;

    expect(initialProject.id).toBe('00000000-0000-4000-8000-000000000001');
    expect(initialProject.layers.map((layer) => layer.id)).toEqual([
      '00000000-0000-4000-8000-000000000002',
      '00000000-0000-4000-8000-000000000003',
      '00000000-0000-4000-8000-000000000004',
      '00000000-0000-4000-8000-000000000005',
    ]);
  });
});
