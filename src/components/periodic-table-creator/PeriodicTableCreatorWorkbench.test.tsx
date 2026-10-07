// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getPeriodicTableCopy } from '@/lib/periodic-table-creator/copy';
import { PERIODIC_TABLE_STORAGE_KEY } from '@/lib/periodic-table-creator/storage';
import { createBlankTable } from '@/lib/periodic-table-creator/table';
import type { PeriodicTableDocument } from '@/lib/periodic-table-creator/types';
import {
  PeriodicTableCreatorCaseLoadProvider,
  usePeriodicTableCaseLoad,
} from './PeriodicTableCreatorCaseLoadProvider';
import { PeriodicTableCreatorWorkbench } from './PeriodicTableCreatorWorkbench';

const copy = getPeriodicTableCopy('en');

function gridField(container: HTMLElement, field = 'symbol') {
  const fieldElement = container.querySelector<HTMLDivElement>(`[data-cell-id="cell-1-1"] [data-field="${field}"]`);
  if (!fieldElement) throw new Error(`Expected first cell field ${field}.`);
  return fieldElement;
}

function typeInGrid(container: HTMLElement, text: string) {
  const symbol = gridField(container);
  act(() => symbol.focus());
  symbol.textContent = text;
  fireEvent.input(symbol);
}

function createCaseDocument(symbol: string): PeriodicTableDocument {
  const blankDocument = createBlankTable(4, 6);
  return {
    ...blankDocument,
    cells: blankDocument.cells.map((cell, cellIndex) =>
      cellIndex === 0
        ? { ...cell, text: { ...cell.text, symbol } }
        : cell,
    ),
  };
}

function CaseLoadButton({ label, caseDocument }: { label: string; caseDocument: PeriodicTableDocument }) {
  const caseLoad = usePeriodicTableCaseLoad();

  return (
    <button
      type="button"
      onClick={() => {
        if (caseLoad === null) throw new Error('Case load provider is missing in the test tree.');
        caseLoad.requestTable(caseDocument, `${label} loaded.`);
      }}
    >
      {label}
    </button>
  );
}

function renderCaseWorkbench(caseButtons: ReactNode) {
  const workspaceId = 'periodic-table-case-workspace';
  return render(
    <PeriodicTableCreatorCaseLoadProvider workspaceId={workspaceId}>
      <section id={workspaceId}>
        <PeriodicTableCreatorWorkbench locale="en" />
      </section>
      {caseButtons}
    </PeriodicTableCreatorCaseLoadProvider>,
  );
}

const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;

function mockTableDownload() {
  const createObjectURL = vi.fn(() => 'blob:periodic-table-case');
  const revokeObjectURL = vi.fn();
  Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: createObjectURL });
  Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revokeObjectURL });
  const anchorClick = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
  return { createObjectURL, revokeObjectURL, anchorClick };
}

