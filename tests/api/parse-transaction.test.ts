import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const generateObject = vi.fn();

vi.mock("ai", () => ({
  generateObject: (...args: unknown[]) => generateObject(...args),
}));

import { POST } from "@/app/api/ai/parse-transaction/route";

const originalFetch = globalThis.fetch;

function post(body: unknown) {
  return POST(
    new Request("http://test/api/ai/parse-transaction", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  );
}

beforeEach(() => {
  generateObject.mockReset();
  process.env.DEEPSEEK_API_KEYS = "key-1";
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("POST /api/ai/parse-transaction", () => {
  it("returns the parsed transaction plus the exchange rate", async () => {
    globalThis.fetch = vi.fn(async () =>
      new Response(
        JSON.stringify({ result: "success", rates: { USD: 0.00004 } }),
      ),
    ) as unknown as typeof fetch;
    generateObject.mockResolvedValue({
      object: {
        amount: 25_000_000,
        type: "expense",
        category: "Mua sắm",
        note: "Mua máy tính",
        date: "2026-03-10",
      },
    });

    const response = await post({ text: "mua máy tính $1000" });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      amount: 25_000_000,
      type: "expense",
      exchangeRate: 0.00004,
    });
  });

  it("passes the live rate and the current date into the prompt", async () => {
    globalThis.fetch = vi.fn(async () =>
      new Response(
        JSON.stringify({ result: "success", rates: { USD: 0.00004 } }),
      ),
    ) as unknown as typeof fetch;
    generateObject.mockResolvedValue({ object: {} });

    await post({ text: "ăn trưa 50k", currentDate: "2026-03-12" });

    const call = generateObject.mock.calls[0][0] as { prompt: string };
    expect(call.prompt).toContain("2026-03-12");
    expect(call.prompt).toContain("25000");
  });

  it("falls back to the hardcoded rate when the rate API fails", async () => {
    globalThis.fetch = vi.fn(async () => {
      throw new Error("rate API down");
    }) as unknown as typeof fetch;
    generateObject.mockResolvedValue({ object: {} });

    const response = await post({ text: "x" });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.exchangeRate).toBe(0.000039);
  });

  it("returns 500 with details when the model call throws", async () => {
    globalThis.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ result: "success", rates: { USD: 0.00004 } })),
    ) as unknown as typeof fetch;
    generateObject.mockRejectedValue(new Error("model exploded"));

    const response = await post({ text: "x" });
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe("Không thể xử lý dữ liệu AI");
    expect(body.details).toContain("model exploded");
  });

  it("returns 500 when no API key is configured", async () => {
    delete process.env.DEEPSEEK_API_KEYS;
    globalThis.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ result: "success", rates: { USD: 0.00004 } })),
    ) as unknown as typeof fetch;

    const response = await post({ text: "x" });

    expect(response.status).toBe(500);
    expect((await response.json()).details).toMatch(/No DeepSeek API key/);
  });
});
