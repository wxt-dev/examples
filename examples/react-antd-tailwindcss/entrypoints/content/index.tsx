
import { ThemeProvider } from "@/provider/Theme";
import { Button } from "antd";
import { createRoot } from "react-dom/client";

export default defineContentScript({
  matches: ["*://*.example.com/*"],
  cssInjectionMode: "ui",

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: "react-antd-tailwindcss",
      position: "inline",
      anchor: "body",

      onMount: (container, shadow) => {
        const root = createRoot(container);

        root.render(
          <ThemeProvider cssContainer={shadow.querySelector("head") ?? shadow}>
            <Button className="bg-green-100">Button</Button>
          </ThemeProvider>
        );

        return root;
      },
    });

    ui.autoMount();
  },
});