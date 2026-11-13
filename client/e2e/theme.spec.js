import { test, expect } from '@playwright/test';
import crypto from 'crypto';

test.describe('Theme Customization and Persistence Workflows', () => {
  const uniqueId = crypto.randomUUID();
  const testUser = {
    fullName: 'Kaelen Ward',
    email: `kaelen_${uniqueId}@example.com`,
    password: 'SecureThemePass123!'
  };

  test('should customize accent colors, toggle light/dark modes, and persist settings across reloads', async ({ page }) => {
    // 1. Open the application
    await page.goto('/');

    // 2. Register a new user using unique credentials
    const createAccountBtn = page.getByRole('button', { name: /create an account/i });
    if (await createAccountBtn.isVisible()) {
      await createAccountBtn.click();
    }
    await page.getByLabel('Full Name').fill(testUser.fullName);
    await page.getByLabel('Email Address').fill(testUser.email);
    await page.getByLabel('Password').fill(testUser.password);
    await page.locator('#btn-auth-submit').click();

    // 3. Verify successful registration and dashboard access
    await expect(page.getByText('TaskFlow')).toBeVisible();
    await expect(page.getByText(testUser.fullName)).toBeVisible();
    await expect(page.getByText(/Total Tasks/i)).toBeVisible();

    // Verify initial defaults (dark theme, electric indigo accent)
    expect(await page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe('dark');
    expect(await page.evaluate(() => document.documentElement.getAttribute('data-accent'))).toBe('indigo');

    // 4. Locate and open the Theme Customizer using the actual accessible UI
    const themeBtn = page.getByRole('button', { name: 'Customize theme and colors' });
    await expect(themeBtn).toBeVisible();
    await themeBtn.click();

    const customizerModal = page.getByRole('dialog');
    await expect(customizerModal).toBeVisible();
    await expect(customizerModal.getByRole('heading', { name: 'Theme & Appearance' })).toBeVisible();

    // 5. Inspect the available theme and accent color options
    await expect(customizerModal.getByText('1. Base Canvas Theme')).toBeVisible();
    await expect(customizerModal.getByText('2. Brand Accent Palette')).toBeVisible();
    await expect(customizerModal.getByRole('button', { name: 'Emerald Mint' })).toBeVisible();
    await expect(customizerModal.getByRole('button', { name: 'Amethyst Purple' })).toBeVisible();

    // 6. Select the Emerald Mint accent preset
    await customizerModal.getByRole('button', { name: 'Emerald Mint' }).click();

    // 7. Verify that the selected accent color is applied
    expect(await page.evaluate(() => document.documentElement.getAttribute('data-accent'))).toBe('emerald');
    expect(await page.evaluate(() => localStorage.getItem('taskflow_accent'))).toBe('emerald');
    const emeraldPrimary = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--primary-500').trim()
    );
    expect(emeraldPrimary).toBe('#10b981');

    // 8. Switch to another available accent preset (Amethyst Purple / Violet) and verify change
    await customizerModal.getByRole('button', { name: 'Amethyst Purple' }).click();
    expect(await page.evaluate(() => document.documentElement.getAttribute('data-accent'))).toBe('amethyst');
    expect(await page.evaluate(() => localStorage.getItem('taskflow_accent'))).toBe('amethyst');
    const amethystPrimary = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--primary-500').trim()
    );
    expect(amethystPrimary).toBe('#8b5cf6');

    // 9. Toggle between light and dark modes using the actual theme controls in the customizer
    await customizerModal.getByRole('button', { name: 'Clean Light' }).click();

    // 10. Verify that the selected mode is reflected in the DOM and applied styles
    expect(await page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe('light');
    expect(await page.evaluate(() => localStorage.getItem('taskflow_theme'))).toBe('light');
    const lightBgApp = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--bg-app').trim()
    );
    expect(lightBgApp).toBe('#f8fafc');

    // 11. Close the customizer
    await customizerModal.getByRole('button', { name: 'Done' }).click();
    await expect(customizerModal).not.toBeVisible();

    // Verify quick toggle button in header operates smoothly
    const quickToggleBtn = page.locator('#btn-quick-theme');
    await expect(quickToggleBtn).toBeVisible();
    // Quick toggle to dark
    await quickToggleBtn.click();
    expect(await page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe('dark');
    expect(await page.evaluate(() => localStorage.getItem('taskflow_theme'))).toBe('dark');

    // Quick toggle back to light for persistence check
    await quickToggleBtn.click();
    expect(await page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe('light');
    expect(await page.evaluate(() => localStorage.getItem('taskflow_theme'))).toBe('light');

    // 12. Reload the page
    await page.reload();

    // 13. Verify that the selected theme settings persist after reload
    expect(await page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe('light');
    expect(await page.evaluate(() => document.documentElement.getAttribute('data-accent'))).toBe('amethyst');
    expect(await page.evaluate(() => localStorage.getItem('taskflow_theme'))).toBe('light');
    expect(await page.evaluate(() => localStorage.getItem('taskflow_accent'))).toBe('amethyst');
    const persistedPrimary = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--primary-500').trim()
    );
    expect(persistedPrimary).toBe('#8b5cf6');

    // 14. Reopen the customizer and verify that its selected settings match the applied theme
    await page.getByRole('button', { name: 'Customize theme and colors' }).click();
    const reopenedModal = page.getByRole('dialog');
    await expect(reopenedModal).toBeVisible();

    // Verify badges reflecting active theme and accent selections
    await expect(reopenedModal.getByText('Clean Light').first()).toBeVisible();
    await expect(reopenedModal.getByText('Amethyst Purple').first()).toBeVisible();

    // Close modal
    await reopenedModal.getByRole('button', { name: 'Done' }).click();
    await expect(reopenedModal).not.toBeVisible();
  });
});
