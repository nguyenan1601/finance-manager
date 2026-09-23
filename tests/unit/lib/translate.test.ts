import { describe, expect, it } from "vitest";

import { collectLeafPaths, resolveTranslation } from "@/lib/i18n/translate";
import { en, vi } from "@/lib/i18n/dictionaries";

describe("resolveTranslation", () => {
  const dict = {
    common: { save: "Lưu thay đổi", count: "{count} giao dịch" },
  };

  it("resolves a nested key", () => {
    expect(resolveTranslation(dict, "common.save")).toBe("Lưu thay đổi");
  });

  it("interpolates placeholders", () => {
    expect(resolveTranslation(dict, "common.count", { count: 7 })).toBe(
      "7 giao dịch",
    );
  });

  it("falls back to the path when the key is missing", () => {
    expect(resolveTranslation(dict, "common.missing")).toBe("common.missing");
    expect(resolveTranslation(dict, "nope.at.all")).toBe("nope.at.all");
  });

  it("falls back to the path when the value is not a leaf string", () => {
    expect(resolveTranslation(dict, "common")).toBe("common");
  });
});

describe("dictionary parity", () => {
  it("has the same leaf keys in vi and en", () => {
    const viPaths = collectLeafPaths(vi as never).sort();
    const enPaths = collectLeafPaths(en as never).sort();

    const missingInEn = viPaths.filter((path) => !enPaths.includes(path));
    const missingInVi = enPaths.filter((path) => !viPaths.includes(path));

    expect({ missingInEn, missingInVi }).toEqual({
      missingInEn: [],
      missingInVi: [],
    });
  });
});
