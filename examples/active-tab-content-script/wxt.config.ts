import { defineConfig } from "wxt";
import { CONTENT_SCRIPT_MATCHES } from "./utils/matches";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: ["activeTab", "scripting"],
    action: {},
    web_accessible_resources: [
      // Since the content script isn't listed in the manifest, we have to
      // manually allow the CSS file to load.
      {
        resources: ["/content-scripts/content.css"],
        matches: [CONTENT_SCRIPT_MATCHES],
      },
    ],
  },
  runner: {
    startUrls: ["https://google.com"],
  },
});
