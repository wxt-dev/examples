import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  webExt: {
    startUrls: ["https://www.google.com/"],
  },
  manifest: {
    // Required, don't open popup, only action
    action: {},
  },
});
