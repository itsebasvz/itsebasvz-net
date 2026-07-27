# Signals to Systems — Architecture

> Status: accepted baseline for implementation; explicitly open decisions remain
> listed in section 19.
>
> This document defines how the portfolio is built and operated. `DESIGN.md`
> remains the source of truth for visual identity; `CONCEPT.md` remains the
> source of truth for narrative intent.

## 1. Architectural goals

The portfolio is a content-first, bilingual, editorial website with a
scroll-driven presentation layer. Its architecture must make the ambitious
motion optional: the underlying document remains readable, navigable, and
complete when JavaScript is unavailable or motion is reduced.

The system optimizes for:

- Fast first delivery of semantic HTML, typography, and the hero photograph.
- A controlled GSAP scrollytelling layer without turning the site into a
  client-rendered application.
- High-quality responsive photography and project media.
- Equivalent Spanish and English routes from the first public release.
- Five modeled project cases, while publishing only the cases that meet the
  content and asset quality bar.
- Static deployment with low operational complexity.
- Clear ownership boundaries between content, presentation, motion, and
  infrastructure.

## 2. Non-goals for v1

The first version does not require:

- React or another hydrated UI framework.
- A CMS, database, authentication, or user accounts.
- A contact form or application backend.
- A chat or embedded AI assistant.
- Runtime personalization.
- Client-side global state.
- A custom smooth-scroll engine.
- WebGL as the foundation of the experience.
- Experimental Astro features.

These are exclusions, not permanent prohibitions. A future requirement must
justify adding one of them.

## 3. Technology stack

| Layer | Decision | Role |
|---|---|---|
| Framework | **Astro 7.x** | Static generation, routing, components, assets, fonts, metadata, and i18n |
| Language | **TypeScript, strict mode** | Content schemas, animation modules, utilities, and build-time validation |
| Runtime for builds | **Node.js 22.12+** | Supported Astro 7 development and CI environment |
| UI rendering | **Astro components** | Semantic HTML rendered at build time |
| Styling | **Native CSS** | Tokens, editorial layout, responsive composition, and motion states |
| Motion | **GSAP 3.13+ + ScrollTrigger** | Timelines, pinning, scrub, entrances, and atmospheric transitions |
| Content | **Astro Content Collections + typed locale dictionaries** | Project facts, translated copy, links, and publication state |
| Media | **`astro:assets`** | Responsive images, dimensions, formats, and build-time optimization |
| i18n | **Astro i18n routing** | Spanish default and English equivalent routes |
| Deployment | **Cloudflare Workers static assets** | CDN delivery, TLS, custom domain, and deploy previews |
| End-to-end testing | **Playwright** | Browser, route, responsive, reduced-motion, and visual checks |

No Cloudflare adapter is required while every route is prerendered. Add
`@astrojs/cloudflare` only if a later requirement introduces on-demand
rendering or server endpoints.

The package manager is **npm 10**. It is enforced with `packageManager` and
`engines` in `package.json`, plus a committed `package-lock.json`.

## 4. Rendering model

Astro produces the complete site as static HTML. The page is usable before the
motion bundle initializes.

```text
Typed content
    ↓
Astro build
    ├─ semantic HTML
    ├─ responsive media
    ├─ self-hosted fonts
    ├─ localized routes
    └─ metadata and structured data
            ↓
Progressive enhancement in the browser
    ├─ GSAP intro
    ├─ ScrollTrigger scene timelines
    ├─ atmospheric CSS-variable transitions
    └─ small UI interactions
            ↓
Cloudflare Workers static delivery
```

Motion never creates primary copy, project links, navigation, or reading order.
It changes presentation and spatial relationships only.

## 5. Routes and internationalization

Spanish is the default public language:

```text
/                         Spanish home
/en/                      English home
/work/[slug]/             Spanish project case
/en/work/[slug]/          English project case
/404.html                 Static not-found page
```

Project slugs remain language-neutral so a locale switch can preserve the
current project without maintaining two slug maps.

Every localized route includes:

- A correct `lang` attribute.
- Canonical URL.
- `hreflang` alternates for Spanish and English.
- Localized title, description, Open Graph copy, and accessible labels.
- A real anchor link for switching locale.

The locale switch is navigation, not client-side state. It must work without
JavaScript.

## 6. Page composition

The home page follows the eight-scene narrative from `CONCEPT.md`:

```text
01 Signal hero
02 Signal field
03 Signal → interface
04 Selected work
05 City / ecosystem
06 Evidence
07 Exit city
08 Contact / signature
```

Suggested component boundary:

