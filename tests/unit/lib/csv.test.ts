import { describe, expect, it } from "vitest";

import { CSV_BOM, toCsv } from "@/lib/csv";

describe("toCsv", () => {
  it("writes headers first, then one line per row", () => {
    expect(toCsv(["a", "b"], [[1, 2], [3, 4]])).toBe("a,b\n1,2\n3,4");
  });

  it("handles an empty row set", () => {
    expect(toCsv(["a", "b"], [])).toBe("a,b");
  });

  it("exposes a UTF-8 BOM so Excel reads Vietnamese text", () => {
    expect(CSV_BOM).toBe("\uFEFF");
  });

  it("quotes values containing a comma, quote or newline", () => {
    expect(toCsv(["note"], [["tiền nhà, điện"]])).toBe('note\n"tiền nhà, điện"');
    expect(toCsv(["note"], [['he said "hi"']])).toBe(
      'note\n"he said ""hi"""',
    );
    expect(toCsv(["note"], [["line1\nline2"]])).toBe('note\n"line1\nline2"');
  });

  it("leaves plain values unquoted", () => {
    expect(toCsv(["a"], [["plain value"]])).toBe("a\nplain value");
  });
});
