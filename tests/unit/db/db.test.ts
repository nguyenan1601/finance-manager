import { beforeEach, describe, expect, it, vi } from "vitest";

import type { SupabaseMock } from "../../support/supabase-mock";

// The mock instance is stashed on globalThis because vi.mock factories are
// hoisted above module-scoped variables.
vi.mock("@/lib/supabase", async () => {
  const { createSupabaseMock } = await import("../../support/supabase-mock");
  const instance = createSupabaseMock();
  (globalThis as Record<string, unknown>).__supabaseMock = instance;
  return { supabase: instance.client };
});

import { db } from "@/lib/db";

const mock = () =>
  (globalThis as unknown as { __supabaseMock: SupabaseMock }).__supabaseMock;

beforeEach(() => {
  mock().reset();
});

describe("db.getTransactions", () => {
  it("joins categories and orders by date then created_at, both descending", async () => {
    mock().enqueue({ data: [{ id: "t1", amount: 100 }], error: null });

    const rows = await db.getTransactions();

    expect(rows).toEqual([{ id: "t1", amount: 100 }]);
    expect(mock().tables()).toEqual(["transactions"]);

    const select = mock().callsOf("select")[0];
    expect(String(select.args[0])).toContain("categories");

    const orders = mock().callsOf("order");
    expect(orders).toHaveLength(2);
    expect(orders[0].args).toEqual(["date", { ascending: false }]);
    expect(orders[1].args).toEqual(["created_at", { ascending: false }]);
  });

  it("throws when the query fails", async () => {
    mock().enqueue({ data: null, error: { message: "boom" } });
    await expect(db.getTransactions()).rejects.toEqual({ message: "boom" });
  });
});

describe("db.addTransaction", () => {
  it("ensures the profile exists before inserting", async () => {
    mock().enqueue({ data: null, error: null }); // ensureProfile upsert
    mock().enqueue({ data: [{ id: "new" }], error: null }); // insert

    const created = await db.addTransaction({
      user_id: "user-1",
      amount: 500,
      type: "expense",
      category_id: "cat-1",
      note: "test",
      date: "2026-03-10",
    });

    expect(created).toEqual({ id: "new" });

    const upserts = mock().callsOf("upsert");
    expect(upserts[0].args[0]).toEqual({
      id: "user-1",
      full_name: "Người dùng",
    });
    expect(upserts[0].args[1]).toEqual({
      onConflict: "id",
      ignoreDuplicates: true,
    });

    const payload = (
      mock().callsOf("insert")[0].args[0] as Record<string, unknown>[]
    )[0];
    expect(payload).toMatchObject({ user_id: "user-1", amount: 500 });
  });

  it("propagates insert failures", async () => {
    mock().enqueue({ data: null, error: null });
    mock().enqueue({ data: null, error: { message: "rls" } });

    await expect(
      db.addTransaction({
        user_id: "user-1",
        amount: 1,
        type: "expense",
        category_id: "c",
        note: "",
        date: "2026-03-10",
      }),
    ).rejects.toEqual({ message: "rls" });
  });
});

describe("db.updateTransaction / deleteTransaction", () => {
  it("updates by id and reselects the joined row", async () => {
    mock().enqueue({ data: [{ id: "t1", note: "updated" }], error: null });

    const updated = await db.updateTransaction("t1", { note: "updated" });

    expect(updated).toEqual({ id: "t1", note: "updated" });
    expect(mock().callsOf("update")[0].args[0]).toEqual({ note: "updated" });
    expect(mock().callsOf("eq")[0].args).toEqual(["id", "t1"]);
  });

  it("deletes by id", async () => {
    mock().enqueue({ data: null, error: null });

    await db.deleteTransaction("t1");

    expect(mock().tables()).toEqual(["transactions"]);
    expect(mock().callsOf("delete")).toHaveLength(1);
    expect(mock().callsOf("eq")[0].args).toEqual(["id", "t1"]);
  });
});

describe("db budgets", () => {
  it("lists budgets with the joined category", async () => {
    mock().enqueue({ data: [{ id: "b1" }], error: null });
    const rows = await db.getBudgets();
    expect(rows).toEqual([{ id: "b1" }]);
    expect(String(mock().callsOf("select")[0].args[0])).toContain("categories");
  });

  it("adds a budget and returns the joined row", async () => {
    mock().enqueue({ data: [{ id: "b2" }], error: null });
    const created = await db.addBudget({
      user_id: "user-1",
      category_id: "cat-1",
      amount: 1000,
      period: "monthly",
    });
    expect(created).toEqual({ id: "b2" });
  });

  it("deletes a budget by id", async () => {
    mock().enqueue({ data: null, error: null });
    await db.deleteBudget("b1");
    expect(mock().tables()).toEqual(["budgets"]);
    expect(mock().callsOf("eq")[0].args).toEqual(["id", "b1"]);
  });
});

