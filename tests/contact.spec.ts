import { test, expect } from '../fixtures/test.fixture';
import contact from '../testdata/contact.json';

test.describe('Contact Us form', () => {
  test('TC10 - valid submission shows success message @smoke', async ({ contactUsPage }) => {
    await contactUsPage.open();
    await contactUsPage.fill(contact.valid);
    await contactUsPage.submitForm();
    await contactUsPage.expectSuccess();
  });

  test('TC11 - empty required fields block submission', async ({ contactUsPage }) => {
    await contactUsPage.open();
    await contactUsPage.submit.click();
    const validationMessage = await contactUsPage.email.evaluate(
  el => (el as HTMLInputElement).validationMessage
);

expect(validationMessage).not.toBe('');
  await expect(contactUsPage.success).not.toBeVisible();
  });

  for (const badEmail of contact.invalidEmails) {
    test(`TC12 - invalid email "${badEmail}" is rejected by validation`, async ({ contactUsPage }) => {
      await contactUsPage.open();
      await contactUsPage.fill({ ...contact.valid, email: badEmail });
      await contactUsPage.submit.click();
      expect(await contactUsPage.validationMessage(contactUsPage.email)).not.toBe('');
      await expect(contactUsPage.success).not.toBeVisible();
    });
  }
});
