import type { ShellCopy } from "./types";

export const es = {
  localeName: "Español",
  siteName: "Sebastián Vázquez",
  descriptor: "Desarrollador full-stack",
  skipToContent: "Saltar al contenido",
  languageSwitch: "Cambiar idioma",
  homeTitle: "Sebastián Vázquez — Desarrollador full-stack",
  homeDescription:
    "Estudiante de Ingeniería en Computación en la UNAM. Construyo sistemas, herramientas y comunidad.",
  home: {
    navigation: {
      label: "Navegación principal",
      work: "Proyectos",
      contact: "Contacto"
    },
    hero: {
      sceneLabel: "Entrada · Señal",
      verticalLabel: "Signals to systems",
      eyebrow: "Sebastián Vázquez · Desarrollador full-stack · CDMX",
      headline: ["De señales", "a sistemas."],
      proposition:
        "Estudiante de Ingeniería en Computación en la UNAM. Construyo sistemas, herramientas y comunidad.",
      workAction: "Ver proyectos",
      contactAction: "Contacto",
      photoAlt:
        "Muro de stickers en una calle de la Ciudad de México: firmas, personajes y tipografía pegada capa sobre capa.",
      photoCaption: "05 · Muro de señales",
      photoLocation: "CDMX",
      ball: {
        label: "Balón",
        hint: "Arrástralo y suéltalo para lanzarlo, o presiona Enter para patearlo."
      }
    },
    signalField: {
      sceneLabel: "Campo de señales",
      modules: [
        {
          title: "Leer",
          translation: "Read",
          description: "Casi siempre el problema va más allá del que me contaron."
        },
        {
          title: "Planear",
          translation: "Plan",
          description: "Equivocarme en papel cuesta menos que equivocarme en código."
        },
        {
          title: "Construir",
          translation: "Build",
          description: "Prefiero una base simple que aguante a un atajo que no."
        },
        {
          title: "Compartir",
          translation: "Share",
          description: "Si me sirvió a mí, probablemente le sirva a alguien más."
        },
        {
          title: "Lanzar",
          translation: "Ship",
          description: "Si la comunidad crece, yo crezco con ella."
        }
      ],
      firstPhoto: {
        alt: "Superficie amarilla saturada de stickers y calcomanías superpuestas, con tipografía dibujada a mano.",
        caption: "14 · Densidad · Capa sobre capa"
      },
      secondPhoto: {
        alt: "Cartel pegado en la calle con la ilustración de un casete y otros carteles impresos alrededor.",
        caption: "08 · Módulo · Composición pegada"
      },
      thesis: "No es una metodología, es cómo trabajo."
    },
    transformation: {
      sceneLabel: "De señal a interfaz",
      heading: "Las señales se vuelven sistemas.",
      photo: {
        alt: "Superficie roja y blanca con trazos de grafiti y stickers ilustrados pegados encima.",
        caption: "Señal · Fuente orgánica",
        detail: "09"
      },
      panel: {
        tagLabel: "Etiqueta · radio 2px",
        actionLabel: "Acción · 44px · radio 4px",
        factLabel: "Dato de proyecto",
        indexLabel: "Índice de escena",
        primaryAction: "Primaria",
        secondaryAction: "Secundaria",
        sourceLabel: "Fuentes",
        sourceValue: "5 públicas",
        outcomeLabel: "Resultado",
        outcomeValue: "1er lugar",
        footerLeft: "Sistema · Geometría resuelta",
        footerRight: "Retícula · Rotación 0°"
      },
      body:
        "Lo orgánico queda en la fotografía. La interfaz aporta el orden: mismos módulos, misma retícula, sin rotaciones ni bordes rotos que imiten un sticker."
    },
    work: {
      sceneLabel: "Trabajo seleccionado",
      heading: "Sistemas en el mundo real.",
      summary: "Cuatro problemas distintos. Una misma forma de construir.",
      status: {
        alpha: "Alpha",
        active: "Activo",
        completed: "Completado",
        archived: "Archivado"
      }
    },
    city: {
      sceneLabel: "Ciudad · Ecosistema",
      heading: "Construido en CDMX. Conectado a todas partes.",
      body: "Software, comunidad e infraestructura bajo una misma red.",
      photo: {
        alt: "Torre Latinoamericana al final de una calle del centro de la Ciudad de México durante la hora azul.",
        caption: "16 · Centro · Hora azul",
        detail: "CDMX"
      },
      details: [
        { label: "Homelab", value: "Servicios self-hosted en operación" },
        { label: "Dominios", value: "Infraestructura propia y despliegue estático" },
        { label: "Comunidad", value: "Hello World · FES Aragón, UNAM" }
      ]
    },
    evidence: {
      sceneLabel: "Evidencia",
      heading: "El trabajo deja evidencia.",
      items: [
        {
          id: "hackods",
          alt: "El equipo linuxitOS con sus constancias tras ganar el primer lugar de HackODS UNAM.",
          caption: "HackODS UNAM · 1er lugar",
          detail: "Equipo linuxitOS · datos abiertos"
        },
        {
          id: "austria",
          alt: "Sebastián y su equipo con constancias de participación del hackathon Mobility & AI frente a una pantalla gigante en Austria.",
          caption: "ÖBB · Best Data Visualization",
          detail: "Austria · Mobility & AI"
        },
        {
          id: "hbs",
          alt: "Sebastián sentado en la sala de prensa del estadio, mostrando su certificado del FIFA Host Broadcast Intern Programme.",
          caption: "HBS · FIFA Host Broadcast",
          detail: "Intern programme · 2026"
        },
        {
          id: "stadium",
          alt: "Interior del estadio de la Ciudad de México lleno durante la ceremonia de un partido del Mundial 2026.",
          caption: "Estadio CDMX · Mundial 2026",
          detail: "Contexto real del producto"
        }
      ]
    },
    exit: {
      sceneLabel: "Salida · Ciudad afuera",
      heading: "El contexto cambia. La forma de construir permanece.",
      photo: {
        alt: "Camino de montaña con una señal vial amarilla cubierta de stickers y grafiti, y una persona caminando por la orilla.",
        caption: "20 · Señal fuera de la ciudad",
        detail: "Edomex"
      }
    },
    contact: {
      sceneLabel: "Contacto · Firma",
      heading: "Construyamos algo que importe.",
      body:
        "Si tienes un problema interesante, una comunidad que hacer crecer o un sistema que todavía no existe, hablemos.",
      photoAlt:
        "Sebastián Vázquez en cuclillas junto a un arroyo en el bosque, mirando hacia el agua.",
      photoCaption: "19 · Sebastián Vázquez",
      githubLabel: "GitHub",
      githubValue: "itsebasvz",
      linkedInLabel: "LinkedIn",
      linkedInValue: "jsebastianvz",
      emailLabel: "Correo",
      emailPending: "Por definir · pendiente"
    },
    footer: {
      tagline: "De señales a sistemas.",
      location: "Ciudad de México",
      index: "Índice",
      entry: "Entrada",
      signalField: "Campo de señales",
      transformation: "De señal a interfaz",
      work: "Trabajo seleccionado",
      city: "Ciudad y ecosistema",
      evidence: "Evidencia",
      exit: "Salida",
      contact: "Contacto",
      colophon: "Colofón",
      typography: "Tipografía",
      stack: "Stack",
      infrastructure: "Infraestructura",
      note:
        "Los stickers, las texturas y la tipografía pegada de CDMX son el vocabulario visual del sitio, no su decoración.",
      backToTop: "Volver arriba"
    }
  }
} satisfies ShellCopy;