```text
src/components/
├── chrome/
│   ├── SiteHeader.astro
│   ├── LocaleSwitch.astro
│   ├── SceneProgress.astro
│   └── SkipLink.astro
├── scenes/
│   ├── SignalHero.astro
│   ├── SignalField.astro
│   ├── SystemTransformation.astro
│   ├── SelectedWork.astro
│   ├── CityContext.astro
│   ├── EvidenceStrip.astro
│   ├── ExitCity.astro
│   └── ContactSignature.astro
├── projects/
│   ├── ProjectCase.astro
│   ├── ProjectFacts.astro
│   ├── ProjectMedia.astro
│   ├── ProjectLinks.astro
│   └── NextProject.astro
└── media/
    ├── ArtDirectedPicture.astro
    ├── MediaPlaceholder.astro
    └── EvidenceFigure.astro
```

Scene components own markup and local composition. They expose stable
`data-*` hooks to motion modules; they do not contain long inline GSAP programs.

## 7. Project architecture

The system models all five selected-work candidates:

1. Duet.
2. World Cup CDMX Guide / HBS.
3. Hello World.
4. musync.
5. HackODS.

Modeling a project does not automatically publish or feature it. Each entry has
two independent decisions:

- `publishState`: whether its internal case route is production-ready.
- `featured`: whether it appears in the home scrollytelling.

The public build follows these rules:

```text
publishState = draft
    → no public case route
    → may not be featured

publishState = ready, featured = false
    → public internal case route
    → omitted from the main selected-work sequence

publishState = ready, featured = true
    → public internal case route
    → included in selected work
```

This lets the architecture support five projects while the launch contains only
the strongest finished cases. The expected launch range is three to five
featured projects; final selection happens after copy and media review.

### 7.1 Project content contract

Each project entry should validate approximately this shape:

```ts
type Project = {
  slug: string;
  order: number;
  publishState: "draft" | "ready";
  featured: boolean;
  year: number;
  status?: "alpha" | "active" | "completed" | "archived";
  role: string[];
  fields: string[];
  technologies: string[];
  facts: Array<{
    label: string;
    value: string;
    source?: string;
  }>;
  links: {
    repository?: string;
    demo?: string;
    organization?: string;
  };
  copy: {
    es: ProjectCopy;
    en: ProjectCopy;
  };
  media: ProjectMedia[];
};
```

Translated copy includes:

- Project name when localization is appropriate.
- One-line thesis: problem → system.
- Short context.
- System explanation.
- Sebastián's concrete contribution.
- Result or evidence.
- Link labels and media alternative text.

Facts such as year, URLs, status, ordering, and technologies are stored once.
Copy and accessible text are localized.

### 7.2 Internal case depth

Each ready case uses the same editorial information architecture:

1. Project thesis and dominant media.
2. Context or problem.
3. The system that was built.
4. Sebastián's responsibility and decisions.
5. Result or verifiable evidence.
6. Relevant stack, kept subordinate to the story.
7. Repository, demo, or official destination.
8. Previous/next project navigation.

A case should take roughly three to five minutes to read. It is not a development
diary, a README copy, or a long chronological retrospective.

World Cup CDMX Guide must describe product, architecture, and contribution
without exposing private operational details or protected internal material.

## 8. Media and placeholder policy

Project layouts reserve explicit media slots before final images exist. Missing
media is represented honestly during development; it is never replaced with a
fabricated screenshot, invented interface, stock mockup, or AI-generated
biographical evidence.

Accepted media sources:

1. Original images or exports provided by Sebastián.
2. Existing public repository assets.
3. Screenshots of public demos captured with Playwright.
4. Public video or interface captures Sebastián authorizes.

Playwright captures must:

- Use public URLs without bypassing authentication.
- Avoid private routes, personal data, tokens, internal addresses, and
  operational details.
- Record the source URL, viewport, date, and project association.
- Capture desktop and mobile when the interface materially changes.
- Be reviewed before becoming a production asset.

Suggested asset structure:

```text
src/assets/
├── photography/
│   ├── originals-selected/
│   └── crops/
├── projects/
│   ├── duet/
│   ├── world-cup-cdmx-guide/
│   ├── hello-world/
│   ├── musync/
│   └── hackods/
├── evidence/
└── social/
```

Only selected production assets belong in the application repository. Immich
remains the archive and source for photographic originals.

### 8.1 Placeholder behavior

`MediaPlaceholder.astro` reserves the final aspect ratio and records the intended
asset role:

```text
PROJECT: DUET
SLOT: PRIMARY PRODUCT VIEW
TARGET: DESKTOP 16:10
STATUS: ASSET PENDING
```

Placeholders are allowed in local development and deploy previews. A project
cannot become `ready` while a required primary-media placeholder remains.

