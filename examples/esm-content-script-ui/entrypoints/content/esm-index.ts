import { ContentScriptContext } from "wxt/client";
import "./styles.css";

export default async (ctx: ContentScriptContext) => {
  // Just demoing that dynamic imports work and support chunking, see
  // examples/esm-content-script-setup/.output/chrome-mv3/content-scripts/esm
  // This could be a normal import
  const { createShadowRootUi } = await import("wxt/client");
  const stylesText = await fetch(
    browser.runtime.getURL("/content-scripts/esm/style.css"),
  ).then((res) => res.text());
  const ui = await createShadowRootUi(ctx, {
    name: "esm-ui-example",
    position: "inline",
    append: "first",
    onMount(uiContainer, shadow) {
      // Add our ESM styles to shadow root
      const style = document.createElement("style");
      style.textContent = stylesText.replaceAll(":root", ":host");
      shadow.querySelector("head")!.append(style);

      uiContainer.textContent = "ESM UI!";
    },
  });
  ui.mount();
};