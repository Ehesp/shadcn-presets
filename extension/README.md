# shadcn Preset Injector

Minimal Chrome extension for previewing `shadcn` preset codes on any page that already uses shadcn CSS variables.

## What it does

1. Click the extension icon.
2. Paste a preset value.
3. Inject the generated CSS variables into the current tab.

## Prerequisites

- [Bun](https://bun.sh)
- Google Chrome or another Chromium-based browser that supports Chrome extensions

## Install dependencies

From the repo root:

```bash
bun install
cd extension
bun install
```

## Build the extension

You can build it either from the extension folder or from the repo root.

From `extension/`:

```bash
bun run build
```

From the repo root:

```bash
bun run build:extension
```

The built extension will be written to `extension/dist`.

## Run locally

For local development, rebuild on file changes:

From `extension/`:

```bash
bun run dev
```

Or from the repo root:

```bash
bun run dev:extension
```

This runs Vite in watch mode and keeps `extension/dist` up to date as you edit files.

## Load it in Chrome

1. Open `chrome://extensions`.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select the `extension/dist` folder from this repo.

After that:

1. Open a site that already uses shadcn CSS variables.
2. Click the extension icon.
3. Paste a preset code such as `b1ZjC5Fqt`.
4. Click `Apply preset`.

## Notes

- The extension injects a `<style>` tag into the current page.
- It will not work on restricted pages like `chrome://` URLs.
- Font variables can be injected, but the target site still needs those fonts to actually be loaded.
