import { vi } from "vitest";

export interface MockResult {
  data?: unknown;
  error?: unknown;
}

export interface RecordedCall {
  method: string;
  args: unknown[];
}

export interface SupabaseMock {
  client: unknown;
  calls: RecordedCall[];
  /** Enqueue the result of the next awaited query (FIFO, falls back to null/null). */
  enqueue(result: MockResult): void;
  /** Every recorded call for a given method name. */
  callsOf(method: string): RecordedCall[];
  /** Table names passed to .from(), in order. */
  tables(): string[];
  /** Clear recorded calls and queued results between tests. */
  reset(): void;
}

const CHAIN_METHODS = [
  "select",
  "insert",
  "update",
  "upsert",
  "delete",
  "eq",
  "order",
  "limit",
  "lte",
  "gte",
  "match",
  "single",
  "maybeSingle",
  "in",
  "is",
  "not",
  "or",
  "filter",
  "range",
];

/**
 * Minimal chainable stand-in for the supabase-js query builder. Every builder
 * method records itself and returns the same object, and awaiting the builder
 * resolves the next queued result — enough to assert what db.ts asks the
 * database for without touching a real project.
 */
export function createSupabaseMock(): SupabaseMock {
  const calls: RecordedCall[] = [];
  const queue: MockResult[] = [];
  const tableNames: string[] = [];

  const builder: Record<string, unknown> = {};

  const record = (method: string, args: unknown[]) => {
    calls.push({ method, args });
    return builder;
  };

  for (const method of CHAIN_METHODS) {
    builder[method] = (...args: unknown[]) => record(method, args);
  }

  builder.then = (
    resolve: (value: MockResult) => unknown,
    reject?: (reason: unknown) => unknown,
  ) => {
    const result = queue.shift() ?? { data: null, error: null };
    return Promise.resolve(result).then(resolve, reject);
  };

  const from = vi.fn((table: string) => {
    tableNames.push(table);
    calls.push({ method: "from", args: [table] });
    return builder;
  });

  const storageApi = {
    from: vi.fn((bucket: string) => {
      calls.push({ method: "storage.from", args: [bucket] });
      return {
        upload: vi.fn((path: string, file: unknown) => {
          calls.push({ method: "storage.upload", args: [path, file] });
          return Promise.resolve(queue.shift() ?? { data: null, error: null });
        }),
        getPublicUrl: vi.fn((path: string) => {
          calls.push({ method: "storage.getPublicUrl", args: [path] });
          return { data: { publicUrl: `https://cdn.test/${path}` } };
        }),
      };
    }),
  };

  const authApi = {
    getUser: vi.fn(() => {
      calls.push({ method: "auth.getUser", args: [] });
      return Promise.resolve({
        data: { user: { id: "user-1" } },
        error: null,
      });
    }),
  };

  const client = {
    from,
    storage: storageApi,
    auth: authApi,
  };

  return {
    client,
    calls,
    enqueue: (result: MockResult) => {
      queue.push(result);
    },
    callsOf: (method: string) => calls.filter((call) => call.method === method),
    tables: () => tableNames,
    reset: () => {
      calls.length = 0;
      queue.length = 0;
      tableNames.length = 0;
    },
  };
}
