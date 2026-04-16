import { describe, expect, test } from "bun:test";
import { decodePreset, encodePreset } from "shadcn/preset";
import { presetToShadcnThemeCss } from "./preset-to-css.ts";

describe("presetToShadcnThemeCss", () => {
  test("returns null for invalid code", () => {
    expect(presetToShadcnThemeCss("")).toBeNull();
    expect(presetToShadcnThemeCss("c0")).toBeNull();
  });

  test("returns CSS containing :root and .dark for default code", () => {
    const code = encodePreset({});
    const out = presetToShadcnThemeCss(code);
    expect(out).not.toBeNull();
    expect(out!.css).toContain(":root");
    expect(out!.css).toContain(".dark");
    expect(out!.css).toContain("--background:");
  });

  test("round-trip preset produces stable output", () => {
    const decoded = decodePreset("b0");
    expect(decoded).not.toBeNull();
    const out = presetToShadcnThemeCss("b0");
    expect(out).not.toBeNull();
    expect(out!.css.length).toBeGreaterThan(100);
  });

  test("v1 preset without chartColor still produces CSS", () => {
    const out = presetToShadcnThemeCss("a0");
    expect(out).not.toBeNull();
    expect(out!.css).toContain("--chart-1:");
  });

  test("trims whitespace around the preset code", () => {
    const code = encodePreset({});
    const out = presetToShadcnThemeCss(`  ${code}  `);
    expect(out).not.toBeNull();
    expect(out!.css).toContain(":root");
  });

  test("applies optional font family overrides in generated CSS", () => {
    const code = encodePreset({});
    const without = presetToShadcnThemeCss(code);
    const withOverride = presetToShadcnThemeCss(code, { inter: '"Inter", sans-serif' });
    expect(without).not.toBeNull();
    expect(withOverride).not.toBeNull();
    expect(without!.css).toContain("'Inter Variable'");
    expect(withOverride!.css).toContain('"Inter"');
    expect(withOverride!.css).not.toContain("'Inter Variable'");
  });

  test("exposes structured build and fontSans matching light vars", () => {
    const out = presetToShadcnThemeCss(encodePreset({}));
    expect(out).not.toBeNull();
    expect(out!.build.type).toBe("registry:theme");
    expect(out!.build.fontSans).toBe(out!.build.cssVars.light["font-sans"]);
    expect(out!.build.fontHeading).toBe(out!.build.cssVars.light["font-heading"]);
  });
});
