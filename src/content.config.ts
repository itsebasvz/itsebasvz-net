import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { mediaAssetIds } from "./data/media-ids";

const localizedText = z.object({
  es: z.string().min(1),
  en: z.string().min(1)
});

const projectCopy = z.object({
  name: localizedText,
  metadata: localizedText,
  thesis: localizedText,
  summary: localizedText,
  case: z.object({
    headline: localizedText,
    context: localizedText,
    system: localizedText,
    contribution: localizedText,
    outcome: localizedText
  }),
  links: z.object({
    demo: localizedText.optional(),
    repository: localizedText.optional(),
    organization: localizedText.optional()
  })
});

const projects = defineCollection({
  loader: glob({
    base: "./src/content/projects",
    pattern: "**/*.yaml"
  }),
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    order: z.number().int().positive(),
    publishState: z.enum(["draft", "ready"]),
    featured: z.boolean(),
    year: z.number().int().positive().optional(),
    status: z.enum(["alpha", "active", "completed", "archived"]).optional(),
    fields: z.array(z.string()),
    technologies: z.array(z.string()),
    badge: localizedText.optional(),
    facts: z.array(
      z.object({
        label: localizedText,
        value: localizedText,
        highlight: z.boolean().optional()
      })
    ),
    links: z.object({
      repository: z.url().optional(),
      demo: z.url().optional(),
      organization: z.url().optional()
    }),
    media: z.array(
      z.object({
        asset: z.enum(mediaAssetIds),
        role: z.enum(["primary", "support", "case"]),
        alt: localizedText,
        caption: localizedText.optional()
      })
    ).min(1),
    copy: projectCopy
  })
});

export const collections = { projects };
