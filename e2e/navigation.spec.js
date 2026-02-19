const { test, expect } = require('@playwright/test');

test.describe('navigation flows', () => {
  test('home renders edition or empty state', async ({ page }) => {
    await page.goto('/');
    const main = page.locator('.main-content');
    await expect(main).toBeVisible({ timeout: 10000 });
    const hasContent =
      (await main.getByText(/article/i).count()) > 0 ||
      (await main.getByText(/No top story yet/).count()) > 0 ||
      (await main.getByText(/No briefs/).count()) > 0;
    expect(hasContent).toBeTruthy();
  });

  test('archive lists editions or empty state', async ({ page }) => {
    await page.goto('/archive');
    await expect(page.locator('.main-content')).toBeVisible({ timeout: 10000 });
    const hasContent =
      (await page.getByTestId('edition-link').count()) > 0 ||
      (await page.getByText(/No editions yet/).count()) > 0;
    expect(hasContent).toBeTruthy();
  });

  test('direct article URL shows article or error state', async ({ page }) => {
    await page.goto('/article/1');
    await expect(page.locator('.main-content')).toBeVisible({ timeout: 10000 });
    const hasContent =
      (await page.getByRole('article').count()) > 0 ||
      (await page.getByText(/not found/i).count()) > 0 ||
      (await page.getByText(/Article not found/i).count()) > 0 ||
      (await page.getByText(/Something went wrong/i).count()) > 0;
    expect(hasContent).toBeTruthy();
  });
});
