// @vitest-environment jsdom

import { act, cleanup, render, screen } from '@testing-library/react';
import { useEffect } from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { createBlankTable } from '@/lib/periodic-table-creator/table';
import type { PeriodicTableDocument } from '@/lib/periodic-table-creator/types';
import {
  PeriodicTableCreatorCaseLoadProvider,
  usePeriodicTableCaseLoad,
} from './PeriodicTableCreatorCaseLoadProvider';

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

function CaseLoadProbe() {
  const caseLoad = usePeriodicTableCaseLoad();

  return (
    <>
      <output data-testid="case-request-id">{caseLoad?.request?.requestId ?? 'none'}</output>
      <output data-testid="case-status">{caseLoad?.request?.statusMessage ?? 'none'}</output>
      <button
        type="button"
        onClick={() => {
          if (caseLoad === null) throw new Error('Case load provider is missing in the test tree.');
          caseLoad.requestTable(createCaseDocument('Ae'), 'Case loaded.');
        }}
      >
        Request case
      </button>
    </>
  );
}

afterEach(cleanup);

describe('PeriodicTableCreatorCaseLoadProvider', () => {
  it('returns null without a provider and publishes sequential requests', () => {
    const withoutProvider = render(<CaseLoadProbe />);
    expect(screen.getByTestId('case-request-id').textContent).toBe('none');
    withoutProvider.unmount();

    render(
      <PeriodicTableCreatorCaseLoadProvider workspaceId="periodic-table-workspace">
        <CaseLoadProbe />
      </PeriodicTableCreatorCaseLoadProvider>,
    );

    expect(screen.getByTestId('case-request-id').textContent).toBe('none');
    act(() => screen.getByRole('button', { name: 'Request case' }).click());
    expect(screen.getByTestId('case-request-id').textContent).toBe('1');
    expect(screen.getByTestId('case-status').textContent).toBe('Case loaded.');
    act(() => screen.getByRole('button', { name: 'Request case' }).click());
    expect(screen.getByTestId('case-request-id').textContent).toBe('2');
  });

  it('fails fast for invalid workspace and status values', () => {
    expect(() =>
      render(
        <PeriodicTableCreatorCaseLoadProvider workspaceId="">
          <CaseLoadProbe />
        </PeriodicTableCreatorCaseLoadProvider>,
      ),
    ).toThrow('Received ""');

    const requestCase = { current: null as (() => void) | null };
    function RequestCapture() {
      const caseLoad = usePeriodicTableCaseLoad();
      useEffect(() => {
        requestCase.current = () => {
          if (caseLoad === null) throw new Error('Case load provider is missing in the test tree.');
          caseLoad.requestTable(createCaseDocument('Ae'), '');
        };
        return () => {
          requestCase.current = null;
        };
      }, [caseLoad]);
      return null;
    }

    render(
      <PeriodicTableCreatorCaseLoadProvider workspaceId="periodic-table-workspace">
        <RequestCapture />
      </PeriodicTableCreatorCaseLoadProvider>,
    );

    expect(requestCase.current).not.toBeNull();
    expect(() => requestCase.current?.()).toThrow('Received ""');
  });
});
