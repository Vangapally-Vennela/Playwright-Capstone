// import { Locator, Page, expect } from '@playwright/test';
// import { BasePage } from './BasePage';
// import { UserData } from '../utils/dataGenerator';

// export class SignupPage extends BasePage {
//   readonly heading: Locator;
//   readonly createAccountButton: Locator;
//   readonly accountCreated: Locator;
//   readonly accountDeleted: Locator;
//   readonly continueButton: Locator;

//   constructor(page: Page) {
//     super(page);
//     this.heading = page.getByText('Enter Account Information');
//     this.createAccountButton = page.getByTestId('create-account');
//     this.accountCreated = page.getByTestId('account-created');
//     this.accountDeleted = page.getByTestId('account-deleted');
//     this.continueButton = page.getByTestId('continue-button');
//   }

//   async fillAccountDetails(u: UserData): Promise<void> {
//     await expect(this.heading).toBeVisible();
//     await this.page.locator(u.title === 'Mr' ? '#id_gender1' : '#id_gender2').check();
//     await this.page.getByTestId('password').fill(u.password);
//     await this.page.getByTestId('days').selectOption(u.birthDay);
//     await this.page.getByTestId('months').selectOption(u.birthMonth);
//     await this.page.getByTestId('years').selectOption(u.birthYear);
//     await this.page.getByTestId('first_name').fill(u.firstName);
//     await this.page.getByTestId('last_name').fill(u.lastName);
//     await this.page.getByTestId('company').fill(u.company);
//     await this.page.getByTestId('address').fill(u.address1);
//     await this.page.getByTestId('address2').fill(u.address2);
//     await this.page.getByTestId('country').selectOption(u.country);
//     await this.page.getByTestId('state').fill(u.state);
//     await this.page.getByTestId('city').fill(u.city);
//     await this.page.getByTestId('zipcode').fill(u.zipcode);
//     await this.page.getByTestId('mobile_number').fill(u.mobile);
//   }

//   async submit(): Promise<void> {
//     await this.createAccountButton.click();
//     await expect(this.accountCreated).toBeVisible();
//   }

//   async continueAfterCreation(): Promise<void> {
//     await this.continueButton.click();
//   }

//   async deleteAccount(): Promise<void> {
//     await this.deleteAccountLink.click();
//     await expect(this.accountDeleted).toBeVisible();
//     await this.continueButton.click();
//   }
// }
import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { UserData } from '../utils/dataGenerator';

export class SignupPage extends BasePage {
  readonly heading: Locator;
  readonly createAccountButton: Locator;
  readonly accountCreated: Locator;
  readonly accountDeleted: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);

    this.heading = page.getByText('Enter Account Information');
    this.createAccountButton = page.getByTestId('create-account');
    this.accountCreated = page.getByTestId('account-created');
    this.accountDeleted = page.getByTestId('account-deleted');
    this.continueButton = page.getByTestId('continue-button');
  }

  async fillAccountDetails(u: UserData): Promise<void> {
    await expect(this.heading).toBeVisible();

    await this.page
      .locator(u.title === 'Mr' ? '#id_gender1' : '#id_gender2')
      .check();

    await this.page.getByTestId('password').fill(u.password);

    await this.page.getByTestId('days').selectOption(u.birthDay);
    await this.page.getByTestId('months').selectOption(u.birthMonth);
    await this.page.getByTestId('years').selectOption(u.birthYear);

    await this.page.getByTestId('first_name').fill(u.firstName);
    await this.page.getByTestId('last_name').fill(u.lastName);
    await this.page.getByTestId('company').fill(u.company);

    await this.page.getByTestId('address').fill(u.address1);
    await this.page.getByTestId('address2').fill(u.address2);

    await this.page.getByTestId('country').selectOption(u.country);

    await this.page.getByTestId('state').fill(u.state);
    await this.page.getByTestId('city').fill(u.city);
    await this.page.getByTestId('zipcode').fill(u.zipcode);
    await this.page.getByTestId('mobile_number').fill(u.mobile);
  }

  async submit(): Promise<void> {
    await expect(this.createAccountButton).toBeVisible();
    await expect(this.createAccountButton).toBeEnabled();

    await this.createAccountButton.scrollIntoViewIfNeeded();

    const invalidFields = await this.page.locator(':invalid').evaluateAll(
      elements =>
        elements.map(
          element =>
            (element as HTMLInputElement).name ||
            (element as HTMLInputElement).id
        )
    );

    console.log('Invalid fields:', invalidFields);

    await this.createAccountButton.click({ force: true });

    await expect(this.accountCreated).toBeVisible({
      timeout: 30000,
    });
  }

  async continueAfterCreation(): Promise<void> {
    await this.continueButton.click();
  }

  async deleteAccount(): Promise<void> {
    await this.deleteAccountLink.click();

    await expect(this.accountDeleted).toBeVisible({
      timeout: 30000,
    });

    await this.continueButton.click();
  }
}