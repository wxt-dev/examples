import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  manifest: {
    action:{},
    permissions: ["offscreen", "activeTab"],
  },
});