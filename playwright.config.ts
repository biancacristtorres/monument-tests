import { defineConfig } from '@playwright/test';
import { ENV } from './src/config/Env';

export default defineConfig({
  globalSetup: "./globalSetup.ts",
  expect: {
    timeout: 30_000
  },
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    trace: 'on-first-retry',
    browserName: 'chromium',
    headless: false,
    baseURL: ENV.MONUMENT_BASE_URL,
  },

  projects: [
    {
      name: 'admin-logged-in',
      testDir: "tests/ui/loggedIn",
      testMatch: ["**/*.ui.spec.ts"],
      use: {
        storageState: "tests/ui/storages/admin.json",
      },
    },

    {
      name: 'admin-logged-out',
      testDir: "tests/ui/loggedOut",
      testMatch: ["**/*.ui.spec.ts"],
      use: {
        storageState: undefined,
      },
    },

    {
      name: "api",
      testDir: "tests/api",
      testMatch: ["**/*.api.spec.ts"],
      use: { storageState: undefined },
    }
  ],
});
