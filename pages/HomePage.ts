import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly logo: Locator;
  readonly carousel: Locator;
  readonly featuredItems: Locator;

  constructor(page: Page) {
    super(page);
    this.logo = page.locator('.logo img[alt="Website for automation practice"]');
    this.carousel = page.locator('#slider-carousel');
    this.featuredItems = page.locator('.features_items .product-image-wrapper');
  }

  async open(): Promise<void> {
    await this.goto('/');
    await expect(this.logo).toBeVisible();
  }
}
