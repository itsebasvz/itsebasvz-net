# Concepto del portafolio 2026 — «Signals to Systems / De señales a sistemas»

> Documento fundacional de diseño. **Estado: v2** (dirección de marca aprobada, jul 2026).
> Sustituye la v1 «De la terminal a la calle». La v1 queda obsoleta como narrativa principal.
> El inventario fotográfico y el dossier personal se conservan fuera de este
> repositorio público. El Figma parcial anterior es histórico, no canónico.

---

## 1. Posicionamiento

### La idea en una frase

Una marca de **ingeniería creativa** que convierte **señales visuales de la calle** —stickers, texturas, tipografía pegada, ciudad— en **sistemas digitales**, proyectos reales y conexiones humanas. El sitio no cuenta una autobiografía: presenta una firma profesional con personalidad.

### Nombre interno del concepto

| Idioma | Nombre |
|--------|--------|
| EN | **Signals to Systems** |
| ES | **De señales a sistemas** |

Uso: nombre de trabajo del concepto y posible microcopy de marca. No obliga a un wordmark literal en el hero; puede vivir como sello, metadata o línea de firma.

### Tesis

Sebastián Vázquez opera como alguien que **lee el entorno, extrae señales y las convierte en sistemas que funcionan**: software, infraestructura, comunidades y herramientas. La calle de CDMX no es decoración sentimental; es el **vocabulario visual de origen**. El trabajo es el argumento. La persona es la firma.

### Proporción conceptual (regla dura)

| Peso | Capa | Qué muestra |
|-----:|------|-------------|
| **~80%** | Marca / trabajo / capacidad | Propuesta, sistema visual, selected work, evidencia profesional, ecosistema |
| **~20%** | Autor / firma | Nombre, sello, una foto de cierre, contacto, tono |

Si una escena empuja hacia diario personal, se recorta o se mueve fuera del flujo principal.

### Influencias (no copiar)

- **Heat Bureau** — contundencia editorial, composición fuerte, ritmo de página, imagen como argumento.
- **Rauno Freiberg** — precisión interactiva, craft de micro-motion, detalles que se sienten intencionales.
- **Sandra Creates** — personalidad inmediata sin diluir profesionalismo.

El resultado debe sentirse *de Sebastián*, no como pastiche de ninguno de los tres.

---

## 2. Qué dejó de ser verdad (v1 → v2)

| v1 (obsoleto como eje) | v2 (vigente) |
|------------------------|--------------|
| Metáfora principal: terminal → calle | Metáfora principal: **señales → sistemas** |
| Boot con prompt `sebs@LINUXITO` | Entrada editorial sobre foto de stickers + propuesta breve |
| Arco cromático terminal ámbar → blue hour → día soleado | Sistema de tokens de marca (ink / paper / signal / concrete / night / forest) |
| Muro de polaroids sentimentales / “mitad humana” | Stickers como **sistema modular y lenguaje de interfaz** |
| Cita Torvalds + manifiesto personal largo | Evidencia profesional + salida controlada ciudad→bosque + contacto |
| Mono font como voz principal | **Grotesca display** como voz; mono solo metadata |
| Figma como prototipo en progreso | Figma = **archivo histórico parcial**, no fuente de diseño |
| ~50/50 oficio y vida personal | **80/20** marca-trabajo vs autor-firma |

**Qué se conserva de la v1 (útil y vigente):**

- Scroll lineal tipo keynote / scrollytelling.
- Visual-first; copy mínimo; profundidad por enlaces.
- Bilingüe ES/EN desde el día uno.
- Sin chat de IA en v1 del sitio.
- Fotos reales del álbum Immich como base; curaduría consciente de crops.
- Motion validado en código (HTML + GSAP), no en mockups estáticos.
- Naranja/signal como acento de identidad (reencuadrado: ya no “fósforo de terminal”, sino **señal**).
- La calle/CDMX y los stickers como material propio — ahora como **activos de marca**, no como autobiografía.

---

## 3. Principios de diseño

