<div align="center">

# Signals to Systems

**Sebastián Vázquez’s bilingual editorial portfolio**

From ideas, data, and communities to digital products that work.

[![Astro](https://img.shields.io/badge/Astro-7.0-BC52EE?logo=astro&logoColor=white)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![CI](https://github.com/itsebasvz/itsebasvz-net/actions/workflows/ci.yml/badge.svg)](https://github.com/itsebasvz/itsebasvz-net/actions/workflows/ci.yml)
[![Status](https://img.shields.io/badge/status-home%20shipped-FF6A00)](#project-status)

</div>

## Project status

The bilingual home page is built: eight scenes in narrative order, in Spanish and
English, with an interactive hero. The case-study routes under `/work/[slug]/`
are specified and their components exist, but the routes themselves are not
implemented yet.

| Area | State |
|---|---|
| Home, both locales | Built |
| Content model and copy dictionaries | Built |
| Scroll motion (signal field) | Built |
| Interactive hero (fox and ball) | Built |
| Playwright suite | Built — routing, accessibility, progressive enhancement |
| `/work/[slug]/` case routes | Specified, not implemented |
| Cloudflare deploy | Configured, not yet deployed |

## What this portfolio is

**Signals to Systems** presents software, infrastructure, data, and community
work through one idea: reading context, extracting meaningful signals, and
turning them into systems that operate in the real world.

The experience is:

- Bilingual from the first release: Spanish by default, with a structurally
  equivalent English route tree.
- Editorial and visual-first, with depth living in project case pages.
- Static-first and progressively enhanced with carefully scoped motion.
- Built around real work and evidence rather than a long résumé or generic
  project cards.
- Accessible without JavaScript and respectful of reduced-motion preferences.

## The hero

The first scene carries the only piece of play in the site. A fox is rendered
from a glTF model through an ordered Bayer dither, tinted into the brand's
orange ramp so it reads as screen-printed rather than as a 3D object dropped
onto the page. A tennis ball can be picked up and thrown inside an arena whose
walls are measured from the layout itself — the scene counter above, the
vertical rail to one side, the photograph to the other, and the ground the fox
stands on.

The fox is never told where the ball is going. It gets what an observer gets —
where the ball is, how high, how fast — and guesses the rest from its own rough
model of what a ball does: an arc down to the ground, or a roll that runs out.
The guess is worse the further ahead it reaches, and it improves on every
bounce, because the hops keep getting shorter. So the fox commits early and
wrong, corrects as it goes, and arrives beside a ball whose landing spot it
never actually knew. It reacts after a beat rather than on the same frame, walks
or runs depending on the distance, turns to watch a ball being carried, and
flinches when one lands at its feet.

None of it is required to read the page. Under `prefers-reduced-motion` the
hero is still, and without JavaScript everything but the canvas renders.

## Selected work

| Project | What it demonstrates | Status |
|---|---|---|
| HackODS | Reproducible public-data engineering and territorial analysis | Featured |
| Hello World | Community operations translated into maintainable software | Featured |
| World Cup CDMX Guide | Mobile-first product work in a live event context | Featured |
| Duet | Agent orchestration and model-role separation | Featured — alpha |
| musync | Resumable personal-infrastructure tooling at 3,000+ track scale | Not yet in the content collection |

`publishState` and `featured` are independent: a project can be ready without
being on the home page, and only `ready` projects get a public case route.

## Technical direction

| Layer | Decision |
|---|---|
| Framework | Astro 7, static output |
| Language | TypeScript in strict mode |
| UI | Semantic Astro components, no client framework |
| Styling | Native CSS cascade layers with project-owned tokens |
| Scroll motion | GSAP + ScrollTrigger |
| Hero rendering | three.js, deferred and desktop-only |
| Content | Typed Astro content collections and locale dictionaries |
| Media | `astro:assets` with responsive output |
| Languages | Spanish default, English equivalent |
| Hosting | Cloudflare Workers static assets |
| Testing | Prettier, ESLint, Stylelint, Astro check, and Playwright with axe |

No React, Tailwind, Sass, CSS-in-JS, CMS, database, authentication, contact
form, or application backend is planned for v1.

## Documentation

Implementation decisions are kept close to the code:

- [Design system](docs/DESIGN.md) — identity, layout, responsive rules, and motion.
- [Architecture](docs/ARCHITECTURE.md) — routes, content model, assets, testing, and deploy.
- [Concept](docs/CONCEPT.md) — narrative thesis, eight-scene arc, and anti-drift rules.
- [Copy](docs/COPY.md) — Spanish/English voice and the five case-study theses.
- [Asset register](docs/ASSETS.md) — media readiness, provenance, and privacy rules.
- [CLAUDE.md](CLAUDE.md) — working rules for anyone, human or agent, changing this repository.

Where the documents disagree with `design_handoff_portfolio/`, the prototype
wins on visuals and the documents win on routes, content model, i18n, and
privacy. `src/styles/tokens.css` holds the canonical scale.

## Repository structure

```text
.
├── design_handoff_portfolio/   visual source of truth
├── docs/                       product, design and architecture documents
├── public/                     favicon and the fox model
├── src/
│   ├── assets/                 curated photography, project and evidence media
│   ├── components/
│   │   ├── chrome/             header, footer, scene headers
│   │   ├── media/              plates, frames, and the hero canvases
│   │   ├── projects/           case study building blocks
│   │   └── scenes/             the eight home scenes, in narrative order
│   ├── content/projects/       one YAML file per project
│   ├── data/                   the only accessors for content and media
│   ├── i18n/                   typed Spanish and English dictionaries
│   ├── layouts/                base document
│   ├── pages/                  / and /en/
│   ├── scripts/                motion and WebGL, all deferred
│   └── styles/                 cascade layers and tokens
├── scripts/                    cross-file content validation
├── tests/e2e/                  routing, accessibility, progressive enhancement
├── AGENTS.md
├── CLAUDE.md
├── astro.config.mjs
└── wrangler.jsonc
```

## Known issues

`--color-graphite` (`#71747a`) falls short of WCAG AA contrast on the small mono
labels: it measures between 3.79 and 4.23 to 1 against the four backgrounds it
lands on, where AA wants 4.5 for text that size, across 27 elements. `#7e8187`
is the smallest lightening that clears all four. It is a token from the design
handoff, so the change is a design decision rather than a bug fix, and it is
recorded as a `test.fixme` in `tests/e2e/accessibility.spec.ts` so it stays
visible in the test report until it is settled.

## Local development

Requirements:

- Node.js 22.12 or newer
- npm 10 or newer

```sh
git clone https://github.com/itsebasvz/itsebasvz-net.git
cd itsebasvz-net
npm install
npm run dev
```

Astro serves the local site at `http://localhost:4321`.

### Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the local Astro development server |
| `npm run check` | Formatting, lint, content invariants, and types |
| `npm run build` | Generate the static production output |
| `npm run preview` | Preview the production build locally |
| `npm run test:e2e` | Routing, accessibility, and progressive enhancement, against the build |
| `npm run format` | Rewrite formatting in place |

`npm run check` and `npm run build` are the gate before handing off any change.
CI runs both plus the browser suite.

`npm run content:check` covers what the content schema structurally cannot: the
invariants that span two files, like a slug disagreeing with its filename, two
projects sharing an `order`, or a media id declared in one registry and missing
from the other.

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
- Duet is alpha software and is never described as production-ready.

## Deployment

The production target is Cloudflare Workers serving a fully static Astro build.
No Cloudflare adapter is required while every route remains prerendered.

---

<div align="center">

Built in Mexico City. Connected everywhere.

</div>
