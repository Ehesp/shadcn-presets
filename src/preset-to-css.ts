import {
  buildRegistryTheme,
  getThemesForBaseColor,
  type ThemeBuildInput,
} from "./build-theme.ts"
import { buildThemeCssText } from "./css.ts"
import {
  decodePreset,
  type PresetConfig,
  V1_CHART_COLOR_MAP,
} from "shadcn/preset"

/**
 * Maps a decoded preset to theme build input (parity with v4 create search-param normalization).
 */
export function presetConfigToThemeBuildInput(
  decoded: PresetConfig
): ThemeBuildInput {
  let chartColor: string =
    decoded.chartColor ??
    V1_CHART_COLOR_MAP[decoded.theme] ??
    decoded.theme

  let theme: string = decoded.theme
  const available = getThemesForBaseColor(decoded.baseColor)
  const fallback = available[0]?.name ?? decoded.baseColor

  if (!available.some((t) => t.name === theme)) {
    theme = fallback
  }
  if (!available.some((t) => t.name === chartColor)) {
    chartColor = fallback
  }

  const effectiveRadius =
    decoded.style === "lyra" ? "none" : decoded.radius

  return {
    baseColor: decoded.baseColor,
    theme,
    chartColor,
    menuAccent: decoded.menuAccent,
    radius: effectiveRadius,
    font: decoded.font,
    fontHeading: decoded.fontHeading,
  }
}

/**
 * Decodes a shadcn create/init preset code and returns CSS for `:root` and `.dark`
 * (semantic variables), suitable for injecting into a `<style>` tag.
 *
 * Returns `null` if the code is invalid or theme data cannot be resolved.
 */
export function presetToShadcnThemeCss(presetCode: string): string | null {
  const decoded = decodePreset(presetCode.trim())
  if (!decoded) {
    return null
  }

  try {
    const input = presetConfigToThemeBuildInput(decoded)
    const registryTheme = buildRegistryTheme(input)
    return buildThemeCssText(registryTheme.cssVars)
  } catch {
    return null
  }
}
