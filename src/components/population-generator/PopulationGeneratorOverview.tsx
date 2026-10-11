import { useId, useState } from 'react';

import { PopulationNumberControl, PopulationTextControl } from './PopulationGeneratorFields';
import { PopulationFileNotice, PopulationGeneratorFileMenu } from './PopulationGeneratorFileMenu';
import { POPULATION_AGRICULTURE_KEYS } from './population-result-edits';
import type { PopulationGeneratorReadySession } from './use-population-generator';

import styles from './PopulationGeneratorWorkbench.module.css';

const SPLIT_STATS = ['population', 'households'] as const;

export function PopulationGeneratorOverview({
  session,
  onChooseImportFile,
}: {
  session: PopulationGeneratorReadySession;
  onChooseImportFile: () => void;
}) {
  const { copy, result } = session;
  const baseId = useId();
  const [agricultureOpen, setAgricultureOpen] = useState(false);
  const title = `${copy.overviewLead} · ${copy.eras[result.era]} / ${copy.sizes[result.size]}`;

  return (
    <section className={`${styles.panel} ${styles.overview}`} aria-labelledby="population-overview-title">
      <div className={styles.overviewHeader}>
        <h2 id="population-overview-title" className={styles.panelTitle}>
          {title}
        </h2>
        <p className={styles.editHint}>{copy.editHint}</p>
      </div>
      <PopulationTextControl
        id={`${baseId}-name-label`}
        label={copy.nameLabelField}
        value={session.textValue({ kind: 'name-label' })}
        onChange={(nextText) => {
          session.changeText({ kind: 'name-label' }, nextText);
        }}
      />
      <PopulationTextControl
        id={`${baseId}-name`}
        label={copy.nameValueField}
        value={session.textValue({ kind: 'name' })}
        onChange={(nextText) => {
          session.changeText({ kind: 'name' }, nextText);
        }}
      />
      <div className={styles.statGrid}>
        {SPLIT_STATS.map((stat) => (
          <div key={stat} className={styles.statCard}>
            <PopulationTextControl
              id={`${baseId}-${stat}-label`}
              label={copy.statLabelField[stat]}
              value={session.textValue({ kind: 'stat-label', stat })}
              onChange={(nextText) => {
                session.changeText({ kind: 'stat-label', stat }, nextText);
              }}
            />
            <PopulationNumberControl
              id={`${baseId}-${stat}-value`}
              label={copy.statValueField[stat]}
              value={session.numberValue({ kind: 'stat-value', stat })}
              error={session.numberError({ kind: 'stat-value', stat })}
              inputMode="numeric"
              onChange={(rawText) => {
                session.changeNumber({ kind: 'stat-value', stat }, rawText);
              }}
              onBlur={() => {
                session.blurNumber({ kind: 'stat-value', stat });
              }}
            />
          </div>
        ))}
        <div className={`${styles.statCard} ${styles.areaCard}`}>
          <div className={styles.areaGrid}>
            {(['areaKm2', 'areaMi2'] as const).map((stat) => (
              <div key={stat}>
                <PopulationTextControl
                  id={`${baseId}-${stat}-label`}
                  label={copy.statLabelField[stat]}
                  value={session.textValue({ kind: 'stat-label', stat })}
                  onChange={(nextText) => {
                    session.changeText({ kind: 'stat-label', stat }, nextText);
                  }}
                />
                <PopulationNumberControl
                  id={`${baseId}-${stat}-value`}
                  label={copy.statValueField[stat]}
                  value={session.numberValue({ kind: 'stat-value', stat })}
                  error={session.numberError({ kind: 'stat-value', stat })}
                  inputMode="decimal"
                  onChange={(rawText) => {
                    session.changeNumber({ kind: 'stat-value', stat }, rawText);
                  }}
                  onBlur={() => {
                    session.blurNumber({ kind: 'stat-value', stat });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.actionRow}>
        <button
          type="button"
          className={styles.quietButton}
          aria-expanded={agricultureOpen}
          onClick={() => {
            setAgricultureOpen((current) => !current);
          }}
        >
          {agricultureOpen ? copy.agricultureHide : copy.agricultureShow}
          <span aria-hidden="true">{agricultureOpen ? ' ▴' : ' ▾'}</span>
        </button>
        <button type="button" className={styles.quietButton} onClick={session.openSlots}>
          {copy.saveLoad}
        </button>
        <PopulationGeneratorFileMenu
          copy={copy}
          onExport={session.exportText}
          onImport={onChooseImportFile}
          onPrint={session.printResult}
        />
      </div>
      <PopulationFileNotice copy={copy} notice={session.fileNotice} />
      {agricultureOpen ? (
        <div className={styles.agriculturePanel}>
          <h3 className={styles.subTitle}>{copy.agricultureTitle}</h3>
          <div className={styles.agricultureGrid}>
            {POPULATION_AGRICULTURE_KEYS.map((item) => (
              <div key={item} className={styles.statCard}>
                <PopulationTextControl
                  id={`${baseId}-agriculture-${item}-label`}
                  label={copy.agricultureLabelField[item]}
                  value={session.textValue({ kind: 'agriculture-label', item })}
                  onChange={(nextText) => {
                    session.changeText({ kind: 'agriculture-label', item }, nextText);
                  }}
                />
                <PopulationNumberControl
                  id={`${baseId}-agriculture-${item}-value`}
                  label={copy.agricultureValueField[item]}
                  value={session.numberValue({ kind: 'agriculture-value', item })}
                  error={session.numberError({ kind: 'agriculture-value', item })}
                  inputMode="numeric"
                  onChange={(rawText) => {
                    session.changeNumber({ kind: 'agriculture-value', item }, rawText);
                  }}
                  onBlur={() => {
                    session.blurNumber({ kind: 'agriculture-value', item });
                  }}
                />
              </div>
            ))}
          </div>
          <p className={styles.hint}>{copy.agricultureHint}</p>
        </div>
      ) : null}
    </section>
  );
}
