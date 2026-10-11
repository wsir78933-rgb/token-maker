// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { PrivacyDocPageView } from '@/components/site/views/PrivacyDocPageView';
import { getPrivacyDocModel } from '@/lib/site-page-models';
import type { SiteLocale } from '@/lib/site-locale';

const privacyAdvertisingCopyByLocale = {
  en: {
    sectionTitle: 'Google advertising cookies',
    googleSettingsLabel: 'Google Ads Settings',
    aboutAdsLabel: 'aboutads.info',
  },
  zh: {
    sectionTitle: 'Google 广告 Cookie',
    googleSettingsLabel: 'Google 广告设置',
    aboutAdsLabel: 'aboutads.info',
  },
} as const;

afterEach(cleanup);

function expectAdvertisingPrivacyLinks(locale: SiteLocale) {
  const privacyModel = getPrivacyDocModel(locale);
  const advertisingCopy = privacyAdvertisingCopyByLocale[locale];
  const advertisingSection = privacyModel.sections.find(
    (section) => section.title === advertisingCopy.sectionTitle,
  );

  if (!advertisingSection) {
    throw new Error(`Expected ${locale} privacy copy to include ${advertisingCopy.sectionTitle}.`);
  }

  const advertisingHeading = screen
    .getAllByRole('heading', { level: 2, name: advertisingCopy.sectionTitle })
    .find((heading) => {
      const articleBody = heading.closest('article')?.querySelector('p')?.textContent;
      return articleBody === advertisingSection.body;
    });

  if (!advertisingHeading) {
    throw new Error(`Expected ${locale} privacy view to render the complete advertising disclosure section.`);
  }

  const advertisingCard = advertisingHeading.closest('article');

  if (!advertisingCard) {
    throw new Error(`Expected ${locale} advertising privacy section to have an article card.`);
  }

  const advertisingParagraph = advertisingCard.querySelector('p');

  if (!advertisingParagraph) {
    throw new Error(`Expected ${locale} advertising privacy section to have body text.`);
  }

  expect(advertisingParagraph.textContent).toBe(advertisingSection.body);

  const googleAdsSettingsLink = within(advertisingCard).getByRole('link', {
    name: advertisingCopy.googleSettingsLabel,
  });
  const aboutAdsLink = within(advertisingCard).getByRole('link', {
    name: advertisingCopy.aboutAdsLabel,
  });

  expect(googleAdsSettingsLink.getAttribute('href')).toBe('https://myadcenter.google.com/');
  expect(googleAdsSettingsLink.getAttribute('target')).toBe('_blank');
  expect(googleAdsSettingsLink.getAttribute('rel')).toBe('noreferrer');
  expect(aboutAdsLink.getAttribute('href')).toBe('https://optout.aboutads.info/');
  expect(aboutAdsLink.getAttribute('target')).toBe('_blank');
  expect(aboutAdsLink.getAttribute('rel')).toBe('noreferrer');
}

describe('PrivacyDocPageView', () => {
  it.each(['en', 'zh'] as const)('renders the verified advertising links in %s without changing the disclosure', (locale) => {
    render(<PrivacyDocPageView locale={locale} />);

    expectAdvertisingPrivacyLinks(locale);
  });
});
