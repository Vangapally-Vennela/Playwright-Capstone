import { defineConfig, devices } from '@playwright/test';
import { env } from './config/env.config';

export default defineConfig({
  testDir: './tests', // 	Playwright only looks here for *.spec.ts where tests are live
  outputDir: './reports/test-results', // keeps artifacts in one place(videos, screeenshots, traces)
  timeout: env.testTimeout, // max time one whole test may run
  expect: {
    timeout: env.expectTimeout, //how long Playwright keeps re-checking an assertion before it gives up and fails the test.
    toHaveScreenshot: { maxDiffPixelRatio: 0.02, animations: 'disabled' },
  },
  fullyParallel: true,
  forbidOnly: env.isCI,
  retries: env.retries, 
  workers: env.workers, // Number of parallel processes

  // Multiple reporters: console, rich HTML, machine-readable JSON + JUnit for CI.
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['json', { outputFile: 'reports/results.json' }],
    ['junit', { outputFile: 'reports/junit.xml' }],
  ],

  use: {
    baseURL: env.baseURL,
    actionTimeout: env.actionTimeout,
    navigationTimeout: env.navigationTimeout,
    // Debug artefacts: kept only when something goes wrong.
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    testIdAttribute: 'data-qa', // automationexercise.com exposes data-qa attributes
  },

  // Cross-browser execution.
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
