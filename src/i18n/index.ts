import { en } from "./en";
import { es } from "./es";
import type { Locale, ShellCopy } from "./types";

export { locales } from "./types";
export type { Locale, ShellCopy } from "./types";

const dictionaries = { es, en } satisfies Record<Locale, ShellCopy>;

export function getDictionary(locale: Locale): ShellCopy {
  return dictionaries[locale];
}
