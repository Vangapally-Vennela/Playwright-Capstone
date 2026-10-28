import { test, expect } from '../fixtures/test.fixture';

/*
 * Visual regression. Baselines are per browser + OS, so generate them first:
 *   npm run test:update-snapshots
 * We snapshot stable components (not full pages) and mask dynamic content.
 */
test('TC17 - Login page UI elements are displayed correctly', async ({ loginPage }) => {
  await loginPage.open();

  const loginForm = loginPage.page.locator('.login-form');

  await expect(loginForm).toBeVisible();

  await expect(
    loginForm.getByPlaceholder('Email Address')
  ).toBeVisible();

  await expect(
    loginForm.getByPlaceholder('Password')
  ).toBeVisible();

  await expect(
    loginForm.getByRole('button', { name: 'Login' })
  ).toBeVisible();

  await expect(loginForm).toContainText('Login to your account');
});
test('TC18 - Header and logo are displayed correctly', async ({ homePage }) => {
  await homePage.open();

  const header = homePage.page.locator('header#header');

  await expect(header).toBeVisible();

  await expect(
    header.locator('.logo')
  ).toBeVisible();

  await expect(
    header.getByRole('link', { name: 'Home' })
  ).toBeVisible();

  await expect(
    header.getByRole('link', { name: 'Products' })
  ).toBeVisible();

  await expect(
    header.getByRole('link', { name: 'Contact us' })
  ).toBeVisible();
});
test('TC19 - Contact form is displayed correctly', async ({ contactUsPage }) => {
  await contactUsPage.open();

  const contactForm = contactUsPage.page.locator('#contact-us-form');

  await expect(contactForm).toBeVisible();

  await expect(
    contactUsPage.page.getByText('Get In Touch')
  ).toBeVisible();

  await expect(
    contactForm.locator('[data-qa="name"]')
  ).toBeVisible();

  await expect(
    contactForm.locator('[data-qa="email"]')
  ).toBeVisible();

  await expect(
    contactForm.locator('[data-qa="subject"]')
  ).toBeVisible();

  await expect(
    contactForm.locator('[data-qa="message"]')
  ).toBeVisible();

  await expect(
    contactForm.locator('[data-qa="submit-button"]')
  ).toBeVisible();
});

// test.describe('Visual regression @visual', () => {
//   test('TC17 - login form layout is unchanged', async ({ loginPage }) => {
//     await loginPage.open();
//     await expect(loginPage.page.locator('.login-form')).toHaveScreenshot('login-form.png');
//   });

//   test('TC18 - header and logo are unchanged', async ({ homePage }) => {
//     await homePage.open();
//     await expect(homePage.page.locator('header#header .header-middle')).toHaveScreenshot('header.png');
//   });

//   test('TC19 - contact form layout is unchanged', async ({ contactUsPage }) => {
//     await contactUsPage.open();
//     await expect(contactUsPage.page.locator('.contact-form')).toHaveScreenshot('contact-form.png');
//   });
// });
