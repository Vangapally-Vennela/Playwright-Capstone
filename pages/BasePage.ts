import { Locator, Page, expect } from '@playwright/test';

/**
 * Shared behaviour for every page object: navigation, the global header
 * (visible on all pages) and common assertions.
 * Locator strategy: data-qa (test id) > role/label > text > CSS (last resort).
 */
export abstract class BasePage {
  readonly loggedInAs: Locator;
  readonly logoutLink: Locator;
  readonly loginLink: Locator;
  readonly cartLink: Locator;
  readonly productsLink: Locator;
  readonly contactLink: Locator;
  readonly deleteAccountLink: Locator;

  constructor(protected readonly page: Page) {
    const header = page.locator('header#header');
    this.loggedInAs = header.getByText(/Logged in as/);
    this.logoutLink = header.getByRole('link', { name: /Logout/ });
    this.loginLink = header.getByRole('link', { name: /Signup \/ Login/ });
    this.cartLink = header.getByRole('link', { name: /Cart/ });
    this.productsLink = header.getByRole('link', { name: /Products/ });
    this.contactLink = header.getByRole('link', { name: /Contact us/ });
    this.deleteAccountLink = header.getByRole('link', { name: /Delete Account/ });
  }

  async goto(path = '/'): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.dismissConsentIfPresent();
  }

  /** The site shows a cookie/consent dialog on first visit; close it if it appears. */
  async dismissConsentIfPresent(): Promise<void> {
    const consent = this.page.getByRole('button', { name: /^Consent$/ });
    if (await consent.isVisible().catch(() => false)) {
      await consent.click();
    }
  }

  async expectLoggedInAs(username: string): Promise<void> {
    await expect(this.loggedInAs).toContainText(username);
  }

  async expectLoggedOut(): Promise<void> {
    await expect(this.loginLink).toBeVisible();
    await expect(this.loggedInAs).toHaveCount(0);
  }

  // async logout(): Promise<void> {
  //   await this.logoutLink.click();
  //   await expect(this.page).toHaveURL(/\/login/);
  // }
  async logout(): Promise<void> {
  await this.logoutLink.click();

  await expect(
    this.page.getByText('Login to your account')
  ).toBeVisible();
}

  async openCart(): Promise<void> {
    await this.cartLink.click();
    await expect(this.page).toHaveURL(/\/view_cart/);
  }
}
