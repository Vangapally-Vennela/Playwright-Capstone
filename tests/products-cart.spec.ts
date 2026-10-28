import { test, expect } from '../fixtures/test.fixture';
import products from '../testdata/products.json';

test.describe('Product search and cart', () => {
  // Data-driven search
  for (const { term, minResults } of products.searchTerms) {
    test(`TC05 - search returns relevant results for "${term}" @smoke`, async ({ productsPage }) => {
      await productsPage.open();
      await productsPage.search(term);
      const count = await productsPage.productCards.count();
      expect(count).toBeGreaterThanOrEqual(minResults);
      for (const name of await productsPage.resultNames()) {
        expect.soft(name.toLowerCase()).toContain(term.toLowerCase().replace('tshirt', 'shirt'));
      }
    });
  }

  test('TC06 - search with no matches shows an empty result set', async ({ productsPage }) => {
    await productsPage.open();
    await productsPage.search(products.noResultTerm);
    await expect(productsPage.productCards).toHaveCount(0);
  });

  test('TC07 - add multiple products to the cart and remove one @smoke', async ({
    productsPage,
    cartPage,
  }) => {
    await productsPage.open();
    const first = await productsPage.addToCartAndContinue(0);
    const second = await productsPage.addToCartAndViewCart(1);

    await expect(cartPage.rows).toHaveCount(2);
    expect(await cartPage.productNames()).toEqual(expect.arrayContaining([first, second]));

    await cartPage.removeProduct(first);
    await expect(cartPage.rows).toHaveCount(1);
    expect(await cartPage.productNames()).toEqual([second]);

    await cartPage.removeProduct(second);
    await cartPage.expectEmpty();
  });
});
