# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Sebastián Vázquez's bilingual editorial portfolio, **"De señales a sistemas" / "Signals to Systems"**.
Astro 7 static output, TypeScript strict, native CSS, GSAP. Deploys to Cloudflare Workers static assets.
Spanish is the default locale; English must stay structurally equivalent.

## Commands

```sh
npm run dev      # astro dev
npm run check    # astro check — TS strict + content schema validation
npm run build    # astro build (production, static)
npm run preview  # serve dist/
```

`npm run check` + `npm run build` are the validation gate before handing off any change.
No test runner is wired up yet; `docs/ARCHITECTURE.md` §16 specifies Playwright e2e once
interactive behavior lands.

Node ≥22.12, npm 10 (enforced via `engines`/`packageManager`, lockfile committed).

## Sources of truth, in precedence order

1. `design_handoff_portfolio/README.md` + `Portafolio.dc.html` — **visual** truth
   (composition, crops, sizes, rhythm, motion table). The prototype is a design
   reference in inline styles; recreate it in native CSS with tokens, never port it literally.
2. `docs/ARCHITECTURE.md` — **structural** truth (stack, routes, content model, i18n, deploy).
3. `docs/DESIGN.md`, `docs/CONCEPT.md`, `docs/COPY.md`, `docs/ASSETS.md`.

When prototype and docs conflict: prototype wins on visuals, docs win on routes,
content model, i18n and privacy. `Caso HackODS.dc.html` is the pattern for the
four `/work/[slug]/` case routes (not yet built).

## Architecture

**Content → components → scenes → page.** Everything is build-time; no client framework.

- `src/content/projects/*.yaml` — one file per project, validated by the Zod schema in
  `src/content.config.ts` (glob loader). Every text field is a `{ es, en }` pair;
  facts (year, URLs, order, tech) are stored once and shared across locales.
- `src/data/projects.ts` — the only accessor: `getPublicProjects()` (publishState `ready`,
  sorted by `order`) and `getFeaturedProjects()`. `publishState` and `featured` are
  independent: draft ⇒ no public case route; ready+featured ⇒ home selected-work.
- `src/data/media-ids.ts` + `src/data/media.ts` — media indirection. `media-ids.ts` is a
  `const` tuple the content schema enums over, so a YAML file can only reference an asset
  that exists; `media.ts` maps each id to the imported `ImageMetadata`. **Adding an image
  means editing both files**, then referencing it by id in YAML.
- `src/i18n/{types,es,en}.ts` — `ShellCopy`/`HomeCopy` typed dictionaries for all non-project
  chrome copy. `getDictionary(locale)`. Adding a copy field to `types.ts` forces both
  locales to fill it — that is the point.
- `src/pages/index.astro` and `src/pages/en/index.astro` are near-identical shells that
  differ only by the `locale` prop threaded into every scene. Locale switch is a real
  anchor (`/` ↔ `/en/`), never client state.
- `src/components/scenes/` — the eight home scenes, in narrative order (hero, signal field,
  transformation, selected work, city, evidence, exit, contact). Each owns its markup and
  scoped CSS and takes only `locale`.
- `src/components/media/` — `MediaPlate` (photography, native ratio, `Picture` with
  avif/webp + explicit `widths`/`sizes`), `ProductFrame` (screenshots in a `#17181B` frame
  at the file's exact aspect-ratio), `EvidenceFigure`.
- `src/styles/global.css` declares the cascade layer order
  (`reset, tokens, base, layout, components, motion, utilities`) and imports each file into
  its layer. `tokens.css` holds the canonical hex/type/space scale — the prototype's values,
  which supersede `docs/DESIGN.md`.

Not yet implemented, but specified: `/work/[slug]/` case routes, `src/scripts/motion/`
(GSAP is installed but unused so far), Playwright suite, wrangler config.

## Non-negotiable rules

- **No photo as a full-bleed background.** All photography is vertical 1440px wide; upscaling
  pixelates it. Every photo lives in a plate at its native aspect ratio. This explicitly
  revokes `docs/CONCEPT.md` §4 and was the root cause of the previous attempt's failure.
- **No pinning, no horizontal scroll.** See the motion table in the prototype's §06 appendix.
- Animate `transform` and `opacity` only. Nothing that touches layout.
- Content ships visible in the HTML; GSAP applies from-states at runtime via `gsap.from()`.
  Never static CSS from-states, or the no-JS site renders blank.
- `prefers-reduced-motion`: register no ScrollTriggers. Same scenes, photos, order.
- Hover transitions in CSS at 180ms, not GSAP.
- No React, Tailwind, Sass, CSS-in-JS, CMS, database, backend, or contact form in v1.
- 80% work-brand / 20% author-signature. Trim any section that drifts personal.

## Truthfulness and privacy

- **Never claim Duet is production-ready** — it is alpha.
- No correlation presented as causation (applies to the HackODS case).
- "Construyo", "cofundé", "lideré" only where authorship is documented. No
  "revolucionario", "innovador", "de clase mundial".
- Hello World derivatives in `src/assets/` are already sanitized (no UNAM emails, no club
  email, no real names in the ranking). Do not revert to originals.
- Do not reproduce internal operational detail of the World Cup / HBS project.
- Only approved, sanitized derivatives enter `src/assets/`.
