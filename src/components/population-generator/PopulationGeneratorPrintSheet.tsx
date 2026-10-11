import { formatAreaSquareMeasure, formatPopulationCount } from './population-number-draft';
import { POPULATION_AGRICULTURE_KEYS } from './population-result-edits';
import type { PopulationGeneratorReadySession } from './use-population-generator';

import styles from './PopulationGeneratorWorkbench.module.css';

export function PopulationGeneratorPrintSheet({ session }: { session: PopulationGeneratorReadySession }) {
  const { copy, result } = session;

  return (
    <article className={styles.printSheet} data-population-print-sheet>
      <h2 className={styles.printTitle}>{result.name}</h2>
      <p>
        {copy.eras[result.era]} / {copy.sizes[result.size]}
      </p>
      <p>
        {result.nameLabel}: {result.name}
      </p>
      <h3>{copy.overviewLead}</h3>
      <p>
        {result.population.label}: {formatPopulationCount(result.population.value)}
      </p>
      <p>
        {result.households.label}: {formatPopulationCount(result.households.value)}
      </p>
      <p>
        {result.areaKm2.label}: {formatAreaSquareMeasure(result.areaKm2.value)}
      </p>
      <p>
        {result.areaMi2.label}: {formatAreaSquareMeasure(result.areaMi2.value)}
      </p>
      <h3>{copy.agricultureTitle}</h3>
      {POPULATION_AGRICULTURE_KEYS.map((item) => (
        <p key={item} data-population-print-agriculture={item}>
          {result.agriculture[item].label}: {formatPopulationCount(result.agriculture[item].value)}
        </p>
      ))}
      <h3>{copy.professionTitle(result.professions.length)}</h3>
      <ul className={styles.printProfessions}>
        {result.professions.map((profession) => (
          <li key={profession.id} data-population-print-profession={profession.id}>
            <span>{profession.name}</span>
            <span>{formatPopulationCount(profession.count)}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
