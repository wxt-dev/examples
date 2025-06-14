import { ContentScriptContext } from "#imports";
import "~/assets/style.css";

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",

  async main(ctx) {
    const ui = await createUi(ctx);
    ui.autoMount();
  },
});

function createUi(ctx: ContentScriptContext) {
  return createShadowRootUi(ctx, {
    name: "custom-font-example",
    position: "overlay",
    anchor: "body",
    append: "first",
    onMount(container) {
      // Make UI more visible, not necessary for fonts to work
      container.style.backgroundColor = "white";
      container.style.position = "relative";
      container.style.zIndex = "9999";

      // Create 3 paragraphs with different fonts
      container.appendChild(createP("Default"));
      container.appendChild(createP("Poppins", "font-poppins"));
      container.appendChild(createP("Overpass", "font-overpass"));
    },
  });
}

function createP(text: string, className?: string) {
  const p = document.createElement("p");
  p.textContent = text;
  if (className) p.classList.add(className);
  return p;
}
