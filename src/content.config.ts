import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    topics: z.array(z.string()).default([]),
    arxivId: z.string().optional(),
    arxivUrl: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

const changelog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/changelog" }),
  schema: z.object({
    date: z.coerce.date(),
    version: z.string(),
    summary: z.string(),
    changes: z.array(z.string()),
  }),
});

export const collections = { posts, changelog };
