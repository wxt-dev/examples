import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: ["storage"],
  },
  webExt: {
    startUrls: ["https://duckduckgo.com/"],
  },
});
