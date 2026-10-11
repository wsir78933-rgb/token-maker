import { POPULATION_ERAS } from './population-preset-list';
import type { PopulationGeneratorReadySession } from './use-population-generator';

import styles from './PopulationGeneratorWorkbench.module.css';

export function PopulationGeneratorSettings({ session }: { session: PopulationGeneratorReadySession }) {
  const { copy } = session;

  return (
    <section className={`${styles.panel} ${styles.settings}`} aria-labelledby="population-settings-title">
      <h2 id="population-settings-title" className={styles.panelTitle}>
        {copy.settingsTitle}
      </h2>
      <fieldset className={styles.choiceField}>
        <legend>{copy.eraLegend}</legend>
        <div className={styles.eraGrid}>
          {POPULATION_ERAS.map((era) => (
            <button
              key={era}
              type="button"
              className={styles.choiceButton}
              aria-pressed={session.selectedEra === era}
              data-population-era-option={era}
              onClick={() => {
                session.selectEra(era);
              }}
            >
              {copy.eras[era]}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className={styles.choiceField}>
        <legend>{copy.sizeLegend}</legend>
        <div className={styles.sizeGrid}>
          {session.selectedPresets.map((preset) => (
            <button
              key={preset.size}
              type="button"
              className={preset.size === 'metropolis' ? styles.sizeButtonWide : styles.choiceButton}
              aria-pressed={session.selectedSize === preset.size}
              data-population-size-option={preset.size}
              onClick={() => {
                session.selectSize(preset.size);
              }}
            >
              {copy.sizes[preset.size]}
            </button>
          ))}
        </div>
      </fieldset>
      <div className={styles.rangeBlock}>
        <div>
          <p className={styles.rangeLabel}>{copy.rangeLabel}</p>
          <p className={styles.rangeValue}>{session.resultRangeText}</p>
        </div>
        <button type="button" className={styles.primaryButton} onClick={session.regenerate}>
          {copy.regenerate}
        </button>
      </div>
      <p className={styles.hint}>{copy.medievalNote}</p>
      <p className={styles.hint}>{copy.replaceNote}</p>
    </section>
  );
}
