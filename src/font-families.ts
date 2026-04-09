// Aligned with apps/v4/lib/font-definitions.ts (family stacks for preset fonts).

import type { PresetConfig } from "shadcn/preset"

/** CSS `font-family` stacks for each `PRESET_FONTS` name (same strings as v4 create preview). */
export const PRESET_FONT_FAMILY = {
  geist: "'Geist Variable', sans-serif",
  inter: "'Inter Variable', sans-serif",
  "noto-sans": "'Noto Sans Variable', sans-serif",
  "nunito-sans": "'Nunito Sans Variable', sans-serif",
  figtree: "'Figtree Variable', sans-serif",
  roboto: "'Roboto Variable', sans-serif",
  raleway: "'Raleway Variable', sans-serif",
  "dm-sans": "'DM Sans Variable', sans-serif",
  "public-sans": "'Public Sans Variable', sans-serif",
  outfit: "'Outfit Variable', sans-serif",
  oxanium: "'Oxanium Variable', sans-serif",
  manrope: "'Manrope Variable', sans-serif",
  "space-grotesk": "'Space Grotesk Variable', sans-serif",
  montserrat: "'Montserrat Variable', sans-serif",
  "ibm-plex-sans": "'IBM Plex Sans Variable', sans-serif",
  "source-sans-3": "'Source Sans 3 Variable', sans-serif",
  "instrument-sans": "'Instrument Sans Variable', sans-serif",
  "jetbrains-mono": "'JetBrains Mono Variable', monospace",
  "geist-mono": "'Geist Mono Variable', monospace",
  "noto-serif": "'Noto Serif Variable', serif",
  "roboto-slab": "'Roboto Slab Variable', serif",
  merriweather: "'Merriweather Variable', serif",
  lora: "'Lora Variable', serif",
  "playfair-display": "'Playfair Display Variable', serif",
} as const satisfies Record<PresetConfig["font"], string>

const FALLBACK_BODY = PRESET_FONT_FAMILY.inter

export function getPresetFontFamily(name: string): string {
  if (name in PRESET_FONT_FAMILY) {
    return PRESET_FONT_FAMILY[name as PresetConfig["font"]]
  }
  return FALLBACK_BODY
}

/**
 * CSS custom properties for `:root` (Tailwind `font-sans` / heading utilities), matching v4 create
 * (`--font-sans` + `--font-heading` on the document root).
 */
export function presetFontCssVars(font: string, fontHeading: string): Record<string, string> {
  const body = getPresetFontFamily(font)
  let heading: string
  if (fontHeading === "inherit" || fontHeading === font) {
    heading = body
  } else {
    heading = getPresetFontFamily(fontHeading)
  }
  return {
    "font-sans": body,
    "font-heading": heading,
  }
}
