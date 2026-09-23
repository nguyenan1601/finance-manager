/**
 * Daily Cron Job - Process Recurring Transactions
 * 
 * This script finds active recurring_transactions where next_date <= today,
 * creates new transactions, and advances the next_date based on frequency.
 * 
 * Meant to be called via GitHub Actions scheduled workflow.
 */

import { pathToFileURL } from "node:url";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing required environment variables:");
  console.error("  NEXT_PUBLIC_SUPABASE_URL:", SUPABASE_URL ? "✓" : "✗");
  console.error("  SUPABASE_SERVICE_ROLE_KEY:", SUPABASE_SERVICE_ROLE_KEY ? "✓" : "✗");
  process.exit(1);
}

const TODAY = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

const headers = {
  "Content-Type": "application/json",
  apikey: SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
};

/** Adds whole months in UTC, clamping to the last day of the target month. */
function addUtcMonths(date, months) {
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);
  const lastDay = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
  ).getUTCDate();
  date.setUTCDate(Math.min(day, lastDay));
}

/**
 * Advance next_date based on frequency.
 *
 * Month/year steps clamp to the last valid day (31 Jan + 1 month -> 28/29 Feb)
 * instead of overflowing into the next month, and all maths runs in UTC so the
 * result does not depend on the machine timezone.
 */
export function advanceDate(currentDate, frequency) {
  const [year, month, day] = String(currentDate).split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));

  switch (frequency) {
    case "daily":
      d.setUTCDate(d.getUTCDate() + 1);
      break;
    case "weekly":
      d.setUTCDate(d.getUTCDate() + 7);
      break;
    case "monthly":
      addUtcMonths(d, 1);
      break;
    case "yearly":
      addUtcMonths(d, 12);
      break;
    default:
      addUtcMonths(d, 1); // fallback to monthly
  }

  return d.toISOString().slice(0, 10);
}

async function fetchDueRecurring() {
  const url = `${SUPABASE_URL}/rest/v1/recurring_transactions?select=*&is_active=eq.true&next_date=lte.${TODAY}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`Failed to fetch recurring transactions: ${res.status} ${res.statusText}\n${await res.text()}`);
  }
  return res.json();
}

async function createTransaction({ user_id, category_id, amount, type, note }) {
  const url = `${SUPABASE_URL}/rest/v1/transactions`;
  const body = {
    user_id,
    category_id,
    amount,
    type,
    note: note || null,
    date: TODAY,
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { ...headers, Prefer: "return=minimal" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`  ⚠ Failed to insert transaction: ${res.status} ${err}`);
    return false;
  }
  return true;
}

async function updateRecurring(id, updates) {
  const url = `${SUPABASE_URL}/rest/v1/recurring_transactions?id=eq.${id}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { ...headers, Prefer: "return=minimal" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`  ⚠ Failed to update recurring ${id}: ${res.status} ${err}`);
    return false;
  }
  return true;
}

async function main() {
  console.log(`[${new Date().toISOString()}] Starting daily recurring transaction processing...`);
  console.log(`  Today: ${TODAY}`);

  let recurringList;
  try {
    recurringList = await fetchDueRecurring();
  } catch (err) {
    console.error("Failed to fetch:", err.message);
    process.exit(1);
  }

  console.log(`  Found ${recurringList.length} due recurring transaction(s).`);

  let successCount = 0;
  let failCount = 0;

  for (const rt of recurringList) {
    const { id, user_id, category_id, amount, type, note, frequency, next_date } = rt;
    console.log(`\n  Processing: ${id.slice(0, 8)}... | ${type} | ${amount} | ${frequency} | next=${next_date}`);

    // 1. Insert new transaction
    const txOk = await createTransaction({ user_id, category_id, amount, type, note });

    if (txOk) {
      // 2. Update recurring: last_processed = today, next_date = advanced
      const newNextDate = advanceDate(TODAY, frequency);
      const updateOk = await updateRecurring(id, {
        last_processed: TODAY,
        next_date: newNextDate,
      });
      if (updateOk) {
        console.log(`  ✓ Created transaction + advanced next_date → ${newNextDate}`);
        successCount++;
      } else {
        failCount++;
      }
    } else {
      failCount++;
    }
  }

  console.log(`\n[DONE] Processed ${recurringList.length} recurring(s): ${successCount} success, ${failCount} fail.`);
  if (failCount > 0) process.exit(1);
}

const isDirectRun =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  main();
}