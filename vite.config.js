import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base は将来 GitHub Pages 公開時にリポジトリ名と一致させる（例 /toketa/）。
export default defineConfig({
  base: "/toketa/",
  plugins: [react()],
});
