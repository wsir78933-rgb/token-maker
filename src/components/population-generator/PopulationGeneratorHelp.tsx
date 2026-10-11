import { getPopulationPresets } from '@/lib/population-generator';
import type { SiteLocale } from '@/lib/site-locale';

import { getPopulationGeneratorCopy, type PopulationGeneratorCopy } from './population-generator-copy';
import {
  formatPopulationRange,
  orderPopulationPresets,
  POPULATION_ERAS,
  POPULATION_SIZES,
  type PopulationEraName,
  type PopulationPresetRange,
  type PopulationSizeName,
} from './population-preset-list';

const POPULATION_HELP_RANGE_COUNT = 14;
const POPULATION_HELP_SECTION_CLASS_NAME =
  'mx-auto min-w-0 max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28';
const POPULATION_HELP_TITLE_CLASS_NAME =
  'font-display font-semibold tracking-tight text-balance text-stone-50';
const POPULATION_HELP_TITLE_STYLE = {
  fontSize: 'clamp(1.85rem, 4vw, 2.75rem)',
  letterSpacing: '-0.03em',
} as const;
const POPULATION_HELP_SUMMARY_CLASS_NAME =
  'mt-4 text-sm leading-7 text-pretty text-stone-300 sm:text-base';
const POPULATION_HELP_CARD_CLASS_NAME =
  'h-full min-w-0 rounded-2xl border border-white/10 bg-white/[0.025] p-6';
const POPULATION_HELP_GROUP_HEADING_CLASS_NAME =
  'font-semibold leading-snug tracking-tight text-balance text-stone-50';
const POPULATION_HELP_BODY_CLASS_NAME = 'text-sm leading-relaxed text-pretty text-stone-300';
const POPULATION_HELP_TABLE_SHELL_CLASS_NAME =
  'min-w-0 overflow-hidden rounded-2xl border border-white/10';
const POPULATION_HELP_TABLE_CLASS_NAME =
  'w-full max-w-full table-fixed border-collapse text-left text-sm text-stone-300';
const POPULATION_HELP_CELL_CLASS_NAME =
  'border-b border-white/10 px-3 py-3 align-top break-words [overflow-wrap:anywhere] group-last:border-b-0';

interface PopulationHelpRangeCell {
  era: PopulationEraName;
  size: PopulationSizeName;
  text: string;
  unavailable: boolean;
}

function requireHelpLocale(locale: SiteLocale): 'en' | 'zh' {
  if (locale === 'en' || locale === 'zh') {
    return locale;
  }

  throw new Error(`Population help locale must be "en" or "zh". Received ${JSON.stringify(locale)}.`);
}

function requireHelpText(value: string, fieldName: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(
      `Population help ${fieldName} must be a non-empty string. Received ${JSON.stringify(value)}.`,
    );
  }

  return value;
}

function readHelpEraPresets(era: PopulationEraName): readonly PopulationPresetRange[] {
  return orderPopulationPresets(era, getPopulationPresets(era));
}

function readHelpRangeText(
  era: PopulationEraName,
  size: PopulationSizeName,
  presets: readonly PopulationPresetRange[],
  locale: 'en' | 'zh',
  unavailableLabel: string,
): string {
  const preset = presets.find((entry) => entry.size === size);
  if (preset !== undefined) {
    return formatPopulationRange(preset.min, preset.max, locale);
  }

  if (era === 'medieval' && size === 'metropolis') {
    return unavailableLabel;
  }

  const availableSizes = presets.map((entry) => entry.size).join(', ');
  throw new Error(
    `Population help range is missing for ${era}/${size}. Available: ${availableSizes || 'none'}.`,
  );
}

function readHelpRangeCells(locale: 'en' | 'zh', unavailableLabel: string): readonly PopulationHelpRangeCell[] {
  const cells = POPULATION_SIZES.flatMap((size) =>
    POPULATION_ERAS.map((era) => {
      const presets = readHelpEraPresets(era);
      const unavailable = !presets.some((preset) => preset.size === size);
      return {
        era,
        size,
        text: readHelpRangeText(era, size, presets, locale, unavailableLabel),
        unavailable,
      };
    }),
  );
  const offeredCount = cells.filter((cell) => !cell.unavailable).length;

  if (offeredCount !== POPULATION_HELP_RANGE_COUNT) {
    throw new Error(
      `Population help must show ${POPULATION_HELP_RANGE_COUNT} ranges. Received ${offeredCount}.`,
    );
  }

  return cells;
}

