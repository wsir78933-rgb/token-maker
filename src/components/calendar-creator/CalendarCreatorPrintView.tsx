import type { CSSProperties } from 'react';

import { getCalendarMonthRows } from '@/lib/calendar-creator/calendar';
import { getCalendarCreatorCopy } from '@/lib/calendar-creator/copy';
import { getCalendarIcon, getCalendarIconLabel } from '@/lib/calendar-creator/icons';
import type { CalendarDay, CalendarDocument, CalendarIconId } from '@/lib/calendar-creator/types';
import type { SiteLocale } from '@/lib/site-locale';

import styles from './CalendarCreatorPrintView.module.css';

export interface CalendarCreatorPrintViewProps {
  locale: SiteLocale;
  document: CalendarDocument;
}

type PrintIconLayer = {
  id: CalendarIconId | null;
  key: string;
  label: string;
};

function replaceNumber(template: string, number: number): string {
  return template.replace('{number}', String(number));
}

function readMonthName(copy: ReturnType<typeof getCalendarCreatorCopy>, name: string, monthIndex: number): string {
  return name.trim().length > 0
    ? name
    : replaceNumber(copy.monthFallback, monthIndex + 1);
}

function readWeekdayName(copy: ReturnType<typeof getCalendarCreatorCopy>, name: string, weekdayIndex: number): string {
  return name.trim().length > 0
    ? name
    : replaceNumber(copy.weekdayFallback, weekdayIndex + 1);
}

function getPrintIconLayers(copy: ReturnType<typeof getCalendarCreatorCopy>, day: CalendarDay): PrintIconLayer[] {
  return [
    { id: day.manualIconId, key: 'manual', label: copy.manualIcon },
    { id: day.moonIcons.white, key: 'white-moon', label: copy.whiteMoon },
    { id: day.moonIcons.blue, key: 'blue-moon', label: copy.blueMoon },
    { id: day.moonIcons.red, key: 'red-moon', label: copy.redMoon },
    { id: day.disasterIconId, key: 'disaster', label: copy.disasterPool },
  ];
}

function PrintIcon({ layer, locale }: { layer: PrintIconLayer; locale: SiteLocale }) {
  if (layer.id === null) {
    return null;
  }

  const icon = getCalendarIcon(layer.id);
  const iconLabel = getCalendarIconLabel(layer.id, locale);

  return (
    <img
      alt={`${layer.label}: ${iconLabel}`}
      className={styles.icon}
      height={24}
      src={icon.src}
      title={`${layer.label}: ${iconLabel}`}
      width={24}
    />
  );
}

function PrintDay({
  copy,
  day,
  locale,
  weekdayNames,
}: {
  copy: ReturnType<typeof getCalendarCreatorCopy>;
  day: CalendarDay;
  locale: SiteLocale;
  weekdayNames: readonly string[];
}) {
  const dayIconLayers = getPrintIconLayers(copy, day);
  const weekdayName = readWeekdayName(copy, weekdayNames[day.weekdayIndex] ?? '', day.weekdayIndex);

  return (
    <article className={styles.day} data-calendar-print-day={day.dayOfYear}>
      <table className={styles.dayTable}>
        <thead className={styles.dayTableHead}>
          <tr>
            <th scope="col">
              <header className={styles.dayHeader}>
                <h4 className={styles.dayTitle}>{copy.day} {day.dayOfMonth}</h4>
                <span className={styles.dayWeekday}>{weekdayName}</span>
                <span className={styles.dayOfYear}>#{day.dayOfYear}</span>
                {day.note.length > 0 ? (
                  <span className={styles.continuationMarker} data-calendar-print-continuation>
                    {copy.continued} · #{day.dayOfYear}
                  </span>
                ) : null}
              </header>
              <div aria-label={copy.automaticLayers} className={styles.iconLayers}>
                {dayIconLayers.map((layer) => (
                  <PrintIcon key={`${layer.key}-${layer.id ?? 'empty'}`} layer={layer} locale={locale} />
                ))}
              </div>
            </th>
          </tr>
        </thead>
        <tbody className={styles.dayTableBody}>
          <tr>
            <td className={styles.dayBodyCell}>
              {day.note.length > 0 ? (
                <p className={styles.note} data-calendar-print-note>
                  {day.note}
                </p>
              ) : null}
            </td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}

export function CalendarCreatorPrintView({ locale, document }: CalendarCreatorPrintViewProps) {
  const copy = getCalendarCreatorCopy(locale);
  const weekLength = document.settings.weekdayNames.length;
  const gridStyle = { '--calendar-week-length': weekLength } as CSSProperties;

  return (
    <section
      aria-label={copy.print}
      className={styles.printView}
      data-calendar-print-view
      data-calendar-print-document
      style={gridStyle}
    >
      <header className={styles.documentHeader}>
        <h1>{copy.title}</h1>
        <p>{copy.year}: {document.settings.year}</p>
      </header>
      {document.settings.months.map((month, monthIndex) => {
        const monthRows = getCalendarMonthRows(document, monthIndex);
        const monthName = readMonthName(copy, month.name, monthIndex);

        return (
          <section
            aria-labelledby={`calendar-print-month-${monthIndex}`}
            className={styles.month}
            data-calendar-print-month={monthIndex}
            key={`${monthIndex}-${monthName}`}
          >
            <header className={styles.monthHeader}>
              <h2 id={`calendar-print-month-${monthIndex}`}>{monthName}</h2>
              <span>{month.dayCount} {copy.daysUnit}</span>
            </header>
            <div className={styles.weekdayRow} role="row">
              {document.settings.weekdayNames.map((weekdayName, weekdayIndex) => (
                <span className={styles.weekdayCell} key={`${monthIndex}-weekday-${weekdayIndex}`} role="columnheader">
                  {readWeekdayName(copy, weekdayName, weekdayIndex)}
                </span>
              ))}
            </div>
            {monthRows.length === 0 ? (
              <p className={styles.emptyMonth}>{copy.noDates}</p>
            ) : (
              <div className={styles.monthRows} role="grid">
                {monthRows.map((row, rowIndex) => (
                  <div className={styles.weekRow} key={`${monthIndex}-row-${rowIndex}`} role="row">
                    {row.map((day, columnIndex) => day === null ? (
                      <span aria-hidden="true" className={styles.emptyCell} key={`${monthIndex}-${rowIndex}-${columnIndex}`} />
                    ) : (
                      <PrintDay
                        copy={copy}
                        day={day}
                        key={day.dayOfYear}
                        locale={locale}
                        weekdayNames={document.settings.weekdayNames}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </section>
  );
}
