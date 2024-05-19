import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (p) =>
          p.split("/").reverse()[
            p.split("/").reverse().indexOf("node_modules") - 1
          ],
      },
    },
  },
  preview: {
    port: 8182,
    strictPort: true,
  },
  server: {
    port: 8182,
    strictPort: true,
    host: true,
    origin: "http://0.0.0.0:8182",
  },
});
