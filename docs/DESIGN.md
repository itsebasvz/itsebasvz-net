---
version: foundation
name: Signals to Systems
description: Dark editorial identity for Sebastián Vázquez's creative engineering portfolio.
colors:
  primary: "#FF761A"
  void: "#090A0B"
  paper: "#F0EDE6"
  signal: "#FF761A"
  electric: "#5B8CFF"
  carbon: "#111214"
  elevated: "#17181B"
  ash: "#AAA6A0"
  graphite: "#71747A"
  error: "#FF6B6B"
  sticker: "#0C0B0D"
  carmine: "#12090C"
  project: "#090A0B"
  night: "#080D17"
  pine: "#091114"
  forest: "#0A100B"
  scrim: "rgba(9, 10, 11, 0.82)"
typography:
  display-xl:
    fontFamily: Instrument Sans
    fontSize: 6rem
    fontWeight: 650
    lineHeight: 0.92
    letterSpacing: -0.055em
    fontVariation: '"wdth" 92, "wght" 650'
  display-lg:
    fontFamily: Instrument Sans
    fontSize: 4.5rem
    fontWeight: 620
    lineHeight: 0.96
    letterSpacing: -0.045em
    fontVariation: '"wdth" 94, "wght" 620'
  headline-lg:
    fontFamily: Instrument Sans
    fontSize: 3.5rem
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -0.035em
  headline-md:
    fontFamily: Instrument Sans
    fontSize: 2.25rem
    fontWeight: 580
    lineHeight: 1.05
    letterSpacing: -0.025em
  headline-sm:
    fontFamily: Instrument Sans
    fontSize: 1.5rem
    fontWeight: 560
    lineHeight: 1.1
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Instrument Sans
    fontSize: 1.25rem
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: -0.01em
  body-md:
    fontFamily: Instrument Sans
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  body-sm:
    fontFamily: Instrument Sans
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.005em
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 0.75rem
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: 0.1em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 0.6875rem
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: 0.08em
rounded:
  none: 0px
  xs: 2px
  sm: 4px
  md: 8px
  pill: 9999px
spacing:
  base: 4px
  zero: 0px
  xs: 4px
  sm: 8px
  "sm-plus": 12px
  md: 16px
  lg: 24px
  xl: 32px
  "2xl": 48px
  "3xl": 64px
  "4xl": 96px
  "5xl": 128px
  gutter-mobile: 20px
  gutter-tablet: 32px
  gutter-desktop: 40px
  content-max: 1600px
  max-width: 1600px
  columns-mobile: 4
  columns-tablet: 6
  columns-desktop: 12
components:
  page:
    backgroundColor: "{colors.void}"
    textColor: "{colors.paper}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 0px
  surface-panel:
    backgroundColor: "{colors.carbon}"
    textColor: "{colors.paper}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.lg}"
  surface-panel-high:
    backgroundColor: "{colors.elevated}"
    textColor: "{colors.paper}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.lg}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.void}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md}"
    height: 44px
  button-primary-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.void}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md}"
    height: 44px
  button-primary-focus:
    backgroundColor: "{colors.electric}"
    textColor: "{colors.void}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md}"
    height: 44px
  button-secondary:
    backgroundColor: transparent
    textColor: "{colors.paper}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md}"
    height: 44px
  button-secondary-hover:
    backgroundColor: "{colors.carbon}"
    textColor: "{colors.paper}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md}"
    height: 44px
  button-secondary-focus:
    backgroundColor: "{colors.electric}"
    textColor: "{colors.void}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md}"
    height: 44px
  link:
    backgroundColor: transparent
    textColor: "{colors.signal}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xs}"
    padding: 2px
  link-hover:
    backgroundColor: transparent
    textColor: "{colors.paper}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xs}"
    padding: 2px
  link-focus:
    backgroundColor: "{colors.electric}"
    textColor: "{colors.void}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xs}"
    padding: 2px
  info-marker:
    backgroundColor: "{colors.electric}"
    textColor: "{colors.void}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.pill}"
    padding: "{spacing.sm}"
  error-message:
    backgroundColor: transparent
    textColor: "{colors.error}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: 0px
  metadata:
    backgroundColor: transparent
    textColor: "{colors.ash}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
    padding: 0px
  divider:
    backgroundColor: "{colors.graphite}"
    rounded: "{rounded.none}"
    height: 1px
    width: 100%
  sticker-module:
    backgroundColor: "{colors.carbon}"
    textColor: "{colors.paper}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.xs}"
    padding: "{spacing.sm}"
  project-case:
    backgroundColor: "{colors.project}"
    textColor: "{colors.paper}"
    typography: "{typography.headline-lg}"
    rounded: "{rounded.none}"
    padding: "{spacing.gutter-desktop}"
  evidence-caption:
    backgroundColor: "{colors.void}"
    textColor: "{colors.ash}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.sm}"
  image-scrim:
    backgroundColor: "{colors.scrim}"
    textColor: "{colors.paper}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.none}"
    padding: "{spacing.lg}"
  atmosphere-sticker:
    backgroundColor: "{colors.sticker}"
    textColor: "{colors.paper}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 0px
  atmosphere-carmine:
    backgroundColor: "{colors.carmine}"
    textColor: "{colors.paper}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 0px
  atmosphere-project:
    backgroundColor: "{colors.project}"
    textColor: "{colors.paper}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 0px
  atmosphere-night:
    backgroundColor: "{colors.night}"
    textColor: "{colors.paper}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 0px
  atmosphere-pine:
    backgroundColor: "{colors.pine}"
    textColor: "{colors.paper}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 0px
  atmosphere-forest:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.paper}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 0px
  contact-panel:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.paper}"
    typography: "{typography.headline-md}"
    rounded: "{rounded.none}"
    padding: "{spacing.gutter-desktop}"
