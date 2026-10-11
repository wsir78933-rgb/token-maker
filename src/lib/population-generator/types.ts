import type { SiteLocale } from '@/lib/site-locale';

export type PopulationEra = 'medieval' | 'modern' | 'future';

export type PopulationSize = 'village' | 'town' | 'city' | 'large-city' | 'metropolis';

export type PopulationStat = {
  label: string;
  value: number;
};

export type PopulationProfession = {
  id: string;
  name: string;
  count: number;
};

export type PopulationAgriculture = {
  farmers: PopulationStat;
  farmland: PopulationStat;
  livestock: PopulationStat;
  fowl: PopulationStat;
  cattleAndPigs: PopulationStat;
  otherLivestock: PopulationStat;
};

export type PopulationResult = {
  version: 1;
  era: PopulationEra;
  size: PopulationSize;
  nameLabel: string;
  name: string;
  population: PopulationStat;
  households: PopulationStat;
  areaKm2: PopulationStat;
  areaMi2: PopulationStat;
  agriculture: PopulationAgriculture;
  professions: PopulationProfession[];
};

export type PopulationPreset = {
  era: PopulationEra;
  size: PopulationSize;
  min: number;
  max: number;
};

export type PopulationGenerationRequest = {
  era: PopulationEra;
  size: PopulationSize;
  locale: SiteLocale;
  random?: () => number;
};

export type PopulationRandomRequest = {
  locale: SiteLocale;
  random?: () => number;
};
