import { defineConfig, devices } from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const STORAGE_STATE = "tests/e2e/.auth/user.json";

/**
 * The same specs run at every breakpoint the UI must survive. Widths are the
 * ones QA committed to: small phone, tablet, laptop, desktop.
 */
const viewports = [
  { name: "w320", width: 320, height: 720 },
  { name: "w768", width: 768, height: 900 },
  { name: "w1024", width: 1024, height: 800 },
  { name: "w1440", width: 1440, height: 900 },
];

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run dev",
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    ...viewports.map((viewport) => ({
      name: viewport.name,
      testIgnore: /auth\.setup\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: viewport.width, height: viewport.height },
        storageState: STORAGE_STATE,
      },
      dependencies: ["setup"],
    })),
  ],
});
