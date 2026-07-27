# Portafolio — «De señales a sistemas»

Portafolio editorial bilingüe de Sebastián Vázquez. Astro 7, TypeScript strict,
CSS nativo, GSAP. Salida estática en Cloudflare Workers.

## Referencia de diseño

`design_handoff_portfolio/` contiene la **referencia maestra de diseño**: un
prototipo HTML de la home completa con contenido real, más un README de handoff
con tokens, composición por escena, tabla de motion y pendientes.

Ese prototipo es la fuente de verdad **visual**. Los `docs/` son la fuente de
verdad **estructural**. Cuando choquen, gana el prototipo en composición, crops,
tamaños y ritmo; ganan los docs en rutas, content model, i18n y privacidad.

El prototipo está escrito con estilos inline por restricciones de la herramienta
en que se diseñó. No lo portes literal: recréalo en CSS nativo con tokens.

## Fuentes de verdad

1. `design_handoff_portfolio/README.md` — decisiones visuales finales.
2. `docs/ARCHITECTURE.md` — stack, rutas, content model, quality gates, deploy.
3. `docs/DESIGN.md` — identidad y sistema (los hex finales están en el handoff).
4. `docs/CONCEPT.md` — tesis narrativa y reglas anti-deriva.
5. `docs/COPY.md` — voz ES/EN y tesis de cada caso.
6. `docs/ASSETS.md` — estado de medios y privacidad.

## Reglas que no se negocian

- **Ninguna foto como fondo full-bleed.** Las fotos son verticales de 1440px;
  escaladas se pixelan. Cada una en placa a su ratio nativo. Esto revoca
  explícitamente el full-bleed que pedía `CONCEPT.md` §4.
- **Sin pin y sin scroll horizontal.** Ver la tabla de motion del handoff.
- Solo `transform` y `opacity`. Nada que toque layout.
- El contenido nace visible; los from-states los pone GSAP en runtime.
- `prefers-reduced-motion` degrada a estático sin perder contenido.
- Sin React, Tailwind, CMS, base de datos ni backend en v1.
- ES por defecto, EN estructuralmente equivalente.
- No commitear imágenes sin sanitizar ni datos personales.
- 80% trabajo-marca / 20% autor-firma. Si un tramo personal crece, se corta.
- **No afirmar que Duet está listo para producción.** Sigue en alpha.

## Validación

```sh
npm run check
npm run build
```
