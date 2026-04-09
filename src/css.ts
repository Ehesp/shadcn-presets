// CSS serialization vendored from apps/v4 DesignSystemProvider (buildThemeCssText).

import type { ThemeCssVars } from "./build-theme.ts";

function buildCssRule(selector: string, cssVars?: Record<string, string>) {
  const declarations = Object.entries(cssVars ?? {})
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n");

  if (!declarations) {
    return `${selector} {}\n`;
  }

  return `${selector} {\n${declarations}\n}\n`;
}

export function buildThemeCssText(cssVars: ThemeCssVars): string {
  return [
    buildCssRule(":root", {
      ...cssVars.theme,
      ...cssVars.light,
    }),
    buildCssRule(".dark", cssVars.dark),
  ].join("");
}
