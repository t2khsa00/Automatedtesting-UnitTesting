import { test, expect } from '@playwright/test';

test.describe('Dog app E2E', () => {
  test('page load retrieves a dog image', async ({ page }) => {
    await page.route('**/api/dogs/random', route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            imageUrl: 'https://images.dog.ceo/test-load.jpg',
            status: 'success'
          }
        })
      })
    );

    await page.goto('/');

    const img = page.locator('img');
    await expect(img).toBeVisible();

    const src = await img.getAttribute('src');
    expect(src).toBeTruthy();
    expect(src).toMatch(/^https:\/\//);
  });

  test('button click retrieves new image', async ({ page }) => {
    await page.route('**/api/dogs/random', route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            imageUrl: 'https://images.dog.ceo/test-button.jpg',
            status: 'success'
          }
        })
      })
    );

    await page.goto('/');

    const img = page.locator('img');
    await expect(img).toBeVisible();

    await page.getByRole('button').click();

    await expect(img).toHaveAttribute('src', /https:\/\//);
  });

  test('shows error when API call fails', async ({ page }) => {
    await page.route('**/api/dogs/random', route => route.abort());

    await page.goto('/');

    const errorEl = page.getByText(/error/i);
    await expect(errorEl).toBeVisible();
  });
});