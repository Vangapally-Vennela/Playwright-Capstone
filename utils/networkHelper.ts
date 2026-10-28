import { Page } from '@playwright/test';

/** Third-party ad / tracking hosts that slow tests down and cause flaky overlays. */
const BLOCKED_HOSTS = [
  'googlesyndication.com',
  'doubleclick.net',
  'googleadservices.com',
  'google-analytics.com',
  'googletagmanager.com',
  'adservice.google.com',
  'pagead2.googlesyndication.com',
];

/**
 * Network interception: abort ad/tracker requests.
 * automationexercise.com injects Google ad iframes and a vignette that can
 * intercept clicks, so blocking them is the most effective flake reduction.
 *
 * Uses a targeted regex instead of a catch-all route so only ad requests are
 * intercepted — non-ad traffic flows through without handler overhead, which
 * avoids navigation timeouts in Firefox.
 */
export async function blockAds(page: Page): Promise<void> {
  const pattern = new RegExp(
    BLOCKED_HOSTS.map((h) => h.replace(/\./g, '\\.')).join('|'),
  );
  await page.route(pattern, (route) => route.abort());
}
