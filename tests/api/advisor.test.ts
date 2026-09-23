import { beforeEach, describe, expect, it, vi } from "vitest";

// vi.hoisted keeps the spies available to the (hoisted) mock factory.
const mocks = vi.hoisted(() => ({
  streamText: vi.fn(),
  convertToModelMessages: vi.fn(async (messages: unknown) => messages),
}));

vi.mock("ai", () => ({
  streamText: mocks.streamText,
  convertToModelMessages: mocks.convertToModelMessages,
}));

const streamText = mocks.streamText;
const convertToModelMessages = mocks.convertToModelMessages;

import { POST } from "@/app/api/ai/advisor/route";

function post(body: unknown) {
  return POST(
    new Request("http://test/api/ai/advisor", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  );
}

beforeEach(() => {
  streamText.mockReset();
  convertToModelMessages.mockClear();
  process.env.GEMINI_API_KEYS = "key-1";
});

describe("POST /api/ai/advisor", () => {
  it("streams the answer using the UI message stream", async () => {
    const streamed = new Response("streamed", { status: 200 });
    streamText.mockReturnValue({
      toUIMessageStreamResponse: () => streamed,
    });

    const response = await post({
      messages: [{ id: "1", role: "user", parts: [] }],
      financialContext: "TỔNG QUAN",
    });

    expect(response).toBe(streamed);
    expect(convertToModelMessages).toHaveBeenCalledTimes(1);
  });

  it("injects the caller's financial context into the system prompt", async () => {
    streamText.mockReturnValue({
      toUIMessageStreamResponse: () => new Response("ok"),
    });

    await post({
      messages: [],
      financialContext: "Số dư hiện tại: 123456đ",
    });

    const call = streamText.mock.calls[0][0] as { system: string };
    expect(call.system).toContain("Levi AI");
    expect(call.system).toContain("Số dư hiện tại: 123456đ");
  });

  it("falls back to a friendly message when no context is supplied", async () => {
    streamText.mockReturnValue({
      toUIMessageStreamResponse: () => new Response("ok"),
    });

    await post({ messages: [] });

    const call = streamText.mock.calls[0][0] as { system: string };
    expect(call.system).toContain("Người dùng chưa có giao dịch nào.");
  });

  it("returns 500 JSON when the model call throws", async () => {
    streamText.mockImplementation(() => {
      throw new Error("upstream 503");
    });

    const response = await post({ messages: [] });
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe("Trợ lý đang bận, vui lòng thử lại sau.");
    expect(body.details).toContain("upstream 503");
  });
});
