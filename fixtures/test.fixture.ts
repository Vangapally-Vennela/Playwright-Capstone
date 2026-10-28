import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PaymentPage } from '../pages/PaymentPage';
import { ContactUsPage } from '../pages/ContactUsPage';
import { ApiHelper } from '../utils/apiHelper';
import { blockAds } from '../utils/networkHelper';
import { buildUser, UserData } from '../utils/dataGenerator';
import { logger } from '../utils/logger';

type Fixtures = {
  // page objects
  homePage: HomePage;
  loginPage: LoginPage;
  signupPage: SignupPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  paymentPage: PaymentPage;
  contactUsPage: ContactUsPage;
  // helpers / data
  api: ApiHelper;
  /** A fresh user created through the API and deleted after the test. */
  registeredUser: UserData;
  /** Same as registeredUser, but already logged in through the UI. */
  loggedInUser: UserData;
  /** Auto fixture: blocks ads/trackers for every test. */
  adBlocker: void;
};

export const test = base.extend<Fixtures>({
  adBlocker: [
    async ({ page }, use) => {
      await blockAds(page);
      await use();
    },
    { auto: true },
  ],

  homePage: async ({ page }, use) => use(new HomePage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  signupPage: async ({ page }, use) => use(new SignupPage(page)),
  productsPage: async ({ page }, use) => use(new ProductsPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  paymentPage: async ({ page }, use) => use(new PaymentPage(page)),
  contactUsPage: async ({ page }, use) => use(new ContactUsPage(page)),

  api: async ({ request }, use) => use(new ApiHelper(request)),

  registeredUser: async ({ api }, use) => {
    const user = buildUser();
    await api.createUser(user);
    logger.info(`Created test user ${user.email}`);
    await use(user);
    await api.deleteUser(user.email, user.password); // teardown
    logger.info(`Deleted test user ${user.email}`);
  },

  loggedInUser: async ({ registeredUser, loginPage }, use) => {
    await loginPage.open();
    await loginPage.login(registeredUser.email, registeredUser.password);
    await loginPage.expectLoggedInAs(registeredUser.name);
    await use(registeredUser);
  },
});

export { expect };
