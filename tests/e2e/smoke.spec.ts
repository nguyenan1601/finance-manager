import { expect, test } from "@playwright/test";

const PAGES = [
  { path: "/", heading: "Tổng quan" },
  { path: "/transactions", heading: "Giao dịch" },
  { path: "/budgets", heading: "Ngân sách" },
  { path: "/reports", heading: "Báo cáo" },
  { path: "/settings", heading: "Cài đặt" },
  { path: "/ai-assistant", heading: "Trợ lý AI" },
];

test.describe("layout at every breakpoint", () => {
  for (const { path, heading } of PAGES) {
    test(`${path} renders, keeps its heading and never scrolls sideways`, async ({
      page,
    }) => {
      await page.goto(path);

      await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
      // The shell renders content before hydration completes; wait for a card.
      await expect(page.locator('[data-slot="card"]').first()).toBeVisible();

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      expect(
        overflow.scrollWidth,
        `horizontal overflow on ${path}: ${overflow.scrollWidth} > ${overflow.clientWidth}`,
      ).toBeLessThanOrEqual(overflow.clientWidth);
    });
  }

  test("the dashboard chart draws bars without console warnings", async ({
    page,
  }) => {
    const warnings: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "warning") warnings.push(message.text());
    });

    await page.goto("/");
    await expect(page.locator(".recharts-surface")).toBeVisible();

    const bars = await page.locator(".recharts-bar-rectangle").count();
    expect(bars).toBeGreaterThan(0);

    expect(
      warnings.filter((text) => text.includes("of chart should be greater than 0")),
      "Recharts sizing warning must not come back",
    ).toEqual([]);
  });

  test("switching to dark mode keeps the page readable", async ({ page }) => {
    await page.goto("/settings");
    await page.getByLabel("Giao diện").click();
    await page.getByRole("option", { name: "Tối" }).click();

    await expect(page.locator("html")).toHaveClass(/dark/);
    await page.goto("/");
    await expect(page.locator(".recharts-surface")).toBeVisible();
  });
});
