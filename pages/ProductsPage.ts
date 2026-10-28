// // import { Locator, Page, expect } from '@playwright/test';
// // import { BasePage } from './BasePage';

// // export class ProductsPage extends BasePage {
// //   readonly heading: Locator;
// //   readonly searchInput: Locator;
// //   readonly searchButton: Locator;
// //   readonly searchedHeading: Locator;
// //   readonly productCards: Locator;
// //   readonly cartModal: Locator;
// //   readonly continueShopping: Locator;
// //   readonly viewCartInModal: Locator;

// //   constructor(page: Page) {
// //     super(page);
// //     this.heading = page.locator('.title.text-center');
// //     this.searchInput = page.locator('#search_product');
// //     this.searchButton = page.locator('#submit_search');
// //     this.searchedHeading = page.getByRole('heading', { name: /Searched Products/i });
// //     this.productCards = page.locator('.features_items .product-image-wrapper');
// //     this.cartModal = page.locator('#cartModal');
// //     this.continueShopping = this.cartModal.getByRole('button', { name: 'Continue Shopping' });
// //     this.viewCartInModal = this.cartModal.getByRole('link', { name: 'View Cart' });
// //   }
// // async open(): Promise<void> {
// //   await this.goto('/products');
// //   await this.page.waitForLoadState('networkidle');
// // }

// //   async search(term: string): Promise<void> {
// //     await this.searchInput.fill(term);
// //     await this.searchButton.click();
// //     await expect(this.searchedHeading).toBeVisible();
// //   }

// //   async resultNames(): Promise<string[]> {
// //     return (await this.productCards.locator('.productinfo p').allTextContents()).map((t) => t.trim());
// //   }

// //   /** Product card by 0-based index. */
// //   card(index: number): Locator {
// //     return this.productCards.nth(index);
// //   }

// //   async productName(index: number): Promise<string> {
// //     return (await this.card(index).locator('.productinfo p').innerText()).trim();
// //   }

// //   /**
// //    * Adds a product to the cart. The "Add to cart" button inside the hover overlay
// //    * is only clickable once the card is hovered, so hover first (auto-wait does the rest).
// //    */
// //   async addToCart(index: number): Promise<string> {
// //     const name = await this.productName(index);
// //     const card = this.card(index);
// //     await card.scrollIntoViewIfNeeded();
// //     await card.hover();
// //     await card.locator('.product-overlay .add-to-cart').click();
// //     await expect(this.cartModal).toBeVisible();
// //     return name;
// //   }

// //   async addToCartAndContinue(index: number): Promise<string> {
// //     const name = await this.addToCart(index);
// //     await this.continueShopping.click();
// //     await expect(this.cartModal).toBeHidden();
// //     return name;
// //   }

// //   async addToCartAndViewCart(index: number): Promise<string> {
// //     const name = await this.addToCart(index);
// //     await this.viewCartInModal.click();
// //     await expect(this.page).toHaveURL(/\/view_cart/);
// //     return name;
// //   }
// // }
// import { Locator, Page, expect } from '@playwright/test';
// import { BasePage } from './BasePage';

// export class ProductsPage extends BasePage {
//   readonly heading: Locator;
//   readonly searchInput: Locator;
//   readonly searchButton: Locator;
//   readonly searchedHeading: Locator;
//   readonly productCards: Locator;
//   readonly cartModal: Locator;
//   readonly continueShopping: Locator;
//   readonly viewCartInModal: Locator;

//   constructor(page: Page) {
//     super(page);

//     this.heading = page.locator('.title.text-center');
//     this.searchInput = page.locator('#search_product');
//     this.searchButton = page.locator('#submit_search');
//     this.searchedHeading = page.getByRole('heading', {
//       name: /Searched Products/i,
//     });

//     // Updated locator
//     this.productCards = page.locator(
//       '.features_items .single-products'
//     );

//     this.cartModal = page.locator('#cartModal');
//     this.continueShopping = this.cartModal.getByRole('button', {
//       name: 'Continue Shopping',
//     });
//     this.viewCartInModal = this.cartModal.getByRole('link', {
//       name: 'View Cart',
//     });
//   }

//   async open(): Promise<void> {
//     await this.goto('/products');
//     await this.page.waitForLoadState('networkidle');

