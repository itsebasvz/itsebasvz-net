# Capturas de referencia de proyectos

Registro de capturas revisadas el **23 de julio de 2026**. Los archivos fuente
se conservan fuera de este repositorio público. Solo derivados aprobados y
sanitizados podrán incorporarse posteriormente a `src/assets/`.

## Estado general

| Proyecto | Material | Estado editorial |
|---|---|---|
| World Cup CDMX Guide | Hero desktop/mobile + full page de referencia | Listo para componer; Sebastián autorizó mostrar screenshot |
| HackODS | Dashboard público completo | Listo para seleccionar encuadres |
| Hello World | Home público + derivados sanitizados de panel/miembros | Listo para componer |
| Duet | Originales del worker activo y ejecución terminada | Listo para componer |
| musync | Espacio reservado | Pendiente de material |

## World Cup CDMX Guide

**URL:** https://worldcup-cdmx-guide.vercel.app/es

| Archivo | Viewport | Estado |
|---|---:|---|
| Hero desktop ES | 1440 × 1000 | Utilizable como referencia |
| Hero mobile ES | 390 × 844, escala de dispositivo | Utilizable como referencia |
| Full page desktop ES | 1440 × 1000 | Referencia incompleta |
| Full page mobile ES | 390 × 844 | Referencia incompleta |

Las capturas full-page contienen grandes espacios vacíos porque Playwright no
activa por sí solo todas las secciones lazy o ligadas al scroll. No representan
un defecto confirmado del sitio. Para producción conviene capturar cada sección
después de desplazarla al viewport y revisar manualmente marcas, personajes,
datos operativos y permisos de uso.

Sebastián confirmó que el portafolio sí puede mostrar una captura del producto.
Debe conservarse el contexto del internship; no se extraerán assets protegidos
para reutilizarlos fuera de la captura.

## Hello World

**URL:** https://helloworld-unam.tech/

| Archivo | Viewport | Estado |
|---|---:|---|
| Home desktop | 1440 × 1000, full page | Referencia visual completa |
| Home mobile | 390 × 844, full page | Referencia visual completa |

El home público funciona bien como material de contexto. Las métricas visibles
aparecieron en cero durante la captura, por lo que esa sección no debe usarse
como evidencia cuantitativa. Para explicar el alcance real del sistema siguen
haciendo falta capturas sanitizadas del portal de miembros y del panel
administrativo.

El enlace público de Immich permitió descargar los originales:

| Archivo | Dimensiones | Uso propuesto |
|---|---:|---|
| Portal de miembros | 1916 × 1079 | Sistema en uso |
| Panel administrativo | 1919 × 1079 | Alcance operativo |

Antes de producción deben generarse derivados sanitizados. El portal muestra
nombres reales en el ranking y un correo del club; el admin muestra el correo
UNAM de Sebastián. Los originales se conservan intactos como fuente y no deben
publicarse directamente.

Los derivados de producción recortan de forma determinista el encabezado
autenticado, los correos y el ranking. No se reconstruyó ni generó contenido de
interfaz.

## Duet

Sebastián preparó dos vistas: una mientras el worker está ejecutando y otra
después de terminar. Esa pareja es editorialmente adecuada para comunicar
**estado → actividad → resultado** sin inventar un mockup.

El enlace público de Immich permitió descargar los originales:

| Archivo | Dimensiones | Estado |
|---|---:|---|
| Worker activo | 1917 × 1079 | Listo para componer |
| Ejecución terminada | 1918 × 1079 | Listo para componer |

Ambas vistas pueden aparecer como un díptico o una transición de estados. La ruta
local de un proyecto de prueba es visible, pero no contiene un secreto; puede
quedar fuera del crop si distrae.

## HackODS

**URL:** https://hackods.github.io/HackODS2026_linuxitOS/

| Archivo | Viewport | Estado |
|---|---:|---|
| Dashboard desktop | 1440 × 1000, full page | Referencia visual completa |
| Árbol accesible | N/A | Referencia estructural |

La portada del dashboard ya ofrece una secuencia editorial completa: tesis,
indicadores nacionales, contraste rural/urbano, scatter municipal, mapa y
municipios con mayor rezago. La captura full-page carga correctamente. El único
error observado fue un `404` del favicon y no afecta el caso.

Para el portafolio conviene producir tres encuadres:

1. **Hero del caso:** encabezado + indicadores `64% / 55% / 4.6x`.
2. **Sistema / método:** scatter municipal con buscador.
3. **Resultado / territorio:** mapa de cobertura + ranking de rezago.

No hace falta mostrar todo el dashboard a la vez dentro del selected work.

## Reglas de uso

- Registrar URL, idioma, viewport y fecha de cada captura aprobada.
- Ocultar nombres, correos, teléfonos, rutas internas y datos de miembros.
- No tratar una captura automatizada como permiso de uso de marcas de terceros.
- Preferir encuadres por sección sobre páginas completas cuando haya animación,
  contenido lazy o paneles interactivos.
