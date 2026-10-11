'use client';

import { useRef } from 'react';

import type { SiteLocale } from '@/lib/site-locale';

import { PopulationGeneratorConfirmDialog } from './PopulationGeneratorConfirmDialog';
import { PopulationGeneratorOverview } from './PopulationGeneratorOverview';
import { PopulationGeneratorPrintSheet } from './PopulationGeneratorPrintSheet';
import { PopulationGeneratorProfessions } from './PopulationGeneratorProfessions';
import { PopulationGeneratorSettings } from './PopulationGeneratorSettings';
import { PopulationGeneratorSlotsDialog } from './PopulationGeneratorSlotsDialog';
import { usePopulationGenerator } from './use-population-generator';

import styles from './PopulationGeneratorWorkbench.module.css';

export function PopulationGeneratorWorkbench({ locale }: { locale: SiteLocale }) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const session = usePopulationGenerator(locale);

  function chooseImportFile(): void {
    if (session.status !== 'ready') {
      throw new Error(`Population import is unavailable while status is ${session.status}.`);
    }

    const input = fileInputRef.current;
    if (input === null) {
      throw new Error('Population import input is not mounted.');
    }

    session.beginImport(input);
  }

  if (session.status === 'preparing') {
    return (
      <section
        className={styles.workbench}
        aria-busy="true"
        data-population-status="preparing"
      >
        <p className={styles.preparing}>{session.copy.preparing}</p>
      </section>
    );
  }

  return (
    <section
      className={styles.workbench}
      data-population-status="ready"
      data-population-era={session.result.era}
      data-population-size={session.result.size}
      data-population-dirty={session.dirty ? 'true' : 'false'}
    >
      <div className={styles.screenWorkspace}>
        <div className={styles.layout}>
          <PopulationGeneratorSettings session={session} />
          <PopulationGeneratorOverview session={session} onChooseImportFile={chooseImportFile} />
          <PopulationGeneratorProfessions session={session} />
        </div>
      </div>
      <PopulationGeneratorPrintSheet session={session} />
      <input
        ref={fileInputRef}
        className={styles.fileInput}
        type="file"
        accept=".txt,text/plain"
        aria-label={session.copy.importFile}
        onChange={(event) => {
          const file = event.target.files?.[0] ?? null;
          event.currentTarget.value = '';
          session.importSelectedFile(file);
        }}
      />
      <PopulationGeneratorSlotsDialog session={session} />
      <PopulationGeneratorConfirmDialog session={session} />
    </section>
  );
}
