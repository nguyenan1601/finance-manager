/**
 * Seeds disposable fixture accounts in the Supabase project so E2E and manual
 * checks have data to render.
 *
 *   node scripts/seed-test.mjs           # create/reset fixtures
 *   node scripts/seed-test.mjs --reset   # delete fixtures only
 *
 * Safety: routes through scripts/safety-guard.ts (ALLOW_WRITES_TO_LIVE=1) and
 * only ever touches accounts ending in TEST_EMAIL_SUFFIX.
 */
import { readFileSync } from "node:fs";

import { createClient } from "@supabase/supabase-js";

const LIVE_PROJECT_REF = "aaxvylonfejefadiotjv";
const SUFFIX = "-test@levi-fixture.local";
const PASSWORD = "FixturePass123!";

// Minimal .env.test reader (keeps this script dependency-free).
function loadEnvTest() {
  try {
    for (const line of readFileSync(".env.test", "utf8").split(/\r?\n/)) {
      const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
      if (match && !line.trim().startsWith("#") && !process.env[match[1]]) {
        process.env[match[1]] = match[2];
      }
    }
  } catch {
    // .env.test is optional for --reset documentation purposes
  }
}

loadEnvTest();

const url = process.env.TARGET_SUPABASE_URL;
const serviceKey = process.env.TARGET_SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey || process.env.ALLOW_WRITES_TO_LIVE !== "1") {
  console.error(
    `Refusing to run: need TARGET_SUPABASE_URL, TARGET_SUPABASE_SERVICE_ROLE_KEY ` +
      `and ALLOW_WRITES_TO_LIVE=1 in .env.test.`,
  );
  process.exit(1);
}

console.warn(
  `⚠  Writing fixtures to LIVE project (${LIVE_PROJECT_REF}). Only *${SUFFIX} accounts are touched.`,
);

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const FIXTURES = [
  { email: `demo-a${SUFFIX}`, name: "Demo Alice" },
  { email: `demo-b${SUFFIX}`, name: "Demo Bob" },
];

async function findUserByEmail(email) {
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error) throw error;
    const found = data.users.find((user) => user.email === email);
    if (found) return found;
    if (data.users.length < 200) return null;
  }
  return null;
}

async function ensureUser({ email }) {
  const existing = await findUserByEmail(email);
  if (existing) return existing.id;

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
  });
  if (error) throw error;
  if (!data.user) throw new Error(`No user returned for ${email}`);
  console.log(`  + created ${email}`);
  return data.user.id;
}

async function deleteUserByEmail(email) {
  const existing = await findUserByEmail(email);
  if (!existing) return;
  const { error } = await admin.auth.admin.deleteUser(existing.id);
  if (error) throw error;
  console.log(`  - deleted ${email}`);
}

function isoDate(monthsAgo, day) {
  const now = new Date();
  const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - monthsAgo, day));
  return date.toISOString().slice(0, 10);
}

async function clearData(userId) {
  for (const table of [
    "transactions",
    "budgets",
    "recurring_transactions",
    "categories",
  ]) {
    const { error } = await admin.from(table).delete().eq("user_id", userId);
    if (error) throw error;
  }
}

async function seedUser(userId, name) {
  await clearData(userId);

  const { error: profileError } = await admin
    .from("profiles")
    .upsert({ id: userId, full_name: name, language: "vi", currency: "vnd" });
  if (profileError) throw profileError;

  const categories = [
    { name: "Ăn uống", type: "expense", icon: "Utensils", color: "#f97316" },
    { name: "Di chuyển", type: "expense", icon: "Car", color: "#3b82f6" },
    { name: "Mua sắm", type: "expense", icon: "ShoppingBag", color: "#f43f5e" },
    { name: "Lương", type: "income", icon: "Banknote", color: "#10b981" },
  ].map((category) => ({ ...category, user_id: userId }));

  const { data: insertedCategories, error: categoryError } = await admin
    .from("categories")
    .insert(categories)
    .select("id, name");
  if (categoryError) throw categoryError;

  const byName = Object.fromEntries(
    insertedCategories.map((category) => [category.name, category.id]),
  );

  const transactions = [];
  for (let monthsAgo = 0; monthsAgo < 6; monthsAgo++) {
    transactions.push(
      {
        user_id: userId,
        category_id: byName["Lương"],
        amount: 20_000_000,
        type: "income",
        note: "Lương tháng",
        date: isoDate(monthsAgo, 5),
      },
      {
        user_id: userId,
        category_id: byName["Ăn uống"],
        amount: 1_200_000 + monthsAgo * 50_000,
        type: "expense",
        note: "Ăn uống trong tháng",
        date: isoDate(monthsAgo, 8),
      },
      {
        user_id: userId,
        category_id: byName["Di chuyển"],
        amount: 400_000,
        type: "expense",
        note: "Xăng xe",
        date: isoDate(monthsAgo, 12),
      },
      {
        user_id: userId,
        category_id: byName["Mua sắm"],
        amount: 700_000,
        type: "expense",
        note: "Mua sắm, phụ kiện",
        date: isoDate(monthsAgo, 18),
      },
    );
  }

  const { error: transactionError } = await admin
    .from("transactions")
    .insert(transactions);
  if (transactionError) throw transactionError;

  const { error: budgetError } = await admin.from("budgets").insert([
    { user_id: userId, category_id: byName["Ăn uống"], amount: 3_000_000, period: "monthly" },
    { user_id: userId, category_id: byName["Mua sắm"], amount: 1_000_000, period: "monthly" },
  ]);
  if (budgetError) throw budgetError;

  const { error: recurringError } = await admin
    .from("recurring_transactions")
    .insert([
      {
        user_id: userId,
        category_id: byName["Di chuyển"],
        amount: 500_000,
        type: "expense",
        note: "Tiền gửi xe",
        frequency: "monthly",
        next_date: isoDate(-1, 1),
        is_active: true,
      },
      {
        user_id: userId,
        category_id: byName["Lương"],
        amount: 20_000_000,
        type: "income",
        note: "Lương định kỳ",
        frequency: "monthly",
        next_date: isoDate(-1, 5),
        is_active: false,
      },
    ]);
  if (recurringError) throw recurringError;

  console.log(
    `  = seeded ${name}: ${insertedCategories.length} categories, ${transactions.length} transactions`,
  );
}

async function main() {
  const reset = process.argv.includes("--reset");

  if (reset) {
    console.log("Removing fixtures...");
    for (const { email } of FIXTURES) await deleteUserByEmail(email);
    console.log("Done.");
    return;
  }

  console.log("Seeding fixtures...");
  for (const fixture of FIXTURES) {
    const userId = await ensureUser(fixture);
    await seedUser(userId, fixture.name);
  }
  console.log(`\nSign in with ${FIXTURES[0].email} / ${PASSWORD}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
