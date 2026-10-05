import type { EmblemCreatorCopy } from '@/lib/emblem-creator/copy';

export function EmblemCreatorToolComparison({
  copy,
}: {
  copy: EmblemCreatorCopy['toolComparison'];
}) {
  return (
    <section
      aria-labelledby="emblem-creator-tool-comparison-title"
      className="mx-auto max-w-5xl border-t border-white/10 py-20 text-stone-100 sm:py-24 lg:py-28"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <h2
          id="emblem-creator-tool-comparison-title"
          className="font-display font-semibold tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {copy.title}
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {copy.description}
        </p>
      </div>

      <div
        aria-label={copy.tableLabel}
        className="mt-8 w-full overflow-x-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-300"
        role="region"
        tabIndex={0}
      >
        <table className="w-full min-w-[48rem] table-fixed border-collapse text-left text-sm sm:text-base">
          <caption className="sr-only">{copy.title}</caption>
          <colgroup>
            <col className="w-[18%]" />
            <col className="w-[32%]" />
            <col className="w-[25%]" />
            <col className="w-[25%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-white/15">
              <th scope="col" className="px-4 py-4 font-medium text-stone-400">
                {copy.dimensionHeading}
              </th>
              <th
                scope="col"
                className="border-x border-white/10 bg-white/[0.04] px-4 py-4 font-semibold text-[var(--site-accent-strong)]"
              >
                {copy.emblemCreatorHeading}
              </th>
              <th scope="col" className="px-4 py-4 font-medium text-stone-200">
                {copy.photoshopHeading}
              </th>
              <th scope="col" className="px-4 py-4 font-medium text-stone-200">
                {copy.illustratorHeading}
              </th>
            </tr>
          </thead>
          <tbody>
            {copy.rows.map((row) => (
              <tr key={row.dimension} className="border-b border-white/10 last:border-b-0">
                <th scope="row" className="px-4 py-4 align-top font-medium text-stone-100">
                  {row.dimension}
                </th>
                <td className="border-x border-white/10 bg-white/[0.04] px-4 py-4 align-top text-stone-100">
                  {row.emblemCreator}
                </td>
                <td className="px-4 py-4 align-top text-stone-300">{row.photoshop}</td>
                <td className="px-4 py-4 align-top text-stone-300">{row.illustrator}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
