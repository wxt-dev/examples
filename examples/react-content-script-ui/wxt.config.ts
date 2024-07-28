import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  runner: {
    startUrls: ["https://google.com"],
  },
  debug:true,
  vite(env) {
    return {
      build: {
        minify:false
      },
    }
  },
});
