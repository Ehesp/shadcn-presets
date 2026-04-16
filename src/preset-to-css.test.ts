import { describe, expect, test } from "bun:test";
import { DEFAULT_PRESET_CONFIG, decodePreset, type PresetConfig } from "shadcn/preset";
import { presetConfigToThemeBuildInput } from "./preset-to-css.ts";

describe("presetConfigToThemeBuildInput", () => {
  test("matches defaults from encode/decode round-trip", () => {
    const decoded = decodePreset("b0");
    expect(decoded).not.toBeNull();
    const input = presetConfigToThemeBuildInput(decoded!);
    expect(input.baseColor).toBe(decoded!.baseColor);
    expect(input.theme).toBe(decoded!.theme);
    expect(input.chartColor).toBeDefined();
    expect(input.radius).toBe(decoded!.radius);
  });

  test("forces radius to none for lyra style", () => {
    const input = presetConfigToThemeBuildInput({
      ...DEFAULT_PRESET_CONFIG,
      style: "lyra",
      radius: "large",
    });
    expect(input.radius).toBe("none");
  });

  test("falls back theme and chartColor to the first available theme for the base", () => {
    const input = presetConfigToThemeBuildInput({
      ...DEFAULT_PRESET_CONFIG,
      theme: "not-a-valid-theme" as PresetConfig["theme"],
      chartColor: "not-a-chart" as PresetConfig["chartColor"],
    });
    expect(input.theme).not.toBe("not-a-valid-theme");
    expect(input.chartColor).not.toBe("not-a-chart");
    expect(input.theme).toBeTruthy();
    expect(input.chartColor).toBeTruthy();
  });

  test("preserves explicit chartColor when valid", () => {
    const input = presetConfigToThemeBuildInput({
      ...DEFAULT_PRESET_CONFIG,
      chartColor: "emerald",
    });
    expect(input.chartColor).toBe("emerald");
  });

  test("passes fontFamilyOverrides to theme build input", () => {
    const input = presetConfigToThemeBuildInput(DEFAULT_PRESET_CONFIG, {
      inter: '"Inter", sans-serif',
    });
    expect(input.fontFamilyOverrides).toEqual({ inter: '"Inter", sans-serif' });
  });
});
