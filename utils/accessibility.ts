import AxeBuilder from '@axe-core/playwright';
import { Page, TestInfo } from '@playwright/test';

export type Impact = 'minor' | 'moderate' | 'serious' | 'critical';

const ORDER: Impact[] = ['minor', 'moderate', 'serious', 'critical'];

/**
 * Runs axe-core against the current page, attaches the full JSON report to the
 * Playwright report, and returns violations at or above `minImpact`.
 * Third-party ad frames are excluded: they are outside the client's control.
 */
export async function runAxe(
  page: Page,
  testInfo: TestInfo,
  minImpact: Impact = 'critical',
  label = 'axe-report',
) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .exclude('iframe[id^="aswift"]')
    .exclude('ins.adsbygoogle')
    .analyze();

  await testInfo.attach(`${label}.json`, {
    body: JSON.stringify(results.violations, null, 2),
    contentType: 'application/json',
  });

  const threshold = ORDER.indexOf(minImpact);
  return results.violations.filter(
    (v) => v.impact && ORDER.indexOf(v.impact as Impact) >= threshold,
  );
}

/** Compact, readable summary used in assertion messages. */
export function summarise(violations: { id: string; impact?: string | null; nodes: unknown[] }[]) {
  return violations.map((v) => `${v.id} [${v.impact}] x${v.nodes.length}`).join('\n') || 'none';
}
