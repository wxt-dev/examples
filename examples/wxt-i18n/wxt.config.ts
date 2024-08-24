import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/i18n/module"],
  manifest: {
    name: "__MSG_extension_name__",
    description: "__MSG_extension_description__",
    default_locale: "en",
  },
});
