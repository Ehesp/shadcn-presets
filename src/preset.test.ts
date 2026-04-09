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
    const css = presetToShadcnThemeCss(code);
    expect(css).not.toBeNull();
    expect(css).toContain(":root");
    expect(css).toContain(".dark");
    expect(css).toContain("--background:");
  });

  test("round-trip preset produces stable output", () => {
    const decoded = decodePreset("b0");
    expect(decoded).not.toBeNull();
    const css = presetToShadcnThemeCss("b0");
    expect(css).not.toBeNull();
    expect(css!.length).toBeGreaterThan(100);
  });

  test("v1 preset without chartColor still produces CSS", () => {
    const css = presetToShadcnThemeCss("a0");
    expect(css).not.toBeNull();
    expect(css).toContain("--chart-1:");
  });

  test("trims whitespace around the preset code", () => {
    const code = encodePreset({});
    const css = presetToShadcnThemeCss(`  ${code}  `);
    expect(css).not.toBeNull();
    expect(css).toContain(":root");
  });
});
