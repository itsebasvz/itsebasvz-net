# Prompt de arranque para Claude Code

Copia todo lo que está debajo de la línea como primer mensaje en el repo
`itsebasvz/portfolio`, con `design_handoff_portfolio/` ya presente en el árbol.

---

Vas a implementar mi portafolio. El repo tiene una base de Astro vacía a
propósito: la página pública todavía no existe y el código anterior se descartó.
No lo recuperes.

**Antes de escribir nada, lee en este orden:**

1. `design_handoff_portfolio/README.md` — la referencia maestra de diseño.
2. `Portafolio.dc.html` (en la raíz del paquete) — ábrelo en el navegador y
   recórrelo completo, incluido el apéndice técnico del final. Es un prototipo
   de la home con contenido real: composición, tokens, escalas, crops y estados
   finales de motion ya resueltos.
3. `docs/ARCHITECTURE.md` — stack, rutas, content model, quality gates, deploy.
4. `docs/COPY.md` — el texto exacto, ES y EN.
5. `docs/CONCEPT.md`, `docs/DESIGN.md`, `docs/ASSETS.md` — tesis, sistema, medios.
6. `AGENTS.md` — restricciones de ingeniería.

**Cómo tratar el prototipo.** Es la fuente de verdad visual, no código para
portar. Está escrito con estilos inline por restricciones de la herramienta en
que se diseñó. Recréalo en componentes Astro con CSS nativo y custom properties.
Cuando el prototipo y los `docs/` se contradigan: gana el prototipo en
composición, crops, tamaños y ritmo; ganan los docs en rutas, content
collections, i18n, privacidad y stack. El §07 del apéndice lista lo que sigue
abierto y el §03 explica los desvíos deliberados.

**Stack, sin negociación:** Astro 7 salida estática, TypeScript strict, CSS
nativo con tokens propios, GSAP + ScrollTrigger, `astro:assets`, content
collections tipadas, ES por defecto con `/en` estructuralmente equivalente,
deploy en Cloudflare Workers. Nada de React, Tailwind, CMS, base de datos,
formulario de contacto ni backend.

**Fotografía — la regla que arregla el intento anterior.** Todas las fotos son
verticales de 1440px. A pantalla completa se escalan más allá de su resolución,
se pixelan y pierden su relación de aspecto: fue la causa concreta del fracaso
previo. Ninguna foto es fondo. Cada una vive en una placa a su ratio nativo con
un ancho máximo que nunca supera su resolución real. Las capturas de producto van
en marcos `#17181B` con el `aspect-ratio` exacto del archivo. En `astro:assets`
define `widths` que no excedan el original y sirve AVIF/WebP. Esto revoca
explícitamente el full-bleed que pedía `CONCEPT.md` §4.

**GSAP — aquí quiero que superes al prototipo.** El prototipo corre con
IntersectionObserver y transiciones CSS: fija los estados finales, no las
transiciones. El §06 del apéndice traduce cada escena a ScrollTrigger con
trigger, start/end, scrub, propiedades y duración. Impleméntalo así:

- Registra `ScrollTrigger` y `CustomEase`; crea la curva
  `CustomEase.create("signal", "0.22, 1, 0.36, 1")` y ponla como default junto
  con `duration: 0.9`.
- Solo `transform` y `opacity`. Ninguna animación puede tocar layout.
- Scrub únicamente en la escena 03, el parallax de la imagen de apoyo en la 04,
  la foto de la 05 y la barra de progreso. La 03 es la bisagra del concepto: el
  panel de componentes va de torcido a alineado al grid conforme scrolleas, y es
  la única escena donde el movimiento *es* el argumento. Inviértele el tiempo.
- Sin pin en ninguna escena y sin scroll horizontal en evidencia, aunque
  `CONCEPT.md` §6 y §4 los pedían. Razón en el apéndice: el fallo anterior fue
  exceso de animación mal integrada. Si crees que alguno se justifica,
  propónmelo antes de implementarlo.
- El contenido nace visible en el HTML; los from-states los aplica GSAP en
  runtime con `gsap.from()`, nunca CSS estático. Si el JS falla, la página debe
  verse completa.
- Con `prefers-reduced-motion` no se registra ningún ScrollTrigger. Mismas
  escenas, mismas fotos, mismo orden.
- Hover en CSS a `180ms` con la misma curva, no en GSAP.
- Usa `gsap.context()` con cleanup por componente y `ScrollTrigger.refresh()`
  después de que carguen las imágenes, para que los triggers no se
  desalineen cuando `astro:assets` reserve espacio.
- Presupuesto: 60fps en un teléfono de gama media. Si una animación no lo
  cumple, se va.

**Plan que quiero que sigas.** Trabaja en incrementos verticales y párate a
enseñarme cada uno; no construyas las ocho escenas de un tirón.

1. Andamiaje: tokens en CSS, tipografía autoalojada en WOFF2, layout base,
   content collections tipadas, ruta ES y ruta EN vacías pero navegables.
2. Escenas 01 y 08 completas, sin motion. Valida tokens, tipografía y el
   tratamiento de placa fotográfica de punta a punta.
3. Escena 04 con los cuatro casos. Es la más difícil de componer: respeta la
   gramática de captura dominante + captura de apoyo solapada que documenta el
   handoff, y nunca tres capturas.
4. Escenas 02, 03, 05, 06 y 07.
5. Capa de GSAP completa, escena por escena, midiendo en móvil.
6. i18n: aplica el copy EN de `docs/COPY.md`, ya escrito y aprobado.
7. Playwright y deploy.

**Cosas que no debes inventar.** Faltan datos y prefiero un hueco visible a un
dato falso: mi correo de contacto, las URLs de repositorio por proyecto (hoy
todas apuntan a mi perfil) y el caption de la foto de Austria, que `COPY.md`
propone como «ÖBB · Best Data Visualization» pero la imagen muestra constancias
de un hackathon Mobility & AI. Pregúntame cuando llegues ahí. Tampoco afirmes
que Duet está listo para producción: sigue en alpha. `musync` queda en `draft`,
fuera de la home, hasta que tenga material visual.

Corre `npm run check` y `npm run build` antes de darme cada incremento.

Empieza leyendo todo lo anterior y devuélveme un plan del paso 1 antes de
escribir código.
