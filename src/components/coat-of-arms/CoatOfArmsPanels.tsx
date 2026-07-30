'use client';

import { ChargeAndOrdinaryPanel } from './ChargeAndOrdinaryPanel';
import { ColorBackgroundPanel } from './ColorBackgroundPanel';
import { DrawPanel } from './DrawPanel';
import { LayerPanel } from './LayerPanel';
import { NamePanel } from './NamePanel';
import { PositionPanel } from './PositionPanel';
import { ShieldFieldPanel } from './ShieldFieldPanel';
import { SettingsPanel } from './SettingsPanel';
import { TextMottoPanel } from './TextMottoPanel';
import { TopPanel } from './TopPanel';
import { UploadPanel } from './UploadPanel';
import type { CoatLocale } from '@/lib/coat-of-arms/types';
import { getCoatWorkbenchCopy } from './workbench-copy';

/** Composition-only editor toolbox: each child owns transient UI state and dispatches its own commands. */
export function CoatOfArmsPanels({ locale }: { locale: CoatLocale }) {
  const copy = getCoatWorkbenchCopy(locale).panels;
  return (
    <aside aria-label={copy.editorTools} className="grid gap-4">
      <PositionPanel locale={locale} />
      <ShieldFieldPanel locale={locale} />
      <ChargeAndOrdinaryPanel locale={locale} />
      <TopPanel locale={locale} />
      <ColorBackgroundPanel locale={locale} />
      <TextMottoPanel locale={locale} />
      <DrawPanel locale={locale} />
      <NamePanel locale={locale} />
      <SettingsPanel locale={locale} />
      <UploadPanel locale={locale} />
      <LayerPanel locale={locale} />
    </aside>
  );
}
