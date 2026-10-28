import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly deliveryAddress: Locator;
  readonly billingAddress: Locator;
  readonly orderRows: Locator;
  readonly commentBox: Locator;
  readonly placeOrder: Locator;

  constructor(page: Page) {
    super(page);
    this.deliveryAddress = page.locator('#address_delivery');
    this.billingAddress = page.locator('#address_invoice');
    this.orderRows = page.locator('#cart_info tbody tr').filter({ has: page.locator('.cart_description') });
    this.commentBox = page.locator('textarea[name="message"]');
    this.placeOrder = page.getByRole('link', { name: 'Place Order' });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/checkout/);
    await expect(this.deliveryAddress).toBeVisible();
  }

  async productNames(): Promise<string[]> {
    return (await this.orderRows.locator('.cart_description h4 a').allTextContents()).map((t) => t.trim());
  }

  async submitOrder(comment: string): Promise<void> {
    await this.commentBox.fill(comment);
    await this.placeOrder.click();
    await expect(this.page).toHaveURL(/\/payment/);
  }
}
