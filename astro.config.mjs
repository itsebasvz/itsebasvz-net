import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://itsebasvz.net",
  output: "static",
  build: {
    format: "directory"
  },
  i18n: {
    locales: ["es", "en"],
    defaultLocale: "es",
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false
    }
  },
  integrations: [
    sitemap({
      // Mirrors the i18n block above so each route is emitted with its
      // alternates, which is what makes the two locales read as one site
      // rather than as two that happen to overlap.
      i18n: {
        defaultLocale: "es",
        locales: { es: "es-MX", en: "en-US" }
      }
    })
  ]
});
