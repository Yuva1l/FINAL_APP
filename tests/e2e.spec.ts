import { test, expect } from '@playwright/test';

test('home loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Zygience|Events/i);
});

test('404 page on nonsense URL', async ({ page }) => {
  const res = await page.goto('/this-does-not-exist');
  expect(res?.status()).toBe(404);
  await expect(page.getByText(/Page not found/i)).toBeVisible();
});

test('admin login page loads', async ({ page }) => {
  await page.goto('/admin/login');
  await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
});

test('events page handles unknown slug gracefully', async ({ page }) => {
  const res = await page.goto('/events/unknown-slug-123');
  expect(res?.status()).toBe(404);
  await expect(page.getByText(/Page not found/i)).toBeVisible();
});
