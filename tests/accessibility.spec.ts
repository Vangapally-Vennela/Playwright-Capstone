import { test, expect } from '../fixtures/test.fixture';
import { runAxe } from '../utils/accessibility';

test('TC16 - Accessibility scan runs successfully', async ({
  page,
}, testInfo) => {
  await page.goto('/');

  const violations = await runAxe(
    page,
    testInfo,
    'serious',
    'axe-home'
  );

  expect(Array.isArray(violations)).toBeTruthy();
});
