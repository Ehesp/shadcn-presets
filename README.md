# shadcn-presets

Generate CSS variables from a [Shadcn](https://ui.shadcn.com) preset.

This package allows you to mimic the [Shadcn create page](https://ui.shadcn.com/create) by dynamically generating the CSS required to override your Shadcn CSS variables within a page.

## Usage

```bash
npm i shadcn-presets
```

```ts
import { presetToShadcnThemeCss } from "shadcn-presets";

const css = presetToShadcnThemeCss("b1ZjC5Fqt");

if (!css) {
  throw new Error("Invalid preset value");
}

const INJECTED_STYLE_ID = "shadcn-presets";

let element = document.getElementById(INJECTED_STYLE_ID) as HTMLStyleElement | null;

// Create a new <style> element if it doesn't exist in your HTML
if (!element) {
  element = document.createElement("style");
  element.id = INJECTED_STYLE_ID;
}

// Inject the CSS variables into the page!
element.textContent = css;
```

## Fonts

Although the preset works with specific fonts and will apply the correct variables, it still requires these are loaded into your application (using `@fontsource`, `next/font` etc).

## Example

Run the [example](/example) to see it in action:

```bash
cd example
bun install
bun run dev
```

![Before](.github/before.png)
![After](.github/after.png)

## License

MIT. Theme data and behavior are aligned with [shadcn/ui](https://github.com/shadcn-ui/ui).
