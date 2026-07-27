export const locales = ["es", "en"] as const;

export type Locale = (typeof locales)[number];

interface PhotoCopy {
  alt: string;
  caption: string;
  detail?: string;
}

interface SignalModuleCopy {
  title: string;
  translation: string;
  description: string;
}

interface EvidenceItemCopy {
  id: "hackods" | "austria" | "hbs" | "stadium";
  alt: string;
  caption: string;
  detail: string;
  pending?: boolean;
}

export interface HomeCopy {
  navigation: {
    label: string;
    work: string;
    contact: string;
  };
  hero: {
    sceneLabel: string;
    verticalLabel: string;
    eyebrow: string;
    headline: [string, string];
    proposition: string;
    workAction: string;
    contactAction: string;
    photoAlt: string;
    photoCaption: string;
    photoLocation: string;
    ball: {
      /** Accessible name of the ball's control. */
      label: string;
      /** How to use it, for screen readers and keyboard users. */
      hint: string;
    };
  };
  signalField: {
    sceneLabel: string;
    modules: SignalModuleCopy[];
    firstPhoto: PhotoCopy;
    secondPhoto: PhotoCopy;
    thesis: string;
  };
  transformation: {
    sceneLabel: string;
    heading: string;
    photo: PhotoCopy;
    panel: {
      tagLabel: string;
      actionLabel: string;
      factLabel: string;
      indexLabel: string;
      primaryAction: string;
      secondaryAction: string;
      sourceLabel: string;
      sourceValue: string;
      outcomeLabel: string;
      outcomeValue: string;
      footerLeft: string;
      footerRight: string;
    };
    body: string;
  };
  work: {
    sceneLabel: string;
    heading: string;
    summary: string;
    status: {
      alpha: string;
      active: string;
      completed: string;
      archived: string;
    };
  };
  city: {
    sceneLabel: string;
    heading: string;
    body: string;
    photo: PhotoCopy;
    details: Array<{
      label: string;
      value: string;
    }>;
  };
  evidence: {
    sceneLabel: string;
    heading: string;
    items: EvidenceItemCopy[];
  };
  exit: {
    sceneLabel: string;
    heading: string;
    photo: PhotoCopy;
  };
  contact: {
    sceneLabel: string;
    heading: string;
    body: string;
    photoAlt: string;
    photoCaption: string;
    githubLabel: string;
    githubValue: string;
    linkedInLabel: string;
    linkedInValue: string;
    emailLabel: string;
    emailPending: string;
  };
  footer: {
    tagline: string;
    location: string;
    index: string;
    entry: string;
    signalField: string;
    transformation: string;
    work: string;
    city: string;
    evidence: string;
    exit: string;
    contact: string;
    colophon: string;
    typography: string;
    stack: string;
    infrastructure: string;
    /** Design note: why the site looks the way it does. */
    note: string;
    backToTop: string;
  };
}

export interface ShellCopy {
  localeName: string;
  siteName: string;
  descriptor: string;
  skipToContent: string;
  languageSwitch: string;
  homeTitle: string;
  homeDescription: string;
  home: HomeCopy;
}
