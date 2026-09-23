import path from "node:path";

import { expect, test as setup } from "@playwright/test";

const STORAGE_STATE = path.resolve("tests/e2e/.auth/user.json");

/**
 * Signs in once and reuses the session for every other project. The account is a
 * disposable fixture created by `npm run seed:test`.
 */
setup("authenticate as the fixture user", async ({ page }) => {
  const email = process.env.E2E_USER_EMAIL ?? "demo-a-test@levi-fixture.local";
  const password = process.env.E2E_USER_PASSWORD ?? "FixturePass123!";

  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Mật khẩu").fill(password);
  await page.getByRole("button", { name: "Đăng nhập" }).click();

  await page.waitForURL("**/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.context().storageState({ path: STORAGE_STATE });
});
