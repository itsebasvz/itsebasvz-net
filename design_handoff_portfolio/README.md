# Handoff — Portafolio «De señales a sistemas»

**Para:** Claude Code, implementando `itsebasvz/portfolio` en Astro 7.
**De:** sesión de diseño, julio 2026.

---

## 0. Lee esto primero

`Portafolio.dc.html` es **la GRAN referencia de diseño**. No es el producto y no es
código para copiar.

Es un prototipo en HTML que resuelve, con contenido real, todo lo que los `docs/`
dejaban en prosa: composición, jerarquía, escala tipográfica, tratamiento
fotográfico, densidad y estados finales de motion. Tu trabajo es **recrearlo en
Astro 7 + TypeScript strict + CSS nativo + GSAP**, siguiendo las reglas de
`AGENTS.md` y `docs/ARCHITECTURE.md`.

Cuando el prototipo y los `docs/` no coincidan, **gana el prototipo en lo visual**
(composición, crops, tamaños, ritmo) y **ganan los docs en lo estructural**
(rutas, content collections, i18n, privacidad, stack). El apéndice técnico al
final del prototipo documenta cada desvío y por qué se tomó.

### Qué NO hacer

- No portar el HTML tal cual: está escrito con estilos inline por restricciones
  de la herramienta de diseño. En Astro va a CSS nativo con tokens.
- No reintroducir el código anterior del repo. Se descartó por decisión del autor.
- No inventar animaciones fuera de la tabla del §06 del apéndice.
- No usar fotos a pantalla completa. Ver §3 de este documento — es la causa raíz
  del fracaso del intento anterior.

---

## 1. Quién es Sebastián (contexto de marca)

Todo esto sale de `docs/CONCEPT.md` y `docs/COPY.md`, que van incluidos completos.
Resumen operativo para que no tengas que inferirlo:

**Sebastián Vázquez** — ingeniería creativa, Ciudad de México. Estudiante en la
FES Aragón, UNAM. Opera como alguien que lee el entorno, extrae señales y las
convierte en sistemas que funcionan: software, infraestructura, comunidades y
herramientas.

La metáfora de marca es **«De señales a sistemas» / «Signals to Systems»**: el
arte urbano de CDMX (stickers, tipografía pegada, textura de muro) es el
vocabulario visual de origen, no decoración sentimental ni autobiografía.

**Proporción dura: 80% marca-trabajo / 20% autor-firma.** Si una escena empuja
hacia diario personal, se recorta. Esto es un criterio de diseño, no una
sugerencia.

### Trabajo seleccionado (4 featured + 1 draft)

| Proyecto | Qué demuestra | Estado |
|---|---|---|
| **Duet** | Orquestación de agentes; separa razonamiento de ejecución. Autor. AGPL-3.0. | Featured · alpha |
| **World Cup CDMX Guide** | Producto mobile-first bajo presión de evento real. Internship HBS 2026. | Featured · demo pública |
| **Hello World** | Comunidad convertida en infraestructura: sitio + portal + admin. Cofundador, FES Aragón. | Featured · activo |
| **HackODS** | ETL de cinco fuentes públicas sobre desigualdad hídrica. **1er lugar HackODS UNAM 2026**, equipo linuxitOS. | Featured |
| **musync** | Migración de 3,000+ tracks con pipeline reanudable. | **Draft — fuera de la home** |

musync queda en `draft` en el content collection hasta que tenga material visual
al mismo nivel. No lo publiques en la home sin ese material.

### Evidencia profesional

FIFA Host Broadcast Services (intern programme 2026) · HackODS UNAM primer lugar ·
hackathon Mobility & AI en Austria · Hello World como cofundador.

### Reglas de veracidad (de `docs/COPY.md` §9)

- **No afirmar que Duet está listo para producción.** Sigue en alpha.
- No presentar correlaciones como causalidad (aplica al caso HackODS).
- Usar «construyo», «cofundé», «lideré» solo donde la autoría está documentada.
- Nada de «revolucionario», «innovador», «de clase mundial».

### Privacidad (de `docs/ASSETS.md` y `README.md` del repo)

- Los derivados de Hello World ya están sanitizados: sin correos UNAM, sin correo
  del club, sin nombres reales en el ranking. No revertir a los originales.
- No reproducir detalles operativos internos del proyecto World Cup / HBS.
- Solo derivados aprobados entran a `src/assets/`.

---

## 2. Fidelidad

