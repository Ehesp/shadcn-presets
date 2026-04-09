import { describe, expect, test } from "bun:test";
import { buildThemeCssText } from "./css.ts";
import type { ThemeCssVars } from "./build-theme.ts";

describe("buildThemeCssText", () => {
  test("merges theme and light on :root with light overriding duplicate keys", () => {
    const cssVars: ThemeCssVars = {
      theme: { background: "hsl(0 0% 100%)", radius: "0.5rem" },
      light: { background: "hsl(210 40% 98%)", foreground: "hsl(222 47% 11%)" },
      dark: {},
    };
    const css = buildThemeCssText(cssVars);
    expect(css).toContain("--background: hsl(210 40% 98%);");
    expect(css).toContain("--radius: 0.5rem;");
    expect(css).toContain("--foreground: hsl(222 47% 11%);");
  });

  test("omits variables with empty string values", () => {
    const cssVars: ThemeCssVars = {
      theme: {},
      light: { background: "ok", empty: "" },
      dark: { muted: "", card: "ok" },
    };
    const css = buildThemeCssText(cssVars);
    expect(css).not.toContain("--empty:");
    expect(css).not.toContain("--muted:");
    expect(css).toContain("--background: ok;");
    expect(css).toContain("--card: ok;");
  });

  test("writes :root and .dark blocks with expected newlines", () => {
    const cssVars: ThemeCssVars = {
      theme: {},
      light: { a: "1" },
      dark: { b: "2" },
    };
    expect(buildThemeCssText(cssVars)).toBe(`:root {\n  --a: 1;\n}\n.dark {\n  --b: 2;\n}\n`);
  });

  test("emits empty rule blocks when there are no declarations", () => {
    const cssVars: ThemeCssVars = {
      theme: {},
      light: {},
      dark: {},
    };
    expect(buildThemeCssText(cssVars)).toBe(`:root {}\n.dark {}\n`);
  });

  test("treats undefined theme like an empty object", () => {
    const cssVars: ThemeCssVars = {
      light: { primary: "blue" },
      dark: { primary: "navy" },
    };
    const css = buildThemeCssText(cssVars);
    expect(css).toContain(":root {\n  --primary: blue;\n}");
    expect(css).toContain(".dark {\n  --primary: navy;\n}");
  });
});
