'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';

import { validateTableDocument } from '@/lib/periodic-table-creator/table';
import type { PeriodicTableDocument } from '@/lib/periodic-table-creator/types';

export type PeriodicTableCaseLoadRequest = {
  requestId: number;
  document: PeriodicTableDocument;
  statusMessage: string;
};

type PeriodicTableCaseLoadContextValue = {
  request: PeriodicTableCaseLoadRequest | null;
  requestTable: (document: PeriodicTableDocument, statusMessage: string) => void;
  workspaceId: string;
};

const PeriodicTableCaseLoadContext = createContext<PeriodicTableCaseLoadContextValue | null>(null);

function requireWorkspaceId(workspaceId: unknown): string {
  if (typeof workspaceId !== 'string' || workspaceId.trim().length === 0) {
    throw new Error(
      `Periodic table case load workspaceId must be a non-empty string. Received ${JSON.stringify(workspaceId)}.`,
    );
  }

  return workspaceId;
}

function requireStatusMessage(statusMessage: unknown): string {
  if (typeof statusMessage !== 'string' || statusMessage.trim().length === 0) {
    throw new Error(
      `Periodic table case load statusMessage must be a non-empty string. Received ${JSON.stringify(statusMessage)}.`,
    );
  }

  return statusMessage;
}

function createCaseLoadRequest(
  requestId: number,
  document: PeriodicTableDocument,
  statusMessage: string,
): PeriodicTableCaseLoadRequest {
  return { requestId, document, statusMessage };
}

export function PeriodicTableCreatorCaseLoadProvider({
  children,
  workspaceId,
}: {
  children: ReactNode;
  workspaceId: string;
}) {
  const validatedWorkspaceId = requireWorkspaceId(workspaceId);
  const [request, setRequest] = useState<PeriodicTableCaseLoadRequest | null>(null);
  const requestIdRef = useRef(0);

  const requestTable = useCallback((document: PeriodicTableDocument, statusMessage: string) => {
    const checkedDocument = validateTableDocument(document);
    const checkedStatusMessage = requireStatusMessage(statusMessage);
    requestIdRef.current += 1;
    setRequest(createCaseLoadRequest(requestIdRef.current, checkedDocument, checkedStatusMessage));
  }, []);

  const contextValue = useMemo<PeriodicTableCaseLoadContextValue>(
    () => ({ request, requestTable, workspaceId: validatedWorkspaceId }),
    [request, requestTable, validatedWorkspaceId],
  );

  return (
    <PeriodicTableCaseLoadContext.Provider value={contextValue}>
      {children}
    </PeriodicTableCaseLoadContext.Provider>
  );
}

export function usePeriodicTableCaseLoad(): {
  request: PeriodicTableCaseLoadRequest | null;
  requestTable: (document: PeriodicTableDocument, statusMessage: string) => void;
} | null {
  const contextValue = useContext(PeriodicTableCaseLoadContext);
  if (contextValue === null) return null;
  return {
    request: contextValue.request,
    requestTable: contextValue.requestTable,
  };
}

export function usePeriodicTableCaseLoadWorkspaceId(): string | null {
  return useContext(PeriodicTableCaseLoadContext)?.workspaceId ?? null;
}
