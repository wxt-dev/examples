import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: ["tabs"],
  },
  runner: {
    startUrls: [
      "https://google.com",
      "https://duckduckgo.com",
      "https://wxt.dev",
      "https://vitest.dev/",
      "https://vitejs.dev",
      "https://www.typescriptlang.org/",
      "https://react.dev/",
      "https://vuejs.org/",
      "https://svelte.dev/",
      "https://developer.mozilla.org/",
      "https://stackoverflow.com/",
      "https://figma.com/",
      "https://youtube.com/",
      "https://instagram.com/",
      "https://reddit.com/",
    ],
  },
});
