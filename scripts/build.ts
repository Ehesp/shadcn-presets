#!/usr/bin/env bun
/**
 * ESM bundle (Bun) + declaration emit (tsc). Run from package root: `bun run build`
 */
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");

async function main() {
  const dist = join(root, "dist");
  if (existsSync(dist)) {
    rmSync(dist, { recursive: true });
  }

  const result = await Bun.build({
    entrypoints: [join(root, "src/index.ts")],
    outdir: dist,
    format: "esm",
    target: "node",
    minify: true,
    sourcemap: "external",
    external: ["shadcn"],
  });

  if (!result.success) {
    for (const log of result.logs) {
      console.error(log);
    }
    process.exit(1);
  }

  const proc = Bun.spawnSync(["bun", "x", "tsc", "-p", "tsconfig.build.json"], {
    cwd: root,
    stdio: ["inherit", "inherit", "inherit"],
  });

  if (proc.exitCode !== 0) {
    process.exit(proc.exitCode ?? 1);
  }

  console.info("Built dist/");
}

await main();
