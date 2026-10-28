import { test, expect } from '../fixtures/test.fixture';
import { buildUser } from '../utils/dataGenerator';
import loginScenarios from '../testdata/loginScenarios.json';

test.describe('Authentication', () => {
  test('TC01 - register, logout, login and delete account end-to-end @smoke', async ({
    loginPage,
    signupPage,
    homePage,
  }) => {
    const user = buildUser();

    await test.step('Start signup from the login page', async () => {
      await homePage.open();
      await homePage.loginLink.click();
      await loginPage.startSignup(user.name, user.email);
    });

    await test.step('Complete the registration form', async () => {
      await signupPage.fillAccountDetails(user);
      await signupPage.submit();
      await signupPage.continueAfterCreation();
      await signupPage.expectLoggedInAs(user.name);
    });

    await test.step('Logout', async () => {
      await signupPage.logout();
      await loginPage.expectLoggedOut();
    });

    await test.step('Login again with the new credentials', async () => {
      await loginPage.login(user.email, user.password);
      await loginPage.expectLoggedInAs(user.name);
    });

    await test.step('Delete account (cleanup)', async () => {
      await signupPage.deleteAccount();
    });
  });

  test('TC02 - logout of an authenticated session @smoke', async ({ loggedInUser, homePage }) => {
    await homePage.logout();
    await homePage.expectLoggedOut();
    expect(loggedInUser.email).toContain('@');
  });

  test('TC03 - registering with an existing email is rejected', async ({
    registeredUser,
    loginPage,
  }) => {
    await loginPage.open();
    await loginPage.startSignup('Someone Else', registeredUser.email);
    await expect(loginPage.signupError).toBeVisible();
  });

  // Data-driven: one test per row of testdata/loginScenarios.json
  for (const scenario of loginScenarios) {
    test(`TC04 - login rejected: ${scenario.title}`, async ({ loginPage }) => {
      await loginPage.open();
      await loginPage.login(scenario.email, scenario.password);
      await expect(loginPage.loginError).toBeVisible();
      await expect(loginPage.loginError).toHaveText(scenario.expectedError);
    });
  }
});
