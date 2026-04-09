import { describe, expect, test } from "bun:test";
import { getPresetFontFamily, presetFontCssVars } from "./font-families.ts";

describe("getPresetFontFamily", () => {
  test("returns the stack for a known preset id", () => {
    expect(getPresetFontFamily("geist")).toBe("'Geist Variable', sans-serif");
  });

  test("falls back to Inter for unknown ids", () => {
    expect(getPresetFontFamily("no-such-font")).toBe("'Inter Variable', sans-serif");
  });
});

describe("presetFontCssVars", () => {
  test("uses the same stack for inherit or matching heading", () => {
    const inter = getPresetFontFamily("inter");
    expect(presetFontCssVars("inter", "inherit")).toEqual({
      "font-sans": inter,
      "font-heading": inter,
    });
    expect(presetFontCssVars("inter", "inter")).toEqual({
      "font-sans": inter,
      "font-heading": inter,
    });
  });

  test("uses a separate stack when heading differs", () => {
    const vars = presetFontCssVars("geist", "lora");
    expect(vars["font-sans"]).toBe("'Geist Variable', sans-serif");
    expect(vars["font-heading"]).toBe("'Lora Variable', serif");
  });
});
