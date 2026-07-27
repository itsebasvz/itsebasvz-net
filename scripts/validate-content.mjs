/**
 * Cross-file invariants the content schema cannot see.
 *
 * The Zod schema in src/content.config.ts validates one project at a time and
 * does it well. What it structurally cannot check is anything that involves two
 * files at once — and every rule below is exactly that: a place where two
 * sources have to agree and nothing today makes them.
 *
 * Run with `npm run content:check`.
 */

import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const projectsDir = resolve(root, "src/content/projects");

/**
 * Enough YAML for the shape this repository actually writes: two-space nested
 * maps, `- ` sequences, and scalars. Pulling in a parser for a handful of flat
 * lookups would be the heavier choice, and a wrong parse here fails loudly
 * rather than silently — `astro check` has already validated the real schema by
 * the time this runs.
 */
function readScalar(source, key) {
  const match = source.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  if (!match) return undefined;
  return match[1].trim().replace(/^["']|["']$/g, "");
}

function readAssetIds(source) {
  return [...source.matchAll(/^\s*-?\s*asset:\s*(.+)$/gm)].map((match) =>
    match[1].trim().replace(/^["']|["']$/g, "")
  );
}

function readRoles(source) {
  return [...source.matchAll(/^\s*role:\s*(.+)$/gm)].map((match) =>
    match[1].trim().replace(/^["']|["']$/g, "")
  );
}

const errors = [];
const files = (await readdir(projectsDir)).filter((file) => file.endsWith(".yaml")).sort();

if (files.length === 0) errors.push("No project files found.");

const bySlug = new Map();
const byOrder = new Map();
const usedAssets = new Set();

for (const file of files) {
  const source = await readFile(resolve(projectsDir, file), "utf8");
  const slug = readScalar(source, "slug");
  const order = Number(readScalar(source, "order"));
  const publishState = readScalar(source, "publishState");
  const featured = readScalar(source, "featured") === "true";

  // The glob loader keys entries by filename, so a slug that disagrees with its
  // file silently splits the project in two: one identity for routing, another
  // for the data.
  const expected = file.replace(/\.yaml$/, "");
  if (slug !== expected) {
    errors.push(`${file}: slug "${slug}" does not match the filename`);
  }

  if (bySlug.has(slug)) errors.push(`Duplicate slug "${slug}" in ${bySlug.get(slug)} and ${file}`);
  bySlug.set(slug, file);

  // getPublicProjects() sorts by order. Two projects sharing one makes the home
  // page's sequence depend on filesystem iteration.
  if (byOrder.has(order)) {
    errors.push(`Duplicate order ${order} in ${byOrder.get(order)} and ${file}`);
  }
  byOrder.set(order, file);

  if (publishState === "draft" && featured) {
    errors.push(`${file}: a draft project cannot be featured`);
  }

  const roles = readRoles(source);
  if (publishState === "ready" && !roles.includes("primary")) {
    errors.push(`${file}: a ready project needs one primary media entry`);
  }

  for (const asset of readAssetIds(source)) usedAssets.add(asset);
}

// media-ids.ts is the tuple the schema enums over; media.ts maps each id to an
// imported asset. Adding an image means editing both, and an id present in one
// but not the other is undefined at runtime rather than a build error.
const idsSource = await readFile(resolve(root, "src/data/media-ids.ts"), "utf8");
const mapSource = await readFile(resolve(root, "src/data/media.ts"), "utf8");

const declaredIds = [...idsSource.matchAll(/"([a-z0-9-]+)"/g)].map((match) => match[1]);
const mappedIds = new Set([...mapSource.matchAll(/"([a-z0-9-]+)":/g)].map((match) => match[1]));

for (const id of declaredIds) {
  if (!mappedIds.has(id)) errors.push(`media-ids.ts declares "${id}" but media.ts does not map it`);
}
for (const id of mappedIds) {
  if (!declaredIds.includes(id)) {
    errors.push(`media.ts maps "${id}" but media-ids.ts does not declare it`);
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  const unused = declaredIds.filter((id) => !usedAssets.has(id));
  console.log(
    `Validated ${files.length} projects and ${declaredIds.length} media ids.` +
      (unused.length > 0 ? ` Unused by projects: ${unused.join(", ")}.` : "")
  );
}
