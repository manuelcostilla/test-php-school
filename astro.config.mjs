import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless"; // Importa el adaptador de Vercel
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel(), // Agrega el adaptador aquí
  vite: {
    plugins: [tailwindcss()],
  },
});