**Alta (hi-fi).** Colores, tipografía, escalas, proporciones y composición son
finales. Recréalos con precisión. Lo que sigue abierto está listado en el §07 del
apéndice del prototipo y en la sección 8 de este documento.

---

## 3. La decisión que arregla el intento anterior

El rediseño previo falló por una razón concreta y medible: **las 20 fotos del
inventario son verticales, 1440px de ancho.** Usadas como fondo full-bleed en
viewport horizontal se escalan a 2–3× su resolución real, se pixelan y pierden
su relación de aspecto.

`docs/CONCEPT.md` §4 pedía full-bleed en las escenas 1, 5, 7 y 8. **Ese punto está
deliberadamente revocado.**

La regla que lo sustituye, y que debes mantener:

> Ninguna foto es fondo. Cada foto vive en una placa a su relación de aspecto
> nativa, con un ancho máximo que nunca supera su resolución real. Las capturas
> de producto van en marcos `#17181B` con `aspect-ratio` exacto del archivo.

Consecuencias prácticas:

- El inventario bajó de 20 imágenes a 10. Las opcionales 06, 07, 15, 17 y 18 no
  entran: el arco se lee mejor sin relleno.
- Se generaron tres crops derivados (ver §7).
- En la banda de evidencia cada placa tiene `flex-grow` proporcional a su ratio,
  de modo que todas terminan a la misma altura sin recortar ninguna. Por debajo
  de 1000px pasa a retícula: la foto 4:3 ocupa el ancho completo y los tres
  retratos 3:4 comparten una fila —al tener el mismo ratio quedan parejos— y por
  debajo de 560px todo cae a una columna. Mezclar 4:3 y 3:4 en columnas de igual
  ancho siempre deja un hueco; no lo hagas.
- Con `astro:assets`, define `widths` que no excedan el original y sirve AVIF/WebP.
  No hagas upscale.

---

## 4. Las 8 escenas

Todas comparten el mismo encabezado: número en `signal`, contador `/ 08`, regla
de 1px que ocupa el espacio libre, y nombre de escena en mono a la derecha.
Contenedor `max-width: 1600px`, gutters `clamp(20px, 3.4vw, 40px)`.

| # | Escena | Composición |
|---|---|---|
| 01 | **Entrada** | Dos columnas. Izquierda: rótulo vertical + eyebrow mono + h1 «De señales / a sistemas.» (punto en `signal`) + propuesta + dos botones. Derecha: placa 3:4 de `signal-wall-05`. |
| 02 | **Campo de señales** | Retícula de 5 tarjetas (LEER · CONSTRUIR · CONECTAR · ABRIR · LANZAR) separadas por hairlines de 1px sobre `#111214`. Debajo: dos placas 3:4 + bloque de tesis «La calle ya es un lenguaje.» |
| 03 | **Señal a interfaz** | Díptico. Izquierda: foto de señal. Derecha: panel con componentes reales del sistema (etiquetas, botones, fila de dato, índice). Es la bisagra del concepto: la única escena con scrub. |
| 04 | **Trabajo seleccionado** | Cuatro `<article>` alternando dirección. Cada uno: columna editorial (número, nombre, badge de estado, metadata, tesis, descripción, tabla de datos, CTA) + par de capturas. |
| 05 | **Ciudad / ecosistema** | Placa 3:4 de `cdmx-blue-hour-16` + titular y tres filas de datos separadas por reglas. |
| 06 | **Evidencia** | Banda de 4 placas con anchos proporcionales al ratio. Captions mono a dos líneas. |
| 07 | **Salida** | Placa 3:4 de `road-signal-20` + una sola línea. Escena de respiración. |
| 08 | **Contacto / firma** | Placa 2:3 de `sebastian-forest-19` + titular, párrafo, tres filas de contacto y línea de firma. |

### Gramática de los casos (escena 04)

Es la parte que peor se veía antes. El patrón, ya resuelto:

- **Una captura dominante** en marco `#17181B` con barra de chrome de 1px arriba
  (tres puntos + label mono con la URL o el estado).
- **Una captura de apoyo** al 86% del ancho, alineada a la izquierda, desplazada
  `margin-left: clamp(-52px, -3.6vw, -16px)` y solapada
  `margin-top: clamp(-30px, -2.4vw, -14px)`, con `box-shadow: 0 0 0 7px #090A0B`
  como calle de separación.
