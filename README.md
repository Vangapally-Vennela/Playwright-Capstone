# Enterprise E-Commerce Automation Framework

Playwright + TypeScript framework for **https://automationexercise.com/** (Perficient Playwright capstone).

## 1. Quick start

```bash
npm install
npx playwright install --with-deps     # downloads Chromium, Firefox, WebKit
cp .env.example .env                   # optional overrides

npm run test:update-snapshots          # ONE-TIME: create visual baselines for your OS/browsers
npm test                               # all tests, all 3 browsers
npm run test:chromium                  # single browser
npm run test:smoke                     # @smoke subset
npm run report                         # open HTML report (reports/html)
```

Debugging: `npm run test:debug`, `npm run test:headed`, `npx playwright show-trace <trace.zip>`.

## 2. Structure

```
pages/        Page Objects (BasePage + one class per page)
fixtures/     Custom fixtures: page objects, API helper, registeredUser, loggedInUser, auto ad-blocker
tests/        Specs grouped by business area
utils/        dataGenerator, apiHelper, networkHelper, accessibility (axe), logger
testdata/     JSON test data (products, payment, contact, login scenarios)
config/       env.config.ts - single source of truth for URLs/timeouts/retries
reports/      HTML, JSON and JUnit reports + failure artefacts (trace/screenshot/video)
```

## 3. Requirement coverage

| Requirement | Where |
|---|---|
| Registration / Login / Logout | `tests/auth.spec.ts` (TC01-TC04) |
| Product search, add/remove cart | `tests/products-cart.spec.ts` (TC05-TC07) |
| Checkout + order placement validation | `tests/checkout.spec.ts` (TC08-TC09) |
| Contact Us validation | `tests/contact.spec.ts` (TC10-TC12) |
| Page Object Model | `pages/` |
| Custom fixtures | `fixtures/test.fixture.ts` |
| Data-driven testing | JSON in `testdata/` driving loops in specs (TC04, TC05, TC12) |
| Network interception & mocking | `tests/network-mocking.spec.ts` (TC13-TC15), `utils/networkHelper.ts` |
| Trace Viewer & debugging | `playwright.config.ts` (`trace: retain-on-failure`, screenshots, video) |
| Cross-browser | `projects`: chromium, firefox, webkit |
| Accessibility (axe-core) | `tests/accessibility.spec.ts`, `utils/accessibility.ts` |
| Visual regression | `tests/visual.spec.ts` (`toHaveScreenshot`) |
| AI-assisted creation | Section 7 |
| Reporting | HTML + JSON + JUnit reporters |

## 4. Design decisions

**Locator strategy** (most to least preferred): `data-qa` test ids via `getByTestId` (configured with `testIdAttribute: 'data-qa'`), then role/label/text (`getByRole`, `getByText`), then scoped CSS as a last resort (legacy markup such as `#cart_info_table`). No XPath, no index-based selectors except deliberate product-card indexing.

**Synchronisation**: no fixed sleeps. We rely on Playwright auto-waiting plus web-first assertions (`expect(locator).toBeVisible()`), explicit state assertions after navigation (`toHaveURL`), and hover-before-click for the overlay "Add to cart" button. Ad/tracker requests are aborted to remove the main source of flaky overlays.

**POM**: pages expose intent (`login()`, `addToCartAndViewCart()`), hold locators, and contain *no test assertions about business outcomes*, only readiness checks; specs own the assertions. `BasePage` holds the shared header behaviour.

**Fixtures**: dependency injection replaces `beforeEach` boilerplate. `registeredUser` creates a user through the site's REST API and deletes it afterwards (fast, isolated, parallel-safe); `loggedInUser` builds on it. `adBlocker` is an `auto` fixture applied to every test.

**Test data**: static data in JSON; dynamic data (unique emails) from `faker` in `utils/dataGenerator.ts`. No data is shared between tests.

**Test organisation**: one spec file per business area; tags `@smoke`, `@a11y`, `@visual` for selective runs; `test.step` for readable reports.

**Reporting & debugging**: HTML report, JSON, JUnit (CI). On failure: trace, screenshot and video are retained. Open a trace with `npx playwright show-trace reports/test-results/<test>/trace.zip` to step through actions, DOM snapshots, network and console.

**Accessibility**: axe-core with WCAG 2.0/2.1 A and AA tags. Full violation list is attached to every report; the test gate fails on `critical` violations only (configurable per call) so third-party ads and known minor issues do not make the suite noisy.

**Visual regression**: component-level snapshots (login form, header, contact form) rather than full pages, to avoid dynamic content. Baselines are browser- and OS-specific, so they are generated locally/CI with `--update-snapshots` and committed.

## 5. Network mocking examples

- TC13: `route.fulfill` replaces `/api/productsList` with a stub JSON.
- TC14: `route.fetch()` gets the real page, the response HTML is modified, and the UI shows the mocked product name.
- TC15: `route.abort()` simulates an API outage.

## 6. Known limitations / things to know

- The application is a public demo site; its markup, ads or data can change. Selectors are centralised in `pages/` so fixes are one-line.
- This package was generated in an environment with no access to npm or to automationexercise.com, so the tests have **not been executed yet**. Run `npm install`, `npx playwright install`, then `npm test` locally to produce your execution reports (`reports/`), and adjust any selector the live DOM disagrees with.
- Visual baselines must be generated once (see Quick start).
- The a11y gate is set to `critical`; tighten to `serious` once the client triages issues.

## 7. AI-assisted development (Copilot / MCP) - how to demonstrate it

1. Enable the **Playwright MCP server** in VS Code (`npx @playwright/mcp@latest`) and use Copilot Agent mode to explore the site and draft a test, e.g. *"Using Playwright MCP, open automationexercise.com/contact_us and draft a POM + test for the contact form."*
2. Review and **improve** generated code. Typical improvements to call out in your presentation:
   - replace brittle CSS/XPath with `data-qa` test ids and role locators;
   - remove `waitForTimeout` and use web-first assertions;
   - move repeated steps into page objects and fixtures;
   - externalise data and add unique-data generation;
   - add API-based setup/teardown for isolation.
3. Keep a short log of prompt -> generated output -> your refinement for the panel.

## 8. CI example (GitHub Actions)

```yaml
name: e2e
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
        env: { CI: 'true' }
      - uses: actions/upload-artifact@v4
        if: always()
        with: { name: reports, path: reports/ }
```
