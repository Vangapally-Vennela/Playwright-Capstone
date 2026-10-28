import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly loginHeading: Locator;
  readonly loginEmail: Locator;
  readonly loginPassword: Locator;
  readonly loginButton: Locator;
  readonly loginError: Locator;

  readonly signupHeading: Locator;
  readonly signupName: Locator;
  readonly signupEmail: Locator;
  readonly signupButton: Locator;
  readonly signupError: Locator;

  constructor(page: Page) {
    super(page);
    this.loginHeading = page.getByRole('heading', { name: 'Login to your account' });
    this.loginEmail = page.getByTestId('login-email');
    this.loginPassword = page.getByTestId('login-password');
    this.loginButton = page.getByTestId('login-button');
    this.loginError = page.getByText('Your email or password is incorrect!');

    this.signupHeading = page.getByRole('heading', { name: 'New User Signup!' });
    this.signupName = page.getByTestId('signup-name');
    this.signupEmail = page.getByTestId('signup-email');
    this.signupButton = page.getByTestId('signup-button');
    this.signupError = page.getByText('Email Address already exist!');
  }

  async open(): Promise<void> {
    await this.goto('/login');
    await expect(this.loginHeading).toBeVisible();
  }

  async login(email: string, password: string): Promise<void> {
    await this.loginEmail.fill(email);
    await this.loginPassword.fill(password);
    await this.loginButton.click();
  }

  async startSignup(name: string, email: string): Promise<void> {
    await expect(this.signupHeading).toBeVisible();
    await this.signupName.fill(name);
    await this.signupEmail.fill(email);
    await this.signupButton.click();
  }
}
