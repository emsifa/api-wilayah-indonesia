import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "src/index.ts",
  format: "esm",
  target: "node18",
  outDir: "dist",
  clean: true,
  dts: false,
  shims: false,
  fixExtensions: false,
  publint: false,
  unused: false,
  // Bundle dependencies so `npx @emsifa/wilayah` works with files: ["dist"] only
  noExternal: [/./],
  copy: ["assets"],
});
