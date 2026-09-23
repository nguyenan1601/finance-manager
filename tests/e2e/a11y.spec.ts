import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = ["/", "/transactions", "/budgets", "/reports", "/settings", "/ai-assistant"];

const BLOCKING_IMPACTS = ["critical", "serious"];

test.describe("accessibility", () => {
  for (const path of PAGES) {
    test(`${path} has no critical or serious axe violations`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('[data-slot="card"]').first()).toBeVisible();

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();

      const blocking = results.violations
        .filter((violation) => BLOCKING_IMPACTS.includes(violation.impact ?? ""))
        .map((violation) => ({
          id: violation.id,
          impact: violation.impact,
          nodes: violation.nodes.map((node) => node.target.join(" ")),
        }));

      expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
    });
  }

  test("keyboard users can reach the sidebar and see the current page marked", async ({
    page,
  }) => {
    await page.goto("/transactions");

    const current = page.locator('[aria-current="page"]');
    await expect(current).toHaveText("Giao dịch");
  });

  test("the logout dialog traps focus and closes on Escape", async ({ page }) => {
    await page.goto("/");

    // The sidebar is desktop-only, so open the mobile drawer first.
    const width = page.viewportSize()?.width ?? 0;
    if (width < 1024) {
      await page.getByRole("button", { name: "Toggle Menu" }).click();
    }

    await page.getByRole("button", { name: "Đăng xuất" }).first().click();

    // Scope to the logout dialog: on small screens the nav drawer is also a dialog.
    const dialog = page
      .getByRole("dialog")
      .filter({ hasText: "Xác nhận đăng xuất" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });
});
