import type { ShellCopy } from "./types";

export const en = {
  localeName: "English",
  siteName: "Sebastián Vázquez",
  descriptor: "Full-stack developer",
  skipToContent: "Skip to content",
  languageSwitch: "Change language",
  homeTitle: "Sebastián Vázquez — Full-stack developer",
  homeDescription:
    "Computer Engineering student at UNAM. I build systems, tools, and community.",
  home: {
    navigation: {
      label: "Primary navigation",
      work: "Work",
      contact: "Contact"
    },
    hero: {
      sceneLabel: "Entry · Signal",
      verticalLabel: "Signals to systems",
      eyebrow: "Sebastián Vázquez · Full-stack developer · Mexico City",
      headline: ["From signals", "to systems."],
      proposition:
        "Computer Engineering student at UNAM. I build systems, tools, and community.",
      workAction: "Explore the work",
      contactAction: "Get in touch",
      photoAlt:
        "Sticker-covered wall on a Mexico City street, layered with signatures, characters, and pasted typography.",
      photoCaption: "05 · Signal wall",
      photoLocation: "Mexico City",
      ball: {
        label: "Ball",
        hint: "Drag it and let go to throw it, or press Enter to kick it."
      }
    },
    signalField: {
      sceneLabel: "Signal field",
      modules: [
        {
          title: "Read",
          translation: "Leer",
          description: "The problem is almost always bigger than the one I was told."
        },
        {
          title: "Plan",
          translation: "Planear",
          description: "Getting it wrong on paper costs less than getting it wrong in code."
        },
        {
          title: "Build",
          translation: "Construir",
          description: "I would rather have a simple base that holds than a shortcut that does not."
        },
        {
          title: "Share",
          translation: "Compartir",
          description: "If it helped me, it will probably help someone else."
        },
        {
          title: "Ship",
          translation: "Lanzar",
          description: "If the community grows, I grow with it."
        }
      ],
      firstPhoto: {
        alt: "Yellow surface saturated with layered stickers and decals, with hand-drawn typography.",
        caption: "14 · Density · Layer on layer"
      },
      secondPhoto: {
        alt: "Poster pasted on a street wall with a cassette illustration and other printed posters around it.",
        caption: "08 · Module · Pasted composition"
      },
      thesis: "It’s not a methodology, it’s how I work."
    },
    transformation: {
      sceneLabel: "Signal to interface",
      heading: "Signals become systems.",
      photo: {
        alt: "Red and white surface with graffiti marks and illustrated stickers pasted on top.",
        caption: "Signal · Organic source",
        detail: "09"
      },
      panel: {
        tagLabel: "Tag · 2px radius",
        actionLabel: "Action · 44px · 4px radius",
        factLabel: "Project datum",
        indexLabel: "Scene index",
        primaryAction: "Primary",
        secondaryAction: "Secondary",
        sourceLabel: "Sources",
        sourceValue: "5 public",
        outcomeLabel: "Outcome",
        outcomeValue: "1st place",
        footerLeft: "System · Resolved geometry",
        footerRight: "Grid · 0° rotation"
      },
      body:
        "The organic stays in the photograph. The interface brings order: the same modules, the same grid, without rotations or broken borders that imitate a sticker."
    },
    work: {
      sceneLabel: "Selected work",
      heading: "Systems in the real world.",
      summary: "Four different problems. One way of building.",
      status: {
        alpha: "Alpha",
        active: "Active",
        completed: "Completed",
        archived: "Archived"
      }
    },
    city: {
      sceneLabel: "City · Ecosystem",
      heading: "Built in Mexico City. Connected everywhere.",
      body: "Software, community, and infrastructure on the same network.",
      photo: {
        alt: "The Torre Latinoamericana at the end of a street in central Mexico City during blue hour.",
        caption: "16 · Centro · Blue hour",
        detail: "Mexico City"
      },
      details: [
        { label: "Homelab", value: "Self-hosted services in operation" },
        { label: "Domains", value: "Own infrastructure and static deployment" },
        { label: "Community", value: "Hello World · FES Aragón, UNAM" }
      ]
    },
    evidence: {
      sceneLabel: "Evidence",
      heading: "The work leaves evidence.",
      items: [
        {
          id: "hackods",
          alt: "The linuxitOS team with their certificates after winning first place at HackODS UNAM.",
          caption: "HackODS UNAM · 1st place",
          detail: "linuxitOS team · open data"
        },
        {
          id: "austria",
          alt: "Sebastián and his team with participation certificates from the Mobility & AI hackathon in front of a large screen in Austria.",
          caption: "ÖBB · Best Data Visualization",
          detail: "Austria · Mobility & AI"
        },
        {
          id: "hbs",
          alt: "Sebastián sitting in the stadium press room while holding his FIFA Host Broadcast Intern Programme certificate.",
          caption: "HBS · FIFA Host Broadcast",
          detail: "Intern programme · 2026"
        },
        {
          id: "stadium",
          alt: "Mexico City stadium interior filled during a 2026 World Cup match ceremony.",
          caption: "Mexico City stadium · World Cup 2026",
          detail: "Real product context"
        }
      ]
    },
    exit: {
      sceneLabel: "Exit · Beyond the city",
      heading: "The context changes. The way of building remains.",
      photo: {
        alt: "Mountain road with a yellow traffic sign covered in stickers and graffiti, and a person walking along the side.",
        caption: "20 · Signal beyond the city",
        detail: "State of Mexico"
      }
    },
    contact: {
      sceneLabel: "Contact · Signature",
      heading: "Let’s build something that matters.",
      body:
        "If you have an interesting problem, a community ready to grow, or a system that does not exist yet, let’s talk.",
      photoAlt:
        "Sebastián Vázquez crouching beside a stream in the forest and looking toward the water.",
      photoCaption: "19 · Sebastián Vázquez",
      githubLabel: "GitHub",
      githubValue: "itsebasvz",
      linkedInLabel: "LinkedIn",
      linkedInValue: "jsebastianvz",
      emailLabel: "Email",
      emailPending: "To be confirmed · pending"
    },
    footer: {
      tagline: "From signals to systems.",
      location: "Mexico City",
      index: "Index",
      entry: "Entry",
      signalField: "Signal field",
      transformation: "Signal to interface",
      work: "Selected work",
      city: "City and ecosystem",
      evidence: "Evidence",
      exit: "Exit",
      contact: "Contact",
      colophon: "Colophon",
      typography: "Typography",
      stack: "Stack",
      infrastructure: "Infrastructure",
      note:
        "The stickers, textures, and pasted typography of Mexico City are the site's visual vocabulary, not its decoration.",
      backToTop: "Back to top"
    }
  }
} satisfies ShellCopy;