1. **Marca primero, persona como firma.** El visitante debe entender qué construye Sebastián antes de “quién es en su tiempo libre”.
2. **La narrativa se recorre.** Cada escena = composición fuerte + poco texto (una línea, máximo dos). Cero párrafos en el flujo principal.
3. **Las fotos son activos de marca.** No moodboards sentimentales ni álbum familiar. Cada imagen tiene rol: señal, evidencia, ciudad, salida o firma.
4. **Stickers = sistema, no collage caótico.** Retícula, módulos, estados y transformación hacia UI. Craft > acumulación.
5. **Selected work como casos editoriales.** Cada proyecto se presenta con tesis, rol, prueba y salida — no como cards genéricas de CV.
6. **Craft en los detalles.** Micro-interacciones precisas (orden de ~150–250 ms cuando aplique), no espectáculo vacío.
7. **Profesional con carácter.** La personalidad entra por dirección de arte y curaduría, no por confesión.
8. **Bilingüe ES/EN día uno.** Copy corto = traducción de alta calidad viable.
9. **Sin chat de IA en v1.** El foco es la experiencia de marca y el trabajo.
10. **Anti-deriva (ver §11).** Si una idea viola esas reglas, no entra al flujo principal.

---

## 4. Arco de scrollytelling (8 escenas)

Flujo lineal. El scroll es el timeline maestro.

