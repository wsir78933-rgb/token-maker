'use client';

import type { CoatLocale } from '@/lib/coat-of-arms/types';
import { ArrangePanel } from './ArrangePanel';

/** Position and Arrange share one CoaMaker-aligned control surface. */
export function PositionPanel({ locale }: { locale: CoatLocale }) {
  return <ArrangePanel locale={locale} />;
}
