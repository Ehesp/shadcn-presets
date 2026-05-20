import { describe, expect, test } from "bun:test";
import { PRESET_FONTS } from "shadcn/preset";

import { getPresetFontFamily, PRESET_FONT_FAMILY } from "./font-families.ts";

describe("PRESET_FONT_FAMILY", () => {
  test("defines a stack for every PRESET_FONTS id", () => {
    for (const font of PRESET_FONTS) {
      expect(PRESET_FONT_FAMILY[font]).toBeString();
      expect(getPresetFontFamily(font)).toBe(PRESET_FONT_FAMILY[font]);
    }
  });

  test("includes newer serif fonts", () => {
    expect(PRESET_FONT_FAMILY["eb-garamond"]).toBe("'EB Garamond Variable', serif");
    expect(PRESET_FONT_FAMILY["instrument-serif"]).toBe("'Instrument Serif', serif");
  });
});
