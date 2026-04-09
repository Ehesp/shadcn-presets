export {
  decodePreset,
  encodePreset,
  isPresetCode,
  isValidPreset,
  generateRandomConfig,
  generateRandomPreset,
  toBase62,
  fromBase62,
  DEFAULT_PRESET_CONFIG,
  V1_CHART_COLOR_MAP,
  PRESET_STYLES,
  PRESET_BASE_COLORS,
  PRESET_THEMES,
  PRESET_FONTS,
  PRESET_RADII,
  type PresetConfig,
} from "shadcn/preset";

export type { RegistryThemeItem } from "./themes.ts";
export { THEMES } from "./themes.ts";

export {
  buildRegistryTheme,
  getThemesForBaseColor,
  getTheme,
  getBaseColor,
  RADII,
  BASE_COLORS,
  type ThemeBuildInput,
  type RegistryThemeResult,
  type ThemeCssVars,
} from "./build-theme.ts";

export { buildThemeCssText } from "./css.ts";

export { presetToShadcnThemeCss, presetConfigToThemeBuildInput } from "./preset-to-css.ts";
