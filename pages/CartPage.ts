import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly rows: Locator;
  readonly emptyMessage: Locator;
  readonly proceedToCheckout: Locator;
  readonly checkoutModalLoginLink: Locator;

  constructor(page: Page) {
    super(page);
    this.rows = page.locator('#cart_info_table tbody tr');
    this.emptyMessage = page.locator('#empty_cart');
    this.proceedToCheckout = page.getByText('Proceed To Checkout');
    this.checkoutModalLoginLink = page.locator('#checkoutModal').getByRole('link', { name: /Register \/ Login/ });
  }

  async open(): Promise<void> {
    await this.goto('/view_cart');
  }

  async productNames(): Promise<string[]> {
    return (await this.rows.locator('td.cart_description h4 a').allTextContents()).map((t) => t.trim());
  }

  async removeProduct(name: string): Promise<void> {
    const row = this.rows.filter({ hasText: name });
    await row.locator('.cart_quantity_delete').click();
    await expect(row).toHaveCount(0);
  }

  async expectEmpty(): Promise<void> {
    await expect(this.emptyMessage).toBeVisible();
  }

  async checkout(): Promise<void> {
    await this.proceedToCheckout.click();
  }
}
