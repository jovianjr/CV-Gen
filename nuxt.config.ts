// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from "@primevue/themes/aura";

export default defineNuxtConfig({
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "CVGen",
      meta: [
        { name: "title", content: "CVGen" },
        { name: "description", content: "Generate your cv ats friendly" },
      ],
    },
  },
  compatibilityDate: "2024-04-03",
  css: ["~/assets/css/main.css", "primeicons/primeicons.css"],
  devtools: { enabled: true },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: ["@primevue/nuxt-module"],
  primevue: {
    autoImport: true,
    options: {
      theme: {
        preset: Aura,
      },
    },
  },
});