| # | Escena | Rol | Visual principal | Contenido (mínimo) |
|---|--------|-----|------------------|--------------------|
| **1** | **Entrada / señal** | Impacto + propuesta | Full-bleed **foto 05** (muro de stickers #1) | Nombre / sello + **propuesta breve** de marca (ES/EN). No bio larga. |
| **2** | **Campo de señales** | Sistema modular | Stickers de **05 → 08 → 09** (y acento de **14** si aporta) tratados como módulos | Labels del sistema: **BUILD / CONNECT / OPEN / SHIP / LEARN** (u orden final a fijar). Lectura: la calle ya es un lenguaje. |
| **3** | **De señal a interfaz** | Transformación | Morph/composición: sticker → componente UI (botones, cards, nodes, tags) | Una línea que fije la tesis: las señales se vuelven sistemas. |
| **4** | **Selected work** | Prueba de oficio (~núcleo del 80%) | Casos editoriales pinneados, uno tras otro | **Duet · World Cup CDMX Guide / HBS · Hello World · musync · HackODS**. Cada uno: nombre, una línea de tesis, medio visual (mock/screenshot/frame), link de salida. |
| **5** | **Ciudad / ecosistema** | Contexto operativo | Full-bleed **foto 16** (Torre Latino, blue hour) | CDMX como base + ecosistema (homelab/dominios/comunidad técnica) en lectura de sistema, no de tour turístico. |
| **6** | **Evidencia** | Credibilidad | Banda editorial / scroll horizontal breve con **01, 02, 04** + 1–2 de **10–13** (candidata fuerte: **13**) | Captions cortos tipo evidencia (evento, rol, resultado). No montaje sentimental. |
| **7** | **Salida ciudad → afuera** | Respiración controlada | **Foto 20** (camino + señal con stickers/grafiti) | Una línea máxima. Los stickers/señales continúan fuera de la ciudad; el sistema no es solo “lo urbano decorativo”. |
| **8** | **Contacto / firma** | Cierre | **Foto 19** (Sebs en el bosque) como firma visual + panel de contacto limpio | Email, GitHub, LinkedIn, sitio. CTA claro. Sin manifiesto largo. |

### Flujo fotográfico preliminar

```text
05 → 08 → 09 → [proyectos] → 01 / 02 / 04 / 13 → 16 → 20 → 19
```

Acento opcional de textura: **14** en el campo de stickers si el grading lo pide.
Opcionales de respiro (no núcleo): **06, 07, 15, 17, 18** — solo si una transición lo exige; no diluir el arco.

### Curaduría inicial de galería (roles v2)

| Uso | Fotos | Notas |
|-----|-------|-------|
| **Principales** | 05, 08, 09, 14, 16, 20, 19 | Señal, sistema, ciudad, salida, firma |
| **Evidencia** | 01, 02, 04 + elegir 1–2 entre 10–13 | Preferir prueba profesional legible; **13** (Austria/certificados) es candidata fuerte junto a HackODS/FIFA |
| **Opcionales** | 06, 07, 15, 17, 18 | Respiros o descartables sin romper el arco |
| **Crops sensibles** | 09 y muros en general | Evitar groserías o stickers que restan profesionalismo; recortar con intención |

El inventario fotográfico legacy se conserva de forma privada. Los roles de
escena de este documento son los canónicos.

### Selected work — tratamiento editorial

Orden sugerido de casos (ajustable al implementar):

1. **Duet** — orquestación de agentes; economía de tokens; herramienta en uso real.
2. **World Cup CDMX Guide / HBS** — producto bajo presión real de evento; mobile-first; demo pública / repo privado.
3. **Hello World** — fundación + sistema administrativo; liderazgo con software.
4. **musync** — infraestructura personal llevada a herramienta robusta (migración 3k+ tracks).
5. **HackODS** — datos públicos, ETL, 1er lugar; impacto verificable.

Cada caso evita ficha de CV. Estructura mínima:

- Nombre del proyecto
- Una línea de tesis (problema → sistema)
- Medio visual dominante
- Link(s) de profundidad (repo, demo, club)
- Opcional: un dato duro (premio, escala, stack clave)

---

## 5. Sistema visual

### Tokens de color

| Token | Hex | Rol |
|-------|-----|-----|
| **ink** | `#0A0A0A` | Fondo principal / tinta fuerte |
| **paper** | `#EDE8DE` | Superficie clara, texto sobre ink, aire editorial |
| **signal** | `#FF6A00` | Acento de marca, CTAs, foco, “señal” |
| **concrete** | `#77736C` | Secundario, metadata, bordes suaves |
| **night** | `#17213A` | Profundidad ciudad / blue hour controlado |
| **forest** | `#28372A` | Cierre / afuera / foto 19–20, sin caer en “nature brand” genérico |

Uso: el sitio puede vivir mayormente en **ink + paper + signal**; **night** y **forest** entran en tramos de ciudad y salida. Nada de arco “cielo que amanece” como metáfora obligatoria de la v1. Las transiciones de color, si existen, sirven a la marca y a la legibilidad — no a un relato climático.

### Tipografía

| Rol | Dirección | Uso |
|-----|-----------|-----|
| **Display / UI principal** | Grotesca fuerte (editorial, contundente) | Titulares, propuesta, nombres de proyecto |
| **Metadata** | **JetBrains Mono** | Labels, captions técnicos, BUILD/CONNECT/…, hashes, URLs, contadores |
| **Acento (opcional)** | Serif sobria | Solo si aporta contraste editorial puntual; **no** es la voz humana protagonista de la v1 (Fraunces como “alma” queda degradado/opcional) |

La mono **no** viste párrafos ni el hero completo. Es instrumento, no metáfora de terminal.

### Dirección de arte fotográfica

- Fotos principales con tratamiento coherente (grain sutil opcional, grading hacia ink/paper/signal/night/forest).
- Full-bleed en entrada (05), ciudad (16), salida (20) y firma (19) — con veladuras para legibilidad del tipo.
- Evidencia en formato editorial (frames, tiras, captions), no polaroids ladeadas “de recuerdo”.
- Stickers: recorte limpio, sombra controlada, sensación de módulo/pegatina de sistema.
- Prohibido: montaje scrapbook, marcos de foto familiares, overload de stickers sin retícula.

### UI / layout

- Composición editorial con márgenes generosos y jerarquía clara (Heat Bureau como referencia de contundencia, no de copia).
- Grid subyacente siempre, incluso cuando el campo de stickers se sienta orgánico.
- Dark-first natural con ink; paper para contraste y tramos de lectura.
- Responsive desde el día uno: el arco de 8 escenas se mantiene; cambian densidad y triggers, no la tesis.

---

## 6. Sistema de motion

### Stack

- **GSAP** + **ScrollTrigger** (pins selectivos, scrub, timelines)
- Smooth scroll opcional (p. ej. Lenis) si no pelea con accesibilidad ni performance
- SplitText u equivalente solo donde el reveal tipográfico sume
- Sin librerías de “efectos por catálogo”

### Ritmo

| Momento | Comportamiento |
|---------|----------------|
| **Intro** | 1–1.5 s de entrada controlada (carga de señal / hero) y luego el scroll manda |
| **Pin** | Solo donde aporta: **campo de stickers (escena 2)** y **selected work (escena 4)** |
| **Scrub** | Transformaciones de señal→UI y tránsitos de escena ligados al scroll |
| **Evidencia** | Tramo **horizontal breve** (escena 6), no galería infinita |
| **Resto** | Entradas por timeline + scroll; sin pinificar todo el sitio |

### Reglas técnicas

- Animar **transform** y **opacity** (presupuesto 60 fps; evitar layout thrash).
- Nada se anima “porque sí”; cada motion explica jerarquía o transición de tesis.
- **`prefers-reduced-motion`**: variante estática digna desde el día uno (mismas escenas y fotos, sin pins complejos ni scrub crítico).
- Validación: prototipar escenas clave en HTML+GSAP aislado antes de integrar.
- Indicador de progreso: discreto y de marca (puede ser metadata mono); **no** barra imitación terminal tipo `[███░░░░]`.

---

## 7. Contenido y voz

- **Idiomas:** ES y EN desde el día uno.
- **Extensión:** texto mínimo en el flujo; la profundidad vive en enlaces (repos, demos, Hello World, LinkedIn).
- **Tono:** claro, seguro, cercano sin confesar; más estudio de ingeniería creativa que diario.
- **Propuesta breve (escena 1):** «De señales a sistemas. Convierto ideas,
  datos y comunidades en productos digitales que funcionan.» Propuesta v1
  bilingüe documentada en `COPY.md`; pendiente de revisión, no de redacción.
- **No en v1 del sitio:** chat de IA, CV scrollable largo, timeline vital completo, música embebida obligatoria, easter eggs que rompan la lectura profesional en el primer impacto.
- **Firma (20%):** nombre, sello, foto 19, contacto, micro-gesto de personalidad — después de haber demostrado el trabajo.

Contrato editorial propuesto: `COPY.md`. El dossier de hechos y fuentes
personales se conserva fuera del repositorio público; este documento contiene
únicamente las decisiones necesarias para implementar la experiencia.

---

## 8. Assets

### Disponibles

- 20 previews e inventario fotográfico conservados fuera del repositorio público.
- Originales en Immich; exportar únicamente derivados aprobados para producción.
- Capturas públicas preliminares disponibles para World Cup CDMX Guide,
  Hello World y HackODS.
- Originales disponibles para Duet y las vistas privadas de Hello World;
  Hello World requiere derivados sanitizados.
- musync conserva espacio reservado mientras se prepara su material.

### Faltantes (no bloquean el concepto)

- Mockups de alta de cada caso del selected work.
- Posible sello///wordmark simple de marca (nombre o monograma) — diseño pendiente.
- No se requiere foto del rice/terminal como hero; eso era central en v1 y aquí es opcional u omitible.
- Placeholders IA: solo si falta un mock de producto; **no** para inventar biografía visual.

---

## 9. Figma — archivo histórico (no fuente de diseño)

- **Archivo:** «Sebs — Portafolio 2026 · De la terminal a la calle» — https://www.figma.com/design/lQYfuejVWanmmtiTM9fotC
- **Estado:** parcial y **desalineado con la v2**. Moodboard y storyboard exploraban la metáfora terminal→calle, polaroids y tipografía Fraunces como voz humana.
- **Valor residual:** exploración de stickers reales, algunas fotos subidas, y el reflejo de que el material de calle funciona en composición.
- **Uso desde v2:** referencia histórica / archivo. **No** copiar frames, arco de color terminal ni storyboard 1–8 de esa versión como especificación.
- Cualquier prototipo nuevo de UI parte de **este documento + código**, no del Figma v1.

---

## 10. Decisiones cerradas

| Decisión | Estado |
|----------|--------|
| Concepto v2: **Signals to Systems / De señales a sistemas** | ✅ |
| Marca profesional ad hoc (no autobiografía) | ✅ |
| Proporción **80% trabajo-marca / 20% autor-firma** | ✅ |
| Scroll lineal de **8 escenas** según §4 | ✅ |
| Stickers como **sistema modular** (no polaroids sentimentales) | ✅ |
| Selected work: Duet, World Cup CDMX Guide/HBS, Hello World, musync, HackODS | ✅ |
| Fotos núcleo: 05, 08, 09, 14, 16, 20, 19 + evidencia 01, 02, 04, 13 (u otra 10–13) | ✅ |
| Paleta tokenizada ink/paper/signal/concrete/night/forest | ✅ |
| Grotesca display + JetBrains Mono (metadata) | ✅ |
| Motion: GSAP + ScrollTrigger; pin solo stickers y proyectos; intro 1–1.5 s | ✅ |
| ES/EN día uno; sin chat IA en v1 | ✅ |
| Figma v1 = histórico, no canónico | ✅ |
| Terminal **no** es la metáfora principal | ✅ |
| Stack: Astro 7 + TypeScript strict + CSS nativo + GSAP; deploy estático en Cloudflare Workers | ✅ — ver `ARCHITECTURE.md` |
| Wordmark / sello final | ⏳ pendiente |
| Copy ES/EN de propuesta y de cada caso | 🟡 propuesta v1 en `COPY.md`; pendiente de revisión |
| Tipografía: Instrument Sans + JetBrains Mono; sin serif en v1 | ✅ — ver `DESIGN.md` |
| Elección final 1–2 fotos entre 10–13 para evidencia | ⏳ pendiente de curaduría fina |

---

## 11. Criterios anti-deriva

Si una propuesta cae en esto, **se rechaza o se relega fuera del flujo principal**:

1. **No terminal como metáfora principal** — ni boot prompt, ni ámbar “fósforo”, ni barra `[███░░░░]` como identidad.
2. **No polaroids sentimentales / scrapbook** — la evidencia es editorial, no álbum de recuerdos.
3. **No CV largo en el scroll** — ni Starbucks como escena, ni lista de skills, ni párrafos de bio.
4. **No fotos como diario personal** — cada imagen es activo de marca con rol; si solo “cae bien”, sobra.
5. **No chatbot / demo de IA embebida en v1** — el sitio vende criterio y sistemas, no un widget.
6. **No copiar Heat Bureau / Rauno / Sandra** — influencias de método, no skin.
7. **No diluir el 80/20** — si el tramo personal supera la firma, se corta.
8. **No depender del Figma v1** — si choca con este doc, gana este doc.

---

## 12. Pendientes concretos (próximos cierres)

1. Revisar y cerrar la **propuesta breve** ES/EN y las **tesis de los cinco
   proyectos** redactadas en `COPY.md`.
2. Diseñar **sello/wordmark** mínimo (tipográfico basta).
3. Fijar **orden final** de BUILD / CONNECT / OPEN / SHIP / LEARN y su mapping a trabajo real (sin forzar uno-a-uno impostado).
4. Curaduría fina de evidencia: **qué 1–2 fotos de 10–13** entran; crops definitivos de 09.
5. Preparar derivados sanitizados de Hello World, crops de HackODS y
   composiciones de Duet; esperar el material de musync y después cerrar el set
   definitivo de proyectos `featured`.
6. Prototipos HTML+GSAP de: (a) campo de stickers modular, (b) un caso de selected work pinneado, (c) banda horizontal de evidencia.
7. Mantener el inventario fotográfico privado alineado con este documento;
   `CONCEPT.md` manda sobre cualquier rol histórico asignado a una imagen.

---

## 13. Referencias de trabajo

| Referencia | Qué tomar | Qué no tomar |
|------------|-----------|--------------|
| Heat Bureau | Impacto editorial, crop, tipografía contundente | Identidad ajena / tono de estudio extranjero literal |
| Rauno Freiberg | Precisión de interacción, detalle, contención | Aesthetic genérica “dev portfolio dark purple” |
| Sandra Creates | Personalidad inmediata, calidez controlada | Sobre-personalización que coma el 80% de trabajo |
| Material propio | Stickers CDMX, foto 16, evidencia real, proyectos del dossier | Rice/terminal como hero; morado del portafolio viejo; chat Sebs IA |

---

*Fin del documento fundacional v2. Cualquier moodboard, wire o implementación posterior debe poder rastrearse a una sección de este archivo.*
