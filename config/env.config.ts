import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * Central configuration. Every environment-specific value lives here so tests
 * never hard-code URLs, credentials or timeouts.
 */
export const env = {
  baseURL: process.env.BASE_URL ?? 'https://automationexercise.com',
  actionTimeout: Number(process.env.ACTION_TIMEOUT ?? 15_000),
  navigationTimeout: Number(process.env.NAVIGATION_TIMEOUT ?? 45_000),
  testTimeout: Number(process.env.TEST_TIMEOUT ?? 90_000),
  expectTimeout: Number(process.env.EXPECT_TIMEOUT ?? 10_000),
  retries: Number(process.env.RETRIES ?? (process.env.CI ? 2 : 0)),
  workers: Number(process.env.WORKERS ?? (process.env.CI ? 2 : 2)),
  isCI: !!process.env.CI,
};
