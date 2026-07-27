export default {
  extends: ["stylelint-config-standard"],
  ignoreFiles: ["dist/**", "node_modules/**"],
  rules: {
    // Project conventions the standard config has opinions about and this
    // repository has already settled.
    "custom-property-pattern": null,
    "custom-property-empty-line-before": null,
    "selector-class-pattern": null,
    "no-descending-specificity": null,
    "declaration-block-no-redundant-longhand-properties": null,
    "media-feature-range-notation": "prefix",

    // The standard config wants `@import url("...")`. Vite resolves the string
    // form — including bare package specifiers like
    // `@fontsource-variable/instrument-sans/wdth.css` — and treats url() as an
    // external reference to leave alone. Switching notation would silently stop
    // the fonts and the cascade layer imports from being bundled at all.
    "import-notation": "string",

    // -webkit-text-size-adjust is still the only spelling iOS Safari honours,
    // and reset.css already pairs it with the unprefixed property. Dropping the
    // prefix would bring back text inflation on the one platform that needs it.
    "property-no-vendor-prefix": [
      true,
      { ignoreProperties: ["-webkit-text-size-adjust", "text-size-adjust"] }
    ]
  }
};
