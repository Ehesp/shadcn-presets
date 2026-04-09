# shadcn-presets example

Vite-style Bun + React demo for **`shadcn-presets`**. From the parent package, build once so the `file:..` dependency resolves:

```bash
cd .. && bun run build && cd example && bun install
```

To install dependencies only (after the parent `dist/` exists):

```bash
bun install
```

To start a development server:

```bash
bun dev
```

To run for production:

```bash
bun start
```

This project was created using `bun init` in bun v1.3.11. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
