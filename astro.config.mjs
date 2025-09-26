import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import astroIcon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    astroIcon({
      include: {
        ri: ["*"],
      },
    }),
  ],
});
