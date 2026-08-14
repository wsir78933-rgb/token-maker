import { expect, test } from '@playwright/test';

test('renders the homepage editor entry point', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Free DnD Token Maker for Roll20 and Foundry VTT' })
  ).toBeVisible();
  await expect(page.locator('#editor-workspace')).toBeVisible();
});

test('opens the Coat Maker workspace', async ({ page }) => {
  await page.goto('/coat-of-arms-maker');

  await expect(page.getByRole('main', { name: 'Coat maker workspace' })).toBeVisible();
});

test('renders a recoverable custom 404 page', async ({ page }) => {
  const response = await page.goto('/route-that-does-not-exist');

  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Go to English home' })).toHaveAttribute('href', '/');
});
