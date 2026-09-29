import {
  ARMY_FORMATION_CREATOR_EDITOR_ID,
  ArmyFormationCreatorPageHeading,
} from '@/components/army-formation/ArmyFormationCreatorPageHeading';
import { ArmyFormationCreator } from '@/components/army-formation/ArmyFormationCreator';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import type { SiteLocale } from '@/lib/site-locale';

const ARMY_FORMATION_CREATOR_PATH = '/army-formation-creator';

function ArmyFormationCreatorPageFrame({ locale }: { locale: SiteLocale }) {
  return (
    <div className="px-5 lg:px-8">
      <ArmyFormationCreatorPageHeading locale={locale} />
      <div id={ARMY_FORMATION_CREATOR_EDITOR_ID} className="pb-8 lg:pb-10">
        <ArmyFormationCreator locale={locale} />
      </div>
    </div>
  );
}

export function ArmyFormationCreatorPageView({ locale }: { locale: SiteLocale }) {
  return (
    <InnerPageChrome locale={locale} currentPath={ARMY_FORMATION_CREATOR_PATH} tone="hub">
      <ArmyFormationCreatorPageFrame locale={locale} />
    </InnerPageChrome>
  );
}
