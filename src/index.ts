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
  PRESET_FONT_HEADINGS,
  PRESET_ICON_LIBRARIES,
  PRESET_MENU_ACCENTS,
  PRESET_MENU_COLORS,
  PRESET_CHART_COLORS,
  PRESET_RADII,
  type PresetConfig,
} from "shadcn/preset";

export {
  PRESET_FONT_FAMILY,
  getPresetFontFamily,
  presetFontCssVars,
} from "./font-families.ts";

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

export {
  presetToShadcnThemeCss,
  presetConfigToThemeBuildInput,
  type PresetToShadcnThemeCssBuild,
  type PresetToShadcnThemeCssResult,
} from "./preset-to-css.ts";
