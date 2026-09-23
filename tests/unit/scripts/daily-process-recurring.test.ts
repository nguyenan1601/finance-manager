import { beforeAll, describe, expect, it } from "vitest";

/**
 * scripts/daily-process-recurring.mjs validates its env and would call
 * process.exit(1) at import time, so the variables must exist first. The
 * direct-run guard keeps main() from firing during the import.
 */
let advanceDate: (currentDate: string, frequency: string) => string;

beforeAll(async () => {
  process.env.NEXT_PUBLIC_SUPABASE_URL ||= "https://placeholder.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY ||= "placeholder-service-role";
  ({ advanceDate } = await import(
    "../../../scripts/daily-process-recurring.mjs"
  ));
});

describe("advanceDate", () => {
  it("advances one day for daily", () => {
    expect(advanceDate("2026-03-15", "daily")).toBe("2026-03-16");
  });

  it("advances seven days for weekly", () => {
    expect(advanceDate("2026-03-15", "weekly")).toBe("2026-03-22");
  });

  it("advances one month for monthly", () => {
    expect(advanceDate("2026-03-15", "monthly")).toBe("2026-04-15");
  });

  it("advances one year for yearly", () => {
    expect(advanceDate("2026-03-15", "yearly")).toBe("2027-03-15");
  });

  it("falls back to monthly for an unknown frequency", () => {
    expect(advanceDate("2026-03-15", "fortnightly")).toBe("2026-04-15");
  });

  it("returns a YYYY-MM-DD string", () => {
    expect(advanceDate("2026-03-15", "daily")).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("clamps month-end instead of overflowing into the next month", () => {
    expect(advanceDate("2026-01-31", "monthly")).toBe("2026-02-28");
    expect(advanceDate("2028-01-31", "monthly")).toBe("2028-02-29"); // leap year
    expect(advanceDate("2026-03-31", "monthly")).toBe("2026-04-30");
  });

  it("clamps 29 Feb when moving a year forward", () => {
    expect(advanceDate("2028-02-29", "yearly")).toBe("2029-02-28");
  });
});
