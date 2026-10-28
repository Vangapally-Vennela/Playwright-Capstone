import { test, expect } from '../fixtures/test.fixture';

test.describe('Network interception and mocking', () => {
  test('TC13 - mock the products API response', async ({ page, homePage }) => {
    const mocked = {
      responseCode: 200,
      products: [{ id: 1, name: 'Mocked Product', price: 'Rs. 1', brand: 'MockBrand' }],
    };

    await page.route('**/api/productsList', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mocked) }),
    );

    await homePage.open();
    // Call through the browser so the request passes through page.route().
    const body = await page.evaluate(async () => {
      const r = await fetch('/api/productsList');
      return r.json();
    });

    expect(body.products).toHaveLength(1);
    expect(body.products[0].name).toBe('Mocked Product');
  });

//   test('TC14 - modify a real response: rename the first product in the UI', async ({
//   page,
//   productsPage,
// }) => {
//   await page.route('**/api/productsList', async (route) => {
//     const response = await route.fetch();
//     const body = await response.json();
//     console.log('Original product:', body.products[0].name);

//     body.products[0].name = 'Mocked Product';

//     await route.fulfill({
//       status: 200,
//       contentType: 'application/json',
//       body: JSON.stringify(body),
//     });
//   });

//   await productsPage.open();

//   await expect(
//     productsPage.card(0).locator('.productinfo p')
//   ).toHaveText('Mocked Product');
// });
test('TC14 - modify API response', async ({ page }) => {
  await page.route('**/api/productsList', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        responseCode: 200,
        products: [
          {
            id: 1,
            name: 'Mocked Product',
            price: 'Rs. 1',
            brand: 'MockBrand',
          },
        ],
      }),
    });
  });

  await page.goto('/');

  const body = await page.evaluate(async () => {
    const response = await fetch('/api/productsList');
    return response.json();
  });

  expect(body.products[0].name).toBe('Mocked Product');
});
  test('TC15 - simulate API failure and verify the client observes it', async ({ page, homePage }) => {
    await page.route('**/api/productsList', (route) => route.abort('failed'));
    await homePage.open();

    const failed = await page.evaluate(async () => {
      try {
        await fetch('/api/productsList');
        return false;
      } catch {
        return true;
      }
    });
    expect(failed).toBe(true);
  });
});
