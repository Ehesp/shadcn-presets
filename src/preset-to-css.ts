import {
  buildRegistryTheme,
  getThemesForBaseColor,
  type RegistryThemeResult,
  type ThemeBuildInput,
} from "./build-theme.ts";
import { buildThemeCssText } from "./css.ts";
import { decodePreset, type PresetConfig, V1_CHART_COLOR_MAP } from "shadcn/preset";

/**
 * Maps a decoded preset to theme build input (parity with v4 create search-param normalization).
 */
export function presetConfigToThemeBuildInput(
  decoded: PresetConfig,
  fontFamilyOverrides?: Partial<Record<PresetConfig["font"], string>>,
): ThemeBuildInput {
  let chartColor: string = decoded.chartColor ?? V1_CHART_COLOR_MAP[decoded.theme] ?? decoded.theme;

  let theme: string = decoded.theme;
  const available = getThemesForBaseColor(decoded.baseColor);
  const fallback = available[0]?.name ?? decoded.baseColor;

  if (!available.some((t) => t.name === theme)) {
    theme = fallback;
  }
  if (!available.some((t) => t.name === chartColor)) {
    chartColor = fallback;
  }

  const effectiveRadius = decoded.style === "lyra" ? "none" : decoded.radius;

  return {
    baseColor: decoded.baseColor,
    theme,
    chartColor,
    menuAccent: decoded.menuAccent,
    radius: effectiveRadius,
    font: decoded.font,
    fontHeading: decoded.fontHeading,
    fontFamilyOverrides,
  };
}

/** Structured output from {@link buildRegistryTheme}, plus resolved font stacks for convenience. */
export type PresetToShadcnThemeCssBuild = RegistryThemeResult & {
  /** Resolved `font-family` value for `--font-sans` when that variable is emitted. */
  fontSans?: string;
  /** Resolved `font-family` value for `--font-heading` when that variable is emitted. */
  fontHeading?: string;
};

export type PresetToShadcnThemeCssResult = {
  /** Serialized `:root` + `.dark` CSS (same as before this API shape existed). */
  css: string;
  /** Theme object and shorthand font strings (`build.cssVars.light` holds all `:root` vars). */
  build: PresetToShadcnThemeCssBuild;
};

/**
 * Decodes a shadcn create/init preset code and returns serialized CSS plus the structured theme
 * (`css` for a `<style>` tag, `build` for tokens like {@link PresetToShadcnThemeCssBuild.fontSans}).
 *
 * Optional `fontFamilyOverrides` merges with built-in stacks so `--font-sans` / `--font-heading`
 * match your loaded fonts (same shape as {@link ThemeBuildInput.fontFamilyOverrides}).
 *
 * Returns `null` if the code is invalid or theme data cannot be resolved.
 */
export function presetToShadcnThemeCss(
  presetCode: string,
  fontFamilyOverrides?: Partial<Record<PresetConfig["font"], string>>,
): PresetToShadcnThemeCssResult | null {
  const decoded = decodePreset(presetCode.trim());
  if (!decoded) {
    return null;
  }

  try {
    const input = presetConfigToThemeBuildInput(decoded, fontFamilyOverrides);
    const registryTheme = buildRegistryTheme(input);
    const light = registryTheme.cssVars.light;
    const build: PresetToShadcnThemeCssBuild = {
      ...registryTheme,
      fontSans: light["font-sans"],
      fontHeading: light["font-heading"],
    };
    return {
      css: buildThemeCssText(registryTheme.cssVars),
      build,
    };
  } catch {
    return null;
  }
}
