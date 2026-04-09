import { describe, expect, test } from "bun:test";
import {
  BASE_COLORS,
  buildRegistryTheme,
  getBaseColor,
  getTheme,
  getThemesForBaseColor,
  RADII,
  type ThemeBuildInput,
} from "./build-theme.ts";

const minimalInput = (overrides: Partial<ThemeBuildInput> = {}): ThemeBuildInput => ({
  baseColor: "zinc",
  theme: "blue",
  chartColor: "blue",
  menuAccent: "subtle",
  radius: "default",
  font: "inter",
  fontHeading: "inherit",
  ...overrides,
});

describe("getTheme / getBaseColor", () => {
  test("resolves known registry themes", () => {
    expect(getTheme("blue")?.title).toBe("Blue");
    expect(getBaseColor("zinc")?.title).toBe("Zinc");
  });

  test("returns undefined for unknown names", () => {
    expect(getTheme("not-a-theme")).toBeUndefined();
    expect(getBaseColor("amber")).toBeUndefined();
  });
});

describe("getThemesForBaseColor", () => {
  test("includes the base palette and accent themes, excluding other bases", () => {
    const names = getThemesForBaseColor("zinc").map((t) => t.name);
    expect(names).toContain("zinc");
    expect(names).toContain("blue");
    expect(names).not.toContain("neutral");
    expect(names).not.toContain("stone");
  });
});

describe("buildRegistryTheme", () => {
  test("merges base palette, semantic theme, chart tokens, and font vars", () => {
    const result = buildRegistryTheme(minimalInput());
    expect(result.name).toBe("zinc-blue");
    expect(result.type).toBe("registry:theme");
    expect(result.cssVars.light["font-sans"]).toContain("Inter");
    expect(result.cssVars.light["chart-1"]).toBeDefined();
    expect(result.cssVars.dark["chart-1"]).toBeDefined();
    expect(result.cssVars.light.background).toBeDefined();
  });

  test("throws when base color or theme id is unknown", () => {
    expect(() => buildRegistryTheme(minimalInput({ baseColor: "not-a-base" as "zinc" }))).toThrow(
      /Base color/,
    );
    expect(() => buildRegistryTheme(minimalInput({ theme: "not-a-theme" as "blue" }))).toThrow(
      /theme/,
    );
  });

  test("menuAccent bold maps accent to primary in light and dark", () => {
    const bold = buildRegistryTheme(minimalInput({ menuAccent: "bold" }));
    expect(bold.cssVars.light.accent).toBe(bold.cssVars.light.primary);
    expect(bold.cssVars.light["accent-foreground"]).toBe(bold.cssVars.light["primary-foreground"]);
    expect(bold.cssVars.dark.accent).toBe(bold.cssVars.dark.primary);
    expect(bold.cssVars.dark["accent-foreground"]).toBe(bold.cssVars.dark["primary-foreground"]);
  });

  test("applies radius from RADII when not default", () => {
    const built = buildRegistryTheme(minimalInput({ radius: "medium" }));
    const medium = RADII.find((r) => r.name === "medium");
    expect(built.cssVars.light.radius).toBe(medium?.value);
  });

  test("BASE_COLORS lists only preset base palettes", () => {
    expect(BASE_COLORS.length).toBeGreaterThan(0);
    expect(BASE_COLORS.every((t) => t.cssVars?.light)).toBe(true);
  });
});
