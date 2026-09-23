import { beforeEach, describe, expect, it, vi } from "vitest";

const generateObject = vi.fn();

vi.mock("ai", () => ({
  generateObject: (...args: unknown[]) => generateObject(...args),
}));

import { POST } from "@/app/api/ai/scan-bill/route";

function post(body: unknown) {
  return POST(
    new Request("http://test/api/ai/scan-bill", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  );
}

beforeEach(() => {
  generateObject.mockReset();
  process.env.GEMINI_API_KEYS = "key-1";
});

describe("POST /api/ai/scan-bill", () => {
  it("rejects a request without an image", async () => {
    const response = await post({});

    expect(response.status).toBe(400);
    expect((await response.json()).error).toBe("Thiếu dữ liệu hình ảnh");
    expect(generateObject).not.toHaveBeenCalled();
  });

  it("returns the extracted transaction for a valid image", async () => {
    generateObject.mockResolvedValue({
      object: {
        amount: 185_000,
        type: "expense",
        category: "Hóa đơn & Tiện ích",
        note: "Điện tháng 3",
        date: "2026-03-09",
      },
    });

    const response = await post({
      image: "data:image/png;base64,AAAA",
      currentDate: "2026-03-12",
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({ amount: 185_000, type: "expense" });
  });

  it("uses the current date as the fallback inside the prompt", async () => {
    generateObject.mockResolvedValue({ object: {} });

    await post({ image: "data:image/png;base64,AAAA", currentDate: "2026-03-12" });

    const call = generateObject.mock.calls[0][0] as {
      messages: { content: { text: string }[] }[];
    };
    expect(call.messages[0].content[0].text).toContain("2026-03-12");
  });

  it("returns 500 when extraction fails", async () => {
    generateObject.mockRejectedValue(new Error("vision down"));

    const response = await post({ image: "data:image/png;base64,AAAA" });
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe("Không thể quét hóa đơn");
    expect(body.details).toContain("vision down");
  });
});