Optional supporting-media slots may be omitted entirely rather than displayed
as empty boxes in production.

## 9. Image and font delivery

Selected photographs and project captures live under `src/assets`, not
`public`, so Astro can process them.

Use `Image` or `Picture` from `astro:assets` with:

- Explicit dimensions to prevent layout shift.
- Responsive `srcset` and `sizes`.
- AVIF/WebP plus a compatible fallback where useful.
- Eager loading and high priority only for the hero media.
- Lazy loading below the first viewport.
- Art-directed desktop and mobile crops for photographs whose subject would
  otherwise be lost.

Instrument Sans and JetBrains Mono are self-hosted. Astro's font support may
generate preload and fallback behavior, but local production files remain under
project control in accordance with `DESIGN.md`.

## 10. CSS architecture

Styling uses native CSS with custom properties, cascade layers, scoped Astro
styles, and a small number of deliberate utilities.

```text
src/styles/
├── reset.css
├── tokens.css
├── typography.css
├── base.css
├── layout.css
├── motion.css
└── global.css
```

Global layer order:

```css
@layer reset, tokens, base, layout, components, motion, utilities;
```

Responsibilities:

- `tokens.css` mirrors the normative values in `DESIGN.md`.
- Global files define the page canvas, type, grid, focus, and shared primitives.
- Each `.astro` component owns its unique composition through scoped styles.
- `motion.css` defines initial enhancement states and reduced-motion overrides.
- Utilities are added only after the same declaration pattern recurs.

Atmospheric colors are CSS variables so GSAP can interpolate the environment
without owning component styling:

```css
:root {
  --color-background: #090a0b;
  --color-foreground: #f0ede6;
  --color-signal: #ff761a;
  --scene-atmosphere: #0c0b0d;
}
```

Do not introduce Tailwind, CSS-in-JS, Sass, or a component theme library unless
a later requirement demonstrates a concrete benefit.

## 11. Motion architecture

GSAP is loaded only on routes that use portfolio motion. Project case pages may
reuse small entrance helpers without loading the home scrollytelling controller.

```text
src/scripts/motion/
├── index.ts
├── register.ts
├── intro.ts
├── signal-field.ts
├── transformation.ts
├── selected-work.ts
├── evidence.ts
├── atmosphere.ts
├── match-media.ts
└── types.ts
```

Rules:

- Register ScrollTrigger once.
- Create top-level triggers in document order.
- Attach ScrollTrigger to a top-level tween or timeline, not child tweens.
- Use one named timeline per complex scene.
- Pin only the signal field and selected-work sequence.
- Animate children of pinned containers, not the pinned container itself.
- Prefer `x`, `y`, `scale`, `rotation`, `autoAlpha`, and CSS variables.
- Avoid animated `width`, `height`, `top`, and `left`.
- Use `ease: "none"` for progress directly tied to scroll.
- Call `ScrollTrigger.refresh()` after layout-affecting fonts or media settle.
- Return cleanup functions and kill timelines/triggers when a route is left.
- Do not add a smooth-scroll library in v1.

`gsap.matchMedia()` defines three first-class compositions:

- Desktop motion.
- Mobile/tablet motion with shorter travel and fewer overlaps.
- `prefers-reduced-motion`, with no scrub, deep parallax, or complex pinning.

Reduced motion retains every scene, project, photograph, link, and piece of
evidence in normal document flow.

## 12. Navigation model

The initial release uses normal multi-page navigation. Do not enable Astro's
client router globally.

This avoids coupling GSAP initialization to client-router lifecycle events and
keeps refresh, back/forward navigation, and failure behavior predictable.
Native cross-document View Transitions may be evaluated later for project-case
navigation if they do not weaken accessibility or motion cleanup.

## 13. Contact

The contact scene contains only:

- Email.
- GitHub.
- LinkedIn.

There is no Instagram link and no contact form in v1. All three destinations are
ordinary accessible links and require no runtime service.

## 14. SEO and document metadata

Every public page includes:

- Unique localized title and description.
- Canonical and alternate-language URLs.
- Open Graph and social preview metadata.
- A project-specific preview image for ready cases.
- Sitemap entries for production-ready routes only.
- `robots.txt`.
- Structured data appropriate to the author and creative work without
  overstating employment, awards, or project ownership.

Draft project routes and preview assets must not enter the production sitemap.

## 15. Accessibility and progressive enhancement

Required behavior:

- Semantic heading order and landmark structure.
- Skip link and keyboard-accessible navigation.
- Visible focus that survives every photograph and atmospheric background.
- No content reachable only through hover.
- No pinned scene that traps keyboard or scroll navigation.
- Useful alternative text based on the editorial role of each image.
- Decorative crops hidden from assistive technology.
- Full experience at 200% zoom.
- WCAG AA contrast as specified in `DESIGN.md`.
- The same information and destinations with JavaScript disabled.

