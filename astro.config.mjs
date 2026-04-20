import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://casey.ai",
  integrations: [mdx(), sitemap()],

  markdown: {
    shikiConfig: {
      theme: "github-dark-dimmed",
      wrap: true,
    },
  },

  vite: {
    ssr: {
      external: ["better-sqlite3"],
    },
  },

  adapter: cloudflare()
});