describe("db recurring transactions", () => {
  it("lists them newest first", async () => {
    mock().enqueue({ data: [], error: null });
    await db.getRecurringTransactions();
    expect(mock().tables()).toEqual(["recurring_transactions"]);
    expect(mock().callsOf("order")[0].args).toEqual([
      "created_at",
      { ascending: false },
    ]);
  });

  it("toggles nothing else when updating", async () => {
    mock().enqueue({ data: [{ id: "r1", is_active: false }], error: null });
    await db.updateRecurringTransaction("r1", { is_active: false });
    expect(mock().callsOf("update")[0].args[0]).toEqual({ is_active: false });
  });
});

describe("db.processRecurringTransactions", () => {
  it("creates a transaction for each due item and advances its next date", async () => {
    mock().enqueue({
      data: [
        {
          id: "r1",
          user_id: "user-1",
          category_id: "cat-1",
          amount: 500000,
          type: "expense",
          note: "Tiền nhà",
          frequency: "monthly",
          next_date: "2026-03-01",
        },
      ],
      error: null,
    });
    mock().enqueue({ data: null, error: null }); // ensureProfile
    mock().enqueue({ data: [{ id: "tx" }], error: null }); // addTransaction insert
    mock().enqueue({ data: null, error: null }); // recurring update

    await db.processRecurringTransactions();

    const payload = (
      mock().callsOf("insert")[0].args[0] as Record<string, unknown>[]
    )[0];
    expect(payload).toMatchObject({
      note: "[Cố định] Tiền nhà",
      date: "2026-03-01",
      amount: 500000,
    });

    const recurringUpdate = mock().callsOf("update").at(-1);
    expect(recurringUpdate?.args[0]).toMatchObject({
      next_date: "2026-04-01",
    });
    expect(recurringUpdate?.args[0]).toHaveProperty("last_processed");
  });

  it("does nothing when no item is due", async () => {
    mock().enqueue({ data: [], error: null });

    await db.processRecurringTransactions();

    expect(mock().callsOf("insert")).toHaveLength(0);
    expect(mock().callsOf("update")).toHaveLength(0);
  });
});

describe("db.getCategories / seedDefaultCategories", () => {
  it("seeds the 16 default categories via upsert on the natural key", async () => {
    mock().enqueue({ data: null, error: null }); // upsert
    mock().enqueue({ data: [], error: null }); // select

    await db.getCategories();

    const upsert = mock().callsOf("upsert")[0];
    expect(upsert.args[0]).toHaveLength(16);
    expect(upsert.args[1]).toEqual({ onConflict: "user_id,name,type" });
  });

  it("filters by type when asked", async () => {
    mock().enqueue({ data: null, error: null });
    mock().enqueue({ data: [], error: null });

    await db.getCategories("income");

    expect(mock().callsOf("eq").at(-1)?.args).toEqual(["type", "income"]);
  });
});

describe("db.getCategoryIdByName", () => {
  it("reuses an existing category without inserting", async () => {
    mock().enqueue({ data: null, error: null }); // ensureProfile
    mock().enqueue({ data: { id: "cat-1" }, error: null }); // maybeSingle

    const id = await db.getCategoryIdByName("Ăn uống", "expense", "user-1");

    expect(id).toBe("cat-1");
    expect(mock().callsOf("insert")).toHaveLength(0);
  });

  it("creates the category when it is missing", async () => {
    mock().enqueue({ data: null, error: null });
    mock().enqueue({ data: null, error: null }); // maybeSingle -> none
    mock().enqueue({ data: { id: "cat-new" }, error: null }); // insert

    const id = await db.getCategoryIdByName("Mới", "expense", "user-1");

    expect(id).toBe("cat-new");
    expect(mock().callsOf("insert")[0].args[0]).toEqual([
      { user_id: "user-1", name: "Mới", type: "expense" },
    ]);
  });
});

describe("db.resetTransactions", () => {
  it("only deletes rows for the signed-in user", async () => {
    mock().enqueue({ data: null, error: null });

    await db.resetTransactions();

    expect(mock().callsOf("delete")).toHaveLength(1);
    expect(mock().callsOf("eq")[0].args).toEqual(["user_id", "user-1"]);
  });
});

describe("db.updateProfile", () => {
  it("upserts so a missing profile row does not fail the save", async () => {
    mock().enqueue({ data: null, error: null });

    await db.updateProfile("user-1", { full_name: "An", currency: "vnd" });

    expect(mock().callsOf("upsert")[0].args[0]).toEqual({
      id: "user-1",
      full_name: "An",
      currency: "vnd",
    });
  });
});

describe("db.uploadAvatar", () => {
  it("uploads, reads the public url and stores it on the profile", async () => {
    mock().enqueue({ data: { path: "p" }, error: null }); // storage upload
    mock().enqueue({ data: null, error: null }); // profile update

    const file = { name: "a.png" } as File;
    const url = await db.uploadAvatar("user-1", file);

    expect(url).toContain("https://cdn.test/");
    expect(mock().callsOf("storage.from")[0].args).toEqual(["avatars"]);
    expect(mock().callsOf("update")[0].args[0]).toMatchObject({
      avatar_url: url,
    });
  });
});
