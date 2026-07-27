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
  }
});
