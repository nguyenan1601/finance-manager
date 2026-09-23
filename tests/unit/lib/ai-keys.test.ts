import { describe, expect, it } from "vitest";

import { parseApiKeys, pickApiKey } from "@/lib/ai-keys";

describe("parseApiKeys", () => {
  it("splits on commas and drops empty entries", () => {
    expect(parseApiKeys("a,b,c")).toEqual(["a", "b", "c"]);
    expect(parseApiKeys("a,,b,")).toEqual(["a", "b"]);
  });

  it("returns an empty list for missing or blank input", () => {
    expect(parseApiKeys(undefined)).toEqual([]);
    expect(parseApiKeys("")).toEqual([]);
  });
});

describe("pickApiKey", () => {
  it("picks deterministically when random is injected", () => {
    expect(pickApiKey("a,b,c", () => 0)).toBe("a");
    expect(pickApiKey("a,b,c", () => 0.5)).toBe("b");
    expect(pickApiKey("a,b,c", () => 0.99)).toBe("c");
  });

  it("throws a clear error instead of silently returning undefined", () => {
    expect(() => pickApiKey("")).toThrowError(/No Gemini API key configured/);
    expect(() => pickApiKey(undefined)).toThrowError(
      /No Gemini API key configured/,
    );
  });

  it("never indexes past the end when random returns 1", () => {
    expect(pickApiKey("a,b,c", () => 1)).toBe("c");
  });

  it("always returns the only key when one is configured", () => {
    expect(pickApiKey("solo", () => 0.42)).toBe("solo");
  });
});
