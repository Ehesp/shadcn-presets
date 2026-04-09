# shadcn-presets

Turn a **shadcn create preset code** (the short string from the CLI or website, e.g. `b4HOVxAC3U`) into **CSS you can drop into your app**—the same semantic color and radius variables the create preview uses for light (`:root`) and dark (`.dark`).

Use it when you want a **live theme preview**, a **hosted playground**, or to **sync UI to a preset** without running the full shadcn CLI inside your product.

## Install

```bash
npm install shadcn-presets
```

The package depends on the official [`shadcn`](https://www.npmjs.com/package/shadcn) runtime for decoding preset strings (`shadcn/preset`). You normally only install `shadcn-presets`; npm will pull `shadcn` in as a dependency.

## Quick start

```ts
import { presetToShadcnThemeCss } from "shadcn-presets"

const css = presetToShadcnThemeCss("b0")
if (css) {
  const style = document.createElement("style")
  style.textContent = css
  document.head.appendChild(style)
}
```

Your UI should already follow the usual shadcn + Tailwind setup: utility classes like `bg-background` and `text-foreground`, and a **dark mode** class on `html` (or your root element), e.g. `.dark`, so the `.dark { … }` block in the generated CSS applies.

## What you get

| Piece | Role |
| ----- | ---- |
| Preset string → CSS | `presetToShadcnThemeCss(code)` returns one string of CSS, or `null` if the code is invalid. |
| Colors & radius | Merged from the same theme data model as create (base color, accent theme, chart colors, menu accent, radius; Lyra style forces radius to none, like create). |
| Fonts | The CSS includes `--font-sans` and `--font-heading` with the same family *names* as the official preview. See [Fonts](#fonts) below. |
| Low-level APIs | You can also use `decodePreset`, `encodePreset`, `buildRegistryTheme`, and related exports if you’re building tooling. |

## API overview

- **`presetToShadcnThemeCss(presetCode)`** — Main entry: preset string → full CSS for `:root` and `.dark`.
- **`decodePreset` / `encodePreset` / `isPresetCode` / …** — Re-exported from [`shadcn/preset`](https://www.npmjs.com/package/shadcn) (same behavior as the CLI).
- **`buildRegistryTheme` / `buildThemeCssText`** — Build or stringify theme CSS from structured inputs if you’re not starting from a preset string.

Import names are tree-shake friendly: your bundler only needs to include what you use.

## Fonts

The generated CSS sets **`--font-sans`** and **`--font-heading`** to stacks like “Inter Variable” or “Geist Variable.” Those lines tell the browser *which* families to use; they do **not** load font files over the network.

To actually see those typefaces, load them the same way a real app would: Google Fonts, `@fontsource-variable/*`, `next/font`, etc. If you skip that, the browser falls back to generic system fonts—the colors will still change with the preset, but typography may not match [ui.shadcn.com](https://ui.shadcn.com) pixel-for-pixel.

## Regenerating theme data (maintainers)

[`src/themes.ts`](src/themes.ts) is **generated**. If you need to refresh theme tokens from the public registry:

```bash
bun run generate:themes
```

The script reads the shadcn registry (`$REGISTRY_URL`, default `https://ui.shadcn.com/r`) and fills in themes by name. If the registry does not yet list every theme the preset codec allows, the command may fail; in that case keep the committed `src/themes.ts` until the registry catches up.

After regenerating, run tests. When the upstream preset format changes, bump the **`shadcn`** dependency to match.

## Build (maintainers)

Published builds output **`dist/`** (ESM + TypeScript declarations):

```bash
bun run build
```

Run before publishing. Local tests import from **`src/`** directly.

## License

MIT. Theme data and behavior are aligned with [shadcn/ui](https://github.com/shadcn-ui/ui).
