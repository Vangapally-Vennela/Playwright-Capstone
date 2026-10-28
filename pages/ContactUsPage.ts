import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export class ContactUsPage extends BasePage {
  readonly heading: Locator;
  readonly name: Locator;
  readonly email: Locator;
  readonly subject: Locator;
  readonly message: Locator;
  readonly submit: Locator;
  readonly success: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Get In Touch' });
    this.name = page.getByTestId('name');
    this.email = page.getByTestId('email');
    this.subject = page.getByTestId('subject');
    this.message = page.getByTestId('message');
    this.submit = page.getByTestId('submit-button');
    this.success = page.locator('.status.alert-success');
  }

  async open(): Promise<void> {
    await this.goto('/contact_us');
    await expect(this.heading).toBeVisible();
  }

  async fill(d: ContactData): Promise<void> {
    await this.name.fill(d.name);
    await this.email.fill(d.email);
    await this.subject.fill(d.subject);
    await this.message.fill(d.message);
  }

  /** Submitting triggers a native confirm() dialog which must be accepted. */
  async submitForm(): Promise<void> {
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.submit.click();
  }

  async expectSuccess(): Promise<void> {
    await expect(this.success).toContainText('Success! Your details have been submitted successfully.');
  }

  /** Browser-native validation message for a field (e.g. invalid email). */
  async validationMessage(field: Locator): Promise<string> {
    return field.evaluate((el: HTMLInputElement) => el.validationMessage);
  }
}
