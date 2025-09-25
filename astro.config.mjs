import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default defineConfig({
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
});
