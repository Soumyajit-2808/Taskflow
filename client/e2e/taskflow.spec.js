import { test, expect } from '@playwright/test';

test.describe('TaskFlow Full Application End-to-End User Journey', () => {
  const testUser = {
    fullName: 'Alex Morgan',
    email: `alex_${Date.now()}@example.com`,
    password: 'SecurePassword123!'
  };

  test('should display authentication view initially when unauthenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'TaskFlow' })).toBeVisible();
    await expect(page.getByLabel('Email Address')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.locator('#btn-auth-submit')).toBeVisible();
  });

  test('should register a new user, view dashboard, create and manage tasks', async ({ page }) => {
    await page.goto('/');

    // Switch to Register form
    const createAccountBtn = page.getByRole('button', { name: /create an account/i });
    if (await createAccountBtn.isVisible()) {
      await createAccountBtn.click();
    }

    // Fill registration
    await page.getByLabel('Full Name').fill(testUser.fullName);
    await page.getByLabel('Email Address').fill(testUser.email);
    await page.getByLabel('Password').fill(testUser.password);
    await page.locator('#btn-auth-submit').click();

    // Verify Dashboard Landing
    await expect(page.getByText('TaskFlow')).toBeVisible();
    await expect(page.getByText(testUser.fullName)).toBeVisible();
    await expect(page.getByText(/Total Tasks/i)).toBeVisible();

    // Open New Task Modal
    await page.locator('#btn-new-task').click();
    await expect(page.getByRole('heading', { name: /Create New Task/i })).toBeVisible();

    // Fill Task form
    await page.getByLabel(/Title/i).fill('Setup Continuous Integration Pipeline');
    await page.getByLabel(/Priority/i).selectOption('high');
    await page.getByLabel(/Description/i).fill('Configure GitHub Actions to run tests automatically on push.');
    await page.locator('#btn-save-task').click();

    // Verify task appears in List View
    await expect(page.getByText('Setup Continuous Integration Pipeline')).toBeVisible();
    await expect(page.getByText('HIGH')).toBeVisible();

    // Switch to Kanban Board View
    await page.getByRole('button', { name: /Board/i }).click();
    await expect(page.getByText('To Do')).toBeVisible();
    await expect(page.getByText('In Progress')).toBeVisible();
    await expect(page.getByText('Completed')).toBeVisible();
    await expect(page.getByText('Setup Continuous Integration Pipeline')).toBeVisible();

    // Advance task from To Do -> In Progress
    const advanceBtn = page.getByRole('button', { name: /Advance/i });
    if (await advanceBtn.isVisible()) {
      await advanceBtn.click();
    }

    // Switch back to List View
    await page.getByRole('button', { name: /List/i }).click();

    // Mark task completed via checkbox
    const completeCheckbox = page.getByRole('button', { name: /Mark task completed/i }).first();
    if (await completeCheckbox.isVisible()) {
      await completeCheckbox.click();
    }

    // Test Sign Out
    await page.getByRole('button', { name: /Sign Out/i }).click();
    await expect(page.getByRole('heading', { name: 'TaskFlow' })).toBeVisible();
    await expect(page.locator('#btn-auth-submit')).toBeVisible();
  });
});