beforeEach(() => {
  window.localStorage.clear();
  vi.stubGlobal('matchMedia', vi.fn(() => ({
    matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn(),
  })));
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  cleanup();
  Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: originalCreateObjectURL });
  Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: originalRevokeObjectURL });
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('periodic table workbench integration', () => {
  it('does not ask to replace an untouched table after focusing and leaving an empty field', async () => {
    const { container } = render(<PeriodicTableCreatorWorkbench locale="en" />);
    const symbol = gridField(container);
    act(() => symbol.focus());
    fireEvent.blur(symbol);
    fireEvent.click(screen.getByRole('button', { name: copy.newTable }));
    fireEvent.click(screen.getByRole('button', { name: copy.realTemplate }));
    await waitFor(() => expect(container.querySelector('[role="grid"]')?.getAttribute('aria-rowcount')).toBe('9'));
    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('protects actual text edits and preserves them when replacement is cancelled', async () => {
    const { container } = render(<PeriodicTableCreatorWorkbench locale="en" />);
    typeInGrid(container, 'Ae');
    fireEvent.click(screen.getByRole('button', { name: copy.newTable }));
    fireEvent.click(screen.getByRole('button', { name: copy.createBlank }));
    const confirmation = screen.getByRole('alertdialog');
    expect(within(confirmation).getByText(copy.confirmReplaceTitle)).toBeTruthy();
    fireEvent.click(within(confirmation).getByRole('button', { name: copy.cancel }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
    expect(gridField(container).textContent).toBe('Ae');
  });

  it('saves manually, confirms overwrite, and reloads text and selected state', async () => {
    const { container } = render(<PeriodicTableCreatorWorkbench locale="en" />);
    typeInGrid(container, 'Ae');
    fireEvent.click(screen.getByRole('button', { name: copy.slots }));
    fireEvent.click(screen.getByRole('button', { name: `${copy.save} ${copy.slot.replace('{slot}', '1')}` }));
    const serialized = window.localStorage.getItem(PERIODIC_TABLE_STORAGE_KEY);
    expect(serialized).not.toBeNull();
    const storedSlots = JSON.parse(serialized!);
    expect(storedSlots).toHaveLength(5);
    expect(storedSlots[0].document.cells[0].selected).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: `${copy.save} ${copy.slot.replace('{slot}', '1')}` }));
    expect(screen.getByRole('alertdialog')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: copy.cancel }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
    fireEvent.click(screen.getByRole('button', { name: copy.close }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    typeInGrid(container, 'New');
    fireEvent.click(screen.getByRole('button', { name: copy.slots }));
    fireEvent.click(screen.getByRole('button', { name: `${copy.load} ${copy.slot.replace('{slot}', '1')}` }));
    fireEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: copy.replace }));
    await waitFor(() => expect(gridField(container).textContent).toBe('Ae'));
    expect(container.querySelector('[data-cell-id="cell-1-1"]')?.getAttribute('aria-selected')).toBe('true');
  });

  it('keeps the table intact and displays an error for an unsafe file', async () => {
    const { container } = render(<PeriodicTableCreatorWorkbench locale="en" />);
    typeInGrid(container, 'Safe');
    const file = new File(['<script>alert(1)</script><table></table>'], 'unsafe.txt', { type: 'text/plain' });
    Object.defineProperty(file, 'text', { value: async () => '<script>alert(1)</script><table></table>' });
    fireEvent.change(screen.getByLabelText(copy.fileInputLabel), { target: { files: [file] } });
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('SCRIPT'));
    expect(gridField(container).textContent).toBe('Safe');
    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('clears a focused grid field when resetting the selected cell', async () => {
    const { container } = render(<PeriodicTableCreatorWorkbench locale="en" />);
    typeInGrid(container, 'Old');
    fireEvent.click(screen.getByRole('button', { name: copy.resetSelected }));
    fireEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: copy.resetSelected }));
    await waitFor(() => expect(gridField(container).textContent).toBe(''));
  });

  it('loads a case into the untouched workbench and focuses the workspace after commit', async () => {
    const scrollIntoView = Element.prototype.scrollIntoView as unknown as ReturnType<typeof vi.fn>;
    const caseDocument = createCaseDocument('Ae');
    const { container } = renderCaseWorkbench(
      <CaseLoadButton label="Load case" caseDocument={caseDocument} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Load case' }));

    await waitFor(() => expect(gridField(container).textContent).toBe('Ae'));
    const workspace = document.getElementById('periodic-table-case-workspace');
    expect(workspace?.getAttribute('tabindex')).toBe('-1');
    expect(document.activeElement).toBe(workspace);
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  });

  it('keeps an edited table on cancel and only focuses after confirmation', async () => {
    const scrollIntoView = Element.prototype.scrollIntoView as unknown as ReturnType<typeof vi.fn>;
    const caseDocument = createCaseDocument('Ae');
    const { container } = renderCaseWorkbench(
      <CaseLoadButton label="Load case" caseDocument={caseDocument} />,
    );
    typeInGrid(container, 'Edited');

    fireEvent.click(screen.getByRole('button', { name: 'Load case' }));
    expect(screen.getByRole('alertdialog')).toBeTruthy();
    expect(scrollIntoView).not.toHaveBeenCalled();
    fireEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: copy.cancel }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
    expect(gridField(container).textContent).toBe('Edited');
    expect(scrollIntoView).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Load case' }));
    fireEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: copy.replace }));
    await waitFor(() => expect(gridField(container).textContent).toBe('Ae'));
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it('saves the current table before replacing it when requested', async () => {
    const download = mockTableDownload();
    const caseDocument = createCaseDocument('Ae');
    const { container } = renderCaseWorkbench(
      <CaseLoadButton label="Load case" caseDocument={caseDocument} />,
    );
    typeInGrid(container, 'Edited');

    fireEvent.click(screen.getByRole('button', { name: 'Load case' }));
    const confirmation = screen.getByRole('alertdialog');
    fireEvent.click(within(confirmation).getByRole('button', { name: copy.saveFirst }));
    expect(download.createObjectURL).toHaveBeenCalledTimes(1);
    expect(download.anchorClick).toHaveBeenCalledTimes(1);
    expect(gridField(container).textContent).toBe('Edited');
    expect(screen.getByRole('alertdialog')).toBeTruthy();
  });

  it('handles the same case again and then a new case through fresh request ids', async () => {
    const { container } = renderCaseWorkbench(
      <>
        <CaseLoadButton label="Load case A" caseDocument={createCaseDocument('Ae')} />
        <CaseLoadButton label="Load case B" caseDocument={createCaseDocument('Bk')} />
      </>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Load case A' }));
    await waitFor(() => expect(gridField(container).textContent).toBe('Ae'));
    fireEvent.click(screen.getByRole('button', { name: 'Load case A' }));
    fireEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: copy.replace }));
    await waitFor(() => expect(gridField(container).textContent).toBe('Ae'));

    fireEvent.click(screen.getByRole('button', { name: 'Load case B' }));
    fireEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: copy.replace }));
    await waitFor(() => expect(gridField(container).textContent).toBe('Bk'));
  });

  it('rejects an invalid case before changing the table', () => {
    const invalidDocument = {} as PeriodicTableDocument;
    const requestInvalidCase = { current: null as (() => void) | null };
    function InvalidCaseRequestCapture() {
      const caseLoad = usePeriodicTableCaseLoad();
      useEffect(() => {
        requestInvalidCase.current = () => {
          if (caseLoad === null) throw new Error('Case load provider is missing in the test tree.');
          caseLoad.requestTable(invalidDocument, 'Invalid case loaded.');
        };
        return () => {
          requestInvalidCase.current = null;
        };
      }, [caseLoad]);
      return null;
    }
    const { container } = renderCaseWorkbench(
      <InvalidCaseRequestCapture />,
    );

    expect(requestInvalidCase.current).not.toBeNull();
    expect(() => requestInvalidCase.current?.()).toThrow(/Periodic table document/);
    expect(gridField(container).textContent).toBe('');
    expect(screen.queryByRole('alertdialog')).toBeNull();
  });
});
