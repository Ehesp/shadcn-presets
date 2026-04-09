// Theme merge logic vendored from apps/v4/registry/config.ts (buildRegistryTheme).

import { PRESET_BASE_COLORS } from "shadcn/preset";

import { presetFontCssVars } from "./font-families.ts";
import { THEMES, type RegistryThemeItem } from "./themes.ts";

const BASE_COLOR_NAMES = new Set<string>(PRESET_BASE_COLORS);

export const RADII = [
  { name: "default", label: "Default", value: "" },
  { name: "none", label: "None", value: "0" },
  { name: "small", label: "Small", value: "0.45rem" },
  { name: "medium", label: "Medium", value: "0.625rem" },
  { name: "large", label: "Large", value: "0.875rem" },
] as const;

export const BASE_COLORS: RegistryThemeItem[] = THEMES.filter((theme) =>
  BASE_COLOR_NAMES.has(theme.name),
);

export function getThemesForBaseColor(baseColorName: string) {
  const baseColorNames = BASE_COLORS.map((bc) => bc.name);

  return THEMES.filter((theme) => {
    if (theme.name === baseColorName) {
      return true;
    }
    return !baseColorNames.includes(theme.name);
  });
}

export function getTheme(name: string) {
  return THEMES.find((theme) => theme.name === name);
}

export function getBaseColor(name: string) {
  return BASE_COLORS.find((color) => color.name === name);
}

export type ThemeCssVars = {
  theme?: Record<string, string>;
  light: Record<string, string>;
  dark: Record<string, string>;
};

export type RegistryThemeResult = {
  name: string;
  type: "registry:theme";
  cssVars: ThemeCssVars;
};

/** Subset of design config required to build semantic CSS variables. */
export type ThemeBuildInput = {
  baseColor: string;
  theme: string;
  chartColor: string;
  menuAccent: "subtle" | "bold";
  radius: string;
  /** Body font id (`PRESET_FONTS`); sets `--font-sans` / Tailwind `font-sans`. */
  font: string;
  /** Heading font id or `inherit` (matches v4 create). */
  fontHeading: string;
};

export function buildRegistryTheme(config: ThemeBuildInput): RegistryThemeResult {
  const baseColor = getBaseColor(config.baseColor);
  const theme = getTheme(config.theme);

  if (!baseColor || !theme) {
    throw new Error(`Base color "${config.baseColor}" or theme "${config.theme}" not found`);
  }

  const lightVars: Record<string, string> = {
    ...(baseColor.cssVars?.light as Record<string, string>),
    ...(theme.cssVars?.light as Record<string, string>),
  };
  const darkVars: Record<string, string> = {
    ...(baseColor.cssVars?.dark as Record<string, string>),
    ...(theme.cssVars?.dark as Record<string, string>),
  };
  const themeVars: Record<string, string> = {};

  const chartTheme = getTheme(config.chartColor);
  if (chartTheme) {
    const chartLight = chartTheme.cssVars?.light as Record<string, string>;
    const chartDark = chartTheme.cssVars?.dark as Record<string, string>;
    for (let i = 1; i <= 5; i++) {
      const key = `chart-${i}`;
      if (chartLight?.[key]) lightVars[key] = chartLight[key]!;
      if (chartDark?.[key]) darkVars[key] = chartDark[key]!;
    }
  }

  if (config.menuAccent === "bold") {
    lightVars.accent = lightVars.primary!;
    lightVars["accent-foreground"] = lightVars["primary-foreground"]!;
    darkVars.accent = darkVars.primary!;
    darkVars["accent-foreground"] = darkVars["primary-foreground"]!;
  }

  if (config.radius && config.radius !== "default") {
    const radius = RADII.find((r) => r.name === config.radius);
    if (radius?.value) {
      lightVars.radius = radius.value;
    }
  }

  const fontVars = presetFontCssVars(config.font, config.fontHeading);
  Object.assign(lightVars, fontVars);

  return {
    name: `${config.baseColor}-${config.theme}`,
    type: "registry:theme",
    cssVars: {
      theme: Object.keys(themeVars).length > 0 ? themeVars : undefined,
      light: lightVars,
      dark: darkVars,
    },
  };
}
