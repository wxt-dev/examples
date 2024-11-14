import { CONTENT_SCRIPT_MATCHES } from "@/utils/matches";
import "./style.css";
import { ContentScriptContext } from "wxt/client";

export default defineContentScript({
  // Set "registration" to runtime so this file isn't listed in manifest
  registration: "runtime",
  // URL patterns passed here are automatically added to "host_permissions"
  matches: [CONTENT_SCRIPT_MATCHES],
  // Put the CSS in the shadow root
  cssInjectionMode: "ui",

  async main(ctx) {
    console.log("Content script executed!");

    const ui = await createUi(ctx);
    ui.mount();

    // Optionally, return a value to the background
    return "Hello world!";
  },
});

function createUi(ctx: ContentScriptContext) {
  return createShadowRootUi(ctx, {
    name: "active-tab-ui",
    position: "inline",
    append: "before",
    onMount(container) {
      const app = document.createElement("p");
      app.textContent = "Hello active tab!";
      container.append(app);
    },
  });
}
