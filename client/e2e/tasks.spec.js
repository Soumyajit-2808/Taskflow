import { test, expect } from '@playwright/test';
import crypto from 'crypto';

function generateTestEmail(prefix = 'user') {
  let id = crypto.randomUUID();
  while (/[bcdfghjklmnpqrstvwxyz]{4,}/i.test(id) || /(.)\1{3,}/.test(id)) {
    id = crypto.randomUUID();
  }
  return `${prefix}_${id}@example.com`;
}

test.describe('Task Management Workflows', () => {
  const testUser = {
    fullName: 'Devon Carter',
    email: generateTestEmail('devon'),
    password: 'SecureTaskPassword123!'
  };

  test('should create, edit, and persist task updates across page reloads', async ({ page }) => {
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

    // 4. Create a task with Title, Description, and Medium priority
    await page.locator('#btn-new-task').click();
    const createModal = page.getByRole('dialog');
    await expect(createModal).toBeVisible();
    await expect(createModal.getByRole('heading', { name: 'Create New Task' })).toBeVisible();

    await createModal.getByLabel(/Title/i).fill('Original Task Title');
    await createModal.getByLabel('Description', { exact: true }).fill('Original task description');
    await createModal.getByLabel('Priority', { exact: true }).selectOption('medium');
    await createModal.locator('#btn-save-task').click();

    // Ensure create modal closes
    await expect(createModal).not.toBeVisible();

    // 5. Verify that the task appears in the task list
    await expect(page.getByText('Original Task Title')).toBeVisible();
    await expect(page.getByText('Original task description')).toBeVisible();
    await expect(page.getByText('MEDIUM', { exact: true })).toBeVisible();

    // 6. Open the task's edit interface
    await page.getByRole('button', { name: 'Edit task' }).click();
    const editModal = page.getByRole('dialog');
    await expect(editModal).toBeVisible();
    await expect(editModal.getByRole('heading', { name: 'Edit Task' })).toBeVisible();

    // 7. Verify that the edit form contains the existing task information
    await expect(editModal.getByLabel(/Title/i)).toHaveValue('Original Task Title');
    await expect(editModal.getByLabel('Description', { exact: true })).toHaveValue('Original task description');
    await expect(editModal.getByLabel('Priority', { exact: true })).toHaveValue('medium');

    // 8. Change the task's Title, Description, and Priority to High
    await editModal.getByLabel(/Title/i).fill('Updated Task Title');
    await editModal.getByLabel('Description', { exact: true }).fill('Updated task description');
    await editModal.getByLabel('Priority', { exact: true }).selectOption('high');

    // 9. Save the changes
    await editModal.locator('#btn-save-task').click();
    await expect(editModal).not.toBeVisible();

    // 10. Verify that the updated title, description, and priority are reflected in the application
    await expect(page.getByText('Updated Task Title')).toBeVisible();
    await expect(page.getByText('Original Task Title')).not.toBeVisible();
    await expect(page.getByText('Updated task description')).toBeVisible();
    await expect(page.getByText('Original task description')).not.toBeVisible();
    await expect(page.getByText('HIGH', { exact: true })).toBeVisible();

    // 11. Reload the page and verify that the updated task information persists
    await page.reload();
    await expect(page.getByText('Updated Task Title')).toBeVisible();
    await expect(page.getByText('Original Task Title')).not.toBeVisible();
    await expect(page.getByText('Updated task description')).toBeVisible();
    await expect(page.getByText('HIGH', { exact: true })).toBeVisible();
  });

  test('should delete a task and update KPI metrics and views accordingly', async ({ page }) => {
    const user = {
      fullName: 'Seraphina Vale',
      email: generateTestEmail('seraphina'),
      password: 'SecureDeletionPass123!'
    };

    // 1. Open the application
    await page.goto('/');

    // 2. Register a new user using unique credentials
    const createAccountBtn = page.getByRole('button', { name: /create an account/i });
    if (await createAccountBtn.isVisible()) {
      await createAccountBtn.click();
    }
    await page.getByLabel('Full Name').fill(user.fullName);
    await page.getByLabel('Email Address').fill(user.email);
    await page.getByLabel('Password').fill(user.password);
    await page.locator('#btn-auth-submit').click();

    // 3. Verify successful registration and dashboard access
    await expect(page.getByText('TaskFlow')).toBeVisible();
    await expect(page.getByText(user.fullName)).toBeVisible();
    const totalTasksKpi = page.getByRole('button', { name: /Total Tasks/i });
    await expect(totalTasksKpi).toBeVisible();

    // 4. Record the initial Total Tasks KPI value
    await expect(totalTasksKpi).toContainText('0');

    // 5. Create a task with a unique title
    const taskTitle = 'Task To Be Deleted';
    await page.locator('#btn-new-task').click();
    const createModal = page.getByRole('dialog');
    await expect(createModal).toBeVisible();
    await expect(createModal.getByRole('heading', { name: 'Create New Task' })).toBeVisible();

    await createModal.getByLabel(/Title/i).fill(taskTitle);
    await createModal.getByLabel('Description', { exact: true }).fill('This task will be deleted in the test.');
    await createModal.getByLabel('Priority', { exact: true }).selectOption('medium');
    await createModal.locator('#btn-save-task').click();
    await expect(createModal).not.toBeVisible();

    // 6. Verify that the task appears in the task list
    await expect(page.getByText(taskTitle)).toBeVisible();

    // 7. Record the updated Total Tasks KPI value
    await expect(totalTasksKpi).toContainText('1');

    // 8. Open the task's deletion interface using the actual UI supported by the application
    // In TaskFlow, deletion can be performed via the TaskModal (which supports an inline confirmation dialog)
    // or directly via the list item quick-action button.
    // Opening TaskModal exercises the modal deletion interface and confirmation flow:
    await page.getByRole('button', { name: 'Edit task' }).click();
    const taskModal = page.getByRole('dialog');
    await expect(taskModal).toBeVisible();
    await expect(taskModal.getByRole('heading', { name: 'Edit Task' })).toBeVisible();

    // 9. If a confirmation dialog appears, verify the task identity and confirm deletion
    await expect(taskModal.getByLabel(/Title/i)).toHaveValue(taskTitle);
    await taskModal.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(taskModal.getByText('Delete task?')).toBeVisible();
    await taskModal.getByRole('button', { name: 'Yes, Delete' }).click();
    await expect(taskModal).not.toBeVisible();

    // 10. Verify that the deleted task no longer appears in the task list
    await expect(page.getByText(taskTitle)).not.toBeVisible();

    // 11. Verify that the Total Tasks KPI decreases by exactly one
    await expect(totalTasksKpi).toContainText('0');

    // 12. Switch to Kanban view, if supported, and verify that the deleted task is absent there too
    await page.getByRole('button', { name: /Board/i }).click();
    await expect(page.getByRole('button', { name: /Board/i })).toBeVisible();
    await expect(page.getByText(taskTitle)).not.toBeVisible();

    // Return to List view to also verify the direct list-row action deletion pathway
    await page.getByRole('button', { name: /List/i }).click();

    // Create a second task to verify direct list-row deletion (direct action without confirmation dialog)
    const directTaskTitle = 'Task Deleted Via Quick Action';
    await page.locator('#btn-new-task').click();
    const createModal2 = page.getByRole('dialog');
    await expect(createModal2).toBeVisible();
    await createModal2.getByLabel(/Title/i).fill(directTaskTitle);
    await createModal2.locator('#btn-save-task').click();
    await expect(createModal2).not.toBeVisible();

    await expect(page.getByText(directTaskTitle)).toBeVisible();
    await expect(totalTasksKpi).toContainText('1');

    // Trigger direct deletion from the list view row action
    await page.getByRole('button', { name: 'Delete task' }).click();

    // Verify immediate removal and KPI decrement
    await expect(page.getByText(directTaskTitle)).not.toBeVisible();
    await expect(totalTasksKpi).toContainText('0');

    // Verify absence in Kanban view as well
    await page.getByRole('button', { name: /Board/i }).click();
    await expect(page.getByRole('button', { name: /Board/i })).toBeVisible();
    await expect(page.getByText(directTaskTitle)).not.toBeVisible();
  });

  test('should reject creating a task without a title', async ({ page }) => {
    // 1. Open the application
    await page.goto('/');

    // 2. Register a new user using unique credentials
    const taskUserEmail = generateTestEmail('task_val');
    const createAccountBtn = page.getByRole('button', { name: /create an account/i });
    if (await createAccountBtn.isVisible()) {
      await createAccountBtn.click();
    }
    await page.getByLabel('Full Name').fill('Task Validation User');
    await page.getByLabel('Email Address').fill(taskUserEmail);
    await page.getByLabel('Password').fill('SecurePassword123!');
    await page.locator('#btn-auth-submit').click();

    // 3. Verify successful dashboard landing
    await expect(page.getByText('Task Validation User')).toBeVisible();
    const totalTasksKpi = page.getByRole('button', { name: /Total Tasks/i });
    await expect(totalTasksKpi).toContainText('0');

    // 4. Open the New Task modal
    await page.locator('#btn-new-task').click();
    const createModal = page.getByRole('dialog');
    await expect(createModal).toBeVisible();
    await expect(createModal.getByRole('heading', { name: 'Create New Task' })).toBeVisible();

    // 5. Fill optional fields but leave Title empty
    await createModal.getByLabel('Description', { exact: true }).fill('Description without a title');
    await createModal.getByLabel('Priority', { exact: true }).selectOption('high');

    // 6. Attempt to submit with empty title (HTML5 required constraint prevents submission)
    await createModal.locator('#btn-save-task').click();
    await expect(createModal).toBeVisible();

    // 7. Attempt to submit with whitespace-only title (triggers client-side title validation error)
    await createModal.getByLabel(/Title/i).fill('   ');
    await createModal.locator('#btn-save-task').click();

    // 8. Verify validation error message in accessible alert
    await expect(createModal.getByRole('alert')).toContainText('Title is required');
    await expect(createModal).toBeVisible();

    // 9. Close dialog and verify no task was created
    await createModal.getByRole('button', { name: 'Close dialog' }).click();
    await expect(createModal).not.toBeVisible();
    await expect(totalTasksKpi).toContainText('0');
    await expect(page.getByText('Description without a title')).not.toBeVisible();
  });
});
