import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "build",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, "build/index.html"),
        mosh: resolve(__dirname, "build/mosh.html"),
        mosh2: resolve(__dirname, "build/mosh2.html"),
        about: resolve(__dirname, "build/about.html"),
        not_found: resolve(__dirname, "build/not_found.html"),
      },
    },
  },
});
