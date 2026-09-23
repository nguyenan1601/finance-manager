import path from "node:path";

import { config as loadEnv } from "dotenv";

loadEnv({ path: path.resolve(process.cwd(), ".env.test") });

/** Live project ref. Tests run against it directly, so writes must stay scoped. */
export const LIVE_PROJECT_REF = "aaxvylonfejefadiotjv";

/** Only accounts with this suffix may be created, modified or deleted by tests. */
export const TEST_EMAIL_SUFFIX = "-test@levi-fixture.local";

export function isTestAccount(email?: string | null): boolean {
  return typeof email === "string" && email.endsWith(TEST_EMAIL_SUFFIX);
}

export function assertTestAccount(email?: string | null): void {
  if (!isTestAccount(email)) {
    throw new Error(
      `Refusing to touch "${email ?? "<no email>"}": not a test account ` +
        `(expected a *${TEST_EMAIL_SUFFIX} address).`,
    );
  }
}

export interface WritableTarget {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
}

/**
 * Call this before any test or script that writes to the database. It fails
 * loudly when the explicit opt-in is missing, and warns that writes land on the
 * live project.
 */
export function requireWritableTarget(): WritableTarget {
  const url = process.env.TARGET_SUPABASE_URL;
  const anonKey = process.env.TARGET_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.TARGET_SUPABASE_SERVICE_ROLE_KEY;

  const missing = [
    !url && "TARGET_SUPABASE_URL",
    !anonKey && "TARGET_SUPABASE_ANON_KEY",
    !serviceRoleKey && "TARGET_SUPABASE_SERVICE_ROLE_KEY",
    process.env.ALLOW_WRITES_TO_LIVE !== "1" && "ALLOW_WRITES_TO_LIVE=1",
  ].filter((entry): entry is string => Boolean(entry));

  if (missing.length > 0) {
    throw new Error(
      `Refusing to run database tests.\n` +
        `Missing: ${missing.join(", ")}\n` +
        `Copy .env.test.example to .env.test. These tests write to the LIVE ` +
        `Supabase project (${LIVE_PROJECT_REF}) and require an explicit opt-in.`,
    );
  }

  console.warn(
    `⚠  WRITE ENABLED on LIVE Supabase project (${LIVE_PROJECT_REF}). ` +
      `Every row must belong to a *${TEST_EMAIL_SUFFIX} account.`,
  );

  // The throw above guarantees these are all defined.
  return {
    url: url as string,
    anonKey: anonKey as string,
    serviceRoleKey: serviceRoleKey as string,
  };
}

/** Read-only helper for suites that only need to observe data. */
export function readOnlyTarget(): Pick<WritableTarget, "url" | "anonKey"> {
  const url = process.env.TARGET_SUPABASE_URL;
  const anonKey = process.env.TARGET_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Missing TARGET_SUPABASE_URL / TARGET_SUPABASE_ANON_KEY in .env.test.",
    );
  }
  return { url, anonKey };
}
