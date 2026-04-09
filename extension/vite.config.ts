import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "shadcn-presets": fileURLToPath(new URL("../src/index.ts", import.meta.url)),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    target: "es2022",
    rollupOptions: {
      input: {
        popup: fileURLToPath(new URL("./popup.html", import.meta.url)),
      },
    },
  },
});
