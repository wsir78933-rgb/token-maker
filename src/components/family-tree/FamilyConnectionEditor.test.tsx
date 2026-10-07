// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getFamilyTreeCopy } from '@/lib/family-tree/copy';
import type { FamilyTreePerson } from '@/lib/family-tree/scene';

import { FamilyConnectionEditor } from './FamilyConnectionEditor';

afterEach(cleanup);

function selectedPerson(): FamilyTreePerson {
  return {
    id: 'person-b',
    generation: 1,
    x: 50,
    avatar: {} as FamilyTreePerson['avatar'],
    name: 'Person B',
    age: '30',
    description: '',
    endpoints: { top: 'none', bottom: 'solid', left: 'dashed', right: 'none' },
  };
}

describe('FamilyConnectionEditor', () => {
  it('exposes all four endpoint directions and all three styles', () => {
    const copy = getFamilyTreeCopy('en');
    const onEndpointChange = vi.fn();
    render(
      <FamilyConnectionEditor
        selectedPerson={selectedPerson()}
        connections={[]}
        copy={copy}
        selectedConnectionId={null}
        resizeEnabled={false}
        onEndpointChange={onEndpointChange}
        onAddConnection={vi.fn()}
        onConnectionSelect={vi.fn()}
        onResizeEnabledChange={vi.fn()}
        onClearConnections={vi.fn()}
      />,
    );

    expect(screen.getAllByRole('group')).toHaveLength(4);
    expect(screen.getAllByRole('button', { name: 'None' })).toHaveLength(4);
    expect(screen.getAllByRole('button', { name: 'Solid' })).toHaveLength(4);
    expect(screen.getAllByRole('button', { name: 'Dashed' })).toHaveLength(4);

    fireEvent.click(screen.getAllByRole('button', { name: 'Dashed' })[0]);
    expect(onEndpointChange).toHaveBeenCalledWith('top', 'dashed');
  });

  it('offers all three generation gaps, selects a connection, toggles resize, and clears only connections', () => {
    const copy = getFamilyTreeCopy('en');
    const onAddConnection = vi.fn();
    const onConnectionSelect = vi.fn();
    const onResizeEnabledChange = vi.fn();
    const onClearConnections = vi.fn();
    render(
      <FamilyConnectionEditor
        selectedPerson={null}
        connections={[
          { id: 'connection-1', gap: 0, x: 10, width: 40 },
          { id: 'connection-2', gap: 1, x: 20, width: 60 },
          { id: 'connection-3', gap: 2, x: 30, width: 80 },
        ]}
        copy={copy}
        selectedConnectionId="connection-2"
        resizeEnabled={false}
        onEndpointChange={vi.fn()}
        onAddConnection={onAddConnection}
        onConnectionSelect={onConnectionSelect}
        onResizeEnabledChange={onResizeEnabledChange}
        onClearConnections={onClearConnections}
      />,
    );

    const gapButtons = Object.values(copy.connectionGaps).map((label) =>
      screen.getByRole('button', { name: `${copy.addConnection}: ${label}` }),
    );
    gapButtons.forEach((button) => fireEvent.click(button));
    expect(onAddConnection.mock.calls.map(([gap]) => gap)).toEqual([0, 1, 2]);

    fireEvent.click(screen.getByRole('button', { name: /Generation 2–3 · 1/ }));
    expect(onConnectionSelect).toHaveBeenCalledWith(null);
    fireEvent.click(screen.getByRole('button', { name: copy.resizeDisabled }));
    expect(onResizeEnabledChange).toHaveBeenCalledWith(true);
    fireEvent.click(screen.getByRole('button', { name: copy.clearConnections }));
    expect(onClearConnections).toHaveBeenCalledOnce();
  });
});
