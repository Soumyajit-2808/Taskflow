import { test, expect } from '@playwright/test';
import crypto from 'crypto';

test.describe('Category Management and Filtering Workflows', () => {
  const uniqueId = crypto.randomUUID();
  const testUser = {
    fullName: 'Nadia Kassam',
    email: `nadia_${uniqueId}@example.com`,
    password: 'SecureCategoryPass123!'
  };

  test('should create a custom category, assign it to a task, and filter tasks by category', async ({ page }) => {
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

    // 4. Inspect the actual category creation interface in the sidebar
    const sidebar = page.locator('aside');
    await expect(sidebar.getByText('Categories', { exact: true })).toBeVisible();
    const addCatBtn = sidebar.getByRole('button', { name: 'Add Category' });
    await expect(addCatBtn).toBeVisible();
    await addCatBtn.click();

    // 5. Create a custom category named Engineering
    const catInput = sidebar.getByPlaceholder('Category name');
    await expect(catInput).toBeVisible();
    await catInput.fill('Engineering');
    await sidebar.getByRole('button', { name: 'Add', exact: true }).click();

    // 6. Verify that the category appears in the sidebar
    const engCategoryBtn = sidebar.getByRole('button', { name: 'Engineering', exact: true });
    await expect(engCategoryBtn).toBeVisible();

    // 7. Create a task named Category Filter Test Task
    const categorizedTaskTitle = 'Category Filter Test Task';
    await page.locator('#btn-new-task').click();
    const createModal = page.getByRole('dialog');
    await expect(createModal).toBeVisible();
    await createModal.getByLabel(/Title/i).fill(categorizedTaskTitle);
    await createModal.getByLabel('Priority', { exact: true }).selectOption('medium');

    // 8. Assign the newly created Engineering category to this task
    await createModal.getByLabel('Category', { exact: true }).selectOption({ label: 'Engineering' });

    // 9. Save the task
    await createModal.locator('#btn-save-task').click();
    await expect(createModal).not.toBeVisible();

    // 10. Verify that the task appears in the task list with the correct category
    const main = page.locator('main');
    await expect(main.getByText(categorizedTaskTitle)).toBeVisible();
    await expect(main.getByText('Engineering')).toBeVisible();

    // 11. Create a second task without assigning the Engineering category
    const uncategorizedTaskTitle = 'Uncategorized General Task';
    await page.locator('#btn-new-task').click();
    const createModal2 = page.getByRole('dialog');
    await expect(createModal2).toBeVisible();
    await createModal2.getByLabel(/Title/i).fill(uncategorizedTaskTitle);
    await createModal2.getByLabel('Priority', { exact: true }).selectOption('low');
    // Category left as default "No Category"
    await createModal2.locator('#btn-save-task').click();
    await expect(createModal2).not.toBeVisible();

    // 12. Verify that both tasks appear before filtering
    await expect(main.getByText(categorizedTaskTitle)).toBeVisible();
    await expect(main.getByText(uncategorizedTaskTitle)).toBeVisible();

    // 13. Apply the category filter for Engineering
    await engCategoryBtn.click();

    // 14. Verify that Category Filter Test Task remains visible
    await expect(main.getByText(categorizedTaskTitle)).toBeVisible();

    // 15. Verify that the second, uncategorized task is excluded
    await expect(main.getByText(uncategorizedTaskTitle)).not.toBeVisible();

    // 16. Clear or reset the category filter
    const resetFiltersBtn = page.getByRole('button', { name: /Reset Filters/i });
    if (await resetFiltersBtn.isVisible()) {
      await resetFiltersBtn.click();
    } else {
      await sidebar.getByRole('button', { name: 'All Tasks' }).click();
    }

    // 17. Verify that both tasks are visible again
    await expect(main.getByText(categorizedTaskTitle)).toBeVisible();
    await expect(main.getByText(uncategorizedTaskTitle)).toBeVisible();
  });
});
