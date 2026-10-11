import { useId, useState } from 'react';

import { PopulationNumberControl, PopulationTextControl } from './PopulationGeneratorFields';
import type { PopulationGeneratorReadySession } from './use-population-generator';

import styles from './PopulationGeneratorWorkbench.module.css';

export function PopulationGeneratorProfessions({ session }: { session: PopulationGeneratorReadySession }) {
  const { copy, locale, result } = session;
  const baseId = useId();
  const [query, setQuery] = useState('');
  const [hideZeroCounts, setHideZeroCounts] = useState(false);
  const searchLocale = locale === 'zh' ? 'zh-CN' : 'en';
  const normalizedQuery = query.trim().toLocaleLowerCase(searchLocale);
  const visibleProfessions = result.professions.flatMap((profession, index) => {
    const matchesQuery =
      normalizedQuery.length === 0 || profession.name.toLocaleLowerCase(searchLocale).includes(normalizedQuery);
    const matchesCount = !hideZeroCounts || profession.count !== 0;
    return matchesQuery && matchesCount ? [{ profession, index }] : [];
  });

  return (
    <section className={`${styles.panel} ${styles.professions}`} aria-labelledby="population-profession-title">
      <h2 id="population-profession-title" className={styles.panelTitle}>
        {copy.professionTitle(result.professions.length)}
      </h2>
      <div className={styles.professionScroll}>
        <div className={styles.professionSticky}>
          <div className={styles.professionTools}>
            <div className={styles.searchField}>
              <label className={styles.hiddenLabel} htmlFor={`${baseId}-search`}>
                {copy.professionSearchLabel}
              </label>
              <input
                id={`${baseId}-search`}
                className={styles.textInput}
                type="text"
                value={query}
                placeholder={copy.professionSearchLabel}
                autoComplete="off"
                onChange={(event) => {
                  setQuery(event.target.value);
                }}
              />
            </div>
            <label className={styles.checkLabel}>
              <input
                type="checkbox"
                checked={hideZeroCounts}
                onChange={(event) => {
                  setHideZeroCounts(event.target.checked);
                }}
              />
              <span>{copy.hideZeroCounts}</span>
            </label>
            <p className={styles.visibleCount} data-population-visible-count={visibleProfessions.length}>
              {copy.visibleCount(visibleProfessions.length, result.professions.length)}
            </p>
          </div>
          <div className={styles.professionHeader} aria-hidden="true">
            <span>{copy.professionNameHeader}</span>
            <span>{copy.professionCountHeader}</span>
            <span className={styles.desktopColumn}>{copy.professionNameHeader}</span>
            <span className={styles.desktopColumn}>{copy.professionCountHeader}</span>
          </div>
        </div>
        {visibleProfessions.length === 0 ? (
          <p className={styles.emptyProfessions} role="status">
            {copy.professionEmpty}
          </p>
        ) : (
          <div className={styles.professionRows}>
            {visibleProfessions.map(({ profession, index }) => (
              <div
                key={profession.id}
                className={styles.professionRow}
                data-population-profession-row={profession.id}
              >
                <PopulationTextControl
                  id={`${baseId}-profession-${profession.id}-name`}
                  label={copy.professionNameField(index + 1)}
                  value={session.textValue({ kind: 'profession-name', professionId: profession.id })}
                  onChange={(nextText) => {
                    session.changeText({ kind: 'profession-name', professionId: profession.id }, nextText);
                  }}
                />
                <PopulationNumberControl
                  id={`${baseId}-profession-${profession.id}-count`}
                  label={copy.professionCountField(index + 1)}
                  value={session.numberValue({ kind: 'profession-count', professionId: profession.id })}
                  error={session.numberError({ kind: 'profession-count', professionId: profession.id })}
                  inputMode="numeric"
                  onChange={(rawText) => {
                    session.changeNumber({ kind: 'profession-count', professionId: profession.id }, rawText);
                  }}
                  onBlur={() => {
                    session.blurNumber({ kind: 'profession-count', professionId: profession.id });
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <p className={styles.hint}>{copy.professionNote}</p>
    </section>
  );
}
