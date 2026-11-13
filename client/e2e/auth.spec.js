import { test, expect } from '@playwright/test';
import crypto from 'crypto';

function generateTestEmail(prefix = 'user') {
  let id = crypto.randomUUID();
  while (/[bcdfghjklmnpqrstvwxyz]{4,}/i.test(id) || /(.)\1{3,}/.test(id)) {
    id = crypto.randomUUID();
  }
  return `${prefix}_${id}@example.com`;
}

test.describe('Authentication & User Session Workflows', () => {
  const testUser = {
    fullName: 'Elena Rostova',
    email: generateTestEmail('elena'),
    password: 'SecureAuth123!'
  };

  test('should allow an existing registered user to log in and access their dashboard', async ({ page }) => {
    // 1. Open the application
    await page.goto('/');

    // 2. Switch to Register mode
    const createAccountBtn = page.getByRole('button', { name: /create an account/i });
    if (await createAccountBtn.isVisible()) {
      await createAccountBtn.click();
    }

    // 3. Register a new user with unique credentials
    await page.getByLabel('Full Name').fill(testUser.fullName);
    await page.getByLabel('Email Address').fill(testUser.email);
    await page.getByLabel('Password').fill(testUser.password);
    await page.locator('#btn-auth-submit').click();

    // 4. Verify successful registration & initial dashboard landing
    await expect(page.getByText('TaskFlow')).toBeVisible();
    await expect(page.getByText(testUser.fullName)).toBeVisible();
    await expect(page.getByText(/Total Tasks/i)).toBeVisible();

    // 5. Sign out
    const signOutBtn = page.getByRole('button', { name: /sign out/i });
    await expect(signOutBtn).toBeVisible();
    await signOutBtn.click();

    // 6. Verify authentication screen reappears in Sign In mode
    await expect(page.getByRole('heading', { name: 'TaskFlow' })).toBeVisible();
    await expect(page.getByLabel('Email Address')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.locator('#btn-auth-submit')).toBeVisible();
    await expect(page.locator('#btn-auth-submit')).toContainText(/sign in/i);

    // 7. Log in using the same registered credentials
    await page.getByLabel('Email Address').fill(testUser.email);
    await page.getByLabel('Password').fill(testUser.password);
    await page.locator('#btn-auth-submit').click();

    // 8. Verify successful authentication and dashboard re-entry displaying user profile
    await expect(page.getByText('TaskFlow')).toBeVisible();
    await expect(page.getByText(testUser.fullName)).toBeVisible();
    await expect(page.getByText(/Total Tasks/i)).toBeVisible();
  });

  test('should persist authenticated session across page reloads and retain user data', async ({ page }) => {
    const sessionUser = {
      fullName: 'Darius Vance',
      email: generateTestEmail('darius'),
      password: 'SecureSessionPass123!'
    };

    // 1. Open the application
    await page.goto('/');

    // 2. Register a new user using unique credentials
    const createAccountBtn = page.getByRole('button', { name: /create an account/i });
    if (await createAccountBtn.isVisible()) {
      await createAccountBtn.click();
    }
    await page.getByLabel('Full Name').fill(sessionUser.fullName);
    await page.getByLabel('Email Address').fill(sessionUser.email);
    await page.getByLabel('Password').fill(sessionUser.password);
    await page.locator('#btn-auth-submit').click();

    // 3. Verify successful registration and dashboard access
    await expect(page.getByText('TaskFlow')).toBeVisible();
    await expect(page.getByText(sessionUser.fullName)).toBeVisible();
    const totalTasksKpi = page.getByRole('button', { name: /Total Tasks/i });
    await expect(totalTasksKpi).toBeVisible();

    // 4. Verify that the authenticated session is established in localStorage
    const storedToken = await page.evaluate(() => localStorage.getItem('taskflow_token'));
    expect(storedToken).toBeTruthy();

    // 5. Reload the page
    await page.reload();

    // 6. Verify that the user remains authenticated (auth form is not shown)
    await expect(page.getByLabel('Password')).not.toBeVisible();

    // 7. Verify that the dashboard loads successfully
    await expect(page.getByText('TaskFlow')).toBeVisible();
    await expect(page.locator('#btn-new-task')).toBeVisible();

    // 8. Verify that the correct user's name is displayed
    await expect(page.getByText(sessionUser.fullName)).toBeVisible();

    // 9. Verify that the user's task data or dashboard metrics load successfully
    await expect(page.getByRole('button', { name: /Total Tasks/i })).toBeVisible();
  });

  test('should protect application dashboard from unauthenticated access', async ({ page }) => {
    // 1. Start with a fresh browser context without authentication
    await page.goto('/');

    // 2. Ensure localStorage is completely empty of tokens
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // 3. Verify unauthenticated users cannot access protected application functionality
    await expect(page.locator('#btn-new-task')).not.toBeVisible();
    await expect(page.locator('aside')).not.toBeVisible();
    await expect(page.getByRole('button', { name: /Total Tasks/i })).not.toBeVisible();

    // 4. Verify that the application displays the authentication screen
    await expect(page.getByRole('heading', { name: 'TaskFlow' })).toBeVisible();
    await expect(page.getByLabel('Email Address')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.locator('#btn-auth-submit')).toBeVisible();
    await expect(page.locator('#btn-auth-submit')).toContainText(/sign in/i);

    // 5. Verify that no authenticated dashboard data or user information is exposed
    await expect(page.getByText(/Across all categories/i)).not.toBeVisible();
    await expect(page.getByRole('button', { name: /Sign Out/i })).not.toBeVisible();
  });

  test('should safely handle an invalid session token and return to unauthenticated view', async ({ page }) => {
    // 1. Open the application
    await page.goto('/');

    // 2. Seed an invalid/malformed token into localStorage (using actual storage key 'taskflow_token')
    await page.evaluate(() => {
      localStorage.setItem('taskflow_token', 'malformed.invalid_jwt_token.payload');
    });

    // 3. Reload the application to trigger initial token verification via api.getMe()
    await page.reload();

    // 4. Verify that authentication fails safely and the user returns to the unauthenticated view
    await expect(page.getByRole('heading', { name: 'TaskFlow' })).toBeVisible();
    await expect(page.getByLabel('Email Address')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.locator('#btn-auth-submit')).toBeVisible();

    // 5. Verify that protected dashboard content is not accessible
    await expect(page.locator('#btn-new-task')).not.toBeVisible();
    await expect(page.locator('aside')).not.toBeVisible();
    await expect(page.getByRole('button', { name: /Total Tasks/i })).not.toBeVisible();

    // 6. Verify that the invalid token is cleared from localStorage by AuthContext
    const tokenAfterFailure = await page.evaluate(() => localStorage.getItem('taskflow_token'));
    expect(tokenAfterFailure).toBeNull();
  });

  test('should reject registration with an invalid email address', async ({ page }) => {
    // 1. Open application in unauthenticated view
    await page.goto('/');

    // 2. Switch to Register mode
    const createAccountBtn = page.getByRole('button', { name: /create an account/i });
    await expect(createAccountBtn).toBeVisible();
    await createAccountBtn.click();

    // 3. Fill valid name and password
    await page.getByLabel('Full Name').fill('Invalid Email Tester');
    await page.getByLabel('Password').fill('SecurePassword123!');

    // 4. Test disposable/temporary email rejection (live validation warning)
    await page.getByLabel('Email Address').fill('tester@mailinator.com');
    await expect(page.getByText('Disposable/temporary email addresses are not allowed.')).toBeVisible();
    await expect(page.locator('#btn-auth-submit')).toBeDisabled();

    // 5. Test incomplete domain extension rejection
    await page.getByLabel('Email Address').fill('tester@invalid-domain');
    await expect(page.getByText('Please provide a complete domain with top-level extension (e.g. .com).')).toBeVisible();
    await expect(page.locator('#btn-auth-submit')).toBeDisabled();

    // 6. Verify dashboard is not accessible and user remains on register view
    await expect(page.locator('#btn-new-task')).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'TaskFlow' })).toBeVisible();
  });

  test('should reject registration with a weak password', async ({ page }) => {
    // 1. Open application in unauthenticated view
    await page.goto('/');

    // 2. Switch to Register mode
    const createAccountBtn = page.getByRole('button', { name: /create an account/i });
    await expect(createAccountBtn).toBeVisible();
    await createAccountBtn.click();

    // 3. Fill valid name and valid unique email
    const validEmail = generateTestEmail('weak_pass');
    await page.getByLabel('Full Name').fill('Weak Password Tester');
    await page.getByLabel('Email Address').fill(validEmail);

    // 4. Attempt registration with password shorter than 8 characters
    await page.getByLabel('Password').fill('short1');
    await page.locator('#btn-auth-submit').click();

    // 5. Verify backend validation error displayed in accessible alert
    await expect(page.getByRole('alert')).toContainText('Password must be at least 8 characters long');
    await expect(page.locator('#btn-new-task')).not.toBeVisible();

    // 6. Attempt registration with password containing no numbers
    await page.getByLabel('Password').fill('longpasswordwithoutnumbers');
    await page.locator('#btn-auth-submit').click();

    // 7. Verify alphanumeric requirement validation error displayed in alert
    await expect(page.getByRole('alert')).toContainText('Password must contain at least one letter and one number');
    await expect(page.locator('#btn-new-task')).not.toBeVisible();
  });

  test('should reject registration when email address is already registered', async ({ page }) => {
    // 1. Open application
    await page.goto('/');

    // 2. Switch to Register mode
    const createAccountBtn = page.getByRole('button', { name: /create an account/i });
    await expect(createAccountBtn).toBeVisible();
    await createAccountBtn.click();

    // 3. Register the initial user
    const duplicateEmail = generateTestEmail('dup_user');
    await page.getByLabel('Full Name').fill('Original Registered User');
    await page.getByLabel('Email Address').fill(duplicateEmail);
    await page.getByLabel('Password').fill('SecurePassword123!');
    await page.locator('#btn-auth-submit').click();

    // 4. Verify successful registration & dashboard access
    await expect(page.getByText('Original Registered User')).toBeVisible();

    // 5. Sign out
    await page.getByRole('button', { name: /sign out/i }).click();
    await expect(page.getByRole('heading', { name: 'TaskFlow' })).toBeVisible();

    // 6. Switch back to Register mode
    const createAccountBtn2 = page.getByRole('button', { name: /create an account/i });
    await expect(createAccountBtn2).toBeVisible();
    await createAccountBtn2.click();

    // 7. Attempt to register again with the same email
    await page.getByLabel('Full Name').fill('Second User Attempt');
    await page.getByLabel('Email Address').fill(duplicateEmail);
    await page.getByLabel('Password').fill('DifferentPassword123!');
    await page.locator('#btn-auth-submit').click();

    // 8. Verify conflict error message displayed in alert
    await expect(page.getByRole('alert')).toContainText('A user with this email address already exists');

    // 9. Verify user remains unauthenticated on registration screen
    await expect(page.locator('#btn-new-task')).not.toBeVisible();
    await expect(page.getByLabel('Full Name')).toBeVisible();
  });

  test('should reject login with an incorrect password', async ({ page }) => {
    // 1. Open application
    await page.goto('/');

    // 2. Switch to Register mode and register a known user
    const createAccountBtn = page.getByRole('button', { name: /create an account/i });
    await expect(createAccountBtn).toBeVisible();
    await createAccountBtn.click();

    const loginUserEmail = generateTestEmail('login_fail');
    const correctPassword = 'CorrectAuthPass123!';
    await page.getByLabel('Full Name').fill('Login Fail Test User');
    await page.getByLabel('Email Address').fill(loginUserEmail);
    await page.getByLabel('Password').fill(correctPassword);
    await page.locator('#btn-auth-submit').click();

    // 3. Verify registration and sign out
    await expect(page.getByText('Login Fail Test User')).toBeVisible();
    await page.getByRole('button', { name: /sign out/i }).click();
    await expect(page.locator('#btn-auth-submit')).toBeVisible();

    // 4. Attempt login with incorrect password
    await page.getByLabel('Email Address').fill(loginUserEmail);
    await page.getByLabel('Password').fill('WrongPassword999!');
    await page.locator('#btn-auth-submit').click();

    // 5. Verify unauthorized error displayed in accessible alert
    await expect(page.getByRole('alert')).toContainText('Invalid email or password');

    // 6. Verify dashboard remains inaccessible
    await expect(page.locator('#btn-new-task')).not.toBeVisible();
    await expect(page.locator('#btn-auth-submit')).toBeVisible();
  });
});
