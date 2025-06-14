import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    web_accessible_resources: [
      {
        resources: ["fonts/*"],
        matches: ["*://*/*"],
      },
    ],
  },
  webExt: {
    startUrls: ["https://wxt.dev"],
  },
});
