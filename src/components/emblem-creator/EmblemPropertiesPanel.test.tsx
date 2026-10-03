// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getEmblemCreatorCopy } from '@/lib/emblem-creator/copy';
import { applyEmblemProjectCommand, createDefaultEmblemProject, createEmblemElement } from '@/lib/emblem-creator/project';
import type { EmblemElementTransform, EmblemLocale, EmblemProject } from '@/lib/emblem-creator/types';

import { EmblemPropertiesPanel, type EmblemPropertiesPanelProps } from './EmblemPropertiesPanel';

afterEach(cleanup);

function createSelectedProject(): EmblemProject {
  let project = createDefaultEmblemProject();
  for (const id of ['selected', 'other']) {
    project = applyEmblemProjectCommand(project, {
      type: 'add-element', layerId: 'details',
      element: createEmblemElement({ kind: 'url', url: '/test.png', naturalWidth: 200, naturalHeight: 100 }, id),
    });
  }
  return project;
}

function PropertiesHarness({ locale = 'en', onTransform = () => undefined }: {
  locale?: EmblemLocale;
  onTransform?: (id: string, transform: EmblemElementTransform) => void;
}) {
  const [project, setProject] = useState(createSelectedProject);
  const [selectedElementId, setSelectedElementId] = useState<string | null>('selected');
  const [showEditBounds, setShowEditBounds] = useState(false);
  return <>
    <EmblemPropertiesPanel locale={locale} copy={getEmblemCreatorCopy(locale)} project={project}
      selectedElementId={selectedElementId} showEditBounds={showEditBounds}
      onElementTransform={(id, transform) => {
        onTransform(id, transform);
        setProject(applyEmblemProjectCommand(project, { type: 'set-element-transform', elementId: id, transform }));
      }}
      onDeleteSelected={() => {
        if (selectedElementId === null) throw new Error('No selected element');
        setProject(applyEmblemProjectCommand(project, { type: 'remove-element', elementId: selectedElementId }));
        setSelectedElementId(null);
      }}
      onEditBoundsChange={setShowEditBounds} />
    <output data-testid="project">{JSON.stringify(project)}</output>
  </>;
}

function currentProject(): EmblemProject {
  return JSON.parse(screen.getByTestId('project').textContent!);
}

function editProperty(label: string, value: string) {
  const input = screen.getByLabelText(label);
  fireEvent.change(input, { target: { value } });
  fireEvent.blur(input);
}