---

# Signals to Systems — Design System

## Overview

**Signals to Systems / De señales a sistemas** is the visual identity for Sebastián
Vázquez's creative-engineering portfolio. It behaves like a dark editorial
exhibition built from street signals: stickers become modules, modules become
interfaces, interfaces reveal working systems. The work is the argument; Sebastián
is the signature.

The identity is deliberately **80% brand, work, and capability; 20% author and
personal signature**. Visitors should first understand the quality and range of
the systems being built. The portrait, biography, and contact arrive only after
the work has established credibility.

The intended feeling is a nocturnal CDMX design bureau run by an engineer:
editorially decisive, technically exact, tactile without being nostalgic, and
alive without becoming noisy. Heat Bureau informs compositional confidence,
Rauno Freiberg informs interactive craft, and Sandra Creates informs immediate
personality. These are references of method, never templates or skins.

The narrative is linear:

1. Photo `05` establishes the street signal.
2. Photos `05 → 08 → 09`, with `14` only when useful, become a modular field.
3. Sticker geometry resolves into interface geometry.
4. Duet, World Cup CDMX Guide/HBS, Hello World, musync, and HackODS appear as
   editorial cases, not portfolio cards.
5. Photo `16` locates the practice in the city.
6. Photos `01`, `02`, `04`, and one or two of `10–13` provide evidence.
7. Photo `20` moves from city to landscape.
8. Photo `19` closes with the author and contact.

When a future requirement is not described here, prefer the option that
strengthens this transformation from signal to system. Do not invent a new
visual metaphor. YAML tokens govern exact values; this prose governs intent.
`CONCEPT.md` provides narrative context. The photographic source inventory is
maintained privately until approved derivatives enter the repository.

## Colors

The system is dark throughout. It does not switch themes; it shifts through
**chromatic blacks** so gradually that the environment changes before the user
consciously notices it.

- **Signal** {colors.signal} is the brand's active color; `{colors.primary}` is its required interaction alias. It marks the selected item, primary action, progress, and link. It never becomes a large decorative field.
- **Void** {colors.void} is the default canvas and **Paper**
  {colors.paper} is the default foreground. Paper is warm because the source
  photographs contain aged paper, concrete, bark, and warm city lights; pure
  white would feel digitally detached.
- **Carbon** {colors.carbon} and **Elevated Carbon**
  {colors.elevated} create hierarchy without glass or heavy shadow.
- **Ash** {colors.ash} is readable secondary copy.
  **Graphite** {colors.graphite} is for rules, inactive decoration, and large
  non-text marks; do not use it for normal-size body text.
- **Electric** {colors.electric} is a contextual system color. It may mark
  technical information or briefly bridge the sticker blues into the blue-hour
  city, but it must not compete with Signal in the same scene.
- **Error** {colors.error} is semantic only.

The atmospheric progression is normative:

```text
{colors.sticker} #0C0B0D → {colors.carmine} #12090C → {colors.project} #090A0B
→ {colors.night} #080D17 → {colors.pine} #091114 → {colors.forest} #0A100B
```

Animate between these values slowly at scene boundaries. They must still read as
black in isolated screenshots. Do not introduce saturated section backgrounds or
a sunrise gradient. As a composition target, use approximately **80% dark
surfaces, 15% Paper/Ash, 4% Signal, and 1% Electric or contextual color**.

Text placed over a photograph requires either {colors.scrim}, a localized dark
gradient, or a solid panel. Busy sticker photography is never itself a reliable
text background.

## Typography

