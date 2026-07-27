/**
 * Adapted to the code that exists rather than adopted wholesale. The previous
 * repository's config set singleQuote and trailing commas; this codebase was
 * written with double quotes and none, so taking that config verbatim would
 * have rewritten every string in the repository to settle a question nobody
 * asked.
 *
 * @type {import('prettier').Config}
 */
export default {
  plugins: ["prettier-plugin-astro"],
  overrides: [{ files: "*.astro", options: { parser: "astro" } }],
  printWidth: 100,
  trailingComma: "none"
};
