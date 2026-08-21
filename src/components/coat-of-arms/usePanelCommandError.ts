'use client';

import { useCallback, useState } from 'react';
import { useCoatProjectStore, type CoatProjectDispatchResult } from '@/lib/coat-of-arms/store';
import type { CoatProjectCommand } from '@/lib/coat-of-arms/commands';
import type { CoatLocale } from '@/lib/coat-of-arms/types';
import { getCoatWorkbenchCopy } from './workbench-copy';

/** Converts command validation failures into an accessible panel-local error. */
export function usePanelCommandError(locale: CoatLocale) {
  const dispatch = useCoatProjectStore((state) => state.dispatch);
  const [error, setError] = useState<string | null>(null);
  const copy = getCoatWorkbenchCopy(locale);
  const reportError = useCallback((caught: unknown) => {
    const message = caught instanceof Error ? caught.message : String(caught);
    setError(copy.panels.commandFailed(message));
  }, [copy.panels]);
  const runWithResult = useCallback((command: CoatProjectCommand): CoatProjectDispatchResult | null => {
    try {
      const result = dispatch(command);
      setError(null);
      return result;
    } catch (caught) {
      reportError(caught);
      return null;
    }
  }, [dispatch, reportError]);
  const run = useCallback((command: CoatProjectCommand): boolean => runWithResult(command) !== null, [runWithResult]);

  return { error, reportError, run, runWithResult };
}