**Instrument Sans** is the only display, headline, body, navigation, and UI sans.
It was selected for its neo-grotesque precision, subtle personality, variable
width, broad language coverage, and open OFL license. It can feel editorial at
large sizes and neutral at reading sizes without splitting the brand into
unrelated voices.

**JetBrains Mono** is reserved for metadata: indices, project facts, captions,
URLs, technical states, language labels, and compact evidence. It must never
become the hero face or a terminal imitation. Both families must be self-hosted
as WOFF2 assets in production.

- Use {typography.display-xl} and {typography.display-lg} for full-viewport
  statements. Convert their fixed reference sizes to responsive `clamp()` values
  in code; preserve their proportions, tracking, and line height. A hero statement
  is at most two lines.
- For prose, map {typography.body-lg} to `clamp(1.125rem, 1.4vw, 1.25rem)`,
  {typography.body-md} to `clamp(1rem, 1vw, 1.125rem)`, and {typography.body-sm}
  to `clamp(0.875rem, 0.9vw, 1rem)`. The scale remains readable on mobile and
  generous on desktop without changing hierarchy.
- Use {typography.headline-lg}, {typography.headline-md}, and
  {typography.headline-sm} for project names and section hierarchy.
- Use {typography.body-lg} sparingly for a single thesis line. Use
  {typography.body-md} and {typography.body-sm} for supporting content outside
  the main scrollytelling.
- Render {typography.label-lg} and {typography.label-sm} in uppercase for English
  or Spanish labels, with the token's tracking intact. Do not uppercase sentences.

Do not add a serif until a specific role and asset prove that it solves a real
hierarchy problem. The current system intentionally has two families, not three.

## Layout

The page combines a strict editorial grid with controlled full-bleed interruption.
The grid makes the sticker material feel designed rather than scrapbook-like.

- **Desktop:** 12 columns, {spacing.gutter-desktop} side gutters, maximum content
  width {spacing.content-max}.
- **Tablet:** 6 columns, {spacing.gutter-tablet} side gutters.
- **Mobile:** 4 columns, {spacing.gutter-mobile} side gutters.
- Use the 4px spacing base represented in the YAML scale. Prefer `{spacing.md}`,
  `{spacing.lg}`, `{spacing.xl}`, and `{spacing.3xl}` for ordinary rhythm; reserve
  `{spacing.4xl}` and `{spacing.5xl}` for scene-level separation.

Photos `05`, `16`, `20`, and `19` may be full-bleed. Their text remains aligned
to the grid. Project cases may pin a media plane while metadata changes, but they
must not collapse into a repeated SaaS card grid.

Desktop can use asymmetry and overlap when all important anchors still resolve to
the 12-column grid. Mobile preserves scene order and argument, not desktop
coordinates: flatten overlaps, shorten travel, and place captions in normal flow.

## Elevation & Depth

Depth comes from tonal layers, scale, occlusion, and controlled motion. The base
stack is Void → Carbon → Elevated Carbon. Use a one-pixel Graphite rule where a
boundary must remain visible.

Stickers cut out from photography may receive one restrained dark shadow so they
can separate from the wall before becoming UI. That shadow belongs to the
transformation, not to every component. Project cases, navigation, buttons, and
contact surfaces rely on tone and border contrast rather than floating cards.

Do not use glassmorphism, frosted panels, neon glows, large ambient blurs, or
multi-layer drop shadows. Grain belongs to the photographic treatment, not as a
veil over every UI surface.

## Shapes

The shape language is **engineered softness**:

- {rounded.none} for full scenes, image frames, project cases, rules, and editorial
  panels.
- {rounded.xs} and {rounded.sm} for controls and compact modules.
- {rounded.md} only for a component that is genuinely elevated or touch-oriented.
- {rounded.pill} only for a true pill/status treatment; never as a default button or card radius.

The original silhouette of a sticker may be irregular because it is an asset.
Interface containers must not be given random rotations, torn borders, or custom
blobs to imitate stickers. The transformation is powerful only if organic source
material resolves into disciplined UI geometry.

## Components

### Page and navigation

The base page uses `components.page`. Navigation is minimal, grid-aligned, and
available without waiting for animation. Use Instrument Sans for destinations and
JetBrains Mono only for compact state such as `ES / EN` or `01 / 08`.

### Actions and links

`components.button-primary` is reserved for the most important action in a scene.
Its hover state inverts to Paper through `components.button-primary-hover`; focus
adds a clearly visible outline and must never rely on color alone.
`components.button-secondary` and `components.link` carry all other exits. Do not
place two orange primary buttons beside each other.

All touch targets are at least 44px high. Hover feedback uses
`180ms` and `cubic-bezier(0.22, 1, 0.36, 1)`. Keyboard focus remains
visible over photos and every atmospheric black.