//     await this.productCards.first().waitFor({
//       state: 'visible',
//     });
//   }

//   async search(term: string): Promise<void> {
//     await this.searchInput.fill(term);
//     await this.searchButton.click();

//     await expect(this.searchedHeading).toBeVisible();

//     await this.productCards.first().waitFor({
//       state: 'visible',
//     });
//   }

//   async resultNames(): Promise<string[]> {
//     return (
//       await this.productCards
//         .locator('.productinfo p')
//         .allTextContents()
//     ).map((t) => t.trim());
//   }

//   /** Product card by 0-based index */
//   card(index: number): Locator {
//     return this.productCards.nth(index);
//   }

//   async productName(index: number): Promise<string> {
//     const productName = this.card(index).locator('.productinfo p');

//     await productName.waitFor({
//       state: 'visible',
//     });

//     return ((await productName.textContent()) ?? '').trim();
//   }

//   async addToCart(index: number): Promise<string> {
//     const name = await this.productName(index);

//     const card = this.card(index);

//     await card.scrollIntoViewIfNeeded();
//     await card.hover();

//     const addToCartButton = card.locator(
//       '.product-overlay .add-to-cart'
//     );

//     await addToCartButton.waitFor({
//       state: 'visible',
//     });

//     await addToCartButton.click();

//     await expect(this.cartModal).toBeVisible();

//     return name;
//   }

//   async addToCartAndContinue(index: number): Promise<string> {
//     const name = await this.addToCart(index);

//     await this.continueShopping.click();

//     await expect(this.cartModal).toBeHidden();

//     return name;
//   }

//   async addToCartAndViewCart(index: number): Promise<string> {
//     const name = await this.addToCart(index);

//     await this.viewCartInModal.click();

//     await expect(this.page).toHaveURL(/\/view_cart/);

//     return name;
//   }
// }
import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchedHeading: Locator;
  readonly productCards: Locator;
  readonly cartModal: Locator;
  readonly continueShopping: Locator;
  readonly viewCartInModal: Locator;

  constructor(page: Page) {
    super(page);

    this.heading = page.locator('.title.text-center');
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.searchedHeading = page.getByRole('heading', {
      name: /Searched Products/i,
    });

    this.productCards = page.locator(
      '.features_items .single-products'
    );

    this.cartModal = page.locator('#cartModal');
    this.continueShopping = this.cartModal.getByRole('button', {
      name: 'Continue Shopping',
    });
    this.viewCartInModal = this.cartModal.getByRole('link', {
      name: 'View Cart',
    });
  }

  async open(): Promise<void> {
    await this.goto('/products');
    await this.page.waitForLoadState('networkidle');

    await this.productCards.first().waitFor({
      state: 'visible',
    });
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchButton.click();

    await expect(this.searchedHeading).toBeVisible();

    // Do NOT wait for product cards here.
    // Some searches intentionally return zero results.
    await expect(
      this.page.locator('.features_items')
    ).toBeVisible();
  }

  async resultNames(): Promise<string[]> {
    return (
      await this.productCards
        .locator('.productinfo p')
        .allTextContents()
    ).map((t) => t.trim());
  }

  /** Product card by 0-based index */
  card(index: number): Locator {
    return this.productCards.nth(index);
  }

  async productName(index: number): Promise<string> {
    const productName = this.card(index).locator('.productinfo p');

    await productName.waitFor({
      state: 'visible',
    });

    return ((await productName.textContent()) ?? '').trim();
  }

  async addToCart(index: number): Promise<string> {
    const name = await this.productName(index);

    const card = this.card(index);

    await card.scrollIntoViewIfNeeded();
    await card.hover();

    const addToCartButton = card.locator(
      '.product-overlay .add-to-cart'
    );

    await addToCartButton.waitFor({
      state: 'visible',
    });

    await addToCartButton.click();

    await expect(this.cartModal).toBeVisible();

    return name;
  }

  async addToCartAndContinue(index: number): Promise<string> {
    const name = await this.addToCart(index);

    await this.continueShopping.click();

    await expect(this.cartModal).toBeHidden();

    return name;
  }

  async addToCartAndViewCart(index: number): Promise<string> {
    const name = await this.addToCart(index);

    await this.viewCartInModal.click();

    await expect(this.page).toHaveURL(/\/view_cart/);

    return name;
  }
}