import { test, expect } from '../fixtures/test.fixture';
import payment from '../testdata/payment.json';

test.describe('Checkout and order placement', () => {
  test('TC08 - logged-in user places an order and sees confirmation @smoke', async ({
    loggedInUser,
    productsPage,
    cartPage,
    checkoutPage,
    paymentPage,
  }) => {
    let productName = '';

    await test.step('Add a product to the cart', async () => {
      await productsPage.open();
      productName = await productsPage.addToCartAndViewCart(0);
      expect(await cartPage.productNames()).toContain(productName);
    });

    await test.step('Review the order and delivery address', async () => {
      await cartPage.checkout();
      await checkoutPage.expectLoaded();
      await expect(checkoutPage.deliveryAddress).toContainText(loggedInUser.firstName);
      await expect(checkoutPage.deliveryAddress).toContainText(loggedInUser.city);
      expect(await checkoutPage.productNames()).toContain(productName);
    });

    await test.step('Place the order and pay', async () => {
      await checkoutPage.submitOrder('Automated order from Playwright capstone');
      await paymentPage.pay(payment);
    });

    await test.step('Validate the order confirmation', async () => {
      await paymentPage.expectOrderConfirmed();
    });
  });

  test('TC09 - guest checkout prompts for login/registration', async ({
    productsPage,
    cartPage,
    page,
  }) => {
    await productsPage.open();
    await productsPage.addToCartAndViewCart(0);
    await cartPage.checkout();
    await expect(cartPage.checkoutModalLoginLink).toBeVisible();
    await cartPage.checkoutModalLoginLink.click();
    await expect(page).toHaveURL(/\/login/);
  });
});
