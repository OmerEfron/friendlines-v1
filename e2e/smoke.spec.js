const { test, expect } = require('@playwright/test');

test.describe('FriendLines smoke', () => {
  test('home page loads with brand and nav', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /FriendLines/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Today/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Archive/i })).toBeVisible();
  });

  test('navigates to archive', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Archive/i }).click();
    await expect(page.getByText('Past Editions')).toBeVisible({ timeout: 10000 });
  });

  test('navigates home from archive', async ({ page }) => {
    await page.goto('/archive');
    await page.getByRole('link', { name: /Today/i }).click();
    await expect(page).toHaveURL('/');
  });
});
