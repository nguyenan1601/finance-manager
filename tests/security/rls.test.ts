import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { requireWritableTarget, TEST_EMAIL_SUFFIX } from "../../scripts/safety-guard";

/**
 * Row Level Security is what separates one tenant's money data from another's.
 * These tests run against the LIVE project, creating two real, disposable
 * accounts (email ending in TEST_EMAIL_SUFFIX) and proving that neither can
 * read or write the other's rows. Everything is deleted afterwards.
 */
const target = requireWritableTarget();

const RUN_ID = Date.now().toString(36);
const PASSWORD = `Pw-${RUN_ID}-Aa1`;

const admin = createClient(target.url, target.serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

interface Fixture {
  id: string;
  email: string;
  client: SupabaseClient;
}

async function createAccount(label: string): Promise<Fixture> {
  const email = `rls-${label}-${RUN_ID}${TEST_EMAIL_SUFFIX}`;

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
  });
  if (error) throw error;
  if (!data.user) throw new Error(`No user returned for ${email}`);

  const client = createClient(target.url, target.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error: signInError } = await client.auth.signInWithPassword({
    email,
    password: PASSWORD,
  });
  if (signInError) throw signInError;

  return { id: data.user.id, email, client };
}

// A client that never signs in — represents an anonymous visitor.
const anon = createClient(target.url, target.anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const TABLES = [
  "profiles",
  "categories",
  "transactions",
  "budgets",
  "recurring_transactions",
] as const;

let alice: Fixture;
let bob: Fixture;
const aliceRows: Record<string, string> = {};
let cascadeVerified = false;

async function deleteAccount(fixture: Fixture | undefined) {
  if (!fixture) return;
  try {
    await admin.auth.admin.deleteUser(fixture.id);
  } catch {
    // best-effort cleanup
  }
}

beforeAll(async () => {
  alice = await createAccount("alice");
  bob = await createAccount("bob");

  // Alice populates one row per table using her own (RLS-constrained) client.
  const profile = await alice.client
    .from("profiles")
    .insert({ id: alice.id, full_name: "RLS Alice" })
    .select("id")
    .single();
  if (profile.error) throw profile.error;
  aliceRows.profiles = profile.data.id;

  const category = await alice.client
    .from("categories")
    .insert({ user_id: alice.id, name: "RLS Cat", type: "expense" })
    .select("id")
    .single();
  if (category.error) throw category.error;
  aliceRows.categories = category.data.id;

  const transaction = await alice.client
    .from("transactions")
    .insert({
      user_id: alice.id,
      amount: 1234,
      type: "expense",
      category_id: category.data.id,
      date: "2026-03-10",
      note: "rls fixture",
    })
    .select("id")
    .single();
  if (transaction.error) throw transaction.error;
  aliceRows.transactions = transaction.data.id;

  const budget = await alice.client
    .from("budgets")
    .insert({
      user_id: alice.id,
      category_id: category.data.id,
      amount: 5000,
      period: "monthly",
    })
    .select("id")
    .single();
  if (budget.error) throw budget.error;
  aliceRows.budgets = budget.data.id;

  const recurring = await alice.client
    .from("recurring_transactions")
    .insert({
      user_id: alice.id,
      category_id: category.data.id,
      amount: 100,
      type: "expense",
      note: "rls fixture",
      frequency: "monthly",
      next_date: "2026-04-01",
      is_active: true,
    })
    .select("id")
    .single();
  if (recurring.error) throw recurring.error;
  aliceRows.recurring_transactions = recurring.data.id;
});

afterAll(async () => {
  await deleteAccount(alice);
  await deleteAccount(bob);
});

describe("RLS: read isolation", () => {
  it.each(TABLES)("hides other tenants' rows in %s", async (table) => {
    const { data, error } = await bob.client
      .from(table)
      .select("id")
      .eq("id", aliceRows[table]);

    expect(error).toBeNull();
    expect(data).toEqual([]);
  });

  it("lets the owner read their own transaction", async () => {
    const { data, error } = await alice.client
      .from("transactions")
      .select("id, amount")
      .eq("id", aliceRows.transactions);

    expect(error).toBeNull();
    expect(data).toEqual([{ id: aliceRows.transactions, amount: 1234 }]);
  });

  it("hides everything from anonymous callers", async () => {
    for (const table of TABLES) {
      const { data, error } = await anon.from(table).select("id").limit(1);
      expect(error).toBeNull();
      expect(data).toEqual([]);
    }
  });
});

describe("RLS: write isolation", () => {
  it("does not let another tenant update a row", async () => {
    const { data, error } = await bob.client
      .from("transactions")
      .update({ note: "hacked" })
      .eq("id", aliceRows.transactions)
      .select("id");

    expect(error).toBeNull();
    expect(data).toEqual([]);

    const { data: after } = await alice.client
      .from("transactions")
      .select("note")
      .eq("id", aliceRows.transactions)
      .single();
    expect(after?.note).toBe("rls fixture");
  });

  it("does not let another tenant delete a row", async () => {
    const { data, error } = await bob.client
      .from("transactions")
      .delete()
      .eq("id", aliceRows.transactions)
      .select("id");

    expect(error).toBeNull();
    expect(data).toEqual([]);

    const { data: stillThere } = await alice.client
      .from("transactions")
      .select("id")
      .eq("id", aliceRows.transactions);
    expect(stillThere).toHaveLength(1);
  });

  it("rejects an insert that spoofs another tenant's user_id", async () => {
    const { error } = await bob.client.from("transactions").insert({
      user_id: alice.id,
      amount: 9999,
      type: "expense",
      date: "2026-03-11",
      note: "spoofed",
    });

    expect(error).not.toBeNull();
  });

  it("rejects anonymous writes", async () => {
    const { error } = await anon.from("transactions").insert({
      user_id: alice.id,
      amount: 9999,
      type: "expense",
      date: "2026-03-11",
    });

    expect(error).not.toBeNull();
  });
});

describe("RLS: account deletion cascades", () => {
  it("removes every row owned by a deleted account", async () => {
    const { error } = await admin.auth.admin.deleteUser(alice.id);
    expect(error).toBeNull();

    for (const table of TABLES) {
      // admin bypasses RLS, so this proves the rows are actually gone.
      const { data, error: selectError } = await admin
        .from(table)
        .select("id")
        .eq("id", aliceRows[table]);

      expect(selectError).toBeNull();
      expect(data).toEqual([]);
    }

    cascadeVerified = true;
  });
});

it("cleaned up the accounts it created", () => {
  expect(cascadeVerified).toBe(true);
});
