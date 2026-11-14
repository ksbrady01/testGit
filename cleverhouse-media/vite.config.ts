import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: { port: 3001 },
  build: { chunkSizeWarningLimit: 900 }, // three.js lives in its own lazy-loaded chunk
  plugins: [
    tailwindcss(),
    tanstackStart(), // must come before react()
    viteReact(),
  ],
});