describe('EmblemPropertiesPanel', () => {
  it.each(['en', 'zh'] as const)('updates only the selected element and keeps width/height proportional in %s', (locale) => {
    const copy = getEmblemCreatorCopy(locale);
    render(<PropertiesHarness locale={locale} />);
    const other = currentProject().layers.details.elements[1];
    editProperty(copy.properties.x, '321');
    editProperty(copy.properties.y, '654');
    editProperty(copy.properties.width, '400');
    expect((screen.getByLabelText(copy.properties.height) as HTMLInputElement).value).toBe('200');
    expect(currentProject().layers.details.elements[0].transform).toMatchObject({ x: 321, y: 654, scale: 2 });
    editProperty(copy.properties.height, '150');
    expect((screen.getByLabelText(copy.properties.width) as HTMLInputElement).value).toBe('300');
    expect(currentProject().layers.details.elements[0].transform.scale).toBe(1.5);
    expect(currentProject().layers.details.elements[1]).toEqual(other);
  });

  it.each([
    ['x', ''], ['y', '   '], ['width', 'abc'], ['height', 'Infinity'], ['width', '0'], ['height', '-1'],
    ['x', '-1'], ['y', '1025'],
  ] as const)('rejects %s input %j with the actual value and preserves the project', (field, value) => {
    const copy = getEmblemCreatorCopy('zh');
    const onTransform = vi.fn();
    render(<PropertiesHarness locale="zh" onTransform={onTransform} />);
    const project = currentProject();
    editProperty(copy.properties[field], value);
    expect(onTransform).not.toHaveBeenCalled();
    expect(currentProject()).toEqual(project);
    expect(screen.getByRole('alert').textContent).toContain(JSON.stringify(value));
    expect(screen.getByRole('alert').textContent).toContain(copy.properties[field]);
    expect(screen.getByLabelText(copy.properties[field]).getAttribute('aria-invalid')).toBe('true');
  });

  it('applies rotation explicitly and mirrors back on a second click without changing other fields', () => {
    const copy = getEmblemCreatorCopy('en');
    const onTransform = vi.fn();
    render(<PropertiesHarness onTransform={onTransform} />);
    editProperty(copy.properties.rotation, '90');
    expect(onTransform).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: copy.properties.applyRotation }));
    expect(currentProject().layers.details.elements[0].transform.rotation).toBe(90);
    fireEvent.click(screen.getByRole('button', { name: copy.properties.mirror }));
    expect(currentProject().layers.details.elements[0].transform.mirrorX).toBe(true);
    expect(screen.getByRole('button', { name: copy.properties.mirror }).getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: copy.properties.mirror }));
    expect(currentProject().layers.details.elements[0].transform).toMatchObject({ rotation: 90, mirrorX: false, x: 512, y: 512 });
    expect(currentProject().layers.details.elements[1].transform.rotation).toBe(0);
  });

  it('rejects an invalid rotation on Apply and leaves the selected transform intact', () => {
    const copy = getEmblemCreatorCopy('en');
    const onTransform = vi.fn();
    render(<PropertiesHarness onTransform={onTransform} />);
    editProperty(copy.properties.rotation, 'not-an-angle');
    fireEvent.click(screen.getByRole('button', { name: copy.properties.applyRotation }));
    expect(onTransform).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toContain('not-an-angle');
    expect(currentProject().layers.details.elements[0].transform.rotation).toBe(0);
  });

  it('deletes only the selection and keeps bounds available when the selection is empty', () => {
    const copy = getEmblemCreatorCopy('zh');
    render(<PropertiesHarness locale="zh" />);
    fireEvent.click(screen.getByLabelText(copy.properties.showEditBounds));
    expect((screen.getByLabelText(copy.properties.showEditBounds) as HTMLInputElement).checked).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: copy.properties.deleteSelected }));
    expect(currentProject().layers.details.elements.map((element) => element.id)).toEqual(['other']);
    expect(screen.getByText(copy.properties.emptySelection)).toBeDefined();
    expect(screen.queryByLabelText(copy.properties.x)).toBeNull();
    expect(screen.queryByRole('button', { name: copy.properties.deleteSelected })).toBeNull();
    fireEvent.click(screen.getByLabelText(copy.properties.showEditBounds));
    expect((screen.getByLabelText(copy.properties.showEditBounds) as HTMLInputElement).checked).toBe(false);
  });

  it('rereads a dragged transform from props and surfaces unknown callback errors', () => {
    const copy = getEmblemCreatorCopy('en');
    const project = createSelectedProject();
    const props: EmblemPropertiesPanelProps = {
      locale: 'en', copy, project, selectedElementId: 'selected', showEditBounds: false,
      onElementTransform: () => { throw 'transform rejected at boundary'; }, onDeleteSelected: vi.fn(), onEditBoundsChange: vi.fn(),
    };
    const { rerender } = render(<EmblemPropertiesPanel {...props} />);
    const movedProject = applyEmblemProjectCommand(project, {
      type: 'set-element-transform', elementId: 'selected',
      transform: { ...project.layers.details.elements[0].transform, x: 800, y: 900, scale: 3 },
    });
    rerender(<EmblemPropertiesPanel {...props} project={movedProject} />);
    expect((screen.getByLabelText(copy.properties.x) as HTMLInputElement).value).toBe('800');
    expect((screen.getByLabelText(copy.properties.height) as HTMLInputElement).value).toBe('300');
    editProperty(copy.properties.x, '123');
    expect(screen.getByRole('alert').textContent).toContain('transform rejected at boundary');
  });
});