The pre-animation state is visible content. JavaScript may opt an initialized
scene into motion; CSS must not hide the entire page while waiting for a script.

## 16. Testing and quality gates

Build validation:

- `astro check`.
- TypeScript strict checking.
- Production build.
- Content schema validation.
- Broken internal-link detection.

Playwright coverage:

- Spanish and English home routes.
- Every ready project route in both languages.
- Locale switching while preserving the project slug.
- Keyboard navigation and focus visibility.
- Reduced-motion emulation.
- Mobile, tablet, and desktop viewports.
- Chromium, Firefox, and WebKit smoke coverage.
- No accidental horizontal page overflow.
- Required links and metadata.
- Screenshot comparison for a small set of stable scene states.

Manual release checks:

- Low-end mobile performance.
- ScrollTrigger pinning and reverse scrolling.
- Browser zoom and text resizing.
- Hero and project-media crop review.
- HBS confidentiality review.
- Verification of claims, links, and project results.

## 17. Deployment

Production uses Cloudflare Workers with static assets:

```text
source
  → install dependencies from lockfile
  → type/content validation
  → Astro production build
  → Playwright smoke tests against preview
  → Wrangler deploy
  → custom domain
```

Environment policy:

- `development`: local Astro development.
- `preview`: production build on a temporary Cloudflare URL.
- `production`: approved build on the final domain.

The build should be reproducible without access to Immich, private repositories,
or a homelab service. Every production dependency and approved asset must be
present in the repository or fetched from an explicitly documented public
source at build time.

Enable Astro's stable Content Security Policy support. Avoid third-party scripts
by default; each analytics or embed request must justify its privacy, performance,
and CSP cost.

## 18. Suggested source tree

```text
.
├── docs/
│   ├── ARCHITECTURE.md
│   ├── ASSETS.md
│   ├── CONCEPT.md
│   ├── COPY.md
│   └── DESIGN.md
├── astro.config.mjs
├── package.json
├── public/
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── assets/
│   ├── components/
│   ├── content/
│   │   └── projects/
│   ├── i18n/
│   │   ├── es.ts
│   │   └── en.ts
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── ProjectLayout.astro
│   ├── pages/
│   ├── scripts/
│   │   └── motion/
│   └── styles/
├── tests/
│   └── e2e/
└── wrangler.jsonc
```

The exact generated route structure should be chosen while scaffolding after
validating Astro's current i18n file-routing behavior. The public URL contract
in section 5 remains normative.

## 19. Decisions recorded

| Decision | Status |
|---|---|
| Astro as the application framework | Accepted |
| Static generation for v1 | Accepted |
| TypeScript strict | Accepted |
| Native CSS instead of Tailwind | Accepted |
| GSAP + ScrollTrigger for scrollytelling | Accepted |
| Native scroll; no Lenis/ScrollSmoother in v1 | Accepted |
| Astro i18n with Spanish default and English routes | Accepted |
| Cloudflare Workers production | Accepted |
| No React, CMS, database, or backend in v1 | Accepted |
| No contact form | Accepted |
| Contact: email, GitHub, LinkedIn | Accepted |
| Model five projects; publish only quality-ready cases | Accepted |
| Honest media placeholders until assets are supplied or captured | Accepted |
| Normal MPA navigation before client routing | Accepted |
| Package manager | npm 10 with committed lockfile |
| Final production domain and redirect policy | Accepted — `https://itsebasvz.net/`; `www` permanently redirects to the apex |
| Launch projects | Accepted — Duet, World Cup CDMX Guide, Hello World and HackODS; musync remains a non-featured draft |
| Public email | Accepted — `hola@itsebasvz.net`, forwarded privately through Cloudflare Email Routing |
| Mobile motion | Accepted — natural document flow, short entrances and native scroll-snap evidence; no long pins |

## 20. References

- Astro documentation: <https://docs.astro.build/>
- Astro 7 release: <https://astro.build/blog/astro-7/>
- Astro islands architecture: <https://docs.astro.build/en/concepts/islands/>
- Astro internationalization: <https://docs.astro.build/en/guides/internationalization/>
- Astro images: <https://docs.astro.build/en/guides/images/>
- Astro Cloudflare deployment: <https://docs.astro.build/en/guides/deploy/cloudflare/>
- Astro testing: <https://docs.astro.build/en/guides/testing/>
- GSAP installation: <https://gsap.com/docs/v3/Installation/>
- GSAP ScrollTrigger: <https://gsap.com/docs/v3/Plugins/ScrollTrigger/>
