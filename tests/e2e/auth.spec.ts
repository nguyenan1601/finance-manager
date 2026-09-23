import { expect, test } from "@playwright/test";

const PROTECTED_PAGES = [
  "/",
  "/transactions",
  "/budgets",
  "/reports",
  "/settings",
  "/ai-assistant",
];

/** Start from a clean context so the redirect path is genuinely exercised. */
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("authentication gate", () => {
  for (const path of PROTECTED_PAGES) {
    test(`redirects an anonymous visitor from ${path} to /login`, async ({
      page,
    }) => {
      await page.goto(path);
      await page.waitForURL("**/login");

      expect(new URL(page.url()).pathname).toBe("/login");
      await expect(
        page.getByRole("heading", { level: 1 }).or(page.getByText("Chào mừng trở lại!")),
      ).toBeVisible();
    });
  }

  test("rejects an invalid password with a visible error", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("demo-a-test@levi-fixture.local");
    await page.getByLabel("Mật khẩu").fill("definitely-wrong");
    await page.getByRole("button", { name: "Đăng nhập" }).click();

    await expect(page.getByRole("alert")).toBeVisible();
  });

  test("flags a malformed email on the registration form", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel("Họ và tên").fill("Người dùng thử");
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByLabel("Mật khẩu").fill("FixturePass123!");
    await page.getByRole("button", { name: "Tạo tài khoản" }).click();

    // The field is type="email", so native validation blocks the submit before
    // the app's own regex ever runs. Verified behaviour: the field fails
    // constraint validation and the user stays on /register.
    const emailIsValid = await page
      .getByLabel("Email")
      .evaluate((element) => (element as HTMLInputElement).checkValidity());
    expect(emailIsValid).toBe(false);
    await expect(page).toHaveURL(/\/register$/);
  });
});
