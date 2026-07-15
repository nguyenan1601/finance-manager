/**
 * Daily Cron Job - Process Recurring Transactions
 * 
 * This script finds active recurring_transactions where next_date <= today,
 * creates new transactions, and advances the next_date based on frequency.
 * 
 * Meant to be called via GitHub Actions scheduled workflow.
 */

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

/**
 * Advance next_date based on frequency.
 */
function advanceDate(currentDate, frequency) {
  const d = new Date(currentDate);
  switch (frequency) {
    case "daily":
      d.setDate(d.getDate() + 1);
      break;
    case "weekly":
      d.setDate(d.getDate() + 7);
      break;
    case "monthly":
      d.setMonth(d.getMonth() + 1);
      break;
    case "yearly":
      d.setFullYear(d.getFullYear() + 1);
      break;
    default:
      d.setMonth(d.getMonth() + 1); // fallback to monthly
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

main();