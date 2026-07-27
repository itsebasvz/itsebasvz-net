# Repository guidance

This repository implements Sebastián Vázquez's portfolio, **Signals to Systems**.

## Sources of truth

Read these before changing product behavior or presentation:

1. `docs/DESIGN.md` — visual identity, scenes, responsive behavior, and motion.
2. `docs/ARCHITECTURE.md` — stack, routes, content model, quality gates, and deploy.
3. `docs/CONCEPT.md` — narrative intent and anti-drift rules.
4. `docs/COPY.md` — bilingual voice, project theses, and editorial copy.
5. `docs/ASSETS.md` — approved media status and privacy constraints.

When documents conflict, use that order and flag the inconsistency.

## Engineering constraints

- Astro components and static HTML are the default.
- TypeScript stays in strict mode.
- Use native CSS and repository tokens; do not introduce Tailwind.
- Do not add React, a CMS, a database, a contact form, or runtime APIs in v1.
- Motion progressively enhances semantic content and must support
  `prefers-reduced-motion`.
- Spanish is the default locale and English must remain structurally equivalent.
- Do not commit private source imagery, personal data, credentials, or
  unsanitized screenshots.

## Validation

Before handing off a change, run:

```sh
npm run check
npm run build
```

Add browser tests when interactive behavior begins.