### Sticker module

`components.sticker-module` is a semantic label derived from a real sticker or
crop. During the opening field it may translate, rotate slightly, and change
scale. As it approaches the project section, rotation resolves to zero, spacing
snaps to the grid, and its role becomes a tag, control, frame, or project datum.
Do not manufacture dozens of fake stickers.

### Project case

`components.project-case` occupies a scene, not a small card. Each case contains:

- Project name.
- One sentence expressing problem → system.
- One dominant product image, video frame, or interface.
- Role and one verifiable datum when useful.
- One clear route to the repository, demo, or deeper case.

Duet, World Cup CDMX Guide/HBS, Hello World, musync, and HackODS share this grammar
without being forced into identical compositions.

### Evidence strip

The evidence sequence uses real photos `01`, `02`, `04`, and one or two selected
from `10–13`. Captions use `components.evidence-caption`: event, role, and result,
not a personal anecdote. It may move horizontally for a short section, but it is
not an infinite carousel.

### Photography and scrims

Use `components.image-scrim` when a photo cannot provide stable contrast.
Photographic treatment is coherent but not mechanically identical:

- Reduce saturation roughly 8–15% when needed; this is a grading direction, not
  a mandatory numeric filter.
- Use moderate contrast and deep blacks while retaining wall, fabric, leaf, and
  sky texture.
- Keep highlights slightly warm and grain subtle.
- Preserve the red, blue, and yellow signals in sticker scenes, the blue city
  atmosphere, the yellow road sign, and the final forest greens.
- Never apply a global duotone.

Photos are brand assets and evidence, not an album. Do not present them as
polaroids, sentimental snapshots, or a masonry gallery.

### Motion and scrollytelling

GSAP timelines and ScrollTrigger implement the experience:

- The entry runs for 1–1.5 seconds; 1200ms is the reference.
  Scroll becomes the master clock afterward.
- Pin only the sticker field and selected-work sequence.
- Use a ScrollTrigger scrub catch-up near 800ms; tune only after
  testing low-end devices.
- Use 320ms for component transitions and
  900ms for autonomous scene entrances.
- Animate transform and opacity. Avoid width, height, top, and left animation.
- Use linear easing for scroll-linked spatial progress and
  `cubic-bezier(0.22, 1, 0.36, 1)` for autonomous entrances and feedback.
- No elastic, bounce, gratuitous parallax, scroll hijacking, or motion whose only
  purpose is spectacle.

With `prefers-reduced-motion`, remove scrub, deep parallax, and complex pinning.
Show the same photographs, project order, copy, links, and hierarchy in normal
document flow. Core content and navigation must work without JavaScript.

### Contact

`components.contact-panel` closes over photo `19`. It contains a short invitation,
email, GitHub, and LinkedIn. This is the 20% author signature: no manifesto, skills
cloud, or repeated biography.

The final wordmark is unresolved. Until it is intentionally designed, typeset
**Sebastián Vázquez** in Instrument Sans. Do not invent a monogram, logo, mascot,
or icon family. Final product mockups and final photographic crops are also
pending asset decisions; preserve explicit placeholders rather than fabricating
them.

## Do's and Don'ts

- **Do** make the transition from street signal to engineered system legible in
  composition and behavior.
- **Do** keep the site dark while moving through the specified chromatic blacks.
- **Do** let photographs supply complexity while the interface supplies order.
- **Do** use Signal orange sparingly and maintain one dominant accent per scene.
- **Do** preserve WCAG AA contrast: at least 4.5:1 for normal text and visible,
  non-color-only keyboard focus.
- **Do** maintain equivalent Spanish and English hierarchy, not merely equivalent
  word count.
- **Do** treat mobile and reduced-motion experiences as first-class compositions.
- **Don't** restore the terminal, boot prompt, legacy purple, or hacker-console
  language as the primary metaphor.
- **Don't** use polaroids, scrapbook composition, a long CV, a skills cloud, or a
  chronological autobiography in the main scroll.
- **Don't** introduce generic tech gradients, neon, glass, purple glow, or floating
  SaaS cards.
- **Don't** use JetBrains Mono for display typography or turn metadata into fake
  command-line copy.
- **Don't** round every surface, rotate UI containers randomly, or decorate empty
  space with invented stickers.
- **Don't** copy Heat Bureau, Rauno, or Sandra Creates at the level of layout,
  assets, typography, or signature interaction.
- **Don't** invent unresolved identity assets. Keep the typographic name, mockup
  slots, and crop notes explicit until those decisions are made.
- **Don't** let animation conceal navigation, delay access to content, or become
  necessary to understand a project.
