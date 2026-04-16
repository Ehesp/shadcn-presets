import { describe, expect, test } from "bun:test";
import { getPresetFontFamily, presetFontCssVars } from "./font-families.ts";

describe("getPresetFontFamily", () => {
  test("returns the stack for a known preset id", () => {
    expect(getPresetFontFamily("geist")).toBe("'Geist Variable', sans-serif");
  });

  test("returns undefined for unknown ids", () => {
    expect(getPresetFontFamily("no-such-font")).toBeUndefined();
  });

  test("applies overrides when resolving stacks", () => {
    expect(
      getPresetFontFamily("figtree", { figtree: '"Figtree", sans-serif' }),
    ).toBe('"Figtree", sans-serif');
  });
});

describe("presetFontCssVars", () => {
  test("uses the same stack for inherit or matching heading", () => {
    const inter = "'Inter Variable', sans-serif";
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

  test("omits font vars when ids do not resolve", () => {
    expect(presetFontCssVars("unknown-body", "inherit")).toEqual({});
    expect(presetFontCssVars("inter", "unknown-heading")).toEqual({
      "font-sans": "'Inter Variable', sans-serif",
    });
  });
});
