// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getFamilyTreeCopy } from '@/lib/family-tree/copy';
import type { FamilyTreePerson, FamilyTreeScene } from '@/lib/family-tree/scene';

import { FamilyTreeCanvas } from './FamilyTreeCanvas';

vi.mock('./FamilyAvatar', () => ({
  FamilyAvatar: ({ label }: { label?: string }) => <span data-testid="family-avatar">{label}</span>,
}));

afterEach(cleanup);

function createPerson(generation: FamilyTreePerson['generation'], id: string, x: number): FamilyTreePerson {
  return {
    id,
    generation,
    x,
    avatar: {} as FamilyTreePerson['avatar'],
    name: `Person ${id}`,
    age: '30',
    description: '',
    endpoints: { top: 'none', bottom: 'none', left: 'none', right: 'none' },
  };
}

function createScene(overrides: Partial<FamilyTreeScene> = {}): FamilyTreeScene {
  return {
    version: 1,
    generations: [
      [createPerson(0, 'a', 20)],
      [createPerson(1, 'b', 120)],
      [createPerson(2, 'c', 220)],
      [createPerson(3, 'd', 320)],
    ],
    connections: [
      { id: 'gap-0', gap: 0, x: 40, width: 80 },
      { id: 'gap-1', gap: 1, x: 80, width: 100 },
      { id: 'gap-2', gap: 2, x: 120, width: 120 },
    ],
    selectedPersonId: 'b',
    resizeEnabled: true,
    ...overrides,
  };
}

