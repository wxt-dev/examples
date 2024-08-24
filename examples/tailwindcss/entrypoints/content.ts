import type { ContentScriptContext } from "wxt/client";
import "~/assets/tailwind.css";

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",

  async main(ctx) {
    const ui = await createUi(ctx);
    ui.mount();
  },
});

function createUi(ctx: ContentScriptContext) {
  return createShadowRootUi(ctx, {
    name: "tailwind-shadow-root-example",
    position: "inline",
    anchor: "body",
    append: "first",
    onMount: (uiContainer) => {
      const p = document.createElement("p");
      p.classList.add("text-lg", "text-red-500", "font-bold", "p-8");
      p.textContent = "Hello from shadow root with TailwindCSS applied";
      uiContainer.append(p);
    },
  });
}
