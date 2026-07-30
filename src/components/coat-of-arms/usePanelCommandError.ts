'use client';

import { useCallback, useState } from 'react';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
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
  const run = useCallback((command: CoatProjectCommand): boolean => {
    try {
      dispatch(command);
      setError(null);
      return true;
    } catch (caught) {
      reportError(caught);
      return false;
    }
  }, [dispatch, reportError]);

  return { error, reportError, run };
}
