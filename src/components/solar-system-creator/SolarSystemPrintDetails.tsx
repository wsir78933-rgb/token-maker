import type { SolarSystemCopy } from '@/lib/solar-system-creator/copy';
import type {
  ManualSolarPlanet,
  RandomSolarPlanet,
  SolarPlanetField,
} from '@/lib/solar-system-creator/types';

export type SolarSystemPrintDetailsProps = {
  copy: SolarSystemCopy;
} & (
  | { mode: 'random'; planets: readonly RandomSolarPlanet[] }
  | { mode: 'manual'; planets: readonly ManualSolarPlanet[] }
);

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

function describeReceivedValue(receivedValue: unknown): string {
  if (typeof receivedValue === 'string') return JSON.stringify(receivedValue);
  if (receivedValue === undefined) return 'undefined';
  if (receivedValue === null) return 'null';
  if (typeof receivedValue === 'number' || typeof receivedValue === 'boolean' || typeof receivedValue === 'bigint') {
    return String(receivedValue);
  }

  const serializedValue = JSON.stringify(receivedValue);
  return serializedValue === undefined ? Object.prototype.toString.call(receivedValue) : serializedValue;
}

function requirePrintMode(receivedMode: string): 'random' | 'manual' {
  if (receivedMode === 'random' || receivedMode === 'manual') return receivedMode;
  throw new Error(`Solar print mode must be random or manual. Received ${describeReceivedValue(receivedMode)}.`);
}

function requirePlanetList(receivedPlanets: unknown): readonly (RandomSolarPlanet | ManualSolarPlanet)[] {
  if (!Array.isArray(receivedPlanets)) {
    throw new Error(`Solar print planets must be an array. Received ${describeReceivedValue(receivedPlanets)}.`);
  }

  return receivedPlanets;
}

function requirePlanetId(receivedId: unknown, planetIndex: number): string {
  if (typeof receivedId !== 'string' || receivedId.length === 0) {
    throw new Error(
      `Solar print planet ${planetIndex + 1} id must be a non-empty string. Received ${describeReceivedValue(receivedId)}.`,
    );
  }

  return receivedId;
}

function formatPlanetHeading(planetLabelTemplate: string, planetNumber: number): string {
  return planetLabelTemplate.replaceAll('{number}', String(planetNumber));
}

function formatFieldValue(fieldValue: string, fieldUnit: string): string {
  return fieldUnit.length > 0 ? `${fieldValue} ${fieldUnit}` : fieldValue;
}

function requireRandomFieldValue(
  randomPlanet: RandomSolarPlanet,
  field: SolarPlanetField,
  planetIndex: number,
): string {
  const fieldValue = randomPlanet.fields[field];
  if (typeof fieldValue !== 'string') {
    throw new Error(
      `Solar print planet ${planetIndex + 1} field ${JSON.stringify(field)} must be a string. Received ${describeReceivedValue(fieldValue)}.`,
    );
  }

  return fieldValue;
}

function renderRandomPlanetArticle(
  copy: SolarSystemCopy,
  randomPlanet: RandomSolarPlanet,
  planetIndex: number,
) {
  requirePlanetId(randomPlanet.id, planetIndex);

  return (
    <article key={randomPlanet.id} className="break-inside-avoid space-y-3 text-black">
      <h2 className="text-base font-semibold text-black">
        {formatPlanetHeading(copy.planetLabel, planetIndex + 1)}
      </h2>
      <dl className="grid min-w-0 gap-x-6 gap-y-2 sm:grid-cols-2">
        {SOLAR_PLANET_FIELDS.map((field) => {
          const fieldValue = requireRandomFieldValue(randomPlanet, field, planetIndex);
          return (
            <div key={field} className="min-w-0 break-inside-avoid">
              <dt className="font-medium text-black">{copy.fieldLabels[field]}</dt>
              <dd className="break-words text-black">{formatFieldValue(fieldValue, copy.units[field])}</dd>
            </div>
          );
        })}
      </dl>
    </article>
  );
}

function renderManualPlanetArticle(
  copy: SolarSystemCopy,
  manualPlanet: ManualSolarPlanet,
  planetIndex: number,
) {
  requirePlanetId(manualPlanet.id, planetIndex);
  if (typeof manualPlanet.description !== 'string') {
    throw new Error(
      `Solar print planet ${planetIndex + 1} description must be a string. Received ${describeReceivedValue(manualPlanet.description)}.`,
    );
  }

  const description = manualPlanet.description.trim().length > 0 ? manualPlanet.description : '—';
  return (
    <article key={manualPlanet.id} className="break-inside-avoid space-y-3 text-black">
      <h2 className="text-base font-semibold text-black">
        {formatPlanetHeading(copy.planetLabel, planetIndex + 1)}
      </h2>
      <dl className="grid min-w-0 gap-y-2">
        <div className="min-w-0 break-inside-avoid">
          <dt className="font-medium text-black">{copy.description}</dt>
          <dd className="break-words whitespace-pre-wrap text-black">{description}</dd>
        </div>
      </dl>
    </article>
  );
}

export function SolarSystemPrintDetails({
  copy,
  mode: receivedMode,
  planets: receivedPlanets,
}: SolarSystemPrintDetailsProps) {
  const mode = requirePrintMode(receivedMode);
  const planets = requirePlanetList(receivedPlanets);

  if (mode === 'random') {
    return (
      <>
        {(planets as readonly RandomSolarPlanet[]).map((randomPlanet, planetIndex) =>
          renderRandomPlanetArticle(copy, randomPlanet, planetIndex),
        )}
      </>
    );
  }

  return (
    <>
      {(planets as readonly ManualSolarPlanet[]).map((manualPlanet, planetIndex) =>
        renderManualPlanetArticle(copy, manualPlanet, planetIndex),
      )}
    </>
  );
}
