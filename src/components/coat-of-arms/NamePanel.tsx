'use client';

import { useState } from 'react';
import { createCoatIdentity } from '@/lib/coat-of-arms/name-generator';
import type { CoatLocale } from '@/lib/coat-of-arms/types';
import { usePanelCommandError } from './usePanelCommandError';
import { getCoatWorkbenchCopy } from './workbench-copy';

/** Generates an original local project name and motto that the editor can immediately use. */
export function NamePanel({ locale }: { locale: CoatLocale }) {
  const copy = getCoatWorkbenchCopy(locale).panels;
  const [identity, setIdentity] = useState(() => createCoatIdentity(locale));
  const { error, run } = usePanelCommandError(locale);

  return (
    <section aria-label={copy.names} className="space-y-2">
      <h2>{copy.names}</h2>
      {error ? <p role="alert">{error}</p> : null}
      <p><span>{copy.generatedProjectName}: </span><strong>{identity.projectName}</strong></p>
      <p><span>{copy.generatedMotto}: </span><strong>{identity.motto}</strong></p>
      <button type="button" onClick={() => setIdentity(createCoatIdentity(locale))}>{copy.generateIdentity}</button>
      <button type="button" onClick={() => run({ type: 'set-project-name', name: identity.projectName })}>{copy.useProjectName}</button>
      <button type="button" onClick={() => run({
        type: 'add-text-layer', text: identity.motto, color: '#1E293B', fontSize: 10,
        alignment: 'center', path: { mode: 'motto', curve: 'upper' },
      })}>{copy.addGeneratedMotto}</button>
    </section>
  );
}
