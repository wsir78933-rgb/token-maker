// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { getSolarSystemCopy } from '@/lib/solar-system-creator/copy';
import type { ManualSolarPlanet, RandomSolarPlanet, SolarPlanetField } from '@/lib/solar-system-creator/types';

import { SolarSystemPrintDetails } from './SolarSystemPrintDetails';

afterEach(cleanup);

const SOLAR_PLANET_FIELDS: readonly SolarPlanetField[] = [
  'environment',
  'atmosphere',
  'surfaceMap',
  'dayHours',
  'gravity',
  'orbitYears',
  'moons',
  'axialTilt',
];

function createRandomPlanet(id: string, values: Record<SolarPlanetField, string>): RandomSolarPlanet {
  return {
    id,
    assetId: 'type-1-1',
    x: 100,
    y: 80,
    width: 40,
    height: 40,
    fields: values,
  };
}

function createManualPlanet(id: string, description: string): ManualSolarPlanet {
  return {
    id,
    assetId: 'type-2-1',
    x: 160,
    y: 120,
    width: 40,
    height: 40,
    description,
  };
}

const EDITED_RANDOM_FIELDS: Record<SolarPlanetField, string> = {
  environment: 'Edited garden',
  atmosphere: 'Breathable',
  surfaceMap: 'Ocean',
  dayHours: '26',
  gravity: '1.2',
  orbitYears: '2.5',
  moons: '3',
  axialTilt: '24.1',
};

describe('SolarSystemPrintDetails', () => {
  it.each(['en', 'zh'] as const)('prints every edited random field and localized unit in %s', (locale) => {
    const copy = getSolarSystemCopy(locale);
    const secondFields = { ...EDITED_RANDOM_FIELDS, environment: 'Edited desert', moons: '4' };
    render(
      <SolarSystemPrintDetails
        copy={copy}
        mode="random"
        planets={[
          createRandomPlanet('planet-1', EDITED_RANDOM_FIELDS),
          createRandomPlanet('planet-2', secondFields),
        ]}
      />,
    );

    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(2);
    expect(screen.getByRole('heading', { level: 2, name: copy.planetLabel.replace('{number}', '1') })).toBeDefined();
    expect(screen.getByRole('heading', { level: 2, name: copy.planetLabel.replace('{number}', '2') })).toBeDefined();

    for (const [planetIndex, article] of articles.entries()) {
      const fields = planetIndex === 0 ? EDITED_RANDOM_FIELDS : secondFields;
      const articleScope = within(article);
      for (const field of SOLAR_PLANET_FIELDS) {
        expect(articleScope.getByText(copy.fieldLabels[field])).toBeDefined();
        const expectedValue = copy.units[field]
          ? `${fields[field]} ${copy.units[field]}`
          : fields[field];
        expect(articleScope.getByText(expectedValue)).toBeDefined();
      }
    }

    expect(document.querySelectorAll('button,input,textarea,select').length).toBe(0);
  });

  it('prints each manual description and uses an em dash for an empty description', () => {
    const copy = getSolarSystemCopy('en');
    const multilineDescription = 'A quiet world with a wide blue sea.\nA second line stays visible.';
    render(
      <SolarSystemPrintDetails
        copy={copy}
        mode="manual"
        planets={[
          createManualPlanet('manual-1', multilineDescription),
          createManualPlanet('manual-2', '   '),
        ]}
      />,
    );

    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(2);
    expect(articles[0].querySelector('dd')?.textContent).toBe(multilineDescription);
    expect(articles[0].querySelector('dd')?.className).toContain('whitespace-pre-wrap');
    expect(within(articles[1]).getByText('—')).toBeDefined();
    expect(screen.getAllByText(copy.description)).toHaveLength(2);
    expect(document.querySelectorAll('button,input,textarea,select').length).toBe(0);
  });
});
