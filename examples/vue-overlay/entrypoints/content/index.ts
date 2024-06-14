import { ContentScriptContext } from "wxt/client";
import App from "./App.vue";
import { createApp } from "vue";
import "./reset.css";

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",

  async main(ctx) {
    const ui = await defineOverlay(ctx);

    // Mount initially
    ui.mount();

    // Re-mount when page changes
    ctx.addEventListener(window, "wxt:locationchange", (event) => {
      ui.mount();
    });
  },
});

function defineOverlay(ctx: ContentScriptContext) {
  return createShadowRootUi(ctx, {
    name: "vue-overlay",
    position: "modal",
    zIndex: 99999,
    onMount(container, _shadow, shadowHost) {
      const app = createApp(App);
      app.mount(container);
      shadowHost.style.pointerEvents = "none";
      return app;
    },
    onRemove(app) {
      app?.unmount();
    },
  });
}