- **Nunca tres capturas.** El caption mono cierra el par.
- World Cup es la excepción: díptico desktop + teléfono a 390/844 con radio 8px —
  el único radio de 8px del sitio, porque representa un dispositivo.

---

## 5. Tokens

Los hex del prototipo difieren ligeramente de `docs/DESIGN.md`. **Usa los del
prototipo**, están calibrados contra las fotos reales.

| Token | Hex | Rol |
|---|---|---|
| `void` | `#090A0B` | Lienzo |
| `paper` | `#F0EDE6` | Texto principal |
| `signal` | `#FF761A` | Acento — ~4% de la superficie |
| `electric` | `#5B8CFF` | Estado de sistema — ~1%. También `:focus-visible` |
| `ash` | `#AAA6A0` | Texto secundario y metadata |
| `graphite` | `#71747A` | Reglas, bordes, segundas líneas |
| `panel` | `#111214` | Tarjetas del campo de señales, apéndice |
| `frame` | `#17181B` | Marcos de captura |

Bordes y reglas: `rgba(113,116,122,0.24)` a `0.3`. Nunca `graphite` sólido.

**Atmósferas por escena.** Cada sección arranca con un `linear-gradient(180deg, …)`
que resuelve la transición en el 12–18% superior, sin corte visible:

```
#090A0B → #0C0B0D → #12090C → #090A0B → #080D17 → #091114 → #0A100B
```

En Astro conviene una custom property por escena e interpolarla con GSAP
(`docs/ARCHITECTURE.md` §10).

### Tipografía

Dos familias. **Instrument Sans** para todo lo que se lee, **JetBrains Mono** solo
metadata. En producción autoalojadas en WOFF2 (en el prototipo van por Google
Fonts). El eje `wdth 92–94` que pide `docs/DESIGN.md` sigue pendiente de validar.

| Rol | Valores |
|---|---|
| display-xl | `clamp(3rem, 7.6vw, 6rem)` / 0.92 / -0.055em / 650 |
| display-lg | `clamp(2.25rem, 5vw, 4.5rem)` / 0.96 / -0.045em / 620 |
| headline-lg | `clamp(2rem, 3.4vw, 3.5rem)` / 1 / -0.035em / 600 |
| body-lg | `clamp(1.125rem, 1.4vw, 1.25rem)` / 1.45 / -0.01em |
| body | `1rem` / 1.55 |
| body-sm | `0.875rem` / 1.5–1.65 |
| label-lg | mono `0.75rem` / 0.1em / mayúsculas / 500 |
| label | mono `0.6875rem` / 0.08em / mayúsculas / 500 |

### Forma

Radio `0` en escenas, placas fotográficas y paneles. `2px` etiquetas. `4px`
botones. Pill solo en badges de estado. `8px` únicamente el teléfono. Sin glass,
sin glow, sin sombras múltiples: la profundidad viene del tono.

Altura de acción mínima `44px`. Base de espaciado 4px. Separación entre escenas
`clamp(80px, 12vh, 152px)`.

---

## 6. Motion

**La tabla completa está en el §06 del apéndice del prototipo** — ábrelo y léela
ahí, tiene trigger, start/end, scrub, pin, propiedades y duración por escena.

Lo esencial:

```js
gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create("signal", "0.22, 1, 0.36, 1");
gsap.defaults({ ease: "signal", duration: 0.9 });
```

- Solo `transform` y `opacity`. Ninguna animación toca layout.
- Scrub **solo** en la escena 03 (la transformación es la tesis), el parallax de
  la imagen de apoyo en la 04, la foto de la 05 y la barra de progreso.
- **Sin pin en ninguna escena** y **sin scroll horizontal** en evidencia, aunque
  `docs/CONCEPT.md` §6 los pedía. Razón en el apéndice.
- El contenido nace visible en el HTML; los from-states los aplica GSAP en runtime
  con `gsap.from()`. Nunca CSS estático, o el sitio sin JS queda en blanco.
- `prefers-reduced-motion`: no se registra ningún ScrollTrigger. Mismas escenas,
  mismas fotos, mismo orden.
- Hover en CSS a `180ms`, no en GSAP.

---

## 7. Assets

Viven en `src/assets/` con la misma ruta que el repo — mapean 1:1.

**Fotografía** (todas 3:4 excepto donde se indica):
`signal-wall-05` · `signal-texture-14-crop` · `signal-wall-08-crop` ·
`signal-wall-09` · `cdmx-blue-hour-16` · `road-signal-20` ·
`sebastian-forest-19` (2:3)

