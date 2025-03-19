import { defineConfig } from "vite";

export default defineConfig({
  base: "/library-app/", // Ensures GitHub Pages serves the correct path
  build: {
    outDir: "dist",
    rollupOptions: {
      input: "index.html",
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
});