function requireHelpRangeCell(
  cells: readonly PopulationHelpRangeCell[],
  era: PopulationEraName,
  size: PopulationSizeName,
): PopulationHelpRangeCell {
  const cell = cells.find((entry) => entry.era === era && entry.size === size);
  if (cell === undefined) {
    throw new Error(`Population help cell is missing for ${era}/${size}.`);
  }

  return cell;
}

function PopulationHelpHeader({ copy }: { copy: PopulationGeneratorCopy }) {
  return (
    <header className="mx-auto max-w-2xl text-center">
      <h2
        id="population-generator-help-heading"
        className={POPULATION_HELP_TITLE_CLASS_NAME}
        style={POPULATION_HELP_TITLE_STYLE}
      >
        {requireHelpText(copy.helpTitle, 'helpTitle')}
      </h2>
      <p id="population-generator-help-summary" className={POPULATION_HELP_SUMMARY_CLASS_NAME}>
        {requireHelpText(copy.helpSummary, 'helpSummary')}
      </p>
    </header>
  );
}

function PopulationHelpRules({ copy }: { copy: PopulationGeneratorCopy }) {
  const paragraphs = [
    requireHelpText(copy.helpIntro, 'helpIntro'),
    requireHelpText(copy.helpRegenerate, 'helpRegenerate'),
  ];

  return (
    <div className="mt-12 min-w-0">
      <h3 id="population-generator-help-rules-heading" className={`${POPULATION_HELP_GROUP_HEADING_CLASS_NAME} text-center`}>
        {requireHelpText(copy.helpRulesTitle, 'helpRulesTitle')}
      </h3>
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {paragraphs.map((paragraph) => (
          <article key={paragraph} className={POPULATION_HELP_CARD_CLASS_NAME}>
            <p className={POPULATION_HELP_BODY_CLASS_NAME}>{paragraph}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function PopulationHelpRangeCellText({ cell }: { cell: PopulationHelpRangeCell }) {
  return <span className={cell.unavailable ? undefined : 'tabular-nums'}>{cell.text}</span>;
}

function PopulationHelpDesktopTable({
  cells,
  copy,
}: {
  cells: readonly PopulationHelpRangeCell[];
  copy: PopulationGeneratorCopy;
}) {
  return (
    <div className={`${POPULATION_HELP_TABLE_SHELL_CLASS_NAME} hidden lg:block`}>
      <table id="population-generator-help-ranges-desktop" className={POPULATION_HELP_TABLE_CLASS_NAME}>
        <caption className="sr-only">{requireHelpText(copy.helpRangesTitle, 'helpRangesTitle')}</caption>
        <thead>
          <tr className="bg-white/[0.025]">
            <th scope="col" className={`${POPULATION_HELP_CELL_CLASS_NAME} font-semibold text-stone-50`}>
              {requireHelpText(copy.helpSizeColumn, 'helpSizeColumn')}
            </th>
            {POPULATION_ERAS.map((era) => (
              <th key={era} scope="col" className={`${POPULATION_HELP_CELL_CLASS_NAME} font-semibold text-stone-50`}>
                {requireHelpText(copy.eras[era], `eras.${era}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {POPULATION_SIZES.map((size) => (
            <tr key={size} className="group">
              <th scope="row" className={`${POPULATION_HELP_CELL_CLASS_NAME} font-semibold text-stone-50`}>
                {requireHelpText(copy.sizes[size], `sizes.${size}`)}
              </th>
              {POPULATION_ERAS.map((era) => (
                <td key={era} className={POPULATION_HELP_CELL_CLASS_NAME}>
                  <PopulationHelpRangeCellText cell={requireHelpRangeCell(cells, era, size)} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PopulationHelpEraTable({
  cells,
  copy,
  era,
}: {
  cells: readonly PopulationHelpRangeCell[];
  copy: PopulationGeneratorCopy;
  era: PopulationEraName;
}) {
  return (
    <div className={POPULATION_HELP_TABLE_SHELL_CLASS_NAME}>
      <table id={`population-generator-help-ranges-${era}`} className={POPULATION_HELP_TABLE_CLASS_NAME}>
        <caption className="border-b border-white/10 bg-white/[0.025] px-3 py-3 text-left font-semibold text-stone-50">
          {requireHelpText(copy.eras[era], `eras.${era}`)}
        </caption>
        <thead>
          <tr>
            <th scope="col" className={`${POPULATION_HELP_CELL_CLASS_NAME} font-semibold text-stone-50`}>
              {requireHelpText(copy.helpSizeColumn, 'helpSizeColumn')}
            </th>
            <th scope="col" className={`${POPULATION_HELP_CELL_CLASS_NAME} font-semibold text-stone-50`}>
              {requireHelpText(copy.helpRangeColumn, 'helpRangeColumn')}
            </th>
          </tr>
        </thead>
        <tbody>
          {POPULATION_SIZES.map((size) => (
            <tr key={size} className="group">
              <th scope="row" className={`${POPULATION_HELP_CELL_CLASS_NAME} font-semibold text-stone-50`}>
                {requireHelpText(copy.sizes[size], `sizes.${size}`)}
              </th>
              <td className={POPULATION_HELP_CELL_CLASS_NAME}>
                <PopulationHelpRangeCellText cell={requireHelpRangeCell(cells, era, size)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PopulationHelpRanges({
  cells,
  copy,
}: {
  cells: readonly PopulationHelpRangeCell[];
  copy: PopulationGeneratorCopy;
}) {
  return (
    <div className="mt-12 min-w-0">
      <h3
        id="population-generator-help-ranges-heading"
        className={`${POPULATION_HELP_GROUP_HEADING_CLASS_NAME} text-center`}
      >
        {requireHelpText(copy.helpRangesTitle, 'helpRangesTitle')}
      </h3>
      <div className="mt-6 grid gap-4">
        <PopulationHelpDesktopTable cells={cells} copy={copy} />
        <div id="population-generator-help-ranges-compact" className="grid gap-4 lg:hidden">
          {POPULATION_ERAS.map((era) => (
            <PopulationHelpEraTable key={era} cells={cells} copy={copy} era={era} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PopulationHelpNoteCard({
  title,
  titleId,
  paragraphs,
}: {
  title: string;
  titleId: string;
  paragraphs: readonly string[];
}) {
  return (
    <article aria-labelledby={titleId} className={POPULATION_HELP_CARD_CLASS_NAME}>
      <h3 id={titleId} className={POPULATION_HELP_GROUP_HEADING_CLASS_NAME}>
        {title}
      </h3>
      <div className="mt-3 grid gap-3">
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className={POPULATION_HELP_BODY_CLASS_NAME}>
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}

function PopulationHelpNotes({ copy }: { copy: PopulationGeneratorCopy }) {
  return (
    <div className="mt-12 grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
      <PopulationHelpNoteCard
        title={requireHelpText(copy.helpNumbersTitle, 'helpNumbersTitle')}
        titleId="population-generator-help-numbers-heading"
        paragraphs={[
          requireHelpText(copy.helpAreas, 'helpAreas'),
          requireHelpText(copy.helpEdits, 'helpEdits'),
          requireHelpText(copy.helpProfessions, 'helpProfessions'),
        ]}
      />
      <PopulationHelpNoteCard
        title={requireHelpText(copy.helpSavingTitle, 'helpSavingTitle')}
        titleId="population-generator-help-saving-heading"
        paragraphs={[
          requireHelpText(copy.helpAgriculture, 'helpAgriculture'),
          requireHelpText(copy.helpSlots, 'helpSlots'),
        ]}
      />
    </div>
  );
}

export function PopulationGeneratorHelp({ locale }: { locale: SiteLocale }) {
  const helpLocale = requireHelpLocale(locale);
  const copy = getPopulationGeneratorCopy(helpLocale);
  const rangeCells = readHelpRangeCells(
    helpLocale,
    requireHelpText(copy.helpUnavailable, 'helpUnavailable'),
  );

  return (
    <section
      aria-labelledby="population-generator-help-heading"
      aria-describedby="population-generator-help-summary"
      className={POPULATION_HELP_SECTION_CLASS_NAME}
    >
      <PopulationHelpHeader copy={copy} />
      <PopulationHelpRules copy={copy} />
      <PopulationHelpRanges cells={rangeCells} copy={copy} />
      <PopulationHelpNotes copy={copy} />
    </section>
  );
}
