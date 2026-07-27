import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["dist/**", ".astro/**", "node_modules/**", "playwright-report/**", "support.js"]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs["flat/recommended"],
  {
    files: ["**/*.mjs"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly"
      }
    }
  },
  {
    files: ["**/*.{ts,astro}"],
    rules: {
      // typescript-eslint documents this: no-undef cannot see ambient and
      // global types, so it flags things like Astro's ImageMetadata that are
      // perfectly defined. The compiler already catches undefined identifiers,
      // and `npm run typecheck` runs it. Left on for plain .mjs, where there is
      // no type checker behind it.
      "no-undef": "off"
    }
  },
  {
    files: ["**/*.{js,mjs,ts,astro}"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-console": ["error", { allow: ["warn", "error", "log"] }]
    }
  }
];
