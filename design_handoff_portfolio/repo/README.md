<div align="center">

# Signals to Systems

**Sebastián Vázquez’s bilingual editorial portfolio**

From ideas, data, and communities to digital products that work.

[![Astro](https://img.shields.io/badge/Astro-7.1-BC52EE?logo=astro&logoColor=white)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![CI](https://github.com/itsebasvz/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/itsebasvz/portfolio/actions/workflows/ci.yml)
[![Status](https://img.shields.io/badge/status-foundation-FF6A00)](#project-status)

</div>

## Project status

> [!IMPORTANT]
> This repository contains the implementation foundation. The public experience
> is under active development; the current page is intentionally empty.

The project already has an accepted product direction, visual system,
architecture, bilingual copy, and a curated set of case studies. This first
milestone establishes a clean Astro application and the contracts that will
govern implementation.

## What this portfolio is

**Signals to Systems** presents software, infrastructure, data, and community
work through one idea: reading context, extracting meaningful signals, and
turning them into systems that operate in the real world.

The experience will be:

- Bilingual from the first release: Spanish by default, with an equivalent
  English route tree.
- Editorial and visual-first, with depth living in project case pages.
- Static-first and progressively enhanced with carefully scoped motion.
- Built around real work and evidence rather than a long résumé or generic
  project cards.
- Accessible without JavaScript and respectful of reduced-motion preferences.

## Selected work

| Project | What it demonstrates | Editorial status |
|---|---|---|
| Duet | Agent orchestration and model-role separation | Media ready |
| World Cup CDMX Guide | Mobile-first product work in a live event context | Media ready |
| Hello World | Community operations translated into maintainable software | Media ready after sanitization |
| HackODS | Reproducible public-data engineering and territorial analysis | Media ready |
| musync | Resumable personal-infrastructure tooling at 3,000+ track scale | Media in preparation |

The content model will support all five projects. Only cases that meet the copy,
evidence, and media quality bar will be featured at launch.

## Technical direction

| Layer | Decision |
|---|---|
| Framework | Astro 7, static output |
| Language | TypeScript in strict mode |
| UI | Semantic Astro components |
| Styling | Native CSS with project-owned tokens |
| Motion | GSAP + ScrollTrigger, added during scene implementation |
| Content | Typed Astro Content Collections and locale dictionaries |
| Media | `astro:assets` with responsive output |
| Languages | Spanish default, English equivalent |
| Hosting | Cloudflare Workers static assets |
| Testing | Astro check, build validation, then Playwright |

No React, Tailwind, CMS, database, authentication, contact form, or application
backend is planned for v1.

## Documentation

Implementation decisions are kept close to the code:

- [Design system](docs/DESIGN.md) — identity, layout, responsive rules, and motion.
- [Architecture](docs/ARCHITECTURE.md) — routes, content model, assets, testing, and deploy.
- [Concept](docs/CONCEPT.md) — narrative thesis, eight-scene arc, and anti-drift rules.
- [Copy](docs/COPY.md) — Spanish/English voice and the five case-study theses.
- [Asset register](docs/ASSETS.md) — media readiness, provenance, and privacy rules.

## Repository structure

```text
.
├── .github/workflows/ci.yml
├── docs/
├── public/
├── src/
│   └── pages/
├── AGENTS.md
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

The application structure will grow only as each implementation milestone needs
it. Planned components, content collections, routes, and tests are specified in
the architecture document.

## Local development

Requirements:

- Node.js 22.12 or newer
- npm 9.6.5 or newer

```sh
git clone https://github.com/itsebasvz/portfolio.git
cd portfolio
npm install
npm run dev
```

Astro serves the local site at `http://localhost:4321`.

### Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the local Astro development server |
| `npm run check` | Validate Astro components and TypeScript |
| `npm run build` | Generate the static production output |
| `npm run preview` | Preview the production build locally |

## Development principles

1. Semantic content exists before motion.
2. Every animation communicates hierarchy or transformation.
3. Spanish and English maintain equivalent information architecture.
4. Project claims remain attributable and verifiable.
5. Private source material never enters the public build.
6. New dependencies must justify their accessibility, performance, and
   maintenance cost.

## Privacy and media

Original project captures are curated outside the public repository. Only
approved, sanitized derivatives belong under `src/assets/`.

In particular:

- Internal World Cup operational details must not be reproduced.
- Hello World member names, email addresses, applications, and evidence must be
  removed from production media.
- Screenshots must record their source URL, capture date, viewport, and review
  status.

## Deployment

The production target is Cloudflare Workers serving a fully static Astro build.
Deployment configuration will be added when the first navigable vertical slice
is ready. No Cloudflare adapter is required while every route remains
prerendered.

---

<div align="center">

Built in Mexico City. Connected everywhere.

</div>
