import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 相對資源路徑搭配 HashRouter，可部署至 GitHub Pages 的專案子目錄。
export default defineConfig({ plugins: [react()], base: "./" });