**Evidencia:** `hackods-01` (4:3) · `hbs-02` · `obb-13` · `hello-world-04`

**Capturas** con su `aspect-ratio` exacto:
Duet `1917/1079` y `1918/1079` · World Cup `1440/1000` y `390/844` ·
Hello World `1440/900` y `1100/650` · HackODS `1440/900` y `1440/1050`

### Derivados generados en diseño

No existen en el repo — genéralos o cópialos del proyecto de diseño:

| Archivo | Origen | Razón |
|---|---|---|
| `signal-wall-08-crop.jpg` | `signal-wall-08.jpg` | Se recortó el tercio izquierdo: contenía una palabra altisonante pintada. |
| `signal-texture-14-crop.jpg` | `signal-texture-14.jpg` | Crop de densidad para ganar nitidez a tamaño de placa. |
| `signal-wall-09-crop.jpg` | `signal-wall-09.jpg` | Generado pero **no usado** — el autor prefirió la foto completa. Disponible si el sticker con lenguaje altisonante llega a molestar. |

---

## 8. Pendientes que bloquean el lanzamiento

1. **Correo de contacto** — la escena 08 dice «Por definir». Bloquea el cierre.
2. **URLs de repositorio por proyecto** — hoy todos los «Ver código» apuntan a
   `github.com/itsebasvz`. Bloquea las salidas.
3. **Caption de Austria** — `docs/COPY.md` §4 propone «ÖBB · Best Data
   Visualization»; la foto muestra constancias de participación en un hackathon
   Mobility & AI. Verificar antes de publicar.
4. **Copy EN** — ya escrito y aprobado en `docs/COPY.md`. El prototipo es solo ES;
   el toggle ES/EN está maquetado pero inerte. Aplicar la ruta `/en` equivalente.
5. ~~**Sello / wordmark**~~ — **resuelto.** Barra vertical de 2px en `signal`
   seguida del nombre en Instrument Sans 620 / `-0.025em`. La barra no es un
   símbolo nuevo: es el rótulo vertical del hero y la regla de los encabezados de
   escena, recortados. Favicon y avatar: dos barras de igual altura, `signal` y
   `paper`, sobre `void` — resuelve los 32px sin caer en el monograma que
   `docs/DESIGN.md` prohíbe. Alternativas exploradas en `Sello.dc.html`.
6. **musync** — entra cuando tenga material visual al nivel de los otros cuatro.

---

## 9. Archivos de este paquete

```
Portafolio.dc.html              ← LA REFERENCIA (home). Ábrela en el navegador.
Caso HackODS.dc.html            ← patrón de página de caso, /work/[slug]
src/assets/                     ← imágenes, mismas rutas que el repo
docs/                           ← los 5 docs canónicos, sin modificar
design_handoff_portfolio/
  README.md                     ← este archivo
  CLAUDE.md                     ← para copiar a la raíz del repo
  repo/README.md, repo/AGENTS.md
github.md                       ← trazabilidad de la importación
```

Cada prototipo tiene su apéndice técnico al final. Se apagan con el tweak
`showAppendix` para ver las páginas como las vería un visitante.

Orden de lectura sugerido: este README → `Portafolio.dc.html` con el apéndice
abierto → `Caso HackODS.dc.html` con el suyo → `docs/ARCHITECTURE.md` para el
andamiaje → `docs/COPY.md` para el texto exacto.

### Páginas de caso

`Caso HackODS.dc.html` es el **patrón para las cuatro rutas** `/work/[slug]/`.
Sigue los ocho bloques de `docs/ARCHITECTURE.md` §7.2 en orden, y su apéndice
documenta qué es fijo entre casos y qué cambia (atmósfera, diagrama de tres
módulos, imágenes). Duet, World Cup y Hello World se componen con esa misma
plantilla; el copy de los tres ya está en `docs/COPY.md` §6.

Diferencias deliberadas respecto a la home: sin numeración `/ 08` en los
encabezados de sección (eso pertenece al scrollytelling), header con «Volver a
proyectos», y motion mucho más contenido — solo entradas y barra de progreso,
sin scrub ni parallax, como pide `docs/ARCHITECTURE.md` §11. Un caso se lee, no
se recorre.

La navegación anterior/siguiente nunca debe enlazar a un caso en `draft`: por eso
musync no aparece.