describe('FamilyTreeCanvas', () => {
  it('renders four generations, three independent connection gaps, and selected endpoint controls', () => {
    const copy = getFamilyTreeCopy('en');
    render(
      <FamilyTreeCanvas
        scene={createScene()}
        copy={copy}
        selectedConnectionId="gap-1"
        onPersonSelect={vi.fn()}
        onPersonMove={vi.fn()}
        onPersonDelete={vi.fn()}
        onEndpointChange={vi.fn()}
        onConnectionSelect={vi.fn()}
        onConnectionMove={vi.fn()}
        onConnectionResize={vi.fn()}
        onOpenConnections={vi.fn()}
      />,
    );

    for (const generationLabel of Object.values(copy.generations)) {
      expect(screen.getByText(generationLabel)).toBeDefined();
    }
    for (const connectionLabel of Object.values(copy.connectionGaps)) {
      expect(screen.getByRole('button', { name: connectionLabel })).toBeDefined();
    }
    expect(screen.getByRole('region', { name: copy.familyCanvas })).toBeDefined();
    expect(screen.getAllByTestId('family-avatar')).toHaveLength(4);
    expect(screen.getAllByRole('button', { name: /Top:|Bottom:|Left:|Right:/ })).toHaveLength(4);
  });

  it('selects and deselects a person, moves it horizontally with pointer and keyboard input, and changes an endpoint', () => {
    const copy = getFamilyTreeCopy('en');
    const onPersonSelect = vi.fn();
    const onPersonMove = vi.fn();
    const onEndpointChange = vi.fn();
    render(
      <FamilyTreeCanvas
        scene={createScene()}
        copy={copy}
        selectedConnectionId={null}
        onPersonSelect={onPersonSelect}
        onPersonMove={onPersonMove}
        onPersonDelete={vi.fn()}
        onEndpointChange={onEndpointChange}
        onConnectionSelect={vi.fn()}
        onConnectionMove={vi.fn()}
        onConnectionResize={vi.fn()}
        onOpenConnections={vi.fn()}
      />,
    );

    const selectedPersonButton = screen.getByRole('button', { name: 'Person b' });
    fireEvent.click(selectedPersonButton);
    expect(onPersonSelect).toHaveBeenCalledWith(null);

    const personButton = screen.getByRole('button', { name: 'Person a' });
    fireEvent.pointerDown(personButton, { button: 0, isPrimary: true, pointerId: 1, clientX: 100 });
    fireEvent.pointerMove(personButton, { pointerId: 1, clientX: 132 });
    fireEvent.pointerUp(personButton, { pointerId: 1, clientX: 132 });
    expect(onPersonMove).toHaveBeenCalledWith('a', 52);

    fireEvent.keyDown(personButton, { key: 'ArrowRight' });
    expect(onPersonMove).toHaveBeenCalledWith('a', 36);

    const topEndpointButton = screen.getByRole('button', { name: 'Top: None' });
    fireEvent.click(topEndpointButton);
    expect(onEndpointChange).toHaveBeenCalledWith('b', 'top', 'solid');
  });

  it('moves a selected connection and resizes it only when the scene enables handles', () => {
    const copy = getFamilyTreeCopy('en');
    const onConnectionMove = vi.fn();
    const onConnectionResize = vi.fn();
    render(
      <FamilyTreeCanvas
        scene={createScene()}
        copy={copy}
        selectedConnectionId="gap-1"
        onPersonSelect={vi.fn()}
        onPersonMove={vi.fn()}
        onPersonDelete={vi.fn()}
        onEndpointChange={vi.fn()}
        onConnectionSelect={vi.fn()}
        onConnectionMove={onConnectionMove}
        onConnectionResize={onConnectionResize}
        onOpenConnections={vi.fn()}
      />,
    );

    const connection = screen.getByRole('button', { name: copy.connectionGaps.generation2To3 });
    fireEvent.pointerDown(connection, { button: 0, isPrimary: true, pointerId: 2, clientX: 100 });
    fireEvent.pointerMove(connection, { pointerId: 2, clientX: 130 });
    fireEvent.pointerUp(connection, { pointerId: 2, clientX: 130 });
    expect(onConnectionMove).toHaveBeenCalledWith('gap-1', 110);

    const handles = screen.getAllByRole('button', { name: /Generation 2–3 (Left|Right)/ });
    expect(handles).toHaveLength(2);
    fireEvent.pointerDown(handles[1], { button: 0, isPrimary: true, pointerId: 3, clientX: 200 });
    fireEvent.pointerMove(handles[1], { pointerId: 3, clientX: 240 });
    fireEvent.pointerUp(handles[1], { pointerId: 3, clientX: 240 });
    expect(onConnectionResize).toHaveBeenCalledWith('gap-1', 80, 140);
  });

  it('supports keyboard movement and edge resizing for the selected connection', () => {
    const copy = getFamilyTreeCopy('en');
    const onConnectionMove = vi.fn();
    const onConnectionResize = vi.fn();
    render(
      <FamilyTreeCanvas
        scene={createScene()}
        copy={copy}
        selectedConnectionId="gap-1"
        onPersonSelect={vi.fn()}
        onPersonMove={vi.fn()}
        onPersonDelete={vi.fn()}
        onEndpointChange={vi.fn()}
        onConnectionSelect={vi.fn()}
        onConnectionMove={onConnectionMove}
        onConnectionResize={onConnectionResize}
        onOpenConnections={vi.fn()}
      />,
    );

    const connection = screen.getByRole('button', { name: copy.connectionGaps.generation2To3 });
    fireEvent.keyDown(connection, { key: 'ArrowRight' });
    expect(onConnectionMove).toHaveBeenCalledWith('gap-1', 96);

    const handles = screen.getAllByRole('button', { name: /Generation 2–3 (Left|Right)/ });
    fireEvent.keyDown(handles[0], { key: 'ArrowLeft' });
    expect(onConnectionResize).toHaveBeenCalledWith('gap-1', 64, 116);
    fireEvent.keyDown(handles[1], { key: 'ArrowLeft' });
    expect(onConnectionResize).toHaveBeenCalledWith('gap-1', 80, 84);
  });

  it('does not shrink a connection below the domain minimum while using keyboard handles', () => {
    const copy = getFamilyTreeCopy('en');
    const onConnectionResize = vi.fn();
    render(
      <FamilyTreeCanvas
        scene={createScene({ connections: [{ id: 'gap-1', gap: 1, x: 80, width: 24 }] })}
        copy={copy}
        selectedConnectionId="gap-1"
        onPersonSelect={vi.fn()}
        onPersonMove={vi.fn()}
        onPersonDelete={vi.fn()}
        onEndpointChange={vi.fn()}
        onConnectionSelect={vi.fn()}
        onConnectionMove={vi.fn()}
        onConnectionResize={onConnectionResize}
        onOpenConnections={vi.fn()}
      />,
    );

    fireEvent.keyDown(screen.getAllByRole('button', { name: /Generation 2–3 (Left|Right)/ })[0], { key: 'ArrowRight' });
    fireEvent.keyDown(screen.getAllByRole('button', { name: /Generation 2–3 (Left|Right)/ })[1], { key: 'ArrowLeft' });
    expect(onConnectionResize).not.toHaveBeenCalled();
  });

  it('does not render resize handles when resize is disabled', () => {
    const copy = getFamilyTreeCopy('en');
    render(
      <FamilyTreeCanvas
        scene={createScene({ resizeEnabled: false })}
        copy={copy}
        selectedConnectionId="gap-1"
        onPersonSelect={vi.fn()}
        onPersonMove={vi.fn()}
        onPersonDelete={vi.fn()}
        onEndpointChange={vi.fn()}
        onConnectionSelect={vi.fn()}
        onConnectionMove={vi.fn()}
        onConnectionResize={vi.fn()}
        onOpenConnections={vi.fn()}
      />,
    );

    expect(screen.queryByRole('button', { name: /Generation 2–3 (Left|Right)/ })).toBeNull();
  });

  it('renders dashed endpoints as a single oriented border without a filled bar', () => {
    const copy = getFamilyTreeCopy('en');
    const selectedPerson = createPerson(1, 'b', 120);
    selectedPerson.endpoints = { top: 'solid', bottom: 'none', left: 'none', right: 'dashed' };
    render(
      <FamilyTreeCanvas
        scene={createScene({ generations: [[createPerson(0, 'a', 20)], [selectedPerson], [createPerson(2, 'c', 220)], [createPerson(3, 'd', 320)]] })}
        copy={copy}
        selectedConnectionId={null}
        onPersonSelect={vi.fn()}
        onPersonMove={vi.fn()}
        onPersonDelete={vi.fn()}
        onEndpointChange={vi.fn()}
        onConnectionSelect={vi.fn()}
        onConnectionMove={vi.fn()}
        onConnectionResize={vi.fn()}
        onOpenConnections={vi.fn()}
      />,
    );

    const dashedEndpoint = document.querySelector('[data-endpoint-direction="right"]');
    expect(dashedEndpoint?.getAttribute('data-endpoint-style')).toBe('dashed');
    expect((dashedEndpoint as HTMLElement | null)?.style.backgroundColor).toBe('');
    expect((dashedEndpoint as HTMLElement | null)?.style.borderTopStyle).toBe('dashed');
    expect((dashedEndpoint as HTMLElement | null)?.className).toContain('endpointHorizontal');
  });
});
