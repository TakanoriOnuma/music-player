import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  server: {
    host: true,
  },
  plugins: [
    react(),
    VitePWA({
      manifest: {
        lang: "ja",
        name: "音楽プレーヤー",
        short_name: "Music",
        background_color: "#fff",
        theme_color: "#2196f3",
        display: "standalone",
        // GitHub Pagesのリポジトリ名を指定
        start_url: "/music-player/",
        scope: "/music-player/",
        icons: [
          {
            src: "app-icons/512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
