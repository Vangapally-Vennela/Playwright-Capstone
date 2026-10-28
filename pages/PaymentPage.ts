import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface PaymentData {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
}

export class PaymentPage extends BasePage {
  readonly payButton: Locator;
  readonly orderPlaced: Locator;
  readonly successMessage: Locator;
  readonly downloadInvoice: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.payButton = page.getByTestId('pay-button');
    this.orderPlaced = page.getByTestId('order-placed');
    this.successMessage = page.getByText('Congratulations! Your order has been confirmed!');
    this.downloadInvoice = page.getByRole('link', { name: 'Download Invoice' });
    this.continueButton = page.getByTestId('continue-button');
  }

  async pay(p: PaymentData): Promise<void> {
    await this.page.getByTestId('name-on-card').fill(p.nameOnCard);
    await this.page.getByTestId('card-number').fill(p.cardNumber);
    await this.page.getByTestId('cvc').fill(p.cvc);
    await this.page.getByTestId('expiry-month').fill(p.expiryMonth);
    await this.page.getByTestId('expiry-year').fill(p.expiryYear);
    await this.payButton.click();
  }

  async expectOrderConfirmed(): Promise<void> {
    await expect(this.orderPlaced).toBeVisible();
    await expect(this.successMessage).toBeVisible();
    await expect(this.downloadInvoice).toBeVisible();
  }
}
